"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StickyContentWrapper({
  items = [],
  className = "",
  leftClassName = "",
  rightClassName = "",
  contentClassName = "",
  imageClassName = "",
  containerHeight,
  contentEnterYPercent = 12,
  contentExitYPercent = -12,
  contentTransitionDuration = 0.8,
  contentDelay = 0.28,
  stepGap = 2,
  enableImageScaleFlow = true,
  initialImageScale = 1.5,
  activeImageScale = 1.2,
  exitImageScale = 1,
}) {
  // State & refs
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const contentRefs = useRef([]);
  const imageRefs = useRef([]);

  contentRefs.current = [];
  imageRefs.current = [];

  const addContentRef = (element) => {
    if (element && !contentRefs.current.includes(element)) {
      contentRefs.current.push(element);
    }
  };

  const addImageRef = (element) => {
    if (element && !imageRefs.current.includes(element)) {
      imageRefs.current.push(element);
    }
  };

  // Effects
  useLayoutEffect(() => {
    if (!sectionRef.current || !stickyRef.current || !items.length) {
      return;
    }

    const context = gsap.context(() => {
      // Initial element state
      const contents = contentRefs.current;
      const images = imageRefs.current;

      contents.forEach((content, index) => {
        gsap.set(content, {
          autoAlpha: index === 0 ? 1 : 0,
          yPercent: index === 0 ? 0 : contentEnterYPercent,
          zIndex: items.length - index,
        });
      });

      images.forEach((image, index) => {
        gsap.set(image, {
          autoAlpha: 1,
          zIndex: items.length - index,
          clipPath: "inset(0% 0% 0% 0%)",
          scale: enableImageScaleFlow
            ? index === 0
              ? activeImageScale
              : initialImageScale
            : 1,
          transformOrigin: "center center",
        });
      });

      // Scroll timeline
      const totalTimelineDuration = Math.max(1, (items.length - 1) * stepGap);
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      items.forEach((_, index) => {
        if (index === items.length - 1) {
          return;
        }

        const currentContent = contents[index];
        const nextContent = contents[index + 1];
        const currentImage = images[index];
        const nextImage = images[index + 1];
        const stepStart = index * stepGap;
        const nextContentStart =
          stepStart + contentTransitionDuration + contentDelay;

        timeline
          .to(
            currentContent,
            {
              autoAlpha: 0,
              yPercent: contentExitYPercent,
              duration: contentTransitionDuration,
              ease: "power2.inOut",
            },
            stepStart,
          )
          .fromTo(
            nextContent,
            {
              autoAlpha: 0,
              yPercent: contentEnterYPercent,
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: contentTransitionDuration,
              ease: "power2.inOut",
            },
            nextContentStart,
          )
          .to(
            currentImage,
            {
              clipPath: "inset(0% 0% 100% 0%)",
              scale: enableImageScaleFlow ? exitImageScale : 1,
              duration: stepGap,
              ease: "none",
            },
            stepStart,
          );

        if (enableImageScaleFlow) {
          timeline.to(
            nextImage,
            {
              scale: activeImageScale,
              duration: stepGap,
              ease: "none",
            },
            stepStart,
          );
        }
      });

      timeline.duration(totalTimelineDuration);
      ScrollTrigger.refresh();
    }, sectionRef);

    // Cleanup
    return () => context.revert();
  }, [
    items,
    contentEnterYPercent,
    contentExitYPercent,
    contentTransitionDuration,
    contentDelay,
    stepGap,
    enableImageScaleFlow,
    initialImageScale,
    activeImageScale,
    exitImageScale,
  ]);

  if (!items.length) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={`flex w-screen justify-between ${className}`}
      style={{
        height: containerHeight || `${items.length * 100}vh`,
      }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-screen w-full justify-between max-md:h-screen max-md:flex-col-reverse max-md:justify-start max-md:px-[5vw] max-sm:px-[6vw]"
      >
        <div
          className={`relative h-full w-[42%] max-md:h-[55%] max-md:w-full ${leftClassName}`}
        >
          {items.map((item, index) => (
            <div
              key={`content-${index}`}
              ref={addContentRef}
              className={`absolute inset-0 h-full w-full pl-[5vw] pt-[35%] opacity-0 [&_a]:mb-[1vw] [&_a]:text-[1.2vw] [&_h3]:mb-[2.5vw] [&_h3]:text-[4vw] [&_li]:mb-[0.5vw] [&_li]:text-[1.05vw] [&_p]:mb-[1vw] [&_p]:text-[1.2vw] [&_ul]:mb-[1vw] max-md:pl-0 max-md:pt-[7%] max-md:[&_a]:mb-[3vw] max-md:[&_a]:text-[2.8vw] max-md:[&_h3]:mb-[4vw] max-md:[&_h3]:text-[5.5vw] max-md:[&_li]:mb-[1vw] max-md:[&_li]:text-[2.5vw] max-md:[&_p]:mb-[3vw] max-md:[&_p]:text-[2.8vw] max-md:[&_ul]:mb-[4vw] max-sm:pt-[10%] max-sm:[&_a]:text-[4.5vw] max-sm:[&_h3]:text-[7.5vw] max-sm:[&_li]:text-[4vw] max-sm:[&_p]:text-[4.5vw] ${contentClassName}`}
            >
              {item.renderContent ? (
                item.renderContent(item, index)
              ) : (
                <div className="flex h-full w-full flex-col gap-[2vw] pt-[35%] max-md:gap-[5vw]">
                  {item.heading && (
                    <h3 className="text-[3rem] leading-none font-medium">
                      {item.heading}
                    </h3>
                  )}
                  {item.paragraph && (
                    <p className="w-[70%] text-[0.92rem] leading-[1.7]">
                      {item.paragraph}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className={`relative h-full w-1/2 overflow-hidden max-md:mt-[7vh] max-md:h-[37%] max-md:w-full max-md:rounded-[3.5vw] ${rightClassName}`}
        >
          {items.map((item, index) => (
            <div
              key={`image-${index}`}
              ref={addImageRef}
              className={`absolute inset-0 h-full w-full opacity-0 ${imageClassName}`}
            >
              {item.renderImage ? (
                item.renderImage(item, index)
              ) : (
                <Image
                  src={item.image}
                  alt={item.alt || `sticky-image-${index + 1}`}
                  className="h-full w-full object-cover"
                  width={item.width || 1080}
                  height={item.height || 1080}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
