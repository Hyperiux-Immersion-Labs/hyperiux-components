'use client'

import { useCallback, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const BEAN_COUNT = 300
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
const FLUID_VISCOSITY = 0.4
const FLUID_MOUSE_FORCE = 0.8
const FLUID_RETURN_FORCE = 0.008
const INTERACTION_RADIUS = 3
const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS
const MOUSE_IDLE_TIME = 150

const beanMaterial = new THREE.MeshStandardMaterial({ color: '#392416', roughness: 0.6, metalness: 0.1 })
const tempObject = new THREE.Object3D()

function CoffeeBeans({ count = BEAN_COUNT, mousePositionRef, mouseVelocityRef, isMouseActiveRef }) {
  const { nodes } = useGLTF('/assets/models/coffebean.glb')
  const meshRef = useRef(null)

  const beansData = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        offset: (index / count) * Math.PI * 2,
        speed: BASE_SPEED + Math.random() * SPEED_VARIANCE,
        xSpread: (Math.random() - 0.5) * X_SPREAD_RANGE,
        zSpread: (Math.random() - 0.5) * Z_SPREAD_RANGE,
        rotationSpeed: [
          (Math.random() - 0.5) * ROTATION_SPEED_RANGE,
          (Math.random() - 0.5) * ROTATION_SPEED_RANGE,
          (Math.random() - 0.5) * ROTATION_SPEED_RANGE,
        ],
        scale: BASE_SCALE + Math.random() * SCALE_VARIANCE,
        mass: 0.5 + Math.random() * 0.5,
        velocity: new THREE.Vector3(0, 0, 0),
        offsetPosition: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2),
      })),
    [count]
  )

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime
    const isActive = isMouseActiveRef.current
    const mouseX = mousePositionRef.current.x * 6
    const mouseY = mousePositionRef.current.y * 4
    const mouseVelX = mouseVelocityRef.current.x
    const mouseVelY = mouseVelocityRef.current.y
    const deltaScaled = delta * 60
    const dampingFactor = Math.pow(isActive ? FLUID_VISCOSITY : FLUID_VISCOSITY * 0.7, deltaScaled)
    const returnMultiplier = isActive ? 1 : 2.5

    for (let index = 0; index < count; index += 1) {
      const bean = beansData[index]
      const beanTime = time * bean.speed + bean.offset
      const progress = (beanTime % 4) / 4
      const sinProgress = Math.sin(progress * Math.PI)
      const sinProgress2 = Math.sin(progress * Math.PI * 2)
      const baseX = START_X + (END_X - START_X) * progress + bean.xSpread
      const baseY = START_Y + (END_Y - START_Y) * progress - sinProgress * CENTER_DIP_AMOUNT + sinProgress2 * WAVE_AMPLITUDE
      const baseZ = bean.zSpread + sinProgress * Z_WAVE_AMPLITUDE

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
          const force = (falloff * FLUID_MOUSE_FORCE) / bean.mass
          const invDist = 1 / distance
          const ndx = dx * invDist
          const ndy = dy * invDist
          const ndz = dz * invDist
          bean.velocity.x += ndx * force + mouseVelX * force * 0.4
          bean.velocity.y += ndy * force + mouseVelY * force * 0.4
          bean.velocity.z += ndz * force * 0.25
          const swirlForce = force * 0.25
          bean.velocity.x += -ndy * swirlForce
          bean.velocity.y += ndx * swirlForce
        }
      }

      const returnStrength = FLUID_RETURN_FORCE * returnMultiplier * (1 + bean.offsetPosition.length() * 0.1)
      bean.velocity.x -= bean.offsetPosition.x * returnStrength
      bean.velocity.y -= bean.offsetPosition.y * returnStrength
      bean.velocity.z -= bean.offsetPosition.z * returnStrength * 1.5
      bean.velocity.multiplyScalar(dampingFactor)

      bean.offsetPosition.x += bean.velocity.x * deltaScaled
      bean.offsetPosition.y += bean.velocity.y * deltaScaled
      bean.offsetPosition.z += bean.velocity.z * deltaScaled

      const softClamp = (value, max) => {
        if (Math.abs(value) < max) return value
        const sign = value > 0 ? 1 : -1
        return sign * (max + (Math.abs(value) - max) * 0.1)
      }

      bean.offsetPosition.x = softClamp(bean.offsetPosition.x, 3)
      bean.offsetPosition.y = softClamp(bean.offsetPosition.y, 3)
      bean.offsetPosition.z = softClamp(bean.offsetPosition.z, 1.5)

      const rotationBoost = 1 + bean.velocity.length() * 1.5
      bean.rotation.x += bean.rotationSpeed[0] * ROTATION_MULTIPLIER * rotationBoost * deltaScaled
      bean.rotation.y += bean.rotationSpeed[1] * ROTATION_MULTIPLIER * rotationBoost * deltaScaled
      bean.rotation.z += bean.rotationSpeed[2] * ROTATION_MULTIPLIER * rotationBoost * deltaScaled

      tempObject.position.set(baseX + bean.offsetPosition.x, baseY + bean.offsetPosition.y, baseZ + bean.offsetPosition.z)
      tempObject.rotation.copy(bean.rotation)
      tempObject.scale.setScalar(bean.scale * SCALE_MULTIPLIER)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(index, tempObject.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} args={[nodes.COFFEE_COFFEE_MAT_0.geometry, beanMaterial, count]} />
}

function MouseLight({ mousePositionRef }) {
  const lightRef = useRef(null)
  const smoothPosition = useRef({ x: 0, y: 0 })

  useFrame((_, delta) => {
    if (!lightRef.current) return
    const smoothing = 1 - Math.pow(0.001, delta)
    smoothPosition.current.x += (mousePositionRef.current.x - smoothPosition.current.x) * smoothing
    smoothPosition.current.y += (mousePositionRef.current.y - smoothPosition.current.y) * smoothing
    lightRef.current.position.set(smoothPosition.current.x * 6, smoothPosition.current.y * 4, 3)
  })

  return <pointLight ref={lightRef} intensity={20} color="#ffd4a3" distance={15} decay={1} />
}

function MouseTracker({ mousePositionRef, mouseVelocityRef, targetPositionRef, targetVelocityRef, isMouseActiveRef, lastMoveTimeRef }) {
  useFrame((_, delta) => {
    const now = Date.now()
    isMouseActiveRef.current = now - lastMoveTimeRef.current < MOUSE_IDLE_TIME
    const smoothing = 1 - Math.pow(0.0001, delta)
    mousePositionRef.current.x += (targetPositionRef.current.x - mousePositionRef.current.x) * smoothing
    mousePositionRef.current.y += (targetPositionRef.current.y - mousePositionRef.current.y) * smoothing

    const velocitySmoothing = 1 - Math.pow(0.001, delta)
    mouseVelocityRef.current.x += (targetVelocityRef.current.x - mouseVelocityRef.current.x) * velocitySmoothing
    mouseVelocityRef.current.y += (targetVelocityRef.current.y - mouseVelocityRef.current.y) * velocitySmoothing
    mouseVelocityRef.current.x *= Math.pow(0.95, delta * 60)
    mouseVelocityRef.current.y *= Math.pow(0.95, delta * 60)
  })

  return null
}

export default function CoffeeBeanCursor() {
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const mouseVelocityRef = useRef({ x: 0, y: 0 })
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const targetVelocityRef = useRef({ x: 0, y: 0 })
  const lastMouseRef = useRef({ x: 0, y: 0, time: Date.now() })
  const isMouseActiveRef = useRef(false)
  const lastMoveTimeRef = useRef(0)

  const handleMouseMove = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    const now = Date.now()
    const dt = Math.max(now - lastMouseRef.current.time, 1) / 1000
    targetVelocityRef.current.x = ((x - lastMouseRef.current.x) / dt) * 0.08
    targetVelocityRef.current.y = ((y - lastMouseRef.current.y) / dt) * 0.08
    targetPositionRef.current.x = x
    targetPositionRef.current.y = y
    lastMouseRef.current = { x, y, time: now }
    lastMoveTimeRef.current = now
  }, [])

  return (
    <div className="relative h-screen w-full bg-linear-to-b from-black to-[#110904]" onMouseMove={handleMouseMove}>
      <p className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center text-[8vw] font-bold text-[#3D1C0C]">
        COFFEE BEANS
      </p>
      <Canvas camera={{ position: [0, 0, 4.8] }} className="h-full w-full">
        <MouseTracker
          mousePositionRef={mousePositionRef}
          mouseVelocityRef={mouseVelocityRef}
          targetPositionRef={targetPositionRef}
          targetVelocityRef={targetVelocityRef}
          isMouseActiveRef={isMouseActiveRef}
          lastMoveTimeRef={lastMoveTimeRef}
        />
        <CoffeeBeans count={BEAN_COUNT} mousePositionRef={mousePositionRef} mouseVelocityRef={mouseVelocityRef} isMouseActiveRef={isMouseActiveRef} />
        <ambientLight intensity={0.4} color="#ffeedd" />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fff5e6" />
        <directionalLight position={[-4, 2, 3]} intensity={0.4} color="#e6d5c3" />
        <directionalLight position={[0, -3, -5]} intensity={0.6} color="#d4a574" />
        <MouseLight mousePositionRef={mousePositionRef} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/assets/models/coffebean.glb')
