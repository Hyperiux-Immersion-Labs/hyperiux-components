"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export function OverflowStaggerText({
  children,
  animateOnScroll = true,
  delay = 0,
  className = "",
  scrub = true,
}) {
  const containerRef = useRef(null);
  const splitRefs = useRef([]);
  const charsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    splitRefs.current = [];
    charsRef.current = [];

    const elements = containerRef.current.hasAttribute("data-copy-wrapper")
      ? Array.from(containerRef.current.children)
      : [containerRef.current];

    let ctx;

    const init = async () => {
      await document.fonts.ready;

      ctx = gsap.context(() => {
        elements.forEach((element) => {
          const split = SplitText.create(element, {
            type: "lines,chars",
            mask: "chars",
            charsClass: "char",
            reduceWhiteSpace: false,
          });

          splitRefs.current.push(split);
          charsRef.current.push(...split.chars);
        });

        gsap.set(charsRef.current, {
          yPercent: 100,
          rotate: 8,
          willChange: "transform",
        });

        const animationProps = {
          yPercent: 0,
          rotate: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: "power3.out",
          delay,
        };

        if (animateOnScroll) {
          gsap.to(charsRef.current, {
            ...animationProps,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 90%",
              end: "bottom 60%",
              scrub,
            },
          });
        } else {
          gsap.to(charsRef.current, animationProps);
        }
      }, containerRef);
    };

    init();

    return () => {
      if (ctx) ctx.revert();
      splitRefs.current.forEach((split) => split?.revert());
    };
  }, [animateOnScroll, delay, scrub]);

  return (
    <div ref={containerRef} data-copy-wrapper="true" className={className}>
      {children}
    </div>
  );
}

export default OverflowStaggerText;
