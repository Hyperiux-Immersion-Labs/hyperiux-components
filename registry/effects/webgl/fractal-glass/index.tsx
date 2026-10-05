// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

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

const DEFAULT_IMAGE_SRC = "https://picsum.photos/seed/h13/1600/1200";

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

 // Base shift P plus extra per-stripe distortion scaled by |P|. Using the
 // signed P for the extra term (P * (1 + d * m)) made the sample
 // x + P + d * (1 + P * m): with the cursor left of centre P is negative, and
 // where P * m hit -1 the stripe distortion cancelled out completely - one
 // cursor position showed the image with no fractal effect.
 float parallaxShift = parallaxDirection * abs(uMouse.x - 0.5) * uParallaxStrength;
 vec2 parallaxOffset = vec2(
 parallaxShift + abs(parallaxShift) * abs(distortionFactor) * uDistortionMultiplier,
 0.0
 );

 parallaxOffset *= edgeFactor;

 uv += parallaxOffset;

 vec2 coverUV = getCoverUV(uv, uTextureSize);

 // Strong parallax pushes the sample past the image edge. Clamping it
 // repeated the edge pixel across a whole band, so that band showed no
 // fractal distortion at all. Mirroring keeps real image detail there.
 coverUV = 1.0 - abs(1.0 - mod(coverUV, 2.0));

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

    </div>
  );
}
