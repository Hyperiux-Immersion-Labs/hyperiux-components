"use client";

import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// True when the user has asked the OS to minimise animation. Safe to call
// during render - returns false on the server.
function prefersReducedMotion() {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

// Reduced motion: a much larger perspective distance flattens the 3D card
// rotation (less depth distortion) instead of removing it outright.
const REDUCED_PERSPECTIVE = "4800px";

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

// Reduced motion: cut the card rotation down a lot (not just the perspective
// flattening above) - "reduce a lot", so a stronger cut than the 25% factor
// used elsewhere.
const ROTATION_REDUCTION_FACTOR = 0.15;

const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

gsap.registerPlugin(ScrollTrigger);

interface RotationSliderImage {
    src?: string;
    text?: string;
}

interface RotationSliderCompProps {
    images: RotationSliderImage[];
    rotationAmount?: number;
    verticalDrift?: number;
    scrollSmoothing?: number;
    perspective?: number;
    showCaptions?: boolean;
    textColor?: string;
}

export function RotationSliderComp({
    images,
    rotationAmount = 1,
    verticalDrift = 1,
    scrollSmoothing = 1,
    perspective = 1200,
    showCaptions = true,
    textColor = "#ffffff",
}: RotationSliderCompProps) {
    const outerRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);
    const reducedMotion = prefersReducedMotion();

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
                    // Reduced motion: scrub:true tracks scroll position
                    // directly (no smoothing lag) instead of the ~1s
                    // catch-up delay - the "lerp" here is that scrub value.
                    scrub: reducedMotion ? true : scrollSmoothing,
                    invalidateOnRefresh: true,
                },
            });

            cardsRef.current.forEach((card, index) => {
                const wrapper = wrappersRef.current[index];

                if (!card || !wrapper) return;

                const total = images.length;
                const mid = Math.floor(total / 2);

                const step = (isMobile
                    ? MOBILE_STEP
                    : isTablet
                        ? TABLET_STEP
                        : DESKTOP_STEP) * verticalDrift;

                let offset: number;

                if (index < mid) {
                    offset = -((mid - index) * step);
                } else {
                    offset = (index - mid + 1) * step;
                }

                const rotationScale = reducedMotion ? ROTATION_REDUCTION_FACTOR : 1;

                const rotateXValue =
                    (offset < 0 ? ROTATE_X_NEGATIVE : ROTATE_X_POSITIVE) * rotationScale;

                const rotateInValue =
                    (isMobile
                        ? MOBILE_ROTATE_IN
                        : isTablet
                            ? TABLET_ROTATE_IN
                            : DESKTOP_ROTATE_IN) * rotationScale * rotationAmount;

                const rotateOutValue =
                    (isMobile
                        ? MOBILE_ROTATE_OUT
                        : isTablet
                            ? TABLET_ROTATE_OUT
                            : DESKTOP_ROTATE_OUT) * rotationScale * rotationAmount;

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
                        rotateY: rotateInValue,
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
                    rotateY: rotateOutValue,
                    opacity: 0.9,
                    y: `${-offset}vh`,
                    ease: "none",
                });
            });

            ScrollTrigger.refresh();
        });

        return () => context.revert();
    }, [images, rotationAmount, verticalDrift, scrollSmoothing]);

    return (
        <div ref={outerRef} className="relative bg-white">
            <div
                className="sticky top-0 flex h-screen items-center overflow-hidden"
                style={{ perspective: reducedMotion ? REDUCED_PERSPECTIVE : `${perspective}px` }}
            >
                <div
                    ref={trackRef}
                    className="
            flex h-full items-center will-change-transform
            gap-[5vw] max-[1025px]:gap-[8vw] max-md:gap-[12vw]
            pl-[31vw] pr-[31vw]
            max-[1025px]:pl-[22vw] max-[1025px]:pr-[22vw]
            max-md:pl-[12vw] max-md:pr-[12.5vw]
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
                max-[1025px]:h-[40vh] max-[1025px]:w-[55vw]
                max-md:h-[35vh] max-md:w-[75vw]
                max-[1025px]:[&>div]:h-[40vh] max-[1025px]:[&>div]:w-[50vw]
                max-md:[&>div]:h-[35vh] max-md:[&>div]:w-[75vw]
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
                                showCaptions={showCaptions}
                                textColor={textColor}
                            />
                        </div>
                    ))}
                </div>
               
            </div>
        </div>
    );
}

interface RotationCardProps {
    src?: string;
    index: number;
    total: number;
    text?: string;
    showCaptions: boolean;
    textColor: string;
}

const RotationCard = forwardRef<HTMLDivElement, RotationCardProps>(({ src, index, total, text, showCaptions, textColor }, ref) => {
    return (
        <div
            ref={ref}
            className="absolute h-[45vh] w-[38vw] origin-right overflow-hidden opacity-0 max-md:h-[35vh] max-md:w-[75vw]"
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
                <img
                    src={src}
                    alt="slider"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>

            {showCaptions && text && (
                <div
                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center text-[1.4vw] font-medium max-[1025px]:text-[2.4vw] max-md:text-[4vw]"
                    style={{
                        color: textColor,
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
