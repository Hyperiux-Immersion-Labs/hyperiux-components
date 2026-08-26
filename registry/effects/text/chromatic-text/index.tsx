"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ChromaticTextProps = {
  baseTextColor?: string;
  firstTextColor?: string;
  secondTextColor?: string;
  fontSize?: number;
  fontWeight?: CSSProperties["fontWeight"];
  backgroundColor?: string;
  className?: string;
};

const DEFAULT_TEXT = "Scroll to See Chromatic Effect";

const ChromaticText = ({
  baseTextColor = "#ffffff",
  firstTextColor = "#FFB200",
  secondTextColor = "#EB5B00",
  fontSize = 10,
  fontWeight = 500,
  backgroundColor = "#111111",
  className = "",
}: ChromaticTextProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const textOneRef = useRef<HTMLHeadingElement | null>(null);
  const textTwoRef = useRef<HTMLParagraphElement | null>(null);
  const textThreeRef = useRef<HTMLParagraphElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const layerClassName =
    "absolute inset-0 m-auto flex h-fit w-full max-w-[12ch] items-center justify-center px-4 text-center leading-[0.9]";
  const textStyle = {
    fontSize: `${fontSize}vw`,
    fontWeight,
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const textOne = textOneRef.current;
    const textTwo = textTwoRef.current;
    const textThree = textThreeRef.current;

    if (!root || !textOne) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(textOne, { x: 0, y: 0, opacity: 1 });
        return;
      }

      if (!textTwo || !textThree) return;

      gsap.set([textOne, textTwo, textThree], {
        x: 0,
        y: 0,
        opacity: 1,
      });

      let resetCall: gsap.core.Tween | undefined;

      ScrollTrigger.create({
        trigger: root,
        start: "10% top",
        end: "bottom 10%",
        onUpdate: (self) => {
          const direction = self.direction === 1 ? -1 : 1;
          const velocity = Math.min(Math.abs(self.getVelocity()) / 100, 44);
          const isDesktop = window.innerWidth > 1024;
          const whiteDepth = isDesktop ? 0.7 : 0.45;
          const redDepth = isDesktop ? 1.9 : 1.3;
          const blueDepth = isDesktop ? 3.6 : 2.2;

          resetCall?.kill();

          gsap.to(textOne, {
            x: 0,
            y: direction * velocity * whiteDepth,
            duration: 0.08,
            overwrite: true,
          });

          gsap.to(textTwo, {
            x: 2,
            y: direction * velocity * redDepth,
            duration: 0.1,
            overwrite: true,
          });

          gsap.to(textThree, {
            x: -2,
            y: direction * velocity * blueDepth,
            duration: 0.16,
            overwrite: true,
          });

          resetCall = gsap.delayedCall(0.2, () => {
            gsap.to([textOne, textTwo, textThree], {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            });
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={rootRef}
      className={`relative flex h-[150vh] w-full items-center justify-center px-7 ${className}`}
      style={{ backgroundColor }}
    >
      <div className="sticky top-0 flex h-screen w-full items-end justify-center overflow-hidden px-4">
        <p
          ref={textOneRef}
          className={`${layerClassName} z-20`}
          style={{ ...textStyle, color: baseTextColor }}
        >
          {DEFAULT_TEXT}
        </p>

        {!prefersReducedMotion && (
          <>
            <p
              ref={textTwoRef}
              aria-hidden="true"
              className={`pointer-events-none ${layerClassName} z-10 motion-reduce:hidden`}
              style={{ ...textStyle, color: firstTextColor }}
            >
              {DEFAULT_TEXT}
            </p>

            <p
              ref={textThreeRef}
              aria-hidden="true"
              className={`pointer-events-none ${layerClassName} z-0 motion-reduce:hidden`}
              style={{ ...textStyle, color: secondTextColor }}
            >
              {DEFAULT_TEXT}
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default ChromaticText;
