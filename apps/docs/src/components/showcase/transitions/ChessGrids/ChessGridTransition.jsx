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
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  const cols = 8
  const desktopRows = 4
  const mobileRows = 9
  const tabletRows = 10
  const overlap = 2

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth
      setIsMobile(width <= 639)
      setIsTablet(width > 639 && width <= 1025)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const rows = isMobile ? mobileRows : isTablet ? tabletRows : desktopRows

  const getRowCells = (cells, rowIndex) => {
    const rowCells = []
    for (let col = 0; col < cols; col++) {
      rowCells.push(cells[rowIndex * cols + col])
    }
    return rowCells
  }

  const buildAnimation = (tl, cells, direction = 1) => {
    const rowsArr = Array.from({ length: rows }, (_, i) => i)

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
      gsap.set(cell, { xPercent: -(colIndex + 2) * 100 })
    })

    setMounted(true)
  }, [rows])

  const totalCells = cols * rows

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const cells = gridRef.current.children
        const tl = gsap.timeline({ onComplete: next })

        tl.fromTo(
          [wrapperRef.current, bgRef.current],
          { opacity: 1, y: 0 },
          { opacity: 0, duration: 0.8, y: -50 },
          0
        )

        buildAnimation(tl, cells, 1)
        return () => tl.kill()
      }}
      enter={(next) => {
        const cells = gridRef.current.children
        const tl = gsap.timeline({ onComplete: next })

        tl.fromTo(
          [wrapperRef.current, bgRef.current],
          { opacity: 0, y: 50 },
          { opacity: 1, duration: 0.8, delay: 1, y: 0, clearProps: 'all' },
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
        {Array.from({ length: totalCells }).map((_, i) => {
          const colIndex = i % cols
          const rowIndex = Math.floor(i / cols)

          return (
            <span
              key={i}
              className='bg-[#ff5f00] absolute shrink-0'
              style={{
                width: `calc((100vw / ${cols}) * ${isMobile ? 1.6 : 1} + ${overlap}px)`,
                height: `calc(100vh / ${rows} + ${overlap}px)`,
                left: `calc(${colIndex} * (100vw / ${cols}) * ${isMobile ? 1.6 : 1} - ${overlap / 2}px)`,
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

    
    </TransitionRouter>
  )
}
