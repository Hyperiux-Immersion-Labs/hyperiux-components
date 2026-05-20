'use client';

import React, { useEffect, useRef } from'react';
import gsap from'gsap';
import SplitText from'gsap/dist/SplitText';
import ScrambleTextPlugin from'gsap/dist/ScrambleTextPlugin';
import ScrollTrigger from'gsap/dist/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrambleTextPlugin, ScrollTrigger);

const ScrambleText = ({  text,  speed = 0.6,  charType ='lowercase',  textSize ='text-base',
 textColor ='text-white',
 align ='left',
 className }) => {
 const elRef = useRef(null);
 const splitRef = useRef(null);
 const tlRef = useRef(null);

 const alignClass =
 align ==='right'
 ?'text-right'
 :'text-left';

 useEffect(() => {
 let isCancelled = false;

 const setup = async () => {
 try {
 if (document?.fonts?.ready) {
 await document.fonts.ready;
 } else {
 await new Promise((r) => requestAnimationFrame(() => r(null)));
 }
 } catch {}

 if (isCancelled || !elRef.current) return;

 tlRef.current?.kill();
 splitRef.current?.revert();
 splitRef.current = null;

 const ctx = gsap.context(() => {
 const el = elRef.current;

 // LOCK HEIGHT BEFORE SPLIT (IMPORTANT FIX)
 const originalHeight = el.offsetHeight;
 gsap.set(el, { minHeight: originalHeight });

 const split = new SplitText(el, { type:'words,chars' });
 splitRef.current = split;

 const chars = split.chars;
 const words = split.words;

 // Prevent word breaking
 gsap.set(words, {
 display:'inline-block',
 whiteSpace:'nowrap',
 });

 gsap.set(el, {
 wordBreak:'keep-all',
 });

 // Character styling
 gsap.set(chars, {
 display:'inline-block',
 });

 el.removeAttribute('aria-label');
 chars.forEach((c) => c.removeAttribute('aria-label'));

 gsap.set(chars, { opacity: 0 });

 const originals = chars.map((c) => c.textContent ||'');

 const tl = gsap.timeline({
 paused: true,
 defaults: { ease:'none' },
 onComplete: () => {
  gsap.set(el, { minHeight:'auto' });
 }
 });

 tlRef.current = tl;

 tl.to(chars, {
 duration: 0.7,
 scrambleText: {
 text: (i) => originals[i],
 chars: charType ||'lowercase',
 speed,
 revealDelay: 0.2,
 },
 opacity: 1,
 stagger: 0.04,
 });

 tl.to(
 chars,
 {
 opacity: 1,
 duration: 0.4,
 stagger: 0.02,
 ease:'power1.out',
 },
'>-0.2'
 );

 tl.to(
 chars,
 {
 opacity: 0.85,
 duration: 0.3,
 stagger: 0.02,
 },
'>-0.2'
 );

 ScrollTrigger.create({
 trigger: el,
 start:'top 40%',
 once: true,
 markers: false,
 onEnter: () => tl.play(),
 });
 }, elRef);

 return () => ctx.revert();
 };

 const clean = setup();

 return () => {
 (async () => {
 await clean;
 })();
 tlRef.current?.kill();
 splitRef.current?.revert();
 };
 }, [text, speed, charType]);

 return (
 <div>
 <p
 ref={elRef}
 className={`${textSize} ${textColor} ${alignClass} w-full tracking-tight ${
 className ??''
 }`}
 style={{
 wordBreak:'keep-all',
 overflowWrap:'normal',
 }}
 >
 {text}
 </p>
 </div>
 );
};

export default ScrambleText;