# Checklist de evidencia y anexos – Cuentas Claras

> Documento de control final. Sirve para verificar, antes de entregar y antes de defender, que **todo lo prometido en el documento escrito está efectivamente implementado, desplegado y evidenciado**.
>
> Marcar cada casilla solo cuando la evidencia esté **visible, accesible y verificable por un tercero**. No basta con “lo tengo en mi PC”: para un proyecto de sistema, la evidencia debe ser pública o reproducible.

---

## 1. Repositorio y despliegue público

- [ ] Repositorio creado en GitHub con nombre claro (ej. `cuentas-claras-mvp`).
- [ ] Repositorio **público** (para defensa académica con URL abierta).
- [ ] Rama principal llamada `main`.
- [ ] El contenido del proyecto está en la **raíz del repositorio** (no dentro de una subcarpeta `cuentas-claras-mvp/`), o el workflow apunta correctamente a la subcarpeta si se decidió mantenerla.
- [ ] Archivo `.nojekyll` presente en la raíz, vacío.
- [ ] Carpeta `.github/workflows/deploy.yml` presente y con sintaxis válida.
- [ ] Archivo `.gitignore` presente (opcional pero recomendado).
- [ ] GitHub Pages configurado con origen **GitHub Actions** (Settings → Pages → Source: GitHub Actions).
- [ ] Workflow ejecutado al menos una vez y terminado en **verde**.
- [ ] Historial de commits visible y ordenado (no un solo commit gigante de “subí todo”).
- [ ] URL pública accesible desde otro navegador y desde celular:

```text
https://usuario.github.io/repositorio/
```

- [ ] La URL no redirige a `localhost` ni a `127.0.0.1`.
- [ ] No hay rutas absolutas `/css` o `/js` en el código (todas relativas con `./`).
- [ ] Nombres de archivos en **minúsculas** y coincidentes con las rutas de `config.js`.

**Evidencia a guardar:** captura de la URL pública, captura de Actions en verde, captura de Settings → Pages.

---

## 2. Landing pública (`index.html`)

- [ ] Carga sin errores en consola.
- [ ] Menú superior navegable (Inicio, Cómo funciona, Ciclo contable, Módulos, Demo, Preguntas, Contacto).
- [ ] Botón “Iniciar sesión” lleva a `./login.html`.
- [ ] Hero con mock visual del sistema (no imagen externa rota).
- [ ] Sección “El problema real” visible.
- [ ] Sección “Cómo funciona” (documento → transacción → Diario → reporte).
- [ ] Sección “Ciclo contable simplificado” con las 11 etapas.
- [ ] Sección “Módulos del sistema” agrupados en 5 bloques.
- [ ] Sección “Lenguaje sencillo” (comparativa contable vs lectura sencilla).
- [ ] Sección “Demo” con credenciales y aviso LocalStorage.
- [ ] Sección “Stack del prototipo”.
- [ ] **Aviso profesional visible** (no sustituye CPA, no declara ante SIN).
- [ ] FAQ con al menos 6 preguntas.
- [ ] Footer académico con participantes, tutora, facilitador, director, centro, carrera, ubicación y año.
- [ ] Animaciones de aparición y contadores funcionan.
- [ ] Responsive verificado en celular (menú hamburguesa, sin scroll horizontal).
- [ ] Impresión rápida (`Ctrl + P`) no rompe el layout.

**Evidencia a guardar:** captura desktop + captura móvil de la landing completa.

---

## 3. Login y sesión demo (`login.html`)

- [ ] Carga sin errores.
- [ ] Usuario `admin / Admin123` inicia sesión correctamente.
- [ ] Usuario `contador / Contador123` inicia sesión correctamente.
- [ ] Credenciales incorrectas muestran mensaje de error claro.
- [ ] Tras login correcto, redirige a `./dashboard.html`.
- [ ] Botón “Salir” cierra sesión y vuelve a login.
- [ ] Intentar entrar a una página privada sin sesión redirige a login.
- [ ] La sesión persiste al recargar (F5) hasta hacer logout.

**Evidencia a guardar:** captura del login y del dashboard tras iniciar sesión.

---

## 4. Datos semilla y estado inicial

- [ ] Al abrir por primera vez, el sistema carga semilla automáticamente (o se carga manualmente desde Respaldo → “Cargar datos semilla”).
- [ ] 3 clientes piloto presentes:
  - [ ] Tienda Doña Rosa
  - [ ] Ferretería San Luis
  - - [ ] Abarrotes La Esquina
- [ ] Cada cliente tiene al menos un periodo (Octubre 2026).
- [ ] Documentos semilla presentes por cliente y periodo.
- [ ] Transacciones semilla presentes (ventas, compras, gastos).
- [ ] Impuestos semilla presentes (IVA e IT informativos).
- [ ] Plan de cuentas migrado desde configuración (cuentas nivel 3 activas).
- [ ] Activos fijos semilla presentes (al menos uno por cliente con depreciación).
- [ ] Obligaciones tributarias semilla presentes con fechas de vencimiento.
- [ ] Un periodo puede estar cerrado (Abarrotes La Esquina) para probar bloqueo.

**Evidencia a guardar:** captura del listado de clientes y de un periodo con datos.

---

## 5. Ciclo contable (núcleo técnico)

### 5.1 Libro Diario (`libro-diario.html`)

- [ ] Selector de cliente y periodo funciona.
- [ ] Botón “Generar asientos automáticos” crea asientos desde transacciones sin asiento.
- [ ] Asiento de venta en Régimen General desglosa IVA débito fiscal correctamente.
- [ ] Asiento de compra en Régimen General desglosa IVA crédito fiscal correctamente.
- [ ] Asiento de gasto e ingreso se genera según forma de pago (caja/banco/credito).
- [ ] Asiento manual valida cuadratura (Σ débitos = Σ créditos) y rechaza si no cuadra.
- [ ] Detalle de asiento muestra líneas con cuenta, débito, crédito, tercero y referencia.
- [ ] Anulación de asiento cambia estado a `anulado` sin borrar.
- [ ] Al anular un asiento automático, la transacción queda sin `journalEntryId` y puede regenerarse.
- [ ] Periodo cerrado bloquea generación de asientos nuevos.
- [ ] Folios correlativos por cliente/periodo.

**Evidencia a guardar:** captura de un asiento cuadrado con IVA desglosado.

### 5.2 Libro Mayor (`libro-mayor.html`)

- [ ] Resumen por cuenta muestra saldo inicial, débitos, créditos y saldo final.
- [ ] Saldo inicial arrastra correctamente de periodos anteriores.
- [ ] Ficha de cuenta muestra saldo corrido por movimiento.
- [ ] Cuentas compensadoras (1.2.02, 5.1.02) se presentan con naturaleza correcta.
- [ ] El Mayor se calcula en vivo (no hay tabla persistida de saldos).
- [ ] Al anular un asiento, el Mayor se recalcula automáticamente.

**Evidencia a guardar:** captura de ficha de cuenta con saldo corrido.

### 5.3 Balanza (`balanza.html`)

- [ ] Toggle “Comprobación / Ajustada” funciona.
- [ ] Balanza de comprobación **excluye** ajustes y cierres.
- [ ] Balanza ajustada **incluye** ajustes y **excluye** cierres.
- [ ] Indicador de cuadratura de movimientos en verde.
- [ ] Indicador de cuadratura de saldos en verde.
- [ ] Mensaje informativo cuando hay líneas de ajuste excluidas en comprobación.
- [ ] Si no hay ajustes, ambas balanzas se ven iguales (comportamiento esperado).
- [ ] Impresión de balanza oculta controles y muestra tabla.

**Evidencia a guardar:** captura de balanza ajustada con indicadores verdes.

### 5.4 Ajustes (`ajustes.html`)

- [ ] Listado de activos fijos del cliente.
- [ ] Depreciar un activo individual genera asiento de ajuste tipo `depreciacion`.
- [ ] Depreciar todos los activos del periodo funciona.
- [ ] **Anti-duplicidad:** no se puede depreciar el mismo activo dos veces en el mismo periodo.
- [ ] La depreciación aumenta `depreciacionAcumulada` del activo.
- [ ] Ajuste rápido de dos líneas valida: periodo no cerrado, fecha dentro del periodo, débito ≠ crédito.
- [ ] Categorías de ajuste disponibles (devengado, provisión, reclasificación, inventario, otro).
- [ ] Anular un ajuste deja de afectar la balanza ajustada.
- [ ] Anular una depreciación revierte `depreciacionAcumulada`.
- [ ] Ver detalle de ajuste muestra líneas.

**Evidencia a guardar:** captura de ajuste de depreciación registrado.

### 5.5 Estados Financieros (`estados-financieros.html`)

- [ ] Estado de Resultados simplificado carga con ventas, costo, gastos, IT informativo y utilidad neta.
- [ ] Balance General simplificado carga con activo, pasivo y patrimonio.
- [ ] Verificación **Activo = Pasivo + Patrimonio** con diferencia `Bs 0,00`.
- [ ] IT estimado se presenta como gasto y pasivo informativo (para cuadrar sin contabilizarlo).
- [ ] Botón “Emitir y congelar snapshot” crea dos registros en `cc_financial_snapshots`.
- [ ] Botón “Cerrar periodo contable” genera asiento tipo `cierre`, marca periodo `cerrado`, guarda `closingEntryId` y `closedAt`.
- [ ] Botón “Reabrir periodo” anula asientos de cierre y devuelve estado `abierto`.
- [ ] Los EE.FF. vivos **excluyen** asientos de cierre (seguir viendo ingresos/costos/gastos aunque esté cerrado).
- [ ] Impresión de EE.FF. oculta menú y controles.

**Evidencia a guardar:** captura de ER + Balance con verificación en verde.

---

## 6. Análisis y entrega

### 6.1 Costos e indicadores (`costos-indicadores.html`)

- [ ] Tarjetas superiores: ventas, costo de ventas, utilidad bruta, utilidad neta.
- [ ] Tabla de costos y rentabilidad con % sobre ingresos.
- [ ] Punto de equilibrio **base contable** (gastos registrados).
- [ ] Punto de equilibrio **base estimada** (`costosFijosMensuales` del cliente).
- [ ] Si margen de contribución ≤ 0, muestra “No calculable” (no inventa valor).
- [ ] Indicadores: liquidez corriente, endeudamiento, ROE, margen neto, rotación de inventario, rotación de cuentas por cobrar.
- [ ] Recomendaciones en lenguaje sencillo generadas automáticamente.
- [ ] Botón “Guardar evidencia” crea snapshot tipo `indicadores`.
- [ ] Impresión funciona.

**Evidencia a guardar:** captura de indicadores con punto de equilibrio.

### 6.2 Alertas (`alertas.html`)

- [ ] Botón “Generar alertas automáticas” crea alertas sin duplicar las activas.
- [ ] Tipos generados: vencimiento tributario, documento pendiente, periodo sin cerrar, transacción sin documento, transacción sin asiento, impuesto no calculado, balanza descuadrada.
- [ ] Filtros por cliente, periodo, tipo, nivel, estado y búsqueda libre.
- [ ] Métricas superiores (pendientes, vistas, resueltas, vencidas, urgentes, total).
- [ ] Marcar como vista y como resuelta funciona.
- [ ] Alerta resuelta **no** vuelve a generarse automáticamente.
- [ ] Ver detalle en modal.
- [ ] Copiar mensaje WhatsApp y abrir enlace `wa.me` con prefijo 591.
- [ ] Dashboard muestra alertas recientes (patch aplicado).
- [ ] Impresión funciona.

**Evidencia a guardar:** captura de tabla de alertas con niveles de color.

### 6.3 Reporte mensual (`reportes.html`)

- [ ] Genera reporte desde balanza ajustada si el motor contable está cargado.
- [ ] Fallback operativo si no hay motor (usa transacciones e impuestos).
- [ ] Resumen en lenguaje sencillo (narrativa para el microempresario).
- [ ] Tarjetas: ventas, costo, gastos, utilidad neta.
- [ ] Tabla de ingresos y resultado.
- [ ] Impuestos informativos (IT e IVA).
- [ ] Situación financiera simplificada con verificación de cuadratura.
- [ ] Indicadores y punto de equilibrio.
- [ ] Alertas pendientes del periodo.
- [ ] Recomendaciones y próximo paso.
- [ ] Aviso profesional al pie.
- [ ] Se guarda en `cc_reports` con `resumen` congelado.
- [ ] Ver reporte guardado desde tabla inferior.
- [ ] Impresión oculta controles y muestra solo el reporte.

**Evidencia a guardar:** captura del reporte mensual completo.

---

## 7. Sistema y evidencia

### 7.1 Respaldo (`respaldo.html`)

- [ ] Estadísticas: versión de esquema, semilla cargada, último respaldo, uso aproximado.
- [ ] Tabla de conteo de registros por colección.
- [ ] Exportar JSON descarga archivo con nombre fechado.
- [ ] Al exportar, actualiza `lastBackupAt` y registra en bitácora.
- [ ] Copiar al portapapeles funciona.
- [ ] Vista previa truncada del JSON.
- [ ] Validar importación analiza estructura, versión y colecciones.
- [ ] Importar solo habilitado tras validación exitosa.
- [ ] Modos reemplazar y fusionar funcionan.
- [ ] Tras importar, recalcula contadores de ID.
- [ ] Cargar semilla forzada con confirmación.
- [ ] Restablecer con confirmación escrita `REINICIAR`.
- [ ] Opción “mantener sesión” al restablecer.
- [ ] Bitácora con filtros por entidad, acción, usuario y búsqueda.
- [ ] Impresión de bitácora funciona.

**Evidencia a guardar:** archivo JSON exportado + captura de bitácora.

### 7.2 Ayuda (`ayuda.html`)

- [ ] Buscador de temas filtra el acordeón.
- [ ] 21 temas presentes (inicio rápido, ciclo, módulos, límites, glosario, FAQ, contacto).
- [ ] Aviso profesional permanente visible.
- [ ] Copiar aviso al portapapeles.
- [ ] Glosario contable básico con ≥ 25 términos.
- [ ] FAQ con respuestas para defensa.
- [ ] Límites legales y de LocalStorage declarados.
- [ ] Datos de contacto del proyecto (participantes, tutora, facilitador, director, centro, carrera, ubicación, año).
- [ ] Impresión fuerza acordeones abiertos y oculta controles.

**Evidencia a guardar:** captura de glosario y de límites legales.

### 7.3 Documentación técnica (`documentacion.html`)

- [ ] Carga como página **pública** (en `publicRoutes`, no exige sesión).
- [ ] Índice lateral con 7 documentos.
- [ ] Selector de documento funciona.
- [ ] Markdown renderizado correctamente (mediante `marked` por CDN).
- [ ] Enlaces internos entre documentos navegan sin recargar la página.
- [ ] Los 7 archivos Markdown presentes en `docs/`:
  - [ ] `README.md`
  - [ ] `arquitectura-tecnica.md`
  - [ ] `contrato-de-datos.md`
  - [ ] `ciclo-contable-implementado.md`
  - [ ] `manual-de-defensa.md`
  - [ ] `presentacion-academica.md`
  - [ ] `checklist-evidencia-y-anexos.md` (este archivo)
- [ ] Impresión de sección oculta menú y controles.
- [ ] Accesible desde la URL pública tras despliegue.

**Evidencia a guardar:** captura de `documentacion.html` con un documento renderizado.

### 7.4 Verificación de despliegue (`prueba-despliegue.html`)

- [ ] Carga sin errores.
- [ ] Ejecuta batería de checks automáticos.
- [ ] Indicadores en verde para: Config, Utils, Storage, Contabilidad, Mayor/Balanza, LocalStorage, rutas relativas, menú relativo.
- [ ] Advertencias amarillas aceptables solo en módulos opcionales.
- [ ] Copiar informe técnico al portapapeles.
- [ ] Botón “Repetir” re-ejecuta los checks.
- [ ] Accesible desde la URL pública.

**Evidencia a guardar:** captura del informe con mayoría en verde.

---

## 8. Responsive e impresión (Fase 14)

- [ ] Menú lateral fijo en escritorio, sin scroll horizontal de página.
- [ ] En móvil: botón ☰ abre menú, se cierra al seleccionar, backdrop funciona, Escape cierra.
- [ ] Tablas anchas scrollean **dentro de su contenedor**, no arrastran la página.
- [ ] Modales ajustados en pantallas pequeñas.
- [ ] Badges de estado uniformes (abierto, en revisión, cerrado, pendiente, vencida, resuelta, anulada).
- [ ] Impresión de cada módulo oculta sidebar, topbar y controles.
- [ ] Encabezado de reporte (`cc-report-header`) aparece solo al imprimir.
- [ ] Ayuda imprime con acordeones abiertos.
- [ ] Documentación imprime la sección actual limpia.
- [ ] No hay errores rojos graves en consola en ninguna pantalla.

**Evidencia a guardar:** captura móvil del menú abierto + captura de impresión de un reporte.

---

## 9. Evidencia para anexos del documento Word

> Lista numerada **fusionada**: los 20 anexos originales del proyecto + los anexos técnicos nuevos del prototipo. Copiar este índice al final del documento Word.

### Anexos del modelo de servicio (originales)

1. Encuesta aplicada a microempresarios comerciales.
2. Guía de entrevista a comerciantes.
3. Formato de diagnóstico contable inicial.
4. Modelo de contrato de prestación de servicios.
5. Cláusula de confidencialidad y protección de datos.
6. Capturas del sistema contable digital.
7. Diagrama de base de datos (en el prototipo: contrato de datos / colecciones JSON).
8. Flujograma del proceso en ocho pasos.
9. Organigrama del emprendimiento.
10. Logotipo y manual básico de marca.
11. Catálogo digital de servicios.
12. Ejemplo de reporte mensual para el cliente.
13. Calendario tributario simplificado.
14. Material didáctico para talleres.
15. Fotografías del espacio de trabajo.
16. Presupuestos cotizados de equipos y servicios.
17. Cronograma de implementación.
18. Acta de validación con clientes piloto.
19. Testimonios de comerciantes.
20. Manual de usuario del sistema.

### Anexos técnicos nuevos (del prototipo implementado)

21. URL pública del prototipo en GitHub Pages.
22. Captura del workflow de GitHub Actions desplegado correctamente (en verde).
23. Captura de la configuración de GitHub Pages (Source: GitHub Actions).
24. Informe de la página de verificación de despliegue (`prueba-despliegue.html`).
25. Documentación técnica: arquitectura del prototipo (`docs/arquitectura-tecnica.md`).
26. Documentación técnica: contrato de datos (`docs/contrato-de-datos.md`).
27. Documentación técnica: ciclo contable implementado (`docs/ciclo-contable-implementado.md`).
28. Ejemplo de respaldo JSON exportado desde el módulo Respaldo.
29. Captura de la bitácora de acciones con trazabilidad de un cierre y reapertura.
30. Capturas del Libro Diario con asiento cuadrado y IVA desglosado.
31. Capturas del Libro Mayor con ficha de cuenta y saldo corrido.
32. Capturas de la Balanza de comprobación y ajustada con indicadores de cuadratura.
33. Capturas del módulo Ajustes con depreciación de activo y control anti-duplicidad.
34. Capturas de Estados Financieros con verificación Activo = Pasivo + Patrimonio.
35. Capturas del módulo Costos e Indicadores con punto de equilibrio.
36. Capturas del módulo Alertas con tipos y niveles.
37. Captura del Reporte mensual en lenguaje sencillo.
38. Captura de la Ayuda con glosario y límites legales.
39. Captura de la página de Documentación técnica renderizada.
40. Captura de la landing pública (desktop y móvil).
41. Guion de defensa y distribución de roles (`docs/manual-de-defensa.md`).
42. Presentación académica sugerida (`docs/presentacion-academica.md`).
43. Video corto de demostración del flujo contable completo (enlace o QR).
44. Enlace al repositorio público con historial de commits.

**Evidencia a guardar:** carpeta `anexos/` con un archivo por anexo, nombrado `anexo-XX-descripcion.ext`.

---

## 10. Video de defensa (plan B y evidencia)

- [ ] Duración: 4 a 6 minutos.
- [ ] Grabado en 1080p, con audio claro (micrófono o auricular).
- [ ] Guion mínimo cubierto:
  - [ ] Portada y problema (10 s).
  - [ ] Login (10 s).
  - [ ] Generar asientos automáticos en Diario (30 s).
  - [ ] Libro Mayor con ficha de cuenta (20 s).
  - [ ] Balanza ajustada cuadrada (20 s).
  - [ ] Registrar ajuste de depreciación (20 s).
  - [ ] Estados Financieros con verificación (30 s).
  - [ ] Costos e indicadores con punto de equilibrio (20 s).
  - [ ] Generar alertas (20 s).
  - [ ] Reporte mensual en lenguaje sencillo (30 s).
  - [ ] Exportar respaldo JSON (15 s).
  - [ ] Abrir documentación y verificación de despliegue en verde (20 s).
  - [ ] Cierre con aviso profesional (10 s).
- [ ] Subido a un enlace accesible (YouTube no listado, Drive con permiso, o archivo local en la carpeta de entrega).
- [ ] Probado en el equipo del CEA antes de la defensa.
- [ ] Copia local en USB por si no hay internet.

**Evidencia a guardar:** archivo de video + enlace.

---

## 11. Carpeta de entrega al CEA (estructura sugerida)

Organizar la carpeta que se entrega (física o digital) así:

```text
ENTREGA_CUENTAS_CLARAS/
│
├── 01_DOCUMENTO/
│   └── Proyecto_Emprendimiento_Productivo_Cuentas_Claras.docx
│   └── Proyecto_Emprendimiento_Productivo_Cuentas_Claras.pdf
│
├── 02_ANEXOS/
│   ├── anexo-01-encuesta.pdf
│   ├── anexo-02-entrevista.pdf
│   ├── ...
│   ├── anexo-21-url-publica.png
│   ├── anexo-22-github-actions-verde.png
│   ├── anexo-24-verificacion-despliegue.png
│   ├── anexo-25-arquitectura-tecnica.pdf
│   ├── anexo-26-contrato-de-datos.pdf
│   ├── anexo-27-ciclo-contable.pdf
│   ├── anexo-28-respaldo-ejemplo.json
│   ├── ...
│   └── anexo-44-repositorio-enlace.txt
│
├── 03_CODIGO/
│   └── (copia del repositorio en ZIP o enlace al repo público)
│
├── 04_VIDEO/
│   └── demo_cuentas_claras.mp4
│
├── 05_PRESENTACION/
│   └── defensa_cuentas_claras.pptx
│   └── defensa_cuentas_claras.pdf
│
├── 06_RESPALDOS/
│   └── cuentas-claras-respaldo-YYYYMMDD.json
│
└── 07_README_ENTREGA.txt
```

El `07_README_ENTREGA.txt` debe contener:

```text
CUENTAS CLARAS – Gestión Contable Digital
Prototipo académico · C.E.A. Santísima Trinidad · Trinidad, Beni · 2026

Participantes: Lizi Francia Mansilla Vaca · Milton Daniel Hipamo Cholima
Tutora: Lic. Sarita Ignacia
Facilitador: Lic. Edgar Aquilino
Director: Lic. Miguel Valencia Mazi

URL pública: https://usuario.github.io/repositorio/
Repositorio: https://github.com/usuario/repositorio

Para abrir el prototipo local:
1. Descomprimir 03_CODIGO.
2. Abrir con Live Server (VS Code) o cualquier servidor estático local.
3. Login demo: admin / Admin123  ·  contador / Contador123.

Para importar datos de demostración:
Respaldo → Importar respaldo → seleccionar 06_RESPALDOS/*.json → modo Reemplazar.

Aviso profesional: el prototipo es académico, informativo y preventivo.
No sustituye la firma de un Contador Público Autorizado cuando la normativa lo exija.
No declara automáticamente ante el SIN. Los datos se guardan en LocalStorage del navegador.
```

---

## 12. Reparto de preparación (quién hace qué)

| Tarea | Responsable | Plazo sugerido |
|---|---|---|
| Subir repositorio y configurar Pages + Actions | Milton | 5 días antes |
| Verificar URL pública en celular y en otra red | Milton | 4 días antes |
| Generar `prueba-despliegue.html` en verde y capturar | Milton | 4 días antes |
| Exportar respaldo JSON de demostración y guardarlo | Milton | 4 días antes |
| Actualizar documento Word con las secciones de Fase 16 | Lizi | 5 días antes |
| Revisar coherencia documento ↔ prototipo (título, objetivos, 4.2, 4.3, 4.4, 5, 7.4, 9.2, anexos) | Lizi | 4 días antes |
| Armar índice de anexos 1–44 y generar archivos | Lizi | 3 días antes |
| Grabar y editar video de defensa | Ambos | 3 días antes |
| Armar presentación (deck) con las 15 láminas + 5 de respaldo | Ambos | 2 días antes |
| Ensayar guion con cronómetro (15 min) | Ambos | 2 días antes |
| Ensayar transición de demo (Milton opera, Lizi narra) | Ambos | 1 día antes |
| Preparar USB con plan B (código local, video, PDFs, JSON) | Milton | 1 día antes |
| Imprimir documentación técnica y checklist para el tribunal | Lizi | Día de la defensa |

---

## 13. Checklist de última hora

### 24 horas antes

- [ ] URL pública probada desde celular con datos móviles (no solo Wi-Fi).
- [ ] Video reproducido en el equipo del CEA.
- [ ] Deck abierto en el equipo del CEA, sin reemplazo de fuente.
- [ ] Documento Word finalizado y exportado a PDF.
- [ ] Respaldo JSON exportado con datos semilla + asientos generados.
- [ ] USB con plan B preparado.

### 1 hora antes

- [ ] Abrir navegador con la URL pública en una pestaña.
- [ ] Abrir proyecto local con Live Server en otra pestaña (plan B).
- [ ] Abrir `prueba-despliegue.html` y confirmar verde.
- [ ] Abrir `documentacion.html` y dejarla lista.
- [ ] Cargar datos semilla si el navegador público está vacío.
- [ ] Generar asientos automáticos en Diario para el cliente de demo.
- [ ] Tener login listo (no escribir credenciales en vivo).
- [ ] Probar micrófono / audio del equipo del CEA.
- [ ] Ensayar la frase de apertura en voz alta.

### 10 minutos antes

- [ ] Respirar.
- [ ] Confirmar reparto de bloques con el compañero.
- [ ] Confirmar quién opera el navegador en la demo.
- [ ] Tener a mano: documento impreso, USB, celular con URL abierta.
- [ ] Recordar las tres frases ancla: apertura, mensaje central, cierre.

---

## 14. Señales de alarma y corrección rápida

| Síntoma | Causa probable | Corrección |
|---|---|---|
| Landing sin estilos en GitHub Pages | Ruta absoluta `/css` o nombre con mayúscula | Cambiar a `./css/...` y renombrar en minúsculas |
| Pantalla en blanco tras login | JS con error o ruta de módulo mal cargada | Abrir consola (F12), revisar 404 de `.js` |
| Balanza descuadrada | Asiento manual mal capturado o cuenta sin naturaleza | Revisar Diario, anular asiento malo, regenerar |
| Balance no cuadra | IT no considerado o temporal mal clasificada | Verificar que EE.FF. use balanza ajustada sin cierre y sume IT al pasivo informativo |
| Depreciación duplicada | Bug de anti-duplicidad o datos importados | Revisar asientos tipo `depreciacion` por activo y periodo |
| Periodo cerrado no bloquea | Estado no guardado o validación omitida | Revisar `closePeriod` y los guards de los módulos |
| Alertas duplicadas | Estado `resuelta` no respetado en `findExisting` | Verificar `activeStates()` en `alertas.js` |
| Respaldo no importa | Estructura inválida o versión 1 sin colecciones nuevas | Validar antes de importar; fusionar en vez de reemplazar si hay dudas |
| `documentacion.html` no carga Markdown | Abierto con `file://` (CORS) o `marked` bloqueado | Servir con Live Server o acceder por URL pública |
| `prueba-despliegue.html` en rojo en LocalStorage | Navegador en modo privado restrictivo | Probar en ventana normal; declarar el límite en defensa |

---

## 15. Firma de preparación

> Espacio para que ambos participantes confirmen, antes de entrar a defensa, que todo lo marcado está efectivamente listo.

```text
He revisado y verificado personalmente cada casilla de este checklist.
El prototipo está desplegado, documentado y es verificable por un tercero.
Los límites profesionales están declarados en el sistema y en el documento.

Participante 1: ______________________________  Fecha: ____ / ____ / 2026
   Lizi Francia Mansilla Vaca

Participante 2: ______________________________  Fecha: ____ / ____ / 2026
   Milton Daniel Hipamo Cholima

V°B° Tutora: ______________________________  Fecha: ____ / ____ / 2026
   Lic. Sarita Ignacia
```

---

## Mensaje final de este checklist

Este documento no es burocracia. Es la prueba de que el proyecto pasó de la idea al hecho.

Si todas las casillas están marcadas, el tribunal no tendrá que creerles: tendrá que verificarlo. Y eso, en un proyecto de Técnico Medio en Contabilidad con componente tecnológico, es la diferencia entre “hicimos un sistema” y “diseñamos, implementamos, documentamos y desplegamos un modelo de gestión contable digital verificable”.

Contabilidad simple, decisiones claras. Evidencia pública, defensa sólida.
