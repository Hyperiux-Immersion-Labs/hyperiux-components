'use client'
import ImageStream from"@/components/WaveMediaPipe/WaveMediaPipe"

 // required — GSAP and refs need the browser

// import ImageStream from'@/components/ImageStream'
// adjust the path to wherever you placed ImageStream.jsx + ImageStream.css

const IMAGES = [
'/img/1.png',
'/img/2.png',
'/img/3.png',
'/img/4.png',
'/img/5.png',
'/img/6.png',
'/img/7.png',
'/img/8.png',
'/img/9.png',
'/img/10.png',
 // ... as many as you want (4–40)
]

export default function Page() {
 return (
 <main>
 <ImageStream
 images={IMAGES}
 cardWidth={210}
 cardHeight={295}
 title={['(BO®S)','TLB/2026']}
 navLinks={['Timeline','Surf','Index','About']}
 xSpan={2700}
 floatAmp={11}
 />
 </main>
 )
}