/* =========================================================
   Cuentas Claras MVP
   Acceso a LocalStorage
   Versión contable completa: Fase 5
   ========================================================= */

window.CC_STORAGE = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;

  const collections = {
    users: cfg.keys.users,
    clients: cfg.keys.clients,
    periods: cfg.keys.periods,
    documents: cfg.keys.documents,
    transactions: cfg.keys.transactions,
    taxes: cfg.keys.taxes,
    obligations: cfg.keys.obligations,
    accounts: cfg.keys.accounts,
    journalEntries: cfg.keys.journalEntries,
    journalLines: cfg.keys.journalLines,
    fixedAssets: cfg.keys.fixedAssets,
    financialSnapshots: cfg.keys.financialSnapshots,
    alerts: cfg.keys.alerts,
    reports: cfg.keys.reports,
    logs: cfg.keys.logs
  };

  const prefixByCollection = {
    users: "USR",
    clients: "CLI",
    periods: "PER",
    documents: "DOC",
    transactions: "TRX",
    taxes: "IMP",
    obligations: "OBL",
    accounts: "ACC",
    journalEntries: "JE",
    journalLines: "JL",
    fixedAssets: "FA",
    financialSnapshots: "FS",
    alerts: "ALR",
    reports: "REP",
    logs: "LOG"
  };

  /* ---------------------------------------------------------
     Lectura / escritura base
     --------------------------------------------------------- */
  function read(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.error(`Error leyendo ${key}:`, error);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error escribiendo ${key}:`, error);

      if (utils && utils.showToast) {
        utils.showToast(
          "No se pudo guardar la información. Revisa el almacenamiento del navegador.",
          "danger"
        );
      }

      return false;
    }
  }

  /* ---------------------------------------------------------
     Configuración por defecto
     --------------------------------------------------------- */
  function defaultSettings() {
    return {
      appName: cfg.appName,
      appVersion: cfg.version,
      storageVersion: cfg.storageVersion,
      currency: cfg.currency,
      country: "Bolivia",
      department: "Beni",
      city: "Trinidad",
      taxRates: cfg.taxRates,
      genericDueDay: cfg.genericDueDay,
      alertDaysBefore: cfg.alertDaysBefore,
      urgentDaysBefore: cfg.urgentDaysBefore,
      depreciationMethod: cfg.depreciationMethod,
      inventoryMethod: cfg.inventoryMethod,
      seedLoaded: false,
      lastBackupAt: null,
      professionalDisclaimer: cfg.messages.professionalDisclaimer,
      accountingInfoDisclaimer: cfg.messages.accountingInfoDisclaimer
    };
  }

  /* ---------------------------------------------------------
     Inicialización
     --------------------------------------------------------- */
  function init() {
    if (localStorage.getItem(cfg.keys.version) === null) {
      write(cfg.keys.version, cfg.storageVersion);
    }

    if (localStorage.getItem(cfg.keys.settings) === null) {
      write(cfg.keys.settings, defaultSettings());
    }

    if (localStorage.getItem(cfg.keys.counters) === null) {
      write(cfg.keys.counters, {});
    }

    Object.values(collections).forEach((key) => {
      if (localStorage.getItem(key) === null) {
        write(key, []);
      }
    });
  }

  /* ---------------------------------------------------------
     Operaciones por colección
     --------------------------------------------------------- */
  function list(name) {
    const key = collections[name];
    if (!key) return [];

    const data = read(key, []);
    return Array.isArray(data) ? data : [];
  }

  function setList(name, data) {
    const key = collections[name];
    if (!key) return false;

    return write(key, Array.isArray(data) ? data : []);
  }

  function get(name, id) {
    return list(name).find((item) => item.id === id) || null;
  }

  function nextId(prefix) {
    const p = String(prefix || "REC").toUpperCase();
    const counters = read(cfg.keys.counters, {});
    const current = Number(counters[p]) || 0;
    const next = current + 1;

    counters[p] = next;
    write(cfg.keys.counters, counters);

    return utils.makeId(p, next);
  }

  function create(name, item, prefix) {
    const p = prefix || prefixByCollection[name] || "REC";
    const id = item.id || nextId(p);

    const record = {
      id,
      ...item
    };

    const data = list(name);
    data.push(record);
    setList(name, data);

    return record;
  }

  function update(name, id, updates) {
    const data = list(name);
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) return null;

    data[index] = {
      ...data[index],
      ...updates,
      id
    };

    setList(name, data);
    return data[index];
  }

  /* ---------------------------------------------------------
     Configuración
     --------------------------------------------------------- */
  function getSetting() {
    return read(cfg.keys.settings, defaultSettings());
  }

  function setSetting(updates) {
    const current = getSetting();
    const next = {
      ...current,
      ...updates
    };

    write(cfg.keys.settings, next);
    return next;
  }

  /* ---------------------------------------------------------
     Contadores
     --------------------------------------------------------- */
  function getCounters() {
    return read(cfg.keys.counters, {});
  }

  function setCounters(counters) {
    return write(cfg.keys.counters, counters || {});
  }

  function recalcCounters() {
    const counters = {};

    Object.entries(collections).forEach(([name, key]) => {
      const prefix = prefixByCollection[name];
      const data = read(key, []);

      let max = 0;

      (Array.isArray(data) ? data : []).forEach((item) => {
        if (!item || !item.id) return;

        const parts = String(item.id).split("-");
        if (parts.length !== 2) return;

        const num = Number(parts[1]);
        if (Number.isFinite(num) && num > max) {
          max = num;
        }
      });

      counters[prefix] = max;
    });

    setCounters(counters);
    return counters;
  }

  /* ---------------------------------------------------------
     Exportar / importar
     --------------------------------------------------------- */
  function exportAll() {
    return {
      app: cfg.appName,
      version: cfg.storageVersion,
      exportedAt: utils.nowISO(),
      data: {
        users: list("users"),
        clients: list("clients"),
        periods: list("periods"),
        documents: list("documents"),
        transactions: list("transactions"),
        taxes: list("taxes"),
        obligations: list("obligations"),
        accounts: list("accounts"),
        journalEntries: list("journalEntries"),
        journalLines: list("journalLines"),
        fixedAssets: list("fixedAssets"),
        financialSnapshots: list("financialSnapshots"),
        alerts: list("alerts"),
        reports: list("reports"),
        logs: list("logs"),
        settings: getSetting(),
        counters: getCounters()
      }
    };
  }

  function mergeCollection(name, incoming) {
    const current = list(name);
    const map = new Map(current.map((item) => [item.id, item]));

    (Array.isArray(incoming) ? incoming : []).forEach((item) => {
      if (!item || !item.id) return;

      map.set(item.id, {
        ...(map.get(item.id) || {}),
        ...item
      });
    });

    setList(name, Array.from(map.values()));
  }

  function normalizeImportPayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("El respaldo no tiene un formato válido.");
    }

    if (!payload.data || typeof payload.data !== "object") {
      throw new Error("El respaldo no contiene la sección data.");
    }

    const d = payload.data;

    return {
      version: Number(payload.version) || 1,
      data: {
        users: d.users || [],
        clients: d.clients || [],
        periods: d.periods || [],
        documents: d.documents || [],
        transactions: d.transactions || [],
        taxes: d.taxes || [],
        obligations: d.obligations || [],
        accounts: d.accounts || [],
        journalEntries: d.journalEntries || [],
        journalLines: d.journalLines || [],
        fixedAssets: d.fixedAssets || [],
        financialSnapshots: d.financialSnapshots || [],
        alerts: d.alerts || [],
        reports: d.reports || [],
        logs: d.logs || [],
        settings: d.settings || defaultSettings(),
        counters: d.counters || {}
      }
    };
  }

  function importAll(rawPayload, replace = true) {
    const payload = normalizeImportPayload(rawPayload);
    const d = payload.data;

    if (replace) {
      setList("users", d.users);
      setList("clients", d.clients);
      setList("periods", d.periods);
      setList("documents", d.documents);
      setList("transactions", d.transactions);
      setList("taxes", d.taxes);
      setList("obligations", d.obligations);
      setList("accounts", d.accounts);
      setList("journalEntries", d.journalEntries);
      setList("journalLines", d.journalLines);
      setList("fixedAssets", d.fixedAssets);
      setList("financialSnapshots", d.financialSnapshots);
      setList("alerts", d.alerts);
      setList("reports", d.reports);
      setList("logs", d.logs);

      write(cfg.keys.settings, d.settings || defaultSettings());
      write(cfg.keys.counters, d.counters || {});
    } else {
      mergeCollection("users", d.users);
      mergeCollection("clients", d.clients);
      mergeCollection("periods", d.periods);
      mergeCollection("documents", d.documents);
      mergeCollection("transactions", d.transactions);
      mergeCollection("taxes", d.taxes);
      mergeCollection("obligations", d.obligations);
      mergeCollection("accounts", d.accounts);
      mergeCollection("journalEntries", d.journalEntries);
      mergeCollection("journalLines", d.journalLines);
      mergeCollection("fixedAssets", d.fixedAssets);
      mergeCollection("financialSnapshots", d.financialSnapshots);
      mergeCollection("alerts", d.alerts);
      mergeCollection("reports", d.reports);
      mergeCollection("logs", d.logs);

      const settings = {
        ...getSetting(),
        ...(d.settings || {})
      };

      write(cfg.keys.settings, settings);

      const counters = getCounters();
      const importedCounters = d.counters || {};

      Object.entries(importedCounters).forEach(([prefix, value]) => {
        counters[prefix] = Math.max(
          Number(counters[prefix]) || 0,
          Number(value) || 0
        );
      });

      setCounters(counters);
    }

    return true;
  }

  /* ---------------------------------------------------------
     Reset
     --------------------------------------------------------- */
  function reset(keepSession = false) {
    const session = keepSession
      ? localStorage.getItem(cfg.keys.session)
      : null;

    Object.values(cfg.keys).forEach((key) => {
      localStorage.removeItem(key);
    });

    if (session) {
      localStorage.setItem(cfg.keys.session, session);
    }

    init();
  }

  /* ---------------------------------------------------------
     Datos semilla
     --------------------------------------------------------- */
  function loadSeed(force = false) {
    const seed = window.CC_SEED;

    if (!seed) {
      console.warn("No se encontró CC_SEED.");
      return false;
    }

    if (!force && list("users").length > 0) {
      return false;
    }

    setList("users", seed.users || []);
    setList("clients", seed.clients || []);
    setList("periods", seed.periods || []);
    setList("documents", seed.documents || []);
    setList("transactions", seed.transactions || []);
    setList("taxes", seed.taxes || []);
    setList("obligations", seed.obligations || []);
    setList("accounts", seed.accounts || []);
    setList("journalEntries", seed.journalEntries || []);
    setList("journalLines", seed.journalLines || []);
    setList("fixedAssets", seed.fixedAssets || []);
    setList("financialSnapshots", seed.financialSnapshots || []);
    setList("alerts", seed.alerts || []);
    setList("reports", seed.reports || []);
    setList("logs", seed.logs || []);

    write(cfg.keys.counters, seed.counters || {});

    const settings = {
      ...defaultSettings(),
      ...(seed.settings || {}),
      seedLoaded: true
    };

    write(cfg.keys.settings, settings);

    return true;
  }

  function ensureSeedAuto() {
    if (cfg.autoSeedOnFirstRun && list("users").length === 0) {
      return loadSeed(false);
    }

    return false;
  }

  /* ---------------------------------------------------------
     Sesión
     --------------------------------------------------------- */
  function getSessionRaw() {
    return read(cfg.keys.session, null);
  }

  function setSessionRaw(session) {
    return write(cfg.keys.session, session);
  }

  function clearSessionRaw() {
    localStorage.removeItem(cfg.keys.session);
  }

  return {
    init,
    list,
    setList,
    get,
    create,
    update,
    nextId,
    getSetting,
    setSetting,
    getCounters,
    setCounters,
    recalcCounters,
    exportAll,
    importAll,
    reset,
    loadSeed,
    ensureSeedAuto,
    getSessionRaw,
    setSessionRaw,
    clearSessionRaw,
    collections,
    prefixByCollection
  };
})();