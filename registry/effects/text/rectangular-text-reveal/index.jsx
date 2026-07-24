"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);

const DEFAULT_TAG = "div";
const DEFAULT_BASE_COLOR = "#ea580c";
const DEFAULT_OVERLAY_COLOR = "#ffffff";
const DEFAULT_STAGGER = 0.2;
const DEFAULT_COVER_DURATION = 0.34;
const DEFAULT_REVEAL_DURATION = 0.42;
const DEFAULT_OVERLAY_ENTER_DURATION = 0.24;
const DEFAULT_OVERLAY_EXIT_DURATION = 0.28;
const DEFAULT_INSET_X = "0.08em";
const DEFAULT_INSET_Y = "0.08em";
const DEFAULT_TRIGGER_START = "top bottom";
const DEFAULT_DIRECTION = "left";
const DEFAULT_DELAY = 0;
const DEFAULT_TOGGLE_ACTIONS = "play none none reset";
const REDUCED_MOTION_Y_OFFSET = 32;
const REDUCED_MOTION_DURATION = 0.9;
const REDUCED_MOTION_STAGGER = 0.12;
const REVEAL_EASE = "hyperEase";
const SCALE_X_ZERO = "scaleX(0)";
const SCALE_Y_ZERO = "scaleY(0)";
const LINE_CLASS_NAME = "tb-line";

function getOrigins(direction) {
  switch (direction) {
    case "right":
      return {
        enterOrigin: "100% 50%",
        exitOrigin: "0% 50%",
        axis: "scaleX",
      };
    case "top":
      return {
        enterOrigin: "50% 0%",
        exitOrigin: "50% 100%",
        axis: "scaleY",
      };
    case "bottom":
      return {
        enterOrigin: "50% 100%",
        exitOrigin: "50% 0%",
        axis: "scaleY",
      };
    case "left":
    default:
      return {
        enterOrigin: "0% 50%",
        exitOrigin: "100% 50%",
        axis: "scaleX",
      };
  }
}

function createRevealRect({
  insetX,
  insetY,
  background,
  transformOrigin,
  axis,
  zIndex,
  dataAttribute,
}) {
  const rect = document.createElement("div");
  rect.setAttribute(dataAttribute, "true");
  Object.assign(rect.style, {
    position: "absolute",
    left: `-${insetX}`,
    right: `-${insetX}`,
    top: `-${insetY}`,
    bottom: `-${insetY}`,
    background,
    transformOrigin,
    transform: axis === "scaleX" ? SCALE_X_ZERO : SCALE_Y_ZERO,
    zIndex: String(zIndex),
    pointerEvents: "none",
    willChange: "transform",
  });

  return rect;
}

export default function RectangularTextReveal({
  children,
  as: Tag = DEFAULT_TAG,
  className = "",
  baseColor = DEFAULT_BASE_COLOR,
  overlayColor = DEFAULT_OVERLAY_COLOR,
  useOverlay = true,
  stagger = DEFAULT_STAGGER,
  coverDuration = DEFAULT_COVER_DURATION,
  revealDuration = DEFAULT_REVEAL_DURATION,
  overlayEnterDuration = DEFAULT_OVERLAY_ENTER_DURATION,
  overlayExitDuration = DEFAULT_OVERLAY_EXIT_DURATION,
  insetX = DEFAULT_INSET_X,
  insetY = DEFAULT_INSET_Y,
  triggerStart = DEFAULT_TRIGGER_START,
  once = false,
  direction = DEFAULT_DIRECTION,
  delay = DEFAULT_DELAY,
  toggleActions = DEFAULT_TOGGLE_ACTIONS,
}) {
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    if (!elementRef.current) {
      return;
    }

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const { enterOrigin, exitOrigin, axis } = getOrigins(direction);

    CustomEase.create(REVEAL_EASE, "0.4,0,0.2,1");

    const split = new SplitText(elementRef.current, {
      type: "lines",
      linesClass: LINE_CLASS_NAME,
    });

    const lines = split.lines;

    // Line setup
    gsap.set(elementRef.current, { opacity: 1 });

    if (prefersReduced) {
      gsap.set(lines, {
        opacity: 0,
        y: REDUCED_MOTION_Y_OFFSET,
        willChange: "transform, opacity",
      });

      const timeline = gsap.timeline({ paused: true, delay });

      timeline.to(lines, {
        opacity: 1,
        y: 0,
        duration: REDUCED_MOTION_DURATION,
        ease: "power3.out",
        stagger: REDUCED_MOTION_STAGGER,
      });

      const scrollTrigger = ScrollTrigger.create({
        trigger: elementRef.current,
        start: triggerStart,
        once,
        animation: timeline,
        toggleActions: once ? "play none none none" : toggleActions,
        ...(once
          ? {}
          : {
              onLeaveBack: () => {
                timeline.pause(0);
                gsap.set(lines, { opacity: 0, y: REDUCED_MOTION_Y_OFFSET });
              },
            }),
      });

      return () => {
        timeline.kill();
        scrollTrigger.kill();
        split.revert();
      };
    }

    const wrappers = [];
    const baseRects = [];
    const overlayRects = [];

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

      const baseRect = createRevealRect({
        insetX,
        insetY,
        background: baseColor,
        transformOrigin: enterOrigin,
        axis,
        zIndex: 2,
        dataAttribute: "data-reveal-base",
      });
      wrapper.appendChild(baseRect);

      let overlayRect = null;

      if (useOverlay) {
        overlayRect = createRevealRect({
          insetX,
          insetY,
          background: overlayColor,
          transformOrigin: enterOrigin,
          axis,
          zIndex: 3,
          dataAttribute: "data-reveal-overlay",
        });
        wrapper.appendChild(overlayRect);
      }

      wrappers.push(wrapper);
      baseRects.push(baseRect);
      overlayRects.push(overlayRect);
    });

    // Timeline
    const timeline = gsap.timeline({ paused: true, delay });

    lines.forEach((line, index) => {
      const baseRect = baseRects[index];
      const overlayRect = overlayRects[index];
      const startAt = index * stagger;

      if (useOverlay && overlayRect) {
        timeline.to(
          overlayRect,
          {
            [axis]: 1,
            duration: overlayEnterDuration,
            ease: REVEAL_EASE,
            transformOrigin: enterOrigin,
          },
          startAt + 0.1
        );
      }

      timeline
        .to(
          baseRect,
          {
            [axis]: 1,
            duration: coverDuration,
            ease: REVEAL_EASE,
            transformOrigin: enterOrigin,
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
        timeline.to(
          overlayRect,
          {
            [axis]: 0,
            delay: 0.15,
            duration: overlayExitDuration,
            ease: REVEAL_EASE,
            transformOrigin: exitOrigin,
          },
          startAt + coverDuration + 0.1
        );
      }

      timeline.to(
        baseRect,
        {
          [axis]: 0,
          delay: useOverlay ? 0.2 : 0.12,
          duration: revealDuration,
          ease: REVEAL_EASE,
          transformOrigin: exitOrigin,
        },
        startAt + coverDuration + 0.1
      );
    });

    // Scroll trigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: elementRef.current,
      start: triggerStart,
      once,
      animation: timeline,
      toggleActions: once ? "play none none none" : toggleActions,
      ...(once
        ? {}
        : {
            onLeaveBack: () => {
              timeline.pause(0);

              lines.forEach((line) => {
                line.style.opacity = "0";
              });

              baseRects.forEach((rect) => {
                gsap.set(rect, {
                  [axis]: 0,
                  transformOrigin: enterOrigin,
                });
              });

              overlayRects.forEach((rect) => {
                if (!rect) {
                  return;
                }

                gsap.set(rect, {
                  [axis]: 0,
                  transformOrigin: enterOrigin,
                });
              });
            },
          }),
    });

    // Cleanup
    return () => {
      timeline.kill();
      scrollTrigger.kill();
      split.revert();

      wrappers.forEach((wrapper) => {
        if (!wrapper.parentNode) {
          return;
        }

        while (wrapper.firstChild) {
          wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
        }

        wrapper.remove();
      });
    };
  }, [
    baseColor,
    coverDuration,
    delay,
    direction,
    insetX,
    insetY,
    once,
    overlayColor,
    overlayEnterDuration,
    overlayExitDuration,
    revealDuration,
    stagger,
    toggleActions,
    triggerStart,
    useOverlay,
  ]);

  return (
    <Tag ref={elementRef} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}
