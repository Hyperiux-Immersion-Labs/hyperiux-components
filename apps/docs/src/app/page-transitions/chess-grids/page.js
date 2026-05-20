import Link from'next/link'
import React from'react'

export default function page() {
 return (
 <section className='h-screen w-full bg-zinc-200 flex items-center justify-center'>
 <div>
 <p className='text-[6vw] text-center font-medium text-zinc-900 tracking-tight leading-[.9] mb-10'>PAGE 1</p>
 <Link href='/page-transitions/chess-grids/page2' className='text-sm uppercase rounded-full px-6 py-3 bg-white w-fit block mx-auto hover:bg-primary hover:text-white duration-300 text-black'>
 Go to Page 2
 </Link>
 </div>
 </section>
 )
}
