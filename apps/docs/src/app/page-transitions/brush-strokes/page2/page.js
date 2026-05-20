import Link from'next/link'
import React from'react'

export default function page() {
 return (
 <>
 <section className='h-screen w-full bg-zinc-200 flex items-center justify-center'>
 <div>
 <p className='text-[6vw] text-center font-medium text-neutral-700 tracking-tight leading-[.9] mb-10'>BRUSH STROKES PAGE 2</p>
 <Link href='/page-transitions/brush-strokes' className='text-sm uppercase hover:text-white hover:bg-neutral-700 rounded-full px-6 py-3  w-fit block mx-auto bg-[#82A0FF] text-white duration-300'>
 Go to Page 1
 </Link>
 </div>
 </section>
 </>
 )
}
