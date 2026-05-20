'use client'

import { TransitionRouter } from 'next-transition-router'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const ROWS = 5
const COLOR = '#000000'

export default function BlockTransition({ children, enableContentShift = false }) {
  const wrapperRef = useRef(null)
  const rowRefs = useRef([])

  const getRows = () => rowRefs.current.filter(Boolean)

  const buildRowsAnimation = (timeline, direction) => {
    const rows = getRows()
    const orderedRows = direction === 'cover' ? rows : [...rows].reverse()

    orderedRows.forEach((row, index) => {
      const [leftBlock, rightBlock] = row.children
      const delay = index * 0.12

      if (direction === 'cover') {
        timeline.set([leftBlock, rightBlock], { autoAlpha: 1 }, delay)
        timeline.to(
          [leftBlock, rightBlock],
          {
            xPercent: 0,
            duration: 0.72,
            ease: 'power3.inOut',
          },
          delay
        )
      } else {
        timeline.to(
          leftBlock,
          {
            xPercent: -101,
            duration: 0.68,
            ease: 'power3.inOut',
          },
          delay
        )
        timeline.set(leftBlock, { autoAlpha: 0 }, delay + 0.68)

        timeline.to(
          rightBlock,
          {
            xPercent: 101,
            duration: 0.68,
            ease: 'power3.inOut',
          },
          delay
        )
        timeline.set(rightBlock, { autoAlpha: 0 }, delay + 0.68)
      }
    })
  }

  useLayoutEffect(() => {
    rowRefs.current.filter(Boolean).forEach((row) => {
      const [leftBlock, rightBlock] = row.children
      if (!leftBlock || !rightBlock) return

      gsap.set(leftBlock, {
        xPercent: -101,
        autoAlpha: 0,
      })

      gsap.set(rightBlock, {
        xPercent: 101,
        autoAlpha: 0,
      })
    })
  }, [])

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const timeline = gsap.timeline({ onComplete: next })

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { scale: 1, filter: 'blur(0px)', opacity: 1 },
            {
              scale: 0.98,
              filter: 'blur(4px)',
              opacity: 0.85,
              duration: 0.7,
              ease: 'power2.inOut',
            },
            0
          )
        }

        buildRowsAnimation(timeline, 'cover')

        return () => timeline.kill()
      }}
      enter={(next) => {
        const timeline = gsap.timeline({ onComplete: next })

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { scale: 1.02, filter: 'blur(4px)', opacity: 0.85 },
            {
              scale: 1,
              filter: 'blur(0px)',
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
            },
            0.08
          )
        }

        buildRowsAnimation(timeline, 'reveal')

        return () => timeline.kill()
      }}
    >
      <div className='pointer-events-none fixed inset-0 z-999 overflow-hidden'>
        {Array.from({ length: ROWS }).map((_, index) => (
          <div
            key={index}
            ref={(node) => {
              rowRefs.current[index] = node
            }}
            className='absolute left-0 w-full overflow-hidden'
            style={{
              top: `${(index * 100) / ROWS}%`,
              height: `calc(${100 / ROWS}% + 2px)`,
            }}
          >
            <span
              className='absolute top-0 left-0 h-full will-change-transform'
              style={{
                width: '51%',
                backgroundColor: COLOR,
                opacity: 0,
                visibility: 'hidden',
              }}
            />

            <span
              className='absolute top-0 right-0 h-full will-change-transform'
              style={{
                width: '51%',
                backgroundColor: COLOR,
                opacity: 0,
                visibility: 'hidden',
              }}
            />
          </div>
        ))}
      </div>

      <div className='relative h-full w-full'>
        <div ref={wrapperRef} className='h-full w-full will-change-transform'>
          {children}
        </div>
      </div>
    </TransitionRouter>
  )
}