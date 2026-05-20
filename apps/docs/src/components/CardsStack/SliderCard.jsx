
import React from"react";
import { ArrowRight } from"lucide-react";

const SliderCard = ({ heading, text, bgColor, textColor }) => {
 return (
 <div
 className="h-full w-full rounded-[1.5vw] max-sm:rounded-2xl flex flex-col items-stretch justify-between gap-10 max-sm:gap-6 hover:shadow-xl transition-all duration-500 cursor-pointer px-[10%] max-sm:px-6 py-20 max-sm:py-10"
 style={{
 backgroundColor: bgColor ||"rgba(255,255,255,0.7)",
 color: textColor ||"inherit",
 }}
 >
 <div className="flex flex-col items-center gap-4 max-sm:gap-4 justify-center">
 <h2
 className="text-center font-medium text-[1.8vw] max-sm:text-2xl uppercase"
 style={{ color: textColor ||"inherit" }}
 >
 {heading}
 </h2>
 <p
 className="text-[1.15vw] max-sm:text-lg text-center mt-[0.5vw] max-sm:mt-1"
 style={{ color: textColor ||"inherit" }}
 >
 {text}
 </p>
 </div>

 <div className="mt-[1vw] max-sm:mt-2 flex items-center justify-center gap-[0.5vw] max-sm:gap-2 group/btn">
 <span
 className="text-[1vw] max-sm:text-xs uppercase tracking-widest"
 style={{ color: textColor ||"inherit" }}
 >
 See More
 </span>
 <ArrowRight />
 </div>
 </div>
 );
};

export default SliderCard;