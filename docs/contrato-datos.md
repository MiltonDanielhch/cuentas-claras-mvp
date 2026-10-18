# Contrato de datos – Cuentas Claras MVP

## Objetivo

Este documento define las estructuras de datos, claves de almacenamiento, identificadores, estados, convenciones y reglas mínimas que deberá respetar el prototipo del sistema de gestión contable digital.

El propósito es evitar cambios posteriores innecesarios y permitir que cada módulo trabaje sobre una base estable.

---

## Idioma de datos

- Textos visibles para el usuario: español.
- Claves técnicas, nombres de colección, identificadores internos y campos JSON: se mantienen en formato técnico, sin tildes y preferentemente en inglés o camelCase simple para compatibilidad.
- Valores de estado, tipo de negocio, régimen tributario y mensajes pueden estar en español.

---

## Formato de codificación

Todos los archivos deben guardarse en:

```text
UTF-8
```

---

## Formato de fechas

Las fechas se almacenan en formato ISO:

```text
AAAA-MM-DD
```

Ejemplo:

```text
2026-10-31
```

Las fechas y horas de bitácora se almacenan en formato ISO con hora:

```text
AAAA-MM-DDTHH:mm:ss
```

Ejemplo:

```text
2026-10-31T18:30:00
```

---

## Formato de montos

Los montos se almacenan como números:

```json
{
  "monto": 250.5
}
```

Para mostrarlos en interfaz se formatean como:

```text
Bs 250.50
```

No se almacenan montos como texto con “Bs”.

---

## Moneda

Moneda base:

```text
Bs
```

Corresponde al Boliviano.

---

## Identificadores

Cada registro tendrá un identificador único con prefijo y número correlativo de cuatro dígitos.

| Entidad | Prefijo | Ejemplo |
|---|---|---|
| Usuario | `USR` | `USR-0001` |
| Cliente | `CLI` | `CLI-0001` |
| Periodo | `PER` | `PER-0001` |
| Documento | `DOC` | `DOC-0001` |
| Transacción | `TRX` | `TRX-0001` |
| Impuesto | `IMP` | `IMP-0001` |
| Obligación | `OBL` | `OBL-0001` |
| Alerta | `ALR` | `ALR-0001` |
| Reporte | `REP` | `REP-0001` |
| Bitácora | `LOG` | `LOG-0001` |

Los contadores correlativos se guardan en LocalStorage bajo la clave:

```text
cc_counters
```

Ejemplo:

```json
{
  "USR": 2,
  "CLI": 3,
  "PER": 3,
  "DOC": 15,
  "TRX": 25,
  "IMP": 10,
  "OBL": 5,
  "ALR": 6,
  "REP": 1,
  "LOG": 30
}
```

---

## Claves de LocalStorage

Todas las claves técnicas usan el prefijo:

```text
cc_
```

| Clave | Contenido |
|---|---|
| `cc_version` | Versión del esquema de datos |
| `cc_session` | Sesión activa simulada |
| `cc_users` | Usuarios del sistema |
| `cc_clients` | Clientes microempresarios |
| `cc_periods` | Periodos contables |
| `cc_documents` | Documentos de respaldo contable |
| `cc_transactions` | Transacciones contables |
| `cc_taxes` | Impuestos calculados |
| `cc_obligations` | Obligaciones tributarias generadas |
| `cc_alerts` | Alertas tributarias y operativas |
| `cc_reports` | Reportes generados |
| `cc_logs` | Bitácora de acciones |
| `cc_settings` | Configuración general |
| `cc_counters` | Contadores de identificadores |

Versión inicial del esquema:

```json
{
  "storageVersion": 1
}
```

---

## Colección: usuarios

Guardada en:

```text
cc_users
```

Estructura:

```json
{
  "id": "USR-0001",
  "nombre": "Administrador",
  "usuario": "admin",
  "email": "admin@cuentasclaras.bo",
  "passwordHash": "hash-demo",
  "rol": "administrador",
  "estado": "activo",
  "fechaCreacion": "2026-10-01"
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `nombre` | texto | sí | Nombre visible |
| `usuario` | texto | sí | Nombre de acceso |
| `email` | texto | no | Correo de contacto |
| `passwordHash` | texto | sí | Contraseña hasheada o demo |
| `rol` | texto | sí | Rol del usuario |
| `estado` | texto | sí | `activo` o `inactivo` |
| `fechaCreacion` | fecha | sí | Fecha alta |

Roles permitidos:

```text
administrador
contador
consulta
```

Para el MVP inicial se usarán:

```text
administrador
contador
```

---

## Colección: clientes

Guardada en:

```text
cc_clients
```

Estructura:

```json
{
  "id": "CLI-0001",
  "nombreComercial": "Tienda Doña Rosa",
  "razonSocial": "Rosa Mamani",
  "nit": "123456789",
  "telefono": "70000001",
  "whatsapp": "70000001",
  "direccion": "Mercado Pompeya, puesto 12",
  "regimenTributario": "Régimen General",
  "tipoNegocio": "Abarrotes",
  "estado": "activo",
  "fechaAlta": "2026-10-01",
  "observacion": ""
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `nombreComercial` | texto | sí | Nombre del negocio |
| `razonSocial` | texto | no | Nombre legal o persona |
| `nit` | texto | no | Número de identificación tributaria |
| `telefono` | texto | sí | Teléfono de contacto |
| `whatsapp` | texto | no | Número para WhatsApp |
| `direccion` | texto | no | Dirección o referencia |
| `regimenTributario` | texto | sí | Régimen declarado o estimado |
| `tipoNegocio` | texto | sí | Giro del negocio |
| `estado` | texto | sí | `activo` o `inactivo` |
| `fechaAlta` | fecha | sí | Fecha de registro |
| `observacion` | texto | no | Notas internas |

Regímenes permitidos:

```text
Régimen General
Régimen Simplificado
Otro
Por definir
```

Tipos de negocio sugeridos:

```text
Abarrotes
Tienda de barrio
Ferretería
Mercado
Feria
Distribución menor
Servicios
Otro
```

---

## Colección: periodos

Guardada en:

```text
cc_periods
```

Estructura:

```json
{
  "id": "PER-0001",
  "clienteId": "CLI-0001",
  "mes": 10,
  "anio": 2026,
  "estado": "abierto",
  "fechaApertura": "2026-10-01",
  "fechaCierre": null,
  "observacion": ""
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `clienteId` | texto | sí | Cliente al que pertenece |
| `mes` | número | sí | Mes del periodo |
| `anio` | número | sí | Año del periodo |
| `estado` | texto | sí | Estado del periodo |
| `fechaApertura` | fecha | sí | Fecha de apertura |
| `fechaCierre` | fecha o null | no | Fecha de cierre |
| `observacion` | texto | no | Notas |

Estados permitidos:

```text
abierto
en_revision
cerrado
```

Regla:

- No debe existir más de un periodo activo para el mismo cliente, mismo mes y mismo año.
- Un periodo cerrado no admite creación ni edición de documentos o transacciones.
- La reapertura de un periodo debe registrarse en bitácora.

---

## Colección: documentos

Guardada en:

```text
cc_documents
```

Estructura:

```json
{
  "id": "DOC-0001",
  "clienteId": "CLI-0001",
  "periodoId": "PER-0001",
  "tipo": "factura_venta",
  "fechaDocumento": "2026-10-05",
  "monto": 250,
  "tercero": "Cliente general",
  "estado": "validado",
  "archivoNombre": "",
  "archivoDataUrl": "",
  "observacion": "Venta mostrador"
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `clienteId` | texto | sí | Cliente relacionado |
| `periodoId` | texto | sí | Periodo relacionado |
| `tipo` | texto | sí | Tipo documental |
| `fechaDocumento` | fecha | sí | Fecha del documento |
| `monto` | número | sí | Monto referencial |
| `tercero` | texto | no | Proveedor, cliente o tercero |
| `estado` | texto | sí | Estado documental |
| `archivoNombre` | texto | no | Nombre del archivo adjunto |
| `archivoDataUrl` | texto | no | Datos del archivo, opcional |
| `observacion` | texto | no | Notas |

Tipos documentales permitidos:

```text
factura_venta
factura_compra
recibo
nota
extracto
otro
```

Estados permitidos:

```text
pendiente
recibido
validado
rechazado
```

Regla MVP inicial:

- En una primera versión, el sistema puede guardar solo metadatos del documento.
- El campo `archivoDataUrl` queda previsto para futura adjunción de imagen, pero no es obligatorio.
- No se deben guardar imágenes grandes en LocalStorage.

---

## Colección: transacciones

Guardada en:

```text
cc_transactions
```

Estructura:

```json
{
  "id": "TRX-0001",
  "clienteId": "CLI-0001",
  "periodoId": "PER-0001",
  "documentoId": "DOC-0001",
  "fecha": "2026-10-05",
  "tipo": "venta",
  "cuenta": "Ventas",
  "monto": 250,
  "tercero": "Cliente general",
  "formaPago": "efectivo",
  "estado": "activa",
  "observacion": ""
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `clienteId` | texto | sí | Cliente relacionado |
| `periodoId` | texto | sí | Periodo relacionado |
| `documentoId` | texto o null | no | Documento vinculado |
| `fecha` | fecha | sí | Fecha de la operación |
| `tipo` | texto | sí | Tipo de transacción |
| `cuenta` | texto | sí | Cuenta contable simplificada |
| `monto` | número | sí | Monto de la operación |
| `tercero` | texto | no | Tercero relacionado |
| `formaPago` | texto | no | Forma de pago |
| `estado` | texto | sí | Estado de la transacción |
| `observacion` | texto | no | Notas |

Tipos permitidos:

```text
venta
compra
gasto
ingreso
```

Formas de pago sugeridas:

```text
efectivo
banco
tarjeta
transferencia
credito
otro
```

Estados permitidos:

```text
activa
anulada
```

Regla contable:

- No se eliminan físicamente transacciones contables.
- Para corregir un error, se anula la transacción y se registra una nueva si corresponde.
- No se permiten transacciones en periodo cerrado.

---

## Catálogo de cuentas simplificado

Para microempresas comerciales se usará un catálogo simple.

Ejemplo:

```text
1. Activo
   1.1 Caja
   1.2 Bancos
   1.3 Cuentas por cobrar
   1.4 Inventario

2. Pasivo
   2.1 Cuentas por pagar
   2.2 Impuestos por pagar

3. Patrimonio
   3.1 Capital
   3.2 Utilidades acumuladas

4. Ingresos
   4.1 Ventas

5. Costos
   5.1 Costo de ventas

6. Gastos
   6.1 Alquiler
   6.2 Servicios básicos
   6.3 Transporte
   6.4 Otros gastos
```

En el MVP, la cuenta puede guardarse como texto simple:

```json
{
  "cuenta": "Ventas"
}
```

Posteriormente podrá normalizarse con código de cuenta.

---

## Colección: impuestos

Guardada en:

```text
cc_taxes
```

Estructura:

```json
{
  "id": "IMP-0001",
  "clienteId": "CLI-0001",
  "periodoId": "PER-0001",
  "tipo": "IVA",
  "concepto": "debito_fiscal",
  "baseImponible": 250,
  "tasa": 0.13,
  "monto": 32.5,
  "fechaCalculo": "2026-10-31"
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `clienteId` | texto | sí | Cliente relacionado |
| `periodoId` | texto | sí | Periodo relacionado |
| `tipo` | texto | sí | Tipo de impuesto |
| `concepto` | texto | sí | Concepto del cálculo |
| `baseImponible` | número | sí | Base sobre la que se calcula |
| `tasa` | número | sí | Porcentaje decimal |
| `monto` | número | sí | Resultado del cálculo |
| `fechaCalculo` | fecha | sí | Fecha de cálculo |

Tipos permitidos:

```text
IVA
IT
RC-IVA
IUE
OTRO
```

Conceptos permitidos:

```text
debito_fiscal
credito_fiscal
por_pagar
ventas_brutas
referencia
otro
```

Tasas referenciales:

```json
{
  "IVA": 0.13,
  "IT": 0.03
}
```

Advertencia:

- El cálculo es informativo y preventivo.
- No constituye declaración oficial ante el SIN.
- Debe validarse contra normativa vigente.

---

## Colección: obligaciones

Guardada en:

```text
cc_obligations
```

Estructura:

```json
{
  "id": "OBL-0001",
  "clienteId": "CLI-0001",
  "periodoId": "PER-0001",
  "tipo": "IVA",
  "descripcion": "Declaración mensual IVA",
  "fechaVencimiento": "2026-11-20",
  "montoEstimado": 32.5,
  "estado": "pendiente"
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `clienteId` | texto | sí | Cliente relacionado |
| `periodoId` | texto | sí | Periodo relacionado |
| `tipo` | texto | sí | Tipo de obligación |
| `descripcion` | texto | sí | Descripción visible |
| `fechaVencimiento` | fecha | sí | Fecha límite referencial |
| `montoEstimado` | número | no | Monto estimado |
| `estado` | texto | sí | Estado de la obligación |

Estados permitidos:

```text
pendiente
en_proceso
presentada
pagada
vencida
anulada
```

Regla demo:

```text
fechaVencimiento = día 20 del mes siguiente al periodo
```

Ejemplo:

```text
Periodo octubre 2026 -> vencimiento 20 noviembre 2026
```

---

## Colección: alertas

Guardada en:

```text
cc_alerts
```

Estructura:

```json
{
  "id": "ALR-0001",
  "clienteId": "CLI-0001",
  "periodoId": "PER-0001",
  "obligacionId": "OBL-0001",
  "tipo": "vencimiento_tributario",
  "nivel": "preventiva",
  "titulo": "Vencimiento IVA próximo",
  "mensaje": "La declaración de IVA vence el 20/11/2026.",
  "fechaAlerta": "2026-11-13",
  "estado": "pendiente"
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `clienteId` | texto | sí | Cliente relacionado |
| `periodoId` | texto o null | no | Periodo relacionado |
| `obligacionId` | texto o null | no | Obligación relacionada |
| `tipo` | texto | sí | Tipo de alerta |
| `nivel` | texto | sí | Nivel de urgencia |
| `titulo` | texto | sí | Título corto |
| `mensaje` | texto | sí | Mensaje visible |
| `fechaAlerta` | fecha | sí | Fecha de generación |
| `estado` | texto | sí | Estado de la alerta |

Tipos permitidos:

```text
vencimiento_tributario
documento_pendiente
periodo_sin_cerrar
transaccion_sin_documento
impuesto_no_calculado
cobranza_pendiente
otro
```

Niveles permitidos:

```text
informativa
preventiva
urgente
vencida
```

Estados permitidos:

```text
pendiente
vista
resuelta
vencida
```

Regla de duplicidad:

- No deben generarse alertas duplicadas para la misma obligación, mismo tipo y mismo periodo si ya existe una alerta pendiente o vista.
- Si la condición cambia de nivel, puede actualizarse la alerta existente o generarse una nueva según criterio. Para MVP, se recomienda actualizar estado/nivel si aún no está resuelta.

---

## Colección: reportes

Guardada en:

```text
cc_reports
```

Estructura:

```json
{
  "id": "REP-0001",
  "clienteId": "CLI-0001",
  "periodoId": "PER-0001",
  "tipo": "mensual",
  "fechaGeneracion": "2026-10-31",
  "resumen": {
    "ventas": 8500,
    "compras": 5200,
    "gastos": 1100,
    "utilidadEstimada": 2200,
    "ivaPorPagar": 377,
    "itEstimado": 85
  },
  "archivoNombre": "reporte-cli001-oct2026.pdf",
  "estado": "generado"
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `clienteId` | texto | sí | Cliente relacionado |
| `periodoId` | texto | sí | Periodo relacionado |
| `tipo` | texto | sí | Tipo de reporte |
| `fechaGeneracion` | fecha | sí | Fecha de generación |
| `resumen` | objeto | sí | Valores resumidos |
| `archivoNombre` | texto | no | Nombre de archivo PDF |
| `estado` | texto | sí | Estado del reporte |

Tipos permitidos:

```text
mensual
borrador
final
```

Estados permitidos:

```text
borrador
generado
enviado
anulado
```

Contenido mínimo del reporte mensual:

```text
1. Resumen del mes
2. Impuestos estimados
3. Documentos pendientes
4. Alertas
5. Recomendaciones
6. Próximo paso
```

El reporte debe usar lenguaje sencillo para el microempresario.

---

## Colección: bitácora

Guardada en:

```text
cc_logs
```

Estructura:

```json
{
  "id": "LOG-0001",
  "usuarioId": "USR-0001",
  "accion": "crear_cliente",
  "entidad": "clients",
  "registroId": "CLI-0002",
  "fecha": "2026-10-18T10:30:00",
  "detalle": "Alta de cliente Ferretería San Luis"
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `usuarioId` | texto | sí | Usuario que ejecutó la acción |
| `accion` | texto | sí | Acción técnica |
| `entidad` | texto | sí | Colección afectada |
| `registroId` | texto | no | Registro afectado |
| `fecha` | fecha-hora | sí | Momento de la acción |
| `detalle` | texto | no | Descripción legible |

Acciones sugeridas:

```text
login
logout
crear_cliente
editar_cliente
desactivar_cliente
abrir_periodo
cerrar_periodo
reabrir_periodo
crear_documento
actualizar_documento
crear_transaccion
anular_transaccion
calcular_impuestos
generar_obligacion
generar_alerta
marcar_alerta_vista
resolver_alerta
generar_reporte
exportar_respaldo
importar_respaldo
cargar_seed
restablecer_sistema
```

Entidades sugeridas:

```text
users
clients
periods
documents
transactions
taxes
obligations
alerts
reports
settings
backup
```

---

## Colección: configuración

Guardada en:

```text
cc_settings
```

Estructura:

```json
{
  "appName": "Cuentas Claras MVP",
  "appVersion": "0.1.0",
  "storageVersion": 1,
  "currency": "Bs",
  "country": "Bolivia",
  "department": "Beni",
  "city": "Trinidad",
  "taxRates": {
    "IVA": 0.13,
    "IT": 0.03
  },
  "genericDueDay": 20,
  "alertDaysBefore": 7,
  "urgentDaysBefore": 3,
  "seedLoaded": false,
  "lastBackupAt": null,
  "professionalDisclaimer": "Este sistema no sustituye la firma de un Contador Público Autorizado cuando la normativa lo exija."
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appName` | texto | sí | Nombre del sistema |
| `appVersion` | texto | sí | Versión del prototipo |
| `storageVersion` | número | sí | Versión del esquema LocalStorage |
| `currency` | texto | sí | Moneda |
| `country` | texto | sí | País |
| `department` | texto | sí | Departamento |
| `city` | texto | sí | Ciudad |
| `taxRates` | objeto | sí | Tasas referenciales |
| `genericDueDay` | número | sí | Día genérico de vencimiento |
| `alertDaysBefore` | número | sí | Días antes para alerta preventiva |
| `urgentDaysBefore` | número | sí | Días antes para alerta urgente |
| `seedLoaded` | booleano | sí | Si ya se cargaron datos demo |
| `lastBackupAt` | fecha-hora o null | no | Último respaldo |
| `professionalDisclaimer` | texto | sí | Aviso legal |

---

## Colección: sesión

Guardada en:

```text
cc_session
```

Estructura:

```json
{
  "userId": "USR-0001",
  "usuario": "admin",
  "nombre": "Administrador",
  "rol": "administrador",
  "loginAt": "2026-10-18T09:00:00",
  "activo": true
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `userId` | texto | sí | Usuario autenticado |
| `usuario` | texto | sí | Nombre de usuario |
| `nombre` | texto | sí | Nombre visible |
| `rol` | texto | sí | Rol |
| `loginAt` | fecha-hora | sí | Fecha de ingreso |
| `activo` | booleano | sí | Sesión activa |

Advertencia:

- La sesión es simulada.
- No es seguridad real de producción.
- Sirve para demostrar control de acceso básico.

---

## Formato de respaldo JSON

El respaldo exportado deberá tener esta estructura:

```json
{
  "app": "Cuentas Claras MVP",
  "version": 1,
  "exportedAt": "2026-10-18T12:00:00",
  "data": {
    "users": [],
    "clients": [],
    "periods": [],
    "documents": [],
    "transactions": [],
    "taxes": [],
    "obligations": [],
    "alerts": [],
    "reports": [],
    "logs": [],
    "settings": {},
    "counters": {}
  }
}
```

Reglas de importación:

- Validar que sea JSON.
- Validar que contenga `data`.
- Validar que `version` sea compatible.
- No importar si hay errores graves de estructura.
- Preguntar al usuario si desea reemplazar datos actuales.
- Registrar acción en bitácora.

---

## Reglas de negocio mínimas

### Regla 1: Cliente

- Un cliente puede tener muchos periodos.
- Un cliente inactivo no debería permitir abrir nuevos periodos.
- No se eliminan clientes con historial; se desactivan.

### Regla 2: Periodo

- Todo periodo pertenece a un cliente.
- No debe existir más de un periodo abierto o en revisión para el mismo cliente, mes y año.
- Un periodo cerrado bloquea creación y edición de documentos y transacciones.
- Reabrir un periodo debe quedar registrado en bitácora.

### Regla 3: Documento

- Todo documento pertenece a un cliente y un periodo.
- El monto del documento es referencial.
- Un documento puede estar pendiente, recibido, validado o rechazado.
- Un documento rechazado no debería alimentar cálculos tributarios hasta ser corregido o validado.

### Regla 4: Transacción

- Toda transacción pertenece a un cliente y un periodo.
- Puede vincularse opcionalmente a un documento.
- No se elimina físicamente; se anula.
- No se registran transacciones en periodo cerrado.
- El monto debe ser mayor que cero.
- La fecha debe corresponder al periodo, salvo criterio contrario documentado.

### Regla 5: Impuestos

- El cálculo se realiza por cliente y periodo.
- El cálculo es informativo.
- Debe guardarse fecha de cálculo.
- Si no hay transacciones, puede mostrar cero o advertencia.
- Debe impedir o advertir cálculo en periodo cerrado sin autorización.

### Regla 6: Obligaciones

- Se generan a partir de impuestos calculados.
- Deben tener fecha de vencimiento referencial.
- El estado inicial será `pendiente`.

### Regla 7: Alertas

- Se generan por vencimiento próximo, vencimiento pasado, documentos pendientes, periodos sin cerrar, transacciones sin documento o impuestos no calculados.
- Deben poder marcarse como vistas o resueltas.
- No deben duplicarse sin control.

### Regla 8: Reportes

- El reporte mensual debe ser comprensible para el comerciante.
- Debe incluir resumen económico, impuestos estimados, documentos pendientes, alertas y recomendaciones.
- Debe poder imprimirse o guardarse como PDF desde el navegador.
- Si el periodo no está cerrado, puede generarse como borrador con leyenda visible.

### Regla 9: Seguridad y ética

- La información del cliente es confidencial.
- El sistema debe mostrar aviso de LocalStorage.
- El sistema debe mostrar aviso de que no sustituye al Contador Público Autorizado.
- Los respaldos JSON deben manejarse con cuidado.

---

## Valores iniciales demo

Usuarios:

```text
admin / Admin123 / administrador
contador / Contador123 / contador
```

Clientes:

```text
CLI-0001 Tienda Doña Rosa
CLI-0002 Ferretería San Luis
CLI-0003 Abarrotes La Esquina
```

Periodos:

```text
PER-0001 CLI-0001 octubre 2026 abierto
PER-0002 CLI-0002 octubre 2026 en_revision
PER-0003 CLI-0003 octubre 2026 cerrado
```

Impuestos referenciales:

```text
IVA 13%
IT 3%
RC-IVA referencia informativa
```

Vencimiento demo:

```text
20 del mes siguiente
```

---

## Criterio de aceptación del contrato de datos

Este documento se considera aprobado cuando:

- define todas las colecciones mínimas;
- define claves de LocalStorage;
- define identificadores;
- define estados;
- define reglas de negocio básicas;
- permite iniciar Fase 1 sin cambiar estructuras principales.
```
