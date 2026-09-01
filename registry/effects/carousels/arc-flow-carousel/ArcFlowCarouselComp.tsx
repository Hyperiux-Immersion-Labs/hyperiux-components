// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};

      const mediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQueryList.addEventListener("change", callback);

      return () => mediaQueryList.removeEventListener("change", callback);
    },
    () => (typeof window === "undefined" ? false : window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false),
    () => false
  );
}

export interface SmoothSliderItem {
  src: string;
  alt?: string;
  label?: string;
  title?: string;
  description?: string;
}

export interface ArcFlowCarouselCompProps {
  items?: SmoothSliderItem[];
  /** Circle radius as a multiple of the container width. Bigger = flatter arc. */
  radiusRatio?: number;
  /** Card width as a fraction of the container width (clamped by min/max). */
  cardRatio?: number;
  minCardWidth?: number;
  maxCardWidth?: number;
  /** Card width / height. 0.62 ≈ the video's card proportions. */
  cardAspect?: number;
  /** 0 = cards touch edge to edge, 0.3 = overlap by 30%, negative = a gap between them. */
  overlap?: number;
  /** Vertical position of the leading card's centre, as a fraction of height. */
  arcOffset?: number;
  /** Higher = the fan catches up to the pointer faster. 4–9 feels natural. */
  smoothing?: number;
  /** How far the fan travels per pixel dragged. 1 = 1:1 at the centre card, higher = more travel per drag. */
  dragSensitivity?: number;
  /** Flick distance multiplier after release. */
  momentum?: number;
  /** Snap to the nearest card once the flick settles. */
  snap?: boolean;
  /** How wheel / trackpad input is consumed. */
  wheelControl?: "horizontal" | "both" | "off";
  /** Constant idle drift in rad/s. Positive drifts new cards in from the left. */
  autoRotateSpeed?: number;
  /** Pause the idle drift while a pointer hovers the carousel. */
  pauseOnHover?: boolean;
  /** Shared hex color used for both the page background and the wheel surface. */
  surfaceColor?: string;
  className?: string;
}

const DRAG_SMOOTHING = 14;
const VELOCITY_WINDOW = 90;
const MAX_FLICK = 9;
/** How much slower a card follows per unit distance from the active one. 0 = no lag, 1 = edge cards barely move. */
const STAGGER_LAG_STRENGTH = 0.85;
/** Floor on a card's follow rate, as a fraction of the base rate, so far cards never stall. */
const MIN_FOLLOW_FRACTION = 0.6;

export default function ArcFlowCarouselComp({
  items = [],
  radiusRatio = 0.85,
  cardRatio = 0.21,
  minCardWidth = 150,
  maxCardWidth = 320,
  cardAspect = 0.62,
  overlap = -0.04,
  arcOffset = 0.5,
  smoothing = 5.5,
  dragSensitivity = 1.2,
  momentum = 1,
  snap = false,
  wheelControl = "horizontal",
  autoRotateSpeed = 0,
  pauseOnHover = true,
  surfaceColor = "#000000",
  className = "",
}: ArcFlowCarouselCompProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const discRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const reduceMotion = usePrefersReducedMotion();

  // How many card slots the wheel needs so the wrap point stays off screen.
  const [slotCount, setSlotCount] = useState(() => Math.max(items.length, 12));

  // Live geometry, recomputed on resize. Read by the ticker, never by render.
  const layoutRef = useRef({
    radius: 900,
    cardWidth: 220,
    cardHeight: 330,
    step: 0.14,
    centerX: 0,
    centerY: 0,
    maxAngle: 1,
  });

  // Wheel position in radians. `current` chases `target` every frame.
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  // Each card's own eased position - chases `current`, not `target`, so
  // motion ripples outward from the active card instead of moving as one.
  const slotOffsetsRef = useRef<number[]>([]);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const lastXRef = useRef(0);
  const samplesRef = useRef<{ t: number; value: number }[]>([]);
  const revealRef = useRef(reduceMotion ? 1 : 0);
  const revealStartRef = useRef(0);
  const wheelSettleRef = useRef(0);
  const hoveredRef = useRef(false);

  const total = items.length;

  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || !total) return;

    const width = stage.offsetWidth;
    const height = stage.offsetHeight;

    const cardWidth = gsap.utils.clamp(minCardWidth, maxCardWidth, width * cardRatio);
    const cardHeight = cardWidth / cardAspect;
    const radius = Math.max(width * radiusRatio, cardWidth * 4.2);

    // Arc length between two card centres -> angle between them.
    const step = (cardWidth * (1 - gsap.utils.clamp(-0.5, 0.85, overlap))) / radius;

    // Card centres ride the circle; `arcOffset` places the leading one.
    const centerX = width / 2;
    const centerY = height * arcOffset + radius;

    // The disc rim clears the card bottoms by a hair, reading as a ground line.
    const discRadius = radius - cardHeight * 0.66;

    // A card is worth drawing while any part of it can reach the viewport.
    const reach = Math.min(1, (width / 2 + cardWidth * 1.2) / radius);
    const maxAngle = Math.asin(reach) + 0.12;

    layoutRef.current = { radius, cardWidth, cardHeight, step, centerX, centerY, maxAngle };

    const disc = discRef.current;
    if (disc) {
      disc.style.width = `${discRadius * 2}px`;
      disc.style.height = `${discRadius * 2}px`;
      disc.style.left = `${centerX}px`;
      disc.style.top = `${centerY - discRadius}px`;
    }

    // Enough slots that the wrap seam is always past `maxAngle`.
    const needed = Math.ceil((maxAngle * 2) / step) + 2;
    setSlotCount((prev) => {
      const next = Math.max(total, Math.ceil(needed / total) * total);
      return next === prev ? prev : next;
    });
  }, [arcOffset, cardAspect, cardRatio, maxCardWidth, minCardWidth, overlap, radiusRatio, total]);

  useLayoutEffect(() => {
    measure();

    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [measure]);

  // Render loop: one exponential lerp, then a transform per card.
  useEffect(() => {
    if (!total) return;

    const draw = (dt: number) => {
      const { radius, cardWidth, cardHeight, step, centerX, centerY, maxAngle } = layoutRef.current;
      const span = slotCount * step;
      const half = span / 2;
      const reveal = revealRef.current;
      const rate = draggingRef.current ? DRAG_SMOOTHING : reduceMotion ? DRAG_SMOOTHING : smoothing;
      const useUnifiedOffset = reduceMotion;

      const slotOffsets = slotOffsetsRef.current;
      if (slotOffsets.length !== slotCount) {
        slotOffsets.length = slotCount;
        slotOffsets.fill(currentRef.current);
      }

      for (let i = 0; i < slotCount; i += 1) {
        const card = cardRefs.current[i];
        if (!card) continue;

        if (useUnifiedOffset) {
          slotOffsets[i] = currentRef.current;
        } else {
          // Rank this card's distance from the active one using its own last
          // position - continuous enough to pick a follow rate from.
          let rankAngle = (i * step - slotOffsets[i]) % span;
          if (rankAngle < -half) rankAngle += span;
          else if (rankAngle >= half) rankAngle -= span;
          const distanceFactor = gsap.utils.clamp(0, 1, Math.abs(rankAngle) / maxAngle);

          // The touched/active card tracks the drag almost immediately; cards
          // further out follow it with more lag, so motion ripples outward
          // instead of the whole fan moving as one rigid piece.
          const followRate = Math.max(
            rate * (1 - distanceFactor * STAGGER_LAG_STRENGTH),
            rate * MIN_FOLLOW_FRACTION,
          );
          const followLerp = 1 - Math.exp(-followRate * dt);
          slotOffsets[i] += (currentRef.current - slotOffsets[i]) * followLerp;
        }

        // Wrap into [-half, half) so the strip of cards is endless.
        let baseAngle = (i * step - slotOffsets[i]) % span;
        if (baseAngle < -half) baseAngle += span;
        else if (baseAngle >= half) baseAngle -= span;

        if (Math.abs(baseAngle) > maxAngle) {
          if (card.style.visibility !== "hidden") card.style.visibility = "hidden";
          continue;
        }
        if (card.style.visibility === "hidden") card.style.visibility = "visible";

        const x = centerX + radius * Math.sin(baseAngle) - cardWidth / 2;
        const y = centerY - radius * Math.cos(baseAngle) - cardHeight / 2;

        card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${baseAngle}rad)`;
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        // Right always stacks over left, no exception for the active card -
        // a plain fanned hand of cards, ordered purely by position.
        card.style.zIndex = `${Math.round((baseAngle + half) * 1000)}`;

        const inner = innerRefs.current[i];
        if (inner && reveal < 1) {
          // Staggered entrance, outwards from the middle of the fan.
          const delay = Math.min(1, Math.abs(baseAngle) / maxAngle) * 0.45;
          const p = gsap.utils.clamp(0, 1, (reveal - delay) / (1 - delay || 1));
          const eased = 1 - Math.pow(1 - p, 3);
          inner.style.opacity = `${eased}`;
          inner.style.transform = `translate3d(0, ${(1 - eased) * cardHeight * 0.35}px, 0)`;
        } else if (inner && inner.style.opacity !== "1") {
          inner.style.opacity = "1";
          inner.style.transform = "translate3d(0, 0, 0)";
        }
      }
    };

    const tick = (_time: number, deltaTime: number) => {
      const dt = Math.min(deltaTime, 50) / 1000;
      const rate = draggingRef.current ? DRAG_SMOOTHING : reduceMotion ? DRAG_SMOOTHING : smoothing;
      const lerp = 1 - Math.exp(-rate * dt);

      const delta = targetRef.current - currentRef.current;
      currentRef.current += delta * lerp;

      if (Math.abs(delta) < 0.00002) currentRef.current = targetRef.current;

      if (revealRef.current < 1) {
        // Wall-clock, so a dropped frame can't stretch the entrance.
        const now = performance.now();
        if (!revealStartRef.current) revealStartRef.current = now;
        revealRef.current = Math.min(1, (now - revealStartRef.current) / 1100);
      }

      // A slow constant drift, like the wheel is idling - paused mid-flick,
      // mid-hover, or once reduced motion asks for stillness.
      if (
        autoRotateSpeed &&
        !reduceMotion &&
        !draggingRef.current &&
        !(pauseOnHover && hoveredRef.current)
      ) {
        targetRef.current += autoRotateSpeed * dt;
      }

      draw(dt);
    };

    // Land on the first card and paint one frame before the ticker starts.
    draw(1);
    gsap.ticker.add(tick);

    return () => gsap.ticker.remove(tick);
  }, [autoRotateSpeed, pauseOnHover, reduceMotion, slotCount, smoothing, total]);

  // Pointer drag + flick.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !total) return;

    const pushSample = () => {
      const now = performance.now();
      const samples = samplesRef.current;
      samples.push({ t: now, value: targetRef.current });
      while (samples.length > 2 && now - samples[0].t > VELOCITY_WINDOW) samples.shift();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      draggingRef.current = true;
      pointerIdRef.current = e.pointerId;
      lastXRef.current = e.clientX;
      samplesRef.current = [{ t: performance.now(), value: targetRef.current }];
      // Kill any leftover flick the moment a finger lands.
      targetRef.current = currentRef.current;
      stage.setPointerCapture(e.pointerId);
      stage.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current || e.pointerId !== pointerIdRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      // Pixels along the rim -> radians, scaled by dragSensitivity.
      targetRef.current -= (dx * dragSensitivity) / layoutRef.current.radius;
      pushSample();
    };

    const endDrag = (e: PointerEvent) => {
      if (!draggingRef.current || e.pointerId !== pointerIdRef.current) return;
      draggingRef.current = false;
      pointerIdRef.current = null;
      stage.style.cursor = "grab";
      if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);

      pushSample();

      const { step } = layoutRef.current;
      let projected = targetRef.current;

      if (!reduceMotion) {
        const samples = samplesRef.current;
        const first = samples[0];
        const last = samples[samples.length - 1];
        const dt = last && first ? (last.t - first.t) / 1000 : 0;

        if (dt > 0.008) {
          // Velocity in rad/s. Handing the lerp `v / rate` keeps the card
          // speed continuous through the release - no jolt, no dead stop.
          const velocity = (last.value - first.value) / dt;
          const throw_ = gsap.utils.clamp(-MAX_FLICK, MAX_FLICK, velocity / smoothing) * momentum;
          projected = targetRef.current + throw_;
        }
      }

      targetRef.current = snap ? gsap.utils.snap(step, projected) : projected;
      samplesRef.current = [];
    };

    const onWheel = (e: WheelEvent) => {
      if (wheelControl === "off") return;
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (wheelControl === "horizontal" && !horizontal) return;

      const delta = horizontal ? e.deltaX : e.deltaY;
      e.preventDefault();
      targetRef.current += (delta * dragSensitivity) / layoutRef.current.radius;

      if (snap) {
        // Wheel input arrives in bursts; settle on a card once it stops.
        window.clearTimeout(wheelSettleRef.current);
        wheelSettleRef.current = window.setTimeout(() => {
          targetRef.current = gsap.utils.snap(layoutRef.current.step, targetRef.current);
        }, 140);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const { step } = layoutRef.current;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        targetRef.current += step;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        targetRef.current -= step;
      }
    };

    const onPointerEnter = () => {
      hoveredRef.current = true;
    };
    const onPointerLeave = () => {
      hoveredRef.current = false;
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("pointerenter", onPointerEnter);
    stage.addEventListener("pointerleave", onPointerLeave);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("keydown", onKeyDown);

    return () => {
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointercancel", endDrag);
      stage.removeEventListener("pointerenter", onPointerEnter);
      stage.removeEventListener("pointerleave", onPointerLeave);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(wheelSettleRef.current);
    };
  }, [dragSensitivity, momentum, reduceMotion, smoothing, snap, total, wheelControl]);

  if (!total) return null;

  const slots = Array.from({ length: slotCount }, (_, i) => items[i % total]);

  return (
    <section
      className={`relative bg-black h-dvh w-full overflow-hidden select-none ${className}`}
      style={{ backgroundColor: surfaceColor }}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="region"
        aria-label="Draggable image carousel"
        className="absolute inset-0 cursor-grab outline-none"
        style={{ touchAction: "pan-y" }}
      >
        {/* The wheel the cards ride on. */}
        <div
          ref={discRef}
          aria-hidden
          className="pointer-events-none absolute -translate-x-1/2 rounded-full"
          style={{
            backgroundColor: surfaceColor,
            boxShadow: "none",
          }}
        />

        {slots.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="group absolute top-0 left-0 will-change-transform"
            style={{ visibility: "hidden" }}
          >
            <div
              ref={(el) => {
                innerRefs.current[i] = el;
              }}
              className="relative h-full w-full overflow-hidden rounded-[10px] bg-black/5"
              style={{
                opacity: reduceMotion ? 1 : 0,
                boxShadow: "0 18px 40px -12px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt ?? `Slide ${(i % total) + 1}`}
                draggable={false}
                className="pointer-events-none block h-full w-full object-cover select-none"
              />
              {(item.title || item.description) ? (
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out ${
                    reduceMotion ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.16) 45%, rgba(0,0,0,0.62) 100%)",
                  }}
                />
              ) : null}
              {(item.title || item.description) ? (
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white transition-all duration-300 ease-out ${
                    reduceMotion
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  }`}
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 35%, rgba(0,0,0,0.26) 100%)",
                  }}
                >
                  {item.title ? (
                    <p className="text-[1.4vw] font-medium uppercase  text-white/95">
                      {item.title}
                    </p>
                  ) : null}
                  {item.description ? (
                    <p className="mt-2 max-w-[22ch] text-[1.1vw] leading-[1.1] text-white/75">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {item.label ? (
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[0.7rem] tracking-[0.18em] text-white/90 uppercase">
                  {item.label}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
