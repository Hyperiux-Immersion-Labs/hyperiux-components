// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";
import Image from "next/image";
import {
  type CSSProperties,
  useRef,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
} as const;

type Month = keyof typeof monthOrder;

type JourneyItem = {
  id: string;
  year: string;
  month: Month;
  content: string;
};

type SplitTextInstance = InstanceType<typeof SplitText>;

type TimelineProps = {
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
};

// Base timing (seconds) for the item reveals and the smooth-scroll feel.
const ANIMATION_DURATION = 1.2;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);

  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

const topJourneyData: JourneyItem[] = [
  {
    id: "2020-march",
    year: "2020",
    month: "March",
    content: "Signal research turns scattered notes into a clear product thesis",
  },
  {
    id: "2021-july",
    year: "2021",
    month: "July",
    content: "Founding release ships with the first live customer journeys",
  },
  {
    id: "2023-april",
    year: "2023",
    month: "April",
    content: "Automation layer connects insight, publishing, and sales motion",
  },
  {
    id: "2026-may",
    year: "2026",
    month: "May",
    content: "New markets open with localized launches and faster onboarding",
  },
];

const bottomJourneyData: JourneyItem[] = [
  {
    id: "2020-november",
    year: "2020",
    month: "November",
    content: "Prototype sprint validates the experience with real operators",
  },
  {
    id: "2022-october",
    year: "2022",
    month: "October",
    content: "Community feedback reshapes the roadmap into sharper releases",
  },
  {
    id: "2025-september",
    year: "2025",
    month: "September",
    content: "Companion mobile workflows make the timeline travel-ready",
  },
];

const allJourneyItems: JourneyItem[] = [
  ...topJourneyData,
  ...bottomJourneyData,
].sort((a, b) => {
  const yearDiff = Number(a.year) - Number(b.year);
  if (yearDiff !== 0) return yearDiff;
  return monthOrder[a.month] - monthOrder[b.month];
});

export default function Timeline({
  title = "Product Storyline",
  periodLabel = "2020-2026",
  textColor = "#000000",
  mutedTextColor = "#3f3f46",
  activeColor = "#ff5f00",
  backgroundColor = "#ffffff",
  imageUrl = "https://picsum.photos/1600/900",
  imageAlt = "Modern office workspace",

}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);
  // Scroll trigger + target width of the horizontal line, shared with the
  // per-item timelines so they can start when the line's head reaches them.
  const lineProgressRef = useRef<{
    trigger: ScrollTrigger;
    widthFraction: number;
    slideTrigger?: ScrollTrigger;
    slidePercent: number;
  } | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const sectionStyle = {
    color: textColor,
    backgroundColor,
  } satisfies CSSProperties;
  const activeStyle = {
    backgroundColor: activeColor,
  } satisfies CSSProperties;
  const mutedTextStyle = {
    color: mutedTextColor,
  } satisfies CSSProperties;

  useGSAP(() => {
    const section = sectionRef.current;

    if (!section) return;

    const isTablet = window.innerWidth >= 642 && window.innerWidth <= 1024;
    const isMobile = window.innerWidth < 642;
    const slidePercent = isTablet ? -60 : isMobile ? -57 : -65;
    const lineWidth = isTablet ? "75%" : isMobile ? "65%" : "98%";
    const lineStart = isTablet ? "top 10%" : isMobile ? "top top" : "top top";
    const slideEnd = isMobile ? "82% 50%" : "92% bottom";
    const lineEnd = isMobile ? "80% 50%" : isTablet ? "90% bottom" : "92% bottom";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "2% top",
        end: slideEnd,
        scrub: true,
      },
      defaults: {
        ease: "none",
      },
    });

    tl.fromTo(
      wholeSliderRef.current,
      { xPercent: 0 },
      { xPercent: slidePercent },
    );

    if (reducedMotion) {
      gsap.set(".journey-line", { width: lineWidth });
      return;
    }

    const lineTween = gsap.to(".journey-line", {
      width: lineWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: lineStart,
        end: lineEnd,
        scrub: true,
      },
    });

    if (lineTween.scrollTrigger) {
      lineProgressRef.current = {
        trigger: lineTween.scrollTrigger,
        widthFraction: parseFloat(lineWidth) / 100,
        slideTrigger: tl.scrollTrigger,
        slidePercent,
      };
    }

    return () => {
      lineProgressRef.current = null;
    };
  }, { dependencies: [reducedMotion], scope: sectionRef });

  useGSAP(() => {
    const section = sectionRef.current;

    if (!section) return;

    const items = allJourneyItems;

    if (reducedMotion) {
      items.forEach((item) => {
        gsap.set(`.jl-${item.id}`, { scaleY: 1 });
        gsap.set(`.jd-${item.id}`, { scale: 1 });
        gsap.set(`.title-${item.id}`, { opacity: 1, clearProps: "transform" });
        gsap.set(`.description-${item.id}`, {
          opacity: 1,
          clearProps: "transform",
        });
      });
      return;
    }

    items.forEach((item) => {
      gsap.set(`.jl-${item.id}`, {
        scaleY: 0,
        transformOrigin: "bottom bottom",
      });
      gsap.set(`.jd-${item.id}`, { scale: 0 });
      gsap.set(`.title-${item.id}`, { opacity: 1 });
      gsap.set(`.description-${item.id}`, { opacity: 1 });
    });

    const titleSplits: Partial<Record<string, SplitTextInstance>> = {};
    const descriptionSplits: Partial<Record<string, SplitTextInstance>> = {};

    items.forEach((item) => {
      titleSplits[item.id] = new SplitText(`.title-${item.id}`, {
        type: "chars, words, lines",
        mask: "lines",
      });

      descriptionSplits[item.id] = new SplitText(`.description-${item.id}`, {
        type: "chars, words, lines",
        mask: "lines",
      });
    });

    // Scroll progress (0-1 of the horizontal line's draw) at which the line's
    // head reaches this item's vertical line, measured from real layout so it
    // holds at every breakpoint. Slider-relative coords cancel out the
    // slider's own horizontal scroll transform.
    const getLineProgressAtItem = (item: JourneyItem) => {
      const slider = wholeSliderRef.current;
      const lineEl = section.querySelector<HTMLElement>(".journey-line");
      const itemLineEl = section.querySelector<HTMLElement>(`.jl-${item.id}`);
      const lineInfo = lineProgressRef.current;

      if (!slider || !lineEl || !itemLineEl || !lineInfo) return 0;

      const sliderLeft = slider.getBoundingClientRect().left;
      const lineLeft = lineEl.getBoundingClientRect().left - sliderLeft;
      const itemLeft = itemLineEl.getBoundingClientRect().left - sliderLeft;
      const lineMaxWidth =
        (lineEl.parentElement?.clientWidth ?? 0) * lineInfo.widthFraction;

      if (lineMaxWidth <= 0) return 0;

      return gsap.utils.clamp(0, 1, (itemLeft - lineLeft) / lineMaxWidth);
    };

    // Share of the horizontal line's scroll range each item's own sequence
    // (vertical line -> dot -> text) takes up.
    const ITEM_SPAN = 0.14;
    // Max sideways drift (as a share of viewport width) during one item.
    const MAX_ITEM_DRIFT = window.innerWidth < 642 ? 0.2 : 0.35;

    const createItemTimeline = (item: JourneyItem) => {
      const lineSelector = `.jl-${item.id}`;
      const dotSelector = `.jd-${item.id}`;
      const titleLines = titleSplits[item.id]?.lines || [];
      const descriptionLines = descriptionSplits[item.id]?.lines || [];

      const isTop = topJourneyData.some((topItem) => topItem.id === item.id);

      if (!isTop) {
        gsap.set(lineSelector, { transformOrigin: "top top" });
      }

      const getRange = () => {
        const lineTrigger = lineProgressRef.current?.trigger;
        const lineStartPx = lineTrigger?.start ?? 0;
        const lineRange = (lineTrigger?.end ?? 0) - lineStartPx;
        let span = lineRange * ITEM_SPAN;

        // The slider keeps scrolling sideways while an item plays. Cap the
        // span so the item never drifts more than ~a third of the viewport
        // (matters on mobile, where the slider moves much faster) before its
        // text has finished revealing.
        const slideTrigger = lineProgressRef.current?.slideTrigger;
        const slideScrollRange = slideTrigger
          ? slideTrigger.end - slideTrigger.start
          : 0;
        const sliderWidth = wholeSliderRef.current?.offsetWidth ?? 0;
        const slidePxPerScrollPx =
          slideScrollRange > 0
            ? (Math.abs(lineProgressRef.current?.slidePercent ?? 0) / 100) *
              sliderWidth /
              slideScrollRange
            : 0;

        if (slidePxPerScrollPx > 0) {
          span = Math.min(
            span,
            (window.innerWidth * MAX_ITEM_DRIFT) / slidePxPerScrollPx,
          );
        }

        const start = Math.min(
          lineStartPx + getLineProgressAtItem(item) * lineRange,
          lineStartPx + lineRange - span,
        );

        return { start, end: start + span };
      };

      gsap.set([...titleLines, ...descriptionLines], { y: 100 });

      // Sequenced: vertical line draws first, then its dot, then the text.
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => getRange().start,
          end: () => getRange().end,
          // start/end are functions, so ScrollTrigger re-evaluates them on
          // every refresh (no invalidateOnRefresh, which would reset the
          // text lines' starting offset and leave them visible).
          scrub: true,
        },
      });

      timeline
        .to(lineSelector, {
          scaleY: 1,
          duration: ANIMATION_DURATION * 0.4,
        })
        .to(dotSelector, {
          scale: 1,
          duration: ANIMATION_DURATION * 0.15,
        })
        .fromTo(
          titleLines,
          { y: 100 },
          {
            y: 0,
            duration: ANIMATION_DURATION * 0.6,
            stagger: 0.02,
            ease: "power2.out",
          },
          ">-0.05",
        )
        .fromTo(
          descriptionLines,
          { y: 100 },
          {
            y: 0,
            duration: ANIMATION_DURATION * 0.6,
            stagger: 0.02,
            ease: "power2.out",
          },
          "<",
        );

      return timeline;
    };

    items.forEach((item) => {
      createItemTimeline(item);
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      Object.values(titleSplits).forEach((split) => split?.revert?.());
      Object.values(descriptionSplits).forEach((split) => split?.revert?.());
      window.removeEventListener("resize", handleResize);
    };
  }, { dependencies: [reducedMotion], scope: sectionRef });

  const content = (
    <section
      ref={sectionRef}
      id="journey"
      className="h-[200vw] max-[1025px]:h-[400vh] max-md:h-[400vh] w-full relative max-[1025px]:py-[7%]"
      style={sectionStyle}
    >
      <div className="h-screen w-screen flex items-center sticky top-0 pt-[5%] overflow-hidden max-[1025px]:block max-[1025px]:top-[10%] max-md:top-[5%] ">
        <div
          ref={wholeSliderRef}
          className="mr-[2vw] flex h-[30vw] w-[240vw] items-center gap-[5vw] px-[5vw] max-[1025px]:h-[70vh] max-[1025px]:w-[400vw] max-[1025px]:flex-col max-[1025px]:items-start max-[1025px]:gap-[2vw] max-[1025px]:px-[5vw] max-md:h-[80vh] max-md:w-[800vw] max-md:px-[7vw]"
        >
          <div className="relative h-full w-[30vw] overflow-hidden rounded-[1vw] max-[1025px]:h-[40vw] max-[1025px]:w-[15%] max-[1025px]:rounded-[3vw] max-md:h-[65vw] max-md:w-[85vw] max-md:rounded-[5vw]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={900}
              height={900}
              sizes="(max-width: 642px) 85vw, (max-width: 1025px) 40vw, 30vw"
              quality={90}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative h-full w-full  max-[1025px]:h-[50%]">
            <div className="w-full absolute left-0 top-[49%] tranlate-y-[-50%] flex items-center h-fit">
              <div
                className="h-[.8vw] w-[.8vw] shrink-0 rounded-full max-md:h-[2vw] max-md:w-[2vw] max-[1025px]:h-[1.5vw] max-[1025px]:w-[1.5vw]"
                style={activeStyle}
              ></div>
              <div
                className="-mx-[.4vw] h-px w-[0%] rounded-full journey-line max-md:-mx-[1.5vw] max-[1025px]:-mx-[1.125vw]"
                style={activeStyle}
              ></div>
              <div
                className="h-[.8vw] w-[.8vw] shrink-0 rounded-full max-md:h-[2vw] max-md:w-[2vw] max-[1025px]:h-[1.5vw] max-[1025px]:w-[1.5vw]"
                style={activeStyle}
              ></div>
            </div>

            <div className="flex h-1/2 w-full items-center justify-start gap-[.5vw]">
              <div className="h-full w-[20%] pt-[2vw] max-md:h-fit max-md:pt-[5vw]">
                <h2 className="w-[65%]  text-[3vw] leading-[0.95] max-[1025px]:w-[75%] max-[1025px]:text-[7vw] max-md:text-[8.5vw]">
                  {title}
                </h2>
              </div>

              <div className="w-full flex h-full gap-x-[15vw] max-md:gap-x-[40vw]">
                {topJourneyData.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative h-full w-[30vw] px-[3vw]  max-[1025px]:w-[50vw] max-[1025px]:px-[5vw] max-md:flex max-md:w-[70vw] max-md:flex-col max-md:px-[7vw]"
                  >
                    <div className="w-full absolute left-0 bottom-0 top-0 h-full max-[1025px]:top-[1%] max-md:top-0 max-[1025px]:flex max-[1025px]:flex-col max-md:block">
                      <div
                        className={`size-[1vw] max-md:size-[2.5vw] max-[1025px]:size-[2vw] max-[1025px]:shrink-0 translate-x-[-50%] relative aspect-square rounded-full jd-${item.id}`}
                        style={activeStyle}
                      ></div>
                      <div
                        className={`h-[94%] w-px origin-bottom rounded-full max-[1025px]:h-auto max-[1025px]:min-h-0 max-[1025px]:flex-1 max-md:h-[94%] max-md:flex-none jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    <div className="mt-[-1vw] space-y-[1vw] max-[1025px]:mt-[-1.5vw] max-md:mt-[-2vw]">
                      <h4
                        className={`title-${item.id}  text-[2.5vw] leading-none max-[1025px]:text-[5vw] max-md:text-[6.4vw]`}
                      >
                        {item.year} {item.month}
                      </h4>
                      <p
                        className={`description-${item.id} w-[90%] text-[1.5vw] leading-[1.15] max-[1025px]:w-[70%] max-[1025px]:text-[3.2vw] max-md:w-[90%] max-md:text-[4.8vw]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-1/2 flex items-center justify-start w-full">
              <div className="w-[34%] pt-[2vw] max-md:pt-[5vw] max-md:w-[30%] h-full max-[1025px]:pt-[5vw]">
                <p
                  className=" text-[1.65vw] leading-none max-[1025px]:text-[3vw] max-md:text-[4.2vw]"
                  style={mutedTextStyle}
                >
                  {periodLabel}
                </p>
              </div>

              <div className="w-full flex h-full gap-x-[20vw] ml-[7vw] max-md:gap-x-[40vw] max-[1025px]:ml-0 max-md:ml-[7vw]">
                {bottomJourneyData.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className="relative h-full w-[25vw] px-[3vw]  max-[1025px]:flex max-[1025px]:w-[20%] max-[1025px]:flex-col max-[1025px]:justify-center max-[1025px]:px-[5vw] max-md:w-[70vw] max-md:px-[7vw]"
                  >
                    <div className="w-full absolute left-0 bottom-[-1%] h-full max-[1025px]:flex max-[1025px]:flex-col max-md:block">
                      <div
                        className={`h-[94%] origin-top w-px rounded-full max-[1025px]:h-auto max-[1025px]:min-h-0 max-[1025px]:flex-1 max-md:h-full max-md:flex-none jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                      <div
                        className={`size-[1vw] max-md:size-[2.5vw] max-[1025px]:size-[2vw] max-[1025px]:shrink-0 translate-x-[-50%] relative w-auto aspect-square rounded-full jd-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    <div className="flex h-full w-full flex-col justify-end space-y-[1vw]">
                      <h4
                        className={`title-${item.id}  text-[2.5vw] leading-none max-[1025px]:text-[5vw] max-md:text-[6.4vw]`}
                      >
                        {item.year} {item.month}
                      </h4>
                      <p
                        className={`description-${item.id} w-[90%] text-[1.5vw] leading-[1.15] max-[1025px]:w-[70%] max-[1025px]:text-[3.2vw] max-md:w-[90%] max-md:text-[4.8vw]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <ReactLenis
      root
      options={{
        duration: reducedMotion
          ? Math.min(ANIMATION_DURATION, 0.6)
          : ANIMATION_DURATION,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1,
        wheelMultiplier: 1,
      }}
    >
      {content}
    </ReactLenis>
  );
}
