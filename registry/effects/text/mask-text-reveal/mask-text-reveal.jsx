"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export function MaskTextReveal({
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
  const styleRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Inject styles for mask animation
    if (!styleRef.current) {
      const style = document.createElement("style");
      style.textContent = `
        .mask-text-reveal-line {
          mask-size: 500% 100%;
          mask-image: linear-gradient(
            150deg,
            #e8e8e8 33.3%,
            rgba(255, 255, 255, 0) 66.6%
          );
        }
      `;
      document.head.appendChild(style);
      styleRef.current = style;
    }

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

    const forceAriaVisible = (root) => {
      if (!root) return;
      const hidden = root.querySelectorAll('[aria-hidden="true"]');
      hidden.forEach((node) => node.setAttribute("aria-hidden", "false"));
    };

    let unmounted = false;

    (async () => {
      await waitForFonts();
      if (unmounted) return;

      elements.forEach((element) => {
        const split = SplitText.create(element, {
          type: "lines",
          linesClass: "mask-text-reveal-line",
          lineThreshold: 0.1,
        });

        splitRefs.current.push(split);

        const textIndent = getComputedStyle(element).textIndent;
        if (textIndent && textIndent !== "0px" && split.lines.length > 0) {
          split.lines[0].style.paddingLeft = textIndent;
          element.style.textIndent = "0";
        }

        forceAriaVisible(element);
        linesRef.current.push(...split.lines);
      });

      if (!linesRef.current.length) return;

      if (prefersReduced) {
        gsap.set(linesRef.current, { maskPosition: "0% 100%" });
        elements.forEach(forceAriaVisible);
        return;
      }

      gsap.set(linesRef.current, {
        maskPosition: "100% 100%",
      });

      const animationProps = {
        maskPosition: "0% 100%",
        stagger: 0.2,
        duration: 5.5,
        ease: "power3.out",
        delay,
      };

      if (animateOnScroll) {
        const tween = gsap.to(linesRef.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: scrub ? false : true,
            scrub,
            onEnter: () => elements.forEach(forceAriaVisible),
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

export default MaskTextReveal;
