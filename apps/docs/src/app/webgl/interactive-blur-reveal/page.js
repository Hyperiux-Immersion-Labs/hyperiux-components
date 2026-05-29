import Link from 'next/link'

import FrostedGlassShader from '@/components/InteractiveBlurReveal/InteractiveBlurReveal'

const Page = () => {
  return (
    <main className="relative h-dvh w-dvw overflow-hidden bg-black text-white">
      <FrostedGlassShader
        iChannel0="/assets/img/image02.webp"
        iChannel1="/assets/download.png"
      />

      {/* Overlay copy (matches reference layout) */}
      <div className="pointer-events-none fixed inset-0 z-10 h-screen w-screen">
        <header className="flex items-start justify-between px-10 pt-7 max-sm:px-5 max-sm:pt-5">
          <div className="text-sm max-sm:text-sm font-semibold opacity-90 max-md:text-lg">HYPERIUX</div>

          <Link
            className="pointer-events-auto text-sm max-sm:text-sm max-md:text-lg font-semibold opacity-90 transition-opacity hover:opacity-100"
            href="#"
            target="_blank"
            rel="noreferrer"
          >
            VISIT HYPERIUX IMMERSION LABS
          </Link>
        </header>

        <section className="flex h-full w-full flex-col items-start justify-center px-10">
          <div className="mt-[-12%]">
            <h1 className="max-w-[60vw] text-[7vw] font-light leading-[0.9] tracking-tighter max-sm:max-w-full max-sm:text-[10vw]">
              Design that feels discovered,
              <br /> not displayed.
            </h1>
            <p className="mt-4 hidden font-medium tracking-wide text-white/70 max-md:mt-10 max-md:block max-md:w-[80%] max-md:text-[3vw] max-md:leading-[1.3] max-sm:mt-6 max-sm:w-full max-sm:text-[3.5vw]">
              Tap here to experience the effect. For the full frosted-glass
              experience, open on desktop.
            </p>
          </div>

          <p className="text-shadow-lg absolute right-10 bottom-10 max-w-[39vw] text-[1.25vw] leading-[1.45] opacity-70 max-md:max-w-[50vw] max-md:text-[2.5vw] max-sm:bottom-7 max-sm:left-5 max-sm:max-w-[70vw] max-sm:text-[3vw]">
            We build digital spaces with texture, motion, and atmosphere -
            where every scroll, hover, and transition feels less like an
            interface and more like stepping through glass into another world.
          </p>
        </section>
      </div>
    </main>
  )
}

export default Page
