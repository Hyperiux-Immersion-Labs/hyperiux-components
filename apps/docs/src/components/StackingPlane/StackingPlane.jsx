'use client';
import { useEffect, useRef } from"react";
import Image from"next/image";
import gsap from"gsap";
import { ScrollTrigger } from"gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STACK_GAP = 10;

export default function StackingPlane({ images, bgColor ="black" }) {
 const IMAGES = images;
 const CARD_COUNT = IMAGES.length;
 const sectionRef = useRef(null);
 const stickyRef = useRef(null);
 const sceneRef = useRef(null);
 const cardRefs = useRef([]);
 const imageRefs = useRef([]);

 useEffect(() => {
 const section = sectionRef.current;
 const scene = sceneRef.current;
 const cards = cardRefs.current;

 if (!section || !scene || cards.some((c) => !c)) return;

 gsap.set(scene, {
 transformStyle:"preserve-3d",
 rotateX: 0,
 });

 cards.forEach((card, i) => {
 const stackOffsetY = -(CARD_COUNT - 1 - i) * STACK_GAP;
 gsap.set(card, {
 transformStyle:"preserve-3d",
 transformOrigin:"50% 100%",
 y: stackOffsetY,
 rotateX: 0,
 z: 0,
 opacity: 1,
 willChange:"transform, opacity",
 });

 const img = imageRefs.current[i];
 if (img) {
 gsap.set(img, {
 scale: 1,
 y: 0,
 willChange:"transform",
 });
 }
 });

 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: section,
 start:"top top",
 end:"bottom bottom",
 scrub: 1.2,
 invalidateOnRefresh: true,
 },
 });

 const peelCount = CARD_COUNT - 1;

 for (let peel = 0; peel < peelCount; peel++) {
 const cardIndex = CARD_COUNT - 1 - peel;
 const card = cards[cardIndex];
 const t = peel;

 tl.to(card, {
 rotateX: -110,
 z: 20,
 opacity: 1,
 ease:"power2.inOut",
 duration: 1,
 }, t);

 const img = imageRefs.current[cardIndex];
 if (img) {
 tl.to(img, {
 scale: 1.15,
 y: -30,
 ease:"power1.inOut",
 duration: 1,
 }, t);
 }

 if (peel !== peelCount - 1) {
 tl.to(card, {
 opacity: 0,
 duration: 0.1,
 }, t + 1.9);
 }

 for (let j = 0; j < cardIndex; j++) {
 const remainingSlot = cardIndex - 1 - j;
 tl.to(cards[j], {
 y: -remainingSlot * STACK_GAP,
 rotateX: -peel * 5,
 ease:"power2.inOut",
 duration: 1,
 }, t);
 }
 }

 return () => {
 ScrollTrigger.getAll().forEach((t) => t.kill());
 tl.kill();
 };
 }, [CARD_COUNT, IMAGES]);

 return (
 <div
 ref={sectionRef}
 style={{ height: `${CARD_COUNT * 80}vh`, backgroundColor: bgColor }}
 >
 <div
 ref={stickyRef}
 className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden max-sm:items-start max-sm:pt-32"
 >
 <div
 className="w-[min(35vw,660px)] max-sm:w-[min(75vw,300px)]"
 style={{ perspective:"900px", perspectiveOrigin:"50% 50%" }}
 >
 <div
 ref={sceneRef}
 className="relative w-full aspect-video max-sm:aspect-[unset] max-sm:h-[min(80vw,350px)]"
 >
 {IMAGES.map((src, i) => (
 <div
 key={i}
 ref={(el) => (cardRefs.current[i] = el)}
 className="absolute inset-0 overflow-hidden"
 >
 <Image
 src={src}
 ref={(el) => (imageRefs.current[i] = el)}
 alt={`card ${i + 1}`}
 fill
 sizes="(max-width: 640px) 75vw, min(30vw, 660px)"
 className="object-cover select-none pointer-events-none"
 draggable={false}
 priority={i === CARD_COUNT - 1}
 />
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}