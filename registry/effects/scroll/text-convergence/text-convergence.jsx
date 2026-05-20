'use client'

import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function TextConvergence({
  text = "Build faster. Animate better. Ship smarter.",
  bgColor = "#111111",
  textColor = "#4F39F6",
}) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  const dynamicHeight = useMemo(() => {
    const words = text.trim().split(/\s+/).length;
    const baseHeight = 600;
    const baseWords = 20;
    const scale = words / baseWords;
    const clamped = Math.max(300, Math.min(baseHeight * scale, 2000));
    return `${clamped}vh`;
  }, [text]);

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
    <div ref={sectionRef} style={{ position: "relative", height: dynamicHeight, background: bgColor }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <h3
          ref={textRef}
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            gap: "4vw",
            fontFamily: "sans-serif",
            letterSpacing: "-0.05em",
            paddingLeft: "100vw",
            fontWeight: 700,
            lineHeight: 1.1,
            fontSize: "clamp(2rem, 10vw, 12rem)",
            width: "max-content",
            color: textColor,
          }}
        >
          {text}
        </h3>
      </div>
    </div>
  );
}
