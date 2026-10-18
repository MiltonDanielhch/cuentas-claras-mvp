/* =========================================================
   Cuentas Claras MVP
   Motor de costos, rentabilidad e indicadores
   Fase 9
   ========================================================= */

window.CC_COSTOS = (function () {
  const motor = window.CC_MAYOR_BALANZA;
  const storage = window.CC_STORAGE;

  const EXPENSE_CODES = [
    "6.1.01",
    "6.1.02",
    "6.1.03",
    "6.1.04",
    "6.1.05"
  ];

  const CURRENT_ASSET_CODES = [
    "1.1.01",
    "1.1.02",
    "1.1.03",
    "1.1.04",
    "1.1.05",
    "1.1.06"
  ];

  const CURRENT_LIABILITY_CODES = [
    "2.1.01",
    "2.1.02",
    "2.1.03",
    "2.1.04",
    "2.1.05"
  ];

  function round2(value) {
    return motor && motor.round2
      ? motor.round2(value)
      : Math.round((Number(value) || 0) * 100) / 100;
  }

  function safeNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  function percent(value, base) {
    const v = safeNumber(value);
    const b = safeNumber(base);

    if (Math.abs(b) <= 0.01) return null;

    return round2((v / b) * 100);
  }

  function ratio(value, base) {
    const v = safeNumber(value);
    const b = safeNumber(base);

    if (Math.abs(b) <= 0.01) return null;

    return round2(v / b);
  }

  function makeRowLookup(balances) {
    const map = {};

    (balances?.rows || []).forEach((row) => {
      map[row.codigo] = row;
    });

    return function rowByCode(code) {
      return map[code] || null;
    };
  }

  function getTaxes(clientId, periodoId) {
    const taxes = storage
      .list("taxes")
      .filter(
        (t) =>
          t.clienteId === clientId &&
          t.periodoId === periodoId
      );

    const it = taxes
      .filter((t) => t.tipo === "IT" && t.concepto === "ventas_brutas")
      .reduce((sum, t) => sum + safeNumber(t.monto), 0);

    const ivaPagar = taxes
      .filter((t) => t.tipo === "IVA" && t.concepto === "por_pagar")
      .reduce((sum, t) => sum + safeNumber(t.monto), 0);

    return {
      it: round2(it),
      ivaPagar: round2(ivaPagar)
    };
  }

  function computeIncome(balances, taxes) {
    const rowByCode = makeRowLookup(balances);

    function periodNetDebit(code) {
      const row = rowByCode(code);
      if (!row) return 0;
      return round2(safeNumber(row.debitos) - safeNumber(row.creditos));
    }

    function periodNetCredit(code) {
      const row = rowByCode(code);
      if (!row) return 0;
      return round2(safeNumber(row.creditos) - safeNumber(row.debitos));
    }

    function accountName(code) {
      const row = rowByCode(code);
      return row ? row.nombre : code;
    }

    const ventas = periodNetCredit("4.1.01");
    const otrosIngresos = periodNetCredit("4.1.02");
    const totalIngresos = round2(ventas + otrosIngresos);

    const comprasBrutas = periodNetDebit("5.1.01");
    const devolucionesCompras = periodNetCredit("5.1.02");
    const costoNeto = round2(comprasBrutas - devolucionesCompras);

    const utilidadBruta = round2(totalIngresos - costoNeto);

    const gastos = EXPENSE_CODES.map((code) => ({
      codigo: code,
      nombre: accountName(code),
      monto: periodNetDebit(code)
    }));

    const totalGastos = round2(
      gastos.reduce((sum, g) => sum + g.monto, 0)
    );

    const utilidadOperativa = round2(utilidadBruta - totalGastos);
    const impuestosEstimados = safeNumber(taxes.it);
    const utilidadNeta = round2(utilidadOperativa - impuestosEstimados);

    return {
      ventas,
      otrosIngresos,
      totalIngresos,
      comprasBrutas,
      devolucionesCompras,
      costoNeto,
      utilidadBruta,
      gastos,
      totalGastos,
      utilidadOperativa,
      impuestosEstimados,
      utilidadNeta
    };
  }

  function computeBalanceSheet(balances, income, taxes) {
    const rowByCode = makeRowLookup(balances);

    function accountBalance(code) {
      const row = rowByCode(code);
      if (!row) return 0;

      if (row.naturaleza === "deudora") {
        return round2(safeNumber(row.saldoDeudor) - safeNumber(row.saldoAcreedor));
      }

      return round2(safeNumber(row.saldoAcreedor) - safeNumber(row.saldoDeudor));
    }

    function accountName(code) {
      const row = rowByCode(code);
      return row ? row.nombre : code;
    }

    const activoCorrienteLines = CURRENT_ASSET_CODES.map((code) => ({
      codigo: code,
      nombre: accountName(code),
      monto: accountBalance(code)
    }));

    const totalActivoCorriente = round2(
      activoCorrienteLines.reduce((sum, l) => sum + l.monto, 0)
    );

    const mobiliarioEquipo = accountBalance("1.2.01");
    const depreciacionAcumulada = accountBalance("1.2.02");
    const intangibles = accountBalance("1.2.03");

    const totalActivoNoCorriente = round2(
      mobiliarioEquipo - depreciacionAcumulada + intangibles
    );

    const totalActivo = round2(totalActivoCorriente + totalActivoNoCorriente);

    const pasivoCorrienteLines = CURRENT_LIABILITY_CODES.map((code) => ({
      codigo: code,
      nombre: accountName(code),
      monto: accountBalance(code)
    }));

    const pasivoCorrienteBase = round2(
      pasivoCorrienteLines.reduce((sum, l) => sum + l.monto, 0)
    );

    const pasivoITInformativo = safeNumber(taxes.it);
    const totalPasivoCorriente = round2(pasivoCorrienteBase + pasivoITInformativo);

    const prestamosLP = accountBalance("2.2.01");
    const totalPasivo = round2(totalPasivoCorriente + prestamosLP);

    const capital = accountBalance("3.1.01");
    const resultadosAcumulados = accountBalance("3.1.02");
    const resultadoPeriodo = income.utilidadNeta;

    const totalPatrimonio = round2(
      capital + resultadosAcumulados + resultadoPeriodo
    );

    const totalPasivoPatrimonio = round2(totalPasivo + totalPatrimonio);
    const diferencia = round2(totalActivo - totalPasivoPatrimonio);

    return {
      activoCorrienteLines,
      totalActivoCorriente,
      mobiliarioEquipo,
      depreciacionAcumulada,
      intangibles,
      totalActivoNoCorriente,
      totalActivo,

      pasivoCorrienteLines,
      pasivoCorrienteBase,
      pasivoITInformativo,
      totalPasivoCorriente,
      prestamosLP,
      totalPasivo,

      capital,
      resultadosAcumulados,
      resultadoPeriodo,
      totalPatrimonio,

      totalPasivoPatrimonio,
      diferencia,
      balanced: Math.abs(diferencia) <= 0.01
    };
  }

  function computeCostMetrics(income) {
    const margenBruto = percent(income.utilidadBruta, income.totalIngresos);
    const margenOperativo = percent(income.utilidadOperativa, income.totalIngresos);
    const margenNeto = percent(income.utilidadNeta, income.totalIngresos);

    const costoVariable = income.costoNeto;
    const margenContribucion = round2(income.totalIngresos - costoVariable);
    const ratioMargenContribucion =
      income.totalIngresos > 0
        ? round2(margenContribucion / income.totalIngresos)
        : null;

    return {
      margenBruto,
      margenOperativo,
      margenNeto,
      costoVariable,
      margenContribucion,
      ratioMargenContribucion,
      porcentajeMargenContribucion: percent(margenContribucion, income.totalIngresos)
    };
  }

  function computeBreakeven(income, costMetrics, client) {
    const totalIngresos = safeNumber(income.totalIngresos);
    const cmRatio = costMetrics.ratioMargenContribucion;

    const costosFijosContables = safeNumber(income.totalGastos);
    const costosFijosEstimados = safeNumber(client?.costosFijosMensuales);

    function calcPE(fijos) {
      if (cmRatio === null || cmRatio <= 0.0001) return null;
      return round2(safeNumber(fijos) / cmRatio);
    }

    const peContable = calcPE(costosFijosContables);
    const peEstimado = costosFijosEstimados > 0 ? calcPE(costosFijosEstimados) : null;

    function margenSeguridad(pe) {
      if (pe === null || totalIngresos <= 0) return null;
      return round2(((totalIngresos - pe) / totalIngresos) * 100);
    }

    let motivoNoCalculable = "";

    if (totalIngresos <= 0) {
      motivoNoCalculable = "No hay ingresos registrados en el periodo.";
    } else if (cmRatio === null) {
      motivoNoCalculable = "No es posible calcular el margen de contribución.";
    } else if (cmRatio <= 0.0001) {
      motivoNoCalculable = "El margen de contribución es cero o negativo; el punto de equilibrio no es calculable.";
    }

    return {
      calculable: totalIngresos > 0 && cmRatio !== null && cmRatio > 0.0001,
      motivoNoCalculable,
      costoVariable: costMetrics.costoVariable,
      margenContribucion: costMetrics.margenContribucion,
      ratioMargenContribucion: cmRatio,
      porcentajeMargenContribucion: costMetrics.porcentajeMargenContribucion,
      costosFijosContables,
      costosFijosEstimados,
      peContable,
      peEstimado,
      margenSeguridadContable: margenSeguridad(peContable),
      margenSeguridadEstimado: margenSeguridad(peEstimado)
    };
  }

  function computeIndicators(income, balanceSheet, costMetrics) {
    const rowLookup = null;
    const inventario = balanceSheet.activoCorrienteLines.find(
      (l) => l.codigo === "1.1.04"
    )?.monto || 0;

    const cuentasCobrar = balanceSheet.activoCorrienteLines.find(
      (l) => l.codigo === "1.1.03"
    )?.monto || 0;

    const liquidezCorriente =
      balanceSheet.totalPasivoCorriente > 0
        ? ratio(balanceSheet.totalActivoCorriente, balanceSheet.totalPasivoCorriente)
        : null;

    const endeudamiento = percent(balanceSheet.totalPasivo, balanceSheet.totalActivo);

    const roe = percent(income.utilidadNeta, balanceSheet.totalPatrimonio);

    const rotacionInventario =
      inventario > 0
        ? ratio(income.costoNeto, inventario)
        : null;

    const diasInventario =
      rotacionInventario !== null && rotacionInventario > 0
        ? round2(30 / rotacionInventario)
        : null;

    const rotacionCuentasCobrar =
      cuentasCobrar > 0
        ? ratio(income.ventas, cuentasCobrar)
        : null;

    const diasCuentasCobrar =
      rotacionCuentasCobrar !== null && rotacionCuentasCobrar > 0
        ? round2(30 / rotacionCuentasCobrar)
        : null;

    return {
      liquidezCorriente,
      endeudamiento,
      roe,
      margenNeto: costMetrics.margenNeto,
      inventario,
      rotacionInventario,
      diasInventario,
      cuentasCobrar,
      rotacionCuentasCobrar,
      diasCuentasCobrar
    };
  }

  function buildInsights(income, balanceSheet, costMetrics, breakeven, indicators) {
    const insights = [];

    if (income.totalIngresos <= 0) {
      insights.push(
        "No hay ingresos registrados en el periodo. Revise transacciones de venta o genere asientos automáticos en el Libro Diario."
      );
    }

    if (costMetrics.margenBruto !== null && costMetrics.margenBruto < 10) {
      insights.push(
        "El margen bruto es bajo. Conviene revisar precios de venta, condiciones de compra o mezcla de productos."
      );
    }

    if (income.utilidadNeta < 0) {
      insights.push(
        "El periodo presenta pérdida neta. Es necesario reducir gastos, renegociar compras o aumentar ventas."
      );
    } else if (income.utilidadNeta > 0) {
      insights.push(
        "El periodo presenta utilidad neta positiva. Mantener control documental y cierre oportuno ayuda a sostener el resultado."
      );
    }

    if (indicators.liquidezCorriente !== null && indicators.liquidezCorriente < 1) {
      insights.push(
        "La liquidez corriente es menor a 1. El activo corriente no cubre completamente el pasivo corriente del periodo."
      );
    }

    if (indicators.endeudamiento !== null && indicators.endeudamiento > 70) {
      insights.push(
        "El nivel de endeudamiento supera el 70%. La microempresa depende fuertemente de recursos de terceros."
      );
    }

    if (breakeven.calculable && breakeven.peContable !== null) {
      if (income.totalIngresos < breakeven.peContable) {
        const falta = round2(breakeven.peContable - income.totalIngresos);
        insights.push(
          `Las ventas están por debajo del punto de equilibrio contable. Faltarían aproximadamente ${window.CC_UTILS.formatMoney(falta)} para cubrir costos fijos registrados.`
        );
      } else {
        insights.push(
          "Las ventas superan el punto de equilibrio contable del periodo, según gastos operativos registrados."
        );
      }
    } else if (breakeven.motivoNoCalculable) {
      insights.push(breakeven.motivoNoCalculable);
    }

    if (indicators.rotacionInventario === null) {
      insights.push(
        "No es posible calcular rotación de inventario porque la cuenta 1.1.04 no tiene saldo relevante en el periodo."
      );
    }

    if (!balanceSheet.balanced) {
      insights.push(
        "El balance simplificado no cuadra. Revise asientos del Diario, ajustes y cálculo de impuestos informativos."
      );
    }

    return insights;
  }

  function buildData(clientId, periodoId) {
    if (!motor) {
      throw new Error("No se encontró CC_MAYOR_BALANZA. Cargue js/modules/mayor-balanza.js.");
    }

    if (!clientId || !periodoId) {
      return {
        ok: false,
        message: "Seleccione un cliente y un periodo."
      };
    }

    motor.ensureAccounts();

    const ctx = motor.buildContext(clientId);
    const accountsMap = motor.getAccountsMap();
    const period = ctx.periodMap[periodoId];

    if (!period) {
      return {
        ok: false,
        message: "Periodo no encontrado."
      };
    }

    const currentKey = motor.periodKey(period);
    const client = storage.get("clients", clientId);

    const balances = motor.getTrialBalance(ctx, accountsMap, currentKey, {
      includeAdjustments: true,
      includeClosing: false
    });

    const taxes = getTaxes(clientId, periodoId);
    const income = computeIncome(balances, taxes);
    const balanceSheet = computeBalanceSheet(balances, income, taxes);
    const costMetrics = computeCostMetrics(income);
    const breakeven = computeBreakeven(income, costMetrics, client);
    const indicators = computeIndicators(income, balanceSheet, costMetrics);
    const insights = buildInsights(income, balanceSheet, costMetrics, breakeven, indicators);

    return {
      ok: true,
      clientId,
      periodoId,
      client,
      period,
      periodLabel: motor.periodLabel(period),
      clientName: client ? client.nombreComercial : "Cliente",
      balances,
      taxes,
      income,
      balanceSheet,
      costMetrics,
      breakeven,
      indicators,
      insights
    };
  }

  return {
    round2,
    buildData,
    computeIncome,
    computeBalanceSheet,
    computeCostMetrics,
    computeBreakeven,
    computeIndicators
  };
})();