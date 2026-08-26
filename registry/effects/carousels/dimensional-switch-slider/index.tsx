// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(CustomEase);
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

type SlideItem = { image: string; text: string };
type CSSLength = string | number;

const R2_BASE = "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images";

const ITEMS: SlideItem[] = [
  { image: `${R2_BASE}/h-06.jpg`, text: "Dimensional Switch" },
  { image: `${R2_BASE}/h-18.jpg`, text: "Hyperiux Vault" },
  { image: `${R2_BASE}/h-20.jpg`, text: "Motion Systems" },
  { image: `${R2_BASE}/h-11.jpg`, text: "Interaction Design" },
  { image: `${R2_BASE}/h-15.jpg`, text: "Source-First" },
];

const DEFAULT_EASE = "cubic-bezier(1, -0.001, 0.159, 0.838)";
const CUBIC_BEZIER_RE = /^cubic-bezier\(\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)$/;
function resolveEase(ease: string): string {
  const match = ease.match(CUBIC_BEZIER_RE);
  if (!match) return ease;

  const id = `ease-${match.slice(1, 5).join("_").replace(/[^\d.-]/g, "n")}`;
  if (!CustomEase.get(id)) {
    CustomEase.create(id, match.slice(1, 5).join(","));
  }
  return id;
}

function toCssLength(value: CSSLength) {
  return typeof value === "number" ? `${value}px` : value;
}

const EASE = "power4.inOut";
const DURATION = 0.9;
const TEXT_TRANSLATE_PERCENT = 40;
const TEXT_ROTATE_DEG = 45;
const OUTGOING_DURATION = DURATION * 0.45;
const VERTICAL_TEXT_TRANSLATE_PERCENT = 40;
const VERTICAL_TEXT_ROTATE_DEG = 45;
const VERTICAL_TEXT_ROTATE_REVERSED = true;
const VERTICAL_TEXT_TRANSLATE_REVERSED = true;
const VERTICAL_OUTGOING_DURATION = DURATION * 0.45;
const TEXT_Z = 60;

export interface DimensionalSwitchSliderProps {
  infinite?: boolean;
  ease?: string;
  textColor?: string;
  cardClassName?: string;
  cardWidth?: CSSLength;
  cardHeight?: CSSLength;
  direction?: "horizontal" | "vertical";
  textSize?: CSSLength;
  cardBorderRadius?: CSSLength;
  autoplay?: boolean;
  autoplayDelay?: number;
}

const DimensionalSwitchSlider = ({
  infinite = true,
  ease = DEFAULT_EASE,
  textColor = "#ffffff",
  cardClassName = "max-md:w-[85vw]! max-md:h-[75vw]! max-[1024px]:w-[85vw]! max-[1024px]:h-[55vw]!",
  cardWidth = 680,
  cardHeight = 460,
  direction = "horizontal",
  textSize = 84,
  cardBorderRadius = 16,
  autoplay = true,
  autoplayDelay = 2600,
}: DimensionalSwitchSliderProps = {}) => {
  const isVertical = direction === "vertical";
  const flipAxis = isVertical ? "rotateX" : "rotateY";
  const flipperRef = useRef<HTMLDivElement>(null);
  const prevTextRef = useRef<HTMLDivElement>(null);
  const nextTextRef = useRef<HTMLDivElement>(null);
  const showingNextRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const rotationRef = useRef(0);
  const resolvedEase = useMemo(() => resolveEase(ease), [ease]);
  const resolvedCardWidth = toCssLength(cardWidth);
  const resolvedCardHeight = toCssLength(cardHeight);
  const resolvedTextSize = toCssLength(textSize);
  const resolvedCardBorderRadius = toCssLength(cardBorderRadius);
  const [frontIndex, setFrontIndex] = useState(0);
  const [backIndex, setBackIndex] = useState(1 % ITEMS.length);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    gsap.set([prevTextRef.current, nextTextRef.current], { z: TEXT_Z });
  }, []);

  
  useEffect(() => {
    gsap.killTweensOf([flipperRef.current, prevTextRef.current, nextTextRef.current]);

    const wasShowingNext = showingNextRef.current;
    rotationRef.current = wasShowingNext ? 180 : 0;
    gsap.set(flipperRef.current, { rotateX: 0, rotateY: 0, [flipAxis]: rotationRef.current });

    const visibleRef = wasShowingNext ? nextTextRef : prevTextRef;
    const hiddenRef = wasShowingNext ? prevTextRef : nextTextRef;
    gsap.set(visibleRef.current, { xPercent: 0, yPercent: 0, rotateX: 0, rotateY: 0, opacity: 1 });
    gsap.set(hiddenRef.current, { xPercent: 0, yPercent: 0, rotateX: 0, rotateY: 0, opacity: 0 });

    isAnimatingRef.current = false;
  }, [direction, flipAxis]);
  const flipTo = useCallback((direction: "prev" | "next", newIndex: number) => {
    const goingNext = direction === "next";
    if (isAnimatingRef.current) return;
    const wasShowingNext = showingNextRef.current;
    flushSync(() => {
      setCurrentIndex(newIndex);
      if (wasShowingNext) {
        setFrontIndex(newIndex);
      } else {
        setBackIndex(newIndex);
      }
    });

    showingNextRef.current = !wasShowingNext;

    const outgoingRef = wasShowingNext ? nextTextRef : prevTextRef;
    const incomingRef = wasShowingNext ? prevTextRef : nextTextRef;
    const flipGoingNext = isVertical ? !goingNext : goingNext;
    rotationRef.current += flipGoingNext ? 180 : -180;
    const rotateValue = rotationRef.current;
    if (prefersReducedMotion()) {
      gsap.set(flipperRef.current, { [flipAxis]: rotateValue });
      gsap.set(outgoingRef.current, {
        xPercent: 0,
        yPercent: 0,
        rotateX: 0,
        rotateY: 0,
        opacity: 0,
      });
      gsap.set(incomingRef.current, {
        xPercent: 0,
        yPercent: 0,
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
      });
      isAnimatingRef.current = false;
      return;
    }

    isAnimatingRef.current = true;

    const tl = gsap.timeline({
      defaults: { duration: DURATION, ease: EASE },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    // Card flip - untouched.
    tl.to(
      flipperRef.current,
      { [flipAxis]: rotateValue, ease: resolvedEase, duration: 0.7 },
      0,
    );
    const textTl = gsap.timeline();

    if (isVertical) {
      const rotateGoingNext = VERTICAL_TEXT_ROTATE_REVERSED ? !goingNext : goingNext;
      const translateGoingNext = VERTICAL_TEXT_TRANSLATE_REVERSED ? !goingNext : goingNext;

      const outgoingEndRotate = rotateGoingNext
        ? VERTICAL_TEXT_ROTATE_DEG
        : -VERTICAL_TEXT_ROTATE_DEG;
      const outgoingEndY = translateGoingNext
        ? -VERTICAL_TEXT_TRANSLATE_PERCENT*2
        : VERTICAL_TEXT_TRANSLATE_PERCENT*2;
      const incomingStartRotate = rotateGoingNext
        ? -VERTICAL_TEXT_ROTATE_DEG
        : VERTICAL_TEXT_ROTATE_DEG;
      const incomingStartY = translateGoingNext
        ? VERTICAL_TEXT_TRANSLATE_PERCENT*2
        : -VERTICAL_TEXT_TRANSLATE_PERCENT*2;

      textTl.to(
        outgoingRef.current,
        {
          yPercent: outgoingEndY,
          rotateX: outgoingEndRotate,
          duration: VERTICAL_OUTGOING_DURATION * 1.5,
          ease: resolvedEase,
        },
        0,
      );
      textTl.to(outgoingRef.current, { opacity: 0, delay: -0.3, duration: 0 });
      textTl.fromTo(
        incomingRef.current,
        { yPercent: incomingStartY, rotateX: incomingStartRotate, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: VERTICAL_OUTGOING_DURATION * 1.5,
          ease: resolvedEase,
        },
        0.15,
      );
    } else {
      const outgoingEndRotate = goingNext ? TEXT_ROTATE_DEG : -TEXT_ROTATE_DEG;
      const outgoingEndX = goingNext
        ? TEXT_TRANSLATE_PERCENT
        : -TEXT_TRANSLATE_PERCENT;
      const incomingStartRotate = goingNext ? -TEXT_ROTATE_DEG : TEXT_ROTATE_DEG;
      const incomingStartX = goingNext
        ? -TEXT_TRANSLATE_PERCENT
        : TEXT_TRANSLATE_PERCENT;

      textTl.to(
        outgoingRef.current,
        {
          xPercent: outgoingEndX,
          rotateY: outgoingEndRotate,
          duration: OUTGOING_DURATION * 1.5,
          ease: resolvedEase,
        },
        0,
      );
      textTl.to(outgoingRef.current, { opacity: 0, delay: -0.3, duration: 0 });
      textTl.fromTo(
        incomingRef.current,
        { xPercent: incomingStartX, rotateY: incomingStartRotate, opacity: 0 },
        {
          xPercent: 0,
          rotateY: 0,
          opacity: 1,
          duration: OUTGOING_DURATION * 1.5,
          ease: resolvedEase,
        },
        0.15,
      );
    }

    tl.add(textTl, 0);
  }, [flipAxis, isVertical, resolvedEase]);
  const switchTo = useCallback((direction: "prev" | "next") => {
    const goingNext = direction === "next";
    const wasShowingNext = showingNextRef.current;
    const currentVisibleIndex = wasShowingNext ? backIndex : frontIndex;
    const rawIndex = currentVisibleIndex + (goingNext ? 1 : -1);
    const newIndex = infinite
      ? ((rawIndex % ITEMS.length) + ITEMS.length) % ITEMS.length
      : rawIndex;

    if (!infinite && (newIndex < 0 || newIndex >= ITEMS.length)) return;

    flipTo(direction, newIndex);
  }, [backIndex, flipTo, frontIndex, infinite]);

  useEffect(() => {
    if (!autoplay || autoplayDelay <= 0 || prefersReducedMotion()) return;

    const intervalId = window.setInterval(() => {
      switchTo("next");
    }, autoplayDelay);

    return () => window.clearInterval(intervalId);
  }, [autoplay, autoplayDelay, switchTo]);
  const goToIndex = useCallback((targetIndex: number) => {
    if (targetIndex === currentIndex) return;

    let direction: "prev" | "next";
    if (infinite) {
      const forwardDistance =
        ((targetIndex - currentIndex) % ITEMS.length + ITEMS.length) %
        ITEMS.length;
      direction = forwardDistance <= ITEMS.length - forwardDistance ? "next" : "prev";
    } else {
      direction = targetIndex > currentIndex ? "next" : "prev";
    }

    flipTo(direction, targetIndex);
  }, [currentIndex, flipTo, infinite]);

  return (
    <>
      <div
        className="flex flex-col items-center justify-center w-full h-full gap-4"
      >
        <div
          className={`dimensional-card relative ${cardClassName}`}
          style={{ perspective: "1000px", width: resolvedCardWidth, height: resolvedCardHeight }}
        >
          <div ref={flipperRef} className="relative h-full w-full transform-3d">
            {/* Front face */}
            <div
              className="absolute inset-0 h-full w-full overflow-hidden backface-hidden prev-card-face"
              style={{ borderRadius: resolvedCardBorderRadius }}
            >
              <Image
                src={ITEMS[frontIndex].image}
                className="w-full h-full object-cover"
                alt={ITEMS[frontIndex].text}
                width={300}
                height={250}
              />
            </div>
            <div
              className={`absolute inset-0 h-full w-full overflow-hidden backface-hidden next-card-face ${
                isVertical ? "rotate-x-180" : "rotate-y-180"
              }`}
              style={{ borderRadius: resolvedCardBorderRadius }}
            >
              <Image
                src={ITEMS[backIndex].image}
                className="w-full h-full object-cover"
                alt={ITEMS[backIndex].text}
                width={300}
                height={250}
              />
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 z-10 flex items-center justify-center w-[60%] h-[25vw] max-md:w-[90%] max-md:h-[100vw] max-[1024px]:w-[90%] max-[1024px]:h-[60vw]  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-md:text-[10vw]! max-[1024px]:text-[8vw]! "
          style={{ perspective: "1000px", fontSize: resolvedTextSize }}
        >
          <div
            ref={prevTextRef}
            className="absolute w-fit text-center font-semibold prev-text"
            style={{ color: textColor }}
          >
            {ITEMS[frontIndex].text}
          </div>
          <div
            ref={nextTextRef}
            className="absolute w-fit text-center font-semibold next-text  opacity-0"
            style={{ color: textColor }}
          >
            {ITEMS[backIndex].text}
          </div>
        </div>

        <div className="flex gap-4 z-10  absolute bottom-8 max-md:bottom-40 max-[1024px]:bottom-32">
          <button
            type="button"
            onClick={() => switchTo("prev")}
            aria-label="Previous"
            disabled={!infinite && currentIndex === 0}
            className="flex h-12 w-12 max-[1024px]:h-20 max-[1024px]:w-20 max-md:h-16 max-md:w-16 items-center justify-center rounded-full border border-white/20 bg-transparent text-white backdrop-blur-[10px] transition-colors duration-300 ease-in-out hover:bg-[#ff5f00] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            onClick={() => switchTo("next")}
            aria-label="Next"
            disabled={!infinite && currentIndex === ITEMS.length - 1}
            className="flex h-12 w-12 max-[1024px]:h-20 max-[1024px]:w-20 max-md:h-16 max-md:w-16 items-center justify-center rounded-full border border-white/20 bg-transparent text-white backdrop-blur-[10px] transition-colors duration-300 ease-in-out hover:bg-[#ff5f00] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <ArrowRight />
          </button>
        </div>

        <div className="flex gap-2 z-10 absolute bottom-30 max-[1024px]:bottom-64">
          {ITEMS.map((item, idx) => (
            <button
              key={item.text}
              type="button"
              onClick={() => goToIndex(idx)}
              aria-label={`Go to ${item.text}`}
              aria-current={idx === currentIndex}
              className={`h-2 max-[1024px]:h-4 max-md:h-3 rounded-full transition-all duration-300 ease-in-out ${
                idx === currentIndex
                  ? "w-6 max-[1024px]:w-8  bg-[#ff5f00]"
                  : "w-2 max-[1024px]:w-4 max-md:w-3 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DimensionalSwitchSlider;
