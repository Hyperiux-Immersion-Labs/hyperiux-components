'use client'

import { TransitionRouter } from 'next-transition-router'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'

export default function ChessGridTransition({ children, enableContentShift = false }) {
  const wrapperRef = useRef(null)
  const gridRef = useRef(null)
  const bgRef = useRef(null)

  const [mounted, setMounted] = useState(false)

  const cols = 8
  const rows = 4

  // Slight overlap to avoid visible gaps on some screens
  const overlap = 2

  // Helper to get cells for a specific row (0-indexed)
  const getRowCells = (cells, rowIndex) => {
    const rowCells = []

    for (let col = 0; col < cols; col++) {
      rowCells.push(cells[rowIndex * cols + col])
    }

    return rowCells
  }

  // Build animation with direction: 1 = enter (slide in), -1 = exit (slide out)
  const buildAnimation = (tl, cells, direction = 1) => {
    const rowsArr = [0, 1, 2, 3]

    rowsArr.forEach((rowIndex, rowOrderIndex) => {
      const rowCells = getRowCells(cells, rowIndex)

      rowCells.forEach((cell, colIndex) => {
        const delay = rowOrderIndex * 0.1 + colIndex * 0.1

        if (direction === 1) {
          const translateAmount = (cols - colIndex + 1) * 100

          tl.fromTo(
            cell,
            { xPercent: translateAmount },
            {
              xPercent: 0,
              duration: 0.8,
              ease: 'power2.out',
            },
            delay
          )
        } else {
          tl.to(
            cell,
            {
              xPercent: -(colIndex + 2) * 100,
              duration: 0.8,
              ease: 'power2.in',
            },
            delay
          )
        }
      })
    })
  }

  useEffect(() => {
    const cells = gridRef.current.children

    Array.from(cells).forEach((cell, i) => {
      const colIndex = i % cols

      // Push fully outside viewport to avoid thin visible line
      gsap.set(cell, { xPercent: -(colIndex + 2) * 100 })
    })

    setMounted(true)
  }, [])

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const cells = gridRef.current.children

        const tl = gsap.timeline({ onComplete: next })

        // Always fade out content on exit
        tl.fromTo(
          [wrapperRef.current, bgRef.current],
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            duration: 0.8,
            y: -50,
          },
          0
        )

        buildAnimation(tl, cells, 1)

        return () => tl.kill()
      }}
      enter={(next) => {
        const cells = gridRef.current.children

        const tl = gsap.timeline({ onComplete: next })

        // Always fade in content on enter
        tl.fromTo(
          [wrapperRef.current, bgRef.current],
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            duration: 0.8,
            delay: 1,
            y: 0,
            clearProps: 'all',
          },
          0
        )

        buildAnimation(tl, cells, -1)

        return () => tl.kill()
      }}
    >
      <div
        ref={gridRef}
        className={`h-screen w-screen fixed top-0 left-0 z-999 pointer-events-none flex flex-wrap overflow-hidden ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {Array.from({ length: cols * rows }).map((_, i) => {
          const colIndex = i % cols
          const rowIndex = Math.floor(i / cols)

          return (
            <span
              key={i}
              className='bg-[#ff5f00] absolute shrink-0'
              style={{
                width: `calc((100vw / ${cols}) + ${overlap}px)`,
                height: `calc((100vh / ${rows}) + ${overlap}px)`,
                left: `calc(${colIndex} * (100vw / ${cols}) - ${overlap / 2}px)`,
                top: `calc(${rowIndex} * (100vh / ${rows}) - ${overlap / 2}px)`,
              }}
            ></span>
          )
        })}
      </div>

      <div className='h-full w-full relative z-2'>
        <div ref={wrapperRef} className='h-full w-full'>
          {children}
        </div>
      </div>

      <div ref={bgRef} className='w-screen h-screen fixed inset-0 '>
        <Image
          src={'/assets/heroo-bg.png'}
          alt='image'
          width={1920}
          height={1080}
          className='w-full h-full object-cover'
        />
      </div>

      {/* <div className='pointer-events-none fixed inset-0 bg-black/30' /> */}
    </TransitionRouter>
  )
}