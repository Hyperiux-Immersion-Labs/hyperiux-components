"use client"

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const defaultItems = [
  "Websites, web apps, landing pages",
  "Animation and interaction design",
  "Figma to production code",
  "Core Web Vitals and load time optimization",
  "Webflow development",
  "React / Next.js / Vue / Nuxt development",
  "GSAP / Framer Motion animation",
  "Unlimited revisions",
  "Direct Slack communication",
  "Senior developers on every project",
]

export default function SquareTranslate({
  items = defaultItems,
  textClassName = 'text-[1vw]',
  textColor = 'text-black',
  squareClassName = 'w-[.6vw] h-[.6vw] bg-[#FB450F]',
  containerClassName = 'w-[50vw]',
  translateValue = 50,
  borderColor = 'border-black/10',
  totalTranslateImpact = 3,
}) {
  const containerRef = useRef(null)
  const squareRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    const container = containerRef.current
    const square = squareRef.current
    const itemElements = itemRefs.current.filter(Boolean)
    if (!container || !square || !itemElements.length) return

    gsap.set([square, ...itemElements], { willChange: 'transform', force3D: true })
    gsap.set(square, { scale: 0, y: 0, rotation: 0 })

    const getScale = (progress) => {
      if (progress < 0.1) return progress / 0.1
      if (progress > 0.9) return (1 - progress) / 0.1
      return 1
    }

    const getTranslateProgress = (progress) => {
      if (progress < 0.1) return 0
      if (progress > 0.9) return 1
      return (progress - 0.1) / 0.8
    }

    const getRotation = (progress) => {
      if (progress < 0.1) return 0
      if (progress > 0.9) return 360
      return ((progress - 0.1) / 0.8) * 360
    }

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 50%",
      end: "bottom 50%",
      scrub: true,
      onUpdate: ({ progress }) => {
        const totalTravel = container.offsetHeight - square.offsetHeight
        const translateProgress = getTranslateProgress(progress)
        const currentIndex = translateProgress * (items.length - 1)

        gsap.to(square, {
          rotation: getRotation(progress),
          y: translateProgress * totalTravel,
          scale: getScale(progress),
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        })

        itemElements.forEach((item, index) => {
          const distance = Math.min(Math.abs(index - currentIndex) / totalTranslateImpact, 1)
          gsap.to(item, {
            x: translateValue * (1 - distance),
            duration: 0.4,
            ease: "power2.out",
            overwrite: true,
          })
        })
      },
      onLeave: () => gsap.to(itemElements, { x: 0, duration: 0.6, ease: "power2.out", overwrite: true }),
      onLeaveBack: () => gsap.to(itemElements, { x: 0, duration: 0.6, ease: "power2.out", overwrite: true }),
    })

    return () => {
      trigger.kill()
      gsap.set([square, ...itemElements], { clearProps: 'willChange' })
    }
  }, [items, totalTranslateImpact, translateValue])

  return (
    <div ref={containerRef} className={`${containerClassName} relative h-fit`}>
      <div
        ref={squareRef}
        className={`${squareClassName} pointer-events-none absolute top-0 left-0 z-10 scale-0`}
      />
      {items.map((item, index) => (
        <ul
          key={index}
          ref={(element) => {
            itemRefs.current[index] = element
          }}
          className={`list-none py-[.8vw] ${textColor} ${index > 0 ? `border-t ${borderColor}` : ''}`}
        >
          <li className={textClassName}>{item}</li>
        </ul>
      ))}
    </div>
  )
}
