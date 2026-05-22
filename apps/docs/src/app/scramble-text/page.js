import React from "react";
import ScrambleText from "@/components/TextAnims/ScrambleText";
import ParallaxAnim from "@/components/ParallaxAnim/ParallaxAnim";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";

const notes = [
  "Characters resolve from noise",
  "Runs once on scroll enter",
  "Useful for sharp editorial moments",
];

const Page = () => {
  return (
    <>
      <LenisSmoothScroll />
      <main className="overflow-hidden bg-[#f6f2ea] text-[#121212]">
        <section className="min-h-screen px-8 py-8 max-sm:px-4 max-sm:py-4">
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 border border-black/10 bg-[#fbf8f1] p-8 lg:grid-cols-[1.05fr_0.95fr] max-sm:min-h-[calc(100vh-2rem)] max-sm:p-4">
            <div>
              <p className="mb-6 text-xs font-bold uppercase tracking-[0.24em] text-black/45 max-sm:tracking-[0.16em]">
                Scramble Text
              </p>
              <ScrambleText
                text="Signal appears when the noise decides to leave."
                textSize="text-[6vw] max-sm:text-[3.25rem]"
                textColor="text-[#121212]"
                align="left"
                className="font-black uppercase leading-[0.88] max-sm:leading-[0.92]"
              />
              <p className="mt-8 max-w-xl text-lg leading-8 text-black/60 max-sm:text-base max-sm:leading-7">
                A minimal scroll reveal for headlines that should feel like they are decoding themselves in real time.
              </p>
            </div>

            <div className="relative">
              <ParallaxAnim
                src="/assets/img/distortion.jpg"
                alt="Abstract distortion texture"
                width={800}
                height={800}
                translateY="-14%"
                wrapperClassName="h-[620px] w-full bg-black max-sm:h-[360px]"
                imageClassName="h-[122%] opacity-90"
              />
              <div className="absolute bottom-5 left-5 right-5 bg-[#fbf8f1] px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black max-sm:text-[0.68rem] max-sm:tracking-[0.12em]">
                Decode / Resolve / Reveal
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 py-24 max-sm:px-4 max-sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <ParallaxAnim
              src="/assets/gradient/image11.png"
              alt="Gradient texture"
              width={2070}
              height={1380}
              translateY="-12%"
              wrapperClassName="h-[520px] w-full max-sm:h-[300px]"
              imageClassName="h-[120%]"
            />

            <div className="flex flex-col justify-center">
              <ScrambleText
                text="Use it for launch lines, secretive labels, and text that needs a little suspense."
                textSize="text-5xl max-sm:text-[2.8rem]"
                textColor="text-[#121212]"
                align="left"
                className="font-black uppercase leading-[0.94]"
              />

              <div className="mt-10 grid gap-4">
                {notes.map((note, index) => (
                  <div
                    key={note}
                    className="border-t border-black/15 pt-4 text-lg leading-7 text-black/65 max-sm:text-base"
                  >
                    <span className="mr-4 font-black text-black">0{index + 1}</span>
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Page;
