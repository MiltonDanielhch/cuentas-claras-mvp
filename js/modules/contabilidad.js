/* =========================================================
   Cuentas Claras MVP
   Motor contable: transacción -> asiento de doble entrada
   Fase 5
   ========================================================= */

window.CC_CONTABILIDAD = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const bitacora = window.CC_BITACORA;

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  function round2(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }

  function periodLabel(period) {
    if (!period) return "-";
    const name = monthNames[Number(period.mes) - 1] || "Mes inválido";
    return `${name} ${period.anio}`;
  }

  function getClientById(id) {
    return storage.get("clients", id);
  }

  function getPeriodById(id) {
    return storage.get("periods", id);
  }

  function getAccountByCode(code) {
    return storage
      .list("accounts")
      .find(
        (account) =>
          account.codigo === code &&
          account.estado === "activa" &&
          Number(account.nivel) === 3
      ) || null;
  }

  function getAccountNameByCode(code) {
    const account = getAccountByCode(code);
    if (account) return account.nombre;

    const fallback = (cfg.accountCatalog || []).find(
      (item) => item.codigo === code
    );

    return fallback ? fallback.nombre : code;
  }

  function mapAccountCodeByName(name) {
    if (!name) return null;

    const direct = cfg.accountMapping?.[name];
    if (direct) return direct;

    const normalized = String(name).trim().toLowerCase();

    const foundByCatalog = (cfg.accountCatalog || []).find(
      (account) => String(account.nombre).trim().toLowerCase() === normalized
    );

    if (foundByCatalog) return foundByCatalog.codigo;

    const foundByMapping = Object.entries(cfg.accountMapping || {}).find(
      ([key]) => String(key).trim().toLowerCase() === normalized
    );

    return foundByMapping ? foundByMapping[1] : null;
  }

  function paymentAccountFor(formaPago, direction) {
    const safe = String(formaPago || "efectivo").toLowerCase();

    if (safe === "credito" || safe === "crédito") {
      return direction === "venta" ? "1.1.03" : "2.1.01";
    }

    if (["banco", "transferencia", "tarjeta"].includes(safe)) {
      return "1.1.02";
    }

    return "1.1.01";
  }

  function expenseAccountFor(transaction) {
    const mapped = mapAccountCodeByName(transaction.cuenta);

    if (mapped && mapped.startsWith("6.")) {
      return mapped;
    }

    return "6.1.05";
  }

  function isCapitalIngreso(transaction) {
    const cuenta = String(transaction.cuenta || "").toLowerCase();
    const tercero = String(transaction.tercero || "").toLowerCase();
    const observacion = String(transaction.observacion || "").toLowerCase();

    return (
      cuenta.includes("capital") ||
      cuenta.includes("aporte") ||
      tercero.includes("propietario") ||
      observacion.includes("aporte")
    );
  }

  function buildLinesForTransaction(transaction, client) {
    const regimen = client.regimenTributario || "Por definir";
    const esSimplificado = regimen === "Régimen Simplificado";
    const base = round2(transaction.monto);
    const iva = esSimplificado ? 0 : round2(base * (cfg.taxRates.IVA || 0.13));
    const total = round2(base + iva);

    const lines = [];

    if (transaction.tipo === "venta") {
      const cashCode = paymentAccountFor(transaction.formaPago, "venta");

      lines.push({
        cuentaCodigo: cashCode,
        cuentaNombre: getAccountNameByCode(cashCode),
        debito: total,
        credito: 0,
        tercero: transaction.tercero || "",
        referencia: transaction.id,
        observacion: transaction.observacion || ""
      });

      lines.push({
        cuentaCodigo: "4.1.01",
        cuentaNombre: getAccountNameByCode("4.1.01"),
        debito: 0,
        credito: base,
        tercero: transaction.tercero || "",
        referencia: transaction.id,
        observacion: transaction.observacion || ""
      });

      if (iva > 0) {
        lines.push({
          cuentaCodigo: "2.1.02",
          cuentaNombre: getAccountNameByCode("2.1.02"),
          debito: 0,
          credito: iva,
          tercero: "Fisco",
          referencia: transaction.id,
          observacion: "IVA Débito Fiscal"
        });
      }

      return lines;
    }

    if (transaction.tipo === "compra") {
      const cashCode = paymentAccountFor(transaction.formaPago, "pago");

      lines.push({
        cuentaCodigo: "5.1.01",
        cuentaNombre: getAccountNameByCode("5.1.01"),
        debito: base,
        credito: 0,
        tercero: transaction.tercero || "",
        referencia: transaction.id,
        observacion: transaction.observacion || ""
      });

      if (iva > 0) {
        lines.push({
          cuentaCodigo: "1.1.05",
          cuentaNombre: getAccountNameByCode("1.1.05"),
          debito: iva,
          credito: 0,
          tercero: transaction.tercero || "",
          referencia: transaction.id,
          observacion: "IVA Crédito Fiscal"
        });
      }

      lines.push({
        cuentaCodigo: cashCode,
        cuentaNombre: getAccountNameByCode(cashCode),
        debito: 0,
        credito: total,
        tercero: transaction.tercero || "",
        referencia: transaction.id,
        observacion: transaction.observacion || ""
      });

      return lines;
    }

    if (transaction.tipo === "gasto") {
      const cashCode = paymentAccountFor(transaction.formaPago, "pago");
      const expenseCode = expenseAccountFor(transaction);

      lines.push({
        cuentaCodigo: expenseCode,
        cuentaNombre: getAccountNameByCode(expenseCode),
        debito: base,
        credito: 0,
        tercero: transaction.tercero || "",
        referencia: transaction.id,
        observacion: transaction.observacion || ""
      });

      lines.push({
        cuentaCodigo: cashCode,
        cuentaNombre: getAccountNameByCode(cashCode),
        debito: 0,
        credito: base,
        tercero: transaction.tercero || "",
        referencia: transaction.id,
        observacion: transaction.observacion || ""
      });

      return lines;
    }

    if (transaction.tipo === "ingreso") {
      const cashCode = paymentAccountFor(transaction.formaPago, "venta");

      if (isCapitalIngreso(transaction)) {
        lines.push({
          cuentaCodigo: cashCode,
          cuentaNombre: getAccountNameByCode(cashCode),
          debito: base,
          credito: 0,
          tercero: transaction.tercero || "",
          referencia: transaction.id,
          observacion: transaction.observacion || ""
        });

        lines.push({
          cuentaCodigo: "3.1.01",
          cuentaNombre: getAccountNameByCode("3.1.01"),
          debito: 0,
          credito: base,
          tercero: transaction.tercero || "",
          referencia: transaction.id,
          observacion: "Aporte de capital"
        });

        return lines;
      }

      lines.push({
        cuentaCodigo: cashCode,
        cuentaNombre: getAccountNameByCode(cashCode),
        debito: base,
        credito: 0,
        tercero: transaction.tercero || "",
        referencia: transaction.id,
        observacion: transaction.observacion || ""
      });

      lines.push({
        cuentaCodigo: "4.1.02",
        cuentaNombre: getAccountNameByCode("4.1.02"),
        debito: 0,
        credito: base,
        tercero: transaction.tercero || "",
        referencia: transaction.id,
        observacion: transaction.observacion || ""
      });

      return lines;
    }

    return [];
  }

  function validateSquare(lines) {
    const debits = round2(
      lines.reduce((sum, line) => sum + (Number(line.debito) || 0), 0)
    );

    const credits = round2(
      lines.reduce((sum, line) => sum + (Number(line.credito) || 0), 0)
    );

    return Math.abs(debits - credits) <= 0.01;
  }

  function nextFolio(clientId, periodoId) {
    const entries = storage
      .list("journalEntries")
      .filter(
        (entry) =>
          entry.clienteId === clientId &&
          entry.periodoId === periodoId
      );

    const next = entries.length + 1;
    return `D-${utils.pad4(next)}`;
  }

  function createEntryWithLines(entryData, linesData) {
    if (!validateSquare(linesData)) {
      throw new Error("El asiento no cuadra: débitos y créditos deben ser iguales.");
    }

    const entry = storage.create(
      "journalEntries",
      {
        ...entryData,
        estado: entryData.estado || "vigente",
        fechaCreacion: entryData.fechaCreacion || utils.nowISO()
      },
      "JE"
    );

    const savedLines = linesData.map((line) =>
      storage.create(
        "journalLines",
        {
          asientoId: entry.id,
          clienteId: entry.clienteId,
          periodoId: entry.periodoId,
          ...line
        },
        "JL"
      )
    );

    return {
      entry,
      lines: savedLines
    };
  }

  function createAutomaticEntry(transaction) {
    const client = getClientById(transaction.clienteId);
    const period = getPeriodById(transaction.periodoId);

    if (!client) {
      throw new Error("Cliente no encontrado.");
    }

    if (!period) {
      throw new Error("Periodo no encontrado.");
    }

    if (period.estado === "cerrado") {
      throw new Error("No se pueden generar asientos en un periodo cerrado.");
    }

    if (transaction.estado !== "activa") {
      throw new Error("Solo se generan asientos para transacciones activas.");
    }

    if (transaction.journalEntryId) {
      const existing = storage.get("journalEntries", transaction.journalEntryId);

      if (existing && existing.estado === "vigente") {
        return existing;
      }
    }

    const lines = buildLinesForTransaction(transaction, client);

    if (!lines.length) {
      throw new Error("No se pudo construir el asiento para esta transacción.");
    }

    const result = createEntryWithLines(
      {
        folio: nextFolio(transaction.clienteId, transaction.periodoId),
        clienteId: transaction.clienteId,
        periodoId: transaction.periodoId,
        fecha: transaction.fecha,
        tipoAsiento: "operacion",
        categoriaAjuste: null,
        origen: "automatico",
        transaccionId: transaction.id,
        documentoId: transaction.documentoId || null,
        descripcion: `${transaction.tipo.toUpperCase()} · ${transaction.cuenta || ""} · ${utils.formatMoney(transaction.monto)}`,
        estado: "vigente",
        usuarioId: getCurrentUserId(),
        observacion: transaction.observacion || ""
      },
      lines
    );

    storage.update("transactions", transaction.id, {
      journalEntryId: result.entry.id
    });

    if (bitacora) {
      bitacora.log(
        "crear_asiento",
        "journal_entries",
        result.entry.id,
        `Asiento automático generado desde ${transaction.id}`
      );
    }

    return result.entry;
  }

  function generateEntriesForPeriod(clientId, periodoId) {
    const transactions = storage
      .list("transactions")
      .filter(
        (trx) =>
          trx.clienteId === clientId &&
          trx.periodoId === periodoId &&
          trx.estado === "activa" &&
          !trx.journalEntryId
      );

    const created = [];
    const errors = [];

    transactions.forEach((trx) => {
      try {
        const entry = createAutomaticEntry(trx);
        created.push(entry);
      } catch (error) {
        errors.push({
          transactionId: trx.id,
          message: error.message
        });
      }
    });

    if (bitacora) {
      bitacora.log(
        "generar_asientos_automaticos",
        "journal_entries",
        periodoId,
        `Generación automática de asientos. Creados: ${created.length}. Errores: ${errors.length}.`
      );
    }

    return {
      created,
      errors
    };
  }

  function createManualEntry(payload) {
    const client = getClientById(payload.clienteId);
    const period = getPeriodById(payload.periodoId);

    if (!client) {
      throw new Error("Cliente no encontrado.");
    }

    if (!period) {
      throw new Error("Periodo no encontrado.");
    }

    if (period.estado === "cerrado") {
      throw new Error("No se pueden registrar asientos en un periodo cerrado.");
    }

    if (!payload.fecha) {
      throw new Error("La fecha del asiento es obligatoria.");
    }

    const date = utils.parseDateISO(payload.fecha);

    if (Number.isNaN(date.getTime())) {
      throw new Error("La fecha del asiento no es válida.");
    }

    const entryMonth = date.getMonth() + 1;
    const entryYear = date.getFullYear();

    if (
      entryMonth !== Number(period.mes) ||
      entryYear !== Number(period.anio)
    ) {
      throw new Error(
        `La fecha del asiento debe estar dentro del periodo ${periodLabel(period)}.`
      );
    }

    const lines = (payload.lines || []).map((line) => ({
      cuentaCodigo: String(line.cuentaCodigo || "").trim(),
      cuentaNombre: "",
      debito: round2(line.debito),
      credito: round2(line.credito),
      tercero: line.tercero || "",
      referencia: line.referencia || "",
      observacion: line.observacion || ""
    }));

    if (lines.length < 2) {
      throw new Error("Un asiento manual debe tener al menos dos líneas.");
    }

    for (const line of lines) {
      if (!line.cuentaCodigo) {
        throw new Error("Toda línea debe seleccionar una cuenta contable.");
      }

      const account = getAccountByCode(line.cuentaCodigo);

      if (!account) {
        throw new Error(`La cuenta ${line.cuentaCodigo} no existe o no está activa.`);
      }

      line.cuentaNombre = account.nombre;

      const hasDebit = Number(line.debito) > 0;
      const hasCredit = Number(line.credito) > 0;

      if (hasDebit && hasCredit) {
        throw new Error("Una línea no puede tener débito y crédito al mismo tiempo.");
      }

      if (!hasDebit && !hasCredit) {
        throw new Error("Cada línea debe tener un débito o un crédito mayor que cero.");
      }
    }

    const result = createEntryWithLines(
      {
        folio: nextFolio(payload.clienteId, payload.periodoId),
        clienteId: payload.clienteId,
        periodoId: payload.periodoId,
        fecha: payload.fecha,
        tipoAsiento: payload.tipoAsiento || "operacion",
        categoriaAjuste: payload.categoriaAjuste || null,
        origen: "manual",
        transaccionId: null,
        documentoId: payload.documentoId || null,
        descripcion: payload.descripcion || "Asiento manual",
        estado: "vigente",
        usuarioId: getCurrentUserId(),
        observacion: payload.observacion || ""
      },
      lines
    );

    if (bitacora) {
      bitacora.log(
        "crear_asiento",
        "journal_entries",
        result.entry.id,
        `Asiento manual creado: ${result.entry.descripcion}`
      );
    }

    return result.entry;
  }

  function voidEntry(entryId) {
    const entry = storage.get("journalEntries", entryId);

    if (!entry) {
      throw new Error("Asiento no encontrado.");
    }

    if (entry.estado === "anulado") {
      return entry;
    }

    const period = getPeriodById(entry.periodoId);

    if (!period || period.estado === "cerrado") {
      throw new Error("No se puede anular un asiento de un periodo cerrado.");
    }

    const updated = storage.update("journalEntries", entryId, {
      estado: "anulado"
    });

    if (entry.transaccionId) {
      storage.update("transactions", entry.transaccionId, {
        journalEntryId: null
      });
    }

    if (bitacora) {
      bitacora.log(
        "anular_asiento",
        "journal_entries",
        entryId,
        `Asiento ${entry.folio || entryId} anulado`
      );
    }

    return updated;
  }

  function getEntries(filters = {}) {
    let data = storage.list("journalEntries");

    if (filters.clienteId) {
      data = data.filter((entry) => entry.clienteId === filters.clienteId);
    }

    if (filters.periodoId) {
      data = data.filter((entry) => entry.periodoId === filters.periodoId);
    }

    if (filters.tipoAsiento) {
      data = data.filter((entry) => entry.tipoAsiento === filters.tipoAsiento);
    }

    if (filters.origen) {
      data = data.filter((entry) => entry.origen === filters.origen);
    }

    if (filters.estado) {
      data = data.filter((entry) => entry.estado === filters.estado);
    }

    if (filters.search) {
      const search = String(filters.search).toLowerCase();

      data = data.filter((entry) => {
        const haystack = [
          entry.id,
          entry.folio,
          entry.descripcion,
          entry.observacion,
          entry.transaccionId,
          entry.documentoId
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      });
    }

    return data.sort((a, b) => {
      const dateA = String(a.fecha || "");
      const dateB = String(b.fecha || "");

      if (dateA !== dateB) {
        return dateA.localeCompare(dateB);
      }

      return String(a.folio || a.id).localeCompare(String(b.folio || b.id));
    });
  }

  function getLinesForEntry(entryId) {
    return storage
      .list("journalLines")
      .filter((line) => line.asientoId === entryId)
      .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  }

  function getEntryDetail(entryId) {
    const entry = storage.get("journalEntries", entryId);

    if (!entry) return null;

    return {
      entry,
      lines: getLinesForEntry(entryId)
    };
  }

  function getPendingTransactions(clientId, periodoId) {
    return storage
      .list("transactions")
      .filter(
        (trx) =>
          trx.clienteId === clientId &&
          trx.periodoId === periodoId &&
          trx.estado === "activa" &&
          !trx.journalEntryId
      );
  }

  function getCurrentUserId() {
    const session = window.CC_AUTH ? window.CC_AUTH.getSession() : null;
    return session ? session.userId : "SYSTEM";
  }

  function summarizeEntry(entryId) {
    const lines = getLinesForEntry(entryId);

    const debito = round2(
      lines.reduce((sum, line) => sum + (Number(line.debito) || 0), 0)
    );

    const credito = round2(
      lines.reduce((sum, line) => sum + (Number(line.credito) || 0), 0)
    );

    return {
      debito,
      credito,
      cuadrado: Math.abs(debito - credito) <= 0.01
    };
  }

  return {
    round2,
    getAccountByCode,
    getAccountNameByCode,
    mapAccountCodeByName,
    buildLinesForTransaction,
    validateSquare,
    createAutomaticEntry,
    generateEntriesForPeriod,
    createManualEntry,
    voidEntry,
    getEntries,
    getLinesForEntry,
    getEntryDetail,
    getPendingTransactions,
    summarizeEntry,
    periodLabel
  };
})();