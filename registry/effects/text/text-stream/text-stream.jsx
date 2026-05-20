"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

export function TextStream({
  items = [],
  prefix = "Tomorrow",
  fontSize = "clamp(1.25rem, 3vw, 2.25rem)",
  fontWeight = 200,
}) {
  if (!items.length) return null;

  const trackRef = useRef(null);
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [copyCount, setCopyCount] = useState(2);
  const metricsRef = useRef({
    currentY: 0,
    distance: 0,
    currentVelocity: 0.6,
    targetVelocity: 0.6,
    lastScrollDirection: 1,
  });
  const scrollTimeoutRef = useRef(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const content = contentRef.current;
    const container = containerRef.current;
    if (!track || !content || !container) return;

    const ctx = gsap.context(() => {
      const baseSpeed = 0.6;
      const maxBoost = 12;
      let lastScrollY = window.scrollY;

      const startAnimation = () => {
        const distance = content.offsetHeight;
        const containerHeight = container.offsetHeight;
        if (!distance || !containerHeight) return;

        const nextCopyCount = Math.max(2, Math.ceil(containerHeight / distance) + 2);
        setCopyCount((c) => (c === nextCopyCount ? c : nextCopyCount));
        metricsRef.current.distance = distance;

        if (metricsRef.current.currentY <= -distance) metricsRef.current.currentY += distance;
        else if (metricsRef.current.currentY > 0) metricsRef.current.currentY -= distance;

        gsap.set(track, { y: metricsRef.current.currentY });
      };

      const tick = (_, deltaTime) => {
        const { distance } = metricsRef.current;
        if (!distance) return;

        const frameFactor = deltaTime / (1000 / 60);
        metricsRef.current.currentVelocity = gsap.utils.interpolate(
          metricsRef.current.currentVelocity,
          metricsRef.current.targetVelocity,
          0.14
        );
        metricsRef.current.currentY += metricsRef.current.currentVelocity * frameFactor;

        if (metricsRef.current.currentY <= -distance) metricsRef.current.currentY += distance;
        else if (metricsRef.current.currentY >= 0) metricsRef.current.currentY -= distance;

        gsap.set(track, { y: metricsRef.current.currentY });
      };

      const applyScrollMotion = (delta) => {
        if (!delta) return;
        const direction = delta > 0 ? -1 : 1;
        const boost = Math.min(maxBoost, baseSpeed + Math.pow(Math.abs(delta), 1.2) * 0.08);
        metricsRef.current.lastScrollDirection = direction;
        metricsRef.current.targetVelocity = direction * boost;
        window.clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = window.setTimeout(() => {
          metricsRef.current.targetVelocity = metricsRef.current.lastScrollDirection * baseSpeed;
        }, 120);
      };

      const handleWheel  = (e) => applyScrollMotion(e.deltaY);
      const handleScroll = () => {
        const next = window.scrollY;
        applyScrollMotion(next - lastScrollY);
        lastScrollY = next;
      };

      startAnimation();
      gsap.ticker.add(tick);

      const ro = new ResizeObserver(startAnimation);
      ro.observe(content);
      ro.observe(container);
      window.addEventListener("resize", startAnimation);
      window.addEventListener("wheel",  handleWheel,  { passive: true });
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", startAnimation);
        window.removeEventListener("wheel",  handleWheel);
        window.removeEventListener("scroll", handleScroll);
        window.clearTimeout(scrollTimeoutRef.current);
        gsap.ticker.remove(tick);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left — static prefix */}
      <div style={{ width: "45%", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
        <p style={{ fontSize, fontWeight, lineHeight: 1, whiteSpace: "nowrap", margin: 0 }}>
          {prefix}
        </p>
      </div>

      {/* Right — scrolling marquee */}
      <div
        ref={containerRef}
        style={{
          position: "relative", width: "55%", height: "100%", overflow: "hidden",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 48%, rgba(0,0,0,1) 48%, rgba(0,0,0,1) 53%, rgba(0,0,0,0.3) 53%, rgba(0,0,0,0.3) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 48%, rgba(0,0,0,1) 48%, rgba(0,0,0,1) 53%, rgba(0,0,0,0.2) 53%, rgba(0,0,0,0.2) 100%)",
        }}
      >
        <div
          ref={trackRef}
          style={{ position: "absolute", left: 0, top: 0, display: "flex", flexDirection: "column", fontSize, fontWeight, lineHeight: 1 }}
        >
          {Array.from({ length: copyCount }, (_, copyIndex) => (
            <div
              key={copyIndex}
              ref={copyIndex === 0 ? contentRef : null}
              style={{ display: "flex", flexDirection: "column" }}
              aria-hidden={copyIndex === 1}
            >
              {items.map((text, i) => (
                <div key={`${copyIndex}-${i}`} style={{ padding: "4px 0 4px 8px", whiteSpace: "nowrap" }}>
                  {text}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
