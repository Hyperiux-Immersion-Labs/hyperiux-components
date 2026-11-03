// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, type Transition, type Variants } from "motion/react";
import React, { Children, createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const read = () => setReduce(mq.matches);
    read();
    mq.addEventListener?.("change", read);
    return () => mq.removeEventListener?.("change", read);
  }, []);
  return reduce;
}

// ---- motion ----

const smoothEase = [0.22, 1, 0.36, 1] as const;
const fillEase = [0.215, 0.61, 0.355, 1] as const;
/** Plus ↔ minus: a quick turn, eased in and out. */
const plusSpin = { duration: 0.3, ease: "easeInOut" } as const;

const HOVER_OPEN_MS = 100;
// Long enough to cross the gap between two items without the open one closing first
const HOVER_CLOSE_MS = 250;

type MotionPreset = {
  panelOpen: Transition;
  panelClose: Transition;
  fillOpen: Transition;
  fillClose: Transition;
  contentY: Transition;
  delay: number;
  stagger: number;
};

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

function buildPreset(elastic: boolean, duration: number, bounce: number, delay: number, stagger: number): MotionPreset {
  if (!elastic) {
    const smooth = { duration, ease: smoothEase };
    const fill = { duration, ease: fillEase };
    return {
      panelOpen: smooth,
      panelClose: smooth,
      fillOpen: fill,
      fillClose: fill,
      contentY: { duration: duration * 0.6, ease: "easeOut" },
      delay,
      stagger,
    };
  }

  const spring = (b: number, d = duration) =>
    ({ type: "spring", visualDuration: d, bounce: clamp01(b) }) as const;
  const settle = spring(0, Math.max(duration - 0.1, 0.1));
  return {
    panelOpen: spring(bounce - 0.05),
    panelClose: settle,
    fillOpen: spring(bounce),
    fillClose: settle,
    contentY: spring(bounce + 0.1),
    delay,
    stagger,
  };
}

// ---- context ----

interface FAQGroupContextValue {
  allowMultiple: boolean;
  openItems: string[];
  toggleItem: (itemId: string) => void;
  /** Set when openOnHover is on: opens the item under the pointer, null closes them all. */
  hoverItem: ((itemId: string | null) => void) | null;
}

interface FAQContextValue {
  isOpen: boolean;
  contentId: string;
  buttonId: string;
  titleClassName: string;
  contentClassName: string;
  iconClassName: string;
  iconSize: number;
  iconStrokeWidth: number;
  toggleOnTitle: boolean;
  preset: MotionPreset;
  reduceMotion: boolean;
  onToggle: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
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

// ---- group ----

export interface FAQGroupProps {
  children?: ReactNode;
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  value?: string[];
  onChange?: (next: string[]) => void;
  /** Items open when a mouse rests on them and close when it leaves. Touch still uses taps. */
  openOnHover?: boolean;
}

export function FAQGroup({
  children,
  allowMultiple = false,
  defaultOpenItems = [],
  value,
  onChange,
  openOnHover = false,
}: FAQGroupProps) {
  const isControlled = Array.isArray(value);
  const [internalOpenItems, setInternalOpenItems] = useState<string[]>(defaultOpenItems);

  const openItems = isControlled ? (value as string[]) : internalOpenItems;

  const setOpenItems = useCallback(
    (next: string[]) => {
      if (!isControlled) {
        setInternalOpenItems(next);
      }

      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const toggleItem = useCallback(
    (itemId: string) => {
      const isOpen = openItems.includes(itemId);

      if (allowMultiple) {
        setOpenItems(isOpen ? openItems.filter((id) => id !== itemId) : [...openItems, itemId]);
        return;
      }

      setOpenItems(isOpen ? [] : [itemId]);
    },
    [allowMultiple, openItems, setOpenItems]
  );

  // The hover timers fire later, so they read the open items from here, not a stale render
  const latest = useRef({ openItems, setOpenItems });
  useIsomorphicLayoutEffect(() => {
    latest.current = { openItems, setOpenItems };
  });

  const hoverTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const hoverItem = useCallback((itemId: string | null) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(
      () => {
        const { openItems: current, setOpenItems: set } = latest.current;
        const next = itemId ? [itemId] : [];
        if (current.length === next.length && current.every((id, i) => id === next[i])) return;
        set(next);
      },
      itemId ? HOVER_OPEN_MS : HOVER_CLOSE_MS
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      allowMultiple,
      openItems,
      toggleItem,
      hoverItem: openOnHover ? hoverItem : null,
    }),
    [allowMultiple, openItems, toggleItem, openOnHover, hoverItem]
  );

  return (
    <FAQGroupContext.Provider value={contextValue}>
      {children}
    </FAQGroupContext.Provider>
  );
}

// ---- item ----

export interface FAQWrapperProps {
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
  iconSize?: number;
  iconStrokeWidth?: number;
  /** Seconds. How long opening and closing take. */
  duration?: number;
  /** Springs instead of easing; bounce sets how much they overshoot. */
  elastic?: boolean;
  bounce?: number;
  /** Seconds before the answer starts to appear. */
  delay?: number;
  /** Seconds between each child of the answer appearing. */
  stagger?: number;
  /** A background that grows down from the top while the item is open. It takes the corners of className. */
  fill?: "none" | "muted" | "accent";
  /** Colour of the accent fill. */
  accentColor?: string;
  defaultOpen?: boolean;
  controlledOpen?: boolean;
  onToggle?: (next: boolean) => void;
  itemId?: string;
  /** "title" makes only FAQTitle the click/keyboard trigger instead of the whole wrapper. */
  toggleOn?: "wrapper" | "title";
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
  elastic = false,
  bounce = 0.3,
  delay = 0.1,
  stagger = 0.05,
  fill = "none",
  accentColor = "#ff6b00",
  defaultOpen = false,
  controlledOpen,
  onToggle,
  itemId,
  toggleOn = "wrapper",
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

  const reduceMotion = usePrefersReducedMotion();
  const preset = useMemo(
    () => buildPreset(elastic, Math.max(0.05, Number(duration) || 0.45), bounce, delay, stagger),
    [elastic, duration, bounce, delay, stagger]
  );

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

  const value: FAQContextValue = {
    isOpen,
    contentId,
    buttonId,
    titleClassName,
    contentClassName,
    iconClassName,
    iconSize,
    iconStrokeWidth,
    toggleOnTitle: toggleOn === "title",
    preset,
    reduceMotion,
    onToggle: handleToggle,
    onKeyDown: handleKeyDown,
  };

  const wrapperProps = {
    "data-open": isOpen ? "" : undefined,
    onPointerLeave: (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse") group?.hoverItem?.(null);
    },
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        group?.hoverItem &&
        event.pointerType === "mouse" &&
        (event.movementX !== 0 || event.movementY !== 0)
      ) {
        group.hoverItem(resolvedItemId);
      }
    },
  };

  const decorations = fill !== "none" && (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 rounded-[inherit] ${fill === "muted" ? "bg-current/8" : ""}`}
      style={{
        originY: 0,
        backgroundColor:
          fill === "accent" ? `color-mix(in oklab, ${accentColor} 18%, transparent)` : undefined,
      }}
      initial={false}
      // Grows down from the top edge only; the width never changes
      animate={{ scaleY: isOpen ? 1 : 0 }}
      transition={reduceMotion ? { duration: 0 } : isOpen ? preset.fillOpen : preset.fillClose}
    />
  );

  const wrapperClassName = `${fill !== "none" ? "relative isolate" : ""} ${className}`;

  if (toggleOn === "title") {
    return (
      <FAQContext.Provider value={value}>
        <div className={wrapperClassName} {...wrapperProps}>
          {decorations}
          {children}
        </div>
      </FAQContext.Provider>
    );
  }

  return (
    <FAQContext.Provider value={value}>
      <div
        className={`cursor-pointer ${wrapperClassName}`}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={buttonId}
        onClick={handleWrapperClick}
        onKeyDown={handleKeyDown}
        {...wrapperProps}
      >
        {decorations}
        {children}
      </div>
    </FAQContext.Provider>
  );
}

// ---- title ----

function MorphPlus({
  open,
  size,
  strokeWidth,
  reduceMotion,
}: {
  open: boolean;
  size: number;
  strokeWidth: number;
  reduceMotion: boolean;
}) {
  const transition = reduceMotion ? { duration: 0 } : plusSpin;

  return (
    <motion.svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={false}
      animate={{ rotate: open ? 180 : 0 }}
      transition={transition}
    >
      {/* Into a minus: the whole icon turns 180° while the vertical line turns 90° to lie
          flat. Closing plays it back. */}
      <path d="M5 12h14" />
      <motion.path d="M5 12h14" initial={false} animate={{ rotate: open ? 0 : 90 }} transition={transition} />
    </motion.svg>
  );
}

export interface FAQTitleProps {
  children?: ReactNode;
  className?: string;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  /** rotate: chevron down turns 180°. rotate-left-down: chevron right turns 90°. plus: plus turns into minus. */
  iconMode?: 'rotate' | 'rotate-left-down' | 'plus';
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
    contentId,
    buttonId,
    toggleOnTitle,
    reduceMotion,
    onToggle,
    onKeyDown,
  } = useFAQContext();

  const triggerProps = toggleOnTitle
    ? {
        role: "button",
        tabIndex: 0,
        "aria-expanded": isOpen,
        "aria-controls": contentId,
        id: buttonId,
        onClick: onToggle,
        onKeyDown,
      }
    : {};

  const chevronClass = "transition-transform duration-300 ease-out motion-reduce:transition-none";

  const icon = showIcon ? (
    <div className={`shrink-0 ${iconClassName}`}>
      {iconMode === "plus" ? (
        <MorphPlus open={isOpen} size={iconSize} strokeWidth={iconStrokeWidth} reduceMotion={reduceMotion} />
      ) : iconMode === "rotate-left-down" ? (
        <ChevronRight
          size={iconSize}
          strokeWidth={iconStrokeWidth}
          className={`${chevronClass} ${isOpen ? "rotate-90" : "rotate-0"}`}
          aria-hidden="true"
        />
      ) : (
        <ChevronDown
          size={iconSize}
          strokeWidth={iconStrokeWidth}
          className={`${chevronClass} ${isOpen ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        />
      )}
    </div>
  ) : null;

  return (
    <div
      className={`flex w-full items-center justify-between gap-6 ${toggleOnTitle ? "cursor-pointer" : ""} ${titleClassName} ${className}`}
      {...triggerProps}
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

// ---- content ----

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
    contentId,
    buttonId,
    contentClassName,
    preset,
    reduceMotion,
  } = useFAQContext();

  // Once fully open the panel stops clipping, so menus or tooltips inside it can overflow
  const [settled, setSettled] = useState(isOpen);

  const groupVariants: Variants = {
    open: {
      // Reduced motion: the panel opens at once, so its text shouldn't wait or trickle in
      transition: {
        delayChildren: reduceMotion ? 0 : preset.delay,
        staggerChildren: reduceMotion ? 0 : preset.stagger,
      },
    },
    closed: {},
  };

  const itemVariants: Variants = {
    open: {
      opacity: 1,
      y: "0em",
      transition: reduceMotion
        ? { duration: 0 }
        : { y: preset.contentY, opacity: { duration: 0.3, ease: "easeOut" } },
    },
    closed: {
      opacity: 0,
      y: reduceMotion ? "0em" : "0.5em",
      transition: { duration: reduceMotion ? 0 : 0.2, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      id={contentId}
      role="region"
      aria-labelledby={buttonId}
      inert={!isOpen}
      initial={false}
      animate={{ height: isOpen ? "auto" : 0 }}
      transition={reduceMotion ? { duration: 0 } : isOpen ? preset.panelOpen : preset.panelClose}
      onAnimationStart={() => setSettled(false)}
      onAnimationComplete={() => setSettled(isOpen)}
      style={{ overflow: isOpen && settled ? "visible" : "hidden" }}
      className={contentClassName}
    >
      <div className={className}>
        <motion.div
          initial={false}
          animate={isOpen ? "open" : "closed"}
          variants={groupVariants}
          className={innerClassName}
        >
          {Children.toArray(children).map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export const AnimatedFAQ = {
  Group: FAQGroup,
  Wrapper: FAQWrapper,
  Title: FAQTitle,
  Content: FAQContent,
};

// ---- demo ----

interface FAQItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  defaultOpen: boolean;
}

const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    title: "What makes this FAQ package more reusable?",
    content: (
      <>
        You are no longer locked into a plain data object. You can pass rich
        JSX, custom markup, inline links, badges, icons, or even other
        components inside the title and content.
      </>
    ),
    defaultOpen: true,
  },
  {
    id: "faq-2",
    title: "Can I put custom content inside the answer?",
    content: (
      <div className="space-y-3">
        <p>Yes. This content area accepts full React nodes, not just text.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Paragraphs</li>
          <li>Lists</li>
          <li>Buttons</li>
          <li>Inline links</li>
        </ul>
      </div>
    ),
    defaultOpen: false,
  },
  {
    id: "faq-3",
    title: "Can it open on hover?",
    content: (
      <>
        Yes. Turn on openOnHover and each answer opens while a mouse rests on
        its question, then closes when the pointer leaves. Touch screens still
        open answers with a tap.
      </>
    ),
    defaultOpen: false,
  },
];

export type AnimatedFaqProps = Pick<FAQGroupProps, "allowMultiple" | "openOnHover"> &
  Pick<FAQWrapperProps, "duration" | "elastic" | "bounce" | "delay" | "stagger" | "fill" | "accentColor"> &
  Pick<FAQTitleProps, "showIcon" | "iconPosition" | "iconMode">;

export default function AnimatedFaq({
  allowMultiple = false,
  openOnHover = false,
  showIcon,
  iconPosition,
  iconMode,
  ...itemProps
}: AnimatedFaqProps) {
  const defaultOpenItems = faqItems
    .filter((item) => item.defaultOpen)
    .map((item) => item.id);

  return (
    <div className="mx-auto max-w-4xl space-y-4 bg-black">
      <FAQGroup allowMultiple={allowMultiple} openOnHover={openOnHover} defaultOpenItems={defaultOpenItems}>
        {faqItems.map((item) => (
          <FAQWrapper
            key={item.id}
            itemId={item.id}
            className="rounded-md border border-white/20 px-6 py-5"
            titleClassName="text-[1.1rem] font-medium text-white"
            iconSize={16}
            iconStrokeWidth={2}
            {...itemProps}
          >
            <FAQTitle className="pb-0" showIcon={showIcon} iconPosition={iconPosition} iconMode={iconMode}>
              {item.title}
            </FAQTitle>
            <FAQContent className="pt-4 text-neutral-400">
              {item.content}
            </FAQContent>
          </FAQWrapper>
        ))}
      </FAQGroup>
    </div>
  );
}
