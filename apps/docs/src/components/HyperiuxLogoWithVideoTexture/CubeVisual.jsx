"use client";

import React, { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const faceVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const faceFragmentShader = `
  uniform sampler2D uMask;
  uniform sampler2D uVideo;
  uniform vec2 uResolution;
  uniform vec2 uVideoResolution;

  varying vec2 vUv;

  vec2 coverUV(vec2 uv, vec2 screenSize, vec2 mediaSize) {
    float screenRatio = screenSize.x / screenSize.y;
    float mediaRatio = mediaSize.x / mediaSize.y;

    vec2 scaled = uv;

    if (screenRatio > mediaRatio) {
      float scale = mediaRatio / screenRatio;
      scaled.y = (uv.y - 0.5) * scale + 0.5;
    } else {
      float scale = screenRatio / mediaRatio;
      scaled.x = (uv.x - 0.5) * scale + 0.5;
    }

    return scaled;
  }

  void main() {
    vec2 screenUV = gl_FragCoord.xy / uResolution;
    screenUV.y = 1.0 - screenUV.y;

    vec2 videoUV = coverUV(screenUV, uResolution, uVideoResolution);
    vec4 videoCol = texture2D(uVideo, videoUV);
    vec4 maskTex = texture2D(uMask, vUv);

    float maskValue = max(maskTex.r, max(maskTex.g, maskTex.b));
    float alpha = maskValue * maskTex.a;

    if (alpha < 0.02) discard;

    gl_FragColor = vec4(videoCol.rgb, alpha);
  }
`;

const edgeVertexShader = `
  varying vec3 vLocal;

  void main() {
    vLocal = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const edgeFragmentShader = `
  uniform sampler2D uVideo;
  uniform vec2 uResolution;
  uniform vec2 uVideoResolution;
  uniform float uThickness;

  varying vec3 vLocal;

  vec2 coverUV(vec2 uv, vec2 screenSize, vec2 mediaSize) {
    float screenRatio = screenSize.x / screenSize.y;
    float mediaRatio = mediaSize.x / mediaSize.y;

    vec2 scaled = uv;

    if (screenRatio > mediaRatio) {
      float scale = mediaRatio / screenRatio;
      scaled.y = (uv.y - 0.5) * scale + 0.5;
    } else {
      float scale = screenRatio / mediaRatio;
      scaled.x = (uv.x - 0.5) * scale + 0.5;
    }

    return scaled;
  }

  void main() {
    vec2 screenUV = gl_FragCoord.xy / uResolution;
    screenUV.y = 1.0 - screenUV.y;

    vec2 videoUV = coverUV(screenUV, uResolution, uVideoResolution);
    vec4 videoCol = texture2D(uVideo, videoUV);

    vec3 a = abs(vLocal);
    float sx = smoothstep(0.5 - uThickness, 0.5, a.x);
    float sy = smoothstep(0.5 - uThickness, 0.5, a.y);
    float sz = smoothstep(0.5 - uThickness, 0.5, a.z);

    float edgeMask = max(max(sx * sy, sy * sz), sz * sx);

    if (edgeMask < 0.02) discard;

    gl_FragColor = vec4(videoCol.rgb, edgeMask);
  }
`;

export function CubeVisual({
  texture,
  videoTexture = null,
  faceColor = "#1a1a1a",
  outlineColor = "#ffffff",
}) {
  const { size } = useThree();

  const fallbackMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: faceColor,
      toneMapped: false,
    });
  }, [faceColor]);

  const faceMaskMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uMask: { value: texture },
        uVideo: { value: videoTexture },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uVideoResolution: { value: new THREE.Vector2(1920, 1080) },
      },
      vertexShader: faceVertexShader,
      fragmentShader: faceFragmentShader,
      transparent: true,
      depthWrite: false,
    });
  }, [texture, videoTexture, size.width, size.height]);

  const edgeVideoMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uVideo: { value: videoTexture },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uVideoResolution: { value: new THREE.Vector2(1920, 1080) },
        uThickness: { value: 0.075 },
      },
      vertexShader: edgeVertexShader,
      fragmentShader: edgeFragmentShader,
      transparent: true,
      depthWrite: false,
    });
  }, [videoTexture, size.width, size.height]);

  useEffect(() => {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    faceMaskMaterial.uniforms.uResolution.value.set(size.width, size.height);
    edgeVideoMaterial.uniforms.uResolution.value.set(size.width, size.height);

    if (videoTexture?.image?.videoWidth && videoTexture?.image?.videoHeight) {
      faceMaskMaterial.uniforms.uVideoResolution.value.set(
        videoTexture.image.videoWidth,
        videoTexture.image.videoHeight
      );
      edgeVideoMaterial.uniforms.uVideoResolution.value.set(
        videoTexture.image.videoWidth,
        videoTexture.image.videoHeight
      );
    }

    return () => {
      fallbackMaterial.dispose();
      faceMaskMaterial.dispose();
      edgeVideoMaterial.dispose();
    };
  }, [
    texture,
    videoTexture,
    fallbackMaterial,
    faceMaskMaterial,
    edgeVideoMaterial,
    size.width,
    size.height,
  ]);

  return (
    <>
      <mesh renderOrder={1}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={fallbackMaterial} attach="material" />
      </mesh>

      {videoTexture && (
        <>
          <mesh renderOrder={2}>
            <boxGeometry args={[1.002, 1.002, 1.002]} />
            <primitive object={faceMaskMaterial} attach="material" />
          </mesh>

          <mesh renderOrder={3}>
            <boxGeometry args={[1.035, 1.035, 1.035]} />
            <primitive object={edgeVideoMaterial} attach="material" />
          </mesh>
        </>
      )}
    </>
  );
}