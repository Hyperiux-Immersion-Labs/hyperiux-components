"use client";

import React, { useEffect, useRef } from"react";
import gsap from"gsap";
import { SplitText } from"gsap/SplitText";
import { ScrollTrigger } from"gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function RightSlideAnim({
 children,
 animateOnScroll = true,
 delay = 0,
 className ="",
 scrub = true, // 👈 NEW
}) {
 const containerRef = useRef(null);
 const splitRefs = useRef([]);
 const charsRef = useRef([]);

 useEffect(() => {
 if (!containerRef.current) return;

 splitRefs.current = [];
 charsRef.current = [];

 const elements = containerRef.current.hasAttribute("data-copy-wrapper")
 ? Array.from(containerRef.current.children)
 : [containerRef.current];

 let ctx;

 const init = async () => {
 await document.fonts.ready;

 ctx = gsap.context(() => {
 elements.forEach((element) => {
 const split = SplitText.create(element, {
 type:"lines,chars",
 charsClass:"char++",
 reduceWhiteSpace: false,
 });

 splitRefs.current.push(split);
 charsRef.current.push(...split.chars);
 });

 gsap.set(charsRef.current, {
 x: 20,
 opacity: 0,
 willChange:"transform",
 });

 const animationProps = {
 x: 0,
 opacity: 1,
 duration: 0.5,
 stagger: 0.03,
 ease:"power3.out",
 delay,
 };

 if (animateOnScroll) {
 gsap.to(charsRef.current, {
 ...animationProps,
 scrollTrigger: {
 trigger: containerRef.current,
 start:"top 80%",
 end:"bottom 60%",
 scrub, // 👈 dynamic
 },
 });
 } else {
 gsap.to(charsRef.current, animationProps);
 }
 }, containerRef);
 };

 init();

 return () => {
 if (ctx) ctx.revert();
 splitRefs.current.forEach((split) => split?.revert());
 };
 }, [animateOnScroll, delay, scrub]);

 return (
 <div ref={containerRef} data-copy-wrapper="true" className={className}>
 {children}
 </div>
 );
}