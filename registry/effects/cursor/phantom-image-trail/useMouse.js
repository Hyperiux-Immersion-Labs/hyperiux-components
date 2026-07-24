"use client";
import { useEffect, useRef } from "react";
import { createSuspendedRaf } from "./createSuspendedRaf";

const lerp = (a, b, n) => (1 - n) * a + n * b;

export const useMouse = ({
 smooth = true,
 lerpFactor = 0.1,
} = {}) => {
 const mouse = useRef({ x: 0, y: 0 });
 const lastMouse = useRef({ x: 0, y: 0 });
 const smoothMouse = useRef({ x: 0, y: 0 });
 // Per-frame movement metrics. Kept in a ref - not state - so the frame
 // loop never re-renders the consuming component.
 const movement = useRef({ dx: 0, dy: 0, distance: 0 });

 useEffect(() => {
 const handleMouseMove = (e) => {
 mouse.current = {
 x: e.clientX,
 y: e.clientY,
 };
 };

 const loop = createSuspendedRaf({
 root: null,
 observeOffscreen: false,
 onFrame: () => {
 const { x, y } = mouse.current;
 const { x: lx, y: ly } = lastMouse.current;

 const dx = x - lx;
 const dy = y - ly;

 movement.current.dx = dx;
 movement.current.dy = dy;
 movement.current.distance = Math.hypot(dx, dy);

 // Smooth interpolation
 if (smooth) {
 smoothMouse.current.x = lerp(smoothMouse.current.x, x, lerpFactor);
 smoothMouse.current.y = lerp(smoothMouse.current.y, y, lerpFactor);
 } else {
 smoothMouse.current.x = x;
 smoothMouse.current.y = y;
 }

 lastMouse.current = { x, y };
 },
 });

 window.addEventListener("mousemove", handleMouseMove);
 loop.start();

 return () => {
 window.removeEventListener("mousemove", handleMouseMove);
 loop.destroy();
 };
 }, [lerpFactor, smooth]);

 return {
 // Snapshot values - read once per render, NOT reactive. Use the refs
 // below inside rAF/GSAP loops for live per-frame values.
 x: mouse.current.x,
 y: mouse.current.y,
 smoothX: smoothMouse.current.x,
 smoothY: smoothMouse.current.y,
 dx: movement.current.dx,
 dy: movement.current.dy,
 distance: movement.current.distance,

 // REFS (for performance-heavy GSAP usage)
 mouse,
 smoothMouse,
 movement,
 };
};
