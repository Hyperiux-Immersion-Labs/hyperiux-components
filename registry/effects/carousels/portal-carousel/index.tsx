// Built using Hyperiux Vault: https://vault.hyperiux.com
'use client'
/* eslint-disable @next/next/no-img-element -- shipped outside Next.js too, so next/image isn't available */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import gsap from 'gsap'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Parked preview inset from the bottom-right corner, px
const PARK_INSET = 28
// Preview top-left corner sits on the cursor (fraction of its size)
const CURSOR_ANCHOR_X = 0
const CURSOR_ANCHOR_Y = 0
// Tag offset from the cursor tip, px
const TAG_OFFSET_X = 14
const TAG_OFFSET_Y = 10

export interface PortalCarouselImage {
  src: string
  alt?: string
  /** Short title shown on the left while this image is up. */
  title?: string
}

const DEFAULT_IMAGES: PortalCarouselImage[] = [
  { src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/portal-carousel/crimson-drift.jpg', title: 'Crimson Drift', alt: 'Woman tossing her hair in red and amber light, motion-blurred' },
  { src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/portal-carousel/night-rider.jpg', title: 'Night Rider', alt: 'Cyclist in an orange jacket panning past city lights at night' },
  { src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/portal-carousel/light-trails.jpg', title: 'Light Trails', alt: 'Dark SUV streaking past with headlight trails' },
  { src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/portal-carousel/ember-motion.jpg', title: 'Ember Motion', alt: 'Dancers blurred mid-movement in an orange-lit room' },
  { src: 'https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/portal-carousel/platform-wind.jpg', title: 'Platform Wind', alt: 'Woman on a subway platform, hair swept by a passing train' },
]

export interface PortalCarouselProps {
  /** Images, shown in order and looping. Needs at least two. */
  images?: PortalCarouselImage[]
  /** Text on the cursor tag. */
  label?: string
  /** Preview size, px (square, capped at 42vw). */
  thumbWidth?: number
  /** How quickly the preview chases the cursor, 0.02-1. */
  followSpeed?: number
  /** Preview-to-fullscreen expansion time, s. */
  duration?: number
  /** GSAP ease for the expansion. Fast start, slow finish by default. */
  ease?: string
  className?: string
  /** Overlay content (header, copy). Non-interactive unless it opts in with pointer-events-auto. */
  children?: ReactNode
}

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

interface Layer {
  id: number
  index: number
  origin: Rect
}

// Old value slides up and out while the new one rises in, through a mask
function RollingText({ value, className = '' }: { value: string; className?: string }) {
  const [state, setState] = useState<{ current: string; previous: string | null }>({
    current: value,
    previous: null,
  })
  if (state.current !== value) {
    setState({ current: value, previous: state.current })
  }

  const currentRef = useRef<HTMLSpanElement>(null)
  const previousRef = useRef<HTMLSpanElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (state.previous === null) return
    const incoming = currentRef.current
    const outgoing = previousRef.current
    const reduced = prefersReducedMotion()

    const tweens = [
      reduced
        ? gsap.fromTo(incoming, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' })
        : gsap.fromTo(incoming, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' }),
      reduced
        ? gsap.to(outgoing, { opacity: 0, duration: 0.2, ease: 'power1.out' })
        : gsap.fromTo(outgoing, { yPercent: 0 }, { yPercent: -110, duration: 0.8, ease: 'expo.out' }),
    ]
    return () => {
      tweens.forEach((tween) => tween.kill())
    }
  }, [state])

  return (
    <span className={`relative -mb-[0.2em] inline-block overflow-y-clip whitespace-nowrap pb-[0.2em] align-bottom ${className}`}>
      <span ref={currentRef} className="block">
        {state.current}
      </span>
      {state.previous !== null && (
        <span ref={previousRef} aria-hidden="true" className="absolute inset-x-0 top-0 block">
          {state.previous}
        </span>
      )}
    </span>
  )
}

function ExpandingLayer({
  layer,
  image,
  duration,
  ease,
  onDone,
}: {
  layer: Layer
  image: PortalCarouselImage
  duration: number
  ease: string
  onDone: (id: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const onDoneRef = useRef(onDone)
  useIsomorphicLayoutEffect(() => {
    onDoneRef.current = onDone
  })

  useIsomorphicLayoutEffect(() => {
    const element = ref.current
    const parent = element?.parentElement
    if (!element || !parent) return

    const { width, height } = parent.getBoundingClientRect()
    const done = () => onDoneRef.current(layer.id)

    const tween = prefersReducedMotion()
      ? gsap.fromTo(
          element,
          { left: 0, top: 0, width, height, opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power1.out', onComplete: done }
        )
      : gsap.to(element, { left: 0, top: 0, width, height, duration, ease, onComplete: done })

    return () => {
      tween.kill()
    }
  }, [])

  return (
    <div
      ref={ref}
      className="absolute overflow-hidden"
      style={{ ...layer.origin, zIndex: 10 + layer.id }}
    >
      <img src={image.src} alt="" draggable={false} className="h-full w-full object-cover" />
    </div>
  )
}

export default function PortalCarousel({
  images = DEFAULT_IMAGES,
  label = 'Next',
  thumbWidth = 200,
  followSpeed = 0.14,
  duration = 1.2,
  ease = 'expo.out',
  className = '',
  children,
}: PortalCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLButtonElement>(null)
  const tagRef = useRef<HTMLSpanElement>(null)
  const layerIdRef = useRef(0)
  const followSpeedRef = useRef(followSpeed)
  useIsomorphicLayoutEffect(() => {
    followSpeedRef.current = followSpeed
  })

  const [current, setCurrent] = useState(0)
  const [layers, setLayers] = useState<Layer[]>([])

  const count = images.length
  const wrap = (index: number) => ((index % count) + count) % count
  // Newest image on its way in, or the one on screen
  const head = layers.length ? layers[layers.length - 1].index : current
  const thumbIndex = wrap(head + 1)
  const headTitle = count ? images[wrap(head)].title : undefined


  // Warm the cache so swaps never flash
  useEffect(() => {
    images.forEach(({ src }) => {
      const image = new Image()
      image.src = src
    })
  }, [images])

  // Tag sticks to the cursor; the preview trails it, or parks bottom-right
  useEffect(() => {
    const root = rootRef.current
    const follower = followerRef.current
    const tag = tagRef.current
    if (!root || !follower || !tag) return

    const pointer = { x: 0, y: 0, active: false }
    const position = { x: 0, y: 0 }
    let frame = 0
    let placed = false

    const tick = () => {
      frame = requestAnimationFrame(tick)
      const { width, height } = root.getBoundingClientRect()
      const thumbW = follower.offsetWidth
      const thumbH = follower.offsetHeight

      const goal = pointer.active
        ? { x: pointer.x - thumbW * CURSOR_ANCHOR_X, y: pointer.y - thumbH * CURSOR_ANCHOR_Y }
        : { x: width - thumbW - PARK_INSET, y: height - thumbH - PARK_INSET }

      const ease = prefersReducedMotion()
        ? 1
        : Math.min(Math.max(followSpeedRef.current, 0.02), 1)

      if (!placed) {
        position.x = goal.x
        position.y = goal.y
        placed = true
      } else {
        position.x += (goal.x - position.x) * ease
        position.y += (goal.y - position.y) * ease
      }
      follower.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`

      // No lag on the tag: it is the cursor
      const tagX = pointer.active ? pointer.x + TAG_OFFSET_X : position.x + 8
      const tagY = pointer.active ? pointer.y + TAG_OFFSET_Y : position.y + 8
      tag.style.transform = `translate3d(${tagX}px, ${tagY}px, 0)`
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = root.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // Every click launches its own layer, so rapid clicks stack frames
  const advance = () => {
    const root = rootRef.current
    const thumb = thumbRef.current
    if (!root || !thumb || count < 2) return

    const rootRect = root.getBoundingClientRect()
    const thumbRect = thumb.getBoundingClientRect()
    layerIdRef.current += 1

    setLayers((previous) => [
      ...previous,
      {
        id: layerIdRef.current,
        index: thumbIndex,
        origin: {
          left: thumbRect.left - rootRect.left,
          top: thumbRect.top - rootRect.top,
          width: thumbRect.width,
          height: thumbRect.height,
        },
      },
    ])

    // The following preview grows in at the cursor
    if (!prefersReducedMotion()) {
      gsap.fromTo(thumb, { scale: 0.2 }, { scale: 1, duration: 0.45, ease: 'expo.out', overwrite: true })
    }
  }

  // A finished layer becomes the background; anything beneath it goes
  const onLayerDone = (id: number) => {
    setLayers((previous) => {
      const finished = previous.find((layer) => layer.id === id)
      if (finished) setCurrent(finished.index)
      return previous.filter((layer) => layer.id > id)
    })
  }

  // Clicks on overlay links/buttons stay theirs
  const onRootClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    const interactive = target.closest('a, button, input, select, textarea, [role="button"]')
    if (interactive && interactive !== thumbRef.current) return
    advance()
  }

  if (count === 0) return null

  const currentImage = images[wrap(current)]
  const thumbImage = images[thumbIndex]

  return (
    <div
      ref={rootRef}
      onClick={onRootClick}
      aria-roledescription="gallery"
      // isolate: the overlays' z-indexes stay inside the carousel instead of climbing over the page
      className={`relative isolate h-screen w-full cursor-pointer select-none overflow-hidden bg-black ${className}`}
    >
      <img
        src={currentImage.src}
        alt={currentImage.alt ?? ''}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Own stacking context: layer z-order never climbs over the overlays */}
      <div className="absolute inset-0 z-[1]">
        {layers.map((layer) => (
          <ExpandingLayer
            key={layer.id}
            layer={layer}
            image={images[layer.index]}
            duration={duration}
            ease={ease}
            onDone={onLayerDone}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1000]">{children}</div>

      {count > 1 && (
        <>
          <div
            ref={followerRef}
            className="pointer-events-none absolute left-0 top-0 z-[1001] aspect-square will-change-transform"
            style={{ width: `min(${thumbWidth}px, 42vw)` }}
          >
            <button
              ref={thumbRef}
              type="button"
              aria-label={`Show next image${thumbImage.alt ? `: ${thumbImage.alt}` : ''}`}
              className="pointer-events-auto relative block h-full w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <img src={thumbImage.src} alt="" draggable={false} className="h-full w-full object-cover" />
            </button>
          </div>

          <span
            ref={tagRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-[1002] bg-black px-2 py-1 text-[0.625rem] font-medium uppercase leading-none tracking-[0.2em] text-white will-change-transform"
          >
            {label}
          </span>
        </>
      )}

      <div className="pointer-events-none absolute left-[10%] top-1/2 z-[999] flex -translate-y-1/2 flex-col gap-3 text-white">
        <span className="flex items-baseline gap-1 text-sm font-medium tabular-nums tracking-wide text-white/70">
          <RollingText value={String(wrap(head) + 1)} />
          <span>/ {count}</span>
        </span>
        {headTitle && (
          <RollingText
            value={headTitle}
            className="text-[clamp(1.5rem,2.6vw,2.75rem)] font-medium leading-[1.1] tracking-tight"
          />
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {`Image ${wrap(current) + 1} of ${count}${currentImage.alt ? `: ${currentImage.alt}` : ''}`}
      </p>
    </div>
  )
}
