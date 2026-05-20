'use client'
import { useEffect, useRef } from'react';
import * as THREE from'three';
import { registerFxTarget, unregisterFxTarget } from'@/lib/2dCanvasTracker';

const VERTEX_SRC = `
varying vec2 vUv;
void main() {
 vUv = uv;
 gl_Position = vec4(position, 1.0);
}
`;

const FBO_FRAGMENT = `
precision highp float;
uniform sampler2D uPrevFrame;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uStrength;
uniform float uDissipation;

out vec4 fragColor;

void main() {
 vec2 uv = gl_FragCoord.xy / uResolution;
 vec4 prev = texture(uPrevFrame, uv);
  // Dissipate over time
 vec2 velocity = prev.xy * uDissipation;
 float density = prev.z * uDissipation;
  // Add mouse influence
 if (uMouse.x >= 0.0) {
 vec2 mouseUV = uMouse / uResolution;
 vec2 diff = uv - mouseUV;
 diff.x *= uResolution.x / uResolution.y;
 float dist = length(diff);
 float influence = exp(-dist * dist / (uRadius * uRadius)) * uStrength;
 velocity += normalize(diff + 0.001) * influence;
 density += influence;
 }
  fragColor = vec4(velocity, min(density, 1.0), 1.0);
}
`;

const MAIN_FRAGMENT = `
precision highp float;
uniform sampler2D uImage;
uniform sampler2D uFluidTex;
uniform vec2 uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uDensity;
uniform vec3 uNoiseColor;
uniform float uDistortStrength;
uniform float uTrailDarkness;

out vec4 fragColor;

// Smooth wave-based noise function
float waveNoise(vec2 uv, float t) {
 float wave1 = sin(uv.x * 6.0 + t * 0.8) * 0.5 + 0.5;
 float wave2 = sin(uv.y * 4.0 - t * 0.6) * 0.5 + 0.5;
 float wave3 = sin((uv.x + uv.y) * 5.0 + t * 0.5) * 0.5 + 0.5;
 float wave4 = sin((uv.x - uv.y) * 3.0 - t * 0.4) * 0.5 + 0.5;
 return (wave1 + wave2 + wave3 + wave4) * 0.25;
}

// Layered wave function for organic wavy shapes
float wavyFbm(vec2 uv, float t) {
 float v = 0.0;
 float a = 0.5;
 float freq = 1.0;
  for (int i = 0; i < 4; i++) {
 // Create flowing wave patterns
 float wave = sin(uv.x * freq * 3.0 + uv.y * freq * 2.0 + t * (0.3 + float(i) * 0.1));
 wave += sin(uv.y * freq * 4.0 - uv.x * freq * 1.5 + t * (0.4 - float(i) * 0.05));
 wave += cos(uv.x * freq * 2.5 + t * 0.2) * sin(uv.y * freq * 3.5 - t * 0.3);
 wave = wave / 3.0 * 0.5 + 0.5;
  v += a * wave;
 freq *= 1.8;
 a *= 0.5;
 }
 return v;
}

void main() {
 vec2 uv = gl_FragCoord.xy / uResolution;
  // Sample fluid texture
 vec4 fluid = texture(uFluidTex, uv);
 vec2 velocity = fluid.xy;
 float fluidDensity = fluid.z;
  // Distort UV based on fluid velocity
 vec2 distortedUV = uv + velocity * uDistortStrength;
 distortedUV.y = 1.0 - distortedUV.y;
  // Sample image
 vec4 imageColor = texture(uImage, distortedUV);
 float imageLuma = dot(imageColor.rgb, vec3(0.299, 0.587, 0.114));
  // Pixelate
 vec2 pixelUV = uv;
  // Generate wavy noise pattern
 float aspect = uResolution.x / uResolution.y;
  float n = wavyFbm(pixelUV * vec2(aspect, .5) * .5, uTime * 0.05);
  // Animated density modulation with smoother waves
 float animatedDensity = uDensity + sin(uTime * 0.3) * 0.15 + sin(uTime * 0.2 + pixelUV.x * 2.0) * 0.1;
 n = n * 0.6 + (animatedDensity - 0.5) * 0.2;
  // Add fluid influence to pattern
 n += fluidDensity * 0.5;
  // Soften edges with smoothstep for less sharp cutoff
 n = smoothstep(0.2, 0.8, n);
  // Dither
 float bayer = fract(dot(floor(gl_FragCoord.xy / uPixelSize), vec2(0.5, 0.4)));
 float mask = step(0.4, n + (bayer - 0.5));
  // Apply color with gamma correction and trail darkness
 vec3 color = pow(uNoiseColor, vec3(2.2));
 color = pow(color, vec3(1.0 / 2.2));
  // Darken the trail based on fluid density
 float darkenFactor = 1.0 - (fluidDensity * uTrailDarkness);
 color *= darkenFactor;
  fragColor = vec4(color, mask * imageColor.a);
}
`;

const createFBO = (renderer, width, height) => {
 const target = new THREE.WebGLRenderTarget(width, height, {
 minFilter: THREE.LinearFilter,
 magFilter: THREE.LinearFilter,
 format: THREE.RGBAFormat,
 type: THREE.FloatType
 });
 return target;
};

export const NoiseDietherShader = ({
 imageSrc ='/assets/img/image02.webp',
 noiseColor ='#ffffff',
 className,
 style,
 pixelSize = 3,
 patternDensity = 1,
 fluidRadius = 0.05,
 fluidStrength = 0.3,
 fluidDissipation = 0.98,
 distortStrength = 0.02,
 trailDarkness = 0.5
}) => {
 const containerRef = useRef(null);
 const threeRef = useRef(null);
 const mouseRef = useRef({ x: -1, y: -1 });
 const isMouseStoppedRef = useRef(false);
 const mouseStopTimeoutRef = useRef(null);

 const parseColor = (hex) => {
 const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
 return result
 ? new THREE.Vector3(
 parseInt(result[1], 16) / 255,
 parseInt(result[2], 16) / 255,
 parseInt(result[3], 16) / 255
 )
 : new THREE.Vector3(1, 1, 1);
 };

 useEffect(() => {
 const container = containerRef.current;
 if (!container) return;

 // Load image
 const textureLoader = new THREE.TextureLoader();
 const imageTexture = textureLoader.load(imageSrc);
 imageTexture.minFilter = THREE.LinearFilter;
 imageTexture.magFilter = THREE.LinearFilter;

 // Setup renderer
 const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 renderer.domElement.style.width ='100%';
 renderer.domElement.style.height ='100%';
 container.appendChild(renderer.domElement);

 const scene = new THREE.Scene();
 const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
 const fboScene = new THREE.Scene();

 // Create FBOs for ping-pong
 let fboA = createFBO(renderer, 256, 256);
 let fboB = createFBO(renderer, 256, 256);

 // FBO material
 const fboMaterial = new THREE.ShaderMaterial({
 vertexShader: VERTEX_SRC,
 fragmentShader: FBO_FRAGMENT,
 uniforms: {
 uPrevFrame: { value: null },
 uResolution: { value: new THREE.Vector2(256, 256) },
 uMouse: { value: new THREE.Vector2(-1, -1) },
 uRadius: { value: fluidRadius },
 uStrength: { value: fluidStrength },
 uDissipation: { value: fluidDissipation }
 },
 glslVersion: THREE.GLSL3
 });
 const fboQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fboMaterial);
 fboScene.add(fboQuad);

 // Main material
 const mainMaterial = new THREE.ShaderMaterial({
 vertexShader: VERTEX_SRC,
 fragmentShader: MAIN_FRAGMENT,
 uniforms: {
 uImage: { value: imageTexture },
 uFluidTex: { value: fboA.texture },
 uResolution: { value: new THREE.Vector2() },
 uTime: { value: 0 },
 uPixelSize: { value: pixelSize },
 uDensity: { value: patternDensity },
 uNoiseColor: { value: parseColor(noiseColor) },
 uDistortStrength: { value: distortStrength },
 uTrailDarkness: { value: trailDarkness }
 },
 transparent: true,
 glslVersion: THREE.GLSL3
 });
 const mainQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mainMaterial);
 scene.add(mainQuad);

 const setSize = () => {
 const w = container.clientWidth || 1;
 const h = container.clientHeight || 1;
 renderer.setSize(w, h, false);
 mainMaterial.uniforms.uResolution.value.set(
 renderer.domElement.width,
 renderer.domElement.height
 );
 mainMaterial.uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio();
 };
 setSize();

 const ro = new ResizeObserver(setSize);
 ro.observe(container);

 // Register with 2dCanvasTracker
 container.classList.add('fx-target');
 registerFxTarget(container, {
 onMove: ({ localX, localY, rect }) => {
 const scaleX = renderer.domElement.width / rect.right - rect.left || renderer.domElement.width / container.clientWidth;
 const scaleY = renderer.domElement.height / rect.bottom - rect.top || renderer.domElement.height / container.clientHeight;
 mouseRef.current = {
 x: localX * (renderer.domElement.width / container.clientWidth),
 y: (container.clientHeight - localY) * (renderer.domElement.height / container.clientHeight)
 };
 isMouseStoppedRef.current = false;
  // Clear existing timeout and set a new one
 if (mouseStopTimeoutRef.current) {
 clearTimeout(mouseStopTimeoutRef.current);
 }
 mouseStopTimeoutRef.current = setTimeout(() => {
 isMouseStoppedRef.current = true;
 }, 100); // Stop trail after 100ms of no movement
 },
 onLeave: () => {
 mouseRef.current = { x: -1, y: -1 };
 isMouseStoppedRef.current = false;
 if (mouseStopTimeoutRef.current) {
 clearTimeout(mouseStopTimeoutRef.current);
 }
 }
 });

 const clock = new THREE.Clock();
 let raf = 0;

 const animate = () => {
 mainMaterial.uniforms.uTime.value = clock.getElapsedTime();

 // Update FBO uniforms - only add influence if mouse is moving
 fboMaterial.uniforms.uPrevFrame.value = fboA.texture;
 if (isMouseStoppedRef.current) {
 // Mouse stopped - don't add new influence
 fboMaterial.uniforms.uMouse.value.set(-1, -1);
 } else {
 fboMaterial.uniforms.uMouse.value.set(
 mouseRef.current.x * (256 / renderer.domElement.width),
 mouseRef.current.y * (256 / renderer.domElement.height)
 );
 }

 // Render to FBO B
 renderer.setRenderTarget(fboB);
 renderer.render(fboScene, camera);
 renderer.setRenderTarget(null);

 // Swap FBOs
 [fboA, fboB] = [fboB, fboA];

 // Update main material
 mainMaterial.uniforms.uFluidTex.value = fboA.texture;

 // Render main scene
 renderer.render(scene, camera);
 raf = requestAnimationFrame(animate);
 };
 raf = requestAnimationFrame(animate);

 threeRef.current = { renderer, fboA, fboB, mainMaterial, fboMaterial, ro, raf, imageTexture };

 return () => {
 ro.disconnect();
 cancelAnimationFrame(raf);
 if (mouseStopTimeoutRef.current) {
 clearTimeout(mouseStopTimeoutRef.current);
 }
 unregisterFxTarget(container);
 container.classList.remove('fx-target');
 fboA.dispose();
 fboB.dispose();
 mainMaterial.dispose();
 fboMaterial.dispose();
 imageTexture.dispose();
 renderer.dispose();
 renderer.forceContextLoss();
 if (renderer.domElement.parentElement === container) {
 container.removeChild(renderer.domElement);
 }
 };
 }, [imageSrc, noiseColor, pixelSize, patternDensity, fluidRadius, fluidStrength, fluidDissipation, distortStrength, trailDarkness]);

 return (
 <div
 ref={containerRef}
 className={className}
 style={style}
 aria-label="NoiseRipple interactive background"
 />
 );
};

export default function NoiseDiether({
 overlayColor ='bg-[#1825AA]/30',
 wrapperClassName ='h-screen w-screen',
 imageSrc ='/assets/gradient/image12.png',
 shaderConfig = {
 pixelSize: .5,
 patternDensity: 1,
 fluidRadius: 0.08,
 fluidStrength: .2,
 fluidDissipation: 0.9,
 distortStrength: 0.5,
 trailDarkness: 0
 }
}) {
 const { pixelSize, patternDensity, fluidRadius, fluidStrength, fluidDissipation, distortStrength, trailDarkness } = shaderConfig;
 return (
 <div className={`${wrapperClassName} relative`}>

  <img
 src={imageSrc}
 alt="Background"
 className='brightness-100'
 style={{
 position:'absolute',
 inset: 0,
 width:'100%',
 height:'100%',
 objectFit:'cover',
 zIndex: 0
 }}
 />
 <div className={`h-full w-full ${overlayColor} absolute inset-0`} />
 <NoiseDietherShader
 // imageSrc={imageSrc}
 noiseColor="#1825AA"
 style={{ width:'100%', height:'100%', position:'relative', zIndex: 1 }}
 pixelSize={pixelSize}
 patternDensity={patternDensity}
 fluidRadius={fluidRadius}
 fluidStrength={fluidStrength}
 fluidDissipation={fluidDissipation}
 distortStrength={distortStrength}
 trailDarkness={trailDarkness}
 />
 </div>
 );
}