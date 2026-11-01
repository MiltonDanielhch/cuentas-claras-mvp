/* =========================================================
   Cuentas Claras MVP
   Módulo de impuestos y obligaciones tributarias
   Fase 13.1
   ------------------------------------------------------------
   ✅ MANTIENE:
   - IT calculado sobre ventas + otros ingresos (46,50 en enero).
   - Suma anual = 1.484.
   - 12 taxes mensuales.
   - Compatibilidad con ambos conceptos de IT.

   ✅ NUEVO:
   - Cuentas Claras (CLI-0004) por defecto.
   - Diciembre por defecto (donde están los 12 meses).
   - Panel "Resumen anual" con los 12 meses.
   - Panel "Guía tributaria Bolivia" con CC_IMPUESTOS_BOLIVIA.
   ========================================================= */

window.CC_IMPUESTOS = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const bitacora = window.CC_BITACORA;
  const impuestosBolivia = window.CC_IMPUESTOS_BOLIVIA;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const conceptLabels = {
    debito_fiscal: "Débito fiscal",
    credito_fiscal: "Crédito fiscal",
    por_pagar: "Por pagar",
    ventas_brutas: "Ventas brutas",
    ventas_mas_otros_ingresos: "Ventas + otros ingresos",
    referencia: "Referencia",
    otro: "Otro"
  };

  const IT_CONCEPTOS = ["ventas_brutas", "ventas_mas_otros_ingresos"];

  const elements = {};

  function cacheElements() {
    elements.impuestoFiltroCliente = document.getElementById("impuestoFiltroCliente");
    elements.impuestoFiltroPeriodo = document.getElementById("impuestoFiltroPeriodo");
    elements.btnCalcularImpuestos = document.getElementById("btnCalcularImpuestos");
    elements.btnRefrescarImpuestos = document.getElementById("btnRefrescarImpuestos");
    elements.btnCalcularTodosPeriodos = document.getElementById("btnCalcularTodosPeriodos");
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

    // Paneles nuevos
    elements.tablaResumenAnual = document.getElementById("tablaResumenAnual");
    elements.guiaTributariaBody = document.getElementById("guiaTributariaBody");
    elements.selectRegimenGuia = document.getElementById("selectRegimenGuia");
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
    if (currentValue) selectEl.value = currentValue;
  }

  function round2(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }

  function formatRate(rate) {
    const num = Number(rate) || 0;
    const pct = num * 100;
    if (Number.isInteger(pct)) return `${pct}%`;
    return `${pct.toFixed(2)}%`;
  }

  function getClients() { return storage.list("clients"); }
  function getClientById(id) { return storage.get("clients", id); }
  function getClientName(id) {
    const client = getClientById(id);
    return client ? client.nombreComercial : "Cliente no encontrado";
  }
  function getPeriods() { return storage.list("periods"); }
  function getPeriodById(id) { return storage.get("periods", id); }

  function periodLabel(period) {
    if (!period) return "-";
    const name = monthNames[Number(period.mes) - 1] || "Mes inválido";
    return `${name} ${period.anio}`;
  }

  function dueDateForPeriod(mes, anio) {
    let dueMonth = Number(mes) + 1;
    let dueYear = Number(anio);
    if (dueMonth > 12) { dueMonth = 1; dueYear += 1; }
    const day = Number(cfg.genericDueDay) || 20;
    return `${dueYear}-${utils.pad2(dueMonth)}-${utils.pad2(day)}`;
  }

  function getTransactionsByPeriod(clientId, periodoId) {
    return storage.list("transactions").filter(
      (trx) => trx.clienteId === clientId && trx.periodoId === periodoId && trx.estado === "activa"
    );
  }

  function getTaxesByPeriod(clientId, periodoId) {
    return storage.list("taxes").filter(
      (tax) => tax.clienteId === clientId && tax.periodoId === periodoId
    );
  }

  function getObligationsByPeriod(clientId, periodoId) {
    return storage.list("obligations").filter(
      (obl) => obl.clienteId === clientId && obl.periodoId === periodoId
    );
  }

  function sumByType(transactions, type) {
    return transactions
      .filter((trx) => trx.tipo === type)
      .reduce((total, trx) => total + (Number(trx.monto) || 0), 0);
  }

  function getTaxAmount(taxes, tipo, concepto) {
    if (tipo === "IT") {
      const found = taxes.find(
        (tax) => tax.tipo === "IT" && IT_CONCEPTOS.includes(tax.concepto)
      );
      return found ? Number(found.monto) || 0 : 0;
    }
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
      ventas, compras, gastos, ingresos,
      utilidadEstimada: round2(ventas + ingresos - compras - gastos)
    };
  }

  function computeTaxes(clientId, periodoId) {
    const client = getClientById(clientId);
    const period = getPeriodById(periodoId);
    if (!client || !period) return null;

    const summary = computeTransactionSummary(clientId, periodoId);
    const regimen = client.regimenTributario || "Por definir";
    const esSimplificado = regimen === "Régimen Simplificado";
    const tasas = cfg.taxRates;
    const taxes = [];
    const obligations = [];

    let ivaDebito = 0, ivaCredito = 0, ivaPagar = 0, it = 0;
    const baseIT = round2(summary.ventas + summary.ingresos);

    if (!esSimplificado) {
      ivaDebito = round2(summary.ventas * tasas.IVA);
      ivaCredito = round2(summary.compras * tasas.IVA);
      ivaPagar = round2(Math.max(ivaDebito - ivaCredito, 0));

      if (summary.ventas > 0) {
        taxes.push({ tipo: "IVA", concepto: "debito_fiscal", baseImponible: summary.ventas, tasa: tasas.IVA, monto: ivaDebito });
      }
      if (summary.compras > 0) {
        taxes.push({ tipo: "IVA", concepto: "credito_fiscal", baseImponible: summary.compras, tasa: tasas.IVA, monto: ivaCredito });
      }
      if (ivaPagar > 0) {
        taxes.push({ tipo: "IVA", concepto: "por_pagar", baseImponible: round2(Math.max(summary.ventas - summary.compras, 0)), tasa: tasas.IVA, monto: ivaPagar });
        obligations.push({ tipo: "IVA", descripcion: "Declaración mensual IVA", montoEstimado: ivaPagar });
      }
    }

    it = round2(baseIT * tasas.IT);
    if (it > 0) {
      taxes.push({ tipo: "IT", concepto: "ventas_mas_otros_ingresos", baseImponible: baseIT, tasa: tasas.IT, monto: it });
      obligations.push({ tipo: "IT", descripcion: "Declaración mensual IT", montoEstimado: it });
    }

    const fechaVencimiento = dueDateForPeriod(period.mes, period.anio);
    obligations.forEach((obl) => {
      obl.clienteId = clientId;
      obl.periodoId = periodoId;
      obl.fechaVencimiento = fechaVencimiento;
    });

    return {
      client, period, regimen, esSimplificado, summary, taxes, obligations,
      totals: { ivaDebito, ivaCredito, ivaPagar, it, baseIT, totalEstimado: round2(ivaPagar + it), fechaVencimiento }
    };
  }

  function saveTaxesForPeriod(clientId, periodoId, taxes) {
    const all = storage.list("taxes");
    const saved = [];
    taxes.forEach((tax) => {
      const existing = all.find(
        (t) => t.clienteId === clientId && t.periodoId === periodoId &&
               t.tipo === tax.tipo && t.concepto === tax.concepto
      );
      if (existing) {
        const updated = storage.update("taxes", existing.id, {
          baseImponible: tax.baseImponible, tasa: tax.tasa, monto: tax.monto,
          fechaCalculo: utils.todayISO()
        });
        saved.push(updated);
      } else {
        const created = storage.create("taxes", {
          ...tax, clienteId: clientId, periodoId: periodoId, fechaCalculo: utils.todayISO()
        }, "IMP");
        saved.push(created);
      }
    });
    return saved;
  }

  function upsertObligation(data) {
    const obligations = storage.list("obligations");
    const existing = obligations.find(
      (obl) => obl.clienteId === data.clienteId && obl.periodoId === data.periodoId && obl.tipo === data.tipo
    );
    if (existing) {
      const lockedStates = ["presentada", "pagada", "anulada"];
      if (lockedStates.includes(existing.estado)) {
        return { created: false, updated: false, skipped: true, obligation: existing };
      }
      const updated = storage.update("obligations", existing.id, {
        descripcion: data.descripcion, fechaVencimiento: data.fechaVencimiento, montoEstimado: data.montoEstimado
      });
      return { created: false, updated: true, skipped: false, obligation: updated };
    }
    const created = storage.create("obligations", { ...data, estado: "pendiente" }, "OBL");
    return { created: true, updated: false, skipped: false, obligation: created };
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
      utils.showToast("No se pudo calcular.", "danger");
      return;
    }
    saveTaxesForPeriod(clientId, periodoId, result.taxes);

    let createdCount = 0, skippedCount = 0;
    result.obligations.forEach((obl) => {
      const action = upsertObligation(obl);
      if (action.created) createdCount++;
      if (action.skipped) skippedCount++;
    });

    if (bitacora) {
      bitacora.log("calcular_impuestos", "taxes", periodoId,
        `Cálculo para ${getClientName(clientId)} · ${periodLabel(result.period)}. IT: ${utils.formatMoney(result.totals.it)}.`);
    }

    utils.showToast("Impuestos calculados.", "success");
    setAlert(
      `Cálculo informativo. IT: ${utils.formatMoney(result.totals.it)} sobre base de ${utils.formatMoney(result.totals.baseIT)}. Vence: ${utils.formatDate(result.totals.fechaVencimiento)}.`,
      "info"
    );
    refreshView();
  }

  function calculateAllPeriods(event) {
    if (event) event.preventDefault();
    const clientId = elements.impuestoFiltroCliente?.value || "";
    if (!clientId) {
      utils.showToast("Seleccione un cliente.", "warning");
      return;
    }
    const periods = getPeriods().filter((p) => p.clienteId === clientId);
    if (!periods.length) {
      utils.showToast("Este cliente no tiene periodos.", "info");
      return;
    }
    let totalTaxes = 0, totalOblig = 0;
    periods.forEach((period) => {
      const result = computeTaxes(clientId, period.id);
      if (!result) return;
      saveTaxesForPeriod(clientId, period.id, result.taxes);
      totalTaxes += result.taxes.length;
      result.obligations.forEach((obl) => {
        const action = upsertObligation(obl);
        if (action.created) totalOblig++;
      });
    });
    utils.showToast(`Cálculo completado: ${totalTaxes} impuestos y ${totalOblig} obligaciones en ${periods.length} periodos.`, "success");
    refreshView();
  }

  function renderSummary() {
    const clientId = elements.impuestoFiltroCliente?.value || "";
    const periodoId = elements.impuestoFiltroPeriodo?.value || "";
    if (!clientId || !periodoId) {
      [elements.resumenVentas, elements.resumenCompras, elements.resumenIvaDebito,
       elements.resumenIvaCredito, elements.resumenIvaPagar, elements.resumenIT,
       elements.resumenTotal].forEach(el => { if (el) el.textContent = utils.formatMoney(0); });
      if (elements.resumenVencimiento) elements.resumenVencimiento.textContent = "-";
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

    const pendingObligations = obligations.filter((obl) => !["pagada", "anulada"].includes(obl.estado));
    const nextDue = pendingObligations.sort((a, b) =>
      String(a.fechaVencimiento || "").localeCompare(String(b.fechaVencimiento || ""))
    )[0];

    if (elements.resumenVentas) elements.resumenVentas.textContent = utils.formatMoney(summary.ventas);
    if (elements.resumenCompras) elements.resumenCompras.textContent = utils.formatMoney(summary.compras);
    if (elements.resumenIvaDebito) elements.resumenIvaDebito.textContent = utils.formatMoney(ivaDebito);
    if (elements.resumenIvaCredito) elements.resumenIvaCredito.textContent = utils.formatMoney(ivaCredito);
    if (elements.resumenIvaPagar) elements.resumenIvaPagar.textContent = utils.formatMoney(ivaPagar);
    if (elements.resumenIT) elements.resumenIT.textContent = utils.formatMoney(it);
    if (elements.resumenTotal) elements.resumenTotal.textContent = utils.formatMoney(total);
    if (elements.resumenVencimiento) {
      elements.resumenVencimiento.textContent = nextDue
        ? utils.formatDate(nextDue.fechaVencimiento)
        : taxes.length ? utils.formatDate(dueDateForPeriod(getPeriodById(periodoId)?.mes, getPeriodById(periodoId)?.anio)) : "-";
    }
  }

  function renderTaxesTable() {
    if (!elements.tablaImpuestos) return;
    const clientId = elements.impuestoFiltroCliente?.value || "";
    const periodoId = elements.impuestoFiltroPeriodo?.value || "";
    if (!clientId || !periodoId) {
      elements.tablaImpuestos.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Seleccione un cliente y periodo.</td></tr>`;
      return;
    }
    const taxes = getTaxesByPeriod(clientId, periodoId).sort((a, b) => {
      const tipoOrder = { IVA: 1, IT: 2, RC_IVA: 3, IUE: 4, OTRO: 5 };
      const ta = tipoOrder[a.tipo] || 9, tb = tipoOrder[b.tipo] || 9;
      if (ta !== tb) return ta - tb;
      return String(a.concepto || "").localeCompare(String(b.concepto || ""));
    });
    if (!taxes.length) {
      elements.tablaImpuestos.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Todavía no hay impuestos calculados. Pulse "Calcular impuestos".</td></tr>`;
      return;
    }
    elements.tablaImpuestos.innerHTML = taxes.map((tax) => {
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
        </tr>`;
    }).join("");
  }

  function obligationStateBadge(estado) {
    const safe = String(estado || "").toLowerCase();
    if (safe === "pendiente") return '<span class="badge cc-status-pendiente">Pendiente</span>';
    if (safe === "en_proceso") return '<span class="badge cc-status-en_proceso">En proceso</span>';
    if (safe === "presentada") return '<span class="badge bg-primary">Presentada</span>';
    if (safe === "pagada") return '<span class="badge cc-status-pagada">Pagada</span>';
    if (safe === "vencida") return '<span class="badge cc-status-vencida">Vencida</span>';
    if (safe === "anulada") return '<span class="badge cc-status-inactivo">Anulada</span>';
    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function renderObligationsTable() {
    if (!elements.tablaObligaciones) return;
    const clientId = elements.impuestoFiltroCliente?.value || "";
    const periodoId = elements.impuestoFiltroPeriodo?.value || "";
    if (!clientId || !periodoId) {
      elements.tablaObligaciones.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">Seleccione un cliente y periodo.</td></tr>`;
      return;
    }
    const obligations = getObligationsByPeriod(clientId, periodoId).sort((a, b) =>
      String(a.fechaVencimiento || "").localeCompare(String(b.fechaVencimiento || ""))
    );
    if (!obligations.length) {
      elements.tablaObligaciones.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">Todavía no hay obligaciones generadas para este periodo.</td></tr>`;
      return;
    }
    elements.tablaObligaciones.innerHTML = obligations.map((obl) => {
      const locked = ["pagada", "anulada"].includes(obl.estado);
      const presentButton = !locked && ["pendiente", "en_proceso", "vencida"].includes(obl.estado)
        ? `<button class="btn btn-outline-primary" type="button" data-action="presentar" data-id="${utils.escapeHTML(obl.id)}" title="Presentar"><i class="bi bi-send-check"></i></button>` : "";
      const payButton = !locked && ["pendiente", "en_proceso", "presentada", "vencida"].includes(obl.estado)
        ? `<button class="btn btn-outline-success" type="button" data-action="pagar" data-id="${utils.escapeHTML(obl.id)}" title="Pagar"><i class="bi bi-cash-check"></i></button>` : "";
      const voidButton = !locked
        ? `<button class="btn btn-outline-danger" type="button" data-action="anular" data-id="${utils.escapeHTML(obl.id)}" title="Anular"><i class="bi bi-x-octagon"></i></button>` : "";
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
              <button class="btn btn-outline-secondary" type="button" data-action="ver" data-id="${utils.escapeHTML(obl.id)}" title="Ver"><i class="bi bi-eye"></i></button>
              ${presentButton}${payButton}${voidButton}
            </div>
          </td>
        </tr>`;
    }).join("");
  }

  /* ---------------------------------------------------------
     ✅ NUEVO: Resumen anual de los 12 meses
     --------------------------------------------------------- */
  function renderResumenAnual() {
    if (!elements.tablaResumenAnual) return;
    const clientId = elements.impuestoFiltroCliente?.value || "";
    if (!clientId) {
      elements.tablaResumenAnual.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Seleccione un cliente.</td></tr>`;
      return;
    }

    const periods = getPeriods()
      .filter((p) => p.clienteId === clientId)
      .sort((a, b) => Number(a.mes) - Number(b.mes));

    if (!periods.length) {
      elements.tablaResumenAnual.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Sin periodos.</td></tr>`;
      return;
    }

    let totalIT = 0, totalIVA = 0, totalGeneral = 0;
    const filas = periods.map((period) => {
      const taxes = getTaxesByPeriod(clientId, period.id);
      const summary = computeTransactionSummary(clientId, period.id);
      const it = getTaxAmount(taxes, "IT", "ventas_brutas");
      const iva = getTaxAmount(taxes, "IVA", "por_pagar");
      const baseIT = summary.ventas + summary.ingresos;
      const total = round2(it + iva);

      totalIT += it;
      totalIVA += iva;
      totalGeneral += total;

      const estado = taxes.length > 0
        ? '<span class="badge cc-status-activo">Calculado</span>'
        : '<span class="badge cc-status-pendiente">Pendiente</span>';

      return `
        <tr>
          <td><strong>${utils.escapeHTML(periodLabel(period))}</strong></td>
          <td class="text-end">${utils.escapeHTML(utils.formatMoney(baseIT))}</td>
          <td class="text-end">${utils.escapeHTML(utils.formatMoney(it))}</td>
          <td class="text-end">${utils.escapeHTML(utils.formatMoney(iva))}</td>
          <td class="text-end fw-semibold">${utils.escapeHTML(utils.formatMoney(total))}</td>
          <td>${estado}</td>
        </tr>`;
    });

    const filaTotal = `
      <tr class="table-light fw-semibold">
        <td class="text-end">TOTALES ANUALES</td>
        <td class="text-end">—</td>
        <td class="text-end">${utils.escapeHTML(utils.formatMoney(totalIT))}</td>
        <td class="text-end">${utils.escapeHTML(utils.formatMoney(totalIVA))}</td>
        <td class="text-end">${utils.escapeHTML(utils.formatMoney(totalGeneral))}</td>
        <td></td>
      </tr>`;

    elements.tablaResumenAnual.innerHTML = filas.join("") + filaTotal;
  }

  /* ---------------------------------------------------------
     ✅ NUEVO: Guía tributaria de Bolivia
     --------------------------------------------------------- */
  function renderGuiaTributaria() {
    if (!elements.guiaTributariaBody) return;
    if (!impuestosBolivia) {
      elements.guiaTributariaBody.innerHTML = `<div class="alert alert-warning mb-0">No se cargó js/config-impuestos-bolivia.js</div>`;
      return;
    }

    const regimenId = elements.selectRegimenGuia?.value || "general";
    const guia = impuestosBolivia.getGuia(regimenId);
    const regimen = impuestosBolivia.describeRegimen(regimenId);

    let html = `
      <div class="row g-3 mb-3">
        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <h6 class="fw-semibold mb-2">
              <i class="bi ${regimen.icono} me-1 text-${regimen.color}"></i>
              ${utils.escapeHTML(regimen.nombre)} (${utils.escapeHTML(regimen.sigla)})
            </h6>
            <p class="small mb-0">${utils.escapeHTML(regimen.descripcion)}</p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <h6 class="fw-semibold mb-2"><i class="bi bi-file-earmark-text me-1"></i>Formularios aplicables</h6>
            <ul class="mb-0 small">
              ${(regimen.formularios || []).map((f) => `<li>Formulario ${utils.escapeHTML(f)}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
      <h6 class="fw-semibold mb-2"><i class="bi bi-list-check me-1"></i>${utils.escapeHTML(guia.titulo)}</h6>
      <ol class="small">
        ${(guia.pasos || []).map((p) => `<li>${utils.escapeHTML(p)}</li>`).join("")}
      </ol>
      <div class="alert alert-secondary small mb-0">
        <strong>Recordatorio:</strong> ${utils.escapeHTML(impuestosBolivia.facturacionElectronica.nota)}
      </div>
    `;

    elements.guiaTributariaBody.innerHTML = html;
  }

  function refreshView() {
    renderSummary();
    renderTaxesTable();
    renderObligationsTable();
    renderResumenAnual();
    renderGuiaTributaria();
  }

  function loadPeriodOptions(clientId, selectedPeriodId = null) {
    if (!elements.impuestoFiltroPeriodo) return;
    if (!clientId) {
      populateSelect(elements.impuestoFiltroPeriodo, [], "Seleccione primero un cliente...");
      return;
    }
    const periods = getPeriods()
      .filter((period) => period.clienteId === clientId)
      .sort((a, b) => {
        if (Number(b.anio) !== Number(a.anio)) return Number(b.anio) - Number(a.anio);
        return Number(b.mes) - Number(a.mes);
      });
    populateSelect(
      elements.impuestoFiltroPeriodo,
      periods.map((period) => ({ value: period.id, label: periodLabel(period) })),
      "Seleccione..."
    );
    if (selectedPeriodId) {
      const exists = periods.some((period) => period.id === selectedPeriodId);
      if (exists) elements.impuestoFiltroPeriodo.value = selectedPeriodId;
    }
  }

  function populateClients() {
    const clients = getClients().sort((a, b) =>
      String(a.nombreComercial || "").localeCompare(String(b.nombreComercial || ""))
    );
    populateSelect(
      elements.impuestoFiltroCliente,
      clients.map((client) => ({ value: client.id, label: `${client.nombreComercial} (${client.id})` })),
      "Seleccione un cliente..."
    );
  }

  /* ---------------------------------------------------------
     ✅ CORREGIDO: Cuentas Claras (CLI-0004) + Diciembre por defecto
     --------------------------------------------------------- */
  function autoSelectDefault() {
    const clients = getClients().filter((client) => client.estado === "activo");
    if (!clients.length) return;

    // ✅ Preferir Cuentas Claras (CLI-0004) para la demo
    const preferido = clients.find((c) => c.id === "CLI-0004") || clients[0];
    elements.impuestoFiltroCliente.value = preferido.id;

    loadPeriodOptions(preferido.id);

    const periods = getPeriods()
      .filter((period) => period.clienteId === preferido.id)
      .sort((a, b) => {
        if (Number(b.anio) !== Number(a.anio)) return Number(b.anio) - Number(a.anio);
        return Number(b.mes) - Number(a.mes);
      });

    // ✅ Preferir diciembre (donde están los 12 meses calculados)
    const diciembre = periods.find((p) => Number(p.mes) === 12);
    if (diciembre) {
      elements.impuestoFiltroPeriodo.value = diciembre.id;
    } else if (periods.length) {
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
    const labels = { presentada: "presentar", pagada: "pagar", anulada: "anular" };
    if (!utils.confirmDialog(`¿Seguro que deseas ${labels[estado] || "cambiar estado"} la obligación ${obl.id}?`)) return;

    storage.update("obligations", id, { estado });
    if (bitacora) bitacora.log(`obligacion_${estado}`, "obligations", id, `Obligación ${id} marcada como ${estado}`);
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
          <h3 class="h5 fw-bold mb-1">${utils.escapeHTML(obl.tipo || "Obligación")}</h3>
          <p class="text-muted mb-0">${utils.escapeHTML(obl.id)} · ${utils.escapeHTML(client ? client.nombreComercial : "Cliente no encontrado")}</p>
        </div>
        <div class="col-12 col-md-6"><div class="border rounded p-3 h-100"><p class="small text-muted mb-1">Cliente</p><strong>${utils.escapeHTML(client ? client.nombreComercial : "-")}</strong></div></div>
        <div class="col-12 col-md-6"><div class="border rounded p-3 h-100"><p class="small text-muted mb-1">Periodo</p><strong>${utils.escapeHTML(period ? periodLabel(period) : "-")}</strong></div></div>
        <div class="col-12 col-md-6"><div class="border rounded p-3 h-100"><p class="small text-muted mb-1">Descripción</p><strong>${utils.escapeHTML(obl.descripcion || "-")}</strong></div></div>
        <div class="col-12 col-md-6"><div class="border rounded p-3 h-100"><p class="small text-muted mb-1">Vencimiento</p><strong>${utils.escapeHTML(utils.formatDate(obl.fechaVencimiento))}</strong></div></div>
        <div class="col-12 col-md-6"><div class="border rounded p-3 h-100"><p class="small text-muted mb-1">Monto estimado</p><strong>${utils.escapeHTML(utils.formatMoney(obl.montoEstimado))}</strong></div></div>
        <div class="col-12 col-md-6"><div class="border rounded p-3 h-100"><p class="small text-muted mb-1">Estado</p>${obligationStateBadge(obl.estado)}</div></div>
        <div class="col-12"><div class="alert alert-info mb-0 small"><strong>Recuerde:</strong> este monto es informativo. La declaración oficial debe realizarse conforme a normativa vigente del SIN.</div></div>
      </div>`;
    getModalInstance(elements.detalleModalEl).show();
  }

  function getModalInstance(el) {
    return bootstrap.Modal.getOrCreateInstance(el);
  }

  function bindEvents() {
    elements.btnCalcularImpuestos?.addEventListener("click", calculate);
    elements.btnRefrescarImpuestos?.addEventListener("click", refreshView);
    elements.btnCalcularTodosPeriodos?.addEventListener("click", calculateAllPeriods);
    elements.selectRegimenGuia?.addEventListener("change", renderGuiaTributaria);

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
    refreshView,
    calculateAllPeriods,
    renderResumenAnual,
    renderGuiaTributaria
  };
})();