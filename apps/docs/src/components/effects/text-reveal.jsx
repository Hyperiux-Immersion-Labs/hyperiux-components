"use client";

import { useEffect, useRef } from"react";
import gsap from"gsap";
import ScrollTrigger from"gsap/ScrollTrigger";

if (typeof window !=="undefined") {
 gsap.registerPlugin(ScrollTrigger);
}

export function TextReveal({
 children,
 className ="",
 trigger ="top 80%",
 duration = 1,
 stagger = 0.1,
 y = 100,
 once = true,
 scroller = null,
}) {
 const containerRef = useRef(null);
 const textRef = useRef(null);

 useEffect(() => {
 const container = containerRef.current;
 const text = textRef.current;

 if (!container || !text) return;

 // Split text into words and wrap each
 const words = text.textContent.split("");
 text.innerHTML = words
 .map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block">${word}</span></span>`)
 .join("");

 const innerSpans = text.querySelectorAll("span > span");

 // Set initial state
 gsap.set(innerSpans, { y, opacity: 0 });

 // ScrollTrigger config
 const scrollTriggerConfig = {
 trigger: container,
 start: trigger,
 toggleActions: once ?"play none none none" :"play none none reverse",
 };

 // Add scroller if provided
 if (scroller) {
 scrollTriggerConfig.scroller = scroller;
 }

 // Create animation
 const animation = gsap.to(innerSpans, {
 y: 0,
 opacity: 1,
 duration,
 stagger,
 ease:"power3.out",
 scrollTrigger: scrollTriggerConfig,
 });

 return () => {
 animation.kill();
 ScrollTrigger.getAll().forEach((st) => {
 if (st.trigger === container) {
 st.kill();
 }
 });
 };
 }, [children, trigger, duration, stagger, y, once, scroller]);

 return (
 <div ref={containerRef} className={className}>
 <span ref={textRef}>{children}</span>
 </div>
 );
}

export function TextRevealByLine({
 children,
 className ="",
 trigger ="top 80%",
 duration = 1,
 stagger = 0.2,
 y = 50,
 once = true,
 scroller = null,
}) {
 const containerRef = useRef(null);

 useEffect(() => {
 const container = containerRef.current;
 if (!container) return;

 const lines = container.querySelectorAll("[data-reveal-line]");

 gsap.set(lines, { y, opacity: 0 });

 const scrollTriggerConfig = {
 trigger: container,
 start: trigger,
 toggleActions: once ?"play none none none" :"play none none reverse",
 };

 if (scroller) {
 scrollTriggerConfig.scroller = scroller;
 }

 const animation = gsap.to(lines, {
 y: 0,
 opacity: 1,
 duration,
 stagger,
 ease:"power3.out",
 scrollTrigger: scrollTriggerConfig,
 });

 return () => {
 animation.kill();
 ScrollTrigger.getAll().forEach((st) => {
 if (st.trigger === container) {
 st.kill();
 }
 });
 };
 }, [trigger, duration, stagger, y, once, scroller]);

 return (
 <div ref={containerRef} className={className}>
 {children}
 </div>
 );
}

export function RevealLine({ children, className ="" }) {
 return (
 <div data-reveal-line className={`overflow-hidden ${className}`}>
 {children}
 </div>
 );
}
