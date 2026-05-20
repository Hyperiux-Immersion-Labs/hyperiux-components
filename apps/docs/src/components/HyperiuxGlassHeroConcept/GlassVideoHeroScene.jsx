"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  Center,
  Clone,
  Float,
  MeshTransmissionMaterial,
  useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function VideoPlane({
  src = "/assets/models/bg-video.mp4",
  position = [0, 0, 0],
  scale = [7.2, 4.1, 1],
}) {
  const videoRef = useRef(null);

  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;

    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    videoRef.current = video;

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;

    return tex;
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    video.play().catch(() => {});

    return () => {
      video.pause();
      video.src = "";
      video.load();
    };
  }, []);

  if (!texture) return null;

  return (
    <mesh position={position} scale={scale} frustumCulled={false}>
      <planeGeometry args={[7, 5]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        depthWrite={false}
        depthTest={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function GlassLogoModel({
  src = "/assets/models/hyperiexLogoNo2.glb",
  position = [0, 0, 1.25],
  rotation = [0, 0, 0],
  scale = 0.07,
  thickness = 2,
}) {
  const groupRef = useRef(null);
  const pointerRef = useRef(new THREE.Vector2(0, 0));
  const smoothPointerRef = useRef(new THREE.Vector2(0, 0));
  const { scene } = useGLTF(src);

  useEffect(() => {
    const handleMove = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    smoothPointerRef.current.lerp(pointerRef.current, 0.055);

    groupRef.current.rotation.y = rotation[1] + smoothPointerRef.current.x * 0.18;
    groupRef.current.rotation.x = rotation[0] - smoothPointerRef.current.y * 0.06;

    groupRef.current.position.x = position[0] + smoothPointerRef.current.x * 0.06;
    groupRef.current.position.y = position[1] + smoothPointerRef.current.y * 0.02;
  });

  return (
    <Float speed={1} floatIntensity={0.08} rotationIntensity={0.04}>
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={[scale, scale, scale * thickness]}
      >
        <Center>
          <Clone
            object={scene}
            inject={
              <MeshTransmissionMaterial
                color="#ffffff"
                transmission={1}
                thickness={0.75}
                roughness={0.03}
                ior={1.2}
                chromaticAberration={0.22}
                anisotropy={0.35}
                distortion={0.2}
                distortionScale={0.4}
                temporalDistortion={0}
                backside
                samples={16}
                resolution={768}
                transparent
                opacity={1}
                depthWrite={false}
                depthTest
                attenuationDistance={3}
                attenuationColor="#ffffff"
              />
            }
          />
        </Center>
      </group>
    </Float>
  );
}

export default function GlassVideoHeroScene() {
  return (
    <>
      <VideoPlane
        src="/assets/models/bg-video.mp4"
        position={[0, 0, 0]}
        scale={[1, 1, 1]}
      />

      <ambientLight intensity={1.5} />
      <pointLight position={[0, -2, 3]} intensity={4} color="#ff6b1a" />
      <pointLight position={[2.5, 2, 3]} intensity={3} color="#ffffff" />

      <GlassLogoModel
        src="/assets/models/hyperiexLogoNo2.glb"
        scale={0.07}
        thickness={2}
        position={[0, 0, 1.25]}
        rotation={[0, 0, 0]}
      />
    </>
  );
}