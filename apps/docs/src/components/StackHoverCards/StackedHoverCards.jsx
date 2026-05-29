"use client";

import React, { useMemo, useState } from"react";

const PRESET_ROTATIONS = [-8, 4, -3, 5, -4, 6, 3, -6, 2, -5];

const StackedHoverCards = ({
 cards = [],
 cardWidth = 280,
 cardHeight = 360,
 overlap = 92,
 hoverLift = 28,
 pushDistance = 110,
 className ="",
}) => {
 const [activeIndex, setActiveIndex] = useState(null);

 const preparedCards = useMemo(() => {
 return cards.map((card, index) => {
 const rotation =
 PRESET_ROTATIONS[index % PRESET_ROTATIONS.length] +
 (index % 2 === 0 ? 0 : 1);

 const baseX = index * overlap;

 return {
 ...card,
 _rotation: rotation,
 _baseX: baseX,
 _baseZ: index + 1,
 };
 });
 }, [cards, overlap]);

 const getCardStyle = (card, index) => {
 const isActive = activeIndex === index;
 const hasActive = activeIndex !== null;

 let x = card._baseX;
 let y = 0;
 let rotate = card._rotation;
 let zIndex = card._baseZ;
 let scale = 1;

 if (hasActive) {
 if (index < activeIndex) {
 x -= pushDistance;
 } else if (index > activeIndex) {
 x += pushDistance;
 }

 if (isActive) {
 x = card._baseX;
 y = -hoverLift;
 rotate = 0;
 zIndex = 999;
 scale = 1.035;
 }
 }

 const transition = isActive
 ?"transform 480ms cubic-bezier(0.22, 1.6, 0.32, 1), box-shadow 900ms cubic-bezier(0.22, 1.6, 0.32, 1)"
 : hasActive
 ?"transform 700ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 700ms cubic-bezier(0.22, 1, 0.36, 1)"
 :"transform 480ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 380ms cubic-bezier(0.4, 0, 0.2, 1)";

 return {
"--card-width": `${cardWidth}px`,
"--card-height": `${cardHeight}px`,
 transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
 zIndex,
 transition,
 // boxShadow: isActive
 // ?"0 28px 80px rgba(0,0,0,0.22)"
 // :"0 12px 34px rgba(0,0,0,0.12)",
 background: card.bg,
 };
 };

 const totalWidth =
 preparedCards.length > 0
 ? preparedCards.at(-1)._baseX + cardWidth
 : cardWidth;

 return (
 <div className={`relative w-full px-[7vw] ${className}`}>
 {/* desktop */}
 <div
 className="relative mx-auto max-md:hidden"
 style={{
"--stack-width": `${totalWidth}px`,
"--stack-height": `${cardHeight + hoverLift + 24}px`,
 width: "var(--stack-width)",
 height: "var(--stack-height)",
 }}
 >
 {preparedCards.map((card, index) => (
 <div
 key={card.id ?? index}
 className={`absolute top-0 left-0 flex h-(--card-height) w-(--card-width) cursor-pointer select-none flex-col justify-between overflow-hidden rounded-[1.667vw] border border-black/10 p-[1.667vw] origin-[center_center] will-change-transform ${card.accent ||""}`}
 style={getCardStyle(card, index)}
 onMouseEnter={() => setActiveIndex(index)}
 onMouseLeave={() => setActiveIndex(null)}
 >
 <div />

 <div className="relative z-2 flex flex-1 items-center">
 <p className="m-0 max-w-[92%] text-[1.9rem] leading-[0.95] tracking-tighter">“{card.quote}”</p>
 </div>

 <div className="relative z-2 flex flex-col gap-[1.111vw]">
 <div className="h-[0.069vw] w-full bg-black/20" />
 <div className="flex items-center justify-between gap-[1.111vw]">
 <div className="flex items-center gap-[0.556vw]">
 <div className="flex size-[2.5vw] items-center justify-center rounded-full border border-black/10 bg-black text-[0.9rem] text-white shadow-[0_0.417vw_0.972vw_rgba(0,0,0,0.12)]">↗</div>
 <span className="text-[0.833vw] font-semibold uppercase tracking-[0.14em]">Explore</span>
 </div>

 <span className="text-[0.764vw] uppercase tracking-[0.16em] opacity-70">0{index + 1}</span>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* tablet + mobile */}
 <div className="hidden flex-col gap-[1.563vw] max-md:flex max-md:gap-[2.083vw] max-sm:gap-[8.8vw]">
 {cards.map((card, index) => (
 <div
 key={card.id ?? index}
 className={`relative flex min-h-[20.313vw] w-full cursor-default select-none flex-col justify-between overflow-hidden rounded-[2.148vw] border border-black/10 p-[2.148vw] max-md:h-auto max-md:min-h-[25.391vw] max-md:rounded-[2.148vw] max-md:p-[2.148vw] max-md:transform-[none!important] max-md:[transition:none!important] max-sm:min-h-[58.667vw] max-sm:rounded-[4.8vw] max-sm:p-[4.8vw] ${card.accent ||""}`}
 style={{
 background: card.bg,
 }}
 >
 <div />

 <div className="relative z-2 flex flex-1 items-center">
 <p className="m-0 max-w-full text-[1.55rem] leading-none tracking-tighter max-sm:text-[1.2rem] max-sm:leading-[1.05] max-sm:tracking-[-0.04em]">“{card.quote}”</p>
 </div>

 <div className="relative z-2 flex flex-col gap-[1.563vw] max-md:gap-[2.083vw] max-sm:gap-[3.2vw]">
 <div className="h-[0.098vw] w-full bg-black/20 max-sm:h-[0.267vw]" />
 <div className="flex items-center justify-between gap-[1.563vw] max-md:gap-[2.083vw] max-sm:gap-[3.2vw]">
 <div className="flex items-center gap-[0.781vw] max-md:gap-[1.042vw] max-sm:gap-[2.1vw]">
 <div className="flex size-[3.5vw] items-center justify-center rounded-full border border-black/10 bg-black text-[0.9rem] text-white shadow-[0_0.586vw_1.367vw_rgba(0,0,0,0.12)] max-md:size-[4.1vw] max-sm:size-[8.5vw] max-sm:text-[0.82rem]">↗</div>
 <span className="text-[1.172vw] font-semibold uppercase tracking-[0.14em] max-md:text-[1.367vw] max-sm:text-[2.667vw]">Explore</span>
 </div>

 <span className="text-[1vw] uppercase tracking-[0.16em] opacity-70 max-md:text-[1.2vw] max-sm:text-[2.6vw]">0{index + 1}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
};

export default StackedHoverCards;
