import Link from'next/link'
import React from'react'

export default function page() {
 return (
 <>
 <section className='h-screen w-full bg-zinc-200 flex items-center justify-center'>
 <div>
 <p className='text-[6vw] text-center font-medium  tracking-tight leading-[.9] mb-10 text-neutral-700'>BRUSH STROKES PAGE 1</p>
 <Link href='/page-transitions/brush-strokes/page2' className='text-sm uppercase rounded-full px-6 py-3 bg-[#82A0FF] w-fit block mx-auto hover:bg-neutral-700 hover:text-white  duration-300'>
 Go to Page 2
 </Link>
 </div>
 </section>
 </>
 )
}
