import React from'react'
import TextBlockReveal from'@/components/RectangularTextReveal/RectangularTextReveal'

export default function page() {
 return (
 <section className='h-screen w-full bg-sky-200 flex items-center justify-center'>
 <TextBlockReveal
 overlayEnterDuration={0.35}
 overlayExitDuration={0.35}
 direction="bottom"
 coverDuration={0.4}
 revealDuration={0.5}
 baseColor="#7DAACB"  overlayColor="#0F2854"
 // className="max-w-6xl"
 delay={1.5}
 >
 <p className='text-[6vw] block text-center font-medium text-white w-full tracking-tight leading-[.9]'>PIE CHART PAGE II</p>
 </TextBlockReveal>

  </section>
 )
}
