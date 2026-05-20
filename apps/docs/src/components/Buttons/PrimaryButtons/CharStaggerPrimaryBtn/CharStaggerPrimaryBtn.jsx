"use client";

import React, { useEffect, useRef } from"react";
import Link from"next/link";
import { ArrowRight } from"lucide-react";
import"./CharStaggerPrimary.css";

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
 const textRef = useRef(null);

 useEffect(() => {
 const el = textRef.current;
 if (!el) return;

 const sourceText = text || el.getAttribute("data-text") ||"";
 el.innerHTML ="";

 [...sourceText].forEach((char, index) => {
 const span = document.createElement("span");
 span.textContent = char;
 span.style.transitionDelay = `${index * staggerStep}s`;

 if (char ===" ") {
 span.style.whiteSpace ="pre";
 }

 el.appendChild(span);
 });
 }, [text, staggerStep]);

 return (
 <Link
 href={href}
 {...linkProps}
 {...props}
 onClick={onClick}
 className={`char-stagger-primary group inline-flex justify-center items-center gap-2 relative px-10 py-3 ${btnClassName}`}
 style={{"--char-hover-color": hoverColor }}
 >
 <div className="mt-[0.3vw] relative z-2">
 <span
 className={`char-stagger-primary__inner `}
 >
 <span
 ref={textRef}
 data-text={typeof children ==="string" ? children : text}
 className={`char-stagger-primary__text ${textClassName}`}
 >
 {typeof children ==="string" ? children : text}
 </span>
 </span>
 </div>
 <div className={`w-full h-full absolute group-hover:scale-[0.95] duration-500 ${bgClassName}`}/>

 
 {showArrow && Icon && (
 <div className={`char-stagger-primary__icon ${iconClassName}`}>
 <div className={`icon-wrapper ${iconClassName}`}>
 <Icon className="char-stagger-primary__svg" />
 <Icon className="char-stagger-primary__svg" />
 </div>
 </div>
 )}
 </Link>
 );
};

export default CharStaggerPrimaryBtn;