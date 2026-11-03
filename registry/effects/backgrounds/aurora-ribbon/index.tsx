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

// Shape

// The ribbon's spine, fitted to the reference artwork (x, y in 0..1 of a 1.405:1 frame, y down).
// The first and last points sit off-canvas so the ends fade in from outside the frame.
const SPINE: [number, number][] = [
  [0.88, -0.08],
  [0.86, 0.07],
  [0.79, 0.2],
  [0.63, 0.32],
  [0.47, 0.43],
  [0.37, 0.52],
  [0.47, 0.585],
  [0.67, 0.625],
  [0.82, 0.69],
  [0.83, 0.77],
  [0.73, 0.86],
  [0.6, 0.97],
  [0.48, 1.08],
];
const REF_ASPECT = 1.405;
// Samples along the spine sent to the shader each frame
const SAMPLES = 44;
// The glow is soft, so it renders at a fraction of the canvas and only the grain runs at full size
const GLOW_SCALE = 0.5;
// The smear field is softer still
const FIELD_HEIGHT = 160;
const MAX_DPR = 1.5;

// Widths in canvas heights, fitted to the reference
const CORE_WIDTH = 0.045;
const GLOW_WIDTH = 0.11;
const HALO_WIDTH = 0.2;
const POOL_WIDTH = 0.22;
// How much light pools in tight bends, and how tight a bend has to be
const POOL_GAIN = 3.1;
const POOL_BEND_FROM = 2.6;
const POOL_BEND_TO = 6.1;

// Smear: how long a stir takes to settle, and how far it carries itself
const SMEAR_HALF_LIFE = 0.4;
const SMEAR_ADVECT = 2;
const SMEAR_MAX = 0.4;

// Shaders

const QUAD_VS = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// Stir field: each texel holds how far the light under it has been dragged.
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
  float r2 = uRadius * uRadius;
  float s = exp(-dot(d, d) / r2);
  // a little sideways swirl off the stroke, so it reads as liquid rather than a straight drag
  // each side of the stroke curls the opposite way
  float across = dot(d, normalize(vec2(-uStir.y, uStir.x) + 1e-6)) / max(uRadius, 1e-3);
  vec2 swirl = vec2(-uStir.y, uStir.x) * across * 0.2;
  vec2 next = carried + (uStir + swirl) * s;
  float m = length(next);
  if (m > ${SMEAR_MAX.toFixed(2)}) next *= ${SMEAR_MAX.toFixed(2)} / m;
  outColor = vec4(next, 0.0, 1.0);
}`;

const GLOW_FS = `#version 300 es
precision highp float;
#define N ${SAMPLES}
uniform vec2 uRes;
uniform float uAspect;
uniform float uScale;
uniform vec2 uPts[N];
// x: light along the spine, y: light pooled in its bends
uniform vec2 uE[N];
uniform vec4 uWidths;
uniform vec3 uBg;
uniform vec3 uCoreE;
uniform vec3 uGlowE;
uniform vec3 uHaloE;
uniform sampler2D uField;
uniform float uSmear;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 drag = uSmear > 0.0 ? texture(uField, uv).xy : vec2(0.0);
  // show the light from where the stir dragged it from
  vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5) / uScale - drag;

  float CW = uWidths.x;
  float GW = uWidths.y;
  float HW = uWidths.z;
  float PW = uWidths.w;
  float minD = 1e3;
  float minE = 0.0;
  float glow = 0.0;
  float halo = 0.0;
  float pool = 0.0;

  for (int i = 0; i < N - 1; i++) {
    vec2 a = uPts[i];
    vec2 ab = uPts[i + 1] - a;
    float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
    float d = length(p - a - ab * h);
    if (d < minD) {
      minD = d;
      minE = mix(uE[i].x, uE[i + 1].x, h);
    }
    // a blurred line is a sum of soft dots along it, so bends pile up light on their inside
    float len = length(ab);
    vec2 q = p - (a + ab * 0.5);
    float d2 = dot(q, q);
    float e = 0.5 * (uE[i].x + uE[i + 1].x) * len;
    glow += e * exp(-d2 / (GW * GW));
    halo += e * exp(-d2 / (HW * HW));
    vec2 f = p - a;
    pool += uE[i].y * len * exp(-dot(f, f) / (PW * PW));
  }
  // normalise the sums so a straight stretch peaks at 1
  glow /= GW * 1.7725;
  halo /= HW * 1.7725;
  pool /= PW * 1.7725;
  float core = minE * exp(-(minD * minD) / (CW * CW));

  // stirred light glows a touch brighter, like it's been woken up
  float wake = 1.0 + uSmear * min(length(drag) * 2.5, 0.5);
  vec3 light = (core * uCoreE + (glow + pool) * uGlowE + halo * uHaloE) * wake;
  vec3 col = 1.0 - (1.0 - uBg) * exp(-light);
  outColor = vec4(col, 1.0);
}`;

const GRAIN_FS = `#version 300 es
precision highp float;
uniform sampler2D uGlow;
uniform vec2 uRes;
uniform float uGrain;
uniform float uSeed;
out vec4 outColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 col = texture(uGlow, uv).rgb;
  float n = hash(gl_FragCoord.xy + uSeed * 91.7) + hash(gl_FragCoord.xy * 1.37 - uSeed * 47.3) - 1.0;
  // film grain sits mostly in the mids, like the print it was traced from
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col += n * uGrain * (0.35 + lum * (1.0 - lum) * 2.6);
  outColor = vec4(col, 1.0);
}`;

// Helpers

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// The light needed, over the background, for a layer on its own to peak at the colour picked for it
function emission(color: string, bg: [number, number, number]) {
  const c = hexToRgb(color);
  return c.map((v, i) => Math.max(Math.log((1 - bg[i]) / Math.max(1 - Math.min(v, 0.985), 0.015)), 0)) as [
    number,
    number,
    number,
  ];
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`AuroraRibbon shader: ${log}`);
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
    throw new Error(`AuroraRibbon program: ${gl.getProgramInfoLog(program)}`);
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

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

const wave = (t: number, phase: number) => Math.sin(t + phase) - Math.sin(phase);

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

// Component

export interface AuroraRibbonProps {
  /** Canvas colour behind the light. */
  backgroundColor?: string;
  /** The wide, dim glow at the ribbon's edges. */
  haloColor?: string;
  /** The soft body of the ribbon. */
  glowColor?: string;
  /** Light added along the centre line, on top of the glow. */
  coreColor?: string;
  /** Overall brightness. 1 matches the reference. */
  intensity?: number;
  /** How diffuse the light is. Above 1 spreads it wider and softer. */
  softness?: number;
  /** How fast the ribbon drifts. 0 holds it still. */
  speed?: number;
  /** How far the ribbon sways while it drifts. */
  flow?: number;
  /** Film grain strength. 0 turns it off. */
  grain?: number;
  /** Let the pointer stir the light like ink in water. */
  interactive?: boolean;
  /** How far a stroke drags the light. */
  smearStrength?: number;
  /** Width of the stroke, in canvas heights. */
  smearRadius?: number;
  /** Content laid over the background. */
  children?: ReactNode;
  className?: string;
}

export default function AuroraRibbon({
  backgroundColor = "#0c1218",
  haloColor = "#13605d",
  glowColor = "#73bea1",
  coreColor = "#b8bc5b",
  intensity = 1,
  softness = 1,
  speed = 1,
  flow = 1,
  grain = 0.06,
  interactive = true,
  smearStrength = 1,
  smearRadius = 0.08,
  children,
  className = "",
}: AuroraRibbonProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const configRef = useRef({
    backgroundColor,
    haloColor,
    glowColor,
    coreColor,
    intensity,
    softness,
    speed,
    flow,
    grain,
    interactive,
    smearStrength,
    smearRadius,
    reducedMotion,
  });
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    configRef.current = {
      backgroundColor,
      haloColor,
      glowColor,
      coreColor,
      intensity,
      softness,
      speed,
      flow,
      grain,
      interactive,
      smearStrength,
      smearRadius,
      reducedMotion,
    };
    // a held frame (reduced motion, offscreen) still picks up new colours
    redrawRef.current();
  }, [
    backgroundColor,
    haloColor,
    glowColor,
    coreColor,
    intensity,
    softness,
    speed,
    flow,
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
    // the smear needs signed values; without float targets the light just doesn't stir
    const floatTargets = !!gl.getExtension("EXT_color_buffer_float");

    let fieldProgram: WebGLProgram;
    let glowProgram: WebGLProgram;
    let grainProgram: WebGLProgram;
    try {
      fieldProgram = link(gl, FIELD_FS);
      glowProgram = link(gl, GLOW_FS);
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

    const glowTarget = makeTarget(gl);
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
    const glowU = {
      res: u(glowProgram, "uRes"),
      aspect: u(glowProgram, "uAspect"),
      scale: u(glowProgram, "uScale"),
      pts: u(glowProgram, "uPts"),
      e: u(glowProgram, "uE"),
      widths: u(glowProgram, "uWidths"),
      bg: u(glowProgram, "uBg"),
      coreE: u(glowProgram, "uCoreE"),
      glowE: u(glowProgram, "uGlowE"),
      haloE: u(glowProgram, "uHaloE"),
      field: u(glowProgram, "uField"),
      smear: u(glowProgram, "uSmear"),
    };
    const grainU = {
      glow: u(grainProgram, "uGlow"),
      res: u(grainProgram, "uRes"),
      grain: u(grainProgram, "uGrain"),
      seed: u(grainProgram, "uSeed"),
    };

    const pts = new Float32Array(SAMPLES * 2);
    const light = new Float32Array(SAMPLES * 2);
    const ctrl = SPINE.map(([x, y]) => [(x - 0.5) * REF_ASPECT, 0.5 - y]);
    const moved = ctrl.map((p) => [p[0], p[1]]);

    let width = 1;
    let height = 1;
    let glowW = 1;
    let glowH = 1;
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
      glowW = Math.max(1, Math.round(width * GLOW_SCALE));
      glowH = Math.max(1, Math.round(height * GLOW_SCALE));
      fieldH = Math.min(FIELD_HEIGHT, glowH);
      fieldW = Math.max(1, Math.round(fieldH * aspect));
      sizeTarget(gl, glowTarget, glowW, glowH, false);
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

    const shape = (time: number) => {
      const cfg = configRef.current;
      const sway = cfg.flow;
      for (let i = 0; i < ctrl.length; i++) {
        const [bx, by] = ctrl[i];
        // two slow waves travel down the spine; their phase changes gently from point to point
        // so the S undulates as one ribbon instead of wobbling. Both start at zero, so the
        // first frame is the traced artwork.
        moved[i][0] = bx + sway * (0.05 * wave(time * 0.42, i * 0.55) + 0.025 * wave(time * 0.67, i * 0.9 + 1.3));
        moved[i][1] = by + sway * (0.022 * wave(time * 0.35, i * 0.7 + 0.6) + 0.012 * wave(time * 0.6, i * 1.1));
      }

      const segs = moved.length - 1;
      for (let s = 0; s < SAMPLES; s++) {
        const f = (s / (SAMPLES - 1)) * segs;
        const i = Math.min(Math.floor(f), segs - 1);
        const t = f - i;
        const p0 = moved[Math.max(i - 1, 0)];
        const p1 = moved[i];
        const p2 = moved[i + 1];
        const p3 = moved[Math.min(i + 2, moved.length - 1)];
        pts[s * 2] = catmullRom(p0[0], p1[0], p2[0], p3[0], t);
        pts[s * 2 + 1] = catmullRom(p0[1], p1[1], p2[1], p3[1], t);
      }

      for (let s = 0; s < SAMPLES; s++) {
        const k = s / (SAMPLES - 1);
        // fade in from the top corner and out along the bottom, like the reference
        const ends = smoothstep(-0.2, 0.5, k) * (1 - smoothstep(0.65, 0.98, k));
        // a slow swell travelling down the ribbon
        const swell = 0.9 + 0.1 * Math.sin(k * 9 - time * 0.9);
        const energy = ends * swell * cfg.intensity;

        // light pools inside the tight bends
        const a = Math.max(s - 1, 0);
        const b = Math.min(s + 1, SAMPLES - 1);
        const tx = pts[b * 2] - pts[a * 2];
        const ty = pts[b * 2 + 1] - pts[a * 2 + 1];
        const tl = Math.hypot(tx, ty) || 1e-4;
        const kx = pts[a * 2] + pts[b * 2] - 2 * pts[s * 2];
        const ky = pts[a * 2 + 1] + pts[b * 2 + 1] - 2 * pts[s * 2 + 1];
        const bend = Math.abs((kx * -ty + ky * tx) / tl) / (tl * 0.5) ** 2;
        light[s * 2] = energy;
        light[s * 2 + 1] = energy * POOL_GAIN * smoothstep(POOL_BEND_FROM, POOL_BEND_TO, bend);
      }
    };

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
      const bg = hexToRgb(cfg.backgroundColor);
      const soft = Math.max(cfg.softness, 0.2);
      shape(time);

      gl.bindFramebuffer(gl.FRAMEBUFFER, glowTarget.fbo);
      gl.viewport(0, 0, glowW, glowH);
      gl.useProgram(glowProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fieldRead.tex);
      gl.uniform1i(glowU.field, 0);
      gl.uniform1f(glowU.smear, stirred ? 1 : 0);
      gl.uniform2f(glowU.res, glowW, glowH);
      gl.uniform1f(glowU.aspect, aspect);
      gl.uniform1f(glowU.scale, scale);
      gl.uniform2fv(glowU.pts, pts);
      gl.uniform2fv(glowU.e, light);
      gl.uniform4f(glowU.widths, CORE_WIDTH * soft, GLOW_WIDTH * soft, HALO_WIDTH * soft, POOL_WIDTH * soft);
      gl.uniform3fv(glowU.bg, bg);
      gl.uniform3fv(glowU.coreE, emission(cfg.coreColor, bg));
      gl.uniform3fv(glowU.glowE, emission(cfg.glowColor, bg));
      gl.uniform3fv(glowU.haloE, emission(cfg.haloColor, bg));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(grainProgram);
      gl.bindTexture(gl.TEXTURE_2D, glowTarget.tex);
      gl.uniform1i(grainU.glow, 0);
      gl.uniform2f(grainU.res, width, height);
      gl.uniform1f(grainU.grain, cfg.grain);
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
      gl.deleteProgram(glowProgram);
      gl.deleteProgram(grainProgram);
      gl.deleteBuffer(quad);
      for (const target of [glowTarget, fieldRead, fieldWrite]) {
        gl.deleteTexture(target.tex);
        gl.deleteFramebuffer(target.fbo);
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`relative h-full w-full overflow-hidden ${className}`.trim()}
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
      {children ? <div className="relative z-10 h-full w-full">{children}</div> : null}
    </div>
  );
}
