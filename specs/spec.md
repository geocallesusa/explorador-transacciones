# Spec: Normalización y exploración de transacciones multifuente

## 1. Visión general
El producto es una aplicación web que permite cargar transacciones desde archivos JSON, detectar su origen o estructura, normalizarlas a un formato uniforme y explorar los resultados mediante una interfaz interactiva. La solución debe priorizar claridad, separación entre lógica y vista, y validación estricta de cada registro.

El proyecto debe seguir la guía de [AGENTS.md](../AGENTS.md), la base normativa de [docs/constitution.md](../docs/constitution.md), la especificación funcional de [specs/001](001) y el plan operativo de [specs/plan.md](plan.md).

## 2. Objetivo del producto
Permitir a un analista revisar un lote de transacciones provenientes de distintas fuentes, con el menor esfuerzo posible, sin depender de una salida por consola como único mecanismo de análisis.

La aplicación debe:
- cargar archivos JSON desde el navegador local;
- soportar múltiples estructuras de datos;
- detectar el formato o fuente de cada transacción;
- normalizar los datos a un esquema común;
- descartar registros inválidos con motivo explicitado;
- mostrar métricas del lote procesado;
- permitir filtrar, explorar y comparar los datos en una interfaz functional.

## 3. Alcance
### Incluye
- ingestión local de archivos JSON;
- reconocimiento de distintas convenciones de campos;
- transformación a un esquema final estándar;
- validación con rechazo explícito y métricas;
- presentación visual de resultados y descartes;
- reglas centralizadas de normalización y validación;
- datos de prueba representativos.

### Excluye
- integración con APIs externas;
- autenticación o usuarios;
- almacenamiento persistente en base de datos;
- operaciones financieras complejas más allá de normalización y validación;
- lógica de backend persistente con infraestructura.

## 4. Usuarios
### Usuario principal
Analista o operador que necesita revisar transacciones de distintas fuentes, detectar inconsistencias y resumir el estado de un lote.

### Necesidades
- cargar un archivo y ver resultados rápidamente;
- entender qué registros fueron aceptados o rechazados;
- revisar un formato uniforme para comparar transacciones;
- validar la calidad del lote con métricas básicas;
- filtrar por estado, moneda, fuente o fecha.

## 5. Requisitos funcionales
### FR-01. Carga de archivos JSON
El usuario debe poder cargar uno o varios archivos JSON desde el navegador.

Aceptación:
- permite seleccionar archivos .json;
- acepta listas de objetos o estructuras equivalentes;
- si el archivo está malformado, muestra un error y continúa sin bloquear la aplicación.

### FR-02. Detección de estructura
Debe detectar la fuente o tipo de cada transacción según el nombre y formato de los campos.

Aceptación:
- reconoce al menos dos estructuras diferentes;
- no depende de una sola convención de nombres;
- si no reconoce la estructura, la transacción se rechaza con motivo.

### FR-03. Normalización a formato estándar
Todo registro válido debe quedar con este formato:

{
  "id": "0001",
  "id_fuente": "tx_001",
  "amount": "100.50",
  "currency": "USD",
  "timestamp": "2025-03-10 14:22:00",
  "status": "completed"
}

Aceptación:
- todos los campos finales son texto;
- id inicia en "01" y avanza por cada transacción válida;
- amount elimina símbolo de moneda y agrega ".00" si falta;
- currency usa ISO 4217;
- timestamp usa yyyy-MM-dd hh:mm:ss;
- status usa uno de los valores permitidos.

### FR-04. Validación y descarte
Una transacción se descarta si no cumple la estructura esperada o si faltan campos obligatorios.

Aceptación:
- cada inválido debe tener un motivo de rechazo;
- los registros válidos no aparecen en la sección de rechazados;
- el conteo total de inválidos debe coincidir con la cantidad de registros rechazados.

### FR-05. Métricas del lote
Debe existir un resumen con los totales del proceso.

Aceptación:
- total leído;
- total válido;
- total inválido;
- porcentaje de validación / rechazo;
- conteo por estado, moneda o fuente cuando aplique.

### FR-06. Exploración y filtrado
La aplicación debe permitir inspeccionar los resultados en una interfaz funcional.

Aceptación:
- tabla o lista con registros válidos;
- filtros por estado, moneda, fecha, fuente o texto libre;
- registros inválidos visibles con motivo de rechazo;
- no depende solo de salida en consola.

### FR-07. Reglas centralizadas
Debe existir un archivo o bloque de reglas con las conversiones y validaciones aplicables.

Aceptación:
- listados explícitos de estados permitidos;
- listados explícitos de monedas soportadas;
- formatos de fecha aceptados;
- motivos de rechazo definidos.

### FR-08. Datos de prueba
Debe incluir 2 archivos válidos y 1 inválido.

Aceptación:
- cubren estructura estándar y alternativa;
- incluyen errores esperados verificables;
- sirven para validar la normalización y el rechazo.

## 6. Reglas de negocio
### 6.1 Normalización
- convertir cualquier valor numérico a texto;
- eliminar prefijos monetarios del amount;
- completar decimales faltantes;
- reescribir moneda a ISO 4217;
- convertir fecha a yyyy-MM-dd hh:mm:ss;
- normalizar status a valores permitidos.

### 6.2 Validación
Se considera válida si:
- el registro tiene estructura reconocida;
- incluye los campos mínimos requeridos;
- los valores son transformables sin ambigüedad;
- la moneda, fecha y estado son soportados.

Se considera inválida si:
- falta un campo obligatorio;
- el JSON está malformado;
- la fecha es inválida;
- la moneda no se reconoce;
- el status no pertenece a la lista permitida;
- la estructura no coincide con una fuente esperada.

## 7. Rechazos esperados
El sistema debe registrar motivos como:
- campo obligatorio faltante;
- moneda no soportada;
- estado no válido;
- fecha inválida;
- estructura no reconocida;
- JSON malformado.

## 8. Restricciones de diseño
- Lógica de negocio separada de componentes visuales.
- Uso de React de manera clara y simple.
- No mezclar validación con JSX o estilos.
- Código reutilizable y legible para desarrolladores principiantes.

## 9. Requisitos no funcionales
### 9.1 Mantenibilidad
- centralizar reglas y validaciones;
- mantener flujo simple y fácil de depurar;
- evitar lógica acoplada a la UI.

### 9.2 Robustez
- manejar errores sin bloquear la aplicación;
- evitar resultados inconsistentes en métricas;
- mantener mensajes claros para el usuario.

### 9.3 Usabilidad
- interfaz directa para revisión de transacciones;
- acceso rápido a métricas y filtros;
- diferenciación visual entre válidos y rechazados.

## 10. Casos de prueba clave
### Caso 1: estructura estándar
- id, amount, currency, timestamp, status ya normalizados;
- esperado: validación y aceptación.

### Caso 2: estructura alterna
- transaction_id, total, currency_code, created_at, state;
- esperado: reconocimiento alternativo y normalización.

### Caso 3: monto con símbolo de moneda
- "€99,99" y sin decimales;
- esperado: "99.99" y moneda normalizada.

### Caso 4: fecha sin segundos
- "10/03/2025 14:22";
- esperado: "2025-03-10 14:22:00".

### Caso 5: estado no soportado
- status = "rejected";
- esperado: rechazo con motivo "estado no válido".

### Caso 6: campo faltante
- ausencia de currency o timestamp;
- esperado: rechazo y conteo correspondiente.

### Caso 7: JSON inválido
- sintaxis incorrecta;
- esperado: error claro, sin bloqueo de la UI.

## 11. Entregables esperados
- aplicación funcional para exploración de transacciones;
- archivos de prueba válidos e inválidos;
- lógica separada de la interfaz;
- métricas y filtros en UI;
- documentación breve de diseño y uso de IA.

## 12. Criterio de aceptación del producto
La solución será aceptada cuando:
- procesa archivos JSON de múltiples estructuras;
- normaliza todas las entradas a un formato común;
- descarta correctamente los registros invalidos y reporta el motivo;
- muestra métricas consistentes con los datos procesados;
- permite explorar y filtrar registros en la interfaz;
- mantiene la lógica de negocio separada de la capa visual;
- cumple con la constitución y la guía de trabajo establecida.

## 13. Decisiones definidas
1. La carga de archivos será desde navegador local.
2. La aplicación trabajará en memoria durante la sesión actual.
3. Los registros inválidos se mostrarán en la interfaz con motivo de rechazo.

## 14. Siguiente etapa
La siguiente etapa es la implementación técnica, comenzando con la capa de reglas y de negocio, luego la interfaz de exploración y finalmente la validación con los archivos de prueba.
