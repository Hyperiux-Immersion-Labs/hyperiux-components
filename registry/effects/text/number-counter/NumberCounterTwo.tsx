'use client';

import { memo, useEffect, useRef, type RefObject } from'react';
import gsap from'gsap';
import { ScrollTrigger } from'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DIGITS = [...Array(10).keys()].concat(0);

type CounterFontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

const FONT_WEIGHTS: Record<CounterFontWeight, string> = {
 normal:'font-normal',
 medium:'font-medium',
 semibold:'font-semibold',
 bold:'font-bold',
};

interface DigitScrollerProps {
  digit: string;
  index: number;
  duration?: number;
  stagger?: number;
  triggerRef: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
}

const DigitScroller = memo(({ digit, index, duration = 1.5, stagger = 0.1, triggerRef, reducedMotion = false }: DigitScrollerProps) => {
 const digitRef = useRef<any>(null);

 useEffect(() => {
 if (reducedMotion || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
 if (!digitRef.current || !triggerRef.current) return;

 const digitIndex = parseInt(digit, 10);
 const ctx = gsap.context(() => {
 gsap.to(digitRef.current, {
 yPercent: -(digitIndex * 100),
 duration,
 ease:'power2.inOut',
 delay: index * stagger,
 scrollTrigger: {
 trigger: triggerRef.current,
 start:'top 85%',
 },
 });
 }, triggerRef);

 return () => ctx.revert();
 }, [digit, index, duration, stagger, reducedMotion, triggerRef]);

 if (reducedMotion) {
 return (
 <span className="inline-flex h-[1em] w-[0.64em] items-center justify-center leading-none">
 {digit}
 </span>
 );
 }

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

interface NumberCounterTwoProps {
  value?: string;
  textSize?: string;
  color?: string;
  fontWeight?: CounterFontWeight;
  duration?: number;
  stagger?: number;
  reducedMotion?: boolean;
}

const NumberCounterTwo = ({
 value ='0',
 textSize ='text-[8vw] max-[1025px]:text-[7vw] max-md:text-[12vw]',
 color ='#111111',
 fontWeight ='normal',
 duration = 1.5,
 stagger = 0.1,
 reducedMotion = false, }: NumberCounterTwoProps) => {
 const containerRef = useRef<HTMLDivElement | null>(null);
 const cleanValue = value.replace('+','');

 return (
 <div ref={containerRef} className="flex items-end gap-[2vw] w-fit max-[1025px]:gap-0">
 <div
 className={`flex items-end font-display leading-none ${textSize} ${(fontWeight && FONT_WEIGHTS[fontWeight]) ||'font-normal'}`}
 style={{ color }}
 >
 {cleanValue.split('').map((digit, index) => (
 <DigitScroller
 key={`${digit}-${index}`}
 digit={digit}
 index={index}
 duration={duration}
 stagger={stagger}
 triggerRef={containerRef}
 reducedMotion={reducedMotion}
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

export default NumberCounterTwo;
