"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function HelixSlider({
  items = [],
  cardWidth = 220,
  cardHeight = 300,
  verticalSpacing = 110,
  snakeAmplitude = 300,
  snakeTightness = 0.95,
  depthAmplitude = 180,
  scrollDistance = 340,
  perspective = 1800,
  scaleMin = 0.74,
  yRotateStrength = 1,
  zRotateStrength = 1,
  maxYRotation = 75,
  maxZRotation = 18,
  className = "",
}) {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const repeatedItems = useMemo(() => [...items, ...items, ...items], [items]);

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  useLayoutEffect(() => {
    if (!sectionRef.current || !cardRefs.current.length) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current;
      const baseCount = items.length;
      const totalTravel = baseCount * verticalSpacing;

      const render = (travel) => {
        cards.forEach((card, index) => {
          const localIndex = index - baseCount;
          const flowY = localIndex * verticalSpacing - travel;
          const phase = (flowY / verticalSpacing) * snakeTightness;
          const x = Math.sin(phase) * snakeAmplitude;
          const z = Math.cos(phase) * depthAmplitude;
          const y = flowY;
          const scale = clamp(gsap.utils.mapRange(-depthAmplitude, depthAmplitude, scaleMin, 1, z), scaleMin, 1);
          const dx_dPhase = Math.cos(phase) * snakeAmplitude;
          const dz_dPhase = -Math.sin(phase) * depthAmplitude;

          const rotationY = clamp((-dx_dPhase / Math.max(snakeAmplitude, 1)) * maxYRotation * yRotateStrength, -maxYRotation, maxYRotation);
          const rotationZ = clamp((dx_dPhase / Math.max(snakeAmplitude, 1)) * maxZRotation * zRotateStrength, -maxZRotation, maxZRotation);
          const rotationX = clamp((dz_dPhase / Math.max(depthAmplitude, 1)) * 8, -8, 8);

          gsap.set(card, {
            x,
            y,
            z,
            scale,
            rotationY,
            rotationX,
            rotationZ,
            transformPerspective: perspective,
            transformOrigin: "center center",
            zIndex: Math.round(1000 + z),
          });
        });
      };

      render(0);

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${scrollDistance}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => render(self.progress * totalTravel),
      });

      return () => st.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [items, repeatedItems, verticalSpacing, snakeAmplitude, snakeTightness, depthAmplitude, scrollDistance, perspective, scaleMin, yRotateStrength, zRotateStrength, maxYRotation, maxZRotation]);

  return (
    <section
      ref={sectionRef}
      className={`relative h-screen w-full overflow-hidden bg-[#020202] max-md:[--card-height:245px] max-md:[--card-width:180px] max-sm:[--card-height:190px] max-sm:[--card-width:140px] ${className}`}
      style={{
        "--card-width": `${cardWidth}px`,
        "--card-height": `${cardHeight}px`,
        "--scene-perspective": `${perspective}px`,
      }}
    >
      <div className="relative h-screen w-full overflow-hidden perspective-(--scene-perspective,1800px) perspective-origin-[center_center]">
        <div className="relative h-full w-full transform-3d">
          {repeatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              ref={addToRefs}
              className="absolute left-1/2 top-1/2 h-(--card-height,300px) w-(--card-width,220px) will-change-transform ml-[calc(var(--card-width,220px)/-2)] mt-[calc(var(--card-height,300px)/-2)] transform-3d"
            >
              <div className="relative h-full w-full transform-3d">
                <div className="absolute inset-0 h-full w-full overflow-hidden bg-[#f2eee2] shadow-[0_18px_40px_rgba(0,0,0,0.22),0_4px_12px_rgba(0,0,0,0.16)] backface-hidden [-webkit-backface-visibility:hidden] transform-[rotateY(0deg)_translateZ(1px)]">
                  <img src={item.image} alt={item.title || `Card ${index + 1}`} className="block h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 h-full w-full overflow-hidden bg-[#111111] shadow-[0_18px_40px_rgba(0,0,0,0.22),0_4px_12px_rgba(0,0,0,0.16)] backface-hidden [-webkit-backface-visibility:hidden] transform-[rotateY(180deg)_translateZ(1px)]">
                  <img src={item.image} alt={`${item.title || `Card ${index + 1}`} back`} className="block h-full w-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

