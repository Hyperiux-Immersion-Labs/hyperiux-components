'use client'

import { TransitionRouter } from 'next-transition-router'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function PageFlipTransition({
  children,
  config = {
    enableBlur: false,
    overlayColor: '#DE4013',
    duration: 0.5,
  },
}) {
  const { enableBlur, overlayColor, duration } = config
  const blackOverlayRef = useRef(null)
  const flipOverlayRef = useRef(null)
  const boxesRef = useRef(null)

  useEffect(() => {
    gsap.set(blackOverlayRef.current, { opacity: 0 })
    gsap.set(flipOverlayRef.current, {
      clipPath: 'polygon(0 0, 100% 0, 0 0, 0 100%)',
      opacity: 1,
    })
    gsap.set(boxesRef.current.children, { scaleY: 0 })
  }, [])

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const timeline = gsap.timeline({ onComplete: next })

        timeline
          .to(
            blackOverlayRef.current,
            {
              opacity: 1,
              duration: 0.3,
              ease: 'power2.inOut',
            },
            0
          )
          .to(
            flipOverlayRef.current,
            {
              clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%)',
              duration,
              ease: 'linear',
            },
            0
          )
          .to(flipOverlayRef.current, {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration,
            ease: 'linear',
          })
          .to(
            boxesRef.current.children,
            {
              scaleY: 1,
              opacity: 1,
              transformOrigin: 'bottom',
              duration,
              stagger: 0.1,
              ease: 'power2.out',
            },
            '-=0.3'
          )

        return () => timeline.kill()
      }}
      enter={(next) => {
        const timeline = gsap.timeline({ onComplete: next })

        timeline.to(boxesRef.current.children, {
          scaleY: 0,
          transformOrigin: 'top',
          duration,
          stagger: 0.05,
          ease: 'power2.in',
        })
        timeline.to(flipOverlayRef.current, {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)',
          duration,
          delay: 0.3,
          ease: 'linear',
        })
        timeline.to(flipOverlayRef.current, {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 100% 0)',
          duration,
          ease: 'linear',
        })
        timeline.to(blackOverlayRef.current, {
          duration,
          opacity: 0,
          ease: 'power2.inOut',
        })
        timeline.set(flipOverlayRef.current, {
          clipPath: 'polygon(0 0, 100% 0, 0 0, 0 100%)',
        })

        return () => timeline.kill()
      }}
    >
      <div
        ref={blackOverlayRef}
        className={`pointer-events-none fixed inset-0 z-[998] bg-black/20 opacity-0 ${
          enableBlur ? 'backdrop-blur-xl' : ''
        }`}
      />

      <div
        ref={flipOverlayRef}
        className="fixed top-0 left-0 z-[999] flex h-full w-full items-center justify-center opacity-0"
        style={{ backgroundColor: overlayColor }}
      >
        <div ref={boxesRef} className="flex h-fit w-fit gap-2">
          <span className="block h-7 w-4 bg-black" />
          <span className="block h-7 w-4 bg-black" />
          <span className="block h-7 w-4 bg-black" />
          <span className="block h-7 w-4 bg-black" />
        </div>
      </div>

      <div>{children}</div>
    </TransitionRouter>
  )
}
