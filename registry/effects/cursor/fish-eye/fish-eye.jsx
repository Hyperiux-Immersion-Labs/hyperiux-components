'use client'

import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three/webgpu'
import { texture, uv, uniform, sub, length, mul, add, oneMinus } from 'three/tsl'

const damp = (current, target, lambda, delta) =>
  current + (target - current) * (1 - Math.exp(-lambda * delta))

function ImageNodeMaterial({ src }) {
  const map = useTexture(src)
  const { size, camera } = useThree()

  const height = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.position.z
  const width = height * (size.width / size.height)

  const mouse = useRef(new THREE.Vector2(0.5, 0.5))
  const target = useRef(new THREE.Vector2(0.5, 0.5))
  const strength = useRef(0)
  const strengthTarget = useRef(0)

  const material = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace

    const mat = new THREE.MeshBasicNodeMaterial()
    const mouseU = uniform(mouse.current)
    const strengthU = uniform(0)

    const baseUV = uv()
    const diff = sub(baseUV, mouseU)
    const dist = length(diff)
    const falloff = oneMinus(dist).pow(2)
    const displacement = mul(diff, falloff).mul(strengthU.negate())
    const distortedUV = add(baseUV, displacement)

    mat.colorNode = texture(map, distortedUV)
    mat.userData.mouseU = mouseU
    mat.userData.strengthU = strengthU

    return mat
  }, [map])

  useFrame((_, delta) => {
    mouse.current.x = damp(mouse.current.x, target.current.x, 12, delta)
    mouse.current.y = damp(mouse.current.y, target.current.y, 12, delta)
    strength.current = damp(strength.current, strengthTarget.current, 8, delta)
    material.userData.strengthU.value = strength.current
  })

  return (
    <mesh
      material={material}
      onPointerMove={(e) => {
        if (!e.uv) return
        target.current.copy(e.uv)
        strengthTarget.current = 1
      }}
      onPointerLeave={() => {
        target.current.set(0.5, 0.5)
        strengthTarget.current = 0
      }}
    >
      <planeGeometry args={[width, height]} />
    </mesh>
  )
}

export function FishEyeImage({ src }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ height: '100%', width: '100%' }}
      gl={({ canvas }) => {
        const renderer = new THREE.WebGPURenderer({
          canvas,
          antialias: true,
        })
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.NoToneMapping
        renderer.init()
        return renderer
      }}
    >
      <ImageNodeMaterial src={src} />
    </Canvas>
  )
}
