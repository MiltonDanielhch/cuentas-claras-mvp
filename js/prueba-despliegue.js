/* =========================================================
   Cuentas Claras MVP
   Verificador de despliegue en GitHub Pages
   Fase 15
   ========================================================= */

(function () {
  "use strict";

  const results = [];

  const elements = {
    diagResultados: document.getElementById("diagResultados"),
    diagReporte: document.getElementById("diagReporte"),
    diagTotal: document.getElementById("diagTotal"),
    diagPass: document.getElementById("diagPass"),
    diagWarn: document.getElementById("diagWarn"),
    diagFail: document.getElementById("diagFail"),
    btnRepetirDiag: document.getElementById("btnRepetirDiag"),
    btnCopiarDiag: document.getElementById("btnCopiarDiag")
  };

  function add(name, status, detail) {
    results.push({
      name,
      status,
      detail: String(detail || "")
    });
  }

  function hasGlobal(name) {
    return typeof window[name] !== "undefined" && window[name] !== null;
  }

  function hasFunction(obj, prop) {
    return obj && typeof obj[prop] === "function";
  }

  function isRelativePath(path) {
    return String(path || "").startsWith("./");
  }

  function testLocalStorage() {
    const key = "cc_deploy_test";

    try {
      localStorage.setItem(key, "ok");
      const value = localStorage.getItem(key);
      localStorage.removeItem(key);

      return value === "ok";
    } catch (error) {
      return false;
    }
  }

  function runChecks() {
    results.length = 0;

    const cfg = window.CC_CONFIG;
    const utils = window.CC_UTILS;
    const storage = window.CC_STORAGE;
    const auth = window.CC_AUTH;
    const contabilidad = window.CC_CONTABILIDAD;
    const motor = window.CC_MAYOR_BALANZA;
    const costos = window.CC_COSTOS;

    add(
      "Entorno JavaScript",
      "pass",
      `Navegador: ${navigator.userAgent.slice(0, 120)}...`
    );

    add(
      "URL actual",
      location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? "pass"
        : "warn",
      location.href
    );

    add(
      "Configuración CC_CONFIG",
      hasGlobal("CC_CONFIG") ? "pass" : "fail",
      cfg ? `Versión: ${cfg.version || "-"} · Storage: v${cfg.storageVersion || "-"}` : "No se cargó js/config.js"
    );

    add(
      "Utilidades CC_UTILS",
      hasGlobal("CC_UTILS") &&
        hasFunction(utils, "escapeHTML") &&
        hasFunction(utils, "formatMoney") &&
        hasFunction(utils, "todayISO")
        ? "pass"
        : "fail",
      utils ? "Funciones básicas disponibles" : "No se cargó js/utils.js"
    );

    add(
      "Almacenamiento CC_STORAGE",
      hasGlobal("CC_STORAGE") &&
        hasFunction(storage, "list") &&
        hasFunction(storage, "get") &&
        hasFunction(storage, "create") &&
        hasFunction(storage, "update") &&
        hasFunction(storage, "exportAll") &&
        hasFunction(storage, "importAll")
        ? "pass"
        : "fail",
      storage ? "API de almacenamiento disponible" : "No se cargó js/storage.js"
    );

    add(
      "Autenticación CC_AUTH",
      hasGlobal("CC_AUTH") &&
        hasFunction(auth, "getSession") &&
        hasFunction(auth, "isAuthenticated") &&
        hasFunction(auth, "login") &&
        hasFunction(auth, "logout")
        ? "pass"
        : "warn",
      auth ? "Módulo de sesión disponible" : "No se cargó js/auth.js o faltan funciones"
    );

    add(
      "Motor contable CC_CONTABILIDAD",
      hasGlobal("CC_CONTABILIDAD") &&
        hasFunction(contabilidad, "createAutomaticEntry") &&
        hasFunction(contabilidad, "createManualEntry") &&
        hasFunction(contabilidad, "getEntries") &&
        hasFunction(contabilidad, "summarizeEntry")
        ? "pass"
        : "fail",
      contabilidad ? "Libro Diario y asientos disponibles" : "No se cargó js/modules/contabilidad.js"
    );

    add(
      "Motor Mayor/Balanza CC_MAYOR_BALANZA",
      hasGlobal("CC_MAYOR_BALANZA") &&
        hasFunction(motor, "buildContext") &&
        hasFunction(motor, "getLedger") &&
        hasFunction(motor, "getTrialBalance")
        ? "pass"
        : "fail",
      motor ? "Libro Mayor y Balanza disponibles" : "No se cargó js/modules/mayor-balanza.js"
    );

    add(
      "Motor Costos/Indicadores CC_COSTOS",
      hasGlobal("CC_COSTOS") &&
        hasFunction(costos, "buildData") &&
        hasFunction(costos, "computeIncome") &&
        hasFunction(costos, "computeBreakeven")
        ? "pass"
        : "warn",
      costos ? "Costos e indicadores disponibles" : "No se cargó js/modules/costos.js"
    );

    add(
      "LocalStorage disponible",
      testLocalStorage() ? "pass" : "fail",
      testLocalStorage()
        ? "Se pudo escribir, leer y eliminar una clave temporal."
        : "El navegador bloqueó LocalStorage o está en modo privado restrictivo."
    );

    if (cfg && cfg.routes) {
      const routeEntries = Object.entries(cfg.routes);
      const badRoutes = routeEntries.filter(([, path]) => !isRelativePath(path));

      add(
        "Rutas relativas en config.routes",
        badRoutes.length === 0 ? "pass" : "fail",
        badRoutes.length === 0
          ? `${routeEntries.length} rutas verificadas con ./`
          : `Rutas no relativas: ${badRoutes.map(([k, v]) => `${k}=${v}`).join(", ")}`
      );
    } else {
      add("Rutas relativas en config.routes", "fail", "No hay cfg.routes");
    }

    if (cfg && Array.isArray(cfg.menu)) {
      const badMenu = cfg.menu.filter((item) => !isRelativePath(item.href));

      add(
        "Menú con rutas relativas",
        badMenu.length === 0 ? "pass" : "fail",
        badMenu.length === 0
          ? `${cfg.menu.length} itens de menú verificados.`
          : `Menú con rutas no relativas: ${badMenu.map((m) => m.href).join(", ")}`
      );
    } else {
      add("Menú con rutas relativas", "warn", "No hay cfg.menu");
    }

    if (cfg && Array.isArray(cfg.publicRoutes)) {
      const badPublic = cfg.publicRoutes.filter((path) => !isRelativePath(path));

      add(
        "Rutas públicas relativas",
        badPublic.length === 0 ? "pass" : "warn",
        badPublic.length === 0
          ? `${cfg.publicRoutes.length} rutas públicas verificadas.`
          : `Rutas públicas no relativas: ${badPublic.join(", ")}`
      );
    }

    const expectedFiles = [
      "./index.html",
      "./login.html",
      "./dashboard.html",
      "./libro-diario.html",
      "./libro-mayor.html",
      "./balanza.html",
      "./ajustes.html",
      "./estados-financieros.html",
      "./costos-indicadores.html",
      "./alertas.html",
      "./reportes.html",
      "./respaldo.html",
      "./ayuda.html"
    ];

    add(
      "Lista de pantallas esperadas",
      "info",
      `Se esperan ${expectedFiles.length} archivos HTML principales en el despliegue.`
    );

    add(
      "Aviso profesional configurado",
      cfg && cfg.messages && cfg.messages.professionalDisclaimer ? "pass" : "warn",
      cfg && cfg.messages && cfg.messages.professionalDisclaimer
        ? cfg.messages.professionalDisclaimer.slice(0, 160) + "..."
        : "No se encontró cfg.messages.professionalDisclaimer"
    );

    add(
      "Aviso tributario configurado",
      cfg && cfg.messages && cfg.messages.taxInfoDisclaimer ? "pass" : "warn",
      cfg && cfg.messages && cfg.messages.taxInfoDisclaimer
        ? cfg.messages.taxInfoDisclaimer.slice(0, 160) + "..."
        : "No se encontró cfg.messages.taxInfoDisclaimer"
    );

    renderResults();
  }

  function statusLabel(status) {
    if (status === "pass") return "Correcto";
    if (status === "fail") return "Error";
    if (status === "warn") return "Advertencia";
    return "Información";
  }

  function statusClass(status) {
    if (status === "pass") return "cc-diag-pass";
    if (status === "fail") return "cc-diag-fail";
    if (status === "warn") return "cc-diag-warn";
    return "cc-diag-info";
  }

  function statusIcon(status) {
    if (status === "pass") return "bi-check2-circle";
    if (status === "fail") return "bi-x-octagon";
    if (status === "warn") return "bi-exclamation-triangle";
    return "bi-info-circle";
  }

  function renderResults() {
    const pass = results.filter((r) => r.status === "pass").length;
    const fail = results.filter((r) => r.status === "fail").length;
    const warn = results.filter((r) => r.status === "warn").length;
    const info = results.filter((r) => r.status === "info").length;

    if (elements.diagTotal) elements.diagTotal.textContent = String(results.length);
    if (elements.diagPass) elements.diagPass.textContent = String(pass);
    if (elements.diagWarn) elements.diagWarn.textContent = String(warn);
    if (elements.diagFail) elements.diagFail.textContent = String(fail);

    if (elements.diagResultados) {
      if (!results.length) {
        elements.diagResultados.innerHTML = `<div class="text-muted">Sin resultados.</div>`;
      } else {
        elements.diagResultados.innerHTML = results
          .map((item) => `
            <div class="cc-diag-item">
              <div class="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <div class="cc-diag-name">
                    <i class="bi ${statusIcon(item.status)} ${statusClass(item.status)} me-1"></i>
                    ${escapeHTML(item.name)}
                  </div>
                  <div class="cc-diag-detail">${escapeHTML(item.detail)}</div>
                </div>

                <span class="badge ${
                  item.status === "pass"
                    ? "bg-success-subtle text-success"
                    : item.status === "fail"
                    ? "bg-danger-subtle text-danger"
                    : item.status === "warn"
                    ? "bg-warning-subtle text-warning"
                    : "bg-secondary-subtle text-secondary"
                }">
                  ${statusLabel(item.status)}
                </span>
              </div>
            </div>
          `)
          .join("");
      }
    }

    if (elements.diagReporte) {
      elements.diagReporte.textContent = buildReport({ pass, fail, warn, info });
    }
  }

  function buildReport(counts) {
    const lines = [];

    lines.push("CUENTAS CLARAS - INFORME DE DESPLIEGUE");
    lines.push(`Fecha: ${new Date().toISOString()}`);
    lines.push(`URL: ${location.href}`);
    lines.push("");
    lines.push(`Total: ${results.length}`);
    lines.push(`Correctos: ${counts.pass}`);
    lines.push(`Advertencias: ${counts.warn}`);
    lines.push(`Errores: ${counts.fail}`);
    lines.push(`Información: ${counts.info}`);
    lines.push("");
    lines.push("DETALLE:");

    results.forEach((item) => {
      lines.push(`[${statusLabel(item.status).toUpperCase()}] ${item.name}`);
      lines.push(`  ${item.detail}`);
    });

    return lines.join("\n");
  }

  function escapeHTML(value) {
    if (window.CC_UTILS && typeof window.CC_UTILS.escapeHTML === "function") {
      return window.CC_UTILS.escapeHTML(value);
    }

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function copyReport() {
    const text = elements.diagReporte ? elements.diagReporte.textContent : "";

    try {
      await navigator.clipboard.writeText(text);
      alert("Informe copiado al portapapeles.");
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
        alert("Informe copiado.");
      } catch (err) {
        alert("No se pudo copiar el informe. Puede seleccionarlo manualmente.");
      }

      document.body.removeChild(textarea);
    }
  }

  function bindEvents() {
    elements.btnRepetirDiag?.addEventListener("click", runChecks);
    elements.btnCopiarDiag?.addEventListener("click", copyReport);
  }

  function init() {
    bindEvents();
    runChecks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();