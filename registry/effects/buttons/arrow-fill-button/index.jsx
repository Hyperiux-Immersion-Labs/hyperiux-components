"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULT_HREF = "#";
const COMPACT_LAYOUT_BREAKPOINT = 1025;
const ANIMATION_DURATION_MS = 450;

function ArrowFillButton({
  btnText="Hover Me",
  href = DEFAULT_HREF,
  className = "",

  bgColor = "#ff5f00",
  textColor = "#ffffff",

  fillBgColor = "#ffffff",
  fillTextColor = "#ff5f00",

  hoverFillBgColor = "#ffffff",
  hoverFillTextColor = "#ff5f00",

  arrowColor,
  hoverArrowColor,

  ...props
}) {
  const [isReady, setIsReady] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const releaseTimeoutRef = useRef(null);

  const usesUtilityBackground =
    className.includes("bg-") ||
    className.includes("from-") ||
    className.includes("via-") ||
    className.includes("to-");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${COMPACT_LAYOUT_BREAKPOINT - 1}px)`
    );

    const syncCompactLayout = (event) => {
      const matches = "matches" in event ? event.matches : event.currentTarget.matches;
      setIsCompactLayout(matches);

      if (!matches) {
        setIsPressed(false);
      }
    };

    syncCompactLayout(mediaQuery);
    mediaQuery.addEventListener("change", syncCompactLayout);

    return () => {
      mediaQuery.removeEventListener("change", syncCompactLayout);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (releaseTimeoutRef.current) {
        window.clearTimeout(releaseTimeoutRef.current);
      }
    };
  }, []);

  const clearPressedState = () => {
    if (releaseTimeoutRef.current) {
      window.clearTimeout(releaseTimeoutRef.current);
    }

    releaseTimeoutRef.current = window.setTimeout(() => {
      setIsPressed(false);
      releaseTimeoutRef.current = null;
    }, ANIMATION_DURATION_MS);
  };

  const handlePointerDown = (event) => {
    props.onPointerDown?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    if (releaseTimeoutRef.current) {
      window.clearTimeout(releaseTimeoutRef.current);
      releaseTimeoutRef.current = null;
    }

    setIsPressed(true);
  };

  const handlePointerUp = (event) => {
    props.onPointerUp?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    clearPressedState();
  };

  const handlePointerCancel = (event) => {
    props.onPointerCancel?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    clearPressedState();
  };

  return (
    <Link
      href={href}
      {...props}
      data-pressed={isPressed ? "true" : "false"}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`group relative inline-flex h-[4.2vw] w-fit min-w-fit max-w-none cursor-pointer items-center justify-center overflow-hidden rounded-full px-[3vw] pr-[calc(var(--icon-circle)+var(--icon-right)+2vw)] whitespace-nowrap font-medium text-[1.1vw] leading-none [text-rendering:geometricPrecision] [--icon-circle:3.1vw] [--icon-right:0.55vw] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-xl:h-[11vw] max-xl:px-[5vw] max-xl:pr-[calc(var(--icon-circle)+var(--icon-right)+4vw)] max-xl:text-[3vw] max-xl:font-normal max-xl:[--icon-circle:8vw] max-xl:[--icon-right:1.5vw] max-md:h-[15vw] max-md:px-[7vw] max-md:pr-[calc(var(--icon-circle)+var(--icon-right)+5vw)] max-md:text-[4.2vw] max-md:[--icon-circle:11vw] max-md:[--icon-right:2vw] ${
        usesUtilityBackground ? "" : "bg-(--btn-bg)"
      } text-(--btn-text) ${className}`}
      style={{
        "--btn-bg": bgColor,
        "--btn-text": textColor,
        "--btn-fill-bg": fillBgColor,
        "--btn-fill-text": fillTextColor,
        "--btn-fill-bg-hover": hoverFillBgColor,
        "--btn-fill-text-hover": hoverFillTextColor,
        "--btn-arrow": arrowColor || fillTextColor,
        "--btn-arrow-hover": hoverArrowColor || hoverFillTextColor,
        visibility: isReady ? "visible" : "hidden",
      }}
    >
      <span className="relative z-1 pb-px">{btnText}</span>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute z-2 rounded-full bg-(--btn-fill-bg) inset-[var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle))] ${
          isReady
            ? "transition-all duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:bg-(--btn-fill-bg-hover) group-hover:inset-0 group-data-[pressed=true]:bg-(--btn-fill-bg-hover) group-data-[pressed=true]:inset-0"
            : ""
        }`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-2 flex items-center px-[3vw] pr-[calc(var(--icon-circle)+var(--icon-right)+2vw)] text-(--btn-fill-text) [clip-path:inset(var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle)))] max-xl:px-[5vw] max-xl:pr-[calc(var(--icon-circle)+var(--icon-right)+4vw)] max-md:px-[7vw] max-md:pr-[calc(var(--icon-circle)+var(--icon-right)+5vw)] ${
          isReady
            ? "transition-all duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:text-(--btn-fill-text-hover) group-hover:[clip-path:inset(0_0_0_0)] group-data-[pressed=true]:text-(--btn-fill-text-hover) group-data-[pressed=true]:[clip-path:inset(0_0_0_0)]"
            : ""
        }`}
      >
        <span className="relative z-1 pb-px whitespace-nowrap">{btnText}</span>
      </div>

      <span
        className={`pointer-events-none absolute right-[var(--icon-right)] top-1/2 z-3 inline-flex h-[var(--icon-circle)] w-[var(--icon-circle)] shrink-0 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-(--btn-fill-bg) text-(--btn-arrow) ${
          isReady
            ? "transition-colors duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:bg-(--btn-fill-bg-hover) group-hover:text-(--btn-arrow-hover) group-data-[pressed=true]:bg-(--btn-fill-bg-hover) group-data-[pressed=true]:text-(--btn-arrow-hover)"
            : ""
        }`}
        style={{
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          maskImage: "radial-gradient(white, black)",
        }}
        aria-hidden="true"
      >
          <ArrowRight
            className={`absolute left-1/2 top-1/2 size-[1.5vw] max-xl:size-[4vw] max-md:size-[5vw] translate-x-[-170%] -translate-y-1/2 origin-center scale-0 text-current ${
              isReady
                ? "transition-transform duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:scale-100 group-data-[pressed=true]:-translate-x-1/2 group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-100"
                : ""
            }`}
            strokeWidth={1.8}
          />

          <ArrowRight
            className={`absolute left-1/2 top-1/2 size-[1.5vw] max-xl:size-[4vw] max-md:size-[5vw] -translate-x-1/2 -translate-y-1/2 origin-center text-current ${
              isReady
                ? "transition-transform duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:translate-x-[70%] group-hover:-translate-y-1/2 group-hover:scale-0 group-data-[pressed=true]:translate-x-[70%] group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-0"
                : ""
            }`}
            strokeWidth={1.8}
          />
        </span>
    </Link>
  );
}

export default ArrowFillButton;
