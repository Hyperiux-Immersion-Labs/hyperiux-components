"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D u_texture1;
  uniform sampler2D u_texture2;
  uniform float u_progress;
  uniform float u_numSlices;
  uniform vec2 u_resolution;
  uniform float u_gridSize;
  varying vec2 vUv;

  float drawGridLines(vec2 uv, vec2 resolution, float gridSize) {
    vec2 pixelPos = uv * resolution;
    float lineWidth = 1.0;
    float vLine = step(mod(pixelPos.x, gridSize), lineWidth);
    float hLine = step(mod(pixelPos.y, gridSize), lineWidth);
    return max(vLine, hLine);
  }

  void main() {
    vec2 uv = vUv;
    float gridLine = drawGridLines(uv, u_resolution, u_gridSize);
    vec4 gridColor = vec4(0.0, 0.0, 0.0, gridLine * 0.15);
    float slices = u_numSlices;
    float sliceIndex = floor(uv.y * slices);
    float sliceNorm = sliceIndex / slices;
    float sliceHeight = 1.0 / slices;
    float posInSlice = fract(uv.y * slices);
    float sliceDelay = sliceNorm * 0.6;
    float sliceProgress = smoothstep(sliceDelay, sliceDelay + 0.4, u_progress);
    float blindScale = 1.0 - sliceProgress;
    float visibleThreshold = 1.0 - blindScale;
    vec4 texColor;
    if (posInSlice < visibleThreshold) {
      texColor = texture2D(u_texture2, uv);
    } else {
      vec2 adjustedUV = uv;
      float slideOffset = visibleThreshold * sliceHeight;
      adjustedUV.y = clamp(uv.y - slideOffset, 0.0, 1.0);
      texColor = texture2D(u_texture1, adjustedUV);
    }
    vec4 result = gridColor;
    result = vec4(mix(result.rgb, texColor.rgb, texColor.a), max(result.a, texColor.a));
    gl_FragColor = result;
  }
`;

export function SplitCanvas({
  imageSources = [],
  sections = [],
  title = "Approach",
  subtitle = "{ Five principles in the age of AI }",
  className = "",
}) {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const hasInit = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper || hasInit.current) return;
    hasInit.current = true;

    let renderer;
    let scene;
    let camera;
    let material;
    let textures = [];
    let animationId;
    let mounted = true;

    const canvasSize = 599;
    const numSlices = 32;

    const loadSvgAsCanvas = (src, size) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas);
        };
        img.onerror = reject;
        img.src = src;
      });

    const init = (canvasTextures) => {
      if (!mounted || !container) return;

      textures = canvasTextures;
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(canvasSize, canvasSize);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      container.innerHTML = "";
      container.appendChild(renderer.domElement);
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-canvasSize / 2, canvasSize / 2, canvasSize / 2, -canvasSize / 2, -1, 1);

      const geometry = new THREE.PlaneGeometry(canvasSize, canvasSize);
      material = new THREE.ShaderMaterial({
        uniforms: {
          u_texture1: { value: textures[0] },
          u_texture2: { value: textures[1] || textures[0] },
          u_progress: { value: 0 },
          u_numSlices: { value: numSlices },
          u_resolution: { value: new THREE.Vector2(canvasSize, canvasSize) },
          u_gridSize: { value: 15.0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      });

      scene.add(new THREE.Mesh(geometry, material));

      const numSections = imageSources.length;
      const viewportHeight = window.innerHeight;
      const sectionHeight = viewportHeight;
      const canvasTop = (viewportHeight - canvasSize) / 2;
      const canvasBottom = canvasTop + canvasSize;

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const wrapperHeight = wrapper.offsetHeight;
          const scrolled = self.progress * (wrapperHeight - viewportHeight);
          let currentTransition = 0;
          let transitionProgress = 0;

          for (let i = 1; i < numSections; i++) {
            const borderPos = i * sectionHeight - scrolled;
            if (borderPos <= canvasBottom && borderPos >= canvasTop) {
              currentTransition = i - 1;
              transitionProgress = (canvasBottom - borderPos) / canvasSize;
              break;
            } else if (borderPos < canvasTop) {
              currentTransition = i - 1;
              transitionProgress = 1;
            }
          }

          currentTransition = Math.max(0, Math.min(currentTransition, textures.length - 2));
          transitionProgress = Math.max(0, Math.min(1, transitionProgress));
          const fromIndex = currentTransition;
          const toIndex = Math.min(currentTransition + 1, textures.length - 1);

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
        if (!mounted) return;
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(render);
      };
      render();
    };

    Promise.all(
      imageSources.map((src) => loadSvgAsCanvas(src, canvasSize))
    )
      .then((canvases) =>
        canvases.map((canvas) => {
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          return texture;
        })
      )
      .then(init)
      .catch((error) => console.error("SplitCanvas image load error:", error));

    return () => {
      mounted = false;
      hasInit.current = false;
      if (animationId) cancelAnimationFrame(animationId);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      textures.forEach((texture) => texture?.dispose());
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
      if (container) container.innerHTML = "";
    };
  }, [imageSources]);

  return (
    <main className={`min-h-screen bg-[#F5F5F0] text-black ${className}`}>
      <section className="relative flex h-screen flex-col items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-black" />
          <h1 className="text-[64px] font-normal tracking-[-0.02em] md:text-[72px]">{title}</h1>
        </div>
        <p className="mt-2 text-sm text-black/50 md:text-base">{subtitle}</p>
      </section>

      <div ref={wrapperRef} className="relative" style={{ height: `${sections.length * 100}vh` }}>
        <div className="sticky top-0 z-30 flex h-screen w-full items-center justify-center">
          <div ref={containerRef} className="h-150 w-150 border-t border-r border-black/20" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-30 px-10">
          {sections.map((section, index) => (
            <div key={index} className="flex h-screen border-t border-black/40 py-24">
              <div className="mx-auto flex w-full items-start justify-between px-8 md:px-12 lg:px-16">
                <div className="w-70 shrink-0 md:w-80">
                  <span className="mb-2 block text-[11px] tracking-wider text-black/40">{section.number}</span>
                  <h2 className="text-[32px] font-normal leading-[1.05] md:text-[40px] lg:text-[44px]">{section.title}</h2>
                </div>
                <div className="hidden w-125 shrink-0 lg:block" />
                <div className="mt-auto hidden w-60 shrink-0 md:block md:w-70">
                  <p className="text-right text-[13px] leading-[1.7] text-black/60 md:text-[14px]">{section.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-px w-full bg-black/10" />
    </main>
  );
}

export default SplitCanvas;
