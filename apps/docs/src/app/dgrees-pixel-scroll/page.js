'use client';

import { useRef } from 'react';
import { Faculty_Glyphic } from 'next/font/google';
import { ReactLenis } from 'lenis/react';
import PixelScrollCanvas from './PixelScrollCanvas';
import { sections } from './content';

const facultyGlyphic = Faculty_Glyphic({
    subsets: ['latin'],
    weight: '400',
});

export default function DgreesPixelScrollPage() {
    const wrapperRef = useRef(null);

    return (
        <ReactLenis root options={{ autoRaf: true, duration: 1.5 }}>
            <main className="bg-[#F5F5F0] min-h-screen text-black">
                {/* Hero Section */}
                <section className="h-screen flex flex-col items-center justify-center relative">
                    <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-black rounded-full" />
                        <h1 className="text-[64px] md:text-[72px] font-normal tracking-[-0.02em]">
                            Approach
                        </h1>
                    </div>
                    <p className="text-sm md:text-base text-black/50 mt-2">
                        {'{ Five principles in the age of AI }'}
                    </p>
                </section>

                {/* Scrollable Content */}
                <div
                    ref={wrapperRef}
                    className="relative"
                    style={{ height: `${sections.length * 100}vh` }}
                >
                    {/* Fixed Canvas Container - higher z-index to be visible */}
                    <div className="sticky top-0 overflow-x-hidden  h-screen w-full flex items-center justify-center z-30">
                        <PixelScrollCanvas wrapperRef={wrapperRef} />
                    </div>

                    {/* Content Sections */}
                    <div className="absolute inset-0 z-30 pointer-events-none px-10">
                        {sections.map((section, i) => (
                            <div
                                key={i}
                                className="h-screen flex py-24 border-t border-black/40"
                            >
                                <div className="w-full mx-auto px-8 md:px-12 lg:px-16 flex justify-between items-start">
                                    {/* Left Column - Number & Title */}
                                    <div className="w-70 md:w-80 shrink-0">
                                        <span className="text-[11px] tracking-wider text-black/40 block mb-2">
                                            {section.number}
                                        </span>
                                        <h2
                                            className={`text-[32px] md:text-[40px] lg:text-[44px] leading-[1.05] font-normal ${facultyGlyphic.className}`}
                                        >
                                            {section.title}
                                        </h2>
                                    </div>

                                    {/* Center - Space for Canvas (482px) */}
                                    <div className="w-125 shrink-0 hidden lg:block" />

                                    {/* Right Column - Description */}
                                    <div className="w-60 md:w-70 shrink-0 hidden md:block mt-auto">
                                        <p className="text-[13px] md:text-[14px] leading-[1.7] text-black/60 text-right">
                                            {section.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom divider */}
                <div className="w-full h-px bg-black/10" />
            </main>
        </ReactLenis>
    );
}
