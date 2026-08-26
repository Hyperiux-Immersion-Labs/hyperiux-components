// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { useEffect, useRef } from "react";
import { createSuspendedRaf } from "./createSuspendedRaf";

const DEFAULT_SPACING = 26;
const DEFAULT_DOT_SIZE = 2.4;
const DEFAULT_MAX_DOT_SIZE = 10;
const DEFAULT_GROW_DURATION = 1.8;
const DEFAULT_HOLD_DURATION = 0.05;
const DEFAULT_SHRINK_DURATION = 1.8;
const DEFAULT_GAP_DURATION = 0.2;
// Fixed, quick crossfade for prefers-reduced-motion - independent of
// growDuration/shrinkDuration so reduced motion always feels snappy.
const REDUCED_MOTION_FADE_DURATION = 0.7;
// How long a fully revealed shape stays on screen in reduced motion -
// independent of holdDuration, which defaults to a near-instant 0.05s.
const REDUCED_MOTION_HOLD_DURATION = 1.6;
const DEFAULT_DOT_COLOR = "#ffffff";
const DEFAULT_BACKGROUND_COLOR = "#000000";
// Where the reveal/collapse band is anchored, as a fraction of height -
// shapes grow upward+downward from this line and later drain back into it.
const DEFAULT_REVEAL_ANCHOR = 0.5;

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, v: number): number => {
  const t = clamp01((v - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

const smootherstep = (e0: number, e1: number, v: number): number => {
  const t = clamp01((v - e0) / (e1 - e0));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

// Dots are painted via rgba() so alpha can be tweened per-frame - hex in,
// "r, g, b" out.
const hexToRgbTriplet = (hex: string): string => {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((c) => c + c).join("")
    : normalized;
  const num = parseInt(full, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
};

// Marks are drawn as fills, then downsampled onto the dot grid - only the
// silhouette matters, so any white-on-transparent artwork works here.
const toDataUri = (svg: string): string => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const letterMark = (letter: string): string =>
  toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="92" fill="#fff">${letter}</text></svg>`,
  );

const DEFAULT_IMAGES = "HYPERIUX".split("").map(letterMark);

type Phase = "grow" | "hold" | "shrink" | "gap";

interface DotTransitionProps {
  /** Images to cycle through. Any white/light silhouette on a transparent or dark background works best. */
  images?: string[];
  /** Distance between grid cells, in px. */
  spacing?: number;
  /** Resting dot size, in px. */
  dotSize?: number;
  /** Fully "on" dot size, in px. */
  maxDotSize?: number;
  /** Seconds for a shape to grow in from the resting grid. */
  growDuration?: number;
  /** Seconds a fully formed shape holds before shrinking away. */
  holdDuration?: number;
  /** Seconds for a shape to shrink back down to the resting grid. */
  shrinkDuration?: number;
  /** Seconds of plain resting grid between shrink and the next grow. */
  gapDuration?: number;
  /** Where shapes grow from / collapse into, as a fraction of height (0 = top, 1 = bottom). */
  revealAnchor?: number;
  /** Hex color used for the dots. */
  dotColor?: string;
  backgroundColor?: string;
  className?: string;
}

export default function DotTransition({
  images = DEFAULT_IMAGES,
  spacing = DEFAULT_SPACING,
  dotSize = DEFAULT_DOT_SIZE,
  maxDotSize = DEFAULT_MAX_DOT_SIZE,
  growDuration = DEFAULT_GROW_DURATION,
  holdDuration = DEFAULT_HOLD_DURATION,
  shrinkDuration = DEFAULT_SHRINK_DURATION,
  gapDuration = DEFAULT_GAP_DURATION,
  revealAnchor = DEFAULT_REVEAL_ANCHOR,
  dotColor = DEFAULT_DOT_COLOR,
  backgroundColor = DEFAULT_BACKGROUND_COLOR,
  className = "",
}: DotTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0;
    let rows = 0;
    let cellW = spacing;
    let cellH = spacing;
    let masks: Float32Array[] = [];
    let loadedCount = 0;

    let reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const reduceMotionMq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const handleReduceMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
    };

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

    const dotColorRgb = hexToRgbTriplet(dotColor);

    const imageEls = images.map(() => new window.Image());

    const buildMasks = () => {
      if (!cols || !rows || loadedCount < images.length) return;

      offscreen.width = cols;
      offscreen.height = rows;

      masks = imageEls.map((img) => {
        offCtx.clearRect(0, 0, cols, rows);
        if (img.naturalWidth && img.naturalHeight) {
          const scale = Math.min(cols / img.naturalWidth, rows / img.naturalHeight);
          const w = img.naturalWidth * scale;
          const h = img.naturalHeight * scale;
          offCtx.drawImage(img, (cols - w) / 2, (rows - h) / 2, w, h);
        }

        const data = offCtx.getImageData(0, 0, cols, rows).data;
        const mask = new Float32Array(cols * rows);
        for (let i = 0; i < cols * rows; i++) {
          const r = data[i * 4];
          const g = data[i * 4 + 1];
          const b = data[i * 4 + 2];
          const a = data[i * 4 + 3];
          mask[i] = ((r + g + b) / (3 * 255)) * (a / 255);
        }
        return mask;
      });
    };

    images.forEach((src, i) => {
      const img = imageEls[i];
      img.crossOrigin = "anonymous";
      img.onload = () => {
        loadedCount++;
        buildMasks();
      };
      img.src = src;
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(1, Math.round(width / spacing));
      rows = Math.max(1, Math.round(height / spacing));
      cellW = width / cols;
      cellH = height / rows;
      buildMasks();
    };

    const state: {
      imageIndex: number;
      phase: Phase;
      phaseStart: number;
      shrinkStartProgress: number;
    } = {
      imageIndex: 0,
      phase: "grow",
      phaseStart: 0,
      shrinkStartProgress: 1,
    };
    // Progress as of the last drawn frame, so a click mid-grow can hand the
    // shrink a real starting point instead of assuming it was fully formed.
    let liveProgress = 0;

    const durationFor = (phase: Phase): number => {
      if (phase === "grow") return growDuration;
      if (phase === "hold") return holdDuration;
      if (phase === "shrink") return shrinkDuration;
      return gapDuration;
    };

    const nextPhase = (phase: Phase): Phase => {
      if (phase === "grow") return "hold";
      if (phase === "hold") return "shrink";
      if (phase === "shrink") return "gap";
      return "grow";
    };

    // Click advances things along rather than jumping straight to the next
    // letter - a visible shape leaves early, a hidden one (mid-gap) arrives
    // early - so nothing ever pops between states. The shrink it triggers
    // still plays at the normal shrinkDuration pace, it just starts right
    // away instead of waiting out the rest of grow/hold - and it starts from
    // wherever the shape actually was, not from "fully grown".
    const handleClick = () => {
      if (reduceMotion) return;
      if (state.phase === "grow" || state.phase === "hold") {
        state.shrinkStartProgress = liveProgress;
        state.phase = "shrink";
        state.phaseStart = 0;
      } else if (state.phase === "gap") {
        state.phase = "grow";
        state.phaseStart = 0;
        state.imageIndex = (state.imageIndex + 1) % images.length;
      }
    };

    const loop = createSuspendedRaf({
      root: canvas,
      onFrame: (ms) => {
        const time = ms * 0.001;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        if (!cols || !rows || masks.length < images.length) return;

        let progress: number;

        if (state.phaseStart === 0) state.phaseStart = time;
        const elapsed = time - state.phaseStart;
        // Reduced motion skips the spatial grow/shrink wipe for a plain,
        // faster crossfade, and lingers longer on the fully revealed shape.
        const duration = reduceMotion
          ? state.phase === "grow" || state.phase === "shrink"
            ? REDUCED_MOTION_FADE_DURATION
            : state.phase === "hold"
              ? REDUCED_MOTION_HOLD_DURATION
              : durationFor(state.phase)
          : durationFor(state.phase);
        const t = duration > 0 ? clamp01(elapsed / duration) : 1;
        const eased = smootherstep(0, 1, t);

        if (state.phase === "grow") progress = eased;
        else if (state.phase === "hold") progress = 1;
        else if (state.phase === "shrink") progress = lerp(state.shrinkStartProgress, 0, eased);
        else progress = 0;

        if (elapsed >= duration) {
          state.phaseStart = time;
          const wasGap = state.phase === "gap";
          state.phase = nextPhase(state.phase);
          if (wasGap) state.imageIndex = (state.imageIndex + 1) % images.length;
          if (state.phase === "shrink") {
            // Entered naturally from a full hold, so it's starting from
            // fully grown - a click-triggered shrink sets this itself.
            state.shrinkStartProgress = 1;
          }
        }

        liveProgress = progress;

        const mask = masks[state.imageIndex];
        if (!mask) return;

        // The reveal/collapse travels along y only: a band centered on the
        // anchor line grows outward (both up and down) as progress -> 1, and
        // drains back down onto the anchor as progress -> 0.
        const anchorPx = height * revealAnchor;
        const edgePx = Math.max(cellH * 2.6, 1);
        // Extra edgePx of headroom so the farthest row still lands inside the
        // fully-revealed zone at progress 1, instead of sitting on the fade.
        const maxExtentPx = Math.max(anchorPx, height - anchorPx) + cellH + edgePx;
        // Shifted so the front starts a full edge-width *behind* the anchor at
        // progress 0 - otherwise the front sits exactly on the anchor row and
        // the symmetric fade never drops below ~50% there, leaving a sliver
        // permanently visible instead of the shape fully disappearing.
        const bandRadius = progress * (maxExtentPx + edgePx) - edgePx;

        for (let ry = 0; ry < rows; ry++) {
          const cy = cellH * (ry + 0.5);
          // Reduced motion fades the whole shape uniformly instead of
          // wiping it in/out from the anchor line.
          const band = reduceMotion
            ? progress
            : 1 - smoothstep(bandRadius - edgePx, bandRadius + edgePx, Math.abs(cy - anchorPx));

          for (let rx = 0; rx < cols; rx++) {
            const active = mask[ry * cols + rx] * band;
            const size = lerp(dotSize, maxDotSize, active);
            const alpha = lerp(0.16, 1, active);
            const cx = cellW * (rx + 0.5);

            ctx.fillStyle = `rgba(${dotColorRgb}, ${alpha})`;
            ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
          }
        }
      },
    });

    resize();
    window.addEventListener("resize", resize);
    reduceMotionMq?.addEventListener?.("change", handleReduceMotionChange);
    canvas.addEventListener("click", handleClick);
    loop.start();

    return () => {
      window.removeEventListener("resize", resize);
      reduceMotionMq?.removeEventListener?.("change", handleReduceMotionChange);
      canvas.removeEventListener("click", handleClick);
      imageEls.forEach((img) => {
        img.onload = null;
      });
      loop.destroy();
    };
  }, [images, spacing, dotSize, maxDotSize, growDuration, holdDuration, shrinkDuration, gapDuration, revealAnchor, dotColor, backgroundColor]);

  return (
    <section className={`relative h-screen w-full overflow-hidden ${className}`} style={{ backgroundColor }}>
      <canvas ref={canvasRef} className="block h-full w-full cursor-pointer" />
    </section>
  );
}
