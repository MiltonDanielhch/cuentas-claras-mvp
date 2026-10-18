/* =========================================================
   Cuentas Claras MVP
   Módulo de periodos contables
   ========================================================= */

window.CC_PERIODOS = (function () {
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

  function cacheElements() {
    elements.tablaPeriodos = document.getElementById("tablaPeriodos");
    elements.btnNuevoPeriodo = document.getElementById("btnNuevoPeriodo");

    elements.periodoFiltroCliente = document.getElementById("periodoFiltroCliente");
    elements.periodoFiltroEstado = document.getElementById("periodoFiltroEstado");
    elements.periodoFiltroMes = document.getElementById("periodoFiltroMes");
    elements.periodoFiltroAnio = document.getElementById("periodoFiltroAnio");
    elements.btnLimpiarFiltros = document.getElementById("btnLimpiarFiltrosPeriodos");

    elements.periodoModalEl = document.getElementById("periodoModal");
    elements.periodoForm = document.getElementById("periodoForm");

    elements.detalleModalEl = document.getElementById("periodoDetalleModal");
    elements.detalleContenido = document.getElementById("periodoDetalleContenido");
  }

  function getModalInstance(el) {
    return bootstrap.Modal.getOrCreateInstance(el);
  }

  function showFormModal() {
    getModalInstance(elements.periodoModalEl).show();
  }

  function hideFormModal() {
    const instance = bootstrap.Modal.getInstance(elements.periodoModalEl);
    if (instance) instance.hide();
  }

  function showDetalleModal() {
    getModalInstance(elements.detalleModalEl).show();
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

  function getClients() {
    return storage.list("clients");
  }

  function getActiveClients() {
    return getClients().filter((client) => client.estado === "activo");
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

  function periodLabel(mes, anio) {
    const name = monthNames[Number(mes) - 1] || "Mes inválido";
    return `${name} ${anio}`;
  }

  function getStateBadge(estado) {
    const safe = String(estado || "").toLowerCase();

    if (safe === "abierto") {
      return '<span class="badge cc-status-abierto">Abierto</span>';
    }

    if (safe === "en_revision") {
      return '<span class="badge cc-status-en_revision">En revisión</span>';
    }

    if (safe === "cerrado") {
      return '<span class="badge cc-status-cerrado">Cerrado</span>';
    }

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function countDocuments(periodoId) {
    return storage
      .list("documents")
      .filter((item) => item.periodoId === periodoId).length;
  }

  function countTransactions(periodoId) {
    return storage
      .list("transactions")
      .filter((item) => item.periodoId === periodoId).length;
  }

  function countPendingDocuments(periodoId) {
    return storage
      .list("documents")
      .filter(
        (item) =>
          item.periodoId === periodoId &&
          item.estado === "pendiente"
      ).length;
  }

  function countTransactionsWithoutDocument(periodoId) {
    return storage
      .list("transactions")
      .filter(
        (item) =>
          item.periodoId === periodoId &&
          item.estado === "activa" &&
          !item.documentoId
      ).length;
  }

  function populateFilters() {
    populateSelect(
      elements.periodoFiltroCliente,
      getClients().map((client) => ({
        value: client.id,
        label: `${client.nombreComercial} (${client.id})`
      })),
      "Todos"
    );

    populateSelect(
      elements.periodoFiltroMes,
      monthNames.map((name, index) => ({
        value: index + 1,
        label: name
      })),
      "Todos"
    );
  }

  function populateForm() {
    populateSelect(
      document.getElementById("periodoCliente"),
      getActiveClients().map((client) => ({
        value: client.id,
        label: `${client.nombreComercial} (${client.id})`
      })),
      "Seleccione un cliente activo..."
    );

    populateSelect(
      document.getElementById("periodoMes"),
      monthNames.map((name, index) => ({
        value: index + 1,
        label: name
      })),
      "Seleccione..."
    );

    const now = new Date();
    document.getElementById("periodoAnio").value = now.getFullYear();
    document.getElementById("periodoMes").value = now.getMonth() + 1;
  }

  function applyFilters() {
    const clienteId = elements.periodoFiltroCliente?.value || "";
    const estado = elements.periodoFiltroEstado?.value || "";
    const mes = elements.periodoFiltroMes?.value || "";
    const anioRaw = elements.periodoFiltroAnio?.value || "";
    const anio = anioRaw ? Number(anioRaw) : null;

    let data = getPeriods();

    if (clienteId) {
      data = data.filter((item) => item.clienteId === clienteId);
    }

    if (estado) {
      data = data.filter((item) => item.estado === estado);
    }

    if (mes) {
      data = data.filter((item) => Number(item.mes) === Number(mes));
    }

    if (anio) {
      data = data.filter((item) => Number(item.anio) === Number(anio));
    }

    data.sort((a, b) => {
      if (Number(b.anio) !== Number(a.anio)) {
        return Number(b.anio) - Number(a.anio);
      }

      if (Number(b.mes) !== Number(a.mes)) {
        return Number(b.mes) - Number(a.mes);
      }

      return getClientName(a.clienteId).localeCompare(getClientName(b.clienteId));
    });

    return data;
  }

  function renderTable() {
    if (!elements.tablaPeriodos) return;

    const data = applyFilters();

    if (!data.length) {
      elements.tablaPeriodos.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted py-4">
            No se encontraron periodos con los filtros aplicados.
          </td>
        </tr>
      `;
      return;
    }

    elements.tablaPeriodos.innerHTML = data
      .map((period) => {
        const docs = countDocuments(period.id);
        const txs = countTransactions(period.id);

        const canClose = period.estado !== "cerrado";
        const canReopen = period.estado === "cerrado";

        return `
          <tr>
            <td><code>${utils.escapeHTML(period.id)}</code></td>
            <td>
              <strong>${utils.escapeHTML(getClientName(period.clienteId))}</strong>
              <small class="d-block text-muted">
                ${utils.escapeHTML(period.clienteId)}
              </small>
            </td>
            <td>${utils.escapeHTML(periodLabel(period.mes, period.anio))}</td>
            <td>${getStateBadge(period.estado)}</td>
            <td>${docs}</td>
            <td>${txs}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm" role="group">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  data-action="ver"
                  data-id="${utils.escapeHTML(period.id)}"
                  title="Ver ficha"
                >
                  <i class="bi bi-eye"></i>
                </button>

                ${
                  canClose
                    ? `<button
                        class="btn btn-outline-success"
                        type="button"
                        data-action="cerrar"
                        data-id="${utils.escapeHTML(period.id)}"
                        title="Cerrar periodo"
                      >
                        <i class="bi bi-lock"></i>
                      </button>`
                    : ""
                }

                ${
                  canReopen
                    ? `<button
                        class="btn btn-outline-warning"
                        type="button"
                        data-action="reabrir"
                        data-id="${utils.escapeHTML(period.id)}"
                        title="Reabrir periodo"
                      >
                        <i class="bi bi-unlock"></i>
                      </button>`
                    : ""
                }
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function resetForm() {
    if (!elements.periodoForm) return;

    elements.periodoForm.reset();
    populateForm();
  }

  function openCreate() {
    resetForm();
    showFormModal();
  }

  function validateForm(data) {
    const errors = [];

    if (!data.clienteId) {
      errors.push("Seleccione un cliente.");
    }

    if (!data.mes || data.mes < 1 || data.mes > 12) {
      errors.push("Seleccione un mes válido.");
    }

    if (!data.anio || data.anio < 2000 || data.anio > 2100) {
      errors.push("Ingrese un año válido.");
    }

    const duplicated = getPeriods().some(
      (period) =>
        period.clienteId === data.clienteId &&
        Number(period.mes) === Number(data.mes) &&
        Number(period.anio) === Number(data.anio)
    );

    if (duplicated) {
      errors.push(
        `Ya existe un periodo para ${getClientName(data.clienteId)} en ${periodLabel(data.mes, data.anio)}.`
      );
    }

    return errors;
  }

  function getFormData() {
    return {
      clienteId: document.getElementById("periodoCliente").value,
      mes: Number(document.getElementById("periodoMes").value),
      anio: Number(document.getElementById("periodoAnio").value),
      observacion: document
        .getElementById("periodoObservacion")
        .value.trim()
    };
  }

  function savePeriod(event) {
    event.preventDefault();

    const data = getFormData();
    const errors = validateForm(data);

    if (errors.length) {
      utils.showToast(errors[0], "danger");
      return;
    }

    const newPeriod = storage.create(
      "periods",
      {
        clienteId: data.clienteId,
        mes: data.mes,
        anio: data.anio,
        estado: "abierto",
        fechaApertura: utils.todayISO(),
        fechaCierre: null,
        observacion: data.observacion
      },
      "PER"
    );

    if (bitacora) {
      bitacora.log(
        "abrir_periodo",
        "periods",
        newPeriod.id,
        `Apertura de periodo ${periodLabel(newPeriod.mes, newPeriod.anio)} para ${getClientName(newPeriod.clienteId)}`
      );
    }

    utils.showToast("Periodo abierto correctamente.", "success");

    hideFormModal();
    renderTable();
  }

  function closePeriod(id) {
    const period = getPeriodById(id);

    if (!period) {
      utils.showToast("Periodo no encontrado.", "danger");
      return;
    }

    if (period.estado === "cerrado") {
      utils.showToast("Este periodo ya está cerrado.", "warning");
      return;
    }

    const pendingDocs = countPendingDocuments(id);
    const txWithoutDoc = countTransactionsWithoutDocument(id);

    let message = `¿Cerrar el periodo ${periodLabel(period.mes, period.anio)} de ${getClientName(period.clienteId)}?`;

    if (pendingDocs > 0 || txWithoutDoc > 0) {
      message += `\n\nAdvertencia operativa:\n- Documentos pendientes: ${pendingDocs}\n- Transacciones sin documento: ${txWithoutDoc}\n\n¿Desea cerrar de todos modos?`;
    }

    if (window.CC_CIERRE) {
      message += "\n\nSe generará asiento de cierre contable si hay cuentas temporales con movimiento.";
    }

    const ok = utils.confirmDialog(message);

    if (!ok) return;

    try {
      if (window.CC_CIERRE) {
        window.CC_CIERRE.closePeriod(period.clienteId, id);
        utils.showToast("Periodo cerrado contablemente.", "success");
      } else {
        storage.update("periods", id, {
          estado: "cerrado",
          fechaCierre: utils.todayISO()
        });

        if (bitacora) {
          bitacora.log(
            "cerrar_periodo",
            "periods",
            id,
            `Cierre simple de periodo ${periodLabel(period.mes, period.anio)} para ${getClientName(period.clienteId)}. Documentos pendientes: ${pendingDocs}. Transacciones sin documento: ${txWithoutDoc}.`
          );
        }

        utils.showToast("Periodo cerrado correctamente.", "success");
      }

      renderTable();
    } catch (error) {
      utils.showToast(error.message, "danger");
    }
  }

  function reopenPeriod(id) {
    const period = getPeriodById(id);

    if (!period) {
      utils.showToast("Periodo no encontrado.", "danger");
      return;
    }

    if (period.estado !== "cerrado") {
      utils.showToast("Solo se pueden reabrir periodos cerrados.", "warning");
      return;
    }

    const ok = utils.confirmDialog(
      `¿Reabrir el periodo ${periodLabel(period.mes, period.anio)} de ${getClientName(period.clienteId)}? Esta acción quedará registrada en bitácora.`
    );

    if (!ok) return;

    try {
      if (window.CC_CIERRE) {
        const result = window.CC_CIERRE.reopenPeriod(id);
        utils.showToast(`Periodo reabierto. Asientos de cierre anulados: ${result.voidedEntries}.`, "success");
      } else {
        storage.update("periods", id, {
          estado: "abierto",
          fechaCierre: null
        });

        if (bitacora) {
          bitacora.log(
            "reabrir_periodo",
            "periods",
            id,
            `Reapertura simple de periodo ${periodLabel(period.mes, period.anio)} para ${getClientName(period.clienteId)}`
          );
        }

        utils.showToast("Periodo reabierto correctamente.", "success");
      }

      renderTable();
    } catch (error) {
      utils.showToast(error.message, "danger");
    }
  }

  function viewPeriod(id) {
    const period = getPeriodById(id);

    if (!period) {
      utils.showToast("Periodo no encontrado.", "danger");
      return;
    }

    const client = getClientById(period.clienteId);
    const docs = countDocuments(period.id);
    const txs = countTransactions(period.id);
    const pendingDocs = countPendingDocuments(period.id);
    const txWithoutDoc = countTransactionsWithoutDocument(period.id);

    elements.detalleContenido.innerHTML = `
      <div class="row g-3">
        <div class="col-12">
          <h3 class="h5 fw-bold mb-1">
            ${utils.escapeHTML(periodLabel(period.mes, period.anio))}
          </h3>
          <p class="text-muted mb-0">
            ${utils.escapeHTML(period.id)} · ${utils.escapeHTML(client ? client.nombreComercial : "Cliente no encontrado")}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Cliente</p>
            <strong>${utils.escapeHTML(client ? client.nombreComercial : "-")}</strong>
            <small class="d-block text-muted">
              ${utils.escapeHTML(period.clienteId)}
            </small>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Estado</p>
            ${getStateBadge(period.estado)}
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Fecha de apertura</p>
            <strong>${utils.escapeHTML(utils.formatDate(period.fechaApertura))}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Fecha de cierre</p>
            <strong>${utils.escapeHTML(period.fechaCierre ? utils.formatDate(period.fechaCierre) : "Sin cerrar")}</strong>
          </div>
        </div>

        <div class="col-12">
          <div class="border rounded p-3">
            <p class="small text-muted mb-1">Observación</p>
            <p class="mb-0">${utils.escapeHTML(period.observacion || "Sin observaciones.")}</p>
          </div>
        </div>

        <div class="col-12">
          <div class="alert alert-info mb-0">
            <p class="fw-semibold mb-2">
              Resumen operativo
            </p>
            <ul class="mb-0 ps-3">
              <li>Documentos registrados: <strong>${docs}</strong></li>
              <li>Documentos pendientes: <strong>${pendingDocs}</strong></li>
              <li>Transacciones registradas: <strong>${txs}</strong></li>
              <li>Transacciones sin documento: <strong>${txWithoutDoc}</strong></li>
            </ul>
          </div>
        </div>
      </div>
    `;

    showDetalleModal();
  }

  function bindEvents() {
    elements.btnNuevoPeriodo?.addEventListener("click", openCreate);
    elements.periodoForm?.addEventListener("submit", savePeriod);

    elements.periodoFiltroCliente?.addEventListener("change", renderTable);
    elements.periodoFiltroEstado?.addEventListener("change", renderTable);
    elements.periodoFiltroMes?.addEventListener("change", renderTable);
    elements.periodoFiltroAnio?.addEventListener("input", renderTable);

    elements.btnLimpiarFiltros?.addEventListener("click", () => {
      if (elements.periodoFiltroCliente) elements.periodoFiltroCliente.value = "";
      if (elements.periodoFiltroEstado) elements.periodoFiltroEstado.value = "";
      if (elements.periodoFiltroMes) elements.periodoFiltroMes.value = "";
      if (elements.periodoFiltroAnio) elements.periodoFiltroAnio.value = "";
      renderTable();
    });

    elements.tablaPeriodos?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) return;

      const action = button.dataset.action;
      const id = button.dataset.id;

      if (action === "ver") viewPeriod(id);
      if (action === "cerrar") closePeriod(id);
      if (action === "reabrir") reopenPeriod(id);
    });
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    cacheElements();
    populateFilters();
    populateForm();
    bindEvents();
    renderTable();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    renderTable
  };
})();