// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { AnimatePresence, MotionConfig, motion, type Transition, type Variants } from "motion/react";
import { twMerge } from "tailwind-merge";

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

export type AnimatedTabsBarTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedTabsBarMode = "light" | "dark";

const THEMES: Record<`${AnimatedTabsBarTheme}:${AnimatedTabsBarMode}`, Record<string, string>> = {
  "default:light": {
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "foreground": "oklch(0.145 0 0)",
    "muted": "oklch(0.92 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    "primary": "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    "ring": "oklch(0.708 0 0)"
  },
  "default:dark": {
    "background": "oklch(0.145 0 0)",
    "border": "oklch(1 0 0 / 10%)",
    "foreground": "oklch(0.985 0 0)",
    "muted": "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    "primary": "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    "ring": "oklch(0.556 0 0)"
  },
  "caffeine:light": {
    "background": "#f9f9f9",
    "border": "#d8d8d8",
    "foreground": "#202020",
    "muted": "#efefef",
    "muted-foreground": "#646464",
    "primary": "#644a40",
    "primary-foreground": "#ffffff",
    "ring": "#644a40"
  },
  "caffeine:dark": {
    "background": "#111111",
    "border": "#201e18",
    "foreground": "#eeeeee",
    "muted": "#222222",
    "muted-foreground": "#b4b4b4",
    "primary": "#ffe0c2",
    "primary-foreground": "#081a1b",
    "ring": "#ffe0c2"
  },
  "claude:light": {
    "background": "#faf9f5",
    "border": "#dad9d4",
    "foreground": "#3d3929",
    "muted": "#ede9de",
    "muted-foreground": "#83827d",
    "primary": "#c96442",
    "primary-foreground": "#ffffff",
    "ring": "#c96442"
  },
  "claude:dark": {
    "background": "#262624",
    "border": "#3e3e38",
    "foreground": "#c3c0b6",
    "muted": "#1b1b19",
    "muted-foreground": "#b7b5a9",
    "primary": "#d97757",
    "primary-foreground": "#ffffff",
    "ring": "#d97757"
  },
  "ghibli:light": {
    "background": "#f3ecd9",
    "border": "#d5cba8",
    "foreground": "#4a4436",
    "muted": "#e6dec4",
    "muted-foreground": "#7a705a",
    "primary": "#6f9a5b",
    "primary-foreground": "#ffffff",
    "ring": "#6f9a5b"
  },
  "ghibli:dark": {
    "background": "#1f2a26",
    "border": "#3b4c45",
    "foreground": "#e6e0cc",
    "muted": "#2c3a34",
    "muted-foreground": "#a8b39f",
    "primary": "#8fbf7a",
    "primary-foreground": "#15201a",
    "ring": "#8fbf7a"
  },
  "spotify:light": {
    "background": "#ffffff",
    "border": "#e0e0e0",
    "foreground": "#191414",
    "muted": "#ececec",
    "muted-foreground": "#6a6a6a",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1db954"
  },
  "spotify:dark": {
    "background": "#121212",
    "border": "#2a2a2a",
    "foreground": "#ffffff",
    "muted": "#1f1f1f",
    "muted-foreground": "#b3b3b3",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1ed760"
  },
  "valorant:light": {
    "background": "#ece8e1",
    "border": "#cfc9bc",
    "foreground": "#0f1923",
    "muted": "#e2ddd2",
    "muted-foreground": "#5c6670",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655"
  },
  "valorant:dark": {
    "background": "#0f1923",
    "border": "#2b3a48",
    "foreground": "#ece8e1",
    "muted": "#1a2733",
    "muted-foreground": "#8b978f",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655"
  },
  "vscode:light": {
    "background": "#ffffff",
    "border": "#e5e5e5",
    "foreground": "#3b3b3b",
    "muted": "#f3f3f3",
    "muted-foreground": "#717171",
    "primary": "#007acc",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4"
  },
  "vscode:dark": {
    "background": "#1f1f1f",
    "border": "#3c3c3c",
    "foreground": "#cccccc",
    "muted": "#2a2d2e",
    "muted-foreground": "#9d9d9d",
    "primary": "#0e639c",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedTabsBarTheme = "default", mode: AnimatedTabsBarMode = "light") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  // Any theme but Default tints key parts with its primary colour
  return { "data-theme": mode, "data-accent": theme === "default" ? undefined : "", style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

// ---- tabs.tsx ----

/** glide: a pill slides to the active tab. underline: its background and a bar slide there. fade: they fade in place. */
type TabsIndicator = "glide" | "underline" | "fade"
/** slide: content leaves one way and arrives from the other. fade: it fades out, then the next fades in. */
type TabsContentMotion = "slide" | "fade" | "none"
type TabsActiveColor = "primary" | "muted"
type TabsRounded = "none" | "sm" | "md" | "lg" | "xl" | "full"

type TabsMotion = {
  activeIndicator: TabsIndicator
  contentAnimation: TabsContentMotion
  /** Background of the active tab. */
  activeColor: TabsActiveColor
  /** How far the content slides, in px. */
  slideDistance: number
  /** Seconds. How long the indicator and a sliding panel take. */
  duration: number
  bounce: number
  /** Seconds each way, for the fade out and the fade in of the "fade" content. */
  fadeDuration: number
  /** The panel grows and shrinks to fit the content instead of jumping. */
  smoothHeight: boolean
  /** A soft highlight follows the pointer over the tabs. */
  hoverHighlight: boolean
  /** A line under the row of tabs, between the tabs and the content. */
  divider: boolean
  /** A box border around the row of tabs. */
  listBorder: boolean
  /** Border around the content panel. */
  panelBorder: boolean
  rounded: TabsRounded
}

const ROUNDED: Record<TabsRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
}

const ACTIVE_BG: Record<TabsActiveColor, string> = {
  primary: "bg-(--hx-primary)",
  muted: "bg-(--hx-muted) ring-1 ring-(--hx-foreground)/10",
}

const ACTIVE_TEXT: Record<TabsActiveColor, string> = {
  primary: "text-(--hx-primary-foreground)",
  muted: "text-(--hx-foreground)",
}

// Slow at both ends, so the fade never looks like it starts or stops abruptly
const fadeEase = [0.45, 0, 0.25, 1] as const

type TabsContextValue = TabsMotion & {
  id: string
  value: string
  /** 1 when the new tab is further right, -1 when it is further left. */
  direction: number
  hovered: string | null
  setHovered: (value: string | null) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("Tabs parts must be used inside <Tabs>.")
  return context
}

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

function ReducedMotionConfig({ children }: { children: React.ReactNode }) {
  const reduce = usePrefersReducedMotion()
  return <MotionConfig reducedMotion={reduce ? "always" : "never"}>{children}</MotionConfig>
}

// With reduced motion on, every move lands instantly. Otherwise the transition is unchanged.
function useMotionOk(transition: Transition): Transition {
  return usePrefersReducedMotion() ? { duration: 0 } : transition
}

function Tabs({
  activeIndicator = "glide",
  contentAnimation = "slide",
  activeColor = "primary",
  slideDistance = 40,
  duration = 0.35,
  bounce = 0.15,
  fadeDuration = 0.35,
  smoothHeight = true,
  hoverHighlight = false,
  divider = true,
  listBorder = true,
  panelBorder = false,
  rounded = "lg",
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  ...props
}: Omit<TabsPrimitive.Root.Props, "render"> & Partial<TabsMotion>) {
  const id = React.useId()
  const root = React.useRef<HTMLDivElement>(null)
  const [own, setOwn] = React.useState(String(defaultValue ?? ""))
  const value = valueProp === undefined ? own : String(valueProp)
  const [direction, setDirection] = React.useState(1)
  const [hovered, setHovered] = React.useState<string | null>(null)

  const context = React.useMemo(
    () => ({
      id,
      value,
      direction,
      hovered,
      setHovered,
      activeIndicator,
      contentAnimation,
      activeColor,
      slideDistance,
      duration,
      bounce,
      fadeDuration,
      smoothHeight,
      hoverHighlight,
      divider,
      listBorder,
      panelBorder,
      rounded,
    }),
    [
      id,
      value,
      direction,
      hovered,
      activeIndicator,
      contentAnimation,
      activeColor,
      slideDistance,
      duration,
      bounce,
      fadeDuration,
      smoothHeight,
      hoverHighlight,
      divider,
      listBorder,
      panelBorder,
      rounded,
    ]
  )

  return (
    <TabsContext.Provider value={context}>
      <ReducedMotionConfig>
        <TabsPrimitive.Root
          ref={root}
          data-slot="tabs"
          value={value}
          onValueChange={(next, details) => {
            // Which way the content should travel, from where the two tabs sit in the row
            const values = [...(root.current?.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]') ?? [])].map(
              (el) => el.dataset.value
            )
            setDirection(values.indexOf(String(next)) >= values.indexOf(value) ? 1 : -1)
            setOwn(String(next))
            onValueChange?.(next, details)
          }}
          className={cn("flex flex-col gap-4", className)}
          {...props}
        />
      </ReducedMotionConfig>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }: Omit<TabsPrimitive.List.Props, "render">) {
  const { activeIndicator, rounded, listBorder, divider } = useTabs()
  const pill = activeIndicator === "glide"

  return (
    // The line sits right under the tabs; the pill row gets a little air above it
    <div data-slot="tabs-header" className={cn("flex min-w-0 flex-col", pill && "gap-3")}>
      {/* On a narrow screen the row scrolls sideways, with no scrollbar, and is clipped at its border */}
      <div
        data-slot="tabs-scroll"
        className={cn(
          "max-w-full overflow-x-auto overscroll-x-contain scrollbar-none [&::-webkit-scrollbar]:hidden",
          pill && "w-fit",
          (pill || listBorder) && ROUNDED[rounded],
          listBorder && "border"
        )}
      >
        <TabsPrimitive.List
          data-slot="tabs-list"
          // Arrow keys move to the next tab and show its content straight away
          activateOnFocus
          className={cn(
            "relative flex w-max items-center",
            pill ? "gap-1 p-1" : "min-w-full gap-2",
            listBorder && !pill && "p-1",
            className
          )}
          {...props}
        />
      </div>
      {divider && <div aria-hidden data-slot="tabs-divider" className="h-px w-full bg-(--hx-border)" />}
    </div>
  )
}

function TabsTrigger({
  value,
  className,
  children,
  ...props
}: Omit<TabsPrimitive.Tab.Props, "render">) {
  const c = useTabs()
  const active = c.value === value
  const move = useMotionOk({ type: "spring", duration: c.duration * 0.6, bounce: c.bounce })
  const quick = useMotionOk({ duration: 0.25, ease: fadeEase })
  const bg = cn("absolute inset-0 z-0", ACTIVE_BG[c.activeColor], ROUNDED[c.rounded])
  // Inside the tab (not hanging below it), so the scrolling row never clips or scrolls vertically
  const bar = "absolute inset-x-3 bottom-0 z-0 h-0.5 rounded-full bg-(--hx-primary)"

  // When the row scrolls, bring the tab you switched to into view
  const tabRef = React.useRef<HTMLButtonElement>(null)
  const reduceMotion = usePrefersReducedMotion()
  const seen = React.useRef(false)
  React.useEffect(() => {
    if (!seen.current) {
      seen.current = true
      return
    }
    const el = tabRef.current
    const scroller = el?.closest<HTMLElement>('[data-slot="tabs-scroll"]')
    if (!active || !el || !scroller) return
    const left = el.offsetLeft
    const right = left + el.offsetWidth
    if (left >= scroller.scrollLeft && right <= scroller.scrollLeft + scroller.clientWidth) return
    scroller.scrollTo({
      left: left - (scroller.clientWidth - el.offsetWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }, [active, reduceMotion])

  return (
    <TabsPrimitive.Tab
      ref={tabRef}
      value={value}
      id={`${c.id}-tab-${value}`}
      data-slot="tabs-trigger"
      data-value={value}
      onPointerEnter={() => c.setHovered(value)}
      onPointerLeave={() => c.setHovered(null)}
      className={cn(
        "relative flex shrink-0 cursor-pointer items-center justify-center px-4 py-2 text-lg font-medium whitespace-nowrap outline-none max-md:px-3",
        "transition-colors duration-200 motion-reduce:transition-none",
        // Inside the tab, so the scrolling row doesn't clip the focus ring
        "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--hx-ring)",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        ROUNDED[c.rounded],
        // Only the glide pill has a fill behind the text; the underline modes are just the bar
        active
          ? c.activeIndicator === "glide"
            ? ACTIVE_TEXT[c.activeColor]
            : "text-(--hx-foreground) in-data-accent:text-(--hx-primary)"
          : "text-(--hx-muted-foreground) hover:text-(--hx-foreground)",
        className
      )}
      {...props}
    >
      <AnimatePresence initial={false}>
        {c.hoverHighlight && c.hovered === value && !active && (
          <motion.span
            key="hover"
            aria-hidden
            layoutId={`${c.id}-hover`}
            className={cn("absolute inset-0 z-0 bg-(--hx-foreground)/8", ROUNDED[c.rounded])}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={move}
          />
        )}
      </AnimatePresence>

      {c.activeIndicator === "glide" && active && (
        <motion.span aria-hidden layoutId={`${c.id}-pill`} className={bg} transition={move} />
      )}

      {c.activeIndicator === "underline" && active && (
        <motion.span aria-hidden layoutId={`${c.id}-line`} className={bar} transition={move} />
      )}

      {c.activeIndicator === "fade" && (
        <motion.span
          aria-hidden
          className={bar}
          initial={false}
          animate={{ opacity: active ? 1 : 0 }}
          transition={quick}
        />
      )}
      <span className="relative z-10">{children}</span>
    </TabsPrimitive.Tab>
  )
}

// Measures the content so the panel can grow and shrink to fit it
function useHeight() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState<number | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setHeight(entry.borderBoxSize[0].blockSize))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, height] as const
}

/** Holds the panels and plays the content motion as tabs change. Put the `TabsContent`s inside it. */
function TabsPanels({ className, children }: { className?: string; children: React.ReactNode }) {
  const c = useTabs()
  const [measure, height] = useHeight()
  const grow = useMotionOk({ type: "spring", duration: 0.4, bounce: 0 })

  const active = React.Children.toArray(children).find(
    (child) => React.isValidElement<{ value: string }>(child) && child.props.value === c.value
  )

  return (
    <div
      data-slot="tabs-panels"
      className={cn("overflow-hidden", c.panelBorder && "border", ROUNDED[c.rounded], className)}
    >
      <motion.div
        initial={false}
        animate={{ height: c.smoothHeight && height !== null ? height : "auto" }}
        transition={grow}
      >
        <div ref={measure}>
          <AnimatePresence mode="wait" initial={false} custom={c.direction}>
            {active}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

function TabsContent({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const c = useTabs()
  const reduceMotion = usePrefersReducedMotion()
  const slide = c.contentAnimation === "slide" && !reduceMotion
  const still = c.contentAnimation === "none" || reduceMotion
  const fade = c.fadeDuration

  const variants: Variants = {
    enter: (d: number) => ({ opacity: still ? 1 : 0, x: slide ? d * c.slideDistance : 0 }),
    center: {
      opacity: 1,
      x: 0,
      transition: still
        ? { duration: 0 }
        : c.contentAnimation === "slide"
          ? { type: "spring", duration: c.duration, bounce: c.bounce }
          : { duration: fade, ease: fadeEase },
    },
    exit: (d: number) => ({
      opacity: still ? 1 : 0,
      x: slide ? -d * c.slideDistance : 0,
      // Sliding out is quick so the switch never feels slow; a fade uses its own duration each way
      transition: still
        ? { duration: 0 }
        : c.contentAnimation === "slide"
          ? { duration: c.duration * 0.5, ease: "easeIn" }
          : { duration: fade, ease: fadeEase },
    }),
  }

  return (
    <motion.div
      key={value}
      role="tabpanel"
      id={`${c.id}-panel-${value}`}
      aria-labelledby={`${c.id}-tab-${value}`}
      tabIndex={0}
      data-slot="tabs-content"
      custom={c.direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className={cn(
        "flex flex-col gap-2 p-6 text-lg outline-none max-md:p-4 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--hx-ring)",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

// ---- demo: tabs-demo.tsx ----

const tabs = [
  {
    value: "overview",
    label: "Overview",
    title: "This week",
    body: "Revenue is up 12% on last week, mostly from returning customers.",
  },
  {
    value: "analytics",
    label: "Analytics",
    title: "Traffic",
    body: "Most visitors arrive from search. Mobile now makes up 64% of sessions, and the longest visits start from a shared link.",
    extra: ["Search 48%", "Direct 27%", "Shared links 15%", "Other 10%"],
  },
  {
    value: "reports",
    label: "Reports",
    title: "Scheduled",
    body: "The monthly summary goes out on the 1st. Two reports are waiting for review.",
  },
  {
    value: "settings",
    label: "Settings",
    title: "Workspace",
    body: "Change who can see reports, and how often summaries are emailed to the team.",
  },
]

const controls = {
  activeIndicator: {
    group: "Tabs",
    type: "select",
    label: "Active indicator",
    value: "glide",
    options: [
      { label: "Glide pill", value: "glide" },
      { label: "Slide underline", value: "underline" },
      { label: "Fade underline", value: "fade" },
    ],
  },
  activeColor: {
    disabled: (v: Record<string, unknown>) => v.activeIndicator !== "glide",
    group: "Tabs",
    type: "select",
    label: "Active tab colour",
    value: "primary",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Muted", value: "muted" },
    ],
  },
  hoverHighlight: { group: "Tabs", type: "checkbox", label: "Hover highlight", value: true },
  divider: { group: "Tabs", type: "checkbox", label: "Line under tabs", value: true },
  listBorder: { group: "Tabs", type: "checkbox", label: "Border on tabs", value: true },
  panelBorder: { group: "Content", type: "checkbox", label: "Border on content", value: false },
  rounded: {
    group: "Tabs",
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

  contentAnimation: {
    group: "Content",
    type: "select",
    label: "Content animation",
    value: "slide",
    options: [
      { label: "Slide", value: "slide" },
      { label: "Fade in / out", value: "fade" },
      { label: "None", value: "none" },
    ],
  },
  slideDistance: {
    disabled: (v: Record<string, unknown>) => v.contentAnimation !== "slide",
    group: "Content",
    type: "slider",
    label: "Slide distance",
    value: 40,
    min: 0,
    max: 120,
    step: 4,
    unit: "px",
  },
  smoothHeight: { group: "Content", type: "checkbox", label: "Smooth panel height", value: false },

  fadeDuration: {
    disabled: (v: Record<string, unknown>) => v.contentAnimation !== "fade",
    group: "Content",
    type: "slider",
    label: "Fade duration",
    value: 0.35,
    min: 0.1,
    max: 1.2,
    step: 0.05,
    unit: "s",
  },
  duration: {
    group: "Motion",
    type: "slider",
    label: "Duration",
    value: 0.3,
    min: 0.1,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  bounce: {
    disabled: (v: Record<string, unknown>) => v.activeIndicator === "fade" && v.contentAnimation !== "slide",
    group: "Motion",
    type: "slider",
    label: "Bounce",
    value: 0.15,
    min: 0,
    max: 0.6,
    step: 0.05,
  },
}

function TabsDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel

  return (
    <div className="flex flex-col gap-3">
      {/* Top-aligned, so the tabs stay put and only the content below moves as its height changes */}
      <div className="flex min-h-120 max-md:min-h-96 flex-col justify-start px-12 py-8 max-lg:px-8 max-md:px-0">
        <Tabs
          defaultValue="overview"
          activeIndicator={values.activeIndicator as TabsIndicator}
          contentAnimation={values.contentAnimation as TabsContentMotion}
          slideDistance={values.slideDistance}
          duration={values.duration}
          fadeDuration={values.fadeDuration}
          bounce={values.bounce}
          activeColor={values.activeColor as TabsActiveColor}
          smoothHeight={values.smoothHeight}
          hoverHighlight={values.hoverHighlight}
          divider={values.divider}
          listBorder={values.listBorder}
          panelBorder={values.panelBorder}
          rounded={values.rounded as TabsRounded}
        >
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsPanels>
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <h3 className="font-semibold">{tab.title}</h3>
                <p className="text-(--hx-muted-foreground)">{tab.body}</p>
                {tab.extra && (
                  <ul className="grid grid-cols-2 gap-2 pt-2">
                    {tab.extra.map((item) => (
                      <li key={item} className="rounded-md bg-(--hx-muted) px-3 py-2 text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            ))}
          </TabsPanels>
        </Tabs>
      </div>
      <p className="text-center text-sm text-(--hx-muted-foreground) max-lg:hidden">
        Tip: click tabs left and right to see the content travel the way you moved. Arrow keys switch tabs too.
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

export interface AnimatedTabsBarProps extends Partial<ControlValues> {
  theme?: AnimatedTabsBarTheme;
  mode?: AnimatedTabsBarMode;
  className?: string;
}

export default function AnimatedTabsBar({ theme = "ghibli", mode = "light", className, ...props }: AnimatedTabsBarProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <ReducedMotionConfig>
          <TabsDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsPanels,
  TabsContent,
  type TabsIndicator,
  type TabsContentMotion,
  type TabsActiveColor,
  type TabsRounded,
};
