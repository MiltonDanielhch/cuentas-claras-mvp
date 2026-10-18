# Manual de defensa – Cuentas Claras

## 1. Objetivo del manual

Este documento prepara a los participantes para sustentar el proyecto ante el tribunal.

No es un resumen genérico. Es una guía práctica de:

- qué decir;
- en qué orden;
- quién dice qué;
- qué mostrar en pantalla;
- qué responder ante preguntas probables;
- qué evidencias tener listas;
- qué errores evitar.

> El documento escrito ya fue actualizado para alinearse con el prototipo. Por tanto, en la defensa no hay contradicción entre lo que dice el texto y lo que hace el sistema: el texto describe el ciclo contable completo, la arquitectura estática, los límites profesionales y el despliegue público que el prototipo realmente implementa.

---

## 2. Datos oficiales

**Proyecto:**
Diseño e implementación de un modelo de gestión contable digital para microempresas comerciales de Trinidad, Beni, apoyado en un sistema computarizado de control documental, alertas tributarias y reportes mensuales.

**Emprendimiento:**
Cuentas Claras – Gestión Contable Digital

**Eslogan:**
Contabilidad simple, decisiones claras.

**Participantes:**
- Lizi Francia Mansilla Vaca
- Milton Daniel Hipamo Cholima

**Tutora:**
Lic. Sarita Ignacia

**Facilitador:**
Lic. Edgar Aquilino

**Director C.E.A. Santísima Trinidad:**
Lic. Miguel Valencia Mazi

**Centro:**
C.E.A. Santísima Trinidad

**Carrera:**
Técnico Medio en Contabilidad

**Lugar y año:**
Trinidad, Beni, Bolivia – 2026

---

## 3. Mensaje central (frase ancla)

> Cuentas Claras es un modelo de gestión contable digital que organiza documentos, registra operaciones, genera contabilidad simplificada, previene incumplimientos y entrega reportes comprensibles para el microempresario.

Frase de cierre:

> No sustituimos al contador; acercamos la contabilidad al comerciante.

Ambas frases deben memorizarse. Responden, en una línea, a la pregunta implícita del tribunal: “¿de qué va esto y por qué importa?”.

---

## 4. Distribución de roles sugerida

Con dos participantes, conviene repartir para que ninguno hable de más ni de menos.

| Bloque | Responsable | Por qué |
|---|---|---|
| Saludo, problema, objetivo, innovación | Lizi | Abre con el contexto humano y local |
| Población, mapa de empatía, mercado | Milton | Conecta con el comerciante y la viabilidad |
| Proceso en ocho pasos y ciclo contable | Lizi | Núcleo contable, su fuerte |
| Demostración técnica en vivo | Milton | Manejo del sistema y despliegue |
| Costos, punto de equilibrio, viabilidad | Lizi | Cifras y decisión financiera |
| Límites profesionales y éticos | Milton | Cierre responsable |
| Conclusiones y agradecimiento | Ambos | Alternan una idea cada uno |

Regla de oro: quien no tiene la palabra asiente, toma nota y no interrumpe. Si el tribunal pregunta algo técnico mientras habla el otro, se responde con calma sin pisar al compañero.

---

## 5. Estructura sugerida de defensa (15 minutos)

| Minuto | Bloque | Responsable |
|---|---|---|
| 0–2 | Saludo, problema y objetivo | Lizi |
| 2–4 | Innovación y población beneficiaria | Milton |
| 4–7 | Modelo en ocho pasos y ciclo contable | Lizi |
| 7–10 | Demostración técnica del prototipo | Milton |
| 10–12 | Resultados, costos y viabilidad | Lizi |
| 12–13 | Límites profesionales y éticos | Milton |
| 13–15 | Conclusiones y agradecimiento | Ambos |

Si el tiempo es 20 minutos, se amplía la demo y las respuestas. Si es 10 minutos, se recorta mercado y se va directo a ciclo contable + demo + límites.

---

## 6. Guion breve de apertura (memorizar inicio)

Buenos días/tardes. Somos Lizi Francia Mansilla Vaca y Milton Daniel Hipamo Cholima, participantes de la especialidad de Contabilidad del C.E.A. Santísima Trinidad.

Nuestro proyecto se llama Cuentas Claras y propone un modelo de gestión contable digital para microempresas comerciales de Trinidad, Beni.

Durante el diagnóstico observamos que muchos comerciantes llevan sus cuentas en cuadernos, pierden documentos, desconocen plazos tributarios y no saben con claridad si están ganando o perdiendo.

Por eso diseñamos un sistema que no solo registra, sino que ordena, previene y explica.

---

## 7. Demostración recomendada (paso a paso)

Tener abierta, antes de empezar, la URL pública en una pestaña y el proyecto local en otra por si falla internet.

### Paso 1 – Landing pública

URL:

```text
https://usuario.github.io/repositorio/
```

Mostrar: problema, flujo, ciclo contable, módulos, credenciales demo, aviso profesional.

Discurso:

> La portada resume el modelo: del papel suelto a cuentas claras, con un ciclo contable completo y no solo un registro de ventas.

### Paso 2 – Login

Usuario:

```text
admin
```

Contraseña:

```text
Admin123
```

Discurso:

> El prototipo usa autenticación demostrativa porque es un sistema académico estático. En producción se migraría a backend con roles reales.

### Paso 3 – Dashboard

Mostrar alertas recientes si ya fueron generadas.

Discurso:

> El panel concentra la situación del cliente y las alertas preventivas, que es lo que el comerciante necesita ver primero.

### Paso 4 – Libro Diario

Seleccionar cliente y periodo. Pulsar:

```text
Generar asientos automáticos
```

Mostrar un asiento cuadrado con débito y crédito.

Discurso:

> Aquí está el corazón contable: la transacción se convierte en asiento de doble entrada y el sistema valida que cuadre.

### Paso 5 – Libro Mayor

Abrir ficha de una cuenta y mostrar saldo corrido.

Discurso:

> El Mayor no se guarda aparte; se calcula desde el Diario. Eso garantiza que siempre refleje los asientos vigentes.

### Paso 6 – Balanza

Mostrar comprobación y ajustada con indicadores verdes.

Discurso:

> La balanza verifica que débitos y créditos cuadren antes y después de ajustes. Si descuadra, el sistema genera alerta.

### Paso 7 – Ajustes

Depreciar un activo o registrar ajuste rápido.

Discurso:

> Los ajustes permiten reconocer depreciación, devengados y otros efectos antes de emitir estados financieros, con control de no duplicar el mismo activo en el periodo.

### Paso 8 – Estados Financieros

Mostrar Estado de Resultados, Balance General y verificación Activo = Pasivo + Patrimonio.

Discurso:

> El sistema traduce la contabilidad en información útil para decidir, y comprueba que el balance cuadre.

### Paso 9 – Costos e indicadores

Mostrar margen bruto, utilidad neta, punto de equilibrio, liquidez y endeudamiento.

Discurso:

> No basta con registrar ventas. El microempresario necesita saber si gana, cuánto debe vender para no perder y si puede pagar sus deudas.

### Paso 10 – Alertas

Generar alertas y mostrar tipos.

Discurso:

> Las alertas convierten el sistema en una herramienta preventiva, no solo registral: avisa vencimientos, documentos pendientes y descuadres.

### Paso 11 – Reporte mensual

Generar reporte y mostrar lenguaje sencillo.

Discurso:

> El reporte es el puente entre la contabilidad técnica y el entendimiento del comerciante. Explica en palabras simples qué significan los números.

### Paso 12 – Respaldo, documentación y verificación

Mostrar exportar JSON, bitácora, `documentacion.html` y `prueba-despliegue.html` en verde.

Discurso:

> Todo prototipo académico debe ser verificable. Por eso incluimos respaldo, bitácora, documentación técnica y una página de diagnóstico que confirma que el despliegue carga correctamente sus componentes.

---

## 8. Respuestas clave para preguntas probables

### ¿El sistema declara impuestos ante el SIN?

No. Calcula IVA e IT de forma informativa y preventiva. No constituye declaración automática ante el Servicio de Impuestos Nacionales.

### ¿Sustituye a un Contador Público Autorizado?

No. Es una herramienta de apoyo contable, documental, educativo y preventivo. La actuación profesional formal —firma, certificación, auditoría, dictamen, representación— corresponde al CPA cuando la normativa lo exija.

### ¿Por qué usa LocalStorage y no una base de datos?

Porque el prototipo académico es estático, verificable y desplegable gratuitamente. LocalStorage permite demostrar el modelo sin backend. Para producción se migraría a base de datos relacional con servidor seguro, como se declara en la proyección técnica.

### ¿Cómo evita errores contables?

Validando que los asientos cuadren, derivando Mayor y Balanza desde el Diario, bloqueando periodos cerrados, anulando con trazabilidad sin borrar, y generando alertas de descuadre, documento pendiente o transacción sin asiento.

### ¿Qué método de inventario usa?

Método periódico simplificado, adecuado para microempresa comercial y para el alcance académico. El Kardex por ítem y el costo unitario por producto se declaran como proyección.

### ¿Cómo se calcula la depreciación?

Con método lineal simple: (costo − valor residual) / vida útil en meses. Y evita depreciar dos veces el mismo activo en el mismo periodo.

### El título habla de control documental, alertas y reportes. ¿Por qué el sistema hace más?

Porque durante la implementación el prototipo evolucionó y amplió lo prometido: además del control documental, las alertas y los reportes, implementa el ciclo contable simplificado completo (Diario, Mayor, Balanza, ajustes, EE.FF., cierre, costos e indicadores). El documento fue actualizado para reflejar esa ampliación, manteniendo el enfoque educativo y accesible.

### Los costos del documento, ¿son el costo de programar el sistema?

No. La inversión y los costos presentados corresponden al modelo de servicio contable digital (puesta en marcha comercial). El prototipo académico fue construido con recursos propios y herramientas gratuitas, por lo que su desarrollo no requirió esa inversión completa.

### ¿Qué evidencia técnica tiene el proyecto?

Repositorio en GitHub, despliegue en GitHub Pages, workflow de GitHub Actions en verde, página de verificación técnica, documentación en Markdown, respaldos JSON, bitácora, capturas y video de respaldo.

### ¿Funciona en celular?

Sí, la interfaz es responsive. Pero los datos se guardan solo en el navegador actual; para trasladar información entre equipos se exporta e importa un respaldo JSON.

### ¿Qué pasa si se borran los datos del navegador?

Se pierde la información local, por eso el sistema insiste en exportar respaldos periódicos. Es un límite declarado del prototipo estático, no un defecto oculto.

---

## 9. Errores a evitar en la defensa

- No prometer lo que el sistema no hace (declaración ante SIN, firma CPA, kardex, app móvil, nube).
- No decir que es un software comercial o productivo.
- No confundir LocalStorage con base de datos servida.
- No afirmar que los EE.FF. son certificados; son simplificados y formativos.
- No hablar todos al mismo tiempo ni interrumpir al compañero.
- No leer diapositivas; mirar al tribunal y usar la demo como apoyo.
- No esconder los límites: declararlos demuestra madurez profesional y fortalece el proyecto.
- No improvisar cifras: si no se sabe un dato exacto, remitirse al documento o a la pantalla.

---

## 10. Plan B si falla internet o la demo

Tener listo, antes de entrar:

1. carpeta local del proyecto abierta con Live Server;
2. capturas de pantalla de cada módulo;
3. video corto de demostración (4–6 min);
4. PDF o impresión de `documentacion.html`;
5. respaldo JSON exportado;
6. `prueba-despliegue.html` abierta en local.

Frase de contingencia:

> Si la conexión falla, contamos con evidencia local grabada y respaldos del prototipo, y podemos continuar la demostración desde el equipo local.

---

## 11. Cierre sugerido (memorizar final)

Agradecemos al C.E.A. Santísima Trinidad, a nuestra tutora, a nuestro facilitador y al tribunal por su tiempo.

Cuentas Claras demuestra que la contabilidad puede ser más simple, preventiva y comprensible cuando la tecnología se pone al servicio del microempresario.

No buscamos reemplazar al profesional contable. Buscamos ordenar la información, reducir riesgos y educar al comerciante para que tome mejores decisiones.

Contabilidad simple, decisiones claras.

Muchas gracias.

---

## 12. Checklist de preparación (marcar antes de presentar)

- [ ] Documento Word actualizado y alineado con el prototipo.
- [ ] Repositorio público y URL probada en celular.
- [ ] GitHub Actions en verde.
- [ ] `prueba-despliegue.html` en verde.
- [ ] Datos semilla cargados y asientos generados para la demo.
- [ ] Capturas de todos los módulos organizadas.
- [ ] Video de respaldo grabado.
- [ ] Respaldo JSON exportado.
- [ ] Documentación impresa o abierta.
- [ ] Guion ensayado con distribución de roles.
- [ ] Preguntas del tribunal revisadas.
- [ ] Plan B local listo.
- [ ] Frases ancla memorizadas (inicio, mensaje central, cierre).