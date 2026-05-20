"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("linesLoadingEase", "0.75,-0.01,0.16,1");

const LINE_COUNT = 17;
const ROW_H = 24;
const NAV_H = 55;
const MORPH_STAGGER = 34;
const MORPH_DUR = 720;
const APPEAR_DUR = 260;
const CONTENT_FADE_AT = 0.32;
const WIPE_DUR = 820;
const HOLD_AFTER_MORPH = 120;
const HOLD_END = 820;
const WIPE_OVERLAP = 0.1;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function LineRevealLoader({ onComplete, children } = {}) {
  const containerRef = useRef(null);
  const darkLineRefs = useRef([]);
  const lightLineRefs = useRef([]);
  const lightLayerRef = useRef(null);
  const darkContentRef = useRef(null);
  const tlRef = useRef(null);
  const layoutRef = useRef({ flatY: [], coneScale: [] });
  const [done, setDone] = useState(false);

  const recomputeLayout = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const h = Math.max(1, Math.round(el.getBoundingClientRect().height));
    const flatY = [];
    const coneScale = [];
    for (let i = 0; i < LINE_COUNT; i++) {
      const t = LINE_COUNT === 1 ? 0 : i / (LINE_COUNT - 1);
      flatY.push(NAV_H + i * ROW_H);
      coneScale.push(lerp(0.66, 0.035, Math.pow(t, 1.12)));
    }
    layoutRef.current = { flatY, coneScale };
  }, []);

  const run = useCallback(() => {
    tlRef.current?.kill();
    setDone(false);
    recomputeLayout();

    const darkLineEls = darkLineRefs.current;
    const lightLineEls = lightLineRefs.current;
    const { flatY, coneScale } = layoutRef.current;

    gsap.set(darkLineEls, { opacity: 1, left: "50%", xPercent: -50, y: (i) => flatY[i], scaleX: 0, transformOrigin: "50% 50%" });
    gsap.set(lightLineEls, { opacity: 1, left: "50%", xPercent: -50, y: (i) => flatY[i], scaleX: 1, transformOrigin: "50% 50%" });
    gsap.set(lightLayerRef.current, { clipPath: "inset(100% 0 0 0)", opacity: 0 });
    gsap.set(darkContentRef.current, { opacity: 0 });

    if (prefersReducedMotion()) {
      gsap.set(darkContentRef.current, { opacity: 1 });
      gsap.set(lightLayerRef.current, { opacity: 1, clipPath: "inset(0% 0 0 0)" });
      gsap.set(darkLineEls, { scaleX: 1 });
      setDone(true);
      onComplete?.();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "linesLoadingEase" },
      onComplete: () => { setDone(true); onComplete?.(); },
    });
    tlRef.current = tl;

    const staggerS = MORPH_STAGGER / 1000;
    const appearS = APPEAR_DUR / 1000;
    const morphS = MORPH_DUR / 1000;
    const totalS = appearS + morphS;
    const appearPct = totalS === 0 ? 1 : appearS / totalS;
    const scaleSetters = darkLineEls.map((el) => el ? gsap.quickSetter(el, "scaleX") : null);

    for (let i = 0; i < LINE_COUNT; i++) {
      const setScaleX = scaleSetters[i];
      if (!setScaleX) continue;
      const driver = { p: 0 };
      tl.to(driver, {
        p: 1,
        duration: totalS,
        onUpdate: () => {
          const p = driver.p;
          const scaled = p <= appearPct
            ? coneScale[i] * (p / appearPct)
            : coneScale[i] + (1 - coneScale[i]) * ((p - appearPct) / (1 - appearPct));
          setScaleX(scaled);
        },
      }, i * staggerS);
    }

    const allLinesEnd = (LINE_COUNT - 1) * staggerS + totalS;
    const wipeAt = Math.max(0, allLinesEnd + HOLD_AFTER_MORPH / 1000 - WIPE_OVERLAP);

    tl.to(darkContentRef.current, { opacity: 1, duration: WIPE_DUR / 1000 * 0.6 }, CONTENT_FADE_AT);
    tl.addLabel("wipe", wipeAt);
    tl.set(lightLayerRef.current, { opacity: 1 }, "wipe");
    tl.to(lightLayerRef.current, { clipPath: "inset(0% 0 0 0)", duration: WIPE_DUR / 1000 }, "wipe");
    tl.to(darkLineEls, { opacity: 0, duration: (WIPE_DUR / 1000) * 0.6 }, "wipe");
    tl.to({}, { duration: HOLD_END / 1000 });
  }, [onComplete, recomputeLayout]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => recomputeLayout());
    ro.observe(el);
    const id = setTimeout(run, 60);
    return () => { clearTimeout(id); ro.disconnect(); tlRef.current?.kill(); };
  }, [recomputeLayout, run]);

  return (
    <div ref={containerRef} style={{ position: "relative", height: "100vh", width: "100%", overflow: "hidden", background: "#000" }}>
      {/* Dark layer */}
      <div style={{ position: "absolute", inset: 0 }}>
        <div ref={darkContentRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
          {children}
        </div>
        <div style={{ pointerEvents: "none", position: "absolute", inset: 0 }}>
          {Array.from({ length: LINE_COUNT }, (_, i) => (
            <div
              key={i}
              ref={(el) => (darkLineRefs.current[i] = el)}
              style={{ position: "absolute", left: "50%", top: 0, height: 1, width: "100%", background: "#fff", willChange: "transform" }}
            />
          ))}
        </div>
      </div>

      {/* Light layer (revealed by wipe) */}
      <div
        ref={lightLayerRef}
        style={{ position: "absolute", inset: 0, opacity: 0, willChange: "clip-path", background: "#fff" }}
      >
        <div style={{ pointerEvents: "none", position: "absolute", inset: 0 }}>
          {Array.from({ length: LINE_COUNT }, (_, i) => (
            <div
              key={i}
              ref={(el) => (lightLineRefs.current[i] = el)}
              style={{ position: "absolute", left: "50%", top: 0, height: 1, width: "100%", background: "#000", willChange: "transform" }}
            />
          ))}
        </div>
      </div>

      {done && (
        <button
          onClick={run}
          style={{
            position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
            zIndex: 10, cursor: "pointer", border: "1px solid rgba(0,0,0,0.25)",
            background: "rgba(255,255,255,0.7)", padding: "6px 22px",
            fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", color: "#333",
            borderRadius: 2,
          }}
        >
          replay
        </button>
      )}
    </div>
  );
}
