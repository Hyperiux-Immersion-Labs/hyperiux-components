'use client';

import React, { useEffect, useRef, memo } from'react';
import gsap from'gsap';
import { ScrollTrigger } from'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const DigitScroller = memo(({ digit, duration = 1.5, trigger, textColor }) => {
 const containerRef = useRef(null);

 useEffect(() => {
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
 }, [digit, duration, trigger]);

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



const CounterThree = ({
 value ='0',
 duration = 1.5,
 fontWeight = 600,
 textColor ='#FF5100',
 textSize ='text-[5vw]',
 trigger,
 suffix ='',
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
 className={`flex items-end ${textSize}`}
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

export default CounterThree;