import React from'react'
import { SpiderParticles } from'@/components/Particles/SpiderParticles'

const spiderParticlesProps = {
 particleCount:180,
 gridGap:0,
 particleSize:20.0,
 mouseConnectDist:160,
 spotlightRadius:300,
 particlesGlow:false,
 glowColor:0xffffff,
 particleColor:0xffffff,
 webColor:0xffffff,
 centerColor:0xffffff,
}

const page = () => {
 return (
 <div>
 <SpiderParticles {...spiderParticlesProps} />
 </div>
 )
}

export default page
