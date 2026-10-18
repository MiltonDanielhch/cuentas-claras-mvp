# Contrato de datos de Cuentas Claras

## 1. Propósito

Este documento describe cómo el prototipo organiza, valida y protege la información contable.

No es un diccionario de base de datos productivo, sino un **contrato académico de datos**: define qué guarda el sistema, cómo se relaciona y qué reglas debe cumplir.

---

## 2. Almacenamiento

El sistema usa LocalStorage con prefijo:

```text
cc_
```

Cada colección se guarda como un arreglo JSON.

Ejemplo de claves:

```text
cc_storage_version
cc_session
cc_users
cc_clients
cc_periods
cc_documents
cc_transactions
cc_taxes
cc_obligations
cc_accounts
cc_journal_entries
cc_journal_lines
cc_fixed_assets
cc_financial_snapshots
cc_alerts
cc_reports
cc_logs
cc_settings
cc_counters
```

---

## 3. Colecciones principales

| Colección | Clave LocalStorage | Descripción |
|---|---|---|
| users | cc_users | Usuarios demo del sistema |
| clients | cc_clients | Microempresas clientes |
| periods | cc_periods | Periodos contables mensuales |
| documents | cc_documents | Documentos de respaldo |
| transactions | cc_transactions | Operaciones económicas |
| taxes | cc_taxes | Cálculos tributarios informativos |
| obligations | cc_obligations | Obligaciones preventivas |
| accounts | cc_accounts | Plan de cuentas |
| journalEntries | cc_journal_entries | Asientos del Libro Diario |
| journalLines | cc_journal_lines | Líneas de débito y crédito |
| fixedAssets | cc_fixed_assets | Activos fijos para depreciación |
| financialSnapshots | cc_financial_snapshots | Evidencia congelada de cálculos |
| alerts | cc_alerts | Alertas tributarias y operativas |
| reports | cc_reports | Reportes mensuales guardados |
| logs | cc_logs | Bitácora de acciones |
| settings | cc_settings | Configuración general |
| counters | cc_counters | Contadores para IDs |

---

## 4. Entidades clave

### 4.1 Cliente

Campos relevantes:

- `id`
- `nombreComercial`
- `razonSocial`
- `nit`
- `regimenTributario`
- `tipoNegocio`
- `telefono`
- `whatsapp`
- `capitalInicial`
- `costosFijosMensuales`
- `estado`

Regla:

> Un cliente puede tener varios periodos, documentos, transacciones, asientos, activos fijos, alertas y reportes.

---

### 4.2 Periodo

Campos relevantes:

- `id`
- `clienteId`
- `anio`
- `mes`
- `estado`
- `fechaCierre`
- `closedAt`
- `closingEntryId`

Estados:

- `abierto`
- `en_revision`
- `cerrado`

Regla:

> Si el periodo está cerrado, no se admiten nuevos documentos, transacciones ni asientos. La reapertura anula los asientos de cierre vigentes y queda en bitácora.

---

### 4.3 Documento

Campos relevantes:

- `id`
- `clienteId`
- `periodoId`
- `tipo`
- `fecha`
- `tercero`
- `monto`
- `estado`
- `observacion`

Tipos:

- `factura_venta`
- `factura_compra`
- `recibo`
- `nota`
- `extracto`
- `otro`

Estados:

- `pendiente`
- `recibido`
- `validado`
- `rechazado`

Regla:

> Todo documento debe vincularse a un cliente y a un periodo.

---

### 4.4 Transacción

Campos relevantes:

- `id`
- `clienteId`
- `periodoId`
- `documentoId`
- `tipo`
- `fecha`
- `monto`
- `tercero`
- `formaPago`
- `cuenta`
- `journalEntryId`
- `estado`

Tipos:

- `venta`
- `compra`
- `gasto`
- `ingreso`

Estados:

- `activa`
- `anulada`

Regla:

> Una transacción activa puede generar un asiento automático. Si se anula el asiento, la transacción queda sin `journalEntryId` para poder regenerarlo.

---

### 4.5 Asiento contable (journalEntry)

Campos relevantes:

- `id`
- `folio`
- `clienteId`
- `periodoId`
- `documentoId`
- `transaccionId`
- `fecha`
- `tipoAsiento`
- `categoriaAjuste`
- `origen`
- `descripcion`
- `observacion`
- `estado`

Tipos de asiento:

- `operacion`
- `ajuste`
- `cierre`
- `apertura`

Origen:

- `automatico`
- `manual`

Estados:

- `vigente`
- `anulado`

Regla:

> Un asiento vigente debe cuadrar: suma de débitos = suma de créditos. La anulación no elimina el asiento, solo cambia su estado para preservar trazabilidad.

---

### 4.6 Línea de asiento (journalLine)

Campos relevantes:

- `id`
- `asientoId`
- `clienteId`
- `periodoId`
- `cuentaCodigo`
- `debito`
- `credito`
- `tercero`
- `referencia`
- `observacion`

Regla:

> Solo cuentas de nivel 3 y estado `activa` admiten movimientos. Cada línea registra débito o crédito, nunca ambos simultáneamente en la misma línea.

---

### 4.7 Plan de cuentas (account)

Campos relevantes:

- `codigo`
- `nombre`
- `tipo`
- `naturaleza`
- `nivel`
- `codigoPadre`
- `estado`
- `esTemporal`
- `esContra`
- `observacion`

Tipos:

- `activo`
- `pasivo`
- `patrimonio`
- `ingreso`
- `costo`
- `gasto`

Naturaleza:

- `deudora`
- `acreedora`

Regla:

> Las cuentas temporales (`esTemporal: true`) se cierran contra `3.1.03 Resultados del ejercicio`. Las cuentas compensadoras (`esContra: true`) restan dentro de su grupo.

---

### 4.8 Activo fijo (fixedAsset)

Campos relevantes:

- `id`
- `clienteId`
- `descripcion`
- `categoria`
- `fechaAdquisicion`
- `costoAdquisicion`
- `valorResidual`
- `vidaUtilMeses`
- `depreciacionAcumulada`
- `cuentaGastoDepreciacion`
- `cuentaDepreciacion`
- `estado`

Regla:

> La depreciación mensual se calcula con método lineal simple:

```text
depreciación mensual = (costo - valor residual) / vida útil en meses
```

> El sistema evita depreciar dos veces el mismo activo en el mismo periodo mediante verificación de asientos de ajuste tipo `depreciacion` con referencia al ID del activo.

---

### 4.9 Impuesto (tax)

Campos relevantes:

- `id`
- `clienteId`
- `periodoId`
- `tipo`
- `concepto`
- `base`
- `tasa`
- `monto`
- `fechaCalculo`
- `estado`

Tipos conceptuales:

- `IVA` / `ventas_brutas`
- `IVA` / `compras_brutas`
- `IVA` / `por_pagar`
- `IT` / `ventas_brutas`

Regla:

> Los impuestos son informativos y preventivos. No constituyen declaración automática ante el SIN.

---

### 4.10 Obligación (obligation)

Campos relevantes:

- `id`
- `clienteId`
- `periodoId`
- `tipo`
- `fechaVencimiento`
- `montoEstimado`
- `estado`

Estados:

- `pendiente`
- `en_proceso`
- `presentada`
- `pagada`
- `vencida`
- `anulada`

Regla:

> Las obligaciones alimentan las alertas de vencimiento tributario.

---

### 4.11 Alerta (alert)

Campos relevantes:

- `id`
- `clienteId`
- `periodoId`
- `obligacionId`
- `asientoId`
- `registroId`
- `entidad`
- `tipo`
- `nivel`
- `titulo`
- `mensaje`
- `fechaAlerta`
- `estado`

Niveles:

- `informativa`
- `preventiva`
- `urgente`
- `vencida`

Estados:

- `pendiente`
- `vista`
- `resuelta`
- `vencida`

Regla anti-duplicidad:

> No se crea una alerta nueva si ya existe una alerta activa (estado `pendiente`, `vista` o `vencida`) con el mismo `tipo`, `clienteId`, `periodoId` y `registroId`. Si se marca como `resuelta`, no vuelve a generarse automáticamente para la misma condición.

---

### 4.12 Snapshot financiero (financialSnapshot)

Campos relevantes:

- `id`
- `clienteId`
- `periodoId`
- `tipo`
- `fechaGeneracion`
- `usuarioId`
- `contenido`
- `estado`

Tipos:

- `estado_resultados`
- `balance`
- `indicadores`

Regla:

> El snapshot congela evidencia del cálculo en un momento dado. No altera los cálculos vivos, que siguen derivándose del Libro Diario.

---

### 4.13 Reporte (report)

Campos relevantes:

- `id`
- `clienteId`
- `periodoId`
- `tipo`
- `fechaGeneracion`
- `resumen`
- `snapshotId`
- `archivoNombre`
- `estado`
- `usuarioId`

Estados:

- `borrador`
- `generado`
- `enviado`
- `anulado`

Regla:

> El reporte guarda un resumen congelado (`resumen`) para consulta posterior, independiente de los cálculos vivos.

---

### 4.14 Bitácora (log)

Campos relevantes:

- `id`
- `fecha`
- `usuarioId`
- `accion`
- `entidad`
- `registroId`
- `detalle`

Regla:

> Toda acción relevante (crear, actualizar, anular, cerrar, reabrir, depreciar, generar asiento, exportar, importar, restablecer) debe quedar registrada en bitácora para trazabilidad académica.

---

## 5. Reglas de integridad contable

### 5.1 Asiento cuadrado

Para cada asiento vigente:

```text
Σ débitos = Σ créditos
```

Si no cuadra, el sistema debe impedir guardarlo.

---

### 5.2 Balanza de comprobación

Incluye:

- asientos tipo `operacion`;
- asientos tipo `apertura`;
- NO incluye ajustes;
- NO incluye cierres.

Verifica:

- cuadratura de movimientos del periodo;
- cuadratura de saldos acumulados.

---

### 5.3 Balanza ajustada

Incluye:

- asientos de operación;
- asientos de apertura;
- asientos de ajuste;
- NO incluye cierres para efectos de EE.FF. vivos.

Es la base para:

- Estado de Resultados;
- Balance General;
- costos e indicadores.

---

### 5.4 Cierre contable

Genera asientos tipo `cierre`.

Cierra cuentas temporales contra:

```text
3.1.03 Resultados del ejercicio
```

Y traslada resultado a:

```text
3.1.02 Resultados acumulados
```

Regla:

> Los EE.FF. vivos excluyen asientos de cierre para conservar visibles ingresos, costos y gastos del periodo. El snapshot guarda evidencia del momento de emisión.

---

### 5.5 Anulación con trazabilidad

El sistema no borra asientos ni transacciones.

Cambia estado:

```text
vigente → anulado
activa → anulada
```

Esto preserva evidencia académica y contable.

---

## 6. Reglas de respaldo

El respaldo JSON incluye:

- todas las colecciones;
- configuración (`settings`);
- contadores (`counters`);
- versión de esquema (`storageVersion`).

Modos de importación:

- `reemplazar`: borra datos actuales y carga el respaldo.
- `fusionar`: actualiza registros con mismo ID y agrega los nuevos.

Regla:

> Antes de importar, el sistema valida estructura básica, presencia de `data`, colecciones esperadas y versión declarada. Tras importar, recalcula contadores de ID.

---

## 7. Relaciones entre entidades

```text
clients 1 ──── * periods
clients 1 ──── * documents
clients 1 ──── * transactions
clients 1 ──── * journalEntries
clients 1 ──── * fixedAssets
clients 1 ──── * taxes
clients 1 ──── * obligations
clients 1 ──── * alerts
clients 1 ──── * reports
clients 1 ──── * financialSnapshots

periods 1 ──── * documents
periods 1 ──── * transactions
periods 1 ──── * journalEntries
periods 1 ──── * taxes
periods 1 ──── * obligations
periods 1 ──── * alerts

documents 1 ──── * transactions
transactions 1 ──── 1 journalEntries (vía journalEntryId)
journalEntries 1 ──── * journalLines
journalLines * ──── 1 accounts (vía cuentaCodigo)
```

Regla de integridad referencial (lógica, no impuesta por BD):

> Toda línea de asiento debe apuntar a un asiento vigente y a una cuenta de nivel 3 activa. Todo asiento debe apuntar a un cliente y un periodo existentes.

---

## 8. Limitaciones del contrato de datos

Por ser prototipo LocalStorage:

- no hay transacciones SQL;
- no hay bloqueos concurrentes;
- no hay integridad referencial impuesta por base de datos;
- no hay cifrado;
- no hay auditoría externa;
- la validación depende del front-end;
- los datos no se sincronizan entre dispositivos ni navegadores.

Esto es aceptable académicamente, pero debe declararse como límite.

---

## 9. Proyección a base de datos real

En una versión productiva, este contrato migraría a tablas relacionales como:

- clients
- periods
- documents
- transactions
- accounts
- journal_entries
- journal_lines
- taxes
- obligations
- fixed_assets
- alerts
- reports
- financial_snapshots
- audit_logs

Con claves foráneas, índices, constraints `CHECK` para cuadratura de asientos, triggers o procedimientos para anulación con trazabilidad, y respaldos server-side automáticos.
