"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const DEFAULT_BTN_TEXT = "";
const DEFAULT_HREF = "#";
const DEFAULT_HOVER_COLOR = "#ff6b00";
const DEFAULT_SCRAMBLE_DURATION = 1000;
const DEFAULT_STEP_MS = 50;
const DEFAULT_REVEAL_STAGGER = 1.4;
const COMPACT_LAYOUT_BREAKPOINT = 1025;
const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789";

function getScrambledText({
  finalText,
  iteration,
  maxIterations,
  revealStagger,
}) {
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

export function ScrambleLinkButton({
  btnText = DEFAULT_BTN_TEXT,
  href = DEFAULT_HREF,
  className = "",
  textClassName = "",
  linkProps = {},
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
}) {
  const scrambleRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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
    if (scrambleRef.current) {
      scrambleRef.current.textContent = btnText;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [btnText]);

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

  const runScramble = () => {
    const element = scrambleRef.current;

    if (!element || !btnText.length) {
      return;
    }

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      element.textContent = btnText;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    let iteration = 0;
    const maxIterations = Math.max(1, Math.floor(scrambleDuration / stepMs));

    const updateScramble = () => {
      element.textContent = getScrambledText({
        finalText: btnText,
        iteration,
        maxIterations,
        revealStagger,
      });

      if (iteration >= maxIterations) {
        element.textContent = btnText;
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

  const handlePointerDown = (event) => {
    props.onPointerDown?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    setIsPressed(true);
    runScramble();
  };

  const handlePointerUp = (event) => {
    props.onPointerUp?.(event);
  };

  const handlePointerCancel = (event) => {
    props.onPointerCancel?.(event);
  };

  return (
    <a
      href={href}
      {...linkProps}
      {...props}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      data-pressed={isPressed ? "true" : "false"}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`group inline-flex cursor-pointer items-center gap-2  text-[1.1vw] text-inherit no-underline transition-colors duration-350 ease-in-out motion-reduce:transition-none hover:text-(--scramble-hover-color) group-data-[pressed=true]:text-(--scramble-hover-color) max-lg:text-[3vw] max-md:text-[4.2vw] ${className}`}
      style={{ "--scramble-hover-color": hoverColor }}
    >
      <span className={innerClassName} style={activeLineStyle}>
        <span
          className={`pointer-events-none invisible inline-block select-none whitespace-pre [font-variant-ligatures:none] ${textClassName}`}
          style={activeTextStyle}
        >
          {btnText}
        </span>

        <span
          ref={scrambleRef}
          className={`absolute inset-0 inline-block whitespace-pre text-left [font-variant-ligatures:none] ${textClassName}`}
          style={activeTextStyle}
          aria-label={btnText}
        >
          {btnText}
        </span>
      </span>

      {showArrow && Icon && (
        <span
          className={`inline-flex items-center justify-center ${iconClassName}`}
        >
          <Icon className="transition-transform duration-300 ease-in-out motion-reduce:rotate-0 motion-reduce:transition-none motion-safe:group-hover:-rotate-45 motion-safe:group-data-[pressed=true]:-rotate-45" />
        </span>
      )}
    </a>
  );
}

export default ScrambleLinkButton;
