// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
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
  /** Show the manual prev/next buttons under the title on tablet and mobile. Requires `showControls`. */
  mobNavButton?: boolean;
  /** Show the hint pill telling the viewer to click either side to navigate. */
  showClue?: boolean;
  /** Text shown in the hint pill. */
  clueText?: string;
  /** Color of the progress bar fill, caption text, and control borders. */
  accentColor?: string;
};

const DEFAULT_SLIDES: Slide[] = [
  { src: "https://picsum.photos/seed/strip1/1600/1200", title: "Fire", chapter: "Collection 01" },
  { src: "https://picsum.photos/seed/strip2/1600/1200", title: "Allure", chapter: "Collection 02" },
  { src: "https://picsum.photos/seed/strip3/1600/1200", title: "Ember", chapter: "Collection 03" },
];

type TransitionDirection = "next" | "prev";

// Decoded-image cache so a slide is fully ready before its strips animate in;
// otherwise the wipe plays over empty strips and the picture pops in late, and
// the final swap onto the base layer flashes.
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

  // Circular click-to-navigate cursor.
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
  //
  // Deliberately a plain layout effect, not useGSAP: useGSAP only sets its
  // internal `mounted` flag in a separate mount-only effect, so its very first
  // dependency change still tears down the context it just built - the opening
  // transition would be reverted the instant it was created. We own the
  // timeline and kill it ourselves instead.
  useLayoutEffect(
    () => {
      if (incoming === null) return;

      // The animated path swaps the caption mid-wipe (see tl.add below); this
      // only backstops the paths that never build a timeline.
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

      // Nothing to reveal (refs not mounted, or all stale) - commit the slide
      // anyway so the lock never survives the frame.
      if (strips.length < stripCount) {
        settleState();
        return;
      }
      const isPrevious = direction === "prev";
      const orderedStrips = isPrevious ? [...strips].reverse() : strips;

      // Reduced motion: swap without the reveal.
      if (prefersReducedMotion()) {
        settleState();
        return;
      }

      const tl = gsap.timeline({ onComplete: () => settleState(false) });

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
      }
      // Swap the text while it is hidden under the strips - unconditional, so
      // the caption still advances even if those refs are missing.
      tl.add(() => setCaption(incoming), outgoing.length ? 0.5 : 0);

      // Killing a finished timeline is a no-op; killing one still in flight
      // (a prop changed mid-transition) must also release the lock, or every
      // later click is rejected.
      return () => {
        const wasActive = tl.isActive();
        tl.kill();
        if (wasActive) isAnimating.current = false;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [incoming, direction, stripCount, revealDuration, stripStagger, zoomFrom, zoomDuration, total]
  );

  // Revert the split before React commits the new title.
  useLayoutEffect(() => {
    splitRef.current?.revert();
    splitRef.current = null;
  }, [caption]);

  // Incoming caption reveal: title chars, chapter fade, counter number.
  // Plain layout effect for the same reason as the wipe above - useGSAP would
  // revert this timeline on the first caption change.
  useLayoutEffect(
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

      // Chars only - no line/mask wrappers that shift metrics.
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

      return () => {
        // Only tear down if this split is still the live one - onComplete may
        // already have reverted it and handed splitRef to a newer reveal.
        if (splitRef.current !== split) return;
        tl.kill();
        split.revert();
        splitRef.current = null;
      };
    },
    [caption]
  );

  // Drop the last live split on unmount.
  useEffect(
    () => () => {
      splitRef.current?.revert();
      splitRef.current = null;
    },
    []
  );

  // Pivot of the arrow lines (the chevron's bend) sits 8px right of the circle's
  // centre at x = 0, and the arrow's bounding box is centred at about -2.4.
  // Lower = further left, higher = further right.
  const RIGHT_ARROW_X = -1;

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
              zoomRef.current[i] = el;
            }}
            className="relative h-full w-full will-change-transform"
          >
            <Image
              src={slide.src}
              alt=""
              fill
              sizes="100vw"
              unoptimized
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
      className={`parallax-strip-slider relative h-screen w-full overflow-hidden bg-black ${className}`}
    >
      {/* Outgoing slide, revealed away underneath. */}
      <div className="absolute inset-0">
        <Image
          src={slides[current].src}
          alt={slides[current].title}
          fill
          priority
          unoptimized
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
      <div className="absolute inset-x-0 bottom-0 flex items-end px-10 pb-10 max-[1025px]:flex-col max-[1025px]:items-stretch max-[1025px]:gap-6 max-[1025px]:pb-36 max-md:pb-32">
        {/* Desktop: transparent wrapper (title keeps its third). Tablet and
            mobile: centred title with the manual nav buttons below it. */}
        <div className="contents max-[1025px]:order-1 max-[1025px]:flex max-[1025px]:flex-col max-[1025px]:items-center max-[1025px]:gap-6">
          <h2
            ref={titleRef}
            className="pointer-events-none w-1/3 shrink-0 overflow-hidden text-8xl leading-none flex items-end max-[1025px]:w-full max-[1025px]:justify-center max-[1025px]:text-center"
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              color: accentColor,
            }}
          >
            {activeSlide.title}
          </h2>

          {showControls && mobNavButton && total > 1 && (
            <div className="relative z-30 hidden shrink-0 gap-3 max-[1025px]:flex max-md:gap-2">
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

      {/* Circular nav cursor - follows the pointer, arrow flips per side. */}
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

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap");
      `}</style>
    </div>
  );
}
