'use client';

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const BASE_HEIGHT_VH = 600;
const MIN_HEIGHT_VH = 300;
const MAX_HEIGHT_VH = 2000;
const BASE_WORD_COUNT = 20;
const INTRO_FADE_DISTANCE = 120;
const CHARACTER_SPLIT_TYPE = "chars,words";
const CHARACTER_Y_PERCENT_MIN = -200;
const CHARACTER_Y_PERCENT_MAX = 200;
const CHARACTER_ROTATION_MIN = -20;
const CHARACTER_ROTATION_MAX = 20;
const CHARACTER_EASE = "elastic.out(1,0.8)";

const getDynamicHeight = (text) => {
  const trimmedText = text.trim();
  const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
  const scale = words / BASE_WORD_COUNT;
  const calculatedHeight = BASE_HEIGHT_VH * scale;
  const clampedHeight = Math.max(
    MIN_HEIGHT_VH,
    Math.min(calculatedHeight, MAX_HEIGHT_VH)
  );

  return `${clampedHeight}vh`;
};

gsap.registerPlugin(ScrollTrigger, SplitText);

export function TextBreak({
  text = "Build faster. Animate better. Ship smarter. Hyperiux Vault gives you the tools to create high-performance interfaces that look premium and feel effortless.",
  bgColor = "bg-black",
  textColor = "text-white",
}) {
  // State and refs
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const introRef = useRef(null);

  // Derived values
  const dynamicHeight = useMemo(() => getDynamicHeight(text), [text]);

  // Effects
  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    sectionRef.current.style.setProperty("--text-break-height", dynamicHeight);
  }, [dynamicHeight]);

  useEffect(() => {
    const introElement = introRef.current;

    if (!introElement) {
      return;
    }

    const onScroll = () => {
      const scrollY = window.scrollY;
      const sectionTop = sectionRef.current?.offsetTop ?? 0;
      const fadeProgress = Math.min(
        (scrollY - sectionTop) / INTRO_FADE_DISTANCE,
        1
      );

      introElement.style.opacity = String(1 - fadeProgress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const context = gsap.context(() => {
      const textElement = textRef.current;

      if (!textElement) {
        return;
      }

      const split = SplitText.create(textElement, {
        type: CHARACTER_SPLIT_TYPE,
      });

      const scrollTween = gsap.to(textElement, {
        xPercent: -100,
        ease: "linear",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 70%",
          scrub: true,
          markers: false,
          scroller: window,
          invalidateOnRefresh: true,
        },
      });

      split.chars.forEach((character) => {
        gsap.from(character, {
          yPercent: gsap.utils.random(
            CHARACTER_Y_PERCENT_MIN,
            CHARACTER_Y_PERCENT_MAX
          ),
          rotation: gsap.utils.random(
            CHARACTER_ROTATION_MIN,
            CHARACTER_ROTATION_MAX
          ),
          ease: CHARACTER_EASE,
          scrollTrigger: {
            trigger: character,
            containerAnimation: scrollTween,
            start: "left 100%",
            end: "left 30%",
            scrub: 0.4,
          },
        });
      });
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, [text]);

  // Return
  return (
    <div
      ref={sectionRef}
      className={`relative h-(--text-break-height) ${bgColor}`}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-clip">
        <h3
          ref={textRef}
          className={`flex w-max whitespace-nowrap gap-[4vw] pl-[100vw] font-sans! text-4xl font-bold leading-[1.1] tracking-tighter sm:text-6xl lg:text-8xl xl:text-9xl ${textColor}`}
        >
          {text}
        </h3>

        <div
          ref={introRef}
          className="pointer-events-none absolute inset-0 z-20"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_52%,rgba(255,255,255,0.06)_0%,transparent_70%)]"
          />

          <span
            className="absolute top-[2.2rem] left-[2.4rem] font-mono text-xs uppercase tracking-[0.22vw] text-gray-400"
          >
            scroll experience
          </span>

          <span
            className="absolute top-[2.2rem] right-[2.4rem] font-mono text-xs uppercase tracking-[0.22vw] text-gray-400"
          >
            v1.0
          </span>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-[2.4rem]"
          >
            <svg
              width="320"
              height="1"
              className="opacity-[0.2]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0"
                y1="0"
                x2="320"
                y2="0"
                stroke="white"
                strokeWidth="1"
              />
            </svg>

            <p
              className="m-0 font-mono text-xs uppercase tracking-[0.3vw] text-gray-400"
            >
              — kinetic typography —
            </p>

            <h2
              className="m-0 max-w-[14ch] text-center font-serif text-5xl font-normal leading-none tracking-[-0.03vw] text-white/92 sm:text-6xl lg:text-8xl xl:text-9xl"
            >
              Words
              <br />
              <em className="text-white/45 italic">
                in motion.
              </em>
            </h2>

            <p
              className="m-0 max-w-100 text-center font-mono text-sm leading-[1.7] tracking-[0.08vw] text-white/80"
            >
              Each character assembles as you scroll.
            
              Drag the page downward to begin.
            </p>

            <div className="flex flex-col items-center gap-[2vw]">
  <span className="">
  <p className="font-mono text-xs uppercase tracking-[0.25vw] text-white/80">

                scroll
  </p>
              </span>

              <svg
                width="20"
                height="28"
                viewBox="0 0 20 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <style>{`
                  .chev1 { animation: fadeDown 1.4s ease-in-out infinite; }
                  .chev2 { animation: fadeDown 1.4s ease-in-out 0.22s infinite; }
                  .chev3 { animation: fadeDown 1.4s ease-in-out 0.44s infinite; }
                  @keyframes fadeDown {
                    0%   { opacity: 0.08; transform: translateY(-3px); }
                    50%  { opacity: 0.55; transform: translateY(2px); }
                    100% { opacity: 0.08; transform: translateY(-3px); }
                  }
                `}</style>
                <polyline
                  className="chev1"
                  points="2,2 10,9 18,2"
                  stroke="white"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  className="chev2"
                  points="2,10 10,17 18,10"
                  stroke="white"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  className="chev3"
                  points="2,18 10,25 18,18"
                  stroke="white"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <span
            className="absolute bottom-[2.2rem] left-[2.4rem] font-mono text-xs uppercase tracking-[0.18vw] text-gray-400"
          >
            gsap · splittext
          </span>

          <div
            className="absolute right-[10%] bottom-0 left-[10%] h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.12),transparent)]"
          />
        </div>
      </div>
    </div>
  );
}
