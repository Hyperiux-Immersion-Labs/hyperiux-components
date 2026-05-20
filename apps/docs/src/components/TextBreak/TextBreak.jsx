'use client'
import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function TextBreak({
  text = "",
  bgColor = "bg-black",
  textColor = "text-white",
}) {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const introRef = useRef(null);

  // Height based on word count + baseline 600vh
  const dynamicHeight = useMemo(() => {
    const words = text.trim().split(/\s+/).length;
    const baseHeight = 600;
    const baseWords = 20;
    const scale = words / baseWords;
    const calculated = baseHeight * scale;
    const clamped = Math.max(300, Math.min(calculated, 2000));
    return `${clamped}vh`;
  }, [text]);

  // Fade out intro on scroll — tied to scroll progress within the section
  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const sectionTop = sectionRef.current?.offsetTop ?? 0;
      const progress = Math.min((scrollY - sectionTop) / 120, 1);
      intro.style.opacity = String(1 - progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textEl = textRef.current;

      const split = SplitText.create(textEl, { type: "chars,words" });

      const scrollTween = gsap.to(textEl, {
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

      split.chars.forEach((char) => {
        gsap.from(char, {
          yPercent: gsap.utils.random(-200, 200),
          rotation: gsap.utils.random(-20, 20),
          ease: "elastic.out(1,0.8)",
          scrollTrigger: {
            trigger: char,
            containerAnimation: scrollTween,
            start: "left 100%",
            end: "left 30%",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [text]);

  return (
    <div
      ref={sectionRef}
      className={`relative ${bgColor}`}
      style={{ height: dynamicHeight }}
    >
      {/* ── Sticky viewport container — rendered first so it's in the viewport from scroll 0 ── */}
      <div
        ref={wrapperRef}
        className="sticky top-0 h-screen flex items-center"
        style={{ overflow: "clip" }}
      >
        {/* Horizontally scrolling text */}
        <h3
          ref={textRef}
          className={`flex whitespace-nowrap gap-[4vw] font-sans! tracking-tighter pl-[100vw] font-bold leading-[1.1] ${textColor}`}
          style={{
            fontSize: "clamp(2rem, 10vw, 12rem)",
            width: "max-content",
          }}
        >
          {text}
        </h3>

        {/* ── Intro overlay — absolute inside the sticky container so it sits on top ── */}
        <div
          ref={introRef}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          {/* Radial glow blob */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 70% 55% at 50% 52%, rgba(255,255,255,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Top-left label */}
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

          {/* Top-right label */}
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

          {/* Centre content */}
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
            {/* Decorative grid lines */}
            <svg
              width="320"
              height="1"
              style={{ opacity: 0.12 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="0" y1="0" x2="320" y2="0" stroke="white" strokeWidth="1" />
            </svg>

            {/* Eyebrow */}
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

            {/* Main headline */}
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
              <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.45)" }}>
                in motion.
              </em>
            </h2>

            {/* Sub copy */}
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

            {/* Animated scroll caret */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
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
              {/* Animated chevrons */}
              <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <polyline className="chev1" points="2,2 10,9 18,2" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline className="chev2" points="2,10 10,17 18,10" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline className="chev3" points="2,18 10,25 18,18" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Bottom-left corner mark */}
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

          {/* Bottom thin rule */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "10%",
              right: "10%",
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}