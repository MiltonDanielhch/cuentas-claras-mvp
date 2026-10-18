/* =========================================================
   Cuentas Claras MVP
   Motor de cálculo del Libro Mayor, Balanza de comprobación,
   Balanza ajustada y base para Estados Financieros
   Fase 8
   ----------------------------------------------------------------
   Principio: Mayor y Balanza NO se persisten. Se calculan en vivo
   desde cc_journal_lines considerando solo asientos "vigente".

   Reglas:
   - Balanza de comprobación: excluye ajustes y excluye cierres.
   - Balanza ajustada: incluye ajustes y excluye cierres.
   - Estados Financieros: usan balanza ajustada y excluyen cierres.
   - Libro Mayor: puede mostrar todo, incluidos cierres.
   ========================================================= */

window.CC_MAYOR_BALANZA = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  function round2(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }

  function periodKey(period) {
    if (!period) return 0;
    return Number(period.anio) * 100 + Number(period.mes);
  }

  function periodLabel(period) {
    if (!period) return "-";
    const name = monthNames[Number(period.mes) - 1] || "Mes inválido";
    return `${name} ${period.anio}`;
  }

  /* ---------------------------------------------------------
     Asegura que el plan de cuentas exista en LocalStorage
     --------------------------------------------------------- */
  function ensureAccounts() {
    const accounts = storage.list("accounts");
    if (accounts.length > 0) return;

    (cfg.accountCatalog || []).forEach((account) => {
      storage.create("accounts", { ...account }, "ACC");
    });

    if (window.CC_BITACORA) {
      window.CC_BITACORA.log(
        "cargar_plan_cuentas",
        "accounts",
        null,
        "Plan de cuentas inicial migrado desde configuración (Fase 8)"
      );
    }
  }

  /* ---------------------------------------------------------
     Contexto del cliente: periodos, asientos vigentes, líneas
     --------------------------------------------------------- */
  function buildContext(clientId) {
    const periods = storage
      .list("periods")
      .filter((p) => p.clienteId === clientId);

    const periodMap = {};
    periods.forEach((p) => {
      periodMap[p.id] = p;
    });

    const entries = storage
      .list("journalEntries")
      .filter((e) => e.clienteId === clientId && e.estado === "vigente");

    const entryMap = {};
    const validEntryIds = new Set();
    entries.forEach((e) => {
      entryMap[e.id] = e;
      validEntryIds.add(e.id);
    });

    const lines = storage
      .list("journalLines")
      .filter(
        (l) =>
          l.clienteId === clientId &&
          validEntryIds.has(l.asientoId)
      )
      .map((l) => {
        const p = periodMap[l.periodoId];
        const e = entryMap[l.asientoId];

        return {
          ...l,
          periodKey: p ? periodKey(p) : 0,
          fecha: e ? e.fecha : "",
          folio: e ? e.folio : "",
          entryType: e ? e.tipoAsiento : "",
          isAdjustment: e ? e.tipoAsiento === "ajuste" : false,
          isClosing: e ? e.tipoAsiento === "cierre" : false
        };
      });

    return { clientId, periods, periodMap, entries, entryMap, lines };
  }

  function getAccountsMap() {
    const map = {};
    storage
      .list("accounts")
      .filter((a) => Number(a.nivel) === 3 && a.estado === "activa")
      .forEach((a) => {
        map[a.codigo] = a;
      });
    return map;
  }

  /* ---------------------------------------------------------
     Totales por cuenta sobre un conjunto de líneas
     --------------------------------------------------------- */
  function sumTotalsForLines(lines, accountCode, currentKey) {
    let debBefore = 0, credBefore = 0;
    let debPeriod = 0, credPeriod = 0;
    let debAcum = 0, credAcum = 0;

    lines.forEach((l) => {
      if (l.cuentaCodigo !== accountCode) return;

      const d = Number(l.debito) || 0;
      const c = Number(l.credito) || 0;

      if (l.periodKey <= currentKey) {
        debAcum += d;
        credAcum += c;
      }

      if (l.periodKey < currentKey) {
        debBefore += d;
        credBefore += c;
      }

      if (l.periodKey === currentKey) {
        debPeriod += d;
        credPeriod += c;
      }
    });

    return {
      debBefore: round2(debBefore),
      credBefore: round2(credBefore),
      debPeriod: round2(debPeriod),
      credPeriod: round2(credPeriod),
      debAcum: round2(debAcum),
      credAcum: round2(credAcum)
    };
  }

  function computeAccountTotals(ctx, accountCode, currentKey) {
    return sumTotalsForLines(ctx.lines, accountCode, currentKey);
  }

  function signedBalance(nature, debit, credit) {
    return nature === "deudora"
      ? round2(debit - credit)
      : round2(credit - debit);
  }

  /* ---------------------------------------------------------
     Resumen por cuenta para Libro Mayor
     El Mayor muestra todos los asientos vigentes, incluidos ajustes y cierres.
     --------------------------------------------------------- */
  function getAccountSummaryRows(ctx, accountsMap, currentKey) {
    const rows = [];

    Object.keys(accountsMap).forEach((code) => {
      const account = accountsMap[code];
      const t = computeAccountTotals(ctx, code, currentKey);

      const opening = signedBalance(account.naturaleza, t.debBefore, t.credBefore);
      const movementEffect =
        account.naturaleza === "deudora"
          ? round2(t.debPeriod - t.credPeriod)
          : round2(t.credPeriod - t.debPeriod);
      const closing = round2(opening + movementEffect);

      const hasPeriod = t.debPeriod > 0 || t.credPeriod > 0;
      const hasBalance = Math.abs(closing) > 0.005 || Math.abs(opening) > 0.005;

      if (!hasPeriod && !hasBalance) return;

      rows.push({
        codigo: code,
        nombre: account.nombre,
        tipo: account.tipo,
        naturaleza: account.naturaleza,
        esContra: !!account.esContra,
        esTemporal: !!account.esTemporal,
        saldoInicial: opening,
        debitos: t.debPeriod,
        creditos: t.credPeriod,
        saldoFinal: closing
      });
    });

    rows.sort((a, b) => String(a.codigo).localeCompare(String(b.codigo)));
    return rows;
  }

  /* ---------------------------------------------------------
     Ficha de Mayor con saldo corrido
     --------------------------------------------------------- */
  function getLedger(ctx, accountsMap, accountCode, currentKey) {
    const account = accountsMap[accountCode];
    if (!account) return null;

    const t = computeAccountTotals(ctx, accountCode, currentKey);
    const opening = signedBalance(account.naturaleza, t.debBefore, t.credBefore);

    const periodLines = ctx.lines
      .filter(
        (l) =>
          l.cuentaCodigo === accountCode &&
          l.periodKey === currentKey
      )
      .sort((a, b) => {
        const fa = String(a.fecha || "");
        const fb = String(b.fecha || "");
        if (fa !== fb) return fa.localeCompare(fb);
        return String(a.folio || a.id).localeCompare(String(b.folio || b.id));
      });

    let running = opening;
    const rows = periodLines.map((l) => {
      const effect =
        account.naturaleza === "deudora"
          ? round2((Number(l.debito) || 0) - (Number(l.credito) || 0))
          : round2((Number(l.credito) || 0) - (Number(l.debito) || 0));
      running = round2(running + effect);

      return {
        fecha: l.fecha,
        folio: l.folio,
        asientoId: l.asientoId,
        referencia: l.referencia || "",
        tercero: l.tercero || "",
        debito: round2(l.debito),
        credito: round2(l.credito),
        saldo: running,
        observacion: l.observacion || "",
        isAdjustment: !!l.isAdjustment,
        isClosing: !!l.isClosing
      };
    });

    return {
      account,
      naturaleza: account.naturaleza,
      saldoInicial: opening,
      debitos: t.debPeriod,
      creditos: t.credPeriod,
      saldoFinal: running,
      rows
    };
  }

  /* ---------------------------------------------------------
     Balanza:
     - includeAdjustments = false -> Balanza de comprobación
     - includeAdjustments = true  -> Balanza ajustada
     - includeClosing = false     -> excluye asientos de cierre
     --------------------------------------------------------- */
  function getTrialBalance(ctx, accountsMap, currentKey, options = {}) {
    const includeAdjustments = options.includeAdjustments === true;
    const includeClosing = options.includeClosing === true;

    let lines = ctx.lines;

    if (!includeAdjustments) {
      lines = lines.filter((l) => !l.isAdjustment);
    }

    if (!includeClosing) {
      lines = lines.filter((l) => !l.isClosing);
    }

    const rows = [];
    let totDebPeriod = 0;
    let totCredPeriod = 0;
    let totSaldoDeudor = 0;
    let totSaldoAcreedor = 0;

    Object.keys(accountsMap).forEach((code) => {
      const account = accountsMap[code];
      const t = sumTotalsForLines(lines, code, currentKey);

      const netDeudor = round2(t.debAcum - t.credAcum);
      const netAcreedor = round2(t.credAcum - t.debAcum);

      let saldoDeudor = 0;
      let saldoAcreedor = 0;

      if (account.naturaleza === "deudora") {
        if (netDeudor >= 0) saldoDeudor = netDeudor;
        else saldoAcreedor = round2(-netDeudor);
      } else {
        if (netAcreedor >= 0) saldoAcreedor = netAcreedor;
        else saldoDeudor = round2(-netAcreedor);
      }

      const hasPeriod = t.debPeriod > 0 || t.credPeriod > 0;
      const hasBalance = Math.abs(saldoDeudor) > 0.005 || Math.abs(saldoAcreedor) > 0.005;

      if (!hasPeriod && !hasBalance) return;

      rows.push({
        codigo: code,
        nombre: account.nombre,
        tipo: account.tipo,
        naturaleza: account.naturaleza,
        esContra: !!account.esContra,
        esTemporal: !!account.esTemporal,
        debitos: t.debPeriod,
        creditos: t.credPeriod,
        saldoDeudor: round2(saldoDeudor),
        saldoAcreedor: round2(saldoAcreedor)
      });

      totDebPeriod += t.debPeriod;
      totCredPeriod += t.credPeriod;
      totSaldoDeudor += saldoDeudor;
      totSaldoAcreedor += saldoAcreedor;
    });

    rows.sort((a, b) => String(a.codigo).localeCompare(String(b.codigo)));

    const movementsBalanced =
      Math.abs(round2(totDebPeriod) - round2(totCredPeriod)) <= 0.01;
    const balancesBalanced =
      Math.abs(round2(totSaldoDeudor) - round2(totSaldoAcreedor)) <= 0.01;

    const adjustmentLinesInPeriod = ctx.lines.filter(
      (l) => l.isAdjustment && l.periodKey === currentKey
    ).length;

    const closingLinesInPeriod = ctx.lines.filter(
      (l) => l.isClosing && l.periodKey === currentKey
    ).length;

    return {
      rows,
      totals: {
        debitos: round2(totDebPeriod),
        creditos: round2(totCredPeriod),
        saldoDeudor: round2(totSaldoDeudor),
        saldoAcreedor: round2(totSaldoAcreedor)
      },
      movementsBalanced,
      balancesBalanced,
      includeAdjustments,
      includeClosing,
      adjustmentLinesInPeriod,
      closingLinesInPeriod
    };
  }

  /* ---------------------------------------------------------
     Utilidades de selección
     --------------------------------------------------------- */
  function getClientsWithPeriods() {
    const clients = storage.list("clients");
    const periods = storage.list("periods");
    const clientIds = new Set(periods.map((p) => p.clienteId));
    return clients.filter((c) => clientIds.has(c.id));
  }

  function getPeriodsForClient(clientId) {
    return storage
      .list("periods")
      .filter((p) => p.clienteId === clientId)
      .sort((a, b) => periodKey(b) - periodKey(a));
  }

  return {
    round2,
    periodKey,
    periodLabel,
    monthNames,
    ensureAccounts,
    buildContext,
    getAccountsMap,
    computeAccountTotals,
    getAccountSummaryRows,
    getLedger,
    getTrialBalance,
    getClientsWithPeriods,
    getPeriodsForClient
  };
})();