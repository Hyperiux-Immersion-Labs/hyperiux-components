'use client';

import { useEffect, useRef, type RefObject } from'react';
import * as THREE from'three';
import gsap from'gsap';
import { ScrollTrigger } from'gsap/ScrollTrigger';
import { PixelTransitionFragment, PixelTransitionVertex } from './pixel-transition';
import { imageSources } from './content';
import { createSuspendedRaf } from './createSuspendedRaf';

gsap.registerPlugin(ScrollTrigger);

// True when the user has asked the OS to minimise animation. Safe to call
// during render - returns false on the server.
function prefersReducedMotion() {
 if (typeof window === 'undefined') return false;
 return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

// Load SVG as image and render to canvas for proper texture
const loadSvgAsCanvas = (src: string, size: number): Promise<HTMLCanvasElement> => {
 return new Promise((resolve, reject) => {
 const img = new Image();
 img.crossOrigin ='anonymous';

 img.onload = () => {
 const canvas = document.createElement('canvas');
 canvas.width = size;
 canvas.height = size;
 const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

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

interface PixelScrollCanvasProps {
 wrapperRef: RefObject<HTMLElement | null>;
 gridSize?: number;
 numSlices?: number;
 canvasSize?: number;
}

export default function PixelScrollCanvas({
 wrapperRef,
 gridSize = 16,
 numSlices = 32,
 canvasSize: canvasSizeProp = 599,
}: PixelScrollCanvasProps) {
 const containerRef = useRef<HTMLDivElement | null>(null);
 const hasInit = useRef(false);

 useEffect(() => {
 const container = containerRef.current;
 const wrapper = wrapperRef?.current;
 if (!container || !wrapper) return;
 if (hasInit.current) return;
 hasInit.current = true;

 let renderer: any;
 let scene: any;
 let camera: any;
 let mesh: any;
 let material: any;
 let textures: THREE.CanvasTexture[] = [];
 let isMounted = true;
 let loop: ReturnType<typeof createSuspendedRaf> | null = null;

 const getCanvasSize = () => {
 if (typeof window === 'undefined') return canvasSizeProp;
 const ratio = canvasSizeProp / 599;
 if (window.innerWidth < 640) return Math.round(320 * ratio);
 if (window.innerWidth < 768) return Math.round(420 * ratio);
 return canvasSizeProp;
 };

 const canvasSize = getCanvasSize();
 const reducedMotion = prefersReducedMotion();
 const init = (canvasTextures: THREE.CanvasTexture[]) => {
 if (!isMounted || !container) return;

 textures = canvasTextures;

 container.style.width = `${canvasSize}px`;
 container.style.height = `${canvasSize}px`;

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
 u_gridSize: { value: gridSize }, // Grid cell size in pixels
 u_reducedMotion: { value: reducedMotion ? 1 : 0 },
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

 ScrollTrigger.create({
 trigger: wrapper,
 start:'top top',
 end:'bottom bottom',
 scrub: true,
 onUpdate: (self) => {
 // Use the actual rendered canvas position so transitions stay aligned
 // even when breakpoint styles shift the canvas up or down.
 const canvasRect = container.getBoundingClientRect();
 const canvasTop = canvasRect.top;
 const canvasBottom = canvasRect.bottom;
 const canvasHeight = canvasRect.height || canvasSize;

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
 transitionProgress = (canvasBottom - borderPos) / canvasHeight;
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

 const loopInstance = createSuspendedRaf({
 root: container,
 onFrame: () => {
 if (!isMounted) return;
 renderer.render(scene, camera);
 },
 });
 loop = loopInstance;
 loop.start();
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
 texture.minFilter = THREE.NearestFilter;
 texture.magFilter = THREE.NearestFilter;
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
 if (loop) {
 loop.destroy();
 loop = null;
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
 }, [wrapperRef, gridSize, numSlices, canvasSizeProp]);

 return (
 <div
 ref={containerRef}
 className="max-md:-translate-y-20 border-r border-t border-black/20"
 />
 );
}
