/* =========================================================
   Cuentas Claras MVP
   Módulo de UI: Costos, rentabilidad e indicadores
   Fase 9
   ========================================================= */

window.CC_INDICADORES = (function () {
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const motor = window.CC_MAYOR_BALANZA;
  const costos = window.CC_COSTOS;

  const elements = {};
  let currentData = null;

  function cacheElements() {
    elements.ciFiltroCliente = document.getElementById("ciFiltroCliente");
    elements.ciFiltroPeriodo = document.getElementById("ciFiltroPeriodo");
    elements.ciEstadoPeriodo = document.getElementById("ciEstadoPeriodo");
    elements.ciAlerta = document.getElementById("ciAlerta");
    elements.ciEncabezadoImpresion = document.getElementById("ciEncabezadoImpresion");

    elements.btnCiRefrescar = document.getElementById("btnCiRefrescar");
    elements.btnCiSnapshot = document.getElementById("btnCiSnapshot");
    elements.btnCiImprimir = document.getElementById("btnCiImprimir");

    elements.ciVentas = document.getElementById("ciVentas");
    elements.ciCostoVentas = document.getElementById("ciCostoVentas");
    elements.ciUtilidadBruta = document.getElementById("ciUtilidadBruta");
    elements.ciMargenBruto = document.getElementById("ciMargenBruto");
    elements.ciUtilidadNeta = document.getElementById("ciUtilidadNeta");
    elements.ciMargenNeto = document.getElementById("ciMargenNeto");

    elements.tablaCostosRentabilidad = document.getElementById("tablaCostosRentabilidad");
    elements.ciPuntoEquilibrioAlerta = document.getElementById("ciPuntoEquilibrioAlerta");
    elements.tablaPuntoEquilibrio = document.getElementById("tablaPuntoEquilibrio");
    elements.tablaIndicadores = document.getElementById("tablaIndicadores");
    elements.listaLectura = document.getElementById("listaLectura");
  }

  function setAlert(message, type = "info") {
    if (!elements.ciAlerta) return;

    if (!message) {
      elements.ciAlerta.classList.add("d-none");
      elements.ciAlerta.textContent = "";
      return;
    }

    elements.ciAlerta.className = `alert alert-${type} mt-3 mb-0 small`;
    elements.ciAlerta.textContent = message;
    elements.ciAlerta.classList.remove("d-none");
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

  function money(value) {
    return utils.formatMoney(costos.round2(value || 0));
  }

  function percentText(value, suffix = "%") {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "No calculable";
    }

    return `${Number(value).toFixed(2)}${suffix}`;
  }

  function ratioText(value, suffix = "") {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "No calculable";
    }

    return `${Number(value).toFixed(2)}${suffix}`;
  }

  function numberText(value, decimals = 2) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "No calculable";
    }

    return Number(value).toFixed(decimals);
  }

  function loadClients() {
    const clients = motor.getClientsWithPeriods().sort((a, b) =>
      String(a.nombreComercial || "").localeCompare(String(b.nombreComercial || ""))
    );

    populateSelect(
      elements.ciFiltroCliente,
      clients.map((c) => ({
        value: c.id,
        label: `${c.nombreComercial} (${c.id})`
      })),
      "Seleccione un cliente..."
    );
  }

  function loadPeriods(clientId) {
    if (!clientId) {
      populateSelect(elements.ciFiltroPeriodo, [], "Seleccione primero un cliente...");
      return;
    }

    const periods = motor.getPeriodsForClient(clientId);

    populateSelect(
      elements.ciFiltroPeriodo,
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
    elements.ciFiltroCliente.value = first.id;
    loadPeriods(first.id);

    const periods = motor.getPeriodsForClient(first.id);
    if (periods.length) {
      elements.ciFiltroPeriodo.value = periods[0].id;
    }
  }

  function renderPeriodState(period) {
    if (!elements.ciEstadoPeriodo) return;

    if (!period) {
      elements.ciEstadoPeriodo.className = "badge bg-secondary w-100 text-center py-2";
      elements.ciEstadoPeriodo.textContent = "Sin periodo";
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

    elements.ciEstadoPeriodo.className = `badge ${cls} w-100 text-center py-2`;
    elements.ciEstadoPeriodo.textContent = label;
  }

  function renderTopCards(data) {
    if (!data) return;

    const income = data.income;
    const cost = data.costMetrics;

    if (elements.ciVentas) {
      elements.ciVentas.textContent = money(income.totalIngresos);
    }

    if (elements.ciCostoVentas) {
      elements.ciCostoVentas.textContent = money(income.costoNeto);
    }

    if (elements.ciUtilidadBruta) {
      elements.ciUtilidadBruta.textContent = money(income.utilidadBruta);
      elements.ciUtilidadBruta.className =
        "h5 mb-0 fw-bold " +
        (income.utilidadBruta >= 0 ? "text-success" : "text-danger");
    }

    if (elements.ciMargenBruto) {
      elements.ciMargenBruto.textContent = `Margen bruto: ${percentText(cost.margenBruto)}`;
    }

    if (elements.ciUtilidadNeta) {
      elements.ciUtilidadNeta.textContent = money(income.utilidadNeta);
      elements.ciUtilidadNeta.className =
        "h5 mb-0 fw-bold " +
        (income.utilidadNeta >= 0 ? "text-success" : "text-danger");
    }

    if (elements.ciMargenNeto) {
      elements.ciMargenNeto.textContent = `Margen neto: ${percentText(cost.margenNeto)}`;
    }
  }

  function renderCostTable(data) {
    if (!elements.tablaCostosRentabilidad) return;

    if (!data) {
      elements.tablaCostosRentabilidad.innerHTML = `
        <tr><td colspan="3" class="text-center text-muted py-4">Seleccione cliente y periodo.</td></tr>
      `;
      return;
    }

    const i = data.income;
    const c = data.costMetrics;

    const rows = [
      { label: "Ventas", value: i.ventas, pct: percentText(i.ventas, "%") },
      { label: "Otros ingresos", value: i.otrosIngresos, pct: percentText(i.otrosIngresos, "%") },
      { label: "Total ingresos", value: i.totalIngresos, pct: "100.00%", strong: true },
      { label: "Compras / costo bruto", value: i.comprasBrutas, pct: percentText(i.comprasBrutas, "%") },
      { label: "(-) Devoluciones y descuentos sobre compras", value: -i.devolucionesCompras, pct: percentText(-i.devolucionesCompras, "%") },
      { label: "Costo neto de ventas", value: i.costoNeto, pct: percentText(i.costoNeto, "%"), strong: true },
      { label: "Utilidad bruta", value: i.utilidadBruta, pct: percentText(c.margenBruto), strong: true, color: i.utilidadBruta >= 0 ? "success" : "danger" },
      ...i.gastos.map((g) => ({
        label: g.nombre,
        value: g.monto,
        pct: percentText(g.monto, "%")
      })),
      { label: "Total gastos operativos", value: i.totalGastos, pct: percentText(i.totalGastos, "%"), strong: true },
      { label: "Utilidad operativa", value: i.utilidadOperativa, pct: percentText(c.margenOperativo), strong: true, color: i.utilidadOperativa >= 0 ? "success" : "danger" },
      { label: "(-) IT estimado informativo", value: -i.impuestosEstimados, pct: percentText(-i.impuestosEstimados, "%") },
      { label: "Utilidad neta del periodo", value: i.utilidadNeta, pct: percentText(c.margenNeto), strong: true, color: i.utilidadNeta >= 0 ? "success" : "danger" }
    ];

    elements.tablaCostosRentabilidad.innerHTML = rows
      .map((row) => {
        const cls = [
          row.strong ? "fw-semibold" : "",
          row.color ? `table-${row.color}` : ""
        ].filter(Boolean).join(" ");

        return `
          <tr class="${cls}">
            <td>${utils.escapeHTML(row.label)}</td>
            <td class="text-end">${utils.escapeHTML(money(row.value))}</td>
            <td class="text-end">${utils.escapeHTML(row.pct)}</td>
          </tr>
        `;
      })
      .join("");
  }

  function renderBreakeven(data) {
    if (!elements.tablaPuntoEquilibrio || !elements.ciPuntoEquilibrioAlerta) return;

    if (!data) {
      elements.ciPuntoEquilibrioAlerta.className = "alert alert-info small mb-3";
      elements.ciPuntoEquilibrioAlerta.textContent = "Seleccione cliente y periodo.";
      elements.tablaPuntoEquilibrio.innerHTML = `
        <tr><td colspan="6" class="text-center text-muted py-4">Seleccione cliente y periodo.</td></tr>
      `;
      return;
    }

    const b = data.breakeven;

    if (!b.calculable) {
      elements.ciPuntoEquilibrioAlerta.className = "alert alert-warning small mb-3";
      elements.ciPuntoEquilibrioAlerta.textContent =
        b.motivoNoCalculable || "No es posible calcular el punto de equilibrio con los datos actuales.";
      elements.tablaPuntoEquilibrio.innerHTML = `
        <tr><td colspan="6" class="text-center text-muted py-4">Punto de equilibrio no calculable.</td></tr>
      `;
      return;
    }

    elements.ciPuntoEquilibrioAlerta.className = "alert alert-info small mb-3";
    elements.ciPuntoEquilibrioAlerta.textContent =
      `Margen de contribución: ${percentText(b.porcentajeMargenContribucion)}. ` +
      `Ventas del periodo: ${money(data.income.totalIngresos)}.`;

    const rows = [];

    rows.push(`
      <tr>
        <td><strong>Base contable</strong><br><small class="text-muted">Gastos operativos registrados</small></td>
        <td class="text-end">${utils.escapeHTML(money(b.costoVariable))}</td>
        <td class="text-end">${utils.escapeHTML(money(b.costosFijosContables))}</td>
        <td class="text-end">${utils.escapeHTML(money(b.margenContribucion))}<br><small>${percentText(b.porcentajeMargenContribucion)}</small></td>
        <td class="text-end fw-semibold">${utils.escapeHTML(money(b.peContable))}</td>
        <td class="text-end">${percentText(b.margenSeguridadContable)}</td>
      </tr>
    `);

    if (b.costosFijosEstimados > 0) {
      rows.push(`
        <tr>
          <td><strong>Base estimada</strong><br><small class="text-muted">costosFijosMensuales del cliente</small></td>
          <td class="text-end">${utils.escapeHTML(money(b.costoVariable))}</td>
          <td class="text-end">${utils.escapeHTML(money(b.costosFijosEstimados))}</td>
          <td class="text-end">${utils.escapeHTML(money(b.margenContribucion))}<br><small>${percentText(b.porcentajeMargenContribucion)}</small></td>
          <td class="text-end fw-semibold">${utils.escapeHTML(money(b.peEstimado))}</td>
          <td class="text-end">${percentText(b.margenSeguridadEstimado)}</td>
        </tr>
      `);
    } else {
      rows.push(`
        <tr>
          <td><strong>Base estimada</strong><br><small class="text-muted">No registrada en cliente</small></td>
          <td class="text-end">${utils.escapeHTML(money(b.costoVariable))}</td>
          <td class="text-end">No registrada</td>
          <td class="text-end">${utils.escapeHTML(money(b.margenContribucion))}<br><small>${percentText(b.porcentajeMargenContribucion)}</small></td>
          <td class="text-end">No calculable</td>
          <td class="text-end">No calculable</td>
        </tr>
      `);
    }

    elements.tablaPuntoEquilibrio.innerHTML = rows.join("");
  }

  function indicatorReading(liquidez, endeudamiento, roe, margenNeto) {
    const readings = [];

    if (liquidez !== null) {
      readings.push(
        liquidez >= 1
          ? "Buena cobertura de deudas de corto plazo."
          : "Atención: los recursos de corto plazo no cubren completamente las deudas de corto plazo."
      );
    }

    if (endeudamiento !== null) {
      readings.push(
        endeudamiento <= 50
          ? "Endeudamiento moderado."
          : endeudamiento <= 70
          ? "Endeudamiento medio; conviene monitorear pagos."
          : "Endeudamiento alto; revisar capacidad de pago."
      );
    }

    if (margenNeto !== null) {
      readings.push(
        margenNeto >= 10
          ? "Rentabilidad neta aceptable para prototipo de microempresa."
          : margenNeto >= 0
          ? "Rentabilidad baja; revisar costos y gastos."
          : "Resultado negativo; se requiere plan de corrective action contable."
      );
    }

    return readings.join(" ") || "Sin lectura automática.";
  }

  function renderIndicators(data) {
    if (!elements.tablaIndicadores) return;

    if (!data) {
      elements.tablaIndicadores.innerHTML = `
        <tr><td colspan="3" class="text-center text-muted py-4">Seleccione cliente y periodo.</td></tr>
      `;
      return;
    }

    const ind = data.indicators;

    const rows = [
      {
        nombre: "Liquidez corriente",
        valor: ind.liquidezCorriente !== null ? ratioText(ind.liquidezCorriente, " veces") : "No calculable",
        lectura:
          ind.liquidezCorriente === null
            ? "No hay pasivo corriente registrado o no es posible calcular."
            : ind.liquidezCorriente >= 1
            ? "El activo corriente cubre el pasivo corriente."
            : "El activo corriente no cubre completamente el pasivo corriente."
      },
      {
        nombre: "Endeudamiento",
        valor: percentText(ind.endeudamiento),
        lectura:
          ind.endeudamiento === null
            ? "No hay activo registrado para calcular participación del pasivo."
            : ind.endeudamiento <= 50
            ? "Nivel moderado de financiamiento con terceros."
            : ind.endeudamiento <= 70
            ? "Nivel medio-alto; conviene planificar pagos."
            : "Nivel alto de dependencia de recursos externos."
      },
      {
        nombre: "Rentabilidad sobre patrimonio (ROE simplificado)",
        valor: percentText(ind.roe),
        lectura:
          ind.roe === null
            ? "Patrimonio cero o no calculable."
            : ind.roe >= 0
            ? "El patrimonio genera rendimiento positivo en el periodo."
            : "El patrimonio presenta rendimiento negativo en el periodo."
      },
      {
        nombre: "Margen neto",
        valor: percentText(ind.margenNeto),
        lectura:
          ind.margenNeto === null
            ? "No hay ingresos para calcular margen neto."
            : ind.margenNeto >= 10
            ? "Buen margen neto relativo para el prototipo."
            : ind.margenNeto >= 0
            ? "Margen neto bajo; revisar estructura de costos."
            : "Margen neto negativo; el periodo presenta pérdida."
      },
      {
        nombre: "Rotación de inventario",
        valor: ind.rotacionInventario !== null ? ratioText(ind.rotacionInventario, " veces") : "No calculable",
        lectura:
          ind.rotacionInventario === null
            ? "La cuenta de inventario no tiene saldo relevante o no es calculable con método periódico simplificado."
            : `Aproximadamente ${numberText(ind.diasInventario, 1)} días de inventario estimado.`
      },
      {
        nombre: "Rotación de cuentas por cobrar",
        valor: ind.rotacionCuentasCobrar !== null ? ratioText(ind.rotacionCuentasCobrar, " veces") : "No calculable",
        lectura:
          ind.rotacionCuentasCobrar === null
            ? "No hay saldo en cuentas por cobrar o no es calculable."
            : `Aproximadamente ${numberText(ind.diasCuentasCobrar, 1)} días de cobranza estimada.`
      }
    ];

    elements.tablaIndicadores.innerHTML = rows
      .map(
        (row) => `
          <tr>
            <td><strong>${utils.escapeHTML(row.nombre)}</strong></td>
            <td>${utils.escapeHTML(row.valor)}</td>
            <td class="small">${utils.escapeHTML(row.lectura)}</td>
          </tr>
        `
      )
      .join("");
  }

  function renderInsights(data) {
    if (!elements.listaLectura) return;

    if (!data || !data.insights || !data.insights.length) {
      elements.listaLectura.innerHTML = `
        <li class="list-group-item text-muted">No hay recomendaciones automáticas para el periodo seleccionado.</li>
      `;
      return;
    }

    elements.listaLectura.innerHTML = data.insights
      .map(
        (text) => `
          <li class="list-group-item">
            <i class="bi bi-arrow-right-short text-primary"></i>
            ${utils.escapeHTML(text)}
          </li>
        `
      )
      .join("");
  }

  function renderAll() {
    const clientId = elements.ciFiltroCliente?.value || "";
    const periodoId = elements.ciFiltroPeriodo?.value || "";

    if (!costos) {
      setAlert("No se encontró js/modules/costos.js.", "danger");
      return;
    }

    try {
      currentData = costos.buildData(clientId, periodoId);
    } catch (error) {
      currentData = null;
      setAlert(error.message, "danger");
      renderPeriodState(null);
      renderCostTable(null);
      renderBreakeven(null);
      renderIndicators(null);
      renderInsights(null);
      return;
    }

    if (!currentData.ok) {
      setAlert(currentData.message, "warning");
      renderPeriodState(null);
      renderCostTable(null);
      renderBreakeven(null);
      renderIndicators(null);
      renderInsights(null);
      return;
    }

    setAlert("");
    renderPeriodState(currentData.period);

    if (elements.ciEncabezadoImpresion) {
      elements.ciEncabezadoImpresion.textContent =
        `${currentData.clientName} · ${currentData.periodLabel} · Generado: ${utils.formatDate(utils.todayISO())}`;
    }

    renderTopCards(currentData);
    renderCostTable(currentData);
    renderBreakeven(currentData);
    renderIndicators(currentData);
    renderInsights(currentData);
  }

  function getCurrentUserId() {
    const session = window.CC_AUTH ? window.CC_AUTH.getSession() : null;
    return session ? session.userId : "SYSTEM";
  }

  function saveSnapshot() {
    if (!currentData || !currentData.ok) {
      utils.showToast("Seleccione un cliente y periodo con datos.", "warning");
      return;
    }

    const snapshot = storage.create(
      "financialSnapshots",
      {
        clienteId: currentData.clientId,
        periodoId: currentData.periodoId,
        tipo: "indicadores",
        fechaGeneracion: utils.nowISO(),
        usuarioId: getCurrentUserId(),
        contenido: {
          clientName: currentData.clientName,
          periodLabel: currentData.periodLabel,
          basis: "Balanza ajustada sin asientos de cierre",
          income: currentData.income,
          costMetrics: currentData.costMetrics,
          breakeven: currentData.breakeven,
          indicators: currentData.indicators,
          insights: currentData.insights
        },
        estado: "generado"
      },
      "FS"
    );

    if (window.CC_BITACORA) {
      window.CC_BITACORA.log(
        "generar_indicadores",
        "financial_snapshots",
        snapshot.id,
        `Snapshot de costos e indicadores generado para ${currentData.clientName} · ${currentData.periodLabel}`
      );
    }

    setAlert(
      "Evidencia de costos e indicadores guardada como snapshot. Los cálculos vivos siguen derivándose del Libro Diario.",
      "success"
    );

    utils.showToast("Snapshot guardado.", "success");
  }

  function bindEvents() {
    elements.ciFiltroCliente?.addEventListener("change", () => {
      loadPeriods(elements.ciFiltroCliente.value);
      renderAll();
    });

    elements.ciFiltroPeriodo?.addEventListener("change", renderAll);
    elements.btnCiRefrescar?.addEventListener("click", renderAll);
    elements.btnCiSnapshot?.addEventListener("click", saveSnapshot);
    elements.btnCiImprimir?.addEventListener("click", () => window.print());
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    if (!motor) {
      console.error("No se encontró CC_MAYOR_BALANZA.");
      utils.showToast("Falta js/modules/mayor-balanza.js.", "danger");
      return;
    }

    if (!costos) {
      console.error("No se encontró CC_COSTOS.");
      utils.showToast("Falta js/modules/costos.js.", "danger");
      return;
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