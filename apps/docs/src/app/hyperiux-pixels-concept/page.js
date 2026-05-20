"use client";

import GlassGradientScene from "@/components/HyperiuxGlassHeroConcept";
import HyperiuxGlassHeroConcept from "@/components/HyperiuxGlassHeroConcept/SecondSection";
import gsap from "gsap";
import { ReactLenis } from "lenis/react";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const COLS = 20;
const ROWS = 12;
const TOTAL = COLS * ROWS;

function seededRandom(seed) {
  let value = seed;

  return function () {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function getDiagonalOrder(seed = 89) {
  const random = seededRandom(seed);

  return Array.from({ length: TOTAL }, (_, index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;

    const bottomRightBias = row * 1.6 + col * 0.55;

    const randomNoise = random() * 2.5;

    const localClusterNoise =
      Math.sin(row * 2.17 + col * 1.31) * 2.5 +
      Math.cos(row * 1.73 - col * 2.41) * 2.5;

    const score = bottomRightBias + randomNoise + localClusterNoise;

    return {
      index,
      row,
      col,
      score,
    };
  }).sort((a, b) => b.score - a.score);
}

export default function Page() {
  const maskRectsRef = useRef([]);

  const squareOrder = useMemo(() => getDiagonalOrder(), []);

  const [firstVariant, setFirstVariant] = useState("glass");
  const [firstBackgroundVariant, setFirstBackgroundVariant] = useState("video");

  const [secondVariant, setSecondVariant] = useState("glass");
  const [secondBackgroundVariant, setSecondBackgroundVariant] =
    useState("gradient");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const firstSplit = new SplitText(".first-split", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
      });

      const secondSplit = new SplitText(".second-split", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
      });

      const orderedMaskRects = squareOrder
        .map((item) => maskRectsRef.current[item.index])
        .filter(Boolean);

      gsap.set(".first-split .split-line", {
        yPercent: -10,
      });

      gsap.set(secondSplit.lines, {
        yPercent: 100,
      });

      gsap.set(orderedMaskRects, {
        opacity: 1,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".container",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      tl.to(
        firstSplit.lines,
        {
          yPercent: -120,
          stagger: 0.03,
          duration:0.5,
          ease: "power2.inOut",
        },
        0
      );

      tl.to(
        orderedMaskRects,
        {
          opacity: 0,
          duration: 0.05,
          stagger: {
            each: 0.005,
          },
          ease: "none",
        },
        0.12
      );

      tl.to(
        secondSplit.lines,
        {
          yPercent: -10,
          stagger: 0.03,
          ease: "power2.inOut",
        },
        0.55
      );
    });

    return () => ctx.revert();
  }, [squareOrder]);

  return (
    <ReactLenis root>
      <div className="container h-[300vh] bg-black">
        <div className="sticky top-0 h-screen w-screen overflow-hidden bg-black">
          <svg
            className="pointer-events-none absolute h-0 w-0"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <defs>
              <mask
                id="first-section-grid-mask"
                maskUnits="objectBoundingBox"
                maskContentUnits="objectBoundingBox"
              >
                <rect x="0" y="0" width="1" height="1" fill="black" />

                {Array.from({ length: TOTAL }).map((_, index) => {
                  const row = Math.floor(index / COLS);
                  const col = index % COLS;

                  return (
                    <rect
                      key={index}
                      ref={(el) => {
                        maskRectsRef.current[index] = el;
                      }}
                      className="mask-cell"
                      x={col / COLS}
                      y={row / ROWS}
                      width={1 / COLS + 0.001}
                      height={1 / ROWS + 0.001}
                      fill="white"
                      opacity="1"
                    />
                  );
                })}
              </mask>
            </defs>
          </svg>

          <section className="second-section-portal absolute inset-0 z-10 h-screen w-screen overflow-hidden bg-white">
            <HyperiuxGlassHeroConcept
              variant={secondVariant}
              setVariant={setSecondVariant}
              backgroundVariant={secondBackgroundVariant}
              setBackgroundVariant={setSecondBackgroundVariant}
              modelPosition={[-0.9, -0.5, 1.4]}
              showControls={false}
              modelThickness={1.25}
              modelScale={0.07}
              modelSrc="/assets/models/hyperiexLogoNo2.glb"
              videoSrc="/assets/models/bg-video.mp4"
            />

            <div className="pointer-events-none absolute inset-0 z-30 flex h-full w-full items-center justify-end px-[5vw]">
              <div className="w-[47%] text-[#111111]">
                <p className="second-split mb-5 text-sm uppercase text-black/50">
                  About Us
                </p>

                <h2 className="second-split font-aeonik! text-[3.2vw] leading-[1]">
                  From Concept to Conversion We're Changing the Face of Web.
                </h2>

                <p className="second-split mt-8 ml-4 text-[1.35vw] leading-[1.5] text-black/65">
                  We unravel complex design challenges through meticulous user
                  research, expert analysis, prototyping, and collaborative
                  design with users and stakeholders. Harnessing the power of
                  cutting-edge tools and our proprietary approach we craft
                  delightful and intuitive experiences.
                </p>

                <p className="second-split mt-8 w-[85%] text-[1.45vw] leading-[1.4] text-black/65">
                  What you just experienced is called bionic reading. Learn more
                  about it here.
                </p>
              </div>
            </div>
          </section>

          <section
            className="first-section-portal absolute inset-0 z-20 h-screen w-screen bg-black pointer-events-none"
            style={{
              WebkitMaskImage: "url(#first-section-grid-mask)",
              maskImage: "url(#first-section-grid-mask)",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <div className="relative h-screen w-full overflow-hidden">
              <GlassGradientScene
                variant={firstVariant}
                setVariant={setFirstVariant}
                backgroundVariant={firstBackgroundVariant}
                setBackgroundVariant={setFirstBackgroundVariant}
                showControls={false}
                modelSrc="/assets/models/hyperiexLogoNo2.glb"
                videoSrc="/assets/models/bg-video.mp4"
                modelScale={0.07}
                modelThickness={1.25}
                modelPosition={[0, 0, 1.4]}
                modelRotation={[0, 0, 0]}
              />

              <div className="pointer-events-none absolute inset-0 z-2 flex h-full w-full items-end justify-between px-[5vw] pb-[5%]">
                <h1 className="first-split font-aeonik! flex flex-col pb-[4vw] text-[7.8vw] leading-[1.1]! text-white">
                  <span>Digital</span>
                  <span>Experience</span>
                  <span>Design Agency</span>
                </h1>

                <p className="first-split mt-[-1vw] w-[35%] text-[1.05vw] text-white">
                  Harnessing the power of Emotion, Design, Technology &
                  Neuromarketing, we create Digital Brand Experiences that
                  propel your success in the enigmatic realm of bits & bytes.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ReactLenis>
  );
}