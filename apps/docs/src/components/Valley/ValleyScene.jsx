"use client";

import { useEffect, useRef } from"react";
import * as THREE from"three";
import { GLTFLoader } from"three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from"three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from"three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from"three/addons/postprocessing/UnrealBloomPass.js";

/* ─── Shaders ─── */

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uCamFar;

attribute float aSpriteScale;
attribute vec2 aColorCoordinate;
attribute float aRandomSeed;
attribute float aGrowNoise;

varying vec2 vColorCoord;
varying float vAlpha;
varying float vSeed;

void main() {
 vec3 pos = position;

 float phase = uTime * 0.5 + aRandomSeed * 6.2831;
 pos.x += sin(phase) * 0.04 * aGrowNoise;
 pos.y += cos(phase * 0.7) * 0.025 * aGrowNoise;
 pos.z += sin(phase * 0.3) * 0.015 * aGrowNoise;

 vec4 mv = modelViewMatrix * vec4(pos, 1.0);
 float d = -mv.z;

 float nearFade = smoothstep(0.2, 3.0, d);
 float farFade = 1.0 - smoothstep(uCamFar * 0.35, uCamFar, d);
 vAlpha = nearFade * farFade;
 if (d < 0.0) vAlpha = 0.0;

 gl_PointSize = clamp(aSpriteScale * 550.0 / max(d, 0.3), 0.5, 220.0);
 gl_Position = projectionMatrix * mv;

 vColorCoord = aColorCoordinate;
 vSeed = aRandomSeed;
}
`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uSpriteSheet;
uniform float uBrightness;
uniform float uTime;

varying vec2 vColorCoord;
varying float vAlpha;
varying float vSeed;

void main() {
 if (vAlpha < 0.01) discard;

 vec2 c = gl_PointCoord - 0.5;
 float r = length(c);
 if (r > 0.5) discard;

 float soft = smoothstep(0.5, 0.05, r);

 vec4 tex = texture2D(uSpriteSheet, vColorCoord);

 float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
 vec3 color = mix(vec3(lum), tex.rgb, 1.5) * uBrightness;

 color *= 0.9 + 0.1 * sin(uTime * 1.5 + vSeed * 40.0);

 float a = tex.a * soft * vAlpha;
 if (a < 0.01) discard;

 gl_FragColor = vec4(color, a);
}
`;

/* ─── Utilities ─── */

function clampVal(v, lo, hi) {
 return Math.max(lo, Math.min(hi, v));
}

function mapRange(v, inMin, inMax, outMin, outMax) {
 return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/* ─── Camera-path extraction from GLB ─── */

function extractCameraPath(gltf) {
 if (gltf.animations?.length > 0) {
 const clip = gltf.animations[0];
 const posTrack = clip.tracks.find((t) => t.name.includes("position"));

 if (posTrack && posTrack.values.length >= 6) {
 const pts = [];
 for (let i = 0; i < posTrack.values.length; i += 3) {
 pts.push(
 new THREE.Vector3(
 posTrack.values[i],
 posTrack.values[i + 1],
 posTrack.values[i + 2]
 )
 );
 }
 const filtered = [pts[0]];
 for (let i = 1; i < pts.length; i++) {
 if (pts[i].distanceTo(filtered[filtered.length - 1]) > 0.01) {
 filtered.push(pts[i]);
 }
 }
 if (filtered.length >= 2) return new THREE.CatmullRomCurve3(filtered);
 }
 }

 gltf.scene.updateWorldMatrix(true, true);
 const verts = [];
 gltf.scene.traverse((child) => {
 if (child.geometry?.attributes?.position) {
 const pos = child.geometry.attributes.position;
 for (let i = 0; i < pos.count; i++) {
 const v = new THREE.Vector3(
 pos.getX(i),
 pos.getY(i),
 pos.getZ(i)
 );
 v.applyMatrix4(child.matrixWorld);
 verts.push(v);
 }
 }
 });
 if (verts.length >= 2) return new THREE.CatmullRomCurve3(verts);

 return new THREE.CatmullRomCurve3(
 Array.from({ length: 80 }, (_, i) => {
 const t = i / 79;
 return new THREE.Vector3(
 Math.sin(t * Math.PI * 2) * 4,
 Math.sin(t * Math.PI) * 1.5,
 -i * 3
 );
 })
 );
}

/* ─── Flower-particle generation ─── */

const SPRITE_GRID = 8;

function pickSpriteUV() {
 const r = Math.random();
 let row;
 if (r < 0.55) row = Math.floor(Math.random() * 4);
 else if (r < 0.85) row = 4 + Math.floor(Math.random() * 2);
 else row = Math.floor(Math.random() * 6);

 const col = Math.floor(Math.random() * SPRITE_GRID);
 const u = (col + 0.2 + Math.random() * 0.6) / SPRITE_GRID;
 const v = (row + 0.2 + Math.random() * 0.6) / SPRITE_GRID;
 return [u, v];
}

function generateValleyFlowers(curve, terrainData, tw, th) {
 const ROWS = 300;
 const PER_ROW = 360;
 const TOTAL = ROWS * PER_ROW;

 const positions = new Float32Array(TOTAL * 3);
 const colorCoords = new Float32Array(TOTAL * 2);
 const scales = new Float32Array(TOTAL);
 const seeds = new Float32Array(TOTAL);
 const growNoise = new Float32Array(TOTAL);

 const worldUp = new THREE.Vector3(0, 1, 0);
 const right = new THREE.Vector3();
 const localUp = new THREE.Vector3();

 const WIDTH = 7;
 const MIN_LAT = 0.3;
 const SLOPE = 0.4;

 for (let row = 0; row < ROWS; row++) {
 const t = row / (ROWS - 1);
 const pt = curve.getPointAt(t);
 const tan = curve.getTangentAt(t);

 right.crossVectors(tan, worldUp);
 if (right.lengthSq() < 0.0001) right.set(1, 0, 0);
 right.normalize();
 localUp.crossVectors(right, tan).normalize();

 for (let f = 0; f < PER_ROW; f++) {
 const idx = row * PER_ROW + f;
 const i3 = idx * 3;
 const side = f < PER_ROW / 2 ? -1 : 1;

 const rawLat = Math.pow(Math.random(), 0.6);
 const lat = (MIN_LAT + rawLat * (WIDTH - MIN_LAT)) * side;
 const absLat = Math.abs(lat);
 const slopeH = absLat * SLOPE;

 let tMod = 1;
 if (terrainData) {
 const tx = clampVal(Math.floor(t * (tw - 1)), 0, tw - 1);
 const tv = clampVal(
 Math.floor(((lat + WIDTH) / (2 * WIDTH)) * (th - 1)),
 0,
 th - 1
 );
 tMod = terrainData[(tv * tw + tx) * 4] / 255;
 }

 const yOff = (Math.random() - 0.3) * 1.2 * tMod;
 const zOff = (Math.random() - 0.5) * 2.5;
 const h = slopeH + yOff;

 positions[i3] = pt.x + right.x * lat + localUp.x * h + tan.x * zOff;
 positions[i3 + 1] =
 pt.y + right.y * lat + localUp.y * h + tan.y * zOff;
 positions[i3 + 2] =
 pt.z + right.z * lat + localUp.z * h + tan.z * zOff;

 const [su, sv] = pickSpriteUV();
 colorCoords[idx * 2] = su;
 colorCoords[idx * 2 + 1] = sv;

 const distFactor = clampVal(absLat / 1.5, 0.2, 1);
 scales[idx] = (0.12 + Math.random() * 0.88) * distFactor;
 seeds[idx] = Math.random();
 growNoise[idx] = 0.3 + Math.random() * 0.7;
 }
 }

 return { positions, colorCoords, scales, seeds, growNoise, count: TOTAL };
}

/* ─── Component ─── */

export default function ValleyScene() {
 const containerRef = useRef(null);
 const hasInit = useRef(false);

 useEffect(() => {
 if (hasInit.current) return;
 hasInit.current = true;

 const el = containerRef.current;
 if (!el) return;

 let destroyed = false;
 let frameId = null;
 const disposeFns = [];

 async function init() {
 const renderer = new THREE.WebGLRenderer({
 antialias: false,
 powerPreference:"high-performance",
 });
 renderer.setSize(window.innerWidth, window.innerHeight);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 renderer.outputColorSpace = THREE.SRGBColorSpace;
 el.appendChild(renderer.domElement);
 disposeFns.push(() => {
 renderer.dispose();
 renderer.domElement.remove();
 });

 if (destroyed) return;

 /* Scene & camera hierarchy */
 const scene = new THREE.Scene();
 scene.background = new THREE.Color(0x000000);

 const camera = new THREE.PerspectiveCamera(
 60,
 window.innerWidth / window.innerHeight,
 0.1,
 200
 );
 const cameraContainer = new THREE.Group();
 const breathContainer = new THREE.Group();
 breathContainer.add(camera);
 cameraContainer.add(breathContainer);
 scene.add(cameraContainer);

 /* Post-processing */
 const composer = new EffectComposer(renderer);
 composer.addPass(new RenderPass(scene, camera));

 const bloom = new UnrealBloomPass(
 new THREE.Vector2(window.innerWidth, window.innerHeight),
 1.5,
 0.4,
 0.85
 );
 bloom.threshold = 0.08;
 bloom.strength = 1.4;
 bloom.radius = 0.7;
 composer.addPass(bloom);
 disposeFns.push(() => {
 bloom.dispose();
 composer.dispose();
 });

 /* Asset loading */
 const gltfLoader = new GLTFLoader();
 const texLoader = new THREE.TextureLoader();

 const loadGLB = (src) =>
 new Promise((res, rej) => gltfLoader.load(src, res, undefined, rej));
 const loadTex = (src) =>
 new Promise((res, rej) => texLoader.load(src, res, undefined, rej));
 const loadImg = (src) =>
 new Promise((res, rej) => {
 const img = new Image();
 img.crossOrigin ="anonymous";
 img.onload = () => res(img);
 img.onerror = rej;
 img.src = src;
 });

 let gltf, spriteSheet, vignetteTex, terrainImg;
 try {
 [gltf, spriteSheet, vignetteTex, terrainImg] = await Promise.all([
 loadGLB("/valley/camera-path07.glb"),
 loadTex("/valley/pool_summer.png"),
 loadTex("/valley/vignette.png"),
 loadImg("/valley/terrain.png"),
 ]);
 } catch (err) {
 console.error("Valley: asset load failed", err);
 return;
 }

 if (destroyed) return;

 spriteSheet.colorSpace = THREE.SRGBColorSpace;
 spriteSheet.minFilter = THREE.LinearFilter;
 spriteSheet.magFilter = THREE.LinearFilter;
 vignetteTex.colorSpace = THREE.SRGBColorSpace;
 disposeFns.push(() => {
 spriteSheet.dispose();
 vignetteTex.dispose();
 });

 /* Camera path */
 const curve = extractCameraPath(gltf);
 gltf = null;

 /* Terrain data */
 const tCanvas = document.createElement("canvas");
 tCanvas.width = terrainImg.width;
 tCanvas.height = terrainImg.height;
 const tCtx = tCanvas.getContext("2d");
 tCtx.drawImage(terrainImg, 0, 0);
 const terrainPixels = tCtx.getImageData(
 0,
 0,
 terrainImg.width,
 terrainImg.height
 ).data;

 /* Generate particles */
 const flowers = generateValleyFlowers(
 curve,
 terrainPixels,
 terrainImg.width,
 terrainImg.height
 );

 /* Uniforms */
 const uniforms = {
 uTime: { value: 0 },
 uCamFar: { value: 77 },
 uBrightness: { value: 1.0 },
 uSpriteSheet: { value: spriteSheet },
 };

 /* Points mesh */
 const geo = new THREE.BufferGeometry();
 geo.setAttribute(
"position",
 new THREE.BufferAttribute(flowers.positions, 3)
 );
 geo.setAttribute(
"aColorCoordinate",
 new THREE.BufferAttribute(flowers.colorCoords, 2)
 );
 geo.setAttribute(
"aSpriteScale",
 new THREE.BufferAttribute(flowers.scales, 1)
 );
 geo.setAttribute(
"aRandomSeed",
 new THREE.BufferAttribute(flowers.seeds, 1)
 );
 geo.setAttribute(
"aGrowNoise",
 new THREE.BufferAttribute(flowers.growNoise, 1)
 );

 const mat = new THREE.ShaderMaterial({
 uniforms,
 vertexShader: VERTEX,
 fragmentShader: FRAGMENT,
 transparent: true,
 depthTest: false,
 });

 const points = new THREE.Points(geo, mat);
 scene.add(points);
 disposeFns.push(() => {
 geo.dispose();
 mat.dispose();
 });

 /* Vignette overlay (child of camera so it always faces screen) */
 const vigFovRad = THREE.MathUtils.degToRad(camera.fov);
 const vigH = 2 * Math.tan(vigFovRad / 2) * 1.02;
 const vigW = vigH * camera.aspect;
 const vigGeo = new THREE.PlaneGeometry(vigW * 1.3, vigH * 1.3);
 const vigMat = new THREE.MeshBasicMaterial({
 map: vignetteTex,
 transparent: true,
 depthTest: false,
 depthWrite: false,
 opacity: 0.85,
 });
 const vigMesh = new THREE.Mesh(vigGeo, vigMat);
 vigMesh.renderOrder = 999;
 vigMesh.frustumCulled = false;
 camera.add(vigMesh);
 vigMesh.position.z = -1;
 disposeFns.push(() => {
 vigGeo.dispose();
 vigMat.dispose();
 });

 /* State */
 let prevTime = performance.now();
 let elapsedTime = 0;
 const mouse = { x: 0, y: 0 };
 const animMouse = { x: 0, y: 0 };
 let scrollProgress = 0;
 let scrollVelocity = 0;
 let introCameraAngle = Math.PI / 2;
 let isAnimatedIn = false;
 let started = false;

 /* Events */
 const onWheel = (e) => {
 e.preventDefault();
 scrollVelocity += e.deltaY * 0.00028;
 };

 let lastTouchY = 0;
 const onTouchStart = (e) => {
 lastTouchY = e.touches[0].clientY;
 };
 const onTouchMove = (e) => {
 const dy = e.touches[0].clientY - lastTouchY;
 lastTouchY = e.touches[0].clientY;
 scrollVelocity -= dy * 0.0005;
 };

 const onMouseMove = (e) => {
 mouse.x = mapRange(e.clientX / window.innerWidth, 0, 1, -1, 1);
 mouse.y = mapRange(e.clientY / window.innerHeight, 0, 1, -1, 1);
 };

 const onResize = () => {
 const w = window.innerWidth;
 const h = window.innerHeight;
 camera.aspect = w / h;
 camera.updateProjectionMatrix();
 renderer.setSize(w, h);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 composer.setSize(w, h);
 composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 };

 el.addEventListener("wheel", onWheel, { passive: false });
 el.addEventListener("touchstart", onTouchStart, { passive: true });
 el.addEventListener("touchmove", onTouchMove, { passive: true });
 window.addEventListener("mousemove", onMouseMove);
 window.addEventListener("resize", onResize);
 disposeFns.push(() => {
 el.removeEventListener("wheel", onWheel);
 el.removeEventListener("touchstart", onTouchStart);
 el.removeEventListener("touchmove", onTouchMove);
 window.removeEventListener("mousemove", onMouseMove);
 window.removeEventListener("resize", onResize);
 });

 /* ─── Render loop ─── */
 function animate() {
 if (destroyed) return;
 frameId = requestAnimationFrame(animate);

 const now = performance.now();
 const delta = Math.min((now - prevTime) / 1000, 0.05);
 prevTime = now;
 elapsedTime += delta;
 const elapsed = elapsedTime;

 /* Scroll */
 scrollProgress += 0.00015;
 scrollVelocity *= 0.93;
 scrollProgress += scrollVelocity;
 scrollProgress = clampVal(scrollProgress, 0, 0.999);

 /* Camera on path */
 const pathPos = curve.getPointAt(scrollProgress);
 const pathTan = curve.getTangentAt(scrollProgress);
 cameraContainer.position.copy(pathPos);
 const lookTarget = pathPos
 .clone()
 .add(pathTan.clone().multiplyScalar(10));
 cameraContainer.lookAt(lookTarget);

 /* Intro tilt */
 if (!started) {
 breathContainer.rotation.x = introCameraAngle;
 camera.rotation.set(0, 0, 0);
 started = true;
 }
 if (!isAnimatedIn) {
 introCameraAngle +=
 (0 - introCameraAngle) * Math.min(1, 2 * delta);
 breathContainer.rotation.x = introCameraAngle;
 if (Math.abs(introCameraAngle) < 0.003) {
 introCameraAngle = 0;
 isAnimatedIn = true;
 }
 }

 /* Breathing */
 breathContainer.position.y = 0.02 * Math.cos(1.1 * elapsed);
 breathContainer.position.z = 1 + 0.12 * Math.cos(1.1 * elapsed);

 /* Mouse parallax */
 const ml = Math.min(1, 5 * delta);
 animMouse.x += (mouse.x - animMouse.x) * ml;
 animMouse.y += (mouse.y - animMouse.y) * ml;
 const maxRX = 3 * (Math.PI / 180);
 const maxRY = 2 * (Math.PI / 180);
 camera.rotation.y +=
 (-maxRX * animMouse.x - camera.rotation.y) * 0.1;
 camera.rotation.x +=
 (-maxRY * animMouse.y - camera.rotation.x) * 0.1;

 /* Uniforms */
 uniforms.uTime.value = elapsed;

 composer.render();
 }

 animate();
 }

 init();

 return () => {
 destroyed = true;
 hasInit.current = false;
 if (frameId) cancelAnimationFrame(frameId);
 disposeFns.forEach((fn) => fn());
 };
 }, []);

 return (
 <div
 ref={containerRef}
 style={{
 width:"100vw",
 height:"100vh",
 overflow:"hidden",
 background:"#000",
 }}
 />
 );
}
