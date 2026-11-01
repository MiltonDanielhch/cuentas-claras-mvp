/* =========================================================
   Cuentas Claras MVP
   Motor de costos, rentabilidad e indicadores
   Fase 9.2: alineado con Capítulo 5.9, sin doble conteo de IT
   ------------------------------------------------------------
   ✅ CORREGIDO:
   - computeIncome() ahora respeta la estructura del Capítulo 5.9:
     Utilidad bruta → Gastos operativos → Utilidad operativa →
     Depreciación → Utilidad antes de impuestos → IT → Utilidad neta.
   - Gastos desglosados en: operativos (6.1.01/02/03/05, 6.2.01/02/03),
     depreciación (6.1.04) y gastos por impuestos (6.4.01).
   - Eliminado el doble conteo de IT (ya está en 6.4.01, no se resta
     taxes.it de nuevo).
   - computeBalanceSheet() con activos no corrientes separados
     (1.2.01 a 1.2.06) y sin pasivoITInformativo falso.
   - getTaxes() acepta ambos conceptos de IT.
   - cmRatio ya no se redondea a 2 decimales (mejora precisión del PE).
   - Se agregan campos porcentuales (ventasPct, otrosPct, etc.) para
     que el renderer muestre correctamente la columna "% sobre ingresos".
   ========================================================= */

window.CC_COSTOS = (function () {
  const motor = window.CC_MAYOR_BALANZA;
  const storage = window.CC_STORAGE;

  /* ✅ CORREGIDO: grupos de cuentas separados */

  // Gastos operativos (SÍ van antes de la utilidad operativa)
  const GASTOS_OPERATIVOS_CODES = [
    "6.1.01", // Gastos operativos fijos
    "6.1.02", // Gastos de venta
    "6.1.03", // Gastos financieros
    "6.1.05", // Otros gastos
    "6.2.01", // Gastos de personal – sueldos
    "6.2.02", // Gastos de personal – CNS 10%
    "6.2.03"  // Gastos de personal – provisión BS
  ];

  // Depreciación (DESPUÉS de la utilidad operativa)
  const DEPRECIACION_CODE = "6.1.04";

  // Gastos por impuestos (al final, antes de la utilidad neta)
  const GASTOS_IMPUESTOS_CODE = "6.4.01";

  const CURRENT_ASSET_CODES = [
    "1.1.01",
    "1.1.02",
    "1.1.03",
    "1.1.04",
    "1.1.05",
    "1.1.06"
  ];

  /* ✅ CORREGIDO: activos no corrientes separados */
  const NON_CURRENT_ASSET_CODES = [
    { codigo: "1.2.01", esContra: false }, // Equipo de computación
    { codigo: "1.2.02", esContra: false }, // Mobiliario y equipo de oficina
    { codigo: "1.2.03", esContra: false }, // Activo intangible – dominio
    { codigo: "1.2.04", esContra: true },  // Depreciación acumulada – equipo
    { codigo: "1.2.05", esContra: true },  // Depreciación acumulada – mobiliario
    { codigo: "1.2.06", esContra: true }   // Amortización acumulada – dominio
  ];

  const CURRENT_LIABILITY_CODES = [
    "2.1.01",
    "2.1.02",
    "2.1.03",
    "2.1.04",
    "2.1.05"
  ];

  // Conceptos válidos de IT (acepta ambos)
  const IT_CONCEPTOS = ["ventas_brutas", "ventas_mas_otros_ingresos"];

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

  /* ---------------------------------------------------------
     ✅ CORREGIDO: getTaxes acepta ambos conceptos de IT
     --------------------------------------------------------- */
  function getTaxes(clientId, ctx, currentKey) {
    const taxes = storage
      .list("taxes")
      .filter((t) => t.clienteId === clientId);

    const included = taxes.filter((t) => {
      const period = ctx?.periodMap?.[t.periodoId];
      if (!period) return false;
      return motor.periodKey(period) <= currentKey;
    });

    const it = included
      .filter((t) => t.tipo === "IT" && IT_CONCEPTOS.includes(t.concepto))
      .reduce((sum, t) => sum + safeNumber(t.monto), 0);

    const ivaPagar = included
      .filter((t) => t.tipo === "IVA" && t.concepto === "por_pagar")
      .reduce((sum, t) => sum + safeNumber(t.monto), 0);

    return {
      it: round2(it),
      ivaPagar: round2(ivaPagar)
    };
  }

  /* ---------------------------------------------------------
     ✅ CORREGIDO: Estado de Resultados alineado al Capítulo 5.9
     NO se resta taxes.it (ya está en 6.4.01)
     --------------------------------------------------------- */
  function computeIncome(balances, taxes) {
    const rowByCode = makeRowLookup(balances);

    function acumuladoNetDeudor(code) {
      const row = rowByCode(code);
      if (!row) return 0;
      return round2(safeNumber(row.saldoDeudor) - safeNumber(row.saldoAcreedor));
    }

    function acumuladoNetAcreedor(code) {
      const row = rowByCode(code);
      if (!row) return 0;
      return round2(safeNumber(row.saldoAcreedor) - safeNumber(row.saldoDeudor));
    }

    function accountName(code) {
      const row = rowByCode(code);
      return row ? row.nombre : code;
    }

    const ventas = acumuladoNetAcreedor("4.1.01");
    const otrosIngresos = acumuladoNetAcreedor("4.1.02");
    const totalIngresos = round2(ventas + otrosIngresos);

    const comprasBrutas = acumuladoNetDeudor("5.1.01");
    const devolucionesCompras = acumuladoNetAcreedor("5.1.02");
    const costoNeto = round2(comprasBrutas - devolucionesCompras);

    const utilidadBruta = round2(totalIngresos - costoNeto);

    // Gastos operativos (antes de utilidad operativa)
    const gastosOperativos = GASTOS_OPERATIVOS_CODES.map((code) => ({
      codigo: code,
      nombre: accountName(code),
      monto: acumuladoNetDeudor(code)
    })).filter((g) => g.monto !== 0 || ["6.1.01", "6.2.01"].includes(g.codigo));

    const totalGastosOperativos = round2(
      gastosOperativos.reduce((sum, g) => sum + g.monto, 0)
    );

    const utilidadOperativa = round2(utilidadBruta - totalGastosOperativos);

    // Depreciación (después de utilidad operativa)
    const depreciacion = acumuladoNetDeudor(DEPRECIACION_CODE);
    const utilidadAntesImpuestos = round2(utilidadOperativa - depreciacion);

    // Gastos por impuestos (IT ya contabilizado en 6.4.01)
    const gastosImpuestos = acumuladoNetDeudor(GASTOS_IMPUESTOS_CODE);
    const utilidadNeta = round2(utilidadAntesImpuestos - gastosImpuestos);

    // ✅ Campos porcentuales para que el renderer muestre correctamente
    // la columna "% sobre ingresos"
    return {
      ventas,
      ventasPct: percent(ventas, totalIngresos),

      otrosIngresos,
      otrosIngresosPct: percent(otrosIngresos, totalIngresos),

      totalIngresos,
      totalIngresosPct: 100,

      comprasBrutas,
      comprasBrutasPct: percent(comprasBrutas, totalIngresos),

      devolucionesCompras,
      devolucionesComprasPct: percent(devolucionesCompras, totalIngresos),

      costoNeto,
      costoNetoPct: percent(costoNeto, totalIngresos),

      utilidadBruta,
      utilidadBrutaPct: percent(utilidadBruta, totalIngresos),

      gastosOperativos,
      totalGastosOperativos,
      totalGastosOperativosPct: percent(totalGastosOperativos, totalIngresos),

      utilidadOperativa,
      utilidadOperativaPct: percent(utilidadOperativa, totalIngresos),

      depreciacion,
      depreciacionPct: percent(depreciacion, totalIngresos),

      utilidadAntesImpuestos,
      utilidadAntesImpuestosPct: percent(utilidadAntesImpuestos, totalIngresos),

      gastosImpuestos,
      gastosImpuestosPct: percent(gastosImpuestos, totalIngresos),

      utilidadNeta,
      utilidadNetaPct: percent(utilidadNeta, totalIngresos),

      // Alias de compatibilidad
      gastos: gastosOperativos,
      totalGastos: totalGastosOperativos,
      impuestosEstimados: gastosImpuestos
    };
  }

  /* ---------------------------------------------------------
     ✅ CORREGIDO: Balance con activos separados
     Sin pasivoITInformativo falso (el IT ya se pagó en caja)
     --------------------------------------------------------- */
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

    // ACTIVO CORRIENTE
    const activoCorrienteLines = CURRENT_ASSET_CODES.map((code) => ({
      codigo: code,
      nombre: accountName(code),
      monto: accountBalance(code)
    }));

    const totalActivoCorriente = round2(
      activoCorrienteLines.reduce((sum, l) => sum + l.monto, 0)
    );

    // ACTIVO NO CORRIENTE (separado)
    const activoNoCorrienteLines = NON_CURRENT_ASSET_CODES.map((item) => {
      const monto = accountBalance(item.codigo);
      return {
        codigo: item.codigo,
        nombre: accountName(item.codigo),
        monto: item.esContra ? -monto : monto,
        esContra: item.esContra
      };
    });

    const totalActivoNoCorriente = round2(
      activoNoCorrienteLines.reduce((sum, l) => sum + l.monto, 0)
    );

    const totalActivo = round2(totalActivoCorriente + totalActivoNoCorriente);

    // PASIVO CORRIENTE
    const pasivoCorrienteLines = CURRENT_LIABILITY_CODES.map((code) => ({
      codigo: code,
      nombre: accountName(code),
      monto: accountBalance(code)
    }));

    const totalPasivoCorriente = round2(
      pasivoCorrienteLines.reduce((sum, l) => sum + l.monto, 0)
    );

    // ✅ CORREGIDO: NO se suma IT al pasivo (ya se pagó en caja)
    const pasivoITInformativo = 0;

    // PASIVO NO CORRIENTE
    const prestamosLP = accountBalance("2.2.01");
    const totalPasivo = round2(totalPasivoCorriente + prestamosLP);

    // PATRIMONIO
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
      activoNoCorrienteLines,
      totalActivoNoCorriente,
      totalActivo,

      pasivoCorrienteLines,
      pasivoCorrienteBase: totalPasivoCorriente,
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

    // ✅ CORREGIDO: ratio sin redondear (mayor precisión en PE)
    const ratioMargenContribucion =
      income.totalIngresos > 0
        ? margenContribucion / income.totalIngresos
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

    // ✅ CORREGIDO: costos fijos = solo gastos operativos (sin depreciación ni IT)
    const costosFijosContables = safeNumber(income.totalGastosOperativos);
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
      motivoNoCalculable = "No hay ingresos acumulados registrados hasta el periodo.";
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
        "No hay ingresos acumulados registrados hasta el periodo. Revise transacciones de venta o genere asientos automáticos en el Libro Diario."
      );
    }

    if (costMetrics.margenBruto !== null && costMetrics.margenBruto < 10) {
      insights.push(
        "El margen bruto acumulado es bajo. Conviene revisar precios de venta, condiciones de compra o mezcla de productos."
      );
    }

    if (income.utilidadNeta < 0) {
      insights.push(
        "El acumulado del periodo presenta pérdida neta. Es necesario reducir gastos, renegociar compras o aumentar ventas."
      );
    } else if (income.utilidadNeta > 0) {
      insights.push(
        "El acumulado del periodo presenta utilidad neta positiva. Mantener control documental y cierre oportuno ayuda a sostener el resultado."
      );
    }

    if (indicators.liquidezCorriente !== null && indicators.liquidezCorriente < 1) {
      insights.push(
        "La liquidez corriente es menor a 1. El activo corriente no cubre completamente el pasivo corriente acumulado."
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
          `Las ventas acumuladas están por debajo del punto de equilibrio contable. Faltarían aproximadamente ${window.CC_UTILS.formatMoney(falta)} para cubrir costos fijos registrados.`
        );
      } else {
        insights.push(
          "Las ventas acumuladas superan el punto de equilibrio contable del periodo, según gastos operativos registrados."
        );
      }
    } else if (breakeven.motivoNoCalculable) {
      insights.push(breakeven.motivoNoCalculable);
    }

    if (indicators.rotacionInventario === null) {
      insights.push(
        "No es posible calcular rotación de inventario porque la cuenta 1.1.04 no tiene saldo relevante en el periodo acumulado."
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

    const taxes = getTaxes(clientId, ctx, currentKey);
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