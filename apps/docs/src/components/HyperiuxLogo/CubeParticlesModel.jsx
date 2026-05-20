"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Center, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { snapToGrid } from "./utils/snapToGrid";
import { InteractiveParticles } from "./InteractiveParticles";
import { FloatingCubes } from "./FloatingCubes";

export function CubeParticlesModel({
  modelPath = "/assets/models/modelv3.glb",
  texturePath = "/assets/models/new-logo-texture.png",

  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,

  particleCount = 1800,
  cubeSize = 0.16,
  cubeScaleVariation = 0.08,
  centerCubeScaleMin = 0.55,
  middleBridgeScaleMin = 0.45,
  middleBridgeXInfluence = 0.34,
  middleBridgeYInfluence = 0.18,

  modelOpacity = 0.015,
  outlineColor = "#ffffff",
  faceColor = "#1a1a1a",

  frontVector = [0, 0, 1],
  frontBiasPower = 3.2,
  backFill = 0.02,

  edgeBoost = 1.0,
  edgeOutwardBias = 0.16,
  edgeJitter = 0.08,

  gridSnapFactor = 0.94,
  surfaceJitter = 0.14,

  interactionRadius = 0.9,
  maxShrink = 0.72,
  minScaleMultiplier = 0.2,
  scaleLerp = 0.12,

  parallaxPositionStrength = 0.08,
  parallaxRotationStrength = 0.12,

  floatingCubeCount = 42,
  floatingYStartOffset = 2,
  floatingYEndOffset = 2,
  floatingZMin = -6,
  floatingZMax = 2.5,
  floatingScaleMin = 0.08,
  floatingScaleMax = 0.28,
  floatingSpeedMin = 0.08,
  floatingSpeedMax = 0.2,
  floatingEasePower = 2.4,
  floatingRotationSpeedMax = 1.1,
  floatingXSpreadMultiplier = 1.25,

  actionPhase = "idle",
  holdProgress = 0,
  burstKey = 0,
  explosionDuration = 0.7,
  explodedHoldDuration = 0.5,
  reformDuration = 0.8,
  holdShakeAmount = 0.08,
  holdShakeSpeed = 22,
  explosionSpreadX = 18,
  explosionSpreadY = 12,
  explosionForwardMin = 2.5,
  explosionForwardMax = 7,
  explosionBackwardMin = 2,
  explosionBackwardMax = 5,
  explosionRotateMax = 3.2,
}) {
  const gltf = useGLTF(modelPath);
  const faceTexture = useTexture(texturePath);

  const baseGroupRef = useRef(null);
  const interactionGroupRef = useRef(null);

  useEffect(() => {
    if (!faceTexture.image) return;

    const img = faceTexture.image;
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }

    ctx.putImageData(imageData, 0, 0);

    const invertedTexture = new THREE.CanvasTexture(canvas);
    invertedTexture.wrapS = THREE.ClampToEdgeWrapping;
    invertedTexture.wrapT = THREE.ClampToEdgeWrapping;
    invertedTexture.colorSpace = THREE.SRGBColorSpace;
    invertedTexture.needsUpdate = true;

    faceTexture.dispose();
    faceTexture.image = invertedTexture.image;
    faceTexture.needsUpdate = true;
  }, [faceTexture]);

  const prepared = useMemo(() => {
    const sceneClone = gltf.scene.clone(true);
    const meshes = [];
    const bbox = new THREE.Box3();

    sceneClone.updateMatrixWorld(true);

    sceneClone.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const mesh = child.clone();
        mesh.geometry = child.geometry.clone();
        mesh.material =
          child.material?.clone?.() || new THREE.MeshStandardMaterial();
        mesh.updateMatrixWorld(true);
        meshes.push(mesh);
        bbox.expandByObject(mesh);
      }
    });

    return { sceneClone, meshes, bbox };
  }, [gltf]);

  const particleData = useMemo(() => {
    const particles = [];
    const occupied = new Set();

    if (!prepared.meshes.length) return particles;

    const frontDir = new THREE.Vector3(...frontVector).normalize();
    const grid = cubeSize * gridSnapFactor;

    const bbox = prepared.bbox.clone();
    const bboxCenter = new THREE.Vector3();
    const bboxSize = new THREE.Vector3();
    bbox.getCenter(bboxCenter);
    bbox.getSize(bboxSize);

    const upCandidate =
      Math.abs(frontDir.y) > 0.95
        ? new THREE.Vector3(1, 0, 0)
        : new THREE.Vector3(0, 1, 0);

    const planeX = new THREE.Vector3()
      .crossVectors(upCandidate, frontDir)
      .normalize();

    const planeY = new THREE.Vector3()
      .crossVectors(frontDir, planeX)
      .normalize();

    const project2D = (point) => {
      const local = point.clone().sub(bboxCenter);
      return {
        x: local.dot(planeX),
        y: local.dot(planeY),
        z: local.dot(frontDir),
      };
    };

    const halfExtentAlongFront =
      (Math.abs(frontDir.x) * bboxSize.x +
        Math.abs(frontDir.y) * bboxSize.y +
        Math.abs(frontDir.z) * bboxSize.z) *
      0.5;

    const computeFrontness = (pos) => {
      const centered = pos.clone().sub(bboxCenter);
      const projected = centered.dot(frontDir);
      const normalized =
        halfExtentAlongFront > 0
          ? (projected + halfExtentAlongFront) / (2 * halfExtentAlongFront)
          : 0.5;

      return THREE.MathUtils.clamp(normalized, 0, 1);
    };

    const pseudoRandom = (x, y, z) => {
      const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
      return s - Math.floor(s);
    };

    const addCube = (pos, size) => {
      const snapped = snapToGrid(pos, grid);
      const key = `${snapped.x.toFixed(4)}|${snapped.y.toFixed(4)}|${snapped.z.toFixed(4)}`;

      if (occupied.has(key)) return false;
      occupied.add(key);

      particles.push({
        position: snapped.clone(),
        quaternion: new THREE.Quaternion(),
        scale: new THREE.Vector3(size, size, size),
      });

      return true;
    };

    const raycastGroup = new THREE.Group();
    prepared.meshes.forEach((m) => raycastGroup.add(m.clone()));
    raycastGroup.updateMatrixWorld(true);

    const raycaster = new THREE.Raycaster();
    const frontStartDistance = halfExtentAlongFront + Math.max(cubeSize * 6, 2);

    const corners = [];
    for (const x of [bbox.min.x, bbox.max.x]) {
      for (const y of [bbox.min.y, bbox.max.y]) {
        for (const z of [bbox.min.z, bbox.max.z]) {
          corners.push(project2D(new THREE.Vector3(x, y, z)));
        }
      }
    }

    const min2DX = Math.min(...corners.map((c) => c.x));
    const max2DX = Math.max(...corners.map((c) => c.x));
    const min2DY = Math.min(...corners.map((c) => c.y));
    const max2DY = Math.max(...corners.map((c) => c.y));

    const start = new THREE.Vector3();
    const rayOrigin = new THREE.Vector3();
    const hitPoint = new THREE.Vector3();

    const faceCandidates = [];

    for (let py = min2DY; py <= max2DY; py += grid) {
      for (let px = min2DX; px <= max2DX; px += grid) {
        start
          .copy(bboxCenter)
          .addScaledVector(planeX, px)
          .addScaledVector(planeY, py);

        rayOrigin.copy(start).addScaledVector(frontDir, frontStartDistance);

        raycaster.set(rayOrigin, frontDir.clone().multiplyScalar(-1));
        const hits = raycaster.intersectObject(raycastGroup, true);

        if (!hits.length) continue;

        hitPoint.copy(hits[0].point);

        const frontness = computeFrontness(hitPoint);
        if (frontness < backFill * 0.4) continue;

        faceCandidates.push({
          position: hitPoint.clone(),
          frontness,
          type: "face",
        });
      }
    }

    const edgeCandidates = [];
    prepared.meshes.forEach((mesh) => {
      const geometry = mesh.geometry.clone();
      const edges = new THREE.EdgesGeometry(geometry);
      const edgeAttr = edges.attributes.position;

      if (!edgeAttr) return;

      const a = new THREE.Vector3();
      const b = new THREE.Vector3();
      const p = new THREE.Vector3();

      for (let i = 0; i < edgeAttr.count; i += 2) {
        a.fromBufferAttribute(edgeAttr, i).applyMatrix4(mesh.matrixWorld);
        b.fromBufferAttribute(edgeAttr, i + 1).applyMatrix4(mesh.matrixWorld);

        const length = a.distanceTo(b);
        const steps = Math.max(2, Math.ceil(length / (cubeSize * 0.75)));

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          p.lerpVectors(a, b, t);

          const frontness = computeFrontness(p);
          if (frontness < backFill * 0.3) continue;

          edgeCandidates.push({
            position: p.clone(),
            frontness,
            type: "edge",
          });
        }
      }
    });

    const candidates = [...faceCandidates, ...edgeCandidates];

    candidates.sort((a, b) => {
      const wa = a.frontness * (a.type === "edge" ? 1.25 : 1.6);
      const wb = b.frontness * (b.type === "edge" ? 1.25 : 1.6);
      return wb - wa;
    });

    const targetCount =
      particleCount + Math.floor(particleCount * edgeBoost * 0.12);

    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];

      const keepBase =
        c.type === "face"
          ? Math.pow(c.frontness, Math.max(1, frontBiasPower * 0.35))
          : Math.min(
              1,
              Math.pow(c.frontness, Math.max(1, frontBiasPower * 0.65)) *
                (1 + edgeBoost * 0.08)
            );

      const r = pseudoRandom(c.position.x, c.position.y, c.position.z);
      if (r > keepBase) continue;

      const size =
        cubeSize *
        (1 -
          cubeScaleVariation +
          pseudoRandom(
            c.position.x * 1.7,
            c.position.y * 2.3,
            c.position.z * 3.1
          ) *
            cubeScaleVariation);

      addCube(c.position, size);

      if (particles.length >= targetCount) break;
    }

    return particles;
  }, [
    prepared.meshes,
    prepared.bbox,
    particleCount,
    cubeSize,
    cubeScaleVariation,
    frontVector,
    frontBiasPower,
    backFill,
    edgeBoost,
    gridSnapFactor,
  ]);

  useEffect(() => {
    prepared.sceneClone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = modelOpacity;
        child.material.depthWrite = false;
      }
    });
  }, [prepared.sceneClone, modelOpacity]);

  const floatingPauseTarget =
    actionPhase === "holding"
      ? 0.22
      : actionPhase === "exploding"
      ? 0
      : actionPhase === "reforming"
      ? 1
      : 1;

  return (
    <>
      <FloatingCubes
        texture={faceTexture}
        count={floatingCubeCount}
        faceColor={faceColor}
        outlineColor={outlineColor}
        yStartOffset={floatingYStartOffset}
        yEndOffset={floatingYEndOffset}
        zMin={floatingZMin}
        zMax={floatingZMax}
        scaleMin={floatingScaleMin}
        scaleMax={floatingScaleMax}
        speedMin={floatingSpeedMin}
        speedMax={floatingSpeedMax}
        easePower={floatingEasePower}
        rotationSpeedMax={floatingRotationSpeedMax}
        xSpreadMultiplier={floatingXSpreadMultiplier}
        pauseTarget={floatingPauseTarget}
        parallaxPositionStrength={0.28}
        parallaxRotationStrength={0.12}
      />

      <Center>
        <group
          ref={baseGroupRef}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          <group ref={interactionGroupRef}>
            <primitive object={prepared.sceneClone} dispose={null} />

            <InteractiveParticles
              particles={particleData}
              texture={faceTexture}
              interactionGroupRef={interactionGroupRef}
              interactionRadius={interactionRadius}
              maxShrink={maxShrink}
              minScaleMultiplier={minScaleMultiplier}
              scaleLerp={scaleLerp}
              parallaxPositionStrength={parallaxPositionStrength}
              parallaxRotationStrength={parallaxRotationStrength}
              outlineColor={outlineColor}
              faceColor={faceColor}
              actionPhase={actionPhase}
              holdProgress={holdProgress}
              burstKey={burstKey}
              explosionDuration={explosionDuration}
              explodedHoldDuration={explodedHoldDuration}
              reformDuration={reformDuration}
            //   holdShakeAmount={holdShakeAmount}
            //   holdShakeSpeed={holdShakeSpeed}
              explosionSpreadX={explosionSpreadX}
              explosionSpreadY={explosionSpreadY}
              explosionForwardMin={explosionForwardMin}
              explosionForwardMax={explosionForwardMax}
              explosionBackwardMin={explosionBackwardMin}
              explosionBackwardMax={explosionBackwardMax}
              explosionRotateMax={explosionRotateMax}
            />
          </group>
        </group>
      </Center>
    </>
  );
}

useGLTF.preload("/assets/models/modelv3.glb");