'use client'
import { useRef, useState, useEffect } from "react";

function mapRange(value, inMin, inMax, outMin, outMax) {
  const clamped = Math.min(Math.max(value, inMin), inMax);
  return outMin + ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function useMousePosition(containerRef) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [containerRef]);

  return pos;
}

function VariableFontAndCursor({
  children,
  containerRef,
  fontVariationMapping = {
    y: { name: "wght", min: 100, max: 900 },
  },
  className = "",
  as: Tag = "span",
}) {
  const { x, y } = useMousePosition(containerRef);
  const el = containerRef?.current;

  let fontVariationSettings = '"wght" 400';
  let skewX = 0;

  if (el) {
    const rect = el.getBoundingClientRect();
    const { y: yAxis } = fontVariationMapping;
    const yVal = mapRange(y, 0, rect.height, yAxis.min, yAxis.max);
    fontVariationSettings = `"${yAxis.name}" ${yVal.toFixed(1)}`;
    // map x: left edge → -20deg, right edge → 20deg
    skewX = mapRange(x, 0, rect.width, 0, -20);
  }

  return (
    <Tag
      className={className}
      style={{
        fontVariationSettings,
        transform: `skewX(${skewX}deg)`,
        transition: "font-variation-settings 0.05s linear, transform 0.05s linear",
        transformOrigin: "bottom",
        display: "inline-block",
      }}
    >
      {children}
    </Tag>
  );
}

export default function CursorMove({ interClassName = "" }) {
  const containerRef = useRef(null);
  const { x, y } = useMousePosition(containerRef);

  return (
    <div
      ref={containerRef}
      className={`relative w-screen h-screen bg-zinc-950 overflow-hidden cursor-none flex items-center justify-center p-24 ${interClassName}`}
    >
      {/* Vertical crosshair */}
      <div
        className="absolute top-0 w-px h-full bg-white/20 pointer-events-none"
        style={{ left: x, transform: "translateX(-50%)" }}
      />

      {/* Horizontal crosshair */}
      <div
        className="absolute left-0 h-px w-full bg-white/20 pointer-events-none"
        style={{ top: y, transform: "translateY(-50%)" }}
      />

      {/* Orange cursor dot */}
      <div
        className="absolute w-3 h-3 bg-orange-500 rounded-sm pointer-events-none z-20"
        style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
      />

      {/* Variable font text */}
      <div className="flex items-center justify-center w-full h-full">
        <VariableFontAndCursor
          containerRef={containerRef}
          fontVariationMapping={{
            y: { name: "wght", min: 100, max: 900 },
          }}
          className="text-9xl text-orange-500 select-none leading-none"
        >
          fancy!
        </VariableFontAndCursor>
      </div>

      {/* Coordinate readout */}
      <div className="absolute bottom-8 left-8 flex flex-col font-mono">
        <span className="text-xs text-white/40 tabular-nums">x: {Math.round(x)}</span>
        <span className="text-xs text-white/40 tabular-nums">y: {Math.round(y)}</span>
      </div>
    </div>
  );
}