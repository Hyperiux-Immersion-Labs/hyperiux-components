"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CubeVisual } from "./CubeVisual";

function cubicBezierEase(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t) => (3 * ax * t + 2 * bx) * t + cx;

  const solveCurveX = (x) => {
    let t2 = x;

    for (let i = 0; i < 8; i++) {
      const x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < 1e-6) return t2;
      const d2 = sampleCurveDerivativeX(t2);
      if (Math.abs(d2) < 1e-6) break;
      t2 -= x2 / d2;
    }

    let t0 = 0;
    let t1 = 1;
    t2 = x;

    while (t0 < t1) {
      const x2 = sampleCurveX(t2);
      if (Math.abs(x2 - x) < 1e-6) return t2;
      if (x > x2) t0 = t2;
      else t1 = t2;
      t2 = (t1 - t0) * 0.5 + t0;
    }

    return t2;
  };

  return (x) => sampleCurveY(solveCurveX(x));
}

const explosionEase = cubicBezierEase(0, 0.94, 0.51, 0.96);
const reformEase = cubicBezierEase(0.54, 0.05, 0.66, 0.72);

function deterministicNoise(x, y, z) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

function ParticleCube({
  data,
  texture,
  videoTexture,
  
  registerRef,
  faceColor = "#1a1a1a",
  outlineColor = "#ffffff",
}) {
  const localRef = useRef(null);

  useEffect(() => {
    const node = localRef.current;
    if (!node) return;

    node.position.copy(data.position);
    node.quaternion.copy(data.quaternion);
    node.scale.copy(data.scale);
  }, [data]);

  return (
    <group
      ref={(node) => {
        localRef.current = node;
        registerRef(node);
      }}
    >
      <CubeVisual
        texture={texture}
        videoTexture={videoTexture}
        faceColor={faceColor}
        outlineColor={outlineColor}
      />
    </group>
  );
}

export function InteractiveParticles({
  particles,
  texture,
  interactionGroupRef,
  interactionRadius = 1.1,
  maxShrink = 0.7,
  minScaleMultiplier = 0.2,
  scaleLerp = 0.12,
  parallaxPositionStrength = 0.12,
  parallaxRotationStrength = 0.12,
  outlineColor = "#ffffff",
  faceColor = "#1a1a1a",
videoTexture,
  actionPhase = "idle",
  burstKey = 0,
  explosionDuration = 3,
  reformDuration = 2.5,
  holdShakeAmount = 0.08,
  holdShakeSpeed = 22,
  explosionSpreadX = 16,
  explosionSpreadY = 10,
  explosionForwardMin = 2,
  explosionForwardMax = 5,
  explosionBackwardMin = 1.5,
  explosionBackwardMax = 4,
  explosionRotateMax = 2.2,
}) {
  const particleRefs = useRef([]);
  const hoveredRef = useRef(false);
  const { camera, pointer, viewport, clock } = useThree();

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(), []);
  const worldPoint = useMemo(() => new THREE.Vector3(), []);
  const localPoint = useMemo(() => new THREE.Vector3(), []);
  const groupWorldPos = useMemo(() => new THREE.Vector3(), []);
  const planeNormal = useMemo(() => new THREE.Vector3(), []);

  const basePositionRef = useRef(new THREE.Vector3());
  const baseQuatRef = useRef(new THREE.Quaternion());
  const targetEuler = useMemo(() => new THREE.Euler(), []);
  const targetQuat = useMemo(() => new THREE.Quaternion(), []);
  const initializedRef = useRef(false);

  const phaseStartRef = useRef(0);
  const burstTracksRef = useRef([]);

  const registerRef = useCallback((index) => {
    return (node) => {
      if (node) {
        particleRefs.current[index] = node;
      }
    };
  }, []);

  useEffect(() => {
    phaseStartRef.current = performance.now() / 1000;
  }, [actionPhase]);

  useEffect(() => {
    const width = viewport.width + explosionSpreadX;
    const height = viewport.height + explosionSpreadY;

    burstTracksRef.current = particles.map((base, index) => {
      const bx = base.position.x;
      const by = base.position.y;
      const bz = base.position.z;

      const n1 = deterministicNoise(bx * 0.91, by * 1.13, bz * 1.37);
      const n2 = deterministicNoise(bx * 1.71, by * 0.77, bz * 1.91);
      const n3 = deterministicNoise(bx * 2.11, by * 1.43, bz * 0.63);
      const n4 = deterministicNoise(bx * 1.27, by * 2.21, bz * 1.05);
      const n5 = deterministicNoise(bx * 0.57, by * 1.59, bz * 2.47);
      const n6 = deterministicNoise(bx * 2.73, by * 0.89, bz * 1.31);

      const explodedX = (n1 * 2 - 1) * width * 0.9;
      const explodedY = (n2 * 2 - 1) * height * 0.9;

      const explodedZ =
        n3 > 0.5
          ? THREE.MathUtils.lerp(
              explosionForwardMin,
              explosionForwardMax,
              (n3 - 0.5) * 2,
            )
          : THREE.MathUtils.lerp(
              explosionBackwardMin,
              explosionBackwardMax,
              n3 * 2,
            );

      return {
        seed: n4 * 1000 + index * 0.01,
        explodedPosition: new THREE.Vector3(explodedX, explodedY, explodedZ),
        explodedRotation: new THREE.Euler(
          THREE.MathUtils.lerp(-explosionRotateMax, explosionRotateMax, n4),
          THREE.MathUtils.lerp(-explosionRotateMax, explosionRotateMax, n5),
          THREE.MathUtils.lerp(-explosionRotateMax, explosionRotateMax, n6),
        ),
      };
    });
  }, [
    burstKey,
    particles,
    viewport.width,
    viewport.height,
    explosionSpreadX,
    explosionSpreadY,
    explosionForwardMin,
    explosionForwardMax,
    explosionBackwardMin,
    explosionBackwardMax,
    explosionRotateMax,
  ]);

  useFrame(() => {
    const group = interactionGroupRef.current;
    if (!group) return;

    if (!initializedRef.current) {
      basePositionRef.current.copy(group.position);
      baseQuatRef.current.copy(group.quaternion);
      initializedRef.current = true;
    }

    const now = performance.now() / 1000;
    const phaseElapsed = now - phaseStartRef.current;

    const isIdle = actionPhase === "idle";
    const isHolding = actionPhase === "holding";
    const isExploding = actionPhase === "exploding";
    const isReforming = actionPhase === "reforming";

    group.getWorldPosition(groupWorldPos);
    camera.getWorldDirection(planeNormal).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, groupWorldPos);

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.ray.intersectPlane(plane, worldPoint);

    if (hit) {
      localPoint.copy(worldPoint);
      group.worldToLocal(localPoint);
    }

    const targetPosX =
      basePositionRef.current.x +
      (isHolding ? 0 : pointer.x * parallaxPositionStrength);
    const targetPosY =
      basePositionRef.current.y +
      (isHolding ? 0 : pointer.y * parallaxPositionStrength);

    group.position.x = THREE.MathUtils.lerp(group.position.x, targetPosX, 0.08);
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetPosY, 0.08);

    targetEuler.set(
      isHolding ? 0 : -pointer.y * parallaxRotationStrength,
      isHolding ? 0 : pointer.x * parallaxRotationStrength,
      0,
      "XYZ",
    );

    targetQuat
      .copy(baseQuatRef.current)
      .multiply(new THREE.Quaternion().setFromEuler(targetEuler));

    group.quaternion.slerp(targetQuat, 0.08);

    for (let i = 0; i < particles.length; i++) {
      const ref = particleRefs.current[i];
      if (!ref) continue;

      const base = particles[i];
      const track = burstTracksRef.current[i];
      const baseScale = base.scale;

      if (!track) continue;

      let pos = base.position.clone();
      let rotX = 0;
      let rotY = 0;
      let rotZ = 0;

      if (isHolding) {
        const tt = clock.elapsedTime * holdShakeSpeed + track.seed;
        pos.x += Math.sin(tt) * holdShakeAmount;
        pos.y += Math.cos(tt * 1.1) * holdShakeAmount;
        pos.z += Math.sin(tt * 0.9) * holdShakeAmount * 0.5;
      } else if (isExploding) {
        const t = Math.min(phaseElapsed / explosionDuration, 1);
        const eased = explosionEase(t);

        pos = base.position.clone().lerp(track.explodedPosition, eased);
        rotX = track.explodedRotation.x * eased;
        rotY = track.explodedRotation.y * eased;
        rotZ = track.explodedRotation.z * eased;
      } else if (isReforming) {
        const rawT = phaseElapsed / reformDuration;
        const t = Math.min(rawT, 1);
        const eased = reformEase(t);

        if (t >= 1) {
          pos = base.position.clone();
          rotX = 0;
          rotY = 0;
          rotZ = 0;
        } else {
          pos = track.explodedPosition.clone().lerp(base.position, eased);
          rotX = track.explodedRotation.x * (1 - eased);
          rotY = track.explodedRotation.y * (1 - eased);
          rotZ = track.explodedRotation.z * (1 - eased);
        }
      }

      ref.position.copy(pos);
      ref.rotation.set(rotX, rotY, rotZ);

      let targetMultiplier = 1;

      if ((isIdle || isHolding) && hoveredRef.current && hit) {
        const dist = base.position.distanceTo(localPoint);

        if (dist < interactionRadius) {
          const t = 1 - dist / interactionRadius;
          const eased = t * t;
          targetMultiplier = 1 - maxShrink * eased;
          targetMultiplier = Math.max(minScaleMultiplier, targetMultiplier);
        }
      }

      ref.scale.x = THREE.MathUtils.lerp(
        ref.scale.x,
        baseScale.x * targetMultiplier,
        scaleLerp,
      );
      ref.scale.y = THREE.MathUtils.lerp(
        ref.scale.y,
        baseScale.y * targetMultiplier,
        scaleLerp,
      );
      ref.scale.z = THREE.MathUtils.lerp(
        ref.scale.z,
        baseScale.z * targetMultiplier,
        scaleLerp,
      );
    }
  });

  return (
    <group
      onPointerEnter={() => {
        hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
    >
      {particles.map((particle, i) => (
        <ParticleCube
          key={i}
          data={particle}
          texture={texture}
          videoTexture={videoTexture}
          registerRef={registerRef(i)}
          outlineColor={outlineColor}
          faceColor={faceColor}
        />
      ))}
    </group>
  );
}
