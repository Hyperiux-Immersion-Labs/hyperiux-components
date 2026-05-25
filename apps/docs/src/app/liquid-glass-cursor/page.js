'use client'
import React from 'react'
import LiquidCursor from './LiquidCursor'
import { ChevronRight, Play } from 'lucide-react'

const CustomIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 58 65" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M0 0H9.02977V28.5943H0V0Z" fill="#1D1D1F"/>
    <path d="M57.1895 64.7134H48.1597V36.1192H57.1895V64.7134Z" fill="#1D1D1F"/>
    <path d="M0.0195312 36.1192V64.7135H9.0493V42.139L21.5405 37.4737V28.7449L0.0195312 36.1192Z" fill="#1D1D1F"/>
    <path d="M48.1777 22.5746V0.00012207H57.3579V28.5944L34.332 37.8697V28.5944L48.1777 22.5746Z" fill="#1D1D1F"/>
    <path d="M21.9912 29.0459L28.4868 26.8346C28.8573 26.7085 29.2624 26.7316 29.6161 26.8992L34.7834 29.3469M21.9912 29.0459L28.1616 32.2063M21.9912 29.0459V37.1727L28.1616 40.0321M34.7834 29.3469L28.1616 32.2063M34.7834 29.3469C34.7834 32.3443 34.7834 34.1753 34.7834 37.1727L28.1616 40.0321M28.1616 32.2063V40.0321" stroke="#1D1D1F" strokeWidth="0.902977"/>
  </svg>
)

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    const check = () => setIsMobile(
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    )
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export default function MinimalPage() {
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen w-full relative bg-[#F5F5F7] overflow-hidden font-sans selection:bg-black selection:text-white">
      {!isMobile && (
        <LiquidCursor baseSize={30} textHoverSize={130} borderColor="rgba(0,0,0,0.05)" />
      )}

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-white rounded-full filter blur-[100px] opacity-60 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4 space-y-8 max-w-5xl mx-auto">
        <div data-cursor="text" className="mb-[2vw] h-[5vw] w-[5vw] max-sm:w-[9vw] max-sm:h-[9vw] text-[#1D1D1F]">
          <CustomIcon className="w-full h-full object-contain" />
        </div>

        <div data-cursor="button" className="px-5 py-1.5 bg-white border border-[#E5E5EA] rounded-full text-xs font-semibold text-[#86868B] tracking-wide uppercase mb-6 cursor-none hover:scale-105 transition-transform duration-300">
          New
        </div>

        <div className="text-center space-y-4">
          <h1 data-cursor="text" className="text-6xl md:text-[88px] leading-tight font-semibold tracking-[-0.04em] text-[#1D1D1F] inline-block px-4 py-2">
            LIQUID PRO.
          </h1>
          <p data-cursor="text" className="text-2xl md:text-3xl text-[#86868B] font-medium tracking-tight max-w-2xl mx-auto inline-block px-4">
            Mind-blowing fluidity. <br className="hidden md:block" /> Design that simply flows.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 mt-10">
          <button data-cursor="button" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1D1D1F] text-white font-medium text-[17px] rounded-full transition-all hover:bg-black hover:scale-105 active:scale-95 cursor-none">
            Buy <ChevronRight className="w-4 h-4" />
          </button>
          <button data-cursor="button" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent text-[#2997FF] font-medium text-[17px] rounded-full transition-all hover:bg-[#2997FF]/10 hover:scale-105 active:scale-95 cursor-none">
            Watch the film <Play className="w-4 h-4 fill-current" />
          </button>
        </div>

        {isMobile && (
          <p className="text-lg text-[#86868B] text-center mt-4 leading-[1.2]">
            This page has a secret<br />
life on desktop.<br />
Best experienced where hover exists.
          </p>
        )}
      </div>
    </div>
  )
}