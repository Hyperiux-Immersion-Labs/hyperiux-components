// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ImagePixelRevealDirection = "up" | "down" | "left" | "right";

export type ImagePixelRevealHandle = {
  element: HTMLDivElement | null;
  setProgress: (value: number) => void;
  play: () => void;
};

export type ImagePixelRevealProps = {
  imageSrc?: string;
  alt?: string;
  gridSize?: number;
  edgeHeight?: number;
  direction?: ImagePixelRevealDirection;
  scrub?: boolean;
  autoScrub?: boolean;
  start?: string;
  end?: string;
  duration?: number;
  className?: string;
  children?: ReactNode;
  onRevealComplete?: () => void;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const ImagePixelReveal = forwardRef<ImagePixelRevealHandle, ImagePixelRevealProps>(function ImagePixelReveal(
  {
    imageSrc = "",
    alt = "",
    gridSize = 24,
    edgeHeight = 0.3,
    direction = "down",
    scrub = false,
    autoScrub = true,
    start = "top 90%",
    end = "top 40%",
    duration = 1.4,
    className = "",
    children,
    onRevealComplete,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const gridRef = useRef({ cols: 0, rows: 0, width: 0, height: 0, noise: new Float32Array(0) });
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const completeRef = useRef(onRevealComplete);

  completeRef.current = onRevealComplete;

  const draw = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    const { cols, rows, width, height, noise } = gridRef.current;
    const progress = progressRef.current;

    if (progress >= 1) {
      content.style.clipPath = "none";
      return;
    }
    if (progress <= 0 || cols === 0) {
      content.style.clipPath = "inset(50%)";
      return;
    }

    const edge = clamp(edgeHeight);
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    let path = "";

    for (let row = 0; row < rows; row += 1) {
      let runStart = -1;

      for (let col = 0; col <= cols; col += 1) {
        let shown = false;

        if (col < cols) {
          const x = cols > 1 ? col / (cols - 1) : 0;
          const y = rows > 1 ? row / (rows - 1) : 0;
          const along =
            direction === "up" ? 1 - y : direction === "down" ? y : direction === "left" ? 1 - x : x;
          shown = progress >= along * (1 - edge) + noise[row * cols + col] * edge;
        }

        if (shown && runStart < 0) runStart = col;

        if (!shown && runStart >= 0) {
          const left = (runStart * cellWidth).toFixed(1);
          const top = (row * cellHeight).toFixed(1);
          const runWidth = ((col - runStart) * cellWidth + 0.5).toFixed(1);
          path += `M${left} ${top}h${runWidth}v${(cellHeight + 0.5).toFixed(1)}h-${runWidth}z`;
          runStart = -1;
        }
      }
    }

    content.style.clipPath = path ? `path("${path}")` : "inset(50%)";
  }, [direction, edgeHeight]);

  const setProgress = useCallback(
    (value: number) => {
      const next = clamp(value);
      const wasComplete = progressRef.current >= 1;
      progressRef.current = next;
      draw();
      if (next >= 1 && !wasComplete) completeRef.current?.();
    },
    [draw],
  );

  const play = useCallback(() => {
    tweenRef.current?.kill();
    const state = { value: progressRef.current };
    tweenRef.current = gsap.to(state, {
      value: 1,
      duration,
      ease: "power2.inOut",
      onUpdate: () => setProgress(state.value),
    });
  }, [duration, setProgress]);

  useImperativeHandle(
    ref,
    () => ({ element: containerRef.current, setProgress, play }),
    [setProgress, play],
  );

  useEffect(() => () => {
    tweenRef.current?.kill();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const layout = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      const cols = Math.max(1, Math.round(width / gridSize));
      const rows = Math.max(1, Math.round(height / gridSize));
      const previous = gridRef.current;
      let noise = previous.noise;

      if (previous.cols !== cols || previous.rows !== rows) {
        noise = new Float32Array(cols * rows);
        for (let index = 0; index < noise.length; index += 1) noise[index] = Math.random();
      }

      gridRef.current = { cols, rows, width, height, noise };
      draw();
    };

    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(container);
    return () => observer.disconnect();
  }, [draw, gridSize]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container || !autoScrub) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setProgress(1);
        return;
      }

      setProgress(0);

      if (!scrub) {
        ScrollTrigger.create({ trigger: container, start, once: true, onEnter: play });
        return;
      }

      const state = { value: 0 };

      gsap.to(state, {
        value: 1,
        ease: "none",
        duration,
        onUpdate: () => setProgress(state.value),
        scrollTrigger: { trigger: container, start, end, scrub: true, invalidateOnRefresh: true },
      });
    },
    { dependencies: [autoScrub, scrub, start, end, duration, setProgress, play], scope: containerRef },
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`.trim()}>
      <div ref={contentRef} className="h-full w-full [clip-path:inset(50%)]">
        {/* eslint-disable-next-line @next/next/no-img-element -- shipped outside Next.js too */}
        {imageSrc ? <img src={imageSrc} alt={alt} className="h-full w-full object-cover" /> : null}
        {children}
      </div>
    </div>
  );
});

export default ImagePixelReveal;
