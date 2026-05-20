"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

// GLSL Shaders
const vertexShader = `
uniform vec2 uOffset;
varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795

void main() {
  vUv = uv;
  vec3 newPosition = position;

  float edgeIntensity = abs(uv.y - 0.5) * 2.0;
  newPosition.y += sin(uv.x * M_PI) * uOffset.y * edgeIntensity;

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
   float scaleAmount = 2.0;
   coveredUv = center + (coveredUv - center) / scaleAmount;
   
   vec4 texColor = texture2D(uTexture, coveredUv);
   gl_FragColor = vec4(texColor.rgb, texColor.a * uAlpha);
}
`;

const column1Images = [
  "/assets/img/image01.webp",
  "/assets/img/image02.webp",
  "/assets/img/image03.webp",
  "/assets/img/image04.png",
  "/assets/img/image05.png",
];

const column2Images = [
  "/assets/img/image01.webp",
  "/assets/img/image02.webp",
  "/assets/img/image03.webp",
  "/assets/img/image04.png",
  "/assets/img/image05.png",
];

const column3Images = [
  "/assets/img/image01.webp",
  "/assets/img/image02.webp",
  "/assets/img/image03.webp",
  "/assets/img/image04.png",
  "/assets/img/image05.png",
];

const columnImages = [column1Images, column2Images, column3Images];
const allImages = [...column1Images, ...column2Images, ...column3Images];

const VISIBLE_ROWS = 6;
const NUM_COLUMNS = 3;
const FIXED_IMAGE_WIDTH = 280;
const FIXED_IMAGE_HEIGHT = 380;
const SPACING_X = FIXED_IMAGE_WIDTH + 150;
const SPACING_Y = FIXED_IMAGE_HEIGHT + 80;

const DEFORMATION_INTENSITY = 8;
const DEFORMATION_SENSITIVITY = 0.02;
const DEFORMATION_SMOOTHNESS = 0.12;
const DRAG_SENSITIVITY = 2.2;
const MOMENTUM_FRICTION = 0.90;        // reduced from 0.94
const SCROLL_SMOOTHNESS = 0.05;        // reduced from 0.08
const MAX_SCROLL_VELOCITY = 0.05;      // reduced from 0.1
const MAX_DEFORMATION = .1;

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

const CurvedSwiperVertical = ({ routes }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const meshesRef = useRef([]);
  const texturesRef = useRef([]);
  const lastScrollTime = useRef(0);
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const deformationRef = useRef(0);
  const targetDeformationRef = useRef(0);
  const dragging = useRef(false);
  const lastY = useRef(0);
  const lastTime = useRef(Date.now());

  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    let loaded = 0;

    allImages.forEach((src, idx) => {
      loader.load(
        src,
        (tex) => {
          texturesRef.current[idx] = tex;
          if (++loaded === allImages.length) setImagesLoaded(true);
        },
        undefined,
        (err) => {
          console.error("Failed to load texture:", err);
          texturesRef.current[idx] = null;
          if (++loaded === allImages.length) setImagesLoaded(true);
        }
      );
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const container = containerRef.current;
    const viewHeight = window.innerHeight;
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
    const totalMeshes = (VISIBLE_ROWS + 2) * NUM_COLUMNS;

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

    const isTablet = () => viewWidth >= 768 && viewWidth <= 1024;

    const updateMeshes = () => {
      const offset = offsetRef.current;
      const deform = deformationRef.current;
      const tablet = isTablet();

      meshes.forEach((mesh, i) => {
        const col = i % NUM_COLUMNS;
        const row = Math.floor(i / NUM_COLUMNS);

        if (tablet && col === 1) {
          mesh.visible = false;
          return;
        } else {
          mesh.visible = true;
        }

        const currentColumnImages = columnImages[col];
        
        const scrollPosition = offset + row;
        const imgIndex = Math.floor(scrollPosition) % currentColumnImages.length;
        const normalizedIndex = imgIndex < 0 ? imgIndex + currentColumnImages.length : imgIndex;

        const globalTextureIndex = column1Images.length * col + normalizedIndex;
        const texture = texturesRef.current[globalTextureIndex];
        
        if (texture) {
          mesh.material.uniforms.uTexture.value = texture;
          mesh.material.uniforms.uTextureSize.value.set(
            texture.image.naturalWidth || texture.image.width,
            texture.image.naturalHeight || texture.image.height
          );
        }

        let xPos;
        if (tablet) {
          if (col === 0) {
            xPos = -SPACING_X / 2;
          } else if (col === 2) {
            xPos = SPACING_X / 2;
          }
        } else {
          xPos = (col - 1) * SPACING_X;
        }
        
        const baseY = (row - VISIBLE_ROWS / 2) * SPACING_Y;
        const yOffset = (offset - Math.floor(offset)) * SPACING_Y;
        
        const direction = col === 1 ? -1 : 1;
        const yPos = (baseY - yOffset) * direction;

        mesh.position.set(xPos, yPos, 0);

        // Always full opacity — no fading
        mesh.material.uniforms.uAlpha.value = 1.0;

        const deformDirection = direction;
        mesh.material.uniforms.uOffset.value.set(
          0,
          deform * DEFORMATION_INTENSITY * deformDirection
        );
      });
    };

    const animate = () => {
      if (!dragging.current && Math.abs(velocityRef.current) > 0.001) {
        targetOffsetRef.current += velocityRef.current;
        velocityRef.current *= MOMENTUM_FRICTION;
      }

      const now = Date.now();
      const isRecentlyScrolled = now - lastScrollTime.current < 100;

      if (!dragging.current && !isRecentlyScrolled) {
        targetDeformationRef.current = 0;
      }

      offsetRef.current = lerp(
        offsetRef.current,
        targetOffsetRef.current,
        SCROLL_SMOOTHNESS
      );
      deformationRef.current = lerp(
        deformationRef.current,
        targetDeformationRef.current,
        DEFORMATION_SMOOTHNESS
      );

      updateMeshes();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const viewHeight = window.innerHeight;
      const viewWidth = window.innerWidth;
      camera.aspect = viewWidth / viewHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(viewWidth, viewHeight);
    };
    window.addEventListener("resize", onResize);

    const getPointerY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);

    const onPointerDown = (e) => {
      dragging.current = true;
      lastY.current = getPointerY(e);
      lastTime.current = Date.now();
      velocityRef.current = 0;
      document.body.style.userSelect = "none";
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (!dragging.current) return;
      const currentY = getPointerY(e);
      const currentTime = Date.now();
      const dy = currentY - lastY.current;
      const dt = Math.max(currentTime - lastTime.current, 1);

      const delta = (dy / SPACING_Y) * DRAG_SENSITIVITY;
      targetOffsetRef.current -= delta;

      const instantVelocity = dy / dt;
      velocityRef.current = Math.max(
        -MAX_SCROLL_VELOCITY,
        Math.min(MAX_SCROLL_VELOCITY, -delta / (dt / 16))
      );

      const deformIntensity = Math.max(
        -MAX_DEFORMATION,
        Math.min(MAX_DEFORMATION, instantVelocity * DEFORMATION_SENSITIVITY)
      );
      targetDeformationRef.current = deformIntensity;

      lastY.current = currentY;
      lastTime.current = currentTime;
      e.preventDefault();
    };

    const onPointerUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    const onWheel = (e) => {
      const delta = e.deltaY / 100;
      targetOffsetRef.current += delta * 0.12;   // reduced from 0.25

      velocityRef.current = Math.max(
        -MAX_SCROLL_VELOCITY,
        Math.min(MAX_SCROLL_VELOCITY, delta * 0.15)  // reduced from 0.4
      );

      const deformIntensity = Math.max(
        -MAX_DEFORMATION,
        Math.min(MAX_DEFORMATION, delta * DEFORMATION_SENSITIVITY)
      );
      targetDeformationRef.current = deformIntensity;

      lastScrollTime.current = Date.now();
    };

    const dom = renderer.domElement;
    
    dom.addEventListener("mousedown", onPointerDown);
    dom.addEventListener("mousemove", onPointerMove);
    document.addEventListener("mouseup", onPointerUp);
    dom.addEventListener("touchstart", onPointerDown, { passive: false });
    dom.addEventListener("touchmove", onPointerMove, { passive: false });
    document.addEventListener("touchend", onPointerUp);
    dom.addEventListener("wheel", onWheel);

    return () => {
      window.removeEventListener("resize", onResize);
      dom.removeEventListener("mousedown", onPointerDown);
      dom.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
      dom.removeEventListener("touchstart", onPointerDown);
      dom.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerUp);
      dom.removeEventListener("wheel", onWheel);

      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [imagesLoaded]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const followerRef = useRef(null);
  const lastMouseMoveTime = useRef(Date.now());
  const isFollowerVisible = useRef(false);

  useEffect(() => {
    const getSwiperBounds = () => {
      const viewWidth = window.innerWidth;
      const isTablet = viewWidth >= 768 && viewWidth <= 1024;
      const centerX = viewWidth / 2;

      const numCols = isTablet ? 2 : 3;
      const totalWidth = numCols * FIXED_IMAGE_WIDTH + (numCols - 1) * 150;

      return {
        left: centerX - totalWidth / 2,
        right: centerX + totalWidth / 2,
      };
    };

    const handleMouseMove = (e) => {
      const { left, right } = getSwiperBounds();
      const isOverSwiper = e.clientX >= left && e.clientX <= right;

      gsap.to(followerRef.current, {
        x: e.clientX - 50,
        y: e.clientY - 50,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (isOverSwiper && !isFollowerVisible.current) {
        isFollowerVisible.current = true;
        gsap.to(followerRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      } else if (!isOverSwiper && isFollowerVisible.current) {
        isFollowerVisible.current = false;
        gsap.to(followerRef.current, {
          opacity: 0,
          scale: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      isFollowerVisible.current = false;
      gsap.to(followerRef.current, {
        opacity: 0,
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className="w-screen h-screen relative overflow-hidden flex items-center justify-center"
      id="curved-swiper-vertical"
      style={{ background: "white", touchAction: "none" }}
    >
      <div
        ref={followerRef}
        className="h-[8vw] w-[8vw] mobile:hidden rounded-full bg-[#ff5f00] text-white flex items-center justify-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 10000,
          transform: "translate3d(0,0,0)",
          opacity: 0,
        }}
      >
        <p className="text-[1.2vw] text-center w-[70%] font-medium">Drag or Scroll</p>
      </div>
      {!imagesLoaded && (
        <div className="absolute text-black left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-light">
          Loading...
        </div>
      )}
    </main>
  );
};

export default CurvedSwiperVertical;