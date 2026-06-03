"use client";

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";

export function CubeVisual({
  texture,
  faceColor = "#1a1a1a",
  outlineColor = "#ffffff",
}) {
  const edgeGeometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    return new THREE.EdgesGeometry(geo);
  }, []);

  const configuredTexture = useMemo(() => {
    const nextTexture = texture.clone();
    nextTexture.wrapS = THREE.ClampToEdgeWrapping;
    nextTexture.wrapT = THREE.ClampToEdgeWrapping;
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, [texture]);

  useEffect(() => {
    return () => {
      edgeGeometry.dispose();
      configuredTexture.dispose();
    };
  }, [edgeGeometry, configuredTexture]);

  return (
    <>
      <mesh renderOrder={1}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={faceColor} toneMapped={false} />
      </mesh>

      <mesh renderOrder={2}>
        <boxGeometry args={[1.002, 1.002, 1.002]} />
        <meshBasicMaterial
          map={configuredTexture}
          color="#ffffff"
          transparent
          alphaTest={0.01}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      <lineSegments geometry={edgeGeometry} renderOrder={3}>
        <lineBasicMaterial color={outlineColor} toneMapped={false} />
      </lineSegments>
    </>
  );
}
