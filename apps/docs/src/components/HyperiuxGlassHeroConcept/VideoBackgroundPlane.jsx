"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

export default function VideoBackgroundPlane({
  src = "/assets/models/bg-video.mp4",
  position = [0, 0, -1.6],
  scale = [1, 1, 1],
  opacity = 1,
}) {
  const [video] = useState(() => {
    if (typeof window === "undefined") return null;

    const el = document.createElement("video");
    el.src = src;
    el.crossOrigin = "anonymous";
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.autoplay = true;
    el.preload = "auto";

    return el;
  });

  const texture = useMemo(() => {
    if (!video) return null;

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;

    return tex;
  }, [video]);

  useEffect(() => {
    if (!video) return;

    video.play().catch(() => {});

    return () => {
      video.pause();
    };
  }, [video]);

  if (!texture) return null;

  return (
    <mesh position={position} scale={scale} frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[9, 5, 1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        toneMapped={false}
        depthWrite={false}
        depthTest={true}
      />
    </mesh>
  );
}