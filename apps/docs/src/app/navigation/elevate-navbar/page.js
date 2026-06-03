import React from 'react'
import { ElevateNavbarDesktop } from '@/components/Navbar/GlassPillNavbar/ElevateDesktopNav'
import { ElevateNavbarMobile } from '@/components/Navbar/GlassPillNavbar/ElevateMobileNav'

const menuItems = [
    {
        name: "Effects",
        href: "/effects",
        isDropdown: true,
        dropdown: [
            { title: "All Effects", img: "/img/dino2.png", href: "/effects" },
            { title: "Components", img: "/img/dino2.png", href: "/effects/components" },
            { title: "WebGL", img: "/img/dino2.png", href: "/effects/webgl" },
        ],
    },
    {
        name: "Tech",
        href: "/tech",
        isDropdown: true,
        dropdown: [
            { title: "React Effects", img: "/img/dino2.png", href: "/tech/react" },
            { title: "GSAP Effects", img: "/img/dino2.png", href: "/tech/gsap" },
            { title: "Three.js Effects", img: "/img/dino2.png", href: "/tech/threejs" },
        ],
    },
    {
        name: "Extras",
        href: "#",
        isDropdown: false,
        dropdown: null,
    },
    {
        name: "Docs",
        href: "/docs",
        isDropdown: true,
        dropdown: [
            { title: "Introduction", img: "/img/dino2.png", href: "/docs" },
            { title: "Installation", img: "/img/dino2.png", href: "/docs/installation" },
            { title: "CLI", img: "/img/dino2.png", href: "/docs/cli" },
        ],
    },
]

const cta = {
    label: "BUILT W/ HYPERIUX",
    href: "#",
}

export default function page() {
    return (
        <div className='h-screen font-mono bg-purple-300 text-[.75vw] w-full'>
            <h1 className='text-[10vw] uppercase absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full font-black text-center text-[#363737]'>Elevate Navbar</h1>
            <ElevateNavbarDesktop menuItems={menuItems} cta={cta} />
            <ElevateNavbarMobile menuItems={menuItems} cta={cta} />
        </div>
    )
}
