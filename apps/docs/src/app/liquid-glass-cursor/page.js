import React from'react'
import LiquidCursor from'./LiquidCursor'
import { ChevronRight, Play } from'lucide-react'

const AppleIcon = ({ className ="w-6 h-6" }) => (
 <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Logo" className={className} />
)

export default function MinimalPage() {
 return (
 <div className="min-h-screen w-full relative bg-[#F5F5F7] overflow-hidden font-sans selection:bg-black selection:text-white">
 <LiquidCursor  baseSize={30}  textHoverSize={130}  borderColor="rgba(0,0,0,0.05)"
 />
  {/* Subtle Apple-style Background Glow */}
 <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-white rounded-full filter blur-[100px] opacity-60 pointer-events-none"></div>

 <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4 space-y-8 max-w-5xl mx-auto">
  {/* Apple Logo */}
 <div data-cursor="text" className="mb-[2vw] h-[5vw] w-[5vw] text-[#1D1D1F]">
 <AppleIcon className="w-full h-full object-contain" />
 </div>

 {/* Top Badge */}
 <div data-cursor="button" className="px-5 py-1.5 bg-white border border-[#E5E5EA] rounded-full text-xs font-semibold text-[#86868B] tracking-wide uppercase mb-6 cursor-none hover:scale-105 transition-transform duration-300">
 New
 </div>

 {/* Hero Typography */}
 <div className="text-center space-y-4">
 <h1 data-cursor="text" className="text-6xl md:text-[88px] leading-tight font-semibold tracking-[-0.04em] text-[#1D1D1F] inline-block px-4 py-2">
 LIQUID PRO.
 </h1>
 <p data-cursor="text" className="text-2xl md:text-3xl text-[#86868B] font-medium tracking-tight max-w-2xl mx-auto inline-block px-4">
 Mind-blowing fluidity. <br className="hidden md:block"/>  Design that simply flows.
 </p>
 </div>

 {/* Action Buttons */}
 <div className="flex flex-col sm:flex-row items-center gap-6 mt-10">
 <button data-cursor="button" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1D1D1F] text-white font-medium text-[17px] rounded-full transition-all hover:bg-black hover:scale-105 active:scale-95 cursor-none">
 Buy <ChevronRight className="w-4 h-4" />
 </button>
 <button data-cursor="button" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent text-[#2997FF] font-medium text-[17px] rounded-full transition-all hover:bg-[#2997FF]/10 hover:scale-105 active:scale-95 cursor-none">
 Watch the film <Play className="w-4 h-4 fill-current" />
 </button>
 </div>
 </div>
 </div>
 )
}