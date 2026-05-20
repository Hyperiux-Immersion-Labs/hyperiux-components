"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function PixelateSvgFilter({ id, size, crossLayers }) {
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

export function SvgPixelReveal({
  src,
  alt = "Image",
  initialPixelSize = 22,
  finalPixelSize = 1,
  start = "top 50%",
  end = "bottom 35%",
  crossLayers = true,
  style = {},
}) {
  const containerRef = useRef(null);
  const filterId = useId().replace(/:/g, "");
  const [pixelSize, setPixelSize] = useState(initialPixelSize);
  const shouldApplyFilter = pixelSize > finalPixelSize + 0.01;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animatedState = { size: initialPixelSize };

    const tween = gsap.to(animatedState, {
      size: finalPixelSize,
      duration: 1.0,
      ease: "none",
      paused: true,
      onUpdate: () => setPixelSize(animatedState.size),
    });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start,
      end,
      animation: tween,
      invalidateOnRefresh: true,
    });

    return () => { trigger.kill(); tween.kill(); };
  }, [end, finalPixelSize, initialPixelSize, start]);

  return (
    <div ref={containerRef} style={{ position: "relative", ...style }}>
      <PixelateSvgFilter id={filterId} size={pixelSize} crossLayers={crossLayers} />
      <div
        style={{
          position: "relative", height: "100%", width: "100%", overflow: "hidden",
          filter: shouldApplyFilter ? `url(#${filterId})` : undefined,
        }}
      >
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    </div>
  );
}
