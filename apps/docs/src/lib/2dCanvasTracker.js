// Shared cursor targeting utilities.
//
// Goals:
// - Cache DOM bounds (no getBoundingClientRect() per animation frame)
// - Detect hovered".fx-target" efficiently
// - Call per-target handlers only for the currently hovered element
//
// Usage:
// - Add class"fx-target" to any element you want tracked
// - In a client component, call registerFxTarget(el, { onMove, onEnter, onLeave })

const handlersByEl = new WeakMap()
let targets = [] // [{ el, rect }]
let hoveredTarget = null // one of targets entries (same shape as targets[])
let needsBoundsUpdate = true
let listenersAttached = false
let refreshPending = false
let mouseX = 0
let mouseY = 0

function toCachedRect(el) {
 const r = el.getBoundingClientRect()
 return {
 left: r.left,
 top: r.top,
 right: r.right,
 bottom: r.bottom,
 }
}

function refreshTargets() {
 if (typeof document ==='undefined') return
 const els = Array.from(document.querySelectorAll('.fx-target')).filter((el) =>
 handlersByEl.has(el),
 )
 targets = els.map((el) => ({
 el,
 rect: toCachedRect(el),
 }))

 // If the current hovered element disappeared, treat as leave.
 if (hoveredTarget) {
 const stillPresent = targets.find((t) => t.el === hoveredTarget.el) || null
 if (!stillPresent) {
 const prevEl = hoveredTarget.el
 hoveredTarget = null
 handlersByEl.get(prevEl)?.onLeave?.()
 } else {
 // Update reference to the newly cached rect.
 hoveredTarget = stillPresent
 }
 }
 needsBoundsUpdate = false
}

function scheduleRefreshTargets() {
 if (refreshPending) return
 if (typeof window ==='undefined') return
 refreshPending = true
 window.requestAnimationFrame(() => {
 refreshPending = false
 refreshTargets()
 })
}

function updateBoundsIfNeeded() {
 if (!needsBoundsUpdate) return
 for (const t of targets) t.rect = toCachedRect(t.el)
 needsBoundsUpdate = false
}

function updateHoverAndNotify() {
 if (!targets.length) return
 updateBoundsIfNeeded()

 let newHoveredTarget = null
 for (let i = 0; i < targets.length; i++) {
 const t = targets[i]
 if (
 mouseX >= t.rect.left &&
 mouseX <= t.rect.right &&
 mouseY >= t.rect.top &&
 mouseY <= t.rect.bottom
 ) {
 newHoveredTarget = t
 break
 }
 }

 if (newHoveredTarget !== hoveredTarget) {
 if (hoveredTarget) {
 console.log('[2dCanvasTracker] Leave detected:', hoveredTarget.el)
 handlersByEl.get(hoveredTarget.el)?.onLeave?.()
 }
 if (newHoveredTarget) {
 console.log('[2dCanvasTracker] Enter detected:', newHoveredTarget.el)
 handlersByEl.get(newHoveredTarget.el)?.onEnter?.()
 }
 hoveredTarget = newHoveredTarget
 }

 if (hoveredTarget) {
 const h = handlersByEl.get(hoveredTarget.el)
 if (h?.onMove) {
 h.onMove({
 localX: mouseX - hoveredTarget.rect.left,
 localY: mouseY - hoveredTarget.rect.top,
 mouseX,
 mouseY,
 rect: hoveredTarget.rect,
 })
 }
 }
}

function attachListenersOnce() {
 if (listenersAttached || typeof window ==='undefined') return
 listenersAttached = true

 const markNeedsUpdate = () => {
 needsBoundsUpdate = true
 }

 window.addEventListener(
'mousemove',
 (e) => {
 mouseX = e.clientX
 mouseY = e.clientY
 updateHoverAndNotify()
 },
 { passive: true },
 )

 // Cache bounds and refresh them lazily on the next mouse move.
 window.addEventListener('resize', markNeedsUpdate, { passive: true })
 window.addEventListener('scroll', markNeedsUpdate, { passive: true, capture: true })
}

export function registerFxTarget(el, handlers = {}) {
 if (!el) return
 console.log('[2dCanvasTracker] Registered target:', el)
 handlersByEl.set(el, handlers)
 attachListenersOnce()
 scheduleRefreshTargets()
}

export function unregisterFxTarget(el) {
 if (!el) return
 console.log('[2dCanvasTracker] Unregistered target:', el)
 handlersByEl.delete(el)
 // Hover may be stale; refresh the cached targets on the next frame.
 scheduleRefreshTargets()
}