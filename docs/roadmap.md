Perfecto. Vamos a dejarlo **muy ordenado** para que el desarrollo sea lineal, sin parches, sin volver atrás y sin archivos a medias.

## Regla de trabajo que voy a usar contigo

Cuando te pase código:

1. **Te pasaré archivos completos**, no fragmentos.
2. Cada archivo tendrá **una responsabilidad clara**.
3. Primero definimos **contratos**: nombres, rutas, claves de LocalStorage, IDs, estados y funciones.
4. Cuando avancemos de fase, **no deberíamos volver a modificar archivos base**, salvo corregir un bug real.
5. Te daré siempre:
   - archivo completo,
   - para qué sirve,
   - qué depende de qué,
   - cómo probarlo.

---

# 1. Stack final confirmado

Para tu MVP académico funcional:

```text
HTML5
CSS3
JavaScript vanilla
Bootstrap 5 por CDN
LocalStorage
GitHub Pages
```

Sin React, sin Vue, sin Node, sin backend.

Esto es ideal porque:

- se despliega fácil en GitHub Pages,
- es ligero,
- se entiende en defensa,
- no depende de servidor,
- permite demostrar el modelo contable digital,
- y puedes mostrar interfaz, datos, reportes, alertas y respaldo.

---

# 2. Limitación importante que debes declarar

Como usaremos **LocalStorage**, los datos se guardan **en el navegador del dispositivo**.

Eso significa:

- no se sincronizan entre celulares/computadoras,
- si borras datos del navegador, se pierden,
- no es un sistema productivo en la nube,
- sirve como prototipo funcional y validación del modelo.

Para mitigarlo, el sistema tendrá:

```text
Exportar respaldo JSON
Importar respaldo JSON
Cargar datos demo
Restablecer sistema
Bitácora básica
```

En defensa puedes decir:

> “LocalStorage se usa como mecanismo de persistencia para un prototipo de validación. Para producción se migraría a base de datos, backend y respaldos en la nube.”

---

# 3. Convenciones generales del proyecto

Estas convenciones hay que fijarlas desde el inicio para no regresar después.

## 3.1. Nombre del proyecto

```text
cuentas-claras-mvp
```

## 3.2. Prefijo de LocalStorage

Todas las claves tendrán prefijo:

```text
cc_
```

Ejemplos:

```text
cc_session
cc_users
cc_clients
cc_periods
cc_documents
cc_transactions
cc_taxes
cc_obligations
cc_alerts
cc_reports
cc_logs
cc_settings
cc_counters
```

## 3.3. IDs

Usaremos IDs legibles con prefijo y correlativo.

Ejemplos:

```text
USR-0001
CLI-0001
PER-0001
DOC-0001
TRX-0001
IMP-0001
OBL-0001
ALR-0001
REP-0001
LOG-0001
```

El contador se guardará en:

```text
cc_counters
```

Ejemplo:

```json
{
  "CLI": 3,
  "PER": 5,
  "DOC": 12
}
```

## 3.4. Fechas

Todas las fechas se guardan en formato ISO:

```text
YYYY-MM-DD
```

Ejemplo:

```text
2026-10-31
```

## 3.5. Montos

Los montos se guardan como número:

```json
{
  "monto": 250.5
}
```

Para mostrarlos, se formatean como:

```text
Bs 250.50
```

## 3.6. Estados de periodo

```text
abierto
en_revision
cerrado
```

## 3.7. Estados de documento

```text
pendiente
recibido
validado
rechazado
```

## 3.8. Estados de transacción

```text
activa
anulada
```

No eliminamos transacciones contables de forma física. Se anulan.

## 3.9. Estados de alerta

```text
pendiente
vista
resuelta
vencida
```

## 3.10. Roles

Para MVP:

```text
admin
contador
consulta
```

Pero inicialmente bastará con:

```text
admin
contador
```

## 3.11. Rutas relativas

Muy importante para GitHub Pages.

No uses rutas absolutas como:

```html
<link href="/css/styles.css">
```

Usa siempre relativas:

```html
<link href="./css/styles.css" rel="stylesheet">
```

Esto evita problemas cuando el proyecto se publica en:

```text
https://usuario.github.io/cuentas-claras-mvp/
```

---

# 4. Estructura completa del proyecto

Esta es la estructura recomendada.

```text
cuentas-claras-mvp/
│
├── index.html
├── dashboard.html
├── clientes.html
├── periodos.html
├── documentos.html
├── transacciones.html
├── impuestos.html
├── alertas.html
├── reportes.html
├── respaldo.html
├── ayuda.html
├── 404.html
│
├── css/
│   ├── styles.css
│   └── print.css
│
├── js/
│   ├── config.js
│   ├── utils.js
│   ├── storage.js
│   ├── auth.js
│   ├── layout.js
│   ├── app.js
│   │
│   ├── data/
│   │   └── seed.js
│   │
│   └── modules/
│       ├── clientes.js
│       ├── periodos.js
│       ├── documentos.js
│       ├── transacciones.js
│       ├── impuestos.js
│       ├── alertas.js
│       ├── reportes.js
│       ├── respaldo.js
│       └── bitacora.js
│
├── assets/
│   ├── logo.png
│   └── favicon.ico
│
├── docs/
│   ├── contrato-datos.md
│   ├── manual-usuario.md
│   ├── pruebas.md
│   └── capturas/
│
├── .gitignore
└── README.md
```

---

# 5. Responsabilidad de cada archivo

Esto es clave para no volver atrás.

## Raíz

### `index.html`

Página de login.

Debe contener:

- formulario usuario/contraseña,
- botón ingresar,
- botón cargar demo,
- enlace ayuda,
- mensajes de error.

No debe contener lógica de negocio.

---

### `dashboard.html`

Panel principal.

Debe mostrar:

- clientes activos,
- periodos abiertos,
- documentos pendientes,
- alertas tributarias,
- ventas del mes,
- gastos del mes,
- impuestos estimados,
- accesos rápidos.

---

### `clientes.html`

Módulo de clientes.

Funciones:

- listar clientes,
- crear cliente,
- editar cliente,
- desactivar cliente,
- ver ficha,
- buscar por nombre/NIT/teléfono.

---

### `periodos.html`

Módulo de periodos contables.

Funciones:

- abrir periodo para un cliente,
- listar periodos,
- cambiar estado,
- cerrar periodo,
- reabrir periodo con bitácora,
- validar antes de cerrar.

---

### `documentos.html`

Módulo de control documental.

Funciones:

- registrar documento,
- vincular documento a cliente y periodo,
- clasificar tipo de documento,
- marcar estado,
- listar pendientes,
- opcional: adjuntar imagen pequeña.

Para MVP simple, primero guardaremos metadatos. La imagen puede ser opcional y limitada.

---

### `transacciones.html`

Módulo de registro contable.

Funciones:

- registrar compra,
- registrar venta,
- registrar gasto,
- registrar ingreso,
- vincular a documento opcional,
- anular transacción,
- listar por cliente/periodo/tipo.

---

### `impuestos.html`

Módulo tributario.

Funciones:

- calcular IVA débito,
- calcular IVA crédito,
- calcular IVA por pagar,
- calcular IT,
- calcular RC-IVA si aplica,
- mostrar resumen por cliente/periodo,
- generar obligaciones tributarias.

Importante: esto es cálculo informativo, no declaración oficial ante SIN.

---

### `alertas.html`

Módulo de alertas.

Funciones:

- listar alertas pendientes,
- alertas por vencimiento,
- alertas por documentos faltantes,
- alertas por periodos sin cerrar,
- marcar como vista,
- copiar mensaje para WhatsApp,
- abrir WhatsApp con mensaje prellenado.

---

### `reportes.html`

Módulo de reporte mensual.

Funciones:

- seleccionar cliente,
- seleccionar periodo,
- generar vista previa,
- imprimir/guardar PDF,
- mostrar lenguaje sencillo,
- incluir recomendaciones.

---

### `respaldo.html`

Módulo de respaldo y mantenimiento.

Funciones:

- exportar todos los datos JSON,
- importar datos JSON,
- cargar datos semilla,
- restablecer sistema,
- ver bitácora,
- limpiar alertas vistas.

---

### `ayuda.html`

Manual breve.

Debe explicar:

- cómo ingresar,
- cómo crear cliente,
- cómo abrir periodo,
- cómo registrar documento,
- cómo registrar transacción,
- cómo generar reporte,
- cómo exportar respaldo,
- límites del prototipo.

---

### `404.html`

Página de error para GitHub Pages.

---

## CSS

### `css/styles.css`

Estilos generales del sistema.

Debe controlar:

- sidebar,
- topbar,
- tarjetas,
- tablas,
- formularios,
- badges,
- alertas visuales,
- modo móvil,
- colores institucionales.

### `css/print.css`

Estilos para imprimir reporte.

Debe ocultar:

- menú,
- botones,
- sidebar,
- elementos innecesarios.

Y mostrar limpio:

- encabezado,
- datos del cliente,
- resumen,
- tabla,
- recomendaciones,
- pie de reporte.

---

## JS base

### `js/config.js`

Configuración global.

Debe contener:

```text
APP_NAME
APP_VERSION
STORAGE_PREFIX
SESSION_KEY
ROUTES
MENU
ROLES
TAX_RATES
REGIMENS
DOCUMENT_TYPES
TRANSACTION_TYPES
PERIOD_STATES
ALERT_LEVELS
DAYS_BEFORE_ALERT
DEFAULT_DUE_DAY
AUTO_SEED
DEMO_CREDENTIALS
```

Este archivo evita “strings mágicos” repartidos por todo el proyecto.

---

### `js/utils.js`

Utilidades generales.

Debe tener funciones como:

```text
formatMoney()
formatDate()
parseDateISO()
todayISO()
daysUntil()
generateId()
getById()
filterBy()
sortBy()
showToast()
confirmDialog()
escapeHTML()
downloadJSON()
readFileAsText()
copyToClipboard()
buildWhatsAppUrl()
setQueryParam()
getQueryParam()
```

No debe contener lógica de negocio.

---

### `js/storage.js`

Acceso a LocalStorage.

Debe exponer una API simple:

```text
getCollection(key)
setCollection(key, data)
getItem(key, id)
createItem(key, item)
updateItem(key, id, updates)
softDeleteItem(key, id)
hardDeleteItem(key, id)
exportAll()
importAll(json)
resetAll()
log(action, details)
```

También debe manejar:

- claves con prefijo `cc_`,
- validación JSON,
- errores de cuota,
- versión de respaldo.

Este archivo es el corazón de persistencia.

---

### `js/data/seed.js`

Datos semilla.

Debe contener un objeto JSON-compatible con:

- usuarios,
- clientes,
- periodos,
- documentos,
- transacciones,
- impuestos/obligaciones,
- alertas,
- configuración inicial.

Lo tendremos como archivo JS en vez de fetch JSON para evitar problemas al abrir localmente.

Ejemplo de contenido semilla mínimo:

```text
3 clientes
3 periodos octubre 2026
15 documentos
25 transacciones
cálculos base
5 alertas
2 usuarios
```

---

### `js/auth.js`

Autenticación simulada.

Funciones:

```text
login(username, password)
logout()
getSession()
isAuthenticated()
requireAuth()
hasRole(role)
hashPassword(password)
verifyPassword(password, hash)
```

Para MVP, las contraseñas se pueden guardar hasheadas con Web Crypto.

No es seguridad real de servidor, pero demuestra buena práctica.

---

### `js/layout.js`

Renderiza interfaz común.

Debe generar:

- sidebar,
- topbar,
- menú activo,
- nombre del usuario,
- botón salir,
- botón modo móvil.

Cada página tendrá en `<body>`:

```html
<body data-page="clientes" data-auth="true">
```

`layout.js` lee esos atributos y arma el shell.

Esto evita duplicar menú en todos los HTML.

---

### `js/app.js`

Inicializador general.

Debe:

- esperar DOMContentLoaded,
- aplicar guard de autenticación,
- cargar layout,
- cargar datos semilla si `AUTO_SEED` está activo y no hay datos,
- inicializar módulo según `data-page`,
- capturar errores básicos,
- mostrar toast de bienvenida.

---

## JS módulos

Cada módulo se encarga solo de su pantalla.

### `clientes.js`

```text
initClientesModule()
renderClientesTable()
openClienteForm()
saveCliente()
editCliente()
toggleClienteStatus()
searchClientes()
```

### `periodos.js`

```text
initPeriodosModule()
renderPeriodosTable()
openPeriodoForm()
savePeriodo()
closePeriodo()
reopenPeriodo()
validatePeriodoForClose()
```

### `documentos.js`

```text
initDocumentosModule()
renderDocumentosTable()
openDocumentoForm()
saveDocumento()
updateDocumentoStatus()
filterDocumentosByPeriod()
getPendingDocuments()
```

### `transacciones.js`

```text
initTransaccionesModule()
renderTransaccionesTable()
openTransaccionForm()
saveTransaccion()
voidTransaccion()
getTransactionsByPeriod()
getSummaryByType()
```

### `impuestos.js`

```text
initImpuestosModule()
calculateTaxes(clientId, periodId)
renderTaxSummary()
generateObligations()
getTaxAlerts()
saveTaxSnapshot()
```

### `alertas.js`

```text
initAlertasModule()
generateAlerts()
renderAlerts()
markAlertAsViewed()
resolveAlert()
copyWhatsAppMessage()
openWhatsApp()
```

### `reportes.js`

```text
initReportesModule()
loadReportClients()
loadReportPeriods()
generateMonthlyReport()
renderReportPreview()
printReport()
saveReportSnapshot()
```

### `respaldo.js`

```text
initRespaldoModule()
exportBackup()
importBackup()
loadSeed()
resetSystem()
renderLogs()
```

### `bitacora.js`

```text
logAction(action, entity, entityId, details)
getLogs()
renderLogs()
clearOldLogs()
```

Puede ser usado por `storage.js` o módulos.

---

# 6. Orden de carga de scripts

En todas las páginas internas, el orden debe ser siempre este:

```html
<script src="./js/config.js" defer></script>
<script src="./js/utils.js" defer></script>
<script src="./js/storage.js" defer></script>
<script src="./js/data/seed.js" defer></script>
<script src="./js/auth.js" defer></script>
<script src="./js/layout.js" defer></script>
<script src="./js/modules/bitacora.js" defer></script>
<script src="./js/app.js" defer></script>
```

Y en la página correspondiente se agrega su módulo:

Ejemplo en `clientes.html`:

```html
<script src="./js/modules/clientes.js" defer></script>
```

Ejemplo en `reportes.html`:

```html
<script src="./js/modules/impuestos.js" defer></script>
<script src="./js/modules/reportes.js" defer></script>
```

Importante: `defer` mantiene el orden y espera el DOM.

---

# 7. Roadmap completo por fases

Vamos a construirlo en fases cerradas.

Cada fase tiene:

- objetivo,
- archivos,
- dependencias,
- entregable,
- prueba,
- criterio para avanzar.

---

## Fase 0 — Preparación del repositorio

### Objetivo

Dejar el proyecto listo para desarrollo y defensa.

### Archivos

```text
README.md
.gitignore
docs/contrato-datos.md
docs/pruebas.md
```

### Contenido de README

Debe incluir:

- nombre del proyecto,
- objetivo,
- stack,
- cómo ejecutar local,
- cómo desplegar en GitHub Pages,
- credenciales demo,
- limitaciones de LocalStorage,
- estructura de carpetas.

### Contenido de `.gitignore`

```text
.DS_Store
Thumbs.db
node_modules/
dist/
backup-local/
*.log
```

### Entregable

Repositorio iniciado con documentación base.

### Prueba

El repo se puede subir a GitHub sin archivos basura.

### Criterio para avanzar

Cuando exista README claro y estructura definida.

---

## Fase 1 — Núcleo técnico y shell visual

### Objetivo

Crear la base del sistema sin lógica de negocio pesada.

### Archivos

```text
index.html
dashboard.html
404.html
css/styles.css
css/print.css
js/config.js
js/utils.js
js/storage.js
js/data/seed.js
js/auth.js
js/layout.js
js/modules/bitacora.js
js/app.js
```

### Qué se construye

- login básico,
- menú lateral,
- topbar,
- dashboard vacío pero con estructura,
- storage funcional,
- seed cargable,
- auth simulada,
- layout dinámico,
- bitácora básica.

### Dependencias

Esta fase depende solo de Fase 0.

### Entregable

Puedes entrar al sistema, ver dashboard, cargar demo y salir.

### Prueba manual

```text
1. Abrir index.html.
2. Ingresar con usuario demo.
3. Entrar a dashboard.
4. Ver menú lateral.
5. Recargar página y mantener sesión.
6. Cerrar sesión.
7. Intentar entrar a dashboard sin sesión y debe redirigir a login.
8. Cargar datos demo desde respaldo o login.
9. Exportar respaldo JSON.
```

### Criterio para avanzar

No pasar a Fase 2 hasta que:

- login funcione,
- storage guarde y lea,
- seed cargue,
- layout se vea en móvil,
- app.js no lance errores en consola.

### Importante

Después de esta fase, los archivos base deberían considerarse “congelados”.

Si later necesitamos cambiarlos, solo será por bug, no por rediseño.

---

## Fase 2 — Clientes y periodos

### Objetivo

Crear los dos maestros fundamentales del sistema.

### Archivos

```text
clientes.html
periodos.html
js/modules/clientes.js
js/modules/periodos.js
```

### Qué se construye

Clientes:

- crear,
- editar,
- listar,
- buscar,
- desactivar,
- ver ficha.

Periodos:

- abrir periodo por cliente,
- listar periodos,
- cambiar estado,
- cerrar periodo,
- reabrir periodo,
- validar cierre.

### Dependencias

Fase 1.

### Entregable

Ya puedes registrar una microempresa y su periodo mensual.

### Prueba manual

```text
1. Crear cliente “Tienda Doña Rosa”.
2. Crear cliente “Ferretería San Luis”.
3. Crear cliente “Abarrotes La Esquina”.
4. Abrir periodo octubre 2026 para cada cliente.
5. Editar un cliente.
6. Desactivar un cliente.
7. Cerrar un periodo.
8. Reabrir periodo y verificar bitácora.
```

### Criterio para avanzar

No pasar a Fase 3 hasta que:

- cliente quede guardado,
- periodo quede vinculado al cliente,
- cerrar/reabrir deje log,
- tablas se vean bien en móvil.

---

## Fase 3 — Documentos y transacciones

### Objetivo

Registrar la operación contable diaria.

### Archivos

```text
documentos.html
transacciones.html
js/modules/documentos.js
js/modules/transacciones.js
```

### Qué se construye

Documentos:

- registrar factura, recibo, nota, extracto,
- vincular a cliente/periodo,
- clasificar tipo,
- marcar estado,
- listar pendientes.

Transacciones:

- registrar compra,
- registrar venta,
- registrar gasto,
- registrar ingreso,
- vincular documento opcional,
- anular transacción,
- resumen por tipo.

### Dependencias

Fase 2.

### Entregable

Ya puedes capturar la información mensual de un comercio.

### Prueba manual

```text
1. Seleccionar cliente.
2. Seleccionar periodo abierto.
3. Registrar documento de venta.
4. Registrar documento de compra.
5. Registrar gasto sin documento, con observación.
6. Crear transacción vinculada a documento.
7. Anular una transacción.
8. Verificar que no se elimine físicamente.
9. Filtrar por cliente/periodo/tipo.
```

### Criterio para avanzar

No pasar a Fase 4 hasta que:

- documento pertenezca a cliente/periodo,
- transacción pertenezca a cliente/periodo,
- no se puedan registrar datos en periodo cerrado,
- anulación funcione.

---

## Fase 4 — Impuestos y obligaciones tributarias

### Objetivo

Convertir el registro en información tributaria preventiva.

### Archivos

```text
impuestos.html
js/modules/impuestos.js
```

También se modifica configuración en:

```text
js/config.js
```

pero solo si falta alguna constante. Idealmente ya debe estar prevista en Fase 1.

### Qué se construye

- cálculo de IVA débito,
- cálculo de IVA crédito,
- IVA por pagar,
- IT estimado,
- RC-IVA estimado si aplica,
- generación de obligaciones,
- fecha de vencimiento,
- resumen por cliente/periodo.

### Regla simplificada de vencimiento

Para MVP:

```text
Vencimiento = día 20 del mes siguiente al periodo
```

Ejemplo:

```text
Periodo octubre 2026
Vencimiento 20 noviembre 2026
```

Esto debe ser configurable y con advertencia de validar normativa SIN.

### Dependencias

Fase 3.

### Entregable

El sistema puede calcular impuestos estimados del mes.

### Prueba manual

```text
1. Ir a impuestos.
2. Seleccionar cliente.
3. Seleccionar periodo.
4. Calcular impuestos.
5. Ver IVA débito.
6. Ver IVA crédito.
7. Ver IVA por pagar.
8. Ver IT estimado.
9. Generar obligación tributaria.
10. Verificar que la obligación tenga fecha de vencimiento.
```

### Criterio para avanzar

No pasar a Fase 5 hasta que:

- cálculo sea consistente,
- no permita calcular en periodo sin transacciones,
- genere obligación,
- muestre advertencia de que es informativo.

---

## Fase 5 — Alertas tributarias y operativas

### Objetivo

Prevenir vencimientos y documentos faltantes.

### Archivos

```text
alertas.html
js/modules/alertas.js
```

### Qué se construye

Alertas por:

- vencimiento próximo,
- vencimiento pasado,
- documentos pendientes,
- periodo sin cerrar,
- transacciones sin documento,
- impuestos no calculados.

Niveles:

```text
informativa
preventiva
urgente
vencida
```

Acciones:

- marcar vista,
- resolver,
- copiar mensaje WhatsApp,
- abrir WhatsApp.

### Dependencias

Fase 4.

### Entregable

Dashboard y módulo de alertas útiles para el comerciante.

### Prueba manual

```text
1. Crear obligación con vencimiento cercano.
2. Ver alerta preventiva.
3. Dejar vencer.
4. Ver alerta vencida.
5. Marcar alerta como vista.
6. Copiar mensaje WhatsApp.
7. Abrir enlace WhatsApp.
8. Ver alertas en dashboard.
```

### Criterio para avanzar

No pasar a Fase 6 hasta que:

- alertas se generen automáticamente,
- no se dupliquen sin control,
- se puedan marcar vistas/resueltas,
- se vean bien en móvil.

---

## Fase 6 — Reporte mensual en lenguaje sencillo

### Objetivo

Entregar el resultado al microempresario de forma comprensible.

### Archivos

```text
reportes.html
js/modules/reportes.js
css/print.css
```

### Qué se construye

Reporte mensual con:

- datos del cliente,
- periodo,
- ventas,
- compras,
- gastos,
- utilidad estimada,
- impuestos estimados,
- documentos pendientes,
- alertas,
- recomendaciones,
- próximo paso.

Debe poder:

- vista previa,
- imprimir,
- guardar como PDF desde navegador.

### Dependencias

Fases 3, 4 y 5.

### Entregable

Reporte mensual imprimible.

### Prueba manual

```text
1. Ir a reportes.
2. Seleccionar cliente.
3. Seleccionar periodo.
4. Generar reporte.
5. Ver resumen numérico.
6. Ver recomendaciones.
7. Imprimir.
8. Verificar que print.css oculte menú y botones.
9. Guardar como PDF.
10. Verificar que se lea en celular.
```

### Criterio para avanzar

No pasar a Fase 7 hasta que:

- reporte no dependa de datos inexistentes,
- muestre “sin datos” si no hay movimiento,
- sea imprimible,
- use lenguaje sencillo.

---

## Fase 7 — Respaldo, importación, exportación y mantenimiento

### Objetivo

Proteger la información del prototipo.

### Archivos

```text
respaldo.html
js/modules/respaldo.js
```

### Qué se construye

- exportar todos los datos JSON,
- importar datos JSON,
- cargar semilla,
- restablecer sistema,
- ver bitácora,
- limpiar datos de demo,
- versión de respaldo.

Formato de exportación:

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

### Dependencias

Fase 1, pero se consolida al final.

### Entregable

Sistema con respaldo portable.

### Prueba manual

```text
1. Cargar datos demo.
2. Exportar respaldo.
3. Restablecer sistema.
4. Importar respaldo.
5. Verificar que vuelvan clientes, periodos, documentos y transacciones.
6. Ver bitácora.
7. Probar importación con JSON inválido y debe mostrar error.
```

### Criterio para avanzar

No pasar a Fase 8 hasta que:

- export/import funcione,
- no rompa IDs,
- no duplique registros sin control,
- valide JSON.

---

## Fase 8 — Ayuda, manual y experiencia de usuario

### Objetivo

Que el comerciante o evaluador entienda el sistema sin explicación larga.

### Archivos

```text
ayuda.html
docs/manual-usuario.md
```

Pequeños ajustes en:

```text
css/styles.css
js/layout.js
```

solo si hace falta.

### Qué se construye

- guía rápida,
- preguntas frecuentes,
- explicación de estados,
- explicación de límites legales,
- botón “¿Necesitas ayuda?” en topbar.

### Dependencias

Todas las fases anteriores.

### Entregable

Sistema autodocumentado.

### Prueba manual

```text
1. Abrir ayuda.
2. Leer guía rápida.
3. Seguir paso a paso para crear cliente.
4. Seguir paso a paso para generar reporte.
5. Ver límite profesional.
```

### Criterio para avanzar

No pasar a Fase 9 hasta que:

- un usuario nuevo entienda el flujo básico,
- haya aviso de LocalStorage,
- haya aviso de que no sustituye Contador Público Autorizado.

---

## Fase 9 — Responsive, pulido visual y accesibilidad básica

### Objetivo

Que se vea profesional en celular y computadora.

### Archivos

```text
css/styles.css
css/print.css
js/layout.js
```

Posibles ajustes mínimos en HTML si hace falta.

### Qué se construye

- menú hamburguesa,
- tablas responsive,
- formularios móviles,
- botones grandes,
- contrastes,
- estados vacíos,
- loaders simples,
- toasts,
- validaciones visuales.

### Dependencias

Fases anteriores.

### Entregable

Interfaz usable en móvil.

### Prueba manual

```text
1. Abrir en ancho 360px.
2. Navegar todos los módulos.
3. Crear cliente desde móvil.
4. Registrar transacción desde móvil.
5. Ver reporte desde móvil.
6. Imprimir reporte.
7. Verificar que no haya desbordes horizontales.
```

### Criterio para avanzar

No pasar a Fase 10 hasta que:

- no se rompa en celular,
- menú funcione,
- tablas sean legibles,
- botones no estén encimados.

---

## Fase 10 — Despliegue en GitHub Pages

### Objetivo

Publicar el prototipo.

### Archivos

```text
README.md
404.html
```

Y configuración en GitHub.

### Pasos

1. Crear repositorio:

```text
cuentas-claras-mvp
```

2. Subir todo.

3. Ir a:

```text
Settings > Pages
```

4. Seleccionar:

```text
Branch: main
Folder: /root
```

5. Guardar.

6. Esperar despliegue.

7. Abrir URL:

```text
https://usuario.github.io/cuentas-claras-mvp/
```

### Dependencias

Proyecto funcional local.

### Entregable

Sistema publicado.

### Prueba manual

```text
1. Abrir URL pública.
2. Hacer login.
3. Cargar demo.
4. Crear cliente.
5. Generar reporte.
6. Exportar respaldo.
7. Recargar y verificar persistencia en ese navegador.
```

### Criterio para avanzar

No pasar a Fase 11 hasta que:

- ruta base funcione,
- CSS cargue,
- JS cargue,
- LocalStorage funcione en el dominio publicado,
- 404 funcione.

---

## Fase 11 — Validación con clientes piloto y evidencia académica

### Objetivo

Demostrar que el modelo sirve para microempresas reales.

### Archivos/documentos

```text
docs/pruebas.md
docs/capturas/
docs/acta-piloto.md
docs/testimonios.md
```

### Qué se hace

Seleccionar 3 microempresas:

```text
1 tienda de barrio
1 puesto de mercado
1 ferretería pequeña o abarrotería
```

Aplicar el proceso en 8 pasos:

```text
1. Diagnóstico
2. Recepción documental
3. Clasificación
4. Registro digital
5. Conciliación
6. Cierre mensual
7. Obligaciones tributarias
8. Reporte y capacitación
```

### Evidencias

- fotos,
- capturas,
- reporte PDF,
- respaldo JSON,
- acta firmada,
- testimonio corto,
- video de 2-3 minutos.

### Entregable

Proyecto validado.

### Prueba final

```text
1. Atender 3 clientes piloto.
2. Medir tiempo por cliente.
3. Detectar errores.
4. Corregir solo bugs críticos.
5. Generar reporte final.
6. Preparar defensa.
```

---

# 8. Orden exacto de desarrollo para no volver atrás

Este es el orden recomendado.

## Lote 1 — Fundación

```text
README.md
.gitignore
docs/contrato-datos.md
docs/pruebas.md
```

Resultado: repo listo.

---

## Lote 2 — Núcleo base

```text
js/config.js
js/utils.js
js/storage.js
js/data/seed.js
js/modules/bitacora.js
js/auth.js
js/layout.js
js/app.js
```

Resultado: cerebro del sistema listo.

---

## Lote 3 — Interfaz base

```text
css/styles.css
css/print.css
index.html
dashboard.html
404.html
```

Resultado: se puede entrar y ver shell.

---

## Lote 4 — Maestros

```text
clientes.html
js/modules/clientes.js
periodos.html
js/modules/periodos.js
```

Resultado: clientes y periodos funcionando.

---

## Lote 5 — Operación contable

```text
documentos.html
js/modules/documentos.js
transacciones.html
js/modules/transacciones.js
```

Resultado: registro documental y contable.

---

## Lote 6 — Tributos y alertas

```text
impuestos.html
js/modules/impuestos.js
alertas.html
js/modules/alertas.js
```

Resultado: cálculo tributario y prevención.

---

## Lote 7 — Reporte y respaldo

```text
reportes.html
js/modules/reportes.js
respaldo.html
js/modules/respaldo.js
```

Resultado: entrega mensual y protección de datos.

---

## Lote 8 — Ayuda y pulido

```text
ayuda.html
docs/manual-usuario.md
ajustes menores en css/styles.css
ajustes menores en js/layout.js si hace falta
```

Resultado: sistema presentable.

---

## Lote 9 — Despliegue

```text
GitHub Pages
README actualizado con URL
capturas
video
```

Resultado: proyecto visible.

---

# 9. Contrato de datos mínimo

Esto debe estar en `docs/contrato-datos.md` y servir de guía para todos los módulos.

## Usuario

```json
{
  "id": "USR-0001",
  "nombre": "Administrador",
  "usuario": "admin",
  "email": "admin@cuentasclaras.bo",
  "passwordHash": "...",
  "rol": "admin",
  "estado": "activo",
  "fechaCreacion": "2026-10-01"
}
```

## Cliente

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

## Periodo

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

## Documento

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

## Transacción

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

## Impuesto calculado

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

## Obligación tributaria

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

## Alerta

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

## Reporte

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

## Bitácora

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

---

# 10. Datos semilla recomendados

La semilla debe permitir demostrar todo sin escribir mucho.

## Usuarios

```text
admin / Admin123
contador / Contador123
```

## Clientes

```text
CLI-0001 Tienda Doña Rosa
CLI-0002 Ferretería San Luis
CLI-0003 Abarrotes La Esquina
```

## Periodos

```text
PER-0001 CLI-0001 octubre 2026 abierto
PER-0002 CLI-0002 octubre 2026 en_revision
PER-0003 CLI-0003 octubre 2026 cerrado
```

## Documentos

Al menos:

```text
5 ventas
5 compras
3 gastos
2 pendientes
```

## Transacciones

Al menos:

```text
10 ventas
8 compras
5 gastos
2 anuladas
```

## Impuestos/obligaciones

```text
IVA débito
IVA crédito
IVA por pagar
IT estimado
obligación con vencimiento 20/11/2026
```

## Alertas

```text
1 vencimiento próximo
1 documento pendiente
1 periodo sin cerrar
1 transacción sin documento
1 alerta resuelta
```

---

# 11. Reglas de negocio que debe cumplir el sistema

Estas reglas hacen que parezca un sistema contable y no un CRUD cualquiera.

## Regla 1: Periodo pertenece a un cliente

No se pueden mezclar periodos entre clientes.

## Regla 2: Documento pertenece a cliente y periodo

Todo documento debe estar vinculado.

## Regla 3: Transacción pertenece a cliente y periodo

Todo movimiento contable debe estar vinculado.

## Regla 4: No se registra en periodo cerrado

Si el periodo está cerrado, el sistema bloquea creación/edición.

## Regla 5: No se elimina transacción, se anula

Para mantener trazabilidad.

## Regla 6: Cierre de periodo requiere validaciones

Antes de cerrar, verificar:

- documentos pendientes críticos,
- transacciones sin documento,
- impuestos calculados,
- alertas revisadas,
- montos negativos,
- fechas fuera de periodo.

## Regla 7: Reapertura queda en bitácora

Si se reabre un periodo, debe quedar registro.

## Regla 8: Reporte usa lenguaje sencillo

No solo balance técnico. Debe explicar:

- cuánto vendió,
- cuánto compró,
- cuánto gastó,
- cuánto ganó aproximadamente,
- cuánto debe pagar,
- cuándo vence,
- qué le falta.

## Regla 9: El sistema no sustituye al Contador Público Autorizado

Debe aparecer en:

- ayuda,
- reporte,
- login,
- README,
- contrato.

## Regla 10: Los datos son locales

Debe aparecer advertencia:

```text
Los datos se guardan en este navegador. Exporte respaldos periódicamente.
```

---

# 12. Checklist de calidad por fase

## Fase 1

- [ ] Login funciona.
- [ ] Sesión persiste al recargar.
- [ ] Logout funciona.
- [ ] Páginas protegidas redirigen a login.
- [ ] Layout se ve en móvil.
- [ ] Storage guarda JSON.
- [ ] Seed carga sin errores.
- [ ] Consola sin errores rojos.

## Fase 2

- [ ] Cliente se crea.
- [ ] Cliente se edita.
- [ ] Cliente se desactiva.
- [ ] Periodo se crea por cliente.
- [ ] Periodo se cierra.
- [ ] Periodo se reabre con log.
- [ ] No se puede crear periodo duplicado mismo mes/año/cliente.

## Fase 3

- [ ] Documento se vincula a cliente/periodo.
- [ ] Transacción se vincula a cliente/periodo.
- [ ] Transacción puede vincular documento.
- [ ] No se puede registrar en periodo cerrado.
- [ ] Anulación funciona.
- [ ] Filtros funcionan.

## Fase 4

- [ ] Impuestos se calculan por periodo.
- [ ] IVA débito/crédito funciona.
- [ ] IT estimado funciona.
- [ ] Obligación se genera.
- [ ] Vencimiento se asigna.
- [ ] Aviso de cálculo informativo aparece.

## Fase 5

- [ ] Alertas se generan.
- [ ] Alertas no se duplican sin control.
- [ ] Alertas se pueden marcar vistas.
- [ ] WhatsApp link funciona.
- [ ] Dashboard muestra alertas.

## Fase 6

- [ ] Reporte se genera.
- [ ] Reporte se imprime.
- [ ] Print.css oculta menú.
- [ ] Reporte se lee en celular.
- [ ] Reporte incluye recomendaciones.

## Fase 7

- [ ] Exportar JSON funciona.
- [ ] Importar JSON funciona.
- [ ] Reset funciona.
- [ ] Seed funciona.
- [ ] Bitácora se ve.
- [ ] JSON inválido da error controlado.

## Fase 8

- [ ] Ayuda explica flujo.
- [ ] Límite profesional visible.
- [ ] Advertencia LocalStorage visible.

## Fase 9

- [ ] Responsive 360px.
- [ ] Tablas no rompen.
- [ ] Botones tocables.
- [ ] Formularios móviles OK.
- [ ] Estados vacíos claros.

## Fase 10

- [ ] GitHub Pages carga.
- [ ] Rutas relativas funcionan.
- [ ] Login público funciona.
- [ ] LocalStorage funciona en dominio publicado.

## Fase 11

- [ ] 3 clientes piloto atendidos.
- [ ] Capturas guardadas.
- [ ] Reporte PDF de ejemplo.
- [ ] Acta de validación.
- [ ] Video corto.

---

# 13. Qué más te puede facilitar el desarrollo

Te dejo recomendaciones prácticas.

## 13.1. Usa Bootstrap 5 por CDN

En `<head>`:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

Antes de cerrar `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

Esto te da:

- grid,
- navbar,
- cards,
- tables,
- forms,
- modals,
- badges,
- alerts,
- responsive.

---

## 13.2. No uses rutas absolutas

Siempre:

```html
./css/styles.css
./js/app.js
```

Nunca:

```html
/css/styles.css
/js/app.js
```

Esto te salva en GitHub Pages.

---

## 13.3. Usa `defer` en todos tus scripts

Así:

```html
<script src="./js/app.js" defer></script>
```

Evita problemas de DOM no cargado.

---

## 13.4. No guardes imágenes grandes en LocalStorage

LocalStorage tiene límite aproximado de 5 MB por dominio.

Si quieres adjuntar documentos:

- comprimir imagen,
- límite 200-300 KB,
- o solo guardar nombre/referencia.

Para MVP, yo empezaría solo con metadatos y luego agregaría imagen opcional.

---

## 13.5. Haz un “modo demo” visible

En login o respaldo:

```text
Cargar datos de demostración
```

Esto te salva en presentación.

---

## 13.6. Prepara estados vacíos

Cada tabla debe mostrar algo si no hay datos:

```text
No hay clientes registrados.
Crea el primer cliente o carga datos demo.
```

Evita pantallas en blanco.

---

## 13.7. Usa toasts para acciones

Ejemplos:

```text
Cliente guardado correctamente.
Periodo cerrado.
Respaldo exportado.
Error: JSON inválido.
```

Mejora mucho la percepción de sistema terminado.

---

## 13.8. Valida antes de guardar

Reglas mínimas:

- cliente requiere nombre,
- NIT si tiene debe ser numérico,
- teléfono boliviano simple,
- monto > 0,
- fecha válida,
- documento requiere cliente/periodo,
- transacción requiere cliente/periodo/tipo/monto.

---

## 13.9. Mantén un archivo de decisiones

En `docs/contrato-datos.md` apunta:

- claves,
- IDs,
- estados,
- fórmulas de impuestos,
- reglas de cierre,
- límites legales.

Así no cambias de opinión a mitad.

---

## 13.10. Commits por fase

Sugiero mensajes:

```text
feat: base del proyecto
feat: núcleo storage y auth
feat: modulo clientes
feat: modulo periodos
feat: modulo documentos
feat: modulo transacciones
feat: calculo impuestos
feat: alertas tributarias
feat: reporte mensual
feat: respaldo json
feat: despliegue github pages
docs: manual y evidencias
```

---

# 14. Ruta mínima viable para defensa

Si el tiempo aprieta, tu MVP defendible debe tener sí o sí:

```text
Login
Dashboard
Clientes
Periodos
Documentos
Transacciones
Impuestos básico
Alertas
Reporte imprimible
Exportar respaldo
GitHub Pages
```

Eso ya demuestra:

- modelo contable,
- control documental,
- cálculo tributario,
- prevención,
- reporte educativo,
- tecnología aplicada.

No necesitas:

- app móvil,
- backend,
- facturación electrónica,
- integración bancaria,
- multiusuario real,
- nube.

---

