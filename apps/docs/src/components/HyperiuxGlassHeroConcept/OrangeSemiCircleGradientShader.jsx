"use client";

import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function OrangeSemiCircleGradientShader({
  color1 = "#050505",
  color2 = "#42170d",
  color3 = "#b74716",
  color4 = "#ff8a3d",

  intensity = 1.15,
  darkStrength = 1.15,

  gradientCenter = [0.5, -0.08],
  radius = 1.05,
  softness = 0.92,

  horizontalMove = 0.4,
  verticalMove = 0.15,
  speed = 0.22,

  cursorStrengthX = 0.14,
  cursorStrengthY = 0.1,
  cursorLerp = 0.045,

  noiseStrength = 0.025,
  grainStrength = 0.012,
}) {
  const materialRef = useRef(null);
  const cursorOffsetRef = useRef(new THREE.Vector2(0, 0));
  const targetCursorRef = useRef(new THREE.Vector2(0, 0));
  const { pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },

      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uColor3: { value: new THREE.Color(color3) },
      uColor4: { value: new THREE.Color(color4) },

      uIntensity: { value: intensity },
      uDarkStrength: { value: darkStrength },

      uGradientCenter: {
        value: new THREE.Vector2(gradientCenter[0], gradientCenter[1]),
      },

      uCursorOffset: {
        value: new THREE.Vector2(0, 0),
      },

      uRadius: { value: radius },
      uSoftness: { value: softness },

      uHorizontalMove: { value: horizontalMove },
      uVerticalMove: { value: verticalMove },
      uSpeed: { value: speed },

      uNoiseStrength: { value: noiseStrength },
      uGrainStrength: { value: grainStrength },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;

    const uniforms = materialRef.current.uniforms;

    targetCursorRef.current.set(
      pointer.x * cursorStrengthX,
      pointer.y * cursorStrengthY
    );

    cursorOffsetRef.current.lerp(targetCursorRef.current, cursorLerp);

    uniforms.uTime.value = state.clock.getElapsedTime();

    uniforms.uColor1.value.set(color1);
    uniforms.uColor2.value.set(color2);
    uniforms.uColor3.value.set(color3);
    uniforms.uColor4.value.set(color4);

    uniforms.uIntensity.value = intensity;
    uniforms.uDarkStrength.value = darkStrength;

    uniforms.uGradientCenter.value.set(gradientCenter[0], gradientCenter[1]);
    uniforms.uCursorOffset.value.copy(cursorOffsetRef.current);

    uniforms.uRadius.value = radius;
    uniforms.uSoftness.value = softness;

    uniforms.uHorizontalMove.value = horizontalMove;
    uniforms.uVerticalMove.value = verticalMove;
    uniforms.uSpeed.value = speed;

    uniforms.uNoiseStrength.value = noiseStrength;
    uniforms.uGrainStrength.value = grainStrength;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2, 1, 1]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;

          uniform float uTime;

          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          uniform vec3 uColor4;

          uniform float uIntensity;
          uniform float uDarkStrength;

          uniform vec2 uGradientCenter;
          uniform vec2 uCursorOffset;

          uniform float uRadius;
          uniform float uSoftness;

          uniform float uHorizontalMove;
          uniform float uVerticalMove;
          uniform float uSpeed;

          uniform float uNoiseStrength;
          uniform float uGrainStrength;

          varying vec2 vUv;

          float hash(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 45.32);
            return fract(p.x * p.y);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);

            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));

            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(a, b, u.x) +
              (c - a) * u.y * (1.0 - u.x) +
              (d - b) * u.x * u.y;
          }

          void main() {
            vec2 uv = vUv;

            float aspect = 16.0 / 9.0;

            vec2 p = uv;
            p.x *= aspect;

            float moveX = sin(uTime * uSpeed) * uHorizontalMove;
            float moveY = cos(uTime * uSpeed * 0.75) * uVerticalMove;

            vec2 center = uGradientCenter + uCursorOffset;
            center.x *= aspect;
            center += vec2(moveX, moveY);

            float dist = distance(p, center);

            float radial = 1.0 - smoothstep(
              uRadius - uSoftness,
              uRadius + uSoftness,
              dist
            );

            float bottomMask = smoothstep(1.0, 0.15, uv.y);
            float rightGlow = smoothstep(0.05, 1.0, uv.x);

            float glow = radial * bottomMask;
            glow += rightGlow * bottomMask * 0.28;

            float n = noise(uv * 4.0 + vec2(uTime * 0.035, -uTime * 0.02));
            glow += (n - 0.5) * uNoiseStrength;

            glow = clamp(glow, 0.0, 1.0);

            vec3 color = uColor1;

            color = mix(color, uColor2, smoothstep(0.0, 0.38, glow));
            color = mix(color, uColor3, smoothstep(0.24, 0.72, glow));
            color = mix(color, uColor4, smoothstep(0.58, 1.0, glow));

            float topDark = smoothstep(0.42, 1.0, uv.y);
            color = mix(color, uColor1, topDark * uDarkStrength);

            float grain = hash(uv * vec2(1920.0, 1080.0) + uTime);
            color += (grain - 0.5) * uGrainStrength;

            color *= uIntensity;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}