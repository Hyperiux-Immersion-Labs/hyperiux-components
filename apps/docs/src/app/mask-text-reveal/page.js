import React from'react'
import MaskAnim from'@/components/TextAnimations/MaskAnim/MaskAnim'
import { ReactLenis } from'lenis/react'

const page = () => {
 return (
 <ReactLenis root>
 <section className="min-h-screen flex items-center justify-center bg-[#f5f1e8] px-8">
 <MaskAnim scrub={true} className="text-center">
 <h1 className="text-7xl font-bold text-[#2d2416] leading-tight">
 Gradient Mask<br />Text Reveal
 </h1>
 </MaskAnim>
 </section>

 <section className="min-h-screen flex items-center justify-center bg-white px-8">
 <MaskAnim scrub={true} className="max-w-4xl">
 <p className="text-4xl font-medium text-gray-800 leading-relaxed">
 A smooth gradient mask sweeps across each line, revealing your text
 with an elegant motion that captivates your audience.
 </p>
 </MaskAnim>
 </section>

 <section className="min-h-screen flex items-center justify-center bg-[#2d2416] px-8">
 <MaskAnim scrub={true} className="text-center max-w-3xl">
 <h2 className="text-6xl font-bold text-[#f5f1e8]">
 Perfect for modern websites seeking sophisticated animations
 </h2>
 </MaskAnim>
 </section>
 </ReactLenis>
 )
}

export default page
