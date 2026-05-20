'use client'
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const defaultFloatingWords = [
  { text: 'INVITE',    color: 'bg-sky-300',    start: { top: '6%',  left: '10%', xPercent: -50, yPercent: -50 } },
  { text: 'JOIN',      color: 'bg-pink-300',   start: { top: '6%',  left: '52%', xPercent: -50, yPercent: -50 } },
  { text: 'CONNECT',   color: 'bg-purple-300', start: { top: '12%', left: '78%', xPercent: -50, yPercent: -50 } },
  { text: 'DOWNLOADS', color: 'bg-pink-200',   start: { top: '18%', left: '20%', xPercent: -50, yPercent: -50 } },
  { text: 'DISCOVER',  color: 'bg-purple-200', start: { top: '26%', left: '88%', xPercent: -50, yPercent: -50 } },
  { text: 'DESIGN',    color: 'bg-purple-200', start: { top: '42%', left: '10%', xPercent: -50, yPercent: -50 } },
  { text: 'EXPLORE',   color: 'bg-orange-200', start: { top: '40%', left: '82%', xPercent: -50, yPercent: -50 } },
  { text: 'SHARE',     color: 'bg-orange-300', start: { top: '65%', left: '72%', xPercent: -50, yPercent: -50 } },
  { text: 'PURCHASE',  color: 'bg-sky-200',    start: { top: '70%', left: '16%', xPercent: -50, yPercent: -50 } },
  { text: 'CREATE',    color: 'bg-sky-200',    start: { top: '85%', left: '44%', xPercent: -50, yPercent: -50 } },
  { text: 'BUILD',     color: 'bg-pink-200',   start: { top: '74%', left: '85%', xPercent: -50, yPercent: -50 } },
  { text: 'LAUNCH',    color: 'bg-orange-200', start: { top: '88%', left: '12%', xPercent: -50, yPercent: -50 } },
  { text: 'INNOVATE',  color: 'bg-sky-300',    start: { top: '88%', left: '32%', xPercent: -50, yPercent: -50 } },
  { text: 'TRANSFORM', color: 'bg-purple-300', start: { top: '90%', left: '54%', xPercent: -50, yPercent: -50 } },
  { text: 'EMPOWER',   color: 'bg-orange-300', start: { top: '88%', left: '76%', xPercent: -50, yPercent: -50 } },
  { text: 'ACHIEVE',   color: 'bg-sky-200',    start: { top: '92%', left: '90%', xPercent: -50, yPercent: -50 } },
]

export function GridScale({
  floatingWords = defaultFloatingWords,
  centeredText = 'Making the experience right in the face — clear, direct, no fluff.',
  ideaText = 'Have an Idea?\nWe\'ll make it real.',
  bgColor = '#242424',
}) {
  const centeredTextRef = useRef(null)
  const ideaTextRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#grid-scale',
          start: 'top top',
          end: '40% bottom',
          scrub: true,
        },
      })

      tl.fromTo(ideaTextRef.current, { opacity: 1 }, { opacity: 0, ease: 'power4.out', duration: 0.1 })

      tl.fromTo(
        '.clip-path',
        { clipPath: 'inset(20% 35% 20% 35% round 0%)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0%)', ease: 'power2.out' },
        0
      )

      gsap.set('.tl-box', { xPercent: -100, yPercent: -100, transformOrigin: 'bottom right' })
      gsap.set('.tr-box', { xPercent: 100,  yPercent: -100, transformOrigin: 'bottom left' })
      gsap.set('.bl-box', { xPercent: -100, yPercent: 100,  transformOrigin: 'top right' })
      gsap.set('.br-box', { xPercent: 100,  yPercent: 100,  transformOrigin: 'top left' })

      tl.fromTo('.tl-box', { top: '20%', left: '35%' },   { top: '0%',   left: '0%',   ease: 'power2.out' }, 0)
      tl.fromTo('.tr-box', { top: '20%', right: '35%' },  { top: '0%',   right: '0%',  ease: 'power2.out' }, 0)
      tl.fromTo('.bl-box', { bottom: '20%', left: '35%' },{ bottom: '0%',left: '0%',   ease: 'power2.out' }, 0)
      tl.fromTo('.br-box', { bottom: '20%', right: '35%'},{ bottom: '0%',right: '0%',  ease: 'power2.out' }, 0)

      tl.fromTo('.grid-line-t', { top: '20%',  scaleX: 1 }, { top: '0%',   scaleX: 0, ease: 'power2.out' }, 0)
      tl.fromTo('.grid-line-b', { top: '80%',  scaleX: 1 }, { top: '100%', scaleX: 0, ease: 'power2.out' }, 0)
      tl.fromTo('.grid-line-l', { left: '35%', scaleY: 1 }, { left: '0%',  scaleY: 0, ease: 'power2.out' }, 0)
      tl.fromTo('.grid-line-r', { right: '35%',scaleY: 1 }, { right: '0%', scaleY: 0, ease: 'power2.out' }, 0)
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#grid-scale',
          start: '% top',
          end: '100% bottom',
          scrub: true,
        },
      })

      floatingWords.forEach((word, i) => {
        gsap.set(`.floating-word-${i}`, word.start)
      })

      tl.fromTo(centeredTextRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })

      tl.to(
        floatingWords.map((_, i) => `.floating-word-${i}`),
        {
          top: '50%',
          left: '50%',
          xPercent: -50,
          yPercent: -50,
          opacity: 0,
          ease: 'power2.inOut',
          stagger: { amount: 0.7, each: 0.1, grid: 'auto', from: 'random' },
        },
        '<'
      )
    })

    return () => ctx.revert()
  }, [floatingWords])

  return (
    <section id="grid-scale" className="h-[400vh] w-full" style={{ backgroundColor: bgColor }}>
      <div className="h-screen w-full sticky top-0 overflow-hidden">
        {/* Expanding clip-path panel */}
        <div
          className="clip-path flex items-center justify-center z-20 absolute top-0 left-0 w-full h-screen bg-white"
          style={{ clipPath: 'inset(20% 35% 20% 35% round 0%)' }}
        >
          <p ref={centeredTextRef} className="opacity-0 w-[60vw] text-center leading-[1.1] text-[3.5vw]" style={{ color: bgColor }}>
            {centeredText}
          </p>
          <p ref={ideaTextRef} className="w-[60vw] absolute top-[35%] left-[48%] -translate-x-1/2 -translate-y-1/2 leading-[1.1] text-[2.5vw] whitespace-pre-line" style={{ color: bgColor }}>
            {ideaText}
          </p>
        </div>

        {/* Grid lines */}
        <div className="grid-line-t w-full h-0.5 origin-center bg-white/10 absolute top-[20%] z-10 left-0" />
        <div className="grid-line-b w-full h-0.5 origin-center bg-white/10 absolute top-[80%] z-10 left-0" />
        <div className="grid-line-l w-0.5 origin-center h-full bg-white/10 absolute top-0 z-10 left-[35%]" />
        <div className="grid-line-r w-0.5 origin-center h-full bg-white/10 absolute top-0 z-10 right-[35%]" />

        {/* Corner boxes */}
        <div className="tl-box absolute w-8 h-8 bg-[#70D6FF]" />
        <div className="tr-box absolute w-8 h-8 bg-[#FF70A6]" />
        <div className="bl-box absolute w-8 h-8 bg-[#C8B6FF]" />
        <div className="br-box absolute w-8 h-8 bg-[#FF9770]" />

        {/* Floating words */}
        {floatingWords.map((word, i) => (
          <div
            key={i}
            className={`floating-word-${i} z-30 absolute px-4 py-1 font-bold text-sm uppercase tracking-wider ${word.color}`}
          >
            <p className="mix-blend-difference text-white">{word.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
