'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ReactLenis } from 'lenis/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

import {
  ImageDistortionFragment,
  ImageDistortionVertex,
} from './imageDistortion'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_SECTIONS = [
  { text: 'SHADOW', src: '/assets/img/image01.webp' },
  { text: 'FLOWER', src: '/assets/img/image02.webp' },
  { text: 'RUN!!', src: '/assets/img/image03.webp' },
]

const DEFAULT_SHADER_CONFIG = {
  strength: 0.8,
  rgbShift: 0.05,
  scale: 0.15,
  transitionDuration: 1.5,
  transitionEase: 'power3.inOut',
}

const MAX_PIXEL_RATIO = 2
const LENIS_OPTIONS = { autoRaf: true, duration: 2 }

export default function ScrollBasedImageDistortion({
  sections = DEFAULT_SECTIONS,
  shaderConfig = {},
  displacementSrc = '/assets/img/distortion.jpg',
}) {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const imageRefs = useRef([])

  useEffect(() => {
    const containerElement = containerRef.current
    const wrapperElement = wrapperRef.current

    if (!containerElement || !wrapperElement || sections.length === 0) {
      return undefined
    }

    const config = { ...DEFAULT_SHADER_CONFIG, ...shaderConfig }

    // Renderer and scene
    const { clientWidth, clientHeight } = containerElement
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    const camera = new THREE.OrthographicCamera(
      -clientWidth / 2,
      clientWidth / 2,
      clientHeight / 2,
      -clientHeight / 2,
      -1,
      1
    )
    const geometry = new THREE.PlaneGeometry(clientWidth, clientHeight)

    let animationFrameId = 0
    let currentIndex = 0
    let targetIndex = 0
    let isTransitioning = false

    const textures = imageRefs.current
      .slice(0, sections.length)
      .filter(Boolean)
      .map(createTextureFromImage)

    const displacementImage = imageRefs.current[sections.length]

    if (textures.length === 0 || !displacementImage) {
      geometry.dispose()
      renderer.dispose()
      return undefined
    }

    const displacementTexture = createTextureFromImage(displacementImage)

    renderer.setSize(clientWidth, clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO))

    containerElement.replaceChildren(renderer.domElement)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_texture0: { value: textures[0] },
        u_texture1: { value: textures[0] },
        u_displacement: { value: displacementTexture },
        u_progress: { value: 0 },
        u_resolution: { value: new THREE.Vector2(clientWidth, clientHeight) },
        u_textureResolution0: { value: new THREE.Vector2(1, 1) },
        u_textureResolution1: { value: new THREE.Vector2(1, 1) },
        u_strength: { value: config.strength },
        u_rgbShift: { value: config.rgbShift },
        u_scale: { value: config.scale },
      },
      vertexShader: ImageDistortionVertex,
      fragmentShader: ImageDistortionFragment,
      transparent: true,
    })

    const setTextureResolution = (uniformIndex, texture) => {
      if (!texture?.image) {
        return
      }

      material.uniforms[`u_textureResolution${uniformIndex}`].value.set(
        texture.image.width,
        texture.image.height
      )
    }

    setTextureResolution(0, textures[0])
    setTextureResolution(1, textures[0])

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Transition state
    const transitionTo = (nextIndex) => {
      if (nextIndex < 0 || nextIndex >= textures.length) {
        return
      }

      if (nextIndex === currentIndex || isTransitioning) {
        targetIndex = nextIndex
        return
      }

      targetIndex = nextIndex
      isTransitioning = true

      material.uniforms.u_texture1.value = textures[nextIndex]
      setTextureResolution(1, textures[nextIndex])

      gsap.to(material.uniforms.u_progress, {
        value: 1,
        duration: config.transitionDuration,
        ease: config.transitionEase,
        onComplete: () => {
          material.uniforms.u_texture0.value = textures[nextIndex]
          setTextureResolution(0, textures[nextIndex])
          material.uniforms.u_progress.value = 0
          currentIndex = nextIndex
          isTransitioning = false

          if (targetIndex !== currentIndex) {
            transitionTo(targetIndex)
          }
        },
      })
    }

    // Scroll progress
    const scrollTrigger = ScrollTrigger.create({
      trigger: wrapperElement,
      start: 'top top',
      end: `+=${(sections.length - 1) * 100}%`,
      scrub: true,
      onUpdate: (scrollState) => {
        const nextIndex = Math.round(scrollState.progress * (sections.length - 1))
        transitionTo(nextIndex)
      },
    })

    // Animation loop
    const renderScene = () => {
      renderer.render(scene, camera)
      animationFrameId = window.requestAnimationFrame(renderScene)
    }

    renderScene()

    // Cleanup
    return () => {
      window.cancelAnimationFrame(animationFrameId)
      scrollTrigger.kill()
      gsap.killTweensOf(material.uniforms.u_progress)

      scene.remove(mesh)
      geometry.dispose()
      material.dispose()
      displacementTexture.dispose()
      textures.forEach((texture) => texture.dispose())
      renderer.dispose()
      containerElement.replaceChildren()
    }
  }, [displacementSrc, sections, shaderConfig])

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: `${sections.length * 100}vh` }}
      >
        <div className="hidden">
          {/* Three.js textures need raw HTMLImageElement sources here. */}
          {sections.map((section, index) => (
            <div key={section.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={(element) => {
                  imageRefs.current[index] = element
                }}
                src={section.src}
                alt=""
              />
            </div>
          ))}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={(element) => {
              imageRefs.current[sections.length] = element
            }}
            src={displacementSrc}
            alt=""
          />
        </div>

        <div
          ref={containerRef}
          className="sticky top-0 h-screen w-full bg-black"
        />

        <div className="pointer-events-none absolute inset-0 z-10">
          {sections.map((section) => (
            <div
              key={section.src}
              className="flex h-screen items-center justify-center"
            >
              <h1 className="text-[10vw] text-white">{section.text}</h1>
            </div>
          ))}
        </div>
      </div>
    </ReactLenis>
  )
}

function createTextureFromImage(imageElement) {
  const texture = new THREE.Texture(imageElement)

  texture.needsUpdate = true
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.minFilter = THREE.LinearFilter

  return texture
}
