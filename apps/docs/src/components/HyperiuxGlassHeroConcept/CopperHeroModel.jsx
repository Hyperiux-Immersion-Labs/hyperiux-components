"use client";

import React, { useMemo, useRef } from "react";
import { Center, Clone, Float, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function CopperGradientMaterial({
  darkColor = "#000000",
  midColor = "#351006",
  orangeColor = "#8f2b0c",
  highlightColor = "#ff6b00",
  rimColor = "#351006",
  grainStrength = 0.035,
  specularStrength = 2.15,
  shimmerStrength = 0.55,
  shimmerWidth = 0.78,
  shimmerSpeed = 0.18,
}) {
  const materialRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDarkColor: { value: new THREE.Color(darkColor) },
      uMidColor: { value: new THREE.Color(midColor) },
      uOrangeColor: { value: new THREE.Color(orangeColor) },
      uHighlightColor: { value: new THREE.Color(highlightColor) },
      uRimColor: { value: new THREE.Color(rimColor) },
      uGrainStrength: { value: grainStrength },
      uSpecularStrength: { value: specularStrength },
      uShimmerStrength: { value: shimmerStrength },
      uShimmerWidth: { value: shimmerWidth },
      uShimmerSpeed: { value: shimmerSpeed },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;

    const u = materialRef.current.uniforms;
    u.uTime.value = state.clock.getElapsedTime();

    u.uDarkColor.value.set(darkColor);
    u.uMidColor.value.set(midColor);
    u.uOrangeColor.value.set(orangeColor);
    u.uHighlightColor.value.set(highlightColor);
    u.uRimColor.value.set(rimColor);

    u.uGrainStrength.value = grainStrength;
    u.uSpecularStrength.value = specularStrength;
    u.uShimmerStrength.value = shimmerStrength;
    u.uShimmerWidth.value = shimmerWidth;
    u.uShimmerSpeed.value = shimmerSpeed;
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      depthWrite
      depthTest
      vertexShader={`
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;
        varying vec3 vViewDirection;
        varying vec3 vObjectPosition;

        void main() {
          vObjectPosition = position;

          vec4 worldPosition = modelMatrix * vec4(position, 1.0);

          vWorldPosition = worldPosition.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vViewDirection = normalize(cameraPosition - worldPosition.xyz);

          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `}
      fragmentShader={`
        precision highp float;

        uniform float uTime;

        uniform vec3 uDarkColor;
        uniform vec3 uMidColor;
        uniform vec3 uOrangeColor;
        uniform vec3 uHighlightColor;
        uniform vec3 uRimColor;

        uniform float uGrainStrength;
        uniform float uSpecularStrength;

        uniform float uShimmerStrength;
        uniform float uShimmerWidth;
        uniform float uShimmerSpeed;

        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;
        varying vec3 vViewDirection;
        varying vec3 vObjectPosition;

        float hash(vec3 p) {
          p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        void main() {
          vec3 normal = normalize(vWorldNormal);
          vec3 viewDir = normalize(vViewDirection);

          vec3 lightDir = normalize(vec3(-0.45, 0.65, 0.75));
          vec3 sideLightDir = normalize(vec3(0.7, -0.25, 0.45));

          float light = max(dot(normal, lightDir), 0.0);
          float sideLight = max(dot(normal, sideLightDir), 0.0);

          float verticalGradient = smoothstep(-1.35, 1.1, vObjectPosition.y);
          float sideGradient = smoothstep(-1.0, 1.0, vObjectPosition.x);
          float depthGradient = smoothstep(-0.8, 0.8, vObjectPosition.z);

          vec3 base = mix(uDarkColor, uMidColor, verticalGradient * 0.85);
          base = mix(base, uOrangeColor, light * 0.42);
          base = mix(base, uHighlightColor, sideLight * 0.18);
          base = mix(base, uOrangeColor, sideGradient * depthGradient * 0.18);

          float diagonal = vWorldPosition.x * 0.65 - vWorldPosition.y * 0.85;
          float shimmerPosition = fract(uTime * uShimmerSpeed) * 5.2 - 2.6;

          float shimmerCore = 1.0 - smoothstep(
            0.0,
            uShimmerWidth,
            abs(diagonal - shimmerPosition)
          );

          float shimmerSpread = 1.0 - smoothstep(
            0.0,
            uShimmerWidth * 2.8,
            abs(diagonal - shimmerPosition)
          );

          float shimmer = shimmerCore * 0.55 + shimmerSpread * 0.5;

          float frontFace = smoothstep(0.18, 0.92, normal.z);
          float shimmerFrontBoost = mix(0.45, 1.45, frontFace);

          float surfaceVisibility = smoothstep(
            0.0,
            0.85,
            light + sideLight + 0.28
          );

          float edgeCatch = pow(
            1.0 - max(dot(normal, viewDir), 0.0),
            1.65
          );

          shimmer *= surfaceVisibility;
          shimmer *= shimmerFrontBoost;
          shimmer += edgeCatch * shimmerSpread * 0.12;

          base += uHighlightColor * shimmer * uShimmerStrength;

          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.9);
          base += uRimColor * fresnel * 0.2;

          vec3 halfDir = normalize(lightDir + viewDir);
          float spec = pow(max(dot(normal, halfDir), 0.0), 58.0);
          base += uHighlightColor * spec * uSpecularStrength;

          float innerShadow = smoothstep(0.2, 1.0, 1.0 - abs(normal.z));
          base = mix(base, uDarkColor, innerShadow * 0.34);

          float grain = hash(vObjectPosition * 120.0);
          base += (grain - 0.5) * uGrainStrength;

          base *= 0.68;
          base = pow(base, vec3(1.08));

          gl_FragColor = vec4(base, 1.0);
        }
      `}
    />
  );
}

export default function CopperHeroModel({
  src = "/assets/models/hyperiux-new-model.glb",
  position = [0, 0, 1.4],
  rotation = [0.1, 0.2, 0],
  scale = 0.075,
  thickness = 1.45,

  cursorFollow = true,
  cursorRotationStrength = 0.22,
  cursorPositionStrength = 0.08,
  cursorLerp = 0.055,

  darkColor = "#000000",
  midColor = "#351006",
  orangeColor = "#8f2b0c",
  highlightColor = "#ff6b00",
  rimColor = "#351006",

  grainStrength = 0.035,
  specularStrength = 2.15,

  shimmerStrength = 0.55,
  shimmerWidth = 0.78,
  shimmerSpeed = 0.18,
}) {
  const groupRef = useRef(null);
  const smoothPointerRef = useRef(new THREE.Vector2(0, 0));
  const targetPointerRef = useRef(new THREE.Vector2(0, 0));

  const { scene } = useGLTF(src);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current || !cursorFollow) return;

    targetPointerRef.current.set(pointer.x, pointer.y);
    smoothPointerRef.current.lerp(targetPointerRef.current, cursorLerp);

    groupRef.current.rotation.y =
      rotation[1] + smoothPointerRef.current.x * cursorRotationStrength;

    groupRef.current.rotation.x =
      rotation[0] - smoothPointerRef.current.y * cursorRotationStrength * 0.5;

    groupRef.current.position.x =
      position[0] + smoothPointerRef.current.x * cursorPositionStrength;

    groupRef.current.position.y =
      position[1] + smoothPointerRef.current.y * cursorPositionStrength * 0.35;
  });

  return (
    <Float speed={1} floatIntensity={0.12} rotationIntensity={0.08}>
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
              <CopperGradientMaterial
                darkColor={darkColor}
                midColor={midColor}
                orangeColor={orangeColor}
                highlightColor={highlightColor}
                rimColor={rimColor}
                grainStrength={grainStrength}
                specularStrength={specularStrength}
                shimmerStrength={shimmerStrength}
                shimmerWidth={shimmerWidth}
                shimmerSpeed={shimmerSpeed}
              />
            }
          />
        </Center>
      </group>
    </Float>
  );
}