import FrostedGlassShader from'@/components/InteractiveBlurReveal/InteractiveBlurReveal'
import React from'react'

const page = () => {
 return (
 <main className="relative h-dvh w-dvw overflow-hidden bg-black text-white">
 <FrostedGlassShader
 iChannel0="/assets/img/image02.webp"
 iChannel1="/assets/download.png"
 />

 {/* Overlay copy (matches reference layout) */}
 <div className="pointer-events-none fixed inset-0 z-10 h-screen w-screen">
 <header className="flex items-start justify-between px-10 pt-7 max-sm:px-5 max-sm:pt-5">
 <div className="text-[13px] font-semibold opacity-90">
 HYPERIUX
 </div>

 <a
 className="pointer-events-auto text-[13px] font-semibold opacity-90 hover:opacity-100 transition-opacity"
 href="#"
 target="_blank"
 rel="noreferrer"
 >
 VISIT HYPERIUX IMMERSION LABS  </a>
 </header>
<section className='px-10 flex flex-col items-start justify-center h-full w-full'>
 <div className="mt-[-12%]">
 <h1 className=" max-w-[60vw] text-[7vw] leading-[0.9] font-light tracking-tighter">
 Design that feels discovered,<br/> not displayed.
 </h1>
 </div>

 <p className="absolute right-10 bottom-10 max-w-[39vw] text-[1.25vw] leading-[1.45] opacity-70 max-sm:left-5 max-sm:bottom-7 text-shadow-lg">
 We build digital spaces with texture, motion, and atmosphere - where every scroll, hover, and transition feels less like an interface and more like stepping through glass into another world.
 </p>
 </section>
 </div>
 </main>
 )
}

export default page
