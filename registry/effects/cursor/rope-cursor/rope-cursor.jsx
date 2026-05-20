"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export default function RopeCursor({
  ropeColor = "#bda985",
  ropeWidth = 2,
  ropeOpacity = 0.6,
  segmentLength = 0,
  segmentCount = 8,
}) {
  const pathRef = useRef(null)
  const ropeSegments = useRef([])
  const mousePosition = useRef({ x: null, y: null })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let isInitialized = false
    let frameId = null

    const initialize = (x, y) => {
      ropeSegments.current = Array.from({ length: segmentCount }, () => ({ x, y }))
      isInitialized = true
      setIsVisible(true)
    }

    const handleMouseMove = (event) => {
      mousePosition.current.x = event.clientX
      mousePosition.current.y = event.clientY

      if (!isInitialized) initialize(event.clientX, event.clientY)
    }

    const updateLeadingSegment = (segments, targetX, targetY) => {
      gsap.to(segments[0], {
        x: targetX,
        y: targetY,
        duration: 0.05,
        ease: "power2.out",
      })
    }

    const updateFollowingSegments = (segments) => {
      for (let index = 1; index < segmentCount; index += 1) {
        const previousSegment = segments[index - 1]
        const currentSegment = segments[index]
        const dx = previousSegment.x - currentSegment.x
        const dy = previousSegment.y - currentSegment.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > segmentLength) {
          const angle = Math.atan2(dy, dx)
          const nextX = previousSegment.x - Math.cos(angle) * segmentLength
          const nextY = previousSegment.y - Math.sin(angle) * segmentLength

          gsap.to(currentSegment, {
            x: nextX,
            y: nextY,
            duration: 0.15 + index * 0.01,
            ease: "power2.out",
          })
        }
      }
    }

    const buildPath = (segments) => {
      let path = `M ${segments[0].x} ${segments[0].y}`

      for (let index = 1; index < segmentCount - 1; index += 1) {
        const controlX = (segments[index].x + segments[index + 1].x) / 2
        const controlY = (segments[index].y + segments[index + 1].y) / 2
        path += ` Q ${segments[index].x} ${segments[index].y} ${controlX} ${controlY}`
      }

      const last = segments[segmentCount - 1]
      path += ` L ${last.x} ${last.y}`
      return path
    }

    const animate = () => {
      if (isInitialized && mousePosition.current.x !== null) {
        const segments = ropeSegments.current
        updateLeadingSegment(segments, mousePosition.current.x, mousePosition.current.y)
        updateFollowingSegments(segments)
        if (pathRef.current) pathRef.current.setAttribute("d", buildPath(segments))
      }

      frameId = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    frameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(frameId)
    }
  }, [segmentCount, segmentLength])

  return (
    <svg className="absolute inset-0 h-full w-full" style={{ opacity: isVisible ? 1 : 0 }}>
      <path
        ref={pathRef}
        fill="none"
        stroke={ropeColor}
        strokeWidth={ropeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={ropeOpacity}
      />
    </svg>
  )
}
