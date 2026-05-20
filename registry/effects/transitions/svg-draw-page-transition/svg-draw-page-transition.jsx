'use client'

import { TransitionRouter } from 'next-transition-router'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(DrawSVGPlugin)

export default function SvgDrawPageTransition({
  children,
  config = {
    enableBlur: false,
    strokeColor: '#82A0FF',
    strokeWidth: 2,
    duration: 1.5,
  },
}) {
  const { enableBlur, strokeColor, strokeWidth, duration } = config
  const overlayRef = useRef(null)
  const pathRef = useRef(null)

  useEffect(() => {
    if (!pathRef.current) return

    gsap.set(pathRef.current, {
      drawSVG: '0%',
      strokeWidth,
    })

    gsap.config({ force3D: true })
  }, [strokeWidth])

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const timeline = gsap.timeline({ onComplete: next })

        timeline
          .to(overlayRef.current, {
            opacity: 1,
            backdropFilter: enableBlur ? 'blur(10px)' : 'none',
            duration: 0.5,
            ease: 'power2.inOut',
          })
          .to(
            pathRef.current,
            {
              drawSVG: '100%',
              strokeWidth: 300,
              duration,
              ease: 'power2.inOut',
            },
            0
          )

        return () => timeline.kill()
      }}
      enter={(next) => {
        const timeline = gsap.timeline({ onComplete: next })

        timeline
          .to(pathRef.current, {
            drawSVG: '100% 100%',
            strokeWidth,
            duration,
            ease: 'power2.inOut',
          })
          .to(
            overlayRef.current,
            {
              opacity: 0,
              backdropFilter: enableBlur ? 'blur(10px)' : 'none',
              duration: 0.5,
              ease: 'power2.inOut',
            },
            1
          )
          .set(pathRef.current, {
            drawSVG: '0%',
            strokeWidth,
          })

        return () => timeline.kill()
      }}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center opacity-0"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1316 664"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full scale-[1.3]"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            ref={pathRef}
            d="M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {children}
    </TransitionRouter>
  )
}
