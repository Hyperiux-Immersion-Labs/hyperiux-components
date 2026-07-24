'use client';

import React, { useEffect, useRef, memo } from'react';
import gsap from'gsap';
import { ScrollTrigger } from'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const DigitScroller = memo(({ digit, duration = 1.5, trigger, textColor, reducedMotion = false }) => {
 const containerRef = useRef(null);

 useEffect(() => {
 if (reducedMotion || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
 if (!containerRef.current) return;

 const ctx = gsap.context(() => {
 const digitIndex = parseInt(digit, 10);

 gsap.to(containerRef.current, {
 y: `-${digitIndex * 10}%`,
 duration,
 ease:'power2.out',
 scrollTrigger: {
 trigger: trigger || containerRef.current,
 start:'top 85%',
 },
 });
 }, containerRef);

 return () => ctx.revert();
 }, [digit, duration, reducedMotion, trigger]);

 if (reducedMotion) {
 return (
 <span className="inline-block w-[0.6em] leading-none" style={{ color: textColor }}>
 {digit}
 </span>
 );
 }

 return (
 <div className="overflow-hidden inline-block relative h-[1em] w-[0.6em]">
 <div ref={containerRef} className="flex flex-col">
 {Array.from({ length: 10 }, (_, i) => (
 <span
 key={i}
 className="leading-none"
 style={{ color: textColor }}
 >
 {i}
 </span>
 ))}
 </div>
 </div>
 );
});

DigitScroller.displayName ='DigitScroller';



const NumberCounterThree = ({
 value ='0',
 duration = 1.5,
 fontWeight = 600,
 textColor ='#FF5100',
 textSize ='text-[5vw] max-[1025px]:text-[7vw] max-md:text-[12vw]',
 trigger,
 suffix ='',
 reducedMotion = false,
}) => {
 const renderDigits = (val) => {
 return val.split('').map((char, i) => {
 if (/\d/.test(char)) {
 return (
 <DigitScroller
 key={i}
 digit={char}
 duration={duration}
 trigger={trigger}
 textColor={textColor}
 reducedMotion={reducedMotion}
 />
 );
 }

 // non-digit chars
 return (
 <span key={i} style={{ color: textColor }}>
 {char}
 </span>
 );
 });
 };

 return (
 <div
 className={`flex items-end gap-[0.05em] max-[1025px]:gap-0 ${textSize}`}
 style={{
 fontWeight,
 color: textColor,
  }}
 >
 {renderDigits(value)}

 {suffix && (
 <span style={{ color: textColor }} className="ml-1">
 {suffix}
 </span>
 )}
 </div>
 );
};

export default NumberCounterThree;
