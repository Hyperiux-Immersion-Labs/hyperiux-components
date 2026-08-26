// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { TransitionRouter } from "next-transition-router";
import React, { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}


const ROWS = 5;
const COLOR = "#000000";

const STAGGER_DELAY = 0.12;
const COVER_DURATION = 0.72;
const REVEAL_DURATION = 0.68;
const BLOCK_OFFSET_PERCENT = 101;

const SHIFT_SCALE_OUT = 0.98;
const SHIFT_SCALE_IN = 1.02;
const SHIFT_BLUR = "4px";
const SHIFT_DURATION_OUT = 0.7;
const SHIFT_DURATION_IN = 0.8;

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const next = Number(value);
  if (!Number.isFinite(next)) return fallback;
  return Math.min(max, Math.max(min, next));
}

interface BlockTransitionProps {
  children?: ReactNode;
  enableContentShift?: boolean;
  rows?: number;
  color?: string;
  duration?: number;
}

export default function BlockTransition({
  children,
  enableContentShift = false,
  rows = ROWS,
  color = COLOR,
  duration = 1,
}: BlockTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const safeRows = Math.round(clampNumber(rows, 2, 12, ROWS));
  const safeDuration = clampNumber(duration, 0.25, 3, 1);

  const getRows = () => rowRefs.current.slice(0, safeRows).filter(Boolean) as HTMLDivElement[];

  const buildRowsAnimation = (timeline: gsap.core.Timeline, direction: 'cover' | 'reveal') => {
    const rows = getRows();
    const orderedRows = direction === "cover" ? rows : [...rows].reverse();

    orderedRows.forEach((row, index) => {
      const [leftBlock, rightBlock] = row.children;
      const delay = index * STAGGER_DELAY;

      if (direction === "cover") {
        timeline.set([leftBlock, rightBlock], { autoAlpha: 1 }, delay);
        timeline.to(
          [leftBlock, rightBlock],
          {
            xPercent: 0,
            duration: COVER_DURATION * safeDuration,
            ease: "power3.inOut",
          },
          delay
        );
      } else {
        timeline.to(
          leftBlock,
          {
            xPercent: -BLOCK_OFFSET_PERCENT,
            duration: REVEAL_DURATION * safeDuration,
            ease: "power3.inOut",
          },
          delay
        );
        timeline.set(leftBlock, { autoAlpha: 0 }, delay + REVEAL_DURATION * safeDuration);

        timeline.to(
          rightBlock,
          {
            xPercent: BLOCK_OFFSET_PERCENT,
            duration: REVEAL_DURATION * safeDuration,
            ease: "power3.inOut",
          },
          delay
        );
        timeline.set(rightBlock, { autoAlpha: 0 }, delay + REVEAL_DURATION * safeDuration);
      }
    });
  };


  useLayoutEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, safeRows);
    getRows().forEach((row) => {
      const [leftBlock, rightBlock] = row.children;
      if (!leftBlock || !rightBlock) return;

      gsap.set(leftBlock, {
        xPercent: -BLOCK_OFFSET_PERCENT,
        autoAlpha: 0,
      });

      gsap.set(rightBlock, {
        xPercent: BLOCK_OFFSET_PERCENT,
        autoAlpha: 0,
      });
    });
  }, [safeRows]);


  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const timeline = gsap.timeline({ onComplete: next });

        if (prefersReducedMotion()) {
          timeline.to(wrapperRef.current, { opacity: 0, duration: 0.2, ease: "power1.out" }, 0);
          return () => timeline.kill();
        }

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { scale: 1, filter: "blur(0px)", opacity: 1 },
            {
              scale: SHIFT_SCALE_OUT,
              filter: `blur(${SHIFT_BLUR})`,
              opacity: 0.85,
              duration: SHIFT_DURATION_OUT * safeDuration,
              ease: "power2.inOut",
            },
            0
          );
        }

        buildRowsAnimation(timeline, "cover");

        return () => timeline.kill();
      }}
      enter={(next) => {
        const timeline = gsap.timeline({ onComplete: next });

        if (prefersReducedMotion()) {
          timeline.to(wrapperRef.current, { opacity: 1, duration: 0.2, ease: "power1.out", clearProps: "all" }, 0);
          return () => timeline.kill();
        }

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { scale: SHIFT_SCALE_IN, filter: `blur(${SHIFT_BLUR})`, opacity: 0.85 },
            {
              scale: 1,
              filter: "blur(0px)",
              opacity: 1,
              duration: SHIFT_DURATION_IN * safeDuration,
              ease: "power2.out",
            },
            0.08
          );
        }

        buildRowsAnimation(timeline, "reveal");

        return () => timeline.kill();
      }}
    >
      <div className="pointer-events-none fixed inset-0 z-999 overflow-hidden">
        {Array.from({ length: safeRows }).map((_, index) => (
          <div
            key={index}
            ref={(node) => {
              rowRefs.current[index] = node;
            }}
            className="absolute left-0 w-full overflow-hidden"
            style={{
              top: `${(index * 100) / safeRows}%`,
              height: `calc(${100 / safeRows}% + 2px)`,
            }}
          >
            <span
              className="absolute top-0 left-0 h-full w-[51%] will-change-transform"
              style={{
                backgroundColor: color,
                opacity: 0,
                visibility: "hidden",
              }}
            />

            <span
              className="absolute top-0 right-0 h-full w-[51%] will-change-transform"
              style={{
                backgroundColor: color,
                opacity: 0,
                visibility: "hidden",
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative h-full w-full">
        <div ref={wrapperRef} className="h-full w-full will-change-transform">
          {children}
        </div>
      </div>
    </TransitionRouter>
  );
}
