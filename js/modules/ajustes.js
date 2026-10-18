/* =========================================================
   Cuentas Claras MVP
   Módulo de ajustes contables
   Fase 7
   ========================================================= */

window.CC_AJUSTES = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const contabilidad = window.CC_CONTABILIDAD;
  const motor = window.CC_MAYOR_BALANZA;
  const bitacora = window.CC_BITACORA;

  const elements = {};
  let currentClientId = "";
  let currentPeriodId = "";
  let currentPeriod = null;

  function cacheElements() {
    elements.ajusteFiltroCliente = document.getElementById("ajusteFiltroCliente");
    elements.ajusteFiltroPeriodo = document.getElementById("ajusteFiltroPeriodo");
    elements.btnRefrescarAjustes = document.getElementById("btnRefrescarAjustes");
    elements.ajusteAlerta = document.getElementById("ajusteAlerta");

    elements.btnDepreciarTodos = document.getElementById("btnDepreciarTodos");
    elements.tablaActivosFijos = document.getElementById("tablaActivosFijos");

    elements.ajusteRapidoForm = document.getElementById("ajusteRapidoForm");
    elements.ajusteRapidoFecha = document.getElementById("ajusteRapidoFecha");
    elements.ajusteRapidoCategoria = document.getElementById("ajusteRapidoCategoria");
    elements.ajusteRapidoDescripcion = document.getElementById("ajusteRapidoDescripcion");
    elements.ajusteRapidoCuentaDebito = document.getElementById("ajusteRapidoCuentaDebito");
    elements.ajusteRapidoCuentaCredito = document.getElementById("ajusteRapidoCuentaCredito");
    elements.ajusteRapidoMonto = document.getElementById("ajusteRapidoMonto");
    elements.ajusteRapidoTercero = document.getElementById("ajusteRapidoTercero");
    elements.ajusteRapidoObservacion = document.getElementById("ajusteRapidoObservacion");

    elements.tablaAjustes = document.getElementById("tablaAjustes");
    elements.btnImprimirAjustes = document.getElementById("btnImprimirAjustes");

    elements.detalleModalEl = document.getElementById("ajusteDetalleModal");
    elements.detalleContenido = document.getElementById("ajusteDetalleContenido");
  }

  function round2(value) {
    return contabilidad && contabilidad.round2
      ? contabilidad.round2(value)
      : Math.round((Number(value) || 0) * 100) / 100;
  }

  function setAlert(message, type = "warning") {
    if (!elements.ajusteAlerta) return;
    if (!message) {
      elements.ajusteAlerta.classList.add("d-none");
      elements.ajusteAlerta.textContent = "";
      return;
    }
    elements.ajusteAlerta.className = `alert alert-${type} mt-3 mb-0 small`;
    elements.ajusteAlerta.textContent = message;
    elements.ajusteAlerta.classList.remove("d-none");
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

  function ensureAccounts() {
    if (motor && motor.ensureAccounts) {
      motor.ensureAccounts();
      return;
    }

    const accounts = storage.list("accounts");
    if (accounts.length > 0) return;

    (cfg.accountCatalog || []).forEach((account) => {
      storage.create("accounts", { ...account }, "ACC");
    });
  }

  function getClientName(id) {
    const c = storage.get("clients", id);
    return c ? c.nombreComercial : "Cliente no encontrado";
  }

  function getPeriodsForClient(clientId) {
    return storage
      .list("periods")
      .filter((p) => p.clienteId === clientId)
      .sort((a, b) => {
        if (Number(b.anio) !== Number(a.anio)) return Number(b.anio) - Number(a.anio);
        return Number(b.mes) - Number(a.mes);
      });
  }

  function periodLabel(period) {
    if (!period) return "-";
    const name = motor && motor.periodLabel ? motor.periodLabel(period) : `${period.mes}/${period.anio}`;
    return name;
  }

  function periodEndISO(mes, anio) {
    const d = new Date(Number(anio), Number(mes), 0);
    return `${d.getFullYear()}-${utils.pad2(d.getMonth() + 1)}-${utils.pad2(d.getDate())}`;
  }

  function periodStartISO(mes, anio) {
    return `${Number(anio)}-${utils.pad2(Number(mes))}-01`;
  }

  function isDateInPeriod(dateISO, period) {
    if (!dateISO || !period) return false;
    const start = periodStartISO(period.mes, period.anio);
    const end = periodEndISO(period.mes, period.anio);
    return dateISO >= start && dateISO <= end;
  }

  function loadClients() {
    const clients = storage
      .list("clients")
      .sort((a, b) => String(a.nombreComercial || "").localeCompare(String(b.nombreComercial || "")));

    populateSelect(
      elements.ajusteFiltroCliente,
      clients.map((c) => ({ value: c.id, label: `${c.nombreComercial} (${c.id})` })),
      "Seleccione un cliente..."
    );
  }

  function loadPeriods(clientId) {
    if (!clientId) {
      populateSelect(elements.ajusteFiltroPeriodo, [], "Seleccione primero un cliente...");
      currentPeriod = null;
      return;
    }

    const periods = getPeriodsForClient(clientId);
    populateSelect(
      elements.ajusteFiltroPeriodo,
      periods.map((p) => ({ value: p.id, label: periodLabel(p) })),
      "Seleccione..."
    );

    currentPeriod = periods[0] || null;
    if (currentPeriod) {
      elements.ajusteFiltroPeriodo.value = currentPeriod.id;
    }
  }

  function autoSelectDefault() {
    const clients = storage.list("clients").filter((c) => getPeriodsForClient(c.id).length > 0);
    if (!clients.length) {
      setAlert("No hay clientes con periodos contables.", "warning");
      return;
    }

    const first = clients[0];
    elements.ajusteFiltroCliente.value = first.id;
    loadPeriods(first.id);
    currentClientId = first.id;
    currentPeriodId = elements.ajusteFiltroPeriodo.value || "";
    currentPeriod = storage.get("periods", currentPeriodId);
  }

  function getAccountOptions() {
    ensureAccounts();
    return storage
      .list("accounts")
      .filter((a) => Number(a.nivel) === 3 && a.estado === "activa")
      .sort((a, b) => String(a.codigo || "").localeCompare(String(b.codigo || "")));
  }

  function populateFormStatic() {
    const categories = (cfg.adjustmentCategories || []).filter((c) => c.value !== "depreciacion");
    populateSelect(
      elements.ajusteRapidoCategoria,
      categories.map((c) => ({ value: c.value, label: c.label })),
      "Seleccione..."
    );

    const accounts = getAccountOptions();
    const accountOptions = accounts.map((a) => ({
      value: a.codigo,
      label: `${a.codigo} - ${a.nombre}`
    }));

    populateSelect(elements.ajusteRapidoCuentaDebito, accountOptions, "Seleccione cuenta débito...");
    populateSelect(elements.ajusteRapidoCuentaCredito, accountOptions, "Seleccione cuenta crédito...");
  }

  function updateDefaultFecha() {
    if (!currentPeriod) return;
    elements.ajusteRapidoFecha.value = periodEndISO(currentPeriod.mes, currentPeriod.anio);
  }

  function getFixedAssetsForClient(clientId) {
    return storage
      .list("fixedAssets")
      .filter((fa) => fa.clienteId === clientId)
      .sort((a, b) => String(a.id || "").localeCompare(String(b.id || "")));
  }

  function depreciationAmount(asset) {
    const costo = Number(asset.costoAdquisicion) || 0;
    const residual = Number(asset.valorResidual) || 0;
    const vida = Number(asset.vidaUtilMeses) || 0;
    const acumulada = Number(asset.depreciacionAcumulada) || 0;

    const depreciable = Math.max(costo - residual, 0);
    const pendiente = Math.max(round2(depreciable - acumulada), 0);

    if (vida <= 0 || pendiente <= 0) return 0;

    const mensual = round2(depreciable / vida);
    return Math.min(mensual, pendiente);
  }

  function isDepreciationRegistered(clientId, periodoId, assetId) {
    const entries = storage.list("journalEntries");
    return entries.some(
      (e) =>
        e.clienteId === clientId &&
        e.periodoId === periodoId &&
        e.tipoAsiento === "ajuste" &&
        e.categoriaAjuste === "depreciacion" &&
        e.estado === "vigente" &&
        String(e.observacion || "").includes(assetId)
    );
  }

  function canDepreciate(asset, period) {
    if (!period || period.estado === "cerrado") return false;
    if (asset.estado !== "activo") return false;

    const end = periodEndISO(period.mes, period.anio);
    if (String(asset.fechaAdquisicion || "") > end) return false;

    const amount = depreciationAmount(asset);
    if (amount <= 0) return false;

    if (isDepreciationRegistered(asset.clienteId, period.id, asset.id)) return false;

    return true;
  }

  function renderFixedAssets() {
    if (!elements.tablaActivosFijos) return;

    if (!currentClientId || !currentPeriod) {
      elements.tablaActivosFijos.innerHTML = `
        <tr><td colspan="10" class="text-center text-muted py-4">Seleccione cliente y periodo.</td></tr>`;
      return;
    }

    const assets = getFixedAssetsForClient(currentClientId);

    if (!assets.length) {
      elements.tablaActivosFijos.innerHTML = `
        <tr><td colspan="10" class="text-center text-muted py-4">
          Este cliente no tiene activos fijos registrados en la semilla.
        </td></tr>`;
      return;
    }

    elements.tablaActivosFijos.innerHTML = assets
      .map((asset) => {
        const costo = Number(asset.costoAdquisicion) || 0;
        const residual = Number(asset.valorResidual) || 0;
        const vida = Number(asset.vidaUtilMeses) || 0;
        const acumulada = Number(asset.depreciacionAcumulada) || 0;
        const depreciable = Math.max(costo - residual, 0);
        const pendiente = Math.max(round2(depreciable - acumulada), 0);
        const mensual = depreciationAmount(asset);
        const registered = isDepreciationRegistered(asset.clienteId, currentPeriod.id, asset.id);
        const eligible = canDepreciate(asset, currentPeriod);

        let action = "";
        if (registered) {
          action = `<span class="badge cc-status-activo">Depreciado en el periodo</span>`;
        } else if (!eligible) {
          action = `<span class="badge bg-secondary">No aplica</span>`;
        } else {
          action = `
            <button
              class="btn btn-outline-primary btn-sm"
              type="button"
              data-action="depreciar"
              data-id="${utils.escapeHTML(asset.id)}"
            >
              <i class="bi bi-calculator me-1"></i>Depreciar
            </button>`;
        }

        return `
          <tr>
            <td><code>${utils.escapeHTML(asset.id)}</code></td>
            <td>
              <strong>${utils.escapeHTML(asset.descripcion || "-")}</strong>
              <small class="d-block text-muted">${utils.escapeHTML(asset.categoria || "-")}</small>
            </td>
            <td class="text-end">${utils.escapeHTML(utils.formatMoney(costo))}</td>
            <td class="text-end">${utils.escapeHTML(utils.formatMoney(residual))}</td>
            <td class="text-end">${vida} meses</td>
            <td class="text-end">${utils.escapeHTML(utils.formatMoney(mensual))}</td>
            <td class="text-end">${utils.escapeHTML(utils.formatMoney(acumulada))}</td>
            <td class="text-end">${utils.escapeHTML(utils.formatMoney(pendiente))}</td>
            <td><span class="badge ${asset.estado === "activo" ? "cc-status-activo" : "cc-status-inactivo"}">${utils.escapeHTML(asset.estado || "-")}</span></td>
            <td class="text-end">${action}</td>
          </tr>`;
      })
      .join("");
  }

  function createDepreciationEntry(asset) {
    if (!currentPeriod) throw new Error("Seleccione un periodo.");
    if (currentPeriod.estado === "cerrado") throw new Error("No se pueden registrar ajustes en un periodo cerrado.");

    const amount = depreciationAmount(asset);
    if (amount <= 0) throw new Error("Este activo no tiene depreciación pendiente.");

    if (isDepreciationRegistered(asset.clienteId, currentPeriod.id, asset.id)) {
      throw new Error("Este activo ya fue depreciado en el periodo seleccionado.");
    }

    const fecha = periodEndISO(currentPeriod.mes, currentPeriod.anio);

    const entry = contabilidad.createManualEntry({
      clienteId: asset.clienteId,
      periodoId: currentPeriod.id,
      fecha,
      tipoAsiento: "ajuste",
      categoriaAjuste: "depreciacion",
      documentoId: null,
      descripcion: `Depreciación mensual · ${asset.descripcion || asset.id}`,
      observacion: asset.id,
      lines: [
        {
          cuentaCodigo: asset.cuentaGastoDepreciacion || "6.1.04",
          debito: amount,
          credito: 0,
          tercero: "Depreciación del periodo",
          referencia: asset.id,
          observacion: `Depreciación lineal simple de ${asset.descripcion || asset.id}`
        },
        {
          cuentaCodigo: asset.cuentaDepreciacion || "1.2.02",
          debito: 0,
          credito: amount,
          tercero: "Depreciación acumulada",
          referencia: asset.id,
          observacion: `Depreciación acumulada de ${asset.descripcion || asset.id}`
        }
      ]
    });

    const currentAccumulated = Number(asset.depreciacionAcumulada) || 0;
    storage.update("fixedAssets", asset.id, {
      depreciacionAcumulada: round2(currentAccumulated + amount)
    });

    if (bitacora) {
      bitacora.log(
        "depreciar_activo",
        "fixed_assets",
        asset.id,
        `Depreciación de ${asset.descripcion || asset.id} por ${utils.formatMoney(amount)} en ${periodLabel(currentPeriod)}`
      );
    }

    return entry;
  }

  function depreciateOne(assetId) {
    const asset = storage.get("fixedAssets", assetId);
    if (!asset) {
      utils.showToast("Activo no encontrado.", "danger");
      return;
    }

    try {
      createDepreciationEntry(asset);
      utils.showToast("Depreciación registrada correctamente.", "success");
      renderAll();
    } catch (error) {
      utils.showToast(error.message, "danger");
    }
  }

  function depreciateAll() {
    if (!currentClientId || !currentPeriod) {
      utils.showToast("Seleccione un cliente y un periodo.", "warning");
      return;
    }

    const assets = getFixedAssetsForClient(currentClientId).filter((asset) =>
      canDepreciate(asset, currentPeriod)
    );

    if (!assets.length) {
      utils.showToast("No hay activos pendientes de depreciación para este periodo.", "info");
      return;
    }

    let created = 0;
    const errors = [];

    assets.forEach((asset) => {
      try {
        createDepreciationEntry(asset);
        created += 1;
      } catch (error) {
        errors.push(`${asset.id}: ${error.message}`);
      }
    });

    if (errors.length) {
      setAlert(`Se depreciaron ${created} activos. Errores: ${errors.slice(0, 3).join(" | ")}`, "warning");
    } else {
      setAlert(`Se depreciaron ${created} activos correctamente en ${periodLabel(currentPeriod)}.`, "success");
    }

    utils.showToast(created > 0 ? "Depreciaciones registradas." : "No se registraron depreciaciones.", created > 0 ? "success" : "info");
    renderAll();
  }

  function categoryLabel(value) {
    const found = (cfg.adjustmentCategories || []).find((c) => c.value === value);
    return found ? found.label : value || "-";
  }

  function entryStateBadge(estado) {
    const safe = String(estado || "").toLowerCase();
    if (safe === "vigente") return '<span class="badge cc-status-activo">Vigente</span>';
    if (safe === "anulado") return '<span class="badge cc-status-anulada">Anulado</span>';
    return `<span class="badge bg-secondary">${utils.escapeHTML(safe || "-")}</span>`;
  }

  function renderAdjustmentEntries() {
    if (!elements.tablaAjustes) return;

    if (!currentClientId || !currentPeriod) {
      elements.tablaAjustes.innerHTML = `
        <tr><td colspan="8" class="text-center text-muted py-4">Seleccione cliente y periodo.</td></tr>`;
      return;
    }

    const entries = contabilidad.getEntries({
      clienteId: currentClientId,
      periodoId: currentPeriod.id,
      tipoAsiento: "ajuste"
    });

    if (!entries.length) {
      elements.tablaAjustes.innerHTML = `
        <tr><td colspan="8" class="text-center text-muted py-4">
          No hay asientos de ajuste en este periodo.
        </td></tr>`;
      return;
    }

    elements.tablaAjustes.innerHTML = entries
      .map((entry) => {
        const summary = contabilidad.summarizeEntry(entry.id);
        const canVoid = entry.estado === "vigente" && currentPeriod.estado !== "cerrado";

        const voidButton = canVoid
          ? `<button
                class="btn btn-outline-danger"
                type="button"
                data-action="anular"
                data-id="${utils.escapeHTML(entry.id)}"
                title="Anular ajuste"
              >
                <i class="bi bi-x-octagon"></i>
              </button>`
          : `<button class="btn btn-outline-danger disabled" type="button" title="No anulable">
                <i class="bi bi-x-octagon"></i>
              </button>`;

        return `
          <tr>
            <td><code>${utils.escapeHTML(entry.folio || entry.id)}</code></td>
            <td>${utils.escapeHTML(utils.formatDate(entry.fecha))}</td>
            <td>${utils.escapeHTML(categoryLabel(entry.categoriaAjuste))}</td>
            <td>
              ${utils.escapeHTML(entry.descripcion || "-")}
              ${entry.observacion ? `<small class="d-block text-muted">${utils.escapeHTML(entry.observacion)}</small>` : ""}
            </td>
            <td class="text-end">${utils.escapeHTML(utils.formatMoney(summary.debito))}</td>
            <td class="text-end">${utils.escapeHTML(utils.formatMoney(summary.credito))}</td>
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
          </tr>`;
      })
      .join("");
  }

  function viewEntry(id) {
    const detail = contabilidad.getEntryDetail(id);
    if (!detail) {
      utils.showToast("Ajuste no encontrado.", "danger");
      return;
    }

    const { entry, lines } = detail;
    const summary = contabilidad.summarizeEntry(id);

    elements.detalleContenido.innerHTML = `
      <div class="row g-3 mb-3">
        <div class="col-12">
          <h3 class="h5 fw-bold mb-1">${utils.escapeHTML(entry.folio || entry.id)}</h3>
          <p class="text-muted mb-0">${utils.escapeHTML(entry.descripcion || "-")}</p>
        </div>
        <div class="col-12 col-md-3">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Fecha</p>
            <strong>${utils.escapeHTML(utils.formatDate(entry.fecha))}</strong>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Categoría</p>
            <strong>${utils.escapeHTML(categoryLabel(entry.categoriaAjuste))}</strong>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Estado</p>
            ${entryStateBadge(entry.estado)}
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="border rounded p-3 h-100">
            <p class="small text-muted mb-1">Cuadratura</p>
            <strong class="${summary.cuadrado ? "text-success" : "text-danger"}">
              ${summary.cuadrado ? "Cuadrado" : "Descuadrado"}
            </strong>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Cuenta</th>
              <th>Nombre</th>
              <th class="text-end">Débito</th>
              <th class="text-end">Crédito</th>
              <th>Tercero</th>
              <th>Referencia</th>
            </tr>
          </thead>
          <tbody>
            ${lines.map((line) => `
              <tr>
                <td><code>${utils.escapeHTML(line.cuentaCodigo)}</code></td>
                <td>${utils.escapeHTML(line.cuentaNombre || "-")}</td>
                <td class="text-end">${utils.escapeHTML(utils.formatMoney(line.debito))}</td>
                <td class="text-end">${utils.escapeHTML(utils.formatMoney(line.credito))}</td>
                <td>${utils.escapeHTML(line.tercero || "-")}</td>
                <td>${utils.escapeHTML(line.referencia || "-")}</td>
              </tr>
            `).join("")}
          </tbody>
          <tfoot class="table-light fw-semibold">
            <tr>
              <th colspan="2" class="text-end">Totales</th>
              <th class="text-end">${utils.escapeHTML(utils.formatMoney(summary.debito))}</th>
              <th class="text-end">${utils.escapeHTML(utils.formatMoney(summary.credito))}</th>
              <th colspan="2"></th>
            </tr>
          </tfoot>
        </table>
      </div>
    `;

    showDetalleModal();
  }

  function extractAssetId(text) {
    const match = String(text || "").match(/FA-\d{4}/);
    return match ? match[0] : null;
  }

  function voidAdjustment(id) {
    const entry = storage.get("journalEntries", id);
    if (!entry) {
      utils.showToast("Ajuste no encontrado.", "danger");
      return;
    }

    if (entry.tipoAsiento !== "ajuste") {
      utils.showToast("Solo se pueden anular asientos de ajuste desde este módulo.", "warning");
      return;
    }

    const period = storage.get("periods", entry.periodoId);
    if (!period || period.estado === "cerrado") {
      utils.showToast("No se puede anular un ajuste de un periodo cerrado.", "warning");
      return;
    }

    const ok = utils.confirmDialog(
      `¿Seguro que deseas anular el ajuste ${entry.folio || entry.id}? No se elimina, queda registrado para trazabilidad.`
    );
    if (!ok) return;

    try {
      if (entry.categoriaAjuste === "depreciacion") {
        const assetId = extractAssetId(entry.observacion);
        if (assetId) {
          const asset = storage.get("fixedAssets", assetId);
          if (asset) {
            const summary = contabilidad.summarizeEntry(id);
            const currentAccumulated = Number(asset.depreciacionAcumulada) || 0;
            const next = Math.max(round2(currentAccumulated - summary.debito), 0);
            storage.update("fixedAssets", assetId, { depreciacionAcumulada: next });
          }
        }
      }

      contabilidad.voidEntry(id);
      utils.showToast("Ajuste anulado correctamente.", "success");
      renderAll();
    } catch (error) {
      utils.showToast(error.message, "danger");
    }
  }

  function saveQuickAdjustment(event) {
    event.preventDefault();

    if (!currentClientId || !currentPeriod) {
      utils.showToast("Seleccione un cliente y un periodo.", "warning");
      return;
    }

    if (currentPeriod.estado === "cerrado") {
      utils.showToast("No se pueden registrar ajustes en un periodo cerrado.", "warning");
      return;
    }

    const fecha = elements.ajusteRapidoFecha.value;
    const categoria = elements.ajusteRapidoCategoria.value;
    const descripcion = elements.ajusteRapidoDescripcion.value.trim();
    const cuentaDebito = elements.ajusteRapidoCuentaDebito.value;
    const cuentaCredito = elements.ajusteRapidoCuentaCredito.value;
    const monto = round2(elements.ajusteRapidoMonto.value);
    const tercero = elements.ajusteRapidoTercero.value.trim();
    const observacion = elements.ajusteRapidoObservacion.value.trim();

    if (!fecha) {
      utils.showToast("Ingrese la fecha del ajuste.", "danger");
      return;
    }

    if (!isDateInPeriod(fecha, currentPeriod)) {
      utils.showToast(`La fecha debe estar dentro del periodo ${periodLabel(currentPeriod)}.`, "danger");
      return;
    }

    if (!categoria) {
      utils.showToast("Seleccione una categoría de ajuste.", "danger");
      return;
    }

    if (!descripcion) {
      utils.showToast("Ingrese una descripción.", "danger");
      return;
    }

    if (!cuentaDebito || !cuentaCredito) {
      utils.showToast("Seleccione cuenta débito y cuenta crédito.", "danger");
      return;
    }

    if (cuentaDebito === cuentaCredito) {
      utils.showToast("La cuenta débito y la cuenta crédito deben ser distintas.", "danger");
      return;
    }

    if (!Number.isFinite(monto) || monto <= 0) {
      utils.showToast("El monto debe ser mayor que cero.", "danger");
      return;
    }

    try {
      contabilidad.createManualEntry({
        clienteId: currentClientId,
        periodoId: currentPeriod.id,
        fecha,
        tipoAsiento: "ajuste",
        categoriaAjuste: categoria,
        documentoId: null,
        descripcion,
        observacion,
        lines: [
          {
            cuentaCodigo: cuentaDebito,
            debito: monto,
            credito: 0,
            tercero,
            referencia: "",
            observacion
          },
          {
            cuentaCodigo: cuentaCredito,
            debito: 0,
            credito: monto,
            tercero,
            referencia: "",
            observacion
          }
        ]
      });

      utils.showToast("Ajuste registrado correctamente.", "success");
      elements.ajusteRapidoDescripcion.value = "";
      elements.ajusteRapidoMonto.value = "";
      elements.ajusteRapidoTercero.value = "";
      elements.ajusteRapidoObservacion.value = "";
      renderAll();
    } catch (error) {
      utils.showToast(error.message, "danger");
    }
  }

  function renderAll() {
    currentClientId = elements.ajusteFiltroCliente?.value || "";
    currentPeriodId = elements.ajusteFiltroPeriodo?.value || "";
    currentPeriod = currentPeriodId ? storage.get("periods", currentPeriodId) : null;

    updateDefaultFecha();
    renderFixedAssets();
    renderAdjustmentEntries();
  }

  function bindEvents() {
    elements.ajusteFiltroCliente?.addEventListener("change", () => {
      loadPeriods(elements.ajusteFiltroCliente.value);
      renderAll();
    });

    elements.ajusteFiltroPeriodo?.addEventListener("change", renderAll);
    elements.btnRefrescarAjustes?.addEventListener("click", renderAll);
    elements.btnDepreciarTodos?.addEventListener("click", depreciateAll);
    elements.btnImprimirAjustes?.addEventListener("click", () => window.print());

    elements.tablaActivosFijos?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action='depreciar']");
      if (!button) return;
      depreciateOne(button.dataset.id);
    });

    elements.tablaAjustes?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;

      const action = button.dataset.action;
      const id = button.dataset.id;

      if (action === "ver") viewEntry(id);
      if (action === "anular") voidAdjustment(id);
    });

    elements.ajusteRapidoForm?.addEventListener("submit", saveQuickAdjustment);
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    if (!contabilidad) {
      console.error("No se encontró CC_CONTABILIDAD.");
      utils.showToast("El motor contable no está cargado.", "danger");
      return;
    }

    cacheElements();
    ensureAccounts();
    loadClients();
    populateFormStatic();
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