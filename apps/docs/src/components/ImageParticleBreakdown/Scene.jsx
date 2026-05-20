"use client";

import React, { Suspense } from"react";
import { useThree } from"@react-three/fiber";
import { CONFIG } from"./config";
import ImageParticles from"./ImageParticles";

export default function Scene({ imageSrc, progressRef, transitionColors }) {
 const { width } = useThree((state) => state.viewport);
 const isMobile = width < 6;

 return (
 <Suspense fallback={null}>
 <group position={[0, -0.45, 0]} scale={0.98}>
 <ImageParticles
 imageSrc={imageSrc}
 progressRef={progressRef}
 transitionColors={transitionColors}
 sampleStep={isMobile ? CONFIG.mobileSampleStep : CONFIG.desktopSampleStep}
 worldWidth={isMobile ? CONFIG.mobileWorldWidth : CONFIG.desktopWorldWidth}
 />
 </group>
 </Suspense>
 );
}