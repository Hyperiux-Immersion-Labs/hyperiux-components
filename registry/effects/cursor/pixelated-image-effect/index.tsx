// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

interface PixelateSvgFilterProps {
  id?: string;
  size?: number;
  crossLayers?: boolean;
}

export function PixelateSvgFilter({
  id: idProp,
  size: propSize = 16,
  crossLayers = false
}: PixelateSvgFilterProps) {
  const generatedId = `pixelate-filter-${useId().replace(/:/g, "")}`;
  const id = idProp ?? generatedId;
  const size = Math.max(2, propSize);
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        <filter id={id} x="0" y="0" width="1" height="1">
          {/* Base pixelation */}
          <feConvolveMatrix
            kernelMatrix="1 1 1
 1 1 1
 1 1 1"
            result="AVG"
          />

          <feFlood x="1" y="1" width="1" height="1" />

          <feComposite
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0"
            k4="0"
            width={size}
            height={size}
          />

          <feTile result="TILE" />

          <feComposite
            in="AVG"
            in2="TILE"
            operator="in"
          />

          <feMorphology
            operator="dilate"
            radius={size / 2}
            result="NORMAL"
          />

          {crossLayers && (
            <>
              {/* Horizontal fallback */}
              <feConvolveMatrix
                kernelMatrix="1 1 1
 1 1 1
 1 1 1"
                result="AVG"
              />
              <feFlood x="1" y="1" width="1" height="1" />
              <feComposite
                in2="SourceGraphic"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="0"
                k4="0"
                width={size / 2}
                height={size}
              />
              <feTile result="TILE" />
              <feComposite in="AVG" in2="TILE" operator="in" />
              <feMorphology
                operator="dilate"
                radius={size / 2}
                result="FALLBACKX"
              />

              {/* Vertical fallback */}
              <feConvolveMatrix
                kernelMatrix="1 1 1
 1 1 1
 1 1 1"
                result="AVG"
              />
              <feFlood x="1" y="1" width="1" height="1" />
              <feComposite
                in2="SourceGraphic"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="0"
                k4="0"
                width={size}
                height={size / 2}
              />
              <feTile result="TILE" />
              <feComposite in="AVG" in2="TILE" operator="in" />
              <feMorphology
                operator="dilate"
                radius={size / 2}
                result="FALLBACKY"
              />

              <feMerge>
                <feMergeNode in="FALLBACKX" />
                <feMergeNode in="FALLBACKY" />
                <feMergeNode in="NORMAL" />
              </feMerge>
            </>
          )}

          {!crossLayers && <feMergeNode in="NORMAL" />}
        </filter>
      </defs>
    </svg>
  );
}

interface PixelatedImageEffectProps {
  src?: string;
  alt?: string;
  imageClassName?: string;
  pixelSize?: number;
  duration?: number;
}

export default function PixelatedImageEffect({
  src = "https://picsum.photos/seed/v02/1600/1200",
  pixelSize = 16,
  duration = 0.25,
  imageClassName = "",
}: PixelatedImageEffectProps) {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const isTouching = useRef(false);
  const pointerRatio = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const [renderedPixelSize, setRenderedPixelSize] = useState(pixelSize);
  const [targetPixelSize, setTargetPixelSize] = useState(pixelSize);
  const [prevResolvedPixelSize, setPrevResolvedPixelSize] = useState(pixelSize);
  const pixelateFilterId = `pixelate-filter-${useId().replace(/:/g, "")}`;
  const fallbackSrc = "https://picsum.photos/seed/v02/1600/1200";
  const resolvedSrc = typeof src === "string" && src.trim() ? src.trim() : fallbackSrc;
  const resolvedPixelSize = Math.min(Math.max(Number(pixelSize) || 16, 1), 64);
  const resolvedDuration = Math.max(Number(duration) || 0, 0);

  // Reset the animation target whenever the resolved pixelSize prop changes,
  // without clobbering the interactive target set by pointer movement below.
  // This is pure derived state (no browser API), so it's adjusted directly
  // during render instead of via an effect.
  if (resolvedPixelSize !== prevResolvedPixelSize) {
    setPrevResolvedPixelSize(resolvedPixelSize);
    setTargetPixelSize(resolvedPixelSize);
  }

  useEffect(() => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);

    if (resolvedDuration === 0) {
      // Shares this effect with the rAF-driven tween below (same
      // cancelAnimationFrame bookkeeping) - keeping the instant-jump case
      // here preserves a single source of truth for animation timing.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRenderedPixelSize(targetPixelSize);
      return undefined;
    }

    const startValue = renderedPixelSize;
    const distance = targetPixelSize - startValue;
    const startTime = performance.now();
    const durationMs = resolvedDuration * 1000;

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setRenderedPixelSize(startValue + distance * eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
    // renderedPixelSize is only read here to snapshot the tween's starting
    // value, and this same effect updates it every animation frame (see
    // setRenderedPixelSize above). Depending on it would restart the tween
    // from scratch on every frame instead of animating smoothly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedDuration, targetPixelSize]);

  const computeTarget = (ratio: number) => {
    // Left edge is clear (1), right edge is twice the baseline pixelSize, so
    // the hover range follows the current prop values.
    return Math.min(Math.max(1 + ratio * (resolvedPixelSize * 2 - 1), 1), 64);
  };

  const updatePixel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    pointerRatio.current = ratio;
    setTargetPixelSize(computeTarget(ratio));
  };

  // Re-apply the last pointer position when props change mid-hover so the
  // effect immediately uses the new values instead of the stale target.
  useEffect(() => {
    if (pointerRatio.current === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTargetPixelSize(computeTarget(pointerRatio.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedPixelSize]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    isTouching.current = true;
    updatePixel(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && !isTouching.current) return;
    updatePixel(event);
  };

  const handlePointerUp = () => {
    isTouching.current = false;
  };

  const handlePointerLeave = () => {
    isTouching.current = false;
    pointerRatio.current = null;
  };

  return (
    <div className="relative flex h-dvh w-dvw pt-6 flex-col gap-15 items-center justify-center">

      <h1 className="text-5xl text-center max-[1025px]:hidden w-[45%] mt-10">
        Move cursor left in the image block for a clear image, right for more pixelation.
      </h1>

      <h2 className="hidden max-[1025px]:block  w-[60%] text-center mx-auto text-2xl">
        Click left in image block for clear image, right for more pixelated

      </h2>

      <PixelateSvgFilter
        id={pixelateFilterId}
        size={renderedPixelSize}
        crossLayers
      />

      <div
        ref={imageRef}
        className="relative h-[55vh] w-full max-md:max-w-[90%] overflow-hidden max-[1025px]:max-w-[90%] max-w-lg touch-none"
        style={{ filter: `url(#${pixelateFilterId})` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedSrc}
          alt=""
          className={`object-cover absolute inset-0 ${imageClassName}`.trim()}
        />
      </div>
    </div>
  );
}
