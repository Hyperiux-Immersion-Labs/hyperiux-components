'use client'
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CornerSVG = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.499951 0.199996L0.499952 9.2M0.199951 0.499995L9.19995 0.499995"
      stroke="currentColor"
    />
  </svg>
);

export default function TextHover({
  data = [],
  bgColor = "#0a0a0a",
  textColor = "#ffffff",
}) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const labelRefs = useRef([]);
  const descriptionRefs = useRef([]);
  const animFrameRef = useRef(null);
  const animStartRef = useRef(null);
  const animateUpdateRef = useRef(null);
  const ANIM_DURATION = 300;

  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [highlight, setHighlight] = useState({ width: 0, height: 0, left: 0, top: 0 });

  // GSAP scroll-triggered entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, {
        opacity: 0,
        y: 80,
      }, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mobile detection
  const getMobile = useCallback(() => window.innerWidth < 768, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const mobile = getMobile();
      setIsMobile(mobile);
      // On mobile we don't use activeIndex for the hover/expand effect
      setActiveIndex(mobile ? null : null);
    });

    const onResize = () => {
      const mobile = getMobile();
      setIsMobile(mobile);
      setActiveIndex(null);
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [getMobile]);

  // Re-measure dimensions during animation transition
  const animateUpdate = useCallback(
    (index) => {
      const content = contentRef.current;
      const el = itemRefs.current[index];
      const label = labelRefs.current[index];
      const description = descriptionRefs.current[index];
      if (!el || !content || !label) return;

      const contentRect = content.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const isMobileViewport = window.innerWidth < 768;
      const framePadding = isMobileViewport ? 40 : 72;
      const minFrameHeight = isMobileViewport ? 56 : 88;
      const descriptionRect = description?.getBoundingClientRect();
      const widestRect =
        !isMobileViewport && descriptionRect && descriptionRect.width > labelRect.width
          ? descriptionRect
          : labelRect;
      const frameWidth = isMobileViewport ? 280 : widestRect.width + framePadding;
      const contentHeight = isMobileViewport ? 0 : Math.max(elRect.height - 120, 0);
      const frameHeight = isMobileViewport ? 116 : Math.max(contentHeight, minFrameHeight);
      const frameLeft = isMobileViewport
        ? elRect.left - contentRect.left + (elRect.width - frameWidth) / 2
        : widestRect.left - contentRect.left - (frameWidth - widestRect.width) / 2;
      const frameTop = isMobileViewport
        ? labelRect.top - contentRect.top - 26
        : elRect.top - contentRect.top + 30 - (frameHeight - contentHeight) / 2;

      setHighlight({
        width: frameWidth,
        height: frameHeight + 60,
        left: frameLeft,
        top: frameTop,
      });

      const elapsed = Date.now() - animStartRef.current;
      if (elapsed < ANIM_DURATION) {
        animFrameRef.current = requestAnimationFrame(() => {
          animateUpdateRef.current?.(index);
        });
      } else {
        animFrameRef.current = null;
      }
    },
    []
  );

  useEffect(() => {
    animateUpdateRef.current = animateUpdate;
  }, [animateUpdate]);

  const setActive = useCallback(
    (index) => {
      setActiveIndex(index);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      setTimeout(() => {
        const el = itemRefs.current[index];
        if (el) {
          animStartRef.current = Date.now();
          animateUpdate(index);
        }
      }, 200);
    },
    [animateUpdate]
  );

  const clearActive = useCallback(() => {
    setActiveIndex(null);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const handleHover = useCallback(
    (index) => {
      if (!isMobile) setActive(index);
    },
    [isMobile, setActive]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) clearActive();
  }, [isMobile, clearActive]);


  return (
    <section
      ref={sectionRef}
      className="relative min-h-dvh py-10 md:py-12 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Ambient background glow — desktop only */}
      <div className="hidden md:block pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-indigo-900/10 blur-[120px]" />
      </div>

      <div
        ref={contentRef}
        className="relative container mx-auto px-6 md:px-4"
        style={{ opacity: 0, transform: "translateY(80px)" }}
      >
        {/* Mobile View */}
        <div className="block md:hidden">
          <ul className="flex flex-col gap-10">
            {data.map((item) => (
              <li key={item.label} className="text-left">
                <h3
                  className="font-mono text-3xl text-center leading-none uppercase tracking-widest mb-3"
                  style={{ color: textColor }}
                >
                  {item.label}
                </h3>
                <p className="text-base text-center text-neutral-400 font-light tracking-wide leading-relaxed">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <ul
            ref={listRef}
            className="relative isolate flex flex-col items-center text-center"
          >
            {data.map((item, i) => {
              const isActive = activeIndex === i;

              return (
                <li
                  key={item.label}
                  ref={(el) => (itemRefs.current[i] = el)}
                  className={[
                    "group w-full px-10 text-center grid",
                    "transition-[padding,grid-template-rows] duration-500",
                    isActive
                      ? "grid-rows-[auto_1fr] py-15"
                      : "grid-rows-[auto_0fr] py-0.5",
                  ].join(" ")}
                  onMouseEnter={() => handleHover(i)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Heading button — two measured copies that slide as one full label */}
                  <button
                    className="relative isolate flex w-full justify-center overflow-hidden cursor-default focus:outline-none"
                    aria-expanded={isActive}
                    aria-controls={`industry-content-${i}`}
                  >
                    <span
                      ref={(el) => (labelRefs.current[i] = el)}
                      className="grid max-w-full text-center"
                    >
                      {/* Resting label */}
                      <h3
                        className={[
                          "col-start-1 row-start-1 font-mono text-6xl leading-none uppercase tracking-widest",
                          "text-neutral-400",
                          "transition-transform duration-500",
                          isActive ? "-translate-y-full" : "translate-y-0",
                        ].join(" ")}
                      >
                        {item.label}
                      </h3>
                      {/* Active (bright) duplicate, slides up from below */}
                      <span
                        aria-hidden="true"
                        className={[
                          "col-start-1 row-start-1 font-mono text-6xl leading-none uppercase tracking-widest",
                          "transition-transform duration-500",
                          isActive ? "translate-y-0" : "translate-y-full",
                        ].join(" ")}
                        style={{ color: textColor }}
                      >
                        {item.label}
                      </span>
                    </span>
                  </button>

                  {/* Expandable description */}
                  <div
                    id={`industry-content-${i}`}
                    className="flex justify-center overflow-hidden"
                  >
                    <p
                      ref={(el) => (descriptionRefs.current[i] = el)}
                      className="text-base text-neutral-400 max-w-107.5 pt-1 font-light tracking-wide"
                    >
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Corner-bracket highlight overlay — tracks active item */}
          <div
            className={[
              "pointer-events-none absolute top-0 left-0",
              "transition-[width,left,top,height,opacity,transform,filter] duration-500",
            ].join(" ")}
            style={{
              width: highlight.width,
              height: highlight.height,
              left: highlight.left,
              top: highlight.top,
              opacity: activeIndex !== null ? 1 : 0,
              transform: activeIndex !== null ? "scale(1)" : "scale(2)",
              filter: activeIndex !== null ? "blur(0px)" : "blur(10px)",
            }}
          >
            <CornerSVG
              className="absolute top-0 left-0 size-8 opacity-70"
              style={{ color: textColor }}
            />
            <CornerSVG
              className="absolute top-0 right-0 size-8 rotate-90 opacity-70"
              style={{ color: textColor }}
            />
            <CornerSVG
              className="absolute bottom-3 left-0 size-8 opacity-70 -rotate-90"
              style={{ color: textColor }}
            />
            <CornerSVG
              className="absolute bottom-3 right-0 size-8 opacity-70 rotate-180"
              style={{ color: textColor }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
