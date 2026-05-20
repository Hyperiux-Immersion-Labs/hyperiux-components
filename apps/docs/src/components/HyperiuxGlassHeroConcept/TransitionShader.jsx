"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const TransitionShaderMaterial = shaderMaterial(
  {
    uPrev: null,
    uNext: null,
    uProgress: 0,
    uSoftness: 0.08,
    uAngle: 0.28,
  },
  `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  `
    precision highp float;

    uniform sampler2D uPrev;
    uniform sampler2D uNext;
    uniform float uProgress;
    uniform float uSoftness;
    uniform float uAngle;

    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;

      float diagonal = uv.y + uv.x * uAngle;

      float wipe = smoothstep(
        uProgress - uSoftness,
        uProgress + uSoftness,
        diagonal
      );

      vec4 sceneA = texture2D(uPrev, uv);
      vec4 sceneB = texture2D(uNext, uv);

      gl_FragColor = mix(sceneB, sceneA, wipe);
    }
  `
);

extend({ TransitionShaderMaterial });

export default TransitionShaderMaterial;