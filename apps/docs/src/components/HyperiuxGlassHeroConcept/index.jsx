"use client";

import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import CopperHeroModel from "./CopperHeroModel";
import GlassHeroModel from "./GlassHeroModel";

/* -------------------------------------------------------------------------- */
/*                              VIDEO BACKGROUND                              */
/* -------------------------------------------------------------------------- */

function VideoBackgroundPlane({
  src = "/assets/models/bg-video.mp4",
  position = [0, 0, 0],
  scale = [1, 1, 1],
  opacity = 1,
}) {
  const video = useMemo(() => {
    if (typeof window === "undefined") return null;

    const el = document.createElement("video");
    el.src = src;
    el.crossOrigin = "anonymous";
    el.loop = true;
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.autoplay = true;
    el.preload = "auto";
    el.setAttribute("playsinline", "true");
    el.setAttribute("webkit-playsinline", "true");

    return el;
  }, [src]);

  const texture = useMemo(() => {
    if (!video) return null;

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;

    return tex;
  }, [video]);

  useEffect(() => {
    if (!video) return;

    video.load();
    video.play().catch(() => {});

    return () => {
      video.pause();
    };
  }, [video]);

  if (!texture) return null;

  return (
    <mesh position={position} scale={scale} frustumCulled={false}>
      <planeGeometry args={[5.7, 3.5, 1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        toneMapped={false}
        depthWrite={false}
        depthTest={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ORANGE GRADIENT                               */
/* -------------------------------------------------------------------------- */

function OrangeSemiCircleGradientShader({
  color1 = "#050505",
  color2 = "#42170d",
  color3 = "#b74716",
  color4 = "#ff8a3d",
  intensity = 1.15,
  darkStrength = 1.15,
  gradientCenter = [0.5, -0.18],
  radius = 1.05,
  softness = 0.92,
  horizontalMove = 0.4,
  verticalMove = 0.15,
  speed = 0.22,
  cursorStrengthX = 0.14,
  cursorStrengthY = 0.05,
  cursorLerp = 0.045,
}) {
  const materialRef = useRef(null);
  const cursorOffsetRef = useRef(new THREE.Vector2(0, 0));
  const targetCursorRef = useRef(new THREE.Vector2(0, 0));
  const { pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uColor3: { value: new THREE.Color(color3) },
      uColor4: { value: new THREE.Color(color4) },
      uIntensity: { value: intensity },
      uDarkStrength: { value: darkStrength },
      uGradientCenter: {
        value: new THREE.Vector2(gradientCenter[0], gradientCenter[1]),
      },
      uCursorOffset: { value: new THREE.Vector2(0, 0) },
      uRadius: { value: radius },
      uSoftness: { value: softness },
      uHorizontalMove: { value: horizontalMove },
      uVerticalMove: { value: verticalMove },
      uSpeed: { value: speed },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;

    const u = materialRef.current.uniforms;

    targetCursorRef.current.set(
      pointer.x * cursorStrengthX,
      pointer.y * cursorStrengthY
    );

    cursorOffsetRef.current.lerp(targetCursorRef.current, cursorLerp);

    u.uTime.value = state.clock.getElapsedTime();

    u.uColor1.value.set(color1);
    u.uColor2.value.set(color2);
    u.uColor3.value.set(color3);
    u.uColor4.value.set(color4);

    u.uIntensity.value = intensity;
    u.uDarkStrength.value = darkStrength;
    u.uGradientCenter.value.set(gradientCenter[0], gradientCenter[1]);
    u.uCursorOffset.value.copy(cursorOffsetRef.current);
    u.uRadius.value = radius;
    u.uSoftness.value = softness;
    u.uHorizontalMove.value = horizontalMove;
    u.uVerticalMove.value = verticalMove;
    u.uSpeed.value = speed;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;

          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          uniform vec3 uColor4;
          uniform float uIntensity;
          uniform float uDarkStrength;
          uniform vec2 uGradientCenter;
          uniform vec2 uCursorOffset;
          uniform float uRadius;
          uniform float uSoftness;
          uniform float uHorizontalMove;
          uniform float uVerticalMove;
          uniform float uSpeed;

          varying vec2 vUv;

          float hash(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 45.32);
            return fract(p.x * p.y);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);

            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));

            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(a, b, u.x) +
              (c - a) * u.y * (1.0 - u.x) +
              (d - b) * u.x * u.y;
          }

          void main() {
            vec2 uv = vUv;
            float aspect = 16.0 / 9.0;

            vec2 p = uv;
            p.x *= aspect;

            float moveX = sin(uTime * uSpeed) * uHorizontalMove;
            float moveY = cos(uTime * uSpeed * 0.75) * uVerticalMove;

            vec2 center = uGradientCenter + uCursorOffset;
            center.x *= aspect;
            center += vec2(moveX, moveY);

            float dist = distance(p, center);

            float radial = 1.0 - smoothstep(
              uRadius - uSoftness,
              uRadius + uSoftness,
              dist
            );

            float bottomMask = smoothstep(1.0, 0.15, uv.y);
            float rightGlow = smoothstep(0.05, 1.0, uv.x);

            float glow = radial * bottomMask;
            glow += rightGlow * bottomMask * 0.28;

            float n = noise(uv * 4.0 + vec2(uTime * 0.035, -uTime * 0.02));
            glow += (n - 0.5) * 0.025;

            glow = clamp(glow, 0.0, 1.0);

            vec3 color = uColor1;
            color = mix(color, uColor2, smoothstep(0.0, 0.38, glow));
            color = mix(color, uColor3, smoothstep(0.24, 0.72, glow));
            color = mix(color, uColor4, smoothstep(0.58, 1.0, glow));

            float topDark = smoothstep(0.42, 1.0, uv.y);
            color = mix(color, uColor1, topDark * uDarkStrength);

            float grain = hash(uv * vec2(1920.0, 1080.0) + uTime);
            color += (grain - 0.5) * 0.012;

            color *= uIntensity;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export default function GlassGradientScene({
  variant: controlledVariant,
  setVariant: controlledSetVariant,
  backgroundVariant: controlledBackgroundVariant,
  setBackgroundVariant: controlledSetBackgroundVariant,

  showControls = true,

  modelSrc = "/assets/models/hyperiexLogoNo2.glb",
  videoSrc = "/assets/models/bg-video.mp4",

  modelScale = 0.075,
  modelThickness = 1.45,
  modelPosition = [0, 0, 1.4],
  modelRotation = [0, 0, 0],

  modelGroupRef = null,
}) {
  const [internalVariant, setInternalVariant] = useState("glass");
  const [internalBackgroundVariant, setInternalBackgroundVariant] =
    useState("video");
 


  const variant = controlledVariant ?? internalVariant;
  const setVariant = controlledSetVariant ?? setInternalVariant;

  const backgroundVariant =
    controlledBackgroundVariant ?? internalBackgroundVariant;

  const setBackgroundVariant =
    controlledSetBackgroundVariant ?? setInternalBackgroundVariant;

  const commonModelProps = {
    src: modelSrc,
    scale: modelScale,
    thickness: modelThickness,
    position: modelPosition,
    rotation: modelRotation,
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
      >
        {backgroundVariant === "video" ? (
          <VideoBackgroundPlane
            src={videoSrc}
            position={[0, 0, 0]}
            scale={[1, 1, 1]}
            opacity={1}
          />
        ) : (
          <OrangeSemiCircleGradientShader
            color1="#050505"
            color2="#42170d"
            color3="#b74716"
            color4="#ff8a3d"
            gradientCenter={[0.5, -0.18]}
            radius={1.05}
            softness={0.92}
            horizontalMove={0.4}
            verticalMove={0.15}
            speed={0.22}
            intensity={1.15}
            cursorStrengthX={0.14}
            cursorStrengthY={0.05}
            cursorLerp={0.045}
          />
        )}

        <ambientLight intensity={0.35} />
        <pointLight position={[0, -2, 3]} intensity={3.8} color="#ff5a18" />
        <pointLight position={[2.5, 2, 3]} intensity={1.6} color="#ffffff" />

        <Suspense fallback={null}>
          <group ref={modelGroupRef}>
            {variant === "copper" ? (
              <CopperHeroModel
                {...commonModelProps}
                darkColor="#8f2b0c"
                midColor="#8f2b0c"
                orangeColor="#8f2b0c"
                highlightColor="#ff6b00"
                rimColor="#351006"
                shimmerStrength={0.95}
                shimmerWidth={0.78}
                shimmerSpeed={0.18}
                specularStrength={2.15}
                grainStrength={0.035}
              />
            ) : (
              <>
              
              <GlassHeroModel
                {...commonModelProps}
                text="hyperiux"
                textColor="#ffffff"
                textPosition={[0, 0, 0.45]}
                textScale={0.42}
                textOpacity={1}
                transmission={1}
                glassThickness={2.5}
                roughness={0.0}
                ior={1}
                chromaticAberration={2.5}
                distortion={2.4}
                temporalDistortion={0}
              />
              </>
            )}
          </group>
        </Suspense>
      </Canvas>

      {showControls && (
        <div className="absolute right-6 top-6 z-10 flex gap-3">
          <button
            onClick={() =>
              setVariant((prev) => (prev === "copper" ? "glass" : "copper"))
            }
            className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Switch to {variant === "copper" ? "Glass" : "Copper"}
          </button>

          <button
            onClick={() =>
              setBackgroundVariant((prev) =>
                prev === "gradient" ? "video" : "gradient"
              )
            }
            className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/20"
          >
            BG: {backgroundVariant === "gradient" ? "Gradient" : "Video"}
          </button>
        </div>
      )}
    </section>
  );
}