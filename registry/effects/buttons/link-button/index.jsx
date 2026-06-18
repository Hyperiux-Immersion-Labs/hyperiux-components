"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DEFAULT_HREF = "#";

export default function LinkButton({
  btnText,
  href = DEFAULT_HREF,
  className = "",
  linkProps = {},
  icon: Icon = ArrowRight,
  iconClassName = "max-sm:size-[6vw] max-md:size-[4vw]",
  disableNavigation = false,
  onClick,
  ...props
}) {
  const [isIconRotated, setIsIconRotated] = useState(false);

  const onLinkClick = (event) => {
    setIsIconRotated((previousValue) => !previousValue);

    if (disableNavigation) {
      event.preventDefault();
    }

    onClick?.(event);
  };

  const iconClassNames = `${isIconRotated ? "-rotate-45" : ""} group-hover:-rotate-45 size-[1.1vw] max-md:size-[2vw] max-sm:size-[3.5vw] transition-transform duration-300 ${iconClassName}`;

  return (
    <>
      <Link
        href={href}
        {...linkProps}
        {...props}
        onClick={onLinkClick}
        className={`group block w-fit cursor-pointer scale-150 text-[1.1vw] leading-[1.2] duration-300 max-md:text-[4vw] max-sm:text-[5.5vw] ${className}`}
      >
        <div className="flex items-center justify-start gap-2">
          <span className="btn-link-line relative inline-block w-fit after:absolute after:left-0 after:bottom-[-2%] after:h-[1.5px] after:w-full after:origin-right after:scale-x-0 after:bg-current after:content-[''] after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.62,0.05,0.01,0.99)] group-hover:after:origin-left group-hover:after:scale-x-100">
            {btnText}
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