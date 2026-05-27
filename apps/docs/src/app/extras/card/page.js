"use client";
import Card from"@/components/Card/Card";
import"./page.css";
import { useEffect, useRef } from"react";
import gsap from"gsap";
import ScrollTrigger from"gsap/dist/ScrollTrigger";
import { ReactLenis } from"lenis/react";

gsap.registerPlugin(ScrollTrigger);

const cardsData = [
 {
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
];

const Page = () => {
 const sectionRef = useRef(null);

 useEffect(() => {
 if(globalThis.innerWidth>1024){
 const ctx = gsap.context(() => {
 gsap.to(
".card-block",
  {
 translateY:"0%",
 stagger: 0.15,
 // ease:"none",
 ease:"power2.out",
 scrollTrigger: {
 trigger:"#card-section",
 start:"top top",
 end:"bottom bottom",
 scrub: true,
 // markers: true,
 },
 },
 );
 }, sectionRef);
  return () => ctx.revert();

 }
 }, []);

 return (
 <ReactLenis root>
 <section
 className="cards-page h-[300vh]"
 id="card-section"
 ref={sectionRef}
 >
 <div className="w-full overflow-hidden h-screen sticky top-[7%] flex flex-col gap-y-[5vw]">
 <h1 className="cards-page__title">Cards Layout</h1>

 <div className="cards-page__grid">
 {cardsData.map((card, index) => (
 <div key={index} className="card-block">

 <Card
  title={card.title}
 subtitle={card.subtitle}
 content={card.description}
 className={card.themeClass}
 >
 <div className="card-content">
 <span className="card-content__tag">{card.subtitle}</span>
 <h2 className="card-content__title">{card.title}</h2>
 <p className="card-content__description">
 {card.description}
 </p>

 <div className="card-content__points">
 {card.points.map((point, pointIndex) => (
 <p key={pointIndex} className="card-content__point">
 {point}
 </p>
 ))}
 </div>
 </div>
 </Card>

 </div>
 ))}
 </div>
 </div>
 </section>
 </ReactLenis>
 );
};

export default Page;
