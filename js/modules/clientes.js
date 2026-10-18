/* =========================================================
   Cuentas Claras MVP
   Módulo de clientes
   ========================================================= */

window.CC_CLIENTES = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const bitacora = window.CC_BITACORA;

  let editingId = null;

  const elements = {};

  function cacheElements() {
    elements.tablaClientes = document.getElementById("tablaClientes");
    elements.btnNuevoCliente = document.getElementById("btnNuevoCliente");
    elements.clienteBusqueda = document.getElementById("clienteBusqueda");
    elements.clienteFiltroRegimen = document.getElementById("clienteFiltroRegimen");
    elements.clienteFiltroTipo = document.getElementById("clienteFiltroTipo");
    elements.clienteFiltroEstado = document.getElementById("clienteFiltroEstado");
    elements.btnLimpiarFiltros = document.getElementById("btnLimpiarFiltrosClientes");

    elements.clienteModalEl = document.getElementById("clienteModal");
    elements.clienteForm = document.getElementById("clienteForm");
    elements.clienteModalLabel = document.getElementById("clienteModalLabel");

    elements.detalleModalEl = document.getElementById("clienteDetalleModal");
    elements.detalleContenido = document.getElementById("clienteDetalleContenido");
  }

  function getModalInstance(el) {
    return bootstrap.Modal.getOrCreateInstance(el);
  }

  function showFormModal() {
    getModalInstance(elements.clienteModalEl).show();
  }

  function hideFormModal() {
    const instance = bootstrap.Modal.getInstance(elements.clienteModalEl);
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

  function populateFilters() {
    populateSelect(
      elements.clienteFiltroRegimen,
      cfg.regimes.map((item) => ({ value: item, label: item })),
      "Todos"
    );

    populateSelect(
      elements.clienteFiltroTipo,
      cfg.businessTypes.map((item) => ({ value: item, label: item })),
      "Todos"
    );
  }

  function populateFormSelects() {
    populateSelect(
      document.getElementById("clienteRegimen"),
      cfg.regimes.map((item) => ({ value: item, label: item })),
      "Seleccione..."
    );

    populateSelect(
      document.getElementById("clienteTipoNegocio"),
      cfg.businessTypes.map((item) => ({ value: item, label: item })),
      "Seleccione..."
    );
  }

  function getStatusBadge(estado) {
    const safe = String(estado || "").toLowerCase();

    if (safe === "activo") {
      return '<span class="badge cc-status-activo">Activo</span>';
    }

    if (safe === "inactivo") {
      return '<span class="badge cc-status-inactivo">Inactivo</span>';
    }

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
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

  function countRelated(id) {
    const periods = storage
      .list("periods")
      .filter((item) => item.clienteId === id).length;

    const documents = storage
      .list("documents")
      .filter((item) => item.clienteId === id).length;

    const transactions = storage
      .list("transactions")
      .filter((item) => item.clienteId === id).length;

    return { periods, documents, transactions };
  }

  function applyFilters() {
    const search = String(elements.clienteBusqueda?.value || "")
      .trim()
      .toLowerCase();

    const regimen = elements.clienteFiltroRegimen?.value || "";
    const tipo = elements.clienteFiltroTipo?.value || "";
    const estado = elements.clienteFiltroEstado?.value || "";

    let data = getClients();

    if (regimen) {
      data = data.filter((item) => item.regimenTributario === regimen);
    }

    if (tipo) {
      data = data.filter((item) => item.tipoNegocio === tipo);
    }

    if (estado) {
      data = data.filter((item) => item.estado === estado);
    }

    if (search) {
      data = data.filter((item) => {
        const haystack = [
          item.id,
          item.nombreComercial,
          item.razonSocial,
          item.nit,
          item.telefono,
          item.whatsapp,
          item.direccion,
          item.regimenTributario,
          item.tipoNegocio,
          item.estado,
          item.observacion
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      });
    }

    data.sort((a, b) =>
      String(b.fechaAlta || "").localeCompare(String(a.fechaAlta || ""))
    );

    return data;
  }

  function renderTable() {
    if (!elements.tablaClientes) return;

    const data = applyFilters();

    if (!data.length) {
      elements.tablaClientes.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted py-4">
            No se encontraron clientes con los filtros aplicados.
          </td>
        </tr>
      `;
      return;
    }

    elements.tablaClientes.innerHTML = data
      .map((client) => {
        const estadoButton =
          client.estado === "activo"
            ? `<button
                  class="btn btn-outline-danger btn-sm"
                  type="button"
                  data-action="desactivar"
                  data-id="${utils.escapeHTML(client.id)}"
                  title="Desactivar cliente"
                >
                  <i class="bi bi-person-slash"></i>
                </button>`
            : `<button
                  class="btn btn-outline-success btn-sm"
                  type="button"
                  data-action="activar"
                  data-id="${utils.escapeHTML(client.id)}"
                  title="Activar cliente"
                >
                  <i class="bi bi-person-check"></i>
                </button>`;

        return `
          <tr>
            <td><code>${utils.escapeHTML(client.id)}</code></td>
            <td>
              <strong>${utils.escapeHTML(client.nombreComercial || "-")}</strong>
              <small class="d-block text-muted">
                ${utils.escapeHTML(client.razonSocial || "")}
              </small>
            </td>
            <td>${utils.escapeHTML(client.nit || "-")}</td>
            <td>${utils.escapeHTML(client.telefono || "-")}</td>
            <td>${utils.escapeHTML(client.regimenTributario || "-")}</td>
            <td>${utils.escapeHTML(client.tipoNegocio || "-")}</td>
            <td>${getStatusBadge(client.estado)}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm" role="group">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  data-action="ver"
                  data-id="${utils.escapeHTML(client.id)}"
                  title="Ver ficha"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  class="btn btn-outline-primary"
                  type="button"
                  data-action="editar"
                  data-id="${utils.escapeHTML(client.id)}"
                  title="Editar cliente"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                ${estadoButton}
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function resetForm() {
    if (!elements.clienteForm) return;

    elements.clienteForm.reset();
    editingId = null;

    if (elements.clienteModalLabel) {
      elements.clienteModalLabel.textContent = "Nuevo cliente";
    }

    document.getElementById("clienteEstado").value = "activo";
  }

  function openCreate() {
    resetForm();
    showFormModal();
  }

  function openEdit(id) {
    const client = getClientById(id);

    if (!client) {
      utils.showToast("Cliente no encontrado.", "danger");
      return;
    }

    editingId = id;

    if (elements.clienteModalLabel) {
      elements.clienteModalLabel.textContent = "Editar cliente";
    }

    document.getElementById("clienteNombreComercial").value =
      client.nombreComercial || "";
    document.getElementById("clienteRazonSocial").value =
      client.razonSocial || "";
    document.getElementById("clienteNit").value = client.nit || "";
    document.getElementById("clienteTelefono").value =
      client.telefono || "";
    document.getElementById("clienteWhatsapp").value =
      client.whatsapp || "";
    document.getElementById("clienteDireccion").value =
      client.direccion || "";
    document.getElementById("clienteRegimen").value =
      client.regimenTributario || "";
    document.getElementById("clienteTipoNegocio").value =
      client.tipoNegocio || "";
    document.getElementById("clienteEstado").value =
      client.estado || "activo";
    document.getElementById("clienteObservacion").value =
      client.observacion || "";

    showFormModal();
  }

  function validateForm(data) {
    const errors = [];

    if (!data.nombreComercial || data.nombreComercial.length < 3) {
      errors.push("El nombre comercial debe tener al menos 3 caracteres.");
    }

    if (!data.telefono) {
      errors.push("El teléfono es obligatorio.");
    } else if (!/^[\d+\-\s().]{7,20}$/.test(data.telefono)) {
      errors.push("El teléfono no tiene un formato válido.");
    }

    if (data.nit && !/^\d{7,12}$/.test(data.nit)) {
      errors.push("El NIT, si se registra, debe contener entre 7 y 12 dígitos.");
    }

    if (!data.regimenTributario) {
      errors.push("Seleccione un régimen tributario.");
    }

    if (!data.tipoNegocio) {
      errors.push("Seleccione un tipo de negocio.");
    }

    if (!data.estado) {
      errors.push("Seleccione un estado.");
    }

    if (data.nit) {
      const duplicated = getClients().some(
        (client) =>
          client.id !== editingId &&
          client.nit &&
          client.nit === data.nit
      );

      if (duplicated) {
        errors.push("Ya existe otro cliente con ese NIT.");
      }
    }

    return errors;
  }

  function getFormData() {
    return {
      nombreComercial: document
        .getElementById("clienteNombreComercial")
        .value.trim(),
      razonSocial: document
        .getElementById("clienteRazonSocial")
        .value.trim(),
      nit: document.getElementById("clienteNit").value.trim(),
      telefono: document.getElementById("clienteTelefono").value.trim(),
      whatsapp: document.getElementById("clienteWhatsapp").value.trim(),
      direccion: document.getElementById("clienteDireccion").value.trim(),
      regimenTributario: document.getElementById("clienteRegimen").value,
      tipoNegocio: document.getElementById("clienteTipoNegocio").value,
      estado: document.getElementById("clienteEstado").value,
      observacion: document
        .getElementById("clienteObservacion")
        .value.trim()
    };
  }

  function saveClient(event) {
    event.preventDefault();

    const data = getFormData();
    const errors = validateForm(data);

    if (errors.length) {
      utils.showToast(errors[0], "danger");
      return;
    }

    if (editingId) {
      storage.update("clients", editingId, data);

      if (bitacora) {
        bitacora.log(
          "editar_cliente",
          "clients",
          editingId,
          `Edición de cliente ${data.nombreComercial}`
        );
      }

      utils.showToast("Cliente actualizado correctamente.", "success");
    } else {
      const newClient = storage.create(
        "clients",
        {
          ...data,
          fechaAlta: utils.todayISO()
        },
        "CLI"
      );

      if (bitacora) {
        bitacora.log(
          "crear_cliente",
          "clients",
          newClient.id,
          `Alta de cliente ${newClient.nombreComercial}`
        );
      }

      utils.showToast("Cliente registrado correctamente.", "success");
    }

    hideFormModal();
    renderTable();
  }

  function toggleStatus(id, nextEstado) {
    const client = getClientById(id);

    if (!client) {
      utils.showToast("Cliente no encontrado.", "danger");
      return;
    }

    const actionLabel =
      nextEstado === "inactivo" ? "desactivar" : "activar";

    const ok = utils.confirmDialog(
      `¿Seguro que deseas ${actionLabel} al cliente ${client.nombreComercial}?`
    );

    if (!ok) return;

    storage.update("clients", id, { estado: nextEstado });

    if (bitacora) {
      bitacora.log(
        nextEstado === "inactivo"
          ? "desactivar_cliente"
          : "activar_cliente",
        "clients",
        id,
        `${actionLabel} de cliente ${client.nombreComercial}`
      );
    }

    utils.showToast(
      `Cliente ${nextEstado === "inactivo" ? "desactivado" : "activado"}.`,
      "success"
    );

    renderTable();
  }

  function viewClient(id) {
    const client = getClientById(id);

    if (!client) {
      utils.showToast("Cliente no encontrado.", "danger");
      return;
    }

    const related = countRelated(id);

    elements.detalleContenido.innerHTML = `
      <div class="row g-3">
        <div class="col-12">
          <h3 class="h5 fw-bold mb-1">
            ${utils.escapeHTML(client.nombreComercial)}
          </h3>
          <p class="text-muted mb-0">
            ${utils.escapeHTML(client.id)} · ${utils.escapeHTML(client.tipoNegocio)}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Razón social / propietario</p>
            <strong>${utils.escapeHTML(client.razonSocial || "-")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">NIT</p>
            <strong>${utils.escapeHTML(client.nit || "-")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Teléfono</p>
            <strong>${utils.escapeHTML(client.telefono || "-")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">WhatsApp</p>
            <strong>${utils.escapeHTML(client.whatsapp || "-")}</strong>
          </div>
        </div>

        <div class="col-12">
          <div class="border rounded p-3">
            <p class="small text-muted mb-1">Dirección</p>
            <strong>${utils.escapeHTML(client.direccion || "-")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Régimen tributario</p>
            <strong>${utils.escapeHTML(client.regimenTributario || "-")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Estado</p>
            ${getStatusBadge(client.estado)}
          </div>
        </div>

        <div class="col-12">
          <div class="border rounded p-3">
            <p class="small text-muted mb-1">Observación</p>
            <p class="mb-0">${utils.escapeHTML(client.observacion || "Sin observaciones.")}</p>
          </div>
        </div>

        <div class="col-12">
          <div class="alert alert-info mb-0">
            <p class="fw-semibold mb-2">
              Historial relacionado
            </p>
            <ul class="mb-0 ps-3">
              <li>Periodos registrados: <strong>${related.periods}</strong></li>
              <li>Documentos registrados: <strong>${related.documents}</strong></li>
              <li>Transacciones registradas: <strong>${related.transactions}</strong></li>
            </ul>
          </div>
        </div>
      </div>
    `;

    showDetalleModal();
  }

  function bindEvents() {
    elements.btnNuevoCliente?.addEventListener("click", openCreate);
    elements.clienteForm?.addEventListener("submit", saveClient);

    elements.clienteBusqueda?.addEventListener("input", renderTable);
    elements.clienteFiltroRegimen?.addEventListener("change", renderTable);
    elements.clienteFiltroTipo?.addEventListener("change", renderTable);
    elements.clienteFiltroEstado?.addEventListener("change", renderTable);

    elements.btnLimpiarFiltros?.addEventListener("click", () => {
      if (elements.clienteBusqueda) elements.clienteBusqueda.value = "";
      if (elements.clienteFiltroRegimen) elements.clienteFiltroRegimen.value = "";
      if (elements.clienteFiltroTipo) elements.clienteFiltroTipo.value = "";
      if (elements.clienteFiltroEstado) elements.clienteFiltroEstado.value = "";
      renderTable();
    });

    elements.tablaClientes?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) return;

      const action = button.dataset.action;
      const id = button.dataset.id;

      if (action === "editar") openEdit(id);
      if (action === "ver") viewClient(id);
      if (action === "desactivar") toggleStatus(id, "inactivo");
      if (action === "activar") toggleStatus(id, "activo");
    });
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    cacheElements();
    populateFilters();
    populateFormSelects();
    bindEvents();
    renderTable();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    renderTable
  };
})();