"use client";

import gsap from"gsap";
import ScrollTrigger from"gsap/dist/ScrollTrigger";
import { SplitText } from"gsap/SplitText";
import Image from"next/image";
import { useEffect } from"react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const HorizontalScroll = () => {
 const propertiesData = [
 {
 number:"01",
 imgClass:"img-1",
 no:"1",
 titleClass:"property-title-1",
 contentClass:"property-content-1",
 title:"Burj Khalifa",
 image:"/assets/horizontal-section/horizontal-img-1.png",
 paragraphs: [
"Burj Khalifa represents the highest standard of luxury living in Dubai, combining iconic architecture, unmatched skyline views, and an address that carries global prestige.",
"From ultra-premium residences to a location at the heart of Downtown Dubai, the property offers immediate access to luxury retail, fine dining, and a lifestyle defined by exclusivity, convenience, and long-term value.",
 ],
 triggers: {
 img: { start:"-10% top", end:"10% top" },
 no: { start:"-1% top", end:"5% top" },
 title: { start:"-1% top", end:"5% top" },
 content: { start:"-1% top", end:"5% top" },
 },
 },
 {
 number:"02",
 imgClass:"img-2",
 no:"2",
 titleClass:"property-title-2",
 contentClass:"property-content-2",
 title:"Palm Jumeirah",
 image:"/assets/horizontal-section/horizontal-img-2.png",
 paragraphs: [
"Palm Jumeirah is one of Dubai’s most sought-after waterfront destinations, known for its private beachfront residences, resort-style environment, and exceptional coastal views.",
"Whether for end-use or investment, the location offers a rare combination of luxury, privacy, and international appeal, making it one of the strongest lifestyle-led property assets in the region.",
 ],
 triggers: {
 img: { start:"-5% top", end:"35% top" },
 no: { start:"18% top", end:"23% top" },
 title: { start:"18% top", end:"23% top" },
 content: { start:"18% top", end:"23% top" },
 },
 },
 {
 number:"03",
 imgClass:"img-3",
 no:"3",
 titleClass:"property-title-3",
 contentClass:"property-content-3",
 title:"Dubai Marina",
 image:"/assets/horizontal-section/horizontal-img-3.png",
 paragraphs: [
"Dubai Marina offers a dynamic urban waterfront experience, blending high-rise luxury apartments with vibrant retail, dining, and leisure experiences in one connected district.",
"Its strong rental demand, premium lifestyle positioning, and consistent desirability make Dubai Marina a compelling option for both investors and residents seeking modern city living.",
 ],
 triggers: {
 img: { start:"25% top", end:"65% top" },
 no: { start:"45% top", end:"50% top" },
 title: { start:"45% top", end:"50% top" },
 content: { start:"45% top", end:"50% top" },
 },
 },
 {
 number:"04",
 imgClass:"img-4",
 no:"4",
 titleClass:"property-title-4",
 contentClass:"property-content-4",
 title:"Dubai Creek Harbour",
 image:"/assets/horizontal-section/horizontal-img-4.png",
 paragraphs: [
"Dubai Creek Harbour is emerging as one of the city’s most future-ready residential destinations, offering refined waterfront living with a strong focus on design, accessibility, and long-term growth.",
"With its master-planned ecosystem, premium residences, and strong development vision, the district is positioned as a next-generation address for buyers seeking both lifestyle and appreciation potential.",
 ],
 triggers: {
 img: { start:"45% top", end:"85% top" },
 no: { start:"65% top", end:"70% top" },
 title: { start:"65% top", end:"70% top" },
 content: { start:"65% top", end:"70% top" },
 },
 },
 ];

 useEffect(() => {
 const ctx = gsap.context(() => {
 gsap.from(".head-btn", {
 scrollTrigger: {
 trigger:"#industries",
 start:"top top",
 end:"bottom bottom",
 onEnter: () => {
 gsap.to(".head-btn", {
 color:"#fff9ec",
 backgroundColor:"#231204",
 });
 gsap.to(".head-text", {
 color:"#231204",
 });
 },
 onEnterBack: () => {
 gsap.to(".head-btn", {
 color:"#fff9ec",
 backgroundColor:"#231204",
 });
 gsap.to(".head-text", {
 color:"#231204",
 });
 },
 onLeaveBack: () => {
 gsap.to(".head-btn", {
 color:"#231204",
 backgroundColor:"#fff9ec",
 });
 gsap.to(".head-text", {
 color:"#fff9ec",
 });
 },
 },
 });

 if (window.innerWidth <= 1024) return;

 const head = document.querySelector(".industry-head");
 if (head) {
 const headSplit = new SplitText(head, { type:"chars" });

 gsap.from(headSplit.chars, {
 yPercent: () =>
 (Math.random() < 0.5 ? 1 : -1) * (200 * Math.random()),
 xPercent: () => 200 * Math.random(),
 stagger: 0.1,
 duration: 1,
 ease:"back.out",
 scrollTrigger: {
 trigger:"#industries",
 start:"top top",
 end:"20% top",
 scrub: true,
 },
 });
 }

 gsap.to(".industry-container", {
 xPercent: -79,
 ease:"none",
 scrollTrigger: {
 trigger:"#industries",
 start:"top top",
 end:"bottom bottom",
 scrub: true,
 // markers: true,
 },
 });

 const cards = document.querySelectorAll(".industry-card");

 cards.forEach((card, i) => {
 const cfg = propertiesData[i]?.triggers || {};
 const startNo = cfg.no?.start ||"top 70%";
 const endNo = cfg.no?.end ||"top 40%";
 const startTitle = cfg.title?.start ||"top 70%";
 const endTitle = cfg.title?.end ||"top 40%";
 const startContent = cfg.content?.start ||"top 70%";
 const endContent = cfg.content?.end ||"top 40%";
 const startImg = cfg.img?.start ||"top 70%";
 const endImg = cfg.img?.end ||"top 40%";

 const noEl = card.querySelector(`[class*="industry-no-"]`);
 if (noEl) {
 const splitNo = new SplitText(noEl, {
 type:"chars,lines",
 mask:"lines",
 });

 gsap.from(splitNo.chars, {
 y: 150,
 rotate: 10,
 stagger: 0.1,
 duration: 0.7,
 ease:"power2.out",
 scrollTrigger: {
 trigger:"#industries",
 start: startNo,
 end: endNo,
 toggleActions:"play none none reverse",
 },
 });
 }

 // FIXED: query property-title instead of industry-title
 const titleEl = card.querySelector(`[class*="property-title-"]`);
 if (titleEl) {
 const titleLines = new SplitText(titleEl, {
 type:"lines",
 mask:"lines",
 });

 gsap.from(titleLines.lines, {
 yPercent: 100,
 stagger: 0.08,
 duration: 0.7,
 ease:"power2.out",
 scrollTrigger: {
 trigger:"#industries",
 start: startTitle,
 end: endTitle,
 // markers: true,
 toggleActions:"play none none reverse",
 },
 });
 }

 // FIXED: query property-content instead of industry-content
 const contentEls = card.querySelectorAll(`[class*="property-content-"]`);
 contentEls.forEach((contentEl) => {
 const contentLines = new SplitText(contentEl, {
 type:"lines",
 mask:"lines",
 });

 gsap.from(contentLines.lines, {
 yPercent: 100,
 stagger: 0.08,
 delay: 0.3,
 duration: 0.7,
 ease:"power2.out",
 scrollTrigger: {
 trigger:"#industries",
 start: startContent,
 end: endContent,
 toggleActions:"play none none reverse",
 },
 });
 });

 // this one was already okay, but keep it consistent
 const propertyImgs = card.querySelectorAll(`[class*="industry-img-"]`);
 propertyImgs.forEach((propertyImg) => {
 gsap.to(propertyImg, {
 translateX:"30%",
 ease:"none",
 scrollTrigger: {
 trigger:"#industries",
 start: startImg,
 end: endImg,
 scrub: true,
 // markers:true
 },
 });
 });
 });

 ScrollTrigger.refresh();
 });

 return () => ctx.revert();
 }, []);

 return (
 <section
 className="w-screen h-[600vh] bg-white text-black relative z-[10] max-md:mt-0 max-md:h-fit max-md:py-[15%] max-md:px-[7vw]"
 id="industries"
 >
 <div className="w-screen overflow-hidden h-screen justify-center items-center sticky top-0 max-md:static max-md:w-full max-md:h-fit max-md:flex max-md:flex-col max-md:items-start">
 <div className="flex flex-nowrap w-fit industry-container gap-[15vw] max-md:flex-col max-md:gap-[10vw] max-sm:gap-[15vw]">
 {propertiesData.map((property, index) => (
 <div
 key={index}
 className="w-[80vw] h-screen flex gap-[5vw] industry-card max-md:h-fit max-md:flex-col-reverse max-md:w-full"
 >
 <div className="w-[40vw] h-screen overflow-hidden max-sm:h-[110vw] max-md:w-full max-sm:rounded-[4vw] max-md:h-[80vw] max-md:rounded-[2vw]">
 <Image
 src={property.image}
 alt={`property-img-${index + 1}`}
 className={`w-full h-full scale-[1.4] translate-x-[-30%] industry-${property.imgClass} max-md:translate-x-0 max-md:scale-[1] max-md:object-cover`}
 width={500}
 height={1080}
 />
 </div>

 <div className="flex flex-col gap-[5vh] w-[60%] pt-[7%] max-sm:pt-0 max-md:w-full max-md:gap-[4vw] max-sm:gap-[7vw]">
 <p
 className={`text-[6em] font-medium font-display text-secondary leading-[1] max-md:text-[10vw] industry-no-${property.no}`}
 >
 {property.number}
 </p>

 <div className="w-full h-fit flex flex-col gap-[4vh] max-sm:gap-[7vw]">
 <h3
 className={`text-[4em] max-sm:text-[1.8em] max-md:text-[7.5vw] max-sm:text-[9vw] ${property.titleClass}`}
 >
 {property.title}
 </h3>

 <div className="space-y-[1.5vw] max-md:text-[2.5vw] max-sm:text-[4.2vw]">
 {property.paragraphs.map((para, pIndex) => (
 <p key={pIndex} className={property.contentClass}>
 {para}
 </p>
 ))}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>
 );
};

export default HorizontalScroll;