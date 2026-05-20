'use client'

import { TransitionRouter } from 'next-transition-router'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function FlipTransition({ children, config = { enableBlur: false, duration: 0.5 } }) {
    const { enableBlur, duration } = config
    const wrapperRef = useRef(null)
    const blackOverlayRef = useRef(null)
    const flipOverlayRef = useRef(null)
    const boxesRef = useRef(null)

    useEffect(() => {
        gsap.set(blackOverlayRef.current, { opacity: 0 })
        // Initial state: clipped away with rotation
        gsap.set(flipOverlayRef.current, {
            clipPath: 'polygon(0 0, 100% 0, 0 0, 0 100%)',
            opacity: 1,
        })
        // Hide boxes initially
        gsap.set(boxesRef.current.children, { scaleY: 0, })
    }, [])

    return (
        <TransitionRouter auto
            leave={(next) => {
                const tl = gsap.timeline({ onComplete: next })

                tl.to(blackOverlayRef.current, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.inOut",
                }, 0)
                    .to(flipOverlayRef.current, {
                        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%)',
                        duration: duration,
                        ease: "linear",
                    }, 0)
                    .to(flipOverlayRef.current, {
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                        duration: duration,
                        ease: "linear",
                    })
                    .to(boxesRef.current.children, {
                        scaleY: 1,
                        opacity: 1,
                        transformOrigin: 'bottom',
                        duration: duration,
                        stagger: 0.1,
                        ease: "power2.out",
                    }, "-=0.3")

                return () => tl.kill()
            }}
            enter={(next) => {
                const tl = gsap.timeline({ onComplete: next, })


                tl.to(boxesRef.current.children, {
                    scaleY: 0,
                    transformOrigin: 'top',
                    duration: duration,
                    stagger: 0.05,

                    ease: "power2.in",
                })
                tl.to(flipOverlayRef.current, {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)',
                    duration: duration,
                    delay: 0.3,
                    ease: "linear",

                })
                tl.to(flipOverlayRef.current, {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 100% 0)',
                    duration: duration,
                    ease: "linear",

                })
                tl.to(blackOverlayRef.current, {
                    duration: duration,
                    opacity: 0,
                    ease: "power2.inOut",
                })
                tl.set(flipOverlayRef.current, {
                    clipPath: 'polygon(0 0, 100% 0, 0 0, 0 100%)',
                })

                return () => tl.kill()
            }}
        >
            <div ref={blackOverlayRef} className={`fixed z-998 bg-black/20 inset-0 pointer-events-none opacity-0 ${enableBlur && 'backdrop-blur-xl '}`}></div>

            <div
                ref={flipOverlayRef}
                className='h-full w-full bg-[#DE4013] opacity-0 flex items-center justify-center fixed top-0 left-0 z-999'

            >
                <div ref={boxesRef} className='h-fit w-fit flex gap-2'>
                    <span className='bg-black h-7 w-4 block'></span>
                    <span className='bg-black h-7 w-4 block'></span>
                    <span className='bg-black h-7 w-4 block'></span>
                    <span className='bg-black h-7 w-4 block'></span>
                </div>
            </div>
            <div ref={wrapperRef}>
                {children}
            </div>
        </TransitionRouter>
    )
}
