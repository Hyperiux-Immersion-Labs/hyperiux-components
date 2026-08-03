/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use client";

import { TransitionRouter } from "next-transition-router";
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";


const ROWS = 5;
const COLOR = "#000000";

const STAGGER_DELAY = 0.12;
const COVER_DURATION = 0.72;
const REVEAL_DURATION = 0.68;
const BLOCK_OFFSET_PERCENT = 101;

const SHIFT_SCALE_OUT = 0.98;
const SHIFT_SCALE_IN = 1.02;
const SHIFT_BLUR = "4px";
const SHIFT_DURATION_OUT = 0.7;
const SHIFT_DURATION_IN = 0.8;


export default function BlockTransition({
  children,
  enableContentShift = false,
  rows = ROWS,
  color = COLOR,
}) {
  const wrapperRef = useRef(null);
  const rowRefs    = useRef([]);

  const getRows = () => rowRefs.current.filter(Boolean);



  const buildRowsAnimation = (timeline, direction) => {
    const rows = getRows();
    const orderedRows = direction === "cover" ? rows : [...rows].reverse();

    orderedRows.forEach((row, index) => {
      const [leftBlock, rightBlock] = row.children;
      const delay = index * STAGGER_DELAY;

      if (direction === "cover") {
        timeline.set([leftBlock, rightBlock], { autoAlpha: 1 }, delay);
        timeline.to(
          [leftBlock, rightBlock],
          {
            xPercent: 0,
            duration: COVER_DURATION,
            ease: "power3.inOut",
          },
          delay
        );
      } else {
        timeline.to(
          leftBlock,
          {
            xPercent: -BLOCK_OFFSET_PERCENT,
            duration: REVEAL_DURATION,
            ease: "power3.inOut",
          },
          delay
        );
        timeline.set(leftBlock, { autoAlpha: 0 }, delay + REVEAL_DURATION);

        timeline.to(
          rightBlock,
          {
            xPercent: BLOCK_OFFSET_PERCENT,
            duration: REVEAL_DURATION,
            ease: "power3.inOut",
          },
          delay
        );
        timeline.set(rightBlock, { autoAlpha: 0 }, delay + REVEAL_DURATION);
      }
    });
  };


  useLayoutEffect(() => {
    getRows().forEach((row) => {
      const [leftBlock, rightBlock] = row.children;
      if (!leftBlock || !rightBlock) return;

      gsap.set(leftBlock, {
        xPercent: -BLOCK_OFFSET_PERCENT,
        autoAlpha: 0,
      });

      gsap.set(rightBlock, {
        xPercent: BLOCK_OFFSET_PERCENT,
        autoAlpha: 0,
      });
    });
  }, []);


  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const timeline = gsap.timeline({ onComplete: next });

        if (prefersReducedMotion()) {
          timeline.to(wrapperRef.current, { opacity: 0, duration: 0.2, ease: "power1.out" }, 0);
          return () => timeline.kill();
        }

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { scale: 1, filter: "blur(0px)", opacity: 1 },
            {
              scale: SHIFT_SCALE_OUT,
              filter: `blur(${SHIFT_BLUR})`,
              opacity: 0.85,
              duration: SHIFT_DURATION_OUT,
              ease: "power2.inOut",
            },
            0
          );
        }

        buildRowsAnimation(timeline, "cover");

        return () => timeline.kill();
      }}
      enter={(next) => {
        const timeline = gsap.timeline({ onComplete: next });

        if (prefersReducedMotion()) {
          timeline.to(wrapperRef.current, { opacity: 1, duration: 0.2, ease: "power1.out", clearProps: "all" }, 0);
          return () => timeline.kill();
        }

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { scale: SHIFT_SCALE_IN, filter: `blur(${SHIFT_BLUR})`, opacity: 0.85 },
            {
              scale: 1,
              filter: "blur(0px)",
              opacity: 1,
              duration: SHIFT_DURATION_IN,
              ease: "power2.out",
            },
            0.08
          );
        }

        buildRowsAnimation(timeline, "reveal");

        return () => timeline.kill();
      }}
    >
      <div className="pointer-events-none fixed inset-0 z-999 overflow-hidden">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            ref={(node) => {
              rowRefs.current[index] = node;
            }}
            className="absolute left-0 w-full overflow-hidden"
            style={{
              top: `${(index * 100) / rows}%`,
              height: `calc(${100 / rows}% + 2px)`,
            }}
          >
            <span
              className="absolute top-0 left-0 h-full w-[51%] will-change-transform"
              style={{
                backgroundColor: color,
                opacity: 0,
                visibility: "hidden",
              }}
            />

            <span
              className="absolute top-0 right-0 h-full w-[51%] will-change-transform"
              style={{
                backgroundColor: color,
                opacity: 0,
                visibility: "hidden",
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative h-full w-full">
        <div ref={wrapperRef} className="h-full w-full will-change-transform">
          {children}
        </div>
      </div>
    </TransitionRouter>
  );
}
