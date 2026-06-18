"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULT_HREF = "#";

export function ArrowFillButton({
  btnText,
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

  return (
    <Link
      href={href}
      {...props}
      className={`group relative inline-flex h-[4.2vw] w-fit min-w-fit max-w-none cursor-pointer items-center justify-center overflow-hidden rounded-full px-[3vw] pr-[calc(var(--icon-circle)+var(--icon-right)+2vw)] whitespace-nowrap font-medium text-[1.1vw] leading-none [text-rendering:geometricPrecision] [--icon-circle:3.1vw] [--icon-right:0.55vw] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-lg:h-[11vw] max-lg:px-[5vw] max-lg:pr-[calc(var(--icon-circle)+var(--icon-right)+4vw)] max-lg:text-[3vw] max-lg:font-normal max-lg:[--icon-circle:8vw] max-lg:[--icon-right:1.5vw] max-md:h-[15vw] max-md:px-[7vw] max-md:pr-[calc(var(--icon-circle)+var(--icon-right)+5vw)] max-md:text-[4.2vw] max-md:[--icon-circle:11vw] max-md:[--icon-right:2vw] ${
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
        className={`pointer-events-none absolute inset-0 z-2 flex items-center rounded-full bg-(--btn-fill-bg) px-[3vw] pr-[calc(var(--icon-circle)+var(--icon-right)+2vw)] text-(--btn-fill-text) [clip-path:inset(var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle))_round_9999px)] max-lg:px-[5vw] max-lg:pr-[calc(var(--icon-circle)+var(--icon-right)+4vw)] max-md:px-[7vw] max-md:pr-[calc(var(--icon-circle)+var(--icon-right)+5vw)] ${
          isReady
            ? "transition-all duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:bg-(--btn-fill-bg-hover) group-hover:text-(--btn-fill-text-hover) group-hover:[clip-path:inset(0_0_0_0_round_9999px)]"
            : ""
        }`}
      >
        <span className="relative z-1 pb-px whitespace-nowrap">{btnText}</span>

        <span
          className={`absolute right-[var(--icon-right)] top-1/2 z-2 inline-flex h-[var(--icon-circle)] w-[var(--icon-circle)] shrink-0 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-(--btn-fill-bg) text-(--btn-arrow) ${
            isReady
              ? "transition-colors duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:bg-(--btn-fill-bg-hover) group-hover:text-(--btn-arrow-hover)"
              : ""
          }`}
          aria-hidden="true"
        >
          <ArrowRight
            className={`absolute left-1/2 top-1/2 size-[1.5vw] max-lg:size-[4vw] max-md:size-[5vw] -translate-x-[170%] -translate-y-1/2 origin-center scale-0 text-current ${
              isReady
                ? "transition-transform duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:scale-100"
                : ""
            }`}
            strokeWidth={1.8}
          />

          <ArrowRight
            className={`absolute left-1/2 top-1/2 size-[1.5vw] max-lg:size-[4vw] max-md:size-[5vw] -translate-x-1/2 -translate-y-1/2 origin-center text-current ${
              isReady
                ? "transition-transform duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:translate-x-[70%] group-hover:-translate-y-1/2 group-hover:scale-0"
                : ""
            }`}
            strokeWidth={1.8}
          />
        </span>
      </div>
    </Link>
  );
}

export default ArrowFillButton;