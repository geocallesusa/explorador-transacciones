# Explorador de transacciones

Aplicación web construida con React y Vite para normalizar, validar y explorar transacciones de dinero provenientes de múltiples fuentes.

## ¿Qué hace?

- Carga archivos JSON desde el navegador.
- Detecta la estructura y la fuente de cada transacción.
- Normaliza campos como ID, monto, moneda, fecha y estado.
- Descarta registros inválidos y muestra el motivo de rechazo.
- Presenta métricas de registros válidos, inválidos y totales.
- Permite explorar y filtrar transacciones con una interfaz interactiva.

## Reglas principales

La aplicación convierte los datos a un formato común con estas convenciones:

- ID correlativo: se genera como secuencia desde 0001.
- ID de fuente: se conserva como texto.
- Monto: se limpia, elimina símbolos de moneda y normaliza decimales.
- Moneda: se convierte a abreviaturas ISO 4217.
- Timestamp: se estandariza a formato yyyy-MM-dd hh:mm:ss.
- Estado: se valida entre los valores soportados.

## Archivos de prueba

El proyecto incluye archivos JSON de ejemplo en la carpeta public:

- transacciones-validas-1.json
- transacciones-validas-2.json
- transacciones-invalidas.json

## Cómo ejecutar

1. Instala dependencias:
   npm install
2. Inicia el entorno de desarrollo:
   npm run dev -- --host 0.0.0.0
3. Abre la aplicación en el navegador:
   http://localhost:5173/

## Estructura del proyecto

- src/App.jsx: interfaz principal y filtros.
- src/lib/transactions.js: lógica de normalización y validación.
- src/config/rules.js: mapeo de estados, monedas y formatos soportados.
- public/: archivos JSON de ejemplo y recursos estáticos.

## Validación

El sistema calcula métricas para:

- total procesado
- registros válidos
- registros inválidos
- porcentaje de validez

## Objetivo del proyecto

Facilitar la limpieza y exploración de datos transaccionales heterogéneos en un flujo simple, claro y visual, sin necesidad de backend.
