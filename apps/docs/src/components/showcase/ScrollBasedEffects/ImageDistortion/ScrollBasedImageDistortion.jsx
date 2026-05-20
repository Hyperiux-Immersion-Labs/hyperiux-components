'use client'

import { useEffect, useRef } from'react'
import * as THREE from'three'
import gsap from'gsap'
import { ScrollTrigger } from'gsap/ScrollTrigger'
import { ImageDistortionVertex, ImageDistortionFragment } from'./imageDistortion'
import { ReactLenis } from'lenis/react'

gsap.registerPlugin(ScrollTrigger)

const defaultSections = [
 { text:'SHADOW', src:'/assets/img/image01.webp' },
 { text:'FLOWER', src:'/assets/img/image02.webp' },
 { text:'RUN!!', src:'/assets/img/image03.webp' },
]

const defaultShaderConfig = {
 strength: 0.8,
 rgbShift: 0.05,
 scale: 0.15,
 transitionDuration: 1.5,
 transitionEase:'power3.inOut',
}

export default function ScrollDistortion({
 sections = defaultSections,
 shaderConfig = {},
 displacementSrc ='/assets/img/distortion.jpg',
}) {
 const containerRef = useRef(null)
 const wrapperRef = useRef(null)

 const imageRefs = useRef([])
 const texturesRef = useRef([])

 const hasInit = useRef(false)

 const config = { ...defaultShaderConfig, ...shaderConfig }

 useEffect(() => {
 if (!containerRef.current || !wrapperRef.current) return
 if (hasInit.current) return
 hasInit.current = true

 let renderer, scene, camera, mesh
 let currentIndex = 0
 let targetIndex = 0
 let isTransitioning = false

 const init = () => {
 const { clientWidth: w, clientHeight: h } = containerRef.current

 // ✅ IMAGE → TEXTURE (core improvement)
 texturesRef.current = imageRefs.current.map((img) => {
 const texture = new THREE.Texture(img)
 texture.needsUpdate = true
 texture.wrapS = THREE.RepeatWrapping
 texture.wrapT = THREE.RepeatWrapping
 texture.minFilter = THREE.LinearFilter
 return texture
 })

 const displacement = new THREE.Texture(
 imageRefs.current[sections.length] // last img = displacement
 )
 displacement.needsUpdate = true

 renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
 renderer.setSize(w, h)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

 containerRef.current.innerHTML =''
 containerRef.current.appendChild(renderer.domElement)

 scene = new THREE.Scene()

 camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, -1, 1)

 const geometry = new THREE.PlaneGeometry(w, h)

 const material = new THREE.ShaderMaterial({
 uniforms: {
 u_texture0: { value: texturesRef.current[0] },
 u_texture1: { value: texturesRef.current[0] },
 u_displacement: { value: displacement },
 u_progress: { value: 0 },
 u_resolution: { value: new THREE.Vector2(w, h) },
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

 // ✅ set texture resolutions (same as your logic)
 const setRes = (index, texture) => {
 if (texture?.image) {
 material.uniforms[`u_textureResolution${index}`].value.set(
 texture.image.width,
 texture.image.height
 )
 }
 }

 setRes(0, texturesRef.current[0])
 setRes(1, texturesRef.current[0])

 mesh = new THREE.Mesh(geometry, material)
 scene.add(mesh)

 // ✅ same transition logic
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
 setRes(1, texturesRef.current[index])

 gsap.to(material.uniforms.u_progress, {
 value: 1,
 duration: config.transitionDuration,
 ease: config.transitionEase,
 onComplete: () => {
 material.uniforms.u_texture0.value = texturesRef.current[index]
 setRes(0, texturesRef.current[index])
 material.uniforms.u_progress.value = 0
 currentIndex = index
 isTransitioning = false

 if (targetIndex !== currentIndex) {
 transitionTo(targetIndex)
 }
 },
 })
 }

 ScrollTrigger.create({
 trigger: wrapperRef.current,
 start:'top top',
 end: `+=${(sections.length - 1) * 100}%`,
 scrub: true,
 onUpdate: (self) => {
 const index = Math.round(self.progress * (sections.length - 1))
 transitionTo(index)
 },
 })

 const render = () => {
 renderer.render(scene, camera)
 requestAnimationFrame(render)
 }

 render()
 }

 init()
 }, [sections, config])

 return (
 <ReactLenis root options={{ autoRaf: true, duration: 2 }}>
 <div ref={wrapperRef} className="relative" style={{ height: `${sections.length * 100}vh` }}>

 {/* ✅ Images (source of truth) */}
 <div className="hidden">
 {sections.map((s, i) => (
 <img
 key={i}
 ref={(el) => (imageRefs.current[i] = el)}
 src={s.src}
 alt=""
 />
 ))}

 {/* displacement image */}
 <img
 ref={(el) => (imageRefs.current[sections.length] = el)}
 src={displacementSrc}
 alt=""
 />
 </div>

 {/* WebGL */}
 <div
 ref={containerRef}
 className="sticky top-0 h-screen w-full bg-black"
 />

 {/* Overlay text */}
 <div className="absolute inset-0 z-10 pointer-events-none">
 {sections.map((s, i) => (
 <div key={i} className="h-screen flex items-center justify-center">
 <h1 className="text-[10vw] text-white">{s.text}</h1>
 </div>
 ))}
 </div>
 </div>
 </ReactLenis>
 )
}