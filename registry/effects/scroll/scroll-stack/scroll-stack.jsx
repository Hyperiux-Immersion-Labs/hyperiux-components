"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollStack({ bgColor = "bg-white", cards = [] }) {
  const sectionRef = useRef(null);
  const rowRefs = useRef([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, cards.length);
    cardRefs.current = cardRefs.current.slice(0, cards.length);

    const context = gsap.context(() => {
      const currentCards = cardRefs.current.filter(Boolean);
      const currentRows = rowRefs.current.filter(Boolean);

      currentCards.forEach((card, index) => {
        gsap.set(card, {
          autoAlpha: 1,
          scale: index === 0 ? 1 : 1.1,
          transformOrigin: "center center",
        });
      });

      currentCards.slice(0, -1).forEach((card, index) => {
        const nextRow = currentRows[index + 1];
        const nextCard = currentCards[index + 1];
        if (!nextRow || !nextCard) return;

        const handoff = gsap.timeline({
          scrollTrigger: {
            trigger: nextRow,
            start: "top bottom+=20%",
            end: "top top-=28%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        handoff.to(nextCard, { scale: 1, ease: "none" }, 0);

        gsap.to(card, {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: nextRow,
            start: "top top+=14%",
            end: "top top+=2%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => context.revert();
  }, [cards]);

  return (
    <section
      ref={sectionRef}
      className={`py-[7%] max-sm:py-[15%] ${bgColor}`}
    >
      <div className="flex w-full flex-col items-center px-[5%] py-[10vw]">
        {cards.map((item, index) => (
          <div
            key={item.id}
            ref={(element) => {
              rowRefs.current[index] = element;
            }}
            className={`relative w-full min-h-[180vh] max-sm:min-h-[130vh] ${
              index === 0 ? "" : "-mt-[70vh] max-sm:-mt-[50vh]"
            }`}
          >
            <div className="sticky top-[15vh] max-sm:top-[10vh]" style={{ zIndex: index + 1 }}>
              <div
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className="mx-auto flex h-[32vw] w-[80%] items-center justify-between gap-[4vw] rounded-[45px] px-[4vw] py-[3vw] max-sm:h-auto max-sm:min-h-[50vw] max-sm:w-full max-sm:flex-col max-sm:rounded-[9vw] max-sm:px-[8vw] max-sm:py-[15vw]"
                style={{ backgroundColor: item.bgColor }}
              >
                <div className="w-[50%] max-sm:w-full">
                  <h2
                    className="w-full text-[5.5vw] font-medium leading-[1.1] max-sm:text-[10vw]"
                    style={{ color: item.textColor }}
                  >
                    {item.title}
                  </h2>
                </div>
                <div className="flex w-[50%] flex-col justify-center gap-[2vw] max-sm:w-full max-sm:gap-[7vw]">
                  <p
                    className="w-full text-justify text-[1.3vw] leading-[1.5] max-sm:text-center max-sm:text-[4.5vw]"
                    style={{ color: item.textColor }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
