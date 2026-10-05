// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useState, type ComponentPropsWithoutRef, type ComponentType, type CSSProperties, type MouseEvent, type MouseEventHandler, type ReactNode } from "react";

const TABLET_BREAKPOINT = 1025;
const DEFAULT_TEXT = "Hover me";
const DEFAULT_MOBILE_TEXT = "Click me";
const DEFAULT_CLICKED_COLOR = "#ff6b00";
const DEFAULT_HREF = "#";

export interface LinkButtonOwnProps {
  text?: string;
  mobileText?: string;
  textColor?: string;
  hoverColor?: string;
  clickedColor?: string;
  href?: string;
  className?: string;
  linkProps?: Partial<ComponentPropsWithoutRef<typeof Link>>;
  icon?: ComponentType<{ className?: string }>;
  iconClassName?: string;
  showIcon?: boolean;
  underlineHeight?: number;
  underlineOnHover?: boolean;
  iconRotation?: number;
  rotateIconOnHover?: boolean;
  transitionDuration?: number;
  children?: ReactNode;
  disableNavigation?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export type LinkButtonProps = LinkButtonOwnProps & Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'onClick' | keyof LinkButtonOwnProps>;

export default function LinkButton({
  text = DEFAULT_TEXT,
  mobileText = DEFAULT_MOBILE_TEXT,
  textColor,
  hoverColor,
  clickedColor = DEFAULT_CLICKED_COLOR,
  href = DEFAULT_HREF,
  className = "",
  linkProps = {},
  icon: Icon = ArrowRight,
  iconClassName = "",
  showIcon = true,
  underlineHeight = 1.5,
  underlineOnHover = true,
  iconRotation = -45,
  rotateIconOnHover = true,
  transitionDuration = 0.5,
  children,
  disableNavigation = false,
  onClick,
  ...props
}: LinkButtonProps) {
  const { style: customStyle, ...restProps } = props;
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

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
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
  const mergedStyle: CSSProperties & Record<`--${string}`, string> = {
    "--underline-height": `${underlineHeight}px`,
    "--icon-rotation": `${iconRotation}deg`,
    "--transition-duration": `${transitionDuration}s`,
    ...(hoverColor ? { "--link-hover-color": hoverColor } : null),
    ...(textColor ? { "--link-text-color": textColor } : null),
    ...customStyle,
    ...clickedStyle,
  };
  const iconClassNames = `${isIconRotated ? "motion-safe:-rotate-45" : ""} ${
    !isCompactViewport ? "motion-safe:group-hover:-rotate-45" : ""
  } size-[1em] shrink-0 max-md:translate-y-[0.1em] transition-transform duration-[var(--transition-duration)] motion-reduce:rotate-0 motion-reduce:transition-none ${iconClassName}`;
  const underlineClassNames = `btn-link-line relative inline-block w-fit after:absolute after:left-0 after:bottom-[-2%] after:h-[var(--underline-height)] after:w-full after:bg-current after:content-[''] after:transition-transform after:duration-[var(--transition-duration)] after:ease-[cubic-bezier(0.62,0.05,0.01,0.99)] motion-reduce:after:transition-none ${
    hasMeasuredViewport && isCompactViewport
      ? isIconRotated
        ? "after:origin-right after:scale-x-0 motion-safe:after:origin-left motion-safe:after:scale-x-100"
        : "after:origin-right after:scale-x-0"
      : "after:origin-right after:scale-x-0 motion-safe:group-hover:after:origin-left motion-safe:group-hover:after:scale-x-100"
  }`;

  return (
    <>
      <Link
        href={href}
        {...linkProps}
        {...restProps}
        onClick={onLinkClick}
        className={`group block w-fit cursor-pointer scale-150 text-[1.1vw] leading-[1.2] duration-300 text-(--link-text-color) hover:text-(--link-hover-color) max-[1025px]:text-[4vw] max-md:text-[6.5vw] ${className}`}
        style={mergedStyle}
      >
        <div className="flex items-center justify-start gap-2">
          <span
            className={underlineClassNames}
            style={{
              visibility: hasMeasuredViewport ? "visible" : "hidden",
            }}
          >
            {displayText}
          </span>

          <span className="sr-only">About {href}</span>

          {showIcon && Icon && <Icon className={iconClassNames} />}
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
