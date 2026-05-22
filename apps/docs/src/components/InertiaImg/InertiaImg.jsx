"use client";
import { useEffect, useRef } from"react";
import Image from"next/image";
import { gsap } from"gsap";
import { InertiaPlugin } from"gsap/InertiaPlugin";

gsap.registerPlugin(InertiaPlugin);

export default function InertiaImage({ images = [] }) {
  const rootRef = useRef(null);
  const deltaRef = useRef({ x: 0, y: 0, oldX: null, oldY: null });
  const isTouchRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (typeof window !== "undefined") {
      isTouchRef.current = window.matchMedia("(hover: none), (pointer: coarse)").matches || 
                           ('ontouchstart' in window) || 
                           (navigator.maxTouchPoints > 0);
    }

    const detectTouch = () => {
      isTouchRef.current = true;
    };
    window.addEventListener("touchstart", detectTouch, { passive: true });

    const onMouseMove = (e) => {
      const d = deltaRef.current;
      if (d.oldX === null || d.oldY === null) {
        d.oldX = e.clientX;
        d.oldY = e.clientY;
        d.x = 0;
        d.y = 0;
        return;
      }
      d.x = e.clientX - d.oldX;
      d.y = e.clientY - d.oldY;
      d.oldX = e.clientX;
      d.oldY = e.clientY;
    };

    const onTouchStart = (e) => {
      isTouchRef.current = true;
      const touch = e.touches[0];
      const d = deltaRef.current;
      d.oldX = touch.clientX;
      d.oldY = touch.clientY;
      d.x = 0;
      d.y = 0;
    };

    const onTouchMove = (e) => {
      isTouchRef.current = true;
      const touch = e.touches[0];
      const d = deltaRef.current;
      d.x = touch.clientX - d.oldX;
      d.y = touch.clientY - d.oldY;
      d.oldX = touch.clientX;
      d.oldY = touch.clientY;
    };

    root.addEventListener("mousemove", onMouseMove);
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });

    const mediaEls = root.querySelectorAll(".media-item");
    const cleanups = [];

    mediaEls.forEach((el) => {
      const onMouseEnter = () => {
        const image = el.querySelector("img");
        const { x, y } = deltaRef.current;

        const isTouch = isTouchRef.current;
        const velocityMultiplier = isTouch ? 2 : 30;
        const rotationRange = isTouch ? 50 : 60;

        const tl = gsap.timeline({
          onComplete: () => tl.kill(),
        });
        tl.timeScale(1.2);

        tl.to(image, {
          inertia: {
            x: { velocity: x * velocityMultiplier, end: 0 },
            y: { velocity: y * velocityMultiplier, end: 0 },
          },
        });

        tl.fromTo(
          image,
          { rotate: 0 },
          {
            duration: 0.4,
            rotate: (Math.random() - 0.5) * rotationRange,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          },
          "<"
        );
      };

      el.addEventListener("mouseenter", onMouseEnter);
      cleanups.push(() => el.removeEventListener("mouseenter", onMouseEnter));
    });

    return () => {
      window.removeEventListener("touchstart", detectTouch);
      root.removeEventListener("mousemove", onMouseMove);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      cleanups.forEach((fn) => fn());
    };
  }, []);

 return (
 <section
 ref={rootRef}
 className="relative grid min-h-[85vh] w-full place-items-center overflow-hidden"
 >
 <div className="grid grid-cols-4 gap-[1vw] max-sm:gap-[5vw] max-md:grid-cols-3 max-sm:grid-cols-2">
 {images.map((src, i) => (
 <div
 key={i}
 className="media-item relative h-[11vw] w-[11vw] max-sm:h-[35vw] max-sm:w-[35vw]"
 >
 <Image
 src={src}
 alt=""
 fill
 sizes="(max-width: 640px) 35vw, 11vw"
 className="pointer-events-none block rounded-[4%] object-contain will-change-transform"
 />
 </div>
 ))}
 </div>
 </section>
 );
}
