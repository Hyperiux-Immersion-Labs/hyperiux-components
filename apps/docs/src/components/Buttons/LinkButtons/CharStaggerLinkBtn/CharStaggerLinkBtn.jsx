"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULT_HREF = "#";
const DEFAULT_STAGGER_STEP = 0.01;
const DEFAULT_HOVER_COLOR = "#ff6b00";
const CHAR_TRANSLATE_Y = "1.3em";
const LINK_TRANSITION = "color 0.5s cubic-bezier(0.625, 0.05, 0, 1)";
const TRANSFORM_TRANSITION = "transform 0.6s cubic-bezier(0.625, 0.05, 0, 1)";
const LINE_TRANSITION = "transform 0.5s cubic-bezier(0.625, 0.05, 0, 1)";
const ICON_TRANSITION = "transform 0.5s cubic-bezier(0.625, 0.05, 0, 1)";
const CHAR_STAGGER_LINK_BTN_STYLES = `
  .char-stagger-link-btn {
    color: inherit;
    transition: ${LINK_TRANSITION};
  }

  .char-stagger-link-btn__char {
    display: inline-block;
    position: relative;
    text-shadow: 0px ${CHAR_TRANSLATE_Y} currentColor;
    transform: translateY(0em) rotate(0.001deg);
    transition: ${TRANSFORM_TRANSITION};
    will-change: transform;
  }

  .char-stagger-link-btn--active .char-stagger-link-btn__char {
    transform: translateY(-${CHAR_TRANSLATE_Y}) rotate(0.001deg);
  }

  .char-stagger-link-btn__line {
    position: absolute;
    left: 0;
    bottom: 15%;
    width: 100%;
    height: 1.5px;
    background-color: currentColor;
    transform: scaleX(0);
    transform-origin: left center;
    transition: ${LINE_TRANSITION};
  }

  .char-stagger-link-btn__line.char-stagger-link-btn__line--exit {
    transform-origin: right center;
  }

  .char-stagger-link-btn--active .char-stagger-link-btn__line {
    transform: scaleX(1);
    transform-origin: left center;
  }

  .char-stagger-link-btn__icon-wrapper {
    display: flex;
    width: max-content;
    transform: translateX(-100%);
    transition: ${ICON_TRANSITION};
    will-change: transform;
  }

  .char-stagger-link-btn--active .char-stagger-link-btn__icon-wrapper {
    transform: translateX(5%);
  }
`;

export default function CharStaggerLinkBtn({
  text = "",
  href = DEFAULT_HREF,
  className = "",
  textClassName = "",
  linkProps = {},
  children,
  staggerStep = DEFAULT_STAGGER_STEP,
  showLine = false,
  lineClassName = "",
  hoverColor = DEFAULT_HOVER_COLOR,
  showArrow = false,
  icon: Icon = ArrowRight,
  iconClassName = "",
  onClick,
  ...props
}) {
  // State and refs
  const textRef = useRef(null);
  const lineRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const isTouchRef = useRef(false);
  const hasMountedRef = useRef(false);

  // Effects
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const line = lineRef.current;
    if (!line || isActive) return;
    line.classList.add("char-stagger-link-btn__line--exit");
    const onEnd = () => {
      line.classList.remove("char-stagger-link-btn__line--exit");
      line.removeEventListener("transitionend", onEnd);
    };
    line.addEventListener("transitionend", onEnd);
  }, [isActive]);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const sourceText = text || textElement.getAttribute("data-text") || "";
    textElement.innerHTML = "";

    [...sourceText].forEach((char, index) => {
      const span = document.createElement("span");
      span.className = "char-stagger-link-btn__char";
      span.textContent = char;
      span.style.transitionDelay = `${index * staggerStep}s`;
      if (char === " ") span.style.whiteSpace = "pre";
      textElement.appendChild(span);
    });
  }, [text, staggerStep]);

  // Event handlers
  const onMouseEnter = useCallback(() => {
    if (isTouchRef.current) return;
    setIsActive(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    if (isTouchRef.current) return;
    setIsActive(false);
  }, []);

  const onTouchStart = useCallback(() => {
    isTouchRef.current = true;
    setIsActive((prev) => !prev);
  }, []);

  const onMouseDown = useCallback((e) => {
    if (isTouchRef.current) e.preventDefault();
  }, []);

  // Derived values
  const sourceText = typeof children === "string" ? children : text;
  const linkClassName = [
    "char-stagger-link-btn inline-flex items-center gap-2 no-underline",
    isActive ? "char-stagger-link-btn--active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const textClasses = [
    "overflow-hidden relative inline-block leading-[1.2] max-md:text-[1.25em]",
    textClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const lineContainerClassName = [
    "inline-block relative",
    showLine ? "w-fit" : "",
    lineClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const iconContainerClassName = [
    "overflow-hidden flex items-center justify-start",
    iconClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const iconWrapperClassName = [
    "char-stagger-link-btn__icon-wrapper",
    iconClassName,
  ]
    .filter(Boolean)
    .join(" ");

  // Return
  return (
    <>
      <style jsx global>{CHAR_STAGGER_LINK_BTN_STYLES}</style>

      <Link
        href={href}
        {...linkProps}
        {...props}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onMouseDown={onMouseDown}
        style={{
          color: isActive ? hoverColor : undefined,
        }}
        className={linkClassName}
      >
        <div className="mt-[0.3vw]">
          <span className={lineContainerClassName}>
            <span
              ref={textRef}
              data-text={sourceText}
              className={textClasses}
            >
              {sourceText}
            </span>

            {showLine && (
              <span
                ref={lineRef}
                aria-hidden="true"
                className="char-stagger-link-btn__line"
              />
            )}
          </span>
        </div>

        {showArrow && Icon && (
          <div className={iconContainerClassName}>
            <div className={iconWrapperClassName}>
              <Icon className="flex-none w-full h-full" />
              <Icon className="flex-none w-full h-full" />
            </div>
          </div>
        )}
      </Link>
    </>
  );
}
