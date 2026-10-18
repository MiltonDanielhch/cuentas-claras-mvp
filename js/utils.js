/* =========================================================
   Cuentas Claras MVP
   Utilidades generales
   ========================================================= */

window.CC_UTILS = (function () {
  const cfg = window.CC_CONFIG;

  /* ---------------------------------------------------------
     Selectores básicos
     --------------------------------------------------------- */
  function qs(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function qsa(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  /* ---------------------------------------------------------
     Formato monetario
     --------------------------------------------------------- */
  function formatMoney(value) {
    const num = Number(value);
    const safe = Number.isFinite(num) ? num : 0;

    return `${cfg.currency} ${safe.toLocaleString(cfg.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  /* ---------------------------------------------------------
     Fechas
     --------------------------------------------------------- */
  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function pad4(n) {
    return String(Number(n) || 0).padStart(4, "0");
  }

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function nowISO() {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }

  function parseDateISO(value) {
    if (!value) return new Date(NaN);

    const str = String(value);

    if (str.includes("T")) {
      return new Date(str);
    }

    return new Date(`${str}T00:00:00`);
  }

  function formatDate(value) {
    if (!value) return "-";

    const str = String(value);
    const dateOnly = str.includes("T") ? str.slice(0, 10) : str;
    const d = parseDateISO(dateOnly);

    if (Number.isNaN(d.getTime())) return str;

    return d.toLocaleDateString(cfg.locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function formatDateTime(value) {
    if (!value) return "-";

    const d = parseDateISO(value);

    if (Number.isNaN(d.getTime())) return String(value);

    return `${formatDate(value)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }

  function daysUntil(dateISO) {
    const target = parseDateISO(dateISO);
    const today = parseDateISO(todayISO());

    if (Number.isNaN(target.getTime())) return 0;

    const diff = target.getTime() - today.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }

  /* ---------------------------------------------------------
     IDs
     --------------------------------------------------------- */
  function makeId(prefix, number) {
    return `${String(prefix).toUpperCase()}-${pad4(number)}`;
  }

  /* ---------------------------------------------------------
     Colecciones
     --------------------------------------------------------- */
  function getById(collection, id) {
    return (collection || []).find((item) => item.id === id) || null;
  }

  function filterBy(collection, predicate) {
    return (collection || []).filter(predicate);
  }

  function sortBy(collection, key, direction = "asc") {
    const data = [...(collection || [])];

    return data.sort((a, b) => {
      const va = a[key] ?? "";
      const vb = b[key] ?? "";

      if (va === vb) return 0;

      const result = va > vb ? 1 : -1;
      return direction === "desc" ? -result : result;
    });
  }

  /* ---------------------------------------------------------
     Seguridad visual básica
     --------------------------------------------------------- */
  function escapeHTML(value) {
    if (value === null || value === undefined) return "";

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ---------------------------------------------------------
     Toast simple
     --------------------------------------------------------- */
  function showToast(message, type = "info") {
    let container = document.getElementById("ccToastContainer");

    if (!container) {
      container = document.createElement("div");
      container.id = "ccToastContainer";
      container.style.position = "fixed";
      container.style.bottom = "1rem";
      container.style.right = "1rem";
      container.style.zIndex = "2000";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "0.5rem";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `alert alert-${type} shadow-sm mb-0`;
    toast.style.minWidth = "250px";
    toast.style.maxWidth = "360px";
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);
  }

  /* ---------------------------------------------------------
     Confirmación
     --------------------------------------------------------- */
  function confirmDialog(message) {
    return window.confirm(message);
  }

  /* ---------------------------------------------------------
     Descarga JSON
     --------------------------------------------------------- */
  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ---------------------------------------------------------
     Lectura de archivo de texto
     --------------------------------------------------------- */
  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);

      reader.readAsText(file);
    });
  }

  /* ---------------------------------------------------------
     Copiar al portapapeles
     --------------------------------------------------------- */
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const ok = document.execCommand("copy");
      textarea.remove();

      return ok;
    } catch (error) {
      console.error("No se pudo copiar al portapapeles:", error);
      return false;
    }
  }

  /* ---------------------------------------------------------
     WhatsApp link
     --------------------------------------------------------- */
  function buildWhatsAppUrl(phone, message) {
    let digits = String(phone || "").replace(/\D/g, "");

    if (!digits) {
      digits = "59100000000";
    }

    if (digits.startsWith("591")) {
      // ya tiene país
    } else if (digits.length === 8) {
      digits = `591${digits}`;
    } else if (digits.length === 9 && digits.startsWith("0")) {
      digits = `591${digits.slice(1)}`;
    } else {
      digits = `591${digits}`;
    }

    return `https://wa.me/${digits}?text=${encodeURIComponent(message || "")}`;
  }

  /* ---------------------------------------------------------
     Hash demo
     No es seguridad real de producción.
     --------------------------------------------------------- */
  function hashPassword(password) {
    return btoa(encodeURIComponent(`${password}::cuentasclaras-demo`));
  }

  function verifyPassword(password, hash) {
    return hashPassword(password) === hash;
  }

  /* ---------------------------------------------------------
     Query params
     --------------------------------------------------------- */
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function setQueryParam(url, name, value) {
    const parsed = new URL(url, window.location.origin);
    parsed.searchParams.set(name, value);
    return parsed.toString();
  }

  return {
    qs,
    qsa,
    formatMoney,
    formatDate,
    formatDateTime,
    parseDateISO,
    todayISO,
    nowISO,
    daysUntil,
    pad2,
    pad4,
    makeId,
    getById,
    filterBy,
    sortBy,
    escapeHTML,
    showToast,
    confirmDialog,
    downloadJSON,
    readFileAsText,
    copyToClipboard,
    buildWhatsAppUrl,
    hashPassword,
    verifyPassword,
    getQueryParam,
    setQueryParam
  };
})();