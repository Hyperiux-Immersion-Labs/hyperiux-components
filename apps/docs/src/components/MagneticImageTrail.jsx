"use client";
import { useCallback, useEffect, useRef } from"react";

const imageUrls = [
    "/assets/img/distortion.jpg",
  "/assets/img/image01.webp",
  "/assets/img/image02.webp",
  "/assets/img/image03.webp",
  "/assets/img/image04.png",
  "/assets/img/image05.png",
  "/assets/img/image06.png",
  "/assets/img/image07.png",
  "/assets/img/image08.jpg",
  "/assets/img/image09.jpg",
  "/assets/img/image10.jpg",
];

const SLOTS = [
 { y: 0, size: 1.19, w: 206, h: 167 }, // mid - just a bit bigger
 { y: -30, size: 1.10, w: 214, h: 167 }, // 2nd closest - little bigger, spread more
 { y: 30, size: 1.20, w: 214, h: 167 },
 { y: -60, size: 1.06, w: 186, h: 144 }, // spread more
 { y: 60, size: 1.06, w: 186, h: 144 },

 { y: -94, size: 0.91, w: 157, h: 122 }, // spread more
 { y: 94, size: 0.91, w: 157, h: 122 },
 { y: -122, size: 0.80, w: 139, h: 109 },
 { y: 122, size: 0.80, w: 139, h: 109 },

 { y: -18, size: 1.04, w: 166, h: 129 }, // very little more than before
 { y: 18, size: 1.02, w: 161, h: 126 },
 { y: -52, size: 0.97, w: 153, h: 118 },
 { y: 52, size: 0.97, w: 153, h: 118 },

 { y: -78, size: 0.87, w: 137, h: 108 },
 { y: 78, size: 0.87, w: 137, h: 108 },
 { y: -134, size: 0.70, w: 111, h: 83 }, // spread a bit more at edges
 { y: 134, size: 0.70, w: 111, h: 83 },
 { y: 10, size: 0.91, w: 140, h: 108 }, // very little
];

// Faster + tighter motion.
const SPEED = 0.0003;
const MAX_SPEED = 0.0015; // Added max speed limit for generation
const FOLLOW = 0.22;
const SPREAD_X = 250; // Slightly more spread since sizes increased
const DEPTH_POWER = 0.95;
const THICKNESS = 0.62;

// Interaction Config
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

 // No rounded corners.
 ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

export default function ImageTrail() {
 const wrapRef = useRef(null);
 const canvasRef = useRef(null);
 const imagesRef = useRef([]);
 const rafRef = useRef(0);

 const pointer = useRef({ x: 0, y: 0 });
 const lerpedPointer = useRef({ x: 0, y: 0 }); // lerped pointer position
 const smooth = useRef({ x: 0, y: 0 });
 const dirRef = useRef({ x: 1, y: 0 });
 const lastMoveAt = useRef(0);
 const inside = useRef(false);
 const phase = useRef(0);
 const lastTime = useRef(0);

 useEffect(() => {
 const imgs = SLOTS.map((_, i) => {
 const img = new Image();
 img.crossOrigin ="anonymous";
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
 lerpedPointer.current = { x: w / 2, y: h / 2 };
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

 // --- lerp pointer on every frame ---
 // The lerped pointer smoothly follows the actual pointer.
 // A lerp amount of 0.18 gives a nice responsive but eased motion.
 const LERP_AMOUNT = 0.18;
 lerpedPointer.current.x = lerp(lerpedPointer.current.x, pointer.current.x, LERP_AMOUNT);
 lerpedPointer.current.y = lerp(lerpedPointer.current.y, pointer.current.y, LERP_AMOUNT);

 // Phase increment will be calculated after mouse speed is determined

 const prevSX = smooth.current.x;
 const prevSY = smooth.current.y;

 // use lerpedPointer instead of pointer directly for the trailing smooth position
 smooth.current.x += (lerpedPointer.current.x - smooth.current.x) * FOLLOW;
 smooth.current.y += (lerpedPointer.current.y - smooth.current.y) * FOLLOW;

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
  // INCREASE GENERATING SPEED BASED ON MOUSE MOVEMENT, CLAMPED TO MAX_SPEED
 const currentSpeed = clamp(SPEED + speed01 * MOUSE_SPEED_BOOST, SPEED, MAX_SPEED);
 phase.current += dt * currentSpeed;
 const dir = dirRef.current;
 const denom = Math.max(1, SPREAD_X);
 const dirIntensity = 0.18 + speed01 * 0.12;

 const cards = SLOTS.map((slot, i) => {
 const n = SLOTS.length;

 // Animation progress per image.
 const t = (phase.current + i / n) % 1;

 // -1 → 0 → 1
 // This controls the movement along the diagonal path.
 const pathNorm = t * 2 - 1;

 // Diagonal movement direction.
 // Start: bottom-right
 // Center: middle
 // End: top-left
 // Bottom-left → top-right, but less steep.
 const moveX = pathNorm;
 const moveY = -pathNorm;

 // Keep the circular cluster shape.
 const yOffset = clamp(slot.y, -SPREAD_X * 0.82, SPREAD_X * 0.82);

 const circleWidthAtY =
 Math.sqrt(Math.max(0, SPREAD_X * SPREAD_X - yOffset * yOffset)) * 0.74;

 // Lower number = flatter/slanting movement.
 // 0.38 was too steep.
 const diagonalPush = SPREAD_X * 0.15;

 // Move the whole diagonal slightly upward,
 // so it starts a little above bottom-left
 // and ends a little below top-right.
 const verticalLift = -SPREAD_X * 0.06;

 const x = cx + moveX * circleWidthAtY;
 const y = cy + yOffset + moveY * diagonalPush + verticalLift;

 // Scale follows the same diagonal movement:
 // small → big at center → small
 const rawCenterScale = Math.max(0, 1 - Math.abs(pathNorm));
 const easedCenterScale =
 rawCenterScale * rawCenterScale * (3 - 2 * rawCenterScale);
 const centerScale = lerp(0.06, 0.9, easedCenterScale);

 // Scale images up in the direction of mouse movement.
 // Images ahead of the mouse direction get larger.
 // Images behind the mouse direction get smaller.
 const dx = x - cx;
 const dy = y - cy;

 const directionalProjection = clamp(
 (dx * dir.x + dy * dir.y) / Math.max(1, SPREAD_X),
 -1,
 1
 );

 // Scaling out works on OPPOSITE direction.
 // Images behind the mouse direction get larger (scale out).
 const oppositeProjection = -directionalProjection;
 const backwardAmount = (oppositeProjection + 1) * 0.5;

 const movementBoost = lerp(1, 1.18, speed01);
 const directionalScale = lerp(SCALE_OUT_MIN, SCALE_OUT_MAX, backwardAmount) * movementBoost;
 const scale = centerScale * directionalScale * 1.14;

 // Image translate effect on mouse move direction.
 // Images ahead of the mouse are pushed forward.
 const forwardPush = Math.max(0, directionalProjection) * speed01 * FORWARD_PUSH_AMOUNT;

 // Images scaling out (behind) translate a little up
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

 // Stable stacking: never sort by `depth` (which changes during animation).
 cards.sort((a, b) => a.i - b.i);

 for (const card of cards) {
 if (card.w < 2 || card.h < 2) continue;

 ctx.save();
 ctx.translate(card.x, card.y);
 ctx.globalAlpha = 1;
 ctx.shadowColor ="rgba(0,0,0,0.14)";
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
 // On mouse move, we set pointer to the actual event location (no lerp here).
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
 position:"relative",
 width:"100%",
 height:"100vh",
 background:"#EDEBE6",
 overflow:"hidden",
 }}
 >
 <div
 className="w-[70%] mx-auto"
 style={{
 position:"absolute",
 inset: 0,
 display:"flex",
 alignItems:"center",
 justifyContent:"center",
 pointerEvents:"none",
 userSelect:"none",
 zIndex: 1,
 color:"#111",
 fontSize:"3vw",

 letterSpacing:"-0.03em",
 lineHeight: 1.05,
 textAlign:"center",
 padding:"0 20px",
 }}
 >
 No algorithms.No ads.No overwhelm.
 Justgreatcurationby (real people).
 </div>
 <canvas
 ref={canvasRef}
 style={{
 position:"absolute",
 inset: 0,
 width:"100%",
 height:"100%",
 pointerEvents:"none",
 zIndex: 2,
 }}
 />
 </section>
 );
}
