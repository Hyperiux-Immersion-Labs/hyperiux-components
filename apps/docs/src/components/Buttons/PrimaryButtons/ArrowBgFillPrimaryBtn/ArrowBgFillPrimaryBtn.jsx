"use client";

import { useEffect, useState } from"react";
import Link from"next/link";

const ArrowBgFillPrimaryBtn = ({
 btnText,
 className ="",

 bgColor ="#ff6b00",
 textColor ="#ffffff",

 fillBgColor ="#ffffff",
 fillTextColor ="#ff6b00",

 hoverFillBgColor ="#ffffff",
 hoverFillTextColor ="#ff6b00",

 // NEW
 arrowColor,
 hoverArrowColor,

 ...props
}) => {
 const [isReady, setIsReady] = useState(false);

 useEffect(() => {
 const frame = window.requestAnimationFrame(() => {
 setIsReady(true);
 });

 return () => window.cancelAnimationFrame(frame);
 }, []);

 return (
 <>
 <Link
 {...props}
 className={`arrow-bg-fill-btn ${className}`}
 style={{
 "--btn-bg": bgColor,
 "--btn-text": textColor,
 "--btn-fill-bg": fillBgColor,
 "--btn-fill-text": fillTextColor,
 "--btn-fill-bg-hover": hoverFillBgColor,
 "--btn-fill-text-hover": hoverFillTextColor,
 "--btn-arrow": arrowColor || fillTextColor,
 "--btn-arrow-hover": hoverArrowColor || hoverFillTextColor,
 opacity: isReady ? 1 : 0,
 }}
 >
 <span className="arrow-bg-fill-btn__text">{btnText}</span>

 <div aria-hidden="true" className="arrow-bg-fill-btn__circle">
 <span>{btnText}</span>

 <div className="arrow-bg-fill-btn__circle-text">
 <svg
 viewBox="0 0 10 10"
 fill="none"
 xmlns="http://www.w3.org/2000/svg"
 className="arrow-bg-fill-btn__icon"
 >
 <path
 fillRule="evenodd"
 clipRule="evenodd"
 d="M3.82475e-07 5.625L7.625 5.625L4.125 9.125L5 10L10 5L5 -4.37114e-07L4.125 0.874999L7.625 4.375L4.91753e-07 4.375L3.82475e-07 5.625Z"
 className="arrow-bg-fill-btn__path"
 />
 <path
 fillRule="evenodd"
 clipRule="evenodd"
 d="M3.82475e-07 5.625L7.625 5.625L4.125 9.125L5 10L10 5L5 -4.37114e-07L4.125 0.874999L7.625 4.375L4.91753e-07 4.375L3.82475e-07 5.625Z"
 className="arrow-bg-fill-btn__path"
 />
 </svg>
 </div>
 </div>
 </Link>

 <style jsx global>{`
 .arrow-bg-fill-btn {
   display: inline-flex;
   align-items: center;
   justify-content: center;
   height: 4.2vw;
   padding-right: 5vw;
   padding-left: 3vw;
   position: relative;
   width: fit-content;
   min-width: unset;
   max-width: unset;
   border-radius: 1000px;
   background: var(--btn-bg);
   color: var(--btn-text);
   font-size: 1.05vw;
   font-weight: 500;
   text-rendering: geometricPrecision;
   white-space: nowrap;
   overflow: hidden;
   transition: opacity 0.01s linear;
 }

 .arrow-bg-fill-btn__text {
   position: relative;
   z-index: 1;
 }

 .arrow-bg-fill-btn__circle {
   clip-path: inset(0.7vw 0.7vw 0.7vw calc(100% - 3.6vw) round 4vw);
   position: absolute;
   inset: -1px;
   border-radius: 1000px;
   display: flex;
   align-items: center;
   padding-right: 5vw;
   padding-left: 3vw;
   z-index: 2;
   background-color: var(--btn-fill-bg);
   color: var(--btn-fill-text);
   pointer-events: none;
   transition: all 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);
 }

 .arrow-bg-fill-btn__circle-text {
   padding: 0 1px 0 0;
   display: flex;
   align-items: center;
   gap: 1vw;
   width: 100%;
   white-space: nowrap;
 }

 .arrow-bg-fill-btn__icon {
   width: 0.8vw;
   height: 0.8vw;
   position: absolute;
   right: 1.8vw;
   overflow: hidden;
   flex: 0 0 auto;
   color: var(--btn-arrow);
 }

 .arrow-bg-fill-btn:hover .arrow-bg-fill-btn__icon {
   color: var(--btn-arrow-hover);
 }

 .arrow-bg-fill-btn__path {
   transition: transform 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);
   transform-origin: center center;
   fill: currentColor;
 }

 .arrow-bg-fill-btn__path:first-child {
   transform: translateX(-120%) scale(0);
 }

 .arrow-bg-fill-btn:hover .arrow-bg-fill-btn__path:first-child {
   transform: translateX(0) scale(1);
 }

 .arrow-bg-fill-btn:hover .arrow-bg-fill-btn__path:last-child {
   transform: translateX(120%) scale(0);
 }

 .arrow-bg-fill-btn:hover .arrow-bg-fill-btn__circle {
   clip-path: inset(0 round 4vw);
   background-color: var(--btn-fill-bg-hover);
   color: var(--btn-fill-text-hover);
 }

 @media screen and (max-width: 1024px) {
   .arrow-bg-fill-btn {
     height: 11vw;
     padding-right: 10vw;
     padding-left: 5vw;
     font-size: 3vw;
     font-weight: 400;
   }

   .arrow-bg-fill-btn__circle {
     padding-right: 10vw;
     padding-left: 5vw;
     clip-path: inset(16% 6% 18% calc(100% - 9vw) round 4vw);
   }

   .arrow-bg-fill-btn__icon {
     width: 2vw;
     height: 2vw;
     right: 4.5vw;
   }

   .arrow-bg-fill-btn__circle-text {
     padding: 0 2% 0 0;
     gap: 2vw;
   }

   .arrow-bg-fill-btn:hover .arrow-bg-fill-btn__circle {
     clip-path: inset(0 round 4vw);
   }
 }

 @media screen and (max-width: 540px) {
   .arrow-bg-fill-btn {
     height: 15vw;
     padding-right: 15vw;
     padding-left: 7vw;
     font-size: 4.2vw;
     font-weight: 400;
   }

   .arrow-bg-fill-btn__circle {
     padding-right: 15vw;
     padding-left: 7vw;
     clip-path: inset(18% 6% 18% calc(100% - 12.5vw) round 10vw);
   }

   .arrow-bg-fill-btn__icon {
     width: 3.5vw;
     height: 3.5vw;
     right: 5.8vw;
   }

   .arrow-bg-fill-btn__circle-text {
     padding: 0 3.5% 0 0;
     gap: 2.5vw;
   }

   .arrow-bg-fill-btn:hover .arrow-bg-fill-btn__circle {
     clip-path: inset(0 round 10vw);
   }
 }
 `}</style>
 </>
 );
};

export default ArrowBgFillPrimaryBtn;
