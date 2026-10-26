// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { AnimatePresence, motion, MotionConfig, stagger, type HTMLMotionProps, type TargetAndTransition, type Variants, animate } from "motion/react";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { CherryIcon, CitrusIcon, CopyIcon, FileIcon, FilePlusIcon, FileTextIcon, FlameIcon, FolderOpenIcon, HeartIcon, LeafIcon, MoonIcon, MountainIcon, PencilIcon, PrinterIcon, RedoIcon, ShareIcon, SparklesIcon, TableIcon, Trash2Icon, UndoIcon } from "lucide-react";
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

// Read here, not through motion's hook, so the demo's reduced-motion switch is honoured too
function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduceMotion(mq.matches);
    read();
    mq.addEventListener?.("change", read);
    return () => mq.removeEventListener?.("change", read);
  }, []);
  return reduceMotion;
}

// Always/never instead of "user", so the demo's reduced-motion switch is honoured too
function ReducedMotionConfig({ children }: { children: React.ReactNode }) {
  const reduce = useReduceMotion()
  return <MotionConfig reducedMotion={reduce ? "always" : "never"}>{children}</MotionConfig>
}

export type AnimatedMenubarTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedMenubarMode = "light" | "dark";

const THEMES: Record<`${AnimatedMenubarTheme}:${AnimatedMenubarMode}`, Record<string, string>> = {
  "default:light": {
    "accent-foreground": "oklch(0.205 0 0)",
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "destructive": "oklch(0.577 0.245 27.325)",
    "foreground": "oklch(0.145 0 0)",
    "muted": "oklch(0.92 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    "popover": "oklch(1 0 0)",
    "popover-foreground": "oklch(0.145 0 0)",
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
    "popover": "oklch(0.205 0 0)",
    "popover-foreground": "oklch(0.985 0 0)",
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
    "popover": "#fcfcfc",
    "popover-foreground": "#202020",
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
    "popover": "#191919",
    "popover-foreground": "#eeeeee",
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
    "popover": "#ffffff",
    "popover-foreground": "#28261b",
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
    "popover": "#30302e",
    "popover-foreground": "#e5e5e2",
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
    "popover": "#f8f2e2",
    "popover-foreground": "#4a4436",
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
    "popover": "#27342f",
    "popover-foreground": "#e6e0cc",
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
    "popover": "#ffffff",
    "popover-foreground": "#191414",
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
    "popover": "#282828",
    "popover-foreground": "#ffffff",
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
    "popover": "#f5f2ec",
    "popover-foreground": "#0f1923",
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
    "popover": "#1f2326",
    "popover-foreground": "#ece8e1",
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
    "popover": "#f8f8f8",
    "popover-foreground": "#3b3b3b",
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
    "popover": "#252526",
    "popover-foreground": "#cccccc",
    "primary": "#0e639c",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedMenubarTheme = "default", mode: AnimatedMenubarMode = "dark") {
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

// ---- dropdown-menu.tsx ----

const smoothEase = [0.22, 1, 0.36, 1] as const
const easeOutCubic = [0.33, 1, 0.68, 1] as const
/** A long, gentle deceleration for panel movement. */
const glideEase = [0.32, 0.72, 0, 1] as const

/** Scale an item shrinks to while pressed. */
const ITEM_PRESS_SCALE = 0.99

/** How long the tick stays visible before the menu closes, with `delayCloseOnSelect`. */
const SELECT_CLOSE_DELAY_MS = 320

type Transition = NonNullable<HTMLMotionProps<"div">["transition"]>

type DropdownMenuAnimation = "collapse" | "scale" | "slide" | "reveal" | "morph"
type DropdownMenuIndicator = "check" | "dot" | "bar"
type DropdownMenuHighlight = "slide" | "fill" | "none"
type DropdownMenuHighlightColor = "primary" | "muted"

type MotionPreset = {
  enter: Transition
  exit: Transition
  item: Transition
  glide: Transition
  icon: Transition
  /** Length of one icon phase, in seconds. */
  iconDuration: number
  exitDuration: number
}

function buildPreset({
  duration: wanted,
  exitFast,
  reduceMotion,
}: {
  duration: number
  exitFast: boolean
  reduceMotion: boolean
}): MotionPreset {
  // Reduced motion: every change lands at once
  const duration = reduceMotion ? 0 : wanted
  const exitDuration = exitFast ? duration * 0.6 : duration
  return {
    enter: { duration, ease: smoothEase },
    exit: { duration: exitDuration, ease: smoothEase },
    item: { duration, ease: smoothEase },
    glide: { duration: duration * 0.6, ease: smoothEase },
    icon: { duration, ease: smoothEase },
    exitDuration,
    iconDuration: duration,
  }
}

type DropdownMenuContextValue = {
  id: string
  open: boolean
  close: () => void
  onExitComplete: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  /** The morph panel while it is mounted; it shares the trigger's box, so presses scale it too. */
  morphPanelRef: React.RefObject<HTMLElement | null>
  preset: MotionPreset
  /** Reduced motion: nothing slides, fades, rolls, draws or staggers. */
  reduceMotion: boolean
  animation: DropdownMenuAnimation
  stagger: number
  delay: number
  exitFast: boolean
  itemHighlight: DropdownMenuHighlight
  itemHighlightColor: DropdownMenuHighlightColor
  selectionIndicator: DropdownMenuIndicator
  rollingText: boolean
  closeDelayOnSelect: boolean
  pressFeedback: boolean
  showDescriptions: boolean
  bold: boolean
  typeahead: boolean
  /**
   * The item the sliding highlight sits on. It moves when another item is highlighted and only
   * clears when the pointer leaves the panel or the menu closes, so crossing the gap between two
   * items (or a separator) doesn't drop the pill for a frame and pop it back.
   */
  activeItem: string | null
  setActiveItem: (item: string | null) => void
  /**
   * Clears the pill after a short grace period, cancelled if another item takes it first. The
   * pointer can briefly "leave" a panel without meaning to — Base UI lays an invisible hover
   * guard over it while a submenu is open — and an instant clear would flicker the pill.
   */
  releaseActiveItem: () => void
}

/** How long the pill waits after the pointer leaves before it goes, in ms. */
const PILL_RELEASE_MS = 150

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error("Dropdown menu parts must be used within <DropdownMenu>.")
  return context
}

/** Whether the item the current element sits in is highlighted (hovered or focused). */
const ItemHighlightContext = React.createContext(false)

function DropdownMenu({
  duration = 0.35,
  stagger = 0.05,
  delay = 0.1,
  exitFast = false,
  animation = "collapse",
  itemHighlight = "slide",
  itemHighlightColor = "primary",
  selectionIndicator = "check",
  rollingText = false,
  closeDelayOnSelect = false,
  pressFeedback = true,
  showDescriptions = false,
  bold = false,
  typeahead = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: Omit<MenuPrimitive.Root.Props, "actionsRef"> & {
  /** Open duration, in seconds. */
  duration?: number
  /** Gap between items appearing, in seconds. */
  stagger?: number
  /** Wait before items start appearing, in seconds. */
  delay?: number
  /** Close in 60% of the open time, without staggering items out. */
  exitFast?: boolean
  /** How the panel opens and closes. */
  animation?: DropdownMenuAnimation
  /**
   * How the hovered item is highlighted: `slide` glides one highlight between items,
   * `fill` fills each item with the primary colour from the top down.
   */
  itemHighlight?: DropdownMenuHighlight
  /** The hovered item's fill: the primary colour, or the quieter muted one. */
  itemHighlightColor?: DropdownMenuHighlightColor
  /** How the chosen radio item is marked. */
  selectionIndicator?: DropdownMenuIndicator
  /** Item titles roll to a copy of themselves when highlighted. */
  rollingText?: boolean
  /** Show the tick for a moment after a pick before closing. */
  closeDelayOnSelect?: boolean
  /** The trigger and items scale down while pressed and spring back on release. */
  pressFeedback?: boolean
  /** Show each item's `DropdownMenuItemDescription`. */
  showDescriptions?: boolean
  /** Bold item titles and the trigger value. */
  bold?: boolean
  /** Typing a letter jumps to the matching item. */
  typeahead?: boolean
}) {
  const id = React.useId()
  const [openState, setOpenState] = React.useState(defaultOpen)
  const [activeItem, setActiveItemState] = React.useState<string | null>(null)
  const releaseTimer = React.useRef(0)
  const setActiveItem = React.useCallback((item: string | null) => {
    window.clearTimeout(releaseTimer.current)
    setActiveItemState(item)
  }, [])
  const releaseActiveItem = React.useCallback(() => {
    window.clearTimeout(releaseTimer.current)
    releaseTimer.current = window.setTimeout(() => setActiveItemState(null), PILL_RELEASE_MS)
  }, [])
  React.useEffect(() => () => window.clearTimeout(releaseTimer.current), [])
  const open = openProp ?? openState
  const actionsRef = React.useRef<MenuPrimitive.Root.Actions>(null)
  const triggerRef = React.useRef<HTMLElement>(null)
  const morphPanelRef = React.useRef<HTMLElement>(null)

  const reduceMotion = useReduceMotion()
  const preset = React.useMemo(
    () => buildPreset({ duration, exitFast, reduceMotion }),
    [duration, exitFast, reduceMotion]
  )

  const close = React.useCallback(() => actionsRef.current?.close(), [])
  const onExitComplete = React.useCallback(() => actionsRef.current?.unmount(), [])

  const context = React.useMemo<DropdownMenuContextValue>(
    () => ({
      id,
      open,
      close,
      onExitComplete,
      triggerRef,
      morphPanelRef,
      preset,
      reduceMotion,
      animation,
      stagger,
      delay,
      exitFast,
      itemHighlight,
      itemHighlightColor,
      selectionIndicator,
      rollingText,
      closeDelayOnSelect,
      pressFeedback,
      showDescriptions,
      bold,
      typeahead,
      activeItem,
      setActiveItem,
      releaseActiveItem,
    }),
    [
      id,
      open,
      close,
      onExitComplete,
      preset,
      reduceMotion,
      animation,
      stagger,
      delay,
      exitFast,
      itemHighlight,
      itemHighlightColor,
      selectionIndicator,
      rollingText,
      closeDelayOnSelect,
      pressFeedback,
      showDescriptions,
      bold,
      typeahead,
      activeItem,
      setActiveItem,
      releaseActiveItem,
    ]
  )

  return (
    <DropdownMenuContext.Provider value={context}>
      <ReducedMotionConfig>
        <MenuPrimitive.Root
          data-slot="dropdown-menu"
          open={open}
          onOpenChange={(next, details) => {
            // Keep the popup mounted so Motion can play the exit, then unmount in `onExitComplete`.
            if (!next) {
              details.preventUnmountOnClose()
              setActiveItem(null)
            }
            setOpenState(next)
            onOpenChange?.(next, details)
          }}
          actionsRef={actionsRef}
          {...props}
        >
          {children}
        </MenuPrimitive.Root>
      </ReducedMotionConfig>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

const TriggerContext = React.createContext({ rollingValue: true })

type PressState = "rest" | "hover" | "press"

const TRIGGER_SCALE: Record<PressState, number> = { rest: 1, hover: 0.98, press: 0.96 }

const PRESS_TIMING: Record<PressState, KeyframeAnimationOptions> = {
  rest: { duration: 400, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  hover: { duration: 250, easing: "ease-out" },
  press: { duration: 120, easing: "ease-out" },
}

function DropdownMenuTrigger({
  rollingValue = true,
  ref,
  onPointerEnter,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  ...props
}: MenuPrimitive.Trigger.Props & {
  /** `DropdownMenuValue` rolls to the new value when it changes. */
  rollingValue?: boolean
}) {
  const { triggerRef, morphPanelRef, pressFeedback } = useDropdownMenu()
  const pressAnimations = React.useRef<Animation[]>([])
  const pressState = React.useRef<PressState>("rest")
  const hovered = React.useRef(false)

  // Hover eases the trigger down a little, a press takes it further, and leaving springs it back.
  // Runs whether the press opens the menu or closes it.
  // Web Animations rather than a class or inline style: the trigger's CSS `transition-all`
  // would otherwise smear every frame, and this picks up from wherever the last one left off.
  const setPress = (state: PressState) => {
    const trigger = triggerRef.current
    if (!pressFeedback || !trigger || state === pressState.current) return
    pressState.current = state
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // An open morph has grown the trigger around its items, drawn by the panel on top. Both
    // share one box and one centre, so the same scale keeps them lined up.
    const targets = [trigger, morphPanelRef.current].filter((el): el is HTMLElement => !!el)
    const froms = targets.map((el) => getComputedStyle(el).transform)
    pressAnimations.current.forEach((animation) => animation.cancel())
    pressAnimations.current = targets.map((el, i) => {
      const animation = el.animate(
        [
          { transform: froms[i] === "none" ? "scale(1)" : froms[i] },
          { transform: `scale(${TRIGGER_SCALE[state]})` },
        ],
        { ...PRESS_TIMING[state], fill: "forwards" }
      )
      if (state === "rest") animation.onfinish = () => animation.cancel()
      return animation
    })
  }
  const release = () => setPress(hovered.current ? "hover" : "rest")

  return (
    <TriggerContext.Provider value={{ rollingValue }}>
      <MenuPrimitive.Trigger
        data-slot="dropdown-menu-trigger"
        ref={(node: HTMLElement | null) => {
          triggerRef.current = node
          if (typeof ref === "function") ref(node as HTMLButtonElement)
          else if (ref) ref.current = node as HTMLButtonElement
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event)
          if (event.pointerType !== "mouse") return
          hovered.current = true
          if (pressState.current === "rest") setPress("hover")
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event)
          if (event.button === 0) setPress("press")
        }}
        onPointerUp={(event) => {
          onPointerUp?.(event)
          release()
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event)
          hovered.current = false
          setPress("rest")
        }}
        onPointerCancel={(event) => {
          onPointerCancel?.(event)
          release()
        }}
        {...props}
      />
    </TriggerContext.Provider>
  )
}

function MorphChevron({
  open,
  duration = 0.35,
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "children"> & { open: boolean; duration?: number }) {
  const reduceMotion = useReduceMotion()
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

function panelVariants(context: DropdownMenuContextValue, side: string): Variants {
  const { animation, preset, exitFast } = context
  const vertical = side === "top" || side === "bottom"
  const away = side === "top" || side === "left" ? "0.5em" : "-0.5em"
  let open: TargetAndTransition
  let closed: TargetAndTransition
  let enter: Transition = preset.enter
  let exit: Transition = preset.exit

  switch (animation) {
    case "scale":
      open = { opacity: 1, scale: 1 }
      closed = { opacity: 0, scale: 0.95 }
      break
    case "reveal": {
      // The clip overhangs the panel by 16px so its ring and shadow aren't cut off.
      // Fully hidden is 100% plus that overhang, written as `- -16px` so both ends share a shape.
      const shown = "calc(0% - 16px)"
      const hidden = "calc(100% - -16px)"
      const clip = (top: string, bottom: string) => `inset(${top} -16px ${bottom} -16px)`
      open = { clipPath: clip(shown, shown) }
      closed = { clipPath: side === "top" ? clip(hidden, shown) : clip(shown, hidden) }
      break
    }
    case "collapse": {
      // Matches animate-ui's collapsible: height, fade and a 20px lift, eased in and out.
      const lift = side === "top" ? -20 : 20
      open = { height: "auto", opacity: 1, y: 0 }
      closed = { height: 0, opacity: 0, y: lift }
      enter = { duration: preset.iconDuration, ease: "easeInOut" }
      exit = { duration: preset.exitDuration, ease: "easeInOut" }
      break
    }
    default: {
      const d = preset.iconDuration
      open = { opacity: 1, x: 0, y: 0 }
      closed = { opacity: 0, [vertical ? "y" : "x"]: away }
      enter = { duration: d, ease: glideEase }
      enter = { ...enter, opacity: { duration: d * 0.6, ease: "easeOut" } }
      exit = {
        duration: preset.exitDuration,
        ease: glideEase,
        opacity: { duration: preset.exitDuration * 0.8, ease: "easeIn" },
      }
    }
  }

  const gap = context.reduceMotion ? 0 : context.stagger
  const wait = context.reduceMotion ? 0 : context.delay

  return {
    open: {
      ...open,
      transition: {
        ...enter,
        delayChildren: stagger(gap, { startDelay: wait }),
      },
    },
    closed: {
      ...closed,
      // Items leave in reverse alongside the panel, so closing takes as long as opening.
      // Exit fast drops the stagger along with the shorter duration.
      transition:
        exitFast || gap === 0
          ? exit
          : { ...exit, delayChildren: stagger(gap, { from: "last" }) },
    },
  }
}

function itemVariants(context: DropdownMenuContextValue): Variants {
  // Items only lift on their own when staggered; otherwise they would move against the panel.
  const lift = context.stagger > 0 && !context.reduceMotion ? "0.3em" : "0em"
  return {
    open: { opacity: 1, y: "0em", transition: context.preset.item },
    closed: {
      opacity: 0,
      y: lift,
      transition: { duration: context.preset.exitDuration, ease: smoothEase },
    },
  }
}

/** An element's bounding box with its CSS scale undone, around its centre. */
function unscaledRect(el: Element) {
  const rect = el.getBoundingClientRect()
  const transform = getComputedStyle(el).transform
  if (!transform || transform === "none") return rect
  const { a: scaleX, d: scaleY } = new DOMMatrix(transform)
  if (!scaleX || !scaleY || (scaleX === 1 && scaleY === 1)) return rect
  const width = rect.width / scaleX
  const height = rect.height / scaleY
  return new DOMRect(
    rect.x + rect.width / 2 - width / 2,
    rect.y + rect.height / 2 - height / 2,
    width,
    height
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  const context = useDropdownMenu()

  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-1.5 py-1 text-sm font-medium text-(--hx-muted-foreground) data-inset:pl-7",
        className
      )}
      render={<motion.div variants={itemVariants(context)} />}
      {...props}
    />
  )
}

/** Shared motion shell for menu items: stagger, press scale and the sliding highlight. */
function MotionItem({
  itemProps,
  highlighted,
  anchorsSubmenu = false,
  children,
}: {
  itemProps: React.HTMLAttributes<HTMLElement>
  highlighted: boolean
  /** A submenu is placed against this item, so it must not scale on hover or the submenu shifts. */
  anchorsSubmenu?: boolean
  children?: React.ReactNode
}) {
  const context = useDropdownMenu()
  const content = itemProps.children
  const itemId = React.useId()
  const { setActiveItem } = context
  // Highlighting an item (by pointer or keyboard) focuses it, so focus is where the pill moves.
  // Not once the menu is closing: closing hands focus back to the submenu's trigger, and the pill
  // would glide onto it behind the fading menu.
  const pillHere = context.itemHighlight === "slide" && context.open && context.activeItem === itemId

  return (
    <motion.div
      {...(itemProps as HTMLMotionProps<"div">)}
      data-pill={pillHere || undefined}
      onFocus={(event) => {
        itemProps.onFocus?.(event)
        setActiveItem(itemId)
      }}
      variants={itemVariants(context)}
      // Press feedback also plays on hover: the hovered item eases down to the press scale.
      whileHover={context.pressFeedback && !context.reduceMotion && !anchorsSubmenu ? { scale: ITEM_PRESS_SCALE } : undefined}
      whileTap={context.pressFeedback && !context.reduceMotion ? { scale: ITEM_PRESS_SCALE } : undefined}
    >
      {context.itemHighlight === "fill" && (
        <motion.span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-[inherit]",
            HIGHLIGHT_FILL[context.itemHighlightColor]
          )}
          style={{ originY: 0 }}
          initial={false}
          animate={{ scaleY: highlighted ? 1 : 0 }}
          transition={{ duration: context.reduceMotion ? 0 : 0.3, ease: easeOutCubic }}
        />
      )}
      {pillHere && (
        <motion.span
          aria-hidden
          layoutId={`${context.id}-highlight`}
          transition={context.preset.glide}
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-[inherit]",
            HIGHLIGHT_FILL[context.itemHighlightColor]
          )}
        />
      )}
      <ItemHighlightContext.Provider value={highlighted || pillHere}>
        {typeof content === "string" && context.rollingText ? <RollText>{content}</RollText> : content}
      </ItemHighlightContext.Provider>
      {children}
    </motion.div>
  )
}

const itemBase =
  "relative isolate flex cursor-default items-center gap-1.5 rounded-md text-base outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

/** The hovered item is always primary; Motion draws the background for `slide` and `fill`. */
const HIGHLIGHT_FILL: Record<DropdownMenuHighlightColor, string> = {
  primary: "bg-(--hx-primary)",
  muted: "bg-(--hx-muted)",
}

/**
 * The hovered item's text, which has to stay readable on its fill. With `slide` it follows the
 * pill (`data-pill`) rather than focus, since the pill stays put while the pointer crosses a gap.
 */
const HIGHLIGHT_TEXT: Record<"slide" | "other", Record<DropdownMenuHighlightColor, string>> = {
  slide: {
    primary:
      "transition-colors duration-300 data-pill:text-(--hx-primary-foreground) data-pill:**:text-(--hx-primary-foreground)",
    muted: "transition-colors duration-300 data-pill:text-(--hx-foreground) data-pill:**:text-(--hx-foreground)",
  },
  other: {
    primary:
      "transition-colors duration-300 focus:text-(--hx-primary-foreground) focus:**:text-(--hx-primary-foreground)",
    muted: "transition-colors duration-300 focus:text-(--hx-foreground) focus:**:text-(--hx-foreground)",
  },
}

/** Motion draws the fill for `slide` and `fill`; `none` is a plain CSS background. */
function highlightClasses(itemHighlight: DropdownMenuHighlight, color: DropdownMenuHighlightColor) {
  return cn(
    HIGHLIGHT_TEXT[itemHighlight === "slide" ? "slide" : "other"][color],
    itemHighlight === "none"
      ? color === "primary"
        ? "focus:bg-(--hx-primary)"
        : "focus:bg-(--hx-muted)"
      : "focus:bg-transparent"
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  const { itemHighlight, itemHighlightColor } = useDropdownMenu()

  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        itemBase,
        "group/dropdown-menu-item px-1.5 py-1 data-inset:pl-7 data-[variant=destructive]:text-(--hx-destructive) data-[variant=destructive]:focus:bg-(--hx-destructive)/10 data-[variant=destructive]:focus:text-(--hx-destructive) in-data-[theme=dark]:data-[variant=destructive]:focus:bg-(--hx-destructive)/20 data-[variant=destructive]:*:[svg]:text-(--hx-destructive)",
        highlightClasses(itemHighlight, itemHighlightColor),
        className
      )}
      render={(itemProps, state) => (
        <MotionItem itemProps={itemProps} highlighted={state.highlighted} />
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  const context = useDropdownMenu()

  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        itemBase,
        "group/dropdown-menu-item px-1.5 py-1 text-sm data-inset:pl-7",
        // While its submenu is open and the pill has moved into it, keep a quiet mark here. It goes
        // with the menu, at once, so it can't flash behind a closing menu.
        context.open && "data-popup-open:not-data-pill:bg-(--hx-muted)",
        highlightClasses(context.itemHighlight, context.itemHighlightColor),
        !context.open && "transition-none",
        className
      )}
      // Drawn by the same item as the rest, so the sliding pill glides onto it too.
      render={(itemProps, state) => (
        <MotionItem itemProps={itemProps} highlighted={state.highlighted} anchorsSubmenu>
          {/* The same chevron as the menu names, turned to point at the submenu. It stays
              put: the submenu opening beside it is signal enough. */}
          <span aria-hidden className="ml-auto flex -rotate-90">
            <MorphChevron open={false} />
          </span>
        </MotionItem>
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal><ThemeScope>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-sub-content"
          className={cn(
            "z-50 max-h-(--available-height) w-auto min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-(--hx-background) p-1 text-(--hx-foreground) shadow-lg ring-1 ring-[color-mix(in_oklch,var(--hx-foreground)_25%,transparent)] duration-100 outline-none data-[side=bottom]:data-starting-style:-translate-y-2 data-[side=left]:data-starting-style:translate-x-2 data-[side=right]:data-starting-style:-translate-x-2 data-[side=top]:data-starting-style:translate-y-2 transition-[opacity,scale,translate] duration-150 ease-out data-open:data-starting-style:opacity-0 data-open:data-starting-style:scale-95  data-closed:data-ending-style:opacity-0 data-closed:data-ending-style:scale-95",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </ThemeScope></MenuPrimitive.Portal>
  )
}

/** A tick that draws itself in when checked and fades out when unchecked. */
function DrawnCheck({ checked }: { checked: boolean }) {
  const reduceMotion = useReduceMotion()
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M4 12.5 L9.5 18 L20 6.5"
        initial={false}
        animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : checked
              ? { duration: 0.3, ease: smoothEase }
              : { duration: 0.15, ease: "easeOut" }
        }
      />
    </svg>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  const context = useDropdownMenu()

  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      data-indicator="check"
      className={cn(
        itemBase,
        // Room for the tick on the right; see the radio item for why it's keyed on an attribute.
        "py-1 pl-1.5 data-inset:pl-7 data-[indicator=check]:pr-8",
        highlightClasses(context.itemHighlight, context.itemHighlightColor),
        className
      )}
      render={(itemProps, state) => (
        <MotionItem itemProps={itemProps} highlighted={state.highlighted}>
          <span
            aria-hidden
            data-slot="dropdown-menu-checkbox-item-indicator"
            className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
          >
            <DrawnCheck checked={state.checked} />
          </span>
        </MotionItem>
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function RadioIndicator({ checked }: { checked: boolean }) {
  const { id, selectionIndicator, preset, reduceMotion } = useDropdownMenu()

  if (selectionIndicator === "bar") {
    return checked ? (
      <motion.span
        aria-hidden
        layoutId={`${id}-bar`}
        transition={preset.glide}
        className="pointer-events-none absolute inset-y-2 left-2 w-0.5 rounded-full bg-current"
      />
    ) : null
  }

  return (
    <span
      aria-hidden
      data-slot="dropdown-menu-radio-item-indicator"
      className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
    >
      {selectionIndicator === "dot" ? (
        <motion.span
          className="size-1.5 rounded-full bg-current"
          initial={false}
          animate={{ scale: checked ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : checked
                ? { type: "spring", visualDuration: 0.3, bounce: 0.5 }
                : { duration: 0.15, ease: "easeOut" }
          }
        />
      ) : (
        <DrawnCheck checked={checked} />
      )}
    </span>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  onClick,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  const context = useDropdownMenu()

  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      data-indicator={context.selectionIndicator}
      closeOnClick={!context.closeDelayOnSelect}
      onClick={(event) => {
        onClick?.(event)
        if (context.closeDelayOnSelect) window.setTimeout(context.close, SELECT_CLOSE_DELAY_MS)
      }}
      className={cn(
        itemBase,
        "py-1 pl-1.5 data-inset:pl-7",
        // Room for the indicator, keyed on an attribute so it outranks a plain `px-*` passed in
        // (the menubar sizes its items that way): a bar on the left, a tick or dot on the right.
        "data-[indicator=bar]:pl-6 not-data-[indicator=bar]:pr-8",
        highlightClasses(context.itemHighlight, context.itemHighlightColor),
        className
      )}
      render={(itemProps, state) => (
        <MotionItem itemProps={itemProps} highlighted={state.highlighted}>
          <RadioIndicator checked={state.checked} />
        </MotionItem>
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.RadioItem>
  )
}

/** Text that rolls up to a copy of itself while its item is highlighted. */
function RollText({ className, children }: { className?: string; children: React.ReactNode }) {
  const highlighted = React.useContext(ItemHighlightContext)
  const reduceMotion = useReduceMotion()
  const transition = { duration: reduceMotion ? 0 : 0.4, ease: easeOutCubic }

  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <motion.span
        className="block"
        initial={false}
        animate={{ y: highlighted ? "-100%" : "0%" }}
        transition={transition}
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 block"
        initial={false}
        animate={{ y: highlighted ? "0%" : "100%" }}
        transition={transition}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** An item's main line. Rolls on highlight when `textRoll` is on. */
function DropdownMenuItemTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  const { rollingText, bold } = useDropdownMenu()
  const weight = bold ? "font-medium" : "font-normal"

  if (rollingText) return <RollText className={cn(weight, className)}>{children}</RollText>
  return <span className={cn("block", weight, className)}>{children}</span>
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-(--hx-muted-foreground) group-focus/dropdown-menu-item:text-(--hx-accent-foreground)",
        className
      )}
      {...props}
    />
  )
}

// ---- menubar.tsx ----

type MenubarAnimation = "collapse" | "scale" | "slide" | "reveal"
type MenubarSwitch = "glide" | "replay"
type MenubarTriggerHighlight = "pill" | "underline" | "none"
type MenubarRounded = "none" | "sm" | "md" | "lg" | "xl" | "2xl"

type MenubarMotion = {
  animation: MenubarAnimation
  switchAnimation: MenubarSwitch
  duration: number
  stagger: number
  delay: number
  exitFast: boolean
  triggerHighlight: MenubarTriggerHighlight
  triggerHighlightColor: DropdownMenuHighlightColor
  itemHighlight: DropdownMenuHighlight
  itemHighlightColor: DropdownMenuHighlightColor
  selectionIndicator: DropdownMenuIndicator
  rollingText: boolean
  triggerRollingText: boolean
  pressFeedback: boolean
  /** Menus open on hover by default; turn this on to require a click. */
  openOnClick: boolean
  contentAnimation: MenubarContentSwitch
  slideDistance: MenubarContentShift
  showChevrons: boolean
  showIcons: boolean
  showDescriptions: boolean
  size: MenubarSize
  rounded: MenubarRounded
}

type MenubarSize = "sm" | "md" | "lg"
type MenubarContentSwitch = "slide" | "fade" | "none"
type MenubarContentShift = "sm" | "md" | "lg"

const CONTENT_SHIFT: Record<MenubarContentShift, number> = {
  sm: 24,
  md: 48,
  lg: 75,
}

const BAR_SIZE: Record<MenubarSize, string> = {
  sm: "gap-0.5 p-1",
  md: "gap-1 p-1.5",
  lg: "gap-1.5 p-2",
}

const TRIGGER_SIZE: Record<MenubarSize, string> = {
  sm: "px-2.5 py-1 text-sm",
  md: "px-3.5 py-1.5 text-base",
  lg: "px-4 py-2 text-lg",
}

const PANEL_SIZE: Record<MenubarSize, string> = {
  sm: "min-w-48 p-1",
  md: "min-w-56 p-1.5",
  lg: "min-w-64 p-2",
}

const PANEL_ITEM_SIZE: Record<MenubarSize, string> = {
  sm: "px-1.5 py-1 text-sm",
  md: "px-2 py-1.5 text-base",
  lg: "px-2.5 py-2 text-base",
}

const BAR_ROUNDED: Record<MenubarRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
}

const INNER_ROUNDED: Record<MenubarRounded, string> = {
  none: "rounded-none",
  sm: "rounded-xs",
  md: "rounded-sm",
  lg: "rounded-md",
  xl: "rounded-lg",
  "2xl": "rounded-xl",
}

const ITEM_ROUNDED: Record<MenubarRounded, string> = {
  none: "**:data-[slot$=-item]:rounded-none",
  sm: "**:data-[slot$=-item]:rounded-xs",
  md: "**:data-[slot$=-item]:rounded-sm",
  lg: "**:data-[slot$=-item]:rounded-md",
  xl: "**:data-[slot$=-item]:rounded-lg",
  "2xl": "**:data-[slot$=-item]:rounded-xl",
}

type PanelBox = { width: number; height: number; left: number; el: HTMLElement }

type MenubarContextValue = {
  id: string
  motion: MenubarMotion
  active: string | null
  direction: number
  switched: boolean
  highlightOn: string | null
  highlightVisible: boolean
  setHovered: (menu: string | null) => void
  onMenuOpenChange: (menu: string, open: boolean) => void
  entryDirection: React.RefObject<Map<string, number>>
  getPanelBox: () => PanelBox | null
  setPanelSurface: (el: HTMLElement | null, current?: HTMLElement) => void
}

const MenubarContext = React.createContext<MenubarContextValue | null>(null)

function useMenubar() {
  const context = React.useContext(MenubarContext)
  if (!context) throw new Error("Menubar parts must be used inside <Menubar>.")
  return context
}

// Grace period for the pointer to cross the gap to the panel
const HOVER_CLOSE_MS = 160
// Leaving the panel towards an open submenu crosses a gap, so the menu waits longer before closing
const SUBMENU_CROSS_MS = 700

const MenubarMenuContext = React.createContext("")

// Hover opening is done here: Base UI only hover-opens a menubar menu once another is open
const MenubarHoverContext = React.createContext({
  enter: () => {},
  leave: (_ms?: number) => {},
  stay: () => {},
})

// Close then open this fast = switching
const SWITCH_WINDOW_MS = 100

// When the pointer last moved. Closing a hover-opened menu hands focus back to its trigger, which the
// browser calls keyboard focus; that must not light the trigger's highlight again.
const pointer = { at: 0 }
const POINTER_RECENT_MS = 500

function Menubar({
  animation = "collapse",
  switchAnimation = "glide",
  duration = 0.3,
  stagger = 0.03,
  delay = 0.05,
  exitFast = true,
  triggerHighlight = "pill",
  triggerHighlightColor = "primary",
  itemHighlight = "slide",
  itemHighlightColor = "primary",
  selectionIndicator = "check",
  rollingText = false,
  triggerRollingText = true,
  pressFeedback = true,
  openOnClick = false,
  contentAnimation = "slide",
  slideDistance = "lg",
  showChevrons = true,
  showIcons = true,
  showDescriptions = false,
  size = "md",
  rounded = "lg",
  className,
  children,
  ...props
}: MenubarPrimitive.Props & Partial<MenubarMotion>) {
  const id = React.useId()
  const root = React.useRef<HTMLDivElement>(null)
  const activeRef = React.useRef<string | null>(null)
  const lastClosed = React.useRef<{ menu: string; at: number } | null>(null)
  // Set synchronously; state lands a render late
  const entryDirection = React.useRef(new Map<string, number>())
  const panelSurface = React.useRef<HTMLElement | null>(null)
  // Measured live, so mid-glide switches continue
  const getPanelBox = React.useCallback((): PanelBox | null => {
    const el = panelSurface.current
    if (!el?.isConnected) return null
    const r = el.getBoundingClientRect()
    return { width: r.width, height: r.height, left: r.left, el }
  }, [])
  const setPanelSurface = React.useCallback((el: HTMLElement | null, current?: HTMLElement) => {
    if (el === null && current && panelSurface.current !== current) return
    panelSurface.current = el
  }, [])
  const [open, setOpen] = React.useState({ active: null as string | null, direction: 0, switched: false })
  const [hovered, setHovered] = React.useState<string | null>(null)

  React.useEffect(() => {
    const note = () => {
      pointer.at = performance.now()
    }
    document.addEventListener("pointermove", note, { passive: true })
    return () => document.removeEventListener("pointermove", note)
  }, [])

  const lit = open.active ?? hovered
  const [highlightOn, setHighlightOn] = React.useState<string | null>(null)
  // Highlight stays put while hidden
  if (lit && lit !== highlightOn) setHighlightOn(lit)

  const onMenuOpenChange = React.useCallback((menu: string, isOpen: boolean) => {
    if (!isOpen) {
      lastClosed.current = { menu, at: performance.now() }
      if (activeRef.current === menu) {
        activeRef.current = null
        setOpen((prev) => ({ ...prev, active: null }))
      }
      return
    }

    // Already the active menu: a hover open and Base UI's own report can both land
    if (activeRef.current === menu) return

    const recent = lastClosed.current
    const from =
      activeRef.current ??
      (recent && performance.now() - recent.at < SWITCH_WINDOW_MS ? recent.menu : null)
    activeRef.current = menu

    const menus = Array.from(root.current?.querySelectorAll("[data-menubar-menu]") ?? []).map(
      (el) => el.getAttribute("data-menubar-menu")
    )
    const direction = from && from !== menu ? Math.sign(menus.indexOf(menu) - menus.indexOf(from)) : 0
    entryDirection.current.set(menu, direction)
    setOpen({ active: menu, direction, switched: direction !== 0 })
  }, [])

  const context = React.useMemo<MenubarContextValue>(
    () => ({
      id,
      active: open.active,
      direction: open.direction,
      switched: open.switched,
      highlightOn,
      highlightVisible: lit !== null,
      setHovered,
      onMenuOpenChange,
      entryDirection,
      getPanelBox,
      setPanelSurface,
      motion: {
        animation,
        switchAnimation,
        duration,
        stagger,
        delay,
        exitFast,
        triggerHighlight,
        triggerHighlightColor,
        itemHighlight,
        itemHighlightColor,
        selectionIndicator,
        rollingText,
        triggerRollingText,
        pressFeedback,
        openOnClick,
        contentAnimation,
        slideDistance,
        showChevrons,
        showIcons,
        showDescriptions,
        size,
        rounded,
      },
    }),
    [
      id,
      open,
      highlightOn,
      lit,
      onMenuOpenChange,
      getPanelBox,
      setPanelSurface,
      animation,
      switchAnimation,
      duration,
      stagger,
      delay,
      exitFast,
      triggerHighlight,
      triggerHighlightColor,
      itemHighlight,
      itemHighlightColor,
      selectionIndicator,
      rollingText,
      triggerRollingText,
      pressFeedback,
      openOnClick,
      contentAnimation,
      slideDistance,
      showChevrons,
      showIcons,
      showDescriptions,
      size,
      rounded,
    ]
  )

  return (
    <MenubarContext.Provider value={context}>
      <MenubarPrimitive
        ref={root}
        data-slot="menubar"
        className={cn(
          "flex items-center border border-[color-mix(in_oklch,var(--hx-foreground)_25%,transparent)] bg-(--hx-background) max-[1025px]:hidden",
          BAR_SIZE[size],
          BAR_ROUNDED[rounded],
          className
        )}
        {...props}
      >
        {children as React.ReactNode}
      </MenubarPrimitive>
      <MobileMenubar>{children as React.ReactNode}</MobileMenubar>
    </MenubarContext.Provider>
  )
}

function DesktopMenubarMenu({ onOpenChange, ...props }: React.ComponentProps<typeof DropdownMenu>) {
  const { motion: options, onMenuOpenChange } = useMenubar()
  const menu = React.useId()
  const [hoverOpen, setHoverOpen] = React.useState(props.defaultOpen ?? false)
  const closeTimer = React.useRef<number | undefined>(undefined)
  const hover = React.useMemo(() => {
    const stay = () => window.clearTimeout(closeTimer.current)
    return {
      stay,
      enter: () => {
        stay()
        setHoverOpen(true)
      },
      leave: (ms = HOVER_CLOSE_MS) => {
        stay()
        closeTimer.current = window.setTimeout(() => setHoverOpen(false), ms)
      },
    }
  }, [])
  React.useEffect(() => hover.stay, [hover])

  // Hovering opens and closes the menu without going through onOpenChange, so tell the bar here.
  // Without it the bar's active menu goes stale and the trigger pill stays on, or drops off, the wrong trigger.
  const reported = React.useRef(false)
  React.useEffect(() => {
    if (!hoverOpen && !reported.current) return
    reported.current = hoverOpen
    onMenuOpenChange(menu, hoverOpen)
  }, [hoverOpen, menu, onMenuOpenChange])

  return (
    <MenubarMenuContext.Provider value={menu}>
    <MenubarHoverContext.Provider value={hover}>
      <DropdownMenu
        data-slot="menubar-menu"
        open={hoverOpen}
        animation={options.animation}
        duration={options.duration}
        stagger={options.stagger}
        delay={options.delay}
        exitFast={options.exitFast}
        itemHighlight={options.itemHighlight}
        itemHighlightColor={options.itemHighlightColor}
        selectionIndicator={options.selectionIndicator}
        rollingText={options.rollingText}
        pressFeedback={options.pressFeedback}
        onOpenChange={(open, details) => {
          setHoverOpen(open)
          onMenuOpenChange(menu, open)
          onOpenChange?.(open, details)
        }}
        {...props}
      />
    </MenubarHoverContext.Provider>
    </MenubarMenuContext.Provider>
  )
}

function DesktopMenubarGroup({ ...props }: React.ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />
}

function MenubarPortal({ ...props }: React.ComponentProps<typeof DropdownMenuPortal>) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />
}

const TRIGGER_FILL: Record<DropdownMenuHighlightColor, string> = {
  primary: "bg-(--hx-primary)",
  muted: "bg-(--hx-muted)",
}

function TriggerRollText({ lit, children }: { lit: boolean; children: React.ReactNode }) {
  const reduceMotion = useReduceMotion()
  const transition = { duration: reduceMotion ? 0 : 0.4, ease: [0.33, 1, 0.68, 1] as const }

  return (
    <span className="relative block overflow-hidden">
      <motion.span
        className="block"
        initial={false}
        animate={{ y: lit ? "-100%" : "0%" }}
        transition={transition}
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 block"
        initial={false}
        animate={{ y: lit ? "0%" : "100%" }}
        transition={transition}
      >
        {children}
      </motion.span>
    </span>
  )
}

function DesktopMenubarTrigger({
  className,
  children,
  chevron,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger> & {
  chevron?: boolean
}) {
  const { id, motion: options, active, highlightOn, highlightVisible, setHovered } = useMenubar()
  const menu = React.useContext(MenubarMenuContext)
  const hover = React.useContext(MenubarHoverContext)
  const reduceMotion = useReduceMotion()
  const marker = options.triggerHighlight
  const leave = () => setHovered(null)
  const showChevron = chevron ?? options.showChevrons
  const open = active === menu
  const lit = highlightOn === menu && highlightVisible

  return (
    <DropdownMenuTrigger
      data-slot="menubar-trigger"
      data-menubar-menu={menu}
      className={cn(
        "relative isolate flex items-center gap-2 font-medium transition-colors outline-hidden select-none",
        TRIGGER_SIZE[options.size],
        INNER_ROUNDED[options.rounded],
        marker === "pill" &&
          options.triggerHighlightColor === "primary" &&
          lit &&
          "text-(--hx-primary-foreground) **:data-[slot=menubar-trigger-icon]:text-(--hx-primary-foreground)/70",
        className
      )}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        if (event.pointerType !== "mouse") return
        setHovered(menu)
        if (!options.openOnClick) hover.enter()
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        leave()
        if (!options.openOnClick && event.pointerType === "mouse") hover.leave()
      }}
      onFocus={(event) => {
        onFocus?.(event)
        if (event.currentTarget.matches(":focus-visible") && performance.now() - pointer.at > POINTER_RECENT_MS) {
          setHovered(menu)
        }
      }}
      onBlur={(event) => {
        onBlur?.(event)
        leave()
      }}
      {...props}
    >
      {options.triggerRollingText && typeof children === "string" ? (
        <TriggerRollText lit={lit}>{children}</TriggerRollText>
      ) : (
        children
      )}
      {showChevron && (
        <MorphChevron
          data-slot="menubar-trigger-icon"
          open={open}
          duration={options.duration}
          className="size-3 text-(--hx-muted-foreground)"
        />
      )}
      {marker !== "none" && highlightOn === menu && (
        <motion.span
          aria-hidden
          layoutId={`${id}-trigger-highlight`}
          className={cn(
            "pointer-events-none absolute -z-10",
            marker === "pill"
              ? cn("inset-0 rounded-[inherit]", TRIGGER_FILL[options.triggerHighlightColor])
              : cn(
                  "inset-x-2.5 bottom-0.5 h-0.5 rounded-full",
                  options.triggerHighlightColor === "primary"
                    ? "bg-(--hx-primary)"
                    : "bg-(--hx-muted-foreground)"
                )
          )}
          initial={false}
          animate={{ opacity: highlightVisible ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  layout: { type: "spring", visualDuration: 0.3 * 0.6, bounce: 0.15 },
                  opacity: { duration: 0.2, ease: "easeOut" },
                }
          }
        />
      )}
    </DropdownMenuTrigger>
  )
}

function targetOf(variant: Variants[string]) {
  if (typeof variant !== "object") return {}
  const target = { ...(variant as TargetAndTransition) }
  delete target.transition
  return target
}

function MenubarPanelBody({
  surface,
  restLeft,
  children,
}: {
  surface: string
  restLeft: () => number
  children: React.ReactNode
}) {
  const { motion: options, entryDirection } = useMenubar()
  const menu = React.useContext(MenubarMenuContext)
  const reduceMotion = useReduceMotion()
  const [from] = React.useState(() => entryDirection.current.get(menu) ?? 0)

  // No gliding box or sliding contents, but the panel keeps its surface
  if (reduceMotion) {
    if (!surface) return <>{children}</>
    return (
      <div data-slot="menubar-surface" className={cn("relative max-h-(--available-height) overflow-hidden", surface)}>
        <div data-slot="menubar-surface-content" className="w-max min-w-full">
          {children}
        </div>
      </div>
    )
  }

  const entrance =
    from === 0 || options.switchAnimation !== "glide" || options.contentAnimation === "none"
      ? false
      : options.contentAnimation === "slide"
        ?
          { opacity: 0, x: from * CONTENT_SHIFT[options.slideDistance] }
        : { opacity: 0, x: 0 }

  const body = (
    <motion.div
      initial={entrance}
      animate={{ opacity: 1, x: 0 }}
      transition={GLIDE}
    >
      {children}
    </motion.div>
  )

  if (!surface) return body

  return (
    <MorphBox surface={surface} restLeft={restLeft}>
      {body}
    </MorphBox>
  )
}

// One panel gliding between menus
function MorphBox({
  surface,
  restLeft,
  children,
}: {
  surface: string
  restLeft: () => number
  children: React.ReactNode
}) {
  const { getPanelBox, setPanelSurface, entryDirection, motion: options } = useMenubar()
  const menu = React.useContext(MenubarMenuContext)
  const node = React.useRef<HTMLDivElement>(null)
  const start = React.useRef<PanelBox | null | undefined>(undefined)

  React.useLayoutEffect(() => {
    const el = node.current
    if (!el) return
    if (start.current === undefined) {
      start.current = (entryDirection.current.get(menu) ?? 0) !== 0 ? getPanelBox() : null
    }
    const from = start.current
    const rest = el.getBoundingClientRect()
    const left = restLeft()
    setPanelSurface(el)

    if (!from) return () => setPanelSurface(null, el)

    const dx = from.left - left
    const clear = () => {
      el.style.width = ""
      el.style.height = ""
      el.style.transform = ""
    }
    const apply = (t: number) => {
      el.style.width = `${from.width + (rest.width - from.width) * t}px`
      el.style.height = `${from.height + (rest.height - from.height) * t}px`
      el.style.transform = `translateX(${dx * (1 - t)}px)`
    }
    // Set start before first paint
    apply(0)
    const ghost = slideOutPrevious(el, from.el, entryDirection.current.get(menu) ?? 0, options)
    const animation = animate(0, 1, { ...GLIDE, onUpdate: apply })
    animation.then(clear)
    return () => {
      animation.stop()
      ghost?.remove()
      clear()
      setPanelSurface(null, el)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPanelBox, setPanelSurface, entryDirection, menu, restLeft])

  return (
    <div
      ref={node}
      data-slot="menubar-surface"
      className={cn("relative max-h-(--available-height) overflow-hidden", surface)}
    >
      <div data-slot="menubar-surface-content" className="w-max min-w-full">
        {children}
      </div>
    </div>
  )
}

// power2.out, matching directional-menu
const GLIDE = { duration: 0.26 * 0.6, ease: [0.25, 0.46, 0.45, 0.94] } as const

// Old contents slide out inside new box
function slideOutPrevious(
  box: HTMLElement,
  previous: HTMLElement,
  direction: number,
  options: Pick<MenubarMotion, "contentAnimation" | "slideDistance">
) {
  if (options.contentAnimation === "none" || direction === 0) return null
  const source = previous.querySelector<HTMLElement>(":scope > [data-slot=menubar-surface-content]")
  if (!source) return null

  const boxRect = previous.getBoundingClientRect()
  const sourceRect = source.getBoundingClientRect()
  const ghost = source.cloneNode(true) as HTMLElement
  ghost.removeAttribute("data-slot")
  ghost.setAttribute("aria-hidden", "true")
  ghost.inert = true
  Object.assign(ghost.style, {
    position: "absolute",
    top: `${sourceRect.top - boxRect.top}px`,
    left: `${sourceRect.left - boxRect.left}px`,
    width: `${sourceRect.width}px`,
    pointerEvents: "none",
  })
  box.prepend(ghost)

  const x = options.contentAnimation === "slide" ? -direction * CONTENT_SHIFT[options.slideDistance] : 0
  const animation = animate(ghost, { x: [0, x], opacity: [1, 0] }, GLIDE)
  animation.then(() => ghost.remove())
  return ghost
}

const CLIP_OVERHANG = "16px"

// Clip-path collapse keeps ring and shadow
function clipCollapse(base: Variants, side: string): Variants {
  const o = CLIP_OVERHANG
  const shown = `calc(0% - ${o})`
  const hidden = `calc(100% + ${o})`
  const clip = (top: string, bottom: string) => `inset(${top} -${o} ${bottom} -${o})`
  const swap = (variant: Variants[string], clipPath: string) => {
    const next = { ...(variant as TargetAndTransition), clipPath }
    delete next.height
    return next
  }
  return {
    open: swap(base.open, clip(shown, shown)),
    closed: swap(base.closed, side === "top" ? clip(hidden, shown) : clip(shown, hidden)),
  }
}

function DesktopMenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  side = "bottom",
  // clears the bar's own padding and border, so the dropdown floats just below it
  sideOffset = 14,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  const dropdown = useDropdownMenu()
  const hover = React.useContext(MenubarHoverContext)
  const menubar = useMenubar()
  const menu = React.useContext(MenubarMenuContext)
  const { triggerRef } = dropdown
  const options = menubar.motion

  const anchor = React.useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return null
    return { getBoundingClientRect: () => unscaledRect(trigger), contextElement: trigger }
  }, [triggerRef])
  // Popup isn't positioned yet; use trigger
  const restLeft = React.useCallback(() => {
    const trigger = triggerRef.current
    const offset = typeof alignOffset === "number" ? alignOffset : 0
    return trigger ? unscaledRect(trigger).left + offset : 0
  }, [triggerRef, alignOffset])

  const glide = options.switchAnimation === "glide"
  const switchedIn = glide && menubar.switched && menubar.active === menu
  const switchedOut =
    glide && menubar.switched && menubar.active !== null && menubar.active !== menu
  const surface = cn(
    "bg-(--hx-popover) text-(--hx-popover-foreground) shadow-md ring-1 ring-[color-mix(in_oklch,var(--hx-foreground)_25%,transparent)]",
    PANEL_SIZE[options.size],
    BAR_ROUNDED[options.rounded]
  )

  const variantsFor = (panelSide: string): Variants => {
    const base = panelVariants(dropdown, panelSide)
    if (!glide) return base
    const panel = options.animation === "collapse" ? clipCollapse(base, panelSide) : base
    return {
      open: panel.open,
      // Outgoing panel hides; its copy slides
      closed: switchedOut ? { opacity: 0, transition: { duration: 0 } } : panel.closed,
    }
  }

  return (
    <MenuPrimitive.Portal><ThemeScope>
      <MenuPrimitive.Positioner
        anchor={anchor}
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="menubar-content"
          className={cn(
            "z-50 w-max origin-(--transform-origin) outline-none",
            !glide &&
              cn(
                "max-h-(--available-height) overflow-x-hidden overflow-y-auto",
                surface
              ),
            "**:data-[slot=menubar-group]:flex **:data-[slot=menubar-group]:flex-col **:data-[slot=menubar-group]:gap-0.5",
            options.animation === "collapse" && !glide && "overflow-hidden",
            ITEM_ROUNDED[options.rounded],
            className
          )}
          render={(popupProps, state) => {
            const variants = variantsFor(state.side)
            const { children: popupChildren, ...rest } = popupProps as HTMLMotionProps<"div">
            return (
              <motion.div
                {...rest}
                initial={switchedIn ? targetOf(variants.open) : "closed"}
                animate={dropdown.open ? "open" : "closed"}
                variants={variants}
                onPointerEnter={(event) => {
                  rest.onPointerEnter?.(event)
                  if (!options.openOnClick) hover.stay()
                }}
                onPointerLeave={(event) => {
                  rest.onPointerLeave?.(event)
                  dropdown.releaseActiveItem()
                  if (!options.openOnClick && event.pointerType === "mouse") {
                    // Heading for an open submenu: give the pointer time to cross the gap
                    const toSubmenu = !!document.querySelector("[data-slot=menubar-sub-content]")
                    hover.leave(toSubmenu ? SUBMENU_CROSS_MS : undefined)
                  }
                }}
                onAnimationComplete={(definition) => {
                  if (definition === "closed" && !dropdown.open) dropdown.onExitComplete()
                }}
              >
                <MenubarPanelBody surface={glide ? surface : ""} restLeft={restLeft}>
                  {popupChildren as React.ReactNode}
                </MenubarPanelBody>
              </motion.div>
            )
          }}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </ThemeScope></MenuPrimitive.Portal>
  )
}

function MenubarColumns({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="menubar-columns"
      className={cn(
        "grid auto-cols-fr grid-flow-col gap-6 max-[1025px]:grid-flow-row max-[1025px]:gap-0.5",
        className
      )}
      {...props}
    />
  )
}

function DesktopMenubarItem({
  className,
  icon,
  description,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem> & {
  icon?: React.ReactNode
  description?: React.ReactNode
}) {
  const { motion: options } = useMenubar()
  const showIcon = options.showIcons && icon
  const showDescription = options.showDescriptions && description
  const heading = React.Children.map(children, (child) =>
    typeof child === "string" && child.trim() ? (
      <DropdownMenuItemTitle>{child.trim()}</DropdownMenuItemTitle>
    ) : (
      child
    )
  )

  return (
    <DropdownMenuItem
      data-slot="menubar-item"
      className={cn(
        "group/menubar-item cursor-pointer gap-2.5",
        PANEL_ITEM_SIZE[options.size],
        className
      )}
      {...props}
    >
      {showIcon && (
        <span
          data-slot="menubar-item-icon"
          className="flex shrink-0 items-center justify-center text-(--hx-muted-foreground) group-focus/menubar-item:text-current group-data-pill/menubar-item:text-current [&_svg:not([class*='size-'])]:size-4"
        >
          {icon}
        </span>
      )}
      {showDescription ? (
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="inline-flex items-baseline gap-1.5">{heading}</span>
          <span
            data-slot="menubar-item-description"
            className="block text-xs text-(--hx-muted-foreground) group-focus/menubar-item:text-current/70 group-data-pill/menubar-item:text-current/70"
          >
            {description}
          </span>
        </span>
      ) : (
        heading
      )}
    </DropdownMenuItem>
  )
}

function DesktopMenubarCheckboxItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuCheckboxItem>) {
  const { motion: options } = useMenubar()

  return (
    <DropdownMenuCheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn("cursor-pointer", PANEL_ITEM_SIZE[options.size], className)}
      {...props}
    />
  )
}

function DesktopMenubarRadioGroup({ ...props }: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />
}

function DesktopMenubarRadioItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioItem>) {
  const { motion: options } = useMenubar()

  return (
    <DropdownMenuRadioItem
      data-slot="menubar-radio-item"
      className={cn("cursor-pointer", PANEL_ITEM_SIZE[options.size], className)}
      {...props}
    />
  )
}

function DesktopMenubarLabel({ className, ...props }: React.ComponentProps<typeof DropdownMenuLabel>) {
  return (
    <DropdownMenuLabel
      data-slot="menubar-label"
      className={cn("px-1.5 py-1 text-xs font-medium", className)}
      {...props}
    />
  )
}

function DesktopMenubarSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  const dropdown = useDropdownMenu()

  return (
    <MenuPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-(--hx-border)", className)}
      // Staggers in with the items around it.
      render={<motion.div variants={itemVariants(dropdown)} />}
      {...props}
    />
  )
}

function DesktopMenubarShortcut({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return (
    <DropdownMenuShortcut
      data-slot="menubar-shortcut"
      className={cn("ml-auto text-xs tracking-widest text-(--hx-muted-foreground)", className)}
      {...props}
    />
  )
}

function DesktopMenubarSub({ ...props }: React.ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />
}

function DesktopMenubarSubTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubTrigger>) {
  const { motion: options } = useMenubar()

  return (
    <DropdownMenuSubTrigger
      data-slot="menubar-sub-trigger"
      className={cn("cursor-pointer", PANEL_ITEM_SIZE[options.size], className)}
      {...props}
    />
  )
}

function DesktopMenubarSubContent({
  className,
  onPointerEnter,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubContent>) {
  const { motion: options } = useMenubar()
  const hover = React.useContext(MenubarHoverContext)

  return (
    <DropdownMenuSubContent
      data-slot="menubar-sub-content"
      // Keeps the submenu clear of the parent panel
      sideOffset={24}
      className={cn("min-w-40", className)}
      // The submenu is a separate popup, so being in it keeps the whole menu open
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        if (!options.openOnClick) hover.stay()
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        if (!options.openOnClick && event.pointerType === "mouse") hover.leave()
      }}
      {...props}
    />
  )
}

const MobileMenubarContext = React.createContext<{ close: () => void } | null>(null)

const MobileSectionContext = React.createContext<{
  open: boolean
  toggle: () => void
  id: string
} | null>(null)

const MobileRadioContext = React.createContext<{
  value: unknown
  onValueChange?: (value: unknown, details: never) => void
} | null>(null)

const MOBILE_EASE = [0.25, 0.46, 0.45, 0.94] as const

function HamburgerIcon({ open }: { open: boolean }) {
  const reduceMotion = useReduceMotion()
  const transition = { duration: reduceMotion ? 0 : 0.26, ease: MOBILE_EASE }
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="size-5"
    >
      <motion.path
        initial={false}
        animate={{ d: open ? "M6 6 L18 18" : "M4 7 L20 7" }}
        transition={transition}
      />
      <motion.path
        d="M4 12 L20 12"
        initial={false}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.12 }}
      />
      <motion.path
        initial={false}
        animate={{ d: open ? "M6 18 L18 6" : "M4 17 L20 17" }}
        transition={transition}
      />
    </svg>
  )
}

function MobileMenubar({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReduceMotion()
  const [open, setOpen] = React.useState(false)
  const id = React.useId()
  const root = React.useRef<HTMLDivElement>(null)
  const close = React.useCallback(() => setOpen(false), [])
  const value = React.useMemo(() => ({ close }), [close])

  // A tap outside or Escape closes it.
  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <ReducedMotionConfig>
      <div ref={root} data-slot="menubar-mobile" className="relative hidden max-[1025px]:block">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((was) => !was)}
          className="flex cursor-pointer items-center gap-2 rounded-md border border-[color-mix(in_oklch,var(--hx-foreground)_25%,transparent)] bg-(--hx-background) px-4 py-2.5 text-base font-medium transition-transform motion-reduce:transition-none active:scale-95 motion-reduce:active:scale-100"
        >
          <HamburgerIcon open={open} />
          Menu
        </button>
        <AnimatePresence>
          {open && (
            <motion.nav
              id={id}
              aria-label="Menu"
              data-slot="menubar-mobile-panel"
              // Pages with smooth scrolling (Lenis) would take the wheel; the menu scrolls itself
              data-lenis-prevent
              className="absolute top-full left-1/2 z-50 my-2 flex h-96 w-xl -translate-x-1/2 flex-col gap-0.5 overflow-y-auto overscroll-contain touch-pan-y rounded-md bg-(--hx-popover) p-2 text-(--hx-popover-foreground) shadow-md ring-1 ring-[color-mix(in_oklch,var(--hx-foreground)_25%,transparent)] max-md:w-80"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  opacity: 1,
                  y: 0,
                  transition: reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.26, ease: MOBILE_EASE, staggerChildren: 0.04 },
                },
                closed: {
                  opacity: 0,
                  y: reduceMotion ? 0 : -8,
                  transition: reduceMotion ? { duration: 0 } : { duration: 0.18, ease: MOBILE_EASE },
                },
              }}
            >
              <MobileMenubarContext.Provider value={value}>{children}</MobileMenubarContext.Provider>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </ReducedMotionConfig>
  )
}

function MobileSection({ nested, children }: { nested?: boolean; children?: React.ReactNode }) {
  const reduceMotion = useReduceMotion()
  const [open, setOpen] = React.useState(false)
  const id = React.useId()
  const value = React.useMemo(
    () => ({ open, toggle: () => setOpen((was) => !was), id }),
    [open, id]
  )
  return (
    <MobileSectionContext.Provider value={value}>
      <motion.div
        data-slot="menubar-mobile-section"
        className="flex flex-col"
        variants={
          nested
            ? undefined
            : { open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: reduceMotion ? 0 : 6 } }
        }
        transition={reduceMotion ? { duration: 0 } : undefined}
      >
        {children}
      </motion.div>
    </MobileSectionContext.Provider>
  )
}

function MobileSectionTrigger({ nested, children }: { nested?: boolean; children?: React.ReactNode }) {
  const section = React.useContext(MobileSectionContext)
  const open = section?.open ?? false
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={section?.id}
      onClick={section?.toggle}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-3 rounded-md text-left transition-colors hover:bg-(--hx-muted) active:bg-(--hx-muted)",
        nested ? "px-3 py-2 text-sm" : "px-3 py-3 text-base font-medium"
      )}
    >
      {children}
      <MorphChevron open={open} className="size-3 text-(--hx-muted-foreground)" />
    </button>
  )
}

function MobileSectionBody({ nested, children }: { nested?: boolean; children?: React.ReactNode }) {
  const section = React.useContext(MobileSectionContext)
  const reduceMotion = useReduceMotion()
  return (
    <AnimatePresence initial={false}>
      {section?.open && (
        <motion.div
          id={section.id}
          key="body"
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.26, ease: MOBILE_EASE }}
        >
          <div className={cn("flex flex-col gap-0.5 py-1", nested ? "px-3" : "px-1")}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const MOBILE_ROW =
  "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-[background-color,scale] hover:bg-(--hx-muted) active:scale-[0.99] active:bg-(--hx-muted) disabled:pointer-events-none disabled:opacity-50"

function MobileMenubarItem({
  className,
  icon,
  description,
  children,
  ...props
}: React.ComponentProps<typeof DesktopMenubarItem>) {
  const { motion: options } = useMenubar()
  const mobile = React.useContext(MobileMenubarContext)
  const { variant, disabled, onClick } = props as {
    variant?: "default" | "destructive"
    disabled?: boolean
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  }
  const showDescription = options.showDescriptions && description
  return (
    <button
      type="button"
      data-slot="menubar-item"
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event)
        mobile?.close()
      }}
      className={cn(
        MOBILE_ROW,
        variant === "destructive" && "text-(--hx-destructive)",
        typeof className === "string" && className
      )}
    >
      {options.showIcons && icon && (
        <span className="flex shrink-0 items-center text-(--hx-muted-foreground) [&_svg:not([class*='size-'])]:size-4">
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span>{children}</span>
        {showDescription && (
          <span className="text-xs text-(--hx-muted-foreground)">{description}</span>
        )}
      </span>
    </button>
  )
}

function MobileMenubarCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DesktopMenubarCheckboxItem>) {
  const { checked, onCheckedChange, disabled } = props as {
    checked?: boolean
    onCheckedChange?: (checked: boolean, details: never) => void
    disabled?: boolean
  }
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={!!checked}
      data-slot="menubar-checkbox-item"
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked, undefined as never)}
      className={cn(MOBILE_ROW, typeof className === "string" && className)}
    >
      {children}
      <span aria-hidden className="ml-auto flex size-4 shrink-0 items-center justify-center">
        <DrawnCheck checked={!!checked} />
      </span>
    </button>
  )
}

function MobileMenubarRadioGroup({
  children,
  ...props
}: React.ComponentProps<typeof DesktopMenubarRadioGroup>) {
  const { value, onValueChange } = props as {
    value?: unknown
    onValueChange?: (value: unknown, details: never) => void
  }
  const context = React.useMemo(() => ({ value, onValueChange }), [value, onValueChange])
  return (
    <MobileRadioContext.Provider value={context}>
      <div role="radiogroup" className="flex flex-col gap-0.5">
        {children as React.ReactNode}
      </div>
    </MobileRadioContext.Provider>
  )
}

function MobileMenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DesktopMenubarRadioItem>) {
  const group = React.useContext(MobileRadioContext)
  const { value, disabled } = props as { value?: unknown; disabled?: boolean }
  const checked = group?.value === value
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      data-slot="menubar-radio-item"
      disabled={disabled}
      onClick={() => group?.onValueChange?.(value, undefined as never)}
      className={cn(MOBILE_ROW, typeof className === "string" && className)}
    >
      {children}
      <span aria-hidden className="ml-auto flex size-4 shrink-0 items-center justify-center">
        <DrawnCheck checked={checked} />
      </span>
    </button>
  )
}

// Desktop part, or touch part in panel
function responsive<P extends object>(
  Desktop: React.ComponentType<P>,
  Mobile: React.ComponentType<P>,
  name: string
) {
  function Part(props: P) {
    return React.useContext(MobileMenubarContext) ? <Mobile {...props} /> : <Desktop {...props} />
  }
  Part.displayName = name
  return Part
}

type Props<T extends React.ElementType> = React.ComponentProps<T>

const MenubarMenu = responsive(
  DesktopMenubarMenu,
  ({ children }: Props<typeof DesktopMenubarMenu>) => (
    <MobileSection>{children as React.ReactNode}</MobileSection>
  ),
  "MenubarMenu"
)
const MenubarTrigger = responsive(
  DesktopMenubarTrigger,
  ({ children }: Props<typeof DesktopMenubarTrigger>) => (
    <MobileSectionTrigger>{children as React.ReactNode}</MobileSectionTrigger>
  ),
  "MenubarTrigger"
)
const MenubarContent = responsive(
  DesktopMenubarContent,
  ({ children }: Props<typeof DesktopMenubarContent>) => (
    <MobileSectionBody>{children as React.ReactNode}</MobileSectionBody>
  ),
  "MenubarContent"
)
const MenubarGroup = responsive(
  DesktopMenubarGroup,
  ({ children }: Props<typeof DesktopMenubarGroup>) => (
    <div className="flex flex-col gap-0.5">{children as React.ReactNode}</div>
  ),
  "MenubarGroup"
)
const MenubarItem = responsive(DesktopMenubarItem, MobileMenubarItem, "MenubarItem")
const MenubarCheckboxItem = responsive(
  DesktopMenubarCheckboxItem,
  MobileMenubarCheckboxItem,
  "MenubarCheckboxItem"
)
const MenubarRadioGroup = responsive(
  DesktopMenubarRadioGroup,
  MobileMenubarRadioGroup,
  "MenubarRadioGroup"
)
const MenubarRadioItem = responsive(DesktopMenubarRadioItem, MobileMenubarRadioItem, "MenubarRadioItem")
const MenubarLabel = responsive(
  DesktopMenubarLabel,
  ({ children }: Props<typeof DesktopMenubarLabel>) => (
    <div className="px-3 py-1 text-xs font-medium text-(--hx-muted-foreground)">
      {children as React.ReactNode}
    </div>
  ),
  "MenubarLabel"
)
const MenubarSeparator = responsive(
  DesktopMenubarSeparator,
  () => <div role="separator" className="my-1 h-px bg-(--hx-border)" />,
  "MenubarSeparator"
)
const MenubarShortcut = responsive(DesktopMenubarShortcut, () => null, "MenubarShortcut")
const MenubarSub = responsive(
  DesktopMenubarSub,
  ({ children }: Props<typeof DesktopMenubarSub>) => (
    <MobileSection nested>{children as React.ReactNode}</MobileSection>
  ),
  "MenubarSub"
)
const MenubarSubTrigger = responsive(
  DesktopMenubarSubTrigger,
  ({ children }: Props<typeof DesktopMenubarSubTrigger>) => (
    <MobileSectionTrigger nested>{children as React.ReactNode}</MobileSectionTrigger>
  ),
  "MenubarSubTrigger"
)
const MenubarSubContent = responsive(
  DesktopMenubarSubContent,
  ({ children }: Props<typeof DesktopMenubarSubContent>) => (
    <MobileSectionBody nested>{children as React.ReactNode}</MobileSectionBody>
  ),
  "MenubarSubContent"
)

// ---- demo: menubar-demo.tsx ----

const controls = {
  animation: {
    group: "Panel",
    type: "select",
    label: "Opening",
    value: "slide",
    options: [
      { label: "Scale", value: "scale" },
      { label: "Slide", value: "slide" },
      { label: "Collapse", value: "collapse" },
      { label: "Reveal", value: "reveal" },
    ],
  },
  exitFast: { group: "Panel", type: "checkbox", label: "Exit fast", value: false },

  switchAnimation: {
    group: "Between menus",
    type: "select",
    label: "Moving over",
    value: "glide",
    options: [
      { label: "Glide", value: "glide" },
      { label: "Replay", value: "replay" },
    ],
  },
  contentAnimation: {
    disabled: (v: Record<string, unknown>) => v.switchAnimation !== "glide",
    group: "Between menus",
    type: "select",
    label: "Content animation",
    value: "slide",
    options: [
      { label: "Slides in", value: "slide" },
      { label: "Fades in", value: "fade" },
      { label: "At once", value: "none" },
    ],
  },
  slideDistance: {
    disabled: (v: Record<string, unknown>) => v.switchAnimation !== "glide" || v.contentAnimation !== "slide",
    group: "Between menus",
    type: "select",
    label: "Slide distance",
    value: "lg",
    options: [
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
    ],
  },

  duration: {
    group: "Timing",
    type: "slider",
    label: "Duration",
    value: 0.3,
    min: 0.1,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  delay: {
    group: "Timing",
    type: "slider",
    label: "Delay",
    value: 0.05,
    min: 0,
    max: 0.5,
    step: 0.01,
    unit: "s",
  },
  stagger: {
    group: "Timing",
    
    type: "slider",
    label: "Stagger",
    value: 0.03,
    min: 0,
    max: 0.2,
    step: 0.01,
    unit: "s",
  },

  triggerHighlight: {
    group: "Bar",
    type: "select",
    label: "Menu highlight",
    value: "pill",
    options: [
      { label: "Gliding pill", value: "pill" },
      { label: "Gliding underline", value: "underline" },
      { label: "None", value: "none" },
    ],
  },
  triggerHighlightColor: {
    disabled: (v: Record<string, unknown>) => v.triggerHighlight === "none",
    group: "Bar",
    type: "select",
    label: "Highlight fill",
    value: "primary",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Muted", value: "muted" },
    ],
  },
  showChevrons: { group: "Bar", type: "checkbox", label: "Chevrons", value: true },
  triggerRollingText: { group: "Bar", type: "checkbox", label: "Rolling trigger text", value: true },
  openOnClick: { group: "Bar", type: "checkbox", label: "Open on click", value: false },
  pressFeedback: { group: "Bar", type: "checkbox", label: "Press feedback", value: true },

  itemHighlight: {
    group: "Items",
    type: "select",
    label: "Item highlight",
    value: "slide",
    options: [
      { label: "Slide", value: "slide" },
      { label: "Fill from top", value: "fill" },
      { label: "None", value: "none" },
    ],
  },
  itemHighlightColor: {
    disabled: (v: Record<string, unknown>) => v.itemHighlight === "none",
    group: "Items",
    type: "select",
    label: "Item highlight color",
    value: "primary",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Muted", value: "muted" },
    ],
  },
  selectionIndicator: {
    group: "Items",
    type: "select",
    label: "Selection indicator",
    value: "check",
    options: [
      { label: "Check", value: "check" },
      { label: "Dot", value: "dot" },
      { label: "Bar", value: "bar" },
    ],
  },
  showIcons: { group: "Items", type: "checkbox", label: "Icons", value: true },
  showDescriptions: { group: "Items", type: "checkbox", label: "Descriptions", value: true },
  rollingText: { group: "Items", type: "checkbox", label: "Rolling text", value: true },

  size: {
    group: "Style",
    type: "select",
    label: "Size",
    value: "lg",
    options: [
      { label: "sm", value: "sm" },
      { label: "md", value: "md" },
      { label: "lg", value: "lg" },
    ],
  },
  rounded: {
    group: "Style",
    type: "select",
    label: "Roundness",
    value: "md",
    options: [
      { label: "None", value: "none" },
      { label: "sm", value: "sm" },
      { label: "md", value: "md" },
      { label: "lg", value: "lg" },
      { label: "xl", value: "xl" },
      { label: "2xl", value: "2xl" },
    ],
  },
}

function MenubarDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel
  const [showRatio, setShowRatio] = React.useState(true)
  const [showTimer, setShowTimer] = React.useState(true)
  const [showNotes, setShowNotes] = React.useState(false)
  const [roast, setRoast] = React.useState("medium")
  const [method, setMethod] = React.useState("pour-over")

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-96 flex-col items-center gap-10 py-12 max-md:gap-8">
        <Menubar
          animation={values.animation as MenubarAnimation}
          switchAnimation={values.switchAnimation as MenubarSwitch}
          exitFast={values.exitFast}
          duration={values.duration}
          delay={values.delay}
          stagger={values.stagger}
          triggerHighlight={values.triggerHighlight as MenubarTriggerHighlight}
          pressFeedback={values.pressFeedback}
          openOnClick={values.openOnClick}
          itemHighlight={values.itemHighlight as DropdownMenuHighlight}
          itemHighlightColor={values.itemHighlightColor as DropdownMenuHighlightColor}
          triggerHighlightColor={values.triggerHighlightColor as DropdownMenuHighlightColor}
          selectionIndicator={values.selectionIndicator as DropdownMenuIndicator}
          rollingText={values.rollingText}
          triggerRollingText={values.triggerRollingText}
          contentAnimation={values.contentAnimation as MenubarContentSwitch}
          slideDistance={values.slideDistance as MenubarContentShift}
          showChevrons={values.showChevrons}
          showIcons={values.showIcons}
          showDescriptions={values.showDescriptions}
          size={values.size as MenubarSize}
          rounded={values.rounded as MenubarRounded}
        >
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarLabel>Start</MenubarLabel>
                <MenubarItem
                  icon={<FilePlusIcon />}
                  description="A blank recipe, ready to dial in."
                >
                  New brew <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem
                  icon={<CopyIcon />}
                  description="Copy this recipe and tweak it."
                >
                  Duplicate <MenubarShortcut>⌘D</MenubarShortcut>
                </MenubarItem>
                <MenubarItem
                  icon={<FolderOpenIcon />}
                  description="Browse everything you've saved."
                >
                  Open recent <MenubarShortcut>⌘O</MenubarShortcut>
                </MenubarItem>
                <MenubarSub>
                  <MenubarSubTrigger>Export</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem icon={<FileTextIcon />}>As a recipe card</MenubarItem>
                    <MenubarItem icon={<TableIcon />}>As a spreadsheet</MenubarItem>
                    <MenubarItem icon={<FileIcon />}>As plain text</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarItem
                  icon={<ShareIcon />}
                  description="Send a link your friends can brew from."
                >
                  Share <MenubarShortcut>⇧⌘S</MenubarShortcut>
                </MenubarItem>
                <MenubarItem icon={<PrinterIcon />} description="One page, kitchen friendly.">
                  Print <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem icon={<UndoIcon />} description="Step back one change.">
                  Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem icon={<RedoIcon />} description="Put that change back.">
                  Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem icon={<PencilIcon />} description="Give this brew a better name.">
                  Rename brew
                </MenubarItem>
                <MenubarItem
                  icon={<Trash2Icon />}
                  variant="destructive"
                  description="This can't be undone."
                >
                  Delete brew
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked={showRatio} onCheckedChange={setShowRatio}>
                Brew ratio
              </MenubarCheckboxItem>
              <MenubarCheckboxItem checked={showTimer} onCheckedChange={setShowTimer}>
                Timer
              </MenubarCheckboxItem>
              <MenubarCheckboxItem checked={showNotes} onCheckedChange={setShowNotes}>
                Tasting notes
              </MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Roast</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarLabel>Roast level</MenubarLabel>
                <MenubarRadioGroup value={roast} onValueChange={setRoast}>
                  <MenubarRadioItem value="light">Light</MenubarRadioItem>
                  <MenubarRadioItem value="medium">Medium</MenubarRadioItem>
                  <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarLabel>Method</MenubarLabel>
                <MenubarRadioGroup value={method} onValueChange={setMethod}>
                  <MenubarRadioItem value="pour-over">Pour-over</MenubarRadioItem>
                  <MenubarRadioItem value="espresso">Espresso</MenubarRadioItem>
                  <MenubarRadioItem value="french-press">French press</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Beans</MenubarTrigger>
            <MenubarContent>
              {/* Two columns side by side, with a gap between them. */}
              <MenubarColumns>
                <MenubarGroup>
                  <MenubarLabel>Single origin</MenubarLabel>
                  <MenubarItem icon={<CitrusIcon />} description="Jasmine, peach, black tea.">
                    Ethiopia Guji
                  </MenubarItem>
                  <MenubarItem icon={<CherryIcon />} description="Red apple, caramel, cocoa.">
                    Colombia Huila
                  </MenubarItem>
                  <MenubarItem icon={<MountainIcon />} description="Blackcurrant and bright acidity.">
                    Kenya Nyeri
                  </MenubarItem>
                </MenubarGroup>
                <MenubarGroup>
                  <MenubarLabel>Blends & more</MenubarLabel>
                  <MenubarItem icon={<FlameIcon />} description="Dark chocolate, built for milk.">
                    House espresso
                  </MenubarItem>
                  <MenubarItem icon={<MoonIcon />} description="All the flavour, none of the buzz.">
                    Swiss water decaf
                  </MenubarItem>
                  <MenubarItem icon={<SparklesIcon />} description="A new lot, only this month.">
                    Roaster&apos;s pick
                  </MenubarItem>
                </MenubarGroup>
              </MenubarColumns>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarItem icon={<HeartIcon />} description="Everything you've starred.">
                  Favourites
                </MenubarItem>
                <MenubarItem icon={<LeafIcon />} description="Organic and direct-trade lots.">
                  Browse all beans
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

      </div>
      <p className="text-center text-sm text-(--hx-muted-foreground) max-lg:hidden">
        Tip: open a menu, then slide the pointer along the bar or press the arrow keys.
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

export interface AnimatedMenubarProps extends Partial<ControlValues> {
  theme?: AnimatedMenubarTheme;
  mode?: AnimatedMenubarMode;
  className?: string;
}

export default function AnimatedMenubar({ theme = "caffeine", mode = "dark", className, ...props }: AnimatedMenubarProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) motion-reduce:transition-none motion-reduce:**:transition-none [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <MenubarDemo {...props} />
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarColumns,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  type MenubarAnimation,
  type MenubarSwitch,
  type MenubarTriggerHighlight,
  type MenubarRounded,
  type MenubarSize,
  type MenubarContentSwitch,
  type MenubarContentShift,
};
