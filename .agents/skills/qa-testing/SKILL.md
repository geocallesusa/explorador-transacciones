---
name: qa-testing
description: Realiza controles de calidad enfocados en el explorador de transacciones: reglas de normalización, importación de JSON, métricas, filtros, comportamiento de la interfaz, lint y compilaciones de producción. Úsala cuando te pidan probar, verificar o realizar QA en esta aplicación o en algún cambio relacionado.
---

# Pruebas de calidad

Realiza una verificación práctica y basada en evidencia de esta aplicación. Prioriza las comprobaciones relacionadas con el código modificado y no afirmes que una comprobación fue exitosa si no la ejecutaste y observaste su resultado.

## Contexto del proyecto

- Es una aplicación del lado del cliente construida con React y Vite; actualmente no tiene backend.
- `src/lib/transactions.js` contiene la lectura, validación y normalización de transacciones, además de la carga de ejemplos.
- `src/config/rules.js` define las monedas admitidas, sus alias, los estados y los formatos de fecha.
- `src/App.jsx` implementa la carga de archivos JSON, las métricas, la búsqueda, los filtros y las tablas de transacciones válidas e inválidas.
- `public/transacciones-validas-1.json` y `public/transacciones-validas-2.json` son archivos de ejemplo válidos. `public/transacciones-invalidas.json` contiene ejemplos inválidos.
- Los scripts disponibles son `npm run lint` y `npm run build`. `package.json` no tiene configurado un script de pruebas automatizadas; no inventes uno ni des a entender que existe una suite de pruebas.
- Cuando corresponda, sigue las instrucciones del repositorio en `AGENTS.md` y los criterios de aceptación de `docs/constitution.md` y `specs/`.

## Flujo de QA

1. **Comprende el alcance.** Inspecciona los archivos modificados, las instrucciones relevantes del proyecto y las reglas de transacciones. Revisa el estado del árbol de trabajo antes de hacer cambios y conserva las modificaciones ajenas a esta tarea.
2. **Elige comprobaciones proporcionales.** Si se modificaron la normalización o la configuración, inspecciona y prueba los casos afectados. Si se modificó la interfaz, prueba el flujo de usuario correspondiente. Cuando sea pertinente, ejecuta las comprobaciones disponibles de lint y compilación.
3. **Verifica el comportamiento de las transacciones.** Usa registros JSON representativos y comprueba lo siguiente:
   - Los nombres de campos admitidos para cada fuente producen el esquema común esperado: `id`, `id_fuente`, `amount`, `currency`, `timestamp` y `status`.
   - Los ID del sistema son correlativos y los ID de origen se conservan como cadenas.
   - Los símbolos y códigos de moneda, y el formato de los montos, respetan las reglas configuradas; las fechas usan los formatos de entrada admitidos y el formato de salida normalizado.
   - Se aceptan los estados admitidos; los campos faltantes, el JSON mal formado, los valores no admitidos y las estructuras de nivel superior inválidas se rechazan con motivos útiles.
   - Los conteos de registros válidos, inválidos y totales coinciden con los registros procesados.
4. **Verifica la interfaz cuando corresponda.** Si hace falta, inicia la aplicación con el comando de Vite documentado. Comprueba la carga de ejemplos y de uno o más archivos JSON, que los errores de archivos inválidos sean claros, que las métricas sean visibles, que funcionen la búsqueda de texto y los filtros por estado y moneda, y que los estados vacíos sean adecuados. Verifica que los filtros no alteren los totales originales.
5. **Ejecuta las comprobaciones disponibles.** Ejecuta `npm run lint` y `npm run build` para los cambios que cubran. No instales paquetes salvo que falte una dependencia necesaria o se haya modificado el manifiesto.
6. **Comunica los resultados con claridad.** Resume qué se verificó, qué comandos y flujos manuales se ejecutaron, los resultados de cada comprobación y cualquier riesgo o comportamiento que no se haya probado. Incluye hallazgos accionables con referencias a archivos. Distingue los defectos verificados de las suposiciones.

## Consideraciones importantes de QA

- Los requisitos describen el ID correlativo inicial como `"01"` en una sección y muestran `"0001"` en el ejemplo de salida. Trátalo como una discrepancia en la especificación: menciónala si es pertinente y no cambies el comportamiento esperado basándote en suposiciones.
- No debilites la validación, modifiques los archivos de ejemplo ni cambies el comportamiento de la aplicación solo para que una comprobación pase.
- No presentes una inspección manual como una prueba automatizada ni una compilación exitosa como prueba de que todo el comportamiento es correcto.
- Si no puedes realizar una comprobación en el entorno actual, explica por qué e indica qué evidencia falta.
