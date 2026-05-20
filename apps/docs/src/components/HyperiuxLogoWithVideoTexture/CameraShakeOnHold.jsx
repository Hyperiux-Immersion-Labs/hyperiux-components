"use client";

import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function CameraShakeOnHold({
  actionPhase = "idle",
  intensity = 0.045,
  rotationIntensity = 0.01,
  frequency = 18,
  smooth = 0.08,
}) {
  const { camera, clock } = useThree();

  const basePositionRef = useRef(new THREE.Vector3());
  const baseRotationRef = useRef(new THREE.Euler());
  const initializedRef = useRef(false);

  const offsetPosRef = useRef(new THREE.Vector3());
  const offsetRotRef = useRef(new THREE.Euler());

  useEffect(() => {
    if (!initializedRef.current) {
      basePositionRef.current.copy(camera.position);
      baseRotationRef.current.copy(camera.rotation);
      initializedRef.current = true;
    }
  }, [camera]);

  useFrame(() => {
    if (!initializedRef.current) return;

    const isHolding = actionPhase === "holding";
    const t = clock.elapsedTime;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;

    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;

    if (isHolding) {
      targetX =
        Math.sin(t * frequency) * intensity +
        Math.sin(t * frequency * 1.73) * intensity * 0.35;

      targetY =
        Math.cos(t * frequency * 1.21) * intensity * 0.8 +
        Math.sin(t * frequency * 2.11) * intensity * 0.25;

      targetZ =
        Math.sin(t * frequency * 0.87) * intensity * 0.4 +
        Math.cos(t * frequency * 1.57) * intensity * 0.18;

      targetRotX =
        Math.sin(t * frequency * 0.92) * rotationIntensity +
        Math.cos(t * frequency * 1.41) * rotationIntensity * 0.35;

      targetRotY =
        Math.cos(t * frequency * 1.16) * rotationIntensity * 0.8 +
        Math.sin(t * frequency * 1.83) * rotationIntensity * 0.25;

      targetRotZ =
        Math.sin(t * frequency * 1.37) * rotationIntensity * 0.6;
    }

    offsetPosRef.current.x = THREE.MathUtils.lerp(
      offsetPosRef.current.x,
      targetX,
      smooth
    );
    offsetPosRef.current.y = THREE.MathUtils.lerp(
      offsetPosRef.current.y,
      targetY,
      smooth
    );
    offsetPosRef.current.z = THREE.MathUtils.lerp(
      offsetPosRef.current.z,
      targetZ,
      smooth
    );

    offsetRotRef.current.x = THREE.MathUtils.lerp(
      offsetRotRef.current.x,
      targetRotX,
      smooth
    );
    offsetRotRef.current.y = THREE.MathUtils.lerp(
      offsetRotRef.current.y,
      targetRotY,
      smooth
    );
    offsetRotRef.current.z = THREE.MathUtils.lerp(
      offsetRotRef.current.z,
      targetRotZ,
      smooth
    );

    camera.position.set(
      basePositionRef.current.x + offsetPosRef.current.x,
      basePositionRef.current.y + offsetPosRef.current.y,
      basePositionRef.current.z + offsetPosRef.current.z
    );

    camera.rotation.set(
      baseRotationRef.current.x + offsetRotRef.current.x,
      baseRotationRef.current.y + offsetRotRef.current.y,
      baseRotationRef.current.z + offsetRotRef.current.z
    );
  });

  return null;
}