/* =========================================================
   Cuentas Claras MVP
   Módulo de UI: Libro Mayor
   Fase 6
   ========================================================= */

window.CC_LIBRO_MAYOR = (function () {
  const utils = window.CC_UTILS;
  const motor = window.CC_MAYOR_BALANZA;

  const elements = {};
  let currentCtx = null;
  let currentAccountsMap = null;
  let currentKey = 0;

  function cacheElements() {
    elements.mayorFiltroCliente = document.getElementById("mayorFiltroCliente");
    elements.mayorFiltroPeriodo = document.getElementById("mayorFiltroPeriodo");
    elements.btnRefrescarMayor = document.getElementById("btnRefrescarMayor");
    elements.btnImprimirMayor = document.getElementById("btnImprimirMayor");
    elements.mayorAlerta = document.getElementById("mayorAlerta");
    elements.mayorEncabezadoImpresion = document.getElementById("mayorEncabezadoImpresion");
    elements.tablaMayorResumen = document.getElementById("tablaMayorResumen");
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

  function balanceCell(value, nature) {
    const v = Number(value) || 0;
    const abnormal = (nature === "deudora" && v < 0) || (nature === "acreedora" && v < 0);
    const cls = abnormal ? "text-danger fw-semibold" : "fw-semibold";
    const tag = abnormal ? ' <small class="text-danger">(contrario)</small>' : "";
    return `<span class="${cls}">${utils.escapeHTML(utils.formatMoney(Math.abs(v)))}</span>${tag}`;
  }

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
      setAlert("No hay clientes con periodos contables. Cree un periodo en el módulo Periodos.", "warning");
      return;
    }
    const first = clients[0];
    elements.mayorFiltroCliente.value = first.id;
    loadPeriods(first.id);
    const periods = motor.getPeriodsForClient(first.id);
    if (periods.length) {
      elements.mayorFiltroPeriodo.value = periods[0].id;
    }
  }

  function prepareContext() {
    const clientId = elements.mayorFiltroCliente?.value || "";
    const periodoId = elements.mayorFiltroPeriodo?.value || "";

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

    const client = currentCtx ? null : null;
    const clientName = storage_clientName(clientId);
    const periodLabel = motor.periodLabel(period);

    if (elements.mayorEncabezadoImpresion) {
      elements.mayorEncabezadoImpresion.textContent =
        `${clientName} · ${periodLabel} · Generado: ${utils.formatDate(utils.todayISO())}`;
    }

    return currentKey > 0;
  }

  function storage_clientName(clientId) {
    const c = window.CC_STORAGE.get("clients", clientId);
    return c ? c.nombreComercial : "Cliente";
  }

  function renderSummary() {
    if (!elements.tablaMayorResumen) return;

    if (!prepareContext()) {
      elements.tablaMayorResumen.innerHTML = `
        <tr><td colspan="9" class="text-center text-muted py-4">Seleccione un cliente y un periodo.</td></tr>`;
      hideFicha();
      return;
    }

    const rows = motor.getAccountSummaryRows(currentCtx, currentAccountsMap, currentKey);

    if (!rows.length) {
      elements.tablaMayorResumen.innerHTML = `
        <tr><td colspan="9" class="text-center text-muted py-4">
          No hay movimientos ni saldos en este periodo. Genere asientos en el Libro Diario.
        </td></tr>`;
      hideFicha();
      return;
    }

    let totInicial = 0, totDeb = 0, totCred = 0, totFinal = 0;

    elements.tablaMayorResumen.innerHTML = rows
      .map((r) => {
        totDeb += r.debitos;
        totCred += r.creditos;
        return `
          <tr class="cursor-pointer" data-action="ver-cuenta" data-code="${utils.escapeHTML(r.codigo)}">
            <td><code>${utils.escapeHTML(r.codigo)}</code></td>
            <td>
              <strong>${utils.escapeHTML(r.nombre)}</strong>
              ${r.esContra ? '<small class="d-block text-muted">(cuenta compensadora)</small>' : ""}
            </td>
            <td>${tipoBadge(r.tipo)}</td>
            <td>${utils.escapeHTML(natureLabel(r.naturaleza))}</td>
            <td class="text-end">${balanceCell(r.saldoInicial, r.naturaleza)}</td>
            <td class="text-end">${utils.escapeHTML(utils.formatMoney(r.debitos))}</td>
            <td class="text-end">${utils.escapeHTML(utils.formatMoney(r.creditos))}</td>
            <td class="text-end">${balanceCell(r.saldoFinal, r.naturaleza)}</td>
            <td class="text-end no-print">
              <button class="btn btn-outline-primary btn-sm" type="button"
                data-action="ver-cuenta" data-code="${utils.escapeHTML(r.codigo)}">
                <i class="bi bi-journal-text"></i> Ficha
              </button>
            </td>
          </tr>`;
      })
      .join("");

    const foot = document.createElement("tr");
    foot.className = "table-light fw-semibold";
    foot.innerHTML = `
      <td colspan="4" class="text-end">Totales del periodo</td>
      <td class="text-end">—</td>
      <td class="text-end">${utils.escapeHTML(utils.formatMoney(motor.round2(totDeb)))}</td>
      <td class="text-end">${utils.escapeHTML(utils.formatMoney(motor.round2(totCred)))}</td>
      <td class="text-end">—</td>
      <td class="no-print"></td>`;
    elements.tablaMayorResumen.appendChild(foot);
  }

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
            <td class="text-end fw-semibold">${balanceCell(row.saldo, ledger.naturaleza)}</td>
            <td>${utils.escapeHTML(row.observacion || "-")}</td>
          </tr>`).join("")
      : `<tr><td colspan="8" class="text-center text-muted py-3">Sin movimientos en el periodo (solo arrastre de saldo inicial).</td></tr>`;

    elements.fichaCuentaContenido.innerHTML = `
      <div class="row g-2 mb-3">
        <div class="col-6 col-md-3"><div class="border rounded p-2"><small class="text-muted d-block">Saldo inicial</small><strong>${balanceCell(ledger.saldoInicial, ledger.naturaleza)}</strong></div></div>
        <div class="col-6 col-md-3"><div class="border rounded p-2"><small class="text-muted d-block">Débitos del periodo</small><strong>${utils.escapeHTML(utils.formatMoney(ledger.debitos))}</strong></div></div>
        <div class="col-6 col-md-3"><div class="border rounded p-2"><small class="text-muted d-block">Créditos del periodo</small><strong>${utils.escapeHTML(utils.formatMoney(ledger.creditos))}</strong></div></div>
        <div class="col-6 col-md-3"><div class="border rounded p-2"><small class="text-muted d-block">Saldo final</small><strong>${balanceCell(ledger.saldoFinal, ledger.naturaleza)}</strong></div></div>
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
        El saldo se presenta como positivo cuando es de la naturaleza normal de la cuenta.
      </p>`;

    elements.fichaCuentaCard.classList.remove("d-none");
    elements.fichaCuentaCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
    loadClients();
    autoSelectDefault();
    bindEvents();
    renderSummary();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { init, renderSummary };
})();