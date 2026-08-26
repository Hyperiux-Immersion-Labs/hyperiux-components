// Built using Hyperiux Vault: https://vault.hyperiux.com

'use client'

import { TransitionRouter } from 'next-transition-router'
import React, { useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

const DEFAULT_GRID_SIZE = 8
const DEFAULT_COLOR = '#ff5f00'

function clampNumber(value: number | undefined, min: number, max: number, fallback: number): number {
  const next = Number(value)
  if (!Number.isFinite(next)) return fallback
  return Math.min(max, Math.max(min, next))
}

interface ChessGridTransitionProps {
  children?: ReactNode
  duration?: number
  gridSize?: number
  color?: string
}

export default function ChessGridTransition({
  children,
  duration = 1,
  gridSize = DEFAULT_GRID_SIZE,
  color = DEFAULT_COLOR,
}: ChessGridTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)

  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  const safeDuration = clampNumber(duration, 0.25, 3, 1)
  const cols = Math.round(clampNumber(gridSize, 4, 16, DEFAULT_GRID_SIZE))
  const desktopRows = Math.max(2, Math.round(cols * 0.5))
  const mobileRows = Math.max(4, Math.round(cols * 1.125))
  const tabletRows = Math.max(4, Math.round(cols * 1.25))
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

  const getRowCells = (cells: HTMLCollection, rowIndex: number) => {
    const rowCells = []
    for (let col = 0; col < cols; col++) {
      rowCells.push(cells[rowIndex * cols + col])
    }
    return rowCells
  }

  const buildAnimation = (tl: gsap.core.Timeline, cells: HTMLCollection, direction = 1) => {
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
              duration: 0.8 * safeDuration,
              ease: 'power2.out',
            },
            delay
          )
        } else {
          tl.to(
            cell,
            {
              xPercent: -(colIndex + 2) * 100,
              duration: 0.8 * safeDuration,
              ease: 'power2.in',
            },
            delay
          )
        }
      })
    })
  }

  useEffect(() => {
    const cells = (gridRef.current as HTMLDivElement).children

    Array.from(cells).forEach((cell, i) => {
      const colIndex = i % cols
      gsap.set(cell, { xPercent: -(colIndex + 2) * 100 })
    })

    setMounted(true)
  }, [cols, rows])

  const totalCells = cols * rows

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const tl = gsap.timeline({ onComplete: next })

        if (prefersReducedMotion()) {
          tl.to(wrapperRef.current, { opacity: 0, duration: 0.2, ease: 'power1.out' }, 0)
          return () => tl.kill()
        }

        const cells = (gridRef.current as HTMLDivElement).children

        tl.to(wrapperRef.current, { opacity: 0, duration: 0.8 * safeDuration }, 0)

        buildAnimation(tl, cells, 1)
        return () => tl.kill()
      }}
      enter={(next) => {
        const tl = gsap.timeline({ onComplete: next })

        if (prefersReducedMotion()) {
          tl.to(wrapperRef.current, { opacity: 1, duration: 0.2, ease: 'power1.out', clearProps: 'all' }, 0)
          return () => tl.kill()
        }

        const cells = (gridRef.current as HTMLDivElement).children

        tl.fromTo(
          wrapperRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 * safeDuration, delay: safeDuration, clearProps: 'all' },
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
              className='absolute shrink-0'
              style={{
                backgroundColor: color,
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
        <div ref={wrapperRef} className='h-full w-full will-change-transform'>
          {children}
        </div>
      </div>


    </TransitionRouter>
  )
}
