"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789";

const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("scramble-link-btn-styles")) return;

  const style = document.createElement("style");
  style.id = "scramble-link-btn-styles";
  style.textContent = `
    .scramble-link-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: inherit;
      transition: color 0.35s ease;
      cursor: pointer;
      background: transparent;
      border: none;
      padding: 0;
    }

    .scramble-link-btn:hover {
      color: var(--scramble-hover-color, currentColor);
    }

    .scramble-link-btn__inner {
      position: relative;
      display: inline-block;
    }

    .scramble-link-btn__ghost {
      display: inline-block;
      visibility: hidden;
      white-space: pre;
      pointer-events: none;
      user-select: none;
      font-variant-ligatures: none;
    }

    .scramble-link-btn__text {
      position: absolute;
      inset: 0;
      display: inline-block;
      white-space: pre;
      font-variant-ligatures: none;
    }

    .scramble-link-btn--line .scramble-link-btn__inner::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -4%;
      width: 100%;
      height: 1.5px;
      background-color: currentColor;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.45s cubic-bezier(0.625, 0.05, 0, 1);
    }

    .scramble-link-btn--line:hover .scramble-link-btn__inner::after {
      transform: scaleX(1);
      transform-origin: left;
    }

    .scramble-link-btn__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    .scramble-link-btn:hover .scramble-link-btn__icon {
      transform: rotate(-45deg);
    }
  `;
  document.head.appendChild(style);
};

export function ScrambleLinkButton({
  children,
  className = "",
  textClassName = "",
  hoverColor = "#ff6b00",
  showLine = false,
  showArrow = false,
  arrowClassName = "",
  scrambleDuration = 700,
  stepMs = 30,
  revealStagger = 1.4,
  as: Component = "a",
  ...props
}) {
  const scrambleRef = useRef(null);
  const timeoutRef = useRef(null);
  const hasInjected = useRef(false);

  const text = typeof children === "string" ? children : "";

  useEffect(() => {
    if (!hasInjected.current) {
      injectStyles();
      hasInjected.current = true;
    }
  }, []);

  useEffect(() => {
    if (scrambleRef.current) {
      scrambleRef.current.textContent = text;
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text]);

  const scrambleToText = () => {
    const el = scrambleRef.current;
    if (!el) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    let iteration = 0;
    const maxIterations = Math.max(1, Math.floor(scrambleDuration / stepMs));

    const run = () => {
      let output = "";

      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === " ") {
          output += " ";
          continue;
        }

        const revealThreshold =
          (((i + 1) / text.length) * maxIterations) / revealStagger;

        if (iteration >= revealThreshold) {
          output += char;
        } else {
          output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      el.textContent = output;

      if (iteration < maxIterations) {
        iteration += 1;
        timeoutRef.current = setTimeout(run, stepMs);
      } else {
        el.textContent = text;
      }
    };

    run();
  };

  return (
    <Component
      {...props}
      onMouseEnter={scrambleToText}
      className={`scramble-link-btn ${showLine ? "scramble-link-btn--line" : ""} ${className}`}
      style={{ "--scramble-hover-color": hoverColor }}
    >
      <span className="scramble-link-btn__inner">
        <span className={`scramble-link-btn__ghost ${textClassName}`}>
          {text}
        </span>
        <span
          ref={scrambleRef}
          className={`scramble-link-btn__text ${textClassName}`}
          aria-label={text}
        >
          {text}
        </span>
      </span>

      {showArrow && (
        <svg
          className={`scramble-link-btn__icon ${arrowClassName}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
    </Component>
  );
}

export default ScrambleLinkButton;
