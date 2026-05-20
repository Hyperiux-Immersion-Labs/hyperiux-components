"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Lenis from "lenis";
import gsap from "gsap";

export function WebGLPortfolioSlider({ items }) {
  const containerRef = useRef(null);
  const circleRef = useRef(null);
  const textContainerRef = useRef(null);
  const activeTextRef = useRef(null);
  const prevRawIndexRef = useRef(0);

  useEffect(() => {
    let scene, camera, renderer;
    let planes = [];
    let rafId;
    let currentRadius = 35;

    const container = containerRef.current;

    const lenis = new Lenis({ infinite: true, lerp: 0.1 });

    scene = new THREE.Scene();

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();

    const frustumHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const frustumWidth = frustumHeight * camera.aspect;

    const planeWidth = frustumWidth / 2;
    const planeHeight = frustumHeight;
    const spacing = planeWidth;
    const speedFactor = 0.01;

    items.forEach((item, i) => {
      const texture = loader.load(item.url);
      texture.minFilter = THREE.LinearFilter;

      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uZoom: { value: 1.2 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uZoom;
          varying vec2 vUv;
          void main() {
            vec2 uv = vUv;
            uv = (uv - 0.5) / uZoom + 0.5;
            gl_FragColor = texture2D(uTexture, uv);
          }
        `,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = i * spacing;
      scene.add(mesh);
      planes.push(mesh);
    });

    const totalWidth = spacing * items.length;

    let offset = 0;
    let prevScroll = null;

    function raf(time) {
      lenis.raf(time);

      const currentScroll = lenis.scroll;
      const limit = lenis.limit;

      let delta = 0;
      if (prevScroll !== null && limit > 0) {
        delta = currentScroll - prevScroll;
        if (delta > limit / 2) delta -= limit;
        if (delta < -limit / 2) delta += limit;
        offset += delta;
      }
      prevScroll = currentScroll;

      const scrollOffset = offset * speedFactor;

      const targetRadius = Math.min(35 + Math.abs(delta) * 0.2, 55);
      currentRadius += (targetRadius - currentRadius) * 0.1;

      if (circleRef.current) {
        const R = -(scrollOffset / spacing) * (360 / items.length);
        circleRef.current.style.transform = `translate(-50%, -50%) rotate(${R}deg)`;
        circleRef.current.style.setProperty("--radius", `-${currentRadius}vh`);
        circleRef.current.style.setProperty("--rotation", `${R}deg`);
      }

      if (textContainerRef.current) {
        let rawIndex = Math.floor(scrollOffset / spacing + 0.5);

        if (rawIndex !== prevRawIndexRef.current) {
          const isForward = rawIndex > prevRawIndexRef.current;
          prevRawIndexRef.current = rawIndex;

          let activeIndex = ((rawIndex % items.length) + items.length) % items.length;
          const newText = items[activeIndex].description;

          if (textContainerRef.current.dataset.activeText !== newText) {
            textContainerRef.current.dataset.activeText = newText;

            const oldDiv = activeTextRef.current;

            const newDiv = document.createElement("div");
            newDiv.style.cssText = "position:absolute;width:100%;height:100%;display:flex;align-items:center;justify-content:center;";
            newDiv.innerText = newText;

            textContainerRef.current.appendChild(newDiv);
            activeTextRef.current = newDiv;

            const yOffset = isForward ? 30 : -30;
            gsap.fromTo(newDiv, { y: yOffset }, { y: 0, duration: 0.5, ease: "power3.out" });
            if (oldDiv) {
              gsap.to(oldDiv, {
                y: -yOffset,
                duration: 0.5,
                ease: "power3.out",
                onComplete: () => { if (oldDiv.parentNode) oldDiv.parentNode.removeChild(oldDiv); },
              });
            }
          }
        }
      }

      planes.forEach((plane, i) => {
        let x = i * spacing - scrollOffset;
        x = ((x % totalWidth) + totalWidth) % totalWidth;
        if (x > totalWidth / 2) x -= totalWidth;
        plane.position.x = x;

        const dist = Math.abs(x);
        const maxDist = frustumWidth;
        const norm = Math.min(dist / maxDist, 1);
        const arc = Math.cos(norm * Math.PI * 0.5);
        const targetZoom = 1 + (1 - arc) * 1.5;
        plane.material.uniforms.uZoom.value = targetZoom;
      });

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      lenis.destroy();
    };
  }, []);

  const scrollHeight = items.length * 100;

  return (
    <div style={{ width: "100%", background: "#000", height: `${scrollHeight}vh` }}>
      <div ref={containerRef} style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
        <div
          ref={textContainerRef}
          data-active-text={items[0].description}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontSize: "1.125rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            zIndex: 20,
            pointerEvents: "none",
            mixBlendMode: "difference",
            overflow: "hidden",
            height: "1.875rem",
            width: "12.5rem",
          }}
        >
          <div
            ref={activeTextRef}
            style={{ position: "absolute", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {items[0].description}
          </div>
        </div>

        <div
          ref={circleRef}
          style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0, pointerEvents: "none", zIndex: 10, transform: "translate(-50%, -50%) rotate(0deg)" }}
        >
          {items.map((item, i) => {
            const angle = i * (360 / items.length);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "1.75rem",
                  height: "2.25rem",
                  marginLeft: "-14px",
                  marginTop: "-18px",
                  transform: `rotate(${angle}deg) translateY(var(--radius, -35vh)) rotate(calc(-${angle}deg - var(--rotation, 0deg)))`,
                }}
              >
                <img
                  src={item.url}
                  alt={item.description}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
