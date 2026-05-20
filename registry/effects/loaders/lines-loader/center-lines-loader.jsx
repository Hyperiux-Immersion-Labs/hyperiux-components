"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("centerLinesEase", "0.75,-0.01,0.16,1");

const LINE_H = 1;
const EDGE_PAD = 12;
const DIAMOND_MAX = 0.92;
const DIAMOND_MIN = 0.06;
const STAGGER_MS = 34;
const APPEAR_MS = 260;
const MORPH_MS = 720;
const PAIR_FADE_MS = 260;
const TRANSLATE_UP_MS = 820;
const HOLD_END_MS = 260;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function CenterLinesLoader({
  lineCount = 33,
  title = "Build better interfaces",
  subtitle = "Hyperiux UI",
  onComplete,
} = {}) {
  const containerRef = useRef(null);
  const blackPanelRef = useRef(null);
  const revealPanelRef = useRef(null);
  const linesWrapRef = useRef(null);
  const heroWordRefs = useRef([]);
  const heroSubtitleRef = useRef(null);
  const lineRefs = useRef([]);
  const tlRef = useRef(null);
  const layoutRef = useRef({ y: [], coneScale: [] });
  const [done, setDone] = useState(false);

  const heroWords = title.split(" ").filter(Boolean);

  const recomputeLayout = useCallback((count) => {
    const el = containerRef.current;
    if (!el) return;
    const h = Math.max(1, Math.round(el.getBoundingClientRect().height));
    const mid = (count - 1) / 2;
    const usable = Math.max(1, h - EDGE_PAD * 2);
    const spacing = usable / Math.max(1, count - 1);
    const y = [];
    const coneScale = [];
    for (let i = 0; i < count; i++) {
      y.push(Math.round(EDGE_PAD + i * spacing));
      const t = mid === 0 ? 0 : Math.abs(i - mid) / mid;
      coneScale.push(lerp(DIAMOND_MAX, DIAMOND_MIN, t));
    }
    layoutRef.current = { y, coneScale };
  }, []);

  const run = useCallback(() => {
    tlRef.current?.kill();
    setDone(false);
    const count = Math.max(3, Math.floor(lineCount));
    recomputeLayout(count);

    const lines = lineRefs.current.slice(0, count);
    const { y, coneScale } = layoutRef.current;
    const wordEls = heroWordRefs.current.slice(0, heroWords.length).filter(Boolean);

    gsap.set(blackPanelRef.current, { yPercent: 0, opacity: 1 });
    gsap.set(revealPanelRef.current, { scaleY: 0, transformOrigin: "50% 50%" });
    gsap.set(linesWrapRef.current, { opacity: 1 });
    gsap.set(wordEls, { opacity: 0, y: 16, filter: "blur(12px)" });
    gsap.set(heroSubtitleRef.current, { opacity: 0, y: 14, filter: "blur(10px)" });
    gsap.set(lines, { opacity: 1, left: "50%", xPercent: -50, y: (i) => y[i], scaleX: 0, transformOrigin: "50% 50%" });

    if (prefersReducedMotion()) {
      gsap.set(lines, { scaleX: 1 });
      gsap.set(linesWrapRef.current, { opacity: 0 });
      gsap.set(revealPanelRef.current, { scaleY: 1 });
      gsap.set(wordEls, { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(heroSubtitleRef.current, { opacity: 1, y: 0, filter: "blur(0px)" });
      setDone(true);
      onComplete?.();
      return;
    }

    const staggerS = STAGGER_MS / 1000;
    const appearS = APPEAR_MS / 1000;
    const morphS = MORPH_MS / 1000;
    const totalS = appearS + morphS;
    const appearPct = totalS === 0 ? 1 : appearS / totalS;
    const scaleSetters = lines.map((el) => el ? gsap.quickSetter(el, "scaleX") : null);

    const tl = gsap.timeline({
      defaults: { ease: "centerLinesEase" },
      onComplete: () => { setDone(true); onComplete?.(); },
    });
    tlRef.current = tl;

    const mid = (count - 1) / 2;
    const orderIdx = Array.from({ length: count }, (_, i) => i).sort((a, b) =>
      Math.abs(a - mid) - Math.abs(b - mid)
    );

    for (let i = 0; i < count; i++) {
      const idx = orderIdx[i];
      const setScaleX = scaleSetters[idx];
      if (!setScaleX) continue;
      const driver = { p: 0 };
      tl.to(driver, {
        p: 1,
        duration: totalS,
        onUpdate: () => {
          const p = driver.p;
          const scaled = p <= appearPct
            ? coneScale[idx] * (p / appearPct)
            : coneScale[idx] + (1 - coneScale[idx]) * ((p - appearPct) / (1 - appearPct));
          setScaleX(scaled);
        },
      }, i * staggerS);
    }

    const allLinesEnd = (count - 1) * staggerS + totalS;
    const midIdx = Math.floor((count - 1) / 2);
    const pairCount = midIdx;
    const pairFadeDur = PAIR_FADE_MS / 1000;
    const pairGap = 0.045;

    for (let k = 0; k < pairCount; k++) {
      tl.to(
        [lines[k], lines[count - 1 - k]].filter(Boolean),
        { opacity: 0, duration: pairFadeDur },
        allLinesEnd + k * pairGap
      );
    }

    const pairsEnd = allLinesEnd + (pairCount - 1) * pairGap + pairFadeDur;
    const revealStart = pairsEnd + 0.02;

    tl.to(revealPanelRef.current, { scaleY: 1, duration: TRANSLATE_UP_MS / 1000 }, revealStart);
    tl.to(blackPanelRef.current, { opacity: 0, duration: TRANSLATE_UP_MS / 1000 + 0.25 }, revealStart + 0.14);
    tl.to(linesWrapRef.current, { opacity: 0, duration: 0.22 }, revealStart + 0.06);
    tl.to(lines[midIdx], { opacity: 0, duration: 0.22 }, revealStart + 0.06);
    tl.to(wordEls, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.78, stagger: 0.06 }, revealStart + 0.18);
    tl.to(heroSubtitleRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.68 }, revealStart + 0.32);
    tl.to({}, { duration: Math.max(0, HOLD_END_MS / 1000) }, revealStart + TRANSLATE_UP_MS / 1000);
  }, [heroWords.length, lineCount, onComplete, recomputeLayout, title]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const count = Math.max(3, Math.floor(lineCount));
    const ro = new ResizeObserver(() => recomputeLayout(count));
    ro.observe(el);
    const id = setTimeout(run, 60);
    return () => { clearTimeout(id); ro.disconnect(); tlRef.current?.kill(); };
  }, [lineCount, recomputeLayout, run]);

  return (
    <div ref={containerRef} style={{ position: "fixed", inset: 0, height: "100vh", width: "100vw", overflow: "hidden", background: "#fff" }}>
      <div
        ref={blackPanelRef}
        style={{ position: "absolute", inset: 0, zIndex: 20, background: "#000", willChange: "transform" }}
      />
      <div
        ref={revealPanelRef}
        style={{ position: "absolute", inset: 0, zIndex: 30, background: "#fff", willChange: "transform" }}
      />
      <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ padding: "0 24px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "monospace", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#000", margin: 0, userSelect: "none" }}>
            {heroWords.map((w, i) => (
              <span key={`${w}-${i}`} ref={(el) => (heroWordRefs.current[i] = el)} style={{ display: "inline-block" }}>
                {w}{i === heroWords.length - 1 ? "" : " "}
              </span>
            ))}
          </h1>
          <p
            ref={heroSubtitleRef}
            style={{ marginTop: 16, fontFamily: "monospace", fontSize: 13, letterSpacing: "0.18em", color: "rgba(0,0,0,0.7)", userSelect: "none" }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <div ref={linesWrapRef} style={{ pointerEvents: "none", position: "absolute", inset: 0, zIndex: 40 }}>
        {Array.from({ length: Math.max(3, Math.floor(lineCount)) }, (_, i) => (
          <div
            key={i}
            ref={(el) => (lineRefs.current[i] = el)}
            style={{ position: "absolute", left: "50%", top: 0, height: LINE_H, width: "100%", background: "rgba(255,255,255,0.6)", willChange: "transform" }}
          />
        ))}
      </div>
      {done && (
        <button
          onClick={run}
          style={{
            position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
            zIndex: 60, cursor: "pointer", border: "1px solid rgba(0,0,0,0.2)",
            background: "rgba(0,0,0,0.05)", padding: "7px 22px", backdropFilter: "blur(4px)",
            fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", color: "rgba(0,0,0,0.7)",
            borderRadius: 2,
          }}
        >
          replay
        </button>
      )}
    </div>
  );
}
