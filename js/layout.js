/* =========================================================
   Cuentas Claras MVP
   Layout dinámico: menú lateral COLAPSABLE por grupos
   Fase 16.1: contraer/expandir secciones + persistencia
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
    "ayuda",
    "documentacion"
  ];

  /* Agrupación lógica del menú. El orden de los grupos manda. */
  const MENU_GROUPS = [
    { id: "panel", label: "Panel", pages: ["dashboard"] },
    {
      id: "registro",
      label: "Registro operativo",
      pages: ["clientes", "periodos", "documentos", "transacciones"]
    },
    { id: "tributario", label: "Tributario", pages: ["impuestos"] },
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
    { id: "seguimiento", label: "Seguimiento", pages: ["alertas", "reportes"] },
    {
      id: "sistema",
      label: "Sistema",
      pages: ["respaldo", "ayuda", "documentacion"]
    }
  ];

  const MENU_STATE_KEY = (cfg.storagePrefix || "cc_") + "menu_expanded";

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

  /* ---------- Persistencia de grupos abiertos ---------- */
  function loadExpanded() {
    try {
      const raw = localStorage.getItem(MENU_STATE_KEY);
      if (!raw) return null; // null = primera vez -> solo grupo activo abierto
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? new Set(arr) : null;
    } catch (error) {
      return null;
    }
  }

  function saveExpanded(set) {
    try {
      localStorage.setItem(MENU_STATE_KEY, JSON.stringify(Array.from(set)));
    } catch (error) {
      /* modo privado / cuota llena: se ignora, no rompe el menú */
    }
  }

  function findGroupOfPage(page) {
    const found = MENU_GROUPS.find((g) => g.pages.includes(page));
    return found ? found.id : null;
  }

  /* ---------- Render del menú ---------- */
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

    const byPage = {};
    menuItems.forEach((item) => {
      byPage[item.page] = item;
    });

    const usedPages = new Set();
    const sections = [];
    let index = 0;

    MENU_GROUPS.forEach((group) => {
      const items = group.pages.map((p) => byPage[p]).filter(Boolean);
      if (!items.length) return;

      items.forEach((item) => usedPages.add(item.page));

      const listId = "cc-nav-list-" + group.id;
      const divider = index > 0 ? '<div class="cc-nav-divider"></div>' : "";
      index += 1;

      sections.push(`
        ${divider}
        <div class="cc-nav-group" data-group="${group.id}">
          <button
            type="button"
            class="cc-nav-group-header"
            aria-expanded="false"
            aria-controls="${listId}"
          >
            <span class="cc-nav-group-label">${utils.escapeHTML(group.label)}</span>
            <i class="bi bi-chevron-right cc-chevron" aria-hidden="true"></i>
          </button>
          <div class="cc-nav-group-list" id="${listId}">
            <ul class="cc-nav-list">
              ${items.map((item) => renderItem(item, currentPage)).join("")}
            </ul>
          </div>
        </div>
      `);
    });

    // Defensivo: cualquier item de config fuera de grupo va a "Otros"
    const leftovers = menuItems.filter((item) => !usedPages.has(item.page));
    if (leftovers.length) {
      const listId = "cc-nav-list-otros";
      const divider = index > 0 ? '<div class="cc-nav-divider"></div>' : "";
      sections.push(`
        ${divider}
        <div class="cc-nav-group" data-group="otros">
          <button type="button" class="cc-nav-group-header" aria-expanded="false" aria-controls="${listId}">
            <span class="cc-nav-group-label">Otros</span>
            <i class="bi bi-chevron-right cc-chevron" aria-hidden="true"></i>
          </button>
          <div class="cc-nav-group-list" id="${listId}">
            <ul class="cc-nav-list">
              ${leftovers.map((item) => renderItem(item, currentPage)).join("")}
            </ul>
          </div>
        </div>
      `);
    }

    return sections.join("");
  }

  function applyOpenState() {
    const currentPage = document.body.dataset.page || "";
    const activeGroup = findGroupOfPage(currentPage);

    let expanded = loadExpanded();

    if (expanded === null) {
      // Primera vez: solo el grupo activo queda abierto
      expanded = new Set(activeGroup ? [activeGroup] : []);
    } else if (activeGroup) {
      // Siempre asegurar visible el grupo de la página actual
      expanded.add(activeGroup);
    }

    document.querySelectorAll("#ccSidebarMenu .cc-nav-group").forEach((groupEl) => {
      const id = groupEl.dataset.group;
      const isOpen = expanded.has(id);
      groupEl.classList.toggle("open", isOpen);

      const header = groupEl.querySelector(".cc-nav-group-header");
      if (header) header.setAttribute("aria-expanded", String(isOpen));
    });

    saveExpanded(expanded);
  }

  function renderSidebar() {
    const menu = document.getElementById("ccSidebarMenu");
    if (!menu) return;
    menu.innerHTML = buildMenu();
    applyOpenState();
  }

  /* ---------- Toggle de grupos ---------- */
  function bindGroupToggle() {
    const menu = document.getElementById("ccSidebarMenu");
    if (!menu) return;

    menu.addEventListener("click", (event) => {
      const header = event.target.closest(".cc-nav-group-header");
      if (!header) return;

      const groupEl = header.closest(".cc-nav-group");
      if (!groupEl) return;

      const id = groupEl.dataset.group;
      const willOpen = !groupEl.classList.contains("open");

      groupEl.classList.toggle("open", willOpen);
      header.setAttribute("aria-expanded", String(willOpen));

      const currentPage = document.body.dataset.page || "";
      const activeGroup = findGroupOfPage(currentPage);

      const expanded = loadExpanded() || new Set();
      if (willOpen) expanded.add(id);
      else expanded.delete(id);

      // El grupo activo nunca se cierra del todo para no perder referencia
      if (activeGroup) expanded.add(activeGroup);

      saveExpanded(expanded);
    });
  }

  /* ---------- Menú móvil ---------- */
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

    // Cierra el drawer móvil al elegir una opción (no al tocar un header de grupo)
    sidebar.addEventListener("click", (event) => {
      const link = event.target.closest("a.cc-nav-link");
      if (!link) return;
      if (isMobile()) closeSidebar();
    });

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
    bindGroupToggle();
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