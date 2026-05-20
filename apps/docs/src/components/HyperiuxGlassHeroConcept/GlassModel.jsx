"use client";

import React, { useEffect, useRef } from "react";
import {
  Center,
  Clone,
  Environment,
  Float,
  MeshTransmissionMaterial,
  useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GlassModel({
  src = "/assets/models/hyperiexLogoNo2.glb",
  position = [0, 0, 1.4],
  rotation = [0, 0, 0],
  scale = 0.07,
  thickness = 2,

  cursorFollow = true,
  cursorRotationStrength = 0.28,
  cursorPositionStrength = 0.12,
  cursorLerp = 0.055,

  glassColor = "#ffffff",
  transmission = 1,
  glassThickness = 1.15,
  roughness = 0.0,
  ior = 1.12,
  chromaticAberration = 0.42,
  anisotropy = 0.45,
  distortion = 0.32,
  distortionScale = 0.55,
  temporalDistortion = 0.0,
  backside = true,
}) {
  const groupRef = useRef(null);
  const pointerRef = useRef(new THREE.Vector2(0, 0));
  const smoothPointerRef = useRef(new THREE.Vector2(0, 0));

  const { scene } = useGLTF(src);

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      child.renderOrder = 20;
      child.frustumCulled = false;
    });
  }, [scene]);

  useEffect(() => {
    const handleMove = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current || !cursorFollow) return;

    smoothPointerRef.current.lerp(pointerRef.current, cursorLerp);

    groupRef.current.rotation.y =
      rotation[1] + smoothPointerRef.current.x * cursorRotationStrength;

    groupRef.current.rotation.x =
      rotation[0] - smoothPointerRef.current.y * cursorRotationStrength * 0.45;

    groupRef.current.position.x =
      position[0] + smoothPointerRef.current.x * cursorPositionStrength;

    groupRef.current.position.y =
      position[1] + smoothPointerRef.current.y * cursorPositionStrength * 0.3;
  });

  return (
    <>
      <Environment preset="studio" environmentIntensity={1.4} />

      <Float speed={1} floatIntensity={0.1} rotationIntensity={0.06}>
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
                  color={glassColor}
                  transmission={transmission}
                  thickness={glassThickness}
                  roughness={roughness}
                  ior={ior}
                  chromaticAberration={chromaticAberration}
                  anisotropy={anisotropy}
                  distortion={distortion}
                  distortionScale={distortionScale}
                  temporalDistortion={temporalDistortion}
                  backside={backside}
                  samples={24}
                  resolution={1024}
                  transparent
                  opacity={1}
                  depthWrite={false}
                  depthTest={true}
                  attenuationDistance={2.5}
                  attenuationColor="#ffffff"
                  clearcoat={1}
                  clearcoatRoughness={0}
                />
              }
            />
          </Center>
        </group>
      </Float>
    </>
  );
}