"use client";

import React, { useEffect, useMemo, useRef } from"react";
import"./CircularSplitScroll.css";
import gsap from"gsap";
import { ScrollTrigger } from"gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function wrapProgress(value) {
 let v = value % 1;
 if (v < 0) v += 1;
 return v;
}

function getCircularPosition(progress, radiusX, radiusY, angleOffset = 0) {
 const angle = progress * Math.PI * 2 + angleOffset;
 return {
 x: Math.sin(angle) * radiusX,
 y: Math.cos(angle) * radiusY,
 };
}

export default function CircularScrollShowcase({
 items = [],
 className ="",
 sectionHeight = 260,
 leftRadiusX = 95,
 leftRadiusY = 220,
 rightRadiusX = 260,
 rightRadiusY = 260,
 imageCardWidth = 190,
 imageCardHeight = 210,
 titleSize ="clamp(28px, 3vw, 56px)",
 pinSpacing = true,
 scrub = 1.2,
}) {
 const rootRef = useRef(null);
 const stickyRef = useRef(null);
 const leftTrackRef = useRef(null);
 const rightTrackRef = useRef(null);
 const progressRef = useRef(0);

 const safeItems = useMemo(() => {
 return items.map((item, index) => ({
 id: item.id ?? index,
 title: item.title ?? `Item ${index + 1}`,
 image: item.image ??"",
 alt: item.alt ?? item.title ?? `Item ${index + 1}`,
 }));
 }, [items]);

 useEffect(() => {
 if (!rootRef.current || !stickyRef.current) return;

 const ctx = gsap.context(() => {
 const leftNodes = gsap.utils.toArray(".circular-scroll-showcase__left-item");
 const rightNodes = gsap.utils.toArray(".circular-scroll-showcase__right-item");

 const total = safeItems.length;
 if (!total) return;

 const render = (scrollP) => {
 progressRef.current = scrollP;

 leftNodes.forEach((node, index) => {
 const local = wrapProgress(index / total - scrollP);
 const pos = getCircularPosition(local, leftRadiusX, leftRadiusY, Math.PI);
 const depth = Math.cos(local * Math.PI * 2 + Math.PI);

 gsap.set(node, {
 x: pos.x,
 y: pos.y,
 zIndex: Math.round(gsap.utils.mapRange(-1, 1, 1, 30, depth)),
 });
 });

 rightNodes.forEach((node, index) => {
 const local = wrapProgress(index / total - scrollP);
 const pos = getCircularPosition(
 local,
 rightRadiusX,
 rightRadiusY,
 -Math.PI * 0.08
 );
 const depth = Math.cos(local * Math.PI * 2 - Math.PI * 0.08);

 gsap.set(node, {
 x: pos.x,
 y: pos.y,
 zIndex: Math.round(gsap.utils.mapRange(-1, 1, 1, 40, depth)),
 });
 });
 };

 render(0);

 ScrollTrigger.create({
 trigger: rootRef.current,
 start:"top top",
 end: `+=${sectionHeight * safeItems.length}%`,
 pin: stickyRef.current,
 scrub,
 pinSpacing,
 invalidateOnRefresh: true,
 onUpdate: (self) => {
 render(self.progress);
 },
 });
 }, rootRef);

 return () => ctx.revert();
 }, [
 safeItems,
 scrub,
 pinSpacing,
 sectionHeight,
 leftRadiusX,
 leftRadiusY,
 rightRadiusX,
 rightRadiusY,
 ]);

 return (
 <section
 ref={rootRef}
 className={`circular-scroll-showcase ${className}`}
 style={{
"--css-title-size": titleSize,
"--css-card-width": `${imageCardWidth}px`,
"--css-card-height": `${imageCardHeight}px`,
 }}
 >
 <div ref={stickyRef} className="circular-scroll-showcase__sticky">
 <div className="circular-scroll-showcase__inner">
 <div className="circular-scroll-showcase__left">
 <div
 ref={leftTrackRef}
 className="circular-scroll-showcase__left-track"
 >
 {safeItems.map((item) => (
 <div
 key={item.id}
 className="circular-scroll-showcase__left-item"
 >
 {item.title}
 </div>
 ))}
 </div>
 </div>

 <div className="circular-scroll-showcase__right">
 <div
 ref={rightTrackRef}
 className="circular-scroll-showcase__right-track"
 >
 {safeItems.map((item) => (
 <div
 key={item.id}
 className="circular-scroll-showcase__right-item"
 >
 <div className="circular-scroll-showcase__card">
 <img
 src={item.image}
 alt={item.alt}
 className="circular-scroll-showcase__image"
 draggable="false"
 />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </section>
 );
}