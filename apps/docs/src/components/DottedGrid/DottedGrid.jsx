"use client";

import { useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPACING = 24;
const BASE_RADIUS = 7.2;
const MOUSE_RADIUS = 380; // wider head influence
const TRAIL_LENGTH = 456; // even more history
const TRAIL_RADIUS = 230; // wider trail reach
const TRAIL_FADE_MS = 1200;

const RANDOM_TIME = 0.6;
const COLLECT_TIME = 1.1;
const SHAPE_HOLD_TIME = 1.2;
const GRAY_DISPERSE_TIME = 0.9; // trail lingers ~2s

const TOTAL_CYCLE_TIME = RANDOM_TIME + COLLECT_TIME + SHAPE_HOLD_TIME + GRAY_DISPERSE_TIME;
const TOTAL_SHAPES = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const lerp     = (a, b, t) => a + (b - a) * t;
const clamp01  = (v) => Math.max(0, Math.min(1, v));
const smoothstep = (e0, e1, v) => {
  const t = clamp01((v - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

// ─── Pure Shape Math ──────────────────────────────────────────────────────────

const getStarStrength = (x, y, time, width, height) => {
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

const getSquareStrength = (x, y, width, height) => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.26;

  const rx = (x - cx) / scale;
  const ry = (y - cy) / scale;
  const d  = Math.max(Math.abs(rx), Math.abs(ry));

  return clamp01(1 - smoothstep(0.78, 0.82, d));
};

const getCircleRingStrength = (x, y, width, height) => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.28;

  const r = Math.sqrt(((x - cx) / scale) ** 2 + ((y - cy) / scale) ** 2);

  return clamp01(1 - smoothstep(0.13, 0.17, Math.abs(r - 0.72)));
};

const getPlusStrength = (x, y, width, height) => {
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

const getTriangleStrength = (x, y, time, width, height) => {
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

const getRawShapeStrength = (shapeIndex, x, y, time, width, height) => {
  const i = shapeIndex % TOTAL_SHAPES;
  if (i === 0) return getStarStrength(x, y, time, width, height);
  if (i === 1) return getSquareStrength(x, y, width, height);
  if (i === 2) return getCircleRingStrength(x, y, width, height);
  if (i === 3) return getPlusStrength(x, y, width, height);
  return getTriangleStrength(x, y, time, width, height);
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DottedGrid() {
  const canvasRef  = useRef(null);
  const patternRef = useRef({
    currentShapeIndex: 0,
    transitionStartTime: null,
  });
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
    trail: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d", { alpha: false });

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let animationId;
    let dots = [];

    // ─── Dot Setup ─────────────────────────────────────────────────────────────

    const createDots = () => {
      dots = [];
      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
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
      dpr    = window.devicePixelRatio || 1;
      canvas.width  = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createDots();
    };

    // ─── Event Handlers ────────────────────────────────────────────────────────

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      mouseRef.current.active  = true;
      mouseRef.current.trail.push({ x, y, t: performance.now() });

      if (mouseRef.current.trail.length > TRAIL_LENGTH) {
        mouseRef.current.trail.shift();
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = () => {
      patternRef.current.currentShapeIndex = (patternRef.current.currentShapeIndex + 1) % TOTAL_SHAPES;
      patternRef.current.transitionStartTime = performance.now() * 0.001;
    };

    // ─── Transition / Shape Interpolator ───────────────────────────────────────

    const getShapeData = (x, y, time) => {
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

    // ─── Drawing Utilities ─────────────────────────────────────────────────────

    const drawDot = (x, y, radius, brightness, grayDisperseStrength, trailStrength, mouseStrength) => {
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

    // ─── Main Draw Loop ────────────────────────────────────────────────────────

    const animate = (ms) => {
      const time = ms * 0.001;
      const mouse = mouseRef.current;
      const now = performance.now();

      // Lagging cursor effect
      mouse.x = lerp(mouse.x, mouse.targetX, 0.12);
      mouse.y = lerp(mouse.y, mouse.targetY, 0.12);

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      for (const dot of dots) {
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
          if (dist < MOUSE_RADIUS) {
            const norm = dist / MOUSE_RADIUS;
            targetMouseStrength = (1 - norm) * (1 - norm) * (1 - norm);
          }
        }
        dot.currentMouseStrength = lerp(dot.currentMouseStrength, targetMouseStrength, 0.12);

        // Trail influence
        let targetTrailStrength = 0;
        for (let i = 0; i < mouse.trail.length; i++) {
          const pt = mouse.trail[i];
          const age = (now - pt.t) / TRAIL_FADE_MS;
          if (age >= 1) continue;

          const ageFade = (1 - age) * (1 - age) * (1 - age);
          const positionFade = (i + 1) / mouse.trail.length;
          const fade = ageFade * positionFade;

          const dx = dot.x - pt.x;
          const dy = dot.y - pt.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < TRAIL_RADIUS) {
            const proximity = 1 - smoothstep(0, 1, dist / TRAIL_RADIUS);
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

        const stableRadius = BASE_RADIUS + dot.currentShapeStrength * 1.25;
        const randomRadius = BASE_RADIUS + randomBlink * 0.35;
        const radius = lerp(stableRadius, randomRadius, dot.currentRandomStrength) * mouseShrink * trailShrink;

        drawDot(dot.x, dot.y, radius, brightness, grayDisperseBlink, dot.currentTrailStrength, dot.currentMouseStrength);
      }

      animationId = requestAnimationFrame(animate);
    };

    // ─── Listeners & Boot ──────────────────────────────────────────────────────

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("click", handleClick);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="block h-full w-full cursor-pointer touch-none bg-black"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/4 via-transparent to-black/40" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.95)]" />
      <div className="hidden max-sm:flex fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-center text-sm leading-tight pointer-events-none">
        Works best on desktop  <br />
        Here, tap & drag to explore
      </div>
    </section>
  );
}

