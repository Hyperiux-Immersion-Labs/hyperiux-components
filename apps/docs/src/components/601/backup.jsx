import React, { useRef, useEffect, useCallback } from"react";
import { useGLTF, useTexture } from"@react-three/drei";
import { useThree, useFrame } from"@react-three/fiber";
import * as THREE from"three";
import { Reflector } from"three/examples/jsm/objects/Reflector.js";

export default function RoomModel(props) {
 const groupRef = useRef();
 const reflectorRef = useRef();
 const { gl } = useThree();
 const { nodes, materials } = useGLTF("/601/final7.glb");

 // TV texture
 const TVtexture = useTexture("/601/tvtex.webp");
 TVtexture.flipY = false;

 // Normal map
 const normalMap = useTexture("/601/normal.webp");
 normalMap.colorSpace = THREE.NoColorSpace;
 normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
 normalMap.anisotropy = 16;
 const normalScale = new THREE.Vector2(0.3, 0.3);

 // Roughness map
 const roughnessMap = useTexture("/601/roughness.webp");
 roughnessMap.repeat.set(4, 4);
 roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;

 const sharedMaterialProps = {
 color:"#000",
 side: THREE.DoubleSide,
 normalMap: normalMap,
 normalScale: normalScale,
 roughness: 0.8,
 };

 // Subtle rotation
 const maxY = 0.09;
 const maxX = 0.05;
 const lerpAmt = 0.05;
 const targetRotation = useRef({ x: 0, y: 0 });

 const handlePointerMove = useCallback(
 (event) => {
 const rect = gl.domElement.getBoundingClientRect();
 const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
 const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
 targetRotation.current.y = x * maxY;
 targetRotation.current.x = -y * maxX;
 },
 [gl]
 );

 useEffect(() => {
 const dom = gl.domElement;
 dom.addEventListener("mousemove", handlePointerMove);
 return () => {
 dom.removeEventListener("mousemove", handlePointerMove);
 };
 }, [gl, handlePointerMove]);

 useFrame(() => {
 if (groupRef.current) {
 groupRef.current.rotation.y +=
 (targetRotation.current.y - groupRef.current.rotation.y) * lerpAmt;
 groupRef.current.rotation.x +=
 (targetRotation.current.x - groupRef.current.rotation.x) * lerpAmt;
 }
 });

 // Add Reflector only once when mounted
 useEffect(() => {
 if (!reflectorRef.current) {
 // Ensure the window is available (client-side)
 const geometry = new THREE.PlaneGeometry(4.2, 10);
 const reflector = new Reflector(geometry, {
 clipBias: 0.003,
 textureWidth: window.innerWidth * window.devicePixelRatio,
 textureHeight: window.innerHeight * window.devicePixelRatio,
 color: 0x666666,
 });
 reflector.rotateX(-Math.PI / 2);
 reflector.position.set(0, -0.95, 0);
 reflectorRef.current = reflector;
 groupRef.current.add(reflector);

 // Clean up on unmount
 return () => {
 if (groupRef.current && reflectorRef.current) {
 groupRef.current.remove(reflectorRef.current);
 }
 reflector.geometry.dispose();
 if (reflector.material.uniforms) {
 // Dispose all textures attached to the reflector uniforms
 for (const key in reflector.material.uniforms) {
 const uniform = reflector.material.uniforms[key];
 if (
 uniform &&
 uniform.value &&
 typeof uniform.value.dispose ==="function"
 ) {
 uniform.value.dispose();
 }
 }
 }
 reflector.material.dispose();
 };
 }
 }, []);

 return (
 <group ref={groupRef} {...props} dispose={null}>
 {/* Room */}
 <mesh castShadow receiveShadow geometry={nodes.room.geometry}>
 <meshStandardMaterial {...sharedMaterialProps} />
 </mesh>
 {/* Door */}
 <mesh castShadow receiveShadow geometry={nodes.Door.geometry}>
 <meshStandardMaterial {...sharedMaterialProps} />
 </mesh>
 {/* TV and Screen */}
 <group scale={0.9}>
 {/* Screen */}
 <mesh castShadow receiveShadow geometry={nodes.screen.geometry}>
 <meshStandardMaterial {...sharedMaterialProps} />
 </mesh>
 {/* TV */}
 <mesh castShadow receiveShadow geometry={nodes.tv.geometry}>
 <meshStandardMaterial
 map={TVtexture}
 emissiveMap={TVtexture}
 emissive="white"
 emissiveIntensity={2}
 toneMapped={false}
 />
 </mesh>
 </group>
 {/* Switch */}
 {nodes.switch && (
 <mesh castShadow receiveShadow geometry={nodes.switch.geometry}>
 <meshStandardMaterial {...sharedMaterialProps} />
 </mesh>
 )}
 {/* Wires */}
 {nodes.wires && (
 <mesh castShadow receiveShadow geometry={nodes.wires.geometry}>
 <meshStandardMaterial {...sharedMaterialProps} />
 </mesh>
 )}
 {/* Ladder */}
 <mesh
 castShadow
 receiveShadow
 geometry={nodes.ladder.geometry}
 material={materials["ladder.002"]}
 >
 <meshStandardMaterial {...sharedMaterialProps} />
 </mesh>
 {/* Remove the old reflective mesh, the real reflector is now handled in useEffect. */}
 <mesh castShadow receiveShadow visible={false}></mesh>
 {/* Bodies */}
 <mesh
 castShadow
 receiveShadow
 geometry={nodes.Body4002.geometry}
 material={materials["Steel - Satin.001"]}
 >
 <meshStandardMaterial {...sharedMaterialProps} />
 </mesh>
 <mesh
 castShadow
 receiveShadow
 geometry={nodes.Body4002_1.geometry}
 material={materials["Powder Coat (Grey).003"]}
 >
 <meshStandardMaterial {...sharedMaterialProps} />
 </mesh>
 <mesh
 castShadow
 receiveShadow
 geometry={nodes.Body4002_2.geometry}
 material={materials["Powder Coat (Grey).002"]}
 >
 <meshStandardMaterial {...sharedMaterialProps} />
 </mesh>
 </group>
 );
}