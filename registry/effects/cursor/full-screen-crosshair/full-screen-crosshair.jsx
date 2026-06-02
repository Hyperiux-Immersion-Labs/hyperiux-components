"use client";

import React, { useEffect } from "react";
import { useMouse } from "./use-mouse";

const CrosshairCursor = ({
  color = "#ffffff",
  centerContent = "•",
  hideNativeCursor = true,
  lineSize = 100,
  gap = 20,
  thickness = 1,
  centerSize = 24,
  smooth = true,
  lerpFactor = 0.14,
  blendMode = "normal",
  className = "",
}) => {
  const { smoothMouse } = useMouse({
    smooth,
    lerpFactor,
  });

  useEffect(() => {
    if (!hideNativeCursor) return undefined;

    const { body } = document;
    const previousCursor = body.style.cursor;

    body.style.cursor = "none";

    return () => {
      body.style.cursor = previousCursor;
    };
  }, [hideNativeCursor]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-9999 ${className}`}
      style={{
        "--crosshair-color": color,
        "--crosshair-line-size": `${lineSize}px`,
        "--crosshair-gap": `${gap}px`,
        "--crosshair-thickness": `${thickness}px`,
        "--crosshair-center-size": `${centerSize}px`,
        "--crosshair-blend-mode": blendMode,
        mixBlendMode: blendMode,
      }}
    >
      <div
        className="absolute left-0 top-0 h-0 w-0 will-change-transform"
        style={{
          transform: `translate3d(${smoothMouse.current.x}px, ${smoothMouse.current.y}px, 0)`,
        }}
      >
        <span className="absolute left-1/2 -top-[(var(--crosshair-gap)+var(--crosshair-line-size))] block h-(--crosshair-line-size) w-(--crosshair-thickness) -translate-x-1/2 bg-(--crosshair-color)" />
        <span className="absolute left-(--crosshair-gap) top-1/2 block h-(--crosshair-thickness) w-(--crosshair-line-size) -translate-y-1/2 bg-(--crosshair-color)" />
        <span className="absolute left-1/2 top-(--crosshair-gap) block h-(--crosshair-line-size) w-(--crosshair-thickness) -translate-x-1/2 bg-(--crosshair-color)" />
        <span className="absolute right-(--crosshair-gap) top-1/2 block h-(--crosshair-thickness) w-(--crosshair-line-size) -translate-y-1/2 bg-(--crosshair-color)" />

        <div className="absolute left-1/2 top-1/2 flex min-h-(--crosshair-center-size) min-w-(--crosshair-center-size) -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center whitespace-nowrap leading-none text-(length:--crosshair-center-size) text-(--crosshair-color) max-md:text-[calc(var(--crosshair-center-size)*0.9)] max-sm:text-[calc(var(--crosshair-center-size)*0.9)]">
          {centerContent}
        </div>
      </div>
    </div>
  );
};

export { CrosshairCursor as FullScreenCrosshair };
