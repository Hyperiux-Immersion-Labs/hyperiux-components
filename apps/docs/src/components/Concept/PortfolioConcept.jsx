"use client";

import gsap from"gsap";
import React, { useEffect, useRef } from"react";
import ScrollTrigger from"gsap/dist/ScrollTrigger";
import SplitText from"gsap/dist/SplitText";
import Image from"next/image";
import Link from"next/link";

gsap.registerPlugin(ScrollTrigger, SplitText);

const IMAGE_POOL = [
 "/assets/gradient/image1.png",
 "/assets/gradient/image2.png",
 "/assets/gradient/image3.png",
 "/assets/gradient/image4.png",
 "/assets/gradient/image5.png",
 "/assets/gradient/image6.png",
 "/assets/gradient/image7.png",
 "/assets/gradient/image8.png",
 "/assets/gradient/image9.png",
 "/assets/gradient/image10.png",
 "/assets/gradient/image11.png",
 "/assets/gradient/image12.png",
 "/assets/gradient/image13.png",
 "/assets/gradient/image14.png",
 "/assets/gradient/image15.png",
 "/assets/dark/image01.png",
 "/assets/dark/image02.png",
 "/assets/dark/image03.png",
 "/assets/dark/image04.png",
 "/assets/dark/image05.png",
 "/assets/dark/image06.png",
 "/assets/dark/image07.png",
 "/assets/dark/image08.png",
 "/assets/dark/image09.png",
 "/assets/dark/image10.png",
 "/assets/dark/image11.png",
 "/assets/dark/image12.png",
 "/assets/dark/image13.png",
 "/assets/dark/image14.png",
 "/assets/dark/image15.png",
 "/assets/dark/image16.png",
 "/assets/dark/image17.png",
 "/assets/dark/image18.png",
 "/assets/dark/image19.png",
 "/assets/dark/image20.png",
 "/assets/dark/image21.png",
];

const PROJECT_NAMES = [
 "Nebula Drift",
 "Velvet Orbit",
 "Prism Bloom",
 "Midnight Aurora",
 "Chromatic Tide",
 "Ion Garden",
 "Lunar Gradient",
 "Violet Haze",
 "Echo Spectrum",
 "Noir Fluence",
 "Solar Jelly",
 "Plasma Atelier",
 "Hyperwave Studio",
 "Glassline",
 "Starlit Systems",
 "Pulse & Grain",
 "Arclight",
 "Soft Collision",
];

function buildCards(count, startIndex = 0) {
 return Array.from({ length: count }, (_, i) => {
 const idx = (startIndex + i) % IMAGE_POOL.length;
 const name = PROJECT_NAMES[(startIndex + i) % PROJECT_NAMES.length];
 return { src: IMAGE_POOL[idx], title: name, href: "#" };
 });
}

const allCards = buildCards(22, 0);
const leftCards = allCards.slice(0, 8);
const midCards = allCards.slice(8, 14);
const rightCards = allCards.slice(14, 22);

const sectionBreakText = `Design is a feeling before it’s a layout. This concept explores
motion-first composition, gradient-led art direction, and small details
that make a brand experience unforgettable.`;

const PortfolioConcept = () => {
 const headingRef = useRef(null);
 const paragraphRef = useRef(null);
 const sectionBreakFillRef = useRef(null);
 const titleRefs = useRef([]);
 const hoverSplitsRef = useRef([]);

 useEffect(() => {
 const ctx = gsap.context(() => {
 const headingSplit = new SplitText(headingRef.current, {
 type:"chars,lines",
 linesClass:"split-line",
 mask:"lines",
 });

 const paragraphSplit = new SplitText(paragraphRef.current, {
 type:"lines",
 linesClass:"split-line",
 mask:"lines",
 });

 const sectionBreakSplit = new SplitText(sectionBreakFillRef.current, {
 type:"lines",
 linesClass:"section-break-line",
 });

 gsap.set(headingSplit.lines, { yPercent: 0 });
 gsap.set(paragraphSplit.lines, { yPercent: 0 });

 gsap.set(".mid-strip", { yPercent: -80, scale: 0.5 });
 gsap.set(".left-strip", { yPercent: 3, scale: 0.5 });
 gsap.set(".right-strip", { yPercent: 3, scale: 0.5 });

 gsap.set(sectionBreakSplit.lines, {
 color:"transparent",
 backgroundImage:
"linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%)",
 backgroundRepeat:"no-repeat",
 backgroundSize:"0% 100%",
 backgroundPosition:"left center",
 WebkitBackgroundClip:"text",
 backgroundClip:"text",
 });

 const allTitles = titleRefs.current.filter(Boolean);

 hoverSplitsRef.current = allTitles.map((el) => {
 const split = new SplitText(el, {
 type:"chars",
 charsClass:"project-char",
 });

 gsap.set(split.chars, {
 yPercent: 120,
 opacity: 0,
 force3D: true,
 });

 return split;
 });

 const cards = gsap.utils.toArray(".project-card");

 cards.forEach((card, index) => {
 const split = hoverSplitsRef.current[index];
 const image = card.querySelector(".project-image");

 if (!split || !image) return;

 gsap.set(image, {
 force3D: true,
 scale: 1,
 });

 const onEnter = () => {
 gsap.killTweensOf(image);
 gsap.killTweensOf(split.chars);

 // gsap.to(image, {
 // scale: 1.2,
 // duration: 0.5,
 // ease:"power3.inOut",
 // overwrite: true,
 // });

 gsap.to(split.chars, {
 yPercent: 0,
 opacity: 1,
 stagger: 0.02,
 duration: 0.45,
 ease:"power3.out",
 overwrite: true,
 });
 };

 const onLeave = () => {
 gsap.killTweensOf(image);
 gsap.killTweensOf(split.chars);

 // gsap.to(image, {
 // scale: 1,
 // duration: 0.5,
 // ease:"power3.inOut",
 // overwrite: true,
 // });

 gsap.to(split.chars, {
 yPercent: 120,
 opacity: 0,
 stagger: 0.015,
 duration: 0.35,
 ease:"power3.in",
 overwrite: true,
 });
 };

 card.addEventListener("mouseenter", onEnter);
 card.addEventListener("mouseleave", onLeave);

 card._onEnter = onEnter;
 card._onLeave = onLeave;
 });

 const introTl = gsap.timeline({
 scrollTrigger: {
 trigger:"#portfolio-concept",
 start:"top top",
 end:"10% top",
 scrub: true,
 },
 });

 introTl.to(
 headingSplit.chars,
 {
 yPercent: -100,
 duration: 1.2,
 stagger: 0.02,
 ease:"power3.inOut",
 },
 0,
 );

 introTl.to(
 paragraphSplit.lines,
 {
 yPercent: -100,
 duration: 1.2,
 stagger: 0.06,
 ease:"power3.inOut",
 },
 0.1,
 );

 const tl = gsap.timeline({
 scrollTrigger: {
 trigger:"#portfolio-concept",
 start:"3% top",
 end:"bottom bottom",
 scrub: true,
 },
 });

 tl.to(".left-strip", { yPercent: -77, scale: 1 }, 0);
 tl.to(".mid-strip", { yPercent: -4.5, scale: 1 }, 0);
 tl.to(".right-strip", { yPercent: -77, scale: 1 }, 0);
 tl.to(".card-1", {
 yPercent: -100,
 duration: 0.3,
 ease:"power3.inOut",
 });
 tl.to(
".card-2",
 {
 yPercent: 100,
 duration: 0.3,
 ease:"power3.inOut",
 },
"<",
 );
 tl.to(
".left-strip",
 {
 xPercent: -170,
 duration: 0.3,
 ease:"power3.inOut",
 },
"<",
 );
 tl.to(
".right-strip",
 {
 xPercent: 170,
 duration: 0.3,
 ease:"power3.inOut",
 },
"<",
 );

 const sectionBreakTl = gsap.timeline({
 scrollTrigger: {
 trigger:"#portfolio-concept",
 start:"65% top",
 end:"bottom bottom",
 scrub: true,
 // markers: true,
 },
 });

 sectionBreakTl.from(".section-break-wrapper", {
 scale: 0.7,
 opacity: 0,
 duration: 3,
 ease:"power3.inOut",
 });

 sectionBreakTl.to(sectionBreakSplit.lines, {
 backgroundSize:"100% 100%",
 stagger: 0.45,
 ease:"none",
 delay: -1,
 });

 return () => {
 cards.forEach((card) => {
 if (card._onEnter) {
 card.removeEventListener("mouseenter", card._onEnter);
 }
 if (card._onLeave) {
 card.removeEventListener("mouseleave", card._onLeave);
 }
 });

 hoverSplitsRef.current.forEach((split) => split?.revert());
 headingSplit.revert();
 paragraphSplit.revert();
 sectionBreakSplit.revert();
 };
 });

 return () => ctx.revert();
 }, []);

 let titleIndex = 0;

 return (
 <div
 className="w-screen h-[1000vh] bg-white text-[#1a1a1a]"
 id="portfolio-concept"
 >
 <div className="w-screen h-screen sticky top-0 flex items-center px-[10vw]">
 <div className="w-full flex justify-between">
 <h2
 ref={headingRef}
 className="text-[4vw] font-medium w-fit leading-[1]"
 >
 Gradient Portfolio Concept
 </h2>

 <p ref={paragraphRef} className="text-[1.5vw] w-[40%] font-medium">
 A scroll-led showcase where every project tile is a living gradient.
 Hover to reveal names, then let the strips glide past each other for a
 gallery that feels more like motion design than a grid.
 </p>
 </div>
 </div>

 <div className="w-screen h-screen sticky top-0 flex justify-between px-[7vw] mt-[-100vh] portfolio-card-container z-[2]">
 <div className="w-[23vw] h-fit flex flex-col gap-[4vw] items-center left-strip">
 {leftCards.map((item, index) => {
 const currentIndex = titleIndex++;

 return (
 <Link
 href={item.href}
 key={`left-${index}`}
 className="project-card w-[90%] h-[27vw] portfolio-card overflow-hidden drop-shadow-md relative"
 >
 <Image
 src={item.src}
 alt={item.title}
 width={400}
 height={600}
 className="project-image w-full h-full object-cover hover:brightness-75 transition duration-500 cursor-pointer hover:scale-[1.2] ease-in-out"
 />

 <div className="absolute bottom-[5%] left-[5%] overflow-hidden pointer-events-none">
 <p
 ref={(el) => {
 titleRefs.current[currentIndex] = el;
 }}
 className="text-white text-[2vw] project-name font-medium leading-none"
 >
 {item.title}
 </p>
 </div>
 </Link>
 );
 })}
 </div>

 <div className="w-[28%] h-fit flex flex-col gap-[7vw] items-center mid-strip">
 {midCards.map((item, index) => {
 const currentIndex = titleIndex++;

 return (
 <Link
 href={item.href}
 key={`mid-${index}`}
 className={`project-card w-[90%] h-[34vw] portfolio-card overflow-hidden drop-shadow-md relative ${
 index === 0 ?"card-1" :""
 } ${index === 1 ?"card-2" :""}`}
 >
 <Image
 src={item.src}
 alt={item.title}
 width={500}
 height={700}
 className="project-image w-full h-full object-cover hover:brightness-75 transition duration-500 cursor-pointer hover:scale-[1.2] ease-in-out"
 />

 <div className="absolute bottom-[5%] left-[5%] overflow-hidden pointer-events-none">
 <p
 ref={(el) => {
 titleRefs.current[currentIndex] = el;
 }}
 className="text-white text-[2.2vw] project-name font-medium leading-none"
 >
 {item.title}
 </p>
 </div>
 </Link>
 );
 })}
 </div>

 <div className="w-[23vw] h-fit flex flex-col gap-[4vw] items-center right-strip">
 {rightCards.map((item, index) => {
 const currentIndex = titleIndex++;

 return (
 <Link
 href={item.href}
 key={`right-${index}`}
 className="project-card w-[90%] h-[27vw] portfolio-card overflow-hidden drop-shadow-md relative"
 >
 <Image
 src={item.src}
 alt={item.title}
 width={400}
 height={600}
 className="project-image w-full h-full object-cover hover:brightness-75 transition duration-500 cursor-pointer hover:scale-[1.2] ease-in-out"
 />

 <div className="absolute bottom-[5%] left-[5%] overflow-hidden pointer-events-none">
 <p
 ref={(el) => {
 titleRefs.current[currentIndex] = el;
 }}
 className="text-white text-[2vw] project-name font-medium leading-none"
 >
 {item.title}
 </p>
 </div>
 </Link>
 );
 })}
 </div>
 </div>

 <div className="w-screen h-screen sticky top-0 section-break text-[3.5vw] leading-[1.2] flex justify-center items-center">
 <div className="w-[75%] text-center relative section-break-wrapper">
 <p className="font-medium text-black/20">{sectionBreakText}</p>

 <p
 ref={sectionBreakFillRef}
 className="section-break-content font-medium absolute inset-0 pointer-events-none"
 aria-hidden="true"
 >
 {sectionBreakText}
 </p>
 </div>
 </div>
 </div>
 );
};

export default PortfolioConcept;
