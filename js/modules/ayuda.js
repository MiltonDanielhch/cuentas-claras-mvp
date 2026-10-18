/* =========================================================
   Cuentas Claras MVP
   Módulo de ayuda, manual y límites legales
   Fase 13
   ========================================================= */

window.CC_AYUDA = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;

  const elements = {};

  function cacheElements() {
    elements.ayudaBusqueda = document.getElementById("ayudaBusqueda");
    elements.ayudaAlerta = document.getElementById("ayudaAlerta");
    elements.ayudaVersion = document.getElementById("ayudaVersion");
    elements.btnImprimirAyuda = document.getElementById("btnImprimirAyuda");
    elements.btnCopiarAviso = document.getElementById("btnCopiarAviso");
  }

  function setAlert(message, type = "info") {
    if (!elements.ayudaAlerta) return;

    if (!message) {
      elements.ayudaAlerta.classList.add("d-none");
      elements.ayudaAlerta.textContent = "";
      return;
    }

    elements.ayudaAlerta.className = `alert alert-${type} mt-3 mb-0 small`;
    elements.ayudaAlerta.textContent = message;
    elements.ayudaAlerta.classList.remove("d-none");
  }

  function filterTopics() {
    const query = String(elements.ayudaBusqueda?.value || "").trim().toLowerCase();
    const items = document.querySelectorAll("#ayudaAccordion .accordion-item");

    let visible = 0;

    items.forEach((item) => {
      const text = String(item.textContent || "").toLowerCase();
      const match = !query || text.includes(query);

      item.style.display = match ? "" : "none";

      if (match) visible += 1;
    });

    if (!query) {
      setAlert("");
      return;
    }

    if (visible === 0) {
      setAlert(`No se encontraron temas para “${query}”.`, "warning");
    } else {
      setAlert(`Se mostraron ${visible} tema(s) relacionados con “${query}”.`, "info");
    }
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

  async function copyDisclaimer() {
    const text =
      cfg.messages?.professionalDisclaimer ||
      "Este sistema no sustituye la firma de un Contador Público Autorizado cuando la normativa lo exija.";

    const ok = await copyToClipboard(text);

    if (ok) {
      utils.showToast("Aviso profesional copiado.", "success");
      setAlert("Aviso profesional copiado al portapapeles.", "success");
    } else {
      utils.showToast("No se pudo copiar el aviso.", "danger");
      setAlert("No se pudo copiar el aviso. Puede seleccionarlo manualmente.", "danger");
    }
  }

  function bindEvents() {
    elements.ayudaBusqueda?.addEventListener("input", filterTopics);
    elements.btnImprimirAyuda?.addEventListener("click", () => window.print());
    elements.btnCopiarAviso?.addEventListener("click", copyDisclaimer);
  }

  function init() {
    if (!window.CC_AUTH || !window.CC_AUTH.isAuthenticated()) return;

    cacheElements();

    if (elements.ayudaVersion) {
      elements.ayudaVersion.textContent = `v${cfg.version || "0.2.0"}`;
    }

    bindEvents();
    filterTopics();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    filterTopics
  };
})();