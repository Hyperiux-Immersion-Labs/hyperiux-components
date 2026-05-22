// import GlassPillDesktopNav from '@/components/Navbar/GlassPillNavbar/GlassPillDesktopNav'
import React from 'react'
// import GlassPillMobileNav from '@/components/Navbar/GlassPillNavbar/GlassPillMobileNav'
import ElevateNavbarDesktop from '@/components/Navbar/GlassPillNavbar/GlassPillDesktopNav'
import ElevateNavbarMobile from '@/components/Navbar/GlassPillNavbar/GlassPillMobileNav'

export default function page() {
    return (
        <div className='h-screen font-mono bg-purple-300 text-[.75vw] w-full'>
            <h1 className='text-[10vw] uppercase absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full font-black text-center text-[#363737]'>Elevate Navbar</h1>
            <ElevateNavbarDesktop />
            <ElevateNavbarMobile />
        </div>
    )
}
