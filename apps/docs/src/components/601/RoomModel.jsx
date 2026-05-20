'use client'

import React, { useRef, useEffect, useCallback } from"react";
import {
 useGLTF,
 useTexture,
 MeshReflectorMaterial,
 useVideoTexture,
 shaderMaterial
} from"@react-three/drei";
import { useThree, useFrame, extend } from"@react-three/fiber";
import * as THREE from"three";
import gsap from"gsap";


// =========================
// 🎬 PREMIUM TV SHADER
// =========================
const TVTransitionMaterial = shaderMaterial(
 {
 uTexA: null,
 uTexB: null,
 uProgress: 0,
 uOffset: new THREE.Vector2(),
 uTime: 0,
 uResolution: new THREE.Vector2(1, 1),
 },

 // vertex
 `
 varying vec2 vUv;
 void main() {
 vUv = uv;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
 `,

 // fragment
 `
 uniform sampler2D uTexA;
 uniform sampler2D uTexB;
 uniform float uProgress;
 uniform float uTime;
 uniform vec2 uOffset;
 varying vec2 vUv;

 // Function to quantize uv for pixelation
 vec2 pixelate(vec2 uv, float pixelSize) {
 return floor(uv / pixelSize) * pixelSize + pixelSize * 0.5;
 }

 void main() {
 vec2 uv = vUv;
 float p = clamp(uProgress, 0.0, 1.0);

 // ⚡️ Subtle Parallax
 uv += uOffset * 0.05;

 // --- Pixelation transition ---
 // Progressively increase pixel size from 0 (sharp) to 0.07 (chunky) on texA as p goes 0→1
 // And from 0.07→0 (sharp) on texB
 float maxPixelSize = 0.2;
 float pixelSizeA = maxPixelSize * p;
 float pixelSizeB = maxPixelSize * (1.0 - p);

 // Optionally add smoothstep for smoother appearance near edges
 pixelSizeA = mix(0.0, maxPixelSize, smoothstep(0.0, 1.0, p));
 pixelSizeB = mix(maxPixelSize, 0.0, smoothstep(0.0, 1.0, p));

 // Clean zoom effect (for subtle motion, optional)
 vec2 uvA = (uv - 0.5) * (1.0 + p * 0.05) + 0.5;
 vec2 uvB = (uv - 0.5) * (1.05 - p * 0.05) + 0.5;

 // Apply pixelation
 uvA = pixelate(uvA, max(pixelSizeA, 0.0001));
 uvB = pixelate(uvB, max(pixelSizeB, 0.0001));

 vec4 texA = texture2D(uTexA, uvA);
 vec4 texB = texture2D(uTexB, uvB);

 // Use p as the crossfade (replace with a different blend if you want softness at the edge)
 float fade = smoothstep(0.0, 1.0, p);

 vec4 col = mix(texA, texB, fade);

 gl_FragColor = col;

 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }
 `
);



extend({ TVTransitionMaterial });


// =========================
// 🎯 MAIN COMPONENT
// =========================
export default function RoomModel({ onClick, isZoomed, videoRef, ...props }) {

 const groupRef = useRef();
 const tvMatRef = useRef();
 const { gl } = useThree();

 const { nodes } = useGLTF("/601/finall.glb");


 // =========================
 // 📺 TEXTURES
 // =========================
 const TVtexture = useTexture("/601/tvtex2.png");
 TVtexture.colorSpace = THREE.SRGBColorSpace;
 TVtexture.flipY = false;

 const videoTexture = useVideoTexture(
"https://media.fiddle.digital/uploads/feature_kaleida_f406072b29.mp4",
 { start: false }
 );
 videoTexture.colorSpace = THREE.SRGBColorSpace;
 videoTexture.flipY = false;


 // =========================
 // 🎬 VIDEO CONTROL
 // =========================
 useEffect(() => {
 if (!videoTexture?.image) return;

 videoRef.current = videoTexture.image;

 if (isZoomed) {
 videoTexture.image.play();
 } else {
 videoTexture.image.pause();
 }

 }, [isZoomed, videoTexture, videoRef]);


 // =========================
 // ⚡ SMOOTH PROGRESS
 // =========================
 const progressRef = useRef({ value: 0 });
 const animate = useRef();

 useEffect(() => {
 animate.current = gsap.quickTo(progressRef.current,"value", {
 duration: 1.5,
 ease:"power4.inOut"
 });
 }, []);

 useEffect(() => {
 animate.current?.(isZoomed ? 1 : 0);
 }, [isZoomed]);


 // =========================
 // 🖱 MOUSE TILT + PARALLAX
 // =========================
 const targetRot = useRef({ x: 0, y: 0 });
 const targetOffset = useRef({ x: 0, y: 0 });
 const offsetRef = useRef({ x: 0, y: 0 });

 // We want to only update rotation/offset from mouse if not zoomed
 const handlePointerMove = useCallback(
 (e) => {
 if (isZoomed) return; // 🛑 Ignore pointer move if zoomed!
 const rect = gl.domElement.getBoundingClientRect();

 const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
 const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

 targetRot.current.x = -y * 0.05;
 targetRot.current.y = x * 0.15;

 targetOffset.current.x = x * 0.04;
 targetOffset.current.y = y * 0.02;
 },
 [gl, isZoomed]
 );

 useEffect(() => {
 gl.domElement.addEventListener("mousemove", handlePointerMove);
 return () => gl.domElement.removeEventListener("mousemove", handlePointerMove);
 }, [handlePointerMove, gl]);

 // Additionally, immediately reset to neutral rotation/offset when zoomed
 useEffect(() => {
 if (isZoomed) {
 // Optionally quickly animate to zero for smoothness
 gsap.to(targetRot.current, {
 x: 0,
 y: 0,
 duration: 0.5,
 overwrite: true,
 ease:"power3.out",
 });
 gsap.to(targetOffset.current, {
 x: 0,
 y: 0,
 duration: 0.5,
 overwrite: true,
 ease:"power3.out",
 });
 }
 }, [isZoomed]);

 // =========================
 // 🎞 FRAME LOOP
 // =========================
 useFrame((_, delta) => {
 // rotation
 if (groupRef.current) {
 groupRef.current.rotation.x += (targetRot.current.x - groupRef.current.rotation.x) * 0.05;
 groupRef.current.rotation.y += (targetRot.current.y - groupRef.current.rotation.y) * 0.05;
 }

 // offset lerp
 offsetRef.current.x += (targetOffset.current.x - offsetRef.current.x) * 0.08;
 offsetRef.current.y += (targetOffset.current.y - offsetRef.current.y) * 0.08;

 // shader update
 if (tvMatRef.current) {
 // Fix: Access uniforms as direct properties on the material instance
 // and use .set() for Vector2 uniforms.
 tvMatRef.current.uOffset.set(offsetRef.current.x, offsetRef.current.y);
 tvMatRef.current.uTime += delta;
 tvMatRef.current.uProgress = progressRef.current.value;
 }
 });


 useEffect(() => {
 if (!videoTexture?.image) return;

 videoRef.current = videoTexture.image;

 // preload
 videoTexture.image.preload ="auto";
 videoTexture.image.load();

 }, [videoTexture]);

 useEffect(() => {
 if (!videoTexture?.image) return;

 if (isZoomed) {
 setTimeout(() => {
 videoTexture.image.play();
 }, 300);
 } else {
 videoTexture.image.pause();
 }
 }, [isZoomed]);



 // =========================
 // 🎨 MATERIALS
 // =========================
 const normalMap = useTexture("/601/normal.webp");
 normalMap.colorSpace = THREE.NoColorSpace;

 const baseMat = {
 color:"#000",
 normalMap,
 normalScale: new THREE.Vector2(0.3, 0.3),
 roughness: 10.,
 side: THREE.DoubleSide
 };


 const roughnessMap = useTexture(
"https://png.pngtree.com/png-clipart/20241204/original/pngtree-textured-background-of-bathroom-floor-tiles-png-image_17548659.png"
 );
 roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
 roughnessMap.repeat.set(4, 4);


 // =========================
 // 🧱 JSX
 // =========================
 return (
 <group ref={groupRef} {...props} dispose={null}>

 <mesh geometry={nodes.room.geometry}>
 <meshStandardMaterial {...baseMat} />
 </mesh>

 <mesh geometry={nodes.Door.geometry}>
 <meshStandardMaterial {...baseMat} />
 </mesh>

 {/* <mesh geometry={nodes.switch.}><meshStandardMaterial {...baseMat} /></mesh> */}

 <mesh  position={[0, 0, 1]}
 geometry={nodes.ladder.geometry}
 >
 <meshStandardMaterial {...baseMat} />
 </mesh>

 <mesh
 geometry={nodes.Body4002.geometry}
 >
 <meshStandardMaterial {...baseMat} />
 </mesh>
 <mesh
 geometry={nodes.Body4002_1.geometry}
 >
 <meshStandardMaterial {...baseMat} />
 </mesh>
 <mesh
 geometry={nodes.Body4002_2.geometry}
 >
 <meshStandardMaterial {...baseMat} />
 </mesh>



 {/* 📺 TV */}
 <group
 onClick={onClick}
 onPointerEnter={() => (document.body.style.cursor ="pointer")}
 onPointerLeave={() => (document.body.style.cursor ="auto")}
 >
 <mesh geometry={nodes.screen.geometry}>
 <meshStandardMaterial {...baseMat} />
 </mesh>

 <mesh geometry={nodes.tv.geometry}>
 <tVTransitionMaterial
 ref={tvMatRef}
 uTexA={TVtexture}
 uTexB={videoTexture}
 />
 </mesh>
 </group>



 {/* 🪞 FLOOR */}
 <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
 <planeGeometry args={[4.2, 10]} />
 <MeshReflectorMaterial
 resolution={1024}
 blur={[200, 50]}
 mixBlur={2}
 mixStrength={100}
 roughness={0.1}
 distortionMap={roughnessMap}
 distortion={0.0}
 reflectorOffset={0}
 color="#111"
 metalness={.9}
 />
 </mesh>

 </group>
 );
}