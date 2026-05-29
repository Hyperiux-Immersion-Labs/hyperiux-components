'use client';
import { useEffect, useRef, memo } from"react";
import gsap from"gsap";
import { ScrollTrigger } from"gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DIGITS = [...Array(10).keys()]; // [0..9]

const SCROLL_TRIGGER_CONFIG = {
 trigger:"#stats",
 start:"top 80%",
};

const FONT_WEIGHTS = {
 normal:"font-normal",
 medium:"font-medium",
 semibold:"font-semibold",
 bold:"font-bold",
};

const DigitScroller = memo(({ digit, duration = 2, color }) => {
 const containerRef = useRef(null);

 useEffect(() => {
 const ctx = gsap.context(() => {
 gsap.to(containerRef.current, {
 y: `-${parseInt(digit, 10) * 10}%`,
 duration,
 ease:"power1.out",
 scrollTrigger: SCROLL_TRIGGER_CONFIG,
 });
 });
 return () => ctx.revert();
 }, [digit, duration]);

 return (
 <div
 style={{ color }}
 className="overflow-hidden h-[1em] leading-none inline-block relative w-[0.64em]"
 >
 <div ref={containerRef} className="flex flex-col">
 {DIGITS.map((d) => (
 <span key={d} className="flex h-[1em] items-center justify-center leading-none">
 {d}
 </span>
 ))}
 </div>
 </div>
 );
});

DigitScroller.displayName ="DigitScroller";

const renderDigits = (value, color) =>
 value.split("").map((char, i) =>
 /\d/.test(char) ? (
 <DigitScroller key={i} digit={char} color={color} />
 ) : (
 <span key={i} style={{ color }}>{char}</span>
 )
 );

const StatItem = memo(({ stat, textColor, textSize, fontWeight }) => {
 const { prefix, value, suffix, superSuffix } = stat;

 return (
 <div className="flex gap-[2vw] h-fit w-fit max-md:gap-0 max-sm:flex-col">
 <div className="flex flex-col items-center justify-start h-fit gap-[1vw] w-fit max-sm:flex-row max-sm:justify-between max-sm:pl-[4vw] max-sm:gap-[4vw]">
 <h3
 dir="ltr"
 className={`${FONT_WEIGHTS[fontWeight] ||"font-normal"} leading-[1.2] flex items-center max-md:text-[7vw] max-sm:text-[12vw] ${textSize}`}
 >
 {prefix && <span style={{ color: textColor }}>{prefix}</span>}
 {renderDigits(value, textColor)}
 {suffix && <span style={{ color: textColor }}>{suffix}</span>}
 {superSuffix && <sup style={{ color: textColor }}>{superSuffix}</sup>}
 </h3>
 </div>
 </div>
 );
});

StatItem.displayName ="StatItem";

/**
 * @param {Object[]} stats
 * @param {string} textColor
 * @param {string} textSize  * @param {string} fontWeight  */
export default function CounterOne({
 stats = [],
 textColor ="black",
 textSize ="text-[5vw]",
 fontWeight ="normal",
}) {
 const items = stats.slice(0, 3);

 return (
 <section id="stats" className="h-fit w-fit">
 <div className="p-[1vw]">
 <div className="flex text-center gap-[2vw] w-fit h-fit max-md:flex-wrap max-md:gap-x-0 max-md:gap-y-12 max-sm:flex-col max-sm:text-left">
 {items.map((stat, index) => (
 <StatItem
 key={index}
 stat={stat}
 textColor={textColor}
 textSize={textSize}
 fontWeight={fontWeight}
 />
 ))}
 </div>
 </div>
 </section>
 );
}