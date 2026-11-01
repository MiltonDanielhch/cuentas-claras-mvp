/* =========================================================
   Cuentas Claras MVP
   Configuración general del sistema
   Versión contable completa: Fase 16 (menú colapsable + documentación)
   ✅ CORREGIDO: plan de cuentas alineado con Balanza 5.7 y EE.FF. 5.9/5.10
   ========================================================= */

window.CC_CONFIG = {
  appName: "Cuentas Claras MVP",
  appTitle: "Cuentas Claras – Gestión Contable Digital",
  appSubtitle: "Modelo de gestión contable digital para microempresas",
  version: "0.2.1",
  storageVersion: 2,

  storagePrefix: "cc_",

  keys: {
    version: "cc_storage_version",
    session: "cc_session",
    users: "cc_users",
    clients: "cc_clients",
    periods: "cc_periods",
    documents: "cc_documents",
    transactions: "cc_transactions",
    taxes: "cc_taxes",
    obligations: "cc_obligations",
    accounts: "cc_accounts",
    journalEntries: "cc_journal_entries",
    journalLines: "cc_journal_lines",
    fixedAssets: "cc_fixed_assets",
    financialSnapshots: "cc_financial_snapshots",
    alerts: "cc_alerts",
    reports: "cc_reports",
    logs: "cc_logs",
    settings: "cc_settings",
    counters: "cc_counters"
  },

  routes: {
    landing: "./index.html",
    login: "./login.html",
    dashboard: "./dashboard.html",
    clientes: "./clientes.html",
    periodos: "./periodos.html",
    documentos: "./documentos.html",
    transacciones: "./transacciones.html",
    impuestos: "./impuestos.html",
    libroDiario: "./libro-diario.html",
    libroMayor: "./libro-mayor.html",
    balanza: "./balanza.html",
    ajustes: "./ajustes.html",
    estadosFinancieros: "./estados-financieros.html",
    costosIndicadores: "./costos-indicadores.html",
    alertas: "./alertas.html",
    reportes: "./reportes.html",
    respaldo: "./respaldo.html",
    ayuda: "./ayuda.html",
    documentacion: "./documentacion.html",
    notFound: "./404.html"
  },

  publicRoutes: [
    "./index.html",
    "./login.html",
    "./404.html",
    "./documentacion.html"
  ],

  defaultPrivateRoute: "./dashboard.html",
  defaultPublicRoute: "./login.html",

  menu: [
    { id: "dashboard", label: "Inicio", href: "./dashboard.html", icon: "bi-speedometer2", page: "dashboard" },
    { id: "clientes", label: "Clientes", href: "./clientes.html", icon: "bi-shop", page: "clientes" },
    { id: "periodos", label: "Periodos", href: "./periodos.html", icon: "bi-calendar3", page: "periodos" },
    { id: "documentos", label: "Documentos", href: "./documentos.html", icon: "bi-file-earmark-text", page: "documentos" },
    { id: "transacciones", label: "Transacciones", href: "./transacciones.html", icon: "bi-cash-coin", page: "transacciones" },
    { id: "impuestos", label: "Impuestos", href: "./impuestos.html", icon: "bi-percent", page: "impuestos" },
    { id: "libro-diario", label: "Libro Diario", href: "./libro-diario.html", icon: "bi-journal-bookmark", page: "libro-diario" },
    { id: "libro-mayor", label: "Libro Mayor", href: "./libro-mayor.html", icon: "bi-journal-text", page: "libro-mayor" },
    { id: "balanza", label: "Balanza", href: "./balanza.html", icon: "bi-list-columns", page: "balanza" },
    { id: "ajustes", label: "Ajustes", href: "./ajustes.html", icon: "bi-tools", page: "ajustes" },
    { id: "estados-financieros", label: "Estados Fin.", href: "./estados-financieros.html", icon: "bi-graph-up-arrow", page: "estados-financieros" },
    { id: "costos-indicadores", label: "Costos e Indic.", href: "./costos-indicadores.html", icon: "bi-clipboard-data", page: "costos-indicadores" },
    { id: "alertas", label: "Alertas", href: "./alertas.html", icon: "bi-bell", page: "alertas" },
    { id: "reportes", label: "Reportes", href: "./reportes.html", icon: "bi-file-earmark-bar-graph", page: "reportes" },
    { id: "respaldo", label: "Respaldo", href: "./respaldo.html", icon: "bi-hdd-stack", page: "respaldo" },
    { id: "ayuda", label: "Ayuda", href: "./ayuda.html", icon: "bi-question-circle", page: "ayuda" },
    { id: "documentacion", label: "Documentación", href: "./documentacion.html", icon: "bi-book", page: "documentacion" }
  ],

  roles: {
    administrador: "administrador",
    contador: "contador",
    consulta: "consulta"
  },

  demoCredentials: [
    { usuario: "admin", password: "Admin123", rol: "administrador", nombre: "Administrador" },
    { usuario: "contador", password: "Contador123", rol: "contador", nombre: "Contador" }
  ],

  currency: "Bs",
  locale: "es-BO",

  taxRates: {
    IVA: 0.13,
    IT: 0.03
  },

  regimes: [
    "Régimen General",
    "Régimen Simplificado",
    "Otro",
    "Por definir"
  ],

  businessTypes: [
    "Abarrotes",
    "Tienda de barrio",
    "Ferretería",
    "Mercado",
    "Feria",
    "Distribución menor",
    "Servicios",
    "Otro"
  ],

  documentTypes: [
    { value: "factura_venta", label: "Factura de venta" },
    { value: "factura_compra", label: "Factura de compra" },
    { value: "recibo", label: "Recibo" },
    { value: "nota", label: "Nota" },
    { value: "extracto", label: "Extracto bancario" },
    { value: "planilla_sueldos", label: "Planilla de sueldos" }, // ✅ NUEVO (para alertas)
    { value: "otro", label: "Otro documento" }
  ],

  // ✅ CORREGIDO: se agregan "aporte" y "compra_activo" para clasificar bien
  transactionTypes: [
    { value: "venta", label: "Venta" },
    { value: "compra", label: "Compra" },
    { value: "gasto", label: "Gasto" },
    { value: "ingreso", label: "Ingreso" },
    { value: "aporte", label: "Aporte de capital" },
    { value: "compra_activo", label: "Compra de activo fijo" }
  ],

  paymentMethods: [
    "efectivo",
    "banco",
    "tarjeta",
    "transferencia",
    "credito",
    "aporte",
    "otro"
  ],

  periodStates: [
    { value: "abierto", label: "Abierto" },
    { value: "en_revision", label: "En revisión" },
    { value: "cerrado", label: "Cerrado" }
  ],

  documentStates: [
    { value: "pendiente", label: "Pendiente" },
    { value: "recibido", label: "Recibido" },
    { value: "validado", label: "Validado" },
    { value: "rechazado", label: "Rechazado" }
  ],

  transactionStates: [
    { value: "activa", label: "Activa" },
    { value: "anulada", label: "Anulada" }
  ],

  obligationStates: [
    { value: "pendiente", label: "Pendiente" },
    { value: "en_proceso", label: "En proceso" },
    { value: "presentada", label: "Presentada" },
    { value: "pagada", label: "Pagada" },
    { value: "vencida", label: "Vencida" },
    { value: "anulada", label: "Anulada" }
  ],

  journalEntryTypes: [
    { value: "operacion", label: "Operación" },
    { value: "ajuste", label: "Ajuste" },
    { value: "cierre", label: "Cierre" },
    { value: "apertura", label: "Apertura" }
  ],

  adjustmentCategories: [
    { value: "depreciacion", label: "Depreciación" },
    { value: "amortizacion", label: "Amortización" },
    { value: "provision", label: "Provisión" },
    { value: "devengado", label: "Devengado" },
    { value: "reclasificacion", label: "Reclasificación" },
    { value: "inventario_final", label: "Inventario final" },
    { value: "inventario_inicial", label: "Inventario inicial" },
    { value: "otro", label: "Otro ajuste" }
  ],

  journalOrigins: [
    { value: "automatico", label: "Automático" },
    { value: "manual", label: "Manual" }
  ],

  journalEntryStates: [
    { value: "vigente", label: "Vigente" },
    { value: "anulado", label: "Anulado" }
  ],

  accountTypes: [
    { value: "activo", label: "Activo" },
    { value: "pasivo", label: "Pasivo" },
    { value: "patrimonio", label: "Patrimonio" },
    { value: "ingreso", label: "Ingreso" },
    { value: "costo", label: "Costo" },
    { value: "gasto", label: "Gasto" }
  ],

  accountNatures: [
    { value: "deudora", label: "Deudora" },
    { value: "acreedora", label: "Acreedora" }
  ],

  alertTypes: [
    { value: "vencimiento_tributario", label: "Vencimiento tributario" },
    { value: "documento_pendiente", label: "Documento pendiente" },
    { value: "periodo_sin_cerrar", label: "Periodo sin cerrar" },
    { value: "transaccion_sin_documento", label: "Transacción sin documento" },
    { value: "transaccion_sin_asiento", label: "Transacción sin asiento" },
    { value: "impuesto_no_calculado", label: "Impuesto no calculado" },
    { value: "balanza_descuadrada", label: "Balanza descuadrada" },
    { value: "cobranza_pendiente", label: "Cobranza pendiente" },
    { value: "otro", label: "Otra alerta" }
  ],

  alertLevels: [
    { value: "informativa", label: "Informativa" },
    { value: "preventiva", label: "Preventiva" },
    { value: "urgente", label: "Urgente" },
    { value: "vencida", label: "Vencida" }
  ],

  alertStates: [
    { value: "pendiente", label: "Pendiente" },
    { value: "vista", label: "Vista" },
    { value: "resuelta", label: "Resuelta" },
    { value: "vencida", label: "Vencida" }
  ],

  reportTypes: [
    { value: "mensual", label: "Reporte mensual" },
    { value: "borrador", label: "Borrador" },
    { value: "final", label: "Reporte final" }
  ],

  reportStates: [
    { value: "borrador", label: "Borrador" },
    { value: "generado", label: "Generado" },
    { value: "enviado", label: "Enviado" },
    { value: "anulado", label: "Anulado" }
  ],

  genericDueDay: 20,
  alertDaysBefore: 7,
  urgentDaysBefore: 3,

  depreciationMethod: "lineal_simple",
  inventoryMethod: "periodico_simplificado",

  autoSeedOnFirstRun: true,
  maxAttachmentKB: 300,

  /* =========================================================
     ✅ CORREGIDO: Plan de cuentas simplificado para microempresa comercial
     Alineado con la Balanza de Comprobación 5.7 y los EE.FF. 5.9 / 5.10
     - 1.2.01 Equipo de computación (7.200) separado de 1.2.02 Mobiliario (800)
     - 1.2.04 / 1.2.05 / 1.2.06: depreciación y amortización separadas
     - 2.1.04 renombrada a "Provisión de beneficios sociales por pagar"
     - 3.1.02 renombrada a "Resultado de arranque"
     - 6.2.01/02/03 Gastos de personal desglosados
     - 6.4.01 Gastos por impuestos (IT)
     ========================================================= */
  accountCatalog: [
    // ===== ACTIVO CORRIENTE =====
    { codigo: "1.1.01", nombre: "Caja y bancos", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "Efectivo en mano y cuentas bancarias." }, // ✅ renombrada
    { codigo: "1.1.02", nombre: "Bancos", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "Cuentas bancarias o monedero digital." },
    { codigo: "1.1.03", nombre: "Clientes / Cuentas por cobrar", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "Ventas a crédito por cobrar." },
    { codigo: "1.1.04", nombre: "Inventario de mercancías", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "Mercadería disponible para venta." },
    { codigo: "1.1.05", nombre: "IVA Crédito Fiscal", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "IVA trasladado en compras, Régimen General." },
    { codigo: "1.1.06", nombre: "Otras cuentas por cobrar", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "Préstamos, anticipos u otros cobros." },

    // ===== ACTIVO NO CORRIENTE (✅ CORREGIDO: separado) =====
    { codigo: "1.2.01", nombre: "Equipo de computación", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.2", estado: "activa", observacion: "Laptops, impresora y equipos de cómputo. Bs 7.200." },
    { codigo: "1.2.02", nombre: "Mobiliario y equipo de oficina", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.2", estado: "activa", observacion: "Mobiliario básico de oficina. Bs 800." },
    { codigo: "1.2.03", nombre: "Activo intangible – dominio", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.2", estado: "activa", observacion: "Dominio web y licencias. Bs 200." },
    { codigo: "1.2.04", nombre: "Depreciación acumulada – equipo", tipo: "activo", naturaleza: "acreedora", esTemporal: false, esContra: true, nivel: 3, codigoPadre: "1.2", estado: "activa", observacion: "Cuenta compensadora del equipo de computación. Al cierre: Bs 1.800." },
    { codigo: "1.2.05", nombre: "Depreciación acumulada – mobiliario", tipo: "activo", naturaleza: "acreedora", esTemporal: false, esContra: true, nivel: 3, codigoPadre: "1.2", estado: "activa", observacion: "Cuenta compensadora del mobiliario. Al cierre: Bs 160." },
    { codigo: "1.2.06", nombre: "Amortización acumulada – dominio", tipo: "activo", naturaleza: "acreedora", esTemporal: false, esContra: true, nivel: 3, codigoPadre: "1.2", estado: "activa", observacion: "Cuenta compensadora del intangible. Al cierre: Bs 200." },

    // ===== PASIVO CORRIENTE =====
    { codigo: "2.1.01", nombre: "Proveedores / Cuentas por pagar", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.1", estado: "activa", observacion: "Deudas con proveedores." },
    { codigo: "2.1.02", nombre: "IVA Débito Fiscal", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.1", estado: "activa", observacion: "IVA cobrado en ventas, Régimen General." },
    { codigo: "2.1.03", nombre: "Impuestos por pagar", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.1", estado: "activa", observacion: "IT, RC-IVA, IUE u otros impuestos por pagar." },
    { codigo: "2.1.04", nombre: "Provisión de beneficios sociales por pagar", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.1", estado: "activa", observacion: "Aguinaldo, prima, vacaciones e indemnización devengados. Al cierre: Bs 3.300." }, // ✅ renombrada
    { codigo: "2.1.05", nombre: "Otros pasivos corrientes", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.1", estado: "activa", observacion: "Otros compromisos de corto plazo." },

    // ===== PASIVO NO CORRIENTE =====
    { codigo: "2.2.01", nombre: "Préstamos a largo plazo", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.2", estado: "activa", observacion: "Deudas financieras de largo plazo." },

    // ===== PATRIMONIO =====
    { codigo: "3.1.01", nombre: "Capital social", tipo: "patrimonio", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "3.1", estado: "activa", observacion: "Aportes del dueño o socia/o. Bs 10.800." }, // ✅ renombrada
    { codigo: "3.1.02", nombre: "Resultado de arranque (gastos de constitución)", tipo: "patrimonio", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "3.1", estado: "activa", observacion: "Gastos preoperativos de Bs 1.000 reconocidos contra patrimonio de apertura." }, // ✅ renombrada
    { codigo: "3.1.03", nombre: "Resultados del ejercicio", tipo: "patrimonio", naturaleza: "acreedora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "3.1", estado: "activa", observacion: "Cuenta puente para cierre del periodo. Al cierre año 1: Bs 13.031." },

    // ===== INGRESOS =====
    { codigo: "4.1.01", nombre: "Ingresos por servicios", tipo: "ingreso", naturaleza: "acreedora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "4.1", estado: "activa", observacion: "Paquetes de servicio contable. Al cierre: Bs 41.850." }, // ✅ renombrada
    { codigo: "4.1.02", nombre: "Otros ingresos", tipo: "ingreso", naturaleza: "acreedora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "4.1", estado: "activa", observacion: "Talleres y asesorías. Al cierre: Bs 7.600." },

    // ===== COSTOS =====
    { codigo: "5.1.01", nombre: "Costo de servicios prestados", tipo: "costo", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "5.1", estado: "activa", observacion: "Costos variables por cliente atendido. Al cierre: Bs 3.255." }, // ✅ renombrada
    { codigo: "5.1.02", nombre: "Devoluciones y descuentos sobre compras", tipo: "costo", naturaleza: "acreedora", esTemporal: true, esContra: true, nivel: 3, codigoPadre: "5.1", estado: "activa", observacion: "Cuenta compensadora de costos." },

    // ===== GASTOS OPERATIVOS =====
    { codigo: "6.1.01", nombre: "Gastos operativos fijos", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.1", estado: "activa", observacion: "Internet, energía, telefonía, transporte y soporte. Al cierre: Bs 4.440." }, // ✅ renombrada
    { codigo: "6.1.02", nombre: "Gastos de venta", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.1", estado: "activa", observacion: "Transporte, publicidad, comisiones." },
    { codigo: "6.1.03", nombre: "Gastos financieros", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.1", estado: "activa", observacion: "Intereses, comisiones bancarias." },
    { codigo: "6.1.04", nombre: "Depreciación y amortización", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.1", estado: "activa", observacion: "Gasto por depreciación y amortización. Al cierre: Bs 2.160." },
    { codigo: "6.1.05", nombre: "Otros gastos", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.1", estado: "activa", observacion: "Gastos no clasificados." },

    // ===== GASTOS DE PERSONAL (✅ NUEVAS: desglosadas) =====
    { codigo: "6.2.01", nombre: "Gastos de personal – sueldos", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.2", estado: "activa", observacion: "Sueldo bruto del personal. 6 meses × Bs 3.300 = Bs 19.800." },
    { codigo: "6.2.02", nombre: "Gastos de personal – CNS 10%", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.2", estado: "activa", observacion: "Aporte patronal al seguro de salud. 6 meses × Bs 330 = Bs 1.980." },
    { codigo: "6.2.03", nombre: "Gastos de personal – provisión BS", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.2", estado: "activa", observacion: "Provisión de beneficios sociales. 6 meses × Bs 550 = Bs 3.300." },

    // ===== GASTOS POR IMPUESTOS (✅ NUEVA) =====
    { codigo: "6.4.01", nombre: "Gastos por impuestos (IT)", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.4", estado: "activa", observacion: "IT referencial 3% sobre ingresos. Al cierre: Bs 1.484." }
  ],

  /* =========================================================
     ✅ CORREGIDO: Mapeo desde nombre simple hacia código de cuenta.
     Se agregan los nuevos códigos y se mantiene retrocompatibilidad
     con los nombres antiguos.
     ========================================================= */
  accountMapping: {
    // Activos corrientes
    "Caja": "1.1.01",
    "Caja y bancos": "1.1.01",
    "Bancos": "1.1.02",
    "Cuentas por cobrar": "1.1.03",
    "Clientes / Cuentas por cobrar": "1.1.03",
    "Inventario": "1.1.04",
    "Inventario de mercancías": "1.1.04",
    "IVA Crédito Fiscal": "1.1.05",
    "Otras cuentas por cobrar": "1.1.06",

    // Activos no corrientes (separados)
    "Equipo de computación": "1.2.01",
    "Mobiliario y equipo de oficina": "1.2.02",
    "Mobiliario y equipo": "1.2.02", // compatibilidad con datos antiguos
    "Activo intangible – dominio": "1.2.03",
    "Intangibles": "1.2.03", // compatibilidad con datos antiguos
    "Depreciación acumulada – equipo": "1.2.04",
    "Depreciación acumulada – mobiliario": "1.2.05",
    "Amortización acumulada – dominio": "1.2.06",
    "Depreciación acumulada": "1.2.04", // compatibilidad con datos antiguos

    // Pasivos
    "Cuentas por pagar": "2.1.01",
    "Proveedores / Cuentas por pagar": "2.1.01",
    "IVA Débito Fiscal": "2.1.02",
    "Impuestos por pagar": "2.1.03",
    "Provisión de beneficios sociales por pagar": "2.1.04",
    "Sueldos y salarios por pagar": "2.1.04", // compatibilidad con datos antiguos
    "Otros pasivos corrientes": "2.1.05",
    "Préstamos a largo plazo": "2.2.01",

    // Patrimonio
    "Capital": "3.1.01",
    "Capital social": "3.1.01",
    "Aportes del propietario": "3.1.01",
    "Resultado de arranque (gastos de constitución)": "3.1.02",
    "Resultados acumulados": "3.1.02", // compatibilidad con datos antiguos
    "Resultados del ejercicio": "3.1.03",

    // Ingresos
    "Ingresos por servicios": "4.1.01",
    "Ventas": "4.1.01", // compatibilidad con datos antiguos
    "Otros ingresos": "4.1.02",

    // Costos
    "Costo de servicios prestados": "5.1.01",
    "Costo de ventas": "5.1.01", // compatibilidad con datos antiguos
    "Compras": "5.1.01", // compatibilidad con datos antiguos
    "Compras / Costo de ventas": "5.1.01", // compatibilidad con datos antiguos
    "Devoluciones y descuentos sobre compras": "5.1.02",

    // Gastos operativos
    "Gastos operativos fijos": "6.1.01",
    "Gastos de administración": "6.1.01", // compatibilidad con datos antiguos
    "Alquiler": "6.1.01",
    "Servicios básicos": "6.1.01",
    "Gastos de venta": "6.1.02",
    "Transporte": "6.1.02",
    "Gastos financieros": "6.1.03",
    "Depreciación y amortización": "6.1.04",
    "Otros gastos": "6.1.05",

    // Gastos de personal (nuevos)
    "Gastos de personal – sueldos": "6.2.01",
    "Sueldos y cargas sociales": "6.2.01", // compatibilidad con transacciones antiguas
    "Gastos de personal – CNS 10%": "6.2.02",
    "Gastos de personal – provisión BS": "6.2.03",

    // Gastos por impuestos (nuevo)
    "Gastos por impuestos (IT)": "6.4.01"
  },

  messages: {
    localStorageWarning:
      "Los datos de este prototipo se guardan en el navegador. Exporte respaldos JSON periódicamente.",
    professionalDisclaimer:
      "Este sistema es una herramienta de apoyo contable y no sustituye la firma, certificación, auditoría o representación profesional de un Contador Público Autorizado cuando la normativa boliviana lo exija.",
    taxInfoDisclaimer:
      "Los cálculos tributarios son informativos y preventivos. No constituyen declaración automática ante el Servicio de Impuestos Nacionales.",
    accountingInfoDisclaimer:
      "Los estados financieros generados son simplificados y formativos, adaptados a microempresa comercial. No reemplazan estados financieros firmados por profesional habilitado cuando la norma lo exija.",
    trialBalanceInfo:
      "La Balanza de comprobación corresponde al periodo antes de ajustes. La Balanza ajustada incluye los asientos de ajuste registrados.",
    adjustmentInfo:
      "Los ajustes contables permiten reconocer depreciación, devengados, provisiones, reclasificaciones e inventario antes de emitir estados financieros.",
    demoMode:
      "Modo demostración activo. Puede cargar datos semilla para probar el flujo completo."
  },

  legalFooter:
    "Cuentas Claras – Prototipo académico de Contabilidad · Trinidad, Beni, Bolivia · 2026"
};