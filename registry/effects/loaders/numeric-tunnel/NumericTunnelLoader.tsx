'use client'

import React, { useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react'
import { Canvas, createPortal, useFrame, useThree, type RootState } from '@react-three/fiber'
import { Text, useFBO } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

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
 crossfadeDuration: 2,
 canvasFadeDuration: 500,
 tunnelFadeOutDelay: 5,
 loaderTickInterval: 40,
 loaderStartDelay: 1200,
 backgroundColor:'#000000'
}

type PhaseRef = MutableRefObject<number>

interface TunnelConfig {
 ringCount: number
 countPerRing: number
 ringRadius: number
 ringStartScale: number
 ringEndScale: number
 ringRotateSpeed: number
 ringFadeInPhase: number
 ringFullVisiblePhase: number
 ringFadeOutPhase: number
 ringFontSize: number
 ringLetterSpacing: number
 textColor: string
 crossfadeDuration: number
 canvasFadeDuration: number
 tunnelFadeOutDelay: number
 loaderTickInterval: number
 loaderStartDelay: number
 backgroundColor: string
}

interface TunnelConfigOverrides {
 digitCount?: number
 speed?: number
 depth?: number
 textColor?: string
 backgroundColor?: string
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
 const numericValue = Number(value)
 if (!Number.isFinite(numericValue)) return fallback
 return Math.min(max, Math.max(min, numericValue))
}

function createTunnelConfig({
 digitCount = TUNNEL_CONFIG.ringCount * TUNNEL_CONFIG.countPerRing,
 speed = 1,
 depth = 900,
 textColor = TUNNEL_CONFIG.textColor,
 backgroundColor = TUNNEL_CONFIG.backgroundColor,
}: TunnelConfigOverrides = {}): TunnelConfig {
 const safeDigitCount = Math.round(clampNumber(digitCount, 0, 540, TUNNEL_CONFIG.ringCount * TUNNEL_CONFIG.countPerRing))
 const ringCount = safeDigitCount > 0 ? TUNNEL_CONFIG.ringCount : 0
 const countPerRing = ringCount ? Math.max(1, Math.ceil(safeDigitCount / ringCount)) : 0
 const safeSpeed = clampNumber(speed, 0.1, 5, 1)
 const depthScale = clampNumber(depth, 120, 2700, 900) / 900

 return {
 ...TUNNEL_CONFIG,
 countPerRing,
 ringEndScale: TUNNEL_CONFIG.ringEndScale * depthScale,
 ringRotateSpeed: TUNNEL_CONFIG.ringRotateSpeed * safeSpeed,
 loaderTickInterval: TUNNEL_CONFIG.loaderTickInterval / safeSpeed,
 loaderStartDelay: TUNNEL_CONFIG.loaderStartDelay / safeSpeed,
 crossfadeDuration: TUNNEL_CONFIG.crossfadeDuration / safeSpeed,
 tunnelFadeOutDelay: TUNNEL_CONFIG.tunnelFadeOutDelay / safeSpeed,
 textColor,
 backgroundColor,
 }
}

interface TunnelRingProps {
 index: number
 loaderValue: number
 tunnelPhaseRef: PhaseRef
 config: TunnelConfig
}

function TunnelRing({ index, loaderValue, tunnelPhaseRef, config }: TunnelRingProps) {
 const groupRef = useRef<THREE.Group | null>(null)
 const ringContentRef = useRef<THREE.Group | null>(null)
 const textMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null)
 const direction = index % 2 === 0 ? 1 : -1
 const reduceMotionRef = useRef(
 typeof window !== 'undefined' &&
 (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false)
 )

 const textMaterial = useMemo(
 () =>
 new THREE.MeshBasicMaterial({
 color: new THREE.Color(config.textColor),
 transparent: true,
 opacity: 0,
 depthWrite: false,
 }),
 [config.textColor]
 )

 useEffect(() => {
 textMaterialRef.current = textMaterial
 return () => {
 textMaterialRef.current = null
 textMaterial.dispose()
 }
 }, [textMaterial])

 useEffect(() => {
 const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
 if (!mq) return undefined
 const onChange = (event: MediaQueryListEvent) => {
 reduceMotionRef.current = event.matches
 }
 reduceMotionRef.current = mq.matches
 mq.addEventListener?.('change', onChange)
 return () => mq.removeEventListener?.('change', onChange)
 }, [])

 useFrame((state: RootState, delta: number) => {
 if (!groupRef.current || !ringContentRef.current) return
 const material = textMaterialRef.current
 if (!material) return

 const time = state.clock.getElapsedTime()
 const speed = 0.25 * (config.ringRotateSpeed / TUNNEL_CONFIG.ringRotateSpeed)

 // Instead of adding index mapped offset, subtract it to delay spawn.
 // This makes rings wait their turn to start from the center.
 const rawPhase = time * speed - index / config.ringCount

 if (rawPhase < 0) {
 groupRef.current.scale.set(0.001, 0.001, 0.001)
 material.opacity = 0
 } else {
 const phase = rawPhase % 1

 // Scale calculation
 const scale =
 Math.pow(phase, 3) * config.ringEndScale +
 config.ringStartScale

 groupRef.current.scale.set(scale, scale, scale)

 // Opacity calculation by phase
 let opacity = 0
 if (phase < config.ringFadeInPhase)
 opacity = phase / config.ringFadeInPhase
 else if (phase <= config.ringFullVisiblePhase)
 opacity = 1
 else if (phase <= config.ringFadeOutPhase)
 opacity = 1 - (phase - config.ringFullVisiblePhase) / (config.ringFadeOutPhase - config.ringFullVisiblePhase)
 else opacity = 0

 // Fade out rings as tunnelPhase progresses
 material.opacity = opacity * (1 - tunnelPhaseRef.current)
 }

 // Reduced-motion: keep counter, skip ring rotation.
 if (!reduceMotionRef.current) {
 ringContentRef.current.rotation.z += delta * config.ringRotateSpeed * direction
 }
 })

 return (
 <group ref={groupRef} position={[0, 0, -index * 0.01]}>
 <group ref={ringContentRef}>
 {Array.from({ length: config.countPerRing }).map((_, i) => {
 const angle = (i / config.countPerRing) * Math.PI * 2
 const x = Math.cos(angle) * config.ringRadius
 const y = Math.sin(angle) * config.ringRadius

 return (
 <Text
 key={i}
 position={[x, y, 0]}
 rotation={[0, 0, angle - Math.PI / 2]}
 fontSize={config.ringFontSize}
 anchorX="center"
 anchorY="middle"
 letterSpacing={config.ringLetterSpacing}
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

interface TunnelSceneProps {
 loaderValue: number
 tunnelPhaseRef: PhaseRef
 config: TunnelConfig
}

function TunnelScene({ loaderValue, tunnelPhaseRef, config }: TunnelSceneProps) {
 return (
 <>
 <color attach="background" args={[config.backgroundColor]} />
 {Array.from({ length: config.ringCount }).map((_, i) => (
 <TunnelRing key={i} index={i} loaderValue={loaderValue} tunnelPhaseRef={tunnelPhaseRef} config={config} />
 ))}
 </>
 )
}

interface WholeSceneEffectProps {
 children?: ReactNode
 active: boolean
 tunnelPhaseRef: PhaseRef
}

function WholeSceneEffect({ children, active: _active, tunnelPhaseRef }: WholeSceneEffectProps) {
 const { gl, camera, size, viewport } = useThree()
 const portalScene = useMemo(() => new THREE.Scene(), [])
 const fbo = useFBO(size.width, size.height, { samples: 0, depth: false } as any)
 const materialRef = useRef<THREE.ShaderMaterial | null>(null)
 const reduceMotionRef = useRef(
 typeof window !== 'undefined' &&
 (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false)
 )

 useEffect(() => {
 const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
 if (!mq) return undefined
 const onChange = (event: MediaQueryListEvent) => {
 reduceMotionRef.current = event.matches
 }
 reduceMotionRef.current = mq.matches
 mq.addEventListener?.('change', onChange)
 return () => mq.removeEventListener?.('change', onChange)
 }, [])

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
 materialRef.current = material
 materialRef.current.uniforms.uResolution.value.set(size.width, size.height)
 }, [material, size.width, size.height])

 useEffect(() => {
 return () => {
 materialRef.current = null
 material.dispose()
 }
 }, [material])

 useFrame((state: RootState) => {
 // always render tunnel pass, then crossfade
 gl.setRenderTarget(fbo)
 gl.clear(true, true, true)
 gl.render(portalScene, camera)
 gl.setRenderTarget(null)

 const shaderMaterial = materialRef.current
 if (!shaderMaterial) return

 shaderMaterial.uniforms.uTime.value = state.clock.getElapsedTime()
 shaderMaterial.uniforms.uTunnelPhase.value = tunnelPhaseRef.current
 // Reduced-motion: keep the crossfade, skip the warp/distortion strength ramp.
 shaderMaterial.uniforms.uStrength.value = reduceMotionRef.current
 ? 0
 : THREE.MathUtils.lerp(5.5, 1, tunnelPhaseRef.current)
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

interface NumericTunnelCanvasProps {
 loaderValue: number
 onComplete?: () => void
 config: TunnelConfig
}

function NumericTunnelCanvas({ loaderValue, onComplete, config }: NumericTunnelCanvasProps) {
 const [effectActive, setEffectActive] = useState(false)
 // Remove useState for canvasOpacity, use a ref instead
 const canvasRef = useRef<HTMLDivElement | null>(null)
 const didScheduleRef = useRef(false)
 const tunnelPhaseRef = useRef(0)

 useEffect(() => {
 let anim: number | undefined
 let fadeTimeout: ReturnType<typeof setTimeout> | undefined
 if (loaderValue >= 100 && !didScheduleRef.current) {
 didScheduleRef.current = true
 setEffectActive(true)
 let t = 0
 const duration = config.crossfadeDuration
 const step = () => {
 t += 1 / 60
 tunnelPhaseRef.current = Math.min(t / duration, 1)
 if (t < duration) {
 anim = requestAnimationFrame(step)
 } else {
 fadeTimeout = setTimeout(() => {
 if (onComplete) {
 onComplete()
 return
 }
 // Animate opacity to 0 using GSAP; remove setCanvasOpacity, use ref
 if (canvasRef.current) {
 gsap.to(canvasRef.current, {
 opacity: 0,
 duration: config.canvasFadeDuration / 1000,
 ease:"power3.inOut",
 })
 }
 }, config.tunnelFadeOutDelay)
 }
 }
 requestAnimationFrame(step)
 }
 return () => {
 if (anim !== undefined) cancelAnimationFrame(anim)
 if (fadeTimeout !== undefined) clearTimeout(fadeTimeout)
 }
 }, [loaderValue, onComplete])

 return (
 <div
 ref={canvasRef}
 className="h-full w-full"
 style={{ backgroundColor: config.backgroundColor }}
 >
 <Canvas
 dpr={1}
 orthographic
 camera={{ zoom: 100, position: [0, 0, 10] }}
 gl={{ powerPreference:'high-performance' }}
 >
 <color attach="background" args={[config.backgroundColor]} />
 <WholeSceneEffect active={effectActive} tunnelPhaseRef={tunnelPhaseRef}>
 <TunnelScene loaderValue={loaderValue} tunnelPhaseRef={tunnelPhaseRef} config={config} />
 </WholeSceneEffect>
 </Canvas>
 </div>
 )
}

interface NumericTunnelLoaderProps {
 children?: ReactNode
 onComplete?: () => void
 config?: TunnelConfigOverrides
}

export function NumericTunnelLoader({ children, onComplete, config: configOverrides }: NumericTunnelLoaderProps) {
 const [loaderValue, setLoaderValue] = useState(0)
 const [isComplete, setIsComplete] = useState(false)
 const config = useMemo(() => createTunnelConfig(configOverrides), [configOverrides])

 useEffect(() => {
 let interval: ReturnType<typeof setInterval> | undefined
 const timeout = setTimeout(() => {
 interval = setInterval(() => {
 setLoaderValue((prev) => (prev >= 100 ? 100 : prev + 1))
 }, config.loaderTickInterval)
 }, config.loaderStartDelay)

 return () => {
 clearTimeout(timeout)
 if (interval) clearInterval(interval)
 }
 }, [config.loaderStartDelay, config.loaderTickInterval])

 const handleComplete = () => {
 setIsComplete(true)
 if (onComplete) onComplete()
 }

 return (
 <div className="relative h-screen w-full overflow-hidden">
 {children}
 {!isComplete && (
 <div className="absolute inset-0 z-10">
 <NumericTunnelCanvas loaderValue={loaderValue} onComplete={handleComplete} config={config} />
 </div>
 )}
 </div>
 )
}
