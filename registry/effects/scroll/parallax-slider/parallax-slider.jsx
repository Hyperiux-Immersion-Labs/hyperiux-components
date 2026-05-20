"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SLIDE_WIDE = 65;
const SLIDE_NARROW = 33;
const GAP = 1.6;
const PAD_X = "5vw";

export default function ParallaxSlider({ images = [], bgColor = "#000000" }) {
  const outerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const update = () => {
      const travel = track.scrollWidth - window.innerWidth;
      outer.style.height = `${travel + window.innerHeight}px`;
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(track);
    window.addEventListener("resize", update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [images]);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const context = gsap.context(() => {
      const horizontalTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.fromTo(
        ".parallax-slider__slide",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "power3.inOut",
          duration: 0.6,
          scrollTrigger: {
            trigger: outer,
            start: "5% bottom",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.utils.toArray(".parallax-slider__image").forEach((element) => {
        gsap.fromTo(
          element,
          { x: "-25%", scale: 1.25 },
          {
            x: "25%",
            scale: 1.25,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              containerAnimation: horizontalTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    }, outer);

    return () => context.revert();
  }, [images]);

  return (
    <div
      ref={outerRef}
      className="relative"
      style={{ height: "400vh", backgroundColor: bgColor }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center will-change-transform"
          style={{
            gap: `${GAP}vw`,
            paddingLeft: PAD_X,
            paddingRight: PAD_X,
          }}
        >
          {images.map((src, index) => {
            const isWide = index % 2 === 0;
            const width = isWide ? SLIDE_WIDE : SLIDE_NARROW;
            const slideClass = isWide
              ? "h-[43vw] w-[65vw] max-sm:h-[50vh] max-sm:w-[80vw]"
              : "h-[43vw] w-[33vw] max-sm:h-[50vh] max-sm:w-[45vw]";

            return (
              <div
                key={src}
                className={`parallax-slider__slide relative shrink-0 overflow-hidden ${slideClass}`}
                style={{ clipPath: "inset(0 100% 0 0)" }}
              >
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
                  sizes={`${width}vw`}
                  className="parallax-slider__image object-cover"
                  priority={index < 3}
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
