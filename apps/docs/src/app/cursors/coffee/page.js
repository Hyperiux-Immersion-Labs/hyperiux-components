'use client'
import React, { useRef, useMemo, useCallback } from'react'
import { Canvas, useFrame } from'@react-three/fiber'
import { useGLTF } from'@react-three/drei'
import * as THREE from'three'

const BEAN_COUNT = 300
const FLOW_DURATION = 4
const START_X = -8
const END_X = 8
const START_Y = 2
const END_Y = -1
const CENTER_DIP_AMOUNT = 1.5
const WAVE_AMPLITUDE = 0.6
const Z_WAVE_AMPLITUDE = 2
const X_SPREAD_RANGE = 4
const Z_SPREAD_RANGE = 1
const BASE_SPEED = 0.15
const SPEED_VARIANCE = 0.2
const BASE_SCALE = 0.2
const SCALE_VARIANCE = 0.2
const ROTATION_SPEED_RANGE = 4
const ROTATION_MULTIPLIER = 0.03
const SCALE_MULTIPLIER = 0.003

// Fluid simulation constants - tuned for smoothness
const FLUID_VISCOSITY = 0.4
const FLUID_MOUSE_FORCE = 0.8
const FLUID_RETURN_FORCE = 0.008
const INTERACTION_RADIUS = 3.0
const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS
const MOUSE_IDLE_TIME = 150 // ms before considering mouse stopped

// Light intensity constants
const MOUSE_LIGHT_INTENSITY = 20

// Ambient scene lighting constants
const AMBIENT_LIGHT_INTENSITY = 0.4
const KEY_LIGHT_INTENSITY = 0.8
const FILL_LIGHT_INTENSITY = 0.4
const RIM_LIGHT_INTENSITY = 0.6

// Shared temp objects for matrix calculations
const tempObject = new THREE.Object3D()

// Shared material
const beanMaterial = new THREE.MeshStandardMaterial({ color:"#392416", roughness: 0.6, metalness: 0.1 })

function CoffeeBeans({ count = BEAN_COUNT, mousePositionRef, mouseVelocityRef, isMouseActiveRef }) {
 const { nodes } = useGLTF('/assets/models/coffebean.glb')
 const meshRef = useRef()
  // Precompute all bean data once
 const beansData = useMemo(() => {
 return Array.from({ length: count }, (_, i) => ({
 offset: (i / count) * Math.PI * 2,
 speed: BASE_SPEED + Math.random() * SPEED_VARIANCE,
 xSpread: (Math.random() - 0.5) * X_SPREAD_RANGE,
 zSpread: (Math.random() - 0.5) * Z_SPREAD_RANGE,
 rotationSpeed: [
 (Math.random() - 0.5) * ROTATION_SPEED_RANGE,
 (Math.random() - 0.5) * ROTATION_SPEED_RANGE,
 (Math.random() - 0.5) * ROTATION_SPEED_RANGE
 ],
 scale: BASE_SCALE + Math.random() * SCALE_VARIANCE,
 mass: 0.5 + Math.random() * 0.5,
 // Per-bean state
 velocity: new THREE.Vector3(0, 0, 0),
 offsetPosition: new THREE.Vector3(0, 0, 0),
 rotation: new THREE.Euler(
 Math.random() * Math.PI * 2,
 Math.random() * Math.PI * 2,
 Math.random() * Math.PI * 2
 )
 }))
 }, [count])
  useFrame((state, delta) => {
 if (!meshRef.current) return
  const time = state.clock.elapsedTime
 const isActive = isMouseActiveRef.current
 const mouseX = mousePositionRef.current.x * 6
 const mouseY = mousePositionRef.current.y * 4
 const mouseVelX = mouseVelocityRef.current.x
 const mouseVelY = mouseVelocityRef.current.y
  // Precompute frame-rate independent values
 const deltaScaled = delta * 60
 const viscosity = isActive ? FLUID_VISCOSITY : FLUID_VISCOSITY * 0.7
 const dampingFactor = Math.pow(viscosity, deltaScaled)
 const returnMultiplier = isActive ? 1 : 2.5
  for (let i = 0; i < count; i++) {
 const bean = beansData[i]
 const beanTime = time * bean.speed + bean.offset
  // Flow path calculation
 const progress = ((beanTime % FLOW_DURATION) / FLOW_DURATION)
 const sinProgress = Math.sin(progress * Math.PI)
 const sinProgress2 = Math.sin(progress * Math.PI * 2)
  const baseX = START_X + (END_X - START_X) * progress + bean.xSpread
 const centerDip = -sinProgress * CENTER_DIP_AMOUNT
 const baseY = START_Y + (END_Y - START_Y) * progress + centerDip + sinProgress2 * WAVE_AMPLITUDE
 const baseZ = bean.zSpread + sinProgress * Z_WAVE_AMPLITUDE
  // Mouse interaction
 if (isActive) {
 const currentX = baseX + bean.offsetPosition.x
 const currentY = baseY + bean.offsetPosition.y
 const currentZ = baseZ + bean.offsetPosition.z
  const dx = currentX - mouseX
 const dy = currentY - mouseY
 const dz = currentZ
 const distSq = dx * dx + dy * dy + dz * dz
  if (distSq < INTERACTION_RADIUS_SQ && distSq > 0.0001) {
 const distance = Math.sqrt(distSq)
 const normalizedDist = distance / INTERACTION_RADIUS
 const falloff = 1 - normalizedDist * normalizedDist * (3 - 2 * normalizedDist)
 const force = falloff * FLUID_MOUSE_FORCE / bean.mass
  const invDist = 1 / distance
 const normalizedDx = dx * invDist
 const normalizedDy = dy * invDist
 const normalizedDz = dz * invDist
  bean.velocity.x += normalizedDx * force + mouseVelX * force * 0.4
 bean.velocity.y += normalizedDy * force + mouseVelY * force * 0.4
 bean.velocity.z += normalizedDz * force * 0.25
  // Swirl effect
 const swirlForce = force * 0.25
 bean.velocity.x += -normalizedDy * swirlForce
 bean.velocity.y += normalizedDx * swirlForce
 }
 }
  // Return force to base position
 const returnStrength = FLUID_RETURN_FORCE * returnMultiplier * (1 + bean.offsetPosition.length() * 0.1)
 bean.velocity.x -= bean.offsetPosition.x * returnStrength
 bean.velocity.y -= bean.offsetPosition.y * returnStrength
 bean.velocity.z -= bean.offsetPosition.z * returnStrength * 1.5
  // Apply viscosity
 bean.velocity.multiplyScalar(dampingFactor)
  // Update offset position
 bean.offsetPosition.x += bean.velocity.x * deltaScaled
 bean.offsetPosition.y += bean.velocity.y * deltaScaled
 bean.offsetPosition.z += bean.velocity.z * deltaScaled
  // Soft clamp offset
 const maxOffset = 3
 const softClamp = (value, max) => {
 if (Math.abs(value) < max) return value
 const sign = value > 0 ? 1 : -1
 return sign * (max + (Math.abs(value) - max) * 0.1)
 }
 bean.offsetPosition.x = softClamp(bean.offsetPosition.x, maxOffset)
 bean.offsetPosition.y = softClamp(bean.offsetPosition.y, maxOffset)
 bean.offsetPosition.z = softClamp(bean.offsetPosition.z, maxOffset * 0.5)
  // Update rotation with velocity influence
 const velocityMagnitude = bean.velocity.length()
 const rotationBoost = 1 + velocityMagnitude * 1.5
  bean.rotation.x += bean.rotationSpeed[0] * ROTATION_MULTIPLIER * rotationBoost * deltaScaled
 bean.rotation.y += bean.rotationSpeed[1] * ROTATION_MULTIPLIER * rotationBoost * deltaScaled
 bean.rotation.z += bean.rotationSpeed[2] * ROTATION_MULTIPLIER * rotationBoost * deltaScaled
  // Set matrix
 const finalScale = bean.scale * SCALE_MULTIPLIER
 tempObject.position.set(
 baseX + bean.offsetPosition.x,
 baseY + bean.offsetPosition.y,
 baseZ + bean.offsetPosition.z
 )
 tempObject.rotation.copy(bean.rotation)
 tempObject.scale.setScalar(finalScale)
 tempObject.updateMatrix()
 meshRef.current.setMatrixAt(i, tempObject.matrix)
 }
  meshRef.current.instanceMatrix.needsUpdate = true
 })
  return (
 <instancedMesh
 ref={meshRef}
 args={[nodes.COFFEE_COFFEE_MAT_0.geometry, beanMaterial, count]}
 />
 )
}

function MouseLight({ mousePositionRef }) {
 const lightRef = useRef()
 const smoothPosition = useRef({ x: 0, y: 0 })
  useFrame((state, delta) => {
 if (!lightRef.current) return
 // Smooth the light position
 const smoothing = 1 - Math.pow(0.001, delta)
 smoothPosition.current.x += (mousePositionRef.current.x - smoothPosition.current.x) * smoothing
 smoothPosition.current.y += (mousePositionRef.current.y - smoothPosition.current.y) * smoothing
  const x = smoothPosition.current.x * 6
 const y = smoothPosition.current.y * 4
 lightRef.current.position.set(x, y, 3)
 })
  return (
 <pointLight
 ref={lightRef}
 intensity={MOUSE_LIGHT_INTENSITY}
 color="#ffd4a3"
 distance={15}
 decay={1}
 />
 )
}

function MouseTracker({ mousePositionRef, mouseVelocityRef, targetPositionRef, targetVelocityRef, isMouseActiveRef, lastMoveTimeRef }) {
 useFrame((state, delta) => {
 const now = Date.now()
 const timeSinceLastMove = now - lastMoveTimeRef.current
 isMouseActiveRef.current = timeSinceLastMove < MOUSE_IDLE_TIME
  const smoothing = 1 - Math.pow(0.0001, delta)
  mousePositionRef.current.x += (targetPositionRef.current.x - mousePositionRef.current.x) * smoothing
 mousePositionRef.current.y += (targetPositionRef.current.y - mousePositionRef.current.y) * smoothing
  const velSmoothing = 1 - Math.pow(0.001, delta)
 mouseVelocityRef.current.x += (targetVelocityRef.current.x - mouseVelocityRef.current.x) * velSmoothing
 mouseVelocityRef.current.y += (targetVelocityRef.current.y - mouseVelocityRef.current.y) * velSmoothing
 mouseVelocityRef.current.x *= Math.pow(0.95, delta * 60)
 mouseVelocityRef.current.y *= Math.pow(0.95, delta * 60)
 })
  return null
}

export default function page() {
 const mousePositionRef = useRef({ x: 0, y: 0 })
 const mouseVelocityRef = useRef({ x: 0, y: 0 })
 const targetPositionRef = useRef({ x: 0, y: 0 })
 const targetVelocityRef = useRef({ x: 0, y: 0 })
 const lastMouseRef = useRef({ x: 0, y: 0, time: Date.now() })
 const isMouseActiveRef = useRef(false)
 const lastMoveTimeRef = useRef(0)
  const handleMouseMove = useCallback((e) => {
 const rect = e.currentTarget.getBoundingClientRect()
 const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
 const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  const now = Date.now()
 const dt = Math.max(now - lastMouseRef.current.time, 1) / 1000
  const vx = (x - lastMouseRef.current.x) / dt
 const vy = (y - lastMouseRef.current.y) / dt
  targetVelocityRef.current.x = vx * 0.08
 targetVelocityRef.current.y = vy * 0.08
 targetPositionRef.current.x = x
 targetPositionRef.current.y = y
  lastMouseRef.current = { x, y, time: now }
 lastMoveTimeRef.current = now
 }, [])
  return (
 <div  className='h-screen w-full bg-linear-to-b from-black to-[#110904] relative'
 onMouseMove={handleMouseMove}
 >
 <p className='absolute text-[#3D1C0C] text-[8vw] w-full text-center font-bold left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>COFFEE BEANS</p>
 <Canvas camera={{ position: [0, 0, 4.8] }} className='h-full w-full'>
 <MouseTracker  mousePositionRef={mousePositionRef}
 mouseVelocityRef={mouseVelocityRef}
 targetPositionRef={targetPositionRef}
 targetVelocityRef={targetVelocityRef}
 isMouseActiveRef={isMouseActiveRef}
 lastMoveTimeRef={lastMoveTimeRef}
 />
 <CoffeeBeans count={BEAN_COUNT} mousePositionRef={mousePositionRef} mouseVelocityRef={mouseVelocityRef} isMouseActiveRef={isMouseActiveRef} />
  {/* Base ambient lighting - always visible */}
 <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} color="#ffeedd" />
  {/* Key light - main illumination from top-right */}
 <directionalLight  position={[5, 5, 5]}  intensity={KEY_LIGHT_INTENSITY}  color="#fff5e6"
 />
  {/* Fill light - softer light from left to reduce harsh shadows */}
 <directionalLight  position={[-4, 2, 3]}  intensity={FILL_LIGHT_INTENSITY}  color="#e6d5c3"
 />
  {/* Rim light - back light for depth and separation */}
 <directionalLight  position={[0, -3, -5]}  intensity={RIM_LIGHT_INTENSITY}  color="#d4a574"
 />
  {/* Mouse-following interactive light */}
 <MouseLight mousePositionRef={mousePositionRef} />
 </Canvas>
 </div>
 )
}
useGLTF.preload('/assets/models/coffebean.glb')
