'use client'

import { TransitionRouter } from 'next-transition-router'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ChessGridTransition({
  children,
  enableContentShift = false,
  columns = 8,
  rows = 4,
  cellClassName = 'bg-blue-500',
}) {
  const wrapperRef = useRef(null)
  const gridRef = useRef(null)

  const getRowCells = (cells, rowIndex) => {
    const rowCells = []
    for (let column = 0; column < columns; column += 1) {
      rowCells.push(cells[rowIndex * columns + column])
    }
    return rowCells
  }

  const buildAnimation = (timeline, cells, direction = 1) => {
    const rowIndexes = Array.from({ length: rows }, (_, index) => index)

    rowIndexes.forEach((rowIndex, rowOrderIndex) => {
      const rowCells = getRowCells(cells, rowIndex)

      rowCells.forEach((cell, columnIndex) => {
        const delay = rowOrderIndex * 0.1 + columnIndex * 0.1

        if (direction === 1) {
          const translateAmount = (columns - columnIndex) * 100
          timeline.fromTo(
            cell,
            { xPercent: translateAmount },
            { xPercent: 0, duration: 0.8, ease: 'power2.out' },
            delay
          )
          return
        }

        timeline.to(
          cell,
          {
            xPercent: -(columnIndex + 1) * 100,
            duration: 0.8,
            ease: 'power2.in',
          },
          delay
        )
      })
    })
  }

  useEffect(() => {
    const cells = gridRef.current?.children
    if (!cells) return

    Array.from(cells).forEach((cell, index) => {
      const columnIndex = index % columns
      gsap.set(cell, { xPercent: -(columnIndex + 1) * 100 })
    })
  }, [columns])

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const cells = gridRef.current.children
        const timeline = gsap.timeline({ onComplete: next })

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { xPercent: 0, filter: 'blur(0px)', opacity: 1 },
            {
              xPercent: -15,
              filter: 'blur(8px)',
              opacity: 0,
              duration: 0.7,
              ease: 'linear',
            },
            0
          )
        }

        buildAnimation(timeline, cells, 1)
        return () => timeline.kill()
      }}
      enter={(next) => {
        const cells = gridRef.current.children
        const timeline = gsap.timeline({ onComplete: next })

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { xPercent: 15, filter: 'blur(12px)', opacity: 0 },
            {
              xPercent: 0,
              filter: 'blur(0px)',
              opacity: 1,
              duration: 0.7,
              delay: 0.3,
              ease: 'linear',
            },
            0
          )
        }

        buildAnimation(timeline, cells, -1)
        return () => timeline.kill()
      }}
    >
      <div
        ref={gridRef}
        className="pointer-events-none fixed top-0 left-0 z-[999] flex h-screen w-screen flex-wrap"
      >
        {Array.from({ length: columns * rows }).map((_, index) => (
          <span
            key={index}
            className={`${cellClassName} block`}
            style={{
              width: `calc(100vw / ${columns})`,
              height: `calc(100vh / ${rows})`,
            }}
          />
        ))}
      </div>

      <div className="relative h-full w-full">
        <div ref={wrapperRef} className="h-full w-full will-change-transform">
          {children}
        </div>
      </div>
    </TransitionRouter>
  )
}
