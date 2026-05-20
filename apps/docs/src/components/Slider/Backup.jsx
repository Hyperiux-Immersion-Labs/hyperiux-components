"use client";
import React, { useEffect, useState, useRef } from"react";
import gsap from"gsap";
import SplitText from"gsap/dist/SplitText";

gsap.registerPlugin(SplitText);

export default function ClippathSlider({ slides = [] }) {
 const [currentSlide, setCurrentSlide] = useState(0);
 const [isTransitioning, setIsTransitioning] = useState(false);
 const [nextSlideIndex, setNextSlideIndex] = useState(0);

 const textRef = useRef(null);
 const canvasRef = useRef(null);
 const nextImgRef = useRef(null);
 const autoPlayTimerRef = useRef(null);
 const splitRef = useRef(null);
 const rafRef = useRef(null);

 // ✅ AUTO PLAY
 useEffect(() => {
 if (isTransitioning || slides.length === 0) return;
 autoPlayTimerRef.current = setTimeout(() => {
 nextSlideNav();
 }, 5000);
 return () => clearTimeout(autoPlayTimerRef.current);
 }, [currentSlide, isTransitioning]);

 // ✅ TEXT IN
 useEffect(() => {
 if (!textRef.current) return;
 requestAnimationFrame(() => {
 if (splitRef.current) {
 splitRef.current.revert();
 splitRef.current = null;
 }
 const split = new SplitText(".about-slider-text", {
 type:"lines",
 linesClass:"lines",
 mask:"lines",
 });
 splitRef.current = split;
 gsap.from(split.lines, {
 yPercent: 100,
 opacity: 0,
 stagger: 0.05,
 duration: 0.5,
 ease:"power2.out",
 });
 });
 }, [currentSlide]);

 // ✅ FADE OUT TEXT
 const fadeOutText = () => {
 return new Promise((resolve) => {
 if (!textRef.current) return resolve();
 gsap.killTweensOf(textRef.current);
 gsap.to(textRef.current, {
 opacity: 0,
 duration: 0.3,
 ease:"power1.out",
 onComplete: () => {
 if (splitRef.current) {
 splitRef.current.revert();
 splitRef.current = null;
 }
 resolve();
 },
 });
 });
 };

 // ✅ CANVAS SWEEP ANIMATION
 const runSweepAnimation = (nextIndex) => {
 return new Promise((resolve) => {
 const canvas = canvasRef.current;
 if (!canvas) return resolve();

 const ctx = canvas.getContext("2d");
 const W = canvas.width;
 const H = canvas.height;

 // Pre-load the next slide image onto an offscreen image
 const img = new Image();
 img.src = slides[nextIndex].image;

 const animate = () => {
 const duration = 900; // ms
 const start = performance.now();

 // Easing: cubic ease in-out
 const ease = (t) =>
 t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

 const cx = W / 2;
 const cy = H / 2;
 // Radius large enough to cover all 4 corners from center
 const R = Math.sqrt(cx * cx + cy * cy) + 10;

 const tick = (now) => {
 const t = Math.min((now - start) / duration, 1);
 const e = ease(t);
 const sweepAngle = e * Math.PI; // 0 → 180deg

 ctx.clearRect(0, 0, W, H);

 // Draw next image clipped to the two sweeping arcs
 ctx.save();

 // Build combined pie path: right half (clockwise) + left half (counter-clockwise)
 ctx.beginPath();
 // Right arc: 12 o'clock → clockwise → 6 o'clock
 ctx.moveTo(cx, cy);
 ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + sweepAngle, false);
 ctx.closePath();

 ctx.moveTo(cx, cy);
 // Left arc: 12 o'clock → counter-clockwise → 6 o'clock
 ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 - sweepAngle, true);
 ctx.closePath();

 ctx.clip("evenodd");

 // Draw the next slide image inside the clipped region
 if (img.complete) {
 // Cover the canvas like background-size: cover
 const iW = img.naturalWidth || W;
 const iH = img.naturalHeight || H;
 const scale = Math.max(W / iW, H / iH);
 const dw = iW * scale;
 const dh = iH * scale;
 const dx = (W - dw) / 2;
 const dy = (H - dh) / 2;
 ctx.drawImage(img, dx, dy, dw, dh);
 } else {
 // Fallback solid fill while image loads
 ctx.fillStyle ="#888";
 ctx.fillRect(0, 0, W, H);
 }

 ctx.restore();

 if (t < 1) {
 rafRef.current = requestAnimationFrame(tick);
 } else {
 ctx.clearRect(0, 0, W, H);
 resolve();
 }
 };

 rafRef.current = requestAnimationFrame(tick);
 };

 // Start immediately or wait briefly for image
 if (img.complete) {
 animate();
 } else {
 img.onload = animate;
 img.onerror = animate; // still animate even if image fails
 }
 });
 };

 // ✅ SLIDE CHANGE
 const changeSlide = async (newIndex) => {
 if (isTransitioning || slides.length === 0) return;

 setIsTransitioning(true);
 clearTimeout(autoPlayTimerRef.current);
 if (rafRef.current) cancelAnimationFrame(rafRef.current);

 // Resize canvas to match container
 const canvas = canvasRef.current;
 if (canvas) {
 canvas.width = canvas.offsetWidth;
 canvas.height = canvas.offsetHeight;
 }

 setNextSlideIndex(newIndex);

 // Fade text out, then run sweep
 await fadeOutText();
 await runSweepAnimation(newIndex);

 setCurrentSlide(newIndex);
 gsap.set(textRef.current, { opacity: 1 });
 setIsTransitioning(false);
 };

 const nextSlideNav = () =>
 changeSlide((currentSlide + 1) % slides.length);

 const prevSlideNav = () =>
 changeSlide((currentSlide - 1 + slides.length) % slides.length);

 if (slides.length === 0) return null;

 return (
 <section className="relative w-screen h-screen overflow-hidden">
 {/* BG — current slide */}
 <div
 className="absolute inset-0 bg-cover bg-center"
 style={{ backgroundImage: `url('${slides[currentSlide].image}')` }}
 />

 {/* Canvas overlay — draws the sweep animation on top */}
 <canvas
 ref={canvasRef}
 className="absolute inset-0 z-10 w-full h-full pointer-events-none"
 />

 <div className="absolute inset-0 bg-black/20" />

 {/* Click layer */}
 <div
 className="absolute inset-0 z-20 cursor-none"
 onClick={(e) => {
 if (isTransitioning) return;
 const isLeft = e.clientX < window.innerWidth / 2;
 isLeft ? prevSlideNav() : nextSlideNav();
 }}
 />

 {/* TEXT */}
 <div
 ref={textRef}
 className="absolute left-[35%] w-[60%] top-[75%] -translate-y-1/2 flex flex-col gap-3 text-white z-30"
 >
 <h2 className="text-[3.5vw] font-bold about-slider-text">
 {slides[currentSlide].name}
 </h2>

 <div className="flex justify-between">
 <div className="flex gap-4">
 {slides[currentSlide].tags?.map((tag, i) => (
 <p key={i} className="text-[2vw] about-slider-text">
 {tag}
 </p>
 ))}
 </div>

 <p className="text-[1.3vw] max-w-[50%] about-slider-text">
 {slides[currentSlide].description}
 </p>
 </div>
 </div>
 </section>
 );
}