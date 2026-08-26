"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import gsap from "gsap";
import { ChevronDown, ChevronRight } from "lucide-react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface FAQGroupContextValue {
  allowMultiple: boolean;
  openItems: string[];
  toggleItem: (itemId: string) => void;
}

interface FAQContextValue {
  isOpen: boolean;
  contentOuterRef: React.RefObject<HTMLDivElement | null>;
  contentInnerRef: React.RefObject<HTMLDivElement | null>;
  contentId: string;
  buttonId: string;
  titleClassName: string;
  contentClassName: string;
  iconClassName: string;
  iconSize: number;
  iconStrokeWidth: number;
}

const FAQContext = createContext<FAQContextValue | null>(null);
const FAQGroupContext = createContext<FAQGroupContextValue | null>(null);

const useFAQContext = () => {
  const context = useContext(FAQContext);

  if (!context) {
    throw new Error("FAQTitle and FAQContent must be used inside FAQWrapper.");
  }

  return context;
};

export interface FAQGroupProps {
  children?: ReactNode;
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  value?: string[];
  onChange?: (next: string[]) => void;
}

export function FAQGroup({
  children,
  allowMultiple = false,
  defaultOpenItems = [],
  value,
  onChange,
}: FAQGroupProps) {
  const isControlled = Array.isArray(value);
  const [internalOpenItems, setInternalOpenItems] = useState<string[]>(defaultOpenItems);

  const openItems = isControlled ? (value as string[]) : internalOpenItems;

  const toggleItem = useCallback(
    (itemId: string) => {
      const next = (() => {
        const isOpen = openItems.includes(itemId);

        if (allowMultiple) {
          return isOpen
            ? openItems.filter((id) => id !== itemId)
            : [...openItems, itemId];
        }

        return isOpen ? [] : [itemId];
      })();

      if (!isControlled) {
        setInternalOpenItems(next);
      }

      onChange?.(next);
    },
    [allowMultiple, isControlled, onChange, openItems]
  );

  const contextValue = useMemo(
    () => ({
      allowMultiple,
      openItems,
      toggleItem,
    }),
    [allowMultiple, openItems, toggleItem]
  );

  return (
    <FAQGroupContext.Provider value={contextValue}>
      {children}
    </FAQGroupContext.Provider>
  );
}

export interface FAQWrapperProps {
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
  iconSize?: number;
  iconStrokeWidth?: number;
  duration?: number;
  defaultOpen?: boolean;
  controlledOpen?: boolean;
  onToggle?: (next: boolean) => void;
  itemId?: string;
}

export function FAQWrapper({
  children,
  className = "",
  titleClassName = "",
  contentClassName = "",
  iconClassName = "",
  iconSize = 18,
  iconStrokeWidth = 2,
  duration = 0.45,
  defaultOpen = false,
  controlledOpen,
  onToggle,
  itemId,
}: FAQWrapperProps) {
  const group = useContext(FAQGroupContext);

  const generatedId = useId();
  const resolvedItemId = itemId ?? generatedId;

  const isStandaloneControlled = typeof controlledOpen === "boolean";
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isOpen = group
    ? group.openItems.includes(resolvedItemId)
    : isStandaloneControlled
      ? (controlledOpen as boolean)
      : internalOpen;

  const contentOuterRef = useRef<HTMLDivElement | null>(null);
  const contentInnerRef = useRef<HTMLDivElement | null>(null);
  const openHeightRef = useRef(0);
  const reduceMotionRef = useRef(
    typeof window !== "undefined" &&
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false)
  );

  const contentId = useId();
  const buttonId = useId();

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = (event: MediaQueryListEvent) => {
      reduceMotionRef.current = event.matches;
    };
    reduceMotionRef.current = mq.matches;
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const handleToggle = () => {
    if (group) {
      group.toggleItem(resolvedItemId);
      onToggle?.(!isOpen);
      return;
    }

    if (isStandaloneControlled) {
      onToggle?.(!controlledOpen);
      return;
    }

    setInternalOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  const handleWrapperClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const isInteractive = (event.target as HTMLElement).closest(
      "a, button, input, textarea, select"
    );

    if (isInteractive) return;

    handleToggle();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (!contentOuterRef.current || !contentInnerRef.current) return;

    const outer = contentOuterRef.current;
    const inner = contentInnerRef.current;

    gsap.killTweensOf([outer, inner]);

    const tweenDuration = reduceMotionRef.current ? 0 : duration;

    if (isOpen) {
      gsap.set(outer, {
        overflow: "hidden",
        height: "auto",
      });

      const targetHeight = outer.scrollHeight;
      openHeightRef.current = targetHeight;
      gsap.set(outer, { height: 0 });

      gsap.fromTo(
        outer,
        { height: 0 },
        {
          height: targetHeight,
          duration: tweenDuration,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(outer, {
              height: "auto",
              overflow: "visible",
            });
          },
        }
      );
    } else {
      gsap.set(outer, { overflow: "hidden" });

      gsap.fromTo(
        outer,
        { height: openHeightRef.current },
        {
          height: 0,
          duration: tweenDuration,
          ease: "power3.out",
        }
      );
    }
  }, [isOpen, duration]);

  const value: FAQContextValue = {
    isOpen,
    contentOuterRef,
    contentInnerRef,
    contentId,
    buttonId,
    titleClassName,
    contentClassName,
    iconClassName,
    iconSize,
    iconStrokeWidth,
  };

  return (
    <FAQContext.Provider value={value}>
      <div
        className={`cursor-pointer ${className}`}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={buttonId}
        onClick={handleWrapperClick}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </FAQContext.Provider>
  );
}

export interface FAQTitleProps {
  children?: ReactNode;
  className?: string;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  iconMode?: 'rotate' | 'rotate-left-down';
}

export function FAQTitle({
  children,
  className = "",
  showIcon = true,
  iconPosition = "right",
  iconMode = "rotate",
}: FAQTitleProps) {
  const {
    isOpen,
    titleClassName,
    iconClassName,
    iconSize,
    iconStrokeWidth,
  } = useFAQContext();

  const icon = showIcon ? (
    <div className={`shrink-0 ${iconClassName}`}>
      {iconMode === "rotate-left-down" ? (
        <ChevronRight
          size={iconSize}
          strokeWidth={iconStrokeWidth}
          className={`transition-transform duration-300 ease-out motion-reduce:transition-none ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
          aria-hidden="true"
        />
      ) : (
        <ChevronDown
          size={iconSize}
          strokeWidth={iconStrokeWidth}
          className={`transition-transform duration-300 ease-out motion-reduce:transition-none ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        />
      )}
    </div>
  ) : null;

  return (
    <div
      className={`flex w-full items-center justify-between gap-6 ${titleClassName} ${className}`}
    >
      {iconPosition === "left" ? (
        <>
          {icon}
          <div className="flex-1">{children}</div>
        </>
      ) : (
        <>
          <div className="flex-1">{children}</div>
          {icon}
        </>
      )}
    </div>
  );
}

export interface FAQContentProps {
  children?: ReactNode;
  className?: string;
  innerClassName?: string;
}

export function FAQContent({
  children,
  className = "",
  innerClassName = "",
}: FAQContentProps) {
  const {
    isOpen,
    contentOuterRef,
    contentInnerRef,
    contentId,
    buttonId,
    contentClassName,
  } = useFAQContext();

  return (
    <div
      id={contentId}
      ref={contentOuterRef}
      role="region"
      aria-labelledby={buttonId}
      style={{
        height: isOpen ? "auto" : 0,
        overflow: isOpen ? "visible" : "hidden",
      }}
      className={contentClassName}
    >
      <div ref={contentInnerRef} className={className}>
        <div className={innerClassName}>{children}</div>
      </div>
    </div>
  );
}

export const AnimatedFAQ = {
  Group: FAQGroup,
  Wrapper: FAQWrapper,
  Title: FAQTitle,
  Content: FAQContent,
};

export default AnimatedFAQ;
