// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import React, { memo, useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

const __NumberCounterOne_DIGITS = [...Array(10).keys()]; // [0..9]

type __NumberCounterOne_CounterFontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

const __NumberCounterOne_FONT_WEIGHTS: Record<__NumberCounterOne_CounterFontWeight, string> = {
 normal:"font-normal",
 medium:"font-medium",
 semibold:"font-semibold",
 bold:"font-bold",
};

interface __NumberCounterOne_DigitScrollerProps {
  digit: string;
  index: number;
  duration?: number;
  stagger?: number;
  color?: string;
  trigger: string;
  reducedMotion?: boolean;
}

const __NumberCounterOne_DigitScroller = memo(({ digit, index, duration = 2, stagger = 0.1, color, trigger, reducedMotion = false }: __NumberCounterOne_DigitScrollerProps) => {
 const containerRef = useRef<any>(null);

 useEffect(() => {
 if (reducedMotion || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
 const ctx = gsap.context(() => {
 gsap.to(containerRef.current, {
 y: `-${parseInt(digit, 10) * 10}%`,
 duration,
 delay: index * stagger,
 ease:"power1.out",
 scrollTrigger: {
 trigger,
 start:"top 80%",
 },
 });
 });
 return () => ctx.revert();
 }, [digit, duration, index, stagger, reducedMotion, trigger]);

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
 {__NumberCounterOne_DIGITS.map((d) => (
 <span key={d} className="flex h-[1em] items-center justify-center leading-none">
 {d}
 </span>
 ))}
 </div>
 </div>
 );
});

__NumberCounterOne_DigitScroller.displayName ="__NumberCounterOne_DigitScroller";

const renderDigits = (value: string, color: string | undefined, trigger: string, duration: number | undefined, stagger: number | undefined, reducedMotion: boolean | undefined) =>
 value.split("").map((char, i) =>
 /\d/.test(char) ? (
 <__NumberCounterOne_DigitScroller key={i} digit={char} index={i} duration={duration} stagger={stagger} color={color} trigger={trigger} reducedMotion={reducedMotion} />
 ) : (
 <span key={i} style={{ color }}>{char}</span>
 )
 );

export interface CounterStat {
  prefix?: string;
  value: string;
  suffix?: string;
  superSuffix?: string;
}

interface StatItemProps {
  stat: CounterStat;
  textColor?: string;
  textSize?: string;
  fontWeight?: __NumberCounterOne_CounterFontWeight;
  trigger: string;
  duration?: number;
  stagger?: number;
  reducedMotion?: boolean;
}

const StatItem = memo(({ stat, textColor, textSize, fontWeight, trigger, duration, stagger, reducedMotion }: StatItemProps) => {
 const { prefix, value, suffix, superSuffix } = stat;

 return (
 <div className="flex gap-[2vw] h-fit w-fit max-[1025px]:gap-0 max-md:flex-col">
 <div className="flex flex-col items-center justify-start h-fit gap-[1vw] w-fit max-md:flex-row max-md:justify-between max-md:pl-[4vw] max-md:gap-[4vw]">
 <h3
 dir="ltr"
 className={`${(fontWeight && __NumberCounterOne_FONT_WEIGHTS[fontWeight]) ||"font-normal"} leading-[1.2] flex items-center max-[1025px]:text-[7vw] max-md:text-[12vw] ${textSize}`}
 >
 {prefix && <span style={{ color: textColor }}>{prefix}</span>}
 {renderDigits(value, textColor, trigger, duration, stagger, reducedMotion)}
 {suffix && <span style={{ color: textColor }}>{suffix}</span>}
 {superSuffix && <sup style={{ color: textColor }}>{superSuffix}</sup>}
 </h3>
 </div>
 </div>
 );
});

StatItem.displayName ="StatItem";

interface NumberCounterOneProps {
  stats?: CounterStat[];
  textColor?: string;
  textSize?: string;
  fontWeight?: __NumberCounterOne_CounterFontWeight;
  duration?: number;
  stagger?: number;
  reducedMotion?: boolean;
}

function NumberCounterOne({
 stats = [],
 textColor ="black",
 textSize ="text-[5vw]",
 fontWeight ="normal",
 duration = 2,
 stagger = 0.1,
 reducedMotion = false,
}: NumberCounterOneProps) {
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
 duration={duration}
 stagger={stagger}
 reducedMotion={reducedMotion}
 />
 ))}
 </div>
 </div>
 </section>
 );
}

gsap.registerPlugin(ScrollTrigger);

const __NumberCounterTwo_DIGITS = [...Array(10).keys()].concat(0);

type __NumberCounterTwo_CounterFontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

const __NumberCounterTwo_FONT_WEIGHTS: Record<__NumberCounterTwo_CounterFontWeight, string> = {
 normal:'font-normal',
 medium:'font-medium',
 semibold:'font-semibold',
 bold:'font-bold',
};

interface __NumberCounterTwo_DigitScrollerProps {
  digit: string;
  index: number;
  duration?: number;
  stagger?: number;
  triggerRef: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
}

const __NumberCounterTwo_DigitScroller = memo(({ digit, index, duration = 1.5, stagger = 0.1, triggerRef, reducedMotion = false }: __NumberCounterTwo_DigitScrollerProps) => {
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
 {__NumberCounterTwo_DIGITS.map((num, digitIndex) => (
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

__NumberCounterTwo_DigitScroller.displayName ='__NumberCounterTwo_DigitScroller';

interface NumberCounterTwoProps {
  value?: string;
  textSize?: string;
  color?: string;
  fontWeight?: __NumberCounterTwo_CounterFontWeight;
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
 className={`flex items-end font-display leading-none ${textSize} ${(fontWeight && __NumberCounterTwo_FONT_WEIGHTS[fontWeight]) ||'font-normal'}`}
 style={{ color }}
 >
 {cleanValue.split('').map((digit, index) => (
 <__NumberCounterTwo_DigitScroller
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

gsap.registerPlugin(ScrollTrigger);

interface __NumberCounterThree_DigitScrollerProps {
  digit: string;
  index: number;
  duration?: number;
  stagger?: number;
  trigger?: string | Element;
  textColor?: string;
  reducedMotion?: boolean;
}

const __NumberCounterThree_DigitScroller = memo(({ digit, index, duration = 1.5, stagger = 0.1, trigger, textColor, reducedMotion = false }: __NumberCounterThree_DigitScrollerProps) => {
 const containerRef = useRef<HTMLDivElement | null>(null);

 useEffect(() => {
 if (reducedMotion || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
 if (!containerRef.current) return;

 const ctx = gsap.context(() => {
 const digitIndex = parseInt(digit, 10);

 gsap.to(containerRef.current, {
 y: `-${digitIndex * 10}%`,
 duration,
 delay: index * stagger,
 ease:'power2.out',
 scrollTrigger: {
 trigger: trigger || containerRef.current,
 start:'top 85%',
 },
 });
 }, containerRef);

 return () => ctx.revert();
 }, [digit, index, duration, stagger, reducedMotion, trigger]);

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

__NumberCounterThree_DigitScroller.displayName ='__NumberCounterThree_DigitScroller';

interface NumberCounterThreeProps {
  value?: string;
  duration?: number;
  stagger?: number;
  fontWeight?: string | number;
  textColor?: string;
  textSize?: string;
  trigger?: string | Element;
  suffix?: string;
  reducedMotion?: boolean;
}

const NumberCounterThree = ({
 value ='0',
 duration = 1.5,
 stagger = 0.1,
 fontWeight = 600,
 textColor ='#FF5100',
 textSize ='text-[5vw] max-[1025px]:text-[7vw] max-md:text-[12vw]',
 trigger,
 suffix ='',
 reducedMotion = false,
}: NumberCounterThreeProps) => {
 const renderDigits = (val: string) => {
 return val.split('').map((char, i) => {
 if (/\d/.test(char)) {
 return (
 <__NumberCounterThree_DigitScroller
 key={i}
 digit={char}
 index={i}
 duration={duration}
 stagger={stagger}
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

function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

        updatePreference()
        mediaQuery.addEventListener('change', updatePreference)

        return () => mediaQuery.removeEventListener('change', updatePreference)
    }, [])

    return prefersReducedMotion
}

export default function NumberCounter({
    duration = 1.5,
    stagger = 0.1,
    textColor = "#021A54",
}) {
    const prefersReducedMotion = usePrefersReducedMotion()
    const [replayOneKey, setReplayOneKey] = useState(0)
    const [replayTwoKey, setReplayTwoKey] = useState(0)
    const [replayThreeKey, setReplayThreeKey] = useState(0)

    const handleReplayOne = useCallback(() => setReplayOneKey((k) => k + 1), [])
    const handleReplayTwo = useCallback(() => setReplayTwoKey((k) => k + 1), [])
    const handleReplayThree = useCallback(() => setReplayThreeKey((k) => k + 1), [])

    return (
        <>
            <div className="min-h-screen w-screen bg-white flex items-center justify-center p-10">
                <div className="w-full max-w-6xl max-md:pt-10 flex flex-col items-center gap-10">
                    <h1 className="text-[3vw] max-[1025px]:text-[4vw] max-md:text-[7vw] text-[#111111] text-center">
                        Numbers That Speak for Themselves
                    </h1>

                    <div className={`w-full flex flex-col md:flex-row items-stretch justify-center gap-8 ${prefersReducedMotion ? 'animate-[number-counter-static-fade_420ms_ease-out_both]' : ''}`}>
                        <div className="flex-1 min-w-65 rounded-md border border-black/10 bg-white shadow-sm p-8 flex flex-col items-center">
                            <div className="flex-1 w-full flex items-center justify-center">
                                <NumberCounterOne
                                    key={`${replayOneKey}-${duration}-${stagger}-${textColor}`}
                                    textColor={textColor}
                                    textSize="text-[5vw] md:text-[3.2vw]"
                                    fontWeight="normal"
                                    stats={[{ value: "936", suffix: "" }]}
                                    duration={duration}
                                    stagger={stagger}
                                    reducedMotion={prefersReducedMotion}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleReplayOne}
                                disabled={prefersReducedMotion}
                                className="mt-6 px-5 py-2 rounded-full bg-[#111111] text-white text-sm max-md:text-sm max-[1025px]:text-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                Replay
                            </button>
                        </div>

                        <div className="flex-1 min-w-[260px] rounded-md border border-black/10 bg-white shadow-sm p-8 flex flex-col items-center">
                            <div className="flex-1 w-full flex items-center justify-center">
                                <NumberCounterTwo
                                    key={`${replayTwoKey}-${duration}-${stagger}-${textColor}`}
                                    value="594"
                                    textSize="text-[5vw] max-[1025px]:text-[7vw] max-md:text-[12vw] md:text-[3.2vw]"
                                    color={textColor}
                                    fontWeight="normal"
                                    duration={duration}
                                    stagger={stagger}
                                    reducedMotion={prefersReducedMotion}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleReplayTwo}
                                disabled={prefersReducedMotion}
                                className="mt-6 px-5 py-2 max-md:text-sm max-[1025px]:text-lg rounded-full bg-[#111111] text-white text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                Replay
                            </button>
                        </div>

                        <div className="flex-1 min-w-[260px] rounded-md border border-black/10 bg-white shadow-sm p-8 flex flex-col items-center">
                            <div className="flex-1 w-full flex items-center justify-center">
                                <NumberCounterThree
                                    key={`${replayThreeKey}-${duration}-${stagger}-${textColor}`}
                                    value="246"
                                    duration={duration}
                                    stagger={stagger}
                                    fontWeight="medium"
                                    textColor={textColor}
                                    textSize="text-[5vw] max-[1025px]:text-[7vw] max-md:text-[12vw] md:text-[3.2vw]"
                                    reducedMotion={prefersReducedMotion}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleReplayThree}
                                disabled={prefersReducedMotion}
                                className="mt-6 px-5 py-2 max-md:text-sm max-[1025px]:text-lg rounded-full bg-[#111111] text-white text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                Replay
                            </button>
                        </div>
                    </div>
                    <style>{`
                        @keyframes number-counter-static-fade {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                </div>
            </div>
        </>
    )
}
