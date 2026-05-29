'use client'
import { useRef, useState, useEffect } from "react";

function mapRange(value, inMin, inMax, outMin, outMax) {
  const clamped = Math.min(Math.max(value, inMin), inMax);
  return outMin + ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function useMousePosition(containerRef) {
  const [pos, setPos] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        width: rect.width,
        height: rect.height,
      });
    };
    const rect = el.getBoundingClientRect();
    setPos((prev) => ({
      ...prev,
      width: rect.width,
      height: rect.height,
    }));

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        const nextRect = el.getBoundingClientRect();
        setPos((prev) => ({
          ...prev,
          width: nextRect.width,
          height: nextRect.height,
        }));
      });
      ro.observe(el);
    }

    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      ro?.disconnect?.();
    };
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
  transition = "font-variation-settings 0.05s linear, transform 0.05s linear",
  transformOrigin = "bottom",
  skewXRange = { min: 0, max: -20 },
}) {
  const { x, y, width, height } = useMousePosition(containerRef);

  let fontVariationSettings = '"wght" 400';
  let skewX = 0;

  if (width > 0 && height > 0) {
    const { y: yAxis } = fontVariationMapping;
    const yVal = mapRange(y, 0, height, yAxis.min, yAxis.max);
    fontVariationSettings = `"${yAxis.name}" ${yVal.toFixed(1)}`;
    skewX = mapRange(x, 0, width, skewXRange.min, skewXRange.max);
  }

  return (
    <Tag
      className={className}
      style={{
        fontVariationSettings,
        transform: `skewX(${skewX}deg)`,
        transition,
        transformOrigin,
        display: "inline-block",
      }}
    >
      {children}
    </Tag>
  );
}

export default function CursorMove({
  interClassName = "",
  containerClassName = "",
  backgroundClassName = "bg-zinc-950",
  paddingClassName = "p-24",
  showCrosshair = true,
  crosshairVariant = "solid", // "solid" | "dotted" | "dashed"
  crosshairClassName = "bg-white/20",
  crosshairDottedColor = "rgba(255,255,255,0.2)",
  crosshairDottedDotLength = 2,
  crosshairDottedGap = 10,
  crosshairDashedColor = "rgba(255,255,255,0.2)",
  crosshairDashedDashLength = 10,
  crosshairDashedGap = 10,
  crosshairVerticalThicknessClassName = "w-px",
  crosshairHorizontalThicknessClassName = "h-px",
  crosshairVerticalClassName = "",
  crosshairHorizontalClassName = "",
  showCursorDot = true,
  cursorDotClassName = "w-3 h-3 bg-orange-500 rounded-sm",
  cursorDotStyle = {},
  text = "fancy!",
  textWrapperClassName = "flex items-center justify-center w-full h-full",
  textClassName = "text-9xl text-orange-500 select-none leading-none",
  textAs = "span",
  fontVariationMapping = {
    y: { name: "wght", min: 100, max: 900 },
  },
  variableTextTransition = "font-variation-settings 0.05s linear, transform 0.05s linear",
  variableTextTransformOrigin = "bottom",
  skewXRange = { min: 0, max: -20 },
  showCoordinates = true,
  coordinatesClassName = "absolute bottom-8 left-8 flex flex-col font-mono",
  coordinatesTextClassName = "text-xs text-white/40 tabular-nums",
}) {
  const containerRef = useRef(null);
  const { x, y } = useMousePosition(containerRef);

  const isPatternCrosshair = crosshairVariant === "dotted" || crosshairVariant === "dashed";
  const patternLength =
    crosshairVariant === "dashed"
      ? Math.max(0, Number(crosshairDashedDashLength) || 0)
      : Math.max(0, Number(crosshairDottedDotLength) || 0);
  const patternGap =
    crosshairVariant === "dashed"
      ? Math.max(0, Number(crosshairDashedGap) || 0)
      : Math.max(0, Number(crosshairDottedGap) || 0);
  const patternPeriod = patternLength + patternGap;
  const patternColor =
    (crosshairVariant === "dashed" ? crosshairDashedColor : crosshairDottedColor) ||
    "rgba(255,255,255,0.2)";

  return (
    <div
      ref={containerRef}
      className={`relative w-screen h-screen overflow-hidden cursor-none flex items-center justify-center ${backgroundClassName} ${paddingClassName} ${containerClassName} ${interClassName}`}
    >
      {showCrosshair ? (
        <>
          <div
            className={
              isPatternCrosshair
                ? `absolute top-0 h-full pointer-events-none ${crosshairVerticalThicknessClassName} ${crosshairVerticalClassName}`
                : `absolute top-0 h-full pointer-events-none ${crosshairVerticalThicknessClassName} ${crosshairClassName} ${crosshairVerticalClassName}`
            }
            style={{
              left: x,
              transform: "translateX(-50%)",
              backgroundImage: isPatternCrosshair
                ? `repeating-linear-gradient(to bottom, ${patternColor} 0, ${patternColor} ${patternLength}px, transparent ${patternLength}px, transparent ${patternPeriod}px)`
                : undefined,
            }}
          />
          <div
            className={
              isPatternCrosshair
                ? `absolute left-0 w-full pointer-events-none ${crosshairHorizontalThicknessClassName} ${crosshairHorizontalClassName}`
                : `absolute left-0 w-full pointer-events-none ${crosshairHorizontalThicknessClassName} ${crosshairClassName} ${crosshairHorizontalClassName}`
            }
            style={{
              top: y,
              transform: "translateY(-50%)",
              backgroundImage: isPatternCrosshair
                ? `repeating-linear-gradient(to right, ${patternColor} 0, ${patternColor} ${patternLength}px, transparent ${patternLength}px, transparent ${patternPeriod}px)`
                : undefined,
            }}
          />
        </>
      ) : null}

      {showCursorDot ? (
        <div
          className={`absolute pointer-events-none z-20 ${cursorDotClassName}`}
          style={{ left: x, top: y, transform: "translate(-50%, -50%)", ...cursorDotStyle }}
        />
      ) : null}

      <div className={textWrapperClassName}>
        <VariableFontAndCursor
          containerRef={containerRef}
          fontVariationMapping={fontVariationMapping}
          className={textClassName}
          as={textAs}
          transition={variableTextTransition}
          transformOrigin={variableTextTransformOrigin}
          skewXRange={skewXRange}
        >
          {text}
        </VariableFontAndCursor>
      </div>

      {showCoordinates ? (
        <div className={coordinatesClassName}>
          <span className={coordinatesTextClassName}>x: {Math.round(x)}</span>
          <span className={coordinatesTextClassName}>y: {Math.round(y)}</span>
        </div>
      ) : null}
    </div>
  );
}
