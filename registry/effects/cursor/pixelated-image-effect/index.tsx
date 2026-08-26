// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

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
  mouseReactivity?: number;
}

export default function PixelatedImageEffect({
  src = "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg",
  pixelSize = 16,
  duration = 0.25,
  mouseReactivity = 1,
  imageClassName = "",
}: PixelatedImageEffectProps) {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const isTouching = useRef(false);
  const animationRef = useRef<number | null>(null);
  const [renderedPixelSize, setRenderedPixelSize] = useState(pixelSize);
  const [targetPixelSize, setTargetPixelSize] = useState(pixelSize);
  const pixelateFilterId = `pixelate-filter-${useId().replace(/:/g, "")}`;
  const prefersReducedMotion = usePrefersReducedMotion();
  const fallbackSrc = "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg";
  const resolvedSrc = typeof src === "string" && src.trim() ? src.trim() : fallbackSrc;
  const resolvedPixelSize = Math.min(Math.max(Number(pixelSize) || 16, 1), 64);
  const resolvedDuration = Math.max(Number(duration) || 0, 0);
  const resolvedMouseReactivity = Math.min(Math.max(Number(mouseReactivity) || 0, 0), 2);

  useEffect(() => {
    setTargetPixelSize(resolvedPixelSize);
  }, [resolvedPixelSize]);

  useEffect(() => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);

    if (resolvedDuration === 0) {
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
  }, [resolvedDuration, targetPixelSize]);

  const updatePixel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;

    const pointerPixelSize = Math.min(Math.max(x / 30, 1), 64);
    const nextPixelSize =
      resolvedPixelSize + (pointerPixelSize - resolvedPixelSize) * resolvedMouseReactivity;
    setTargetPixelSize(Math.min(Math.max(nextPixelSize, 1), 64));
  };

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
        onPointerLeave={handlePointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedSrc}
          alt=""
          className={`object-cover absolute inset-0 ${imageClassName}`.trim()}
        />
      </div>
      {prefersReducedMotion && (
        <div
          aria-live="polite"
          className="pointer-events-none fixed bottom-4 right-4 z-40 w-fit max-w-65 rounded-md border border-white/15 bg-white/5 p-3 text-center  backdrop-blur-sm max-[1025px]:hidden"
        >
          <h2 className="text-sm leading-none text-white">
            The pixels keep shifting.
          </h2>
          <p className="mt-2 text-xs leading-5 text-white/65">
            Pixelated Image Effect changes pixelation based on cursor
            position in real time. Since the transition is driven entirely by
            motion, reduced motion can&apos;t be applied here.
          </p>
        </div>
      )}
    </div>
  );
}
