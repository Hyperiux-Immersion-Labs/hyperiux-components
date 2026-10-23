// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { MotionConfig, animate, stagger, AnimatePresence, motion } from "motion/react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { RotateCcwIcon } from "lucide-react";
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

export type AnimatedSkeletonTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedSkeletonMode = "light" | "dark";

const THEMES: Record<`${AnimatedSkeletonTheme}:${AnimatedSkeletonMode}`, Record<string, string>> = {
  "default:light": {
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "destructive": "oklch(0.577 0.245 27.325)",
    "foreground": "oklch(0.145 0 0)",
    "input": "oklch(0.922 0 0)",
    "muted": "oklch(0.92 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    "primary": "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    "ring": "oklch(0.708 0 0)",
    "secondary": "oklch(0.97 0 0)",
    "secondary-foreground": "oklch(0.205 0 0)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "default:dark": {
    "background": "oklch(0.145 0 0)",
    "border": "oklch(1 0 0 / 10%)",
    "destructive": "oklch(0.704 0.191 22.216)",
    "foreground": "oklch(0.985 0 0)",
    "input": "oklch(1 0 0 / 15%)",
    "muted": "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    "primary": "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    "ring": "oklch(0.556 0 0)",
    "secondary": "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "caffeine:light": {
    "background": "#f9f9f9",
    "border": "#d8d8d8",
    "destructive": "#e54d2e",
    "foreground": "#202020",
    "input": "#d8d8d8",
    "muted": "#efefef",
    "muted-foreground": "#646464",
    "primary": "#644a40",
    "primary-foreground": "#ffffff",
    "ring": "#644a40",
    "secondary": "#ffdfb5",
    "secondary-foreground": "#582d1d",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "caffeine:dark": {
    "background": "#111111",
    "border": "#201e18",
    "destructive": "#e54d2e",
    "foreground": "#eeeeee",
    "input": "#484848",
    "muted": "#222222",
    "muted-foreground": "#b4b4b4",
    "primary": "#ffe0c2",
    "primary-foreground": "#081a1b",
    "ring": "#ffe0c2",
    "secondary": "#393028",
    "secondary-foreground": "#ffe0c2",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "claude:light": {
    "background": "#faf9f5",
    "border": "#dad9d4",
    "destructive": "#c0392b",
    "foreground": "#3d3929",
    "input": "#b4b2a7",
    "muted": "#ede9de",
    "muted-foreground": "#83827d",
    "primary": "#c96442",
    "primary-foreground": "#ffffff",
    "ring": "#c96442",
    "secondary": "#e9e6dc",
    "secondary-foreground": "#535146",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "claude:dark": {
    "background": "#262624",
    "border": "#3e3e38",
    "destructive": "#ef4444",
    "foreground": "#c3c0b6",
    "input": "#52514a",
    "muted": "#1b1b19",
    "muted-foreground": "#b7b5a9",
    "primary": "#d97757",
    "primary-foreground": "#ffffff",
    "ring": "#d97757",
    "secondary": "#faf9f5",
    "secondary-foreground": "#30302e",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "ghibli:light": {
    "background": "#f3ecd9",
    "border": "#d5cba8",
    "destructive": "#c0533a",
    "foreground": "#4a4436",
    "input": "#cfc59f",
    "muted": "#e6dec4",
    "muted-foreground": "#7a705a",
    "primary": "#6f9a5b",
    "primary-foreground": "#ffffff",
    "ring": "#6f9a5b",
    "secondary": "#dcd3b6",
    "secondary-foreground": "#4a4436",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "ghibli:dark": {
    "background": "#1f2a26",
    "border": "#3b4c45",
    "destructive": "#e0745a",
    "foreground": "#e6e0cc",
    "input": "#46584f",
    "muted": "#2c3a34",
    "muted-foreground": "#a8b39f",
    "primary": "#8fbf7a",
    "primary-foreground": "#15201a",
    "ring": "#8fbf7a",
    "secondary": "#34443d",
    "secondary-foreground": "#e6e0cc",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "spotify:light": {
    "background": "#ffffff",
    "border": "#e0e0e0",
    "destructive": "#e22134",
    "foreground": "#191414",
    "input": "#d4d4d4",
    "muted": "#ececec",
    "muted-foreground": "#6a6a6a",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1db954",
    "secondary": "#f0f0f0",
    "secondary-foreground": "#191414",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "spotify:dark": {
    "background": "#121212",
    "border": "#2a2a2a",
    "destructive": "#f3727f",
    "foreground": "#ffffff",
    "input": "#3a3a3a",
    "muted": "#1f1f1f",
    "muted-foreground": "#b3b3b3",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1ed760",
    "secondary": "#242424",
    "secondary-foreground": "#ffffff",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "valorant:light": {
    "background": "#ece8e1",
    "border": "#cfc9bc",
    "destructive": "#bd3944",
    "foreground": "#0f1923",
    "input": "#c4beb0",
    "muted": "#e2ddd2",
    "muted-foreground": "#5c6670",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "secondary": "#dcd7cc",
    "secondary-foreground": "#0f1923",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "valorant:dark": {
    "background": "#0f1923",
    "border": "#2b3a48",
    "destructive": "#ff6b76",
    "foreground": "#ece8e1",
    "input": "#344454",
    "muted": "#1a2733",
    "muted-foreground": "#8b978f",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "secondary": "#1f2b37",
    "secondary-foreground": "#ece8e1",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "vscode:light": {
    "background": "#ffffff",
    "border": "#e5e5e5",
    "destructive": "#e51400",
    "foreground": "#3b3b3b",
    "input": "#cecece",
    "muted": "#f3f3f3",
    "muted-foreground": "#717171",
    "primary": "#007acc",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "secondary": "#e5e5e5",
    "secondary-foreground": "#3b3b3b",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "vscode:dark": {
    "background": "#1f1f1f",
    "border": "#3c3c3c",
    "destructive": "#f14c4c",
    "foreground": "#cccccc",
    "input": "#3c3c3c",
    "muted": "#2a2d2e",
    "muted-foreground": "#9d9d9d",
    "primary": "#0e639c",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "secondary": "#3a3d41",
    "secondary-foreground": "#ffffff",
    "warning": "oklch(0.769 0.188 70.08)"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedSkeletonTheme = "default", mode: AnimatedSkeletonMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  // Any theme but Default tints key parts with its primary colour
  return { "data-theme": mode, "data-accent": theme === "default" ? undefined : "", style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

// Keyframes and classes the component needs; no global CSS required
const COMPONENT_CSS = "@keyframes hx-skeleton-sweep{from{background-position:0 0}to{background-position:60vw 0}}\n@keyframes hx-skeleton-sweep-wide{from{background-position:0 0}to{background-position:100vw 0}}\n.hx-skeleton-sweep{--skeleton-highlight:color-mix(in oklch,var(--hx-background) 85%,transparent);background-image:linear-gradient(100deg,transparent 25%,var(--skeleton-highlight) 50%,transparent 75%);background-size:60vw 100%;background-repeat:repeat-x;background-attachment:fixed;animation:hx-skeleton-sweep var(--skeleton-duration,1.6s) linear var(--skeleton-delay,0s) infinite}\n[data-theme=dark] .hx-skeleton-sweep{--skeleton-highlight:color-mix(in oklch,var(--hx-foreground) 9%,transparent)}\n.hx-skeleton-sweep[data-animation=wave]{background-image:linear-gradient(100deg,transparent 10%,var(--skeleton-highlight) 50%,transparent 90%);background-size:100vw 100%;animation-name:hx-skeleton-sweep-wide}\n@media (prefers-reduced-motion:reduce){.hx-skeleton-sweep{animation:none;background-image:none}}";

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

// ---- button.tsx ----

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--hx-ring) focus-visible:ring-3 focus-visible:ring-(--hx-ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--hx-destructive) aria-invalid:ring-3 aria-invalid:ring-(--hx-destructive)/20 in-data-[theme=dark]:aria-invalid:border-(--hx-destructive)/50 in-data-[theme=dark]:aria-invalid:ring-(--hx-destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
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

// ---- skeleton.tsx ----

const smoothEase = [0.22, 1, 0.36, 1] as const

type SkeletonAnimation = "shimmer" | "pulse" | "wave" | "none"
type SkeletonRounded = "none" | "sm" | "md" | "lg" | "xl" | "full"
type SkeletonSwap = "fade" | "rise" | "scale" | "none"

type SkeletonMotion = {
  animation: SkeletonAnimation
  duration: number
  stagger: number
  rounded: SkeletonRounded
}

const ROUNDED: Record<SkeletonRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
}

const SkeletonContext = React.createContext<SkeletonMotion | null>(null)

function SkeletonGroup({
  animation = "shimmer",
  duration = 1.6,
  stagger = 0.12,
  rounded = "md",
  children,
}: Partial<SkeletonMotion> & { children: React.ReactNode }) {
  const value = React.useMemo(
    () => ({ animation, duration, stagger, rounded }),
    [animation, duration, stagger, rounded]
  )
  return <SkeletonContext.Provider value={value}>{children}</SkeletonContext.Provider>
}

const SkeletonIndexContext = React.createContext(0)

function Skeleton({
  className,
  animation,
  duration,
  rounded,
  index,
  style,
  ...props
}: React.ComponentProps<"div"> &
  Partial<Pick<SkeletonMotion, "animation" | "duration" | "rounded">> & {
    index?: number
  }) {
  const group = React.useContext(SkeletonContext)
  const fallbackIndex = React.useContext(SkeletonIndexContext)
  const reduced = usePrefersReducedMotion()

  const kind = animation ?? group?.animation ?? "shimmer"
  const seconds = duration ?? group?.duration ?? 1.6
  const radius = rounded ?? group?.rounded ?? "md"
  // Negative delay: offset, but moving immediately
  const lag = ((index ?? fallbackIndex) * (group?.stagger ?? 0)) % seconds
  const delay = lag === 0 ? 0 : lag - seconds

  const active = !reduced && kind !== "none"

  return (
    <div
      data-slot="skeleton"
      data-animation={kind}
      className={cn(
        "relative overflow-hidden bg-(--hx-muted)",
        ROUNDED[radius],
        active && kind === "pulse" && "animate-pulse",
        // Shared viewport band; see globals.css
        active && (kind === "shimmer" || kind === "wave") && "hx-skeleton-sweep",
        // CSS catches reduced motion during hydration
        "motion-reduce:animate-none",
        className
      )}
      style={{
        ...style,
        ...(active
          ? ({
              "--skeleton-duration": `${seconds}s`,
              "--skeleton-delay": `${delay}s`,
              animationDuration: kind === "pulse" ? `${seconds}s` : undefined,
              animationDelay: kind === "pulse" ? `${delay}s` : undefined,
            } as React.CSSProperties)
          : null),
      }}
      {...props}
    />
  )
}

function SkeletonSwap({
  loading,
  swapAnimation = "scale",
  duration = 0.4,
  stagger = 0.06,
  skeleton,
  children,
  className,
}: {
  loading: boolean
  swapAnimation?: SkeletonSwap
  duration?: number
  stagger?: number
  skeleton: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const reduced = usePrefersReducedMotion()

  const enter = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || reduced || swapAnimation === "none" || stagger <= 0) return
      // Wrapper divs with one child would stagger as a single item
      let row: Element = node
      while (row.children.length === 1) row = row.children[0]
      row.setAttribute("data-skeleton-row", "")
      const stop = staggerIn(node, "[data-skeleton-row] > *", {
        gap: stagger,
        delay: 0,
        distance: swapAnimation === "rise" ? 8 : 0,
      })?.stop
      return () => {
        row.removeAttribute("data-skeleton-row")
        stop?.()
      }
    },
    [reduced, swapAnimation, stagger]
  )

  const kind = reduced && swapAnimation !== "none" ? "fade" : swapAnimation
  const initial = {
    fade: { opacity: 0 },
    rise: { opacity: 0, y: 8 },
    scale: { opacity: 0, scale: 0.97 },
    none: {},
  }[kind]
  const length = reduced ? Math.min(duration, 0.2) : duration

  // The placeholders and the real content differ in height (more so on narrow screens, where
  // text wraps), so the box eases to the new height instead of jumping when they swap.
  const box = React.useRef<HTMLDivElement>(null)
  const lastHeight = React.useRef(0)
  React.useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const next = el.offsetHeight
    const prev = lastHeight.current
    lastHeight.current = next
    if (!prev || prev === next || reduced) return
    el.style.transition = "none"
    el.style.height = `${prev}px`
    el.style.overflow = "hidden"
    void el.offsetHeight
    el.style.transition = `height ${length}s cubic-bezier(0.22, 1, 0.36, 1)`
    el.style.height = `${next}px`
    const done = () => {
      el.style.transition = ""
      el.style.height = ""
      el.style.overflow = ""
      lastHeight.current = el.offsetHeight
    }
    el.addEventListener("transitionend", done, { once: true })
    return () => el.removeEventListener("transitionend", done)
  }, [loading, reduced, length])

  return (
    <div ref={box} className={cn("relative", className)}>
      {/* Crossfade: placeholders fade over content */}
      <AnimatePresence mode="popLayout" initial={false}>
        {loading ? (
          <motion.div
            key="skeleton"
            aria-hidden
            className="z-10"
            exit={kind === "none" ? undefined : { opacity: 0 }}
            transition={{ duration: length, ease: "easeInOut" }}
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            ref={enter}
            initial={initial}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: length, ease: smoothEase }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SkeletonText({
  lines = 3,
  start = 0,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  lines?: number
  start?: number
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonIndexContext.Provider key={i} value={start + i}>
          <Skeleton className={cn("h-3.5", i === lines - 1 && "w-[60%]")} />
        </SkeletonIndexContext.Provider>
      ))}
    </div>
  )
}

// ---- demo: skeleton-demo.tsx ----

const controls = {
  animation: {
    group: "Skeleton appearance",
    type: "select",
    label: "Animation",
    value: "shimmer",
    options: [
      { label: "Shimmer", value: "shimmer" },
      { label: "Wave", value: "wave" },
      { label: "Pulse", value: "pulse" },
      { label: "None", value: "none" },
    ],
  },
  duration: {
    disabled: (v: Record<string, unknown>) => v.animation === "none",
    group: "Skeleton appearance",
    type: "slider",
    label: "Duration",
    value: 1.6,
    min: 0.6,
    max: 3,
    step: 0.1,
    unit: "s",
  },
  stagger: {
    disabled: (v: Record<string, unknown>) => v.animation === "none",
    group: "Skeleton appearance",
    type: "slider",
    label: "Stagger",
    value: 0.12,
    min: 0,
    max: 0.4,
    step: 0.02,
    unit: "s",
  },
  rounded: {
    group: "Skeleton appearance",
    type: "select",
    label: "Roundness",
    value: "md",
    options: [
      { label: "None", value: "none" },
      { label: "sm", value: "sm" },
      { label: "md", value: "md" },
      { label: "lg", value: "lg" },
      { label: "xl", value: "xl" },
      { label: "Full", value: "full" },
    ],
  },

  swapAnimation: {
    group: "Content transition",
    type: "select",
    label: "Swap animation",
    value: "scale",
    options: [
      { label: "Rise", value: "rise" },
      { label: "Scale", value: "scale" },
      { label: "Fade", value: "fade" },
      { label: "None", value: "none" },
    ],
  },
  swapDuration: {
    disabled: (v: Record<string, unknown>) => v.swapAnimation === "none",
    group: "Content transition",
    type: "slider",
    label: "Content entrance duration",
    value: 0.5,
    min: 0.1,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  swapStagger: {
    disabled: (v: Record<string, unknown>) => v.swapAnimation === "none",
    group: "Content transition",
    type: "slider",
    label: "Delay between content items",
    value: 0.06,
    min: 0,
    max: 0.2,
    step: 0.01,
    unit: "s",
  },
  loadTime: {
    group: "Loading preview",
    type: "slider",
    label: "Skeleton loading time",
    value: 3,
    min: 0.5,
    max: 5,
    step: 0.5,
    unit: "s",
  },
}

/** The status label, rolling up to its new text when it changes. */
function StatusRoll({ children }: { children: string }) {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <span className="relative inline-grid overflow-hidden text-sm text-(--hx-muted-foreground)">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={children}
          className="block"
          initial={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function SkeletonDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel
  const [loading, setLoading] = React.useState(true)
  const timer = React.useRef(0)

  // Loads once on arrival, at the control's default; the Replay button uses the current value.
  React.useEffect(() => {
    timer.current = window.setTimeout(
      () => setLoading(false),
      controls.loadTime.value * 1000
    )
    return () => window.clearTimeout(timer.current)
  }, [])

  const replay = () => {
    window.clearTimeout(timer.current)
    setLoading(true)
    timer.current = window.setTimeout(() => setLoading(false), values.loadTime * 1000)
  }

  const placeholder = (
    <SkeletonGroup
      animation={values.animation as SkeletonAnimation}
      duration={values.duration}
      stagger={values.stagger}
      rounded={values.rounded as SkeletonRounded}
    >
      <div className="flex flex-col gap-4">
        <Skeleton className="h-36 w-full" index={0} />
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" index={1} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-[40%]" index={2} />
            <Skeleton className="h-3 w-[25%]" index={3} />
          </div>
        </div>
        <SkeletonText lines={3} start={4} />
      </div>
    </SkeletonGroup>
  )

  const content = (
    <div className="flex flex-col gap-4">
      <div className={cn("h-36 w-full bg-linear-to-br from-(--hx-warning)/40 to-(--hx-destructive)/40", ROUNDED[values.rounded as SkeletonRounded])} />
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--hx-muted) text-sm font-medium">
          LK
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-sm font-medium">Little Kiln Roasters</span>
          <span className="text-xs text-(--hx-muted-foreground)">Posted 2 hours ago</span>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-(--hx-muted-foreground)">
        This week we&apos;re pouring an Ethiopia Guji — jasmine, peach and black tea, washed and
        roasted light. It&apos;s bright without ever turning sharp, which makes it a forgiving
        first pour-over. Bags are roasted on Tuesdays and ship the same afternoon.
      </p>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-96 flex-col gap-4 rounded-lg border px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <StatusRoll>{loading ? "Loading…" : "Loaded"}</StatusRoll>
          <Button variant="outline" size="sm" onClick={replay} disabled={loading}>
            <RotateCcwIcon />
            Replay
          </Button>
        </div>

        <SkeletonSwap
          loading={loading}
          swapAnimation={values.swapAnimation as SkeletonSwap}
          duration={values.swapDuration}
          stagger={values.swapStagger}
          skeleton={placeholder}
        >
          {content}
        </SkeletonSwap>
      </div>
      <p className="text-center text-sm text-(--hx-muted-foreground)">
        Tip: the placeholders leave before the content arrives, so the card never shows both.
      </p>

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

export interface AnimatedSkeletonProps extends Partial<ControlValues> {
  theme?: AnimatedSkeletonTheme;
  mode?: AnimatedSkeletonMode;
  className?: string;
}

export default function AnimatedSkeleton({ theme = "spotify", mode = "dark", className, ...props }: AnimatedSkeletonProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <style>{COMPONENT_CSS}</style>
        <ReducedMotionConfig>
          <SkeletonDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  ROUNDED as SKELETON_ROUNDED,
  Skeleton,
  SkeletonGroup,
  SkeletonSwap,
  SkeletonText,
  type SkeletonAnimation,
  type SkeletonRounded,
  type SkeletonSwap as SkeletonSwapKind,
};
