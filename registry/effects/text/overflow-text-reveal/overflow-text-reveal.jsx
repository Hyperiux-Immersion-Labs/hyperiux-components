"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export function OverflowTextReveal({
  children,
  animateOnScroll = true,
  delay = 0,
  className = "",
  scrub = true,
}) {
  const containerRef = useRef(null);
  const splitRefs = useRef([]);
  const linesRef = useRef([]);
  const triggersRef = useRef([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    splitRefs.current = [];
    linesRef.current = [];
    triggersRef.current = [];

    const elements = Array.from(el.children);

    const waitForFonts = async () => {
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {}
      }
    };

    let unmounted = false;

    (async () => {
      await waitForFonts();
      if (unmounted) return;

      elements.forEach((element) => {
        const split = SplitText.create(element, {
          type: "lines",
          mask: "lines",
          linesClass: "line",
          lineThreshold: 0.1,
        });

        splitRefs.current.push(split);

        const textIndent = getComputedStyle(element).textIndent;
        if (textIndent && textIndent !== "0px" && split.lines.length > 0) {
          split.lines[0].style.paddingLeft = textIndent;
          element.style.textIndent = "0";
        }

        linesRef.current.push(...split.lines);
      });

      if (!linesRef.current.length) return;

      if (prefersReduced) {
        gsap.set(linesRef.current, { y: "0%" });
        return;
      }

      gsap.set(linesRef.current, { y: "100%" });

      const animationProps = {
        y: "0%",
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
        delay,
        onComplete: () =>
          gsap.set(linesRef.current, { clearProps: "transform" }),
      };

      if (animateOnScroll) {
        const tween = gsap.to(linesRef.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            scrub,
          },
        });

        if (tween?.scrollTrigger) {
          triggersRef.current.push(tween.scrollTrigger);
        }
      } else {
        gsap.to(linesRef.current, animationProps);
      }
    })();

    return () => {
      unmounted = true;

      triggersRef.current.forEach((trigger) => trigger?.kill());
      triggersRef.current = [];

      splitRefs.current.forEach((split) => split?.revert());
      splitRefs.current = [];

      linesRef.current = [];
    };
  }, [animateOnScroll, delay, scrub]);

  return (
    <div ref={containerRef} data-copy-wrapper="true" className={className}>
      {children}
    </div>
  );
}

export default OverflowTextReveal;
