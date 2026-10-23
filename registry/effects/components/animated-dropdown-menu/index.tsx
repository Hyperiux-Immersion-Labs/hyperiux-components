// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import gsap from "gsap";
import { AnimatePresence, motion, MotionConfig, stagger, type HTMLMotionProps, type TargetAndTransition, type Variants } from "motion/react";
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

export type AnimatedDropdownMenuTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedDropdownMenuMode = "light" | "dark";

const THEMES: Record<`${AnimatedDropdownMenuTheme}:${AnimatedDropdownMenuMode}`, Record<string, string>> = {
  "default:light": {
    "accent-foreground": "oklch(0.205 0 0)",
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
    "accent-foreground": "oklch(0.985 0 0)",
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
    "accent-foreground": "#202020",
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
    "accent-foreground": "#eeeeee",
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
    "accent-foreground": "#28261b",
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
    "accent-foreground": "#f5f4ee",
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
    "accent-foreground": "#2f4a55",
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
    "accent-foreground": "#e6e0cc",
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
    "accent-foreground": "#0f6b30",
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
    "accent-foreground": "#ffffff",
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
    "accent-foreground": "#0f1923",
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
    "accent-foreground": "#ece8e1",
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
    "accent-foreground": "#3b3b3b",
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
    "accent-foreground": "#ffffff",
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
function themeProps(theme: AnimatedDropdownMenuTheme = "default", mode: AnimatedDropdownMenuMode = "dark") {
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
  duration,
  exitFast,
}: {
  duration: number
  exitFast: boolean
}): MotionPreset {
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

  const preset = React.useMemo(
    () => buildPreset({ duration, exitFast }),
    [duration, exitFast]
  )

  const close = React.useCallback(() => actionsRef.current?.close(), [])
  const onExitComplete = React.useCallback(() => {
    // The pill stays on its item while the panel fades, and clears once it has gone.
    setActiveItem(null)
    actionsRef.current?.unmount()
  }, [setActiveItem])

  const context = React.useMemo<DropdownMenuContextValue>(
    () => ({
      id,
      open,
      close,
      onExitComplete,
      triggerRef,
      morphPanelRef,
      preset,
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

function DropdownMenuTriggerIcon({
  icon = "plus",
  className,
}: {
  icon?: "chevron" | "plus"
  className?: string
}) {
  const { open, preset } = useDropdownMenu()

  if (icon === "chevron") {
    return (
      <MorphChevron
        data-slot="dropdown-menu-trigger-icon"
        open={open}
        duration={preset.iconDuration}
        className={cn("size-4", className)}
      />
    )
  }

  return (
    <MorphPlus
      data-slot="dropdown-menu-trigger-icon"
      open={open}
      className={cn("size-5", className)}
    />
  )
}

/** The current value shown in the trigger. Rolls to the new value when it changes. */
function DropdownMenuValue({
  className,
  children,
}: {
  className?: string
  children: string | number
}) {
  const { rollingValue } = React.useContext(TriggerContext)
  const { preset, bold } = useDropdownMenu()
  const weight = bold ? "font-semibold" : "font-normal"

  if (!rollingValue) return <span className={cn(weight, className)}>{children}</span>

  return (
    <span className={cn("relative inline-grid overflow-hidden", weight, className)}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={children}
          className="block"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={preset.item}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function panelVariants(context: DropdownMenuContextValue, side: string): Variants {
  const { animation, preset, exitFast } = context
  const vertical = side === "top" || side === "bottom"
  const away = side === "top" || side === "left" ? "1.25em" : "-1.25em"
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

  return {
    open: {
      ...open,
      transition: {
        ...enter,
        delayChildren: stagger(context.stagger, { startDelay: context.delay }),
      },
    },
    closed: {
      ...closed,
      // Items leave in reverse alongside the panel, so closing takes as long as opening.
      // Exit fast drops the stagger along with the shorter duration.
      transition:
        exitFast || context.stagger === 0
          ? exit
          : { ...exit, delayChildren: stagger(context.stagger, { from: "last" }) },
    },
  }
}

function itemVariants(context: DropdownMenuContextValue): Variants {
  // Items only lift on their own when staggered; otherwise they would move against the panel.
  const lift = context.stagger > 0 ? "0.3em" : "0em"
  return {
    open: { opacity: 1, y: "0em", transition: context.preset.item },
    closed: {
      opacity: 0,
      y: lift,
      transition: { duration: context.preset.exitDuration, ease: smoothEase },
    },
  }
}

const isPrintableKey = (event: React.KeyboardEvent) =>
  event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey

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

const MORPH_ITEMS = '[data-slot="dropdown-menu-label"], [data-slot$="-item"]'

/**
 * The morph panel, animated with GSAP. The trigger itself grows: its bottom padding tweens down
 * by the height of the items, so its own border and background stretch to hold them. This panel
 * is a see-through overlay pinned to the trigger's top, clipped to the same height, and fades the
 * items up one by one. Closing plays it back and hands the trigger its original padding.
 */
function MorphPanel({
  ref,
  children,
  contentClassName,
  ...props
}: React.ComponentProps<"div"> & { contentClassName?: string }) {
  const context = useDropdownMenu()
  const reduceMotion = usePrefersReducedMotion()
  const root = React.useRef<HTMLDivElement>(null)
  const header = React.useRef<HTMLDivElement>(null)
  const timeline = React.useRef<gsap.core.Timeline | null>(null)
  /** The trigger's height and bottom padding before it grew. */
  const collapsed = React.useRef<{ height: number; padding: number } | null>(null)
  const { triggerRef, morphPanelRef } = context

  React.useLayoutEffect(
    () => () => {
      // Forget the timeline and measurements too: in development React remounts right away,
      // and the next mount must rebuild from the trigger's restored size.
      timeline.current?.kill()
      timeline.current = null
      collapsed.current = null
      if (triggerRef.current) gsap.set(triggerRef.current, { clearProps: "paddingBottom,transition" })
    },
    [triggerRef]
  )

  const play = React.useEffectEvent((open: boolean) => {
    const el = root.current
    const trigger = triggerRef.current
    if (!el || !header.current || !trigger) return
    const items = Array.from(el.querySelectorAll<HTMLElement>(MORPH_ITEMS))
    const speed = reduceMotion ? 0 : 1
    const duration = context.preset.iconDuration * speed
    // Morph always staggers its items; the Stagger setting overrides this default gap.
    const gap = (context.stagger > 0 ? context.stagger : 0.08) * speed

    if (!collapsed.current) {
      collapsed.current = {
        height: trigger.offsetHeight,
        padding: parseFloat(getComputedStyle(trigger).paddingBottom),
      }
      // The trigger's CSS `transition-all` would lag every padding frame GSAP writes.
      gsap.set(trigger, { transition: "none" })
      gsap.set(header.current, { height: collapsed.current.height })
      gsap.set(el, { height: collapsed.current.height })
      gsap.set(items, { opacity: 0, y: 8 })
    }
    const { height, padding } = collapsed.current

    // Closing plays the opening timeline backwards: the same moves in mirror order and the same
    // length, or 1 / 0.6 times faster with Exit fast.
    if (!timeline.current) {
      const grow = el.scrollHeight - height
      timeline.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => {
            gsap.set(trigger, { clearProps: "paddingBottom,transition" })
            context.onExitComplete()
          },
        })
        .to(trigger, { paddingBottom: padding + grow, duration, ease: "none" }, 0)
        .to(el, { height: height + grow, duration, ease: "none" }, 0)
        .to(
          items,
          { opacity: 1, y: 0, duration: duration * 0.6, ease: "none", stagger: gap },
          // Items wait until the panel is mostly open, so they never land ahead of its edge.
          duration * 0.7 + context.delay * speed
        )
    }

    const tl = timeline.current
    if (open) {
      tl.timeScale(1).play()
    } else if (tl.progress() === 0) {
      tl.eventCallback("onReverseComplete")?.()
    } else {
      tl.timeScale(context.exitFast ? 1 / 0.6 : 1).reverse()
    }
  })

  React.useLayoutEffect(() => play(context.open), [context.open])

  return (
    <div
      {...props}
      ref={(node) => {
        root.current = node
        morphPanelRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
    >
      <div ref={header} aria-hidden />
      <div className={cn("pointer-events-auto mx-px border-t p-1", contentClassName)}>
        {children}
      </div>
    </div>
  )
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  onKeyDown,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const context = useDropdownMenu()
  const morph = context.animation === "morph"
  const { triggerRef } = context
  // Position against the trigger's untransformed box, so its press scale doesn't shrink or
  // shift the panel (Floating UI measures with getBoundingClientRect, which includes transforms).
  const anchor = React.useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return null
    return { getBoundingClientRect: () => unscaledRect(trigger), contextElement: trigger }
  }, [triggerRef])
  const clipsHeight = context.animation === "collapse"

  return (
    <MenuPrimitive.Portal><ThemeScope>
      <MenuPrimitive.Positioner
        anchor={anchor}
        // Morph covers the trigger, so let clicks pass through to it (only the items catch them).
        className={cn("isolate outline-none", morph ? "pointer-events-none z-50" : "z-40")}
        align={align}
        alignOffset={alignOffset}
        side={side}
        // Morph sits on top of the trigger so the panel grows out of it.
        sideOffset={morph ? ({ anchor }) => -anchor.height : sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-(--hx-background) p-1 text-(--hx-foreground) shadow-md ring-1 ring-(--hx-border) outline-none in-data-[theme=dark]:ring-(--hx-input) in-data-[theme=dark]:bg-[linear-gradient(color-mix(in_oklch,var(--hx-input)_30%,transparent),color-mix(in_oklch,var(--hx-input)_30%,transparent))]",
            clipsHeight && "overflow-hidden",
            // Morph: the trigger is the container, so the popup is a bare see-through overlay.
            morph
              ? "pointer-events-none overflow-hidden rounded-none bg-transparent p-0 shadow-none ring-0"
              : className
          )}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (!context.typeahead && isPrintableKey(event)) event.preventBaseUIHandler()
          }}
          render={(popupProps, state) =>
            morph ? (
              <MorphPanel
                {...(popupProps as React.ComponentProps<"div">)}
                contentClassName={typeof className === "string" ? className : undefined}
              />
            ) : (
              <motion.div
                {...(popupProps as HTMLMotionProps<"div">)}
                initial="closed"
                animate={context.open ? "open" : "closed"}
                variants={panelVariants(context, state.side)}
                onPointerLeave={(event) => {
                  ;(popupProps as HTMLMotionProps<"div">).onPointerLeave?.(event)
                  context.releaseActiveItem()
                }}
                onAnimationComplete={(definition) => {
                  if (definition === "closed" && !context.open) context.onExitComplete()
                }}
              />
            )
          }
          {...props}
        />
      </MenuPrimitive.Positioner>
    </ThemeScope></MenuPrimitive.Portal>
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
  children,
}: {
  itemProps: React.HTMLAttributes<HTMLElement>
  highlighted: boolean
  children?: React.ReactNode
}) {
  const context = useDropdownMenu()
  const content = itemProps.children
  const itemId = React.useId()
  const { setActiveItem } = context
  // Highlighting an item (by pointer or keyboard) focuses it, so focus is where the pill moves.
  const pillHere = context.itemHighlight === "slide" && context.activeItem === itemId

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
      whileHover={context.pressFeedback ? { scale: ITEM_PRESS_SCALE } : undefined}
      whileTap={context.pressFeedback ? { scale: ITEM_PRESS_SCALE } : undefined}
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
          transition={{ duration: 0.3, ease: easeOutCubic }}
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
        // While its submenu is open and the pill has moved into it, keep a quiet mark here.
        "data-popup-open:not-data-pill:bg-(--hx-muted)",
        highlightClasses(context.itemHighlight, context.itemHighlightColor),
        className
      )}
      // Drawn by the same item as the rest, so the sliding pill glides onto it too.
      render={(itemProps, state) => (
        <MotionItem itemProps={itemProps} highlighted={state.highlighted}>
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
            "z-50 max-h-(--available-height) w-auto min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-(--hx-background) p-1 text-(--hx-foreground) shadow-lg ring-1 ring-(--hx-border) in-data-[theme=dark]:ring-(--hx-input) in-data-[theme=dark]:bg-[linear-gradient(color-mix(in_oklch,var(--hx-input)_30%,transparent),color-mix(in_oklch,var(--hx-input)_30%,transparent))] duration-100 outline-none data-[side=bottom]:data-starting-style:-translate-y-2 data-[side=left]:data-starting-style:translate-x-2 data-[side=right]:data-starting-style:-translate-x-2 data-[side=top]:data-starting-style:translate-y-2 transition-[opacity,scale,translate] duration-150 ease-out data-open:data-starting-style:opacity-0 data-open:data-starting-style:scale-95  data-closed:data-ending-style:opacity-0 data-closed:data-ending-style:scale-95",
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
          checked ? { duration: 0.3, ease: smoothEase } : { duration: 0.15, ease: "easeOut" }
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
  const { id, selectionIndicator, preset } = useDropdownMenu()

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
            checked
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
  const transition = { duration: 0.4, ease: easeOutCubic }

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

/** A secondary line under an item's title. */
function DropdownMenuItemDescription({ className, ...props }: React.ComponentProps<"span">) {
  const { showDescriptions } = useDropdownMenu()
  if (!showDescriptions) return null

  return (
    <span
      data-slot="dropdown-menu-item-description"
      className={cn("block text-sm text-(--hx-muted-foreground)", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-(--hx-border)", className)}
      {...props}
    />
  )
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

// ---- demo: page.tsx ----

const options = [
  {
    value: "weekly",
    label: "Every week",
    description: "For daily brewers who get through a bag fast.",
  },
  {
    value: "fortnightly",
    label: "Every two weeks",
    description: "Our most popular pace, and the default.",
  },
  {
    value: "monthly",
    label: "Every month",
    description: "A fresh bag now and then, no rush.",
  },
  {
    value: "paused",
    label: "Paused",
    description: "Take a break for up to three months.",
  },
]

const controls = {
  animation: {
    group: "Panel",
    type: "select",
    label: "Animation",
    value: "collapse",
    options: [
      { label: "Collapse", value: "collapse" },
      { label: "Slide", value: "slide" },
      { label: "Scale", value: "scale" },
      { label: "Reveal", value: "reveal" },
      { label: "Morph", value: "morph" },
    ],
  },
  exitFast: { group: "Panel", type: "checkbox", label: "Exit fast", value: false },
  duration: {
    group: "Timing",
    type: "slider",
    label: "Duration",
    value: 0.35,
    min: 0.1,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  delay: {
    group: "Timing",
    type: "slider",
    label: "Delay",
    value: 0.1,
    min: 0,
    max: 0.5,
    step: 0.01,
    unit: "s",
  },
  stagger: {
    group: "Timing",
    type: "slider",
    label: "Stagger",
    value: 0.05,
    min: 0,
    max: 0.2,
    step: 0.01,
    unit: "s",
  },
  itemHighlight: {
    group: "Options",
    type: "select",
    label: "Item highlight",
    value: "slide",
    options: [
      { label: "Slide", value: "slide" },
      { label: "Fill from top", value: "fill" },
      { label: "None", value: "none" },
    ],
  },
  selectionIndicator: {
    group: "Options",
    type: "select",
    label: "Selection indicator",
    value: "check",
    options: [
      { label: "Check", value: "check" },
      { label: "Dot", value: "dot" },
      { label: "Bar", value: "bar" },
    ],
  },
  showDescriptions: { group: "Options", type: "checkbox", label: "Descriptions", value: false },
  bold: { group: "Options", type: "checkbox", label: "Bold", value: false },
  rollingText: { group: "Options", type: "checkbox", label: "Rolling text", value: false },
  icon: {
    group: "Trigger",
    type: "select",
    label: "Icon",
    value: "plus",
    options: [
      { label: "Plus / minus", value: "plus" },
      { label: "Chevron", value: "chevron" },
    ],
  },
  rollingValue: { group: "Trigger", type: "checkbox", label: "Rolling value", value: true },
  pressFeedback: { group: "Trigger", type: "checkbox", label: "Press feedback", value: false },
  openOnHover: { group: "Trigger", type: "checkbox", label: "Open on hover", value: false },
  closeDelayOnSelect: {
    group: "Behaviour",
    type: "checkbox",
    label: "Close delay on select",
    value: false,
  },
  typeahead: { group: "Behaviour", type: "checkbox", label: "Type to jump", value: false },
}

function DropdownMenuPage(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel
  const [frequency, setFrequency] = React.useState("fortnightly")
  const selected = options.find((option) => option.value === frequency) ?? options[1]

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
      </div>

      <div className="flex min-h-96 items-start justify-center">
        <DropdownMenu
          animation={values.animation as "collapse" | "slide" | "scale" | "reveal" | "morph"}
          exitFast={values.exitFast}
          duration={values.duration}
          delay={values.delay}
          stagger={values.stagger}
          itemHighlight={values.itemHighlight as "slide" | "fill" | "none"}
          selectionIndicator={values.selectionIndicator as "check" | "dot" | "bar"}
          showDescriptions={values.showDescriptions}
          bold={values.bold}
          rollingText={values.rollingText}
          closeDelayOnSelect={values.closeDelayOnSelect}
          pressFeedback={values.pressFeedback}
          typeahead={values.typeahead}
        >
          <DropdownMenuTrigger
            openOnHover={values.openOnHover}
            delay={100}
            rollingValue={values.rollingValue}
            render={
              <Button
                variant="outline"
                className="relative z-45 h-auto w-[60%] cursor-pointer justify-between gap-4 px-4 py-3 hover:bg-(--hx-background) aria-expanded:bg-(--hx-background) max-md:w-full in-data-[theme=dark]:bg-(--hx-background)! in-data-[theme=dark]:bg-[linear-gradient(color-mix(in_oklch,var(--hx-input)_30%,transparent),color-mix(in_oklch,var(--hx-input)_30%,transparent))]"
              />
            }
          >
            <span className="flex flex-col items-start gap-0.5 text-left">
              <span className="text-sm font-normal text-(--hx-muted-foreground)">
                Your coffee arrives
              </span>
              <DropdownMenuValue className="text-base">
                {selected.label}
              </DropdownMenuValue>
            </span>
            <DropdownMenuTriggerIcon
              icon={values.icon as "chevron" | "plus"}
              className="text-(--hx-muted-foreground)"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-1.5">
            <DropdownMenuGroup>
              <DropdownMenuRadioGroup aria-label="Delivery frequency" value={frequency} onValueChange={setFrequency}>
                {options.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    className="py-2"
                  >
                    <span className="flex flex-col gap-0.5">
                      <DropdownMenuItemTitle>{option.label}</DropdownMenuItemTitle>
                      <DropdownMenuItemDescription>
                        {option.description}
                      </DropdownMenuItemDescription>
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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

export interface AnimatedDropdownMenuProps extends Partial<ControlValues> {
  theme?: AnimatedDropdownMenuTheme;
  mode?: AnimatedDropdownMenuMode;
  className?: string;
}

export default function AnimatedDropdownMenu({ theme = "ghibli", mode = "dark", className, ...props }: AnimatedDropdownMenuProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <ReducedMotionConfig>
          <DropdownMenuPage {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuTriggerIcon,
  MorphChevron,
  MorphPlus,
  DrawnCheck,
  DropdownMenuValue,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuItemDescription,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  useDropdownMenu,
  panelVariants,
  itemVariants,
  unscaledRect,
  type DropdownMenuAnimation,
  type DropdownMenuHighlight,
  type DropdownMenuHighlightColor,
  type DropdownMenuIndicator,
};
