import React from 'react'
import RightSlideAnim from '@/components/TextAnimations/RightSlideAnim/RightSlideAnim'
import { ReactLenis } from 'lenis/react'
import Image from 'next/image'

const page = () => {
  return (
    <ReactLenis root>
      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden bg-[#080808]">
        <Image
          src="/assets/gradient/image1.png"
          alt=""
          fill
          priority
          className="object-cover opacity-45"
        />

        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/55 to-black" />
        <div className="absolute -top-40 left-1/2 h-175 w-175 -translate-x-1/2 rounded-full bg-[#ff5f99]/20 blur-3xl" />

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 text-center">
          <div className="mb-8 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-xl">
            <span className="text-sm tracking-[0.25em] text-white/70 uppercase">
              Scroll to reveal
            </span>
          </div>

          <RightSlideAnim scrub={true} className="text-center" start='top 40%' end='bottom 40%'>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.92] tracking-tight text-white">
              Slide From Right
             
            </h1>
          </RightSlideAnim>

          <RightSlideAnim scrub={true} start='top 50%' end='bottom 50%'>
            <p className="mt-8 max-w-2xl text-lg md:text-2xl text-white/65">
              A cinematic text reveal where every character enters with
              intention.
            </p>
          </RightSlideAnim>
        </div>
      </section>

      {/* Showcase */}
      <section className="relative min-h-screen overflow-hidden bg-[#f7f2ff]">
        <Image
          src="/assets/gradient/image2.png"
          alt=""
          fill
          className="object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-8">
          <div className="max-w-6xl">
            <div className="mb-12 flex items-center gap-4">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-sm uppercase tracking-[0.35em] text-black/40">
                Directional Motion
              </span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <RightSlideAnim scrub={true} className="max-w-5xl">
              <p className="text-center text-4xl md:text-6xl font-semibold leading-[1.15] text-[#121212]">
                Characters gracefully slide in from the right
                <span className="text-[#c2185b]"> with elegant stagger</span>,
                creating a premium reveal that feels alive while scrolling.
              </p>
            </RightSlideAnim>

            <div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                '/assets/gradient/image2.png',
                '/assets/gradient/image3.png',
                '/assets/gradient/image4.png',
                '/assets/gradient/image5.png',
              ].map((src, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-[30px] border border-black/10 bg-white/50 backdrop-blur-xl"
                >
                  <div className="relative h-60">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final */}
      <section className="relative min-h-screen overflow-hidden bg-black">
        <Image
          src="/assets/gradient/image5.png"
          alt=""
          fill
          className="object-cover opacity-45"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-8">
          <div className="relative max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-8 py-24 backdrop-blur-2xl">
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />

            <RightSlideAnim
              scrub={true}
              className="relative text-center"
            >
              <h2 className="text-5xl md:text-8xl font-black leading-[0.95] text-white">
                Perfect for
                <br />
                guiding attention
                <br />
                through motion
              </h2>
            </RightSlideAnim>

            <RightSlideAnim scrub={true} start='top 80%' end='bottom 75%'>
              <p className="relative mx-auto mt-10 max-w-2xl text-center text-lg text-white/60">
                Designed to feel smooth, modern and intentionally cinematic.
              </p>
            </RightSlideAnim>
          </div>
        </div>
      </section>
    </ReactLenis>
  )
}

export default page