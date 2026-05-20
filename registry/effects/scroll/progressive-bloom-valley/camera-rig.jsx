import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import useInput from "./use-input";

export default function CameraRig({ curve, cameraProps, scrollConfig = {} }) {
  const container = useRef();
  const breath = useRef();
  const camRef = useRef();
  const intro = useRef({ angle: Math.PI / 2, done: false, started: false });
  const animMouse = useRef({ x: 0, y: 0 });
  const { mouse, scroll } = useInput(scrollConfig);
  const progress = useRef(0);

  const baseRotation = useMemo(() => {
    const r = cameraProps?.rotation;
    if (Array.isArray(r) && r.length === 3) return r;
    return [0, 0, 0];
  }, [cameraProps]);

  useFrame((state, delta) => {
    if (!curve || !container.current || !breath.current) return;
    const camera = camRef.current;
    if (!camera) return;

    let diff = scroll.current - progress.current;
    if (diff > 0.5) diff -= 1;
    if (diff < -0.5) diff += 1;
    progress.current =
      ((progress.current + diff * (scrollConfig.lerpSpeed ?? 0.05)) % 1 + 1) % 1;
    const p = curve.getPointAt(progress.current);
    const t = curve.getTangentAt(progress.current);

    container.current.position.copy(p);

    const targetQuat = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(
        p,
        p.clone().add(t.clone().multiplyScalar(1)),
        new THREE.Vector3(0, 1, 0)
      )
    );
    container.current.quaternion.slerp(targetQuat, 0.1);

    if (!intro.current.started) {
      breath.current.rotation.x = intro.current.angle;
      camera.rotation.set(baseRotation[0], baseRotation[1], baseRotation[2]);
      intro.current.started = true;
    }
    if (!intro.current.done) {
      intro.current.angle += (0 - intro.current.angle) * Math.min(1, 2 * delta);
      breath.current.rotation.x = intro.current.angle;
      if (Math.abs(intro.current.angle) < 0.003) {
        intro.current.angle = 0;
        intro.current.done = true;
      }
    }

    const elapsed = state.clock.elapsedTime;
    breath.current.position.y = 0.02 * Math.cos(1.1 * elapsed);
    breath.current.position.z = 1 + 0.12 * Math.cos(1.1 * elapsed);

    const ml = Math.min(1, 5 * delta);
    animMouse.current.x += (mouse.current.x - animMouse.current.x) * ml;
    animMouse.current.y += (mouse.current.y - animMouse.current.y) * ml;

    const maxRX = 3 * (Math.PI / 180);
    const maxRY = 2 * (Math.PI / 180);
    camera.rotation.y += (-maxRX * animMouse.current.x - camera.rotation.y) * 0.1;
    camera.rotation.x += (-maxRY * animMouse.current.y - camera.rotation.x) * 0.1;
  });

  return (
    <group ref={container}>
      <group ref={breath}>
        <PerspectiveCamera
          ref={camRef}
          makeDefault
          fov={cameraProps?.fov ?? 60}
          near={cameraProps?.near ?? 0.1}
          far={cameraProps?.far ?? 200}
          rotation={baseRotation}
          position={[0, 2, 0]}
        />
      </group>
    </group>
  );
}
