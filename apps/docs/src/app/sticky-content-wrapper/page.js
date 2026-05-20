"use client";

import LinkButton from"@/components/Buttons/LinkButtons/LinkButton/LinkButton";
import StickyContentWrapper from"@/components/StickyContent/StickyContent";
import { ReactLenis } from"lenis/react";

// import LinkButton from"@/components/Buttons/LinkButton";

const stickyItems = [
 {
 renderContent: () => (
 <div className="w-full h-full flex flex-col text-black">
 <h3 className=" font-medium">Designed for Modern Living</h3>

 <p className="">
 Thoughtfully crafted residences that seamlessly blend architecture,
 comfort, and lifestyle-creating spaces where design enhances everyday
 living.
 </p>

 <ul className="flex flex-col opacity-80">
 <li>• Open layouts with natural light</li>
 <li>• Premium materials and finishes</li>
 <li>• Smart and sustainable design</li>
 </ul>

 <LinkButton
 href="#"
 text="Explore Residences"
 className="mt-[1vw] text-[1.2vw]"
 />
 </div>
 ),
 image:"/assets/sticky-section/sticky-1-img.png",
 },

 {
 renderContent: () => (
 <div className="w-full h-full flex flex-col text-black">
 <h3 className=" font-medium">Locations That Matter</h3>

 <p className="">
 Strategically located developments offering seamless connectivity to
 business hubs, education centers, and lifestyle destinations.
 </p>

 <ul className="flex flex-col opacity-80">
 <li>• Close to key urban corridors</li>
 <li>• Excellent transport connectivity</li>
 <li>• Surrounded by lifestyle hubs</li>
 </ul>

 <LinkButton
 href="#"
 text="View Locations"
 className="mt-[1vw] text-[1.2vw]"
 />
 </div>
 ),
 image:"/assets/sticky-section/sticky-2-img.png",
 },

 {
 renderContent: () => (
 <div className="w-full h-full flex flex-col text-black">
 <h3 className=" font-medium">Built for Long-Term Value</h3>

 <p className="">
 Engineered for durability and appreciation, ensuring your investment
 continues to grow alongside evolving urban landscapes.
 </p>

 <ul className="flex flex-col opacity-80">
 <li>• High-quality construction standards</li>
 <li>• Future-ready infrastructure</li>
 <li>• Strong long-term appreciation potential</li>
 </ul>

 <LinkButton
 href="#"
 text="Explore Investment"
 className="mt-[1vw] text-[1.2vw]"
 />
 </div>
 ),
 image:"/assets/sticky-section/sticky-3-img.png",
 },

 {
 renderContent: () => (
 <div className="w-full h-full flex flex-col text-black">
 <h3 className=" font-medium">
 Crafted for Elevated Experiences
 </h3>

 <p className="">
 From curated amenities to refined interiors, every detail is designed
 to deliver a seamless and elevated lifestyle experience.
 </p>

 <ul className="flex flex-col opacity-80">
 <li>• World-class lifestyle amenities</li>
 <li>• Thoughtfully designed interiors</li>
 <li>• Community-driven living spaces</li>
 </ul>

 <LinkButton
 href="#"
 text="View Amenities"
 className="mt-[1vw] text-[1.2vw]"
 />
 </div>
 ),
 image:"/assets/sticky-section/sticky-4-img.png",
 },
];

export default function Page() {
 return (
 <ReactLenis root>
 <section className="bg-white">
 <StickyContentWrapper
 items={stickyItems}
 className=""
 leftClassName="text-black"
 contentEnterYPercent={2}
 contentExitYPercent={-2}
 contentTransitionDuration={0.9}
 contentDelay={0.35}
 stepGap={2.1}
  initialImageScale={1.5}
 activeImageScale={1.2}
 exitImageScale={1}
 />
 </section>
 </ReactLenis>
 );
}
