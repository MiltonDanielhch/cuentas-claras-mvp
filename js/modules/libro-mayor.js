/* =========================================================
   Cuentas Claras MVP
   Módulo de UI: Libro Mayor
   Fase 6.1
   ------------------------------------------------------------
   ✅ CORREGIDO:
   - Eliminado código muerto (const client = currentCtx ? null : null).
   - ensureAccounts() se ejecuta UNA SOLA VEZ al init (no en cada
     render), porque el motor ya hace upsert.
   - getClientName() movida al área de helpers (antes se usaba antes
     de definirse, aunque funcionaba por hoisting).
   - Footer con badge de "Cuadrado/Descuadrado" para verificar la
     partida doble del periodo.
   - Badge "temporal" para cuentas de resultado (se cierran al año).
   - Badge "(compensadora)" visible en la celda de saldo para cuentas
     esContra (depreciación acumulada, amortización, etc.).
   - Empty state mejorado con guía al usuario.
   - Manejo de error si el plan de cuentas no se puede cargar.
   - Encabezado de impresión se actualiza solo cuando cambia el contexto.
   ========================================================= */

window.CC_LIBRO_MAYOR = (function () {
  const utils = window.CC_UTILS;
  const motor = window.CC_MAYOR_BALANZA;

  const elements = {};
  let currentCtx = null;
  let currentAccountsMap = null;
  let currentKey = 0;
  let currentHeaderText = ""; // ✅ para no re-renderizar el encabezado si no cambió
  let accountsEnsured = false; // ✅ para llamar a ensureAccounts una sola vez

  function round2(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }
  
  function cacheElements() {
    elements.mayorFiltroCliente = document.getElementById("mayorFiltroCliente");
    elements.mayorFiltroPeriodo = document.getElementById("mayorFiltroPeriodo");
    elements.btnRefrescarMayor = document.getElementById("btnRefrescarMayor");
    elements.btnImprimirMayor = document.getElementById("btnImprimirMayor");
    elements.mayorAlerta = document.getElementById("mayorAlerta");
    elements.mayorEncabezadoImpresion = document.getElementById("mayorEncabezadoImpresion");
    elements.tablaMayorResumen = document.getElementById("tablaMayorResumen");
    elements.tablaResumenAnualCuenta = document.getElementById("tablaResumenAnualCuenta"); // ✅ NUEVO
    elements.fichaCuentaCard = document.getElementById("fichaCuentaCard");
    elements.fichaCuentaTitulo = document.getElementById("fichaCuentaTitulo");
    elements.fichaCuentaContenido = document.getElementById("fichaCuentaContenido");
    elements.btnCerrarFicha = document.getElementById("btnCerrarFicha");
  }

  function setAlert(message, type = "warning") {
    if (!elements.mayorAlerta) return;
    if (!message) {
      elements.mayorAlerta.classList.add("d-none");
      elements.mayorAlerta.textContent = "";
      return;
    }
    elements.mayorAlerta.className = `alert alert-${type} mt-3 mb-0 small`;
    elements.mayorAlerta.textContent = message;
    elements.mayorAlerta.classList.remove("d-none");
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
     ✅ Helpers
     --------------------------------------------------------- */

  function getClientName(clientId) {
    const c = window.CC_STORAGE.get("clients", clientId);
    return c ? c.nombreComercial : "Cliente";
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

  function natureLabel(naturaleza) {
    return naturaleza === "deudora" ? "Deudora" : "Acreedora";
  }

  /* ---------------------------------------------------------
     ✅ CORREGIDO: balanceCell simplificado
     La condición "abnormal" es equivalente a v < 0 para ambas
     naturalezas (porque el saldo siempre se devuelve neto).
     --------------------------------------------------------- */
  function balanceCell(value, esContra = false) {
    const v = Number(value) || 0;
    const abnormal = v < 0;

    const cls = abnormal ? "text-danger fw-semibold" : "fw-semibold";

    let tag = "";
    if (abnormal) {
      tag = ' <small class="text-danger">(contrario)</small>';
    } else if (esContra) {
      tag = ' <small class="text-muted">(compensadora)</small>';
    }

    return `<span class="${cls}">${utils.escapeHTML(utils.formatMoney(Math.abs(v)))}</span>${tag}`;
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

  /* ---------------------------------------------------------
     Selectores
     --------------------------------------------------------- */

  function loadClients() {
    const clients = motor.getClientsWithPeriods().sort((a, b) =>
      String(a.nombreComercial || "").localeCompare(String(b.nombreComercial || ""))
    );

    populateSelect(
      elements.mayorFiltroCliente,
      clients.map((c) => ({ value: c.id, label: `${c.nombreComercial} (${c.id})` })),
      "Seleccione un cliente..."
    );
  }

  function loadPeriods(clientId) {
    if (!clientId) {
      populateSelect(elements.mayorFiltroPeriodo, [], "Seleccione primero un cliente...");
      return;
    }
    const periods = motor.getPeriodsForClient(clientId);
    populateSelect(
      elements.mayorFiltroPeriodo,
      periods.map((p) => ({ value: p.id, label: motor.periodLabel(p) })),
      "Seleccione..."
    );
  }

  function autoSelectDefault() {
    const clients = motor.getClientsWithPeriods();

    if (!clients.length) {
      setAlert(
        "No hay clientes con periodos contables. Cree un periodo en el módulo Periodos.",
        "warning"
      );
      return;
    }

    // ✅ CORREGIDO: preferir Cuentas Claras (CLI-0004) para la demo
    const preferido = clients.find((c) => c.id === "CLI-0004") || clients[0];

    elements.mayorFiltroCliente.value = preferido.id;
    loadPeriods(preferido.id);

    const periods = motor.getPeriodsForClient(preferido.id);

    // ✅ CORREGIDO: preferir diciembre (donde están los 65 asientos)
    const diciembre = periods.find((p) => Number(p.mes) === 12);
    if (diciembre) {
      elements.mayorFiltroPeriodo.value = diciembre.id;
    } else if (periods.length) {
      elements.mayorFiltroPeriodo.value = periods[0].id;
    }
  }

  /* ---------------------------------------------------------
     ✅ CORREGIDO: prepareContext sin ensureAccounts (se hace
     una sola vez al init) y sin código muerto.
     --------------------------------------------------------- */

  function prepareContext() {
    const clientId = elements.mayorFiltroCliente?.value || "";
    const periodoId = elements.mayorFiltroPeriodo?.value || "";

    if (!clientId || !periodoId) {
      currentCtx = null;
      currentKey = 0;
      return false;
    }

    currentCtx = motor.buildContext(clientId);
    currentAccountsMap = motor.getAccountsMap();

    const period = currentCtx.periodMap[periodoId];
    currentKey = period ? motor.periodKey(period) : 0;

    // ✅ Solo actualiza el encabezado si cambió (evita re-render)
    const clientName = getClientName(clientId);
    const periodLabel = motor.periodLabel(period);
    const headerText = `${clientName} · ${periodLabel} · Generado: ${utils.formatDate(utils.todayISO())}`;

    if (headerText !== currentHeaderText && elements.mayorEncabezadoImpresion) {
      elements.mayorEncabezadoImpresion.textContent = headerText;
      currentHeaderText = headerText;
    }

    return currentKey > 0;
  }

  /* ---------------------------------------------------------
     Render principal
     --------------------------------------------------------- */

  function renderSummary() {
    if (!elements.tablaMayorResumen) return;

    if (!prepareContext()) {
      elements.tablaMayorResumen.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted py-4">
            <i class="bi bi-funnel me-1"></i>
            Seleccione un cliente y un periodo para ver el Libro Mayor.
          </td>
        </tr>`;
      hideFicha();
      return;
    }

    const rows = motor.getAccountSummaryRows(currentCtx, currentAccountsMap, currentKey);

    if (!rows.length) {
      elements.tablaMayorResumen.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted py-4">
            No hay movimientos ni saldos en este periodo.<br>
            <small>Genere asientos en el Libro Diario o revise los filtros.</small>
          </td>
        </tr>`;
      hideFicha();
      return;
    }

    let totDeb = 0;
    let totCred = 0;

    const rowsHtml = rows.map((r) => {
      totDeb += r.debitos;
      totCred += r.creditos;

      const compensadoraBadge = r.esContra
        ? '<span class="badge bg-secondary-subtle text-secondary ms-1">compensadora</span>'
        : "";

      const temporalBadge = r.esTemporal
        ? '<span class="badge bg-info-subtle text-info ms-1">temporal</span>'
        : "";

      return `
        <tr class="cursor-pointer" data-action="ver-cuenta" data-code="${utils.escapeHTML(r.codigo)}">
          <td><code>${utils.escapeHTML(r.codigo)}</code></td>
          <td>
            <strong>${utils.escapeHTML(r.nombre)}</strong>
            ${compensadoraBadge}
            ${temporalBadge}
          </td>
          <td>${tipoBadge(r.tipo)}</td>
          <td>${utils.escapeHTML(natureLabel(r.naturaleza))}</td>
          <td class="text-end">${balanceCell(r.saldoInicial, r.esContra)}</td>
          <td class="text-end">${utils.escapeHTML(utils.formatMoney(r.debitos))}</td>
          <td class="text-end">${utils.escapeHTML(utils.formatMoney(r.creditos))}</td>
          <td class="text-end">${balanceCell(r.saldoFinal, r.esContra)}</td>
          <td class="text-end no-print">
            <button class="btn btn-outline-primary btn-sm" type="button"
              data-action="ver-cuenta" data-code="${utils.escapeHTML(r.codigo)}">
              <i class="bi bi-journal-text"></i> Ficha
            </button>
          </td>
        </tr>`;
    }).join("");

    // ✅ Footer con indicador de cuadre
    const totDebR = motor.round2(totDeb);
    const totCredR = motor.round2(totCred);
    const balanced = Math.abs(totDebR - totCredR) <= 0.01;

    const cuadreBadge = balanced
      ? '<span class="badge cc-status-activo">Cuadrado</span>'
      : '<span class="badge cc-status-vencida">Descuadrado</span>';

    const foot = `
      <tr class="table-light fw-semibold">
        <td colspan="4" class="text-end">Totales del periodo</td>
        <td class="text-end">—</td>
        <td class="text-end">${utils.escapeHTML(utils.formatMoney(totDebR))}</td>
        <td class="text-end">${utils.escapeHTML(utils.formatMoney(totCredR))}</td>
        <td class="text-end">${cuadreBadge}</td>
        <td class="no-print"></td>
      </tr>`;

    elements.tablaMayorResumen.innerHTML = rowsHtml + foot;
  
    // ✅ NUEVO: actualizar el resumen anual
    renderResumenAnualPorCuenta();
  }

  /* ---------------------------------------------------------
     Ficha de cuenta
     --------------------------------------------------------- */

  function hideFicha() {
    if (elements.fichaCuentaCard) elements.fichaCuentaCard.classList.add("d-none");
  }

  function renderFicha(code) {
    if (!currentCtx) return;

    const ledger = motor.getLedger(currentCtx, currentAccountsMap, code, currentKey);

    if (!ledger) {
      utils.showToast("Cuenta no encontrada.", "danger");
      return;
    }

    elements.fichaCuentaTitulo.textContent =
      `Ficha de Mayor · ${ledger.account.codigo} - ${ledger.account.nombre}`;

    const rowsHtml = ledger.rows.length
      ? ledger.rows.map((row) => `
          <tr>
            <td>${utils.escapeHTML(utils.formatDate(row.fecha))}</td>
            <td><code>${utils.escapeHTML(row.folio || "-")}</code></td>
            <td>${utils.escapeHTML(row.referencia || "-")}</td>
            <td>${utils.escapeHTML(row.tercero || "-")}</td>
            <td class="text-end">${row.debito > 0 ? utils.escapeHTML(utils.formatMoney(row.debito)) : "-"}</td>
            <td class="text-end">${row.credito > 0 ? utils.escapeHTML(utils.formatMoney(row.credito)) : "-"}</td>
            <td class="text-end fw-semibold">${balanceCell(row.saldo, ledger.account.esContra)}</td>
            <td>${utils.escapeHTML(row.observacion || "-")}</td>
          </tr>`).join("")
      : `<tr><td colspan="8" class="text-center text-muted py-3">Sin movimientos en el periodo (solo arrastre de saldo inicial).</td></tr>`;

    elements.fichaCuentaContenido.innerHTML = `
      <div class="row g-2 mb-3">
        <div class="col-6 col-md-3">
          <div class="border rounded p-2">
            <small class="text-muted d-block">Saldo inicial</small>
            <strong>${balanceCell(ledger.saldoInicial, ledger.account.esContra)}</strong>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="border rounded p-2">
            <small class="text-muted d-block">Débitos del periodo</small>
            <strong>${utils.escapeHTML(utils.formatMoney(ledger.debitos))}</strong>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="border rounded p-2">
            <small class="text-muted d-block">Créditos del periodo</small>
            <strong>${utils.escapeHTML(utils.formatMoney(ledger.creditos))}</strong>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="border rounded p-2">
            <small class="text-muted d-block">Saldo final</small>
            <strong>${balanceCell(ledger.saldoFinal, ledger.account.esContra)}</strong>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Fecha</th><th>Folio</th><th>Referencia</th><th>Tercero</th>
              <th class="text-end">Débito</th><th class="text-end">Crédito</th>
              <th class="text-end">Saldo</th><th>Observación</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>

      <p class="small text-muted mt-2 mb-0">
        Naturaleza: ${utils.escapeHTML(natureLabel(ledger.naturaleza))}.
        ${ledger.account.esContra ? "Cuenta compensadora." : ""}
        ${ledger.account.esTemporal ? "Cuenta temporal (se cierra al año)." : ""}
        El saldo se presenta como positivo cuando es de la naturaleza normal de la cuenta.
      </p>`;

    elements.fichaCuentaCard.classList.remove("d-none");
    elements.fichaCuentaCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------------------------------------------------------
     Eventos
     --------------------------------------------------------- */

  function bindEvents() {
    elements.mayorFiltroCliente?.addEventListener("change", () => {
      loadPeriods(elements.mayorFiltroCliente.value);
      hideFicha();
      renderSummary();
    });

    elements.mayorFiltroPeriodo?.addEventListener("change", () => {
      hideFicha();
      renderSummary();
    });

    elements.btnRefrescarMayor?.addEventListener("click", renderSummary);
    elements.btnImprimirMayor?.addEventListener("click", () => window.print());
    elements.btnCerrarFicha?.addEventListener("click", hideFicha);

    elements.tablaMayorResumen?.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action='ver-cuenta']");
      if (!target) return;
      renderFicha(target.dataset.code);
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

    loadClients();
    autoSelectDefault();
    bindEvents();
    renderSummary();
  }

  document.addEventListener("DOMContentLoaded", init);

/* ---------------------------------------------------------
   ✅ NUEVO: Resumen anual por cuenta (enero a diciembre)
   --------------------------------------------------------- */
function renderResumenAnualPorCuenta() {
  if (!elements.tablaResumenAnualCuenta) return;

  const clientId = elements.mayorFiltroCliente?.value || "";
  if (!clientId) {
    elements.tablaResumenAnualCuenta.innerHTML = `
      <tr><td colspan="6" class="text-center text-muted py-4">Seleccione un cliente.</td></tr>`;
    return;
  }

  const ctx = motor.buildContext(clientId);
  const accountsMap = motor.getAccountsMap();

  const periods = motor.getPeriodsForClient(clientId);
  if (!periods.length) {
    elements.tablaResumenAnualCuenta.innerHTML = `
      <tr><td colspan="6" class="text-center text-muted py-4">Sin períodos.</td></tr>`;
    return;
  }

  const diciembre = periods.find((p) => Number(p.mes) === 12) || periods[0];
  const decKey = motor.periodKey(diciembre);

  // Saldos al 31/12 (pre-cierre)
  const decBalances = motor.getTrialBalance(ctx, accountsMap, decKey, {
    includeAdjustments: true,
    includeClosing: false
  });

  // Movimiento ANUAL (suma de todas las líneas vigentes, sin cierre)
  const annualByCode = {};
  ctx.lines.forEach((line) => {
    if (line.isClosing) return;
    const code = line.cuentaCodigo;
    if (!annualByCode[code]) annualByCode[code] = { deb: 0, cred: 0 };
    annualByCode[code].deb += Number(line.debito) || 0;
    annualByCode[code].cred += Number(line.credito) || 0;
  });

  let totDeb = 0, totCred = 0, totSaldoDeudor = 0, totSaldoAcreedor = 0;
  const rows = [];

  Object.keys(annualByCode).forEach((code) => {
    const account = accountsMap[code];
    if (!account) return;

    const annual = annualByCode[code];
    const decRow = decBalances.rows.find((r) => r.codigo === code);
    const saldoDeudor = decRow ? Number(decRow.saldoDeudor) || 0 : 0;
    const saldoAcreedor = decRow ? Number(decRow.saldoAcreedor) || 0 : 0;

    const debAnual = round2(annual.deb);
    const credAnual = round2(annual.cred);

    if (debAnual === 0 && credAnual === 0 && saldoDeudor === 0 && saldoAcreedor === 0) return;

    totDeb += debAnual;
    totCred += credAnual;
    totSaldoDeudor += saldoDeudor;
    totSaldoAcreedor += saldoAcreedor;

    rows.push({
      codigo: code,
      nombre: account.nombre,
      tipo: account.tipo,
      esContra: !!account.esContra,
      esTemporal: !!account.esTemporal,
      debAnual,
      credAnual,
      saldoDeudor: round2(saldoDeudor),
      saldoAcreedor: round2(saldoAcreedor)
    });
  });

  if (!rows.length) {
    elements.tablaResumenAnualCuenta.innerHTML = `
      <tr><td colspan="6" class="text-center text-muted py-4">No hay movimientos en el año.</td></tr>`;
    return;
  }

  rows.sort((a, b) => String(a.codigo).localeCompare(String(b.codigo)));

  const filas = rows.map((r) => {
    const comp = r.esContra ? ' <span class="badge bg-secondary-subtle text-secondary">compensadora</span>' : "";
    const temp = r.esTemporal ? ' <span class="badge bg-info-subtle text-info">temporal</span>' : "";

    let saldoCell = '<span class="text-muted">—</span>';
    if (r.saldoDeudor > 0 && r.saldoAcreedor === 0) {
      saldoCell = `<span class="text-success fw-semibold">${utils.formatMoney(r.saldoDeudor)} (D)</span>`;
    } else if (r.saldoAcreedor > 0 && r.saldoDeudor === 0) {
      saldoCell = `<span class="text-danger fw-semibold">${utils.formatMoney(r.saldoAcreedor)} (A)</span>`;
    } else if (r.saldoDeudor > 0 && r.saldoAcreedor > 0) {
      saldoCell = `<span class="text-success">${utils.formatMoney(r.saldoDeudor)} (D)</span> / <span class="text-danger">${utils.formatMoney(r.saldoAcreedor)} (A)</span>`;
    }

    return `
      <tr>
        <td><code>${utils.escapeHTML(r.codigo)}</code></td>
        <td><strong>${utils.escapeHTML(r.nombre)}</strong>${comp}${temp}</td>
        <td>${tipoBadge(r.tipo)}</td>
        <td class="text-end">${utils.escapeHTML(utils.formatMoney(r.debAnual))}</td>
        <td class="text-end">${utils.escapeHTML(utils.formatMoney(r.credAnual))}</td>
        <td class="text-end">${saldoCell}</td>
      </tr>`;
  });

  const totDebR = round2(totDeb);
  const totCredR = round2(totCred);
  const totDeudorR = round2(totSaldoDeudor);
  const totAcreedorR = round2(totSaldoAcreedor);
  const cuadra = Math.abs(totDebR - totCredR) <= 0.01 && Math.abs(totDeudorR - totAcreedorR) <= 0.01;

  const filaTotal = `
    <tr class="table-light fw-semibold">
      <td colspan="3" class="text-end">TOTALES ANUALES</td>
      <td class="text-end">${utils.escapeHTML(utils.formatMoney(totDebR))}</td>
      <td class="text-end">${utils.escapeHTML(utils.formatMoney(totCredR))}</td>
      <td class="text-end">
        <span class="text-success">${utils.formatMoney(totDeudorR)} (D)</span> /
        <span class="text-danger">${utils.formatMoney(totAcreedorR)} (A)</span>
        ${cuadra ? '<br><span class="badge cc-status-activo mt-1">Cuadrado</span>' : '<br><span class="badge cc-status-vencida mt-1">Descuadrado</span>'}
      </td>
    </tr>`;

  elements.tablaResumenAnualCuenta.innerHTML = filas.join("") + filaTotal;
}

  return { init, renderSummary };
})();