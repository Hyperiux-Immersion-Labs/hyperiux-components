'use client'
import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import NavigationButtons from "./NavigationButtons";
import Image from "next/image";

gsap.registerPlugin(SplitText);

export default function Testimonial({ testimonials = [], bgColor = "#ffffff" }) {
    const [current, setCurrent] = useState(0);
    const [displayItem, setDisplayItem] = useState(testimonials[0] ?? null);
    const [isAnimating, setIsAnimating] = useState(false);

    const quoteRef = useRef(null);
    const quoteMarkRef = useRef(null);
    const nameRef = useRef(null);
    const titleRef = useRef(null);
    const mobileNameRef = useRef(null);
    const mobileTitleRef = useRef(null);
    const desktopImageRef = useRef(null);
    const mobileImageRef = useRef(null);
    const imageRef = useRef(null);
    const splitRef = useRef(null);
    const prevCurrentRef = useRef(null);
    const pendingDirectionRef = useRef("next");
    const isAnimatingRef = useRef(false);

    const total = testimonials.length;
    const pad = (n) => String(n).padStart(2, "0");

    const animateIn = useCallback((direction) => {
        const yFrom = direction === "next" ? 110 : -110;

        if (splitRef.current) {
            splitRef.current.revert();
            splitRef.current = null;
        }
        gsap.set(quoteRef.current, { autoAlpha: 1 });

        splitRef.current = new SplitText(quoteRef.current, {
            type: "lines",
            linesClass: "split-line",
        });

        const lines = splitRef.current.lines;

        lines.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.style.overflow = "hidden";
            wrapper.style.display = "block";
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
        });

        gsap.set(lines, { yPercent: yFrom });
        gsap.set([
            desktopImageRef.current,
            mobileImageRef.current,
            nameRef.current,
            titleRef.current,
            mobileNameRef.current,
            mobileTitleRef.current,
            quoteMarkRef.current,
        ], {
            autoAlpha: 0,
        });

        const tl = gsap.timeline({
            onComplete: () => {
                setIsAnimating(false);
                isAnimatingRef.current = false;
            },
        });

        tl.to(lines, {
            yPercent: 0,
            duration: 0.85,
            ease: "power2.out",
            stagger: {
                each: 0.15,
                from: direction === "next" ? "start" : "end",
            },
        }).to(
            [
                desktopImageRef.current,
                mobileImageRef.current,
                nameRef.current,
                titleRef.current,
                mobileNameRef.current,
                mobileTitleRef.current,
                quoteMarkRef.current,
            ],
            {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                stagger: 0.15,
            },
            "<0.5"
        );
    }, []);

    const fadeOutCurrent = useCallback(() => {
        return new Promise((resolve) => {
            const targets = [
                quoteRef.current,
                imageRef.current,
                nameRef.current,
                titleRef.current,
                mobileNameRef.current,
                mobileTitleRef.current,
                quoteMarkRef.current,
            ];
            gsap.killTweensOf(targets);
            gsap.to(targets, {
                autoAlpha: 0,
                duration: 0.2,
                ease: "power1.in",
                onComplete: resolve,
            });
        });
    }, []);

    const handlePrev = useCallback(async () => {
        if (isAnimatingRef.current || total === 0) return;
        isAnimatingRef.current = true;
        setIsAnimating(true);

        await fadeOutCurrent();

        const nextIndex = (current - 1 + total) % total;
        pendingDirectionRef.current = "prev";

        if (splitRef.current) {
            splitRef.current.revert();
            splitRef.current = null;
        }

        setDisplayItem(testimonials[nextIndex]);
        setCurrent(nextIndex);
    }, [total, current, testimonials, fadeOutCurrent]);

    const handleNext = useCallback(async () => {
        if (isAnimatingRef.current || total === 0) return;
        isAnimatingRef.current = true;
        setIsAnimating(true);

        await fadeOutCurrent();

        const nextIndex = (current + 1) % total;
        pendingDirectionRef.current = "next";

        if (splitRef.current) {
            splitRef.current.revert();
            splitRef.current = null;
        }

        setDisplayItem(testimonials[nextIndex]);
        setCurrent(nextIndex);
    }, [total, current, testimonials, fadeOutCurrent]);

    useEffect(() => {
        if (!quoteRef.current) return;
        animateIn("next");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (prevCurrentRef.current === null) {
            prevCurrentRef.current = current;
            return;
        }
        if (prevCurrentRef.current !== current) {
            prevCurrentRef.current = current;
            animateIn(pendingDirectionRef.current);
        }
    }, [current, animateIn]);

    if (!testimonials.length || !displayItem) return null;

    return (
        <section className="relative w-full min-h-screen max-sm:min-h-[100vh] bg-white flex flex-col justify-between overflow-hidden text-black py-5"
            style={{ backgroundColor: bgColor }}
        >
            {/* Header */}
            <div className="flex items-start justify-between px-8 py-5 max-sm:px-5 max-sm:py-3">
                <div className="flex max-sm:flex-row justify-between items-center max-sm:items-center w-[30%] max-sm:w-full max-sm:justify-between">
                    <div className="flex items-center gap-2 text-[0.8vw] max-sm:text-[4vw] font-semibold tracking-[0.12em] uppercase">
                        <span className="text-[9px] max-sm:text-[15px]">◆</span>
                        <span>Client Stories</span>
                    </div>
                    <span className="text-[13px] max-sm:hidden max-sm:pl-4 text-neutral-700 tabular-nums">
                        {pad(current + 1)}&nbsp;/&nbsp;{pad(total)}
                    </span>
                </div>

                <NavigationButtons
                    className="max-sm:hidden"
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            </div>

            {/* Body */}
            <div className="flex-1 flex items-start gap-32 px-18 py-5 max-md:flex-col max-md:items-start max-md:gap-8 max-md:px-6 max-md:py-10 max-sm:px-5 max-sm:py-4 max-sm:gap-6">

                <div className="shrink-0 max-sm:hidden">
                    <div ref={desktopImageRef} className="relative w-40 h-50">
                        <Image
                            src={displayItem.image}
                            alt={displayItem.name}
                            fill
                            className="object-cover object-top grayscale"
                        />
                    </div>
                </div>

                {/* Quote area */}
                <div className="flex-1 flex flex-col relative">
                    <span
                        className="absolute -top-1.5 font-serif font-bold leading-none text-[48px] max-md:text-[36px] max-sm:text-[40px] max-sm:relative max-sm:top-0 max-sm:left-0 max-sm:mb-2"
                        style={{ left: 0 }}
                        ref={quoteMarkRef}
                    >
                        &quot;
                    </span>

                    <div className="flex flex-col pl-13 w-[95%] max-md:pl-9 max-sm:pl-0 max-sm:w-full">
                        <blockquote
                            ref={quoteRef}
                            className="m-0 mb-10 p-0 text-[4vw] leading-[1.1] max-sm:text-[7.5vw] max-sm:mb-6"
                        >
                            {displayItem.quote}
                        </blockquote>

                        {/* Mobile: image + name/title in a row */}
                        <div className="hidden max-sm:flex items-center gap-4 mt-6 max-sm:gap-6">
                            <div ref={mobileImageRef} className="relative w-22 h-26 shrink-0">
                                <Image
                                    src={displayItem.image}
                                    alt={displayItem.name}
                                    fill
                                    className="object-cover object-top grayscale"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p ref={mobileNameRef} className="m-0 text-xl font-normal">
                                    {displayItem.name}
                                </p>
                                <p
                                    ref={mobileTitleRef}
                                    className="m-0 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#888]"
                                >
                                    {displayItem.title}
                                </p>
                            </div>
                        </div>

                        {/* Desktop: name/title */}
                        <div className="flex flex-col gap-1 mt-2 max-sm:hidden">
                            <p ref={nameRef} className="m-0 text-xl font-normal">
                                {displayItem.name}
                            </p>
                            <p
                                ref={titleRef}
                                className="m-0 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#888]"
                            >
                                {displayItem.title}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}