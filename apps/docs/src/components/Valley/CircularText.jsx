'use client'

import { useEffect, useRef } from'react'
import gsap from'gsap'
import { CupSoda, Stars } from'lucide-react'

const CircularText = ({
 text ='',
 spinDuration = 20,
 onHover ='speedUp',
 className ='',
 radius = 80,
}) => {
 const containerRef = useRef(null)
 const tweenRef = useRef(null)

 const letters = Array.from(text)

 useEffect(() => {
 if (!containerRef.current) return

 tweenRef.current?.kill()

 tweenRef.current = gsap.to(containerRef.current, {
 rotation: 360,
 duration: spinDuration,
 ease:'none',
 repeat: -1,
 transformOrigin:'50% 50%',
 })

 return () => tweenRef.current?.kill()
 }, [spinDuration, text])

 // ───────── Hover ─────────
 const handleEnter = () => {
 if (!tweenRef.current) return

 switch (onHover) {
 case'slowDown':
 gsap.to(tweenRef.current, { timeScale: 0.5, duration: 0.3 })
 break
 case'speedUp':
 gsap.to(tweenRef.current, { timeScale: 2, duration: 0.3 })
 break
 case'pause':
 tweenRef.current.pause()
 break
 case'goBonkers':
 gsap.to(tweenRef.current, { timeScale: 6, duration: 0.3 })
 gsap.to(containerRef.current, {
 scale: 0.85,
 duration: 0.3,
 ease:'power2.out',
 })
 break
 }
 }

 const handleLeave = () => {
 if (!tweenRef.current) return

 tweenRef.current.resume()
 gsap.to(tweenRef.current, { timeScale: 1, duration: 0.3 })

 gsap.to(containerRef.current, {
 scale: 1,
 duration: 0.3,
 ease:'power2.out',
 })
 }

 return (
 <div>
 {/* Central Juice Icon */}
 {/* Central Juice Icon replaced with Lucide cup-soda */}
 <span
 style={{
 position:'absolute',
 left:'50%',
 top:'50%',
 width: 56,
 height: 56,
 transform:'translate(-50%, -50%)',
 zIndex: 2,
 userSelect:'none',
 pointerEvents:'none',
 display:'flex',
 alignItems:'center',
 justifyContent:'center',
 }}
 >
 {/* Replace with your preferred Lucide icon below */}
 {/* Make sure to import { CupSoda } from'lucide-react' at the top of this file */}
 <Stars size={32} strokeWidth={1} />
 </span>

 <div
 ref={containerRef}
 className={className}
 onMouseEnter={handleEnter}
 onMouseLeave={handleLeave}
 style={{
 width: 180,
 height: 180,
 position:'relative',
 }}
 >


 {letters.map((letter, i) => {
 const angle = (360 / letters.length) * i

 return (
 <span
 key={i}
 style={{
 position:'absolute',
 left:'50%',
 top:'50%',
 transform: `
 rotate(${angle}deg)
 translate(${radius}px)
 rotate(90deg)
 `,
 transformOrigin:'0 0', // 👈 IMPORTANT FIX
 fontSize: 20,
 fontWeight: 600,
 whiteSpace:'pre',
 pointerEvents:'none',
 zIndex: 3,
 }}
 >
 {letter}
 </span>
 )
 })}
 </div>
 </div>
 )
}

export default CircularText