"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Copy({ children, animateOnScroll = true, delay = 0 }) {
  const containerRef = useRef(null);
  const splitRefs = useRef([]);
  const lines = useRef([]);
  const triggers = useRef([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    splitRefs.current = [];
    lines.current = [];
    triggers.current = [];

    const elements = el.hasAttribute("data-copy-wrapper")
      ? Array.from(el.children)
      : [el];

    const waitForFonts = async () => {
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (_) {}
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
          linesClass: "line++",
          lineThreshold: 0.1,
        });
        splitRefs.current.push(split);

        const textIndent = getComputedStyle(element).textIndent;
        if (textIndent && textIndent !== "0px" && split.lines.length > 0) {
          split.lines[0].style.paddingLeft = textIndent;
          element.style.textIndent = "0";
        }

        lines.current.push(...split.lines);
      });

      if (prefersReduced) {
        gsap.set(lines.current, { y: "0%" });
        return;
      }

      gsap.set(lines.current, { y: "100%" });

      const animationProps = {
        y: "0%",
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
        delay,
        onComplete: () => gsap.set(lines.current, { clearProps: "transform" }),
      };

      if (animateOnScroll) {
        const tween = gsap.to(lines.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            once: true,
          },
        });
        if (tween && tween.scrollTrigger) triggers.current.push(tween.scrollTrigger);
      } else {
        gsap.to(lines.current, animationProps);
      }
    })();

    return () => {
      unmounted = true;
      splitRefs.current.forEach((split) => split && split.revert());
      splitRefs.current = [];
      lines.current = [];
      triggers.current.forEach((t) => t && t.kill());
      triggers.current = [];
    };
  }, [animateOnScroll, delay]);

  if (React.Children.count(children) === 1 && React.isValidElement(children)) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
