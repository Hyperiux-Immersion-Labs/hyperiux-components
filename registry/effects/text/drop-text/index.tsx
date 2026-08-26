// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";

type StaggerFrom = "left" | "right" | "center" | "random";
type SplitBy = "characters" | "words" | "lines";
type TextAlign = "left" | "center" | "right";
type DropTextVariant = "drop" | "perspective";
type DropTextEase =
  | "linear"
  | "power2.out"
  | "power2.in"
  | "power2.inOut"
  | "back.out(1.7)"
  | "circ.out"
  | "expo.out";

type DropTextProps = {
  text?: string;
  variant?: DropTextVariant;
  splitBy?: SplitBy;
  staggerFrom?: StaggerFrom;
  xOffset?: number;
  yOffset?: number;
  rotate?: number;
  blur?: number;
  scaleFrom?: number;
  startOpacity?: number;
  fontSize?: number;
  fontColor?: string;
  textAlign?: TextAlign;
  lineHeight?: number;
  letterSpacing?: number;
  backgroundColor?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: DropTextEase;
  animateOnScroll?: boolean;
  className?: string;
};

const DEFAULT_TEXT = "Motion Makes Spaces Move";


function mapStaggerFrom(staggerFrom: StaggerFrom) {
  if (staggerFrom === "left") return "start";
  if (staggerFrom === "right") return "end";
  return staggerFrom;
}

function splitText(text: string, splitBy: SplitBy) {
  if (splitBy === "lines") {
    return text.split(/\n/).map((line, index, lines) => ({
      value: line,
      separator: index < lines.length - 1 ? "\n" : "",
    }));
  }

  if (splitBy === "words") {
    const matches = text.match(/\S+\s*/g);
    return (matches ?? [text]).map((word) => ({
      value: word.trimEnd(),
      separator: word.endsWith(" ") ? "\u00a0" : "",
    }));
  }

  return Array.from(text).map((character) => ({
    value: character === " " ? "\u00a0" : character,
    separator: "",
  }));
}

export default function DropText({
  text = DEFAULT_TEXT,
  variant = "drop",
  splitBy = "characters",
  staggerFrom = "random",
  xOffset = 0,
  yOffset = -115,
  rotate = 0,
  blur = 0,
  scaleFrom = 1,
  startOpacity = 0,
  fontSize = 6,
  fontColor = "#ffffff",
  textAlign = "center",
  lineHeight = 1,
  letterSpacing = 0,
  backgroundColor = "#101113",
  duration = 0.5,
  delay = 0,
  stagger = 0.05,
  ease = "power2.out",
  animateOnScroll = false,
  className = "",
}: DropTextProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLHeadingElement>(null);
  const segments = useMemo(() => splitText(text, splitBy), [text, splitBy]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const initialPieceStyle: CSSProperties = prefersReducedMotion
    ? {}
    : {
        opacity: startOpacity,
        filter: `blur(${blur}px)`,
        transform: [
          `translate3d(${xOffset}px, ${yOffset}px, ${variant === "perspective" ? -420 : 0}px)`,
          `rotate(${rotate}deg)`,
          `rotateX(${variant === "perspective" ? 68 : 0}deg)`,
          `scale(${scaleFrom})`,
        ].join(" "),
      };

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mediaQuery) return;

    setPrefersReducedMotion(mediaQuery.matches);

    const onReduceMotionChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener?.("change", onReduceMotionChange);

    return () => {
      mediaQuery.removeEventListener?.("change", onReduceMotionChange);
    };
  }, []);

  const playAnimation = useCallback(() => {
    if (!containerRef.current) return;
    const pieces = containerRef.current.querySelectorAll<HTMLElement>("[data-drop-piece]");

    gsap.killTweensOf(pieces);

    if (prefersReducedMotion) {
      gsap.set(pieces, {
        x: 0,
        y: 0,
        z: 0,
        rotate: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
      });
      return;
    }

    gsap.fromTo(
      pieces,
      {
        x: xOffset,
        y: yOffset,
        z: variant === "perspective" ? -420 : 0,
        rotate,
        rotateX: variant === "perspective" ? 68 : 0,
        scale: scaleFrom,
        opacity: startOpacity,
        filter: `blur(${blur}px)`,
      },
      {
        x: 0,
        y: 0,
        z: 0,
        rotate: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration,
        delay,
        stagger: {
          each: stagger,
          from: mapStaggerFrom(staggerFrom),
        },
        ease,
      },
    );
  }, [blur, delay, duration, ease, prefersReducedMotion, rotate, scaleFrom, stagger, staggerFrom, startOpacity, variant, xOffset, yOffset]);

  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    const playAfterPaint = () => {
      const fontsReady = "fonts" in document ? document.fonts.ready : Promise.resolve();

      fontsReady.finally(() => {
        if (cancelled) return;
        frame = requestAnimationFrame(() => {
          if (!cancelled) playAnimation();
        });
      });
    };

    if (!animateOnScroll) {
      playAfterPaint();
      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
        if (!containerRef.current) return;
        const pieces = containerRef.current.querySelectorAll<HTMLElement>("[data-drop-piece]");
        gsap.killTweensOf(pieces);
      };
    }

    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          playAfterPaint();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(sectionRef.current);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      if (!containerRef.current) return;
      const pieces = containerRef.current.querySelectorAll<HTMLElement>("[data-drop-piece]");
      gsap.killTweensOf(pieces);
    };
  }, [animateOnScroll, playAnimation, segments]);

  return (
    <section
      ref={sectionRef}
      className={`flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-16 ${className}`}
      style={{
        backgroundColor,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        perspective: variant === "perspective" ? "900px" : undefined,
      }}
    >
      <h2
        ref={containerRef}
        className="m-0 block w-full select-none whitespace-pre-wrap"
        style={{
          color: fontColor,
          fontSize: `${fontSize}vw`,
          fontWeight: 400,
          letterSpacing: `${letterSpacing}em`,
          lineHeight,
          textAlign,
          transformStyle: variant === "perspective" ? "preserve-3d" : undefined,
        }}
      >
        {segments.map((segment, index) => (
          <span
            key={`${segment.value}-${index}`}
            data-drop-piece
            className={splitBy === "lines" ? "block" : "inline-block"}
            style={{
              ...initialPieceStyle,
              backfaceVisibility: variant === "perspective" ? "hidden" : undefined,
              transformStyle: variant === "perspective" ? "preserve-3d" : undefined,
            }}
          >
            {segment.value}
            {segment.separator}
          </span>
        ))}
      </h2>
    </section>
  );
}
