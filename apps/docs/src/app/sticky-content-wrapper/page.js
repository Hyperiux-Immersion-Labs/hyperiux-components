import { StickyContentWrapper } from"@/components/StickyContent/StickyContent";
import { ReactLenis } from"lenis/react";

const stickyItems = [
 {
 heading:"Designed for Modern Living",
 paragraph:
 "Thoughtfully crafted residences that seamlessly blend architecture, comfort, and lifestyle-creating spaces where design enhances everyday living.",
 list:[
 "• Open layouts with natural light",
 "• Premium materials and finishes",
 "• Smart and sustainable design",
 ],
 link:{ href:"#", text:"Explore Residences" },
 image:"/assets/sticky-section/sticky-1-img.png",
 },

 {
 heading:"Locations That Matter",
 paragraph:
 "Strategically located developments offering seamless connectivity to business hubs, education centers, and lifestyle destinations.",
 list:[
 "• Close to key urban corridors",
 "• Excellent transport connectivity",
 "• Surrounded by lifestyle hubs",
 ],
 link:{ href:"#", text:"View Locations" },
 image:"/assets/sticky-section/sticky-2-img.png",
 },

 {
 heading:"Built for Long-Term Value",
 paragraph:
 "Engineered for durability and appreciation, ensuring your investment continues to grow alongside evolving urban landscapes.",
 list:[
 "• High-quality construction standards",
 "• Future-ready infrastructure",
 "• Strong long-term appreciation potential",
 ],
 link:{ href:"#", text:"Explore Investment" },
 image:"/assets/sticky-section/sticky-3-img.png",
 },

 {
 heading:"Crafted for Elevated Experiences",
 paragraph:
 "From curated amenities to refined interiors, every detail is designed to deliver a seamless and elevated lifestyle experience.",
 list:[
 "• World-class lifestyle amenities",
 "• Thoughtfully designed interiors",
 "• Community-driven living spaces",
 ],
 link:{ href:"#", text:"View Amenities" },
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
