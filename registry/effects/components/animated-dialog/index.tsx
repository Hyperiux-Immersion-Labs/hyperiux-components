// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { motion, AnimatePresence, MotionConfig, animate, type Transition } from "motion/react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
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

export type AnimatedDialogTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedDialogMode = "light" | "dark";

const THEMES: Record<`${AnimatedDialogTheme}:${AnimatedDialogMode}`, Record<string, string>> = {
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
function themeProps(theme: AnimatedDialogTheme = "default", mode: AnimatedDialogMode = "dark") {
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
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-md",
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
// 30% quicker than the original 0.5s, so the fill keeps up with the pointer
const HOVER_FILL_DURATION = 0.35

function useHoverFill() {
  const reduceMotion = usePrefersReducedMotion()
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
      transition={{ duration: reduceMotion ? 0 : HOVER_FILL_DURATION, ease: "easeInOut" }}
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

/** An outlined button with the hover fill. */
function FillButton({
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { place, circle, label } = useHoverFill()

  return (
    <Button
      variant="outline"
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        place(event, true)
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        place(event, false)
      }}
      className={cn(HOVER_FILL_CLASSES, className)}
      {...props}
    >
      {circle}
      {label(children)}
    </Button>
  )
}

// ---- dialog.tsx ----

type DialogRounded = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
type DialogBackdrop = "none" | "dim" | "blur"
type DialogExit = "fade" | "drop" | "shrink"

type DialogMotion = {
  /** Spring instead of an eased tween. */
  elastic: boolean
  /** Seconds. */
  duration: number
  /** Spring overshoot, 0–1. */
  bounce: number
  /** Grow from and back into trigger. */
  originFromTrigger: boolean
  /** Content fades in after the box. */
  fadeContent: boolean
  /** Content grows from 80% while fading. */
  scaleContent: boolean
  /** Content fades out before closing. */
  fadeContentOut: boolean
  /** Trigger text rolls up on hover. */
  rollingText: boolean
  /** Trigger fills from pointer on hover. */
  fillOnHover: boolean
  backdrop: DialogBackdrop
  exitAnimation: DialogExit
  /** Clicking outside closes the dialog. */
  dismissible: boolean
  /** Shake when outside click is blocked. */
  shakeOnBlock: boolean
  rounded: DialogRounded
}

const ROUNDED: Record<DialogRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
}

const BACKDROP: Record<DialogBackdrop, string> = {
  none: "bg-transparent",
  dim: "bg-black/40",
  blur: "bg-black/10 backdrop-blur-sm",
}

/** Where each exit leaves to. */
const EXIT: Record<DialogExit, { opacity: number; scale: number; y: string }> = {
  fade: { opacity: 0, scale: 0.97, y: "0%" },
  drop: { opacity: 0, scale: 1, y: "30%" },
  shrink: { opacity: 0, scale: 0.8, y: "0%" },
}

/** Fades content in after the box. */
function fadeInContent(popup: HTMLElement, scale: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const centreX = popup.clientWidth / 2
  const centreY = popup.clientHeight / 2
  for (const child of popup.querySelectorAll<HTMLElement>(":scope > *")) {
    const origin = `${centreX - child.offsetLeft}px ${centreY - child.offsetTop}px`
    const timing = { duration: 500, delay: 200, fill: "backwards" as const }
    child.animate([{ opacity: 0 }, { opacity: 1 }], {
      ...timing,
      easing: "cubic-bezier(0.45, 0, 0.55, 1)",
    })
    if (scale !== 1) {
      child.animate(
        [
          { scale: String(scale), transformOrigin: origin },
          { scale: "1", transformOrigin: origin },
        ],
        { ...timing, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      )
    }
  }
}

/** Content fade-out time, in seconds. */
const CONTENT_OUT = 0.15

function fadeOutContent(popup: HTMLElement) {
  for (const child of popup.querySelectorAll<HTMLElement>(":scope > *")) {
    child.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: CONTENT_OUT * 1000,
      easing: "ease-in",
      fill: "forwards",
    })
  }
}

type Point = { x: number; y: number }

const DialogContext = React.createContext<{
  open: boolean
  motion: DialogMotion
  origin: Point | null
  setOrigin: (origin: Point) => void
} | null>(null)

function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("Dialog parts must be used inside <Dialog>.")
  return context
}

function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  elastic = true,
  duration = 0.35,
  bounce = 0.2,
  originFromTrigger = true,
  fadeContent = true,
  scaleContent = false,
  fadeContentOut = true,
  rollingText = true,
  fillOnHover = true,
  backdrop = "blur",
  exitAnimation = "fade",
  dismissible = true,
  shakeOnBlock = true,
  rounded = "xl",
  ...props
}: DialogPrimitive.Root.Props & Partial<DialogMotion>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [origin, setOrigin] = React.useState<Point | null>(null)
  const open = openProp ?? uncontrolledOpen

  const context = React.useMemo(
    () => ({
      open,
      origin,
      setOrigin,
      motion: {
        elastic,
        duration,
        bounce,
        originFromTrigger,
        fadeContent,
        scaleContent,
        fadeContentOut,
        rollingText,
        fillOnHover,
        backdrop,
        exitAnimation,
        dismissible,
        shakeOnBlock,
        rounded,
      },
    }),
    [open, origin, elastic, duration, bounce, originFromTrigger, fadeContent, scaleContent, fadeContentOut, rollingText, fillOnHover, backdrop, exitAnimation, dismissible, shakeOnBlock, rounded]
  )

  return (
    <DialogContext.Provider value={context}>
      <ReducedMotionConfig>
        <DialogPrimitive.Root
          data-slot="dialog"
          open={open}
          onOpenChange={(next, details) => {
            setUncontrolledOpen(next)
            onOpenChange?.(next, details)
          }}
          disablePointerDismissal={!dismissible}
          {...props}
        />
      </ReducedMotionConfig>
    </DialogContext.Provider>
  )
}

function DialogTrigger({
  onClick,
  onPointerEnter,
  onPointerLeave,
  className,
  children,
  ...props
}: DialogPrimitive.Trigger.Props) {
  const { setOrigin, motion: options } = useDialog()
  const hover = useTriggerHover(options)

  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      onClick={(event) => {
        // Remember origin for grow-from-trigger.
        const rect = event.currentTarget.getBoundingClientRect()
        setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        onClick?.(event)
      }}
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
    </DialogPrimitive.Trigger>
  )
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  const { motion: options } = useDialog()
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      render={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeOut",
              delay: options.fadeContentOut ? CONTENT_OUT : 0,
            },
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      }
      className={cn("fixed inset-0 isolate z-50", BACKDROP[options.backdrop], className)}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  const { open, origin, motion: options } = useDialog()
  const popup = React.useRef<HTMLDivElement | null>(null)
  const reduceMotion = usePrefersReducedMotion()

  const enter: Transition = reduceMotion
    ? { duration: 0.2, ease: "easeOut" }
    : options.elastic
      ? { type: "spring", visualDuration: options.duration, bounce: options.bounce }
      : { duration: options.duration, ease: [0.22, 1, 0.36, 1] }

  // Reduced motion: fade only, in place.
  const originFromTrigger = options.originFromTrigger && origin !== null && !reduceMotion
  const still = { opacity: 0, scale: 1, x: 0, y: "0%" }
  const closed = reduceMotion
    ? still
    : originFromTrigger
      ? {
          opacity: 0,
          scale: 0.2,
          x: origin.x - window.innerWidth / 2,
          y: origin.y - window.innerHeight / 2,
        }
      : { opacity: 0, scale: 0.95, x: 0, y: "0%" }
  const leave = reduceMotion ? still : originFromTrigger ? closed : { ...EXIT[options.exitAnimation], x: 0 }

  const attach = React.useCallback(
    (node: HTMLDivElement | null) => {
      popup.current = node
      if (node && options.fadeContent) fadeInContent(node, options.scaleContent ? 0.8 : 1)
    },
    [options.fadeContent, options.scaleContent]
  )

  // Fade content out before exit.
  const fadeOut = options.fadeContentOut
  React.useEffect(() => {
    if (open || !fadeOut || !popup.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    fadeOutContent(popup.current)
  }, [open, fadeOut])
  const exitDelay = fadeOut && !reduceMotion ? CONTENT_OUT : 0

  const shake = () => {
    const node = popup.current
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    animate(node, { x: [0, -8, 8, -5, 5, -2, 0] }, { duration: 0.45, ease: "easeOut" })
  }

  return (
    <AnimatePresence>
      {open && (
        <DialogPortal keepMounted><ThemeScope>
          <DialogOverlay
            onPointerDown={!options.dismissible && options.shakeOnBlock ? shake : undefined}
          />
          <DialogPrimitive.Popup
            ref={attach}
            data-slot="dialog-content"
            render={
              <motion.div
                initial={closed}
                animate={{ opacity: 1, scale: 1, x: 0, y: "0%" }}
                exit={{
                  ...leave,
                  transition: reduceMotion
                    ? { duration: 0.2, ease: "easeOut" }
                    : originFromTrigger
                    ? {
                        type: "spring",
                        visualDuration: options.duration * 0.8,
                        bounce: 0,
                        delay: exitDelay,
                      }
                    : { duration: 0.2, ease: [0.4, 0, 1, 1], delay: exitDelay },
                }}
                transition={enter}
              />
            }
            className={cn(
              "fixed top-1/2 left-1/2 z-50 grid w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-6 bg-(--hx-muted) p-8 max-md:p-6 text-base text-(--hx-foreground) ring-1 ring-(--hx-foreground)/10 outline-none max-md:max-w-[calc(100%-2rem)]",
              ROUNDED[options.rounded],
              className
            )}
            {...props}
          >
            {children}
            {showCloseButton && (
              <DialogPrimitive.Close
                data-slot="dialog-close"
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={cn(
                      "absolute top-5 right-5 text-(--hx-muted-foreground) hover:bg-transparent hover:text-(--hx-foreground) in-data-[theme=dark]:hover:bg-transparent",
                      // Cross turns a quarter on hover.
                      "[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out hover:[&_svg]:rotate-90 focus-visible:[&_svg]:rotate-90 motion-reduce:[&_svg]:transition-none"
                    )}
                  />
                }
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Popup>
        </ThemeScope></DialogPortal>
      )}
    </AnimatePresence>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-8 -mb-8 flex justify-end gap-2 rounded-b-[inherit] border-t bg-(--hx-muted)/50 px-8 py-5 max-md:-mx-6 max-md:-mb-6 max-md:px-6 max-md:flex-col-reverse max-md:justify-start",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

/** Footer-sized button with hover fill. */
function DialogButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return <FillButton className={cn("h-auto px-3 py-2", className)} {...props} />
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-xl leading-tight font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-base leading-relaxed text-(--hx-muted-foreground) *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-(--hx-foreground)",
        className
      )}
      {...props}
    />
  )
}

// ---- demo: dialog-demo.tsx ----

const controls = {
  rollingText: { group: "Button", type: "checkbox", label: "Rolling text", value: true },
  fillOnHover: { group: "Button", type: "checkbox", label: "Fill on hover", value: true },

  originFromTrigger: { group: "Opening", type: "checkbox", label: "Origin from trigger", value: true },
  elastic: { group: "Opening", type: "checkbox", label: "Elastic", value: true },
  duration: {
    group: "Opening",
    type: "slider",
    label: "Duration",
    value: 0.4,
    min: 0.1,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  bounce: { disabled: (v: Record<string, unknown>) => !v.elastic, group: "Opening", type: "slider", label: "Bounce", value: 0.2, min: 0, max: 0.6, step: 0.05 },
  fadeContent: { group: "Opening", type: "checkbox", label: "Fade content", value: true },
  scaleContent: { disabled: (v: Record<string, unknown>) => !v.fadeContent, group: "Opening", type: "checkbox", label: "Scale content", value: false },

  exitAnimation: {
    disabled: (v: Record<string, unknown>) => !!v.originFromTrigger,
    group: "Closing",
    type: "select",
    label: "Exit animation",
    value: "fade",
    options: [
      { label: "Fade", value: "fade" },
      { label: "Drop", value: "drop" },
      { label: "Shrink", value: "shrink" },
    ],
  },
  fadeContentOut: { group: "Closing", type: "checkbox", label: "Fade content out", value: true },
  dismissible: { group: "Closing", type: "checkbox", label: "Click outside closes", value: true },
  shakeOnBlock: { disabled: (v: Record<string, unknown>) => !!v.dismissible, group: "Closing", type: "checkbox", label: "Shake when blocked", value: true },

  backdrop: {
    group: "Style",
    type: "select",
    label: "Backdrop",
    value: "blur",
    options: [
      { label: "None", value: "none" },
      { label: "Dim", value: "dim" },
      { label: "Blur", value: "blur" },
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
      { label: "3xl", value: "3xl" },
    ],
  },
}

function DialogDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-58 items-center justify-center">
        <Dialog
          {...values}
          backdrop={values.backdrop as DialogBackdrop}
          exitAnimation={values.exitAnimation as DialogExit}
          rounded={values.rounded as DialogRounded}
        >
          <DialogTrigger className="h-auto px-5 py-2.5 text-lg" render={<Button variant="outline" />}>Pause subscription</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pause your subscription?</DialogTitle>
              <DialogDescription>
                We&apos;ll skip your next two boxes. You can resume any time before Thursday noon
                and your next delivery goes out as usual.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<DialogButton />}>Keep it</DialogClose>
              <DialogClose render={<DialogButton />}>Pause</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-center text-sm text-(--hx-muted-foreground) max-lg:hidden">
        Tip: turn off &quot;Click outside closes&quot;, then click the backdrop.
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

export interface AnimatedDialogProps extends Partial<ControlValues> {
  theme?: AnimatedDialogTheme;
  mode?: AnimatedDialogMode;
  className?: string;
}

export default function AnimatedDialog({ theme = "valorant", mode = "dark", className, ...props }: AnimatedDialogProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <ReducedMotionConfig>
          <DialogDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  Dialog,
  DialogButton,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  type DialogBackdrop,
  type DialogExit,
  type DialogRounded,
};
