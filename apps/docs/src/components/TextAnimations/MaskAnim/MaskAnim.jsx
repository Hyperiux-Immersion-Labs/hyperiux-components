"use client";
import gsap from"gsap";
import { SplitText } from"gsap/SplitText";
import React, { useEffect, useRef } from"react";
import ScrollTrigger from"gsap/dist/ScrollTrigger";
import"./MaskAnim.css";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function MaskAnim({
 children,
 animateOnScroll = true,
 delay = 0,
 className ="",
 scrub = true,
}) {
 const containerRef = useRef(null);
 const splitRefs = useRef([]);
 const linesRef = useRef([]);
 const triggersRef = useRef([]);

 useEffect(() => {
 const el = containerRef.current;
 if (!el) return;

 const prefersReduced =
 window.matchMedia &&
 window.matchMedia("(prefers-reduced-motion: reduce)").matches;

 splitRefs.current = [];
 linesRef.current = [];
 triggersRef.current = [];

 const elements = Array.from(el.children);

 const waitForFonts = async () => {
 if (document.fonts && document.fonts.ready) {
 try {
 await document.fonts.ready;
 } catch {}
 }
 };

 const forceAriaVisible = (root) => {
 if (!root) return;
 const hidden = root.querySelectorAll('[aria-hidden="true"]');
 hidden.forEach((node) => node.setAttribute("aria-hidden","false"));
 };

 let unmounted = false;

 (async () => {
 await waitForFonts();
 if (unmounted) return;

 elements.forEach((element) => {
 const split = SplitText.create(element, {
 type:"lines",
 linesClass:"Headingline++",
 lineThreshold: 0.1,
 });

 splitRefs.current.push(split);

 const textIndent = getComputedStyle(element).textIndent;
 if (textIndent && textIndent !=="0px" && split.lines.length > 0) {
 split.lines[0].style.paddingLeft = textIndent;
 element.style.textIndent ="0";
 }

 forceAriaVisible(element);
 linesRef.current.push(...split.lines);
 });

 if (!linesRef.current.length) return;

 if (prefersReduced) {
 gsap.set(linesRef.current, { maskPosition:"0% 100%" });
 elements.forEach(forceAriaVisible);
 return;
 }

 gsap.set(linesRef.current, {
 maskPosition:"100% 100%",
 });

 const animationProps = {
 maskPosition:"0% 100%",
 stagger: 0.2,
 duration: 5.5,
 ease:"power3.out",
 delay,
 };

 if (animateOnScroll) {
 const tween = gsap.to(linesRef.current, {
 ...animationProps,
 scrollTrigger: {
 trigger: el,
 start:"top 80%",
 once: scrub ? false : true,
 scrub,
 onEnter: () => elements.forEach(forceAriaVisible),
 },
 });

 if (tween?.scrollTrigger) {
 triggersRef.current.push(tween.scrollTrigger);
 }
 } else {
 gsap.to(linesRef.current, animationProps);
 }
 })();

 return () => {
 unmounted = true;

 triggersRef.current.forEach((trigger) => trigger?.kill());
 triggersRef.current = [];

 splitRefs.current.forEach((split) => split?.revert());
 splitRefs.current = [];

 linesRef.current = [];
 };
 }, [animateOnScroll, delay, scrub]);

 return (
 <div ref={containerRef} data-copy-wrapper="true" className={className}>
 {children}
 </div>
 );
}