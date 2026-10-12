---
name: user-friendly
description: Evalúa si una aplicación es fácil de entender y usar; identifica fricciones y mejora la interfaz, los textos y la accesibilidad sin cambiar la lógica funcional. Úsala cuando pidan revisar o mejorar la facilidad de uso de una aplicación.
---

# Revisión de facilidad de uso

Evalúa la experiencia desde la perspectiva de las personas que usan la aplicación, no solo desde la implementación. Si encuentras problemas concretos de usabilidad, realiza los cambios necesarios en la interfaz y verifica que la lógica existente siga funcionando igual.

## Flujo de trabajo

1. **Entiende la aplicación y a sus usuarios.** Lee las instrucciones del repositorio, la especificación funcional y los flujos principales. Inspecciona los componentes y estilos relacionados antes de proponer cambios. Revisa `git status` y conserva las modificaciones ajenas a la tarea.
2. **Recorre los flujos principales.** Siempre que sea posible, usa la aplicación como lo haría una persona: identifica cómo empezar, completar las acciones principales, entender el resultado y recuperarse de errores.
3. **Evalúa aspectos observables de usabilidad:**
   - **Comprensión:** los títulos, etiquetas, instrucciones y acciones usan lenguaje claro y familiar para el público.
   - **Orientación:** es fácil saber qué muestra la pantalla, qué se puede hacer y qué ocurrirá al usar cada acción.
   - **Eficiencia:** los pasos, controles y valores predeterminados facilitan completar las tareas habituales sin duplicaciones ni obstáculos.
   - **Respuesta del sistema:** los estados de carga, éxito, error y ausencia de resultados son claros y explican el siguiente paso útil.
   - **Prevención y recuperación:** las validaciones aparecen cerca del problema, explican cómo corregirlo y no borran innecesariamente el trabajo de la persona.
   - **Accesibilidad:** los controles tienen etiquetas asociadas, se pueden usar con teclado, muestran el foco, tienen contraste y tamaño legibles y comunican correctamente sus estados.
   - **Adaptación a pantallas:** el contenido y las acciones importantes siguen siendo utilizables en pantallas pequeñas y con zoom.
   - **Consistencia:** acciones equivalentes usan los mismos términos y patrones a lo largo de la aplicación.
4. **Prioriza los hallazgos.** Distingue problemas concretos que bloquean o confunden de preferencias estéticas. Da prioridad a que las tareas principales sean comprensibles, accesibles y completables. No agregues elementos decorativos o explicaciones que no ayuden a usar el producto.
5. **Mejora la experiencia sin cambiar la lógica.** Haz cambios quirúrgicos en la interfaz, el contenido, la organización visual y los estilos. Conserva las reglas de negocio, la validación, el procesamiento de datos, los contratos de API, el estado y el comportamiento de las acciones. No alteres los resultados ni elimines funciones para simplificar la pantalla. Si la mejora necesaria requiere cambiar la lógica funcional, detente y describe el cambio que haría falta en lugar de implementarlo.
6. **Mantén el diseño coherente.** Sigue los patrones y convenciones ya establecidos en el proyecto. Elige tipografía, colores, jerarquía y disposición de acuerdo con el producto y su público; evita cambios genéricos, adornos sin propósito y textos técnicos innecesarios. Usa mensajes breves, en voz activa y con nombres de acciones que expliquen su resultado.
7. **Verifica los cambios.** Revisa los flujos afectados en la aplicación cuando el entorno lo permita, incluyendo teclado y una vista estrecha si se modificó la interfaz. Comprueba que las acciones y resultados funcionales se mantengan. Ejecuta las comprobaciones disponibles del proyecto, como lint y compilación, según corresponda.
8. **Comunica el resultado.** Resume los problemas de usabilidad encontrados, los cambios realizados y cómo los verificaste. Indica cualquier aspecto que no pudiste comprobar. No afirmes que una interfaz es completamente accesible ni que una prueba manual fue automatizada sin evidencia.

## Contexto de este proyecto

- La aplicación es un explorador de transacciones construido con React y Vite.
- Sus flujos principales incluyen cargar archivos JSON o ejemplos, consultar métricas, buscar y filtrar transacciones y revisar registros rechazados.
- Conserva las reglas de normalización y validación definidas en `src/lib/transactions.js` y `src/config/rules.js` al mejorar la experiencia.
- Considera los criterios de aceptación en `docs/constitution.md` y `specs/` cuando sean relevantes.
