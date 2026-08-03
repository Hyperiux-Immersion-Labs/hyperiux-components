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
} from "react";

import gsap from "gsap";
import { ChevronDown, ChevronRight } from "lucide-react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const FAQContext = createContext(null);
const FAQGroupContext = createContext(null);

const useFAQContext = () => {
  const context = useContext(FAQContext);

  if (!context) {
    throw new Error("FAQTitle and FAQContent must be used inside FAQWrapper.");
  }

  return context;
};

export function FAQGroup({
  children,
  allowMultiple = false,
  defaultOpenItems = [],
  value,
  onChange,
}) {
  const isControlled = Array.isArray(value);
  const [internalOpenItems, setInternalOpenItems] = useState(defaultOpenItems);

  const openItems = isControlled ? value : internalOpenItems;

  const toggleItem = useCallback(
    (itemId) => {
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
}) {
  const group = useContext(FAQGroupContext);

  const generatedId = useId();
  const resolvedItemId = itemId ?? generatedId;

  const isStandaloneControlled = typeof controlledOpen === "boolean";
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isOpen = group
    ? group.openItems.includes(resolvedItemId)
    : isStandaloneControlled
      ? controlledOpen
      : internalOpen;

  const contentOuterRef = useRef(null);
  const contentInnerRef = useRef(null);
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
    const onChange = (event) => {
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

  const handleWrapperClick = (event) => {
    const isInteractive = event.target.closest(
      "a, button, input, textarea, select"
    );

    if (isInteractive) return;

    handleToggle();
  };

  const handleKeyDown = (event) => {
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

  const value = {
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

export function FAQTitle({
  children,
  className = "",
  showIcon = true,
  iconPosition = "right",
  iconMode = "rotate",
}) {
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

export function FAQContent({
  children,
  className = "",
  innerClassName = "",
}) {
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
