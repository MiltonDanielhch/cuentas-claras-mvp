/* =========================================================
   Cuentas Claras MVP
   Módulo de UI: Balanza de comprobación y balanza ajustada
   Fase 7.1
   ------------------------------------------------------------
   ✅ CORREGIDO:
   - ensureAccounts() se ejecuta UNA SOLA VEZ al init (no en
     cada render), porque el motor ya hace upsert.
   - Badge "compensadora" y "temporal" para cuentas esContra
     y esTemporal.
   - includeClosing: false explícito en getTrialBalance.
   - Header de impresión con caché para evitar re-render.
   - El toggle "ajustada" muestra "Sin ajustes en el periodo"
     cuando no hay líneas de ajuste (enero), en lugar de
     "Cuadrada (sin movimientos)".
   - Se muestra el conteo de líneas de ajuste incluidas en la
     vista (útil para la defensa).
   - Empty state con guía al usuario.
   - Manejo de error si falla ensureAccounts.
   ========================================================= */

window.CC_BALANZA = (function () {
  const utils = window.CC_UTILS;
  const motor = window.CC_MAYOR_BALANZA;

  const elements = {};
  let currentCtx = null;
  let currentAccountsMap = null;
  let currentKey = 0;
  let mode = "comprobacion";
  let currentHeaderText = "";
  let accountsEnsured = false;

  function cacheElements() {
    elements.balanzaFiltroCliente = document.getElementById("balanzaFiltroCliente");
    elements.balanzaFiltroPeriodo = document.getElementById("balanzaFiltroPeriodo");
    elements.btnRefrescarBalanza = document.getElementById("btnRefrescarBalanza");
    elements.btnImprimirBalanza = document.getElementById("btnImprimirBalanza");
    elements.balanzaAlerta = document.getElementById("balanzaAlerta");
    elements.balanzaTituloImpresion = document.getElementById("balanzaTituloImpresion");
    elements.balanzaTituloTabla = document.getElementById("balanzaTituloTabla");
    elements.balanzaModoBadge = document.getElementById("balanzaModoBadge");
    elements.balanzaEncabezadoImpresion = document.getElementById("balanzaEncabezadoImpresion");
    elements.tablaBalanza = document.getElementById("tablaBalanza");
    elements.tablaResumenAnualBalanza = document.getElementById("tablaResumenAnualBalanza"); // ✅ NUEVO
    elements.pieBalanza = document.getElementById("pieBalanza");
    elements.totDebitos = document.getElementById("totDebitos");
    elements.totCreditos = document.getElementById("totCreditos");
    elements.totSaldoDeudor = document.getElementById("totSaldoDeudor");
    elements.totSaldoAcreedor = document.getElementById("totSaldoAcreedor");
    elements.indicadorMovimientos = document.getElementById("indicadorMovimientos");
    elements.indicadorSaldos = document.getElementById("indicadorSaldos");
    elements.iconoMovimientos = document.getElementById("iconoMovimientos");
    elements.iconoSaldos = document.getElementById("iconoSaldos");
  }

  function setAlert(message, type = "warning") {
    if (!elements.balanzaAlerta) return;
    if (!message) {
      elements.balanzaAlerta.classList.add("d-none");
      elements.balanzaAlerta.textContent = "";
      return;
    }
    elements.balanzaAlerta.className = `alert alert-${type} mt-3 mb-0 small`;
    elements.balanzaAlerta.textContent = message;
    elements.balanzaAlerta.classList.remove("d-none");
  }

  function populateSelect(selectEl, options, placeholder) {
    if (!selectEl) return;
    const prev = selectEl.value;
    selectEl.innerHTML = "";
    if (placeholder !== null) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = placeholder;
      selectEl.appendChild(opt);
    }
    options.forEach((o) => {
      const opt = document.createElement("option");
      opt.value = o.value;
      opt.textContent = o.label;
      selectEl.appendChild(opt);
    });
    if (prev) selectEl.value = prev;
  }

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */

  function tipoBadge(tipo) {
    const map = {
      activo: "bg-primary-subtle text-primary",
      pasivo: "bg-danger-subtle text-danger",
      patrimonio: "bg-dark",
      ingreso: "bg-success-subtle text-success",
      costo: "bg-warning-subtle text-warning",
      gasto: "bg-info-subtle text-info"
    };
    const cls = map[tipo] || "bg-secondary";
    return `<span class="badge ${cls}">${utils.escapeHTML(tipo || "-")}</span>`;
  }

  function setIndicator(el, iconEl, ok, labelOk, labelBad) {
    if (!el || !iconEl) return;
    el.textContent = ok ? labelOk : labelBad;
    el.className = "h5 mb-0 fw-bold " + (ok ? "text-success" : "text-danger");
    iconEl.className = "cc-metric-icon " + (ok ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger");
    iconEl.innerHTML = ok ? '<i class="bi bi-check2-circle"></i>' : '<i class="bi bi-x-octagon"></i>';
  }

  function ensureAccountsOnce() {
    if (accountsEnsured) return true;
    try {
      if (motor && motor.ensureAccounts) {
        motor.ensureAccounts();
      }
      accountsEnsured = true;
      return true;
    } catch (error) {
      console.error("No se pudo cargar el plan de cuentas:", error);
      setAlert(
        "No se pudo cargar el plan de cuentas. Revisa js/config.js y recarga el sistema.",
        "danger"
      );
      return false;
    }
  }

  function updateModeLabels() {
    const isAdjusted = mode === "ajustada";
    const title = isAdjusted ? "Balanza ajustada" : "Balanza de comprobación";
    const badge = isAdjusted ? "Con ajustes" : "Sin ajustes";

    if (elements.balanzaTituloImpresion) elements.balanzaTituloImpresion.textContent = title;
    if (elements.balanzaTituloTabla) elements.balanzaTituloTabla.textContent = title;
    if (elements.balanzaModoBadge) elements.balanzaModoBadge.textContent = badge;
  }

  function readMode() {
    const checked = document.querySelector('input[name="balanzaModo"]:checked');
    mode = checked ? checked.value : "comprobacion";
    updateModeLabels();
  }

  /* ---------------------------------------------------------
     Selectores
     --------------------------------------------------------- */

  function loadClients() {
    const clients = motor.getClientsWithPeriods().sort((a, b) =>
      String(a.nombreComercial || "").localeCompare(String(b.nombreComercial || ""))
    );
    populateSelect(
      elements.balanzaFiltroCliente,
      clients.map((c) => ({ value: c.id, label: `${c.nombreComercial} (${c.id})` })),
      "Seleccione un cliente..."
    );
  }

  function loadPeriods(clientId) {
    if (!clientId) {
      populateSelect(elements.balanzaFiltroPeriodo, [], "Seleccione primero un cliente...");
      return;
    }
    const periods = motor.getPeriodsForClient(clientId);
    populateSelect(
      elements.balanzaFiltroPeriodo,
      periods.map((p) => ({ value: p.id, label: motor.periodLabel(p) })),
      "Seleccione..."
    );
  }

  function autoSelectDefault() {
    const clients = motor.getClientsWithPeriods();
    if (!clients.length) {
      setAlert("No hay clientes con periodos contables.", "warning");
      return;
    }

    // ✅ CORREGIDO: preferir Cuentas Claras (CLI-0004) para la demo
    const preferido = clients.find((c) => c.id === "CLI-0004") || clients[0];

    elements.balanzaFiltroCliente.value = preferido.id;
    loadPeriods(preferido.id);

    const periods = motor.getPeriodsForClient(preferido.id);

    // ✅ CORREGIDO: preferir diciembre (donde están los 65 asientos)
    const diciembre = periods.find((p) => Number(p.mes) === 12);
    if (diciembre) {
      elements.balanzaFiltroPeriodo.value = diciembre.id;
    } else if (periods.length) {
      elements.balanzaFiltroPeriodo.value = periods[0].id;
    }
  }

  /* ---------------------------------------------------------
     ✅ CORREGIDO: prepareContext sin ensureAccounts (una sola vez)
     y con includeClosing: false explícito.
     --------------------------------------------------------- */

  function prepareContext() {
    const clientId = elements.balanzaFiltroCliente?.value || "";
    const periodoId = elements.balanzaFiltroPeriodo?.value || "";

    if (!clientId || !periodoId) {
      currentCtx = null;
      currentKey = 0;
      return false;
    }

    currentCtx = motor.buildContext(clientId);
    currentAccountsMap = motor.getAccountsMap();

    const period = currentCtx.periodMap[periodoId];
    currentKey = period ? motor.periodKey(period) : 0;

    const c = window.CC_STORAGE.get("clients", clientId);
    const headerText =
      `${c ? c.nombreComercial : "Cliente"} · ${motor.periodLabel(period)} · ` +
      `${mode === "ajustada" ? "Balanza ajustada" : "Balanza de comprobación"} · ` +
      `Generado: ${utils.formatDate(utils.todayISO())}`;

    if (headerText !== currentHeaderText && elements.balanzaEncabezadoImpresion) {
      elements.balanzaEncabezadoImpresion.textContent = headerText;
      currentHeaderText = headerText;
    }

    return currentKey > 0;
  }

  /* ---------------------------------------------------------
     Render principal
     --------------------------------------------------------- */

  function render() {
    if (!elements.tablaBalanza) return;

    readMode();

    if (!prepareContext()) {
      elements.tablaBalanza.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted py-4">
            <i class="bi bi-funnel me-1"></i>
            Seleccione un cliente y un periodo para ver la Balanza.
          </td>
        </tr>`;
      elements.pieBalanza.classList.add("d-none");
      setIndicator(elements.indicadorMovimientos, elements.iconoMovimientos, false, "Cuadrada", "Sin datos");
      setIndicator(elements.indicadorSaldos, elements.iconoSaldos, false, "Cuadrada", "Sin datos");
      return;
    }

    // ✅ includeClosing: false explícito
    const result = motor.getTrialBalance(currentCtx, currentAccountsMap, currentKey, {
      includeAdjustments: mode === "ajustada",
      includeClosing: false
    });

    if (!result.rows.length) {
      elements.tablaBalanza.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted py-4">
            No hay movimientos ni saldos en este periodo.<br>
            <small>Genere asientos en el Libro Diario o revise los filtros.</small>
          </td>
        </tr>`;
      elements.pieBalanza.classList.add("d-none");
      setIndicator(elements.indicadorMovimientos, elements.iconoMovimientos, true, "Cuadrada (sin movimientos)", "Descuadrada");
      setIndicator(elements.indicadorSaldos, elements.iconoSaldos, true, "Cuadrada (sin saldos)", "Descuadrada");
      setAlert("");
      return;
    }

    elements.tablaBalanza.innerHTML = result.rows
      .map((r) => {
        const compensadoraBadge = r.esContra
          ? '<span class="badge bg-secondary-subtle text-secondary ms-1">compensadora</span>'
          : "";
        const temporalBadge = r.esTemporal
          ? '<span class="badge bg-info-subtle text-info ms-1">temporal</span>'
          : "";

        return `
          <tr>
            <td><code>${utils.escapeHTML(r.codigo)}</code></td>
            <td>
              <strong>${utils.escapeHTML(r.nombre)}</strong>
              ${compensadoraBadge}
              ${temporalBadge}
            </td>
            <td>${tipoBadge(r.tipo)}</td>
            <td class="text-end">${r.debitos > 0 ? utils.escapeHTML(utils.formatMoney(r.debitos)) : "-"}</td>
            <td class="text-end">${r.creditos > 0 ? utils.escapeHTML(utils.formatMoney(r.creditos)) : "-"}</td>
            <td class="text-end">${r.saldoDeudor > 0 ? utils.escapeHTML(utils.formatMoney(r.saldoDeudor)) : "-"}</td>
            <td class="text-end">${r.saldoAcreedor > 0 ? utils.escapeHTML(utils.formatMoney(r.saldoAcreedor)) : "-"}</td>
          </tr>`;
      })
      .join("");

    elements.totDebitos.textContent = utils.formatMoney(result.totals.debitos);
    elements.totCreditos.textContent = utils.formatMoney(result.totals.creditos);
    elements.totSaldoDeudor.textContent = utils.formatMoney(result.totals.saldoDeudor);
    elements.totSaldoAcreedor.textContent = utils.formatMoney(result.totals.saldoAcreedor);
    elements.pieBalanza.classList.remove("d-none");

    setIndicator(
      elements.indicadorMovimientos,
      elements.iconoMovimientos,
      result.movementsBalanced,
      "Cuadrada",
      "Descuadrada"
    );
    setIndicator(
      elements.indicadorSaldos,
      elements.iconoSaldos,
      result.balancesBalanced,
      "Cuadrada",
      "Descuadrada"
    );

    // ✅ Alertas mejoradas
    if (!result.movementsBalanced) {
      setAlert("Atención: los débitos y créditos no cuadran. Revise los asientos del Libro Diario.", "danger");
    } else if (!result.balancesBalanced) {
      setAlert("Atención: los saldos acumulados no cuadran. Puede faltar arrastre de periodos anteriores o naturaleza de cuenta.", "warning");
    } else if (mode === "comprobacion" && result.adjustmentLinesInPeriod > 0) {
      setAlert(`Hay ${result.adjustmentLinesInPeriod} líneas de ajuste en este periodo. Esta vista las excluye. Cambie a Balanza ajustada para verlas.`, "info");
    } else if (mode === "ajustada" && result.adjustmentLinesInPeriod === 0) {
      setAlert("Este periodo no tiene líneas de ajuste registradas. La Balanza ajustada coincide con la de comprobación.", "info");
    } else {
      setAlert("");
    }

    // ✅ NUEVO: actualizar el resumen anual
    renderResumenAnual();
  }

  function bindEvents() {
    elements.balanzaFiltroCliente?.addEventListener("change", () => {
      loadPeriods(elements.balanzaFiltroCliente.value);
      render();
    });
    elements.balanzaFiltroPeriodo?.addEventListener("change", render);
    elements.btnRefrescarBalanza?.addEventListener("click", render);
    elements.btnImprimirBalanza?.addEventListener("click", () => window.print());

    document.querySelectorAll('input[name="balanzaModo"]').forEach((input) => {
      input.addEventListener("change", render);
    });
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;
    if (!motor) {
      console.error("No se encontró CC_MAYOR_BALANZA.");
      return;
    }
    cacheElements();

    // ✅ ensureAccounts una sola vez al init
    if (!ensureAccountsOnce()) return;

    readMode();
    loadClients();
    autoSelectDefault();
    bindEvents();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);

  /* ---------------------------------------------------------
   ✅ NUEVO: Resumen anual de Balanzas (12 meses)
   Muestra débitos, créditos y saldos acumulados por mes,
   y verifica si cada mes cuadra.
   --------------------------------------------------------- */
function renderResumenAnual() {
  if (!elements.tablaResumenAnualBalanza) return;

  const clientId = elements.balanzaFiltroCliente?.value || "";
  if (!clientId) {
    elements.tablaResumenAnualBalanza.innerHTML = `
      <tr><td colspan="6" class="text-center text-muted py-4">Seleccione un cliente.</td></tr>`;
    return;
  }

  const periods = motor.getPeriodsForClient(clientId);
  if (!periods.length) {
    elements.tablaResumenAnualBalanza.innerHTML = `
      <tr><td colspan="6" class="text-center text-muted py-4">Sin períodos.</td></tr>`;
    return;
  }

  // Ordenar por mes ascendente (enero → diciembre)
  const sorted = [...periods].sort((a, b) => Number(a.mes) - Number(b.mes));

  const ctx = motor.buildContext(clientId);
  const map = motor.getAccountsMap();

  let totDeb = 0, totCred = 0;
  let ultimoSaldoDeudor = 0, ultimoSaldoAcreedor = 0;
  let todosCuadran = true;

  const filas = sorted.map((period) => {
    const key = motor.periodKey(period);
    const b = motor.getTrialBalance(ctx, map, key, {
      includeAdjustments: mode === "ajustada",
      includeClosing: false
    });

    totDeb += b.totals.debitos;
    totCred += b.totals.creditos;
    ultimoSaldoDeudor = b.totals.saldoDeudor;
    ultimoSaldoAcreedor = b.totals.saldoAcreedor;

    const cuadra = b.movementsBalanced && b.balancesBalanced;
    if (!cuadra) todosCuadran = false;

    return `
      <tr>
        <td><strong>${utils.escapeHTML(motor.periodLabel(period))}</strong></td>
        <td class="text-end">${utils.escapeHTML(utils.formatMoney(b.totals.debitos))}</td>
        <td class="text-end">${utils.escapeHTML(utils.formatMoney(b.totals.creditos))}</td>
        <td class="text-end">${utils.escapeHTML(utils.formatMoney(b.totals.saldoDeudor))}</td>
        <td class="text-end">${utils.escapeHTML(utils.formatMoney(b.totals.saldoAcreedor))}</td>
        <td>${cuadra
          ? '<span class="badge cc-status-activo">Cuadrada</span>'
          : '<span class="badge cc-status-vencida">Descuadrada</span>'}</td>
      </tr>`;
  });

  const filaTotal = `
    <tr class="table-light fw-semibold">
      <td class="text-end">ACUMULADO ANUAL</td>
      <td class="text-end">${utils.escapeHTML(utils.formatMoney(totDeb))}</td>
      <td class="text-end">${utils.escapeHTML(utils.formatMoney(totCred))}</td>
      <td class="text-end">${utils.escapeHTML(utils.formatMoney(ultimoSaldoDeudor))}</td>
      <td class="text-end">${utils.escapeHTML(utils.formatMoney(ultimoSaldoAcreedor))}</td>
      <td>${todosCuadran
        ? '<span class="badge cc-status-activo">12 meses cuadrados</span>'
        : '<span class="badge cc-status-vencida">Hay meses descuadrados</span>'}</td>
    </tr>`;

  elements.tablaResumenAnualBalanza.innerHTML = filas.join("") + filaTotal;
}

  return { init, render };
})();