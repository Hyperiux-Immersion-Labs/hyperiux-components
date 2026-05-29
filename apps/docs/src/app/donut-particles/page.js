import React from'react'
import DonutParticle from'@/components/Particles/DonutParticle'
import HeadAnim from '@/components/Animations/HeadAnim'
import Copy from '@/components/Animations/Copy'

const page = () => {
 return (
 <>
 <div className="relative h-screen w-screen overflow-hidden bg-black">
 <DonutParticle
  className="absolute inset-0"
  donutPosition={[1, -0.25, 0]}
 />


 {/* Copy */}
 <div className="relative z-20 h-full w-full flex items-center">
 <div className="w-full max-w-2xl px-10 absolute bottom-10 left-0 ">
 <HeadAnim>
 <h1 className="leading-[1] uppercase text-[7vw] text-white font-medium">
 Brands Built <span className=' text-purple-500'> Boldly</span>
 </h1>
 </HeadAnim>
 </div>
 </div>

 <div className="absolute bottom-8 right-10 z-20 max-w-md text-right">
  <Copy delay={0.5}>
 <p className="text-white text-base md:text-lg">
 From strategy to visuals, we craft branding that tells your story and leaves a lasting impression.
 </p>
 </Copy>
 </div>
 </div>
 </>
  )
}

export default page
