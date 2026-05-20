import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

export default function useInput({
  scrollIntensity = 1,
  autoSpeed = 0.00004,
  damping = 0.5,
  loopPoint = 0.85,
} = {}) {
  const { gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const el = gl.domElement;

    const onWheel = (e) => {
      e.preventDefault();
      velocity.current += e.deltaY * 0.00008 * scrollIntensity;
    };

    let lastTouchY = 0;
    const onTouchStart = (e) => {
      lastTouchY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      const dy = e.touches[0].clientY - lastTouchY;
      lastTouchY = e.touches[0].clientY;
      velocity.current -= dy * 0.00015 * scrollIntensity;
    };

    const onMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [gl.domElement]);

  useEffect(() => {
    let running = true;

    const update = () => {
      if (!running) return;

      velocity.current *= damping;

      const MAX_VEL = 0.005;
      velocity.current = Math.max(-MAX_VEL, Math.min(MAX_VEL, velocity.current));

      scroll.current += velocity.current + autoSpeed;

      if (scroll.current >= loopPoint) {
        scroll.current = 0;
        velocity.current = 0;
      }
      if (scroll.current < 0) {
        scroll.current = loopPoint - 0.001;
        velocity.current = 0;
      }

      requestAnimationFrame(update);
    };
    update();
    return () => {
      running = false;
    };
  }, []);

  return { mouse, scroll };
}
