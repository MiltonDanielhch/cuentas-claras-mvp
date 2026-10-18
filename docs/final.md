Perfecto. Vamos con **Fase 17: Empaque final para entrega, defensa y sustentación académica**.

Esta fase **no agrega más código funcional**. Su misión es convertir todo lo construido en un paquete profesional, verificable y listo para entregar al C.E.A. Santísima Trinidad, defender ante tribunal y dejar evidencia sólida del proyecto.

Con esta fase ya tendrás:

- repositorio público ordenado y etiquetado;
- `README.md` profesional en la raíz del proyecto;
- documentación de empaque final en `docs/EMPAQUE-FINAL.md`;
- carpeta de entrega estructurada para el CEA;
- checklist maestro de evidencia;
- guion final de defensa de 15 minutos;
- guion de video de respaldo;
- lista de anexos actualizada;
- plan B técnico;
- manifiesto de entrega con hashes opcionales;
- cierre formal del proyecto.

> Esta es la fase donde el proyecto deja de ser “un sistema que funciona” y se convierte en **una entrega académica completa, documentada, verificable y defendible**.

---

# Objetivo de la Fase 17

Cerrar el proyecto con un empaque que permita responder, ante el tribunal, a cuatro preguntas clave:

1. **¿Qué problema resolvieron?**
2. **¿Qué modelo diseñaron?**
3. **¿Qué prototipo implementaron?**
4. **¿Cómo pueden verificarlo?**

La respuesta debe ser:

> Diseñamos e implementamos un modelo de gestión contable digital para microempresas comerciales de Trinidad, Beni, con un prototipo web estático que evidencia un ciclo contable simplificado completo, control documental, alertas preventivas, estados financieros informativos, reporte mensual en lenguaje sencillo, respaldo JSON, bitácora, documentación técnica y despliegue público verificable en GitHub Pages.

---

# Archivos de esta fase

## 1. Crear o reemplazar en la raíz del repositorio

```text
README.md
```

Este es el README público del repositorio. Sirve para que cualquier evaluador entienda el proyecto apenas entre a GitHub.

## 2. Crear este archivo de documentación

```text
docs/EMPAQUE-FINAL.md
```

Este archivo concentra el checklist maestro de entrega.

## 3. Opcional pero recomendado

```text
docs/MANIFIESTO-ENTREGA.md
```

Sirve para dejar evidencia formal de archivos, hashes y versión entregada.

## 4. Preparar carpeta local de entrega

```text
ENTREGA_CUENTAS_CLARAS/
```

No necesariamente va en GitHub; puede ser la carpeta que entregan al CEA en USB, Drive o impreso.

---

# 1. Crear o reemplazar `README.md` en la raíz

Ruta:

```text
README.md
```

Pega este contenido completo:

```markdown
# Cuentas Claras – Gestión Contable Digital

**Prototipo académico de modelo de gestión contable digital para microempresas comerciales de Trinidad, Beni, Bolivia.**

![Estado](https://img.shields.io/badge/estado-prototipo%20académico-blue)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JavaScript%20%7C%20Bootstrap-green)
![Almacenamiento](https://img.shields.io/badge/datos-LocalStorage-orange)
![Despliegue](https://img.shields.io/badge/host-GitHub%20Pages-brightgreen)

---

## 1. Presentación

**Cuentas Claras** es un prototipo académico desarrollado para optar al título de **Técnico Medio en Contabilidad** en el **Centro de Educación Alternativa “Santísima Trinidad”**, Trinidad, Beni, Bolivia.

El proyecto propone un modelo de gestión contable digital para microempresas comerciales, apoyado en un sistema computarizado que permite:

- registrar clientes, periodos, documentos y transacciones;
- controlar documentos de respaldo;
- calcular impuestos informativos de IVA e IT;
- generar Libro Diario con asientos de doble entrada;
- derivar Libro Mayor y Balanza de comprobación;
- registrar ajustes contables;
- emitir balanza ajustada;
- generar Estados Financieros simplificados;
- realizar cierre contable trazable;
- calcular costos, márgenes, punto de equilibrio e indicadores;
- emitir alertas tributarias y operativas;
- generar reportes mensuales en lenguaje sencillo;
- exportar e importar respaldos JSON;
- mantener bitácora de acciones;
- consultar ayuda, glosario y límites legales;
- desplegar el prototipo en GitHub Pages;
- verificar técnicamente el despliegue mediante una página de diagnóstico.

---

## 2. Enlace público

URL pública del prototipo:

```text
https://TU-USUARIO.github.io/TU-REPOSITORIO/
```

Página de documentación técnica:

```text
https://TU-USUARIO.github.io/TU-REPOSITORIO/documentacion.html
```

Página de verificación de despliegue:

```text
https://TU-USUARIO.github.io/TU-REPOSITORIO/prueba-despliegue.html
```

> Reemplaza `TU-USUARIO` y `TU-REPOSITORIO` por los datos reales antes de entregar.

---

## 3. Credenciales de demostración

El prototipo usa autenticación demostrativa para fines académicos.

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin123` | Administrador |
| `contador` | `Contador123` | Contador |

---

## 4. Cómo ejecutar localmente

### Opción recomendada: Visual Studio Code + Live Server

1. Abrir la carpeta del proyecto en VS Code.
2. Instalar la extensión **Live Server**.
3. Hacer clic derecho sobre `index.html`.
4. Seleccionar **Open with Live Server**.
5. El navegador abrirá algo como:

```text
http://127.0.0.1:5500/index.html
```

### Opción alternativa: Python

Desde la raíz del proyecto:

```bash
python -m http.server 5500
```

Luego abrir:

```text
http://127.0.0.1:5500/index.html
```

---

## 5. Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript vanilla
- Bootstrap 5
- Bootstrap Icons
- LocalStorage
- JSON
- GitHub Pages
- GitHub Actions

El prototipo es una aplicación web estática. No usa backend, no usa base de datos servida y no requiere servidor propio.

---

## 6. Módulos implementados

### Registro operativo

- Clientes
- Periodos contables
- Documentos
- Transacciones

### Tributario preventivo

- Impuestos informativos
- Obligaciones tributarias referenciales
- Alertas de vencimiento

### Ciclo contable digital

- Libro Diario
- Libro Mayor
- Balanza de comprobación
- Ajustes contables
- Balanza ajustada
- Estados Financieros simplificados
- Cierre contable

### Análisis y entrega

- Costos e indicadores
- Punto de equilibrio
- Alertas operativas y contables
- Reporte mensual en lenguaje sencillo
- Ayuda y manual de usuario

### Sistema y evidencia

- Respaldo JSON
- Importación y exportación
- Datos semilla
- Restablecimiento
- Bitácora
- Documentación técnica
- Verificación de despliegue

---

## 7. Principio contable central

El prototipo sigue una regla técnica fundamental:

> El Libro Diario es la fuente principal de verdad contable.  
> El Libro Mayor, la Balanza, los Estados Financieros y los indicadores se calculan en vivo desde las líneas de asiento vigentes del Diario.

Esto evita duplicar información, desincronizar saldos o editar resultados manualmente.

---

## 8. Estructura del repositorio

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── css/
│   ├── styles.css
│   ├── landing.css
│   └── print.css
├── docs/
│   ├── README.md
│   ├── arquitectura-tecnica.md
│   ├── contrato-de-datos.md
│   ├── ciclo-contable-implementado.md
│   ├── manual-de-defensa.md
│   ├── presentacion-academica.md
│   ├── checklist-evidencia-y-anexos.md
│   └── EMPAQUE-FINAL.md
├── js/
│   ├── config.js
│   ├── utils.js
│   ├── storage.js
│   ├── auth.js
│   ├── layout.js
│   ├── app.js
│   ├── landing.js
│   ├── prueba-despliegue.js
│   ├── data/
│   │   └── seed.js
│   └── modules/
│       ├── bitacora.js
│       ├── contabilidad.js
│       ├── mayor-balanza.js
│       ├── costos.js
│       ├── alertas.js
│       ├── reportes.js
│       ├── respaldo.js
│       ├── ayuda.js
│       └── documentacion.js
├── .nojekyll
├── .gitignore
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
├── documentacion.html
├── prueba-despliegue.html
└── README.md
```

---

## 9. Despliegue en GitHub Pages

El proyecto se publica automáticamente mediante GitHub Actions.

Workflow:

```text
.github/workflows/deploy.yml
```

Proceso:

1. Se hace push a la rama `main`.
2. GitHub Actions ejecuta el workflow.
3. Se prepara el sitio estático.
4. Se sube artefacto a GitHub Pages.
5. Se publica la URL pública.

---

## 10. Verificación técnica

La página:

```text
prueba-despliegue.html
```

permite confirmar que el despliegue cargó correctamente:

- módulos JavaScript;
- configuración;
- almacenamiento;
- autenticación;
- motor contable;
- motor de Mayor/Balanza;
- motor de costos;
- LocalStorage;
- rutas relativas;
- avisos profesionales.

Es una evidencia útil para defensa académica.

---

## 11. Límites del prototipo

Cuentas Claras es un prototipo académico, estático y formativo.

Límites declarados:

- Los datos se guardan en LocalStorage del navegador.
- No hay sincronización automática entre dispositivos.
- No hay backend productivo.
- No hay cifrado real.
- No hay roles avanzados server-side.
- No declara automáticamente ante el Servicio de Impuestos Nacionales.
- Los cálculos tributarios son informativos y preventivos.
- Los Estados Financieros son simplificados y formativos.
- El método de inventario es periódico simplificado, no Kardex por ítem.
- No sustituye la firma, certificación, auditoría, dictamen ni representación profesional de un Contador Público Autorizado cuando la normativa boliviana lo exija.

Estos límites no debilitan el proyecto; lo hacen responsable y defendible.

---

## 12. Aviso profesional

> Este sistema es una herramienta de apoyo contable digital, control documental, cálculo tributario preventivo, generación de reportes y educación contable para microempresas comerciales. No sustituye la firma, certificación, auditoría, dictamen, representación formal ni cualquier otra actuación profesional reservada a un Contador Público Autorizado u otro profesional habilitado cuando la normativa boliviana lo exija.

---

## 13. Créditos académicos

**Proyecto:**  
Diseño e implementación de un modelo de gestión contable digital para microempresas comerciales de Trinidad, Beni, apoyado en un sistema computarizado de control documental, alertas tributarias y reportes mensuales.

**Participantes:**

- Lizi Francia Mansilla Vaca
- Milton Daniel Hipamo Cholima

**Tutora:**

- Lic. Sarita Ignacia

**Facilitador:**

- Lic. Edgar Aquilino

**Director C.E.A. Santísima Trinidad:**

- Lic. Miguel Valencia Mazi

**Centro:**

- C.E.A. Santísima Trinidad

**Carrera:**

- Técnico Medio en Contabilidad

**Ubicación:**

- Trinidad, Beni, Bolivia

**Año:**

- 2026

---

## 14. Eslogan

> Contabilidad simple, decisiones claras.

---

## 15. Frase de cierre

> No sustituimos al contador; acercamos la contabilidad al comerciante.
```

---

# 2. Crear `docs/EMPAQUE-FINAL.md`

Ruta:

```text
docs/EMPAQUE-FINAL.md
```

Pega este contenido completo:

```markdown
# Fase 17 – Empaque final para entrega y defensa

## 1. Propósito

Este documento cierra el proyecto Cuentas Claras y organiza la entrega final ante el C.E.A. Santísima Trinidad y el tribunal de defensa.

No agrega nuevas funciones al sistema. Su función es asegurar que el proyecto esté:

- publicado;
- documentado;
- evidenciado;
- organizado;
- ensayado;
- listo para sustentar.

---

## 2. Estado final esperado del proyecto

Al terminar esta fase, el proyecto debe cumplir estas condiciones:

- [ ] El repositorio está en GitHub.
- [ ] La rama principal es `main`.
- [ ] GitHub Pages está activo.
- [ ] La URL pública abre la landing.
- [ ] El login funciona.
- [ ] Los datos semilla cargan correctamente.
- [ ] El Libro Diario genera asientos automáticos.
- [ ] El Libro Mayor se calcula desde el Diario.
- [ ] La Balanza de comprobación y ajustada funcionan.
- [ ] Los ajustes y depreciación funcionan.
- [ ] Los Estados Financieros cuadran.
- [ ] El cierre contable funciona.
- [ ] Costos e indicadores funcionan.
- [ ] Las alertas se generan sin duplicarse.
- [ ] El reporte mensual se genera e imprime.
- [ ] El respaldo JSON exporta e importa.
- [ ] La bitácora registra acciones.
- [ ] La ayuda carga correctamente.
- [ ] La documentación técnica carga correctamente.
- [ ] `prueba-despliegue.html` muestra verificación técnica.
- [ ] El menú lateral es colapsable por grupos.
- [ ] El sistema es responsive en celular.
- [ ] El documento Word fue actualizado para alinearse al prototipo.
- [ ] Los anexos están organizados.
- [ ] El video de respaldo está grabado.
- [ ] La presentación está lista.
- [ ] El guion de defensa está ensayado.

---

## 3. Carpeta de entrega final

Crear esta estructura local, fuera del repositorio o dentro de una carpeta `entrega/` si se desea subir como evidencia:

```text
ENTREGA_CUENTAS_CLARAS/
│
├── 01_DOCUMENTO/
│   ├── Proyecto_Emprendimiento_Productivo_Cuentas_Claras.docx
│   └── Proyecto_Emprendimiento_Productivo_Cuentas_Claras.pdf
│
├── 02_ANEXOS/
│   ├── anexo-01-encuesta.pdf
│   ├── anexo-02-entrevista.pdf
│   ├── anexo-03-diagnostico-contable.pdf
│   ├── anexo-04-contrato-servicios.pdf
│   ├── anexo-05-confidencialidad-datos.pdf
│   ├── anexo-06-capturas-sistema.pdf
│   ├── anexo-07-contrato-de-datos.pdf
│   ├── anexo-08-flujograma-ocho-pasos.pdf
│   ├── anexo-09-organigrama.pdf
│   ├── anexo-10-logotipo-marca.pdf
│   ├── anexo-11-catalogo-servicios.pdf
│   ├── anexo-12-reporte-mensual-ejemplo.pdf
│   ├── anexo-13-calendario-tributario.pdf
│   ├── anexo-14-material-talleres.pdf
│   ├── anexo-15-fotografias-espacio.pdf
│   ├── anexo-16-presupuestos.pdf
│   ├── anexo-17-cronograma.pdf
│   ├── anexo-18-acta-validacion-piloto.pdf
│   ├── anexo-19-testimonios.pdf
│   ├── anexo-20-manual-usuario.pdf
│   ├── anexo-21-url-publica.png
│   ├── anexo-22-github-actions-verde.png
│   ├── anexo-23-github-pages-config.png
│   ├── anexo-24-verificacion-despliegue.png
│   ├── anexo-25-arquitectura-tecnica.pdf
│   ├── anexo-26-contrato-de-datos.pdf
│   ├── anexo-27-ciclo-contable.pdf
│   ├── anexo-28-respaldo-ejemplo.json
│   ├── anexo-29-bitacora-trazabilidad.png
│   ├── anexo-30-libro-diario.png
│   ├── anexo-31-libro-mayor.png
│   ├── anexo-32-balanza-ajustada.png
│   ├── anexo-33-ajustes-depreciacion.png
│   ├── anexo-34-estados-financieros.png
│   ├── anexo-35-costos-indicadores.png
│   ├── anexo-36-alertas.png
│   ├── anexo-37-reporte-mensual.png
│   ├── anexo-38-ayuda-glosario.png
│   ├── anexo-39-documentacion-tecnica.png
│   ├── anexo-40-landing-desktop.png
│   ├── anexo-41-landing-movil.png
│   ├── anexo-42-guion-defensa.pdf
│   ├── anexo-43-video-demostracion-enlace.txt
│   └── anexo-44-repositorio-enlace.txt
│
├── 03_CODIGO/
│   └── cuentas-claras-mvp.zip
│
├── 04_VIDEO/
│   └── demo_cuentas_claras.mp4
│
├── 05_PRESENTACION/
│   ├── defensa_cuentas_claras.pptx
│   └── defensa_cuentas_claras.pdf
│
├── 06_RESPALDOS/
│   └── cuentas-claras-respaldo-defensa.json
│
└── 07_README_ENTREGA.txt
```

---

## 4. Contenido de `07_README_ENTREGA.txt`

Crear este archivo dentro de la carpeta de entrega:

```text
CUENTAS CLARAS – Gestión Contable Digital
Prototipo académico · C.E.A. Santísima Trinidad · Trinidad, Beni · 2026

Participantes:
- Lizi Francia Mansilla Vaca
- Milton Daniel Hipamo Cholima

Tutora:
- Lic. Sarita Ignacia

Facilitador:
- Lic. Edgar Aquilino

Director:
- Lic. Miguel Valencia Mazi

Centro:
- C.E.A. Santísima Trinidad

Carrera:
- Técnico Medio en Contabilidad

URL pública:
https://TU-USUARIO.github.io/TU-REPOSITORIO/

Repositorio:
https://github.com/TU-USUARIO/TU-REPOSITORIO

Para abrir el prototipo local:
1. Descomprimir 03_CODIGO/cuentas-claras-mvp.zip.
2. Abrir la carpeta con Visual Studio Code.
3. Usar Live Server sobre index.html.
4. Ingresar con:
   admin / Admin123
   contador / Contador123

Para importar datos de demostración:
1. Entrar al módulo Respaldo.
2. Seleccionar 06_RESPALDOS/cuentas-claras-respaldo-defensa.json.
3. Elegir modo Reemplazar.
4. Validar e importar.
5. Recargar las pantallas.

Evidencia técnica:
- documentacion.html: documentación técnica y de defensa.
- prueba-despliegue.html: verificación del despliegue.
- 02_ANEXOS/: capturas, respaldos y documentos de soporte.
- 04_VIDEO/: video corto de demostración.

Aviso profesional:
El prototipo es académico, informativo, preventivo y formativo.
No sustituye la firma, certificación, auditoría, dictamen ni representación
profesional de un Contador Público Autorizado cuando la normativa boliviana lo exija.
No declara automáticamente ante el Servicio de Impuestos Nacionales.
Los datos se guardan en LocalStorage del navegador y deben respaldarse periódicamente.
```

---

## 5. Checklist de coherencia entre documento y prototipo

Antes de entregar, verificar que el documento Word esté alineado con el sistema implementado.

### Debe estar actualizado en el documento

- [ ] Introducción menciona prototipo desplegado y verificable.
- [ ] Objetivo específico 2 menciona ciclo contable completo, no solo registro/alertas/reportes.
- [ ] Sección 4.2 conecta los ocho pasos del servicio con los módulos del prototipo.
- [ ] Sección 4.3 describe la estructura real del sistema implementado.
- [ ] Se agrega arquitectura técnica del prototipo.
- [ ] Se agregan límites honestos del prototipo académico.
- [ ] Se aclara que LocalStorage no es seguridad productiva.
- [ ] Se aclara que IVA e IT son informativos y preventivos.
- [ ] Se aclara que RC-IVA, IUE, aportes laborales, facturación electrónica y app móvil son proyección.
- [ ] Se aclara que inventario es periódico simplificado, no Kardex.
- [ ] Sección 5 incluye nota de que costos corresponden al servicio comercial, no al desarrollo del MVP académico.
- [ ] Sección 7.4 actualiza resultados tangibles con módulos reales.
- [ ] Sección 9.2 incluye despliegue en GitHub Pages y verificación técnica.
- [ ] Anexos incluyen evidencia técnica del prototipo.

---

## 6. Checklist de repositorio

- [ ] Repositorio público.
- [ ] Rama `main`.
- [ ] `.nojekyll` en raíz.
- [ ] `.github/workflows/deploy.yml` presente.
- [ ] GitHub Pages con origen GitHub Actions.
- [ ] Workflow en verde.
- [ ] URL pública accesible.
- [ ] `README.md` en raíz actualizado.
- [ ] Carpeta `docs/` completa.
- [ ] No hay archivos sensibles ni datos reales de clientes.
- [ ] No hay rutas absolutas `/css` o `/js`.
- [ ] Nombres de archivos en minúsculas.
- [ ] Commit final con mensaje claro.
- [ ] Tag de versión creado.

Comandos sugeridos:

```bash
git status
git add .
git commit -m "docs: empaque final para entrega y defensa académica"
git push origin main
git tag -a v1.0.0-defensa -m "Entrega final Cuentas Claras - defensa 2026"
git push origin v1.0.0-defensa
```

---

## 7. Checklist de evidencia visual

Capturas mínimas necesarias:

- [ ] Landing desktop.
- [ ] Landing móvil.
- [ ] Login.
- [ ] Dashboard con alertas.
- [ ] Clientes.
- [ ] Periodos.
- [ ] Documentos.
- [ ] Transacciones.
- [ ] Impuestos.
- [ ] Libro Diario con asiento cuadrado.
- [ ] Libro Mayor con ficha de cuenta.
- [ ] Balanza de comprobación.
- [ ] Balanza ajustada cuadrada.
- [ ] Ajustes con depreciación.
- [ ] Estado de Resultados.
- [ ] Balance General con verificación.
- [ ] Costos e indicadores.
- [ ] Punto de equilibrio.
- [ ] Alertas generadas.
- [ ] Reporte mensual completo.
- [ ] Respaldo exportado.
- [ ] Bitácora.
- [ ] Ayuda.
- [ ] Documentación técnica.
- [ ] `prueba-despliegue.html` en verde.
- [ ] GitHub Actions en verde.
- [ ] Settings > Pages configurado.

---

## 8. Checklist de video de respaldo

Duración recomendada: 4 a 6 minutos.

Guion mínimo:

1. Portada y problema — 10 s.
2. Landing pública — 15 s.
3. Login demo — 10 s.
4. Dashboard — 10 s.
5. Generar asientos automáticos en Libro Diario — 30 s.
6. Libro Mayor con ficha de cuenta — 20 s.
7. Balanza ajustada cuadrada — 20 s.
8. Registrar ajuste de depreciación — 20 s.
9. Estados Financieros con verificación — 30 s.
10. Costos e indicadores con punto de equilibrio — 20 s.
11. Generar alertas — 20 s.
12. Reporte mensual en lenguaje sencillo — 30 s.
13. Exportar respaldo JSON — 15 s.
14. Abrir documentación técnica — 15 s.
15. Abrir verificación de despliegue — 15 s.
16. Cierre con aviso profesional — 10 s.

Archivo esperado:

```text
04_VIDEO/demo_cuentas_claras.mp4
```

---

## 9. Guion final de defensa — 15 minutos

### Minuto 0–2 — Lizi: saludo, problema y objetivo

> Buenos días/tardes. Somos Lizi Francia Mansilla Vaca y Milton Daniel Hipamo Cholima, participantes de la especialidad de Contabilidad del C.E.A. Santísima Trinidad.
>
> Nuestro proyecto se llama Cuentas Claras y propone un modelo de gestión contable digital para microempresas comerciales de Trinidad, Beni.
>
> Durante el diagnóstico observamos que muchos comerciantes llevan sus cuentas en cuadernos, pierden documentos, desconocen plazos tributarios y no saben con claridad si están ganando o perdiendo.
>
> Por eso diseñamos un sistema que no solo registra, sino que ordena, previene y explica.

### Minuto 2–4 — Milton: innovación y población

> La innovación del proyecto combina tres elementos: contabilidad técnica, tecnología accesible y educación continua.
>
> No es solo software. Es un modelo de servicio pensado para tiendas de barrio, puestos de mercado, ferreterías pequeñas, abarroterías y comerciantes en proceso de formalización.
>
> Nuestro cliente ideal necesita orden, recordatorios tributarios, reportes comprensibles y acompañamiento en lenguaje sencillo.

### Minuto 4–7 — Lizi: proceso en ocho pasos y ciclo contable

> El modelo se organiza en ocho pasos mensuales: diagnóstico, recepción de documentos, clasificación, registro digital, conciliación, cierre, obligaciones tributarias y entrega de reporte con capacitación.
>
> Durante la implementación, el prototipo evolucionó y amplió lo prometido. Hoy no solo controla documentos y genera alertas: implementa un ciclo contable simplificado completo.
>
> El sistema parte de la transacción, genera asientos en el Libro Diario, deriva el Libro Mayor y la Balanza, permite ajustes, emite Estados Financieros, realiza cierre contable y calcula costos e indicadores.

### Minuto 7–10 — Milton: demostración técnica

> Vamos a mostrar el flujo completo con datos semilla.
>
> Ingresamos al prototipo, seleccionamos un cliente y periodo, generamos asientos automáticos, revisamos el Libro Mayor, verificamos la Balanza ajustada, registramos un ajuste de depreciación, emitimos Estados Financieros, analizamos costos e indicadores, generamos alertas y producimos un reporte mensual en lenguaje sencillo.
>
> Además, el prototipo está desplegado en GitHub Pages y cuenta con una página de verificación técnica que confirma la carga de módulos, rutas relativas, LocalStorage y motores contables.

### Minuto 10–12 — Lizi: viabilidad y beneficios

> El modelo de servicio es viable porque alcanza punto de equilibrio con tres clientes promedio, según los costos fijos mensuales del escenario académico.
>
> Para el microempresario, los beneficios son concretos: orden documental, cumplimiento preventivo, conocimiento de utilidades, reportes comprensibles, reducción de multas evitables y base para formalización.

### Minuto 12–13 — Milton: límites profesionales

> Declaramos con claridad los límites del prototipo.
>
> No declara automáticamente ante el SIN. Los impuestos son informativos. Los Estados Financieros son simplificados y formativos. LocalStorage no es seguridad productiva. El sistema no sustituye la firma de un Contador Público Autorizado cuando la normativa lo exija.
>
> Declarar estos límites no debilita el proyecto; lo hace responsable.

### Minuto 13–15 — Ambos: conclusiones y cierre

> Lizi: Cuentas Claras demuestra que la contabilidad puede ser simple, preventiva y comprensible cuando la tecnología se pone al servicio del microempresario.
>
> Milton: No buscamos reemplazar al profesional contable. Buscamos ordenar la información, reducir riesgos y educar al comerciante para que tome mejores decisiones.
>
> Ambos: Contabilidad simple, decisiones claras. Muchas gracias.

---

## 10. Preguntas probables del tribunal y respuestas breves

### ¿El sistema declara impuestos ante el SIN?

No. Calcula IVA e IT de forma informativa y preventiva. No constituye declaración automática.

### ¿Sustituye a un Contador Público Autorizado?

No. Es una herramienta académica de apoyo contable, documental, educativo y preventivo. La actuación profesional formal corresponde al CPA cuando la norma lo exija.

### ¿Por qué usan LocalStorage?

Porque el prototipo académico es estático, verificable y desplegable gratuitamente. Para producción se migraría a base de datos y backend seguro.

### ¿Cómo evitan errores contables?

Validando cuadratura de asientos, derivando Mayor y Balanza desde el Diario, bloqueando periodos cerrados, anulando con trazabilidad y generando alertas de descuadre.

### ¿Qué método de inventario usan?

Método periódico simplificado. Kardex por ítem y costo unitario por producto se declaran como proyección.

### ¿Cómo calculan depreciación?

Con método lineal simple: (costo − valor residual) / vida útil en meses, evitando duplicar la depreciación del mismo activo en el mismo periodo.

### El título habla de control documental, alertas y reportes. ¿Por qué el sistema hace más?

Porque durante la implementación el prototipo amplió el alcance y documentó un ciclo contable simplificado completo. El documento fue actualizado para reflejar esa evolución.

### ¿Los costos del documento son el costo de programar el sistema?

No. Corresponden al modelo de servicio comercial. El prototipo académico se desarrolló con recursos propios y herramientas gratuitas.

### ¿Qué evidencia técnica tienen?

Repositorio público, GitHub Pages, GitHub Actions en verde, página de verificación técnica, documentación en Markdown, respaldos JSON, bitácora, capturas y video.

### ¿Funciona en celular?

Sí, es responsive. Pero los datos se guardan solo en el navegador actual; para trasladarlos se exporta e importa un respaldo JSON.

---

## 11. Plan B técnico

Tener listo antes de entrar a defensa:

- [ ] Carpeta local del proyecto.
- [ ] VS Code con Live Server.
- [ ] URL pública abierta.
- [ ] `prueba-despliegue.html` abierta.
- [ ] `documentacion.html` abierta.
- [ ] Video de respaldo.
- [ ] PDF del documento.
- [ ] Presentación en PDF.
- [ ] Respaldo JSON exportado.
- [ ] USB con todo.

Frase de contingencia:

> Si la conexión falla, contamos con evidencia local grabada y respaldos del prototipo, y podemos continuar la demostración desde el equipo local.

---

## 12. Checklist de últimas 24 horas

- [ ] URL pública probada con datos móviles.
- [ ] Video reproducido en equipo del CEA.
- [ ] Deck abierto en equipo del CEA.
- [ ] Documento PDF final listo.
- [ ] Respaldo JSON exportado.
- [ ] USB preparado.
- [ ] Capturas organizadas.
- [ ] Guion ensayado con cronómetro.
- [ ] Reparto de roles confirmado.
- [ ] Frases ancla memorizadas.

---

## 13. Checklist de 1 hora antes

- [ ] Abrir navegador con URL pública.
- [ ] Abrir proyecto local como plan B.
- [ ] Confirmar `prueba-despliegue.html` en verde.
- [ ] Cargar semilla si es necesario.
- [ ] Generar asientos para demo.
- [ ] Tener login listo.
- [ ] Probar audio/micrófono.
- [ ] Respirar.

---

## 14. Mensaje final de la Fase 17

Con esta fase, Cuentas Claras deja de ser solo un prototipo funcional y se convierte en una entrega académica completa.

El proyecto puede presentarse así:

> Diseñamos e implementamos un modelo de gestión contable digital para microempresas comerciales de Trinidad, Beni. Lo desarrollamos como prototipo web estático, con ciclo contable simplificado, control documental, alertas preventivas, estados financieros informativos, reporte mensual en lenguaje sencillo, respaldo JSON, bitácora, documentación técnica y despliegue público verificable en GitHub Pages.

Frase de cierre:

> Contabilidad simple, decisiones claras. Evidencia pública, defensa sólida.
```

---

# 3. Crear `docs/MANIFIESTO-ENTREGA.md` opcional

Ruta:

```text
docs/MANIFIESTO-ENTREGA.md
```

Pega este contenido:

```markdown
# Manifiesto de entrega – Cuentas Claras

## 1. Datos del proyecto

**Proyecto:**  
Diseño e implementación de un modelo de gestión contable digital para microempresas comerciales de Trinidad, Beni, apoyado en un sistema computarizado de control documental, alertas tributarias y reportes mensuales.

**Emprendimiento:**  
Cuentas Claras – Gestión Contable Digital

**Eslogan:**  
Contabilidad simple, decisiones claras.

**Centro:**  
C.E.A. Santísima Trinidad

**Carrera:**  
Técnico Medio en Contabilidad

**Ubicación:**  
Trinidad, Beni, Bolivia

**Año:**  
2026

**Participantes:**

- Lizi Francia Mansilla Vaca
- Milton Daniel Hipamo Cholima

**Tutora:**  
Lic. Sarita Ignacia

**Facilitador:**  
Lic. Edgar Aquilino

**Director:**  
Lic. Miguel Valencia Mazi

---

## 2. Versión entregada

Versión del prototipo:

```text
v1.0.0-defensa
```

Fecha de entrega:

```text
____ / ____ / 2026
```

URL pública:

```text
https://TU-USUARIO.github.io/TU-REPOSITORIO/
```

Repositorio:

```text
https://github.com/TU-USUARIO/TU-REPOSITORIO
```

Commit final:

```text
_______________________________
```

Tag:

```text
v1.0.0-defensa
```

---

## 3. Componentes entregados

- [ ] Documento de proyecto en Word.
- [ ] Documento de proyecto en PDF.
- [ ] Repositorio público.
- [ ] Prototipo desplegado en GitHub Pages.
- [ ] Carpeta `docs/` con documentación técnica.
- [ ] Página `documentacion.html`.
- [ ] Página `prueba-despliegue.html`.
- [ ] Capturas de evidencia.
- [ ] Video de demostración.
- [ ] Presentación de defensa.
- [ ] Respaldo JSON de demostración.
- [ ] Carpeta de entrega estructurada.

---

## 4. Hashes de archivos principales

Opcional, pero muy útil para evidencia formal.

Generar hashes con PowerShell:

```powershell
Get-FileHash .\01_DOCUMENTO\Proyecto_Emprendimiento_Productivo_Cuentas_Claras.pdf -Algorithm SHA256
Get-FileHash .\04_VIDEO\demo_cuentas_claras.mp4 -Algorithm SHA256
Get-FileHash .\06_RESPALDOS\cuentas-claras-respaldo-defensa.json -Algorithm SHA256
```

Registrar aquí:

```text
Documento PDF:
SHA256: _______________________________________________

Video demo:
SHA256: _______________________________________________

Respaldo JSON:
SHA256: _______________________________________________
```

---

## 5. Declaración de límites

El prototipo entregado es académico, estático, informativo, preventivo y formativo.

No sustituye la firma, certificación, auditoría, dictamen, representación formal ni cualquier otra actuación profesional reservada a un Contador Público Autorizado cuando la normativa boliviana lo exija.

No declara automáticamente ante el Servicio de Impuestos Nacionales.

Los datos se almacenan en LocalStorage del navegador y deben respaldarse periódicamente.

---

## 6. Firmas

Participante 1:

```text
_______________________________
Lizi Francia Mansilla Vaca
Fecha: ____ / ____ / 2026
```

Participante 2:

```text
_______________________________
Milton Daniel Hipamo Cholima
Fecha: ____ / ____ / 2026
```

V°B° Tutora:

```text
_______________________________
Lic. Sarita Ignacia
Fecha: ____ / ____ / 2026
```

V°B° Facilitador:

```text
_______________________________
Lic. Edgar Aquilino
Fecha: ____ / ____ / 2026
```
```

---

# 4. Preparar la carpeta de entrega final

Ahora, en tu computadora, crea esta carpeta:

```text
ENTREGA_CUENTAS_CLARAS/
```

Dentro, crea las subcarpetas:

```text
01_DOCUMENTO/
02_ANEXOS/
03_CODIGO/
04_VIDEO/
05_PRESENTACION/
06_RESPALDOS/
```

Y coloca:

```text
01_DOCUMENTO/
  Proyecto_Emprendimiento_Productivo_Cuentas_Claras.docx
  Proyecto_Emprendimiento_Productivo_Cuentas_Claras.pdf

02_ANEXOS/
  todas las capturas y anexos numerados

03_CODIGO/
  cuentas-claras-mvp.zip

04_VIDEO/
  demo_cuentas_claras.mp4

05_PRESENTACION/
  defensa_cuentas_claras.pptx
  defensa_cuentas_claras.pdf

06_RESPALDOS/
  cuentas-claras-respaldo-defensa.json

07_README_ENTREGA.txt
```

---

# 5. Cómo generar el ZIP del código

Si tu carpeta del proyecto se llama:

```text
cuentas-claras-mvp
```

En Windows:

1. Clic derecho sobre la carpeta.
2. Seleccionar:

```text
Comprimir a archivo ZIP
```

3. Renombrar a:

```text
cuentas-claras-mvp.zip
```

4. Moverlo a:

```text
ENTREGA_CUENTAS_CLARAS/03_CODIGO/
```

En PowerShell:

```powershell
Compress-Archive -Path .\cuentas-claras-mvp\* -DestinationPath .\ENTREGA_CUENTAS_CLARAS\03_CODIGO\cuentas-claras-mvp.zip -Force
```

---

# 6. Cómo exportar el respaldo JSON de defensa

1. Abrir el prototipo local o público.
2. Iniciar sesión:

```text
admin / Admin123
```

3. Cargar datos semilla si es necesario.
4. Ir a:

```text
Respaldo
```

5. Pulsar:

```text
Descargar respaldo JSON
```

6. Renombrar el archivo a:

```text
cuentas-claras-respaldo-defensa.json
```

7. Moverlo a:

```text
ENTREGA_CUENTAS_CLARAS/06_RESPALDOS/
```

---

# 7. Cómo preparar el video de respaldo

Puedes usar OBS, Clipchamp, Camtasia, Loom o la grabadora de Windows.

Grabación recomendada:

```text
1920x1080
30 fps
audio claro
duración 4–6 minutos
```

Guion corto:

```text
00:00 – Portada: Cuentas Claras, Trinidad, Beni, 2026.
00:10 – Problema: cuadernos, documentos sueltos, multas, falta de utilidades claras.
00:25 – Landing pública y propuesta de valor.
00:40 – Login demo.
00:50 – Dashboard y alertas.
01:05 – Libro Diario: generar asientos automáticos.
01:35 – Libro Mayor: ficha de cuenta.
01:55 – Balanza ajustada cuadrada.
02:15 – Ajuste de depreciación.
02:35 – Estados Financieros: ER y Balance.
03:05 – Costos e indicadores: margen y punto de equilibrio.
03:25 – Alertas generadas.
03:45 – Reporte mensual en lenguaje sencillo.
04:15 – Respaldo JSON exportado.
04:30 – Documentación técnica.
04:45 – Verificación de despliegue en verde.
05:00 – Cierre con aviso profesional.
```

---

# 8. Presentación final sugerida

Puedes usar PowerPoint, Canva, Google Slides o PDF.

Mínimo necesario:

```text
1. Portada
2. Problema
3. Objetivo
4. Innovación
5. Población beneficiaria
6. Proceso en ocho pasos
7. Arquitectura técnica
8. Ciclo contable implementado
9. Módulos agrupados
10. Demo en vivo
11. Evidencia técnica
12. Viabilidad económica
13. Límites profesionales
14. Conclusiones
15. Cierre
```

Extras ocultos para preguntas:

```text
A. Ejemplo de asiento automático
B. Fórmula de depreciación
C. Contrato de datos
D. Verificación de cuadratura
E. Roadmap futuro
```

Exportar también a PDF:

```text
defensa_cuentas_claras.pdf
```

---

# 9. Checklist maestro final

Este es el checklist más importante. Marcar solo cuando esté realmente listo.

## A. Código y repositorio

- [ ] Proyecto funciona localmente.
- [ ] Proyecto funciona en GitHub Pages.
- [ ] `README.md` raíz actualizado.
- [ ] `docs/` completo.
- [ ] `.nojekyll` presente.
- [ ] Workflow en verde.
- [ ] Tag `v1.0.0-defensa` creado.
- [ ] Commit final hecho.
- [ ] No hay errores rojos graves en consola.
- [ ] No hay rutas absolutas.
- [ ] No hay datos reales sensibles sin autorización.

## B. Documento Word

- [ ] Carátula correcta.
- [ ] Dedicatoria y agradecimiento revisados.
- [ ] Datos generales actualizados.
- [ ] Introducción alineada con prototipo implementado.
- [ ] Objetivos específicos actualizados.
- [ ] Sección 4.2 conecta ocho pasos con sistema.
- [ ] Sección 4.3 describe módulos reales.
- [ ] Arquitectura técnica agregada.
- [ ] Límites del prototipo agregados.
- [ ] Costos aclaran diferencia entre servicio comercial y MVP académico.
- [ ] Resultados tangibles actualizados.
- [ ] Proyecciones incluyen despliegue y verificación técnica.
- [ ] Anexos ampliados con evidencia técnica.
- [ ] Bibliografía revisada.
- [ ] Formato final consistente.
- [ ] Exportado a PDF.

## C. Evidencia visual

- [ ] Capturas de todos los módulos.
- [ ] Captura de GitHub Actions verde.
- [ ] Captura de GitHub Pages configurado.
- [ ] Captura de `prueba-despliegue.html`.
- [ ] Captura de `documentacion.html`.
- [ ] Captura de landing desktop.
- [ ] Captura de landing móvil.
- [ ] Captura de reporte mensual.
- [ ] Captura de EE.FF. cuadrados.
- [ ] Captura de balanza ajustada.
- [ ] Captura de Libro Diario con asiento.
- [ ] Captura de alertas.
- [ ] Captura de respaldo/bitácora.

## D. Video

- [ ] Grabado.
- [ ] Editado o recortado.
- [ ] Audio audible.
- [ ] Duración 4–6 minutos.
- [ ] Guardado en `04_VIDEO/`.
- [ ] Probado en equipo del CEA.

## E. Presentación

- [ ] Diapositivas listas.
- [ ] Exportada a PDF.
- [ ] Ensayada con cronómetro.
- [ ] Láminas de respaldo ocultas listas.
- [ ] Fuente embebida o segura.

## F. Defensa

- [ ] Guion memorizado en bloques.
- [ ] Roles repartidos.
- [ ] Transición demo ensayada.
- [ ] Preguntas probables revisadas.
- [ ] Plan B listo.
- [ ] USB preparado.
- [ ] Documento impreso o digital a mano.
- [ ] Frases ancla memorizadas.

---

# 10. Frases ancla para memorizar

## Apertura

> Somos Lizi Mansilla y Milton Hipamo, de Contabilidad del C.E.A. Santísima Trinidad, y presentamos Cuentas Claras: un modelo de gestión contable digital para microempresas de Trinidad, Beni.

## Problema

> El comerciante no pierde el control por descuido, sino por falta de una herramienta simple, accesible y pedagógica.

## Solución

> Cuentas Claras no solo registra: ordena documentos, genera contabilidad simplificada, previene incumplimientos y explica resultados en lenguaje sencillo.

## Evidencia técnica

> El prototipo está desplegado en GitHub Pages y puede verificarse mediante documentación técnica y una página de diagnóstico.

## Límite profesional

> No sustituimos al Contador Público Autorizado; acercamos la contabilidad al microempresario y derivamos cuando la norma lo exige.

## Cierre

> Contabilidad simple, decisiones claras.

---

# 11. Guion ultra corto para 5 minutos

Si el tribunal reduce el tiempo, usar este esquema:

```text
1. Saludo y problema — 40 s
2. Objetivo e innovación — 40 s
3. Ciclo contable implementado — 60 s
4. Demo rápida: Diario, Balanza, EE.FF., reporte — 90 s
5. Evidencia técnica y límites — 40 s
6. Cierre — 30 s
```

Frase central:

> Pasamos de un registro manual en cuadernos a un prototipo digital que ordena, previene, contabiliza y explica.

---

# 12. Guion extendido para 20 minutos

Si hay más tiempo:

```text
0–2   Saludo, problema, objetivo
2–4   Innovación y población
4–6   Ocho pasos y modelo de servicio
6–9   Arquitectura y ciclo contable
9–14  Demo completa
14–16 Costos, viabilidad y beneficios
16–18 Límites profesionales y evidencia técnica
18–20 Conclusiones y preguntas
```

En demo extendida mostrar:

- clientes;
- periodos;
- documentos;
- transacciones;
- impuestos;
- Diario;
- Mayor;
- Balanza;
- ajustes;
- EE.FF.;
- cierre/reapertura;
- costos;
- alertas;
- reporte;
- respaldo;
- documentación;
- verificación de despliegue.

---

# 13. Errores finales que debes evitar

- No decir que el sistema es comercial o productivo.
- No decir que declara impuestos ante el SIN.
- No decir que sustituye al contador.
- No confundir LocalStorage con base de datos en la nube.
- No prometer app móvil, facturación electrónica o integración bancaria como funciones actuales.
- No leer diapositivas.
- No interrumpir al compañero.
- No esconder límites.
- No llegar sin plan B.
- No entregar sin PDF, video y capturas.

---

# 14. Estado final del proyecto

Con Fase 17, Cuentas Claras queda así:

```text
Modelo de servicio diseñado
Proceso contable en ocho pasos documentado
Prototipo web estático implementado
Ciclo contable simplificado verificado
Control documental operativo
Impuestos informativos preventivos
Libro Diario como fuente de verdad
Libro Mayor derivado
Balanza de comprobación y ajustada
Ajustes contables y depreciación
Estados Financieros simplificados
Cierre contable trazable
Costos, márgenes y punto de equilibrio
Indicadores financieros
Alertas tributarias y operativas
Reporte mensual en lenguaje sencillo
Respaldo JSON
Bitácora
Ayuda y glosario
Documentación técnica
Verificación de despliegue
Landing pública
GitHub Pages
Repo etiquetado
Carpeta de entrega armada
Video de respaldo
Presentación lista
Guion de defensa listo
```

---

# 15. Cierre formal de la serie

El proyecto ya no puede presentarse como:

> Hicimos un sistema de registro de ventas con alertas.

Debe presentarse como:

> Diseñamos e implementamos un modelo de gestión contable digital para microempresas comerciales de Trinidad, Beni, con un prototipo técnico verificable que evidencia un ciclo contable simplificado completo, control documental, alertas preventivas, estados financieros informativos, reporte mensual comprensible, respaldo de datos, documentación técnica y despliegue público.

Y con esta frase de autoridad académica:

> No sustituimos al contador; acercamos la contabilidad al comerciante.

---

# Checklist final Fase 17

- [ ] `README.md` raíz creado/actualizado.
- [ ] `docs/EMPAQUE-FINAL.md` creado.
- [ ] `docs/MANIFIESTO-ENTREGA.md` creado opcionalmente.
- [ ] Carpeta `ENTREGA_CUENTAS_CLARAS/` armada.
- [ ] Documento Word actualizado y exportado a PDF.
- [ ] Repositorio público listo.
- [ ] GitHub Actions en verde.
- [ ] URL pública probada.
- [ ] Capturas organizadas.
- [ ] Video grabado.
- [ ] Presentación lista.
- [ ] Respaldo JSON exportado.
- [ ] Plan B local listo.
- [ ] Guion de defensa ensayado.
- [ ] Checklist maestro completado.

---

# Siguiente paso real

Ya no hay fase de código pendiente para el MVP académico.

Lo siguiente es ejecución humana:

```text
1. Pegar README.md raíz.
2. Pegar docs/EMPAQUE-FINAL.md.
3. Armar carpeta de entrega.
4. Exportar respaldo.
5. Grabar video.
6. Hacer presentación.
7. Ensayar defensa.
8. Entregar.
```

Si quieres, en el siguiente mensaje puedo ayudarte de forma ultra práctica con una de estas opciones:

## Opción A  
Te armo el **documento Word final actualizado** con las secciones ya corregidas listas para pegar.

## Opción B  
Te armo la **presentación de defensa completa**, diapositiva por diapositiva, con texto exacto para PowerPoint/Canva.

## Opción C  
Te armo el **guion cronometrado de 15 minutos** con frases exactas para Lizi y Milton.

## Opción D  
Te armo el **checklist imprimible de entrega final** para marcar a mano antes de defensa.

Mi recomendación: **opción B o C**, porque ya tienes documentación técnica; ahora falta que la defensa salga redonda.