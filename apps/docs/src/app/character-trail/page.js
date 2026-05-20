import React from'react'
import CharacterTrail from'@/components/CursorTrail/CharTrail'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'

const page = () => {
 return (

    <>
    <LenisSmoothScroll />
   
 <CharacterTrail>
 <main className="relative min-h-screen w-full overflow-hidden bg-[#f4f4f1] text-black">

 {/* nav */}
 <nav className="absolute top-0 left-0 z-20 flex w-full items-center justify-between px-8 py-6 font-mono text-[12px] font-bold uppercase">
 <p>Home</p>
 <p>Motion</p>
 <p>Grid</p>
 <p>System</p>
 <p>Trail</p>
 </nav>

 {/* content */}
 <section className="flex min-h-screen items-end px-8 pb-8">
 <div >
 <h1 className="font-mono text-[12vh] leading-[1.2] w-[20vw] font-black uppercase">
 Snake Cursor Trail
 </h1>
 <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-black/40">
 Sequential · Reactive · Grid Based
 </p>
 </div>
 </section>
 </main>
 </CharacterTrail>
  </>
 )
}

export default page