import React from "react";
import Image from "next/image";
import OverFlowStagAnim from "@/components/TextAnimations/OverFlowStagAnim/OverFlowStagAnim";
import { ReactLenis } from "lenis/react";

const details = [
  { label: "Split", value: "characters" },
  { label: "Motion", value: "up + rotate" },
  { label: "Trigger", value: "scroll scrub" },
];

const lines = [
  "Launch copy",
  "Section titles",
  "Editorial quotes",
  "Product drops",
];

const notes = [
  "Characters start below the visible line.",
  "Overflow clipping keeps the reveal clean.",
  "A small stagger turns text into rhythm.",
];

const Page = () => {
  return (
    <ReactLenis root>
      <main className="overflow-hidden bg-[#f4efe6] text-[#151515]">
        <section className="min-h-screen px-8 py-8 max-sm:px-4 max-sm:py-4">
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-rows-[auto_1fr_auto] border border-[#151515]/15 bg-[#fbf8f1] max-sm:min-h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between border-b border-[#151515]/15 px-6 py-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#151515]/60 max-sm:flex-col max-sm:items-start max-sm:gap-2 max-sm:px-4 max-sm:tracking-[0.16em]">
              <span>Overflow Stagger Text</span>
              <span>Character reveal system</span>
            </div>

            <div className="grid items-center gap-10 px-6 py-14 lg:grid-cols-[1.08fr_0.92fr] max-sm:px-4 max-sm:py-10">
              <div>
                <p className="mb-6 w-fit rounded-full bg-[#151515] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#fbf8f1] max-sm:text-[0.64rem]">
                  Staggered overflow
                </p>

                <OverFlowStagAnim scrub={true}>
                  <h1 className="max-w-5xl text-[clamp(4rem,10vw,10rem)] font-black uppercase leading-[0.82] tracking-normal text-[#151515] max-sm:text-[3.8rem] max-sm:leading-[0.86]">
                    Text that steps into frame.
                  </h1>
                </OverFlowStagAnim>
              </div>

              <div className="grid gap-6">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#dbeafe] max-sm:aspect-[16/11]">
                  <Image
                    src="/assets/gradient/image14.png"
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[#151515] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#fbf8f1] max-sm:text-[0.68rem]">
                    Overflow hidden / characters visible
                  </div>
                </div>

                <p className="max-w-md text-lg leading-8 text-[#151515]/68 max-sm:text-base max-sm:leading-7">
                  A clean text reveal where each character rises from a clipped line with a tiny rotation. It feels playful, but the layout stays calm.
                </p>
              </div>
            </div>

            <div className="grid border-t border-[#151515]/15 sm:grid-cols-3">
              {details.map(({ label, value }) => (
                <div
                  key={label}
                  className="border-[#151515]/15 px-6 py-5 max-sm:px-4 sm:border-r sm:last:border-r-0"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#151515]/45 max-sm:tracking-[0.16em]">
                    {label}
                  </p>
                  <p className="mt-2 text-xl font-black uppercase max-sm:text-lg">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-8 py-24 max-sm:px-4 max-sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <OverFlowStagAnim scrub={true}>
                <h2 className="text-6xl font-black uppercase leading-[0.9] max-sm:text-[3.15rem]">
                  Use it where words need a first step.
                </h2>
              </OverFlowStagAnim>
            </div>

            <div className="grid gap-3">
              {lines.map((line) => (
                <OverFlowStagAnim key={line} scrub={true}>
                  <p className="border-b border-[#151515]/15 py-5 text-5xl font-black uppercase leading-none text-[#151515] max-sm:py-4 max-sm:text-[2.45rem]">
                    {line}
                  </p>
                </OverFlowStagAnim>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#151515] px-8 py-24 text-[#fbf8f1] max-sm:px-4 max-sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[520px] overflow-hidden max-sm:min-h-[320px]">
              <Image
                src="/assets/img/distortion.jpg"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 54vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#151515]/20" />
            </div>

            <div className="flex flex-col justify-between gap-12">
              <OverFlowStagAnim scrub={true}>
                <h2 className="text-6xl font-black uppercase leading-[0.9] max-sm:text-[3.1rem]">
                  Simple setup, expressive entrance.
                </h2>
              </OverFlowStagAnim>

              <div className="space-y-5">
                {notes.map((note, index) => (
                  <p
                    key={note}
                    className="border-t border-white/20 pt-5 text-lg leading-8 text-white/70 max-sm:text-base max-sm:leading-7"
                  >
                    <span className="mr-4 font-black text-[#f8d84a]">0{index + 1}</span>
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </ReactLenis>
  );
};

export default Page;
