"use client";

import { useEffect, useRef } from "react";

const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("link-btn-styles")) return;

  const style = document.createElement("style");
  style.id = "link-btn-styles";
  style.textContent = `
    .link-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      background: transparent;
      border: none;
      padding: 0;
    }

    .link-btn__text {
      position: relative;
      width: fit-content;
    }

    .link-btn__text::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -2%;
      width: 100%;
      height: 1.5px;
      background-color: currentColor;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.5s cubic-bezier(0.62, 0.05, 0.01, 0.99);
    }

    .link-btn:hover .link-btn__text::after {
      transform: scaleX(1);
      transform-origin: left;
    }

    .link-btn__icon {
      transition: transform 0.3s ease;
    }

    .link-btn:hover .link-btn__icon {
      transform: rotate(-45deg);
    }
  `;
  document.head.appendChild(style);
};

export function LinkButton({
  children,
  className = "",
  showArrow = true,
  arrowClassName = "",
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
    <Component {...props} className={`link-btn ${className}`}>
      <span className="link-btn__text">{children}</span>

      {showArrow && (
        <svg
          className={`link-btn__icon ${arrowClassName}`}
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

export default LinkButton;
