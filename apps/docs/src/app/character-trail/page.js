'use client'

import React, { useEffect, useState } from 'react'
import CharacterTrail from '@/components/CursorTrail/CharTrail'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'

const Content = () => (
  <main className="relative min-h-screen max-sm:h-screen w-full overflow-hidden bg-[#f4f4f1] text-black">

    <div className="absolute top-60 hidden left-5 max-sm:flex h-fit w-[90%] px-6 text-center text-white">
      <p className="rounded-full bg-black/10 px-5 py-3 leading-[1.2] text-base text-black backdrop-blur-sm">
        Not just something to watch, something to move. Open on desktop
      </p>
    </div>

    {/* nav */}
    <nav className="absolute top-0 left-0 z-20 flex w-full items-center justify-between px-8 py-6 font-mono max-sm:font-semibold text-[12px] max-sm:text-[3.5vw] font-bold uppercase">
      <p>Home</p>
      <p>Motion</p>
      <p>Grid</p>
      <p>System</p>
      <p>Trail</p>
    </nav>

    {/* content */}
    <section className="flex min-h-screen items-end px-8 pb-8">
      <div>
        <h1 className="font-mono text-[12vh] max-sm:text-[15vw] leading-[1.2] w-[20vw] font-black uppercase">
          Snake Cursor Trail
        </h1>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-black/40">
          Sequential · Reactive · Grid Based
        </p>
      </div>
    </section>

  </main>
)

const page = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640)
    }

    check()
    window.addEventListener('resize', check)

    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <>
      <LenisSmoothScroll />

      {isMobile ? (
        <Content />
      ) : (
        <CharacterTrail>
          <Content />
        </CharacterTrail>
      )}
    </>
  )
}

export default page