import React from "react";
import SquareTranslate from "@/components/scroll-based-animations/SquareTranslate";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";
import Image from "next/image";

const items = [
    "Websites, web apps, landing pages",
    "Animation and interaction design",
    "Figma to production code",
    "Core Web Vitals and load time optimization",
    "Webflow development",
    "React / Next.js / Vue / Nuxt development",
    "GSAP / Framer Motion animation",
    "Unlimited revisions",
    "Direct Slack communication",
    "Senior developers on every project",
];

export default function Page() {
    return (
        <>
            <LenisSmoothScroll />
            <div className="h-fit w-screen bg-[#eeeeee] px-[4vw] max-md:px-4 max-sm:px-6 py-[10vw] max-md:py-[30vw] max-md:pb-[40vh]">
                <div className="h-fit py-[2vw] max-md:py-6 w-[80%] max-md:w-full mx-auto mb-[5vw] max-md:mb-8 flex items-center justify-center text-center font-mono text-[1.5vw] max-md:text-base px-[4vw] max-md:px-4 rounded-xl bg-black">
                    <p>
                        A scroll-driven list with a rotating square indicator that follows your scroll position.
                    </p>
                </div>
                <h2 className="mb-[2vw] max-md:mb-4">
                    <span className="text-[5vw] max-md:text-2xl font-medium text-black">
                        What&apos;s included
                    </span>
                    {/* <span className="text-[#FB450F] font-mono uppercase ml-[2vw] text-[1.2vw]">// Services</span> */}
                </h2>
                <div className="h-fit w-full py-[10vh] max-md:py-6 flex max-md:flex-col items-center gap-[6vw] max-md:gap-8">
                    <div className="h-[35vw] w-[40vw] max-md:w-full max-md:h-[40vw] bg-red-500 rounded-lg overflow-hidden">
                        <Image
                            alt="Square Translate"
                            src="/assets/img/laptop.png"
                            width={1000}
                            height={1000}
                            className="w-full h-full object-cover"
                            priority
                        />
                    </div>
                    <div className="max-md:w-full max-md:px-4">
                        <SquareTranslate
                            items={items}
                            textClassName="text-[1.1vw] max-md:text-xl"
                            textColor="text-black"
                            squareClassName="w-[.6vw] h-[.6vw] max-md:w-3 max-md:h-3 bg-[#FB450F]"
                            containerClassName="w-[50vw]  max-md:w-full"
                            translateValue={55}
                            borderColor="border-black/10"
                            totalTranslateImpact={3}
                        />
                    </div>
                </div>
                <div className="h-[20vh] max-md:h-24 bg-[#eeeeee] mb-[5vw] max-md:mb-8 relative flex items-center justify-center w-full">
                    <div className="h-[10vw] max-md:h-20 w-[80%] max-md:w-full flex items-center justify-center text-center font-mono text-[1.5vw] max-md:text-base px-[4vw] max-md:px-4  rounded-xl bg-black translate-y-[10vw] max-md:translate-y-8">
                        <p>
                            Hope you like it!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
