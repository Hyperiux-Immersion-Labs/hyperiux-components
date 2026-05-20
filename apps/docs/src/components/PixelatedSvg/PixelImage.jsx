"use client";

import { useEffect, useId, useRef, useState } from"react";
import Image from"next/image";
import gsap from"gsap";
import { ScrollTrigger } from"gsap/dist/ScrollTrigger";
import PixelateSvgFilter from"@/components/PixelatedSvg/PixelatedSvgEffect";

gsap.registerPlugin(ScrollTrigger);

export default function PixelImage({
 src,
 alt,
 className ="",
 imageClassName ="",
 initialPixelSize = 18,
 finalPixelSize = 1,
 start ="top 50%",
 end ="bottom 35%",
 crossLayers = true,
 priority = false,
}) {
 const containerRef = useRef(null);
 const filterId = useId().replace(/:/g,"");
 const [pixelSize, setPixelSize] = useState(initialPixelSize);
 const shouldApplyFilter = pixelSize > finalPixelSize + 0.01;

 useEffect(() => {
 const container = containerRef.current;

 if (!container) {
 return undefined;
 }

 const animatedState = { size: initialPixelSize };

 const tween = gsap.to(animatedState, {
 size: finalPixelSize,
 duration:1.0,
 ease:"none",
 paused: true,
 onUpdate: () => {
 setPixelSize(animatedState.size);
 },
 });

 const trigger = ScrollTrigger.create({
 trigger: container,
 start,
 end,
 // scrub: true,
 // markers: true,
 animation: tween,
 invalidateOnRefresh: true,
 });

 return () => {
 trigger.kill();
 tween.kill();
 };
 }, [end, finalPixelSize, initialPixelSize, start]);

 return (
 <div ref={containerRef} className={`relative ${className}`}>
 <PixelateSvgFilter
 id={filterId}
 size={pixelSize}
 crossLayers={crossLayers}
 />

 <div
 className="relative h-full w-full overflow-hidden"
 style={{ filter: shouldApplyFilter ? `url(#${filterId})` : undefined }}
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
