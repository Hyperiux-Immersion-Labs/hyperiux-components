"use client";

import { useLayoutEffect, useRef, useState } from"react";
import gsap from"gsap";



export default function TextMarquee({ items = [] }) {
 if (!items.length) return null;
 const trackRef = useRef(null);
 const contentRef = useRef(null);
 const containerRef = useRef(null);
 const [copyCount, setCopyCount] = useState(2);
 const metricsRef = useRef({
 currentY: 0,
 distance: 0,
 currentVelocity: 0.6,
 targetVelocity: 0.6,
 lastScrollDirection: 1,
 });
 const scrollTimeoutRef = useRef(null);

 useLayoutEffect(() => {
 const track = trackRef.current;
 const content = contentRef.current;
 const container = containerRef.current;

 if (!track || !content || !container) {
 return undefined;
 }

 const ctx = gsap.context(() => {
 const baseSpeed = 0.6;
 const maxBoost = 12;
 let lastScrollY = window.scrollY;

 const startAnimation = () => {
 const distance = content.offsetHeight;
 const containerHeight = container.offsetHeight;

 if (!distance || !containerHeight) {
 return;
 }

 const nextCopyCount = Math.max(2, Math.ceil(containerHeight / distance) + 2);
 setCopyCount((currentCount) =>
 currentCount === nextCopyCount ? currentCount : nextCopyCount
 );

 metricsRef.current.distance = distance;

 if (metricsRef.current.currentY <= -distance) {
 metricsRef.current.currentY += distance;
 } else if (metricsRef.current.currentY > 0) {
 metricsRef.current.currentY -= distance;
 }

 gsap.set(track, { y: metricsRef.current.currentY });
 };

 const tick = (_, deltaTime) => {
 const { distance } = metricsRef.current;

 if (!distance) {
 return;
 }

 const frameFactor = deltaTime / (1000 / 60);
 metricsRef.current.currentVelocity = gsap.utils.interpolate(
 metricsRef.current.currentVelocity,
 metricsRef.current.targetVelocity,
 0.14
 );
 metricsRef.current.currentY +=
 metricsRef.current.currentVelocity * frameFactor;

 if (metricsRef.current.currentY <= -distance) {
 metricsRef.current.currentY += distance;
 } else if (metricsRef.current.currentY >= 0) {
 metricsRef.current.currentY -= distance;
 }

 gsap.set(track, { y: metricsRef.current.currentY });
 };

 const applyScrollMotion = (delta) => {
 if (!delta) {
 return;
 }

 const direction = delta > 0 ? -1 : 1;
 const boost = Math.min(maxBoost, baseSpeed + Math.pow(Math.abs(delta), 1.2) * 0.08);

 metricsRef.current.lastScrollDirection = direction;
 metricsRef.current.targetVelocity = direction * boost;

 window.clearTimeout(scrollTimeoutRef.current);
 scrollTimeoutRef.current = window.setTimeout(() => {
 metricsRef.current.targetVelocity =
 metricsRef.current.lastScrollDirection * baseSpeed;
 }, 120);
 };

 const handleWheel = (event) => {
 applyScrollMotion(event.deltaY);
 };

 const handleScroll = () => {
 const nextScrollY = window.scrollY;
 const delta = nextScrollY - lastScrollY;
 lastScrollY = nextScrollY;
 applyScrollMotion(delta);
 };

 startAnimation();
 gsap.ticker.add(tick);

 const resizeObserver = new ResizeObserver(startAnimation);
 resizeObserver.observe(content);
 resizeObserver.observe(container);
 window.addEventListener("resize", startAnimation);
 window.addEventListener("wheel", handleWheel, { passive: true });
 window.addEventListener("scroll", handleScroll, { passive: true });

 return () => {
 resizeObserver.disconnect();
 window.removeEventListener("resize", startAnimation);
 window.removeEventListener("wheel", handleWheel);
 window.removeEventListener("scroll", handleScroll);
 window.clearTimeout(scrollTimeoutRef.current);
 gsap.ticker.remove(tick);
 };
 });

 return () => ctx.revert();
 }, []);

 return (
 <div className="flex h-screen">

 <div className="w-[45%] flex max-sm:w-[30%] items-center justify-end pr-2">
 <p className="max-sm:text-xl text-4xl font-extralight leading-none whitespace-nowrap">
 Hyperiux
 </p>
 </div>

 {/* Right half — scrolling marquee with hard-edge vertical mask */}
 <div
 ref={containerRef}
 className="relative w-[55%] max-sm:w-[70%] h-full overflow-hidden"
 style={{
 maskImage:
"linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 48%, rgba(0,0,0,1) 48%, rgba(0,0,0,1) 53%, rgba(0,0,0,0.3) 53%, rgba(0,0,0,0.3) 100%)",
 WebkitMaskImage:
"linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 48%, rgba(0,0,0,1) 48%, rgba(0,0,0,1) 53%, rgba(0,0,0,0.2) 53%, rgba(0,0,0,0.2) 100%)",
 }}
 >
 <div
 ref={trackRef}
 className="absolute left-0 top-0 flex flex-col max-sm:text-xl text-4xl font-extralight leading-none"
 >
 {Array.from({ length: copyCount }, (_, copyIndex) => (
 <div
 key={copyIndex}
 ref={copyIndex === 0 ? contentRef : null}
 className="flex flex-col"
 aria-hidden={copyIndex === 1}
 >
 {items.map((text, i) => (
 <div
 key={`${copyIndex}-${i}`}
 className="py-1 whitespace-nowrap pl-2"
 >
 {text}
 </div>
 ))}
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}