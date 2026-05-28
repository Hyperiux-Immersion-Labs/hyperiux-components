"use client";

import { useEffect, useRef } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

const INITIAL_POINTER = 0.5;
const MOVEMENT_THRESHOLD = 0.001;
const POINTER_LERP = 0.1;
const VELOCITY_BLEND_CURRENT = 0.8;
const VELOCITY_BLEND_NEXT = 0.2;
const ACTIVE_HOVER_LERP = 0.06;
const IDLE_HOVER_LERP = 0.008;
const TRAIL_STRENGTH_LERP = 0.1;
const TRAIL_STRENGTH_SCALE = 50;
const TRAIL_STRENGTH_BASE = 0.3;
const MOVE_IDLE_MS = 500;
const COLOR_INTERVAL_MIN_MS = 1200;
const COLOR_INTERVAL_RANGE_MS = 5000;
const COLOR_LERP = 0.1;
const ROTATION_LERP = 0.12;
const MAX_DIST = 2;
const TIME_SCALE = 0.003;
const WAVE_FREQUENCY = 8;
const WAVE_SPEED = 3;
const WAVE_STRENGTH = 0.15;
const VELOCITY_INFLUENCE_SCALE = 100;
const DEFORMATION_SCALE = 0.3;
const PLANE_ARGS = [18, 12, 200, 200];
const CUBE_ARGS = [1, 1, 1, 20, 20, 20];
const BLOOM_INTENSITY = 1;
const BLOOM_THRESHOLD = 1.5;
const BLOOM_SMOOTHING = 0.5;
const NOTICE_TEXT =
  "Best on desktop: whip your mouse to see the trail snap, bloom, and bend the grid.";
const COLOR_OPTIONS = [
  {
    color: new THREE.Color("#39FF14"),
    emissive: new THREE.Color("#39FF14"),
  },
  {
    color: new THREE.Color("aqua"),
    emissive: new THREE.Color("aqua"),
  },
  {
    color: new THREE.Color("#FFD600"),
    emissive: new THREE.Color("#FFD600"),
  },
];

const PIXEL_TRAIL_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uBasePixels;
  uniform vec2 uMouseVelocity;
  uniform float uTrailStrength;

  float noise2D(vec2 p) {
    vec2 ip = floor(p);
    vec2 f = fract(p);
    f = f * (3.0 - 2.0 * f);
    float n00 = sin(dot(ip, vec2(12.9898, 78.233)));
    float n10 = sin(dot(ip + vec2(1.0, 0.0), vec2(12.9898, 78.233)));
    float n01 = sin(dot(ip + vec2(0.0, 1.0), vec2(12.9898, 78.233)));
    float n11 = sin(dot(ip + vec2(1.0, 1.0), vec2(12.9898, 78.233)));
    float nx0 = mix(n00, n10, f.x);
    float nx1 = mix(n01, n11, f.x);
    return mix(nx0, nx1, f.y) * 0.5 + 0.5;
  }

  float easeInOutCubic(float t) {
    return t < 0.5
      ? 4.0 * t * t * t
      : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  float trailDistance(vec2 point, vec2 mousePos, vec2 velocity) {
    vec2 toPoint = point - mousePos;
    float velocityMag = length(velocity);

    if (velocityMag < 0.001) {
      return length(toPoint);
    }

    vec2 velocityDir = normalize(velocity);
    float alongTrail = dot(toPoint, velocityDir);
    float perpDist = length(toPoint - velocityDir * alongTrail);
    float trailLength = velocityMag * 15.0;

    if (alongTrail > 0.0 && alongTrail < trailLength) {
      return perpDist;
    }

    if (alongTrail <= 0.0) {
      return length(toPoint);
    }

    return length(toPoint - velocityDir * trailLength);
  }

  void main() {
    vUv = uv;
    vPosition = position;

    vec3 pos = position;
    vec2 pixelUV = floor(uv * uBasePixels) / uBasePixels;
    float dist = trailDistance(pixelUV, uMouse, uMouseVelocity);
    float hoverRadius = 0.15 + length(uMouseVelocity) * 0.3;
    float hoverEffect = smoothstep(hoverRadius, 0.0, dist) * uHover * uTrailStrength;
    float noiseValue = noise2D(pixelUV * 8.0 + uTime * 0.3);
    float maxExtrusion = 0.8;
    float extrusion = hoverEffect * (0.6 + noiseValue * 0.4) * maxExtrusion;
    float animationDelay = dist * 2.0;
    float animatedHover = max(0.0, uHover - animationDelay * 0.1);

    hoverEffect = easeInOutCubic(hoverEffect);
    animatedHover = clamp(animatedHover * 1.5, 0.0, 1.0);
    extrusion *= easeInOutCubic(animatedHover);

    pos.z += extrusion;
    pos.x += sin(pixelUV.x * 40.0) * hoverEffect * 0.008;
    pos.y += cos(pixelUV.y * 40.0) * hoverEffect * 0.008;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const PIXEL_TRAIL_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uBasePixels;
  uniform vec2 uMouseVelocity;
  uniform float uTrailStrength;

  varying vec2 vUv;
  varying vec3 vPosition;

  float trailDistance(vec2 point, vec2 mousePos, vec2 velocity) {
    vec2 toPoint = point - mousePos;
    float velocityMag = length(velocity);

    if (velocityMag < 0.001) {
      return length(toPoint);
    }

    vec2 velocityDir = normalize(velocity);
    float alongTrail = dot(toPoint, velocityDir);
    float perpDist = length(toPoint - velocityDir * alongTrail);
    float trailLength = velocityMag * 15.0;

    if (alongTrail > 0.0 && alongTrail < trailLength) {
      return perpDist;
    }

    if (alongTrail <= 0.0) {
      return length(toPoint);
    }

    return length(toPoint - velocityDir * trailLength);
  }

  float easeInOutCubic(float t) {
    return t < 0.5
      ? 4.0 * t * t * t
      : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    vec2 uv = vUv;
    vec2 pixelUV = floor(uv * uBasePixels) / uBasePixels;
    float dist = trailDistance(pixelUV, uMouse, uMouseVelocity);
    float hoverRadius = 0.15 + length(uMouseVelocity) * 0.3;
    float hoverEffect = smoothstep(hoverRadius, 0.0, dist) * uHover * uTrailStrength;
    float depthShading = 1.0 + vPosition.z * 0.3;
    vec3 topColor = vec3(0.0, 0.0, 0.0);
    vec3 sideColor = vec3(0.01, 0.01, 0.01);
    float topFaceFactor = smoothstep(0.7, 1.0, normalize(vPosition).z);
    vec3 cubeColor = mix(sideColor, topColor, topFaceFactor);
    float light = 0.5 + 0.5 * dot(
      normalize(vec3(0.3, 0.5, 1.0)),
      normalize(vPosition + vec3(0.0, 0.0, 1.0))
    );
    vec2 pixelCenter = (floor(uv * uBasePixels) + 0.5) / uBasePixels;
    vec2 pixelOffset = abs(uv - pixelCenter) * uBasePixels;
    float border = step(0.45, max(pixelOffset.x, pixelOffset.y));
    float vig = 1.0 - smoothstep(0.3, 3.2, length(uv - 0.5) * 2.0);

    hoverEffect = easeInOutCubic(hoverEffect);
    cubeColor *= light;
    cubeColor = mix(cubeColor, vec3(0.0), border * 0.9);
    cubeColor *= mix(1.0, vig, 0.6);

    gl_FragColor = vec4(cubeColor * depthShading, 1.0);
  }
`;

const CUBE_DEFORM_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CUBE_DEFORM_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uEmissive;
  uniform float uEmissiveIntensity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 baseColor = uColor;
    vec3 litColor = baseColor * (0.3 + 0.7 * diff);
    vec3 finalColor = litColor + (uEmissive * uEmissiveIntensity * 0.9);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

class PixelTrailMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(INITIAL_POINTER, INITIAL_POINTER) },
        uHover: { value: 0.0 },
        uBasePixels: { value: 35.0 },
        uMouseVelocity: { value: new THREE.Vector2(0, 0) },
        uTrailStrength: { value: 0.0 },
      },
      vertexShader: PIXEL_TRAIL_VERT,
      fragmentShader: PIXEL_TRAIL_FRAG,
    });
  }
}

class CubeDeformMaterial extends THREE.ShaderMaterial {
  constructor(color, emissive) {
    super({
      uniforms: {
        uColor: { value: color },
        uEmissive: { value: emissive },
        uEmissiveIntensity: { value: 2.4 },
      },
      vertexShader: CUBE_DEFORM_VERT,
      fragmentShader: CUBE_DEFORM_FRAG,
    });
  }
}

extend({ PixelTrailMaterial, CubeDeformMaterial });

function PixelGrid({ mousePositionRef, mouseVelocityRef, trailStrengthRef }) {
  const materialRef = useRef(null);
  const pointerTargetRef = useRef({ x: INITIAL_POINTER, y: INITIAL_POINTER });
  const pointerCurrentRef = useRef({ x: INITIAL_POINTER, y: INITIAL_POINTER });
  const lastPointerRef = useRef({ x: INITIAL_POINTER, y: INITIAL_POINTER });
  const isMovingRef = useRef(false);
  const lastMoveTimeRef = useRef(0);

  const onPointerMove = (event) => {
    const [u, v] = event.uv;
    const currentTime = Date.now();
    const deltaX = Math.abs(u - lastPointerRef.current.x);
    const deltaY = Math.abs(v - lastPointerRef.current.y);
    const hasMoved =
      deltaX > MOVEMENT_THRESHOLD || deltaY > MOVEMENT_THRESHOLD;

    if (hasMoved) {
      pointerTargetRef.current.x = u;
      pointerTargetRef.current.y = v;
      lastPointerRef.current.x = u;
      lastPointerRef.current.y = v;
      lastMoveTimeRef.current = currentTime;
      isMovingRef.current = true;
    }

    mousePositionRef.current.x = u;
    mousePositionRef.current.y = v;
  };

  useFrame((state) => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    // Animation loop
    const time = state.clock.getElapsedTime();
    const currentTime = Date.now();
    const timeSinceLastMove = currentTime - lastMoveTimeRef.current;

    material.uniforms.uTime.value = time;

    if (timeSinceLastMove > MOVE_IDLE_MS) {
      isMovingRef.current = false;
    }

    const previousX = pointerCurrentRef.current.x;
    const previousY = pointerCurrentRef.current.y;

    pointerCurrentRef.current.x +=
      (pointerTargetRef.current.x - pointerCurrentRef.current.x) * POINTER_LERP;
    pointerCurrentRef.current.y +=
      (pointerTargetRef.current.y - pointerCurrentRef.current.y) * POINTER_LERP;

    const velocityX = pointerCurrentRef.current.x - previousX;
    const velocityY = pointerCurrentRef.current.y - previousY;

    mouseVelocityRef.current.x =
      mouseVelocityRef.current.x * VELOCITY_BLEND_CURRENT +
      velocityX * VELOCITY_BLEND_NEXT;
    mouseVelocityRef.current.y =
      mouseVelocityRef.current.y * VELOCITY_BLEND_CURRENT +
      velocityY * VELOCITY_BLEND_NEXT;

    material.uniforms.uMouse.value.set(
      pointerCurrentRef.current.x,
      pointerCurrentRef.current.y
    );
    material.uniforms.uMouseVelocity.value.set(
      mouseVelocityRef.current.x,
      mouseVelocityRef.current.y
    );

    const hoverValue = material.uniforms.uHover.value;
    const nextHover = isMovingRef.current ? 1 : 0;
    const hoverLerp = isMovingRef.current ? ACTIVE_HOVER_LERP : IDLE_HOVER_LERP;
    material.uniforms.uHover.value += (nextHover - hoverValue) * hoverLerp;

    const velocityMagnitude = Math.sqrt(
      velocityX * velocityX + velocityY * velocityY
    );
    const nextTrail = Math.min(
      1,
      velocityMagnitude * TRAIL_STRENGTH_SCALE + TRAIL_STRENGTH_BASE
    );

    trailStrengthRef.current +=
      (nextTrail - trailStrengthRef.current) * TRAIL_STRENGTH_LERP;
    material.uniforms.uTrailStrength.value = trailStrengthRef.current;

    mousePositionRef.current.x = pointerCurrentRef.current.x;
    mousePositionRef.current.y = pointerCurrentRef.current.y;
  });

  return (
    <mesh onPointerMove={onPointerMove}>
      <planeGeometry args={PLANE_ARGS} />
      <pixelTrailMaterial ref={materialRef} />
    </mesh>
  );
}

function DeformingCube({ mousePositionRef, mouseVelocityRef, trailStrengthRef }) {
  const cubeRef = useRef(null);
  const geometryRef = useRef(null);
  const materialRef = useRef(null);
  const originalPositionsRef = useRef(null);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const colorStateRef = useRef({
    current: COLOR_OPTIONS[0].color.clone(),
    target: COLOR_OPTIONS[0].color.clone(),
    currentEmissive: COLOR_OPTIONS[0].emissive.clone(),
    targetEmissive: COLOR_OPTIONS[0].emissive.clone(),
    lastSwitch: 0,
    interval: 0,
  });
  const { camera } = useThree();

  useEffect(() => {
    if (colorStateRef.current.lastSwitch === 0) {
      colorStateRef.current.lastSwitch = Date.now();
    }

    if (colorStateRef.current.interval === 0) {
      colorStateRef.current.interval =
        COLOR_INTERVAL_MIN_MS + Math.random() * COLOR_INTERVAL_RANGE_MS;
    }
  }, []);

  useEffect(() => {
    if (!cubeRef.current) {
      return;
    }

    geometryRef.current = cubeRef.current.geometry;
    originalPositionsRef.current =
      cubeRef.current.geometry.attributes.position.array.slice();
  }, []);

  useFrame(() => {
    if (!cubeRef.current || !geometryRef.current || !originalPositionsRef.current) {
      return;
    }

    // Color state
    const now = Date.now();
    if (now - colorStateRef.current.lastSwitch > colorStateRef.current.interval) {
      let nextIndex = Math.floor(Math.random() * COLOR_OPTIONS.length);
      const currentIndex = COLOR_OPTIONS.findIndex((option) =>
        option.emissive.equals(colorStateRef.current.targetEmissive)
      );

      if (nextIndex === currentIndex) {
        nextIndex = (nextIndex + 1) % COLOR_OPTIONS.length;
      }

      colorStateRef.current.target.copy(COLOR_OPTIONS[nextIndex].color);
      colorStateRef.current.targetEmissive.copy(
        COLOR_OPTIONS[nextIndex].emissive
      );
      colorStateRef.current.lastSwitch = now;
      colorStateRef.current.interval =
        COLOR_INTERVAL_MIN_MS + Math.random() * COLOR_INTERVAL_RANGE_MS;
    }

    colorStateRef.current.current.lerp(
      colorStateRef.current.target,
      COLOR_LERP
    );
    colorStateRef.current.currentEmissive.lerp(
      colorStateRef.current.targetEmissive,
      COLOR_LERP
    );

    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.copy(
        colorStateRef.current.current
      );
      materialRef.current.uniforms.uEmissive.value.copy(
        colorStateRef.current.currentEmissive
      );
    }

    // Rotation
    const mouseX = mousePositionRef.current.x;
    const mouseY = mousePositionRef.current.y;
    targetRotationRef.current.x = ((mouseY - 0.5) * Math.PI) / 2;
    targetRotationRef.current.y = ((mouseX - 0.5) * Math.PI) / 1.5;

    currentRotationRef.current.x +=
      (targetRotationRef.current.x - currentRotationRef.current.x) *
      ROTATION_LERP;
    currentRotationRef.current.y +=
      (targetRotationRef.current.y - currentRotationRef.current.y) *
      ROTATION_LERP;

    cubeRef.current.rotation.x = currentRotationRef.current.x;
    cubeRef.current.rotation.y = currentRotationRef.current.y;

    // Screen-space distance
    const cubeWorldPosition = new THREE.Vector3();
    cubeRef.current.getWorldPosition(cubeWorldPosition);
    cubeWorldPosition.project(camera);

    const cubeScreenX = (cubeWorldPosition.x + 1) / 2;
    const cubeScreenY = (cubeWorldPosition.y + 1) / 2;
    const distToCube = Math.sqrt(
      Math.pow(mousePositionRef.current.x - cubeScreenX, 2) +
        Math.pow(mousePositionRef.current.y - cubeScreenY, 2)
    );
    const deformStrength =
      Math.max(0, 1 - distToCube / MAX_DIST) * trailStrengthRef.current;

    // Geometry deformation
    const positions = geometryRef.current.attributes.position.array;
    const time = Date.now() * TIME_SCALE;

    for (let index = 0; index < positions.length; index += 3) {
      const x = originalPositionsRef.current[index];
      const y = originalPositionsRef.current[index + 1];
      const z = originalPositionsRef.current[index + 2];
      const distFromCenter = Math.sqrt(x * x + y * y + z * z);
      const wave =
        Math.sin(distFromCenter * WAVE_FREQUENCY - time * WAVE_SPEED) *
        WAVE_STRENGTH;
      const ripple = wave * deformStrength;
      const velocityInfluence =
        (x * mouseVelocityRef.current.x + y * mouseVelocityRef.current.y) *
        VELOCITY_INFLUENCE_SCALE;
      const deformation =
        (ripple + velocityInfluence * deformStrength) * DEFORMATION_SCALE;

      positions[index] = x + x * deformation;
      positions[index + 1] = y + y * deformation;
      positions[index + 2] = z + z * deformation;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.computeVertexNormals();
  });

  return (
    <mesh ref={cubeRef} position={[0, 0, 1]} layers={1}>
      <boxGeometry args={CUBE_ARGS} />
      <cubeDeformMaterial
        ref={materialRef}
        args={[new THREE.Color("#ffffff"), new THREE.Color("#ffffff")]}
      />
    </mesh>
  );
}

export default function EnhancedPixelCube() {
  const mousePositionRef = useRef({ x: INITIAL_POINTER, y: INITIAL_POINTER });
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const trailStrengthRef = useRef(0);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <div className="pointer-events-none absolute left-1/2 top-30 z-10 hidden w-full -translate-x-1/2 px-5 pt-5 max-md:flex max-md:justify-center max-sm:left-0 max-sm:block max-sm:translate-x-0">
        <p className="inline-flex max-w-[92vw] rounded-sm border border-white/15 bg-black/40 px-4 py-2 font-medium text-white/75 backdrop-blur max-md:text-center max-md:text-[2.8vw] max-sm:text-[3.5vw]">
          {NOTICE_TEXT}
        </p>
      </div>

      <Canvas
        camera={{ position: [0, 0, 4], fov: 75 }}
        gl={{ antialias: true }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor("#000000");
          camera.layers.enable(1);
        }}
      >
        <PixelGrid
          mousePositionRef={mousePositionRef}
          mouseVelocityRef={mouseVelocityRef}
          trailStrengthRef={trailStrengthRef}
        />

        <EffectComposer>
          <Bloom
            intensity={BLOOM_INTENSITY}
            luminanceThreshold={BLOOM_THRESHOLD}
            luminanceSmoothing={BLOOM_SMOOTHING}
            height={0}
            layers={[1]}
          />
        </EffectComposer>

        <DeformingCube
          mousePositionRef={mousePositionRef}
          mouseVelocityRef={mouseVelocityRef}
          trailStrengthRef={trailStrengthRef}
        />
      </Canvas>
    </div>
  );
}
