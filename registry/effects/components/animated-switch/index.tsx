// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { MotionConfig, animate, motion, useMotionValue, useTransform, type MotionStyle, type Transition } from "motion/react";
import { twMerge } from "tailwind-merge";

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

export type AnimatedSwitchTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedSwitchMode = "light" | "dark";

const THEMES: Record<`${AnimatedSwitchTheme}:${AnimatedSwitchMode}`, Record<string, string>> = {
  "default:light": {
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "destructive": "oklch(0.577 0.245 27.325)",
    "foreground": "oklch(0.145 0 0)",
    "info": "oklch(0.588 0.158 241.966)",
    "muted-foreground": "oklch(0.556 0 0)",
    "primary": "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    "ring": "oklch(0.708 0 0)",
    "secondary": "oklch(0.97 0 0)",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "default:dark": {
    "background": "oklch(0.145 0 0)",
    "border": "oklch(1 0 0 / 10%)",
    "destructive": "oklch(0.704 0.191 22.216)",
    "foreground": "oklch(0.985 0 0)",
    "info": "oklch(0.685 0.169 237.323)",
    "muted-foreground": "oklch(0.708 0 0)",
    "primary": "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    "ring": "oklch(0.556 0 0)",
    "secondary": "oklch(0.269 0 0)",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "caffeine:light": {
    "background": "#f9f9f9",
    "border": "#d8d8d8",
    "destructive": "#e54d2e",
    "foreground": "#202020",
    "info": "oklch(0.588 0.158 241.966)",
    "muted-foreground": "#646464",
    "primary": "#644a40",
    "primary-foreground": "#ffffff",
    "ring": "#644a40",
    "secondary": "#ffdfb5",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "caffeine:dark": {
    "background": "#111111",
    "border": "#201e18",
    "destructive": "#e54d2e",
    "foreground": "#eeeeee",
    "info": "oklch(0.685 0.169 237.323)",
    "muted-foreground": "#b4b4b4",
    "primary": "#ffe0c2",
    "primary-foreground": "#081a1b",
    "ring": "#ffe0c2",
    "secondary": "#393028",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "claude:light": {
    "background": "#faf9f5",
    "border": "#dad9d4",
    "destructive": "#c0392b",
    "foreground": "#3d3929",
    "info": "oklch(0.588 0.158 241.966)",
    "muted-foreground": "#83827d",
    "primary": "#c96442",
    "primary-foreground": "#ffffff",
    "ring": "#c96442",
    "secondary": "#e9e6dc",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "claude:dark": {
    "background": "#262624",
    "border": "#3e3e38",
    "destructive": "#ef4444",
    "foreground": "#c3c0b6",
    "info": "oklch(0.685 0.169 237.323)",
    "muted-foreground": "#b7b5a9",
    "primary": "#d97757",
    "primary-foreground": "#ffffff",
    "ring": "#d97757",
    "secondary": "#faf9f5",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "ghibli:light": {
    "background": "#f3ecd9",
    "border": "#d5cba8",
    "destructive": "#c0533a",
    "foreground": "#4a4436",
    "info": "oklch(0.588 0.158 241.966)",
    "muted-foreground": "#7a705a",
    "primary": "#6f9a5b",
    "primary-foreground": "#ffffff",
    "ring": "#6f9a5b",
    "secondary": "#dcd3b6",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "ghibli:dark": {
    "background": "#1f2a26",
    "border": "#3b4c45",
    "destructive": "#e0745a",
    "foreground": "#e6e0cc",
    "info": "oklch(0.685 0.169 237.323)",
    "muted-foreground": "#a8b39f",
    "primary": "#8fbf7a",
    "primary-foreground": "#15201a",
    "ring": "#8fbf7a",
    "secondary": "#34443d",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "spotify:light": {
    "background": "#ffffff",
    "border": "#e0e0e0",
    "destructive": "#e22134",
    "foreground": "#191414",
    "info": "oklch(0.588 0.158 241.966)",
    "muted-foreground": "#6a6a6a",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1db954",
    "secondary": "#f0f0f0",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "spotify:dark": {
    "background": "#121212",
    "border": "#2a2a2a",
    "destructive": "#f3727f",
    "foreground": "#ffffff",
    "info": "oklch(0.685 0.169 237.323)",
    "muted-foreground": "#b3b3b3",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1ed760",
    "secondary": "#242424",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "valorant:light": {
    "background": "#ece8e1",
    "border": "#cfc9bc",
    "destructive": "#bd3944",
    "foreground": "#0f1923",
    "info": "oklch(0.588 0.158 241.966)",
    "muted-foreground": "#5c6670",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "secondary": "#dcd7cc",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "valorant:dark": {
    "background": "#0f1923",
    "border": "#2b3a48",
    "destructive": "#ff6b76",
    "foreground": "#ece8e1",
    "info": "oklch(0.685 0.169 237.323)",
    "muted-foreground": "#8b978f",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "secondary": "#1f2b37",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "vscode:light": {
    "background": "#ffffff",
    "border": "#e5e5e5",
    "destructive": "#e51400",
    "foreground": "#3b3b3b",
    "info": "oklch(0.588 0.158 241.966)",
    "muted-foreground": "#717171",
    "primary": "#007acc",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "secondary": "#e5e5e5",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "vscode:dark": {
    "background": "#1f1f1f",
    "border": "#3c3c3c",
    "destructive": "#f14c4c",
    "foreground": "#cccccc",
    "info": "oklch(0.685 0.169 237.323)",
    "muted-foreground": "#9d9d9d",
    "primary": "#0e639c",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "secondary": "#3a3d41",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedSwitchTheme = "default", mode: AnimatedSwitchMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  // Any theme but Default tints key parts with its primary colour
  return { "data-theme": mode, "data-accent": theme === "default" ? undefined : "", style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

// ---- switch.tsx ----

/** elastic: the handle squashes when pressed and stretches as it travels. apple: a glass capsule that turns see-through when pressed, and can be dragged. */
type SwitchVariant = "elastic" | "apple"
type SwitchSize = "md" | "lg" | "xl"
type SwitchColor = "primary" | "foreground" | "green" | "blue" | "orange" | "rose"
type SwitchRounded = "sm" | "md" | "lg" | "xl" | "full"
type SwitchLabelSide = "top" | "right" | "bottom" | "left"

type SwitchMotion = {
  variant: SwitchVariant
  size: SwitchSize
  /** Track colour when on. "primary" follows the theme. */
  color: SwitchColor
  /** With "foreground" colour, use the system green on the apple switch. */
  appleGreen: boolean
  rounded: SwitchRounded
  /** How hard the handle squashes (elastic) or widens (apple) when pressed. */
  pressSqueeze: number
  /** Travel time of the handle, in seconds. */
  duration: number
  bounce: number
  /** Small I / O marks in the track. */
  showMarks: boolean
  labelPosition: SwitchLabelSide
}

// Track and handle sizes. The numbers are what the animation needs; the classes size the track.
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

const SIZE: Record<
  SwitchSize,
  { track: string; w: number; d: number; gap: number; label: string; mark: string }
> = {
  md: { track: "h-6.5 w-11", w: 44, d: 20, gap: 2, label: "gap-2.5 text-base", mark: "text-[0.6rem]" },
  lg: { track: "h-9 w-16", w: 64, d: 28, gap: 4, label: "gap-3 text-xl", mark: "text-xs" },
  xl: { track: "h-13 w-24", w: 96, d: 40, gap: 6, label: "gap-5 text-3xl", mark: "text-lg" },
}

// The apple switch is a little longer than the elastic one
const APPLE_WIDE: Record<SwitchSize, { track: string; w: number }> = {
  md: { track: "h-6.5 w-17", w: 68 },
  lg: { track: "h-9 w-25", w: 100 },
  xl: { track: "h-13 w-36", w: 144 },
}

const TRACK_ROUNDED: Record<SwitchRounded, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
}

// One step tighter than the track, so the handle sits concentric inside it
const HANDLE_ROUNDED: Record<SwitchRounded, string> = {
  sm: "rounded-xs",
  md: "rounded-sm",
  lg: "rounded-md",
  xl: "rounded-lg",
  full: "rounded-full",
}

// On a dark page "on" is the dark grey that "off" used to be, not a bright fill
const FOREGROUND = "bg-(--hx-foreground) in-data-[theme=dark]:bg-(--hx-secondary)"

const ON_COLOR: Record<SwitchColor, string> = {
  primary: "bg-(--hx-primary)",
  foreground: FOREGROUND,
  green: "bg-(--hx-success)",
  blue: "bg-(--hx-info)",
  orange: "bg-(--hx-warning)",
  rose: "bg-(--hx-destructive)",
}

const IOS_GREEN = "bg-(--hx-success)"
const OFF: Record<SwitchVariant, string> = {
  elastic: "bg-(--hx-foreground)/20 in-data-[theme=dark]:bg-(--hx-foreground)/10",
  apple: "bg-(--hx-foreground)/20 in-data-[theme=dark]:bg-(--hx-foreground)/10",
}

const FAST: Transition = { type: "spring", duration: 0.15, bounce: 0 }
const SNAP: Transition = { type: "spring", duration: 0.4, bounce: 0.5 }

function Switch({
  variant = "elastic",
  size = "xl",
  color = "primary",
  appleGreen = false,
  rounded = "full",
  pressSqueeze = 0.18,
  duration = 0.35,
  bounce = 0.3,
  showMarks = false,
  labelPosition = "right",
  label,
  className,
  labelClassName,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  ...props
}: Omit<SwitchPrimitive.Root.Props, "children" | "className" | "render"> &
  Partial<SwitchMotion> & {
    label?: React.ReactNode
    className?: string
    labelClassName?: string
  }) {
  const reduceMotion = usePrefersReducedMotion()
  const spec = { ...SIZE[size], ...(variant === "apple" ? APPLE_WIDE[size] : null) }
  // The apple handle is a wider capsule, like the system switch
  const handleW = variant === "apple" ? Math.round(spec.d * 1.4) : spec.d
  const handleH = variant === "apple" ? Math.round(spec.d * 1.1) : spec.d
  const travel = spec.w - handleW - spec.gap * 2
  // Only the apple switch can be dragged, like the system one
  const canDrag = variant === "apple"

  const [own, setOwn] = React.useState(defaultChecked ?? false)
  const on = checked ?? own

  // Where the handle is, and how it is squashed or widened
  const x = useMotionValue(on ? travel : 0)
  const scaleX = useMotionValue(1)
  const scaleY = useMotionValue(1)
  const widen = useMotionValue(0)
  const lift = useMotionValue(0)
  const fillOpacity = useTransform(x, [0, travel], [0, 1])
  const offOpacity = useTransform(x, [0, travel], [1, 0])
  // The apple handle grows both ways, so it can overhang the track ends
  const appleX = useTransform(() => x.get() - widen.get() / 2)
  const appleWidth = useTransform(widen, (w) => handleW + w)
  const appleHeight = useTransform(lift, (h) => handleH + h)
  // 0 at rest, 1 while pressed: the capsule goes from milky white to clear glass
  const glass = useMotionValue(0)
  const glassBg = useTransform(glass, (g) => `color-mix(in oklab, var(--hx-background) ${(1 - 0.7 * g) * 100}%, transparent)`)
  const glassBlur = useTransform(glass, (g) => `blur(${g * 10}px) saturate(${1 + g * 0.8})`)
  const glassShadow = useTransform(glass, (g) =>
    [
      `0 ${2 + g * 2}px ${8 + g * 6}px rgba(0,0,0,${0.2 - g * 0.08})`,
      `inset 0 0 0 1px rgba(255,255,255,${0.35 + g * 0.35})`,
      `inset 0 2px 3px rgba(255,255,255,${0.9 - g * 0.3})`,
      `inset 0 -2px 4px rgba(0,0,0,${0.06 + g * 0.06})`,
    ].join(",")
  )

  const ok = (t: Transition): Transition => (reduceMotion ? { duration: 0 } : t)
  const travelSpring: Transition = { type: "spring", duration, bounce }

  const dragging = React.useRef(false)
  const suppressClick = React.useRef(false)
  const allowClick = React.useRef(false)
  const start = React.useRef({ pointer: 0, handle: 0 })

  // Follow the state: slide the handle, with a stretch on the way for elastic
  const previous = React.useRef(on)
  React.useEffect(() => {
    if (previous.current === on) return
    previous.current = on
    animate(x, on ? travel : 0, ok(travelSpring))
    if (variant === "elastic" && !reduceMotion) {
      animate(scaleX, 1 + pressSqueeze * 0.85, FAST).then(() => animate(scaleX, 1, SNAP))
      animate(scaleY, 1 - pressSqueeze * 0.65, FAST).then(() => animate(scaleY, 1, SNAP))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on])

  // Snap to a new size if it changes
  React.useEffect(() => {
    x.jump(on ? travel : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travel])

  const change = (next: boolean, details: Parameters<NonNullable<typeof onCheckedChange>>[1]) => {
    setOwn(next)
    onCheckedChange?.(next, details)
  }

  const press = () => {
    if (reduceMotion) return
    if (variant === "elastic") {
      animate(scaleX, 1 - pressSqueeze, FAST)
      animate(scaleY, 1 + pressSqueeze * 0.55, FAST)
    } else {
      // The glass swells wider and stands a little taller than the track
      const cover = Math.min(1, pressSqueeze / 0.2)
      // No bounce, so it lands on its final size and stays exactly that through a drag
      const swell: Transition = { type: "spring", duration: 0.25, bounce: 0 }
      animate(widen, (spec.w * 0.68 - handleW) * cover, swell)
      animate(lift, handleH * Math.min(0.75, pressSqueeze * 2.8), swell)
      animate(glass, 1, FAST)
    }
  }
  const release = () => {
    if (variant === "elastic") {
      animate(scaleX, 1, ok(SNAP))
      animate(scaleY, 1, ok(SNAP))
    } else {
      animate(widen, 0, ok({ type: "spring", duration: 0.35, bounce: 0.25 }))
      animate(lift, 0, ok({ type: "spring", duration: 0.35, bounce: 0.25 }))
      animate(glass, 0, ok({ duration: 0.3, ease: "easeOut" }))
    }
  }

  const rootRef = React.useRef<HTMLElement>(null)

  const fill = color === "foreground" && variant === "apple" && appleGreen ? IOS_GREEN : ON_COLOR[color]

  const control = (
    <SwitchPrimitive.Root
      ref={rootRef as React.Ref<HTMLSpanElement>}
      data-slot="switch"
      data-variant={variant}
      checked={on}
      disabled={disabled}
      onCheckedChange={(next, details) => change(next, details)}
      onPointerDown={(e) => {
        if (disabled) return
        press()
        if (!canDrag) return
        dragging.current = false
        start.current = { pointer: e.clientX, handle: x.get() }
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (!canDrag || !e.currentTarget.hasPointerCapture(e.pointerId)) return
        const dx = e.clientX - start.current.pointer
        if (!dragging.current && Math.abs(dx) < 3) return
        dragging.current = true
        x.set(Math.min(travel, Math.max(0, start.current.handle + dx)))
      }}
      onPointerUp={(e) => {
        release()
        if (!canDrag || !dragging.current) return
        dragging.current = false
        e.currentTarget.releasePointerCapture(e.pointerId)
        // The click the browser sends after a drag must not flip it a second time
        suppressClick.current = true
        setTimeout(() => (suppressClick.current = false), 100)
        if (x.get() > travel / 2 !== on) {
          // Flip through the switch's own click, so a parent that controls it hears about it
          allowClick.current = true
          e.currentTarget.click()
        } else animate(x, on ? travel : 0, ok(travelSpring))
      }}
      onPointerLeave={release}
      onPointerCancel={release}
      onClickCapture={(e) => {
        if (allowClick.current) {
          allowClick.current = false
          return
        }
        if (!suppressClick.current) return
        suppressClick.current = false
        e.stopPropagation()
        e.preventDefault()
      }}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center outline-none select-none",
        "focus-visible:ring-2 focus-visible:ring-(--hx-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--hx-background)",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        canDrag && "touch-none",
        spec.track,
        TRACK_ROUNDED[rounded],
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn("absolute inset-0", TRACK_ROUNDED[rounded], OFF[variant])}
        style={variant === "apple" ? { boxShadow: "inset 0 1px 3px rgba(0,0,0,0.22)" } : undefined}
      />
      <motion.span
        aria-hidden
        className={cn("absolute inset-0", TRACK_ROUNDED[rounded], fill)}
        style={{ opacity: fillOpacity }}
      />
      {variant === "apple" && (
        // A soft sheen along the top of the track
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-b from-(--hx-background)/30 via-transparent to-(--hx-foreground)/5",
            TRACK_ROUNDED[rounded]
          )}
        />
      )}
      {showMarks && (
        <>
          <motion.span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 flex items-center justify-center font-semibold",
              color === "primary" ? "text-(--hx-primary-foreground)" : "text-(--hx-background)",
              spec.mark
            )}
            style={{ left: spec.gap, width: travel, opacity: fillOpacity }}
          >
            I
          </motion.span>
          <motion.span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 flex items-center justify-center font-semibold text-(--hx-muted-foreground)",
              spec.mark
            )}
            style={{ right: spec.gap, width: travel, opacity: offOpacity }}
          >
            O
          </motion.span>
        </>
      )}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        render={(thumbProps) => (
          <motion.span
            {...(thumbProps as React.ComponentProps<typeof motion.span>)}
            className={cn(
              "pointer-events-none z-10 block",
              variant === "elastic" && "bg-(--hx-background) shadow-md ring-1 ring-(--hx-foreground)/10",
              HANDLE_ROUNDED[rounded]
            )}
            style={
              {
                ...thumbProps.style,
                marginLeft: spec.gap,
                ...(variant === "apple" ? {} : { height: spec.d }),
                ...(variant === "apple"
                  ? {
                      width: appleWidth,
                      height: appleHeight,
                      x: appleX,
                      backgroundColor: glassBg,
                      backdropFilter: glassBlur,
                      WebkitBackdropFilter: glassBlur,
                      boxShadow: glassShadow,
                    }
                  : { width: spec.d, x, scaleX, scaleY }),
              } as MotionStyle
            }
          />
        )}
      />
    </SwitchPrimitive.Root>
  )

  if (label === undefined) return <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>{control}</MotionConfig>

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
      <label
        className={cn(
          "inline-flex cursor-pointer items-center select-none",
          (labelPosition === "top" || labelPosition === "bottom") && "flex-col",
          spec.label,
          disabled && "cursor-not-allowed opacity-50",
          labelClassName
        )}
        // A click on the text flips the switch, whichever side the text is on
        onClick={(e) => {
          if (e.target !== e.currentTarget && rootRef.current?.contains(e.target as Node)) return
          e.preventDefault()
          if (!disabled) rootRef.current?.click()
        }}
      >
        {(labelPosition === "left" || labelPosition === "top") && <span>{label}</span>}
        {control}
        {(labelPosition === "right" || labelPosition === "bottom") && <span>{label}</span>}
      </label>
    </MotionConfig>
  )
}

// ---- demo: switch-demo.tsx ----

const controls = {
  variant: {
    group: "Style",
    type: "select",
    label: "Switch type",
    value: "elastic",
    options: [
      { label: "Elastic", value: "elastic" },
      { label: "Apple", value: "apple" },
    ],
  },
  size: {
    group: "Style",
    type: "select",
    label: "Size",
    value: "xl",
    options: [
      { label: "md", value: "md" },
      { label: "lg", value: "lg" },
      { label: "xl", value: "xl" },
    ],
  },
  color: {
    group: "Style",
    type: "select",
    label: "On colour",
    value: "primary",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Foreground", value: "foreground" },
      { label: "Green", value: "green" },
      { label: "Blue", value: "blue" },
      { label: "Orange", value: "orange" },
      { label: "Rose", value: "rose" },
    ],
  },
  appleGreen: { disabled: (v: Record<string, unknown>) => v.variant !== "apple" || v.color !== "foreground", group: "Style", type: "checkbox", label: "Apple green", value: false },
  rounded: {
    group: "Style",
    type: "select",
    label: "Roundness",
    value: "full",
    options: [
      { label: "sm", value: "sm" },
      { label: "md", value: "md" },
      { label: "lg", value: "lg" },
      { label: "xl", value: "xl" },
      { label: "Full", value: "full" },
    ],
  },
  showMarks: { group: "Style", type: "checkbox", label: "Show marks", value: false },
  labelPosition: {
    group: "Style",
    type: "select",
    label: "Label position",
    value: "top",
    options: [
      { label: "Above", value: "top" },
      { label: "Below", value: "bottom" },
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ],
  },

  pressSqueeze: {
    group: "Motion",
    type: "slider",
    label: "Press squeeze",
    value: 0.24,
    min: 0,
    max: 0.4,
    step: 0.01,
  },
  duration: {
    group: "Motion",
    type: "slider",
    label: "Duration",
    value: 0.35,
    min: 0.1,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  bounce: {
    group: "Motion",
    type: "slider",
    label: "Bounce",
    value: 0.3,
    min: 0,
    max: 0.7,
    step: 0.05,
  },
}

function SwitchDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel
  const [on, setOn] = React.useState(true)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-64 max-md:min-h-72 items-center justify-center px-4 py-8">
        <Switch
          checked={on}
          onCheckedChange={setOn}
          label="Wi-Fi"
          variant={values.variant as SwitchVariant}
          size={values.size as SwitchSize}
          color={values.color as SwitchColor}
          appleGreen={values.appleGreen}
          rounded={values.rounded as SwitchRounded}
          showMarks={values.showMarks}
          labelPosition={values.labelPosition as SwitchLabelSide}
          pressSqueeze={values.pressSqueeze}
          duration={values.duration}
          bounce={values.bounce}
        />
      </div>
      <p className="text-center text-sm text-(--hx-muted-foreground) max-lg:hidden">
        {values.variant === "apple" ? "Tip: press and hold to see the glass handle swell, then drag it across and let go past the middle to flip it." : "Tip: press and hold to see the handle squeeze before you let go."}
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

export interface AnimatedSwitchProps extends Partial<ControlValues> {
  theme?: AnimatedSwitchTheme;
  mode?: AnimatedSwitchMode;
  className?: string;
}

export default function AnimatedSwitch({ theme = "valorant", mode = "dark", className, ...props }: AnimatedSwitchProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <ReducedMotionConfig>
          <SwitchDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  Switch,
  type SwitchVariant,
  type SwitchSize,
  type SwitchColor,
  type SwitchRounded,
  type SwitchLabelSide,
};
