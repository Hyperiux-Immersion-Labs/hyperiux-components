// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { flushSync } from "react-dom";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { ChevronDownIcon, CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { MotionConfig, AnimatePresence, motion } from "motion/react";
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

export type AnimatedToastTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedToastMode = "light" | "dark";

const THEMES: Record<`${AnimatedToastTheme}:${AnimatedToastMode}`, Record<string, string>> = {
  "default:light": {
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "destructive": "oklch(0.577 0.245 27.325)",
    "foreground": "oklch(0.145 0 0)",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "oklch(0.922 0 0)",
    "muted": "oklch(0.92 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    "popover": "oklch(1 0 0)",
    "popover-foreground": "oklch(0.145 0 0)",
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
    "destructive": "oklch(0.704 0.191 22.216)",
    "foreground": "oklch(0.985 0 0)",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "oklch(1 0 0 / 15%)",
    "muted": "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    "popover": "oklch(0.205 0 0)",
    "popover-foreground": "oklch(0.985 0 0)",
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
    "destructive": "#e54d2e",
    "foreground": "#202020",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#d8d8d8",
    "muted": "#efefef",
    "muted-foreground": "#646464",
    "popover": "#fcfcfc",
    "popover-foreground": "#202020",
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
    "destructive": "#e54d2e",
    "foreground": "#eeeeee",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#484848",
    "muted": "#222222",
    "muted-foreground": "#b4b4b4",
    "popover": "#191919",
    "popover-foreground": "#eeeeee",
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
    "destructive": "#c0392b",
    "foreground": "#3d3929",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#b4b2a7",
    "muted": "#ede9de",
    "muted-foreground": "#83827d",
    "popover": "#ffffff",
    "popover-foreground": "#28261b",
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
    "destructive": "#ef4444",
    "foreground": "#c3c0b6",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#52514a",
    "muted": "#1b1b19",
    "muted-foreground": "#b7b5a9",
    "popover": "#30302e",
    "popover-foreground": "#e5e5e2",
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
    "destructive": "#c0533a",
    "foreground": "#4a4436",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#cfc59f",
    "muted": "#e6dec4",
    "muted-foreground": "#7a705a",
    "popover": "#f8f2e2",
    "popover-foreground": "#4a4436",
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
    "destructive": "#e0745a",
    "foreground": "#e6e0cc",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#46584f",
    "muted": "#2c3a34",
    "muted-foreground": "#a8b39f",
    "popover": "#27342f",
    "popover-foreground": "#e6e0cc",
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
    "destructive": "#e22134",
    "foreground": "#191414",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#d4d4d4",
    "muted": "#ececec",
    "muted-foreground": "#6a6a6a",
    "popover": "#ffffff",
    "popover-foreground": "#191414",
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
    "destructive": "#f3727f",
    "foreground": "#ffffff",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#3a3a3a",
    "muted": "#1f1f1f",
    "muted-foreground": "#b3b3b3",
    "popover": "#282828",
    "popover-foreground": "#ffffff",
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
    "destructive": "#bd3944",
    "foreground": "#0f1923",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#c4beb0",
    "muted": "#e2ddd2",
    "muted-foreground": "#5c6670",
    "popover": "#f5f2ec",
    "popover-foreground": "#0f1923",
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
    "destructive": "#ff6b76",
    "foreground": "#ece8e1",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#344454",
    "muted": "#1a2733",
    "muted-foreground": "#8b978f",
    "popover": "#1f2326",
    "popover-foreground": "#ece8e1",
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
    "destructive": "#e51400",
    "foreground": "#3b3b3b",
    "info": "oklch(0.588 0.158 241.966)",
    "input": "#cecece",
    "muted": "#f3f3f3",
    "muted-foreground": "#717171",
    "popover": "#f8f8f8",
    "popover-foreground": "#3b3b3b",
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
    "destructive": "#f14c4c",
    "foreground": "#cccccc",
    "info": "oklch(0.685 0.169 237.323)",
    "input": "#3c3c3c",
    "muted": "#2a2d2e",
    "muted-foreground": "#9d9d9d",
    "popover": "#252526",
    "popover-foreground": "#cccccc",
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
function themeProps(theme: AnimatedToastTheme = "default", mode: AnimatedToastMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  // Any theme but Default tints key parts with its primary colour
  return { "data-theme": mode, "data-accent": theme === "default" ? undefined : "", style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

// Keyframes and classes the component needs; no global CSS required
const COMPONENT_CSS = "@keyframes hx-toast-timer{from{transform:scaleX(1)}to{transform:scaleX(0)}}";

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

// ---- toast.tsx ----

const toast = ToastPrimitive.createToastManager()

type ToastRounded = "none" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"

const ROUNDED: Record<ToastRounded, string> = {
  none: "rounded-none",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
}

type ToastPosition =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center"

type ToastEffects = {
  elastic: boolean
  originFromTrigger: boolean
  tiltOnSwipe: boolean
  morphIcon: boolean
  showTimerBar: boolean
  collapsibleDescription: boolean
  fadeContent: boolean
  /** See-through, blurred background. */
  glass: boolean
  showAccentEdge: boolean
  rounded: ToastRounded
  pill: boolean
  exitAnimation: "fade" | "slide"
  position: ToastPosition
  timeout: number
}

const DEFAULT_EFFECTS: ToastEffects = {
  elastic: true,
  originFromTrigger: false,
  tiltOnSwipe: true,
  morphIcon: false,
  showTimerBar: true,
  fadeContent: true,
  collapsibleDescription: true,
  showAccentEdge: true,
  glass: true,
  rounded: "md",
  pill: false,
  exitAnimation: "fade",
  position: "bottom-center",
  timeout: 5000,
}

const ToastEffectsContext = React.createContext<ToastEffects>(DEFAULT_EFFECTS)

const StackShiftContext = React.createContext<(id: string, shift: number) => void>(
  () => {}
)

type ToastData = {
  origin?: { x: number; y: number }
}

function toastOrigin(element: Element): ToastData["origin"] {
  const rect = element.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

const VIEWPORT_POSITION: Record<ToastPosition, string> = {
  "bottom-right": "bottom-[10vh] sm:right-4 sm:left-auto sm:mx-0",
  "bottom-left": "bottom-[10vh] sm:right-auto sm:left-4 sm:mx-0",
  "bottom-center": "bottom-[10vh]",
  "top-right": "top-20 sm:right-4 sm:left-auto sm:mx-0",
  "top-left": "top-20 sm:right-auto sm:left-4 sm:mx-0",
  "top-center": "top-20",
}

const SWIPE_DIRECTIONS: Record<
  ToastPosition,
  ("up" | "down" | "left" | "right")[]
> = {
  "bottom-right": ["down", "right"],
  "bottom-left": ["down", "left"],
  "bottom-center": ["down"],
  "top-right": ["up", "right"],
  "top-left": ["up", "left"],
  "top-center": ["up"],
}

const STACK = {
  bottom: [
    "bottom-0 origin-bottom after:top-full",
    "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
    "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
  ],
  top: [
    "top-0 origin-top after:bottom-full",
    "[--offset-y:calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]",
    "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))]",
  ],
}

const EXIT = {
  slide: {
    bottom:
      "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(calc(100%+12vh))]",
    top: "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(calc(-100%-6rem))]",
  },
  fade: {
    bottom:
      "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:opacity-0 [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[scale:0.95]",
    top: "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:opacity-0 [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[scale:0.95]",
  },
}

const ENTER_FROM_EDGE = {
  bottom: "data-starting-style:[transform:translateY(150%)]",
  top: "data-starting-style:[transform:translateY(-150%)]",
}

const SWIPE_EXIT_TILT = [
  "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))_rotate(4deg)]",
  "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))_rotate(-12deg)]",
  "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))_rotate(12deg)]",
  "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))_rotate(-4deg)]",
  "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))_rotate(4deg)]",
  "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))_rotate(-12deg)]",
  "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))_rotate(12deg)]",
  "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))_rotate(-4deg)]",
  "data-ending-style:data-swipe-direction:opacity-0",
]
const SWIPE_EXIT_PLAIN = [
  "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
  "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
  "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
  "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
  "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
]
// Position, height, offset and scale all run for the same time, so the stack settles together
// instead of the heights snapping first. Elastic only adds a gentle overshoot to the move.
const TRANSITION = {
  springMorph:
    "[transition:transform_550ms_cubic-bezier(0.34,1.25,0.64,1),opacity_300ms,height_550ms_cubic-bezier(0.34,1.25,0.64,1),translate_550ms_cubic-bezier(0.22,1,0.36,1),scale_550ms_cubic-bezier(0.22,1,0.36,1)]",
  spring:
    "[transition:transform_550ms_cubic-bezier(0.34,1.25,0.64,1),opacity_300ms,height_550ms_cubic-bezier(0.34,1.25,0.64,1),translate_550ms_cubic-bezier(0.22,1,0.36,1),scale_550ms_cubic-bezier(0.22,1,0.36,1)]",
  smoothMorph:
    "[transition:transform_450ms_cubic-bezier(0.22,1,0.36,1),opacity_300ms,height_450ms_cubic-bezier(0.22,1,0.36,1),translate_450ms_cubic-bezier(0.22,1,0.36,1),scale_450ms_cubic-bezier(0.22,1,0.36,1)]",
  smooth:
    "[transition:transform_450ms_cubic-bezier(0.22,1,0.36,1),opacity_300ms,height_450ms_cubic-bezier(0.22,1,0.36,1),translate_450ms_cubic-bezier(0.22,1,0.36,1),scale_450ms_cubic-bezier(0.22,1,0.36,1)]",
}

// Coloured left line per type.
const ACCENT: Record<string, string> = {
  success: "before:bg-(--hx-success)",
  info: "before:bg-(--hx-info)",
  warning: "before:bg-(--hx-warning)",
  error: "before:bg-(--hx-destructive)",
}

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({
  className,
  style,
  ...props
}: ToastPrimitive.Viewport.Props) {
  const { position } = React.useContext(ToastEffectsContext)
  const { toasts } = ToastPrimitive.useToastManager()
  const [shifts, setShifts] = React.useState<Record<string, number>>({})
  const reportShift = React.useCallback((id: string, shift: number) => {
    setShifts((prev) => (prev[id] === shift ? prev : { ...prev, [id]: shift }))
  }, [])
  const front = toasts.find((t) => t.transitionStatus !== "ending") ?? toasts[0]
  const stackShift = front ? (shifts[front.id] ?? 0) : 0

  return (
    <StackShiftContext.Provider value={reportShift}>
      <ToastPrimitive.Viewport
        data-slot="toast-viewport"
        style={{ translate: `0 ${stackShift}px`, ...style }}
        className={cn(
          "pointer-events-none fixed inset-x-4 z-50 mx-auto w-auto max-w-md outline-none transition-[translate] duration-300 sm:max-w-[36rem] ease-out motion-reduce:transition-none sm:w-full",
          VIEWPORT_POSITION[position],
          className
        )}
        {...props}
      />
    </StackShiftContext.Provider>
  )
}

function Toast({
  className,
  origin,
  ref,
  ...props
}: ToastPrimitive.Root.Props & { origin?: ToastData["origin"] }) {
  const effects = React.useContext(ToastEffectsContext)
  const root = React.useRef<HTMLDivElement>(null)
  const edge = effects.position.startsWith("top") ? "top" : "bottom"
  const reduceMotion = usePrefersReducedMotion()
  const growFromOrigin = effects.originFromTrigger && origin !== undefined && !reduceMotion

  React.useLayoutEffect(() => {
    const el = root.current
    const viewport = el?.parentElement
    if (!growFromOrigin || !el || !viewport || !origin) return
    const box = viewport.getBoundingClientRect()
    const height = el.offsetHeight || 64
    const settleY =
      edge === "top" ? box.top + height / 2 : box.bottom - height / 2
    el.style.transition = "none"
    el.style.setProperty(
      "--from-x",
      `${origin.x - (box.left + box.width / 2)}px`
    )
    el.style.setProperty("--from-y", `${origin.y - settleY}px`)
    void el.offsetWidth
    el.style.transition = ""
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ToastPrimitive.Root
      ref={(node) => {
        root.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      data-slot="toast"
      swipeDirection={SWIPE_DIRECTIONS[effects.position]}
      className={cn(
        "group/toast pointer-events-auto absolute right-0 z-[calc(1000-var(--toast-index))] w-full border text-(--hx-popover-foreground) shadow-lg will-change-transform outline-none select-none focus-visible:border-(--hx-ring) focus-visible:ring-[3px] focus-visible:ring-(--hx-ring)/50",
        ROUNDED[effects.rounded],
        effects.glass
          ? "bg-(--hx-popover)/70 backdrop-blur-md backdrop-saturate-150"
          : "bg-(--hx-popover)",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height)",
        STACK[edge],
        effects.elastic
          ? effects.morphIcon
            ? TRANSITION.springMorph
            : TRANSITION.spring
          : effects.morphIcon
            ? TRANSITION.smoothMorph
            : TRANSITION.smooth,
        "motion-reduce:[transition:opacity_200ms] in-data-pc-rm:[transition:opacity_200ms] in-data-toast-resizing:[transition:opacity_300ms]",
        "after:absolute after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0",
        growFromOrigin
          ? "data-starting-style:opacity-0 data-starting-style:[transform:translate(var(--from-x),var(--from-y))_scale(0.3)]"
          : ENTER_FROM_EDGE[edge],
        EXIT[reduceMotion ? "fade" : effects.exitAnimation][edge],
        "data-ending-style:ease-in",
        effects.tiltOnSwipe && !reduceMotion ? SWIPE_EXIT_TILT : SWIPE_EXIT_PLAIN,
        className
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  const { pill, fadeContent } = React.useContext(ToastEffectsContext)
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-start gap-3 overflow-hidden py-4 sm:gap-4 sm:py-5 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        pill ? "px-6 sm:px-8" : "px-4 sm:px-5",
        fadeContent &&
          "transition-[opacity,scale,translate] duration-150 ease-out data-starting-style:opacity-0 animation-duration-300 [animation-delay:150ms] fill-mode-backwards motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-medium sm:text-lg", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-sm text-(--hx-muted-foreground) sm:text-lg", className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  const { pill } = React.useContext(ToastEffectsContext)
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn(
        "-my-1 shrink-0 sm:h-9 sm:px-4 sm:text-base",
        "transition-colors duration-200 hover:border-(--hx-foreground) hover:bg-(--hx-foreground) hover:text-(--hx-background) in-data-[theme=dark]:hover:bg-(--hx-foreground)",
        pill && "rounded-full",
        className
      )}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  const { pill } = React.useContext(ToastEffectsContext)
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        "relative -my-1 shrink-0 sm:size-9 sm:[&_svg]:size-5 text-(--hx-muted-foreground) after:absolute after:-inset-2 after:content-[''] hover:text-(--hx-foreground)",
        "hover:bg-transparent in-data-[theme=dark]:hover:bg-transparent",
        "[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out hover:[&_svg]:rotate-90 motion-reduce:[&_svg]:transition-none",
        pill && "rounded-full",
        className
      )}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </ToastPrimitive.Close>
  )
}

function DrawnCheckIcon() {
  const draw = (delay: number) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 0.35, delay, ease: "easeOut" as const },
  })
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <motion.circle cx="12" cy="12" r="10" {...draw(0)} />
      <motion.path d="m9 12 2 2 4-4" {...draw(0.25)} />
    </svg>
  )
}

function ToastIcon({ type }: { type: string | undefined }) {
  const { morphIcon: morphSetting } = React.useContext(ToastEffectsContext)
  const reduceMotion = usePrefersReducedMotion()
  const morphIcon = morphSetting && !reduceMotion
  const [firstType] = React.useState(type)
  const changed = type !== firstType

  let icon: React.ReactNode = null

  if (type === "success") {
    icon =
      morphIcon && changed ? (
        <DrawnCheckIcon />
      ) : (
        <CircleCheckIcon aria-hidden="true" />
      )
  }

  if (type === "info") {
    icon = <InfoIcon aria-hidden="true" />
  }

  if (type === "warning") {
    icon = <TriangleAlertIcon aria-hidden="true" />
  }

  if (type === "error") {
    icon = <OctagonXIcon className="text-(--hx-destructive)" aria-hidden="true" />
  }

  if (type === "loading") {
    icon = <Loader2Icon className="animate-spin motion-reduce:animate-none in-data-pc-rm:animate-none" aria-hidden="true" />
  }

  if (!icon) {
    return null
  }

  return (
    <span
      data-slot="toast-icon"
      className="relative mt-0.5 grid shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-[1.3rem]"
    >
      {morphIcon ? (
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={type}
            className="col-start-1 row-start-1 flex"
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {icon}
          </motion.span>
        </AnimatePresence>
      ) : (
        icon
      )}
    </span>
  )
}

function ToastTimerBar({ duration }: { duration: number }) {
  const { pill } = React.useContext(ToastEffectsContext)
  return (
    <span
      aria-hidden
      style={{ "--toast-timeout": `${duration}ms` } as React.CSSProperties}
      className={cn(
        "pointer-events-none absolute bottom-0 h-0.5 origin-left rounded-full bg-(--hx-foreground)/25 in-data-accent:bg-(--hx-primary)/70 animate-[hx-toast-timer_var(--toast-timeout)_linear_forwards] group-data-expanded/toast:paused motion-reduce:animate-none",
        pill ? "inset-x-8" : "inset-x-4"
      )}
    />
  )
}
const FADE_OUT_MS = 150

function ToastItem({ toastItem }: { toastItem: ToastPrimitive.Root.ToastObject<ToastData> }) {
  const effects = React.useContext(ToastEffectsContext)
  const reportShift = React.useContext(StackShiftContext)
  const [phase, setPhase] = React.useState<"closed" | "open" | "closing">(
    "closed"
  )
  const root = React.useRef<HTMLDivElement>(null)
  const shiftY = React.useRef(0)
  const closeTimer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const resize = (next: "open" | "closed", reduceMotion: boolean) => {
    const el = root.current
    const from = el?.offsetHeight
    flushSync(() => setPhase(next))
    if (!el || from === undefined) return
    // The stack stays put: the toast grows or shrinks upward and the ones above move with it
    shiftY.current = 0
    reportShift(toastItem.id, 0)
    if (reduceMotion) return
    // Measure the new natural height now, the same way Base UI does
    const inline = el.style.height
    el.style.height = "auto"
    const to = el.offsetHeight
    el.style.height = inline
    if (to === from) return
    const viewport = el.parentElement
    // Start the resize before Base UI measures, so it reads the animated height every frame.
    // The toasts above then follow those per-frame steps directly (their own easing would
    // restart on each step and stutter) until the resize ends.
    viewport?.setAttribute("data-toast-resizing", "")
    el.animate(
      [{ height: `${from}px` }, { height: `${to}px` }],
      // Same duration and easing as the stack's own move
      effects.elastic
        ? { duration: 550, easing: "cubic-bezier(0.34,1.25,0.64,1)" }
        : { duration: 450, easing: "cubic-bezier(0.22,1,0.36,1)" }
    ).finished.finally(() => viewport?.removeAttribute("data-toast-resizing"))
  }

  const toggleDescription = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (phase === "closed") {
      resize("open", reduceMotion)
      return
    }
    if (phase === "closing") return
    if (reduceMotion) {
      resize("closed", true)
      return
    }
    setPhase("closing")
    closeTimer.current = window.setTimeout(
      () => resize("closed", false),
      FADE_OUT_MS
    )
  }

  const duration = toastItem.timeout ?? effects.timeout
  const reduceMotion = usePrefersReducedMotion()
  // A bar that runs down is motion, so reduced motion leaves it out
  const showTimer =
    effects.showTimerBar && !reduceMotion && toastItem.type !== "loading" && duration > 0
  const accent =
    effects.showAccentEdge && toastItem.type && ACCENT[toastItem.type]
  const collapsible =
    effects.collapsibleDescription && Boolean(toastItem.description)

  return (
    <Toast
      ref={root}
      toast={toastItem}
      origin={toastItem.data?.origin}
      className={cn(
        accent &&
          cn(
            "before:absolute before:top-4 before:h-5 before:w-0.5 sm:before:top-5 sm:before:h-6 sm:before:w-[3px] before:rounded-full before:content-['']",
            effects.pill ? "before:left-3" : "before:left-2",
            accent
          )
      )}
    >
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastTitle />
          {(!collapsible || phase !== "closed") && (
            <ToastDescription
              className={cn(
                collapsible &&
                  (phase === "closing"
                    ? " data-ending-style:opacity-0 animation-duration-150 ease-in fill-mode-forwards"
                    : "transition-[opacity,scale,translate] duration-150 ease-out data-starting-style:opacity-0 animation-duration-200 [animation-delay:100ms] ease-out fill-mode-backwards"),
                "motion-reduce:animate-none"
              )}
            />
          )}
        </div>
        <ToastAction />
        {collapsible && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-expanded={phase === "open"}
            aria-label={phase === "open" ? "Hide details" : "Show details"}
            onClick={toggleDescription}
            className={cn(
              "-my-1 shrink-0 sm:size-9 sm:[&_svg]:size-5 text-(--hx-muted-foreground) hover:bg-transparent hover:text-(--hx-foreground) aria-expanded:bg-transparent aria-expanded:text-(--hx-foreground) in-data-[theme=dark]:hover:bg-transparent in-data-[theme=dark]:aria-expanded:bg-transparent",
              "[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out aria-expanded:[&_svg]:rotate-180 motion-reduce:[&_svg]:transition-none",
              effects.pill && "rounded-full"
            )}
          >
            <ChevronDownIcon aria-hidden="true" />
          </Button>
        )}
        <ToastClose />
        {showTimer && (
          <ToastTimerBar key={toastItem.type ?? "toast"} duration={duration} />
        )}
      </ToastContent>
    </Toast>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager<ToastData>()
  return toasts.map((toastItem) => (
    <ToastItem key={toastItem.id} toastItem={toastItem} />
  ))
}

function Toaster({
  children,
  toastManager = toast,
  timeout = DEFAULT_EFFECTS.timeout,
  elastic = DEFAULT_EFFECTS.elastic,
  originFromTrigger = DEFAULT_EFFECTS.originFromTrigger,
  tiltOnSwipe = DEFAULT_EFFECTS.tiltOnSwipe,
  morphIcon = DEFAULT_EFFECTS.morphIcon,
  showTimerBar = DEFAULT_EFFECTS.showTimerBar,
  fadeContent = DEFAULT_EFFECTS.fadeContent,
  collapsibleDescription = DEFAULT_EFFECTS.collapsibleDescription,
  glass = DEFAULT_EFFECTS.glass,
  showAccentEdge = DEFAULT_EFFECTS.showAccentEdge,
  rounded = DEFAULT_EFFECTS.rounded,
  exitAnimation = DEFAULT_EFFECTS.exitAnimation,
  position = DEFAULT_EFFECTS.position,
  ...props
}: ToastPrimitive.Provider.Props & Partial<Omit<ToastEffects, "pill">>) {
  const effects = React.useMemo(
    () => ({
      elastic,
      originFromTrigger,
      tiltOnSwipe,
      morphIcon,
      showTimerBar,
      fadeContent,
      collapsibleDescription,
      showAccentEdge,
      glass,
      rounded,
      pill: rounded === "full",
      exitAnimation,
      position,
      timeout,
    }),
    [
      elastic,
      originFromTrigger,
      tiltOnSwipe,
      morphIcon,
      showTimerBar,
      fadeContent,
      collapsibleDescription,
      showAccentEdge,
      glass,
      rounded,
      exitAnimation,
      position,
      timeout,
    ]
  )

  return (
    <ToastEffectsContext.Provider value={effects}>
      <ToastProvider toastManager={toastManager} timeout={timeout} {...props}>
        {children}
        <ToastPortal><ThemeScope>
          <ToastViewport>
            <ToastList />
          </ToastViewport>
        </ThemeScope></ToastPortal>
      </ToastProvider>
    </ToastEffectsContext.Provider>
  )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

// ---- demo: page.tsx ----

const messages = {
  default: {
    title: "Delivery rescheduled",
    description:
      "Your next box now arrives on Friday instead of Wednesday. You can change the day again from your account until Thursday noon.",
  },
  success: {
    title: "Order placed",
    description:
      "We've received your order and will roast it on Monday. You'll get an email with tracking as soon as it ships.",
  },
  info: {
    title: "Roast day is Monday",
    description:
      "Orders placed before Sunday midnight are roasted on Monday and ship fresh on Tuesday, so they reach you within a few days.",
  },
  warning: {
    title: "Card expires soon",
    description:
      "The card on your account expires at the end of this month. Update it before your next delivery so your subscription keeps running.",
  },
  error: {
    title: "Payment failed",
    description:
      "We couldn't charge your card for this box. Check your card details and try again, or pick another payment method.",
  },
} as const

const roast = () =>
  new Promise<string>((resolve) =>
    setTimeout(() => resolve("Ethiopia Guji"), 2000)
  )

const controls = {
  variant: {
    group: "Toast",
    type: "select",
    label: "Variant",
    value: "success",
    options: [
      { label: "Default", value: "default" },
      { label: "Success", value: "success" },
      { label: "Info", value: "info" },
      { label: "Warning", value: "warning" },
      { label: "Error", value: "error" },
      { label: "Loading → success", value: "loading" },
    ],
  },
  showDescription: {
    group: "Toast",
    type: "checkbox",
    label: "Description",
    value: true,
  },
  collapsibleDescription: {
    disabled: (v: Record<string, unknown>) => !v.showDescription,
    group: "Toast",
    type: "checkbox",
    label: "Collapsible description",
    value: true,
  },
  showAction: {
    group: "Toast",
    type: "checkbox",
    label: "Show action",
    value: true,
  },
  timeout: {
    group: "Behaviour",
    type: "slider",
    label: "Stays for",
    value: 5,
    min: 1,
    max: 15,
    step: 1,
    unit: "s",
  },

  elastic: {
    group: "Animation",
    type: "checkbox",
    label: "Elastic",
    value: true,
  },
  originFromTrigger: {
    group: "Animation",
    type: "checkbox",
    label: "Origin from trigger",
    value: false,
  },
  fadeContent: {
    group: "Animation",
    type: "checkbox",
    label: "Fade content",
    value: true,
  },
  exitAnimation: {
    group: "Animation",
    type: "select",
    label: "Exit animation",
    value: "fade",
    options: [
      { label: "Fade out", value: "fade" },
      { label: "Slide off", value: "slide" },
    ],
  },
  tiltOnSwipe: {
    group: "Animation",
    type: "checkbox",
    label: "Tilt on swipe",
    value: true,
  },
  morphIcon: {
    group: "Animation",
    type: "checkbox",
    label: "Loading → tick morph",
    value: false,
  },
  showTimerBar: {
    disabled: (v: Record<string, unknown>) => v.timeout === 0 || v.variant === "loading",
    group: "Animation",
    type: "checkbox",
    label: "Show timer bar",
    value: true,
  },

  glass: { group: "Style", type: "checkbox", label: "Glass", value: true },
  showAccentEdge: {
    disabled: (v: Record<string, unknown>) => v.variant === "default",
    group: "Style",
    type: "checkbox",
    label: "Show accent edge",
    value: true,
  },
  rounded: {
    group: "Style",
    type: "select",
    label: "Roundness",
    value: "md",
    options: [
      { label: "None", value: "none" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
      { label: "xl", value: "xl" },
      { label: "2xl", value: "2xl" },
      { label: "3xl", value: "3xl" },
      { label: "Full (pill)", value: "full" },
    ],
  },
  position: {
    group: "Style",
    type: "select",
    label: "Position",
    value: "bottom-center",
    options: [
      { label: "Bottom right", value: "bottom-right" },
      { label: "Bottom left", value: "bottom-left" },
      { label: "Bottom centre", value: "bottom-center" },
      { label: "Top right", value: "top-right" },
      { label: "Top left", value: "top-left" },
      { label: "Top centre", value: "top-center" },
    ],
  },
}

function ToastPage(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel

  const showToast = (trigger: HTMLElement) => {
    const common = {
      timeout: values.timeout * 1000,
      data: { origin: toastOrigin(trigger) },
    }
    const text = (message: { title: string; description: string }) => ({
      title: message.title,
      description: values.showDescription ? message.description : undefined,
    })

    if (values.variant === "loading") {
      toast.promise(roast(), {
        loading: {
          ...common,
          ...text({
            title: "Roasting your beans…",
            description:
              "This takes a couple of seconds. You can keep browsing while we get your order ready.",
          }),
        },
        success: (origin) => ({
          ...common,
          type: "success",
          ...text({
            title: "Ready to ship",
            description: `${origin} is roasted, packed and waiting for the courier. You'll get tracking details by email shortly.`,
          }),
        }),
        error: {
          ...common,
          ...text({
            title: "Roasting failed",
            description:
              "Something went wrong while preparing your order. Try again in a moment, or contact us if it keeps happening.",
          }),
        },
      })
      return
    }

    const variant = values.variant as keyof typeof messages
    const id = toast.add({
      ...common,
      type: variant === "default" ? undefined : variant,
      ...text(messages[variant]),
      actionProps: values.showAction
        ? {
            children: "Undo",
            onClick: () =>
              toast.update(id, {
                type: "success",
                title: "Change undone",
                description: values.showDescription
                  ? "Everything is back the way it was."
                  : undefined,
                actionProps: undefined,
                timeout: 2000,
              }),
          }
        : undefined,
    })
  }

  return (
    <Toaster
      elastic={values.elastic}
      originFromTrigger={values.originFromTrigger}
      fadeContent={values.fadeContent}
      collapsibleDescription={values.collapsibleDescription}
      exitAnimation={values.exitAnimation as "fade" | "slide"}
      tiltOnSwipe={values.tiltOnSwipe}
      morphIcon={values.morphIcon}
      showTimerBar={values.showTimerBar}
      glass={values.glass}
      showAccentEdge={values.showAccentEdge}
      rounded={values.rounded as ToastRounded}
      position={values.position as ToastPosition}
    >
      <div className="mx-auto w-full max-w-2xl">
        <div className="mt-6 flex min-h-48 items-center justify-center">
          <Button
            variant="default"
            onClick={(event) => showToast(event.currentTarget)}
            className="h-auto px-[2.08rem] py-[1.3rem] text-[1.3rem] max-sm:px-6 max-sm:py-4 max-sm:text-lg"
          >
            Show toast
          </Button>
        </div>
      </div>

    </Toaster>
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

export interface AnimatedToastProps extends Partial<ControlValues> {
  theme?: AnimatedToastTheme;
  mode?: AnimatedToastMode;
  className?: string;
}

export default function AnimatedToast({ theme = "claude", mode = "dark", className, ...props }: AnimatedToastProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <style>{COMPONENT_CSS}</style>
        <ReducedMotionConfig>
          <ToastPage {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  toastOrigin,
  useToastManager,
  type ToastPosition,
  type ToastRounded,
};
