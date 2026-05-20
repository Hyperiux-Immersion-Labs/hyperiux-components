"use client";
import React, { useEffect, useRef } from"react";
import { gsap, Expo } from"gsap";
import"./base.css";
import { useMouse } from"../hooks/useMouse";

const ImagesAnimation = ({
 enableRotation = true,
 idleSpawn = true,
 idleDelay = 300,
 cursorOffsetX = -12,
 cursorOffsetY = -12,
 popOutDuration = 1,
 fadeOutDuration = 0.7,
 imageMultiplier = 3,
 idlePopOutMultiplier = 1.8,
 idleFadeMultiplier = 1.5,
}) => {
 const baseImageCount = 20;
 const totalImages = baseImageCount * imageMultiplier;

 const contentRef = useRef(null);
 const imagesRef = useRef([]);
 const rafRef = useRef(null);
 const idleTimerRef = useRef(null);

 const { mouse, smoothMouse } = useMouse({
 smooth: true,
 lerpFactor: 0.1,
 });

 const lastTriggerPos = useRef({ x: 0, y: 0 });
 const lastIdleSpawnPos = useRef({ x: -9999, y: -9999 });
 const zIndexVal = useRef(1);
 const imgPosition = useRef(0);
 const threshold = 100;

 const getMouseDistance = () => {
 const a = mouse.current;
 const b = lastTriggerPos.current;
 return Math.hypot(a.x - b.x, a.y - b.y);
 };

 const getIdleDistance = () => {
 const a = mouse.current;
 const b = lastIdleSpawnPos.current;
 return Math.hypot(a.x - b.x, a.y - b.y);
 };

 const getCenteredPosition = (width, height, useSmooth = false) => {
 const source = useSmooth ? smoothMouse.current : mouse.current;

 return {
 x: source.x - width / 2 + cursorOffsetX,
 y: source.y - height / 2 + cursorOffsetY,
 };
 };

 const showNextImage = ({
 useSmoothStart = true,
 lockToCursor = false,
 isIdle = false,
 } = {}) => {
 const img = imagesRef.current[imgPosition.current];
 if (!img) return;

 const width = img.offsetWidth;
 const height = img.offsetHeight;

 gsap.killTweensOf(img);

 const startRotation = enableRotation ? gsap.utils.random(-35, 35) : 0;
 const exitRotation = enableRotation ? gsap.utils.random(-15, 15) : 0;

 const startPos = lockToCursor
 ? getCenteredPosition(width, height, false)
 : getCenteredPosition(width, height, true);

 const endPos = getCenteredPosition(width, height, false);

 const finalPopOutDuration = isIdle
 ? popOutDuration * idlePopOutMultiplier
 : popOutDuration;

 const finalFadeOutDuration = isIdle
 ? fadeOutDuration * idleFadeMultiplier
 : fadeOutDuration;

 gsap
 .timeline()
 .set(img, {
 opacity: 1,
 scale: 0.2,
 rotateZ: startRotation,
 zIndex: zIndexVal.current,
 x: useSmoothStart ? startPos.x : endPos.x,
 y: useSmoothStart ? startPos.y : endPos.y,
 })
 .to(img, {
 ease: isIdle ?"power1.out" : Expo.easeOut,
 rotateZ: 0,
 opacity: 1,
 scale: 1,
 duration: finalPopOutDuration,
 x: endPos.x,
 y: endPos.y,
 })
 .to(img, {
 ease:"power4.inOut",
 opacity: 0,
 rotateZ: exitRotation,
 duration: finalFadeOutDuration,
 delay: -finalFadeOutDuration,
 scale: 0,
 });

 zIndexVal.current++;
 imgPosition.current = (imgPosition.current + 1) % imagesRef.current.length;
 };

 const scheduleIdleSpawn = () => {
 if (!idleSpawn) return;

 if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

 idleTimerRef.current = setTimeout(() => {
 const idleDistance = getIdleDistance();

 if (idleDistance < 2) {
 showNextImage({
 useSmoothStart: false,
 lockToCursor: true,
 isIdle: true,
 });
 }

 lastIdleSpawnPos.current = { ...mouse.current };
 scheduleIdleSpawn();
 }, idleDelay);
 };

 const render = () => {
 const distance = getMouseDistance();

 if (distance > threshold) {
 showNextImage({
 useSmoothStart: true,
 lockToCursor: false,
 isIdle: false,
 });

 lastTriggerPos.current = { ...mouse.current };
 lastIdleSpawnPos.current = { ...mouse.current };

 if (idleSpawn) {
 scheduleIdleSpawn();
 }
 }

 const allInactive = imagesRef.current.every(
 (img) => img && !gsap.isTweening(img) && img.style.opacity ==="0"
 );

 if (allInactive) {
 zIndexVal.current = 1;
 }

 rafRef.current = requestAnimationFrame(render);
 };

 useEffect(() => {
  rafRef.current = requestAnimationFrame(render);

  if (idleSpawn) {
   scheduleIdleSpawn();
  }

  return () => {
   if (rafRef.current) cancelAnimationFrame(rafRef.current);
   if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  };
 }, [idleSpawn, idleDelay]);

 return (
  <div
   className="content"
   ref={contentRef}
   style={{
    position:"relative",
    width:"100%",
    height:"100vh",
    overflow:"hidden",
   }}
  >
   {Array.from({ length: totalImages }).map((_, i) => {
    const baseImageIndex = (i % baseImageCount) + 1;

    return (
     <img
      key={i}
      className="content__img"
      src={`/img/${baseImageIndex}.png`}
      alt={`Trail ${baseImageIndex}`}
      ref={(el) => {
       if (el) imagesRef.current[i] = el;
      }}
     />
    );
   })}
 </div>
 );
};

export default ImagesAnimation;