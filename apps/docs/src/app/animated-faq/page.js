"use client";

import {
 FAQContent,
 FAQGroup,
 FAQTitle,
 FAQWrapper,
} from"@/components/AnimatedFAQ/AnimatedFAQ";
import React from"react";

const faqItems = [
 {
 id:"faq-1",
 title:"What makes this FAQ package more reusable?",
 content: (
 <>
 You are no longer locked into a plain data object. You can pass rich JSX,
 custom markup, inline links, badges, icons, or even other components
 inside the title and content.
 </>
 ),
 defaultOpen: false,
 },
 {
 id:"faq-2",
 title:"Can I put custom content inside the answer?",
 content: (
 <div className="space-y-3">
 <p>Yes. This content area accepts full React nodes, not just text.</p>
 <ul className="list-disc pl-5 space-y-1">
 <li>Paragraphs</li>
 <li>Lists</li>
 <li>Buttons</li>
 <li>Inline links</li>
 </ul>
 </div>
 ),
 defaultOpen: false,
 },
 {
 id:"faq-3",
 title:"Does it use the ChevronBird trigger?",
 content: (
 <>
 Yes. The open and close state is visually driven by ChevronBird, so your
 motion language stays consistent across the whole system.
 </>
 ),
 defaultOpen: true,
 },
];

export default function FAQDemo() {
 const defaultOpenItems = faqItems
 .filter((item) => item.defaultOpen)
 .map((item) => item.id);

 return (
  <section className="bg-black h-screen px-8 py-20 text-white">
 <div className="mx-auto max-w-4xl space-y-4">
 <FAQGroup
 allowMultiple={false}
 defaultOpenItems={defaultOpenItems}
 >
 {faqItems.map((item) => (
 <FAQWrapper
 key={item.id}
 itemId={item.id}
 className="rounded-2xl border border-white/10 px-6 py-5"
 titleClassName="text-[1.1rem] font-medium text-white"
 iconSize={16}
 iconStrokeWidth={9}
 duration={0.5}
 >
 <FAQTitle className="pb-0">{item.title}</FAQTitle>

 <FAQContent className="pt-4 text-neutral-400">
 {item.content}
 </FAQContent>
 </FAQWrapper>
 ))}
 </FAQGroup>
 </div>
 </section>
 );
}