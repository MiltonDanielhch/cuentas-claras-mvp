# 🌐 Auditoría Frontend (HTML, CSS/Bootstrap, JS) — cuentas-claras-mvp

> Generado: `2026-10-31 16:39`

## Resumen Web

| Métrica | Valor |
| :--- | :--- |
| **Proyecto** | `cuentas-claras-mvp` |
| **Líneas de Código Frontend** | 25219 LoC |
| **Peso Total Web** | 944.85KB |
| **Archivos Web analizados** | 55 |

## Desglose por Capa

| Capa / Directorio | Archivos | LoC | Comentarios | Peso | % LoC |
| :--- | ---: | ---: | ---: | ---: | ---: |
| `modules` | 21 | 11335 | 0 | 426.26KB | 44.9% ████████ |
| `js` | 8 | 2150 | 175 | 82.75KB | 8.5% █ |
| `css` | 3 | 1998 | 115 | 46.89KB | 7.9% █ |
| `data` | 2 | 1931 | 0 | 62.70KB | 7.7% █ |
| `workflows` | 0 | 0 | 0 | 0.00B | 0.0%  |
| **TOTAL WEB** | — | **25219** | — | **944.85KB** | 100% |

## Desglose por Extensión Web

| Extensión | Archivos | LoC | Peso |
| :--- | ---: | ---: | ---: |
| `.js` | 31 | 15416 | 571.71KB |
| `.html` | 21 | 7805 | 326.25KB |
| `.css` | 3 | 1998 | 46.89KB |

## Mapa de Arquitectura Frontend

```text
cuentas-claras-mvp/
├── 404.html (67 LoC | 2.62KB) [5 comentarios]
├── ajustes.html (240 LoC | 11.75KB) [1 comentarios]
├── alertas.html (251 LoC | 11.42KB) [1 comentarios]
├── ayuda.html (1132 LoC | 54.98KB) [30 comentarios]
├── balanza.html (189 LoC | 9.58KB)
├── clientes.html (421 LoC | 14.75KB) [11 comentarios]
├── costos-indicadores.html (249 LoC | 11.61KB)
├── dashboard.html (355 LoC | 14.04KB) [11 comentarios]
├── documentacion.html (346 LoC | 10.73KB)
├── documentos.html (426 LoC | 15.08KB) [11 comentarios]
├── estados-financieros.html (190 LoC | 9.12KB)
├── impuestos.html (349 LoC | 12.80KB) [10 comentarios]
├── index.html (1050 LoC | 46.62KB) [46 comentarios]
├── libro-diario.html (540 LoC | 19.72KB) [11 comentarios]
├── libro-mayor.html (157 LoC | 7.76KB) [4 comentarios]
├── login.html (145 LoC | 5.68KB) [5 comentarios]
├── periodos.html (349 LoC | 12.19KB) [11 comentarios]
├── prueba-despliegue.html (201 LoC | 6.75KB) [3 comentarios]
├── reportes.html (163 LoC | 7.76KB)
├── respaldo.html (475 LoC | 23.19KB) [6 comentarios]
├── transacciones.html (510 LoC | 18.09KB) [11 comentarios]
├── .github/ [0.00B]
│   └── workflows/ [0.00B]
├── css/ [46.89KB]
│   ├── landing.css (968 LoC | 22.01KB) [30 comentarios]
│   ├── print.css (155 LoC | 4.08KB) [15 comentarios]
│   └── styles.css (875 LoC | 20.80KB) [70 comentarios]
├── docs/ [0.00B]
└── js/ [571.71KB]
    ├── app.js (244 LoC | 8.99KB) [13 comentarios]
    ├── auth.js (107 LoC | 2.59KB) [4 comentarios]
    ├── config.js (428 LoC | 20.70KB) [49 comentarios]
    ├── landing.js (141 LoC | 4.63KB) [5 comentarios]
    ├── layout.js (282 LoC | 10.32KB) [16 comentarios]
    ├── prueba-despliegue.js (338 LoC | 12.50KB) [5 comentarios]
    ├── storage.js (391 LoC | 13.84KB) [35 comentarios]
    ├── utils.js (219 LoC | 9.19KB) [48 comentarios]
    ├── data/ [62.70KB]
    │   ├── seed-emprendimiento.js (1121 LoC | 42.16KB) [117 comentarios]
    │   └── seed.js (810 LoC | 20.53KB) [5 comentarios]
    └── modules/ [426.26KB]
        ├── ajustes.js (710 LoC | 28.64KB) [5 comentarios]
        ├── alertas.js (1009 LoC | 38.96KB) [5 comentarios]
        ├── ayuda.js (97 LoC | 3.72KB) [5 comentarios]
        ├── balanza.js (238 LoC | 10.90KB) [5 comentarios]
        ├── bitacora.js (41 LoC | 1.30KB) [4 comentarios]
        ├── cierre.js (250 LoC | 8.64KB) [9 comentarios]
        ├── clientes.js (519 LoC | 18.64KB) [4 comentarios]
        ├── contabilidad.js (598 LoC | 19.28KB) [5 comentarios]
        ├── costos.js (420 LoC | 15.95KB) [17 comentarios]
        ├── documentacion.js (182 LoC | 6.28KB) [5 comentarios]
        ├── documentos.js (688 LoC | 24.10KB) [4 comentarios]
        ├── estados-financieros.js (704 LoC | 27.36KB) [16 comentarios]
        ├── impuestos.js (815 LoC | 28.89KB) [4 comentarios]
        ├── indicadores.js (526 LoC | 21.47KB) [5 comentarios]
        ├── libro-diario.js (951 LoC | 34.88KB) [5 comentarios]
        ├── libro-mayor.js (273 LoC | 12.47KB) [5 comentarios]
        ├── mayor-balanza.js (304 LoC | 12.36KB) [39 comentarios]
        ├── periodos.js (543 LoC | 19.24KB) [4 comentarios]
        ├── reportes.js (1066 LoC | 40.61KB) [5 comentarios]
        ├── respaldo.js (531 LoC | 21.87KB) [6 comentarios]
        └── transacciones.js (870 LoC | 30.71KB) [4 comentarios]
```
