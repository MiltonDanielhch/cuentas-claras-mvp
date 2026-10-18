/* =========================================================
   Cuentas Claras MVP
   Módulo de impuestos y obligaciones tributarias
   ========================================================= */

window.CC_IMPUESTOS = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const bitacora = window.CC_BITACORA;

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  const conceptLabels = {
    debito_fiscal: "Débito fiscal",
    credito_fiscal: "Crédito fiscal",
    por_pagar: "Por pagar",
    ventas_brutas: "Ventas brutas",
    referencia: "Referencia",
    otro: "Otro"
  };

  const elements = {};

  function cacheElements() {
    elements.impuestoFiltroCliente = document.getElementById("impuestoFiltroCliente");
    elements.impuestoFiltroPeriodo = document.getElementById("impuestoFiltroPeriodo");
    elements.btnCalcularImpuestos = document.getElementById("btnCalcularImpuestos");
    elements.btnRefrescarImpuestos = document.getElementById("btnRefrescarImpuestos");
    elements.impuestoAlerta = document.getElementById("impuestoAlerta");

    elements.resumenVentas = document.getElementById("resumenVentas");
    elements.resumenCompras = document.getElementById("resumenCompras");
    elements.resumenIvaDebito = document.getElementById("resumenIvaDebito");
    elements.resumenIvaCredito = document.getElementById("resumenIvaCredito");
    elements.resumenIvaPagar = document.getElementById("resumenIvaPagar");
    elements.resumenIT = document.getElementById("resumenIT");
    elements.resumenTotal = document.getElementById("resumenTotal");
    elements.resumenVencimiento = document.getElementById("resumenVencimiento");

    elements.tablaImpuestos = document.getElementById("tablaImpuestos");
    elements.tablaObligaciones = document.getElementById("tablaObligaciones");

    elements.detalleModalEl = document.getElementById("obligacionDetalleModal");
    elements.detalleContenido = document.getElementById("obligacionDetalleContenido");
  }

  function getModalInstance(el) {
    return bootstrap.Modal.getOrCreateInstance(el);
  }

  function showDetalleModal() {
    getModalInstance(elements.detalleModalEl).show();
  }

  function setAlert(message, type = "info") {
    if (!elements.impuestoAlerta) return;

    if (!message) {
      elements.impuestoAlerta.classList.add("d-none");
      elements.impuestoAlerta.textContent = "";
      return;
    }

    elements.impuestoAlerta.className = `alert alert-${type}`;
    elements.impuestoAlerta.textContent = message;
    elements.impuestoAlerta.classList.remove("d-none");
  }

  function populateSelect(selectEl, options, placeholder = "") {
    if (!selectEl) return;

    const currentValue = selectEl.value;

    selectEl.innerHTML = "";

    if (placeholder !== null) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = placeholder;
      selectEl.appendChild(opt);
    }

    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.label;
      selectEl.appendChild(opt);
    });

    if (currentValue) {
      selectEl.value = currentValue;
    }
  }

  function round2(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }

  function formatRate(rate) {
    const num = Number(rate) || 0;
    const pct = num * 100;

    if (Number.isInteger(pct)) {
      return `${pct}%`;
    }

    return `${pct.toFixed(2)}%`;
  }

  function getClients() {
    return storage.list("clients");
  }

  function getClientById(id) {
    return storage.get("clients", id);
  }

  function getClientName(id) {
    const client = getClientById(id);
    return client ? client.nombreComercial : "Cliente no encontrado";
  }

  function getPeriods() {
    return storage.list("periods");
  }

  function getPeriodById(id) {
    return storage.get("periods", id);
  }

  function periodLabel(period) {
    if (!period) return "-";
    const name = monthNames[Number(period.mes) - 1] || "Mes inválido";
    return `${name} ${period.anio}`;
  }

  function getPeriodLabelByClientId(periodoId) {
    const period = getPeriodById(periodoId);
    if (!period) return "-";
    return `${getClientName(period.clienteId)} · ${periodLabel(period)}`;
  }

  function dueDateForPeriod(mes, anio) {
    let dueMonth = Number(mes) + 1;
    let dueYear = Number(anio);

    if (dueMonth > 12) {
      dueMonth = 1;
      dueYear += 1;
    }

    const day = Number(cfg.genericDueDay) || 20;

    return `${dueYear}-${utils.pad2(dueMonth)}-${utils.pad2(day)}`;
  }

  function getTransactionsByPeriod(clientId, periodoId) {
    return storage
      .list("transactions")
      .filter(
        (trx) =>
          trx.clienteId === clientId &&
          trx.periodoId === periodoId &&
          trx.estado === "activa"
      );
  }

  function getTaxesByPeriod(clientId, periodoId) {
    return storage
      .list("taxes")
      .filter(
        (tax) =>
          tax.clienteId === clientId &&
          tax.periodoId === periodoId
      );
  }

  function getObligationsByPeriod(clientId, periodoId) {
    return storage
      .list("obligations")
      .filter(
        (obl) =>
          obl.clienteId === clientId &&
          obl.periodoId === periodoId
      );
  }

  function sumByType(transactions, type) {
    return transactions
      .filter((trx) => trx.tipo === type)
      .reduce((total, trx) => total + (Number(trx.monto) || 0), 0);
  }

  function getTaxAmount(taxes, tipo, concepto) {
    const found = taxes.find(
      (tax) => tax.tipo === tipo && tax.concepto === concepto
    );

    return found ? Number(found.monto) || 0 : 0;
  }

  function computeTransactionSummary(clientId, periodoId) {
    const transactions = getTransactionsByPeriod(clientId, periodoId);

    const ventas = round2(sumByType(transactions, "venta"));
    const compras = round2(sumByType(transactions, "compra"));
    const gastos = round2(sumByType(transactions, "gasto"));
    const ingresos = round2(sumByType(transactions, "ingreso"));

    return {
      ventas,
      compras,
      gastos,
      ingresos,
      utilidadEstimada: round2(ventas + ingresos - compras - gastos)
    };
  }

  function computeTaxes(clientId, periodoId) {
    const client = getClientById(clientId);
    const period = getPeriodById(periodoId);

    if (!client || !period) {
      return null;
    }

    const summary = computeTransactionSummary(clientId, periodoId);
    const regimen = client.regimenTributario || "Por definir";
    const esSimplificado = regimen === "Régimen Simplificado";

    const tasas = cfg.taxRates;
    const taxes = [];
    const obligations = [];

    let ivaDebito = 0;
    let ivaCredito = 0;
    let ivaPagar = 0;
    let it = 0;

    if (!esSimplificado) {
      ivaDebito = round2(summary.ventas * tasas.IVA);
      ivaCredito = round2(summary.compras * tasas.IVA);
      ivaPagar = round2(Math.max(ivaDebito - ivaCredito, 0));

      if (summary.ventas > 0) {
        taxes.push({
          tipo: "IVA",
          concepto: "debito_fiscal",
          baseImponible: summary.ventas,
          tasa: tasas.IVA,
          monto: ivaDebito
        });
      }

      if (summary.compras > 0) {
        taxes.push({
          tipo: "IVA",
          concepto: "credito_fiscal",
          baseImponible: summary.compras,
          tasa: tasas.IVA,
          monto: ivaCredito
        });
      }

      if (ivaPagar > 0) {
        taxes.push({
          tipo: "IVA",
          concepto: "por_pagar",
          baseImponible: round2(Math.max(summary.ventas - summary.compras, 0)),
          tasa: tasas.IVA,
          monto: ivaPagar
        });

        obligations.push({
          tipo: "IVA",
          descripcion: "Declaración mensual IVA",
          montoEstimado: ivaPagar
        });
      }
    }

    it = round2(summary.ventas * tasas.IT);

    if (it > 0) {
      taxes.push({
        tipo: "IT",
        concepto: "ventas_brutas",
        baseImponible: summary.ventas,
        tasa: tasas.IT,
        monto: it
      });

      obligations.push({
        tipo: "IT",
        descripcion: "Declaración mensual IT",
        montoEstimado: it
      });
    }

    const fechaVencimiento = dueDateForPeriod(period.mes, period.anio);

    obligations.forEach((obl) => {
      obl.clienteId = clientId;
      obl.periodoId = periodoId;
      obl.fechaVencimiento = fechaVencimiento;
    });

    return {
      client,
      period,
      regimen,
      esSimplificado,
      summary,
      taxes,
      obligations,
      totals: {
        ivaDebito,
        ivaCredito,
        ivaPagar,
        it,
        totalEstimado: round2(ivaPagar + it),
        fechaVencimiento
      }
    };
  }

  function saveTaxesForPeriod(clientId, periodoId, taxes) {
    const others = storage
      .list("taxes")
      .filter(
        (tax) =>
          !(tax.clienteId === clientId && tax.periodoId === periodoId)
      );

    storage.setList("taxes", others);

    const saved = taxes.map((tax) =>
      storage.create(
        "taxes",
        {
          ...tax,
          clienteId: clientId,
          periodoId: periodoId,
          fechaCalculo: utils.todayISO()
        },
        "IMP"
      )
    );

    return saved;
  }

  function upsertObligation(data) {
    const obligations = storage.list("obligations");

    const existing = obligations.find(
      (obl) =>
        obl.clienteId === data.clienteId &&
        obl.periodoId === data.periodoId &&
        obl.tipo === data.tipo
    );

    if (existing) {
      const lockedStates = ["presentada", "pagada", "anulada"];

      if (lockedStates.includes(existing.estado)) {
        return {
          created: false,
          updated: false,
          skipped: true,
          obligation: existing
        };
      }

      const updated = storage.update("obligations", existing.id, {
        descripcion: data.descripcion,
        fechaVencimiento: data.fechaVencimiento,
        montoEstimado: data.montoEstimado
      });

      return {
        created: false,
        updated: true,
        skipped: false,
        obligation: updated
      };
    }

    const created = storage.create(
      "obligations",
      {
        ...data,
        estado: "pendiente"
      },
      "OBL"
    );

    return {
      created: true,
      updated: false,
      skipped: false,
      obligation: created
    };
  }

  function calculate(event) {
    if (event) event.preventDefault();

    const clientId = elements.impuestoFiltroCliente?.value || "";
    const periodoId = elements.impuestoFiltroPeriodo?.value || "";

    if (!clientId || !periodoId) {
      utils.showToast("Seleccione un cliente y un periodo.", "warning");
      return;
    }

    const result = computeTaxes(clientId, periodoId);

    if (!result) {
      utils.showToast("No se pudo calcular para el cliente o periodo seleccionado.", "danger");
      return;
    }

    saveTaxesForPeriod(clientId, periodoId, result.taxes);

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    result.obligations.forEach((obl) => {
      const action = upsertObligation(obl);

      if (action.created) createdCount += 1;
      if (action.updated) updatedCount += 1;
      if (action.skipped) skippedCount += 1;

      if (action.created && bitacora) {
        bitacora.log(
          "generar_obligacion",
          "obligations",
          action.obligation.id,
          `Obligación ${action.obligation.tipo} generada para ${getClientName(clientId)} · ${periodLabel(result.period)}`
        );
      }
    });

    if (bitacora) {
      bitacora.log(
        "calcular_impuestos",
        "taxes",
        periodoId,
        `Cálculo informativo de impuestos para ${getClientName(clientId)} · ${periodLabel(result.period)}. IVA por pagar: ${utils.formatMoney(result.totals.ivaPagar)}. IT: ${utils.formatMoney(result.totals.it)}.`
      );
    }

    let message = "Impuestos calculados correctamente.";

    if (skippedCount > 0) {
      message += ` Se omitieron ${skippedCount} obligaciones ya presentadas, pagadas o anuladas.`;
    }

    utils.showToast(message, "success");
    setAlert(
      `Cálculo informativo realizado. Vencimiento referencial: ${utils.formatDate(result.totals.fechaVencimiento)}.`,
      "info"
    );

    refreshView();
  }

  function renderSummary() {
    const clientId = elements.impuestoFiltroCliente?.value || "";
    const periodoId = elements.impuestoFiltroPeriodo?.value || "";

    if (!clientId || !periodoId) {
      elements.resumenVentas.textContent = utils.formatMoney(0);
      elements.resumenCompras.textContent = utils.formatMoney(0);
      elements.resumenIvaDebito.textContent = utils.formatMoney(0);
      elements.resumenIvaCredito.textContent = utils.formatMoney(0);
      elements.resumenIvaPagar.textContent = utils.formatMoney(0);
      elements.resumenIT.textContent = utils.formatMoney(0);
      elements.resumenTotal.textContent = utils.formatMoney(0);
      elements.resumenVencimiento.textContent = "-";
      return;
    }

    const summary = computeTransactionSummary(clientId, periodoId);
    const taxes = getTaxesByPeriod(clientId, periodoId);
    const obligations = getObligationsByPeriod(clientId, periodoId);

    const ivaDebito = getTaxAmount(taxes, "IVA", "debito_fiscal");
    const ivaCredito = getTaxAmount(taxes, "IVA", "credito_fiscal");
    const ivaPagar = getTaxAmount(taxes, "IVA", "por_pagar");
    const it = getTaxAmount(taxes, "IT", "ventas_brutas");
    const total = round2(ivaPagar + it);

    const pendingObligations = obligations.filter(
      (obl) => !["pagada", "anulada"].includes(obl.estado)
    );

    const nextDue = pendingObligations
      .sort((a, b) =>
        String(a.fechaVencimiento || "").localeCompare(String(b.fechaVencimiento || ""))
      )[0];

    elements.resumenVentas.textContent = utils.formatMoney(summary.ventas);
    elements.resumenCompras.textContent = utils.formatMoney(summary.compras);
    elements.resumenIvaDebito.textContent = utils.formatMoney(ivaDebito);
    elements.resumenIvaCredito.textContent = utils.formatMoney(ivaCredito);
    elements.resumenIvaPagar.textContent = utils.formatMoney(ivaPagar);
    elements.resumenIT.textContent = utils.formatMoney(it);
    elements.resumenTotal.textContent = utils.formatMoney(total);
    elements.resumenVencimiento.textContent = nextDue
      ? utils.formatDate(nextDue.fechaVencimiento)
      : taxes.length
      ? utils.formatDate(dueDateForPeriod(
          getPeriodById(periodoId)?.mes,
          getPeriodById(periodoId)?.anio
        ))
      : "-";
  }

  function renderTaxesTable() {
    if (!elements.tablaImpuestos) return;

    const clientId = elements.impuestoFiltroCliente?.value || "";
    const periodoId = elements.impuestoFiltroPeriodo?.value || "";

    if (!clientId || !periodoId) {
      elements.tablaImpuestos.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted py-4">
            Seleccione un cliente y periodo para ver impuestos.
          </td>
        </tr>
      `;
      return;
    }

    const taxes = getTaxesByPeriod(clientId, periodoId).sort((a, b) => {
      const tipoOrder = { IVA: 1, IT: 2, RC_IVA: 3, IUE: 4, OTRO: 5 };
      const ta = tipoOrder[a.tipo] || 9;
      const tb = tipoOrder[b.tipo] || 9;

      if (ta !== tb) return ta - tb;

      return String(a.concepto || "").localeCompare(String(b.concepto || ""));
    });

    if (!taxes.length) {
      elements.tablaImpuestos.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted py-4">
            Todavía no hay impuestos calculados para este periodo.
            Pulse “Calcular impuestos”.
          </td>
        </tr>
      `;
      return;
    }

    elements.tablaImpuestos.innerHTML = taxes
      .map((tax) => {
        const concepto = conceptLabels[tax.concepto] || tax.concepto || "-";

        return `
          <tr>
            <td><code>${utils.escapeHTML(tax.id)}</code></td>
            <td><strong>${utils.escapeHTML(tax.tipo || "-")}</strong></td>
            <td>${utils.escapeHTML(concepto)}</td>
            <td>${utils.escapeHTML(utils.formatMoney(tax.baseImponible))}</td>
            <td>${utils.escapeHTML(formatRate(tax.tasa))}</td>
            <td>${utils.escapeHTML(utils.formatMoney(tax.monto))}</td>
            <td>${utils.escapeHTML(utils.formatDate(tax.fechaCalculo))}</td>
          </tr>
        `;
      })
      .join("");
  }

  function obligationStateBadge(estado) {
    const safe = String(estado || "").toLowerCase();

    if (safe === "pendiente") {
      return '<span class="badge cc-status-pendiente">Pendiente</span>';
    }

    if (safe === "en_proceso") {
      return '<span class="badge cc-status-en_proceso">En proceso</span>';
    }

    if (safe === "presentada") {
      return '<span class="badge bg-primary">Presentada</span>';
    }

    if (safe === "pagada") {
      return '<span class="badge cc-status-pagada">Pagada</span>';
    }

    if (safe === "vencida") {
      return '<span class="badge cc-status-vencida">Vencida</span>';
    }

    if (safe === "anulada") {
      return '<span class="badge cc-status-inactivo">Anulada</span>';
    }

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function renderObligationsTable() {
    if (!elements.tablaObligaciones) return;

    const clientId = elements.impuestoFiltroCliente?.value || "";
    const periodoId = elements.impuestoFiltroPeriodo?.value || "";

    if (!clientId || !periodoId) {
      elements.tablaObligaciones.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted py-4">
            Seleccione un cliente y periodo para ver obligaciones.
          </td>
        </tr>
      `;
      return;
    }

    const obligations = getObligationsByPeriod(clientId, periodoId).sort((a, b) =>
      String(a.fechaVencimiento || "").localeCompare(String(b.fechaVencimiento || ""))
    );

    if (!obligations.length) {
      elements.tablaObligaciones.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted py-4">
            Todavía no hay obligaciones generadas para este periodo.
          </td>
        </tr>
      `;
      return;
    }

    elements.tablaObligaciones.innerHTML = obligations
      .map((obl) => {
        const locked = ["pagada", "anulada"].includes(obl.estado);

        const presentButton =
          !locked && ["pendiente", "en_proceso", "vencida"].includes(obl.estado)
            ? `<button
                  class="btn btn-outline-primary"
                  type="button"
                  data-action="presentar"
                  data-id="${utils.escapeHTML(obl.id)}"
                  title="Marcar como presentada"
                >
                  <i class="bi bi-send-check"></i>
                </button>`
            : "";

        const payButton =
          !locked && ["pendiente", "en_proceso", "presentada", "vencida"].includes(obl.estado)
            ? `<button
                  class="btn btn-outline-success"
                  type="button"
                  data-action="pagar"
                  data-id="${utils.escapeHTML(obl.id)}"
                  title="Marcar como pagada"
                >
                  <i class="bi bi-cash-check"></i>
                </button>`
            : "";

        const voidButton =
          !locked
            ? `<button
                  class="btn btn-outline-danger"
                  type="button"
                  data-action="anular"
                  data-id="${utils.escapeHTML(obl.id)}"
                  title="Anular obligación"
                >
                  <i class="bi bi-x-octagon"></i>
                </button>`
            : "";

        return `
          <tr>
            <td><code>${utils.escapeHTML(obl.id)}</code></td>
            <td>${utils.escapeHTML(getClientName(obl.clienteId))}</td>
            <td>${utils.escapeHTML(periodLabel(getPeriodById(obl.periodoId)))}</td>
            <td><strong>${utils.escapeHTML(obl.tipo || "-")}</strong></td>
            <td>${utils.escapeHTML(obl.descripcion || "-")}</td>
            <td>${utils.escapeHTML(utils.formatDate(obl.fechaVencimiento))}</td>
            <td>${utils.escapeHTML(utils.formatMoney(obl.montoEstimado))}</td>
            <td>${obligationStateBadge(obl.estado)}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm" role="group">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  data-action="ver"
                  data-id="${utils.escapeHTML(obl.id)}"
                  title="Ver ficha"
                >
                  <i class="bi bi-eye"></i>
                </button>
                ${presentButton}
                ${payButton}
                ${voidButton}
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function refreshView() {
    renderSummary();
    renderTaxesTable();
    renderObligationsTable();
  }

  function loadPeriodOptions(clientId, selectedPeriodId = null) {
    if (!elements.impuestoFiltroPeriodo) return;

    if (!clientId) {
      populateSelect(
        elements.impuestoFiltroPeriodo,
        [],
        "Seleccione primero un cliente..."
      );
      return;
    }

    const periods = getPeriods()
      .filter((period) => period.clienteId === clientId)
      .sort((a, b) => {
        if (Number(b.anio) !== Number(a.anio)) {
          return Number(b.anio) - Number(a.anio);
        }
        return Number(b.mes) - Number(a.mes);
      });

    populateSelect(
      elements.impuestoFiltroPeriodo,
      periods.map((period) => ({
        value: period.id,
        label: periodLabel(period)
      })),
      "Seleccione..."
    );

    if (selectedPeriodId) {
      const exists = periods.some((period) => period.id === selectedPeriodId);
      if (exists) {
        elements.impuestoFiltroPeriodo.value = selectedPeriodId;
      }
    }
  }

  function populateClients() {
    const clients = getClients().sort((a, b) =>
      String(a.nombreComercial || "").localeCompare(String(b.nombreComercial || ""))
    );

    populateSelect(
      elements.impuestoFiltroCliente,
      clients.map((client) => ({
        value: client.id,
        label: `${client.nombreComercial} (${client.id})`
      })),
      "Seleccione un cliente..."
    );
  }

  function autoSelectDefault() {
    const clients = getClients().filter((client) => client.estado === "activo");

    if (!clients.length) return;

    const firstClient = clients[0];
    elements.impuestoFiltroCliente.value = firstClient.id;

    loadPeriodOptions(firstClient.id);

    const periods = getPeriods()
      .filter((period) => period.clienteId === firstClient.id)
      .sort((a, b) => {
        if (Number(b.anio) !== Number(a.anio)) {
          return Number(b.anio) - Number(a.anio);
        }
        return Number(b.mes) - Number(a.mes);
      });

    if (periods.length) {
      elements.impuestoFiltroPeriodo.value = periods[0].id;
    }
  }

  function setObligationState(id, estado) {
    const obl = storage.get("obligations", id);

    if (!obl) {
      utils.showToast("Obligación no encontrada.", "danger");
      return;
    }

    if (["pagada", "anulada"].includes(obl.estado)) {
      utils.showToast("No se puede modificar una obligación pagada o anulada.", "warning");
      return;
    }

    if (obl.estado === estado) {
      utils.showToast("La obligación ya está en ese estado.", "info");
      return;
    }

    const labels = {
      presentada: "presentar",
      pagada: "pagar",
      anulada: "anular"
    };

    const ok = utils.confirmDialog(
      `¿Seguro que deseas ${labels[estado] || "cambiar estado"} la obligación ${obl.id}?`
    );

    if (!ok) return;

    storage.update("obligations", id, { estado });

    if (bitacora) {
      bitacora.log(
        `obligacion_${estado}`,
        "obligations",
        id,
        `Obligación ${id} marcada como ${estado}`
      );
    }

    utils.showToast(`Obligación marcada como ${estado}.`, "success");
    refreshView();
  }

  function viewObligation(id) {
    const obl = storage.get("obligations", id);

    if (!obl) {
      utils.showToast("Obligación no encontrada.", "danger");
      return;
    }

    const client = getClientById(obl.clienteId);
    const period = getPeriodById(obl.periodoId);

    elements.detalleContenido.innerHTML = `
      <div class="row g-3">
        <div class="col-12">
          <h3 class="h5 fw-bold mb-1">
            ${utils.escapeHTML(obl.tipo || "Obligación")}
          </h3>
          <p class="text-muted mb-0">
            ${utils.escapeHTML(obl.id)} · ${utils.escapeHTML(client ? client.nombreComercial : "Cliente no encontrado")}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Cliente</p>
            <strong>${utils.escapeHTML(client ? client.nombreComercial : "-")}</strong>
            <small class="d-block text-muted">
              ${utils.escapeHTML(obl.clienteId)}
            </small>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Periodo</p>
            <strong>${utils.escapeHTML(period ? periodLabel(period) : "-")}</strong>
            <small class="d-block text-muted">
              ${utils.escapeHTML(obl.periodoId)}
            </small>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Descripción</p>
            <strong>${utils.escapeHTML(obl.descripcion || "-")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Fecha de vencimiento referencial</p>
            <strong>${utils.escapeHTML(utils.formatDate(obl.fechaVencimiento))}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Monto estimado</p>
            <strong>${utils.escapeHTML(utils.formatMoney(obl.montoEstimado))}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Estado</p>
            ${obligationStateBadge(obl.estado)}
          </div>
        </div>

        <div class="col-12">
          <div class="alert alert-info mb-0">
            <strong>Recuerde:</strong>
            este monto es informativo y preventivo. La declaración oficial debe realizarse
            conforme a normativa vigente del SIN y, cuando corresponda, con intervención
            de un profesional habilitado.
          </div>
        </div>
      </div>
    `;

    showDetalleModal();
  }

  function bindEvents() {
    elements.btnCalcularImpuestos?.addEventListener("click", calculate);
    elements.btnRefrescarImpuestos?.addEventListener("click", refreshView);

    elements.impuestoFiltroCliente?.addEventListener("change", () => {
      loadPeriodOptions(elements.impuestoFiltroCliente.value);
      refreshView();
    });

    elements.impuestoFiltroPeriodo?.addEventListener("change", refreshView);

    elements.tablaObligaciones?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) return;

      const action = button.dataset.action;
      const id = button.dataset.id;

      if (action === "ver") viewObligation(id);
      if (action === "presentar") setObligationState(id, "presentada");
      if (action === "pagar") setObligationState(id, "pagada");
      if (action === "anular") setObligationState(id, "anulada");
    });
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    cacheElements();
    populateClients();
    autoSelectDefault();
    bindEvents();
    refreshView();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    refreshView
  };
})();