import React from 'react'
import HomeAero from '@/components/TextAnims/HomeAero'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'

const page = () => {
  return (
    <>
      <LenisSmoothScroll />
    <div className="relative min-h-screen">

      <HomeAero
        text="One hover, and suddenly your UI has personality"
        colors={{
          color1: '#a78bfa',
          color2: '#fb7185',
          color3: '#fde68a',
        }}
        enableEntryAnimation={true}
      />

      {/* Mobile only notice */}
      <div className="hidden max-sm:block absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-zinc-700 text-[4vw] leading-[1.2] font-medium font-">
           Open on desktop to experience the effect
        </p>
      </div>
    </div>
    </>
  )
}

export default page