"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Center, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { snapToGrid } from "./utils/snapToGrid";
import { InteractiveParticles } from "./InteractiveParticles";
import { FloatingCubes } from "./FloatingCubes";

export function CubeParticlesModel({
  modelPath = "/assets/models/modelv3.glb",
  texturePath = "/assets/models/new-logo-texture.png",
  videoPath = "/assets/models/bg-video.mp4",

  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,

  particleCount = 1800,
  cubeSize = 0.16,
  cubeScaleVariation = 0.08,

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

  middleBridgeXInfluence = 0.34,
  middleBridgeYInfluence = 0.16,
  middleBridgeLaneOffset = 0.42,
  middleBridgeLaneCount = 3,
}) {
  const gltf = useGLTF(modelPath);
  const faceTexture = useTexture(texturePath);

  const [videoTexture, setVideoTexture] = useState(null);

  const baseGroupRef = useRef(null);
  const interactionGroupRef = useRef(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = videoPath;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    setVideoTexture(texture);

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn("Video autoplay was blocked.", error);
      }
    };

    playVideo();

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      texture.dispose();
      setVideoTexture(null);
    };
  }, [videoPath]);

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

    const bboxCenter = new THREE.Vector3();
    const bboxSize = new THREE.Vector3();
    prepared.bbox.getCenter(bboxCenter);
    prepared.bbox.getSize(bboxSize);

    const halfExtentAlongFront =
      (Math.abs(frontDir.x) * bboxSize.x +
        Math.abs(frontDir.y) * bboxSize.y +
        Math.abs(frontDir.z) * bboxSize.z) *
      0.5;

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

    const projectToFrontPlane = (pos) => {
      const centered = pos.clone().sub(bboxCenter);
      return {
        x: centered.dot(planeX),
        y: centered.dot(planeY),
        z: centered.dot(frontDir),
      };
    };

    const rebuildFromFrontPlane = (x, y, z) =>
      new THREE.Vector3()
        .copy(bboxCenter)
        .addScaledVector(planeX, x)
        .addScaledVector(planeY, y)
        .addScaledVector(frontDir, z);

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

    const isBridgeZone = (pos) => {
      const p = projectToFrontPlane(pos);
      const halfX = bboxSize.x * 0.5 || 1;
      const halfY = bboxSize.y * 0.5 || 1;

      return (
        Math.abs(p.x) <= halfX * middleBridgeXInfluence &&
        Math.abs(p.y) <= halfY * middleBridgeYInfluence
      );
    };

    const candidates = [];

    prepared.meshes.forEach((mesh) => {
      const geometry = mesh.geometry.clone();
      geometry.computeVertexNormals();

      const posAttr = geometry.attributes.position;
      const indexAttr = geometry.index;
      if (!posAttr) return;

      const a = new THREE.Vector3();
      const b = new THREE.Vector3();
      const c = new THREE.Vector3();
      const p = new THREE.Vector3();

      const pushCandidate = (position, type) => {
        const frontness = computeFrontness(position);
        if (frontness < backFill * 0.35) return;

        candidates.push({
          position: position.clone(),
          type,
          frontness,
        });
      };

      const sampleTriangleDense = (va, vb, vc) => {
        const ab = va.distanceTo(vb);
        const bc = vb.distanceTo(vc);
        const ca = vc.distanceTo(va);
        const maxEdge = Math.max(ab, bc, ca);

        const steps = Math.max(2, Math.ceil(maxEdge / (cubeSize * 0.75)));

        for (let i = 0; i <= steps; i++) {
          for (let j = 0; j <= steps - i; j++) {
            const u = i / steps;
            const v = j / steps;
            const w = 1 - u - v;

            p.set(0, 0, 0)
              .addScaledVector(va, w)
              .addScaledVector(vb, u)
              .addScaledVector(vc, v);

            pushCandidate(p, "face");
          }
        }
      };

      for (let i = 0; i < posAttr.count; i++) {
        a.fromBufferAttribute(posAttr, i).applyMatrix4(mesh.matrixWorld);
        pushCandidate(a, "vertex");
      }

      if (indexAttr) {
        for (let i = 0; i < indexAttr.count; i += 3) {
          a.fromBufferAttribute(posAttr, indexAttr.getX(i)).applyMatrix4(
            mesh.matrixWorld
          );
          b.fromBufferAttribute(posAttr, indexAttr.getX(i + 1)).applyMatrix4(
            mesh.matrixWorld
          );
          c.fromBufferAttribute(posAttr, indexAttr.getX(i + 2)).applyMatrix4(
            mesh.matrixWorld
          );
          sampleTriangleDense(a, b, c);
        }
      } else {
        for (let i = 0; i < posAttr.count; i += 3) {
          if (i + 2 >= posAttr.count) break;

          a.fromBufferAttribute(posAttr, i).applyMatrix4(mesh.matrixWorld);
          b.fromBufferAttribute(posAttr, i + 1).applyMatrix4(mesh.matrixWorld);
          c.fromBufferAttribute(posAttr, i + 2).applyMatrix4(mesh.matrixWorld);
          sampleTriangleDense(a, b, c);
        }
      }

      const edges = new THREE.EdgesGeometry(geometry);
      const edgeAttr = edges.attributes.position;

      if (edgeAttr) {
        for (let i = 0; i < edgeAttr.count; i += 2) {
          a.fromBufferAttribute(edgeAttr, i).applyMatrix4(mesh.matrixWorld);
          b.fromBufferAttribute(edgeAttr, i + 1).applyMatrix4(mesh.matrixWorld);

          const length = a.distanceTo(b);
          const steps = Math.max(2, Math.ceil(length / (cubeSize * 0.7)));

          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            p.lerpVectors(a, b, t);
            pushCandidate(p, "edge");
          }
        }
      }
    });

    const bridgeSamples = candidates
      .filter((c) => isBridgeZone(c.position))
      .map((c) => projectToFrontPlane(c.position));

    let bridgeMeanX = 0;
    let bridgeMeanY = 0;
    let bridgeDir = new THREE.Vector2(1, 0);
    let bridgePerp = new THREE.Vector2(0, 1);

    if (bridgeSamples.length > 1) {
      for (const s of bridgeSamples) {
        bridgeMeanX += s.x;
        bridgeMeanY += s.y;
      }

      bridgeMeanX /= bridgeSamples.length;
      bridgeMeanY /= bridgeSamples.length;

      let covXX = 0;
      let covXY = 0;
      let covYY = 0;

      for (const s of bridgeSamples) {
        const dx = s.x - bridgeMeanX;
        const dy = s.y - bridgeMeanY;
        covXX += dx * dx;
        covXY += dx * dy;
        covYY += dy * dy;
      }

      const theta = 0.5 * Math.atan2(2 * covXY, covXX - covYY);
      bridgeDir = new THREE.Vector2(Math.cos(theta), Math.sin(theta)).normalize();

      if (bridgeDir.x < 0) bridgeDir.multiplyScalar(-1);

      bridgePerp = new THREE.Vector2(-bridgeDir.y, bridgeDir.x).normalize();
    }

    const getClosestLane = (perp) => {
      const half = Math.floor(middleBridgeLaneCount / 2);
      const lanes = [];

      for (let i = -half; i <= half; i++) {
        lanes.push(i * cubeSize * middleBridgeLaneOffset);
      }

      let best = lanes[0];
      for (let i = 1; i < lanes.length; i++) {
        if (Math.abs(lanes[i] - perp) < Math.abs(best - perp)) {
          best = lanes[i];
        }
      }

      return best;
    };

    const alignBridgePosition = (pos, type) => {
      if (!isBridgeZone(pos)) return pos;

      const projected = projectToFrontPlane(pos);
      const relX = projected.x - bridgeMeanX;
      const relY = projected.y - bridgeMeanY;

      const along = relX * bridgeDir.x + relY * bridgeDir.y;
      const perp = relX * bridgePerp.x + relY * bridgePerp.y;

      const alongSnapped = Math.round(along / grid) * grid;

      let perpSnapped;
      if (type === "edge") {
        const edgeLane = cubeSize * middleBridgeLaneOffset;
        perpSnapped = perp >= 0 ? edgeLane : -edgeLane;
      } else {
        perpSnapped = getClosestLane(perp);
      }

      const x =
        bridgeMeanX + alongSnapped * bridgeDir.x + perpSnapped * bridgePerp.x;
      const y =
        bridgeMeanY + alongSnapped * bridgeDir.y + perpSnapped * bridgePerp.y;

      return rebuildFromFrontPlane(x, y, projected.z);
    };

    const addCube = (pos, size, type) => {
      const alignedPos = alignBridgePosition(pos, type);
      const snapped = snapToGrid(alignedPos, grid);
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

    candidates.sort((p1, p2) => {
      const w1 =
        p1.frontness *
        (p1.type === "face" ? 1.6 : p1.type === "edge" ? 1.35 : 1.05);
      const w2 =
        p2.frontness *
        (p2.type === "face" ? 1.6 : p2.type === "edge" ? 1.35 : 1.05);
      return w2 - w1;
    });

    const targetCount =
      particleCount + Math.floor(particleCount * edgeBoost * 0.15);

    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];

      const keepBase =
        c.type === "face"
          ? Math.pow(c.frontness, Math.max(1, frontBiasPower * 0.42))
          : c.type === "edge"
          ? Math.min(
              1,
              Math.pow(c.frontness, frontBiasPower * 0.72) *
                (1 + edgeBoost * 0.12)
            )
          : Math.pow(c.frontness, Math.max(1, frontBiasPower * 0.9));

      const r = pseudoRandom(c.position.x, c.position.y, c.position.z);
      if (r > keepBase) continue;

      const randomScale =
        1 -
        cubeScaleVariation +
        pseudoRandom(
          c.position.x * 1.7,
          c.position.y * 2.3,
          c.position.z * 3.1
        ) *
          cubeScaleVariation;

      const size = cubeSize * randomScale;
      addCube(c.position, size, c.type);

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
    middleBridgeXInfluence,
    middleBridgeYInfluence,
    middleBridgeLaneOffset,
    middleBridgeLaneCount,
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

  if (!videoTexture) return null;

  return (
    <>
     <FloatingCubes
  texture={faceTexture}
  videoTexture={videoTexture}
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
              videoTexture={videoTexture}
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
              burstKey={burstKey}
              explosionDuration={explosionDuration}
              explodedHoldDuration={explodedHoldDuration}
              reformDuration={reformDuration}
              holdShakeAmount={holdShakeAmount}
              holdShakeSpeed={holdShakeSpeed}
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