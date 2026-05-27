"use client";

import { useEffect, useState } from"react";
import RingGallery from"@/components/Carousels/RingCarousel/RingCarousel";
import"./RingGalleryDemo.css";

const imageItems = [
"/assets/sticky-section/sticky-1-img.png",
"/assets/sticky-section/sticky-2-img.png",
"/assets/sticky-section/sticky-3-img.png",
"/assets/sticky-section/sticky-4-img.png",
"/assets/sticky-section/sticky-1-img.png",
"/assets/sticky-section/sticky-2-img.png",
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
 <section className="ring-gallery-demo">
 <div className="ring-gallery-demo__header">
 <h1 className="ring-gallery-demo__title">Ring Gallery</h1>
 </div>

 <div className="ring-gallery-demo__carousel">
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
 autoPlayInterval={1500}
 pauseOnHover={true}
 />
 </div>
 </section>
 );
}