import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { VERTEX, FRAGMENT } from "./shaders";

export default function Flowers({ data, sprite, config }) {
  const pointsRef = useRef();

  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetIntensity = useRef(0.0);
  const currentIntensity = useRef(0.0);
  const lastRawMouse = useRef(new THREE.Vector2(-999, -999));

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCamFar: { value: 77 },
        uBrightness: { value: 4.5 },
        uSaturation: { value: 1.5 },
        uSpriteSheet: { value: sprite },
        uColorTint: { value: config?.colorTint },
        uMouse: { value: currentMouse.current },
        uAspect: { value: 1.0 },
        uHoverIntensity: { value: 0.0 },
        uDefaultFlowerBloom: { value: config?.defaultFlowerBloom ?? 1.5 },
        uHoverGlowMultiplier: { value: config?.hoverGlowMultiplier ?? 6.0 },
        uHoverMagneticStrength: { value: config?.hoverMagneticStrength ?? 0.6 },
        uHoverMagneticDirection: { value: config?.hoverMagneticDirection ?? 1.0 },
        uHoverZPull: { value: config?.hoverZPull ?? 2.5 },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
  }, [sprite, config]);

  useEffect(() => {
    return () => material?.dispose();
  }, [material]);

  useEffect(() => {
    const handleMove = (e) => {
      targetMouse.current.x = e.clientX / window.innerWidth;
      targetMouse.current.y = 1.0 - e.clientY / window.innerHeight;

      const dx = e.clientX - lastRawMouse.current.x;
      const dy = e.clientY - lastRawMouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (lastRawMouse.current.x !== -999 && dist > 1.0) {
        targetIntensity.current = 1.0;
      }

      lastRawMouse.current.set(e.clientX, e.clientY);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useFrame((state, delta) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uAspect.value = state.size.width / state.size.height;

      currentMouse.current.lerp(targetMouse.current, Math.min(1.0, delta * 3.0));
      material.uniforms.uMouse.value = currentMouse.current;

      targetIntensity.current = Math.max(0.0, targetIntensity.current - delta * 0.35);

      currentIntensity.current +=
        (targetIntensity.current - currentIntensity.current) * Math.min(1.0, delta * 1.5);
      material.uniforms.uHoverIntensity.value = currentIntensity.current;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={data.positions}
          count={data.count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColorCoordinate"
          array={data.colorCoords}
          count={data.count}
          itemSize={2}
        />
        <bufferAttribute
          attach="attributes-aSpriteScale"
          array={data.scales}
          count={data.count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRandomSeed"
          array={data.seeds}
          count={data.count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aGrowNoise"
          array={data.growNoise}
          count={data.count}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive attach="material" object={material} />
    </points>
  );
}
