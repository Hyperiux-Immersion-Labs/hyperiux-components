// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

// Reduced motion

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, prefersReducedMotion, getServerReducedMotionSnapshot);
}

// Look

type Rgb = [number, number, number];

// The paint is smooth, so it renders at a fraction of the canvas and only the grain runs at full size
const PAINT_SCALE = 0.5;
const FIELD_HEIGHT = 160;
const MAX_DPR = 1.5;
const REF_ASPECT = 1.6;

// Smear: how long a stir takes to settle, and how far it carries itself
const SMEAR_HALF_LIFE = 0.4;
const SMEAR_ADVECT = 2;
const SMEAR_MAX = 0.4;

// Shaders

const QUAD_VS = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// Stir field: each texel holds how far the paint under it has been dragged.
// It carries itself along (so a flick keeps curling after the pointer stops) and fades back to rest.
const FIELD_FS = `#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uRes;
uniform vec2 uToUv;
uniform float uAdvect;
uniform float uDecay;
uniform vec2 uPointer;
uniform vec2 uStir;
uniform float uRadius;
uniform float uAspect;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 v = texture(uField, uv).xy;
  vec2 carried = texture(uField, uv - v * uToUv * uAdvect).xy * uDecay;
  vec2 d = (uv - uPointer) * vec2(uAspect, 1.0);
  float s = exp(-dot(d, d) / (uRadius * uRadius));
  // each side of the stroke curls the opposite way
  float across = dot(d, normalize(vec2(-uStir.y, uStir.x) + 1e-6)) / max(uRadius, 1e-3);
  vec2 swirl = vec2(-uStir.y, uStir.x) * across * 0.2;
  vec2 next = carried + (uStir + swirl) * s;
  float m = length(next);
  if (m > ${SMEAR_MAX.toFixed(2)}) next *= ${SMEAR_MAX.toFixed(2)} / m;
  outColor = vec4(next, 0.0, 1.0);
}`;

// The paint: a periwinkle ground with one pink ribbon and cyan wisps folded through it. Every
// colour is a band of a single flowing coordinate, so they slide past each other like oil on water
const PAINT_FS = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uAspect;
uniform float uScale;
uniform float uTime;
uniform float uFlow;
uniform float uDetail;
uniform vec3 uBase;
uniform vec3 uBase2;
uniform vec3 uLilac;
uniform vec3 uCyan;
uniform vec3 uPink;
uniform vec3 uPeach;
uniform vec3 uMagenta;
uniform sampler2D uField;
uniform float uSmear;
out vec4 outColor;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// gradient noise, -1..1
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(dot(hash2(i), f), dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p, int octaves) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    v += a * noise(p);
    p = mat2(1.62, 1.18, -1.18, 1.62) * p;
    a *= 0.5;
  }
  return v;
}

float band(float x, float centre, float width) {
  float d = (x - centre) / width;
  return exp(-d * d);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 drag = uSmear > 0.0 ? texture(uField, uv).xy : vec2(0.0);
  // show the paint from where the stir dragged it from
  vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5) / uScale - drag;
  float t = uTime;

  // two rounds of warping fold straight bands into the S-curves and curls of poured paint
  // few octaves on purpose: the reference is big smooth pours, not marbled grit
  vec2 q = vec2(
    fbm(p * 0.9 + vec2(0.0, t * 0.05), 3),
    fbm(p * 0.9 + vec2(5.2, 1.3) - vec2(t * 0.04, 0.0), 3));
  vec2 r = vec2(
    fbm(p * 1.0 + q * 1.7 * uFlow + vec2(1.7, 9.2) + t * 0.035, 3),
    fbm(p * 1.0 + q * 1.7 * uFlow + vec2(8.3, 2.8) - t * 0.03, 3));
  vec2 w = p + r * 0.95 * uFlow;

  // the flowing coordinate runs corner to corner, top-left to bottom-right, like the reference,
  // with a slow S-bend along its length
  vec2 across = normalize(vec2(0.5, 1.0));
  float along = dot(w, vec2(across.y, -across.x));
  float s = dot(w, across) * 1.2 + 0.16 * sin(along * 3.4 + 0.6 + t * 0.07);

  // fine streaks combed along the flow, strongest in the cyan wisps
  float comb = fbm(vec2(s * 14.0, along * 1.6) + r * 2.0, 3) * uDetail;

  // a slow swell along each band so no ribbon is the same brightness end to end
  float swell = 0.7 + 0.6 * fbm(w * 0.7 + vec2(3.1, -t * 0.02), 2);

  vec3 col = mix(uBase, uBase2, smoothstep(-0.4, 0.5, fbm(w * 0.8 + 11.0, 3) * 2.0));

  // bands are flattened at the top (pow < 1) so each ribbon reads as a solid stream of colour
  // with a soft edge, not a haze
  float lilac = band(s, 0.14, 0.3) * 0.3;
  float cyanA = pow(band(s + comb * 0.05, 0.36, 0.1), 0.6);
  float cyanB = pow(band(s + comb * 0.06, -0.46, 0.1), 0.6);
  float cyan = max(cyanA, cyanB * 0.95) * clamp(swell * 1.2 + comb * 0.6, 0.0, 1.0);
  float pink = pow(band(s, -0.05, 0.15), 0.55) * clamp(swell * 1.35, 0.0, 1.0);
  // the hot centre of the ribbon runs peach, its outer edge deepens to magenta
  float peach = pow(band(s, -0.03, 0.06), 0.8) * smoothstep(0.45, 0.85, swell);
  float magenta = band(s, -0.2, 0.08) * 0.4 * swell;
  // the ribbon thins out where it reaches the edges of the frame
  float edge = smoothstep(1.0, 0.3, abs(along) / max(uAspect, 1.0) * 1.3);

  col = mix(col, uLilac, lilac);
  col = mix(col, uCyan, clamp(cyan, 0.0, 1.0));
  col = mix(col, uMagenta, clamp(magenta, 0.0, 1.0) * mix(0.55, 1.0, edge));
  col = mix(col, uPink, clamp(pink, 0.0, 1.0) * mix(0.75, 1.0, edge));
  col = mix(col, uPeach, clamp(peach, 0.0, 1.0) * 0.85);

  outColor = vec4(col, 1.0);
}`;

const GRAIN_FS = `#version 300 es
precision highp float;
uniform sampler2D uPaint;
uniform vec2 uRes;
uniform float uGrain;
uniform float uSeed;
uniform float uHue;
uniform float uSaturation;
out vec4 outColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// hue turn and saturation in YIQ, which keeps brightness where it was
vec3 grade(vec3 c) {
  vec3 yiq = mat3(0.299, 0.596, 0.211, 0.587, -0.274, -0.523, 0.114, -0.322, 0.312) * c;
  float cs = cos(uHue);
  float sn = sin(uHue);
  yiq.yz = mat2(cs, sn, -sn, cs) * yiq.yz * uSaturation;
  return mat3(1.0, 1.0, 1.0, 0.956, -0.272, -1.106, 0.621, -0.647, 1.703) * yiq;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 col = grade(texture(uPaint, uv).rgb);
  float n = hash(gl_FragCoord.xy + uSeed * 91.7) + hash(gl_FragCoord.xy * 1.37 - uSeed * 47.3) - 1.0;
  col += n * uGrain;
  outColor = vec4(col, 1.0);
}`;

// Helpers

function hexToRgb(hex: string): Rgb {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`OpalFlow shader: ${log}`);
  }
  return shader;
}

function link(gl: WebGL2RenderingContext, fs: string) {
  const program = gl.createProgram()!;
  const vs = compile(gl, gl.VERTEX_SHADER, QUAD_VS);
  const frag = compile(gl, gl.FRAGMENT_SHADER, fs);
  gl.attachShader(program, vs);
  gl.attachShader(program, frag);
  gl.bindAttribLocation(program, 0, "aPos");
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`OpalFlow program: ${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

function makeTarget(gl: WebGL2RenderingContext) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return { tex, fbo: gl.createFramebuffer()! };
}

function sizeTarget(
  gl: WebGL2RenderingContext,
  target: { tex: WebGLTexture; fbo: WebGLFramebuffer },
  w: number,
  h: number,
  float: boolean,
) {
  gl.bindTexture(gl.TEXTURE_2D, target.tex);
  if (float) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
  else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.tex, 0);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

// Component

export interface OpalFlowProps {
  /** The periwinkle ground. */
  baseColor?: string;
  /** The cyan wisps. */
  wispColor?: string;
  /** The pink ribbon. */
  ribbonColor?: string;
  /** The warm centre of the ribbon. */
  highlightColor?: string;
  /** Turns every colour around the colour wheel, in degrees. 0 is the reference palette. */
  hue?: number;
  /** Colour strength. 0 is greyscale, 1 matches the reference. */
  saturation?: number;
  /** How fast the paint flows. 0 holds it still. */
  speed?: number;
  /** How far the paint folds and curls. */
  flow?: number;
  /** How strongly the cyan wisps are combed into fine streaks. */
  detail?: number;
  /** Film grain strength. 0 turns it off. */
  grain?: number;
  /** Let the pointer stir the paint like ink in water. */
  interactive?: boolean;
  /** How far a stroke drags the paint. */
  smearStrength?: number;
  /** Width of the stroke, in canvas heights. */
  smearRadius?: number;
  /** Content laid over the background. */
  children?: ReactNode;
  className?: string;
}

export default function OpalFlow({
  baseColor = "#6a6cf6",
  wispColor = "#8de0f1",
  ribbonColor = "#fb9ce8",
  highlightColor = "#fccbbf",
  hue = 0,
  saturation = 1,
  speed = 1,
  flow = 1,
  detail = 1,
  grain = 0.025,
  interactive = true,
  smearStrength = 1,
  smearRadius = 0.1,
  children,
  className = "",
}: OpalFlowProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const configRef = useRef({
    baseColor,
    wispColor,
    ribbonColor,
    highlightColor,
    hue,
    saturation,
    speed,
    flow,
    detail,
    grain,
    interactive,
    smearStrength,
    smearRadius,
    reducedMotion,
  });
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    configRef.current = {
      baseColor,
      wispColor,
      ribbonColor,
      highlightColor,
      hue,
      saturation,
      speed,
      flow,
      detail,
      grain,
      interactive,
      smearStrength,
      smearRadius,
      reducedMotion,
    };
    // a held frame (reduced motion, offscreen) still picks up new colours
    redrawRef.current();
  }, [
    baseColor,
    wispColor,
    ribbonColor,
    highlightColor,
    hue,
    saturation,
    speed,
    flow,
    detail,
    grain,
    interactive,
    smearStrength,
    smearRadius,
    reducedMotion,
  ]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;

    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) return undefined;
    // the smear needs signed values; without float targets the paint just doesn't stir
    const floatTargets = !!gl.getExtension("EXT_color_buffer_float");

    let fieldProgram: WebGLProgram;
    let paintProgram: WebGLProgram;
    let grainProgram: WebGLProgram;
    try {
      fieldProgram = link(gl, FIELD_FS);
      paintProgram = link(gl, PAINT_FS);
      grainProgram = link(gl, GRAIN_FS);
    } catch (error) {
      console.error(error);
      return undefined;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const paintTarget = makeTarget(gl);
    let fieldRead = makeTarget(gl);
    let fieldWrite = makeTarget(gl);

    const u = (program: WebGLProgram, name: string) => gl.getUniformLocation(program, name);
    const fieldU = {
      field: u(fieldProgram, "uField"),
      res: u(fieldProgram, "uRes"),
      toUv: u(fieldProgram, "uToUv"),
      advect: u(fieldProgram, "uAdvect"),
      decay: u(fieldProgram, "uDecay"),
      pointer: u(fieldProgram, "uPointer"),
      stir: u(fieldProgram, "uStir"),
      radius: u(fieldProgram, "uRadius"),
      aspect: u(fieldProgram, "uAspect"),
    };
    const paintU = {
      res: u(paintProgram, "uRes"),
      aspect: u(paintProgram, "uAspect"),
      scale: u(paintProgram, "uScale"),
      time: u(paintProgram, "uTime"),
      flow: u(paintProgram, "uFlow"),
      detail: u(paintProgram, "uDetail"),
      base: u(paintProgram, "uBase"),
      base2: u(paintProgram, "uBase2"),
      lilac: u(paintProgram, "uLilac"),
      cyan: u(paintProgram, "uCyan"),
      pink: u(paintProgram, "uPink"),
      peach: u(paintProgram, "uPeach"),
      magenta: u(paintProgram, "uMagenta"),
      field: u(paintProgram, "uField"),
      smear: u(paintProgram, "uSmear"),
    };
    const grainU = {
      paint: u(grainProgram, "uPaint"),
      res: u(grainProgram, "uRes"),
      grain: u(grainProgram, "uGrain"),
      seed: u(grainProgram, "uSeed"),
      hue: u(grainProgram, "uHue"),
      saturation: u(grainProgram, "uSaturation"),
    };

    let width = 1;
    let height = 1;
    let paintW = 1;
    let paintH = 1;
    let fieldW = 1;
    let fieldH = 1;
    let aspect = 1;
    let scale = 1;
    // set once the field has been stirred, cleared once it has settled, so a still canvas skips the pass
    let stirred = false;
    let settleTime = 0;

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      aspect = width / height;
      // cover: the artwork fills the frame and crops whichever side overflows
      scale = Math.max(aspect / REF_ASPECT, 1);
      paintW = Math.max(1, Math.round(width * PAINT_SCALE));
      paintH = Math.max(1, Math.round(height * PAINT_SCALE));
      fieldH = Math.min(FIELD_HEIGHT, paintH);
      fieldW = Math.max(1, Math.round(fieldH * aspect));
      sizeTarget(gl, paintTarget, paintW, paintH, false);
      if (floatTargets) {
        sizeTarget(gl, fieldRead, fieldW, fieldH, true);
        sizeTarget(gl, fieldWrite, fieldW, fieldH, true);
      }
      stirred = false;
    };

    // pointer in canvas uv (y up) and in the shader's space, plus how far it moved since the last frame
    const pointer = { u: 0.5, v: 0.5, x: 0, y: 0, dx: 0, dy: 0, inside: false, fresh: true };
    let clock = 0;
    let last = 0;

    const stir = (dt: number) => {
      const cfg = configRef.current;
      const active = floatTargets && cfg.interactive && !cfg.reducedMotion;
      const moving = active && pointer.inside && (pointer.dx !== 0 || pointer.dy !== 0);
      if (moving) {
        stirred = true;
        settleTime = 0;
      } else if (stirred) {
        settleTime += dt;
        // after ~8 half-lives nothing visible is left
        if (settleTime > SMEAR_HALF_LIFE * 8 || !active) {
          stirred = false;
          sizeTarget(gl, fieldRead, fieldW, fieldH, true);
        }
      }
      if (!stirred) return;

      gl.bindFramebuffer(gl.FRAMEBUFFER, fieldWrite.fbo);
      gl.viewport(0, 0, fieldW, fieldH);
      gl.useProgram(fieldProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fieldRead.tex);
      gl.uniform1i(fieldU.field, 0);
      gl.uniform2f(fieldU.res, fieldW, fieldH);
      gl.uniform2f(fieldU.toUv, scale / aspect, scale);
      gl.uniform1f(fieldU.advect, SMEAR_ADVECT * dt);
      gl.uniform1f(fieldU.decay, Math.pow(0.5, dt / SMEAR_HALF_LIFE));
      gl.uniform2f(fieldU.pointer, pointer.u, pointer.v);
      const gain = moving ? cfg.smearStrength * 0.9 : 0;
      gl.uniform2f(fieldU.stir, pointer.dx * gain, pointer.dy * gain);
      gl.uniform1f(fieldU.radius, cfg.smearRadius * scale);
      gl.uniform1f(fieldU.aspect, aspect);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      [fieldRead, fieldWrite] = [fieldWrite, fieldRead];
    };

    const draw = (time: number) => {
      const cfg = configRef.current;
      const base = hexToRgb(cfg.baseColor);
      const wisp = hexToRgb(cfg.wispColor);
      const ribbon = hexToRgb(cfg.ribbonColor);
      const highlight = hexToRgb(cfg.highlightColor);
      // the in-between tones the reference blends through are mixed from the four picked colours
      const mixRgb = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
      const base2 = mixRgb(base, [1, 1, 1], 0.12);
      const lilac = mixRgb(mixRgb(base, ribbon, 0.45), [1, 1, 1], 0.3);
      const magenta = mixRgb(ribbon, base, 0.28);

      gl.bindFramebuffer(gl.FRAMEBUFFER, paintTarget.fbo);
      gl.viewport(0, 0, paintW, paintH);
      gl.useProgram(paintProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fieldRead.tex);
      gl.uniform1i(paintU.field, 0);
      gl.uniform1f(paintU.smear, stirred ? 1 : 0);
      gl.uniform2f(paintU.res, paintW, paintH);
      gl.uniform1f(paintU.aspect, aspect);
      gl.uniform1f(paintU.scale, scale);
      gl.uniform1f(paintU.time, time);
      gl.uniform1f(paintU.flow, cfg.flow);
      gl.uniform1f(paintU.detail, cfg.detail);
      gl.uniform3fv(paintU.base, base);
      gl.uniform3fv(paintU.base2, base2);
      gl.uniform3fv(paintU.lilac, lilac);
      gl.uniform3fv(paintU.cyan, wisp);
      gl.uniform3fv(paintU.pink, ribbon);
      gl.uniform3fv(paintU.peach, highlight);
      gl.uniform3fv(paintU.magenta, magenta);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(grainProgram);
      gl.bindTexture(gl.TEXTURE_2D, paintTarget.tex);
      gl.uniform1i(grainU.paint, 0);
      gl.uniform2f(grainU.res, width, height);
      gl.uniform1f(grainU.grain, cfg.grain);
      gl.uniform1f(grainU.hue, (cfg.hue * Math.PI) / 180);
      gl.uniform1f(grainU.saturation, cfg.saturation);
      // grain steps at film rate rather than every frame
      gl.uniform1f(grainU.seed, cfg.reducedMotion ? 0 : Math.floor(time * 24) % 97);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let raf = 0;
    let visible = true;
    let onscreen = true;

    const frame = (now: number) => {
      raf = 0;
      const cfg = configRef.current;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      clock += dt * cfg.speed;
      stir(dt);
      pointer.dx = 0;
      pointer.dy = 0;
      draw(clock);
      schedule();
    };

    const schedule = () => {
      if (raf || !visible || !onscreen || configRef.current.reducedMotion) return;
      raf = requestAnimationFrame(frame);
    };

    const redraw = () => {
      if (configRef.current.reducedMotion) {
        stirred = false;
        draw(clock);
        return;
      }
      if (!raf) draw(clock);
      last = 0;
      schedule();
    };
    redrawRef.current = redraw;

    const onPointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const ux = (event.clientX - rect.left) / rect.width;
      const uy = 1 - (event.clientY - rect.top) / rect.height;
      pointer.inside = ux >= 0 && ux <= 1 && uy >= 0 && uy <= 1;
      if (!pointer.inside) {
        pointer.fresh = true;
        return;
      }
      const x = ((ux - 0.5) * aspect) / scale;
      const y = (uy - 0.5) / scale;
      // the first move after entering only places the pointer, so it doesn't stir a jump
      if (!pointer.fresh) {
        pointer.dx += x - pointer.x;
        pointer.dy += y - pointer.y;
      }
      pointer.fresh = false;
      pointer.u = ux;
      pointer.v = uy;
      pointer.x = x;
      pointer.y = y;
    };
    const onPointerLeave = () => {
      pointer.inside = false;
      pointer.fresh = true;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      last = 0;
      schedule();
    };

    const io = new IntersectionObserver(
      (entries) => {
        onscreen = entries.some((entry) => entry.isIntersecting);
        last = 0;
        schedule();
      },
      { rootMargin: "128px" },
    );
    io.observe(root);

    const ro = new ResizeObserver(() => {
      resize();
      draw(clock);
    });
    ro.observe(root);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    draw(clock);
    schedule();

    return () => {
      redrawRef.current = () => {};
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(fieldProgram);
      gl.deleteProgram(paintProgram);
      gl.deleteProgram(grainProgram);
      gl.deleteBuffer(quad);
      for (const target of [paintTarget, fieldRead, fieldWrite]) {
        gl.deleteTexture(target.tex);
        gl.deleteFramebuffer(target.fbo);
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`relative h-full w-full overflow-hidden ${className}`.trim()}
      style={{ backgroundColor: baseColor }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
      {children ? <div className="relative z-10 h-full w-full">{children}</div> : null}
    </div>
  );
}
