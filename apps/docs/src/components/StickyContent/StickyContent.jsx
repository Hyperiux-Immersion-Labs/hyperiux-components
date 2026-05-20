"use client";

import React, { useLayoutEffect, useRef } from"react";
import Image from"next/image";
import gsap from"gsap";
import ScrollTrigger from"gsap/dist/ScrollTrigger";
import"./StickyContentWrapper.css";

gsap.registerPlugin(ScrollTrigger);

const StickyContentWrapper = ({
 items = [],
 className ="",
 leftClassName ="",
 rightClassName ="",
 contentClassName ="",
 imageClassName ="",
 containerHeight,

 // content animation props
 contentEnterYPercent = 12,
 contentExitYPercent = -12,
 contentTransitionDuration = 0.8,
 contentDelay = 0.28,
 stepGap = 2,

 // image scale props
 enableImageScaleFlow = true,
 initialImageScale = 1.5,
 activeImageScale = 1.2,
 exitImageScale = 1,
}) => {
 const sectionRef = useRef(null);
 const stickyRef = useRef(null);
 const contentRefs = useRef([]);
 const imageRefs = useRef([]);

 contentRefs.current = [];
 imageRefs.current = [];

 const addContentRef = (el) => {
 if (el && !contentRefs.current.includes(el)) {
 contentRefs.current.push(el);
 }
 };

 const addImageRef = (el) => {
 if (el && !imageRefs.current.includes(el)) {
 imageRefs.current.push(el);
 }
 };

 useLayoutEffect(() => {
 if (!sectionRef.current || !stickyRef.current || !items.length) return;

 const ctx = gsap.context(() => {
 const contents = contentRefs.current;
 const images = imageRefs.current;

 contents.forEach((content, index) => {
 gsap.set(content, {
 autoAlpha: index === 0 ? 1 : 0,
 yPercent: index === 0 ? 0 : contentEnterYPercent,
 zIndex: items.length - index,
 });
 });

 images.forEach((image, index) => {
 gsap.set(image, {
 zIndex: items.length - index,
 clipPath:"inset(0% 0% 0% 0%)",
 scale: enableImageScaleFlow
 ? index === 0
 ? activeImageScale
 : initialImageScale
 : 1,
 transformOrigin:"center center",
 });
 });

 const totalTimelineDuration = Math.max(1, (items.length - 1) * stepGap);

 const tl = gsap.timeline({
 scrollTrigger: {
 trigger: sectionRef.current,
 start:"top top",
 end:"bottom bottom",
 scrub: 1,
 },
 });

 items.forEach((_, index) => {
 if (index === items.length - 1) return;

 const currentContent = contents[index];
 const nextContent = contents[index + 1];
 const currentImage = images[index];
 const nextImage = images[index + 1];

 const stepStart = index * stepGap;
 const nextContentStart =
 stepStart + contentTransitionDuration + contentDelay;

 tl.to(
 currentContent,
 {
 autoAlpha: 0,
 yPercent: contentExitYPercent,
 duration: contentTransitionDuration,
 ease:"power2.inOut",
 },
 stepStart
 )
 .fromTo(
 nextContent,
 {
 autoAlpha: 0,
 yPercent: contentEnterYPercent,
 },
 {
 autoAlpha: 1,
 yPercent: 0,
 duration: contentTransitionDuration,
 ease:"power2.inOut",
 },
 nextContentStart
 )
 .to(
 currentImage,
 {
 clipPath:"inset(0% 0% 100% 0%)",
 scale: enableImageScaleFlow ? exitImageScale : 1,
 duration: stepGap,
 ease:"none",
 },
 stepStart
 );

 if (enableImageScaleFlow) {
 tl.to(
 nextImage,
 {
 scale: activeImageScale,
 duration: stepGap,
 ease:"none",
 },
 stepStart
 );
 }
 });

 tl.duration(totalTimelineDuration);

 ScrollTrigger.refresh();
 }, sectionRef);

 return () => ctx.revert();
 }, [
 items,
 contentEnterYPercent,
 contentExitYPercent,
 contentTransitionDuration,
 contentDelay,
 stepGap,
 enableImageScaleFlow,
 initialImageScale,
 activeImageScale,
 exitImageScale,
 ]);

 if (!items.length) return null;

 return (
 <section
 ref={sectionRef}
 className={`sticky-content ${className}`}
 style={{
 height: containerHeight || `${items.length * 100}vh`,
 }}
 >
 <div ref={stickyRef} className="sticky-content__sticky">
 <div className={`sticky-content__left ${leftClassName}`}>
 {items.map((item, index) => (
 <div
 key={`content-${index}`}
 ref={addContentRef}
 className={`sticky-content__panel ${contentClassName}`}
 >
 {item.renderContent ? (
 item.renderContent(item, index)
 ) : (
 <div className="sticky-content__default-content">
 {item.heading && (
 <h3 className="sticky-content__heading">{item.heading}</h3>
 )}
 {item.paragraph && (
 <p className="sticky-content__paragraph">{item.paragraph}</p>
 )}
 </div>
 )}
 </div>
 ))}
 </div>

 <div className={`sticky-content__right ${rightClassName}`}>
 {items.map((item, index) => (
 <div
 key={`image-${index}`}
 ref={addImageRef}
 className={`sticky-content__image-layer ${imageClassName}`}
 >
 {item.renderImage ? (
 item.renderImage(item, index)
 ) : (
 <Image
 src={item.image}
 alt={item.alt || `sticky-image-${index + 1}`}
 className="sticky-content__image"
 width={item.width || 1080}
 height={item.height || 1080}
 />
 )}
 </div>
 ))}
 </div>
 </div>
 </section>
 );
};

export default StickyContentWrapper;