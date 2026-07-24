"use client";

import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useState } from "react";

const DEFAULT_HREF = "#";
const TABLET_BREAKPOINT = 1025;

export default function LinkButton({
  btnText,
  href = DEFAULT_HREF,
  className = "",
  linkProps = {},
  icon: Icon = ArrowRight,
  iconClassName = "max-md:size-[6vw] max-[1025px]:size-[4vw]",
  disableNavigation = false,
  onClick,
  ...props
}) {
  const [isIconRotated, setIsIconRotated] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [hasMeasuredViewport, setHasMeasuredViewport] = useState(false);

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

  const iconClassNames = `${isIconRotated ? "motion-safe:-rotate-45" : ""} ${
    !isCompactViewport ? "motion-safe:group-hover:-rotate-45" : ""
  } size-[1.1vw] max-[1025px]:size-[2vw] max-md:size-[3.5vw] transition-transform duration-300 motion-reduce:rotate-0 motion-reduce:transition-none ${iconClassName}`;

  return (
    <>
      <a
        href={href}
        {...linkProps}
        {...props}
        onClick={onLinkClick}
        className={`group block w-fit cursor-pointer text-[1.1vw] leading-[1.2] duration-300 max-[1025px]:text-[4vw] max-md:text-[5.5vw] ${className}`}
      >
        <div className="flex items-center justify-start gap-2">
          <span
            className={`btn-link-line relative inline-block w-fit after:absolute after:left-0 after:bottom-[-2%] after:h-[1.5px] after:w-full after:bg-current after:content-[''] after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.62,0.05,0.01,0.99)] motion-reduce:after:transition-none ${
              hasMeasuredViewport && isCompactViewport
                ? isIconRotated
                  ? "after:origin-right after:scale-x-0 motion-safe:after:origin-left motion-safe:after:scale-x-100"
                  : "after:origin-right after:scale-x-0"
                : "after:origin-right after:scale-x-0 motion-safe:group-hover:after:origin-left motion-safe:group-hover:after:scale-x-100"
            }`}
          >
            {btnText}
          </span>

          <span className="sr-only">About {href}</span>

          {Icon && <Icon className={iconClassNames} />}
        </div>
      </a>

      <style jsx>{`
        li :global(.btn-link-line)::after {
          bottom: -20%;
        }
      `}</style>
    </>
  );
}
