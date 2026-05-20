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

  useEffect(() => {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    return () => {
      edgeGeometry.dispose();
    };
  }, [texture, edgeGeometry]);

  return (
    <>
      <mesh renderOrder={1}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={faceColor} toneMapped={false} />
      </mesh>

      <mesh renderOrder={2}>
        <boxGeometry args={[1.002, 1.002, 1.002]} />
        <meshBasicMaterial
          map={texture}
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