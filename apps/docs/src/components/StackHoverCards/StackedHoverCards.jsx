"use client";

import React, { useMemo, useState } from"react";
import"./StackedHoverCards.css";

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
 <div className={`shc ${className}`}>
 {/* desktop */}
 <div
 className="shc__desktop"
 style={{
"--stack-width": `${totalWidth}px`,
"--stack-height": `${cardHeight + hoverLift + 24}px`,
 }}
 >
 {preparedCards.map((card, index) => (
 <div
 key={card.id ?? index}
 className={`shc__card ${card.accent ||""}`}
 style={getCardStyle(card, index)}
 onMouseEnter={() => setActiveIndex(index)}
 onMouseLeave={() => setActiveIndex(null)}
 >
 <div className="shc__glow" />

 <div className="shc__body">
 <p className="shc__quote">“{card.quote}”</p>
 </div>

 <div className="shc__footer">
 <div className="shc__divider" />
 <div className="shc__footer-row">
 <div className="shc__explore-wrap">
 <div className="shc__explore-icon">↗</div>
 <span className="shc__explore-text">Explore</span>
 </div>

 <div className="shc__index">0{index + 1}</div>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* tablet + mobile */}
 <div className="shc__mobile">
 {cards.map((card, index) => (
 <div
 key={card.id ?? index}
 className={`shc__card shc__card--static ${card.accent ||""}`}
 style={{
 background: card.bg,
 }}
 >
 <div className="shc__glow" />

 <div className="shc__body">
 <p className="shc__quote">“{card.quote}”</p>
 </div>

 <div className="shc__footer">
 <div className="shc__divider" />
 <div className="shc__footer-row">
 <div className="shc__explore-wrap">
 <div className="shc__explore-icon">↗</div>
 <span className="shc__explore-text">Explore</span>
 </div>

 <div className="shc__index">0{index + 1}</div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
};

export default StackedHoverCards;