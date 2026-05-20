"use client";
import { useCallback, useEffect, useRef } from "react";

const imageUrls = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=350&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=280&h=320&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=320&h=280&fit=crop",
  "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=280&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=350&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=260&h=300&fit=crop",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=280&h=360&fit=crop",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=280&fit=crop",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=320&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=280&h=340&fit=crop",
];

const SLOTS = [
  { y: 0, size: 1.19, w: 206, h: 167 },
  { y: -30, size: 1.10, w: 214, h: 167 },
  { y: 30, size: 1.20, w: 214, h: 167 },
  { y: -60, size: 1.06, w: 186, h: 144 },
  { y: 60, size: 1.06, w: 186, h: 144 },
  { y: -94, size: 0.91, w: 157, h: 122 },
  { y: 94, size: 0.91, w: 157, h: 122 },
  { y: -122, size: 0.80, w: 139, h: 109 },
  { y: 122, size: 0.80, w: 139, h: 109 },
  { y: -18, size: 1.04, w: 166, h: 129 },
  { y: 18, size: 1.02, w: 161, h: 126 },
  { y: -52, size: 0.97, w: 153, h: 118 },
  { y: 52, size: 0.97, w: 153, h: 118 },
  { y: -78, size: 0.87, w: 137, h: 108 },
  { y: 78, size: 0.87, w: 137, h: 108 },
  { y: -134, size: 0.70, w: 111, h: 83 },
  { y: 134, size: 0.70, w: 111, h: 83 },
  { y: 10, size: 0.91, w: 140, h: 108 },
];

const SPEED = 0.0003;
const MAX_SPEED = 0.0015;
const FOLLOW = 0.22;
const SPREAD_X = 250;
const MOUSE_SPEED_BOOST = 0.003;
const FORWARD_PUSH_AMOUNT = 40;
const UPWARD_PUSH_AMOUNT = 30;
const SCALE_OUT_MIN = 0.68;
const SCALE_OUT_MAX = 1.48;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function drawRoundedImage(ctx, img, x, y, w, h, r = 0) {
  if (!img?.complete || img.naturalWidth <= 0) return;

  const imgAspect = img.naturalWidth / img.naturalHeight;
  const boxAspect = w / h;
  let sx, sy, sw, sh;

  if (imgAspect > boxAspect) {
    sh = img.naturalHeight;
    sw = sh * boxAspect;
    sx = (img.naturalWidth - sw) / 2;
    sy = 0;
  } else {
    sw = img.naturalWidth;
    sh = sw / boxAspect;
    sx = 0;
    sy = (img.naturalHeight - sh) / 2;
  }

  if (r > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.clip();
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    ctx.restore();
    return;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

export function MagneticImageTrail() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(0);

  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const dirRef = useRef({ x: 1, y: 0 });
  const lastMoveAt = useRef(0);
  const inside = useRef(false);
  const phase = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    const imgs = SLOTS.map((_, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrls[i % imageUrls.length];
      return img;
    });

    imagesRef.current = imgs;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      pointer.current = { x: w / 2, y: h / 2 };
      smooth.current = { x: w / 2, y: h / 2 };
    }

    resize();
    window.addEventListener("resize", resize);

    function frame(now) {
      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      ctx.clearRect(0, 0, W, H);

      const dt = Math.min(32, now - (lastTime.current || now));
      lastTime.current = now;

      const prevSX = smooth.current.x;
      const prevSY = smooth.current.y;
      smooth.current.x += (pointer.current.x - smooth.current.x) * FOLLOW;
      smooth.current.y += (pointer.current.y - smooth.current.y) * FOLLOW;

      const cx = smooth.current.x;
      const cy = smooth.current.y;

      const vx = cx - prevSX;
      const vy = cy - prevSY;
      const vmag = Math.hypot(vx, vy);
      if (vmag > 0.35) {
        const tx = vx / vmag;
        const ty = vy / vmag;
        dirRef.current.x = dirRef.current.x + (tx - dirRef.current.x) * 0.2;
        dirRef.current.y = dirRef.current.y + (ty - dirRef.current.y) * 0.2;
        const m = Math.hypot(dirRef.current.x, dirRef.current.y) || 1;
        dirRef.current.x /= m;
        dirRef.current.y /= m;
        lastMoveAt.current = now;
      } else if (!lastMoveAt.current) {
        lastMoveAt.current = now;
      }

      const speed01 = clamp(vmag / 18, 0, 1);
      const currentSpeed = clamp(SPEED + speed01 * MOUSE_SPEED_BOOST, SPEED, MAX_SPEED);
      phase.current += dt * currentSpeed;
      const dir = dirRef.current;

      const cards = SLOTS.map((slot, i) => {
        const n = SLOTS.length;
        const t = (phase.current + i / n) % 1;
        const pathNorm = t * 2 - 1;
        const moveX = pathNorm;
        const moveY = -pathNorm;

        const yOffset = clamp(slot.y, -SPREAD_X * 0.82, SPREAD_X * 0.82);
        const circleWidthAtY = Math.sqrt(Math.max(0, SPREAD_X * SPREAD_X - yOffset * yOffset)) * 0.74;
        const diagonalPush = SPREAD_X * 0.15;
        const verticalLift = -SPREAD_X * 0.06;

        const x = cx + moveX * circleWidthAtY;
        const y = cy + yOffset + moveY * diagonalPush + verticalLift;

        const rawCenterScale = Math.max(0, 1 - Math.abs(pathNorm));
        const easedCenterScale = rawCenterScale * rawCenterScale * (3 - 2 * rawCenterScale);
        const centerScale = lerp(0.06, 0.9, easedCenterScale);

        const dx = x - cx;
        const dy = y - cy;
        const directionalProjection = clamp(
          (dx * dir.x + dy * dir.y) / Math.max(1, SPREAD_X),
          -1, 1
        );
        const oppositeProjection = -directionalProjection;
        const backwardAmount = (oppositeProjection + 1) * 0.5;
        const movementBoost = lerp(1, 1.18, speed01);
        const directionalScale = lerp(SCALE_OUT_MIN, SCALE_OUT_MAX, backwardAmount) * movementBoost;
        const scale = centerScale * directionalScale * 1.14;

        const forwardPush = Math.max(0, directionalProjection) * speed01 * FORWARD_PUSH_AMOUNT;
        const upwardPush = Math.max(0, oppositeProjection) * speed01 * UPWARD_PUSH_AMOUNT;

        return {
          i,
          img: imgs[i % imgs.length],
          x: x + dir.x * forwardPush,
          y: y + dir.y * forwardPush - upwardPush,
          w: slot.w * slot.size * scale,
          h: slot.h * slot.size * scale,
          rot: 0,
          alpha: 1,
          order: i,
        };
      });

      cards.sort((a, b) => a.i - b.i);

      for (const card of cards) {
        if (card.w < 2 || card.h < 2) continue;
        ctx.save();
        ctx.translate(card.x, card.y);
        ctx.globalAlpha = 1;
        ctx.shadowColor = "rgba(0,0,0,0.14)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 5;
        drawRoundedImage(ctx, card.img, -card.w / 2, -card.h / 2, card.w, card.h, 0);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const updatePointer = useCallback((e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointer.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    inside.current = true;
  }, []);

  return (
    <section
      ref={wrapRef}
      onPointerMove={updatePointer}
      onPointerEnter={updatePointer}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#EDEBE6",
        overflow: "hidden",
      }}
    >
      <div
        className="w-[70%] mx-auto"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 1,
          color: "#111",
          fontSize: "3vw",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        No algorithms. No ads. No overwhelm.
        Just great curation by (real people).
      </div>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </section>
  );
}
