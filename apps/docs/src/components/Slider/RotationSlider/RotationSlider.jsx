"use client";
import React, { useRef, useEffect, useLayoutEffect } from"react";

const useIsomorphicLayoutEffect = typeof window !=='undefined' ? useLayoutEffect : useEffect;
import gsap from"gsap";
import { ScrollTrigger } from"gsap/ScrollTrigger";
import { SplitText } from"gsap/SplitText";
import RotationCard from"./RotationCard";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function RotationSlider({ images }) {
 const outerRef = useRef(null);
 const trackRef = useRef(null);
 const cardsRef = useRef([]);
 const wrappersRef = useRef([]);
 const textsRef = useRef([]);

 useEffect(() => {
 const outer = outerRef.current;
 const track = trackRef.current;
 if (!outer || !track) return;

 const update = () => {
 const travel = track.scrollWidth - window.innerWidth;
 outer.style.height = `${travel + window.innerHeight}px`;
 };

 update();
 const ro = new ResizeObserver(update);
 ro.observe(track);
 window.addEventListener("resize", update);

 return () => {
 ro.disconnect();
 window.removeEventListener("resize", update);
 };
 }, [images]);

 useIsomorphicLayoutEffect(() => {
 const outer = outerRef.current;
 const track = trackRef.current;
 if (!outer || !track) return;

 let ctx = gsap.context(() => {
 const horizontalTween = gsap.to(track, {
 x: () => -(track.scrollWidth - window.innerWidth),
 ease:"none",
 scrollTrigger: {
 trigger: outer,
 start:"top top",
 end: () => `+=${track.scrollWidth - window.innerWidth}`,
 scrub: 1,
 invalidateOnRefresh: true,
 },
 });

 let activeIndex = -1;

 const animateTextIn = (index) => {
 if (activeIndex === index) return;

 if (activeIndex !== -1 && textsRef.current[activeIndex]) {
 const prevText = textsRef.current[activeIndex];
 gsap.killTweensOf(prevText.querySelectorAll("div"));
 gsap.to(prevText, { opacity: 0, duration: 0.3 });
 }

 activeIndex = index;
 const currentText = textsRef.current[index];
 if (currentText && currentText.innerText.trim() !=="") {
 gsap.set(currentText, { opacity: 1 });
 const split = new SplitText(currentText, { type:"chars,words" });

 gsap.fromTo(split.chars,
 { opacity: 0, y: 20 },
 { opacity: 1, y: 0, duration: 0.4, stagger: 0.01, ease:"power2.out", onComplete: () => split.revert() }
 );
 }
 };

 cardsRef.current.forEach((card, index) => {
 const wrapper = wrappersRef.current[index];
 if (!card || !wrapper) return;

 const total = images.length;
 const mid = Math.floor(total / 2);
 const step = 10; // vh
 let offset;
 if (index < mid) {
 offset = -((mid - index) * step);
 } else {
 offset = (index - mid + 1) * step;
 }

 const rotateXValue = offset < 0 ? 5 : -5;

 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: wrapper,
 containerAnimation: horizontalTween,
 start:"left 90%", // starts when left of card wrapper hits 90% of viewport width
 end:"right 10%", // finishes when right of card wrapper hits 10% of viewport width
 scrub: true,
 // markers: true,
 },
 });

 ScrollTrigger.create({
 trigger: wrapper,
 containerAnimation: horizontalTween,
 start:"center 55%",
 end:"center 45%",
 onEnter: () => animateTextIn(index),
 onEnterBack: () => animateTextIn(index),
 });

 // Phase 1: Enter screen from right -> straight in the middle
 tl.fromTo(card,
 {
 rotateY: -100,
 rotateX: rotateXValue,
 opacity: 0.8,
 y: `${offset}vh`,
 },
 {
 rotateY: 0,
 rotateX: 0,
 opacity: 1,
 y: 0,
 ease:"none",
 }
 )

 // .set(card, {
 // transformOrigin:"left center",
 // })

 // Phase 2: Middle -> Exit offscreen to the left
 .to(card, {
 rotateY: 80,
 opacity: 0.9,
 y: `${-offset}vh`,
 ease:"none",
 });
 });

 // Force GSAP to apply all initial scroll calculations immediately before the first paint
 ScrollTrigger.refresh();
 });

 return () => ctx.revert();
 }, [images]);

 return (
 <div
 ref={outerRef}
 className="relative bg-white"
 >
 <div className="fixed bottom-10 left-10 z-50 pointer-events-none">
 {images.map((img, i) => (
 <div
 key={i}
 ref={(el) => (textsRef.current[i] = el)}
 className="absolute bottom-0 left-0 text-2xl whitespace-nowrap opacity-0 text-neutral-900"
 >
 {img.text || `Image ${i + 1}`}
 </div>
 ))}
 </div>
 <div
 className="sticky top-0 h-screen overflow-hidden flex items-center perspective-distant"
 style={{ perspective:"1200px" }}
 >
 <div
 ref={trackRef}
 className="flex items-center will-change-transform h-full"
 style={{
 transformStyle:"preserve-3d",
 gap:"5vw",
 paddingLeft:"31vw", // Centers the first item (31vw + 38vw/2 = 50vw)
 paddingRight:"31vw", // Centers the last item
 }}
 >
 {images.map((img, i) => (
 <div
 key={i}
 ref={(el) => (wrappersRef.current[i] = el)}
 className="relative shrink-0 w-[38vw] h-[45vh] flex items-center justify-center"
 style={{ transformStyle:"preserve-3d" }}
 >
 <RotationCard
 ref={(el) => (cardsRef.current[i] = el)}
 src={img.src}
 index={i}
 total={images.length}
 />
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}