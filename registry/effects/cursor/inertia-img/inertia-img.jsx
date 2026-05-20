"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(InertiaPlugin);

export function InertiaImg({ images = [] }) {
  const rootRef = useRef(null);
  const deltaRef = useRef({ x: 0, y: 0, oldX: 0, oldY: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const onMouseMove = (e) => {
      const d = deltaRef.current;
      d.x = e.clientX - d.oldX;
      d.y = e.clientY - d.oldY;
      d.oldX = e.clientX;
      d.oldY = e.clientY;
    };

    root.addEventListener("mousemove", onMouseMove);

    const mediaEls = root.querySelectorAll(".media-item");
    const cleanups = [];

    mediaEls.forEach((el) => {
      const onMouseEnter = () => {
        const image = el.querySelector("img");
        const { x, y } = deltaRef.current;

        const tl = gsap.timeline({
          onComplete: () => tl.kill(),
        });
        tl.timeScale(1.2);

        tl.to(image, {
          inertia: {
            x: { velocity: x * 30, end: 0 },
            y: { velocity: y * 30, end: 0 },
          },
        });

        tl.fromTo(
          image,
          { rotate: 0 },
          {
            duration: 0.4,
            rotate: (Math.random() - 0.5) * 30,
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
      root.removeEventListener("mousemove", onMouseMove);
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
