'use client';

import { useEffect, useRef } from'react';
import * as THREE from'three';
import gsap from'gsap';
import { ScrollTrigger } from'gsap/ScrollTrigger';
import { PixelTransitionVertex, PixelTransitionFragment } from'./shaders/pixelTransition';
import { imageSources } from'./content';

gsap.registerPlugin(ScrollTrigger);

// Load SVG as image and render to canvas for proper texture
const loadSvgAsCanvas = (src, size) => {
 return new Promise((resolve, reject) => {
 const img = new Image();
 img.crossOrigin ='anonymous';

 img.onload = () => {
 const canvas = document.createElement('canvas');
 canvas.width = size;
 canvas.height = size;
 const ctx = canvas.getContext('2d');

 // Keep transparent background - grid is drawn in shader
 ctx.clearRect(0, 0, size, size);

 // Draw the SVG image
 ctx.drawImage(img, 0, 0, size, size);

 resolve(canvas);
 };

 img.onerror = reject;
 img.src = src;
 });
};

export default function PixelScrollCanvas({ wrapperRef }) {
 const containerRef = useRef(null);
 const hasInit = useRef(false);

 useEffect(() => {
 const container = containerRef.current;
 const wrapper = wrapperRef?.current;
 if (!container || !wrapper) return;
 if (hasInit.current) return;
 hasInit.current = true;

 let renderer, scene, camera, mesh, material;
 let textures = [];
 let isMounted = true;
 let animationId;

 const canvasSize = 599;
 const numSlices = 32;

 const init = (canvasTextures) => {
 if (!isMounted || !container) return;

 textures = canvasTextures;

 renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
 renderer.setSize(canvasSize, canvasSize);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 renderer.setClearColor(0x000000, 0); // Transparent background

 container.innerHTML ='';
 container.appendChild(renderer.domElement);

 scene = new THREE.Scene();

 camera = new THREE.OrthographicCamera(
 -canvasSize / 2, canvasSize / 2,
 canvasSize / 2, -canvasSize / 2,
 -1, 1
 );

 const geometry = new THREE.PlaneGeometry(canvasSize, canvasSize);

 material = new THREE.ShaderMaterial({
 uniforms: {
 u_texture1: { value: textures[0] },
 u_texture2: { value: textures[1] || textures[0] },
 u_progress: { value: 0 },
 u_numSlices: { value: numSlices },
 u_resolution: { value: new THREE.Vector2(canvasSize, canvasSize) },
 u_gridSize: { value: 15.0 }, // Grid cell size in pixels
 },
 vertexShader: PixelTransitionVertex,
 fragmentShader: PixelTransitionFragment,
 transparent: true,
 });

 mesh = new THREE.Mesh(geometry, material);
 scene.add(mesh);

 // Each section is 100vh, canvas is canvasSize pixels
 // Transition happens when section border passes through canvas
 // Border enters at bottom of canvas, exits at top

 const numSections = imageSources.length;
 const viewportHeight = window.innerHeight;
 const sectionHeight = viewportHeight; // 100vh per section

 // Canvas is centered, so:
 // - Bottom of canvas is at viewport center + canvasSize/2
 // - Top of canvas is at viewport center - canvasSize/2
 const canvasTop = (viewportHeight - canvasSize) / 2;
 const canvasBottom = canvasTop + canvasSize;

 ScrollTrigger.create({
 trigger: wrapper,
 start:'top top',
 end:'bottom bottom',
 scrub: true,
 onUpdate: (self) => {
 // Current scroll position within wrapper (in pixels)
 const wrapperHeight = wrapper.offsetHeight;
 const scrolled = self.progress * (wrapperHeight - viewportHeight);

 // For each section border (at section * sectionHeight from wrapper top):
 // The border is at position (sectionIndex * sectionHeight - scrolled) from viewport top
 // Transition starts when border reaches canvasBottom
 // Transition ends when border reaches canvasTop

 let currentTransition = 0;
 let transitionProgress = 0;

 for (let i = 1; i < numSections; i++) {
 // Border position relative to viewport top
 const borderPos = i * sectionHeight - scrolled;

 // Check if this border is currently passing through the canvas
 if (borderPos <= canvasBottom && borderPos >= canvasTop) {
 currentTransition = i - 1;
 // Progress: 0 when border at canvasBottom, 1 when border at canvasTop
 transitionProgress = (canvasBottom - borderPos) / canvasSize;
 break;
 } else if (borderPos < canvasTop) {
 // Border has passed above canvas, this transition is complete
 currentTransition = i - 1;
 transitionProgress = 1;
 }
 }

 // Clamp values
 currentTransition = Math.max(0, Math.min(currentTransition, textures.length - 2));
 transitionProgress = Math.max(0, Math.min(1, transitionProgress));

 // Determine which textures to show
 const fromIndex = currentTransition;
 const toIndex = Math.min(currentTransition + 1, textures.length - 1);

 // If transition is complete, show the"to" texture as the base
 if (transitionProgress >= 1) {
 material.uniforms.u_texture1.value = textures[toIndex];
 material.uniforms.u_texture2.value = textures[Math.min(toIndex + 1, textures.length - 1)];
 material.uniforms.u_progress.value = 0;
 } else {
 material.uniforms.u_texture1.value = textures[fromIndex];
 material.uniforms.u_texture2.value = textures[toIndex];
 material.uniforms.u_progress.value = transitionProgress;
 }
 },
 });

 const render = () => {
 if (!isMounted) return;
 renderer.render(scene, camera);
 animationId = requestAnimationFrame(render);
 };

 render();
 };

 // Load all SVGs as canvases, then create textures
 const loadAllImages = async () => {
 try {
 const canvases = await Promise.all(
 imageSources.map(src => loadSvgAsCanvas(src, canvasSize))
 );

 const canvasTextures = canvases.map(canvas => {
 const texture = new THREE.CanvasTexture(canvas);
 texture.needsUpdate = true;
 texture.minFilter = THREE.LinearFilter;
 texture.magFilter = THREE.LinearFilter;
 return texture;
 });

 init(canvasTextures);
 } catch (error) {
 console.error('Error loading images:', error);
 }
 };

 loadAllImages();

 return () => {
 isMounted = false;
 hasInit.current = false;
 if (animationId) {
 cancelAnimationFrame(animationId);
 }
 ScrollTrigger.getAll().forEach(t => t.kill());
 if (renderer) {
 renderer.dispose();
 renderer.forceContextLoss();
 }
 textures.forEach(t => t?.dispose());
 if (container) {
 container.innerHTML ='';
 }
 };
 }, [wrapperRef]);

 return (
 <div
 ref={containerRef}
 className="w-150 h-150 border-r border-t border-black/20"
 />
 );
}
