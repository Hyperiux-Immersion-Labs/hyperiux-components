'use client'

import ImageTrail from '@/components/MagneticImageTrail'
import React, { useEffect, useState } from 'react'

const Content = () => (
  <main className="relative min-h-screen max-sm:h-screen w-full overflow-hidden bg-[#f4f4f1] text-black">

    <div className="absolute top-[30%] left-1/2 hidden max-sm:flex -translate-x-1/2 -translate-y-1/2 h-fit w-[70%] px-6 text-center">
      <p className="rounded-xl bg-black/10 px-5 py-3 leading-[1.2] text-base text-black backdrop-blur-sm">
        Follow the motion. <br />
        Open on desktop for the full magnetic effect
      </p>
    </div>

    {/* nav */}
    <nav className="absolute top-0 left-0 z-20 flex w-full items-center justify-between px-8 py-6 font-mono max-sm:font-semibold text-[12px] max-sm:text-[3.5vw] font-bold uppercase">
      <p>Magnetic</p>
      <p>Images</p>
      <p>Motion</p>
      <p>Trail</p>
    </nav>

    {/* content */}
    <section className="flex min-h-screen items-end px-8 pb-8">
      <div>
        <h1 className="font-mono text-[12vh] max-sm:text-[15vw] leading-none w-[30vw] font-black uppercase">
          Magnetic
          <br />
          Image Trail
        </h1>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-black/40">
          Cursor · Images · Momentum
        </p>
      </div>
    </section>

  </main>
)

const page = () => {
  const [isMobile, setIsMobile] = useState(null)

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640)
    }

    check()
    window.addEventListener('resize', check)

    return () => window.removeEventListener('resize', check)
  }, [])

  // prevent desktop component flash during hydration
  if (isMobile === null) return null

  return isMobile ? <Content /> : <ImageTrail />
}

export default page