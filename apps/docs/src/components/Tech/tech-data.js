// Core Technologies Data (React, Next.js, GSAP, Three.js, WebGL/TSL, Lenis)
export const TECHNOLOGIES = [
  {
    slug: "react",
    name: "React",
    title: "React Effects",
    subtitle: "React animation components",
    color: "#61dafb",
    bgClass: "from-[#61dafb]/15 to-[#61dafb]/2",
    glowClass: "group-hover:border-[#61dafb]/40 group-hover:shadow-[#61dafb]/5",
    tagline: "Elevate your React components with declarative motion and modular hooks.",
    description: "Supercharge your React application lifecycle. modular animation components built specifically for modern React concurrent states, and clean hook integrations.",
    whyText: "In dynamic React apps, state updates can easily disrupt running animations. Hyperiux addresses this by anchoring timelines inside safe React hook boundaries. By using useRef to maintain references without triggering extra renders, and integrating robust mount triggers, our animations sync perfectly with the component tree.",
    installCmd: "npx hyperiux init",
    exampleCode: `import { BlurText } from "@/components/effects/BlurText";

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <BlurText delay={0.2} duration={0.8} blur={15}>
        Declarative React Motion
      </BlurText>
    </div>
  );
}`
  },
  {
    slug: "nextjs",
    name: "Next.js",
    title: "Next.js Effects",
    subtitle: "Next.js animation components",
    color: "#ffffff",
    bgClass: "from-white/10 to-white/2",
    glowClass: "group-hover:border-white/40 group-hover:shadow-white/5",
    tagline: "Unify server-side performance with high-end client interactivity.",
    description: "Engineered specifically for Next.js App Router and Server Components. Fast, hydration-safe dynamic loads and zero layout transitions.",
    whyText: "Integrating rich WebGL layouts with Next.js Server Components and strict hydration rules is complex. Hyperiux is engineered to be fully hydration-safe. We isolate client animations under client boundaries while delivering core static content from the server, achieving instant loads and SEO indexability.",
    installCmd: "npx hyperiux init",
    exampleCode: `"use client";
import dynamic from "next/dynamic";

// Dynamically import WebGL elements to minimize initial script loads
const InertiaScrollEffect = dynamic(
  () => import("@/components/effects/InertiaScrollEffect"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <InertiaScrollEffect />
    </main>
  );
}`
  },
  {
    slug: "gsap",
    name: "GSAP",
    title: "GSAP Effects",
    subtitle: "GSAP React components",
    color: "#88ce02",
    bgClass: "from-[#88ce02]/15 to-[#88ce02]/2",
    glowClass: "group-hover:border-[#88ce02]/40 group-hover:shadow-[#88ce02]/5",
    tagline: "Elite timeline animation controls with safe automatic memory cleanup.",
    description: "High-performance timeline interpolation. Safe hardware-accelerated animations leveraging GSAP's powerful ScrollTrigger, physics, and custom stagger systems.",
    whyText: "GSAP is the standard for web animations, but dynamic react renders can cause memory leaks and layout jumps. Hyperiux wraps all ScrollTriggers and timelines inside secure component contexts. When components unmount, all GSAP instances are reverted automatically, ensuring 60FPS fluid motion safely.",
    installCmd: "npx hyperiux add draggable-marquee",
    exampleCode: `"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal() {
  const container = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".element", {
        scrollTrigger: { trigger: container.current, scrub: true },
        opacity: 0,
        y: 50
      });
    }, container);
    return () => ctx.revert(); // Automatic memory safe cleanup
  }, []);

  return <div ref={container} className="element">Scroll Interactivity</div>;
}`
  },
  {
    slug: "threejs",
    name: "Three.js",
    title: "Three.js Effects",
    subtitle: "Three.js website effects",
    color: "#ff003c",
    bgClass: "from-[#ff003c]/15 to-[#ff003c]/2",
    glowClass: "group-hover:border-[#ff003c]/40 group-hover:shadow-[#ff003c]/5",
    tagline: "Immersive WebGL rendering, custom mesh matrices, and spatial lights.",
    description: "Construct bespoke 3D canvases on the web. Render high-polygon custom meshes, perspective camera paths, directional shadows, and complex textures.",
    whyText: "HTML is CPU-bound. Hyperiux Three.js elements run dedicated WebGL context pipelines, executing matrix updates, shadows, and textures directly on the GPU. We manage asset loading, screen resize listeners, and loop execution hooks, giving you stable performance even with complex mesh scenes.",
    installCmd: "npx hyperiux add ProgressiveBloomValley",
    exampleCode: `import * as THREE from "three";

export function initMesh(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0xff003c, wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  
  camera.position.z = 5;
  const loop = () => {
    requestAnimationFrame(loop);
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  };
  loop();
}`
  },
  {
    slug: "webgl",
    name: "WebGL / TSL",
    title: "WebGL & TSL Effects",
    subtitle: "WebGL website effects",
    color: "#06b6d4",
    bgClass: "from-[#06b6d4]/15 to-[#06b6d4]/2",
    glowClass: "group-hover:border-[#06b6d4]/40 group-hover:shadow-[#06b6d4]/5",
    tagline: "Unleash GPU raw mathematical models for custom shader animations and TSL matrices.",
    description: "High-end custom shader computations. Implement liquid refraction glass effects, coordinate displacement grids, noise ripples, and custom Three.js Shading Language scripts.",
    whyText: "WebGL lets you bypass high-level browser layout rendering completely. Hyperiux compiles fragment and vertex GLSL / TSL shaders directly on GPU channels. This lets you calculate texture coordinates, ripples, and lens distortions dynamically at locked 60FPS on any responsive viewport.",
    installCmd: "npx hyperiux add liquid-glass-cursor",
    exampleCode: `// GLSL Fragment Shader Liquid Ripple calculations
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
varying vec2 v_uv;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float d = distance(st, u_mouse);
  float ripple = sin(d * 12.0 - u_time * 3.5) * 0.03;
  gl_FragColor = vec4(st.x, st.y, 0.5 + ripple, 1.0);
}`
  },
  {
    slug: "lenis",
    name: "Lenis",
    title: "Lenis Scroll Effects",
    subtitle: "Lenis scroll effects",
    color: "#FF98A2",
    bgClass: "from-[#FF98A2]/15 to-[#FF98A2]/2",
    glowClass: "group-hover:border-[#FF98A2]/40 group-hover:shadow-[#FF98A2]/5",
    tagline: "Physics-based continuous inertial scrolling and synchronization.",
    description: "Silky, physics-based scroll normalization. Sync wheel, touchpad, and mobile touch inputs smoothly with dynamic layout boundaries and GSAP ScrollTriggers.",
    whyText: "Unsmooth default browser scrolling ruins complex layout reveals and timelines. Hyperiux incorporates Lenis to normalize scroll events, smoothing vertical paths with physics eases on requestAnimationFrame to guarantee high-fidelity scroll triggered animations look perfect across all devices.",
    installCmd: "npx hyperiux add inertia-scroll-effect",
    exampleCode: `"use client";
import { ReactLenis } from "lenis/react";

export default function Layout({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <main className="min-h-screen bg-black text-white">
        {children}
      </main>
    </ReactLenis>
  );
}`
  }
];

export function getCountForTech(techSlug, items) {
  switch (techSlug) {
    case "react":
      return items.length;
    case "nextjs":
      return items.filter(item => 
        item.dependencies?.includes("next") || 
        item.dependencies?.includes("next-transition-router") ||
        item.previewUrl?.includes("page-transitions")
      ).length;
    case "gsap":
      return items.filter(item => item.dependencies?.includes("gsap")).length;
    case "threejs":
      return items.filter(item => item.dependencies?.includes("three")).length;
    case "webgl":
      return items.filter(item => 
        item.category === "webgl" || 
        item.dependencies?.includes("three") || 
        item.dependencies?.includes("@react-three/fiber")
      ).length;
    case "lenis":
      return items.filter(item => item.dependencies?.includes("lenis")).length;
    default:
      return 0;
  }
}
