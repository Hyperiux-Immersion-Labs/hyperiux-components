"use client"

import { useEffect, useRef, useState } from "react"

const GRID_SIZE = 35
const EFFECT_RADIUS = 40
const MAX_TRAIL_LENGTH = 8
const CELL_LIFETIME = 100

function createTracker() {
  const handlersByEl = new WeakMap()
  let targets = []
  let hoveredTarget = null
  let needsBoundsUpdate = true
  let listenersAttached = false
  let refreshPending = false
  let mouseX = 0
  let mouseY = 0

  const toCachedRect = (el) => {
    const rect = el.getBoundingClientRect()
    return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
  }

  const refreshTargets = () => {
    const els = Array.from(document.querySelectorAll(".fx-target")).filter((el) => handlersByEl.has(el))
    targets = els.map((el) => ({ el, rect: toCachedRect(el) }))
    hoveredTarget = targets.find((target) => target.el === hoveredTarget?.el) || null
    needsBoundsUpdate = false
  }

  const scheduleRefreshTargets = () => {
    if (refreshPending) return
    refreshPending = true
    requestAnimationFrame(() => {
      refreshPending = false
      refreshTargets()
    })
  }

  const updateBoundsIfNeeded = () => {
    if (!needsBoundsUpdate) return
    for (const target of targets) target.rect = toCachedRect(target.el)
    needsBoundsUpdate = false
  }

  const updateHoverAndNotify = () => {
    updateBoundsIfNeeded()
    let nextHovered = null
    for (const target of targets) {
      if (mouseX >= target.rect.left && mouseX <= target.rect.right && mouseY >= target.rect.top && mouseY <= target.rect.bottom) {
        nextHovered = target
        break
      }
    }

    if (nextHovered !== hoveredTarget) {
      handlersByEl.get(hoveredTarget?.el)?.onLeave?.()
      handlersByEl.get(nextHovered?.el)?.onEnter?.()
      hoveredTarget = nextHovered
    }

    if (hoveredTarget) {
      handlersByEl.get(hoveredTarget.el)?.onMove?.({
        localX: mouseX - hoveredTarget.rect.left,
        localY: mouseY - hoveredTarget.rect.top,
        rect: hoveredTarget.rect,
      })
    }
  }

  const attachListeners = () => {
    if (listenersAttached) return
    listenersAttached = true

    const markNeedsUpdate = () => {
      needsBoundsUpdate = true
    }

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX
      mouseY = event.clientY
      updateHoverAndNotify()
    }, { passive: true })
    window.addEventListener("resize", markNeedsUpdate, { passive: true })
    window.addEventListener("scroll", markNeedsUpdate, { passive: true, capture: true })
  }

  return {
    register(el, handlers = {}) {
      handlersByEl.set(el, handlers)
      attachListeners()
      scheduleRefreshTargets()
    },
    unregister(el) {
      handlersByEl.delete(el)
      scheduleRefreshTargets()
    },
  }
}

const tracker = typeof window !== "undefined" ? createTracker() : null

export default function FiddleAsciiCursor({
  src,
  type = "video",
  className = "h-[30vw] w-auto aspect-video",
  gridSize = GRID_SIZE,
  effectRadius = EFFECT_RADIUS,
  maxTrailLength = MAX_TRAIL_LENGTH,
  cellLifetime = CELL_LIFETIME,
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const mediaRef = useRef(null)
  const [gridImages, setGridImages] = useState([])
  const animationRef = useRef(null)
  const cellImageMapRef = useRef(new Map())
  const trailRef = useRef([])

  useEffect(() => {
    const images = []
    let loadedCount = 0

    for (let index = 1; index <= 10; index += 1) {
      const image = new Image()
      image.src = `/assets/cursors/FeddleAsciCursor/grid-${index}.jpg`
      image.onload = () => {
        loadedCount += 1
        if (loadedCount === 10) setGridImages(images)
      }
      images.push(image)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !tracker) return

    tracker.register(container, {
      onMove: ({ localX, localY }) => {
        const now = Date.now()
        const rand = () => Math.random() - 0.5
        trailRef.current.unshift({ x: localX + rand() * 30, y: localY + rand() * 30, timestamp: now })
        for (let index = 0; index < 2; index += 1) {
          trailRef.current.unshift({ x: localX + rand() * 60, y: localY + rand() * 60, timestamp: now })
        }
        if (trailRef.current.length > maxTrailLength) trailRef.current.length = maxTrailLength
      },
    })

    return () => tracker.unregister(container)
  }, [maxTrailLength])

  useEffect(() => {
    const canvas = canvasRef.current
    const media = mediaRef.current
    const container = containerRef.current
    if (!canvas || !media || !container || gridImages.length === 0) return

    const context = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    const drawMediaCover = (element, width, height) => {
      const mediaWidth = type === "video" ? element.videoWidth : element.naturalWidth
      const mediaHeight = type === "video" ? element.videoHeight : element.naturalHeight
      if (!mediaWidth || !mediaHeight) {
        context.drawImage(element, 0, 0, width, height)
        return
      }

      const mediaAspect = mediaWidth / mediaHeight
      const canvasAspect = width / height
      let srcX
      let srcY
      let srcW
      let srcH

      if (mediaAspect > canvasAspect) {
        srcH = mediaHeight
        srcW = mediaHeight * canvasAspect
        srcX = (mediaWidth - srcW) / 2
        srcY = 0
      } else {
        srcW = mediaWidth
        srcH = mediaWidth / canvasAspect
        srcX = 0
        srcY = (mediaHeight - srcH) / 2
      }

      context.drawImage(element, srcX, srcY, srcW, srcH, 0, 0, width, height)
    }

    const render = () => {
      const rect = container.getBoundingClientRect()
      const now = Date.now()
      const width = rect.width
      const height = rect.height

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawMediaCover(media, width, height)

      trailRef.current = trailRef.current.filter((point) => now - point.timestamp < cellLifetime)

      const affectedCells = new Map()
      for (const { x, y, timestamp } of trailRef.current) {
        if (x < 0 || x > width || y < 0 || y > height) continue
        const radius = effectRadius * (0.5 + Math.random() * 0.8)
        const startCol = Math.max(0, Math.floor((x - radius) / gridSize))
        const endCol = Math.min(Math.ceil(width / gridSize), Math.ceil((x + radius) / gridSize))
        const startRow = Math.max(0, Math.floor((y - radius) / gridSize))
        const endRow = Math.min(Math.ceil(height / gridSize), Math.ceil((y + radius) / gridSize))

        for (let row = startRow; row < endRow; row += 1) {
          for (let col = startCol; col < endCol; col += 1) {
            if (Math.random() > 0.7) continue
            const cx = col * gridSize + gridSize / 2
            const cy = row * gridSize + gridSize / 2
            if (Math.hypot(cx - x, cy - y) < radius) {
              const key = `${col},${row}`
              if (!affectedCells.has(key) || timestamp > affectedCells.get(key)) {
                affectedCells.set(key, timestamp)
              }
            }
          }
        }
      }

      for (const [key, timestamp] of affectedCells) {
        const cell = cellImageMapRef.current.get(key)
        if (cell) cell.timestamp = timestamp
        else cellImageMapRef.current.set(key, { gridIndex: Math.floor(Math.random() * 10), timestamp, randomDelay: Math.random() * 500 })
      }

      for (const [key, cell] of cellImageMapRef.current) {
        if (now - cell.timestamp > cellLifetime + (cell.randomDelay || 0) && Math.random() > 0.3) {
          cellImageMapRef.current.delete(key)
        }
      }

      for (const [key, { gridIndex }] of cellImageMapRef.current) {
        const [col, row] = key.split(",").map(Number)
        const image = gridImages[gridIndex]
        if (!image?.complete) continue
        const iw = image.naturalWidth
        const ih = image.naturalHeight
        let srcX = 0
        let srcY = 0
        let srcW = iw
        let srcH = ih

        if (iw > ih) {
          srcW = ih
          srcX = (iw - srcW) / 2
        } else {
          srcH = iw
          srcY = (ih - srcH) / 2
        }

        context.drawImage(image, srcX, srcY, srcW, srcH, col * gridSize, row * gridSize, gridSize, gridSize)
      }

      animationRef.current = requestAnimationFrame(render)
    }

    const startRender = () => {
      cancelAnimationFrame(animationRef.current)
      render()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    if (type === "video") {
      media.addEventListener("loadeddata", startRender)
      media.addEventListener("play", startRender)
      if (media.readyState >= 2) startRender()
    } else if (media.complete) {
      startRender()
    } else {
      media.addEventListener("load", startRender)
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (type === "video") {
        media.removeEventListener("loadeddata", startRender)
        media.removeEventListener("play", startRender)
      } else {
        media.removeEventListener("load", startRender)
      }
      cancelAnimationFrame(animationRef.current)
    }
  }, [cellLifetime, effectRadius, gridImages, gridSize, type])

  const defaultVideoSrc = "https://media.fiddle.digital/uploads/fdda_reel_c2464398bf.mp4"

  return (
    <div ref={containerRef} className={`fx-target relative overflow-hidden rounded-2xl cursor-none ${className}`}>
      {type === "video" ? (
        <video
          ref={mediaRef}
          src={src || defaultVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-0"
        />
      ) : (
        <img ref={mediaRef} src={src} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0" />
      )}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
