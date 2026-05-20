"use client";
import DraggableMarquee from"@/components/DraggableMarquee/DraggableMarquee";
import Image from"next/image";
import React from"react";

const marqueeImages = [
 {
 id: 1,
 src:"/assets/parallax-img/p-img-1.jpg",
 alt:"Image 1",
 title:"image 1",
 width: 420,
 height: 520,
 imageClassName:"w-[24vw] h-[30vw] rounded-2xl max-md:w-[40vw] max-md:h-[60vw]    object-cover",
 },
 {
 id: 2,
 src:"/assets/parallax-img/p-img-2.jpg",
 alt:"Image 2",
 title:"image 2",
 width: 420,
 height: 520,
 imageClassName:"w-[24vw] h-[30vw] rounded-2xl max-md:w-[40vw] max-md:h-[60vw]    object-cover",
 },
 {
 id: 3,
 src:"/assets/parallax-img/p-img-3.jpg",
 alt:"Image 3",
 title:"image 3",
 width: 420,
 height: 520,
 imageClassName:"w-[24vw] h-[30vw] rounded-2xl max-md:w-[40vw] max-md:h-[60vw]    object-cover",
 },
 {
 id: 4,
 src:"/assets/parallax-img/p-img-4.jpg",
 alt:"Image 4",
 title:"image 4",
 width: 420,
 height: 520,
 imageClassName:"w-[24vw] h-[30vw] rounded-2xl max-md:w-[40vw] max-md:h-[60vw]    object-cover",
 },
];
const page = () => {
 return (
 <>
 <section className="w-screen h-screen bg-black text-white flex flex-col justify-center items-center">
 <DraggableMarquee
 items={marqueeImages}
 speed={7.2}
 gapClassName="gap-[2vw] max-md:gap-[4vw]"
 className="py-10"
 itemClassName="select-none"
 />
 {/* <DraggableMarquee
 items={marqueeImages}
 speed={7.2}
 gapClassName="gap-[2vw]"
 renderItem={(item) => (
 <div className="flex flex-col gap-4 w-[20vw]">
 <div className="aspect-[4/5] rounded-xl overflow-hidden">
 <Image
 src={item.src}
 alt=""
 width={500}
 height={700}
 className="w-full h-full object-cover"
 />
 </div>
 <h3 className="text-lg">{item.title}</h3>
 </div>
 )}
 /> */}
 </section>
 </>
 );
};

export default page;
