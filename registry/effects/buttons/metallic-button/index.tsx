"use client";

import { Sparkles } from "lucide-react";
import type React from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
const VERTEX_SHADER = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) {
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) {
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  vec2 objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;
}`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colorTint;

uniform float u_softness;
uniform float u_repetition;
uniform float u_shiftRed;
uniform float u_shiftBlue;
uniform float u_distortion;
uniform float u_contour;
uniform float u_angle;

in vec2 v_objectUV;
in vec2 v_responsiveUV;
in vec2 v_responsiveBoxGivenSize;

out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float getColorChanges(float c1, float c2, float stripe_p, vec3 w, float blur, float bump, float tint) {
  float ch = mix(c2, c1, smoothstep(.0, 2. * blur, stripe_p));

  float border = w[0];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + .4 * (1. - bump) * w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + .5 * (1. - bump) * w[1];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
  ch = mix(ch, gradient, smoothstep(border, border + .5 * blur, stripe_p));

  ch = mix(ch, 1. - min(1., (1. - ch) / max(tint, 0.0001)), u_colorTint.a);
  return ch;
}

void main() {
  const float firstFrameOffset = 2.8;
  float t = .3 * (u_time + firstFrameOffset);

  vec2 uv = v_objectUV + .5;
  uv.y = 1. - uv.y;

  float cycleWidth = u_repetition;
  float edge = 0.;

  vec2 rotatedUV = uv - vec2(.5);
  float angle = (-u_angle + 70.) * PI / 180.;
  float cosA = cos(angle);
  float sinA = sin(angle);
  rotatedUV = vec2(
  rotatedUV.x * cosA - rotatedUV.y * sinA,
  rotatedUV.x * sinA + rotatedUV.y * cosA
  ) + vec2(.5);

  vec2 shapeUV = uv - .5;
  shapeUV *= .67;
  edge = pow(clamp(3. * length(shapeUV), 0., 1.), 18.);

  edge = mix(smoothstep(.9 - 2. * fwidth(edge), .9, edge), edge, smoothstep(0.0, 0.4, u_contour));

  float opacity = 1. - smoothstep(.9 - 2. * fwidth(edge), .9, edge);
  edge = 1.2 * edge;

  float diagBLtoTR = rotatedUV.x - rotatedUV.y;
  float diagTLtoBR = rotatedUV.x + rotatedUV.y;

  vec3 color = vec3(0.);
  vec3 color1 = vec3(.98, 0.98, 1.);
  vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, diagTLtoBR));

  vec2 grad_uv = uv - .5;

  float dist = length(grad_uv + vec2(0., .2 * diagBLtoTR));
  grad_uv = rotate(grad_uv, (.25 - .2 * diagBLtoTR) * PI);
  float direction = grad_uv.x;

  float bump = pow(1.8 * dist, 1.2);
  bump = 1. - bump;
  bump *= pow(uv.y, .3);

  float thin_strip_1_ratio = .12 / cycleWidth * (1. - .4 * bump);
  float thin_strip_2_ratio = .07 / cycleWidth * (1. + .4 * bump);
  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);

  float thin_strip_1_width = cycleWidth * thin_strip_1_ratio;
  float thin_strip_2_width = cycleWidth * thin_strip_2_ratio;

  float noise = snoise(uv - t);

  edge += (1. - edge) * u_distortion * noise;

  direction += diagBLtoTR;
  float contour = 0.;
  direction -= 2. * noise * diagBLtoTR * (smoothstep(0., 1., edge) * (1.0 - smoothstep(0., 1., edge)));
  direction *= mix(1., 1. - edge, smoothstep(.5, 1., u_contour));
  direction -= 1.7 * edge * smoothstep(.5, 1., u_contour);
  direction += .2 * pow(u_contour, 4.) * (1.0 - smoothstep(0., 1., edge));

  bump *= clamp(pow(uv.y, .1), .3, 1.);
  direction *= (.1 + (1.1 - edge) * bump);

  direction *= (.4 + .6 * (1.0 - smoothstep(.5, 1., edge)));
  direction += .18 * (smoothstep(.1, .2, uv.y) * (1.0 - smoothstep(.2, .4, uv.y)));
  direction += .03 * (smoothstep(.1, .2, 1. - uv.y) * (1.0 - smoothstep(.2, .4, 1. - uv.y)));

  direction *= (.5 + .5 * pow(uv.y, 2.));
  direction *= cycleWidth;
  direction -= t;

  float colorDispersion = (1. - bump);
  colorDispersion = clamp(colorDispersion, 0., 1.);
  float dispersionRed = colorDispersion;
  dispersionRed += .03 * bump * noise;
  dispersionRed += 5. * (smoothstep(-.1, .2, uv.y) * (1.0 - smoothstep(.1, .5, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, 1., bump)));
  dispersionRed -= diagBLtoTR;

  float dispersionBlue = colorDispersion;
  dispersionBlue *= 1.3;
  dispersionBlue += (smoothstep(0., .4, uv.y) * (1.0 - smoothstep(.1, .8, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, .8, bump)));
  dispersionBlue -= .2 * edge;

  dispersionRed *= (u_shiftRed / 20.);
  dispersionBlue *= (u_shiftBlue / 20.);

  float blur = u_softness / 15. + .3 * contour;

  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
  w[1] -= .02 * smoothstep(.0, 1., edge + bump);
  float stripe_r = fract(direction + dispersionRed);
  float r = getColorChanges(color1.r, color2.r, stripe_r, w, blur + fwidth(stripe_r), bump, u_colorTint.r);
  float stripe_g = fract(direction);
  float g = getColorChanges(color1.g, color2.g, stripe_g, w, blur + fwidth(stripe_g), bump, u_colorTint.g);
  float stripe_b = fract(direction - dispersionBlue);
  float b = getColorChanges(color1.b, color2.b, stripe_b, w, blur + fwidth(stripe_b), bump, u_colorTint.b);

  color = vec3(r, g, b);
  color *= opacity;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);

  fragColor = vec4(color, opacity);
}`;

interface MetallicShaderUniforms {
  colorBack: string;
  colorTint: string;
  repetition: number;
  softness: number;
  angle: number;
  scale: number;
  distortion: number;
  shiftRed: number;
  shiftBlue: number;
}

const DEFAULT_MIN_PIXEL_RATIO = 2;
const DEFAULT_MAX_PIXEL_COUNT = 1920 * 1080 * 4;

export function parseColor(value: string): [number, number, number, number] {
  const fallback: [number, number, number, number] = [1, 1, 1, 1];
  if (typeof value !== "string") return fallback;

  let hex = value.trim().replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  if (hex.length === 6) hex += "ff";
  if (hex.length !== 8) return fallback;

  const int = Number.parseInt(hex, 16);
  if (Number.isNaN(int)) return fallback;

  return [
    ((int >> 24) & 255) / 255,
    ((int >> 16) & 255) / 255,
    ((int >> 8) & 255) / 255,
    (int & 255) / 255,
  ];
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

class MetallicShaderMount {
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private canvas: HTMLCanvasElement;
  private parent: HTMLElement;
  private locations: Record<string, WebGLUniformLocation | null> = {};
  private rafId: number | null = null;
  private lastRenderTime = 0;
  private currentFrame = 0;
  private speed: number;
  private uniforms: MetallicShaderUniforms;
  private renderScale = 1;
  private resolutionChanged = true;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private isInViewport = true;
  private disposed = false;

  constructor(
    parent: HTMLElement,
    uniforms: MetallicShaderUniforms,
    speed: number,
  ) {
    this.parent = parent;
    this.uniforms = uniforms;
    this.speed = speed;

    this.canvas = document.createElement("canvas");
    parent.prepend(this.canvas);

    const gl = this.canvas.getContext("webgl2", {
      antialias: true,
      premultipliedAlpha: true,
      alpha: true,
    });
    if (!gl) return;

    const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    this.gl = gl;
    this.program = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    this.cacheLocations();
    this.setupObservers();
    this.handleResize();
    this.renderFrame(performance.now());
    if (speed !== 0) this.requestRender();
  }

  private cacheLocations() {
    const gl = this.gl;
    const program = this.program;
    if (!gl || !program) return;

    const names = [
      "u_time",
      "u_resolution",
      "u_pixelRatio",
      "u_colorBack",
      "u_colorTint",
      "u_softness",
      "u_repetition",
      "u_shiftRed",
      "u_shiftBlue",
      "u_distortion",
      "u_contour",
      "u_angle",
      "u_originX",
      "u_originY",
      "u_worldWidth",
      "u_worldHeight",
      "u_fit",
      "u_scale",
      "u_rotation",
      "u_offsetX",
      "u_offsetY",
    ];
    for (const name of names) {
      this.locations[name] = gl.getUniformLocation(program, name);
    }
  }

  private setupObservers() {
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.parent);

    if (typeof IntersectionObserver !== "undefined") {
      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        this.isInViewport = entry?.isIntersecting ?? true;
        if (this.isInViewport && this.speed !== 0) this.requestRender();
      });
      this.intersectionObserver.observe(this.parent);
    }
  }

  private handleResize = () => {
    const gl = this.gl;
    if (!gl || this.disposed) return;

    const width = this.parent.clientWidth;
    const height = this.parent.clientHeight;
    if (width === 0 || height === 0) return;

    const dpr = Math.max(1, window.devicePixelRatio);
    const targetRenderScale = Math.max(dpr, DEFAULT_MIN_PIXEL_RATIO);
    let targetPixelWidth = Math.round(width) * targetRenderScale;
    let targetPixelHeight = Math.round(height) * targetRenderScale;

    const headroom =
      Math.sqrt(DEFAULT_MAX_PIXEL_COUNT) /
      Math.sqrt(targetPixelWidth * targetPixelHeight);
    const clamp = Math.min(1, headroom);
    const newWidth = Math.round(targetPixelWidth * clamp);
    const newHeight = Math.round(targetPixelHeight * clamp);

    if (this.canvas.width === newWidth && this.canvas.height === newHeight) {
      return;
    }

    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    this.renderScale = newWidth / Math.round(width);
    this.resolutionChanged = true;
    gl.viewport(0, 0, newWidth, newHeight);
    this.renderFrame(performance.now());
  };

  private pushUniforms() {
    const gl = this.gl;
    if (!gl) return;

    const u = this.uniforms;
    gl.uniform4fv(this.locations.u_colorBack ?? null, parseColor(u.colorBack));
    gl.uniform4fv(this.locations.u_colorTint ?? null, parseColor(u.colorTint));
    gl.uniform1f(this.locations.u_repetition ?? null, u.repetition);
    gl.uniform1f(this.locations.u_softness ?? null, u.softness);
    gl.uniform1f(this.locations.u_angle ?? null, u.angle);
    gl.uniform1f(this.locations.u_distortion ?? null, u.distortion);
    gl.uniform1f(this.locations.u_shiftRed ?? null, u.shiftRed);
    gl.uniform1f(this.locations.u_shiftBlue ?? null, u.shiftBlue);
    gl.uniform1f(this.locations.u_contour ?? null, 0);

    gl.uniform1f(this.locations.u_scale ?? null, u.scale);
    gl.uniform1f(this.locations.u_fit ?? null, 1);
    gl.uniform1f(this.locations.u_rotation ?? null, 0);
    gl.uniform1f(this.locations.u_offsetX ?? null, 0.1);
    gl.uniform1f(this.locations.u_offsetY ?? null, -0.1);
    gl.uniform1f(this.locations.u_originX ?? null, 0.5);
    gl.uniform1f(this.locations.u_originY ?? null, 0.5);
    gl.uniform1f(this.locations.u_worldWidth ?? null, 0);
    gl.uniform1f(this.locations.u_worldHeight ?? null, 0);
  }

  private renderFrame = (currentTime: number) => {
    const gl = this.gl;
    if (!gl || !this.program || this.disposed) return;

    const dt = currentTime - this.lastRenderTime;
    this.lastRenderTime = currentTime;
    if (this.speed !== 0 && this.isInViewport) {
      this.currentFrame += dt * this.speed;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);

    gl.uniform1f(this.locations.u_time ?? null, this.currentFrame * 1e-3);
    if (this.resolutionChanged) {
      gl.uniform2f(
        this.locations.u_resolution ?? null,
        this.canvas.width,
        this.canvas.height,
      );
      gl.uniform1f(this.locations.u_pixelRatio ?? null, this.renderScale);
      this.resolutionChanged = false;
    }
    this.pushUniforms();

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (this.speed !== 0 && this.isInViewport) {
      this.requestRender();
    } else {
      this.rafId = null;
    }
  };

  private requestRender = () => {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.renderFrame);
  };

  setSpeed(speed: number) {
    this.speed = speed;
    if (speed === 0) {
      if (this.rafId !== null) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.renderFrame(performance.now());
      return;
    }
    if (this.rafId === null) {
      this.lastRenderTime = performance.now();
      this.requestRender();
    }
  }

  setUniforms(uniforms: Partial<MetallicShaderUniforms>) {
    this.uniforms = { ...this.uniforms, ...uniforms };
    if (this.rafId === null) this.renderFrame(performance.now());
  }

  dispose() {
    this.disposed = true;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = null;
    if (this.gl && this.program) this.gl.deleteProgram(this.program);
    this.gl = null;
    this.program = null;
    this.canvas.remove();
  }
}


const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    prefersReducedMotion,
    getServerReducedMotionSnapshot,
  );
}

const SETTLE = "transition-all duration-800 ease-[cubic-bezier(0.34,1.56,0.64,1)]";
const SHADOW_SHIFT =
  "transition-[box-shadow] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]";

const RIM_PRESSED =
  "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.5),0px_1px_2px_0px_rgba(0,0,0,0.3)]";
const RIM_HOVERED =
  "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.4),0px_12px_6px_0px_rgba(0,0,0,0.05),0px_8px_5px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.2)]";
const RIM_RESTING =
  "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.3),0px_36px_14px_0px_rgba(0,0,0,0.02),0px_20px_12px_0px_rgba(0,0,0,0.08),0px_9px_9px_0px_rgba(0,0,0,0.12),0px_2px_5px_0px_rgba(0,0,0,0.15)]";
const FACE_PRESSED =
  "shadow-[inset_0px_2px_4px_rgba(0,0,0,0.4),inset_0px_1px_2px_rgba(0,0,0,0.3)]";

interface MetallicButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
  className?: string;
  baseColor?: string;
  sheenColor?: string;
  bandCount?: number;
  edgeBlur?: number;
  flowAngle?: number;
  zoom?: number;
  warp?: number;
  redFringe?: number;
  blueFringe?: number;
  idleSpeed?: number;
  hoverSpeed?: number;
  clickSpeed?: number;
}

export function MetallicButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
  className = "",
  baseColor = "#000000",
  sheenColor = "#ffffff",
  bandCount = 4,
  edgeBlur = 0.5,
  flowAngle = 45,
  zoom = 8,
  warp = 0,
  redFringe = 0.3,
  blueFringe = 0.3,
  idleSpeed = 0.6,
  hoverSpeed = 1,
  clickSpeed = 2.4,
}: MetallicButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const mount = useRef<MetallicShaderMount | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);
  const isHoveredRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const uniformsRef = useRef<MetallicShaderUniforms>({
    colorBack: baseColor,
    colorTint: sheenColor,
    repetition: bandCount,
    softness: edgeBlur,
    angle: flowAngle,
    scale: zoom,
    distortion: warp,
    shiftRed: redFringe,
    shiftBlue: blueFringe,
  });
  const idleSpeedRef = useRef(idleSpeed);
  const reducedMotionRef = useRef(reducedMotion);
  uniformsRef.current = {
    colorBack: baseColor,
    colorTint: sheenColor,
    repetition: bandCount,
    softness: edgeBlur,
    angle: flowAngle,
    scale: zoom,
    distortion: warp,
    shiftRed: redFringe,
    shiftBlue: blueFringe,
  };
  idleSpeedRef.current = idleSpeed;
  reducedMotionRef.current = reducedMotion;

  const isIcon = viewMode === "icon";
  const shellSize = isIcon ? "h-11.5 w-11.5" : "h-11.5 w-35.5";
  const faceSize = isIcon ? "h-10.5 w-10.5" : "h-10.5 w-34.5";
  const pressShift = isPressed
    ? "translate-y-px scale-[0.98]"
    : "translate-y-0 scale-100";

  const applyUniforms = useCallback(() => {
    mount.current?.setUniforms({
      colorBack: baseColor,
      colorTint: sheenColor,
      repetition: bandCount,
      softness: edgeBlur,
      angle: flowAngle,
      scale: zoom,
      distortion: warp,
      shiftRed: redFringe,
      shiftBlue: blueFringe,
    });
  }, [
    baseColor,
    bandCount,
    blueFringe,
    edgeBlur,
    flowAngle,
    redFringe,
    sheenColor,
    warp,
    zoom,
  ]);

  useEffect(() => {
    const styleId = "metallic-button-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .metallic-button-canvas canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes metallic-button-ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    if (!surfaceRef.current) return;

    mount.current = new MetallicShaderMount(
      surfaceRef.current,
      uniformsRef.current,
      reducedMotionRef.current ? 0 : idleSpeedRef.current,
    );

    return () => {
      mount.current?.dispose();
      mount.current = null;
    };
  }, []);

  useEffect(() => {
    applyUniforms();
  }, [applyUniforms]);

  useEffect(() => {
    if (reducedMotion) {
      mount.current?.setSpeed(0);
      return;
    }
    if (!isHoveredRef.current) mount.current?.setSpeed(idleSpeed);
  }, [idleSpeed, reducedMotion]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    isHoveredRef.current = true;
    if (!reducedMotion) mount.current?.setSpeed(hoverSpeed);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    isHoveredRef.current = false;
    setIsPressed(false);
    if (!reducedMotion) mount.current?.setSpeed(idleSpeed);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (mount.current && !reducedMotion) {
      mount.current.setSpeed(clickSpeed);
      setTimeout(() => {
        mount.current?.setSpeed(isHoveredRef.current ? hoverSpeed : idleSpeed);
      }, 300);
    }

    if (buttonRef.current && !reducedMotion) {
      const rect = buttonRef.current.getBoundingClientRect();
      const ripple = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        id: rippleId.current++,
      };

      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="perspective-origin-[50%_50%] perspective-[1000px]">
        <div className={`relative transform-3d ${shellSize}`}>
          <div
            className={`pointer-events-none absolute top-0 left-0 z-30 flex translate-z-5 items-center justify-center gap-1.5 transform-3d ${shellSize}`}
          >
            {isIcon ? (
              <Sparkles
                className={`size-4 text-[#666666] drop-shadow-[0px_1px_2px_rgba(0,0,0,0.5)] ${SETTLE}`}
              />
            ) : (
              <span
                className={`text-sm font-normal whitespace-nowrap text-[#666666] [text-shadow:0px_1px_2px_rgba(0,0,0,0.5)] ${SETTLE}`}
              >
                {label}
              </span>
            )}
          </div>

          <div
            className={`absolute top-0 left-0 z-20 translate-z-2.5 transform-3d ${shellSize} ${pressShift} ${SETTLE}`}
          >
            <div
              className={`m-0.5 rounded-full bg-[linear-gradient(180deg,#202020_0%,#000000_100%)] ${faceSize} ${SHADOW_SHIFT} ${isPressed ? FACE_PRESSED : "shadow-none"}`}
            />
          </div>

          <div
            className={`absolute top-0 left-0 z-10 translate-z-0 transform-3d ${shellSize} ${pressShift} ${SETTLE}`}
          >
            <div
              className={`rounded-full bg-transparent ${shellSize} ${SHADOW_SHIFT} ${
                isPressed
                  ? RIM_PRESSED
                  : isHovered
                    ? RIM_HOVERED
                    : RIM_RESTING
              }`}
            >
              <div
                ref={surfaceRef}
                className={`metallic-button-canvas relative overflow-hidden rounded-full ${shellSize}`}
              />
            </div>
          </div>

          <button
            ref={buttonRef}
            type="button"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            aria-label={label}
            className={`absolute top-0 left-0 z-40 translate-z-6.25 cursor-pointer overflow-hidden rounded-full border-none bg-transparent outline-none transform-3d ${shellSize}`}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="pointer-events-none absolute size-5 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_70%)] animate-[metallic-button-ripple_0.6s_ease-out]"
                style={{
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                }}
              />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MetallicButton;
