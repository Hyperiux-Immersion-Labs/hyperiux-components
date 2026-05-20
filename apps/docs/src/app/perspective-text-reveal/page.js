import React from'react'
import PerspectiveAnim from'@/components/TextAnimations/PerspectiveAnim/PerspectiveAnim'
import { ReactLenis } from'lenis/react'

const page = () => {
 return (
 <ReactLenis root>
 <section className="min-h-screen flex items-center justify-center bg-[#e8eaf6] px-8">
 <PerspectiveAnim scrub={true} className="text-center">
 <h1 className="text-7xl font-bold text-[#283593] leading-tight">
 3D Perspective<br />Text Reveal
 </h1>
 </PerspectiveAnim>
 </section>

 <section className="min-h-screen flex items-center justify-center bg-white px-8">
 <PerspectiveAnim scrub={true} className="max-w-4xl">
 <p className="text-4xl font-medium text-gray-800 leading-relaxed">
 Text lines flip into view with a stunning 3D perspective rotation,
 adding depth and dimension to your content.
 </p>
 </PerspectiveAnim>
 </section>

 <section className="min-h-screen flex items-center justify-center bg-[#283593] px-8">
 <PerspectiveAnim scrub={true} className="text-center max-w-3xl">
 <h2 className="text-6xl font-bold text-white">
 Create immersive experiences with spatial text animations
 </h2>
 </PerspectiveAnim>
 </section>
 </ReactLenis>
 )
}

export default page
