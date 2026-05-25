'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function PixelRandomHeader() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between p-8">
      <Link
        href="/page-transitions/pixel-random"
        className="text-sm font-bold uppercase text-black"
      >
        Pixel Random
      </Link>
      <nav className="flex gap-4">
        <Link
          href="/page-transitions/pixel-random"
          className={`text-sm text-black ${
            pathname === '/page-transitions/pixel-random'
              ? 'opacity-100'
              : 'opacity-50'
          }`}
        >
          Page 1
        </Link>
        <Link
          href="/page-transitions/pixel-random/page2"
          className={`text-sm text-black ${
            pathname === '/page-transitions/pixel-random/page2'
              ? 'opacity-100'
              : 'opacity-50'
          }`}
        >
          Page 2
        </Link>
      </nav>
    </header>
  )
}
