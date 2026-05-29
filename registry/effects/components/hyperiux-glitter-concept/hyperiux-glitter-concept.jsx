"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import MouseTrailParticles from "./MouseTrailParticles";
import MorphingParticleModel from "./MorphingParticleModelNew";

export default function HyperiuxGlitterConcept() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.2} />

        <Suspense fallback={null}>
          <Center>
            <MorphingParticleModel
              url="/assets/models/hyperiux-new-model.glb"
              scale={0.15}
              particleCount={10000}
              color="#ffffff"
              size={0.18}
              speed={1.15}
              opacity={1}
              brightness={4.5}
              showModel={false}
              modelOpacity={0}
              frontFacingThreshold={0.12}
              frontFacingSoftness={0.05}
            />
          </Center>

          <MouseTrailParticles
            maxParticles={700}
            spawnPerMove={4}
            particleLife={0.4}
            size={0.14}
            color="#ffffff"
            brightness={5.5}
            zOffset={0.1}
            spread={0.035}
            velocityStrength={0.24}
            lerpFactor={0.12}
            idleDamping={0.92}
            stopSpeedThreshold={0.0015}
            idleModeDelay={1.2}
            idleCometDelayMin={0.5}
            idleCometDelayMax={1.4}
            idleCometLife={0.85}
            idleCometSpeedMin={4.1}
            idleCometSpeedMax={10.1}
            idleCometSpawnPerFrame={10}
            idleCometTrailSpread={0.08}
            idleCometViewportPadding={0.25}
          />
        </Suspense>

        <EffectComposer multisampling={4}>
          <Bloom intensity={0.25} luminanceThreshold={0.72} luminanceSmoothing={0.08} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

