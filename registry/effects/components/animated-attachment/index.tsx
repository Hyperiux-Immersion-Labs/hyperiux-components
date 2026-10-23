// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { createPortal } from "react-dom";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { animate, AnimatePresence, motion, MotionConfig, Reorder, useDragControls, useMotionValue, useScroll, useSpring, useTransform, useVelocity, type HTMLMotionProps, type MotionValue } from "motion/react";
import { FileArchiveIcon, FileSpreadsheetIcon, FileTextIcon, PlusIcon, RotateCwIcon, XIcon } from "lucide-react";
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

function slotAttr(name: string) {
  return { "data-slot": name };
}

export type AnimatedAttachmentTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedAttachmentMode = "light" | "dark";

const THEMES: Record<`${AnimatedAttachmentTheme}:${AnimatedAttachmentMode}`, Record<string, string>> = {
  "default:light": {
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "card": "oklch(1 0 0)",
    "card-foreground": "oklch(0.145 0 0)",
    "destructive": "oklch(0.577 0.245 27.325)",
    "foreground": "oklch(0.145 0 0)",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "oklch(0.922 0 0)",
    "muted": "oklch(0.92 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    "primary": "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    "ring": "oklch(0.708 0 0)",
    "secondary": "oklch(0.97 0 0)",
    "secondary-foreground": "oklch(0.205 0 0)",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "default:dark": {
    "background": "oklch(0.145 0 0)",
    "border": "oklch(1 0 0 / 10%)",
    "card": "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    "destructive": "oklch(0.704 0.191 22.216)",
    "foreground": "oklch(0.985 0 0)",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "oklch(1 0 0 / 15%)",
    "muted": "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    "primary": "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    "ring": "oklch(0.556 0 0)",
    "secondary": "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "caffeine:light": {
    "background": "#f9f9f9",
    "border": "#d8d8d8",
    "card": "#fcfcfc",
    "card-foreground": "#202020",
    "destructive": "#e54d2e",
    "foreground": "#202020",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#d8d8d8",
    "muted": "#efefef",
    "muted-foreground": "#646464",
    "primary": "#644a40",
    "primary-foreground": "#ffffff",
    "ring": "#644a40",
    "secondary": "#ffdfb5",
    "secondary-foreground": "#582d1d",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "caffeine:dark": {
    "background": "#111111",
    "border": "#201e18",
    "card": "#191919",
    "card-foreground": "#eeeeee",
    "destructive": "#e54d2e",
    "foreground": "#eeeeee",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#484848",
    "muted": "#222222",
    "muted-foreground": "#b4b4b4",
    "primary": "#ffe0c2",
    "primary-foreground": "#081a1b",
    "ring": "#ffe0c2",
    "secondary": "#393028",
    "secondary-foreground": "#ffe0c2",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "claude:light": {
    "background": "#faf9f5",
    "border": "#dad9d4",
    "card": "#faf9f5",
    "card-foreground": "#141413",
    "destructive": "#c0392b",
    "foreground": "#3d3929",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#b4b2a7",
    "muted": "#ede9de",
    "muted-foreground": "#83827d",
    "primary": "#c96442",
    "primary-foreground": "#ffffff",
    "ring": "#c96442",
    "secondary": "#e9e6dc",
    "secondary-foreground": "#535146",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "claude:dark": {
    "background": "#262624",
    "border": "#3e3e38",
    "card": "#262624",
    "card-foreground": "#faf9f5",
    "destructive": "#ef4444",
    "foreground": "#c3c0b6",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#52514a",
    "muted": "#1b1b19",
    "muted-foreground": "#b7b5a9",
    "primary": "#d97757",
    "primary-foreground": "#ffffff",
    "ring": "#d97757",
    "secondary": "#faf9f5",
    "secondary-foreground": "#30302e",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "ghibli:light": {
    "background": "#f3ecd9",
    "border": "#d5cba8",
    "card": "#f8f2e2",
    "card-foreground": "#4a4436",
    "destructive": "#c0533a",
    "foreground": "#4a4436",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#cfc59f",
    "muted": "#e6dec4",
    "muted-foreground": "#7a705a",
    "primary": "#6f9a5b",
    "primary-foreground": "#ffffff",
    "ring": "#6f9a5b",
    "secondary": "#dcd3b6",
    "secondary-foreground": "#4a4436",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "ghibli:dark": {
    "background": "#1f2a26",
    "border": "#3b4c45",
    "card": "#27342f",
    "card-foreground": "#e6e0cc",
    "destructive": "#e0745a",
    "foreground": "#e6e0cc",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#46584f",
    "muted": "#2c3a34",
    "muted-foreground": "#a8b39f",
    "primary": "#8fbf7a",
    "primary-foreground": "#15201a",
    "ring": "#8fbf7a",
    "secondary": "#34443d",
    "secondary-foreground": "#e6e0cc",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "spotify:light": {
    "background": "#ffffff",
    "border": "#e0e0e0",
    "card": "#f6f6f6",
    "card-foreground": "#191414",
    "destructive": "#e22134",
    "foreground": "#191414",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#d4d4d4",
    "muted": "#ececec",
    "muted-foreground": "#6a6a6a",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1db954",
    "secondary": "#f0f0f0",
    "secondary-foreground": "#191414",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "spotify:dark": {
    "background": "#121212",
    "border": "#2a2a2a",
    "card": "#181818",
    "card-foreground": "#ffffff",
    "destructive": "#f3727f",
    "foreground": "#ffffff",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#3a3a3a",
    "muted": "#1f1f1f",
    "muted-foreground": "#b3b3b3",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1ed760",
    "secondary": "#242424",
    "secondary-foreground": "#ffffff",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "valorant:light": {
    "background": "#ece8e1",
    "border": "#cfc9bc",
    "card": "#f5f2ec",
    "card-foreground": "#0f1923",
    "destructive": "#bd3944",
    "foreground": "#0f1923",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#c4beb0",
    "muted": "#e2ddd2",
    "muted-foreground": "#5c6670",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "secondary": "#dcd7cc",
    "secondary-foreground": "#0f1923",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "valorant:dark": {
    "background": "#0f1923",
    "border": "#2b3a48",
    "card": "#16232f",
    "card-foreground": "#ece8e1",
    "destructive": "#ff6b76",
    "foreground": "#ece8e1",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#344454",
    "muted": "#1a2733",
    "muted-foreground": "#8b978f",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "secondary": "#1f2b37",
    "secondary-foreground": "#ece8e1",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "vscode:light": {
    "background": "#ffffff",
    "border": "#e5e5e5",
    "card": "#f8f8f8",
    "card-foreground": "#3b3b3b",
    "destructive": "#e51400",
    "foreground": "#3b3b3b",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#cecece",
    "muted": "#f3f3f3",
    "muted-foreground": "#717171",
    "primary": "#007acc",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "secondary": "#e5e5e5",
    "secondary-foreground": "#3b3b3b",
    "success": "oklch(0.596 0.145 163.225)",
    "warning": "oklch(0.769 0.188 70.08)"
  },
  "vscode:dark": {
    "background": "#1f1f1f",
    "border": "#3c3c3c",
    "card": "#252526",
    "card-foreground": "#cccccc",
    "destructive": "#f14c4c",
    "foreground": "#cccccc",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#3c3c3c",
    "muted": "#2a2d2e",
    "muted-foreground": "#9d9d9d",
    "primary": "#0e639c",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "secondary": "#3a3d41",
    "secondary-foreground": "#ffffff",
    "success": "oklch(0.696 0.17 162.48)",
    "warning": "oklch(0.769 0.188 70.08)"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedAttachmentTheme = "default", mode: AnimatedAttachmentMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  return { "data-theme": mode, style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

function ThemeScope({ children }: { children?: React.ReactNode }) {
  const themed = React.useContext(ThemeContext);
  return (
    <div {...themed} className="contents [:where(&_*)]:border-(--hx-border) [:where(&_*)]:outline-(--hx-ring)/50">
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

// ---- attachment.tsx ----

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, Flip, MorphSVGPlugin)

type MotionDivProps = Omit<HTMLMotionProps<"div">, "layout" | "values">

type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done"

const spring = { type: "spring", visualDuration: 0.4, bounce: 0.25 } as const
const settle = { type: "spring", visualDuration: 0.3, bounce: 0 } as const
const springyEase = "ease-[cubic-bezier(0.34,1.56,0.64,1)]"

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node)
  else if (ref) (ref as React.RefObject<T | null>).current = node
}

function matchParentRadius(rect: SVGRectElement | null) {
  const parent = rect?.ownerSVGElement?.parentElement
  if (!rect || !parent) return
  const radius = getComputedStyle(parent).borderTopLeftRadius
  rect.setAttribute("rx", radius)
  rect.setAttribute("ry", radius)
}

const subscribeNoop = () => () => {}
function useIsClient() {
  return React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )
}

const AttachmentReorderContext = React.createContext<{
  draggable: boolean
  /** The group's box: a dragged card can't leave it */
  constraints: React.RefObject<HTMLDivElement | null>
} | null>(null)

const AttachmentTiltContext = React.createContext<MotionValue<number> | null>(null)

const attachmentVariants = cva(
  "group/attachment relative isolate flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-md border bg-(--hx-card) text-(--hx-card-foreground) transition-colors focus-within:ring-1 focus-within:ring-(--hx-ring)/50 has-[>a,>button]:hover:bg-(--hx-muted)/50 data-[state=error]:border-(--hx-destructive)/30 data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default:
          "gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
        sm: "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
        xs: "gap-1.5 rounded-md text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
      },
    },
  }
)

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  animateEnter = true,
  enterDelay = 0,
  enterFrom,
  animateExit = true,
  borderTrace = true,
  shakeOnError = true,
  fill = false,
  fillDirection = "left-to-right",
  progress = 0,
  value,
  ref,
  style,
  onPointerDown,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: AttachmentState
    animateEnter?: boolean
    enterDelay?: number
    enterFrom?: { x: number; y: number }
    animateExit?: boolean
    borderTrace?: boolean
    shakeOnError?: boolean
    fill?: boolean
    fillDirection?: "left-to-right" | "bottom-to-top"
    /** 0–100. Drives the upload fill. */
    progress?: number
    value?: string | number
  }) {
  const reduceMotion = usePrefersReducedMotion()
  const reorderContext = React.useContext(AttachmentReorderContext)
  const inReorder = reorderContext !== null && value !== undefined
  const draggable = inReorder && reorderContext.draggable
  const dragControls = useDragControls()
  const node = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const skewX = React.useContext(AttachmentTiltContext)

  const setRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      node.current = el
      assignRef(ref, el)
    },
    [ref]
  )

  const flyFrom = React.useRef(enterFrom)
  React.useLayoutEffect(() => {
    const el = node.current
    const from = flyFrom.current
    if (!el || !from || reduceMotion) return
    el.scrollIntoView({ block: "nearest", inline: "nearest" })
    const rect = el.getBoundingClientRect()
    const ghost = el.cloneNode(true) as HTMLElement
    Object.assign(ghost.style, {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: "0",
      zIndex: "50",
      pointerEvents: "none",
      transform: "none",
      opacity: "0",
    })
    document.body.append(ghost)
    el.style.visibility = "hidden"
    const flight = animate(
      ghost,
      {
        x: [from.x - (rect.left + rect.width / 2), 0],
        y: [from.y - (rect.top + rect.height / 2), 0],
        scale: [0.3, 1],
        opacity: [0, 1],
      },
      { ...spring, visualDuration: 0.6, delay: enterDelay }
    )
    const land = () => {
      ghost.remove()
      el.style.visibility = ""
    }
    flight.then(land)
    return () => {
      flight.stop()
      land()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Shake when an upload fails.
  const lastState = React.useRef(state)
  React.useEffect(() => {
    const was = lastState.current
    lastState.current = state
    if (!shakeOnError || reduceMotion || state !== "error" || was === "error") return
    animate(x, [0, -6, 6, -4, 4, -2, 0], { duration: 0.45, ease: "easeOut" })
  }, [state, shakeOnError, reduceMotion, x])

  const flying = enterFrom !== undefined
  const filling = fill && (state === "uploading" || state === "processing")
  const motionProps = {
    ref: setRef,
    "data-slot": "attachment",
    "data-state": state,
    "data-filling": filling || undefined,
    "data-size": size,
    "data-orientation": orientation,
    className: cn(
      attachmentVariants({ size, orientation }),
      draggable && "cursor-grab select-none",
      className
    ),
    style: { ...style, x, ...(skewX && { skewX, originY: 1 }) },
    initial: animateEnter && !flying ? { opacity: 0, scale: 0.8 } : false,
    animate: { opacity: 1, scale: 1, transition: { ...spring, delay: enterDelay } },
    exit: animateExit ? { opacity: 0, scale: 0.8, transition: settle } : undefined,
    transition: { layout: spring },
    ...(props as MotionDivProps),
  }

  const horizontalFill = fillDirection === "left-to-right"
  const content = (
    <>
      <AnimatePresence>
        {filling && (
          <motion.span
            key="fill"
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
            exit={{ opacity: 0, transition: settle }}
          >
            <motion.span
              className={cn(
                "absolute inset-0 rounded-none bg-[color-mix(in_oklch,var(--hx-card),var(--hx-foreground)_12%)]",
                horizontalFill ? "origin-left" : "origin-bottom"
              )}
              initial={horizontalFill ? { scaleX: 0 } : { scaleY: 0 }}
              animate={horizontalFill ? { scaleX: progress / 100 } : { scaleY: progress / 100 }}
              transition={settle}
            />
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {borderTrace && (state === "uploading" || state === "processing") && (
          <AttachmentBorderTrace key="trace" />
        )}
      </AnimatePresence>
      {children}
    </>
  )

  return (
    <ReducedMotionConfig>
      {inReorder ? (
        <Reorder.Item
          as="div"
          value={value}
          dragListener={false}
          dragControls={dragControls}
          // Stays inside its row instead of following the pointer across the page
          dragConstraints={reorderContext?.constraints}
          dragElastic={0.08}
          whileDrag={{ scale: 1.04, zIndex: 10, cursor: "grabbing" }}
          onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
            onPointerDown?.(event)
            const onControl = (event.target as HTMLElement).closest("button, a, input")
            if (draggable && event.pointerType === "mouse" && !onControl) dragControls.start(event)
          }}
          {...motionProps}
        >
          {content}
        </Reorder.Item>
      ) : (
        <motion.div
          layout
          onPointerDown={onPointerDown}
          {...motionProps}
        >
          {content}
        </motion.div>
      )}
    </ReducedMotionConfig>
  )
}

function AttachmentBorderTrace() {
  const rect = React.useRef<SVGRectElement>(null)

  const reduceMotion = usePrefersReducedMotion()
  useGSAP(() => {
    matchParentRadius(rect.current)
    // Reduced motion: no endless loop (the trace is also hidden by motion-reduce:hidden)
    if (reduceMotion) return
    gsap.fromTo(
      rect.current,
      { strokeDashoffset: 0 },
      { strokeDashoffset: -100, duration: 1.4, ease: "none", repeat: -1 }
    )
  }, [reduceMotion])

  return (
    <motion.svg
      aria-hidden
      className="pointer-events-none absolute -inset-px z-10 size-[calc(100%+2px)] overflow-visible text-(--hx-primary) motion-reduce:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <rect
        ref={rect}
        width="100%"
        height="100%"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="22 78"
      />
    </motion.svg>
  )
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-(--hx-muted) text-(--hx-foreground) group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[state=error]/attachment:bg-(--hx-destructive)/10 group-data-[state=error]/attachment:text-(--hx-destructive) group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:transition-[opacity,scale,filter] *:duration-500 motion-reduce:*:transition-none group-data-filling/attachment:bg-(--hx-card) group-data-filling/attachment:opacity-100 [&_img]:transition-opacity [&_img]:duration-500 group-data-filling/attachment:[&_img]:opacity-60 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
)

function AttachmentMedia({
  className,
  variant = "icon",
  zoomOnHover = true,
  blurUntilLoaded = true,
  expandable = true,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentMediaVariants> & {
    zoomOnHover?: boolean
    blurUntilLoaded?: boolean
    expandable?: boolean
  }) {
  const isImage = variant === "image"
  const canExpand = isImage && expandable
  const [open, setOpen] = React.useState(false)
  const layoutId = React.useId()
  const isClient = useIsClient()

  const dialogRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const wasOpen = React.useRef(false)

  React.useEffect(() => {
    if (!open) {
      // Closing hands focus back to the thumbnail that opened it
      if (wasOpen.current) triggerRef.current?.focus({ preventScroll: true })
      wasOpen.current = false
      return
    }
    wasOpen.current = true
    // Focus moves into the preview; Escape closes it, and Tab stays on it (one focusable)
    dialogRef.current?.focus({ preventScroll: true })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
      if (event.key === "Tab") {
        event.preventDefault()
        dialogRef.current?.focus({ preventScroll: true })
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(
        attachmentMediaVariants({ variant }),
        isImage &&
          zoomOnHover &&
          cn("*:transition-[opacity,scale,filter] *:duration-500 group-hover/attachment:*:scale-110 motion-reduce:*:transition-none motion-reduce:group-hover/attachment:*:scale-100", springyEase),
        isImage &&
          blurUntilLoaded &&
          "transition-opacity duration-700 motion-reduce:transition-none group-data-[state=processing]/attachment:*:blur-xs group-data-[state=uploading]/attachment:*:blur-sm",
        className
      )}
      {...props}
    >
      {canExpand ? (
        <>
          {!open && (
            <motion.div
              ref={triggerRef}
              layoutId={layoutId}
              role="button"
              tabIndex={0}
              aria-label="Open preview"
              onTap={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  setOpen(true)
                }
              }}
              transition={spring}
              className="size-full cursor-zoom-in overflow-hidden rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-(--hx-ring)"
            >
              {children}
            </motion.div>
          )}
          {isClient &&
            createPortal(
              <ThemeScope><ReducedMotionConfig>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      key="preview"
                      className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-(--hx-background)/80 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setOpen(false)}
                    >
                      <motion.div
                        ref={dialogRef}
                        layoutId={layoutId}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Preview. Press Escape to close."
                        tabIndex={-1}
                        transition={spring}
                        className="aspect-square w-[min(80vw,80vh)] overflow-hidden rounded-md shadow-2xl outline-none [&_img]:size-full [&_img]:object-cover"
                      >
                        {children}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ReducedMotionConfig></ThemeScope>,
              document.body
            )}
        </>
      ) : (
        children
      )}
    </div>
  )
}

const SPINNER_PATH = "M21 12a9 9 0 1 1-6.219-8.56"
const CHECK_PATH = "M20 6 9 17l-5-5"
const CROSS_PATH = "M18 6 6 18M6 6l12 12"

function AttachmentStatusIcon({
  state,
  icon: Icon,
}: {
  state: AttachmentState
  icon: React.ComponentType
}) {
  const reduceMotion = usePrefersReducedMotion()
  const loading = state === "uploading" || state === "processing"
  const svg = React.useRef<SVGSVGElement>(null)
  const path = React.useRef<SVGPathElement>(null)
  const [showIcon, setShowIcon] = React.useState(state === "done" || state === "idle")
  const [iconEnters] = React.useState(!showIcon)
  const [initialPath] = React.useState(state === "error" ? CROSS_PATH : SPINNER_PATH)

  useGSAP(
    () => {
      if (showIcon || !path.current || !svg.current) return
      const target = loading ? SPINNER_PATH : state === "error" ? CROSS_PATH : CHECK_PATH
      gsap.to(path.current, {
        morphSVG: target,
        duration: reduceMotion ? 0 : 0.5,
        ease: "power2.inOut",
      })
      gsap.killTweensOf(svg.current, "rotation")
      if (loading && !reduceMotion) {
        gsap.to(svg.current, {
          rotation: "+=360",
          duration: 0.8,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        })
      } else {
        const turned = Number(gsap.getProperty(svg.current, "rotation"))
        gsap.to(svg.current, {
          rotation: Math.ceil(turned / 360) * 360,
          duration: reduceMotion ? 0 : 0.4,
          ease: "power2.out",
          transformOrigin: "50% 50%",
        })
      }
      if (state === "done") gsap.delayedCall(reduceMotion ? 0 : 1.1, () => setShowIcon(true))
    },
    { dependencies: [state, showIcon, loading, reduceMotion] }
  )

  if (showIcon) {
    return (
      <motion.span
        className="flex"
        initial={iconEnters ? { opacity: 0, scale: 0.4 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring}
      >
        <Icon />
      </motion.span>
    )
  }

  return (
    <svg
      ref={svg}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path ref={path} d={initialPath} />
    </svg>
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        className
      )}
      {...props}
    />
  )
}

// The shimmer is built in (the source relied on a `shimmer` class from its own global CSS,
// which installs won't have): a light band sweeps through the name while it uploads.
const SHIMMER_KEYFRAMES = "@keyframes hx-attachment-shimmer{from{background-position:150% 0}to{background-position:-50% 0}}"
// Written out in full so Tailwind can find every class. Reduced motion: no sweep, normal colour.
const SHIMMER_WHILE_UPLOADING = [
  "group-data-[state=uploading]/attachment:bg-[linear-gradient(90deg,var(--hx-foreground)_35%,var(--hx-muted-foreground)_50%,var(--hx-foreground)_65%)]",
  "group-data-[state=processing]/attachment:bg-[linear-gradient(90deg,var(--hx-foreground)_35%,var(--hx-muted-foreground)_50%,var(--hx-foreground)_65%)]",
  "group-data-[state=uploading]/attachment:bg-size-[200%_100%]",
  "group-data-[state=processing]/attachment:bg-size-[200%_100%]",
  "group-data-[state=uploading]/attachment:bg-clip-text",
  "group-data-[state=processing]/attachment:bg-clip-text",
  "group-data-[state=uploading]/attachment:text-transparent",
  "group-data-[state=processing]/attachment:text-transparent",
  "group-data-[state=uploading]/attachment:animate-[hx-attachment-shimmer_1.6s_linear_infinite]",
  "group-data-[state=processing]/attachment:animate-[hx-attachment-shimmer_1.6s_linear_infinite]",
  "group-data-[state=uploading]/attachment:motion-reduce:animate-none",
  "group-data-[state=processing]/attachment:motion-reduce:animate-none",
  "group-data-[state=uploading]/attachment:motion-reduce:bg-none",
  "group-data-[state=processing]/attachment:motion-reduce:bg-none",
  "group-data-[state=uploading]/attachment:motion-reduce:text-(--hx-foreground)",
  "group-data-[state=processing]/attachment:motion-reduce:text-(--hx-foreground)",
].join(" ")

function AttachmentTitle({
  className,
  shimmerText = true,
  ...props
}: React.ComponentProps<"span"> & {
  shimmerText?: boolean
}) {
  return (
    <>
      {shimmerText && <style>{SHIMMER_KEYFRAMES}</style>}
      <span
        data-slot="attachment-title"
        className={cn("block max-w-full min-w-0 truncate font-medium", shimmerText && SHIMMER_WHILE_UPLOADING, className)}
        {...props}
      />
    </>
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "mt-0.5 block min-w-0 truncate text-xs text-(--hx-muted-foreground) group-data-[state=error]/attachment:text-(--hx-destructive)/80",
        "max-w-full",
        className
      )}
      {...props}
    />
  )
}

function AttachmentProgress({
  className,
  value,
  rollingNumbers = true,
  ...props
}: React.ComponentProps<"span"> & {
  /** 0–100. */
  value: number
  rollingNumbers?: boolean
}) {
  const text = String(Math.round(value))

  if (!rollingNumbers) {
    return (
      <span data-slot="attachment-progress" className={cn("tabular-nums", className)} {...props}>
        {text}%
      </span>
    )
  }

  const digits = text.split("")
  return (
    <span data-slot="attachment-progress" className={cn("tabular-nums", className)} {...props}>
      <span className="sr-only">{text}%</span>
      {digits.map((digit, i) => (
        <RollingDigit key={digits.length - i} digit={Number(digit)} />
      ))}
      <span aria-hidden>%</span>
    </span>
  )
}

const digitRoll = { type: "spring", visualDuration: 0.15, bounce: 0 } as const

function RollingDigit({ digit }: { digit: number }) {
  return (
    <span aria-hidden className="relative inline-block [clip-path:inset(0)]">
      <span className="invisible">{digit}</span>
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: `${-digit * 10}%` }}
        transition={digitRoll}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n}>{n}</span>
        ))}
      </motion.span>
    </span>
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant,
  size = "icon-xs",
  revealAction = false,
  onClick,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  revealAction?: boolean
}) {
  const [turns, setTurns] = React.useState(0)

  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      onClick={(event) => {
        onClick?.(event)
        setTurns((t) => t + 1)
      }}
      className={cn(
        revealAction &&
          cn(
            "transition-[scale,rotate,opacity,background-color] duration-300 [&_svg]:transition-[rotate,scale] [&_svg]:duration-300 hover:[&_svg]:scale-110 hover:[&_svg]:rotate-90",
            // Reduced motion: the button just appears, with no spin or grow
            "motion-reduce:transition-none motion-reduce:[&_svg]:transition-none motion-reduce:hover:[&_svg]:rotate-0 motion-reduce:hover:[&_svg]:scale-100 motion-reduce:scale-100! motion-reduce:rotate-0!",
            "pointer-fine:scale-50 pointer-fine:-rotate-90 pointer-fine:opacity-0",
            "pointer-fine:group-hover/attachment:scale-100 pointer-fine:group-hover/attachment:rotate-0 pointer-fine:group-hover/attachment:opacity-100",
            "pointer-fine:group-focus-within/attachment:scale-100 pointer-fine:group-focus-within/attachment:rotate-0 pointer-fine:group-focus-within/attachment:opacity-100",
            springyEase,
            "[&_svg]:ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          ),
        className
      )}
      {...props}
    >
      <motion.span
        className="flex"
        initial={false}
        animate={{ rotate: turns * 360 }}
        transition={{ type: "spring", visualDuration: 0.6, bounce: 0.2 }}
      >
        {children}
      </motion.span>
    </Button>
  )
}

function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        ...slotAttr("attachment-trigger"),
        type: render ? type : (type ?? "button"),
        className: cn("absolute inset-0 z-10 outline-none", className),
      },
      props
    ),
    render,
  })
}

function AttachmentGroup({
  className,
  reorder = true,
  values,
  onReorder,
  tiltOnScroll = false,
  wrap = false,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  reorder?: boolean
  values?: (string | number)[]
  onReorder?: (values: (string | number)[]) => void
  tiltOnScroll?: boolean
  wrap?: boolean
}) {
  const scroller = React.useRef<HTMLDivElement>(null)
  const reduceMotion = usePrefersReducedMotion()
  const [initialWrap] = React.useState(wrap)

  React.useEffect(() => {
    const group = scroller.current
    if (!group || group.dataset.wrap === String(wrap)) return
    const apply = () => {
      group.dataset.wrap = String(wrap)
    }
    if (reduceMotion) return apply()
    const flip: { tween?: gsap.core.Timeline } = {}
    const frame = requestAnimationFrame(() => {
      const items = Array.from(
        group.querySelectorAll<HTMLElement>(":scope > [data-slot=attachment]")
      )
      const state = Flip.getState([group, ...items])
      apply()
      group.style.overflow = "clip"
      flip.tween = Flip.from(state, {
        duration: 0.6,
        ease: "power3.inOut",
        nested: true,
        stagger: 0.015,
        onComplete: () => {
          gsap.set(items, { clearProps: "transform,width,height" })
          gsap.set(group, { clearProps: "width,height,overflow" })
        },
      })
    })
    return () => {
      cancelAnimationFrame(frame)
      flip.tween?.progress(1)
    }
  }, [wrap, reduceMotion])
  React.useEffect(() => {
    const group = scroller.current
    if (!group) return
    const measure = () => {
      group.dataset.overflow = String(group.scrollWidth > group.clientWidth + 1)
    }
    const resize = new ResizeObserver(measure)
    const observeChildren = () => {
      resize.disconnect()
      resize.observe(group)
      for (const child of group.children) resize.observe(child)
      measure()
    }
    const mutations = new MutationObserver(observeChildren)
    mutations.observe(group, { childList: true })
    observeChildren()
    return () => {
      resize.disconnect()
      mutations.disconnect()
    }
  }, [])

  const { scrollX } = useScroll({ container: scroller })
  const speed = useSpring(useVelocity(scrollX), { stiffness: 300, damping: 40 })
  const lean = useTransform(speed, [-1500, 1500], [12, -12], { clamp: true })

  const reorderable = values !== undefined && onReorder !== undefined
  const reorderContext = React.useMemo(() => ({ draggable: reorder, constraints: scroller }), [reorder])
  const groupProps = {
    ref: scroller,
    "data-slot": "attachment-group",
    "data-wrap": String(initialWrap),
    className: cn(
      "relative flex min-w-0 [mask-image:linear-gradient(to_right,transparent,#000_2.5rem,#000_calc(100%-2.5rem),transparent)] snap-x snap-mandatory scroll-px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
      "data-[overflow=false]:[mask-image:none] data-[wrap=true]:snap-none data-[wrap=true]:[mask-image:none] data-[wrap=true]:flex-wrap data-[wrap=true]:overflow-visible",
      className
    ),
    style,
    ...(props as MotionDivProps),
  }

  return (
    <ReducedMotionConfig>
      <AttachmentReorderContext.Provider value={reorderable ? reorderContext : null}>
        {/* Reduced motion: no tilt (a manual spring, which MotionConfig doesn't reach) */}
        <AttachmentTiltContext.Provider value={tiltOnScroll && !reduceMotion ? lean : null}>
          {reorderable ? (
            // layoutScroll: the row scrolls sideways, so Motion must account for its scroll
            // when measuring cards, or dragged cards land in the wrong place and jump
            <Reorder.Group
              as="div"
              axis="x"
              layoutScroll
              values={values}
              onReorder={onReorder}
              {...groupProps}
            >
              {children}
            </Reorder.Group>
          ) : (
            <motion.div layoutScroll {...groupProps}>{children}</motion.div>
          )}
        </AttachmentTiltContext.Provider>
      </AttachmentReorderContext.Provider>
    </ReducedMotionConfig>
  )
}

function AttachmentDropzone({
  className,
  onFiles,
  animatedBorder = true,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  onFiles?: (files: File[], point: { x: number; y: number }) => void
  animatedBorder?: boolean
}) {
  const [dragging, setDragging] = React.useState(false)
  const hasFiles = (event: React.DragEvent) => event.dataTransfer.types.includes("Files")

  return (
    <div
      data-slot="attachment-dropzone"
      data-dragging={dragging || undefined}
      onDragOver={(event) => {
        if (!hasFiles(event)) return
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false)
      }}
      onDrop={(event) => {
        if (!hasFiles(event)) return
        event.preventDefault()
        setDragging(false)
        onFiles?.(Array.from(event.dataTransfer.files), { x: event.clientX, y: event.clientY })
      }}
      className={cn(
        "relative rounded-md border transition-colors data-dragging:bg-(--hx-muted)/50",
        animatedBorder ? "data-dragging:border-transparent" : "data-dragging:border-dashed data-dragging:border-(--hx-primary)",
        className
      )}
      {...props}
    >
      {children}
      <AnimatePresence>{animatedBorder && dragging && <MarchingBorder key="border" />}</AnimatePresence>
    </div>
  )
}

function MarchingBorder() {
  const rect = React.useRef<SVGRectElement>(null)
  // Reduced motion: the dashed border shows, but doesn't march
  const reduceMotion = usePrefersReducedMotion()
  React.useLayoutEffect(() => matchParentRadius(rect.current), [])

  return (
    <motion.svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full overflow-visible text-(--hx-primary)"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.rect
        ref={rect}
        width="100%"
        height="100%"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeDasharray="6 4"
        animate={reduceMotion ? undefined : { strokeDashoffset: [0, -20] }}
        transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
      />
    </motion.svg>
  )
}

// ---- demo: upload-demo.tsx ----

type State = "uploading" | "processing" | "error" | "done"

type Item = {
  id: string
  name: string
  size: number
  type: string
  kind: "file" | "image"
  state: State
  progress: number
  /** Object URL for uploaded images. */
  preview?: string
  gradient?: string
  error?: string
  retryable?: boolean
  failAt?: number
  /** Too big or the wrong type: fails with this message on the first tick (so it shakes) */
  rejectWith?: string
  from?: { x: number; y: number }
  delay: number
}

// Accepted types per "Accepted files" option (MIME prefixes / extensions)
const ACCEPT = {
  any: { label: "", input: undefined, test: () => true },
  images: { label: "Images only", input: "image/*", test: (file: File) => file.type.startsWith("image/") },
  documents: {
    label: "Documents only",
    input: ".pdf,.doc,.docx,.txt,.md,.xls,.xlsx,.csv,.ppt,.pptx",
    test: (file: File) => /\.(pdf|docx?|txt|md|xlsx?|csv|pptx?)$/i.test(file.name),
  },
} as const

/** Checked as files are added, so a file that can't be uploaded says why straight away. */
function rejectReason(file: File, maxSizeMB: number, accept: keyof typeof ACCEPT) {
  if (!ACCEPT[accept].test(file)) return `Not accepted · ${ACCEPT[accept].label.toLowerCase()}`
  if (maxSizeMB > 0 && file.size > maxSizeMB * 1024 * 1024) return `Over ${maxSizeMB} MB · ${formatSize(file.size)}`
  return undefined
}
const TICK = 200
const PROCESSING_TICKS = 5
const FAIL_CHANCE = 0.3
const DELETE_STAGGER_MS = 60

const seed: Item[] = [
  { id: "seed-1", name: "Q3-report.pdf", size: 2.4e6, type: "application/pdf", kind: "file", state: "done", progress: 100, delay: 0 },
  { id: "seed-2", name: "roast-schedule.xlsx", size: 1.1e6, type: "", kind: "file", state: "error", progress: 0, error: "Upload failed", retryable: true, delay: 0 },
  { id: "seed-3", name: "hero.jpg", size: 1.2e6, type: "image/jpeg", kind: "image", state: "done", progress: 100, gradient: "from-(--hx-warning) to-(--hx-destructive)", delay: 0 },
  { id: "seed-4", name: "beans.jpg", size: 8.6e5, type: "image/jpeg", kind: "image", state: "done", progress: 100, gradient: "from-(--hx-success) to-(--hx-info)", delay: 0 },
  { id: "seed-5", name: "cup.jpg", size: 2.1e6, type: "image/jpeg", kind: "image", state: "done", progress: 100, gradient: "from-(--hx-primary) to-(--hx-info)", delay: 0 },
]

const controls = {
  animateEnter: { group: "Adding", type: "checkbox", label: "Animate enter", value: true },
  stagger: { group: "Adding", type: "slider", label: "Stagger", value: 0.08, min: 0, max: 0.3, step: 0.01, unit: "s" },
  flyIn: { group: "Adding", type: "checkbox", label: "Fly in from drop", value: true },
  animatedBorder: { group: "Adding", type: "checkbox", label: "Animated border", value: true },

  animateExit: { group: "Layout", type: "checkbox", label: "Animate exit", value: true },

  rollingNumbers: { group: "Progress", type: "checkbox", label: "Rolling numbers", value: true },
  shimmerText: { group: "Progress", type: "checkbox", label: "Shimmer text", value: true },
  borderTrace: { group: "Progress", type: "checkbox", label: "Border trace", value: true },
  fill: { group: "Progress", type: "checkbox", label: "Card fill (images)", value: true },
  fillDirection: {
    disabled: (v: Record<string, unknown>) => !v.fill,
    group: "Progress",
    type: "select",
    label: "Fill direction",
    value: "bottom-to-top",
    options: [
      { label: "Left to right", value: "left-to-right" },
      { label: "Bottom to top", value: "bottom-to-top" },
    ],
  },

  shakeOnError: { group: "States", type: "checkbox", label: "Shake on error", value: true },

  revealAction: { group: "Hover", type: "checkbox", label: "Reveal action", value: true },
  zoomOnHover: { group: "Hover", type: "checkbox", label: "Zoom on hover", value: true },
  blurUntilLoaded: { group: "Hover", type: "checkbox", label: "Blur while uploading", value: true },
  expandable: { group: "Hover", type: "checkbox", label: "Expandable preview", value: true },

  reorder: { group: "Group", type: "checkbox", label: "Drag to reorder", value: true },
  tiltOnScroll: { group: "Group", type: "checkbox", label: "Tilt on scroll", value: false },
  wrap: { group: "Group", type: "checkbox", label: "Wrap", value: true },

  simulateFailures: { group: "Demo", type: "checkbox", label: "Simulate failures", value: true },

  maxSizeMB: {
    group: "Limits",
    type: "select",
    label: "Max file size",
    value: 5,
    options: [
      { label: "No limit", value: 0 },
      { label: "5 MB", value: 5 },
      { label: "10 MB", value: 10 },
      { label: "25 MB", value: 25 },
    ],
  },
  accept: {
    group: "Limits",
    type: "select",
    label: "Accepted files",
    value: "any",
    options: [
      { label: "Any", value: "any" },
      { label: "Images", value: "images" },
      { label: "Documents", value: "documents" },
    ],
  },
}

function truncateName(name: string, limit = 20) {
  return name.length > limit ? `${name.slice(0, limit)}…` : name
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function fileIcon(item: Item) {
  if (/sheet|excel|csv/.test(item.type) || /\.(xlsx?|csv)$/.test(item.name)) return FileSpreadsheetIcon
  if (/zip|compressed|tar/.test(item.type) || /\.(zip|rar|7z|tar|gz)$/.test(item.name)) return FileArchiveIcon
  return FileTextIcon
}

function UploadDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel

  const [items, setItems] = React.useState<Item[]>(seed)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const processing = React.useRef(new Map<string, number>())
  const deleteTimers = React.useRef<number[]>([])
  React.useEffect(() => () => deleteTimers.current.forEach((t) => window.clearTimeout(t)), [])

  const busy = items.some((item) => item.state === "uploading" || item.state === "processing")

  React.useEffect(() => {
    if (!busy) return
    const timer = window.setInterval(() => {
      setItems((current) =>
        current.map((item) => {
          if (item.state === "uploading") {
            if (item.rejectWith) {
              return { ...item, state: "error", error: item.rejectWith, rejectWith: undefined, retryable: false }
            }
            const progress = Math.min(100, item.progress + 4 + Math.random() * 9)
            if (item.failAt !== undefined && progress >= item.failAt) {
              return { ...item, progress, state: "error", error: "Upload failed", retryable: true }
            }
            return progress >= 100
              ? { ...item, progress: 100, state: "processing" }
              : { ...item, progress }
          }
          if (item.state === "processing") {
            const ticks = (processing.current.get(item.id) ?? 0) + 1
            processing.current.set(item.id, ticks)
            if (ticks < PROCESSING_TICKS) return item
            processing.current.delete(item.id)
            return { ...item, state: "done" }
          }
          return item
        })
      )
    }, TICK)
    return () => window.clearInterval(timer)
  }, [busy])

  const itemsRef = React.useRef(items)
  React.useEffect(() => {
    itemsRef.current = items
  })
  React.useEffect(
    () => () => itemsRef.current.forEach((item) => item.preview && URL.revokeObjectURL(item.preview)),
    []
  )

  function addFiles(files: File[], from?: { x: number; y: number }) {
    if (!files.length) return
    const added = files.map<Item>((file, i) => {
      const image = file.type.startsWith("image/")
      const rejected = rejectReason(file, values.maxSizeMB, values.accept as keyof typeof ACCEPT)
      if (rejected) {
        // Too big or the wrong type: fails with the reason on the first tick, no upload
        return {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          kind: "file",
          state: "uploading",
          progress: 0,
          rejectWith: rejected,
          from,
          delay: i * values.stagger,
        }
      }
      return {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        kind: image ? "image" : "file",
        state: "uploading",
        progress: 0,
        preview: image ? URL.createObjectURL(file) : undefined,
        failAt: values.simulateFailures && Math.random() < FAIL_CHANCE ? 30 + Math.random() * 50 : undefined,
        from,
        delay: i * values.stagger,
      }
    })
    setItems((current) => [...current, ...added])
  }

  function remove(id: string) {
    setItems((current) => {
      const item = current.find((i) => i.id === id)
      if (item?.preview) URL.revokeObjectURL(item.preview)
      return current.filter((i) => i.id !== id)
    })
    processing.current.delete(id)
  }

  function removeAll() {
    deleteTimers.current.forEach((t) => window.clearTimeout(t))
    const order = [
      ...items.filter((item) => item.kind === "file"),
      ...items.filter((item) => item.kind === "image"),
    ].reverse()
    deleteTimers.current = order.map((item, i) =>
      window.setTimeout(() => remove(item.id), i * DELETE_STAGGER_MS)
    )
  }

  function retry(id: string) {
    setItems((current) =>
      current.map((item) =>
        // Retries always succeed.
        item.id === id
          ? { ...item, state: "uploading", progress: 0, error: undefined, failAt: undefined, delay: 0 }
          : item
      )
    )
  }

  function reorder(kind: Item["kind"], ids: (string | number)[]) {
    setItems((current) => {
      const byId = new Map(current.map((item) => [item.id, item]))
      const moved = ids.flatMap((id) => byId.get(String(id)) ?? [])
      return [...moved, ...current.filter((item) => item.kind !== kind)]
    })
  }

  function describe(item: Item) {
    switch (item.state) {
      case "uploading":
        return (
          <>
            Uploading · <AttachmentProgress value={item.progress} rollingNumbers={values.rollingNumbers} />
          </>
        )
      case "processing":
        return "Processing…"
      case "error":
        return item.error ?? "Upload failed"
      case "done":
        return `${item.name.split(".").pop()?.toUpperCase()} · ${formatSize(item.size)}`
    }
  }

  function renderItem(item: Item) {
    const image = item.kind === "image"
    return (
      <Attachment
        key={item.id}
        value={item.id}
        state={item.state}
        orientation={image ? "vertical" : "horizontal"}
        animateEnter={values.animateEnter}
        enterDelay={item.delay}
        enterFrom={values.flyIn ? item.from : undefined}
        animateExit={values.animateExit}
        borderTrace={values.borderTrace}
        shakeOnError={values.shakeOnError}
        fill={image && values.fill}
        fillDirection={values.fillDirection as "left-to-right" | "bottom-to-top"}
        progress={item.progress}
      >
        {image ? (
          <AttachmentMedia
            variant="image"
            zoomOnHover={values.zoomOnHover}
            blurUntilLoaded={values.blurUntilLoaded}
            expandable={values.expandable}
          >
            {item.preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- local object URL
              <img src={item.preview} alt={item.name} draggable={false} />
            ) : (
              <div className={`size-full bg-linear-to-br ${item.gradient}`} />
            )}
          </AttachmentMedia>
        ) : (
          <AttachmentMedia>
            <AttachmentStatusIcon state={item.state} icon={fileIcon(item)} />
          </AttachmentMedia>
        )}
        <AttachmentContent>
          <AttachmentTitle shimmerText={values.shimmerText} title={item.name}>
            {truncateName(item.name)}
          </AttachmentTitle>
          <AttachmentDescription>{describe(item)}</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          {item.state === "error" && item.retryable && (
            <AttachmentAction
              variant={image ? "secondary" : undefined}
              aria-label={`Retry ${item.name}`}
              onClick={() => retry(item.id)}
            >
              <RotateCwIcon />
            </AttachmentAction>
          )}
          <AttachmentAction
            variant={image ? "secondary" : undefined}
            revealAction={values.revealAction}
            aria-label={`Remove ${item.name}`}
            onClick={() => remove(item.id)}
          >
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    )
  }

  const files = items.filter((item) => item.kind === "file")
  const images = items.filter((item) => item.kind === "image")

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-center text-sm text-(--hx-muted-foreground)">
          Click &ldquo;Add files&rdquo; or drop files here. Drag to reorder, click an image to open it.
        </p>
      </div>
      <div className="flex items-center justify-between gap-6">
        <Attachment state="idle" animateEnter={false}>
          <AttachmentMedia>
            <PlusIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Add files</AttachmentTitle>
            <AttachmentDescription>{values.maxSizeMB > 0 ? `Up to ${values.maxSizeMB} MB each` : "Any size"}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentTrigger aria-label="Add files" onClick={() => inputRef.current?.click()} />
        </Attachment>
        <button
          type="button"
          disabled={items.length === 0}
          onClick={removeAll}
          className={cn(
            "relative shrink-0 text-sm font-medium text-(--hx-muted-foreground) transition-[color,opacity] outline-none hover:text-(--hx-foreground) focus-visible:text-(--hx-foreground) disabled:pointer-events-none disabled:opacity-40",
            "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out",
            "hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100"
          )}
        >
          Delete all
        </button>
      </div>

      <AttachmentDropzone
        animatedBorder={values.animatedBorder}
        onFiles={addFiles}
        className="flex min-h-76 flex-col gap-4 p-6 max-md:p-4"
      >
        {/* Empty (e.g. after Delete all): say how to add files; clicking it opens the picker */}
        <AnimatePresence>
          {items.length === 0 && (
            <motion.button
              key="empty"
              type="button"
              onClick={() => inputRef.current?.click()}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="m-auto flex cursor-pointer flex-col items-center gap-1.5 rounded-md px-4 py-6 text-center outline-none focus-visible:ring-2 focus-visible:ring-(--hx-ring)"
            >
              <span className="text-sm font-medium text-(--hx-foreground)">No files yet</span>
              <span className="text-sm text-(--hx-muted-foreground)">
                Drop files here, or click to upload.
              </span>
            </motion.button>
          )}
        </AnimatePresence>
        <AttachmentGroup
          reorder={values.reorder}
          tiltOnScroll={values.tiltOnScroll}
          wrap={values.wrap}
          values={files.map((item) => item.id)}
          onReorder={(ids) => reorder("file", ids)}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {files.map(renderItem)}
          </AnimatePresence>
        </AttachmentGroup>

        <AttachmentGroup
          reorder={values.reorder}
          tiltOnScroll={values.tiltOnScroll}
          wrap={values.wrap}
          values={images.map((item) => item.id)}
          onReorder={(ids) => reorder("image", ids)}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {images.map(renderItem)}
          </AnimatePresence>
        </AttachmentGroup>

        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept={ACCEPT[values.accept as keyof typeof ACCEPT].input}
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []))
            e.target.value = ""
          }}
        />
      </AttachmentDropzone>

    </section>
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

export interface AnimatedAttachmentProps extends Partial<ControlValues> {
  theme?: AnimatedAttachmentTheme;
  mode?: AnimatedAttachmentMode;
  className?: string;
}

export default function AnimatedAttachment({ theme = "valorant", mode = "dark", className, ...props }: AnimatedAttachmentProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) motion-reduce:**:transition-none in-data-pc-rm:**:transition-none in-data-pc-rm:**:animate-none [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <UploadDemo {...props} />
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  Attachment,
  AttachmentGroup,
  AttachmentDropzone,
  AttachmentMedia,
  AttachmentStatusIcon,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentProgress,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
};
