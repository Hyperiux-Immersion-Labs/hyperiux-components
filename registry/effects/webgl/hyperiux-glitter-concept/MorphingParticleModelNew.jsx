"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";

function buildMergedSurface(scene) {
  const meshes = [];

  scene.updateMatrixWorld(true);

  scene.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;

    const geometry = child.geometry.clone();
    const nonIndexed = geometry.index ? geometry.toNonIndexed() : geometry;
    const pos = nonIndexed.attributes.position;

    if (!pos) {
      geometry.dispose();
      if (nonIndexed !== geometry) nonIndexed.dispose?.();
      return;
    }

    const worldPositions = new Float32Array(pos.count * 3);
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(child.matrixWorld);
      worldPositions[i * 3 + 0] = v.x;
      worldPositions[i * 3 + 1] = v.y;
      worldPositions[i * 3 + 2] = v.z;
    }

    const merged = new THREE.BufferGeometry();
    merged.setAttribute(
      "position",
      new THREE.BufferAttribute(worldPositions, 3)
    );
    merged.computeVertexNormals();

    meshes.push(merged);

    geometry.dispose();
    if (nonIndexed !== geometry) nonIndexed.dispose?.();
  });

  if (!meshes.length) return null;
  if (meshes.length === 1) return meshes[0];

  const totalCount = meshes.reduce(
    (sum, g) => sum + g.attributes.position.count,
    0
  );

  const mergedPositions = new Float32Array(totalCount * 3);
  const mergedNormals = new Float32Array(totalCount * 3);

  let offset = 0;

  for (const g of meshes) {
    mergedPositions.set(g.attributes.position.array, offset * 3);
    mergedNormals.set(g.attributes.normal.array, offset * 3);
    offset += g.attributes.position.count;
    g.dispose();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(mergedPositions, 3)
  );
  geometry.setAttribute(
    "normal",
    new THREE.BufferAttribute(mergedNormals, 3)
  );

  return geometry;
}

const MorphingParticleModel = ({
  url = "/assets/models/hyperiux-new-model.glb",
  scale = 1,
  particleCount = 8000,
  color = "#ffffff",
  size = 0.18,
  speed = 1.15,
  opacity = 1,
  brightness = 4.5,

  showModel = false,
  modelOpacity = 0,

  parallaxStrength = 0.12,
  parallaxLerp = 0.08,

  rotationStrengthX = 0.12,
  rotationStrengthY = 0.18,
  rotationStrengthZ = 0.04,
  rotationLerp = 0.08,

  interactionRadius = 1.8,
  interactionStrength = 2.24,
  interactionDepth = 0.04,
  interactionLerp = 0.18,
  returnLerp = 0.012,
  cursorLerp = 0.2,
  maxOffset = 1.22,

  frontFacingThreshold = 0.12,
  frontFacingSoftness = 0.05,
}) => {
  const groupRef = useRef();
  const pointsRef = useRef();

  const { scene } = useGLTF(url);
  const { pointer, camera } = useThree();

  const [particleBuffers, setParticleBuffers] = useState(null);

  const basePositionsRef = useRef(null);
  const currentPositionsRef = useRef(null);
  const metaRef = useRef(null);
  const normalsRef = useRef(null);
  const countRef = useRef(0);

  const parallaxTarget = useRef(new THREE.Vector3());
  const parallaxCurrent = useRef(new THREE.Vector3());

  const rotationTarget = useRef(new THREE.Euler(0, 0, 0));
  const rotationCurrent = useRef(new THREE.Euler(0, 0, 0));

  const raycasterRef = useRef(new THREE.Raycaster());
  const hitPointWorldRef = useRef(new THREE.Vector3());
  const hitPointLocalRef = useRef(new THREE.Vector3());
  const smoothHitPointLocalRef = useRef(new THREE.Vector3());
  const prevSmoothHitPointLocalRef = useRef(new THREE.Vector3());

  const planeNormalRef = useRef(new THREE.Vector3());
  const planePointRef = useRef(new THREE.Vector3());
  const groupWorldQuatRef = useRef(new THREE.Quaternion());

  const cursorVelocityLocalRef = useRef(new THREE.Vector3());
  const hasPrevHitRef = useRef(false);

  const tempTarget = useMemo(() => new THREE.Vector3(), []);
  const tempOffset = useMemo(() => new THREE.Vector3(), []);
  const tempCursorDir = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (!scene) return;

    const mergedGeometry = buildMergedSurface(scene);
    if (!mergedGeometry) return;

    const tempMesh = new THREE.Mesh(
      mergedGeometry,
      new THREE.MeshBasicMaterial()
    );
    const sampler = new MeshSurfaceSampler(tempMesh).build();

    const positions = new Float32Array(particleCount * 3);
    const normals = new Float32Array(particleCount * 3);
    const meta = new Float32Array(particleCount * 2);

    const pos = new THREE.Vector3();
    const normal = new THREE.Vector3();

    for (let i = 0; i < particleCount; i++) {
      sampler.sample(pos, normal);

      positions[i * 3 + 0] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      normals[i * 3 + 0] = normal.x;
      normals[i * 3 + 1] = normal.y;
      normals[i * 3 + 2] = normal.z;

      meta[i * 2 + 0] = Math.random();
      meta[i * 2 + 1] = Math.abs(normal.z) > 0.5 ? 1 : 0;
    }

    mergedGeometry.dispose();
    tempMesh.material.dispose();

    const basePositions = new Float32Array(positions);
    const currentPositions = new Float32Array(positions);

    basePositionsRef.current = basePositions;
    currentPositionsRef.current = currentPositions;
    normalsRef.current = normals;
    metaRef.current = meta;
    countRef.current = particleCount;

    setParticleBuffers({
      positions: currentPositions,
      normals,
      meta,
      count: particleCount,
    });
  }, [scene, particleCount]);

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      child.material = child.material.clone();
      child.material.transparent = true;
      child.material.opacity = showModel ? modelOpacity : 0;
      child.material.depthWrite = false;
      child.visible = showModel;
    });
  }, [scene, showModel, modelOpacity]);

  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uSize: { value: size },
        uSpeed: { value: speed },
        uOpacity: { value: opacity },
        uBrightness: { value: brightness },
        uFrontFacingThreshold: { value: frontFacingThreshold },
        uFrontFacingSoftness: { value: frontFacingSoftness },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        uniform float uSpeed;
        uniform float uFrontFacingThreshold;
        uniform float uFrontFacingSoftness;

        attribute vec2 aMeta;
        attribute vec3 aNormal;

        varying float vTransition;
        varying float vEdge;
        varying float vFacing;

        void main() {
          float rand = aMeta.x;
          vEdge = aMeta.y;

          float phase = rand * 6.2831853 + (position.x * 1.2 + position.y * 1.2 + position.z * 1.2);
          vTransition = sin(uTime * uSpeed + phase) * 0.5 + 0.5;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

          vec3 viewNormal = normalize(normalMatrix * aNormal);
          vec3 viewDir = normalize(-mvPosition.xyz);

          float facingDot = dot(viewNormal, viewDir);

          vFacing = smoothstep(
            uFrontFacingThreshold - uFrontFacingSoftness,
            uFrontFacingThreshold + uFrontFacingSoftness,
            facingDot
          );

          float pointSize = uSize * (300.0 / -mvPosition.z);
          pointSize *= mix(1.0, 1.02, vEdge);
          pointSize *= vFacing;

          gl_PointSize = pointSize;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uBrightness;

        varying float vTransition;
        varying float vEdge;
        varying float vFacing;

        void main() {
          if (vFacing < 0.01) discard;

          vec2 uv = gl_PointCoord - 0.5;

          float diamondScale = 1.0 - vTransition;
          float dDiamond = abs(uv.x) + abs(uv.y);
          float maskDiamond = step(dDiamond, 0.42 * diamondScale);

          float crossScale = vTransition;
          float thickness = mix(0.015, 0.017, vEdge);
          float lineX = step(abs(uv.x), thickness) * step(abs(uv.y), 0.44 * crossScale);
          float lineY = step(abs(uv.y), thickness) * step(abs(uv.x), 0.44 * crossScale);
          float maskCross = clamp(lineX + lineY, 0.0, 1.0);

          float finalMask = max(maskDiamond, maskCross);
          if (finalMask < 0.1) discard;

          float intensity = mix(1.0, 1.03, vEdge);
          gl_FragColor = vec4(uColor * uBrightness * intensity, uOpacity * vFacing);
        }
      `,
    };
  }, [
    color,
    size,
    speed,
    opacity,
    brightness,
    frontFacingThreshold,
    frontFacingSoftness,
  ]);

  useFrame((state) => {
    if (!pointsRef.current || !currentPositionsRef.current || !basePositionsRef.current) {
      return;
    }

    pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;

    if (groupRef.current) {
      parallaxTarget.current.set(
        pointer.x * parallaxStrength,
        pointer.y * parallaxStrength,
        0
      );
      parallaxCurrent.current.lerp(parallaxTarget.current, parallaxLerp);

      groupRef.current.position.x = parallaxCurrent.current.x;
      groupRef.current.position.y = parallaxCurrent.current.y;

      rotationTarget.current.x = -pointer.y * rotationStrengthX;
      rotationTarget.current.y = pointer.x * rotationStrengthY;
      rotationTarget.current.z = pointer.x * rotationStrengthZ;

      rotationCurrent.current.x = THREE.MathUtils.lerp(
        rotationCurrent.current.x,
        rotationTarget.current.x,
        rotationLerp
      );
      rotationCurrent.current.y = THREE.MathUtils.lerp(
        rotationCurrent.current.y,
        rotationTarget.current.y,
        rotationLerp
      );
      rotationCurrent.current.z = THREE.MathUtils.lerp(
        rotationCurrent.current.z,
        rotationTarget.current.z,
        rotationLerp
      );

      groupRef.current.rotation.x = rotationCurrent.current.x;
      groupRef.current.rotation.y = rotationCurrent.current.y;
      groupRef.current.rotation.z = rotationCurrent.current.z;
    }

    groupRef.current.updateWorldMatrix(true, false);
    groupRef.current.getWorldPosition(planePointRef.current);
    groupRef.current.getWorldQuaternion(groupWorldQuatRef.current);

    planeNormalRef.current
      .set(0, 0, 1)
      .applyQuaternion(groupWorldQuatRef.current)
      .normalize();

    raycasterRef.current.setFromCamera(pointer, camera);

    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      planeNormalRef.current,
      planePointRef.current
    );

    let hasPlaneHit = false;
    let isActivelyMoving = false;

    if (raycasterRef.current.ray.intersectPlane(plane, hitPointWorldRef.current)) {
      hitPointLocalRef.current.copy(hitPointWorldRef.current);
      groupRef.current.worldToLocal(hitPointLocalRef.current);

      if (!hasPrevHitRef.current) {
        smoothHitPointLocalRef.current.copy(hitPointLocalRef.current);
        prevSmoothHitPointLocalRef.current.copy(hitPointLocalRef.current);
        hasPrevHitRef.current = true;
      }

      prevSmoothHitPointLocalRef.current.copy(smoothHitPointLocalRef.current);
      smoothHitPointLocalRef.current.lerp(hitPointLocalRef.current, cursorLerp);

      cursorVelocityLocalRef.current.subVectors(
        smoothHitPointLocalRef.current,
        prevSmoothHitPointLocalRef.current
      );

      hasPlaneHit = true;

      if (cursorVelocityLocalRef.current.length() > 0.0015) {
        isActivelyMoving = true;
      }
    } else {
      cursorVelocityLocalRef.current.set(0, 0, 0);
    }

    if (isActivelyMoving) {
      tempCursorDir.copy(cursorVelocityLocalRef.current);
      if (tempCursorDir.lengthSq() > 0.000001) {
        tempCursorDir.normalize();
      } else {
        tempCursorDir.set(0, 0, 0);
      }
    } else {
      tempCursorDir.set(0, 0, 0);
    }

    const posArray = currentPositionsRef.current;
    const baseArray = basePositionsRef.current;
    const count = countRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const bx = baseArray[i3 + 0];
      const by = baseArray[i3 + 1];
      const bz = baseArray[i3 + 2];

      tempTarget.set(bx, by, bz);

      if (isActivelyMoving && hasPlaneHit) {
        const dx = bx - smoothHitPointLocalRef.current.x;
        const dy = by - smoothHitPointLocalRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < interactionRadius) {
          const falloff = 1 - dist / interactionRadius;
          const soft = falloff * falloff;

          tempTarget.x += tempCursorDir.x * interactionStrength * soft;
          tempTarget.y += tempCursorDir.y * interactionStrength * soft;
          tempTarget.z += interactionDepth * soft;
        }
      }

      tempOffset.set(
        tempTarget.x - bx,
        tempTarget.y - by,
        tempTarget.z - bz
      );

      const len = tempOffset.length();
      if (len > maxOffset) {
        tempOffset.normalize().multiplyScalar(maxOffset);
        tempTarget.set(
          bx + tempOffset.x,
          by + tempOffset.y,
          bz + tempOffset.z
        );
      }

      const currentLerp = isActivelyMoving ? interactionLerp : returnLerp;

      posArray[i3 + 0] = THREE.MathUtils.lerp(posArray[i3 + 0], tempTarget.x, currentLerp);
      posArray[i3 + 1] = THREE.MathUtils.lerp(posArray[i3 + 1], tempTarget.y, currentLerp);
      posArray[i3 + 2] = THREE.MathUtils.lerp(posArray[i3 + 2], tempTarget.z, currentLerp);
    }

    pointsRef.current.geometry.getAttribute("position").needsUpdate = true;
  });

  if (!particleBuffers) return null;

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={scene} />

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particleBuffers.positions}
            count={particleBuffers.count}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aMeta"
            array={particleBuffers.meta}
            count={particleBuffers.count}
            itemSize={2}
          />
          <bufferAttribute
            attach="attributes-aNormal"
            array={particleBuffers.normals}
            count={particleBuffers.count}
            itemSize={3}
          />
        </bufferGeometry>

        <shaderMaterial
          args={[shaderArgs]}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
};

export default MorphingParticleModel;