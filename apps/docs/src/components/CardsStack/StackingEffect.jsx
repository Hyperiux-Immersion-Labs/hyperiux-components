"use client";

import React, { useEffect, useRef } from"react";
import gsap from"gsap";
import ScrollTrigger from"gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const State = ({ bgColor ="bg-white", cards = [] }) => {
 const sectionRef = useRef(null);
 const rowRefs = useRef([]);
 const cardRefs = useRef([]);

 useEffect(() => {
 rowRefs.current = rowRefs.current.slice(0, cards.length);
 cardRefs.current = cardRefs.current.slice(0, cards.length);

 const ctx = gsap.context(() => {
 const currentCards = cardRefs.current.filter(Boolean);
 const currentRows = rowRefs.current.filter(Boolean);

 currentCards.forEach((card, index) => {
 gsap.set(card, {
 autoAlpha: 1,
 scale: index === 0 ? 1 : 1.1,
 transformOrigin:"center center",
 });
 });

 currentCards.slice(0, -1).forEach((card, index) => {
 const nextRow = currentRows[index + 1];
 const nextCard = currentCards[index + 1];

 if (!nextRow || !nextCard) return;

 const handoff = gsap.timeline({
 scrollTrigger: {
 trigger: nextRow,
 start:"top bottom+=20%",
 end:"top top-=28%",
 scrub: true,
 invalidateOnRefresh: true,
 },
 });

 handoff.to(
 nextCard,
 {
 scale: 1,
 ease:"none",
 },
 0
 );

 gsap.to(card, {
 autoAlpha: 0,
 ease:"none",
 scrollTrigger: {
 trigger: nextRow,
 start:"top top+=14%",
 end:"top top+=2%",
 scrub: true,
 invalidateOnRefresh: true,
 },
 });
 });

 ScrollTrigger.refresh();
 }, sectionRef);

 return () => {
 ctx.revert();
 };
 }, [cards]);

 return (
 <section
 id="state"
 ref={sectionRef}
 className={`main ${bgColor} py-[7%] max-sm:py-[15%]`}
 >
 <div className="wrap flex w-full flex-col items-center px-[5%] py-[10vw] tablet:gap-[5vw]">
 {cards.map((item, index) => (
 <div
 key={item.id}
 ref={(el) => {
 rowRefs.current[index] = el;
 }}
 className={`relative w-full min-h-[180vh] ${
 index === 0 ?"" :"-mt-[70vh]"
 } max-sm:min-h-[130vh] ${
 index === 0 ?"max-sm:mt-0" :"max-sm:-mt-[50vh]"
 }`}
 >
 <div
 className="sticky top-[15vh] max-sm:top-[10vh]"
 style={{ zIndex: index + 1 }}
 >
 <Card
 cardRef={(el) => {
 cardRefs.current[index] = el;
 }}
 title={item.title}
 description={item.description}
 bgColor={item.bgColor}
 textColor={item.textColor}
 />
 </div>
 </div>
 ))}
 </div>
 </section>
 );
};

export default State;

const Card = ({ title, description, bgColor, textColor, cardRef }) => {
 return (
 <div
 ref={cardRef}
 className="fadeUp mx-auto flex h-[32vw] max-sm:h-[65vh] w-[80%] max-sm:w-full items-center justify-between gap-[4vw] rounded-[45px] px-[4vw] py-[3vw] tablet:h-[65vh] tablet:flex-col tablet:justify-center tablet:gap-[4vw] tablet:rounded-[4vw] tablet:py-[5vw] max-sm:py-[15vw] max-sm:px-[8vw] max-sm:min-h-[50vw] max-sm:flex-col max-sm:rounded-[9vw] ="
 style={{ backgroundColor: bgColor }}
 >
 <div className="w-[48%] tablet:w-full max-sm:w-full">
 <h2
 className="para-animation w-full text-[5.1vw] font-medium leading-[1.1] tablet:text-[5vw] max-sm:text-[10vw]"
 style={{ color: textColor }}
 >
 {title}
 </h2>
 </div>

 <div className="flex w-[48%] flex-col items-left justify-center gap-[2vw] font-light tablet:w-full max-sm:w-full max-sm:gap-[7vw]">
 <p
 className="w-full text-justify text-[1.3vw] leading-normal tablet:text-[2.2vw] max-sm:w-full max-sm:text-center max-sm:text-[4.5vw]"
 style={{ color: textColor }}
 >
 {description}
 </p>
 </div>
 </div>
 );
};