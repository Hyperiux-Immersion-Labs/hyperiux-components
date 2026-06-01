"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Card from "../Card/Card";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const getRandomInRange = (min, max) => Math.random() * (max - min) + min;

const ScrollShuffledCards = ({
  cards = [],
  heading = "Scroll Shuffled Cards",
  sectionHeight = 400,
  cardWidth = "25vw",
  cardHeight = "30vw",
  cardPadding = "0.25vw",
  cardRadius = "0vw",
  cardsGap = "6vw",
  background = "#FFFBEB",
  initialContainerXPercent = 100,
  finalContainerXPercent = -100,
  startXRange = [-4, 4],
  startYRange = [-4, 4],
  startRotateRange = [-6, 6],
  endXRange = [-20, 30],
  endYRange = [-10, 10],
  endRotateRange = [-10, 10],
  className = "",
}) => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const randomizedCards = useMemo(() => {
    return cards.map((card, index) => ({
      ...card,
      startX: getRandomInRange(startXRange[0], startXRange[1]),
      startY: getRandomInRange(startYRange[0], startYRange[1]),
      startRotate: getRandomInRange(startRotateRange[0], startRotateRange[1]),
      endX: getRandomInRange(endXRange[0], endXRange[1]),
      endY: getRandomInRange(endYRange[0], endYRange[1]),
      endRotate: getRandomInRange(endRotateRange[0], endRotateRange[1]),
      zIndex: cards.length - index,
    }));
  }, [
    cards,
    startXRange,
    startYRange,
    startRotateRange,
    endXRange,
    endYRange,
    endRotateRange,
  ]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, randomizedCards.length);

    const ctx = gsap.context(() => {
      const cardElements = cardRefs.current.filter(Boolean);
      if (!cardElements.length) return;

      gsap.set(containerRef.current, {
        xPercent: initialContainerXPercent,
      });

      cardElements.forEach((cardEl, index) => {
        gsap.set(cardEl, {
          x: `${randomizedCards[index].startX}vw`,
          y: `${randomizedCards[index].startY}vw`,
          rotation: randomizedCards[index].startRotate,
          opacity: 1, 
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      tl.to(
        containerRef.current,
        {
          xPercent: finalContainerXPercent,
          ease: "none",
        },
        0
      );

      cardElements.forEach((cardEl, index) => {
        tl.to(
          cardEl,
          {
            x: `${randomizedCards[index].endX}vw`,
            y: `${randomizedCards[index].endY}vw`,
            rotation: randomizedCards[index].endRotate,
            ease: "none",
          },
          0
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [randomizedCards, initialContainerXPercent, finalContainerXPercent]);

  return (
    <section
      ref={sectionRef}
      className={`relative w-screen ${className}`}
      style={{
        height: `${sectionHeight}vh`,
        background,
      }}
    >
      <div className="sticky top-0 flex h-screen w-screen items-center justify-center overflow-hidden">
        <div
          ref={containerRef}
          className="relative z-1 flex h-fit w-fit items-center justify-center gap-[6vw] max-md:gap-[4vw] max-sm:gap-[3vw]"
          style={{ gap: cardsGap }}
        >
          {randomizedCards.map((card, index) => (
            <div
              key={card.id || index}
              ref={(el) => (cardRefs.current[index] = el)}
              className="relative h-fit w-fit shrink-0 opacity-0 will-change-transform"
              style={{ zIndex: card.zIndex }}
            >
              <Card
                radius={cardRadius}
                padding={cardPadding}
                className={`h-[30vw]! w-[25vw]! shrink-0 overflow-hidden max-md:h-[55vw]! max-md:w-[45vw]! max-sm:h-[78vw]! max-sm:w-[62vw]! max-[540px]:h-[90vw]! max-[540px]:w-[72vw]! ${card.bgOuter || ""}`}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                }}
              >
                <div
                  className={`flex h-full w-full flex-col justify-between px-[1.5vw] pb-[1.2vw] pt-[2.5vw] max-md:px-[2vw] max-md:pb-[1.8vw] max-md:pt-[3vw] max-sm:px-[4vw] max-sm:pb-[3vw] max-sm:pt-[4.5vw] max-[540px]:px-[4.5vw] max-[540px]:pb-[3.5vw] max-[540px]:pt-[5vw] ${card.bgInner || ""} ${card.text || ""}`}
                >
                  <div className="flex flex-col gap-[1.2vw] max-md:gap-[5vw] max-sm:gap-[6vw]">
                    {card.eyebrow && (
                      <span className="text-[0.85vw] font-semibold leading-none tracking-[0.2em] uppercase max-md:text-[2.5vw] max-sm:text-[4vw]! max-[540px]:text-[2.8vw]">
                        {card.eyebrow}
                      </span>
                    )}

                    {card.description && (
                      <p className="w-[85%] text-[1.05vw] leading-[1.35] max-md:w-[92%] max-md:text-[2.5vw] max-sm:w-full max-sm:text-[4vw]! max-[540px]:text-[3.6vw]">
                        {card.description}
                      </p>
                    )}
                  </div>

                  {card.title && (
                    <h2 className="text-[4.6vw] leading-[0.78] font-semibold max-md:text-[6vw] max-sm:text-[9vw] max-sm:leading-[0.86] max-[540px]:text-[10vw]">
                      {card.title}
                    </h2>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <h1 className="w-full px-[2vw] text-center text-[5.5vw] leading-[0.95] font-semibold text-[#1a1a1a] max-md:text-[7.5vw] max-sm:px-[4vw] max-sm:text-[10vw] max-[540px]:text-[11vw]">
            {heading}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default ScrollShuffledCards;
