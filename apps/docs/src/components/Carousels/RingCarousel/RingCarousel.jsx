"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from"react";
import gsap from"gsap";
import { Draggable } from"gsap/Draggable";
import { ArrowLeft, ArrowRight } from"lucide-react";
import"./RingGallery.css";

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

 const totalItems = items.length;

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
 width: itemWidth,
 height: itemHeight,
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
 itemWidth,
 itemHeight,
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
 className={`ring-gallery ${className}`}
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
 <div className="ring-gallery__container">
 <div className="ring-gallery__ring" ref={ringRef}>
 {items.map((item, i) => {
 const isImage = typeof item ==="string";

 return (
 <div
 key={i}
 className={`ring-gallery__item ${activeIndex === i ?"is-active" :""}`}
 ref={(el) => (itemRefs.current[i] = el)}
 >
 {renderItem ? (
 renderItem(item, i)
 ) : isImage ? (
 <img
 src={item}
 alt={`ring-item-${i}`}
 className="ring-gallery__image"
 draggable={false}
 />
 ) : (
 item
 )}
 </div>
 );
 })}
 </div>

 <div className="ring-gallery__dragger" ref={draggerRef} />
 </div>

 <div className="ring-gallery__vignette" />

 {showNavigation && totalItems > 1 && (
 <div className="ring-gallery__nav">
 <button
 type="button"
 className="ring-gallery__btn"
 onClick={goToPrev}
 aria-label="Previous slide"
 >
 <ArrowLeft />
 </button>

 <button
 type="button"
 className="ring-gallery__btn"
 onClick={() => goToNext(false)}
 aria-label="Next slide"
 >
 <ArrowRight />
 </button>
 </div>
 )}

 {showDots && totalItems > 1 && (
 <div className="ring-gallery__pagination" aria-label="Slider pagination">
 {items.map((_, index) => (
 <button
 key={index}
 type="button"
 className={`ring-gallery__pagination-slot ${
 activeIndex === index ?"is-active" :""
 }`}
 onClick={() => goToSlide(index)}
 aria-label={`Go to slide ${index + 1}`}
 >
 <span className="ring-gallery__pagination-indicator" />
 </button>
 ))}
 </div>
 )}
 </div>
 );
};

export default RingGallery;