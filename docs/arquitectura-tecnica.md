# Arquitectura técnica del prototipo Cuentas Claras

## 1. Tipo de sistema

Cuentas Claras fue implementado como una **aplicación web estática**, sin backend, sin base de datos servida y sin dependencias de servidor propio.

Esto fue elegido deliberadamente por tres razones académicas:

1. **Reproducibilidad:** cualquier evaluador puede abrir el prototipo desde un navegador.
2. **Evidencia técnica:** el código fuente es visible y verificable.
3. **Despliegue gratuito:** puede publicarse en GitHub Pages para defensa académica.

---

## 2. Stack tecnológico

| Capa | Tecnología | Uso en el prototipo |
|---|---|---|
| Estructura | HTML5 | Pantallas del sistema |
| Presentación | CSS3 | Estilos responsive e impresión |
| Framework visual | Bootstrap 5 | Componentes, grids, modales, acordeones |
| Iconografía | Bootstrap Icons | Lectura rápida de módulos y estados |
| Lógica | JavaScript vanilla | Validaciones, navegación, cálculos contables |
| Almacenamiento | LocalStorage | Persistencia local en el navegador |
| Formato de respaldo | JSON | Exportación, importación y evidencia |
| Despliegue | GitHub Pages | Publicación estática |
| Automatización | GitHub Actions | Workflow de despliegue |

---

## 3. Diagrama lógico del sistema

```text
Navegador del usuario
│
├── Interfaz web
│   ├── Landing pública
│   ├── Login demo
│   ├── Dashboard
│   └── Módulos internos
│
├── Motor de almacenamiento local
│   ├── LocalStorage
│   ├── Colecciones JSON
│   ├── Contadores de ID
│   └── Respaldo / importación / reset
│
├── Motor contable
│   ├── Transacciones
│   ├── Libro Diario
│   ├── Libro Mayor
│   ├── Balanza de comprobación
│   ├── Ajustes
│   ├── Balanza ajustada
│   ├── Estados Financieros
│   ├── Cierre contable
│   └── Costos e indicadores
│
├── Capa preventiva
│   ├── Impuestos informativos
│   ├── Obligaciones
│   └── Alertas
│
├── Capa de entrega
│   ├── Reporte mensual sencillo
│   ├── Ayuda y glosario
│   └── Snapshots de evidencia
│
└── Despliegue público
    ├── GitHub Pages
    └── Página de verificación técnica
```

---

## 4. Principio arquitectónico central

El prototipo sigue una regla contable y técnica fundamental:

> El Libro Diario es la fuente principal de verdad contable.  
> El Libro Mayor, la Balanza, los Estados Financieros y los indicadores no se guardan como tablas independientes, sino que se calculan en vivo desde las líneas de asiento vigentes del Diario.

Esto evita:

- duplicar información;
- desincronizar saldos;
- editar resultados manualmente;
- romper trazabilidad.

---

## 5. Componentes funcionales

### A. Registro operativo

- Clientes
- Periodos
- Documentos
- Transacciones

### B. Tributario preventivo

- Impuestos informativos
- Obligaciones
- Alertas tributarias

### C. Ciclo contable digital

- Libro Diario
- Libro Mayor
- Balanza de comprobación
- Ajustes contables
- Balanza ajustada
- Estados Financieros
- Cierre contable

### D. Análisis y entrega

- Costos e indicadores
- Alertas operativas
- Reporte mensual en lenguaje sencillo
- Ayuda y manual

### E. Sistema y evidencia

- Respaldo JSON
- Importación/exportación
- Datos semilla
- Restablecimiento
- Bitácora
- Verificación de despliegue

---

## 6. Flujo de datos principal

```text
Cliente
  ↓
Periodo
  ↓
Documento
  ↓
Transacción
  ↓
Asiento en Libro Diario
  ↓
Libro Mayor
  ↓
Balanza de comprobación
  ↓
Ajustes
  ↓
Balanza ajustada
  ↓
Estados Financieros
  ↓
Costos e indicadores
  ↓
Alertas y reporte mensual
  ↓
Respaldo / evidencia
```

---

## 7. Reglas técnicas implementadas

- Los asientos deben cuadrar: total débitos = total créditos.
- Las transacciones activas pueden generar asientos automáticos.
- Los asientos manuales permiten capturar operaciones especiales.
- La anulación no elimina registros: cambia estado a `anulado`.
- Los periodos cerrados bloquean nuevos registros contables.
- La Balanza de comprobación excluye ajustes y cierres.
- La Balanza ajustada incluye ajustes, pero excluye cierres para EE.FF. vivos.
- Los cierres generan asientos tipo `cierre`.
- Los reportes y snapshots guardan evidencia sin alterar cálculos vivos.
- El respaldo JSON permite exportar, importar, fusionar o reemplazar colecciones.

---

## 8. Despliegue

El proyecto se despliega mediante GitHub Actions.

Workflow principal:

```text
.github/workflows/deploy.yml
```

Proceso:

1. Se hace push a la rama `main`.
2. GitHub Actions ejecuta el workflow.
3. Se prepara el sitio estático.
4. Se sube artefacto a GitHub Pages.
5. Se publica la URL pública.

URL esperada:

```text
https://usuario.github.io/repositorio/
```

---

## 9. Página de verificación técnica

El prototipo incluye:

```text
prueba-despliegue.html
```

Esta página confirma:

- carga de módulos JavaScript;
- disponibilidad de LocalStorage;
- rutas relativas correctas;
- presencia de motores contables;
- configuración de avisos profesionales;
- estado general del despliegue.

Es una evidencia muy útil para defensa porque permite mostrar que el sistema no solo “abre”, sino que carga correctamente sus componentes técnicos.

---

## 10. Límites técnicos honestos

El prototipo es académico y estático. Por tanto:

- Los datos se guardan solo en el navegador actual.
- No hay sincronización automática entre dispositivos.
- No hay backend productivo.
- No hay cifrado real.
- No hay roles avanzados server-side.
- No hay base de datos relacional servida.
- No declara automáticamente ante el SIN.
- No sustituye la firma de un Contador Público Autorizado cuando la normativa lo exija.

Estos límites no debilitan el proyecto; lo hacen responsable y defendible.

---

## 11. Proyección técnica futura

Para una versión productiva se podría migrar a:

- base de datos relacional;
- backend seguro;
- autenticación real;
- roles y permisos;
- cifrado en tránsito y reposo;
- respaldos automáticos en la nube;
- facturación electrónica;
- app móvil;
- integración bancaria;
- auditoría externa.
