'use client'

import { TransitionRouter } from 'next-transition-router'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const DURATION_LEAVE = 0.6
const DURATION_ENTER = 0.4
const COLOR = '#111111'

// Generate a seeded deterministic shuffle for consistent pixel order per session
function generatePixelOrder(cols, rows, seed = 42) {
  const total = cols * rows
  const indices = Array.from({ length: total }, (_, i) => i)
  // Simple seeded LCG shuffle
  let s = seed
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function easeInQuart(t) {
  return t * t * t * t
}

function easeOutQuart(t) {
  return 1 - (--t) * t * t * t
}

export default function PixelRandom({
  children,
  color = COLOR,
  durationLeave = DURATION_LEAVE,
  durationEnter = DURATION_ENTER,
}) {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const tweenRef = useRef(null)
  const stateRef = useRef({ progress: 0 })
  const pixelOrderRef = useRef(null)

  const getCols = () => (window.innerWidth < 640 ? 12 : 30)
  const getRows = () => (window.innerWidth < 640 ? 22 : 20)

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

    // Regenerate pixel order on resize
    const cols = getCols()
    const rows = getRows()
    pixelOrderRef.current = generatePixelOrder(cols, rows)
  }

  // Draw the pixel grid at a given progress (0 = empty, 1 = full)
  // isEnter = true means we're revealing (dissolving away pixels)
  const drawPixels = (canvas, progress, isEnter) => {
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const cols = getCols()
    const rows = getRows()

    const cellW = w / cols
    const cellH = h / rows
    const total = cols * rows

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = color

    const order = pixelOrderRef.current
    if (!order || order.length !== total) {
      pixelOrderRef.current = generatePixelOrder(cols, rows)
    }

    // Each pixel gets a staggered trigger based on its position in the random order
    // Pixels appear/disappear at different rates to create organic spread effect
    for (let i = 0; i < total; i++) {
      const idx = order ? order[i] : i
      const c = idx % cols
      const r = Math.floor(idx / cols)

      // Stagger: earlier pixels in the order appear first
      // Use a wave-like stagger with slight clustering
      const normalizedPos = i / total

      // Add slight randomness via pixel position hash to break up uniformity
      const posHash = ((c * 7 + r * 13) % 23) / 23
      const staggerStart = normalizedPos * 0.92 + posHash * 0.04
      const staggerEnd = staggerStart + 0.08

      let local = (progress - staggerStart) / (staggerEnd - staggerStart)
      local = Math.max(0, Math.min(1, local))

      const easedLocal = isEnter ? easeOutQuart(local) : easeInOutQuad(local)
      const opacity = isEnter ? 1 - easedLocal : easedLocal

      if (opacity < 0.01) continue

      const x1 = Math.floor(c * cellW)
      const x2 = Math.ceil((c + 1) * cellW)
      const y1 = Math.floor(r * cellH)
      const y2 = Math.ceil((r + 1) * cellH)

      ctx.globalAlpha = opacity
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1)
    }
    ctx.globalAlpha = 1
  }

  const animatePixels = ({ from, to, duration, isEnter, onComplete }) => {
    const canvas = canvasRef.current
    if (!canvas) {
      onComplete()
      return null
    }

    canvas.style.opacity = '1'
    stateRef.current.progress = from
    drawPixels(canvas, from, isEnter)

    tweenRef.current?.kill()

    const tween = gsap.to(stateRef.current, {
      progress: to,
      duration,
      ease: 'none',
      onUpdate: () => drawPixels(canvas, stateRef.current.progress, isEnter),
      onComplete: () => {
        drawPixels(canvas, to, isEnter)
        if (isEnter) canvas.style.opacity = '0'
        onComplete()
      },
    })

    tweenRef.current = tween
    return tween
  }

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      tweenRef.current?.kill()
    }
  }, [])

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const timeline = gsap.timeline({ onComplete: next })

        timeline.fromTo(wrapperRef.current, { opacity: 1, y: 0 }, { opacity: 0, duration: durationLeave, y: -50 }, 0)

        const tween = animatePixels({
          from: 0,
          to: 1,
          duration: durationLeave,
          isEnter: false,
          onComplete: () => {},
        })

        return () => {
          timeline.kill()
          tween?.kill()
        }
      }}
      enter={(next) => {
        const timeline = gsap.timeline({ onComplete: next })

        timeline.fromTo(
          wrapperRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            duration: durationEnter,
            delay: durationLeave,
            y: 0,
            clearProps: 'all',
          },
          0
        )

        const tween = animatePixels({
          from: 0,
          to: 1,
          duration: durationEnter,
          isEnter: true,
          onComplete: () => {},
        })

        return () => {
          timeline.kill()
          tween?.kill()
        }
      }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed top-0 left-0 z-999 h-screen w-screen opacity-0"
      />

      <div className="relative z-2 h-full w-full">
        <div ref={wrapperRef} className="h-full w-full">
          {children}
        </div>
      </div>
    </TransitionRouter>
  )
}
