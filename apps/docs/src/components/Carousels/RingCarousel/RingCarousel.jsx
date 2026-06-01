"use client";

import Image from"next/image";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from"react";
import gsap from"gsap";
import { Draggable } from"gsap/Draggable";
import { ArrowLeft, ArrowRight } from"lucide-react";

gsap.registerPlugin(Draggable);

const RingGallery = ({
 items = [],
 itemWidth = 700,
 itemHeight = 300,
 radius = 500,
 gap = 0,
 dragSensitivity = 0.35,
 momentum = 1,
 friction = 0.95,
 snap = true,
 className ="",
 renderItem,
 showNavigation = true,
 showDots = true,
 autoPlay = false,
 autoPlayInterval = 3000,
 pauseOnHover = true,
}) => {
 const containerRef = useRef(null);
 const ringRef = useRef(null);
 const draggerRef = useRef(null);
 const itemRefs = useRef([]);
 const momentumFrameRef = useRef(null);
 const autoplayRef = useRef(null);
 const velocityRef = useRef(0);
 const lastXRef = useRef(0);
 const isHoveredRef = useRef(false);
 const currentStepRef = useRef(0);

 const [activeIndex, setActiveIndex] = useState(0);
 const [isMobile, setIsMobile] = useState(false);

 const totalItems = items.length;
 const resolvedItemWidth = isMobile ? itemWidth * 0.88 : itemWidth;
 const resolvedItemHeight = isMobile ? itemHeight * 0.88 : itemHeight;

 const stepAngle = useMemo(() => {
 if (!totalItems) return 0;
 return 360 / totalItems;
 }, [totalItems]);

 const panelAngle = useMemo(() => {
 return stepAngle + gap;
 }, [stepAngle, gap]);

 const normalizeIndex = (index) => {
 if (!totalItems) return 0;
 return ((index % totalItems) + totalItems) % totalItems;
 };

 const stopMomentum = () => {
 if (momentumFrameRef.current) {
 cancelAnimationFrame(momentumFrameRef.current);
 momentumFrameRef.current = null;
 }
 };

 const stopAutoplay = () => {
 if (autoplayRef.current) {
 clearInterval(autoplayRef.current);
 autoplayRef.current = null;
 }
 };

 const getRotationForStep = (step) => {
 return 180 + step * stepAngle;
 };

 const setActiveFromStep = (step) => {
 setActiveIndex(normalizeIndex(step));
 };

 const rotateToStep = (step, animate = true) => {
 if (!ringRef.current || !totalItems) return;

 currentStepRef.current = step;
 setActiveFromStep(step);

 const targetRotation = getRotationForStep(step);

 if (animate) {
 gsap.to(ringRef.current, {
 rotationY: targetRotation,
 duration: 0.7,
 ease:"power3.out",
 });
 } else {
 gsap.set(ringRef.current, {
 rotationY: targetRotation,
 });
 }
 };

 const updateStepFromRotation = () => {
 if (!ringRef.current || !stepAngle) return;

 const currentRotation = Number(gsap.getProperty(ringRef.current,"rotationY"));
 const rawStep = Math.round((currentRotation - 180) / stepAngle);

 currentStepRef.current = rawStep;
 setActiveFromStep(rawStep);
 };

 const goToNext = (fromAutoplay = false) => {
 stopMomentum();

 if (!fromAutoplay) {
 stopAutoplay();
 }

 rotateToStep(currentStepRef.current + 1);
 };

 const goToPrev = () => {
 stopMomentum();
 stopAutoplay();
 rotateToStep(currentStepRef.current - 1);
 };

 const goToSlide = (targetIndex) => {
 stopMomentum();
 stopAutoplay();

 const currentStep = currentStepRef.current;
 const currentVisualIndex = normalizeIndex(currentStep);

 const forwardDistance =
 (targetIndex - currentVisualIndex + totalItems) % totalItems;
 const backwardDistance =
 (currentVisualIndex - targetIndex + totalItems) % totalItems;

 const nextStep =
 forwardDistance <= backwardDistance
 ? currentStep + forwardDistance
 : currentStep - backwardDistance;

 rotateToStep(nextStep);
 };

 const startAutoplay = () => {
 if (!autoPlay || totalItems <= 1) return;

 stopAutoplay();

 autoplayRef.current = setInterval(() => {
 if (pauseOnHover && isHoveredRef.current) return;
 goToNext(true);
 }, autoPlayInterval);
 };

 useEffect(() => {
 const mediaQuery = window.matchMedia("(max-width: 639px)");
 const updateIsMobile = () => setIsMobile(mediaQuery.matches);

 updateIsMobile();
 mediaQuery.addEventListener("change", updateIsMobile);

 return () => {
 mediaQuery.removeEventListener("change", updateIsMobile);
 };
 }, []);

 useLayoutEffect(() => {
 if (!totalItems) return;

 const ring = ringRef.current;
 const dragger = draggerRef.current;
 const panels = itemRefs.current.filter(Boolean);

 if (!ring || !dragger || !panels.length) return;

 const updateRingRotation = (deltaX) => {
 const rotationDelta = deltaX * dragSensitivity;

 gsap.set(ring, {
 rotationY: `-=${rotationDelta}`,
 });

 updateStepFromRotation();
 };

 const runMomentum = () => {
 stopMomentum();

 const animate = () => {
 velocityRef.current *= friction;

 if (Math.abs(velocityRef.current) < 0.02) {
 velocityRef.current = 0;

 if (snap && stepAngle > 0) {
 updateStepFromRotation();
 rotateToStep(currentStepRef.current);
 }

 return;
 }

 gsap.set(ring, {
 rotationY: `-=${velocityRef.current}`,
 });

 updateStepFromRotation();
 momentumFrameRef.current = requestAnimationFrame(animate);
 };

 momentumFrameRef.current = requestAnimationFrame(animate);
 };

 const ctx = gsap.context(() => {
 gsap.set(dragger, { opacity: 0 });

 currentStepRef.current = 0;

 gsap.set(ring, {
 rotationY: getRotationForStep(0),
 transformStyle:"preserve-3d",
 });

 gsap.set(panels, {
 rotateY: (i) => i * -panelAngle,
 transformOrigin: `50% 50% ${radius}px`,
 z: -radius,
 width: resolvedItemWidth,
 height: resolvedItemHeight,
 left:"50%",
 top:"50%",
 xPercent: -50,
 yPercent: -50,
 backfaceVisibility:"hidden",
 transformStyle:"preserve-3d",
 });

 gsap.from(panels, {
 duration: 1.2,
 y: 120,
 opacity: 0,
 stagger: 0.08,
 ease:"expo.out",
 });

 Draggable.create(dragger, {
 type:"x,y",
 trigger: dragger,
 onPress: function (e) {
 stopMomentum();
 stopAutoplay();

 const clientX = e.touches ? e.touches[0].clientX : e.clientX;
 lastXRef.current = clientX;
 velocityRef.current = 0;
 },
 onDrag: function (e) {
 const clientX = e.touches ? e.touches[0].clientX : e.clientX;
 const deltaX = clientX - lastXRef.current;

 updateRingRotation(deltaX);
 velocityRef.current = deltaX * momentum;
 lastXRef.current = clientX;
 },
 onRelease: function () {
 gsap.set(dragger, { x: 0, y: 0 });
 runMomentum();

 if (!(pauseOnHover && isHoveredRef.current) && autoPlay) {
 startAutoplay();
 }
 },
 });
 }, containerRef);

 return () => {
 stopMomentum();
 ctx.revert();
 };
 }, [
 totalItems,
 resolvedItemWidth,
 resolvedItemHeight,
 radius,
 panelAngle,
 dragSensitivity,
 momentum,
 friction,
 snap,
 stepAngle,
 autoPlay,
 pauseOnHover,
 autoPlayInterval,
 ]);

 useEffect(() => {
 if (autoPlay && totalItems > 1 && !(pauseOnHover && isHoveredRef.current)) {
 startAutoplay();
 } else {
 stopAutoplay();
 }

 return () => {
 stopAutoplay();
 };
 }, [autoPlay, autoPlayInterval, totalItems, pauseOnHover]);

 return (
 <div
 className={` relative h-[70vh] w-full select-none overflow-hidden bg-black ${className}`}
 ref={containerRef}
 onMouseEnter={() => {
 isHoveredRef.current = true;
 if (pauseOnHover) stopAutoplay();
 }}
 onMouseLeave={() => {
 isHoveredRef.current = false;
 if (pauseOnHover && autoPlay) startAutoplay();
 }}
 >
 <div className=" absolute left-1/2 top-[40%] h-[30vw] w-screen -translate-x-1/2 -translate-y-1/2 perspective-[2000px] transform-3d">
 <div className=" relative h-full w-full transform-3d" ref={ringRef}>
 {items.map((item, i) => {
 const isImage = typeof item ==="string";
 const imageSrc = isImage ? item : item?.src;
 const imageAlt = isImage ? `ring-item-${i}` : item?.alt || `ring-item-${i}`;

 return (
 <div
 key={i}
 className={` absolute overflow-hidden rounded-[20px] transform-3d will-change-transform ${
 activeIndex === i ?"is-active" :""
 }`}
 ref={(el) => (itemRefs.current[i] = el)}
 >
 {renderItem ? (
 renderItem(item, i)
 ) : isImage ? (
 <Image
 src={imageSrc}
 alt={imageAlt}
 fill
 sizes="(max-width: 639px) 62vw, 700px"
 className="pointer-events-none block h-full w-full select-none object-cover"
 />
 ) : imageSrc ? (
 <Image
 src={imageSrc}
 alt={imageAlt}
 fill
 sizes="(max-width: 639px) 62vw, 700px"
 className="pointer-events-none block h-full w-full select-none object-cover"
 />
 ) : (
 item
 )}
 </div>
 );
 })}
 </div>

 <div className=" absolute inset-0 z-3 cursor-grab active:cursor-grabbing" ref={draggerRef} />
 </div>

 <div className=" pointer-events-none absolute inset-0 z-2 bg-[linear-gradient(to_right,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0)_20%,rgba(0,0,0,0)_80%,rgba(0,0,0,0.95)_100%)] max-md:hidden" />

 {showNavigation && totalItems > 1 && (
 <div className=" absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 gap-3">
 <button
 type="button"
 className="flex h-[3.5vw] min-h-12 w-[3.5vw] min-w-12 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white backdrop-blur-[10px] transition-all duration-300 ease-in-out hover:bg-white/16 max-md:h-14 max-md:w-14 max-sm:h-[15vw] max-sm:w-[15vw]"
 onClick={goToPrev}
 aria-label="Previous slide"
 >
 <ArrowLeft />
 </button>

 <button
 type="button"
 className="flex h-[3.5vw] min-h-12 w-[3.5vw] min-w-12 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white backdrop-blur-[10px] transition-all duration-300 ease-in-out hover:bg-white/16 max-md:h-14 max-md:w-14 max-sm:h-[15vw] max-sm:w-[15vw]"
 onClick={() => goToNext(false)}
 aria-label="Next slide"
 >
 <ArrowRight />
 </button>
 </div>
 )}

 {showDots && totalItems > 1 && (
 <div className="absolute bottom-[15%] left-1/2 z-20 flex -translate-x-1/2 items-center gap-[1vw] rounded-full bg-white/6 px-4.5 py-3.5 backdrop-blur-[10px] max-md:bottom-[18%] max-md:gap-[2vw] max-md:px-4 max-md:py-3 max-sm:bottom-[14%] max-sm:px-3.5 max-sm:py-2.5" aria-label="Slider pagination">
 {items.map((_, index) => (
 <button
 key={index}
 type="button"
 className={`flex h-4.5 w-fit cursor-pointer items-center justify-center rounded-full bg-transparent p-0 ${
 activeIndex === index ?"is-active" :""
 }`}
 onClick={() => goToSlide(index)}
 aria-label={`Go to slide ${index + 1}`}
 >
 <span
 className={`h-2.5 w-2.5 rounded-full bg-white/42 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] max-md:h-2.25 max-md:w-2.25 max-sm:h-2 max-sm:w-2 ${
 activeIndex === index
 ? "w-10.5 bg-white/92 max-md:w-9 max-sm:w-7"
 : ""
 }`}
 />
 </button>
 ))}
 </div>
 )}
 </div>
 );
};

export default RingGallery;
