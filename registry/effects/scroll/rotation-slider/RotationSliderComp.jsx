"use client";

import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Mouse } from "lucide-react";

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1025;

const MOBILE_STEP = 2;
const TABLET_STEP = 6;
const DESKTOP_STEP = 10;

const MOBILE_ROTATE_IN = -60;
const TABLET_ROTATE_IN = -80;
const DESKTOP_ROTATE_IN = -100;

const MOBILE_ROTATE_OUT = 50;
const TABLET_ROTATE_OUT = 65;
const DESKTOP_ROTATE_OUT = 80;

const ROTATE_X_NEGATIVE = 5;
const ROTATE_X_POSITIVE = -5;

const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

gsap.registerPlugin(ScrollTrigger);

export function RotationSliderComp({ images }) {
    const outerRef = useRef(null);
    const trackRef = useRef(null);
    const cardsRef = useRef([]);
    const wrappersRef = useRef([]);

    useEffect(() => {
        const outer = outerRef.current;
        const track = trackRef.current;

        if (!outer || !track) return;

        const onResize = () => {
            const travel = track.scrollWidth - window.innerWidth;
            outer.style.height = `${travel + window.innerHeight}px`;
        };

        onResize();

        const resizeObserver = new ResizeObserver(onResize);

        resizeObserver.observe(track);
        window.addEventListener("resize", onResize);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, [images]);

    useIsomorphicLayoutEffect(() => {
        const outer = outerRef.current;
        const track = trackRef.current;

        if (!outer || !track) return;

        const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
        const isTablet =
            window.innerWidth >= MOBILE_BREAKPOINT &&
            window.innerWidth < TABLET_BREAKPOINT;

        const context = gsap.context(() => {
            const horizontalTween = gsap.to(track, {
                x: () => -(track.scrollWidth - window.innerWidth),
                ease: "none",
                scrollTrigger: {
                    trigger: outer,
                    start: "top top",
                    end: () => `+=${track.scrollWidth - window.innerWidth}`,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });

            cardsRef.current.forEach((card, index) => {
                const wrapper = wrappersRef.current[index];

                if (!card || !wrapper) return;

                const total = images.length;
                const mid = Math.floor(total / 2);

                const step = isMobile
                    ? MOBILE_STEP
                    : isTablet
                        ? TABLET_STEP
                        : DESKTOP_STEP;

                let offset;

                if (index < mid) {
                    offset = -((mid - index) * step);
                } else {
                    offset = (index - mid + 1) * step;
                }

                const rotateXValue =
                    offset < 0 ? ROTATE_X_NEGATIVE : ROTATE_X_POSITIVE;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: wrapper,
                        containerAnimation: horizontalTween,
                        start: "left 100%",
                        end: "right 0%",
                        scrub: true,
                        // markers:true
                    },
                });

                tl.fromTo(
                    card,
                    {
                        rotateY: isMobile
                            ? MOBILE_ROTATE_IN
                            : isTablet
                                ? TABLET_ROTATE_IN
                                : DESKTOP_ROTATE_IN,
                        rotateX: rotateXValue,
                        opacity: 0.8,
                        y: `${offset}vh`,
                    },
                    {
                        rotateY: 0,
                        rotateX: 0,
                        opacity: 1,
                        y: 0,
                        ease: "none",
                    }
                ).to(card, {
                    rotateY: isMobile
                        ? MOBILE_ROTATE_OUT
                        : isTablet
                            ? TABLET_ROTATE_OUT
                            : DESKTOP_ROTATE_OUT,
                    opacity: 0.9,
                    y: `${-offset}vh`,
                    ease: "none",
                });
            });

            ScrollTrigger.refresh();
        });

        return () => context.revert();
    }, [images]);

    return (
        <div ref={outerRef} className="relative bg-white">
            <div
                className="sticky top-0 flex h-screen items-center overflow-hidden"
                style={{ perspective: "1200px" }}
            >
                <div
                    ref={trackRef}
                    className="
            flex h-full items-center will-change-transform
            gap-[5vw] max-md:gap-[8vw] max-sm:gap-[12vw]
            pl-[31vw] pr-[31vw]
            max-md:pl-[22vw] max-md:pr-[22vw]
            max-sm:pl-[12vw] max-sm:pr-[12.5vw]
          "
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {images.map((img, index) => (
                        <div
                            key={index}
                            ref={(element) => {
                                wrappersRef.current[index] = element;
                            }}
                            className="
                relative flex h-[45vh] w-[38vw] shrink-0 items-center justify-center
                max-md:h-[40vh] max-md:w-[55vw]
                max-sm:h-[35vh] max-sm:w-[75vw]
                max-md:[&>div]:h-[40vh] max-md:[&>div]:w-[50vw]
                max-sm:[&>div]:h-[35vh] max-sm:[&>div]:w-[75vw]
              "
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <RotationCard
                                ref={(element) => {
                                    cardsRef.current[index] = element;
                                }}
                                src={img.src}
                                text={img.text}
                                index={index}
                                total={images.length}
                            />
                        </div>
                    ))}
                </div>
               
            </div>
        </div>
    );
}

const RotationCard = forwardRef(({ src, index, total, text }, ref) => {
    return (
        <div
            ref={ref}
            className="absolute h-[45vh] w-[38vw] origin-right overflow-hidden opacity-0 max-sm:h-[35vh] max-sm:w-[75vw]"
            style={{
                transformStyle: "preserve-3d",
                zIndex: total - index,
            }}
        >
            <div
                className="relative h-full w-full"
                style={{
                    transformStyle: "preserve-3d",
                }}
            >
                <Image
                    src={src}
                    alt="slider"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {text && (
                <div
                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center text-[1.4vw] font-medium text-white max-md:text-[2.4vw] max-sm:text-[4vw]"
                    style={{
                        textShadow:
                            "0 0.15vw 0.35vw rgba(0,0,0,0.35), 0 0.45vw 1.2vw rgba(0,0,0,0.35)",
                    }}
                >
                    {text}
                </div>
            )}
        </div>
    );
});

RotationCard.displayName = "RotationCard";