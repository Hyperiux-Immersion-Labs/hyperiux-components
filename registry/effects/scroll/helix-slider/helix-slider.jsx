"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import "./helix-slider.css";

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
      className={`cylindrical-scroll-section ${className}`}
      style={{
        "--card-width": `${cardWidth}px`,
        "--card-height": `${cardHeight}px`,
        "--scene-perspective": `${perspective}px`,
      }}
    >
      <div className="cylindrical-scroll-stage">
        <div className="cylindrical-scroll-scene">
          {repeatedItems.map((item, index) => (
            <div key={`${item.id}-${index}`} ref={addToRefs} className="cylindrical-scroll-card">
              <div className="cylindrical-scroll-card-inner">
                <div className="cylindrical-scroll-card-face cylindrical-scroll-card-front">
                  <img src={item.image} alt={item.title || `Card ${index + 1}`} className="cylindrical-scroll-card-image" />
                </div>
                <div className="cylindrical-scroll-card-face cylindrical-scroll-card-back">
                  <img src={item.image} alt={`${item.title || `Card ${index + 1}`} back`} className="cylindrical-scroll-card-image" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HelixSlider;
