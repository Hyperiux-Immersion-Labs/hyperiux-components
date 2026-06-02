"use client";

import { useEffect, useRef } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INITIAL_POINTER = 0.5;
const POINTER_LERP = 0.1;
const HOVER_LERP = 0.05;
const PLANE_WIDTH = 18;
const PLANE_HEIGHT = 12;
const PIXEL_CIRCLES_VERT = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PIXEL_CIRCLES_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uHover;
  uniform float uBasePixels;
  uniform float uDynamicRange;
  uniform float uNoiseStrength;
  uniform float uDisplacement;
  uniform float uColorBoost;
  uniform float uVignette;
  uniform vec2  uResolution;
  uniform vec2  uCircle1Center;
  uniform vec2  uCircle2Center;

  varying vec2 vUv;

  float noise2D(vec2 p) {
    vec2 ip = floor(p);
    vec2 f = fract(p);
    f = f * (3.0 - 2.0 * f);
    vec4 h = vec4(0.0, 1.0, 0.0, 1.0);
    vec4 n = h.xyzy * ip.x + h.xxzz * ip.y;
    n = sin(n * vec4(12.9898, 78.233, 45.164, 94.673));
    return dot(mix(n.xy, n.zw, f.y), mix(h.xz, h.yw, f.x)) * 0.1 + 0.5;
  }

  vec2 pixelate(vec2 uv, float pixels) {
    vec2 pixelUV = floor(uv * pixels) / pixels;
    float n = fract(sin(dot(floor(pixelUV * 10.0), vec2(12.9898, 78.233))) * 43758.5453)
      * uNoiseStrength
      * 0.9;
    return pixelUV + n * uHover;
  }

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse);
    float time = uTime * 2.0;
    float dynamicPixels = uBasePixels * (1.0 + sin(time) * uDynamicRange);
    float finalPixels = mix(
      uBasePixels,
      dynamicPixels,
      smoothstep(0.5, 0.0, dist) * uHover
    );

    vec2 disp = vec2(
      noise2D(uv + time),
      noise2D(uv * 3.0 + time + 1.0)
    ) * uDisplacement * uHover;

    vec2 pixelatedUV = mix(
      uv + disp,
      pixelate(uv + disp, finalPixels),
      smoothstep(0.20, 0.0, dist) * 3.0 * uHover
    );

    float c1 = smoothstep(0.5, 0.0, distance(pixelatedUV, uCircle1Center));
    float c2 = smoothstep(0.5, 0.0, distance(pixelatedUV, uCircle2Center));

    vec3 color = mix(
      vec3(0.0),
      mix(vec3(0.0, 0.5, 0.7), vec3(0.5, 0.1, 0.8), c2),
      c1
    );

    float vig = 1.0 - smoothstep(0.3, 3.2, length(uv - 0.5) * 2.0);
    gl_FragColor = vec4(color * mix(1.0, vig, uVignette), 1.0);
  }
`;

class PixelCirclesMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(INITIAL_POINTER, INITIAL_POINTER) },
        uHover: { value: 0.7 },
        uBasePixels: { value: 35.0 },
        uDynamicRange: { value: 0.02 },
        uNoiseStrength: { value: 0.05 },
        uDisplacement: { value: 0.02 },
        uColorBoost: { value: 0.0 },
        uVignette: { value: 0.6 },
        uResolution: { value: new THREE.Vector2(2, 2) },
        uCircle1Center: { value: new THREE.Vector2(0.3, 0.5) },
        uCircle2Center: { value: new THREE.Vector2(0.7, 0.5) },
      },
      vertexShader: PIXEL_CIRCLES_VERT,
      fragmentShader: PIXEL_CIRCLES_FRAG,
    });
  }
}

extend({ PixelCirclesMaterial });

function PixelCirclesPlane() {
  const materialRef = useRef(null);
  const pointerRef = useRef({
    target: { x: INITIAL_POINTER, y: INITIAL_POINTER },
    current: { x: INITIAL_POINTER, y: INITIAL_POINTER },
  });
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const onResize = () => {
      materialRef.current?.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from(".text-left", {
        xPercent: -25,
        duration: 3.5,
        ease: "expo.out",
      });

      gsap.from(".text-right", {
        xPercent: 25,
        duration: 3.5,
        ease: "expo.out",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".infinite-logo-container",
            start: "top top",
            end: "+150% top",
            scrub: true,
            pin: true,
          },
        })
        .to(".infinite-logo", {
          rotate: 90,
          scale: 20,
          duration: 2,
          ease: "power3.in",
        })
        .to(
          ".infinite-logo",
          {
            opacity: 0,
            duration: 1.5,
            ease: "power2.in",
          },
          "<0.5"
        );
    });

    return () => {
      context.revert();
    };
  }, []);

  const onPointerEnter = () => {
    isHoveredRef.current = true;
  };

  const onPointerLeave = () => {
    isHoveredRef.current = false;
  };

  const onPointerMove = (event) => {
    const [u, v] = event.uv;
    pointerRef.current.target = { x: u, y: v };
  };

  useFrame(({ clock }) => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    // Animation loop
    const time = clock.getElapsedTime();
    const { target, current } = pointerRef.current;
    const { uniforms } = material;

    uniforms.uTime.value = time;
    current.x += (target.x - current.x) * POINTER_LERP;
    current.y += (target.y - current.y) * POINTER_LERP;
    uniforms.uMouse.value.set(current.x, current.y);
    uniforms.uHover.value +=
      ((isHoveredRef.current ? 1 : 0) - uniforms.uHover.value) * HOVER_LERP;
    uniforms.uCircle1Center.value.set(
      0.5 + 0.2 * Math.sin(time * 0.3),
      0.5 + 0.2 * Math.cos(time * 0.3)
    );
    uniforms.uCircle2Center.value.set(
      0.5 + 0.3 * Math.sin(time * 0.1),
      0.5 + 0.15 * Math.cos(time * 0.8)
    );
  });

  return (
    <mesh
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
    >
      <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT]} />
      <pixelCirclesMaterial ref={materialRef} />
    </mesh>
  );
}

export default function Pixelation() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="fixed left-0 top-0 h-full w-full overflow-hidden">
        <Canvas>
          <PixelCirclesPlane />
        </Canvas>
      </div>

      <section
        className="pointer-events-none relative z-10 flex h-screen w-full flex-col justify-center gap-[12vw] px-[5vw] max-md:h-[90vh] max-md:gap-[7vw] max-sm:h-[90vh] max-sm:gap-[7vw]"
      >
        <h1 className="mt-[4vw] flex flex-col text-[8vw] font-medium leading-[1.2] text-white max-md:text-[12vw] max-sm:text-[15vw]">
          <span className="text-left">
            Building <span className="font-light">Interfaces.</span>
          </span>
          <span className="text-right font-light max-sm:text-left">
            Shipping <span className="font-medium">Experiences.</span>
          </span>
        </h1>

        <p className="hidden font-medium tracking-wide text-white/70 max-md:block max-md:text-[3vw] max-sm:text-[4vw]">
          Pro tip: this one&apos;s built for a mouse - try it on desktop for the
          cleanest pixel trail.
        </p>

        <p className="w-[30%] text-[1.5vw] text-justify text-white max-md:mt-[5vw] max-md:w-[80%] max-md:text-[3vw] max-sm:w-[90%] max-sm:text-[5vw]">
          Hyperiux is a modern UI animation library crafted for developers who
          want stunning interactions, smooth transitions, and production -
          ready components .
        </p>
      </section>
    </div>
  );
}
