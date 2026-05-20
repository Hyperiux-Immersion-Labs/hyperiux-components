'use client'
import React, { useState, useRef, useEffect } from'react';
import { gsap } from'gsap';
import Image from'next/image';
import ScrollTrigger from'gsap/dist/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger)

const SpotlightReveal = ({ beforeImage, afterImage, maskShape ='ellipse' }) => {
 const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
 const [isHovering, setIsHovering] = useState(false);
 const [isMobile, setIsMobile] = useState(false);
 const animatedPos = useRef({ x: 0, y: 0 });
 const circleRef = useRef(null);
 const containerRef = useRef(null);

 const getMaskStyle = (pct, pos) => {
 switch (maskShape) {
 case'circle':
 return `radial-gradient(circle 300px at ${pct}% ${pos.yPct}%, black 85%, transparent 100%)`;
 case'square':
 return `
 linear-gradient(
 to right,
 transparent calc(${pct}% - 260px),
 rgba(0,0,0,0.4) calc(${pct}% - 220px),
 black calc(${pct}% - 180px),
 black calc(${pct}% + 180px),
 rgba(0,0,0,0.4) calc(${pct}% + 220px),
 transparent calc(${pct}% + 260px)
 )
 `;
 case'ellipse':
 default:
 return `radial-gradient(ellipse 300px 100% at ${pct}% 50%, black 30%, transparent 100%)`;
 }
 };

 // detect mobile/tablet
 useEffect(() => {
 if (typeof window !=='undefined') {
 const checkDevice = () => {
 setIsMobile(window.innerWidth <= 1024);
 };
 checkDevice();
 window.addEventListener('resize', checkDevice);
 return () => window.removeEventListener('resize', checkDevice);
 }
 }, []);

 useEffect(() => {
 const ctx = gsap.context(() => {
 gsap.to('#footer-wrapper', {
 yPercent: 0,
 ease:'none',
 scrollTrigger: {
 trigger:'#footer-wrapper',
 start:'top bottom',
 end:'bottom 50%',
 scrub: true,
 immediateRender: false,
 }
 })
 })
 ScrollTrigger.refresh();
 return () => ctx.revert();
 }, [])

 useEffect(() => {
 if (typeof window !=='undefined' && containerRef.current) {
 const containerWidth = containerRef.current.offsetWidth;
 const containerHeight = containerRef.current.offsetHeight;
 const initialX = containerWidth / 2;
 const initialY = containerHeight * 0.75;
 setMousePos({ x: initialX, y: initialY });
 animatedPos.current = { x: initialX, y: initialY };
 }
 }, []);

 useEffect(() => {
 if (isMobile) return; // no animation on mobile

 gsap.to(animatedPos.current, {
 x: mousePos.x,
 y: mousePos.y,
 duration: 0.6,
 ease:"power2.out",
 onUpdate: () => {
 if (circleRef.current && containerRef.current) {
 const containerWidth = containerRef.current.offsetWidth;
 const containerHeight = containerRef.current.offsetHeight;
 const pct = (animatedPos.current.x / containerWidth) * 100;
 const yPct = (animatedPos.current.y / containerHeight) * 100;
 const mask = getMaskStyle(pct, { yPct });
 circleRef.current.style.maskImage = mask;
 circleRef.current.style.webkitMaskImage = mask;
 }
 }
 });
 }, [mousePos, isMobile]);

 const handleMouseMove = (e) => {
 if (isMobile) return;

 const rect = e.currentTarget.getBoundingClientRect();
 setMousePos({
 x: e.clientX - rect.left,
 y: e.clientY - rect.top
 });
 };

 const handleMouseEnter = () => {
 if (isMobile) return;
 setIsHovering(true);
 };

 const handleMouseLeave = () => {
 if (isMobile) return;
 setIsHovering(false);
 };

 const initialMask = getMaskStyle(50, { yPct: 75 });

 return (
 <div className='h-fit w-full relative z-12 bg-black' id='footer-wrapper' style={{ transform:'translateY(0%)' }}>
 <footer
 ref={containerRef}
 className='w-full h-screen mt-0 pointer-events-auto sticky top-0 bg-[#1E1E1E] flex flex-col items-stretch justify-between p-[2vw]'
 onMouseMove={handleMouseMove}
 onMouseEnter={handleMouseEnter}
 onMouseLeave={handleMouseLeave}
 >
 <div className='relative w-full h-[98%] overflow-hidden'>

 {isMobile ? (
 // FINAL IMAGE — NO EFFECT
 <Image src={afterImage} alt="after" fill className="object-cover" />
 ) : (
 <>
 {/* BEFORE */}
 <div className="absolute inset-0">
 <Image src={beforeImage} alt="before" fill className="object-cover" />
 </div>

 {/* AFTER with spotlight */}
 <div
 ref={circleRef}
 className="absolute inset-0"
 style={{
 maskImage: initialMask,
 WebkitMaskImage: initialMask,
 opacity: isHovering ? 1 : 0,
 transition:'opacity 0.3s ease',
 }}
 >
 <Image src={afterImage} alt="after" fill className="object-cover" />
 </div>
 </>
 )}

 </div>
 </footer>
 </div>
 );
};

export default SpotlightReveal;