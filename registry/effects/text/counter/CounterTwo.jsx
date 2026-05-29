'use client';

import { memo, useEffect, useRef } from'react';
import gsap from'gsap';
import { ScrollTrigger } from'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DIGITS = [...Array(10).keys()].concat(0);

const FONT_WEIGHTS = {
 normal:'font-normal',
 medium:'font-medium',
 semibold:'font-semibold',
 bold:'font-bold',
};

const DigitScroller = memo(({ digit, index, triggerRef }) => {
 const digitRef = useRef(null);

 useEffect(() => {
 if (!digitRef.current || !triggerRef.current) return;

 const digitIndex = parseInt(digit, 10);
 const ctx = gsap.context(() => {
 gsap.to(digitRef.current, {
 yPercent: -(digitIndex * 100),
 duration: 1.5,
 ease:'power2.inOut',
 delay: index * 0.1,
 scrollTrigger: {
 trigger: triggerRef.current,
 start:'top 85%',
 },
 });
 }, triggerRef);

 return () => ctx.revert();
 }, [digit, index, triggerRef]);

 return (
 <div className="relative inline-flex h-[1em] w-[0.64em] overflow-hidden align-baseline leading-none">
 <div ref={digitRef} className="flex flex-col will-change-transform">
 {DIGITS.map((num, digitIndex) => (
 <span
 key={`${num}-${digitIndex}`}
 className="flex h-[1em] items-center justify-center leading-none"
 >
 {num}
 </span>
 ))}
 </div>
 </div>
 );
});

DigitScroller.displayName ='DigitScroller';

const CounterTwo = ({
 value ='0',
 textSize ='text-[8vw] max-sm:text-[16vw] tablet:text-[10vw]',
 color ='#111111',
 fontWeight ='normal', }) => {
 const containerRef = useRef(null);
 const cleanValue = value.replace('+','');

 return (
 <div ref={containerRef} className="flex items-end gap-2 w-fit">
 <div
 className={`flex items-end font-display leading-none ${textSize} ${FONT_WEIGHTS[fontWeight] ||'font-normal'}`}
 style={{ color }}
 >
 {cleanValue.split('').map((digit, index) => (
 <DigitScroller
 key={`${digit}-${index}`}
 digit={digit}
 index={index}
 triggerRef={containerRef}
 />
 ))}

 {value.includes('+') && (
 <span className="inline-flex h-[1em] items-center justify-center leading-none">
 +
 </span>
 )}
 </div>
 </div>
 );
};

export default CounterTwo;