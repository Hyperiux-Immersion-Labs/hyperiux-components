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
                    <p className='text-[11vw] w-[80vw] font-medium tracking-tight leading-[.9] p-[2vw] absolute text-white max-md:text-[14vw] max-md:w-[90vw] bottom-[1.5vw] max-sm:bottom-[20vw] max-sm:left-3 pointer-events-none z-10'>
                       Noise Ripple Effect
                    </p>
                    <p className='hidden max-sm:block text-[5vw] absolute max-sm:bottom-[5vw] max-sm:left-5 z-10 text-white w-[70%] leading-[1.2]'>
                        Best enjoyed on desktop for the full effect
                    </p>
                    <NoiseDiether />
                </section>

            </div>
        </>

    )
}
