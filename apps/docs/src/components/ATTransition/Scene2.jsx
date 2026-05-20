"use client";
import React from"react";

export default function Scene2() {
 return (
 <>
 <color attach="background" args={['#ffffff']} />
 <mesh>
 <sphereGeometry args={[1.5, 64, 64]} />
 <meshBasicMaterial color="#22c55e" />
 </mesh>
 </>
 );
}