"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import MouseTrailParticles from "@/components/HyperiuxGlitterConcept/MouseTrailParticles";
// import ImageParticleModel from "@/components/HyperiuxGlitterConcept/MorphingParticleModel";
import MorphingParticleModel from "@/components/HyperiuxGlitterConcept/MorphingParticleModelNew";

export default function ParticlePage() {
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
            {/* <ImageParticleModel
              src="/assets/models/new-logo-texture.png"
              scale={0.55}
              color="#ffffff"
              size={0.22}
              speed={1.15}
              opacity={1}
              brightness={4.5}
              maxWorldWidth={8}
              alphaThreshold={110}
              rasterSize={300}
              fillSpacing={2}
              edgeSpacing={3}
              edgeInset={0}
              edgeBoost={false}
              depthJitter={0}
              showImage={false}
              parallaxStrength={0.12}
              parallaxLerp={0.08}
              rotationStrengthX={0.12}
              rotationStrengthY={0.18}
              rotationStrengthZ={0.04}
              rotationLerp={0.08}
              interactionRadius={0.8}
              interactionStrength={0.56}
              interactionDepth={0.02}
              interactionLerp={0.2}
              returnLerp={0.09}
              cursorLerp={0.22}
              maxOffset={0.56}
            /> */}
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
          <Bloom
            intensity={0.25}
            luminanceThreshold={0.72}
            luminanceSmoothing={0.08}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
