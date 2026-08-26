"use client";

/**
 * Shared WebGL context-loss recovery helper.
 *
 * A WebGL context can be dropped by the browser at any time — commonly on
 * mobile under GPU memory pressure, or after a laptop sleeps and resumes. When
 * that happens the canvas fires `webglcontextlost`; unless the handler calls
 * `event.preventDefault()`, the browser will NEVER fire `webglcontextrestored`,
 * leaving the effect permanently blank until a full page reload.
 *
 * This helper wires both events on a canvas:
 *   - on `webglcontextlost`   -> preventDefault() (required), then `onLost`,
 *                                where the caller stops its render loop and
 *                                drops the now-invalid GPU handles.
 *   - on `webglcontextrestored` -> `onRestored`, where the caller rebuilds its
 *                                GPU resources (programs, buffers, textures)
 *                                and resumes rendering.
 *
 * Returns a detach function — call it from your effect cleanup.
 *
 * NOTE: `THREE.WebGLRenderer` already performs this internally (it calls
 * preventDefault on loss and re-initializes the GL context on restore), so
 * Three.js / react-three-fiber effects do not need this helper. It exists for
 * effects that drive a raw WebGL context directly via
 * `canvas.getContext("webgl" | "webgl2")`, which get no automatic recovery.
 *
 * @returns detach function
 */
interface WebGLContextRecoveryHandlers {
  onLost?: (event: Event) => void
  onRestored?: (event: Event) => void
}

export function attachWebGLContextRecovery(canvas: HTMLCanvasElement | null | undefined, handlers: WebGLContextRecoveryHandlers = {}) {
  if (!canvas) return () => {};

  const { onLost, onRestored } = handlers;

  const handleLost = (event: Event) => {
    // Required so the browser will later fire `webglcontextrestored`.
    event.preventDefault();
    if (onLost) onLost(event);
  };

  const handleRestored = (event: Event) => {
    if (onRestored) onRestored(event);
  };

  canvas.addEventListener("webglcontextlost", handleLost, false);
  canvas.addEventListener("webglcontextrestored", handleRestored, false);

  return () => {
    canvas.removeEventListener("webglcontextlost", handleLost, false);
    canvas.removeEventListener("webglcontextrestored", handleRestored, false);
  };
}
