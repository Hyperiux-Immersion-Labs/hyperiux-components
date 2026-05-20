import React from'react'
import OverFlowStagAnim from'@/components/TextAnimations/OverFlowStagAnim/OverFlowStagAnim'
import { ReactLenis } from'lenis/react'

const page = () => {
 return (
 <ReactLenis root>
 <section className="min-h-screen flex items-center justify-center bg-[#fff8e1] px-8">
 <OverFlowStagAnim scrub={true} className="text-center">
 <h1 className="text-7xl font-bold text-[#f57c00] leading-tight">
 Character Stagger<br />Overflow Effect
 </h1>
 </OverFlowStagAnim>
 </section>

 <section className="min-h-screen flex items-center justify-center bg-white px-8">
 <OverFlowStagAnim scrub={true} className="max-w-4xl">
 <p className="text-4xl font-medium text-gray-800 leading-relaxed">
 Individual characters stagger up from overflow with a subtle rotation,
 creating a dynamic and playful reveal animation.
 </p>
 </OverFlowStagAnim>
 </section>

 <section className="min-h-screen flex items-center justify-center bg-[#f57c00] px-8">
 <OverFlowStagAnim scrub={true} className="text-center max-w-3xl">
 <h2 className="text-6xl font-bold text-white">
 Adds energy and personality to your headlines
 </h2>
 </OverFlowStagAnim>
 </section>
 </ReactLenis>
 )
}

export default page
