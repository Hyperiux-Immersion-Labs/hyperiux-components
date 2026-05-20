'use client'
import { useState } from"react";
import GlassStripParallax from"@/components/GlassEffects/FractalGlass";

const images = {
 blob:"/assets/img/image10.jpg",
 flower:"/assets/img/image08.jpg",
 mountains:"/assets/img/image09.jpg",
 };

export default function Home() {
 const [active, setActive] = useState("blob");

 return (
 <>
 <GlassStripParallax
 imageSrc={images[active]}
 stripesFrequency={40}
 glassStrength={2.0}
 glassSmoothness={0.014}
 parallaxStrength={0.15}
 distortionMultiplier={8.0}
 edgePadding={0.12}
 />

 <div className="fixed top-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
 {["blob","flower","mountains"].map((name) => (
 <button
 key={name}
 onClick={() => setActive(name)}
 className={`px-5 py-2 rounded-full text-sm text-white capitalize tracking-wide backdrop-blur-md transition-all duration-200 cursor-pointer
 ${active === name
 ?"border-2 border-white bg-white/25 font-semibold"
 :"border-2 border-white/40 bg-black/30 font-normal"
 }`}
 >
 {name}
 </button>
 ))}
 </div>
 </>
 );
}