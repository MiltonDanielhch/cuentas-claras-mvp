/* =========================================================
   Cuentas Claras MVP
   Datos semilla para demostración académica
   Versión contable completa: Fase 5
   ========================================================= */

window.CC_SEED = (function () {
  const cfg = window.CC_CONFIG;
  const utils = window.CC_UTILS;

  const users = [
    {
      id: "USR-0001",
      nombre: "Administrador",
      usuario: "admin",
      email: "admin@cuentasclaras.bo",
      passwordHash: utils.hashPassword("Admin123"),
      rol: "administrador",
      estado: "activo",
      fechaCreacion: "2026-10-01"
    },
    {
      id: "USR-0002",
      nombre: "Contador",
      usuario: "contador",
      email: "contador@cuentasclaras.bo",
      passwordHash: utils.hashPassword("Contador123"),
      rol: "contador",
      estado: "activo",
      fechaCreacion: "2026-10-01"
    }
  ];

  const clients = [
    {
      id: "CLI-0001",
      nombreComercial: "Tienda Doña Rosa",
      razonSocial: "Rosa Mamani",
      nit: "123456789",
      telefono: "70000001",
      whatsapp: "70000001",
      direccion: "Mercado Pompeya, puesto 12",
      regimenTributario: "Régimen General",
      tipoNegocio: "Abarrotes",
      capitalInicial: 5000,
      costosFijosMensuales: 800,
      estado: "activo",
      fechaAlta: "2026-10-01",
      observacion: "Cliente piloto de referencia."
    },
    {
      id: "CLI-0002",
      nombreComercial: "Ferretería San Luis",
      razonSocial: "Luis Fernández",
      nit: "987654321",
      telefono: "70000002",
      whatsapp: "70000002",
      direccion: "Av. Flor de Patuju, cerca mercado Pompeya",
      regimenTributario: "Régimen General",
      tipoNegocio: "Ferretería",
      capitalInicial: 12000,
      costosFijosMensuales: 1500,
      estado: "activo",
      fechaAlta: "2026-10-02",
      observacion: "Cliente con compras mayores."
    },
    {
      id: "CLI-0003",
      nombreComercial: "Abarrotes La Esquina",
      razonSocial: "María Vargas",
      nit: "",
      telefono: "70000003",
      whatsapp: "70000003",
      direccion: "Barrio 14 de Septiembre",
      regimenTributario: "Régimen Simplificado",
      tipoNegocio: "Tienda de barrio",
      capitalInicial: 3000,
      costosFijosMensuales: 400,
      estado: "activo",
      fechaAlta: "2026-10-03",
      observacion: "Cliente en proceso de formalización."
    }
  ];

  const periods = [
    {
      id: "PER-0001",
      clienteId: "CLI-0001",
      mes: 10,
      anio: 2026,
      estado: "abierto",
      fechaApertura: "2026-10-01",
      fechaCierre: null,
      closingEntryId: null,
      closedAt: null,
      observacion: "Periodo mensual en captura."
    },
    {
      id: "PER-0002",
      clienteId: "CLI-0002",
      mes: 10,
      anio: 2026,
      estado: "en_revision",
      fechaApertura: "2026-10-01",
      fechaCierre: null,
      closingEntryId: null,
      closedAt: null,
      observacion: "Pendiente conciliación."
    },
    {
      id: "PER-0003",
      clienteId: "CLI-0003",
      mes: 10,
      anio: 2026,
      estado: "cerrado",
      fechaApertura: "2026-10-01",
      fechaCierre: "2026-10-31",
      closingEntryId: null,
      closedAt: "2026-10-31T18:00:00",
      observacion: "Periodo cerrado de ejemplo."
    }
  ];

  const documents = [
    {
      id: "DOC-0001",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "factura_venta",
      fechaDocumento: "2026-10-05",
      monto: 250,
      tercero: "Cliente general",
      estado: "validado",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Venta mostrador"
    },
    {
      id: "DOC-0002",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "factura_venta",
      fechaDocumento: "2026-10-08",
      monto: 180,
      tercero: "Cliente general",
      estado: "validado",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Venta abarrotes"
    },
    {
      id: "DOC-0003",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "factura_compra",
      fechaDocumento: "2026-10-09",
      monto: 500,
      tercero: "Mayorista Beni",
      estado: "validado",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Compra de mercadería"
    },
    {
      id: "DOC-0004",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "recibo",
      fechaDocumento: "2026-10-10",
      monto: 80,
      tercero: "Cooperativa de luz",
      estado: "recibido",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Recibo de servicio básico"
    },
    {
      id: "DOC-0005",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "factura_venta",
      fechaDocumento: "2026-10-15",
      monto: 320,
      tercero: "Cliente general",
      estado: "pendiente",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Pendiente validar documento"
    },
    {
      id: "DOC-0006",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      tipo: "factura_venta",
      fechaDocumento: "2026-10-04",
      monto: 750,
      tercero: "Cliente mostrador",
      estado: "validado",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Venta ferretería"
    },
    {
      id: "DOC-0007",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      tipo: "factura_compra",
      fechaDocumento: "2026-10-07",
      monto: 1200,
      tercero: "Proveedor ferretero",
      estado: "validado",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Compra clavos, pinturas y herramientas"
    },
    {
      id: "DOC-0008",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      tipo: "nota",
      fechaDocumento: "2026-10-12",
      monto: 150,
      tercero: "Servicio de transporte",
      estado: "recibido",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Nota interna de gasto"
    },
    {
      id: "DOC-0009",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      tipo: "factura_venta",
      fechaDocumento: "2026-10-18",
      monto: 430,
      tercero: "Cliente general",
      estado: "pendiente",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Venta pendiente de validación"
    },
    {
      id: "DOC-0010",
      clienteId: "CLI-0003",
      periodoId: "PER-0003",
      tipo: "factura_venta",
      fechaDocumento: "2026-10-03",
      monto: 200,
      tercero: "Cliente barrio",
      estado: "validado",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Venta diaria"
    },
    {
      id: "DOC-0011",
      clienteId: "CLI-0003",
      periodoId: "PER-0003",
      tipo: "factura_compra",
      fechaDocumento: "2026-10-06",
      monto: 350,
      tercero: "Mayorista abarrotes",
      estado: "validado",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Compra arroz, azúcar y fideo"
    },
    {
      id: "DOC-0012",
      clienteId: "CLI-0003",
      periodoId: "PER-0003",
      tipo: "extracto",
      fechaDocumento: "2026-10-31",
      monto: 1500,
      tercero: "Banco",
      estado: "validado",
      archivoNombre: "",
      archivoDataUrl: "",
      observacion: "Extracto referencial para conciliación"
    }
  ];

  const transactions = [
    {
      id: "TRX-0001",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      documentoId: "DOC-0001",
      journalEntryId: null,
      fecha: "2026-10-05",
      tipo: "venta",
      cuenta: "Ventas",
      monto: 250,
      tercero: "Cliente general",
      formaPago: "efectivo",
      estado: "activa",
      observacion: ""
    },
    {
      id: "TRX-0002",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      documentoId: "DOC-0002",
      journalEntryId: null,
      fecha: "2026-10-08",
      tipo: "venta",
      cuenta: "Ventas",
      monto: 180,
      tercero: "Cliente general",
      formaPago: "efectivo",
      estado: "activa",
      observacion: ""
    },
    {
      id: "TRX-0003",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      documentoId: "DOC-0003",
      journalEntryId: null,
      fecha: "2026-10-09",
      tipo: "compra",
      cuenta: "Costo de ventas",
      monto: 500,
      tercero: "Mayorista Beni",
      formaPago: "banco",
      estado: "activa",
      observacion: ""
    },
    {
      id: "TRX-0004",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      documentoId: "DOC-0004",
      journalEntryId: null,
      fecha: "2026-10-10",
      tipo: "gasto",
      cuenta: "Servicios básicos",
      monto: 80,
      tercero: "Cooperativa de luz",
      formaPago: "efectivo",
      estado: "activa",
      observacion: ""
    },
    {
      id: "TRX-0005",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      documentoId: "DOC-0005",
      journalEntryId: null,
      fecha: "2026-10-15",
      tipo: "venta",
      cuenta: "Ventas",
      monto: 320,
      tercero: "Cliente general",
      formaPago: "efectivo",
      estado: "activa",
      observacion: "Documento pendiente de validación"
    },
    {
      id: "TRX-0006",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      documentoId: "DOC-0006",
      journalEntryId: null,
      fecha: "2026-10-04",
      tipo: "venta",
      cuenta: "Ventas",
      monto: 750,
      tercero: "Cliente mostrador",
      formaPago: "efectivo",
      estado: "activa",
      observacion: ""
    },
    {
      id: "TRX-0007",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      documentoId: "DOC-0007",
      journalEntryId: null,
      fecha: "2026-10-07",
      tipo: "compra",
      cuenta: "Costo de ventas",
      monto: 1200,
      tercero: "Proveedor ferretero",
      formaPago: "banco",
      estado: "activa",
      observacion: ""
    },
    {
      id: "TRX-0008",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      documentoId: "DOC-0008",
      journalEntryId: null,
      fecha: "2026-10-12",
      tipo: "gasto",
      cuenta: "Otros gastos",
      monto: 150,
      tercero: "Servicio de transporte",
      formaPago: "transferencia",
      estado: "activa",
      observacion: ""
    },
    {
      id: "TRX-0009",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      documentoId: "DOC-0009",
      journalEntryId: null,
      fecha: "2026-10-18",
      tipo: "venta",
      cuenta: "Ventas",
      monto: 430,
      tercero: "Cliente general",
      formaPago: "efectivo",
      estado: "activa",
      observacion: "Documento pendiente"
    },
    {
      id: "TRX-0010",
      clienteId: "CLI-0003",
      periodoId: "PER-0003",
      documentoId: "DOC-0010",
      journalEntryId: null,
      fecha: "2026-10-03",
      tipo: "venta",
      cuenta: "Ventas",
      monto: 200,
      tercero: "Cliente barrio",
      formaPago: "efectivo",
      estado: "activa",
      observacion: ""
    },
    {
      id: "TRX-0011",
      clienteId: "CLI-0003",
      periodoId: "PER-0003",
      documentoId: "DOC-0011",
      journalEntryId: null,
      fecha: "2026-10-06",
      tipo: "compra",
      cuenta: "Costo de ventas",
      monto: 350,
      tercero: "Mayorista abarrotes",
      formaPago: "banco",
      estado: "activa",
      observacion: ""
    },
    {
      id: "TRX-0012",
      clienteId: "CLI-0003",
      periodoId: "PER-0003",
      documentoId: null,
      journalEntryId: null,
      fecha: "2026-10-10",
      tipo: "ingreso",
      cuenta: "Capital",
      monto: 1000,
      tercero: "Aporte propietario",
      formaPago: "efectivo",
      estado: "activa",
      observacion: "Aporte de capital inicial"
    },
    {
      id: "TRX-0013",
      clienteId: "CLI-0003",
      periodoId: "PER-0003",
      documentoId: null,
      journalEntryId: null,
      fecha: "2026-10-15",
      tipo: "gasto",
      cuenta: "Transporte",
      monto: 120,
      tercero: "Taxi",
      formaPago: "efectivo",
      estado: "activa",
      observacion: "Sin comprobante"
    },
    {
      id: "TRX-0014",
      clienteId: "CLI-0003",
      periodoId: "PER-0003",
      documentoId: null,
      journalEntryId: null,
      fecha: "2026-10-20",
      tipo: "venta",
      cuenta: "Ventas",
      monto: 90,
      tercero: "Cliente feria",
      formaPago: "efectivo",
      estado: "activa",
      observacion: "Venta sin factura"
    },
    {
      id: "TRX-0015",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      documentoId: null,
      journalEntryId: null,
      fecha: "2026-10-16",
      tipo: "venta",
      cuenta: "Ventas",
      monto: 50,
      tercero: "Cliente general",
      formaPago: "efectivo",
      estado: "anulada",
      observacion: "Anulada por duplicado"
    }
  ];

  const accounts = (cfg.accountCatalog || []).map((account, index) => ({
    id: utils.makeId("ACC", index + 1),
    ...account
  }));

  const fixedAssets = [
    {
      id: "FA-0001",
      clienteId: "CLI-0002",
      descripcion: "Freezer comercial",
      categoria: "mobiliario_equipo",
      cuentaActivo: "1.2.01",
      cuentaDepreciacion: "1.2.02",
      cuentaGastoDepreciacion: "6.1.04",
      fechaAdquisicion: "2026-01-15",
      costoAdquisicion: 4500,
      valorResidual: 500,
      vidaUtilMeses: 48,
      depreciacionMensual: 83.33,
      depreciacionAcumulada: 0,
      estado: "activo",
      observacion: "Activo fijo de ejemplo para depreciación."
    },
    {
      id: "FA-0002",
      clienteId: "CLI-0001",
      descripcion: "Computadora de caja",
      categoria: "equipoComputo",
      cuentaActivo: "1.2.01",
      cuentaDepreciacion: "1.2.02",
      cuentaGastoDepreciacion: "6.1.04",
      fechaAdquisicion: "2026-02-01",
      costoAdquisicion: 3500,
      valorResidual: 500,
      vidaUtilMeses: 36,
      depreciacionMensual: 83.33,
      depreciacionAcumulada: 0,
      estado: "activo",
      observacion: "Equipo de cómputo para registro contable."
    }
  ];

  const taxes = [
    {
      id: "IMP-0001",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "IVA",
      concepto: "debito_fiscal",
      baseImponible: 750,
      tasa: 0.13,
      monto: 97.5,
      fechaCalculo: "2026-10-18"
    },
    {
      id: "IMP-0002",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "IVA",
      concepto: "credito_fiscal",
      baseImponible: 500,
      tasa: 0.13,
      monto: 65,
      fechaCalculo: "2026-10-18"
    },
    {
      id: "IMP-0003",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "IVA",
      concepto: "por_pagar",
      baseImponible: 250,
      tasa: 0.13,
      monto: 32.5,
      fechaCalculo: "2026-10-18"
    },
    {
      id: "IMP-0004",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "IT",
      concepto: "ventas_brutas",
      baseImponible: 750,
      tasa: 0.03,
      monto: 22.5,
      fechaCalculo: "2026-10-18"
    },
    {
      id: "IMP-0005",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      tipo: "IVA",
      concepto: "debito_fiscal",
      baseImponible: 1180,
      tasa: 0.13,
      monto: 153.4,
      fechaCalculo: "2026-10-18"
    },
    {
      id: "IMP-0006",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      tipo: "IVA",
      concepto: "credito_fiscal",
      baseImponible: 1200,
      tasa: 0.13,
      monto: 156,
      fechaCalculo: "2026-10-18"
    },
    {
      id: "IMP-0007",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      tipo: "IT",
      concepto: "ventas_brutas",
      baseImponible: 1180,
      tasa: 0.03,
      monto: 35.4,
      fechaCalculo: "2026-10-18"
    },
    {
      id: "IMP-0008",
      clienteId: "CLI-0003",
      periodoId: "PER-0003",
      tipo: "IT",
      concepto: "ventas_brutas",
      baseImponible: 290,
      tasa: 0.03,
      monto: 8.7,
      fechaCalculo: "2026-10-18"
    }
  ];

  const obligations = [
    {
      id: "OBL-0001",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "IVA",
      descripcion: "Declaración mensual IVA",
      fechaVencimiento: "2026-11-20",
      montoEstimado: 32.5,
      estado: "pendiente"
    },
    {
      id: "OBL-0002",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "IT",
      descripcion: "Declaración mensual IT",
      fechaVencimiento: "2026-11-20",
      montoEstimado: 22.5,
      estado: "pendiente"
    },
    {
      id: "OBL-0003",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      tipo: "IT",
      descripcion: "Declaración mensual IT",
      fechaVencimiento: "2026-11-20",
      montoEstimado: 35.4,
      estado: "pendiente"
    }
  ];

  const alerts = [
    {
      id: "ALR-0001",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      obligacionId: "OBL-0001",
      asientoId: null,
      tipo: "vencimiento_tributario",
      nivel: "preventiva",
      titulo: "Vencimiento IVA próximo",
      mensaje: "La declaración de IVA vence el 20/11/2026.",
      fechaAlerta: "2026-11-13",
      estado: "pendiente"
    },
    {
      id: "ALR-0002",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      obligacionId: null,
      asientoId: null,
      tipo: "documento_pendiente",
      nivel: "informativa",
      titulo: "Documento pendiente",
      mensaje: "La factura de venta DOC-0005 está pendiente de validación.",
      fechaAlerta: "2026-10-18",
      estado: "pendiente"
    },
    {
      id: "ALR-0003",
      clienteId: "CLI-0002",
      periodoId: "PER-0002",
      obligacionId: null,
      asientoId: null,
      tipo: "periodo_sin_cerrar",
      nivel: "preventiva",
      titulo: "Periodo en revisión",
      mensaje: "El periodo de octubre 2026 de Ferretería San Luis está en revisión.",
      fechaAlerta: "2026-10-18",
      estado: "pendiente"
    },
    {
      id: "ALR-0004",
      clienteId: "CLI-0003",
      periodoId: "PER-0003",
      obligacionId: null,
      asientoId: null,
      tipo: "transaccion_sin_documento",
      nivel: "urgente",
      titulo: "Transacción sin documento",
      mensaje: "La transacción TRX-0013 no tiene documento de respaldo.",
      fechaAlerta: "2026-10-18",
      estado: "pendiente"
    },
    {
      id: "ALR-0005",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      obligacionId: null,
      asientoId: null,
      tipo: "impuesto_no_calculado",
      nivel: "informativa",
      titulo: "Impuesto referencial revisado",
      mensaje: "Se revisó el cálculo informativo del periodo.",
      fechaAlerta: "2026-10-18",
      estado: "resuelta"
    }
  ];

  const reports = [
    {
      id: "REP-0001",
      clienteId: "CLI-0001",
      periodoId: "PER-0001",
      tipo: "mensual",
      fechaGeneracion: "2026-10-18",
      resumen: {
        ventas: 750,
        compras: 500,
        gastos: 80,
        utilidadEstimada: 170,
        ivaPorPagar: 32.5,
        itEstimado: 22.5
      },
      snapshotId: null,
      archivoNombre: "",
      estado: "borrador"
    }
  ];

  const logs = [
    {
      id: "LOG-0001",
      usuarioId: "SYSTEM",
      accion: "cargar_seed",
      entidad: "settings",
      registroId: null,
      fecha: "2026-10-18T08:00:00",
      detalle: "Datos semilla iniciales cargados"
    },
    {
      id: "LOG-0002",
      usuarioId: "USR-0001",
      accion: "login",
      entidad: "users",
      registroId: "USR-0001",
      fecha: "2026-10-18T08:05:00",
      detalle: "Ingreso demo de administrador"
    }
  ];

  const counters = {
    USR: 2,
    CLI: 3,
    PER: 3,
    DOC: 12,
    TRX: 15,
    IMP: 8,
    OBL: 3,
    ALR: 5,
    REP: 1,
    LOG: 2,
    ACC: accounts.length,
    JE: 0,
    JL: 0,
    FA: 2,
    FS: 0
  };

  const settings = {
    storageVersion: 2,
    seedLoaded: true,
    depreciationMethod: cfg.depreciationMethod,
    inventoryMethod: cfg.inventoryMethod
  };

  return {
    users,
    clients,
    periods,
    documents,
    transactions,
    accounts,
    fixedAssets,
    taxes,
    obligations,
    journalEntries: [],
    journalLines: [],
    financialSnapshots: [],
    alerts,
    reports,
    logs,
    counters,
    settings
  };
})();