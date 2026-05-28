"use client";

import { useRef } from "react";
import gsap from "gsap";
import { TransitionRouter } from "next-transition-router";

// ─── Constants ────────────────────────────────────────────────────────────────

const TRANSITION_DELAY = 0.2;
const EMPTY_MASK = "conic-gradient(from 0deg, transparent 0deg, transparent 360deg)";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resetOverlay = (el) => {
  if (!el) return;
  el.style.opacity = "0";
  el.style.webkitMaskImage = EMPTY_MASK;
  el.style.maskImage = EMPTY_MASK;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PieRotationTransition({
  children,
  duration = 1.2,
  color = "#0F2854",
}) {
  const overlayRef = useRef(null);
  const shapeRef   = useRef({ start: 0, end: 0 });
  const contentRef = useRef(null);

  // ─── Slice Mask Math ─────────────────────────────────────────────────────────

  const applySlice = (endDeg, startDeg) => {
    const el = overlayRef.current;
    if (!el) return;

    if (endDeg <= startDeg + 0.01) {
      resetOverlay(el);
      return;
    }

    const rawSpread = endDeg - startDeg;
    el.style.opacity = "1";
    
    const spread = rawSpread % 360;
    const laps   = Math.floor(rawSpread / 360);

    if (laps === 0) {
      const s = ((startDeg % 360) + 360) % 360;
      const mask = `conic-gradient(from ${s + 90}deg, black 0deg, black ${spread}deg, transparent ${spread}deg)`;
      el.style.webkitMaskImage = mask;
      el.style.maskImage       = mask;
      return;
    }

    if (laps >= 2) {
      resetOverlay(el);
      return;
    }

    const fillSize = 360 - spread;
    const gapStart = ((endDeg % 360) + 360) % 360;
    const mask     = `conic-gradient(from ${gapStart + 90}deg, black 0deg, black ${fillSize}deg, transparent ${fillSize}deg)`;
    el.style.webkitMaskImage = mask;
    el.style.maskImage       = mask;
  };

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        resetOverlay(overlayRef.current);
        shapeRef.current = { start: 0, end: 0 };
        applySlice(0, 0);

        const tl   = gsap.timeline({ onComplete: next });
        const half = (duration - TRANSITION_DELAY) / 2;

        tl.to(contentRef.current, { opacity: 0.7, duration: half, ease: "power2.out" }, 0);
        tl.to(
          shapeRef.current,
          {
            end: 540,
            duration: half,
            ease: "power4.inOut",
            onUpdate: () => applySlice(shapeRef.current.end, shapeRef.current.start),
          },
          0
        );
        
        if (half > TRANSITION_DELAY) {
          tl.to(
            shapeRef.current,
            {
              start: 180,
              duration: half - TRANSITION_DELAY,
              ease: "power4.inOut",
              onUpdate: () => applySlice(shapeRef.current.end, shapeRef.current.start),
            },
            TRANSITION_DELAY
          );
        }

        return () => tl.kill();
      }}
      enter={(next) => {
        const tl = gsap.timeline({
          onComplete: () => {
            resetOverlay(overlayRef.current);
            next();
          },
        });

        const half = (duration - TRANSITION_DELAY) / 2;

        tl.to(contentRef.current, { opacity: 1, duration: half, ease: "power2.inOut" }, 0);
        tl.to(
          shapeRef.current,
          {
            end: 1080,
            duration: half,
            ease: "power2.inOut",
            onUpdate: () => applySlice(shapeRef.current.end, shapeRef.current.start),
          },
          0
        );

        if (half > TRANSITION_DELAY) {
          tl.to(
            shapeRef.current,
            {
              start: 360,
              duration: half - TRANSITION_DELAY,
              ease: "power2.inOut",
              onUpdate: () => applySlice(shapeRef.current.end, shapeRef.current.start),
            },
            TRANSITION_DELAY
          );
        } else {
          tl.to(
            shapeRef.current,
            {
              start: 360,
              duration: half,
              ease: "power2.inOut",
              onUpdate: () => applySlice(shapeRef.current.end, shapeRef.current.start),
            },
            TRANSITION_DELAY - half
          );
        }

        return () => tl.kill();
      }}
    >
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[999] pointer-events-none opacity-0"
        style={{
          backgroundColor: color,
          WebkitMaskImage: EMPTY_MASK,
          maskImage:       EMPTY_MASK,
        }}
      />
      <div ref={contentRef}>{children}</div>
    </TransitionRouter>
  );
}

