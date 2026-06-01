"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";

import "./LinkButton.css";

const TABLET_BREAKPOINT = 1024;
const DEFAULT_MOBILE_TEXT = "Click me";
const DEFAULT_CLICKED_COLOR = "#ff6b00";
const DEFAULT_HREF = "#";

export default function LinkButton({
  text,
  mobileText = DEFAULT_MOBILE_TEXT,
  clickedColor = DEFAULT_CLICKED_COLOR,
  href = DEFAULT_HREF,
  className = "",
  linkProps = {},
  icon: Icon = ArrowRight,
  iconClassName = "",
  children,
  disableNavigation = false,
  onClick,
  ...props
}) {
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [hasMeasuredViewport, setHasMeasuredViewport] = useState(false);
  const [isIconRotated, setIsIconRotated] = useState(false);

  useLayoutEffect(() => {
    const onResize = () => {
      setIsCompactViewport(window.innerWidth <= TABLET_BREAKPOINT);
      setHasMeasuredViewport(true);
    };

    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onLinkClick = (event) => {
    setIsIconRotated((previousValue) => !previousValue);

    if (disableNavigation) {
      event.preventDefault();
    }

    onClick?.(event);
  };

  // Derived values
  const displayText =
    hasMeasuredViewport && isCompactViewport ? mobileText : children || text;
  const clickedStyle =
    hasMeasuredViewport && isCompactViewport && isIconRotated
      ? { color: clickedColor }
      : undefined;
  const iconClassNames = `${isIconRotated ? "-rotate-45" : ""} ${
    !isCompactViewport ? "group-hover:-rotate-45" : ""
  } transition-transform duration-300 ${iconClassName}`;

  return (
    <Link
      href={href}
      {...linkProps}
      {...props}
      onClick={onLinkClick}
      className={`group block w-fit leading-[1.2] duration-300 ${className}`}
      style={clickedStyle}
    >
      <div className="flex items-center justify-start gap-2">
        <span
          className="btn-link-line relative inline-block w-fit max-md:text-[3vw] max-sm:text-[5vw]"
          style={{
            visibility: hasMeasuredViewport ? "visible" : "hidden",
          }}
        >
          {displayText}
        </span>

        <span className="sr-only">About {href}</span>

        {Icon && <Icon className={iconClassNames} />}
      </div>
    </Link>
  );
}
