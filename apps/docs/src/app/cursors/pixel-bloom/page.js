"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import FiddelAsciiCursor from '@/components/cursors/FiddelAsciiCursor'

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
    useEffect(() => {
        // Only apply x-animation on desktop
        if (window.matchMedia("(max-width: 767px)").matches) return;
        const ctx = gsap.context(() => {
            const boxes = gsap.utils.toArray(".curved-scroll-box");
            boxes.forEach((box, index) => {
                const isLeft = index % 2 === 0;
                const radius = window.innerWidth * 0.15;
                ScrollTrigger.create({
                    trigger: box,
                    start: "top bottom",
                    end: "bottom top",
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const theta = progress * Math.PI;
                        const xOffset = Math.sin(theta) * radius;
                        const finalX = isLeft ? -xOffset : xOffset;
                        gsap.set(box, { x: finalX });
                    },
                });
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <section className="w-screen overflow-x-hidden bg-gray-400 max-md:h-auto max-md:flex-col max-md:p-0 h-[750vh] flex items-center justify-center relative">

            <p className=" text-[8vw] mix-blend-difference max-sm:hidden text-white fixed top-1/2 left-1/2 -translate-x-1/2 w-full text-center leading-[.5] -translate-y-1/2 max-md:text-white z-1">
                MOVE CURSOR <br />
                <span className="text-[2vw] max-sm:text-[3vw] ">ON IMAGES TO SEE THE EFFECT</span>
            </p>
            <p className="max-sm:block hidden text-[5vw] mix-blend-difference  text-white fixed top-1/2 left-1/2 -translate-x-1/2 w-full text-center leading-relaxed -translate-y-1/2  z-1">
                Click to see the effect 
                <br />
                <span className="uppercase">

                 it’s way more fun on desktop
                </span>
            </p>
            <FiddelAsciiCursor className='w-[85vh] h-[50vh] absolute! top-50! left-1/2 -translate-x-1/2 z-10 aspect-video max-md:hidden' />
            <div className="h-[20vh] w-full"></div>
            <div className="relative w-full flex flex-col  gap-[10vh] items-center">
                {/* On mobile, center each image horizontally with mx-auto and remove ml/mr */}
                <div className="curved-scroll-box size-[30vw] max-md:size-[70vw] rounded-[2vw] overflow-clip mr-[25vw] max-md:mx-auto transform-gpu backface-hidden">
                    <FiddelAsciiCursor className='w-full h-full' type='video' src='/assets/videos/enigma-video.mp4' />
                </div>
                <div className="curved-scroll-box size-[30vw] max-md:size-[70vw] overflow-hidden ml-[25vw] max-md:mx-auto  rounded-[2vw] transform-gpu backface-hidden">
                    <FiddelAsciiCursor className='w-full h-full' type='image' src='/assets/gradient/image2.png' />
                </div>
                <div className="curved-scroll-box size-[30vw] max-md:size-[70vw] overflow-hidden mr-[25vw] max-md:mx-auto  rounded-[2vw] transform-gpu backface-hidden">
                    <FiddelAsciiCursor className='w-full h-full' type='image' src='/assets/gradient/image3.png' />
                </div>
                <div className="curved-scroll-box size-[30vw] max-md:size-[70vw] overflow-hidden ml-[25vw]  max-md:mx-auto rounded-[2vw] transform-gpu backface-hidden">
                    <FiddelAsciiCursor className='w-full h-full' />
                </div>
                <div className="curved-scroll-box size-[30vw] max-md:size-[70vw] overflow-hidden mr-[25vw]  max-md:mx-auto rounded-[2vw] transform-gpu backface-hidden">
                    <FiddelAsciiCursor className='w-full h-full' type='image' src='/assets/gradient/image1.png' />
                </div>
                <div className="curved-scroll-box size-[30vw] max-md:size-[70vw] overflow-hidden ml-[25vw]  max-md:mx-auto rounded-[2vw] transform-gpu backface-hidden">
                        <FiddelAsciiCursor className='w-full h-full' type='image' src='/assets/gradient/image5.png' />
                </div>
                <div className="curved-scroll-box size-[30vw] max-md:size-[70vw] overflow-hidden mr-[25vw]  max-md:mx-auto rounded-[2vw] transform-gpu backface-hidden">
                    <FiddelAsciiCursor className='w-full h-full' type='image' src='/assets/gradient/image7.png' />
                </div>
                <div className="curved-scroll-box size-[30vw] max-md:size-[70vw] overflow-hidden ml-[25vw]  max-md:mx-auto  rounded-[2vw] transform-gpu backface-hidden">
                    <FiddelAsciiCursor className='w-full h-full' />
                </div>
            </div>
            <div className="h-[20vh] w-full"></div>
        </section>
    );
}
