"use client";

import { useEffect, useRef } from"react";
import gsap from"gsap";
import ScrollTrigger from"gsap/ScrollTrigger";
import { useLenis } from"lenis/react";
import { SliderCard } from"./Card";

gsap.registerPlugin(ScrollTrigger);

export default function StackingCard({ data = [] }) {
 const containerRef = useRef(null);
 const cardsRef = useRef([]);

 useLenis(() => {
 ScrollTrigger.update();
 }, [], 1);

 useEffect(() => {
 cardsRef.current = cardsRef.current.slice(0, data.length);

 const ctx = gsap.context(() => {
 const cards = cardsRef.current.filter(Boolean);
 const numCards = cards.length;

 if (!numCards) return;

 cards.forEach((card, i) => {
 gsap.set(card, {
 yPercent: i === 0 ? 0 : 100,
 zIndex: i + 1,
 scale: 1,
 rotation: 0,
 rotateX: 0,
 opacity: 1,
 borderRadius: 0,
 });
 });

 const firstImage = cards[0]?.querySelector(".card-image");

 if (firstImage) {
 gsap.fromTo(
 firstImage,
 { scale: 1.5 },
 {
 scale: 1,
 ease:"power2.out",
 scrollTrigger: {
 trigger: containerRef.current,
 start:"50% bottom",
 end:"bottom 60%",
 scrub: true,
 invalidateOnRefresh: true,
 },
 }
 );
 }

 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: containerRef.current,
 start:"top top",
 end: () => `+=${Math.max(numCards - 1, 0) * window.innerHeight}`,
 scrub: true,
 invalidateOnRefresh: true,
 },
 });

 for (let i = 1; i < numCards; i++) {
 const rotateDir = (i - 1) % 2 === 0 ? -5 : 5;
 const segmentStart = i - 1;

 tl.to(
 cards[i],
 {
 yPercent: 0,
 duration: 0.55,
 ease:"none",
 },
 segmentStart
 );

 const currentImage = cards[i].querySelector(".card-image");

 if (currentImage) {
 tl.to(
 currentImage,
 {
 keyframes: [
 { scale: 1.5, ease:"none", duration: 0.16 },
 { scale: 1, ease:"none", duration: 0.39 },
 ],
 },
 segmentStart
 );
 }

 tl.to(
 cards[i - 1],
 {
 scale: 0.8,
 rotation: rotateDir,
 rotateX: 20,
 borderRadius:"3vw",
 ease:"linear",
 duration: 0.5,
 },
 segmentStart
 ).to(
 cards[i - 1],
 {
 opacity: 0,
 ease:"none",
 duration: 0.25,
 },
 segmentStart + 0.4
 );
 }

 ScrollTrigger.refresh();
 }, containerRef);

 return () => ctx.revert();
 }, [data]);

 return (
 <section
 className="relative z-0 h-[var(--stack-height)] w-full"
 style={{"--stack-height": `${data.length * 100}vh` }}
 >
 <div
 ref={containerRef}
 className="sticky top-0 h-screen w-screen overflow-hidden bg-black"
 style={{ perspective:"1200px" }}
 >
 {data.map((item, i) => (
 <div
 key={item.id}
 ref={(el) => {
 if (el) cardsRef.current[i] = el;
 }}
 className="absolute inset-0 overflow-hidden"
 >
 <SliderCard {...item} />
 </div>
 ))}
 </div>
 </section>
 );
}
