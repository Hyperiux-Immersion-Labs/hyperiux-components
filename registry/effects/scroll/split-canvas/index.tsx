// Built using Hyperiux Vault: https://vault.hyperiux.com

'use client';

import { useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import PixelScrollCanvas from './PixelScrollCanvas';
import { sections } from './content';

interface SplitCanvasProps {
    bgColor?: string;
    gridSize?: number;
    numSlices?: number;
    canvasSize?: number;
}

export default function SplitCanvas({
    bgColor = "#F5F5F0",
    gridSize = 16,
    numSlices = 32,
    canvasSize = 599,
}: SplitCanvasProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    return (
        <ReactLenis root options={{ autoRaf: true, duration: 1.5 }}>
            <main className="min-h-screen text-black" style={{ backgroundColor: bgColor }}>
                {/* Hero Section */}


                {/* Scrollable Content */}
                <div
                    ref={wrapperRef}
                    className="relative"
                    style={{ height: `${sections.length * 100}vh` }}
                >
                    {/* Fixed Canvas Container - higher z-index to be visible */}
                    <div className="sticky top-0 overflow-hidden h-screen w-full flex items-center justify-center z-30 max-md:items-center">
                        <PixelScrollCanvas
                            wrapperRef={wrapperRef}
                            gridSize={gridSize}
                            numSlices={numSlices}
                            canvasSize={canvasSize}
                        />
                    </div>

                    {/* Content Sections */}
                    <div className="absolute inset-0 z-30 pointer-events-none px-10 max-[1025px]:px-6 ">
                        {sections.map((section, i) => (
                            <div
                                key={i}
                                className="h-screen flex py-24 max-md:py-10 border-t border-black/40 max-[1025px]:pb-20 max-md:pb-20 "
                            >
                                <div className="w-full h-full mx-auto px-16 max-[1025px]:px-0 max-md:px-0 flex flex-row justify-between items-start max-md:flex-col max-md:justify-end max-md:items-center pb-0 max-md:pb-0">
                                    {/* Left Column - Number & Title */}
                                    <div className="w-80 shrink-0 flex flex-col items-start text-left max-[1025px]:w-[40%] max-md:w-full max-md:items-center max-md:text-center">
                                        <span className="text-[1.5vw] tracking-wider text-black/40 block mb-2 max-[1025px]:text-[3vw] max-md:text-[5vw]">
                                            {section.number}
                                        </span>
                                        <h2
                                            className="text-[3.5vw] max-[1025px]:text-[7vw] max-md:text-[9vw] leading-[1.05] font-normal"
                                            style={{ fontFamily: '"Times New Roman", Georgia, serif' }}
                                        >
                                            {section.title}
                                        </h2>
                                        {/* Mobile Description */}
                                        <p className="hidden max-md:block mt-4 text-[1.2vw] leading-[1.2] max-[1025px]:text-[2.5vw] max-md:text-[4.2vw] text-black/60 max-w-70">
                                            {section.description}
                                        </p>
                                    </div>

                                    {/* Center - Space for Canvas (482px) */}
                                    <div className="w-125 shrink-0 max-[1025px]:hidden" />

                                    {/* Right Column - Description */}
                                    <div className="w-70 shrink-0 mt-auto max-[1025px]:w-[50%] max-md:hidden">
                                        <p className="text-[1.2vw] leading-[1.2] max-[1025px]:text-[2.5vw] max-md:text-[3vw]   text-black/60 text-right">
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
