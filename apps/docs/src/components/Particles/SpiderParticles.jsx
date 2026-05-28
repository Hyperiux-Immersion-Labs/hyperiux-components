"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ─── Constants ────────────────────────────────────────────────────────────────

const MOUSE_OFFSCREEN = -9999;
const MOUSE_THRESHOLD = -9000; // anything above this = mouse is on screen

const LERP_SPEED = 0.1;
const FADE_SPEED = 0.04;

// ─── GLSL Shaders ─────────────────────────────────────────────────────────────

const PARTICLE_VERT = /* glsl */ `
  uniform float uSize;
  uniform vec2  uMouse;
  uniform float uSpotlightRadius;

  void main() {
    vec4  mvPos = modelViewMatrix * vec4(position, 1.0);
    float dist  = distance(position.xy, uMouse);
    float scale = dist < uSpotlightRadius
      ? 1.0 - (dist / uSpotlightRadius)
      : 0.0;

    gl_PointSize = uSize * scale;
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const CURSOR_VERT = /* glsl */ `
  uniform float uSize;

  void main() {
    vec4 mvPos   = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize;
    gl_Position  = projectionMatrix * mvPos;
  }
`;

// Shared by both particle dots and the cursor dot
const POINT_FRAG = /* glsl */ `
  uniform vec3  uColor;
  uniform vec3  uGlow;
  uniform bool  uGlowEnabled;
  uniform float uAlpha;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.5) discard;

    if (uGlowEnabled) {
      float core  = smoothstep(0.5, 0.0, d);
      float glow  = smoothstep(0.5, 0.1, d) * 0.6;
      vec3  col   = mix(uGlow, uColor, core);
      float alpha = (core + glow) * uAlpha;
      gl_FragColor = vec4(col, alpha);
    } else {
      float alpha = smoothstep(0.5, 0.45, d) * uAlpha;
      gl_FragColor = vec4(uColor, alpha);
    }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SpiderParticles({
  particleCount = 180,
  gridGap = 0,
  particleSize = 20.0,
  mouseConnectDist = 160,
  spotlightRadius = 300,
  particlesGlow = false,
  glowColor = 0xffffff,
  particleColor = 0xffffff,
  webColor = 0xffffff,
  centerColor = 0xffffff,
}) {
  const mountRef = useRef(null);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;
    let animId;

    const _glowColor     = new THREE.Color(glowColor);
    const _particleColor = new THREE.Color(particleColor);
    const _webColor      = new THREE.Color(webColor);
    const _centerColor   = new THREE.Color(centerColor);

    // ─── Renderer & Scene ──────────────────────────────────────────────────────

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 2, width / 2, height / 2, -height / 2, -500, 500,
    );
    camera.position.z = 1;

    // ─── Mouse State ───────────────────────────────────────────────────────────

    const mouse       = new THREE.Vector2(MOUSE_OFFSCREEN, MOUSE_OFFSCREEN);
    const smoothMouse = new THREE.Vector2(MOUSE_OFFSCREEN, MOUSE_OFFSCREEN);
    let mouseEntryAlpha = 0;
    let mousePresent    = false;
    let mouseJustEntered = false; // snap smoothMouse on the first frame after cursor enters

    const isDesktop = () => window.innerWidth >= 768;

    const onMove = (e) => {
      if (!isDesktop()) return;
      const rect = mount.getBoundingClientRect();
      mouse.set(
        e.clientX - rect.left - width / 2,
        -(e.clientY - rect.top - height / 2),
      );
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const onEnter = (e) => {
      if (!isDesktop()) return;
      // Capture exact entry position so smoothMouse can snap without lerp drift
      const rect = mount.getBoundingClientRect();
      mouse.set(
        e.clientX - rect.left - width / 2,
        -(e.clientY - rect.top - height / 2),
      );
      mouseJustEntered = true;
      mousePresent     = true;
      setActive(true);
    };

    const onLeave = () => {
      if (!isDesktop()) return;
      mousePresent     = false;
      mouseJustEntered = false;
      setActive(false);
    };

    mount.addEventListener("mousemove",  onMove);
    mount.addEventListener("mouseenter", onEnter);
    mount.addEventListener("mouseleave", onLeave);

    const onTouch = (e) => {
      if (!isDesktop()) return;
      const t    = e.touches[0];
      const rect = mount.getBoundingClientRect();
      mouse.set(
        t.clientX - rect.left - width / 2,
        -(t.clientY - rect.top - height / 2),
      );
      if (!mousePresent) mouseJustEntered = true;
      mousePresent = true;
      setActive(true);
    };

    const onTouchEnd = () => {
      if (!isDesktop()) return;
      mousePresent     = false;
      mouseJustEntered = false;
      setActive(false);
    };

    mount.addEventListener("touchmove", onTouch,      { passive: true });
    mount.addEventListener("touchend",  onTouchEnd);

    // ─── Grid Layout ───────────────────────────────────────────────────────────

    let cols, rows, actualCount, spacingX, spacingY;

    if (gridGap > 0) {
      // Explicit grid: cells are gridGap pixels apart
      cols        = Math.max(1, Math.floor(width  / gridGap));
      rows        = Math.max(1, Math.floor(height / gridGap));
      actualCount = cols * rows;
      spacingX = spacingY = gridGap;
    } else {
      // Auto grid: fit particleCount evenly, respecting aspect ratio
      actualCount  = particleCount;
      const aspect = width / height;
      rows    = Math.max(1, Math.round(Math.sqrt(actualCount / aspect)));
      cols    = Math.ceil(actualCount / rows);
      spacingX = width  / cols;
      spacingY = height / rows;
    }

    const positions = new Float32Array(actualCount * 3);

    for (let i = 0; i < actualCount; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      positions[i * 3]     = (c + 0.5) * spacingX - width  / 2;
      positions[i * 3 + 1] = (r + 0.5) * spacingY - height / 2;
      positions[i * 3 + 2] = 0;
    }

    // ─── Particle Points ───────────────────────────────────────────────────────

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor:          { value: _particleColor },
        uGlow:           { value: _glowColor },
        uSize:           { value: particleSize * window.devicePixelRatio },
        uMouse:          { value: new THREE.Vector2(MOUSE_OFFSCREEN, MOUSE_OFFSCREEN) },
        uSpotlightRadius: { value: spotlightRadius },
        uGlowEnabled:    { value: particlesGlow },
        uAlpha:          { value: 0.0 },
      },
      vertexShader:   PARTICLE_VERT,
      fragmentShader: POINT_FRAG,
      transparent:  true,
      depthWrite:   false,
      blending:     THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── Cursor Dot ────────────────────────────────────────────────────────────

    const cursorGeo = new THREE.BufferGeometry();
    cursorGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3),
    );

    const cursorMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor:       { value: _centerColor },
        uGlow:        { value: _glowColor },
        uSize:        { value: particleSize * window.devicePixelRatio },
        uGlowEnabled: { value: particlesGlow },
        uAlpha:       { value: 0.0 },
      },
      vertexShader:   CURSOR_VERT,
      fragmentShader: POINT_FRAG,
      transparent:  true,
      depthWrite:   false,
      blending:     THREE.AdditiveBlending,
    });

    const cursorPoint = new THREE.Points(cursorGeo, cursorMat);
    scene.add(cursorPoint);

    // ─── Web Lines ─────────────────────────────────────────────────────────────

    const mouseLinePositions = new Float32Array(actualCount * 6);
    const mouseLineColors    = new Float32Array(actualCount * 6);

    const mouseLineGeo = new THREE.BufferGeometry();
    mouseLineGeo.setAttribute("position", new THREE.BufferAttribute(mouseLinePositions, 3));
    mouseLineGeo.setAttribute("color",    new THREE.BufferAttribute(mouseLineColors,    3));

    const mouseLineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent:  true,
      opacity:      1,
      blending:     THREE.AdditiveBlending,
      depthWrite:   false,
    });

    const mouseLines = new THREE.LineSegments(mouseLineGeo, mouseLineMat);
    scene.add(mouseLines);

    // ─── Resize ────────────────────────────────────────────────────────────────

    const onResize = () => {
      width  = mount.clientWidth;
      height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.left   = -width  / 2;
      camera.right  =  width  / 2;
      camera.top    =  height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // ─── Animation Loop ────────────────────────────────────────────────────────

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Fade the entire effect in/out as cursor enters or leaves
      mouseEntryAlpha = mousePresent
        ? Math.min(1, mouseEntryAlpha + FADE_SPEED)
        : Math.max(0, mouseEntryAlpha - FADE_SPEED);

      // Snap smoothMouse on the first frame, lerp every frame after
      if (mousePresent && mouse.x > MOUSE_THRESHOLD) {
        if (mouseJustEntered) {
          smoothMouse.copy(mouse); // instant snap — avoids lerp drift from previous position
          mouseJustEntered = false;
        } else {
          smoothMouse.x += (mouse.x - smoothMouse.x) * LERP_SPEED;
          smoothMouse.y += (mouse.y - smoothMouse.y) * LERP_SPEED;
        }
      } else if (!mousePresent && mouseEntryAlpha <= 0) {
        smoothMouse.set(MOUSE_OFFSCREEN, MOUSE_OFFSCREEN);
      }

      // Sync uniforms
      particleMat.uniforms.uMouse.value.copy(smoothMouse);
      particleMat.uniforms.uAlpha.value = mouseEntryAlpha;
      cursorMat.uniforms.uAlpha.value   = mouseEntryAlpha;

      // Move cursor dot
      if (smoothMouse.x > MOUSE_THRESHOLD) {
        cursorPoint.position.set(smoothMouse.x, smoothMouse.y, 0);
        cursorPoint.visible = true;
      } else {
        cursorPoint.visible = false;
      }

      // Build web lines — one segment per nearby particle
      let mIdx = 0;

      if (smoothMouse.x > MOUSE_THRESHOLD && mouseEntryAlpha > 0) {
        for (let i = 0; i < actualCount; i++) {
          const px = positions[i * 3];
          const py = positions[i * 3 + 1];
          const dx = px - smoothMouse.x;
          const dy = py - smoothMouse.y;
          const d  = Math.sqrt(dx * dx + dy * dy);

          if (d >= mouseConnectDist) continue; // outside web radius, skip

          const alpha = (1 - d / mouseConnectDist) * 0.85 * mouseEntryAlpha;
          const si    = mIdx * 6;

          // Line start = cursor position
          mouseLinePositions[si]     = smoothMouse.x;
          mouseLinePositions[si + 1] = smoothMouse.y;
          mouseLinePositions[si + 2] = 0;

          // Line end = particle position
          mouseLinePositions[si + 3] = px;
          mouseLinePositions[si + 4] = py;
          mouseLinePositions[si + 5] = 0;

          // Alpha is encoded per-vertex in RGB (additive blending, no real alpha channel)
          mouseLineColors[si]     = _webColor.r;
          mouseLineColors[si + 1] = _webColor.g;
          mouseLineColors[si + 2] = _webColor.b;
          mouseLineColors[si + 3] = _webColor.r * alpha;
          mouseLineColors[si + 4] = _webColor.g * alpha;
          mouseLineColors[si + 5] = _webColor.b * alpha;

          mIdx++;
        }
      }

      mouseLineGeo.setDrawRange(0, mIdx * 2);
      mouseLineGeo.attributes.position.needsUpdate = true;
      mouseLineGeo.attributes.color.needsUpdate    = true;

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ───────────────────────────────────────────────────────────────

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (mount) {
        mount.removeEventListener("mousemove",  onMove);
        mount.removeEventListener("mouseenter", onEnter);
        mount.removeEventListener("mouseleave", onLeave);
        mount.removeEventListener("touchmove",  onTouch);
        mount.removeEventListener("touchend",   onTouchEnd);
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      cursorGeo.dispose();
      cursorMat.dispose();
      mouseLineGeo.dispose();
      mouseLineMat.dispose();
    };
  }, [
    particleCount,
    gridGap,
    particleSize,
    mouseConnectDist,
    spotlightRadius,
    particlesGlow,
    glowColor,
    particleColor,
    webColor,
    centerColor,
  ]);

  // ─── UI ───────────────────────────────────────────────────────────────────────

  const stats = [
    { label: "Particles", value: particleCount },
    { label: "Radius",    value: spotlightRadius },
    { label: "Reach",     value: mouseConnectDist },
  ];

  return (
    <div
      ref={mountRef}
      className="relative w-full h-screen bg-black overflow-hidden cursor-none max-sm:cursor-default"
    >
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-10">

        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 max-sm:hidden">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  active ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-white/20"
                }`}
              />
              <span
                className={`text-sm tracking-widest uppercase transition-colors duration-500 ${
                  active ? "text-white/50" : "text-white/20"
                }`}
              >
                {active ? "Tracking" : "Idle"}
              </span>
            </div>
            <h1 className="text-4xl font-light text-white/90 tracking-tight leading-none">
              Spider Web
            </h1>
            <p className="text-md text-white/30 tracking-wide">
              Interactive particle field
            </p>
          </div>

          <div className="flex gap-6 max-sm:hidden">
            {stats.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5 text-right">
                <span className="text-sm uppercase tracking-widest text-white/25">
                  {label}
                </span>
                <span className="text-lg font-light text-white/60 tabular-nums">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile overlay — desktop-only effect notice */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 pointer-events-none select-none z-20 hidden max-sm:flex w-full px-14 text-center">
          <p className="text-white text-3xl font-light tracking-tight">
            Open on desktop
          </p>
          <p className="text-base text-white/50 tracking-wide">
            This effect is designed to be experienced with a cursor
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between max-sm:hidden">
          <div
            className={`transition-opacity duration-700 ${active ? "opacity-0" : "opacity-40"}`}
          >
            <p className="text-sm text-white/60 tracking-widest uppercase">
              Move your cursor to explore
            </p>
            <div className="mt-1.5 w-8 h-px bg-white/20" />
          </div>

          <div
            className={`flex flex-col gap-1 text-right transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}
          >
            <span className="text-sm uppercase tracking-widest text-white/25">
              Position
            </span>
            <span className="font-mono text-md text-white/50 tracking-wider">
              {Math.round(pos.x)} · {Math.round(pos.y)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}