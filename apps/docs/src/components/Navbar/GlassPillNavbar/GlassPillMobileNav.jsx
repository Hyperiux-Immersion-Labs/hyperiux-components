'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function ElevateNavbarMobile() {
    const menuItems = useMemo(() => ([
        { name: "Solutions", href: "#" },
        {
            name: "Tech",
            dropdown: [
                { title: "AI Tools", img: "/img/dino2.png", href: "#" },
                { title: "Web Stack", img: "/img/dino2.png", href: "#" }
            ]
        },
        { name: "Industries", href: "#" },
        {
            name: "Company",
            dropdown: [
                { title: "Manifesto", img: "/img/dino2.png", href: "#" },
                { title: "Career", img: "/img/dino2.png", href: "#" }
            ]
        }
    ]), [])

    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(null)

    const panelRef = useRef(null)
    const backdropRef = useRef(null)
    const sectionsRef = useRef([])

    // 🔹 menu open/close
    useEffect(() => {
        const panel = panelRef.current
        const backdrop = backdropRef.current
        if (!panel || !backdrop) return

        if (open) {
            gsap.set(panel, { pointerEvents: 'auto' })

            gsap.to(backdrop, {
                autoAlpha: 1,
                duration: 0.2
            })

            gsap.fromTo(panel,
                { autoAlpha: 0, y: -20 },
                { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out' }
            )
        } else {
            gsap.to(panel, {
                autoAlpha: 0,
                y: -20,
                duration: 0.2,
                onComplete: () => gsap.set(panel, { pointerEvents: 'none' })
            })

            gsap.to(backdrop, {
                autoAlpha: 0,
                duration: 0.2
            })
        }
    }, [open])

    // 🔹 accordion
    useEffect(() => {
        sectionsRef.current.forEach((el, i) => {
            if (!el) return

            const isOpen = active === i

            gsap.to(el, {
                height: isOpen ? el.scrollHeight : 0,
                autoAlpha: isOpen ? 1 : 0,
                duration: 0.25,
                ease: 'power2.out'
            })
        })
    }, [active])

    return (
        <div className="fixed top-[3vw] right-[3vw] z-999 block sm:block lg:hidden">

            {/* BACKDROP */}
            <div
                ref={backdropRef}
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm opacity-0"
            />

            {/* HEADER */}
            <div className="flex items-center justify-between gap-[2vw] px-[3vw] py-[2vw] rounded-[4vw] border border-white/10 bg-[#2f2f2f]/90 backdrop-blur-xl">

                <span className="text-[3vw] px-[2vw] uppercase text-white/80 tracking-wide">
                    Hyperiux
                </span>

                <button
                    onClick={() => setOpen(v => !v)}
                    className="w-[8vw] h-[8vw] flex items-center justify-center rounded-[2vw] hover:bg-white/10 transition"
                >
                    {open ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* PANEL */}
            <div
                ref={panelRef}
                className="mt-[2vw] w-[92vw] rounded-[4vw] border border-white/10 bg-[#2f2f2f]/95 backdrop-blur-xl p-[2vw]"
                style={{ pointerEvents: 'none', opacity: 0 }}
            >

                <div className="space-y-[1vw]">

                    {menuItems.map((item, i) => {
                        const hasDropdown = item.dropdown
                        const isOpen = active === i

                        if (!hasDropdown) {
                            return (
                                <Link
                                    key={i}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-between px-[3vw] py-[2.5vw] rounded-[2.5vw] text-[3vw] text-white/85 uppercase hover:bg-white/10 transition"
                                >
                                    {item.name}
                                </Link>
                            )
                        }

                        return (
                            <div key={i}>

                                {/* HEADER */}
                                <button
                                    onClick={() => setActive(prev => prev === i ? null : i)}
                                    className="flex w-full items-center justify-between px-[3vw] py-[2.5vw] rounded-[2.5vw] text-[3vw] text-white/85 uppercase hover:bg-white/10 transition"
                                >
                                    {item.name}
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* DROPDOWN */}
                                <div
                                    ref={el => sectionsRef.current[i] = el}
                                    className="overflow-hidden pl-[2vw]"
                                    style={{ height: 0, opacity: 0 }}
                                >
                                    <div className="space-y-[2vw] pt-[1vw]">

                                        {item.dropdown.map((d, idx) => (
                                            <Link
                                                key={idx}
                                                href={d.href}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-[3vw] rounded-[2vw] text-[2.8vw] text-white/80 uppercase bg-white/5 p-[2vw] transition"
                                            >
                                                <div className="w-[10vw] h-[10vw] rounded-[2vw] overflow-hidden bg-white/25 relative">
                                                    <Image
                                                        src={d.img}
                                                        alt={d.title}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                    />
                                                    <div
                                                        className="absolute inset-0"
                                                        style={{
                                                            background: "rgba(255, 0, 0, 1.0)", // red hue, adjust RGBA for desired color/opacity
                                                            mixBlendMode: "multiply",
                                                            pointerEvents: "none",
                                                        }}
                                                    />
                                                </div>
                                         

                                                <span className="flex-1">{d.title}</span>

                                            </Link>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* CTA */}
                    <div className=" mt-[3vw]">
                        <button className="w-full py-[3vw] rounded-[3vw] bg-white text-black text-[3vw] font-semibold">
                            BUILT W/ ICOMAT
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}