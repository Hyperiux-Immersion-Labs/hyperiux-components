"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

const vertexShader = `
uniform vec2 uOffset;
varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795

void main() {
   vUv = uv;
   vec3 newPosition = position;

   float edgeIntensity = abs(uv.x - 0.5) * 2.0;
   newPosition.x += sin(uv.y * M_PI) * uOffset.x * edgeIntensity;

   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uAlpha;
uniform vec2 uTextureSize;
uniform vec2 uMeshSize;
varying vec2 vUv;

vec2 coverUv(vec2 uv, vec2 textureSize, vec2 meshSize) {
    float rs = meshSize.x / meshSize.y;
    float rt = textureSize.x / textureSize.y;

    vec2 newUv = uv;

    if (rs > rt) {
        float scale = rs / rt;
        newUv.x = uv.x * scale - (scale - 1.0) * 0.5;
    } else {
        float scale = rt / rs;
        newUv.y = uv.y * scale - (scale - 1.0) * 0.5;
    }

    return newUv;
}

void main() {
   vec2 coveredUv = coverUv(vUv, uTextureSize, uMeshSize);

   vec2 center = vec2(0.5, 0.5);
   float scaleAmount = 1.5;
   coveredUv = center + (coveredUv - center) / scaleAmount;

   vec4 texColor = texture2D(uTexture, coveredUv);
   gl_FragColor = vec4(texColor.rgb, texColor.a * uAlpha);
}
`;

const defaultImages = [
  "/assets/img/image01.webp",
  "/assets/img/image02.webp",
  "/assets/img/image03.webp",
  "/assets/img/image04.png",
  "/assets/img/image05.png",
];

const SWIPER_VISIBLE_IMAGES = 3;
const FIXED_IMAGE_WIDTH = 320;
const FIXED_IMAGE_HEIGHT = 320;
const DEFORMATION_INTENSITY = 8;
const DEFORMATION_SENSITIVITY = 0.02;
const DEFORMATION_SMOOTHNESS = 0.15;
const SCROLL_DEFORMATION_MULTIPLIER = 5;
const DRAG_SENSITIVITY = 2.0;
const MOMENTUM_FRICTION = 0.94;
const SCROLL_SMOOTHNESS = 0.12;
const MAX_SCROLL_VELOCITY = 0.5;
const MAX_DEFORMATION = 0.05;
const MAX_SCROLL_DEFORMATION = 0.02;

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

export function CurvedPlane({ images = defaultImages }) {
  const containerRef = useRef(null);
  const meshesRef = useRef([]);
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const texturesRef = useRef([]);

  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const deformationRef = useRef(0);
  const targetDeformationRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const scrollIntensityRef = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastTime = useRef(Date.now());

  const mouseRef = useRef({ x: 0, y: 0 });
  const followerRef = useRef(null);
  const isInsideBounds = useRef(false);

  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    let loaded = 0;

    images.forEach((src, idx) => {
      loader.load(
        src,
        (tex) => {
          texturesRef.current[idx] = tex;
          if (++loaded === images.length) setImagesLoaded(true);
        },
        undefined,
        (err) => {
          console.error("Failed to load texture:", err);
          texturesRef.current[idx] = null;
          if (++loaded === images.length) setImagesLoaded(true);
        }
      );
    });
  }, [images]);

  useEffect(() => {
    if (!imagesLoaded) return;

    const container = containerRef.current;
    const viewHeight = window.innerHeight * 0.8;
    const viewWidth = window.innerWidth;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      (180 * (2 * Math.atan(viewHeight / 2 / 1000))) / Math.PI,
      viewWidth / viewHeight,
      1,
      3000
    );
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(viewWidth, viewHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const geometry = new THREE.PlaneGeometry(1, 1, 50, 50);
    const meshes = [];
    const totalMeshes = SWIPER_VISIBLE_IMAGES + 4;

    for (let i = 0; i < totalMeshes; i++) {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: null },
          uOffset: { value: new THREE.Vector2(0, 0) },
          uAlpha: { value: 1 },
          uTextureSize: { value: new THREE.Vector2(1, 1) },
          uMeshSize: { value: new THREE.Vector2(FIXED_IMAGE_WIDTH, FIXED_IMAGE_HEIGHT) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, mat);
      mesh.scale.set(FIXED_IMAGE_WIDTH, FIXED_IMAGE_HEIGHT, 1);
      scene.add(mesh);
      meshes.push(mesh);
    }

    meshesRef.current = meshes;

    const spacing = FIXED_IMAGE_WIDTH + 60;

    const updateMeshes = () => {
      const offset = offsetRef.current;
      const baseIndex = Math.floor(offset);
      const fractional = offset - baseIndex;

      meshes.forEach((mesh, i) => {
        const meshIndex = baseIndex + i - 2;
        const imgIndex = mod(meshIndex, images.length);
        const texture = texturesRef.current[imgIndex];

        if (texture) {
          mesh.material.uniforms.uTexture.value = texture;
          mesh.material.uniforms.uTextureSize.value = new THREE.Vector2(
            texture.image.width,
            texture.image.height
          );
        }

        const centerOffset = i - totalMeshes / 2 + 0.5;
        const xPos = (centerOffset - fractional) * spacing;
        mesh.position.x = xPos;

        const distFromCenter = Math.abs(xPos) / (viewWidth / 2);
        mesh.material.uniforms.uAlpha.value = Math.max(0.2, 1 - distFromCenter * 1.0);

        const deform = deformationRef.current;
        mesh.material.uniforms.uOffset.value.x = deform * DEFORMATION_INTENSITY;
      });
    };

    const animate = () => {
      if (Math.abs(scrollVelocityRef.current) > 0.0001) {
        targetOffsetRef.current += scrollVelocityRef.current;
        scrollVelocityRef.current = lerp(scrollVelocityRef.current, 0, 0.05);
      }

      scrollIntensityRef.current = lerp(scrollIntensityRef.current, 0, 0.02);

      if (!dragging.current && Math.abs(velocityRef.current) > 0.001) {
        targetOffsetRef.current += velocityRef.current;
        velocityRef.current *= MOMENTUM_FRICTION;
      }

      if (!dragging.current) {
        targetDeformationRef.current = lerp(targetDeformationRef.current, 0, 0.05);
      }

      offsetRef.current = lerp(offsetRef.current, targetOffsetRef.current, SCROLL_SMOOTHNESS);
      deformationRef.current = lerp(deformationRef.current, targetDeformationRef.current, DEFORMATION_SMOOTHNESS);

      updateMeshes();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const vh = window.innerHeight * 0.8;
      const vw = window.innerWidth;
      camera.aspect = vw / vh;
      camera.updateProjectionMatrix();
      renderer.setSize(vw, vh);
    };
    window.addEventListener("resize", onResize);

    const getPointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

    const onPointerDown = (e) => {
      dragging.current = true;
      lastX.current = getPointerX(e);
      lastTime.current = Date.now();
      velocityRef.current = 0;
      document.body.style.userSelect = "none";
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (!dragging.current) return;
      const currentX = getPointerX(e);
      const currentTime = Date.now();
      const dx = currentX - lastX.current;
      const dt = Math.max(currentTime - lastTime.current, 1);
      const delta = (dx / spacing) * DRAG_SENSITIVITY;
      targetOffsetRef.current -= delta;
      const instantVelocity = dx / dt;
      velocityRef.current = Math.max(-MAX_SCROLL_VELOCITY, Math.min(MAX_SCROLL_VELOCITY, -delta / (dt / 16)));
      const deformIntensity = Math.max(-MAX_DEFORMATION, Math.min(MAX_DEFORMATION, instantVelocity * DEFORMATION_SENSITIVITY));
      targetDeformationRef.current = deformIntensity;
      lastX.current = currentX;
      lastTime.current = currentTime;
      e.preventDefault();
    };

    const onPointerUp = () => {
      dragging.current = false;
      document.body.style.userSelect = "";
    };

    const onWheel = (e) => {
      e.preventDefault();
      const rawScrollDelta = e.deltaY;
      const scrollIntensity = Math.abs(rawScrollDelta) * 0.002;
      scrollIntensityRef.current = Math.min(1.0, scrollIntensityRef.current + scrollIntensity);
      const scrollDelta = rawScrollDelta * 0.0008;
      scrollVelocityRef.current += scrollDelta;
      scrollVelocityRef.current = Math.max(-MAX_SCROLL_VELOCITY * 0.3, Math.min(MAX_SCROLL_VELOCITY * 0.3, scrollVelocityRef.current));
      const intensityBasedDeformation = scrollIntensityRef.current * 0.03;
      const deformIntensity = Math.max(-MAX_SCROLL_DEFORMATION, Math.min(MAX_SCROLL_DEFORMATION, Math.sign(rawScrollDelta) * intensityBasedDeformation));
      targetDeformationRef.current = deformIntensity;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onPointerDown);
    dom.addEventListener("mousemove", onPointerMove);
    document.addEventListener("mouseup", onPointerUp);
    dom.addEventListener("touchstart", onPointerDown, { passive: false });
    dom.addEventListener("touchmove", onPointerMove, { passive: false });
    document.addEventListener("touchend", onPointerUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("resize", onResize);
      dom.removeEventListener("mousedown", onPointerDown);
      dom.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
      dom.removeEventListener("touchstart", onPointerDown);
      dom.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerUp);
      dom.removeEventListener("wheel", onWheel);
      meshes.forEach((mesh) => { mesh.geometry.dispose(); mesh.material.dispose(); });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [imagesLoaded, images]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const isInside = (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top + 100 && e.clientY <= rect.bottom - 100
      );

      if (isInside && !isInsideBounds.current) {
        isInsideBounds.current = true;
        gsap.to(followerRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
      } else if (!isInside && isInsideBounds.current) {
        isInsideBounds.current = false;
        gsap.to(followerRef.current, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.out" });
      }

      if (isInside) {
        gsap.to(followerRef.current, { x: e.clientX - 50, y: e.clientY - 50, duration: 0.35, ease: "power2.out" });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main
      ref={containerRef}
      className="w-screen h-screen relative overflow-hidden flex items-center justify-center"
      style={{ background: "#f5f5f5", touchAction: "none" }}
    >
      <p className="text-black absolute top-[15%] hidden mobile:block left-1/2 -translate-x-1/2 text-center text-[7vw] font-medium">
        Drag &amp; Swipe
      </p>
      <div
        ref={followerRef}
        className="h-[8vw] w-[8vw] mobile:hidden rounded-full bg-[#ff5f00] text-white flex items-center justify-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          opacity: 0,
          scale: 0.8,
          pointerEvents: "none",
          zIndex: 10000,
          transform: "translate3d(0,0,0)",
        }}
      >
        <p className="text-[1.2vw] w-3/5 text-center font-medium">Drag or Scroll</p>
      </div>
      {!imagesLoaded && (
        <div className="absolute text-gray-800 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-light">
          Loading...
        </div>
      )}
    </main>
  );
}
