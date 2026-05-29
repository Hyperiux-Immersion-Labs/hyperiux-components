"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const DEFAULT_IMAGE = "/assets/img/image06.png";
const IMAGE_ASPECT_RATIO = 1920 / 1080;
const TABLET_MAX_WIDTH = 768;
const MOBILE_MAX_WIDTH = 640;
const MOUSE_LERP = 0.15;
const VELOCITY_TARGET_SCALE = 35;
const VELOCITY_SMOOTH_LERP = 0.06;
const VELOCITY_CURRENT_LERP = 0.15;
const VELOCITY_DECAY = 0.96;
const MOVEMENT_TIMEOUT_MS = 300;
const MOVEMENT_STATE_LERP = 0.05;
const INITIAL_MOUSE = 0.5;
const INITIAL_VELOCITY_Y = 0.5;
const INITIAL_TIME = 2;
const BLOCK_SIZE = 1 / 35;
const EFFECT_RADIUS = 0.3;
const EFFECT_INTENSITY = 1.8;

const ZANJO_VERT = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ZANJO_FRAG = /* glsl */ `
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uBlockSize;
  uniform float uRadius;
  uniform float uIntensity;
  uniform float uTime;
  uniform float uIsMoving;
  uniform sampler2D uTexture;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    vec2 blockCoord = floor(uv / uBlockSize) * uBlockSize + (uBlockSize * 0.5);
    blockCoord += sin(uTime * 0.3) * 0.002 + cos(uTime * 0.4) * 0.001;

    float dist = distance(blockCoord, uMouse);
    float smoothDist = smoothstep(uRadius * 1.2, 0.0, dist);

    float influence = smoothDist * (1.0 - dist / (uRadius * 1.2));
    influence *= 1.0 + sin(uTime * 1.5) * 0.15 + cos(uTime * 2.3) * 0.05;
    influence *= smoothstep(0.0, 1.0, uIsMoving);

    vec2 vel = uVelocity;
    float smoothSignX = vel.x / (abs(vel.x) + 0.08);
    float smoothSignY = vel.y / (abs(vel.y) + 0.08);
    float blend = smoothstep(-0.05, 0.15, abs(vel.x) - abs(vel.y));

    vec2 dir = mix(
      vec2(0.0, smoothSignY),
      vec2(smoothSignX, 0.0),
      blend
    );

    vec2 displacement = dir * influence * uBlockSize * uIntensity;
    displacement *= 1.0 + sin(uTime * 0.8) * 0.2 + cos(uTime * 1.2) * 0.1;

    vec2 displacedUV = uv - displacement;
    displacedUV += sin(displacedUV.x * 8.0 + uTime) * 0.002
      + cos(displacedUV.y * 6.0 + uTime * 0.8) * 0.001;

    vec4 color = texture2D(uTexture, displacedUV);
    color.rgb *= 1.0 + influence * 0.1;

    gl_FragColor = color;
  }
`;

function PlaneWithShader({ texture }) {
  const materialRef = useRef(null);
  const shaderMaterialRef = useRef(null);
  const moveTimeoutRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const isMovingRef = useRef(1);
  const lastMouseRef = useRef(new THREE.Vector2(INITIAL_MOUSE, INITIAL_MOUSE));
  const targetMouseRef = useRef(new THREE.Vector2(INITIAL_MOUSE, INITIAL_MOUSE));
  const targetVelocityRef = useRef(new THREE.Vector2(0, 0));
  const smoothedVelocityRef = useRef(new THREE.Vector2(0, 0));
  const { size, viewport } = useThree();

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMouse: { value: new THREE.Vector2(INITIAL_MOUSE, INITIAL_MOUSE) },
          uVelocity: { value: new THREE.Vector2(0, INITIAL_VELOCITY_Y) },
          uBlockSize: { value: BLOCK_SIZE },
          uRadius: { value: EFFECT_RADIUS },
          uIntensity: { value: EFFECT_INTENSITY },
          uTime: { value: INITIAL_TIME },
          uIsMoving: { value: 1 },
          uTexture: { value: texture },
        },
        vertexShader: ZANJO_VERT,
        fragmentShader: ZANJO_FRAG,
        transparent: false,
      }),
    [texture]
  );

  useEffect(() => {
    shaderMaterialRef.current = shaderMaterial;
  }, [shaderMaterial]);

  useEffect(() => {
    const onMouseMove = (event) => {
      const nextMouse = new THREE.Vector2(
        event.clientX / size.width,
        1 - event.clientY / size.height
      );
      const nextVelocity = nextMouse
        .clone()
        .sub(lastMouseRef.current)
        .multiplyScalar(VELOCITY_TARGET_SCALE);

      targetMouseRef.current.copy(nextMouse);
      targetVelocityRef.current.copy(nextVelocity);
      lastMouseRef.current.copy(nextMouse);
      isMovingRef.current = 1;

      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }

      moveTimeoutRef.current = setTimeout(() => {
        isMovingRef.current = 0;
      }, MOVEMENT_TIMEOUT_MS);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [size.height, size.width]);

  useFrame(() => {
    const shader = shaderMaterialRef.current;

    if (!shader) {
      return;
    }

    // Animation loop
    shader.uniforms.uTime.value = clockRef.current.getElapsedTime();
    shader.uniforms.uMouse.value.lerp(targetMouseRef.current, MOUSE_LERP);
    smoothedVelocityRef.current.lerp(
      targetVelocityRef.current,
      VELOCITY_SMOOTH_LERP
    );
    shader.uniforms.uVelocity.value.lerp(
      smoothedVelocityRef.current,
      VELOCITY_CURRENT_LERP
    );
    targetVelocityRef.current.multiplyScalar(VELOCITY_DECAY);
    shader.uniforms.uIsMoving.value = THREE.MathUtils.lerp(
      shader.uniforms.uIsMoving.value,
      isMovingRef.current,
      MOVEMENT_STATE_LERP
    );
  });

  const viewportAspectRatio = viewport.width / viewport.height;
  const isTabletViewport =
    size.width <= TABLET_MAX_WIDTH && size.width > MOBILE_MAX_WIDTH;
  let planeWidth;
  let planeHeight;

  // Plane sizing
  if (isTabletViewport || IMAGE_ASPECT_RATIO > viewportAspectRatio) {
    planeWidth = viewport.width;
    planeHeight = viewport.width / IMAGE_ASPECT_RATIO;
  } else {
    planeHeight = viewport.height;
    planeWidth = viewport.height * IMAGE_ASPECT_RATIO;
  }

  return (
    <mesh>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <primitive object={shaderMaterial} attach="material" ref={materialRef} />
    </mesh>
  );
}

function Scene({ img }) {
  const texture = useMemo(() => new THREE.TextureLoader().load(img), [img]);

  return <PlaneWithShader texture={texture} />;
}

export default function Zanjo({ img = DEFAULT_IMAGE }) {
  return (
    <div className="relative h-screen w-full">
      <div className="pointer-events-none absolute left-1/2 top-40 z-10 hidden w-full -translate-x-1/2 px-5 max-md:flex max-md:justify-center max-sm:left-0 max-sm:block max-sm:translate-x-0 max-sm:pt-5">
        <p className="inline-flex max-w-[92vw] rounded-sm border border-white/15 bg-black/40 px-4 py-2 font-medium text-white/75 backdrop-blur max-md:w-[80%] max-md:text-center max-md:text-[2.8vw] max-sm:w-full max-sm:text-[3.5vw]">
          Heads up: the pixel-drift responds to cursor velocity - desktop is the
          sweet spot.
        </p>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        <Scene img={img} />
      </Canvas>
    </div>
  );
}
