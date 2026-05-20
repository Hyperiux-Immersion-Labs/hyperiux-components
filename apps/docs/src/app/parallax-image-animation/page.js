import ParallaxAnim from"@/components/ParallaxAnim/ParallaxAnim";
import React from"react";
import { ReactLenis } from"lenis/react";

const page = () => {
 return (
 <>
 <ReactLenis root>
 <section className="w-screen h-screen bg-black text-white flex flex-col gap-[7vw] items-center justify-center">
 <h1 className="text-[4vw] font-medium max-sm:text-[8.5vw] w-[70%] text-center">
 Scroll To See Image Parallax Effect
 </h1>
 </section>
 <section className="w-screen h-fit flex flex-col gap-[7vw] items-center justify-center bg-black text-white max-sm:gap-[10vw]">
 <div className="w-[70%] flex justify-between max-sm:w-[90%] max-sm:flex-col">
 <div>
 <p className="text-[1.5vw] mb-[2vw] font-medium max-sm:text-[5.5vw]">
 Only Parallax
 </p>
 <ParallaxAnim
 src="/assets/parallax-img/p-img-1.jpg"
 wrapperClassName="w-[27vw] h-[37vw] max-sm:w-full max-sm:h-[120vw]"
 imageClassName="scale-[1.4] -translate-y-[30%]"
 />
 </div>
 <div className="mt-[15vw]">
 <p className="text-[1.5vw] mb-[2vw] font-medium max-sm:text-[5.5vw]">
 Scale Down with Parallax
 </p>
 <ParallaxAnim
 src="/assets/parallax-img/p-img-2.jpg"
 wrapperClassName="w-[32vw] h-[32vw] max-sm:w-full max-sm:h-[90vw]"
 scaleFrom={1.6}
 scaleTo={1.2}
 enableScale={true}
 imageClassName="scale-[1.4] -translate-y-[30%]"
 />
 </div>
 </div>
 <div className="w-[70%] flex justify-between max-sm:w-[90%] max-sm:flex-col max-sm:gap-[10vw]">
 <ParallaxAnim
 src="/assets/parallax-img/p-img-3.jpg"
 wrapperClassName="w-[27vw] h-[37vw] rounded-[0.5vw] max-sm:w-full max-sm:h-[120vw] max-sm:rounded-[2vw]"
 imageClassName="scale-[1.4] -translate-y-[30%]"
 />
 <div className="mt-[17vw] max-sm:mt-0">
 <ParallaxAnim
 src="/assets/parallax-img/p-img-4.jpg"
 wrapperClassName="w-[38vw] h-[30vw] rounded-[1vw] max-sm:w-full max-sm:rounded-[3vw] max-sm:h-[100vw]"
 imageClassName="scale-[1.4] -translate-y-[30%]"
 />
 </div>
 </div>
 </section>
 <section className="w-screen h-screen bg-black"></section>
 </ReactLenis>
 </>
 );
};

export default page;
