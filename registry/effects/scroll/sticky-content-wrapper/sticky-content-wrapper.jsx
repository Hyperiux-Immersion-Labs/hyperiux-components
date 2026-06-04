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

    .sticky-content-wrapper__content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      color: #000;
    }

    .sticky-content-wrapper__heading {
      margin: 0 0 2.5vw;
      font-size: 4vw;
      font-weight: 500;
      line-height: 1;
    }

    .sticky-content-wrapper__paragraph {
      width: 70%;
      margin: 0 0 1vw;
      font-size: 1.2vw;
      line-height: 1.6;
    }

    .sticky-content-wrapper__list {
      display: flex;
      flex-direction: column;
      gap: 0.5vw;
      margin: 0 0 1vw;
      padding: 0;
      list-style: none;
      font-size: 1.05vw;
      opacity: 0.8;
    }

    .sticky-content-wrapper__link {
      width: fit-content;
      margin-top: 1vw;
      color: inherit;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.2vw;
      line-height: 1.2;
      text-decoration: none;
    }

    .sticky-content-wrapper__link-text {
      position: relative;
      display: inline-block;
      width: fit-content;
    }

    .sticky-content-wrapper__link-text::after {
      position: absolute;
      left: 0;
      bottom: -2%;
      height: 1.5px;
      width: 100%;
      background: currentColor;
      content: "";
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.5s cubic-bezier(0.62, 0.05, 0.01, 0.99),
        transform-origin 0.5s cubic-bezier(0.62, 0.05, 0.01, 0.99);
    }

    .sticky-content-wrapper__link:hover .sticky-content-wrapper__link-text::after,
    .sticky-content-wrapper__link:focus-visible .sticky-content-wrapper__link-text::after {
      transform: scaleX(1);
      transform-origin: left;
    }

    .sticky-content-wrapper__link-icon {
      width: 1em;
      height: 1em;
      flex: none;
      transition: transform 0.3s ease;
    }

    .sticky-content-wrapper__link:hover .sticky-content-wrapper__link-icon,
    .sticky-content-wrapper__link:focus-visible .sticky-content-wrapper__link-icon {
      transform: rotate(-45deg);
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

      .sticky-content-wrapper__heading {
        margin-bottom: 4vw;
        font-size: 5.5vw;
      }

      .sticky-content-wrapper__paragraph {
        width: 100%;
        margin-bottom: 3vw;
        font-size: 2.8vw;
      }

      .sticky-content-wrapper__list {
        gap: 1vw;
        margin-bottom: 4vw;
        font-size: 2.5vw;
      }

      .sticky-content-wrapper__link {
        margin-top: 3vw;
        font-size: 2.8vw;
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

    @media screen and (max-width: 640px) {
      .sticky-content-wrapper__panel {
        padding-top: 10%;
      }

      .sticky-content-wrapper__heading {
        font-size: 7.5vw;
      }

      .sticky-content-wrapper__paragraph {
        font-size: 4.5vw;
      }

      .sticky-content-wrapper__list {
        font-size: 4vw;
      }

      .sticky-content-wrapper__link {
        font-size: 4.5vw;
      }
    }
  `;
  document.head.appendChild(style);
};

const getParagraphs = (item) => {
  if (Array.isArray(item.paragraphs)) return item.paragraphs;
  if (Array.isArray(item.paragraph)) return item.paragraph;
  return item.paragraph ? [item.paragraph] : [];
};

const getListItems = (item) => {
  if (Array.isArray(item.list)) return item.list;
  if (Array.isArray(item.listItems)) return item.listItems;
  return [];
};

const getLink = (item) => {
  if (item.link) return item.link;
  if (item.href) {
    return {
      href: item.href,
      text: item.linkText || item.cta || "Learn more",
    };
  }
  return null;
};

const renderStickyContent = (item) => {
  const paragraphs = getParagraphs(item);
  const listItems = getListItems(item);
  const link = getLink(item);

  return (
    <div className="sticky-content-wrapper__content">
      {item.heading && (
        <h3 className="sticky-content-wrapper__heading">{item.heading}</h3>
      )}

      {paragraphs.map((paragraph, paragraphIndex) => (
        <p
          key={`paragraph-${paragraphIndex}`}
          className="sticky-content-wrapper__paragraph"
        >
          {paragraph}
        </p>
      ))}

      {listItems.length > 0 && (
        <ul className="sticky-content-wrapper__list">
          {listItems.map((listItem, listIndex) => (
            <li key={`list-${listIndex}`}>{listItem}</li>
          ))}
        </ul>
      )}

      {link?.href && (
        <a
          href={link.href}
          className={`sticky-content-wrapper__link ${link.className || ""}`}
          target={link.target}
          rel={link.rel || (link.target === "_blank" ? "noreferrer" : undefined)}
        >
          <span className="sticky-content-wrapper__link-text">
            {link.text || link.label || "Learn more"}
          </span>
          <svg
            className="sticky-content-wrapper__link-icon"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M13 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
    </div>
  );
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

  useEffect(() => {
    if (!hasInjected.current) {
      injectStyles();
      hasInjected.current = true;
    }
  }, []);

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
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
              className={`sticky-content-wrapper__panel ${contentClassName}`}
            >
              {renderStickyContent(item)}
            </div>
          ))}
        </div>

        <div className={`sticky-content-wrapper__right ${rightClassName}`}>
          {items.map((item, index) => (
            <div
              key={`image-${index}`}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className={`sticky-content-wrapper__image-layer ${imageClassName}`}
            >
              <img
                src={item.image}
                alt={item.alt || item.imageAlt || `sticky-image-${index + 1}`}
                className="sticky-content-wrapper__image"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
