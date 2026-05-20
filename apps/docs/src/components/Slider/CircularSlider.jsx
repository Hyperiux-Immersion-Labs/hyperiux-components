"use client";

import { useEffect, useRef } from"react";
import Image from"next/image";
import * as THREE from"three";
import Lenis from"lenis";
import gsap from"gsap";

export default function WebGLInfiniteSlider({ items }) {
 const containerRef = useRef(null);
 const circleRef = useRef(null);
 const textContainerRef = useRef(null);
 const activeTextRef = useRef(null);
 const prevRawIndexRef = useRef(0);

 useEffect(() => {
 let scene, camera, renderer;
 let planes = [];
 let rafId;
 let currentRadius = 35;

 const container = containerRef.current;


 const lenis = new Lenis({
 infinite: true,
 lerp: 0.1,
 });

  scene = new THREE.Scene();

 const width = window.innerWidth;
 const height = window.innerHeight;

 camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
 camera.position.z = 5;

 renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
 renderer.setSize(width, height);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

 container.appendChild(renderer.domElement);

 // ---------------------------
 // IMAGE SETUP
 // ---------------------------
 const loader = new THREE.TextureLoader();

 // FULLSCREEN CALC
 const frustumHeight =
 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
 const frustumWidth = frustumHeight * camera.aspect;

 const planeWidth = frustumWidth / 2;
 const planeHeight = frustumHeight;

 const spacing = planeWidth;

 // Speed factor: converts scroll pixels → Three.js world units
 const speedFactor = 0.01;

 items.forEach((item, i) => {
 const texture = loader.load(item.url);
 texture.minFilter = THREE.LinearFilter;

 const geometry = new THREE.PlaneGeometry(
 planeWidth,
 planeHeight,
 32,
 32
 );

 const material = new THREE.ShaderMaterial({
 uniforms: {
 uTexture: { value: texture },
 uZoom: { value: 1.2 },
 },
 vertexShader: `
 varying vec2 vUv;
 void main() {
 vUv = uv;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
 `,
 fragmentShader: `
 uniform sampler2D uTexture;
 uniform float uZoom;
 varying vec2 vUv;

 void main() {
 vec2 uv = vUv;
 uv = (uv - 0.5) / uZoom + 0.5;
 gl_FragColor = texture2D(uTexture, uv);
 }
 `,
 });

 const mesh = new THREE.Mesh(geometry, material);
 mesh.position.x = i * spacing;

 scene.add(mesh);
 planes.push(mesh);
 });

 const totalWidth = spacing * items.length;

 // Unbounded offset via delta tracking (handles Lenis infinite wrap)
 let offset = 0;
 let prevScroll = null;
 let isSnapping = false;
 let snapTimeout = null;
 let snapObj = { offset: 0 };

 // ---------------------------
 // COMBINED RAF + RENDER LOOP
 // ---------------------------
 function raf(time) {
 lenis.raf(time);

 // Delta tracking on wrapped scroll value
 const currentScroll = lenis.scroll;
 const limit = lenis.limit;

 let delta = 0;
 if (prevScroll !== null && limit > 0) {
 delta = currentScroll - prevScroll;
 // Correct for wrap-around
 if (delta > limit / 2) delta -= limit;
 if (delta < -limit / 2) delta += limit;
  if (!isSnapping) {
 offset += delta;
 }
 }
 prevScroll = currentScroll;

 if (!isSnapping && Math.abs(delta) < 0.5) {
 if (!snapTimeout) {
 snapTimeout = setTimeout(() => {
 const currentScrollOffset = offset * speedFactor;
 const targetScrollOffset = Math.round(currentScrollOffset / spacing) * spacing;
 const targetOffset = targetScrollOffset / speedFactor;

 if (Math.abs(offset - targetOffset) > 1) {
 isSnapping = true;
 lenis.stop();
 snapObj.offset = offset;
 gsap.to(snapObj, {
 offset: targetOffset,
 duration: 0.5,
 ease:"power2.inOut",
 onUpdate: () => {
 offset = snapObj.offset;
 },
 onComplete: () => {
 isSnapping = false;
 lenis.start();
 }
 });
 }
 }, 400);
 }
 } else if (Math.abs(delta) >= 0.5) {
 if (snapTimeout) {
 clearTimeout(snapTimeout);
 snapTimeout = null;
 }
 }

 const scrollOffset = offset * speedFactor;

 const targetRadius = Math.min(35 + Math.abs(delta) * 0.2, 55);
 currentRadius += (targetRadius - currentRadius) * 0.1;

 if (circleRef.current) {
 const R = -(scrollOffset / spacing) * (360 / 21);
 circleRef.current.style.transform = `translate(-50%, -50%) rotate(${R}deg)`;
 circleRef.current.style.setProperty('--radius', `-${currentRadius}vh`);
 circleRef.current.style.setProperty('--rotation', `${R}deg`);
 }

 if (textContainerRef.current) {
 let rawIndex = Math.floor((scrollOffset / spacing) + 0.5);

 if (rawIndex !== prevRawIndexRef.current) {
 const isForward = rawIndex > prevRawIndexRef.current;
 prevRawIndexRef.current = rawIndex;

 let activeIndex = ((rawIndex % items.length) + items.length) % items.length;
 const newText = items[activeIndex].description;
  if (textContainerRef.current.dataset.activeText !== newText) {
 textContainerRef.current.dataset.activeText = newText;
  const oldDiv = activeTextRef.current;
  const newDiv = document.createElement("div");
 newDiv.className ="absolute w-full h-full flex items-center justify-center";
 newDiv.innerText = newText;
  textContainerRef.current.appendChild(newDiv);
 activeTextRef.current = newDiv;

 const yOffset = isForward ? 30 : -30;

 gsap.fromTo(newDiv, { y: yOffset }, { y: 0, duration: 0.5, ease:"power3.out" });
 if (oldDiv) {
 gsap.to(oldDiv, {  y: -yOffset,  duration: 0.5,  ease:"power3.out",  onComplete: () => {
 if (oldDiv.parentNode) {
 oldDiv.parentNode.removeChild(oldDiv);
 }
 }  });
 }
 }
 }
 }

 planes.forEach((plane, i) => {
 // Base position minus scroll offset
 let x = i * spacing - scrollOffset;

 // Wrap into [-totalWidth/2, totalWidth/2] for seamless infinite loop
 x = ((x % totalWidth) + totalWidth) % totalWidth;
 if (x > totalWidth / 2) x -= totalWidth;

 plane.position.x = x;

 // SMOOTH TEXTURE ZOOM — cosine easing for circular-path feel
 // Use wrapped position for zoom calculation to avoid glitches at high speeds
 const dist = Math.abs(x);
 const maxDist = frustumWidth;
 const norm = Math.min(dist / maxDist, 1);

 // Cosine arc: 1 at center → 0 at edge (smooth circular curve)
 const arc = Math.cos(norm * Math.PI * 0.5);
 const targetZoom = 1 + (1 - arc) * 1.5;

 plane.material.uniforms.uZoom.value = targetZoom;
 });

 renderer.render(scene, camera);
 rafId = requestAnimationFrame(raf);
 }

 rafId = requestAnimationFrame(raf);

 return () => {
 cancelAnimationFrame(rafId);
 if (snapTimeout) clearTimeout(snapTimeout);
 gsap.killTweensOf(snapObj);
 renderer.dispose();
 container.removeChild(renderer.domElement);
 lenis.destroy();
 };
 }, []);

 const scrollHeight = items.length * 100; // 100vh per image for smooth infinite scrolling

 return (
 <div className={`w-full bg-black`} style={{ height: `${scrollHeight}vh` }}>
 <div ref={containerRef} className="sticky top-0 h-screen w-full overflow-hidden">
 <div
 ref={textContainerRef}
 data-active-text={items[0].description}
 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg uppercase tracking-[0.2em] z-20 pointer-events-none mix-blend-difference overflow-hidden h-7.5 w-50"
 >
 <div ref={activeTextRef} className="absolute w-full h-full flex items-center justify-center">
 {items[0].description}
 </div>
 </div>
 <div  ref={circleRef}  className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none z-10"
 style={{ transform:"translate(-50%, -50%) rotate(0deg)" }}
 >
 {items.map((item, i) => {
 const angle = i * (360 / items.length);
 return (
 <div
 key={i}
 className="absolute w-7 h-9 -ml-3.5 -mt-4.5"
 style={{
 transform: `rotate(${angle}deg) translateY(var(--radius, -35vh)) rotate(calc(-${angle}deg - var(--rotation, 0deg)))`
 }}
 >
 <Image  src={item.url}  className="w-full h-full object-cover"  alt={item.description}  fill
 />
 </div>
 );
 })}
 </div>
 </div>
 </div>
 );
}