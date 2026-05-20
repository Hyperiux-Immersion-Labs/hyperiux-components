"use client";

import React, { useEffect, useRef } from"react";
import BlurText from"@/components/effects/BlurText";
import ParallaxAnim from"@/components/ParallaxAnim/ParallaxAnim";
import { ReactLenis } from"lenis/react";
import { gsap } from"gsap";
import { ScrollTrigger } from"gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const accents = {
 0:"#9ca3af",
 1:"#818cf8",
 2:"#fb7185",
 3:"#eab308",
 4:"#2dd4bf",
};

const featureCards = ["Scroll-triggered","Word by word","Fully configurable"];
const gravityTexts = [
"Let it land",
"Feel the weight",
"Drop with intent",
];

const steps = [
 {
 step:"01",
 label:"Mount the component",
 desc:"Drop BlurText anywhere in your JSX.",
 },
 {
 step:"02",
 label:"Pick a variant",
 desc:"Choose fade, up, down, left, or right.",
 },
 {
 step:"03",
 label:"Scroll and watch",
 desc:"Animation fires once as the text enters the viewport.",
 },
];

const props = [
 { label:"blur", default:"10px" },
 { label:"duration", default:"0.5s" },
 { label:"delay", default:"0s" },
 { label:"variant", default:"fade" },
];

const ctaButtons = [
 {
 label:"Browse components",
 style:
"rounded-full bg-[#f6f3ea] px-6 py-3 text-sm font-semibold text-black shadow-lg transition-transform duration-300 hover:-translate-y-1",
 },
 {
 label:"View on GitHub",
 style:
"rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:border-white",
 },
];

function DecoOrb({ className, color }) {
 return (
 <div
 aria-hidden
 className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
 style={{ background: color }}
 />
 );
}

const Page = () => {
 const containerRef = useRef(null);

 useEffect(() => {
 const sectionEls = containerRef.current.querySelectorAll("section");

 [sectionEls[1], sectionEls[2], sectionEls[3]].forEach((el) => {
 gsap.to(el, {
 backgroundColor:"#000000",
 color:"#ffffff",
 scrollTrigger: {
 trigger: sectionEls[2],
 start:"top 80%",
 end:"top 20%",
 scrub: true,
 },
 });

 el.querySelectorAll("[data-subtext]").forEach((sub) => {
 gsap.to(sub, {
 color:"#a3a3a3",
 scrollTrigger: {
 trigger: sectionEls[2],
 start:"top 80%",
 end:"top 20%",
 scrub: true,
 },
 });
 });
 });

 return () => ScrollTrigger.getAll().forEach((t) => t.kill());
 }, []);

 return (
 <ReactLenis root>
 <div ref={containerRef} className="overflow-x-hidden bg-[#f7f1e3]">
 <section
 style={{ backgroundColor:"#f7f1e3", color:"#111827" }}
 className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 sm:px-8 lg:px-12"
 >
 <DecoOrb
 className="-left-40 -top-32 h-80 w-80 opacity-60"
 color="radial-gradient(circle, rgba(251,113,133,0.5), rgba(251,113,133,0))"
 />
 <DecoOrb
 className="-bottom-40 -right-24 h-96 w-96 opacity-60"
 color="radial-gradient(circle, rgba(129,140,248,0.45), rgba(129,140,248,0))"
 />

 <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
 <div className="relative">
 <div className="mb-6 inline-flex -rotate-3 rounded-full border border-black/10 bg-black px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-xl">
 <span data-accent style={{ color: accents[2] }}>
 Blur Text Reveal
 </span>
 </div>

 <div className="max-w-4xl">
 <BlurText
 variant="fade"
 className="block text-6xl font-black uppercase leading-none tracking-tight sm:text-7xl lg:text-8xl"
 >
 Blur should feel like a stage entrance, not a loading state.
 </BlurText>
 </div>

 <p
 data-subtext
 style={{ color:"#5b6472" }}
 className="mt-6 max-w-2xl text-base leading-7 sm:text-lg"
 >
 This demo keeps the animation exactly the same, but remixes the
 layout into a louder editorial playground with stacked panels,
 rotated labels, and oversized rhythm.
 </p>

 <div className="mt-10 flex flex-wrap gap-3">
 {featureCards.map((label, index) => (
 <div
 key={label}
 className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black shadow-lg"
 style={{
 backgroundColor: ["#ffffff","#ffe58f","#c7d2fe"][index],
 transform: `rotate(${index === 1 ?"-3deg" : index === 2 ?"2deg" :"-1deg"})`,
 }}
 >
 {label}
 </div>
 ))}
 </div>
 </div>

 <div className="relative">
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
 <div className="rounded-3xl border border-black/10 bg-[#111827] p-6 text-white shadow-2xl">
 <p className="text-xs uppercase tracking-widest text-white/60">
 Why it pops
 </p>
 <p className="mt-4 text-2xl font-semibold leading-tight">
 Big type, crisp timing, and just enough blur to make the
 reveal feel tactile.
 </p>
 </div>

 <div className="grid gap-4 sm:col-span-2 lg:col-span-1">
 {steps.map(({ step, label, desc }, index) => (
 <div
 key={step}
 className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-lg backdrop-blur"
 style={{
 transform: `translateX(${index % 2 === 0 ?"0px" :"18px"}) rotate(${index === 1 ?"2deg" :"-1deg"})`,
 }}
 >
 <div className="flex items-start justify-between gap-4">
 <div>
 <p className="text-xs uppercase tracking-widest text-black/45">
 Step {step}
 </p>
 <p className="mt-2 text-lg font-bold text-black">
 {label}
 </p>
 </div>
  </div>
 <p className="mt-3 text-sm leading-6 text-black/65">
 {desc}
 </p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </section>

 <section
 style={{ backgroundColor:"#ffffff", color:"#111827" }}
 className="relative min-h-screen px-6 py-16 sm:px-8 lg:px-12"
 >
 <DecoOrb
 className="right-8 top-10 h-56 w-56 opacity-40"
 color="radial-gradient(circle, rgba(45,212,191,0.45), rgba(45,212,191,0))"
 />

 <div className="mx-auto flex w-full max-w-7xl flex-col gap-14">
 <div className="max-w-3xl">
 <p
 data-accent
 style={{ color: accents[1] }}
 className="mb-4 text-xs font-semibold uppercase tracking-widest"
 >
 Variants Up + Down
 </p>
 <h2 className="max-w-2xl text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl lg:text-6xl">
 Motion can strut, dip, and still stay readable.
 </h2>
 <p
 data-subtext
 style={{ color:"#6b7280" }}
 className="mt-5 max-w-2xl text-base leading-7 sm:text-lg"
 >
 These two variants now live inside asymmetrical poster panels so
 the page feels more like an artboard than a documentation column.
 </p>
 </div>

 <div className="grid gap-8 lg:grid-cols-2">
 <div className="rounded-3xl border border-black/10 bg-[#f5f3ff] p-5 shadow-2xl sm:p-7">
 <div className="mb-6 flex items-center justify-between gap-4">
 <p className="rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
 Variant Up
 </p>
 <p className="text-xs font-semibold uppercase tracking-widest text-black/45">
 poster 01
 </p>
 </div>

 <div className="grid gap-6 xl:grid-cols-2 xl:items-center">
 <ParallaxAnim
 src="/assets/nature/nature01.png"
 wrapperClassName="h-[60vw] w-full overflow-hidden rounded-3xl sm:h-[34vw] xl:h-[28vw]"
 imageClassName="scale-[1.4] -translate-y-[30%]"
 />

 <div className="flex flex-col gap-8">
 <BlurText
 variant="up"
 className="block text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
 >
 Motion lifts your words off the page and into memory.
 </BlurText>

  </div>
 </div>
 <div className="flex flex-col gap-5 mt-10">
 {featureCards.map((label, index) => (
 <div
 key={label}
 className="rounded-2xl border border-black/10 px-4 py-4 text-center text-sm font-semibold shadow-lg"
 style={{
 backgroundColor: ["#ffffff","#d9f99d","#fecdd3"][index],
 }}
 >
 {label}
 </div>
 ))}
 </div>
 </div>

 <div className="rounded-3xl border border-black/10 bg-[#fff7ed] p-5 shadow-2xl sm:p-7">
 <div className="mb-6 flex items-center justify-between gap-4">
 <p className="rounded-full bg-[#111827] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
 Variant Down
 </p>
 <p className="text-xs font-semibold uppercase tracking-widest text-black/45">
 poster 02
 </p>
 </div>

 <div className="flex h-full flex-col gap-6">
 <BlurText
 variant="down"
 className="block max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
 >
 Gravity is just another design tool waiting to be used.
 </BlurText>

 <div className="grid gap-3 sm:grid-cols-3">
 {gravityTexts.map((label, index) => (
 <div
 key={label}
 className="rounded-2xl border border-black/10 px-4 py-4 text-center text-sm font-semibold shadow-lg"
 style={{
 backgroundColor: ["#ffffff","#fde68a","#bfdbfe"][index],
 transform: `rotate(${index === 1 ?"-2deg" :"1deg"})`,
 }}
 >
 {label}  </div>
 ))}
 </div>

 <ParallaxAnim
 src="/assets/nature/nature02.png"
 wrapperClassName="mt-10 h-[40vw] w-full overflow-hidden rounded-3xl sm:h-[34vw] xl:h-[28vw]"
 imageClassName="scale-[1.4] -translate-y-[30%]"
 />
 </div>
 </div>
 </div>
 </div>
 </section>

 <section
 style={{ backgroundColor:"#ffffff", color:"#111827" }}
 className="relative flex min-h-screen items-center px-6 py-16 sm:px-8 lg:px-12"
 >
 <DecoOrb
 className="left-10 top-12 h-52 w-52 opacity-35"
 color="radial-gradient(circle, rgba(234,179,8,0.45), rgba(234,179,8,0))"
 />

 <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
 <div className="relative rounded-3xl border border-black/10 bg-[#111827] p-8 text-white shadow-2xl sm:p-10">
 <p
 data-accent
 style={{ color: accents[3] }}
 className="text-xs font-semibold uppercase tracking-widest"
 >
 Variant Left
 </p>
 <h2 className="mt-5 text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
 Words with a sidewind feel more cinematic.
 </h2>
 <p
 data-subtext
 style={{ color:"#cbd5e1" }}
 className="mt-5 max-w-lg text-base leading-7"
 >
 This section leans into contrast: dark slab, gold signals, and
 a staggered prop wall that makes the documentation feel designed
 rather than merely arranged.
 </p>

 <div className="mt-10 grid gap-4 sm:grid-cols-2">
 {props.map(({ label, default: def }, index) => (
 <div
 key={label}
 className="rounded-2xl border border-white/15 bg-white/5 p-5 shadow-lg backdrop-blur"
 style={{
 transform: `translateY(${index % 2 === 0 ?"0px" :"14px"}) rotate(${index % 2 === 0 ?"-2deg" :"2deg"})`,
 }}
 >
 <p className="text-xs uppercase tracking-widest text-white/45">
 prop
 </p>
 <p className="mt-2 font-mono text-lg font-semibold text-white">
 {label}
 </p>
 <p className="mt-2 text-sm text-white/65">
 default:{""}
 <span style={{ color: accents[3] }} className="font-semibold">
 {def}
 </span>
 </p>
 </div>
 ))}
 </div>
 </div>

 <div className="relative">
 <div className="rounded-3xl border border-black/10 bg-[#fef3c7] p-6 shadow-2xl sm:p-8">
 <div className="mb-8 flex items-center justify-between gap-4">
 <span className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black">
 Sweep Left
 </span>
 <span className="text-xs font-semibold uppercase tracking-widest text-black/45">
 statement
 </span>
 </div>

 <BlurText
 variant="left"
 className="block text-5xl font-black uppercase leading-none tracking-tight text-black sm:text-6xl"
 >
 Direction gives animation intention. Intention gives design
 meaning.
 </BlurText>

 <p
 data-subtext
 style={{ color:"#5f5a3d" }}
 className="mt-6 max-w-xl text-base leading-7"
 >
 Lateral motion reads with confidence, especially when the rest
 of the layout gives it enough asymmetry to feel alive.
 </p>
 </div>
 </div>
 </div>
 </section>

 <section
 style={{ backgroundColor:"#000000", color:"#ffffff" }}
 className="relative flex min-h-screen items-center overflow-hidden px-6 py-16 sm:px-8 lg:px-12"
 >
 <DecoOrb
 className="-left-32 -top-24 h-80 w-80 opacity-40"
 color="radial-gradient(circle, rgba(45,212,191,0.5), rgba(45,212,191,0))"
 />
 <DecoOrb
 className="-bottom-32 -right-20 h-96 w-96 opacity-35"
 color="radial-gradient(circle, rgba(251,113,133,0.45), rgba(251,113,133,0))"
 />

 <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
 <div className="relative z-10">
 <p
 data-accent
 style={{ color: accents[4] }}
 className="mb-4 text-xs font-semibold uppercase tracking-widest"
 >
 Variant Right
 </p>
 <h2 className="max-w-2xl text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl lg:text-6xl">
 End on a flourish, not a whisper.
 </h2>
 <p
 data-subtext
 style={{ color:"#9ca3af" }}
 className="mt-5 max-w-xl text-base leading-7 sm:text-lg"
 >
 The final panel keeps the rightward reveal for the closing line,
 but reframes the call to action as a glossy, magazine-like signoff.
 </p>

 <div className="mt-8 flex flex-wrap gap-4">
 {ctaButtons.map(({ label, style }) => (
 <button key={label} className={style}>
 {label}
 </button>
 ))}
 </div>
 </div>

 <div className="relative">
 <div className="relative -rotate-2 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm sm:p-5">
 <ParallaxAnim
 src="/assets/nature/nature06.png"
 wrapperClassName="h-[60vw] w-full overflow-hidden rounded-3xl sm:h-[34vw] lg:h-[28vw]"
 imageClassName="scale-[1.4] -translate-y-[30%]"
 />

 <div className="mt-5 rounded-3xl bg-black/70 p-5 sm:p-7">
 <BlurText
 variant="right"
 className="block text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl"
 >
 Build components once. Combine them endlessly. Ship
 beautiful work.
 </BlurText>
 </div>
 </div>
 </div>
 </div>
 </section>
 </div>
 </ReactLenis>
 );
};

export default Page;
