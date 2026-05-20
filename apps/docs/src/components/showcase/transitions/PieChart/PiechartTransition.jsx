'use client'

import React, { useRef } from'react'
import gsap from'gsap'
import { TransitionRouter } from'next-transition-router'

export default function PiechartTransition({
 children,
 config = { duration: 4, color:'#0F2854' },
}) {
 const { duration, color } = {
 duration: 4,
 color:'#0F2854',
 ...config,
}
 const overlayRef = useRef(null)
 const shapeRef = useRef({ start: 0, end: 0 })
 const contentRef = useRef(null)
 const DELAY = 0.2

 const applySlice = (endDeg, startDeg) => {
 const el = overlayRef.current
 if (!el) return

 if (endDeg <= startDeg + 0.01) return

 const rawSpread = endDeg - startDeg

 if (rawSpread <= 0.01) {
 el.style.opacity ='0'
 el.style.webkitMaskImage ='conic-gradient(from 0deg, transparent 0deg, transparent 360deg)'
 el.style.maskImage ='conic-gradient(from 0deg, transparent 0deg, transparent 360deg)'
 return
 }

 el.style.opacity ='1'

 const spread = rawSpread % 360
 const laps = Math.floor(rawSpread / 360)

 if (laps === 0) {
 const s = ((startDeg % 360) + 360) % 360
 const mask = `conic-gradient(from ${s + 90}deg, black 0deg, black ${spread}deg, transparent ${spread}deg)`
 el.style.webkitMaskImage = mask
 el.style.maskImage = mask
 return
 }

 if (laps >= 2) {
 el.style.opacity ='0'
 el.style.webkitMaskImage ='conic-gradient(from 0deg, transparent 0deg, transparent 360deg)'
 el.style.maskImage ='conic-gradient(from 0deg, transparent 0deg, transparent 360deg)'
 return
 }

 const fillSize = 360 - spread
 const gapStart = ((endDeg % 360) + 360) % 360
 const mask = `conic-gradient(from ${gapStart + 90}deg, black 0deg, black ${fillSize}deg, transparent ${fillSize}deg)`
 el.style.webkitMaskImage = mask
 el.style.maskImage = mask
 }

 return (
 <TransitionRouter auto
 leave={(next) => {
 const el = overlayRef.current
 if (el) {
 el.style.opacity ='0'
 el.style.webkitMaskImage ='conic-gradient(from 0deg, transparent 0deg, transparent 360deg)'
 el.style.maskImage ='conic-gradient(from 0deg, transparent 0deg, transparent 360deg)'
 }
  shapeRef.current = { start: 0, end: 0 }
 applySlice(0, 0)

 const tl = gsap.timeline({ onComplete: next })
 const tExit = (duration - DELAY) / 2

 tl.to(contentRef.current, {
 opacity: 0.7,
 duration: tExit,
 ease:'power2.out',
 }, 0)

 tl.to(shapeRef.current, {
 end: 540,
 duration: tExit,
 ease:'power4.inOut',
 onUpdate: () => applySlice(shapeRef.current.end, shapeRef.current.start),
 }, 0)

 if (tExit > DELAY) {
 tl.to(shapeRef.current, {
 start: 180,
 duration: tExit - DELAY,
 ease:'power4.inOut',
 onUpdate: () => applySlice(shapeRef.current.end, shapeRef.current.start),
 }, DELAY)
 }

 return () => tl.kill()
 }}
 enter={(next) => {
 const tl = gsap.timeline({
 onComplete: () => {
 const el = overlayRef.current
 if (el) {
 el.style.opacity ='0'
 el.style.webkitMaskImage ='conic-gradient(from 0deg, transparent 0deg, transparent 360deg)'
 el.style.maskImage ='conic-gradient(from 0deg, transparent 0deg, transparent 360deg)'
 }
 next()
 }
 })
  const tExit = (duration - DELAY) / 2
 const tEnter = tExit

 tl.to(contentRef.current, {
 opacity: 1,
 duration: tEnter,
 ease:'power2.inOut',
 }, 0)

 tl.to(shapeRef.current, {
 end: 1080,
 duration: tEnter,
 ease:'power2.inOut',
 onUpdate: () => applySlice(shapeRef.current.end, shapeRef.current.start),
 }, 0)

 if (tEnter > DELAY) {
 tl.to(shapeRef.current, {
 start: 360,
 duration: tEnter - DELAY,
 ease:'power2.inOut',
 onUpdate: () => applySlice(shapeRef.current.end, shapeRef.current.start),
 }, DELAY)
 } else {
 tl.to(shapeRef.current, {
 start: 360,
 duration: tEnter,
 ease:'power2.inOut',
 onUpdate: () => applySlice(shapeRef.current.end, shapeRef.current.start),
 }, DELAY - tEnter)
 }

 return () => tl.kill()
 }}
 >
 <div
 ref={overlayRef}
 className="fixed inset-0 z-999 pointer-events-none"
 style={{
 backgroundColor: color,
 opacity: 0,
 WebkitMaskImage:'conic-gradient(from 0deg, transparent 0deg, transparent 360deg)',
 maskImage:'conic-gradient(from 0deg, transparent 0deg, transparent 360deg)',
 }}
 />
 <div ref={contentRef}>
 {children}
 </div>
 </TransitionRouter>
 )
}