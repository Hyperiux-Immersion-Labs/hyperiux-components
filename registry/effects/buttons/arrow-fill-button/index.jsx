"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ArrowFillButton({
  btnText,
  className = "",

  bgColor = "#ff5f00",
  textColor = "#ffffff",

  fillBgColor = "#ffffff",
  fillTextColor = "#ff5f00",

  hoverFillBgColor = "#ffffff",
  hoverFillTextColor = "#ff5f00",

  // NEW
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
      {...props}
      className={`group relative inline-flex h-[4.2vw] w-fit max-w-none min-w-0 cursor-default items-center justify-center overflow-hidden rounded-full px-[3vw] pr-[calc(var(--icon-slot)+1.4vw)] whitespace-nowrap font-medium text-[1.1vw] [text-rendering:geometricPrecision] [--icon-slot:3.6vw] [--icon-circle:2.2vw] max-md:h-[11vw] max-md:px-[5vw] max-md:pr-[calc(var(--icon-slot)+3vw)] max-md:text-[3vw] max-md:font-normal max-md:[--icon-slot:9vw] max-md:[--icon-circle:5.5vw] max-sm:h-[15vw] max-sm:px-[7vw] max-sm:pr-[calc(var(--icon-slot)+4vw)] max-sm:text-[4.2vw] max-sm:[--icon-slot:12.5vw] max-sm:[--icon-circle:7.5vw] ${usesUtilityBackground ? "" : "bg-(--btn-bg)"} text-(--btn-text) ${className}`}
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
        className={`pointer-events-none absolute -inset-px z-2 flex items-center rounded-full bg-(--btn-fill-bg) px-[3vw] pr-[calc(var(--icon-slot)+1.4vw)] text-(--btn-fill-text) [clip-path:inset(0.7vw_0.7vw_0.7vw_calc(100%-var(--icon-slot))_round_9999px)] max-md:px-[5vw] max-md:pr-[calc(var(--icon-slot)+3vw)] max-md:[clip-path:inset(16%_6%_18%_calc(100%-var(--icon-slot))_round_9999px)] max-sm:px-[7vw] max-sm:pr-[calc(var(--icon-slot)+4vw)] max-sm:[clip-path:inset(18%_6%_18%_calc(100%-var(--icon-slot))_round_9999px)] ${isReady ? "transition-all duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:bg-(--btn-fill-bg-hover) group-hover:text-(--btn-fill-text-hover) group-hover:[clip-path:inset(0_round_9999px)]" : ""}`}
      >
        <span>{btnText}</span>

        <div className="flex w-full items-center gap-[1vw] whitespace-nowrap pb-px max-md:gap-[2vw] max-sm:gap-[2.5vw]">
          <span
            className={`absolute right-[0.7vw] max-md:right-[2.2vw] top-1/2 inline-flex h-[var(--icon-circle)] min-h-[var(--icon-circle)] w-[var(--icon-circle)] min-w-[var(--icon-circle)] shrink-0 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-(--btn-fill-bg) text-(--btn-arrow)  max-sm:right-[2.5vw] ${isReady ? "transition-colors duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:bg-(--btn-fill-bg-hover) group-hover:text-(--btn-arrow-hover)" : ""}`}
            aria-hidden="true"
          >
            <ArrowRight
              className={`${isReady ? "transition-transform duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)]" : ""} absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-[170%] -translate-y-1/2 origin-center scale-0 text-current group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:scale-100`}
              strokeWidth={1.8}
            />
            <ArrowRight
              className={`${isReady ? "transition-transform duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)]" : ""} absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 origin-center text-current group-hover:translate-x-[70%] group-hover:-translate-y-1/2 group-hover:scale-0`}
              strokeWidth={1.8}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
