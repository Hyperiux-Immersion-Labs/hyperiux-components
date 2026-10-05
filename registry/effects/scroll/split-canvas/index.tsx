// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import { useEffect, useRef, type RefObject, useSyncExternalStore } from "react";
import * as THREE from "three";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export const sections = [
  {
    number: '01',
    title: 'Design that feels alive',
    description:
      'Every component in Hyperiux Vault is built to react, transition, and guide attention naturally-making interfaces feel intentional instead of static.',
  },

  {
    number: '02',
    title: 'Motion with meaning',
    description:
      'Animations should explain, not distract. Interactions are designed to create clarity, rhythm, and confidence across every screen.',
  },

  {
    number: '03',
    title: 'Built for shipping',
    description:
      'Reusable structures, clean APIs, and production-ready patterns help ideas move from prototype to launch without rebuilding everything.',
  },

  {
    number: '04',
    title: 'Expressive by default',
    description:
      'Create visual identity through layout, typography, transitions, and composition-without sacrificing usability or performance.',
  },

  {
    number: '05',
    title: 'Human over interface',
    description:
      'Technology disappears when experiences feel effortless. The goal is simple: make products people enjoy returning to.',
  },
];

export const imageSources = [
'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/pixelated-image/banana.png',
'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/pixelated-image/cherry.png',
'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/pixelated-image/mango.png',
'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/pixelated-image/pineapple.png',
'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/pixelated-image/watermelon.png',
];

export const PixelTransitionVertex = `
 varying vec2 vUv;

 void main() {
 vUv = uv;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
`;

export const PixelTransitionFragment = `
 uniform sampler2D u_texture1;
 uniform sampler2D u_texture2;
 uniform float u_progress;
 uniform float u_numSlices;
 uniform vec2 u_resolution;
 uniform float u_gridSize;
 uniform float u_reducedMotion;

 varying vec2 vUv;

 vec2 getPixelatedUv(vec2 uv, vec2 resolution, float gridSize) {
 vec2 gridCount = max(floor(resolution / gridSize), vec2(1.0));
 vec2 cellSize = resolution / gridCount;
 vec2 pixelPos = uv * resolution;
 vec2 cellIndex = floor(pixelPos / cellSize);
 vec2 cellCenter = (cellIndex + 0.5) * cellSize;

 return cellCenter / resolution;
 }

 // Draw grid lines only (transparent background)
 float drawGridLines(vec2 uv, vec2 resolution, float gridSize) {
 vec2 gridCount = max(floor(resolution / gridSize), vec2(1.0));
 vec2 cellSize = resolution / gridCount;
 vec2 pixelPos = uv * resolution;
 float lineWidth = 1.0;

 // Vertical and horizontal lines
 float vLine = step(mod(pixelPos.x, cellSize.x), lineWidth);
 float hLine = step(mod(pixelPos.y, cellSize.y), lineWidth);

 return max(vLine, hLine);
 }

 void main() {
 vec2 uv = vUv;
 vec2 pixelatedUv = getPixelatedUv(uv, u_resolution, u_gridSize);

 // Grid lines (just the lines, transparent elsewhere)
 float gridLine = drawGridLines(uv, u_resolution, u_gridSize);
 vec4 gridColor = vec4(0.0, 0.0, 0.0, gridLine * 0.15); // Semi-transparent black lines

 vec4 texColor;

 if (u_reducedMotion > 0.5) {
 // Reduced motion: plain crossfade, no pixelation/slice-blind motion.
 vec4 tex1 = texture2D(u_texture1, uv);
 vec4 tex2 = texture2D(u_texture2, uv);
 texColor = mix(tex1, tex2, u_progress);
 } else {
 // Number of horizontal slices (blinds)
 float slices = u_numSlices;
 float sliceIndex = floor(uv.y * slices);
 float sliceNorm = sliceIndex / slices;
 float sliceHeight = 1.0 / slices;
 float posInSlice = fract(uv.y * slices);

 // Bottom slices transition first
 float sliceDelay = sliceNorm * 0.6;
 float sliceProgress = smoothstep(sliceDelay, sliceDelay + 0.4, u_progress);

 // Blind collapse effect
 float blindScale = 1.0 - sliceProgress;
 float visibleThreshold = 1.0 - blindScale;

 // Determine which texture to show based on blind position
 if (posInSlice < visibleThreshold) {
 // Collapsed part - show texture2
 texColor = texture2D(u_texture2, pixelatedUv);
 } else {
 // Visible part - show texture1 with slide offset
 vec2 adjustedUV = uv;
 float slideOffset = visibleThreshold * sliceHeight;
 adjustedUV.y = clamp(uv.y - slideOffset, 0.0, 1.0);
 texColor = texture2D(u_texture1, getPixelatedUv(adjustedUV, u_resolution, u_gridSize));
 }
 }

 // Composite: transparent background + grid lines + image
 // Start with grid on transparent background
 vec4 result = gridColor;

 // Blend image on top (image alpha determines visibility)
 result = vec4(
 mix(result.rgb, texColor.rgb, texColor.a),
 max(result.a, texColor.a)
 );

 gl_FragColor = result;
 }
`;

const DEFAULT_ROOT_MARGIN = "256px";

type RafRoot = Element | null | { current: Element | null } | (() => Element | null);

function resolveElement(root: RafRoot): Element | null {
  if (!root) return null;
  if (typeof root === "function") return root() ?? null;
  if (typeof root === "object" && "current" in root) return root.current ?? null;
  return root;
}

interface VisibilityGateOptions {
  root?: RafRoot;
  rootMargin?: string;
  threshold?: number;
  observeTab?: boolean;
  observeOffscreen?: boolean;
  onChange?: (active: boolean) => void;
}

interface VisibilityGate {
  readonly isActive: boolean;
  observe: (nextRoot?: RafRoot) => void;
  destroy: () => void;
}

function createVisibilityGate({
  root = null,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = 0,
  observeTab = true,
  observeOffscreen = true,
  onChange,
}: VisibilityGateOptions = {}): VisibilityGate {
  let tabVisible =
    typeof document === "undefined" ? true : !document.hidden;
  // Match border-beam: assume onscreen until the observer reports otherwise.
  let onscreen = true;
  let destroyed = false;
  let observer: IntersectionObserver | null = null;

  const isActive = () => {
    if (destroyed) return false;
    if (observeTab && !tabVisible) return false;
    if (observeOffscreen && resolveElement(root) && !onscreen) return false;
    return true;
  };

  let lastActive = isActive();

  const emit = () => {
    if (destroyed) return;
    const next = isActive();
    if (next === lastActive) return;
    lastActive = next;
    onChange?.(next);
  };

  const onVisibilityChange = () => {
    tabVisible = !document.hidden;
    emit();
  };

  if (observeTab && typeof document !== "undefined") {
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  const bindObserver = () => {
    if (!observeOffscreen || typeof IntersectionObserver === "undefined") {
      return;
    }

    const el = resolveElement(root);
    if (!el) return;

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onscreen = entry.isIntersecting;
        }
        emit();
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
  };

  bindObserver();

  return {
    /** Whether the animation should currently run. */
    get isActive() {
      return isActive();
    },

    /**
     * Re-bind IntersectionObserver after the root element mounts late
     * (e.g. ref not ready on first call). Safe to call multiple times.
     */
    observe(nextRoot?: RafRoot) {
      if (destroyed) return;
      if (nextRoot != null) root = nextRoot;
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      onscreen = true;
      bindObserver();
      emit();
    },

    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (observeTab && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    },
  };
}

interface SuspendedRafOptions {
  onFrame: (time: number) => void;
  root?: RafRoot;
  rootMargin?: string;
  threshold?: number;
  observeTab?: boolean;
  observeOffscreen?: boolean;
}

interface SuspendedRaf {
  start: () => void;
  stop: () => void;
  readonly isRunning: boolean;
  readonly isActive: boolean;
  observe: (nextRoot?: RafRoot) => void;
  destroy: () => void;
}

/**
 * Owns a requestAnimationFrame loop that auto-pauses when the tab is hidden
 * or the root element is offscreen.
 */
function createSuspendedRaf({
  onFrame,
  root = null,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = 0,
  observeTab = true,
  observeOffscreen = true,
}: SuspendedRafOptions): SuspendedRaf {
  if (typeof onFrame !== "function") {
    throw new TypeError("createSuspendedRaf: onFrame is required");
  }

  let rafId: number | null = null;
  let running = false;
  let destroyed = false;

  const stopRaf = () => {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const tick = (time: number) => {
    rafId = null;
    if (destroyed || !running || !gate.isActive) return;
    onFrame(time);
    if (!destroyed && running && gate.isActive) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const sync = () => {
    if (destroyed) return;
    if (running && gate.isActive) {
      if (rafId == null) {
        rafId = requestAnimationFrame(tick);
      }
    } else {
      stopRaf();
    }
  };

  const gate = createVisibilityGate({
    root,
    rootMargin,
    threshold,
    observeTab,
    observeOffscreen,
    onChange: sync,
  });

  return {
    /** Start (or resume) the loop when visibility allows. */
    start() {
      if (destroyed) return;
      running = true;
      sync();
    },

    /** Stop requesting frames (visibility listeners stay attached until destroy). */
    stop() {
      running = false;
      stopRaf();
    },

    /** Whether the caller has started the loop (may still be paused by visibility). */
    get isRunning() {
      return running;
    },

    /** Whether a frame is currently allowed to schedule. */
    get isActive() {
      return gate.isActive;
    },

    /** Re-attach offscreen observer to a (new) root element. */
    observe(nextRoot?: RafRoot) {
      gate.observe(nextRoot);
      sync();
    },

    /** Tear down listeners and cancel any pending frame. */
    destroy() {
      if (destroyed) return;
      destroyed = true;
      running = false;
      stopRaf();
      gate.destroy();
    },
  };
}

export {
  createSuspendedRaf,
  createVisibilityGate,
  DEFAULT_ROOT_MARGIN,
};

gsap.registerPlugin(ScrollTrigger);

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

function SplitCanvasComp({
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
//  ScrollTrigger.getAll().forEach(t => t.kill());
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
 className="max-sm:-translate-y-20 border-r border-t border-black/20"
 />
 );
}

interface SplitCanvasProps {
    bgColor?: string;
    gridSize?: number;
    numSlices?: number;
    canvasSize?: number;
}
export default function SplitCanvas({
    bgColor = "#F5F5F0",
    gridSize = 16,
    numSlices = 32,
    canvasSize = 599,
}: SplitCanvasProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    return (
        <ReactLenis root options={{ autoRaf: true, duration: 1.5 }}>
            <main className="min-h-screen text-black" style={{ backgroundColor: bgColor }}>
                <div
                    ref={wrapperRef}
                    className="relative"
                    style={{ height: `${sections.length * 100}vh` }}
                >
                    {/* Fixed Canvas Container - higher z-index to be visible */}
                    <div className="sticky top-0 overflow-hidden h-screen w-full flex items-center justify-center z-30 max-md:items-center">
                        <SplitCanvasComp
                            wrapperRef={wrapperRef}
                            gridSize={gridSize}
                            numSlices={numSlices}
                            canvasSize={canvasSize}
                        />
                    </div>

                    {/* Content Sections */}
                    <div className="absolute inset-0 z-30 pointer-events-none px-10 max-[1025px]:px-6 ">
                        {sections.map((section, i) => (
                            <div
                                key={i}
                                className="h-screen flex py-24 max-md:py-10 border-t border-black/40 max-[1025px]:pb-20 max-md:pb-20 "
                            >
                                <div className="w-full h-full mx-auto px-16 max-[1025px]:px-0 max-md:px-0 flex flex-row justify-between items-start max-md:flex-col max-md:justify-end max-md:items-center pb-0 max-md:pb-0">
                                    {/* Left Column - Number & Title */}
                                    <div className="w-80 shrink-0 flex flex-col items-start text-left max-[1025px]:w-[40%] max-md:w-full max-md:items-center max-md:text-center">
                                        <span className="text-[1.5vw] tracking-wider text-black/40 block mb-2 max-[1025px]:text-[3vw] max-md:text-[5vw]">
                                            {section.number}
                                        </span>
                                        <h2
                                            className="text-[3.5vw] max-[1025px]:text-[7vw] max-md:text-[9vw] leading-[1.05] font-normal"
                                            style={{ fontFamily: '"Times New Roman", Georgia, serif' }}
                                        >
                                            {section.title}
                                        </h2>
                                        {/* Mobile Description */}
                                        <p className="hidden max-md:block mt-4 text-[1.2vw] leading-[1.2] max-[1025px]:text-[2.5vw] max-md:text-[4.2vw] text-black/60 max-w-70">
                                            {section.description}
                                        </p>
                                    </div>

                                    {/* Center - Space for Canvas (482px) */}
                                    <div className="w-125 shrink-0 max-[1025px]:hidden" />

                                    {/* Right Column - Description */}
                                    <div className="w-70 shrink-0 mt-auto max-[1025px]:w-[50%] max-md:hidden">
                                        <p className="text-[1.2vw] leading-[1.2] max-[1025px]:text-[2.5vw] max-md:text-[3vw]   text-black/60 text-right">
                                            {section.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom divider */}
                <div className="w-full h-px bg-black/10" />
            </main>
        </ReactLenis>
    );
}
