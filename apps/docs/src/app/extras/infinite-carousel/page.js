"use client";

import HorizontalCarousel from"@/components/Carousels/InfiniteCarousel";
import Card from"@/components/Card/Card";
import"./page.css";
import { ArrowLeft, ArrowRight } from"lucide-react";

const cardsData = [
 {
 id: 1,
 title:"Luxury Residences",
 subtitle:"Dubai Marina",
 description:
"Experience premium waterfront living with unmatched skyline views, private amenities, and a location built for modern luxury.",
 themeClass:"bg-[#C00707] text-red-950",
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
 themeClass:"bg-[#FF4400] text-orange-900",
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
 themeClass:"bg-[#134E8E] text-blue-500",
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
 themeClass:"bg-[#4B1D95] text-violet-300",
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
 themeClass:"bg-[#0D7A5F] text-emerald-200",
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
 themeClass:"bg-[#8A5A00] text-amber-200",
 points: [
"Community parks, schools, and lifestyle amenities.",
"Spacious interiors with practical modern layouts.",
"A balanced choice for comfort and investment.",
 ],
 },
];

function CarouselCard({ title, subtitle, description, themeClass, points }) {
 return (
 <div className="infinite-cards__item">
 <Card
 title={title}
 subtitle={subtitle}
 content={description}
 className={`infinite-cards__card ${themeClass}`}
 >
 <div className="card-content">
 <span className="card-content__tag">{subtitle}</span>
 <h2 className="card-content__title">{title}</h2>
 <p className="card-content__description">{description}</p>

 <div className="card-content__points">
 {points.map((point, pointIndex) => (
 <p key={pointIndex} className="card-content__point">
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
 <section className="infinite-cards-page">
 <div className="infinite-cards-page__head">
 <h1 className="infinite-cards-page__title">Cards Carousel</h1>
 </div>

 <div className="infinite-cards-page__carousel">
 <HorizontalCarousel
 pageStyle={{ gap:"2rem" }}
 controlsStyle={{ paddingLeft:"2rem" }}
 wrapperStyle={{
 width:"100%",
 minHeight:"auto",
 alignItems:"stretch",
 }}
 pageClassName="infinite-cards-carousel"
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
 wrapBelow={768}
 disableLoopWhenWrapped={true}
 onItemClick={(index) => console.log("clicked index:", index)}
 >
 {cardsData.map((card) => (
 <CarouselCard key={card.id} {...card} />
 ))}
 </HorizontalCarousel>
 </div>
 </section>
 );
}