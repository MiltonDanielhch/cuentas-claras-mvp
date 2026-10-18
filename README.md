Perfecto, vamos con **B**: cerrar el alcance contable en documentación **antes** de escribir una sola línea de la Fase 5. Así el contrato de datos queda congelado con lo nuevo y no retrocedemos a mitad.

Te paso **dos archivos completos**, listos para reemplazar:

```text
cuentas-claras-mvp/README.md
cuentas-claras-mvp/docs/contrato-datos.md
```

Lo que **cambia**: se agregan las fases contables 5–9, las colecciones nuevas (`cc_accounts`, `cc_journal_entries`, `cc_journal_lines`, `cc_fixed_assets`, `cc_financial_snapshots`), campos nuevos en clientes/periodos/transacciones, el plan de cuentas ampliado y las reglas de asiento automático.

Lo que **NO cambia**: todo lo que ya funciona (Fases 0–4) sigue válido. Las colecciones viejas conservan sus campos; solo se les **suman** campos opcionales. Ninguna pantalla hecha se rompe.

---

# Archivo 1: `README.md` (completo, reemplazar)

```markdown
# Cuentas Claras – Gestión Contable Digital

## Proyecto

**Diseño e implementación de un modelo de gestión contable digital para microempresas comerciales de Trinidad, Beni, apoyado en un sistema computarizado de control documental, ciclo contable completo, alertas tributarias y reportes mensuales.**

Este proyecto corresponde a un **Proyecto de Emprendimiento Productivo** para optar al título profesional de **Técnico Medio en Contabilidad** del Centro de Educación Alternativa “Santísima Trinidad”, Trinidad – Beni – Bolivia.

## Participantes

- Lizi Francia Mansilla Vaca
- Milton Daniel Hipamo Cholima

## Tutora del proyecto

- Lic. Sarita Ignacia

## Facilitador de la especialidad

- Lic. Edgar Aquilino

## Director del C.E.A. Santísima Trinidad

- Lic. Miguel Valencia Mazi

## Año

2026

---

## Objetivo del sistema

El sistema prototípico busca apoyar la gestión contable digital de microempresas comerciales de Trinidad, Beni, mediante:

- registro de clientes microempresarios;
- control de periodos contables;
- recepción y clasificación documental;
- registro de compras, ventas, gastos e ingresos;
- **ciclo contable completo simplificado**: catálogo de cuentas, Libro Diario (doble entrada), Libro Mayor, Balanza de comprobación, ajustes, Balanza ajustada, Estado de Resultados, Balance General y cierre del periodo;
- **costos, rentabilidad e indicadores financieros** básicos;
- cálculo informativo de impuestos;
- generación de alertas tributarias y operativas;
- emisión de reportes mensuales en lenguaje sencillo;
- respaldo e importación/exportación de datos en formato JSON.

El sistema es una **herramienta de apoyo contable**, no un sustituto de la firma, certificación, auditoría o representación profesional de un Contador Público Autorizado cuando la normativa boliviana lo exija.

---

## Enfoque del proyecto

El proyecto pertenece a la especialidad de **Contabilidad**.

A diferencia de un simple registro de ventas, Cuentas Claras implementa el **ciclo contable completo** adaptado a la realidad de la microempresa comercial: desde el documento fuente hasta los estados financieros y su lectura gerencial. La tecnología es un componente de apoyo para demostrar ese ciclo de forma ordenada, verificable y comprensible.

El valor central está en:

1. ordenar la información contable del microempresario con doble entrada real;
2. garantizar cuadratura (débitos = créditos) en cada asiento y en la balanza;
3. prevenir incumplimientos tributarios con alertas;
4. emitir estados financieros simplificados y en lenguaje comprensible;
5. acompañar educativamente al comerciante;
6. prototipizar un sistema computarizado sencillo y desplegable.

---

## Ciclo contable cubierto

| Paso del ciclo | Módulo |
|---|---|
| 1. Apertura y catálogo de cuentas | Fase 5 |
| 2. Operaciones / documentos fuente | Fases 2 y 3 |
| 3. Libro Diario (doble entrada) | Fase 5 |
| 4. Pase al Libro Mayor | Fase 6 |
| 5. Balanza de comprobación | Fase 6 |
| 6. Ajustes contables | Fase 7 |
| 7. Balanza ajustada | Fase 7 |
| 8. Estados Financieros y cierre | Fase 8 |
| 9. Costos, rentabilidad e indicadores | Fase 9 |
| 10. Reporte educativo mensual | Fase 11 |
| 11. Alertas preventivas | Fase 10 |

---

## Stack tecnológico del prototipo

El prototipo se desarrollará con tecnologías estáticas, ligeras y compatibles con GitHub Pages:

| Componente | Tecnología |
|---|---|
| Interfaz | HTML5 |
| Estilos | CSS3 |
| Lógica | JavaScript vanilla |
| Framework visual | Bootstrap 5 por CDN |
| Datos semilla | JSON |
| Persistencia local | LocalStorage |
| Control de versiones | Git y GitHub |
| Despliegue | GitHub Pages |

No se utilizará backend, base de datos servida ni servidor application en esta fase.

---

## Idioma del sistema

La interfaz, documentación visible, reportes, mensajes y textos para el usuario estarán en **español**.

Se mantienen en inglés únicamente elementos técnicos obligatorios, como:

- nombres de archivos;
- etiquetas HTML;
- propiedades CSS;
- palabras reservadas de JavaScript;
- claves técnicas de LocalStorage;
- nombres de campos JSON internos;
- comandos de Git;
- términos de plataforma como GitHub Pages, LocalStorage, JSON, HTML, CSS y JS.

---

## Moneda

La moneda de trabajo será el **Boliviano**, representado como:

```text
Bs
```

Ejemplo:

```text
Bs 250.50
```

Los montos se almacenarán como números y se formatearán para visualización.

---

## Normativa tributaria referencial para el prototipo

El sistema manejará cálculos informativos basados en referencia boliviana, sujetos a validación normativa vigente ante el Servicio de Impuestos Nacionales.

Para el prototipo se consideran:

| Impuesto | Referencia |
|---|---|
| IVA | 13% |
| IT | 3% |
| RC-IVA | referencia informativa |

El sistema no realizará declaración automática ante el SIN.

El cálculo tributario será preventivo e informativo.

---

## Tratamiento contable del IVA en el Libro Diario

Para mantener coherencia entre el módulo de impuestos (Fase 4) y el Libro Diario (Fase 5), el motor de asientos automáticos desglosa el IVA según el régimen del cliente:

- **Régimen General**: las ventas generan crédito a IVA Débito Fiscal; las compras generan débito a IVA Crédito Fiscal. La contrapartida de efectivo/credito incluye el monto total (base + impuesto).
- **Régimen Simplificado**: no se desglosa IVA; el asiento es simple (caja/bancos contra ventas o compras).

Esta regla es simplificada para microempresa comercial y no reemplaza el tratamiento formal de una declaración jurada.

---

## Método de valuación de inventario

Para no inflar el alcance, el prototipo usa **método periódico simplificado**:

- las compras de mercancía se registran directamente en cuenta de costo/compras;
- el inventario final se determina mediante asiento de ajuste al cierre (plantilla de Fase 7/8), no por Kardex perpetuo;
- el costo de ventas del periodo se deriva de: inventario inicial + compras − inventario final.

El control por ítem (Kardex) se declara como **proyección**, no como fase obligatoria del MVP.

---

## Vencimiento genérico para alertas demo

Para efectos de prototipo y demostración, se usará una fecha genérica de vencimiento:

```text
día 20 del mes siguiente al periodo contable
```

Ejemplo:

```text
Periodo: octubre 2026
Vencimiento referencial: 20 de noviembre de 2026
```

Esta regla es referencial y deberá ajustarse conforme a normativa vigente del SIN.

---

## Credenciales de demostración

Estas credenciales son únicamente para prototipo académico y no representan seguridad real de producción.

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin123` | administrador |
| `contador` | `Contador123` | contador |

---

## Limitaciones de LocalStorage

El prototipo utiliza LocalStorage como mecanismo de persistencia local en el navegador.

Esto implica:

- los datos se guardan solo en el navegador donde se ingresaron;
- no se sincronizan entre celulares, computadoras o navegadores distintos;
- si se borran los datos del navegador, se pierde la información;
- el almacenamiento tiene un límite aproximado, generalmente alrededor de 5 MB por dominio;
- no es un sistema productivo en la nube;
- no sustituye una base de datos segura con autenticación server-side.

Para mitigarlo, el sistema incluirá:

- exportar respaldo en JSON;
- importar respaldo en JSON;
- cargar datos semilla;
- restablecer sistema;
- bitácora básica de movimientos.

Para una implementación productiva futura se prevé migrar a:

- base de datos relacional;
- backend seguro;
- autenticación real;
- roles y permisos;
- respaldos en la nube;
- cifrado adecuado;
- control de accesos;
- posible integración con servicios de mensajería o facturación, conforme a normativa.

---

## Cómo ejecutar localmente

### Opción 1: abrir directamente

Después de tener la fase con `index.html`, puedes abrir el archivo en el navegador.

Sin embargo, para evitar restricciones de algunos navegadores con LocalStorage, se recomienda usar un servidor local simple.

### Opción 2: servidor local con Python

Si tienes Python instalado, desde la carpeta raíz del proyecto ejecuta:

```bash
python -m http.server 8000
```

Luego abre en el navegador:

```text
http://localhost:8000
```

### Opción 3: Visual Studio Code

Si usas Visual Studio Code, instala la extensión **Live Server** y abre el archivo `index.html` con “Open with Live Server”.

---

## Cómo desplegar en GitHub Pages

1. Sube el repositorio a GitHub con el nombre:

   ```text
   cuentas-claras-mvp
   ```

2. Entra al repositorio en GitHub.

3. Ve a:

   ```text
   Settings > Pages
   ```

4. En **Source**, selecciona:

   ```text
   Deploy from a branch
   ```

5. En **Branch**, selecciona:

   ```text
   main
   ```

6. En carpeta, selecciona:

   ```text
   / (root)
   ```

7. Guarda.

8. Espera uno o dos minutos.

9. Abre la URL generada, por ejemplo:

   ```text
   https://tu-usuario.github.io/cuentas-claras-mvp/
   ```

Importante: todas las rutas internas deben ser relativas, por ejemplo:

```html
<link href="./css/styles.css" rel="stylesheet">
```

No usar rutas absolutas como:

```html
<link href="/css/styles.css" rel="stylesheet">
```

Esto evita problemas al desplegar en GitHub Pages.

---

## Estructura objetivo del proyecto

La estructura final prevista es:

```text
cuentas-claras-mvp/
│
├── index.html
├── login.html
├── dashboard.html
├── clientes.html
├── periodos.html
├── documentos.html
├── transacciones.html
├── impuestos.html
├── libro-diario.html
├── libro-mayor.html
├── balanza.html
├── ajustes.html
├── estados-financieros.html
├── costos-indicadores.html
├── alertas.html
├── reportes.html
├── respaldo.html
├── ayuda.html
├── 404.html
│
├── css/
│   ├── styles.css
│   ├── landing.css
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
│       ├── contabilidad.js
│       ├── libro-diario.js
│       ├── libro-mayor.js
│       ├── balanza.js
│       ├── ajustes.js
│       ├── estados-financieros.js
│       ├── cierre.js
│       ├── costos.js
│       ├── indicadores.js
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
│   ├── plan-de-cuentas.md
│   ├── manual-usuario.md
│   ├── pruebas.md
│   └── capturas/
│
├── .gitignore
└── README.md
```

---

## Estado actual del desarrollo

Este repositorio se encuentra cerrando el **alcance contable completo** (actualización de contrato de datos y fases) antes de iniciar la **Fase 5: Catálogo de cuentas + Libro Diario**.

Archivos creados hasta ahora:

- `README.md`
- `.gitignore`
- `docs/contrato-datos.md`
- `docs/pruebas.md`
- Núcleo técnico (Fase 1): `index.html`, `login.html`, `dashboard.html`, `404.html`, `css/*`, `js/config.js`, `js/utils.js`, `js/storage.js`, `js/auth.js`, `js/layout.js`, `js/app.js`, `js/data/seed.js`, `js/modules/bitacora.js`
- Fases 2–4: `clientes.html`, `periodos.html`, `documentos.html`, `transacciones.html`, `impuestos.html` y sus módulos JS.

---

## Fases previstas

| Fase | Nombre | Objetivo | Estado |
|---|---|---|:--:|
| 0 | Preparación del repositorio | Documentación base y estructura | ✅ |
| 1 | Núcleo técnico y shell visual | Login, menú, dashboard, storage, seed, auth | ✅ |
| 2 | Clientes y periodos | Maestros fundamentales | ✅ |
| 3 | Documentos y transacciones | Registro operativo contable | ✅ |
| 4 | Impuestos y obligaciones | Cálculo tributario informativo | ✅ |
| 5 | Catálogo de cuentas + Libro Diario | Doble entrada automática y manual | 🟡 |
| 6 | Libro Mayor + Balanza de comprobación | Clasificación por cuenta y cuadratura | 🟡 |
| 7 | Ajustes contables + Balanza ajustada | Depreciación, devengados, reclasificaciones | 🟡 |
| 8 | Estados Financieros + cierre del periodo | EE.RR., Balance y asientos de cierre | 🟡 |
| 9 | Costos, rentabilidad e indicadores | Margen, punto de equilibrio, ratios | 🟡 |
| 10 | Alertas | Prevención tributaria y operativa | 🟡 |
| 11 | Reporte mensual | Entrega en lenguaje sencillo | 🟡 |
| 12 | Respaldo | Exportar, importar, reset, bitácora | 🟡 |
| 13 | Ayuda y manual | Experiencia de usuario y límites legales | 🟡 |
| 14 | Responsive y pulido | Uso móvil y presentación | 🟡 |
| 15 | GitHub Pages | Despliegue público | 🟡 |
| 16 | Validación piloto | Evidencia con microempresas reales | 🟡 |

---

## Aviso profesional y límite del prototipo

El prototipo constituye una herramienta de gestión contable digital, asistencia administrativa, control documental, cálculo preventivo de obligaciones, generación de reportes y educación tributaria.

Implementa un **ciclo contable simplificado para microempresa comercial**, con estados financieros de carácter informativo y formativo.

No sustituye la firma, certificación, auditoría, dictamen, representación formal ni cualquier otra actuación profesional reservada a un Contador Público Autorizado u otro profesional habilitado cuando la normativa boliviana lo exija.

---

## Aviso de protección de datos

La información de clientes, documentos, transacciones, asientos y estados financieros es confidencial.

Aunque el prototipo usa LocalStorage, se deben aplicar buenas prácticas:

- no compartir respaldos JSON sin autorización;
- exportar respaldos solo en dispositivos seguros;
- eliminar datos de prueba que contengan información real;
- mantener bitácora básica;
- solicitar autorización del cliente para tratamiento de datos.

---

## Licencia o uso

Proyecto académico de emprendimiento productivo, elaborado para fines formativos, de validación y presentación ante el Centro de Educación Alternativa “Santísima Trinidad”.

---

## Contacto del proyecto

Participantes:

- Lizi Francia Mansilla Vaca
- Milton Daniel Hipamo Cholima

Centro:

- C.E.A. Santísima Trinidad

Carrera:

- Técnico Medio en Contabilidad

Ubicación:

- Trinidad, Beni, Bolivia

Año:

- 2026
```

---

# Archivo 2: `docs/contrato-datos.md` (completo, reemplazar)

```markdown
# Contrato de datos – Cuentas Claras MVP

## Objetivo

Este documento define las estructuras de datos, claves de almacenamiento, identificadores, estados, convenciones, plan de cuentas, reglas de asiento y reglas de negocio mínimas que deberá respetar el prototipo del sistema de gestión contable digital.

El propósito es evitar cambios posteriores innecesarios y permitir que cada módulo trabaje sobre una base estable, incluyendo el ciclo contable completo (Fases 5 a 9).

> Principio rector: las transacciones son el documento fuente; el Libro Diario convierte cada transacción en asiento de doble entrada; el Libro Mayor, la Balanza y los Estados Financieros se DERIVAN del diario y no se guardan duplicados. Solo se persisten: catálogo de cuentas, asientos, líneas de asiento, activos fijos, impuestos, obligaciones, alertas, reportes, snapshots opcionales, bitácora y configuración.

---

## Idioma de datos

- Textos visibles para el usuario: español.
- Claves técnicas, nombres de colección, identificadores internos y campos JSON: se mantienen en formato técnico, sin tildes y en camelCase simple para compatibilidad con JavaScript.
- Valores de estado, tipo de negocio, régimen tributario, tipo de cuenta, naturaleza y mensajes pueden estar en español.

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

Las fechas y horas de bitácora y snapshots se almacenan en formato ISO con hora:

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

Los montos contables se redondean a 2 decimales en el motor de asientos (`round2`).

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
| Cuenta del plan | `ACC` | `ACC-0001` |
| Asiento de diario | `JE` | `JE-0001` |
| Línea de asiento | `JL` | `JL-0001` |
| Activo fijo | `FA` | `FA-0001` |
| Snapshot financiero | `FS` | `FS-0001` |

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
  "LOG": 30,
  "ACC": 30,
  "JE": 20,
  "JL": 60,
  "FA": 2,
  "FS": 1
}
```

---

## Claves de LocalStorage

Todas las claves técnicas usan el prefijo:

```text
cc_
```

| Clave | Contenido | Fase |
|---|---|:--:|
| `cc_storage_version` | Versión del esquema de datos | 1 |
| `cc_session` | Sesión activa simulada | 1 |
| `cc_users` | Usuarios del sistema | 1 |
| `cc_clients` | Clientes microempresarios | 2 |
| `cc_periods` | Periodos contables | 2 |
| `cc_documents` | Documentos de respaldo contable | 3 |
| `cc_transactions` | Transacciones contables (documento fuente) | 3 |
| `cc_taxes` | Impuestos calculados | 4 |
| `cc_obligations` | Obligaciones tributarias generadas | 4 |
| `cc_accounts` | Plan de cuentas / catálogo contable | 5 |
| `cc_journal_entries` | Asientos del Libro Diario (cabecera) | 5 |
| `cc_journal_lines` | Líneas de asiento (débito/crédito) | 5 |
| `cc_fixed_assets` | Activos fijos para depreciación | 7 |
| `cc_financial_snapshots` | Instantáneas de EE.FF. e indicadores | 8 |
| `cc_alerts` | Alertas tributarias y operativas | 10 |
| `cc_reports` | Reportes mensuales generados | 11 |
| `cc_logs` | Bitácora de acciones | 1 |
| `cc_settings` | Configuración general | 1 |
| `cc_counters` | Contadores de identificadores | 1 |

Versión inicial del esquema:

```json
{
  "storageVersion": 2
}
```

> La versión sube a 2 porque se agregan colecciones contables. El importador debe aceptar respaldos versión 1 (sin colecciones nuevas) y completarlas con vacíos, para no romper respaldos antiguos.

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
  "capitalInicial": 5000,
  "costosFijosMensuales": 800,
  "estado": "activo",
  "fechaAlta": "2026-10-01",
  "observacion": "Cliente piloto de referencia."
}
```

Campos nuevos (opcionales, no rompen datos existentes):

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `capitalInicial` | número | no | Aporte del propietario; base para asiento de apertura y patrimonio inicial |
| `costosFijosMensuales` | número | no | Suma de gastos fijos estimados; usado en punto de equilibrio (Fase 9) |

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
  "closingEntryId": null,
  "closedAt": null,
  "observacion": "Periodo mensual en captura."
}
```

Campos nuevos (opcionales):

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `closingEntryId` | texto o null | no | ID del asiento de cierre generado (Fase 8) |
| `closedAt` | fecha-hora o null | no | Momento exacto del cierre contable |

Estados permitidos:

```text
abierto
en_revision
cerrado
```

Regla:

- No debe existir más de un periodo activo para el mismo cliente, mismo mes y mismo año.
- Un periodo cerrado no admite creación ni edición de documentos, transacciones ni asientos.
- La reapertura de un periodo debe registrarse en bitácora y limpiar `closingEntryId` y `closedAt`.

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
  "journalEntryId": null,
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

Campo nuevo (opcional):

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `journalEntryId` | texto o null | no | Asiento generado automáticamente desde esta transacción (Fase 5). Permite evitar duplicados al recalcular y da trazabilidad inversa |

Campos existentes:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `clienteId` | texto | sí | Cliente relacionado |
| `periodoId` | texto | sí | Periodo relacionado |
| `documentoId` | texto o null | no | Documento vinculado |
| `fecha` | fecha | sí | Fecha de la operación |
| `tipo` | texto | sí | Tipo de transacción |
| `cuenta` | texto | sí | Cuenta contable simplificada (nombre) |
| `monto` | número | sí | Monto de la operación (base, sin IVA desglosado) |
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
- Para corregir un error, se anula la transacción y se anula/regenera su asiento.
- No se permiten transacciones en periodo cerrado.
- El `monto` almacenado es la **base imponible** (sin IVA). El IVA se desglosa en el asiento según régimen (ver reglas de asiento).

---

## Colección: plan de cuentas (catálogo contable)

Guardada en:

```text
cc_accounts
```

Se inicializa desde `config.accountCatalog` ampliado en el seed. Permite asiento manual y futura edición.

Estructura:

```json
{
  "id": "ACC-0001",
  "codigo": "1.1.01",
  "nombre": "Caja",
  "tipo": "activo",
  "naturaleza": "deudora",
  "esTemporal": false,
  "esContra": false,
  "nivel": 3,
  "codigoPadre": "1.1",
  "estado": "activa",
  "observacion": "Efectivo en mano del comerciante"
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `codigo` | texto | sí | Código jerárquico `clase.subclasa.cuenta` |
| `nombre` | texto | sí | Nombre de la cuenta |
| `tipo` | texto | sí | `activo`, `pasivo`, `patrimonio`, `ingreso`, `costo`, `gasto` |
| `naturaleza` | texto | sí | `deudora` o `acreedora` (saldo normal) |
| `esTemporal` | booleano | sí | `true` si se cierra al final del periodo (ingresos, costos, gastos, resultados del ejercicio) |
| `esContra` | booleano | sí | `true` si es cuenta compensadora (ej. depreciación acumulada) |
| `nivel` | número | sí | 1 = clase, 2 = subclase, 3 = cuenta contable |
| `codigoPadre` | texto | no | Código de la subclase o clase superior |
| `estado` | texto | sí | `activa` o `inactiva` |
| `observacion` | texto | no | Notas |

Reglas:

- Solo las cuentas de `nivel: 3` admiten movimientos en asientos.
- Las cuentas de nivel 1 y 2 son de agrupación para balanza y EE.FF.
- Una cuenta con movimientos no se elimina; se inactiva.
- El código debe ser único.

### Plan de cuentas base para microempresa comercial

Se define el siguiente catálogo inicial (nivel 3, movible). Las cuentas de nivel 1 y 2 existen como agrupadores.

```text
1  ACTIVO
  1.1  Activo corriente
    1.1.01  Caja                                   (deudora)
    1.1.02  Bancos                                 (deudora)
    1.1.03  Clientes / Cuentas por cobrar          (deudora)
    1.1.04  Inventario de mercancías               (deudora)
    1.1.05  IVA Crédito Fiscal                     (deudora)
    1.1.06  Otras cuentas por cobrar               (deudora)
  1.2  Activo no corriente
    1.2.01  Mobiliario y equipo                    (deudora)
    1.2.02  Depreciación acumulada                 (acreedora, esContra=true)
    1.2.03  Intangibles                            (deudora)

2  PASIVO
  2.1  Pasivo corriente
    2.1.01  Proveedores / Cuentas por pagar        (acreedora)
    2.1.02  IVA Débito Fiscal                      (acreedora)
    2.1.03  Impuestos por pagar (IT, RC-IVA, IUE)  (acreedora)
    2.1.04  Sueldos y salarios por pagar           (acreedora)
    2.1.05  Otros pasivos corrientes               (acreedora)
  2.2  Pasivo no corriente
    2.2.01  Préstamos a largo plazo                (acreedora)

3  PATRIMONIO
  3.1.01  Capital / Aportes del propietario        (acreedora)
  3.1.02  Resultados acumulados                    (acreedora)
  3.1.03  Resultados del ejercicio                 (acreedora, esTemporal=true)

4  INGRESOS
  4.1.01  Ventas                                   (acreedora, esTemporal=true)
  4.1.02  Otros ingresos                           (acreedora, esTemporal=true)

5  COSTOS
  5.1.01  Compras / Costo de ventas                (deudora, esTemporal=true)
  5.1.02  Devoluciones y descuentos sobre compras  (acreedora, esTemporal=true, esContra=true)

6  GASTOS
  6.1.01  Gastos de administración                 (deudora, esTemporal=true)
  6.1.02  Gastos de venta                          (deudora, esTemporal=true)
  6.1.03  Gastos financieros                        (deudora, esTemporal=true)
  6.1.04  Depreciación y amortización              (deudora, esTemporal=true)
  6.1.05  Otros gastos                             (deudora, esTemporal=true)
```

Mapeo de `cuenta` (nombre) de transacción → código de plan:

| Valor en `transaccion.cuenta` | Código de plan |
|---|---|
| Caja | 1.1.01 |
| Bancos | 1.1.02 |
| Cuentas por cobrar | 1.1.03 |
| Inventario | 1.1.04 |
| Cuentas por pagar | 2.1.01 |
| Impuestos por pagar | 2.1.03 |
| Capital | 3.1.01 |
| Ventas | 4.1.01 |
| Costo de ventas | 5.1.01 |
| Alquiler | 6.1.01 |
| Servicios básicos | 6.1.01 |
| Transporte | 6.1.02 |
| Otros gastos | 6.1.05 |

> Si una transacción usa un nombre no mapeado, el motor de asiento usa la cuenta genérica de su tipo (gasto → 6.1.05, ingreso → 4.1.02, etc.) y registra una advertencia en bitácora.

---

## Colección: asientos del Libro Diario (cabecera)

Guardada en:

```text
cc_journal_entries
```

Estructura:

```json
{
  "id": "JE-0001",
  "folio": "D-0001",
  "clienteId": "CLI-0001",
  "periodoId": "PER-0001",
  "fecha": "2026-10-05",
  "tipoAsiento": "operacion",
  "categoriaAjuste": null,
  "origen": "automatico",
  "transaccionId": "TRX-0001",
  "documentoId": "DOC-0001",
  "descripcion": "Venta mostrador",
  "estado": "vigente",
  "fechaCreacion": "2026-10-31T10:00:00",
  "usuarioId": "USR-0001",
  "observacion": ""
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `folio` | texto | sí | Folio visible del diario, formato `D-0001` |
| `clienteId` | texto | sí | Cliente del asiento |
| `periodoId` | texto | sí | Periodo contable |
| `fecha` | fecha | sí | Fecha del asiento (dentro del periodo) |
| `tipoAsiento` | texto | sí | `operacion`, `ajuste`, `cierre`, `apertura` |
| `categoriaAjuste` | texto o null | no | Solo si `tipoAsiento=ajuste` |
| `origen` | texto | sí | `automatico` (desde transacción) o `manual` |
| `transaccionId` | texto o null | no | Transacción fuente si es automático |
| `documentoId` | texto o null | no | Documento de respaldo |
| `descripcion` | texto | sí | Glosa del asiento |
| `estado` | texto | sí | `vigente` o `anulado` |
| `fechaCreacion` | fecha-hora | sí | Momento de generación |
| `usuarioId` | texto | sí | Usuario que lo creó |
| `observacion` | texto | no | Notas |

Tipos de asiento permitidos:

```text
operacion
ajuste
cierre
apertura
```

Categorías de ajuste permitidas:

```text
depreciacion
amortizacion
provision
devengado
reclasificacion
inventario_final
inventario_inicial
otro
```

Origen permitido:

```text
automatico
manual
```

Estado permitido:

```text
vigente
anulado
```

Reglas:

- Todo asiento debe cuadrar: Σ débitos de sus líneas = Σ créditos de sus líneas.
- Un asiento no se elimina físicamente; se anula (`estado=anulado`) y, si corresponde, se regenera.
- No se crean asientos en periodo cerrado.
- Los asientos `automatico` vinculados a una transacción se regeneran si la transacción cambia o se anula (el motor borra el asiento viejo y crea uno nuevo, o lo anula y crea corrección; criterio: anular + recrear para mantener trazabilidad).
- El folio `D-XXXX` es correlativo por cliente y periodo, independiente del ID interno.

---

## Colección: líneas de asiento

Guardada en:

```text
cc_journal_lines
```

Estructura:

```json
{
  "id": "JL-0001",
  "asientoId": "JE-0001",
  "clienteId": "CLI-0001",
  "periodoId": "PER-0001",
  "cuentaCodigo": "1.1.01",
  "cuentaNombre": "Caja",
  "debito": 282.5,
  "credito": 0,
  "tercero": "Cliente general",
  "referencia": "TRX-0001",
  "observacion": ""
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `asientoId` | texto | sí | Asiento al que pertenece |
| `clienteId` | texto | sí | Cliente (denormalizado para filtrar rápido) |
| `periodoId` | texto | sí | Periodo (denormalizado) |
| `cuentaCodigo` | texto | sí | Código de cuenta del plan (nivel 3) |
| `cuentaNombre` | texto | sí | Nombre de la cuenta (denormalizado) |
| `debito` | número | sí | Monto debitado (0 si no aplica) |
| `credito` | número | sí | Monto acreditado (0 si no aplica) |
| `tercero` | texto | no | Tercero relacionado |
| `referencia` | texto | no | ID de transacción/documento de origen |
| `observacion` | texto | no | Notas |

Reglas:

- Una línea tiene débito o crédito, nunca ambos simultáneos (uno será 0).
- Ambas cifras ≥ 0.
- La suma de débitos del asiento = suma de créditos del asiento.
- `cuentaCodigo` debe existir en `cc_accounts` y ser de nivel 3 y estado `activa`.
- Las líneas no se editan sueltas: se edita el asiento completo (se reemplazan sus líneas) o se anula y recrea.

---

## Colección: activos fijos

Guardada en:

```text
cc_fixed_assets
```

Estructura:

```json
{
  "id": "FA-0001",
  "clienteId": "CLI-0001",
  "descripcion": "Freezer comercial",
  "categoria": "mobiliario_equipo",
  "cuentaActivo": "1.2.01",
  "cuentaDepreciacion": "1.2.02",
  "cuentaGastoDepreciacion": "6.1.04",
  "fechaAdquisicion": "2026-01-15",
  "costoAdquisicion": 4500,
  "valorResidual": 500,
  "vidaUtilMeses": 48,
  "depreciacionMensual": 83.33,
  "depreciacionAcumulada": 0,
  "estado": "activo",
  "observacion": ""
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `clienteId` | texto | sí | Cliente dueño del activo |
| `descripcion` | texto | sí | Descripción del bien |
| `categoria` | texto | sí | `mobiliario_equipo`, `vehiculo`, `equipoComputo`, `otro` |
| `cuentaActivo` | texto | sí | Código de cuenta de activo (1.2.01) |
| `cuentaDepreciacion` | texto | sí | Código de depreciación acumulada (1.2.02) |
| `cuentaGastoDepreciacion` | texto | sí | Código de gasto por depreciación (6.1.04) |
| `fechaAdquisicion` | fecha | sí | Fecha de alta del bien |
| `costoAdquisicion` | número | sí | Valor original |
| `valorResidual` | número | sí | Valor de rescate estimado |
| `vidaUtilMeses` | número | sí | Vida útil en meses |
| `depreciacionMensual` | número | sí | Calculada: (costo − residual) / vidaUtilMeses, redondeada a 2 |
| `depreciacionAcumulada` | número | sí | Suma de depreciaciones registradas |
| `estado` | texto | sí | `activo`, `dado_baja`, `vendido` |
| `observacion` | texto | no | Notas |

Regla de depreciación (método lineal simple):

```text
depreciacionMensual = round2((costoAdquisicion - valorResidual) / vidaUtilMeses)
```

El ajuste de depreciación del periodo genera asiento:

```text
Débito  6.1.04  Depreciación y amortización     (depreciacionMensual)
Crédito 1.2.02  Depreciación acumulada          (depreciacionMensual)
```

No se deprecia si el activo está en `dado_baja` o `vendido`, ni si ya se depreció el costo total.

---

## Colección: instantáneas financieras (snapshots)

Guardada en:

```text
cc_financial_snapshots
```

Estructura:

```json
{
  "id": "FS-0001",
  "clienteId": "CLI-0001",
  "periodoId": "PER-0001",
  "tipo": "estado_resultados",
  "fechaGeneracion": "2026-10-31T18:00:00",
  "usuarioId": "USR-0001",
  "contenido": {},
  "estado": "generado"
}
```

Campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | sí | Identificador único |
| `clienteId` | texto | sí | Cliente |
| `periodoId` | texto | sí | Periodo |
| `tipo` | texto | sí | `estado_resultados`, `balance`, `balanza`, `balanza_ajustada`, `indicadores` |
| `fechaGeneracion` | fecha-hora | sí | Momento de generación |
| `usuarioId` | texto | sí | Usuario que lo generó |
| `contenido` | objeto | sí | Datos resumidos del estado en ese momento |
| `estado` | texto | sí | `generado`, `anulado` |

Regla:

- El snapshot es **opcional y de evidencia**. La fuente de verdad sigue siendo el diario.
- Se genera al emitir EE.FF. o al cerrar el periodo, para que el reporte mensual (Fase 11) y la defensa académica tengan una copia congelada del resultado.
- Si se reabre el periodo y se recalculan EE.FF., se genera un nuevo snapshot; el anterior queda como histórico (no se borra).

---

## Colección: impuestos

Guardada en:

```text
cc_taxes
```

(Estructura sin cambios respecto a Fase 4; se conserva íntegra.)

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

(Estructura sin cambios respecto a Fase 4; se conserva íntegra.)

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

---

## Colección: alertas

Guardada en:

```text
cc_alerts
```

(Estructura sin cambios respecto a lo planeado en Fase 10; se conserva íntegra.)

```json
{
  "id": "ALR-0001",
  "clienteId": "CLI-0001",
  "periodoId": "PER-0001",
  "obligacionId": "OBL-0001",
  "asientoId": null,
  "tipo": "vencimiento_tributario",
  "nivel": "preventiva",
  "titulo": "Vencimiento IVA próximo",
  "mensaje": "La declaración de IVA vence el 20/11/2026.",
  "fechaAlerta": "2026-11-13",
  "estado": "pendiente"
}
```

Campo nuevo (opcional):

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `asientoId` | texto o null | no | Asiento relacionado (ej. alerta por transacción sin asiento, Fase 10) |

Tipos permitidos:

```text
vencimiento_tributario
documento_pendiente
periodo_sin_cerrar
transaccion_sin_documento
transaccion_sin_asiento
impuesto_no_calculado
balanza descuadrada
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

- No deben generarse alertas duplicadas para la misma entidad, mismo tipo y mismo periodo si ya existe una alerta pendiente o vista.

---

## Colección: reportes

Guardada en:

```text
cc_reports
```

(Estructura sin cambios respecto a lo planeado en Fase 11; se conserva íntegra.)

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
  "snapshotId": null,
  "archivoNombre": "reporte-cli001-oct2026.pdf",
  "estado": "generado"
}
```

Campo nuevo (opcional):

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `snapshotId` | texto o null | no | Snapshot financiero asociado (Fase 8), para que el reporte consuma datos congelados |

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
2. Estados financieros simplificados (EE.RR. y Balance)
3. Impuestos estimados
4. Costos y rentabilidad
5. Documentos pendientes
6. Alertas
7. Recomendaciones
8. Próximo paso
```

El reporte debe usar lenguaje sencillo para el microempresario.

---

## Colección: bitácora

Guardada en:

```text
cc_logs
```

(Estructura sin cambios; se conservan íntegros los campos.)

```json
{
  "id": "LOG-0001",
  "usuarioId": "USR-0001",
  "accion": "crear_asiento",
  "entidad": "journal_entries",
  "registroId": "JE-0002",
  "fecha": "2026-10-18T10:30:00",
  "detalle": "Asiento automático desde TRX-0001"
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

Acciones sugeridas (se agregan las contables):

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
crear_asiento
editar_asiento
anular_asiento
generar_asientos_automaticos
crear_ajuste
anular_ajuste
crear_activo_fijo
depreciar_activo
generar_estado_resultados
generar_balance
generar_cierre
exportar_respaldo
importar_respaldo
cargar_seed
restablecer_sistema
generar_alerta
marcar_alerta_vista
resolver_alerta
generar_reporte
```

Entidades sugeridas (se agregan las contables):

```text
users
clients
periods
documents
transactions
taxes
obligations
accounts
journal_entries
journal_lines
fixed_assets
financial_snapshots
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

Estructura ampliada:

```json
{
  "appName": "Cuentas Claras MVP",
  "appVersion": "0.2.0",
  "storageVersion": 2,
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
  "depreciationMethod": "lineal_simple",
  "inventoryMethod": "periodico_simplificado",
  "seedLoaded": false,
  "lastBackupAt": null,
  "professionalDisclaimer": "Este sistema no sustituye la firma de un Contador Público Autorizado cuando la normativa lo exija."
}
```

Campos nuevos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `depreciationMethod` | texto | sí | Método de depreciación; MVP usa `lineal_simple` |
| `inventoryMethod` | texto | sí | Método de inventario; MVP usa `periodico_simplificado` |

---

## Colección: sesión

Guardada en:

```text
cc_session
```

(Estructura sin cambios; se conserva íntegra.)

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

Advertencia:

- La sesión es simulada.
- No es seguridad real de producción.
- Sirve para demostrar control de acceso básico.

---

## Formato de respaldo JSON

El respaldo exportado deberá tener esta estructura (versión 2):

```json
{
  "app": "Cuentas Claras MVP",
  "version": 2,
  "exportedAt": "2026-10-18T12:00:00",
  "data": {
    "users": [],
    "clients": [],
    "periods": [],
    "documents": [],
    "transactions": [],
    "taxes": [],
    "obligations": [],
    "accounts": [],
    "journalEntries": [],
    "journalLines": [],
    "fixedAssets": [],
    "financialSnapshots": [],
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
- Aceptar `version` 1 (sin colecciones contables) completándolas con vacíos.
- No importar si hay errores graves de estructura.
- Preguntar al usuario si desea reemplazar datos actuales.
- Registrar acción en bitácora.
- Tras importar, recalcular contadores de ID para no duplicar.

---

## Reglas de asiento automático (motor contable, Fase 5)

Estas reglas las codificará `js/modules/contabilidad.js`. Se documentan aquí para que no haya ambigüedad.

### Mapeo forma de pago → cuenta de contrapartida de efectivo

| `formaPago` | Venta (cobranza) | Compra/Gasto (pago) |
|---|---|---|
| `efectivo` | 1.1.01 Caja | 1.1.01 Caja |
| `banco` / `transferencia` / `tarjeta` | 1.1.02 Bancos | 1.1.02 Bancos |
| `credito` | 1.1.03 Clientes / Cuentas por cobrar | 2.1.01 Proveedores / Cuentas por pagar |
| `otro` / vacío | 1.1.01 Caja | 1.1.01 Caja |

### Asiento de VENTA

**Régimen General** (base = `monto`, iva = round2(monto * 0.13), total = base + iva):

```text
Débito  <cuenta efectivo/credito>   total
Crédito 4.1.01 Ventas               base
Crédito 2.1.02 IVA Débito Fiscal    iva
```

**Régimen Simplificado**:

```text
Débito  <cuenta efectivo/credito>   monto
Crédito 4.1.01 Ventas               monto
```

### Asiento de COMPRA (mercancía)

**Régimen General** (base = `monto`, iva = round2(monto * 0.13), total = base + iva):

```text
Débito  5.1.01 Compras / Costo de ventas   base
Débito  1.1.05 IVA Crédito Fiscal          iva
Crédito <cuenta efectivo/credito>          total
```

**Régimen Simplificado**:

```text
Débito  5.1.01 Compras / Costo de ventas   monto
Crédito <cuenta efectivo/credito>          monto
```

> Nota: por método periódico simplificado, la compra va a costo/compras (5.1.01), no a inventario. El inventario se ajusta al cierre con asientos de ajuste (Fase 7/8).

### Asiento de GASTO

```text
Débito  <cuenta de gasto mapeada>   monto
Crédito <cuenta efectivo/credito>   monto
```

La cuenta de gasto se obtiene mapeando `transaccion.cuenta` (nombre) → código del plan. Si no hay mapeo, se usa 6.1.05 Otros gastos y se registra advertencia.

### Asiento de INGRESO (operacional no-venta)

```text
Débito  <cuenta efectivo/credito>   monto
Crédito 4.1.02 Otros ingresos       monto
```

> Aportes de capital y hechos patrimoniales NO se registran como transacción “ingreso”; se hacen con **asiento manual** (Débito Caja/Bancos, Crédito 3.1.01 Capital).

### Asiento de APERTURA (inicio de operaciones)

Generado manualmente o por plantilla al crear el primer periodo:

```text
Débito  1.1.01 Caja / 1.1.02 Bancos / 1.1.04 Inventario   (según activos iniciales)
Crédito 3.1.01 Capital                                     (total activos − pasivos iniciales)
Crédito 2.1.01 Proveedores                                 (pasivos iniciales, si hay)
```

### Validaciones del motor

- Cada asiento debe cuadrar (Σ débito = Σ crédito) antes de guardarse.
- No se generan asientos duplicados: si `transaccion.journalEntryId` ya existe, el motor anula el asiento viejo y crea uno nuevo (trazabilidad), en vez de sumar otro.
- No se generan asientos para transacciones `anulada`.
- No se generan asientos en periodo `cerrado`.
- Las fechas de líneas heredan la fecha del asiento y caen dentro del periodo.

---

## Reglas de derivación (Mayor, Balanza, EE.FF.)

- **Libro Mayor** (Fase 6): se calcula recorriendo `cc_journal_lines` filtradas por cliente y rango de periodos. Para cada cuenta: saldo inicial (sumatoria de periodos anteriores), movimientos del periodo (débitos y créditos), saldo final deudor/acreedor según naturaleza. No se persiste; es vista.
- **Balanza de comprobación** (Fase 6): por cada cuenta nivel 3, suma débitos y créditos del periodo; saldo = débitos − créditos (o inverso según naturaleza). Total débitos debe = total créditos. Vista calculada.
- **Balanza ajustada** (Fase 7): balanza de comprobación + líneas de asientos `tipoAsiento=ajuste` del periodo. Vista calculada.
- **Estado de Resultados** (Fase 8): se construye desde saldos de cuentas temporales (tipos ingreso, costo, gasto) de la balanza ajustada. Estructura: Ventas − Costo de ventas = Utilidad bruta; − Gastos operativos = Utilidad operativa; − Impuestos estimados = Utilidad neta. Vista calculada + snapshot opcional.
- **Balance General** (Fase 8): se construye desde saldos de cuentas permanentes (activo, pasivo, patrimonio) de la balanza ajustada, más la utilidad del periodo llevada a 3.1.03 Resultados del ejercicio. Verificación: Activo = Pasivo + Patrimonio. Vista calculada + snapshot opcional.
- **Asientos de cierre** (Fase 8): cierran cuentas temporales contra 3.1.03, y luego 3.1.03 contra 3.1.02 Resultados acumulados. Generan asientos `tipoAsiento=cierre` y marcan el periodo `cerrado` con `closingEntryId`.

> Regla de oro: si cambia un asiento del diario, mayor, balanza y EE.FF. se recalculan solos al volver a abrir la vista. Nunca se edita un saldo de mayor o balanza a mano.

---

## Reglas de negocio mínimas (consolidadas)

### Regla 1: Cliente

- Un cliente puede tener muchos periodos.
- Un cliente inactivo no debería permitir abrir nuevos periodos.
- No se eliminan clientes con historial; se desactivan.

### Regla 2: Periodo

- Todo periodo pertenece a un cliente.
- No debe existir más de un periodo abierto o en revisión para el mismo cliente, mes y año.
- Un periodo cerrado bloquea creación y edición de documentos, transacciones y asientos.
- Reabrir un periodo debe quedar registrado en bitácora y limpiar datos de cierre.

### Regla 3: Documento

- Todo documento pertenece a un cliente y un periodo.
- Un documento rechazado no debería alimentar cálculos tributarios ni asientos hasta ser corregido o validado.

### Regla 4: Transacción

- Toda transacción pertenece a un cliente y un periodo.
- Puede vincularse opcionalmente a un documento.
- No se elimina físicamente; se anula.
- No se registran transacciones en periodo cerrado.
- El monto debe ser mayor que cero y representa la base imponible.
- La fecha debe corresponder al periodo.

### Regla 5: Asiento contable

- Todo asiento cuatra (Σ débito = Σ crédito).
- No se elimina; se anula.
- No se crean en periodo cerrado.
- El asiento automático se regenera (anular + recrear) si su transacción fuente cambia.
- El asiento manual valida que las cuentas existan, sean nivel 3 y estén activas.

### Regla 6: Impuestos

- El cálculo se realiza por cliente y periodo.
- El cálculo es informativo.
- Debe guardarse fecha de cálculo.
- Debe impedir o advertir cálculo en periodo cerrado sin autorización.

### Regla 7: Obligaciones

- Se generan a partir de impuestos calculados.
- Deben tener fecha de vencimiento referencial.
- El estado inicial será `pendiente`.
- No se modifican obligaciones `pagada` o `anulada`.

### Regla 8: Ajustes

- Todo ajuste es un asiento con `tipoAsiento=ajuste` y `categoriaAjuste` definida.
- Los ajustes cuatrán como cualquier asiento.
- Se pueden anular con trazabilidad.
- La depreciación usa `cc_fixed_assets` y método lineal simple.

### Regla 9: Estados Financieros

- Se derivan de la balanza ajustada.
- Activo debe = Pasivo + Patrimonio en el Balance.
- La utilidad del EE.RR. debe coincidir con el movimiento en patrimonio del periodo.
- Se emiten con disclaimer profesional visible.
- Pueden congelarse como snapshot para evidencia.

### Regla 10: Cierre

- El cierre genera asientos `tipoAsiento=cierre` y marca el periodo `cerrado`.
- Tras el cierre, no se admiten nuevos asientos salvo reapertura con bitácora.
- El cierre no descuadra la balanza.

### Regla 11: Seguridad y ética

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
CLI-0001 Tienda Doña Rosa (Régimen General, capitalInicial 5000, costosFijosMensuales 800)
CLI-0002 Ferretería San Luis (Régimen General, capitalInicial 12000, costosFijosMensuales 1500)
CLI-0003 Abarrotes La Esquina (Régimen Simplificado, capitalInicial 3000, costosFijosMensuales 400)
```

Periodos:

```text
PER-0001 CLI-0001 octubre 2026 abierto
PER-0002 CLI-0002 octubre 2026 en_revision
PER-0003 CLI-0003 octubre 2026 cerrado
```

Plan de cuentas:

```text
Se carga completo desde config.accountCatalog ampliado (ver sección Plan de cuentas base).
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

Activos fijos demo (para Fase 7):

```text
FA-0001 CLI-0002 Freezer comercial, costo 4500, residual 500, vida 48 meses
FA-0002 CLI-0001 Computadora de caja, costo 3500, residual 500, vida 36 meses
```

---

## Criterio de aceptación del contrato de datos versión 2

Este documento se considera aprobado cuando:

- define todas las colecciones mínimas, incluidas las contables;
- define claves de LocalStorage y prefijos de ID nuevos (ACC, JE, JL, FA, FS);
- define el plan de cuentas base con naturaleza y temporalidad;
- define las reglas de asiento automático por tipo y régimen;
- define la derivación de Mayor, Balanza y EE.FF. desde el diario;
- define reglas de cierre, ajustes y depreciación;
- define el formato de respaldo versión 2 con compatibilidad hacia atrás;
- permite iniciar Fase 5 sin cambiar estructuras principales.
```

---

# Qué cambió y qué NO cambió (tu tranquilidad)

| Elemento | Cambio |
|---|---|
| Fases 0–4 (código ya hecho) | ❌ No se toca |
| Colecciones viejas (users, clients, periods, documents, transactions, taxes, obligations, alerts, reports, logs, settings, session) | ✅ Se conservan; solo se **suman** campos opcionales (`capitalInicial`, `costosFijosMensuales`, `closingEntryId`, `closedAt`, `journalEntryId`, `asientoId`, `snapshotId`) |
| `storageVersion` | 1 → 2 (el importador acepta v1) |
| Nuevas colecciones | `cc_accounts`, `cc_journal_entries`, `cc_journal_lines`, `cc_fixed_assets`, `cc_financial_snapshots` |
| Nuevos prefijos ID | `ACC`, `JE`, `JL`, `FA`, `FS` |
| Plan de cuentas | Se amplía con códigos jerárquicos, naturaleza, temporalidad y contra-cuentas |
| Reglas de asiento | Se documentan para que Fase 5 las codifique sin ambigüedad |
| Derivación Mayor/Balanza/EE.FF. | Se fija como **vista calculada**, no colección duplicada |

Nada de lo que ya funciona se rompe. Los campos nuevos son opcionales, así que los datos semilla y las pantallas existentes siguen válidos.

---

# Siguiente paso

Con el contrato cerrado en versión 2, ya podemos arrancar **Fase 5: Catálogo de cuentas + Libro Diario** sin retrocesos.

Esa fase entregará, completos y de una vez:

```text
js/config.js            (accountCatalog ampliado + journalRules + mapeo cuenta->código)
js/data/seed.js         (cuentas del plan + asientos demo + activos fijos demo)
js/modules/contabilidad.js   (motor: transaccion -> asiento, cuadratura, regeneración)
libro-diario.html
js/modules/libro-diario.js
js/layout.js            (habilita ruta libro-diario)
```

Dime:

```text
Arranca Fase 5
```

y te paso el lote completo, archivo por archivo, como venimos haciendo.