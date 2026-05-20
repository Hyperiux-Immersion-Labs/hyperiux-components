"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import "./scroll-shuffled-cards.css";

gsap.registerPlugin(ScrollTrigger);

const getRandomInRange = (min, max) => Math.random() * (max - min) + min;

function VaultCard({
  children,
  padding = "2vw",
  borderColor = "rgba(0,0,0,0.2)",
  radius = "1.2vw",
  className = "",
  style,
}) {
  return (
    <div
      className={`vault-card ${className}`}
      style={{
        "--card-padding": padding,
        "--card-border": borderColor,
        "--card-radius": radius,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function ScrollShuffledCards({
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
}) {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const randomizedCards = useMemo(
    () =>
      cards.map((card, index) => ({
        ...card,
        startX: getRandomInRange(startXRange[0], startXRange[1]),
        startY: getRandomInRange(startYRange[0], startYRange[1]),
        startRotate: getRandomInRange(startRotateRange[0], startRotateRange[1]),
        endX: getRandomInRange(endXRange[0], endXRange[1]),
        endY: getRandomInRange(endYRange[0], endYRange[1]),
        endRotate: getRandomInRange(endRotateRange[0], endRotateRange[1]),
        zIndex: cards.length - index,
      })),
    [cards, endRotateRange, endXRange, endYRange, startRotateRange, startXRange, startYRange]
  );

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, randomizedCards.length);

    const context = gsap.context(() => {
      const cardElements = cardRefs.current.filter(Boolean);
      if (!cardElements.length) return;

      gsap.set(containerRef.current, {
        xPercent: initialContainerXPercent,
      });

      cardElements.forEach((cardElement, index) => {
        gsap.set(cardElement, {
          x: `${randomizedCards[index].startX}vw`,
          y: `${randomizedCards[index].startY}vw`,
          rotation: randomizedCards[index].startRotate,
        });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      timeline.to(
        containerRef.current,
        {
          xPercent: finalContainerXPercent,
          ease: "none",
        },
        0
      );

      cardElements.forEach((cardElement, index) => {
        timeline.to(
          cardElement,
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

    return () => context.revert();
  }, [finalContainerXPercent, initialContainerXPercent, randomizedCards]);

  return (
    <section
      ref={sectionRef}
      className={`ssc ${className}`}
      style={{ height: `${sectionHeight}vh`, background }}
    >
      <div className="ssc__sticky">
        <div ref={containerRef} className="ssc__cards" style={{ gap: cardsGap }}>
          {randomizedCards.map((card, index) => (
            <div
              key={card.id ?? index}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              className="ssc__card-wrap"
              style={{ zIndex: card.zIndex }}
            >
              <VaultCard
                radius={cardRadius}
                padding={cardPadding}
                className={`ssc__card ${card.bgOuter || ""}`}
                style={{ width: cardWidth, height: cardHeight }}
              >
                <div className={`ssc__card-inner ${card.bgInner || ""} ${card.text || ""}`}>
                  <div className="ssc__card-top">
                    {card.eyebrow ? <span className="ssc__eyebrow">{card.eyebrow}</span> : null}
                    {card.description ? (
                      <p className="ssc__description">{card.description}</p>
                    ) : null}
                  </div>
                  {card.title ? <h2 className="ssc__title">{card.title}</h2> : null}
                </div>
              </VaultCard>
            </div>
          ))}
        </div>

        <div className="ssc__heading-wrap">
          <h1 className="ssc__heading">{heading}</h1>
        </div>
      </div>
    </section>
  );
}
