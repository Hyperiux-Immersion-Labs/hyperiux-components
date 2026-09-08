// Built using Hyperiux Vault: https://vault.hyperiux.com


"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

interface LiquidGlassCursorProps {
  children?: React.ReactNode;
  size?: number;
  magnification?: number;
  textHoverSize?: number;
  maxButtonWidth?: number;
  maxButtonHeight?: number;
  distortion?: number;
  aberration?: number;
  className?: string;
}

const TEXT_SELECTOR =
  '[data-cursor="text"], p, span, h1, h2, h3, h4, h5, h6, label';
const BUTTON_SELECTOR =
  '[data-cursor="button"], button, a, [role="button"], input, select, textarea';

export default function LiquidGlassCursor({
  children,
  size = 150,
  magnification = 1.15,
  textHoverSize = 130,
  maxButtonWidth = 260,
  maxButtonHeight = 110,
  distortion = 60,
  aberration = 1,
  className = "",
}: LiquidGlassCursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const filterId = `lgc-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [copyStyle, setCopyStyle] = useState<React.CSSProperties>({});
  const [mapUrl, setMapUrl] = useState("");
  const reduceMotion = useReducedMotion();

  // Displacement bitmap is generated once at the largest size any shape can
  // reach, then stretched (non-uniformly, via preserveAspectRatio="none") to
  // match the live lens dimensions — regenerating pixels every frame would jank.
  const mapSize = Math.max(size, textHoverSize, maxButtonWidth, maxButtonHeight);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const presence = useMotionValue(0);
  const targetW = useMotionValue(size);
  const targetH = useMotionValue(size);

  const springConfig = reduceMotion
    ? { stiffness: 2000, damping: 90 }
    : { stiffness: 300, damping: 26 };
  const shapeSpringConfig = reduceMotion
    ? { stiffness: 2000, damping: 90 }
    : { stiffness: 340, damping: 28 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);
  const scale = useSpring(presence, { stiffness: 260, damping: 20 });
  const sw = useSpring(targetW, shapeSpringConfig);
  const sh = useSpring(targetH, shapeSpringConfig);

  const setShapeForTarget = (target: EventTarget | null) => {
    const el = target instanceof Element ? target : null;
    if (el?.closest(BUTTON_SELECTOR)) {
      targetW.set(maxButtonWidth);
      targetH.set(maxButtonHeight);
    } else if (el?.closest(TEXT_SELECTOR)) {
      targetW.set(textHoverSize);
      targetH.set(textHoverSize);
    } else {
      targetW.set(size);
      targetH.set(size);
    }
  };

  // Radial displacement map: neutral (128,128) at center, pulling samples
  // toward the lens center with cubic falloff so the bulge lives at the rim.
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = mapSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(mapSize, mapSize);
    const c = mapSize / 2;
    for (let py = 0; py < mapSize; py++) {
      for (let px = 0; px < mapSize; px++) {
        const dx = px - c;
        const dy = py - c;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nd = Math.min(dist / c, 1);
        const strength = nd * nd * nd;
        const ux = dist > 0 ? dx / dist : 0;
        const uy = dist > 0 ? dy / dist : 0;
        const i = (py * mapSize + px) * 4;
        img.data[i] = Math.round(255 * (0.5 - 0.5 * ux * strength));
        img.data[i + 1] = Math.round(255 * (0.5 - 0.5 * uy * strength));
        img.data[i + 2] = 128;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const url = canvas.toDataURL();
    const raf = requestAnimationFrame(() => setMapUrl(url));
    return () => cancelAnimationFrame(raf);
  }, [mapSize]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ width: el.offsetWidth, height: el.offsetHeight });
      // mirror the wrapper's surface so the lens magnifies bg + layout, not just children
      const cs = getComputedStyle(el);
      setCopyStyle({
        backgroundColor: cs.backgroundColor,
        backgroundImage: cs.backgroundImage,
        backgroundSize: cs.backgroundSize,
        backgroundPosition: cs.backgroundPosition,
        padding: cs.padding,
        boxSizing: "border-box",
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lensX = useTransform([sx, sw], ([v, w]) => (v as number) - (w as number) / 2);
  const lensY = useTransform([sy, sh], ([v, h]) => (v as number) - (h as number) / 2);
  // light comes from top-left, so the glass casts its shadow down-right
  const shadowX = useTransform(
    [sx, sw],
    ([v, w]) => (v as number) - (w as number) / 2 + 8
  );
  const shadowY = useTransform(
    [sy, sh],
    ([v, h]) => (v as number) - (h as number) / 2 + 12
  );
  // place the magnified copy so the point under the cursor stays centered in the lens
  const copyX = useTransform(
    [sx, sw],
    ([v, w]) => (w as number) / 2 - magnification * (v as number)
  );
  const copyY = useTransform(
    [sy, sh],
    ([v, h]) => (h as number) / 2 - magnification * (v as number)
  );

  // chromatic aberration: each channel refracts at a different strength
  const scaleR = distortion * (1 + 0.5 * aberration);
  const scaleG = distortion;
  const scaleB = distortion * (1 - 0.5 * aberration);
  const isolate = (channel: 0 | 1 | 2) =>
    [0, 1, 2, 3]
      .map((row) => {
        const r = [0, 0, 0, 0, 0];
        if (row === 3) r[3] = 1;
        else if (row === channel) r[channel] = 1;
        return r.join(" ");
      })
      .join("  ");

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
        presence.set(1);
      }}
      onMouseOver={(e) => setShapeForTarget(e.target)}
      onMouseLeave={() => {
        presence.set(0);
        targetW.set(size);
        targetH.set(size);
      }}
      className={`relative overflow-hidden bg-[#0c0d12] [cursor:none] ${className}`}
    >
      {children}

      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          {mapUrl && (
          <filter
            id={filterId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={mapUrl}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={isolate(0)}
              result="cr"
            />
            <feDisplacementMap
              in="cr"
              in2="map"
              scale={scaleR}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dr"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={isolate(1)}
              result="cg"
            />
            <feDisplacementMap
              in="cg"
              in2="map"
              scale={scaleG}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dg"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={isolate(2)}
              result="cb"
            />
            <feDisplacementMap
              in="cb"
              in2="map"
              scale={scaleB}
              xChannelSelector="R"
              yChannelSelector="G"
              result="db"
            />
            <feComposite
              in="dr"
              in2="dg"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              result="drg"
            />
            <feComposite
              in="drg"
              in2="db"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
            />
          </filter>
          )}
        </defs>
      </svg>

      <motion.div
        aria-hidden="true"
        style={{ x: shadowX, y: shadowY, scale, width: sw, height: sh }}
        className="pointer-events-none absolute left-0 top-0 z-10 rounded-full bg-black/45 blur-xl"
      />

      <motion.div
        aria-hidden="true"
        style={{ x: lensX, y: lensY, scale, width: sw, height: sh }}
        className="pointer-events-none absolute left-0 top-0 z-20 overflow-hidden rounded-full"
      >
        <div
          className="absolute inset-0"
          style={{ filter: mapUrl ? `url(#${filterId})` : undefined }}
        >
          <motion.div
            style={{
              ...copyStyle,
              x: copyX,
              y: copyY,
              scale: magnification,
              width: dims.width,
              height: dims.height,
              transformOrigin: "0 0",
            }}
            className="absolute left-0 top-0"
          >
            {children}
          </motion.div>
        </div>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 45% 30% at 32% 24%, rgba(255,255,255,0.35), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.25), inset 2px 4px 10px rgba(255,255,255,0.18), inset -3px -5px 14px rgba(0,0,0,0.35)",
          }}
        />
      </motion.div>

      {reduceMotion && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute bottom-4 right-4 z-40 w-fit max-w-65 rounded-md bg-black/10 p-3 text-center backdrop-blur-md max-md:hidden"
        >
          <h2 className="text-sm leading-none text-black">
            The lens keeps tracking.
          </h2>
          <p className="mt-2 text-xs leading-5 text-black">
            Liquid Glass Cursor magnifies and refracts whatever your cursor
            passes over. Since the lens is driven entirely by cursor motion,
            there&apos;s no reduced motion version to fall back on.
          </p>
        </div>
      )}
    </div>
  );
}
