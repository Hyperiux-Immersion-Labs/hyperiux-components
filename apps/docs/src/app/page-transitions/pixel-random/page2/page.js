import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <section className="flex h-screen w-full items-center justify-center bg-zinc-200">
      <div>
        <p className="mb-10 text-center text-[6vw] font-medium leading-[.9] tracking-tight text-zinc-900">
          PAGE 2
        </p>
        <Link
          href="/page-transitions/pixel-random"
          className="mx-auto block w-fit rounded-full bg-white px-6 py-3 text-sm uppercase text-black duration-300 hover:bg-primary hover:text-white"
        >
          Go to Page 1
        </Link>
      </div>
    </section>
  )
}
