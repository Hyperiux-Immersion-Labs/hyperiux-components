'use client'

import React, { useEffect, useMemo, useRef, useState } from'react'
import { Canvas, createPortal, useFrame, useThree } from'@react-three/fiber'
import { Text, useFBO } from'@react-three/drei'
import * as THREE from'three'
import gsap from'gsap'

// ---- CONFIGURATION ----
const TUNNEL_CONFIG = {
 ringCount: 5,
 countPerRing: 10,
 ringRadius: 2,
 ringStartScale: 0.01,
 ringEndScale: 8,
 ringRotateSpeed: 1.2,
 ringFadeInPhase: 0.1,
 ringFullVisiblePhase: 0.7,
 ringFadeOutPhase: 0.9,
 ringFontSize: 0.5,
 ringLetterSpacing: -0.05,
 textColor:'#ffffff',
 // Tunnel transition/crossfade duration (seconds)
 crossfadeDuration: 2,
 // Canvas fade out duration (ms)
 canvasFadeDuration: 500,
 // Delay before fading out after tunnel effect ends (ms)
 tunnelFadeOutDelay: 5,
 // Loader progression speed (ms between each increment)
 loaderTickInterval: 60,
 // Main background color
 backgroundColor:'#000000'
}

function TunnelRing({ index, loaderValue, tunnelPhase }) {
 const groupRef = useRef()
 const ringContentRef = useRef()
 const direction = index % 2 === 0 ? 1 : -1

 const textMaterial = useMemo(
 () =>
 new THREE.MeshBasicMaterial({
 color: new THREE.Color(TUNNEL_CONFIG.textColor),
 transparent: true,
 opacity: 0,
 depthWrite: false,
 }),
 []
 )

 useEffect(() => {
 return () => textMaterial.dispose()
 }, [textMaterial])

 useFrame((state, delta) => {
 if (!groupRef.current || !ringContentRef.current) return

 const time = state.clock.getElapsedTime()
 const speed = 0.25

 const phase = ((time * speed + index / TUNNEL_CONFIG.ringCount) % 1 + 1) % 1
 // Scale calculation
 const scale =
 Math.pow(phase, 3) * TUNNEL_CONFIG.ringEndScale +
 TUNNEL_CONFIG.ringStartScale

 groupRef.current.scale.set(scale, scale, scale)

 // Opacity calculation by phase
 let opacity = 0
 if (phase < TUNNEL_CONFIG.ringFadeInPhase)
 opacity = phase / TUNNEL_CONFIG.ringFadeInPhase
 else if (phase <= TUNNEL_CONFIG.ringFullVisiblePhase)
 opacity = 1
 else if (phase <= TUNNEL_CONFIG.ringFadeOutPhase)
 opacity = 1 - (phase - TUNNEL_CONFIG.ringFullVisiblePhase) / (TUNNEL_CONFIG.ringFadeOutPhase - TUNNEL_CONFIG.ringFullVisiblePhase)
 else opacity = 0

 // Fade out rings as tunnelPhase progresses
 textMaterial.opacity = opacity * (1 - tunnelPhase)

 ringContentRef.current.rotation.z += delta * TUNNEL_CONFIG.ringRotateSpeed * direction
 })

 return (
 <group ref={groupRef} position={[0, 0, -index * 0.01]}>
 <group ref={ringContentRef}>
 {Array.from({ length: TUNNEL_CONFIG.countPerRing }).map((_, i) => {
 const angle = (i / TUNNEL_CONFIG.countPerRing) * Math.PI * 2
 const x = Math.cos(angle) * TUNNEL_CONFIG.ringRadius
 const y = Math.sin(angle) * TUNNEL_CONFIG.ringRadius

 return (
 <Text
 key={i}
 position={[x, y, 0]}
 rotation={[0, 0, angle - Math.PI / 2]}
 fontSize={TUNNEL_CONFIG.ringFontSize}
 anchorX="center"
 anchorY="middle"
 letterSpacing={TUNNEL_CONFIG.ringLetterSpacing}
 material={textMaterial}
 >
 {loaderValue.toString().padStart(2,'0')}
 </Text>
 )
 })}
 </group>
 </group>
 )
}

function TunnelScene({ loaderValue, tunnelPhase }) {
 return (
 <>
 <color attach="background" args={[TUNNEL_CONFIG.backgroundColor]} />
 {Array.from({ length: TUNNEL_CONFIG.ringCount }).map((_, i) => (
 <TunnelRing key={i} index={i} loaderValue={loaderValue} tunnelPhase={tunnelPhase} />
 ))}
 </>
 )
}

function WholeSceneEffect({ children, active, tunnelPhase }) {
 const { gl, camera, size, viewport } = useThree()
 const portalScene = useMemo(() => new THREE.Scene(), [])
 const fbo = useFBO(size.width, size.height, { samples: 0, depth: false })

 // Pass tunnelPhase as a uniform for smooth shader transition
 const material = useMemo(() => {
 return new THREE.ShaderMaterial({
 depthTest: false,
 depthWrite: false,
 transparent: true,
 uniforms: {
 tDiffuse: { value: fbo.texture },
 uTime: { value: 0 },
 uStrength: { value: 10.5 },
 uResolution: { value: new THREE.Vector2(size.width, size.height) },
 uTunnelPhase: { value: 0 },
 },
 vertexShader: /* glsl */ `
 varying vec2 vUv;
 varying float vDeform;
 uniform float uTime;
 uniform float uStrength;
 uniform float uTunnelPhase;
 void main() {
 vUv = uv;
 vec3 pos = position;

 float isLeft = step(0.0, -pos.x);
 float deform = isLeft * (1.0 - (pos.x + 0.5) * 2.0);

 deform *= sin(uTime * 2.4 + pos.y * 7.0 + pos.x * 5.2) * 0.23 * uStrength;
 pos.x += deform * 0.28 * uTunnelPhase;
 pos.z += isLeft * sin(uTime * 1.7 + pos.x * 10.0) * 0.15 * uStrength * uTunnelPhase;

 vDeform = deform * uTunnelPhase;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
 }
 `,
 fragmentShader: /* glsl */ `
 varying vec2 vUv;
 varying float vDeform;
 uniform sampler2D tDiffuse;
 uniform float uTunnelPhase;
 uniform float uTime;
 void main() {
 float aberrationAmount = vDeform * 0.04;
 vec2 offset = vec2(aberrationAmount, 0.0);

 vec4 cr = texture2D(tDiffuse, vUv + offset);
 vec4 cg = texture2D(tDiffuse, vUv);
 vec4 cb = texture2D(tDiffuse, vUv - offset);

 float alpha = max(cr.a, max(cg.a, cb.a));
 vec4 baseColor = vec4(cr.r, cg.g, cb.b, alpha);

 vec3 shiftColor = vec3(
 0.5 + 0.5 * sin(uTime * 3.0 + vUv.y * 10.0),
 0.5 + 0.5 * sin(uTime * 2.0 + vUv.x * 10.0 + 2.0),
 0.5 + 0.5 * sin(uTime * 4.0 + vUv.y * 5.0 + 4.0)
 );

 float shiftIntensity = abs(vDeform) * .2;

 vec3 finalColor = mix(
 baseColor.rgb,
 baseColor.rgb * shiftColor * 2.5 + shiftColor * alpha * 0.3,
 clamp(shiftIntensity, 0.0, 1.0)
 );

 gl_FragColor = vec4(finalColor, alpha * uTunnelPhase);
 }
 `,
 })
 }, [fbo.texture, size.width, size.height])

 useEffect(() => {
 material.uniforms.uResolution.value.set(size.width, size.height)
 }, [material, size.width, size.height])

 useEffect(() => {
 return () => material.dispose()
 }, [material])

 useFrame((state, delta) => {
 // always render tunnel pass, then crossfade
 gl.setRenderTarget(fbo)
 gl.clear(true, true, true)
 gl.render(portalScene, camera)
 gl.setRenderTarget(null)

 material.uniforms.uTime.value = state.clock.getElapsedTime()
 material.uniforms.uTunnelPhase.value = tunnelPhase
 // Strength ramps with phase for extra pop; smooth easing
 material.uniforms.uStrength.value = THREE.MathUtils.lerp(
 5.5,
 1,
 tunnelPhase
 )
 })

 return (
 <>
 {createPortal(children, portalScene)}
 <group>{children}</group>
 <mesh
 scale={[viewport.width, viewport.height, 1]}
 position={[0, 0, 0]}
 renderOrder={10}
 >
 <planeGeometry args={[1, 1, 48, 48]} />
 <primitive object={material} attach="material" />
 </mesh>
 </>
 )
}

function NumericTunnelCanvas({ loaderValue }) {
 const [effectActive, setEffectActive] = useState(false)
 // Remove useState for canvasOpacity, use a ref instead
 const canvasRef = useRef(null)
 const didScheduleRef = useRef(false)
 const [tunnelPhase, setTunnelPhase] = useState(0)

 // TunnelPhase interpolation (0 = only tunnel, 1 = only shader)
 useEffect(() => {
 let anim
 if (loaderValue >= 100 && !didScheduleRef.current) {
 didScheduleRef.current = true
 setEffectActive(true)
 let t = 0
 const duration = TUNNEL_CONFIG.crossfadeDuration
 const step = () => {
 t += 1 / 60
 setTunnelPhase(Math.min(t / duration, 1))
 if (t < duration) {
 anim = requestAnimationFrame(step)
 } else {
 setTimeout(() => {
 // Animate opacity to 0 using GSAP; remove setCanvasOpacity, use ref
 if (canvasRef.current) {
 gsap.to(canvasRef.current, {
 opacity: 0,
 duration: TUNNEL_CONFIG.canvasFadeDuration / 1000,
 ease:"power3.inOut"
 })
 }
 }, TUNNEL_CONFIG.tunnelFadeOutDelay)
 }
 }
 requestAnimationFrame(step)
 }
 return () => cancelAnimationFrame(anim)
 }, [loaderValue])

 // useEffect(() => {
 // // Reset canvas opacity to 1 if loader resets
 // if (loaderValue < 100 && canvasRef.current) {
 // gsap.set(canvasRef.current, { opacity: 1 })
 // }
 // }, [loaderValue])

 return (
 <div
 ref={canvasRef}
 className="h-full w-full"
 >
 <Canvas
 dpr={1}
 orthographic
 camera={{ zoom: 100, position: [0, 0, 10] }}
 gl={{ powerPreference:'high-performance' }}
 >
 <color attach="background" args={[TUNNEL_CONFIG.backgroundColor]} />
 <WholeSceneEffect active={effectActive} tunnelPhase={tunnelPhase}>
 <TunnelScene loaderValue={loaderValue} tunnelPhase={tunnelPhase} />
 </WholeSceneEffect>
 </Canvas>
 </div>
 )
}

export default function NumericTunnel() {
 const [loaderValue, setLoaderValue] = useState(0)

 useEffect(() => {
 const interval = setInterval(() => {
 setLoaderValue((prev) => (prev >= 100 ? 100 : prev + 1))
 }, TUNNEL_CONFIG.loaderTickInterval)
 return () => clearInterval(interval)
 }, [])

 return (
 <div className="h-screen w-full bg-zinc-900">
 <NumericTunnelCanvas loaderValue={loaderValue} />
 </div>
 )
}