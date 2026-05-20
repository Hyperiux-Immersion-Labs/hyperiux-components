"use client";

import React from"react";
import { Canvas } from"@react-three/fiber";
import { CONFIG } from"./config";
import Scene from"./Scene";

export default function ImageParticleBreakdown({
 imageSrc = CONFIG.imageSrc,
 progressRef,
 transitionColors = CONFIG.transitionColors,
}) {
 return (
 <div style={{ width:"100%" }} className="relative z-[3] h-screen">
 <Canvas
 camera={{ position: [0, 0, CONFIG.cameraZ], fov: CONFIG.fov }}
 gl={{ antialias: true, alpha: true }}
 dpr={[1, 2]}
 >
 <Scene
 imageSrc={imageSrc}
 progressRef={progressRef}
 transitionColors={transitionColors}
 />
 </Canvas>
 </div>
 );
}