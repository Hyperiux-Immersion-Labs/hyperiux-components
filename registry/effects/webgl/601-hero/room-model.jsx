'use client'

import React, { useRef, useEffect, useCallback } from "react";
import {
  useGLTF,
  useTexture,
  MeshReflectorMaterial,
  useVideoTexture,
  shaderMaterial,
} from "@react-three/drei";
import { useThree, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const TVTransitionMaterial = shaderMaterial(
  {
    uTexA: null,
    uTexB: null,
    uProgress: 0,
    uOffset: new THREE.Vector2(),
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform sampler2D uTexA;
    uniform sampler2D uTexB;
    uniform float uProgress;
    uniform float uTime;
    uniform vec2 uOffset;
    varying vec2 vUv;

    vec2 pixelate(vec2 uv, float pixelSize) {
      return floor(uv / pixelSize) * pixelSize + pixelSize * 0.5;
    }

    void main() {
      vec2 uv = vUv;
      float p = clamp(uProgress, 0.0, 1.0);

      uv += uOffset * 0.05;

      float maxPixelSize = 0.2;
      float pixelSizeA = mix(0.0, maxPixelSize, smoothstep(0.0, 1.0, p));
      float pixelSizeB = mix(maxPixelSize, 0.0, smoothstep(0.0, 1.0, p));

      vec2 uvA = (uv - 0.5) * (1.0 + p * 0.05) + 0.5;
      vec2 uvB = (uv - 0.5) * (1.05 - p * 0.05) + 0.5;

      uvA = pixelate(uvA, max(pixelSizeA, 0.0001));
      uvB = pixelate(uvB, max(pixelSizeB, 0.0001));

      vec4 texA = texture2D(uTexA, uvA);
      vec4 texB = texture2D(uTexB, uvB);

      float fade = smoothstep(0.0, 1.0, p);
      vec4 col = mix(texA, texB, fade);

      gl_FragColor = col;

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

extend({ TVTransitionMaterial });

export default function RoomModel({ onClick, isZoomed, videoRef, ...props }) {
  const groupRef = useRef();
  const tvMatRef = useRef();
  const { gl } = useThree();

  const { nodes } = useGLTF("/601/finall.glb");

  const TVtexture = useTexture("/601/tvtex2.png");
  TVtexture.colorSpace = THREE.SRGBColorSpace;
  TVtexture.flipY = false;

  const videoTexture = useVideoTexture(
    "https://media.fiddle.digital/uploads/feature_kaleida_f406072b29.mp4",
    { start: false }
  );
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  videoTexture.flipY = false;

  useEffect(() => {
    if (!videoTexture?.image) return;
    videoRef.current = videoTexture.image;
    videoTexture.image.preload = "auto";
    videoTexture.image.load();
  }, [videoTexture]);

  useEffect(() => {
    if (!videoTexture?.image) return;
    if (isZoomed) {
      setTimeout(() => { videoTexture.image.play(); }, 300);
    } else {
      videoTexture.image.pause();
    }
  }, [isZoomed]);

  const progressRef = useRef({ value: 0 });
  const animate = useRef();

  useEffect(() => {
    animate.current = gsap.quickTo(progressRef.current, "value", {
      duration: 1.5,
      ease: "power4.inOut",
    });
  }, []);

  useEffect(() => {
    animate.current?.(isZoomed ? 1 : 0);
  }, [isZoomed]);

  const targetRot = useRef({ x: 0, y: 0 });
  const targetOffset = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (e) => {
      if (isZoomed) return;
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRot.current.x = -y * 0.05;
      targetRot.current.y = x * 0.15;
      targetOffset.current.x = x * 0.04;
      targetOffset.current.y = y * 0.02;
    },
    [gl, isZoomed]
  );

  useEffect(() => {
    gl.domElement.addEventListener("mousemove", handlePointerMove);
    return () => gl.domElement.removeEventListener("mousemove", handlePointerMove);
  }, [handlePointerMove, gl]);

  useEffect(() => {
    if (isZoomed) {
      gsap.to(targetRot.current, { x: 0, y: 0, duration: 0.5, overwrite: true, ease: "power3.out" });
      gsap.to(targetOffset.current, { x: 0, y: 0, duration: 0.5, overwrite: true, ease: "power3.out" });
    }
  }, [isZoomed]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += (targetRot.current.x - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRot.current.y - groupRef.current.rotation.y) * 0.05;
    }
    offsetRef.current.x += (targetOffset.current.x - offsetRef.current.x) * 0.08;
    offsetRef.current.y += (targetOffset.current.y - offsetRef.current.y) * 0.08;
    if (tvMatRef.current) {
      tvMatRef.current.uOffset.set(offsetRef.current.x, offsetRef.current.y);
      tvMatRef.current.uTime += delta;
      tvMatRef.current.uProgress = progressRef.current.value;
    }
  });

  const normalMap = useTexture("/601/normal.webp");
  normalMap.colorSpace = THREE.NoColorSpace;

  const baseMat = {
    color: "#000",
    normalMap,
    normalScale: new THREE.Vector2(0.3, 0.3),
    roughness: 10.0,
    side: THREE.DoubleSide,
  };

  const roughnessMap = useTexture(
    "https://png.pngtree.com/png-clipart/20241204/original/pngtree-textured-background-of-bathroom-floor-tiles-png-image_17548659.png"
  );
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(4, 4);

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh geometry={nodes.room.geometry}>
        <meshStandardMaterial {...baseMat} />
      </mesh>
      <mesh geometry={nodes.Door.geometry}>
        <meshStandardMaterial {...baseMat} />
      </mesh>
      <mesh position={[0, 0, 1]} geometry={nodes.ladder.geometry}>
        <meshStandardMaterial {...baseMat} />
      </mesh>
      <mesh geometry={nodes.Body4002.geometry}>
        <meshStandardMaterial {...baseMat} />
      </mesh>
      <mesh geometry={nodes.Body4002_1.geometry}>
        <meshStandardMaterial {...baseMat} />
      </mesh>
      <mesh geometry={nodes.Body4002_2.geometry}>
        <meshStandardMaterial {...baseMat} />
      </mesh>

      <group
        onClick={onClick}
        onPointerEnter={() => (document.body.style.cursor = "pointer")}
        onPointerLeave={() => (document.body.style.cursor = "auto")}
      >
        <mesh geometry={nodes.screen.geometry}>
          <meshStandardMaterial {...baseMat} />
        </mesh>
        <mesh geometry={nodes.tv.geometry}>
          <tVTransitionMaterial
            ref={tvMatRef}
            uTexA={TVtexture}
            uTexB={videoTexture}
          />
        </mesh>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[4.2, 10]} />
        <MeshReflectorMaterial
          resolution={1024}
          blur={[200, 50]}
          mixBlur={2}
          mixStrength={100}
          roughness={0.1}
          distortionMap={roughnessMap}
          distortion={0.0}
          reflectorOffset={0}
          color="#111"
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}
