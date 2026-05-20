"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ChevronBird } from "@/components/hyperiux/chevron-bird";

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

  const toggleItem = (itemId) => {
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
  };

  const contextValue = useMemo(
    () => ({
      allowMultiple,
      openItems,
      toggleItem,
    }),
    [allowMultiple, openItems]
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
  iconSize = 14,
  iconStrokeWidth = 10,
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

  const contentId = useId();
  const buttonId = useId();

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

  const handleWrapperClick = (e) => {
    const isInteractive = e.target.closest("a, button, input, textarea, select");
    if (isInteractive) return;

    handleToggle();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  useEffect(() => {
    if (!contentOuterRef.current || !contentInnerRef.current) return;

    const outer = contentOuterRef.current;
    const inner = contentInnerRef.current;

    gsap.killTweensOf([outer, inner]);

    if (isOpen) {
      gsap.set(outer, {
        display: "block",
        overflow: "hidden",
      });

      gsap.fromTo(
        outer,
        { height: 0 },
        {
          height: inner.offsetHeight,
          duration,
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

      gsap.to(outer, {
        height: 0,
        duration,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(outer, { display: "none" });
        },
      });
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
      <ChevronBird
        isActive={isOpen}
        size={iconSize}
        strokeWidth={iconStrokeWidth}
      />
    </div>
  ) : null;

  return (
    <div
      className={`flex w-full items-start justify-between gap-6 ${titleClassName} ${className}`}
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
        height: 0,
        display: "none",
        overflow: "hidden",
      }}
      className={contentClassName}
    >
      <div ref={contentInnerRef} className={className}>
        <div className={innerClassName}>{children}</div>
      </div>
    </div>
  );
}
