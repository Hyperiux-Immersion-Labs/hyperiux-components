"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import RotationCard from "./RotationCard";

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
const TEXT_FADE_DURATION = 0.3;
const TEXT_STAGGER = 0.01;
const TEXT_Y_OFFSET = 20;
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function RotationSlider({ images }) {
  // State and refs

  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const wrappersRef = useRef([]);
  const textsRef = useRef([]);

  // Effects

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
      // Horizontal scroll

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

      let activeIndex = -1;

      // Text animation

      const animateTextIn = (index) => {
        if (activeIndex === index) return;

        if (activeIndex !== -1 && textsRef.current[activeIndex]) {
          const prevText = textsRef.current[activeIndex];
          gsap.killTweensOf(prevText.querySelectorAll("div"));
          gsap.to(prevText, { opacity: 0, duration: TEXT_FADE_DURATION });
        }

        activeIndex = index;
        const currentText = textsRef.current[index];
        if (currentText && currentText.innerText.trim() !== "") {
          gsap.set(currentText, { opacity: 1 });
          const split = new SplitText(currentText, { type: "chars,words" });

          gsap.fromTo(
            split.chars,
            { opacity: 0, y: TEXT_Y_OFFSET },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: TEXT_STAGGER,
              ease: "power2.out",
              onComplete: () => split.revert(),
            }
          );
        }
      };

      // Card timelines

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
            start: "left 90%",
            end: "right 10%",
            scrub: true,
          },
        });

        ScrollTrigger.create({
          trigger: wrapper,
          containerAnimation: horizontalTween,
          start: "center 55%",
          end: "center 45%",
          onEnter: () => animateTextIn(index),
          onEnterBack: () => animateTextIn(index),
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
        )
          .to(card, {
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

  // Return

  return (
    <div ref={outerRef} className="relative bg-white">
      <div className="pointer-events-none fixed bottom-10 left-10 z-50 max-sm:bottom-5 max-sm:left-4">
        {images.map((img, i) => (
          <div
            key={i}
            ref={(el) => (textsRef.current[i] = el)}
            className="absolute bottom-0 left-0 whitespace-nowrap text-2xl text-neutral-900 opacity-0 max-sm:text-base"
          >
            {img.text || `Image ${i + 1}`}
          </div>
        ))}
      </div>
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
          {images.map((img, i) => (
            <div
              key={i}
              ref={(el) => (wrappersRef.current[i] = el)}
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
                ref={(el) => (cardsRef.current[i] = el)}
                src={img.src}
                index={i}
                total={images.length}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
