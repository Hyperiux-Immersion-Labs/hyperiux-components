"use client";
// It is just a sample content scrollable wrapper not a reusable component
import React from "react";

const ScrollablePopupContent = ({
    title = "Popup Title",
    subtitle = "",
    sections = [],
    className = "",
}) => {
    return (
        <div
            className={`mx-auto w-[min(92vw,960px)] max-h-[82vh] overflow-hidden rounded-[1.5vw] bg-white text-[#111111] shadow-[0_20px_80px_rgba(0,0,0,0.18)] max-md:max-h-[84vh] max-md:w-[min(94vw,960px)] max-md:rounded-[2.4vw] max-sm:max-h-[86vh] max-sm:w-[94vw] max-sm:rounded-[4vw] ${className}`}
        >
            <div className="h-full max-h-[82vh] overflow-y-auto p-[2.4vw] scrollbar-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20 max-md:max-h-[84vh] max-md:p-[4vw] max-sm:max-h-[86vh] max-sm:px-[5vw] max-sm:py-[6vw]">
                <div className="border-b border-black/8 pb-[1.6vw]">
                    <p
                        className="mb-[0.6vw] text-[0.85vw] uppercase tracking-[0.08em] opacity-55 max-md:mb-[1vw] max-md:text-[1.6vw] max-sm:mb-[1.8vw] max-sm:text-[3vw]"
                        style={{ fontWeight: 600 }}
                    >
                        Overview
                    </p>
                    <h2
                        className="mb-[1vw] text-[2.2vw] leading-none max-md:mb-[1.6vw] max-md:text-[4.6vw] max-sm:mb-[2.5vw] max-sm:text-[7vw]"
                        style={{ fontWeight: 600 }}
                    >
                        {title}
                    </h2>
                    {subtitle ? (
                        <p className="w-[80%] text-[1vw] leading-[1.7] opacity-80 max-md:w-full max-md:text-[1.9vw] max-sm:text-[3.6vw] max-sm:leading-[1.7]">
                            {subtitle}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-col gap-[2vw] pt-[1.8vw] max-md:gap-[3.2vw] max-md:pt-[3vw] max-sm:gap-[5vw] max-sm:pt-[5vw]">
                    {sections.map((section, index) => (
                        <div key={index} className="flex flex-col gap-[0.9vw] max-md:gap-[1.4vw] max-sm:gap-[2.4vw]">
                            {section.heading ? (
                                <h3
                                    className="text-[1.25vw] leading-[1.2] max-md:text-[2.4vw] max-sm:text-[4.4vw]"
                                    style={{ fontWeight: 600 }}
                                >
                                    {section.heading}
                                </h3>
                            ) : null}

                            {section.paragraph ? (
                                <p className="text-[1vw] leading-[1.8] opacity-82 max-md:text-[1.9vw] max-sm:text-[3.6vw] max-sm:leading-[1.8]">
                                    {section.paragraph}
                                </p>
                            ) : null}

                            {section.list?.length ? (
                                <ul className="flex flex-col gap-[0.6vw] pl-[1.2vw] max-md:gap-[1vw] max-md:pl-[2.2vw] max-sm:gap-[1.8vw] max-sm:pl-[4vw] [&>li]:text-[0.98vw] [&>li]:leading-[1.7] [&>li]:opacity-80 max-md:[&>li]:text-[1.85vw] max-sm:[&>li]:text-[3.4vw] max-sm:[&>li]:leading-[1.7]">
                                    {section.list.map((item, itemIndex) => (
                                        <li key={itemIndex}>{item}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScrollablePopupContent;
