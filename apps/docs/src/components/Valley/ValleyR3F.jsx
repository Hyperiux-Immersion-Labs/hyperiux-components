"use client";

import { Suspense } from"react";
import * as THREE from"three";
import { Canvas } from"@react-three/fiber";
import Experience from"./Experience";
import { Environment } from"@react-three/drei";
import { Bloom, EffectComposer, Vignette } from"@react-three/postprocessing";
import FilmGrainEffect from"./FilmGrainEffect";
import EdgeBlurEffect from"./EdgeBlurEffect";

export default function ValleyR3F() {
 return (
 <div className="h-screen w-full relative">

 <Canvas
 dpr={[1, 1.5]}
 flat
 gl={{
 powerPreference:"high-performance",
 outputColorSpace: THREE.SRGBColorSpace,
 }}

 >
 <color attach="background" args={["#000"]} />
 <Suspense fallback={null}>
 <Experience />
 </Suspense>

 <EffectComposer disableNormalPass>
 {/* Mipmap blur creates an extremely soft, diffused glow without harsh edges */}
 {/* Threshold ensures only the hovered (multiplied) pixels bloom, preserving details elsewhere */}
  <EdgeBlurEffect blurStrength={1.2} blurStart={0.2} />
 <FilmGrainEffect amount={0.05} scale={1} />
 <Vignette

 offset={0.3}
 darkness={.7}
 />
 </EffectComposer>
 </Canvas>
 </div>
 );
}
