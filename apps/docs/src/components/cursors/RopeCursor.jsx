"use client"

import React, { useEffect, useRef, useState } from'react'
import gsap from'gsap'

export default function RopeCursor({
	ropeColor ='#bda985',
	ropeWidth = 2,
	ropeOpacity = 0.6,
	segmentLength = 0,
	segmentCount = 8,
}) {
	const svgRef = useRef(null)
	const pathRef = useRef(null)
	const ropeSegments = useRef([])
	const mousePosition = useRef({ x: null, y: null })
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
 let isInitialized = false
 let animationFrameId = null

 const initializeRopeSegments = (startX, startY) => {
 ropeSegments.current = Array.from({ length: segmentCount }, () => ({
 x: startX,
 y: startY
 }))
 isInitialized = true
 setIsVisible(true)
 }

 const handleMouseMove = (event) => {
 mousePosition.current.x = event.clientX
 mousePosition.current.y = event.clientY

 if (!isInitialized && mousePosition.current.x !== null) {
 initializeRopeSegments(mousePosition.current.x, mousePosition.current.y)
 }
 }

 const updateLeadingSegment = (segments, targetX, targetY) => {
 gsap.to(segments[0], {
 x: targetX,
 y: targetY,
 duration: 0.05,
 ease:'power2.out'
 })
 }

 const updateFollowingSegments = (segments) => {
 for (let i = 1; i < segmentCount; i++) {
 const previousSegment = segments[i - 1]
 const currentSegment = segments[i]

 const deltaX = previousSegment.x - currentSegment.x
 const deltaY = previousSegment.y - currentSegment.y
 const distanceBetweenSegments = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

 if (distanceBetweenSegments > segmentLength) {
 const angleToTarget = Math.atan2(deltaY, deltaX)
 const constrainedX = previousSegment.x - Math.cos(angleToTarget) * segmentLength
 const constrainedY = previousSegment.y - Math.sin(angleToTarget) * segmentLength

 gsap.to(currentSegment, {
 x: constrainedX,
 y: constrainedY,
 duration: 0.15 + i * 0.01,
 ease:'power2.out'
 })
 }
 }
 }

 const generateSmoothPath = (segments) => {
 let pathData = `M ${segments[0].x} ${segments[0].y}`

 for (let i = 1; i < segmentCount - 1; i++) {
 const controlPointX = (segments[i].x + segments[i + 1].x) / 2
 const controlPointY = (segments[i].y + segments[i + 1].y) / 2
 pathData += ` Q ${segments[i].x} ${segments[i].y} ${controlPointX} ${controlPointY}`
 }

 const lastSegment = segments[segmentCount - 1]
 pathData += ` L ${lastSegment.x} ${lastSegment.y}`

 return pathData
 }

 const animate = () => {
 const segments = ropeSegments.current
 const mouse = mousePosition.current

 if (!isInitialized || mouse.x === null) {
 animationFrameId = requestAnimationFrame(animate)
 return
 }

 updateLeadingSegment(segments, mouse.x, mouse.y)
 updateFollowingSegments(segments)

 if (pathRef.current) {
 pathRef.current.setAttribute('d', generateSmoothPath(segments))
 }

 animationFrameId = requestAnimationFrame(animate)
 }

 window.addEventListener('mousemove', handleMouseMove)
 animationFrameId = requestAnimationFrame(animate)

 return () => {
 window.removeEventListener('mousemove', handleMouseMove)
 cancelAnimationFrame(animationFrameId)
 }
	}, [segmentCount, segmentLength])

	return (
 <svg
 ref={svgRef}
 className="w-full h-full absolute inset-0"
 style={{ opacity: isVisible ? 1 : 0 }}
 >
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
