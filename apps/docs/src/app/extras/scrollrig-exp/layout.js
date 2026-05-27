"use client";
import { Fluid } from"@/components/ScrollRigComponents/FluidDistortion";
import { GlobalCanvas, SmoothScrollbar } from"@14islands/r3f-scroll-rig";
import { EffectComposer } from"@react-three/postprocessing";
import React from"react";

export default function Layout({ children }) {
 return (
 <>
 <GlobalCanvas
 globalRender={false}
 debug={false}
 dpr={[1, 2]}
 performance={{ min: 0.5 }}
 className="z-990 h-fit w-full"
 >
 <EffectComposer>
 <Fluid curl={0} />
 </EffectComposer>
 </GlobalCanvas>

 <SmoothScrollbar />

 {children}
 </>
 );
}
