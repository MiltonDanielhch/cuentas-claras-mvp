/* =========================================================
   Cuentas Claras MVP
   Módulo de cierre contable del periodo
   Fase 8
   ========================================================= */

window.CC_CIERRE = (function () {
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const contabilidad = window.CC_CONTABILIDAD;
  const motor = window.CC_MAYOR_BALANZA;
  const bitacora = window.CC_BITACORA;

  function round2(value) {
    return motor && motor.round2
      ? motor.round2(value)
      : Math.round((Number(value) || 0) * 100) / 100;
  }

  function periodEndISO(period) {
    if (!period) return utils.todayISO();
    const d = new Date(Number(period.anio), Number(period.mes), 0);
    return `${d.getFullYear()}-${utils.pad2(d.getMonth() + 1)}-${utils.pad2(d.getDate())}`;
  }

  function getClosingEntries(periodoId) {
    return storage
      .list("journalEntries")
      .filter(
        (e) =>
          e.periodoId === periodoId &&
          e.tipoAsiento === "cierre"
      );
  }

  function hasVigenteClosingEntry(periodoId) {
    return getClosingEntries(periodoId).some((e) => e.estado === "vigente");
  }

  function getVigenteClosingEntry(periodoId) {
    return getClosingEntries(periodoId).find((e) => e.estado === "vigente") || null;
  }

  function generateClosingEntry(clientId, periodoId) {
    if (!contabilidad) {
      throw new Error("No se encontró el motor contable CC_CONTABILIDAD.");
    }

    if (!motor) {
      throw new Error("No se encontró el motor CC_MAYOR_BALANZA.");
    }

    const period = storage.get("periods", periodoId);

    if (!period) {
      throw new Error("Periodo no encontrado.");
    }

    if (period.clienteId !== clientId) {
      throw new Error("El periodo no pertenece al cliente seleccionado.");
    }

    const existing = getVigenteClosingEntry(periodoId);
    if (existing) {
      return existing;
    }

    motor.ensureAccounts();

    const ctx = motor.buildContext(clientId);
    const accountsMap = motor.getAccountsMap();
    const currentKey = motor.periodKey(period);

    const balances = motor.getTrialBalance(ctx, accountsMap, currentKey, {
      includeAdjustments: true,
      includeClosing: false
    });

    const lines = [];
    let resultToExercise = 0;

    balances.rows.forEach((row) => {
      const account = accountsMap[row.codigo];

      if (!account || !account.esTemporal) return;
      if (row.codigo === "3.1.03") return;

      const netPeriod = round2((Number(row.debitos) || 0) - (Number(row.creditos) || 0));

      if (Math.abs(netPeriod) <= 0.01) return;

      if (netPeriod > 0) {
        // Cuenta con saldo deudor: gastos, costos, cuentas temporales deudoras.
        lines.push({
          cuentaCodigo: "3.1.03",
          debito: netPeriod,
          credito: 0,
          tercero: "Cierre contable",
          referencia: row.codigo,
          observacion: `Cierre de cuenta deudora ${row.codigo} - ${row.nombre}`
        });

        lines.push({
          cuentaCodigo: row.codigo,
          debito: 0,
          credito: netPeriod,
          tercero: "Cierre contable",
          referencia: "3.1.03",
          observacion: `Cierre de cuenta deudora ${row.codigo} - ${row.nombre}`
        });

        resultToExercise = round2(resultToExercise - netPeriod);
      } else {
        // Cuenta con saldo acreedor: ingresos, cuentas temporales acreedoras o compensadoras.
        const amount = round2(-netPeriod);

        lines.push({
          cuentaCodigo: row.codigo,
          debito: amount,
          credito: 0,
          tercero: "Cierre contable",
          referencia: "3.1.03",
          observacion: `Cierre de cuenta acreedora ${row.codigo} - ${row.nombre}`
        });

        lines.push({
          cuentaCodigo: "3.1.03",
          debito: 0,
          credito: amount,
          tercero: "Cierre contable",
          referencia: row.codigo,
          observacion: `Cierre de cuenta acreedora ${row.codigo} - ${row.nombre}`
        });

        resultToExercise = round2(resultToExercise + amount);
      }
    });

    if (Math.abs(resultToExercise) > 0.01) {
      if (resultToExercise > 0) {
        // Utilidad: Results del ejercicio queda acreedor, se cierra contra Resultados acumulados.
        lines.push({
          cuentaCodigo: "3.1.03",
          debito: resultToExercise,
          credito: 0,
          tercero: "Cierre contable",
          referencia: "3.1.02",
          observacion: "Traslado de utilidad del periodo a resultados acumulados"
        });

        lines.push({
          cuentaCodigo: "3.1.02",
          debito: 0,
          credito: resultToExercise,
          tercero: "Cierre contable",
          referencia: "3.1.03",
          observacion: "Traslado de utilidad del periodo a resultados acumulados"
        });
      } else {
        // Pérdida.
        const amount = round2(-resultToExercise);

        lines.push({
          cuentaCodigo: "3.1.02",
          debito: amount,
          credito: 0,
          tercero: "Cierre contable",
          referencia: "3.1.03",
          observacion: "Traslado de pérdida del periodo a resultados acumulados"
        });

        lines.push({
          cuentaCodigo: "3.1.03",
          debito: 0,
          credito: amount,
          tercero: "Cierre contable",
          referencia: "3.1.02",
          observacion: "Traslado de pérdida del periodo a resultados acumulados"
        });
      }
    }

    if (lines.length < 2) {
      return null;
    }

    const entry = contabilidad.createManualEntry({
      clienteId: clientId,
      periodoId: periodoId,
      fecha: periodEndISO(period),
      tipoAsiento: "cierre",
      categoriaAjuste: null,
      documentoId: null,
      descripcion: `Cierre contable ${motor.periodLabel(period)}`,
      observacion: `cierre:${periodoId}`,
      lines
    });

    if (bitacora) {
      bitacora.log(
        "generar_cierre",
        "journal_entries",
        entry.id,
        `Asiento de cierre generado para periodo ${periodoId}`
      );
    }

    return entry;
  }

  function closePeriod(clientId, periodoId) {
    const period = storage.get("periods", periodoId);

    if (!period) {
      throw new Error("Periodo no encontrado.");
    }

    if (period.clienteId !== clientId) {
      throw new Error("El periodo no pertenece al cliente seleccionado.");
    }

    if (period.estado === "cerrado") {
      throw new Error("El periodo ya está cerrado.");
    }

    const entry = generateClosingEntry(clientId, periodoId);

    const updated = storage.update("periods", periodoId, {
      estado: "cerrado",
      fechaCierre: utils.todayISO(),
      closedAt: utils.nowISO(),
      closingEntryId: entry ? entry.id : null
    });

    if (bitacora) {
      bitacora.log(
        "cerrar_periodo_contable",
        "periods",
        periodoId,
        `Cierre contable del periodo ${motor ? motor.periodLabel(period) : periodoId}. Asiento de cierre: ${entry ? entry.id : "no requerido"}.`
      );
    }

    return {
      entry,
      period: updated
    };
  }

  function reopenPeriod(periodoId) {
    const period = storage.get("periods", periodoId);

    if (!period) {
      throw new Error("Periodo no encontrado.");
    }

    if (period.estado !== "cerrado") {
      throw new Error("Solo se pueden reabrir periodos cerrados.");
    }

    const closingEntries = getClosingEntries(periodoId).filter(
      (e) => e.estado === "vigente"
    );

    closingEntries.forEach((entry) => {
      storage.update("journalEntries", entry.id, {
        estado: "anulado"
      });

      if (bitacora) {
        bitacora.log(
          "anular_asiento_cierre",
          "journal_entries",
          entry.id,
          `Asiento de cierre ${entry.folio || entry.id} anulado por reapertura del periodo ${periodoId}`
        );
      }
    });

    const updated = storage.update("periods", periodoId, {
      estado: "abierto",
      fechaCierre: null,
      closedAt: null,
      closingEntryId: null
    });

    if (bitacora) {
      bitacora.log(
        "reabrir_periodo_contable",
        "periods",
        periodoId,
        `Reapertura contable del periodo ${periodoId}. Asientos de cierre anulados: ${closingEntries.length}.`
      );
    }

    return {
      period: updated,
      voidedEntries: closingEntries.length
    };
  }

  return {
    periodEndISO,
    getClosingEntries,
    hasVigenteClosingEntry,
    getVigenteClosingEntry,
    generateClosingEntry,
    closePeriod,
    reopenPeriod
  };
})();