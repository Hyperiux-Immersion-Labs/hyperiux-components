'use client'

import { useEffect, useRef, useState } from"react";
import * as THREE from"three";

export default function SpiderParticles({
 particleCount = 180,
 gridGap = 0,
 particleSize = 20.0,
 mouseConnectDist = 160,
 spotlightRadius = 300,
 particlesGlow = false,
 glowColor = 0xffffff,
 particleColor = 0xffffff,
 webColor = 0xffffff,
 centerColor = 0xffffff,
}) {
 const mountRef = useRef(null);
 const [active, setActive] = useState(false);
 const [pos, setPos] = useState({ x: 0, y: 0 });

 useEffect(() => {
 const mount = mountRef.current;
 if (!mount) return;

 let width = mount.clientWidth || window.innerWidth;
 let height = mount.clientHeight || window.innerHeight;
 let animId;

 const _glowColor = new THREE.Color(glowColor);
 const _particleColor = new THREE.Color(particleColor);
 const _webColor = new THREE.Color(webColor);
 const _centerColor = new THREE.Color(centerColor);

 const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
 renderer.setPixelRatio(window.devicePixelRatio);
 renderer.setSize(width, height);
 renderer.setClearColor(0x000000, 1);
 mount.appendChild(renderer.domElement);

 const scene = new THREE.Scene();
 const camera = new THREE.OrthographicCamera(
 -width / 2, width / 2,
 height / 2, -height / 2,
 -500, 500
 );
 camera.position.z = 1;

 const mouse = new THREE.Vector2(-9999, -9999);
 const smoothMouse = new THREE.Vector2(-9999, -9999);
 let mouseEntryAlpha = 0;
 let mousePresent = false;
 let mouseJustEntered = false; // <-- NEW: snap flag

 const onMove = (e) => {
 const rect = mount.getBoundingClientRect();
 mouse.set(
 e.clientX - rect.left - width / 2,
 -(e.clientY - rect.top - height / 2)
 );
 setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
 };

 const onEnter = (e) => {
 // Capture exact entry position immediately so smoothMouse can snap
 const rect = mount.getBoundingClientRect();
 mouse.set(
 e.clientX - rect.left - width / 2,
 -(e.clientY - rect.top - height / 2)
 );
 mouseJustEntered = true; // signal animate() to snap on next frame
 mousePresent = true;
 setActive(true);
 };

 const onLeave = () => {
 mousePresent = false;
 mouseJustEntered = false;
 setActive(false);
 };

 mount.addEventListener("mousemove", onMove);
 mount.addEventListener("mouseenter", onEnter);
 mount.addEventListener("mouseleave", onLeave);

 const onTouch = (e) => {
 const t = e.touches[0];
 const rect = mount.getBoundingClientRect();
 mouse.set(
 t.clientX - rect.left - width / 2,
 -(t.clientY - rect.top - height / 2)
 );
 if (!mousePresent) mouseJustEntered = true;
 mousePresent = true;
 setActive(true);
 };
 mount.addEventListener("touchmove", onTouch, { passive: true });
 mount.addEventListener("touchend", () => {
 mousePresent = false;
 mouseJustEntered = false;
 setActive(false);
 });

 let cols, rows, actualCount, spacingX, spacingY;

 if (gridGap > 0) {
 cols = Math.max(1, Math.floor(width / gridGap));
 rows = Math.max(1, Math.floor(height / gridGap));
 actualCount = cols * rows;
 spacingX = gridGap;
 spacingY = gridGap;
 } else {
 actualCount = particleCount;
 const aspect = width / height;
 rows = Math.max(1, Math.round(Math.sqrt(actualCount / aspect)));
 cols = Math.ceil(actualCount / rows);
 spacingX = width / cols;
 spacingY = height / rows;
 }

 const positions = new Float32Array(actualCount * 3);
 const phases = new Float32Array(actualCount);

 for (let i = 0; i < actualCount; i++) {
 const c = i % cols;
 const r = Math.floor(i / cols);
 const x = (c + 0.5) * spacingX - width / 2;
 const y = (r + 0.5) * spacingY - height / 2;
 positions[i * 3] = x;
 positions[i * 3 + 1] = y;
 positions[i * 3 + 2] = 0;
 phases[i] = Math.random() * Math.PI * 2;
 }

 const particleGeo = new THREE.BufferGeometry();
 particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

 const particleMat = new THREE.ShaderMaterial({
 uniforms: {
 uColor: { value: _particleColor },
 uGlow: { value: _glowColor },
 uSize: { value: particleSize * window.devicePixelRatio },
 uMouse: { value: new THREE.Vector2(-9999, -9999) },
 uSpotlightRadius: { value: spotlightRadius },
 uGlowEnabled: { value: particlesGlow },
 uAlpha: { value: 0.0 },
 },
 vertexShader: `
 uniform float uSize;
 uniform vec2 uMouse;
 uniform float uSpotlightRadius;
 void main() {
 vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
 float dist = distance(position.xy, uMouse);
 float scale = 0.0;
 if (dist < uSpotlightRadius) {
 scale = 1.0 - (dist / uSpotlightRadius);
 }
 gl_PointSize = uSize * scale;
 gl_Position = projectionMatrix * mvPos;
 }
 `,
 fragmentShader: `
 uniform vec3 uColor;
 uniform vec3 uGlow;
 uniform bool uGlowEnabled;
 uniform float uAlpha;
 void main() {
 vec2 uv = gl_PointCoord - 0.5;
 float d = length(uv);
 if (d > 0.5) discard;
 if (uGlowEnabled) {
 float core = smoothstep(0.5, 0.0, d);
 float glow = smoothstep(0.5, 0.1, d) * 0.6;
 vec3 col = mix(uGlow, uColor, core);
 float alpha = (core + glow) * uAlpha;
 gl_FragColor = vec4(col, alpha);
 } else {
 float alpha = smoothstep(0.5, 0.45, d) * uAlpha;
 gl_FragColor = vec4(uColor, alpha);
 }
 }
 `,
 transparent: true,
 depthWrite: false,
 blending: THREE.AdditiveBlending,
 });

 particleGeo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
 const particles = new THREE.Points(particleGeo, particleMat);
 scene.add(particles);

 const cursorGeo = new THREE.BufferGeometry();
 cursorGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
 const cursorMat = new THREE.ShaderMaterial({
 uniforms: {
 uColor: { value: _centerColor },
 uGlow: { value: _glowColor },
 uSize: { value: particleSize * window.devicePixelRatio },
 uGlowEnabled: { value: particlesGlow },
 uAlpha: { value: 0.0 },
 },
 vertexShader: `
 uniform float uSize;
 void main() {
 vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
 gl_PointSize = uSize;
 gl_Position = projectionMatrix * mvPos;
 }
 `,
 fragmentShader: `
 uniform vec3 uColor;
 uniform vec3 uGlow;
 uniform bool uGlowEnabled;
 uniform float uAlpha;
 void main() {
 vec2 uv = gl_PointCoord - 0.5;
 float d = length(uv);
 if (d > 0.5) discard;
 if (uGlowEnabled) {
 float core = smoothstep(0.5, 0.0, d);
 float glow = smoothstep(0.5, 0.1, d) * 0.6;
 vec3 col = mix(uGlow, uColor, core);
 float alpha = (core + glow) * uAlpha;
 gl_FragColor = vec4(col, alpha);
 } else {
 float alpha = smoothstep(0.5, 0.45, d) * uAlpha;
 gl_FragColor = vec4(uColor, alpha);
 }
 }
 `,
 transparent: true,
 depthWrite: false,
 blending: THREE.AdditiveBlending,
 });
 const cursorPoint = new THREE.Points(cursorGeo, cursorMat);
 scene.add(cursorPoint);

 const mouseLinePositions = new Float32Array(actualCount * 6);
 const mouseLineColors = new Float32Array(actualCount * 6);
 const mouseLineGeo = new THREE.BufferGeometry();
 mouseLineGeo.setAttribute("position", new THREE.BufferAttribute(mouseLinePositions, 3));
 mouseLineGeo.setAttribute("color", new THREE.BufferAttribute(mouseLineColors, 3));
 const mouseLineMat = new THREE.LineBasicMaterial({
 vertexColors: true,
 transparent: true,
 opacity: 1,
 blending: THREE.AdditiveBlending,
 depthWrite: false,
 });
 const mouseLines = new THREE.LineSegments(mouseLineGeo, mouseLineMat);
 scene.add(mouseLines);

 const onResize = () => {
 width = mount.clientWidth;
 height = mount.clientHeight;
 renderer.setSize(width, height);
 camera.left = -width / 2;
 camera.right = width / 2;
 camera.top = height / 2;
 camera.bottom = -height / 2;
 camera.updateProjectionMatrix();
 };
 window.addEventListener("resize", onResize);

 const LERP_SPEED = 0.1;
 const FADE_SPEED = 0.04;

 const animate = () => {
 animId = requestAnimationFrame(animate);

 // Fade alpha in/out
 if (mousePresent) {
 mouseEntryAlpha = Math.min(1, mouseEntryAlpha + FADE_SPEED);
 } else {
 mouseEntryAlpha = Math.max(0, mouseEntryAlpha - FADE_SPEED);
 }

 // Snap smoothMouse to exact entry position on first frame, lerp after
 if (mousePresent && mouse.x > -9000) {
 if (mouseJustEntered) {
 smoothMouse.copy(mouse); // instant snap to entry point — no lerp drift
 mouseJustEntered = false;
 } else {
 smoothMouse.x += (mouse.x - smoothMouse.x) * LERP_SPEED;
 smoothMouse.y += (mouse.y - smoothMouse.y) * LERP_SPEED;
 }
 } else if (!mousePresent && mouseEntryAlpha <= 0) {
 smoothMouse.set(-9999, -9999);
 }

 particleMat.uniforms.uMouse.value.copy(smoothMouse);
 particleMat.uniforms.uAlpha.value = mouseEntryAlpha;
 cursorMat.uniforms.uAlpha.value = mouseEntryAlpha;

 if (smoothMouse.x > -9000) {
 cursorPoint.position.set(smoothMouse.x, smoothMouse.y, 0);
 cursorPoint.visible = true;
 } else {
 cursorPoint.visible = false;
 }

 let mIdx = 0;
 if (smoothMouse.x > -9000 && mouseEntryAlpha > 0) {
 for (let i = 0; i < actualCount; i++) {
 const px = positions[i * 3], py = positions[i * 3 + 1];
 const dx = px - smoothMouse.x, dy = py - smoothMouse.y;
 const d = Math.sqrt(dx * dx + dy * dy);
 if (d < mouseConnectDist) {
 const alpha = (1 - d / mouseConnectDist) * 0.85 * mouseEntryAlpha;
 const si = mIdx * 6;
 mouseLinePositions[si] = smoothMouse.x; mouseLinePositions[si + 1] = smoothMouse.y; mouseLinePositions[si + 2] = 0;
 mouseLinePositions[si + 3] = px; mouseLinePositions[si + 4] = py; mouseLinePositions[si + 5] = 0;
 mouseLineColors[si] = _webColor.r;
 mouseLineColors[si + 1] = _webColor.g;
 mouseLineColors[si + 2] = _webColor.b;
 mouseLineColors[si + 3] = _webColor.r * alpha;
 mouseLineColors[si + 4] = _webColor.g * alpha;
 mouseLineColors[si + 5] = _webColor.b * alpha;
 mIdx++;
 }
 }
 }

 mouseLineGeo.setDrawRange(0, mIdx * 2);
 mouseLineGeo.attributes.position.needsUpdate = true;
 mouseLineGeo.attributes.color.needsUpdate = true;

 renderer.render(scene, camera);
 };

 animate();

 return () => {
 cancelAnimationFrame(animId);
 window.removeEventListener("resize", onResize);
 if (mount) {
 mount.removeEventListener("mousemove", onMove);
 mount.removeEventListener("mouseenter", onEnter);
 mount.removeEventListener("mouseleave", onLeave);
 mount.removeEventListener("touchmove", onTouch);
 if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
 }
 renderer.dispose();
 particleGeo.dispose();
 particleMat.dispose();
 cursorGeo.dispose();
 cursorMat.dispose();
 mouseLineGeo.dispose();
 mouseLineMat.dispose();
 };
 }, [particleCount, gridGap, particleSize, mouseConnectDist, spotlightRadius, particlesGlow, glowColor, particleColor, webColor, centerColor]);

 const stats = [
 { label:"Particles", value: particleCount },
 { label:"Radius", value: spotlightRadius },
 { label:"Reach", value: mouseConnectDist },
 ];

 return (
 <div
 ref={mountRef}
 className="relative w-full h-screen bg-black cursor-none overflow-hidden"
 >
 <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-10">

 {/* Top row */}
 <div className="flex items-start justify-between">
 <div>
 <div className="flex items-center gap-2 mb-1.5">
 <span
 className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
 active ?"bg-emerald-400 shadow-[0_0_8px_#34d399]" :"bg-white/20"
 }`}
 />
 <span
 className={`text-[11px] tracking-widest uppercase transition-colors duration-500 ${
 active ?"text-white/50" :"text-white/20"
 }`}
 >
 {active ?"Tracking" :"Idle"}
 </span>
 </div>
 <h1 className="text-4xl font-light text-white/90 tracking-tight leading-none">
 Spider Web
 </h1>
 <p className="mt-1.5 text-[13px] text-white/30 tracking-wide">
 Interactive particle field
 </p>
 </div>

 <div className="flex gap-6">
 {stats.map(({ label, value }) => (
 <div key={label} className="text-right">
 <div className="text-[11px] uppercase tracking-widest text-white/25 mb-0.5">
 {label}
 </div>
 <div className="text-lg font-light text-white/60 tabular-nums">
 {value}
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Bottom row */}
 <div className="flex items-end justify-between">
 <div className={`transition-opacity duration-700 ${active ?"opacity-0" :"opacity-40"}`}>
 <p className="text-[12px] text-white/60 tracking-widest uppercase">
 Move your cursor to explore
 </p>
 <div className="mt-1.5 w-8 h-px bg-white/20" />
 </div>

 <div className={`text-right transition-opacity duration-500 ${active ?"opacity-100" :"opacity-0"}`}>
 <div className="text-[11px] uppercase tracking-widest text-white/25 mb-1">
 Position
 </div>
 <div className="font-mono text-[13px] text-white/50 tracking-wider">
 {Math.round(pos.x)}&nbsp;·&nbsp;{Math.round(pos.y)}
 </div>
 </div>
 </div>

 </div>
 </div>
 );
}