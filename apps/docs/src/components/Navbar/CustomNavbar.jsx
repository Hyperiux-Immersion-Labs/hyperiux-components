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
	 { type: "instagram", href: "#" },
	 { type: "facebook", href: "#" },
	 { type: "twitter", href: "#" },
	 { type: "linkedin", href: "#" },
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
 {images.slice(0, 4).map((src, i) => (
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
 <Image
	 src={s.src ? s.src : `/assets/social-icons/${s.type}.svg`}
	 alt={s.type}
	 width={24}
	 height={24}
	 className="opacity-70 hover:opacity-100 h-7 w-7 transition"
 />
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