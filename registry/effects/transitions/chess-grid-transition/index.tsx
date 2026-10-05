// Built using Hyperiux Vault: https://vault.hyperiux.com
'use client'
import { useSyncExternalStore } from "react";

import { TransitionRouter } from 'next-transition-router'
import React, { useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
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

type TransitionPhase = 'leave' | 'enter'

export default function ChessGridTransition({
  children,
  duration = 1,
  gridSize = DEFAULT_GRID_SIZE,
  color = DEFAULT_COLOR,
}: ChessGridTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null)

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


  const geometryRef = useRef({ cols, rows, safeDuration })
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const phaseRef = useRef<TransitionPhase | null>(null)
  const doneRef = useRef<(() => void) | null>(null)

  const getRowCells = (cells: HTMLCollection, rowIndex: number, cols: number) => {
    const rowCells = []
    for (let col = 0; col < cols; col++) {
      rowCells.push(cells[rowIndex * cols + col])
    }
    return rowCells
  }

  const buildAnimation = (tl: gsap.core.Timeline, cells: HTMLCollection, direction = 1) => {
    const { cols, rows, safeDuration } = geometryRef.current
    const rowsArr = Array.from({ length: rows }, (_, i) => i)

    rowsArr.forEach((rowIndex, rowOrderIndex) => {
      const rowCells = getRowCells(cells, rowIndex, cols)

      rowCells.forEach((cell, colIndex) => {
        if (!cell) return

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

  const resetCells = () => {
    const grid = gridRef.current
    if (!grid) return

    const { cols } = geometryRef.current

    Array.from(grid.children).forEach((cell, i) => {
      const colIndex = i % cols
      gsap.set(cell, { xPercent: -(colIndex + 2) * 100 })
    })
  }

  const finishTransition = () => {
    const done = doneRef.current
    timelineRef.current = null
    phaseRef.current = null
    doneRef.current = null
    done?.()
  }

  const runPhase = (phase: TransitionPhase) => {
    const grid = gridRef.current
    if (!grid) return

    timelineRef.current?.kill()

    const { safeDuration } = geometryRef.current
    const tl = gsap.timeline({ onComplete: finishTransition })

    timelineRef.current = tl
    phaseRef.current = phase

    if (prefersReducedMotion()) {
      tl.to(
        wrapperRef.current,
        phase === 'leave'
          ? { opacity: 0, duration: 0.2, ease: 'power1.out' }
          : { opacity: 1, duration: 0.2, ease: 'power1.out', clearProps: 'all' },
        0
      )
      return
    }

    const cells = grid.children

    if (phase === 'leave') {
      tl.to(wrapperRef.current, { opacity: 0, duration: 0.8 * safeDuration }, 0)
      buildAnimation(tl, cells, 1)
      return
    }

    gsap.set(cells, { xPercent: 0 })

    tl.fromTo(
      wrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 * safeDuration, delay: safeDuration, clearProps: 'all' },
      0
    )
    buildAnimation(tl, cells, -1)
  }

  const startTransition = (phase: TransitionPhase, next: () => void) => {
    doneRef.current = next
    runPhase(phase)

    return () => {
      timelineRef.current?.kill()
      timelineRef.current = null
      phaseRef.current = null
      doneRef.current = null
    }
  }

  useEffect(() => {
    geometryRef.current = { cols, rows, safeDuration }

    // A geometry change while a transition is running means the old cells are
    // gone; replay the active phase on the new ones instead of parking them
    // offscreen, which would strand the overlay and never call next().
    if (phaseRef.current) {
      runPhase(phaseRef.current)
    } else {
      resetCells()
    }


    setMounted(true)

  }, [cols, rows, safeDuration])

  const totalCells = cols * rows

  return (
    <TransitionRouter
      auto
      leave={(next) => startTransition('leave', next)}
      enter={(next) => startTransition('enter', next)}
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
