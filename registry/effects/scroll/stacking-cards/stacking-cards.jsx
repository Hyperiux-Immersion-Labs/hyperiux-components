"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SliderCard({ id, category, title, description, image, backgroundColor }) {
  return (
    <div
      className={`flex h-full w-full shrink-0 items-stretch justify-between overflow-hidden origin-center ${backgroundColor} max-sm:min-h-[100svh] max-sm:flex-col max-sm:justify-start max-sm:py-8`}
    >
      <div className="flex h-full w-[55%] flex-col justify-between px-[2vw] py-[4vw] max-sm:w-full max-sm:px-5 max-sm:py-6">
        <div>
          <h2 className="mb-[2vw] text-[7vw] text-black max-sm:mb-4 max-sm:text-[12vw] max-sm:leading-none">
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

        <div className="flex justify-between gap-[12vw] max-sm:flex-col max-sm:gap-5">
          <div className="mb-[3vw] w-fit text-[8vw] leading-none text-black max-sm:mb-0 max-sm:text-[14vw]">
            {id}
          </div>

          <div className="flex flex-grow flex-col justify-center space-y-[2vw] max-sm:space-y-3">
            <h3 className="text-[2.5vw] leading-[1.2] text-black max-sm:text-[7vw]">
              {title}
            </h3>
            <p className="text-[1.4vw] leading-[1.2] text-gray-700 max-sm:text-[4.2vw] max-sm:leading-[1.45]">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="my-auto hidden h-[75%] w-[40%] p-[4vw] max-sm:block max-sm:hidden">
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
}

export default function StackingCards({ data = [] }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, data.length);

    const context = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      const totalCards = cards.length;
      if (!totalCards) return;

      cards.forEach((card, index) => {
        gsap.set(card, {
          yPercent: index === 0 ? 0 : 100,
          zIndex: index + 1,
          scale: 1,
          rotation: 0,
          rotateX: 0,
          opacity: 1,
          borderRadius: 0,
        });
      });

      const firstImage = cards[0]?.querySelector(".card-image");
      if (firstImage) {
        gsap.fromTo(
          firstImage,
          { scale: 1.5 },
          {
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "50% bottom",
              end: "bottom 60%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${Math.max(totalCards - 1, 0) * window.innerHeight}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      for (let index = 1; index < totalCards; index += 1) {
        const rotateDirection = (index - 1) % 2 === 0 ? -5 : 5;
        const segmentStart = index - 1;

        timeline.to(cards[index], { yPercent: 0, duration: 0.55, ease: "none" }, segmentStart);

        const currentImage = cards[index].querySelector(".card-image");
        if (currentImage) {
          timeline.to(
            currentImage,
            {
              keyframes: [
                { scale: 1.5, ease: "none", duration: 0.16 },
                { scale: 1, ease: "none", duration: 0.39 },
              ],
            },
            segmentStart
          );
        }

        timeline
          .to(
            cards[index - 1],
            {
              scale: 0.8,
              rotation: rotateDirection,
              rotateX: 20,
              borderRadius: "3vw",
              ease: "linear",
              duration: 0.5,
            },
            segmentStart
          )
          .to(
            cards[index - 1],
            {
              opacity: 0,
              ease: "none",
              duration: 0.25,
            },
            segmentStart + 0.4
          );
      }

      ScrollTrigger.refresh();
    }, containerRef);

    return () => context.revert();
  }, [data]);

  return (
    <section
      className="relative z-0 h-[var(--stack-height)] w-full"
      style={{ "--stack-height": `${data.length * 100}vh` }}
    >
      <div
        ref={containerRef}
        className="sticky top-0 h-screen w-screen overflow-hidden bg-black"
        style={{ perspective: "1200px" }}
      >
        {data.map((item, index) => (
          <div
            key={item.id}
            ref={(element) => {
              if (element) cardsRef.current[index] = element;
            }}
            className="absolute inset-0 overflow-hidden"
          >
            <SliderCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}
