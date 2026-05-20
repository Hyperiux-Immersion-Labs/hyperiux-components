"use client"
import { Canvas, useThree } from'@react-three/fiber';
import { Suspense } from'react';
import { GlassDistortionPlane } from'./glassDistortion/index.jsx';

function Scene() {
 const { viewport } = useThree();

 return (
 <GlassDistortionPlane
 position={[0, 0, 0]}
 scale={[viewport.width, viewport.height, 1]}
 />
 );
}

export default function ScreenPaintCanvas() {
 return (
 <div className="h-screen w-screen z-100 fixed top-0 left-0 pointer-events-none">
 <Canvas
 style={{ height:'100vh', width:'100vw', pointerEvents:'none' }}
 camera={{ position: [0, 0, 1], fov: 75 }}
 >
 <Suspense fallback={null}>
 <Scene />
 </Suspense>
 </Canvas>
 </div>
 );
}
