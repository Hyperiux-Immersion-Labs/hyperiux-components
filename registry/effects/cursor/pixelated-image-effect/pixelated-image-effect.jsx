"use client";

import { useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_PIXEL_SIZE = 1;
const MAX_PIXEL_SIZE = 64;
const PIXEL_SCALE_FACTOR = 30;

// ─── Sub-Components ───────────────────────────────────────────────────────────

function PixelateSvgFilter({ id = "pixelate-filter", size = 16, crossLayers = false }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        <filter id={id} x="0" y="0" width="1" height="1">
          <feConvolveMatrix kernelMatrix="1 1 1 1 1 1 1 1 1" result="AVG" />
          <feFlood x="1" y="1" width="1" height="1" />
          <feComposite operator="arithmetic" k1="0" k2="1" k3="0" k4="0" width={size} height={size} />
          <feTile result="TILE" />
          <feComposite in="AVG" in2="TILE" operator="in" />
          <feMorphology operator="dilate" radius={size / 2} result="NORMAL" />

          {crossLayers && (
            <>
              <feConvolveMatrix kernelMatrix="1 1 1 1 1 1 1 1 1" result="AVG" />
              <feFlood x="1" y="1" width="1" height="1" />
              <feComposite in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="0" k4="0" width={size / 2} height={size} />
              <feTile result="TILE" />
              <feComposite in="AVG" in2="TILE" operator="in" />
              <feMorphology operator="dilate" radius={size / 2} result="FALLBACKX" />

              <feConvolveMatrix kernelMatrix="1 1 1 1 1 1 1 1 1" result="AVG" />
              <feFlood x="1" y="1" width="1" height="1" />
              <feComposite in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="0" k4="0" width={size} height={size / 2} />
              <feTile result="TILE" />
              <feComposite in="AVG" in2="TILE" operator="in" />
              <feMorphology operator="dilate" radius={size / 2} result="FALLBACKY" />

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

// ─── Main Component ───────────────────────────────────────────────────────────

export function PixelatedImageEffect({
  src = "/assets/img/image02.webp",
  alt = "Pixelated image",
  filterId = "pixelate-filter",
  crossLayers = true,
  initialPixelSize = 16,
  headline = "Move your cursor.",
  subline = "See the pixels react",
}) {
  const imageRef   = useRef(null);
  const isTouching = useRef(false);
  const [pixelSize, setPixelSize] = useState(initialPixelSize);

  const updatePixel = (event) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x    = event.clientX - rect.left;
    setPixelSize(Math.min(Math.max(x / PIXEL_SCALE_FACTOR, MIN_PIXEL_SIZE), MAX_PIXEL_SIZE));
  };

  const handlePointerDown = (e) => {
    isTouching.current = true;
    updatePixel(e);
  };

  const handlePointerMove = (e) => {
    if (e.pointerType === "touch" && !isTouching.current) return;
    updatePixel(e);
  };

  const handlePointerUp = () => {
    isTouching.current = false;
  };

  return (
    <div className="relative flex h-dvh w-dvw flex-col gap-[3.75rem] items-center justify-center">
      <h2
        className="text-center leading-[1.2] m-0"
        style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}
      >
        {headline}
        <br />
        {subline}
      </h2>

      <PixelateSvgFilter id={filterId} size={pixelSize} crossLayers={crossLayers} />

      <div
        ref={imageRef}
        className="relative h-[55vh] w-full max-w-[min(90vw,32rem)] overflow-hidden touch-none"
        style={{ filter: `url(#${filterId})` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover block"
        />
      </div>
    </div>
  );
}

