/* =========================================================
   Cuentas Claras MVP
   Módulo de documentos
   ========================================================= */

window.CC_DOCUMENTOS = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const bitacora = window.CC_BITACORA;

  let editingId = null;

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
    elements.tablaDocumentos = document.getElementById("tablaDocumentos");
    elements.btnNuevoDocumento = document.getElementById("btnNuevoDocumento");

    elements.docBusqueda = document.getElementById("docBusqueda");
    elements.docFiltroCliente = document.getElementById("docFiltroCliente");
    elements.docFiltroPeriodo = document.getElementById("docFiltroPeriodo");
    elements.docFiltroTipo = document.getElementById("docFiltroTipo");
    elements.docFiltroEstado = document.getElementById("docFiltroEstado");
    elements.btnLimpiarFiltros = document.getElementById("btnLimpiarFiltrosDocumentos");

    elements.documentoModalEl = document.getElementById("documentoModal");
    elements.documentoForm = document.getElementById("documentoForm");
    elements.documentoModalLabel = document.getElementById("documentoModalLabel");

    elements.documentoCliente = document.getElementById("documentoCliente");
    elements.documentoPeriodo = document.getElementById("documentoPeriodo");
    elements.documentoTipo = document.getElementById("documentoTipo");
    elements.documentoFecha = document.getElementById("documentoFecha");
    elements.documentoMonto = document.getElementById("documentoMonto");
    elements.documentoTercero = document.getElementById("documentoTercero");
    elements.documentoEstado = document.getElementById("documentoEstado");
    elements.documentoArchivoNombre = document.getElementById("documentoArchivoNombre");
    elements.documentoObservacion = document.getElementById("documentoObservacion");

    elements.detalleModalEl = document.getElementById("documentoDetalleModal");
    elements.detalleContenido = document.getElementById("documentoDetalleContenido");
  }

  function getModalInstance(el) {
    return bootstrap.Modal.getOrCreateInstance(el);
  }

  function showFormModal() {
    getModalInstance(elements.documentoModalEl).show();
  }

  function hideFormModal() {
    const instance = bootstrap.Modal.getInstance(elements.documentoModalEl);
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

  function getDocumentTypes() {
    return cfg.documentTypes.map((item) => ({
      value: item.value,
      label: item.label
    }));
  }

  function getDocumentStates() {
    return cfg.documentStates.map((item) => ({
      value: item.value,
      label: item.label
    }));
  }

  function getTipoLabel(value) {
    const found = cfg.documentTypes.find((item) => item.value === value);
    return found ? found.label : value || "-";
  }

  function getStateBadge(estado) {
    const safe = String(estado || "").toLowerCase();

    if (safe === "pendiente") {
      return '<span class="badge cc-status-pendiente">Pendiente</span>';
    }

    if (safe === "recibido") {
      return '<span class="badge cc-status-recibido">Recibido</span>';
    }

    if (safe === "validado") {
      return '<span class="badge cc-status-validado">Validado</span>';
    }

    if (safe === "rechazado") {
      return '<span class="badge cc-status-rechazado">Rechazado</span>';
    }

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function populateFilters() {
    populateSelect(
      elements.docFiltroCliente,
      getClients().map((client) => ({
        value: client.id,
        label: `${client.nombreComercial} (${client.id})`
      })),
      "Todos"
    );

    populateSelect(
      elements.docFiltroPeriodo,
      getPeriods()
        .sort((a, b) => {
          if (Number(b.anio) !== Number(a.anio)) {
            return Number(b.anio) - Number(a.anio);
          }
          return Number(b.mes) - Number(a.mes);
        })
        .map((period) => ({
          value: period.id,
          label: getPeriodLabelByClientId(period.id)
        })),
      "Todos"
    );

    populateSelect(
      elements.docFiltroTipo,
      getDocumentTypes(),
      "Todos"
    );

    populateSelect(
      elements.docFiltroEstado,
      getDocumentStates(),
      "Todos"
    );
  }

  function populateFormStatic() {
    populateSelect(
      elements.documentoTipo,
      getDocumentTypes(),
      "Seleccione..."
    );

    populateSelect(
      elements.documentoEstado,
      getDocumentStates(),
      "Seleccione..."
    );
  }

  function populateFormClients() {
    populateSelect(
      elements.documentoCliente,
      getActiveClients().map((client) => ({
        value: client.id,
        label: `${client.nombreComercial} (${client.id})`
      })),
      "Seleccione un cliente activo..."
    );
  }

  function loadFormPeriods(clientId, selectedPeriodId = null) {
    if (!elements.documentoPeriodo) return;

    if (!clientId) {
      populateSelect(
        elements.documentoPeriodo,
        [],
        "Seleccione primero un cliente..."
      );
      return;
    }

    const periods = getPeriods().filter(
      (period) =>
        period.clienteId === clientId &&
        period.estado !== "cerrado"
    );

    populateSelect(
      elements.documentoPeriodo,
      periods.map((period) => ({
        value: period.id,
        label: periodLabel(period)
      })),
      "Seleccione..."
    );

    if (selectedPeriodId) {
      const exists = periods.some((period) => period.id === selectedPeriodId);
      if (exists) {
        elements.documentoPeriodo.value = selectedPeriodId;
      }
    }
  }

  function applyFilters() {
    const search = String(elements.docBusqueda?.value || "")
      .trim()
      .toLowerCase();

    const clienteId = elements.docFiltroCliente?.value || "";
    const periodoId = elements.docFiltroPeriodo?.value || "";
    const tipo = elements.docFiltroTipo?.value || "";
    const estado = elements.docFiltroEstado?.value || "";

    let data = storage.list("documents");

    if (clienteId) {
      data = data.filter((item) => item.clienteId === clienteId);
    }

    if (periodoId) {
      data = data.filter((item) => item.periodoId === periodoId);
    }

    if (tipo) {
      data = data.filter((item) => item.tipo === tipo);
    }

    if (estado) {
      data = data.filter((item) => item.estado === estado);
    }

    if (search) {
      data = data.filter((item) => {
        const period = getPeriodById(item.periodoId);
        const haystack = [
          item.id,
          getClientName(item.clienteId),
          period ? periodLabel(period) : "",
          getTipoLabel(item.tipo),
          item.tercero,
          item.estado,
          item.archivoNombre,
          item.observacion
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      });
    }

    data.sort((a, b) => {
      const dateA = String(a.fechaDocumento || "");
      const dateB = String(b.fechaDocumento || "");

      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }

      return String(b.id || "").localeCompare(String(a.id || ""));
    });

    return data;
  }

  function renderTable() {
    if (!elements.tablaDocumentos) return;

    const data = applyFilters();

    if (!data.length) {
      elements.tablaDocumentos.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted py-4">
            No se encontraron documentos con los filtros aplicados.
          </td>
        </tr>
      `;
      return;
    }

    elements.tablaDocumentos.innerHTML = data
      .map((doc) => {
        const period = getPeriodById(doc.periodoId);
        const canModify = period && period.estado !== "cerrado";

        const editButton = canModify
          ? `<button
                class="btn btn-outline-primary"
                type="button"
                data-action="editar"
                data-id="${utils.escapeHTML(doc.id)}"
                title="Editar documento"
              >
                <i class="bi bi-pencil"></i>
              </button>`
          : `<button
                class="btn btn-outline-primary disabled"
                type="button"
                title="Periodo cerrado"
              >
                <i class="bi bi-pencil"></i>
              </button>`;

        const validateButton =
          canModify && doc.estado !== "validado"
            ? `<button
                  class="btn btn-outline-success"
                  type="button"
                  data-action="validar"
                  data-id="${utils.escapeHTML(doc.id)}"
                  title="Validar documento"
                >
                  <i class="bi bi-check2-circle"></i>
                </button>`
            : "";

        const rejectButton =
          canModify && doc.estado !== "rechazado"
            ? `<button
                  class="btn btn-outline-danger"
                  type="button"
                  data-action="rechazar"
                  data-id="${utils.escapeHTML(doc.id)}"
                  title="Rechazar documento"
                >
                  <i class="bi bi-x-circle"></i>
                </button>`
            : "";

        return `
          <tr>
            <td><code>${utils.escapeHTML(doc.id)}</code></td>
            <td>
              <strong>${utils.escapeHTML(getClientName(doc.clienteId))}</strong>
              <small class="d-block text-muted">
                ${utils.escapeHTML(doc.clienteId)}
              </small>
            </td>
            <td>${utils.escapeHTML(period ? periodLabel(period) : "-")}</td>
            <td>${utils.escapeHTML(getTipoLabel(doc.tipo))}</td>
            <td>${utils.escapeHTML(utils.formatDate(doc.fechaDocumento))}</td>
            <td>${utils.escapeHTML(utils.formatMoney(doc.monto))}</td>
            <td>${utils.escapeHTML(doc.tercero || "-")}</td>
            <td>${getStateBadge(doc.estado)}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm" role="group">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  data-action="ver"
                  data-id="${utils.escapeHTML(doc.id)}"
                  title="Ver ficha"
                >
                  <i class="bi bi-eye"></i>
                </button>
                ${editButton}
                ${validateButton}
                ${rejectButton}
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function resetForm() {
    if (!elements.documentoForm) return;

    elements.documentoForm.reset();
    editingId = null;

    if (elements.documentoModalLabel) {
      elements.documentoModalLabel.textContent = "Nuevo documento";
    }

    populateFormClients();
    loadFormPeriods("");
    elements.documentoEstado.value = "pendiente";
    elements.documentoFecha.value = utils.todayISO();
  }

  function openCreate() {
    resetForm();
    showFormModal();
  }

  function openEdit(id) {
    const doc = storage.get("documents", id);

    if (!doc) {
      utils.showToast("Documento no encontrado.", "danger");
      return;
    }

    const period = getPeriodById(doc.periodoId);

    if (!period || period.estado === "cerrado") {
      utils.showToast(
        "No se puede editar un documento cuyo periodo está cerrado.",
        "warning"
      );
      return;
    }

    editingId = id;

    if (elements.documentoModalLabel) {
      elements.documentoModalLabel.textContent = "Editar documento";
    }

    populateFormClients();
    elements.documentoCliente.value = doc.clienteId;
    loadFormPeriods(doc.clienteId, doc.periodoId);

    elements.documentoTipo.value = doc.tipo || "";
    elements.documentoFecha.value = doc.fechaDocumento || "";
    elements.documentoMonto.value = doc.monto ?? "";
    elements.documentoTercero.value = doc.tercero || "";
    elements.documentoEstado.value = doc.estado || "pendiente";
    elements.documentoArchivoNombre.value = doc.archivoNombre || "";
    elements.documentoObservacion.value = doc.observacion || "";

    showFormModal();
  }

  function validateForm(data) {
    const errors = [];

    if (!data.clienteId) {
      errors.push("Seleccione un cliente.");
    }

    if (!data.periodoId) {
      errors.push("Seleccione un periodo.");
    }

    if (!data.tipo) {
      errors.push("Seleccione un tipo de documento.");
    }

    if (!data.fechaDocumento) {
      errors.push("Ingrese la fecha del documento.");
    }

    if (!Number.isFinite(data.monto) || data.monto <= 0) {
      errors.push("El monto debe ser mayor que cero.");
    }

    if (!data.estado) {
      errors.push("Seleccione un estado del documento.");
    }

    const period = getPeriodById(data.periodoId);

    if (!period) {
      errors.push("El periodo seleccionado no existe.");
    } else {
      if (period.clienteId !== data.clienteId) {
        errors.push("El periodo no pertenece al cliente seleccionado.");
      }

      if (period.estado === "cerrado") {
        errors.push("No se pueden registrar documentos en un periodo cerrado.");
      }

      const date = utils.parseDateISO(data.fechaDocumento);

      if (Number.isNaN(date.getTime())) {
        errors.push("La fecha del documento no es válida.");
      } else {
        const docMonth = date.getMonth() + 1;
        const docYear = date.getFullYear();

        if (docMonth !== Number(period.mes) || docYear !== Number(period.anio)) {
          errors.push(
            `La fecha del documento debe estar dentro del periodo ${periodLabel(period)}.`
          );
        }
      }
    }

    return errors;
  }

  function getFormData() {
    return {
      clienteId: elements.documentoCliente.value,
      periodoId: elements.documentoPeriodo.value,
      tipo: elements.documentoTipo.value,
      fechaDocumento: elements.documentoFecha.value,
      monto: Number(elements.documentoMonto.value),
      tercero: elements.documentoTercero.value.trim(),
      estado: elements.documentoEstado.value,
      archivoNombre: elements.documentoArchivoNombre.value.trim(),
      observacion: elements.documentoObservacion.value.trim()
    };
  }

  function saveDocument(event) {
    event.preventDefault();

    const data = getFormData();
    const errors = validateForm(data);

    if (errors.length) {
      utils.showToast(errors[0], "danger");
      return;
    }

    if (editingId) {
      storage.update("documents", editingId, data);

      if (bitacora) {
        bitacora.log(
          "editar_documento",
          "documents",
          editingId,
          `Edición de documento ${editingId} para ${getClientName(data.clienteId)}`
        );
      }

      utils.showToast("Documento actualizado correctamente.", "success");
    } else {
      const newDoc = storage.create(
        "documents",
        data,
        "DOC"
      );

      if (bitacora) {
        bitacora.log(
          "crear_documento",
          "documents",
          newDoc.id,
          `Registro de documento ${newDoc.tipo} por ${utils.formatMoney(newDoc.monto)} para ${getClientName(newDoc.clienteId)}`
        );
      }

      utils.showToast("Documento registrado correctamente.", "success");
    }

    hideFormModal();
    renderTable();
  }

  function changeState(id, nuevoEstado) {
    const doc = storage.get("documents", id);

    if (!doc) {
      utils.showToast("Documento no encontrado.", "danger");
      return;
    }

    const period = getPeriodById(doc.periodoId);

    if (!period || period.estado === "cerrado") {
      utils.showToast(
        "No se puede modificar un documento cuyo periodo está cerrado.",
        "warning"
      );
      return;
    }

    const actionLabel =
      nuevoEstado === "validado"
        ? "validar"
        : nuevoEstado === "rechazado"
        ? "rechazar"
        : "cambiar estado";

    const ok = utils.confirmDialog(
      `¿Seguro que deseas ${actionLabel} el documento ${doc.id}?`
    );

    if (!ok) return;

    storage.update("documents", id, { estado: nuevoEstado });

    if (bitacora) {
      bitacora.log(
        `documento_${nuevoEstado}`,
        "documents",
        id,
        `Documento ${id} marcado como ${nuevoEstado}`
      );
    }

    utils.showToast(
      `Documento marcado como ${nuevoEstado}.`,
      "success"
    );

    renderTable();
  }

  function countLinkedTransactions(documentId) {
    return storage
      .list("transactions")
      .filter((item) => item.documentoId === documentId).length;
  }

  function viewDocument(id) {
    const doc = storage.get("documents", id);

    if (!doc) {
      utils.showToast("Documento no encontrado.", "danger");
      return;
    }

    const period = getPeriodById(doc.periodoId);
    const client = getClientById(doc.clienteId);
    const linkedTx = countLinkedTransactions(doc.id);

    elements.detalleContenido.innerHTML = `
      <div class="row g-3">
        <div class="col-12">
          <h3 class="h5 fw-bold mb-1">
            ${utils.escapeHTML(getTipoLabel(doc.tipo))}
          </h3>
          <p class="text-muted mb-0">
            ${utils.escapeHTML(doc.id)} · ${utils.escapeHTML(client ? client.nombreComercial : "Cliente no encontrado")}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Cliente</p>
            <strong>${utils.escapeHTML(client ? client.nombreComercial : "-")}</strong>
            <small class="d-block text-muted">
              ${utils.escapeHTML(doc.clienteId)}
            </small>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Periodo</p>
            <strong>${utils.escapeHTML(period ? periodLabel(period) : "-")}</strong>
            <small class="d-block text-muted">
              ${utils.escapeHTML(doc.periodoId)}
            </small>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Fecha del documento</p>
            <strong>${utils.escapeHTML(utils.formatDate(doc.fechaDocumento))}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Monto</p>
            <strong>${utils.escapeHTML(utils.formatMoney(doc.monto))}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Tercero</p>
            <strong>${utils.escapeHTML(doc.tercero || "-")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Estado</p>
            ${getStateBadge(doc.estado)}
          </div>
        </div>

        <div class="col-12">
          <div class="border rounded p-3">
            <p class="small text-muted mb-1">Referencia de archivo</p>
            <strong>${utils.escapeHTML(doc.archivoNombre || "Sin referencia")}</strong>
          </div>
        </div>

        <div class="col-12">
          <div class="border rounded p-3">
            <p class="small text-muted mb-1">Observación</p>
            <p class="mb-0">${utils.escapeHTML(doc.observacion || "Sin observaciones.")}</p>
          </div>
        </div>

        <div class="col-12">
          <div class="alert alert-info mb-0">
            <p class="fw-semibold mb-2">
              Vínculo contable
            </p>
            <p class="mb-0">
              Transacciones vinculadas a este documento: <strong>${linkedTx}</strong>
            </p>
          </div>
        </div>
      </div>
    `;

    showDetalleModal();
  }

  function bindEvents() {
    elements.btnNuevoDocumento?.addEventListener("click", openCreate);
    elements.documentoForm?.addEventListener("submit", saveDocument);

    elements.documentoCliente?.addEventListener("change", () => {
      loadFormPeriods(elements.documentoCliente.value);
    });

    elements.docBusqueda?.addEventListener("input", renderTable);
    elements.docFiltroCliente?.addEventListener("change", renderTable);
    elements.docFiltroPeriodo?.addEventListener("change", renderTable);
    elements.docFiltroTipo?.addEventListener("change", renderTable);
    elements.docFiltroEstado?.addEventListener("change", renderTable);

    elements.btnLimpiarFiltros?.addEventListener("click", () => {
      if (elements.docBusqueda) elements.docBusqueda.value = "";
      if (elements.docFiltroCliente) elements.docFiltroCliente.value = "";
      if (elements.docFiltroPeriodo) elements.docFiltroPeriodo.value = "";
      if (elements.docFiltroTipo) elements.docFiltroTipo.value = "";
      if (elements.docFiltroEstado) elements.docFiltroEstado.value = "";
      renderTable();
    });

    elements.tablaDocumentos?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) return;

      const action = button.dataset.action;
      const id = button.dataset.id;

      if (action === "ver") viewDocument(id);
      if (action === "editar") openEdit(id);
      if (action === "validar") changeState(id, "validado");
      if (action === "rechazar") changeState(id, "rechazado");
    });
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    cacheElements();
    populateFilters();
    populateFormStatic();
    populateFormClients();
    bindEvents();
    renderTable();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    renderTable
  };
})();