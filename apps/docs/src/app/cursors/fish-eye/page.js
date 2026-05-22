import FishEyeImage from '@/components/FishEye/FishEyeImage'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'
import React from 'react'

export default function page() {
    return (
        <>
        <LenisSmoothScroll />
     
        <div className='h-screen w-full bg-zinc-200 max-md:p-[10vw] max-md:flex-col flex items-start p-[5vw] justify-between max-md:justify-center max-md:gap-[10vw] max-md:items-center'>

            <h2 className='absolute bottom-[5vw] left-[5vw] max-sm:top-[5vw] max-sm:right-[5vw] text-black text-[7vw] max-md:text-[15vw] leading-none font-bold'>
                FISH EYE
            </h2>

            <h2 className='absolute top-[5vw] text-right max-sm:top-[85vh] max-sm:right-[5vw] right-[5vw] max-md:w-full text-black max-md:text-[15vw] text-[7vw] leading-none font-bold'>
                WITH <br />
                <span className='text-red-500'> TSL </span>
            </h2>

            {/* mobile warning */}
            <div className='hidden max-md:flex absolute z-30 left-1/2 -translate-x-1/2 top-[15%]  -translate-y-1/2 px-5'>
                <div className='rounded-full  px-5 py-3 text-center text-black text-base leading-[1.2] w-80'>
                     Hover unlocks the illusion <br /> Best experienced on desktop
                </div>
            </div>

            <div className='h-[30vw] w-[30vw] max-md:size-[40vw] relative'>
                <FishEyeImage src="/img/mobile.png" />
            </div>

            <div className='h-[45vw] w-[30vw] max-md:h-[50vw] max-md:w-[40vw] relative'>
                <FishEyeImage src="/assets/img/image05.png" />
            </div>

            <div className='size-[25vw] mt-auto max-md:mt-0 max-md:size-[30vw] relative'>
                <FishEyeImage src="/img/dino2.png" />
            </div>

        </div>
           </>
    )
}