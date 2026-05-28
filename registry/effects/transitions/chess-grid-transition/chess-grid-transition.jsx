"use client";

import { TransitionRouter } from "next-transition-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGGER_FACTOR = 0.1;
const CELL_ANIMATION_DURATION = 0.8;

const WRAPPER_ANIMATION_DURATION = 0.7;
const WRAPPER_ANIMATION_DELAY = 0.3;
const WRAPPER_SHIFT_PERCENT = 15;

const LEAVE_BLUR = "8px";
const ENTER_BLUR = "12px";

const PERCENT_UNIT = 100;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extracts all cell elements of a specific row from a flattened collection.
 */
const getRowCells = (cells, rowIndex, columns) => {
  const rowCells = [];
  for (let column = 0; column < columns; column += 1) {
    rowCells.push(cells[rowIndex * columns + column]);
  }
  return rowCells;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChessGridTransition({
  children,
  enableContentShift = false,
  columns = 8,
  rows = 4,
  cellClassName = "bg-blue-500",
}) {
  const wrapperRef = useRef(null);
  const gridRef    = useRef(null);

  // ─── Animation Timeline Builder ──────────────────────────────────────────────

  const buildAnimation = (timeline, cells, direction = 1) => {
    const rowIndexes = Array.from({ length: rows }, (_, index) => index);

    rowIndexes.forEach((rowIndex, rowOrderIndex) => {
      const rowCells = getRowCells(cells, rowIndex, columns);

      rowCells.forEach((cell, columnIndex) => {
        const delay = rowOrderIndex * STAGGER_FACTOR + columnIndex * STAGGER_FACTOR;

        if (direction === 1) {
          const translateAmount = (columns - columnIndex) * PERCENT_UNIT;
          timeline.fromTo(
            cell,
            { xPercent: translateAmount },
            { xPercent: 0, duration: CELL_ANIMATION_DURATION, ease: "power2.out" },
            delay
          );
          return;
        }

        timeline.to(
          cell,
          {
            xPercent: -(columnIndex + 1) * PERCENT_UNIT,
            duration: CELL_ANIMATION_DURATION,
            ease: "power2.in",
          },
          delay
        );
      });
    });
  };

  // ─── Initial State Setup ────────────────────────────────────────────────────

  useEffect(() => {
    const cells = gridRef.current?.children;
    if (!cells) return;

    Array.from(cells).forEach((cell, index) => {
      const columnIndex = index % columns;
      gsap.set(cell, { xPercent: -(columnIndex + 1) * PERCENT_UNIT });
    });
  }, [columns]);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const cells = gridRef.current.children;
        const timeline = gsap.timeline({ onComplete: next });

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { xPercent: 0, filter: "blur(0px)", opacity: 1 },
            {
              xPercent: -WRAPPER_SHIFT_PERCENT,
              filter: `blur(${LEAVE_BLUR})`,
              opacity: 0,
              duration: WRAPPER_ANIMATION_DURATION,
              ease: "linear",
            },
            0
          );
        }

        buildAnimation(timeline, cells, 1);
        return () => timeline.kill();
      }}
      enter={(next) => {
        const cells = gridRef.current.children;
        const timeline = gsap.timeline({ onComplete: next });

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { xPercent: WRAPPER_SHIFT_PERCENT, filter: `blur(${ENTER_BLUR})`, opacity: 0 },
            {
              xPercent: 0,
              filter: "blur(0px)",
              opacity: 1,
              duration: WRAPPER_ANIMATION_DURATION,
              delay: WRAPPER_ANIMATION_DELAY,
              ease: "linear",
            },
            0
          );
        }

        buildAnimation(timeline, cells, -1);
        return () => timeline.kill();
      }}
    >
      <div
        ref={gridRef}
        className="pointer-events-none fixed top-0 left-0 z-[999] flex h-screen w-screen flex-wrap"
      >
        {Array.from({ length: columns * rows }).map((_, index) => (
          <span
            key={index}
            className={`${cellClassName} block`}
            style={{
              width: `calc(100vw / ${columns})`,
              height: `calc(100vh / ${rows})`,
            }}
          />
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

