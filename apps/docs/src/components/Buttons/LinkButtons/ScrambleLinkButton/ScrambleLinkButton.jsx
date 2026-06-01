"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import "./ScrambleLinkButton.css";

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

export default function ScrambleLinkButton({
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
  const innerClassName = `scramble-link-btn__inner ${
    showLine ? `scramble-link-line ${lineClassName}` : ""
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
      className={`scramble-link-btn inline-flex items-center gap-2 ${className}`}
      style={{ "--scramble-hover-color": hoverColor }}
    >
      <span className={innerClassName}>
        <span className={`scramble-link-btn__ghost ${textClassName}`}>
          {finalText}
        </span>

        <span
          ref={scrambleRef}
          className={`scramble-link-btn__text ${textClassName}`}
          aria-label={finalText}
        >
          {finalText}
        </span>
      </span>

      {showArrow && Icon && (
        <span className={`scramble-link-btn__icon ${iconClassName}`}>
          <Icon className="scramble-link-btn__svg" />
        </span>
      )}
    </Link>
  );
}
