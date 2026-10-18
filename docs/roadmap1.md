Perfecto, entonces **Cuentas Claras pasa a cubrir el ciclo contable completo**, porque tu proyecto es de Contabilidad y un tribunal va a esperar eso. Lo que ya construimos (Fases 0–4) **no se tira**: se convierte en la base de datos que alimenta la contabilidad formal.

Te dejo el **roadmap reorganizado y renumerado**, con las fases contables insertadas en el orden correcto, para que sepas exactamente qué viene y no retrocedas.

---

# 1. Principio de diseño (para no romper lo hecho)

Regla que fijamos ahora y ya no cambiamos:

> **Las transacciones (Fase 3) son el documento fuente. El Libro Diario (Fase 5) convierte cada transacción en asiento de doble entrada. El Libro Mayor y la Balanza (Fase 6) se DERIVAN del diario, no se guardan duplicados. Los Estados Financieros (Fase 8) se derivan de la balanza ajustada.**

Esto evita incoherencias: si editas una transacción o un asiento, mayor, balanza y EE.FF. se recalculan solos. No vas a tener que “arreglar” tablas separadas después.

Consecuencia práctica: **mayor, balanza, EE.FF. e indicadores son vistas calculadas**, no colecciones persistidas redundantes. Solo se guardan:

- asientos del diario (`cc_journal_entries`);
- líneas de asiento (`cc_journal_lines`);
- ajustes marcados como tales;
- snapshots opcionales de cierre/reportes.

---

# 2. Ciclo contable completo que vamos a cubrir

Este es el alcance académico que queda dentro del proyecto:

1. Apertura y catálogo de cuentas (con naturaleza y tipo).
2. Registro de operaciones / documentos fuente.
3. **Libro Diario** (doble entrada automática + asiento manual).
4. **Pase al Libro Mayor** (movimientos y saldos por cuenta).
5. **Balanza de comprobación** (cuadratura débitos = créditos).
6. **Ajustes contables** (depreciación, amortización, devengados, provisiones, reclasificaciones).
7. **Balanza ajustada**.
8. **Estados Financieros**:
   - Estado de Resultados;
   - Balance General / Estado de Situación Financiera;
   - asientos de cierre del periodo.
9. **Costos y rentabilidad** (costo de ventas, margen bruto, punto de equilibrio, utilidad).
10. **Indicadores financieros** (liquidez, endeudamiento, rentabilidad).
11. Reporte mensual en lenguaje sencillo (capa educativa).
12. Alertas tributarias y operativas (capa preventiva).

Eso ya no es “un registro de ventas con alertas”. Es **contabilidad formal simplificada para microempresa**, con tecnología de apoyo. Que es justo lo que tu título pide.

---

# 3. Roadmap renumerado completo

Marcas: ✅ = ya hecho · 🟡 = pendiente · ⭐ = fase contable nueva

| Fase | Nombre | Estado |
|---|---|:--:|
| 0 | Preparación del repositorio | ✅ |
| 1 | Núcleo técnico y shell visual | ✅ |
| 2 | Clientes y periodos | ✅ |
| 3 | Documentos y transacciones | ✅ |
| 4 | Impuestos informativos | ✅ |
| **5** | **Catálogo de cuentas + Libro Diario** | ⭐ 🟡 |
| **6** | **Libro Mayor + Balanza de comprobación** | ⭐  |
| **7** | **Ajustes contables + Balanza ajustada** | ⭐  |
| **8** | **Estados Financieros + cierre del periodo** | ⭐  |
| **9** | **Costos, rentabilidad e indicadores** | ⭐ 🟡 |
| 10 | Alertas tributarias y operativas | 🟡 |
| 11 | Reporte mensual en lenguaje sencillo | 🟡 |
| 12 | Respaldo, importación/exportación, bitácora | 🟡 |
| 13 | Ayuda, manual y límites legales | 🟡 |
| 14 | Responsive y pulido visual | 🟡 |
| 15 | Despliegue en GitHub Pages | 🟡 |
| 16 | Validación con clientes piloto | 🟡 |

Las fases 10–16 son las que ya teníamos planeadas, solo corren después del núcleo contable. Así el proyecto cierra con contabilidad dura primero y capa de gestión/educación después, que es el orden lógico de un ciclo contable.

---

# 4. Detalle de las fases contables nuevas (5 a 9)

## Fase 5 — Catálogo de cuentas + Libro Diario

**Objetivo:** tener plan de cuentas formal y convertir operaciones en asientos de doble entrada.

**Qué construye:**
- Amplía el catálogo de `config.js` con: código jerárquico, nombre, tipo (activo/pasivo/patrimonio/ingreso/costo/gasto) y naturaleza (deudora/acreedora).
- Genera **asientos automáticos** desde transacciones activas del periodo, con reglas de doble entrada por tipo (venta, compra, gasto, ingreso).
- Permite **asiento manual** (para hechos económicos no capturados como transacción: apertura de saldos, correcciones, operaciones especiales).
- Vista de Libro Diario por cliente/periodo, con folio, fecha, cuenta, débito, crédito, referencia y estado.
- Anulación de asiento (no borrado físico), con trazabilidad.

**Depende de:** Fase 3 (transacciones) y Fase 2 (periodos).

**Entregable:** un periodo con sus asientos registrados y visibles.

**Criterio para avanzar:** todo asiento cuadra (Σ débitos = Σ créditos por asiento); no se puede editar un asiento de periodo cerrado; el asiento manual valida cuentas existentes.

---

## Fase 6 — Libro Mayor + Balanza de comprobación

**Objetivo:** clasificar movimientos por cuenta y verificar cuadratura general.

**Qué construye:**
- **Libro Mayor** derivado del diario: por cuenta muestra saldo inicial, movimientos, saldo deudor/acreedor y ficha de cuenta (detalle de asientos que la componen).
- **Balanza de comprobación**: lista de cuentas con débitos, créditos y saldos; total de débitos = total de créditos; advertencia si descuadra.
- Filtros por cliente, periodo y rango de cuentas.
- Impresión de mayor y balanza.

**Depende de:** Fase 5.

**Entregable:** mayor y balanza coherentes con el diario.

**Criterio para avanzar:** la balanza cuadra siempre; el mayor concuerda con el saldo de cada cuenta; cambiar un asiento refleja en mayor y balanza sin regenerar nada a mano.

---

## Fase 7 — Ajustes contables + Balanza ajustada

**Objetivo:** aplicar el cierre parcial técnico antes de EE.FF.

**Qué construye:**
- Asientos de **ajuste** con categoría: depreciación, amortización, provisión, devengado (sueldos/servicios por pagar), reclasificación, otros.
- Los ajustes entran al diario con flag `tipo_asiento: ajuste` y no se confunden con operaciones.
- **Balanza ajustada** = balanza de comprobación + ajustes del periodo.
- Plantillas rápidas de ajuste frecuentes para microempresa (depreciación lineal simple, devengados).

**Depende de:** Fase 6.

**Entregable:** balanza ajustada lista para EE.FF.

**Criterio para avanzar:** ajustes no alteran la cuadratura; se pueden revertir/anular con trazabilidad; la balanza ajustada se recalcula sola.

---

## Fase 8 — Estados Financieros + cierre del periodo

**Objetivo:** emitir EE.RR. y Balance, y cerrar contablemente el periodo.

**Qué construye:**
- **Estado de Resultados** simplificado: ventas, costo de ventas, utilidad bruta, gastos operativos, utilidad operativa, impuestos estimados, utilidad neta del periodo.
- **Balance General / Estado de Situación Financiera** simplificado: activo = pasivo + patrimonio, con cuentas corrientes/no corrientes básicas.
- **Asientos de cierre**: lleva ingresos, costos y gastos a “Resultados del ejercicio” y luego a “Resultados acumulados”; cierra cuentas temporales.
- Integración con el estado `cerrado` de periodos (Fase 2): al generar cierre, el periodo queda cerrado contablemente y se bloquea edición.
- Impresión/PDF de ambos estados con encabezado, periodo y disclaimer profesional.

**Depende de:** Fase 7.

**Entregable:** EE.RR. + Balance + cierre del periodo.

**Criterio para avanzar:** Activo = Pasivo + Patrimonio; la utilidad del EE.RR. coincide con el cambio en patrimonio; el cierre no descuadra la balanza; periodo cerrado no admite nuevos asientos salvo reapertura con bitácora.

---

## Fase 9 — Costos, rentabilidad e indicadores

**Objetivo:** dar lectura gerencial al resultado (el “poquito más” de contabilidad).

**Qué construye:**
- **Costo de ventas** del periodo (desde cuentas de costo) y **margen bruto**.
- **Punto de equilibrio** usando costos fijos registrados por cliente (campo nuevo opcional en cliente) y margen de contribución.
- **Rentabilidad** = utilidad neta / ventas.
- **Indicadores** a partir de balance y EE.RR.: liquidez corriente, endeudamiento (pasivo/activo), rotación si aplica, margen neto.
- Tarjetas y tabla de indicadores por cliente/periodo, en lenguaje sencillo.

**Depende de:** Fase 8.

**Entregable:** panel de costos e indicadores imprimible.

**Criterio para avanzar:** indicadores se calculan solos desde EE.FF.; si faltan datos, muestra “no calculable” en vez de inventar; no rompe lo anterior.

> Nota de alcance: para microempresa comercial, costos se maneja **agregado por cuenta** (costo de ventas vs ventas), no por ítem. Si mañana quieres costo por producto, se agrega un módulo de ítems, pero **no es necesario** para el ciclo contable completo ni para tu título. Lo dejo liviano a propósito para no inflar el MVP.

---

# 5. Fases restantes (10–16), ahora después del núcleo contable

| Fase | Qué aporta | Conexión con lo contable |
|---|---|---|
| 10 Alertas | vencimientos, documentos pendientes, periodos sin cerrar, transacciones sin asiento | usa obligaciones (F4) y asientos (F5) |
| 11 Reporte mensual | resumen en lenguaje sencillo para el comerciante | consume EE.RR. simplificado (F8) + impuestos (F4) |
| 12 Respaldo | exportar/importar JSON, reset, bitácora | incluye nuevas colecciones de diario/ajustes |
| 13 Ayuda | manual, límites legales, disclaimer CPA | menciona ciclo contable y límites |
| 14 Responsive | móvil y pulido | aplica a todas las pantallas nuevas |
| 15 GitHub Pages | despliegue público | rutas relativas ya definidas |
| 16 Piloto | 3 microempresas reales, evidencia | valida el ciclo completo end-to-end |

---

# 6. Cómo se conecta con lo ya hecho (tranquilidad de no retroceder)

Mapeo directo, sin rehacer pantallas:

- `cc_transactions` (Fase 3) → alimenta generación automática de `cc_journal_entries` (Fase 5).
- `accountCatalog` (config.js) → se **amplía** en Fase 5 con naturaleza/tipo/código; los valores actuales siguen siendo válidos como subconjunto.
- `cc_taxes` y `cc_obligations` (Fase 4) → entran al EE.RR. como impuestos y generan alertas (Fase 10).
- `cc_periods.estado = cerrado` (Fase 2) → se respeta en Fase 8: cierre contable bloquea edición; reapertura queda en bitácora.
- `cc_documents` (Fase 3) → sigue siendo el respaldo documental del asiento (referencia en línea de diario).

Es decir: **todo lo que ya funciona sigue funcionando**, solo se le suma la capa contable encima.

---

# 7. Orden de archivos por fase nueva (resumen, sin código aún)

Para que veas el tamaño real y no te pierdas:

**Fase 5**
```text
js/config.js            (amplía accountCatalog, agrega reglas de asiento)
js/modules/contabilidad.js   (motor: transaccion -> asiento, validación de cuadratura)
libro-diario.html
js/modules/libro-diario.js
```

**Fase 6**
```text
libro-mayor.html
js/modules/libro-mayor.js
balanza.html
js/modules/balanza.js
```

**Fase 7**
```text
ajustes.html
js/modules/ajustes.js
js/modules/balanza.js   (extiende a balanza ajustada, sin borrar lo de F6)
```

**Fase 8**
```text
estados-financieros.html
js/modules/estados-financieros.js
js/modules/cierre.js
css/print.css           (estilos EE.RR. y Balance)
```

**Fase 9**
```text
costos-indicadores.html
js/modules/costos.js
js/modules/indicadores.js
```

Cada fase te la paso **completa, archivo por archivo, sin fragmentos**, igual que venimos haciendo, y con su checklist de prueba.

---

# 8. Decisiones de alcance que fijo ahora (para no cambiar de opinión a mitad)

1. Estados financieros **simplificados para microempresa**, no NIIF completas ni auditoría.
2. Se mantiene el **disclaimer de Contador Público Autorizado** en EE.FF., reportes y ayuda.
3. Costos **agregado por cuenta**, no por ítem (ampliable después).
4. Mayor, balanza y EE.FF. son **vistas derivadas del diario**, no colecciones duplicadas.
5. Cierre contable se integra con el estado `cerrado` de periodos ya existente.
6. Asiento manual **sí**, pero simple y validado.
7. Indicadores **sí**, pero solo los calculables desde balance y EE.RR. sin datos extra.

Si más adelante quieres ítems, flujo de efectivo o cambios en patrimonio, van como **proyección** en el documento, no como fase obligatoria del MVP.

---

# 9. Siguiente paso

El roadmap ya está cerrado y ordenado. Ahora solo falta ejecutar.

Dime una de estas:

```text
A) Arranca Fase 5 (Catálogo de cuentas + Libro Diario), pásame los archivos completos.
B) Antes de Fase 5, actualiza el README y el contrato de datos con las nuevas fases 5–9.
C) Ajusta algo del alcance de las fases nuevas antes de empezar.
```

Mi recomendación: **B primero y luego A**, porque si actualizamos `README.md` y `docs/contrato-datos.md` con las colecciones nuevas (`cc_journal_entries`, `cc_journal_lines`, ajustes, snapshots de cierre), evitamos tocar el contrato a mitad de Fase 5 y así mantenemos la regla de “no volver atrás”.

Responde **B** o **A** (o **B y A** si quieres que haga las dos en orden) y seguimos.