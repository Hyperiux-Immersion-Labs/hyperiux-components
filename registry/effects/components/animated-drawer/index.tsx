// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { MotionConfig, motion, animate, stagger } from "motion/react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { twMerge } from "tailwind-merge";

// Read here, not through motion's hook, so the demo's reduced-motion switch is honoured too
function usePrefersReducedMotion() {
  const [reduce, setReduce] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const read = () => setReduce(mq.matches)
    read()
    mq.addEventListener?.("change", read)
    return () => mq.removeEventListener?.("change", read)
  }, [])
  return reduce
}

// Motion follows the same setting: transforms and layout animations land instantly when it's on
function ReducedMotionConfig({ children }: { children: React.ReactNode }) {
  const reduce = usePrefersReducedMotion()
  return <MotionConfig reducedMotion={reduce ? "always" : "never"}>{children}</MotionConfig>
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

export type AnimatedDrawerTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedDrawerMode = "light" | "dark";

const THEMES: Record<`${AnimatedDrawerTheme}:${AnimatedDrawerMode}`, Record<string, string>> = {
  "default:light": {
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "destructive": "oklch(0.577 0.245 27.325)",
    "foreground": "oklch(0.145 0 0)",
    "input": "oklch(0.922 0 0)",
    "muted": "oklch(0.92 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    "popover": "oklch(1 0 0)",
    "popover-foreground": "oklch(0.145 0 0)",
    "primary": "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    "ring": "oklch(0.708 0 0)",
    "secondary": "oklch(0.97 0 0)",
    "secondary-foreground": "oklch(0.205 0 0)"
  },
  "default:dark": {
    "background": "oklch(0.145 0 0)",
    "border": "oklch(1 0 0 / 10%)",
    "destructive": "oklch(0.704 0.191 22.216)",
    "foreground": "oklch(0.985 0 0)",
    "input": "oklch(1 0 0 / 15%)",
    "muted": "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    "popover": "oklch(0.205 0 0)",
    "popover-foreground": "oklch(0.985 0 0)",
    "primary": "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    "ring": "oklch(0.556 0 0)",
    "secondary": "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)"
  },
  "caffeine:light": {
    "background": "#f9f9f9",
    "border": "#d8d8d8",
    "destructive": "#e54d2e",
    "foreground": "#202020",
    "input": "#d8d8d8",
    "muted": "#efefef",
    "muted-foreground": "#646464",
    "popover": "#fcfcfc",
    "popover-foreground": "#202020",
    "primary": "#644a40",
    "primary-foreground": "#ffffff",
    "ring": "#644a40",
    "secondary": "#ffdfb5",
    "secondary-foreground": "#582d1d"
  },
  "caffeine:dark": {
    "background": "#111111",
    "border": "#201e18",
    "destructive": "#e54d2e",
    "foreground": "#eeeeee",
    "input": "#484848",
    "muted": "#222222",
    "muted-foreground": "#b4b4b4",
    "popover": "#191919",
    "popover-foreground": "#eeeeee",
    "primary": "#ffe0c2",
    "primary-foreground": "#081a1b",
    "ring": "#ffe0c2",
    "secondary": "#393028",
    "secondary-foreground": "#ffe0c2"
  },
  "claude:light": {
    "background": "#faf9f5",
    "border": "#dad9d4",
    "destructive": "#c0392b",
    "foreground": "#3d3929",
    "input": "#b4b2a7",
    "muted": "#ede9de",
    "muted-foreground": "#83827d",
    "popover": "#ffffff",
    "popover-foreground": "#28261b",
    "primary": "#c96442",
    "primary-foreground": "#ffffff",
    "ring": "#c96442",
    "secondary": "#e9e6dc",
    "secondary-foreground": "#535146"
  },
  "claude:dark": {
    "background": "#262624",
    "border": "#3e3e38",
    "destructive": "#ef4444",
    "foreground": "#c3c0b6",
    "input": "#52514a",
    "muted": "#1b1b19",
    "muted-foreground": "#b7b5a9",
    "popover": "#30302e",
    "popover-foreground": "#e5e5e2",
    "primary": "#d97757",
    "primary-foreground": "#ffffff",
    "ring": "#d97757",
    "secondary": "#faf9f5",
    "secondary-foreground": "#30302e"
  },
  "ghibli:light": {
    "background": "#f3ecd9",
    "border": "#d5cba8",
    "destructive": "#c0533a",
    "foreground": "#4a4436",
    "input": "#cfc59f",
    "muted": "#e6dec4",
    "muted-foreground": "#7a705a",
    "popover": "#f8f2e2",
    "popover-foreground": "#4a4436",
    "primary": "#6f9a5b",
    "primary-foreground": "#ffffff",
    "ring": "#6f9a5b",
    "secondary": "#dcd3b6",
    "secondary-foreground": "#4a4436"
  },
  "ghibli:dark": {
    "background": "#1f2a26",
    "border": "#3b4c45",
    "destructive": "#e0745a",
    "foreground": "#e6e0cc",
    "input": "#46584f",
    "muted": "#2c3a34",
    "muted-foreground": "#a8b39f",
    "popover": "#27342f",
    "popover-foreground": "#e6e0cc",
    "primary": "#8fbf7a",
    "primary-foreground": "#15201a",
    "ring": "#8fbf7a",
    "secondary": "#34443d",
    "secondary-foreground": "#e6e0cc"
  },
  "spotify:light": {
    "background": "#ffffff",
    "border": "#e0e0e0",
    "destructive": "#e22134",
    "foreground": "#191414",
    "input": "#d4d4d4",
    "muted": "#ececec",
    "muted-foreground": "#6a6a6a",
    "popover": "#ffffff",
    "popover-foreground": "#191414",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1db954",
    "secondary": "#f0f0f0",
    "secondary-foreground": "#191414"
  },
  "spotify:dark": {
    "background": "#121212",
    "border": "#2a2a2a",
    "destructive": "#f3727f",
    "foreground": "#ffffff",
    "input": "#3a3a3a",
    "muted": "#1f1f1f",
    "muted-foreground": "#b3b3b3",
    "popover": "#282828",
    "popover-foreground": "#ffffff",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1ed760",
    "secondary": "#242424",
    "secondary-foreground": "#ffffff"
  },
  "valorant:light": {
    "background": "#ece8e1",
    "border": "#cfc9bc",
    "destructive": "#bd3944",
    "foreground": "#0f1923",
    "input": "#c4beb0",
    "muted": "#e2ddd2",
    "muted-foreground": "#5c6670",
    "popover": "#f5f2ec",
    "popover-foreground": "#0f1923",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "secondary": "#dcd7cc",
    "secondary-foreground": "#0f1923"
  },
  "valorant:dark": {
    "background": "#0f1923",
    "border": "#2b3a48",
    "destructive": "#ff6b76",
    "foreground": "#ece8e1",
    "input": "#344454",
    "muted": "#1a2733",
    "muted-foreground": "#8b978f",
    "popover": "#1f2326",
    "popover-foreground": "#ece8e1",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "secondary": "#1f2b37",
    "secondary-foreground": "#ece8e1"
  },
  "vscode:light": {
    "background": "#ffffff",
    "border": "#e5e5e5",
    "destructive": "#e51400",
    "foreground": "#3b3b3b",
    "input": "#cecece",
    "muted": "#f3f3f3",
    "muted-foreground": "#717171",
    "popover": "#f8f8f8",
    "popover-foreground": "#3b3b3b",
    "primary": "#007acc",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "secondary": "#e5e5e5",
    "secondary-foreground": "#3b3b3b"
  },
  "vscode:dark": {
    "background": "#1f1f1f",
    "border": "#3c3c3c",
    "destructive": "#f14c4c",
    "foreground": "#cccccc",
    "input": "#3c3c3c",
    "muted": "#2a2d2e",
    "muted-foreground": "#9d9d9d",
    "popover": "#252526",
    "popover-foreground": "#cccccc",
    "primary": "#0e639c",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "secondary": "#3a3d41",
    "secondary-foreground": "#ffffff"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedDrawerTheme = "default", mode: AnimatedDrawerMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  // Any theme but Default tints key parts with its primary colour
  return { "data-theme": mode, "data-accent": theme === "default" ? undefined : "", style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

function ThemeScope({ children }: { children?: React.ReactNode }) {
  const themed = React.useContext(ThemeContext);
  return (
    <div {...themed} className="contents motion-reduce:**:transition-none in-data-pc-rm:**:transition-none in-data-pc-rm:**:animate-none [:where(&_*)]:border-(--hx-border) [:where(&_*)]:outline-(--hx-ring)/50">
      {children}
    </div>
  );
}

// ---- button.tsx ----

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--hx-ring) focus-visible:ring-3 focus-visible:ring-(--hx-ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--hx-destructive) aria-invalid:ring-3 aria-invalid:ring-(--hx-destructive)/20 in-data-[theme=dark]:aria-invalid:border-(--hx-destructive)/50 in-data-[theme=dark]:aria-invalid:ring-(--hx-destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-(--hx-primary) text-(--hx-primary-foreground) hover:bg-(--hx-primary)/80",
        outline:
          "border-(--hx-border) bg-(--hx-background) hover:bg-(--hx-muted) hover:text-(--hx-foreground) aria-expanded:bg-(--hx-muted) aria-expanded:text-(--hx-foreground) in-data-[theme=dark]:border-(--hx-input) in-data-[theme=dark]:bg-(--hx-input)/30 in-data-[theme=dark]:hover:bg-(--hx-input)/50",
        secondary:
          "bg-(--hx-secondary) text-(--hx-secondary-foreground) hover:bg-[color-mix(in_oklch,var(--hx-secondary),var(--hx-foreground)_5%)] aria-expanded:bg-(--hx-secondary) aria-expanded:text-(--hx-secondary-foreground)",
        ghost:
          "hover:bg-(--hx-muted) hover:text-(--hx-foreground) aria-expanded:bg-(--hx-muted) aria-expanded:text-(--hx-foreground) in-data-[theme=dark]:hover:bg-(--hx-muted)/50",
        destructive:
          "bg-(--hx-destructive)/10 text-(--hx-destructive) hover:bg-(--hx-destructive)/20 focus-visible:border-(--hx-destructive)/40 focus-visible:ring-(--hx-destructive)/20 in-data-[theme=dark]:bg-(--hx-destructive)/20 in-data-[theme=dark]:hover:bg-(--hx-destructive)/30 in-data-[theme=dark]:focus-visible:ring-(--hx-destructive)/40",
        link: "text-(--hx-primary) underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-md in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-md in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// ---- hover-effects.tsx ----

/** Text that rolls up to a copy of itself while the nearest `group/roll` is hovered. */
function RollText({ children }: { children: React.ReactNode }) {
  const roll =
    "block transition-transform duration-400 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none"
  return (
    <span className="relative block overflow-hidden">
      <span className={cn(roll, "group-hover/roll:-translate-y-full")}>{children}</span>
      <span
        aria-hidden
        className={cn(roll, "absolute inset-x-0 top-0 translate-y-full group-hover/roll:translate-y-0")}
      >
        {children}
      </span>
    </span>
  )
}

/** Classes for a button that carries the hover fill: the fill sits under its label. */
const HOVER_FILL_CLASSES =
  "relative isolate overflow-hidden transition-[border-color] duration-400 ease-in-out hover:border-(--hx-primary) hover:bg-(--hx-background) in-data-[theme=dark]:hover:bg-(--hx-input)/30"

/**
 * A hover fill that grows as a circle from where the pointer came in, and shrinks back
 * towards where it left. Put `circle` inside the button, wrap its content in `label`, and
 * call `place` on enter and leave.
 */
function useHoverFill() {
  const [fill, setFill] = React.useState({ x: 0, y: 0, on: false })
  const place = (event: React.PointerEvent<HTMLElement>, on: boolean) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setFill({ x: event.clientX - rect.left, y: event.clientY - rect.top, on })
  }
  const circle = (
    // Wide enough to cover the button from any corner once fully grown.
    <motion.span
      aria-hidden
      className="pointer-events-none absolute -z-10 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--hx-primary)"
      style={{ left: fill.x, top: fill.y }}
      initial={false}
      animate={{ scale: fill.on ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
  )
  const label = (children: React.ReactNode) => <span className="relative">{children}</span>
  return { place, circle, label }
}

/**
 * The hover state shared by the dialog and drawer triggers: text that rolls, and optionally
 * the circle fill. Without the fill, hover leaves the background alone.
 */
function useTriggerHover({ rollingText, fillOnHover }: { rollingText: boolean; fillOnHover: boolean }) {
  const { place, circle, label } = useHoverFill()
  return {
    className: cn(
      "group/roll",
      fillOnHover
        ? HOVER_FILL_CLASSES
        : "hover:bg-(--hx-background) hover:text-(--hx-foreground) in-data-[theme=dark]:hover:bg-(--hx-input)/30"
    ),
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      if (fillOnHover) place(event, true)
    },
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
      if (fillOnHover) place(event, false)
    },
    content: (children: React.ReactNode) => {
      const text = rollingText && typeof children === "string" ? <RollText>{children}</RollText> : children
      return fillOnHover ? (
        <>
          {circle}
          {label(text)}
        </>
      ) : (
        text
      )
    },
  }
}

// ---- stagger-in.ts ----

/**
 * Fades the elements matching `selector` inside `root` up into place one after another.
 * Call it as the container mounts (from a callback ref): the items are hidden first, so
 * they never show for a frame before their turn.
 */
function staggerIn(
  root: Element,
  selector: string,
  { gap, delay = 0.08, distance = 8 }: { gap: number; delay?: number; distance?: number }
) {
  if (gap <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const items = Array.from(root.querySelectorAll<HTMLElement>(selector))
  if (items.length === 0) return
  for (const item of items) item.style.opacity = "0"
  return animate(
    items,
    { opacity: [0, 1], y: [distance, 0] },
    { delay: stagger(gap, { startDelay: delay }), duration: 0.35, ease: [0.22, 1, 0.36, 1] }
  )
}

// ---- drawer.tsx ----

type DrawerMotion = {
  /** Spring instead of an eased slide. */
  elastic: boolean
  /** Seconds. */
  duration: number
  /** Spring overshoot, 0–0.9. */
  bounce: number
  /** Gap between items fading in. */
  stagger: number
  /** Tilts a little while swiped. */
  tiltOnSwipe: boolean
  /** Trigger text rolls up on hover. */
  rollingText: boolean
  /** Trigger fills from pointer on hover. */
  fillOnHover: boolean
  /** Slide in, or fade in place. */
  openAnimation: DrawerOpenAnimation
}

type DrawerOpenAnimation = "slide" | "fade"

type DrawerContextProps = DrawerMotion & {
  hasSnapPoints: boolean
  modal: DrawerPrimitive.Root.Props["modal"]
  showSwipeHandle: boolean
  swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>
}

/** A spring as CSS linear() easing. */
function springEasing(bounce: number) {
  const zeta = 1 - Math.min(Math.max(bounce, 0), 0.9)
  const omega = 7 / zeta
  const steps = 40
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    if (i === steps) return 1
    if (zeta >= 1) return 1 - Math.exp(-omega * t) * (1 + omega * t)
    const damped = omega * Math.sqrt(1 - zeta ** 2)
    return (
      1 -
      Math.exp(-zeta * omega * t) *
        (Math.cos(damped * t) + ((zeta * omega) / damped) * Math.sin(damped * t))
    )
  })
  return `linear(${points.map((p) => +p.toFixed(4)).join(", ")})`
}

/** Titles and any element marked data-drawer-item stagger in, boxes included. */
const STAGGER_ITEMS =
  '[data-slot="drawer-title"], [data-slot="drawer-description"], [data-drawer-item]'

const DrawerContext = React.createContext<DrawerContextProps | null>(null)

function useDrawer() {
  const context = React.useContext(DrawerContext)

  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.")
  }

  return context
}

function Drawer({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "down",
  elastic = true,
  duration = 0.5,
  bounce = 0.2,
  stagger = 0.04,
  tiltOnSwipe = false,
  rollingText = true,
  fillOnHover = false,
  openAnimation = "slide",
  ...props
}: DrawerPrimitive.Root.Props &
  Partial<DrawerMotion> & {
    showSwipeHandle?: boolean
  }) {
  // Base UI only snaps bottom sheets.
  const snaps = swipeDirection === "down" ? snapPoints : undefined
  const hasSnapPoints = snaps != null && snaps.length > 0
  const contextValue = React.useMemo(
    () => ({
      hasSnapPoints,
      modal,
      showSwipeHandle,
      swipeDirection,
      elastic,
      duration,
      bounce,
      stagger,
      tiltOnSwipe,
      rollingText,
      fillOnHover,
      openAnimation,
    }),
    [
      hasSnapPoints,
      modal,
      showSwipeHandle,
      swipeDirection,
      elastic,
      duration,
      bounce,
      stagger,
      tiltOnSwipe,
      rollingText,
      fillOnHover,
      openAnimation,
    ]
  )

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={snaps}
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  )
}

function DrawerTrigger({
  onPointerEnter,
  onPointerLeave,
  className,
  children,
  ...props
}: DrawerPrimitive.Trigger.Props) {
  const hover = useTriggerHover(useDrawer())
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        hover.onPointerEnter(event)
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        hover.onPointerLeave(event)
      }}
      className={(state) =>
        cn(hover.className, typeof className === "function" ? className(state) : className)
      }
      {...props}
    >
      {hover.content(children)}
    </DrawerPrimitive.Trigger>
  )
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 min-h-dvh bg-black/10 opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] select-none data-ending-style:pointer-events-none data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-snap-points:[--drawer-overlay-min-opacity:0.5] data-starting-style:opacity-0 data-swiping:duration-0 supports-backdrop-filter:backdrop-blur-xs supports-[-webkit-touch-callout:none]:absolute",
        className
      )}
      {...props}
    />
  )
}

function DrawerSwipeHandle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      className={cn(
        "relative z-10 flex shrink-0 cursor-grab transition-opacity duration-200 group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-[swipe-axis=x]/drawer-popup:h-full group-data-[swipe-axis=x]/drawer-popup:w-3 group-data-[swipe-axis=x]/drawer-popup:items-center group-data-[swipe-axis=y]/drawer-popup:h-3 group-data-[swipe-axis=y]/drawer-popup:w-full group-data-[swipe-axis=y]/drawer-popup:justify-center group-data-[swipe-direction=down]/drawer-popup:items-end group-data-[swipe-direction=left]/drawer-popup:order-last group-data-[swipe-direction=left]/drawer-popup:justify-start group-data-[swipe-direction=right]/drawer-popup:justify-end group-data-[swipe-direction=up]/drawer-popup:order-last group-data-[swipe-direction=up]/drawer-popup:items-start after:block after:shrink-0 after:rounded-full after:bg-(--hx-muted) group-data-[swipe-axis=x]/drawer-popup:after:h-24 group-data-[swipe-axis=x]/drawer-popup:after:w-1 group-data-[swipe-axis=y]/drawer-popup:after:h-1 group-data-[swipe-axis=y]/drawer-popup:after:w-24 active:cursor-grabbing",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props) {
  const {
    hasSnapPoints,
    modal,
    showSwipeHandle,
    swipeDirection,
    elastic,
    duration,
    bounce,
    stagger,
    tiltOnSwipe,
    openAnimation,
  } = useDrawer()
  const fade = openAnimation === "fade"
  const swipeAxis =
    swipeDirection === "down" || swipeDirection === "up" ? "y" : "x"
  const ease = React.useMemo(
    () => (elastic && !fade ? springEasing(bounce) : "cubic-bezier(0.22,1,0.36,1)"),
    [elastic, bounce, fade]
  )
  const attach = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return
      const delay = duration * 0.3
      // Fade content in, stagger its items.
      const content = node.querySelector<HTMLElement>('[data-slot="drawer-content"]')
      if (content && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        content.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 350,
          delay: delay * 1000,
          easing: "ease-out",
          fill: "backwards",
        })
      }
      staggerIn(node, STAGGER_ITEMS, { gap: stagger, delay })
    },
    [stagger, duration]
  )

  return (
    <DrawerPortal data-slot="drawer-portal"><ThemeScope>
      {modal === true && (
        <DrawerOverlay data-snap-points={hasSnapPoints ? "" : undefined} />
      )}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal}
        className="pointer-events-none fixed inset-0 z-50 select-none data-[modal=true]:pointer-events-auto"
      >
        <DrawerPrimitive.Popup
          ref={attach}
          data-slot="drawer-popup"
          data-swipe-axis={swipeAxis}
          data-snap-points={hasSnapPoints ? "" : undefined}
          style={
            {
              "--drawer-duration": `${duration}s`,
              "--drawer-ease": ease,
              // Fade: close in place.
              ...(fade && {
                "--closed-transform":
                  "translate3d(var(--translate-x,0px),var(--translate-y,0px),0) scale(var(--stack-scale))",
              }),
            } as React.CSSProperties
          }
          className={cn(
            // Base.
            "group/drawer-popup pointer-events-auto fixed z-50 m-(--drawer-inset,0px) flex h-(--drawer-content-height) max-h-(--drawer-content-max-height,none) min-h-0 w-(--drawer-content-width,auto) transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(var(--stack-scale))] flex-col bg-(--hx-popover) text-sm text-(--hx-popover-foreground) transition-[transform,height,opacity,filter,rotate] duration-(--drawer-duration) ease-(--drawer-ease) will-change-transform outline-none select-none [interpolate-size:allow-keywords] data-[swipe-direction=down]:rounded-t-xl data-[swipe-direction=down]:border-t data-[swipe-direction=left]:rounded-r-xl data-[swipe-direction=left]:border-r data-[swipe-direction=right]:rounded-l-xl data-[swipe-direction=right]:border-l data-[swipe-direction=up]:rounded-b-xl data-[swipe-direction=up]:border-b",
            // Nested.
            "data-nested-drawer-open:overflow-hidden data-nested-drawer-open:brightness-95",
            // Bleed.
            "after:pointer-events-none after:absolute after:bg-(--drawer-bleed-background,var(--color-popover)) data-[swipe-axis=x]:after:inset-y-0 data-[swipe-axis=x]:after:w-(--bleed) data-[swipe-axis=y]:after:inset-x-0 data-[swipe-axis=y]:after:h-(--bleed) data-[swipe-direction=down]:after:top-full data-[swipe-direction=left]:after:right-full data-[swipe-direction=right]:after:left-full data-[swipe-direction=up]:after:bottom-full",
            // Sizing.
            "[--drawer-content-height:var(--drawer-height,auto)] data-[swipe-axis=x]:[--drawer-content-width:75%] data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-6rem)] data-[swipe-axis=y]:data-snap-points:[--drawer-content-height:100dvh] data-[swipe-axis=x]:sm:[--drawer-content-width:32rem]",
            // Stack.
            "[--bleed:3rem] [--peek:1rem] [--stack-height:var(--drawer-frontmost-height,var(--drawer-height,0px))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))] [--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--stack-shrink:calc(1-var(--stack-scale))] [--stack-step:0.05]",
            // Transitions.
            "data-ending-style:transform-(--closed-transform) data-ending-style:opacity-[0.9999] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-nested-drawer-swiping:duration-0 data-ending-style:data-nested-drawer-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:transform-(--closed-transform) data-swiping:duration-0 data-ending-style:data-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
            // Top/bottom drawers: centred column.
            "data-[swipe-axis=y]:inset-x-0 data-[swipe-axis=y]:min-h-[45vh] data-[swipe-axis=y]:w-auto data-[swipe-axis=y]:data-nested-drawer-open:h-(--stack-height)",
            // Axis: x.
            "data-[swipe-axis=x]:inset-y-0 data-[swipe-axis=x]:flex-row",
            // Direction: down.
            "data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:origin-bottom data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%+var(--drawer-inset,0px)+2px),0)] data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]",
            // Direction: up.
            "data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:origin-top data-[swipe-direction=up]:[--closed-transform:translate3d(0,calc(-100%-var(--drawer-inset,0px)-2px),0)] data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))]",
            // Direction: left.
            "data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:origin-left data-[swipe-direction=left]:[--closed-transform:translate3d(calc(-100%-var(--drawer-inset,0px)-2px),0,0)] data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--stack-shrink)*100%))]",
            // Direction: right.
            "data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:origin-right data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%+var(--drawer-inset,0px)+2px),0,0)] data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--stack-shrink)*100%))]",
            // Tilt with the drag.
            tiltOnSwipe &&
              "data-[swipe-axis=x]:rotate-[atan2(var(--drawer-swipe-movement-x,0px),3000px)] data-[swipe-axis=y]:rotate-[atan2(var(--drawer-swipe-movement-y,0px),3000px)]",
            fade && "data-ending-style:opacity-0 data-starting-style:opacity-0",
            className
          )}
          {...props}
        >
          {showSwipeHandle && <DrawerSwipeHandle />}
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className={cn(
              "flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain rounded-[inherit] transition-opacity duration-300 ease-[cubic-bezier(0.45,1.005,0,1.005)] select-text group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-swiping/drawer-popup:select-none"
            )}
          >
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </ThemeScope></DrawerPortal>
  )
}

/** Wraps the page behind drawers. */
function DrawerProvider({ ...props }: DrawerPrimitive.Provider.Props) {
  return <DrawerPrimitive.Provider {...props} />
}

/** Optional colour behind the indented page. */
function DrawerIndentBackground({
  className,
  ...props
}: DrawerPrimitive.IndentBackground.Props) {
  return (
    <DrawerPrimitive.IndentBackground
      data-slot="drawer-indent-background"
      className={cn("absolute inset-0 -z-10 rounded-[inherit]", className)}
      {...props}
    />
  )
}

/** Page behind: shrinks while drawer opens. */
function DrawerIndent({
  className,
  scale = true,
  ...props
}: DrawerPrimitive.Indent.Props & {
  /** Shrink and round while open. */
  scale?: boolean
}) {
  return (
    <DrawerPrimitive.Indent
      data-slot="drawer-indent"
      className={cn(
        "origin-top transition-[scale,border-radius,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        scale &&
          "data-active:translate-y-[2vh] data-active:scale-[0.94] data-active:overflow-hidden data-active:rounded-2xl",
        className
      )}
      {...props}
    />
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex shrink-0 flex-col gap-1 px-6 py-4 max-sm:px-4 group-data-[swipe-axis=y]/drawer-popup:text-center md:gap-0.5 md:text-left",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex shrink-0 flex-col gap-2 px-6 py-4 max-sm:px-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "font-heading text-base font-medium text-(--hx-foreground)",
        className
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-balance text-(--hx-muted-foreground)", className)}
      {...props}
    />
  )
}

// ---- demo: drawer-demo.tsx ----

const roasts = [
  { name: "Ethiopia Guji", notes: "Jasmine, peach, black tea" },
  { name: "Colombia Huila", notes: "Red apple, caramel, cocoa" },
  { name: "Kenya Nyeri", notes: "Blackcurrant, grapefruit" },
  { name: "House blend", notes: "Chocolate, hazelnut" },
]

const SIDES = { bottom: "down", top: "up", left: "left", right: "right" } as const

const controls = {
  rollingText: { group: "Button", type: "checkbox", label: "Rolling text", value: true },
  fillOnHover: { group: "Button", type: "checkbox", label: "Fill on hover", value: false },

  side: {
    group: "Drawer",
    type: "select",
    label: "Side",
    value: "bottom",
    options: [
      { label: "Bottom", value: "bottom" },
      { label: "Top", value: "top" },
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ],
  },
  showSwipeHandle: { group: "Drawer", type: "checkbox", label: "Swipe handle", value: true },

  openAnimation: {
    group: "Motion",
    type: "select",
    label: "Opens with",
    value: "slide",
    options: [
      { label: "Slide", value: "slide" },
      { label: "Fade", value: "fade" },
    ],
  },
  elastic: { disabled: (v: Record<string, unknown>) => v.openAnimation === "fade", group: "Motion", type: "checkbox", label: "Elastic", value: true },
  duration: {
    group: "Motion",
    type: "slider",
    label: "Duration",
    value: 0.5,
    min: 0.2,
    max: 1.2,
    step: 0.05,
    unit: "s",
  },
  bounce: { disabled: (v: Record<string, unknown>) => !v.elastic || v.openAnimation === "fade", group: "Motion", type: "slider", label: "Bounce", value: 0.2, min: 0, max: 0.6, step: 0.05 },
  stagger: {
    group: "Motion",
    type: "slider",
    label: "Stagger",
    value: 0.04,
    min: 0,
    max: 0.15,
    step: 0.01,
    unit: "s",
  },
  tiltOnSwipe: { group: "Motion", type: "checkbox", label: "Tilt on swipe", value: false },
  scaleBackground: { group: "Motion", type: "checkbox", label: "Shrink page behind", value: true },
}

function DrawerDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { side, scaleBackground, openAnimation, ...options } = panel.values
  const direction = SIDES[side as keyof typeof SIDES]

  return (
    <DrawerProvider>
      <div className="relative isolate rounded-2xl">
        <DrawerIndent scale={scaleBackground} className="flex flex-col gap-6 py-2">
          <div className="flex flex-col gap-1">
          </div>

          <div className="flex min-h-54 items-center justify-center">
            <Drawer
              key={side}
              {...options}
              swipeDirection={direction}
              openAnimation={openAnimation as DrawerOpenAnimation}
            >
              <DrawerTrigger
                className="h-auto px-5 py-2.5 text-lg"
                render={<Button variant="outline" />}
              >
                Choose a roast
              </DrawerTrigger>
              <DrawerContent>
                <div className="flex w-full flex-1 flex-col">
                  <DrawerHeader>
                    <DrawerTitle>Next box</DrawerTitle>
                    <DrawerDescription>Pick the roast for Friday&apos;s delivery.</DrawerDescription>
                  </DrawerHeader>
                  <div className="flex flex-col gap-3 px-6 py-2 max-sm:px-4">
                    {roasts.map((roast) => (
                      <DrawerClose
                        key={roast.name}
                        render={
                          // Hover leaves the background alone; the text rolls, like the trigger.
                          <Button
                            variant="outline"
                            data-drawer-item
                            className="group/roll h-auto justify-between gap-3 py-3 whitespace-normal transition-[color,background-color,border-color] duration-300 hover:border-(--hx-primary) hover:bg-(--hx-primary) hover:text-(--hx-primary-foreground) in-data-[theme=dark]:hover:bg-(--hx-primary) motion-reduce:transition-none max-sm:flex-col max-sm:items-start max-sm:gap-0.5"
                          />
                        }
                      >
                        <span className="font-medium">
                          <RollText>{roast.name}</RollText>
                        </span>
                        <span className="text-(--hx-muted-foreground) transition-colors duration-300 group-hover/roll:text-(--hx-primary-foreground)/80 motion-reduce:transition-none">
                          <RollText>{roast.notes}</RollText>
                        </span>
                      </DrawerClose>
                    ))}
                  </div>
                  <DrawerFooter>
                    <DrawerClose
                      render={
                        <Button
                          variant="ghost"
                          data-drawer-item
                          className="group/line transition-[color,background-color] hover:bg-transparent in-data-[theme=dark]:hover:bg-transparent"
                        />
                      }
                    >
                      {/* An underline draws in from the left on hover and leaves to the right. */}
                      <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out group-hover/line:after:origin-left group-hover/line:after:scale-x-100 group-focus-visible/line:after:origin-left group-focus-visible/line:after:scale-x-100 motion-reduce:after:transition-none">
                        Close
                      </span>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <p className="text-center text-sm text-(--hx-muted-foreground)">
            Tip: drag the drawer back towards its edge to close it.
          </p>
        </DrawerIndent>
      </div>

    </DrawerProvider>
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

export interface AnimatedDrawerProps extends Partial<ControlValues> {
  theme?: AnimatedDrawerTheme;
  mode?: AnimatedDrawerMode;
  className?: string;
}

export default function AnimatedDrawer({ theme = "spotify", mode = "dark", className, ...props }: AnimatedDrawerProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <ReducedMotionConfig>
          <DrawerDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  Drawer,
  DrawerProvider,
  DrawerIndent,
  DrawerIndentBackground,
  DrawerPortal,
  DrawerOverlay,
  DrawerSwipeHandle,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  type DrawerOpenAnimation,
};
