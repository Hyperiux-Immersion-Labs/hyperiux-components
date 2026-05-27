"use client";

import GlassGradientScene from "@/components/HyperiuxGlassHeroConcept";
import HyperiuxGlassHeroConcept from "@/components/HyperiuxGlassHeroConcept/SecondSection";
import gsap from "gsap";
import { ReactLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const SCROLL_CONFIG = {
  trigger: ".container",
  start: "top top",
  end: "bottom bottom",
  scrub: true,
};

export default function Page() {
  const secondSectionRef = useRef(null);

  const [firstVariant, setFirstVariant] = useState("glass");
  const [firstBackgroundVariant, setFirstBackgroundVariant] = useState("video");

  const [secondVariant, setSecondVariant] = useState("glass");
  const [secondBackgroundVariant, setSecondBackgroundVariant] =
    useState("gradient");

  useEffect(() => {
    if (!secondSectionRef.current) return;

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
      gsap.set(".first-split .split-line", {
        yPercent: -10,
      });
      gsap.set(secondSectionRef.current, {
        clipPath: "polygon(130% 100%, 130% 100%, 130% 100%, 130% 100%)",
      });

      gsap.set(secondSplit.lines, {
        yPercent: 100,
      });

      gsap.to(firstSplit.lines, {
        yPercent: -120,
        stagger: 0.03,
        ease: "power1.in",
        scrollTrigger: {
          trigger: ".container",
          start: "top top",
          end: "50% bottom",
          scrub: true,
        },
      });

      gsap.to(secondSplit.lines, {
        yPercent: -10,
        stagger: 0.03,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".container",
          start: "60% bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });

      gsap.to(secondSectionRef.current, {
        clipPath: "polygon(-270% 100%, 100% -40%, 130% 100%, 0% 130%)",
        ease: "none",
        scrollTrigger: SCROLL_CONFIG,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <ReactLenis root>
      <div className="container h-[300vh]">
        <section className="hero first-section-portal sticky top-0 h-screen w-screen bg-black">
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
              <h1 className="first-split font-aeonik! flex flex-col text-[7.8vw] leading-[1.1]! text-white pb-[4vw]">
                <span>Digital</span>
                <span>Experience</span>
                <span>Design Agency</span>
              </h1>

              <p className="first-split mt-[-1vw] w-[35%] text-[1.05vw] text-white">
               Harnessing the power of Emotion, Design, Technology & Neuromarketing, we create Digital Brand Experiences that propel your success in the enigmatic realm of bits & bytes.
              </p>
            </div>
          </div>
        </section>

        <section
          ref={secondSectionRef}
          className="second-section-portal sticky top-0 mt-[-100%] h-screen w-screen overflow-hidden bg-black"
        >
          <div className="h-full w-full">
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

            <div className="pointer-events-none absolute inset-0 z-2 flex h-full w-full items-center justify-end px-[5vw]">
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

                <p className="second-split mt-8 text-[1.45vw] w-[85%] leading-[1.4] text-black/65">
                  What you just experienced is called bionic reading. Learn more
                  about it here.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
}
