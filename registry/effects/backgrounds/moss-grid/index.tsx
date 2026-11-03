// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

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

// Scene layout

// A low, grazing camera over the hills, like the reference: the ground fills the lower half
const CAMERA_POSITION = new THREE.Vector3(0, 1.0, 6.4);
const CAMERA_TARGET = new THREE.Vector3(0, 0.62, 0);
// Ground extent, in world units; it runs well past the edges and into the dark behind, and its
// near edge sits behind the camera, so a hill or the pointer's swell rising in the foreground
// never lifts the bottom of the view clear of the ground
const GROUND_WIDTH = 22;
const GROUND_DEPTH = 19.5;
const GROUND_Z = -2;
// Moss: stacked shells above the ground, each a little higher and sparser, give it real depth
const SHELLS = 18;
const MOSS_DEPTH = 0.09;
// The grid of lights laid over the moss
const DOT_SPACING = 0.075;
const BACKGROUND = "#0d0d0d";
// The lights show only around the pointer, and along a short trail behind it that fades out
const TRAIL = 24;

// Shared GLSL

// 2D simplex noise (Ashima Arts / Stefan Gustavson, MIT) and the height of the mossy hills, which both
// the moss and the grid of lights laid over it follow
const TERRAIN = `
uniform float uTime;
uniform float uUndulate;
uniform vec3 uPointer;
uniform float uPointerRadius;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
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

// how much the pointer swells the ground here
float swell(vec2 xz) {
  vec2 d = xz - uPointer.xy;
  return uPointer.z * exp(-dot(d, d) / (uPointerRadius * uPointerRadius));
}

// gentle mossy mounds: a few broad swells with soft hummocks on top, drifting very slowly
float hills(vec2 xz) {
  float t = uTime * 0.02 * uUndulate;
  float h = snoise(xz * 0.24 + vec2(t, 0.0)) * 0.32;
  h += snoise(xz * 0.5 + vec2(4.1, -t * 0.6)) * 0.12;
  h += snoise(xz * 1.1 + 9.3) * 0.03;
  return h + swell(xz) * 0.3;
}

vec3 hillPoint(vec2 xz, out vec3 n) {
  float e = 0.03;
  float h = hills(xz);
  float hx = hills(xz + vec2(e, 0.0)) - h;
  float hz = hills(xz + vec2(0.0, e)) - h;
  n = normalize(vec3(-hx, e, -hz));
  return vec3(xz.x, h, xz.y);
}
`;

// fade into the dark with distance, like the haze in the reference
const HAZE = `
float hazeAmount(vec3 world) {
  float d = length(world - cameraPosition);
  return clamp(1.0 - exp(-pow(max(d - 4.5, 0.0) * 0.32, 1.3)), 0.0, 1.0);
}
vec3 haze(vec3 col, vec3 world, vec3 bg) {
  return mix(col, bg, hazeAmount(world));
}
`;

const LINEAR = `
vec3 linear(vec3 c) { return pow(max(c, 0.0), vec3(2.2)); }
`;

// Moss: each shell is the ground lifted a little further; strands are tiny cones, so each shell
// keeps a smaller dot of every strand and the stack reads as a dense, fuzzy pile
const MOSS_VS = `
attribute float aLayer;
varying vec2 vXZ;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vLayer;
${TERRAIN}
void main() {
  vec2 xz = position.xz;
  float layer = aLayer / ${(SHELLS - 1).toFixed(1)};
  vec3 n;
  vec3 world = hillPoint(xz, n) + n * layer * ${MOSS_DEPTH.toFixed(3)};
  vXZ = xz;
  vWorld = world;
  vNormal = n;
  vLayer = layer;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}`;

const MOSS_FS = `
uniform vec3 uBg;
uniform vec3 uMossDark;
uniform vec3 uMossLight;
uniform float uDotLight;
uniform float uTime;
uniform float uUndulate;
uniform vec3 uPointer;
uniform float uPointerRadius;
varying vec2 vXZ;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vLayer;
${HAZE}
${LINEAR}
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
void main() {
  // clumps: patches where the strands stand taller and lighter
  float clump = vnoise(vXZ * 7.0) * 0.6 + vnoise(vXZ * 19.0) * 0.4;
  vec2 q = vXZ * 210.0;
  vec2 cell = floor(q);
  vec2 f = fract(q) - 0.5;
  float rnd = hash(cell);
  float tall = 0.55 + 0.45 * clump * (0.6 + 0.4 * rnd);
  // each strand narrows toward its tip; the base layer is solid ground
  float radius = 0.55 * (1.0 - vLayer / tall);
  if (vLayer > 0.0 && length(f + (vec2(hash(cell + 3.1), hash(cell + 7.7)) - 0.5) * 0.3) > radius) discard;

  vec3 n = normalize(vNormal);
  // soft light from above and behind the hills, plus a little from the front
  float key = max(dot(n, normalize(vec3(-0.3, 0.85, -0.45))), 0.0);
  float fill = max(dot(n, normalize(vec3(0.4, 0.5, 0.8))), 0.0) * 0.35;
  float ao = mix(0.35, 1.0, pow(vLayer, 0.8));
  vec3 col = mix(uMossDark, uMossLight, vLayer * (0.55 + 0.45 * clump));
  col *= (0.55 + key * 0.8 + fill) * ao;
  // the lights above spill a faint cool glow onto the moss
  col += vec3(0.25, 0.35, 0.33) * uDotLight * 0.06 * vLayer;
  gl_FragColor = vec4(haze(linear(col), vWorld, linear(uBg)), 1.0);
}`;

// The lights: a regular grid laid over the moss, drawn as soft round points that shimmer and
// brighten in a ripple around the pointer
const DOT_VS = `
attribute float aSeed;
uniform float uDotSize;
uniform float uPixelRatio;
uniform float uRipple;
uniform vec3 uTrail[${TRAIL + 1}];
uniform float uAmbient;
uniform float uRevealRadius;
varying float vGlow;
varying vec3 vWorld;
${TERRAIN}
void main() {
  vec2 xz = position.xz;
  // the grid shows only where the pointer is, or has just been: a soft, flat-topped pool of light
  // around it, drawn out along the path behind it as one continuous ribbon that thins and fades
  float shown = 0.0;
  for (int i = 0; i < ${TRAIL}; i++) {
    vec3 a = uTrail[i];
    vec3 b = uTrail[i + 1];
    if (a.z <= 0.0 && b.z <= 0.0) continue;
    vec2 ab = b.xy - a.xy;
    float h = clamp(dot(xz - a.xy, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
    float gap = length(xz - a.xy - ab * h);
    if (gap > uRevealRadius * 2.0) continue;
    float s = mix(a.z, b.z, h);
    s = s * s * (3.0 - 2.0 * s);
    float r = uRevealRadius * (0.75 + 0.25 * s);
    shown = max(shown, s * exp(-pow(gap / r, 2.6)));
  }
  shown = max(shown, uAmbient);
  if (shown <= 0.001) {
    vGlow = 0.0;
    vWorld = vec3(0.0);
    gl_PointSize = 0.0;
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  // laid over the moss: just above the tips of the strands, following every rise and dip
  vec3 n;
  vec3 world = hillPoint(xz, n) + n * ${(MOSS_DEPTH * 1.15).toFixed(3)};
  vec4 view = viewMatrix * vec4(world, 1.0);
  vWorld = world;
  float shimmer = 0.75 + 0.25 * sin(uTime * (1.5 + aSeed * 2.0) + aSeed * 40.0);
  float dist = length(xz - uPointer.xy);
  float ring = uRipple * uPointer.z * (0.5 + 0.5 * sin(dist * 9.0 - uTime * 5.0)) * exp(-dist * 0.9);
  vGlow = (shimmer + ring * 1.6 + swell(xz) * 0.8) * shown;
  // near the lens the lights stay small points instead of swelling into stripes
  gl_PointSize = min(uDotSize * (9.0 / -view.z), uDotSize * 2.2) * uPixelRatio * (1.0 + ring * 0.6);
  gl_Position = projectionMatrix * view;
}`;

const DOT_FS = `
uniform vec3 uDotColor;
uniform float uDotLight;
uniform vec3 uBg;
varying float vGlow;
varying vec3 vWorld;
${HAZE}
${LINEAR}
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float core = smoothstep(0.5, 0.1, r);
  if (vGlow <= 0.001) discard;
  vec3 col = linear(uDotColor) * (0.55 + vGlow * 0.95) * uDotLight * core;
  // the lights are added on top of the scene, so they fade out with distance rather than toward
  // the background colour, which would add a grey veil
  // far off the grid gets denser than the dots are wide and would merge into a sheen, so the
  // lights are gone before they get that far
  float far = 1.0 - smoothstep(7.0, 10.5, length(vWorld - cameraPosition));
  float keep = 1.0 - hazeAmount(vWorld);
  gl_FragColor = vec4(col * keep * keep * far, 1.0);
}`;

// Scene

interface Settings {
  autoplay: boolean;
  idleDelay: number;
  ambient: number;
  revealRadius: number;
  trail: number;
  speed: number;
  undulate: number;
  dotSize: number;
  dotLight: number;
  interactive: boolean;
  cursorStrength: number;
  cursorRadius: number;
  reducedMotion: boolean;
}

// Colours go to the shaders as picked (sRGB); the shaders convert them to linear light themselves
const srgb = new THREE.Color();
const parsed = new THREE.Color();
function hexToSrgb(hex: string, out: THREE.Vector3) {
  parsed.set(hex).getRGB(srgb, THREE.SRGBColorSpace);
  return out.set(srgb.r, srgb.g, srgb.b);
}

function Ground({ settings, mossColor, mossLight, dotColor }: { settings: Settings; mossColor: string; mossLight: string; dotColor: string }) {
  const { camera, gl, invalidate } = useThree();
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
    invalidate();
  });

  // the moss and the lights share one set of uniforms, so the heights always agree
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uUndulate: { value: 1 },
      uPointer: { value: new THREE.Vector3(0, 0, 0) },
      uPointerRadius: { value: 1.2 },
      uBg: { value: new THREE.Vector3() },
      uMossDark: { value: new THREE.Vector3() },
      uMossLight: { value: new THREE.Vector3() },
      uDotColor: { value: new THREE.Vector3() },
      uDotLight: { value: 1 },
      uDotSize: { value: 2.4 },
      uPixelRatio: { value: 1 },
      uRipple: { value: 1 },
      uTrail: { value: new Float32Array((TRAIL + 1) * 3) },
      uAmbient: { value: 0 },
      uRevealRadius: { value: 0.6 },
    }),
    [],
  );
  // the frame loop writes to the same uniforms object through a ref, which React treats as mutable
  const uniformsRef = useRef(uniforms);

  const mossMaterial = useMemo(() => new THREE.ShaderMaterial({ vertexShader: MOSS_VS, fragmentShader: MOSS_FS, uniforms }), [uniforms]);
  const dotMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: DOT_VS,
        fragmentShader: DOT_FS,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms],
  );

  const ground = useMemo(() => {
    const g = new THREE.PlaneGeometry(GROUND_WIDTH, GROUND_DEPTH, 180, 160);
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0, GROUND_Z);
    const layers = new Float32Array(SHELLS);
    for (let i = 0; i < SHELLS; i++) layers[i] = i;
    g.setAttribute("aLayer", new THREE.InstancedBufferAttribute(layers, 1));
    return g;
  }, []);

  const dots = useMemo(() => {
    const cols = Math.round(GROUND_WIDTH / DOT_SPACING);
    const rows = Math.round(GROUND_DEPTH / DOT_SPACING);
    const pos = new Float32Array(cols * rows * 3);
    const seed = new Float32Array(cols * rows);
    let k = 0;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        pos[k * 3] = -GROUND_WIDTH / 2 + i * DOT_SPACING;
        pos[k * 3 + 2] = GROUND_Z - GROUND_DEPTH / 2 + j * DOT_SPACING;
        seed[k] = ((i * 92821 + j * 68917) % 1000) / 1000;
        k++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, []);

  useEffect(
    () => () => {
      ground.dispose();
      dots.dispose();
      mossMaterial.dispose();
      dotMaterial.dispose();
    },
    [ground, dots, mossMaterial, dotMaterial],
  );

  // pointer on the ground plane, and how hard it is pressing (eases in and out)
  // `presence` fades the reveal in and out; the trail is a ring of recent pointer spots, each fading
  const simRef = useRef({
    clock: 0,
    target: new THREE.Vector2(),
    follow: new THREE.Vector2(),
    at: new THREE.Vector2(),
    pull: 0,
    presence: 0,
    inside: false,
    trail: new Float32Array(TRAIL * 3),
    path: new Float32Array((TRAIL + 1) * 3),
    trailNext: 0,
    sinceDrop: 0,
    lastDrop: new THREE.Vector2(1e9, 1e9),
    // seconds since the pointer last moved over the ground; starts high so the autopilot runs first
    idle: 1e3,
    // how much the autopilot is steering (0 = the pointer, 1 = the autopilot), and its own clock
    auto: 1,
    autoClock: 0,
    goal: new THREE.Vector2(),
    wander: new THREE.Vector2(),
  });
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.1), []);

  useEffect(() => {
    const el = document.documentElement;
    const onMove = (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const sim = simRef.current;
      sim.inside = x >= -1 && x <= 1 && y >= -1 && y <= 1;
      if (!sim.inside) return;
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const hit = raycaster.ray.intersectPlane(plane, new THREE.Vector3());
      // above the horizon the ray misses the ground; leave the pointer where it last touched
      if (hit) {
        sim.target.set(hit.x, hit.z);
        sim.idle = 0;
      } else sim.inside = false;
    };
    const onLeave = () => {
      simRef.current.inside = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [camera, gl, raycaster, plane]);

  useFrame((_, delta) => {
    const u = uniformsRef.current;
    const cfg = settingsRef.current;
    const sim = simRef.current;
    const dt = Math.min(delta, 0.1);
    if (!cfg.reducedMotion) {
      sim.clock += dt * cfg.speed;

      // autopilot: when the pointer is away or has rested a while, a virtual pointer wanders a slow,
      // never-repeating loop across the moss; moving the pointer again hands control straight back
      sim.idle += dt;
      const pointerHere = cfg.interactive && sim.inside;
      const steering = pointerHere && sim.idle < cfg.idleDelay;
      const autoWant = cfg.autoplay && !steering ? 1 : 0;
      // the hand-back is quick, the take-over gentle; both ease in and out
      const handoff = dt / (autoWant ? 1.5 : 0.6);
      sim.auto = autoWant ? Math.min(sim.auto + handoff, 1) : Math.max(sim.auto - handoff, 0);
      const blend = sim.auto * sim.auto * (3 - 2 * sim.auto);
      sim.autoClock += dt * cfg.speed;
      const t = sim.autoClock;
      sim.wander.set(
        Math.sin(t * 0.21) * 3 + Math.sin(t * 0.53 + 1.3) * 1.1,
        1.6 + Math.sin(t * 0.31 + 0.7) * 1.2 + Math.sin(t * 0.67) * 0.4,
      );
      sim.goal.copy(sim.target).lerp(sim.wander, blend);

      // the swell drifts after the pointer through two easing stages, so it starts and stops softly,
      // and grows or fades over about half a second
      sim.follow.lerp(sim.goal, 1 - Math.exp(-dt * 12));
      sim.at.lerp(sim.follow, 1 - Math.exp(-dt * 10));
      const want = (pointerHere ? cfg.cursorStrength : 0) * (1 - blend) + cfg.cursorStrength * 0.6 * blend;
      sim.pull += (want - sim.pull) * (1 - Math.exp(-dt * 3));
      const here = Math.min((pointerHere ? 1 - blend : 0) + blend, 1);
      sim.presence += (here - sim.presence) * (1 - Math.exp(-dt * 6));

      // drop a point on the trail every so often while the pointer moves; the ring holds the whole
      // trail length, so the tail fades out instead of being cut off
      const life = Math.max(cfg.trail, 0.05);
      const fade = dt / life;
      for (let i = 0; i < TRAIL; i++) sim.trail[i * 3 + 2] = Math.max(sim.trail[i * 3 + 2] - fade, 0);
      sim.sinceDrop += dt;
      if (sim.presence > 0.02 && sim.sinceDrop >= Math.max(life / (TRAIL - 1), 0.02) && sim.at.distanceTo(sim.lastDrop) > 0.02) {
        sim.trail.set([sim.at.x, sim.at.y, sim.presence], sim.trailNext * 3);
        sim.trailNext = (sim.trailNext + 1) % TRAIL;
        sim.sinceDrop = 0;
        sim.lastDrop.copy(sim.at);
      }
    } else {
      sim.pull = 0;
      sim.presence = 0;
    }
    u.uTime.value = sim.clock;
    u.uUndulate.value = cfg.undulate;
    u.uPointer.value.set(sim.at.x, sim.at.y, sim.pull);
    u.uPointerRadius.value = cfg.cursorRadius;
    hexToSrgb(BACKGROUND, u.uBg.value);
    hexToSrgb(mossColor, u.uMossDark.value);
    hexToSrgb(mossLight, u.uMossLight.value);
    hexToSrgb(dotColor, u.uDotColor.value);
    u.uDotLight.value = cfg.dotLight;
    u.uDotSize.value = cfg.dotSize;
    u.uRevealRadius.value = cfg.revealRadius;
    const path = sim.path;
    path[0] = sim.at.x;
    path[1] = sim.at.y;
    path[2] = sim.presence;
    let live = sim.presence > 0;
    for (let k = 1; k <= TRAIL; k++) {
      const src = ((sim.trailNext - k + TRAIL) % TRAIL) * 3;
      const dst = k * 3;
      live = live && sim.trail[src + 2] > 0;
      path[dst] = live ? sim.trail[src] : path[dst - 3];
      path[dst + 1] = live ? sim.trail[src + 1] : path[dst - 2];
      path[dst + 2] = live ? sim.trail[src + 2] : 0;
    }
    u.uTrail.value = path;
    // with reduced motion there's no pointer reveal, so the whole grid shows, still
    u.uAmbient.value = cfg.reducedMotion ? 1 : cfg.ambient;
    u.uPixelRatio.value = gl.getPixelRatio();
  });

  return (
    <>
      {/* heights are computed on the GPU, so the bounds the CPU knows are wrong; skip culling */}
      <instancedMesh args={[ground, mossMaterial, SHELLS]} frustumCulled={false} />
      {/* the lights always draw over the moss: they lie on top of it, and these gentle hills seen
          from this low camera barely hide one another */}
      <points geometry={dots} material={dotMaterial} frustumCulled={false} />
    </>
  );
}

function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.copy(CAMERA_POSITION);
    camera.lookAt(CAMERA_TARGET);
  }, [camera]);
  return null;
}

// Component

export interface MossGridProps {
  /** Moss in the hollows and at the base of the strands. */
  mossColor?: string;
  /** Moss at the tips of the strands and on the crests. */
  mossHighlight?: string;
  /** Colour of the lights. */
  dotColor?: string;
  /** How fast everything moves. 0 holds it still. */
  speed?: number;
  /** How much the hills drift. 0 keeps the ground fixed. */
  undulate?: number;
  /** Wander a light across the moss on its own when the pointer is away or still. */
  autoplay?: boolean;
  /** Seconds the pointer can rest before the light wanders off on its own. */
  idleDelay?: number;
  /** How visible the grid is away from the pointer. 0 hides it, so it shows only where the pointer is. */
  ambient?: number;
  /** Size of the pool of light around the pointer, in world units. */
  revealRadius?: number;
  /** How long the trail of light behind the pointer lingers, in seconds. */
  trail?: number;
  /** Size of each light, in px at the focus distance. */
  dotSize?: number;
  /** Brightness of the lights. */
  dotGlow?: number;
  /** Light up the grid where the pointer moves, swell the ground under it and ripple the lights. */
  interactive?: boolean;
  /** How strongly the pointer swells the ground. */
  cursorStrength?: number;
  /** Reach of the pointer, in world units. */
  cursorRadius?: number;
  /** How blurred the far hills are. 0 keeps everything sharp. */
  depthOfField?: number;
  /** Film grain strength. 0 turns it off. */
  grain?: number;
  /** Content laid over the background. */
  children?: ReactNode;
  className?: string;
}

export default function MossGrid({
  mossColor = "#22331a",
  mossHighlight = "#628c58",
  dotColor = "#c3e4e0",
  speed = 1,
  undulate = 1,
  autoplay = true,
  idleDelay = 1.5,
  ambient = 0,
  revealRadius = 0.6,
  trail = 1.2,
  dotSize = 1.5,
  dotGlow = 1,
  interactive = true,
  cursorStrength = 1,
  cursorRadius = 1.2,
  depthOfField = 1,
  grain = 0.09,
  children,
  className = "",
}: MossGridProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(true);

  // pause when the ground is offscreen or the tab is hidden
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let onscreen = true;
    const sync = () => setActive(onscreen && !document.hidden);
    const io = new IntersectionObserver(
      (entries) => {
        onscreen = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: "128px" },
    );
    io.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const settings: Settings = {
    autoplay,
    idleDelay,
    ambient,
    revealRadius,
    trail,
    speed,
    undulate,
    dotSize,
    dotLight: dotGlow,
    interactive,
    cursorStrength,
    cursorRadius,
    reducedMotion,
  };

  return (
    <div ref={rootRef} className={`relative h-full w-full overflow-hidden ${className}`.trim()} style={{ backgroundColor: BACKGROUND }}>
      <Canvas
        aria-hidden="true"
        style={{ position: "absolute", inset: 0 }}
        dpr={[1, 1.25]}
        frameloop={reducedMotion ? "demand" : active ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 38, near: 0.1, far: 40, position: CAMERA_POSITION.toArray() }}
      >
        <color attach="background" args={[BACKGROUND]} />
        <CameraRig />
        <Ground settings={settings} mossColor={mossColor} mossLight={mossHighlight} dotColor={dotColor} />
        <EffectComposer multisampling={0}>
          <DepthOfField worldFocusDistance={6} worldFocusRange={5} bokehScale={2.2 * depthOfField} />
          <Bloom intensity={0.6} luminanceThreshold={0.7} luminanceSmoothing={0.25} mipmapBlur radius={0.5} />
          <Noise opacity={grain} blendFunction={BlendFunction.SOFT_LIGHT} />
          <Vignette offset={0.35} darkness={0.35} />
        </EffectComposer>
      </Canvas>
      {children ? <div className="relative z-10 h-full w-full">{children}</div> : null}
    </div>
  );
}
