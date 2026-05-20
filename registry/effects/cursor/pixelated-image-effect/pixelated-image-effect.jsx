"use client";

import { useRef, useState } from "react";

function PixelateSvgFilter({ id = "pixelate-filter", size = 16, crossLayers = false }) {
  return (
    <svg aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", height: 0, width: 0, overflow: "hidden" }}>
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

export function PixelatedImageEffect({
  src = "/assets/img/image02.webp",
  alt = "Pixelated image",
  filterId = "pixelate-filter",
  crossLayers = true,
  initialPixelSize = 16,
  headline = "Move your cursor.",
  subline = "See the pixels react",
}) {
  const imageRef = useRef(null);
  const isTouching = useRef(false);
  const [pixelSize, setPixelSize] = useState(initialPixelSize);

  const updatePixel = (event) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    setPixelSize(Math.min(Math.max(x / 30, 1), 64));
  };

  const handlePointerDown = (e) => { isTouching.current = true; updatePixel(e); };
  const handlePointerMove = (e) => { if (e.pointerType === "touch" && !isTouching.current) return; updatePixel(e); };
  const handlePointerUp   = () => { isTouching.current = false; };

  return (
    <div style={{ position: "relative", display: "flex", height: "100dvh", width: "100dvw", flexDirection: "column", gap: "3.75rem", alignItems: "center", justifyContent: "center" }}>
      <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", textAlign: "center", lineHeight: 1.2, margin: 0 }}>
        {headline}
        <br />
        {subline}
      </h2>

      <PixelateSvgFilter id={filterId} size={pixelSize} crossLayers={crossLayers} />

      <div
        ref={imageRef}
        style={{
          position: "relative", height: "55vh", width: "100%",
          maxWidth: "min(90vw, 32rem)", overflow: "hidden",
          touchAction: "none", filter: `url(#${filterId})`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    </div>
  );
}
