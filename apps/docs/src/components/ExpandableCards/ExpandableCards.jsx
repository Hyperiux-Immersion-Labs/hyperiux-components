'use client';
import { useEffect, useRef, useState } from"react";
import Image from"next/image";
import gsap from"gsap";
import { X, ArrowRight, Plus } from"lucide-react";

/**
 * ExpandableCards
 *
 * @prop {string} heading - Section heading text
 * @prop {string} clickLabel - Label shown on mobile/tablet cards before expand (e.g."Click")
 * @prop {string} overlayColor - Background color of the hover overlay (e.g."#F2F2E9")
 * @prop {string} expandedBgColor - Background color of the expanded panel (e.g."#747977")
 * @prop {string} expandedTextColor - Text color of the expanded panel (e.g."#000000")
 * @prop {Array} items - Array of card objects: { num, title, para, image }
 */
const ExpandableCards = ({ heading ="", clickLabel ="Click", overlayColor ="#F2F2E9", expandedBgColor ="#747977", expandedTextColor ="#000000", items = [] }) => {
 const [active, setActive] = useState(false);
 const [currentIndex, setCurrentIndex] = useState(null);
 const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
 const [isMobile, setIsMobile] = useState(false);
 const titleRefs = useRef([]);

 const isRTL =
 typeof window !=="undefined" && document?.documentElement?.dir ==="rtl";

 useEffect(() => {
 const handleResize = () => {
 setIsMobile(window.innerWidth <= 1022);
 };

 if (globalThis.innerWidth <= 1021) {
 setCurrentIndex(0);
 }

 handleResize();
 window.addEventListener("resize", handleResize);
 return () => window.removeEventListener("resize", handleResize);
 }, []);

 const handleMouseEnter = (index) => {
 if (active && index === currentIndex) return;
 const el = titleRefs.current[index];
 if (!el) return;
 gsap.fromTo(
 el,
 { y:"-100%", opacity: 0 },
 { y:"0%", opacity: 1, duration: 0.55, ease:"power2.inOut" }
 );
 };

 const handleMouseLeave = (index) => {
 if (active && index === currentIndex) return;
 const el = titleRefs.current[index];
 if (!el) return;
 gsap.to(el, { y:"-100%", opacity: 0, duration: 0.5, ease:"power2.inOut" });
 };

 const handleClose = (e) => {
 e.stopPropagation();
 setActive(false);
 setCurrentIndex(null);
 };

 return (
 <section className=" pb-[7vw] pt-[2vw] max-sm:py-[10vw] dark w-screen overflow-hidden relative">
 <div className="px-[5%] max-sm:px-[5%]">
  <div className="w-full max-sm:overflow-x-scroll tablet:overflow-x-scroll">
 <div className="flex gap-[1.3vw] max-sm:gap-y-[8vw] max-sm:w-fit max-sm:gap-[4vw] tablet:w-fit">
 {items.map((item, index) => {
 const isExpanded = index === currentIndex && active;
 return (
 <div
 key={index}
 className="w-[17vw] h-[22vw] relative group duration-500 transition-transform max-sm:w-[70vw] max-sm:h-[60vw] tablet:!w-[50vw] tablet:h-[40vw]"
 style={{
 zIndex: isExpanded ? 20 : 1,
 transform:
 !isMobile && isExpanded
 ? isRTL
 ? `translateX(${17 * currentIndex + 1.265 * currentIndex}vw)`
 : `translateX(-${17 * currentIndex + 1.265 * currentIndex}vw)`
 :"translateX(0)",
 }}
 onMouseEnter={() => !isMobile && handleMouseEnter(index)}
 onMouseLeave={() => !isMobile && handleMouseLeave(index)}
 >
 {/* Card image + click area */}
 <div
 className="w-full h-full overflow-hidden relative cursor-pointer"
 style={{ position:"relative", zIndex: 2 }}
 onClick={() => {
 setActive(true);
 setCurrentIndex(index);
 setCurrentMobileIndex(index);
 }}
 >
 <Image
 className={`w-full h-full object-cover transition-all duration-500 ${
 currentIndex === index ?"grayscale-0" :"grayscale"
 } max-sm:grayscale-0`}
 placeholder="blur"
 blurDataURL={item.image}
 src={item.image}
 alt="Image"
 fill
 />

 {/* Mobile/tablet click label overlay */}
 <div
 className={`hidden z-10 text-white absolute inset-0 bg-black/50 max-sm:flex max-sm:items-center max-sm:justify-center tablet:flex tablet:items-center tablet:justify-center text-[5vw] tablet:text-[2.5vw] ${
 currentIndex === index ?"bg-transparent" :""
 }`}
 >
 <p className={currentIndex === index ?"hidden" :"p-[2vw]"}>
 {clickLabel}
 </p>
 </div>

 {/* Desktop hover overlay (number + title) — hidden when this card is expanded */}
 {!isExpanded && (
 <div
 className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 py-[1vw] px-[1vw] flex flex-col justify-between max-sm:hidden tablet:hidden overflow-hidden"
 style={{ backgroundColor: overlayColor }}
 >
 <div className="flex justify-between items-start">
 <p className="text-black">{item.num}</p>
 <div className="rounded-full border group border-black p-3 h-[3vw] w-[3vw] flex items-center justify-center">
 <Plus className="text-black" />
 </div>
 </div>

 {/* GSAP-animated title: starts above, slides in on hover */}
 <div className="">
 <p
 ref={(el) => (titleRefs.current[index] = el)}
 className="text-[2.2vw] leading-[1.2] text-black ltr:font-display"
 style={{ transform:"translateY(-100%)", opacity: 0 }}
 >
 {item.title}
 </p>
 </div>
 </div>
 )}
 </div>

 {/* Desktop expanded panel */}
 <div
 className={`absolute top-0 left-[calc(17vw+1.3vw)] rtl:right-[calc(17vw+1.3vw)] w-[calc(17vw*4+3.9vw)] h-full duration-500 max-sm:hidden tablet:hidden ${
 isExpanded ?"opacity-100" :"opacity-0 pointer-events-none"
 }`}
 style={{ backgroundColor: expandedBgColor, zIndex: isExpanded ? 10 : -1 }}
 >
 <div
 className="w-full h-full flex flex-col justify-end gap-[1vw] p-[1.5vw] relative"
 style={{ color: expandedTextColor }}
 >
 <p>{item.num}</p>
 <p className="text-[2.2vw] leading-[1.2] ltr:font-display">{item.title}</p>
 <p className="w-[80%]">{item.para}</p>
 <div
 className="rounded-full group border p-3 absolute top-5 right-5 z-20 h-[3vw] w-[3vw] flex items-center justify-center cursor-pointer"
 style={{ borderColor: expandedTextColor, color: expandedTextColor }}
 onClick={handleClose}
 >
 <X className="group-hover:rotate-90 duration-200 ease-in-out" />
 </div>
 </div>
 </div>
 </div>
 );
 })}
 </div>

 {/* Desktop Prev/Next Buttons */}
 <div className={`flex gap-[1vw] absolute bottom-[5%] right-[5%] flex-row-reverse tablet:hidden max-sm:hidden ${active ?"" :"hidden"}`}>
 {/* Next */}
 <div
 className="w-[3.5vw] h-[3.5vw] relative overflow-hidden group rounded-full cursor-pointer border border-black transition-colors duration-500"
 onClick={() => {
 if (items.length !== currentIndex + 1) setCurrentIndex(currentIndex + 1);
 }}
 >
 <div className="w-full h-full flex justify-center items-center">
 <span className="w-[1.5vw] h-[1.5vw] flex justify-center items-center rtl:rotate-180">
 <ArrowRight className="text-black" />
 </span>
 </div>
 </div>

 {/* Prev */}
 <div
 className="w-[3.5vw] h-[3.5vw] relative overflow-hidden group rounded-full cursor-pointer border border-black transition-colors duration-500"
 onClick={() => {
 if (currentIndex !== 0) setCurrentIndex(currentIndex - 1);
 }}
 >
 <div className="w-full h-full flex justify-center items-center rotate-180">
 <span className="w-[1.5vw] h-[1.5vw] flex justify-center items-center rtl:rotate-180">
 <ArrowRight className="text-black" />
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* Mobile / Tablet expanded content panel */}
 <div
 className="hidden max-sm:block w-full h-[70vw] mt-[8vw] tablet:block tablet:h-[52vw]"
 style={{ backgroundColor: expandedBgColor }}
 >
 <div className="w-full h-full flex flex-col justify-start gap-[1vw] p-[1.5vw]">
 {items.map((item, index) => (
 <div
 key={index}
 className={`${index === currentMobileIndex ?"" :"hidden"} flex flex-col gap-[4vw] px-[2vw] py-[4vw]`}
 style={{ color: expandedTextColor }}
 >
 <p className="text-[4vw]">{item.num}</p>
 <p className="text-[6.2vw] leading-[1.2] tablet:text-[6vw]">{item.title}</p>
 <p className="text-[4.1vw] tablet:text-[3vw]">{item.para}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>
 );
};

export default ExpandableCards;