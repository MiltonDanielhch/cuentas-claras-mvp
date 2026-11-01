/* =========================================================
   Cuentas Claras MVP
   Seed definitivo: Cliente 001 del proyecto
   Cuentas Claras – Gestión Contable Digital
   ✅ CORREGIDO: asientos alineados con Capítulo 5.6,
   plan de cuentas separado, 12 impuestos mensuales,
   documentos vinculados, verificación actualizada.
   =========================================================

   Este seed representa al propio emprendimiento Cuentas Claras
   como cliente del sistema, usando los datos del Capítulo 5.

   Importante:
   - Usa CLI-0004 para convivir con los clientes demo CLI-0001/2/3.
   - Crea 12 periodos mensuales PER-0004 a PER-0015.
   - Estados Financieros e Indicadores deben estar en modo acumulado.
   - IT referencial se registra como gasto pagado en Libro Diario (6.4.01).
   - También se registran 12 cálculos informativos mensuales en taxes
     (IMP-0101 a IMP-0112) para poblar la pantalla de Impuestos.
   - ⚠️ NOTA PENDIENTE: estados-financieros.js no debe restar taxes.it
     si el IT ya está en el gasto del Diario. Corregir ese módulo aparte.
*/

window.CC_SEED_EMPRENDIMIENTO = (function () {
  const cfg = window.CC_CONFIG;
  const base = window.CC_SEED;

  if (!cfg) {
    console.error(
      "CC_CONFIG no está cargado. Incluye seed-emprendimiento.js después de js/config.js."
    );
    return {};
  }

  /* ---------------------------------------------------------
     Configuración principal
     --------------------------------------------------------- */
  const CLIENT_ID = "CLI-0004";
  const PERIODO_INICIAL = 4;

  const CLIENT_NAME = "Cuentas Claras – Gestión Contable Digital";
  const ANIO = 2026;

  // IT referencial:
  const REGISTRAR_IT_EN_DIARIO = true;     // Se registra como gasto pagado en Diario (6.4.01)
  const REGISTRAR_IT_EN_IMPUESTOS = true;  // ✅ CAMBIADO: ahora creamos 12 taxes mensuales informativos

  // Cierre: por ahora NO lo agregamos al seed, lo genera el módulo cierre.js.
  // Si quieres que aparezca en el Libro Diario, cambia a true (pero revisa
  // que la verificación y EE.FF. excluyan asientos de tipo "cierre").
  const REGISTRAR_CIERRE_EN_DIARIO = false; // ✅ NUEVO

  /* ---------------------------------------------------------
     Helpers básicos
     --------------------------------------------------------- */
  function pad(n, size = 4) {
    return String(n).padStart(size, "0");
  }

  function date(y, m, d) {
    return `${y}-${pad(m, 2)}-${pad(d, 2)}`;
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function round2(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }

  /* ---------------------------------------------------------
     Catálogo de cuentas
     --------------------------------------------------------- */
  const catalog = cfg.accountCatalog || [];

  const nameByCode = {};
  const natureByCode = {};

  catalog.forEach((account) => {
    nameByCode[account.codigo] = account.nombre;
    natureByCode[account.codigo] = account.naturaleza;
  });

  function accName(code) {
    return nameByCode[code] || code;
  }

  function accNature(code) {
    return natureByCode[code] || "deudora";
  }

  /* ---------------------------------------------------------
     ✅ CORREGIDO: Mapa contable con cuentas separadas
     --------------------------------------------------------- */
  const C = {
    caja: "1.1.01",

    // Activos no corrientes separados
    equipoComputo: "1.2.01",           // ✅ Equipo (Bs 7.200)
    mobiliarioOficina: "1.2.02",       // ✅ Mobiliario (Bs 800)
    intangibles: "1.2.03",             // Dominio (Bs 200)

    // Depreciación y amortización acumuladas separadas
    depreciacionEquipo: "1.2.04",      // ✅ Acum. equipo (1.800)
    depreciacionMobiliario: "1.2.05",  // ✅ Acum. mobiliario (160)
    amortizacionDominio: "1.2.06",     // ✅ Acum. dominio (200)

    // Pasivo
    provisionBS: "2.1.04",             // Provisión BS por pagar

    // Patrimonio
    capital: "3.1.01",                 // Capital social (10.800)
    resultadosAcumulados: "3.1.02",    // Resultado de arranque (-1.000)
    resultadosDelEjercicio: "3.1.03",  // ✅ Resultado del ejercicio (cierre)

    // Ingresos
    ventas: "4.1.01",                  // Ingresos por servicios (41.850)
    otrosIngresos: "4.1.02",           // Otros ingresos (7.600)

    // Costo
    costoVentas: "5.1.01",             // Costo de servicios (3.255)

    // Gastos operativos
    gastosAdministracion: "6.1.01",    // Gastos operativos fijos (4.440)
    gastosVenta: "6.1.02",
    gastosFinancieros: "6.1.03",
    depreciacionGasto: "6.1.04",       // Depreciación y amortización (2.160)
    otrosGastos: "6.1.05",

    // ✅ NUEVOS: Gastos de personal desglosados
    gastosPersonalSueldos: "6.2.01",   // Sueldos (19.800)
    gastosPersonalCNS: "6.2.02",       // CNS 10% (1.980)
    gastosPersonalProvision: "6.2.03", // Provisión BS (3.300)

    // ✅ NUEVA: Gastos por impuestos
    gastosImpuestos: "6.4.01"          // IT referencial (1.484)
  };

  /* ---------------------------------------------------------
     Cliente 001 del proyecto
     --------------------------------------------------------- */
  const clients = [
    {
      id: CLIENT_ID,
      nombreComercial: "Cuentas Claras",
      razonSocial: CLIENT_NAME,
      nit: "1082426", // ✅ CORREGIDO: NIT de demo más plausible (7 dígitos)
      telefono: "75344723",
      whatsapp: "75344723",
      direccion: "Trinidad – zona Pompeya",
      regimenTributario: "Régimen General",
      tipoNegocio: "Servicios",
      capitalInicial: 10800,
      costosFijosMensuales: 370,
      estado: "activo",
      fechaAlta: date(ANIO, 1, 1),
      observacion:
        "Cliente 001 del proyecto. Representa al propio emprendimiento Cuentas Claras para demostrar el ciclo contable del Capítulo 5."
    }
  ];

  /* ---------------------------------------------------------
     Periodos mensuales 2026
     --------------------------------------------------------- */
  const periods = Array.from({ length: 12 }, (_, index) => {
    const mes = index + 1;
    const numeroPeriodo = PERIODO_INICIAL + index;
    const id = `PER-${pad(numeroPeriodo)}`;

    return {
      id,
      clienteId: CLIENT_ID,
      mes,
      anio: ANIO,
      estado: "abierto",
      fechaApertura: date(ANIO, mes, 1),
      fechaCierre: null,
      closingEntryId: null,
      closedAt: null,
      observacion: `Periodo mensual ${mes}/${ANIO} del Cliente 001 – Cuentas Claras.`
    };
  });

  const periodIdByMes = {};
  periods.forEach((p) => {
    periodIdByMes[p.mes] = p.id;
  });

  function getPeriodIdFromFecha(fecha, periodoIdParam = null) {
    if (periodoIdParam) return periodoIdParam;
    const mes = Number(String(fecha || "").slice(5, 7));
    return periodIdByMes[mes] || periodIdByMes[12];
  }

  /* ---------------------------------------------------------
     Documentos de respaldo de la inversión inicial
     --------------------------------------------------------- */
  const documents = [
    { id: "DOC-0013", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "recibo", fechaDocumento: date(ANIO, 1, 5), monto: 200, tercero: "Trámites registrales y tributarios", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Preoperativos – trámites mínimos." },
    { id: "DOC-0014", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "factura_compra", fechaDocumento: date(ANIO, 1, 8), monto: 300, tercero: "Publicidad de lanzamiento", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Preoperativos – publicidad inicial." },
    { id: "DOC-0015", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "factura_compra", fechaDocumento: date(ANIO, 1, 10), monto: 300, tercero: "Material didáctico para talleres", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Preoperativos – material educativo." },
    { id: "DOC-0016", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "recibo", fechaDocumento: date(ANIO, 1, 12), monto: 200, tercero: "Adecuación básica del espacio", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Preoperativos – adecuación del domicilio operativo." },
    { id: "DOC-0017", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "factura_compra", fechaDocumento: date(ANIO, 1, 15), monto: 500, tercero: "Mobiliario básico para dos estaciones", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Infraestructura." },
    { id: "DOC-0018", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "factura_compra", fechaDocumento: date(ANIO, 1, 15), monto: 200, tercero: "Estantes y archivadores", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Infraestructura." },
    { id: "DOC-0019", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "factura_compra", fechaDocumento: date(ANIO, 1, 16), monto: 100, tercero: "Organización del espacio", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Infraestructura." },
    { id: "DOC-0020", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "factura_compra", fechaDocumento: date(ANIO, 1, 18), monto: 3800, tercero: "Laptop principal", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Equipos y herramientas." },
    { id: "DOC-0021", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "factura_compra", fechaDocumento: date(ANIO, 1, 18), monto: 2200, tercero: "Laptop de apoyo", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Equipos y herramientas." },
    { id: "DOC-0022", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "factura_compra", fechaDocumento: date(ANIO, 1, 19), monto: 1000, tercero: "Impresora multifuncional básica", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Equipos y herramientas." },
    { id: "DOC-0023", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "recibo", fechaDocumento: date(ANIO, 1, 19), monto: 200, tercero: "Medio de respaldo USB/SSD", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Equipos y herramientas." },
    { id: "DOC-0024", clienteId: CLIENT_ID, periodoId: periodIdByMes[1], tipo: "factura_compra", fechaDocumento: date(ANIO, 1, 20), monto: 200, tercero: "Dominio web por un año", estado: "validado", archivoNombre: "", archivoDataUrl: "", observacion: "Tecnología inicial." }
  ];

  /* ---------------------------------------------------------
     Libro Diario, líneas y transacciones
     --------------------------------------------------------- */
  const transactions = [];
  const journalEntries = [];
  const journalLines = [];

  let jeSeq = 1;
  let jlSeq = 1;
  let trxSeq = 16;
  let folioSeq = 1;

  function newTransactionId() {
    return `TRX-${pad(trxSeq++)}`;
  }

  function addEntry({
    fecha,
    periodoId: periodoIdParam = null,
    tipoAsiento = "operacion",
    categoriaAjuste = null,
    descripcion,
    lines,
    documentoId = null,
    transaccionId = null,
    observacion = ""
  }) {
    const periodoId = getPeriodIdFromFecha(fecha, periodoIdParam);
    const id = `JE-${pad(jeSeq++)}`;
    const folio = `D-${pad(folioSeq++)}`;

    let totalDebe = 0;
    let totalHaber = 0;

    const normalizedLines = lines.map((line) => {
      const debito = round2(line.debito || 0);
      const credito = round2(line.credito || 0);

      totalDebe += debito;
      totalHaber += credito;

      return {
        id: `JL-${pad(jlSeq++, 5)}`,
        asientoId: id,
        clienteId: CLIENT_ID,
        periodoId,
        cuentaCodigo: line.cuentaCodigo,
        cuentaNombre: line.cuentaNombre || accName(line.cuentaCodigo),
        debito,
        credito,
        tercero: line.tercero || "",
        referencia: line.referencia || folio,
        observacion: line.observacion || descripcion
      };
    });

    totalDebe = round2(totalDebe);
    totalHaber = round2(totalHaber);

    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      console.warn(
        "❌ Asiento descuadrado en seed del emprendimiento:",
        descripcion,
        { totalDebe, totalHaber }
      );
    }

    journalEntries.push({
      id,
      folio,
      clienteId: CLIENT_ID,
      periodoId,
      fecha,
      tipoAsiento,
      categoriaAjuste,
      origen: "automatico",
      transaccionId,
      documentoId,
      descripcion,
      estado: "vigente",
      usuarioId: "USR-0001",
      observacion: observacion || "Seed del emprendimiento propio (Capítulo 5).",
      totalDebe,
      totalHaber,
      fechaCreacion: nowISO()
    });

    journalLines.push(...normalizedLines);

    return id;
  }

  function addTransaction({
    id = null,
    fecha,
    periodoId: periodoIdParam = null,
    tipo,
    cuenta,
    monto,
    tercero,
    formaPago = "efectivo",
    documentoId = null,
    journalEntryId = null,
    observacion = ""
  }) {
    const periodoId = getPeriodIdFromFecha(fecha, periodoIdParam);
    const trxId = id || `TRX-${pad(trxSeq++)}`;

    transactions.push({
      id: trxId,
      clienteId: CLIENT_ID,
      periodoId,
      documentoId,
      journalEntryId,
      fecha,
      tipo,
      cuenta,
      monto: round2(monto),
      tercero,
      formaPago,
      estado: "activa",
      observacion
    });

    return trxId;
  }

  /* ---------------------------------------------------------
     Asiento 1: aporte de capital
     --------------------------------------------------------- */
  const trxAporteId = newTransactionId();

  const jeAporte = addEntry({
    fecha: date(ANIO, 1, 2),
    tipoAsiento: "apertura",
    descripcion: "Aporte de capital de los socios – inversión inicial Bs 10.800",
    transaccionId: trxAporteId,
    lines: [
      { cuentaCodigo: C.caja, debito: 10800 },
      { cuentaCodigo: C.capital, credito: 10800 }
    ]
  });

  addTransaction({
    id: trxAporteId,
    fecha: date(ANIO, 1, 2),
    tipo: "aporte", // ✅ CORREGIDO: antes era "ingreso"
    cuenta: "Capital social", // ✅ CORREGIDO
    monto: 10800,
    tercero: "Socios fundadores",
    formaPago: "aporte",
    journalEntryId: jeAporte,
    observacion: "Aporte inicial del emprendimiento. Se respalda con pacto social (no requiere factura)."
  });

  /* ---------------------------------------------------------
     Asiento 2: compra de activos fijos e intangible
     ✅ CORREGIDO: separado en equipo 7.200 + mobiliario 800 + dominio 200
     ✅ CORREGIDO: documento vinculado (DOC-0017)
     --------------------------------------------------------- */
  const trxInversionId = newTransactionId();

  const jeInversion = addEntry({
    fecha: date(ANIO, 1, 18),
    descripcion: "Compra de activos fijos e intangible – equipo Bs 7.200 + mobiliario Bs 800 + dominio Bs 200",
    documentoId: "DOC-0017 a DOC-0024",
    transaccionId: trxInversionId,
    lines: [
      { cuentaCodigo: C.equipoComputo, debito: 7200 },      // ✅ separado
      { cuentaCodigo: C.mobiliarioOficina, debito: 800 },   // ✅ separado
      { cuentaCodigo: C.intangibles, debito: 200 },         // ✅ separado
      { cuentaCodigo: C.caja, credito: 8200 }
    ]
  });

  addTransaction({
    id: trxInversionId,
    fecha: date(ANIO, 1, 18),
    tipo: "compra_activo", // ✅ CORREGIDO: antes era "compra"
    cuenta: "Equipo de computación", // ✅ CORREGIDO
    monto: 8200,
    tercero: "Proveedores de equipos y dominio",
    formaPago: "banco",
    documentoId: "DOC-0017", // ✅ NUEVO: vinculado (elimina alerta falsa)
    journalEntryId: jeInversion,
    observacion: "Activos iniciales del emprendimiento. Respaldo: DOC-0017 a DOC-0024."
  });

  /* ---------------------------------------------------------
     Asiento 3: gastos de constitución / preoperativos
     ✅ CORREGIDO: documento vinculado (DOC-0013)
     --------------------------------------------------------- */
  const trxPreoperativosId = newTransactionId();

  const jePreoperativos = addEntry({
    fecha: date(ANIO, 1, 12),
    descripcion: "Gastos de constitución y puesta en marcha – preoperativos Bs 1.000",
    documentoId: "DOC-0013 a DOC-0016",
    transaccionId: trxPreoperativosId,
    lines: [
      { cuentaCodigo: C.resultadosAcumulados, debito: 1000 },
      { cuentaCodigo: C.caja, credito: 1000 }
    ],
    observacion: "Preoperativos reconocidos como resultado de arranque patrimonial."
  });

  addTransaction({
    id: trxPreoperativosId,
    fecha: date(ANIO, 1, 12),
    tipo: "gasto",
    cuenta: "Resultado de arranque (gastos de constitución)", // ✅ CORREGIDO
    monto: 1000,
    tercero: "Trámites, publicidad, material y adecuación",
    documentoId: "DOC-0013", // ✅ NUEVO: vinculado (elimina alerta falsa)
    journalEntryId: jePreoperativos,
    observacion: "Preoperativos del emprendimiento. Respaldo: DOC-0013 a DOC-0016."
  });

  /* ---------------------------------------------------------
     Flujo mensual del Capítulo 5, sección 5.5
     --------------------------------------------------------- */
  const flujoMensual = [
    { mes: 1, clientes: 3, paquetes: 1350, otros: 200, variables: 105, fijos: 370, retiro: 0 },
    { mes: 2, clientes: 4, paquetes: 1800, otros: 300, variables: 140, fijos: 370, retiro: 0 },
    { mes: 3, clientes: 5, paquetes: 2250, otros: 500, variables: 175, fijos: 370, retiro: 0 },
    { mes: 4, clientes: 6, paquetes: 2700, otros: 400, variables: 210, fijos: 370, retiro: 0 },
    { mes: 5, clientes: 7, paquetes: 3150, otros: 600, variables: 245, fijos: 370, retiro: 0 },
    { mes: 6, clientes: 8, paquetes: 3600, otros: 800, variables: 280, fijos: 370, retiro: 0 },
    { mes: 7, clientes: 8, paquetes: 3600, otros: 500, variables: 280, fijos: 370, retiro: 3630 },
    { mes: 8, clientes: 9, paquetes: 4050, otros: 700, variables: 315, fijos: 370, retiro: 3630 },
    { mes: 9, clientes: 10, paquetes: 4500, otros: 1000, variables: 350, fijos: 370, retiro: 3630 },
    { mes: 10, clientes: 10, paquetes: 4500, otros: 600, variables: 350, fijos: 370, retiro: 3630 },
    { mes: 11, clientes: 11, paquetes: 4950, otros: 800, variables: 385, fijos: 370, retiro: 3630 },
    { mes: 12, clientes: 12, paquetes: 5400, otros: 1200, variables: 420, fijos: 370, retiro: 3630 }
  ];

  flujoMensual.forEach((m) => {
    const fecha = date(ANIO, m.mes, 28);

    // Ingresos por paquetes
    if (m.paquetes > 0) {
      const trxId = newTransactionId();
      const jeId = addEntry({
        fecha,
        descripcion: `Ingresos mes ${m.mes}: paquetes Bs ${m.paquetes}`,
        transaccionId: trxId,
        lines: [
          { cuentaCodigo: C.caja, debito: m.paquetes },
          { cuentaCodigo: C.ventas, credito: m.paquetes }
        ]
      });
      addTransaction({
        id: trxId,
        fecha,
        tipo: "venta",
        cuenta: "Ingresos por servicios", // ✅ CORREGIDO
        monto: m.paquetes,
        tercero: "Clientes del servicio contable",
        journalEntryId: jeId,
        observacion: `Paquetes mensuales mes ${m.mes}.`
      });
    }

    // Otros ingresos: talleres y asesorías
    if (m.otros > 0) {
      const trxId = newTransactionId();
      const jeId = addEntry({
        fecha,
        descripcion: `Otros ingresos mes ${m.mes}: Bs ${m.otros}`,
        transaccionId: trxId,
        lines: [
          { cuentaCodigo: C.caja, debito: m.otros },
          { cuentaCodigo: C.otrosIngresos, credito: m.otros }
        ]
      });
      addTransaction({
        id: trxId,
        fecha,
        tipo: "ingreso",
        cuenta: "Otros ingresos",
        monto: m.otros,
        tercero: "Talleres y asesorías",
        journalEntryId: jeId,
        observacion: `Otros ingresos mes ${m.mes}.`
      });
    }

    // Costos variables del mes
    if (m.variables > 0) {
      const trxId = newTransactionId();
      const jeId = addEntry({
        fecha,
        descripcion: `Costos variables mes ${m.mes}: Bs ${m.variables}`,
        transaccionId: trxId,
        lines: [
          { cuentaCodigo: C.costoVentas, debito: m.variables },
          { cuentaCodigo: C.caja, credito: m.variables }
        ]
      });
      addTransaction({
        id: trxId,
        fecha,
        tipo: "compra",
        cuenta: "Costo de servicios prestados", // ✅ CORREGIDO
        monto: m.variables,
        tercero: "Costos variables de atención",
        journalEntryId: jeId,
        observacion: `Costos variables mes ${m.mes}.`
      });
    }

    // Costos fijos del mes
    if (m.fijos > 0) {
      const trxId = newTransactionId();
      const jeId = addEntry({
        fecha,
        descripcion: `Costos fijos mes ${m.mes}: Bs ${m.fijos}`,
        transaccionId: trxId,
        lines: [
          { cuentaCodigo: C.gastosAdministracion, debito: m.fijos },
          { cuentaCodigo: C.caja, credito: m.fijos }
        ]
      });
      addTransaction({
        id: trxId,
        fecha,
        tipo: "gasto",
        cuenta: "Gastos operativos fijos", // ✅ CORREGIDO
        monto: m.fijos,
        tercero: "Internet, energía, telefonía, transporte y soporte",
        journalEntryId: jeId,
        observacion: `Costos fijos mes ${m.mes}.`
      });
    }

    // Retiro remunerado desde el mes 7
    if (m.retiro > 0) {
      const trxNominaId = newTransactionId();
      const jeNomina = addEntry({
        fecha,
        descripcion: `Nómina y cargas sociales mes ${m.mes}: sueldo Bs 3.300 + CNS 10% Bs 330`,
        transaccionId: trxNominaId,
        lines: [
          { cuentaCodigo: C.gastosPersonalSueldos, debito: 3300 }, // ✅ separado
          { cuentaCodigo: C.gastosPersonalCNS, debito: 330 },     // ✅ separado
          { cuentaCodigo: C.caja, credito: 3630 }
        ]
      });
      addTransaction({
        id: trxNominaId,
        fecha,
        tipo: "gasto",
        cuenta: "Gastos de personal – sueldos", // ✅ CORREGIDO
        monto: 3630,
        tercero: "Retiro remunerado del responsable",
        journalEntryId: jeNomina,
        observacion: `Nómina mensual mes ${m.mes}.`
      });

      // Provisión de beneficios sociales (devengada no caja)
      addEntry({
        fecha,
        tipoAsiento: "ajuste",
        categoriaAjuste: "provision",
        descripcion: `Provisión de beneficios sociales mes ${m.mes}: aprox. 16,67% del bruto = Bs 550`,
        lines: [
          { cuentaCodigo: C.gastosPersonalProvision, debito: 550 }, // ✅ separado
          { cuentaCodigo: C.provisionBS, credito: 550 }
        ]
      });
    }
  });

  /* ---------------------------------------------------------
     Ajuste anual: depreciación y amortización
     ✅ CORREGIDO: separado en equipo 1.800 + mobiliario 160 + dominio 200
     --------------------------------------------------------- */
  addEntry({
    fecha: date(ANIO, 12, 31),
    tipoAsiento: "ajuste",
    categoriaAjuste: "depreciacion",
    descripcion: "Depreciación y amortización anual línea recta: equipo Bs 1.800 + mobiliario Bs 160 + dominio Bs 200 = Bs 2.160",
    lines: [
      { cuentaCodigo: C.depreciacionGasto, debito: 2160 },
      { cuentaCodigo: C.depreciacionEquipo, credito: 1800 },      // ✅ separado
      { cuentaCodigo: C.depreciacionMobiliario, credito: 160 },   // ✅ separado
      { cuentaCodigo: C.amortizacionDominio, credito: 200 }       // ✅ separado
    ]
  });

  /* ---------------------------------------------------------
     IT referencial anual
     ✅ CORREGIDO: va a gastos por impuestos (6.4.01), no a otros gastos
     --------------------------------------------------------- */
  if (REGISTRAR_IT_EN_DIARIO) {
    const trxITId = newTransactionId();
    const jeIT = addEntry({
      fecha: date(ANIO, 12, 31),
      descripcion: "IT referencial anual 3% sobre ingresos Bs 49.450 = Bs 1.484, pagado en caja",
      transaccionId: trxITId,
      lines: [
        { cuentaCodigo: C.gastosImpuestos, debito: 1484 }, // ✅ separado
        { cuentaCodigo: C.caja, credito: 1484 }
      ],
      observacion: "Registrado como gasto pagado para cuadrar caja y estado de resultados del Capítulo 5."
    });

    addTransaction({
      id: trxITId,
      fecha: date(ANIO, 12, 31),
      tipo: "gasto",
      cuenta: "Gastos por impuestos (IT)", // ✅ CORREGIDO
      monto: 1484,
      tercero: "SIN – IT referencial pagado",
      formaPago: "banco",
      journalEntryId: jeIT,
      observacion: "Impuesto referencial del emprendimiento propio."
    });
  }

  /* ---------------------------------------------------------
     ✅ OPCIONAL: Asiento de cierre
     Por defecto desactivado. El módulo cierre.js lo genera aparte.
     --------------------------------------------------------- */
  if (REGISTRAR_CIERRE_EN_DIARIO) {
    addEntry({
      fecha: date(ANIO, 12, 31),
      tipoAsiento: "cierre",
      descripcion: "Cierre anual: traslado de ingresos y gastos al resultado del ejercicio",
      lines: [
        { cuentaCodigo: C.ventas, debito: 41850 },
        { cuentaCodigo: C.otrosIngresos, debito: 7600 },
        { cuentaCodigo: C.costoVentas, credito: 3255 },
        { cuentaCodigo: C.gastosAdministracion, credito: 4440 },
        { cuentaCodigo: C.gastosPersonalSueldos, credito: 19800 },
        { cuentaCodigo: C.gastosPersonalCNS, credito: 1980 },
        { cuentaCodigo: C.gastosPersonalProvision, credito: 3300 },
        { cuentaCodigo: C.depreciacionGasto, credito: 2160 },
        { cuentaCodigo: C.gastosImpuestos, credito: 1484 },
        { cuentaCodigo: C.resultadosDelEjercicio, credito: 13031 }
      ],
      observacion: "Cierre del ejercicio según Capítulo 5.6 asiento 10. Utilidad neta: Bs 13.031."
    });
  }

  /* ---------------------------------------------------------
     Activos fijos
     ✅ CORREGIDO: cada uno con sus cuentas separadas
     --------------------------------------------------------- */
  const fixedAssets = [
    {
      id: "FA-0003",
      clienteId: CLIENT_ID,
      descripcion: "Equipo de computación – laptops e impresora",
      categoria: "equipoComputo",
      cuentaActivo: C.equipoComputo,               // ✅
      cuentaDepreciacion: C.depreciacionEquipo,    // ✅
      cuentaGastoDepreciacion: C.depreciacionGasto,
      fechaAdquisicion: date(ANIO, 1, 18),
      costoAdquisicion: 7200,
      valorResidual: 0,
      vidaUtilMeses: 48,
      depreciacionMensual: 150,
      depreciacionAcumulada: 1800,
      estado: "activo",
      observacion: "Activo fijo del Capítulo 5. Depreciación línea recta 4 años."
    },
    {
      id: "FA-0004",
      clienteId: CLIENT_ID,
      descripcion: "Mobiliario y equipo de oficina",
      categoria: "mobiliario_equipo",
      cuentaActivo: C.mobiliarioOficina,           // ✅
      cuentaDepreciacion: C.depreciacionMobiliario, // ✅
      cuentaGastoDepreciacion: C.depreciacionGasto,
      fechaAdquisicion: date(ANIO, 1, 15),
      costoAdquisicion: 800,
      valorResidual: 0,
      vidaUtilMeses: 60,
      depreciacionMensual: 13.33,
      depreciacionAcumulada: 160,
      estado: "activo",
      observacion: "Mobiliario básico. Depreciación línea recta 5 años."
    },
    {
      id: "FA-0005",
      clienteId: CLIENT_ID,
      descripcion: "Activo intangible – dominio web",
      categoria: "intangible",
      cuentaActivo: C.intangibles,                 // ✅
      cuentaDepreciacion: C.amortizacionDominio,   // ✅
      cuentaGastoDepreciacion: C.depreciacionGasto,
      fechaAdquisicion: date(ANIO, 1, 20),
      costoAdquisicion: 200,
      valorResidual: 0,
      vidaUtilMeses: 12,
      depreciacionMensual: 16.67,
      depreciacionAcumulada: 200,
      estado: "activo",
      observacion: "Dominio web por un año. Amortización total en el ejercicio."
    }
  ];

  /* ---------------------------------------------------------
     ✅ CORREGIDO: 12 impuestos mensuales informativos
     Base = ventas + otros ingresos del mes. Tasa 3%.
     La suma anual da 1.483,50 ≈ 1.484 (regularización en Diario).
     --------------------------------------------------------- */
  const taxes = REGISTRAR_IT_EN_IMPUESTOS
    ? flujoMensual.map((m) => {
        const base = m.paquetes + m.otros;
        const monto = round2(base * 0.03);
        return {
          id: `IMP-${pad(100 + m.mes)}`, // IMP-0101 a IMP-0112 (no colisiona)
          clienteId: CLIENT_ID,
          periodoId: periodIdByMes[m.mes],
          tipo: "IT",
          concepto: "ventas_mas_otros_ingresos", // ✅ CORREGIDO: incluye otros ingresos
          baseImponible: base,
          tasa: 0.03,
          monto: monto,
          fechaCalculo: date(ANIO, m.mes, 28),
          observacion: `IT referencial mensual mes ${m.mes}: 3% de Bs ${base} = Bs ${monto}. Informativo.`
        };
      })
    : [];

  /* ---------------------------------------------------------
     Obligaciones tributarias
     Se mantiene 1 obligación anual pagada (coincide con asiento D-0065).
     --------------------------------------------------------- */
  const obligations = REGISTRAR_IT_EN_DIARIO
    ? [
        {
          id: "OBL-0004",
          clienteId: CLIENT_ID,
          periodoId: periodIdByMes[12],
          tipo: "IT",
          descripcion: "IT referencial anual pagado en Libro Diario (Bs 1.484)",
          fechaVencimiento: date(ANIO, 12, 31),
          montoEstimado: 1484,
          estado: "pagada",
          observacion:
            "Obligación referencial académica. La suma de los 12 cálculos mensuales (Bs 1.483,50) se regulariza a Bs 1.484 en el asiento anual del Diario."
        }
      ]
    : [];

  /* ---------------------------------------------------------
     Alertas
     --------------------------------------------------------- */
  const alerts = [
    {
      id: "ALR-0006",
      clienteId: CLIENT_ID,
      periodoId: periodIdByMes[12],
      obligacionId: REGISTRAR_IT_EN_DIARIO ? "OBL-0004" : null,
      asientoId: null,
      tipo: "otro",
      nivel: "informativa",
      titulo: "IT referencial pagado",
      mensaje:
        "Cuentas Claras registró el IT referencial anual como gasto pagado en Libro Diario (Bs 1.484) para cuadrar caja y estado de resultados del Capítulo 5.",
      fechaAlerta: date(ANIO, 12, 31),
      estado: "resuelta"
    },
    {
      id: "ALR-0007",
      clienteId: CLIENT_ID,
      periodoId: periodIdByMes[12],
      obligacionId: null,
      asientoId: null,
      tipo: "otro",
      nivel: "informativa",
      titulo: "Provisión de beneficios sociales",
      mensaje:
        "El sistema registra provisión de beneficios sociales por Bs 3.300 en la cuenta 2.1.04 al cierre del año 1.",
      fechaAlerta: date(ANIO, 12, 31),
      estado: "pendiente"
    }
  ];

  /* ---------------------------------------------------------
     Reportes
     --------------------------------------------------------- */
  const reports = [
    {
      id: "REP-0002",
      clienteId: CLIENT_ID,
      periodoId: periodIdByMes[12],
      tipo: "final",
      fechaGeneracion: date(ANIO, 12, 31),
      resumen: {
        ingresosTotales: 49450,
        costosVariables: 3255,
        costosFijos: 4440,
        retiroRemunerado: 21780,
        utilidadCaja: 19975,
        depreciacionAmortizacion: 2160,
        provisionBeneficiosSociales: 3300,
        impuestosReferenciales: 1484,
        utilidadContable: 13031
      },
      snapshotId: null,
      archivoNombre: "",
      estado: "generado",
      observacion: "Reporte anual del Cliente 001 basado en el Capítulo 5."
    }
  ];

  /* ---------------------------------------------------------
     Bitácora
     --------------------------------------------------------- */
  const logs = [
    {
      id: "LOG-0003",
      usuarioId: "SYSTEM",
      accion: "cargar_seed_emprendimiento",
      entidad: "clients",
      registroId: CLIENT_ID,
      fecha: nowISO(),
      detalle: "Seed complementario del Cliente 001 – Cuentas Claras cargado o mergeado."
    }
  ];

  /* ---------------------------------------------------------
     Contadores
     --------------------------------------------------------- */
  const generatedCounters = {
    CLI: Math.max(4, Number(base?.counters?.CLI) || 0),
    PER: Math.max(PERIODO_INICIAL + 11, Number(base?.counters?.PER) || 0),
    DOC: Math.max(24, Number(base?.counters?.DOC) || 0),
    TRX: Math.max(trxSeq - 1, Number(base?.counters?.TRX) || 0),
    IMP: Math.max(120, Number(base?.counters?.IMP) || 0), // ✅ 100 + 12 + buffer
    OBL: Math.max(4, Number(base?.counters?.OBL) || 0),
    ALR: Math.max(7, Number(base?.counters?.ALR) || 0),
    REP: Math.max(2, Number(base?.counters?.REP) || 0),
    LOG: Math.max(3, Number(base?.counters?.LOG) || 0),
    JE: journalEntries.length,
    JL: journalLines.length,
    FA: Math.max(5, Number(base?.counters?.FA) || 0),
    FS: Number(base?.counters?.FS) || 0
  };

  const data = {
    clients,
    periods,
    documents,
    transactions,
    accounts: [],
    fixedAssets,
    taxes,
    obligations,
    journalEntries,
    journalLines,
    financialSnapshots: [],
    alerts,
    reports,
    logs,
    counters: generatedCounters
  };

  /* ---------------------------------------------------------
     Merge con CC_SEED original
     --------------------------------------------------------- */
  function mergeIntoBase() {
    if (!base) return false;
    if (base.__ccEmprendimientoMerged) return true;

    const arrayKeys = [
      "clients", "periods", "documents", "transactions",
      "fixedAssets", "taxes", "obligations", "journalEntries",
      "journalLines", "alerts", "reports", "logs"
    ];

    arrayKeys.forEach((key) => {
      if (!Array.isArray(base[key])) base[key] = [];
      if (!Array.isArray(data[key])) return;

      const existingIds = new Set(base[key].map((item) => item.id));

      data[key].forEach((item) => {
        if (!existingIds.has(item.id)) {
          base[key].push(item);
        }
      });
    });

    if (!Array.isArray(base.accounts)) base.accounts = [];

    const existingCodes = new Set(
      base.accounts.map((account) => String(account.codigo || account.id || ""))
    );

    catalog.forEach((account, index) => {
      const code = String(account.codigo || "");
      if (!code) return;

      if (!existingCodes.has(code)) {
        base.accounts.push({
          id: account.id || `ACC-${pad(index + 1)}`,
          ...account
        });
        existingCodes.add(code);
      }
    });

    base.counters = base.counters || {};

    Object.keys(generatedCounters).forEach((key) => {
      base.counters[key] = Math.max(
        Number(base.counters[key] || 0),
        Number(generatedCounters[key] || 0)
      );
    });

    base.settings = base.settings || {};
    base.settings.emprendimientoMerged = true;
    base.__ccEmprendimientoMerged = true;

    return true;
  }

  /* ---------------------------------------------------------
     Fallback por si CC_SEED no existe
     --------------------------------------------------------- */
  function writeFallback() {
    const storage = window.CC_STORAGE;

    const accounts = catalog.map((account, index) => ({
      id: account.id || `ACC-${pad(index + 1)}`,
      ...account
    }));

    const payload = {
      users: base?.users || [],
      clients: base?.clients ? [...base.clients, ...clients] : clients,
      periods: base?.periods ? [...base.periods, ...periods] : periods,
      documents: base?.documents ? [...base.documents, ...documents] : documents,
      transactions: base?.transactions ? [...base.transactions, ...transactions] : transactions,
      accounts: base?.accounts?.length ? base.accounts : accounts,
      fixedAssets: base?.fixedAssets ? [...base.fixedAssets, ...fixedAssets] : fixedAssets,
      taxes: base?.taxes ? [...base.taxes, ...taxes] : taxes,
      obligations: base?.obligations ? [...base.obligations, ...obligations] : obligations,
      journalEntries: base?.journalEntries ? [...base.journalEntries, ...journalEntries] : journalEntries,
      journalLines: base?.journalLines ? [...base.journalLines, ...journalLines] : journalLines,
      financialSnapshots: base?.financialSnapshots || [],
      alerts: base?.alerts ? [...base.alerts, ...alerts] : alerts,
      reports: base?.reports ? [...base.reports, ...reports] : reports,
      logs: base?.logs ? [...base.logs, ...logs] : logs
    };

    if (storage && typeof storage.setList === "function") {
      Object.entries(payload).forEach(([name, value]) => {
        storage.setList(name, value);
      });

      if (storage.setCounters) {
        storage.setCounters({ ...(base?.counters || {}), ...generatedCounters });
      }

      return true;
    }

    Object.entries(cfg.keys).forEach(([name, key]) => {
      if (!key || !key.startsWith("cc_")) return;
      const value = payload[name];
      if (Array.isArray(value)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });

    localStorage.setItem(cfg.keys.counters, JSON.stringify(generatedCounters));

    return true;
  }

  /* ---------------------------------------------------------
     Load principal
     --------------------------------------------------------- */
  function load(options = {}) {
    mergeIntoBase();

    let ok = false;

    if (window.CC_STORAGE && typeof window.CC_STORAGE.loadSeed === "function" && window.CC_SEED) {
      ok = window.CC_STORAGE.loadSeed(true) !== false;
    } else {
      ok = writeFallback();
    }

    if (ok && window.CC_STORAGE && typeof window.CC_STORAGE.recalcCounters === "function") {
      window.CC_STORAGE.recalcCounters();
    }

    const summary = {
      ok,
      cliente: CLIENT_ID,
      nombre: CLIENT_NAME,
      periodos: periods.length,
      documentos: documents.length,
      transacciones: transactions.length,
      asientos: journalEntries.length,
      lineasDiario: journalLines.length,
      activosFijos: fixedAssets.length,
      impuestos: taxes.length,
      obligaciones: obligations.length,
      alertas: alerts.length,
      reportes: reports.length
    };

    console.log("✅ Seed del emprendimiento propio listo.", summary);
    console.table(summary);

    if (ok && options.reload) {
      window.location.reload();
    }

    return summary;
  }

  /* ---------------------------------------------------------
     Respaldo previo
     --------------------------------------------------------- */
  function respaldo() {
    const output = {};
    Object.entries(cfg.keys).forEach(([name, key]) => {
      if (typeof key === "string" && key.startsWith("cc_")) {
        output[key] = localStorage.getItem(key);
      }
    });

    const blob = new Blob([JSON.stringify(output, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `respaldo-previo-seed-emprendimiento-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(a.href), 1000);

    console.log("🧾 Respaldo previo descargado.");
    return true;
  }

  /* ---------------------------------------------------------
     Verificación de cuadre
     ✅ CORREGIDO: usa las nuevas cuentas separadas
     --------------------------------------------------------- */
  function getList(name) {
    if (window.CC_STORAGE && typeof window.CC_STORAGE.list === "function") {
      return window.CC_STORAGE.list(name) || [];
    }
    const key = cfg.keys[name];
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
      console.error(`Error leyendo ${key}:`, error);
      return [];
    }
  }

  function verificar() {
    // Excluye asientos de cierre para mostrar el estado PRE-CIERRE
    const closingEntryIds = getList("journalEntries")
      .filter(e => e.clienteId === CLIENT_ID && e.tipoAsiento === "cierre" && e.estado === "vigente")
      .map(e => e.id);

    const lines = getList("journalLines").filter(
      (line) => line.clienteId === CLIENT_ID && !closingEntryIds.includes(line.asientoId)
    );

    const totalDebe = round2(lines.reduce((sum, line) => sum + Number(line.debito || 0), 0));
    const totalHaber = round2(lines.reduce((sum, line) => sum + Number(line.credito || 0), 0));

    const byAccount = {};
    lines.forEach((line) => {
      const code = line.cuentaCodigo;
      if (!byAccount[code]) byAccount[code] = { debito: 0, credito: 0 };
      byAccount[code].debito += Number(line.debito || 0);
      byAccount[code].credito += Number(line.credito || 0);
    });

    let saldoDeudorTotal = 0;
    let saldoAcreedorTotal = 0;

    Object.entries(byAccount).forEach(([code, acc]) => {
      const netDeudor = round2(acc.debito - acc.credito);
      const netAcreedor = round2(acc.credito - acc.debito);
      const nature = accNature(code);

      if (nature === "deudora") {
        if (netDeudor >= 0) saldoDeudorTotal += netDeudor;
        else saldoAcreedorTotal += Math.abs(netDeudor);
      } else {
        if (netAcreedor >= 0) saldoAcreedorTotal += netAcreedor;
        else saldoDeudorTotal += Math.abs(netAcreedor);
      }
    });

    function balance(code) {
      const acc = byAccount[code];
      if (!acc) return 0;
      return round2(acc.debito - acc.credito);
    }

    function creditBalance(code) {
      const acc = byAccount[code];
      if (!acc) return 0;
      return round2(acc.credito - acc.debito);
    }

    const caja = balance(C.caja);
    const ingresos = creditBalance(C.ventas) + creditBalance(C.otrosIngresos);

    // ✅ CORREGIDO: incluye gastos de personal y gastos por impuestos
    const costosYGastos =
      balance(C.costoVentas) +
      balance(C.gastosAdministracion) +
      balance(C.gastosVenta) +
      balance(C.gastosFinancieros) +
      balance(C.depreciacionGasto) +
      balance(C.gastosPersonalSueldos) +
      balance(C.gastosPersonalCNS) +
      balance(C.gastosPersonalProvision) +
      balance(C.gastosImpuestos) +
      balance(C.otrosGastos);

    const utilidadContable = round2(ingresos - costosYGastos);

    const provisionBS = creditBalance(C.provisionBS);
    const capital = creditBalance(C.capital);
    const resultadosAcumulados = creditBalance(C.resultadosAcumulados);

    const patrimonio = round2(capital + resultadosAcumulados + utilidadContable);

    // ✅ CORREGIDO: separa equipo + mobiliario + intangible, y sus depreciaciones
    const activoNoCorrienteNeto = round2(
      balance(C.equipoComputo) +
      balance(C.mobiliarioOficina) +
      balance(C.intangibles) -
      creditBalance(C.depreciacionEquipo) -
      creditBalance(C.depreciacionMobiliario) -
      creditBalance(C.amortizacionDominio)
    );

    const totalActivo = round2(caja + activoNoCorrienteNeto);
    const totalPasivoPatrimonio = round2(provisionBS + patrimonio);

    const resultado = {
      clienteId: CLIENT_ID,
      cuadraPartidaDoble: Math.abs(totalDebe - totalHaber) <= 0.01,
      totalDebeMovimientos: totalDebe,
      totalHaberMovimientos: totalHaber,
      saldoDeudorTotal: round2(saldoDeudorTotal),
      saldoAcreedorTotal: round2(saldoAcreedorTotal),
      cuadraBalanzaSaldos: Math.abs(round2(saldoDeudorTotal) - round2(saldoAcreedorTotal)) <= 0.01,
      cajaEsperada: 20091,
      cajaCalculada: caja,
      ingresosEsperados: 49450,
      ingresosCalculados: ingresos,
      utilidadContableEsperada: 13031,
      utilidadContableCalculada: utilidadContable,
      provisionBSEsperada: 3300,
      provisionBSCalculada: provisionBS,
      totalActivoEsperado: 26131,
      totalActivoCalculado: totalActivo,
      totalPasivoPatrimonioEsperado: 26131,
      totalPasivoPatrimonioCalculado: totalPasivoPatrimonio,
      lineasEncontradas: lines.length,
      asientosCierreExcluidos: closingEntryIds.length
    };

    const ok =
      resultado.cuadraPartidaDoble &&
      resultado.cuadraBalanzaSaldos &&
      Math.abs(resultado.cajaCalculada - resultado.cajaEsperada) <= 0.01 &&
      Math.abs(resultado.ingresosCalculados - resultado.ingresosEsperados) <= 0.01 &&
      Math.abs(resultado.utilidadContableCalculada - resultado.utilidadContableEsperada) <= 0.01 &&
      Math.abs(resultado.provisionBSCalculada - resultado.provisionBSEsperada) <= 0.01 &&
      Math.abs(resultado.totalActivoCalculado - resultado.totalActivoEsperado) <= 0.01 &&
      Math.abs(resultado.totalPasivoPatrimonioCalculado - resultado.totalPasivoPatrimonioEsperado) <= 0.01;

    resultado.ok = ok;

    console.log("🔎 Verificación del seed del emprendimiento:", resultado);
    console.table(resultado);

    return resultado;
  }

  /* ---------------------------------------------------------
     Auto-merge al cargar el script
     --------------------------------------------------------- */
  mergeIntoBase();

  return {
    data,
    load,
    respaldo,
    verificar,
    mergeIntoBase,
    CLIENT_ID,
    CLIENT_NAME,
    ACCOUNTS: C
  };
})();