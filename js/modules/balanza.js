/* =========================================================
   Cuentas Claras MVP
   Módulo de UI: Balanza de comprobación y balanza ajustada
   Fase 7
   ========================================================= */

window.CC_BALANZA = (function () {
  const utils = window.CC_UTILS;
  const motor = window.CC_MAYOR_BALANZA;

  const elements = {};
  let currentCtx = null;
  let currentAccountsMap = null;
  let currentKey = 0;
  let mode = "comprobacion";

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
    const first = clients[0];
    elements.balanzaFiltroCliente.value = first.id;
    loadPeriods(first.id);
    const periods = motor.getPeriodsForClient(first.id);
    if (periods.length) elements.balanzaFiltroPeriodo.value = periods[0].id;
  }

  function prepareContext() {
    const clientId = elements.balanzaFiltroCliente?.value || "";
    const periodoId = elements.balanzaFiltroPeriodo?.value || "";
    if (!clientId || !periodoId) {
      currentCtx = null;
      currentKey = 0;
      return false;
    }
    motor.ensureAccounts();
    currentCtx = motor.buildContext(clientId);
    currentAccountsMap = motor.getAccountsMap();
    const period = currentCtx.periodMap[periodoId];
    currentKey = period ? motor.periodKey(period) : 0;

    const c = window.CC_STORAGE.get("clients", clientId);
    if (elements.balanzaEncabezadoImpresion) {
      elements.balanzaEncabezadoImpresion.textContent =
        `${c ? c.nombreComercial : "Cliente"} · ${motor.periodLabel(period)} · ${mode === "ajustada" ? "Balanza ajustada" : "Balanza de comprobación"} · Generado: ${utils.formatDate(utils.todayISO())}`;
    }
    return currentKey > 0;
  }

  function render() {
    if (!elements.tablaBalanza) return;

    readMode();

    if (!prepareContext()) {
      elements.tablaBalanza.innerHTML = `
        <tr><td colspan="7" class="text-center text-muted py-4">Seleccione un cliente y un periodo.</td></tr>`;
      elements.pieBalanza.classList.add("d-none");
      setIndicator(elements.indicadorMovimientos, elements.iconoMovimientos, false, "Cuadrada", "Sin datos");
      setIndicator(elements.indicadorSaldos, elements.iconoSaldos, false, "Cuadrada", "Sin datos");
      return;
    }

    const result = motor.getTrialBalance(currentCtx, currentAccountsMap, currentKey, {
      includeAdjustments: mode === "ajustada"
    });

    if (!result.rows.length) {
      elements.tablaBalanza.innerHTML = `
        <tr><td colspan="7" class="text-center text-muted py-4">
          No hay movimientos ni saldos. Genere asientos en el Libro Diario.
        </td></tr>`;
      elements.pieBalanza.classList.add("d-none");
      setIndicator(elements.indicadorMovimientos, elements.iconoMovimientos, true, "Cuadrada (sin movimientos)", "Descuadrada");
      setIndicator(elements.indicadorSaldos, elements.iconoSaldos, true, "Cuadrada (sin saldos)", "Descuadrada");
      setAlert("");
      return;
    }

    elements.tablaBalanza.innerHTML = result.rows
      .map((r) => `
        <tr>
          <td><code>${utils.escapeHTML(r.codigo)}</code></td>
          <td><strong>${utils.escapeHTML(r.nombre)}</strong></td>
          <td>${tipoBadge(r.tipo)}</td>
          <td class="text-end">${r.debitos > 0 ? utils.escapeHTML(utils.formatMoney(r.debitos)) : "-"}</td>
          <td class="text-end">${r.creditos > 0 ? utils.escapeHTML(utils.formatMoney(r.creditos)) : "-"}</td>
          <td class="text-end">${r.saldoDeudor > 0 ? utils.escapeHTML(utils.formatMoney(r.saldoDeudor)) : "-"}</td>
          <td class="text-end">${r.saldoAcreedor > 0 ? utils.escapeHTML(utils.formatMoney(r.saldoAcreedor)) : "-"}</td>
        </tr>`)
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

    if (!result.movementsBalanced) {
      setAlert("Atención: los débitos y créditos no cuadran. Revise los asientos del Libro Diario.", "danger");
    } else if (!result.balancesBalanced) {
      setAlert("Atención: los saldos acumulados no cuadran. Puede faltar arrastre de periodos anteriores o naturaleza de cuenta.", "warning");
    } else if (mode === "comprobacion" && result.adjustmentLinesInPeriod > 0) {
      setAlert(`Hay ${result.adjustmentLinesInPeriod} líneas de ajuste en este periodo. Esta vista las excluye. Cambie a Balanza ajustada para verlas.`, "info");
    } else {
      setAlert("");
    }
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
    readMode();
    loadClients();
    autoSelectDefault();
    bindEvents();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { init, render };
})();