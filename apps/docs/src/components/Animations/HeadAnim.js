"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function HeadAnim({
  children,
  animateOnScroll = true,
  delay = 0
}) {
  const containerRef = useRef(null);
  const elementRefs = useRef([]);
  const splitRefs = useRef([]);
  const chars = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    splitRefs.current = [];
    chars.current = [];
    elementRefs.current = [];

    // Find elements to split (single node or wrapper's children)
    let elements = [];
    if (containerRef.current.hasAttribute("data-copy-wrapper")) {
      elements = Array.from(containerRef.current.children);
    } else {
      elements = [containerRef.current];
    }

    document.fonts.ready.then(() => {
      elements.forEach((element) => {
        elementRefs.current.push(element);

        // Split into characters
        const split = SplitText.create(element, {
          type: "lines,chars",   
          mask:"chars",            // <-- chars instead of lines
          charsClass: "char++",        // optional: auto-increment class names
          reduceWhiteSpace: false      // keep spaces as nodes
        });
        splitRefs.current.push(split);

        // Collect characters
        chars.current.push(...split.chars);
      });

      // Set initial state: chars slide up into view
      gsap.set(chars.current, { yPercent: 100, willChange: "transform",rotate:8 });

      const animationProps = {
        yPercent: 0,
        rotate:0,
        duration: 0.5,
        stagger: 0.02,   // smaller stagger works better for chars
        ease: "power3.out",
        delay
      };

      if (animateOnScroll) {
        gsap.to(chars.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end:"bottom 50%",
            // scrub:true,
            // markers:true
            // once: true
          }
        });
      } else {
        gsap.to(chars.current, animationProps);
      }
    });

    return () => {
      splitRefs.current.forEach((split) => {
        if (split) split.revert();
      });
    };
  }, [animateOnScroll, delay]);

 const child = React.Children.count(children) === 1 ? React.Children.toArray(children)[0] : null;

  if (child && React.isValidElement(child)) {
    return React.cloneElement(child, { ref: containerRef });
  }
  
  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
