"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MarqueeAlongSvgPath from "@/components/SVGPath/SVGPath";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";


const wavePath =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

// Circle path
const circlePath =
  "M498 165 m -120, 0 a 120,120 0 1,0 240,0 a 120,120 0 1,0 -240,0";

// Spiral-ish custom path 
const spiralPath =
  "M0 165C120 40 240 290 360 165C480 40 600 290 720 165C840 40 960 290 1080 165";


const imgs = Array.from({ length: 14 }, (_, i) => ({
  src: `/assets/nature/nature${String(i + 1).padStart(2, "0")}.png`,
  link: "/",
}));

export default function MarqueeAlongSvgPathDemo() {
  const [activeTab, setActiveTab] = useState("wave");

  const currentPath =
    activeTab === "wave"
      ? wavePath
      : activeTab === "circle"
      ? circlePath
      : spiralPath;

  return (
    <>
      <LenisSmoothScroll />

      <div className="w-dvw relative h-[180vh] bg-zinc-50 flex items-center justify-center">
        
     
        {/* <div className="fixed top-6 z-50 flex gap-3 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow">
          {["wave", "circle", "spiral"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-full text-sm capitalize transition ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "text-black/60 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

  */}
        <div className="fixed top-0 h-dvh w-dvw bg-black">
          <MarqueeAlongSvgPath
            path={currentPath}
            viewBox="0 0 996 330"
            baseVelocity={8}
            slowdownOnHover
            draggable
            useScrollVelocity={true}
            repeat={2}
            dragSensitivity={0.1}
            className="w-full h-full scale-105 max-sm:scale-150"
            responsive
            grabCursor
          >
            {imgs.map((img, i) => (
              <Link key={i} href={img.link}>
                <div className="w-14 max-sm:w-18 h-full hover:scale-150 duration-300 ease-in-out">
                  <Image
                    src={img.src}
                    alt={`Nature ${i}`}
                    width={56}
                    height={100}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              </Link>
            ))}
          </MarqueeAlongSvgPath>
        </div>
      </div>
    </>
  );
}