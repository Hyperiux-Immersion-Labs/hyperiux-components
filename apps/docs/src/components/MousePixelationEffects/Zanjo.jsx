"use client"
import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Vertex Shader
const vertexShader = () => `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader
const fragmentShader = () => `
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

    // Block center with enhanced smooth animation
    vec2 blockCoord = floor(uv / uBlockSize) * uBlockSize + (uBlockSize * 0.5);
    blockCoord += sin(uTime * 0.3) * 0.002 + cos(uTime * 0.4) * 0.001;

    // Distance calculation with improved smoothing
    float dist = distance(blockCoord, uMouse);
    float smoothDist = smoothstep(uRadius * 1.2, 0.0, dist);
    
    // Enhanced influence curve with multiple wave components
    float influence = smoothDist * (1.0 - dist / (uRadius * 1.2));
    influence *= 1.0 + sin(uTime * 1.5) * 0.15 + cos(uTime * 2.3) * 0.05;
    influence *= smoothstep(0.0, 1.0, uIsMoving);

    // FIX: Replace sign() with smooth tanh-like approximation for Y axis
    // sign() snaps instantly causing jerky Y movement; smoothSign fades through zero
    vec2 vel = uVelocity;
    float smoothSignX = vel.x / (abs(vel.x) + 0.08);
    float smoothSignY = vel.y / (abs(vel.y) + 0.08);

    float blend = smoothstep(-0.05, 0.15, abs(vel.x) - abs(vel.y));
    vec2 dir = mix(
      vec2(0.0, smoothSignY),
      vec2(smoothSignX, 0.0),
      blend
    );

    // Enhanced displacement with multi-layered animation
    vec2 displacement = dir * influence * uBlockSize * uIntensity;
    displacement *= 1.0 + sin(uTime * 0.8) * 0.2 + cos(uTime * 1.2) * 0.1;

    // Improved UV displacement with additional effects
    vec2 displacedUV = uv - displacement;
    displacedUV += sin(displacedUV.x * 8.0 + uTime) * 0.002 
                 + cos(displacedUV.y * 6.0 + uTime * 0.8) * 0.001;
    
    // Smooth color sampling with subtle color enhancement
    vec4 color = texture2D(uTexture, displacedUV);
    color.rgb *= 1.0 + influence * 0.1;

    gl_FragColor = color;
  }
`;

function PlaneWithShader({ texture }) {
  const materialRef = useRef();
  const shaderMaterialRef = useRef(null);
  const { size, viewport } = useThree();
  const clock = useRef(new THREE.Clock());
  const isMovingRef = useRef(1.0);
  const moveTimeoutRef = useRef(null);

  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const velocityRef = useRef(new THREE.Vector2(0.0, 0.0));
  const lastMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const targetVelocityRef = useRef(new THREE.Vector2(0.0, 0.0));
  
  // Same two-stage smoothing for both X and Y — no separate Y buffer
  const smoothedVelocityRef = useRef(new THREE.Vector2(0.0, 0.0));

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uVelocity: { value: new THREE.Vector2(0.0, 0.5) },
          uBlockSize: { value: 1.0 / 35.0 },
          uRadius: { value: 0.3 },
          uIntensity: { value: 1.8 },
          uTime: { value: 2 },
          uIsMoving: { value: 1.0 },
          uTexture: { value: texture },
        },
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
        transparent: false,
      }),
    [texture]
  );

  useEffect(() => {
    shaderMaterialRef.current = shaderMaterial;
  }, [shaderMaterial]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newMouse = new THREE.Vector2(
        e.clientX / size.width,
        1.0 - e.clientY / size.height
      );

      const vel = newMouse.clone().sub(lastMouseRef.current);

      targetMouseRef.current.copy(newMouse);
      targetVelocityRef.current.copy(vel.multiplyScalar(35.0));

      lastMouseRef.current.copy(newMouse);

      isMovingRef.current = 1.0;

      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }

      moveTimeoutRef.current = setTimeout(() => {
        isMovingRef.current = 0.0;
      }, 300);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [size]);

  useFrame((state, delta) => {
    const material = shaderMaterialRef.current;
    if (!material) return;

    material.uniforms.uTime.value = clock.current.getElapsedTime();

    // Smooth mouse position
    const currentMouse = material.uniforms.uMouse.value;
    currentMouse.lerp(targetMouseRef.current, 0.15);

    // Identical two-stage smoothing for both X and Y
    smoothedVelocityRef.current.lerp(targetVelocityRef.current, 0.06);

    const currentVelocity = material.uniforms.uVelocity.value;
    currentVelocity.lerp(smoothedVelocityRef.current, 0.15);

    // Gradual velocity decay
    targetVelocityRef.current.multiplyScalar(0.96);

    // Smooth movement state transition
    material.uniforms.uIsMoving.value = THREE.MathUtils.lerp(
      material.uniforms.uIsMoving.value,
      isMovingRef.current,
      0.05
    );
  });

  const imageAspect = 1920 / 1080;
  const viewportAspect = viewport.width / viewport.height;
  let planeWidth, planeHeight;

  if (imageAspect > viewportAspect) {
    planeWidth = viewport.width;
    planeHeight = viewport.width / imageAspect;
  } else {
    planeHeight = viewport.height;
    planeWidth = viewport.height * imageAspect;
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

export default function Zanjo({ img = "/assets/img/image06.png" }) {
  return (
    <>
          <div className="h-screen w-full relative">
            <div className="pointer-events-none absolute left-0 top-40 z-10 w-full px-5 pt-5 hidden max-sm:block">
              <p className="inline-flex max-w-[92vw] rounded-sm border border-white/15 bg-black/40 px-4 py-2 text-[3.5vw] font-medium text-white/75 backdrop-blur">
                Heads up: the pixel-drift responds to cursor velocity - desktop is the sweet spot.
              </p>
            </div>
           
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <color attach="background" args={["#000000"]} />
              <Scene img={img} />
            </Canvas>
          </div>
       
    </>
  );
}
