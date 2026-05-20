"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import "./char-stagger-button.css";

export function CharStaggerButton({
  text = "",
  href = "#",
  className = "",
  textClassName = "",
  linkProps = {},
  children,
  staggerStep = 0.01,
  showLine = false,
  lineClassName = "",
  hoverColor = "#ff6b00",
  showArrow = false,
  icon: Icon = ArrowRight,
  iconClassName = "",
  onClick,
  ...props
}) {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const sourceText = text || el.getAttribute("data-text") || "";
    el.innerHTML = "";

    [...sourceText].forEach((char, index) => {
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
    <Link
      href={href}
      {...linkProps}
      {...props}
      onClick={onClick}
      className={`char-stagger-link group inline-flex items-center gap-2 ${className}`}
      style={{ "--char-hover-color": hoverColor }}
    >
      <div className="mt-[0.3vw]">
        <span
          className={`char-stagger-link__inner ${
            showLine ? `link-line ${lineClassName}` : ""
          }`}
        >
          <span
            ref={textRef}
            data-text={typeof children === "string" ? children : text}
            className={`char-stagger-link__text ${textClassName}`}
          >
            {typeof children === "string" ? children : text}
          </span>
        </span>
      </div>

      {showArrow && Icon && (
        <div className={`char-stagger-link__icon ${iconClassName}`}>
          <div className={`icon-wrapper ${iconClassName}`}>
            <Icon className="char-stagger-link__svg" />
            <Icon className="char-stagger-link__svg" />
          </div>
        </div>
      )}
    </Link>
  );
}
