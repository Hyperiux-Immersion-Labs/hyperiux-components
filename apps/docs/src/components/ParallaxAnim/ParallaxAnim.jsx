"use client";

import gsap from"gsap";
import Image from"next/image";
import React, { useEffect, useRef } from"react";
import ScrollTrigger from"gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ParallaxAnim = ({
 src,
 alt ="parallax-img",
 wrapperClassName ="",
 imageClassName ="",
 width = 700,
 height = 1000,
 translateY ="30%",
 start ="top bottom",
 end ="bottom top",
 scrub = true,
 enableScale = false,
 scaleFrom = 1.6,
 scaleTo = 1.2,
}) => {
 const wrapperRef = useRef(null);
 const imageRef = useRef(null);

 useEffect(() => {
 if (!wrapperRef.current || !imageRef.current) return;

 const ctx = gsap.context(() => {
 gsap.set(imageRef.current, {
 scale: enableScale ? scaleFrom : undefined,
 });

 gsap.to(imageRef.current, {
 translateY,
 scale: enableScale ? scaleTo : undefined,
 ease:"none",
 scrollTrigger: {
 trigger: wrapperRef.current,
 start,
 end,
 scrub,
 // markers: true,
 },
 });
 }, wrapperRef);

 return () => ctx.revert();
 }, [translateY, start, end, scrub, enableScale, scaleFrom, scaleTo]);

 return (
 <div ref={wrapperRef} className={`overflow-hidden ${wrapperClassName}`}>
 <Image
 ref={imageRef}
 width={width}
 height={height}
 src={src}
 alt={alt}
 className={`w-full h-full object-cover ${imageClassName}`}
 />
 </div>
 );
};

export default ParallaxAnim;