"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const HOLD_TRIGGER_DURATION = 3000;

export function HoldCursorIndicator({
  isHolding = false,
  actionPhase = "idle",
  holdStartTime = 0,
}) {
  const [cursor, setCursor] = useState({ x: -9999, y: -9999 });
  const [displayProgress, setDisplayProgress] = useState(0);
  const [showRelease, setShowRelease] = useState(false);
  const [releaseOpacity, setReleaseOpacity] = useState(0);
  const [circleOpacity, setCircleOpacity] = useState(1);

  const rafRef = useRef(null);
  const releaseShownRef = useRef(false);

  const radius = 28;
  const strokeWidth = 2;
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  useEffect(() => {
    const handleMove = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, []);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = () => {
      let targetProgress = 0;

      if (isHolding && holdStartTime > 0) {
        const elapsed = performance.now() - holdStartTime;
        targetProgress = Math.min(elapsed / HOLD_TRIGGER_DURATION, 1);
      }

      setDisplayProgress((prev) => {
        const lerp = isHolding ? 0.22 : 0.16;
        return prev + (targetProgress - prev) * lerp;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHolding, holdStartTime]);

  useEffect(() => {
    const completed = displayProgress >= 0.995;

    if (completed && !releaseShownRef.current) {
      releaseShownRef.current = true;
      setShowRelease(true);
      setReleaseOpacity(1);
      setCircleOpacity(0);
    }

    if (!isHolding && actionPhase === "idle") {
      releaseShownRef.current = false;
      setShowRelease(false);
      setReleaseOpacity(0);
      setCircleOpacity(1);
    }
  }, [displayProgress, isHolding, actionPhase]);

  useEffect(() => {
    if (actionPhase === "exploding" || actionPhase === "reforming") {
      setShowRelease(false);
      setReleaseOpacity(0);
      setCircleOpacity(0);
    } else if (actionPhase === "idle" && !isHolding) {
      setCircleOpacity(displayProgress > 0.01 ? 1 : 0);
    } else if (actionPhase === "holding") {
      if (!releaseShownRef.current) {
        setCircleOpacity(1);
      }
    }
  }, [actionPhase, isHolding, displayProgress]);

  const dashOffset = circumference * (1 - displayProgress);

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div
        className="absolute"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg
          width={radius * 2 + 12}
          height={radius * 2 + 12}
          viewBox={`0 0 ${radius * 2 + 12} ${radius * 2 + 12}`}
          style={{
            opacity: circleOpacity,
            transition: "opacity 280ms ease",
            overflow: "visible",
          }}
        >
          <circle
            cx={radius + 6}
            cy={radius + 6}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={radius + 6}
            cy={radius + 6}
            r={radius}
            fill="none"
            stroke="#ffffff"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${radius + 6} ${radius + 6})`}
            style={{
              transition: isHolding
                ? "none"
                : "stroke-dashoffset 260ms cubic-bezier(.22,.61,.36,1)",
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            opacity: releaseOpacity,
            transition: "opacity 260ms ease",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {showRelease ? "Release" : ""}
        </div>
      </div>
    </div>
  );
}