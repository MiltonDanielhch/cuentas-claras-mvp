/* =========================================================
   Cuentas Claras MVP
   Módulo de Estados Financieros simplificados
   Fase 8
   ========================================================= */

window.CC_ESTADOS_FINANCIEROS = (function () {
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const motor = window.CC_MAYOR_BALANZA;
  const cierre = window.CC_CIERRE;
  const bitacora = window.CC_BITACORA;

  const elements = {};

  let currentClientId = "";
  let currentPeriodId = "";
  let currentPeriod = null;
  let currentKey = 0;
  let currentCtx = null;
  let currentAccountsMap = null;
  let currentBalances = null;
  let currentIncome = null;
  let currentBalanceSheet = null;
  let currentTaxes = { it: 0, ivaPagar: 0 };

  const incomeExpenseCodes = [
    "6.1.01",
    "6.1.02",
    "6.1.03",
    "6.1.04",
    "6.1.05"
  ];

  const activoCorrienteCodes = [
    "1.1.01",
    "1.1.02",
    "1.1.03",
    "1.1.04",
    "1.1.05",
    "1.1.06"
  ];

  const pasivoCorrienteCodes = [
    "2.1.01",
    "2.1.02",
    "2.1.03",
    "2.1.04",
    "2.1.05"
  ];

  function round2(value) {
    return motor && motor.round2
      ? motor.round2(value)
      : Math.round((Number(value) || 0) * 100) / 100;
  }

  function money(value) {
    return utils.formatMoney(round2(value));
  }

  function cacheElements() {
    elements.efFiltroCliente = document.getElementById("efFiltroCliente");
    elements.efFiltroPeriodo = document.getElementById("efFiltroPeriodo");
    elements.efEstadoPeriodo = document.getElementById("efEstadoPeriodo");
    elements.efAlerta = document.getElementById("efAlerta");
    elements.efEncabezadoImpresion = document.getElementById("efEncabezadoImpresion");

    elements.btnEfRefrescar = document.getElementById("btnEfRefrescar");
    elements.btnEfEmitir = document.getElementById("btnEfEmitir");
    elements.btnEfCerrar = document.getElementById("btnEfCerrar");
    elements.btnEfImprimir = document.getElementById("btnEfImprimir");

    elements.efIncomeBody = document.getElementById("efIncomeBody");
    elements.efBalanceBody = document.getElementById("efBalanceBody");
    elements.efVerification = document.getElementById("efVerification");
    elements.efTaxesInfo = document.getElementById("efTaxesInfo");
  }

  function setAlert(message, type = "info") {
    if (!elements.efAlerta) return;

    if (!message) {
      elements.efAlerta.classList.add("d-none");
      elements.efAlerta.textContent = "";
      return;
    }

    elements.efAlerta.className = `alert alert-${type} mt-3 mb-0 small`;
    elements.efAlerta.textContent = message;
    elements.efAlerta.classList.remove("d-none");
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

  function getClientName(clientId) {
    const c = storage.get("clients", clientId);
    return c ? c.nombreComercial : "Cliente";
  }

  function loadClients() {
    const clients = motor.getClientsWithPeriods().sort((a, b) =>
      String(a.nombreComercial || "").localeCompare(String(b.nombreComercial || ""))
    );

    populateSelect(
      elements.efFiltroCliente,
      clients.map((c) => ({
        value: c.id,
        label: `${c.nombreComercial} (${c.id})`
      })),
      "Seleccione un cliente..."
    );
  }

  function loadPeriods(clientId) {
    if (!clientId) {
      populateSelect(elements.efFiltroPeriodo, [], "Seleccione primero un cliente...");
      return;
    }

    const periods = motor.getPeriodsForClient(clientId);

    populateSelect(
      elements.efFiltroPeriodo,
      periods.map((p) => ({
        value: p.id,
        label: motor.periodLabel(p)
      })),
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
    elements.efFiltroCliente.value = first.id;
    loadPeriods(first.id);

    const periods = motor.getPeriodsForClient(first.id);
    if (periods.length) {
      elements.efFiltroPeriodo.value = periods[0].id;
    }
  }

  function prepareContext() {
    currentClientId = elements.efFiltroCliente?.value || "";
    currentPeriodId = elements.efFiltroPeriodo?.value || "";

    if (!currentClientId || !currentPeriodId) {
      currentPeriod = null;
      currentKey = 0;
      currentCtx = null;
      currentAccountsMap = null;
      currentBalances = null;
      currentIncome = null;
      currentBalanceSheet = null;
      return false;
    }

    motor.ensureAccounts();

    currentCtx = motor.buildContext(currentClientId);
    currentAccountsMap = motor.getAccountsMap();
    currentPeriod = currentCtx.periodMap[currentPeriodId];
    currentKey = currentPeriod ? motor.periodKey(currentPeriod) : 0;

    if (!currentPeriod || currentKey <= 0) {
      currentPeriod = null;
      currentKey = 0;
      return false;
    }

    currentBalances = motor.getTrialBalance(currentCtx, currentAccountsMap, currentKey, {
      includeAdjustments: true,
      includeClosing: false
    });

    currentTaxes = getTaxesInfo();
    currentIncome = computeIncome();
    currentBalanceSheet = computeBalanceSheet();

    if (elements.efEncabezadoImpresion) {
      elements.efEncabezadoImpresion.textContent =
        `${getClientName(currentClientId)} · ${motor.periodLabel(currentPeriod)} · Generado: ${utils.formatDate(utils.todayISO())}`;
    }

    return true;
  }

  function rowByCode(code) {
    if (!currentBalances) return null;
    return currentBalances.rows.find((r) => r.codigo === code) || null;
  }

  function accountName(code) {
    const acc = currentAccountsMap?.[code];
    if (acc) return acc.nombre;

    const row = rowByCode(code);
    if (row) return row.nombre;

    return code;
  }

  function accountBalance(code) {
    const row = rowByCode(code);
    if (!row) return 0;

    if (row.naturaleza === "deudora") {
      return round2((Number(row.saldoDeudor) || 0) - (Number(row.saldoAcreedor) || 0));
    }

    return round2((Number(row.saldoAcreedor) || 0) - (Number(row.saldoDeudor) || 0));
  }

  function periodNetDebit(code) {
    const row = rowByCode(code);
    if (!row) return 0;
    return round2((Number(row.debitos) || 0) - (Number(row.creditos) || 0));
  }

  function periodNetCredit(code) {
    const row = rowByCode(code);
    if (!row) return 0;
    return round2((Number(row.creditos) || 0) - (Number(row.debitos) || 0));
  }

  function getTaxesInfo() {
    const taxes = storage
      .list("taxes")
      .filter(
        (t) =>
          t.clienteId === currentClientId &&
          t.periodoId === currentPeriodId
      );

    const it = taxes
      .filter((t) => t.tipo === "IT" && t.concepto === "ventas_brutas")
      .reduce((sum, t) => sum + (Number(t.monto) || 0), 0);

    const ivaPagar = taxes
      .filter((t) => t.tipo === "IVA" && t.concepto === "por_pagar")
      .reduce((sum, t) => sum + (Number(t.monto) || 0), 0);

    return {
      it: round2(it),
      ivaPagar: round2(ivaPagar)
    };
  }

  function computeIncome() {
    const ventas = periodNetCredit("4.1.01");
    const otrosIngresos = periodNetCredit("4.1.02");
    const totalIngresos = round2(ventas + otrosIngresos);

    const comprasBrutas = periodNetDebit("5.1.01");
    const devolucionesCompras = periodNetCredit("5.1.02");
    const costoNeto = round2(comprasBrutas - devolucionesCompras);

    const utilidadBruta = round2(totalIngresos - costoNeto);

    const gastos = incomeExpenseCodes.map((code) => ({
      codigo: code,
      nombre: accountName(code),
      monto: periodNetDebit(code)
    }));

    const totalGastos = round2(
      gastos.reduce((sum, g) => sum + g.monto, 0)
    );

    const utilidadOperativa = round2(utilidadBruta - totalGastos);
    const impuestosEstimados = currentTaxes.it;
    const utilidadNeta = round2(utilidadOperativa - impuestosEstimados);

    return {
      ventas,
      otrosIngresos,
      totalIngresos,
      comprasBrutas,
      devolucionesCompras,
      costoNeto,
      utilidadBruta,
      gastos,
      totalGastos,
      utilidadOperativa,
      impuestosEstimados,
      utilidadNeta
    };
  }

  function computeBalanceSheet() {
    const activoCorrienteLines = activoCorrienteCodes.map((code) => ({
      codigo: code,
      nombre: accountName(code),
      monto: accountBalance(code)
    }));

    const totalActivoCorriente = round2(
      activoCorrienteLines.reduce((sum, l) => sum + l.monto, 0)
    );

    const mobiliarioEquipo = accountBalance("1.2.01");
    const depreciacionAcumulada = accountBalance("1.2.02");
    const intangibles = accountBalance("1.2.03");

    const totalActivoNoCorriente = round2(
      mobiliarioEquipo - depreciacionAcumulada + intangibles
    );

    const totalActivo = round2(totalActivoCorriente + totalActivoNoCorriente);

    const pasivoCorrienteLines = pasivoCorrienteCodes.map((code) => ({
      codigo: code,
      nombre: accountName(code),
      monto: accountBalance(code)
    }));

    const pasivoCorrienteBase = round2(
      pasivoCorrienteLines.reduce((sum, l) => sum + l.monto, 0)
    );

    const pasivoITInformativo = currentTaxes.it;
    const totalPasivoCorriente = round2(pasivoCorrienteBase + pasivoITInformativo);

    const prestamosLP = accountBalance("2.2.01");
    const totalPasivo = round2(totalPasivoCorriente + prestamosLP);

    const capital = accountBalance("3.1.01");
    const resultadosAcumulados = accountBalance("3.1.02");
    const resultadoPeriodo = currentIncome ? currentIncome.utilidadNeta : 0;

    const totalPatrimonio = round2(
      capital + resultadosAcumulados + resultadoPeriodo
    );

    const totalPasivoPatrimonio = round2(totalPasivo + totalPatrimonio);
    const diferencia = round2(totalActivo - totalPasivoPatrimonio);

    return {
      activoCorrienteLines,
      totalActivoCorriente,
      mobiliarioEquipo,
      depreciacionAcumulada,
      intangibles,
      totalActivoNoCorriente,
      totalActivo,

      pasivoCorrienteLines,
      pasivoCorrienteBase,
      pasivoITInformativo,
      totalPasivoCorriente,
      prestamosLP,
      totalPasivo,

      capital,
      resultadosAcumulados,
      resultadoPeriodo,
      totalPatrimonio,

      totalPasivoPatrimonio,
      diferencia,
      balanced: Math.abs(diferencia) <= 0.01
    };
  }

  function statementHeader(label) {
    return `
      <tr class="cc-statement-section">
        <th colspan="2">${utils.escapeHTML(label)}</th>
      </tr>
    `;
  }

  function statementRow(label, value, cssClass = "") {
    return `
      <tr class="${cssClass}">
        <td>${utils.escapeHTML(label)}</td>
        <td class="text-end">${utils.escapeHTML(money(value))}</td>
      </tr>
    `;
  }

  function renderPeriodState() {
    if (!elements.efEstadoPeriodo) return;

    if (!currentPeriod) {
      elements.efEstadoPeriodo.className = "badge bg-secondary w-100 text-center py-2";
      elements.efEstadoPeriodo.textContent = "Sin periodo";
      return;
    }

    const estado = String(currentPeriod.estado || "").toLowerCase();

    let cls = "bg-secondary";
    let label = estado;

    if (estado === "abierto") {
      cls = "cc-status-abierto";
      label = "Abierto";
    } else if (estado === "en_revision") {
      cls = "cc-status-en_revision";
      label = "En revisión";
    } else if (estado === "cerrado") {
      cls = "cc-status-cerrado";
      label = "Cerrado";
    }

    elements.efEstadoPeriodo.className = `badge ${cls} w-100 text-center py-2`;
    elements.efEstadoPeriodo.textContent = label;

    if (elements.btnEfCerrar) {
      if (estado === "cerrado") {
        elements.btnEfCerrar.className = "btn btn-outline-warning btn-sm";
        elements.btnEfCerrar.innerHTML = '<i class="bi bi-unlock me-1"></i>Reabrir periodo';
      } else {
        elements.btnEfCerrar.className = "btn btn-outline-danger btn-sm";
        elements.btnEfCerrar.innerHTML = '<i class="bi bi-lock me-1"></i>Cerrar periodo contable';
      }
    }
  }

  function renderIncome() {
    if (!elements.efIncomeBody) return;

    if (!currentIncome) {
      elements.efIncomeBody.innerHTML = `
        <p class="text-muted text-center mb-0">Seleccione cliente y periodo.</p>
      `;
      return;
    }

    const i = currentIncome;

    let html = `
      <table class="table table-sm cc-statement-table mb-0">
        <tbody>
    `;

    html += statementHeader("Ingresos operativos");
    html += statementRow("Ventas", i.ventas);
    html += statementRow("Otros ingresos", i.otrosIngresos);
    html += statementRow("Total ingresos", i.totalIngresos, "table-light fw-semibold");

    html += statementHeader("Costo de ventas");
    html += statementRow("Compras / costo bruto", i.comprasBrutas);
    html += statementRow("(-) Devoluciones y descuentos sobre compras", -i.devolucionesCompras);
    html += statementRow("Costo neto de ventas", i.costoNeto, "table-light fw-semibold");

    html += statementRow("Utilidad bruta", i.utilidadBruta, "fw-bold");

    html += statementHeader("Gastos operativos");

    i.gastos.forEach((g) => {
      html += statementRow(g.nombre, g.monto);
    });

    html += statementRow("Total gastos operativos", i.totalGastos, "table-light fw-semibold");
    html += statementRow("Utilidad operativa", i.utilidadOperativa, "fw-bold");

    html += statementHeader("Impuestos estimados informativos");
    html += statementRow("(-) IT estimado", -i.impuestosEstimados);
    html += statementRow("Utilidad neta del periodo", i.utilidadNeta, "fw-bold table-success");

    html += `
        </tbody>
      </table>
    `;

    elements.efIncomeBody.innerHTML = html;
  }

  function renderBalance() {
    if (!elements.efBalanceBody) return;

    if (!currentBalanceSheet) {
      elements.efBalanceBody.innerHTML = `
        <p class="text-muted text-center mb-0">Seleccione cliente y periodo.</p>
      `;
      return;
    }

    const b = currentBalanceSheet;

    let html = `
      <table class="table table-sm cc-statement-table mb-0">
        <tbody>
    `;

    html += statementHeader("Activo corriente");
    b.activoCorrienteLines.forEach((l) => {
      html += statementRow(l.nombre, l.monto);
    });
    html += statementRow("Total activo corriente", b.totalActivoCorriente, "table-light fw-semibold");

    html += statementHeader("Activo no corriente");
    html += statementRow("Mobiliario y equipo", b.mobiliarioEquipo);
    html += statementRow("(-) Depreciación acumulada", -b.depreciacionAcumulada);
    html += statementRow("Intangibles", b.intangibles);
    html += statementRow("Total activo no corriente", b.totalActivoNoCorriente, "table-light fw-semibold");

    html += statementRow("TOTAL ACTIVO", b.totalActivo, "fw-bold table-primary text-white");

    html += statementHeader("Pasivo corriente");
    b.pasivoCorrienteLines.forEach((l) => {
      html += statementRow(l.nombre, l.monto);
    });
    html += statementRow("Impuestos estimados por pagar (IT informativo)", b.pasivoITInformativo);
    html += statementRow("Total pasivo corriente", b.totalPasivoCorriente, "table-light fw-semibold");

    html += statementHeader("Pasivo no corriente");
    html += statementRow("Préstamos a largo plazo", b.prestamosLP);
    html += statementRow("Total pasivo", b.totalPasivo, "table-light fw-semibold");

    html += statementHeader("Patrimonio");
    html += statementRow("Capital / Aportes del propietario", b.capital);
    html += statementRow("Resultados acumulados", b.resultadosAcumulados);
    html += statementRow("Resultado del periodo", b.resultadoPeriodo);
    html += statementRow("Total patrimonio", b.totalPatrimonio, "table-light fw-semibold");

    html += statementRow("TOTAL PASIVO Y PATRIMONIO", b.totalPasivoPatrimonio, "fw-bold table-success");

    html += `
        </tbody>
      </table>
    `;

    elements.efBalanceBody.innerHTML = html;
  }

  function renderVerification() {
    if (!elements.efVerification) return;

    if (!currentBalanceSheet) {
      elements.efVerification.innerHTML = `
        <p class="text-muted mb-0">Seleccione cliente y periodo para verificar cuadratura.</p>
      `;
      return;
    }

    const b = currentBalanceSheet;
    const hasClosing = cierre && currentPeriodId ? cierre.hasVigenteClosingEntry(currentPeriodId) : false;

    elements.efVerification.innerHTML = `
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Total activo</p>
            <strong class="fs-5">${utils.escapeHTML(money(b.totalActivo))}</strong>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Total pasivo + patrimonio</p>
            <strong class="fs-5">${utils.escapeHTML(money(b.totalPasivoPatrimonio))}</strong>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Diferencia</p>
            <strong class="fs-5 ${b.balanced ? "text-success" : "text-danger"}">
              ${utils.escapeHTML(money(b.diferencia))}
            </strong>
            <div class="mt-2">
              ${
                b.balanced
                  ? '<span class="badge cc-status-activo">Balance cuadrado</span>'
                  : '<span class="badge cc-status-vencida">Balance descuadrado</span>'
              }
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="alert ${hasClosing ? "alert-success" : "alert-info"} mb-0 small">
            <strong>Estado de cierre:</strong>
            ${
              hasClosing
                ? "Este periodo ya tiene asiento de cierre vigente. Los EE.FF. mostrados excluyen el cierre para conservar ingresos, costos y gastos del periodo."
                : "Este periodo todavía no tiene asiento de cierre vigente. Puede emitir EE.FF. y luego cerrar contablemente."
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderTaxesInfo() {
    if (!elements.efTaxesInfo) return;

    if (!currentPeriod) {
      elements.efTaxesInfo.innerHTML = `
        <p class="text-muted mb-0">Seleccione cliente y periodo.</p>
      `;
      return;
    }

    elements.efTaxesInfo.innerHTML = `
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">IT estimado</p>
            <strong class="fs-5 text-warning">${utils.escapeHTML(money(currentTaxes.it))}</strong>
            <small class="d-block text-muted mt-1">
              Se presenta como gasto informativo y pasivo informativo para cuadrar el balance simplificado.
            </small>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">IVA por pagar informativo</p>
            <strong class="fs-5 text-primary">${utils.escapeHTML(money(currentTaxes.ivaPagar))}</strong>
            <small class="d-block text-muted mt-1">
              El IVA ya debería estar reflejado en cuentas 1.1.05 y 2.1.02 si se generaron asientos automáticos en Régimen General.
            </small>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Aviso</p>
            <p class="mb-0 small">
              Estos valores son preventivos e informativos. No constituyen declaración automática ante el SIN.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function renderAll() {
    const ok = prepareContext();

    renderPeriodState();

    if (!ok) {
      elements.efIncomeBody.innerHTML = `
        <p class="text-muted text-center mb-0">Seleccione cliente y periodo.</p>
      `;
      elements.efBalanceBody.innerHTML = `
        <p class="text-muted text-center mb-0">Seleccione cliente y periodo.</p>
      `;
      elements.efVerification.innerHTML = `
        <p class="text-muted mb-0">Seleccione cliente y periodo.</p>
      `;
      elements.efTaxesInfo.innerHTML = `
        <p class="text-muted mb-0">Seleccione cliente y periodo.</p>
      `;
      return;
    }

    renderIncome();
    renderBalance();
    renderVerification();
    renderTaxesInfo();
  }

  function getCurrentUserId() {
    const session = window.CC_AUTH ? window.CC_AUTH.getSession() : null;
    return session ? session.userId : "SYSTEM";
  }

  function createSnapshot(tipo, contenido) {
    return storage.create(
      "financialSnapshots",
      {
        clienteId: currentClientId,
        periodoId: currentPeriodId,
        tipo,
        fechaGeneracion: utils.nowISO(),
        usuarioId: getCurrentUserId(),
        contenido,
        estado: "generado"
      },
      "FS"
    );
  }

  function emitSnapshots() {
    if (!prepareContext()) {
      utils.showToast("Seleccione un cliente y un periodo.", "warning");
      return;
    }

    const common = {
      clientId: currentClientId,
      clientName: getClientName(currentClientId),
      periodoId: currentPeriodId,
      periodLabel: motor.periodLabel(currentPeriod),
      generatedAt: utils.nowISO(),
      basis: "Balanza ajustada sin asientos de cierre",
      taxesInfo: currentTaxes
    };

    const incomeSnapshot = createSnapshot("estado_resultados", {
      ...common,
      incomeStatement: currentIncome
    });

    const balanceSnapshot = createSnapshot("balance", {
      ...common,
      balanceSheet: currentBalanceSheet
    });

    if (bitacora) {
      bitacora.log(
        "generar_estado_resultados",
        "financial_snapshots",
        incomeSnapshot.id,
        `Snapshot de Estado de Resultados generado para ${getClientName(currentClientId)} · ${motor.periodLabel(currentPeriod)}`
      );

      bitacora.log(
        "generar_balance",
        "financial_snapshots",
        balanceSnapshot.id,
        `Snapshot de Balance General generado para ${getClientName(currentClientId)} · ${motor.periodLabel(currentPeriod)}`
      );
    }

    setAlert(
      "Snapshots de Estado de Resultados y Balance General generados correctamente. Se guardan como evidencia histórica; los EE.FF. vivos siguen derivándose del Diario.",
      "success"
    );

    utils.showToast("Snapshots generados.", "success");
  }

  function toggleClosePeriod() {
    if (!prepareContext()) {
      utils.showToast("Seleccione un cliente y un periodo.", "warning");
      return;
    }

    if (!cierre) {
      utils.showToast("No se encontró el módulo de cierre CC_CIERRE.", "danger");
      return;
    }

    try {
      if (currentPeriod.estado === "cerrado") {
        const ok = utils.confirmDialog(
          `¿Reabrir el periodo ${motor.periodLabel(currentPeriod)} de ${getClientName(currentClientId)}? Se anularán los asientos de cierre vigentes y la acción quedará en bitácora.`
        );

        if (!ok) return;

        const result = cierre.reopenPeriod(currentPeriodId);

        setAlert(
          `Periodo reabierto. Asientos de cierre anulados: ${result.voidedEntries}.`,
          "warning"
        );

        utils.showToast("Periodo reabierto correctamente.", "success");
      } else {
        const ok = utils.confirmDialog(
          `¿Cerrar contablemente el periodo ${motor.periodLabel(currentPeriod)} de ${getClientName(currentClientId)}? Se generará un asiento de cierre y el periodo quedará bloqueado para nuevas operaciones.`
        );

        if (!ok) return;

        const result = cierre.closePeriod(currentClientId, currentPeriodId);

        setAlert(
          result.entry
            ? `Periodo cerrado. Asiento de cierre generado: ${result.entry.folio || result.entry.id}.`
            : "Periodo cerrado. No fue necesario generar asiento de cierre porque no hubo cuentas temporales con movimiento.",
          "success"
        );

        utils.showToast("Periodo cerrado contablemente.", "success");
      }

      renderAll();
    } catch (error) {
      utils.showToast(error.message, "danger");
      setAlert(error.message, "danger");
    }
  }

  function bindEvents() {
    elements.efFiltroCliente?.addEventListener("change", () => {
      loadPeriods(elements.efFiltroCliente.value);
      renderAll();
    });

    elements.efFiltroPeriodo?.addEventListener("change", renderAll);
    elements.btnEfRefrescar?.addEventListener("click", renderAll);
    elements.btnEfEmitir?.addEventListener("click", emitSnapshots);
    elements.btnEfCerrar?.addEventListener("click", toggleClosePeriod);
    elements.btnEfImprimir?.addEventListener("click", () => window.print());
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    if (!motor) {
      console.error("No se encontró CC_MAYOR_BALANZA.");
      utils.showToast("Falta js/modules/mayor-balanza.js.", "danger");
      return;
    }

    if (!cierre) {
      console.warn("No se encontró CC_CIERRE. Los EE.FF. funcionarán, pero el cierre no estará disponible.");
    }

    cacheElements();
    loadClients();
    autoSelectDefault();
    bindEvents();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    renderAll
  };
})();