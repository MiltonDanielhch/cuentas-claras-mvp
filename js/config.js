/* =========================================================
   Cuentas Claras MVP
   Configuración general del sistema
   Versión contable completa: Fase 7
   ========================================================= */

window.CC_CONFIG = {
  appName: "Cuentas Claras MVP",
  appTitle: "Cuentas Claras – Gestión Contable Digital",
  appSubtitle: "Modelo de gestión contable digital para microempresas",
  version: "0.2.0",
  storageVersion: 2,

  // Prefixo técnico para claves de LocalStorage
  storagePrefix: "cc_",

  // Claves de almacenamiento
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

  // Rutas relativas compatibles con GitHub Pages
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
    notFound: "./404.html"
  },

  // Rutas públicas que no requieren sesión
  publicRoutes: [
    "./index.html",
    "./login.html",
    "./404.html"
  ],

  // Ruta por defecto después de iniciar sesión
  defaultPrivateRoute: "./dashboard.html",

  // Ruta por defecto si intenta entrar sin sesión
  defaultPublicRoute: "./login.html",

  // Menú principal del sistema interno
  menu: [
    {
      id: "dashboard",
      label: "Inicio",
      href: "./dashboard.html",
      icon: "bi-speedometer2",
      page: "dashboard"
    },
    {
      id: "clientes",
      label: "Clientes",
      href: "./clientes.html",
      icon: "bi-shop",
      page: "clientes"
    },
    {
      id: "periodos",
      label: "Periodos",
      href: "./periodos.html",
      icon: "bi-calendar3",
      page: "periodos"
    },
    {
      id: "documentos",
      label: "Documentos",
      href: "./documentos.html",
      icon: "bi-file-earmark-text",
      page: "documentos"
    },
    {
      id: "transacciones",
      label: "Transacciones",
      href: "./transacciones.html",
      icon: "bi-cash-coin",
      page: "transacciones"
    },
    {
      id: "impuestos",
      label: "Impuestos",
      href: "./impuestos.html",
      icon: "bi-percent",
      page: "impuestos"
    },
    {
      id: "libro-diario",
      label: "Libro Diario",
      href: "./libro-diario.html",
      icon: "bi-journal-bookmark",
      page: "libro-diario"
    },
    {
      id: "libro-mayor",
      label: "Libro Mayor",
      href: "./libro-mayor.html",
      icon: "bi-journal-text",
      page: "libro-mayor"
    },
    {
      id: "balanza",
      label: "Balanza",
      href: "./balanza.html",
      icon: "bi-list-columns",
      page: "balanza"
    },
    {
      id: "ajustes",
      label: "Ajustes",
      href: "./ajustes.html",
      icon: "bi-tools",
      page: "ajustes"
    },
    {
      id: "estados-financieros",
      label: "Estados Fin.",
      href: "./estados-financieros.html",
      icon: "bi-graph-up-arrow",
      page: "estados-financieros"
    },
    {
      id: "costos-indicadores",
      label: "Costos e Indic.",
      href: "./costos-indicadores.html",
      icon: "bi-clipboard-data",
      page: "costos-indicadores"
    },
    {
      id: "alertas",
      label: "Alertas",
      href: "./alertas.html",
      icon: "bi-bell",
      page: "alertas"
    },
    {
      id: "reportes",
      label: "Reportes",
      href: "./reportes.html",
      icon: "bi-file-earmark-bar-graph",
      page: "reportes"
    },
    {
      id: "respaldo",
      label: "Respaldo",
      href: "./respaldo.html",
      icon: "bi-hdd-stack",
      page: "respaldo"
    },
    {
      id: "ayuda",
      label: "Ayuda",
      href: "./ayuda.html",
      icon: "bi-question-circle",
      page: "ayuda"
    }
  ],

  // Roles permitidos
  roles: {
    administrador: "administrador",
    contador: "contador",
    consulta: "consulta"
  },

  // Credenciales de demostración para prototipo académico
  demoCredentials: [
    {
      usuario: "admin",
      password: "Admin123",
      rol: "administrador",
      nombre: "Administrador"
    },
    {
      usuario: "contador",
      password: "Contador123",
      rol: "contador",
      nombre: "Contador"
    }
  ],

  // Moneda y formato local
  currency: "Bs",
  locale: "es-BO",

  // Tasas referenciales para prototipo
  taxRates: {
    IVA: 0.13,
    IT: 0.03
  },

  // Regímenes tributarios de referencia
  regimes: [
    "Régimen General",
    "Régimen Simplificado",
    "Otro",
    "Por definir"
  ],

  // Tipos de negocio sugeridos
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

  // Tipos documentales
  documentTypes: [
    { value: "factura_venta", label: "Factura de venta" },
    { value: "factura_compra", label: "Factura de compra" },
    { value: "recibo", label: "Recibo" },
    { value: "nota", label: "Nota" },
    { value: "extracto", label: "Extracto bancario" },
    { value: "otro", label: "Otro documento" }
  ],

  // Tipos de transacción
  transactionTypes: [
    { value: "venta", label: "Venta" },
    { value: "compra", label: "Compra" },
    { value: "gasto", label: "Gasto" },
    { value: "ingreso", label: "Ingreso" }
  ],

  // Formas de pago sugeridas
  paymentMethods: [
    "efectivo",
    "banco",
    "tarjeta",
    "transferencia",
    "credito",
    "otro"
  ],

  // Estados de periodo
  periodStates: [
    { value: "abierto", label: "Abierto" },
    { value: "en_revision", label: "En revisión" },
    { value: "cerrado", label: "Cerrado" }
  ],

  // Estados de documento
  documentStates: [
    { value: "pendiente", label: "Pendiente" },
    { value: "recibido", label: "Recibido" },
    { value: "validado", label: "Validado" },
    { value: "rechazado", label: "Rechazado" }
  ],

  // Estados de transacción
  transactionStates: [
    { value: "activa", label: "Activa" },
    { value: "anulada", label: "Anulada" }
  ],

  // Estados de obligación tributaria
  obligationStates: [
    { value: "pendiente", label: "Pendiente" },
    { value: "en_proceso", label: "En proceso" },
    { value: "presentada", label: "Presentada" },
    { value: "pagada", label: "Pagada" },
    { value: "vencida", label: "Vencida" },
    { value: "anulada", label: "Anulada" }
  ],

  // Tipos de asiento contable
  journalEntryTypes: [
    { value: "operacion", label: "Operación" },
    { value: "ajuste", label: "Ajuste" },
    { value: "cierre", label: "Cierre" },
    { value: "apertura", label: "Apertura" }
  ],

  // Categorías de ajuste contable
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

  // Origen del asiento
  journalOrigins: [
    { value: "automatico", label: "Automático" },
    { value: "manual", label: "Manual" }
  ],

  // Estados de asiento
  journalEntryStates: [
    { value: "vigente", label: "Vigente" },
    { value: "anulado", label: "Anulado" }
  ],

  // Tipos de cuenta según estado financiero
  accountTypes: [
    { value: "activo", label: "Activo" },
    { value: "pasivo", label: "Pasivo" },
    { value: "patrimonio", label: "Patrimonio" },
    { value: "ingreso", label: "Ingreso" },
    { value: "costo", label: "Costo" },
    { value: "gasto", label: "Gasto" }
  ],

  // Naturaleza de saldo
  accountNatures: [
    { value: "deudora", label: "Deudora" },
    { value: "acreedora", label: "Acreedora" }
  ],

  // Tipos de alerta
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

  // Niveles de alerta
  alertLevels: [
    { value: "informativa", label: "Informativa" },
    { value: "preventiva", label: "Preventiva" },
    { value: "urgente", label: "Urgente" },
    { value: "vencida", label: "Vencida" }
  ],

  // Estados de alerta
  alertStates: [
    { value: "pendiente", label: "Pendiente" },
    { value: "vista", label: "Vista" },
    { value: "resuelta", label: "Resuelta" },
    { value: "vencida", label: "Vencida" }
  ],

  // Tipos de reporte
  reportTypes: [
    { value: "mensual", label: "Reporte mensual" },
    { value: "borrador", label: "Borrador" },
    { value: "final", label: "Reporte final" }
  ],

  // Estados de reporte
  reportStates: [
    { value: "borrador", label: "Borrador" },
    { value: "generado", label: "Generado" },
    { value: "enviado", label: "Enviado" },
    { value: "anulado", label: "Anulado" }
  ],

  // Reglas referenciales para prototipo
  genericDueDay: 20,
  alertDaysBefore: 7,
  urgentDaysBefore: 3,

  // Métodos contables del prototipo
  depreciationMethod: "lineal_simple",
  inventoryMethod: "periodico_simplificado",

  // Comportamiento del prototipo
  autoSeedOnFirstRun: true,
  maxAttachmentKB: 300,

  /* =========================================================
     Plan de cuentas simplificado para microempresa comercial
     Solo cuentas nivel 3 admiten movimientos.
     ========================================================= */
  accountCatalog: [
    { codigo: "1.1.01", nombre: "Caja", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "Efectivo en mano del comerciante." },
    { codigo: "1.1.02", nombre: "Bancos", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "Cuentas bancarias o monedero digital." },
    { codigo: "1.1.03", nombre: "Clientes / Cuentas por cobrar", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "Ventas a crédito por cobrar." },
    { codigo: "1.1.04", nombre: "Inventario de mercancías", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "Mercadería disponible para venta." },
    { codigo: "1.1.05", nombre: "IVA Crédito Fiscal", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "IVA trasladado en compras, Régimen General." },
    { codigo: "1.1.06", nombre: "Otras cuentas por cobrar", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.1", estado: "activa", observacion: "Préstamos, anticipos u otros cobros." },
    { codigo: "1.2.01", nombre: "Mobiliario y equipo", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.2", estado: "activa", observacion: "Bienes de uso del negocio." },
    { codigo: "1.2.02", nombre: "Depreciación acumulada", tipo: "activo", naturaleza: "acreedora", esTemporal: false, esContra: true, nivel: 3, codigoPadre: "1.2", estado: "activa", observacion: "Cuenta compensadora de activos fijos." },
    { codigo: "1.2.03", nombre: "Intangibles", tipo: "activo", naturaleza: "deudora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "1.2", estado: "activa", observacion: "Marcas, licencias o software si corresponde." },
    { codigo: "2.1.01", nombre: "Proveedores / Cuentas por pagar", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.1", estado: "activa", observacion: "Deudas con proveedores." },
    { codigo: "2.1.02", nombre: "IVA Débito Fiscal", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.1", estado: "activa", observacion: "IVA cobrado en ventas, Régimen General." },
    { codigo: "2.1.03", nombre: "Impuestos por pagar", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.1", estado: "activa", observacion: "IT, RC-IVA, IUE u otros impuestos por pagar." },
    { codigo: "2.1.04", nombre: "Sueldos y salarios por pagar", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.1", estado: "activa", observacion: "Obligaciones laborales devengadas." },
    { codigo: "2.1.05", nombre: "Otros pasivos corrientes", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.1", estado: "activa", observacion: "Otros compromisos de corto plazo." },
    { codigo: "2.2.01", nombre: "Préstamos a largo plazo", tipo: "pasivo", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "2.2", estado: "activa", observacion: "Deudas financieras de largo plazo." },
    { codigo: "3.1.01", nombre: "Capital / Aportes del propietario", tipo: "patrimonio", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "3.1", estado: "activa", observacion: "Aportes del dueño o socia/o." },
    { codigo: "3.1.02", nombre: "Resultados acumulados", tipo: "patrimonio", naturaleza: "acreedora", esTemporal: false, esContra: false, nivel: 3, codigoPadre: "3.1", estado: "activa", observacion: "Utilidades o pérdidas de periodos anteriores." },
    { codigo: "3.1.03", nombre: "Resultados del ejercicio", tipo: "patrimonio", naturaleza: "acreedora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "3.1", estado: "activa", observacion: "Cuenta puente para cierre del periodo." },
    { codigo: "4.1.01", nombre: "Ventas", tipo: "ingreso", naturaleza: "acreedora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "4.1", estado: "activa", observacion: "Ingresos por venta de mercancía o servicios." },
    { codigo: "4.1.02", nombre: "Otros ingresos", tipo: "ingreso", naturaleza: "acreedora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "4.1", estado: "activa", observacion: "Ingresos no operativos o accesorios." },
    { codigo: "5.1.01", nombre: "Compras / Costo de ventas", tipo: "costo", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "5.1", estado: "activa", observacion: "Costo de mercancía vendida o compras del periodo." },
    { codigo: "5.1.02", nombre: "Devoluciones y descuentos sobre compras", tipo: "costo", naturaleza: "acreedora", esTemporal: true, esContra: true, nivel: 3, codigoPadre: "5.1", estado: "activa", observacion: "Cuenta compensadora de costos." },
    { codigo: "6.1.01", nombre: "Gastos de administración", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.1", estado: "activa", observacion: "Alquiler, servicios básicos, papelería, administración." },
    { codigo: "6.1.02", nombre: "Gastos de venta", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.1", estado: "activa", observacion: "Transporte, publicidad, comisiones, entrega." },
    { codigo: "6.1.03", nombre: "Gastos financieros", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.1", estado: "activa", observacion: "Intereses, comisiones bancarias, costos financieros." },
    { codigo: "6.1.04", nombre: "Depreciación y amortización", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.1", estado: "activa", observacion: "Gasto por depreciación de activos fijos." },
    { codigo: "6.1.05", nombre: "Otros gastos", tipo: "gasto", naturaleza: "deudora", esTemporal: true, esContra: false, nivel: 3, codigoPadre: "6.1", estado: "activa", observacion: "Gastos no clasificados en otras cuentas." }
  ],

  /* =========================================================
     Mapeo desde el nombre simple usado en transacciones
     hacia el código del plan de cuentas.
     ========================================================= */
  accountMapping: {
    "Caja": "1.1.01",
    "Bancos": "1.1.02",
    "Cuentas por cobrar": "1.1.03",
    "Clientes / Cuentas por cobrar": "1.1.03",
    "Inventario": "1.1.04",
    "Inventario de mercancías": "1.1.04",
    "IVA Crédito Fiscal": "1.1.05",
    "Otras cuentas por cobrar": "1.1.06",
    "Mobiliario y equipo": "1.2.01",
    "Depreciación acumulada": "1.2.02",
    "Intangibles": "1.2.03",
    "Cuentas por pagar": "2.1.01",
    "Proveedores / Cuentas por pagar": "2.1.01",
    "IVA Débito Fiscal": "2.1.02",
    "Impuestos por pagar": "2.1.03",
    "Sueldos y salarios por pagar": "2.1.04",
    "Otros pasivos corrientes": "2.1.05",
    "Préstamos a largo plazo": "2.2.01",
    "Capital": "3.1.01",
    "Aportes del propietario": "3.1.01",
    "Resultados acumulados": "3.1.02",
    "Resultados del ejercicio": "3.1.03",
    "Ventas": "4.1.01",
    "Otros ingresos": "4.1.02",
    "Costo de ventas": "5.1.01",
    "Compras": "5.1.01",
    "Compras / Costo de ventas": "5.1.01",
    "Devoluciones y descuentos sobre compras": "5.1.02",
    "Gastos de administración": "6.1.01",
    "Alquiler": "6.1.01",
    "Servicios básicos": "6.1.01",
    "Gastos de venta": "6.1.02",
    "Transporte": "6.1.02",
    "Gastos financieros": "6.1.03",
    "Depreciación y amortización": "6.1.04",
    "Otros gastos": "6.1.05"
  },

  // Mensajes globales visibles para el usuario
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

  // Texto legal breve para pies de página
  legalFooter:
    "Cuentas Claras – Prototipo académico de Contabilidad · Trinidad, Beni, Bolivia · 2026"
};