import React from'react'
import Image from'next/image'
import OverFlowAnim from'@/components/TextAnimations/OverFlowAnim/OverFlowAnim'
import { ReactLenis } from'lenis/react'

const page = () => {
 return (
 <ReactLenis root>


 <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#0a0a0a]">
 <Image
    src='/assets/nature/nature15.png'
 alt="Nature"
 fill
 className="object-cover opacity-60"
 priority
 />
 <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

 <div className="relative z-10 px-2 max-w-6xl mx-auto w-full">
 <p className="text-xs tracking-[0.35rem] text-white/40 uppercase py-2 max-sm:text-[11px]">
 direction — bottom (default)
 </p>
 <OverFlowAnim direction="bottom" scrub={true}>
 <h1 className="text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase max-sm:text-5xl">
 Characters<br />Rise From<br />Below
 </h1>
 </OverFlowAnim>
 <OverFlowAnim direction="bottom" scrub={true} delay={0.1}>
 <p className="max-w-lg py-8 text-xl leading-relaxed font-light text-white/50 max-sm:text-base">
 The default variant. Each character slides upward out of its clipping mask,
 rotating into place with a subtle tilt as you scroll.
 </p>
 </OverFlowAnim>
 </div>
 </section>

 {/* ─── SECTION 2 — direction: top ─────────────────────────────────── */}
 <section className="relative min-h-screen flex items-center bg-[#f5f0e8] overflow-hidden">
 <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden">
 <Image
 src="/assets/nature/nature02.png"
 alt="Nature"
 fill
 className="object-cover"
 />
 <div className="absolute inset-0 bg-linear-to-r from-[#f5f0e8] via-[#f5f0e8]/50 to-transparent" />
 </div>

 <div className="relative z-10 px-10 py-24 max-w-6xl mx-auto w-full">
 <p className="text-xs tracking-[0.35rem] text-[#8c7b6b] uppercase py-2 max-sm:text-[11px]">
 direction — top
 </p>
 <OverFlowAnim direction="top" scrub={true}>
 <h2 className="max-w-2xl text-7xl font-black text-[#2c1810] leading-[0.92] tracking-tight uppercase max-sm:text-5xl">
 Falling<br />Down From<br />The Sky
 </h2>
 </OverFlowAnim>
 <OverFlowAnim direction="top" scrub={true} delay={0.1}>
 <p className="max-w-md py-8 text-lg leading-relaxed text-[#6b5a4e] max-sm:text-base">
 Characters descend from above the mask with a negative rotation,
 creating a gravity-defying cascade that feels like rainfall.
 </p>
 </OverFlowAnim>

 <div className="flex gap-12 py-4">
 {["04","Dirn","∞"].map((val, i) => (
 <OverFlowAnim key={i} direction="top" scrub={true} delay={i * 0.05}>
 <div className="flex flex-col gap-1">
 <span className="text-5xl font-black text-[#2c1810] tabular-nums max-sm:text-4xl">{val}</span>
 <span className="text-xs tracking-[0.22rem] text-[#8c7b6b] uppercase max-sm:text-[11px]">
 {["Variants","Available","Possibilities"][i]}
 </span>
 </div>
 </OverFlowAnim>
 ))}
 </div>
 </div>
 </section>

 {/* ─── SECTION 3 — direction: left ─────────────────────────────────── */}
 <section className="relative min-h-screen flex items-center bg-[#0d1b2a] overflow-hidden">
 <div className="absolute left-0 top-0 h-full w-1/2 overflow-hidden">
 <Image
 src="/assets/nature/nature03.png"
 alt="Nature"
 fill
 className="object-cover opacity-40"
 />
 <div className="absolute inset-0 bg-linear-to-l from-[#0d1b2a] to-transparent" />
 </div>
 <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#0d1b2a]/80 to-[#0d1b2a]" />

 <div className="relative z-10 px-10 py-24 max-w-6xl mx-auto w-full flex flex-col items-end text-right">
 <p className="text-xs tracking-[0.35rem] text-[#4fc3f7]/50 uppercase py-2 max-sm:text-[11px]">
 direction — left
 </p>
 <OverFlowAnim direction="left" scrub={true}>
 <h2 className="text-7xl font-black text-white leading-[0.92] tracking-tight uppercase max-sm:text-5xl">
 Entering<br />From The<br />Left Edge
 </h2>
 </OverFlowAnim>
 <OverFlowAnim direction="left" scrub={true} delay={0.1}>
 <p className="max-w-md py-8 text-lg leading-relaxed text-white/40 max-sm:text-base">
 Characters sweep horizontally from the left, creating a cinematic
 wipe-in that suits editorial and title sequences perfectly.
 </p>
 </OverFlowAnim>

 <div className="grid grid-cols-2 w-[30%] gap-y-3 py-4">
 {["Horizontal","Cinematic","Editorial","Wipe-In"].map((tag, i) => (
 <OverFlowAnim key={i} direction="left" scrub={true} delay={i * 0.04}>
 <div className="flex items-start justify-between gap-2">
 <span className="inline-block rounded-full h-2 w-2 bg-white" />
 <span className="px-4 py-2 text-xs tracking-[0.2rem] uppercase text-[#4fc3f7] max-sm:text-[11px]">
 {tag}
 </span>
 </div>
</OverFlowAnim>
 ))}
 </div>
 </div>
 </section>

 {/* ─── SECTION 4 — direction: right ────────────────────────────────── */}
 <section className="relative min-h-screen flex items-center bg-[#1a1a1a] overflow-hidden">
 <div
 className="absolute right-0 top-0 h-full w-[55%] overflow-hidden"
 style={{ clipPath:"polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
 >
 <Image
 src="/assets/nature/nature04.png"
 alt="Nature"
 fill
 className="object-cover opacity-50"
 />
 </div>
 <div className="absolute right-0 top-0 h-full w-[55%] bg-linear-to-r from-[#1a1a1a] to-transparent" />

 <div className="relative z-10 px-10 py-24 max-w-6xl mx-auto w-full">
 <p className="text-xs tracking-[0.35rem] text-[#d4af37]/60 uppercase py-2 max-sm:text-[11px]">
 direction — right
 </p>
 <OverFlowAnim direction="right" scrub={true}>
 <h2 className="max-w-xl text-7xl font-black text-white leading-[0.92] tracking-tight uppercase max-sm:text-5xl">
 Rushing In<br />From The<br />Right Side
 </h2>
 </OverFlowAnim>
 <OverFlowAnim direction="right" scrub={true} delay={0.1}>
 <p className="max-w-md py-8 text-lg leading-relaxed text-white/40 max-sm:text-base">
 The mirror of the left variant. Characters surge in from the right,
 ideal for alternating content blocks and scroll storytelling.
 </p>
 </OverFlowAnim>

 <OverFlowAnim direction="right" scrub={true} delay={0.2}>
 <div className="border-l-2 border-[#d4af37] px-6 py-4 max-w-xs">
 <span className="block py-1 text-xs tracking-[0.18rem] uppercase text-[#d4af37] max-sm:text-[11px]">
 Tip
 </span>
 <span className="text-sm leading-relaxed text-white/60 max-sm:text-xs">
 Combine left + right variants on alternating sections for a dynamic scroll-driven narrative.
 </span>
 </div>
 </OverFlowAnim>
 </div>
 </section>

 {/* ─── SECTION 5 — All four side-by-side comparison ───────────────── */}
 <section className="relative bg-[#f7f4ef] overflow-hidden">
 <div className="max-w-6xl mx-auto px-10 py-24">
 <OverFlowAnim direction="bottom" scrub={true}>
 <p className="text-xs tracking-[0.35rem] text-[#9e9e9e] uppercase py-2 max-sm:text-[11px]">
 All variants — side by side
 </p>
 </OverFlowAnim>
 <OverFlowAnim direction="bottom" scrub={true}>
 <h2 className="py-6 text-6xl font-black text-[#1a1a1a] uppercase leading-tight tracking-tight max-sm:text-4xl">
 Four Directions.<br />One Component.
 </h2>
 </OverFlowAnim>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e0dbd4]">
 {[
 { dir:"bottom", label:"↑ Bottom", bg:"#1a1a1a", text:"white", accent:"#e0dbd4" },
 { dir:"top", label:"↓ Top", bg:"#f5f0e8", text:"#1a1a1a", accent:"#8c7b6b" },
 { dir:"left", label:"→ Left", bg:"#0d1b2a", text:"white", accent:"#4fc3f7" },
 { dir:"right", label:"← Right", bg:"#1a1a1a", text:"white", accent:"#d4af37" },
 ].map(({ dir, label, bg, text, accent }) => (
 <div
 key={dir}
 className="flex flex-col justify-between px-8 py-10 min-h-70"
 style={{ backgroundColor: bg }}
 >
 <span
 className="text-xs tracking-[0.28rem] uppercase max-sm:text-[11px]"
 style={{ color: accent }}
 >
 {label}
 </span>
 <OverFlowAnim direction={dir} scrub={true}>
 <p
 className="text-3xl font-black uppercase leading-none tracking-tight max-sm:text-2xl"
 style={{ color: text }}
 >
 Scroll<br />Reveal
 </p>
 </OverFlowAnim>
 </div>
 ))}
 </div>
 </section>

 {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
 <section className="relative min-h-[85vh] flex items-end bg-[#0a0a0a] overflow-hidden">
 <Image
 src="/assets/nature/nature01.png"
 alt="Nature"
 fill
 className="object-cover opacity-20"
 style={{ objectPosition:"center 70%" }}
 />
 <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/40" />
 <div className="relative z-10 px-10 py-20 pb-58 max-w-6xl mx-auto w-full">
 <OverFlowAnim direction="bottom" scrub={true}>
 <p className="py-2 text-xs tracking-[0.35rem] uppercase text-white/20 max-sm:text-[11px]">
 Overflow Text Reveal Component
 </p>
 </OverFlowAnim>
 <OverFlowAnim direction="bottom" scrub={true}>
 <h3 className="text-7xl font-black text-white uppercase leading-tight tracking-tight max-sm:text-4xl">
 Built for smooth,<br />scroll-driven storytelling.
 </h3>
 </OverFlowAnim>
 </div>
 </section>

 </ReactLenis>
 )
}

export default page
