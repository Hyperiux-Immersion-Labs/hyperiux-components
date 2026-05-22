import React from "react";
import Image from "next/image";
import PerspectiveAnim from "@/components/TextAnimations/PerspectiveAnim/PerspectiveAnim";
import { ReactLenis } from "lenis/react";

const specs = [
  ["Start", "top 90%"],
  ["Motion", "rotateX"],
  ["Depth", "800px"],
  ["Stagger", "0.08s"],
];

const scenes = [
  {
    title: "A headline can feel like it has a camera angle.",
    copy: "The line starts above the frame, tilted back in space, then settles toward the reader with a clean perspective flip.",
  },
  {
    title: "Use it when the reveal should feel dimensional.",
    copy: "Launch pages, immersive stories, case studies, and hero transitions can all use this effect to create a stronger sense of arrival.",
  },
  {
    title: "Keep the layout calm so the rotation reads clearly.",
    copy: "Large line height, high contrast, and a little breathing room let the 3D motion become the star without making the page noisy.",
  },
];

const Page = () => {
  return (
    <ReactLenis root>
      <main className="overflow-hidden bg-[#07090d] text-white">
        <section className="relative min-h-screen px-8 py-8 max-sm:px-4 max-sm:py-4">
          <div className="absolute inset-0">
            <Image
              src="/assets/gradient/image7.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,13,0.95),rgba(7,9,13,0.58),rgba(7,9,13,0.9))]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,#07090d,transparent)]" />
          </div>

          <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-rows-[auto_1fr_auto] max-sm:min-h-[calc(100vh-2rem)]">
            <header className="flex items-center justify-between border-b border-white/15 py-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/70 max-sm:flex-col max-sm:items-start max-sm:gap-2 max-sm:tracking-[0.16em]">
              <span>Perspective Text Reveal</span>
              <span>Spatial line entrance</span>
            </header>

            <div className="grid items-center gap-10 py-14 lg:grid-cols-[0.95fr_1.05fr] max-sm:py-10">
              <div className="max-w-3xl">
                <p className="mb-7 w-fit border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#b9e6ff] backdrop-blur max-sm:text-[0.64rem] max-sm:tracking-[0.16em]">
                  3D reveal system
                </p>

                <PerspectiveAnim scrub={true}>
                  <h1 className="text-[clamp(4rem,10vw,10.5rem)] font-black uppercase leading-[0.84] text-white max-sm:text-[3.65rem] max-sm:leading-[0.88]">
                    Lines fall into depth.
                  </h1>
                </PerspectiveAnim>
              </div>

              <div className="relative min-h-140 max-sm:min-h-95">
                <div className="absolute left-6 right-10 top-8 h-28 skew-y-[-5deg] border border-white/25 bg-white/10 backdrop-blur max-sm:left-2 max-sm:right-6 max-sm:h-20" />
                <div className="absolute left-16 right-6 top-40 h-36 skew-y-[-5deg] border border-[#b9e6ff]/50 bg-[#b9e6ff]/20 backdrop-blur max-sm:left-8 max-sm:right-2 max-sm:top-28 max-sm:h-24" />
                <div className="absolute bottom-16 left-24 right-0 h-48 skew-y-[-5deg] overflow-hidden border border-white/35 bg-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] max-sm:bottom-12 max-sm:left-10 max-sm:h-36">
                  <Image
                    src="/assets/parallax-img/p-img-2.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 86vw, 560px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[#07090d]/25" />
                </div>
                <div className="absolute bottom-0 left-0 max-w-sm border-l border-[#b9e6ff] bg-[#07090d]/80 p-6 backdrop-blur max-sm:max-w-[78%] max-sm:p-4">
                  <p className="text-lg font-semibold leading-8 text-white/76 max-sm:text-sm max-sm:leading-6">
                    Built for moments where typography should rotate into view like a scene finding its angle.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid border-y border-white/15 sm:grid-cols-4">
              {specs.map(([label, value]) => (
                <div
                  key={label}
                  className="border-white/15 py-5 px-4  max-sm:border-t max-sm:first:border-t-0 sm:border-r sm:last:border-r-0"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/38 max-sm:tracking-[0.16em]">
                    {label}
                  </p>
                  <p className="mt-2 text-2xl font-black uppercase text-[#b9e6ff] max-sm:text-xl">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#e9eef2] px-8 py-28 text-[#101419] max-sm:px-4 max-sm:py-18">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="lg:pt-20">
              <p className="mb-6 text-xs font-black uppercase tracking-[0.28em] text-[#516172] max-sm:tracking-[0.16em]">
                Why perspective
              </p>
              <PerspectiveAnim scrub={true}>
                <h2 className="text-6xl font-black uppercase leading-[0.9] max-sm:text-[3.05rem]">
                  It turns text into a foreground object.
                </h2>
              </PerspectiveAnim>
            </div>

            <div className="space-y-8">
              {scenes.map(({ title, copy }, index) => (
                <article
                  key={title}
                  className="grid gap-8 border-t border-[#101419]/20 pt-8 md:grid-cols-[9rem_1fr] max-sm:gap-4"
                >
                  <div className="text-sm font-black uppercase tracking-[0.24em] text-[#516172] max-sm:tracking-[0.16em]">
                    Scene 0{index + 1}
                  </div>
                  <div>
                    <PerspectiveAnim scrub={true}>
                      <h3 className="text-5xl font-black uppercase leading-[0.95] max-sm:text-[2.4rem]">
                        {title}
                      </h3>
                    </PerspectiveAnim>
                    <p className="mt-5 max-w-2xl text-lg leading-8 text-[#101419]/66 max-sm:text-base max-sm:leading-7">
                      {copy}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-[#07090d] px-8 py-24 max-sm:px-4 max-sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-170 overflow-hidden max-sm:min-h-105">
              <Image
                src="/assets/gradient/image13.png"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,9,13,0.82),rgba(7,9,13,0.05))]" />
              <div className="absolute bottom-8 left-8 right-8 max-sm:bottom-5 max-sm:left-5 max-sm:right-5">
                <PerspectiveAnim scrub={true}>
                  <p className="text-6xl font-black uppercase leading-[0.9] text-white max-sm:text-[2.85rem]">
                    Flip each line into place.
                  </p>
                </PerspectiveAnim>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-8 border border-white/15 p-8 max-sm:p-5">
              <div>
                <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-[#b9e6ff] max-sm:tracking-[0.16em]">
                  Best used for
                </p>
                <PerspectiveAnim scrub={true}>
                  <h2 className="text-5xl font-black uppercase leading-[0.92] max-sm:text-[2.65rem]">
                    Immersive hero sections, chapter breaks, and scroll stories.
                  </h2>
                </PerspectiveAnim>
              </div>

              <p className="max-w-md text-lg leading-8 text-white/62 max-sm:text-base max-sm:leading-7">
                The animation already creates the depth. This layout gives it a quiet stage, a few spatial layers, and enough contrast for the perspective to stay crisp on every viewport.
              </p>
            </div>
          </div>
        </section>
      </main>
    </ReactLenis>
  );
};

export default Page;
