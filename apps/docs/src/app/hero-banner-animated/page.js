'use client'

import React, { useRef, useEffect, useCallback, useState } from'react'
import { Canvas, useThree, useFrame } from'@react-three/fiber'
import { Environment, Center } from'@react-three/drei'
import RoomModel from'@/components/HeroBanner/RoomModel'
import { degToRad } from'three/src/math/MathUtils'
import gsap from'gsap'
import CustomGrainNoise from'@/components/HeroBanner/CustomGrainNoise'
import { EffectComposer } from'@react-three/postprocessing'
import VideoUI from'@/components/HeroBanner/VideoUI'
import EdgeBlurEffect from'@/components/Valley/EdgeBlurEffect'
import { Play } from'lucide-react'
import { AnimatePresence, motion } from'framer-motion'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'

// 🌟 CONFIGURATION - tweak these for env intensity levels 🌟
const ENV_INTENSITY_CONFIG = {
  zoomed: 0,
  out: 0.1,
  lightZoomed: 0,
  lightOut: 3
}

// Camera z positions for zoomed / out states per device
const CAMERA_CONFIG = {
  desktop: { zoomedZ: 2.5, outZ: 4.8 },
  mobile:  { zoomedZ: 4.5, outZ: 7.5 }
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

function SceneContent({ isZoomed, setIsZoomed, videoRef, isMobile }) {
  const groupRef = useRef()
  const lightRef = useRef()
  const { camera, scene } = useThree()

  const intensityState = useRef({
    env: ENV_INTENSITY_CONFIG.out,
    light: ENV_INTENSITY_CONFIG.lightOut
  })

  const handleModelClick = useCallback((e) => {
    e?.stopPropagation()
    setIsZoomed(prev => !prev)
  }, [setIsZoomed])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsZoomed(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setIsZoomed])

  useEffect(() => {
    const duration = 1.5
    const ease = 'power3.inOut'
    const cfg = isMobile ? CAMERA_CONFIG.mobile : CAMERA_CONFIG.desktop

    gsap.killTweensOf(camera.position)
    if (groupRef.current) gsap.killTweensOf(groupRef.current.rotation)

    if (isZoomed) {
      gsap.to(camera.position, { x: 0, y: 0.05, z: cfg.zoomedZ, duration, ease })
      gsap.to(groupRef.current.rotation, { x: 0, y: 0, z: 0, duration, ease })
    } else {
      gsap.to(camera.position, { x: 0, y: 0, z: cfg.outZ, duration, ease })
      gsap.to(groupRef.current.rotation, { x: 0, y: 0, z: degToRad(-5), duration, ease })
    }

    gsap.to(intensityState.current, {
      env: isZoomed ? ENV_INTENSITY_CONFIG.zoomed : ENV_INTENSITY_CONFIG.out,
      light: isZoomed ? ENV_INTENSITY_CONFIG.lightZoomed : ENV_INTENSITY_CONFIG.lightOut,
      duration,
      ease,
    })
  }, [isZoomed, camera, isMobile])

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
        files='https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/wooden_studio_08_1k.exr'
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

export default function Page() {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = (e) => setIsMobile(e.matches)
    update(mq)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <>
      <LenisSmoothScroll />

      <section className="w-full h-screen bg-black relative">
        <AnimatePresence>
          {!isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className='absolute py-[5vw] px-[4vw] z-999 pointer-events-none top-0 left-0 text-[#ECE4B4] w-full h-full max-sm:py-[8vw] max-sm:px-[5vw]'
            >
              <div className='flex items-start pt-[5vw] gap-[2vw] max-sm:pt-[10vw] max-sm:gap-[4vw]'>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                  className='text-[20vw] font-semibold leading-1 tracking-tight max-sm:text-[28vw]'
                >
                  HXR
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
                  className='uppercase w-[25vw] -translate-y-[6vw] text-[1vw]  flex items-center justify-center text-left max-sm:w-[45vw] max-sm:text-[2.8vw] max-sm:-translate-y-[8vw]'
                >
                  Hyperiux immersion labs is an independent design agency in india.
                  <span className='w-6 h-3 flex mt-[1.5vw] bg-[#ECE4B4] max-sm:hidden items-center justify-center mr-[3vw] max-sm:mt-[3vw]'>
                    <span className='w-1 h-1 bg-black rounded-full block'></span>
                  </span>
                </motion.p>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className='text-[20vw] font-semibold tracking-tight text-right w-full max-sm:text-[28vw]'
              >
                UI
              </motion.p>

             <motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
  className='absolute flex items-center justify-center gap-2 bottom-[2vw] uppercase text-[1vw] left-1/2 -translate-x-1/2 w-full text-center text-xs max-sm:text-[3vw] max-sm:bottom-[4vw]'
>
  <span className='max-sm:hidden'>
    Explore The Space
  </span>

  <span className='hidden max-sm:block'>
    Open on desktop for the full effect
  </span>

  <Play className='w-4 h-4 max-sm:hidden' fill='#ECE4B4' />
</motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className='flex absolute bottom-[6vw] left-[2vw] items-center gap-[2vw] max-sm:bottom-[10vw] max-sm:left-[3vw]'
              >
                <div className='w-[.3vw] ml-[3vw] space-y-[.2vw] h-[5vw] max-sm:w-[.6vw] max-sm:ml-[4vw] max-sm:h-[9vw] max-sm:space-y-[.5vw]'>
                  <div className='w-full h-[.7vw] bg-[#ECE4B4]/30 max-sm:h-[1.4vw]' />
                  <div className='w-full h-full bg-[#ECE4B4]' />
                  <div className='w-full h-[.7vw] bg-[#ECE4B4]/30 max-sm:h-[1.4vw]' />
                  <div className='w-full h-[.7vw] bg-[#ECE4B4]/30 max-sm:h-[1.4vw]' />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, isMobile ? 7.5 : 4.8], fov: 55 }}
        >
          <Center>
            <SceneContent
              isZoomed={isZoomed}
              setIsZoomed={setIsZoomed}
              videoRef={videoRef}
              isMobile={isMobile}
            />
          </Center>

          <EffectComposer>
            <EdgeBlurEffect blurType="classic" blurStrength={1.5} blurStart={0.4} />
            {/* <EdgeBlurEffect blurType="frosted" blurStrength={.1} blurStart={0.4} /> */}
            <CustomGrainNoise amount={0.01} scale={1.5} opacity={0.9} />
          </EffectComposer>
        </Canvas>

        <VideoUI
          videoRef={videoRef}
          isZoomed={isZoomed}
          setIsZoomed={setIsZoomed}
        />
      </section>
    </>
  )
}