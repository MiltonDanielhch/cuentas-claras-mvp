# Plan de pruebas – Cuentas Claras MVP

## Objetivo

Este documento sirve para registrar y ejecutar pruebas del prototipo durante su desarrollo.

Las pruebas buscan asegurar que el sistema:

- guarde datos correctamente;
- respete reglas contables básicas;
- sea usable en celular y computadora;
- pueda desplegarse en GitHub Pages;
- sirva como evidencia académica del proyecto de Contabilidad.

---

## Reglas generales de prueba

1. Toda prueba debe realizarse con datos de demostración o datos autorizados por el cliente piloto.
2. No usar información real sensible sin consentimiento.
3. Antes de cada fase, revisar consola del navegador para verificar errores.
4. Después de cada fase, guardar captura o evidencia cuando corresponda.
5. Si una prueba falla, corregir antes de avanzar a la siguiente fase.
6. Mantener este archivo actualizado como evidencia de validación.

---

## Herramientas mínimas de prueba

| Herramienta | Uso |
|---|---|
| Navegador Chrome, Edge o Firefox | Ejecutar el prototipo |
| Herramientas de desarrollo del navegador | Revisar consola, LocalStorage y red |
| Modo celular del navegador | Probar responsive |
| GitHub | Respaldo y despliegue |
| Editor de texto o VS Code | Edición de archivos |
| Servidor local opcional | Probar LocalStorage con mayor estabilidad |

---

# Fase 0 – Preparación del repositorio

## Objetivo de la fase

Dejar el proyecto listo para desarrollo y defensa, con documentación base y estructura definida.

## Archivos esperados

```text
cuentas-claras-mvp/
│
├── README.md
├── .gitignore
└── docs/
    ├── contrato-datos.md
    └── pruebas.md
```

## Prueba 0.1 – Estructura de carpetas

Pasos:

1. Crear carpeta `cuentas-claras-mvp`.
2. Crear carpeta `docs`.
3. Crear los cuatro archivos indicados.

Resultado esperado:

```text
La estructura coincide con la definida en README.
```

Checklist:

- [ ] Existe `README.md`.
- [ ] Existe `.gitignore`.
- [ ] Existe `docs/contrato-datos.md`.
- [ ] Existe `docs/pruebas.md`.
- [ ] No hay archivos temporales ni basura.

---

## Prueba 0.2 – Codificación de archivos

Pasos:

1. Abrir cada archivo en editor.
2. Verificar codificación UTF-8.
3. Revisar que los acentos y ñ se visualicen correctamente.

Resultado esperado:

```text
Los textos en español se leen sin caracteres corruptos.
```

Checklist:

- [ ] `README.md` en UTF-8.
- [ ] `contrato-datos.md` en UTF-8.
- [ ] `pruebas.md` en UTF-8.
- [ ] No hay símbolos extraños como `Ã`, `â€` o `ï»¿`.

---

## Prueba 0.3 – Contenido del README

El README debe contener como mínimo:

- nombre del proyecto;
- objetivo;
- stack;
- idioma;
- moneda;
- credenciales demo;
- limitaciones de LocalStorage;
- cómo ejecutar local;
- cómo desplegar en GitHub Pages;
- estructura de carpetas;
- fases previstas;
- aviso profesional;
- aviso de protección de datos.

Checklist:

- [ ] Nombre del proyecto presente.
- [ ] Objetivo presente.
- [ ] Stack presente.
- [ ] Credenciales demo presentes.
- [ ] Limitaciones de LocalStorage presentes.
- [ ] Instrucciones de ejecución local presentes.
- [ ] Instrucciones de GitHub Pages presentes.
- [ ] Estructura de carpetas presente.
- [ ] Aviso de Contador Público Autorizado presente.

---

## Prueba 0.4 – Contenido del .gitignore

El archivo `.gitignore` debe ignorar al menos:

```text
.DS_Store
Thumbs.db
node_modules/
dist/
backup-local/
*.log
```

Checklist:

- [ ] `.DS_Store` ignorado.
- [ ] `Thumbs.db` ignorado.
- [ ] `node_modules/` ignorado.
- [ ] `dist/` ignorado.
- [ ] `backup-local/` ignorado.
- [ ] `*.log` ignorado.

---

## Prueba 0.5 – Contrato de datos

El documento `docs/contrato-datos.md` debe definir:

- claves de LocalStorage;
- identificadores;
- formato de fechas;
- formato de montos;
- colección de usuarios;
- colección de clientes;
- colección de periodos;
- colección de documentos;
- colección de transacciones;
- colección de impuestos;
- colección de obligaciones;
- colección de alertas;
- colección de reportes;
- colección de bitácora;
- configuración;
- sesión;
- formato de respaldo;
- reglas de negocio mínimas.

Checklist:

- [ ] Claves `cc_` definidas.
- [ ] Prefijos de ID definidos.
- [ ] Fechas ISO definidas.
- [ ] Montos numéricos definidos.
- [ ] Usuarios definido.
- [ ] Clientes definido.
- [ ] Periodos definido.
- [ ] Documentos definido.
- [ ] Transacciones definido.
- [ ] Impuestos definido.
- [ ] Obligaciones definido.
- [ ] Alertas definido.
- [ ] Reportes definido.
- [ ] Bitácora definido.
- [ ] Configuración definido.
- [ ] Sesión definido.
- [ ] Respaldo JSON definido.
- [ ] Reglas de negocio definidas.

---

## Prueba 0.6 – Repositorio Git

Pasos:

1. Iniciar repositorio Git en la carpeta raíz:

   ```bash
   git init
   ```

2. Verificar estado:

   ```bash
   git status
   ```

3. Agregar archivos:

   ```bash
   git add .
   ```

4. Hacer primer commit:

   ```bash
   git commit -m "docs: fase 0 preparación del repositorio"
   ```

Resultado esperado:

```text
Git reconoce solo los archivos del proyecto y no incluye basura del sistema.
```

Checklist:

- [ ] Repositorio inicializado.
- [ ] `.gitignore` funciona.
- [ ] Primer commit realizado.
- [ ] No se incluyen archivos temporales.
- [ ] Mensaje de commit claro.

---

## Prueba 0.7 – Subida a GitHub

Pasos:

1. Crear repositorio vacío en GitHub llamado:

   ```text
   cuentas-claras-mvp
   ```

2. Conectar repositorio local.

3. Subir rama principal:

   ```bash
   git branch -M main
   git remote add origin https://github.com/tu-usuario/cuentas-claras-mvp.git
   git push -u origin main
   ```

Resultado esperado:

```text
Los archivos aparecen en GitHub y el repositorio está limpio.
```

Checklist:

- [ ] Repositorio creado en GitHub.
- [ ] Archivos subidos correctamente.
- [ ] README visible en GitHub.
- [ ] Carpeta `docs` visible.
- [ ] No hay archivos innecesarios.

---

## Criterio para avanzar a Fase 1

La Fase 0 se considera completa cuando:

- [ ] La estructura de carpetas existe.
- [ ] El README está claro y completo.
- [ ] El `.gitignore` está funcionando.
- [ ] El contrato de datos está definido.
- [ ] Este plan de pruebas está creado.
- [ ] El repositorio puede subirse a GitHub sin basura.
- [ ] No quedan decisiones abiertas sobre nombres, moneda, credenciales, impuestos referenciales o vencimiento demo.

---

# Fase 1 – Núcleo técnico y shell visual

## Objetivo

Crear la base del sistema: login, menú, dashboard, storage, seed, auth y layout.

## Pruebas anticipadas

Cuando se desarrolle Fase 1, se deberá verificar:

- [ ] `index.html` carga sin errores.
- [ ] Login permite ingresar con credenciales demo.
- [ ] Sesión persiste al recargar.
- [ ] Logout cierra sesión.
- [ ] Páginas protegidas redirigen a login si no hay sesión.
- [ ] Dashboard muestra estructura base.
- [ ] Menú lateral se ve correctamente.
- [ ] Menú funciona en celular.
- [ ] LocalStorage guarda y lee datos.
- [ ] Datos semilla cargan correctamente.
- [ ] Exportar respaldo básico funciona.
- [ ] Consola del navegador no muestra errores rojos.

---

# Fase 2 – Clientes y periodos

## Pruebas anticipadas

- [ ] Crear cliente.
- [ ] Editar cliente.
- [ ] Desactivar cliente.
- [ ] Buscar cliente.
- [ ] Abrir periodo para cliente.
- [ ] Impedir periodo duplicado mismo cliente, mes y año.
- [ ] Cerrar periodo.
- [ ] Reabrir periodo con registro en bitácora.
- [ ] Ver tablas responsive.

---

# Fase 3 – Documentos y transacciones

## Pruebas anticipadas

- [ ] Registrar documento.
- [ ] Vincular documento a cliente y periodo.
- [ ] Marcar documento como pendiente, recibido, validado o rechazado.
- [ ] Registrar transacción de venta.
- [ ] Registrar transacción de compra.
- [ ] Registrar gasto.
- [ ] Vincular transacción a documento.
- [ ] Anular transacción.
- [ ] Bloquear registro en periodo cerrado.
- [ ] Filtrar por cliente, periodo y tipo.

---

# Fase 4 – Impuestos y obligaciones

## Pruebas anticipadas

- [ ] Seleccionar cliente.
- [ ] Seleccionar periodo.
- [ ] Calcular IVA débito.
- [ ] Calcular IVA crédito.
- [ ] Calcular IVA por pagar.
- [ ] Calcular IT estimado.
- [ ] Mostrar RC-IVA como referencia si aplica.
- [ ] Generar obligación tributaria.
- [ ] Asignar vencimiento día 20 del mes siguiente.
- [ ] Mostrar aviso de cálculo informativo.

---

# Fase 5 – Alertas

## Pruebas anticipadas

- [ ] Generar alerta por vencimiento próximo.
- [ ] Generar alerta por vencimiento pasado.
- [ ] Generar alerta por documento pendiente.
- [ ] Generar alerta por periodo sin cerrar.
- [ ] Generar alerta por transacción sin documento.
- [ ] Marcar alerta como vista.
- [ ] Resolver alerta.
- [ ] Copiar mensaje para WhatsApp.
- [ ] Abrir enlace de WhatsApp.
- [ ] Mostrar alertas en dashboard.

---

# Fase 6 – Reporte mensual

## Pruebas anticipadas

- [ ] Seleccionar cliente.
- [ ] Seleccionar periodo.
- [ ] Generar vista previa.
- [ ] Mostrar ventas, compras, gastos y utilidad estimada.
- [ ] Mostrar impuestos estimados.
- [ ] Mostrar documentos pendientes.
- [ ] Mostrar alertas.
- [ ] Mostrar recomendaciones.
- [ ] Imprimir reporte.
- [ ] Guardar como PDF desde navegador.
- [ ] Verificar estilos de impresión.
- [ ] Verificar lectura en celular.

---

# Fase 7 – Respaldo

## Pruebas anticipadas

- [ ] Exportar respaldo JSON.
- [ ] Importar respaldo JSON válido.
- [ ] Rechazar JSON inválido.
- [ ] Cargar datos semilla.
- [ ] Restablecer sistema.
- [ ] Ver bitácora.
- [ ] Verificar que IDs no se dupliquen incorrectamente.
- [ ] Verificar que contadores se restauren o mantengan correctamente.

---

# Fase 8 – Ayuda y manual

## Pruebas anticipadas

- [ ] Abrir ayuda.
- [ ] Leer guía rápida.
- [ ] Entender flujo de creación de cliente.
- [ ] Entender flujo de registro documental.
- [ ] Entender flujo de reporte.
- [ ] Ver aviso de LocalStorage.
- [ ] Ver aviso de Contador Público Autorizado.

---

# Fase 9 – Responsive y pulido

## Pruebas anticipadas

- [ ] Abrir sistema en ancho 360 px.
- [ ] Navegar todos los módulos.
- [ ] Crear cliente desde celular.
- [ ] Registrar transacción desde celular.
- [ ] Ver reporte desde celular.
- [ ] Verificar que no haya desbordes horizontales.
- [ ] Verificar botones tocables.
- [ ] Verificar formularios móviles.
- [ ] Verificar estados vacíos.

---

# Fase 10 – GitHub Pages

## Pruebas anticipadas

- [ ] Publicar en GitHub Pages.
- [ ] Abrir URL pública.
- [ ] Verificar carga de CSS.
- [ ] Verificar carga de JS.
- [ ] Verificar login.
- [ ] Verificar LocalStorage en dominio publicado.
- [ ] Verificar rutas relativas.
- [ ] Verificar página 404.
- [ ] Verificar reporte imprimible.

---

# Fase 11 – Validación con clientes piloto

## Objetivo

Demostrar que el modelo contable digital funciona con microempresas reales.

## Clientes piloto sugeridos

```text
1. Tienda de barrio
2. Puesto de mercado
3. Ferretería pequeña o abarrotería
```

## Pruebas con usuarios reales

- [ ] Explicar el sistema al comerciante.
- [ ] Registrar cliente real o simulado autorizado.
- [ ] Abrir periodo real del mes.
- [ ] Recibir documentos del comerciante.
- [ ] Registrar documentos.
- [ ] Registrar transacciones.
- [ ] Calcular impuestos informativos.
- [ ] Generar alertas.
- [ ] Entregar reporte mensual.
- [ ] Medir tiempo de atención.
- [ ] Registrar observaciones.
- [ ] Guardar capturas.
- [ ] Guardar reporte PDF de ejemplo.
- [ ] Guardar respaldo JSON de prueba.
- [ ] Obtener testimonio corto si el cliente autoriza.

## Indicadores mínimos de validación

| Indicador | Meta mínima |
|---|---:|
| Clientes piloto atendidos | 3 |
| Documentos registrados | 10 o más |
| Transacciones registradas | 20 o más |
| Reportes generados | 3 |
| Alertas revisadas | 3 o más |
| Tiempo promedio de cierre por cliente | Menos de 4 horas |
| Satisfacción básica | 4 de 5 o más |
| Errores críticos después de prueba | 0 |

---

## Formato sugerido para registrar hallazgos

Copiar esta plantilla cada vez que se haga una prueba real:

```markdown
### Fecha

AAAA-MM-DD

### Cliente piloto

Nombre o código:

### Actividad realizada

- [ ] Diagnóstico
- [ ] Recepción documental
- [ ] Clasificación
- [ ] Registro digital
- [ ] Conciliación
- [ ] Cierre mensual
- [ ] Obligaciones tributarias
- [ ] Reporte y capacitación

### Tiempo invertido

Horas:

### Documentos recibidos

Cantidad:

### Documentos pendientes

Cantidad:

### Transacciones registradas

Cantidad:

### Errores encontrados

Descripción:

### Observaciones del comerciante

Descripción:

### Evidencia guardada

- [ ] Captura
- [ ] Reporte PDF
- [ ] Respaldo JSON
- [ ] Foto
- [ ] Acta
- [ ] Testimonio autorizado
```

---

## Criterio final de aprobación del prototipo

El prototipo se considera suficientemente válido para presentación académica cuando:

- [ ] Funciona login básico.
- [ ] Funciona dashboard.
- [ ] Permite registrar clientes.
- [ ] Permite abrir y cerrar periodos.
- [ ] Permite registrar documentos.
- [ ] Permite registrar transacciones.
- [ ] Permite calcular impuestos informativos.
- [ ] Permite generar alertas.
- [ ] Permite emitir reporte mensual imprimible.
- [ ] Permite exportar e importar respaldo JSON.
- [ ] Se ve aceptable en celular.
- [ ] Está desplegado en GitHub Pages o tiene evidencia de despliegue.
- [ ] Fue probado con al menos 3 clientes piloto o datos simulados equivalentes.
- [ ] Incluye avisos de LocalStorage y límite profesional.
```

---

# Checklist final de Fase 0

Antes de pasar a Fase 1, verifica esto:

- [ ] Creaste la carpeta `cuentas-claras-mvp`.
- [ ] Creaste la carpeta `docs`.
- [ ] Guardaste `README.md`.
- [ ] Guardaste `.gitignore`.
- [ ] Guardaste `docs/contrato-datos.md`.
- [ ] Guardaste `docs/pruebas.md`.
- [ ] Los archivos están en UTF-8.
- [ ] El README se lee bien.
- [ ] El contrato de datos define las estructuras base.
- [ ] El plan de pruebas incluye Fase 0 y fases futuras.
- [ ] Puedes inicializar Git sin errores.
- [ ] Puedes subir el repositorio a GitHub sin archivos basura.

---

# Comando sugerido para iniciar Git

Desde dentro de la carpeta `cuentas-claras-mvp`, puedes ejecutar:

```bash
git init
git add .
git commit -m "docs: fase 0 preparación del repositorio"
```

Si ya tienes repositorio en GitHub, después:

```bash
git branch -M main
git remote add origin https://github.com/tu-usuario/cuentas-claras-mvp.git
git push -u origin main
```

Cambia `tu-usuario` por tu nombre de usuario real de GitHub.

---

# Estado actual

**Fase 0 completada documentalmente.**

Ahora el proyecto tiene:

- nombre definido;
- enfoque en Contabilidad;
- stack definido;
- credenciales demo;
- moneda definida;
- impuestos referenciales definidos;
- vencimiento demo definido;
- contrato de datos base;
- plan de pruebas;
- estructura para no retroceder.

Cuando quieras, seguimos con la **Fase 1: núcleo técnico y shell visual**, y te paso los archivos completos en este orden:

```text
js/config.js
js/utils.js
js/storage.js
js/data/seed.js
js/modules/bitacora.js
js/auth.js
js/layout.js
js/app.js
css/styles.css
css/print.css
index.html
dashboard.html
404.html
```