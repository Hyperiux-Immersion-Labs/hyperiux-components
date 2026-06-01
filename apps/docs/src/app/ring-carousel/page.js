"use client";

import { useEffect, useState } from"react";
import RingGallery from"@/components/Carousels/RingCarousel/RingCarousel";

const imageItems = [
 {
 src: "/assets/sticky-section/sticky-1-img.png",
 alt: "Sticky section preview 1",
 },
 {
 src: "/assets/sticky-section/sticky-2-img.png",
 alt: "Sticky section preview 2",
 },
 {
 src: "/assets/sticky-section/sticky-3-img.png",
 alt: "Sticky section preview 3",
 },
 {
 src: "/assets/sticky-section/sticky-4-img.png",
 alt: "Sticky section preview 4",
 },
 {
 src: "/assets/sticky-section/sticky-1-img.png",
 alt: "Sticky section preview 5",
 },
 {
 src: "/assets/sticky-section/sticky-2-img.png",
 alt: "Sticky section preview 6",
 },
];

export default function Page() {
 const [galleryConfig, setGalleryConfig] = useState({
 itemWidth: 720,
 itemHeight: 450,
 radius: 700,
 dragSensitivity: 0.45,
 momentum: 1.2,
 friction: 0.94,
 });

 useEffect(() => {
 const updateGalleryConfig = () => {
 const width = window.innerWidth;

 if (width <= 540) {
 setGalleryConfig({
 itemWidth: 540,
 itemHeight: 320,
 radius: 500,
 dragSensitivity: 0.5,
 momentum: 1.05,
 friction: 0.92,
 });
 return;
 }

  if (width <= 1024) {
 setGalleryConfig({
 itemWidth: 650,
 itemHeight: 450,
 radius: 600,
 dragSensitivity: 0.46,
 momentum: 1.12,
 friction: 0.935,
 });
 return;
 }

 
 setGalleryConfig({
 itemWidth: 720,
 itemHeight: 450,
 radius: 700,
 dragSensitivity: 0.45,
 momentum: 1.2,
 friction: 0.94,
 });
 };

 updateGalleryConfig();
 window.addEventListener("resize", updateGalleryConfig);

 return () => window.removeEventListener("resize", updateGalleryConfig);
 }, []);

 return (
 <section className="flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-black px-4 max-md:px-0 pt-20 pb-8 max-md:pt-10 max-md:pb-8 max-sm:px-0 max-sm:pt-6 max-sm:pb-4">
 <div className="relative z-30 mb-6 flex w-full items-center justify-center max-md:mb-4 max-sm:mb-2">
 <h1 className="m-0 text-center text-[clamp(2.5rem,4.5vw,6rem)] leading-[0.95] font-medium tracking-[-0.04em] text-white max-sm:text-[clamp(2rem,11vw,3rem)]">
 Ring Gallery
 </h1>
 </div>

 <div className="relative w-full">
 <RingGallery
 items={imageItems}
 itemWidth={galleryConfig.itemWidth}
 itemHeight={galleryConfig.itemHeight}
 radius={galleryConfig.radius}
 gap={0}
 dragSensitivity={galleryConfig.dragSensitivity}
 momentum={galleryConfig.momentum}
 friction={galleryConfig.friction}
 snap={true}
 autoPlay={true}
 autoPlayInterval={800}
 pauseOnHover={true}
 />
 </div>
 </section>
 );
}
