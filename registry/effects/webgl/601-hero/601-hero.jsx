'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, Center } from '@react-three/drei'
import { degToRad } from 'three/src/math/MathUtils'
import gsap from 'gsap'
import { EffectComposer } from '@react-three/postprocessing'
import RoomModel from './room-model'
import CustomGrainNoise from './custom-grain-noise'
import EdgeBlurEffect from './edge-blur-effect'
import VideoUI from './video-ui'

const ENV_INTENSITY_CONFIG = {
  zoomed: 0,
  out: 0.1,
  lightZoomed: 0,
  lightOut: 3,
}

function MovingPointLight({ lightRef }) {
  const { gl } = useThree()
  const targetRef = useRef({ x: 0, y: 0 })

  const handlePointerMove = useCallback((event) => {
    const rect = gl.domElement.getBoundingClientRect()
    targetRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    targetRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }, [gl])

  useEffect(() => {
    const dom = gl.domElement
    dom.addEventListener('mousemove', handlePointerMove)
    return () => dom.removeEventListener('mousemove', handlePointerMove)
  }, [gl, handlePointerMove])

  useFrame(() => {
    const light = lightRef.current
    if (!light) return
    const basePos = { x: 0, y: -1.3, z: -2 }
    const spread = { x: 1.8, y: 0.0, z: 0.08 }
    const tx = basePos.x + targetRef.current.x * spread.x
    const tz = basePos.z + targetRef.current.y * spread.z
    light.position.x += (tx - light.position.x) * 0.1
    light.position.z += (tz - light.position.z) * 0.1
  })

  return (
    <pointLight
      ref={lightRef}
      castShadow
      position={[0, -1.3, -2]}
      distance={100}
      decay={0.7}
      color="#fff"
    />
  )
}

function SceneContent({ isZoomed, setIsZoomed, videoRef }) {
  const groupRef = useRef()
  const lightRef = useRef()
  const { camera, scene } = useThree()

  const intensityState = useRef({
    env: ENV_INTENSITY_CONFIG.out,
    light: ENV_INTENSITY_CONFIG.lightOut,
  })

  const handleModelClick = useCallback((e) => {
    e?.stopPropagation()
    setIsZoomed(prev => !prev)
  }, [setIsZoomed])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsZoomed(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setIsZoomed])

  useEffect(() => {
    const duration = 1.5
    const ease = 'power3.inOut'

    gsap.killTweensOf(camera.position)
    if (groupRef.current) gsap.killTweensOf(groupRef.current.rotation)

    if (isZoomed) {
      gsap.to(camera.position, { x: 0, y: 0.05, z: 2.5, duration, ease })
      gsap.to(groupRef.current.rotation, { x: 0, y: 0, z: 0, duration, ease })
    } else {
      gsap.to(camera.position, { x: 0, y: 0, z: 4.8, duration, ease })
      gsap.to(groupRef.current.rotation, { x: 0, y: 0, z: degToRad(-5), duration, ease })
    }

    gsap.to(intensityState.current, {
      env: isZoomed ? ENV_INTENSITY_CONFIG.zoomed : ENV_INTENSITY_CONFIG.out,
      light: isZoomed ? ENV_INTENSITY_CONFIG.lightZoomed : ENV_INTENSITY_CONFIG.lightOut,
      duration,
      ease,
    })
  }, [isZoomed, camera])

  useFrame(() => {
    scene.environmentIntensity = intensityState.current.env
    if (lightRef.current) {
      lightRef.current.intensity = intensityState.current.light
    }
  })

  return (
    <>
      <MovingPointLight lightRef={lightRef} />
      <Environment
        background={false}
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/wooden_studio_08_1k.exr"
        environmentRotation={[0, degToRad(40), 0]}
      />
      <group ref={groupRef} rotation={[0, 0, degToRad(-5)]}>
        <RoomModel
          onClick={handleModelClick}
          isZoomed={isZoomed}
          videoRef={videoRef}
        />
      </group>
    </>
  )
}

export function Hero601() {
  const [isZoomed, setIsZoomed] = useState(false)
  const videoRef = useRef(null)

  return (
    <section className="w-full h-screen bg-black">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4.8], fov: 55 }}>
        <Center>
          <SceneContent
            isZoomed={isZoomed}
            setIsZoomed={setIsZoomed}
            videoRef={videoRef}
          />
        </Center>
        <EffectComposer>
          <EdgeBlurEffect blurType="classic" blurStrength={1.5} blurStart={0.4} />
          <CustomGrainNoise amount={0.01} scale={1.5} opacity={0.9} />
        </EffectComposer>
      </Canvas>
      <VideoUI
        videoRef={videoRef}
        isZoomed={isZoomed}
        setIsZoomed={setIsZoomed}
      />
    </section>
  )
}
