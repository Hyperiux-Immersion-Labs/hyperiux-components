// Built using Hyperiux Vault: https://vault.hyperiux.com
'use client'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/dist/Flip";
import { SplitText } from "gsap/dist/SplitText";
import Image from "next/image";

gsap.registerPlugin(Flip, SplitText);

export interface GsapFlipCardItem {
  id?: string | number;
  image: string;
  alt?: string;
  caption?: string;
  title?: string;
  meta?: string;
  description?: string;
}

export interface GsapFlipCardProps {
  items?: GsapFlipCardItem[];
  title?: string;
  meta?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  mutedColor?: string;
  rounded?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  thumbGap?: number;
  heroWidth?: number;
  heroHeight?: number;
  duration?: number;
  ease?: string;
  stackOffsetX?: number;
  stackOffsetY?: number;
  stackRotation?: number;
  showCounter?: boolean;
  captionLines?: number;
  captionFadeDuration?: number;
  captionRevealDuration?: number;
  captionLineStagger?: number;
  onClose?: () => void;
  className?: string;
}



const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    prefersReducedMotion,
    getServerReducedMotionSnapshot
  );
}


const CAPTION_FONT_VW = 1;
const CAPTION_LINE_RATIO = 1.3;
const CAPTION_LINE_VW = CAPTION_FONT_VW * CAPTION_LINE_RATIO;
const CAPTION_MOBILE_LINE_RATIO = 1.5;
const CAPTION_MOBILE_LINE = `${3 * CAPTION_MOBILE_LINE_RATIO}vw`;
const CAPTION_MOBILE_LINE_SM = `${4 * CAPTION_MOBILE_LINE_RATIO}vw`;

const IMAGE_BASE =
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/gsap-flip-card";

const defaultItems: GsapFlipCardItem[] = [
  {
    id: 0,
    image: `${IMAGE_BASE}/img01.png`,
    title: "The Backhand",
    meta: "Tennis / Studio Studies / 01",
    description: "A backhand cuts across a field of red. The player holds the frame in tension, turning a split-second swing into a study of balance, timing, and control.",
    alt: 'Tennis player mid-backhand against a red studio backdrop',
    caption: 'The racquet blurs through the frame while the ball hangs still.',
  },
  {
    id: 1,
    image: `${IMAGE_BASE}/img02.png`,
    title: "Nothing but Net",
    meta: "Basketball / Court Details / 02",
    description: "An orange rim stands sharp against deep blue. The ball meets the net at the tipping point between anticipation and release, with the whole game distilled into one detail.",
    alt: 'Basketball dropping through an orange rim on a deep blue background',
    caption: 'Caught at the rim, one beat before the net gives way.',
  },
  {
    id: 2,
    image: `${IMAGE_BASE}/img03.png`,
    title: "Above Ground",
    meta: "Running / Motion Studies / 03",
    description: "Seen from below, a runner stretches across an open sky. With the ground out of sight, each stride becomes a brief moment of flight, all reach, rhythm, and forward drive.",
    alt: 'Runner suspended mid-stride against a clear blue sky',
    caption: 'Shot from below, mid-stride, with nothing but sky behind.',
  },
  {
    id: 3,
    image: `${IMAGE_BASE}/img04.png`,
    title: "A Different Gear",
    meta: "Cycling / Style in Sport / 04",
    description: "A black suit and a road bike share an acid-green stage. Precise tailoring meets the clean geometry of carbon, bringing the poise of a fashion portrait to the world of cycling.",
    alt: 'Cyclist in a black suit holding a road bike against a lime backdrop',
    caption: 'Tailoring and carbon on acid green, staged like a portrait.',
  },
  {
    id: 4,
    image: `${IMAGE_BASE}/img05.png`,
    title: "After Hours",
    meta: "Eyewear / Athlete Portraits / 05",
    description: "White shield lenses emerge from the shadows. A narrow band of light traces the athlete’s profile, drawing attention to the sculpted eyewear and the quiet focus behind it.",
    alt: 'Profile of an athlete wearing white shield sunglasses in low light',
    caption: 'A hard side light picks out the visor and leaves the rest dark.',
  },
];


const GsapFlipCard = ({
  items = defaultItems,
  title = "GSAP Flip Card",
  meta = "Hyperiux Vault / GSAP Flip / React",
  description = "A pile of cards that fans into a hero and a rail. Tap any frame and the two trade places, same nodes, measured and tweened, never re-mounted.",
  backgroundColor = "#e9e9e7",
  textColor = "#111111",
  mutedColor = "#8a8a86",
  rounded = 20,
  thumbWidth = 108,
  thumbHeight = 120,
  thumbGap = 12,
  heroWidth = 530,
  heroHeight = 670,
  duration = 0.7,
  ease = "power3.inOut",
  stackOffsetX = 3,
  stackOffsetY = 9,
  stackRotation = 0,
  showCounter = true,
  captionLines = 2,
  captionFadeDuration = 0.25,
  captionRevealDuration = 0.55,
  captionLineStagger = 0.07,
  onClose,
  className = "",
}: GsapFlipCardProps) => {
  const reducedMotion = usePrefersReducedMotion();

  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));
  const [opened, setOpened] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Map<number, HTMLElement>>(new Map());
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const isAnimatingRef = useRef(false);

  const selectedItem = items[order[0]];
  const nextContent = useMemo(() => ({
    title: selectedItem?.title ?? title,
    meta: selectedItem?.meta ?? meta,
    description: selectedItem?.description ?? description,
    caption: selectedItem?.caption,
  }), [selectedItem, title, meta, description]);
  const [shownContent, setShownContent] = useState(nextContent);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const captionTweenRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);
  const captionSplitRef = useRef<SplitText | null>(null);

  const revertCaptionSplit = useCallback(() => {
    captionSplitRef.current?.revert();
    captionSplitRef.current = null;
  }, []);

  const [previousItems, setPreviousItems] = useState(items);
  if (items !== previousItems) {
    setPreviousItems(items);
    setOrder(items.map((_, i) => i));
  }

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setStageWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const registerCard = useCallback((index: number, node: HTMLElement | null) => {
    if (node) cardRefs.current.set(index, node);
    else cardRefs.current.delete(index);
  }, []);

  const orderedCards = useCallback(
    () => order.map((i) => cardRefs.current.get(i)).filter(Boolean) as HTMLElement[],
    [order]
  );

  const isMobile = stageWidth > 0 && stageWidth <= 1025;
  const isNarrow = stageWidth > 0 && stageWidth < 900;
  const railCount = Math.max(items.length - 1, 0);
  const scale = isNarrow ? Math.min(1, stageWidth / 900) : 1;

  const tW = thumbWidth * scale;
  const tH = thumbHeight * scale;
  const gap = thumbGap * scale;
  const hW = Math.min(heroWidth * scale, stageWidth * 0.46);
  const hH = heroHeight * (hW / heroWidth || 1);
  const railX = Math.max(24, stageWidth * 0.045);
  const heroX = stageWidth - hW - railX;

  const stackWidth = Math.min(215 * scale, stageWidth * 0.42);
  const stackHeight = stackWidth * 1.5;

  const slotBox = useCallback(
    (slot: number) => {
      if (slot === 0) {
        return { x: heroX, y: 0, w: hW, h: hH, r: rounded * scale, z: items.length + 1 };
      }
      const railHeight = railCount * tH + (railCount - 1) * gap;
      const top = -railHeight / 2 + (slot - 1) * (tH + gap);
      return {
        x: railX,
        y: top + tH / 2,
        w: tW,
        h: tH,
        r: rounded * 0.6 * scale,
        z: items.length - slot,
      };
    },
    [heroX, hW, hH, railX, tW, tH, gap, railCount, rounded, scale, items.length]
  );

  const select = useCallback(
    (itemIndex: number) => {
      if (itemIndex === order[0] || isAnimatingRef.current) return;
      if (!isMobile) {
        flipStateRef.current = Flip.getState(orderedCards(), { props: "borderRadius" });
      }
      setOrder((prev) => {
        const next = [...prev];
        const from = next.indexOf(itemIndex);
        next[from] = next[0];
        next[0] = itemIndex;
        return next;
      });
    },
    [order, orderedCards, isMobile]
  );

  useLayoutEffect(() => {
    const state = flipStateRef.current;
    if (!state) return;
    flipStateRef.current = null;
    if (reducedMotion || isMobile) return;

    isAnimatingRef.current = true;
    Flip.from(state, {
      duration,
      ease,
      absolute: true,
      props: "borderRadius",
      onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration }),
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  }, [order, duration, ease, reducedMotion, isMobile]);

  const open = useCallback(() => {
    if (opened || isAnimatingRef.current || stageWidth === 0) return;

    if (reducedMotion) {
      setOpened(true);
      return;
    }

    const state = Flip.getState(orderedCards(), { props: "borderRadius" });
    setOpened(true);

    requestAnimationFrame(() => {
      isAnimatingRef.current = true;
      Flip.from(state, {
        duration: duration * 1.0,
        ease,
        absolute: true,
        props: "borderRadius",
        stagger: 0.04,
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
    });
  }, [opened, stageWidth, reducedMotion, orderedCards, duration, ease]);

  const close = useCallback(() => {
    if (!opened || isAnimatingRef.current) return;

    if (reducedMotion) {
      setOpened(false);
      onClose?.();
      return;
    }

    const state = Flip.getState(orderedCards(), { props: "borderRadius" });
    setOpened(false);

    requestAnimationFrame(() => {
      isAnimatingRef.current = true;
      Flip.from(state, {
        duration: duration * 0.9,
        ease,
        absolute: true,
        props: "borderRadius",
        stagger: { each: 0.035, from: "end" },
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
    });
    onClose?.();
  }, [opened, reducedMotion, orderedCards, duration, ease, onClose]);

  const activeContent = reducedMotion ? nextContent : shownContent;

  useEffect(() => {
    if (reducedMotion || nextContent === shownContent) return;

    const el = contentRef.current;
    if (!el) {
      revertCaptionSplit();
      setShownContent(nextContent);
      return;
    }

    captionTweenRef.current?.kill();
    const fade = gsap.to(el.querySelectorAll("[data-card-text]"), {
      opacity: 0,
      y: -8,
      duration: captionFadeDuration,
      ease: "power2.in",
      onComplete: () => {
        revertCaptionSplit();
        setShownContent(nextContent);
      },
    });
    captionTweenRef.current = fade;
    return () => { fade.kill(); };
  }, [nextContent, shownContent, isMobile, reducedMotion, captionFadeDuration, revertCaptionSplit]);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const sections = el.querySelectorAll<HTMLElement>("[data-card-text]");

    if (reducedMotion) {
      revertCaptionSplit();
      gsap.set(sections, { opacity: 1, y: 0 });
      return;
    }

    captionTweenRef.current?.kill();
    revertCaptionSplit();
    gsap.set(sections, { opacity: 1, y: 0 });

    const split = SplitText.create(sections, {
      type: "lines",
      linesClass: "hxs-caption-line",
      mask: "lines",
    });
    captionSplitRef.current = split;

    const lines = split.lines;
    if (!lines?.length) {
      revertCaptionSplit();
      return;
    }

    gsap.set(lines, { yPercent: 100 });
    captionTweenRef.current = gsap.to(lines, {
      yPercent: 0,
      duration: captionRevealDuration,
      stagger: captionLineStagger,
      ease: "power3.out",
    });

    return () => {
      captionTweenRef.current?.kill();
      revertCaptionSplit();
    };
  }, [activeContent, isMobile, reducedMotion, captionRevealDuration, captionLineStagger, revertCaptionSplit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (!opened || items.length < 2) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") select(order[1]);
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") select(order[order.length - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [order, select, close, opened, items.length]);

  if (items.length === 0) return null;

  const heroItemIndex = order[0];
  const heroItem = items[heroItemIndex];
  const heroSlotLabel = heroItemIndex + 1;

  const cardStyle = (itemIndex: number): React.CSSProperties => {
    const slot = order.indexOf(itemIndex);

    if (!opened) {
      const w = stackWidth;
      const h = stackHeight;
      return {
        position: "absolute",
        left: stageWidth / 2 - w / 2,
        top: "50%",
        width: w,
        height: h,
        borderRadius: rounded * 0.75 * scale,
        transform: `translateY(-50%) translate(${slot * stackOffsetX}px, ${
          slot * stackOffsetY
        }px) rotate(${slot * stackRotation}deg)`,
        zIndex: items.length - slot,
      };
    }

    const box = slotBox(slot);
    return {
      position: "absolute",
      left: box.x,
      top: "50%",
      width: box.w,
      height: box.h,
      borderRadius: box.r,
      transform: `translateY(calc(-50% + ${box.y}px))`,
      zIndex: box.z,
    };
  };

  const chromeStyle: React.CSSProperties = {
    opacity: opened ? 1 : 0,
    transition: "opacity 0.5s ease 0.25s",
    pointerEvents: opened ? undefined : "none",
  };


  if (isMobile) {
    return (
      <div
        ref={rootRef}
        className={`hxs-gsap-flip-card relative w-full min-h-svh overflow-hidden ${className}`}
        style={{ background: backgroundColor, color: textColor }}
      >
        <div className="min-h-svh px-[5vw] py-[8vw] flex flex-col gap-[6vw]">
          {showCounter && (
            <div className="text-[3vw] tracking-[0.02em]">
              <span className="font-semibold">
                {String(heroSlotLabel).padStart(2, "0")}
              </span>
              <span style={{ color: mutedColor }}>
                {" "}
                / {String(items.length).padStart(2, "0")}
              </span>
            </div>
          )}

          {heroItem && (
            <div

              className="relative w-full flex-1 min-h-[45svh] overflow-hidden bg-[#d8d8d4] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]"
              style={{ borderRadius: rounded }}
            >
              <Image
                src={heroItem.image}
                alt={heroItem.alt ?? ""}
                draggable={false}
                fill
                sizes="90vw"
                priority
                className="object-cover"
              />
            </div>
          )}

          <div ref={contentRef} className="max-[1025px]:pb-[3vh]">
            <h2
              data-card-text
              className="h-[19vw] py-1  max-md:h-[17.85vw] overflow- text-[7vw]  max-md:text-[8.5vw] leading-[1.2] m-0 font-normal tracking-[-0.02em]"
            >
              {activeContent.title}
            </h2>
            <p
              data-card-text
              className="h-[6vw] max-md:h-[5.25vw] leading-[1.5] overflow-hidden text-[3vw] max-md:text-[3.5vw] mt-[3vw] mb-[4vw]"
              style={{ color: mutedColor }}
            >
              {activeContent.meta}
            </p>
            <p data-card-text className="h-[21.12vw] max-md:h-[31.35vw] overflow-hidden text-[3.2vw] max-md:text-[3.8vw] leading-[1.65] m-0">
              {activeContent.description}
            </p>
            <div
              className="overflow-hidden  h-fit max-md:[--hxs-cap-line:var(--hxs-cap-line-sm)]"
              style={
                {
                  "--hxs-cap-line": CAPTION_MOBILE_LINE,
                  "--hxs-cap-line-sm": CAPTION_MOBILE_LINE_SM,
                  "--hxs-cap-lines": captionLines,
                } as React.CSSProperties
              }
            >
              <p
                data-card-text
                className="text-[3vw] text-left max-md:text-left max-md:w-[80%] max-md:text-[4vw] w-[80%]  m-0  leading-normal"
              >
                {activeContent.caption}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-[3vw]">
            {order.slice(1).map((itemIndex) => {
              const item = items[itemIndex];
              if (!item) return null;
              return (
                <button
                  key={item.id ?? itemIndex}
                  type="button"
                  onClick={() => select(itemIndex)}
                  aria-label={item.alt ?? item.caption ?? `Image ${itemIndex + 1}`}
                  className="relative p-0 border-none overflow-hidden aspect-4/5 w-full bg-[#d8d8d4] [-webkit-tap-highlight-color:transparent]"
                  style={{ borderRadius: rounded * 0.6 }}
                >
                  <Image
                    src={item.image}
                    alt={item.alt ?? ""}
                    draggable={false}
                    fill
                    sizes="30vw"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`hxs-gsap-flip-card relative w-full min-h-svh overflow-hidden ${className}`}
      style={{ background: backgroundColor, color: textColor }}
    >
      {showCounter && (
        <div
          className="absolute top-[2.22vw] left-[2.78vw] text-[0.9vw] tracking-[0.02em] z-60"
          style={chromeStyle}
        >
          <span className="font-semibold">
            {String(heroSlotLabel).padStart(2, "0")}
          </span>
          <span style={{ color: mutedColor }}> / {String(items.length).padStart(2, "0")}</span>
        </div>
      )}

      <div
        ref={stageRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className={`relative w-full min-h-svh ${opened ? "cursor-pointer" : "cursor-default"}`}
      >
        <div
          ref={contentRef}
          className={`absolute top-1/2 -translate-y-1/2 max-w-[22.22vw] z-30 pointer-events-none ${
            isNarrow ? "hidden" : "block"
          }`}
          style={{ ...chromeStyle, left: railX + tW + Math.max(48, stageWidth * 0.06) }}
        >
          <h2
              data-card-text
            className="h-[8vw] overflow-hidden text-[3.2vw] leading-[1.05] font-normal tracking-[-0.02em] m-0"
          >
            {activeContent.title}
          </h2>
          <p data-card-text className="h-[2.7vw] leading-[1.5] overflow-hidden text-[0.9vw] mt-[0.97vw]  mx-0" style={{ color: mutedColor }}>
            {activeContent.meta}
          </p>
          <p data-card-text className="h-[9.6vw] overflow-hidden text-[0.97vw] leading-[1.65] m-0">{activeContent.description}</p>
          <div
            className="overflow-hidden mt-[1vw]"
            style={{ height: `${CAPTION_LINE_VW * captionLines}vw` }}
          >

            <p
              data-card-text
              className="text-[1vw] w-[80%] text-left leading-[1.3]  m-0 "
            >
              {activeContent.caption}
            </p>
          </div>
        </div>

        {items.map((item, itemIndex) => {
          const isHero = itemIndex === heroItemIndex;
          return (
            <button
              key={item.id ?? itemIndex}
              type="button"
              ref={(n) => registerCard(itemIndex, n)}
              data-flip-id={`hxs-card-${item.id ?? itemIndex}`}
              onClick={() => (opened ? select(itemIndex) : open())}
              aria-label={
                opened
                  ? item.alt ?? item.caption ?? `Image ${itemIndex + 1}`
                  : `Open gallery - ${items.length} images`
              }
              aria-current={(opened && isHero) || undefined}
              tabIndex={!opened ? (itemIndex === order[0] ? 0 : -1) : isHero ? -1 : 0}
              className={`p-0 border-none bg-[#d8d8d4] overflow-hidden shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] [-webkit-tap-highlight-color:transparent] ${
                !opened || !isHero ? "cursor-pointer" : "cursor-default"
              }`}
              style={cardStyle(itemIndex)}
            >
              <Image
                src={item.image}
                alt={item.alt ?? ""}
                draggable={false}
                fill
                sizes={`${Math.max(Math.round(hW), 1)}px`}
                className="object-cover rounded-[inherit]"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GsapFlipCard;
