import React from'react'
import RightSlideAnim from'@/components/TextAnimations/RightSlideAnim/RightSlideAnim'
import { ReactLenis } from'lenis/react'

const page = () => {
 return (
 <ReactLenis root>
 <section className="min-h-screen flex items-center justify-center bg-[#fce4ec] px-8">
 <RightSlideAnim scrub={true} className="text-center">
 <h1 className="text-7xl font-bold text-[#c2185b] leading-tight">
 Slide From Right<br />Text Animation
 </h1>
 </RightSlideAnim>
 </section>

 <section className="min-h-screen flex items-center justify-center bg-white px-8">
 <RightSlideAnim scrub={true} className="max-w-4xl">
 <p className="text-4xl font-medium text-gray-800 leading-relaxed">
 Characters gracefully slide in from the right with a staggered fade,
 creating a smooth directional reveal effect.
 </p>
 </RightSlideAnim>
 </section>

 <section className="min-h-screen flex items-center justify-center bg-[#c2185b] px-8">
 <RightSlideAnim scrub={true} className="text-center max-w-3xl">
 <h2 className="text-6xl font-bold text-white">
 Perfect for guiding user attention with motion
 </h2>
 </RightSlideAnim>
 </section>
 </ReactLenis>
 )
}

export default page
