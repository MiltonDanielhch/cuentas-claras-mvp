/* =========================================================
   Cuentas Claras MVP
   Layout dinámico: menú lateral agrupado, topbar, móvil
   Fase 14.1: fix overflow + menú por secciones lógicas
   ========================================================= */

window.CC_LAYOUT = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;

  let initialized = false;

  const allowedPages = [
    "index",
    "login",
    "404",
    "dashboard",
    "clientes",
    "periodos",
    "documentos",
    "transacciones",
    "impuestos",
    "libro-diario",
    "libro-mayor",
    "balanza",
    "ajustes",
    "estados-financieros",
    "costos-indicadores",
    "alertas",
    "reportes",
    "respaldo",
    "ayuda"
  ];

  /* Agrupación lógica del menú. El orden de los grupos manda. */
  const MENU_GROUPS = [
    {
      id: "panel",
      label: "Panel",
      pages: ["dashboard"]
    },
    {
      id: "registro",
      label: "Registro operativo",
      pages: ["clientes", "periodos", "documentos", "transacciones"]
    },
    {
      id: "tributario",
      label: "Tributario",
      pages: ["impuestos"]
    },
    {
      id: "contable",
      label: "Ciclo contable",
      pages: [
        "libro-diario",
        "libro-mayor",
        "balanza",
        "ajustes",
        "estados-financieros",
        "costos-indicadores"
      ]
    },
    {
      id: "seguimiento",
      label: "Seguimiento",
      pages: ["alertas", "reportes"]
    },
    {
      id: "sistema",
      label: "Sistema",
      pages: ["respaldo", "ayuda"]
    }
  ];

  function getPageFromHref(href) {
    if (!href) return "";

    return String(href)
      .replace("./", "")
      .replace(".html", "")
      .split("?")[0]
      .split("#")[0];
  }

  function isMobile() {
    return window.matchMedia("(max-width: 991.98px)").matches;
  }

  function renderItem(item, currentPage) {
    const active = item.page === currentPage ? "active" : "";

    return `
      <li class="cc-nav-item">
        <a href="${item.href}" class="cc-nav-link ${active}" data-page="${item.page}">
          <i class="bi ${item.icon}"></i>
          <span>${utils.escapeHTML(item.label)}</span>
        </a>
      </li>
    `;
  }

  function buildMenu() {
    const currentPage = document.body.dataset.page || "";
    const menuItems = cfg.menu || [];

    // Mapa page -> item para resolver grupos rápido
    const byPage = {};
    menuItems.forEach((item) => {
      byPage[item.page] = item;
    });

    const usedPages = new Set();
    const sections = [];

    MENU_GROUPS.forEach((group, index) => {
      const items = group.pages
        .map((page) => byPage[page])
        .filter(Boolean);

      if (!items.length) return;

      items.forEach((item) => usedPages.add(item.page));

      const divider = index > 0 ? '<div class="cc-nav-divider"></div>' : "";

      sections.push(`
        ${divider}
        <div class="cc-nav-section">
          <span class="cc-nav-section-label">${utils.escapeHTML(group.label)}</span>
          <ul class="cc-nav-list">
            ${items.map((item) => renderItem(item, currentPage)).join("")}
          </ul>
        </div>
      `);
    });

    // Cualquier item de config que no entró en un grupo va al final (defensivo)
    const leftovers = menuItems.filter((item) => !usedPages.has(item.page));

    if (leftovers.length) {
      sections.push(`
        <div class="cc-nav-divider"></div>
        <div class="cc-nav-section">
          <span class="cc-nav-section-label">Otros</span>
          <ul class="cc-nav-list">
            ${leftovers.map((item) => renderItem(item, currentPage)).join("")}
          </ul>
        </div>
      `);
    }

    return sections.join("");
  }

  function renderSidebar() {
    const menu = document.getElementById("ccSidebarMenu");
    if (!menu) return;
    menu.innerHTML = buildMenu();
  }

  function bindMobileMenu() {
    const toggle = document.getElementById("ccMobileToggle");
    const sidebar = document.getElementById("ccSidebar");
    const backdrop = document.getElementById("ccSidebarBackdrop");

    if (!toggle || !sidebar) return;

    function openSidebar() {
      sidebar.classList.add("show");
      if (backdrop) backdrop.classList.remove("d-none");
      document.body.classList.add("cc-sidebar-open");
    }

    function closeSidebar() {
      sidebar.classList.remove("show");
      if (backdrop) backdrop.classList.add("d-none");
      document.body.classList.remove("cc-sidebar-open");
    }

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      if (sidebar.classList.contains("show")) closeSidebar();
      else openSidebar();
    });

    if (backdrop) backdrop.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSidebar();
    });

    // Cierra el menú móvil al elegir una opción
    sidebar.addEventListener("click", (event) => {
      const link = event.target.closest("a.cc-nav-link");
      if (!link) return;
      if (isMobile()) closeSidebar();
    });

    // Al pasar a escritorio, asegura menú cerrado
    window.addEventListener("resize", () => {
      if (!isMobile()) closeSidebar();
    });
  }

  function bindLogout() {
    const button = document.getElementById("ccLogoutButton");
    if (!button) return;

    button.addEventListener("click", () => {
      const ok = utils.confirmDialog("¿Seguro que deseas cerrar sesión?");
      if (!ok) return;
      window.CC_AUTH.logout();
      window.location.href = cfg.routes.login;
    });
  }

  function setUserLabel() {
    const label = document.getElementById("ccUserName");
    if (!label) return;

    const session = window.CC_AUTH.getSession();
    if (!session) {
      label.textContent = "Sin sesión";
      return;
    }
    label.textContent = `${session.nombre} · ${session.rol}`;
  }

  function interceptFutureModules() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("./")) return;

      const page = getPageFromHref(href);
      if (allowedPages.includes(page)) return;

      event.preventDefault();
      utils.showToast(
        "Este módulo estará disponible en las próximas fases del prototipo.",
        "info"
      );
    });
  }

  function render() {
    if (initialized) return;

    renderSidebar();
    bindMobileMenu();
    bindLogout();
    setUserLabel();
    interceptFutureModules();

    initialized = true;
  }

  return {
    render,
    setUserLabel
  };
})();