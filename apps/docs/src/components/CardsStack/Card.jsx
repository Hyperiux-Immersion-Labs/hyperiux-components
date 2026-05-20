"use client";

import Image from"next/image";

export const SliderCard = ({
 id,
 category,
 title,
 description,
 image,
 backgroundColor,
}) => {
 return (
 <div
 className={`flex h-full w-full shrink-0 items-stretch justify-between overflow-hidden origin-center ${backgroundColor}
 max-sm:min-h-[100svh] max-sm:flex-col max-sm:justify-start max-sm:py-8`}
 >
 <div
 className="flex h-full w-[55%] flex-col justify-between px-[2vw] py-[4vw]
 max-sm:w-full max-sm:px-5 max-sm:py-6"
 >
 <div>
 <h2
 className="mb-[2vw] text-[7vw] text-black font-third
 max-sm:mb-4 max-sm:text-[12vw] max-sm:leading-none"
 >
 {category}
 </h2>
 </div>

 <div className="mb-6 hidden h-[42svh] w-full max-sm:block">
 <div className="h-full w-full overflow-hidden rounded-[6vw]">
 <Image
 width={1000}
 height={1000}
 src={image}
 alt={title}
 className="h-full w-full object-cover"
 />
 </div>
 </div>

 <div
 className="flex justify-between gap-[12vw]
 max-sm:flex-col max-sm:gap-5"
 >
 <div
 className="mb-[3vw] w-fit text-[8vw] leading-none text-black
 max-sm:mb-0 max-sm:text-[14vw]"
 >
 {id}
 </div>

 <div
 className="flex flex-grow flex-col justify-center space-y-[2vw]
 max-sm:space-y-3"
 >
 <h3
 className="font-display text-[2.5vw] text-black leading-[1.2]
 max-sm:text-[7vw]"
 >
 {title}
 </h3>
 <p
 className="text-[1.4vw] leading-[1.2] text-gray-700
 max-sm:text-[4.2vw] max-sm:leading-[1.45]"
 >
 {description}
 </p>
 </div>
 </div>
 </div>

 <div
 className="my-auto h-[75%] w-[40%] p-[4vw]
 max-sm:hidden"
 >
 <div className="h-full w-full overflow-hidden rounded-[2vw]">
 <Image
 width={1000}
 height={1000}
 src={image}
 alt={title}
 className="card-image h-full w-full rounded-[2vw] object-cover"
 />
 </div>
 </div>
 </div>
 );
};
