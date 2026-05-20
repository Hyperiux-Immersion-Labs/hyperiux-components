"use client"
import React, { useEffect, useRef } from"react";

export default function RunningHorse() {
 const canvasRef = useRef(null);

 useEffect(() => {
 const canvas = canvasRef.current;
 const ctx = canvas.getContext("2d");

 let raf;
 const BLUE ="#0038b8";
 const BG ="#eef3ee";

 const poses = [
 [[-6,5,-9,8],[-1,5,1,9],[5,5,8,8],[9,4,12,6]],
 [[-6,5,-12,7],[-1,5,-2,9],[5,5,10,7],[9,4,13,5]],
 [[-6,5,-14,7],[-1,5,2,9],[5,5,12,6],[9,4,10,9]],
 [[-6,5,-8,8],[-1,5,-4,9],[5,5,13,4],[9,4,8,9]],
 [[-6,5,-5,8],[-1,5,-5,8],[5,5,7,10],[9,4,9,8]],
 [[-6,5,-3,7],[-1,5,-5,8],[5,5,3,8],[9,4,12,6]],
 ];

 function resize() {
 const dpr = window.devicePixelRatio || 1;
 canvas.width = canvas.clientWidth * dpr;
 canvas.height = canvas.clientHeight * dpr;
 ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 }

 resize();
 window.addEventListener("resize", resize);

 function addEllipse(arr, cx, cy, rx, ry) {
 for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
 for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
 if (((x - cx) ** 2) / rx ** 2 + ((y - cy) ** 2) / ry ** 2 <= 1) {
 arr.push([x, y]);
 }
 }
 }
 }

 function addLine(arr, x1, y1, x2, y2, count) {
 for (let i = 0; i < count; i++) {
 const t = i / Math.max(1, count - 1);
 arr.push([
 Math.round(x1 + (x2 - x1) * t),
 Math.round(y1 + (y2 - y1) * t),
 ]);
 }
 }

 function dedupe(points) {
 return [...new Map(points.map((p) => [p.join(","), p])).values()];
 }

 function makeFrame(legs, frameIndex) {
 const p = [];

 // compact horse body
 addEllipse(p, -3.5, 1.2, 7.6, 3.1);
 addEllipse(p, 3.5, 1.4, 6.3, 3.2);
 addEllipse(p, -8.4, 0.7, 3.2, 2.1);

 // flatter tail like reference
 addLine(p, -10, -0.7, -18, -0.8, 10);
 addLine(p, -10, 0.2, -17, 0.1, 8);

 // neck and lowered head
 addLine(p, 6.5, -1.2, 10, -3.5, 7);
 addEllipse(p, 13.3, -3.7, 4.6, 1.65);
 addLine(p, 15.5, -3.6, 20, -2.9, 6);

 // ears / top neck
 addLine(p, 9.8, -4.4, 10.8, -5.8, 3);
 addLine(p, 11.2, -4.2, 12.5, -5.2, 3);

 // rider
 addLine(p, 0.5, -2.5, 3.8, -5.8, 5);
 addEllipse(p, 4.2, -6.7, 1.05, 1.05);
 addLine(p, 2, -2.1, 6.2, -2.2, 5);

 // gallop legs
 legs.forEach(([x1, y1, x2, y2]) => addLine(p, x1, y1, x2, y2, 6));

 // frame-specific missing/fading dots
 return dedupe(p).filter((_, i) => (i + frameIndex * 2) % 13 !== 0);
 }

 const frames = poses.map(makeFrame);

 function dot(x, y, r, a) {
 ctx.globalAlpha = a;
 ctx.beginPath();
 ctx.arc(x, y, r, 0, Math.PI * 2);
 ctx.fillStyle = BLUE;
 ctx.fill();
 ctx.globalAlpha = 1;
 }

 function render(now) {
 const w = canvas.clientWidth;
 const h = canvas.clientHeight;

 ctx.fillStyle = BG;
 ctx.fillRect(0, 0, w, h);

 const s = Math.min(w, h) / 36;
 const cx = w / 2 - s * 1.5;
 const cy = h * 0.47;

 const frameIndex = Math.floor((now / 1000) * 11) % frames.length;
 const pts = frames[frameIndex];

 pts.forEach(([x, y], i) => {
 const blink =
 (i + frameIndex) % 9 === 0 ? 0.22 :
 (i + frameIndex) % 5 === 0 ? 0.55 :
 1;

 const radius =
 (i + frameIndex) % 7 === 0 ? s * 0.18 :
 (i + frameIndex) % 4 === 0 ? s * 0.25 :
 s * 0.31;

 dot(cx + x * s, cy + y * s, radius, blink);
 });

 raf = requestAnimationFrame(render);
 }

 raf = requestAnimationFrame(render);

 return () => {
 cancelAnimationFrame(raf);
 window.removeEventListener("resize", resize);
 };
 }, []);

 return (
 <canvas
 ref={canvasRef}
 style={{
 width:"100%",
 height:"100vh",
 display:"block",
 background:"#eef3ee",
 }}
 />
 );
}