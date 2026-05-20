"use client";

import { useEffect, useRef } from "react";

const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("arrow-fill-button-styles")) return;

  const style = document.createElement("style");
  style.id = "arrow-fill-button-styles";
  style.textContent = `
    .arrow-fill-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 3rem;
      padding-right: 3.5rem;
      padding-left: 1.5rem;
      position: relative;
      width: fit-content;
      border-radius: 1000px;
      background: var(--btn-bg);
      color: var(--btn-text);
      font-size: 0.875rem;
      font-weight: 500;
      text-rendering: geometricPrecision;
      white-space: nowrap;
      overflow: hidden;
      text-decoration: none;
      cursor: pointer;
      border: none;
    }

    .arrow-fill-btn__text {
      position: relative;
      z-index: 1;
    }

    .arrow-fill-btn__circle {
      clip-path: inset(0.4rem 0.4rem 0.4rem calc(100% - 2.5rem) round 2rem);
      position: absolute;
      inset: -1px;
      border-radius: 1000px;
      display: flex;
      align-items: center;
      padding-right: 3.5rem;
      padding-left: 1.5rem;
      z-index: 2;
      background-color: var(--btn-fill-bg);
      color: var(--btn-fill-text);
      transition: all 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    }

    .arrow-fill-btn__circle-text {
      padding: 0 1px 0 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      white-space: nowrap;
    }

    .arrow-fill-btn__icon {
      width: 0.75rem;
      height: 0.75rem;
      position: absolute;
      right: 1rem;
      overflow: hidden;
      flex: 0 0 auto;
      color: var(--btn-arrow);
    }

    .arrow-fill-btn:hover .arrow-fill-btn__icon {
      color: var(--btn-arrow-hover);
    }

    .arrow-fill-btn__path {
      transition: transform 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);
      transform-origin: center center;
      fill: currentColor;
    }

    .arrow-fill-btn__path:first-child {
      transform: translateX(-120%) scale(0);
    }

    .arrow-fill-btn:hover .arrow-fill-btn__path:first-child {
      transform: translateX(0) scale(1);
    }

    .arrow-fill-btn:hover .arrow-fill-btn__path:last-child {
      transform: translateX(120%) scale(0);
    }

    .arrow-fill-btn:hover .arrow-fill-btn__circle {
      clip-path: inset(0 round 2rem);
      background-color: var(--btn-fill-bg-hover);
      color: var(--btn-fill-text-hover);
    }
  `;
  document.head.appendChild(style);
};

export function ArrowFillButton({
  children,
  className = "",
  bgColor = "#ff6b00",
  textColor = "#ffffff",
  fillBgColor = "#ffffff",
  fillTextColor = "#ff6b00",
  hoverFillBgColor = "#ffffff",
  hoverFillTextColor = "#ff6b00",
  arrowColor,
  hoverArrowColor,
  as: Component = "a",
  ...props
}) {
  const hasInjected = useRef(false);

  useEffect(() => {
    if (!hasInjected.current) {
      injectStyles();
      hasInjected.current = true;
    }
  }, []);

  return (
    <Component
      {...props}
      className={`arrow-fill-btn ${className}`}
      style={{
        "--btn-bg": bgColor,
        "--btn-text": textColor,
        "--btn-fill-bg": fillBgColor,
        "--btn-fill-text": fillTextColor,
        "--btn-fill-bg-hover": hoverFillBgColor,
        "--btn-fill-text-hover": hoverFillTextColor,
        "--btn-arrow": arrowColor || fillTextColor,
        "--btn-arrow-hover": hoverArrowColor || hoverFillTextColor,
      }}
    >
      <span className="arrow-fill-btn__text">{children}</span>

      <div aria-hidden="true" className="arrow-fill-btn__circle">
        <span>{children}</span>

        <div className="arrow-fill-btn__circle-text">
          <svg
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-fill-btn__icon"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.82475e-07 5.625L7.625 5.625L4.125 9.125L5 10L10 5L5 -4.37114e-07L4.125 0.874999L7.625 4.375L4.91753e-07 4.375L3.82475e-07 5.625Z"
              className="arrow-fill-btn__path"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.82475e-07 5.625L7.625 5.625L4.125 9.125L5 10L10 5L5 -4.37114e-07L4.125 0.874999L7.625 4.375L4.91753e-07 4.375L3.82475e-07 5.625Z"
              className="arrow-fill-btn__path"
            />
          </svg>
        </div>
      </div>
    </Component>
  );
}

export default ArrowFillButton;
