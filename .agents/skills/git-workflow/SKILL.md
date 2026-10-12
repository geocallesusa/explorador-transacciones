---
name: git-workflow
description: Gestiona cambios nuevos y modificados con Git de forma segura: revisa el estado y las diferencias, prepara archivos, crea commits y publica cambios con push cuando se solicite. Úsala cuando pidan agregar, confirmar o enviar cambios de este repositorio.
---

# Flujo de trabajo con Git

Usa Git para preparar y compartir cambios de forma explícita y segura. Ejecuta únicamente las operaciones que haya pedido el usuario; no hagas commit ni push por iniciativa propia.

## Flujo de trabajo

1. **Revisa el repositorio.** Comprueba la raíz, la rama actual y `git status --short`. Inspecciona las diferencias relevantes con `git diff` y, si hay cambios preparados, `git diff --cached`. No reviertas, sobrescribas ni incluyas cambios ajenos a la solicitud.
2. **Selecciona los archivos.** Para agregar cambios, prepara solo los archivos nuevos o modificados que correspondan a la solicitud. Usa `git add -- <rutas>` con rutas explícitas. Evita `git add .` y `git add -A`, ya que pueden incluir archivos ajenos. No prepares eliminaciones salvo que el usuario también las haya solicitado.
3. **Verifica lo preparado.** Revisa `git status --short` y `git diff --cached`. Asegúrate de que el contenido preparado sea exactamente el esperado y no incluya credenciales, claves, tokens, archivos generados innecesarios ni datos privados. Si detectas información sensible, no la confirmes ni la publiques; informa al usuario.
4. **Crea un commit si se solicita.** Confirma que los cambios preparados pertenecen a la tarea. Usa un mensaje breve que describa el cambio. No hagas amend ni reescribas commits existentes, salvo petición explícita. Después del commit, revisa el resultado con `git status --short` y `git log -1 --oneline`.
5. **Haz push si se solicita.** Antes de publicar, verifica la rama y su upstream con `git status -sb` y `git branch -vv`. Revisa los commits pendientes y confirma que los cambios que se enviarán son los esperados. Usa el push normal hacia la rama configurada; nunca uses `--force` ni `--force-with-lease` salvo petición explícita del usuario. Si no hay upstream o el destino no está claro, detente e informa antes de elegir uno.
6. **Comunica el resultado.** Indica qué archivos se prepararon, el hash y mensaje del commit si se creó, y la rama o remoto de destino si se hizo push. Informa de errores y de cualquier paso que no se haya ejecutado; no afirmes que una operación terminó con éxito sin verificar su resultado.

## Reglas importantes

- Un pedido para agregar archivos no autoriza por sí solo a crear un commit ni a hacer push.
- Un pedido para crear un commit no autoriza por sí solo a hacer push.
- Respeta las modificaciones que ya existían en el árbol de trabajo y nunca limpies cambios del usuario para dejar el repositorio «limpio».
- No agregues archivos ignorados o generados, ni cambios sin relación con la solicitud.
- No incluyas secretos en commits. Si un secreto ya se agregó, no lo publiques; informa al usuario y recomienda revocarlo si pudo quedar expuesto.
- No uses operaciones destructivas o que reescriban historial sin autorización explícita.
