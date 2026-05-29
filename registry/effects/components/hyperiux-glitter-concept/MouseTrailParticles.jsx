"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const MouseTrailParticles = ({
  maxParticles = 1400,
  spawnPerMove = 8,
  particleLife = 0.9,
  size = 11,
  color = "#ffffff",
  brightness = 22,
  zOffset = 0.08,
  spread = 0.045,
  velocityStrength = 0.22,

  lerpFactor = 0.14,
  idleDamping = 0.9,
  stopSpeedThreshold = 0.0025,

  idleModeDelay = 1.2,

  // idle comet behavior
  idleCometDelayMin = 0.45,
  idleCometDelayMax = 1.2,
  idleCometLife = 0.8,
  idleCometSpeedMin = 0.9,
  idleCometSpeedMax = 1.8,
  idleCometSpawnPerFrame = 5,
  idleCometTrailSpread = 0.025,

  // extra padding beyond visible viewport
  idleCometViewportPadding = 0.2,
}) => {
  const pointsRef = useRef();
  const { camera, gl, clock, viewport } = useThree();

  const targetPointerWorldRef = useRef(new THREE.Vector3());
  const smoothPointerWorldRef = useRef(new THREE.Vector3());
  const prevSmoothPointerWorldRef = useRef(new THREE.Vector3());

  const initializedRef = useRef(false);
  const hasPointerRef = useRef(false);
  const lastMoveTimeRef = useRef(0);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const hitPoint = useMemo(() => new THREE.Vector3(), []);

  const tempVelocity = useMemo(() => new THREE.Vector3(), []);
  const tempInterp = useMemo(() => new THREE.Vector3(), []);

  const idleCometRef = useRef({
    active: false,
    head: new THREE.Vector3(),
    prevHead: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    startTime: 0,
    endTime: 0,
    nextSpawnTime: 0,
  });

  const data = useMemo(() => {
    return {
      positions: new Float32Array(maxParticles * 3),
      ages: new Float32Array(maxParticles),
      lifes: new Float32Array(maxParticles),
      seeds: new Float32Array(maxParticles),
      alphas: new Float32Array(maxParticles),
      sizes: new Float32Array(maxParticles),
      count: 0,
      cursor: 0,
    };
  }, [maxParticles]);

  const velocityArray = useMemo(() => new Float32Array(maxParticles * 3), [maxParticles]);

  useEffect(() => {
    const handlePointerMove = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera({ x, y }, camera);

      if (raycaster.ray.intersectPlane(plane, hitPoint)) {
        targetPointerWorldRef.current.copy(hitPoint);
        hasPointerRef.current = true;
        lastMoveTimeRef.current = performance.now() * 0.001;

        if (!initializedRef.current) {
          smoothPointerWorldRef.current.copy(hitPoint);
          prevSmoothPointerWorldRef.current.copy(hitPoint);
          initializedRef.current = true;
        }

        idleCometRef.current.active = false;
      }
    };

    gl.domElement.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      gl.domElement.removeEventListener("pointermove", handlePointerMove);
    };
  }, [camera, gl, plane, raycaster, hitPoint]);

  const randomRange = (min, max) => min + Math.random() * (max - min);

  const getScreenBounds = () => {
    const vp = viewport.getCurrentViewport(camera, [0, 0, 0]);
    return {
      halfW: vp.width * 0.5 + idleCometViewportPadding,
      halfH: vp.height * 0.5 + idleCometViewportPadding,
    };
  };

  const scheduleNextIdleComet = (now) => {
    idleCometRef.current.nextSpawnTime =
      now + randomRange(idleCometDelayMin, idleCometDelayMax);
  };

  const spawnIdleComet = (now) => {
    const comet = idleCometRef.current;
    const { halfW, halfH } = getScreenBounds();

    const side = Math.floor(Math.random() * 4);
    let startX = 0;
    let startY = 0;
    let dirX = 0;
    let dirY = 0;

    if (side === 0) {
      startX = -halfW;
      startY = randomRange(-halfH, halfH);
      dirX = randomRange(0.75, 1.0);
      dirY = randomRange(-0.45, 0.45);
    } else if (side === 1) {
      startX = halfW;
      startY = randomRange(-halfH, halfH);
      dirX = randomRange(-1.0, -0.75);
      dirY = randomRange(-0.45, 0.45);
    } else if (side === 2) {
      startX = randomRange(-halfW, halfW);
      startY = halfH;
      dirX = randomRange(-0.45, 0.45);
      dirY = randomRange(-1.0, -0.75);
    } else {
      startX = randomRange(-halfW, halfW);
      startY = -halfH;
      dirX = randomRange(-0.45, 0.45);
      dirY = randomRange(0.75, 1.0);
    }

    const speed = randomRange(idleCometSpeedMin, idleCometSpeedMax);

    comet.head.set(startX, startY, 0);
    comet.prevHead.copy(comet.head);
    comet.velocity.set(dirX, dirY, 0).normalize().multiplyScalar(speed);
    comet.startTime = now;
    comet.endTime = now + idleCometLife;
    comet.active = true;
  };

  const spawnParticle = (basePos, velocity, lifeMul = 1, localSpread = spread) => {
    const i = data.cursor;

    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * localSpread;

    const ox = Math.cos(angle) * radius;
    const oy = Math.sin(angle) * radius;

    data.positions[i * 3 + 0] = basePos.x + ox;
    data.positions[i * 3 + 1] = basePos.y + oy;
    data.positions[i * 3 + 2] = zOffset + (Math.random() - 0.5) * 0.01;

    data.ages[i] = 0;
    data.lifes[i] = particleLife * lifeMul * (0.75 + Math.random() * 0.5);
    data.seeds[i] = Math.random() * 1000;
    data.alphas[i] = 1;
    data.sizes[i] = 0.9 + Math.random() * 0.4;

    velocityArray[i * 3 + 0] = velocity.x + (Math.random() - 0.5) * 0.04;
    velocityArray[i * 3 + 1] = velocity.y + (Math.random() - 0.5) * 0.04;
    velocityArray[i * 3 + 2] = 0;

    data.cursor = (data.cursor + 1) % maxParticles;
    data.count = Math.min(data.count + 1, maxParticles);
  };

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    g.setAttribute("aAge", new THREE.BufferAttribute(data.ages, 1));
    g.setAttribute("aLife", new THREE.BufferAttribute(data.lifes, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(data.seeds, 1));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(data.alphas, 1));
    g.setAttribute("aSizeMul", new THREE.BufferAttribute(data.sizes, 1));
    g.setDrawRange(0, data.count);
    return g;
  }, [data]);

  const materialArgs = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
        uColor: { value: new THREE.Color(color) },
        uBrightness: { value: brightness },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;

        attribute float aAge;
        attribute float aLife;
        attribute float aSeed;
        attribute float aAlpha;
        attribute float aSizeMul;

        varying float vLifeT;
        varying float vAlpha;
        varying float vSeed;

        void main() {
          float t = clamp(aAge / max(aLife, 0.0001), 0.0, 1.0);
          vLifeT = t;
          vAlpha = aAlpha;
          vSeed = aSeed;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

          float appear = smoothstep(0.0, 0.08, 1.0 - t);
          float disappear = 1.0 - smoothstep(0.55, 1.0, t);
          float lifeScale = appear * disappear;

          float twinkle = sin(uTime * 9.0 + aSeed * 12.0) * 0.5 + 0.5;
          float pointSize = uSize * aSizeMul * lifeScale * mix(0.85, 1.2, twinkle);

          gl_PointSize = pointSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uBrightness;

        varying float vLifeT;
        varying float vAlpha;
        varying float vSeed;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;

          float phase = sin(vSeed * 17.0 + vLifeT * 8.0) * 0.5 + 0.5;

          float diamondScale = mix(0.45, 0.15, phase);
          float dDiamond = abs(uv.x) + abs(uv.y);
          float maskDiamond = step(dDiamond, diamondScale);

          float crossScale = mix(0.18, 0.48, phase);
          float thickness = 0.018;
          float lineX = step(abs(uv.x), thickness) * step(abs(uv.y), crossScale);
          float lineY = step(abs(uv.y), thickness) * step(abs(uv.x), crossScale);
          float maskCross = clamp(lineX + lineY, 0.0, 1.0);

          float finalMask = max(maskDiamond, maskCross);
          if (finalMask < 0.1) discard;

          float fade = 1.0 - smoothstep(0.55, 1.0, vLifeT);
          gl_FragColor = vec4(uColor * uBrightness, finalMask * fade * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    };
  }, [size, color, brightness]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const now = clock.getElapsedTime();
    pointsRef.current.material.uniforms.uTime.value = now;

    const timeSinceMove = performance.now() * 0.001 - lastMoveTimeRef.current;
    const isIdleMode = hasPointerRef.current && timeSinceMove > idleModeDelay;

    if (initializedRef.current) {
      prevSmoothPointerWorldRef.current.copy(smoothPointerWorldRef.current);

      if (!isIdleMode) {
        smoothPointerWorldRef.current.lerp(targetPointerWorldRef.current, lerpFactor);

        tempVelocity
          .subVectors(smoothPointerWorldRef.current, prevSmoothPointerWorldRef.current)
          .multiplyScalar(idleDamping);

        const speed = tempVelocity.length();

        if (speed > stopSpeedThreshold) {
          const emitCount = Math.max(1, Math.floor(spawnPerMove + speed * 260));

          for (let s = 0; s < emitCount; s++) {
            const t = emitCount <= 1 ? 0 : s / (emitCount - 1);

            tempInterp.lerpVectors(
              prevSmoothPointerWorldRef.current,
              smoothPointerWorldRef.current,
              t
            );

            const vel = tempVelocity.clone().multiplyScalar(velocityStrength);

            spawnParticle(
              tempInterp,
              vel,
              THREE.MathUtils.clamp(1 + speed * 8, 1, 1.45),
              spread
            );
          }
        }
      } else {
        const comet = idleCometRef.current;
        const { halfW, halfH } = getScreenBounds();

        if (!comet.active && comet.nextSpawnTime === 0) {
          scheduleNextIdleComet(now);
        }

        if (!comet.active && now >= comet.nextSpawnTime) {
          spawnIdleComet(now);
        }

        if (comet.active) {
          comet.prevHead.copy(comet.head);
          comet.head.addScaledVector(comet.velocity, delta);

          const cometVelocity = tempVelocity
            .subVectors(comet.head, comet.prevHead)
            .multiplyScalar(1 / Math.max(delta, 0.0001));

          for (let s = 0; s < idleCometSpawnPerFrame; s++) {
            const t = idleCometSpawnPerFrame <= 1 ? 0 : s / (idleCometSpawnPerFrame - 1);

            tempInterp.lerpVectors(comet.prevHead, comet.head, t);

            spawnParticle(
              tempInterp,
              cometVelocity.clone().multiplyScalar(0.012),
              idleCometLife / particleLife,
              idleCometTrailSpread
            );
          }

          if (
            now >= comet.endTime ||
            Math.abs(comet.head.x) > halfW * 1.25 ||
            Math.abs(comet.head.y) > halfH * 1.25
          ) {
            comet.active = false;
            scheduleNextIdleComet(now);
          }
        }
      }
    }

    for (let i = 0; i < data.count; i++) {
      data.ages[i] += delta;

      const life = data.lifes[i];
      const age = data.ages[i];
      const t = Math.min(age / Math.max(life, 0.0001), 1);

      if (t >= 1) {
        data.alphas[i] = 0;
        continue;
      }

      data.positions[i * 3 + 0] += velocityArray[i * 3 + 0] * delta;
      data.positions[i * 3 + 1] += velocityArray[i * 3 + 1] * delta;
      data.positions[i * 3 + 2] += velocityArray[i * 3 + 2] * delta;

      velocityArray[i * 3 + 0] *= 0.965;
      velocityArray[i * 3 + 1] *= 0.965;

      data.alphas[i] = 1 - t;
    }

    pointsRef.current.geometry.getAttribute("position").needsUpdate = true;
    pointsRef.current.geometry.getAttribute("aAge").needsUpdate = true;
    pointsRef.current.geometry.getAttribute("aAlpha").needsUpdate = true;
    pointsRef.current.geometry.getAttribute("aLife").needsUpdate = true;
    pointsRef.current.geometry.getAttribute("aSizeMul").needsUpdate = true;
    pointsRef.current.geometry.getAttribute("aSeed").needsUpdate = true;
    pointsRef.current.geometry.setDrawRange(0, data.count);
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial args={[materialArgs]} toneMapped={false} />
    </points>
  );
};

export default MouseTrailParticles;