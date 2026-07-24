"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SPLIT_TYPES = "lines,chars";
const SPLIT_MASK = "chars";
const CHARS_CLASS = "char++";

const INITIAL_Y_PERCENT = 100;
const INITIAL_ROTATION = 8;

const ANIMATION_DURATION = 0.5;
const STAGGER_DELAY = 0.03;
const ANIMATION_EASE = "power3.out";
const REDUCED_MOTION_FADE_DURATION = 1;

const COPY_WRAPPER_ATTRIBUTE = "data-copy-wrapper";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function OverflowStaggerText({
  children,
  animateOnScroll = true,
  delay = 0,
  className = "",
  stagger = STAGGER_DELAY,
  scrub = true,
  start = "top 90%",
  end = "bottom 60%",
}) {
  const containerRef = useRef(null);
  const splitRefs = useRef([]);
  const charactersRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    splitRefs.current = [];
    charactersRef.current = [];

    const animationTarget = containerRef.current;

    const shouldSplitChildren = animationTarget.hasAttribute(
      COPY_WRAPPER_ATTRIBUTE
    );

    const elementsToSplit = shouldSplitChildren
      ? Array.from(animationTarget.children)
      : [animationTarget];

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let context;

    const initializeAnimation = async () => {
      await document.fonts.ready;

      context = gsap.context(() => {
        elementsToSplit.forEach((element) => {
          const split = SplitText.create(element, {
            type: SPLIT_TYPES,
            mask: SPLIT_MASK,
            charsClass: CHARS_CLASS,
            reduceWhiteSpace: false,
          });

          splitRefs.current.push(split);
          charactersRef.current.push(...split.chars);
        });

        if (prefersReduced) {
          gsap.set(charactersRef.current, { yPercent: 0, rotate: 0 });

          const fadeProperties = {
            opacity: 1,
            duration: REDUCED_MOTION_FADE_DURATION,
            ease: "power1.out",
            delay,
          };

          if (animateOnScroll) {
            gsap.to(animationTarget, {
              ...fadeProperties,
              scrollTrigger: {
                trigger: animationTarget,
                start,
                end,
                scrub,
              },
            });

            return;
          }

          gsap.to(animationTarget, fadeProperties);
          return;
        }

        gsap.set(charactersRef.current, {
          yPercent: INITIAL_Y_PERCENT,
          rotate: INITIAL_ROTATION,
          willChange: "transform",
        });

        gsap.set(animationTarget, {
          opacity: 1,
        });

        const animationProperties = {
          yPercent: 0,
          rotate: 0,
          duration: ANIMATION_DURATION,
          stagger,
          ease: ANIMATION_EASE,
          delay,
        };

        if (animateOnScroll) {
          gsap.to(charactersRef.current, {
            ...animationProperties,
            scrollTrigger: {
              trigger: animationTarget,
              start,
              end,
              scrub,
            },
          });

          return;
        }

        gsap.to(charactersRef.current, animationProperties);
      }, animationTarget);
    };

    initializeAnimation();

    return () => {
      if (context) {
        context.revert();
      }

      splitRefs.current.forEach((split) => split?.revert());
    };
  }, [animateOnScroll, delay, end, scrub, stagger, start]);

  return (
    <div
      ref={containerRef}
      data-copy-wrapper="true"
      className={`opacity-0 ${className}`.trim()}
    >
      {children}
    </div>
  );
}