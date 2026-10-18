/* =========================================================
   Cuentas Claras MVP
   Módulo de Libro Diario
   Fase 5
   ========================================================= */

window.CC_LIBRO_DIARIO = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const contabilidad = window.CC_CONTABILIDAD;

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
    elements.diarioFiltroCliente = document.getElementById("diarioFiltroCliente");
    elements.diarioFiltroPeriodo = document.getElementById("diarioFiltroPeriodo");
    elements.diarioFiltroTipo = document.getElementById("diarioFiltroTipo");
    elements.diarioFiltroOrigen = document.getElementById("diarioFiltroOrigen");
    elements.diarioFiltroEstado = document.getElementById("diarioFiltroEstado");
    elements.diarioBusqueda = document.getElementById("diarioBusqueda");

    elements.btnGenerarAsientos = document.getElementById("btnGenerarAsientos");
    elements.btnNuevoAsiento = document.getElementById("btnNuevoAsiento");
    elements.btnLimpiarFiltros = document.getElementById("btnLimpiarFiltrosDiario");
    elements.btnImprimirDiario = document.getElementById("btnImprimirDiario");

    elements.diarioAlerta = document.getElementById("diarioAlerta");

    elements.metricAsientosVigentes = document.getElementById("metricAsientosVigentes");
    elements.metricAsientosAnulados = document.getElementById("metricAsientosAnulados");
    elements.metricDebitos = document.getElementById("metricDebitos");
    elements.metricCreditos = document.getElementById("metricCreditos");
    elements.metricDiferencia = document.getElementById("metricDiferencia");
    elements.metricPendientes = document.getElementById("metricPendientes");

    elements.tablaAsientos = document.getElementById("tablaAsientos");

    elements.asientoManualModalEl = document.getElementById("asientoManualModal");
    elements.asientoManualForm = document.getElementById("asientoManualForm");

    elements.manualCliente = document.getElementById("manualCliente");
    elements.manualPeriodo = document.getElementById("manualPeriodo");
    elements.manualFecha = document.getElementById("manualFecha");
    elements.manualTipo = document.getElementById("manualTipo");
    elements.manualCategoriaGroup = document.getElementById("manualCategoriaGroup");
    elements.manualCategoria = document.getElementById("manualCategoria");
    elements.manualDescripcion = document.getElementById("manualDescripcion");
    elements.manualObservacion = document.getElementById("manualObservacion");

    elements.manualLines = document.getElementById("manualLines");
    elements.btnAgregarLinea = document.getElementById("btnAgregarLinea");

    elements.totalManualDebito = document.getElementById("totalManualDebito");
    elements.totalManualCredito = document.getElementById("totalManualCredito");
    elements.totalManualDiferencia = document.getElementById("totalManualDiferencia");

    elements.asientoDetalleModalEl = document.getElementById("asientoDetalleModal");
    elements.asientoDetalleContenido = document.getElementById("asientoDetalleContenido");
  }

  function round2(value) {
    return contabilidad && contabilidad.round2
      ? contabilidad.round2(value)
      : Math.round((Number(value) || 0) * 100) / 100;
  }

  function setAlert(message, type = "info") {
    if (!elements.diarioAlerta) return;

    if (!message) {
      elements.diarioAlerta.classList.add("d-none");
      elements.diarioAlerta.textContent = "";
      return;
    }

    elements.diarioAlerta.className = `alert alert-${type}`;
    elements.diarioAlerta.textContent = message;
    elements.diarioAlerta.classList.remove("d-none");
  }

  function getModalInstance(el) {
    return bootstrap.Modal.getOrCreateInstance(el);
  }

  function showManualModal() {
    getModalInstance(elements.asientoManualModalEl).show();
  }

  function hideManualModal() {
    const instance = bootstrap.Modal.getInstance(elements.asientoManualModalEl);
    if (instance) instance.hide();
  }

  function showDetalleModal() {
    getModalInstance(elements.asientoDetalleModalEl).show();
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

  function ensureAccountsCatalog() {
    const accounts = storage.list("accounts");

    if (accounts.length > 0) return;

    const catalog = cfg.accountCatalog || [];

    catalog.forEach((account) => {
      storage.create(
        "accounts",
        {
          ...account
        },
        "ACC"
      );
    });

    if (window.CC_BITACORA) {
      window.CC_BITACORA.log(
        "cargar_plan_cuentas",
        "accounts",
        null,
        "Plan de cuentas inicial migrado desde configuración"
      );
    }
  }

  function getAllClients() {
    return storage.list("clients");
  }

  function getActiveClients() {
    return getAllClients().filter((client) => client.estado === "activo");
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

  function getPeriodOptions(clientId, onlyOpen = false) {
    let periods = getPeriods().filter((period) => period.clienteId === clientId);

    if (onlyOpen) {
      periods = periods.filter((period) => period.estado !== "cerrado");
    }

    return periods.sort((a, b) => {
      if (Number(b.anio) !== Number(a.anio)) {
        return Number(b.anio) - Number(a.anio);
      }
      return Number(b.mes) - Number(a.mes);
    });
  }

  function getAccountOptions() {
    return storage
      .list("accounts")
      .filter(
        (account) =>
          Number(account.nivel) === 3 &&
          account.estado === "activa"
      )
      .sort((a, b) => String(a.codigo || "").localeCompare(String(b.codigo || "")));
  }

  function accountOptionsHtml(selected = "") {
    const accounts = getAccountOptions();

    return `
      <option value="">Seleccione una cuenta...</option>
      ${accounts
        .map(
          (account) => `
            <option
              value="${utils.escapeHTML(account.codigo)}"
              ${account.codigo === selected ? "selected" : ""}
            >
              ${utils.escapeHTML(`${account.codigo} - ${account.nombre}`)}
            </option>
          `
        )
        .join("")}
    `;
  }

  function populateFilters() {
    populateSelect(
      elements.diarioFiltroCliente,
      getAllClients()
        .sort((a, b) =>
          String(a.nombreComercial || "").localeCompare(String(b.nombreComercial || ""))
        )
        .map((client) => ({
          value: client.id,
          label: `${client.nombreComercial} (${client.id})`
        })),
      "Todos"
    );

    populateSelect(
      elements.diarioFiltroTipo,
      cfg.journalEntryTypes.map((item) => ({
        value: item.value,
        label: item.label
      })),
      "Todos"
    );

    populateSelect(
      elements.diarioFiltroOrigen,
      cfg.journalOrigins.map((item) => ({
        value: item.value,
        label: item.label
      })),
      "Todos"
    );

    populateSelect(
      elements.diarioFiltroEstado,
      cfg.journalEntryStates.map((item) => ({
        value: item.value,
        label: item.label
      })),
      "Todos"
    );
  }

  function loadFilterPeriods(clientId) {
    if (!elements.diarioFiltroPeriodo) return;

    if (!clientId) {
      populateSelect(
        elements.diarioFiltroPeriodo,
        getPeriods()
          .sort((a, b) => {
            if (Number(b.anio) !== Number(a.anio)) {
              return Number(b.anio) - Number(a.anio);
            }
            return Number(b.mes) - Number(a.mes);
          })
          .map((period) => ({
            value: period.id,
            label: `${getClientName(period.clienteId)} · ${periodLabel(period)}`
          })),
        "Todos"
      );
      return;
    }

    populateSelect(
      elements.diarioFiltroPeriodo,
      getPeriodOptions(clientId).map((period) => ({
        value: period.id,
        label: periodLabel(period)
      })),
      "Todos"
    );
  }

  function populateManualStatic() {
    populateSelect(
      elements.manualCliente,
      getActiveClients()
        .sort((a, b) =>
          String(a.nombreComercial || "").localeCompare(String(b.nombreComercial || ""))
        )
        .map((client) => ({
          value: client.id,
          label: `${client.nombreComercial} (${client.id})`
        })),
      "Seleccione un cliente activo..."
    );

    const manualTypes = (cfg.journalEntryTypes || []).filter(
      (item) => item.value !== "cierre"
    );

    populateSelect(
      elements.manualTipo,
      manualTypes.map((item) => ({
        value: item.value,
        label: item.label
      })),
      "Seleccione..."
    );

    populateSelect(
      elements.manualCategoria,
      (cfg.adjustmentCategories || []).map((item) => ({
        value: item.value,
        label: item.label
      })),
      "No aplica"
    );
  }

  function loadManualPeriods(clientId) {
    if (!elements.manualPeriodo) return;

    if (!clientId) {
      populateSelect(
        elements.manualPeriodo,
        [],
        "Seleccione primero un cliente..."
      );
      return;
    }

    populateSelect(
      elements.manualPeriodo,
      getPeriodOptions(clientId, true).map((period) => ({
        value: period.id,
        label: periodLabel(period)
      })),
      "Seleccione..."
    );
  }

  function autoSelectDefault() {
    const clients = getActiveClients();

    if (!clients.length) return;

    const firstClient = clients[0];
    elements.diarioFiltroCliente.value = firstClient.id;

    loadFilterPeriods(firstClient.id);

    const periods = getPeriodOptions(firstClient.id);

    if (periods.length) {
      elements.diarioFiltroPeriodo.value = periods[0].id;
    }
  }

  function applyFilters() {
    return contabilidad.getEntries({
      clienteId: elements.diarioFiltroCliente?.value || "",
      periodoId: elements.diarioFiltroPeriodo?.value || "",
      tipoAsiento: elements.diarioFiltroTipo?.value || "",
      origen: elements.diarioFiltroOrigen?.value || "",
      estado: elements.diarioFiltroEstado?.value || "",
      search: elements.diarioFiltroBusqueda?.value || elements.diarioBusqueda?.value || ""
    });
  }

  function renderMetrics(entries) {
    const vigente = entries.filter((entry) => entry.estado === "vigente");
    const anulado = entries.filter((entry) => entry.estado === "anulado");

    let totalDebito = 0;
    let totalCredito = 0;

    vigente.forEach((entry) => {
      const summary = contabilidad.summarizeEntry(entry.id);
      totalDebito += summary.debito;
      totalCredito += summary.credito;
    });

    totalDebito = round2(totalDebito);
    totalCredito = round2(totalCredito);

    const diferencia = round2(totalDebito - totalCredito);

    const clientId = elements.diarioFiltroCliente?.value || "";
    const periodoId = elements.diarioFiltroPeriodo?.value || "";

    const pendientes =
      clientId && periodoId
        ? contabilidad.getPendingTransactions(clientId, periodoId).length
        : 0;

    if (elements.metricAsientosVigentes) {
      elements.metricAsientosVigentes.textContent = String(vigente.length);
    }

    if (elements.metricAsientosAnulados) {
      elements.metricAsientosAnulados.textContent = String(anulado.length);
    }

    if (elements.metricDebitos) {
      elements.metricDebitos.textContent = utils.formatMoney(totalDebito);
    }

    if (elements.metricCreditos) {
      elements.metricCreditos.textContent = utils.formatMoney(totalCredito);
    }

    if (elements.metricDiferencia) {
      elements.metricDiferencia.textContent = utils.formatMoney(diferencia);
      elements.metricDiferencia.className =
        "h6 mb-0 fw-bold " +
        (Math.abs(diferencia) <= 0.01 ? "text-success" : "text-danger");
    }

    if (elements.metricPendientes) {
      elements.metricPendientes.textContent = String(pendientes);
    }
  }

  function entryTypeBadge(tipo) {
    const safe = String(tipo || "").toLowerCase();

    if (safe === "operacion") {
      return '<span class="badge bg-primary-subtle text-primary">Operación</span>';
    }

    if (safe === "ajuste") {
      return '<span class="badge bg-warning-subtle text-warning">Ajuste</span>';
    }

    if (safe === "cierre") {
      return '<span class="badge bg-dark">Cierre</span>';
    }

    if (safe === "apertura") {
      return '<span class="badge bg-info-subtle text-info">Apertura</span>';
    }

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function originBadge(origen) {
    const safe = String(origen || "").toLowerCase();

    if (safe === "automatico") {
      return '<span class="badge bg-success-subtle text-success">Automático</span>';
    }

    if (safe === "manual") {
      return '<span class="badge bg-secondary-subtle text-secondary">Manual</span>';
    }

    return `<span class="badge bg-light text-dark">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function entryStateBadge(estado) {
    const safe = String(estado || "").toLowerCase();

    if (safe === "vigente") {
      return '<span class="badge cc-status-activo">Vigente</span>';
    }

    if (safe === "anulado") {
      return '<span class="badge cc-status-anulada">Anulado</span>';
    }

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function renderTable(entries) {
    if (!elements.tablaAsientos) return;

    if (!entries.length) {
      elements.tablaAsientos.innerHTML = `
        <tr>
          <td colspan="11" class="text-center text-muted py-4">
            No se encontraron asientos con los filtros aplicados.
          </td>
        </tr>
      `;
      return;
    }

    elements.tablaAsientos.innerHTML = entries
      .map((entry) => {
        const summary = contabilidad.summarizeEntry(entry.id);
        const period = getPeriodById(entry.periodoId);
        const canVoid =
          entry.estado === "vigente" &&
          period &&
          period.estado !== "cerrado";

        const voidButton = canVoid
          ? `<button
                class="btn btn-outline-danger"
                type="button"
                data-action="anular"
                data-id="${utils.escapeHTML(entry.id)}"
                title="Anular asiento"
              >
                <i class="bi bi-x-octagon"></i>
              </button>`
          : `<button
                class="btn btn-outline-danger disabled"
                type="button"
                title="No anulable"
              >
                <i class="bi bi-x-octagon"></i>
              </button>`;

        return `
          <tr>
            <td><code>${utils.escapeHTML(entry.folio || entry.id)}</code></td>
            <td>${utils.escapeHTML(utils.formatDate(entry.fecha))}</td>
            <td>
              <strong>${utils.escapeHTML(getClientName(entry.clienteId))}</strong>
              <small class="d-block text-muted">
                ${utils.escapeHTML(entry.clienteId)}
              </small>
            </td>
            <td>${utils.escapeHTML(period ? periodLabel(period) : "-")}</td>
            <td>${entryTypeBadge(entry.tipoAsiento)}</td>
            <td>${originBadge(entry.origen)}</td>
            <td>
              ${utils.escapeHTML(entry.descripcion || "-")}
              ${
                entry.categoriaAjuste
                  ? `<small class="d-block text-muted">
                      Categoría: ${utils.escapeHTML(entry.categoriaAjuste)}
                    </small>`
                  : ""
              }
            </td>
            <td>${utils.escapeHTML(utils.formatMoney(summary.debito))}</td>
            <td>${utils.escapeHTML(utils.formatMoney(summary.credito))}</td>
            <td>${entryStateBadge(entry.estado)}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm" role="group">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  data-action="ver"
                  data-id="${utils.escapeHTML(entry.id)}"
                  title="Ver detalle"
                >
                  <i class="bi bi-eye"></i>
                </button>
                ${voidButton}
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function render() {
    const entries = applyFilters();
    renderMetrics(entries);
    renderTable(entries);
  }

  function viewEntry(id) {
    const detail = contabilidad.getEntryDetail(id);

    if (!detail) {
      utils.showToast("Asiento no encontrado.", "danger");
      return;
    }

    const { entry, lines } = detail;
    const summary = contabilidad.summarizeEntry(id);
    const client = getClientById(entry.clienteId);
    const period = getPeriodById(entry.periodoId);

    elements.asientoDetalleContenido.innerHTML = `
      <div class="row g-3 mb-3">
        <div class="col-12">
          <h3 class="h5 fw-bold mb-1">
            ${utils.escapeHTML(entry.folio || entry.id)}
          </h3>
          <p class="text-muted mb-0">
            ${utils.escapeHTML(client ? client.nombreComercial : "Cliente no encontrado")} ·
            ${utils.escapeHTML(period ? periodLabel(period) : "Periodo no encontrado")}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Fecha</p>
            <strong>${utils.escapeHTML(utils.formatDate(entry.fecha))}</strong>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Tipo</p>
            ${entryTypeBadge(entry.tipoAsiento)}
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Origen</p>
            ${originBadge(entry.origen)}
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Estado</p>
            ${entryStateBadge(entry.estado)}
          </div>
        </div>

        <div class="col-12">
          <div class="border rounded p-3">
            <p class="small text-muted mb-1">Descripción</p>
            <strong>${utils.escapeHTML(entry.descripcion || "-")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Transacción origen</p>
            <strong>${utils.escapeHTML(entry.transaccionId || "Manual / sin transacción")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Documento respaldo</p>
            <strong>${utils.escapeHTML(entry.documentoId || "Sin documento")}</strong>
          </div>
        </div>

        <div class="col-12">
          <div class="border rounded p-3">
            <p class="small text-muted mb-1">Observación</p>
            <p class="mb-0">${utils.escapeHTML(entry.observacion || "Sin observaciones.")}</p>
          </div>
        </div>
      </div>

      <h6 class="fw-semibold mb-2">Líneas del asiento</h6>

      <div class="table-responsive mb-3">
        <table class="table table-bordered align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Cuenta</th>
              <th>Nombre</th>
              <th>Débito</th>
              <th>Crédito</th>
              <th>Tercero</th>
              <th>Referencia</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            ${lines
              .map(
                (line) => `
                  <tr>
                    <td><code>${utils.escapeHTML(line.cuentaCodigo)}</code></td>
                    <td>${utils.escapeHTML(line.cuentaNombre || "-")}</td>
                    <td>${utils.escapeHTML(utils.formatMoney(line.debito))}</td>
                    <td>${utils.escapeHTML(utils.formatMoney(line.credito))}</td>
                    <td>${utils.escapeHTML(line.tercero || "-")}</td>
                    <td>${utils.escapeHTML(line.referencia || "-")}</td>
                    <td>${utils.escapeHTML(line.observacion || "-")}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
          <tfoot class="table-light">
            <tr>
              <th colspan="2" class="text-end">Totales</th>
              <th>${utils.escapeHTML(utils.formatMoney(summary.debito))}</th>
              <th>${utils.escapeHTML(utils.formatMoney(summary.credito))}</th>
              <th colspan="3">
                ${
                  summary.cuadrado
                    ? '<span class="badge cc-status-activo">Cuadrado</span>'
                    : '<span class="badge cc-status-vencida">Descuadrado</span>'
                }
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="alert alert-info mb-0 small">
        Este asiento forma parte del Libro Diario. El Libro Mayor, la Balanza
        y los Estados Financieros se derivarán de estos registros.
      </div>
    `;

    showDetalleModal();
  }

  function voidEntry(id) {
    const entry = storage.get("journalEntries", id);

    if (!entry) {
      utils.showToast("Asiento no encontrado.", "danger");
      return;
    }

    const ok = utils.confirmDialog(
      `¿Seguro que deseas anular el asiento ${entry.folio || entry.id}? No se elimina, queda registrado para trazabilidad.`
    );

    if (!ok) return;

    try {
      contabilidad.voidEntry(id);
      utils.showToast("Asiento anulado correctamente.", "success");
      render();
    } catch (error) {
      utils.showToast(error.message, "danger");
    }
  }

  function generateAutomatic() {
    const clientId = elements.diarioFiltroCliente?.value || "";
    const periodoId = elements.diarioFiltroPeriodo?.value || "";

    if (!clientId || !periodoId) {
      utils.showToast("Seleccione un cliente y un periodo para generar asientos.", "warning");
      return;
    }

    const period = getPeriodById(periodoId);

    if (!period) {
      utils.showToast("Periodo no encontrado.", "danger");
      return;
    }

    if (period.estado === "cerrado") {
      utils.showToast("No se pueden generar asientos en un periodo cerrado.", "warning");
      return;
    }

    const result = contabilidad.generateEntriesForPeriod(clientId, periodoId);

    if (result.errors.length) {
      const firstErrors = result.errors
        .slice(0, 3)
        .map((err) => `${err.transactionId}: ${err.message}`)
        .join(" | ");

      setAlert(
        `Se generaron ${result.created.length} asientos. Hubo ${result.errors.length} errores. ${firstErrors}`,
        "warning"
      );
    } else {
      setAlert(
        `Se generaron ${result.created.length} asientos automáticos correctamente.`,
        "success"
      );
    }

    utils.showToast(
      result.created.length > 0
        ? "Asientos automáticos generados."
        : "No había transacciones pendientes para generar asientos.",
      result.created.length > 0 ? "success" : "info"
    );

    render();
  }

  function addManualLine(data = {}) {
    const row = document.createElement("div");

    row.className =
      "row g-2 align-items-end cc-asiento-linea mb-2 border rounded p-2 bg-white";

    row.innerHTML = `
      <div class="col-12 col-md-4">
        <label class="form-label small mb-1">Cuenta *</label>
        <select class="form-select form-select-sm cuenta-select" required>
          ${accountOptionsHtml(data.cuentaCodigo || "")}
        </select>
      </div>

      <div class="col-6 col-md-2">
        <label class="form-label small mb-1">Débito</label>
        <input
          type="number"
          step="0.01"
          min="0"
          class="form-control form-control-sm debito-input"
          value="${data.debito ?? 0}"
        >
      </div>

      <div class="col-6 col-md-2">
        <label class="form-label small mb-1">Crédito</label>
        <input
          type="number"
          step="0.01"
          min="0"
          class="form-control form-control-sm credito-input"
          value="${data.credito ?? 0}"
        >
      </div>

      <div class="col-12 col-md-3">
        <label class="form-label small mb-1">Tercero</label>
        <input
          type="text"
          class="form-control form-control-sm tercero-input"
          value="${utils.escapeHTML(data.tercero || "")}"
          placeholder="Opcional"
        >
      </div>

      <div class="col-12 col-md-1 d-grid">
        <button
          type="button"
          class="btn btn-outline-danger btn-sm remove-line"
          title="Eliminar línea"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>

      <div class="col-12">
        <input
          type="text"
          class="form-control form-control-sm observacion-input"
          value="${utils.escapeHTML(data.observacion || "")}"
          placeholder="Observación de la línea (opcional)"
        >
      </div>
    `;

    elements.manualLines.appendChild(row);
    updateManualTotals();
  }

  function readManualLines() {
    const rows = Array.from(
      elements.manualLines.querySelectorAll(".cc-asiento-linea")
    );

    return rows
      .map((row) => {
        const cuentaCodigo = row.querySelector(".cuenta-select")?.value.trim() || "";
        const debito = round2(row.querySelector(".debito-input")?.value);
        const credito = round2(row.querySelector(".credito-input")?.value);
        const tercero = row.querySelector(".tercero-input")?.value.trim() || "";
        const observacion = row.querySelector(".observacion-input")?.value.trim() || "";

        return {
          cuentaCodigo,
          debito,
          credito,
          tercero,
          observacion
        };
      })
      .filter(
        (line) =>
          line.cuentaCodigo ||
          line.debito > 0 ||
          line.credito > 0 ||
          line.tercero ||
          line.observacion
      );
  }

  function updateManualTotals() {
    const lines = readManualLines();

    const totalDebito = round2(
      lines.reduce((sum, line) => sum + (Number(line.debito) || 0), 0)
    );

    const totalCredito = round2(
      lines.reduce((sum, line) => sum + (Number(line.credito) || 0), 0)
    );

    const diferencia = round2(totalDebito - totalCredito);

    if (elements.totalManualDebito) {
      elements.totalManualDebito.textContent = utils.formatMoney(totalDebito);
    }

    if (elements.totalManualCredito) {
      elements.totalManualCredito.textContent = utils.formatMoney(totalCredito);
    }

    if (elements.totalManualDiferencia) {
      elements.totalManualDiferencia.textContent = utils.formatMoney(diferencia);
      elements.totalManualDiferencia.className =
        "fs-5 " +
        (Math.abs(diferencia) <= 0.01 ? "text-success" : "text-danger");
    }
  }

  function resetManualForm() {
    if (!elements.asientoManualForm) return;

    elements.asientoManualForm.reset();
    elements.manualLines.innerHTML = "";

    populateManualStatic();
    loadManualPeriods("");

    elements.manualFecha.value = utils.todayISO();
    elements.manualTipo.value = "operacion";
    toggleCategoria();

    addManualLine();
    addManualLine();
  }

  function openManualModal() {
    resetManualForm();
    showManualModal();
  }

  function toggleCategoria() {
    const isAjuste = elements.manualTipo?.value === "ajuste";

    if (elements.manualCategoriaGroup) {
      elements.manualCategoriaGroup.classList.toggle("d-none", !isAjuste);
    }

    if (!isAjuste && elements.manualCategoria) {
      elements.manualCategoria.value = "";
    }
  }

  function getManualPayload() {
    const lines = readManualLines();

    if (lines.length < 2) {
      throw new Error("Un asiento manual debe tener al menos dos líneas con datos.");
    }

    for (const line of lines) {
      if (!line.cuentaCodigo) {
        throw new Error("Toda línea debe seleccionar una cuenta contable.");
      }

      if (line.debito > 0 && line.credito > 0) {
        throw new Error("Una línea no puede tener débito y crédito al mismo tiempo.");
      }

      if (line.debito === 0 && line.credito === 0) {
        throw new Error("Cada línea debe tener un débito o un crédito mayor que cero.");
      }
    }

    const totalDebito = round2(
      lines.reduce((sum, line) => sum + line.debito, 0)
    );

    const totalCredito = round2(
      lines.reduce((sum, line) => sum + line.credito, 0)
    );

    if (Math.abs(totalDebito - totalCredito) > 0.01) {
      throw new Error("El asiento no cuadra: los débitos y créditos deben ser iguales.");
    }

    return {
      clienteId: elements.manualCliente.value,
      periodoId: elements.manualPeriodo.value,
      fecha: elements.manualFecha.value,
      tipoAsiento: elements.manualTipo.value,
      categoriaAjuste:
        elements.manualTipo.value === "ajuste"
          ? elements.manualCategoria.value || null
          : null,
      documentoId: null,
      descripcion: elements.manualDescripcion.value.trim(),
      observacion: elements.manualObservacion.value.trim(),
      lines: lines.map((line) => ({
        cuentaCodigo: line.cuentaCodigo,
        debito: line.debito,
        credito: line.credito,
        tercero: line.tercero,
        referencia: "",
        observacion: line.observacion
      }))
    };
  }

  function saveManualEntry(event) {
    event.preventDefault();

    try {
      const payload = getManualPayload();
      contabilidad.createManualEntry(payload);

      utils.showToast("Asiento manual registrado correctamente.", "success");
      hideManualModal();
      render();
    } catch (error) {
      utils.showToast(error.message, "danger");
    }
  }

  function bindEvents() {
    elements.diarioFiltroCliente?.addEventListener("change", () => {
      loadFilterPeriods(elements.diarioFiltroCliente.value);
      render();
    });

    elements.diarioFiltroPeriodo?.addEventListener("change", render);
    elements.diarioFiltroTipo?.addEventListener("change", render);
    elements.diarioFiltroOrigen?.addEventListener("change", render);
    elements.diarioFiltroEstado?.addEventListener("change", render);
    elements.diarioBusqueda?.addEventListener("input", render);

    elements.btnLimpiarFiltros?.addEventListener("click", () => {
      if (elements.diarioFiltroCliente) elements.diarioFiltroCliente.value = "";
      if (elements.diarioFiltroPeriodo) elements.diarioFiltroPeriodo.value = "";
      if (elements.diarioFiltroTipo) elements.diarioFiltroTipo.value = "";
      if (elements.diarioFiltroOrigen) elements.diarioFiltroOrigen.value = "";
      if (elements.diarioFiltroEstado) elements.diarioFiltroEstado.value = "";
      if (elements.diarioBusqueda) elements.diarioBusqueda.value = "";

      loadFilterPeriods("");
      setAlert("");
      render();
    });

    elements.btnGenerarAsientos?.addEventListener("click", generateAutomatic);
    elements.btnNuevoAsiento?.addEventListener("click", openManualModal);
    elements.btnImprimirDiario?.addEventListener("click", () => window.print());

    elements.tablaAsientos?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) return;

      const action = button.dataset.action;
      const id = button.dataset.id;

      if (action === "ver") viewEntry(id);
      if (action === "anular") voidEntry(id);
    });

    elements.manualCliente?.addEventListener("change", () => {
      loadManualPeriods(elements.manualCliente.value);
    });

    elements.manualTipo?.addEventListener("change", toggleCategoria);

    elements.btnAgregarLinea?.addEventListener("click", () => addManualLine());

    elements.manualLines?.addEventListener("click", (event) => {
      const button = event.target.closest(".remove-line");

      if (!button) return;

      const row = button.closest(".cc-asiento-linea");

      if (!row) return;

      if (elements.manualLines.children.length <= 2) {
        utils.showToast("Un asiento debe tener al menos dos líneas.", "warning");
        return;
      }

      row.remove();
      updateManualTotals();
    });

    elements.manualLines?.addEventListener("input", updateManualTotals);
    elements.manualLines?.addEventListener("change", updateManualTotals);

    elements.asientoManualForm?.addEventListener("submit", saveManualEntry);
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    if (!contabilidad) {
      console.error("No se encontró CC_CONTABILIDAD.");
      utils.showToast(
        "El motor contable no está cargado. Revisa js/modules/contabilidad.js.",
        "danger"
      );
      return;
    }

    cacheElements();
    ensureAccountsCatalog();
    populateFilters();
    loadFilterPeriods("");
    populateManualStatic();
    autoSelectDefault();
    bindEvents();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    render
  };
})();