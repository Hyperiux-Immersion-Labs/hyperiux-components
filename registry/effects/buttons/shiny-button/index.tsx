"use client";

import type React from "react";
import { useId, useSyncExternalStore } from "react";

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

interface ShinyButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  fillColor?: string;
  labelColor?: string;
  accentColor?: string;
  accentSoftColor?: string;
  sweepDuration?: number;
  easeDuration?: number;
  arcWidth?: number;
  cornerRadius?: number;
  showSpeckle?: boolean;
  showSheen?: boolean;
  speckleOpacity?: number;
}

export function ShinyButton({
  label = "Get Started",
  onClick,
  className = "",
  fillColor = "#000000",
  labelColor = "#ffffff",
  accentColor = "#ff5f00",
  accentSoftColor = "#ff9253",
  sweepDuration = 3,
  easeDuration = 0.8,
  arcWidth = 5,
  cornerRadius = 32,
  showSpeckle = true,
  showSheen = true,
  speckleOpacity = 0.4,
}: ShinyButtonProps) {
  const reducedMotion = usePrefersReducedMotion();
  const instanceId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const scope = `gleam-edge-${instanceId}`;

  const css = `
    @property --gradient-angle-${instanceId} {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
    @property --gradient-angle-offset-${instanceId} {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
    @property --gradient-percent-${instanceId} {
      syntax: "<percentage>";
      initial-value: ${arcWidth}%;
      inherits: false;
    }
    @property --gradient-shine-${instanceId} {
      syntax: "<color>";
      initial-value: white;
      inherits: false;
    }

    .${scope} {
      --gleam-base: ${fillColor};
      --gleam-inset: #1a1818;
      --gleam-label: ${labelColor};
      --gleam-accent: ${accentColor};
      --gleam-accent-soft: ${accentSoftColor};
      --animation: gradient-angle-${instanceId} linear infinite;
      --duration: ${sweepDuration}s;
      --shadow-size: 2px;
      --transition: ${easeDuration}s cubic-bezier(0.25, 1, 0.5, 1);

      isolation: isolate;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      outline-offset: 4px;
      padding: 1.25rem 2.5rem;
      font-size: 1.125rem;
      line-height: 1.2;
      font-weight: 500;
      border: 1px solid transparent;
      border-radius: ${cornerRadius}px;
      color: var(--gleam-label);
      background:
        linear-gradient(var(--gleam-base), var(--gleam-base)) padding-box,
        conic-gradient(
          from calc(var(--gradient-angle-${instanceId}) - var(--gradient-angle-offset-${instanceId})),
          transparent,
          var(--gleam-accent) var(--gradient-percent-${instanceId}),
          var(--gradient-shine-${instanceId}) calc(var(--gradient-percent-${instanceId}) * 2),
          var(--gleam-accent) calc(var(--gradient-percent-${instanceId}) * 3),
          transparent calc(var(--gradient-percent-${instanceId}) * 4)
        ) border-box;
      box-shadow: inset 0 0 0 1px var(--gleam-inset);
      transition: var(--transition);
      transition-property:
        --gradient-angle-offset-${instanceId},
        --gradient-percent-${instanceId},
        --gradient-shine-${instanceId};
    }

    .${scope}::before,
    .${scope}::after,
    .${scope} span::before {
      content: "";
      pointer-events: none;
      position: absolute;
      inset-inline-start: 50%;
      inset-block-start: 50%;
      translate: -50% -50%;
      z-index: -1;
    }

    .${scope}:active {
      translate: 0 1px;
    }

    .${scope}::before {
      --size: calc(100% - var(--shadow-size) * 3);
      --position: 2px;
      --space: calc(var(--position) * 2);
      width: var(--size);
      height: var(--size);
      background: radial-gradient(
        circle at var(--position) var(--position),
        white calc(var(--position) / 4),
        transparent 0
      ) padding-box;
      background-size: var(--space) var(--space);
      background-repeat: space;
      mask-image: conic-gradient(
        from calc(var(--gradient-angle-${instanceId}) + 45deg),
        black,
        transparent 10% 90%,
        black
      );
      border-radius: inherit;
      opacity: ${showSpeckle ? speckleOpacity : 0};
      z-index: -1;
    }

    .${scope}::after {
      --animation: shimmer-${instanceId} linear infinite;
      width: 100%;
      aspect-ratio: 1;
      background: linear-gradient(
        -50deg,
        transparent,
        var(--gleam-accent),
        transparent
      );
      mask-image: radial-gradient(circle at bottom, transparent 40%, black);
      opacity: ${showSheen ? 0.6 : 0};
    }

    .${scope} span {
      z-index: 1;
    }

    .${scope} span::before {
      --size: calc(100% + 1rem);
      width: var(--size);
      height: var(--size);
      box-shadow: inset 0 -1ex 2rem 4px var(--gleam-accent);
      opacity: 0;
      transition: opacity var(--transition);
      animation: calc(var(--duration) * 1.5) breathe-${instanceId} linear infinite;
    }

    .${scope},
    .${scope}::before,
    .${scope}::after {
      animation:
        var(--animation) var(--duration),
        var(--animation) calc(var(--duration) / 0.4) reverse paused;
      animation-composition: add;
    }

    .${scope}:is(:hover, :focus-visible) {
      --gradient-percent-${instanceId}: 20%;
      --gradient-angle-offset-${instanceId}: 95deg;
      --gradient-shine-${instanceId}: var(--gleam-accent-soft);
    }

    .${scope}:is(:hover, :focus-visible),
    .${scope}:is(:hover, :focus-visible)::before,
    .${scope}:is(:hover, :focus-visible)::after {
      animation-play-state: running;
    }

    .${scope}:is(:hover, :focus-visible) span::before {
      opacity: 1;
    }

    @keyframes gradient-angle-${instanceId} {
      to {
        --gradient-angle-${instanceId}: 360deg;
      }
    }

    @keyframes shimmer-${instanceId} {
      to {
        rotate: 360deg;
      }
    }

    @keyframes breathe-${instanceId} {
      from,
      to {
        scale: 1;
      }
      50% {
        scale: 1.2;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${scope},
      .${scope}::before,
      .${scope}::after,
      .${scope} span::before {
        animation: none !important;
      }

      .${scope}:is(:hover, :focus-visible),
      .${scope}:is(:hover, :focus-visible)::before,
      .${scope}:is(:hover, :focus-visible)::after {
        animation-play-state: paused !important;
      }

      .${scope}:is(:hover, :focus-visible) span::before {
        opacity: 0;
      }

      .${scope} {
        transition: none;
      }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <button
        type="button"
        className={`${scope} ${className}`}
        onClick={onClick}
        aria-label={label}
        data-reduced-motion={reducedMotion ? "true" : undefined}
      >
        <span>{label}</span>
      </button>
    </>
  );
}

export default ShinyButton;
