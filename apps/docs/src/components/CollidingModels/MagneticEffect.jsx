'use client'
import * as THREE from 'three'
import { useRef, useReducer, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  useGLTF,
  MeshTransmissionMaterial,
  Environment,
  Lightformer,
} from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO, Bloom } from '@react-three/postprocessing'
import { easing } from 'maath'
import { Text } from '@react-three/drei'

const accents = ['#4060ff', '#20ffa0', '#ff4060', '#ffcc00','#ff5f00']
const MODEL_SCALE = 0.08
const COLLIDER_SCALE = 0.5
const POINTER_RADIUS = 0.55

const shuffle = (accent = 0) => [
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.75 },
  { color: '#444', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
]

export default function MagnetLogo() {
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
      <Scene />
    </div>
  )
}

function Scene() {
  const [accent, click] = useReducer((state) => ++state % accents.length, 0)
  const connectors = useMemo(() => shuffle(accent), [accent])
  const connectorRefs = useRef([])

  return (
    <Canvas
      onClick={click}
      shadows
      dpr={[1.0, 1.1]}
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      className="h-full w-full"
    >
      <Text
        position={[0, 0, 0]}
        fontSize={1.15}
        color={accents[accent]}
        fontWeight={500}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.000}
      >
        HYPERIUX
      </Text>
      <color attach="background" args={['#141518']} />
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />

      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((props, i) => (
          <Connector key={i} {...props} connectorRefs={connectorRefs} index={i} />
        ))}
        <Connector position={[10, 10, 5]} connectorRefs={connectorRefs} index={connectors.length}>
          <Model>
            <MeshTransmissionMaterial
              clearcoat={1}
              thickness={10}
              anisotropicBlur={0.1}
              chromaticAberration={0.1}
              samples={8}
              resolution={512}
            />
          </Model>
        </Connector>
      </Physics>

      <EffectComposer disableNormalPass multisampling={8}>
       <N8AO />
        {/* <Bloom  /> */}
      </EffectComposer>

      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer
            form="circle"
            intensity={4}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, -1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={8}
          />
        </group>
      </Environment>
      {/* <Environment preset='city' environmentIntensity={1.2} /> */}
    </Canvas>
  )
}

const REPULSION_RADIUS = 1.5
const REPULSION_STRENGTH = 0.012

function Connector({
  position,
  children,
  vec = new THREE.Vector3(),
  repulsion = new THREE.Vector3(),
  r = THREE.MathUtils.randFloatSpread,
  accent,
  connectorRefs,
  index,
  ...props
}) {
  const api = useRef()
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [position, r])

  useMemo(() => {
    connectorRefs.current[index] = api
  }, [index, connectorRefs])

  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    if (!api.current) return

    const myPos = api.current.translation()

    api.current.applyImpulse(
      vec.copy(myPos).negate().multiplyScalar(0.01)
    )

    for (let i = 0; i < connectorRefs.current.length; i++) {
      if (i === index) continue
      const other = connectorRefs.current[i]?.current
      if (!other) continue

      const otherPos = other.translation()
      repulsion.set(
        myPos.x - otherPos.x,
        myPos.y - otherPos.y,
        myPos.z - otherPos.z
      )
      const dist = repulsion.length()

      if (dist < REPULSION_RADIUS && dist > 0.001) {
        const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS
        repulsion.normalize().multiplyScalar(force * REPULSION_STRENGTH)
        api.current.applyImpulse(repulsion)
      }
    }
  })

  return (
    <RigidBody
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      position={pos}
      ref={api}
      colliders={false}
    >
      <CuboidCollider
        args={[
          0.25 * COLLIDER_SCALE,
          1.2 * COLLIDER_SCALE,
          0.25 * COLLIDER_SCALE,
        ]}
        position={[-1.2 * COLLIDER_SCALE, 0, 0]}
      />
      <CuboidCollider
        args={[
          0.25 * COLLIDER_SCALE,
          1.2 * COLLIDER_SCALE,
          0.25 * COLLIDER_SCALE,
        ]}
        position={[0.8 * COLLIDER_SCALE, 0, 0]}
      />
      <CuboidCollider
        args={[
          1.1 * COLLIDER_SCALE,
          0.2 * COLLIDER_SCALE,
          0.25 * COLLIDER_SCALE,
        ]}
        position={[0, 0, 0]}
      />
      {children ? children : <Model {...props} />}
      {accent && (
        <pointLight intensity={4} distance={1.25} color={props.color} />
      )}
    </RigidBody>
  )
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef()

  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      )
    )
  })

  return (
    <RigidBody
      position={[0, 0, 0]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[POINTER_RADIUS]} />
    </RigidBody>
  )
}

function Model({ children, color = 'white', roughness = 0 }) {
  const ref = useRef()
  const { nodes } = useGLTF('/models/hyperiux-logo.glb')
  const { nodes : nodes2 , materials : materials2 } = useGLTF('/models/c-transformed.glb')
  const geometry = nodes.FINAL?.geometry
  console.log(materials2)

  useFrame((state, delta) => {
    if (ref.current?.material?.color) {
      easing.dampC(ref.current.material.color, color, 0.2, delta)
    }
  })

  if (!geometry) return null

  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      scale={[MODEL_SCALE, MODEL_SCALE, MODEL_SCALE * 2.3]}
      geometry={geometry}
    >
      <meshPhysicalMaterial
        metalness={.4}
        roughness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.2}
        material={materials2.base}
        reflectivity={1}
        color={color}
      />

      {children}
    </mesh>
  )
}