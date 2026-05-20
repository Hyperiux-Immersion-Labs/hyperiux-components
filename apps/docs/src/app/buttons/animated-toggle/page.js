'use client';

import { useState } from"react";
import ChevronBird from"@/components/ChevronBird/ChevronBird";
import Cross from"@/components/AnimatedToggle/Cross";
import Plus from"@/components/AnimatedToggle/Plus";
import Image from"next/image";
import img from"../../../../public/assets/img/pexels.jpg";

export default function AnimatedTogglePage() {
 const [chevronActive, setChevronActive] = useState(false);
 const [crossActive, setCrossActive] = useState(false);
 const [plusActive, setPlusActive] = useState(false);

 return (
 <>
 <section className="min-h-dvh w-full flex items-center relative justify-center">
 <div className="z-1">
 <h1 className="text-6xl text-neutral-400 mb-10">Animated Toggle</h1>
 <div className="flex gap-8 justify-center">
 <button
 onClick={() => setChevronActive(prev => !prev)}
 className={`cursor-pointer size-24 rounded-lg flex items-center justify-center transition-all duration-300 active:scale-90 ${chevronActive ?"bg-primary" :"bg-zinc-400"}`}
 >
 <ChevronBird className="mt-2" size={32} isActive={chevronActive} />
 </button>
 <button
 onClick={() => setCrossActive(prev => !prev)}
 className={`group cursor-pointer size-24 rounded-lg flex items-center justify-center transition-all duration-300 active:scale-90 ${crossActive ?"bg-primary" :"bg-zinc-400"}`}
 >
 <Cross size={24} isActive={crossActive} />
 </button>
 <button
 onClick={() => setPlusActive(prev => !prev)}
 className={`group cursor-pointer size-24 rounded-lg flex items-center justify-center transition-all duration-300 active:scale-90 ${plusActive ?"bg-primary" :"bg-zinc-400"}`}
 >
 <Plus size={24} isActive={plusActive} />
 </button>
 </div>
 </div>
 <Image className="absolute w-full h-full object-cover brightness-25" src={img} alt="Pexels Image" placeholder="blur" sizes="fill" />
 </section>
 </>
 )
}