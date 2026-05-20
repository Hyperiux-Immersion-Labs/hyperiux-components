"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from"react";
import"./InfiniteScrollSlider.css";

const defaultImages = [
"/img/1.png",
"/img/2.png",
"/img/3.png",
"/img/4.png",
"/img/5.png",
"/img/6.png",
];

export default function InfiniteScroller({
 images = defaultImages,
 itemWidth = 350,
 itemHeight = 640,
 gap = 72,
 intensity = 0.78,
 friction = 0.92,
 maxVelocity = 48,
 enableFocus = true,
 focusPoint = 0.25,
 focusSpread = 0.52,
 focusedZ = 60,
 unfocusedZ = -520,
 floatAmplitudePercent = 2.2,
 waveSpeed = 0.0016,
 wavePhaseStep = 0.38,
 floatVelocityInfluence = 0.98,
 maxFloatBoost = 10.5,
 floatBoostLerp = 0.05,
 className ="",
}) {
 const sectionRef = useRef(null);
 const itemRefs = useRef([]);
 const rafRef = useRef(null);

 const progressRef = useRef(0);
 const velocityRef = useRef(0);
 const floatBoostRef = useRef(0);
 const spanRef = useRef(itemWidth + gap);
 const readyRef = useRef(false);

 const [isReady, setIsReady] = useState(false);

 const repeatedImages = useMemo(() => [...images, ...images, ...images], [images]);

 const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

 const wrap = (value, min, max) => {
 const range = max - min;
 let v = value;
 while (v < min) v += range;
 while (v >= max) v -= range;
 return v;
 };

 const lerp = (a, b, t) => a + (b - a) * t;
 const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
 const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

 const setItemRef = (el, index) => {
 itemRefs.current[index] = el;
 };

 useLayoutEffect(() => {
 spanRef.current = itemWidth * 0.5;
 progressRef.current = images.length * spanRef.current * 2.2;
 readyRef.current = true;
 setIsReady(true);
 }, [images.length, itemWidth, gap]);

 useEffect(() => {
 const onWheel = (e) => {
 if (!readyRef.current) return;
 velocityRef.current += e.deltaY * intensity;
 velocityRef.current = clamp(velocityRef.current, -maxVelocity, maxVelocity);
 };

 window.addEventListener("wheel", onWheel, { passive: true });
 return () => window.removeEventListener("wheel", onWheel);
 }, [intensity, maxVelocity]);

 useEffect(() => {
 const animate = (time) => {
 if (!readyRef.current || !sectionRef.current) {
 rafRef.current = requestAnimationFrame(animate);
 return;
 }

 const viewportWidth = sectionRef.current.offsetWidth;
 const viewportHeight = sectionRef.current.offsetHeight;

 const span = spanRef.current;
 const baseCount = images.length;
 const stripWidth = baseCount * span;

 progressRef.current += velocityRef.current;
 velocityRef.current *= friction;

 if (Math.abs(velocityRef.current) < 0.02) velocityRef.current = 0;

 const targetFloatBoost = Math.min(
 Math.abs(velocityRef.current) * floatVelocityInfluence,
 maxFloatBoost
 );

 floatBoostRef.current = lerp(
 floatBoostRef.current,
 targetFloatBoost,
 floatBoostLerp
 );

 progressRef.current = wrap(progressRef.current, 0, stripWidth * 3);

 const leftBound = -span * 0.6;
 const rightBound = viewportWidth + span * 0.6;
 const visibleRange = rightBound - leftBound;

 itemRefs.current.forEach((item, index) => {
 if (!item) return;

 const worldX = index * span - progressRef.current;
 const wrappedX = wrap(worldX, -stripWidth, stripWidth * 2);
 const x = wrappedX + viewportWidth * 0.5;

 const rawT = (x - leftBound) / visibleRange;
 const t = clamp(rawT, 0, 1);

 const yProgress = easeOutCubic(t);
 const rotProgress = easeInOutSine(t);

 const baseY = lerp(180, -110, yProgress);
 const rotateY = lerp(50, 65, rotProgress);
 const rotateZ = lerp(-2, 1.2, t);

 let depthStrength = 1;

 if (enableFocus) {
 const distanceFromFocus = Math.abs(t - focusPoint) / focusSpread;
 depthStrength = clamp(1 - distanceFromFocus, 0, 1);
 }

 const z = enableFocus
 ? lerp(unfocusedZ, focusedZ, depthStrength)
 : focusedZ;

 const motionTilt = clamp(velocityRef.current * 0.14, -6, 6);

 const dynamicFloatAmplitude =
 floatAmplitudePercent * (1 + floatBoostRef.current);

 const basePhaseIndex = index % images.length;

 const floatOffsetPercent =
 Math.sin(time * waveSpeed + basePhaseIndex * wavePhaseStep) *
 dynamicFloatAmplitude;

 item.style.width = `${itemWidth}px`;
 item.style.height = `${itemHeight}px`;
 item.style.transform = `
 translate3d(${x}px, ${viewportHeight * 0.5 + baseY}px, ${z}px)
 translate(-50%, -50%)
 translateY(${floatOffsetPercent}%)
 rotateY(${-rotateY + motionTilt}deg)
 rotateZ(${rotateZ}deg)
 `;
 item.style.zIndex = enableFocus
 ? `${Math.round(depthStrength * 1000)}`
 :"1";
 item.style.opacity ="1";
 item.style.filter ="none";
 });

 rafRef.current = requestAnimationFrame(animate);
 };

 rafRef.current = requestAnimationFrame(animate);
 return () => cancelAnimationFrame(rafRef.current);
 }, [
 images.length,
 itemWidth,
 itemHeight,
 friction,
 enableFocus,
 focusPoint,
 focusSpread,
 focusedZ,
 unfocusedZ,
 floatAmplitudePercent,
 waveSpeed,
 wavePhaseStep,
 floatVelocityInfluence,
 maxFloatBoost,
 floatBoostLerp,
 ]);

 return (
 <section
 ref={sectionRef}
 className={`surf-strip ${isReady ?"is-ready" :""} ${className}`}
 >
 <div className="surf-strip__viewport">
 <div className="surf-strip__track">
 {repeatedImages.map((src, index) => (
 <article
 key={`${src}-${index}`}
 ref={(el) => setItemRef(el, index)}
 className="surf-strip__card"
 >
 <img src={src} alt={`surf-card-${index + 1}`} draggable="false" />
 </article>
 ))}
 </div>
 </div>
 </section>
 );
}