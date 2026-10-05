// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import React, { useEffect, useId, type CSSProperties } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface FeatureRevealTriggerRange {
  start?: string;
  end?: string;
}

interface FeatureRevealTriggers {
  no?: FeatureRevealTriggerRange;
  title?: FeatureRevealTriggerRange;
  content?: FeatureRevealTriggerRange;
  img?: FeatureRevealTriggerRange;
}

interface FeatureRevealProperty {
  image?: string;
  imgClass?: string;
  no?: string | number;
  number?: string | number;
  titleClass?: string;
  title?: string;
  contentClass?: string;
  paragraphs?: string[];
  triggers?: FeatureRevealTriggers;
}

const defaultPropertiesData: FeatureRevealProperty[] = [];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

interface HorizontalScrollCompProps {
  propertiesData?: FeatureRevealProperty[];
  bgColor?: string;
  textColor?: string;
  /**
   * Image parallax travel as a % of the image width. Each image starts at
   * -translateX% and scrolls to +translateX%.
   */
  translateX?: number;
  cardGap?: number;
}

function HorizontalScrollComp({
  propertiesData = defaultPropertiesData,
  bgColor = "#ffffff",
  textColor = "#000000",
  translateX = 30,
  cardGap = 15,
}: HorizontalScrollCompProps) {
  const travel = Math.max(0, translateX);
  const uid = useId().replace(/:/g, "");
  const sectionId = `industries-${uid}`;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.innerWidth <= 1025) return;
      const reducedMotion = prefersReducedMotion();

      gsap.set(
        ".industry-img, .industry-no, .industry-title, .industry-content",
        { opacity: 1 },
      );

      gsap.to(".industry-container", {
        xPercent: -79,
        ease: "none",
        scrollTrigger: {
          trigger: `#${sectionId}`,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      if (reducedMotion) {
        ScrollTrigger.refresh();
        return;
      }

      const head = document.querySelector(".industry-head");
      if (head) {
        const headSplit = new SplitText(head, { type: "chars" });

        gsap.from(headSplit.chars, {
          yPercent: () =>
            (Math.random() < 0.5 ? 1 : -1) * (200 * Math.random()),
          xPercent: () => 200 * Math.random(),
          stagger: 0.1,
          duration: 1,
          ease: "back.out",
          scrollTrigger: {
            trigger: `#${sectionId}`,
            start: "top top",
            end: "20% top",
            scrub: true,
          },
        });
      }

      const cards = document.querySelectorAll(".industry-card");

      cards.forEach((card, i) => {
        const cfg = propertiesData[i]?.triggers || ({} as FeatureRevealTriggers);
        const startNo = cfg.no?.start || "top 70%";
        const endNo = cfg.no?.end || "top 40%";
        const startTitle = cfg.title?.start || "top 70%";
        const endTitle = cfg.title?.end || "top 40%";
        const startContent = cfg.content?.start || "top 70%";
        const endContent = cfg.content?.end || "top 40%";
        const startImg = cfg.img?.start || "top 70%";
        const endImg = cfg.img?.end || "top 40%";

        const noEl = card.querySelector(`[class*="industry-no-"]`);
        if (noEl) {
          const splitNo = new SplitText(noEl, {
            type: "chars,lines",
            mask: "lines",
          });

          gsap.from(splitNo.chars, {
            y: 150,
            rotate: 10,
            stagger: 0.1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `#${sectionId}`,
              start: startNo,
              end: endNo,
              toggleActions: "play none none reverse",
            },
          });
        }

        // FIXED: query property-title instead of industry-title
        const titleEl = card.querySelector(`[class*="property-title-"]`);
        if (titleEl) {
          const titleLines = new SplitText(titleEl, {
            type: "lines",
            mask: "lines",
          });

          gsap.set(titleEl, { lineHeight: 1.2 });
          gsap.set(titleLines.lines, { lineHeight: 1.2 });

          gsap.from(titleLines.lines, {
            yPercent: 100,
            stagger: 0.08,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `#${sectionId}`,
              start: startTitle,
              end: endTitle,
              // markers: true,
              toggleActions: "play none none reverse",
            },
          });
        }

        // FIXED: query property-content instead of industry-content
        const contentEls = card.querySelectorAll(`[class*="property-content-"]`);
        contentEls.forEach((contentEl) => {
          const contentLines = new SplitText(contentEl, {
            type: "lines",
            mask: "lines",
          });

          gsap.from(contentLines.lines, {
            yPercent: 100,
            stagger: 0.08,
            delay: 0.3,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `#${sectionId}`,
              start: startContent,
              end: endContent,
              toggleActions: "play none none reverse",
            },
          });
        });

        // this one was already okay, but keep it consistent
        const propertyImgs = card.querySelectorAll(`[class*="industry-img-"]`);
        // Zoomed in (at least 1.4x) so the +/- travel never shows the
        // container's edges.
        const imageScale = Math.max(1.4, 1 + (2 * travel) / 100);
        propertyImgs.forEach((propertyImg) => {
          gsap.fromTo(propertyImg, { xPercent: -travel, scale: imageScale }, {
            xPercent: travel,
            scale: imageScale,
            ease: "none",
            scrollTrigger: {
              trigger: `#${sectionId}`,
              start: startImg,
              end: endImg,
              scrub: true,
              // markers:true
            },
          });
        });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [propertiesData, sectionId, travel]);

  return (
    <section
      className="w-screen h-[600vh] relative z-10 max-[1025px]:mt-0 max-[1025px]:h-fit max-[1025px]:py-[15%] max-[1025px]:px-[7vw]"
      style={{ backgroundColor: bgColor, color: textColor }}
      id={sectionId}
    >

      <div className="w-screen  overflow-hidden h-screen justify-center items-center sticky top-0 max-[1025px]:static max-[1025px]:w-full max-[1025px]:h-fit max-[1025px]:flex max-[1025px]:flex-col max-[1025px]:items-start">

        <div
          className="flex flex-nowrap w-fit industry-container gap-(--card-gap) max-[1025px]:flex-col max-[1025px]:gap-[10vw] max-md:gap-[15vw]"
          style={{ "--card-gap": `${cardGap}vw` } as CSSProperties & Record<`--${string}`, string>}
        >
          {propertiesData.map((property, index) => (
            <div
              key={index}
              className="w-[80vw] h-screen flex gap-[5vw] industry-card max-[1025px]:h-fit max-[1025px]:flex-col-reverse max-[1025px]:w-full"
            >
              <div className="w-[40vw] h-screen overflow-hidden max-md:h-[110vw] max-[1025px]:w-full max-md:rounded-[4vw] max-[1025px]:h-[80vw] max-[1025px]:rounded-[2vw]">
                <img
                  src={property.image}
                  alt={`property-img-${index + 1}`}
                  className={`w-full h-full object-cover opacity-0 industry-img industry-${property.imgClass} max-[1025px]:opacity-100`}
                  width={500}
                  height={1080}
                />
              </div>

              <div className="flex flex-col gap-[5vh] w-[60%] pt-[7%] max-md:pt-0 max-[1025px]:w-full max-[1025px]:gap-[4vw] max-md:gap-[7vw]">
                <p
                  className={`text-[6em] font-medium font-display leading-none opacity-0 industry-no industry-no-${property.no} max-[1025px]:text-[10vw] max-[1025px]:opacity-100`}
                >
                  {property.number}
                </p>

                <div className="w-full h-fit flex flex-col gap-[4vh] max-md:gap-[7vw]">
                  <h3
                    className={`text-[4em] opacity-0 industry-title max-md:text-[9vw] max-[1025px]:text-[7.5vw] max-[1025px]:opacity-100 leading-[1.3] ${property.titleClass}`}
                  >
                    {property.title}
                  </h3>

                  <div className="space-y-[1.5vw] max-[1025px]:text-[2.5vw] max-md:text-[4.2vw]">
                    {(property.paragraphs as string[]).map((para, pIndex) => (
                      <p
                        key={pIndex}
                        className={`opacity-0 industry-content max-[1025px]:opacity-100 ${property.contentClass}`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROPERTIES_DATA = [
  {
    number: "01",
    imgClass: "img-1",
    no: "1",
    titleClass: "property-title-1",
    contentClass: "property-content-1",
    title: "Burj Khalifa",
    image: "https://picsum.photos/seed/v05/1600/1200",
    paragraphs: [
      "Burj Khalifa represents the highest standard of luxury living in Dubai, combining iconic architecture, unmatched skyline views, and an address that carries global prestige.",
      "From ultra-premium residences to a location at the heart of Downtown Dubai, the property offers immediate access to luxury retail, fine dining, and a lifestyle defined by exclusivity, convenience, and long-term value.",
    ],
    triggers: {
      img: { start: "-10% top", end: "10% top" },
      no: { start: "-1% top", end: "5% top" },
      title: { start: "-1% top", end: "5% top" },
      content: { start: "-1% top", end: "5% top" },
    },
  },
  {
    number: "02",
    imgClass: "img-2",
    no: "2",
    titleClass: "property-title-2",
    contentClass: "property-content-2",
    title: "Palm Jumeirah",
    image: "https://picsum.photos/seed/v06/1600/1200",
    paragraphs: [
      "Palm Jumeirah is one of Dubai’s most sought-after waterfront destinations, known for its private beachfront residences, resort-style environment, and exceptional coastal views.",
      "Whether for end-use or investment, the location offers a rare combination of luxury, privacy, and international appeal, making it one of the strongest lifestyle-led property assets in the region.",
    ],
    triggers: {
      img: { start: "-5% top", end: "35% top" },
      no: { start: "18% top", end: "23% top" },
      title: { start: "18% top", end: "23% top" },
      content: { start: "18% top", end: "23% top" },
    },
  },
  {
    number: "03",
    imgClass: "img-3",
    no: "3",
    titleClass: "property-title-3",
    contentClass: "property-content-3",
    title: "Dubai Marina",
    image: "https://picsum.photos/seed/v07/1600/1200",
    paragraphs: [
      "Dubai Marina offers a dynamic urban waterfront experience, blending high-rise luxury apartments with vibrant retail, dining, and leisure experiences in one connected district.",
      "Its strong rental demand, premium lifestyle positioning, and consistent desirability make Dubai Marina a compelling option for both investors and residents seeking modern city living.",
    ],
    triggers: {
      img: { start: "25% top", end: "65% top" },
      no: { start: "45% top", end: "50% top" },
      title: { start: "45% top", end: "50% top" },
      content: { start: "45% top", end: "50% top" },
    },
  },
  {
    number: "04",
    imgClass: "img-4",
    no: "4",
    titleClass: "property-title-4",
    contentClass: "property-content-4",
    title: "Dubai Creek Harbour",
    image: "https://picsum.photos/seed/v08/1600/1200",
    paragraphs: [
      "Dubai Creek Harbour is emerging as one of the city’s most future-ready residential destinations, offering refined waterfront living with a strong focus on design, accessibility, and long-term growth.",
      "With its master-planned ecosystem, premium residences, and strong development vision, the district is positioned as a next-generation address for buyers seeking both lifestyle and appreciation potential.",
    ],
    triggers: {
      img: { start: "45% top", end: "85% top" },
      no: { start: "65% top", end: "70% top" },
      title: { start: "65% top", end: "70% top" },
      content: { start: "65% top", end: "70% top" },
    },
  },
];

export const HorizontalFeatureReveal = ({
  bgColor = "#ffffff",
  textColor = "#000000",
  translateX = 30,
  cardGap = 15,
}) => {
  return (

      <div>
        <HorizontalScrollComp
          propertiesData={PROPERTIES_DATA}
          bgColor={bgColor}
          textColor={textColor}
          translateX={translateX}
          cardGap={cardGap}
        />
      </div>

  );
};

export default HorizontalFeatureReveal;
