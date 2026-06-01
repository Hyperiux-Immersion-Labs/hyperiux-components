import ImagesAnimation from "@/components/MouseHoverAnim/ImagesAnimation";
import React from "react";

const images = [
 

  { src: "/assets/gradient/image1.png", alt: "Gradient 1" },
  { src: "/assets/gradient/image2.png", alt: "Gradient 2" },
  { src: "/assets/gradient/image3.png", alt: "Gradient 3" },
  { src: "/assets/gradient/image4.png", alt: "Gradient 4" },
  { src: "/assets/gradient/image5.png", alt: "Gradient 5" },
  { src: "/assets/gradient/image6.png", alt: "Gradient 6" },
  { src: "/assets/gradient/image7.png", alt: "Gradient 7" },
  { src: "/assets/gradient/image8.png", alt: "Gradient 8" },
  { src: "/assets/gradient/image9.png", alt: "Gradient 9" },
  { src: "/assets/gradient/image10.png", alt: "Gradient 10" },
  { src: "/assets/gradient/image11.png", alt: "Gradient 11" },
  { src: "/assets/gradient/image12.png", alt: "Gradient 12" },
  { src: "/assets/gradient/image13.png", alt: "Gradient 13" },
  { src: "/assets/gradient/image14.png", alt: "Gradient 14" },
  { src: "/assets/gradient/image15.png", alt: "Gradient 15" },
  { src: "/assets/gradient/image1.png", alt: "Gradient 1" },
  { src: "/assets/gradient/image2.png", alt: "Gradient 2" },
  { src: "/assets/gradient/image3.png", alt: "Gradient 3" },
  { src: "/assets/gradient/image4.png", alt: "Gradient 4" },
  { src: "/assets/gradient/image5.png", alt: "Gradient 5" },
];

const page = () => {
    return (
        <div className="w-screen h-screen relative z-999 bg-[#f8fdfe]">
            <div className="absolute w-full h-full flex justify-center items-center">
                <h1 className="text-[5.5vw] max-md:hidden text-stone-800">
                    Move the Mouse to See Magic
                </h1> 
                <p className="max-sm:text-[5.5vw] max-md:text-[4vw] font-serif text-center leading-[1.4] hidden max-md:block text-stone-800">
                    Tap to explore 
                    <span className="max-sm:uppercase block text-center max-sm:pt-[5vw] max-md:pt-[3vw] leading-[1.2]">
                     The full magic happens on Desktop
                    </span>
                </p>
            </div>
            <ImagesAnimation
                images={images}
                enableRotation={true}
                idleSpawn={true}
                idleDelay={300}
                cursorOffsetX={-12}
                cursorOffsetY={-12}
                popOutDuration={0.8}
                fadeOutDuration={0.5}
                idlePopOutMultiplier={2.2}
                idleFadeMultiplier={1.8}
                imageMultiplier={3}
            />
        </div>
    );
};

export default page;
