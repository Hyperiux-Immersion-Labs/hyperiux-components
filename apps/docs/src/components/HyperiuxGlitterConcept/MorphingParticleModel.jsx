"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function createSmoothUpscaledMask({
  image,
  alphaThreshold = 110,
  rasterSize = 1200,
}) {
  const aspect = image.width / image.height;

  let width = rasterSize;
  let height = Math.round(rasterSize / aspect);

  if (image.height > image.width) {
    height = rasterSize;
    width = Math.round(rasterSize * aspect);
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, width, height);

  const data = ctx.getImageData(0, 0, width, height).data;
  const mask = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const alpha = data[i + 3];
      mask[y * width + x] = alpha >= alphaThreshold ? 1 : 0;
    }
  }

  return { mask, width, height };
}

function removeIsolatedNoise(mask, width, height, minNeighbors = 2) {
  const out = new Uint8Array(mask.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!mask[idx]) continue;

      let neighbors = 0;

      for (let oy = -1; oy <= 1; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          if (ox === 0 && oy === 0) continue;
          const nx = x + ox;
          const ny = y + oy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          if (mask[ny * width + nx]) neighbors++;
        }
      }

      if (neighbors >= minNeighbors) out[idx] = 1;
    }
  }

  return out;
}

function erodeMask(mask, width, height, radius = 1) {
  if (radius <= 0) return mask;

  const out = new Uint8Array(mask.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let keep = 1;

      for (let oy = -radius; oy <= radius && keep; oy++) {
        for (let ox = -radius; ox <= radius; ox++) {
          const nx = x + ox;
          const ny = y + oy;

          if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
            keep = 0;
            break;
          }

          if (!mask[ny * width + nx]) {
            keep = 0;
            break;
          }
        }
      }

      out[y * width + x] = keep ? 1 : 0;
    }
  }

  return out;
}

function buildParticleDataFromImage({
  image,
  maxWorldWidth = 8,
  alphaThreshold = 110,
  rasterSize = 1200,
  fillSpacing = 2,
  edgeSpacing = 3,
  edgeInset = 0,
  edgeBoost = false,
}) {
  let { mask, width, height } = createSmoothUpscaledMask({
    image,
    alphaThreshold,
    rasterSize,
  });

  if (edgeInset > 0) {
    mask = erodeMask(mask, width, height, edgeInset);
  }

  mask = removeIsolatedNoise(mask, width, height, 2);

  const isFilled = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return 0;
    return mask[y * width + x];
  };

  const isEdge = (x, y) => {
    if (!isFilled(x, y)) return 0;

    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        if (ox === 0 && oy === 0) continue;
        if (!isFilled(x + ox, y + oy)) return 1;
      }
    }

    return 0;
  };

  const positions = [];
  const uvs = [];
  const meta = [];
  const seen = new Set();

  const worldWidth = maxWorldWidth;
  const worldHeight = worldWidth * (height / width);

  const pxToWorldX = worldWidth / width;
  const pxToWorldY = worldHeight / height;

  const addPoint = (x, y, edgeFlag = 0) => {
    const key = `${x}_${y}`;
    if (seen.has(key)) return;
    seen.add(key);

    const wx = (x - width / 2) * pxToWorldX;
    const wy = -(y - height / 2) * pxToWorldY;

    positions.push(wx, wy, 0);
    uvs.push(x / width, 1 - y / height);
    meta.push(Math.random(), edgeFlag);
  };

  for (let y = 0; y < height; y += fillSpacing) {
    for (let x = 0; x < width; x += fillSpacing) {
      if (isFilled(x, y)) addPoint(x, y, 0);
    }
  }

  for (let y = 0; y < height; y += edgeSpacing) {
    for (let x = 0; x < width; x += edgeSpacing) {
      if (isEdge(x, y)) {
        addPoint(x, y, 1);

        if (edgeBoost) {
          if (isFilled(x + 1, y)) addPoint(x + 1, y, 1);
          if (isFilled(x - 1, y)) addPoint(x - 1, y, 1);
          if (isFilled(x, y + 1)) addPoint(x, y + 1, 1);
          if (isFilled(x, y - 1)) addPoint(x, y - 1, 1);
        }
      }
    }
  }

  return {
    positions: new Float32Array(positions),
    uvs: new Float32Array(uvs),
    meta: new Float32Array(meta),
    count: positions.length / 3,
    worldWidth,
    worldHeight,
  };
}

const ImageParticleModel = ({
  src = "/assets/textures/new-logo-texture.png",
  scale = 1,
  color = "#ffffff",
  size = 6.8,
  speed = 1.15,
  opacity = 1,
  brightness = 18,
  maxWorldWidth = 8,
  alphaThreshold = 110,
  rasterSize = 1400,
  fillSpacing = 2,
  edgeSpacing = 3,
  edgeInset = 0,
  edgeBoost = false,
  depthJitter = 0,
  showImage = false,
  imageOpacity = 0.06,

  parallaxStrength = 0.14,
  parallaxLerp = 0.08,

  rotationStrengthX = 0.12,
  rotationStrengthY = 0.18,
  rotationStrengthZ = 0.04,
  rotationLerp = 0.08,

  // soft directional hit
  interactionRadius = 0.55,
  interactionStrength = 0.18,
  interactionDepth = 0.025,
  interactionLerp = 0.16,
  returnLerp = 0.06,
  cursorLerp = 0.2,
  maxOffset = 0.2,
}) => {
  const groupRef = useRef();
  const pointsRef = useRef();
  const [texture, setTexture] = useState(null);
  const [particleData, setParticleData] = useState(null);

  const { pointer, camera } = useThree();

  const parallaxTarget = useRef(new THREE.Vector3());
  const parallaxCurrent = useRef(new THREE.Vector3());

  const rotationTarget = useRef(new THREE.Euler(0, 0, 0));
  const rotationCurrent = useRef(new THREE.Euler(0, 0, 0));

  const basePositionsRef = useRef(null);
  const currentPositionsRef = useRef(null);

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
    let mounted = true;

    loadImage(src).then((img) => {
      if (!mounted) return;

      const tex = new THREE.Texture(img);
      tex.needsUpdate = true;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.flipY = true;
      setTexture(tex);

      const built = buildParticleDataFromImage({
        image: img,
        maxWorldWidth,
        alphaThreshold,
        rasterSize,
        fillSpacing,
        edgeSpacing,
        edgeInset,
        edgeBoost,
      });

      if (depthJitter > 0) {
        for (let i = 0; i < built.count; i++) {
          built.positions[i * 3 + 2] = (Math.random() - 0.5) * depthJitter;
        }
      }

      basePositionsRef.current = new Float32Array(built.positions);
      currentPositionsRef.current = new Float32Array(built.positions);
      built.positions = currentPositionsRef.current;

      setParticleData(built);
    });

    return () => {
      mounted = false;
    };
  }, [
    src,
    maxWorldWidth,
    alphaThreshold,
    rasterSize,
    fillSpacing,
    edgeSpacing,
    edgeInset,
    edgeBoost,
    depthJitter,
  ]);

  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uSize: { value: size },
        uSpeed: { value: speed },
        uOpacity: { value: opacity },
        uBrightness: { value: brightness },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        uniform float uSpeed;

        attribute vec2 aMeta;

        varying float vTransition;
        varying float vEdge;

        void main() {
          float rand = aMeta.x;
          vEdge = aMeta.y;

          float phase = rand * 6.2831853 + (position.x * 1.4 + position.y * 1.4);
          vTransition = sin(uTime * uSpeed + phase) * 0.5 + 0.5;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

          float pointSize = uSize * (300.0 / -mvPosition.z);
          pointSize *= mix(1.0, 1.02, vEdge);

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

        void main() {
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
          gl_FragColor = vec4(uColor * uBrightness * intensity, uOpacity);
        }
      `,
    };
  }, [color, size, speed, opacity, brightness]);

  useFrame((state) => {
  if (pointsRef.current) {
    pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
  }

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

  if (
    !groupRef.current ||
    !pointsRef.current ||
    !basePositionsRef.current ||
    !currentPositionsRef.current ||
    !particleData
  ) {
    return;
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

    // only treat it as a hit while the cursor is actually moving
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

  for (let i = 0; i < particleData.count; i++) {
    const i3 = i * 3;

    const bx = baseArray[i3 + 0];
    const by = baseArray[i3 + 1];
    const bz = baseArray[i3 + 2];

    tempTarget.set(bx, by, bz);

    // only apply displacement while cursor is moving
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

    // interaction only when moving, otherwise always return
    const currentLerp = isActivelyMoving ? interactionLerp : returnLerp;

    posArray[i3 + 0] = THREE.MathUtils.lerp(posArray[i3 + 0], tempTarget.x, currentLerp);
    posArray[i3 + 1] = THREE.MathUtils.lerp(posArray[i3 + 1], tempTarget.y, currentLerp);
    posArray[i3 + 2] = THREE.MathUtils.lerp(posArray[i3 + 2], tempTarget.z, currentLerp);
  }

  pointsRef.current.geometry.getAttribute("position").needsUpdate = true;
});

  if (!particleData) return null;

  return (
    <group ref={groupRef} scale={scale}>
      {showImage && texture && (
        <mesh>
          <planeGeometry args={[particleData.worldWidth, particleData.worldHeight]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={imageOpacity}
            depthWrite={false}
          />
        </mesh>
      )}

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particleData.positions}
            count={particleData.count}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aMeta"
            array={particleData.meta}
            count={particleData.count}
            itemSize={2}
          />
          <bufferAttribute
            attach="attributes-uv"
            array={particleData.uvs}
            count={particleData.count}
            itemSize={2}
          />
        </bufferGeometry>

        <shaderMaterial
  args={[shaderArgs]}
  transparent
  depthWrite={false}
  blending={THREE.AdditiveBlending}
  toneMapped={false}
/>
      </points>
    </group>
  );
};

export default ImageParticleModel;