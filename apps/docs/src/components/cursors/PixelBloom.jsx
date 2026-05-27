"use client"

import React, { useRef, useEffect, useState } from'react'
import { registerFxTarget, unregisterFxTarget } from'@/lib/2dCanvasTracker'

const GRID_SIZE = 35
const EFFECT_RADIUS = 40
const MAX_TRAIL_LENGTH = 8
const CELL_LIFETIME = 100




export default function PixelBloom({  src,  type ='video',  className ='h-[30vw] w-auto aspect-video',
 gridSize = GRID_SIZE,
 effectRadius = EFFECT_RADIUS,
 maxTrailLength = MAX_TRAIL_LENGTH,
 cellLifetime = CELL_LIFETIME
}) {
 const containerRef = useRef(null)
 const canvasRef = useRef(null)
 const mediaRef = useRef(null)
 const [gridImages, setGridImages] = useState([])
 const animationRef = useRef(null)
 const cellImageMapRef = useRef(new Map())
 const trailRef = useRef([])
 const sequenceRef = useRef(0) // added for sequential indexing

 useEffect(() => {
 const images = []
 let loadedCount = 0
 for (let i = 0; i <= 9; i++) {
 const img = new Image()
 img.src = `/assets/cursors/FeddleAsciCursor/grid-${i}.1.png`
 img.onload = () => { if (++loadedCount === 9) setGridImages(images) }
 images.push(img)
 }
 }, [])

 useEffect(() => {
 const container = containerRef.current
 if (!container) return

 const handlers = {
 onMove: ({ localX, localY }) => {
 const now = Date.now()
 const rand = () => (Math.random() - 0.5)
  trailRef.current.unshift({ x: localX + rand() * 30, y: localY + rand() * 30, timestamp: now })
 for (let i = 0; i < 2; i++) {
 trailRef.current.unshift({ x: localX + rand() * 60, y: localY + rand() * 60, timestamp: now })
 }
 if (trailRef.current.length > maxTrailLength) {
 trailRef.current.length = maxTrailLength
 }
 },
 onLeave: () => {}
 }

 registerFxTarget(container, handlers)

 return () => {
 unregisterFxTarget(container)
 }
 }, [])

 useEffect(() => {
 const canvas = canvasRef.current
 const media = mediaRef.current
 const container = containerRef.current
 if (!canvas || !media || !container || gridImages.length === 0) return

 const ctx = canvas.getContext('2d')
 const dpr = window.devicePixelRatio || 1

 const resizeCanvas = () => {
 const rect = container.getBoundingClientRect()
 canvas.width = rect.width * dpr
 canvas.height = rect.height * dpr
 ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
 canvas.style.width = rect.width +'px'
 canvas.style.height = rect.height +'px'
 }
 resizeCanvas()
 window.addEventListener('resize', resizeCanvas)

 const drawMediaCover = (media, ctx, canvasWidth, canvasHeight) => {
 const mediaWidth = type ==='video' ? media.videoWidth : media.naturalWidth
 const mediaHeight = type ==='video' ? media.videoHeight : media.naturalHeight
  if (!mediaWidth || !mediaHeight) {
 ctx.drawImage(media, 0, 0, canvasWidth, canvasHeight)
 return
 }

 const mediaAspect = mediaWidth / mediaHeight
 const canvasAspect = canvasWidth / canvasHeight

 let srcX, srcY, srcW, srcH

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

 ctx.drawImage(media, srcX, srcY, srcW, srcH, 0, 0, canvasWidth, canvasHeight)
 }

 const render = () => {
 const rect = container.getBoundingClientRect()
 const { width, height } = rect
 const now = Date.now()

 ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
 ctx.imageSmoothingEnabled = true
 ctx.imageSmoothingQuality ='high'
 drawMediaCover(media, ctx, width, height)

 trailRef.current = trailRef.current.filter(p => now - p.timestamp < cellLifetime)

 const affectedCells = new Map()
 for (const { x: mx, y: my, timestamp } of trailRef.current) {
 if (mx < 0 || mx > width || my < 0 || my > height) continue
 const radius = effectRadius * (0.5 + Math.random() * 0.8)
 const startCol = Math.max(0, Math.floor((mx - radius) / gridSize))
 const endCol = Math.min(Math.ceil(width / gridSize), Math.ceil((mx + radius) / gridSize))
 const startRow = Math.max(0, Math.floor((my - radius) / gridSize))
 const endRow = Math.min(Math.ceil(height / gridSize), Math.ceil((my + radius) / gridSize))

 for (let row = startRow; row < endRow; row++) {
 for (let col = startCol; col < endCol; col++) {
 if (Math.random() > 0.7) continue
 const cx = col * gridSize + gridSize / 2
 const cy = row * gridSize + gridSize / 2
 if (Math.hypot(cx - mx, cy - my) < radius) {
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
 if (cell) {
 cell.timestamp = timestamp
 } else {
 // sequential instead of random
 const index = sequenceRef.current % gridImages.length
 sequenceRef.current++

 cellImageMapRef.current.set(key, {  gridIndex: index,  timestamp,  randomDelay: Math.random() * 500  })
 }
 }

 for (const [key, cell] of cellImageMapRef.current) {
 if (now - cell.timestamp > cellLifetime + (cell.randomDelay || 0) && Math.random() > 0.3) {
 cellImageMapRef.current.delete(key)
 }
 }

 for (const [key, { gridIndex }] of cellImageMapRef.current) {
 const [col, row] = key.split(',').map(Number)
 const img = gridImages[gridIndex]
 if (!img?.complete) continue

 const { naturalWidth: iw, naturalHeight: ih } = img
 const imgAspect = iw / ih
 let srcX, srcY, srcW, srcH
 if (imgAspect > 1) {
 srcH = ih; srcW = ih; srcX = (iw - srcW) / 2; srcY = 0
 } else {
 srcW = iw; srcH = iw; srcX = 0; srcY = (ih - srcH) / 2
 }
 ctx.drawImage(img, srcX, srcY, srcW, srcH, col * gridSize, row * gridSize, gridSize, gridSize)
 }

 animationRef.current = requestAnimationFrame(render)
 }

 const startRender = () => {
 if (animationRef.current) cancelAnimationFrame(animationRef.current)
 render()
 }

 if (type ==='video') {
 media.addEventListener('loadeddata', startRender)
 media.addEventListener('play', startRender)
 if (media.readyState >= 2) startRender()
 } else {
 if (media.complete) {
 startRender()
 } else {
 media.addEventListener('load', startRender)
 }
 }

 return () => {
 window.removeEventListener('resize', resizeCanvas)
 if (type ==='video') {
 media.removeEventListener('loadeddata', startRender)
 media.removeEventListener('play', startRender)
 } else {
 media.removeEventListener('load', startRender)
 }
 if (animationRef.current) cancelAnimationFrame(animationRef.current)
 }
 }, [gridImages, type])

 const defaultVideoSrc ="/assets/videos/draggable-video.mp4"

 return (
 <div  ref={containerRef}
 className={`fx-target rounded-2xl overflow-hidden relative cursor-none ${className}`}
 >
 {type ==='video' ? (
 <video  ref={mediaRef}
 src={src || defaultVideoSrc}
 autoPlay loop muted playsInline
 className='w-full h-full object-cover absolute inset-0 opacity-0'  />
 ) : (
 <img
 ref={mediaRef}
 src={src}
 alt=""
 className='w-full h-full object-cover absolute inset-0 opacity-0'
 />
 )}
 <canvas ref={canvasRef} className='w-full h-full absolute inset-0' />
 </div>
 )
}