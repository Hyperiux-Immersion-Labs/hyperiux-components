import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import CameraRig from "./camera-rig";
import Flowers from "./flowers";
import useValleyData from "./use-valley-data";

const FLOWER_CONFIG = {
  flowerProbability: 1.0,
  patchScale: 0.1,
  globalScale: 0.9,
  minScale: 0.1,
  maxScaleRandom: 1.5,
  flowerThreshold: 0.1,
  flowerDensity: 0.35,
  grassScaleMult: 0.8,
  flowerScaleMult: 1.2,
  flowerYOffset: -0.02,
  colorTint: new THREE.Color(0.1, 0.1, 0.1),
  rows: 300,
  perRow: 360,
  defaultFlowerBloom: 1.5,
  hoverGlowMultiplier: 5.0,
  hoverMagneticStrength: 0.1,
  hoverMagneticDirection: 1.0,
  hoverZPull: 0.2,
};

export default function Experience({ glbPath = "/valley/camera-path07.glb", spritePath = "/valley/pool_summer.png", terrainPath = "/valley/terrain.png" }) {
  const gltf = useGLTF(glbPath);
  const sprite = useTexture(spritePath);
  const terrainTex = useTexture(terrainPath);

  useEffect(() => {
    sprite.colorSpace = THREE.SRGBColorSpace;
    sprite.minFilter = THREE.LinearFilter;
    sprite.magFilter = THREE.LinearFilter;
  }, [sprite]);

  const cameraProps = useMemo(() => {
    const scene = gltf?.scene;
    if (!scene) return null;
    const cam =
      scene.getObjectByName("Camera") ||
      scene.getObjectByProperty("type", "PerspectiveCamera") ||
      gltf.cameras?.[0];
    if (!cam) return null;

    return {
      fov: cam.fov,
      near: cam.near,
      far: cam.far,
      rotation: [cam.rotation.x, cam.rotation.y, cam.rotation.z],
    };
  }, [gltf]);

  const { curve, flowers, pathOffset } = useValleyData(gltf, terrainTex, FLOWER_CONFIG);

  if (!curve || !flowers) return null;

  return (
    <>
      <CameraRig
        curve={curve}
        cameraProps={cameraProps}
        scrollConfig={{
          scrollIntensity: 0.1,
          autoSpeed: 0.00015,
          damping: 0.97,
          lerpSpeed: 0.03,
          loopPoint: 0.85,
        }}
      />
      <Flowers data={flowers} sprite={sprite} config={FLOWER_CONFIG} />
      <group position={pathOffset}>
        <Flowers data={flowers} sprite={sprite} config={FLOWER_CONFIG} />
      </group>
    </>
  );
}

Experience.preload = (glbPath = "/valley/camera-path07.glb") => useGLTF.preload(glbPath);
