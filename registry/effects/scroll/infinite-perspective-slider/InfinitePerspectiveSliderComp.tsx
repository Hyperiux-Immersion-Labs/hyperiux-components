"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { createSuspendedRaf } from "./createSuspendedRaf";

gsap.registerPlugin(SplitText);

// True when the user has asked the OS to minimise animation. Safe to call
// during render - returns false on the server.
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

const DEFAULT_CARD_WIDTH = 320;
const DEFAULT_CARD_GAP = 24;
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1025;
const MOBILE_CARD_WIDTH = 240;
const MOBILE_CARD_GAP = 16;
const TABLET_CARD_WIDTH = 380;
const TABLET_CARD_GAP = 20;

const ACTIVE_CONTENT_CLEAR_DELTA = 2;
const TEXT_LEAVE_STAGGER = 0.04;

interface InfinitePerspectiveSliderItemData {
  src?: string;
  number?: string | number;
  title?: string;
  desc?: string;
  description?: string;
}

type InfinitePerspectiveSliderItem = string | InfinitePerspectiveSliderItemData;

const getItemData = (
  item: InfinitePerspectiveSliderItem
): InfinitePerspectiveSliderItemData =>
  typeof item === "string" ? { src: item } : item;

interface CardSetter {
  x: (value: number | string) => void;
  rotateY: (value: number | string) => void;
}

interface SliderConfig {
  cardWidth: number;
  scrollSpeed: number;
  scrollLerp: number;
  velocityLerp: number;
  rotationSensitivity: number;
  rotationDamp: number;
  rotationLerp: number;
  maxRotation: number;
  scrollStopDelay: number;
  textEnterDuration: number;
  textLeaveDuration: number;
  textStagger: number;
}

interface InfinitePerspectiveSliderCompProps {
  images?: InfinitePerspectiveSliderItem[];
  cardWidth?: number;
  cardGap?: number;
  perspective?: number;
  scrollSpeed?: number;
  scrollLerp?: number;
  velocityLerp?: number;
  rotationSensitivity?: number;
  rotationDamp?: number;
  rotationLerp?: number;
  maxRotation?: number;
  scrollStopDelay?: number;
  textEnterDuration?: number;
  textLeaveDuration?: number;
  textStagger?: number;
}

export function InfinitePerspectiveSliderComp({
  images = [],
  cardWidth = DEFAULT_CARD_WIDTH,
  cardGap = DEFAULT_CARD_GAP,
  perspective = 2200,
  scrollSpeed = 1.0,
  scrollLerp = 0.1,
  velocityLerp = 0.09,
  rotationSensitivity = 0.025,
  rotationDamp = 0.1,
  rotationLerp = 0.12,
  maxRotation = 80,
  scrollStopDelay = 180,
  textEnterDuration = 0.35,
  textLeaveDuration = 0.35,
  textStagger = 0.06,
}: InfinitePerspectiveSliderCompProps) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const settersRef = useRef<CardSetter[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeHoverIndexRef = useRef<number | null>(null);
  const hoveredIndexRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  const scrollStopTimerRef = useRef<number | null>(null);

  const leaveHandlersRef = useRef<Record<number, () => void>>({});
  const enterHandlersRef = useRef<Record<number, () => void>>({});

  const [viewportWidth, setViewportWidth] = useState(DEFAULT_CARD_WIDTH * 4);

  const isMobileViewport = viewportWidth < MOBILE_BREAKPOINT;
  const isTabletViewport =
    viewportWidth >= MOBILE_BREAKPOINT && viewportWidth < TABLET_BREAKPOINT;

  const resolvedCardWidth = isMobileViewport
    ? MOBILE_CARD_WIDTH
    : isTabletViewport
      ? TABLET_CARD_WIDTH
      : cardWidth;

  const resolvedCardGap = isMobileViewport
    ? MOBILE_CARD_GAP
    : isTabletViewport
      ? TABLET_CARD_GAP
      : cardGap;

  const cardStep = resolvedCardWidth + resolvedCardGap;

  const cardHeight = isMobileViewport
    ? "calc(40vh + 72px)"
    : isTabletViewport
      ? "calc(45vh + 84px)"
      : "calc(50vh + 96px)";

  const stateRef = useRef({
    current: 0,
    target: 0,
    velocity: 0,
    smoothVelocity: 0,
    rotationVelocity: 0,
    currentRotation: 0,
    prevDirection: 0,
    isDragging: false,
    lastX: 0,
  });
  const configRef = useRef<SliderConfig>({
    cardWidth: resolvedCardWidth,
    scrollSpeed,
    scrollLerp,
    velocityLerp,
    rotationSensitivity,
    rotationDamp,
    rotationLerp,
    maxRotation,
    scrollStopDelay,
    textEnterDuration,
    textLeaveDuration,
    textStagger,
  });

  configRef.current = {
    cardWidth: resolvedCardWidth,
    scrollSpeed,
    scrollLerp,
    velocityLerp,
    rotationSensitivity,
    rotationDamp,
    rotationLerp,
    maxRotation,
    scrollStopDelay,
    textEnterDuration,
    textLeaveDuration,
    textStagger,
  };

  const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const clearActiveContent = useCallback(() => {
    const activeIndex = activeHoverIndexRef.current;

    if (activeIndex === null) return;

    const leaveHandler = leaveHandlersRef.current[activeIndex];

    if (leaveHandler) {
      leaveHandler();
    }

    activeHoverIndexRef.current = null;
  }, []);

  const markScrolling = useCallback(() => {
    isScrollingRef.current = true;
    clearActiveContent();

    if (scrollStopTimerRef.current) {
      window.clearTimeout(scrollStopTimerRef.current);
    }

    scrollStopTimerRef.current = window.setTimeout(() => {
      isScrollingRef.current = false;
      scrollStopTimerRef.current = null;

      const hoveredIndex = hoveredIndexRef.current;

      if (hoveredIndex === null) return;

      const enterHandler = enterHandlersRef.current[hoveredIndex];

      if (enterHandler) {
        enterHandler();
      }
    }, configRef.current.scrollStopDelay);
  }, [clearActiveContent]);

  const initSetters = () => {
    if (!stripRef.current) return;

    settersRef.current = Array.from(stripRef.current.children).map(
      (element) =>
        ({
          x: gsap.quickSetter(element, "x", "px"),
          rotateY: gsap.quickSetter(element, "rotateY", "deg"),
        }) as CardSetter
    );
  };

  const positionCards = useCallback(
    (offset: number, rotation: number) => {
      const strip = stripRef.current;

      if (!strip || !images.length) return;

      const cards = strip.children;
      const setters = settersRef.current;

      const count = images.length;
      const loopWidth = count * cardStep;

      const viewW = window.innerWidth;
      const centerX = viewW / 2;
      const centreOffset = centerX - configRef.current.cardWidth / 2;

      for (let index = 0; index < cards.length; index += 1) {
        let x = index * cardStep - offset + centreOffset;

        x = ((x % loopWidth) + loopWidth) % loopWidth;

        if (x > loopWidth - cardStep) {
          x -= loopWidth;
        }

        setters[index]?.x(x);
        setters[index]?.rotateY(rotation);
      }
    },
    [cardStep, images]
  );

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewport();

    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!images.length) return;

    const state = stateRef.current;
    const loopWidth = images.length * cardStep;
    const reducedMotion = prefersReducedMotion();

    initSetters();

    const tick = () => {
      // Reduced motion: snap straight to the target (no lerp smoothing) and
      // never build up rotation velocity, so cards never tilt while
      // scrolling or dragging - they just track the pointer/wheel directly.
      if (reducedMotion) {
        state.current = state.target;
        state.velocity = 0;
        state.smoothVelocity = 0;
        state.rotationVelocity = 0;
        state.currentRotation = 0;
      } else {
        const config = configRef.current;
        state.current = lerp(state.current, state.target, config.scrollLerp);
        state.velocity = state.target - state.current;

        state.smoothVelocity = lerp(
          state.smoothVelocity,
          state.velocity,
          config.velocityLerp
        );

        state.rotationVelocity = lerp(
          state.rotationVelocity,
          state.velocity,
          config.rotationDamp
        );

        const absVel = Math.abs(state.rotationVelocity);
        const sign = Math.sign(state.rotationVelocity);
        const targetRotation = sign * absVel * config.rotationSensitivity;

        state.currentRotation = lerp(
          state.currentRotation,
          targetRotation,
          config.rotationLerp
        );
      }

      const finalRotation = clamp(state.currentRotation, -configRef.current.maxRotation, configRef.current.maxRotation);

      if (Math.abs(state.current - state.target) < 0.05) {
        const shift = Math.round(state.current / loopWidth) * loopWidth;

        state.current -= shift;
        state.target -= shift;
      }

      positionCards(state.current, finalRotation);
    };

    const onWheel = (event: WheelEvent) => {
      const delta = event.deltaY;

      if (Math.abs(delta) >= ACTIVE_CONTENT_CLEAR_DELTA) {
        markScrolling();
      }

      state.target += delta * configRef.current.scrollSpeed;
    };

    const onDown = (clientX: number) => {
      state.isDragging = true;
      state.lastX = clientX;
      markScrolling();
    };

    const onMove = (clientX: number) => {
      if (!state.isDragging) return;

      const delta = clientX - state.lastX;

      state.lastX = clientX;

      if (Math.abs(delta) >= ACTIVE_CONTENT_CLEAR_DELTA) {
        markScrolling();
      }

      state.target += -delta * configRef.current.scrollSpeed;
    };

    const onUp = () => {
      state.isDragging = false;
    };

    const handleMouseDown = (event: MouseEvent) => onDown(event.clientX);
    const handleMouseMove = (event: MouseEvent) => onMove(event.clientX);
    const handleMouseUp = () => onUp();

    const handleTouchStart = (event: TouchEvent) =>
      onDown(event.touches[0].clientX);
    const handleTouchMove = (event: TouchEvent) =>
      onMove(event.touches[0].clientX);
    const handleTouchEnd = () => onUp();

    const onResize = () => {
      markScrolling();
      initSetters();
      positionCards(state.current, state.currentRotation);
    };

    state.current = 0;
    state.target = 0;
    state.velocity = 0;
    state.smoothVelocity = 0;
    state.rotationVelocity = 0;
    state.currentRotation = 0;
    state.prevDirection = 0;

    activeHoverIndexRef.current = null;
    hoveredIndexRef.current = null;
    isScrollingRef.current = false;

    positionCards(0, 0);
    gsap.set(cardRefs.current, { opacity: 1 });

    const loop = createSuspendedRaf({
      root: stripRef,
      onFrame: tick,
    });
    loop.start();

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      loop.destroy();

      if (scrollStopTimerRef.current) {
        window.clearTimeout(scrollStopTimerRef.current);
      }

      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);

      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [cardStep, images, positionCards, markScrolling]);

  useEffect(() => {
    if (!images.length) return;

    interface AnimationEntry {
      image: HTMLElement;
      handleImageEnter: () => void;
      handleImageLeave: () => void;
      numberSplit: InstanceType<typeof SplitText>;
      titleSplit: InstanceType<typeof SplitText>;
      descriptionSplit: InstanceType<typeof SplitText>;
    }

    const animations: AnimationEntry[] = [];

    leaveHandlersRef.current = {};
    enterHandlersRef.current = {};
    activeHoverIndexRef.current = null;
    hoveredIndexRef.current = null;

    cardRefs.current.forEach((card, index) => {
      const image = imageRefs.current[index];
      const number = numberRefs.current[index];
      const title = titleRefs.current[index];
      const description = descriptionRefs.current[index];

      if (!card || !image || !number || !title || !description) return;

      const numberSplit = SplitText.create(number, {
        type: "lines",
        mask: "lines",
      });

      const titleSplit = SplitText.create(title, {
        type: "lines",
        mask: "lines",
      });

      const descriptionSplit = SplitText.create(description, {
        type: "lines",
        mask: "lines",
      });

      const numberLines = numberSplit.lines;
      const titleLines = titleSplit.lines;
      const descriptionLines = descriptionSplit.lines;

      const allLines = [...numberLines, ...titleLines, ...descriptionLines];

      gsap.set([number, title, description], {
        autoAlpha: 0,
      });

      gsap.set(allLines, {
        yPercent: 100,
      });

      const enter = () => {
        if (isScrollingRef.current) return;

        if (
          activeHoverIndexRef.current !== null &&
          activeHoverIndexRef.current !== index
        ) {
          const previousLeave =
            leaveHandlersRef.current[activeHoverIndexRef.current];

          if (previousLeave) {
            previousLeave();
          }
        }

        activeHoverIndexRef.current = index;

        gsap.killTweensOf(allLines);
        gsap.killTweensOf([number, title, description]);

        gsap
          .timeline({
            defaults: {
              ease: "power3.out",
              overwrite: "auto",
            },
          })
          .set([number, title, description], { autoAlpha: 1 })
          .to(
            numberLines,
            {
              yPercent: 0,
              duration: configRef.current.textEnterDuration,
              stagger: configRef.current.textStagger,
            },
            0
          )
          .to(
            [titleLines, descriptionLines],
            {
              yPercent: 0,
              duration: configRef.current.textEnterDuration,
              stagger: configRef.current.textStagger,
            },
            0.05
          );
      };

      const leave = () => {
        if (activeHoverIndexRef.current === index) {
          activeHoverIndexRef.current = null;
        }

        gsap.killTweensOf(allLines);
        gsap.killTweensOf([number, title, description]);

        gsap
          .timeline({
            defaults: {
              ease: "power3.in",
              overwrite: "auto",
            },
          })
          .to(
            [titleLines, descriptionLines],
            {
              yPercent: 100,
              duration: configRef.current.textLeaveDuration,
              stagger: TEXT_LEAVE_STAGGER,
            },
            0
          )
          .to(
            numberLines,
            {
              yPercent: 100,
              duration: configRef.current.textLeaveDuration,
              stagger: TEXT_LEAVE_STAGGER,
            },
            0.04
          )
          .set([number, title, description], { autoAlpha: 0 });
      };

      const handleImageEnter = () => {
        hoveredIndexRef.current = index;

        if (isScrollingRef.current) return;

        enter();
      };

      const handleImageLeave = () => {
        if (hoveredIndexRef.current === index) {
          hoveredIndexRef.current = null;
        }

        leave();
      };

      enterHandlersRef.current[index] = enter;
      leaveHandlersRef.current[index] = leave;

      image.addEventListener("mouseenter", handleImageEnter);
      image.addEventListener("mouseleave", handleImageLeave);

      animations.push({
        image,
        handleImageEnter,
        handleImageLeave,
        numberSplit,
        titleSplit,
        descriptionSplit,
      });
    });

    return () => {
      animations.forEach(
        ({
          image,
          handleImageEnter,
          handleImageLeave,
          numberSplit,
          titleSplit,
          descriptionSplit,
        }) => {
          image.removeEventListener("mouseenter", handleImageEnter);
          image.removeEventListener("mouseleave", handleImageLeave);

          numberSplit.revert();
          titleSplit.revert();
          descriptionSplit.revert();
        }
      );

      leaveHandlersRef.current = {};
      enterHandlersRef.current = {};
      activeHoverIndexRef.current = null;
      hoveredIndexRef.current = null;
    };
  }, [images]);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="pointer-events-none relative flex h-full items-center overflow-hidden max-[1025px]:items-center" style={{ perspective }}>
        <div
          ref={stripRef}
          className="transform-3d relative w-full"
          style={{ height: cardHeight }}
        >
          {images.map((item, index) => {
            const { src, number, title, desc, description } = getItemData(item);

            return (
              <div
                key={index}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className="pointer-events-auto absolute left-0 top-0 opacity-0 will-change-transform"
                style={{
                  width: resolvedCardWidth,
                  height: cardHeight,
                  transformOrigin: "center center",
                  transform: "translateZ(1px)",
                }}
              >
                <div
                  ref={(element) => {
                    numberRefs.current[index] = element;
                  }}
                  className="mb-2 text-2xl leading-none tracking-tight text-black opacity-0 max-[1025px]:text-xl max-md:mb-1 max-md:text-lg"
                >
                  {number}
                </div>

                <div
                  ref={(element) => {
                    imageRefs.current[index] = element;
                  }}
                  className="relative h-[50vh] w-full overflow-hidden bg-white max-[1025px]:h-[45vh] max-md:h-[40vh]"
                >
                  <img
                    src={src}
                    alt={`slide-${index}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                <div className="mt-2 space-y-1">
                  <div
                    ref={(element) => {
                      titleRefs.current[index] = element;
                    }}
                    className="text-xl uppercase leading-none tracking-[0.04em] text-black opacity-0 max-[1025px]:text-lg max-md:text-base"
                  >
                    {title}
                  </div>

                  <div
                    ref={(element) => {
                      descriptionRefs.current[index] = element;
                    }}
                    className="text-sm leading-none text-black/70 opacity-0 max-[1025px]:text-xs max-md:text-xs"
                  >
                    {desc || description || ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-[5%] left-1/2 flex -translate-x-1/2 flex-col items-center justify-center gap-[1vw] text-black">
        scroll

        <svg
          width="20"
          height="28"
          className="size-[1.5vw] max-[1025px]:size-[3vw] max-md:size-[4vw]"
          viewBox="0 0 20 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            .chev1 { animation: fadeDown 1.4s ease-in-out infinite; }
            .chev2 { animation: fadeDown 1.4s ease-in-out 0.22s infinite; }
            .chev3 { animation: fadeDown 1.4s ease-in-out 0.44s infinite; }

            @keyframes fadeDown {
              0%   { opacity: 0.08; transform: translateY(-3px); }
              50%  { opacity: 0.55; transform: translateY(2px); }
              100% { opacity: 0.08; transform: translateY(-3px); }
            }
          `}</style>

          <polyline
            className="chev1 stroke-current"
            points="2,2 10,9 18,2"
            stroke="white"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polyline
            className="chev2 stroke-current"
            points="2,10 10,17 18,10"
            stroke="white"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polyline
            className="chev3 stroke-current"
            points="2,18 10,25 18,18"
            stroke="white"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
