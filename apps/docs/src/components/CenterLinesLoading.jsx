"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("centerLinesEase", "0.75,-0.01,0.16,1");

const DEFAULT_LINE_COUNT = 33;
const LINE_H = 1;
const EDGE_PAD = 12; // minimum vertical padding
const DIAMOND_MAX = 0.92; // scaleX at center line
const DIAMOND_MIN = 0.06; // scaleX at top/bottom lines

const STAGGER_MS = 34;
const APPEAR_MS = 260;
const MORPH_MS = 720;
const PAIR_FADE_MS = 260;
const TRANSLATE_UP_MS = 820;
const HOLD_END_MS = 260;

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function prefersReducedMotion() {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export default function CenterLinesLoading(
    {
        lineCount = DEFAULT_LINE_COUNT,
        title = "Build better interfaces",
        subtitle = "Hyperiux UI",
        onComplete,
    } = {}
) {
    const containerRef = useRef(null);
    const blackPanelRef = useRef(null);
    const revealPanelRef = useRef(null);
    const linesWrapRef = useRef(null);
    const heroWordRefs = useRef([]);
    const heroSubtitleRef = useRef(null);
    const lineRefs = useRef([]);
    const tlRef = useRef(null);
    const layoutRef = useRef({ y: [], coneScale: [] });
    const [done, setDone] = useState(false);

    const recomputeLayout = useCallback((lineCount) => {
        const el = containerRef.current;
        if (!el) return;
        const { height } = el.getBoundingClientRect();
        const h = Math.max(1, Math.round(height));

        const count = Math.max(3, Math.floor(lineCount));
        const mid = (count - 1) / 2;
        const usable = Math.max(1, h - EDGE_PAD * 2);
        const spacing = usable / Math.max(1, count - 1);
        const topY = EDGE_PAD;

        const y = [];
        const coneScale = [];

        for (let i = 0; i < count; i++) {
            y.push(Math.round(topY + i * spacing));

            // Linear falloff gives a crisp"diamond" edge (not a curved funnel).
            const t = mid === 0 ? 0 : Math.abs(i - mid) / mid; // 0 at center, 1 at extremes
            const wPct = lerp(DIAMOND_MAX, DIAMOND_MIN, t);
            coneScale.push(wPct);
        }

        layoutRef.current = { y, coneScale };
    }, []);

    const heroWords = title.split("").filter((c) => c !== " ");
    const words = title.split(" ");

    const run = useCallback(() => {
        tlRef.current?.kill();
        setDone(false);

        const count = Math.max(3, Math.floor(lineCount));
        recomputeLayout(count);

        const lines = lineRefs.current.slice(0, count);
        const { y, coneScale } = layoutRef.current;

        const wordEls = heroWordRefs.current.slice(0, heroWords.length).filter(Boolean);

        gsap.set(blackPanelRef.current, { yPercent: 0, opacity: 1 });
        gsap.set(revealPanelRef.current, { scaleY: 0, transformOrigin: "50% 50%" });
        gsap.set(linesWrapRef.current, { opacity: 1 });
        gsap.set(wordEls, { opacity: 0, y: 16, filter: "blur(12px)" });
        gsap.set(heroSubtitleRef.current, { opacity: 0, y: 14, filter: "blur(10px)" });
        gsap.set(lines, {
            opacity: 1,
            left: "50%",
            xPercent: -50,
            y: (i) => y[i],
            scaleX: 0,
            transformOrigin: "50% 50%",
        });

        if (prefersReducedMotion()) {
            gsap.set(lines, { scaleX: 1 });
            gsap.set(linesWrapRef.current, { opacity: 0 });
            gsap.set(revealPanelRef.current, { scaleY: 1 });
            gsap.set(wordEls, { opacity: 1, y: 0, filter: "blur(0px)" });
            gsap.set(heroSubtitleRef.current, { opacity: 1, y: 0, filter: "blur(0px)" });
            setDone(true);
            onComplete?.();
            return;
        }

        const staggerS = STAGGER_MS / 1000;
        const appearS = APPEAR_MS / 1000;
        const morphS = MORPH_MS / 1000;
        const totalS = appearS + morphS;
        const appearPct = totalS === 0 ? 1 : appearS / totalS;
        const scaleSetters = lines.map((el) => (el ? gsap.quickSetter(el, "scaleX") : null));

        const tl = gsap.timeline({
            defaults: { ease: "centerLinesEase" },
            onComplete: () => {
                setDone(true);
                onComplete?.();
            },
        });
        tlRef.current = tl;

        const mid = (count - 1) / 2;
        const orderIdx = Array.from({ length: count }, (_, i) => i).sort((a, b) => {
            const da = Math.abs(a - mid);
            const db = Math.abs(b - mid);
            return da - db;
        });

        for (let i = 0; i < count; i++) {
            const idx = orderIdx[i];
            const startAt = i * staggerS;
            const setScaleX = scaleSetters[idx];
            if (!setScaleX) continue;

            const driver = { p: 0 };
            tl.to(
                driver,
                {
                    p: 1,
                    duration: totalS,
                    onUpdate: () => {
                        const p = driver.p;
                        const scaled =
                            p <= appearPct
                                ? coneScale[idx] * (appearPct === 0 ? 1 : p / appearPct)
                                : coneScale[idx] + (1 - coneScale[idx]) * ((p - appearPct) / (1 - appearPct));
                        setScaleX(scaled);
                    },
                },
                startAt
            );
        }

        const lastStart = (count - 1) * staggerS;
        const allLinesEnd = lastStart + totalS;

        // Fade top+bottom lines in synchronous pairs, leaving only the middle line.
        const midIdx = Math.floor((count - 1) / 2);
        const pairCount = midIdx;
        const pairFadeDur = PAIR_FADE_MS / 1000;
        const pairGap = 0.045;
        for (let k = 0; k < pairCount; k++) {
            const a = k;
            const b = count - 1 - k;
            tl.to(
                [lines[a], lines[b]].filter(Boolean),
                { opacity: 0, duration: pairFadeDur },
                allLinesEnd + k * pairGap
            );
        }

        const pairsEnd = allLinesEnd + (pairCount - 1) * pairGap + pairFadeDur;
        const revealStart = pairsEnd + 0.02;

        // Page reveal: white expands from the center to top and bottom.
        tl.to(
            revealPanelRef.current,
            { scaleY: 1, duration: TRANSLATE_UP_MS / 1000 },
            revealStart
        );
        tl.to(
            blackPanelRef.current,
            { opacity: 0, duration: TRANSLATE_UP_MS / 1000 + 0.25 },
            revealStart + 0.14
        );
        tl.to(linesWrapRef.current, { opacity: 0, duration: 0.22 }, revealStart + 0.06);
        tl.to(lines[midIdx], { opacity: 0, duration: 0.22 }, revealStart + 0.06);

        tl.to(
            wordEls,
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.78,
                stagger: 0.06,
            },
            revealStart + 0.18
        );
        tl.to(
            heroSubtitleRef.current,
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.68,
            },
            revealStart + 0.32
        );
        tl.to({}, { duration: Math.max(0, HOLD_END_MS / 1000) }, revealStart + TRANSLATE_UP_MS / 1000);
    }, [heroWords.length, lineCount, onComplete, recomputeLayout, title]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const count = Math.max(3, Math.floor(lineCount));
        const ro = new ResizeObserver(() => recomputeLayout(count));
        ro.observe(el);

        const id = setTimeout(run, 60);
        return () => {
            clearTimeout(id);
            ro.disconnect();
            tlRef.current?.kill();
        };
    }, [lineCount, recomputeLayout, run]);

    let charIdx = 0;
    return (
        <div ref={containerRef} className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
            <div
                ref={blackPanelRef}
                className="absolute inset-0 z-20 bg-black will-change-transform"
            />
            <div
                ref={revealPanelRef}
                className="absolute inset-0 z-30 bg-white scale-y-0 will-change-transform"
            />
            <div className="absolute inset-0 z-50 flex items-center justify-center">
                <div className="px-6 text-center">
                    <h1 className="select-none font-mono text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] text-black md:text-[52px]">
                        {words.map((word, wordIdx) => (
                            <span key={`${word}-${wordIdx}`}>
                                <span className="inline-block whitespace-nowrap">
                                    {word.split("").map((char, charIdxInWord) => {
                                        const currentIdx = charIdx++;
                                        return (
                                            <span
                                                key={`${char}-${charIdxInWord}`}
                                                ref={(el) => (heroWordRefs.current[currentIdx] = el)}
                                                className="inline-block opacity-0"
                                            >
                                                {char}
                                            </span>
                                        );
                                    })}
                                </span>
                                {wordIdx === words.length - 1 ? "" : " "}
                            </span>
                        ))}
                    </h1>
                    <p
                        ref={heroSubtitleRef}
                        className="mt-4 select-none font-mono text-[13px] tracking-[0.18em] text-black/70 opacity-0"
                    >
                        {subtitle}
                    </p>
                </div>
            </div>
            <div ref={linesWrapRef} className="pointer-events-none absolute inset-0 z-40 opacity-0">
                {Array.from({ length: Math.max(3, Math.floor(lineCount)) }, (_, i) => (
                    <div
                        key={i}
                        ref={(el) => (lineRefs.current[i] = el)}
                        className="absolute left-1/2 top-0 h-px w-full origin-center bg-white/60 will-change-transform"
                        style={{ height: LINE_H }}
                    />
                ))}
            </div>

            {done && (
                <button
                    onClick={run}
                    className="absolute bottom-7 left-1/2 z-60 -translate-x-1/2 cursor-pointer rounded-sm border border-black/20 bg-black/5 px-[22px] py-[7px] font-mono text-[11px] tracking-[0.1em] text-black/70 backdrop-blur"
                >
                    replay
                </button>
            )}
        </div>
    );
}
