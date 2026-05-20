'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2  uResolution;
  uniform vec2  uTextureSize;
  uniform vec2  uMouse;
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
    float sampleStep  = uGlassSmoothness * stripeWidth;
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

export default function GlassStripParallax({
  imageSrc             = "/assets/img/image10.jpg", // ← new prop: path/URL to image file
  videoSrc             = null,       // ← new prop: path/URL to video file
  mediaType            = "image",    // ← new prop: "image" | "video"
  stripesFrequency     = 8.0,
  glassStrength        = 0.8,
  glassSmoothness      = 0.5,
  parallaxStrength     = 0.6,
  distortionMultiplier = 8.0,
  edgePadding          = 0.12,
}) {
  const mountRef = useRef(null);
  const videoRef = useRef(null); // keeps reference to video element for cleanup

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const uniforms = {
      uTexture:             { value: new THREE.Texture() },
      uResolution:          { value: new THREE.Vector2(W, H) },
      uTextureSize:         { value: new THREE.Vector2(1, 1) },
      uMouse:               { value: new THREE.Vector2(0.5, 0.5) },
      uParallaxStrength:    { value: parallaxStrength },
      uDistortionMultiplier:{ value: distortionMultiplier },
      uGlassStrength:       { value: glassStrength },
      uStripesFrequency:    { value: stripesFrequency },
      uGlassSmoothness:     { value: glassSmoothness },
      uEdgePadding:         { value: edgePadding },
    };

    let videoEl = null;
    let videoTexture = null;

    if (mediaType === "video" && videoSrc) {
      // ── Video path ──────────────────────────────────────────────
      videoEl = document.createElement("video");
      videoEl.src = videoSrc;
      videoEl.crossOrigin = "anonymous";
      videoEl.loop = true;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.autoplay = true;
      videoRef.current = videoEl;

      videoEl.addEventListener("loadedmetadata", () => {
        uniforms.uTextureSize.value.set(videoEl.videoWidth, videoEl.videoHeight);
      });

      videoEl.play().catch(() => {
        // Autoplay blocked — still renders first frame when available
      });

      videoTexture = new THREE.VideoTexture(videoEl);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.wrapS = THREE.ClampToEdgeWrapping;
      videoTexture.wrapT = THREE.ClampToEdgeWrapping;
      uniforms.uTexture.value = videoTexture;

    } else {
      // ── Image path ──────────────────────────────────────────────
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = "anonymous";
      loader.load(imageSrc, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        uniforms.uTexture.value = tex;
        uniforms.uTextureSize.value.set(
          tex.image.naturalWidth  || tex.image.width  || 1920,
          tex.image.naturalHeight || tex.image.height || 1080
        );
      });
    }

    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    scene.add(new THREE.Mesh(geo, mat));

    const target  = { x: 0.5, y: 0.5 };
    const current = { x: 0.5, y: 0.5 };

    const setTarget = (x, y) => {
      target.x = x / window.innerWidth;
      target.y = 1 - y / window.innerHeight;
    };
    const onMouse = (e) => setTarget(e.clientX, e.clientY);
    const onTouch = (e) => setTarget(e.touches[0].clientX, e.touches[0].clientY);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);

    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;
      uniforms.uMouse.value.set(current.x, current.y);
      // For video, mark texture as needing update every frame
      if (videoTexture) videoTexture.needsUpdate = true;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
      if (videoEl) {
        videoEl.pause();
        videoEl.src = "";
        videoRef.current = null;
      }
      if (videoTexture) videoTexture.dispose();
      renderer.dispose();
      mat.dispose();
      geo.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [imageSrc, videoSrc, mediaType, stripesFrequency, glassStrength, glassSmoothness,
      parallaxStrength, distortionMultiplier, edgePadding]);

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
    />
  );
}

