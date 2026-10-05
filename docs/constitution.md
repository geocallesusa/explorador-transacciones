# Constitución del proyecto: Explorador de transacciones

## 1. Propósito
Este proyecto tiene como objetivo construir una aplicación para normalizar, validar y explorar transacciones financieras provenientes de múltiples fuentes. La solución debe ser clara, mantenible y fácil de entender para personas que están iniciando en el desarrollo, con una separación correcta entre lógica de negocio e interfaz.

## 2. Misión
Crear un sistema que:
- lea datos desde archivos JSON;
- detecte la fuente o tipo de cada transacción;
- convierta cada entrada a un formato común;
- descarte registros inválidos con conteo explícito;
- permita explorar y filtrar datos en una interfaz interactiva;
- mantenga reglas de negocio centralizadas y reutilizables.

## 3. Principios de diseño
### 3.1 Simplicidad
La solución debe priorizar claridad por encima de complejidad. React debe usarse en su forma más directa y legible.

### 3.2 Separación de responsabilidades
- La lógica de normalización y validación debe estar aislada de la capa visual.
- La interfaz debe consumiar datos ya procesados y no contener reglas de negocio complejas.

### 3.3 Normalización uniforme
Toda transacción debe normalizarse a este esquema final:

{
  "id": "[id correlativo de la transacción]",
  "id_fuente": "[id según la fuente]",
  "amount": "[monto de la transacción]",
  "currency": "[moneda de la transacción]",
  "timestamp": "[fecha y hora de la transacción]",
  "status": "[estado de la transacción]"
}

### 3.4 Validación estricta
Si una transacción no cumple con la estructura esperada o falta un campo del esquema final, debe descartarse y registrarse en métricas de inválidos.

### 3.5 Datos de prueba representativos
Se deben incluir archivos de entrada válidos e inválidos para comprobar el comportamiento real del sistema y validar reglas de transformación.

## 4. Reglas de negocio
### 4.1 Formato de entrada
La aplicación debe soportar distintos formatos de JSON y distintas convenciones de nombres de campos, por ejemplo:
- id / transaction_id / ref
- amount / total
- currency / currency_code
- timestamp / created_at / date
- status / state / result

### 4.2 Normalización
- Todos los valores deben convertirse a texto cuando sean numéricos o simbólicos.
- El campo id debe ser correlativo, iniciando en "01".
- El campo id_fuente conserva el identificador original de la fuente, convertido únicamente a texto si es necesario.
- El campo amount debe eliminar prefijos de moneda y agregar ".00" cuando no tenga decimales.
- El campo currency debe normalizarse a su abreviatura ISO 4217.
- El campo timestamp debe quedar en formato "yyyy-MM-dd hh:mm:ss".
- El campo status debe normalizarse a uno de los valores permitidos: completed | success | failed | pending | OK.

### 4.3 Reglas de validación
Se considera una transacción válida cuando:
- tiene la estructura esperada;
- contiene los campos mínimos del esquema final;
- los valores pueden transformarse y normalizarse sin ambigüedad;
- la transacción cumple con las reglas de moneda, fecha y estado definidas.

Se considera inválida cuando:
- falta algún dato requerido;
- tiene un JSON con estructura incompatible;
- los campos no pueden transformarse con una lógica segura;
- la información no cumple con los formatos aceptados.

## 5. Métricas requeridas
El sistema debe reportar al menos:
- total procesado;
- total válido;
- total inválido;
- total descartado;
- detalle de transacciones rechazadas si aplica.

## 6. Reglas de configuración
Se debe mantener un archivo de configuración o reglas con:
- mapeo de estados aceptados;
- mapeo de monedas soportadas;
- formatos de fecha admitidos;
- conversiones específicas por fuente o tipo de transacción.

## 7. Requisitos de interfaz
La interfaz debe permitir:
- cargar archivos JSON;
- visualizar registros procesados;
- filtrar por campo o criterio de búsqueda;
- distinguir registros válidos e inválidos;
- consultar métricas generales;
- ofrecer una experiencia clara y útil para análisis de datos.

## 8. Requisitos de limpieza
Durante el desarrollo, se deben eliminar archivos temporales o generados que no formen parte de la solución final. La entrega debe mantenerse ordenada y enfocada en la funcionalidad final.

## 9. Estandar de trabajo con Spec Driven Development (SSD)
Este proyecto se rige por Spec Driven Development como marco de trabajo para garantizar claridad y trazabilidad.

### 9.1 Flujo recomendado
1. Definir el problema y el resultado esperado.
2. Especificar comportamiento en lenguaje claro y verificable.
3. Traducir la especificación a requisitos funcionales y de datos.
4. Implementar la mínima solución que cumpla la especificación.
5. Validar con datos reales de prueba y casos límite.
6. Ajustar la especificación si surgen nuevas reglas o inconsistencias.

### 9.2 Criterios de aceptación
La solución se considera completa cuando:
- la lógica está separada de la UI;
- la normalización es consistente para todas las fuentes;
- la validación descarta correctamente registros inválidos;
- las métricas reflejan el estado real del proceso;
- el comportamiento queda documentado y es verificable.

## 10. Documentación del proyecto
Se debe incluir una documentación breve con:
- decisiones de diseño;
- uso de IA en el proceso de desarrollo;
- ajustes realizados sobre las sugerencias iniciales;
- referencias a la especificación base y a la guía de trabajo.

La extensión de esta documentación no debe exceder una página, manteniendo un enfoque claro y práctico.

## 11. Alcance final
El proyecto debe entregarse como una aplicación funcional de normalización y exploración de transacciones multifuente, con reglas definidas, validación real, métricas y una interfaz interactiva que permita análisis de datos sin depender únicamente de salida por consola.

## 12. Referencia normativa
Esta constitución complementa la guía de trabajo en AGENTS.md y debe servir como base para la implementación, la validación y la revisión del producto final.
