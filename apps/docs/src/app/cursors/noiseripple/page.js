import NoiseDiether from '@/components/cursors/NoiseDiether'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'
import React from 'react'

export default function page() {
    return (
        <>
            <LenisSmoothScroll />
            <div className='min-h-screen w-full relative bg-[]'>
                {/* Hero Section - Full Screen */}
                <section className='h-screen w-full relative'>
                    <p className='text-[11vw] w-[80vw] font-medium tracking-tight leading-[.9] p-[2vw] absolute text-white max-md:text-[14vw] max-md:w-[90vw] bottom-[1.5vw] pointer-events-none z-10'>
                       Noise Ripple Effect
                    </p>
                    <NoiseDiether />
                </section>

            </div>
        </>

    )
}
