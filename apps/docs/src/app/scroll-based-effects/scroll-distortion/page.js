import ScrollBasedImageDistortion from'@/components/showcase/ScrollBasedEffects/ImageDistortion/ScrollBasedImageDistortion'
import React from'react'

const sections = [
 { text:'SHADOW', src:'/assets/img/image01.webp' },
 { text:'FLOWER', src:'/assets/img/image02.webp' },
 { text:'RUN!!', src:'/assets/img/image03.webp' },
]

const shaderConfig = {
 strength: 0.8,
 rgbShift: 0.05,
 scale: 0.15,
 transitionDuration: 0.8,
 transitionEase:'power3.inOut',
}

export default function page() {
 return (
 <ScrollBasedImageDistortion
 sections={sections}
 shaderConfig={shaderConfig}
 displacementSrc="/assets/img/distortion.jpg"
 />
 )
}
