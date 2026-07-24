'use client';
import { useEffect, useId, useRef, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DIGITS = [...Array(10).keys()]; // [0..9]

const FONT_WEIGHTS = {
 normal:"font-normal",
 medium:"font-medium",
 semibold:"font-semibold",
 bold:"font-bold",
};

const DigitScroller = memo(({ digit, duration = 2, color, trigger, reducedMotion = false }) => {
 const containerRef = useRef(null);

 useEffect(() => {
 if (reducedMotion || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
 const ctx = gsap.context(() => {
 gsap.to(containerRef.current, {
 y: `-${parseInt(digit, 10) * 10}%`,
 duration,
 ease:"power1.out",
 scrollTrigger: {
 trigger,
 start:"top 80%",
 },
 });
 });
 return () => ctx.revert();
 }, [digit, duration, reducedMotion, trigger]);

 if (reducedMotion) {
 return (
 <span style={{ color }} className="inline-block w-[0.64em] text-center leading-none">
 {digit}
 </span>
 );
 }

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

const renderDigits = (value, color, trigger, reducedMotion) =>
 value.split("").map((char, i) =>
 /\d/.test(char) ? (
 <DigitScroller key={i} digit={char} color={color} trigger={trigger} reducedMotion={reducedMotion} />
 ) : (
 <span key={i} style={{ color }}>{char}</span>
 )
 );

const StatItem = memo(({ stat, textColor, textSize, fontWeight, trigger, reducedMotion }) => {
 const { prefix, value, suffix, superSuffix } = stat;

 return (
 <div className="flex gap-[2vw] h-fit w-fit max-[1025px]:gap-0 max-md:flex-col">
 <div className="flex flex-col items-center justify-start h-fit gap-[1vw] w-fit max-md:flex-row max-md:justify-between max-md:pl-[4vw] max-md:gap-[4vw]">
 <h3
 dir="ltr"
 className={`${FONT_WEIGHTS[fontWeight] ||"font-normal"} leading-[1.2] flex items-center max-[1025px]:text-[7vw] max-md:text-[12vw] ${textSize}`}
 >
 {prefix && <span style={{ color: textColor }}>{prefix}</span>}
 {renderDigits(value, textColor, trigger, reducedMotion)}
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
export default function NumberCounterOne({
 stats = [],
 textColor ="black",
 textSize ="text-[5vw]",
 fontWeight ="normal",
 reducedMotion = false,
}) {
 const uid = useId().replace(/:/g, "");
 const sectionId = `stats-${uid}`;
 const trigger = `#${sectionId}`;
 const items = stats.slice(0, 3);

 return (
 <section id={sectionId} className="h-fit w-fit">
 <div className="p-[1vw]">
 <div className="flex text-center gap-[2vw] w-fit h-fit max-[1025px]:flex-wrap max-[1025px]:gap-x-0 max-[1025px]:gap-y-12 max-md:flex-col max-md:text-left">
 {items.map((stat, index) => (
 <StatItem
 key={index}
 stat={stat}
 textColor={textColor}
 textSize={textSize}
 fontWeight={fontWeight}
 trigger={trigger}
 reducedMotion={reducedMotion}
 />
 ))}
 </div>
 </div>
 </section>
 );
}
