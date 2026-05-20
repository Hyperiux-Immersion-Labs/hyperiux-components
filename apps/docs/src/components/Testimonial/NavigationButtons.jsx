import { ArrowLeft, ArrowRight } from"lucide-react";

export default function NavigationButtons({ onPrev, onNext, isAnimating }) {
 return (
 <nav className="flex gap-1.5">
 {/* PREV */}
 <button
 aria-label="Previous testimonial"
 onClick={onPrev}
 disabled={isAnimating}
 className="w-11 h-11 relative flex items-center group justify-center border border-black/18 bg-transparent text-base cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden"
 >
 <ArrowLeft
 size={16}
 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  group-hover:left-[-15]  group-hover:transition-all group-hover:duration-500 group-hover:ease-out"
 />
 <ArrowLeft
 size={16}
 className="absolute top-1/2 right-[-20] -translate-y-1/2  group-hover:right-1/2 group-hover:translate-x-1/2  group-hover:transition-all group-hover:duration-500 group-hover:ease-out"
 />
 </button>

 {/* NEXT */}
 <button
 aria-label="Next testimonial"
 onClick={onNext}
 disabled={isAnimating}
 className="w-11 h-11 flex overflow-hidden relative group items-center justify-center border border-black/18 bg-transparent text-base cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
 >
 <ArrowRight
 size={16}
 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  group-hover:left-[50]  group-hover:transition-all group-hover:duration-500 group-hover:ease-out"
 />
 <ArrowRight
 size={16}
 className="absolute top-1/2 left-[-20] -translate-y-1/2  group-hover:left-1/2 group-hover:-translate-x-1/2  group-hover:transition-all group-hover:duration-500 group-hover:ease-out"
 />
 </button>
 </nav>
 );
}