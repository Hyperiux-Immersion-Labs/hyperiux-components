"use client";

import { useEffect, useRef } from "react";

const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("dot-fill-btn-styles")) return;

  const style = document.createElement("style");
  style.id = "dot-fill-btn-styles";
  style.textContent = `
    .dot-fill-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 3rem;
      padding-left: 2rem;
      padding-right: 1.5rem;
      border-radius: 1000px;
      background: var(--btn-bg);
      color: var(--btn-text);
      font-size: 0.875rem;
      font-weight: 500;
      overflow: hidden;
      white-space: nowrap;
      text-decoration: none;
      cursor: pointer;
      border: none;
    }

    .dot-fill-btn__dot {
      position: absolute;
      left: 1rem;
      top: 50%;
      width: 0.5rem;
      height: 0.5rem;
      background: var(--btn-dot);
      border-radius: 50%;
      transform: translateY(-50%) scale(1);
      transform-origin: center;
      z-index: 1;
      transition: transform 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    }

    .dot-fill-btn__text-wrap {
      position: relative;
      z-index: 2;
      display: inline-block;
    }

    .dot-fill-btn__text {
      overflow: hidden;
      position: relative;
      display: inline-block;
      line-height: 1.2;
    }

    .dot-fill-btn__text span {
      display: inline-block;
      position: relative;
      text-shadow: 0px 1.3em currentColor;
      transform: translateY(0em) rotate(0.001deg);
      transition:
        transform 0.6s cubic-bezier(0.625, 0.05, 0, 1),
        color 0.6s cubic-bezier(0.625, 0.05, 0, 1);
      will-change: transform;
    }

    .dot-fill-btn:hover {
      color: var(--btn-hover-text);
    }

    .dot-fill-btn:hover .dot-fill-btn__dot {
      transform: translateY(-50%) scale(120);
    }

    .dot-fill-btn:hover .dot-fill-btn__text span {
      transform: translateY(-1.3em) rotate(0.001deg);
    }
  `;
  document.head.appendChild(style);
};

export function DotFillButton({
  children,
  className = "",
  textClassName = "",
  staggerStep = 0.01,
  bgColor = "#ff6b00",
  textColor = "#ffffff",
  fillColor = "#ffffff",
  hoverTextColor = "#ff6b00",
  dotColor,
  as: Component = "a",
  ...props
}) {
  const textRef = useRef(null);
  const hasInjected = useRef(false);

  const text = typeof children === "string" ? children : "";

  useEffect(() => {
    if (!hasInjected.current) {
      injectStyles();
      hasInjected.current = true;
    }
  }, []);

  useEffect(() => {
    const el = textRef.current;
    if (!el || !text) return;

    el.innerHTML = "";

    [...text].forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.transitionDelay = `${index * staggerStep}s`;

      if (char === " ") {
        span.style.whiteSpace = "pre";
      }

      el.appendChild(span);
    });
  }, [text, staggerStep]);

  return (
    <Component
      {...props}
      className={`dot-fill-btn ${className}`}
      style={{
        "--btn-bg": bgColor,
        "--btn-text": textColor,
        "--btn-fill": fillColor,
        "--btn-hover-text": hoverTextColor,
        "--btn-dot": dotColor || fillColor,
      }}
    >
      <span className="dot-fill-btn__dot" />

      <span className="dot-fill-btn__text-wrap">
        <span ref={textRef} className={`dot-fill-btn__text ${textClassName}`}>
          {text}
        </span>
      </span>
    </Component>
  );
}

export default DotFillButton;
