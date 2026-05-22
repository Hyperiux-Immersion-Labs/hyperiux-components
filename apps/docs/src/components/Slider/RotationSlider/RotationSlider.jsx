"use client";
import React, { useRef, useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import RotationCard from "./RotationCard";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function RotationSlider({ images }) {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const wrappersRef = useRef([]);
  const textsRef = useRef([]);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const update = () => {
      const travel = track.scrollWidth - window.innerWidth;
      outer.style.height = `${travel + window.innerHeight}px`;
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [images]);

  useIsomorphicLayoutEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const isMobile = window.innerWidth < 640;

    let ctx = gsap.context(() => {
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

      let activeIndex = -1;

      const animateTextIn = (index) => {
        if (activeIndex === index) return;

        if (activeIndex !== -1 && textsRef.current[activeIndex]) {
          const prevText = textsRef.current[activeIndex];
          gsap.killTweensOf(prevText.querySelectorAll("div"));
          gsap.to(prevText, { opacity: 0, duration: 0.3 });
        }

        activeIndex = index;
        const currentText = textsRef.current[index];
        if (currentText && currentText.innerText.trim() !== "") {
          gsap.set(currentText, { opacity: 1 });
          const split = new SplitText(currentText, { type: "chars,words" });

          gsap.fromTo(split.chars,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.01, ease: "power2.out", onComplete: () => split.revert() }
          );
        }
      };

      cardsRef.current.forEach((card, index) => {
        const wrapper = wrappersRef.current[index];
        if (!card || !wrapper) return;

        const total = images.length;
        const mid = Math.floor(total / 2);
        const step = isMobile ? 2 : 10;
        let offset;
        if (index < mid) {
          offset = -((mid - index) * step);
        } else {
          offset = (index - mid + 1) * step;
        }

        const rotateXValue = offset < 0 ? 5 : -5;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            containerAnimation: horizontalTween,
            start: "left 90%",
            end: "right 10%",
            scrub: true,
          },
        });

        ScrollTrigger.create({
          trigger: wrapper,
          containerAnimation: horizontalTween,
          start: "center 55%",
          end: "center 45%",
          onEnter: () => animateTextIn(index),
          onEnterBack: () => animateTextIn(index),
        });

        tl.fromTo(card,
          {
            rotateY: isMobile ? -60 : -100,
            rotateX: rotateXValue,
            opacity: 0.8,
            y: `${offset}vh`,
          },
          {
            rotateY: 0,
            rotateX: 0,
            opacity: 1,
            y: 0,
            ease: "none",
          }
        )
          .to(card, {
            rotateY: isMobile ? 50 : 80,
            opacity: 0.9,
            y: `${-offset}vh`,
            ease: "none",
          });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [images]);

  return (
    <div
      ref={outerRef}
      className="relative bg-white"
    >
      <div className="fixed bottom-10 left-10 max-sm:bottom-5 max-sm:left-4 z-50 pointer-events-none">
        {images.map((img, i) => (
          <div
            key={i}
            ref={(el) => (textsRef.current[i] = el)}
            className="absolute bottom-0 left-0 text-2xl max-sm:text-base whitespace-nowrap opacity-0 text-neutral-900"
          >
            {img.text || `Image ${i + 1}`}
          </div>
        ))}
      </div>
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center"
        style={{ perspective: "1200px" }}
      >
    
<div
  ref={trackRef}
  className="
    flex items-center h-full will-change-transform
    gap-[5vw] max-sm:gap-[12vw]
    pl-[31vw] pr-[31vw]
    max-sm:pl-[12vw] max-sm:pr-[12.5vw]
  "
  style={{
    transformStyle: "preserve-3d",
  }}
>
        
          {images.map((img, i) => (
            <div
              key={i}
              ref={(el) => (wrappersRef.current[i] = el)}
              className="relative shrink-0 w-[38vw] h-[45vh] max-sm:w-[75vw] max-sm:h-[35vh] flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              <RotationCard
                ref={(el) => (cardsRef.current[i] = el)}
                src={img.src}
                index={i}
                total={images.length}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}