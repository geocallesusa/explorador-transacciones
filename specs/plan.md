# Plan de implementación: Explorador de transacciones

## 1. Propósito del plan
Este documento convierte la especificación funcional de [specs/001](specs/001) y la línea base de [docs/constitution.md](docs/constitution.md) en un plan de trabajo ejecutable, sin entrar en implementación de código. El objetivo es dejar una guía clara para construir la solución con enfoque de Spec Driven Development (SSD), separando la lógica de negocio de la capa visual y manteniendo una arquitectura simple y comprensible.

## 2. Objetivo general
Construir una aplicación web con React que permita:
- cargar archivos JSON locales;
- reconocer distintas estructuras de entrada;
- normalizar transacciones a un formato común;
- descartar registros inválidos con motivo de rechazo;
- mostrar métricas y permitir exploración/filtrado;
- mantener el procesamiento en memoria durante la sesión actual.

## 3. Principios que guiarán el desarrollo
- Simplicidad: evitar complejidad innecesaria, priorizando claridad.
- Separación de responsabilidades: lógica de negocio separada de interfaz.
- Validación temprana: rechazar entradas con errores claros y medibles.
- Normalización uniforme: cada transacción finaliza con un formato estándar.
- Trazabilidad: cada decisión debe estar alineada con la constitución y la spec.

## 4. Alcance funcional del plan
### 4.1 Entrada de datos
- Cargar uno o varios archivos JSON desde el navegador local.
- Aceptar colecciones de objetos o listas de transacciones.
- Manejar errores de parseo y archivos vacíos.

### 4.2 Detección de fuente o estructura
- Reconocer estructuras como:
  - id, amount, currency, timestamp, status
  - transaction_id, total, currency_code, created_at, state
  - ref, amount, date, result
- Si la estructura no es reconocible, marcar el registro como inválido.

### 4.3 Normalización de datos
- Convertir valores a texto cuando corresponda.
- Correlativizar id con base "01".
- Normalizar amount, currency, timestamp y status.
- El formato final debe quedar uniforme para todas las transacciones válidas.

### 4.4 Validación y métricas
- Rechazar campos faltantes o formatos inconsistentes.
- Mostrar métricas de: total, válidos, inválidos, descartados y porcentaje de rechazo.
- Registrar motivo de rechazo por transacción.

### 4.5 Interfaz de exploración
- Cargar archivos desde UI.
- Mostrar tabla/lista con transacciones válidas.
- Mostrar transacciones inválidas con motivo visible.
- Permitir filtros por estado, moneda, fecha, fuente o texto.
- Mostrar métricas generales de procesamiento.

## 5. Arquitectura propuesta
### 5.1 Capa de interfaz
Responsable de:
- selección de archivos;
- renderizado de tabla y filtros;
- visualización de métricas;
- interacción del usuario.

### 5.2 Capa de negocio
Responsable de:
- parseo JSON;
- detección de estructura;
- validación;
- normalización;
- cálculo de métricas;
- clasificación de registros válidos e inválidos.

### 5.3 Capa de reglas
Responsable de:
- mapeo de estados permitidos;
- mapeo de monedas soportadas;
- formatos de fecha aceptados;
- reglas de descarte y mensajes de error.

### 5.4 Modelo de datos esperado
{
  "id": "0001",
  "id_fuente": "tx_001",
  "amount": "100.50",
  "currency": "USD",
  "timestamp": "2025-03-10 14:22:00",
  "status": "completed"
}

Para registros rechazados se recomienda mantener un objeto con:
- original
- motivo
- fuenteDetectada
- estado: invalid

## 6. Fases de trabajo
### Fase 1: Base del proyecto y reglas
- Confirmar estructura de ramas y entrega.
- Definir archivo de configuración de reglas.
- Definir mapeos de moneda, estado y formatos de fecha.
- Elegir una conveniencia de organización por módulos.

### Fase 2: Procesador de transacciones
- Crear la lógica de lectura y validación.
- Implementar detección de estructura.
- Normalizar los campos requeridos.
- Separar validación de elaboración visual.

### Fase 3: Cálculo de métricas
- Total de registros leídos.
- Válidos e inválidos.
- Conteos por moneda, estado y fuente.
- Porcentajes de rechazo y aceptación.

### Fase 4: Interfaz de exploración
- Selector de archivos.
- Tabla de registros válidos.
- Sección de registros rechazados con motivo.
- Controles de filtro y búsqueda.
- Panel de métricas.

### Fase 5: Datos de prueba
- Archivo 1: transacciones válidas estándar.
- Archivo 2: transacciones válidas alternativas.
- Archivo 3: transacciones inválidas.
- Validar resultados esperados frente a la spec.

### Fase 6: Documentación y revisión final
- Actualizar documentación breve.
- Verificar cumplimiento con AGENTS y constitución.
- Revisar que no queden artefactos innecesarios.

## 7. Reglas de negocio a implementar
### 7.1 Normalización
- El output final debe ser siempre texto.
- Si un valor es numérico, convertir a string.
- Si tiene símbolo monetario, quitarlo del amount.
- Si el monto no incluye decimales, completar ".00".
- Normalizar moneda con ISO 4217.
- Ajustar timestamp a "yyyy-MM-dd hh:mm:ss".
- Normalizar estado a valores permitidos.

### 7.2 Validación estricta
Se rechaza si:
- falta campo obligatorio;
- el JSON está malformado;
- la estructura no es reconocida;
- la moneda no es soportada;
- la fecha no es válida;
- el estado no existe en la lista permitida.

### 7.3 Criterio de descarte
Cada transacción rechazadas debe conservar:
- valor original;
- motivo del rechazo;
- fuente detectada si aplica;
- índice o referencia del registro original.

## 8. Algoritmo de la solución (pseudocódigo)
```text
FUNCION procesarLoteArchivos(archivos):
    loteValido = []
    loteInvalido = []
    totalLeidos = 0
    totalValidos = 0
    totalInvalidos = 0

    PARA cada archivo EN archivos:
        contenido = leerArchivo(archivo)

        SI contenido no es JSON válido:
            loteInvalido.append({
                archivo: archivo.nombre,
                motivo: "JSON malformado o estructura no reconocida"
            })
            continuar

        registros = extraerRegistros(contenido)

        SI registros no existe O registros está vacío:
            loteInvalido.append({
                archivo: archivo.nombre,
                motivo: "Archivo sin registros"
            })
            continuar

        PARA cada registro EN registros:
            totalLeidos = totalLeidos + 1

            SI registro no es objeto:
                loteInvalido.append({
                    registro: registro,
                    motivo: "Estructura no reconocida"
                })
                totalInvalidos = totalInvalidos + 1
                continuar

            fuente = detectarFuente(record)

            SI fuente no es reconocida:
                loteInvalido.append({
                    registro: registro,
                    motivo: "Estructura no reconocida"
                })
                totalInvalidos = totalInvalidos + 1
                continuar

            campos = mapearCampos(record, fuente)

            SI faltan campos obligatorios:
                loteInvalido.append({
                    registro: registro,
                    motivo: "Campo obligatorio faltante"
                })
                totalInvalidos = totalInvalidos + 1
                continuar

            normalizado = normalizarRegistro(campos)

            SI normalizado.error existe:
                loteInvalido.append({
                    registro: registro,
                    motivo: normalizado.error
                })
                totalInvalidos = totalInvalidos + 1
                continuar

            loteValido.append(normalizado.data)
            totalValidos = totalValidos + 1

    metricas = {
        totalLeidos: totalLeidos,
        totalValidos: totalValidos,
        totalInvalidos: totalInvalidos,
        porcentajeValidos: calcularPorcentaje(totalValidos, totalLeidos),
        porcentajeInvalidos: calcularPorcentaje(totalInvalidos, totalLeidos)
    }

    RETORNAR {
        validos: loteValido,
        invalidos: loteInvalido,
        metricas: metricas
    }
FIN FUNCION

FUNCION normalizarRegistro(campos):
    id = generarIdCorrelativo()
    id_fuente = convertirAString(campos.id_fuente)
    amount = limpiarMonto(campos.amount)
    currency = normalizarMoneda(campos.currency)
    timestamp = normalizarFecha(campos.timestamp)
    status = normalizarEstado(campos.status)

    SI currency no es soportada:
        RETORNAR { error: "moneda no soportada" }

    SI timestamp es inválida:
        RETORNAR { error: "fecha inválida" }

    SI status no es válido:
        RETORNAR { error: "estado no válido" }

    RETORNAR {
        data: {
            id: id,
            id_fuente: id_fuente,
            amount: amount,
            currency: currency,
            timestamp: timestamp,
            status: status
        }
    }
FIN FUNCION
```

## 9. Criterios de aceptación del plan
El plan será satisfactorio si:
- define claramente la separación de responsabilidades;
- deja especificado el flujo de procesamiento desde archivo hasta métricas;
- cubre validación y descarte con motivos claros;
- describe la UI con exploración y filtros;
- incorpora reglas de negocio y datos de prueba;
- respeta la constitución del proyecto y la spec funcional.

## 10. Entregables esperados del plan
- [specs/001](specs/001): especificación funcional final.
- [docs/constitution.md](docs/constitution.md): regla base del proyecto.
- [specs/plan.md](specs/plan.md): plan operativo y de arquitectura.
- archivos de prueba para validación y demostración.

## 11. Decisiones del plan
- Carga desde navegador local.
- Procesamiento en memoria durante la sesión.
- Registros inválidos visibles con motivo de rechazo.
- Lógica de negocio separada de UI.
- Foco en simpleza, claridad y trazabilidad.

## 12. Siguiente paso recomendado
Una vez validado este plan, el siguiente paso es pasar a la implementación técnica en módulos: configuración de reglas, procesador de transacciones y capa de UI. No se debe comenzar con estilos ni con lógica visual antes de dejar la capa de negocio establecida.
