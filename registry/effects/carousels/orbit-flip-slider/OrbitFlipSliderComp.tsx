// Built using Hyperiux Vault: https://vault.hyperiux.com
'use client'
import { useSyncExternalStore } from "react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Flip } from "gsap/dist/Flip";

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

gsap.registerPlugin(Flip);

type OrbitFlipSliderMode = "flat" | "tilt" | "ring" | "gallery";

interface OrbitFlipSliderItem {
  id?: string | number;
  image: string;
  alt?: string;
}

interface OrbitFlipSliderCompProps {
  items?: OrbitFlipSliderItem[];
  backgroundColor?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageGap?: number;
  rounded?: string;
  enableHoverMovement?: boolean;
  hoverMoveY?: number;
  perspectiveRotateValue?: number;
  perspectiveRotateDirection?: "left" | "right";
  rotate?: boolean;
  rotateSpeed?: number;
  stopRotationOnHover?: boolean;
  flatRadiusX?: number;
  flatRadiusY?: number;
  flatScale?: number;
  ringRotateX?: number;
  ringRotateY?: number;
  ringRotateZ?: number;
  ringRadiusX?: number;
  ringRadiusY?: number;
  ringScale?: number;
  tiltRotateX?: number;
  tiltRotateY?: number;
  tiltRotateZ?: number;
  tiltRadiusX?: number;
  tiltRadiusY?: number;
  tiltScale?: number;
  tiltMoveY?: number;
  galleryRotateX?: number;
  galleryRotateY?: number;
  galleryRotateZ?: number;
  galleryRadiusX?: number;
  galleryRadiusY?: number;
  galleryScale?: number;
}

interface CardBox {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

// x/y tilt the underlying 3D ring, z spins the whole projected composition
// in place, radiusX/radiusY stretch it independent of the depth math, scale
// zooms everything (position and card size) uniformly, and moveY pans the
// whole composition up/down on screen without affecting any of the above.
interface AxisTransform {
  x: number;
  y: number;
  z: number;
  radiusX: number;
  radiusY: number;
  scale: number;
  moveY: number;
}

const MODES: { key: OrbitFlipSliderMode; label: string }[] = [
  { key: "flat", label: "Flat" },
  { key: "tilt", label: "Tilt" },
  { key: "ring", label: "Ring" },
  { key: "gallery", label: "Gallery" },
];

const degToRad = (deg: number) => (deg * Math.PI) / 180;

// Mirrors Tailwind's `max-md:` breakpoint (max-width: 767px) — below this,
// the ring is pulled in so it doesn't overflow narrow viewports.
const MOBILE_BREAKPOINT = 768;
const MOBILE_FLAT_RADIUS_X_SCALE = 0.55;
const MOBILE_TILT_RADIUS_X_SCALE = 0.6;
const MOBILE_TILT_RADIUS_Y_SCALE = 0.8;
const MOBILE_RING_SCALE = 0.6;
const MOBILE_GALLERY_SCALE = 0.6;

interface CoverflowParams {
  radius: number;
  tiltDeg: number;
  camDistFactor: number;
  offsetDeg: number;
  anchorY: number;
  positionScaleStrength?: number;
  sizeScaleStrength?: number;
}

const getBaseOrbitRadius = (
  count: number,
  cardWidth: number,
  cardHeight: number,
  imageGap: number
) => {
  const baseSpan = Math.max(cardWidth, cardHeight) + imageGap;
  return Math.max((count * baseSpan) / (2 * Math.PI) * 0.62, baseSpan * 0.9);
};

// Distributes every card fully around a ring lying almost flat. Every card
// stays flat and forward-facing (billboarded) no matter where it sits on the
// ring — only its position and depth-driven scale/z-index change. Zoomed in
// close, only the near slice reads as full-size cards; the rest recede
// smaller into the depth, with the frontmost cards naturally stacking above
// the ones behind them.
const buildCoverflowLayout = (
  count: number,
  containerW: number,
  containerH: number,
  sizes: { w: number; h: number }[],
  params: CoverflowParams
): CardBox[] => {
  const cx = containerW / 2;
  const camDist = params.radius * params.camDistFactor;
  const tilt = degToRad(params.tiltDeg);
  const positionScaleStrength = params.positionScaleStrength ?? 1;
  const sizeScaleStrength = params.sizeScaleStrength ?? 0.42;

  return sizes.map((size, i) => {
    const thetaDeg = params.offsetDeg + (i / count) * 360;
    const theta = degToRad(thetaDeg);
    const px = params.radius * Math.sin(theta);
    const pz0 = -params.radius * Math.cos(theta);
    const py = -pz0 * Math.sin(tilt);
    const pz = pz0 * Math.cos(tilt);
    const scale = Math.max(camDist / (camDist + pz), 0.05);
    const positionScale = 1 + (scale - 1) * positionScaleStrength;
    const sizeScale = 1 + (scale - 1) * sizeScaleStrength;

    return {
      x: cx + px * positionScale,
      y: containerH * params.anchorY + py * positionScale,
      width: size.w * sizeScale,
      height: size.h * sizeScale,
      zIndex: Math.round(scale * 1000) + 1,
    };
  });
};

// Spins the whole projected composition around its own screen anchor — the
// z axis of the screen itself, on top of the 3D x/y tilt baked into the
// projection.
const applyZRotation = (boxes: CardBox[], cx: number, cy: number, zDeg: number): CardBox[] => {
  if (!zDeg) return boxes;
  const rad = degToRad(zDeg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return boxes.map((box) => {
    const dx = box.x - cx;
    const dy = box.y - cy;
    return {
      ...box,
      x: cx + dx * cos - dy * sin,
      y: cy + dx * sin + dy * cos,
    };
  });
};

// Stretches the composition horizontally/vertically around its anchor,
// independent of the 3D depth math (scale/z-index stay driven by the true
// circular radius) — lets it read wider or taller without changing how
// near/far cards foreshorten.
const applyRadiusScale = (
  boxes: CardBox[],
  cx: number,
  cy: number,
  baseRadius: number,
  radiusX: number,
  radiusY: number
): CardBox[] => {
  const sx = radiusX / baseRadius;
  const sy = radiusY / baseRadius;
  if (sx === 1 && sy === 1) return boxes;
  return boxes.map((box) => ({
    ...box,
    x: cx + (box.x - cx) * sx,
    y: cy + (box.y - cy) * sy,
  }));
};

// Zooms the whole composition uniformly — position spread and card size
// together — around its anchor, like moving the camera closer or further.
const applyUniformScale = (boxes: CardBox[], cx: number, cy: number, scale: number): CardBox[] => {
  if (scale === 1) return boxes;
  return boxes.map((box) => ({
    ...box,
    x: cx + (box.x - cx) * scale,
    y: cy + (box.y - cy) * scale,
    width: box.width * scale,
    height: box.height * scale,
  }));
};

const applyTransform = (
  boxes: CardBox[],
  cx: number,
  cy: number,
  baseRadius: number,
  t: AxisTransform
): CardBox[] => {
  const radiusScaled = applyRadiusScale(boxes, cx, cy, baseRadius, baseRadius * t.radiusX, baseRadius * t.radiusY);
  const scaled = applyUniformScale(radiusScaled, cx, cy, t.scale);
  return applyZRotation(scaled, cx, cy, t.z);
};

interface FlatTransform {
  radiusX: number;
  radiusY: number;
  scale: number;
}

interface ModeTransforms {
  flat: FlatTransform;
  tilt: AxisTransform;
  ring: AxisTransform;
  gallery: AxisTransform;
}

const buildLayout = (
  mode: OrbitFlipSliderMode,
  count: number,
  containerW: number,
  containerH: number,
  sizes: { w: number; h: number }[],
  transforms: ModeTransforms,
  imageGap: number,
  rotationOffsetDeg: number = 0
): CardBox[] => {
  const cx = containerW / 2;
  const cy = containerH / 2;
  const cardWidth = sizes[0]?.w ?? 140;
  const cardHeight = sizes[0]?.h ?? 200;
  const baseRadius = getBaseOrbitRadius(count, cardWidth, cardHeight, imageGap);

  // Every mode is the same ring of cards, always flat and forward-facing —
  // only the camera's zoom, tilt and framing differ. Flat is the ring seen
  // straight-on, evenly spaced, from far enough back that it reads as a
  // plain circle.
  if (mode === "flat") {
    const f = transforms.flat;
    const rx = baseRadius * f.radiusX;
    const ry = baseRadius * f.radiusY;
    const boxes = sizes.map((size, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2 + degToRad(rotationOffsetDeg);
      return {
        x: cx + rx * Math.cos(angle),
        y: cy + ry * Math.sin(angle),
        width: size.w,
        height: size.h,
        zIndex: i + 1,
      };
    });
    return applyUniformScale(boxes, cx, cy, f.scale);
  }

  // Tilt, ring and gallery are the same coverflow ring — only how it's
  // rotated, stretched and zoomed differs between them.
  const t = transforms[mode];
  const radius = mode === "gallery" ? baseRadius * 1.55 : baseRadius * 1.12;
  const anchorY = 0.5;
  const camDistFactor = mode === "gallery" ? 1.55 : 1.75;
  const positionScaleStrength = mode === "gallery" ? 0.28 : 0.45;
  const sizeScaleStrength = mode === "gallery" ? 0.16 : 0.42;
  const boxes = buildCoverflowLayout(count, containerW, containerH, sizes, {
    radius,
    tiltDeg: t.x,
    camDistFactor,
    offsetDeg: -90 + t.y + rotationOffsetDeg,
    anchorY,
    positionScaleStrength,
    sizeScaleStrength,
  });
  const transformed = applyTransform(boxes, cx, containerH * anchorY, radius, t);
  if (!t.moveY) return transformed;
  return transformed.map((box) => ({ ...box, y: box.y + t.moveY }));
};

const OrbitFlipSliderComp = ({
  items = [],
  backgroundColor = "#e9e9ea",
  imageWidth = 140,
  imageHeight = 200,
  imageGap = 0,
  rounded = "rounded-none",
  enableHoverMovement = true,
  hoverMoveY = -8,
  perspectiveRotateValue = 75,
  perspectiveRotateDirection = "right",
  rotate = true,
  rotateSpeed = 4,
  stopRotationOnHover = true,
  flatRadiusX = 1,
  flatRadiusY = 1,
  flatScale = 1,
  ringRotateX = 31,
  ringRotateY = 56,
  ringRotateZ = -25,
  ringRadiusX = 1.5,
  ringRadiusY = 0.65,
  ringScale = 0.6,
  tiltRotateX = 70,
  tiltRotateY = 0,
  tiltRotateZ = 0,
  tiltRadiusX = 1.2,
  tiltRadiusY = 1,
  tiltScale = 1,
  tiltMoveY = 325,
  galleryRotateX = 10,
  galleryRotateY = 0,
  galleryRotateZ = 0,
  galleryRadiusX = 1,
  galleryRadiusY = 1,
  galleryScale = 1,
}: OrbitFlipSliderCompProps) => {
  const FLIP_DURATION_SECONDS = 0.9;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const modeRef = useRef<OrbitFlipSliderMode>("flat");
  const isFlipAnimatingRef = useRef(false);
  const flipResumeTimeoutRef = useRef<number | null>(null);
  const rotationOffsetRef = useRef(0);
  const hoveredCardCountRef = useRef(0);
  const [activeMode, setActiveMode] = useState<OrbitFlipSliderMode>("flat");
  const reducedMotion = usePrefersReducedMotion();

  const sizes = items.map(() => ({ w: imageWidth, h: imageHeight }));
  const transforms: ModeTransforms = {
    flat: {
      radiusX: flatRadiusX,
      radiusY: flatRadiusY,
      scale: flatScale,
    },
    tilt: {
      x: tiltRotateX,
      y: tiltRotateY,
      z: tiltRotateZ,
      radiusX: tiltRadiusX,
      radiusY: tiltRadiusY,
      scale: tiltScale,
      moveY: tiltMoveY,
    },
    ring: {
      x: ringRotateX,
      y: ringRotateY,
      z: ringRotateZ,
      radiusX: ringRadiusX,
      radiusY: ringRadiusY,
      scale: ringScale,
      moveY: 0,
    },
    gallery: {
      x: galleryRotateX,
      y: galleryRotateY,
      z: galleryRotateZ,
      radiusX: galleryRadiusX,
      radiusY: galleryRadiusY,
      scale: galleryScale,
      moveY: 0,
    },
  };

  const applyLayout = useCallback(
    (mode: OrbitFlipSliderMode, animate: boolean) => {
      const track = trackRef.current;
      if (!track) return;

      const cards = gsap.utils.toArray<HTMLElement>(".orbit-flip-slider-card", track);
      if (!cards.length) return;

      const { width, height } = track.getBoundingClientRect();
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const responsiveTransforms: ModeTransforms = isMobile
        ? {
            ...transforms,
            flat: { ...transforms.flat, radiusX: transforms.flat.radiusX * MOBILE_FLAT_RADIUS_X_SCALE },
            tilt: {
              ...transforms.tilt,
              radiusX: transforms.tilt.radiusX * MOBILE_TILT_RADIUS_X_SCALE,
              radiusY: transforms.tilt.radiusY * MOBILE_TILT_RADIUS_Y_SCALE,
            },
            ring: { ...transforms.ring, scale: transforms.ring.scale * MOBILE_RING_SCALE },
            gallery: { ...transforms.gallery, scale: transforms.gallery.scale * MOBILE_GALLERY_SCALE },
          }
        : transforms;
      const layout = buildLayout(mode, cards.length, width, height, sizes, responsiveTransforms, imageGap, rotationOffsetRef.current);

      const commit = () => {
        cards.forEach((card, i) => {
          const box = layout[i];
          gsap.set(card, {
            x: box.x,
            y: box.y,
            xPercent: -50,
            yPercent: -50,
            width: box.width,
            height: box.height,
            zIndex: box.zIndex,
          });
        });
      };

      if (!animate || reducedMotion) {
        commit();
        return;
      }

      const state = Flip.getState(cards);
      commit();
      isFlipAnimatingRef.current = true;
      if (flipResumeTimeoutRef.current !== null) window.clearTimeout(flipResumeTimeoutRef.current);
      flipResumeTimeoutRef.current = window.setTimeout(() => {
        isFlipAnimatingRef.current = false;
        flipResumeTimeoutRef.current = null;
      }, FLIP_DURATION_SECONDS * 1000);
      Flip.from(state, {
        duration: FLIP_DURATION_SECONDS,
        ease: "power3.inOut",
        stagger: 0.015,
        absolute: true,
      });
    },
    [
      sizes,
      reducedMotion,
      imageWidth,
      imageHeight,
      imageGap,
      flatRadiusX,
      flatRadiusY,
      flatScale,
      ringRotateX,
      ringRotateY,
      ringRotateZ,
      ringRadiusX,
      ringRadiusY,
      ringScale,
      tiltRotateX,
      tiltRotateY,
      tiltRotateZ,
      tiltRadiusX,
      tiltRadiusY,
      tiltScale,
      tiltMoveY,
      galleryRotateX,
      galleryRotateY,
      galleryRotateZ,
      galleryRadiusX,
      galleryRadiusY,
      galleryScale,
    ]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      applyLayout(modeRef.current, false);

      const handleResize = () => applyLayout(modeRef.current, false);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, trackRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const didMountTransforms = useRef(false);
  useEffect(() => {
    if (!didMountTransforms.current) {
      didMountTransforms.current = true;
      return;
    }
    applyLayout(modeRef.current, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    imageWidth,
    imageHeight,
    imageGap,
    flatRadiusX,
    flatRadiusY,
    flatScale,
    ringRotateX,
    ringRotateY,
    ringRotateZ,
    ringRadiusX,
    ringRadiusY,
    ringScale,
    tiltRotateX,
    tiltRotateY,
    tiltRotateZ,
    tiltRadiusX,
    tiltRadiusY,
    tiltScale,
    tiltMoveY,
    galleryRotateX,
    galleryRotateY,
    galleryRotateZ,
    galleryRadiusX,
    galleryRadiusY,
    galleryScale,
  ]);

  const handleModeChange = (mode: OrbitFlipSliderMode) => {
    if (mode === modeRef.current) return;
    modeRef.current = mode;
    setActiveMode(mode);
    applyLayout(mode, true);
  };

  // Continuously nudges the ring's rotation offset and re-commits positions
  // directly (no Flip) each frame — paused while a Flip mode-transition is
  // in flight, or while hovered when stopRotationOnHover is on.
  useEffect(() => {
    if (!rotate || reducedMotion) return;
    let rafId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const paused = isFlipAnimatingRef.current || (stopRotationOnHover && hoveredCardCountRef.current > 0);
      if (!paused) {
        rotationOffsetRef.current += rotateSpeed * dt;
        applyLayout(modeRef.current, false);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [rotate, rotateSpeed, stopRotationOnHover, reducedMotion, applyLayout]);

  // Every card stays flat and forward-facing at rest — hover just pops it
  // toward the viewer with a bouncy tilt, without touching z-index.
  const handleCardEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      hoveredCardCountRef.current += 1;
      if (reducedMotion || !enableHoverMovement || window.innerWidth < MOBILE_BREAKPOINT) return;
      const card = e.currentTarget;
      const inner = card.querySelector<HTMLElement>(".orbit-flip-slider-card-inner");
      if (!inner) return;
      const rotateY =
        perspectiveRotateDirection === "left"
          ? -Math.abs(perspectiveRotateValue)
          : Math.abs(perspectiveRotateValue);

      gsap.killTweensOf(inner);
      gsap.to(inner, {
        y: hoverMoveY,
        rotateY,
        boxShadow: "0 14px 26px rgba(0,0,0,0.2)",
        duration: 0.8,
        ease: "back.out(2.2)",
      });
    },
    [enableHoverMovement, hoverMoveY, perspectiveRotateDirection, perspectiveRotateValue, reducedMotion]
  );

  const handleCardLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      hoveredCardCountRef.current = Math.max(0, hoveredCardCountRef.current - 1);
      if (reducedMotion || !enableHoverMovement || window.innerWidth < MOBILE_BREAKPOINT) return;
      const card = e.currentTarget;
      const inner = card.querySelector<HTMLElement>(".orbit-flip-slider-card-inner");
      if (!inner) return;

      gsap.killTweensOf(inner);
      gsap.to(inner, {
        y: 0,
        rotateY: 0,
        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        duration: 0.7,
        ease: "back.out(2.2)",
      });
    },
    [enableHoverMovement, reducedMotion]
  );

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      style={{ backgroundColor }}
    >
    

      <div
        ref={trackRef}
        className="relative w-full flex-1 overflow-hidden"
      >
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            className="orbit-flip-slider-card absolute left-0 top-0"
            onMouseEnter={handleCardEnter}
            onMouseLeave={handleCardLeave}
            style={{ perspective: "500px" }}
          >
            <div
              className={`orbit-flip-slider-card-inner relative h-full w-full overflow-hidden bg-white ${rounded}`}
              style={{
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                src={item.image}
                alt={item.alt ?? `Selected work ${i + 1}`}
                fill
                sizes={`${imageWidth}px`}
                className="object-cover"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
        <div className="absolute top-20 left-6">
        <div className="flex flex-wrap items-center gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => handleModeChange(m.key)}
              className={`rounded-full border px-5 py-2 text-sm transition-colors duration-300 ${
                activeMode === m.key
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-white/70 text-black/70 hover:bg-black/10"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrbitFlipSliderComp;
