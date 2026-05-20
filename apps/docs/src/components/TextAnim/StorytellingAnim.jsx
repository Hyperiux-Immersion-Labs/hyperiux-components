'use client'

import React, { useEffect, useRef } from'react'
import gsap from'gsap'
import { ScrollTrigger } from'gsap/ScrollTrigger'
import { SplitText } from'gsap/SplitText'
import { ReactLenis } from'lenis/react'

gsap.registerPlugin(ScrollTrigger, SplitText)

const SCROLL_PER_TEXT = 1800
const REVEAL_SCROLL = 1100

const StorytellingAnim = ({ texts = [], images = [], textSize ="text-[2vw]",
 mobileTextSize ="text-[4vw]" }) => {
 const containerRef = useRef(null)
 const textRefs = useRef([])
 const imageRefs = useRef([])

 useEffect(() => {
 if (!containerRef.current || texts.length === 0) return

 const scrollHeight =
 (texts.length - 1) * SCROLL_PER_TEXT + REVEAL_SCROLL + 300

 containerRef.current.style.height = `calc(100vh + ${scrollHeight}px)`

 ScrollTrigger.refresh()

 const splits = []

 const ctx = gsap.context(() => {
 texts.forEach((_, i) => {
 const el = textRefs.current[i]
 const imgs = imageRefs.current[i] || []

 if (!el) return

 const split = new SplitText(el, { type:'words,chars' })
 // prevent words from breaking across lines
gsap.set(split.words, {
 display:'inline-block',
 whiteSpace:'nowrap',
})
 splits.push(split)

 gsap.set(el, { perspective: 500, opacity: 1 })
 gsap.set(imgs, { opacity: 0 })

 const windowStart = i * SCROLL_PER_TEXT
 const revealEnd = windowStart + REVEAL_SCROLL
 const fadeEnd = windowStart + SCROLL_PER_TEXT

 // ── REVEAL TIMELINE ──────────────────────────────────────
 const revealTl = gsap.timeline({
 scrollTrigger: {
 trigger: containerRef.current,
 start: () => `top+=${windowStart} top`,
 end: () => `top+=${revealEnd} top`,
 scrub: 0.20,
 // markers: true,
 },
 })

 // text chars reveal
 revealTl.fromTo(
 split.chars,
 { opacity: 0, z: 10, y: 10, filter:'blur(8px)' },
 {
 opacity: 1,
 z: 0,
 y: 0,
 filter:'blur(0px)',
 ease:'power4.inOut',
 stagger: 0.04,
 },
 0
 )

 // images reveal — direction-aware per corner
 imgs.forEach((img, j) => {
 const isLeft = j % 2 === 0
 const xFrom = isLeft ? -120 : 120

 revealTl.fromTo(
 img,
 { opacity: 0, x: xFrom },
 { opacity: 1, x: 0, ease:'power2.out' },
 0
 )
 })

 // ── FADE-OUT TIMELINE (non-last panels only) ─────────────
 if (i < texts.length - 1) {
 const fadeOutTl = gsap.timeline({
 scrollTrigger: {
 trigger: containerRef.current,
 start: () => `top+=${revealEnd} top`,
 end: () => `top+=${fadeEnd} top`,
 scrub: 0.2,
 },
 })

 // text fade out
 fadeOutTl.to(
 el,
 { opacity: 0, ease:'power2.inOut' },
 0
 )

 // images fade out
 imgs.forEach((img, j) => {
 const isLeft = j % 2 === 0
 const xFrom = isLeft ? -120 : 120

 fadeOutTl.to(
 img,
 { opacity: 0, x: xFrom, ease:'power2.inOut' },
 0
 )
 })
 }
 })
 }, containerRef)

 return () => {
 splits.forEach((s) => s.revert())
 ctx.revert()
 }
 }, [texts, images])

 return (
 <ReactLenis root >
  <div ref={containerRef} className='bg-white w-full'>
 <div className='h-screen sticky top-0 flex items-center justify-center overflow-hidden'>

 {/* TEXTS */}
 {texts.map((text, i) => (
<p
 key={i}
 ref={(el) => (textRefs.current[i] = el)}
 className={`absolute text-black max-sm:${mobileTextSize} ${textSize} max-w-2xl max-sm:w-[80%] leading-[1.3] text-center`}
 style={{ opacity: i === 0 ? 0 : 0 }}
>
 {text}
</p>
 ))}

 {/* IMAGES (4 corners per text) */}
 {texts.map((_, i) => {
 const imgs = images[i] || []

 return imgs.map((src, j) => {
 const positions = [
'top-10 left-10',
'top-10 right-10',
'bottom-10 left-10',
'bottom-10 right-10',
 ]

 const isLeft = j % 2 === 0
 const xFrom = isLeft ? -120 : 120

 return (
 <img
 key={`${i}-${j}`}
 src={src}
 ref={(el) => {
 if (!imageRefs.current[i]) imageRefs.current[i] = []
 imageRefs.current[i][j] = el
 }}
 className={`absolute w-40 h-40 opacity-0 object-cover rounded-xl ${positions[j % 4]}`}
 style={{ transform: `translateX(${xFrom}px)` }}
 alt=''
 />
 )
 })
 })}
 </div>
 </div>
 </ReactLenis>
 )
}

export default StorytellingAnim