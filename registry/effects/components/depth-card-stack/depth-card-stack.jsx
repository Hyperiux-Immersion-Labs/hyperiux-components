"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

const CARD_W = 300;
const CARD_H = 450;
const AUTO_PLAY_DELAY = 5000;

function ChevronLeft() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function getSlotProps(slot) {
  switch (slot) {
    case  0: return { x:   0, y:   0, rotateX: 0, rotateZ:  0, rotateY: 0, scale: 1,    opacity: 1,   zIndex: 20 };
    case  1: return { x:  20, y: -20, rotateX: 0, rotateZ:  2, rotateY: 0, scale: 0.9,  opacity: 1,   zIndex: 10 };
    case  2: return { x:  35, y: -40, rotateX: 0, rotateZ:  4, rotateY: 0, scale: 0.83, opacity: 0.9, zIndex: 8  };
    case -1: return { x: -20, y: -20, rotateX: 0, rotateZ: -2, rotateY: 0, scale: 0.9,  opacity: 1,   zIndex: 10 };
    case -2: return { x: -35, y: -40, rotateX: 0, rotateZ: -4, rotateY: 0, scale: 0.83, opacity: 0.9, zIndex: 8  };
    default: return { x:   0, y: -30, rotateX: 0, rotateZ:  0, rotateY: 0, scale: 0.75, opacity: 0,   zIndex: 0  };
  }
}

function computeSlot(cardIdx, centerIdx, total) {
  const rel = ((cardIdx - centerIdx) % total + total) % total;
  if (rel === 0)          return 0;
  if (rel === 1)          return 1;
  if (rel === 2)          return 2;
  if (rel === total - 1)  return -1;
  if (rel === total - 2)  return -2;
  return null;
}

function useCountdown(targetDate) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000));
      setTime({ d: Math.floor(diff / 86400), h: Math.floor((diff % 86400) / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function SliderCard({ card, index, cardRefs, cardFaceRefs, textureRefs }) {
  return (
    <div
      ref={(el) => { cardRefs.current[index] = el; }}
      style={{
        position: "absolute", width: CARD_W, height: CARD_H,
        top: "50%", left: "50%",
        marginTop: -(CARD_H / 2), marginLeft: -(CARD_W / 2),
        transformOrigin: "center bottom", transformStyle: "preserve-3d",
        willChange: "transform", cursor: "pointer",
      }}
    >
      <div
        ref={(el) => { cardFaceRefs.current[index] = el; }}
        style={{
          position: "relative", width: "100%", height: "100%", willChange: "transform",
          borderRadius: 18, boxShadow: "0 14px 50px rgba(0,0,0,0.28)",
          background: card.color, transformOrigin: "center",
        }}
      >
        <div
          ref={(el) => { textureRefs.current[index] = el; }}
          style={{
            position: "absolute", inset: 0, pointerEvents: "none", opacity: 0,
            borderRadius: 18, backgroundImage: `url('${card.textureImage}')`,
            backgroundPosition: "center", backgroundRepeat: "repeat", backgroundSize: "auto",
            mixBlendMode: "screen",
            "--reveal-x": "50%", "--reveal-y": "50%",
            WebkitMaskImage: "radial-gradient(circle 100px at var(--reveal-x) var(--reveal-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.1) 80%, transparent 100%)",
            maskImage:       "radial-gradient(circle 100px at var(--reveal-x) var(--reveal-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.1) 80%, transparent 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "1.25rem" }}>
          <p style={{ color: "#fff" }}>hero</p>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{card.name}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginTop: 2 }}>Early Access</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Joined</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{card.joined}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Member</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>#{card.num}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  width: 36, height: 36, borderRadius: "50%",
  border: "1px solid rgba(0,0,0,0.15)", display: "flex", alignItems: "center",
  justifyContent: "center", color: "#9ca3af", background: "transparent",
  cursor: "pointer", flexShrink: 0, position: "relative", zIndex: 30,
};

export function DepthCardStack({ cards = [], headline = "Get your license.", subline = "Pre-sale pricing ends soon." }) {
  const cardRefs     = useRef([]);
  const cardFaceRefs = useRef([]);
  const textureRefs  = useRef([]);
  const centerRef    = useRef(0);
  const animating    = useRef(false);
  const isHoveredRef = useRef(false);
  const timelineRef  = useRef(null);
  const [autoplayResetKey, setAutoplayResetKey] = useState(0);
  const [claimedText, setClaimedText] = useState(cards[0]?.claimedText ?? "");
  const presaleEnd = useRef(new Date(Date.now() + (2 * 86400 + 16 * 3600 + 36 * 60 + 57) * 1000));
  const countdown  = useCountdown(presaleEnd.current);
  const pad = (n) => String(n).padStart(2, "0");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const applyLayout = useCallback((animate) => {
    const total = cards.length;
    timelineRef.current?.kill();
    timelineRef.current = null;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.killTweensOf(el);
      const slot  = computeSlot(i, centerRef.current, total);
      const props = getSlotProps(slot);
      if (animate && slot !== null) gsap.to(el, { ...props, duration: 0.55, ease: "power2.inOut" });
      else gsap.set(el, props);
    });
  }, [cards]);

  useEffect(() => {
    applyLayout(false);
    const els = cardRefs.current;
    return () => { timelineRef.current?.kill(); els.forEach((el) => el && gsap.killTweensOf(el)); };
  }, [applyLayout]);

  const navigate = useCallback((dir) => {
    if (animating.current) return;
    animating.current = true;
    const total     = cards.length;
    const oldCenter = centerRef.current;
    const newCenter = ((oldCenter + dir) % total + total) % total;
    centerRef.current = newCenter;

    const oldFace    = cardFaceRefs.current[oldCenter];
    const oldTexture = textureRefs.current[oldCenter];
    if (oldFace)    { gsap.killTweensOf(oldFace);    gsap.set(oldFace,    { rotateX: 0, rotateY: 0, x: 0, y: 0 }); }
    if (oldTexture) { gsap.killTweensOf(oldTexture); gsap.set(oldTexture, { opacity: 0, "--reveal-x": "50%", "--reveal-y": "50%" }); }

    timelineRef.current?.kill();
    const tl = gsap.timeline({ onComplete: () => { animating.current = false; timelineRef.current = null; } });
    timelineRef.current = tl;

    cardRefs.current.forEach((cardEl, i) => {
      if (!cardEl) return;
      gsap.killTweensOf(cardEl);
      const oldSlot  = computeSlot(i, oldCenter, total);
      const newSlot  = computeSlot(i, newCenter, total);
      const oldProps = getSlotProps(oldSlot);
      const newProps = getSlotProps(newSlot);
      gsap.set(cardEl, oldProps);

      if (oldSlot === null && newSlot !== null) {
        gsap.set(cardEl, { ...oldProps, x: newProps.x + (newSlot > 0 ? 28 : -28), y: newProps.y - 8, scale: Math.max(newProps.scale - 0.04, 0.72), opacity: 0, zIndex: newProps.zIndex });
      }

      if (i === oldCenter) {
        const swingX = dir > 0 ? -(CARD_W * 0.9) : (CARD_W * 0.9);
        gsap.set(cardEl, { zIndex: 30 });
        tl.to(cardEl, { x: swingX, y: -10, rotateZ: dir > 0 ? -3 : 3, rotateY: dir > 0 ? -30 : 30, scale: 0.88, opacity: 1, ease: "cubic-bezier(.25,.46,.45,.94)", duration: 0.3 }, 0);
        tl.to(cardEl, { ...newProps, rotateY: 0, duration: 0.18, ease: "cubic-bezier(.32,.72,0,1)" }, 0.22);
        return;
      }

      gsap.set(cardEl, { zIndex: newSlot === 0 ? 25 : newProps.zIndex });
      tl.to(cardEl, { ...newProps, duration: 0.54, ease: "power2.inOut" }, 0.06);
    });

    setClaimedText(cards[newCenter].claimedText);
  }, [cards]);

  useEffect(() => {
    const id = setInterval(() => { if (!isHoveredRef.current) navigate(1); }, AUTO_PLAY_DELAY);
    return () => clearInterval(id);
  }, [navigate, autoplayResetKey]);

  useEffect(() => {
    const els = cardRefs.current;
    const handlers = [];

    els.forEach((cardEl, i) => {
      const cardFace  = cardFaceRefs.current[i];
      const textureEl = textureRefs.current[i];
      if (!cardEl || !cardFace || !textureEl) return;

      let enterProgress = 0, enterRaf = null;

      const handleEnter = () => {
        if (i !== centerRef.current || animating.current) return;
        isHoveredRef.current = true;
        enterProgress = 0;
        if (enterRaf) cancelAnimationFrame(enterRaf);
        const startTime = performance.now();
        const ramp = (now) => {
          enterProgress = Math.min((now - startTime) / 350, 1);
          if (enterProgress < 1) enterRaf = requestAnimationFrame(ramp); else enterRaf = null;
        };
        enterRaf = requestAnimationFrame(ramp);
      };

      const handleMove = (e) => {
        if (i !== centerRef.current || animating.current) return;
        const rect = cardEl.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const cx = rect.width / 2, cy = rect.height / 2;
        const ease = enterProgress;
        gsap.to(textureEl, { "--reveal-x": `${x}px`, "--reveal-y": `${y}px`, opacity: 0.3 * ease, duration: 0.28, ease: "power2.out", overwrite: "auto" });
        gsap.to(cardFace,  { rotateX: ((y - cy) / 20) * ease, rotateY: -(((x - cx) / 20)) * ease, x: ((x - cx) / 60) * ease, y: ((y - cy) / 60) * ease, transformPerspective: 800, transformOrigin: "center", ease: "power2.out", duration: 0.4, overwrite: "auto" });
      };

      const handleLeave = () => {
        if (i !== centerRef.current) return;
        isHoveredRef.current = false;
        if (enterRaf) { cancelAnimationFrame(enterRaf); enterRaf = null; }
        enterProgress = 0;
        gsap.to(cardFace,  { rotateX: 0, rotateY: 0, x: 0, y: 0, ease: "power3.out", duration: 0.7, overwrite: "auto" });
        gsap.to(textureEl, { opacity: 0, ease: "power2.out", duration: 0.5, overwrite: "auto" });
      };

      cardEl.addEventListener("mouseenter", handleEnter);
      cardEl.addEventListener("mousemove",  handleMove);
      cardEl.addEventListener("mouseleave", handleLeave);
      handlers.push({ cardEl, handleEnter, handleMove, handleLeave, getRaf: () => enterRaf });
    });

    return () => {
      handlers.forEach(({ cardEl, handleEnter, handleMove, handleLeave, getRaf }) => {
        cardEl.removeEventListener("mouseenter", handleEnter);
        cardEl.removeEventListener("mousemove",  handleMove);
        cardEl.removeEventListener("mouseleave", handleLeave);
        const raf = getRaf(); if (raf) cancelAnimationFrame(raf);
      });
    };
  }, []);

  return (
    <section style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5rem 1.5rem 3rem", userSelect: "none" }}>
      <p style={{ fontSize: 14, fontWeight: 500, color: "#3b82f6", marginBottom: 8 }}>Early access</p>
      <h3 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 500, textAlign: "center", lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>{headline}</h3>
      <p style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 500, textAlign: "center", color: "#9ca3af", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: "2.5rem" }}>{subline}</p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
        <button onClick={() => { navigate(-1); setAutoplayResetKey((v) => v + 1); }} style={btnStyle} aria-label="Previous card">
          <ChevronLeft />
        </button>

        <div style={{ position: "relative", flexShrink: 0, width: isMobile ? "calc(100vw - 32px)" : CARD_W + 112 * 2 + 40, height: CARD_H + 70, perspective: 900, perspectiveOrigin: "50% 50%" }}>
          {cards.map((card, i) => (
            <SliderCard key={card.num} card={card} index={i} cardRefs={cardRefs} cardFaceRefs={cardFaceRefs} textureRefs={textureRefs} />
          ))}
        </div>

        <button onClick={() => { navigate(1); setAutoplayResetKey((v) => v + 1); }} style={btnStyle} aria-label="Next card">
          <ChevronRight />
        </button>
      </div>

      <p key={claimedText} style={{ marginTop: 16, fontSize: 12, color: "#9ca3af", height: 20, animation: "dcs-fadeUp 0.4s ease forwards" }}>
        {claimedText}
      </p>

      <style>{`
        @keyframes dcs-fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
