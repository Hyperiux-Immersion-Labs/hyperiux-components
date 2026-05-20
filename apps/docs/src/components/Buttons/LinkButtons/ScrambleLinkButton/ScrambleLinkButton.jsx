"use client";

import React, { useEffect, useRef } from"react";
import Link from"next/link";
import { ArrowRight } from"lucide-react";
import"./ScrambleLinkButton.css";

const GLYPHS =
"abcdefghijklmnopqrstuvwxyz0123456789";

const ScrambleLinkButton = ({
 text ="",
 href ="#",
 className ="",
 textClassName ="",
 linkProps = {},
 children,
 hoverColor ="#ff6b00",
 showLine = false,
 lineClassName ="",
 showArrow = false,
 icon: Icon = ArrowRight,
 iconClassName ="",
 scrambleDuration = 700,
 stepMs = 30,
 revealStagger = 1.4,
 onClick,
 ...props
}) => {
 const scrambleRef = useRef(null);
 const timeoutRef = useRef(null);

 const finalText = typeof children ==="string" ? children : text;

 useEffect(() => {
 if (scrambleRef.current) {
 scrambleRef.current.textContent = finalText;
 }

 return () => {
 if (timeoutRef.current) clearTimeout(timeoutRef.current);
 };
 }, [finalText]);

 const scrambleToText = () => {
 const el = scrambleRef.current;
 if (!el) return;

 if (timeoutRef.current) clearTimeout(timeoutRef.current);

 let iteration = 0;
 const maxIterations = Math.max(1, Math.floor(scrambleDuration / stepMs));

 const run = () => {
 let output ="";

 for (let i = 0; i < finalText.length; i++) {
 const char = finalText[i];

 if (char ==="") {
 output +="";
 continue;
 }

 const revealThreshold =
 (((i + 1) / finalText.length) * maxIterations) / revealStagger;

 if (iteration >= revealThreshold) {
 output += char;
 } else {
 output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
 }
 }

 el.textContent = output;

 if (iteration < maxIterations) {
 iteration += 1;
 timeoutRef.current = setTimeout(run, stepMs);
 } else {
 el.textContent = finalText;
 }
 };

 run();
 };

 return (
 <Link
 href={href}
 {...linkProps}
 {...props}
 onClick={onClick}
 onMouseEnter={scrambleToText}
 className={`scramble-link-btn inline-flex items-center gap-2 ${className}`}
 style={{"--scramble-hover-color": hoverColor }}
 >
 <span
 className={`scramble-link-btn__inner ${
 showLine ? `scramble-link-line ${lineClassName}` :""
 }`}
 >
 {/* Invisible layout text keeps width stable */}
 <span className={`scramble-link-btn__ghost ${textClassName}`}>
 {finalText}
 </span>

 {/* Visible scrambled overlay */}
 <span
 ref={scrambleRef}
 className={`scramble-link-btn__text ${textClassName}`}
 aria-label={finalText}
 >
 {finalText}
 </span>
 </span>

 {showArrow && Icon && (
 <span className={`scramble-link-btn__icon ${iconClassName}`}>
 <Icon className="scramble-link-btn__svg" />
 </span>
 )}
 </Link>
 );
};

export default ScrambleLinkButton;