"use client";

import { useEffect, useRef } from "react";

const DEFAULT_CONFIG = {
  particleCount: 120,
  connectionDistance: 140,
  particleColor: "rgba(255,255,255,0.75)",
  lineColor: "rgba(255,255,255,0.15)",
  mouseRadius: 160,
  speed: 0.4,
  particleSize: 1.8,
  background: "#0a0a0a",
};

export function SpiderParticles({
  particleCount = DEFAULT_CONFIG.particleCount,
  connectionDistance = DEFAULT_CONFIG.connectionDistance,
  particleColor = DEFAULT_CONFIG.particleColor,
  lineColor = DEFAULT_CONFIG.lineColor,
  mouseRadius = DEFAULT_CONFIG.mouseRadius,
  speed = DEFAULT_CONFIG.speed,
  particleSize = DEFAULT_CONFIG.particleSize,
  background = DEFAULT_CONFIG.background,
  children,
  style,
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let rafId;
    let W, H;
    let particles = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
      }));
    };

    resize();
    createParticles();

    const onResize = () => {
      resize();
      createParticles();
    };
    window.addEventListener("resize", onResize);

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, W, H);

      const mouse = mouseRef.current;

      // Update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // Subtle mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius && dist > 0) {
          const force = (mouseRadius - dist) / mouseRadius;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
          // Clamp velocity
          const v = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (v > speed * 4) {
            p.vx = (p.vx / v) * speed * 4;
            p.vy = (p.vy / v) * speed * 4;
          }
        }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const alpha = 1 - dist / connectionDistance;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${alpha * 0.5})`);
            ctx.lineWidth = alpha * 1.2;
            ctx.stroke();
          }
        }

        // Mouse connection lines
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouseRadius) {
          const alpha = 1 - mdist / mouseRadius;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${alpha * 0.8})`);
          ctx.lineWidth = alpha * 1.5;
          ctx.stroke();
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [particleCount, connectionDistance, particleColor, lineColor, mouseRadius, speed, particleSize]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background,
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {children && (
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      )}
    </div>
  );
}
