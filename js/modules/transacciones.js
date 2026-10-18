/* =========================================================
   Cuentas Claras MVP
   Módulo de transacciones contables
   ========================================================= */

window.CC_TRANSACCIONES = (function () {
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
    elements.tablaTransacciones = document.getElementById("tablaTransacciones");
    elements.btnNuevaTransaccion = document.getElementById("btnNuevaTransaccion");

    elements.trxBusqueda = document.getElementById("trxBusqueda");
    elements.trxFiltroCliente = document.getElementById("trxFiltroCliente");
    elements.trxFiltroPeriodo = document.getElementById("trxFiltroPeriodo");
    elements.trxFiltroTipo = document.getElementById("trxFiltroTipo");
    elements.trxFiltroEstado = document.getElementById("trxFiltroEstado");
    elements.btnLimpiarFiltros = document.getElementById("btnLimpiarFiltrosTransacciones");

    elements.resumenVentas = document.getElementById("resumenVentas");
    elements.resumenCompras = document.getElementById("resumenCompras");
    elements.resumenGastos = document.getElementById("resumenGastos");
    elements.resumenIngresos = document.getElementById("resumenIngresos");
    elements.resumenUtilidad = document.getElementById("resumenUtilidad");

    elements.transaccionModalEl = document.getElementById("transaccionModal");
    elements.transaccionForm = document.getElementById("transaccionForm");
    elements.transaccionModalLabel = document.getElementById("transaccionModalLabel");

    elements.trxCliente = document.getElementById("trxCliente");
    elements.trxPeriodo = document.getElementById("trxPeriodo");
    elements.trxDocumento = document.getElementById("trxDocumento");
    elements.trxFecha = document.getElementById("trxFecha");
    elements.trxTipo = document.getElementById("trxTipo");
    elements.trxCuenta = document.getElementById("trxCuenta");
    elements.trxMonto = document.getElementById("trxMonto");
    elements.trxTercero = document.getElementById("trxTercero");
    elements.trxFormaPago = document.getElementById("trxFormaPago");
    elements.trxEstado = document.getElementById("trxEstado");
    elements.trxObservacion = document.getElementById("trxObservacion");

    elements.detalleModalEl = document.getElementById("transaccionDetalleModal");
    elements.detalleContenido = document.getElementById("transaccionDetalleContenido");
  }

  function getModalInstance(el) {
    return bootstrap.Modal.getOrCreateInstance(el);
  }

  function showFormModal() {
    getModalInstance(elements.transaccionModalEl).show();
  }

  function hideFormModal() {
    const instance = bootstrap.Modal.getInstance(elements.transaccionModalEl);
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

  function getDocuments() {
    return storage.list("documents");
  }

  function getDocumentById(id) {
    return storage.get("documents", id);
  }

  function getTransactionTypes() {
    return cfg.transactionTypes.map((item) => ({
      value: item.value,
      label: item.label
    }));
  }

  function getTransactionStates() {
    return cfg.transactionStates.map((item) => ({
      value: item.value,
      label: item.label
    }));
  }

  function getPaymentMethods() {
    return cfg.paymentMethods.map((item) => ({
      value: item,
      label: item.charAt(0).toUpperCase() + item.slice(1)
    }));
  }

  function getAccounts() {
    return cfg.accountCatalog.map((account) => ({
      value: account.name,
      label: `${account.code} - ${account.name}`
    }));
  }

  function getTipoLabel(value) {
    const found = cfg.transactionTypes.find((item) => item.value === value);
    return found ? found.label : value || "-";
  }

  function getDocumentTipoLabel(value) {
    const found = cfg.documentTypes.find((item) => item.value === value);
    return found ? found.label : value || "-";
  }

  function getStateBadge(estado) {
    const safe = String(estado || "").toLowerCase();

    if (safe === "activa") {
      return '<span class="badge cc-status-activo">Activa</span>';
    }

    if (safe === "anulada") {
      return '<span class="badge cc-status-anulada">Anulada</span>';
    }

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function getTipoBadge(tipo) {
    const safe = String(tipo || "").toLowerCase();

    if (safe === "venta") {
      return '<span class="badge bg-success-subtle text-success">Venta</span>';
    }

    if (safe === "compra") {
      return '<span class="badge bg-danger-subtle text-danger">Compra</span>';
    }

    if (safe === "gasto") {
      return '<span class="badge bg-warning-subtle text-warning">Gasto</span>';
    }

    if (safe === "ingreso") {
      return '<span class="badge bg-info-subtle text-info">Ingreso</span>';
    }

    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function populateFilters() {
    populateSelect(
      elements.trxFiltroCliente,
      getClients().map((client) => ({
        value: client.id,
        label: `${client.nombreComercial} (${client.id})`
      })),
      "Todos"
    );

    populateSelect(
      elements.trxFiltroPeriodo,
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
      elements.trxFiltroTipo,
      getTransactionTypes(),
      "Todos"
    );

    populateSelect(
      elements.trxFiltroEstado,
      getTransactionStates(),
      "Todos"
    );
  }

  function populateFormStatic() {
    populateSelect(
      elements.trxTipo,
      getTransactionTypes(),
      "Seleccione..."
    );

    populateSelect(
      elements.trxCuenta,
      getAccounts(),
      "Seleccione..."
    );

    populateSelect(
      elements.trxFormaPago,
      getPaymentMethods(),
      "Seleccione..."
    );

    populateSelect(
      elements.trxEstado,
      getTransactionStates(),
      "Seleccione..."
    );
  }

  function populateFormClients() {
    populateSelect(
      elements.trxCliente,
      getActiveClients().map((client) => ({
        value: client.id,
        label: `${client.nombreComercial} (${client.id})`
      })),
      "Seleccione un cliente activo..."
    );
  }

  function loadFormPeriods(clientId, selectedPeriodId = null) {
    if (!elements.trxPeriodo) return;

    if (!clientId) {
      populateSelect(
        elements.trxPeriodo,
        [],
        "Seleccione primero un cliente..."
      );
      loadFormDocuments("", "");
      return;
    }

    const periods = getPeriods().filter(
      (period) =>
        period.clienteId === clientId &&
        period.estado !== "cerrado"
    );

    populateSelect(
      elements.trxPeriodo,
      periods.map((period) => ({
        value: period.id,
        label: periodLabel(period)
      })),
      "Seleccione..."
    );

    if (selectedPeriodId) {
      const exists = periods.some((period) => period.id === selectedPeriodId);
      if (exists) {
        elements.trxPeriodo.value = selectedPeriodId;
      }
    }

    loadFormDocuments(clientId, elements.trxPeriodo.value);
  }

  function loadFormDocuments(clientId, periodoId, selectedDocumentoId = null) {
    if (!elements.trxDocumento) return;

    if (!clientId || !periodoId) {
      populateSelect(
        elements.trxDocumento,
        [{ value: "", label: "Sin documento" }],
        null
      );
      elements.trxDocumento.value = "";
      return;
    }

    const documents = getDocuments().filter(
      (doc) =>
        doc.clienteId === clientId &&
        doc.periodoId === periodoId &&
        doc.estado !== "rechazado"
    );

    const options = documents.map((doc) => ({
      value: doc.id,
      label: `${doc.id} · ${getDocumentTipoLabel(doc.tipo)} · ${utils.formatMoney(doc.monto)}`
    }));

    populateSelect(
      elements.trxDocumento,
      options,
      "Sin documento"
    );

    if (selectedDocumentoId) {
      const exists = documents.some((doc) => doc.id === selectedDocumentoId);
      if (exists) {
        elements.trxDocumento.value = selectedDocumentoId;
      }
    }
  }

  function applyFilters() {
    const search = String(elements.trxBusqueda?.value || "")
      .trim()
      .toLowerCase();

    const clienteId = elements.trxFiltroCliente?.value || "";
    const periodoId = elements.trxFiltroPeriodo?.value || "";
    const tipo = elements.trxFiltroTipo?.value || "";
    const estado = elements.trxFiltroEstado?.value || "";

    let data = storage.list("transactions");

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
        const doc = item.documentoId ? getDocumentById(item.documentoId) : null;

        const haystack = [
          item.id,
          getClientName(item.clienteId),
          period ? periodLabel(period) : "",
          getTipoLabel(item.tipo),
          item.cuenta,
          item.tercero,
          item.formaPago,
          item.estado,
          item.observacion,
          doc ? doc.id : "",
          doc ? getDocumentTipoLabel(doc.tipo) : ""
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      });
    }

    data.sort((a, b) => {
      const dateA = String(a.fecha || "");
      const dateB = String(b.fecha || "");

      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }

      return String(b.id || "").localeCompare(String(a.id || ""));
    });

    return data;
  }

  function renderSummary(data) {
    const active = data.filter((item) => item.estado === "activa");

    const ventas = active
      .filter((item) => item.tipo === "venta")
      .reduce((total, item) => total + (Number(item.monto) || 0), 0);

    const compras = active
      .filter((item) => item.tipo === "compra")
      .reduce((total, item) => total + (Number(item.monto) || 0), 0);

    const gastos = active
      .filter((item) => item.tipo === "gasto")
      .reduce((total, item) => total + (Number(item.monto) || 0), 0);

    const ingresos = active
      .filter((item) => item.tipo === "ingreso")
      .reduce((total, item) => total + (Number(item.monto) || 0), 0);

    const utilidad = ventas + ingresos - compras - gastos;

    if (elements.resumenVentas) {
      elements.resumenVentas.textContent = utils.formatMoney(ventas);
    }

    if (elements.resumenCompras) {
      elements.resumenCompras.textContent = utils.formatMoney(compras);
    }

    if (elements.resumenGastos) {
      elements.resumenGastos.textContent = utils.formatMoney(gastos);
    }

    if (elements.resumenIngresos) {
      elements.resumenIngresos.textContent = utils.formatMoney(ingresos);
    }

    if (elements.resumenUtilidad) {
      elements.resumenUtilidad.textContent = utils.formatMoney(utilidad);
      elements.resumenUtilidad.className =
        "h3 mb-0 fw-bold " +
        (utilidad >= 0 ? "text-success" : "text-danger");
    }
  }

  function renderTable() {
    if (!elements.tablaTransacciones) return;

    const data = applyFilters();
    renderSummary(data);

    if (!data.length) {
      elements.tablaTransacciones.innerHTML = `
        <tr>
          <td colspan="11" class="text-center text-muted py-4">
            No se encontraron transacciones con los filtros aplicados.
          </td>
        </tr>
      `;
      return;
    }

    elements.tablaTransacciones.innerHTML = data
      .map((trx) => {
        const period = getPeriodById(trx.periodoId);
        const canModify =
          period &&
          period.estado !== "cerrado" &&
          trx.estado !== "anulada";

        const editButton = canModify
          ? `<button
                class="btn btn-outline-primary"
                type="button"
                data-action="editar"
                data-id="${utils.escapeHTML(trx.id)}"
                title="Editar transacción"
              >
                <i class="bi bi-pencil"></i>
              </button>`
          : `<button
                class="btn btn-outline-primary disabled"
                type="button"
                title="No editable"
              >
                <i class="bi bi-pencil"></i>
              </button>`;

        const voidButton = canModify
          ? `<button
                class="btn btn-outline-danger"
                type="button"
                data-action="anular"
                data-id="${utils.escapeHTML(trx.id)}"
                title="Anular transacción"
              >
                <i class="bi bi-x-octagon"></i>
              </button>`
          : "";

        return `
          <tr>
            <td><code>${utils.escapeHTML(trx.id)}</code></td>
            <td>
              <strong>${utils.escapeHTML(getClientName(trx.clienteId))}</strong>
              <small class="d-block text-muted">
                ${utils.escapeHTML(trx.clienteId)}
              </small>
            </td>
            <td>${utils.escapeHTML(period ? periodLabel(period) : "-")}</td>
            <td>${utils.escapeHTML(utils.formatDate(trx.fecha))}</td>
            <td>${getTipoBadge(trx.tipo)}</td>
            <td>${utils.escapeHTML(trx.cuenta || "-")}</td>
            <td>${utils.escapeHTML(utils.formatMoney(trx.monto))}</td>
            <td>${utils.escapeHTML(trx.tercero || "-")}</td>
            <td>
              ${
                trx.documentoId
                  ? `<code>${utils.escapeHTML(trx.documentoId)}</code>`
                  : "<span class='text-muted'>—</span>"
              }
            </td>
            <td>${getStateBadge(trx.estado)}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm" role="group">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  data-action="ver"
                  data-id="${utils.escapeHTML(trx.id)}"
                  title="Ver ficha"
                >
                  <i class="bi bi-eye"></i>
                </button>
                ${editButton}
                ${voidButton}
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function resetForm() {
    if (!elements.transaccionForm) return;

    elements.transaccionForm.reset();
    editingId = null;

    if (elements.transaccionModalLabel) {
      elements.transaccionModalLabel.textContent = "Nueva transacción";
    }

    populateFormClients();
    loadFormPeriods("");
    elements.trxFecha.value = utils.todayISO();
    elements.trxEstado.value = "activa";
  }

  function openCreate() {
    resetForm();
    showFormModal();
  }

  function openEdit(id) {
    const trx = storage.get("transactions", id);

    if (!trx) {
      utils.showToast("Transacción no encontrada.", "danger");
      return;
    }

    if (trx.estado === "anulada") {
      utils.showToast(
        "No se puede editar una transacción anulada. Debe registrarse una nueva corrección.",
        "warning"
      );
      return;
    }

    const period = getPeriodById(trx.periodoId);

    if (!period || period.estado === "cerrado") {
      utils.showToast(
        "No se puede editar una transacción cuyo periodo está cerrado.",
        "warning"
      );
      return;
    }

    editingId = id;

    if (elements.transaccionModalLabel) {
      elements.transaccionModalLabel.textContent = "Editar transacción";
    }

    populateFormClients();
    elements.trxCliente.value = trx.clienteId;
    loadFormPeriods(trx.clienteId, trx.periodoId);
    loadFormDocuments(trx.clienteId, trx.periodoId, trx.documentoId);

    elements.trxFecha.value = trx.fecha || "";
    elements.trxTipo.value = trx.tipo || "";
    elements.trxCuenta.value = trx.cuenta || "";
    elements.trxMonto.value = trx.monto ?? "";
    elements.trxTercero.value = trx.tercero || "";
    elements.trxFormaPago.value = trx.formaPago || "";
    elements.trxEstado.value = trx.estado || "activa";
    elements.trxObservacion.value = trx.observacion || "";

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

    if (!data.fecha) {
      errors.push("Ingrese la fecha de la transacción.");
    }

    if (!data.tipo) {
      errors.push("Seleccione un tipo de transacción.");
    }

    if (!data.cuenta) {
      errors.push("Seleccione una cuenta contable.");
    }

    if (!Number.isFinite(data.monto) || data.monto <= 0) {
      errors.push("El monto debe ser mayor que cero.");
    }

    if (!data.estado) {
      errors.push("Seleccione un estado.");
    }

    const period = getPeriodById(data.periodoId);

    if (!period) {
      errors.push("El periodo seleccionado no existe.");
    } else {
      if (period.clienteId !== data.clienteId) {
        errors.push("El periodo no pertenece al cliente seleccionado.");
      }

      if (period.estado === "cerrado") {
        errors.push("No se pueden registrar transacciones en un periodo cerrado.");
      }

      const date = utils.parseDateISO(data.fecha);

      if (Number.isNaN(date.getTime())) {
        errors.push("La fecha no es válida.");
      } else {
        const trxMonth = date.getMonth() + 1;
        const trxYear = date.getFullYear();

        if (trxMonth !== Number(period.mes) || trxYear !== Number(period.anio)) {
          errors.push(
            `La fecha de la transacción debe estar dentro del periodo ${periodLabel(period)}.`
          );
        }
      }
    }

    if (data.documentoId) {
      const doc = getDocumentById(data.documentoId);

      if (!doc) {
        errors.push("El documento vinculado no existe.");
      } else {
        if (doc.clienteId !== data.clienteId) {
          errors.push("El documento vinculado no pertenece al cliente seleccionado.");
        }

        if (doc.periodoId !== data.periodoId) {
          errors.push("El documento vinculado no pertenece al periodo seleccionado.");
        }

        if (doc.estado === "rechazado") {
          errors.push("No se puede vincular un documento rechazado.");
        }
      }
    }

    return errors;
  }

  function getFormData() {
    return {
      clienteId: elements.trxCliente.value,
      periodoId: elements.trxPeriodo.value,
      documentoId: elements.trxDocumento.value || null,
      fecha: elements.trxFecha.value,
      tipo: elements.trxTipo.value,
      cuenta: elements.trxCuenta.value,
      monto: Number(elements.trxMonto.value),
      tercero: elements.trxTercero.value.trim(),
      formaPago: elements.trxFormaPago.value,
      estado: elements.trxEstado.value,
      observacion: elements.trxObservacion.value.trim()
    };
  }

  function saveTransaction(event) {
    event.preventDefault();

    const data = getFormData();
    const errors = validateForm(data);

    if (errors.length) {
      utils.showToast(errors[0], "danger");
      return;
    }

    if (editingId) {
      const original = storage.get("transactions", editingId);

      if (!original) {
        utils.showToast("Transacción no encontrada.", "danger");
        return;
      }

      storage.update("transactions", editingId, data);

      const action =
        original.estado === "activa" && data.estado === "anulada"
          ? "anular_transaccion"
          : "editar_transaccion";

      if (bitacora) {
        bitacora.log(
          action,
          "transactions",
          editingId,
          `Transacción ${editingId} actualizada a estado ${data.estado}`
        );
      }

      utils.showToast("Transacción actualizada correctamente.", "success");
    } else {
      const newTx = storage.create(
        "transactions",
        data,
        "TRX"
      );

      if (bitacora) {
        bitacora.log(
          "crear_transaccion",
          "transactions",
          newTx.id,
          `Registro de ${newTx.tipo} por ${utils.formatMoney(newTx.monto)} para ${getClientName(newTx.clienteId)}`
        );
      }

      utils.showToast("Transacción registrada correctamente.", "success");
    }

    hideFormModal();
    renderTable();
  }

  function voidTransaction(id) {
    const trx = storage.get("transactions", id);

    if (!trx) {
      utils.showToast("Transacción no encontrada.", "danger");
      return;
    }

    if (trx.estado === "anulada") {
      utils.showToast("Esta transacción ya está anulada.", "warning");
      return;
    }

    const period = getPeriodById(trx.periodoId);

    if (!period || period.estado === "cerrado") {
      utils.showToast(
        "No se puede anular una transacción cuyo periodo está cerrado.",
        "warning"
      );
      return;
    }

    const ok = utils.confirmDialog(
      `¿Seguro que deseas anular la transacción ${trx.id}? No se elimina, queda registrada para trazabilidad.`
    );

    if (!ok) return;

    storage.update("transactions", id, { estado: "anulada" });

    if (bitacora) {
      bitacora.log(
        "anular_transaccion",
        "transactions",
        id,
        `Anulación de transacción ${id} de tipo ${trx.tipo}`
      );
    }

    utils.showToast("Transacción anulada correctamente.", "success");
    renderTable();
  }

  function viewTransaction(id) {
    const trx = storage.get("transactions", id);

    if (!trx) {
      utils.showToast("Transacción no encontrada.", "danger");
      return;
    }

    const period = getPeriodById(trx.periodoId);
    const client = getClientById(trx.clienteId);
    const doc = trx.documentoId ? getDocumentById(trx.documentoId) : null;

    elements.detalleContenido.innerHTML = `
      <div class="row g-3">
        <div class="col-12">
          <h3 class="h5 fw-bold mb-1">
            ${utils.escapeHTML(getTipoLabel(trx.tipo))}
          </h3>
          <p class="text-muted mb-0">
            ${utils.escapeHTML(trx.id)} · ${utils.escapeHTML(client ? client.nombreComercial : "Cliente no encontrado")}
          </p>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Cliente</p>
            <strong>${utils.escapeHTML(client ? client.nombreComercial : "-")}</strong>
            <small class="d-block text-muted">
              ${utils.escapeHTML(trx.clienteId)}
            </small>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Periodo</p>
            <strong>${utils.escapeHTML(period ? periodLabel(period) : "-")}</strong>
            <small class="d-block text-muted">
              ${utils.escapeHTML(trx.periodoId)}
            </small>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Fecha</p>
            <strong>${utils.escapeHTML(utils.formatDate(trx.fecha))}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Monto</p>
            <strong>${utils.escapeHTML(utils.formatMoney(trx.monto))}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Cuenta contable</p>
            <strong>${utils.escapeHTML(trx.cuenta || "-")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Tercero</p>
            <strong>${utils.escapeHTML(trx.tercero || "-")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Forma de pago</p>
            <strong>${utils.escapeHTML(trx.formaPago || "-")}</strong>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Estado</p>
            ${getStateBadge(trx.estado)}
          </div>
        </div>

        <div class="col-12">
          <div class="border rounded p-3">
            <p class="small text-muted mb-1">Documento vinculado</p>
            ${
              doc
                ? `
                  <strong>${utils.escapeHTML(doc.id)}</strong>
                  <small class="d-block text-muted">
                    ${utils.escapeHTML(getDocumentTipoLabel(doc.tipo))} ·
                    ${utils.escapeHTML(utils.formatMoney(doc.monto))} ·
                    estado: ${utils.escapeHTML(doc.estado)}
                  </small>
                `
                : "<span class='text-muted'>Sin documento vinculado</span>"
            }
          </div>
        </div>

        <div class="col-12">
          <div class="border rounded p-3">
            <p class="small text-muted mb-1">Observación</p>
            <p class="mb-0">${utils.escapeHTML(trx.observacion || "Sin observaciones.")}</p>
          </div>
        </div>
      </div>
    `;

    showDetalleModal();
  }

  function bindEvents() {
    elements.btnNuevaTransaccion?.addEventListener("click", openCreate);
    elements.transaccionForm?.addEventListener("submit", saveTransaction);

    elements.trxCliente?.addEventListener("change", () => {
      loadFormPeriods(elements.trxCliente.value);
    });

    elements.trxPeriodo?.addEventListener("change", () => {
      loadFormDocuments(
        elements.trxCliente.value,
        elements.trxPeriodo.value
      );
    });

    elements.trxTipo?.addEventListener("change", () => {
      const tipo = elements.trxTipo.value;

      if (tipo === "venta" && elements.trxCuenta) {
        elements.trxCuenta.value = "Ventas";
      }

      if (tipo === "compra" && elements.trxCuenta) {
        elements.trxCuenta.value = "Costo de ventas";
      }

      if (tipo === "gasto" && elements.trxCuenta) {
        elements.trxCuenta.value = "Otros gastos";
      }

      if (tipo === "ingreso" && elements.trxCuenta) {
        elements.trxCuenta.value = "Caja";
      }
    });

    elements.trxBusqueda?.addEventListener("input", renderTable);
    elements.trxFiltroCliente?.addEventListener("change", renderTable);
    elements.trxFiltroPeriodo?.addEventListener("change", renderTable);
    elements.trxFiltroTipo?.addEventListener("change", renderTable);
    elements.trxFiltroEstado?.addEventListener("change", renderTable);

    elements.btnLimpiarFiltros?.addEventListener("click", () => {
      if (elements.trxBusqueda) elements.trxBusqueda.value = "";
      if (elements.trxFiltroCliente) elements.trxFiltroCliente.value = "";
      if (elements.trxFiltroPeriodo) elements.trxFiltroPeriodo.value = "";
      if (elements.trxFiltroTipo) elements.trxFiltroTipo.value = "";
      if (elements.trxFiltroEstado) elements.trxFiltroEstado.value = "";
      renderTable();
    });

    elements.tablaTransacciones?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) return;

      const action = button.dataset.action;
      const id = button.dataset.id;

      if (action === "ver") viewTransaction(id);
      if (action === "editar") openEdit(id);
      if (action === "anular") voidTransaction(id);
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