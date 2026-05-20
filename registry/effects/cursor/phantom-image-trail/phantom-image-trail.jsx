"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, Expo } from "gsap";

const lerp = (a, b, n) => (1 - n) * a + n * b;

function useMouse({ smooth = true, lerpFactor = 0.1 } = {}) {
  const mouse = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const [state, setState] = useState({ x: 0, y: 0, smoothX: 0, smoothY: 0, dx: 0, dy: 0, distance: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current = { x: event.clientX, y: event.clientY };
    };

    const loop = () => {
      const { x, y } = mouse.current;
      const { x: lx, y: ly } = lastMouse.current;
      const dx = x - lx;
      const dy = y - ly;
      const distance = Math.hypot(dx, dy);

      if (smooth) {
        smoothMouse.current.x = lerp(smoothMouse.current.x, x, lerpFactor);
        smoothMouse.current.y = lerp(smoothMouse.current.y, y, lerpFactor);
      } else {
        smoothMouse.current.x = x;
        smoothMouse.current.y = y;
      }

      setState({ x, y, smoothX: smoothMouse.current.x, smoothY: smoothMouse.current.y, dx, dy, distance });
      lastMouse.current = { x, y };
      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [smooth, lerpFactor]);

  return { mouse, smoothMouse, ...state };
}

export function PhantomImageTrail({
  images = [],
  enableRotation = true,
  idleSpawn = true,
  idleDelay = 300,
  cursorOffsetX = -12,
  cursorOffsetY = -12,
  popOutDuration = 1,
  fadeOutDuration = 0.7,
  imageMultiplier = 3,
  idlePopOutMultiplier = 1.8,
  idleFadeMultiplier = 1.5,
}) {
  const totalImages = images.length * imageMultiplier;
  const imagesRef = useRef([]);
  const rafRef = useRef(null);
  const idleTimerRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState(0);
  const { mouse, smoothMouse } = useMouse({ smooth: true, lerpFactor: 0.1 });
  const lastTriggerPos = useRef({ x: 0, y: 0 });
  const lastIdleSpawnPos = useRef({ x: -9999, y: -9999 });
  const zIndexVal = useRef(1);
  const imgPosition = useRef(0);
  const threshold = 100;

  const getDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const getCenteredPosition = (width, height, useSmooth = false) => {
    const source = useSmooth ? smoothMouse.current : mouse.current;
    return { x: source.x - width / 2 + cursorOffsetX, y: source.y - height / 2 + cursorOffsetY };
  };

  const showNextImage = ({ useSmoothStart = true, lockToCursor = false, isIdle = false } = {}) => {
    const img = imagesRef.current[imgPosition.current];
    if (!img) return;

    const width = img.offsetWidth;
    const height = img.offsetHeight;
    gsap.killTweensOf(img);

    const startRotation = enableRotation ? gsap.utils.random(-35, 35) : 0;
    const exitRotation = enableRotation ? gsap.utils.random(-15, 15) : 0;
    const startPos = lockToCursor ? getCenteredPosition(width, height, false) : getCenteredPosition(width, height, true);
    const endPos = getCenteredPosition(width, height, false);

    gsap
      .timeline()
      .set(img, {
        opacity: 1,
        scale: 0.2,
        rotateZ: startRotation,
        zIndex: zIndexVal.current,
        x: useSmoothStart ? startPos.x : endPos.x,
        y: useSmoothStart ? startPos.y : endPos.y,
      })
      .to(img, {
        ease: isIdle ? "power1.out" : Expo.easeOut,
        rotateZ: 0,
        opacity: 1,
        scale: 1,
        duration: isIdle ? popOutDuration * idlePopOutMultiplier : popOutDuration,
        x: endPos.x,
        y: endPos.y,
      })
      .to(img, {
        ease: "power4.inOut",
        opacity: 0,
        rotateZ: exitRotation,
        duration: isIdle ? fadeOutDuration * idleFadeMultiplier : fadeOutDuration,
        delay: -(isIdle ? fadeOutDuration * idleFadeMultiplier : fadeOutDuration),
        scale: 0,
      });

    zIndexVal.current += 1;
    imgPosition.current = (imgPosition.current + 1) % imagesRef.current.length;
  };

  useEffect(() => {
    const scheduleIdleSpawn = () => {
      if (!idleSpawn) return;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (getDistance(mouse.current, lastIdleSpawnPos.current) < 2) {
          showNextImage({ useSmoothStart: false, lockToCursor: true, isIdle: true });
        }
        lastIdleSpawnPos.current = { ...mouse.current };
        scheduleIdleSpawn();
      }, idleDelay);
    };

    const render = () => {
      if (getDistance(mouse.current, lastTriggerPos.current) > threshold) {
        showNextImage({ useSmoothStart: true, lockToCursor: false, isIdle: false });
        lastTriggerPos.current = { ...mouse.current };
        lastIdleSpawnPos.current = { ...mouse.current };
        if (idleSpawn) scheduleIdleSpawn();
      }

      const allInactive = imagesRef.current.every((img) => img && !gsap.isTweening(img) && img.style.opacity === "0");
      if (allInactive) zIndexVal.current = 1;
      rafRef.current = requestAnimationFrame(render);
    };

    if (loadedImages === totalImages) {
      rafRef.current = requestAnimationFrame(render);
      if (idleSpawn) scheduleIdleSpawn();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [loadedImages, totalImages, idleSpawn, idleDelay]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {Array.from({ length: totalImages }).map((_, index) => {
        const imageIndex = index % images.length;
        return (
          <img
            key={index}
            src={images[imageIndex]}
            alt={`Trail ${imageIndex + 1}`}
            ref={(el) => {
              if (el) imagesRef.current[index] = el;
            }}
            onLoad={() => setLoadedImages((prev) => prev + 1)}
            className="pointer-events-none absolute top-0 left-0 h-[30vh] w-[17vw] max-w-none rounded-[0.7vw] object-cover opacity-0 will-change-transform max-lg:h-[24vh] max-lg:w-[24vw] max-lg:rounded-[1.2vw] max-sm:h-[22vh] max-sm:w-[38vw] max-sm:rounded-[3vw]"
          />
        );
      })}
    </div>
  );
}

export default PhantomImageTrail;
