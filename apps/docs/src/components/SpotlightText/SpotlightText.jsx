"use client";

import { useEffect, useRef, useState } from"react";

export default function SpotlightText({
 text ="",
 className ="",
 size ="text-3xl md:text-5xl",
 align ="center",
}) {
 const containerRef = useRef(null);

 const target = useRef({ x: 0, y: 0 });
 const current = useRef({ x: 0, y: 0 });
 const targetOpacity = useRef(0);
 const currentOpacity = useRef(0);
 const isInside = useRef(false);

 const [isMobile, setIsMobile] = useState(false);

 const lerp = (start, end, factor) => start + (end - start) * factor;


 useEffect(() => {
 const checkMobile = () => {
 const isTouch = window.matchMedia("(pointer: coarse)").matches;
 const isSmallScreen = window.innerWidth < 768;
 setIsMobile(isTouch || isSmallScreen);
 };

 checkMobile();

 window.addEventListener("resize", checkMobile);
 return () => window.removeEventListener("resize", checkMobile);
 }, []);

 useEffect(() => {
 if (isMobile) return; // ❌ disable effect on mobile

 const el = containerRef.current;
 let raf;

 const updateTarget = (e) => {
 const rect = el.getBoundingClientRect();

 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;

 target.current.x = x;
 target.current.y = y;
 };

 const handleEnter = (e) => {
 updateTarget(e);
 current.current.x = target.current.x;
 current.current.y = target.current.y;
 isInside.current = true;
 targetOpacity.current = 1;
 };

 const handleMove = (e) => {
 updateTarget(e);
 };

 const handleLeave = () => {
 isInside.current = false;
 targetOpacity.current = 0;
 };

 const animate = () => {
 current.current.x = lerp(current.current.x, target.current.x, 0.08);
 current.current.y = lerp(current.current.y, target.current.y, 0.08);
 currentOpacity.current = lerp(currentOpacity.current, targetOpacity.current, 0.12);

 el.style.setProperty("--x", `${current.current.x}px`);
 el.style.setProperty("--y", `${current.current.y}px`);
 el.style.setProperty("--opacity", `${currentOpacity.current}`);

 raf = requestAnimationFrame(animate);
 };

 animate();

 el.addEventListener("mouseenter", handleEnter);
 el.addEventListener("mousemove", handleMove);
 el.addEventListener("mouseleave", handleLeave);

 return () => {
 cancelAnimationFrame(raf);
 el.removeEventListener("mouseenter", handleEnter);
 el.removeEventListener("mousemove", handleMove);
 el.removeEventListener("mouseleave", handleLeave);
 };
 }, [isMobile]);

 const alignment =
 align ==="center"
 ?"text-center"
 : align ==="right"
 ?"text-right"
 :"text-left";

 return (
 <section className={`w-full ${className}`}>
 <div
 ref={containerRef}
 className={`relative font-semibold ${size} ${alignment}`}
 style={
 isMobile
 ? {}
 : {
"--x":"0px",
"--y":"0px",
"--opacity": 0,
 }
 }
 >
 {/* Dim text (mobile becomes fully visible) */}
 <p className="text-neutral-600 max-sm:text-white leading-tight whitespace-pre-wrap">
 {text}
 </p>

 {/* Spotlight (disabled on mobile) */}
 {!isMobile && (
 <p
 className="pointer-events-none absolute inset-0 text-white leading-tight whitespace-pre-wrap"
 style={{
 WebkitMaskImage: `
 radial-gradient(
 circle 220px at var(--x) var(--y),
 rgba(255,255,255,1) 0%,
 rgba(255,255,255,0.85) 25%,
 rgba(255,255,255,0.5) 50%,
 rgba(255,255,255,0.2) 70%,
 rgba(255,255,255,0.05) 85%,
 transparent 100%
 )
 `,
 maskImage: `
 radial-gradient(
 circle 220px at var(--x) var(--y),
 rgba(255,255,255,1) 0%,
 rgba(255,255,255,0.85) 25%,
 rgba(255,255,255,0.5) 50%,
 rgba(255,255,255,0.2) 70%,
 rgba(255,255,255,0.05) 85%,
 transparent 100%
 )
 `,
 opacity:"var(--opacity)",
 }}
 >
 {text}
 </p>
 )}
 </div>
 </section>
 );
}
