"use client";

import React, { useEffect, useRef, useState } from"react";
import Link from"next/link";
import { ArrowRight } from"lucide-react";

const CharStaggerPrimaryBtn = ({
 text ="",
 href ="#",
 btnClassName ="",
 textClassName ="",
 linkProps = {},
 children,
 staggerStep = 0.01,
 lineClassName ="",
 hoverColor ="",
 showArrow = false,
 icon: Icon = ArrowRight,
 iconClassName ="",
 bgClassName,
 onClick,
 ...props
}) => {
 const linkRef = useRef(null);
 const [isTouchHovered, setIsTouchHovered] = useState(false);
 const [supportsTouchHover, setSupportsTouchHover] = useState(false);
 const sourceText = typeof children ==="string" ? children : text;

 useEffect(() => {
 if (typeof window ==="undefined") return undefined;

 const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");
 const updateTouchSupport = () => {
 setSupportsTouchHover(mediaQuery.matches);
 };

 updateTouchSupport();
 mediaQuery.addEventListener("change", updateTouchSupport);

 return () => {
 mediaQuery.removeEventListener("change", updateTouchSupport);
 };
 }, []);

 useEffect(() => {
 if (!isTouchHovered) return undefined;

 const handlePointerDown = (event) => {
 if (linkRef.current?.contains(event.target)) return;
 setIsTouchHovered(false);
 };

 document.addEventListener("pointerdown", handlePointerDown);

 return () => {
 document.removeEventListener("pointerdown", handlePointerDown);
 };
 }, [isTouchHovered]);

 const handleClick = (event) => {
 if (supportsTouchHover && !isTouchHovered) {
 event.preventDefault();
 setIsTouchHovered(true);
 return;
 }

 onClick?.(event);
 };

 const hoverStateClass = isTouchHovered ?"text-[var(--char-hover-color)]" :"";
 const bgHoverClass = isTouchHovered ?"scale-[0.95]" :"";
 const iconHoverClass = isTouchHovered ?"translate-x-[5%]" :"";

 return (
 <Link
 ref={linkRef}
 href={href}
 {...linkProps}
 {...props}
 onClick={handleClick}
 className={`group relative inline-flex h-[4.2vw] items-center justify-center gap-2 px-10 py-3 text-inherit no-underline transition-colors duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] hover:text-(--char-hover-color) focus-visible:text-(--char-hover-color) max-md:h-[11vw] max-md:text-[3vw] max-md:font-normal max-sm:h-[15vw] max-sm:text-[4.2vw] ${hoverStateClass} ${btnClassName}`}
 style={{"--char-hover-color": hoverColor }}
 >
 <div className="relative z-2 mt-[0.3vw]">
 <span
 className="relative inline-block"
 >
 <span
 className={`relative inline-block overflow-hidden leading-[1.2] ${textClassName}`}
 >
 {[...sourceText].map((char, index) => (
 <span
 key={`${char}-${index}`}
 className="relative inline-block translate-y-0 rotate-[0.001deg] transition-transform duration-600 ease-[cubic-bezier(0.625,0.05,0,1)] will-change-transform group-hover:translate-y-[-1.3em] group-focus-visible:translate-y-[-1.3em]"
 style={{
 transitionDelay: `${index * staggerStep}s`,
 transform: isTouchHovered ?"translateY(-1.3em) rotate(0.001deg)" :undefined,
 textShadow:"0px 1.3em currentColor",
 whiteSpace: char ===" " ?"pre" :"normal",
 }}
 >
 {char}
 </span>
 ))}
 </span>
 </span>
 </div>
 <div className={`absolute h-full w-full duration-500 group-hover:scale-[0.95] group-focus-visible:scale-[0.95] ${bgHoverClass} ${bgClassName}`}/>

 
 {showArrow && Icon && (
 <div className={`flex items-center justify-start overflow-hidden ${iconClassName}`}>
 <div className={`flex w-max -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] will-change-transform group-hover:translate-x-[5%] group-focus-visible:translate-x-[5%] ${iconHoverClass} ${iconClassName}`}>
 <Icon className="h-full w-full flex-none" />
 <Icon className="h-full w-full flex-none" />
 </div>
 </div>
 )}
 </Link>
 );
};

export default CharStaggerPrimaryBtn;
