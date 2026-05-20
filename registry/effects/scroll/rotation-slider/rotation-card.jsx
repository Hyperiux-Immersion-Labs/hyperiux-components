"use client";
import React, { forwardRef } from "react";
import Image from "next/image";

const RotationCard = forwardRef(({ src, index, total }, ref) => {
  return (
  <div
  ref={ref}
  className="absolute w-[38vw] h-[45vh] origin-right overflow-hidden  opacity-0"
  style={{
    transformStyle: "preserve-3d",
    zIndex: total - index,
  }}
>
  <div
    className="w-full h-full relative"
    style={{
      transformStyle: "preserve-3d",
    }}
  >
    <Image
      src={src}
      alt="slider"
      fill
      className="object-cover"
      priority
    />
  </div>
</div>
  );
});

export default RotationCard;