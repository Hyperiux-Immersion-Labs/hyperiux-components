"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { LIQUID_TEXTURE } from "./liquid-tex";

export default function LiquidCursor({
  baseSize = 40,
  textHoverSize = 120,
  distortionScale = 1.5,
  blurAmount = 0.002,
  brightness = "90%",
  borderColor = "rgba(255,255,255,0.1)",
  maxButtonWidth = 200,
  maxButtonHeight = 150,
  
}) {
  const cursorRef = useRef(null);
  const innerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";

    // GSAP QuickTo for high performance following
    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.35,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.35,
      ease: "power3.out",
    });

    // Center the cursor so animations grow evenly from the center
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });

    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest("[data-cursor]");
      if (!target) return;

      const type = target.getAttribute("data-cursor");
      const bounds = target.getBoundingClientRect();

      if (type === "button") {
        gsap.to(innerRef.current, {
          width: Math.min(bounds.width + 80, maxButtonWidth),
          height: Math.min(bounds.height + 40, maxButtonHeight),
          borderRadius: "999px",
          border: `2px solid rgba(255,255,255,0.2)`,
          boxShadow: `inset 10px 5px 16px #fff`,
          duration: 0.4,
          ease: "power3.out",
          overwrite: true
        });
        textRef.current.innerText = "DISCOVER";
        gsap.to(textRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 0.1,
          ease: "back.out(1.7)",
          overwrite: true
        });
      } else if (type === "text") {
        gsap.to(innerRef.current, {
          width: textHoverSize,
          height: textHoverSize,
          border: `1px solid ${borderColor}`,
          boxShadow: `inset 10px 5px 16px #fff`,
          borderRadius: "50%",
          duration: 0.4,
          ease: "power3.out",
          overwrite: true
        });
        textRef.current.innerText = "CLICK";
        gsap.to(textRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 0.1,
          ease: "back.out(1.7)",
          overwrite: true
        });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest("[data-cursor]");
      if (!target) return;

      // Return to default round droplet shape
      gsap.to(innerRef.current, {
        width: baseSize,
        height: baseSize,
        borderRadius: "999px",
        duration: 0.4,
        ease: "power3.out",
        boxShadow: `inset 0 10px 15px ${borderColor}`,
        overwrite: true
      });
      gsap.to(textRef.current, { opacity: 0, scale: 0.5, duration: 0.2, overwrite: true });
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <svg className="h-0 w-0 opacity-0 absolute">
        <filter
          id="frosted"
          colorInterpolationFilters="sRGB"
          primitiveUnits="objectBoundingBox"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          {/* 
            Zooming in (width/height 1.5) removes the sharp padding edges. 
            'slice' prevents the oval stretch and keeps it perfectly proportional! 
          */}
          <feImage
            href={LIQUID_TEXTURE}
            x="-0.25"
            y="-0.25"
            width="1.5"
            height="1.5"
            preserveAspectRatio="xMidYMid slice"
            result="mapImage"
          />
          <feFlood floodColor="rgb(128,128,128)" result="grayBg" />
          <feComposite
            in="mapImage"
            in2="grayBg"
            operator="over"
            result="map"
          />

          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={blurAmount}
            result="blur"
          />
          <feDisplacementMap
            // ref={displacementRef}
            in="blur"
            in2="map"
            scale={distortionScale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div
        ref={cursorRef}
        className="fixed pointer-events-none top-0 left-0 z-50 flex items-center justify-center"
      >
        {/* Inner wrapper that changes size and border-radius dynamically via GSAP */}
        <div
          ref={innerRef}
          className="relative  flex items-center justify-center"
          style={{
            width: baseSize,
            height: baseSize,
            borderRadius: "999px",
            willChange: "width, height",
            // border: `1px solid ${borderColor}`,
            boxShadow: `inset 0 0px 5px ${borderColor}` //FOR CAPSULE

          }}
        >
          <div
            style={{
              filter:
                `url(#frosted) blur(1px) drop-shadow(10px -4px 6px rgb(255, 255, 255)) brightness(${brightness})`,
              backdropFilter: "blur(1px)",

              isolation: "isolate",
              borderRadius: "inherit",
            }}
            className="absolute bg-white/0 left-0 right-0 size-full"
          >
            <div className="size-full relative">
              <div
                style={
                  {
                    // border: `1px solid ${borderColor}`,
                  }
                }
                id="internaldiv"
                className="bg-white/10 rounded-full  absolute left-0 right-0 "
              ></div>
             
            </div>
          </div>

          {/* Dynamic inner text */}
          <span
            ref={textRef}
            className="relative z-10 text-white text-center opacity-0 scale-50 [text-shadow:0_2px_10px_rgba(0,0,0,0.18),0_0px_2px_rgba(0,0,0,0.25)]"
          ></span>
     
        </div>
      </div>
    </>
  );
}
