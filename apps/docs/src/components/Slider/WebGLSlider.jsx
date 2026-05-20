"use client";

import { useEffect, useRef } from"react";
import * as THREE from"three";
import { useLenis } from"lenis/react";
import gsap from"gsap";

// ─── vertex shader ───
const vertexShader = /* glsl */ `
 uniform float uFold;
 uniform float uHover;
 uniform vec2 uHoverPos;
 varying vec2 vUv;
 varying float vShade;

 void main() {
 vUv = uv;
 vec3 pos = position;

 float strength = abs(uFold);
 float dir = sign(uFold);

 float edgeUV = dir < 0.0 ? uv.y : (1.0 - uv.y);

 float foldLength = 1.8;
 float distFromEdge = (1.0 - edgeUV) * 3.0;  float localUV = clamp((foldLength - distFromEdge) / foldLength, 0.0, 1.0);

 float edgeCurve = localUV * localUV;

 float A = max(strength * 3.14159, 0.001);
 float t = localUV * foldLength;
  float L_bend = 2.0;
 float R = L_bend / A;
  float t_bend = min(t, L_bend);
 float theta = (t_bend / L_bend) * A;
 float t_straight = max(t - L_bend, 0.0);

 float foldZ = R * (1.0 - cos(theta)) + t_straight * sin(A);
 pos.z += foldZ;

 float foldPull = (t_bend - R * sin(theta)) + t_straight * (1.0 - cos(A));
 pos.y += foldPull * dir;

 pos.x += edgeCurve * strength * 0.1 * dir;

 float dist = length(uv - uHoverPos);
 float hoverBend = smoothstep(0.7, 0.0, dist) * 0.9 * uHover;
 pos.z += hoverBend;

 vShade = 1.0 - edgeCurve * strength * 0.4;

 gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
 }
`;

const fragmentShader = /* glsl */ `
 uniform sampler2D uTexture;
 uniform vec2 uPlaneSize;
 uniform vec2 uImageSize;
 varying vec2 vUv;
 varying float vShade;

 void main() {
 vec2 planeAspect = vec2(uPlaneSize.x / uPlaneSize.y, uPlaneSize.y / uPlaneSize.x);
 vec2 imageAspect = vec2(uImageSize.x / uImageSize.y, uImageSize.y / uImageSize.x);
  vec2 ratio = min(planeAspect / imageAspect, 1.0);
 vec2 uv = vUv * ratio + (1.0 - ratio) * 0.5;

 vec4 color = texture2D(uTexture, uv);
 color.rgb *= vShade; // Apply shading for 3D depth perception
 gl_FragColor = color;
 }
`;

// ─── helpers ───
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const mod = (n, m) => ((n % m) + m) % m;

export default function WebGLSlider({ images = [] }) {
 const containerRef = useRef(null);
 const scrollRef = useRef(0);
 const lastScroll = useRef(0);
 const scrollTimeout = useRef(null);
 const isSnapping = useRef(false);

 useLenis((lenis) => {
 if (isSnapping.current) return;
 scrollRef.current = lenis.scroll;

 if (Math.abs(lenis.scroll - lastScroll.current) > 0.1) {
 lastScroll.current = lenis.scroll;
 if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

 scrollTimeout.current = setTimeout(() => {
 if (!isSnapping.current) {
 const currentScroll = lenis.scroll;
 const vh = window.innerHeight;
 const targetScroll = Math.round(currentScroll / vh) * vh;

 if (Math.abs(currentScroll - targetScroll) > 2) {
 isSnapping.current = true;
 lenis.stop();

 const obj = { y: currentScroll };
 gsap.to(obj, {
 y: targetScroll,
 duration: 0.6,
 ease:"power2.inOut",
 onUpdate: () => {
 window.scrollTo(0, obj.y);
 scrollRef.current = obj.y;
 },
 onComplete: () => {
 isSnapping.current = false;
 lastScroll.current = targetScroll;
 lenis.start();
 },
 });
 }
 }
 }, 30);
 }
 });

 useEffect(() => {
 const container = containerRef.current;
 if (!container) return;

 // ─── renderer ───
 const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 renderer.setSize(window.innerWidth, window.innerHeight);
 container.appendChild(renderer.domElement);

 // ─── mouse ───
 const mouse = new THREE.Vector2(-100, -100);

 const onMouseMove = (event) => {
 mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
 mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
 };
 window.addEventListener("mousemove", onMouseMove);

 // ─── scene & camera ───
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(
 45,
 window.innerWidth / window.innerHeight,
 0.1,
 100
 );
 camera.position.z = 7;

 // ─── layout settings ───
 const isMobile = window.innerWidth < 768;
 const CARD_W = isMobile ? 2.0 : 3.2;
 const CARD_H = isMobile ? 1.8 : 3.0;
 const GAP = isMobile ? 4.0 : 4.5;
 const total = images.length;

 const vFov = (camera.fov * Math.PI) / 180;
 const viewH = 2 * Math.tan(vFov / 2) * camera.position.z;

 const loopLength = total * GAP;
 const pxPerWorldUnit = window.innerHeight / GAP;

 // ─── cache DOM refs once ───
 const textEls = images.map((_, i) => {
 const el = document.getElementById(`slider-text-${i}`);
 if (el && el.classList.contains("hidden")) {
 el.classList.remove("hidden");
 el.style.display ="none";
 }
 return el;
 });

 // ─── textures & meshes ───
 const loader = new THREE.TextureLoader();
 const meshes = [];

 const geo = new THREE.PlaneGeometry(CARD_W, CARD_H, 64, 64);

 images.forEach((img, i) => {
 const mat = new THREE.ShaderMaterial({
 uniforms: {
 uTexture: { value: null },
 uFold: { value: 0.0 },
 uHover: { value: 0.0 },
 uHoverPos: { value: new THREE.Vector2(0.5, 0.5) },
 uPlaneSize: { value: new THREE.Vector2(CARD_W, CARD_H) },
 uImageSize: { value: new THREE.Vector2(1, 1) },
 },
 vertexShader,
 fragmentShader,
 transparent: true,
 side: THREE.DoubleSide,
 depthWrite: true,
 });

 const tex = loader.load(img.src, (texture) => {
 if (texture && texture.image) {
 mat.uniforms.uImageSize.value.set(
 texture.image.width || texture.image.videoWidth || 1,
 texture.image.height || texture.image.videoHeight || 1
 );
 }
 });
 tex.colorSpace = THREE.SRGBColorSpace;
 mat.uniforms.uTexture.value = tex;

 const mesh = new THREE.Mesh(geo, mat);
 mesh.userData.index = i;
 scene.add(mesh);
 meshes.push(mesh);
 });

 document.body.style.height = `${total * 100 + 100}vh`;

 // ─── reusable per-frame state to avoid allocations ───
 let rafId;
 const targetUv = new THREE.Vector2();
 const mouseWorldDir = new THREE.Vector3();
 const halfViewConst = viewH / 2;
 const foldRangeConst = halfViewConst + CARD_H;
 const loopHalf = loopLength / 2;
 // pre-compute reciprocals
 const invFoldRange = 1 / foldRangeConst;
 const CARD_W_OFFSET = isMobile ? CARD_W * 0.40 : CARD_W * 0.70;
 const CARD_H_75 = CARD_H * 0.75;
 const HALF_PI = Math.PI * 0.5;

 // ─── animation loop ───
 const tick = () => {
 rafId = requestAnimationFrame(tick);

 // Calculate mouse world position at Z=0
 mouseWorldDir.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();
 const mouseDist = -camera.position.z / mouseWorldDir.z;
 const mouseWorldPos = camera.position.clone().add(mouseWorldDir.multiplyScalar(mouseDist));

 const viewW = viewH * camera.aspect;
 const arcRadiusX = isMobile ? viewW * 1.7 : viewW * 1.2;
 const arcRadiusY = isMobile ? viewH * 1.0 : viewW * 1.2;
 const invArcRadius = 1 / (isMobile ? arcRadiusY : (viewW * 1.2));

 const worldOffset = scrollRef.current / pxPerWorldUnit;
 const wrappedOffset = mod(worldOffset, loopLength);

 const halfScreenW = window.innerWidth / 2;
 const halfScreenH = window.innerHeight / 2;
 const invHalfViewW = 1 / (viewW / 2);
 const invHalfViewH = 1 / (viewH / 2);

 for (let idx = 0; idx < meshes.length; idx++) {
 const mesh = meshes[idx];
 const i = mesh.userData.index;
 const baseY = -i * GAP;

 let y = mod(baseY + wrappedOffset + loopHalf, loopLength) - loopHalf;

 const theta = y * invArcRadius;
 const cosTheta = Math.cos(theta);
 const sinTheta = Math.sin(theta);

 mesh.position.x = -arcRadiusX + arcRadiusX * cosTheta;
 mesh.position.y = arcRadiusY * sinTheta;
 mesh.rotation.z = theta;

 // Force outer folding planes to draw over center planes
 mesh.renderOrder = Math.floor(Math.abs(y) * 100);

 const isVisible = Math.abs(y) < foldRangeConst + CARD_H;
 if (mesh.visible !== isVisible) mesh.visible = isVisible;

 const textEl = textEls[i];

 // --- Calculate local UV based on world distance ---
 const planeX = mesh.position.x;
 const planeY = mesh.position.y;
 const angle = mesh.rotation.z;

 const dx = mouseWorldPos.x - planeX;
 const dy = mouseWorldPos.y - planeY;

 const cosA = Math.cos(-angle);
 const sinA = Math.sin(-angle);
 const localX = dx * cosA - dy * sinA;
 const localY = dx * sinA + dy * cosA;

 targetUv.set((localX / CARD_W) + 0.5, (localY / CARD_H) + 0.5);
 mesh.material.uniforms.uHoverPos.value.lerp(targetUv, 0.15);

 const isMouseOffscreen = mouse.x < -10 || mouse.y < -10;
 const hoverTarget = isMouseOffscreen ? 0.0 : 1.0;
 mesh.material.uniforms.uHover.value += (hoverTarget - mesh.material.uniforms.uHover.value) * 0.1;

 if (!isVisible) {
 if (textEl && textEl.style.display !=="none") {
 textEl.style.display ="none";
 }
 // skip fold uniform update for invisible meshes
 continue;
 }

 const fold = isMobile ? 0.0 : clamp(y * invFoldRange, -1, 1);
 mesh.material.uniforms.uFold.value = fold;

 if (textEl) {
 if (textEl.style.display ==="none") textEl.style.display ="block";

 const progressToCenter = Math.cos(fold * HALF_PI);
 const localOffsetX = progressToCenter * CARD_W_OFFSET;
 const localOffsetY = fold * CARD_H_75;

 const textWorldX = mesh.position.x + localOffsetX * cosTheta - localOffsetY * sinTheta;
 const textWorldY = mesh.position.y + localOffsetX * sinTheta + localOffsetY * cosTheta;

 const screenX = halfScreenW + textWorldX * invHalfViewW * halfScreenW;
 const screenY = halfScreenH - textWorldY * invHalfViewH * halfScreenH;

 textEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) rotate(${-theta}rad)`;
 }
 }

 renderer.render(scene, camera);
 };

 tick();

 // ─── resize handler ───
 const onResize = () => {
 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize(window.innerWidth, window.innerHeight);
 };
 window.addEventListener("resize", onResize);

 // ─── cleanup ───
 return () => {
 if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
 cancelAnimationFrame(rafId);
 window.removeEventListener("mousemove", onMouseMove);
 window.removeEventListener("resize", onResize);
 if (container.contains(renderer.domElement)) {
 container.removeChild(renderer.domElement);
 }
 renderer.dispose();
 geo.dispose();
 meshes.forEach((m) => {
 m.material.dispose();
 });
 document.body.style.height ="";
 };
 }, []);

 return (
 <div className="relative w-full">
 <div
 ref={containerRef}
 className="fixed inset-0 w-full h-screen pointer-events-none z-10"
 />
 <div className="fixed inset-0 w-full h-screen pointer-events-none z-20 overflow-hidden">
 {images.map((img, i) => (
 <div
 key={i}
 id={`slider-text-${i}`}
 className="absolute top-0 left-0 hidden will-change-transform"
 >
 <div className="flex flex-col -translate-x-1/2 -translate-y-1/2 origin-center">
 <h1 className="text-[7vw] max-sm:text-[12vw] font-bold leading-[0.85] tracking-tighter whitespace-pre-wrap">
 {img.text}
 </h1>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}