"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Card from "../Card/Card";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import "./ScrollShuffleCards.css";

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
      className={`ssc ${className}`}
      style={{
        height: `${sectionHeight}vh`,
        background,
      }}
    >
      <div className="ssc__sticky">
        <div
          ref={containerRef}
          className="ssc__cards"
          style={{ gap: cardsGap }}
        >
          {randomizedCards.map((card, index) => (
            <div
              key={card.id || index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`ssc__card-wrap z-[${index}] opacity-0`}
            >
              <Card
                radius={cardRadius}
                padding={cardPadding}
                className={`ssc__card ${card.bgOuter || ""}`}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                }}
              >
                <div
                  className={`ssc__card-inner ${card.bgInner || ""} ${card.text || ""}`}
                >
                  <div className="ssc__card-top">
                    {card.eyebrow && (
                      <span className="ssc__eyebrow">{card.eyebrow}</span>
                    )}

                    {card.description && (
                      <p className="ssc__description">{card.description}</p>
                    )}
                  </div>

                  {card.title && <h2 className="ssc__title">{card.title}</h2>}
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="ssc__heading-wrap">
          <h1 className="ssc__heading">{heading}</h1>
        </div>
      </div>
    </section>
  );
};

export default ScrollShuffledCards;