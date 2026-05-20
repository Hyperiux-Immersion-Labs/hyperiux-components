'use client'

import { useState, useEffect } from'react';
import { motion } from'framer-motion';

function useMousePosition() {
 const [mousePosition, setMousePosition] = useState({ x: null, y: null });

 useEffect(() => {
 const updateMousePosition = (e) => {
 setMousePosition({ x: e.clientX, y: e.clientY });
 };
 window.addEventListener('mousemove', updateMousePosition);
 return () => window.removeEventListener('mousemove', updateMousePosition);
 }, []);

 return mousePosition;
}

function useIsPointerFine() {
 const [isPointerFine, setIsPointerFine] = useState(false);

 useEffect(() => {
 const mq = window.matchMedia('(pointer: fine)');
 setIsPointerFine(mq.matches);
 const handler = (e) => setIsPointerFine(e.matches);
 mq.addEventListener('change', handler);
 return () => mq.removeEventListener('change', handler);
 }, []);

 return isPointerFine;
}

export default function CircleReveal({
 textColor ='#111',
 Text ="We craft emotionally intelligent user experiences that are adored globally!",
 revealText ="A visual designer — with skills that haven't been replaced by A.I",
 circleColorBg ='#E76F2E',
 RevealedTextColor ='#fefefe'
}) {
 const [isHovered, setIsHovered] = useState(false);
 const { x, y } = useMousePosition();
 const isPointerFine = useIsPointerFine();

 const [smoothPos, setSmoothPos] = useState(null);

 const size = isHovered ? 500 : 40;

 useEffect(() => {
 if (!isPointerFine) return;

 let animationFrame;

 const lerp = (start, end, factor) => start + (end - start) * factor;

 const animate = () => {
 setSmoothPos((prev) => {
 if (x === null || y === null) return prev;
 if (prev === null) return { x, y };
 return {
 x: lerp(prev.x, x, 0.15),
 y: lerp(prev.y, y, 0.15),
 };
 });

 animationFrame = requestAnimationFrame(animate);
 };

 animate();

 return () => cancelAnimationFrame(animationFrame);
 }, [x, y, isPointerFine]);

 return (
 <section className="w-screen h-screen flex items-center justify-center text-[7vw] text-center px-[5vw] bg-[#fefefe] relative overflow-hidden">

 {/* ── Masked layer — desktop/mouse only, hidden until first mouse move ── */}
 {isPointerFine && smoothPos !== null && (
 <motion.div
 className="absolute inset-0 flex items-center justify-center z-10"
 style={{
 WebkitMaskImage:'radial-gradient(circle at center, black 50%, transparent 51%)',
 WebkitMaskRepeat:'no-repeat',
 }}
 animate={{
 WebkitMaskPosition: `${smoothPos.x - size / 2}px ${smoothPos.y - size / 2}px`,
 WebkitMaskSize: `${size}px ${size}px`,
 }}
 transition={{ type:'tween', ease:'backOut', duration: 0.5 }}
 >
 <div className="absolute inset-0" style={{ backgroundColor: circleColorBg }} />

 <h2
 className="relative z-10 leading-tight cursor-default select-none"
 style={{ color: RevealedTextColor }}
 onMouseEnter={() => setIsHovered(true)}
 onMouseLeave={() => setIsHovered(false)}
 >
 {revealText}
 </h2>
 </motion.div>
 )}


 <div className="relative z-0">
 <h2
 className="leading-tight select-none"
 style={{ color: textColor }}
 >
 {Text}
 </h2>
 </div>

 </section>
 );
}