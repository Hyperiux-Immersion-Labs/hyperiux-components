// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import gsap from "gsap";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { flushSync } from "react-dom";
import { MoonIcon, SunIcon } from "lucide-react";
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

export type AnimatedThemeSwitchTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedThemeSwitchMode = "light" | "dark";

const THEMES: Record<`${AnimatedThemeSwitchTheme}:${AnimatedThemeSwitchMode}`, Record<string, string>> = {
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
    "primary": "#0e639c",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "secondary": "#3a3d41",
    "secondary-foreground": "#ffffff"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedThemeSwitchTheme = "default", mode: AnimatedThemeSwitchMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  // Any theme but Default tints key parts with its primary colour
  return { "data-theme": mode, "data-accent": theme === "default" ? undefined : "", style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

const ModeContext = React.createContext<{ mode: AnimatedThemeSwitchMode; setMode: (mode: AnimatedThemeSwitchMode) => void } | null>(null);

// Light/dark state owned by the component
function useTheme() {
  const context = React.useContext(ModeContext);
  return {
    resolvedTheme: context?.mode,
    forcedTheme: undefined as string | undefined,
    setTheme: (next: string) => context?.setMode(next === "dark" ? "dark" : "light"),
  };
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

// ---- theme-switch.tsx ----

/** swipe: the new theme wipes across, and back the other way. fade: it fades in. circle: it grows from the button. */
type ThemeSwitchVariant = "swipe" | "fade" | "circle"
/** spin: the old icon spins away, the new one spins in. orbit: the two icons circle each other. */
type ThemeSwitchIconMotion = "spin" | "orbit"

type ThemeSwitchProps = Omit<React.ComponentProps<typeof Button>, "size" | "onClick"> & {
  /** How the new theme reveals itself. */
  revealAnimation?: ThemeSwitchVariant
  /** Seconds. */
  duration?: number
  iconAnimation?: ThemeSwitchIconMotion
  /** A label above the button while hovered or focused. */
  showTooltip?: boolean
  onThemeChange?: (theme: "light" | "dark") => void
}

function revealFrames(
  revealAnimation: ThemeSwitchVariant,
  toDark: boolean,
  origin: { x: number; y: number; radius: number }
): Keyframe[] {
  if (revealAnimation === "fade") return [{ opacity: 0 }, { opacity: 1 }]
  if (revealAnimation === "swipe") {
    // Going dark wipes left to right, going light wipes back
    return toDark
      ? [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }]
      : [{ clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0)" }]
  }
  return [
    { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` },
    { clipPath: `circle(${origin.radius}px at ${origin.x}px ${origin.y}px)` },
  ]
}

const subscribe = () => () => {}

// Read here, not through motion's hook, so the demo's reduced-motion switch is honoured too
function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const read = () => setReduceMotion(mq.matches)
    read()
    mq.addEventListener?.("change", read)
    return () => mq.removeEventListener?.("change", read)
  }, [])
  return reduceMotion
}

// Always/never instead of "user", so the demo's reduced-motion switch is honoured too
function ReducedMotionConfig({ children }: { children: React.ReactNode }) {
  const reduce = useReduceMotion()
  return <MotionConfig reducedMotion={reduce ? "always" : "never"}>{children}</MotionConfig>
}

// Turns off the browser's own cross-fade for the page, so only our reveal shows, in both directions
const SWEEP_CSS =
  "html.theme-sweeping::view-transition-group(root){animation:none}" +
  "html.theme-sweeping::view-transition-old(root),html.theme-sweeping::view-transition-new(root){animation:none;mix-blend-mode:normal}" +
  "html.theme-sweeping::view-transition-old(root){z-index:1}" +
  "html.theme-sweeping::view-transition-new(root){z-index:2}"

function ThemeSwitch({
  revealAnimation = "circle",
  duration = 0.85,
  iconAnimation = "spin",
  showTooltip = true,
  variant = "outline",
  className,
  onThemeChange,
  ...props
}: ThemeSwitchProps) {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme()
  const mounted = React.useSyncExternalStore(subscribe, () => true, () => false)
  const busy = React.useRef(false)
  const sun = React.useRef<SVGSVGElement>(null)
  const moon = React.useRef<SVGSVGElement>(null)
  const orbit = React.useRef<HTMLSpanElement>(null)
  const wrapper = React.useRef<HTMLSpanElement>(null)
  const previous = React.useRef(resolvedTheme)
  const [hovered, setHovered] = React.useState(false)
  const reduceMotion = useReduceMotion()
  const dark = resolvedTheme === "dark"
  const orbiting = iconAnimation === "orbit"

  // The orbit starts wherever the current theme needs it
  React.useLayoutEffect(() => {
    if (!orbiting || !mounted || !orbit.current || !sun.current || !moon.current) return
    gsap.set(orbit.current, { transformOrigin: "50% 100%", rotation: dark ? 180 : 0 })
    gsap.set([sun.current, moon.current], { rotation: dark ? -180 : 0 })
    // Only the first paint should reset it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orbiting, mounted])

  React.useLayoutEffect(() => {
    const before = previous.current
    previous.current = resolvedTheme
    if (!before || before === resolvedTheme || !sun.current || !moon.current) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (orbiting && orbit.current) {
      // Both icons travel half a circle, staying upright
      gsap.killTweensOf([orbit.current, sun.current, moon.current])
      const to = { duration: reduced ? 0 : 0.6, ease: "power3.inOut" }
      gsap.to(orbit.current, { rotation: "+=180", ...to })
      gsap.to([sun.current, moon.current], { rotation: "-=180", ...to })
      return
    }

    // The old icon spins away, then the new one spins up in its place
    const toDark = resolvedTheme === "dark"
    const leaving = toDark ? sun.current : moon.current
    const entering = toDark ? moon.current : sun.current
    gsap.killTweensOf([leaving, entering])
    if (reduced) {
      gsap.set(leaving, { scale: 0, opacity: 0 })
      gsap.set(entering, { scale: 1, rotate: 0, opacity: 1 })
      return
    }
    gsap
      .timeline()
      .fromTo(
        leaving,
        { rotate: 0, scale: 1, opacity: 1 },
        { rotate: 180, scale: 0, opacity: 0, duration: 0.17, ease: "power2.in" }
      )
      .fromTo(
        entering,
        { rotate: -180, scale: 0, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 0.25, ease: "back.out(1.6)" }
      )
  }, [resolvedTheme, orbiting])

  const toggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (busy.current || forcedTheme) return
    const next = resolvedTheme === "dark" ? "light" : "dark"
    const box = event.currentTarget.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    const origin = {
      x,
      y,
      radius: Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)),
    }
    const apply = () => {
      setTheme(next)
      onThemeChange?.(next)
    }

    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply()
      return
    }

    busy.current = true
    const root = document.documentElement
    const sweepStyle = document.createElement("style")
    sweepStyle.textContent = SWEEP_CSS
    document.head.appendChild(sweepStyle)
    root.classList.add("theme-sweeping")
    const view = document.startViewTransition(() => {
      flushSync(apply)
    })

    try {
      await view.ready
      const progress = { value: 0 }
      // A paused native animation holds the snapshot while GSAP sets its time
      const reveal = root.animate(revealFrames(revealAnimation, next === "dark", origin), {
        duration: 1000,
        easing: "linear",
        fill: "both",
        pseudoElement: "::view-transition-new(root)",
      })
      reveal.pause()
      await gsap.to(progress, {
        value: 1000,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          reveal.currentTime = progress.value
        },
      })
      reveal.finish()
      await view.finished
    } catch {
      // Hidden tabs can skip the snapshot
      view.skipTransition()
      await view.finished.catch(() => {})
    } finally {
      root.classList.remove("theme-sweeping")
      sweepStyle.remove()
      busy.current = false
      setHovered(wrapper.current?.matches(":hover") ?? false)
    }
  }

  const word = dark ? "light" : "dark"
  const current = dark ? "Dark" : "Light"
  const iconClass = cn("size-10.5 transition-[scale] duration-200 group-hover/button:scale-90 motion-reduce:transition-none", variant !== "default" && "in-data-accent:text-(--hx-primary)")

  return (
    <ReducedMotionConfig>
    <span
      ref={wrapper}
      data-slot="theme-switch-root"
      className="relative inline-flex"
      onPointerEnter={() => setHovered(true)}
      // The transition overlay steals the pointer, so leaving is checked afterwards
      onPointerLeave={() => !busy.current && setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <Button
        data-slot="theme-switch"
        variant={variant}
        size="icon-lg"
        aria-label="Toggle theme"
        onClick={toggle}
        className={cn(
          "relative size-18 overflow-hidden",
          // These keep their colour on hover
          variant === "outline" && "hover:bg-(--hx-background) in-data-[theme=dark]:hover:bg-(--hx-input)/30",
          variant === "default" && "hover:bg-(--hx-primary)",
          variant === "secondary" && "hover:bg-(--hx-secondary)",
          className
        )}
        {...props}
      >
        {orbiting ? (
          mounted && (
            <span ref={orbit} aria-hidden className="pointer-events-none absolute inset-0">
              <span className="absolute inset-0 grid place-items-center">
                <SunIcon ref={sun} className={iconClass} />
              </span>
              <span className="absolute inset-0 grid translate-y-18 place-items-center">
                <MoonIcon ref={moon} className={iconClass} />
              </span>
            </span>
          )
        ) : (
          <>
            <SunIcon ref={sun} className={cn("absolute opacity-100 in-data-[theme=dark]:opacity-0", iconClass)} />
            <MoonIcon ref={moon} className={cn("absolute opacity-0 in-data-[theme=dark]:opacity-100", iconClass)} />
          </>
        )}
      </Button>

      {mounted && resolvedTheme && (
        <span role="status" aria-live="polite" className="sr-only">
          {current} theme on
        </span>
      )}

      <AnimatePresence>
        {showTooltip && hovered && resolvedTheme && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-md bg-(--hx-foreground) px-2 py-1 text-xs font-medium whitespace-nowrap text-(--hx-background)"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 4 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
          >
            <span>Change to</span>
            {reduceMotion ? (
              <span>{word}</span>
            ) : (
              <span className="relative inline-flex overflow-hidden">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={word}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.2, ease: [0.45, 0, 0.25, 1] }}
                  >
                    {word}
                  </motion.span>
                </AnimatePresence>
              </span>
            )}
            <span>theme</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
    </ReducedMotionConfig>
  )
}

// ---- demo: theme-switch-demo.tsx ----

const controls = {
  revealAnimation: {
    group: "Transition",
    type: "select",
    label: "Reveal animation",
    value: "circle",
    options: [
      { label: "Circle from button", value: "circle" },
      { label: "Swipe", value: "swipe" },
      { label: "Fade", value: "fade" },
    ],
  },
  duration: {
    group: "Transition",
    type: "slider",
    label: "Duration",
    value: 0.85,
    min: 0.2,
    max: 2,
    step: 0.05,
    unit: "s",
  },
  iconAnimation: {
    group: "Button",
    type: "select",
    label: "Icon motion",
    value: "orbit",
    options: [
      { label: "Spin", value: "spin" },
      { label: "Orbit", value: "orbit" },
    ],
  },
  showTooltip: { group: "Button", type: "checkbox", label: "Tooltip", value: true },
  variant: {
    group: "Button",
    type: "select",
    label: "Look",
    value: "outline",
    options: [
      { label: "Outline", value: "outline" },
      { label: "Ghost", value: "ghost" },
      { label: "Default", value: "default" },
      { label: "Secondary", value: "secondary" },
    ],
  },
}

function ThemeSwitchDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel
  const reduceMotion = useReduceMotion()
  const tip = reduceMotion
    ? "Reduced motion is on, so the theme changes at once"
    : values.revealAnimation === "swipe"
      ? "The new theme wipes across the page"
      : values.revealAnimation === "fade"
        ? "The new theme fades in over the page"
        : "The circle grows from the button"

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center py-8">
        <ThemeSwitch
          revealAnimation={values.revealAnimation as ThemeSwitchVariant}
          duration={values.duration}
          iconAnimation={values.iconAnimation as ThemeSwitchIconMotion}
          showTooltip={values.showTooltip}
          variant={values.variant as "outline" | "ghost" | "default" | "secondary"}
        />
      </div>
      <p className="text-center text-sm text-(--hx-muted-foreground) max-lg:hidden">
        Tip: {tip}
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

export interface AnimatedThemeSwitchProps extends Partial<ControlValues> {
  theme?: AnimatedThemeSwitchTheme;
  mode?: AnimatedThemeSwitchMode;
  className?: string;
  /** Called with the new mode each time the switch is used, so the page around it can follow. */
  onModeChange?: (mode: AnimatedThemeSwitchMode) => void;
}

export default function AnimatedThemeSwitch({ theme = "spotify", mode = "dark", className, onModeChange, ...props }: AnimatedThemeSwitchProps) {
  const [liveMode, setLiveMode] = React.useState(mode);
  const [seenMode, setSeenMode] = React.useState(mode);
  if (seenMode !== mode) {
    setSeenMode(mode);
    setLiveMode(mode);
  }
  const modeContext = React.useMemo(
    () => ({
      mode: liveMode,
      // Runs inside the reveal's flushSync, so the page and the switch change in the same frame
      setMode: (next: AnimatedThemeSwitchMode) => {
        setLiveMode(next);
        onModeChange?.(next);
      },
    }),
    [liveMode, onModeChange]
  );
  const themed = themeProps(theme, liveMode);
  return (
    <ModeContext.Provider value={modeContext}>
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) motion-reduce:transition-none motion-reduce:**:transition-none [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <ThemeSwitchDemo {...props} />
      </div>
    </ThemeContext.Provider>
    </ModeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  ThemeSwitch,
  type ThemeSwitchIconMotion,
  type ThemeSwitchVariant,
};
