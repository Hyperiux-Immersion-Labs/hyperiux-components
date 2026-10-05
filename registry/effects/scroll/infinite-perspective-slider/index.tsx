// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_ROOT_MARGIN = "256px";

type RafRoot = Element | null | { current: Element | null } | (() => Element | null);

function resolveElement(root: RafRoot): Element | null {
  if (!root) return null;
  if (typeof root === "function") return root() ?? null;
  if (typeof root === "object" && "current" in root) return root.current ?? null;
  return root;
}

interface VisibilityGateOptions {
  root?: RafRoot;
  rootMargin?: string;
  threshold?: number;
  observeTab?: boolean;
  observeOffscreen?: boolean;
  onChange?: (active: boolean) => void;
}

interface VisibilityGate {
  readonly isActive: boolean;
  observe: (nextRoot?: RafRoot) => void;
  destroy: () => void;
}

function createVisibilityGate({
  root = null,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = 0,
  observeTab = true,
  observeOffscreen = true,
  onChange,
}: VisibilityGateOptions = {}): VisibilityGate {
  let tabVisible =
    typeof document === "undefined" ? true : !document.hidden;
  // Match border-beam: assume onscreen until the observer reports otherwise.
  let onscreen = true;
  let destroyed = false;
  let observer: IntersectionObserver | null = null;

  const isActive = () => {
    if (destroyed) return false;
    if (observeTab && !tabVisible) return false;
    if (observeOffscreen && resolveElement(root) && !onscreen) return false;
    return true;
  };

  let lastActive = isActive();

  const emit = () => {
    if (destroyed) return;
    const next = isActive();
    if (next === lastActive) return;
    lastActive = next;
    onChange?.(next);
  };

  const onVisibilityChange = () => {
    tabVisible = !document.hidden;
    emit();
  };

  if (observeTab && typeof document !== "undefined") {
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  const bindObserver = () => {
    if (!observeOffscreen || typeof IntersectionObserver === "undefined") {
      return;
    }

    const el = resolveElement(root);
    if (!el) return;

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onscreen = entry.isIntersecting;
        }
        emit();
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
  };

  bindObserver();

  return {
    /** Whether the animation should currently run. */
    get isActive() {
      return isActive();
    },

    /**
     * Re-bind IntersectionObserver after the root element mounts late
     * (e.g. ref not ready on first call). Safe to call multiple times.
     */
    observe(nextRoot?: RafRoot) {
      if (destroyed) return;
      if (nextRoot != null) root = nextRoot;
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      onscreen = true;
      bindObserver();
      emit();
    },

    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (observeTab && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    },
  };
}

interface SuspendedRafOptions {
  onFrame: (time: number) => void;
  root?: RafRoot;
  rootMargin?: string;
  threshold?: number;
  observeTab?: boolean;
  observeOffscreen?: boolean;
}

interface SuspendedRaf {
  start: () => void;
  stop: () => void;
  readonly isRunning: boolean;
  readonly isActive: boolean;
  observe: (nextRoot?: RafRoot) => void;
  destroy: () => void;
}

/**
 * Owns a requestAnimationFrame loop that auto-pauses when the tab is hidden
 * or the root element is offscreen.
 */
function createSuspendedRaf({
  onFrame,
  root = null,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = 0,
  observeTab = true,
  observeOffscreen = true,
}: SuspendedRafOptions): SuspendedRaf {
  if (typeof onFrame !== "function") {
    throw new TypeError("createSuspendedRaf: onFrame is required");
  }

  let rafId: number | null = null;
  let running = false;
  let destroyed = false;

  const stopRaf = () => {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const tick = (time: number) => {
    rafId = null;
    if (destroyed || !running || !gate.isActive) return;
    onFrame(time);
    if (!destroyed && running && gate.isActive) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const sync = () => {
    if (destroyed) return;
    if (running && gate.isActive) {
      if (rafId == null) {
        rafId = requestAnimationFrame(tick);
      }
    } else {
      stopRaf();
    }
  };

  const gate = createVisibilityGate({
    root,
    rootMargin,
    threshold,
    observeTab,
    observeOffscreen,
    onChange: sync,
  });

  return {
    /** Start (or resume) the loop when visibility allows. */
    start() {
      if (destroyed) return;
      running = true;
      sync();
    },

    /** Stop requesting frames (visibility listeners stay attached until destroy). */
    stop() {
      running = false;
      stopRaf();
    },

    /** Whether the caller has started the loop (may still be paused by visibility). */
    get isRunning() {
      return running;
    },

    /** Whether a frame is currently allowed to schedule. */
    get isActive() {
      return gate.isActive;
    },

    /** Re-attach offscreen observer to a (new) root element. */
    observe(nextRoot?: RafRoot) {
      gate.observe(nextRoot);
      sync();
    },

    /** Tear down listeners and cancel any pending frame. */
    destroy() {
      if (destroyed) return;
      destroyed = true;
      running = false;
      stopRaf();
      gate.destroy();
    },
  };
}

export {
  createSuspendedRaf,
  createVisibilityGate,
  DEFAULT_ROOT_MARGIN,
};

gsap.registerPlugin(SplitText);

// True when the user has asked the OS to minimise animation. Safe to call
// during render - returns false on the server.
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

const VELOCITY_LERP = 0.09;

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1025;
const MOBILE_CARD_WIDTH = 240;
const MOBILE_CARD_GAP = 16;
const TABLET_CARD_WIDTH = 380;
const TABLET_CARD_GAP = 20;

const ROTATION_SENSITIVITY = 0.025;
const ROTATION_DAMP = 0.1;
const ROTATION_LERP = 0.12;

const ACTIVE_CONTENT_CLEAR_DELTA = 2;
const SCROLL_STOP_DELAY = 180;

const TEXT_ENTER_DURATION = 0.35;
const TEXT_LEAVE_DURATION = 0.35;
const TEXT_STAGGER = 0.06;
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

interface InfinitePerspectiveSliderCompProps {
  images?: InfinitePerspectiveSliderItem[];
  cardWidth?: number;
  cardGap?: number;
  perspective?: number;
  scrollSpeed?: number;
  scrollLerp?: number;
  maxRotation?: number;
}

export function InfinitePerspectiveSliderComp({
  images = [],
  cardWidth: desktopCardWidth = 320,
  cardGap: desktopCardGap = 24,
  perspective = 2200,
  scrollSpeed = 1,
  scrollLerp = 0.1,
  maxRotation = 80,
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

  const [viewportWidth, setViewportWidth] = useState(desktopCardWidth * 4);

  const isMobileViewport = viewportWidth < MOBILE_BREAKPOINT;
  const isTabletViewport =
    viewportWidth >= MOBILE_BREAKPOINT && viewportWidth < TABLET_BREAKPOINT;

  const cardWidth = isMobileViewport
    ? MOBILE_CARD_WIDTH
    : isTabletViewport
      ? TABLET_CARD_WIDTH
      : desktopCardWidth;

  const cardGap = isMobileViewport
    ? MOBILE_CARD_GAP
    : isTabletViewport
      ? TABLET_CARD_GAP
      : desktopCardGap;

  const cardStep = cardWidth + cardGap;

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
    }, SCROLL_STOP_DELAY);
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
      const centreOffset = centerX - cardWidth / 2;

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
    [cardStep, cardWidth, images]
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
        state.current = lerp(state.current, state.target, scrollLerp);
        state.velocity = state.target - state.current;

        state.smoothVelocity = lerp(
          state.smoothVelocity,
          state.velocity,
          VELOCITY_LERP
        );

        state.rotationVelocity = lerp(
          state.rotationVelocity,
          state.velocity,
          ROTATION_DAMP
        );

        const absVel = Math.abs(state.rotationVelocity);
        const sign = Math.sign(state.rotationVelocity);
        const targetRotation = sign * absVel * ROTATION_SENSITIVITY;

        state.currentRotation = lerp(
          state.currentRotation,
          targetRotation,
          ROTATION_LERP
        );
      }

      const finalRotation = clamp(state.currentRotation, -maxRotation, maxRotation);

      if (Math.abs(state.current - state.target) < 0.05) {
        const shift = Math.round(state.current / loopWidth) * loopWidth;

        state.current -= shift;
        state.target -= shift;
      }

      positionCards(state.current, finalRotation);
    };

    const onWheel = (event: WheelEvent) => {
      // Use whichever axis moved more so trackpads scroll it both ways.
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      if (Math.abs(delta) >= ACTIVE_CONTENT_CLEAR_DELTA) {
        markScrolling();
      }

      state.target += delta * scrollSpeed;
    };

    let lastY = 0;

    const onDown = (clientX: number, clientY = 0) => {
      state.isDragging = true;
      state.lastX = clientX;
      lastY = clientY;
      markScrolling();
    };

    // Horizontal drag, or - on touch - a vertical swipe (scroll gesture).
    // Whichever axis moved more drives the slider.
    const onMove = (clientX: number, clientY?: number) => {
      if (!state.isDragging) return;

      const deltaX = clientX - state.lastX;
      const deltaY = clientY === undefined ? 0 : clientY - lastY;
      const delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;

      state.lastX = clientX;
      if (clientY !== undefined) lastY = clientY;

      if (Math.abs(delta) >= ACTIVE_CONTENT_CLEAR_DELTA) {
        markScrolling();
      }

      state.target += -delta * scrollSpeed;
    };

    const onUp = () => {
      state.isDragging = false;
    };

    const handleMouseDown = (event: MouseEvent) => onDown(event.clientX);
    const handleMouseMove = (event: MouseEvent) => onMove(event.clientX);
    const handleMouseUp = () => onUp();

    const handleTouchStart = (event: TouchEvent) =>
      onDown(event.touches[0].clientX, event.touches[0].clientY);
    const handleTouchMove = (event: TouchEvent) =>
      onMove(event.touches[0].clientX, event.touches[0].clientY);
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
  }, [
    cardStep,
    images,
    positionCards,
    markScrolling,
    scrollSpeed,
    scrollLerp,
    maxRotation,
    isMobileViewport,
    isTabletViewport,
  ]);

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
              duration: TEXT_ENTER_DURATION,
              stagger: TEXT_STAGGER,
            },
            0
          )
          .to(
            [titleLines, descriptionLines],
            {
              yPercent: 0,
              duration: TEXT_ENTER_DURATION,
              stagger: TEXT_STAGGER,
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
              duration: TEXT_LEAVE_DURATION,
              stagger: TEXT_LEAVE_STAGGER,
            },
            0
          )
          .to(
            numberLines,
            {
              yPercent: 100,
              duration: TEXT_LEAVE_DURATION,
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
    <div className="h-screen w-screen overflow-hidden touch-none">
      <div
        className="pointer-events-none relative flex h-full items-center overflow-hidden max-[1025px]:items-center "
        style={{ perspective: `${perspective}px` }}
      >
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
                  width: cardWidth,
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
                  {src ? (
                    <Image
                      fill
                      sizes="(max-width: 640px) 240px, (max-width: 1025px) 380px, 320px"
                      src={src}
                      alt={`slide-${index}`}
                      className="object-cover"
                      draggable={false}
                    />
                  ) : null}
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

      
    </div>
  );
}

export default function InfinitePerspectiveSlider(props: Record<string, unknown>) {
    const images = [
        {
            number: '01',
            src: 'https://picsum.photos/seed/h01/1600/1200',
            title: 'INSPIRE (JAN)',
            desc: 'Exploring nature and calm beginnings',
        },
        {
            number: '02',
            src: 'https://picsum.photos/seed/h02/1600/1200',
            title: 'INSPIRE (FEB)',
            desc: 'Moments of stillness and beauty',
        },
        {
            number: '03',
            src: 'https://picsum.photos/seed/h03/1600/1200',
            title: 'INSPIRE (MAR)',
            desc: 'Textures, light and motion',
        },
        {
            number: '04',
            src: 'https://picsum.photos/seed/h05/1600/1200',
            title: 'INSPIRE (APR)',
            desc: 'Flowing forms and soft tones',
        },
        {
            number: '05',
            src: 'https://picsum.photos/seed/h06/1600/1200',
            title: 'INSPIRE (MAY)',
            desc: 'Warmth, depth and perspective',
        },
        {
            number: '06',
            src: 'https://picsum.photos/seed/h07/1600/1200',
            title: 'INSPIRE (JUNE)',
            desc: 'Energy, waves and movement',
        },
        {
            number: '07',
            src: 'https://picsum.photos/seed/h08/1600/1200',
            title: 'DISTORT',
            desc: 'Abstract visuals and distortion',
        },
        {
            number: '08',
            src: 'https://picsum.photos/seed/h09/1600/1200',
            title: 'FRAME 01',
            desc: 'Captured cinematic frame',
        },
        {
            number: '09',
            src: 'https://picsum.photos/seed/h10/1600/1200',
            title: 'FRAME 02',
            desc: 'Light and contrast study',
        },
        {
            number: '10',
            src: 'https://picsum.photos/seed/h11/1600/1200',
            title: 'FRAME 03',
            desc: 'Minimal composition',
        },
    ];

    return (
        <>
            <div className="bg-white">
                <InfinitePerspectiveSliderComp images={images} {...props} />
            </div>
        </>
    );
}
