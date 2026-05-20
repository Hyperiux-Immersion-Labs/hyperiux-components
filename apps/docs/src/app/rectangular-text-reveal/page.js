import TextBlockReveal from"@/components/RectangularTextReveal/RectangularTextReveal";
import React from"react";
import { ReactLenis } from"lenis/react";

const showcaseSections = [
 {
 eyebrow:"Bottom Reveal",
 direction:"bottom",
 title:"Bold headlines can arrive with a grounded upward motion.",
 body:"Use the bottom direction when you want the color block to push up through the line, giving larger statements a heavier and more cinematic entrance.",
 baseColor:"#ff6b00",
 overlayColor:"#111111",
 useOverlay: true,
 },
 {
 eyebrow:"Right Reveal",
 direction:"right",
 title:"Dense editorial copy feels sharper when the wipe snaps in from the right.",
 body:"This variation works well for supporting paragraphs, callouts, and smaller moments where the reveal should feel precise without overpowering the content around it.",
 baseColor:"#111111",
 overlayColor:"#f97316",
 useOverlay: false,
 },
 {
 eyebrow:"Top Reveal",
 direction:"top",
 title:"Vertical motion brings a more structured, architectural rhythm.",
 body:"Top-to-bottom reveals are helpful when the composition already has strong vertical alignment and you want the animation to reinforce that visual system.",
 baseColor:"#111111",
 overlayColor:"#eab308",
 useOverlay: true,
 },
 {
 eyebrow:"Left Reveal",
 direction:"left",
 title:"The default leftward sweep is still the most versatile all-rounder.",
 body:"It reads quickly, feels familiar, and gives product storytelling sections an energetic but controlled sense of progression as the user scrolls.",
 baseColor:"#2563eb",
 overlayColor:"#dbeafe",
 useOverlay: true,
 },
];

export default function Page() {
 return (
 <ReactLenis root>
 <div className="min-h-screen w-screen bg-white text-black">
 <section className="flex min-h-screen items-center justify-center px-[6vw]">
 <div className="flex w-full max-w-360 flex-col gap-[2vw]">
 <p className="text-[1rem] uppercase tracking-[0.35em] text-black/50">
 Rectangular Text Reveal
 </p>

 <TextBlockReveal
 overlayEnterDuration={0.35}
 overlayExitDuration={0.35}
 direction="bottom"
 coverDuration={0.4}
 revealDuration={0.5}
 baseColor="#ff6b00"
 overlayColor="#111111"
 className="max-w-6xl"
 >
 <h1 className="text-6xl max-sm:text-3xl leading-[0.95] font-semibold">
 A directional rectangular reveal built for expressive,
 editorial motion systems.
 </h1>
 </TextBlockReveal>

 <div className="max-w-160">
 <TextBlockReveal
 baseColor="#111111"
 coverDuration={0.32}
 direction="left"
 revealDuration={0.36}
 overlayColor="#f5f5f5"
 >
 <p className=" leading-[1.6] text-black/75">
 Scroll through the page to compare each reveal direction in
 context. Every example below is tuned to feel slightly
 different, so the component reads like a flexible motion
 primitive instead of a one-note effect.
 </p>
 </TextBlockReveal>
 </div>
 </div>
 </section>

 <section className="px-[6vw] pb-[10vw]">
 <div className="mx-auto flex w-full max-w-360 flex-col gap-[5vw]">
 {showcaseSections.map((section, index) => (
 <div
 key={section.direction}
 className="grid gap-[2vw] border-t border-black/10 py-[4vw] md:grid-cols-[0.9fr_1.1fr]"
 >
 <div className="flex flex-col gap-10">
 <p className="text-sm uppercase tracking-[0.28em] text-black/45">
 {section.eyebrow}
 </p>
 <p className="max-w-88 text-xl max-sm:text-xl leading-[1.7] text-black/55">
 Variation {index + 1} demonstrates how the same reveal
 mechanic can shift tone depending on the travel direction,
 pacing, and color pairing.
 </p>
 </div>

 <div className="flex flex-col gap-6">
 <TextBlockReveal
 direction={section.direction}
 baseColor={section.baseColor}
 overlayColor={section.overlayColor}
 useOverlay={section.useOverlay}
 coverDuration={0.34}
 revealDuration={0.42}
 overlayEnterDuration={0.24}
 overlayExitDuration={0.28}
 >
 <h2 className="max-w-3xl text-[clamp(2rem,4.3vw,4.75rem)] leading-[1.02] font-semibold">
 {section.title}
 </h2>
 </TextBlockReveal>

 <div className="max-w-136">
 <TextBlockReveal
 direction={section.direction}
 baseColor={section.baseColor}
 overlayColor={section.overlayColor}
 useOverlay={false}
 stagger={0.12}
 coverDuration={0.26}
 revealDuration={0.3}
 >
 <p className="text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.75] text-black/70">
 {section.body}
 </p>
 </TextBlockReveal>
 </div>
 </div>
 </div>
 ))}
 </div>
 </section>
 </div>
 </ReactLenis>
 );
}
