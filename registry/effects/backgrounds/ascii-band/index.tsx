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

// The band's light, fitted to the reference artwork. Widths are in canvas heights and grow with x²,
// which pinches the band at the centre and flares it toward the edges.
const CORE = { width: [0.0637, 0.4791], reach: 0.4585, light: [1.088, 1.619, 0] as Rgb };
const GLOW = { width: [0.0971, 0.4331], edge: 3.44, falloff: 0.6685, light: [0.635, 0.181, 1.799] as Rgb };
const HALO = { width: [0.1432, 0.1803], light: [0.235, 0.148, 0.491] as Rgb };
const REF_ASPECT = 1.389;
// Character cells are this many times taller than wide, like the monospace grid in the reference
const CELL_RATIO = 1.69;
// The glow is soft, so it renders at a fraction of the canvas; glyphs and grain run at full size
const GLOW_SCALE = 0.5;
// The smear field is softer still
const FIELD_HEIGHT = 160;
const MAX_DPR = 1.5;

// Smear: how long a stir takes to settle, and how far it carries itself
const SMEAR_HALF_LIFE = 0.4;
const SMEAR_ADVECT = 2;
const SMEAR_MAX = 0.4;

const glsl = (v: number) => v.toFixed(4);
const glslVec = (v: Rgb) => `vec3(${v.map(glsl).join(", ")})`;

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
  float s = exp(-dot(d, d) / (uRadius * uRadius));
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
uniform vec2 uRes;
uniform float uAspect;
uniform float uScale;
uniform float uTime;
uniform float uFlow;
uniform float uSoft;
uniform float uIntensity;
uniform vec3 uBg;
uniform sampler2D uField;
uniform float uSmear;
out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 drag = uSmear > 0.0 ? texture(uField, uv).xy : vec2(0.0);
  // show the light from where the stir dragged it from
  vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5) / uScale - drag;
  float x = p.x;
  float x2 = x * x;

  // the band drifts up and down in slow waves running along it, and breathes in and out.
  // Every term starts at zero, so the first frame is the traced artwork.
  float t = uTime;
  float lift = uFlow * (0.03 * (sin(x * 1.7 + t * 0.45) - sin(x * 1.7)) + 0.015 * (sin(x * 3.3 - t * 0.7) - sin(x * 3.3)));
  float breathe = 1.0 + uFlow * (0.08 * sin(t * 0.5) + 0.05 * (sin(x * 2.3 - t * 0.6) - sin(x * 2.3)));
  // the reference band sits a touch below centre
  float y = p.y - lift + 0.01;

  float cw = (${glsl(CORE.width[0])} + ${glsl(CORE.width[1])} * x2) * breathe * uSoft;
  float gw = (${glsl(GLOW.width[0])} + ${glsl(GLOW.width[1])} * x2) * breathe * uSoft;
  float hw = (${glsl(HALO.width[0])} + ${glsl(HALO.width[1])} * x2) * uSoft;
  float core = exp(-(y * y) / (cw * cw)) * exp(-x2 / ${glsl(CORE.reach * CORE.reach)});
  float glow = exp(-pow(abs(y / gw), ${glsl(GLOW.edge)})) * max(1.0 - ${glsl(GLOW.falloff)} * x2, 0.0);
  float halo = exp(-(y * y) / (hw * hw));

  vec3 light = (core * ${glslVec(CORE.light)} + glow * ${glslVec(GLOW.light)} + halo * ${glslVec(HALO.light)}) * uIntensity;
  // stirred light glows a touch brighter, like it's been woken up
  light *= 1.0 + uSmear * min(length(drag) * 2.5, 0.5);
  outColor = vec4(1.0 - (1.0 - uBg) * exp(-light), 1.0);
}`;

// Characters, grain and grade. Each cell reads the light at its centre and picks a glyph from the
// ramp by brightness, nudged by a per-cell random value that re-rolls now and then so the grid shimmers.
const FINAL_FS = `#version 300 es
precision highp float;
uniform sampler2D uGlow;
uniform sampler2D uAtlas;
uniform vec2 uRes;
uniform vec2 uCell;
uniform float uGlyphCount;
uniform float uGlyphs;
uniform float uGap;
uniform float uFlicker;
uniform float uTime;
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
  vec3 col = texture(uGlow, uv).rgb;

  if (uGlyphs > 0.0) {
    // the grid starts at the top-left corner, like text
    vec2 fc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
    vec2 cell = floor(fc / uCell);
    vec2 local = fract(fc / uCell);
    vec2 centre = (cell + 0.5) * uCell / uRes;
    vec3 under = texture(uGlow, vec2(centre.x, 1.0 - centre.y)).rgb;
    float lum = dot(under, vec3(0.299, 0.587, 0.114));

    float tick = floor(uTime * uFlicker + hash(cell) * 7.0);
    float jitter = hash(cell + tick * 17.31) - 0.5;
    float blank = step(hash(cell * 1.7 + tick * 3.13), uGap);
    float level = clamp(lum * 1.12 + jitter * 0.32, 0.0, 0.999);
    float index = floor(level * uGlyphCount);
    float mask = texture(uAtlas, vec2((index + local.x) / uGlyphCount, local.y)).a;
    mask *= (1.0 - blank) * smoothstep(0.03, 0.3, lum) * uGlyphs;
    // glyphs are a lighter tint of the light they sit in, turning white over the bright core
    vec3 ink = mix(under * 1.6 + 0.06, vec3(1.0), smoothstep(0.45, 0.9, lum));
    col = mix(col, ink, mask);
  }

  col = grade(col);
  float n = hash(gl_FragCoord.xy + uSeed * 91.7) + hash(gl_FragCoord.xy * 1.37 - uSeed * 47.3) - 1.0;
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col += n * uGrain * (0.35 + lum * (1.0 - lum) * 2.6);
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
    throw new Error(`AsciiBand shader: ${log}`);
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
    throw new Error(`AsciiBand program: ${gl.getProgramInfoLog(program)}`);
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

// Draws the ramp, left to right, into one strip: white glyphs on transparent, one per cell
function drawAtlas(ramp: string, cellW: number, cellH: number) {
  const chars = Array.from(ramp);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(cellW * chars.length));
  canvas.height = Math.max(1, Math.round(cellH));
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.round(cellH * 0.9)}px "Courier New", Courier, monospace`;
  chars.forEach((ch, i) => ctx.fillText(ch, (i + 0.5) * cellW, cellH * 0.54));
  return { canvas, count: chars.length };
}

// Component

export interface AsciiBandProps {
  /** Canvas colour behind the light. */
  backgroundColor?: string;
  /** Turns every colour around the colour wheel, in degrees. 0 is the reference violet. */
  hue?: number;
  /** Colour strength. 0 is greyscale, 1 matches the reference. */
  saturation?: number;
  /** Overall brightness. 1 matches the reference. */
  intensity?: number;
  /** How diffuse the light is. Above 1 spreads the band wider and softer. */
  softness?: number;
  /** Characters from darkest to brightest. The first is usually a space. */
  characters?: string;
  /** Width of one character cell, in px. */
  cellSize?: number;
  /** Strength of the character layer. 0 hides it. */
  glyphOpacity?: number;
  /** Share of cells left empty, 0 to 1. */
  gaps?: number;
  /** How often each character re-rolls, per second. 0 freezes the grid. */
  flicker?: number;
  /** How fast the band drifts. 0 holds it still. */
  speed?: number;
  /** How far the band sways and breathes while it drifts. */
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

export default function AsciiBand({
  backgroundColor = "#000000",
  hue = 0,
  saturation = 1,
  intensity = 1,
  softness = 1,
  characters = " =+xX80S#@",
  cellSize = 16,
  glyphOpacity = 1,
  gaps = 0.22,
  flicker = 1.5,
  speed = 1,
  flow = 1,
  grain = 0.03,
  interactive = true,
  smearStrength = 1,
  smearRadius = 0.1,
  children,
  className = "",
}: AsciiBandProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const config = {
    backgroundColor,
    hue,
    saturation,
    intensity,
    softness,
    characters,
    cellSize,
    glyphOpacity,
    gaps,
    flicker,
    speed,
    flow,
    grain,
    interactive,
    smearStrength,
    smearRadius,
    reducedMotion,
  };
  const configRef = useRef(config);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    configRef.current = config;
    // a held frame (reduced motion, offscreen) still picks up new settings
    redrawRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.values(config));

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
    let finalProgram: WebGLProgram;
    try {
      fieldProgram = link(gl, FIELD_FS);
      glowProgram = link(gl, GLOW_FS);
      finalProgram = link(gl, FINAL_FS);
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
    const atlas = makeTarget(gl);
    let atlasKey = "";
    let glyphCount = 1;

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
      time: u(glowProgram, "uTime"),
      flow: u(glowProgram, "uFlow"),
      soft: u(glowProgram, "uSoft"),
      intensity: u(glowProgram, "uIntensity"),
      bg: u(glowProgram, "uBg"),
      field: u(glowProgram, "uField"),
      smear: u(glowProgram, "uSmear"),
    };
    const finalU = {
      glow: u(finalProgram, "uGlow"),
      atlas: u(finalProgram, "uAtlas"),
      res: u(finalProgram, "uRes"),
      cell: u(finalProgram, "uCell"),
      glyphCount: u(finalProgram, "uGlyphCount"),
      glyphs: u(finalProgram, "uGlyphs"),
      gap: u(finalProgram, "uGap"),
      flicker: u(finalProgram, "uFlicker"),
      time: u(finalProgram, "uTime"),
      grain: u(finalProgram, "uGrain"),
      seed: u(finalProgram, "uSeed"),
      hue: u(finalProgram, "uHue"),
      saturation: u(finalProgram, "uSaturation"),
    };

    let width = 1;
    let height = 1;
    let dpr = 1;
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
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
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
      atlasKey = "";
    };

    const cellPx = () => {
      const w = Math.max(configRef.current.cellSize, 4) * dpr;
      return [w, w * CELL_RATIO];
    };

    const syncAtlas = () => {
      const [cw, ch] = cellPx();
      const key = `${configRef.current.characters}|${cw}|${ch}`;
      if (key === atlasKey) return;
      atlasKey = key;
      const { canvas: strip, count } = drawAtlas(configRef.current.characters || " ", cw, ch);
      glyphCount = count;
      gl.bindTexture(gl.TEXTURE_2D, atlas.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, strip);
    };

    // pointer in canvas uv (y up) and in the shader's space, plus how far it moved since the last frame
    const pointer = { u: 0.5, v: 0.5, x: 0, y: 0, dx: 0, dy: 0, inside: false, fresh: true };
    let clock = 0;
    let wall = 0;
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

    const draw = () => {
      const cfg = configRef.current;
      syncAtlas();

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
      gl.uniform1f(glowU.time, clock);
      gl.uniform1f(glowU.flow, cfg.flow);
      gl.uniform1f(glowU.soft, Math.max(cfg.softness, 0.2));
      gl.uniform1f(glowU.intensity, cfg.intensity);
      gl.uniform3fv(glowU.bg, hexToRgb(cfg.backgroundColor));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(finalProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, glowTarget.tex);
      gl.uniform1i(finalU.glow, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, atlas.tex);
      gl.uniform1i(finalU.atlas, 1);
      gl.activeTexture(gl.TEXTURE0);
      const [cw, ch] = cellPx();
      gl.uniform2f(finalU.res, width, height);
      gl.uniform2f(finalU.cell, cw, ch);
      gl.uniform1f(finalU.glyphCount, glyphCount);
      gl.uniform1f(finalU.glyphs, cfg.glyphOpacity);
      gl.uniform1f(finalU.gap, cfg.gaps);
      gl.uniform1f(finalU.flicker, cfg.reducedMotion ? 0 : cfg.flicker);
      // characters shimmer on the wall clock, so Speed 0 still lets them flicker
      gl.uniform1f(finalU.time, wall);
      gl.uniform1f(finalU.grain, cfg.grain);
      gl.uniform1f(finalU.hue, (cfg.hue * Math.PI) / 180);
      gl.uniform1f(finalU.saturation, cfg.saturation);
      // grain steps at film rate rather than every frame
      gl.uniform1f(finalU.seed, cfg.reducedMotion ? 0 : Math.floor(wall * 24) % 97);
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
      wall += dt;
      stir(dt);
      pointer.dx = 0;
      pointer.dy = 0;
      draw();
      schedule();
    };

    const schedule = () => {
      if (raf || !visible || !onscreen || configRef.current.reducedMotion) return;
      raf = requestAnimationFrame(frame);
    };

    const redraw = () => {
      if (configRef.current.reducedMotion) {
        stirred = false;
        draw();
        return;
      }
      if (!raf) draw();
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
      draw();
    });
    ro.observe(root);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    draw();
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
      gl.deleteProgram(finalProgram);
      gl.deleteBuffer(quad);
      for (const target of [glowTarget, fieldRead, fieldWrite, atlas]) {
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
