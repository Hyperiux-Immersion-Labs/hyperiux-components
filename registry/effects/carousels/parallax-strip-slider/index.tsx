// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

// Animation timing
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
  /** Slides to cycle through. Defaults to a built-in sample set. */
  slides?: Slide[];
  className?: string;
  /** Number of vertical strips in the wipe reveal. */
  stripCount?: number;
  /** Duration of each strip's clip-path wipe, in seconds. */
  revealDuration?: number;
  /** Delay between consecutive strips, in seconds. */
  stripStagger?: number;
  /** Starting scale of the incoming image (Ken-Burns zoom). */
  zoomFrom?: number;
  /** Duration of the image zoom settle, in seconds. */
  zoomDuration?: number;
  /** Auto-advance slides on a timer. */
  autoplay?: boolean;
  /** Show the top progress bar. */
  showProgressBar?: boolean;
  /** Show the numeric slide counter. */
  showCounter?: boolean;
  /** Enable the click-to-navigate overlay and its circular cursor (left half = prev, right half = next). */
  showControls?: boolean;
  /** Show the hint pill telling the viewer to click either side to navigate. */
  showClue?: boolean;
  /** Text shown in the hint pill. */
  clueText?: string;
  /** Color of the progress bar fill, caption text, and control borders. */
  accentColor?: string;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=80",
    title: "Fire",
    chapter: "Collection 01",
  },
  {
    src: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1600&q=80",
    title: "Allure",
    chapter: "Collection 02",
  },
  {
    src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80",
    title: "Ember",
    chapter: "Collection 03",
  },
];

type TransitionDirection = "next" | "prev";

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
  const stripsRef = useRef<HTMLDivElement[]>([]);
  const zoomRef = useRef<HTMLDivElement[]>([]);
  const isAnimating = useRef(false);
  const isFirstCaption = useRef(true);
  const splitRef = useRef<SplitText | null>(null);

  // Circular click-to-navigate cursor.
  const cursorRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const isInside = useRef(false);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  const total = slides.length;

  const goTo = useCallback(
    (next: number, transitionDirection: TransitionDirection) => {
      if (isAnimating.current || next === current || total < 2) return;
      isAnimating.current = true;
      setDirection(transitionDirection);
      setIncoming(next);
    },
    [current, total]
  );

  const onNext = useCallback(
    () => goTo((current + 1) % total, "next"),
    [current, total, goTo]
  );
  const onPrev = useCallback(
    () => goTo((current - 1 + total) % total, "prev"),
    [current, total, goTo]
  );

  // Auto-advance on a timer; pauses while a transition is mid-flight and when
  // reduced motion is requested.
  useEffect(() => {
    if (!autoplay || total < 2) return;
    if (typeof window !== "undefined" && prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (!isAnimating.current) onNext();
    }, AUTOPLAY_INTERVAL);
    return () => window.clearInterval(id);
  }, [autoplay, total, onNext]);

  // Wipe + zoom + progress on slide change.
  useGSAP(
    () => {
      if (incoming === null) return;

      const strips = stripsRef.current.slice(0, stripCount).filter(Boolean);
      const zooms = zoomRef.current.slice(0, stripCount).filter(Boolean);
      if (!strips.length) return;
      const isPrevious = direction === "prev";
      const orderedStrips = isPrevious ? [...strips].reverse() : strips;

      // Reduced motion: swap without the reveal.
      if (prefersReducedMotion()) {
        setCaption(incoming);
        setCurrent(incoming);
        setIncoming(null);
        isAnimating.current = false;
        return;
      }

      const settle = () => {
        setCaption(incoming);
        setCurrent(incoming);
        setIncoming(null);
        isAnimating.current = false;
      };

      const tl = gsap.timeline({ onComplete: settle });

      // Reverse stagger + clip origin when moving backward.
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

      // Bar slides toward the incoming fill.
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

      // Outgoing caption texts fade out under the strips.
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
        tl.add(() => setCaption(incoming), 0.5);
      }
    },
    { dependencies: [incoming, direction, stripCount, revealDuration, stripStagger, zoomFrom, zoomDuration], scope: rootRef }
  );

  // Revert the split before React commits the new title.
  useLayoutEffect(() => {
    splitRef.current?.revert();
    splitRef.current = null;
  }, [caption]);

  // Incoming caption reveal: title chars, chapter fade, counter number.
  useGSAP(
    () => {
      if (isFirstCaption.current) {
        isFirstCaption.current = false;
        return;
      }
      if (!captionRef.current || !titleRef.current) return;

      // Snap back what the outgoing tween hid.
      gsap.set([captionRef.current, titleRef.current], { autoAlpha: 1, y: 0 });

      if (prefersReducedMotion()) {
        gsap.set(
          [chapterRef.current, titleRef.current, counterRef.current, counterNumRef.current],
          { autoAlpha: 1, y: 0, yPercent: 0 }
        );
        return;
      }

      // Chars only — no line/mask wrappers that shift metrics.
      const split = new SplitText(titleRef.current, { type: "chars" });
      splitRef.current = split;

      const tl = gsap.timeline({
        // Restore plain <h2> once the reveal is done.
        onComplete: () => {
          split.revert();
          if (splitRef.current === split) splitRef.current = null;
        },
      });

      // Title: char stagger up from below the clip.
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

      // Chapter: fade only.
      if (chapterRef.current) {
        tl.fromTo(
          chapterRef.current,
          { autoAlpha: 0, y: 0 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0
        );
      }

      // Counter: fade block, lift just the number.
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
    },
    { dependencies: [caption], scope: rootRef }
  );

  // Drop the last live split on unmount.
  useGSAP(
    () => () => {
      splitRef.current?.revert();
      splitRef.current = null;
    },
    { scope: rootRef }
  );

  // Circular cursor: smooth follow + arrow that flips with the pointer side.
  // Mirrors the clip-path-slider interaction (0.12 lerp, power3 eases).
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
      x: 0,
    });
    gsap.set(l2, {
      transformOrigin: "100% 50%",
      xPercent: -50,
      yPercent: -50,
      y: 1.5,
      rotation: -45,
      x: 0,
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
          gsap.to(l1, { rotation: 45, x: 4, duration: 0.35, ease: "power3.inOut" });
          gsap.to(l2, { rotation: -45, x: 4, duration: 0.35, ease: "power3.inOut" });
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
          if (el) stripsRef.current[i] = el;
        }}
        className="absolute inset-y-0 overflow-hidden"
        style={{
          left: `${i * width}%`,
          width: `${width}%`,
          // Cover the seam between neighbours.
          marginLeft: i === 0 ? 0 : "-0.5px",
          paddingLeft: i === 0 ? 0 : "0.5px",
        }}
      >
        {/* Full-width image pulled back by this strip's offset. */}
        <div
          className="absolute inset-y-0"
          style={{
            left: `-${i * 100}%`,
            width: `${stripCount * 100}%`,
          }}
        >
          <div
            ref={(el) => {
              if (el) zoomRef.current[i] = el;
            }}
            className="relative h-full w-full will-change-transform"
          >
            <Image
              src={slide.src}
              alt=""
              fill
              sizes="100vw"
              draggable={false}
              className="object-cover select-none"
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
      className={`parallax-strip-slider relative h-full w-full overflow-hidden bg-black ${className}`}
    >
      {/* Outgoing slide, revealed away underneath. */}
      <div className="absolute inset-0">
        <Image
          src={slides[current].src}
          alt={slides[current].title}
          fill
          priority
          sizes="100vw"
          draggable={false}
          className="object-cover select-none"
        />
      </div>

      {/* Incoming slide, mounted only during a transition. */}
      {incoming !== null && (
        <div className="absolute inset-0">{renderStrips(slides[incoming])}</div>
      )}

      {/* Click-to-navigate overlay: left half steps back, right half advances. */}
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

      {/* Top progress bar, floating over the image. Pushed clear of the fixed
          demo header. */}
      {showProgressBar && (
        <div
          className="pointer-events-none absolute inset-x-10 top-20 z-10 h-px max-[1025px]:top-28"
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

      {/* Top-left label */}
      <div
        ref={captionRef}
        className="pointer-events-none absolute inset-x-0 top-0 px-10 pb-10 pt-24 max-[1025px]:pt-32"
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

      {/* Bottom bar: three fixed thirds on one line; on mobile it stacks with
          the title + counter above and the controls below. */}
      <div className="absolute inset-x-0 bottom-0 flex items-end px-10 pb-10 max-[1025px]:flex-col max-[1025px]:items-stretch max-[1025px]:gap-6 max-md:pb-32">
        <h2
          ref={titleRef}
          className="pointer-events-none w-1/3 shrink-0 overflow-hidden text-8xl leading-none flex items-end max-[1025px]:order-1 max-[1025px]:w-full"
          style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            color: accentColor,
          }}
        >
          {activeSlide.title}
        </h2>

        {/* Middle third keeps its width so the counter stays pinned to the
            right. On mobile the spacer collapses. */}
        <div aria-hidden className="w-1/3 shrink-0 max-[1025px]:hidden" />

        {showCounter && (
          <span
            ref={counterRef}
            className="pointer-events-none flex w-1/3 pb-5 shrink-0 h-full items-center pt-5! justify-end text-xs max-[1025px]:order-2 max-[1025px]:h-auto max-[1025px]:w-full max-[1025px]:justify-start max-[1025px]:p-0 max-md:order-first max-md:justify-end"
            style={{ color: `${accentColor}b3` }}
          >
            {/* Fixed-width clip so the number can lift in without reflow. */}
            <span className="inline-block w-[2ch] overflow-hidden text-right">
              <span ref={counterNumRef} className="inline-block">
                {String(caption + 1).padStart(2, "0")}
              </span>
            </span>
            <span> / {String(total).padStart(2, "0")}</span>
          </span>
        )}
      </div>

      {/* Circular nav cursor — follows the pointer, arrow flips per side. */}
      {showControls && total > 1 && (
        <div
          ref={cursorRef}
          className="pointer-events-none fixed left-0 top-0 z-100 max-[1025px]:hidden"
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
        <p className="pointer-events-none absolute bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-black/35 px-6 py-3 text-center font-mono text-sm leading-relaxed text-white/80 backdrop-blur-md max-md:bottom-6 max-md:w-[70%] max-md:text-sm max-[1025px]:text-base">
          {clueText}
        </p>
      )}

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap");
      `}</style>
    </div>
  );
}
