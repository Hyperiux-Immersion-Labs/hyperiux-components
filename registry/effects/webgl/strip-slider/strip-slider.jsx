"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const DEFAULT_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    title: "Highlands",
    subtitle: "Scotland",
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
    title: "Forest Light",
    subtitle: "Norway",
  },
  {
    url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=80",
    title: "Canyon Dusk",
    subtitle: "Arizona",
  },
  {
    url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=80",
    title: "Cascade",
    subtitle: "Iceland",
  },
  {
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
    title: "Desert Bloom",
    subtitle: "Sahara",
  },
];

const STRIP_COUNT = 8;

const VERTEX_SHADER = `
  varying vec2 vUv;
  uniform float uOffset;
  uniform float uStrip;
  uniform float uTotal;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float normalizedX = (uStrip / uTotal) - 0.5;
    float wave = sin((normalizedX + 0.5) * 3.14159) * uOffset * 0.35;
    pos.y += wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uNextTexture;
  uniform float uProgress;
  uniform float uStrip;
  uniform float uTotal;
  uniform float uOffset;

  void main() {
    float stripNorm = uStrip / uTotal;
    float delay = stripNorm * 0.4;
    float localProgress = clamp((uProgress - delay) / (1.0 - 0.4), 0.0, 1.0);
    localProgress = localProgress * localProgress * (3.0 - 2.0 * localProgress);

    vec2 uv = vUv;
    float distort = sin(localProgress * 3.14159) * 0.08 * sign(uOffset);
    uv.y += distort;
    uv = clamp(uv, 0.001, 0.999);

    vec4 curr = texture2D(uTexture, uv);
    vec4 next = texture2D(uNextTexture, uv);
    gl_FragColor = mix(curr, next, localProgress);
  }
`;

export function StripSlider({ slides = DEFAULT_SLIDES, stripCount = STRIP_COUNT }) {
  const mountRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0a);
    mount.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    // Load all textures
    const textures = slides.map((s) => {
      const t = loader.load(s.url);
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      return t;
    });

    // Build strip meshes
    const stripW = W / stripCount;
    const meshes = [];

    for (let i = 0; i < stripCount; i++) {
      const geo = new THREE.PlaneGeometry(stripW, H, 1, 20);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: textures[0] },
          uNextTexture: { value: textures[1] },
          uProgress: { value: 0 },
          uOffset: { value: 0 },
          uStrip: { value: i },
          uTotal: { value: stripCount },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
      });

      const mesh = new THREE.Mesh(geo, mat);
      // Align strips so their left edges meet
      const leftEdge = -W / 2 + i * stripW + stripW / 2;
      mesh.position.x = leftEdge;
      scene.add(mesh);
      meshes.push(mesh);
    }

    // State
    let current = 0;
    let isAnimating = false;

    const updateText = (index, animate) => {
      const slide = slides[index];
      if (!titleRef.current || !subtitleRef.current) return;

      if (animate) {
        gsap.fromTo(
          titleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.25 }
        );
        gsap.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.35 }
        );
      }

      titleRef.current.textContent = slide.title;
      subtitleRef.current.textContent = slide.subtitle;
      if (counterRef.current) {
        counterRef.current.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      }
    };

    updateText(0, false);

    const goTo = (nextIndex) => {
      if (isAnimating) return;
      isAnimating = true;

      const next = (nextIndex + slides.length) % slides.length;
      const direction = nextIndex > current || (nextIndex === 0 && current === slides.length - 1) ? 1 : -1;

      meshes.forEach((mesh) => {
        mesh.material.uniforms.uNextTexture.value = textures[next];
        mesh.material.uniforms.uProgress.value = 0;
        mesh.material.uniforms.uOffset.value = direction;
      });

      // Animate progress 0 → 1
      gsap.to(
        meshes.map((m) => m.material.uniforms.uProgress),
        {
          value: 1,
          duration: 1.1,
          ease: "power3.inOut",
          onUpdate: () => {
            // offset wave magnitude follows a bell curve
            const p = meshes[0].material.uniforms.uProgress.value;
            const wave = Math.sin(p * Math.PI) * direction;
            meshes.forEach((m) => {
              m.material.uniforms.uOffset.value = wave;
            });
          },
          onComplete: () => {
            meshes.forEach((mesh) => {
              mesh.material.uniforms.uTexture.value = textures[next];
              mesh.material.uniforms.uProgress.value = 0;
            });
            current = next;
            updateText(current, true);
            isAnimating = false;
          },
        }
      );

      // Fade out current text
      gsap.to([titleRef.current, subtitleRef.current], {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    };

    // Button wiring
    const nextBtn = mount.parentElement?.querySelector("[data-strip-next]");
    const prevBtn = mount.parentElement?.querySelector("[data-strip-prev]");
    const onNext = () => goTo(current + 1);
    const onPrev = () => goTo(current - 1);
    nextBtn?.addEventListener("click", onNext);
    prevBtn?.addEventListener("click", onPrev);

    // Keyboard
    const onKey = (e) => {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft") goTo(current - 1);
    };
    window.addEventListener("keydown", onKey);

    // Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      const sw = w / stripCount;
      meshes.forEach((mesh, i) => {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.PlaneGeometry(sw, h, 1, 20);
        mesh.position.x = -w / 2 + i * sw + sw / 2;
        mesh.material.uniforms.uStrip.value = i;
      });
    };
    window.addEventListener("resize", onResize);

    // Render loop
    let rafId;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      nextBtn?.removeEventListener("click", onNext);
      prevBtn?.removeEventListener("click", onPrev);
      meshes.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [slides, stripCount]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#0a0a0a",
        fontFamily: "sans-serif",
      }}
    >
      {/* WebGL canvas mount */}
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "8%",
          zIndex: 10,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <p
          ref={subtitleRef}
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        />
        <h2
          ref={titleRef}
          style={{
            color: "#ffffff",
            fontSize: "clamp(2.5rem, 6vw, 6rem)",
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        />
      </div>

      {/* Counter */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          right: "8%",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <span
          ref={counterRef}
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.8rem",
            letterSpacing: "0.15em",
            fontVariantNumeric: "tabular-nums",
          }}
        />
      </div>

      {/* Nav buttons */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          right: "8%",
          zIndex: 10,
          display: "flex",
          gap: "0.75rem",
        }}
      >
        <button
          data-strip-prev
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
            backdropFilter: "blur(4px)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          aria-label="Previous slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          data-strip-next
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
            backdropFilter: "blur(4px)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          aria-label="Next slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "rgba(255,255,255,0.08)",
          zIndex: 10,
        }}
      />
    </div>
  );
}
