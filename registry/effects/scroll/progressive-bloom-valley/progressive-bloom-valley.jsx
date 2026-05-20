"use client";

import { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import Experience from "./experience";
import FilmGrainEffect from "./film-grain-effect";
import EdgeBlurEffect from "./edge-blur-effect";

export function ProgressiveBloomValley({
  glbPath = "/valley/camera-path07.glb",
  spritePath = "/valley/pool_summer.png",
  terrainPath = "/valley/terrain.png",
}) {
  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <Canvas
        dpr={[1, 1.5]}
        flat
        gl={{
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <color attach="background" args={["#000"]} />
        <Suspense fallback={null}>
          <Experience glbPath={glbPath} spritePath={spritePath} terrainPath={terrainPath} />
        </Suspense>

        <EffectComposer disableNormalPass>
          <EdgeBlurEffect blurStrength={1.2} blurStart={0.2} />
          <FilmGrainEffect amount={0.05} scale={1} />
          <Vignette offset={0.3} darkness={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
