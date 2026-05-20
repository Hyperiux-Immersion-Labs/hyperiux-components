"use client";
import { useEffect, useRef, useState } from"react";

const lerp = (a, b, n) => (1 - n) * a + n * b;

export const useMouse = ({
 smooth = true,
 lerpFactor = 0.1,
} = {}) => {
 const mouse = useRef({ x: 0, y: 0 });
 const lastMouse = useRef({ x: 0, y: 0 });
 const smoothMouse = useRef({ x: 0, y: 0 });

 const rafRef = useRef(null);

 // Optional state (only if you want re-renders)
 const [state, setState] = useState({
 x: 0,
 y: 0,
 smoothX: 0,
 smoothY: 0,
 dx: 0,
 dy: 0,
 distance: 0,
 });

 const handleMouseMove = (e) => {
 mouse.current = {
 x: e.clientX,
 y: e.clientY,
 };
 };

 const loop = () => {
 const { x, y } = mouse.current;
 const { x: lx, y: ly } = lastMouse.current;

 const dx = x - lx;
 const dy = y - ly;
 const distance = Math.hypot(dx, dy);

 // Smooth interpolation
 if (smooth) {
 smoothMouse.current.x = lerp(smoothMouse.current.x, x, lerpFactor);
 smoothMouse.current.y = lerp(smoothMouse.current.y, y, lerpFactor);
 } else {
 smoothMouse.current.x = x;
 smoothMouse.current.y = y;
 }

 // Update state (if used)
 setState({
 x,
 y,
 smoothX: smoothMouse.current.x,
 smoothY: smoothMouse.current.y,
 dx,
 dy,
 distance,
 });

 lastMouse.current = { x, y };

 rafRef.current = requestAnimationFrame(loop);
 };

 useEffect(() => {
 window.addEventListener("mousemove", handleMouseMove);
 rafRef.current = requestAnimationFrame(loop);

 return () => {
 window.removeEventListener("mousemove", handleMouseMove);
 if (rafRef.current) cancelAnimationFrame(rafRef.current);
 };
 }, []);

 return {
 // RAW values
 x: state.x,
 y: state.y,

 // SMOOTH values (important for animations)
 smoothX: state.smoothX,
 smoothY: state.smoothY,

 // MOVEMENT
 dx: state.dx,
 dy: state.dy,
 distance: state.distance,

 // REFS (for performance-heavy GSAP usage)
 mouse,
 smoothMouse,
 };
};