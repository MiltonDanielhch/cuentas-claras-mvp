/* =========================================================
   Cuentas Claras MVP
   Módulo de cierre contable del periodo
   Fase 8.1
   ------------------------------------------------------------
   ✅ CORREGIDO:
   - TRASLADAR_A_RESULTADOS_ACUMULADOS = false por defecto.
     Esto hace que el cierre SOLO cancele las cuentas temporales
     (4.x, 5.x, 6.x) contra 3.1.03 Resultados del ejercicio, sin
     trasladar a 3.1.02. Así el Balance General coincide con el
     Capítulo 5.10: 3.1.02 = -1.000 (resultado de arranque) y
     3.1.03 = 13.031 (resultado del ejercicio).
   - Si el usuario quiere trasladar, puede cambiar la constante
     a true y el cierre hará el asiento adicional.
   - Se agrega previewClosingEntry() para mostrar el asiento
     antes de crearlo (útil para la defensa).
   - Se agrega validación: si el período no es diciembre,
     advierte que el cierre es anual (pero no bloquea).
   - Se documenta que los EE.FF. excluyen cierres por diseño.
   - Se mejora el mensaje de error y la bitácora.
   ========================================================= */

window.CC_CIERRE = (function () {
  const utils = window.CC_UTILS;
  const storage = window.CC_STORAGE;
  const contabilidad = window.CC_CONTABILIDAD;
  const motor = window.CC_MAYOR_BALANZA;
  const bitacora = window.CC_BITACORA;

  /* ---------------------------------------------------------
     ✅ CONFIGURACIÓN DEL CIERRE
     --------------------------------------------------------- */

  // false = el cierre deja el resultado del ejercicio en 3.1.03
  //         (coincide con el Capítulo 5.10)
  // true  = además traslada 3.1.03 a 3.1.02 Resultados acumulados
  //         (cierre "clásico" de fin de ejercicio)
  const TRASLADAR_A_RESULTADOS_ACUMULADOS = false;

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

  function isDecemberPeriod(period) {
    return period && Number(period.mes) === 12;
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

  /* ---------------------------------------------------------
     ✅ NUEVO: construye las líneas del asiento de cierre sin
     persistirlas. Útil para preview y para reutilizar en
     generateClosingEntry.
     --------------------------------------------------------- */

  function buildClosingLines(clientId, periodoId) {
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

    const ctx = motor.buildContext(clientId);
    const accountsMap = motor.getAccountsMap();
    const currentKey = motor.periodKey(period);

    const balances = motor.getTrialBalance(ctx, accountsMap, currentKey, {
      includeAdjustments: true,
      includeClosing: false
    });

    const lines = [];
    let resultToExercise = 0;
    const cerradas = [];

    balances.rows.forEach((row) => {
      const account = accountsMap[row.codigo];

      if (!account || !account.esTemporal) return;
      if (row.codigo === "3.1.03") return;

      // ✅ CORREGIDO: usa saldos acumulados (no movimientos del período)
      const netAcumulado = round2((Number(row.saldoDeudor) || 0) - (Number(row.saldoAcreedor) || 0));

      if (Math.abs(netAcumulado) <= 0.01) return;

      if (netAcumulado > 0) {
        // Cuenta deudora (gasto/costo): se acredita por su saldo y se debita 3.1.03
        lines.push({
          cuentaCodigo: "3.1.03",
          debito: netAcumulado,
          credito: 0,
          tercero: "Cierre contable",
          referencia: row.codigo,
          observacion: `Cierre de cuenta deudora ${row.codigo} - ${row.nombre}`
        });

        lines.push({
          cuentaCodigo: row.codigo,
          debito: 0,
          credito: netAcumulado,
          tercero: "Cierre contable",
          referencia: "3.1.03",
          observacion: `Cierre de cuenta deudora ${row.codigo} - ${row.nombre}`
        });

        resultToExercise = round2(resultToExercise - netAcumulado);
        cerradas.push({ codigo: row.codigo, nombre: row.nombre, monto: netAcumulado, tipo: "deudora" });
      } else {
        // Cuenta acreedora (ingreso): se debita por su saldo y se acredita 3.1.03
        const amount = round2(-netAcumulado);

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
        cerradas.push({ codigo: row.codigo, nombre: row.nombre, monto: amount, tipo: "acreedora" });
      }
    });

    // ✅ Traslado opcional a 3.1.02 (solo si está configurado)
    if (TRASLADAR_A_RESULTADOS_ACUMULADOS && Math.abs(resultToExercise) > 0.01) {
      if (resultToExercise > 0) {
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

    return {
      period,
      lines,
      resultToExercise,
      cerradas,
      trasladaResultado: TRASLADAR_A_RESULTADOS_ACUMULADOS && Math.abs(resultToExercise) > 0.01
    };
  }

  /* ---------------------------------------------------------
     ✅ NUEVO: preview sin persistir (útil para defensa)
     --------------------------------------------------------- */

  function previewClosingEntry(clientId, periodoId) {
    const data = buildClosingLines(clientId, periodoId);
    const isDec = isDecemberPeriod(data.period);

    return {
      ...data,
      esCierreAnual: isDec,
      advertenciaAnual: isDec ? null : "El cierre del ejercicio es anual. Está cerrando un período que no es diciembre; el resultado del ejercicio quedará en 3.1.03 con el saldo acumulado del año.",
      lineasFormateadas: data.lines.map((l) => ({
        cuenta: l.cuentaCodigo,
        debe: l.debito,
        haber: l.credito,
        descripcion: l.observacion
      }))
    };
  }

  function generateClosingEntry(clientId, periodoId) {
    if (!contabilidad) {
      throw new Error("No se encontró el motor contable CC_CONTABILIDAD.");
    }

    if (!motor) {
      throw new Error("No se encontró el motor CC_MAYOR_BALANZA.");
    }

    const existing = getVigenteClosingEntry(periodoId);
    if (existing) {
      return existing;
    }

    motor.ensureAccounts();

    const data = buildClosingLines(clientId, periodoId);

    if (data.lines.length < 2) {
      return null;
    }

    const isDec = isDecemberPeriod(data.period);

    const entry = contabilidad.createManualEntry({
      clienteId: clientId,
      periodoId: periodoId,
      fecha: periodEndISO(data.period),
      tipoAsiento: "cierre",
      categoriaAjuste: null,
      documentoId: null,
      descripcion:
        `Cierre contable ${motor.periodLabel(data.period)}` +
        (isDec ? " (anual)" : " (mensual)") +
        (data.trasladaResultado ? " · con traslado a resultados acumulados" : ""),
      observacion: `cierre:${periodoId}`,
      lines: data.lines
    });

    if (bitacora) {
      bitacora.log(
        "generar_cierre",
        "journal_entries",
        entry.id,
        `Asiento de cierre generado para periodo ${periodoId}. ` +
        `Cuentas cerradas: ${data.cerradas.length}. ` +
        `Resultado del ejercicio: ${utils.formatMoney(Math.abs(data.resultToExercise))} ` +
        `${data.resultToExercise >= 0 ? "(utilidad)" : "(pérdida)"}. ` +
        `Traslado a resultados acumulados: ${data.trasladaResultado ? "sí" : "no"}.`
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
        `Cierre contable del periodo ${motor ? motor.periodLabel(period) : periodoId}. ` +
        `Asiento de cierre: ${entry ? entry.id : "no requerido"}. ` +
        `Nota: los EE.FF. excluyen asientos de cierre por diseño; ` +
        `el Balance General y el Estado de Resultados muestran el estado pre-cierre.`
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
    previewClosingEntry, // ✅ NUEVO
    generateClosingEntry,
    closePeriod,
    reopenPeriod
  };
})();