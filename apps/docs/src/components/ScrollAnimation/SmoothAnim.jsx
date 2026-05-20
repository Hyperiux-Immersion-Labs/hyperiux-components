'use client'

import React, { useRef, useEffect } from'react'
import Image from'next/image'
import gsap from'gsap'
import { ScrollTrigger } from'gsap/ScrollTrigger'

const GRID_COLS = 5
const GRID_ROWS = 5
const HERO_INDEX = 1
const LAST_INDEX = GRID_COLS * GRID_ROWS - 1

const SmoothTransition = ({ images = {} }) => {
 const {
 section1Img ='/assets/img/image03.webp',
 heroImg ='/assets/img/image03.webp',
 overlayImg ='/assets/img/image03.webp',
 gridImgs = [],
 } = images

 const getGridImg = (index) =>
 gridImgs[index] || gridImgs[index % Math.max(gridImgs.length, 1)] ||'/assets/img/image03.webp'

 const section1Ref = useRef(null)
 const section2Ref = useRef(null)
 const imageRef1 = useRef(null)
 const imageRef2 = useRef(null)
 const gridRef = useRef(null)
 const gridItemsRef = useRef([])
 const lastImageRef = useRef(null)
 const section3TextRef = useRef(null)
 const overlayImageRef = useRef(null)
 const gridImageRefs = useRef([])
 const heroGridImgRef = useRef(null)

 const handleGridImageMouseEnter = (i) => {
 const el = gridImageRefs.current[i]
 if (!el) return
 gsap.to(el, { scale: 2.4, duration: 0.45, ease:'power2.out', overwrite:'auto' })
 }
 const handleGridImageMouseLeave = (i) => {
 const el = gridImageRefs.current[i]
 if (!el) return
 gsap.to(el, { scale: 1, duration: 0.45, ease:'power2.out', overwrite:'auto' })
 }

 useEffect(() => {
 gsap.registerPlugin(ScrollTrigger)

 const ctx = gsap.context(() => {

 // ── Section 1 parallax ──────────────────────────────────────────
 gsap.to(imageRef1.current, {
 y: 150,
 ease:'none',
 scrollTrigger: {
 trigger: section1Ref.current,
 start:'top top',
 end:'bottom top',
 scrub: true,
 },
 })

 // ── Set all initial states ──────────────────────────────────────
 const nonHeroItems = gridItemsRef.current.filter((_, i) => i !== HERO_INDEX)

 gsap.set(imageRef2.current, { x:'95%', y:'25%', scale: 0.2, xPercent: 0, yPercent: 0, opacity: 1 })
 gsap.set('.image-ref-2', { opacity: 0 })
 gsap.set('.two-text-bottom', { opacity: 0, x:'20vw', y:'20vh', scale: 1 })
 gsap.set('.text-left-text', { opacity: 0, x: 0 })
 gsap.set('.text-right-text', { opacity: 0, x: 0 })
 gsap.set('.two-text-top', { y: 0, opacity: 1 })
 gsap.set(gridRef.current, { opacity: 0, scale: 1.3, y: 0 })
 gsap.set(gridItemsRef.current, { opacity: 0 })
 gsap.set(heroGridImgRef.current, { opacity: 0 })
 gsap.set(section3TextRef.current, { y:'-120%', opacity: 0 })
 gsap.set(overlayImageRef.current, { opacity: 0, display:'none' })

 // phase3 state
 let phase3Initialized = false
 let heroBaseY = 0
 let ovData = null

 // ── Single master ScrollTrigger driving everything via progress ─
 // Progress bands:
 // Phase 1 : 0.00 → 0.40 hero flies in, texts appear
 // Phase 2 : 0.40 → 0.64 grid appears, hero shrinks to cell
 // Phase 3 : 0.64 → 1.00 grid scrolls up, overlay expands
 ScrollTrigger.create({
 trigger: section2Ref.current,
 start:'top top',
 end:'+=500%',
 scrub: true,
 onUpdate(self) {
 const prog = self.progress

 // ── Phase 1 (0 → 0.4) ────────────────────────────────────
 const p1 = Math.min(1, prog / 0.4)

 gsap.set(imageRef2.current, {
 x: `${95 * (1 - p1)}%`,
 y: `${25 * (1 - p1)}%`,
 scale: 0.2 + 0.8 * p1,
 })
 gsap.set('.image-ref-2', { opacity: p1 })
 gsap.set('.two-text-bottom', { opacity: p1, x: `${20 * (1 - p1)}vw`, y: `${20 * (1 - p1)}vh` })
 gsap.set('.text-left-text', { opacity: p1, x: `${-8 * p1}vw` })
 gsap.set('.text-right-text', { opacity: p1, x: `${8 * p1}vw` })

 // ── Phase 2 (0.4 → 0.64) ─────────────────────────────────
 const p2 = Math.max(0, Math.min(1, (prog - 0.4) / 0.24))

 gsap.set('.two-text-top', { y: `${-50 * p2}vh`, opacity: 1 - p2 * 0.5 })
 gsap.set(gridRef.current, { opacity: p2, scale: 1.3 - 0.3 * p2 })
 gsap.set(nonHeroItems, { opacity: p2 })
 gsap.set(imageRef2.current, {
 xPercent: -55 * p2,
 yPercent: -65 * p2,
 scale: (0.2 + 0.8 * p1) * (1 - p2) + 0.11 * p2,
 })
 gsap.set('.two-text-bottom', { scale: 1 - 0.89 * p2, opacity: p1 * (1 - p2) })
 gsap.set(gridItemsRef.current[HERO_INDEX], { opacity: p2 })

 // ── Phase 3 (0.64 → 1.0) ─────────────────────────────────
 const p3 = Math.max(0, Math.min(1, (prog - 0.64) / 0.36))

 if (p3 <= 0) {
 if (phase3Initialized) {
 phase3Initialized = false
 heroBaseY = 0
 ovData = null
 gsap.set(lastImageRef.current, { opacity: 1 })
 gsap.set(overlayImageRef.current, { opacity: 0, display:'none' })
 gsap.set(gridRef.current, { y: 0 })
 gsap.set(imageRef2.current, { opacity: 1 })
 gsap.set(heroGridImgRef.current, { opacity: 0 })
 gsap.set(section3TextRef.current, { y:'-120%', opacity: 0 })
 }
 return
 }

 // init phase3 measurements once
 if (!phase3Initialized) {
 phase3Initialized = true
 heroBaseY = parseFloat(gsap.getProperty(imageRef2.current,'y') || 0)

 const lastEl = lastImageRef.current
 const container = section2Ref.current
 const lastRect = lastEl.getBoundingClientRect()
 const containerRect = container.getBoundingClientRect()
 const targetW = window.innerWidth * 0.30
 const targetH = window.innerWidth * 0.35

 ovData = {
 startLeft: lastRect.left - containerRect.left,
 startTop: lastRect.top - containerRect.top,
 origW: lastRect.width,
 origH: lastRect.height,
 targetLeft: (containerRect.width - targetW) / 2,
 targetTop: containerRect.height * 0.32,
 targetW,
 targetH,
 }

 gsap.set(overlayImageRef.current, {
 display:'block', opacity: 1, position:'absolute',
 left: ovData.startLeft, top: ovData.startTop,
 width: ovData.origW, height: ovData.origH,
 zIndex: 60, borderRadius:'2px', overflow:'hidden',
 })
 gsap.set(lastEl, { opacity: 0 })
 }

 // grid scrolls up
 gsap.set(gridRef.current, { y: `${-p3 * 100}vh` })

 // hero follows grid
 const gridShiftPx = (-p3 * 100 / 100) * window.innerHeight
 gsap.set(imageRef2.current, { y: heroBaseY + gridShiftPx })

 // swap to placeholder when hero goes off-screen
 const isOffScreen = imageRef2.current.getBoundingClientRect().bottom < 0
 gsap.set(imageRef2.current, { opacity: isOffScreen ? 0 : 1 })
 gsap.set(heroGridImgRef.current, { opacity: isOffScreen ? 1 : 0 })

 // overlay expands
 if (ovData) {
 gsap.set(overlayImageRef.current, {
 left: ovData.startLeft + (ovData.targetLeft - ovData.startLeft) * p3,
 top: ovData.startTop + (ovData.targetTop - ovData.startTop) * p3,
 width: ovData.origW + (ovData.targetW - ovData.origW) * p3,
 height: ovData.origH + (ovData.targetH - ovData.origH) * p3,
 })
 }

 // section3 text
 const textP = Math.max(0, (p3 - 0.3) / 0.7)
 gsap.set(section3TextRef.current, { y: `${-120 + textP * 120}%`, opacity: textP })
 },
 })

 })

 return () => ctx.revert()
 }, [])

 return (
 <>
 {/* ── Section 1 ──────────────────────────────── */}
 <div ref={section1Ref} className='h-screen flex flex-col gap-19 overflow-hidden'>
 <h2 className='text-[5vw] text-center w-[90%] mx-auto pt-4'>
 Build insanely smooth interfaces with Hyperiux UI
 </h2>
 <div className='h-[35vw] w-[30vw] mx-auto relative overflow-hidden'>
 <div ref={imageRef1} className='absolute inset-0'>
 <Image src={section1Img} alt='image' fill className='object-cover scale-110' />
 </div>
 </div>
 </div>

 {/* ── Section 2 ──────────────────────────────── */}
 <div className='h-[600vh] relative'>
 <div
 ref={section2Ref}
 className='h-screen flex flex-col gap-2 sticky top-0 overflow-hidden'
 style={{ position:'sticky' }}
 >
 {/* Section 3 text */}
 <h2
 ref={section3TextRef}
 className='text-[5vw] text-center w-[90%] mx-auto pt-4 absolute top-0 left-0 right-0 z-40 pointer-events-none text-neutral-900'
 >
 Build insanely smooth interfaces with Hyperiux UI
 </h2>

 {/* Overlay */}
 <div ref={overlayImageRef} style={{ display:'none', position:'absolute' }}>
 <Image src={overlayImg} alt='' fill className='object-cover scale-110' />
 </div>

 {/* Full-screen grid */}
 <div
 ref={gridRef}
 className='absolute inset-0'
 style={{
 opacity: 0,
 display:'grid',
 gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
 gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
 }}
 >
 {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => (
 <div
 key={i}
 ref={el => (gridItemsRef.current[i] = el)}
 style={{ display:'flex', alignItems:'center', justifyContent:'center', opacity: 0 }}
 >
 {i === HERO_INDEX ? (
 <div
 ref={heroGridImgRef}
 style={{ width:'60px', height:'60px', position:'relative', borderRadius:'2px', overflow:'hidden', opacity: 0 }}
 >
 <Image src={heroImg} alt='' fill className='object-cover' />
 </div>
 ) : (
 <div
 ref={el => {
 if (i === LAST_INDEX) lastImageRef.current = el
 gridImageRefs.current[i] = el
 }}
 onMouseEnter={() => handleGridImageMouseEnter(i)}
 onMouseLeave={() => handleGridImageMouseLeave(i)}
 style={{ width:'60px', height:'60px', position:'relative', borderRadius:'2px', overflow:'hidden', transformOrigin:'center center', cursor:'pointer', zIndex: 10 }}
 >
 <Image
 src={getGridImg(i)}
 alt=''
 fill
 className='object-cover'
 style={{ objectPosition: `${(i * 20) % 100}% ${(i * 13) % 100}%` }}
 />
 </div>
 )}
 </div>
 ))}
 </div>

 {/* Top text */}
 <h2 className='text-[3vw] two-text-top text-center w-[60%] mx-auto pt-4 relative z-10 text-neutral-900'>
 <span className='inline-block text-left-text opacity-0'>Built for developers</span>
 <span className='block text-right-text opacity-0 ml-2'>loved by users</span>
 </h2>

 {/* Hero image */}
 <div
 ref={imageRef2}
 className='flex-1 relative w-[35%] my-8 mx-auto overflow-hidden'
 style={{ zIndex: 20 }}
 >
 <div className='absolute inset-0 opacity-0 image-ref-2'>
 <Image src={heroImg} alt='image' fill className='object-cover scale-150' />
 </div>
 </div>

 {/* Bottom text */}
 <h2 className='text-[3vw] two-text-bottom text-center w-[60%] mx-auto pb-4 relative z-10 text-neutral-900'>
 <span className='inline-block'>Animations that</span>
 <span className='block'>feel native.</span>
 </h2>
 </div>
 </div>
 </>
 )
}

export default SmoothTransition