// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, MotionConfig, animate, motion, useIsPresent, useMotionValue, useSpring, useTransform, useVelocity, type Transition, type Variants } from "motion/react";
import { Archive, Copy, Pencil, Share2, Trash2 } from "lucide-react";
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

export type AnimatedTooltipTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedTooltipMode = "light" | "dark";

const THEMES: Record<`${AnimatedTooltipTheme}:${AnimatedTooltipMode}`, Record<string, string>> = {
  "default:light": {
    "accent": "oklch(0.97 0 0)",
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "foreground": "oklch(0.145 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    "primary": "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    "ring": "oklch(0.708 0 0)"
  },
  "default:dark": {
    "accent": "oklch(0.269 0 0)",
    "background": "oklch(0.145 0 0)",
    "border": "oklch(1 0 0 / 10%)",
    "foreground": "oklch(0.985 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    "primary": "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    "ring": "oklch(0.556 0 0)"
  },
  "caffeine:light": {
    "accent": "#e8e8e8",
    "background": "#f9f9f9",
    "border": "#d8d8d8",
    "foreground": "#202020",
    "muted-foreground": "#646464",
    "primary": "#644a40",
    "primary-foreground": "#ffffff",
    "ring": "#644a40"
  },
  "caffeine:dark": {
    "accent": "#2a2a2a",
    "background": "#111111",
    "border": "#201e18",
    "foreground": "#eeeeee",
    "muted-foreground": "#b4b4b4",
    "primary": "#ffe0c2",
    "primary-foreground": "#081a1b",
    "ring": "#ffe0c2"
  },
  "claude:light": {
    "accent": "#e9e6dc",
    "background": "#faf9f5",
    "border": "#dad9d4",
    "foreground": "#3d3929",
    "muted-foreground": "#83827d",
    "primary": "#c96442",
    "primary-foreground": "#ffffff",
    "ring": "#c96442"
  },
  "claude:dark": {
    "accent": "#1a1915",
    "background": "#262624",
    "border": "#3e3e38",
    "foreground": "#c3c0b6",
    "muted-foreground": "#b7b5a9",
    "primary": "#d97757",
    "primary-foreground": "#ffffff",
    "ring": "#d97757"
  },
  "ghibli:light": {
    "accent": "#c9dfe8",
    "background": "#f3ecd9",
    "border": "#d5cba8",
    "foreground": "#4a4436",
    "muted-foreground": "#7a705a",
    "primary": "#6f9a5b",
    "primary-foreground": "#ffffff",
    "ring": "#6f9a5b"
  },
  "ghibli:dark": {
    "accent": "#31463f",
    "background": "#1f2a26",
    "border": "#3b4c45",
    "foreground": "#e6e0cc",
    "muted-foreground": "#a8b39f",
    "primary": "#8fbf7a",
    "primary-foreground": "#15201a",
    "ring": "#8fbf7a"
  },
  "spotify:light": {
    "accent": "#e8f8ee",
    "background": "#ffffff",
    "border": "#e0e0e0",
    "foreground": "#191414",
    "muted-foreground": "#6a6a6a",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1db954"
  },
  "spotify:dark": {
    "accent": "#2a2a2a",
    "background": "#121212",
    "border": "#2a2a2a",
    "foreground": "#ffffff",
    "muted-foreground": "#b3b3b3",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1ed760"
  },
  "valorant:light": {
    "accent": "#d5d0c4",
    "background": "#ece8e1",
    "border": "#cfc9bc",
    "foreground": "#0f1923",
    "muted-foreground": "#5c6670",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655"
  },
  "valorant:dark": {
    "accent": "#22303d",
    "background": "#0f1923",
    "border": "#2b3a48",
    "foreground": "#ece8e1",
    "muted-foreground": "#8b978f",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655"
  },
  "vscode:light": {
    "accent": "#e8e8e8",
    "background": "#ffffff",
    "border": "#e5e5e5",
    "foreground": "#3b3b3b",
    "muted-foreground": "#717171",
    "primary": "#007acc",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4"
  },
  "vscode:dark": {
    "accent": "#2a2d2e",
    "background": "#1f1f1f",
    "border": "#3c3c3c",
    "foreground": "#cccccc",
    "muted-foreground": "#9d9d9d",
    "primary": "#0e639c",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedTooltipTheme = "default", mode: AnimatedTooltipMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  // Any theme but Default tints key parts with its primary colour
  return { "data-theme": mode, "data-accent": theme === "default" ? undefined : "", style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

function ThemeScope({ children }: { children?: React.ReactNode }) {
  const themed = React.useContext(ThemeContext);
  return (
    <div {...themed} className="contents motion-reduce:**:transition-none [:where(&_*)]:border-(--hx-border) [:where(&_*)]:outline-(--hx-ring)/50">
      {children}
    </div>
  );
}

// ---- floating-tooltip.tsx ----

type FloatingTooltipVariant = "default" | "outline"
type FloatingTooltipRounded = "none" | "sm" | "md" | "lg" | "xl" | "full"
/** cursor: trails the pointer, on the side you choose. anchor: sits on one side of the element it describes. */
type FloatingTooltipFollow = "cursor" | "anchor"
type FloatingTooltipSide = "top" | "bottom" | "left" | "right"
type FloatingTooltipAppear = "scale" | "fade" | "none"
/**
 * What happens when you move to another trigger while a tooltip is open.
 * instant: the text swaps.
 * fade: the box reshapes and the text cross-fades.
 * roll: the box reshapes and the text rolls up or down, the way you moved.
 * slide: the box reshapes and the text slides fully out and in sideways, the way you moved.
 */
type FloatingTooltipChange = "instant" | "fade" | "roll" | "slide"
/** A Tailwind spacing step: "4" is 1rem. */
type FloatingTooltipOffset = "1" | "2" | "3" | "4" | "6" | "8"

type FloatingTooltipOptions = {
  variant: FloatingTooltipVariant
  rounded: FloatingTooltipRounded
  follow: FloatingTooltipFollow
  /** Which side of the cursor or element the tooltip sits on. It is centred on that point. */
  side: FloatingTooltipSide
  sideOffset: FloatingTooltipOffset
  appearAnimation: FloatingTooltipAppear
  changeAnimation: FloatingTooltipChange
  /** The box stretches along the way it is moving, with speed. Needs elastic. */
  stretchOnMove: boolean
  /** The box leans into the way it is moving, with speed. Needs elastic. */
  tiltOnMove: boolean
  /**
   * The rubbery feel: it overshoots a little, and can stretch and lean with speed.
   * Off, it just glides smoothly to where it is going and stops there.
   */
  elastic: boolean
  /** How tightly it follows. Lower is softer. */
  stiffness: number
  /** Seconds before it closes, so it can stay open while you cross a gap to the next trigger. */
  closeDelay: number
  /** Seconds the box takes to reshape when the text changes. */
  duration: number
  /** How much it overshoots: following (needs elastic) and reshaping for morph. 0 is none. */
  bounce: number
}

const TEXT_SIZE = "px-3.5 py-2.5 text-sm"

const ROUNDED: Record<FloatingTooltipRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
}

const VARIANT: Record<FloatingTooltipVariant, string> = {
  default: "bg-(--hx-primary) text-(--hx-primary-foreground)",
  outline: "border border-(--hx-border) bg-(--hx-background) text-(--hx-foreground) in-data-accent:border-(--hx-primary) in-data-accent:text-(--hx-primary)",
}

// Space kept clear at the screen edges, px
const EDGE = 8

// A tap keeps the tooltip open this long: a finger has no hover to end, so it goes by itself
const TOUCH_HOLD = 2500

// A touch fade is slower and softer than a hover's, and the next tooltip waits for the old one to finish
const TOUCH_IN = { duration: 0.45, ease: [0.45, 0, 0.25, 1] } as const
const TOUCH_OUT = { duration: 0.25, ease: [0.45, 0, 0.55, 1] } as const
const TOUCH_SWITCH = 280

type Payload = {
  key: string
  content: React.ReactNode
  description?: React.ReactNode
  contentClassName?: string
  descriptionClassName?: string
}

type Show = (
  payload: Payload,
  anchor: HTMLElement,
  source: "pointer" | "focus" | "touch",
  point?: { x: number; y: number }
) => void

type Controller = {
  show: Show
  move: (point: { x: number; y: number }) => void
  /** Pass the trigger's key so it can only close its own tooltip. */
  hide: (key?: string) => void
  activeKey: string | null
  tooltipId: string
}

const OptionsContext = React.createContext<FloatingTooltipOptions | null>(null)
const ControllerContext = React.createContext<Controller | null>(null)

function useOptions() {
  const value = React.useContext(OptionsContext)
  if (!value) throw new Error("FloatingTooltip must be used inside <FloatingTooltipProvider>.")
  return value
}

function useController() {
  const value = React.useContext(ControllerContext)
  if (!value) throw new Error("FloatingTooltip must be used inside <FloatingTooltipProvider>.")
  return value
}

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

// With reduced motion on, every move lands instantly. Otherwise the transition is unchanged.
function useMotionOk(transition: Transition): Transition {
  return useReduceMotion() ? { duration: 0 } : transition
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function FloatingTooltipProvider({
  children,
  variant = "default",
  rounded = "md",
  follow = "cursor",
  side = "top",
  sideOffset = "4",
  appearAnimation = "scale",
  changeAnimation = "instant",
  stretchOnMove = true,
  tiltOnMove = true,
  elastic = true,
  stiffness = 750,
  closeDelay = 0.1,
  duration = 0.35,
  bounce = 0.1,
}: { children: React.ReactNode } & Partial<FloatingTooltipOptions>) {
  const options = React.useMemo(
    () => ({
      variant, rounded, follow, side, sideOffset, appearAnimation, changeAnimation, stretchOnMove, tiltOnMove,
      elastic, stiffness, closeDelay, duration, bounce,
    }),
    [variant, rounded, follow, side, sideOffset, appearAnimation, changeAnimation, stretchOnMove, tiltOnMove, elastic, stiffness, closeDelay, duration, bounce]
  )

  const reduceMotion = useReduceMotion()
  const tooltipId = React.useId()
  // The tooltip is portalled to <body>, which only exists on the client
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const [open, setOpen] = React.useState(false)
  const [payload, setPayload] = React.useState<Payload | null>(null)
  // 1 when the new trigger is further right (or lower), -1 when further left (or higher)
  const [direction, setDirection] = React.useState(1)
  // A tap, not a hover: no gliding, no sliding, just a fade
  const [touch, setTouch] = React.useState(false)
  // False from opening until it has been placed, so it never fades in somewhere else first
  const [placed, setPlaced] = React.useState(false)
  const placedRef = React.useRef(false)
  const lastSpot = React.useRef({ x: 0, y: 0 })

  const anchorEl = React.useRef<HTMLElement | null>(null)
  const source = React.useRef<"pointer" | "focus" | "touch">("pointer")
  const cursor = React.useRef({ x: 0, y: 0 })
  const size$ = React.useRef({ w: 0, h: 0 })
  const shell = React.useRef<HTMLDivElement>(null)
  const opening = React.useRef(false)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const touchTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const switchTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const optionsRef = React.useRef(options)
  const openRef = React.useRef(open)
  const keyRef = React.useRef<string | null>(null)
  const reduceRef = React.useRef(reduceMotion)

  React.useEffect(() => {
    optionsRef.current = options
    openRef.current = open
    reduceRef.current = reduceMotion
  })

  // Where the tooltip should be (target), and where it is now (spring towards it). The follow
  // spring keeps its velocity as the target moves with the pointer, so it never overshoots wildly.
  const tx = useMotionValue(0)
  const ty = useMotionValue(0)
  // Bounce sets the damping ratio; without elastic it is critical, so no overshoot
  const springDamping = 2 * Math.sqrt(stiffness) * (elastic ? 1 - bounce : 1)
  const sx = useSpring(tx, { stiffness, damping: springDamping })
  const sy = useSpring(ty, { stiffness, damping: springDamping })
  // \`place\` reads the values the tooltip is drawn with, never ones from a discarded dev render.
  const position = React.useRef({ tx, ty, sx, sy })
  React.useLayoutEffect(() => {
    position.current = { tx, ty, sx, sy }
  })

  const place = React.useCallback(
    (jump = false) => {
      const { tx, ty, sx, sy } = position.current
      const o = optionsRef.current
      const { w, h } = size$.current
      const gap = Number(o.sideOffset) * 4
      const vw = window.innerWidth
      const vh = window.innerHeight
      let x = 0
      let y = 0

      // What the tooltip sits beside: the cursor (a single point) or the whole element
      let target: { left: number; right: number; top: number; bottom: number } | null = null
      if (o.follow === "cursor" && source.current === "pointer") {
        const { x: cx, y: cy } = cursor.current
        target = { left: cx, right: cx, top: cy, bottom: cy }
      } else if (anchorEl.current) {
        target = anchorEl.current.getBoundingClientRect()
      }

      if (target) {
        const r = target
        const cx = (r.left + r.right) / 2
        const cy = (r.top + r.bottom) / 2
        // Flip to the opposite side rather than run off the screen
        let side = o.side
        if (side === "top" && r.top - gap - h < EDGE) side = "bottom"
        else if (side === "bottom" && r.bottom + gap + h > vh - EDGE) side = "top"
        else if (side === "left" && r.left - gap - w < EDGE) side = "right"
        else if (side === "right" && r.right + gap + w > vw - EDGE) side = "left"
        // Centred on the hover point along the edge it sits against
        if (side === "top") [x, y] = [cx - w / 2, r.top - gap - h]
        if (side === "bottom") [x, y] = [cx - w / 2, r.bottom + gap]
        if (side === "left") [x, y] = [r.left - gap - w, cy - h / 2]
        if (side === "right") [x, y] = [r.right + gap, cy - h / 2]
      }

      x = clamp(x, EDGE, Math.max(EDGE, vw - w - EDGE))
      y = clamp(y, EDGE, Math.max(EDGE, vh - h - EDGE))
      lastSpot.current = { x, y }
      tx.set(x)
      ty.set(y)
      // Until it has been shown in place, every placement snaps: it only glides once visible.
      if (jump || !placedRef.current || reduceRef.current || source.current === "touch") {
        sx.jump(x)
        sy.jump(y)
        if (!placedRef.current) {
          // Mounting the tooltip (twice in dev) resets it to where it was at render, so snap to
          // the latest spot again just before the first paint, then let it fade in there.
          requestAnimationFrame(() => {
            if (placedRef.current) return
            sx.jump(lastSpot.current.x)
            sy.jump(lastSpot.current.y)
            placedRef.current = true
            setPlaced(true)
          })
        }
      }
    },
    []
  )

  const show = React.useCallback<Show>(
    (next, anchor, from, point) => {
      clearTimeout(closeTimer.current)
      clearTimeout(touchTimer.current)
      clearTimeout(switchTimer.current)
      if (point) cursor.current = point

      const reveal = () => {
        // Which way the tooltip travelled, from where the two triggers sit
        if (openRef.current && anchorEl.current && anchorEl.current !== anchor) {
          const a = anchorEl.current.getBoundingClientRect()
          const b = anchor.getBoundingClientRect()
          const dx = b.left + b.width / 2 - (a.left + a.width / 2)
          const dy = b.top + b.height / 2 - (a.top + a.height / 2)
          setDirection((Math.abs(dx) >= Math.abs(dy) ? dx : dy) >= 0 ? 1 : -1)
        }
        anchorEl.current = anchor
        keyRef.current = next.key
        source.current = from
        setTouch(from === "touch")
        opening.current = !openRef.current
        if (!openRef.current) {
          placedRef.current = false
          setPlaced(false)
        }
        setPayload(next)
        setOpen(true)
        // Opening fresh, it's placed once it has been measured (before the first paint); placing
        // it now with an old or empty size started a glide from the wrong spot.
        if (openRef.current) place()
        // A finger has no hover to end, so a tap keeps it open for a while, then it goes
        if (from === "touch") {
          touchTimer.current = setTimeout(() => setOpen(false), TOUCH_HOLD)
        }
      }

      if (from === "touch" && openRef.current && anchorEl.current !== anchor) {
        // Tapping another element: fade out where it is, then fade in on the new one. No sliding.
        setOpen(false)
        switchTimer.current = setTimeout(reveal, reduceRef.current ? 0 : TOUCH_SWITCH)
      } else reveal()
    },
    [place]
  )

  const move = React.useCallback(
    (point: { x: number; y: number }) => {
      cursor.current = point
      if (openRef.current) place()
    },
    [place]
  )

  const hide = React.useCallback((key?: string) => {
    // The tooltip has moved on to another trigger (a tap can blur the old one after the new one opens)
    if (key && keyRef.current && key !== keyRef.current) return
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), optionsRef.current.closeDelay * 1000)
  }, [])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      clearTimeout(switchTimer.current)
      setOpen(false)
    }
    // Touching anywhere else, or scrolling, puts away a tooltip a tap opened
    const away = (e: Event) => {
      if (source.current !== "touch" || !openRef.current) return
      // Tapping any trigger is handled by that trigger, so it isn't a tap "elsewhere"
      if (e.type === "pointerdown" && (e.target as Element | null)?.closest?.("[data-floating-tooltip-trigger]")) return
      setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", away, true)
    window.addEventListener("scroll", away, true)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", away, true)
      window.removeEventListener("scroll", away, true)
      clearTimeout(closeTimer.current)
      clearTimeout(touchTimer.current)
      clearTimeout(switchTimer.current)
    }
  }, [])

  // Keep it placed as the box reshapes, and land it in the right spot the first time it opens.
  // Measured before the first paint: placing it with last time's (or no) size showed it off to
  // the side for a frame, then it jumped into place.
  React.useLayoutEffect(() => {
    const el = shell.current
    if (!el) return
    const measure = () => {
      size$.current = { w: el.offsetWidth, h: el.offsetHeight }
      // The text sizes itself a moment after mounting; until it has a size, the first
      // placement stays a jump rather than a glide from the wrong spot.
      if (!el.offsetWidth) return
      place(opening.current)
      opening.current = false
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [open, place])

  const controller = React.useMemo(
    () => ({ show, move, hide, activeKey: open ? (payload?.key ?? null) : null, tooltipId }),
    [show, move, hide, open, payload, tooltipId]
  )

  // Speed makes the box stretch and lean, like it has weight
  const vx = useVelocity(sx)
  const stretchOn = useMotionValue(0)
  const tiltOn = useMotionValue(0)
  React.useEffect(() => {
    stretchOn.set(elastic && stretchOnMove && !reduceMotion ? 1 : 0)
    tiltOn.set(elastic && tiltOnMove && !reduceMotion ? 1 : 0)
  }, [elastic, stretchOnMove, tiltOnMove, reduceMotion, stretchOn, tiltOn])
  const scaleX = useTransform(() => 1 + clamp(vx.get() / 1000, -1.5, 1.5) * 0.15 * stretchOn.get())
  const scaleY = useTransform(() => 1 - clamp(Math.abs(vx.get()) / 1000, 0, 1.5) * 0.06 * stretchOn.get())
  const skewX = useTransform(() => clamp(vx.get() / 1000, -1.5, 1.5) * 3 * tiltOn.get())

  // On a touch screen it only fades in and out
  const how = reduceMotion ? "none" : touch && appearAnimation === "scale" ? "fade" : appearAnimation
  const appearIn = how === "scale" ? { opacity: 0, scale: 0.9 } : { opacity: 0 }
  const appearOut = how === "scale" ? { opacity: 0, scale: 0.8 } : { opacity: 0 }
  const enter: Transition =
    how === "none" ? { duration: 0 } : touch ? TOUCH_IN : { duration: 0.12, ease: "easeOut" }
  const exit: Transition =
    how === "none" ? { duration: 0 } : touch ? TOUCH_OUT : { duration: 0.12, ease: "easeIn" }

  return (
    <OptionsContext.Provider value={options}>
      <ControllerContext.Provider value={controller}>
        {children}
        {mounted &&
          createPortal(
            <ThemeScope><ReducedMotionConfig>
              <AnimatePresence>
                {open && payload && (
                  <motion.div
                    key="floating-tooltip"
                    ref={shell}
                    id={tooltipId}
                    role="tooltip"
                    data-slot="floating-tooltip"
                    className="pointer-events-none fixed top-0 left-0 z-50 w-max"
                    style={{ x: sx, y: sy }}
                    initial={appearIn}
                    animate={placed ? { opacity: 1, scale: 1, transition: enter } : appearIn}
                    exit={{ ...appearOut, transition: exit }}
                  >
                    <motion.div
                      className={cn(
                        "w-max font-medium",
                        VARIANT[variant],
                        ROUNDED[rounded],
                        changeAnimation !== "instant" && !touch && "overflow-hidden"
                      )}
                      style={{
                        scaleX,
                        scaleY,
                        skewX,
                        // Grow from the corner nearest the cursor
                        transformOrigin: follow === "cursor" ? "0% 0%" : "50% 50%",
                      }}
                    >
                      <Body payload={payload} direction={direction} touch={touch} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </ReducedMotionConfig></ThemeScope>,
            document.body
          )}
      </ControllerContext.Provider>
    </OptionsContext.Provider>
  )
}

function Text({ payload }: { payload: Payload }) {
  return (
    // Long text wraps at a comfortable width instead of stretching the tooltip across the screen
    <div className={cn("max-w-xs", TEXT_SIZE)}>
      <div className={payload.contentClassName}>{payload.content}</div>
      {payload.description && (
        <div className={cn("mt-1 font-normal opacity-70", payload.descriptionClassName)}>
          {payload.description}
        </div>
      )}
    </div>
  )
}

function Body({ payload, direction, touch }: { payload: Payload; direction: number; touch: boolean }) {
  const { changeAnimation } = useOptions()
  // A tap only fades the text out and in: no reshaping, no sliding, whatever the setting
  if (touch) return <FadeOnly payload={payload} />
  if (changeAnimation === "instant") return <Text payload={payload} />
  return <Morph payload={payload} direction={direction} mode={changeAnimation} />
}

// The old text fades out, then the new text fades in. The box just becomes the new size.
function FadeOnly({ payload }: { payload: Payload }) {
  const fade = useMotionOk(TOUCH_IN)
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={payload.key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={fade}
      >
        <Text payload={payload} />
      </motion.div>
    </AnimatePresence>
  )
}

// The box stays put and reshapes to fit the new text, which slides (or fades) in
function Morph({
  payload,
  direction,
  mode,
}: {
  payload: Payload
  direction: number
  mode: FloatingTooltipChange
}) {
  const { duration, bounce } = useOptions()
  const reduceMotion = useReduceMotion()
  const reshape = useMotionOk({ type: "spring", duration, bounce })
  const width = useMotionValue(0)
  const height = useMotionValue(0)
  const placed = React.useRef(false)
  const box = React.useRef<HTMLDivElement>(null)

  const onSize = React.useCallback(
    (w: number, h: number) => {
      if (!placed.current || reduceMotion) {
        placed.current = true
        width.jump(w)
        height.jump(h)
        return
      }
      animate(width, w, reshape)
      animate(height, h, reshape)
    },
    [width, height, reshape, reduceMotion]
  )

  // Motion writes the size on its next frame. Write the first one now (the text has measured by
  // this point), so the tooltip knows its real size before the first paint and opens in place.
  React.useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    el.style.width = `${width.get()}px`
    el.style.height = `${height.get()}px`
  }, [width, height])

  const slide = mode === "slide" && !reduceMotion
  const roll = mode === "roll" && !reduceMotion
  const shift = (d: number) => (slide ? `${d * 100}%` : 0)
  const variants: Variants = {
    enter: (d: number) => ({ opacity: 0, x: shift(d), y: roll ? `${d * 100}%` : "0%" }),
    center: { opacity: 1, x: 0, y: "0%" },
    exit: (d: number) => ({ opacity: 0, x: shift(-d), y: roll ? `${-d * 100}%` : "0%" }),
  }

  return (
    <motion.div ref={box} className="relative" style={{ width, height }}>
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <Measured key={payload.key} onSize={onSize} variants={variants} direction={direction} transition={reshape}>
          <Text payload={payload} />
        </Measured>
      </AnimatePresence>
    </motion.div>
  )
}

function Measured({
  onSize,
  variants,
  direction,
  transition,
  children,
}: {
  onSize: (w: number, h: number) => void
  variants: Variants
  direction: number
  transition: Transition
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isPresent = useIsPresent()

  // Only the block that is showing sizes the box, and it re-measures when it comes back
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el || !isPresent) return
    onSize(el.offsetWidth, el.offsetHeight)
    const observer = new ResizeObserver(() => onSize(el.offsetWidth, el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [onSize, isPresent])

  return (
    <motion.div
      ref={ref}
      className="absolute top-0 left-0 w-max"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
    >
      {children}
    </motion.div>
  )
}

/** Wrap one element. Hovering or focusing it shows the shared tooltip with this content. */
function FloatingTooltip({
  content,
  description,
  contentClassName,
  descriptionClassName,
  disabled,
  children,
}: {
  content: React.ReactNode
  description?: React.ReactNode
  contentClassName?: string
  descriptionClassName?: string
  disabled?: boolean
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>
}) {
  const controller = useController()
  const key = React.useId()
  const child = children.props

  const payload = (): Payload => ({ key, content, description, contentClassName, descriptionClassName })
  const active = controller.activeKey === key

  return React.cloneElement(children, {
    "data-floating-tooltip-trigger": "",
    "aria-describedby": active ? controller.tooltipId : child["aria-describedby"],
    // A tap is the touch version of hovering: show it on the element, since there is no cursor to follow
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      child.onPointerDown?.(e)
      if (disabled || e.pointerType !== "touch") return
      controller.show(payload(), e.currentTarget, "touch")
    },
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
      child.onPointerEnter?.(e)
      if (disabled || e.pointerType === "touch") return
      controller.show(payload(), e.currentTarget, "pointer", { x: e.clientX, y: e.clientY })
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      child.onPointerMove?.(e)
      if (disabled || e.pointerType === "touch") return
      controller.move({ x: e.clientX, y: e.clientY })
    },
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
      child.onPointerLeave?.(e)
      // Lifting a finger ends the touch, but the tooltip should outlast it
      if (e.pointerType === "touch") return
      controller.hide(key)
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      child.onFocus?.(e)
      // Only keyboard focus, so clicking a button doesn't leave a tooltip behind
      if (disabled || !e.currentTarget.matches(":focus-visible")) return
      controller.show(payload(), e.currentTarget, "focus")
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      child.onBlur?.(e)
      controller.hide(key)
    },
  } as React.HTMLAttributes<HTMLElement>)
}

// ---- demo: tooltip-demo.tsx ----

// Short and long text, so the box visibly reshapes as you move along
const actions = [
  { label: "Share", Icon: Share2, content: "Share link", description: "Copy a shareable link to clipboard." },
  { label: "Edit", Icon: Pencil, content: "Edit", description: "Open in the inline editor." },
  {
    label: "Duplicate",
    Icon: Copy,
    content: "Duplicate this document",
    description: "Creates an exact copy in this folder.",
  },
  { label: "Archive", Icon: Archive, content: "Archive", description: "Move to archive. Reversible at any time." },
  { label: "Delete", Icon: Trash2, content: "Delete permanently", description: "This action cannot be undone." },
]

const rounded = [
  { label: "None", value: "none" },
  { label: "sm", value: "sm" },
  { label: "md", value: "md" },
  { label: "lg", value: "lg" },
  { label: "xl", value: "xl" },
  { label: "Full", value: "full" },
]

const controls = {
  variant: {
    group: "Look",
    type: "select",
    label: "Style",
    value: "default",
    options: [
      { label: "Filled", value: "default" },
      { label: "Outline", value: "outline" },
    ],
  },
  rounded: { group: "Look", type: "select", label: "Roundness", value: "md", options: rounded },

  follow: {
    group: "Position",
    type: "select",
    label: "Position",
    value: "anchor",
    options: [
      { label: "Trails the cursor", value: "cursor" },
      { label: "Sits on the element", value: "anchor" },
    ],
  },
  side: {
    group: "Position",
    type: "select",
    label: "Side",
    value: "top",
    options: [
      { label: "Top", value: "top" },
      { label: "Bottom", value: "bottom" },
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ],
  },
  sideOffset: {
    group: "Position",
    type: "select",
    label: "Side offset",
    value: "4",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "6", value: "6" },
      { label: "8", value: "8" },
    ],
  },

  changeAnimation: {
    group: "Moving between",
    type: "select",
    label: "Change animation",
    value: "slide",
    options: [
      { label: "Swap text", value: "instant" },
      { label: "Morph and fade", value: "fade" },
      { label: "Morph and slide", value: "slide" },
      { label: "Morph and roll", value: "roll" },
    ],
  },
  duration: {
    group: "Moving between",
    type: "slider",
    label: "Duration",
    value: 0.35,
    min: 0.1,
    max: 1,
    step: 0.05,
    unit: "s",
  },

  elastic: { group: "Feel", type: "checkbox", label: "Elastic", value: true },
  bounce: {
    disabled: (v: Record<string, unknown>) => !v.elastic && v.changeAnimation === "instant",
    group: "Feel",
    type: "slider",
    label: "Bounce",
    value: 0.1,
    min: 0,
    max: 0.6,
    step: 0.05,
  },
  stretchOnMove: { disabled: (v: Record<string, unknown>) => !v.elastic, group: "Feel", type: "checkbox", label: "Stretch on move", value: true },
  tiltOnMove: { disabled: (v: Record<string, unknown>) => !v.elastic, group: "Feel", type: "checkbox", label: "Tilt on move", value: true },
  stiffness: {
    group: "Feel",
    type: "slider",
    label: "Follow speed",
    value: 750,
    min: 100,
    max: 1500,
    step: 50,
  },

  appearAnimation: {
    group: "Show and hide",
    type: "select",
    label: "Appear animation",
    value: "scale",
    options: [
      { label: "Scale + fade", value: "scale" },
      { label: "Fade", value: "fade" },
      { label: "Nothing", value: "none" },
    ],
  },
  closeDelay: {
    group: "Show and hide",
    type: "slider",
    label: "Close delay",
    value: 0.1,
    min: 0,
    max: 0.6,
    step: 0.05,
    unit: "s",
  },
}

function TooltipDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-64 items-center justify-center px-4 py-8">
        <FloatingTooltipProvider
          variant={values.variant as FloatingTooltipVariant}
          rounded={values.rounded as FloatingTooltipRounded}
          follow={values.follow as FloatingTooltipFollow}
          side={values.side as FloatingTooltipSide}
          sideOffset={values.sideOffset as FloatingTooltipOffset}
          changeAnimation={values.changeAnimation as FloatingTooltipChange}
          duration={values.duration}
          bounce={values.bounce}
          elastic={values.elastic}
          stretchOnMove={values.stretchOnMove}
          tiltOnMove={values.tiltOnMove}
          stiffness={values.stiffness}
          appearAnimation={values.appearAnimation as FloatingTooltipAppear}
          closeDelay={values.closeDelay}
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            {actions.map(({ label, Icon, content, description }) => (
              <FloatingTooltip key={label} content={content} description={description}>
                <button className="flex items-center gap-2 rounded-md border bg-(--hx-background) px-5 py-3 text-base font-medium hover:bg-(--hx-accent) focus-visible:ring-2 focus-visible:ring-(--hx-ring) focus-visible:outline-none">
                  <Icon className="size-4" />
                  <span>{label}</span>
                </button>
              </FloatingTooltip>
            ))}
          </div>
        </FloatingTooltipProvider>
      </div>
      <p className="text-center text-sm text-(--hx-muted-foreground) max-lg:hidden">
        Tip: move the pointer across the buttons (on a touch screen, tap one). Set &quot;Change animation&quot; to a Morph option to see one tooltip
        stay put while its box reshapes and the text slides, fades or rolls the way you moved.
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

export interface AnimatedTooltipProps extends Partial<ControlValues> {
  theme?: AnimatedTooltipTheme;
  mode?: AnimatedTooltipMode;
  className?: string;
}

export default function AnimatedTooltip({ theme = "valorant", mode = "dark", className, ...props }: AnimatedTooltipProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <ReducedMotionConfig>
        <div {...themed} className={cn("w-full text-(--hx-foreground) motion-reduce:transition-none motion-reduce:**:transition-none [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
          <TooltipDemo {...props} />
        </div>
      </ReducedMotionConfig>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  FloatingTooltip,
  FloatingTooltipProvider,
  type FloatingTooltipAppear,
  type FloatingTooltipChange,
  type FloatingTooltipFollow,
  type FloatingTooltipOffset,
  type FloatingTooltipRounded,
  type FloatingTooltipSide,
  type FloatingTooltipVariant,
};
