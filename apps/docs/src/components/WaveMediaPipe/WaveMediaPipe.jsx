/**
 * ImageStream.jsx
 *
 * S-Curve Infinite Image Stream Component
 *
 * ── Props ────────────────────────────────────────────────
 * images {string[]} Array of image src URLs (required)
 * cardWidth {number} Card width in px (default: 210)
 * cardHeight {number} Card height in px (default: 295)
 * title {string[]} Lines of the title (default: ["(BO®S)","TLB/2026"])
 * navLinks {string[]} Nav link labels (default: [...])
 * xSpan {number} Horizontal spread in px (default: 2700)
 * floatAmp {number} Float wave amplitude px (default: 11)
 *
 * ── Usage ────────────────────────────────────────────────
 * import ImageStream from'./ImageStream'
 * import'./ImageStream.css'
 *
 * const imgs = Array.from({ length: 20 }, (_, i) => `/img/photo-${i}.jpg`)
 *
 * <ImageStream
 * images={imgs}
 * cardWidth={210}
 * cardHeight={295}
 * title={["MY STUDIO","2026"]}
 * />
 *
 * ── GSAP ─────────────────────────────────────────────────
 * CDN loader is used here for portability.
 * With npm: `npm install gsap` → swap loadGSAP() for:
 * import gsap from'gsap'
 * then call startEngine(gsap) directly inside useEffect.
 */

import { useEffect, useRef, useState, useCallback } from'react'
import'./ImageStream.css'

/* ─────────────────────────────────────────────────────────
 CONSTANTS
───────────────────────────────────────────────────────── */
const MONTHS = [
'January','February','March','April','May','June',
'July','August','September','October','November','December',
]

/* ─────────────────────────────────────────────────────────
 S-CURVE MATH
 t ∈ [0, 1] → { x, y, z, scale, rotY, rotZ }
 Cards flow along an S-shaped 3D path.
───────────────────────────────────────────────────────── */
function sCurve(t, xSpan) {
 const u = t * 2 - 1 // map to [-1, 1]

 // X: linear diagonal sweep across the screen
 const x = u * xSpan * 0.5

 // Y: S-shape = primary sine arch + secondary phase-shifted sine
 const y = Math.sin(Math.PI * u) * 225
 + Math.sin(2 * Math.PI * t - Math.PI * 0.5) * 68

 // Z + scale: centre cards push toward viewer and grow larger
 const dip = Math.abs(Math.sin(Math.PI * t)) // 0 at edges, 1 at mid
 const z = dip * 310 - 78
 const scale = 0.44 + 0.62 * dip

 // rotY: follows the tangent of the curve so each card"faces" the path
 const dtY = Math.PI * Math.cos(Math.PI * u) * 225 * (2 / xSpan)
 + 2 * Math.PI * Math.cos(2 * Math.PI * t - Math.PI * 0.5) * 68 * (1 / xSpan)
 const rotY = -40 + Math.atan(dtY) * 35

 // rotZ: subtle roll following the S-curve lean
 const rotZ = u * -7

 return { x, y, z, scale, rotY, rotZ }
}

/* ─────────────────────────────────────────────────────────
 GSAP LOADER (CDN)
 Remove this and import gsap directly in a bundled project.
───────────────────────────────────────────────────────── */
function loadGSAP() {
 return new Promise((resolve) => {
 if (window.gsap) return resolve(window.gsap)
 const s = Object.assign(document.createElement('script'), {
 src:'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
 })
 s.onload = () => resolve(window.gsap)
 document.head.appendChild(s)
 })
}

/* ═════════════════════════════════════════════════════════
 ImageStream
═════════════════════════════════════════════════════════ */
export default function ImageStream({
 images = [],
 cardWidth = 210,
 cardHeight = 295,
 title = ['(BO®S)','TLB/2026'],
 navLinks = ['Timeline','Surf','Index','About'],
 xSpan = 2700,
 floatAmp = 11,
}) {
 /* ── DOM refs ─────────────────────────────────────────── */
 const rootRef = useRef(null)
 const cardRefs = useRef([])
 const sliderRef = useRef(null)

 /* ── Engine ref — mutable state, no re-renders ───────── */
 const eng = useRef({
 progress: 0, // stream position [0..1], wraps infinitely
 velocity: 0, // current momentum
 floatHz: 0.00052, // base float oscillation speed
 })

 /* ── GSAP handle ─────────────────────────────────────── */
 const gsapRef = useRef(null)
 const tickRef = useRef(null)

 /* ── React state (UI only) ───────────────────────────── */
 const [tag, setTag] = useState('(1) Stream / January')
 const [speed, setSpeed] = useState('0.0')
 const [sliderPct, setSlider] = useState(0)
 const [hintGone, setHintGone] = useState(false)

 /* ── Clamp card count to image pool size ─────────────── */
 const count = Math.min(Math.max(images.length, 4), 40)

 /* ══════════════════════════════════════════════════════
 ENGINE — wired once after GSAP loads
 ══════════════════════════════════════════════════════ */
 const startEngine = useCallback((gsap) => {
 gsapRef.current = gsap
 const e = eng.current
 const cards = cardRefs.current

 tickRef.current = () => {
 const now = performance.now()

 cards.forEach((el, i) => {
 if (!el) return

 // Position on the S-curve for this card, shifted by stream progress
 const raw = ((i / count) + e.progress) % 1
 const t = (raw + 1) % 1

 const { x, y, z, scale, rotY, rotZ } = sCurve(t, xSpan)

 // Per-card floating wave — unique phase per card index
 const phase = (i / count) * Math.PI * 2
 const fHz = e.floatHz + Math.abs(e.velocity) * 0.0003
 const floatY = Math.sin(now * fHz + phase) * floatAmp

 // Warp tilt: on fast scroll cards lean heavily into the motion
 const warpRotY = rotY + e.velocity * 20
 const warpRotZ = rotZ + e.velocity * 4.5

 // Shadow: scales with card depth/size
 const sha = (0.07 + scale * 0.18).toFixed(2)
 const shb = Math.round(10 + scale * 42)
 const shY = Math.round(4 + scale * 22)

 gsap.set(el, {
 x,
 y: y + floatY,
 z,
 rotateY: warpRotY,
 rotateZ: warpRotZ,
 scale,
 zIndex: Math.round(z + 500),
 boxShadow: `0 ${shY}px ${shb}px rgba(0,0,0,${sha})`,
 })
 })

 // Momentum decay
 e.velocity *= 0.905

 // Advance progress by velocity (infinite wrap)
 e.progress = ((e.progress + e.velocity * 0.00075) % 1 + 1) % 1

 // Update UI state (runs inside RAF — no extra overhead)
 setSpeed((Math.abs(e.velocity) * 30).toFixed(1))
 setSlider(e.progress * 100)
 setTag(`(${Math.floor(e.progress * 12) + 1}) Stream / ${MONTHS[Math.floor(e.progress * 12) % 12]}`)
 }

 gsap.ticker.add(tickRef.current)
 }, [count, xSpan, floatAmp])

 /* ══════════════════════════════════════════════════════
 MOUNT — load GSAP + wire all input events
 ══════════════════════════════════════════════════════ */
 useEffect(() => {
 const el = rootRef.current
 const e = eng.current

 loadGSAP().then(startEngine)

 /* ── Mouse wheel ─────────────────────────────────────
 deltaY is in pixels (deltaMode 0), lines (1), or pages (2).
 We normalise to pixels then convert to a velocity impulse.
 The impulse is clamped so a single hard flick stays bounded.
 ─────────────────────────────────────────────────────── */
 const onWheel = (ev) => {
 ev.preventDefault()

 let delta = ev.deltaY
 if (ev.deltaMode === 1) delta *= 28 // Firefox line-mode
 if (ev.deltaMode === 2) delta *= 500 // page-mode

 // Clamp impulse: light scroll → gentle nudge, hard spin → strong push
 const MAX_IMPULSE = 7
 const impulse = Math.sign(delta) * Math.min(Math.abs(delta) * 0.013, MAX_IMPULSE)
 e.velocity += impulse

 setHintGone(true)
 }

 /* ── Touch ───────────────────────────────────────── */
 let touchPrevY = 0
 let touchPrevT = 0

 const onTouchStart = (ev) => {
 touchPrevY = ev.touches[0].clientY
 touchPrevT = performance.now()
 }

 const onTouchMove = (ev) => {
 ev.preventDefault()
 const now = performance.now()
 const dy = touchPrevY - ev.touches[0].clientY
 const dt = Math.max(now - touchPrevT, 1)
 e.velocity += (dy / dt) * 1.5
 touchPrevY = ev.touches[0].clientY
 touchPrevT = now
 setHintGone(true)
 }

 el.addEventListener('wheel', onWheel, { passive: false })
 el.addEventListener('touchstart', onTouchStart, { passive: true })
 el.addEventListener('touchmove', onTouchMove, { passive: false })

 return () => {
 el.removeEventListener('wheel', onWheel)
 el.removeEventListener('touchstart', onTouchStart)
 el.removeEventListener('touchmove', onTouchMove)
 if (gsapRef.current && tickRef.current) {
 gsapRef.current.ticker.remove(tickRef.current)
 }
 }
 }, [startEngine])

 /* ══════════════════════════════════════════════════════
 SLIDER — pointer drag scrubs progress directly
 ══════════════════════════════════════════════════════ */
 const onSliderPointerDown = useCallback((ev) => {
 ev.preventDefault()
 const track = sliderRef.current
 if (!track) return

 const rect = track.getBoundingClientRect()

 // Snap to click position immediately
 const clickPct = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width))
 eng.current.progress = clickPct
 eng.current.velocity = 0

 const onMove = (e2) => {
 const pct = Math.max(0, Math.min(1, (e2.clientX - rect.left) / rect.width))
 // Give velocity a direction based on drag movement
 eng.current.velocity = (e2.movementX / rect.width) * 6
 eng.current.progress = pct
 }

 const onUp = () => {
 window.removeEventListener('pointermove', onMove)
 window.removeEventListener('pointerup', onUp)
 }

 window.addEventListener('pointermove', onMove)
 window.addEventListener('pointerup', onUp)
 }, [])

 /* ══════════════════════════════════════════════════════
 RENDER
 ══════════════════════════════════════════════════════ */
 return (
 <div className="is-root" ref={rootRef}>

 {/* ── Navigation ────────────────────────────────── */}
 <nav className="is-nav">
 {navLinks.map((label) => (
 <a key={label} href="#">{label}</a>
 ))}
 </nav>

 {/* ── Title ─────────────────────────────────────── */}
 <div className="is-title">
 {title.map((line, i) => (
 <h1 key={i}>{line}</h1>
 ))}
 </div>

 {/* ── 3D Stage ──────────────────────────────────── */}
 <div className="is-stage">
 {images.slice(0, count).map((src, i) => (
 <div
 key={i}
 className="is-card"
 ref={(el) => { cardRefs.current[i] = el }}
 style={{
 width: cardWidth,
 height: cardHeight,
 marginLeft: -cardWidth / 2,
 marginTop: -cardHeight / 2,
 }}
 >
 <img
 src={src}
 alt={`Image ${i + 1}`}
 loading="lazy"
 />
 </div>
 ))}
 </div>

 {/* ── Bottom bar ────────────────────────────────── */}
 <div className="is-bottom">

 {/* Stream label */}
 <span className="is-tag">{tag}</span>

 {/* ── Slider ────────────────────────────────── */}
 <div
 className="is-slider-wrap"
 onPointerDown={onSliderPointerDown}
 >
 <span className="is-slider-label">stream position</span>
 <div className="is-slider-track" ref={sliderRef}>
 <div
 className="is-slider-fill"
 style={{ width: `${sliderPct}%` }}
 />
 <div
 className="is-slider-thumb"
 style={{ left: `${sliderPct}%` }}
 />
 </div>
 </div>

 {/* Speed indicator */}
 <span className="is-speed">{speed}×</span>

 </div>

 {/* ── Scroll hint ───────────────────────────────── */}
 <div className={`is-hint${hintGone ?' is-hint--gone' :''}`}>
 <span className="is-hint-text">scroll to stream</span>
 <div className="is-hint-line" />
 </div>

 </div>
 )
}