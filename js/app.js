/* =========================================================
   Cuentas Claras MVP
   Inicialización general del sistema
   ========================================================= */

window.CC_APP = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const auth = window.CC_AUTH;
  const layout = window.CC_LAYOUT;

  /* ---------------------------------------------------------
     Login
     --------------------------------------------------------- */
  function setLoginMessage(text, type = "info") {
    const box = document.getElementById("loginMessage");

    if (!box) return;

    box.className = `alert alert-${type}`;
    box.textContent = text;
    box.classList.remove("d-none");
  }

  function bindLoginForm() {
    const form = document.getElementById("loginForm");
    const demoButton = document.getElementById("btnLoadDemo");

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const usuario = document.getElementById("loginUser")?.value.trim() || "";
        const password = document.getElementById("loginPassword")?.value || "";

        if (!usuario || !password) {
          setLoginMessage("Completa usuario y contraseña.", "warning");
          return;
        }

        const result = auth.login(usuario, password);

        if (!result.ok) {
          setLoginMessage(result.message, "danger");
          return;
        }

        setLoginMessage("Ingreso correcto. Redirigiendo...", "success");

        setTimeout(() => {
          window.location.href = cfg.routes.dashboard;
        }, 350);
      });
    }

    if (demoButton) {
      demoButton.addEventListener("click", () => {
        const loaded = storage.loadSeed(true);

        if (loaded) {
          utils.showToast(
            "Datos de demostración cargados correctamente.",
            "success"
          );
          setLoginMessage(
            "Datos demo cargados. Ya puedes ingresar con admin / Admin123.",
            "info"
          );
        } else {
          utils.showToast(
            "No se pudieron cargar los datos de demostración.",
            "danger"
          );
        }
      });
    }
  }

  /* ---------------------------------------------------------
     Dashboard
     --------------------------------------------------------- */
  function setText(id, value) {
    const el = document.getElementById(id);

    if (el) {
      el.textContent = value;
    }
  }

  function sumTransactionsByType(transactions, type) {
    return transactions
      .filter((tx) => tx.tipo === type && tx.estado === "activa")
      .reduce((total, tx) => total + (Number(tx.monto) || 0), 0);
  }

  function sumTaxesEstimated(taxes) {
    return taxes
      .filter(
        (tax) =>
          tax.concepto === "por_pagar" ||
          tax.concepto === "ventas_brutas"
      )
      .reduce((total, tax) => total + (Number(tax.monto) || 0), 0);
  }

  function alertBadgeClass(level) {
    switch (level) {
      case "informativa":
        return "bg-info text-dark";
      case "preventiva":
        return "bg-warning text-dark";
      case "urgente":
        return "bg-danger";
      case "vencida":
        return "bg-dark";
      default:
        return "bg-secondary";
    }
  }

  function renderLatestClients() {
    const tbody = document.getElementById("tablaUltimosClientes");

    if (!tbody) return;

    const clients = storage
      .list("clients")
      .sort((a, b) =>
        String(b.fechaAlta || "").localeCompare(String(a.fechaAlta || ""))
      )
      .slice(0, 3);

    if (!clients.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted py-4">
            Todavía no hay clientes registrados.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = clients
      .map((client) => {
        const estadoClass =
          client.estado === "activo"
            ? "cc-status-activo"
            : "cc-status-inactivo";

        return `
          <tr>
            <td>${utils.escapeHTML(client.nombreComercial || "-")}</td>
            <td>${utils.escapeHTML(client.nit || "-")}</td>
            <td>${utils.escapeHTML(client.regimenTributario || "-")}</td>
            <td>
              <span class="badge ${estadoClass}">
                ${utils.escapeHTML(client.estado || "-")}
              </span>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function renderLatestAlerts() {
    const list = document.getElementById("listaAlertasDashboard");

    if (!list) return;

    const alerts = storage
      .list("alerts")
      .filter((alert) => alert.estado === "pendiente" || alert.estado === "vista")
      .sort((a, b) =>
        String(b.fechaAlerta || "").localeCompare(String(a.fechaAlerta || ""))
      )
      .slice(0, 4);

    if (!alerts.length) {
      list.innerHTML = `
        <li class="list-group-item text-center text-muted py-4">
          Todavía no hay alertas activas.
        </li>
      `;
      return;
    }

    list.innerHTML = alerts
      .map((alert) => {
        const badge = alertBadgeClass(alert.nivel);

        return `
          <li class="list-group-item d-flex justify-content-between align-items-start gap-3">
            <div class="min-w-0">
              <strong class="d-block">${utils.escapeHTML(alert.titulo || "Alerta")}</strong>
              <small class="text-muted d-block">${utils.escapeHTML(alert.mensaje || "")}</small>
              <small class="text-muted">
                ${utils.escapeHTML(utils.formatDate(alert.fechaAlerta))}
              </small>
            </div>
            <span class="badge ${badge} flex-shrink-0">
              ${utils.escapeHTML(alert.nivel || "-")}
            </span>
          </li>
        `;
      })
      .join("");
  }

  function initDashboard() {
    const clients = storage.list("clients");
    const periods = storage.list("periods");
    const documents = storage.list("documents");
    const alerts = storage.list("alerts");
    const transactions = storage.list("transactions");
    const taxes = storage.list("taxes");

    const activeClients = clients.filter((c) => c.estado === "activo");
    const openPeriods = periods.filter((p) => p.estado !== "cerrado");
    const pendingDocuments = documents.filter((d) => d.estado === "pendiente");
    const activeAlerts = alerts.filter(
      (a) => a.estado === "pendiente" || a.estado === "vista"
    );

    const ventas = sumTransactionsByType(transactions, "venta");
    const compras = sumTransactionsByType(transactions, "compra");
    const gastos = sumTransactionsByType(transactions, "gasto");
    const ingresos = sumTransactionsByType(transactions, "ingreso");

    const utilidadEstimada = ventas + ingresos - compras - gastos;
    const impuestosEstimados = sumTaxesEstimated(taxes);

    setText("metricClientes", String(activeClients.length));
    setText("metricPeriodos", String(openPeriods.length));
    setText("metricDocumentos", String(pendingDocuments.length));
    setText("metricAlertas", String(activeAlerts.length));

    setText("resumenVentas", utils.formatMoney(ventas));
    setText("resumenCompras", utils.formatMoney(compras));
    setText("resumenGastos", utils.formatMoney(gastos));
    setText("resumenUtilidad", utils.formatMoney(utilidadEstimada));
    setText("resumenImpuestos", utils.formatMoney(impuestosEstimados));

    renderLatestClients();
    renderLatestAlerts();
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function boot() {
    try {
      if (!cfg || !utils || !storage || !auth || !layout) {
        console.error("Faltan módulos base del sistema.");
        return;
      }

      storage.init();
      storage.ensureSeedAuto();

      const page = document.body.dataset.page || "";
      const authRequired = document.body.dataset.auth === "true";

      if (authRequired) {
        if (!auth.isAuthenticated()) {
          window.location.replace(cfg.routes.login);
          return;
        }

        layout.render();
        layout.setUserLabel();

        if (page === "dashboard") {
          initDashboard();
        }

        return;
      }

      if (page === "login") {
        if (auth.isAuthenticated()) {
          window.location.replace(cfg.routes.dashboard);
          return;
        }

        bindLoginForm();
      }
    } catch (error) {
      console.error("Error inicializando Cuentas Claras:", error);

      if (utils && utils.showToast) {
        utils.showToast(
          "Ocurrió un error al iniciar el prototipo. Revisa la consola.",
          "danger"
        );
      }
    }
  }

  document.addEventListener("DOMContentLoaded", boot);

  return {
    boot
  };
})();