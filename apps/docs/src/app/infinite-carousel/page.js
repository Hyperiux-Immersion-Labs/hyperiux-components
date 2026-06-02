"use client";

import { InfiniteCarousel as HorizontalCarousel } from"@/components/Carousels/InfiniteCarousel";
import Card from"@/components/Card/Card";
import { ArrowLeft, ArrowRight } from"lucide-react";

const cardsData = [
 {
 id: 1,
 title:"Luxury Residences",
 subtitle:"Dubai Marina",
 description:
"Experience premium waterfront living with unmatched skyline views, private amenities, and a location built for modern luxury.",
 themeClass:"bg-[#111844] text-white",
 points: [
"Private infinity pool, spa, and concierge access.",
"Floor-to-ceiling glass with panoramic marina views.",
"Designed for buyers who want prestige and convenience.",
 ],
 },
 {
 id: 2,
 title:"Commercial Spaces",
 subtitle:"Downtown Business Bay",
 description:
"High-performance office environments crafted for ambitious brands, fast-growing teams, and companies that want presence.",
 themeClass:"bg-[#EAE0CF] text-[#111111]",
 points: [
"Flexible layouts for studios, offices, and hybrid teams.",
"Prime location close to transport, hotels, and retail.",
"Ideal for startups, agencies, and enterprise hubs.",
 ],
 },
 {
 id: 3,
 title:"Beachfront Villas",
 subtitle:"Palm Jumeirah",
 description:
"Escape into private coastal living with architectural elegance, serene surroundings, and direct beach access.",
 themeClass:"bg-[#4B5694] text-[#ffffff]",
 points: [
"Private beach entry and landscaped outdoor decks.",
"Large family spaces with premium interior finishes.",
"Created for a calmer, more exclusive lifestyle.",
 ],
 },
 {
 id: 4,
 title:"Skyline Penthouses",
 subtitle:"Jumeirah Lake Towers",
 description:
"Elevated urban living for buyers who want privacy, prestige, and dramatic city views from every level.",
 themeClass:"bg-[#8CC0EB] text-[#ffffff]",
 points: [
"Expansive terraces with lounge and dining zones.",
"Premium finishes and double-height living spaces.",
"Perfect for statement living in the heart of the city.",
 ],
 },
 {
 id: 5,
 title:"Retail Boutiques",
 subtitle:"Dubai Hills",
 description:
"Commercial retail environments positioned for visibility, high-value footfall, and strong brand presence.",
 themeClass:"bg-[#2C5EAD] text-[#FFFFFF]",
 points: [
"High-traffic locations inside premium districts.",
"Flexible layouts for flagship retail experiences.",
"Built for visibility, conversion, and long-term value.",
 ],
 },
 {
 id: 6,
 title:"Family Townhomes",
 subtitle:"Arabian Ranches",
 description:
"Well-planned residential communities designed for spacious family living, convenience, and long-term comfort.",
 themeClass:"bg-[#E8DDB4] text-[#111111]",
 points: [
"Community parks, schools, and lifestyle amenities.",
"Spacious interiors with practical modern layouts.",
"A balanced choice for comfort and investment.",
 ],
 },
];

function CarouselCard({ title, subtitle, description, themeClass, points }) {
 return (
 <div className="w-lg px-3 max-md:w-md max-md:min-w-md max-md:max-w-md max-sm:w-[calc(100vw-1.5rem)] max-sm:min-w-[calc(100vw-1.5rem)] max-sm:max-w-[calc(100vw-1.5rem)] max-sm:px-0">
 <Card
 title={title}
 subtitle={subtitle}
 content={description}
 className={`min-h-140 w-full overflow-hidden rounded-4xl max-md:min-h-128 max-sm:min-h-100 max-sm:rounded-2xl ${themeClass}`}
 >
 <div className="flex h-full flex-col gap-5">
 <span className="inline-flex w-fit items-center rounded-full border border-current px-4 py-2 text-[0.75rem] font-bold tracking-[0.12em] uppercase max-sm:text-[0.68rem]">{subtitle}</span>
 <h2 className="m-0 text-5xl leading-[0.92] tracking-tighter max-md:text-[1.75rem] max-sm:text-[1.45rem]">{title}</h2>
 <p className="m-0 max-w-[92%] text-[1.05rem] leading-[1.45] max-md:max-w-full max-md:text-[0.92rem] max-sm:text-[0.88rem]">{description}</p>

 <div className="mt-auto flex flex-col gap-3.5">
 {points.map((point, pointIndex) => (
 <p key={pointIndex} className="m-0 border-t border-current pt-3.5 text-[0.96rem] leading-[1.45] max-md:text-[0.92rem] max-sm:text-[0.88rem]">
 {point}
 </p>
 ))}
 </div>
 </div>
 </Card>
 </div>
 );
}

export default function Page() {
 return (
 <section className="min-h-screen w-full overflow-hidden bg-[#f4f0ea] px-0 pt-4 max-md:pt-6 max-md:pb-12">
 <div className=" flex items-center justify-center px-4 max-md:mb-10 max-sm:mb-10">
 <h1 className="m-0 text-center text-8xl leading-[0.9] tracking-tighter text-[#111] max-md:text-6xl max-sm:text-5xl">Cards Carousel</h1>
 </div>

 <div className="w-full">
 <HorizontalCarousel
 controlsClassName="pl-8 max-md:px-3 max-sm:px-2"
 wrapperStyle={{
 width:"100%",
 minHeight:"auto",
 alignItems:"stretch",
 }}
 pageClassName="gap-8 max-md:gap-6 max-sm:gap-4"
 prevLabel={<ArrowLeft/>}
 nextLabel={<ArrowRight/>}
 prevBtnStyle={{
 borderRadius:"999px",
 padding:"0.85rem 1rem",
 }}
 nextBtnStyle={{
 borderRadius:"999px",
 padding:"0.85rem 1rem",
 }}
 itemClassName=""
 draggable={true}
 speed={1}
 mobileBreakpoint={1024}
 >
 {cardsData.map((card) => (
 <CarouselCard key={card.id} {...card} />
 ))}
 </HorizontalCarousel>
 </div>
 </section>
 );
}
