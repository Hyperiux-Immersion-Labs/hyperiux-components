// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { useEffect, useRef } from "react";

const DEFAULT_ROOT_MARGIN = "256px";

type RafRoot = Element | null | { current: Element | null } | (() => Element | null);

function resolveElement(root: RafRoot): Element | null {
  if (!root) return null;
  if (typeof root === "function") return root() ?? null;
  if (typeof root === "object" && "current" in root) return root.current ?? null;
  return root;
}

interface VisibilityGateOptions {
  root?: RafRoot;
  rootMargin?: string;
  threshold?: number;
  observeTab?: boolean;
  observeOffscreen?: boolean;
  onChange?: (active: boolean) => void;
}

interface VisibilityGate {
  readonly isActive: boolean;
  observe: (nextRoot?: RafRoot) => void;
  destroy: () => void;
}

function createVisibilityGate({
  root = null,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = 0,
  observeTab = true,
  observeOffscreen = true,
  onChange,
}: VisibilityGateOptions = {}): VisibilityGate {
  let tabVisible =
    typeof document === "undefined" ? true : !document.hidden;
  // Match border-beam: assume onscreen until the observer reports otherwise.
  let onscreen = true;
  let destroyed = false;
  let observer: IntersectionObserver | null = null;

  const isActive = () => {
    if (destroyed) return false;
    if (observeTab && !tabVisible) return false;
    if (observeOffscreen && resolveElement(root) && !onscreen) return false;
    return true;
  };

  let lastActive = isActive();

  const emit = () => {
    if (destroyed) return;
    const next = isActive();
    if (next === lastActive) return;
    lastActive = next;
    onChange?.(next);
  };

  const onVisibilityChange = () => {
    tabVisible = !document.hidden;
    emit();
  };

  if (observeTab && typeof document !== "undefined") {
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  const bindObserver = () => {
    if (!observeOffscreen || typeof IntersectionObserver === "undefined") {
      return;
    }

    const el = resolveElement(root);
    if (!el) return;

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onscreen = entry.isIntersecting;
        }
        emit();
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
  };

  bindObserver();

  return {
    /** Whether the animation should currently run. */
    get isActive() {
      return isActive();
    },

    /**
     * Re-bind IntersectionObserver after the root element mounts late
     * (e.g. ref not ready on first call). Safe to call multiple times.
     */
    observe(nextRoot?: RafRoot) {
      if (destroyed) return;
      if (nextRoot != null) root = nextRoot;
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      onscreen = true;
      bindObserver();
      emit();
    },

    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (observeTab && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    },
  };
}

interface SuspendedRafOptions {
  onFrame: (time: number) => void;
  root?: RafRoot;
  rootMargin?: string;
  threshold?: number;
  observeTab?: boolean;
  observeOffscreen?: boolean;
}

interface SuspendedRaf {
  start: () => void;
  stop: () => void;
  readonly isRunning: boolean;
  readonly isActive: boolean;
  observe: (nextRoot?: RafRoot) => void;
  destroy: () => void;
}

/**
 * Owns a requestAnimationFrame loop that auto-pauses when the tab is hidden
 * or the root element is offscreen.
 */
function createSuspendedRaf({
  onFrame,
  root = null,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = 0,
  observeTab = true,
  observeOffscreen = true,
}: SuspendedRafOptions): SuspendedRaf {
  if (typeof onFrame !== "function") {
    throw new TypeError("createSuspendedRaf: onFrame is required");
  }

  let rafId: number | null = null;
  let running = false;
  let destroyed = false;

  const stopRaf = () => {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const tick = (time: number) => {
    rafId = null;
    if (destroyed || !running || !gate.isActive) return;
    onFrame(time);
    if (!destroyed && running && gate.isActive) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const sync = () => {
    if (destroyed) return;
    if (running && gate.isActive) {
      if (rafId == null) {
        rafId = requestAnimationFrame(tick);
      }
    } else {
      stopRaf();
    }
  };

  const gate = createVisibilityGate({
    root,
    rootMargin,
    threshold,
    observeTab,
    observeOffscreen,
    onChange: sync,
  });

  return {
    /** Start (or resume) the loop when visibility allows. */
    start() {
      if (destroyed) return;
      running = true;
      sync();
    },

    /** Stop requesting frames (visibility listeners stay attached until destroy). */
    stop() {
      running = false;
      stopRaf();
    },

    /** Whether the caller has started the loop (may still be paused by visibility). */
    get isRunning() {
      return running;
    },

    /** Whether a frame is currently allowed to schedule. */
    get isActive() {
      return gate.isActive;
    },

    /** Re-attach offscreen observer to a (new) root element. */
    observe(nextRoot?: RafRoot) {
      gate.observe(nextRoot);
      sync();
    },

    /** Tear down listeners and cancel any pending frame. */
    destroy() {
      if (destroyed) return;
      destroyed = true;
      running = false;
      stopRaf();
      gate.destroy();
    },
  };
}

export {
  createSuspendedRaf,
  createVisibilityGate,
  DEFAULT_ROOT_MARGIN,
};


// React hook form, for JSX output that depends on the preference (not just
// the imperative reduceMotion flag already used inside the draw loop below).
// Safe to call during render - returns false on the server.
const DEFAULT_SPACING = 24;
const DEFAULT_BASE_RADIUS = 7.2;
const DEFAULT_MOUSE_RADIUS = 380;
const DEFAULT_TRAIL_LENGTH = 456;
const DEFAULT_TRAIL_RADIUS = 230;
const DEFAULT_TRAIL_FADE_MS = 1200;

const RANDOM_TIME = 0.6;
const COLLECT_TIME = 1.1;
const SHAPE_HOLD_TIME = 1.2;
const GRAY_DISPERSE_TIME = 0.9; // trail lingers ~2s

const TOTAL_CYCLE_TIME = RANDOM_TIME + COLLECT_TIME + SHAPE_HOLD_TIME + GRAY_DISPERSE_TIME;
const TOTAL_SHAPES = 5;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const smoothstep = (e0: number, e1: number, v: number): number => {
  const t = clamp01((v - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

const getStarStrength = (x: number, y: number, time: number, width: number, height: number): number => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.28;

  const nx = (x - cx) / scale;
  const ny = (y - cy) / scale;

  const r = Math.sqrt(nx * nx + ny * ny);
  const angle = Math.atan2(ny, nx);

  const spikes = 5;
  const star = Math.cos(spikes * angle);
  const radius = 0.55 + 0.25 * star;

  return clamp01(1 - smoothstep(radius - 0.05, radius + 0.05, r));
};

const getSquareStrength = (x: number, y: number, width: number, height: number): number => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.26;

  const rx = (x - cx) / scale;
  const ry = (y - cy) / scale;
  const d  = Math.max(Math.abs(rx), Math.abs(ry));

  return clamp01(1 - smoothstep(0.78, 0.82, d));
};

const getCircleRingStrength = (x: number, y: number, width: number, height: number): number => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.28;

  const r = Math.sqrt(((x - cx) / scale) ** 2 + ((y - cy) / scale) ** 2);

  return clamp01(1 - smoothstep(0.13, 0.17, Math.abs(r - 0.72)));
};

const getPlusStrength = (x: number, y: number, width: number, height: number): number => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.27;

  const rx = (x - cx) / scale;
  const ry = (y - cy) / scale;

  const thickness = 0.18;
  const length    = 0.75;

  const vertical   = Math.abs(rx) < thickness && Math.abs(ry) < length;
  const horizontal = Math.abs(ry) < thickness && Math.abs(rx) < length;

  const d = Math.min(
    Math.max(Math.abs(rx) - thickness, Math.abs(ry) - length),
    Math.max(Math.abs(ry) - thickness, Math.abs(rx) - length)
  );

  return vertical || horizontal ? 1 : clamp01(1 - smoothstep(0, 0.06, d));
};

const getTriangleStrength = (x: number, y: number, time: number, width: number, height: number): number => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.32;
  const rotation = Math.sin(time * 0.3) * 0.12;

  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  const rx = ((x - cx) * cos - (y - cy) * sin) / scale;
  const ry = ((x - cx) * sin + (y - cy) * cos) / scale;

  const a = Math.abs(rx) * 0.9 + ry * 0.52;
  const b = -ry * 0.95;

  return clamp01(1 - smoothstep(0.38, 0.48, Math.max(a, b)));
};

const getRawShapeStrength = (shapeIndex: number, x: number, y: number, time: number, width: number, height: number): number => {
  const i = shapeIndex % TOTAL_SHAPES;
  if (i === 0) return getStarStrength(x, y, time, width, height);
  if (i === 1) return getSquareStrength(x, y, width, height);
  if (i === 2) return getCircleRingStrength(x, y, width, height);
  if (i === 3) return getPlusStrength(x, y, width, height);
  return getTriangleStrength(x, y, time, width, height);
};

interface Dot {
  x: number;
  y: number;
  phase: number;
  speed: number;
  randomOffset: number;
  currentShapeStrength: number;
  currentRandomStrength: number;
  currentMouseStrength: number;
  currentTrailStrength: number;
  currentGrayDisperseStrength: number;
}

interface DottedGridProps {
  spacing?: number;
  baseRadius?: number;
  mouseRadius?: number;
  trailLength?: number;
  trailRadius?: number;
  trailFadeMs?: number;
  backgroundColor?: string;
  showDesktopHint?: boolean;
  desktopHint?: string;
  mobileHint?: string;
  className?: string;
}

export default function DottedGrid({
  spacing = DEFAULT_SPACING,
  baseRadius = DEFAULT_BASE_RADIUS,
  mouseRadius = DEFAULT_MOUSE_RADIUS,
  trailLength = DEFAULT_TRAIL_LENGTH,
  trailRadius = DEFAULT_TRAIL_RADIUS,
  trailFadeMs = DEFAULT_TRAIL_FADE_MS,
  backgroundColor = "#000000",
  showDesktopHint = true,
  desktopHint = "Click anywhere to change the pattern.",
  mobileHint = "Works best on desktop",
  className = "",
}: DottedGridProps) {
  const canvasRef  = useRef<HTMLCanvasElement | null>(null);
  const patternRef = useRef<{ currentShapeIndex: number; transitionStartTime: number | null }>({
    currentShapeIndex: 0,
    transitionStartTime: null,
  });
  const mouseRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    active: boolean;
    trail: { x: number; y: number; t: number }[];
  }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
    trail: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots: Dot[] = [];
    let reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const reduceMotionMq = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    const handleReduceMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      if (reduceMotion) {
        mouseRef.current.active = false;
        mouseRef.current.trail = [];
        patternRef.current.transitionStartTime = null;
      }
    };

    const createDots = () => {
      dots = [];
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          dots.push({
            x,
            y,
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 1.0,
            randomOffset: Math.random() * 10,
            currentShapeStrength: 0,
            currentRandomStrength: 1,
            currentMouseStrength: 0,
            currentTrailStrength: 0,
            currentGrayDisperseStrength: 0,
          });
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width  = rect.width;
      height = rect.height;
      dpr    = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createDots();
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      mouseRef.current.active  = true;
      mouseRef.current.trail.push({ x, y, t: performance.now() });

      if (mouseRef.current.trail.length > trailLength) {
        mouseRef.current.trail.shift();
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = () => {
      patternRef.current.currentShapeIndex = (patternRef.current.currentShapeIndex + 1) % TOTAL_SHAPES;
      patternRef.current.transitionStartTime = reduceMotion ? null : performance.now() * 0.001;
    };

    const getShapeData = (x: number, y: number, time: number) => {
      const { currentShapeIndex, transitionStartTime } = patternRef.current;

      if (transitionStartTime === null) {
        return {
          shapeStrength: getRawShapeStrength(currentShapeIndex, x, y, time, width, height),
          randomStrength: 0,
          grayDisperseStrength: 0,
        };
      }

      const cyclePosition = time - transitionStartTime;

      if (cyclePosition >= TOTAL_CYCLE_TIME) {
        patternRef.current.transitionStartTime = null;
        return {
          shapeStrength: getRawShapeStrength(currentShapeIndex, x, y, time, width, height),
          randomStrength: 0,
          grayDisperseStrength: 0,
        };
      }

      const shapeIndex = currentShapeIndex;
      const shapeStrength = getRawShapeStrength(shapeIndex, x, y, time, width, height);

      if (cyclePosition < RANDOM_TIME) {
        return { shapeStrength: 0, randomStrength: 1, grayDisperseStrength: 0.35 };
      }

      if (cyclePosition < RANDOM_TIME + COLLECT_TIME) {
        const eased = smoothstep(0, 1, (cyclePosition - RANDOM_TIME) / COLLECT_TIME);
        return {
          shapeStrength: shapeStrength * eased,
          randomStrength: 1 - eased,
          grayDisperseStrength: 0.35 * (1 - eased),
        };
      }

      if (cyclePosition < RANDOM_TIME + COLLECT_TIME + SHAPE_HOLD_TIME) {
        return { shapeStrength, randomStrength: 0, grayDisperseStrength: 0 };
      }

      const eased = smoothstep(0, 1, (cyclePosition - RANDOM_TIME - COLLECT_TIME - SHAPE_HOLD_TIME) / GRAY_DISPERSE_TIME);
      return {
        shapeStrength: shapeStrength * (1 - eased),
        randomStrength: eased,
        grayDisperseStrength: eased,
      };
    };

    const drawDot = (x: number, y: number, radius: number, brightness: number, grayDisperseStrength: number, trailStrength: number, mouseStrength: number) => {
      const mouseFade = mouseStrength * mouseStrength * 0.72;
      const trailFade = trailStrength * 0.38;
      const alpha = clamp01((0.28 + brightness * 0.72) - mouseFade - trailFade);

      const normalL   = 16 + brightness * 78;
      const disperseL = 12 + brightness * 58 + grayDisperseStrength * 22;
      const lightness = lerp(normalL, disperseL, grayDisperseStrength);

      const mouseLift = mouseStrength * (1 - mouseStrength) * 18;
      const mouseDark = mouseStrength * mouseStrength * 38;
      const trailLift = trailStrength * 38 * (1 - trailStrength * 0.55);

      const finalLightness = clamp01((lightness - mouseDark + mouseLift + trailLift) / 100) * 100;
      const saturation     = trailStrength * trailStrength * 16;

      ctx.beginPath();
      ctx.fillStyle = `hsla(210, ${saturation}%, ${finalLightness}%, ${alpha})`;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = createSuspendedRaf({
      root: canvas,
      onFrame: (ms) => {
        const time = ms * 0.001;
        const mouse = mouseRef.current;
        const now = performance.now();

        // Lagging cursor effect
        mouse.x = lerp(mouse.x, mouse.targetX, 0.12);
        mouse.y = lerp(mouse.y, mouse.targetY, 0.12);

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        for (const dot of dots) {
          if (reduceMotion) {
            const shapeStrength = getRawShapeStrength(
              patternRef.current.currentShapeIndex,
              dot.x,
              dot.y,
              0,
              width,
              height
            );
            const brightness = clamp01(0.16 + shapeStrength * 0.84);
            const radius = baseRadius + shapeStrength * 1.25;
            drawDot(dot.x, dot.y, radius, brightness, 0, 0, 0);
            continue;
          }

          const { shapeStrength, randomStrength, grayDisperseStrength } = getShapeData(dot.x, dot.y, time);

          dot.currentShapeStrength = lerp(dot.currentShapeStrength, shapeStrength, 0.12);
          dot.currentRandomStrength = lerp(dot.currentRandomStrength, randomStrength, 0.14);
          dot.currentGrayDisperseStrength = lerp(dot.currentGrayDisperseStrength, grayDisperseStrength, 0.14);

          // Cursor head influence
          let targetMouseStrength = 0;
          if (mouse.active) {
            const dx = dot.x - mouse.x;
            const dy = dot.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouseRadius) {
              const norm = dist / mouseRadius;
              targetMouseStrength = (1 - norm) * (1 - norm) * (1 - norm);
            }
          }
          dot.currentMouseStrength = lerp(dot.currentMouseStrength, targetMouseStrength, 0.12);

          // Trail influence
          let targetTrailStrength = 0;
          for (let i = 0; i < mouse.trail.length; i++) {
            const pt = mouse.trail[i];
            const age = (now - pt.t) / trailFadeMs;
            if (age >= 1) continue;

            const ageFade = (1 - age) * (1 - age) * (1 - age);
            const positionFade = (i + 1) / mouse.trail.length;
            const fade = ageFade * positionFade;

            const dx = dot.x - pt.x;
            const dy = dot.y - pt.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < trailRadius) {
              const proximity = 1 - smoothstep(0, 1, dist / trailRadius);
              const softProximity = proximity * proximity * proximity;
              targetTrailStrength = Math.max(targetTrailStrength, softProximity * fade);
            }
          }
          dot.currentTrailStrength = lerp(dot.currentTrailStrength, targetTrailStrength, 0.08);

          const randomBlink = Math.sin(
            time * (1.2 + dot.speed * 1.2) + dot.phase + dot.randomOffset + dot.x * 0.02 + dot.y * 0.016
          ) ** 2;

          const softPulse = Math.sin(time * 1.4 + dot.phase + dot.x * 0.015) ** 2;

          const stableBrightness = clamp01(0.16 + dot.currentShapeStrength * 0.84 + softPulse * 0.02);
          const randomBrightness = clamp01(0.16 + randomBlink * 0.18);
          const brightness = lerp(stableBrightness, randomBrightness, dot.currentRandomStrength);

          const grayDisperseBlink = clamp01(dot.currentGrayDisperseStrength * (0.45 + randomBlink * 0.55));

          // Scale modification based on mouse proximity and trail history
          const mouseShrink = 1 - dot.currentMouseStrength * 0.75;
          const trailShrink = 1 - dot.currentTrailStrength * 0.65;

          const stableRadius = baseRadius + dot.currentShapeStrength * 1.25;
          const randomRadius = baseRadius + randomBlink * 0.35;
          const radius = lerp(stableRadius, randomRadius, dot.currentRandomStrength) * mouseShrink * trailShrink;

          drawDot(dot.x, dot.y, radius, brightness, grayDisperseBlink, dot.currentTrailStrength, dot.currentMouseStrength);
        }
      },
    });

    resize();
    window.addEventListener("resize", resize);
    reduceMotionMq?.addEventListener?.("change", handleReduceMotionChange);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("click", handleClick);
    loop.start();

    return () => {
      window.removeEventListener("resize", resize);
      reduceMotionMq?.removeEventListener?.("change", handleReduceMotionChange);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("click", handleClick);
      loop.destroy();
    };
  }, [baseRadius, backgroundColor, mouseRadius, spacing, trailFadeMs, trailLength, trailRadius]);

  return (
    <section className={`relative h-screen w-full overflow-hidden bg-black ${className}`}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full cursor-pointer touch-none bg-black"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/4 via-transparent to-black/40" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.95)]" />
      {showDesktopHint ? (
        <div className="max-[1025px]:hidden fixed bottom-15 left-1/2 -translate-x-1/2 z-50 p-4 rounded-2xl bg-white/10 backdrop-blur-md text-white text-center text-md pointer-events-none">
          {desktopHint}
        </div>
      ) : null}
      <div className="hidden max-[1025px]:flex fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-center text-sm leading-tight pointer-events-none">
        {mobileHint} <br />
        Here, tap & drag to explore
      </div>

    </section>
  );
}
