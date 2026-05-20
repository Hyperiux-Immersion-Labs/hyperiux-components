"use client";

import { useState, useEffect, useRef } from"react";
import Link from"next/link";
import gsap from"gsap";


const CLIPS = {
 bottom: {
 closedInitial:"polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
 open:"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
 closedFinal:"polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
 },
 top: {
 closedInitial:"polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
 open:"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
 closedFinal:"polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
 },
 left: {
 closedInitial:"polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
 open:"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
 closedFinal:"polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
 },
 right: {
 closedInitial:"polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
 open:"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
 closedFinal:"polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
 },
};


export default function FullscreenNav({
 links,
 brand ="Hyperiux",
 brandHref ="/",
 clipOrigin ="bottom",
 overlayBg ="#000000",
 linkColor ="#ffffff",
 linkHoverColor ="#a3a3a3",
 linkSizeClass ="text-5xl",
 headerClassName ="",
 openDuration = 1.2,
 closeDuration = 1.2,
 headerOpenColor ="#ffffff",
 onOpen,
 onClose,
 children,
}) {
 const [isOpen, setIsOpen] = useState(false);

 const overlayRef = useRef(null);
 const linksWrapperRef = useRef(null);
 const tlRef = useRef(null);
 const isAnimatingRef = useRef(false);

 const {
 closedInitial,
 open: clipOpen,
 closedFinal,
 } = CLIPS[clipOrigin] ?? CLIPS.bottom;

 useEffect(() => {
 document.body.style.overflow = isOpen ?"hidden" :"";
 return () => {
 document.body.style.overflow ="";
 };
 }, [isOpen]);

 const openMenu = () => {
 setIsOpen(true);
 tlRef.current?.kill();

 gsap.set(overlayRef.current, { clipPath: closedInitial });
 gsap.set(linksWrapperRef.current, { opacity: 1, scale: 1 });

 const tl = gsap.timeline({
 onStart: () => {
 isAnimatingRef.current = true;
 },
 onComplete: () => {
 isAnimatingRef.current = false;
 onOpen?.();
 },
 });

 tlRef.current = tl;

 tl.to(overlayRef.current, {
 clipPath: clipOpen,
 duration: openDuration,
 delay: 0.2,
 ease:"power4.inOut",
 });
 };

 const closeMenu = () => {
 setIsOpen(false);
 tlRef.current?.kill();

 const tl = gsap.timeline({
 onStart: () => {
 isAnimatingRef.current = true;
 },
 onComplete: () => {
 isAnimatingRef.current = false;
 setIsOpen(false);
 onClose?.();
 },
 });

 tlRef.current = tl;

 tl.to(linksWrapperRef.current, {
 scale: 0.9,
 opacity: 0.5,
 duration: 0.7,
 ease:"power2.in",
 }).to(
 overlayRef.current,
 {
 clipPath: closedFinal,
 duration: closeDuration,
 ease:"power4.inOut",
 },
"<",
 );
 };

 const toggleMenu = () => {
 if (isAnimatingRef.current) return;
 if (isOpen) closeMenu();
 else openMenu();
 };

 return (
 <>
 <header
 className={`fixed top-0 left-0 right-0 z-[70] flex items-center justify-between px-8 h-16 ${headerClassName}`}
 >
 <Link
 href={brandHref}
 style={{ color: isOpen ? headerOpenColor : undefined }}
 className={`text-lg font-normal ease-in-out tracking-tight transition-colors duration-500 ${
 isOpen ?"delay-500" :"text-black delay-500"
 }`}
 >
 {brand}
 </Link>

 <button
 onClick={toggleMenu}
 onTouchStart={toggleMenu}
 aria-label="Toggle menu"
 aria-expanded={isOpen}
 className="flex flex-col cursor-pointer justify-center items-center w-10 h-10 gap-1.5"
 >
 <span
 style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
 className={`block h-px w-6 delay-300 transition-all ease-in-out duration-700 ${
 isOpen ?"translate-y-[5px] rotate-45" :"bg-black"
 }`}
 />
 <span
 style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
 className={`block h-px w-6 delay-300 transition-all duration-500 ${
 isOpen ?"opacity-0 scale-x-0" :"bg-black"
 }`}
 />
 <span
 style={{ backgroundColor: isOpen ? headerOpenColor : undefined }}
 className={`block h-px w-6 delay-300 transition-all ease-in-out duration-700 ${
 isOpen ?"-translate-y-[9px] -rotate-45" :"bg-black"
 }`}
 />
 </button>
 </header>

 <nav
 ref={overlayRef}
 style={{ clipPath: closedInitial, backgroundColor: overlayBg }}
 className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-2 ${
 isOpen ?"pointer-events-auto" :"pointer-events-none"
 }`}
 aria-hidden={!isOpen}
 role="navigation"
 >
 <div
 ref={linksWrapperRef}
 className="w-screen h-screen flex flex-col items-center justify-center"
 >
 {children
 ? children(isOpen)
 : links.map(({ label, href }) => (
 <Link
 key={label}
 href={href}
 onClick={isOpen ? closeMenu : undefined}
 tabIndex={isOpen ? 0 : -1}
 style={{ color: linkColor }}
 onMouseEnter={(e) => {
 e.currentTarget.style.color = linkHoverColor;
 }}
 onMouseLeave={(e) => {
 e.currentTarget.style.color = linkColor;
 }}
 className={`${linkSizeClass} font-normal tracking-tight transition-colors`}
 >
 {label}
 </Link>
 ))}
 </div>
 </nav>
 </>
 );
}