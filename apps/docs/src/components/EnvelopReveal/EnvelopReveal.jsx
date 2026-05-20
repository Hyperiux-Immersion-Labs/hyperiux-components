"use client";

export default function EnvelopReveal() {
 return (
 <div className="min-h-screen w-screen flex items-center justify-center relative" style={{perspective:"1000px"}}>
 <div className="w-[30vw] h-[25vw] bg-white/20 backdrop-blur-lg rounded-[2vw] border border-white/20 absolute z-[2] -rotate-x-[20deg] -rotate-z-[2.5deg] translate-y-[8%] -rotate-y-[10deg]" style={{clipPath:"polygon(38% 0, 49% 18%, 100% 18%, 100% 80%, 100% 99%, 0 100%, 0% 80%, 0 0)"}}/>
 <div className="w-[30vw] h-[25vw] bg-purple-500 backdrop-blur-lg rounded-[2vw] border border-white/20 absolute rotate-x-2 -rotate-y-[20deg] rotate-z-[1deg]" />
 </div>
 );
}