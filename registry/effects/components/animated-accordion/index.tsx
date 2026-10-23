// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import * as React from "react";

import { motion, MotionConfig, stagger, type HTMLMotionProps, type Variants, useAnimate } from "motion/react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { twMerge } from "tailwind-merge";

// Read here, not through motion's hook, so the demo's reduced-motion switch is honoured too
function usePrefersReducedMotion() {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduce(mq.matches);
    read();
    mq.addEventListener?.("change", read);
    return () => mq.removeEventListener?.("change", read);
  }, []);
  return reduce;
}

// Motion follows the same setting: transforms and layout animations land instantly when it's on
function ReducedMotionConfig({ children }: { children: React.ReactNode }) {
  const reduce = usePrefersReducedMotion();
  return <MotionConfig reducedMotion={reduce ? "always" : "never"}>{children}</MotionConfig>;
}


function toClass(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(toClass).filter(Boolean).join(" ");
  if (Object.getPrototypeOf(value) !== Object.prototype) return "";
  const record = value as Record<string, unknown>;
  return Object.keys(record).filter((key) => record[key]).join(" ");
}

function cn(...inputs: unknown[]) {
  return twMerge(toClass(inputs));
}

export type AnimatedAccordionTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedAccordionMode = "light" | "dark";

const THEMES: Record<`${AnimatedAccordionTheme}:${AnimatedAccordionMode}`, Record<string, string>> = {
  "default:light": {
    "accent-foreground": "oklch(0.205 0 0)",
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "destructive": "oklch(0.577 0.245 27.325)",
    "foreground": "oklch(0.145 0 0)",
    "muted": "oklch(0.92 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    "primary": "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    "ring": "oklch(0.708 0 0)"
  },
  "default:dark": {
    "accent-foreground": "oklch(0.985 0 0)",
    "background": "oklch(0.145 0 0)",
    "border": "oklch(1 0 0 / 10%)",
    "destructive": "oklch(0.704 0.191 22.216)",
    "foreground": "oklch(0.985 0 0)",
    "muted": "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    "primary": "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    "ring": "oklch(0.556 0 0)"
  },
  "caffeine:light": {
    "accent-foreground": "#202020",
    "background": "#f9f9f9",
    "border": "#d8d8d8",
    "destructive": "#e54d2e",
    "foreground": "#202020",
    "muted": "#efefef",
    "muted-foreground": "#646464",
    "primary": "#644a40",
    "primary-foreground": "#ffffff",
    "ring": "#644a40"
  },
  "caffeine:dark": {
    "accent-foreground": "#eeeeee",
    "background": "#111111",
    "border": "#201e18",
    "destructive": "#e54d2e",
    "foreground": "#eeeeee",
    "muted": "#222222",
    "muted-foreground": "#b4b4b4",
    "primary": "#ffe0c2",
    "primary-foreground": "#081a1b",
    "ring": "#ffe0c2"
  },
  "claude:light": {
    "accent-foreground": "#28261b",
    "background": "#faf9f5",
    "border": "#dad9d4",
    "destructive": "#c0392b",
    "foreground": "#3d3929",
    "muted": "#ede9de",
    "muted-foreground": "#83827d",
    "primary": "#c96442",
    "primary-foreground": "#ffffff",
    "ring": "#c96442"
  },
  "claude:dark": {
    "accent-foreground": "#f5f4ee",
    "background": "#262624",
    "border": "#3e3e38",
    "destructive": "#ef4444",
    "foreground": "#c3c0b6",
    "muted": "#1b1b19",
    "muted-foreground": "#b7b5a9",
    "primary": "#d97757",
    "primary-foreground": "#ffffff",
    "ring": "#d97757"
  },
  "ghibli:light": {
    "accent-foreground": "#2f4a55",
    "background": "#f3ecd9",
    "border": "#d5cba8",
    "destructive": "#c0533a",
    "foreground": "#4a4436",
    "muted": "#e6dec4",
    "muted-foreground": "#7a705a",
    "primary": "#6f9a5b",
    "primary-foreground": "#ffffff",
    "ring": "#6f9a5b"
  },
  "ghibli:dark": {
    "accent-foreground": "#e6e0cc",
    "background": "#1f2a26",
    "border": "#3b4c45",
    "destructive": "#e0745a",
    "foreground": "#e6e0cc",
    "muted": "#2c3a34",
    "muted-foreground": "#a8b39f",
    "primary": "#8fbf7a",
    "primary-foreground": "#15201a",
    "ring": "#8fbf7a"
  },
  "spotify:light": {
    "accent-foreground": "#0f6b30",
    "background": "#ffffff",
    "border": "#e0e0e0",
    "destructive": "#e22134",
    "foreground": "#191414",
    "muted": "#ececec",
    "muted-foreground": "#6a6a6a",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1db954"
  },
  "spotify:dark": {
    "accent-foreground": "#ffffff",
    "background": "#121212",
    "border": "#2a2a2a",
    "destructive": "#f3727f",
    "foreground": "#ffffff",
    "muted": "#1f1f1f",
    "muted-foreground": "#b3b3b3",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1ed760"
  },
  "valorant:light": {
    "accent-foreground": "#0f1923",
    "background": "#ece8e1",
    "border": "#cfc9bc",
    "destructive": "#bd3944",
    "foreground": "#0f1923",
    "muted": "#e2ddd2",
    "muted-foreground": "#5c6670",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655"
  },
  "valorant:dark": {
    "accent-foreground": "#ece8e1",
    "background": "#0f1923",
    "border": "#2b3a48",
    "destructive": "#ff6b76",
    "foreground": "#ece8e1",
    "muted": "#1a2733",
    "muted-foreground": "#8b978f",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655"
  },
  "vscode:light": {
    "accent-foreground": "#3b3b3b",
    "background": "#ffffff",
    "border": "#e5e5e5",
    "destructive": "#e51400",
    "foreground": "#3b3b3b",
    "muted": "#f3f3f3",
    "muted-foreground": "#717171",
    "primary": "#007acc",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4"
  },
  "vscode:dark": {
    "accent-foreground": "#ffffff",
    "background": "#1f1f1f",
    "border": "#3c3c3c",
    "destructive": "#f14c4c",
    "foreground": "#cccccc",
    "muted": "#2a2d2e",
    "muted-foreground": "#9d9d9d",
    "primary": "#0e639c",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedAccordionTheme = "default", mode: AnimatedAccordionMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  return { "data-theme": mode, style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

function MorphChevron({
  open,
  duration = 0.35,
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "children"> & { open: boolean; duration?: number }) {
  const reduceMotion = usePrefersReducedMotion()
  const transition = reduceMotion ? "none" : `transform ${duration}s ease-in-out`
  const half = (d: string, angle: number) => (
    <path
      d={d}
      style={{
        transformBox: "view-box",
        transformOrigin: "50px 50px",
        transform: `rotate(${angle}deg)`,
        transition,
      }}
    />
  )

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={10}
      strokeLinecap="square"
      className={cn("pointer-events-none size-4 shrink-0", className)}
      style={{ transform: open ? "translateY(-25%)" : "translateY(0%)", transition }}
      {...props}
    >
      {half("M10 50H50", open ? -42 : 42)}
      {half("M90 50H50", open ? 42 : -42)}
    </svg>
  )
}

/** Plus ↔ minus: a quick turn, eased in and out. */
const plusSpin = { duration: 0.3, ease: "easeInOut" } as const

function MorphPlus({
  open,
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.svg>, "children"> & { open: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("pointer-events-none size-5 shrink-0", className)}
      initial={false}
      animate={{ rotate: open ? 180 : 0 }}
      transition={plusSpin}
      {...props}
    >
      {/* Into a minus: the whole icon turns 180° while the vertical line turns 90° to lie
          flat. Closing plays it back. */}
      <path d="M5 12h14" />
      <motion.path
        d="M5 12h14"
        initial={false}
        animate={{ rotate: open ? 0 : 90 }}
        transition={plusSpin}
      />
    </motion.svg>
  )
}

// ---- accordion.tsx ----

const smoothEase = [0.22, 1, 0.36, 1] as const
const fillEase = [0.215, 0.61, 0.355, 1] as const

type Transition = NonNullable<HTMLMotionProps<"div">["transition"]>

type MotionPreset = {
  panelOpen: Transition
  panelClose: Transition
  fillOpen: Transition
  fillClose: Transition
  iconDuration: number
  lineDraw: Transition
  lineRetract: Transition
  contentY: Transition
  delay: number
  /** Gap between paragraphs, in seconds. */
  stagger: number
}

type MotionOptions = {
  elastic: boolean
  duration: number
  bounce: number
  delay: number
  stagger: number
}

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1)

function buildPreset({
  elastic,
  duration,
  bounce,
  delay,
  stagger,
}: MotionOptions): MotionPreset {
  if (!elastic) {
    const smooth = { duration, ease: smoothEase }
    const fill = { duration, ease: fillEase }
    const quick = { duration: duration * 0.6, ease: "easeOut" } as const
    return {
      panelOpen: smooth,
      panelClose: smooth,
      fillOpen: fill,
      fillClose: fill,
      iconDuration: duration,
      lineDraw: { duration, ease: "easeOut" },
      lineRetract: { duration, ease: "easeOut" },
      contentY: quick,
      delay,
      stagger,
    }
  }

  const spring = (b: number, d = duration) =>
    ({ type: "spring", visualDuration: d, bounce: clamp01(b) }) as const
  const settle = spring(0, Math.max(duration - 0.1, 0.1))
  return {
    panelOpen: spring(bounce - 0.05),
    panelClose: settle,
    fillOpen: spring(bounce),
    fillClose: settle,
    iconDuration: duration,
    lineDraw: spring(bounce - 0.1),
    lineRetract: settle,
    contentY: spring(bounce + 0.1),
    delay,
    stagger,
  }
}

const AccordionHoverContext = React.createContext<
  ((value: unknown) => void) | null
>(null)

const HOVER_INTENT_MS = 100

const AccordionMotionContext = React.createContext<MotionPreset>(
  buildPreset({
    elastic: false,
    duration: 0.5,
    bounce: 0.3,
    delay: 0.2,
    stagger: 0.05,
  })
)

function contentVariants(preset: MotionPreset, reduceMotion = false): Variants {
  return {
    open: {
      // Reduced motion: the panel opens at once, so its text shouldn't wait or trickle in
      transition: {
        delayChildren: reduceMotion ? 0 : preset.delay,
        staggerChildren: reduceMotion ? 0 : preset.stagger,
      },
    },
    closed: {},
  }
}

function contentItemVariants(preset: MotionPreset): Variants {
  return {
    open: {
      opacity: 1,
      y: "0em",
      transition: {
        y: preset.contentY,
        opacity: { duration: 0.3, ease: "easeOut" },
      },
    },
    closed: {
      opacity: 0,
      y: "0.5em",
      transition: { duration: 0.2, ease: "easeOut" },
    },
  }
}

function Accordion({
  className,
  bordered = false,
  elastic = false,
  duration = 0.5,
  bounce = 0.3,
  delay = 0.2,
  stagger = 0.05,
  openOnHover = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  onPointerLeave,
  ...props
}: AccordionPrimitive.Root.Props & {
  bordered?: boolean
  elastic?: boolean
  duration?: number
  bounce?: number
  delay?: number
  stagger?: number
  openOnHover?: boolean
}) {
  const preset = React.useMemo(
    () => buildPreset({ elastic, duration, bounce, delay, stagger }),
    [elastic, duration, bounce, delay, stagger]
  )

  const [openValue, setOpenValue] = React.useState<unknown[]>(
    defaultValue ?? []
  )
  const hoverTimer = React.useRef<number | undefined>(undefined)
  const hoverEnabled = openOnHover && valueProp === undefined

  React.useEffect(() => () => window.clearTimeout(hoverTimer.current), [])

  const openFromHover = React.useCallback((itemValue: unknown) => {
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => {
      setOpenValue((prev) =>
        prev.length === 1 && prev[0] === itemValue ? prev : [itemValue]
      )
    }, HOVER_INTENT_MS)
  }, [])

  return (
    <AccordionMotionContext.Provider value={preset}>
      <AccordionHoverContext.Provider
        value={hoverEnabled ? openFromHover : null}
      >
        <ReducedMotionConfig>
          <AccordionPrimitive.Root
            data-slot="accordion"
            className={cn(
              "flex w-full flex-col",
              // The outer border already closes the list, so the last item skips its divider
              bordered && "rounded-lg border p-6 max-md:p-4 [&>[data-slot=accordion-item]:last-child>[data-slot=accordion-divider]]:hidden",
              className
            )}
            value={valueProp ?? openValue}
            onValueChange={(next, details) => {
              setOpenValue(next)
              onValueChange?.(next, details)
            }}
            onPointerLeave={(event) => {
              onPointerLeave?.(event)
              if (hoverEnabled && event.pointerType === "mouse") {
                window.clearTimeout(hoverTimer.current)
                setOpenValue([])
              }
            }}
            {...props}
          />
        </ReducedMotionConfig>
      </AccordionHoverContext.Provider>
    </AccordionMotionContext.Provider>
  )
}

const FILL_COLOR = {
  muted: { bg: "bg-(--hx-muted)", text: "" },
  primary: { bg: "bg-(--hx-primary)", text: "data-open:**:text-(--hx-primary-foreground)!" },
} as const

function AccordionItem({
  className,
  fill,
  rounded = "rounded-none",
  showLine = false,
  accent = false,
  onPointerMove,
  ...props
}: AccordionPrimitive.Item.Props & {
  fill?: keyof typeof FILL_COLOR | false
  rounded?: string
  showLine?: boolean
  /** Hover line in the theme's primary colour (set when a theme is chosen) */
  accent?: boolean
}) {
  const preset = React.useContext(AccordionMotionContext)
  const openFromHover = React.useContext(AccordionHoverContext)
  const [hovered, setHovered] = React.useState(false)

  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      data-fill={fill ? "" : undefined}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (
          openFromHover &&
          props.value !== undefined &&
          event.pointerType === "mouse" &&
          (event.movementX !== 0 || event.movementY !== 0)
        ) {
          openFromHover(props.value)
        }
      }}
      className={cn(
        // No padding on the item itself: the trigger and panel carry it, so the whole header
        // block (not just the question's line) opens the item
        "group/accordion-item relative",
        fill && cn("isolate transition-colors duration-500 motion-reduce:transition-none", rounded, FILL_COLOR[fill].text),
        className
      )}
      render={(itemProps, state) => (
        <motion.div
          {...(itemProps as HTMLMotionProps<"div">)}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
        >
          {fill && (
            <motion.div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 -z-10 rounded-[inherit]",
                FILL_COLOR[fill].bg
              )}
              style={{ originY: 0 }}
              initial={false}
              // Grows down from the top edge only; the width never changes
              animate={{ scaleY: state.open ? 1 : 0 }}
              transition={state.open ? preset.fillOpen : preset.fillClose}
            />
          )}
          {itemProps.children}
          <div
            aria-hidden
            data-slot="accordion-divider"
            className={cn(
              // a touch lighter than the theme border, so the dividers read on dark backgrounds too
              "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[color-mix(in_oklch,var(--hx-border),var(--hx-foreground)_14%)]",
              fill &&
                "transition-opacity duration-300 motion-reduce:transition-none group-data-open/accordion-item:opacity-0 group-has-[+[data-open]]/accordion-item:opacity-0"
            )}
          />
          {showLine && <AccordionItemLine hovered={hovered} open={state.open} accent={accent} />}
        </motion.div>
      )}
      {...props}
    />
  )
}

/**
 * Draws in on hover, stays drawn while the item is open, and scales back to 0 when it
 * closes - even if the pointer is still over it (a fresh hover draws it again).
 */
function AccordionItemLine({ hovered, open, accent = false }: { hovered: boolean; open: boolean; accent?: boolean }) {
  const [closedUnderPointer, setClosedUnderPointer] = React.useState(false)
  const [wasOpen, setWasOpen] = React.useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (!open && hovered) setClosedUnderPointer(true)
  }
  if (closedUnderPointer && !hovered) setClosedUnderPointer(false)
  const drawn = open || (hovered && !closedUnderPointer)
  const preset = React.useContext(AccordionMotionContext)
  const reduceMotion = usePrefersReducedMotion()
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const isDrawn = React.useRef(false)
  const running = React.useRef(false)
  const target = React.useRef(drawn)

  const play = React.useEffectEvent(async () => {
    if (running.current) return
    running.current = true
    const snap = { originX: { duration: 0 } }
    while (scope.current && target.current !== isDrawn.current) {
      if (target.current) {
        const scaleX = reduceMotion ? { duration: 0 } : preset.lineDraw
        await animate(scope.current, { originX: 0, scaleX: 1 }, { ...snap, scaleX })
      } else {
        const scaleX = reduceMotion ? { duration: 0 } : preset.lineRetract
        await animate(scope.current, { originX: 1, scaleX: 0 }, { ...snap, scaleX })
      }
      isDrawn.current = !isDrawn.current
    }
    running.current = false
  })

  React.useEffect(() => {
    target.current = drawn
    play()
  }, [drawn])

  // The clip keeps Elastic's overshoot inside the item: the line still springs, but
  // never pokes past the item's edges.
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden">
      <motion.div
        ref={scope}
        style={{ scaleX: 0 }}
        className={cn("size-full", accent ? "bg-(--hx-primary)" : "bg-current")}
      />
    </div>
  )
}

function AccordionTrigger({
  className,
  children,
  icon = "chevron",
  accent = false,
  ...props
}: AccordionPrimitive.Trigger.Props & {
  icon?: "chevron" | "plus"
  /** Question and icon in the theme's primary colour, over the muted icon (set when a theme is chosen) */
  accent?: boolean
}) {
  const preset = React.useContext(AccordionMotionContext)

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger px-2 group-data-fill/accordion-item:px-6 max-md:group-data-fill/accordion-item:px-4 relative flex flex-1 cursor-pointer items-center justify-between rounded-lg border border-transparent py-5.5 text-left text-sm font-medium transition-[color,border-color,box-shadow] duration-500 motion-reduce:transition-none outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-(--hx-muted-foreground)",
          accent && "text-(--hx-primary) **:data-[slot=accordion-trigger-icon]:text-(--hx-primary)",
          className
        )}
        render={(triggerProps, state) => (
          <button {...triggerProps}>
            {triggerProps.children}
            {icon === "plus" ? (
              // Shared with the dropdown trigger, so both morph the same way.
              <MorphPlus
                data-slot="accordion-trigger-icon"
                open={state.open}
                className="size-5!"
              />
            ) : (
              // Shared with the dropdown trigger, so both morph the same way.
              <MorphChevron
                data-slot="accordion-trigger-icon"
                open={state.open}
                duration={preset.iconDuration}
              />
            )}
          </button>
        )}
        {...props}
      >
        {children}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  const reduceMotion = usePrefersReducedMotion()
  const preset = React.useContext(AccordionMotionContext)

  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm text-(--hx-muted-foreground) transition-colors duration-500 motion-reduce:transition-none"
      keepMounted
      render={({ hidden, children: _children, ...panelProps }, state) => (
        <motion.div
          {...(panelProps as HTMLMotionProps<"div">)}
          inert={!state.open}
          initial={false}
          animate={{ height: state.open ? "auto" : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : state.open
                ? preset.panelOpen
                : preset.panelClose
          }
        >
          <motion.div
            initial={false}
            animate={state.open ? "open" : "closed"}
            variants={contentVariants(preset, Boolean(reduceMotion))}
            className={cn(
              "flex max-w-[90%] flex-col gap-4 px-2 pb-5.5 group-data-fill/accordion-item:px-6 max-md:group-data-fill/accordion-item:px-4 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-(--hx-foreground)",
              typeof className === "function" ? className(state) : className
            )}
          >
            {React.Children.toArray(children).map((child, i) => (
              <motion.div key={i} variants={contentItemVariants(preset)}>
                {child}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
      {...props}
    />
  )
}

// ---- demo: page.tsx ----

const faqs = [
  {
    question: "How often will my coffee arrive?",
    answer: [
      "Every two weeks by default. You can switch to weekly or monthly deliveries at any time from your account, and the change applies to your next order.",
      "If you're heading away, pause your subscription for up to three months. We'll send a reminder a few days before deliveries start again.",
    ],
  },
  {
    question: "Can I choose how my beans are ground?",
    answer: [
      "Yes. Pick whole bean, or a grind for espresso, filter, French press or stovetop. You can set a different grind for each coffee in your box.",
      "Whole beans stay fresh longest, so we recommend them if you have a grinder at home.",
    ],
  },
  {
    question: "When is the coffee roasted?",
    answer: [
      "We roast every Monday and Thursday and ship within 24 hours, so your coffee reaches you within a few days of roasting.",
      "Each bag is stamped with its roast date. For the best flavour, brew it within a month.",
    ],
  },
  {
    question: "What if I don't like a coffee?",
    answer: [
      "Tell us within 14 days and we'll send a replacement from a different origin, free of charge. There's no need to send the bag back.",
      "Your feedback also tunes future boxes, so we can steer you toward the flavours you enjoy.",
    ],
  },
]

const controls = {
  multiple: { group: "Accordion", type: "checkbox", label: "Multiple open", value: false },
  openOnHover: { group: "Accordion", type: "checkbox", label: "Open on hover", value: false },
  bordered: { group: "Accordion", type: "checkbox", label: "Border", value: false },
  borderRounded: {
    disabled: (v: Record<string, unknown>) => !v.bordered,
    group: "Accordion",
    type: "select",
    label: "Border roundness",
    value: "rounded-lg",
    options: [
      { label: "None", value: "rounded-none" },
      { label: "Small", value: "rounded-sm" },
      { label: "Medium", value: "rounded-md" },
      { label: "Large", value: "rounded-lg" },
      { label: "xl", value: "rounded-xl" },
      { label: "2xl", value: "rounded-2xl" },
      { label: "3xl", value: "rounded-3xl" },
    ],
  },
  elastic: { group: "Accordion", type: "checkbox", label: "Elastic", value: true },
  duration: {
    group: "Timing",
    type: "slider",
    label: "Duration",
    value: 0.3,
    min: 0.1,
    max: 1.5,
    step: 0.05,
    unit: "s",
  },
  bounce: {
    disabled: (v: Record<string, unknown>) => !v.elastic,
    group: "Timing",
    type: "slider",
    label: "Bounce",
    value: 0.4,
    min: 0,
    max: 0.8,
    step: 0.05,
  },
  delay: {
    group: "Timing",
    type: "slider",
    label: "Delay",
    value: 0.2,
    min: 0,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  stagger: {
    group: "Timing",
    type: "slider",
    label: "Stagger",
    value: 0.05,
    min: 0,
    max: 0.3,
    step: 0.01,
    unit: "s",
  },
  fill: { group: "Item", type: "checkbox", label: "Fill", value: true },
  fillColor: {
    disabled: (v: Record<string, unknown>) => !v.fill,
    group: "Item",
    type: "select",
    label: "Fill colour",
    value: "primary",
    options: [
      { label: "Muted", value: "muted" },
      { label: "Primary", value: "primary" },
    ],
  },
  rounded: {
    disabled: (v: Record<string, unknown>) => !v.fill,
    group: "Item",
    type: "select",
    label: "Fill roundness",
    value: "rounded-none",
    options: [
      { label: "None", value: "rounded-none" },
      { label: "Small", value: "rounded-sm" },
      { label: "Medium", value: "rounded-md" },
      { label: "Large", value: "rounded-lg" },
      { label: "xl", value: "rounded-xl" },
      { label: "2xl", value: "rounded-2xl" },
      { label: "3xl", value: "rounded-3xl" },
    ],
  },
  showLine: { group: "Item", type: "checkbox", label: "Hover line", value: true },
  icon: {
    group: "Icon",
    type: "select",
    label: "Icon",
    value: "plus",
    options: [
      { label: "Plus / minus", value: "plus" },
      { label: "Chevron", value: "chevron" },
    ],
  },
}

function AccordionPage({ accent = false, ...props }: Partial<ControlValues> & { accent?: boolean }) {
  const panel = useDemoControls(props)
  const { values } = panel

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mt-6 flex min-h-48 items-center justify-center">
        <Accordion
          // Border roundness sets the outer border's corners (tailwind-merge swaps it in
          // for the border's default rounded-lg); Roundness only shapes the fill
          className={cn("w-full", values.bordered && values.borderRounded)}
          multiple={values.multiple}
          openOnHover={values.openOnHover}
          bordered={values.bordered}
          elastic={values.elastic}
          duration={values.duration}
          bounce={values.bounce}
          delay={values.delay}
          stagger={values.stagger}
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.question}
              value={`item-${i + 1}`}
              showLine={values.showLine}
              accent={accent}
              fill={values.fill ? (values.fillColor as "muted" | "primary") : false}
              rounded={values.rounded}
            >
              <AccordionTrigger
                icon={values.icon as "plus" | "chevron"}
                accent={accent}
                className="text-lg max-md:text-base"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

    </div>
  )
}

type ControlValues = { [K in keyof typeof controls]: (typeof controls)[K]["value"] };
const controlDefaults = Object.fromEntries(
  Object.entries(controls).map(([key, control]) => [key, control.value])
) as ControlValues;

// Demo-set values win until the props change
function useDemoControls(props: Partial<ControlValues>) {
  const [overrides, setOverrides] = React.useState<Partial<ControlValues>>({});
  const [seen, setSeen] = React.useState(props);
  if (seen !== props && JSON.stringify(seen) !== JSON.stringify(props)) {
    setSeen(props);
    setOverrides({});
  }
  const values = { ...controlDefaults, ...props, ...overrides } as ControlValues;
  const set = <K extends keyof ControlValues>(key: K, value: ControlValues[K]) =>
    setOverrides((current) => ({ ...current, [key]: value }));
  return { values, set };
}

export interface AnimatedAccordionProps extends Partial<ControlValues> {
  theme?: AnimatedAccordionTheme;
  mode?: AnimatedAccordionMode;
  className?: string;
}

export default function AnimatedAccordion({ theme = "caffeine", mode = "dark", className, ...props }: AnimatedAccordionProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) motion-reduce:**:transition-none in-data-pc-rm:**:transition-none in-data-pc-rm:**:animate-none [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        {/* Any theme but the default puts the question, icon and hover line in its primary colour */}
        <AccordionPage {...props} accent={theme !== "default"} />
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};
