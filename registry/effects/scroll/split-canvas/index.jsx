'use client';

import { useRef } from 'react';
import PixelScrollCanvas from './PixelScrollCanvas';
import { sections } from './content';

export function SplitCanvas() {
    const wrapperRef = useRef(null);

    return (
            <main className="bg-[#F5F5F0] min-h-screen text-black">
                {/* Hero Section */}
               

                {/* Scrollable Content */}
                <div
                    ref={wrapperRef}
                    className="relative"
                    style={{ height: `${sections.length * 100}vh` }}
                >
                    {/* Fixed Canvas Container - higher z-index to be visible */}
                    <div className="sticky top-0 overflow-hidden h-screen w-full flex items-center justify-center z-30 max-sm:items-end max-sm:pb-4">
                        <PixelScrollCanvas wrapperRef={wrapperRef} />
                    </div>

                    {/* Content Sections */}
                    <div className="absolute inset-0 z-30 pointer-events-none px-10 max-md:px-6">
                        {sections.map((section, i) => (
                            <div
                                key={i}
                                className="h-screen flex py-24 max-sm:py-10 border-t border-black/40"
                            >
                                <div className="w-full h-full mx-auto px-16 max-md:px-0 max-sm:px-0 flex flex-row justify-between items-start max-sm:flex-col max-sm:justify-end max-sm:items-center pb-0 max-sm:pb-0">
                                    {/* Left Column - Number & Title */}
                                    <div className="w-80 shrink-0 flex flex-col items-start text-left max-md:w-52 max-sm:w-full max-sm:items-center max-sm:text-center">
                                        <span className="text-[11px] tracking-wider text-black/40 block mb-2">
                                            {section.number}
                                        </span>
                                        <h2
                                            className="text-[44px] max-md:text-[40px] max-sm:text-[32px] leading-[1.05] font-normal"
                                            style={{ fontFamily: '"Times New Roman", Georgia, serif' }}
                                        >
                                            {section.title}
                                        </h2>
                                        {/* Mobile Description */}
                                        <p className="hidden max-sm:block mt-4 text-[13px] leading-[1.2] max-md:text-[2.5vw] max-sm:text-[3.5vw] text-black/60 max-w-70">
                                            {section.description}
                                        </p>
                                    </div>

                                    {/* Center - Space for Canvas (482px) */}
                                    <div className="w-125 shrink-0 max-md:hidden" />

                                    {/* Right Column - Description */}
                                    <div className="w-70 shrink-0 mt-auto max-md:w-52 max-sm:hidden">
                                        <p className="text-[14px] leading-[1.2] max-md:text-[2.5vw] max-sm:text-[3vw]   text-black/60 text-right">
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
    );
}
