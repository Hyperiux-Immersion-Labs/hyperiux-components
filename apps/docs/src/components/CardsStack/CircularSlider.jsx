'use client'
import React, { useEffect, useRef } from"react";
import { gsap } from"gsap";
import { ScrollTrigger } from"gsap/dist/ScrollTrigger";
import SliderCard from"./SliderCard";

gsap.registerPlugin(ScrollTrigger);

const CircularSlider = ({ heading, para, data = [] }) => {
 const outerRef = useRef(null);
 const stickyRef = useRef(null);
 const wheelRef = useRef(null);

 useEffect(() => {
 const ctx = gsap.context(() => {
 const wheel = wheelRef.current;
 const cards = gsap.utils.toArray(".wheel-card");

 const setup = () => {
 const radius = wheel.offsetWidth / 1.1;
 const center = wheel.offsetWidth / 2;
 const total = cards.length;
 const slice = (0.58 * Math.PI) / total;

 cards.forEach((item, i) => {
 const angle = i * slice;
 const x = center + radius * Math.sin(angle);
 const y = center - radius * Math.cos(angle);

 gsap.set(item, {
 rotation: `${angle}_rad`,
 xPercent: -50,
 yPercent: -50,
 x,
 y,
 });
 });
 };

 setup();
 window.addEventListener("resize", setup);

 gsap.to(wheel, {
 rotate: -87,
 ease:"none",
 scrollTrigger: {
 trigger: outerRef.current,
 start:"top top",
 end:"+=1500 top",
 scrub: 0.25,
 invalidateOnRefresh: true,
 },
 });

 return () => {
 window.removeEventListener("resize", setup);
 };
 }, outerRef);

 return () => ctx.revert();
 }, []);

 return (
 <>
 {/* Desktop */}
 <section
 ref={outerRef}
 className="hidden lg:block relative"
 style={{ height:"250vh" }}
 >
 <div
 ref={stickyRef}
 className="sticky top-0 h-screen flex flex-col items-center justify-between pb-[3%] overflow-hidden"
 >
 <div className="w-full flex justify-center pt-[3%]">
 <h2 className="text-[2.5vw] uppercase tracking-widest text-center">
 {heading}
 </h2>
 </div>

 {/* Wheel */}
 <div
 className="absolute"
 style={{ top:"65vw", width:"100%", height:"100vh" }}
 >
 <div
 ref={wheelRef}
 className="absolute flex items-center justify-center"
 style={{
 top: 0,
 left:"49%",
 transform:"translateX(-50%)",
 width:"100vw",
 height:"100vw",
 maxWidth:"2000px",
 maxHeight:"2000px",
 }}
 >
 {data.map((product, i) => (
 <div
 key={i}
 className="wheel-card absolute top-0 left-0"
 style={{ width:"23vw", height:"26vw", cursor:"pointer" }}
 >
 <SliderCard
 heading={product.heading}
 text={product.text}
 bgColor={product.bgColor}
 textColor={product.textColor}
 />
 </div>
 ))}
 </div>
 </div>

 <div className="w-full flex justify-center pb-[2%]">
 <p className="font-light uppercase tracking-widest text-[2.2vw] text-center">
 {para}
 </p>
 </div>
 </div>
 </section>

 {/* Mobile / Tablet */}
 <section className="lg:hidden py-[15vw] px-[5vw]">
 <h2 className="text-center text-[7vw] font-extralight uppercase tracking-widest mb-[10vw]">
 {heading}
 </h2>
 <div className="flex flex-col items-center gap-[10vw]">
 {data.map((product, i) => (
 <div key={i} className="w-[85vw] h-[100vw] max-sm:h-[30vh] rounded-[5vw] overflow-hidden">
 <SliderCard
 heading={product.heading}
 text={product.text}
 bgColor={product.bgColor}
 textColor={product.textColor}
 />
 </div>
 ))}
 </div>
 <p className="text-center font-light uppercase tracking-widest text-[6vw] mt-[10vw]">
 {para}
 </p>
 </section>
 </>
 );
};

export default CircularSlider;