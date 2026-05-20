"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function SlideCard({ heading, text, bgColor, textColor }) {
  return (
    <div
      className="flex h-full w-full cursor-pointer flex-col justify-between gap-10 rounded-[1.5vw] px-[10%] py-20 transition-all duration-500 hover:shadow-xl max-sm:gap-6 max-sm:rounded-2xl max-sm:px-6 max-sm:py-10"
      style={{ backgroundColor: bgColor || "rgba(255,255,255,0.7)", color: textColor || "inherit" }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-center text-[1.8vw] font-medium uppercase max-sm:text-2xl">{heading}</h2>
        <p className="mt-[0.5vw] text-center text-[1.15vw] max-sm:mt-1 max-sm:text-lg">{text}</p>
      </div>
      <div className="mt-[1vw] flex items-center justify-center gap-[0.5vw] max-sm:mt-2 max-sm:gap-2">
        <span className="text-[1vw] uppercase tracking-widest max-sm:text-xs">See More</span>
        <ArrowRight />
      </div>
    </div>
  );
}

export function RotatingCarousel({
  heading = "Interfaces that react.",
  para = "Built for motion, crafted for experience.",
  data = [],
  className = "",
}) {
  const outerRef = useRef(null);
  const wheelRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wheel = wheelRef.current;
      const cards = gsap.utils.toArray(".rotating-carousel__card");

      const setup = () => {
        const radius = wheel.offsetWidth / 1.1;
        const center = wheel.offsetWidth / 2;
        const total = cards.length;
        const slice = (0.58 * Math.PI) / total;

        cards.forEach((item, index) => {
          const angle = index * slice;
          const x = center + radius * Math.sin(angle);
          const y = center - radius * Math.cos(angle);

          gsap.set(item, {
            rotation: `${angle}_rad`,
            xPercent: -50,
            yPercent: -50,
            x,
            y,
          });
        });
      };

      setup();
      window.addEventListener("resize", setup);

      gsap.to(wheel, {
        rotate: -87,
        ease: "none",
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "+=1500 top",
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      });

      return () => window.removeEventListener("resize", setup);
    }, outerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={outerRef} className={`relative hidden lg:block ${className}`} style={{ height: "250vh" }}>
        <div className="sticky top-0 flex h-screen flex-col items-center justify-between overflow-hidden pb-[3%]">
          <div className="flex w-full justify-center pt-[3%]">
            <h2 className="text-center text-[2.5vw] uppercase tracking-widest">{heading}</h2>
          </div>

          <div className="absolute" style={{ top: "65vw", width: "100%", height: "100vh" }}>
            <div
              ref={wheelRef}
              className="absolute flex items-center justify-center"
              style={{
                top: 0,
                left: "49%",
                transform: "translateX(-50%)",
                width: "100vw",
                height: "100vw",
                maxWidth: "2000px",
                maxHeight: "2000px",
              }}
            >
              {data.map((item, index) => (
                <div key={index} className="rotating-carousel__card absolute top-0 left-0" style={{ width: "23vw", height: "26vw" }}>
                  <SlideCard {...item} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full justify-center pb-[2%]">
            <p className="text-center text-[2.2vw] font-light uppercase tracking-widest">{para}</p>
          </div>
        </div>
      </section>

      <section className={`px-[5vw] py-[15vw] lg:hidden ${className}`}>
        <h2 className="mb-[10vw] text-center text-[7vw] font-extralight uppercase tracking-widest">{heading}</h2>
        <div className="flex flex-col items-center gap-[10vw]">
          {data.map((item, index) => (
            <div key={index} className="h-[100vw] w-[85vw] overflow-hidden rounded-[5vw] max-sm:h-[30vh]">
              <SlideCard {...item} />
            </div>
          ))}
        </div>
        <p className="mt-[10vw] text-center text-[6vw] font-light uppercase tracking-widest">{para}</p>
      </section>
    </>
  );
}

export default RotatingCarousel;
