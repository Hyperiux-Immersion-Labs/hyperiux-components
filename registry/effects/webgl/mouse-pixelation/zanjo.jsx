"use client";
import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = () => `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

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

    vec2 blockCoord = floor(uv / uBlockSize) * uBlockSize + (uBlockSize * 0.5);
    blockCoord += sin(uTime * 0.3) * 0.002 + cos(uTime * 0.4) * 0.001;

    float dist = distance(blockCoord, uMouse);
    float smoothDist = smoothstep(uRadius * 1.2, 0.0, dist);

    float influence = smoothDist * (1.0 - dist / (uRadius * 1.2));
    influence *= 1.0 + sin(uTime * 1.5) * 0.15 + cos(uTime * 2.3) * 0.05;
    influence *= smoothstep(0.0, 1.0, uIsMoving);

    vec2 dir = uVelocity;
    float blend = smoothstep(-0.05, 0.15, abs(uVelocity.x) - abs(uVelocity.y));
    dir = mix(
      vec2(0.0, sign(uVelocity.y)),
      vec2(sign(uVelocity.x), 0.0),
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
  const materialRef = useRef();
  const { size, viewport } = useThree();
  const clock = useRef(new THREE.Clock());
  const isMovingRef = useRef(1.0);
  const moveTimeoutRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const velocityRef = useRef(new THREE.Vector2(0.0, 0.0));
  const lastMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const targetVelocityRef = useRef(new THREE.Vector2(0.0, 0.0));
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
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = setTimeout(() => {
        isMovingRef.current = 0.0;
      }, 300);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, [size]);

  useFrame(() => {
    shaderMaterial.uniforms.uTime.value = clock.current.getElapsedTime();
    const currentMouse = shaderMaterial.uniforms.uMouse.value;
    currentMouse.lerp(targetMouseRef.current, 0.15);
    smoothedVelocityRef.current.lerp(targetVelocityRef.current, 0.06);
    const currentVelocity = shaderMaterial.uniforms.uVelocity.value;
    currentVelocity.lerp(smoothedVelocityRef.current, 0.15);
    targetVelocityRef.current.multiplyScalar(0.96);
    shaderMaterial.uniforms.uIsMoving.value = THREE.MathUtils.lerp(
      shaderMaterial.uniforms.uIsMoving.value,
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

export function Zanjo({ img = "/assets/pixelation/zanjo.jpg" }) {
  return (
    <div className="h-screen w-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        <Scene img={img} />
      </Canvas>
    </div>
  );
}
