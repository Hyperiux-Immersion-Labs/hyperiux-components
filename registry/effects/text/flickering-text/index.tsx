"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

// The shared noise lane every character blends toward. Character lanes start
// at 1 so lane 0 is always the common stream.
const SHARED_LANE = 0;

// Hash constants for the deterministic value noise. Odd primes, nothing more.
const HASH_LANE = 374761393;
const HASH_STEP = 668265263;
const HASH_SEED = 2246822519;
const HASH_MIX = 1274126177;
const UINT32_MAX = 4294967295;

const LINE_HEIGHT = 0.82;

// Bloom stack, tightest to widest. Radii are in em so the halo tracks the
// font size, and the alphas stack up into a soft falloff instead of a ring.
const GLOW_LAYERS = [
  { radius: 0.08, alpha: 0.55 },
  { radius: 0.22, alpha: 0.35 },
  { radius: 0.5, alpha: 0.22 },
];

const DEFAULT_LINES = ["FLICKERING", "TEXT"];
const DEFAULT_RANDOM_SEED = 0;
const DEFAULT_GLOW_THRESHOLD = 0.6;


interface FlickeringTextProps {
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  /** Noise samples per second, the After Effects "Wiggles/Second". */
  wigglesPerSecond?: number;
  /** 0 = every character flickers alone, 1 = the whole line flickers as one. */
  correlation?: number;
  /** Opacity a character falls to when the selector is fully applied. */
  minOpacity?: number;
  /** Lower bound of the selector amount. Negative values park characters at
   *  full opacity for part of the cycle, which is what keeps the line legible. */
  minAmount?: number;
  maxAmount?: number;
  fontSize?: number | string;
  fontWeight?: number | string;
  glow?: boolean;
  /** Bloom color. Defaults to the text color. */
  glowColor?: string;
  /** Overall bloom strength. 0 turns the glow off. */
  glowIntensity?: number;
  /** Multiplier on the bloom radii. */
  glowRadius?: number;
}

/** Deterministic value in [-1, 1] for a lane at a discrete wiggle step. */
const randomAt = (lane: number, step: number, seed: number) => {
  let hash =
    (Math.imul(lane, HASH_LANE) ^
      Math.imul(step, HASH_STEP) ^
      Math.imul(seed, HASH_SEED)) >>>
    0;
  hash = Math.imul(hash ^ (hash >>> 13), HASH_MIX) >>> 0;
  return (hash / UINT32_MAX) * 2 - 1;
};

/** Layered text-shadow for a bloom at the given strength, 0 to 1. */
const glowShadow = (strength: number, color: string, radius: number) => {
  if (strength <= 0) return "none";

  return GLOW_LAYERS.map(({ radius: layerRadius, alpha }) => {
    const mix = (alpha * strength * 100).toFixed(1);
    return `0 0 ${(layerRadius * radius).toFixed(3)}em color-mix(in srgb, ${color} ${mix}%, transparent)`;
  }).join(", ");
};

/** Smoothstep-interpolated value noise: the wiggle between two samples. */
const noiseAt = (lane: number, time: number, seed: number) => {
  const step = Math.floor(time);
  const t = time - step;
  const ease = t * t * (3 - 2 * t);
  const from = randomAt(lane, step, seed);
  const to = randomAt(lane, step + 1, seed);
  return from + (to - from) * ease;
};

const FlickeringText = ({
  className = "",
  backgroundColor = "#111844",
  textColor = "#ffffff",
  wigglesPerSecond = 2,
  correlation = 0.5,
  minOpacity = 0,
  minAmount = -1,
  maxAmount = 1,
  fontSize = "10vw",
  fontWeight = 700,
  glow = true,
  glowColor,
  glowIntensity = 1,
  glowRadius = 1,
}: FlickeringTextProps) => {
  const bloomColor = glowColor ?? textColor;
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<HTMLSpanElement[]>([]);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const lines = DEFAULT_LINES;

  useGSAP(
    () => {
      const splits = lineRefs.current
        .filter((line): line is HTMLParagraphElement => Boolean(line))
        .map((line) =>
          SplitText.create(line, {
            type: "chars",
            charsClass: "flickering-text-char",
            aria: "none",
          }),
        );

      const chars = splits.flatMap((split) => split.chars as HTMLSpanElement[]);
      charRefs.current = chars;

      if (!chars.length) return;

      const prefersReduced = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) {
        chars.forEach((char) => {
          char.style.opacity = "1";
          char.style.textShadow = "none";
        });
        return () => {
          splits.forEach((split) => split.revert());
          charRefs.current = [];
        };
      }

      const startTime = gsap.ticker.time;

    
      const blendNorm = Math.hypot(1 - correlation, correlation);

      const glowRamp = Math.max(1 - DEFAULT_GLOW_THRESHOLD, 0.001);

      const onTick = () => {
        const time = (gsap.ticker.time - startTime) * wigglesPerSecond;
        const shared = noiseAt(SHARED_LANE, time, DEFAULT_RANDOM_SEED);

        chars.forEach((char, lane) => {
          const own = noiseAt(lane + 1, time, DEFAULT_RANDOM_SEED);
          const noise =
            (own * (1 - correlation) + shared * correlation) / blendNorm;

         
          const amount =
            ((noise + 1) / 2) * (maxAmount - minAmount) + minAmount;
          const opacity = gsap.utils.clamp(
            Math.min(minOpacity, 1),
            1,
            1 + amount * (minOpacity - 1),
          );

         
          const strength =
            glow
              ? gsap.utils.clamp(
                  0,
                  1,
                  (opacity - DEFAULT_GLOW_THRESHOLD) / glowRamp,
                ) * glowIntensity
              : 0;

          char.style.opacity = String(opacity);
          char.style.textShadow = glowShadow(strength, bloomColor, glowRadius);
        });
      };

      gsap.ticker.add(onTick);
      return () => {
        gsap.ticker.remove(onTick);
        splits.forEach((split) => split.revert());
        charRefs.current = [];
      };
    },
    {
      scope: containerRef,
      dependencies: [
        wigglesPerSecond,
        correlation,
        minOpacity,
        minAmount,
        maxAmount,
        glow,
        bloomColor,
        glowIntensity,
        glowRadius,
      ],
    },
  );

  return (
    <section
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 sm:px-6 ${className}`}
      style={{ backgroundColor: backgroundColor }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <div
        ref={containerRef}
        className="relative w-full  max-w-[1400px]"
        aria-label={DEFAULT_LINES.join(" ")}
      >
        {lines.map((line, lineIndex) => (
          <p
            key={`line-${lineIndex}`}
            aria-hidden="true"
            ref={(el) => {
              lineRefs.current[lineIndex] = el;
            }}
            className="m-0 w-full whitespace-nowrap text-center uppercase tracking-[-0.02em]"
            style={{ color: textColor, lineHeight: LINE_HEIGHT, fontSize, fontWeight }}
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
};

export default FlickeringText;
