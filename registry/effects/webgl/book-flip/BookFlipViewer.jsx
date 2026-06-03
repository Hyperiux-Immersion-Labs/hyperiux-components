'use client'
import { Loader } from"@react-three/drei";
import { Canvas } from"@react-three/fiber";
import { Suspense, useState, useEffect } from"react";
import { Experience } from"./Experience";
import { UI } from"./UI";
import { PageProvider } from"./PageContext";

/**
 * BookFlipViewer - A reusable 3D book flip viewer component
 *  * Props:
 * - images: Array<string> - Array of image names/paths for book pages
 * - pathPattern: string - Base path for images (e.g.,"/assets/nature")
 * - bgColor: string - Background color of the canvas (default: black)
 * - cameraDistance: { mobile: number, desktop: number } - Camera Z position
 * - floatConfig: object - Float animation configuration
 * - showUI: boolean - Show page navigation UI
 */
export const BookFlipViewer = ({  images = [],
 pathPattern ="/assets/nature",
 bgColor ="#000000",
 cameraDistance = { mobile: 9, desktop: 4 },
 floatConfig = {},
 showUI = true,
 ...props
}) => {
 const [cameraZ, setCameraZ] = useState(cameraDistance.mobile);
 const horizontalDistance = Math.hypot(0.5, cameraZ);
 const basePolarAngle = Math.atan2(horizontalDistance, 1);
 const orbitLimits = {
 minAzimuthAngle: -Math.PI * 0.06,
 maxAzimuthAngle: Math.PI * 0.06,
 minPolarAngle: basePolarAngle - Math.PI * 0.08,
 maxPolarAngle: basePolarAngle + Math.PI * 0.08,
 rotateSpeed: 0.2,
 };

 useEffect(() => {
 const handleResize = () => {
 setCameraZ(window.innerWidth > 800 ? cameraDistance.desktop : cameraDistance.mobile);
 };
  handleResize();
 window.addEventListener('resize', handleResize);
 return () => window.removeEventListener('resize', handleResize);
 }, [cameraDistance]);

 return (
 <PageProvider>
 {showUI && <UI images={images} />}
 <Loader />
 <div style={{  width:'100vw',  height:'100vh',  position:'fixed',  top: 0,  left: 0,
 backgroundColor: bgColor
 }}>
 <Canvas camera={{
 position: [-0.5, 1, cameraZ],
 fov: 45,
 }}>
 <group position-y={0}>
 <Suspense fallback={null}>
 <Experience
 images={images}
 pathPattern={pathPattern}
 floatConfig={floatConfig}
 orbitControls={orbitLimits}
 {...props}
 />
 </Suspense>
 </group>
 </Canvas>
 </div>
 </PageProvider>
 );
};
