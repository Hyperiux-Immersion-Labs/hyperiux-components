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
const GLOW_BACKGROUND =
  "radial-gradient(ellipse 70% 55% at 50% 52%, rgba(255,255,255,0.06) 0%, transparent 70%)";
const BOTTOM_RULE_BACKGROUND =
  "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)";

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

export default function TextBreak({
  text = "",
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
            scrub: 1,
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
      className={`relative ${bgColor}`}
      style={{ height: dynamicHeight }}
    >
      <div
        className="sticky top-0 flex h-screen items-center"
        style={{ overflow: "clip" }}
      >
        <h3
          ref={textRef}
          className={`flex whitespace-nowrap gap-[4vw] pl-[100vw] font-bold leading-[1.1] tracking-tighter font-sans! ${textColor}`}
          style={{
            fontSize: "clamp(2rem, 10vw, 12rem)",
            width: "max-content",
          }}
        >
          {text}
        </h3>

        <div
          ref={introRef}
          className="pointer-events-none absolute inset-0 z-20"
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: GLOW_BACKGROUND,
              pointerEvents: "none",
            }}
          />

          <span
            style={{
              position: "absolute",
              top: "2.2rem",
              left: "2.4rem",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            scroll experience
          </span>

          <span
            style={{
              position: "absolute",
              top: "2.2rem",
              right: "2.4rem",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            v1.0
          </span>

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2.4rem",
            }}
          >
            <svg
              width="320"
              height="1"
              style={{ opacity: 0.12 }}
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
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                margin: 0,
              }}
            >
              — kinetic typography —
            </p>

            <h2
              style={{
                margin: 0,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(3.2rem, 10vw, 9rem)",
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "rgba(255,255,255,0.92)",
                textAlign: "center",
                maxWidth: "14ch",
              }}
            >
              Words
              <br />
              <em
                style={{
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                in motion.
              </em>
            </h2>

            <p
              style={{
                margin: 0,
                fontFamily: "'Courier New', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.3)",
                textAlign: "center",
                maxWidth: "32ch",
                lineHeight: 1.7,
              }}
            >
              Each character assembles as you scroll.
              <br />
              Drag the page downward to begin.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                scroll
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
            style={{
              position: "absolute",
              bottom: "2.2rem",
              left: "2.4rem",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            gsap · splittext
          </span>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "10%",
              right: "10%",
              height: "1px",
              background: BOTTOM_RULE_BACKGROUND,
            }}
          />
        </div>
      </div>
    </div>
  );
}
