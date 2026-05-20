"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, useFBO } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import "./TransitionShader";

gsap.registerPlugin(ScrollTrigger);

function SceneComposition({ scenes, progress }) {
  const material = useRef(null);
  const { gl, size } = useThree();

  const fboA = useFBO(size.width, size.height, {
    samples: 0,
    depth: true,
  });

  const fboB = useFBO(size.width, size.height, {
    samples: 0,
    depth: true,
  });

  const [sceneA] = useState(() => new THREE.Scene());
  const [sceneB] = useState(() => new THREE.Scene());

  const camA = useRef(null);
  const camB = useRef(null);

  useFrame(() => {
    if (!camA.current || !camB.current || !material.current) return;

    camA.current.aspect = size.width / size.height;
    camA.current.updateProjectionMatrix();

    camB.current.aspect = size.width / size.height;
    camB.current.updateProjectionMatrix();

    gl.setRenderTarget(fboA);
    gl.clear(true, true, true);
    gl.render(sceneA, camA.current);

    gl.setRenderTarget(fboB);
    gl.clear(true, true, true);
    gl.render(sceneB, camB.current);

    gl.setRenderTarget(null);

    material.current.uPrev = fboA.texture;
    material.current.uNext = fboB.texture;
    material.current.uProgress = progress;
  });

  return (
    <>
      {createPortal(
        <>
          <color attach="background" args={["#000000"]} />
          <PerspectiveCamera ref={camA} position={[0, 0, 5]} fov={35} />
          {scenes[0]}
        </>,
        sceneA
      )}

      {createPortal(
        <>
          <color attach="background" args={["#000000"]} />
          <PerspectiveCamera ref={camB} position={[0, 0, 5]} fov={35} />
          {scenes[1]}
        </>,
        sceneB
      )}

      <mesh frustumCulled={false}>
        <planeGeometry args={[2, 2]} />
        <transitionShaderMaterial
          ref={material}
          depthWrite={false}
          depthTest={false}
          transparent={false}
          uSoftness={0.075}
          uAngle={0.32}
        />
      </mesh>
    </>
  );
}

export default function PortalHeroTransition({ scenes }) {
  const wrapperRef = useRef(null);
  const progressRef = useRef({ value: 0 });
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current.value = self.progress;
        forceUpdate((v) => v + 1);
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[220vh] w-screen">
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        <Canvas
          className="h-full w-full"
          camera={{ position: [0, 0, 1], fov: 75 }}
          gl={{
            antialias: true,
            autoClear: false,
            alpha: false,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.5]}
        >
          <SceneComposition
            scenes={scenes}
            progress={progressRef.current.value}
          />
        </Canvas>
      </div>
    </div>
  );
}