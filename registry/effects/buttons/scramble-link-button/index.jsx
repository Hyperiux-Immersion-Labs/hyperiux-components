"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const DEFAULT_BTN_TEXT = "";
const DEFAULT_HREF = "#";
const DEFAULT_HOVER_COLOR = "#ff6b00";
const DEFAULT_SCRAMBLE_DURATION = 1000;
const DEFAULT_STEP_MS = 50;
const DEFAULT_REVEAL_STAGGER = 1.4;
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

  const innerClassName = `relative inline-block ${
    showLine
      ? `w-fit after:absolute after:left-0 after:bottom-[-4%] after:h-[1.5px] after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-[450ms] after:ease-[cubic-bezier(0.625,0.05,0,1)] after:content-[''] group-hover:after:origin-left group-hover:after:scale-x-100 ${lineClassName}`
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

  const onMouseEnter = () => {
    const element = scrambleRef.current;

    if (!element || !btnText.length) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    let iteration = 0;
    const maxIterations = Math.max(1, Math.floor(scrambleDuration / stepMs));

    const runScramble = () => {
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
      timeoutRef.current = setTimeout(runScramble, stepMs);
    };

    runScramble();
  };

  return (
    <Link
      href={href}
      {...linkProps}
      {...props}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`group inline-flex cursor-pointer items-center gap-2  text-[1.1vw] text-inherit no-underline transition-colors duration-350 ease-in-out hover:text-(--scramble-hover-color) max-lg:text-[3vw] max-sm:text-[4.2vw] ${className}`}
      style={{ "--scramble-hover-color": hoverColor }}
    >
      <span className={innerClassName}>
        <span
          className={`pointer-events-none invisible inline-block select-none whitespace-pre [font-variant-ligatures:none] ${textClassName}`}
        >
          {btnText}
        </span>

        <span
          ref={scrambleRef}
          className={`absolute inset-0 inline-block whitespace-pre text-left [font-variant-ligatures:none] ${textClassName}`}
          aria-label={btnText}
        >
          {btnText}
        </span>
      </span>

      {showArrow && Icon && (
        <span
          className={`inline-flex items-center justify-center ${iconClassName}`}
        >
          <Icon className="transition-transform duration-300 ease-in-out group-hover:-rotate-45" />
        </span>
      )}
    </Link>
  );
}

export default ScrambleLinkButton;