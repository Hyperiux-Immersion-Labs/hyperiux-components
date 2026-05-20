"use client";

import { useRef, useState } from"react";
import Image from"next/image";
import PixelateSvgFilter from"@/components/PixelatedSvg/PixelatedSvgEffect";

export default function Page() {
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

 const handlePointerDown = (e) => {
 isTouching.current = true;
 updatePixel(e);
 };

 const handlePointerMove = (e) => {
 // Desktop OR active touch
 if (e.pointerType ==="touch" && !isTouching.current) return;
 updatePixel(e);
 };

 const handlePointerUp = () => {
 isTouching.current = false;
 };

 return (
 <div className="relative flex h-dvh w-dvw flex-col gap-15 items-center justify-center">

 <h2 className="text-5xl text-center">
 Move your cursor.
 <br />See the pixels react
 </h2>

 {/* SVG Filter */}
 <PixelateSvgFilter
 id="pixelate-filter"
 size={pixelSize}
 crossLayers
 />

 {/* Image */}
 <div
 ref={imageRef}
 className="relative h-[55vh] w-full max-w-xs overflow-hidden md:max-w-md lg:max-w-lg touch-none"
 style={{ filter:"url(#pixelate-filter)" }}
 onPointerDown={handlePointerDown}
 onPointerMove={handlePointerMove}
 onPointerUp={handlePointerUp}
 onPointerLeave={handlePointerUp}
 >
 <Image
 src="/assets/img/image02.webp"
 alt="Pixelated nature scene"
 fill
 priority
 className="object-cover"
 />
 </div>
 </div>
 );
}