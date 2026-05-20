'use client'
import { useEffect, useRef, useState } from"react";
import { gsap } from"gsap";
import { ScrollTrigger } from"gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function splitInLineOnly(el) {
 if (!el) return;

 const rawText = el.innerText;
 const words = rawText.split("");

 const containerWidth = el.offsetWidth;

 const canvas = document.createElement("canvas");
 const ctx = canvas.getContext("2d");
 const style = window.getComputedStyle(el);
 ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

 const lines = [];
 let currentLine ="";

 words.forEach((word) => {
 const test = currentLine ? `${currentLine} ${word}` : word;
 const width = ctx.measureText(test).width;
 if (width > containerWidth && currentLine) {
 lines.push(currentLine);
 currentLine = word;
 } else {
 currentLine = test;
 }
 });
 if (currentLine) lines.push(currentLine);

 el.innerHTML = lines
 .map(
 (line) =>
 `<span class="line" style="
 display: block;
 background-image: linear-gradient(to right, var(--overtake-color) 50%, var(--base-color) 50%);
 background-size: 200% 100%;
 background-position-x: 100%;
 -webkit-background-clip: text;
 background-clip: text;
 -webkit-text-fill-color: transparent;
 color: transparent;
">${line}</span>`
 )
 .join("");
}

/**
 * Converts a Tailwind text size class or arbitrary value to a CSS font-size value.
 * Handles both Tailwind classes (e.g."text-5xl") and arbitrary values (e.g."text-[2vw]").
 */
function tailwindTextToCss(twClass) {
 if (!twClass) return undefined;

 // Handle arbitrary values like text-[2vw], text-[16px], text-[1.5rem]
 const arbitraryMatch = twClass.match(/text-\[(.+)\]/);
 if (arbitraryMatch) return arbitraryMatch[1];

 // Handle named Tailwind sizes
 const sizeMap = {
"text-xs":"0.75rem",
"text-sm":"0.875rem",
"text-base":"1rem",
"text-lg":"1.125rem",
"text-xl":"1.25rem",
"text-2xl":"1.5rem",
"text-3xl":"1.875rem",
"text-4xl":"2.25rem",
"text-5xl":"3rem",
"text-6xl":"3.75rem",
"text-7xl":"4.5rem",
"text-8xl":"6rem",
"text-9xl":"8rem",
 };

 return sizeMap[twClass] ?? undefined;
}

/**
 * TextClipAnim — Scroll-triggered text reveal using clip-path/color overtake.
 *
 * @param {string} text — The text to animate
 * @param {string} overtakeColor — Foreground reveal color (default:"#ffffff")
 * @param {string} baseColor — Starting (dim) text color (default:"#3a3a3a")
 * @param {string} bgColor — Background color of the centering wrapper (default:"transparent")
 * @param {string} textSize — Tailwind text size class for desktop, e.g."text-[2vw]" (default:"text-[2vw]")
 * @param {string} mobileTextSize — Tailwind text size class for mobile, e.g."text-[5vw]" (default:"text-[5vw]")
 * @param {string} fontClass — Tailwind font class, e.g."font-serif" (default:"font-serif")
 * @param {string} containerWidth — Tailwind width/max-w class for the text container, e.g."w-[70%]" (default:"max-w-5xl")
 * @param {string} className — Extra Tailwind classes on the text element
 * @param {string} start — ScrollTrigger start offset string (default:"top 80%")
 * @param {string} end — ScrollTrigger end offset string (default:"bottom 40%")
 * @param {boolean} scrub — Whether to scrub to scroll position (default: true)
 * @param {number} stagger — Per-line stagger in seconds (default: 1)
 */
export default function TextClipAnim({
 text ="A branding and communication consult",
 overtakeColor ="#ffffff",
 baseColor ="#3a3a3a",
 bgColor ="transparent",
 textSize ="text-[2vw]",
 mobileTextSize ="text-[3vw]",
 fontClass ="font-sans",
 containerWidth ="max-w-5xl",
 className ="",
 start ="top top",
 end ="bottom bottom",
 scrub = true,
 stagger = 1,
}) {
 const wrapperRef = useRef(null);
 const [isMobile, setIsMobile] = useState(false);

 // Detect mobile on mount and on resize
 useEffect(() => {
 const mq = window.matchMedia("(max-width: 767px)");
 setIsMobile(mq.matches);
 const handler = (e) => setIsMobile(e.matches);
 mq.addEventListener("change", handler);
 return () => mq.removeEventListener("change", handler);
 }, []);

 useEffect(() => {
 const el = wrapperRef.current;
 if (!el) return;

 el.style.setProperty("--overtake-color", overtakeColor);
 el.style.setProperty("--base-color", baseColor);

 splitInLineOnly(el);

 const lines = el.querySelectorAll(".line");
 if (!lines.length) return;

 const ctx = gsap.context(() => {
 gsap.to(lines, {
 scrollTrigger: {
 trigger:'.text-anim',
 start,
 end,
 scrub: scrub ? true : false,
 },
 backgroundPositionX:"0%",
 duration: 1,
 stagger,
 ease:"power2.inOut",
 });
 }, el);

 return () => ctx.revert();
 }, [text, overtakeColor, baseColor, start, end, scrub, stagger, isMobile]);

 const resolvedSize = tailwindTextToCss(isMobile ? mobileTextSize : textSize);

 return (
 <div
 className="h-[250vh] w-full flex text-anim"
 style={{ background: bgColor }}
 >
 <div className="h-screen sticky top-0 w-full flex items-center justify-center">

  <div className={`${containerWidth} px-6 md:px-0 mx-auto`}>
 <p
 ref={wrapperRef}
 className={`leading-tight text-center tracking-tight ${fontClass} ${className}`}
 style={resolvedSize ? { fontSize: resolvedSize } : undefined}
 aria-label={text}
 >
 {text}
 </p>
 </div>
 </div>
 </div>
 );
}