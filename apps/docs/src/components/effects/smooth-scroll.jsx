"use client";

import { useEffect, useRef } from"react";
import gsap from"gsap";
import ScrollTrigger from"gsap/ScrollTrigger";

if (typeof window !=="undefined") {
 gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children, className ="" }) {
 const containerRef = useRef(null);
 const contentRef = useRef(null);

 useEffect(() => {
 const container = containerRef.current;
 const content = contentRef.current;

 if (!container || !content) return;

 // Get the height of the content
 const getHeight = () => content.scrollHeight;

 // Set the body height to enable native scrolling
 const setBodyHeight = () => {
 document.body.style.height = `${getHeight()}px`;
 };

 // Smooth scroll effect
 const smoothScroll = () => {
 gsap.to(content, {
 y: -window.scrollY,
 ease:"power3.out",
 duration: 0.8,
 });
 };

 // Initialize
 setBodyHeight();
 container.style.position ="fixed";
 container.style.top ="0";
 container.style.left ="0";
 container.style.width ="100%";
 container.style.overflow ="hidden";

 // Add scroll listener
 window.addEventListener("scroll", smoothScroll);
 window.addEventListener("resize", setBodyHeight);

 // Refresh ScrollTrigger on resize
 ScrollTrigger.addEventListener("refresh", setBodyHeight);

 return () => {
 window.removeEventListener("scroll", smoothScroll);
 window.removeEventListener("resize", setBodyHeight);
 ScrollTrigger.removeEventListener("refresh", setBodyHeight);
 document.body.style.height ="";
 };
 }, []);

 return (
 <div ref={containerRef} className={className}>
 <div ref={contentRef}>{children}</div>
 </div>
 );
}

export function useSmoothScroll(options = {}) {
 const { duration = 1, ease ="power3.inOut" } = options;

 const scrollTo = (target, offset = 0) => {
 let targetY = 0;

 if (typeof target ==="number") {
 targetY = target;
 } else if (typeof target ==="string") {
 const element = document.querySelector(target);
 if (element) {
 targetY = element.getBoundingClientRect().top + window.scrollY + offset;
 }
 } else if (target instanceof Element) {
 targetY = target.getBoundingClientRect().top + window.scrollY + offset;
 }

 gsap.to(window, {
 scrollTo: { y: targetY },
 duration,
 ease,
 });
 };

 return { scrollTo };
}
