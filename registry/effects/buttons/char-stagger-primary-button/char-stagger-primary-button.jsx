"use client";

import { useEffect, useRef } from "react";

const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("char-stagger-primary-btn-styles")) return;

  const style = document.createElement("style");
  style.id = "char-stagger-primary-btn-styles";
  style.textContent = `
    .char-stagger-primary-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      position: relative;
      padding: 0.75rem 2.5rem;
      text-decoration: none;
      color: inherit;
      transition: color 0.5s cubic-bezier(0.625, 0.05, 0, 1);
      cursor: pointer;
      border: none;
      background: transparent;
    }

    .char-stagger-primary-btn:hover {
      color: var(--char-hover-color, currentColor);
    }

    .char-stagger-primary-btn__inner {
      display: inline-block;
      position: relative;
    }

    .char-stagger-primary-btn__text {
      overflow: hidden;
      position: relative;
      display: inline-block;
      line-height: 1.2;
    }

    .char-stagger-primary-btn__text span {
      display: inline-block;
      position: relative;
      text-shadow: 0px 1.3em currentColor;
      transform: translateY(0em) rotate(0.001deg);
      transition: transform 0.6s cubic-bezier(0.625, 0.05, 0, 1);
      will-change: transform;
    }

    .char-stagger-primary-btn:hover .char-stagger-primary-btn__text span {
      transform: translateY(-1.3em) rotate(0.001deg);
    }

    .char-stagger-primary-btn__icon {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .char-stagger-primary-btn__icon-wrapper {
      display: flex;
      width: max-content;
      transform: translateX(-100%);
      transition: transform 0.5s cubic-bezier(0.625, 0.05, 0, 1);
      will-change: transform;
    }

    .char-stagger-primary-btn:hover .char-stagger-primary-btn__icon-wrapper {
      transform: translateX(5%);
    }

    .char-stagger-primary-btn__svg {
      flex: 0 0 auto;
      width: 1rem;
      height: 1rem;
    }
  `;
  document.head.appendChild(style);
};

export function CharStaggerPrimaryButton({
  children,
  className = "",
  textClassName = "",
  staggerStep = 0.01,
  hoverColor = "",
  showArrow = false,
  arrowClassName = "",
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
      className={`char-stagger-primary-btn ${className}`}
      style={{ "--char-hover-color": hoverColor }}
    >
      <span className="char-stagger-primary-btn__inner">
        <span
          ref={textRef}
          className={`char-stagger-primary-btn__text ${textClassName}`}
        >
          {text}
        </span>
      </span>

      {showArrow && (
        <span className={`char-stagger-primary-btn__icon ${arrowClassName}`}>
          <span className="char-stagger-primary-btn__icon-wrapper">
            <svg
              className="char-stagger-primary-btn__svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <svg
              className="char-stagger-primary-btn__svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </span>
      )}
    </Component>
  );
}

export default CharStaggerPrimaryButton;
