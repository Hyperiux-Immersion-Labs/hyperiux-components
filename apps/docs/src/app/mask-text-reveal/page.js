import React from "react";
import Image from "next/image";
import MaskAnim from "@/components/TextAnimations/MaskAnim/MaskAnim";
import { ReactLenis } from "lenis/react";

const notes = [
  "Masked line splitting",
  "Scrubbed scroll timing",
  "Gradient edge reveal",
  "Responsive editorial type",
];

const frames = [
  {
    src: "/assets/gradient/image12.png",
    label: "Chromatic sweep",
    className: "rotate-[-5deg] max-sm:rotate-[-2deg]",
  },
  {
    src: "/assets/img/distortion.jpg",
    label: "Liquid texture",
    className: "rotate-[4deg] translate-y-12 max-sm:translate-y-0 max-sm:rotate-[2deg]",
  },
  {
    src: "/assets/gradient/image4.png",
    label: "Soft prism",
    className: "rotate-[-2deg] -translate-y-4 max-sm:translate-y-0",
  },
];

const beats = [
  {
    kicker: "01 / Set the mood",
    title: "Use the mask as a spotlight, not a decoration.",
    body: "Each line enters like a poster being pulled from under studio light. The scroll controls the pace, so the viewer gets to conduct the reveal.",
  },
  {
    kicker: "02 / Shape the rhythm",
    title: "Short lines hit harder when the gradient has room to travel.",
    body: "The animation loves confident typography, broken phrases, and generous spacing. Let the words arrive in layers instead of explaining everything at once.",
  },
  {
    kicker: "03 / Finish loud",
    title: "Make the last reveal feel like a signature.",
    body: "Pair high contrast copy with textured imagery and let the masked text become the final frame of the composition.",
  },
];

const Page = () => {
  return (
    <ReactLenis root>
      <main className="overflow-hidden bg-[#f8f2df] text-[#111111]">
        <section className="relative min-h-screen px-8 py-8 max-sm:px-4 max-sm:py-4">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(17,17,17,0.06)_1px,transparent_1px)] bg-[size:72px_72px] max-sm:bg-[size:38px_38px]" />

          <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-between rounded-[2rem] border border-black/15 bg-[#f8f2df]/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur max-sm:min-h-[calc(100vh-2rem)] max-sm:rounded-[1.25rem] max-sm:p-4">
            <div className="flex items-center justify-between gap-4 text-xs font-black uppercase tracking-[0.28em] max-sm:tracking-[0.18em]">
              <span>Mask Text Reveal</span>
              <span className="rounded-full bg-[#111111] px-4 py-2 text-[#f8f2df] max-sm:px-3">
                Scroll Lab
              </span>
            </div>

            <div className="grid items-end gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] max-sm:gap-8 max-sm:py-10">
              <MaskAnim scrub={true} className="w-full lg:col-span-2">
                <h1 className="w-full text-[clamp(4.5rem,12vw,12.5rem)] font-black uppercase leading-[0.78] text-[#111111] max-sm:text-[4.45rem] max-sm:leading-[0.82]">
                  Pull the words from the noise.
                </h1>
              </MaskAnim>

              <div>
                <div className="mt-8 flex flex-wrap gap-3 max-sm:mt-6">
                  {notes.map((note, index) => (
                    <span
                      key={note}
                      className="border border-black bg-[#f8f2df] px-4 py-2 text-sm font-black uppercase shadow-[5px_5px_0_#111111] max-sm:px-3 max-sm:text-[0.68rem]"
                      style={{
                        transform: `rotate(${[-2, 1.5, -1, 2][index]}deg)`,
                        backgroundColor: ["#f8f2df", "#d7ff48", "#ff6b4a", "#7dd3fc"][index],
                      }}
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[560px] max-sm:min-h-[430px]">
                {frames.map(({ src, label, className }, index) => (
                  <figure
                    key={src}
                    className={`absolute overflow-hidden border-2 border-black bg-white shadow-[12px_12px_0_#111111] ${className} ${
                      index === 0
                        ? "left-2 top-4 h-72 w-64 max-sm:left-0 max-sm:top-2 max-sm:h-52 max-sm:w-[48%]"
                        : index === 1
                          ? "right-0 top-24 h-80 w-72 max-sm:right-0 max-sm:top-24 max-sm:h-56 max-sm:w-[52%]"
                          : "bottom-4 left-20 h-64 w-80 max-sm:bottom-6 max-sm:left-7 max-sm:h-44 max-sm:w-[72%]"
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 72vw, 320px"
                      className="object-cover"
                    />
                    <figcaption className="absolute bottom-3 left-3 bg-[#111111] px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-white max-sm:text-[0.58rem]">
                      {label}
                    </figcaption>
                  </figure>
                ))}

                <div className="absolute bottom-16 right-8 grid h-28 w-28 place-items-center rounded-full border-2 border-black bg-[#d7ff48] text-center text-xs font-black uppercase leading-tight shadow-[8px_8px_0_#111111] max-sm:bottom-0 max-sm:right-2 max-sm:h-24 max-sm:w-24 max-sm:text-[0.62rem]">
                  line by line reveal
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-8 py-28 max-sm:px-4 max-sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="sticky top-8 h-fit max-sm:static">
              <p className="mb-5 inline-block border border-black bg-[#ff6b4a] px-4 py-2 text-xs font-black uppercase tracking-[0.26em] shadow-[5px_5px_0_#111111]">
                Creative use case
              </p>
              <MaskAnim scrub={true}>
                <h2 className="text-6xl font-black uppercase leading-[0.88] max-sm:text-[3.25rem]">
                  Design the scroll like a mixtape.
                </h2>
              </MaskAnim>
            </div>

            <div className="space-y-8">
              {beats.map(({ kicker, title, body }, index) => (
                <article
                  key={kicker}
                  className={`border-2 border-black p-8 shadow-[10px_10px_0_#111111] max-sm:p-5 ${
                    ["bg-white", "bg-[#7dd3fc]", "bg-[#111111] text-white"][index]
                  }`}
                >
                  <p className="mb-8 text-xs font-black uppercase tracking-[0.3em] max-sm:mb-5 max-sm:tracking-[0.18em]">
                    {kicker}
                  </p>
                  <MaskAnim scrub={true}>
                    <h3 className="text-5xl font-black uppercase leading-[0.95] max-sm:text-[2.35rem]">
                      {title}
                    </h3>
                  </MaskAnim>
                  <p className={`mt-6 max-w-2xl text-lg leading-8 max-sm:text-base max-sm:leading-7 ${index === 2 ? "text-white/75" : "text-black/70"}`}>
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative min-h-screen bg-[#111111] px-8 py-24 text-white max-sm:px-4 max-sm:py-16">
          <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.85fr] max-sm:min-h-[auto]">
            <div>
              <div className="mb-8 flex flex-wrap gap-3">
                {["poster copy", "hero headlines", "launch pages", "story sections"].map((item) => (
                  <span
                    key={item}
                    className="border border-white/25 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/80 max-sm:text-[0.62rem]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <MaskAnim scrub={true}>
                <p className="text-[clamp(3.5rem,8vw,9rem)] font-black uppercase leading-[0.86] text-white max-sm:text-[3.35rem]">
                  Hide the sentence until the screen asks for it.
                </p>
              </MaskAnim>
            </div>

            <div className="relative overflow-hidden border-2 border-white/80 bg-[#f8f2df] p-4 text-[#111111] shadow-[14px_14px_0_#d7ff48] max-sm:p-3">
              <Image
                src="/assets/img/image08.jpg"
                alt=""
                width={3840}
                height={2160}
                sizes="(max-width: 640px) 100vw, 42vw"
                className="h-[520px] w-full object-cover saturate-150 max-sm:h-72"
              />
              <div className="absolute left-7 top-7 max-w-64 bg-[#f8f2df] p-4 text-sm font-black uppercase leading-tight shadow-[6px_6px_0_#111111] max-sm:left-5 max-sm:top-5 max-sm:max-w-48 max-sm:text-[0.72rem]">
                A reveal animation for headlines that need drama without losing readability.
              </div>
            </div>
          </div>
        </section>
      </main>
    </ReactLenis>
  );
};

export default Page;
