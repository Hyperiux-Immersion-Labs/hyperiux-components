'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis } from 'lenis/react'

gsap.registerPlugin(ScrollTrigger)

const ImageDistortionVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const ImageDistortionFragment = `
  uniform sampler2D u_texture0;
  uniform sampler2D u_texture1;
  uniform sampler2D u_displacement;
  uniform float u_progress;
  uniform float u_strength;
  uniform float u_rgbShift;
  uniform float u_scale;
  uniform vec2 u_resolution;
  uniform vec2 u_textureResolution0;
  uniform vec2 u_textureResolution1;

  varying vec2 vUv;

  vec2 coverUV(vec2 uv, vec2 planeRes, vec2 texRes) {
    float scale = max(planeRes.x / texRes.x, planeRes.y / texRes.y);
    vec2 newSize = texRes * scale;
    return uv * (planeRes / newSize) + (newSize - planeRes) / 2.0 / newSize;
  }

  void main() {
    float disp = texture2D(u_displacement, vUv).r;
    disp = mix(disp, disp * (sin(vUv.y * 10.0 + u_progress * 6.28) * 0.5 + 0.5), 0.3);

    vec2 uv0 = coverUV(vUv, u_resolution, u_textureResolution0);
    vec2 uv1 = coverUV(vUv, u_resolution, u_textureResolution1);

    float scaleEffect = 1.0 + u_progress * (1.0 - u_progress) * u_scale;
    vec2 center = vec2(0.5);

    vec2 distortedUV0 = (uv0 - center) / scaleEffect + center + u_progress * disp * u_strength * vec2(1.0, 0.5);
    vec2 distortedUV1 = (uv1 - center) * scaleEffect + center - (1.0 - u_progress) * disp * u_strength * vec2(1.0, 0.5);

    float rgbOffset = u_progress * (1.0 - u_progress) * u_rgbShift;

    vec4 tex0 = vec4(
      texture2D(u_texture0, distortedUV0 + vec2(rgbOffset, 0.0)).r,
      texture2D(u_texture0, distortedUV0).g,
      texture2D(u_texture0, distortedUV0 - vec2(rgbOffset, 0.0)).b,
      texture2D(u_texture0, distortedUV0).a
    );

    vec4 tex1 = vec4(
      texture2D(u_texture1, distortedUV1 + vec2(rgbOffset, 0.0)).r,
      texture2D(u_texture1, distortedUV1).g,
      texture2D(u_texture1, distortedUV1 - vec2(rgbOffset, 0.0)).b,
      texture2D(u_texture1, distortedUV1).a
    );

    gl_FragColor = mix(tex0, tex1, smoothstep(0.0, 1.0, u_progress));
  }
`

const defaultSections = [
  { text: 'SHADOW', src: '/assets/img/image01.webp' },
  { text: 'FLOWER', src: '/assets/img/image02.webp' },
  { text: 'RUN!!', src: '/assets/img/image03.webp' },
]

const defaultShaderConfig = {
  strength: 0.8,
  rgbShift: 0.05,
  scale: 0.15,
  transitionDuration: 1.5,
  transitionEase: 'power3.inOut',
}

export default function ScrollDistortion({
  sections = defaultSections,
  shaderConfig = {},
  displacementSrc = '/assets/img/distortion.jpg',
}) {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const imageRefs = useRef([])
  const texturesRef = useRef([])
  const hasInit = useRef(false)

  const config = { ...defaultShaderConfig, ...shaderConfig }

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current || hasInit.current) return
    hasInit.current = true

    let renderer
    let scene
    let camera
    let mesh
    let animationFrameId = 0
    let currentIndex = 0
    let targetIndex = 0
    let isTransitioning = false

    const init = () => {
      const { clientWidth: width, clientHeight: height } = containerRef.current

      texturesRef.current = imageRefs.current.slice(0, sections.length).map((image) => {
        const texture = new THREE.Texture(image)
        texture.needsUpdate = true
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.minFilter = THREE.LinearFilter
        return texture
      })

      const displacement = new THREE.Texture(imageRefs.current[sections.length])
      displacement.needsUpdate = true

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(renderer.domElement)

      scene = new THREE.Scene()
      camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -1, 1)

      const geometry = new THREE.PlaneGeometry(width, height)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          u_texture0: { value: texturesRef.current[0] },
          u_texture1: { value: texturesRef.current[0] },
          u_displacement: { value: displacement },
          u_progress: { value: 0 },
          u_resolution: { value: new THREE.Vector2(width, height) },
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

      const setResolution = (index, texture) => {
        if (!texture?.image) return
        material.uniforms[`u_textureResolution${index}`].value.set(
          texture.image.width,
          texture.image.height
        )
      }

      setResolution(0, texturesRef.current[0])
      setResolution(1, texturesRef.current[0])

      mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      const transitionTo = (index) => {
        if (
          index < 0 ||
          index >= texturesRef.current.length ||
          index === currentIndex ||
          isTransitioning
        ) {
          targetIndex = index
          return
        }

        targetIndex = index
        isTransitioning = true
        material.uniforms.u_texture1.value = texturesRef.current[index]
        setResolution(1, texturesRef.current[index])

        gsap.to(material.uniforms.u_progress, {
          value: 1,
          duration: config.transitionDuration,
          ease: config.transitionEase,
          onComplete: () => {
            material.uniforms.u_texture0.value = texturesRef.current[index]
            setResolution(0, texturesRef.current[index])
            material.uniforms.u_progress.value = 0
            currentIndex = index
            isTransitioning = false

            if (targetIndex !== currentIndex) transitionTo(targetIndex)
          },
        })
      }

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: `+=${(sections.length - 1) * 100}%`,
        scrub: true,
        onUpdate: (self) => {
          const index = Math.round(self.progress * (sections.length - 1))
          transitionTo(index)
        },
      })

      const render = () => {
        renderer.render(scene, camera)
        animationFrameId = requestAnimationFrame(render)
      }

      render()
    }

    init()

    return () => {
      cancelAnimationFrame(animationFrameId)
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === wrapperRef.current) trigger.kill()
      })
      texturesRef.current.forEach((texture) => texture?.dispose?.())
      mesh?.geometry?.dispose?.()
      mesh?.material?.dispose?.()
      renderer?.dispose?.()
      hasInit.current = false
    }
  }, [config, displacementSrc, sections])

  return (
    <ReactLenis root options={{ autoRaf: true, duration: 2 }}>
      <div ref={wrapperRef} className="relative" style={{ height: `${sections.length * 100}vh` }}>
        <div className="hidden">
          {sections.map((section, index) => (
            <img
              key={index}
              ref={(element) => {
                imageRefs.current[index] = element
              }}
              src={section.src}
              alt=""
            />
          ))}
          <img
            ref={(element) => {
              imageRefs.current[sections.length] = element
            }}
            src={displacementSrc}
            alt=""
          />
        </div>

        <div ref={containerRef} className="sticky top-0 h-screen w-full bg-black" />

        <div className="pointer-events-none absolute inset-0 z-10">
          {sections.map((section, index) => (
            <div key={index} className="flex h-screen items-center justify-center">
              <h1 className="text-[10vw] text-white">{section.text}</h1>
            </div>
          ))}
        </div>
      </div>
    </ReactLenis>
  )
}
