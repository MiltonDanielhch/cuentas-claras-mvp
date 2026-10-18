/* =========================================================
   Cuentas Claras MVP
   Visor de documentación técnica y de defensa
   Fase 16
   ========================================================= */

window.CC_DOCUMENTACION = (function () {
  const utils = window.CC_UTILS;

  const DOCS = [
    {
      file: "README.md",
      title: "Índice general",
      description: "Mapa de documentación y uso en defensa"
    },
    {
      file: "arquitectura-tecnica.md",
      title: "Arquitectura técnica",
      description: "Stack, componentes, flujo y límites"
    },
    {
      file: "contrato-de-datos.md",
      title: "Contrato de datos",
      description: "Colecciones, entidades y reglas de integridad"
    },
    {
      file: "ciclo-contable-implementado.md",
      title: "Ciclo contable implementado",
      description: "Diario, Mayor, Balanza, ajustes, EE.FF. y cierre"
    },
    {
      file: "manual-de-defensa.md",
      title: "Manual de defensa",
      description: "Guion, roles, demo y preguntas del tribunal"
    },
    {
      file: "presentacion-academica.md",
      title: "Presentación académica",
      description: "Diapositivas sugeridas y notas orales"
    },
    {
      file: "checklist-evidencia-y-anexos.md",
      title: "Evidencia y anexos",
      description: "Checklist final para documento y sustentación"
    }
  ];

  const elements = {};
  let currentFile = "README.md";

  function cacheElements() {
    elements.docSelector = document.getElementById("docSelector");
    elements.docLista = document.getElementById("docLista");
    elements.docContenido = document.getElementById("docContenido");
    elements.docAlerta = document.getElementById("docAlerta");
    elements.btnRefrescarDoc = document.getElementById("btnRefrescarDoc");
    elements.btnImprimirDoc = document.getElementById("btnImprimirDoc");
  }

  function setAlert(message, type = "warning") {
    if (!elements.docAlerta) return;

    if (!message) {
      elements.docAlerta.classList.add("d-none");
      elements.docAlerta.textContent = "";
      return;
    }

    elements.docAlerta.className = `alert alert-${type} mb-0 small`;
    elements.docAlerta.textContent = message;
    elements.docAlerta.classList.remove("d-none");
  }

  function buildIndex() {
    if (!elements.docSelector || !elements.docLista) return;

    elements.docSelector.innerHTML = DOCS
      .map(
        (doc) => `
          <option value="${utils.escapeHTML(doc.file)}">
            ${utils.escapeHTML(doc.title)}
          </option>
        `
      )
      .join("");

    elements.docLista.innerHTML = DOCS
      .map(
        (doc) => `
          <button
            type="button"
            class="list-group-item list-group-item-action"
            data-file="${utils.escapeHTML(doc.file)}"
          >
            ${utils.escapeHTML(doc.title)}
            <small>${utils.escapeHTML(doc.description)}</small>
          </button>
        `
      )
      .join("");

    setActiveIndex(currentFile);
  }

  function setActiveIndex(file) {
    if (elements.docSelector) elements.docSelector.value = file;

    if (elements.docLista) {
      elements.docLista.querySelectorAll(".list-group-item").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.file === file);
      });
    }
  }

  function renderMarkdown(markdown) {
    if (!elements.docContenido) return;

    if (window.marked) {
      marked.setOptions({
        gfm: true,
        breaks: true
      });

      elements.docContenido.innerHTML = marked.parse(markdown);
    } else {
      elements.docContenido.innerHTML = `
        <pre class="cc-doc-fallback">${utils.escapeHTML(markdown)}</pre>
      `;
    }

    interceptInternalLinks();
  }

  function interceptInternalLinks() {
    if (!elements.docContenido) return;

    elements.docContenido.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href") || "";

      const match = href.match(/(?:^|\/)docs\/([^#?]+\.md)/i);

      if (!match) return;

      link.addEventListener("click", (event) => {
        event.preventDefault();
        loadDoc(match[1]);
      });
    });
  }

  async function loadDoc(file) {
    currentFile = file;
    setActiveIndex(file);

    if (!elements.docContenido) return;

    elements.docContenido.innerHTML = `
      <div class="text-center text-muted py-5">
        <div class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        Cargando ${utils.escapeHTML(file)}...
      </div>
    `;

    try {
      const response = await fetch(`./docs/${file}`, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`No se pudo cargar docs/${file}. HTTP ${response.status}.`);
      }

      const text = await response.text();
      renderMarkdown(text);
      setAlert("");
    } catch (error) {
      elements.docContenido.innerHTML = `
        <div class="alert alert-danger small mb-0">
          <strong>Error al cargar documentación:</strong>
          ${utils.escapeHTML(error.message)}
          <hr>
          <strong>Sugerencia:</strong>
          abra esta página desde un servidor local o desde GitHub Pages.
          Si abre el archivo directamente con <code>file://</code>, el navegador
          puede bloquear la lectura de archivos Markdown por seguridad.
        </div>
      `;
      setAlert(error.message, "danger");
    }
  }

  function bindEvents() {
    elements.docSelector?.addEventListener("change", () => {
      loadDoc(elements.docSelector.value);
    });

    elements.docLista?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-file]");
      if (!button) return;
      loadDoc(button.dataset.file);
    });

    elements.btnRefrescarDoc?.addEventListener("click", () => {
      loadDoc(currentFile);
      utils.showToast("Documentación refrescada.", "info");
    });

    elements.btnImprimirDoc?.addEventListener("click", () => window.print());
  }

  function init() {
    cacheElements();
    buildIndex();
    bindEvents();
    loadDoc(currentFile);
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    loadDoc
  };
})();