"use client";

import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DESKTOP_WIDTH = 1200;
const TABLET_MIN_WIDTH = 768;
const LEFT_DEPTH_MAX = 30;
const RIGHT_DEPTH_MAX = 40;
const DEPTH_MIN = -1;
const DEPTH_MAX = 1;
const Z_INDEX_MIN = 1;
const LEFT_ANGLE_OFFSET = Math.PI;
const RIGHT_ANGLE_OFFSET = -Math.PI * 0.08;
const TEXT_REVEAL_DURATION = 0.6;
const TEXT_REVEAL_STAGGER = 0.04;
const IMAGE_REVEAL_DURATION = 0.6;
const IMAGE_REVEAL_STAGGER = 0.04;

gsap.registerPlugin(ScrollTrigger);

function wrapProgress(value) {
  let wrappedValue = value % 1;
  if (wrappedValue < 0) wrappedValue += 1;
  return wrappedValue;
}

function getCircularPosition(progress, radiusX, radiusY, angleOffset = 0) {
  const angle = progress * Math.PI * 2 + angleOffset;

  return {
    x: Math.sin(angle) * radiusX,
    y: Math.cos(angle) * radiusY,
  };
}

export default function CircularScrollShowcase({
  items = [],
  className = "",
  sectionHeight = 260,
  leftRadiusX = 95,
  leftRadiusY = 220,
  rightRadiusX = 260,
  rightRadiusY = 260,
  imageCardWidth = 190,
  imageCardHeight = 210,
  titleSize = "clamp(28px, 3vw, 56px)",
  pinSpacing = true,
  scrub = 1.2,
}) {
  // State and refs
  const rootRef = useRef(null);
  const stickyRef = useRef(null);
  const progressRef = useRef(0);

  // Derived values
  const safeItems = useMemo(() => {
    return items.map((item, index) => ({
      id: item.id ?? index,
      title: item.title ?? `Item ${index + 1}`,
      image: item.image ?? "",
      alt: item.alt ?? item.title ?? `Item ${index + 1}`,
    }));
  }, [items]);

  // Effects
  useEffect(() => {
    if (!rootRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      const leftNodes = gsap.utils.toArray(".circular-scroll-showcase__left-item");
      const rightNodes = gsap.utils.toArray(".circular-scroll-showcase__right-item");
      const total = safeItems.length;

      if (!total) return;

      // Circular layout
      const render = (scrollProgress) => {
        progressRef.current = scrollProgress;

        const width = typeof window !== "undefined" ? window.innerWidth : DESKTOP_WIDTH;
        let factor = 1;

        if (width < DESKTOP_WIDTH && width >= TABLET_MIN_WIDTH) {
          factor = width / DESKTOP_WIDTH;
        }

        const leftRadiusScaledX = leftRadiusX * factor;
        const leftRadiusScaledY = leftRadiusY * factor;
        const rightRadiusScaledX = rightRadiusX * factor;
        const rightRadiusScaledY = rightRadiusY * factor;

        if (rootRef.current) {
          rootRef.current.style.setProperty("--css-card-width", `${imageCardWidth * factor}px`);
          rootRef.current.style.setProperty("--css-card-height", `${imageCardHeight * factor}px`);
        }

        leftNodes.forEach((node, index) => {
          const localProgress = wrapProgress(index / total - scrollProgress);
          const position = getCircularPosition(
            localProgress,
            leftRadiusScaledX,
            leftRadiusScaledY,
            LEFT_ANGLE_OFFSET
          );
          const depth = Math.cos(localProgress * Math.PI * 2 + LEFT_ANGLE_OFFSET);

          gsap.set(node, {
            x: position.x,
            y: position.y,
            zIndex: Math.round(
              gsap.utils.mapRange(DEPTH_MIN, DEPTH_MAX, Z_INDEX_MIN, LEFT_DEPTH_MAX, depth)
            ),
          });
        });

        rightNodes.forEach((node, index) => {
          const localProgress = wrapProgress(index / total - scrollProgress);
          const position = getCircularPosition(
            localProgress,
            rightRadiusScaledX,
            rightRadiusScaledY,
            RIGHT_ANGLE_OFFSET
          );
          const depth = Math.cos(localProgress * Math.PI * 2 + RIGHT_ANGLE_OFFSET);

          gsap.set(node, {
            x: position.x,
            y: position.y,
            zIndex: Math.round(
              gsap.utils.mapRange(DEPTH_MIN, DEPTH_MAX, Z_INDEX_MIN, RIGHT_DEPTH_MAX, depth)
            ),
          });
        });
      };

      render(0);

      // Initial text reveal
      gsap.fromTo(
        leftNodes,
        { opacity: 0 },
        {
          opacity: 1,
          duration: TEXT_REVEAL_DURATION,
          stagger: TEXT_REVEAL_STAGGER,
          ease: "power2.out",
          overwrite: "auto",
        }
      );

      gsap.fromTo(
        rightNodes,
        { opacity: 0 },
        {
          opacity: 1,
          duration: IMAGE_REVEAL_DURATION,
          stagger: IMAGE_REVEAL_STAGGER,
          ease: "power2.out",
          overwrite: "auto",
        }
      );

      // Scroll trigger
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: `+=${sectionHeight * safeItems.length}%`,
        pin: stickyRef.current,
        scrub,
        pinSpacing,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          render(self.progress);
        },
      });

      // Resize sync
      const onResize = () => {
        render(progressRef.current);
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, rootRef);

    return () => ctx.revert();
  }, [
    safeItems,
    scrub,
    pinSpacing,
    sectionHeight,
    leftRadiusX,
    leftRadiusY,
    rightRadiusX,
    rightRadiusY,
    imageCardWidth,
    imageCardHeight,
  ]);

  // Return
  return (
    <section
      ref={rootRef}
      className={`relative min-h-screen w-full overflow-clip bg-black text-white ${className}`}
      style={{
        "--css-title-size": titleSize,
        "--css-card-width": `${imageCardWidth}px`,
        "--css-card-height": `${imageCardHeight}px`,
      }}
    >
      <div ref={stickyRef} className="relative h-screen w-full overflow-hidden max-sm:h-svh">
        <div className="relative mx-auto flex h-full w-full max-sm:flex-col max-sm:px-4 max-sm:py-5">
          <div className="relative flex h-full w-[50vw] translate-x-[-60%] items-center justify-center max-md:translate-x-[-74%] max-sm:h-[40%] max-sm:w-full max-sm:translate-x-[-60%]">
            <div className="relative h-[78vh] max-md:h-[92vh] max-sm:h-full max-sm:w-full">
              {safeItems.map((item) => (
                <div
                  key={item.id}
                  className="circular-scroll-showcase__left-item pointer-events-none absolute left-1/2 top-1/2 w-full origin-center whitespace-nowrap text-center text-(length:--css-title-size,clamp(28px,3vw,56px)) font-medium leading-none tracking-[-0.04em] opacity-0 will-change-transform max-md:text-[clamp(24px,7vw,42px)] max-sm:text-[clamp(22px,8vw,34px)]"
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex h-full w-[50vw] translate-x-[50%] items-center justify-center max-md:translate-x-[64%] max-sm:h-[60%] max-sm:w-full max-sm:translate-x-0 max-sm:translate-y-[40%]">
            <div className="relative h-[78vh] max-md:h-[92vh] max-sm:h-full max-sm:w-full">
              {safeItems.map((item) => (
                <div
                  key={item.id}
                  className="circular-scroll-showcase__right-item absolute left-1/2 top-1/2 h-(--css-card-height,210px) w-(--css-card-width,210px) origin-center opacity-0 ml-[calc(var(--css-card-width,210px)*-0.5)] mt-[calc(var(--css-card-height,210px)*-0.5)] will-change-transform max-md:h-45 max-md:w-40 max-md:-ml-20 max-md:-mt-22.5 max-sm:h-39 max-sm:w-34.5 max-sm:-ml-17.25 max-sm:-mt-19.5"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-[#f5f2eb] shadow-[0_30px_60px_rgba(0,0,0,0.28),0_8px_20px_rgba(0,0,0,0.16)]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="pointer-events-none block h-full w-full select-none object-cover"
                      draggable="false"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
