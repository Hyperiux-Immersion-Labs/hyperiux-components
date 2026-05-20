"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Arrows } from "./arrows";
import { ArrowsOpacity } from "./arrows-opacity";
import { ArrowsLimit } from "./arrows-limit";
import { ArrowsPlay } from "./arrows-play";
import { Lines } from "./lines";
import { Points } from "./points";

gsap.registerPlugin(ScrollTrigger);

export function InteractiveArrows() {
  const [theme, setTheme] = useState("#000000");
  const [textColor, setTextColor] = useState("white");
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".arrow-animation-container",
          start: "top top",
          end: "bottom bottom",
          ease: "none",
          scrub: true,
        },
      });
      tl.to(".arrow-svg", { scale: 40, ease: "power1.in", duration: 1.5 });
      tl.to(".arrow-animation-text", { opacity: 1, duration: 0.8 });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(containerRef.current, { backgroundColor: "#000000", color: "white" });
      gsap.to(containerRef.current, {
        backgroundColor: "#000000",
        color: "white",
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".arrow-animation-container",
          start: "35% top",
          end: "40%",
          scrub: true,
          onLeaveBack: () => {
            gsap.set(containerRef.current, { backgroundColor: "#ffffff", color: "black" });
          },
        },
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".section-1",
        start: "top center",
        onEnter: () => {
          gsap.to(containerRef.current, { backgroundColor: "#ffffff", color: "black", duration: 0.8, ease: "power2.out" });
          setTextColor("black");
          setTheme("#ffffff");
        },
        onLeaveBack: () => {
          gsap.to(containerRef.current, { backgroundColor: "#000000", color: "white", duration: 0.8, ease: "power2.out" });
          setTextColor("white");
          setTheme("#000000");
        },
      });
      ScrollTrigger.create({
        trigger: ".section-4",
        start: "top center",
        onEnter: () => {
          gsap.to(containerRef.current, { backgroundColor: "#ffffff", color: "black" });
          setTextColor("black");
          setTheme("#ffffff");
        },
        onLeaveBack: () => {
          gsap.to(containerRef.current, { backgroundColor: "#000000", color: "white" });
          setTextColor("white");
          setTheme("#000000");
        },
      });
      ScrollTrigger.create({
        trigger: ".section-5",
        start: "top center",
        onEnter: () => {
          gsap.to(containerRef.current, { backgroundColor: "#000000", color: "white", duration: 0.8, ease: "power2.out" });
          setTextColor("white");
          setTheme("#000000");
        },
        onLeaveBack: () => {
          gsap.to(containerRef.current, { backgroundColor: "#ffffff", color: "black", duration: 0.8, ease: "power2.out" });
          setTextColor("black");
          setTheme("#ffffff");
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`h-fit w-full text-${textColor}`} style={{ backgroundColor: theme, color: textColor }}>
      <section className="w-screen relative flex-col gap-[2vw] h-screen flex items-center justify-center px-[5vw]">
        <h1 className="text-[5vw] w-[80%] leading-[1.1] text-center">
          Interactive Arrow Animations
        </h1>
        <h2 className="text-[1.8vw] w-[80%] leading-[1.1] text-center">
          Collection of Responsive Cursor Effects
        </h2>
        <p className="text-[1.2vw] mt-4 w-[50%] text-center opacity-80">
          Explore a showcase of dynamic arrow animations that respond to user interactions. From cursor-following arrows to opacity transitions, discover how subtle motion can enhance your web experience.
        </p>
      </section>

      <div className="w-full h-fit section-1">
        <section data-black-logo id="arrow-white" className="w-full h-fit flex py-[5vw] pt-[20vh] px-[5vw]">
          <div className="w-[50%] border-2 p-[1vw] rounded-md border-black h-fi">
            <Arrows />
          </div>
          <div className="w-[50%] gap-[2vw] h-full flex flex-col items-end py-[3vw] text-left">
            <h2 className="text-[3.5vw] w-[75%] leading-[1.1] text-left">Dynamic Response Arrow</h2>
            <p className="text-[1.3vw] text-left w-[75%]">
              This arrow effect provides immediate feedback to user interactions, perfect for high-performance websites.
            </p>
          </div>
        </section>

        <section className="w-full h-fit flex flex-row-reverse py-[5vw] px-[5vw]">
          <div className="w-fit border-2 p-[1vw] rounded-md border-black h-fit">
            <ArrowsOpacity />
          </div>
          <div className="w-[50%] shrink-0 gap-[2vw] h-full flex flex-col justify-start py-[3vw]">
            <h2 className="text-[3.5vw] w-[75%] leading-[1.1]">Dynamic Response Opacity</h2>
            <p className="text-[1.3vw] w-[75%]">
              This arrow effect provides immediate feedback to user interactions, perfect for high-performance websites.
            </p>
          </div>
        </section>
      </div>

      <section className="h-[200vh] section-2 arrow-animation-container w-full">
        <div className="h-screen flex items-center justify-center overflow-hidden w-full sticky top-0">
          <div className="h-[60%] absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%]">
            <svg
              className="h-full w-full object-cover arrow-svg"
              width="1452"
              height="1080"
              viewBox="0 0 1452 1080"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M426.303 716.379L478.942 784.724L889.013 468.886L941.653 537.231L1010 484.591L957.358 416.246L1025.7 363.606L973.064 295.261L904.719 347.901L852.079 279.556L783.734 332.195L836.374 400.54L426.303 716.379ZM662.749 316.49L731.094 263.85L783.734 332.195L715.389 384.835L662.749 316.49ZM662.749 316.49L594.404 369.13L541.764 300.785L610.109 248.145L662.749 316.49ZM925.948 658.216L994.293 605.576L941.653 537.231L873.308 589.871L925.948 658.216ZM925.948 658.216L857.602 710.855L910.242 779.201L978.587 726.561L925.948 658.216Z"
                fill="#000000"
              />
            </svg>
          </div>
          <p className="text-[1.5vw] !text-white w-[45%] leading-[1.5] opacity-0 z-[10] text-center font-medium arrow-animation-text">
            The arrow effect provides immediate feedback to user interactions, perfect for high-performance websites.
          </p>
        </div>
      </section>

      <section className="section-3">
        <div className="w-screen smooth-response-arrow px-[5vw] pb-[8vw] py-[5%] h-full">
          <div className="w-full flex items-center justify-center pb-[5vw]">
            <h2 className="text-[3.5vw] text-center leading-[1.2]">Smooth Response Arrow</h2>
          </div>
          <div className="w-full h-[90%] border-[3px] rounded-md border-white flex items-center justify-center">
            <ArrowsLimit />
          </div>
        </div>
      </section>

      <div className="w-full h-fit section-4">
        <section data-black-logo className="w-full h-fit flex py-[5vw] pt-[15vh] px-[5vw]">
          <div className="w-[50%] border-2 p-[1vw] rounded-md border-black h-fi">
            <Points />
          </div>
          <div className="w-[50%] gap-[2vw] h-full flex flex-col items-end justify-start py-[3vw] text-end">
            <h2 className="text-[3.5vw] w-[75%] leading-[1.1] text-left">Particle Lines</h2>
            <p className="text-[1.3vw] w-[75%] text-left">
              Incorporate cutting-edge particle effects that create a visually stunning experience as users navigate.
            </p>
          </div>
        </section>

        <section className="w-full h-full flex flex-row-reverse py-[5vw] px-[5vw]">
          <div className="w-[50%] border-2 p-[1vw] rounded-md border-black h-fi">
            <Lines />
          </div>
          <div className="w-[50%] gap-[2vw] h-full flex flex-col justify-start py-[3vw]">
            <h2 className="text-[3.5vw] w-[75%] leading-[1.1]">Interactive Lines</h2>
            <p className="text-[1.3vw] w-[75%]">
              An elegant arrow effect that moves fluidly with your mouse, enhancing user experience with seamless transitions.
            </p>
          </div>
        </section>
      </div>

      <section className="w-screen section-5 h-full py-[2vw]">
        <div className="w-full flex items-center justify-center py-[3vw]">
          <h2 className="text-[3.5vw] text-center leading-[1.2]">Playful Arrows</h2>
        </div>
        <ArrowsPlay />
      </section>
    </div>
  );
}
