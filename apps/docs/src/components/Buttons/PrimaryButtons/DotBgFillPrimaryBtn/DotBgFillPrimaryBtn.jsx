"use client";

import { useEffect, useRef } from"react";
import Link from"next/link";
import"./DotBgFillPrimary.css";

const DotScaleFillCharBtn = ({
 btnText ="",
 className ="",
 textClassName ="",
 staggerStep = 0.01,
 bgColor ="#ff6b00",
 textColor ="#ffffff",
 fillColor ="#ffffff",
 hoverTextColor ="#ff6b00",
 dotColor,
 ...props
}) => {
 const textRef = useRef(null);

 useEffect(() => {
 const el = textRef.current;
 if (!el) return;

 const sourceText = btnText ||"";
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
 }, [btnText, staggerStep]);

 return (
 <Link
 {...props}
 className={`dot-scale-fill-char-btn ${className}`}
 style={{
"--btn-bg": bgColor,
"--btn-text": textColor,
"--btn-fill": fillColor,
"--btn-hover-text": hoverTextColor,
"--btn-dot": dotColor || fillColor,
 }}
 >
 <span className="dot-scale-fill-char-btn__dot" />

 <span className="dot-scale-fill-char-btn__text-wrap">
 <span
 ref={textRef}
 className={`dot-scale-fill-char-btn__text ${textClassName}`}
 >
 {btnText}
 </span>
 </span>
 </Link>
 );
};

export default DotScaleFillCharBtn;