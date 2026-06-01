"use client";

import React, { useLayoutEffect, useRef, useState } from"react";
import gsap from"gsap";

const Tabs = ({
 tabs = [],
 defaultActiveIndex = 0,
 className ="",
 animationType ="slide", //"fade" |"slide"
 slideDistance = 40,
}) => {
 const safeDefaultIndex =
 tabs.length > 0
 ? Math.min(Math.max(defaultActiveIndex, 0), tabs.length - 1)
 : 0;

 const [activeTab, setActiveTab] = useState(safeDefaultIndex);
 const labelRefs = useRef([]);
 const contentRefs = useRef([]);
 const activeLineRef = useRef(null);

 const moveActiveLine = (index) => {
 const activeLabel = labelRefs.current[index];
 const activeLine = activeLineRef.current;

 if (!activeLabel || !activeLine) return;

 gsap.to(activeLine, {
 x: activeLabel.offsetLeft,
 width: activeLabel.offsetWidth,
 duration: 0.45,
 ease:"power3.out",
 });
 };

 const animateContent = (currentIndex, nextIndex) => {
 const currentContent = contentRefs.current[currentIndex];
 const nextContent = contentRefs.current[nextIndex];

 if (!currentContent || !nextContent || currentIndex === nextIndex) return;

 const direction = nextIndex > currentIndex ? 1 : -1;

 gsap.killTweensOf([currentContent, nextContent]);

 if (animationType ==="slide") {
 gsap.to(currentContent, {
 opacity: 0,
 x: -direction * slideDistance,
 duration: 0.28,
 ease:"power2.out",
 onComplete: () => {
 gsap.set(currentContent, {
 display:"none",
 pointerEvents:"none",
 x: 0,
 });

 gsap.set(nextContent, {
 display:"block",
 pointerEvents:"auto",
 opacity: 0,
 x: direction * slideDistance,
 });

 gsap.to(nextContent, {
 opacity: 1,
 x: 0,
 duration: 0.38,
 ease:"power3.out",
 });
 },
 });
 } else {
 gsap.to(currentContent, {
 opacity: 0,
 duration: 0.2,
 ease:"power2.out",
 onComplete: () => {
 gsap.set(currentContent, {
 display:"none",
 pointerEvents:"none",
 });

 gsap.set(nextContent, {
 display:"block",
 pointerEvents:"auto",
 opacity: 0,
 });

 gsap.to(nextContent, {
 opacity: 1,
 duration: 0.35,
 ease:"power2.out",
 });
 },
 });
 }
 };

 const handleTabClick = (index) => {
 if (index === activeTab) return;

 animateContent(activeTab, index);
 moveActiveLine(index);
 setActiveTab(index);
 };

 useLayoutEffect(() => {
 if (!tabs.length) return;

 const activeLabel = labelRefs.current[safeDefaultIndex];
 const activeLine = activeLineRef.current;

 if (activeLabel && activeLine) {
 gsap.set(activeLine, {
 x: activeLabel.offsetLeft,
 width: activeLabel.offsetWidth,
 });
 }

 contentRefs.current.forEach((content, index) => {
 if (!content) return;

 gsap.set(content, {
 display: index === safeDefaultIndex ?"block" :"none",
 opacity: index === safeDefaultIndex ? 1 : 0,
 pointerEvents: index === safeDefaultIndex ?"auto" :"none",
 x: 0,
 });
 });
 }, [tabs, safeDefaultIndex]);

 if (!tabs.length) return null;

 return (
 <div className={`h-full w-full px-[7vw] py-[7vw] max-md:p-[6vw] max-sm:px-[5vw] max-sm:py-[8vw] ${className}`}>
 <div className="relative border-b border-b-black/10">
 <div className="flex gap-[2vw] overflow-x-auto max-md:gap-[3vw] max-sm:gap-[4vw]">
 {tabs.map((tab, index) => (
 <button
 key={tab.id || index}
 ref={(el) => (labelRefs.current[index] = el)}
 onClick={() => handleTabClick(index)}
 className={`relative cursor-pointer whitespace-nowrap border-none bg-transparent px-[2vw] py-[1vw] transition-colors duration-300 ease-in-out max-md:px-[2.5vw] max-md:py-[1.5vw] max-sm:px-[3vw] max-sm:py-[2.5vw] ${
 activeTab === index
 ?"text-[#ff6b00]"
 :"text-black/50"
 }`}
 type="button"
 >
 <span className="text-[1.2vw] font-medium max-md:text-[2.2vw] max-sm:text-[4vw]">{tab.label}</span>
 </button>
 ))}
 </div>

 <div ref={activeLineRef} className="absolute bottom-0 left-0 h-0.5 bg-[#ff6b00] max-sm:h-[1.5px]" />
 </div>

 <div className="relative min-h-[24vw] w-full pt-[2vw] max-md:min-h-[32vw] max-md:pt-[4vw] max-sm:min-h-[48vw] max-sm:pt-[5vw]">
 {tabs.map((tab, index) => (
 <div
 key={tab.id || index}
 ref={(el) => (contentRefs.current[index] = el)}
 className="h-full w-full"
 style={{
 display: index === safeDefaultIndex ?"block" :"none",
 opacity: index === safeDefaultIndex ? 1 : 0,
 }}
 >
 {tab.content}
 </div>
 ))}
 </div>
 </div>
 );
};

export default Tabs;
