/* =========================================================
   Cuentas Claras MVP
   Módulo de reporte mensual en lenguaje sencillo
   Fase 11
   ========================================================= */

window.CC_REPORTES = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const bitacora = window.CC_BITACORA;
  const costos = window.CC_COSTOS;

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

  const elements = {};

  function cacheElements() {
    elements.repFiltroCliente = document.getElementById("repFiltroCliente");
    elements.repFiltroPeriodo = document.getElementById("repFiltroPeriodo");
    elements.repEstadoPeriodo = document.getElementById("repEstadoPeriodo");
    elements.repAlerta = document.getElementById("repAlerta");
    elements.repEncabezadoImpresion = document.getElementById("repEncabezadoImpresion");

    elements.btnGenerarReporte = document.getElementById("btnGenerarReporte");
    elements.btnImprimirReporte = document.getElementById("btnImprimirReporte");
    elements.btnRefrescarReportes = document.getElementById("btnRefrescarReportes");

    elements.reporteContenido = document.getElementById("reporteContenido");
    elements.tablaReportes = document.getElementById("tablaReportes");
  }

  function round2(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }

  function money(value) {
    return utils.formatMoney(round2(value || 0));
  }

  function percentText(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "No calculable";
    }

    return `${Number(value).toFixed(2)}%`;
  }

  function ratioText(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "No calculable";
    }

    return Number(value).toFixed(2);
  }

  function setAlert(message, type = "info") {
    if (!elements.repAlerta) return;

    if (!message) {
      elements.repAlerta.classList.add("d-none");
      elements.repAlerta.textContent = "";
      return;
    }

    elements.repAlerta.className = `alert alert-${type} mt-3 mb-0 small`;
    elements.repAlerta.textContent = message;
    elements.repAlerta.classList.remove("d-none");
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

  function periodLabel(period) {
    if (!period) return "-";
    const name = monthNames[Number(period.mes) - 1] || "Mes inválido";
    return `${name} ${period.anio}`;
  }

  function getClientName(clientId) {
    const client = storage.get("clients", clientId);
    return client ? client.nombreComercial : "Cliente no encontrado";
  }

  function getPeriod(id) {
    return storage.get("periods", id);
  }

  function renderPeriodState(period) {
    if (!elements.repEstadoPeriodo) return;

    if (!period) {
      elements.repEstadoPeriodo.className = "badge bg-secondary w-100 text-center py-2";
      elements.repEstadoPeriodo.textContent = "Sin periodo";
      return;
    }

    const estado = String(period.estado || "").toLowerCase();

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

    elements.repEstadoPeriodo.className = `badge ${cls} w-100 text-center py-2`;
    elements.repEstadoPeriodo.textContent = label;
  }

  function loadClients() {
    const clients = storage
      .list("clients")
      .sort((a, b) =>
        String(a.nombreComercial || "").localeCompare(String(b.nombreComercial || ""))
      );

    populateSelect(
      elements.repFiltroCliente,
      clients.map((c) => ({
        value: c.id,
        label: `${c.nombreComercial} (${c.id})`
      })),
      "Seleccione un cliente..."
    );
  }

  function loadPeriods(clientId) {
    if (!clientId) {
      populateSelect(elements.repFiltroPeriodo, [], "Seleccione primero un cliente...");
      return;
    }

    const periods = storage
      .list("periods")
      .filter((p) => p.clienteId === clientId)
      .sort((a, b) => {
        if (Number(b.anio) !== Number(a.anio)) return Number(b.anio) - Number(a.anio);
        return Number(b.mes) - Number(a.mes);
      });

    populateSelect(
      elements.repFiltroPeriodo,
      periods.map((p) => ({
        value: p.id,
        label: periodLabel(p)
      })),
      "Seleccione..."
    );
  }

  function autoSelectDefault() {
    const clients = storage.list("clients");
    const periods = storage.list("periods");
    const clientIds = new Set(periods.map((p) => p.clienteId));
    const usable = clients.filter((c) => clientIds.has(c.id));

    if (!usable.length) {
      setAlert("No hay clientes con periodos contables.", "warning");
      return;
    }

    const first = usable[0];
    elements.repFiltroCliente.value = first.id;
    loadPeriods(first.id);

    const clientPeriods = periods
      .filter((p) => p.clienteId === first.id)
      .sort((a, b) => {
        if (Number(b.anio) !== Number(a.anio)) return Number(b.anio) - Number(a.anio);
        return Number(b.mes) - Number(a.mes);
      });

    if (clientPeriods.length) {
      elements.repFiltroPeriodo.value = clientPeriods[0].id;
    }
  }

  function nivelWeight(nivel) {
    const safe = String(nivel || "").toLowerCase();

    if (safe === "urgente") return 1;
    if (safe === "vencida") return 2;
    if (safe === "preventiva") return 3;
    if (safe === "informativa") return 4;

    return 9;
  }

  function getPendingAlerts(clientId, periodoId) {
    return storage
      .list("alerts")
      .filter(
        (alert) =>
          alert.clienteId === clientId &&
          alert.periodoId === periodoId &&
          ["pendiente", "vista", "vencida"].includes(alert.estado)
      )
      .sort((a, b) => {
        const wa = nivelWeight(a.nivel);
        const wb = nivelWeight(b.nivel);

        if (wa !== wb) return wa - wb;

        const dateA = String(a.fechaAlerta || "");
        const dateB = String(b.fechaAlerta || "");

        if (dateA !== dateB) return dateB.localeCompare(dateA);

        return String(b.id || "").localeCompare(String(a.id || ""));
      });
  }

  function buildNextSteps(period, alerts, taxesCalculated) {
    const steps = [];

    if (period && period.estado !== "cerrado") {
      steps.push(
        "Revise documentos, transacciones, asientos y ajustes; luego cierre el periodo contable desde Estados Financieros."
      );
    }

    if (alerts.length) {
      steps.push(
        `Atienda ${alerts.length} alerta(s) pendiente(s) antes de dar por cerrado el mes.`
      );
    }

    if (!taxesCalculated) {
      steps.push(
        "Calcule impuestos informativos en el módulo Impuestos para completar la visión tributaria del periodo."
      );
    }

    if (!steps.length) {
      steps.push(
        "Periodo al día. Exporte respaldo JSON y conserve evidencia del reporte mensual."
      );
    }

    return steps;
  }

  function buildFallbackData(clientId, periodoId) {
    const client = storage.get("clients", clientId);
    const period = storage.get("periods", periodoId);

    if (!client || !period) {
      return {
        ok: false,
        message: "Cliente o periodo no encontrado."
      };
    }

    const transactions = storage
      .list("transactions")
      .filter(
        (trx) =>
          trx.clienteId === clientId &&
          trx.periodoId === periodoId &&
          trx.estado === "activa"
      );

    const sumByType = (tipo) =>
      transactions
        .filter((trx) => trx.tipo === tipo)
        .reduce((total, trx) => total + (Number(trx.monto) || 0), 0);

    const ventas = round2(sumByType("venta"));
    const compras = round2(sumByType("compra"));
    const gastos = round2(sumByType("gasto"));
    const ingresos = round2(sumByType("ingreso"));

    const totalIngresos = round2(ventas + ingresos);
    const utilidadBruta = round2(totalIngresos - compras);
    const utilidadOperativa = round2(utilidadBruta - gastos);

    const taxes = storage
      .list("taxes")
      .filter(
        (tax) =>
          tax.clienteId === clientId &&
          tax.periodoId === periodoId
      );

    const it = round2(
      taxes
        .filter((tax) => tax.tipo === "IT" && tax.concepto === "ventas_brutas")
        .reduce((total, tax) => total + (Number(tax.monto) || 0), 0)
    );

    const iva = round2(
      taxes
        .filter((tax) => tax.tipo === "IVA" && tax.concepto === "por_pagar")
        .reduce((total, tax) => total + (Number(tax.monto) || 0), 0)
    );

    const utilidadNeta = round2(utilidadOperativa - it);

    const documentsPending = storage
      .list("documents")
      .filter(
        (doc) =>
          doc.clienteId === clientId &&
          doc.periodoId === periodoId &&
          doc.estado === "pendiente"
      ).length;

    const transactionsWithoutDocument = transactions.filter((trx) => !trx.documentoId).length;

    const alerts = getPendingAlerts(clientId, periodoId);

    const recommendations = [];

    if (!transactions.length) {
      recommendations.push("No hay transacciones activas registradas en este periodo.");
    }

    if (ventas <= 0) {
      recommendations.push("No se registraron ventas en el periodo. Revise el módulo Transacciones.");
    }

    if (utilidadNeta < 0) {
      recommendations.push("El periodo presenta pérdida neta. Conviene revisar precios, compras y gastos.");
    } else if (utilidadNeta > 0) {
      recommendations.push("El periodo presenta utilidad neta positiva según los registros operativos.");
    }

    if (documentsPending > 0) {
      recommendations.push(`Hay ${documentsPending} documento(s) pendiente(s) de validación.`);
    }

    if (transactionsWithoutDocument > 0) {
      recommendations.push(`Hay ${transactionsWithoutDocument} transacción(es) sin documento de respaldo.`);
    }

    if (!taxes.length) {
      recommendations.push("Aún no se calculan impuestos informativos para este periodo.");
    }

    recommendations.push(...buildNextSteps(period, alerts, taxes.length > 0));

    return {
      ok: true,
      source: "operativo",
      clientId,
      periodoId,
      client,
      period,
      periodLabel: periodLabel(period),
      summary: {
        ventas,
        otrosIngresos: ingresos,
        totalIngresos,
        costoVentas: compras,
        utilidadBruta,
        gastos,
        utilidadOperativa,
        it,
        iva,
        utilidadNeta,
        margenBruto: null,
        margenNeto: null,
        totalActivo: null,
        totalPasivo: null,
        totalPatrimonio: null,
        balanceCuadrado: null,
        liquidez: null,
        endeudamiento: null,
        roe: null,
        peContable: null,
        peEstimado: null
      },
      income: null,
      balanceSheet: null,
      costMetrics: null,
      indicators: null,
      breakeven: null,
      taxes: { it, iva },
      alerts,
      recommendations,
      warnings: [
        "Este reporte se generó desde transacciones e impuestos. Para un análisis contable más completo, genere asientos en el Libro Diario y cargue el motor de costos de la Fase 9."
      ]
    };
  }

  function buildData(clientId, periodoId) {
    if (!clientId || !periodoId) {
      return null;
    }

    if (costos) {
      try {
        const base = costos.buildData(clientId, periodoId);

        if (base && base.ok) {
          const alerts = getPendingAlerts(clientId, periodoId);
          const taxesCalculated = storage
            .list("taxes")
            .some((tax) => tax.clienteId === clientId && tax.periodoId === periodoId);

          const recommendations = [
            ...(base.insights || []),
            ...buildNextSteps(base.period, alerts, taxesCalculated)
          ];

          const summary = {
            ventas: base.income.ventas,
            otrosIngresos: base.income.otrosIngresos,
            totalIngresos: base.income.totalIngresos,
            costoVentas: base.income.costoNeto,
            utilidadBruta: base.income.utilidadBruta,
            gastos: base.income.totalGastos,
            utilidadOperativa: base.income.utilidadOperativa,
            it: base.taxes.it,
            iva: base.taxes.ivaPagar,
            utilidadNeta: base.income.utilidadNeta,
            margenBruto: base.costMetrics.margenBruto,
            margenNeto: base.costMetrics.margenNeto,
            totalActivo: base.balanceSheet.totalActivo,
            totalPasivo: base.balanceSheet.totalPasivo,
            totalPatrimonio: base.balanceSheet.totalPatrimonio,
            balanceCuadrado: base.balanceSheet.balanced,
            liquidez: base.indicators.liquidezCorriente,
            endeudamiento: base.indicators.endeudamiento,
            roe: base.indicators.roe,
            peContable: base.breakeven.peContable,
            peEstimado: base.breakeven.peEstimado
          };

          return {
            ok: true,
            source: "contable",
            clientId,
            periodoId,
            client: base.client,
            period: base.period,
            periodLabel: base.periodLabel,
            summary,
            income: base.income,
            balanceSheet: base.balanceSheet,
            costMetrics: base.costMetrics,
            indicators: base.indicators,
            breakeven: base.breakeven,
            taxes: base.taxes,
            alerts,
            recommendations,
            warnings: []
          };
        }
      } catch (error) {
        console.warn("No se pudo usar CC_COSTOS para el reporte:", error);
      }
    }

    return buildFallbackData(clientId, periodoId);
  }

  function buildResumen(data) {
    return {
      source: data.source,
      summary: data.summary,
      taxes: data.taxes,
      alerts: (data.alerts || []).map((alert) => ({
        id: alert.id,
        titulo: alert.titulo,
        nivel: alert.nivel,
        estado: alert.estado,
        mensaje: alert.mensaje
      })),
      recommendations: data.recommendations || [],
      income: data.income
        ? {
            ventas: data.income.ventas,
            otrosIngresos: data.income.otrosIngresos,
            totalIngresos: data.income.totalIngresos,
            costoNeto: data.income.costoNeto,
            utilidadBruta: data.income.utilidadBruta,
            totalGastos: data.income.totalGastos,
            utilidadOperativa: data.income.utilidadOperativa,
            impuestosEstimados: data.income.impuestosEstimados,
            utilidadNeta: data.income.utilidadNeta,
            gastos: (data.income.gastos || []).map((g) => ({
              codigo: g.codigo,
              nombre: g.nombre,
              monto: g.monto
            }))
          }
        : null,
      balance: data.balanceSheet
        ? {
            totalActivo: data.balanceSheet.totalActivo,
            totalPasivo: data.balanceSheet.totalPasivo,
            totalPatrimonio: data.balanceSheet.totalPatrimonio,
            balanced: data.balanceSheet.balanced,
            diferencia: data.balanceSheet.diferencia
          }
        : null,
      indicators: data.indicators || null,
      breakeven: data.breakeven
        ? {
            calculable: data.breakeven.calculable,
            peContable: data.breakeven.peContable,
            peEstimado: data.breakeven.peEstimado,
            motivoNoCalculable: data.breakeven.motivoNoCalculable
          }
        : null
    };
  }

  function sourceBadge(source) {
    const safe = String(source || "").toLowerCase();

    if (safe === "contable") {
      return '<span class="badge bg-success-subtle text-success">Contable</span>';
    }

    if (safe === "operativo") {
      return '<span class="badge bg-warning-subtle text-warning">Operativo</span>';
    }

    return '<span class="badge bg-secondary">Reporte</span>';
  }

  function alertLevelBadge(nivel) {
    const safe = String(nivel || "").toLowerCase();

    if (safe === "urgente") return '<span class="badge cc-status-vencida">Urgente</span>';
    if (safe === "vencida") return '<span class="badge cc-status-vencida">Vencida</span>';
    if (safe === "preventiva") return '<span class="badge cc-status-pendiente">Preventiva</span>';
    if (safe === "informativa") return '<span class="badge bg-info-subtle text-info">Informativa</span>';

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function renderMetricCard(label, value, cssClass = "") {
    return `
      <div class="col-12 col-md-6 col-xl-3">
        <div class="card cc-metric-card h-100">
          <div class="card-body">
            <p class="text-muted small mb-1">${utils.escapeHTML(label)}</p>
            <h3 class="h5 mb-0 fw-bold ${cssClass}">${utils.escapeHTML(value)}</h3>
          </div>
        </div>
      </div>
    `;
  }

  function renderWarnings(data) {
    if (!data.warnings || !data.warnings.length) return "";

    return `
      <div class="alert alert-warning small">
        <strong>Advertencia del reporte:</strong>
        <ul class="mb-0 ps-3">
          ${data.warnings
            .map((warning) => `<li>${utils.escapeHTML(warning)}</li>`)
            .join("")}
        </ul>
      </div>
    `;
  }

  function renderSummaryNarrative(data) {
    const s = data.summary || {};
    const client = data.client ? data.client.nombreComercial : getClientName(data.clientId);
    const period = data.periodLabel || "-";

    const resultadoTexto =
      Number(s.utilidadNeta) > 0
        ? "obtuvo una utilidad neta estimada"
        : Number(s.utilidadNeta) < 0
        ? "registró una pérdida neta estimada"
        : "quedó en punto neutro según los registros";

    return `
      <p class="mb-2">
        En <strong>${utils.escapeHTML(period)}</strong>, <strong>${utils.escapeHTML(client)}</strong>
        registró ingresos por <strong>${utils.escapeHTML(money(s.totalIngresos))}</strong>,
        costos de ventas por <strong>${utils.escapeHTML(money(s.costoVentas))}</strong>
        y gastos operativos por <strong>${utils.escapeHTML(money(s.gastos))}</strong>.
        Después de impuestos informativos estimados, el negocio ${resultadoTexto}
        por <strong>${utils.escapeHTML(money(s.utilidadNeta))}</strong>.
      </p>
      <p class="mb-0 small text-muted">
        Este lenguaje está pensado para el microempresario. Los cifras provienen de transacciones,
        asientos contables, ajustes e impuestos informativos registrados en el sistema.
      </p>
    `;
  }

  function renderIncomeSection(data) {
    if (data.income) {
      const i = data.income;

      return `
        <div class="table-responsive">
          <table class="table table-sm cc-statement-table mb-0">
            <thead class="table-light">
              <tr>
                <th>Concepto</th>
                <th class="text-end">Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Ventas</td><td class="text-end">${utils.escapeHTML(money(i.ventas))}</td></tr>
              <tr><td>Otros ingresos</td><td class="text-end">${utils.escapeHTML(money(i.otrosIngresos))}</td></tr>
              <tr class="table-light fw-semibold"><td>Total ingresos</td><td class="text-end">${utils.escapeHTML(money(i.totalIngresos))}</td></tr>
              <tr><td>Costo neto de ventas</td><td class="text-end">${utils.escapeHTML(money(i.costoNeto))}</td></tr>
              <tr class="fw-semibold"><td>Utilidad bruta</td><td class="text-end">${utils.escapeHTML(money(i.utilidadBruta))}</td></tr>
              ${(i.gastos || [])
                .map(
                  (g) => `
                    <tr>
                      <td>${utils.escapeHTML(g.nombre)}</td>
                      <td class="text-end">${utils.escapeHTML(money(g.monto))}</td>
                    </tr>
                  `
                )
                .join("")}
              <tr class="table-light fw-semibold"><td>Total gastos operativos</td><td class="text-end">${utils.escapeHTML(money(i.totalGastos))}</td></tr>
              <tr class="fw-semibold"><td>Utilidad operativa</td><td class="text-end">${utils.escapeHTML(money(i.utilidadOperativa))}</td></tr>
              <tr><td>(-) IT estimado informativo</td><td class="text-end">${utils.escapeHTML(money(i.impuestosEstimados))}</td></tr>
              <tr class="fw-bold table-success"><td>Utilidad neta del periodo</td><td class="text-end">${utils.escapeHTML(money(i.utilidadNeta))}</td></tr>
            </tbody>
          </table>
        </div>
      `;
    }

    const s = data.summary || {};

    return `
      <div class="table-responsive">
        <table class="table table-sm mb-0">
          <thead class="table-light">
            <tr>
              <th>Concepto</th>
              <th class="text-end">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Ventas</td><td class="text-end">${utils.escapeHTML(money(s.ventas))}</td></tr>
            <tr><td>Otros ingresos</td><td class="text-end">${utils.escapeHTML(money(s.otrosIngresos))}</td></tr>
            <tr class="table-light fw-semibold"><td>Total ingresos</td><td class="text-end">${utils.escapeHTML(money(s.totalIngresos))}</td></tr>
            <tr><td>Compras / costo de ventas</td><td class="text-end">${utils.escapeHTML(money(s.costoVentas))}</td></tr>
            <tr class="fw-semibold"><td>Utilidad bruta</td><td class="text-end">${utils.escapeHTML(money(s.utilidadBruta))}</td></tr>
            <tr><td>Gastos</td><td class="text-end">${utils.escapeHTML(money(s.gastos))}</td></tr>
            <tr class="table-light fw-semibold"><td>Utilidad operativa</td><td class="text-end">${utils.escapeHTML(money(s.utilidadOperativa))}</td></tr>
            <tr><td>(-) IT estimado</td><td class="text-end">${utils.escapeHTML(money(s.it))}</td></tr>
            <tr class="fw-bold table-success"><td>Utilidad neta estimada</td><td class="text-end">${utils.escapeHTML(money(s.utilidadNeta))}</td></tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function renderTaxesSection(data) {
    const taxes = data.taxes || {};

    return `
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">IT estimado informativo</p>
            <strong class="fs-5 text-warning">${utils.escapeHTML(money(taxes.it))}</strong>
            <small class="d-block text-muted mt-1">
              Calculado sobre ventas del periodo. No constituye declaración automática ante el SIN.
            </small>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">IVA por pagar informativo</p>
            <strong class="fs-5 text-primary">${utils.escapeHTML(money(taxes.iva))}</strong>
            <small class="d-block text-muted mt-1">
              Aplica según régimen y asientos contables registrados.
            </small>
          </div>
        </div>
      </div>
    `;
  }

  function renderBalanceSection(data) {
    if (data.balanceSheet) {
      const b = data.balanceSheet;

      return `
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <div class="border rounded p-3 h-100">
              <p class="small text-muted mb-1">Total activo</p>
              <strong class="fs-5">${utils.escapeHTML(money(b.totalActivo))}</strong>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="border rounded p-3 h-100">
              <p class="small text-muted mb-1">Total pasivo</p>
              <strong class="fs-5">${utils.escapeHTML(money(b.totalPasivo))}</strong>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="border rounded p-3 h-100">
              <p class="small text-muted mb-1">Total patrimonio</p>
              <strong class="fs-5">${utils.escapeHTML(money(b.totalPatrimonio))}</strong>
            </div>
          </div>

          <div class="col-12">
            <div class="alert ${b.balanced ? "alert-success" : "alert-danger"} small mb-0">
              <strong>Verificación:</strong>
              ${
                b.balanced
                  ? "Activo = Pasivo + Patrimonio. El balance simplificado cuadra."
                  : `El balance simplificado no cuadra. Diferencia: ${utils.escapeHTML(money(b.diferencia))}.`
              }
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="alert alert-info small mb-0">
        El balance simplificado no está disponible porque no se cargó el motor contable
        o no hay asientos suficientes. Genere asientos en el Libro Diario y revise Ajustes
        para obtener una visión patrimonial completa.
      </div>
    `;
  }

  function renderIndicatorsSection(data) {
    if (!data.indicators) {
      return `
        <p class="text-muted mb-0">
          Indicadores no disponibles en modo operativo básico.
        </p>
      `;
    }

    const ind = data.indicators;

    return `
      <div class="table-responsive">
        <table class="table table-sm mb-0">
          <thead class="table-light">
            <tr>
              <th>Indicador</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Liquidez corriente</td>
              <td>${utils.escapeHTML(ind.liquidezCorriente !== null ? `${ratioText(ind.liquidezCorriente)} veces` : "No calculable")}</td>
            </tr>
            <tr>
              <td>Endeudamiento</td>
              <td>${utils.escapeHTML(percentText(ind.endeudamiento))}</td>
            </tr>
            <tr>
              <td>ROE simplificado</td>
              <td>${utils.escapeHTML(percentText(ind.roe))}</td>
            </tr>
            <tr>
              <td>Margen neto</td>
              <td>${utils.escapeHTML(percentText(data.summary ? data.summary.margenNeto : null))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function renderBreakevenSection(data) {
    if (!data.breakeven) {
      return `
        <p class="text-muted mb-0">
          Punto de equilibrio no disponible en modo operativo básico.
        </p>
      `;
    }

    const b = data.breakeven;

    if (!b.calculable) {
      return `
        <div class="alert alert-warning small mb-0">
          ${utils.escapeHTML(b.motivoNoCalculable || "No es posible calcular el punto de equilibrio con los datos actuales.")}
        </div>
      `;
    }

    return `
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Punto de equilibrio contable</p>
            <strong class="fs-5">${utils.escapeHTML(money(b.peContable))}</strong>
            <small class="d-block text-muted mt-1">
              Basado en gastos operativos registrados.
            </small>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Punto de equilibrio estimado</p>
            <strong class="fs-5">${b.peEstimado !== null ? utils.escapeHTML(money(b.peEstimado)) : "No registrado"}</strong>
            <small class="d-block text-muted mt-1">
              Basado en costos fijos mensuales estimados del cliente.
            </small>
          </div>
        </div>
      </div>
    `;
  }

  function renderAlertsSection(alerts) {
    if (!alerts || !alerts.length) {
      return `
        <div class="alert alert-success small mb-0">
          No hay alertas activas para este periodo.
        </div>
      `;
    }

    return `
      <div class="list-group list-group-flush">
        ${alerts
          .map(
            (alert) => `
              <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between align-items-start gap-2">
                  <div>
                    <h6 class="mb-1 fw-semibold">${utils.escapeHTML(alert.titulo || "Alerta")}</h6>
                    <p class="mb-0 small text-muted">${utils.escapeHTML(alert.mensaje || "")}</p>
                  </div>
                  ${alertLevelBadge(alert.nivel)}
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderRecommendations(recommendations) {
    if (!recommendations || !recommendations.length) {
      return `<p class="text-muted mb-0">No hay recomendaciones automáticas.</p>`;
    }

    return `
      <ul class="mb-0 ps-3">
        ${recommendations
          .map((text) => `<li>${utils.escapeHTML(text)}</li>`)
          .join("")}
      </ul>
    `;
  }

  function renderPreview(data) {
    if (!elements.reporteContenido) return;

    if (!data || !data.ok) {
      elements.reporteContenido.innerHTML = `
        <p class="text-muted mb-0">
          ${data && data.message ? utils.escapeHTML(data.message) : "Seleccione un cliente y un periodo, luego pulse “Generar reporte mensual”."}
        </p>
      `;
      return;
    }

    const s = data.summary || {};
    const client = data.client ? data.client.nombreComercial : getClientName(data.clientId);
    const period = data.periodLabel || "-";
    const generatedAt = utils.formatDate(utils.todayISO());

    if (elements.repEncabezadoImpresion) {
      elements.repEncabezadoImpresion.textContent =
        `${client} · ${period} · Generado: ${generatedAt}`;
    }

    elements.reporteContenido.innerHTML = `
      <div class="mb-4">
        <h3 class="h5 fw-bold mb-1">Reporte mensual</h3>
        <p class="text-muted mb-2">
          ${utils.escapeHTML(client)} · ${utils.escapeHTML(period)} · Generado: ${utils.escapeHTML(generatedAt)}
        </p>
        ${sourceBadge(data.source)}
      </div>

      ${renderWarnings(data)}

      <section class="mb-4">
        <h4 class="h6 fw-semibold mb-2">
          <i class="bi bi-chat-left-text me-1"></i>
          1. Resumen del mes en lenguaje sencillo
        </h4>
        ${renderSummaryNarrative(data)}
      </section>

      <div class="row g-3 mb-4">
        ${renderMetricCard("Ventas / ingresos", money(s.totalIngresos), "text-success")}
        ${renderMetricCard("Costo de ventas", money(s.costoVentas), "text-danger")}
        ${renderMetricCard("Gastos operativos", money(s.gastos), "text-warning")}
        ${renderMetricCard("Utilidad neta", money(s.utilidadNeta), Number(s.utilidadNeta) >= 0 ? "text-success" : "text-danger")}
      </div>

      <section class="mb-4">
        <h4 class="h6 fw-semibold mb-2">
          <i class="bi bi-cash-stack me-1"></i>
          2. Ingresos, costos y resultado
        </h4>
        ${renderIncomeSection(data)}
      </section>

      <section class="mb-4">
        <h4 class="h6 fw-semibold mb-2">
          <i class="bi bi-percent me-1"></i>
          3. Impuestos informativos
        </h4>
        ${renderTaxesSection(data)}
      </section>

      <section class="mb-4">
        <h4 class="h6 fw-semibold mb-2">
          <i class="bi bi-bank me-1"></i>
          4. Situación financiera simplificada
        </h4>
        ${renderBalanceSection(data)}
      </section>

      <section class="mb-4">
        <h4 class="h6 fw-semibold mb-2">
          <i class="bi bi-speedometer2 me-1"></i>
          5. Indicadores y punto de equilibrio
        </h4>
        <div class="row g-3">
          <div class="col-12 col-lg-6">
            ${renderIndicatorsSection(data)}
          </div>
          <div class="col-12 col-lg-6">
            ${renderBreakevenSection(data)}
          </div>
        </div>
      </section>

      <section class="mb-4">
        <h4 class="h6 fw-semibold mb-2">
          <i class="bi bi-bell me-1"></i>
          6. Alertas pendientes
        </h4>
        ${renderAlertsSection(data.alerts)}
      </section>

      <section class="mb-4">
        <h4 class="h6 fw-semibold mb-2">
          <i class="bi bi-lightbulb me-1"></i>
          7. Recomendaciones y próximo paso
        </h4>
        ${renderRecommendations(data.recommendations)}
      </section>

      <div class="alert alert-secondary small mb-0">
        <strong>Aviso profesional:</strong>
        ${utils.escapeHTML(cfg.messages?.professionalDisclaimer || "Este sistema no sustituye la firma de un Contador Público Autorizado cuando la normativa lo exija.")}
      </div>
    `;
  }

  function reportStateBadge(estado) {
    const safe = String(estado || "").toLowerCase();

    if (safe === "generado") return '<span class="badge cc-status-activo">Generado</span>';
    if (safe === "borrador") return '<span class="badge cc-status-pendiente">Borrador</span>';
    if (safe === "enviado") return '<span class="badge bg-primary">Enviado</span>';
    if (safe === "anulado") return '<span class="badge cc-status-anulada">Anulado</span>';

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function renderReportsTable() {
    if (!elements.tablaReportes) return;

    const reports = storage
      .list("reports")
      .sort((a, b) => {
        const dateA = String(a.fechaGeneracion || "");
        const dateB = String(b.fechaGeneracion || "");

        if (dateA !== dateB) return dateB.localeCompare(dateA);

        return String(b.id || "").localeCompare(String(a.id || ""));
      });

    if (!reports.length) {
      elements.tablaReportes.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted py-4">
            Todavía no hay reportes guardados.
          </td>
        </tr>
      `;
      return;
    }

    elements.tablaReportes.innerHTML = reports
      .map((report) => {
        const resumen = report.resumen || {};
        const summary = resumen.summary || {};
        const period = getPeriod(report.periodoId);

        return `
          <tr>
            <td><code>${utils.escapeHTML(report.id)}</code></td>
            <td>
              <strong>${utils.escapeHTML(getClientName(report.clienteId))}</strong>
              <small class="d-block text-muted">${utils.escapeHTML(report.clienteId)}</small>
            </td>
            <td>${utils.escapeHTML(period ? periodLabel(period) : "-")}</td>
            <td>${utils.escapeHTML(utils.formatDate(report.fechaGeneracion))}</td>
            <td>${sourceBadge(resumen.source)}</td>
            <td class="text-end">${utils.escapeHTML(money(summary.totalIngresos))}</td>
            <td class="text-end">${utils.escapeHTML(money(summary.utilidadNeta))}</td>
            <td>${reportStateBadge(report.estado)}</td>
            <td class="text-end">
              <button
                class="btn btn-outline-secondary btn-sm"
                type="button"
                data-action="ver"
                data-id="${utils.escapeHTML(report.id)}"
                title="Ver reporte guardado"
              >
                <i class="bi bi-eye"></i>
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function getCurrentUserId() {
    const session = window.CC_AUTH ? window.CC_AUTH.getSession() : null;
    return session ? session.userId : "SYSTEM";
  }

  function generateReport() {
    const clientId = elements.repFiltroCliente?.value || "";
    const periodoId = elements.repFiltroPeriodo?.value || "";

    if (!clientId || !periodoId) {
      setAlert("Seleccione un cliente y un periodo.", "warning");
      utils.showToast("Seleccione un cliente y un periodo.", "warning");
      return;
    }

    const data = buildData(clientId, periodoId);

    if (!data || !data.ok) {
      const message = data && data.message ? data.message : "No se pudo generar el reporte.";
      setAlert(message, "danger");
      utils.showToast(message, "danger");
      return;
    }

    const period = data.period;
    const archivoNombre = `reporte-${clientId}-${period.anio}-${utils.pad2(period.mes)}.txt`;

    const report = storage.create(
      "reports",
      {
        clienteId: clientId,
        periodoId: periodoId,
        tipo: "mensual",
        fechaGeneracion: utils.todayISO(),
        resumen: buildResumen(data),
        snapshotId: null,
        archivoNombre,
        estado: "generado",
        usuarioId: getCurrentUserId()
      },
      "REP"
    );

    if (bitacora) {
      bitacora.log(
        "generar_reporte",
        "reports",
        report.id,
        `Reporte mensual generado para ${getClientName(clientId)} · ${periodLabel(period)}`
      );
    }

    setAlert(
      `Reporte ${report.id} generado y guardado correctamente. Puede imprimirlo o consultarlo desde la tabla inferior.`,
      "success"
    );

    utils.showToast("Reporte mensual generado.", "success");

    renderPreview(data);
    renderReportsTable();
  }

  function viewReport(id) {
    const report = storage.get("reports", id);

    if (!report) {
      utils.showToast("Reporte no encontrado.", "danger");
      return;
    }

    const client = storage.get("clients", report.clienteId);
    const period = storage.get("periods", report.periodoId);
    const resumen = report.resumen || {};
    const summary = resumen.summary || {};

    const data = {
      ok: true,
      source: resumen.source || "reporte",
      clientId: report.clienteId,
      periodoId: report.periodoId,
      client,
      period,
      periodLabel: periodLabel(period),
      summary,
      income: resumen.income || null,
      balanceSheet: resumen.balance || null,
      costMetrics: summary
        ? {
            margenBruto: summary.margenBruto,
            margenNeto: summary.margenNeto
          }
        : null,
      indicators: resumen.indicators || null,
      breakeven: resumen.breakeven || null,
      taxes: resumen.taxes || { it: 0, iva: 0 },
      alerts: resumen.alerts || [],
      recommendations: resumen.recommendations || [],
      warnings: [],
      generatedAt: report.fechaGeneracion
    };

    renderPreview(data);
    setAlert(`Mostrando reporte guardado ${report.id}.`, "info");
  }

  function bindEvents() {
    elements.repFiltroCliente?.addEventListener("change", () => {
      loadPeriods(elements.repFiltroCliente.value);
      renderPeriodState(null);
      setAlert("");
    });

    elements.repFiltroPeriodo?.addEventListener("change", () => {
      const period = getPeriod(elements.repFiltroPeriodo.value);
      renderPeriodState(period);
      setAlert("");
    });

    elements.btnGenerarReporte?.addEventListener("click", generateReport);
    elements.btnImprimirReporte?.addEventListener("click", () => window.print());
    elements.btnRefrescarReportes?.addEventListener("click", renderReportsTable);

    elements.tablaReportes?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action='ver']");

      if (!button) return;

      viewReport(button.dataset.id);
    });
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    cacheElements();
    loadClients();
    autoSelectDefault();

    const period = getPeriod(elements.repFiltroPeriodo?.value || "");
    renderPeriodState(period);

    bindEvents();
    renderReportsTable();
    renderPreview(null);
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    generateReport,
    renderPreview,
    renderReportsTable
  };
})();