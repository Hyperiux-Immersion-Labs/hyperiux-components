"use client";

import Image from"next/image";
import Link from"next/link";
import { useEffect, useRef } from"react";
import gsap from"gsap";
import CharStaggerLinkBtn from"../Buttons/LinkButtons/CharStaggerLinkBtn/CharStaggerLinkBtn";

export default function CustomNavbar({
 links = [],
 images = ["/assets/img/image01.webp","/assets/img/image02.webp"],
 agencyName ="Hyperiux®",
 socials = [
 { type:"ig", href:"#" },
 { type:"fb", href:"#" },
 { type:"x", href:"#" },
 ],
 location ="Pune, India",
 tagline ="Design. Code. Impact.",
 isOpen = false,
 overlayBg ="#000000",
 delay = 1,
}) {
 const linksRef = useRef([]);
 const imagesRef = useRef([]);
 const socialsRef = useRef([]);
 const agencyRef = useRef(null);
 const taglineRef = useRef(null);
 const locationRef = useRef(null);

 // Kill any running tweens on these targets
 const killAll = () => {
 gsap.killTweensOf([
 ...linksRef.current,
 ...imagesRef.current,
 ...socialsRef.current,
 agencyRef.current,
 taglineRef.current,
 locationRef.current,
 ]);
 };

 const resetAll = () => {
 gsap.set(linksRef.current, { y: 30, opacity: 0 });
 gsap.set(imagesRef.current, { scale: 0.7, opacity: 0 });
 gsap.set(socialsRef.current, { y: 14, opacity: 0 });
 gsap.set(agencyRef.current, { y: -12, opacity: 0 });
 gsap.set(taglineRef.current, { y: -12, opacity: 0 });
 gsap.set(locationRef.current, { y: 10, opacity: 0 });
 };

 useEffect(() => {
 killAll();

 if (isOpen) {
 // Hard reset first so fromTo always starts clean
 resetAll();

 const d = Math.max(delay - 0.2, 0); // prevents negative delay

 // Agency name — fade down from above
 gsap.fromTo(
 agencyRef.current,
 { y: -12, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.6, ease:"power2.out", delay: d }
 );

 // Tagline — fade down, slightly after agency
 gsap.fromTo(
 taglineRef.current,
 { y: -12, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.6, ease:"power2.out", delay: d + 0.08 }
 );

 // Nav links — stagger up
 gsap.fromTo(
 linksRef.current,
 { y: 30, opacity: 0 },
 {
 y: 0,
 opacity: 1,
 duration: 0.8,
 ease:"power2.out",
 stagger: 0.07,
 delay: d,
 }
 );

 // Images — zoom out from scale 0.7
 gsap.fromTo(
 imagesRef.current,
 { scale: 0.8, opacity: 0 },
 {
 scale: 1,
 opacity: 1,
 duration: 0.9,
 ease:"power3.out",
 stagger: 0.02,
 delay: d + 0.1,
 }
 );

 // Social icons — stagger up
 gsap.fromTo(
 socialsRef.current,
 { y: 14, opacity: 0 },
 {
 y: 0,
 opacity: 1,
 duration: 0.5,
 ease:"power2.out",
 stagger: 0.06,
 delay: d + 0.2,
 }
 );

 // Location — fade up
 gsap.fromTo(
 locationRef.current,
 { y: 10, opacity: 0 },
 { y: 0, opacity: 1, duration: 0.5, ease:"power2.out", delay: d + 0.25 }
 );
 }
 }, [isOpen]);

 const renderIcon = (type) => {
 const common =
"w-6 h-6 opacity-70 hover:opacity-100 transition";

 switch (type) {
 case"ig":
 return (
 <svg viewBox="0 0 24 24" fill="currentColor" className={common}>
 <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-.8a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM12 9a3 3 0 100 6 3 3 0 000-6z" />
 </svg>
 );
 case"fb":
 return (
 <svg viewBox="0 0 24 24" fill="currentColor" className={common}>
 <path d="M13 22v-8h3l1-4h-4V7c0-1.2.3-2 2-2h2V1h-3c-3 0-5 2-5 5v3H6v4h3v8h4z" />
 </svg>
 );
 case"x":
 return (
 <svg viewBox="0 0 24 24" fill="currentColor" className={common}>
 <path d="M17.5 3h3.3l-7.2 8.3L22 21h-6.8l-5.3-6.5L4.5 21H1.2l7.7-8.9L2 3h6.9l4.8 6 3.8-6z" />
 </svg>
 );
 case"li":
 return (
 <svg viewBox="0 0 24 24" fill="currentColor" className={common}>
 <path d="M6.94 6.5A2.44 2.44 0 114.5 4.06 2.44 2.44 0 016.94 6.5zM4.75 8.75h4.38V21H4.75zM13.25 8.75h4.2v1.67h.06a4.6 4.6 0 014.14-2.27c4.43 0 5.25 2.91 5.25 6.7V21h-4.38v-5.8c0-1.38 0-3.15-1.92-3.15s-2.21 1.5-2.21 3.05V21h-4.38z" />
 </svg>
 );
 case"dr":
 return (
 <svg viewBox="0 0 24 24" fill="currentColor" className={common}>
 <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 4.6a8.2 8.2 0 012 5.1c-1.7-.3-3.4-.3-5 .1a13.7 13.7 0 00-1.1-2.3 16.6 16.6 0 004.1-2.9zM12 3.8c1.8 0 3.4.6 4.8 1.6a14.7 14.7 0 01-3.7 2.6 14.2 14.2 0 00-3.2-3.6A8.1 8.1 0 0112 3.8zM7.5 5.3a12.4 12.4 0 013.3 3.7 15.5 15.5 0 01-5.7.8 8.2 8.2 0 012.4-4.5zM4 12c0-.2 0-.4.1-.6a17.5 17.5 0 006.6-1 12.8 12.8 0 011 2.2 17.2 17.2 0 00-6.9 1.2A8.1 8.1 0 014 12zm1.7 4.3a15.3 15.3 0 016.5-1.2c.3.9.5 1.9.6 2.9A8.2 8.2 0 015.7 16.3zm8.5 2.5a14.6 14.6 0 00-.5-2.6 13.6 13.6 0 014.7-.1 8.2 8.2 0 01-4.2 2.7zm5.3-4.3a15.8 15.8 0 00-5.4 0 14.8 14.8 0 00-1.1-2.3 15.4 15.4 0 015.9-.1c.3.7.5 1.5.6 2.4z" />
 </svg>
 );
 default:
 return null;
 }
 };

 return (
 <div
 style={{ backgroundColor: overlayBg }}
 className="w-full h-screen flex flex-col justify-between px-28 py-10 max-sm:px-6 max-sm:py-6 text-white"
 >
 {/* TOP BAR */}
 <div className="flex justify-between items-center">
 <h2
 ref={agencyRef}
 style={{ opacity: 0, transform:"translateY(-12px)" }}
 className="text-xl tracking-wide font-medium"
 >
 {agencyName}
 </h2>

 <p
 ref={taglineRef}
 style={{ opacity: 0, transform:"translateY(-12px)" }}
 className="text-sm opacity-60 max-sm:hidden"
 >
 {tagline}
 </p>
 </div>

 {/* MAIN */}
 <div className="flex items-center justify-between gap-10 max-sm:flex-col max-sm:items-start max-sm:gap-30">
 {/* LEFT - LINKS */}
 <div className="flex flex-col gap-0">
 {links.map((link, i) => (
 <div
 key={link.label}
 ref={(el) => { linksRef.current[i] = el; }}
 style={{ opacity: 0, transform:"translateY(30px)" }}
 >
 <CharStaggerLinkBtn
 href={link.href}
 text={link.label}
 hoverColor="#ff6b00"
 className="text-[6vw] max-sm:text-[11vw] z-60"
 />
 </div>
 ))}
 </div>

 {/* RIGHT - IMAGES */}
 <div className="flex flex-col justify-center gap-40 items-end py-5 h-full max-sm:w-full max-sm:py-0 max-sm:items-start m max-sm:gap-16">
 {/* IMAGES */}
 <div className="flex max-sm: gap-8 items-end max-sm:gap-3 max-sm:w-full">
 {images.map((src, i) => (
 <div
 key={i}
 ref={(el) => { imagesRef.current[i] = el; }}
 style={{ opacity: 0, transform:"scale(0.7)" }}
 className="relative w-[25vw] h-[18vw] overflow-hidden rounded-xl max-sm:w-[60vw] max-sm:h-[30vw]"
 >
 <Image
 src={src}
 alt={`img-${i}`}
 fill
 className="object-cover hover:scale-105 transition duration-500"
 />
 </div>
 ))}
 </div>

 {/* SOCIALS */}
 <div className="flex gap-16 max-sm:gap-8">
 {socials.map((s, i) => (
 <Link
 key={i}
 href={s.href}
 ref={(el) => { socialsRef.current[i] = el; }}
 style={{ opacity: 0, transform:"translateY(14px)" }}
 >
 {renderIcon(s.type)}
 </Link>
 ))}
 </div>
 </div>
 </div>

 {/* BOTTOM BAR */}
 <div className="flex justify-end items-end max-sm:justify-between max-sm:items-end">
 <p
 className="text-sm opacity-60 hidden max-sm:block"
 >
 {tagline}
 </p>
 <p
 ref={locationRef}
 style={{ opacity: 0, transform:"translateY(10px)" }}
 className="text-sm opacity-60"
 >
 {location}
 </p>
 </div>
 </div>
 );
}