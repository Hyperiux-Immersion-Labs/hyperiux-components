import React from'react'
import DonutParticle from'@/components/Particles/DonutParticle'
import styles from'./donut-particles.module.css'

const page = () => {
 return (
 <>
 <div className="relative h-screen w-screen overflow-hidden bg-black">
 <DonutParticle
  className="absolute inset-0"
  donutPosition={[-0.85, -0.25, 0]}
 />

 {/* Dark gradient overlay for readability */}
 <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/80 via-black/50 to-black/20" />

 {/* Copy */}
 <div className="relative z-20 h-full w-full flex items-center">
 <div className="w-full max-w-4xl px-10 absolute top-20 -right-0 text-right">
 <div className="">
 <p className={`${styles.movingGradient} leading-[1.1] uppercase text-[4vw] bg-gradient-to-r from-[#fcf4ff] via-[#cf9dff] to-[#6a2fcd] bg-clip-text text-transparent`}>
 Designing digital worlds
 for brands that want to be remembered
 </p>

 <p className="mt-6 text-white/70 text-base md:text-lg">
 3D visuals · Interactive websites · Motion-led brand experiences
 </p>
 </div>
 </div>
 </div>

 <div className="absolute bottom-8 right-10 z-20 text-right">
 <div className="flex flex-col items-end gap-2 text-sm md:text-base text-white/70">
 <span>3D visuals</span>
 <span>Interactive websites</span>
 <span>Motion-led brand experiences</span>
 </div>
 </div>
 </div>
 </>
  )
}

export default page
