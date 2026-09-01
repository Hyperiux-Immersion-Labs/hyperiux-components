// Built using Hyperiux Vault: https://vault.hyperiux.com

'use client';

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createSuspendedRaf } from "./createSuspendedRaf";

const DEFAULT_IMAGE_SRC = "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/h-13.jpg";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

const vertexShader = `
 varying vec2 vUv;
 void main() {
 vUv = uv;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
`;

const fragmentShader = `
 uniform sampler2D uTexture;
 uniform vec2 uResolution;
 uniform vec2 uTextureSize;
 uniform vec2 uMouse;
 uniform float uParallaxStrength;
 uniform float uDistortionMultiplier;
 uniform float uGlassStrength;
 uniform float uStripesFrequency;
 uniform float uGlassSmoothness;
 uniform float uEdgePadding;

 varying vec2 vUv;

 vec2 getCoverUV(vec2 uv, vec2 textureSize) {
 if (textureSize.x < 1.0 || textureSize.y < 1.0) return uv;

 vec2 s = uResolution / textureSize;
 float scale = max(s.x, s.y);

 vec2 scaledSize = textureSize * scale;
 vec2 offset = (uResolution - scaledSize) * 0.5;

 return (uv * uResolution - offset) / scaledSize;
 }

 float displacement(float x, float num_stripes, float strength) {
 float modulus = 1.0 / num_stripes;
 return mod(x, modulus) * strength;
 }

 float fractalGlass(float x) {
 float stripeWidth = 1.0 / uStripesFrequency;
 float sampleStep = uGlassSmoothness * stripeWidth;
 float d = 0.0;
 for (int i = -5; i <= 5; i++) {
 d += displacement(x + float(i) * sampleStep, uStripesFrequency, uGlassStrength);
 }
 d = d / 11.0;
 return x + d;
 }

 float smoothEdge(float x, float padding) {
 float edge = padding;
 if (x < edge) {
 return smoothstep(0.0, edge, x);
 } else if (x > 1.0 - edge) {
 return smoothstep(1.0, 1.0 - edge, x);
 }
 return 1.0;
 }

 void main() {
 vec2 uv = vUv;

 float originalX = uv.x;

 float edgeFactor = smoothEdge(originalX, uEdgePadding);

 float distortedX = fractalGlass(originalX);

 uv.x = mix(originalX, distortedX, edgeFactor);

 float distortionFactor = uv.x - originalX;

 float parallaxDirection = -sign(0.5 - uMouse.x);

 vec2 parallaxOffset = vec2(
 parallaxDirection * abs(uMouse.x - 0.5) * uParallaxStrength * (1.0 + abs(distortionFactor) * uDistortionMultiplier),
 0.0
 );

 parallaxOffset *= edgeFactor;

 uv += parallaxOffset;

 vec2 coverUV = getCoverUV(uv, uTextureSize);

 if (coverUV.x < 0.0 || coverUV.x > 1.0 || coverUV.y < 0.0 || coverUV.y > 1.0) {
 coverUV = clamp(coverUV, 0.0, 1.0);
 }

 vec4 color = texture2D(uTexture, coverUV);

 gl_FragColor = color;
 }
`;

function resolveMediaSource(source: any) {
  if (typeof source === "string") return source;
  if (source?.src) return source.src;

  return source;
}

function loadImageElement(source: any, fallbackSource = DEFAULT_IMAGE_SRC): Promise<{ image: HTMLImageElement, objectUrl: string }> {
  return new Promise((resolve, reject) => {
    const imageSource = resolveMediaSource(source) || fallbackSource;

    if (!imageSource) {
      reject(new Error("A valid image URL is required."));
      return;
    }

    fetch(imageSource, {
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Image request failed with ${response.status}`);
        }

        return response.blob();
      })
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const image = new Image();

        image.onload = () => resolve({ image, objectUrl });
        image.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error(`Unable to decode glass strip image: ${imageSource}`));
        };
        image.src = objectUrl;
      })
      .catch((error) => {
        if (imageSource !== fallbackSource) {
          loadImageElement(fallbackSource, fallbackSource).then(resolve).catch(reject);
          return;
        }

        reject(
          new Error(
            `Unable to load glass strip image: ${imageSource}. Current origin is ${window.location.origin}. Make sure the URL allows CORS for this site. ${error?.message || ""}`
          )
        );
      });
  });
}

interface FractalGlassProps {
  imageSrc?: string
  videoSrc?: any
  mediaType?: 'image' | 'video'
  stripesFrequency?: number
  glassStrength?: number
  glassSmoothness?: number
  parallaxStrength?: number
  distortionMultiplier?: number
  edgePadding?: number
}
export default function FractalGlass({
  imageSrc = DEFAULT_IMAGE_SRC,
  videoSrc = null,
  mediaType = "image",
  stripesFrequency = 40,
  glassStrength = 2.0,
  glassSmoothness = 0.014,
  parallaxStrength = 0.15,
  distortionMultiplier = 8.0,
  edgePadding = 0.12,
}: FractalGlassProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null); // keeps reference to video element for cleanup
  const uniformsRef = useRef<any>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.domElement.setAttribute("aria-hidden", "true");
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const uniforms = {
      uTexture: { value: new THREE.Texture() },
      uResolution: { value: new THREE.Vector2(W, H) },
      uTextureSize: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uParallaxStrength: { value: parallaxStrength },
      uDistortionMultiplier: { value: distortionMultiplier },
      uGlassStrength: { value: glassStrength },
      uStripesFrequency: { value: stripesFrequency },
      uGlassSmoothness: { value: glassSmoothness },
      uEdgePadding: { value: edgePadding },
    };
    uniformsRef.current = uniforms;
    let videoEl: HTMLVideoElement | null = null;
    let videoTexture: THREE.VideoTexture | null = null;
    let imageTexture: THREE.Texture | null = null;
    let imageObjectUrl: string | null = null;
    let isDisposed = false;

    if (mediaType === "video" && videoSrc) {
      // ── Video path ──────────────────────────────────────────────
      videoEl = document.createElement("video");
      const currentVideoEl = videoEl;
      currentVideoEl.crossOrigin = "anonymous";
      (currentVideoEl as any).referrerPolicy = "no-referrer";
      currentVideoEl.loop = true;
      currentVideoEl.muted = true;
      currentVideoEl.playsInline = true;
      currentVideoEl.autoplay = true;
      currentVideoEl.src = resolveMediaSource(videoSrc);
      videoRef.current = currentVideoEl;

      currentVideoEl.addEventListener("loadedmetadata", () => {
        uniforms.uTextureSize.value.set(currentVideoEl.videoWidth, currentVideoEl.videoHeight);
      });

      videoEl.play().catch(() => {
        // Autoplay blocked - still renders first frame when available
      });

      videoTexture = new THREE.VideoTexture(videoEl);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.wrapS = THREE.ClampToEdgeWrapping;
      videoTexture.wrapT = THREE.ClampToEdgeWrapping;
      uniforms.uTexture.value = videoTexture;

    } else {
      // ── Image path ──────────────────────────────────────────────
      loadImageElement(imageSrc).then(({ image, objectUrl }) => {
        if (isDisposed) return;

        imageObjectUrl = objectUrl;
        imageTexture = new THREE.Texture(image);
        imageTexture.needsUpdate = true;
        imageTexture.minFilter = THREE.LinearFilter;
        imageTexture.magFilter = THREE.LinearFilter;
        imageTexture.wrapS = THREE.ClampToEdgeWrapping;
        imageTexture.wrapT = THREE.ClampToEdgeWrapping;
        uniforms.uTexture.value = imageTexture;
        uniforms.uTextureSize.value.set(
          image.naturalWidth || image.width || 1920,
          image.naturalHeight || image.height || 1080
        );
      }).catch((error) => {
        console.warn(
          `Unable to load glass strip texture: ${resolveMediaSource(imageSrc)}. Make sure the public URL allows CORS for this site.`,
          error
        );
      });
    }

    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    scene.add(new THREE.Mesh(geo, mat));

    const target = { x: 0.5, y: 0.5 };
    const current = { x: 0.5, y: 0.5 };

    const setTarget = (x: number, y: number) => {
      target.x = x / window.innerWidth;
      target.y = 1 - y / window.innerHeight;
    };
    const onMouse = (e: MouseEvent) => setTarget(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => setTarget(e.touches[0].clientX, e.touches[0].clientY);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);

    const loop = createSuspendedRaf({
      root: el,
      onFrame: () => {
        current.x += (target.x - current.x) * 0.04;
        current.y += (target.y - current.y) * 0.04;
        uniforms.uMouse.value.set(current.x, current.y);
        renderer.render(scene, camera);
      },
    });
    loop.start();

    return () => {
      isDisposed = true;
      uniformsRef.current = null;
      loop.destroy();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
      if (videoEl) {
        videoEl.pause();
        videoEl.src = "";
        videoRef.current = null;
      }
      videoTexture?.dispose();
      imageTexture?.dispose();
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
      renderer.dispose();
      mat.dispose();
      geo.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [imageSrc, videoSrc, mediaType]);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;

    uniforms.uParallaxStrength.value = parallaxStrength;
    uniforms.uDistortionMultiplier.value = distortionMultiplier;
    uniforms.uGlassStrength.value = glassStrength;
    uniforms.uStripesFrequency.value = stripesFrequency;
    uniforms.uGlassSmoothness.value = glassSmoothness;
    uniforms.uEdgePadding.value = edgePadding;
  }, [stripesFrequency, glassStrength, glassSmoothness, parallaxStrength, distortionMultiplier, edgePadding]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* Mobile message */}
      <div
        className="
        hidden
        max-[1025px]:flex
        fixed
        bottom-6
        left-1/2
        -translate-x-1/2
        z-50
        px-4
        py-2
        rounded-full
        bg-white/10
        backdrop-blur-md
        text-white
        text-center
        text-sm
        leading-tight
        pointer-events-none
        max-md:px-[7vw] max-md:py-[4vw]
      "
      >
        Works best on desktop
      </div>

      {prefersReducedMotion && (
        <div
          aria-live="polite"
          className="pointer-events-none fixed bottom-4 right-4 z-40 w-fit max-w-65 rounded-md border border-white/15 bg-white/5 p-3 text-center backdrop-blur-sm max-md:hidden"
        >
          <h2 className="text-sm leading-none text-white">
            The glass keeps shifting.
          </h2>
          <p className="mt-2 text-xs leading-5 text-white/65">
            Fractal Glass distorts the image based on cursor and touch
            position in real time. Since the distortion is driven entirely
            by motion, reduced motion can&apos;t be applied here.
          </p>
        </div>
      )}
    </div>
  );
}
