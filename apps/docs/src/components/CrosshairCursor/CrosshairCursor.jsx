"use client";

import React from"react";
import { useMouse } from"../hooks/useMouse";
import"./CrosshairCursor.css";

const CrosshairCursor = ({
 color ="#ffffff",
 centerContent ="•",
 hideNativeCursor = true,
 lineSize = 100,
 gap = 20,
 thickness = 1,
 centerSize = 24,
 smooth = true,
 lerpFactor = 0.14,
 blendMode ="normal",
 className ="",
}) => {
 const { smoothMouse } = useMouse({
 smooth,
 lerpFactor,
 });

 return (
 <div
 className={`crosshair-cursor ${hideNativeCursor ?"hide-native-cursor" :""} ${className}`}
 style={{
"--crosshair-color": color,
"--crosshair-line-size": `${lineSize}px`,
"--crosshair-gap": `${gap}px`,
"--crosshair-thickness": `${thickness}px`,
"--crosshair-center-size": `${centerSize}px`,
"--crosshair-blend-mode": blendMode,
 }}
 >
 <div
 className="crosshair-cursor__inner"
 style={{
 transform: `translate3d(${smoothMouse.current.x}px, ${smoothMouse.current.y}px, 0)`,
 }}
 >
 <span className="crosshair-cursor__line crosshair-cursor__line--top" />
 <span className="crosshair-cursor__line crosshair-cursor__line--right" />
 <span className="crosshair-cursor__line crosshair-cursor__line--bottom" />
 <span className="crosshair-cursor__line crosshair-cursor__line--left" />

 <div className="crosshair-cursor__center">
 {centerContent}
 </div>
 </div>
 </div>
 );
};

export default CrosshairCursor;