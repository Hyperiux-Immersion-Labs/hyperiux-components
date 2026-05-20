"use client";

import { Canvas, useFrame, useThree } from"@react-three/fiber";
import { useEffect, useMemo, useRef } from"react";
import * as THREE from"three";
import { degToRad } from"three/src/math/MathUtils";

const PARTICLE_SIZES = [0.08, 0.09, 0.1, 0.2,0.4,0.6 ];
const OFFSCREEN = 9999;
const TORUS_MAJOR_RADIUS = 1.2;
const TORUS_MINOR_RADIUS = 0.9;
const TORUS_OUTER_RADIUS = 0.48;
const TORUS_INNER_RADIUS = 0.08;

function random01(seed) {
 const value = Math.sin(seed * 127.1 + seed * seed * 311.7) * 43758.5453123;
 return value - Math.floor(value);
}

function DonutParticles() {
 const pointsRef = useRef(null);
 const simulationRef = useRef(null);
 const { size, camera, gl } = useThree();

 const count = 25000;
 const dpr = gl.getPixelRatio();

 const mouse3D = useRef(new THREE.Vector3(OFFSCREEN, OFFSCREEN, OFFSCREEN));
 const smoothMouse = useRef(new THREE.Vector3(OFFSCREEN, OFFSCREEN, OFFSCREEN));
 const prevSmoothMouse = useRef(new THREE.Vector3(OFFSCREEN, OFFSCREEN, OFFSCREEN));
 const mouseVelocity = useRef(new THREE.Vector3());
 const smoothMouseVelocity = useRef(new THREE.Vector3());
 const motionActivity = useRef(0);
 const localMouse = useMemo(() => new THREE.Vector3(), []);
 const localVelocity = useMemo(() => new THREE.Vector3(), []);
 const mouseNdc = useMemo(() => new THREE.Vector2(), []);
 const raycaster = useMemo(() => new THREE.Raycaster(), []);
 const interactionPlane = useMemo(() => new THREE.Plane(), []);
 const planeNormal = useMemo(() => new THREE.Vector3(), []);
 const planePoint = useMemo(() => new THREE.Vector3(), []);
 const worldIntersection = useMemo(() => new THREE.Vector3(), []);

 useEffect(() => {
 const handleMouseMove = (event) => {
 if (!pointsRef.current) {
 return;
 }

 mouseNdc.set(
 (event.clientX / size.width) * 2 - 1,
 -(event.clientY / size.height) * 2 + 1
 );

 raycaster.setFromCamera(mouseNdc, camera);

 planeNormal.set(0, 0, 1).applyQuaternion(pointsRef.current.quaternion);
 pointsRef.current.getWorldPosition(planePoint);
 interactionPlane.setFromNormalAndCoplanarPoint(planeNormal, planePoint);

 if (raycaster.ray.intersectPlane(interactionPlane, worldIntersection)) {
 if (mouse3D.current.x === OFFSCREEN) {
 smoothMouse.current.copy(worldIntersection);
 prevSmoothMouse.current.copy(worldIntersection);
 }
 mouse3D.current.copy(worldIntersection);
 }
 };

 const handleLeave = () => {
 mouse3D.current.set(OFFSCREEN, OFFSCREEN, OFFSCREEN);
 smoothMouse.current.set(OFFSCREEN, OFFSCREEN, OFFSCREEN);
 prevSmoothMouse.current.set(OFFSCREEN, OFFSCREEN, OFFSCREEN);
 };

 window.addEventListener("mousemove", handleMouseMove);
 window.addEventListener("mouseleave", handleLeave);

 return () => {
 window.removeEventListener("mousemove", handleMouseMove);
 window.removeEventListener("mouseleave", handleLeave);
 };
 }, [
 camera,
 interactionPlane,
 mouseNdc,
 planeNormal,
 planePoint,
 raycaster,
 size,
 worldIntersection,
 ]);

 const simulation = useMemo(() => {
 const positions = new Float32Array(count * 3);
 const colors = new Float32Array(count * 3);
 const sizes = new Float32Array(count);
 const randoms = new Float32Array(count * 4);
 const velocities = new Float32Array(count * 3);
 const base = [];

 const palette = [
 [0.06, 0.02, 0.12],
 [0.15, 0.05, 0.28],
 [0.28, 0.1, 0.48],
 [0.42, 0.18, 0.7],
 [0.56, 0.28, 0.9],
 [0.7, 0.4, 1.0],
 [0.9, 0.62, 1.0],
 ];

 for (let i = 0; i < count; i += 1) {
 const rand0 = random01(i + 1.17);
 const rand1 = random01(i + 2.31);
 const rand2 = random01(i + 3.73);
 const rand3 = random01(i + 4.91);
 const rand4 = random01(i + 5.57);
 const rand5 = random01(i + 6.41);
 const rand6 = random01(i + 7.29);

 const u = rand0 * Math.PI * 2;
 const v = rand1 * Math.PI * 2;
 const majorRadius = TORUS_MAJOR_RADIUS;
 const minorRadius = TORUS_MINOR_RADIUS;

 const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
 const y = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
 const z = minorRadius * Math.sin(v);

 positions.set([x, y, z], i * 3);
 velocities.set([0, 0, 0], i * 3);

 base.push({
 x,
 y,
 z,
 u,
 v,
 noiseX: rand5 * Math.PI * 2,
 noiseY: rand6 * Math.PI * 2,
 });

 const color = palette[Math.floor(rand3 * palette.length)];
 colors.set(color, i * 3);

 sizes[i] = PARTICLE_SIZES[Math.floor(rand4 * PARTICLE_SIZES.length)];
 randoms.set([rand1, rand4, rand5, rand6], i * 4);
 }

 return { positions, colors, sizes, randoms, base, velocities };
 }, []);

 const { positions, colors, sizes, randoms } = simulation;

 useEffect(() => {
 simulationRef.current = {
 base: simulation.base,
 velocities: simulation.velocities,
 };
 }, [simulation]);

 const invMatrix = useMemo(() => new THREE.Matrix4(), []);

 const pointTexture = useMemo(() => {
 const textureSize = 128;
 const canvas = document.createElement("canvas");
 canvas.width = textureSize;
 canvas.height = textureSize;

 const context = canvas.getContext("2d");
 if (!context) {
 return null;
 }

 const gradient = context.createRadialGradient(
 textureSize * 0.45,
 textureSize * 0.4,
 textureSize * 0.05,
 textureSize * 0.5,
 textureSize * 0.5,
 textureSize * 0.5
 );
 gradient.addColorStop(0,"rgba(255,255,255,1)");
 gradient.addColorStop(0.2,"rgba(255,255,255,0.98)");
 gradient.addColorStop(0.5,"rgba(238,220,255,0.86)");
 gradient.addColorStop(0.8,"rgba(140,90,255,0.26)");
 gradient.addColorStop(1,"rgba(0,0,0,0)");

 context.clearRect(0, 0, textureSize, textureSize);
 context.fillStyle = gradient;
 context.beginPath();
 context.arc(
 textureSize / 2,
 textureSize / 2,
 textureSize * 0.47,
 0,
 Math.PI * 2
 );
 context.fill();

 const texture = new THREE.CanvasTexture(canvas);
 texture.needsUpdate = true;
 texture.colorSpace = THREE.SRGBColorSpace;
 return texture;
 }, []);

 const matcapTexture = useMemo(() => {
 const textureSize = 128;
 const canvas = document.createElement("canvas");
 canvas.width = textureSize;
 canvas.height = textureSize;

 const context = canvas.getContext("2d");
 if (!context) {
 return null;
 }

 const base = context.createLinearGradient(0, 0, textureSize, textureSize);
 base.addColorStop(0,"#fcf4ff");
 base.addColorStop(0.25,"#cf9dff");
 base.addColorStop(0.55,"#6a2fcd");
 base.addColorStop(1,"#0c0619");
 context.fillStyle = base;
 context.fillRect(0, 0, textureSize, textureSize);

 const bubble = context.createRadialGradient(
 textureSize * 0.34,
 textureSize * 0.3,
 textureSize * 0.04,
 textureSize * 0.5,
 textureSize * 0.54,
 textureSize * 0.62
 );
 bubble.addColorStop(0,"rgba(255,255,255,1)");
 bubble.addColorStop(0.16,"rgba(255,245,255,0.95)");
 bubble.addColorStop(0.4,"rgba(231,182,255,0.65)");
 bubble.addColorStop(0.75,"rgba(108,46,190,0.15)");
 bubble.addColorStop(1,"rgba(0,0,0,0)");
 context.fillStyle = bubble;
 context.fillRect(0, 0, textureSize, textureSize);

 const texture = new THREE.CanvasTexture(canvas);
 texture.needsUpdate = true;
 texture.colorSpace = THREE.SRGBColorSpace;
 return texture;
 }, []);

 const particleMaterial = useMemo(() => {
 if (!pointTexture || !matcapTexture) {
 return null;
 }

 return new THREE.ShaderMaterial({
 uniforms: {
 pointTexture: { value: pointTexture },
 matcapTexture: { value: matcapTexture },
 time: { value: 0 },
 uDpr: { value: dpr },
 },
 vertexShader: `
 uniform float uDpr;
 attribute float size;
 attribute vec4 random;
 varying vec3 vColor;
 varying vec4 vRandom;
 varying float vScale;
 varying vec3 vViewPos;

 void main() {
 vColor = color;
 vRandom = random;

 vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
 vViewPos = mvPosition.xyz;
 vScale = smoothstep(3.0, 14.0, length(mvPosition.xyz));
 vScale *= mix(0.55, 1.0, random.z);

 gl_PointSize = size * uDpr * 1.55 * vScale * (90.0 / length(mvPosition.xyz));
 gl_Position = projectionMatrix * mvPosition;
 }
 `,
 fragmentShader: `
 uniform sampler2D pointTexture;
 uniform sampler2D matcapTexture;
 uniform float time;
 varying vec3 vColor;
 varying vec4 vRandom;
 varying float vScale;
 varying vec3 vViewPos;

 vec3 blendOverlay(vec3 base, vec3 blend) {
 return mix(
 2.0 * base * blend,
 1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
 step(0.5, base)
 );
 }

 vec3 blendSoftLight(vec3 base, vec3 blend) {
 return mix(
 2.0 * base * blend + base * base * (1.0 - 2.0 * blend),
 sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend),
 step(0.5, blend)
 );
 }

 float hash(vec2 p) {
 return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
 }

 void main() {
 vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
 vec2 centered = uv - 0.5;
 float radius = length(centered);

 if (radius > 0.5 || vScale < 0.08) {
 discard;
 }

 vec4 sprite = vec4(1.0);
 vec3 purple = vec3(0.6, 0.45, 1.0);
 float cycleSpeed = mix(0.12, 0.26, vRandom.y);
 float cycleOffset = vRandom.x + vRandom.w * 0.73;
 float cycle = fract(time * cycleSpeed + cycleOffset);
 float phase = cycle * 3.0;
 float blend = smoothstep(0.0, 1.0, fract(phase));
 vec3 color = phase < 1.0
 ? mix(vec3(0.0), vec3(1.0), blend)
 : phase < 2.0
 ? mix(vec3(1.0), purple, blend)
 : mix(purple, vec3(0.0), blend);
 color = max(color, vec3(0.08, 0.06, 0.14));

 vec3 sparkle = vec3(0.4 + sin(time * 4.0 + vRandom.y * 20.0));
 color *= 0.5 + sparkle * pow(vRandom.z, 10.0) * 2.35;

 float alpha = sprite.a;
 if (alpha < 0.08) {
 discard;
 }

 gl_FragColor = vec4(color, alpha);
 }
 `,
 transparent: true,
 depthWrite: false,
 vertexColors: true,
 blending: THREE.NormalBlending,
 });
 }, [dpr, matcapTexture, pointTexture]);

 useEffect(() => {
 return () => {
 particleMaterial?.dispose();
 pointTexture?.dispose();
 matcapTexture?.dispose();
 };
 }, [matcapTexture, particleMaterial, pointTexture]);

 useFrame(({ clock }, delta) => {
 if (!pointsRef.current || !particleMaterial) {
 return;
 }

 const time = clock.getElapsedTime();
 const hz = delta * 60;
 const positionsArray = pointsRef.current.geometry.attributes.position.array;
 const simulation = simulationRef.current;

 if (!simulation) {
 return;
 }

 const { base, velocities } = simulation;

 pointsRef.current.material.uniforms.time.value = time;
 pointsRef.current.material.uniforms.uDpr.value = gl.getPixelRatio();

 pointsRef.current.rotation.z += 0.00095;

 const majorRadius = TORUS_MAJOR_RADIUS;
 const outerMinorRadius = TORUS_OUTER_RADIUS;
 const innerMinorRadius = TORUS_INNER_RADIUS;

 smoothMouse.current.lerp(mouse3D.current, 0.85);
 mouseVelocity.current
 .copy(smoothMouse.current)
 .sub(prevSmoothMouse.current)
 .multiplyScalar(1.2);
 prevSmoothMouse.current.copy(smoothMouse.current);
 smoothMouseVelocity.current.lerp(mouseVelocity.current, 0.4);

 const movementSpeed = smoothMouseVelocity.current.length();
 motionActivity.current = THREE.MathUtils.lerp(
 motionActivity.current,
 movementSpeed * 10,
 movementSpeed * 10 > motionActivity.current ? 0.8 : 0.08
 );
 motionActivity.current = Math.min(motionActivity.current, 1);

 invMatrix.copy(pointsRef.current.matrixWorld).invert();
 localMouse.copy(smoothMouse.current).applyMatrix4(invMatrix);
 localVelocity.copy(smoothMouseVelocity.current).applyMatrix4(invMatrix);

 const INFLUENCE = 0.75;
 const CLOSE_INFLUENCE = 0.32;
 const STICK = 0.8;
 const FLOW = 0.65;
 const CLOSE_FLOW_BOOST = 5.5;
 const RETURN = 0.003;
 const DAMP = 0.7;

 for (let i = 0; i < count; i += 1) {
 const index = i * 3;
 const particle = base[i];

 let x = positionsArray[index];
 let y = positionsArray[index + 1];
 let z = positionsArray[index + 2];

 const wave = Math.sin(time * 1.5 + particle.u * 2) * 0.15;
 const swirl = Math.cos(time * 1.2 + particle.v * 2) * 0.15;

 const tx = particle.x + wave;
 const ty = particle.y + swirl;
 const tz = particle.z + wave * 0.5;

 let fx = (tx - x) * RETURN;
 let fy = (ty - y) * RETURN;
 let fz = (tz - z) * RETURN;

 const dx = localMouse.x - x;
 const dy = localMouse.y - y;
 const dz = localMouse.z - z;
 const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
 let stretchPower = 0;
 let velocityLerp = 0.25;

 if (dist < INFLUENCE && motionActivity.current > 0.01) {
 const power = (1 - dist / INFLUENCE) * motionActivity.current;
 const closePower =
 dist < CLOSE_INFLUENCE
 ? Math.pow(1 - dist / CLOSE_INFLUENCE, 2.4) * motionActivity.current
 : 0;
 const flowBoost = 1 + closePower * CLOSE_FLOW_BOOST;

 fx += dx * STICK * power * 0.05;
 fy += dy * STICK * power * 0.05;
 fz += dz * STICK * power * 0.05;

 fx += localVelocity.x * FLOW * power * flowBoost;
 fy += localVelocity.y * FLOW * power * flowBoost;
 fz += localVelocity.z * FLOW * power * flowBoost;

 stretchPower = power + closePower * 0.4;
 velocityLerp = THREE.MathUtils.lerp(0.25, 1.0, power);
 }

 velocities[index] = THREE.MathUtils.lerp(
 velocities[index],
 (velocities[index] + fx * hz) * DAMP,
 velocityLerp
 );
 velocities[index + 1] = THREE.MathUtils.lerp(
 velocities[index + 1],
 (velocities[index + 1] + fy * hz) * DAMP,
 velocityLerp
 );
 velocities[index + 2] = THREE.MathUtils.lerp(
 velocities[index + 2],
 (velocities[index + 2] + fz * hz) * DAMP,
 velocityLerp
 );

 let nextX = x + velocities[index];
 let nextY = y + velocities[index + 1];
 let nextZ = z + velocities[index + 2];

 const radial = Math.hypot(nextX, nextY) || 0.0001;
 const dirX = nextX / radial;
 const dirY = nextY / radial;
 const tubeOffset = radial - majorRadius;
 const tubeDistance =
 Math.sqrt(tubeOffset * tubeOffset + nextZ * nextZ) || 0.0001;
 const stretch = stretchPower * 0.06;
 const maxOuter = outerMinorRadius + stretch;
 const minInner = innerMinorRadius - stretch * 0.4;

 if (tubeDistance > maxOuter || tubeDistance < minInner) {
 const targetDistance = THREE.MathUtils.clamp(
 tubeDistance,
 innerMinorRadius,
 outerMinorRadius
 );
 const scale = targetDistance / tubeDistance;
 const lerpBack = 0.15;

 nextX = THREE.MathUtils.lerp(
 nextX,
 dirX * (majorRadius + tubeOffset * scale),
 lerpBack
 );
 nextY = THREE.MathUtils.lerp(
 nextY,
 dirY * (majorRadius + tubeOffset * scale),
 lerpBack
 );
 nextZ = THREE.MathUtils.lerp(nextZ, nextZ * scale, lerpBack);
 }

 positionsArray[index] = nextX;
 positionsArray[index + 1] = nextY;
 positionsArray[index + 2] = nextZ;
 }

 pointsRef.current.geometry.attributes.position.needsUpdate = true;
 });

 useEffect(() => {
 camera.lookAt(0, 0, 0);
}, [camera]);

 return (
 <points
 ref={pointsRef}
 scale={2.5}
 frustumCulled={false}
 rotation={[degToRad(-80), degToRad(45), 0]}
 >
 <bufferGeometry>
 <bufferAttribute
 attach="attributes-position"
 array={positions}
 count={count}
 itemSize={3}
 />
 <bufferAttribute
 attach="attributes-color"
 array={colors}
 count={count}
 itemSize={3}
 />
 <bufferAttribute
 attach="attributes-size"
 array={sizes}
 count={count}
 itemSize={1}
 />
 <bufferAttribute
 attach="attributes-random"
 array={randoms}
 count={count}
 itemSize={4}
 />
 </bufferGeometry>

 {particleMaterial ? (
 <primitive object={particleMaterial} attach="material" />
 ) : null}
 </points>
 );
}

export default function DonutParticle() {

  return (
 <div className="h-screen w-full bg-black">
 <Canvas camera={{ position: [4.0, 1, 6], fov: 50 }} dpr={[1, 2]}>
 <DonutParticles />
 </Canvas>
 </div>
 );
}
