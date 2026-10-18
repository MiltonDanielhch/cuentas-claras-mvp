# Ciclo contable digital implementado en Cuentas Claras

## 1. Alcance

El prototipo implementa un **ciclo contable simplificado para microempresa comercial**, adaptado al alcance académico del proyecto de Técnico Medio en Contabilidad.

No es un sistema contable empresarial completo, pero sí demuestra, de forma verificable, las etapas fundamentales del proceso contable digital:

- apertura y catálogo;
- registro documental y de operaciones;
- Libro Diario con doble entrada;
- Libro Mayor derivado;
- Balanza de comprobación;
- ajustes contables;
- Balanza ajustada;
- Estado de Resultados;
- Balance General;
- cierre de periodo;
- costos, indicadores y reporte.

El principio rector es uno solo:

> El Libro Diario es la fuente principal de verdad contable. Todo lo demás (Mayor, Balanza, EE.FF., indicadores) se calcula en vivo desde las líneas de asiento vigentes del Diario.

---

## 2. Plan de cuentas base del ciclo

El ciclo opera sobre un plan de cuentas de nivel 3, único nivel que admite movimientos:

| Código | Cuenta | Tipo | Naturaleza | Temporal | Contra |
|---|---|---|---|---|---|
| 1.1.01 | Caja | Activo | Deudora | No | No |
| 1.1.02 | Bancos | Activo | Deudora | No | No |
| 1.1.03 | Clientes / Cuentas por cobrar | Activo | Deudora | No | No |
| 1.1.04 | Inventario de mercancías | Activo | Deudora | No | No |
| 1.1.05 | IVA Crédito Fiscal | Activo | Deudora | No | No |
| 1.1.06 | Otras cuentas por cobrar | Activo | Deudora | No | No |
| 1.2.01 | Mobiliario y equipo | Activo | Deudora | No | No |
| 1.2.02 | Depreciación acumulada | Activo | Acreedora | No | Sí |
| 1.2.03 | Intangibles | Activo | Deudora | No | No |
| 2.1.01 | Proveedores / Cuentas por pagar | Pasivo | Acreedora | No | No |
| 2.1.02 | IVA Débito Fiscal | Pasivo | Acreedora | No | No |
| 2.1.03 | Impuestos por pagar | Pasivo | Acreedora | No | No |
| 2.1.04 | Sueldos y salarios por pagar | Pasivo | Acreedora | No | No |
| 2.1.05 | Otros pasivos corrientes | Pasivo | Acreedora | No | No |
| 2.2.01 | Préstamos a largo plazo | Pasivo | Acreedora | No | No |
| 3.1.01 | Capital / Aportes del propietario | Patrimonio | Acreedora | No | No |
| 3.1.02 | Resultados acumulados | Patrimonio | Acreedora | No | No |
| 3.1.03 | Resultados del ejercicio | Patrimonio | Acreedora | Sí | No |
| 4.1.01 | Ventas | Ingreso | Acreedora | Sí | No |
| 4.1.02 | Otros ingresos | Ingreso | Acreedora | Sí | No |
| 5.1.01 | Compras / Costo de ventas | Costo | Deudora | Sí | No |
| 5.1.02 | Devoluciones y descuentos sobre compras | Costo | Acreedora | Sí | Sí |
| 6.1.01 | Gastos de administración | Gasto | Deudora | Sí | No |
| 6.1.02 | Gastos de venta | Gasto | Deudora | Sí | No |
| 6.1.03 | Gastos financieros | Gasto | Deudora | Sí | No |
| 6.1.04 | Depreciación y amortización | Gasto | Deudora | Sí | No |
| 6.1.05 | Otros gastos | Gasto | Deudora | Sí | No |

Regla de uso:

- Cuentas **temporales** (ingresos, costos, gastos y 3.1.03) se cierran al final del periodo.
- Cuentas **compensadoras** (1.2.02 y 5.1.02) restan dentro de su grupo.
- Solo cuentas de **nivel 3 activas** admiten débito o crédito.

---

## 3. Etapas implementadas

### Etapa 1: Catálogo y apertura

Elementos que el sistema prepara antes de operar:

- plan de cuentas migrado desde configuración;
- periodos contables mensuales por cliente;
- clientes con régimen tributario, NIT, capital inicial y costos fijos estimados;
- activos fijos semilla para depreciación;
- contadores de folio y de IDs.

Asiento de apertura típico (aporte de capital):

```text
Débito   1.1.01 Caja                       Bs 5.000,00
Crédito  3.1.01 Capital / Aportes          Bs 5.000,00
```

---

### Etapa 2: Documentos y transacciones

El sistema registra documentos de respaldo y los vincula a transacciones.

Documentos soportados:

- factura de venta;
- factura de compra;
- recibo;
- nota;
- extracto bancario;
- otro documento.

Transacciones clasificadas como:

- venta;
- compra;
- gasto;
- ingreso.

Cada transacción captura: cliente, periodo, fecha, monto, tercero, forma de pago y cuenta sugerida.

Regla preventiva:

> Toda transacción activa sin documento o sin asiento genera alerta operativa.

---

### Etapa 3: Libro Diario

El Libro Diario convierte transacciones en asientos de doble entrada.

Origen de los asientos:

- **automático**, generado desde transacciones activas sin asiento;
- **manual**, para ajustes, apertura, correcciones u operaciones especiales.

Ejemplo de asiento automático de venta en **Régimen General**, cobro en efectivo:

```text
Débito   1.1.01 Caja                       Bs 850,00
Crédito  4.1.01 Ventas                     Bs 750,00
Crédito  2.1.02 IVA Débito Fiscal          Bs 100,00
```

Ejemplo de asiento automático de compra en **Régimen General**, pago en efectivo:

```text
Débito   5.1.01 Compras / Costo de ventas  Bs 400,00
Débito   1.1.05 IVA Crédito Fiscal         Bs 52,00
Crédito  1.1.01 Caja                       Bs 452,00
```

Ejemplo de gasto pagado con banco:

```text
Débito   6.1.01 Gastos de administración   Bs 80,00
Crédito  1.1.02 Bancos                     Bs 80,00
```

Regla de cuadratura:

```text
Σ débitos = Σ créditos
```

Si un asiento no cuadra, el sistema impide guardarlo.

Regla de anulación:

> Un asiento no se elimina. Cambia de estado `vigente` a `anulado`. Si era automático, la transacción queda sin `journalEntryId` y puede regenerarse.

---

### Etapa 4: Libro Mayor

El Mayor se calcula en vivo desde las líneas del Diario. No se persiste.

Muestra por cuenta:

- saldo inicial arrastrado de periodos anteriores;
- débitos del periodo;
- créditos del periodo;
- saldo final según naturaleza;
- ficha de cuenta con saldo corrido por movimiento.

Ejemplo de ficha de la cuenta 1.1.01 Caja:

```text
Saldo inicial:        Bs 5.000,00
(+) Débitos periodo:  Bs 850,00
(-) Créditos periodo: Bs 532,00
Saldo final:          Bs 5.318,00
```

Regla:

> Las cuentas compensadoras (1.2.02, 5.1.02) se presentan con saldo acreedor dentro de su grupo, restando al activo o costo correspondiente.

---

### Etapa 5: Balanza de comprobación

Verifica débitos, créditos y saldos **antes de ajustes**.

Incluye:

- asientos tipo `operacion`;
- asientos tipo `apertura`.

Excluye:

- asientos tipo `ajuste`;
- asientos tipo `cierre`.

Indicadores:

- cuadratura de movimientos del periodo: Σ débitos = Σ créditos;
- cuadratura de saldos acumulados: Σ saldo deudor = Σ saldo acreedor.

Regla:

> Si la balanza descuadra, el sistema genera alerta urgente de `balanza_descuadrada`.

---

### Etapa 6: Ajustes contables

Categorías implementadas:

- depreciación;
- amortización;
- provisión;
- devengado;
- reclasificación;
- inventario inicial;
- inventario final;
- otro ajuste.

Depreciación lineal simple:

```text
depreciación mensual = (costo - valor residual) / vida útil en meses
```

Ejemplo de asiento de ajuste por depreciación:

```text
Débito   6.1.04 Depreciación y amortización   Bs 120,00
Crédito  1.2.02 Depreciación acumulada        Bs 120,00
```

Ejemplo de ajuste rápido por devengado:

```text
Débito   6.1.01 Gastos de administración      Bs 120,00
Crédito  2.1.05 Otros pasivos corrientes      Bs 120,00
```

Regla anti-duplicidad:

> Un activo no puede depreciarse dos veces en el mismo periodo. El sistema verifica que no exista un asiento de ajuste tipo `depreciacion` vigente con referencia al ID del activo en ese periodo.

Regla de anulación de ajuste:

> Al anular una depreciación, se revierte la `depreciacionAcumulada` del activo. Al anular cualquier ajuste, el asiento queda `anulado` y deja de afectar la balanza ajustada.

---

### Etapa 7: Balanza ajustada

Incluye:

- asientos de operación;
- asientos de apertura;
- asientos de ajuste.

Excluye:

- asientos de cierre (para efectos de EE.FF. vivos).

Es la base contable de:

- Estado de Resultados;
- Balance General;
- costos e indicadores.

Regla:

> Si aún no se registraron ajustes, la balanza ajustada se verá igual a la de comprobación. Eso es correcto y esperado.

---

### Etapa 8: Estado de Resultados simplificado

Estructura presentada:

```text
Ventas                                     Bs 750,00
(+) Otros ingresos                         Bs   0,00
= Total ingresos                           Bs 750,00

(-) Compras / costo bruto                  Bs 400,00
(+) Devoluciones y descuentos sobre compras Bs   0,00
= Costo neto de ventas                     Bs 400,00

= Utilidad bruta                           Bs 350,00

(-) Gastos de administración               Bs 200,00
(-) Gastos de venta                        Bs   0,00
(-) Gastos financieros                      Bs   0,00
(-) Depreciación y amortización            Bs 120,00
(-) Otros gastos                           Bs   0,00
= Total gastos operativos                  Bs 320,00

= Utilidad operativa                       Bs  30,00

(-) IT estimado informativo (3%)           Bs  22,50
= Utilidad neta del periodo                Bs   7,50
```

Regla:

> El IT se presenta como gasto informativo y pasivo informativo para que el balance cuadre sin haber contabilizado automáticamente el impuesto. Es un recurso formativo, no una declaración tributaria.

---

### Etapa 9: Balance General simplificado

Estructura presentada:

```text
ACTIVO
  Activo corriente
    Caja                                   Bs 5.318,00
    Bancos                                 Bs   ...
    Clientes                               Bs   ...
    Inventario                             Bs   ...
    IVA Crédito Fiscal                      Bs   ...
    Otras cuentas por cobrar               Bs   ...
    = Total activo corriente
  Activo no corriente
    Mobiliario y equipo                    Bs   ...
    (-) Depreciación acumulada             Bs   ...
    Intangibles                            Bs   ...
    = Total activo no corriente
  TOTAL ACTIVO

PASIVO
  Pasivo corriente
    Proveedores                            Bs   ...
    IVA Débito Fiscal                       Bs   ...
    Impuestos por pagar                    Bs   ...
    Sueldos por pagar                      Bs   ...
    Otros pasivos corrientes               Bs   ...
    (+) IT estimado informativo            Bs   ...
    = Total pasivo corriente
  Pasivo no corriente
    Préstamos a largo plazo                Bs   ...
    = Total pasivo

PATRIMONIO
  Capital                                  Bs   ...
  Resultados acumulados                    Bs   ...
  Resultado del periodo                    Bs   ...
  = Total patrimonio

TOTAL PASIVO + PATRIMONIO
```

Verificación obligatoria:

```text
Total activo = Total pasivo + Total patrimonio
```

Regla:

> Si la diferencia no es cero, el sistema marca el balance como descuadrado y genera alerta. El IT informativo se suma al pasivo corriente justamente para que el balance cierre sin contabilizar el impuesto como asiento.

---

### Etapa 10: Cierre contable

El cierre genera asientos tipo `cierre` que:

1. dejan en cero todas las cuentas temporales con movimiento;
2. trasladan el resultado a `3.1.03 Resultados del ejercicio`;
3. mueven el saldo de `3.1.03` hacia `3.1.02 Resultados acumulados`;
4. marcan el periodo como `cerrado`.

Ejemplo de cierre de una cuenta temporal deudora (gasto):

```text
Débito   3.1.03 Resultados del ejercicio    Bs 200,00
Crédito  6.1.01 Gastos de administración    Bs 200,00
```

Ejemplo de cierre de una cuenta temporal acreedora (venta):

```text
Débito   4.1.01 Ventas                      Bs 750,00
Crédito  3.1.03 Resultados del ejercicio    Bs 750,00
```

Traslado de utilidad al patrimonio:

```text
Débito   3.1.03 Resultados del ejercicio    Bs   7,50
Crédito  3.1.02 Resultados acumulados       Bs   7,50
```

Regla de EE.FF. vivos:

> Los Estados Financieros en pantalla excluyen los asientos de cierre, para que el usuario siga viendo ingresos, costos y gastos del periodo aunque el periodo ya esté cerrado. El snapshot guarda la evidencia del momento de emisión.

Regla de reapertura:

> Reabrir un periodo anula los asientos de cierre vigentes, devuelve el estado a `abierto`, limpia `closingEntryId` y `closedAt`, y registra la acción en bitácora.

---

### Etapa 11: Costos, indicadores y reporte

Métricas derivadas de la balanza ajustada:

- margen bruto;
- margen operativo;
- margen neto;
- margen de contribución;
- punto de equilibrio contable (gastos registrados);
- punto de equilibrio estimado (`costosFijosMensuales` del cliente);
- liquidez corriente;
- endeudamiento;
- ROE simplificado;
- rotación de inventario;
- rotación de cuentas por cobrar.

Fórmulas clave:

```text
margen bruto        = utilidad bruta / total ingresos
margen neto         = utilidad neta / total ingresos
margen contribución = (ingresos - costo variable) / ingresos
punto equilibrio    = costos fijos / margen de contribución
liquidez corriente  = activo corriente / pasivo corriente
endeudamiento       = total pasivo / total activo
ROE                 = utilidad neta / total patrimonio
```

Regla de honestidad:

> Si el margen de contribución es cero o negativo, el punto de equilibrio se marca como “No calculable”, en vez de inventar un valor.

Reporte mensual:

- resumen en lenguaje sencillo;
- tarjetas de ventas, costo, gasto y utilidad;
- tabla de ingresos y resultado;
- impuestos informativos;
- situación financiera;
- indicadores y punto de equilibrio;
- alertas pendientes;
- recomendaciones y próximo paso;
- aviso profesional.

---

## 4. Reglas contables transversales

| Regla | Descripción |
|---|---|
| Cuadratura | Todo asiento vigente debe cuadrar: Σ débitos = Σ créditos. |
| Trazabilidad | Nada se borra. Asientos y transacciones pasan a `anulado`/`anulada`. |
| Bloqueo de periodo | Periodo cerrado no admite nuevos documentos, transacciones ni asientos. |
| Derivación en vivo | Mayor, Balanza, EE.FF. e indicadores se calculan desde el Diario, no se persisten. |
| Separación de balanzas | Comprobación excluye ajustes y cierres; ajustada incluye ajustes y excluye cierres. |
| Cierre contra patrimonio | Temporales cierran contra 3.1.03; resultado traslada a 3.1.02. |
| Anti-duplicidad de depreciación | Un activo no se deprecia dos veces en el mismo periodo. |
| Snapshot como evidencia | Congela el cálculo al emitir; no altera los cálculos vivos. |
| Bitácora obligatoria | Toda acción relevante queda registrada para auditoría académica. |
| Respaldo JSON | Exporta/importa colecciones, settings y counters; valida estructura antes de importar. |

---

## 5. Relación con el proceso de servicio en ocho pasos

| Paso del servicio | Etapa del ciclo implementada | Módulo del prototipo |
|---|---|---|
| 1. Diagnóstico y contrato inicial | Apertura y catálogo | Clientes |
| 2. Recepción y digitalización de documentos | Registro documental | Documentos |
| 3. Clasificación y codificación contable | Clasificación por cuenta | Transacciones + Plan de cuentas |
| 4. Registro en el sistema digital | Libro Diario | Libro Diario |
| 5. Conciliación y validación | Mayor + Balanza + Alertas | Libro Mayor, Balanza, Alertas |
| 6. Cierre mensual y EE.FF. básicos | Balanza ajustada + EE.FF. + Cierre | Estados Financieros, Cierre |
| 7. Obligaciones tributarias y laborales | Impuestos informativos + Alertas | Impuestos, Alertas |
| 8. Entrega de reporte y capacitación | Costos, indicadores y reporte | Costos e Indicadores, Reportes, Ayuda |

---

## 6. Ejemplo integral de flujo con cifras semilla

Cliente: **Tienda Doña Rosa** · Régimen General · Periodo: Octubre 2026

```text
1. Documento: factura de venta FV-0001, Bs 750,00 base imponible.
2. Transacción: venta, efectivo, tercero “Cliente general”.
3. Asiento automático en Diario:
     Débito  1.1.01 Caja                 Bs 850,00
     Crédito 4.1.01 Ventas               Bs 750,00
     Crédito 2.1.02 IVA Débito Fiscal    Bs 100,00
4. Libro Mayor: caja sube, ventas acumula crédito, IVA DF acumula crédito.
5. Balanza de comprobación: movimientos cuadrados.
6. Ajuste: depreciación de freezer, Bs 120,00.
     Débito  6.1.04 Depreciación         Bs 120,00
     Crédito 1.2.02 Depreciación acum.   Bs 120,00
7. Balanza ajustada: incluye el ajuste, sigue cuadrada.
8. Estado de Resultados:
     Ventas Bs 750,00 - Costo Bs 400,00 = Utilidad bruta Bs 350,00
     - Gastos Bs 320,00 = Utilidad operativa Bs 30,00
     - IT informativo Bs 22,50 = Utilidad neta Bs 7,50
9. Balance General: Activo = Pasivo + Patrimonio, diferencia Bs 0,00.
10. Costos e indicadores: margen bruto 46,67%, punto de equilibrio calculable.
11. Alertas: documento pendiente, transacción sin asiento (si aplica), periodo sin cerrar.
12. Reporte mensual: resumen en lenguaje sencillo + recomendaciones.
13. Cierre: asientos tipo cierre, periodo marcado cerrado, snapshot guardado.
14. Respaldo: exportación JSON con todo el ciclo.
```

---

## 7. Límites del ciclo implementado

- Método de inventario: **periódico simplificado**, no perpetuo.
- No hay **Kardex por ítem** ni costo unitario por producto.
- No hay **costeo por centros de costo** avanzados.
- No hay **facturación electrónica** integrada al SIAT.
- No hay **integración bancaria** ni conciliación automática desde extracto.
- No se calculan **RC-IVA, IUE ni aportes laborales** reales; solo IVA e IT informativos.
- Los **Estados Financieros son simplificados y formativos**.
- Los **cálculos tributarios son preventivos**, no declaraciones.
- El sistema **no sustituye** la firma, certificación, auditoría ni representación de un Contador Público Autorizado cuando la normativa boliviana lo exija.

Estos límites se declaran de forma explícita en la ayuda, en la landing, en cada reporte y en esta documentación.

---

## 8. Valor académico del ciclo implementado

El ciclo demuestra que el prototipo no es un simple formulario de ventas.

Evidencia, de forma verificable:

- registro contable con doble entrada;
- clasificación por cuentas con naturaleza y temporalidad;
- derivación automática de Mayor y Balanza desde el Diario;
- reconocimiento de ajustes (depreciación, devengado, provisión, reclasificación, inventario);
- emisión de Estado de Resultados y Balance General con verificación de cuadratura;
- cierre de periodo con traslado de resultado al patrimonio;
- análisis de rentabilidad, liquidez, endeudamiento y punto de equilibrio;
- control preventivo mediante alertas;
- entrega comprensible mediante reporte en lenguaje sencillo;
- trazabilidad mediante bitácora y anulación sin borrado;
- recuperación mediante respaldo JSON;
- despliegue público verificable en GitHub Pages.

Con ello, el proyecto cumple y amplía lo prometido en el título: no solo control documental, alertas y reportes, sino un **modelo de gestión contable digital con ciclo contable simplificado completo**, adaptado a la microempresa comercial de Trinidad, Beni.
