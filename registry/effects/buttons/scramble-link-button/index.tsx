// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import React, { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ComponentType, type CSSProperties, type MouseEventHandler, type PointerEvent, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const DEFAULT_TEXT = "Hover me";
const DEFAULT_HREF = "#";
const DEFAULT_HOVER_COLOR = "#ff6b00";
const DEFAULT_SCRAMBLE_DURATION = 1000;
const DEFAULT_STEP_MS = 50;
const DEFAULT_REVEAL_STAGGER = 1.4;
const COMPACT_LAYOUT_BREAKPOINT = 1025;
const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789";

interface GetScrambledTextOptions {
  finalText: string;
  iteration: number;
  maxIterations: number;
  revealStagger: number;
}

function getScrambledText({
  finalText,
  iteration,
  maxIterations,
  revealStagger,
}: GetScrambledTextOptions): string {
  let output = "";

  for (let index = 0; index < finalText.length; index += 1) {
    const char = finalText[index];

    if (char === " ") {
      output += char;
      continue;
    }

    const revealThreshold =
      (((index + 1) / finalText.length) * maxIterations) / revealStagger;

    if (iteration >= revealThreshold) {
      output += char;
      continue;
    }

    output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }

  return output;
}

export interface ScrambleLinkButtonOwnProps {
  text?: string;
  href?: string;
  className?: string;
  textClassName?: string;
  linkProps?: Partial<ComponentPropsWithoutRef<typeof Link>>;
  children?: ReactNode;
  textColor?: string;
  hoverColor?: string;
  showLine?: boolean;
  lineClassName?: string;
  showArrow?: boolean;
  icon?: ComponentType<{ className?: string }>;
  iconClassName?: string;
  scrambleDuration?: number;
  stepMs?: number;
  revealStagger?: number;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export type ScrambleLinkButtonProps = ScrambleLinkButtonOwnProps & Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'onClick' | keyof ScrambleLinkButtonOwnProps>;

export default function ScrambleLinkButton({
  text = DEFAULT_TEXT,
  href = DEFAULT_HREF,
  className = "",
  textClassName = "",
  linkProps = {},
  children,
  textColor = "",
  hoverColor = DEFAULT_HOVER_COLOR,
  showLine = false,
  lineClassName = "",
  showArrow = false,
  icon: Icon = ArrowRight,
  iconClassName = "",
  scrambleDuration = DEFAULT_SCRAMBLE_DURATION,
  stepMs = DEFAULT_STEP_MS,
  revealStagger = DEFAULT_REVEAL_STAGGER,
  onClick,
  ...props
}: ScrambleLinkButtonProps) {
  const scrambleRef = useRef<HTMLSpanElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Derived values
  const finalText = typeof children === "string" ? children : text;
  const activeTextStyle =
    isCompactLayout && isPressed ? { color: hoverColor } : undefined;
  const activeLineStyle =
    isCompactLayout && isPressed ? { color: hoverColor } : undefined;
  const innerClassName = `relative inline-block ${
    showLine
      ? `w-fit after:absolute after:left-0 after:bottom-[-4%] after:h-[1.5px] after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-[450ms] after:ease-[cubic-bezier(0.625,0.05,0,1)] after:content-[''] motion-reduce:after:transition-none motion-safe:group-hover:after:origin-left motion-safe:group-hover:after:scale-x-100 motion-safe:group-data-[pressed=true]:after:origin-left motion-safe:group-data-[pressed=true]:after:scale-x-100 ${lineClassName}`
      : ""
  }`;

  useEffect(() => {
    // Text sync
    if (scrambleRef.current) {
      scrambleRef.current.textContent = finalText;
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [finalText]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${COMPACT_LAYOUT_BREAKPOINT - 1}px)`
    );

    const syncCompactLayout = (event: MediaQueryList | MediaQueryListEvent) => {
      const matches = "matches" in event ? event.matches : ((event as any).currentTarget as MediaQueryList).matches;
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

  const runScramble = () => {
    const element = scrambleRef.current;

    if (!element || !finalText.length) {
      return;
    }

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      element.textContent = finalText;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    let iteration = 0;
    const maxIterations = Math.max(1, Math.floor(scrambleDuration / stepMs));

    const updateScramble = () => {
      element.textContent = getScrambledText({
        finalText,
        iteration,
        maxIterations,
        revealStagger,
      });

      if (iteration >= maxIterations) {
        element.textContent = finalText;
        return;
      }

      iteration += 1;
      timeoutRef.current = setTimeout(updateScramble, stepMs);
    };

    updateScramble();
  };

  const onMouseEnter = () => {
    runScramble();
  };

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerDown?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    setIsPressed(true);
    runScramble();
  };

  const handlePointerUp = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerUp?.(event);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLAnchorElement>) => {
    props.onPointerCancel?.(event);
  };

  return (
    <Link
      href={href}
      {...linkProps}
      {...props}
      data-pressed={isPressed ? "true" : "false"}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`group inline-flex w-fit items-center gap-2 cursor-pointer text-[1.1vw] ${textColor ? "text-(--scramble-text-color)" : "text-inherit"} no-underline transition-colors duration-350 ease-in-out motion-reduce:transition-none hover:text-(--scramble-hover-color) group-data-[pressed=true]:text-(--scramble-hover-color) max-[1025px]:text-[3vw] max-md:text-[4.2vw] ${className}`}
      style={{ "--scramble-hover-color": hoverColor, ...(textColor ? { "--scramble-text-color": textColor } : {}) } as CSSProperties & Record<string, string>}
    >
      <span className={innerClassName} style={activeLineStyle}>
        <span
          className={`pointer-events-none inline-block select-none whitespace-pre invisible [font-variant-ligatures:none] ${textClassName}`}
          style={activeTextStyle}
        >
          {finalText}
        </span>

        <span
          ref={scrambleRef}
          className={`absolute inset-0 inline-block whitespace-pre text-left text-current [font-variant-ligatures:none] ${textClassName}`}
          style={activeTextStyle}
          aria-label={finalText}
        >
          {finalText}
        </span>
      </span>

      {showArrow && Icon && (
        <span className={`inline-flex items-center justify-center ${iconClassName}`}>
          <Icon className="transition-transform duration-300 ease-in-out motion-reduce:rotate-0 motion-reduce:transition-none motion-safe:group-hover:-rotate-45 motion-safe:group-data-[pressed=true]:-rotate-45" />
        </span>
      )}
    </Link>
  );
}
