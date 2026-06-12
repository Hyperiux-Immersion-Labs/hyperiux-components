"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function PixelateSvgFilter({
 id ="pixelate-filter",
 size: propSize = 16,
 crossLayers = false
}) {
 const size = Math.max(2, propSize);
 return (
 <svg
 aria-hidden="true"
 className="pointer-events-none absolute h-0 w-0 overflow-hidden"
 >
 <defs>
 <filter id={id} x="0" y="0" width="1" height="1">
 {/* Base pixelation */}
 <feConvolveMatrix
 kernelMatrix="1 1 1
 1 1 1
 1 1 1"
 result="AVG"
 />

 <feFlood x="1" y="1" width="1" height="1" />

 <feComposite
 operator="arithmetic"
 k1="0"
 k2="1"
 k3="0"
 k4="0"
 width={size}
 height={size}
 />

 <feTile result="TILE" />

 <feComposite
 in="AVG"
 in2="TILE"
 operator="in"
 />

 <feMorphology
 operator="dilate"
 radius={size / 2}
 result="NORMAL"
 />

 {crossLayers && (
 <>
 {/* Horizontal fallback */}
 <feConvolveMatrix
 kernelMatrix="1 1 1
 1 1 1
 1 1 1"
 result="AVG"
 />
 <feFlood x="1" y="1" width="1" height="1" />
 <feComposite
 in2="SourceGraphic"
 operator="arithmetic"
 k1="0"
 k2="1"
 k3="0"
 k4="0"
 width={size / 2}
 height={size}
 />
 <feTile result="TILE" />
 <feComposite in="AVG" in2="TILE" operator="in" />
 <feMorphology
 operator="dilate"
 radius={size / 2}
 result="FALLBACKX"
 />

 {/* Vertical fallback */}
 <feConvolveMatrix
 kernelMatrix="1 1 1
 1 1 1
 1 1 1"
 result="AVG"
 />
 <feFlood x="1" y="1" width="1" height="1" />
 <feComposite
 in2="SourceGraphic"
 operator="arithmetic"
 k1="0"
 k2="1"
 k3="0"
 k4="0"
 width={size}
 height={size / 2}
 />
 <feTile result="TILE" />
 <feComposite in="AVG" in2="TILE" operator="in" />
 <feMorphology
 operator="dilate"
 radius={size / 2}
 result="FALLBACKY"
 />

 <feMerge>
 <feMergeNode in="FALLBACKX" />
 <feMergeNode in="FALLBACKY" />
 <feMergeNode in="NORMAL" />
 </feMerge>
 </>
 )}

 {!crossLayers && <feMergeNode in="NORMAL" />}
 </filter>
 </defs>
 </svg>
 );
}

export function PixelatedImageEffect({
 src ="https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg",
 alt ="Pixelated nature scene",
 priority = true,
 imageClassName ="",
 heading ="Slide left for a clear image, right for more pixelation.",
}) {
 const imageRef = useRef(null);
 const isTouching = useRef(false);
 const [pixelSize, setPixelSize] = useState(16);

 const updatePixel = (event) => {
 if (!imageRef.current) return;

 const rect = imageRef.current.getBoundingClientRect();
 const x = event.clientX - rect.left;

 const nextPixelSize = Math.min(Math.max(x / 30, 1), 64);
 setPixelSize(nextPixelSize);
 };

 const handlePointerDown = (event) => {
 isTouching.current = true;
 updatePixel(event);
 };

 const handlePointerMove = (event) => {
 if (event.pointerType ==="touch" && !isTouching.current) return;
 updatePixel(event);
 };

 const handlePointerUp = () => {
 isTouching.current = false;
 };

 return (
 <div className="relative flex h-dvh w-dvw flex-col gap-15 items-center justify-center">

<h2 className="text-5xl text-center max-md:hidden w-[45%]">
  {heading}
</h2>

 <h2 className="hidden max-md:block text-center text-2xl">
   {heading}

 </h2>

 <PixelateSvgFilter
 id="pixelate-filter"
 size={pixelSize}
 crossLayers
 />

 <div
 ref={imageRef}
 className="relative h-[55vh] w-full max-sm:max-w-[90%] overflow-hidden max-md:max-w-[90%] max-w-lg touch-none"
 style={{ filter:"url(#pixelate-filter)" }}
 onPointerDown={handlePointerDown}
 onPointerMove={handlePointerMove}
 onPointerUp={handlePointerUp}
 onPointerLeave={handlePointerUp}
 >
 <Image
 src={src}
 alt={alt}
 fill
 priority={priority}
 className={`object-cover ${imageClassName}`.trim()}
 />
 </div>
 </div>
 );
}

export default PixelateSvgFilter;
