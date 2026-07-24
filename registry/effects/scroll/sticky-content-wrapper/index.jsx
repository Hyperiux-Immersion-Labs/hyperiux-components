import { StickyContentComp } from "./StickyContentComp";

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
 image:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg",
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
 image:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg",
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
 image:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg",
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
 image:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-04.jpg",
 },
];

export default function StickyContentWrapper() {
 return (
 <section className="bg-white">
 <StickyContentComp
 items={stickyItems}
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
 );
}



