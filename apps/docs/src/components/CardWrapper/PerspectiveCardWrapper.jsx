"use client";

import { useRef, useEffect } from"react";
import gsap from"gsap";

export default function CardWrapper({ children }) {
 const cardRef = useRef(null);

 useEffect(() => {
 const card = cardRef.current;
 if (!card) return;

 const handleMouseMove = (e) => {
 const rect = card.getBoundingClientRect();    

 const x = e.clientX - rect.left; 
 const y = e.clientY - rect.top;

 const centerX = rect.width / 2;
 const centerY = rect.height / 2;

 const rotateX = -(y - centerY) / 12; // tilt up/down
 const rotateY = (x - centerX) / 12; // tilt left/right

 const moveX = (x - centerX) / 20; // subtle movement
 const moveY = (y - centerY) / 20;

 gsap.to(card, {
 rotateX,
 rotateY,
 x: moveX,
 y: moveY,
 transformPerspective: 800,
 transformOrigin:"center",
 ease:"power2.out",
 duration: 0.4,
 });
 };

 const handleMouseLeave = () => {
 gsap.to(card, {
 rotateX: 0,
 rotateY: 0,
 x: 0,
 y: 0,
 ease:"power3.out",
 duration: 0.6,
 });
 };

 card.addEventListener("mousemove", handleMouseMove);
 card.addEventListener("mouseleave", handleMouseLeave);

 return () => {
 card.removeEventListener("mousemove", handleMouseMove);
 card.removeEventListener("mouseleave", handleMouseLeave);
 };
 }, []);

 return (
 <div className="w-full h-full">
 <div className="w-full h-full perspective-[1000px]">
 <div ref={cardRef} className="w-full h-full will-change-transform">
 {children}
 </div>
 </div>
 </div>
 );
}
