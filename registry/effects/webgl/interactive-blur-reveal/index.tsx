// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { attachWebGLContextRecovery } from "./webgl-context-recovery";
import { createSuspendedRaf } from "./createSuspendedRaf";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

const FULLSCREEN_TRIANGLE_VERTICES = new Float32Array([
  -1, -1,
  1, -1,
  -1, 1,
  -1, 1,
  1, -1,
  1, 1,
]);

const TEXTURE_UNIT_BASE = 0;
const TEXTURE_UNIT_NOISE = 1;
const TEXTURE_UNIT_MASK = 2;

const DEFAULT_POINTER_POSITION = 0.5;
const DEFAULT_FRAME_TIME_MS = 16.67;
const MAX_FRAME_DELTA_MS = 64;

const POINTER_LERP_FACTOR = 0.001;
const STOP_VELOCITY_EPSILON = 0.00008;

const MASK_FADE_ALPHA = 0.015;
const MASK_IDLE_FADE_ALPHA = 0.085;

const DEFAULT_MOUSE_RADIUS = 180;
const DEFAULT_DURATION = 0.3;
const DEFAULT_NOISE_TEXTURE =
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/interactive-blur-reveal-noise.png";

const BLUR_REVEAL_VERT = /* glsl */ `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const BLUR_REVEAL_FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform vec2      iResolution;
uniform float     iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iMask;

out vec4 fragColor;

vec2 distortUv(vec2 uv) {
  vec2 noiseUv = uv * 2.2;
  vec2 noiseOffset = texture(iChannel1, noiseUv).xy - 0.5;

  return uv + noiseOffset * 0.012;
}

vec4 blur21(sampler2D tex, vec2 uv, float radiusPx) {
  vec2 px = radiusPx / iResolution;
  vec4 color = vec4(0.0);

  color += texture(tex, uv) * 0.12;

  color += texture(tex, uv + px * vec2(1.0, 0.0)) * 0.08;
  color += texture(tex, uv + px * vec2(-1.0, 0.0)) * 0.08;
  color += texture(tex, uv + px * vec2(0.0, 1.0)) * 0.08;
  color += texture(tex, uv + px * vec2(0.0, -1.0)) * 0.08;

  color += texture(tex, uv + px * vec2(1.0, 1.0)) * 0.065;
  color += texture(tex, uv + px * vec2(-1.0, 1.0)) * 0.065;
  color += texture(tex, uv + px * vec2(1.0, -1.0)) * 0.065;
  color += texture(tex, uv + px * vec2(-1.0, -1.0)) * 0.065;

  color += texture(tex, uv + px * vec2(2.0, 0.0)) * 0.045;
  color += texture(tex, uv + px * vec2(-2.0, 0.0)) * 0.045;
  color += texture(tex, uv + px * vec2(0.0, 2.0)) * 0.045;
  color += texture(tex, uv + px * vec2(0.0, -2.0)) * 0.045;

  color += texture(tex, uv + px * vec2(3.0, 1.0)) * 0.025;
  color += texture(tex, uv + px * vec2(-3.0, 1.0)) * 0.025;
  color += texture(tex, uv + px * vec2(3.0, -1.0)) * 0.025;
  color += texture(tex, uv + px * vec2(-3.0, -1.0)) * 0.025;

  return color;
}

vec3 filmGrain(vec2 uv) {
  vec2 coarseUv = uv * (iResolution.xy / 260.0) + vec2(iTime * 0.035, -iTime * 0.028);
  vec2 fineUv = uv * (iResolution.xy / 120.0) + vec2(-iTime * 0.055, iTime * 0.041);

  vec3 coarse = texture(iChannel1, coarseUv).rgb - 0.5;
  float fine = texture(iChannel1, fineUv).r - 0.5;
  vec3 chroma = vec3(coarse.r, coarse.g * 0.9, coarse.b * 1.1);

  return chroma * 0.95 + fine * 0.65;
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / iResolution.xy;
  screenUv.y = 1.0 - screenUv.y;

  vec2 imageUv = screenUv;

  vec4 frostedImage = blur21(iChannel0, distortUv(imageUv), 42.0);
  vec4 clearImage = texture(iChannel0, imageUv);

  float mask = texture(iMask, screenUv).a;

  float cloudNoise = texture(iChannel1, screenUv * 7.0).r;
  float fineNoise = texture(iChannel1, screenUv * 22.0).r;

  float revealMask = smoothstep(
    0.04,
    0.95,
    mask + cloudNoise * 0.08 + fineNoise * 0.035
  );

  frostedImage.rgb = mix(frostedImage.rgb, vec3(0.70, 0.76, 0.78), 0.18);
  frostedImage.rgb *= 0.96;

  vec4 mixed = mix(frostedImage, clearImage, revealMask);

  float grainAmount = mix(0.24, 0.12, revealMask);
  mixed.rgb += filmGrain(screenUv) * grainAmount;

  vec2 vignetteDelta = screenUv - 0.5;
  float vignette = smoothstep(0.85, 0.25, dot(vignetteDelta, vignetteDelta) * 1.35);
  mixed.rgb *= mix(0.96, 1.0, vignette);

  fragColor = vec4(clamp(mixed.rgb, 0.0, 1.0), 1.0);
}
`;

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type) as WebGLShader;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errorMessage =
      gl.getShaderInfoLog(shader) || "Shader compilation failed.";

    gl.deleteShader(shader);
    throw new Error(errorMessage);
  }

  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram() as WebGLProgram;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const errorMessage =
      gl.getProgramInfoLog(program) || "Program linking failed.";

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteProgram(program);
    throw new Error(errorMessage);
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

function resolveImageSource(source: any) {
  if (typeof source === "string") return source;
  if (source?.src) return source.src;

  return source;
}

function shouldUseCrossOrigin(source: any) {
  if (typeof source !== "string") return false;
  if (source.startsWith("data:") || source.startsWith("blob:")) return false;

  return true;
}

function loadImage(source: any): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (source instanceof HTMLImageElement) {
      if (source.complete) {
        resolve(source);
      } else {
        source.onload = () => resolve(source);
        source.onerror = reject;
      }

      return;
    }

    const imageSource = resolveImageSource(source);

    if (!imageSource) {
      reject(new Error("A valid image URL is required."));
      return;
    }

    const image = new Image();

    if (shouldUseCrossOrigin(imageSource)) {
      image.crossOrigin = "anonymous";
      image.referrerPolicy = "no-referrer";
    }

    image.onload = () => resolve(image);
    image.onerror = () => {
      reject(
        new Error(
          `Unable to load texture image: ${imageSource}. If this is a remote public URL, the server must allow CORS for WebGL textures.`
        )
      );
    };
    image.src = imageSource;
  });
}

function createImageTexture(gl: WebGL2RenderingContext, image: HTMLImageElement, unit: number, shouldRepeat = false) {
  const texture = gl.createTexture() as WebGLTexture;

  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_S,
    shouldRepeat ? gl.REPEAT : gl.CLAMP_TO_EDGE
  );

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_T,
    shouldRepeat ? gl.REPEAT : gl.CLAMP_TO_EDGE
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texture;
}

function createMaskTexture(gl: WebGL2RenderingContext, maskCanvas: HTMLCanvasElement, unit: number) {
  const texture = gl.createTexture() as WebGLTexture;

  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    maskCanvas
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texture;
}

function isPointInsideRect(clientX: number, clientY: number, rect: DOMRect) {
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

function getNormalizedPointer(clientX: number, clientY: number, rect: DOMRect) {
  return {
    x: (clientX - rect.left) / rect.width,
    y: (clientY - rect.top) / rect.height,
  };
}

function drawTrailStamp(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, softRadius: number) {
  const gradient = ctx.createRadialGradient(
    x,
    y,
    radius * 0.1,
    x,
    y,
    softRadius
  );

  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.72)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, softRadius, 0, Math.PI * 2);
  ctx.fill();
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numericValue));
}

interface PointerState {
  isInside: boolean
  targetX: number
  targetY: number
  x: number
  y: number
  previousX: number
  previousY: number
  lastTime: number
  lastMoveTime: number
  hasDrawn: boolean
}

interface InteractiveBlurRevealProps {
  iChannel0?: any
  iChannel1?: any
  className?: string
  style?: CSSProperties
  mouseRadius?: number
  mouseInteraction?: boolean
  duration?: number
}

function InteractiveBlurReveal({ iChannel0="https://picsum.photos/seed/hover7/800/1000", iChannel1="https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/interactive-blur-reveal-noise.png", mouseRadius = DEFAULT_MOUSE_RADIUS, mouseInteraction = true, duration = DEFAULT_DURATION, className, style }: InteractiveBlurRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const configRef = useRef({
    mouseRadius: DEFAULT_MOUSE_RADIUS,
    mouseInteraction: true,
    duration: DEFAULT_DURATION,
  });

  useEffect(() => {
    configRef.current = {
      mouseRadius: clampNumber(mouseRadius, 40, 420, DEFAULT_MOUSE_RADIUS),
      mouseInteraction,
      duration: clampNumber(duration, 0.08, 1.5, DEFAULT_DURATION),
    };
  }, [duration, mouseInteraction, mouseRadius]);

  const pointerRef = useRef<PointerState>({
    isInside: false,
    targetX: DEFAULT_POINTER_POSITION,
    targetY: DEFAULT_POINTER_POSITION,
    x: DEFAULT_POINTER_POSITION,
    y: DEFAULT_POINTER_POSITION,
    previousX: DEFAULT_POINTER_POSITION,
    previousY: DEFAULT_POINTER_POSITION,
    lastTime: 0,
    lastMoveTime: 0,
    hasDrawn: false,
  });

  useEffect(() => {
    let isDisposed = false;
    let loop: ReturnType<typeof createSuspendedRaf> | null = null;
    let cleanupWebgl: (() => void) | undefined;

    async function init() {
      if (!canvasRef.current) return undefined;
      const canvas = canvasRef.current as HTMLCanvasElement;

      if (!canvas) return undefined;

      const gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        preserveDrawingBuffer: false,
      })!;

      if (!gl) {
        console.error("WebGL2 is required for this shader.");
        return undefined;
      }

      const maskCanvas = document.createElement("canvas");
      const maskCtx = maskCanvas.getContext("2d", {
        alpha: true,
        willReadFrequently: false,
      })!;

      if (!maskCtx) return undefined;

      const program = createProgram(gl, BLUR_REVEAL_VERT, BLUR_REVEAL_FRAG);
      const positionBuffer = gl.createBuffer();

      const positionLocation = gl.getAttribLocation(program, "position");
      const resolutionLocation = gl.getUniformLocation(program, "iResolution");
      const timeLocation = gl.getUniformLocation(program, "iTime");
      const channel0Location = gl.getUniformLocation(program, "iChannel0");
      const channel1Location = gl.getUniformLocation(program, "iChannel1");
      const maskLocation = gl.getUniformLocation(program, "iMask");

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        FULLSCREEN_TRIANGLE_VERTICES,
        gl.STATIC_DRAW
      );
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const [baseImage, noiseImage] = await Promise.all([
        loadImage(iChannel0),
        loadImage(DEFAULT_NOISE_TEXTURE),
      ]);

      if (isDisposed) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        return undefined;
      }

      const baseTexture = createImageTexture(gl, baseImage, TEXTURE_UNIT_BASE);
      const noiseTexture = createImageTexture(
        gl,
        noiseImage,
        TEXTURE_UNIT_NOISE,
        true
      );

      const maskTexture = createMaskTexture(gl, maskCanvas, TEXTURE_UNIT_MASK);

      gl.uniform1i(channel0Location, TEXTURE_UNIT_BASE);
      gl.uniform1i(channel1Location, TEXTURE_UNIT_NOISE);
      gl.uniform1i(maskLocation, TEXTURE_UNIT_MASK);

      function resize() {
        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const nextWidth = Math.floor(window.innerWidth * devicePixelRatio);
        const nextHeight = Math.floor(window.innerHeight * devicePixelRatio);

        if (canvas.width === nextWidth && canvas.height === nextHeight) return;

        canvas.width = nextWidth;
        canvas.height = nextHeight;
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";

        maskCanvas.width = nextWidth;
        maskCanvas.height = nextHeight;

        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.activeTexture(gl.TEXTURE0 + TEXTURE_UNIT_MASK);
        gl.bindTexture(gl.TEXTURE_2D, maskTexture);

        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          maskCanvas
        );
      }

      function updatePointerFromClient(clientX: number, clientY: number) {
        const rect = canvas.getBoundingClientRect();
        const pointer = pointerRef.current;
        const isInside = isPointInsideRect(clientX, clientY, rect);

        pointer.isInside = isInside;

        if (!isInside) return;

        const normalized = getNormalizedPointer(clientX, clientY, rect);

        pointer.targetX = normalized.x;
        pointer.targetY = normalized.y;
        pointer.lastMoveTime = performance.now();
      }

      function onWindowPointerMove(event: PointerEvent) {
        updatePointerFromClient(event.clientX, event.clientY);
      }

      function onWindowPointerLeave(event: MouseEvent) {
        if (!event.relatedTarget) {
          const pointer = pointerRef.current;

          pointer.isInside = false;
          pointer.hasDrawn = false;
        }
      }

      function fadeMask(now: number, pointer: PointerState) {
        const durationMs = configRef.current.duration * 1000;
        const idleAge = now - pointer.lastMoveTime;
        const idleFade = clampNumber(
          MASK_IDLE_FADE_ALPHA * (DEFAULT_DURATION / configRef.current.duration),
          0.015,
          0.22,
          MASK_IDLE_FADE_ALPHA
        );
        const activeFade = clampNumber(
          MASK_FADE_ALPHA * (DEFAULT_DURATION / configRef.current.duration),
          0.003,
          0.08,
          MASK_FADE_ALPHA
        );
        const fadeAlpha =
          idleAge > durationMs ? idleFade : activeFade;

        maskCtx.save();
        maskCtx.globalCompositeOperation = "destination-out";
        maskCtx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.restore();
      }

      function drawTrail(pointer: PointerState, velocity: number, now: number) {
        const durationMs = configRef.current.duration * 1000;
        const radius = configRef.current.mouseRadius;
        const softRadius = radius * 1.17;
        const lineWidth = radius * 1.05;
        const idleAge = now - pointer.lastMoveTime;

        const shouldDraw =
          configRef.current.mouseInteraction &&
          pointer.isInside &&
          idleAge <= durationMs &&
          velocity > STOP_VELOCITY_EPSILON;

        if (!shouldDraw) {
          pointer.hasDrawn = false;
          return;
        }

        const currentX = pointer.x * maskCanvas.width;
        const currentY = pointer.y * maskCanvas.height;
        const previousX = pointer.previousX * maskCanvas.width;
        const previousY = pointer.previousY * maskCanvas.height;

        maskCtx.save();

        maskCtx.globalCompositeOperation = "source-over";
        maskCtx.lineCap = "round";
        maskCtx.lineJoin = "round";
        maskCtx.strokeStyle = "rgba(255,255,255,0.72)";
        maskCtx.lineWidth = lineWidth;

        if (pointer.hasDrawn) {
          maskCtx.beginPath();
          maskCtx.moveTo(previousX, previousY);
          maskCtx.lineTo(currentX, currentY);
          maskCtx.stroke();
        }

        drawTrailStamp(
          maskCtx,
          currentX,
          currentY,
          radius,
          softRadius
        );

        maskCtx.restore();

        pointer.hasDrawn = true;
      }

      function uploadMaskTexture() {
        gl.activeTexture(gl.TEXTURE0 + TEXTURE_UNIT_MASK);
        gl.bindTexture(gl.TEXTURE_2D, maskTexture);

        gl.texSubImage2D(
          gl.TEXTURE_2D,
          0,
          0,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          maskCanvas
        );
      }

      function render() {
        resize();

        const now = performance.now();
        const pointer = pointerRef.current;

        const frameDelta = pointer.lastTime
          ? Math.min(MAX_FRAME_DELTA_MS, now - pointer.lastTime)
          : DEFAULT_FRAME_TIME_MS;

        pointer.lastTime = now;

        const smoothing = configRef.current.mouseInteraction
          ? 1.0 -
            Math.pow(POINTER_LERP_FACTOR, frameDelta / 1000)
          : 0;

        pointer.previousX = pointer.x;
        pointer.previousY = pointer.y;

        pointer.x += (pointer.targetX - pointer.x) * smoothing;
        pointer.y += (pointer.targetY - pointer.y) * smoothing;

        const velocityX = pointer.x - pointer.previousX;
        const velocityY = pointer.y - pointer.previousY;
        const velocity = Math.hypot(velocityX, velocityY);

        fadeMask(now, pointer);
        drawTrail(pointer, velocity, now);
        uploadMaskTexture();

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, now / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      window.addEventListener("pointermove", onWindowPointerMove, {
        passive: true,
      });
      window.addEventListener("mouseout", onWindowPointerLeave);

      loop = createSuspendedRaf({
        root: canvas,
        onFrame: render,
      });
      loop.start();

      return () => {
        window.removeEventListener("pointermove", onWindowPointerMove);
        window.removeEventListener("mouseout", onWindowPointerLeave);

        loop?.destroy();
        loop = null;
        gl.deleteTexture(baseTexture);
        gl.deleteTexture(noiseTexture);
        gl.deleteTexture(maskTexture);
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
      };
    }

    const boot = () => {
      init()
        .then((cleanup) => {
          // If the effect unmounted while init was still loading, discard it.
          if (isDisposed) {
            if (cleanup) cleanup();
            return;
          }
          cleanupWebgl = cleanup;
        })
        .catch((error) => {
          console.warn(
            "InteractiveBlurReveal could not initialize. The provided texture URL must be directly loadable by the browser and must allow CORS for WebGL.",
            error?.message || error
          );
        });
    };

    // A raw WebGL2 context gets no automatic recovery (unlike THREE.WebGLRenderer).
    // On loss, stop the loop and drop the invalidated program/buffers/textures;
    // on restore, rebuild them by re-running init().
    const detachRecovery = attachWebGLContextRecovery(canvasRef.current, {
      onLost: () => {
        if (cleanupWebgl) {
          cleanupWebgl();
          cleanupWebgl = undefined;
        } else {
          loop?.destroy();
          loop = null;
        }
      },
      onRestored: () => {
        if (!isDisposed) boot();
      },
    });

    boot();

    return () => {
      isDisposed = true;
      detachRecovery();

      if (cleanupWebgl) {
        cleanupWebgl();
      } else {
        loop?.destroy();
        loop = null;
      }
    };
  }, [iChannel0]);

  function updatePointerFromEvent(event: ReactPointerEvent) {
    if (!mouseInteraction) return;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pointer = pointerRef.current;
    const normalized = getNormalizedPointer(event.clientX, event.clientY, rect);

    pointer.isInside = true;
    pointer.targetX = normalized.x;
    pointer.targetY = normalized.y;
    pointer.lastMoveTime = performance.now();
  }

  function onPointerEnter(event: ReactPointerEvent) {
    updatePointerFromEvent(event);
  }

  function onPointerMove(event: ReactPointerEvent) {
    updatePointerFromEvent(event);
  }

  function onPointerLeave() {
    const pointer = pointerRef.current;

    pointer.isInside = false;
    pointer.hasDrawn = false;
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={className}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          display: "block",
          ...style,
        }}
      />

      {prefersReducedMotion && (
        <div
          aria-live="polite"
          className="pointer-events-none fixed top-26 right-4 z-40 w-fit max-w-65 rounded-md border border-white/15 bg-white/5 p-3 text-center backdrop-blur-sm max-md:hidden"
        >
          <h2 className="text-sm leading-none text-white">
            The reveal keeps trailing.
          </h2>
          <p className="mt-2 text-xs leading-5 text-white/65">
            Interactive Blur Reveal clears the blur only where your cursor
            has recently moved, redrawing continuously. Since the reveal is
            driven entirely by motion, reduced motion can&apos;t be applied
            here.
          </p>
        </div>
      )}
    </>
  );
}

export default InteractiveBlurReveal;
