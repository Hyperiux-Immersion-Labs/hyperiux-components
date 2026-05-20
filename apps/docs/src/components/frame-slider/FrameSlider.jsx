"use client";

import { useEffect, useRef, useState, useCallback } from"react";
import Image from"next/image";
import gsap from"gsap";
import { ScrollTrigger } from"gsap/ScrollTrigger";
import { useLenis } from"lenis/react";

gsap.registerPlugin(ScrollTrigger);

const SCALE_OFFSCREEN = 1.2;
const ROTATION_DEG = 6;
const SCALE_CENTER = 1.0;

const FRAME_W = 500;
const FRAME_H = 600;
const SLIDE_W = FRAME_W;
const THUMB_W = 190;
const THUMB_H = 260;
const THUMB_GAP = 12;
const THUMB_ITEM = THUMB_W + THUMB_GAP;

const VH_PER_SLIDE = 100;

// Mobile constants
const MOBILE_FRAME_W = 280;
const MOBILE_FRAME_H = 340;
const MOBILE_SLIDE_W = MOBILE_FRAME_W;
const MOBILE_THUMB_W = 100;
const MOBILE_THUMB_H = 136;
const MOBILE_THUMB_GAP = 8;
const MOBILE_THUMB_ITEM = MOBILE_THUMB_W + MOBILE_THUMB_GAP;

export default function ScrollFrameSlider({ images = [], bgColor ="#000000" }) {

 const slides = images.map((src, i) => ({
 id: `slide-${i}`,
 src,
 type:"image",
 }));

 const total = slides.length;

 const [activeIndex, setActiveIndex] = useState(0);
 const [isMobile, setIsMobile] = useState(false);

 const sectionRef = useRef(null);
 const galleryRef = useRef(null);
 const itemInnerRefs = useRef([]);
 const thumbLeftRef = useRef(null);
 const thumbRightRef = useRef(null);

 const lenis = useLenis();

 // Responsive values
 const frameW = isMobile ? MOBILE_FRAME_W : FRAME_W;
 const frameH = isMobile ? MOBILE_FRAME_H : FRAME_H;
 const slideW = isMobile ? MOBILE_SLIDE_W : SLIDE_W;
 const thumbW = isMobile ? MOBILE_THUMB_W : THUMB_W;
 const thumbH = isMobile ? MOBILE_THUMB_H : THUMB_H;
 const thumbGap = isMobile ? MOBILE_THUMB_GAP : THUMB_GAP;
 const thumbItem = isMobile ? MOBILE_THUMB_ITEM : THUMB_ITEM;

 const applyPosition = useCallback((pos) => {
 if (!galleryRef.current) return;

 const tx = -pos * slideW;
 galleryRef.current.style.transform = `translate3d(${tx}px, 0px, 0px)`;

 itemInnerRefs.current.forEach((el, i) => {
 if (!el) return;
 const dist = i - pos;
 const absDist = Math.abs(dist);

 const maxRot = ROTATION_DEG;
 const rot = dist > 0
 ? Math.min(absDist, 1) * maxRot
 : -Math.min(absDist, 1) * maxRot;

 const scale = SCALE_CENTER + Math.min(absDist, 1) * (SCALE_OFFSCREEN - SCALE_CENTER);

 el.style.transform = `rotate(${rot}deg) scale(${scale})`;
 });

 const leftThumbTx = -pos * thumbItem;
 const rightThumbTx = -(pos + 1) * thumbItem;

 if (thumbLeftRef.current) {
 thumbLeftRef.current.style.transform = `translate3d(${leftThumbTx}px, -50%, 0px)`;
 }
 if (thumbRightRef.current) {
 thumbRightRef.current.style.transform = `translate3d(${rightThumbTx}px, -50%, 0px)`;
 }

 const rounded = Math.round(pos);
 setActiveIndex(Math.max(0, Math.min(total - 1, rounded)));
 }, [total, slideW, thumbItem]);

 useEffect(() => {
 if (total <= 1) {
 applyPosition(0);
 return;
 }

 const section = sectionRef.current;
 if (!section) return;

 const snapValues = Array.from({ length: total }, (_, i) =>
 i / (total - 1)
 );

 const st = ScrollTrigger.create({
 trigger: section,
 start:"top top",
 end:"bottom bottom",
 snap: {
 snapTo: snapValues,
 duration: { min: 0.2, max: 0.5 },
 ease:"power2.inOut",
 delay: 0,
 inertia: false,
 onStart: () => {
 lenis.stop();
 },
 onComplete: () => {
 lenis?.start();
 },
 },
 onUpdate: (self) => {
 const pos = self.progress * (total - 1);
 applyPosition(pos);
 },
 });

 applyPosition(0);

 return () => {
 st.kill();
 lenis?.start();
 };
 }, [applyPosition, total, lenis]);

 // Detect mobile screen size
 useEffect(() => {
 const checkMobile = () => {
 setIsMobile(window.innerWidth < 640);
 };

 checkMobile();
 window.addEventListener("resize", checkMobile);
 return () => window.removeEventListener("resize", checkMobile);
 }, []);

 return (
 <section
 ref={sectionRef}
 className="relative"
 style={{ height: `${total * VH_PER_SLIDE}vh`, background: bgColor }}
 >
 <div
 className="sticky top-0 w-full h-screen overflow-hidden select-none"
 style={{ background: bgColor }}
 >
 {/* Slide counter */}
 <div
 className="absolute"
 style={{
 top: isMobile ? 20 : 36,
 right: isMobile ? 16 : 40,
 fontFamily:"'DM Sans', sans-serif",
 fontSize: isMobile ? 9 : 11,
 letterSpacing:"0.22em",
 textTransform:"uppercase",
 }}
 >
 {String(activeIndex + 1).padStart(2,"0")} /{""}
 {String(total).padStart(2,"0")}
 </div>

 {/* Thumbnail strips */}
 <ThumbStrip
 refProp={thumbLeftRef}
 slides={slides}
 side="left"
 activeIndex={activeIndex}
 frameW={frameW}
 thumbW={thumbW}
 thumbH={thumbH}
 thumbGap={thumbGap}
 bgColor={bgColor}
 />
 <ThumbStrip
 refProp={thumbRightRef}
 slides={slides}
 side="right"
 activeIndex={activeIndex}
 frameW={frameW}
 thumbW={thumbW}
 thumbH={thumbH}
 thumbGap={thumbGap}
 bgColor={bgColor}
 />

 {/* Center frame */}
 <div
 className="absolute top-1/2 left-1/2"
 style={{
 transform:"translate(-50%, -50%)",
 zIndex: 20,
 }}
 >
 {/* Animated SVG Border*/}
 <SVGDashedBorder
 width={frameW}
 height={frameH}
 padding={12}
 strokeWidth={1}
 />

 {/* Frame content wrapper */}
 <div
 className="overflow-hidden absolute top-1/2 m-auto left-1/2"
 style={{
 width: frameW - 10,
 height: frameH - 10,
 transform:"translate(-50%, -50%)",
 }}
 >

 {/* Gallery strip */}
 <div
 ref={galleryRef}
 className="absolute top-0 left-0 bottom-0 flex will-change-transform"
 style={{ width: slideW * total }}
 >
 {slides.map((slide, i) => (
 <div
 key={slide.id}
 className="relative shrink-0 overflow-hidden"
 style={{ width: slideW, height: frameH }}
 >
 <div
 ref={(el) => (itemInnerRefs.current[i] = el)}
 className="absolute inset-0 will-change-transform"
 style={{
 transform: `rotate(${i === 0 ? 0 : ROTATION_DEG}deg) scale(${i === 0 ? 1 : SCALE_OFFSCREEN})`,
 transformOrigin:"center center",
 borderRadius: 0,
 filter:"none",
 }}
 >
 <Image
 src={slide.src}
 alt={slide.id}
 fill
 quality={100}
 style={{ objectFit:"cover", borderRadius: 0, filter:"none" }}
 sizes={`${slideW}px`}
 priority={i === 0}
 draggable={false}
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

function ThumbStrip({ refProp, slides, side, frameW, thumbW, thumbH, thumbGap, bgColor }) {
 const [isMobile, setIsMobile] = useState(false);

 useEffect(() => {
 const checkMobile = () => {
 setIsMobile(window.innerWidth < 640);
 };

 checkMobile();
 window.addEventListener("resize", checkMobile);
 return () => window.removeEventListener("resize", checkMobile);
 }, []);

 const stripStyle = {
 position:"absolute",
 top:"50%",
 zIndex: 10,
 overflow:"hidden",
 background: bgColor,
 ...(side ==="left"
 ? { right: `calc(50% + ${frameW / 2}px)`, left: 0 }
 : { left: `calc(50% + ${frameW / 2}px)`, right: 0 }
 ),
 height: thumbH,
 transform:"translateY(-50%)",
 };

 return (
 <div style={stripStyle}>

 <div
 ref={refProp}
 className="absolute top-1/2 flex will-change-transform"
 style={{
 gap: thumbGap,
 transform:"translate3d(0px, -50%, 0px)",
 left: side ==="left" ?"100%" : 0,
 right:"auto",
 }}
 >
 {slides.map((slide, i) => (
 <div
 key={i}
 className="shrink-0 overflow-hidden"
 style={{
 width: thumbW,
 height: thumbH,
 position:"relative",
 opacity: 1,
 borderRadius: 0,
 }}
 >
 <Image
 src={slide.src}
 alt={slide.id}
 fill
 quality={100}
 style={{ objectFit:"cover", borderRadius: 0, filter:"none" }}
 draggable={false}
 sizes={`${thumbW}px`}
 />
 </div>
 ))}
 </div>
 </div>
 );
}

function SVGDashedBorder({ width, height, padding = 12, strokeWidth = 1 }) {
 // The mask path ref — this is the solid path we animate to reveal the dashes
 const maskPathRef = useRef(null);
 // Unique ID per instance to avoid clipPath conflicts
 const clipId = useRef(`dash-clip-${Math.random().toString(36).slice(2)}`);

 const DASH = 8;
 const GAP = 6;

 const totalWidth = width + padding * 2;
 const totalHeight = height + padding * 2;

 // The rectangular path (clockwise from top-left)
 const pathData = `M ${padding} ${padding} L ${padding + width} ${padding} L ${padding + width} ${padding + height} L ${padding} ${padding + height} Z`;

 useEffect(() => {
 const maskPath = maskPathRef.current;
 if (!maskPath) return;

 const pathLength = maskPath.getTotalLength();

 // The mask path starts fully"hidden" (dashoffset = full length)
 // and animates to 0, progressively revealing the clip region —
 // which in turn reveals the dashed path underneath.
 gsap.set(maskPath, {
 strokeDasharray: pathLength,
 strokeDashoffset: pathLength,
 });

 gsap.to(maskPath, {
 strokeDashoffset: 0,
 duration: 1.5,
 ease:"linear",
 delay: 0.1,
 });
 }, []);

 return (
 <svg
 width={totalWidth}
 height={totalHeight}
 viewBox={`0 0 ${totalWidth} ${totalHeight}`}
 style={{
 position:"absolute",
 top:"50%",
 left:"50%",
 transform:"translate(-50%, -50%)",
 pointerEvents:"none",
 zIndex: 0,
 overflow:"visible",
 }}
 >
 <defs>
  <clipPath id={clipId.current}>
 <path
 ref={maskPathRef}
 d={pathData}
 fill="none"
  strokeWidth={12}
 strokeLinecap="round"
 />
 </clipPath>
 </defs>

  <path
 d={pathData}
 fill="none"
 stroke="rgba(255, 255, 255, 0.5)"
 strokeWidth={strokeWidth}
 strokeDasharray={`${DASH} ${GAP}`}
 strokeLinecap="round"
 strokeLinejoin="round"
 clipPath={`url(#${clipId.current})`}
 />
 </svg>
 );
}

