/* =========================================================
   Cuentas Claras MVP
   Scripts de landing page
   Fase: portada actualizada
   ========================================================= */

(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initNavbarScroll() {
    const navbar = document.getElementById("ccLandingNavbar");

    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 24) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenuClose() {
    const menu = document.getElementById("ccLandingMenu");

    if (!menu || typeof bootstrap === "undefined") return;

    const links = menu.querySelectorAll("a.nav-link, a.btn");

    links.forEach((link) => {
      link.addEventListener("click", () => {
        if (menu.classList.contains("show")) {
          const instance = bootstrap.Collapse.getOrCreateInstance(menu, {
            toggle: false
          });

          instance.hide();
        }
      });
    });
  }

  function initReveal() {
    const elements = document.querySelectorAll(".cc-reveal");

    if (!elements.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function animateCounter(el) {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const duration = prefersReducedMotion ? 0 : 1200;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      el.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    }

    if (duration === 0) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    requestAnimationFrame(frame);
  }

  function initCounters() {
    const counters = document.querySelectorAll(".cc-stat-number[data-count]");

    if (!counters.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      counters.forEach((el) => animateCounter(el));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.35
      }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function initYear() {
    const yearEl = document.getElementById("ccYear");

    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        const navbar = document.getElementById("ccLandingNavbar");
        const offset = navbar ? navbar.offsetHeight + 12 : 80;

        const top =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          offset;

        window.scrollTo({
          top,
          behavior: prefersReducedMotion ? "auto" : "smooth"
        });
      });
    });
  }

  function init() {
    initNavbarScroll();
    initMobileMenuClose();
    initReveal();
    initCounters();
    initYear();
    initSmoothAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();