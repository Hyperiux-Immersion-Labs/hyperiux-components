"use client";
import React from"react";

export default function Scene3() {
 return (
 <>
 <color attach="background" args={['#1a0f0f']} />
 <mesh>
 <boxGeometry args={[2, 2, 2]} />
 <meshBasicMaterial color="#ff6b6b" />
 </mesh>
 </>
 );
}