"use client";

import { useEffect, useRef, useState, useCallback } from"react";
import { gsap } from"gsap";
import { ChevronLeft, ChevronRight } from"lucide-react";
import SliderCard from"./SliderCard";

const CARD_W = 300;
const CARD_H = 450;
const AUTO_PLAY_DELAY = 5000;

function getSlotProps(slot) {
 switch (slot) {
 case 0:
 return { x: 0, y: 0, rotateX: 0, rotateZ: 0, rotateY: 0, scale: 1, opacity: 1, zIndex: 20 };
 case 1:
 return { x: 20, y: -20, rotateX: 0, rotateZ: 2, rotateY: 0, scale: 0.9, opacity: 1, zIndex: 10 };
 case 2:
 return { x: 35, y: -40, rotateX: 0, rotateZ: 4, rotateY: 0, scale: 0.83, opacity: 0.9, zIndex: 8 };
 case -1:
 return { x: -20, y: -20, rotateX: 0, rotateZ: -2, rotateY: 0, scale: 0.9, opacity: 1, zIndex: 10 };
 case -2:
 return { x: -35, y: -40, rotateX: 0, rotateZ: -4, rotateY: 0, scale: 0.83, opacity: 0.9, zIndex: 8 };
 default:
 return { x: 0, y: -30, rotateX: 0, rotateZ: 0, rotateY: 0, scale: 0.75, opacity: 0, zIndex: 0 };
 }
}

function computeSlot(cardIdx, centerIdx, total) {
 const rel = ((cardIdx - centerIdx) % total + total) % total;
 if (rel === 0) return 0;
 if (rel === 1) return 1;
 if (rel === 2) return 2;
 if (rel === total - 1) return -1;
 if (rel === total - 2) return -2;
 return null;
}

function useCountdown(targetDate) {
 const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
 useEffect(() => {
 const tick = () => {
 const diff = Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000));
 setTime({
 d: Math.floor(diff / 86400),
 h: Math.floor((diff % 86400) / 3600),
 m: Math.floor((diff % 3600) / 60),
 s: diff % 60,
 });
 };
 tick();
 const id = setInterval(tick, 1000);
 return () => clearInterval(id);
 }, [targetDate]);
 return time;
}

export default function CardSlider({ cards }) {
 const cardRefs = useRef([]);
 const cardFaceRefs = useRef([]);
 const textureRefs = useRef([]);
 const centerRef = useRef(0);
 const animating = useRef(false);
 const isHoveredRef = useRef(false);
 const timelineRef = useRef(null);
 const [autoplayResetKey, setAutoplayResetKey] = useState(0);
 const [claimedText, setClaimedText] = useState(cards[0].claimedText);
 const presaleEnd = useRef(new Date(Date.now() + (2 * 86400 + 16 * 3600 + 36 * 60 + 57) * 1000));
 const countdown = useCountdown(presaleEnd.current);
 const pad = (n) => String(n).padStart(2,"0");
 const [isMobile, setIsMobile] = useState(false);

 useEffect(() => {
 const check = () => {
 setIsMobile(window.innerWidth <= 640);
 };
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
 const slot = computeSlot(i, centerRef.current, total);
 const props = getSlotProps(slot);
 if (animate && slot !== null) {
 gsap.to(el, { ...props, duration: 0.55, ease:"power2.inOut" });
 } else {
 gsap.set(el, props);
 }
 });
 }, [cards]);

 useEffect(() => {
 applyLayout(false);
 const cards = cardRefs.current;

 return () => {
 timelineRef.current?.kill();
 timelineRef.current = null;
 cards.forEach((el) => el && gsap.killTweensOf(el));
 };
 }, [applyLayout]);

 const navigate = useCallback((dir) => {
 if (animating.current) return;
 animating.current = true;

 const total = cards.length;
 const oldCenter = centerRef.current;
 const newCenter = ((oldCenter + dir) % total + total) % total;
 centerRef.current = newCenter;

 const oldFace = cardFaceRefs.current[oldCenter];
 const oldTexture = textureRefs.current[oldCenter];
 if (oldFace) {
 gsap.killTweensOf(oldFace);
 gsap.set(oldFace, { rotateX: 0, rotateY: 0, x: 0, y: 0 });
 }
 if (oldTexture) {
 gsap.killTweensOf(oldTexture);
 gsap.set(oldTexture, { opacity: 0,"--reveal-x":"50%","--reveal-y":"50%" });
 }

 timelineRef.current?.kill();

 const tl = gsap.timeline({
 onComplete: () => {
 animating.current = false;
 timelineRef.current = null;
 },
 });
 timelineRef.current = tl;

 cardRefs.current.forEach((cardEl, i) => {
 if (!cardEl) return;

 gsap.killTweensOf(cardEl);

 const oldSlot = computeSlot(i, oldCenter, total);
 const newSlot = computeSlot(i, newCenter, total);
 const oldProps = getSlotProps(oldSlot);
 const newProps = getSlotProps(newSlot);

 gsap.set(cardEl, oldProps);

 if (oldSlot === null && newSlot !== null) {
 gsap.set(cardEl, {
 ...oldProps,
 x: newProps.x + (newSlot > 0 ? 28 : -28),
 y: newProps.y - 8,
 scale: Math.max(newProps.scale - 0.04, 0.72),
 opacity: 0,
 zIndex: newProps.zIndex,
 });
 }

 if (i === oldCenter) {
 const swingX = dir > 0 ? -(CARD_W * 0.9) : (CARD_W * 0.9);
 const swingRotateY = dir > 0 ? -30 : 30;

 gsap.set(cardEl, { zIndex: 30 });
 tl.to(cardEl, {
 x: swingX,
 y: -10,
 rotateZ: dir > 0 ? -3 : 3,
 rotateY: swingRotateY,
 scale: 0.88,
 opacity: 1,
 ease:"cubic-bezier(.25, .46, .45, .94)",
 duration: 0.3,
 }, 0);
 tl.to(cardEl, {
 ...newProps,
 rotateY: 0,
 duration: 0.18,
 ease:"cubic-bezier(.32, .72, 0, 1)",
 }, 0.22);
 return;
 }

 gsap.set(cardEl, { zIndex: newSlot === 0 ? 25 : newProps.zIndex });
 tl.to(cardEl, {
 ...newProps,
 duration: 0.54,
 ease:"power2.inOut",
 }, 0.06);
 });

 setClaimedText(cards[newCenter].claimedText);
 }, [cards]);

 useEffect(() => {
 const autoplayId = setInterval(() => {
 if (isHoveredRef.current) return;
 navigate(1);
 }, AUTO_PLAY_DELAY);

 return () => clearInterval(autoplayId);
 }, [navigate, autoplayResetKey]);

 useEffect(() => {
 const cards = cardRefs.current;
 const handlers = [];

 cards.forEach((cardEl, i) => {
 const cardFace = cardFaceRefs.current[i];
 const textureEl = textureRefs.current[i];
 if (!cardEl || !cardFace || !textureEl) return;

 // Track per-card enter progress so first mousemove eases in gently
 let enterProgress = 0;
 let enterRaf = null;

 const handleEnter = (e) => {
 if (i !== centerRef.current || animating.current) return;
 isHoveredRef.current = true;
 enterProgress = 0;

 // Cancel any in-flight enter ramp
 if (enterRaf) cancelAnimationFrame(enterRaf);

 // Smoothly ramp enterProgress from 0 → 1 over ~350ms
 const startTime = performance.now();
 const RAMP_DURATION = 350;

 const ramp = (now) => {
 enterProgress = Math.min((now - startTime) / RAMP_DURATION, 1);
 if (enterProgress < 1) enterRaf = requestAnimationFrame(ramp);
 else enterRaf = null;
 };
 enterRaf = requestAnimationFrame(ramp);
 };

 const handleMove = (e) => {
 if (i !== centerRef.current || animating.current) return;

 const rect = cardEl.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;
 const centerX = rect.width / 2;
 const centerY = rect.height / 2;

 // Scale tilt & shift by enterProgress so first frames are subtle
 const ease = enterProgress;
 const rotateX = ((y - centerY) / 20) * ease;
 const rotateY = -(((x - centerX) / 20)) * ease;
 const moveX = ((x - centerX) / 60) * ease;
 const moveY = ((y - centerY) / 60) * ease;

 gsap.to(textureEl, {
"--reveal-x": `${x}px`,
"--reveal-y": `${y}px`,
 opacity: 0.3 * ease,
 duration: 0.28,
 ease:"power2.out",
 overwrite:"auto",
 });
 gsap.to(cardFace, {
 rotateX,
 rotateY,
 x: moveX,
 y: moveY,
 transformPerspective: 800,
 transformOrigin:"center",
 ease:"power2.out",
 duration: 0.4,
 overwrite:"auto",
 });
 };

 const handleLeave = () => {
 if (i !== centerRef.current) return;
 isHoveredRef.current = false;

 // Cancel any enter ramp still running
 if (enterRaf) {
 cancelAnimationFrame(enterRaf);
 enterRaf = null;
 }
 enterProgress = 0;

 gsap.to(cardFace, {
 rotateX: 0,
 rotateY: 0,
 x: 0,
 y: 0,
 ease:"power3.out",
 duration: 0.7,
 overwrite:"auto",
 });
 gsap.to(textureEl, {
 opacity: 0,
 ease:"power2.out",
 duration: 0.5,
 overwrite:"auto",
 });
 };

 cardEl.addEventListener("mouseenter", handleEnter);
 cardEl.addEventListener("mousemove", handleMove);
 cardEl.addEventListener("mouseleave", handleLeave);
 handlers.push({ cardEl, handleEnter, handleMove, handleLeave, getRaf: () => enterRaf });
 });

 return () => {
 handlers.forEach(({ cardEl, handleEnter, handleMove, handleLeave, getRaf }) => {
 cardEl.removeEventListener("mouseenter", handleEnter);
 cardEl.removeEventListener("mousemove", handleMove);
 cardEl.removeEventListener("mouseleave", handleLeave);
 const raf = getRaf();
 if (raf) cancelAnimationFrame(raf);
 });
 };
 }, []);

 return (
 <section className="flex flex-col items-center px-6 pt-20 pb-12 select-none bg-white">
<p className="text-sm font-medium text-blue-500 mb-2">
  Hyperiux-UI Library
</p>

<h3 className="text-5xl font-medium text-center mb-2 leading-none tracking-tight text-gray-900">
  Build futuristic interfaces.
</h3>

<p className="text-5xl text-center text-gray-400 leading-none tracking-tight mb-10">
  Crafted for modern web experiences.
</p>

 <div className="max-sm:grid max-sm:grid-cols-2 max-sm:place-items-center max-sm:gap-4 flex items-center justify-center">
 <button
 onClick={() => {
 navigate(-1);
 setAutoplayResetKey((value) => value + 1);
 }}
 className="max-sm:hidden w-9 h-9 rounded-full border cursor-pointer border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors shrink-0 relative z-30"
 aria-label="Previous card"
 >
 <ChevronLeft size={16} strokeWidth={2} />
 </button>

 <div
 className="relative shrink-0 max-sm:row-start-1 max-sm:col-span-2"
 style={{
 width: isMobile
 ? window.innerWidth - 32
 : CARD_W + 112 * 2 + 40,
 height: CARD_H + 70,
 perspective: 900,
 perspectiveOrigin:"50% 50%",
 }}
 >
 {cards.map((card, i) => (
 <SliderCard
 key={card.num}
 card={card}
 index={i}
 cardRefs={cardRefs}
 cardFaceRefs={cardFaceRefs}
 textureRefs={textureRefs}
 />
 ))}
 </div>

 <button
 onClick={() => {
 navigate(1);
 setAutoplayResetKey((value) => value + 1);
 }}
 className="max-sm:hidden w-9 h-9 cursor-pointer rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors shrink-0 relative z-30"
 aria-label="Next card"
 >
 <ChevronRight size={16} strokeWidth={2} />
 </button>
 </div>
 <div className="hidden max-sm:flex items-center justify-center gap-3 mt-4">
 <button
 onClick={() => {
 navigate(-1);
 setAutoplayResetKey((value) => value + 1);
 }}
 className="w-10 h-10 rounded-full border border-gray-200  flex items-center justify-center text-gray-400 hover:bg-gray-100  transition-colors"
 aria-label="Previous card"
 >
 <ChevronLeft size={18} strokeWidth={2} />
 </button>

 <button
 onClick={() => {
 navigate(1);
 setAutoplayResetKey((value) => value + 1);
 }}
 className="w-10 h-10 rounded-full border border-gray-200  flex items-center justify-center text-gray-400 hover:bg-gray-100  transition-colors"
 aria-label="Next card"
 >
 <ChevronRight size={18} strokeWidth={2} />
 </button>
 </div>

 <p
 key={claimedText}
 className="mt-4 text-xs text-gray-400 h-5"
 style={{ animation:"fadeUp 0.4s ease forwards" }}
 >
 {claimedText}
 </p>

 <style>{`
 @keyframes fadeUp {
 from { opacity: 0; transform: translateY(6px); }
 to { opacity: 1; transform: translateY(0); }
 }
 `}</style>
 </section>
 );
}