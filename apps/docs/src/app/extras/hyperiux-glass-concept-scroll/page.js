"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

import GlassVideoHeroScene from "@/components/HyperiuxGlassHeroConcept/GlassVideoHeroScene";
import GlassModel from "@/components/HyperiuxGlassHeroConcept/GlassModel";
import OrangeSemiCircleGradientShader from "@/components/HyperiuxGlassHeroConcept/OrangeSemiCircleGradientShader";
import { Environment } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

function FirstCanvasScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      className="h-full w-full"
    >
        <Environment preset="city"/>
      <Suspense fallback={null}>
        <GlassVideoHeroScene />
      </Suspense>
    </Canvas>
  );
}

function SecondCanvasScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      className="h-full w-full"
    >
      <OrangeSemiCircleGradientShader
        color1="#050505"
        color2="#42170d"
        color3="#b74716"
        color4="#ff8a3d"
        gradientCenter={[0.5, -0.08]}
        radius={1.05}
        softness={0.92}
        horizontalMove={0.25}
        verticalMove={0.08}
        speed={0.18}
        intensity={1.1}
        cursorStrengthX={0.1}
        cursorStrengthY={0.08}
        cursorLerp={0.045}
      />

      <ambientLight intensity={0.65} />
      <pointLight position={[0, -2, 3]} intensity={3.8} color="#ff5a18" />
      <pointLight position={[2.5, 2, 3]} intensity={2.2} color="#ffffff" />

      <Suspense fallback={null}>
        <GlassModel
          src="/assets/models/hyperiexLogoNo2.glb"
          scale={0.07}
          thickness={2}
          position={[-0.45, 0, 1.4]}
          rotation={[0, 0.12, 0]}
          transmission={1}
          glassThickness={1.35}
          roughness={0}
          ior={1}
          chromaticAberration={0.5}
          distortion={0.4}
          temporalDistortion={0}
        />
      </Suspense>
    </Canvas>
  );
}

export default function Page() {
  const wrapperRef = useRef(null);
  const secondCanvasRef = useRef(null);
  const heroContentRef = useRef(null);
  const secondContentRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current || !secondCanvasRef.current) return;

    gsap.set(secondCanvasRef.current, {
      clipPath: "polygon(0 100%, 0 100%, 0 100%, 0 100%)",
    });

    gsap.set(secondContentRef.current, {
      opacity: 0,
      y: 80,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        // markers: true,
      },
    });

    tl.to(
      secondCanvasRef.current,
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        ease: "none",
      },
      0
    );

    tl.to(
      heroContentRef.current,
      {
        y: "35%",
        opacity: 0,
        ease: "none",
      },
      0
    );

    tl.to(
      secondContentRef.current,
      {
        opacity: 1,
        y: 0,
        ease: "none",
      },
      0.45
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <ReactLenis root>
      <main className="relative bg-black">
        <section ref={wrapperRef} className="relative h-[220vh] w-screen">
          <div className="sticky top-0 h-screen w-screen overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
              <FirstCanvasScene />
            </div>

            <div ref={secondCanvasRef} className="absolute inset-0 z-1">
              <SecondCanvasScene />
            </div>

            <div
              ref={heroContentRef}
              className="pointer-events-none absolute inset-0 z-10 flex items-end justify-between px-[5vw] pb-[5%]"
            >
              <p className="font-aeonik flex flex-col text-[6.5vw] font-semibold uppercase leading-[1] text-white">
                <span>Digital</span>
                <span className="ml-[5vw]">Experience</span>
                <span>Design Agency</span>
              </p>

              <p className="w-[25%] text-end text-white">
                Hyperiux is a digital experience design agency that crafts
                immersive
              </p>
            </div>

            <div
              ref={secondContentRef}
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end px-[5vw]"
            >
              <div className="w-[38%] text-white">
                <p className="mb-5 text-sm uppercase tracking-[0.35em] text-white/50">
                  Second Portal
                </p>

                <h2 className="text-[4.5vw] font-semibold uppercase leading-[0.95]">
                  Designed like a system. Felt like a memory.
                </h2>

                <p className="mt-8 text-lg leading-[1.7] text-white/65">
                  We build immersive digital experiences where motion,
                  interface, engineering, and narrative work as one complete
                  brand system.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-20 min-h-screen w-screen bg-[#111111] px-[5vw] py-[8vw]" />
      </main>
    </ReactLenis>
  );
}