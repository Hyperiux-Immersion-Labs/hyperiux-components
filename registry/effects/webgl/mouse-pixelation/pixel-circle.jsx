"use client";
import React, { useRef, useEffect } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class PixelCirclesMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
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
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: /* glsl */ `
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

        float noise2D(vec2 p){
          vec2 ip = floor(p);
          vec2 f = fract(p);
          f = f*(3.0 - 2.0*f);
          vec4 h = vec4(0., 1., 0., 1.);
          vec4 n = h.xyzy * ip.x + h.xxzz * ip.y;
          n = sin(n * vec4(12.9898,78.233,45.164,94.673));
          return dot(mix(n.xy, n.zw, f.y), mix(h.xz, h.yw, f.x)) * 0.1 + 0.5;
        }

        vec2 pixelate(vec2 uv, float pixels){
          vec2 pixelUV = floor(uv * pixels)/pixels;
          float n = fract(sin(dot(floor(pixelUV*10.),vec2(12.9898,78.233))) * 43758.5453) * uNoiseStrength * 0.9;
          return pixelUV + n * uHover;
        }

        void main(){
          vec2 uv = vUv;
          float dist = distance(uv, uMouse);
          float time = uTime * 2.0;
          float dynamicPixels = uBasePixels*(1.0 + sin(time)*uDynamicRange);
          float finalPixels = mix(uBasePixels, dynamicPixels, smoothstep(0.5,0.0, dist)*uHover);

          vec2 disp = vec2(
            noise2D(uv + time),
            noise2D(uv*3.0 + time + 1.0)
          ) * uDisplacement * uHover;

          vec2 pixelatedUV = mix(
            uv + disp,
            pixelate(uv + disp, finalPixels),
            smoothstep(0.20,0.0, dist) * 3.0 * uHover
          );

          float c1 = smoothstep(0.5, 0.0, distance(pixelatedUV, uCircle1Center));
          float c2 = smoothstep(0.5, 0.0, distance(pixelatedUV, uCircle2Center));

          vec3 color = mix(
            vec3(0.0),
            mix(vec3(0.0, 0.5, 0.7), vec3(0.5, 0.1, 0.8), c2),
            c1
          );

          float vig = 1.0 - smoothstep(0.3,3.2, length(uv-0.5)*2.0);
          gl_FragColor = vec4(color * mix(1.0, vig, uVignette), 1.0);
        }
      `,
    });
  }
}

extend({ PixelCirclesMaterial });

function PixelCirclesPlane() {
  const matRef = useRef();
  const pointer = useRef({ target: { x: 0.5, y: 0.5 }, current: { x: 0.5, y: 0.5 } });
  const hover = useRef(false);

  useEffect(() => {
    const onResize = () => {
      matRef.current?.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pc-text-left", { xPercent: -25, duration: 3.5, ease: "expo.out" });
      gsap.from(".pc-text-right", { xPercent: 25, duration: 3.5, ease: "expo.out" });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".pc-logo-container",
            start: "top top",
            end: "+150% top",
            scrub: true,
            pin: true,
          },
        })
        .to(".pc-logo", { rotate: 90, scale: 20, duration: 2, ease: "power3.in" })
        .to(".pc-logo", { opacity: 0, duration: 1.5, ease: "power2.in" }, "<0.5");
    });
    return () => ctx.revert();
  }, []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const time = clock.getElapsedTime();
    const { target, current } = pointer.current;
    const { uniforms } = matRef.current;
    uniforms.uTime.value = time;
    current.x += (target.x - current.x) * 0.1;
    current.y += (target.y - current.y) * 0.1;
    uniforms.uMouse.value.set(current.x, current.y);
    uniforms.uHover.value += ((hover.current ? 1 : 0) - uniforms.uHover.value) * 0.05;
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
      onPointerEnter={() => (hover.current = true)}
      onPointerLeave={() => (hover.current = false)}
      onPointerMove={(e) => {
        const [u, v] = e.uv;
        pointer.current.target = { x: u, y: v };
      }}
    >
      <planeGeometry args={[18, 12]} />
      <pixelCirclesMaterial ref={matRef} />
    </mesh>
  );
}

export function PixelCircle() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="fixed top-0 left-0 h-full w-full overflow-hidden">
        <Canvas>
          <PixelCirclesPlane />
        </Canvas>
      </div>

      <section className="w-full h-screen relative z-[10] flex flex-col justify-center px-[5vw] gap-[4vw] pointer-events-none">
        <h1 className="text-white font-medium text-[9vw] mt-[4vw] leading-[1.2] flex flex-col">
          <span className="pc-text-left text-left">
            Redefining <span className="font-light">Value.</span>
          </span>
          <span className="pc-text-right text-right font-light">
            Rewiring <span className="font-medium">the Future.</span>
          </span>
        </h1>
        <p className="text-white text-[1.5vw] w-[30%] text-justify">
          The decentralized economy starts here where speed, security, and sovereignty collide.
        </p>
      </section>
    </div>
  );
}
