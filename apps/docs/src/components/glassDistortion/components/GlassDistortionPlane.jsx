"use client"
import { useRef, useMemo, useEffect } from'react';
import { useFrame, useThree } from'@react-three/fiber';
import { ShaderMaterial, Vector2, NormalBlending } from'three';
import { EnhancedScreenPaint } from'../core/EnhancedScreenPaint';
import { usePointer } from'../hooks/usePointer';

const vertexShader = `
varying vec2 vUv;
void main() {
 vUv = uv;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
uniform sampler2D u_motionTexture;
uniform float u_rgbShift;
uniform float u_multiplier;
uniform float u_colorMultiplier;

varying vec2 vUv;

void main() {
 vec4 data = texture2D(u_motionTexture, vUv);
 float weight = (data.z + data.w) * 0.5;
 vec2 vel = (0.5 - data.xy) * 2.0 * weight;

 float velMag = length(vel);
 float velSum = vel.x + vel.y;
 float velMax = max(abs(vel.x), abs(vel.y));

 // Strong RGB chromatic shift
 float phase = velSum * 50.0;
 vec3 rgbShift = vec3(
 sin(phase),
 sin(phase + 2.5 * u_rgbShift),
 sin(phase + 5.0 * u_rgbShift)
 ) * velMax * u_colorMultiplier * 1.0;

 // Vibrant prism colors
 float hue = velSum * 25.0 + velMag * 20.0;
 vec3 prismColor = vec3(
 0.5 + 0.5 * sin(hue),
 0.5 + 0.5 * sin(hue + 2.094),
 0.5 + 0.5 * sin(hue + 4.188)
 );

 // Directional color tint
 vec3 dirColor = vec3(
 0.5 + 0.5 * sin(vel.x * 30.0),
 0.5 + 0.5 * cos(vel.y * 25.0),
 0.5 + 0.5 * sin((vel.x + vel.y) * 20.0)
 );

 // Combine colors with stronger mixing
 vec3 color = vec3(1.0) + rgbShift;
 color = mix(color, prismColor, weight * velMag * 1.5);
 color = mix(color, dirColor, weight * 0.8);

 // Higher alpha for more visibility
 float alpha = weight * (velMag * u_multiplier * 0.3 + 1.0);
 alpha = clamp(alpha, 0.0, 0.2);

 gl_FragColor = vec4(color, alpha);
}`;

export function GlassDistortionPlane({
 enabled = true,
 drawEnabled = true,
 needsMouseDown = false,
 minRadius = 0,
 maxRadius = 100,
 radiusDistanceRange = 100,
 pushStrength = 22,
 accelerationDissipation = 0.8,
 velocityDissipation = 0.975,
 weight1Dissipation = 0.91,
 weight2Dissipation = 0.2,
 rgbShift = 0.5,
 multiplier = 5,
 colorMultiplier = 10,
 position = [0, 0, 0],
 scale = [1, 1, 1],
}) {
 const { gl, size } = useThree();
 const meshRef = useRef(null);
 const materialRef = useRef(null);
 const screenPaint = useRef(null);
 const tempVec = useRef(new Vector2());

 const splatStack = usePointer({ force: 30.0 });
 const currentMousePos = useRef(new Vector2(0, 0));
 const prevMousePos = useRef(new Vector2(0, 0));

 // Store config for screenPaint updates
 const configRef = useRef({
 enabled, drawEnabled, needsMouseDown, minRadius, maxRadius,
 radiusDistanceRange, pushStrength, accelerationDissipation,
 velocityDissipation, weight1Dissipation, weight2Dissipation,
 });

 // Update config ref when props change
 useEffect(() => {
 configRef.current = {
 enabled, drawEnabled, needsMouseDown, minRadius, maxRadius,
 radiusDistanceRange, pushStrength, accelerationDissipation,
 velocityDissipation, weight1Dissipation, weight2Dissipation,
 };
 }, [enabled, drawEnabled, needsMouseDown, minRadius, maxRadius,
 radiusDistanceRange, pushStrength, accelerationDissipation,
 velocityDissipation, weight1Dissipation, weight2Dissipation]);

 // Initialize ScreenPaint once
 useEffect(() => {
 const sp = new EnhancedScreenPaint(configRef.current);
 sp.init();
 screenPaint.current = sp;

 return () => {
 sp.dispose();
 screenPaint.current = null;
 };
 }, [gl]);

 // Handle resize
 useEffect(() => {
 screenPaint.current?.resize(size.width, size.height, gl);
 }, [size.width, size.height, gl]);

 // Create material once with initial values
 const material = useMemo(() => {
 return new ShaderMaterial({
 vertexShader,
 fragmentShader,
 uniforms: {
 u_motionTexture: { value: null },
 u_rgbShift: { value: rgbShift },
 u_multiplier: { value: multiplier },
 u_colorMultiplier: { value: colorMultiplier },
 },
 transparent: true,
 blending: NormalBlending,
 depthWrite: false,
 depthTest: false,
 });
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 // Update material uniforms when props change
 useEffect(() => {
 if (!materialRef.current) return;
 const uniforms = materialRef.current.uniforms;
 uniforms.u_rgbShift.value = rgbShift;
 uniforms.u_multiplier.value = multiplier;
 uniforms.u_colorMultiplier.value = colorMultiplier;
 }, [rgbShift, multiplier, colorMultiplier]);

 // Animation loop
 useFrame((_, deltaTime) => {
 const sp = screenPaint.current;
 const mat = materialRef.current;
 if (!sp || !mat) return;

 // Update config
 const cfg = configRef.current;
 sp.enabled = cfg.enabled;
 sp.drawEnabled = cfg.drawEnabled;

 // Process mouse movement
 const hasMovement = splatStack.length > 0;

 if (hasMovement) {
 const latest = splatStack[splatStack.length - 1];
 tempVec.current.set(
 latest.mouseX * size.width,
 (1.0 - latest.mouseY) * size.height
 );
 prevMousePos.current.copy(currentMousePos.current);
 currentMousePos.current.copy(tempVec.current);
 // Clear by setting length (mutating the array contents, not reassigning)
 while (splatStack.length > 0) splatStack.pop();
 }

 sp.update(gl, deltaTime, currentMousePos.current, prevMousePos.current, false);
 mat.uniforms.u_motionTexture.value = sp.currPaintTexture;
 });

 // Cleanup material
 useEffect(() => {
 const mat = materialRef.current;
 return () => mat?.dispose();
 }, []);

 return (
 <mesh ref={meshRef} position={position} scale={scale}>
 <planeGeometry args={[1, 1]} />
 <primitive ref={materialRef} object={material} attach="material" />
 </mesh>
 );
}

export default GlassDistortionPlane;
