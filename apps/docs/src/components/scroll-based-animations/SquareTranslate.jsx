"use client"
import React, { useRef, useEffect } from 'react'
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
        const itemEls = itemRefs.current.filter(Boolean)
        // Enable GPU acceleration
        gsap.set([square, ...itemEls], { willChange: 'transform', force3D: true })
        gsap.set(square, { scale: 0, y: 0, rotation: 0 })

        // Scale phase: 0-10% of scroll
        // Translate phase: 10-90% of scroll
        // Scale out phase: 90-100% of scroll
        const getScale = (p) => {
            if (p < 0.1) return p / 0.1 // Scale in from 0 to 1
            if (p > 0.9) return (1 - p) / 0.1 // Scale out from 1 to 0
            return 1 // Full scale during translate
        }
        const getTranslateProgress = (p) => {
            if (p < 0.1) return 0 // No translate during scale in
            if (p > 0.9) return 1 // Stay at end during scale out
            return (p - 0.1) / 0.8 // Translate during middle phase
        }
        const getRotation = (p) => {
            if (p < 0.1) return 0 // No rotation during scale in
            if (p > 0.9) return 360 // Full rotation at end
            return ((p - 0.1) / 0.8) * 360 // Rotate during translate
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

                itemEls.forEach((item, i) => {
                    const distance = Math.min(Math.abs(i - currentIndex) / totalTranslateImpact, 1)
                    gsap.to(item, {
                        x: translateValue * (1 - distance), duration: 0.4, ease: "power2.out",
                        overwrite: true,
                    })
                })
            },
            onLeave: () => gsap.to(itemEls, { x: 0, duration: 0.6, ease: "power2.out", overwrite: true }),
            onLeaveBack: () => gsap.to(itemEls, { x: 0, duration: 0.6, ease: "power2.out", overwrite: true }),
        })

        return () => {
            trigger.kill()
            gsap.set([square, ...itemEls], { clearProps: 'willChange' })
        }
    }, [items, translateValue, totalTranslateImpact])

    return (
        <div ref={containerRef} className={`${containerClassName} relative h-fit`}>
            <div ref={squareRef}
                className={`${squareClassName} scale-0 absolute top-0 left-0 pointer-events-none z-10`} />
            {items.map((item, i) => (
                <ul key={i}
                    ref={el => itemRefs.current[i] = el}
                    className={`list-none py-[.8vw] max-sm:py-[2vw] ${textColor} ${i > 0 ? `border-t ${borderColor}` : ''} ${i === items.length - 1 ? '' : ''}`}
                >
                    <li className={textClassName}>{item}</li>
                </ul>
            ))}
        </div>
    )
}