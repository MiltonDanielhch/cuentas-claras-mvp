/* =========================================================
   Cuentas Claras MVP
   Módulo de alertas tributarias y operativas
   Fase 10
   ========================================================= */

window.CC_ALERTAS = (function () {
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

  const elements = {};

  let alertasEventsBound = false;
  let dashboardEventsBound = false;

  function getMotor() {
    return window.CC_MAYOR_BALANZA;
  }

  function cacheElements() {
    elements.tablaAlertas = document.getElementById("tablaAlertas");
    elements.btnGenerarAlertas = document.getElementById("btnGenerarAlertas");
    elements.btnLimpiarFiltros = document.getElementById("btnLimpiarFiltrosAlertas");
    elements.btnImprimirAlertas = document.getElementById("btnImprimirAlertas");

    elements.alertasBusqueda = document.getElementById("alertasBusqueda");
    elements.alertasFiltroCliente = document.getElementById("alertasFiltroCliente");
    elements.alertasFiltroPeriodo = document.getElementById("alertasFiltroPeriodo");
    elements.alertasFiltroTipo = document.getElementById("alertasFiltroTipo");
    elements.alertasFiltroNivel = document.getElementById("alertasFiltroNivel");
    elements.alertasFiltroEstado = document.getElementById("alertasFiltroEstado");

    elements.alertasAlerta = document.getElementById("alertasAlerta");

    elements.metricAlertasPendientes = document.getElementById("metricAlertasPendientes");
    elements.metricAlertasVistas = document.getElementById("metricAlertasVistas");
    elements.metricAlertasResueltas = document.getElementById("metricAlertasResueltas");
    elements.metricAlertasVencidas = document.getElementById("metricAlertasVencidas");
    elements.metricAlertasUrgentes = document.getElementById("metricAlertasUrgentes");
    elements.metricAlertasTotal = document.getElementById("metricAlertasTotal");

    elements.detalleModalEl = document.getElementById("alertaDetalleModal");
    elements.detalleContenido = document.getElementById("alertaDetalleContenido");

    elements.dashboardAlertas = document.getElementById("dashboardAlertas");
    elements.btnDashboardGenerarAlertas = document.getElementById("btnDashboardGenerarAlertas");
  }

  function isAlertasPage() {
    return !!elements.tablaAlertas;
  }

  function setAlert(message, type = "info") {
    if (!elements.alertasAlerta) return;

    if (!message) {
      elements.alertasAlerta.classList.add("d-none");
      elements.alertasAlerta.textContent = "";
      return;
    }

    elements.alertasAlerta.className = `alert alert-${type} mb-0 small`;
    elements.alertasAlerta.textContent = message;
    elements.alertasAlerta.classList.remove("d-none");
  }

  function getModalInstance(el) {
    return bootstrap.Modal.getOrCreateInstance(el);
  }

  function showDetalleModal() {
    getModalInstance(elements.detalleModalEl).show();
  }

  function populateSelect(selectEl, options, placeholder = "") {
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

  function todayISO() {
    return utils.todayISO();
  }

  function parseDate(value) {
    return utils.parseDateISO(value);
  }

  function daysFromToday(dateISO) {
    const today = parseDate(todayISO());
    const date = parseDate(dateISO);

    if (Number.isNaN(today.getTime()) || Number.isNaN(date.getTime())) {
      return 9999;
    }

    return Math.round((date.getTime() - today.getTime()) / 86400000);
  }

  function periodEndISO(mes, anio) {
    const d = new Date(Number(anio), Number(mes), 0);
    return `${d.getFullYear()}-${utils.pad2(d.getMonth() + 1)}-${utils.pad2(d.getDate())}`;
  }

  function periodLabel(period) {
    if (!period) return "-";
    const name = monthNames[Number(period.mes) - 1] || "Mes inválido";
    return `${name} ${period.anio}`;
  }

  function getClient(id) {
    return storage.get("clients", id);
  }

  function getClientName(id) {
    const client = getClient(id);
    return client ? client.nombreComercial : "Cliente no encontrado";
  }

  function getPeriod(id) {
    return storage.get("periods", id);
  }

  function getAlerts() {
    return storage.list("alerts");
  }

  function activeStates() {
    return ["pendiente", "vista", "vencida"];
  }

  function findExisting(type, clienteId, periodoId, registroId) {
    const reg = registroId ? String(registroId) : "";

    return getAlerts().some((alert) => {
      const sameType = alert.tipo === type;
      const sameClient = alert.clienteId === clienteId;
      const samePeriod = String(alert.periodoId || "") === String(periodoId || "");
      const sameRecord = String(alert.registroId || "") === reg;
      const isActive = activeStates().includes(alert.estado);

      return sameType && sameClient && samePeriod && sameRecord && isActive;
    });
  }

  function createAlert(data) {
    if (findExisting(data.tipo, data.clienteId, data.periodoId, data.registroId)) {
      return null;
    }

    const alert = storage.create(
      "alerts",
      {
        clienteId: data.clienteId,
        periodoId: data.periodoId || null,
        obligacionId: data.obligacionId || null,
        asientoId: data.asientoId || null,
        registroId: data.registroId || null,
        entidad: data.entidad || null,
        tipo: data.tipo,
        nivel: data.nivel || "informativa",
        titulo: data.titulo,
        mensaje: data.mensaje,
        fechaAlerta: data.fechaAlerta || todayISO(),
        estado: data.estado || "pendiente"
      },
      "ALR"
    );

    if (bitacora) {
      bitacora.log(
        "generar_alerta",
        "alerts",
        alert.id,
        `${data.tipo}: ${data.titulo}`
      );
    }

    return alert;
  }

  function isCapitalTransaction(transaction) {
    const text = [
      transaction.cuenta,
      transaction.tercero,
      transaction.observacion
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      text.includes("capital") ||
      text.includes("aporte") ||
      text.includes("propietario")
    );
  }

  function generateVencimientosTributarios() {
    const created = [];

    storage.list("obligations").forEach((obl) => {
      if (["pagada", "anulada"].includes(obl.estado)) return;
      if (!obl.fechaVencimiento) return;

      const diff = daysFromToday(obl.fechaVencimiento);

      if (diff > (Number(cfg.alertDaysBefore) || 7)) return;

      let nivel = "informativa";
      let estado = "pendiente";

      if (diff < 0) {
        nivel = "vencida";
        estado = "vencida";
      } else if (diff <= (Number(cfg.urgentDaysBefore) || 3)) {
        nivel = "urgente";
      } else if (diff <= (Number(cfg.alertDaysBefore) || 7)) {
        nivel = "preventiva";
      }

      const client = getClient(obl.clienteId);
      const period = getPeriod(obl.periodoId);

      const alert = createAlert({
        clienteId: obl.clienteId,
        periodoId: obl.periodoId,
        obligacionId: obl.id,
        registroId: obl.id,
        entidad: "obligations",
        tipo: "vencimiento_tributario",
        nivel,
        estado,
        titulo: `Vencimiento ${obl.tipo} ${diff < 0 ? "vencido" : "próximo"}`,
        mensaje:
          `La obligación ${obl.tipo} de ${client ? client.nombreComercial : "cliente"} ` +
          `correspondiente a ${period ? periodLabel(period) : "periodo no definido"} ` +
          `vence el ${utils.formatDate(obl.fechaVencimiento)}. ` +
          `Monto estimado: ${utils.formatMoney(obl.montoEstimado || 0)}.`
      });

      if (alert) created.push(alert);
    });

    return created;
  }

  function generateDocumentosPendientes() {
    const created = [];

    storage.list("documents").forEach((doc) => {
      if (doc.estado !== "pendiente") return;

      const period = getPeriod(doc.periodoId);
      const client = getClient(doc.clienteId);

      const nivel = period && period.estado === "cerrado" ? "urgente" : "preventiva";

      const alert = createAlert({
        clienteId: doc.clienteId,
        periodoId: doc.periodoId,
        registroId: doc.id,
        entidad: "documents",
        tipo: "documento_pendiente",
        nivel,
        titulo: `Documento pendiente ${doc.id}`,
        mensaje:
          `El documento ${doc.id} de ${client ? client.nombreComercial : "cliente"} ` +
          `está pendiente de validación. Tipo: ${doc.tipo}. ` +
          `Monto: ${utils.formatMoney(doc.monto || 0)}. ` +
          `Tercero: ${doc.tercero || "sin especificar"}.`
      });

      if (alert) created.push(alert);
    });

    return created;
  }

  function generatePeriodosSinCerrar() {
    const created = [];

    storage.list("periods").forEach((period) => {
      if (period.estado === "cerrado") return;

      const end = periodEndISO(period.mes, period.anio);
      const diff = daysFromToday(end);

      const shouldAlert = period.estado === "en_revision" || diff <= (Number(cfg.alertDaysBefore) || 7);

      if (!shouldAlert) return;

      let nivel = "informativa";

      if (diff < 0) {
        nivel = "urgente";
      } else if (diff <= (Number(cfg.urgentDaysBefore) || 3)) {
        nivel = "urgente";
      } else if (period.estado === "en_revision") {
        nivel = "preventiva";
      } else {
        nivel = "preventiva";
      }

      const client = getClient(period.clienteId);

      const alert = createAlert({
        clienteId: period.clienteId,
        periodoId: period.id,
        registroId: null,
        entidad: "periods",
        tipo: "periodo_sin_cerrar",
        nivel,
        titulo: `Periodo sin cerrar ${periodLabel(period)}`,
        mensaje:
          `El periodo ${periodLabel(period)} de ${client ? client.nombreComercial : "cliente"} ` +
          `está en estado ${period.estado}. Revise documentos, transacciones, asientos y ajustes ` +
          `antes de cerrar contablemente.`
      });

      if (alert) created.push(alert);
    });

    return created;
  }

  function generateTransaccionesSinDocumento() {
    const created = [];

    storage.list("transactions").forEach((trx) => {
      if (trx.estado !== "activa") return;
      if (trx.documentoId) return;
      if (isCapitalTransaction(trx)) return;

      const period = getPeriod(trx.periodoId);
      const client = getClient(trx.clienteId);
      const end = period ? periodEndISO(period.mes, period.anio) : todayISO();
      const diff = daysFromToday(end);

      let nivel = "preventiva";

      if (period && period.estado === "cerrado") {
        nivel = "urgente";
      } else if (diff <= (Number(cfg.urgentDaysBefore) || 3)) {
        nivel = "urgente";
      }

      const alert = createAlert({
        clienteId: trx.clienteId,
        periodoId: trx.periodoId,
        registroId: trx.id,
        entidad: "transactions",
        tipo: "transaccion_sin_documento",
        nivel,
        titulo: `Transacción sin documento ${trx.id}`,
        mensaje:
          `La transacción ${trx.id} de tipo ${trx.tipo} por ${utils.formatMoney(trx.monto)} ` +
          `de ${client ? client.nombreComercial : "cliente"} no tiene documento de respaldo. ` +
          `Tercero: ${trx.tercero || "sin especificar"}.`
      });

      if (alert) created.push(alert);
    });

    return created;
  }

  function generateTransaccionesSinAsiento() {
    const created = [];

    storage.list("transactions").forEach((trx) => {
      if (trx.estado !== "activa") return;
      if (trx.journalEntryId) return;

      const period = getPeriod(trx.periodoId);

      if (!period || period.estado === "cerrado") return;

      const client = getClient(trx.clienteId);
      const end = periodEndISO(period.mes, period.anio);
      const diff = daysFromToday(end);

      const nivel = diff <= (Number(cfg.urgentDaysBefore) || 3) ? "urgente" : "preventiva";

      const alert = createAlert({
        clienteId: trx.clienteId,
        periodoId: trx.periodoId,
        registroId: trx.id,
        entidad: "transactions",
        tipo: "transaccion_sin_asiento",
        nivel,
        titulo: `Transacción sin asiento ${trx.id}`,
        mensaje:
          `La transacción ${trx.id} de ${client ? client.nombreComercial : "cliente"} ` +
          `aún no tiene asiento contable generado. Ingrese al Libro Diario y genere asientos automáticos.`
      });

      if (alert) created.push(alert);
    });

    return created;
  }

  function generateImpuestosNoCalculados() {
    const created = [];

    storage.list("periods").forEach((period) => {
      if (period.estado === "cerrado") return;

      const hasTransactions = storage
        .list("transactions")
        .some(
          (trx) =>
            trx.clienteId === period.clienteId &&
            trx.periodoId === period.id &&
            trx.estado === "activa"
        );

      if (!hasTransactions) return;

      const hasTaxes = storage
        .list("taxes")
        .some(
          (tax) =>
            tax.clienteId === period.clienteId &&
            tax.periodoId === period.id
        );

      if (hasTaxes) return;

      const client = getClient(period.clienteId);

      const alert = createAlert({
        clienteId: period.clienteId,
        periodoId: period.id,
        registroId: null,
        entidad: "taxes",
        tipo: "impuesto_no_calculado",
        nivel: "preventiva",
        titulo: `Impuestos no calculados ${periodLabel(period)}`,
        mensaje:
          `El periodo ${periodLabel(period)} de ${client ? client.nombreComercial : "cliente"} ` +
          `tiene transacciones activas pero aún no se calculan impuestos informativos. ` +
          `Revise el módulo Impuestos.`
      });

      if (alert) created.push(alert);
    });

    return created;
  }

  function generateBalanzaDescuadrada() {
    const created = [];
    const motor = getMotor();

    if (!motor) return created;

    motor.ensureAccounts();

    const periods = storage
      .list("periods")
      .filter((period) => period.estado !== "cerrado");

    const byClient = {};

    periods.forEach((period) => {
      if (!byClient[period.clienteId]) byClient[period.clienteId] = [];
      byClient[period.clienteId].push(period);
    });

    Object.entries(byClient).forEach(([clientId, clientPeriods]) => {
      const ctx = motor.buildContext(clientId);
      const accountsMap = motor.getAccountsMap();

      clientPeriods.forEach((period) => {
        const key = motor.periodKey(period);

        const balances = motor.getTrialBalance(ctx, accountsMap, key, {
          includeAdjustments: true,
          includeClosing: false
        });

        if (balances.movementsBalanced && balances.balancesBalanced) return;

        const problems = [];

        if (!balances.movementsBalanced) {
          problems.push(
            `Movimientos: débitos ${utils.formatMoney(balances.totals.debitos)} vs créditos ${utils.formatMoney(balances.totals.creditos)}.`
          );
        }

        if (!balances.balancesBalanced) {
          problems.push(
            `Saldos: deudor ${utils.formatMoney(balances.totals.saldoDeudor)} vs acreedor ${utils.formatMoney(balances.totals.saldoAcreedor)}.`
          );
        }

        const client = getClient(clientId);

        const alert = createAlert({
          clienteId: clientId,
          periodoId: period.id,
          registroId: null,
          entidad: "journal",
          tipo: "balanza_descuadrada",
          nivel: "urgente",
          titulo: `Balanza descuadrada ${periodLabel(period)}`,
          mensaje:
            `La balanza ajustada de ${client ? client.nombreComercial : "cliente"} ` +
            `para ${periodLabel(period)} no cuadra. ${problems.join(" ")}`
        });

        if (alert) created.push(alert);
      });
    });

    return created;
  }

  function generateAll(showFeedback = true) {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return [];

    const created = [
      ...generateVencimientosTributarios(),
      ...generateDocumentosPendientes(),
      ...generatePeriodosSinCerrar(),
      ...generateTransaccionesSinDocumento(),
      ...generateTransaccionesSinAsiento(),
      ...generateImpuestosNoCalculados(),
      ...generateBalanzaDescuadrada()
    ];

    if (showFeedback) {
      if (created.length) {
        const message = `Se generaron ${created.length} alertas nuevas.`;
        utils.showToast(message, "success");
        setAlert(message, "success");
      } else {
        const message = "No se generaron alertas nuevas. Puede que ya existan alertas activas para estas condiciones.";
        utils.showToast(message, "info");
        setAlert(message, "info");
      }

      render();
      renderDashboard();
    }

    return created;
  }

  function loadClients() {
    const clients = storage
      .list("clients")
      .sort((a, b) =>
        String(a.nombreComercial || "").localeCompare(String(b.nombreComercial || ""))
      );

    populateSelect(
      elements.alertasFiltroCliente,
      clients.map((client) => ({
        value: client.id,
        label: `${client.nombreComercial} (${client.id})`
      })),
      "Todos"
    );
  }

  function loadPeriodOptions(clientId) {
    if (!elements.alertasFiltroPeriodo) return;

    let periods = storage.list("periods");

    if (clientId) {
      periods = periods.filter((period) => period.clienteId === clientId);
    }

    periods.sort((a, b) => {
      if (Number(b.anio) !== Number(a.anio)) return Number(b.anio) - Number(a.anio);
      return Number(b.mes) - Number(a.mes);
    });

    populateSelect(
      elements.alertasFiltroPeriodo,
      periods.map((period) => ({
        value: period.id,
        label: clientId
          ? periodLabel(period)
          : `${getClientName(period.clienteId)} · ${periodLabel(period)}`
      })),
      "Todos"
    );
  }

  function populateStaticFilters() {
    populateSelect(
      elements.alertasFiltroTipo,
      (cfg.alertTypes || []).map((item) => ({
        value: item.value,
        label: item.label
      })),
      "Todos"
    );

    populateSelect(
      elements.alertasFiltroNivel,
      (cfg.alertLevels || []).map((item) => ({
        value: item.value,
        label: item.label
      })),
      "Todos"
    );

    populateSelect(
      elements.alertasFiltroEstado,
      (cfg.alertStates || []).map((item) => ({
        value: item.value,
        label: item.label
      })),
      "Todos"
    );
  }

  function nivelWeight(nivel) {
    const safe = String(nivel || "").toLowerCase();

    if (safe === "urgente") return 1;
    if (safe === "vencida") return 2;
    if (safe === "preventiva") return 3;
    if (safe === "informativa") return 4;

    return 9;
  }

  function applyFilters() {
    const search = String(elements.alertasBusqueda?.value || "").trim().toLowerCase();
    const clienteId = elements.alertasFiltroCliente?.value || "";
    const periodoId = elements.alertasFiltroPeriodo?.value || "";
    const tipo = elements.alertasFiltroTipo?.value || "";
    const nivel = elements.alertasFiltroNivel?.value || "";
    const estado = elements.alertasFiltroEstado?.value || "";

    let data = getAlerts();

    if (clienteId) data = data.filter((item) => item.clienteId === clienteId);
    if (periodoId) data = data.filter((item) => item.periodoId === periodoId);
    if (tipo) data = data.filter((item) => item.tipo === tipo);
    if (nivel) data = data.filter((item) => item.nivel === nivel);
    if (estado) data = data.filter((item) => item.estado === estado);

    if (search) {
      data = data.filter((item) => {
        const period = getPeriod(item.periodoId);

        const haystack = [
          item.id,
          getClientName(item.clienteId),
          period ? periodLabel(period) : "",
          item.tipo,
          item.nivel,
          item.titulo,
          item.mensaje,
          item.estado,
          item.registroId,
          item.obligacionId,
          item.asientoId
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      });
    }

    data.sort((a, b) => {
      const wa = nivelWeight(a.nivel);
      const wb = nivelWeight(b.nivel);

      if (wa !== wb) return wa - wb;

      const dateA = String(a.fechaAlerta || "");
      const dateB = String(b.fechaAlerta || "");

      if (dateA !== dateB) return dateB.localeCompare(dateA);

      return String(b.id || "").localeCompare(String(a.id || ""));
    });

    return data;
  }

  function renderMetrics(data) {
    const pendientes = data.filter((item) => item.estado === "pendiente").length;
    const vistas = data.filter((item) => item.estado === "vista").length;
    const resueltas = data.filter((item) => item.estado === "resuelta").length;
    const vencidas = data.filter((item) => item.estado === "vencida").length;
    const urgentes = data.filter((item) => item.nivel === "urgente" || item.nivel === "vencida").length;

    if (elements.metricAlertasPendientes) elements.metricAlertasPendientes.textContent = String(pendientes);
    if (elements.metricAlertasVistas) elements.metricAlertasVistas.textContent = String(vistas);
    if (elements.metricAlertasResueltas) elements.metricAlertasResueltas.textContent = String(resueltas);
    if (elements.metricAlertasVencidas) elements.metricAlertasVencidas.textContent = String(vencidas);
    if (elements.metricAlertasUrgentes) elements.metricAlertasUrgentes.textContent = String(urgentes);
    if (elements.metricAlertasTotal) elements.metricAlertasTotal.textContent = String(data.length);
  }

  function tipoLabel(value) {
    const found = (cfg.alertTypes || []).find((item) => item.value === value);
    return found ? found.label : value || "-";
  }

  function nivelBadge(nivel) {
    const safe = String(nivel || "").toLowerCase();

    if (safe === "urgente") return '<span class="badge cc-status-vencida">Urgente</span>';
    if (safe === "vencida") return '<span class="badge cc-status-vencida">Vencida</span>';
    if (safe === "preventiva") return '<span class="badge cc-status-pendiente">Preventiva</span>';
    if (safe === "informativa") return '<span class="badge bg-info-subtle text-info">Informativa</span>';

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function estadoBadge(estado) {
    const safe = String(estado || "").toLowerCase();

    if (safe === "pendiente") return '<span class="badge cc-status-pendiente">Pendiente</span>';
    if (safe === "vista") return '<span class="badge bg-info-subtle text-info">Vista</span>';
    if (safe === "resuelta") return '<span class="badge cc-status-activo">Resuelta</span>';
    if (safe === "vencida") return '<span class="badge cc-status-vencida">Vencida</span>';

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function truncate(text, max = 90) {
    const safe = String(text || "");
    if (safe.length <= max) return safe;
    return `${safe.slice(0, max)}...`;
  }

  function renderTable() {
    if (!elements.tablaAlertas) return;

    const data = applyFilters();
    renderMetrics(data);

    if (!data.length) {
      elements.tablaAlertas.innerHTML = `
        <tr>
          <td colspan="10" class="text-center text-muted py-4">
            No se encontraron alertas con los filtros aplicados.
          </td>
        </tr>
      `;
      return;
    }

    elements.tablaAlertas.innerHTML = data
      .map((alert) => {
        const period = getPeriod(alert.periodoId);
        const canView = alert.estado === "pendiente" || alert.estado === "vencida";
        const canResolve = alert.estado !== "resuelta";

        const viewButton = canView
          ? `<button
                class="btn btn-outline-info"
                type="button"
                data-action="vista"
                data-id="${utils.escapeHTML(alert.id)}"
                title="Marcar como vista"
              >
                <i class="bi bi-eye"></i>
              </button>`
          : "";

        const resolveButton = canResolve
          ? `<button
                class="btn btn-outline-success"
                type="button"
                data-action="resolver"
                data-id="${utils.escapeHTML(alert.id)}"
                title="Marcar como resuelta"
              >
                <i class="bi bi-check2-circle"></i>
              </button>`
          : "";

        return `
          <tr>
            <td><code>${utils.escapeHTML(alert.id)}</code></td>
            <td>
              <strong>${utils.escapeHTML(getClientName(alert.clienteId))}</strong>
              <small class="d-block text-muted">${utils.escapeHTML(alert.clienteId)}</small>
            </td>
            <td>${utils.escapeHTML(period ? periodLabel(period) : "-")}</td>
            <td>${utils.escapeHTML(tipoLabel(alert.tipo))}</td>
            <td>${nivelBadge(alert.nivel)}</td>
            <td><strong>${utils.escapeHTML(alert.titulo || "-")}</strong></td>
            <td class="small text-muted">${utils.escapeHTML(truncate(alert.mensaje))}</td>
            <td>${utils.escapeHTML(utils.formatDate(alert.fechaAlerta))}</td>
            <td>${estadoBadge(alert.estado)}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm" role="group">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  data-action="ver"
                  data-id="${utils.escapeHTML(alert.id)}"
                  title="Ver detalle"
                >
                  <i class="bi bi-card-text"></i>
                </button>
                ${viewButton}
                ${resolveButton}
                <button
                  class="btn btn-outline-primary"
                  type="button"
                  data-action="copiar"
                  data-id="${utils.escapeHTML(alert.id)}"
                  title="Copiar mensaje WhatsApp"
                >
                  <i class="bi bi-clipboard"></i>
                </button>
                <button
                  class="btn btn-outline-success"
                  type="button"
                  data-action="whatsapp"
                  data-id="${utils.escapeHTML(alert.id)}"
                  title="Abrir WhatsApp"
                >
                  <i class="bi bi-whatsapp"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function render() {
    if (!isAlertasPage()) return;
    renderTable();
  }

  function sanitizePhone(value) {
    const digits = String(value || "").replace(/\D/g, "");

    if (!digits) return "";

    if (digits.startsWith("591")) return digits;

    if (digits.length >= 7) return `591${digits}`;

    return "";
  }

  function getClientPhone(client) {
    if (!client) return "";
    return sanitizePhone(client.whatsapp || client.telefono);
  }

  function buildWhatsAppMessage(alert) {
    const client = getClient(alert.clienteId);
    const period = getPeriod(alert.periodoId);

    return [
      "Cuentas Claras – Alerta contable",
      `Cliente: ${client ? client.nombreComercial : "-"}`,
      `Periodo: ${period ? periodLabel(period) : "-"}`,
      `Alerta: ${alert.titulo || "-"}`,
      `Detalle: ${alert.mensaje || "-"}`,
      "",
      cfg.messages?.professionalDisclaimer ||
        "Este aviso es preventivo y no sustituye la revisión de un Contador Público Autorizado."
    ].join("\n");
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      utils.showToast("Mensaje copiado al portapapeles.", "success");
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        utils.showToast("Mensaje copiado.", "success");
      } catch (err) {
        utils.showToast("No se pudo copiar el mensaje.", "danger");
      }

      document.body.removeChild(textarea);
    }
  }

  function copyAlert(id) {
    const alert = storage.get("alerts", id);

    if (!alert) {
      utils.showToast("Alerta no encontrada.", "danger");
      return;
    }

    copyText(buildWhatsAppMessage(alert));
  }

  function openWhatsApp(id) {
    const alert = storage.get("alerts", id);

    if (!alert) {
      utils.showToast("Alerta no encontrada.", "danger");
      return;
    }

    const client = getClient(alert.clienteId);
    const phone = getClientPhone(client);

    if (!phone) {
      utils.showToast("El cliente no tiene teléfono o WhatsApp registrado.", "warning");
      return;
    }

    const message = encodeURIComponent(buildWhatsAppMessage(alert));
    const url = `https://wa.me/${phone}?text=${message}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  function setState(id, estado) {
    const alert = storage.get("alerts", id);

    if (!alert) {
      utils.showToast("Alerta no encontrada.", "danger");
      return;
    }

    if (alert.estado === estado) {
      utils.showToast("La alerta ya está en ese estado.", "info");
      return;
    }

    if (estado === "resuelta") {
      const ok = utils.confirmDialog(
        `¿Marcar como resuelta la alerta ${alert.id}? Esta acción quedará registrada en bitácora.`
      );

      if (!ok) return;
    }

    storage.update("alerts", id, { estado });

    if (bitacora) {
      bitacora.log(
        estado === "vista" ? "marcar_alerta_vista" : "resolver_alerta",
        "alerts",
        id,
        `Alerta ${id} marcada como ${estado}`
      );
    }

    utils.showToast(`Alerta marcada como ${estado}.`, "success");
    render();
    renderDashboard();
  }

  function viewAlert(id) {
    const alert = storage.get("alerts", id);

    if (!alert) {
      utils.showToast("Alerta no encontrada.", "danger");
      return;
    }

    const client = getClient(alert.clienteId);
    const period = getPeriod(alert.periodoId);

    elements.detalleContenido.innerHTML = `
      <div class="row g-3">
        <div class="col-12">
          <h3 class="h5 fw-bold mb-1">${utils.escapeHTML(alert.titulo || "Alerta")}</h3>
          <p class="text-muted mb-0">
            ${utils.escapeHTML(alert.id)} · ${utils.escapeHTML(getClientName(alert.clienteId))}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Cliente</p>
            <strong>${utils.escapeHTML(client ? client.nombreComercial : "-")}</strong>
            <small class="d-block text-muted">${utils.escapeHTML(alert.clienteId)}</small>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Periodo</p>
            <strong>${utils.escapeHTML(period ? periodLabel(period) : "-")}</strong>
            <small class="d-block text-muted">${utils.escapeHTML(alert.periodoId || "-")}</small>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Tipo</p>
            <strong>${utils.escapeHTML(tipoLabel(alert.tipo))}</strong>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Nivel</p>
            ${nivelBadge(alert.nivel)}
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Estado</p>
            ${estadoBadge(alert.estado)}
          </div>
        </div>

        <div class="col-12">
          <div class="border rounded p-3">
            <p class="small text-muted mb-1">Mensaje</p>
            <p class="mb-0">${utils.escapeHTML(alert.mensaje || "-")}</p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Referencia interna</p>
            <strong>${utils.escapeHTML(alert.registroId || "-")}</strong>
            <small class="d-block text-muted">Entidad: ${utils.escapeHTML(alert.entidad || "-")}</small>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Fecha de alerta</p>
            <strong>${utils.escapeHTML(utils.formatDate(alert.fechaAlerta))}</strong>
          </div>
        </div>

        <div class="col-12">
          <div class="alert alert-info mb-0 small">
            <strong>Acción sugerida:</strong>
            valide la condición descrita, corrija el registro origen si corresponde y marque la alerta como resuelta.
          </div>
        </div>
      </div>
    `;

    showDetalleModal();
  }

  function bindAlertasEvents() {
    if (alertasEventsBound || !isAlertasPage()) return;

    elements.btnGenerarAlertas?.addEventListener("click", () => generateAll(true));
    elements.btnImprimirAlertas?.addEventListener("click", () => window.print());

    elements.alertasBusqueda?.addEventListener("input", render);
    elements.alertasFiltroCliente?.addEventListener("change", () => {
      loadPeriodOptions(elements.alertasFiltroCliente.value);
      render();
    });
    elements.alertasFiltroPeriodo?.addEventListener("change", render);
    elements.alertasFiltroTipo?.addEventListener("change", render);
    elements.alertasFiltroNivel?.addEventListener("change", render);
    elements.alertasFiltroEstado?.addEventListener("change", render);

    elements.btnLimpiarFiltros?.addEventListener("click", () => {
      if (elements.alertasBusqueda) elements.alertasBusqueda.value = "";
      if (elements.alertasFiltroCliente) elements.alertasFiltroCliente.value = "";
      if (elements.alertasFiltroPeriodo) elements.alertasFiltroPeriodo.value = "";
      if (elements.alertasFiltroTipo) elements.alertasFiltroTipo.value = "";
      if (elements.alertasFiltroNivel) elements.alertasFiltroNivel.value = "";
      if (elements.alertasFiltroEstado) elements.alertasFiltroEstado.value = "";

      loadPeriodOptions("");
      setAlert("");
      render();
    });

    elements.tablaAlertas?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) return;

      const action = button.dataset.action;
      const id = button.dataset.id;

      if (action === "ver") viewAlert(id);
      if (action === "vista") setState(id, "vista");
      if (action === "resolver") setState(id, "resuelta");
      if (action === "copiar") copyAlert(id);
      if (action === "whatsapp") openWhatsApp(id);
    });

    alertasEventsBound = true;
  }

  function renderDashboard() {
    const container = elements.dashboardAlertas;

    if (!container) return;

    const alerts = getAlerts()
      .filter((alert) => ["pendiente", "vencida", "vista"].includes(alert.estado))
      .sort((a, b) => {
        const wa = nivelWeight(a.nivel);
        const wb = nivelWeight(b.nivel);

        if (wa !== wb) return wa - wb;

        const dateA = String(a.fechaAlerta || "");
        const dateB = String(b.fechaAlerta || "");

        if (dateA !== dateB) return dateB.localeCompare(dateA);

        return String(b.id || "").localeCompare(String(a.id || ""));
      })
      .slice(0, 5);

    if (!alerts.length) {
      container.innerHTML = `
        <div class="alert alert-success small mb-0">
          No hay alertas activas. Puede generar alertas automáticas para revisar vencimientos,
          documentos pendientes y controles contables.
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="list-group list-group-flush">
        ${alerts
          .map((alert) => {
            const period = getPeriod(alert.periodoId);

            return `
              <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between align-items-start gap-2">
                  <div>
                    <h6 class="mb-1 fw-semibold">${utils.escapeHTML(alert.titulo || "Alerta")}</h6>
                    <p class="mb-1 small text-muted">
                      ${utils.escapeHTML(getClientName(alert.clienteId))} ·
                      ${utils.escapeHTML(period ? periodLabel(period) : "Sin periodo")}
                    </p>
                    <p class="mb-0 small">${utils.escapeHTML(truncate(alert.mensaje, 140))}</p>
                  </div>
                  <div class="text-end">
                    ${nivelBadge(alert.nivel)}
                    <div class="mt-1">${estadoBadge(alert.estado)}</div>
                  </div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>

      <div class="mt-3 d-flex justify-content-end">
        <a href="./alertas.html" class="btn btn-outline-secondary btn-sm">
          Ver todas las alertas
        </a>
      </div>
    `;
  }

  function bindDashboardEvents() {
    if (dashboardEventsBound) return;

    elements.btnDashboardGenerarAlertas?.addEventListener("click", () => {
      generateAll(true);
    });

    dashboardEventsBound = true;
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    cacheElements();

    if (isAlertasPage()) {
      loadClients();
      loadPeriodOptions("");
      populateStaticFilters();
      bindAlertasEvents();
      render();
    }

    bindDashboardEvents();
    renderDashboard();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    render,
    renderDashboard,
    generateAll
  };
})();