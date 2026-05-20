"use client"
import React, { useRef, useEffect } from "react";
import { Canvas, extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

// Custom shader material for pixelated grid with trail effect
class PixelTrailMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0.0 },
        uBasePixels: { value: 35.0 },
        uMouseVelocity: { value: new THREE.Vector2(0, 0) },
        uTrailStrength: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uPrevMouse;
        uniform float uHover;
        uniform float uBasePixels;
        uniform vec2 uMouseVelocity;
        uniform float uTrailStrength;

        float noise2D(vec2 p){
          vec2 ip = floor(p);
          vec2 f = fract(p);
          f = f * (3.0 - 2.0 * f);
          float n00 = sin(dot(ip, vec2(12.9898, 78.233)));
          float n10 = sin(dot(ip + vec2(1., 0.), vec2(12.9898, 78.233)));
          float n01 = sin(dot(ip + vec2(0., 1.), vec2(12.9898, 78.233)));
          float n11 = sin(dot(ip + vec2(1., 1.), vec2(12.9898, 78.233)));
          float nx0 = mix(n00, n10, f.x);
          float nx1 = mix(n01, n11, f.x);
          return mix(nx0, nx1, f.y) * 0.5 + 0.5;
        }

        float easeInOutCubic(float t) {
          return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
        }

        // Trail-based distance calculation
        float trailDistance(vec2 point, vec2 mousePos, vec2 velocity) {
          vec2 toPoint = point - mousePos;
          float velocityMag = length(velocity);
          
          if (velocityMag < 0.001) {
            return length(toPoint);
          }
          
          vec2 velocityDir = normalize(velocity);
          float alongTrail = dot(toPoint, velocityDir);
          float perpDist = length(toPoint - velocityDir * alongTrail);
          
          // Elongate in direction of movement
          float trailLength = velocityMag * 15.0;
          float distAlongTrail = abs(alongTrail);
          
          if (alongTrail > 0.0 && alongTrail < trailLength) {
            return perpDist;
          } else if (alongTrail <= 0.0) {
            return length(toPoint);
          } else {
            return length(toPoint - velocityDir * trailLength);
          }
        }

        void main(){
          vUv = uv;
          vPosition = position;

          vec3 pos = position;
          vec2 pixelUV = floor(uv * uBasePixels) / uBasePixels;
          
          // Use trail distance instead of circular distance
          float dist = trailDistance(pixelUV, uMouse, uMouseVelocity);
          
          float hoverRadius = 0.15 + length(uMouseVelocity) * 0.3;
          float hoverEffect = smoothstep(hoverRadius, 0.0, dist) * uHover * uTrailStrength;
          hoverEffect = easeInOutCubic(hoverEffect);

          float noiseValue = noise2D(pixelUV * 8.0 + uTime * 0.3);

          float maxExtrusion = 0.8;
          float extrusion = hoverEffect * (0.6 + noiseValue * 0.4) * maxExtrusion;

          float animationDelay = dist * 2.0;
          float animatedHover = max(0.0, uHover - animationDelay * 0.1);
          animatedHover = clamp(animatedHover * 1.5, 0.0, 1.0);

          extrusion *= easeInOutCubic(animatedHover);

          pos.z += extrusion;
          pos.x += sin(pixelUV.x * 40.0) * hoverEffect * 0.008;
          pos.y += cos(pixelUV.y * 40.0) * hoverEffect * 0.008;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
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
          float distAlongTrail = abs(alongTrail);
          
          if (alongTrail > 0.0 && alongTrail < trailLength) {
            return perpDist;
          } else if (alongTrail <= 0.0) {
            return length(toPoint);
          } else {
            return length(toPoint - velocityDir * trailLength);
          }
        }

        float easeInOutCubic(float t) {
          return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
        }

        void main(){
          vec2 uv = vUv;
          vec2 pixelUV = floor(uv * uBasePixels) / uBasePixels;
          
          float dist = trailDistance(pixelUV, uMouse, uMouseVelocity);
          float hoverRadius = 0.15 + length(uMouseVelocity) * 0.3;
          float hoverEffect = smoothstep(hoverRadius, 0.0, dist) * uHover * uTrailStrength;
          hoverEffect = easeInOutCubic(hoverEffect);

          float depthShading = 1.0 + vPosition.z * 0.3;

          vec3 topColor = vec3(.0, 0., 0);
          vec3 sideColor = vec3(0.01, 0.01, 0.01);

          float topFaceFactor = smoothstep(0.7, 1.0, normalize(vPosition).z);
          vec3 cubeColor = mix(sideColor, topColor, topFaceFactor);

          float light = 0.5 + 0.5 * dot(normalize(vec3(0.3, 0.5, 1.0)), normalize(vPosition + vec3(0.0, 0.0, 1.0)));
          cubeColor *= light;

          vec2 pixelCenter = (floor(uv * uBasePixels) + 0.5) / uBasePixels;
          vec2 pixelOffset = abs(uv - pixelCenter) * uBasePixels;
          float border = step(0.45, max(pixelOffset.x, pixelOffset.y));
          cubeColor = mix(cubeColor, vec3(0.0), border * 0.9);

          float vig = 1.0 - smoothstep(0.3, 3.2, length(uv - 0.5) * 2.0);
          cubeColor *= mix(1.0, vig, 0.6);

          gl_FragColor = vec4(cubeColor * depthShading, 1.0);
        }
      `,
    });
  }
}

extend({ PixelTrailMaterial });

// Custom shader material for the deforming cube
class CubeDeformMaterial extends THREE.ShaderMaterial {
  constructor(color, emissive) {
    super({
      uniforms: {
        uColor: { value: color },
        uEmissive: { value: emissive },
        uEmissiveIntensity: { value: 2.4 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uEmissive;
        uniform float uEmissiveIntensity;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Basic lighting
          vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
          float diff = max(dot(vNormal, lightDir), 0.0);
          
          // Base color
          vec3 baseColor = uColor;
          
          // Add lighting
          vec3 litColor = baseColor * (0.3 + 0.7 * diff);
          
          // Add emissive
          vec3 finalColor = litColor + (uEmissive * uEmissiveIntensity * 0.9);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }
}

extend({ CubeDeformMaterial });

function PixelGrid({ mousePositionRef, mouseVelocityRef, trailStrengthRef }) {
  const matRef = useRef();
  const meshRef = useRef();
  const pointerTarget = useRef({ x: 0.5, y: 0.5 });
  const pointerCurrent = useRef({ x: 0.5, y: 0.5 });
  const prevPointer = useRef({ x: 0.5, y: 0.5 });
  const lastPointerPos = useRef({ x: 0.5, y: 0.5 });
  const isMoving = useRef(false);
  const lastMoveTime = useRef(0);
  const movementThreshold = 0.001;

  const onPointerMove = (e) => {
    const [u, v] = e.uv;
    const currentTime = Date.now();
    const deltaX = Math.abs(u - lastPointerPos.current.x);
    const deltaY = Math.abs(v - lastPointerPos.current.y);
    const moved = deltaX > movementThreshold || deltaY > movementThreshold;

    if (moved) {
      prevPointer.current.x = pointerTarget.current.x;
      prevPointer.current.y = pointerTarget.current.y;
      pointerTarget.current.x = u;
      pointerTarget.current.y = v;
      lastPointerPos.current.x = u;
      lastPointerPos.current.y = v;
      lastMoveTime.current = currentTime;
      isMoving.current = true;
    }

    mousePositionRef.current.x = u;
    mousePositionRef.current.y = v;
  };

  useFrame((state) => {
    if (!matRef.current) return;
    const time = state.clock.getElapsedTime();
    const currentTime = Date.now();
    matRef.current.uniforms.uTime.value = time;

    const timeSinceLastMove = currentTime - lastMoveTime.current;
    if (timeSinceLastMove > 500) {
      isMoving.current = false;
    }

    const oldX = pointerCurrent.current.x;
    const oldY = pointerCurrent.current.y;

    pointerCurrent.current.x += (pointerTarget.current.x - pointerCurrent.current.x) * 0.1;
    pointerCurrent.current.y += (pointerTarget.current.y - pointerCurrent.current.y) * 0.1;

    // Calculate velocity for trail effect
    const velocityX = pointerCurrent.current.x - oldX;
    const velocityY = pointerCurrent.current.y - oldY;

    // Smooth velocity
    mouseVelocityRef.current.x = mouseVelocityRef.current.x * 0.8 + velocityX * 0.2;
    mouseVelocityRef.current.y = mouseVelocityRef.current.y * 0.8 + velocityY * 0.2;

    matRef.current.uniforms.uMouse.value.set(
      pointerCurrent.current.x,
      pointerCurrent.current.y
    );

    matRef.current.uniforms.uMouseVelocity.value.set(
      mouseVelocityRef.current.x,
      mouseVelocityRef.current.y
    );

    const hv = matRef.current.uniforms.uHover.value;
    const target = isMoving.current ? 1 : 0;
    const transitionSpeed = isMoving.current ? 0.06 : 0.008;
    matRef.current.uniforms.uHover.value += (target - hv) * transitionSpeed;

    // Trail strength based on velocity
    const velocityMag = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const targetTrail = Math.min(1.0, velocityMag * 50.0 + 0.3);
    trailStrengthRef.current += (targetTrail - trailStrengthRef.current) * 0.1;
    matRef.current.uniforms.uTrailStrength.value = trailStrengthRef.current;

    mousePositionRef.current.x = pointerCurrent.current.x;
    mousePositionRef.current.y = pointerCurrent.current.y;
  });

  return (
    <mesh ref={meshRef} onPointerMove={onPointerMove}>
      <planeGeometry args={[18, 12, 200, 200]} />
      {/* Pass black color to material (shader uses a fixed color, so we override inside the material definition) */}
      <pixelTrailMaterial ref={matRef} color={new THREE.Color(0x000000)} />
    </mesh>
  );
}

function DeformingCube({ mousePositionRef, mouseVelocityRef, trailStrengthRef }) {
  const cubeRef = useRef();
  const geometryRef = useRef();
  const originalPositions = useRef(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const materialRef = useRef();

  const { camera } = useThree();

  // Colors in {r,g,b} linear 0..1
  const colorOptions = [
    { color: new THREE.Color("#39FF14"), emissive: new THREE.Color("#39FF14") }, // neon green
    { color: new THREE.Color("aqua"), emissive: new THREE.Color("aqua") },       // aqua
    { color: new THREE.Color("#FFD600"), emissive: new THREE.Color("#FFD600") },
  ];

  // Track color state for smooth interpolation
  // color: THREE.Color object for current, target, and intermediary timer
  const colorState = useRef({
    current: colorOptions[0].color.clone(),
    target: colorOptions[0].color.clone(),
    currentEmissive: colorOptions[0].emissive.clone(),
    targetEmissive: colorOptions[0].emissive.clone(),
    lastSwitch: Date.now(),
    interval: 1200 + Math.random() * 5000, // ms
  });

  // Set initial geometry
  useEffect(() => {
    if (cubeRef.current) {
      const geometry = cubeRef.current.geometry;
      geometryRef.current = geometry;
      originalPositions.current = geometry.attributes.position.array.slice();
    }
  }, []);

  useFrame(() => {
    if (!cubeRef.current || !geometryRef.current || !originalPositions.current) return;

    // --- Smooth Color Transition Logic ---
    const now = Date.now();
    // Switch to a new target color when interval elapses
    if (now - colorState.current.lastSwitch > colorState.current.interval) {
      let nextIdx = Math.floor(Math.random() * colorOptions.length);
      // Get currently used target index
      const currentIndex = colorOptions.findIndex(opt =>
        opt.emissive.equals(colorState.current.targetEmissive)
      );
      if (nextIdx === currentIndex) {
        nextIdx = (nextIdx + 1) % colorOptions.length;
      }
      colorState.current.target.copy(colorOptions[nextIdx].color);
      colorState.current.targetEmissive.copy(colorOptions[nextIdx].emissive);

      colorState.current.lastSwitch = now;
      colorState.current.interval = 1200 + Math.random() * 5000; // next interval
    }

    // Smoothly blend current color toward target color (RGB, linear space)
    colorState.current.current.lerp(colorState.current.target, 0.1); // adjust for smoothness
    colorState.current.currentEmissive.lerp(colorState.current.targetEmissive, 0.1);

    if (materialRef.current) {
      // Update shader uniforms for color
      materialRef.current.uniforms.uColor.value.copy(colorState.current.current);
      materialRef.current.uniforms.uEmissive.value.copy(colorState.current.currentEmissive);
    }
    // --- End color transition ---

    // Rotation based on mouse
    const x = mousePositionRef.current.x;
    const y = mousePositionRef.current.y;
    targetRotation.current.x = (y - 0.5) * Math.PI / 2;
    targetRotation.current.y = (x - 0.5) * Math.PI / 1.5;

    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.12;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.12;

    cubeRef.current.rotation.x = currentRotation.current.x;
    cubeRef.current.rotation.y = currentRotation.current.y;

    // Calculate distance from mouse to cube (in screen space)
    const cubeWorldPos = new THREE.Vector3();
    cubeRef.current.getWorldPosition(cubeWorldPos);
    cubeWorldPos.project(camera);

    // Convert to 0-1 range
    const cubeScreenX = (cubeWorldPos.x + 1) / 2;
    const cubeScreenY = (cubeWorldPos.y + 1) / 2;

    const distToCube = Math.sqrt(
      Math.pow(mousePositionRef.current.x - cubeScreenX, 2) +
      Math.pow(mousePositionRef.current.y - cubeScreenY, 2)
    );

    // Deformation strength based on distance and trail
    const maxDist = 2.0;
    const deformStrength = Math.max(0, 1 - distToCube / maxDist) * trailStrengthRef.current;

    // Apply ripple deformation
    const positions = geometryRef.current.attributes.position.array;
    const time = Date.now() * 0.003;

    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions.current[i];
      const y = originalPositions.current[i + 1];
      const z = originalPositions.current[i + 2];

      const distFromCenter = Math.sqrt(x * x + y * y + z * z);

      // Ripple effect
      const wave = Math.sin(distFromCenter * 8.0 - time * 3.0) * 0.15;
      const ripple = wave * deformStrength;

      // Direction-based deformation using velocity
      const velocityInfluence =
        (x * mouseVelocityRef.current.x + y * mouseVelocityRef.current.y) * 100.0;

      const deformation = (ripple + velocityInfluence * deformStrength) * 0.3;

      positions[i] = x + x * deformation;
      positions[i + 1] = y + y * deformation;
      positions[i + 2] = z + z * deformation;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.computeVertexNormals();
  });



  return (
    <mesh ref={cubeRef} position={[0, 0, 1]} layers={1}>
      <boxGeometry args={[1, 1, 1, 20, 20, 20]} />
      <cubeDeformMaterial
        ref={materialRef}
        args={[new THREE.Color("#ffffff"), new THREE.Color("#ffffff")]}
      />
    </mesh>
  );
}

export default function EnhancedPixelCube() {
  const mousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const trailStrengthRef = useRef(0);
  const routes = [
    {
      href: "/mouse-pixelation/demo/v1",
      children: "V1",
    },
    {
      href: "/mouse-pixelation/demo/v2",
      children: "V2",
    },
    {
      href: "/mouse-pixelation/demo/v3",
      children: "V3",
    },
  ];

  return (
    <>
     
        <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
          <Canvas
            camera={{ position: [0, 0, 4], fov: 75 }}
            gl={{ antialias: true }}
            onCreated={({ gl, scene, camera }) => {
              gl.setClearColor('#000000');
              // Setup layers for selective bloom
              camera.layers.enable(1);
            }}
          >


            {/* Grid on default layer (no bloom) */}
            <PixelGrid
              mousePositionRef={mousePositionRef}
              mouseVelocityRef={mouseVelocityRef}
              trailStrengthRef={trailStrengthRef}
            />

            {/* Cube on layer 1 with selective bloom */}
            <EffectComposer>
              <Bloom
                intensity={1}
                luminanceThreshold={1.5}
                luminanceSmoothing={0.5}  // reduced smoothing for less bloom dispersion
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
   
    </>
  );
}