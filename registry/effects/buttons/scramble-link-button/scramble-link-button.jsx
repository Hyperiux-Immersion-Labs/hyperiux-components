/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const DEFAULT_TEXT = "";
const DEFAULT_HREF = "#";
const DEFAULT_HOVER_COLOR = "#ff6b00";
const DEFAULT_SCRAMBLE_DURATION = 700;
const DEFAULT_STEP_MS = 30;
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
  text = DEFAULT_TEXT,
  href = DEFAULT_HREF,
  className = "",
  textClassName = "",
  linkProps = {},
  children,
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

  // Derived values
  const finalText = typeof children === "string" ? children : text;
  const innerClassName = `relative inline-block ${
    showLine
      ? `w-fit after:absolute after:left-0 after:bottom-[-4%] after:h-[1.5px] after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-[450ms] after:ease-[cubic-bezier(0.625,0.05,0,1)] after:content-[''] group-hover:after:origin-left group-hover:after:scale-x-100 ${lineClassName}`
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

  const onMouseEnter = () => {
    const element = scrambleRef.current;

    if (!element || !finalText.length) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    let iteration = 0;
    const maxIterations = Math.max(1, Math.floor(scrambleDuration / stepMs));

    const runScramble = () => {
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
      className={`group inline-flex items-center gap-2 text-inherit no-underline transition-colors duration-350 ease-in-out hover:text-(--scramble-hover-color) ${className}`}
      style={{ "--scramble-hover-color": hoverColor }}
    >
      <span className={innerClassName}>
        <span
          className={`pointer-events-none inline-block select-none whitespace-pre invisible [font-variant-ligatures:none] ${textClassName}`}
        >
          {finalText}
        </span>

        <span
          ref={scrambleRef}
          className={`absolute inset-0 inline-block whitespace-pre [font-variant-ligatures:none] ${textClassName}`}
          aria-label={finalText}
        >
          {finalText}
        </span>
      </span>

      {showArrow && Icon && (
        <span className={`inline-flex items-center justify-center ${iconClassName}`}>
          <Icon className="transition-transform duration-300 ease-in-out group-hover:-rotate-45" />
        </span>
      )}
    </Link>
  );
}
