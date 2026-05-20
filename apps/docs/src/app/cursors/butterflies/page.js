'use client'

import { useRef, useEffect, useMemo } from'react'
import { Canvas, useFrame, useThree, useLoader } from'@react-three/fiber'
import { useGLTF } from'@react-three/drei'
import * as THREE from'three'
import * as SkeletonUtils from'three/addons/utils/SkeletonUtils.js'

const BUTTERFLY_LIFETIME = 2
const FADE_DURATION = 0.5
const MAX_BUTTERFLIES = 200
const SPAWN_THROTTLE = 120

function ButterflyPool({ matcapMaterial, gltfScene, gltfAnimations }) {
 const poolRef = useRef([])
 const activeCountRef = useRef(0)
 const lastSpawnTime = useRef(0)
 const { size } = useThree()
 const mixersRef = useRef([])

 // Initialize pool of butterfly instances
 const poolGroup = useMemo(() => {
 const group = new THREE.Group()
  for (let i = 0; i < MAX_BUTTERFLIES; i++) {
 const clone = SkeletonUtils.clone(gltfScene)
  // Create unique material instance for each butterfly to allow individual opacity
 const instanceMaterial = matcapMaterial.clone()
 instanceMaterial.transparent = true
 instanceMaterial.opacity = 1
  clone.traverse((child) => {
 if (child.isMesh || child.isSkinnedMesh) {
 child.material = instanceMaterial
 }
 })
 clone.scale.setScalar(0.0012)
 clone.visible = false
 clone.userData = {
 active: false,
 direction: new THREE.Vector3(),
 createdAt: 0,
 animationOffset: 0,
 initialRotation: new THREE.Euler(),
 material: instanceMaterial
 }
  // Create animation mixer for this instance
 const mixer = new THREE.AnimationMixer(clone)
 if (gltfAnimations.length > 0) {
 const action = mixer.clipAction(gltfAnimations[0])
 action.play()
 clone.userData.mixer = mixer
 clone.userData.action = action
 }
 mixersRef.current.push(mixer)
  group.add(clone)
 poolRef.current.push(clone)
 }
  return group
 }, [gltfScene, gltfAnimations, matcapMaterial])

 useFrame((state, delta) => {
 const now = state.clock.elapsedTime
  // Update all active butterflies
 for (let i = 0; i < MAX_BUTTERFLIES; i++) {
 const butterfly = poolRef.current[i]
 const data = butterfly.userData
  if (!data.active) continue
  const age = now - data.createdAt
 const fadeStartTime = BUTTERFLY_LIFETIME - FADE_DURATION
  // Handle fade out
 if (age > fadeStartTime) {
 const fadeProgress = (age - fadeStartTime) / FADE_DURATION
 const opacity = Math.max(0, 1 - fadeProgress)
 data.material.opacity = opacity
  // Slow down animation during fade
 if (data.action) {
 data.action.timeScale = (1.6 + Math.random() * 0.8) * opacity
 }
 }
  // Check lifetime (after fade completes)
 if (age > BUTTERFLY_LIFETIME) {
 butterfly.visible = false
 data.active = false
 data.material.opacity = 1 // Reset for next use
 activeCountRef.current--
 continue
 }
  // Update position
 butterfly.position.x += data.direction.x * delta * 2
 butterfly.position.y += data.direction.y * delta * 2
 butterfly.position.z += data.direction.z * delta * 0.5
 butterfly.rotation.x = data.initialRotation.x + Math.sin(now * 3 + butterfly.position.x) * 0.1
 butterfly.rotation.y = data.initialRotation.y
 butterfly.rotation.z = data.initialRotation.z
  // Update animation
 if (data.mixer) {
 data.mixer.update(delta)
 }
 }
 })

 useEffect(() => {
 const handleMouseMove = (e) => {
 const now = Date.now()
 if (now - lastSpawnTime.current < SPAWN_THROTTLE) return
 lastSpawnTime.current = now

 const x = (e.clientX / size.width) * 10 - 5
 const y = -(e.clientY / size.height) * 6 + 3
 const count = 3 + Math.floor(Math.random() * 3)
 const createdAt = performance.now() / 1000

 // Find inactive butterflies and activate them
 let spawned = 0
 for (let i = 0; i < MAX_BUTTERFLIES && spawned < count; i++) {
 const butterfly = poolRef.current[i]
 const data = butterfly.userData
  if (!data.active) {
 const angle = Math.random() * Math.PI * 2
  butterfly.position.set(
 x + (Math.random() - 0.5) * 1.5,
 y + (Math.random() - 0.5) * 1.5,
 (Math.random() - 0.5) * 0.5
 )
  data.direction.set(
 Math.cos(angle) * 0.75,
 0.3 + Math.random() * 0.5,
 (Math.random() - 0.5) * 0.3
 )
  // Set random initial rotation for variety
 data.initialRotation.set(
 (Math.random() - 0.5) * Math.PI * 0.3,
 Math.random() * Math.PI * 2,
 (Math.random() - 0.5) * Math.PI * 0.2
 )
 butterfly.rotation.copy(data.initialRotation)
  data.createdAt = createdAt
 data.active = true
 data.material.opacity = 1
 butterfly.visible = true
  if (data.action) {
 data.action.timeScale = 1.6 + Math.random() * 0.8
 data.action.time = Math.random() * 2
 }
  activeCountRef.current++
 spawned++
 }
 }
 }

 window.addEventListener('mousemove', handleMouseMove)
 return () => window.removeEventListener('mousemove', handleMouseMove)
 }, [size])

 return <primitive object={poolGroup} />
}

function ButterflyTrail() {
 const matcapTexture = useLoader(THREE.TextureLoader,'/assets/cursors/butterflies/matcap-white.webp')
 const { scene: gltfScene, animations: gltfAnimations } = useGLTF('/assets/cursors/butterflies/butterfly3.glb')

 const matcapMaterial = useMemo(() => {
 return new THREE.MeshMatcapMaterial({
 matcap: matcapTexture,
 side: THREE.DoubleSide
 })
 }, [matcapTexture])

 return (
 <ButterflyPool  matcapMaterial={matcapMaterial}  gltfScene={gltfScene}  gltfAnimations={gltfAnimations}  />
 )
}

useGLTF.preload('/assets/cursors/butterflies/butterfly3.glb')

export default function ButterfliesPage() {
 return (
 <div className="w-full h-screen relative bg-[#EAEAE9]">
 <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: false, powerPreference:'high-performance', alpha: false }} dpr={[1,1]} performance={{ min: 0.5 }}>
 <color attach="background" args={['#EAEAE9']} />
 <ButterflyTrail />
 </Canvas>
 <h1 className='font-serif text-4xl text-center absolute text-zinc-600 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>ʚଓ Unseen Butterflies ʚଓ</h1>
 </div>
 )
}
