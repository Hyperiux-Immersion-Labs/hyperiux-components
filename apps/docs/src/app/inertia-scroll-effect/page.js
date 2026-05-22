'use client'

import React, { useEffect, useState } from 'react'
import SmoothAnim from '@/components/ScrollAnimation/SmoothAnim'
import { ReactLenis } from 'lenis/react'

const images = {
  section1Img: '/assets/img/image06.png',
  heroImg: '/assets/img/image05.png',
  overlayImg: '/assets/img/image06.png',

  gridImgs: [
    '/assets/nature/nature01.png',
    '/assets/img/image05.png',
    '/assets/nature/nature03.png',
    '/assets/nature/nature04.png',
    '/assets/nature/nature05.png',
    '/assets/nature/nature06.png',
    '/assets/nature/nature07.png',
    '/assets/nature/nature08.png',
    '/assets/nature/nature09.png',
    '/assets/nature/nature10.png',
    '/assets/nature/nature11.png',
    '/assets/nature/nature12.png',
    '/assets/nature/nature13.png',
    '/assets/img/image01.webp',
    '/assets/img/image02.webp',
    '/assets/img/image03.webp',
    '/assets/img/image04.png',
    '/assets/nature/nature02.png',
    '/assets/nature/nature01.png',
    '/assets/img/image07.png',
    '/assets/nature/nature02.png',
    '/assets/nature/nature10.png',
    '/assets/nature/nature11.png',
    '/assets/nature/nature12.png',
    '/assets/img/image06.png',
  ],
}

const Content = () => (
  <main className="relative min-h-screen bg-[#f4f4f1] text-black overflow-hidden">

    <div className="absolute top-[32%]  left-1/2 hidden max-sm:flex -translate-x-1/2 -translate-y-1/2 w-[75%] text-center">
      <p className="rounded-xl bg-black/10 px-5 py-3 text-base leading-[1.2] text-black backdrop-blur-sm">
        This experience is built around scrolling. <br />
        Open on desktop for the full effect
      </p>
    </div>

    {/* nav */}
    <nav className="absolute top-0 left-0 z-20 flex w-full items-center justify-between px-8 py-6 font-mono text-[12px]  uppercase max-sm:text-[3.5vw]">
      <p>Smooth</p>
      <p>Animation</p>
      <p>Scroll</p>
      <p>Motion</p>
    </nav>

    {/* content */}
    <section className="flex min-h-screen items-end px-8 pb-8">
      <div>
        <h1 className="font-mono text-[12vh] max-sm:text-[15vw] leading-none w-[40vw] font-black uppercase">
          Smooth
          <br />
          Animation
          <br />
          Scroll
        </h1>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-black/40">
          Scroll · Motion · Narrative
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

  if (isMobile === null) return null

  if (isMobile) {
    return <Content />
  }

  return (
    <ReactLenis root options={{ infinite: true }}>
      <div className="bg-white text-black/90">
        <SmoothAnim images={images} />
      </div>
    </ReactLenis>
  )
}

export default page