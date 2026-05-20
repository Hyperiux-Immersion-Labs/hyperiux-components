"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

function Card({ item, cardBg, cardTextColor, barBg }) {
  return (
    <div className="card-drift-card" style={{ position: "absolute", cursor: "grab" }}>
      <div style={{ width: "24rem", maxWidth: "90vw", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", background: cardBg, color: cardTextColor }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", padding: "0.25rem 0.75rem", background: barBg }}>
          <span>{item.year}</span>
          <span>{item.tag}</span>
        </div>
        <div style={{ padding: "1.5rem", fontSize: "1.125rem", lineHeight: 1, fontWeight: 300 }}>
          {item.text}
        </div>
      </div>
    </div>
  );
}

export function CardDrift({
  data = [],
  cardBg = "#4338ca",
  cardTextColor = "#ffffff",
  barBg = "#262626",
  bgColor = "#000000",
  bgText = "Draggable\nTestimonial",
  bgTextColor = "rgba(255,255,255,0.1)",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const cards = gsap.utils.toArray(".card-drift-card");
      const containerRect = container.getBoundingClientRect();

      const isMobile = containerRect.width < 640;
      const cols = isMobile ? 2 : Math.ceil(Math.sqrt(cards.length));
      const rows = Math.ceil(cards.length / cols);
      const cellWidth = containerRect.width / cols;

      const firstCardRect = cards[0]?.getBoundingClientRect();
      const cardHeight = firstCardRect?.height || 0;
      const cellHeight = isMobile ? cardHeight + 50 : containerRect.height / rows;

      let zCounter = cards.length;

      cards.forEach((card, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cardRect = card.getBoundingClientRect();

        let x = col * cellWidth + (cellWidth - cardRect.width) / 2 + gsap.utils.random(-30, 30);
        let y = row * cellHeight + (cellHeight - cardRect.height) / 2 + gsap.utils.random(-30, 30);

        x = Math.max(0, Math.min(x, containerRect.width - cardRect.width));
        y = Math.max(0, Math.min(y, containerRect.height - cardRect.height));

        gsap.set(card, { x, y, rotation: gsap.utils.random(-3, 3), zIndex: i + 1 });

        let lastX = x, lastY = y, velX = 0, velY = 0, lastTime = 0;

        Draggable.create(card, {
          type: "x,y",
          onPress() {
            gsap.killTweensOf(card);
            velX = 0; velY = 0;
            lastX = gsap.getProperty(card, "x");
            lastY = gsap.getProperty(card, "y");
            lastTime = performance.now();
            zCounter += 1;
            card.style.zIndex = zCounter;
            gsap.to(card, { scale: 1.05, duration: 0.2, ease: "power2.out" });
          },
          onDrag() {
            const now = performance.now();
            const dt = now - lastTime;
            if (dt > 0) {
              const curX = gsap.getProperty(card, "x");
              const curY = gsap.getProperty(card, "y");
              const alpha = Math.min(1, dt / 30);
              velX = velX * (1 - alpha) + ((curX - lastX) / dt) * alpha;
              velY = velY * (1 - alpha) + ((curY - lastY) / dt) * alpha;
              lastX = curX; lastY = curY; lastTime = now;
            }
          },
          onRelease() {
            gsap.to(card, { scale: 1, duration: 0.2, ease: "power2.out" });
            const bounds = container.getBoundingClientRect();
            const maxX = bounds.width - card.offsetWidth;
            const maxY = bounds.height - card.offsetHeight;
            const throwDuration = 0.7;
            const throwX = velX * throwDuration * 1000 * 0.35;
            const throwY = velY * throwDuration * 1000 * 0.35;
            const curX = gsap.getProperty(card, "x");
            const curY = gsap.getProperty(card, "y");
            const targetX = Math.max(0, Math.min(curX + throwX, maxX));
            const targetY = Math.max(0, Math.min(curY + throwY, maxY));
            const speed = Math.sqrt(velX * velX + velY * velY);
            const distOutX = Math.max(0, -curX, curX - maxX);
            const distOutY = Math.max(0, -curY, curY - maxY);
            const distOut = Math.sqrt(distOutX * distOutX + distOutY * distOutY);
            const baseDuration = gsap.utils.clamp(0.3, 1.0, speed * 0.4);
            const duration = gsap.utils.clamp(0.4, 1.2, baseDuration + distOut * 0.002);
            gsap.to(card, { x: targetX, y: targetY, duration, ease: "power3.out" });
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [data]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: bgColor }}>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "clamp(3rem, 9vw, 7rem)", fontWeight: 300, pointerEvents: "none", userSelect: "none",
        textAlign: "center", lineHeight: 1, color: bgTextColor, whiteSpace: "pre-line",
      }}>
        {bgText}
      </div>
      {data.map((item, index) => (
        <Card key={index} item={item} cardBg={cardBg} cardTextColor={cardTextColor} barBg={barBg} />
      ))}
    </div>
  );
}
