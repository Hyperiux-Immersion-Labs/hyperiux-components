'use client'

import { TransitionRouter } from 'next-transition-router'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const COLS = 30
const ROWS = 40
const COLOR = '#111111'
const DURATION_LEAVE = 1.0
const DURATION_ENTER = 0.8

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function drawGrid(canvas, progress, isEnter, cols = COLS, rows = ROWS, fromTopLeft = false) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  const cellW = w / cols
  const cellH = h / rows
  const totalDiag = cols + rows

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = COLOR

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const rFlipped = rows - 1 - r
      const diag = fromTopLeft ? c + r : c + rFlipped
      const cellDelay = (diag / totalDiag) * 0.45
      const fast = (c + r) % 2 === 0
      const speed = fast ? 0.28 : 0.36

      let local = Math.max(0, Math.min(1, (progress - cellDelay) / speed))
      local = easeInOut(local)

      const fillAmount = isEnter ? 1 - local : local
      if (fillAmount <= 0.001) continue

      const x1 = Math.floor(c * cellW)
      const x2 = Math.floor((c + 1) * cellW)
      const y1 = Math.floor(r * cellH)
      const y2 = Math.floor((r + 1) * cellH)
      const cellDrawH = y2 - y1
      const fillH = Math.ceil(cellDrawH * fillAmount)

      ctx.fillRect(x1, y2 - fillH, x2 - x1, fillH)
    }
  }
}

export function PixelTransition({
  children,
  cols = COLS,
  rows = ROWS,
  enableContentShift = false,
}) {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const tweenRef = useRef(null)
  const stateRef = useRef({ progress: 0 })

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = Math.ceil(w * dpr)
    canvas.height = Math.ceil(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const animateGrid = ({ from, to, duration, isEnter, fromTopLeft = false, onComplete }) => {
    const canvas = canvasRef.current
    if (!canvas) { onComplete(); return null }

    canvas.style.opacity = '1'
    stateRef.current.progress = from
    drawGrid(canvas, from, isEnter, cols, rows, fromTopLeft)

    tweenRef.current?.kill()
    const tween = gsap.to(stateRef.current, {
      progress: to,
      duration,
      ease: 'none',
      onUpdate: () => drawGrid(canvas, stateRef.current.progress, isEnter, cols, rows, fromTopLeft),
      onComplete: () => {
        drawGrid(canvas, to, isEnter, cols, rows, fromTopLeft)
        if (isEnter) canvas.style.opacity = '0'
        onComplete()
      },
    })
    tweenRef.current = tween
    return tween
  }

  useEffect(() => {
    resizeCanvas()
    drawGrid(canvasRef.current, 0, false, cols, rows)
    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      tweenRef.current?.kill()
    }
  }, [cols, rows])

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const timeline = gsap.timeline()

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { xPercent: 0, filter: 'blur(0px)', opacity: 1 },
            { xPercent: 4, filter: 'blur(2px)', opacity: 0.82, duration: DURATION_LEAVE, ease: 'power2.inOut' },
            0
          )
        }

        const tween = animateGrid({
          from: 0,
          to: 1,
          duration: DURATION_LEAVE,
          isEnter: false,
          onComplete: next,
        })

        return () => { timeline.kill(); tween?.kill() }
      }}
      enter={(next) => {
        const timeline = gsap.timeline()

        if (enableContentShift) {
          timeline.fromTo(
            wrapperRef.current,
            { xPercent: -3, filter: 'blur(2px)', opacity: 0.86 },
            { xPercent: 0, filter: 'blur(0px)', opacity: 1, duration: DURATION_ENTER, ease: 'power2.out' },
            0
          )
        }

        const tween = animateGrid({
          from: 0,
          to: 1,
          duration: DURATION_ENTER,
          isEnter: true,
          fromTopLeft: true,
          onComplete: next,
        })

        return () => { timeline.kill(); tween?.kill() }
      }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed top-0 left-0 z-999 h-screen w-screen opacity-0"
      />
      <div className="relative h-full w-full">
        <div ref={wrapperRef} className="h-full w-full will-change-transform">
          {children}
        </div>
      </div>
    </TransitionRouter>
  )
}
