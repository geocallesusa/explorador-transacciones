
## Rol
Actúa como desarrollador fullstack senior que escribe soluciones simples, claras y fáciles de entender para alguien que está empezando a programar. Usa React y FastAPI en Python.

## Contexto
Dentro de este folder "explorador-transacciones" se creará una aplicación de normalización y exploración de transacciones de dinero multifuente.

## Objetivo
Construir un sistema que permita:
- mantener la lógica separada de la interfaz de usuario;
- soportar transacciones provenientes de múltiples fuentes;
- leer transacciones desde archivos JSON;
- detectar la fuente o tipo de cada transacción;
- normalizar todas las entradas a un formato común;
- explorar y filtrar los datos mediante una interfaz interactiva.

## Requisitos funcionales
- Simplicidad: utilizar React de la forma más clara posible.
- La lógica debe estar separada de la interfaz.
- Debe soportar distintas estructuras de JSON, por ejemplo:

[
  {
    "id": "tx_001",
    "amount": "100.50",
    "currency": "USD",
    "timestamp": "2025-03-10 14:22:00",
    "status": "completed"
  },
  {
    "transaction_id": 204,
    "total": 10050,
    "currency_code": "usd",
    "created_at": "10/03/2025 14:22",
    "state": "OK"
  },
  {
    "ref": "A-77",
    "amount": "€99,99",
    "date": "2025-03-10T14:22:00Z",
    "result": "success"
  }
]

## Normalización de datos
- Todos los datos deben convertirse a String. Si vienen como numéricos o símbolos, deben pasarse a texto.
- id: es un correlativo del sistema, iniciando desde "01".
- id_fuente: es el identificador según la fuente; no se modifica, solo se convierte a String si viene como numérico.
- amount: si el monto trae como prefijo el símbolo de la moneda, debe eliminarse. Si no trae punto decimal, se debe agregar ".00".
- currency: debe usarse la abreviatura internacional definida en la ISO 4217. Si viene definida dentro del monto, debe extraerse de ahí. Si viene como símbolo, debe convertirse a su abreviatura correspondiente.
- timestamp: debe quedar en formato "yyyy-MM-dd hh:mm:ss", por ejemplo "2025-03-10 14:22:00". Si no incluye segundos, deben agregarse ":00".
- status: los estados válidos son: completed | success | failed | pending | OK.

## Formato de salida
El esquema final de cada transacción debe ser:

{
  "id": "[id correlativo de la transacción]",
  "id_fuente": "[id según la fuente]",
  "amount": "[monto de la transacción]",
  "currency": "[moneda de la transacción]",
  "timestamp": "[fecha y hora de la transacción]",
  "status": "[estado de la transacción]"
}

Ejemplo:

{
  "id": "0001",
  "id_fuente": "tx_001",
  "amount": "100.50",
  "currency": "USD",
  "timestamp": "2025-03-10 14:22:00",
  "status": "completed"
}

## Validación y métricas
- Si una transacción no tiene la estructura esperada del JSON o falta alguno de los datos del esquema final, debe descartarse.
- Debe marcarse y llevarse conteo de las transacciones descartadas.
- Debe existir un resumen o métricas de registros válidos, inválidos y total procesados.

## Limpieza
Eliminar todos los archivos creados durante la implementación que no formen parte de la solución final.

## Datos de prueba
Crear 2 archivos con transacciones válidas y 1 archivo con transacciones inválidas.

## Interfaz funcional
La interfaz debe permitir explorar y filtrar los datos. No basta con imprimir resultados en consola.

## Archivo de reglas o configuración
Debe incluir el mapeo de estados, monedas soportadas y formatos de fecha aceptados.

## Documentación
Incluir las decisiones de diseño, el uso de IA y los ajustes realizados sobre las sugerencias de IA, con una extensión máxima de 1 página.

## Constitución del proyecto
La especificación base del proyecto debe mantenerse en docs/constitution.md y debe guiarse por Spec Driven Development (SSD). Este documento define la misión, alcance, principios, entregables y criterios de aceptación del sistema de normalización y exploración de transacciones.
