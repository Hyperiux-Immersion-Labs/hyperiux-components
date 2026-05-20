"use client";

import Link from"next/link";

export default function Menu2() {
 const blocks = [
 {
 title:"Startups",
 description:
"Launch faster with flexible infrastructure, simple onboarding, and scalable workflows.",
 href:"#",
 },
 {
 title:"Enterprise",
 description:
"Bring governance, performance, and operational control to complex digital systems.",
 href:"#",
 },
 {
 title:"Agencies",
 description:
"Build repeatable client delivery with modular systems, collaboration, and speed.",
 href:"#",
 },
 ];

 return (
 <div>
 <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
 Solutions
 </p>
 <h3 className="mb-6 text-2xl font-semibold">
 Built for different teams
 </h3>

 <div className="grid grid-cols-3 gap-6">
 {blocks.map((block) => (
 <Link
 key={block.title}
 href={block.href}
 className="rounded-2xl border border-neutral-200 p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-neutral-50"
 >
 <h4 className="text-lg font-semibold ">{block.title}</h4>
 <p className="mt-3 text-sm leading-6 text-neutral-400">{block.description}</p>
 </Link>
 ))}
 </div>
 </div>
 );
}