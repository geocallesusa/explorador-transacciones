# Tasks: Implementación del explorador de transacciones

## 1. Objetivo de esta hoja de tareas
Esta lista convierte la especificación y el plan del proyecto en tareas ejecutables para la implementación técnica. No incluye código aún; sirve como guía de trabajo para desarrollar la aplicación siguiendo la constitución y la estrategia SSD.

## 2. Tareas por fases

### Fase 1: Preparación y reglas base
#### Tarea 1.1 — Revisar la base normativa del proyecto
- Confirmar que la implementación respete [AGENTS.md](../AGENTS.md)
- Confirmar que la solución siga [docs/constitution.md](../docs/constitution.md)
- Mantener [specs/001](001) y [specs/spec.md](spec.md) como referencia principal

#### Tarea 1.2 — Definir configuración de reglas
- Crear estructura de reglas para estados válidos
- Crear estructura de reglas para monedas soportadas
- Crear estructura de reglas para formatos de fecha aceptados
- Definir mensajes de rechazo para validaciones

#### Tarea 1.3 — Definir estructura de salida
- Acordar el formato final de salida para transacciones válidas
- Acordar la estructura de registros rechazados con motivo
- Definir cómo se gestionará la id correlativa

### Fase 2: Lógica de negocio
#### Tarea 2.1 — Leer y validar archivos JSON
- Implementar lectura desde entrada del navegador local
- Validar que el contenido sea JSON correcto
- Manejar archivos vacíos o malformados

#### Tarea 2.2 — Detectar fuente o estructura
- Reconocer estructuras estándar y alternativas
- Mapear campos por fuente
- Si no se reconoce la estructura, marcar registro como inválido

#### Tarea 2.3 — Normalizar transacciones
- Convertir valores a texto
- Limpiar amount y formatear moneda
- Normalizar timestamp a yyyy-MM-dd hh:mm:ss
- Normalizar status a valores permitidos

#### Tarea 2.4 — Validar registros
- Verificar campos obligatorios
- Rechazar monedas no soportadas
- Rechazar fechas inválidas
- Rechazar estados no válidos
- Registrar motivo de rechazo

#### Tarea 2.5 — Calcular métricas
- Total leídos
- Total válidos
- Total inválidos
- Porcentaje de validación y rechazo
- Conteos por moneda, estado y fuente si aplica

### Fase 3: Interfaz de usuario
#### Tarea 3.1 — Diseñar la UI base
- Añadir selector de archivos
- Añadir área de métricas
- Añadir sección de resultados válidos
- Añadir sección de registros rechazados

#### Tarea 3.2 — Renderizar tabla de transacciones válidas
- Mostrar columnas principales: id, id_fuente, amount, currency, timestamp, status
- Ordenar o mostrar en orden de procesamiento
- Mantener una visual clara y discernible

#### Tarea 3.3 — Renderizar registros rechazados
- Mostrar motivo de rechazo
- Diferenciar visualmente registros aceptados y descartados
- Asegurar que el rechazo no se mezcle con los válidos

#### Tarea 3.4 — Implementar filtros y búsqueda
- Filtrar por estado
- Filtrar por moneda
- Filtrar por fuente
- Filtrar por texto libre
- Revisar fecha si se aplica el filtro

### Fase 4: Datos de prueba
#### Tarea 4.1 — Crear archivos de prueba válidos
- Archivo 1: estructura principal estándar
- Archivo 2: estructura alternativa con campos distintos

#### Tarea 4.2 — Crear archivo de prueba inválido
- Archivo con registros incompletos o inválidos
- Incluir varios motivos de rechazo

#### Tarea 4.3 — Validar resultados esperados
- Confirmar que los válidos pasan a esquema final
- Confirmar que los inválidos quedan rechazados con motivo
- Confirmar que las métricas reflejan el lote cargado

### Fase 5: Documentación y revisión
#### Tarea 5.1 — Documentar decisiones de diseño
- Describir cómo se separó la lógica de la interfaz
- Registrar reglas de normalización y validación
- Incluir uso de IA y ajustes realizados

#### Tarea 5.2 — Revisar cumplimiento de la especificación
- Verificar que se cumplen AGENTS, constitución y specs
- Revisar que no existan archivos temporales innecesarios
- Confirmar que la solución final se mantiene enfocada

## 3. Dependencias de flujo
1. Definir reglas
2. Procesar entradas
3. Normalizar y validar
4. Calcular métricas
5. Mostrar en UI
6. Validar con datos reales de prueba
7. Documentar y revisar final

## 4. Criterios de término por tarea
Cada tarea se considera terminada cuando:
- responde a un requisito funcional o no funcional explicitado;
- no depende de otra parte no documentada;
- puede verificarse con una prueba o revisión manual;
- mantiene la lógica separada de la vista;
- cumple con la regla de no generar código de implementación en esta etapa.

## 5. Riesgos principales
- ambigüedad en la detección de estructura;
- inconsistencia en la normalización de moneda o fecha;
- ocultar errores en la interfaz con métricas incorrectas;
- mezclar lógica de procesamiento con renderizado.

## 6. Criterio de cierre del proyecto
El proyecto se considera listo cuando:
- se carga JSON desde navegador local;
- todas las transacciones válidas quedan normalizadas;
- las inválidas se descartan con motivo visible;
- las métricas coinciden con el lote cargado;
- la interfaz permite explorar y filtrar resultados;
- la solución cumple con la constitución y la especificación base.
