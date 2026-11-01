/* =========================================================
   Cuentas Claras MVP
   Configuración tributaria de Bolivia
   Fase 13: Guía de regímenes, formularios y obligaciones
   ------------------------------------------------------------
   Este archivo contiene información ESTÁTICA de referencia
   sobre el sistema tributario boliviano. NO calcula impuestos
   (eso lo hace impuestos.js). Sirve para:
   - Guiar al microempresario sobre su régimen aplicable.
   - Mostrar los formularios y plazos del SIN.
   - Explicar la facturación electrónica (SIAT).
   - Servir de base para el módulo "Mi Régimen Tributario".

   ⚠️ IMPORTANTE: La información es referencial y académica.
   El usuario debe verificar siempre en el SIN o con un
   Contador Público Autorizado antes de tomar decisiones.
   ========================================================= */

window.CC_IMPUESTOS_BOLIVIA = {

  version: "1.0.0",
  ultimaActualizacion: "2026-01",
  fuenteOficial: "Servicio de Impuestos Nacionales (SIN) – www.impuestos.gob.bo",

  /* =========================================================
     REGÍMENES TRIBUTARIOS
     ========================================================= */
  regimenes: {

    general: {
      id: "general",
      nombre: "Régimen General",
      sigla: "RG",
      descripcion:
        "Aplica a personas naturales o jurídicas con ingresos anuales mayores a Bs 400.000 o que no califican para regímenes simplificados. Obligación de llevar contabilidad completa y presentar declaraciones mensuales.",
      ingresosAnuales: { min: 400000, max: null },
      obligaciones: [
        "IVA – Formulario 200 (mensual)",
        "IT – Formulario 410 (mensual)",
        "IUE – Formulario 500 (anual)",
        "RC-IVA – Formulario 110 (mensual, si aplica)",
        "Facturación electrónica (SIAT) – obligatoria según cronograma",
        "Llevar libros contables (Diario, Mayor, Balances)",
        "Registro de compras y ventas"
      ],
      formularios: ["200", "410", "500", "110"],
      tasas: {
        iva: 0.13,
        it: 0.03,
        iue: 0.25
      },
      color: "primary",
      icono: "bi-building"
    },

    simplificado: {
      id: "simplificado",
      nombre: "Régimen Tributario Simplificado",
      sigla: "RTS",
      descripcion:
        "Régimen especial para pequeños comerciantes minoristas, artesanos y vivanderos con ingresos anuales menores a Bs 400.000. Se paga una cuota fija bimestral según categoría, sin declarar IVA por separado.",
      ingresosAnuales: { min: 0, max: 400000 },
      obligaciones: [
        "Pago de cuota fija bimestral según categoría",
        "Registro de compras (no obligatorio facturar)",
        "No presenta Formulario 200 (IVA) ni 410 (IT) por separado",
        "Debe emitir factura si el cliente la solicita"
      ],
      formularios: ["RTS - Cuota bimestral"],
      categorias: [
        { categoria: 1, capital: "Hasta Bs 12.000", cuotaMensual: 31, cuotaBimestral: 62 },
        { categoria: 2, capital: "Bs 12.001 - 30.000", cuotaMensual: 61, cuotaBimestral: 122 },
        { categoria: 3, capital: "Bs 30.001 - 60.000", cuotaMensual: 90, cuotaBimestral: 180 },
        { categoria: 4, capital: "Bs 60.001 - 120.000", cuotaMensual: 122, cuotaBimestral: 244 }
      ],
      color: "warning",
      icono: "bi-shop"
    },

    siete: {
      id: "siete",
      nombre: "Régimen Especial SIETE",
      sigla: "SIETE",
      descripcion:
        "Nuevo régimen propuesto por el gobierno (en discusión a 2026). Unifica IVA, IT e IUE en un solo pago bimestral del 5% sobre ingresos brutos. Aplica a pequeños contribuyentes con ingresos anuales menores a Bs 400.000 que no califiquen al RTS.",
      ingresosAnuales: { min: 0, max: 400000 },
      obligaciones: [
        "Pago unificado bimestral del 5% sobre ingresos brutos",
        "Reemplaza IVA, IT e IUE",
        "Presentación bimestral simplificada"
      ],
      formularios: ["SIETE - Formulario simplificado"],
      tasas: {
        unificada: 0.05
      },
      estado: "En discusión legislativa a enero 2026",
      color: "info",
      icono: "bi-lightning"
    }
  },

  /* =========================================================
     IMPUESTOS DEL SISTEMA BOLIVIANO
     ========================================================= */
  impuestos: {

    iva: {
      id: "iva",
      nombre: "Impuesto al Valor Agregado",
      sigla: "IVA",
      tasa: 0.13,
      formulario: "200",
      periodicidad: "Mensual",
      descripcion:
        "Se aplica sobre el precio neto de venta de bienes y servicios. El vendedor actúa como agente de retención. Se declara mensualmente y se paga hasta el día 20 del mes siguiente.",
      formula: "IVA por pagar = IVA débito fiscal − IVA crédito fiscal",
      aplicaRegimenes: ["general"]
    },

    it: {
      id: "it",
      nombre: "Impuesto a las Transacciones",
      sigla: "IT",
      tasa: 0.03,
      formulario: "410",
      periodicidad: "Mensual",
      descripcion:
        "Se aplica sobre el monto total de ingresos brutos devengados en el período. Es un impuesto a las transacciones, no a la utilidad. Se declara mensualmente.",
      formula: "IT = Ingresos brutos × 3%",
      aplicaRegimenes: ["general"]
    },

    iue: {
      id: "iue",
      nombre: "Impuesto sobre las Utilidades de las Empresas",
      sigla: "IUE",
      tasa: 0.25,
      formulario: "500",
      periodicidad: "Anual",
      descripcion:
        "Se aplica sobre la utilidad neta anual. Las microempresas y pequeñas empresas tienen una alícuota reducida del 25%. Se declara anualmente.",
      formula: "IUE = Utilidad neta × 25%",
      aplicaRegimenes: ["general"],
      nota: "Micro y pequeñas empresas pueden tener alícuota diferenciada según normativa vigente."
    },

    rc_iva: {
      id: "rc_iva",
      nombre: "Régimen Complementario al IVA",
      sigla: "RC-IVA",
      tasa: 0.13,
      formulario: "110",
      periodicidad: "Mensual",
      descripcion:
        "Aplica a personas naturales que perciben rentas por trabajo dependiente o independiente. Se descuenta el IVA de las facturas presentadas. Se declara mensualmente.",
      formula: "RC-IVA = (Renta neta × 13%) − IVA de facturas presentadas",
      aplicaRegimenes: ["general"]
    }
  },

  /* =========================================================
     CALENDARIO DE VENCIMIENTOS
     ========================================================= */
  calendario: {
    iva_it: {
      formularios: ["200", "410"],
      diaVencimiento: 20,
      periodicidad: "Mensual",
      nota: "El vencimiento se calcula según el último dígito del NIT. El día 20 es referencial."
    },
    rc_iva: {
      formulario: "110",
      diaVencimiento: 10,
      periodicidad: "Mensual",
      nota: "Se presenta hasta el día 10 del mes siguiente."
    },
    iue: {
      formulario: "500",
      diaVencimiento: 30,
      periodicidad: "Anual",
      mesVencimiento: 4,
      nota: "Se presenta hasta abril del año siguiente al ejercicio fiscal."
    },
    rts: {
      formulario: "Cuota bimestral",
      periodicidad: "Bimestral",
      meses: ["Enero", "Marzo", "Mayo", "Julio", "Septiembre", "Noviembre"],
      nota: "El pago se realiza en los primeros 15 días del bimestre siguiente."
    }
  },

  /* =========================================================
     FACTURACIÓN ELECTRÓNICA (SIAT)
     ========================================================= */
  facturacionElectronica: {
    nombre: "Sistema Integrado de Administración Tributaria (SIAT)",
    descripcion:
      "El SIN implementa la facturación electrónica obligatoria de forma gradual. Los contribuyentes deben emitir facturas digitales con validación en línea.",
    cronograma: [
      { grupo: "Grandes contribuyentes", fecha: "Ya obligatorio" },
      { grupo: "Medianas empresas", fecha: "2025" },
      { grupo: "Pequeñas empresas", fecha: "Abril 2026" },
      { grupo: "Microempresas y RTS", fecha: "Según cronograma SIN 2026-2027" }
    ],
    modalidades: [
      {
        nombre: "Facturación en Línea",
        descripcion: "Emisión directa desde el sistema del SIN. Requiere internet.",
        recomendada: "Pequeñas y medianas empresas"
      },
      {
        nombre: "Facturación Computarizada",
        descripcion: "Emisión desde software propio, con envío posterior al SIN.",
        recomendada: "Empresas con sistema contable propio"
      }
    ],
    nota:
      "Cuentas Claras, como sistema de apoyo contable, no emite facturas electrónicas. Su rol es registrar y organizar los comprobantes que el cliente emite por otros medios (SIAT, facturador gratuito, etc.)."
  },

  /* =========================================================
     GUÍA DE OBLIGACIONES POR RÉGIMEN
     ========================================================= */
  guias: {

    general: {
      titulo: "Obligaciones si estás en el Régimen General",
      pasos: [
        "Registrar tu NIT en el SIN (si aún no lo tienes).",
        "Llevar libros contables: Diario, Mayor y Balances.",
        "Emitir facturas por cada venta (con o sin SIAT).",
        "Presentar el Formulario 200 (IVA) hasta el día 20 de cada mes.",
        "Presentar el Formulario 410 (IT) hasta el día 20 de cada mes.",
        "Presentar el Formulario 110 (RC-IVA) hasta el día 10 de cada mes, si aplica.",
        "Presentar el Formulario 500 (IUE) hasta abril del año siguiente.",
        "Archivar todas las facturas de compras y ventas por 8 años.",
        "Implementar facturación electrónica según cronograma del SIN."
      ]
    },

    simplificado: {
      titulo: "Obligaciones si estás en el RTS",
      pasos: [
        "Registrarte en el RTS (Régimen Tributario Simplificado).",
        "Pagar la cuota bimestral según tu categoría (1, 2, 3 o 4).",
        "Emitir factura si el cliente la solicita (no obligación general).",
        "Llevar un registro básico de compras y ventas.",
        "Renovar tu inscripción cada año si corresponde.",
        "NO presentas Formulario 200 ni 410 por separado.",
        "Reportar cambios de categoría si tu capital crece."
      ]
    },

    siete: {
      titulo: "Obligaciones si estás en el SIETE (cuando se apruebe)",
      pasos: [
        "Inscribirte en el SIETE cuando entre en vigencia.",
        "Pagar el 5% bimestral sobre ingresos brutos.",
        "Presentar declaración simplificada bimestral.",
        "No presentas IVA, IT ni IUE por separado.",
        "Emitir factura según normativa vigente.",
        "Mantener registro de ingresos y compras."
      ]
    }
  },

  /* =========================================================
     PREGUNTAS FRECUENTES (FAQ)
     ========================================================= */
  faq: [
    {
      pregunta: "¿Cómo sé en qué régimen estoy?",
      respuesta:
        "Revisa tu última declaración al SIN o consulta con un Contador Público Autorizado. En general: si facturas más de Bs 400.000 al año o emites facturas con NIT, estás en el Régimen General. Si eres pequeño comerciante minorista con ingresos menores, podrías estar en el RTS."
    },
    {
      pregunta: "¿Qué pasa si no presento el Formulario 410 a tiempo?",
      respuesta:
        "El SIN aplica multas e intereses. La multa por incumplimiento de deberes formales varía según la resolución vigente. Por eso las alertas del sistema son preventivas: te avisan antes del vencimiento."
    },
    {
      pregunta: "¿Debo facturar todas mis ventas?",
      respuesta:
        "Sí, en el Régimen General es obligatorio. En el RTS solo si el cliente lo solicita. El sistema te ayuda a registrar tus ventas, pero la emisión de factura se hace por separado (SIAT, facturador gratuito, etc.)."
    },
    {
      pregunta: "¿Cuándo debo implementar la facturación electrónica?",
      respuesta:
        "Depende de tu grupo. A partir de abril de 2026, las pequeñas empresas deben implementarla. Las microempresas y RTS tienen cronograma según el SIN. Consulta con tu contador."
    },
    {
      pregunta: "¿Puedo cambiar de régimen?",
      respuesta:
        "Sí, pero con condiciones. El paso del RTS al General ocurre cuando superas los límites de ingresos. El paso del General al SIETE (cuando se apruebe) será optativo para quienes califiquen."
    }
  ],

  /* =========================================================
     MÉTODOS AUXILIARES
     ========================================================= */

  /**
   * Devuelve la recomendación de régimen según los ingresos anuales
   */
  recomendarRegimen(ingresosAnuales, esProfesionalIndependiente = false) {
    const ingreso = Number(ingresosAnuales) || 0;

    if (esProfesionalIndependiente && ingreso > 400000) {
      return this.regimenes.general;
    }

    if (ingreso <= 0) {
      return this.regimenes.simplificado; // Por defecto, el más simple
    }

    if (ingreso <= 400000) {
      return this.regimenes.simplificado;
    }

    return this.regimenes.general;
  },

  /**
   * Devuelve los formularios aplicables a un régimen
   */
  getFormulariosPorRegimen(regimenId) {
    const regimen = this.regimenes[regimenId];
    return regimen ? regimen.formularios : [];
  },

  /**
   * Devuelve la próxima fecha de vencimiento dado un formulario
   */
  proximoVencimiento(formulario, fechaReferencia = new Date()) {
    const dia = this.calendario.iva_it.diaVencimiento;
    const ref = new Date(fechaReferencia);
    const proximo = new Date(ref.getFullYear(), ref.getMonth() + 1, dia);
    return proximo.toISOString().slice(0, 10);
  },

  /**
   * Devuelve una descripción textual del régimen para mostrar en UI
   */
  describeRegimen(regimenId) {
    const r = this.regimenes[regimenId];
    if (!r) return { nombre: "No definido", descripcion: "" };

    return {
      nombre: r.nombre,
      sigla: r.sigla,
      descripcion: r.descripcion,
      obligaciones: r.obligaciones,
      formularios: r.formularios,
      color: r.color,
      icono: r.icono
    };
  },

  /**
   * Devuelve la guía paso a paso para un régimen
   */
  getGuia(regimenId) {
    const g = this.guias[regimenId];
    return g || { titulo: "Sin guía disponible", pasos: [] };
  }
};

console.log("✅ CC_IMPUESTOS_BOLIVIA cargado (v" + window.CC_IMPUESTOS_BOLIVIA.version + ")");