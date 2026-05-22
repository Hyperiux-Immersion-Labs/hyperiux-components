'use client'

import { TransitionRouter } from 'next-transition-router'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function FlipTransition({
  children,
  duration = 0.9,
  bgColor = '#ff5f00',
}) {
  const wrapperRef = useRef(null)
  const exitOverlayRef = useRef(null)
  const enterOverlayRef = useRef(null)
  const boxesRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // EXIT overlay: hidden — folded off-screen to the left (-90deg from bottom-left)
    gsap.set(exitOverlayRef.current, {
      rotation: -90,
      transformOrigin: 'bottom left',
    })

    // ENTER overlay: hidden — folded off-screen (-90deg from bottom-right)
    gsap.set(enterOverlayRef.current, {
      rotation: -90,
      transformOrigin: 'bottom right',
    })

    // Boxes hidden initially
    gsap.set(boxesRef.current.children, { scaleY: 0 })

    setMounted(true)
  }, [])

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        document.documentElement.style.overflow = 'hidden'
        const tl = gsap.timeline({ onComplete: next })

        // Fade + shift old content out
        tl.to(wrapperRef.current, {
          opacity: 0,
          y: -40,
          duration: 0.5,
          ease: 'power2.in',
        }, 0)

        // Keep enter overlay hidden during exit
        tl.set(enterOverlayRef.current, { rotation: -90, transformOrigin: 'bottom right' }, 0)

        // EXIT: bottom-left origin, -90deg → 0deg
        tl.fromTo(
          exitOverlayRef.current,
          { rotation: -90, transformOrigin: 'bottom left' },
          { rotation: 0, transformOrigin: 'bottom left', duration, ease: 'power3.inOut' },
          0
        )

        // Boxes scale up from bottom once overlay is mostly covering screen
        tl.to(boxesRef.current.children, {
          scaleY: 1,
          transformOrigin: 'bottom',
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        }, 0.5)

        return () => tl.kill()
      }}
      enter={(next) => {
        const tl = gsap.timeline({
          onComplete: () => {
            document.documentElement.style.overflow = ''
            next()
          },
        })

        // Snap exit overlay away
        tl.set(exitOverlayRef.current, { rotation: -90, transformOrigin: 'bottom left' }, 0)

        // Snap enter overlay flat (covering screen)
        tl.set(enterOverlayRef.current, { rotation: 0, transformOrigin: 'bottom right' }, 0)

        // Boxes scale down from top first
        tl.to(boxesRef.current.children, {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 0.35,
          stagger: 0.06,
          ease: 'power2.in',
        }, 0)

        // Fade new content in
        tl.fromTo(wrapperRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: "all" },
          0.45
        )

        // ENTER: bottom-right origin, 0deg → +90deg (clockwise)
        tl.fromTo(
          enterOverlayRef.current,
          { rotation: 0, transformOrigin: 'bottom right' },
          { rotation: 90, transformOrigin: 'bottom right', duration, ease: 'power3.inOut' },
          0.3
        )

        return () => tl.kill()
      }}
    >
      {/* EXIT overlay — bottom-left anchor */}
      <div
        ref={exitOverlayRef}
        className="fixed bottom-0 left-0 pointer-events-none"
        style={{
          width: '150vmax',
          height: '150vmax',
          transformOrigin: 'bottom left',
          zIndex: 9999,
          opacity: mounted ? 1 : 0,
          backgroundColor: bgColor,
          overflow: 'hidden',
        }}
      />

      {/* ENTER overlay — bottom-right anchor */}
      <div
        ref={enterOverlayRef}
        className="fixed bottom-0 right-0 pointer-events-none"
        style={{
          width: '150vmax',
          height: '150vmax',
          transformOrigin: 'bottom right',
          zIndex: 9998,
          opacity: mounted ? 1 : 0,
          backgroundColor: bgColor,
          overflow: 'hidden',
        }}
      />

      {/* Boxes — fixed to screen center, above both overlays */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 10000 }}
      >
        <div ref={boxesRef} className="flex gap-2">
          <span className="block w-4 h-7 bg-black scale-y-0" />
          <span className="block w-4 h-7 bg-black scale-y-0" />
          <span className="block w-4 h-7 bg-black scale-y-0" />
          <span className="block w-4 h-7 bg-black scale-y-0" />
        </div>
      </div>

      {/* Page content */}
      <div ref={wrapperRef} className="relative w-full min-h-screen" style={{ zIndex: 2 }}>
        {children}
      </div>
    </TransitionRouter>
  )
}