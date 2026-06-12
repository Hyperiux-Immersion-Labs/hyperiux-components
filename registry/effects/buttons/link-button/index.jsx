"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";

const TABLET_BREAKPOINT = 1025;
const DEFAULT_MOBILE_TEXT = "Click me";
const DEFAULT_CLICKED_COLOR = "#ff6b00";
const DEFAULT_HREF = "#";

export function LinkButton({
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
  } size-[1.1vw] max-md:size-[2vw] max-sm:size-[3.5vw] transition-transform duration-300 ${iconClassName}`;

  return (
    <>
      <Link
        href={href}
        {...linkProps}
        {...props}
        onClick={onLinkClick}
        className={`group block w-fit cursor-pointer scale-150 text-[1.1vw] leading-[1.2] duration-300 max-md:text-[4vw] max-sm:text-[5.5vw] ${className}`}
        style={clickedStyle}
      >
        <div className="flex items-center justify-start gap-2">
          <span
            className={`btn-link-line relative inline-block w-fit after:absolute after:left-0 after:bottom-[-2%] after:h-[1.5px] after:w-full after:bg-current after:content-[''] after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.62,0.05,0.01,0.99)] ${
              hasMeasuredViewport && isCompactViewport
                ? isIconRotated
                  ? "after:origin-left after:scale-x-100"
                  : "after:origin-right after:scale-x-0"
                : "after:origin-right after:scale-x-0 group-hover:after:origin-left group-hover:after:scale-x-100"
            }`}
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

      <style jsx>{`
        li :global(.btn-link-line)::after {
          bottom: -20%;
        }
      `}</style>
    </>
  );
}
