import React from "react";
import FrameSlider from "@/components/frame-slider/FrameSlider";
import LenisSmoothScroll from "@/components/SmoothScroll/LenisScroll";

const page = () => {
  return (
    <>
    {/* <LenisSmoothScroll /> */}
 

    <div className="min-h-screen">
      <FrameSlider images={images} bgColor="#111111" />
    </div>
      
    </>
  );
};

export default page;

const images = [
  "/assets/nature/nature01.png",
  "/assets/nature/nature02.png",
  "/assets/nature/nature03.png",
  "/assets/nature/nature04.png",
  "/assets/nature/nature05.png",
  "/assets/nature/nature06.png",
];
