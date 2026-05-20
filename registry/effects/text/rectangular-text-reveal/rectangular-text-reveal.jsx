"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);

export function RectangularTextReveal({
  children,
  as: Tag = "div",
  className = "",
  baseColor = "#ea580c",
  overlayColor = "#ffffff",
  useOverlay = true,
  stagger = 0.2,
  coverDuration = 0.34,
  revealDuration = 0.42,
  overlayEnterDuration = 0.24,
  overlayExitDuration = 0.28,
  insetX = "0.08em",
  insetY = "0.08em",
  triggerStart = "top 85%",
  once = true,
}) {
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    if (!elementRef.current) return;

    CustomEase.create("hyperEase", "0.4,0,0.2,1");

    const split = new SplitText(elementRef.current, {
      type: "lines",
      linesClass: "tb-line",
    });

    const wrappers = [];
    const baseRects = [];
    const overlayRects = [];
    const lines = split.lines;

    lines.forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.display = "block";
      wrapper.style.overflow = "hidden";
      wrapper.style.width = "fit-content";
      wrapper.style.maxWidth = "100%";

      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);

      line.style.position = "relative";
      line.style.display = "block";
      line.style.width = "fit-content";
      line.style.maxWidth = "100%";
      line.style.zIndex = "1";
      line.style.opacity = "0";
      line.style.willChange = "opacity";

      const baseRect = document.createElement("div");
      baseRect.setAttribute("data-reveal-base", "true");
      Object.assign(baseRect.style, {
        position: "absolute",
        left: `-${insetX}`,
        right: `-${insetX}`,
        top: `-${insetY}`,
        bottom: `-${insetY}`,
        background: baseColor,
        transformOrigin: "0% 50%",
        transform: "scaleX(0)",
        zIndex: "2",
        pointerEvents: "none",
        willChange: "transform",
      });

      wrapper.appendChild(baseRect);

      let overlayRect = null;

      if (useOverlay) {
        overlayRect = document.createElement("div");
        overlayRect.setAttribute("data-reveal-overlay", "true");
        Object.assign(overlayRect.style, {
          position: "absolute",
          left: `-${insetX}`,
          right: `-${insetX}`,
          top: `-${insetY}`,
          bottom: `-${insetY}`,
          background: overlayColor,
          transformOrigin: "0% 50%",
          transform: "scaleX(0)",
          zIndex: "3",
          pointerEvents: "none",
          willChange: "transform",
        });

        wrapper.appendChild(overlayRect);
      }

      wrappers.push(wrapper);
      baseRects.push(baseRect);
      overlayRects.push(overlayRect);
    });

    const tl = gsap.timeline({ paused: true });

    lines.forEach((line, index) => {
      const baseRect = baseRects[index];
      const overlayRect = overlayRects[index];
      const startAt = index * stagger;

      if (useOverlay && overlayRect) {
        tl.to(
          overlayRect,
          {
            scaleX: 1,
            duration: overlayEnterDuration,
            ease: "hyperEase",
            transformOrigin: "0% 50%",
          },
          startAt + 0.1
        );
      }

      tl.to(
        baseRect,
        {
          scaleX: 1,
          duration: coverDuration,
          ease: "hyperEase",
          transformOrigin: "0% 50%",
        },
        startAt
      )
        .set(
          line,
          {
            opacity: 1,
          },
          startAt + coverDuration
        );

      if (useOverlay && overlayRect) {
        tl.to(
          overlayRect,
          {
            scaleX: 0,
            delay: 0.15,
            duration: overlayExitDuration,
            ease: "hyperEase",
            transformOrigin: "100% 50%",
          },
          startAt + coverDuration + 0.1
        );
      }

      tl.to(
        baseRect,
        {
          scaleX: 0,
          delay: useOverlay ? 0.2 : 0.12,
          duration: revealDuration,
          ease: "hyperEase",
          transformOrigin: "100% 50%",
        },
        startAt + coverDuration + 0.1
      );
    });

    const st = ScrollTrigger.create({
      trigger: elementRef.current,
      start: triggerStart,
      once,
      onEnter: () => tl.play(),
      ...(once
        ? {}
        : {
            onLeaveBack: () => {
              tl.pause(0);

              lines.forEach((line) => {
                line.style.opacity = "0";
              });

              baseRects.forEach((rect) => {
                gsap.set(rect, {
                  scaleX: 0,
                  transformOrigin: "0% 50%",
                });
              });

              overlayRects.forEach((rect) => {
                if (!rect) return;
                gsap.set(rect, {
                  scaleX: 0,
                  transformOrigin: "0% 50%",
                });
              });
            },
          }),
    });

    return () => {
      tl.kill();
      st.kill();
      split.revert();

      wrappers.forEach((wrapper) => {
        if (wrapper.parentNode) {
          while (wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
          }
          wrapper.remove();
        }
      });
    };
  }, [
    baseColor,
    overlayColor,
    useOverlay,
    stagger,
    coverDuration,
    revealDuration,
    overlayEnterDuration,
    overlayExitDuration,
    insetX,
    insetY,
    triggerStart,
    once,
  ]);

  return (
    <Tag ref={elementRef} className={className}>
      {children}
    </Tag>
  );
}
