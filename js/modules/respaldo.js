/* =========================================================
   Cuentas Claras MVP
   Módulo de respaldo, importación, restablecimiento y bitácora
   Fase 12
   ========================================================= */

window.CC_RESPALDO = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const bitacora = window.CC_BITACORA;

  const elements = {};
  let pendingImportPayload = null;
  let pendingImportValid = false;

  const collectionLabels = {
    users: "Usuarios",
    clients: "Clientes",
    periods: "Periodos",
    documents: "Documentos",
    transactions: "Transacciones",
    taxes: "Impuestos",
    obligations: "Obligaciones",
    accounts: "Plan de cuentas",
    journalEntries: "Asientos de diario",
    journalLines: "Líneas de asiento",
    fixedAssets: "Activos fijos",
    financialSnapshots: "Snapshots financieros",
    alerts: "Alertas",
    reports: "Reportes",
    logs: "Bitácora"
  };

  function cacheElements() {
    elements.statVersion = document.getElementById("statVersion");
    elements.statSeed = document.getElementById("statSeed");
    elements.statLastBackup = document.getElementById("statLastBackup");
    elements.statSize = document.getElementById("statSize");
    elements.statSizeBar = document.getElementById("statSizeBar");
    elements.tablaColecciones = document.getElementById("tablaColecciones");
    elements.btnRefrescarStats = document.getElementById("btnRefrescarStats");

    elements.btnExportar = document.getElementById("btnExportar");
    elements.btnCopiarRespaldo = document.getElementById("btnCopiarRespaldo");
    elements.btnVistaPrevia = document.getElementById("btnVistaPrevia");
    elements.exportResultado = document.getElementById("exportResultado");
    elements.jsonPreview = document.getElementById("jsonPreview");

    elements.importFile = document.getElementById("importFile");
    elements.importModo = document.getElementById("importModo");
    elements.btnValidarImport = document.getElementById("btnValidarImport");
    elements.btnImportar = document.getElementById("btnImportar");
    elements.importResultado = document.getElementById("importResultado");

    elements.btnCargarSemilla = document.getElementById("btnCargarSemilla");
    elements.btnRestablecer = document.getElementById("btnRestablecer");
    elements.keepSessionCheck = document.getElementById("keepSessionCheck");
    elements.semillaResultado = document.getElementById("semillaResultado");

    elements.bitBusqueda = document.getElementById("bitBusqueda");
    elements.bitFiltroEntidad = document.getElementById("bitFiltroEntidad");
    elements.bitFiltroAccion = document.getElementById("bitFiltroAccion");
    elements.bitFiltroUsuario = document.getElementById("bitFiltroUsuario");
    elements.btnLimpiarBitacora = document.getElementById("btnLimpiarBitacora");
    elements.tablaBitacora = document.getElementById("tablaBitacora");
    elements.bitacoraResumen = document.getElementById("bitacoraResumen");
    elements.btnImprimirBitacora = document.getElementById("btnImprimirBitacora");
  }

  function setResult(el, message, type = "info") {
    if (!el) return;
    if (!message) {
      el.classList.add("d-none");
      el.textContent = "";
      return;
    }
    el.className = `alert alert-${type} small mt-3 mb-0`;
    el.textContent = message;
    el.classList.remove("d-none");
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function estimateLocalStorageUsage() {
    let total = 0;
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (!key.startsWith(cfg.storagePrefix)) return;
      try {
        const value = localStorage.getItem(key) || "";
        total += key.length + value.length;
      } catch (error) {
        // ignorar claves ilegibles
      }
    });

    return total * 2; // aproximación UTF-16
  }

  function renderStats() {
    const settings = storage.getSetting();
    const usage = estimateLocalStorageUsage();
    const limitBytes = 5 * 1024 * 1024;
    const percent = Math.min(100, Math.round((usage / limitBytes) * 100));

    if (elements.statVersion) {
      elements.statVersion.textContent = `v${settings.storageVersion || cfg.storageVersion}`;
    }

    if (elements.statSeed) {
      elements.statSeed.textContent = settings.seedLoaded ? "Sí" : "No";
      elements.statSeed.className =
        "h5 mb-0 fw-bold " + (settings.seedLoaded ? "text-success" : "text-warning");
    }

    if (elements.statLastBackup) {
      elements.statLastBackup.textContent = settings.lastBackupAt
        ? utils.formatDate(String(settings.lastBackupAt).slice(0, 10))
        : "Nunca";
    }

    if (elements.statSize) {
      elements.statSize.textContent = formatBytes(usage);
      elements.statSize.className =
        "h5 mb-0 fw-bold " +
        (percent > 80 ? "text-danger" : percent > 50 ? "text-warning" : "text-success");
    }

    if (elements.statSizeBar) {
      elements.statSizeBar.textContent = `${percent}% del límite aproximado (5 MB)`;
    }

    if (elements.tablaColecciones) {
      const rows = Object.keys(storage.collections || {}).map((name) => {
        const data = storage.list(name);
        const key = storage.collections[name];
        const raw = localStorage.getItem(key) || "[]";
        const size = (key.length + raw.length) * 2;

        return `
          <tr>
            <td>
              <strong>${utils.escapeHTML(collectionLabels[name] || name)}</strong>
              <small class="d-block text-muted"><code>${utils.escapeHTML(key)}</code></small>
            </td>
            <td class="text-end">${data.length}</td>
            <td class="text-end">${utils.escapeHTML(formatBytes(size))}</td>
          </tr>
        `;
      });

      elements.tablaColecciones.innerHTML = rows.join("") || `
        <tr><td colspan="3" class="text-center text-muted py-3">Sin colecciones registradas.</td></tr>
      `;
    }
  }

  function buildFilename() {
    const today = utils.todayISO().replace(/-/g, "");
    return `cuentas-claras-respaldo-${today}.json`;
  }

  function downloadJSON(filename, data) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();

      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }

      document.body.removeChild(textarea);
      return ok;
    }
  }

  function exportBackup() {
    const data = storage.exportAll();
    const filename = buildFilename();

    storage.setSetting({ lastBackupAt: utils.nowISO() });

    if (bitacora) {
      bitacora.log(
        "exportar_respaldo",
        "backup",
        null,
        `Respaldo exportado como ${filename}. Colecciones incluidas: ${Object.keys(data.data || {}).length}.`
      );
    }

    downloadJSON(filename, data);
    renderStats();

    setResult(
      elements.exportResultado,
      `Respaldo exportado como ${filename}. Registre la fecha y guárdelo en un lugar seguro.`,
      "success"
    );
    utils.showToast("Respaldo exportado.", "success");
  }

  async function copyBackup() {
    const data = storage.exportAll();
    const json = JSON.stringify(data, null, 2);
    const ok = await copyToClipboard(json);

    if (ok) {
      setResult(elements.exportResultado, "Respaldo copiado al portapapeles.", "success");
      utils.showToast("Copiado al portapapeles.", "success");
    } else {
      setResult(elements.exportResultado, "No se pudo copiar. Use la descarga de archivo.", "danger");
      utils.showToast("No se pudo copiar.", "danger");
    }
  }

  function togglePreview() {
    if (!elements.jsonPreview) return;

    if (elements.jsonPreview.classList.contains("d-none")) {
      const data = storage.exportAll();
      const json = JSON.stringify(data, null, 2);
      const preview = json.length > 4000 ? `${json.slice(0, 4000)}\n\n... [truncado para vista previa]` : json;
      elements.jsonPreview.textContent = preview;
      elements.jsonPreview.classList.remove("d-none");
    } else {
      elements.jsonPreview.classList.add("d-none");
      elements.jsonPreview.textContent = "";
    }
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
      reader.readAsText(file, "UTF-8");
    });
  }

  function validatePayload(payload) {
    const issues = [];
    const info = {};

    if (!payload || typeof payload !== "object") {
      issues.push("El archivo no contiene un objeto JSON válido.");
      return { ok: false, issues, info };
    }

    if (payload.app !== cfg.appName) {
      issues.push(`El respaldo no parece ser de ${cfg.appName}. App declarada: ${payload.app || "desconocida"}.`);
    }

    const version = Number(payload.version) || 1;
    info.version = version;

    if (!payload.data || typeof payload.data !== "object") {
      issues.push("Falta la sección data.");
      return { ok: false, issues, info };
    }

    const expectedCollections = Object.keys(storage.collections || {});
    const presentCollections = [];

    expectedCollections.forEach((name) => {
      const value = payload.data[name];
      if (Array.isArray(value)) {
        presentCollections.push(name);
      } else if (value === undefined) {
        info[`missing_${name}`] = true;
      } else {
        issues.push(`La colección ${name} no es un arreglo válido.`);
      }
    });

    info.collections = presentCollections;
    info.counts = {};
    presentCollections.forEach((name) => {
      info.counts[name] = payload.data[name].length;
    });

    if (version < 2) {
      info.warningVersion = "El respaldo es versión 1. Las colecciones contables nuevas se inicializarán vacías.";
    }

    return {
      ok: issues.length === 0,
      issues,
      info
    };
  }

  async function validateImport() {
    pendingImportPayload = null;
    pendingImportValid = false;
    elements.btnImportar.disabled = true;

    const file = elements.importFile?.files?.[0];

    if (!file) {
      setResult(elements.importResultado, "Seleccione un archivo JSON primero.", "warning");
      return;
    }

    try {
      const text = await readFileAsText(file);
      const payload = JSON.parse(text);
      const result = validatePayload(payload);

      pendingImportPayload = payload;

      const lines = [];
      lines.push(`Archivo: ${file.name}`);
      lines.push(`Tamaño: ${formatBytes(file.size)}`);
      lines.push(`Versión declarada: ${result.info.version}`);
      lines.push(`Colecciones detectadas: ${(result.info.collections || []).length}`);

      if (result.info.warningVersion) {
        lines.push(result.info.warningVersion);
      }

      if (result.ok) {
        pendingImportValid = true;
        elements.btnImportar.disabled = false;
        setResult(elements.importResultado, `Validación correcta. ${lines.join(" · ")}`, "success");
        utils.showToast("Respaldo válido. Puede importar.", "success");
      } else {
        setResult(
          elements.importResultado,
          `Validación con errores: ${result.issues.join(" | ")} · ${lines.join(" · ")}`,
          "danger"
        );
        utils.showToast("El respaldo tiene errores de estructura.", "danger");
      }
    } catch (error) {
      setResult(elements.importResultado, `Error al leer o parsear el archivo: ${error.message}`, "danger");
      utils.showToast("No se pudo leer el archivo JSON.", "danger");
    }
  }

  function doImport() {
    if (!pendingImportPayload || !pendingImportValid) {
      setResult(elements.importResultado, "Valide el archivo antes de importar.", "warning");
      return;
    }

    const modo = elements.importModo?.value || "reemplazar";
    const replace = modo === "reemplazar";

    const message = replace
      ? "¿Reemplazar TODOS los datos actuales con el respaldo importado? Esta acción no se puede deshacer salvo que tenga otro respaldo."
      : "¿Fusionar el respaldo con los datos actuales? Los registros con el mismo ID serán actualizados; los nuevos serán agregados.";

    const ok = utils.confirmDialog(message);
    if (!ok) return;

    try {
      storage.importAll(pendingImportPayload, replace);
      storage.recalcCounters();

      if (bitacora) {
        bitacora.log(
          "importar_respaldo",
          "backup",
          null,
          `Respaldo importado en modo ${modo}. Versión del archivo: ${pendingImportPayload.version || 1}.`
        );
      }

      setResult(
        elements.importResultado,
        `Respaldo importado correctamente en modo ${modo}. Refresque las pantallas para ver los datos.`,
        "success"
      );
      utils.showToast("Respaldo importado.", "success");

      pendingImportPayload = null;
      pendingImportValid = false;
      elements.btnImportar.disabled = true;
      if (elements.importFile) elements.importFile.value = "";

      renderStats();
      renderBitacora();
    } catch (error) {
      setResult(elements.importResultado, `Error al importar: ${error.message}`, "danger");
      utils.showToast("No se pudo importar el respaldo.", "danger");
    }
  }

  function loadSeedForce() {
    const ok = utils.confirmDialog(
      "¿Cargar datos semilla de demostración? Esto reemplazará todas las colecciones actuales con los datos de ejemplo del prototipo."
    );
    if (!ok) return;

    const loaded = storage.loadSeed(true);

    if (!loaded) {
      setResult(elements.semillaResultado, "No se pudo cargar la semilla. Verifique que js/data/seed.js esté presente.", "danger");
      utils.showToast("No se pudo cargar la semilla.", "danger");
      return;
    }

    if (bitacora) {
      bitacora.log(
        "cargar_seed",
        "settings",
        null,
        "Datos semilla cargados manualmente desde módulo de respaldo"
      );
    }

    setResult(elements.semillaResultado, "Datos semilla cargados correctamente.", "success");
    utils.showToast("Semilla cargada.", "success");
    renderStats();
    renderBitacora();
  }

  function resetSystem() {
    const confirmation = window.prompt(
      "Para restablecer el sistema, escriba exactamente la palabra REINICIAR en mayúsculas. Esta acción borra todos los datos locales."
    );

    if (confirmation !== "REINICIAR") {
      setResult(elements.semillaResultado, "Restablecimiento cancelado: confirmación incorrecta.", "warning");
      utils.showToast("Restablecimiento cancelado.", "warning");
      return;
    }

    const keepSession = elements.keepSessionCheck?.checked === true;

    storage.reset(keepSession);

    if (bitacora) {
      bitacora.log(
        "restablecer_sistema",
        "settings",
        null,
        `Sistema restablecido. Sesión mantenida: ${keepSession ? "sí" : "no"}.`
      );
    }

    setResult(
      elements.semillaResultado,
      "Sistema restablecido. Se recargaron las colecciones vacías y la configuración por defecto.",
      "success"
    );
    utils.showToast("Sistema restablecido.", "success");

    renderStats();
    renderBitacora();
  }

  function populateBitacoraFilters() {
    const logs = storage.list("logs");

    const entities = Array.from(new Set(logs.map((l) => l.entidad).filter(Boolean))).sort();
    const actions = Array.from(new Set(logs.map((l) => l.accion).filter(Boolean))).sort();
    const users = Array.from(new Set(logs.map((l) => l.usuarioId).filter(Boolean))).sort();

    const fill = (selectEl, values, placeholder) => {
      if (!selectEl) return;
      const prev = selectEl.value;
      selectEl.innerHTML = "";
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = placeholder;
      selectEl.appendChild(opt);
      values.forEach((v) => {
        const o = document.createElement("option");
        o.value = v;
        o.textContent = v;
        selectEl.appendChild(o);
      });
      if (prev) selectEl.value = prev;
    };

    fill(elements.bitFiltroEntidad, entities, "Todas");
    fill(elements.bitFiltroAccion, actions, "Todas");
    fill(elements.bitFiltroUsuario, users, "Todos");
  }

  function applyBitacoraFilters() {
    const search = String(elements.bitBusqueda?.value || "").trim().toLowerCase();
    const entidad = elements.bitFiltroEntidad?.value || "";
    const accion = elements.bitFiltroAccion?.value || "";
    const usuario = elements.bitFiltroUsuario?.value || "";

    let data = storage.list("logs");

    if (entidad) data = data.filter((l) => l.entidad === entidad);
    if (accion) data = data.filter((l) => l.accion === accion);
    if (usuario) data = data.filter((l) => l.usuarioId === usuario);

    if (search) {
      data = data.filter((l) => {
        const haystack = [l.id, l.accion, l.entidad, l.registroId, l.detalle, l.usuarioId]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    data.sort((a, b) => {
      const fa = String(a.fecha || "");
      const fb = String(b.fecha || "");
      if (fa !== fb) return fb.localeCompare(fa);
      return String(b.id || "").localeCompare(String(a.id || ""));
    });

    return data;
  }

  function renderBitacora() {
    if (!elements.tablaBitacora) return;

    const data = applyBitacoraFilters();

    if (!data.length) {
      elements.tablaBitacora.innerHTML = `
        <tr><td colspan="7" class="text-center text-muted py-4">No hay registros de bitácora con los filtros aplicados.</td></tr>
      `;
      if (elements.bitacoraResumen) elements.bitacoraResumen.textContent = "0 registros.";
      return;
    }

    elements.tablaBitacora.innerHTML = data
      .slice(0, 200)
      .map((log) => {
        const fecha = String(log.fecha || "");
        const dateOnly = fecha.slice(0, 10);
        const timeOnly = fecha.length > 10 ? fecha.slice(11, 16) : "";

        return `
          <tr>
            <td><code>${utils.escapeHTML(log.id || "-")}</code></td>
            <td>
              ${utils.escapeHTML(dateOnly ? utils.formatDate(dateOnly) : "-")}
              <small class="d-block text-muted">${utils.escapeHTML(timeOnly)}</small>
            </td>
            <td>${utils.escapeHTML(log.usuarioId || "-")}</td>
            <td><span class="badge bg-secondary-subtle text-secondary">${utils.escapeHTML(log.accion || "-")}</span></td>
            <td>${utils.escapeHTML(log.entidad || "-")}</td>
            <td><code>${utils.escapeHTML(log.registroId || "-")}</code></td>
            <td class="small">${utils.escapeHTML(log.detalle || "-")}</td>
          </tr>
        `;
      })
      .join("");

    if (elements.bitacoraResumen) {
      const shown = Math.min(data.length, 200);
      elements.bitacoraResumen.textContent =
        `Mostrando ${shown} de ${data.length} registros. Use filtros para acotar la vista.`;
    }
  }

  function bindEvents() {
    elements.btnRefrescarStats?.addEventListener("click", () => {
      renderStats();
      utils.showToast("Estadísticas actualizadas.", "info");
    });

    elements.btnExportar?.addEventListener("click", exportBackup);
    elements.btnCopiarRespaldo?.addEventListener("click", copyBackup);
    elements.btnVistaPrevia?.addEventListener("click", togglePreview);

    elements.btnValidarImport?.addEventListener("click", validateImport);
    elements.btnImportar?.addEventListener("click", doImport);

    elements.btnCargarSemilla?.addEventListener("click", loadSeedForce);
    elements.btnRestablecer?.addEventListener("click", resetSystem);

    elements.bitBusqueda?.addEventListener("input", renderBitacora);
    elements.bitFiltroEntidad?.addEventListener("change", renderBitacora);
    elements.bitFiltroAccion?.addEventListener("change", renderBitacora);
    elements.bitFiltroUsuario?.addEventListener("change", renderBitacora);

    elements.btnLimpiarBitacora?.addEventListener("click", () => {
      if (elements.bitBusqueda) elements.bitBusqueda.value = "";
      if (elements.bitFiltroEntidad) elements.bitFiltroEntidad.value = "";
      if (elements.bitFiltroAccion) elements.bitFiltroAccion.value = "";
      if (elements.bitFiltroUsuario) elements.bitFiltroUsuario.value = "";
      renderBitacora();
    });

    elements.btnImprimirBitacora?.addEventListener("click", () => window.print());
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    cacheElements();
    renderStats();
    populateBitacoraFilters();
    renderBitacora();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    renderStats,
    renderBitacora,
    exportBackup
  };
})();