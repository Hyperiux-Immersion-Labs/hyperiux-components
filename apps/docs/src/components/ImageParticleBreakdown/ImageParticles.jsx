"use client";

import React, { useEffect, useMemo, useRef, useState } from"react";
import * as THREE from"three";
import { useFrame, useThree } from"@react-three/fiber";
import { CONFIG, hexToVec3 } from"./config";
import"./ParticleMaterial";
import { buildParticleData } from"./buildParticle";

export default function ImageParticles({
 imageSrc = CONFIG.imageSrc,
 progressRef,
 sampleStep = CONFIG.desktopSampleStep,
 worldWidth = CONFIG.desktopWorldWidth,
 transitionColors = CONFIG.transitionColors,
}) {
 const pointsRef = useRef();
 const materialRef = useRef();
 const geometryRef = useRef();
 const pointerRef = useRef(new THREE.Vector2(0, 0));
 const targetPointerRef = useRef(new THREE.Vector2(0, 0));
 const { gl, camera, pointer } = useThree();

 const [particleData, setParticleData] = useState(null);

 useEffect(() => {
 let active = true;

 buildParticleData(imageSrc, {
 sampleStep,
 worldWidth,
 alphaThreshold: CONFIG.alphaThreshold,
 minParticleSize: CONFIG.minParticleSize,
 maxParticleSize: CONFIG.maxParticleSize,
 randomSizeStrength: CONFIG.randomSizeStrength,
 randomSizeMinMultiplier: CONFIG.randomSizeMinMultiplier,
 randomSizeMaxMultiplier: CONFIG.randomSizeMaxMultiplier,
 brightnessBoost: 1.04,
 })
 .then((data) => {
 if (active) setParticleData(data);
 })
 .catch((err) => {
 console.error("Particle image failed to load:", err);
 });

 return () => {
 active = false;
 };
 }, [imageSrc, sampleStep, worldWidth]);

 useEffect(() => {
 if (!materialRef.current) return;
 const colors = [
 transitionColors?.[0] || CONFIG.transitionColors[0],
 transitionColors?.[1] || CONFIG.transitionColors[1],
 transitionColors?.[2] || CONFIG.transitionColors[2],
 ];

 materialRef.current.uColor1.set(...hexToVec3(colors[0]));
 materialRef.current.uColor2.set(...hexToVec3(colors[1]));
 materialRef.current.uColor3.set(...hexToVec3(colors[2]));
 }, [transitionColors]);

 const geometry = useMemo(() => new THREE.BufferGeometry(), []);

 useEffect(() => {
 if (!particleData) return;

 geometry.setAttribute("position", new THREE.BufferAttribute(particleData.positions, 3));
 geometry.setAttribute("aBasePosition", new THREE.BufferAttribute(particleData.positions, 3));
 geometry.setAttribute("aTargetPosition", new THREE.BufferAttribute(particleData.targetPositions, 3));
 geometry.setAttribute("aColor", new THREE.BufferAttribute(particleData.colors, 3));
 geometry.setAttribute("aSize", new THREE.BufferAttribute(particleData.sizes, 1));
 geometry.setAttribute("aRandom", new THREE.BufferAttribute(particleData.randoms, 3));
 geometry.setAttribute("aEdge", new THREE.BufferAttribute(particleData.edges, 1));
 geometry.setAttribute("aParallax", new THREE.BufferAttribute(particleData.parallaxes, 1));
 geometry.setAttribute("aCenter", new THREE.BufferAttribute(particleData.centers, 1));
 geometry.setAttribute("aFadeOffset", new THREE.BufferAttribute(particleData.fadeOffsets, 1));

 geometry.setDrawRange(0, particleData.count);
 geometry.computeBoundingSphere();
 geometryRef.current = geometry;
 }, [geometry, particleData]);

 useFrame((state, delta) => {
 if (!materialRef.current || !pointsRef.current || !particleData || !geometryRef.current) return;

 const rawProgress = THREE.MathUtils.clamp(progressRef?.current ?? 0, 0, 1);

 const motionProgress = THREE.MathUtils.smoothstep(
 rawProgress,
 CONFIG.motionStart,
 CONFIG.motionEnd
 );

 const fadeProgress = THREE.MathUtils.smoothstep(
 rawProgress,
 CONFIG.fadeStart,
 CONFIG.fadeEnd
 );

 const centerScatterProgress = THREE.MathUtils.smoothstep(
 rawProgress,
 CONFIG.centerScatterStart,
 CONFIG.centerScatterEnd
 );

 materialRef.current.uTime = state.clock.elapsedTime;
 materialRef.current.uPixelRatio = Math.min(gl.getPixelRatio(), 2);

 materialRef.current.uProgress = THREE.MathUtils.lerp(
 materialRef.current.uProgress,
 motionProgress,
 1 - Math.pow(0.00015, delta)
 );

 materialRef.current.uFadeProgress = THREE.MathUtils.lerp(
 materialRef.current.uFadeProgress,
 fadeProgress,
 1 - Math.pow(0.00015, delta)
 );

 materialRef.current.uCenterScatterProgress = THREE.MathUtils.lerp(
 materialRef.current.uCenterScatterProgress,
 centerScatterProgress,
 1 - Math.pow(0.00015, delta)
 );

 targetPointerRef.current.x = pointer.x;
 targetPointerRef.current.y = pointer.y;

 pointerRef.current.x = THREE.MathUtils.lerp(
 pointerRef.current.x,
 targetPointerRef.current.x,
 CONFIG.pointerLerp
 );
 pointerRef.current.y = THREE.MathUtils.lerp(
 pointerRef.current.y,
 targetPointerRef.current.y,
 CONFIG.pointerLerp
 );

 materialRef.current.uPointer.set(pointerRef.current.x, pointerRef.current.y);

 const visibleRatio = THREE.MathUtils.lerp(
 CONFIG.keepRatioBeforeFade,
 CONFIG.keepRatioAtEnd,
 fadeProgress * fadeProgress
 );

 const visibleCount = Math.max(
 CONFIG.minVisibleCount,
 Math.floor(particleData.count * visibleRatio)
 );

 geometryRef.current.setDrawRange(0, visibleCount);

 pointsRef.current.rotation.y = pointerRef.current.x * 0.024 * motionProgress;
 pointsRef.current.rotation.x = pointerRef.current.y * 0.016 * motionProgress;

 pointsRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.14) * 0.01 * motionProgress;
 pointsRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.12) * 0.008 * motionProgress;
 pointsRef.current.position.z = THREE.MathUtils.lerp(0, 0.42, motionProgress);

 camera.position.z = THREE.MathUtils.lerp(
 CONFIG.cameraZ,
 CONFIG.cameraEndZ,
 motionProgress
 );

 camera.position.x =
 pointerRef.current.x * CONFIG.pointerCameraStrengthX * (1.0 - fadeProgress * 0.55);
 camera.position.y =
 -pointerRef.current.y * CONFIG.pointerCameraStrengthY * (1.0 - fadeProgress * 0.55);

 camera.lookAt(
 pointerRef.current.x * CONFIG.pointerLookAtX,
 -pointerRef.current.y * CONFIG.pointerLookAtY,
 0
 );
 });

 if (!particleData) return null;

 return (
 <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
 <particleMaterial
 ref={materialRef}
 transparent
 depthWrite={false}
 blending={THREE.NormalBlending}
 />
 </points>
 );
}