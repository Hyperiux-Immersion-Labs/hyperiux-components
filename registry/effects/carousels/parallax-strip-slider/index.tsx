// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const STRIP_COUNT = 12;
const REVEAL_DURATION = 0.5;
const STRIP_STAGGER = 0.04;
const ZOOM_DURATION = 0.9;
const ZOOM_FROM = 1.2;
const AUTOPLAY_INTERVAL = 5000;
const TITLE_CHAR_DURATION = 0.6;
const TITLE_CHAR_STAGGER = 0.04;
const TITLE_CHAR_Y_PERCENT = 100;
const PROGRESS_DURATION = 0.9;

type Slide = {
  src: string;
  title: string;
  chapter?: string;
};

type ParallaxStripSliderProps = {
  slides?: Slide[];
  className?: string;
  stripCount?: number;
  revealDuration?: number;
  stripStagger?: number;
  zoomFrom?: number;
  zoomDuration?: number;
  autoplay?: boolean;
  showProgressBar?: boolean;
  showCounter?: boolean;
  showControls?: boolean;
  mobNavButton?: boolean;
  showClue?: boolean;
  clueText?: string;
  accentColor?: string;
};

const DEFAULT_SLIDES: Slide[] = [
  { src: "https://picsum.photos/seed/strip1/1600/1200", title: "Fire", chapter: "Collection 01" },
  { src: "https://picsum.photos/seed/strip2/1600/1200", title: "Allure", chapter: "Collection 02" },
  { src: "https://picsum.photos/seed/strip3/1600/1200", title: "Ember", chapter: "Collection 03" },
];

type TransitionDirection = "next" | "prev";

const readyImages = new Map<string, Promise<void>>();

function preloadImage(src: string): Promise<void> {
  const cached = readyImages.get(src);
  if (cached) return cached;
  const task = new Promise<void>((resolve) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      (img.decode ? img.decode() : Promise.resolve()).then(resolve, resolve);
    };
    img.onerror = () => resolve();
    img.src = src;
  });
  readyImages.set(src, task);
  return task;
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export default function ParallaxStripSlider({
  slides = DEFAULT_SLIDES,
  className = "",
  stripCount = STRIP_COUNT,
  revealDuration = REVEAL_DURATION,
  stripStagger = STRIP_STAGGER,
  zoomFrom = ZOOM_FROM,
  zoomDuration = ZOOM_DURATION,
  autoplay = false,
  showProgressBar = true,
  showCounter = true,
  showControls = true,
  mobNavButton = true,
  showClue = true,
  clueText = "Click either side and watch the next strip cut through.",
  accentColor = "#ffffff",
}: ParallaxStripSliderProps) {
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [caption, setCaption] = useState(0);
  const [direction, setDirection] = useState<TransitionDirection>("next");
  const rootRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const counterNumRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const stripsRef = useRef<(HTMLDivElement | null)[]>([]);
  const zoomRef = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimating = useRef(false);
  const isFirstCaption = useRef(true);
  const splitRef = useRef<SplitText | null>(null);

  const cursorRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const isInside = useRef(false);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  const total = slides.length;
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    slides.forEach((slide) => void preloadImage(slide.src));
    return () => {
      isMounted.current = false;
    };
  }, [slides]);

  const goTo = useCallback(
    (next: number, transitionDirection: TransitionDirection) => {
      if (isAnimating.current || next === current || total < 2) return;
      isAnimating.current = true;
      preloadImage(slides[next].src).then(() => {
        if (!isMounted.current) return;
        setDirection(transitionDirection);
        setIncoming(next);
      });
    },
    [current, total, slides]
  );

  const onNext = useCallback(
    () => goTo((current + 1) % total, "next"),
    [current, total, goTo]
  );
  const onPrev = useCallback(
    () => goTo((current - 1 + total) % total, "prev"),
    [current, total, goTo]
  );

  useEffect(() => {
    if (!autoplay || total < 2) return;
    if (typeof window !== "undefined" && prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (!isAnimating.current) onNext();
    }, AUTOPLAY_INTERVAL);
    return () => window.clearInterval(id);
  }, [autoplay, total, onNext]);

  useLayoutEffect(
    () => {
      if (incoming === null) return;

      const settleState = (withCaption = true) => {
        if (withCaption) setCaption(incoming);
        setCurrent(incoming);
        setIncoming(null);
        isAnimating.current = false;
      };

      const strips = stripsRef.current
        .slice(0, stripCount)
        .filter((el): el is HTMLDivElement => Boolean(el?.isConnected));
      const zooms = zoomRef.current
        .slice(0, stripCount)
        .filter((el): el is HTMLDivElement => Boolean(el?.isConnected));

      if (strips.length < stripCount) {
        settleState();
        return;
      }
      const isPrevious = direction === "prev";
      const orderedStrips = isPrevious ? [...strips].reverse() : strips;

      if (prefersReducedMotion()) {
        settleState();
        return;
      }

      const tl = gsap.timeline({ onComplete: () => settleState(false) });

      tl.fromTo(
        orderedStrips,
        { clipPath: isPrevious ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
        {
          clipPath: isPrevious ? "inset(0 0 0 0%)" : "inset(0 0% 0 0)",
          duration: revealDuration,
          ease: "power3.out",
          stagger: stripStagger,
        },
        0
      );

      tl.fromTo(
        zooms,
        { scale: zoomFrom },
        {
          scale: 1,
          duration: zoomDuration,
          ease: "power3.out",
        },
        0
      );

      if (progressRef.current) {
        tl.to(
          progressRef.current,
          {
            scaleX: (incoming + 1) / total,
            duration: PROGRESS_DURATION,
            ease: "power3.inOut",
          },
          0
        );
      }

      const outgoing = [
        captionRef.current,
        titleRef.current,
        counterRef.current,
      ].filter(Boolean);
      if (outgoing.length) {
        tl.to(
          outgoing,
          {
            autoAlpha: 0,
            y: -2,
            duration: 0.35,
            ease: "power2.in",
          },
          0.15
        );
      }
      tl.add(() => setCaption(incoming), outgoing.length ? 0.5 : 0);

      return () => {
        const wasActive = tl.isActive();
        tl.kill();
        if (wasActive) isAnimating.current = false;
      };
    },
    [incoming, direction, stripCount, revealDuration, stripStagger, zoomFrom, zoomDuration, total]
  );

  useLayoutEffect(() => {
    splitRef.current?.revert();
    splitRef.current = null;
  }, [caption]);

  useLayoutEffect(
    () => {
      if (isFirstCaption.current) {
        isFirstCaption.current = false;
        return;
      }
      if (!captionRef.current || !titleRef.current) return;

      gsap.set([captionRef.current, titleRef.current], { autoAlpha: 1, y: 0 });

      if (prefersReducedMotion()) {
        gsap.set(
          [chapterRef.current, titleRef.current, counterRef.current, counterNumRef.current],
          { autoAlpha: 1, y: 0, yPercent: 0 }
        );
        return;
      }

      const split = new SplitText(titleRef.current, { type: "chars" });
      splitRef.current = split;

      const tl = gsap.timeline({
        onComplete: () => {
          split.revert();
          if (splitRef.current === split) splitRef.current = null;
        },
      });

      tl.from(
        split.chars,
        {
          yPercent: TITLE_CHAR_Y_PERCENT,
          duration: TITLE_CHAR_DURATION,
          ease: "power2.out",
          stagger: TITLE_CHAR_STAGGER,
        },
        0
      );

      if (chapterRef.current) {
        tl.fromTo(
          chapterRef.current,
          { autoAlpha: 0, y: 0 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0
        );
      }

      if (counterRef.current) {
        tl.fromTo(
          counterRef.current,
          { autoAlpha: 0, y: 0 },
          { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
          0
        );
      }
      if (counterNumRef.current) {
        tl.from(
          counterNumRef.current,
          {
            yPercent: 110,
            duration: 0.55,
            ease: "power3.out",
          },
          0
        );
      }

      return () => {
        if (splitRef.current !== split) return;
        tl.kill();
        split.revert();
        splitRef.current = null;
      };
    },
    [caption]
  );

  useEffect(
    () => () => {
      splitRef.current?.revert();
      splitRef.current = null;
    },
    []
  );

  const RIGHT_ARROW_X = -1;

  useEffect(() => {
    if (!showControls) return;
    const cursor = cursorRef.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    if (!cursor || !l1 || !l2) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.6 });
    gsap.set(l1, {
      transformOrigin: "100% 50%",
      xPercent: -50,
      yPercent: -50,
      y: -1.5,
      rotation: 45,
      x: RIGHT_ARROW_X,
    });
    gsap.set(l2, {
      transformOrigin: "100% 50%",
      xPercent: -50,
      yPercent: -50,
      y: 1.5,
      rotation: -45,
      x: RIGHT_ARROW_X,
    });

    let currentSide: "left" | "right" = "right";
    let rafId: number | null = null;

    const handleMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const target = e.target instanceof Element ? e.target : null;
      const isOverControls = Boolean(
        target?.closest(
          'button, input, textarea, select, a, label, [role="button"], [contenteditable="true"], [class*="remixer-panel"]'
        )
      );

      mouse.current.x = x;
      mouse.current.y = y;

      const rect = rootRef.current?.getBoundingClientRect();
      const isOut =
        !rect ||
        x <= rect.left ||
        y <= rect.top ||
        x >= rect.right ||
        y >= rect.bottom;

      if (isOut || isOverControls) {
        if (isInside.current) {
          isInside.current = false;
          gsap.to(cursor, {
            opacity: 0,
            scale: 0.6,
            duration: 0.25,
            ease: "power3.inOut",
          });
        }
        return;
      }

      if (!isInside.current) {
        pos.current.x = x;
        pos.current.y = y;
        gsap.set(cursor, { x, y });
        gsap.to(cursor, {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "power3.out",
        });
        isInside.current = true;
      }

      const isLeft = rect ? x < rect.left + rect.width / 2 : false;
      const nextSide = isLeft ? "left" : "right";

      if (nextSide !== currentSide) {
        currentSide = nextSide;
        if (nextSide === "left") {
          gsap.to(l1, { rotation: 135, x: "-1vw", duration: 0.35, ease: "power3.inOut" });
          gsap.to(l2, { rotation: -135, x: "-1vw", duration: 0.35, ease: "power3.inOut" });
        } else {
          gsap.to(l1, { rotation: 45, x: RIGHT_ARROW_X, duration: 0.35, ease: "power3.inOut" });
          gsap.to(l2, { rotation: -45, x: RIGHT_ARROW_X, duration: 0.35, ease: "power3.inOut" });
        }
      }
    };

    const render = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.12;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.12;
      gsap.set(cursor, { x: pos.current.x, y: pos.current.y });
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMove);
    render();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [showControls]);

  const renderStrips = (slide: Slide) => {
    const width = 100 / stripCount;

    return Array.from({ length: stripCount }, (_, i) => (
      <div
        key={i}
        ref={(el) => {
          stripsRef.current[i] = el;
        }}
        className="absolute inset-y-0 overflow-hidden"
        style={{
          left: `${i * width}%`,
          width: `${width}%`,
          marginLeft: i === 0 ? 0 : "-0.5px",
          paddingLeft: i === 0 ? 0 : "0.5px",
        }}
      >
        <div
          className="absolute inset-y-0"
          style={{
            left: `-${i * 100}%`,
            width: `${stripCount * 100}%`,
          }}
        >
          <div
            ref={(el) => {
              zoomRef.current[i] = el;
            }}
            className="relative h-full w-full will-change-transform"
          >
            <img
              src={slide.src}
              alt="slide images"
              fill
              sizes="100vw"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover select-none"
            />
          </div>
        </div>
      </div>
    ));
  };

  const activeSlide = slides[caption];

  return (
    <div
      ref={rootRef}
      className={`parallax-strip-slider relative h-screen w-full overflow-hidden bg-black ${className}`}
    >
      <div className="absolute inset-0">
        <img
          src={slides[current].src}
          alt={slides[current].title}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover select-none"
        />
      </div>

      {incoming !== null && (
        <div className="absolute inset-0">{renderStrips(slides[incoming])}</div>
      )}

      {showControls && total > 1 && (
        <div
          className="absolute inset-0 z-20"
          style={{ cursor: "none" }}
          onClick={(e) => {
            if (isAnimating.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const isLeft = e.clientX < rect.left + rect.width / 2;
            if (isLeft) onPrev();
            else onNext();
          }}
        />
      )}

      {showProgressBar && (
        <div
          className="pointer-events-none absolute inset-x-10 top-20 z-10 h-px max-lg:top-28"
          style={{ backgroundColor: `${accentColor}33` }}
        >
          <div
            ref={progressRef}
            className="h-full w-full origin-left"
            style={{
              transform: `scaleX(${(caption + 1) / total})`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      )}

      <div
        ref={captionRef}
        className="pointer-events-none absolute inset-x-0 top-0 px-10 pb-10 pt-24 max-lg:pt-32"
      >
        <span
          ref={chapterRef}
          className="block text-xs font-medium tracking-wide"
          style={{ color: accentColor }}
        >
          {activeSlide.chapter ??
            `Collection ${String(caption + 1).padStart(2, "0")}`}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end px-10 pb-10 max-lg:flex-col max-lg:items-stretch max-lg:gap-6 max-lg:pb-36 max-md:pb-32">
        <div className="contents max-lg:order-1 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-6">
          <h2
            ref={titleRef}
            className="pointer-events-none w-1/3 shrink-0 overflow-hidden text-8xl leading-none flex items-end max-lg:w-full max-lg:justify-center max-lg:text-center"
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              color: accentColor,
            }}
          >
            {activeSlide.title}
          </h2>

          {showControls && mobNavButton && total > 1 && (
            <div className="relative z-30 hidden shrink-0 gap-3 max-lg:flex max-md:gap-2">
              {(["prev", "next"] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
                  onClick={dir === "prev" ? onPrev : onNext}
                  className="flex size-18 items-center justify-center rounded-full max-md:size-14"
                  style={{ backgroundColor: accentColor }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-6"
                    aria-hidden="true"
                  >
                    <path d={dir === "prev" ? "M14.5 6l-6 6 6 6" : "M9.5 6l6 6-6 6"} />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        <div aria-hidden className="w-1/3 shrink-0 max-lg:hidden" />

        {showCounter && (
          <span
            ref={counterRef}
            className="pointer-events-none flex w-1/3 pb-5 shrink-0 h-full items-center pt-5! justify-end text-xs max-lg:order-2 max-lg:h-auto max-lg:w-full max-lg:justify-start max-lg:p-0 max-md:order-first max-md:justify-end"
            style={{ color: `${accentColor}b3` }}
          >
            <span className="inline-block w-[2ch] overflow-hidden text-right">
              <span ref={counterNumRef} className="inline-block">
                {String(caption + 1).padStart(2, "0")}
              </span>
            </span>
            <span> / {String(total).padStart(2, "0")}</span>
          </span>
        )}
      </div>

      {showControls && total > 1 && (
        <div
          ref={cursorRef}
          className="pointer-events-none fixed left-0 top-0 z-100 max-lg:hidden"
        >
          <div
            className="flex size-15 items-center justify-center rounded-full"
            style={{ backgroundColor: accentColor }}
          >
            <div className="relative size-7.5">
              <span
                ref={line1Ref}
                className="absolute left-1/2 top-1/2 h-0.5 w-4"
                style={{ backgroundColor: "#000000" }}
              />
              <span
                ref={line2Ref}
                className="absolute left-1/2 top-1/2 h-0.5 w-4"
                style={{ backgroundColor: "#000000" }}
              />
            </div>
          </div>
        </div>
      )}


      {showClue && clueText && total > 1 && (
        <p className="pointer-events-none absolute bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-black/35 px-6 py-3 text-center font-mono text-sm leading-relaxed text-white/80 backdrop-blur-md max-md:bottom-6 max-md:w-[70%] max-md:text-sm max-lg:text-base">
          {clueText}
        </p>
      )}

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap");
      `}</style>
    </div>
  );
}
