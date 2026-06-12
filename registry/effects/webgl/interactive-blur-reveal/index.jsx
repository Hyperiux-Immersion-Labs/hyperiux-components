"use client";

import { useEffect, useRef } from "react";

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

const TRAIL_RADIUS = 180;
const TRAIL_SOFT_RADIUS = 210;
const TRAIL_LINE_WIDTH = 190;

const ACTIVE_DRAW_WINDOW_MS = 300;

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

function createShader(gl, type, source) {
  const shader = gl.createShader(type);

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

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

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

function resolveImageSource(source) {
  if (typeof source === "string") return source;
  if (source?.src) return source.src;

  return source;
}

function shouldUseCrossOrigin(source) {
  if (typeof source !== "string") return false;
  if (source.startsWith("data:") || source.startsWith("blob:")) return false;

  return true;
}

function loadImage(source) {
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

function createImageTexture(gl, image, unit, shouldRepeat = false) {
  const texture = gl.createTexture();

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

function createMaskTexture(gl, maskCanvas, unit) {
  const texture = gl.createTexture();

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

function isPointInsideRect(clientX, clientY, rect) {
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

function getNormalizedPointer(clientX, clientY, rect) {
  return {
    x: (clientX - rect.left) / rect.width,
    y: (clientY - rect.top) / rect.height,
  };
}

function drawTrailStamp(ctx, x, y, radius, softRadius) {
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

function InteractiveBlurReveal({ iChannel0="https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg", iChannel1="https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/interactive-blur-reveal-noise.png", className, style }) {
  const canvasRef = useRef(null);

  const pointerRef = useRef({
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
    let animationFrameId = 0;
    let cleanupWebgl;

    async function init() {
      const canvas = canvasRef.current;

      if (!canvas) return undefined;

      const gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        preserveDrawingBuffer: false,
      });

      if (!gl) {
        console.error("WebGL2 is required for this shader.");
        return undefined;
      }

      const maskCanvas = document.createElement("canvas");
      const maskCtx = maskCanvas.getContext("2d", {
        alpha: true,
        willReadFrequently: false,
      });

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
        loadImage(iChannel1),
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
        const devicePixelRatio = window.devicePixelRatio || 1;
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

      function updatePointerFromClient(clientX, clientY) {
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

      function onWindowPointerMove(event) {
        updatePointerFromClient(event.clientX, event.clientY);
      }

      function onWindowPointerLeave(event) {
        if (!event.relatedTarget) {
          const pointer = pointerRef.current;

          pointer.isInside = false;
          pointer.hasDrawn = false;
        }
      }

      function fadeMask(now, pointer) {
        const idleAge = now - pointer.lastMoveTime;
        const fadeAlpha =
          idleAge > ACTIVE_DRAW_WINDOW_MS
            ? MASK_IDLE_FADE_ALPHA
            : MASK_FADE_ALPHA;

        maskCtx.save();
        maskCtx.globalCompositeOperation = "destination-out";
        maskCtx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.restore();
      }

      function drawTrail(pointer, velocity, now) {
        const idleAge = now - pointer.lastMoveTime;

        const shouldDraw =
          pointer.isInside &&
          idleAge <= ACTIVE_DRAW_WINDOW_MS &&
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
        maskCtx.lineWidth = TRAIL_LINE_WIDTH;

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
          TRAIL_RADIUS,
          TRAIL_SOFT_RADIUS
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

        const smoothing =
          1.0 - Math.pow(POINTER_LERP_FACTOR, frameDelta / 1000);

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

        animationFrameId = requestAnimationFrame(render);
      }

      window.addEventListener("pointermove", onWindowPointerMove, {
        passive: true,
      });
      window.addEventListener("mouseout", onWindowPointerLeave);

      render();

      return () => {
        window.removeEventListener("pointermove", onWindowPointerMove);
        window.removeEventListener("mouseout", onWindowPointerLeave);

        cancelAnimationFrame(animationFrameId);
        gl.deleteTexture(baseTexture);
        gl.deleteTexture(noiseTexture);
        gl.deleteTexture(maskTexture);
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
      };
    }

    init()
      .then((cleanup) => {
        cleanupWebgl = cleanup;
      })
      .catch((error) => {
        console.warn(
          "InteractiveBlurReveal could not initialize. The provided texture URL must be directly loadable by the browser and must allow CORS for WebGL.",
          error?.message || error
        );
      });

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);

      if (cleanupWebgl) {
        cleanupWebgl();
      }
    };
  }, [iChannel0, iChannel1]);

  function updatePointerFromEvent(event) {
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

  function onPointerEnter(event) {
    updatePointerFromEvent(event);
  }

  function onPointerMove(event) {
    updatePointerFromEvent(event);
  }

  function onPointerLeave() {
    const pointer = pointerRef.current;

    pointer.isInside = false;
    pointer.hasDrawn = false;
  }

  return (
    <canvas
      ref={canvasRef}
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
  );
}

export default InteractiveBlurReveal;
