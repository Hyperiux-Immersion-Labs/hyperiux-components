'use client'
import React, { useCallback, useState } from'react'
import { NumericTunnelLoader } from './NumericTunnelLoader'

export default function NumericTunnel() {
 const [isComplete, setIsComplete] = useState(false)
 const [tunnelInstance, setTunnelInstance] = useState(0)

 const handleComplete = useCallback(() => {
 setIsComplete(true)
 }, [])

 const handleReplay = useCallback(() => {
 setIsComplete(false)
 setTunnelInstance((currentInstance) => currentInstance + 1)
 }, [])

 return (
 <NumericTunnelLoader key={tunnelInstance} onComplete={handleComplete}>
 <div className="h-screen w-full bg-white">
 <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-[4vw] font-bold">HYPERIUX VAULT</h2>
<button
  type="button"
  onClick={handleReplay}
  className={`absolute top-[calc(50%+5.5rem)] left-1/2 -translate-x-1/2 -translate-y-1/2
    rounded-full border border-black/10 bg-white/60 px-5 py-2
    text-sm font-medium text-black backdrop-blur-md

    transition-all duration-300
    hover:scale-105 hover:border-black/20 hover:bg-white/80
    active:scale-95
    ${
      isComplete
        ? "opacity-100"
        : "pointer-events-none opacity-0"
    }`}
>
  ↻ Replay
</button>
 </div>
 </NumericTunnelLoader>
 )
}


