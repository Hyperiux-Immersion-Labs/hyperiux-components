"use client";

import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("sticky-content-wrapper-styles")) return;

  const style = document.createElement("style");
  style.id = "sticky-content-wrapper-styles";
  style.textContent = `
    .sticky-content-wrapper {
      width: 100vw;
      display: flex;
      justify-content: space-between;
    }

    .sticky-content-wrapper__sticky {
      width: 100%;
      height: 100vh;
      position: sticky;
      top: 0;
      display: flex;
      justify-content: space-between;
    }

    .sticky-content-wrapper__left {
      width: 42%;
      height: 100%;
      position: relative;
    }

    .sticky-content-wrapper__right {
      width: 50%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }

    .sticky-content-wrapper__panel {
      position: absolute;
      inset: 0;
      padding-left: 5vw;
      padding-top: 35%;
      width: 100%;
      height: 100%;
    }

    .sticky-content-wrapper__image-layer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .sticky-content-wrapper__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media screen and (max-width: 1024px) {
      .sticky-content-wrapper__sticky {
        flex-direction: column-reverse;
        justify-content: start;
        padding: 0 5vw;
      }

      .sticky-content-wrapper__panel {
        padding-top: 7%;
        padding-left: 0%;
      }

      .sticky-content-wrapper__left {
        height: 44%;
        width: 100%;
      }

      .sticky-content-wrapper__right {
        height: 37%;
        width: 100%;
        margin-top: 7vh;
        border-radius: 3.5vw;
      }
    }
  `;
  document.head.appendChild(style);
};

export function StickyContentWrapper({
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
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const contentRefs = useRef([]);
  const imageRefs = useRef([]);
  const hasInjected = useRef(false);

  contentRefs.current = [];
  imageRefs.current = [];

  useEffect(() => {
    if (!hasInjected.current) {
      injectStyles();
      hasInjected.current = true;
    }
  }, []);

  const addContentRef = (el) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  const addImageRef = (el) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el);
    }
  };

  useLayoutEffect(() => {
    if (!sectionRef.current || !stickyRef.current || !items.length) return;

    const ctx = gsap.context(() => {
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

      const totalTimelineDuration = Math.max(1, (items.length - 1) * stepGap);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      items.forEach((_, index) => {
        if (index === items.length - 1) return;

        const currentContent = contents[index];
        const nextContent = contents[index + 1];
        const currentImage = images[index];
        const nextImage = images[index + 1];

        const stepStart = index * stepGap;
        const nextContentStart =
          stepStart + contentTransitionDuration + contentDelay;

        tl.to(
          currentContent,
          {
            autoAlpha: 0,
            yPercent: contentExitYPercent,
            duration: contentTransitionDuration,
            ease: "power2.inOut",
          },
          stepStart
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
            nextContentStart
          )
          .to(
            currentImage,
            {
              clipPath: "inset(0% 0% 100% 0%)",
              scale: enableImageScaleFlow ? exitImageScale : 1,
              duration: stepGap,
              ease: "none",
            },
            stepStart
          );

        if (enableImageScaleFlow) {
          tl.to(
            nextImage,
            {
              scale: activeImageScale,
              duration: stepGap,
              ease: "none",
            },
            stepStart
          );
        }
      });

      tl.duration(totalTimelineDuration);

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
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

  if (!items.length) return null;

  return (
    <section
      ref={sectionRef}
      className={`sticky-content-wrapper ${className}`}
      style={{
        height: containerHeight || `${items.length * 100}vh`,
      }}
    >
      <div ref={stickyRef} className="sticky-content-wrapper__sticky">
        <div className={`sticky-content-wrapper__left ${leftClassName}`}>
          {items.map((item, index) => (
            <div
              key={`content-${index}`}
              ref={addContentRef}
              className={`sticky-content-wrapper__panel ${contentClassName}`}
            >
              {item.renderContent ? (
                item.renderContent(item, index)
              ) : (
                <>
                  {item.heading && <h3>{item.heading}</h3>}
                  {item.paragraph && <p>{item.paragraph}</p>}
                </>
              )}
            </div>
          ))}
        </div>

        <div className={`sticky-content-wrapper__right ${rightClassName}`}>
          {items.map((item, index) => (
            <div
              key={`image-${index}`}
              ref={addImageRef}
              className={`sticky-content-wrapper__image-layer ${imageClassName}`}
            >
              {item.renderImage ? (
                item.renderImage(item, index)
              ) : (
                <img
                  src={item.image}
                  alt={item.alt || `sticky-image-${index + 1}`}
                  className="sticky-content-wrapper__image"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StickyContentWrapper;
