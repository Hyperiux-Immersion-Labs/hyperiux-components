"use client";

import { useEffect, useId, useRef, useState } from "react";

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

export function PixelateSvgFilter({
  id: idProp,
  size: propSize = 16,
  crossLayers = false
}) {
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

export default function PixelatedImageEffect({
  src = "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg",
  alt = "Pixelated nature scene",

  imageClassName = "",
}) {
  const imageRef = useRef(null);
  const isTouching = useRef(false);
  const [pixelSize, setPixelSize] = useState(16);
  const pixelateFilterId = `pixelate-filter-${useId().replace(/:/g, "")}`;
  const prefersReducedMotion = usePrefersReducedMotion();

  const updatePixel = (event) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;

    const nextPixelSize = Math.min(Math.max(x / 30, 1), 64);
    setPixelSize(nextPixelSize);
  };

  const handlePointerDown = (event) => {
    isTouching.current = true;
    updatePixel(event);
  };

  const handlePointerMove = (event) => {
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
        size={pixelSize}
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
          src={src}
          alt={alt}
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
