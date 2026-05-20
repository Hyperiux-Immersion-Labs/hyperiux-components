"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCALE_OFFSCREEN = 1.2;
const ROTATION_DEG = 6;
const SCALE_CENTER = 1.0;
const VH_PER_SLIDE = 100;

export function ParallaxGallery({ images = [], bgColor = "#111111" }) {
  const slides = images.map((src, index) => ({ id: `slide-${index}`, src }));
  const total = slides.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const galleryRef = useRef(null);
  const itemInnerRefs = useRef([]);
  const thumbLeftRef = useRef(null);
  const thumbRightRef = useRef(null);

  const frameW = 500;
  const frameH = 600;
  const slideW = frameW;
  const thumbW = 190;
  const thumbH = 260;
  const thumbGap = 12;
  const thumbItem = thumbW + thumbGap;

  const applyPosition = useCallback(
    (pos) => {
      if (!galleryRef.current) return;

      galleryRef.current.style.transform = `translate3d(${-pos * slideW}px, 0px, 0px)`;

      itemInnerRefs.current.forEach((el, index) => {
        if (!el) return;
        const dist = index - pos;
        const absDist = Math.abs(dist);
        const rot = dist > 0 ? Math.min(absDist, 1) * ROTATION_DEG : -Math.min(absDist, 1) * ROTATION_DEG;
        const scale = SCALE_CENTER + Math.min(absDist, 1) * (SCALE_OFFSCREEN - SCALE_CENTER);
        el.style.transform = `rotate(${rot}deg) scale(${scale})`;
      });

      if (thumbLeftRef.current) thumbLeftRef.current.style.transform = `translate3d(${-pos * thumbItem}px, -50%, 0px)`;
      if (thumbRightRef.current) thumbRightRef.current.style.transform = `translate3d(${-(pos + 1) * thumbItem}px, -50%, 0px)`;
      setActiveIndex(Math.max(0, Math.min(total - 1, Math.round(pos))));
    },
    [slideW, thumbItem, total]
  );

  useEffect(() => {
    if (total <= 1) {
      applyPosition(0);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const snapValues = Array.from({ length: total }, (_, index) => index / (total - 1));
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: snapValues,
        duration: { min: 0.2, max: 0.5 },
        ease: "power2.inOut",
        delay: 0,
        inertia: false,
      },
      onUpdate: (self) => applyPosition(self.progress * (total - 1)),
    });

    applyPosition(0);
    return () => st.kill();
  }, [applyPosition, total]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${total * VH_PER_SLIDE}vh`, background: bgColor }}>
      <div className="sticky top-0 h-screen w-full select-none overflow-hidden" style={{ background: bgColor }}>
        <div className="absolute" style={{ top: 36, right: 40, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" }}>
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        <ThumbStrip refProp={thumbLeftRef} slides={slides} side="left" frameW={frameW} thumbW={thumbW} thumbH={thumbH} thumbGap={thumbGap} bgColor={bgColor} />
        <ThumbStrip refProp={thumbRightRef} slides={slides} side="right" frameW={frameW} thumbW={thumbW} thumbH={thumbH} thumbGap={thumbGap} bgColor={bgColor} />

        <div className="absolute top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)", zIndex: 20 }}>
          <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[624px] w-[524px] -translate-x-1/2 -translate-y-1/2 border border-dashed border-white/50" />
          <div className="absolute top-1/2 left-1/2 m-auto overflow-hidden" style={{ width: frameW - 10, height: frameH - 10, transform: "translate(-50%, -50%)" }}>
            <div ref={galleryRef} className="absolute top-0 left-0 bottom-0 flex will-change-transform" style={{ width: slideW * total }}>
              {slides.map((slide, index) => (
                <div key={slide.id} className="relative shrink-0 overflow-hidden" style={{ width: slideW, height: frameH }}>
                  <div
                    ref={(el) => (itemInnerRefs.current[index] = el)}
                    className="absolute inset-0 will-change-transform"
                    style={{
                      transform: `rotate(${index === 0 ? 0 : ROTATION_DEG}deg) scale(${index === 0 ? 1 : SCALE_OFFSCREEN})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <img src={slide.src} alt={slide.id} draggable="false" className="h-full w-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ThumbStrip({ refProp, slides, side, frameW, thumbW, thumbH, thumbGap, bgColor }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        zIndex: 10,
        overflow: "hidden",
        background: bgColor,
        ...(side === "left" ? { right: `calc(50% + ${frameW / 2}px)`, left: 0 } : { left: `calc(50% + ${frameW / 2}px)`, right: 0 }),
        height: thumbH,
        transform: "translateY(-50%)",
      }}
    >
      <div
        ref={refProp}
        className="absolute top-1/2 flex will-change-transform"
        style={{
          gap: thumbGap,
          transform: "translate3d(0px, -50%, 0px)",
          left: side === "left" ? "100%" : 0,
          right: "auto",
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative shrink-0 overflow-hidden" style={{ width: thumbW, height: thumbH }}>
            <img src={slide.src} alt={slide.id} draggable="false" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParallaxGallery;
