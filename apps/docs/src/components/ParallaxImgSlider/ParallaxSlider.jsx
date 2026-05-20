"use client";

import { useRef, useEffect } from"react";
import Image from"next/image";
import gsap from"gsap";
import { ScrollTrigger } from"gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// vw units
const SLIDE_WIDE = 65;
const SLIDE_NARROW = 33;
const SLIDE_HEIGHT = 43;
const GAP = 1.6;
const PAD_X ="5vw";

export default function ParallaxImgSlider({ images = [], bgColor ="#000000" }) {
 const outerRef = useRef(null);
 const trackRef = useRef(null);

 /** Dynamic height */
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

 /** GSAP logic */
 useEffect(() => {
 const outer = outerRef.current;
 const track = trackRef.current;
 if (!outer || !track) return;

 const ctx = gsap.context(() => {
 /** Main horizontal animation */
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

 /** Clip-path reveal */
 const slideWrappers = gsap.utils.toArray(".slide-wrapper");

 gsap.fromTo(
 slideWrappers,
 { clipPath:"inset(0 100% 0 0)" },
 {
 clipPath:"inset(0 0% 0 0)",
 ease:"power3.inOut",
 duration: 0.6,
  scrollTrigger: {
 trigger: outer,
 start:"5% bottom",
 toggleActions:"play none none none",
 // markers: true,
 },
 }
 );

 /** Individual parallax per image */
 const slides = gsap.utils.toArray(".parallax-img");

 slides.forEach((el) => {
 gsap.fromTo(
 el,
 { x:"-25%", scale: 1.25 },
 {
 x:"25%",
 scale: 1.25,
 ease:"none",
 scrollTrigger: {
 trigger: el,
 containerAnimation: horizontalTween,
 start:"left right",
 end:"right left",
 scrub: true,
 },
 }
 );
 });
 }, outer);

 return () => ctx.revert();
 }, [images]);

 return (
 <div
 ref={outerRef}
 className="relative"
 style={{ height:"400vh", backgroundColor: bgColor }}
 >
 <div className="sticky top-0 h-screen overflow-hidden flex items-center">
 <div
 ref={trackRef}
 className="flex items-center will-change-transform"
 style={{
 gap: `${GAP}vw`,
 paddingLeft: PAD_X,
 paddingRight: PAD_X,
 }}
 >
 {images.map((src, i) => {
 const isWide = i % 2 === 0;
 const width = isWide ? SLIDE_WIDE : SLIDE_NARROW;
 const slideClass = isWide
 ?"max-sm:w-[80vw] max-sm:h-[50vh] w-[65vw] h-[43vw]"
 :"max-sm:w-[45vw] max-sm:h-[50vh] w-[33vw] h-[43vw]";

 return (
 <div
 key={src}
 className={`slide-wrapper relative shrink-0 overflow-hidden ${slideClass}`}
 style={{
 borderRadius: 0,
 clipPath:"inset(0 100% 0 0)",
 }}
 >
 <Image
 src={src}
 alt={`Slide ${i + 1}`}
 fill
 sizes={`${width}vw`}
 className="object-cover parallax-img"
 priority={i < 3}
 draggable={false}
 />

 <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
 </div>
 );
 })}
 </div>
 </div>
 </div>
 );
}