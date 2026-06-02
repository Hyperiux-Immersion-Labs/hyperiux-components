"use client";

import VideoPlayer from"@/components/VideoPlayer/VideoPlayer";

export default function Page() {
 const featurePoints = [
 "Strategically located within high-growth urban corridors",
 "Architecture designed for natural light and spatial openness",
 "Integrated lifestyle amenities for wellness and convenience",
 "Built with long-term durability and investment value in mind",
 ];

 return (
 <section className="flex min-h-screen w-screen items-center max-md:items-start bg-black p-[5vw] max-md:h-auto max-md:py-[8vw] max-md:pb-[8vw] max-sm:px-[5vw] max-sm:py-[12vw]">
 <div className="flex w-full justify-between gap-[5vw] max-md:flex-col max-md:gap-[6vw] max-sm:gap-[8vw]">
 {/* LEFT VIDEO */}
 <div className="aspect-video h-[27vw] w-[43vw] max-md:h-auto max-md:w-full">
 <VideoPlayer
 videoSrc="showreel.mp4"
 poster="/assets/videoplayer/poster.png"
 autoPlay
 startMuted
 />
 </div>

 {/* RIGHT CONTENT */}
 <div className="flex w-1/2 flex-col gap-[2vw] text-white max-md:w-full max-md:gap-[3vw]">
 <h2 className="text-[3vw] leading-[1.1] font-medium max-md:text-[6vw] max-sm:text-[8.5vw]">
 Experience Spaces That Redefine Urban Living
 </h2>

 <p className="w-[85%] text-[1.1vw] leading-[1.8] opacity-80 max-md:w-full max-md:text-[2.2vw] max-sm:text-[3.8vw] max-sm:leading-[1.7]">
 This project is not just about building homes, it is about crafting
 a lifestyle ecosystem where design, functionality, and long-term
 value seamlessly converge. Every element is engineered to elevate
 how modern urban living is experienced.
 </p>

 <ul className="flex list-none flex-col gap-[0.5vw] p-0 text-[1vw] opacity-80 max-md:gap-[1vw] max-md:text-[2vw] max-sm:gap-[2vw] max-sm:text-[3.5vw]">
 {featurePoints.map((point) => (
 <li key={point} className="flex gap-[0.35em]">
 <span aria-hidden="true">•</span>
 <span>{point}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </section>
 );
}
