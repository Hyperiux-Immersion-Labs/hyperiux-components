import React, { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

// Custom wrap function
const wrap = (min, max, value) => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

const MarqueeAlongSvgPath = ({
  children,
  className,

  // Path defaults
  path,

  pathId,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,

  // SVG defaults
  width = "100%",

  height = "100%",
  viewBox = "0 0 100 100",

  // Marquee defaults
  baseVelocity = 5,

  direction = "normal",
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },

  // Scroll defaults
  useScrollVelocity = false,

  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,

  // Items repetition
  repeat = 3,

  // Drag defaults
  draggable = false,

  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  grabCursor = false,

  // Z-index defaults
  enableRollingZIndex = true,

  // Base z-index value
  zIndexBase = 1,

  // Range of z-index values to use
  zIndexRange = 10,

  cssVariableInterpolation = [],

  // Responsive defaults
  responsive = false
}) => {
  const container = useRef(null)
  const marqueeContainerRef = useRef(null)
  const baseOffset = useMotionValue(0)

  const pathRef = useRef(null)

  const itemRefs = useRef(new Map())

  // Responsive scaling using direct DOM manipulation (no re-renders)
  useEffect(() => {
    if (!responsive) return

    const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number)
    const originalWidth = vbWidth || 100
    const originalHeight = vbHeight || 100

    const updateScale = () => {
      const wrapper = container.current
      const marqueeContainer = marqueeContainerRef.current
      if (!wrapper || !marqueeContainer) return

      const wrapperWidth = wrapper.clientWidth
      const wrapperHeight = wrapper.clientHeight

      const scaleX = wrapperWidth / originalWidth
      const scaleY = wrapperHeight / originalHeight
      const scale = Math.min(scaleX, scaleY)

      // Calculate the scaled dimensions
      const scaledWidth = originalWidth * scale
      const scaledHeight = originalHeight * scale

      // Center the marquee container within the wrapper
      const offsetX = (wrapperWidth - scaledWidth) / 2
      const offsetY = (wrapperHeight - scaledHeight) / 2

      // Set fixed dimensions on the container
      marqueeContainer.style.width = `${originalWidth}px`
      marqueeContainer.style.height = `${originalHeight}px`

      // Apply scale and position to center
      marqueeContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
      marqueeContainer.style.transformOrigin = "top left"
    }

    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale);
  }, [responsive, viewBox])

  // Create an array of items outside of the render function
  const items = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children)

    return childrenArray.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => {
        const itemIndex = repeatIndex * childrenArray.length + childIndex
        const key = `${childIndex}-${repeatIndex}`
        return {
          child,
          childIndex,
          repeatIndex,
          itemIndex,
          key,
        }
      }));
  }, [children, repeat])

  // Function to calculate z-index based on offset distance
  const calculateZIndex = useCallback((offsetDistance) => {
    if (!enableRollingZIndex) {
      return undefined
    }

    // Simple progress-based z-index
    const normalizedDistance = offsetDistance / 100
    return Math.floor(zIndexBase + normalizedDistance * zIndexRange);
  }, [enableRollingZIndex, zIndexBase, zIndexRange])

  // Generate a random ID for the path if not provided
  const id = pathId || `marquee-path-${Math.random().toString(36).substring(7)}`

  // Scroll tracking
 const { scrollY } = useScroll({
  container: scrollContainer || undefined,
})

  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig)

  // Hover and drag state tracking
  const isHovered = useRef(false)
  const isDragging = useRef(false)
  const dragVelocity = useRef(0)

  // Direction factor for changing direction based on scroll or drag
  const directionFactor = useRef(direction === "normal" ? 1 : -1)

  // Motion values for animation
  const hoverFactorValue = useMotionValue(1)
  const defaultVelocity = useMotionValue(1)
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig)

  // Transform scroll velocity into a factor that affects marquee speed
  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false }
  )

  // Animation frame handler
  useAnimationFrame((_, delta) => {
    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current)

      // Add decay to dragVelocity
      dragVelocity.current *= 0.9

      // Stop completely if velocity is very small
      if (Math.abs(dragVelocity.current) < 0.01) {
        dragVelocity.current = 0
      }

      return
    }

    // Update hover factor
    if (isHovered.current) {
      hoverFactorValue.set(slowdownOnHover ? slowDownFactor : 1)
    } else {
      hoverFactorValue.set(1)
    }

    // Calculate regular movement
    let moveBy =
      directionFactor.current *
      baseVelocity *
      (delta / 1000) *
      smoothHoverFactor.get()

    // Adjust movement based on scroll velocity if scrollAwareDirection is enabled
    if (scrollAwareDirection && !isDragging.current) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1
      }
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()

    if (draggable) {
      moveBy += dragVelocity.current

      // Update direction based on drag direction if dragAwareDirection is true
      if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
        directionFactor.current = Math.sign(dragVelocity.current)
      }

      // Gradually decay drag velocity back to zero
      if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
        dragVelocity.current *= dragVelocityDecay
      } else if (!isDragging.current) {
        dragVelocity.current = 0
      }
    }

    baseOffset.set(baseOffset.get() + moveBy)
  })

  // Pointer event handlers for dragging
  const lastPointerPosition = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e) => {
    if (!draggable) return
    ;(e.currentTarget).setPointerCapture(e.pointerId)

    if (grabCursor) {
      ;(e.currentTarget).style.cursor = "grabbing"
    }

    isDragging.current = true
    lastPointerPosition.current = { x: e.clientX, y: e.clientY }

    // Pause automatic animation by setting velocity to 0
    dragVelocity.current = 0
  }

  const handlePointerMove = (e) => {
    if (!draggable || !isDragging.current) return

    const currentPosition = { x: e.clientX, y: e.clientY }

    // Calculate movement delta - simplified for path movement
    const deltaX = currentPosition.x - lastPointerPosition.current.x
    const deltaY = currentPosition.y - lastPointerPosition.current.y

    // For path following, we use a simple magnitude of movement
    const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const projectedDelta = deltaX > 0 ? delta : -delta

    // Update drag velocity based on the projected movement
    dragVelocity.current = projectedDelta * dragSensitivity

    // Update last position
    lastPointerPosition.current = currentPosition
  }

  const handlePointerUp = (e) => {
    if (!draggable) return
    ;(e.currentTarget).releasePointerCapture(e.pointerId)
    isDragging.current = false

    if (grabCursor) {
      ;(e.currentTarget).style.cursor = "grab"
    }
  }

  return (
    <div
      ref={container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative ${className || ''}`}>
      <div
        ref={marqueeContainerRef}
        className="relative"
        style={{ contain: "layout style" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          className="w-full h-full">
          <path
            id={id}
            d={path}
            stroke={showPath ? "currentColor" : "none"}
            fill="none"
            ref={pathRef} />
        </svg>

        {items.map(({ child, repeatIndex, itemIndex, key }) => {
        // Create a unique offset transform for each item
        const itemOffset = useTransform(baseOffset, (v) => {
          const position = (itemIndex * 100) / items.length
          const wrappedValue = wrap(0, 100, v + position)
          return `${easing ? easing(wrappedValue / 100) * 100 : wrappedValue}%`;
        })

        // Create a motion value for the current offset distance
        const currentOffsetDistance = useMotionValue(0)

        // Update z-index when offset distance changes
        const zIndex = useTransform(currentOffsetDistance, (value) =>
          calculateZIndex(value))

        // Update current offset distance value when animation runs
        useEffect(() => {
          const unsubscribe = itemOffset.on("change", (value) => {
            // Parse percentage string to get numerical value
            const match = value.match(/^([\d.]+)%$/)
            if (match && match[1]) {
              currentOffsetDistance.set(parseFloat(match[1]))
            }
          })
          return unsubscribe
        }, [itemOffset, currentOffsetDistance])

        const cssVariables = Object.fromEntries((cssVariableInterpolation || []).map(({ property, from, to }) => [
          property,
          useTransform(currentOffsetDistance, [0, 100], [from, to]),
        ]))

        return (
          <motion.div
            key={key}
            ref={(el) => {
              if (el) itemRefs.current.set(key, el)
            }}
            className={`absolute top-0 left-0 ${draggable && grabCursor ? 'cursor-grab' : ''}`}
            style={{
              offsetPath: `path('${path}')`,
              offsetDistance: itemOffset,
              zIndex: enableRollingZIndex ? zIndex : undefined,
              willChange: "offset-distance",
              backfaceVisibility: "hidden",
              ...cssVariables,
            }}
            aria-hidden={repeatIndex > 0}
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}>
            {child}
          </motion.div>
        );
      })}
      </div>
    </div>
  );
}

export default MarqueeAlongSvgPath
