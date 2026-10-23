// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import * as React from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef, type HTMLAttributes } from "react";
import { animate, stagger, AnimatePresence, motion, MotionConfig, type Variants, LazyMotion, domMin, m, useAnimation, useMotionValue, useTransform } from "motion/react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { CheckIcon, MailPlusIcon } from "lucide-react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

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

function slotAttr(name: string) {
  return { "data-slot": name };
}

export type AnimatedSidebarTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedSidebarMode = "light" | "dark";

const THEMES: Record<`${AnimatedSidebarTheme}:${AnimatedSidebarMode}`, Record<string, string>> = {
  "default:light": {
    "accent-foreground": "oklch(0.205 0 0)",
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "destructive": "oklch(0.577 0.245 27.325)",
    "foreground": "oklch(0.145 0 0)",
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
    "sidebar": "oklch(0.96 0 0)",
    "sidebar-accent": "oklch(0.925 0 0)",
    "sidebar-accent-foreground": "oklch(0.205 0 0)",
    "sidebar-border": "oklch(0.922 0 0)",
    "sidebar-foreground": "oklch(0.145 0 0)",
    "sidebar-primary": "oklch(0.205 0 0)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-ring": "oklch(0.708 0 0)"
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
    "popover": "oklch(0.205 0 0)",
    "popover-foreground": "oklch(0.985 0 0)",
    "primary": "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    "ring": "oklch(0.556 0 0)",
    "secondary": "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)",
    "sidebar": "oklch(0.205 0 0)",
    "sidebar-accent": "oklch(0.269 0 0)",
    "sidebar-accent-foreground": "oklch(0.985 0 0)",
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-foreground": "oklch(0.985 0 0)",
    "sidebar-primary": "oklch(0.488 0.243 264.376)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-ring": "oklch(0.556 0 0)"
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
    "popover": "#fcfcfc",
    "popover-foreground": "#202020",
    "primary": "#644a40",
    "primary-foreground": "#ffffff",
    "ring": "#644a40",
    "secondary": "#ffdfb5",
    "secondary-foreground": "#582d1d",
    "sidebar": "#f5f0eb",
    "sidebar-accent": "#e8ddd2",
    "sidebar-accent-foreground": "#202020",
    "sidebar-border": "#d8d8d8",
    "sidebar-foreground": "#202020",
    "sidebar-primary": "#644a40",
    "sidebar-primary-foreground": "#ffffff",
    "sidebar-ring": "#644a40"
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
    "popover": "#191919",
    "popover-foreground": "#eeeeee",
    "primary": "#ffe0c2",
    "primary-foreground": "#081a1b",
    "ring": "#ffe0c2",
    "secondary": "#393028",
    "secondary-foreground": "#ffe0c2",
    "sidebar": "#18140f",
    "sidebar-accent": "#2a231b",
    "sidebar-accent-foreground": "#eeeeee",
    "sidebar-border": "#201e18",
    "sidebar-foreground": "#eeeeee",
    "sidebar-primary": "#ffe0c2",
    "sidebar-primary-foreground": "#081a1b",
    "sidebar-ring": "#ffe0c2"
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
    "popover": "#ffffff",
    "popover-foreground": "#28261b",
    "primary": "#c96442",
    "primary-foreground": "#ffffff",
    "ring": "#c96442",
    "secondary": "#e9e6dc",
    "secondary-foreground": "#535146",
    "sidebar": "#f5f4ee",
    "sidebar-accent": "#e9e6dc",
    "sidebar-accent-foreground": "#343434",
    "sidebar-border": "#ebebeb",
    "sidebar-foreground": "#3d3929",
    "sidebar-primary": "#c96442",
    "sidebar-primary-foreground": "#fbfbfb",
    "sidebar-ring": "#c96442"
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
    "popover": "#30302e",
    "popover-foreground": "#e5e5e2",
    "primary": "#d97757",
    "primary-foreground": "#ffffff",
    "ring": "#d97757",
    "secondary": "#faf9f5",
    "secondary-foreground": "#30302e",
    "sidebar": "#1f1e1d",
    "sidebar-accent": "#0f0f0e",
    "sidebar-accent-foreground": "#c3c0b6",
    "sidebar-border": "#eceae4",
    "sidebar-foreground": "#c3c0b6",
    "sidebar-primary": "#d97757",
    "sidebar-primary-foreground": "#fbfbfb",
    "sidebar-ring": "#d97757"
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
    "popover": "#f8f2e2",
    "popover-foreground": "#4a4436",
    "primary": "#6f9a5b",
    "primary-foreground": "#ffffff",
    "ring": "#6f9a5b",
    "secondary": "#dcd3b6",
    "secondary-foreground": "#4a4436",
    "sidebar": "#ebe3cb",
    "sidebar-accent": "#dcd3b6",
    "sidebar-accent-foreground": "#4a4436",
    "sidebar-border": "#d5cba8",
    "sidebar-foreground": "#4a4436",
    "sidebar-primary": "#6f9a5b",
    "sidebar-primary-foreground": "#ffffff",
    "sidebar-ring": "#6f9a5b"
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
    "popover": "#27342f",
    "popover-foreground": "#e6e0cc",
    "primary": "#8fbf7a",
    "primary-foreground": "#15201a",
    "ring": "#8fbf7a",
    "secondary": "#34443d",
    "secondary-foreground": "#e6e0cc",
    "sidebar": "#19231f",
    "sidebar-accent": "#2c3a34",
    "sidebar-accent-foreground": "#e6e0cc",
    "sidebar-border": "#3b4c45",
    "sidebar-foreground": "#e6e0cc",
    "sidebar-primary": "#8fbf7a",
    "sidebar-primary-foreground": "#15201a",
    "sidebar-ring": "#8fbf7a"
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
    "popover": "#ffffff",
    "popover-foreground": "#191414",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1db954",
    "secondary": "#f0f0f0",
    "secondary-foreground": "#191414",
    "sidebar": "#f5f5f5",
    "sidebar-accent": "#e8f8ee",
    "sidebar-accent-foreground": "#191414",
    "sidebar-border": "#e0e0e0",
    "sidebar-foreground": "#191414",
    "sidebar-primary": "#1db954",
    "sidebar-primary-foreground": "#000000",
    "sidebar-ring": "#1db954"
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
    "popover": "#282828",
    "popover-foreground": "#ffffff",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1ed760",
    "secondary": "#242424",
    "secondary-foreground": "#ffffff",
    "sidebar": "#000000",
    "sidebar-accent": "#1a1a1a",
    "sidebar-accent-foreground": "#ffffff",
    "sidebar-border": "#2a2a2a",
    "sidebar-foreground": "#ffffff",
    "sidebar-primary": "#1db954",
    "sidebar-primary-foreground": "#000000",
    "sidebar-ring": "#1ed760"
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
    "popover": "#f5f2ec",
    "popover-foreground": "#0f1923",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "secondary": "#dcd7cc",
    "secondary-foreground": "#0f1923",
    "sidebar": "#e4dfd4",
    "sidebar-accent": "#d5d0c4",
    "sidebar-accent-foreground": "#0f1923",
    "sidebar-border": "#cfc9bc",
    "sidebar-foreground": "#0f1923",
    "sidebar-primary": "#ff4655",
    "sidebar-primary-foreground": "#ffffff",
    "sidebar-ring": "#ff4655"
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
    "popover": "#1f2326",
    "popover-foreground": "#ece8e1",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "secondary": "#1f2b37",
    "secondary-foreground": "#ece8e1",
    "sidebar": "#0b121a",
    "sidebar-accent": "#1a2733",
    "sidebar-accent-foreground": "#ece8e1",
    "sidebar-border": "#2b3a48",
    "sidebar-foreground": "#ece8e1",
    "sidebar-primary": "#ff4655",
    "sidebar-primary-foreground": "#ffffff",
    "sidebar-ring": "#ff4655"
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
    "popover": "#f8f8f8",
    "popover-foreground": "#3b3b3b",
    "primary": "#007acc",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "secondary": "#e5e5e5",
    "secondary-foreground": "#3b3b3b",
    "sidebar": "#f3f3f3",
    "sidebar-accent": "#e4e6f1",
    "sidebar-accent-foreground": "#3b3b3b",
    "sidebar-border": "#e5e5e5",
    "sidebar-foreground": "#3b3b3b",
    "sidebar-primary": "#007acc",
    "sidebar-primary-foreground": "#ffffff",
    "sidebar-ring": "#007fd4"
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
    "popover": "#252526",
    "popover-foreground": "#cccccc",
    "primary": "#0e639c",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "secondary": "#3a3d41",
    "secondary-foreground": "#ffffff",
    "sidebar": "#181818",
    "sidebar-accent": "#37373d",
    "sidebar-accent-foreground": "#ffffff",
    "sidebar-border": "#2b2b2b",
    "sidebar-foreground": "#cccccc",
    "sidebar-primary": "#0e639c",
    "sidebar-primary-foreground": "#ffffff",
    "sidebar-ring": "#007fd4"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedSidebarTheme = "default", mode: AnimatedSidebarMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  // Any theme but Default tints key parts with its primary colour
  return { "data-theme": mode, "data-accent": theme === "default" ? undefined : "", style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

// Keyframes and classes the component needs; no global CSS required
const COMPONENT_CSS = "@keyframes hx-skeleton-sweep{from{background-position:0 0}to{background-position:60vw 0}}\n@keyframes hx-skeleton-sweep-wide{from{background-position:0 0}to{background-position:100vw 0}}\n.hx-skeleton-sweep{--skeleton-highlight:color-mix(in oklch,var(--hx-background) 85%,transparent);background-image:linear-gradient(100deg,transparent 25%,var(--skeleton-highlight) 50%,transparent 75%);background-size:60vw 100%;background-repeat:repeat-x;background-attachment:fixed;animation:hx-skeleton-sweep var(--skeleton-duration,1.6s) linear var(--skeleton-delay,0s) infinite}\n[data-theme=dark] .hx-skeleton-sweep{--skeleton-highlight:color-mix(in oklch,var(--hx-foreground) 9%,transparent)}\n.hx-skeleton-sweep[data-animation=wave]{background-image:linear-gradient(100deg,transparent 10%,var(--skeleton-highlight) 50%,transparent 90%);background-size:100vw 100%;animation-name:hx-skeleton-sweep-wide}\n@media (prefers-reduced-motion:reduce){.hx-skeleton-sweep{animation:none;background-image:none}}";

function ThemeScope({ children }: { children?: React.ReactNode }) {
  const themed = React.useContext(ThemeContext);
  return (
    <div {...themed} className="contents motion-reduce:**:transition-none in-data-pc-rm:**:transition-none in-data-pc-rm:**:animate-none [:where(&_*)]:border-(--hx-border) [:where(&_*)]:outline-(--hx-ring)/50">
      {children}
    </div>
  );
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

// ---- use-mobile.ts ----

const MOBILE_BREAKPOINT = 1024
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
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

// ---- input.tsx ----

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-(--hx-input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--hx-foreground) placeholder:text-(--hx-muted-foreground) focus-visible:border-(--hx-ring) focus-visible:ring-3 focus-visible:ring-(--hx-ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--hx-input)/50 disabled:opacity-50 aria-invalid:border-(--hx-destructive) aria-invalid:ring-3 aria-invalid:ring-(--hx-destructive)/20 md:text-sm in-data-[theme=dark]:bg-(--hx-input)/30 in-data-[theme=dark]:disabled:bg-(--hx-input)/80 in-data-[theme=dark]:aria-invalid:border-(--hx-destructive)/50 in-data-[theme=dark]:aria-invalid:ring-(--hx-destructive)/40",
        className
      )}
      {...props}
    />
  )
}

// ---- separator.tsx ----

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-(--hx-border) data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className
      )}
      {...props}
    />
  )
}

type SkeletonAnimation = "shimmer" | "pulse" | "wave" | "none"
type SkeletonRounded = "none" | "sm" | "md" | "lg" | "xl" | "full"

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

// ---- tooltip.tsx ----

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  positionerClassName,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    positionerClassName?: string
  }) {
  return (
    <TooltipPrimitive.Portal><ThemeScope>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={cn("isolate z-50", positionerClassName)}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-(--hx-foreground) px-3 py-1.5 text-xs text-(--hx-background) has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:data-starting-style:-translate-y-2 data-[side=inline-end]:data-starting-style:-translate-x-2 data-[side=inline-start]:data-starting-style:translate-x-2 data-[side=left]:data-starting-style:translate-x-2 data-[side=right]:data-starting-style:-translate-x-2 data-[side=top]:data-starting-style:translate-y-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm transition-[opacity,scale,translate] duration-150 ease-out data-[state=delayed-open]:data-starting-style:opacity-0 data-[state=delayed-open]:data-starting-style:scale-95 transition-[opacity,scale,translate] duration-150 ease-out data-open:data-starting-style:opacity-0 data-open:data-starting-style:scale-95  data-closed:data-ending-style:opacity-0 data-closed:data-ending-style:scale-95",
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-(--hx-foreground) fill-(--hx-foreground) data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </ThemeScope></TooltipPrimitive.Portal>
  )
}

// ---- popover.tsx ----

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  positionerClassName,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    positionerClassName?: string
  }) {
  return (
    <PopoverPrimitive.Portal><ThemeScope>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={cn("isolate z-50", positionerClassName)}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-(--hx-popover) p-2.5 text-sm text-(--hx-popover-foreground) shadow-md ring-1 ring-(--hx-foreground)/10 outline-hidden duration-100 data-[side=bottom]:data-starting-style:-translate-y-2 data-[side=inline-end]:data-starting-style:-translate-x-2 data-[side=inline-start]:data-starting-style:translate-x-2 data-[side=left]:data-starting-style:translate-x-2 data-[side=right]:data-starting-style:-translate-x-2 data-[side=top]:data-starting-style:translate-y-2 transition-[opacity,scale,translate] duration-150 ease-out data-open:data-starting-style:opacity-0 data-open:data-starting-style:scale-95  data-closed:data-ending-style:opacity-0 data-closed:data-ending-style:scale-95",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </ThemeScope></PopoverPrimitive.Portal>
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

// ---- calendar-icon.tsx ----

interface CalendarIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface CalendarIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  size?: number | string
  duration?: number
  isAnimated?: boolean
  color?: string
}

const CalendarIcon = forwardRef<CalendarIconHandle, CalendarIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 1,
      isAnimated = true,
      color,
      ...props
    },
    ref,
  ) => {
    const ringControls = useAnimation()
    const pageControls = useAnimation()
    const reduced = usePrefersReducedMotion()
    const isControlled = useRef(false)

    const start = useCallback(() => {
      if (reduced) return
      ringControls.start("flip")
      pageControls.start("flip")
    }, [ringControls, pageControls, reduced])

    const stop = useCallback(() => {
      ringControls.start("rest")
      pageControls.start("rest")
    }, [ringControls, pageControls])

    useImperativeHandle(ref, () => {
      isControlled.current = true
      return {
        startAnimation: start,
        stopAnimation: stop,
      }
    })

    const handleEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return
        if (!isControlled.current) start()
        else onMouseEnter?.(e)
      },
      [isAnimated, reduced, start, onMouseEnter],
    )

    const handleLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) stop()
        else onMouseLeave?.(e)
      },
      [stop, onMouseLeave],
    )

    const ringVariants: Variants = {
      rest: { y: 0 },
      flip: {
        y: [0, -1.5, 0],
        transition: { duration: 0.8 * duration, ease: [0.34, 1.4, 0.64, 1] },
      },
    }

    const pageVariants: Variants = {
      rest: { scaleY: 1 },
      flip: {
        scaleY: [1, 0.88, 1.03, 1],
        transition: {
          duration: 0.8 * duration,
          ease: [0.34, 1.4, 0.64, 1],
          times: [0, 0.35, 0.7, 1],
        },
      },
    }

    return (
      <LazyMotion features={domMin} strict>
        <m.div
          className={cn("inline-flex items-center justify-center", className)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          {...props}
          style={{ color, ...props.style }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            style={{ width: size, height: size }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <m.path
              d="M8 2v4"
              animate={ringControls}
              initial="rest"
              variants={ringVariants}
              style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
            />
            <m.path
              d="M16 2v4"
              animate={ringControls}
              initial="rest"
              variants={ringVariants}
              style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
            />
            <m.rect
              width="18"
              height="18"
              x="3"
              y="4"
              rx="2"
              animate={pageControls}
              initial="rest"
              variants={pageVariants}
              style={{ transformBox: "fill-box", transformOrigin: "top center" }}
            />
            <path d="M3 10h18" />
          </svg>
        </m.div>
      </LazyMotion>
    )
  },
)

CalendarIcon.displayName = "CalendarIcon"

// ---- coffee-icon.tsx ----

interface CoffeeIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface CoffeeIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  size?: number | string
  duration?: number
  isAnimated?: boolean
  color?: string
}

const CoffeeIcon = forwardRef<CoffeeIconHandle, CoffeeIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 1,
      isAnimated = true,
      color,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation()
    const reduced = usePrefersReducedMotion()
    const isControlled = useRef(false)

    useImperativeHandle(ref, () => {
      isControlled.current = true
      return {
        startAnimation: () =>
          reduced ? controls.start("normal") : controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      }
    })

    const handleEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return
        if (!isControlled.current) controls.start("animate")
        else onMouseEnter?.(e)
      },
      [controls, reduced, isAnimated, onMouseEnter],
    )

    const handleLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) {
          controls.start("normal")
        } else {
          onMouseLeave?.(e)
        }
      },
      [controls, onMouseLeave],
    )

    const cupVariants: Variants = {
      normal: {
        y: 0,
        transition: { duration: 0.2 * duration },
      },
      animate: {
        y: [0, -2, 0],
        transition: {
          duration: 0.6 * duration,
          ease: "easeInOut",
        },
      },
    }

    const steamVariants: Variants = {
      normal: {
        opacity: 1,
        y: 0,
      },
      animate: {
        opacity: [0.4, 1, 0.4, 1],
        y: [0, -4, 0],
        transition: {
          duration: 0.8 * duration,
          ease: "easeInOut",
        },
      },
    }

    return (
      <LazyMotion features={domMin} strict>
        <m.div
          className={cn("inline-flex items-center justify-center", className)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          {...props}
          style={{ color, ...props.style }}
        >
          <m.svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            style={{ width: size, height: size }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial="normal"
            animate={controls}
          >
            <m.path variants={steamVariants} d="M6 2v2" />
            <m.path variants={steamVariants} d="M10 2v2" />
            <m.path variants={steamVariants} d="M14 2v2" />
            <m.path
              variants={cupVariants}
              d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"
            />
          </m.svg>
        </m.div>
      </LazyMotion>
    )
  },
)

CoffeeIcon.displayName = "CoffeeIcon"

// ---- droplets-icon.tsx ----

interface DropletsIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface DropletsIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  size?: number | string
  duration?: number
  isAnimated?: boolean
  color?: string
}

const DropletsIcon = forwardRef<DropletsIconHandle, DropletsIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 1,
      isAnimated = true,
      color,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation()
    const reduced = usePrefersReducedMotion()
    const isControlled = useRef(false)

    useImperativeHandle(ref, () => {
      isControlled.current = true
      return {
        startAnimation: () =>
          reduced ? controls.start("normal") : controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      }
    })

    const handleEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return
        if (!isControlled.current) controls.start("animate")
        else onMouseEnter?.(e)
      },
      [controls, reduced, isAnimated, onMouseEnter],
    )

    const handleLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) {
          controls.start("normal")
        } else {
          onMouseLeave?.(e)
        }
      },
      [controls, onMouseLeave],
    )

    const dropletVariants: Variants = {
      normal: { scale: 1, opacity: 1 },
      animate: (i: number) => ({
        scale: [0, 1.12, 1],
        opacity: [0, 1, 1],
        transition: {
          duration: 0.5 * duration,
          delay: i * 0.14 * duration,
          times: [0, 0.65, 1],
          ease: [0.34, 1.4, 0.6, 1],
        },
      }),
    }

    return (
      <LazyMotion features={domMin} strict>
        <m.div
          className={cn("inline-flex items-center justify-center", className)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          {...props}
          style={{ color, ...props.style }}
        >
          <m.svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            style={{ width: size, height: size }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            initial="normal"
          >
            <m.path
              d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"
              custom={0}
              variants={dropletVariants}
              style={{ transformBox: "view-box", originX: "16px", originY: "13px" }}
            />
            <m.path
              d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"
              custom={1}
              variants={dropletVariants}
              style={{ transformBox: "view-box", originX: "7px", originY: "11px" }}
            />
          </m.svg>
        </m.div>
      </LazyMotion>
    )
  },
)

DropletsIcon.displayName = "DropletsIcon"

// ---- folder-icon.tsx ----

interface FolderIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface FolderIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  size?: number | string
  duration?: number
  isAnimated?: boolean
  color?: string
}

const FolderIcon = forwardRef<FolderIconHandle, FolderIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 1,
      isAnimated = true,
      color,
      ...props
    },
    ref,
  ) => {
    const folderControls = useAnimation()
    const reduced = usePrefersReducedMotion()
    const isControlled = useRef(false)

    useImperativeHandle(ref, () => {
      isControlled.current = true
      return {
        startAnimation: () =>
          reduced ? folderControls.start("normal") : folderControls.start("animate"),
        stopAnimation: () => folderControls.start("normal"),
      }
    })

    const handleEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return
        if (!isControlled.current) {
          folderControls.start("animate")
        } else {
          onMouseEnter?.(e)
        }
      },
      [folderControls, reduced, onMouseEnter, isAnimated],
    )

    const handleLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) {
          folderControls.start("normal")
        } else {
          onMouseLeave?.(e)
        }
      },
      [folderControls, onMouseLeave],
    )

    const folderVariants: Variants = {
      normal: { scale: 1, rotate: 0, y: 0 },
      animate: {
        scale: [1, 1.05, 0.98, 1],
        rotate: [0, -2, 2, 0],
        y: [0, -2, 1, 0],
        transition: { duration: 0.9 * duration, ease: "easeInOut" },
      },
    }

    return (
      <LazyMotion features={domMin} strict>
        <m.div
          className={cn("inline-flex items-center justify-center", className)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          {...props}
          style={{ color, ...props.style }}
        >
          <m.svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            style={{ width: size, height: size }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={folderControls}
            initial="normal"
            variants={folderVariants}
          >
            <m.path
              d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
              initial="normal"
              animate={folderControls}
              variants={folderVariants}
            />
          </m.svg>
        </m.div>
      </LazyMotion>
    )
  },
)

FolderIcon.displayName = "FolderIcon"

// ---- house-icon.tsx ----

interface HouseIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface HouseIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  size?: number | string
  duration?: number
  isAnimated?: boolean
  color?: string
}

const HouseIcon = forwardRef<HouseIconHandle, HouseIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 1,
      isAnimated = true,
      color,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation()
    const reduced = usePrefersReducedMotion()
    const isControlled = useRef(false)

    useImperativeHandle(ref, () => {
      isControlled.current = true
      return {
        startAnimation: () =>
          reduced ? controls.start("normal") : controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      }
    })

    const handleEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return
        if (!isControlled.current) controls.start("animate")
        else onMouseEnter?.(e)
      },
      [controls, reduced, isAnimated, onMouseEnter],
    )

    const handleLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) controls.start("normal")
        else onMouseLeave?.(e)
      },
      [controls, onMouseLeave],
    )

    const houseVariants: Variants = {
      normal: { scale: 1 },
      animate: {
        scale: [0.7, 1.06, 0.98, 1],
        transition: {
          duration: 0.55 * duration,
          times: [0, 0.55, 0.8, 1],
          ease: "easeOut",
        },
      },
    }

    const doorVariants: Variants = {
      normal: { scaleY: 1, opacity: 1 },
      animate: {
        scaleY: [0, 1],
        opacity: [0, 1],
        transition: {
          duration: 0.3 * duration,
          delay: 0.35 * duration,
          ease: "easeOut",
        },
      },
    }

    return (
      <LazyMotion features={domMin} strict>
        <m.div
          className={cn("inline-flex items-center justify-center", className)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          {...props}
          style={{ color, ...props.style }}
        >
          <m.svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            style={{ width: size, height: size }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            initial="normal"
          >
            <m.g
              variants={houseVariants}
              style={{ transformBox: "view-box", originX: "12px", originY: "21px" }}
            >
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10" />
              <path d="M21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9" />
              <m.path
                d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
                variants={doorVariants}
                style={{ transformBox: "view-box", originX: "12px", originY: "21px" }}
              />
            </m.g>
          </m.svg>
        </m.div>
      </LazyMotion>
    )
  },
)

HouseIcon.displayName = "HouseIcon"

// ---- inbox-icon.tsx ----

interface InboxIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface InboxIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  size?: number | string
  duration?: number
  isAnimated?: boolean
  color?: string
}

const InboxIcon = forwardRef<InboxIconHandle, InboxIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 1,
      isAnimated = true,
      color,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation()
    const reduced = usePrefersReducedMotion()
    const isControlled = useRef(false)

    useImperativeHandle(ref, () => {
      isControlled.current = true
      return {
        startAnimation: () =>
          reduced ? controls.start("normal") : controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      }
    })

    const handleEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return
        if (!isControlled.current) controls.start("animate")
        else onMouseEnter?.(e)
      },
      [controls, reduced, isAnimated, onMouseEnter],
    )

    const handleLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) {
          controls.start("normal")
        } else {
          onMouseLeave?.(e)
        }
      },
      [controls, onMouseLeave],
    )

    const bounceVariants: Variants = {
      normal: { y: 0 },
      animate: {
        y: [0, 2, -1, 0],
        transition: {
          duration: 0.6 * duration,
          times: [0, 0.4, 0.7, 1],
          ease: "easeInOut",
        },
      },
    }

    const slotVariants: Variants = {
      normal: { pathLength: 1, opacity: 1 },
      animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: {
          duration: 0.45 * duration,
          delay: 0.15 * duration,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    }

    return (
      <LazyMotion features={domMin} strict>
        <m.div
          className={cn("inline-flex items-center justify-center", className)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          {...props}
          style={{ color, ...props.style }}
        >
          <m.svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            style={{ width: size, height: size }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            initial="normal"
            variants={bounceVariants}
          >
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            <m.polyline
              points="22 12 16 12 14 15 10 15 8 12 2 12"
              variants={slotVariants}
            />
          </m.svg>
        </m.div>
      </LazyMotion>
    )
  },
)

InboxIcon.displayName = "InboxIcon"

// ---- search-icon.tsx ----

interface SearchIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface SearchIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  size?: number | string
  duration?: number
  isAnimated?: boolean
  color?: string
}

const SearchIcon = forwardRef<SearchIconHandle, SearchIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 1,
      isAnimated = true,
      color,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation()
    const reduced = usePrefersReducedMotion()
    const isControlled = useRef(false)

    useImperativeHandle(ref, () => {
      isControlled.current = true
      return {
        startAnimation: () =>
          reduced ? controls.start("normal") : controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      }
    })

    const handleEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return
        if (!isControlled.current) controls.start("animate")
        else onMouseEnter?.(e)
      },
      [controls, reduced, isAnimated, onMouseEnter],
    )

    const handleLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) controls.start("normal")
        else onMouseLeave?.(e)
      },
      [controls, onMouseLeave],
    )

    const lensVariants: Variants = {
      normal: { x: 0, y: 0, rotate: 0, opacity: 1 },
      animate: {
        x: [0, 2, -2, 1, 0],
        y: [0, -1, 2, -1, 0],
        rotate: [0, 6, -6, 4, 0],
        transition: {
          duration: 1.2 * duration,
          ease: "easeInOut" as const,
        },
      },
    }

    return (
      <LazyMotion features={domMin} strict>
        <m.div
          className={cn("inline-flex items-center justify-center", className)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          {...props}
          style={{ color, ...props.style }}
        >
          <m.svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            style={{ width: size, height: size }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            initial="normal"
          >
            <m.g variants={lensVariants}>
              <m.circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.34-4.34" />
            </m.g>
          </m.svg>
        </m.div>
      </LazyMotion>
    )
  },
)

SearchIcon.displayName = "SearchIcon"

// ---- settings-icon.tsx ----

interface SettingsIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface SettingsIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  size?: number | string
  duration?: number
  isAnimated?: boolean
  color?: string
}

const SettingsIcon = forwardRef<SettingsIconHandle, SettingsIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 1,
      isAnimated = true,
      color,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation()
    const reduced = usePrefersReducedMotion()
    const isControlled = useRef(false)

    useImperativeHandle(ref, () => {
      isControlled.current = true
      return {
        startAnimation: () =>
          reduced ? controls.start("normal") : controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      }
    })

    const handleEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return
        if (!isControlled.current) controls.start("animate")
        else onMouseEnter?.(e)
      },
      [controls, reduced, isAnimated, onMouseEnter],
    )

    const handleLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) controls.start("normal")
        else onMouseLeave?.(e)
      },
      [controls, onMouseLeave],
    )

    const groupSpin: Variants = {
      normal: { rotate: 0, scale: 1, y: 0 },
      animate: {
        rotate: [0, 16, 0],
        scale: [1, 1.06, 1],
        y: [0, -0.8, 0],
        transition: { duration: 0.9 * duration, ease: "easeInOut" },
      },
    }

    const gearDraw: Variants = {
      normal: { pathLength: 0, opacity: 1 },
      animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: 0.7 * duration,
          ease: "easeInOut",
          delay: 0.06,
        },
      },
    }

    const coreDraw: Variants = {
      normal: { pathLength: 0, scale: 1, opacity: 1 },
      animate: {
        pathLength: 1,
        scale: [1, 1.08, 1],
        opacity: [1, 1, 1],
        transition: {
          duration: 0.6 * duration,
          ease: "easeInOut",
          delay: 0.26,
        },
      },
    }

    const tickSpark = (delay: number): Variants => ({
      normal: { opacity: 0, scale: 0.6 },
      animate: {
        opacity: [0, 1, 0],
        scale: [0.6, 1.25, 1],
        transition: { duration: 0.35 * duration, ease: "easeOut", delay },
      },
    })

    return (
      <LazyMotion features={domMin} strict>
        <m.div
          className={cn("inline-flex items-center justify-center", className)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          {...props}
          style={{ color, ...props.style }}
        >
          <m.svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            style={{ width: size, height: size }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
           
          >
            <m.g variants={groupSpin} initial="normal" animate={controls}>
              <g>
                <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
                <circle cx="12" cy="12" r="3" />
              </g>

              <m.path
                d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
                pathLength={1}
                variants={gearDraw}
                initial="normal"
                animate={controls}
              />
              <m.circle
                cx="12"
                cy="12"
                r="3"
                pathLength={1}
                variants={coreDraw}
                initial="normal"
                animate={controls}
              />

              <m.circle
                cx="12"
                cy="4.6"
                r="0.8"
                fill="currentColor"
                variants={tickSpark(0.18)}
                initial="normal"
                animate={controls}
              />
              <m.circle
                cx="19"
                cy="8"
                r="0.7"
                fill="currentColor"
                variants={tickSpark(0.26)}
                initial="normal"
                animate={controls}
              />
              <m.circle
                cx="18.5"
                cy="16.5"
                r="0.7"
                fill="currentColor"
                variants={tickSpark(0.34)}
                initial="normal"
                animate={controls}
              />
              <m.circle
                cx="8"
                cy="18"
                r="0.7"
                fill="currentColor"
                variants={tickSpark(0.42)}
                initial="normal"
                animate={controls}
              />
              <m.circle
                cx="5.5"
                cy="9"
                r="0.7"
                fill="currentColor"
                variants={tickSpark(0.5)}
                initial="normal"
                animate={controls}
              />
            </m.g>
          </m.svg>
        </m.div>
      </LazyMotion>
    )
  },
)

SettingsIcon.displayName = "SettingsIcon"

// ---- utensils-icon.tsx ----

interface UtensilsIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface UtensilsIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  size?: number | string
  duration?: number
  isAnimated?: boolean
  color?: string
}

const UtensilsIcon = forwardRef<UtensilsIconHandle, UtensilsIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 1,
      isAnimated = true,
      color,
      ...props
    },
    ref,
  ) => {
    const forkControls = useAnimation()
    const knifeControls = useAnimation()
    const reduced = usePrefersReducedMotion()
    const isControlled = useRef(false)

    const start = useCallback(() => {
      if (reduced) return
      forkControls.start("set")
      knifeControls.start("set")
    }, [forkControls, knifeControls, reduced])

    const stop = useCallback(() => {
      forkControls.start("rest")
      knifeControls.start("rest")
    }, [forkControls, knifeControls])

    useImperativeHandle(ref, () => {
      isControlled.current = true
      return {
        startAnimation: start,
        stopAnimation: stop,
      }
    })

    const handleEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return
        if (!isControlled.current) start()
        else onMouseEnter?.(e)
      },
      [isAnimated, reduced, start, onMouseEnter],
    )

    const handleLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) stop()
        else onMouseLeave?.(e)
      },
      [stop, onMouseLeave],
    )

    const forkVariants: Variants = {
      rest: { rotate: 0 },
      set: {
        rotate: [0, -9, 2, 0],
        transition: {
          duration: 0.8 * duration,
          ease: [0.34, 1.4, 0.64, 1],
          times: [0, 0.4, 0.75, 1],
        },
      },
    }

    const knifeVariants: Variants = {
      rest: { rotate: 0 },
      set: {
        rotate: [0, 9, -2, 0],
        transition: {
          duration: 0.8 * duration,
          ease: [0.34, 1.4, 0.64, 1],
          times: [0, 0.4, 0.75, 1],
          delay: 0.08 * duration,
        },
      },
    }

    return (
      <LazyMotion features={domMin} strict>
        <m.div
          className={cn("inline-flex items-center justify-center", className)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          {...props}
          style={{ color, ...props.style }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            style={{ width: size, height: size }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <m.path
              d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"
              animate={forkControls}
              initial="rest"
              variants={forkVariants}
              style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
            />
            <m.path
              d="M7 2v20"
              animate={forkControls}
              initial="rest"
              variants={forkVariants}
              style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
            />
            <m.path
              d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"
              animate={knifeControls}
              initial="rest"
              variants={knifeVariants}
              style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
            />
          </svg>
        </m.div>
      </LazyMotion>
    )
  },
)

UtensilsIcon.displayName = "UtensilsIcon"

// ---- sidebar.tsx ----

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SMOOTH_EASE = "cubic-bezier(0.32, 0.72, 0, 1)"
const SPRING_EASE =
  "linear(0, 0.034 2.2%, 0.136 4.6%, 0.542 11.5%, 0.787 16.4%, 0.93 21.1%, 1.012 26.4%, 1.042 30.9%, 1.047 35.5%, 1.036 40.9%, 1.005 53.3%, 0.996 64%, 1)"
const spring = { type: "spring", visualDuration: 0.35, bounce: 0.2 } as const
const glide = { ...spring, visualDuration: spring.visualDuration * 0.6 } as const

const MIN_WIDTH = 192
const MAX_WIDTH = 400
const COLLAPSE_BELOW = 150

/** Animation options, set on SidebarProvider. */
/** Tailwind radius names for menu items, resolved against the theme's `--radius` scale. */
type SidebarItemRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"

// Fixed values, as `rounded-(--sidebar-item-radius)` needs a real length (a theme var may not exist).
const ITEM_RADIUS: Record<SidebarItemRadius, string> = {
  none: "0px",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  full: "9999px",
}

type SidebarOptions = {
  resizable: boolean
  slideHighlight: boolean
  activeIndicator: "bar" | "dot" | "none"
  pressFeedback: boolean
  spinToggle: boolean
  rollingText: boolean
  elasticTooltips: boolean
  rollingNumbers: boolean
  highlightColor: "primary" | "muted"
  itemRounded: SidebarItemRadius
}

type SidebarContextProps = SidebarOptions & {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
  id: string
  setWidth: (width: number | null) => void
  setResizing: (resizing: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  resizable = false,
  slideHighlight = true,
  activeIndicator = "bar",
  pressFeedback = false,
  spinToggle = false,
  rollingText = false,
  elasticTooltips = false,
  rollingNumbers = true,
  highlightColor = "primary",
  itemRounded = "none",
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> &
  Partial<SidebarOptions> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }) {
  const isMobile = useIsMobile()
  const reducedMotion = usePrefersReducedMotion()
  const id = React.useId()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [width, setWidth] = React.useState<number | null>(null)
  const [resizing, setResizing] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      id,
      setWidth,
      setResizing,
      resizable,
      slideHighlight,
      activeIndicator,
      pressFeedback,
      spinToggle,
      rollingText,
      elasticTooltips,
      rollingNumbers,
      highlightColor,
      itemRounded,
    }),
    [
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      id,
      resizable,
      slideHighlight,
      activeIndicator,
      pressFeedback,
      spinToggle,
      rollingText,
      elasticTooltips,
      rollingNumbers,
      highlightColor,
      itemRounded,
    ]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
        <div
          data-slot="sidebar-wrapper"
          data-resizing={resizing || undefined}
          style={
            {
              "--sidebar-width": width === null ? SIDEBAR_WIDTH : `${width}px`,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              "--sidebar-ease": SMOOTH_EASE,
              "--sidebar-item-radius": ITEM_RADIUS[itemRounded],
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-(--hx-sidebar)",
            "data-resizing:cursor-col-resize data-resizing:select-none data-resizing:**:transition-none!",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </MotionConfig>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { isMobile, state } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-(--hx-sidebar) text-(--hx-sidebar-foreground)",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <MobileSidebar side={side} dir={dir}>
        {children}
      </MobileSidebar>
    )
  }

  return (
    <div
      className="group peer hidden text-(--hx-sidebar-foreground) lg:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-400 ease-(--sidebar-ease)",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        data-slot="sidebar-container"
        data-side={side}
        className={cn(
          "fixed inset-y-0 z-10 hidden h-full w-(--sidebar-width) transition-[left,right,width] duration-400 ease-(--sidebar-ease) data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] lg:flex",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex size-full flex-col bg-(--hx-sidebar) group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-(--hx-sidebar-border)"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function MobileSidebar({
  side,
  dir,
  children,
}: {
  side: "left" | "right"
  dir?: string
  children: React.ReactNode
}) {
  const { openMobile, setOpenMobile } = useSidebar()
  const reduceMotion = usePrefersReducedMotion()
  const panel = React.useRef<HTMLDivElement>(null)
  const sign = side === "left" ? -1 : 1
  const x = useMotionValue(0)
  const width = React.useRef(288)
  const backdrop = useTransform(x, (v) => 1 - Math.min(Math.abs(v) / width.current, 1))

  React.useEffect(() => {
    if (!openMobile) return
    const panelEl = panel.current
    width.current = panelEl?.offsetWidth ?? 288
    panelEl?.focus()
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpenMobile(false)
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [openMobile, setOpenMobile])

  const closed = sign * 320

  return (
    <>
      {!openMobile && (
        <motion.div
          aria-hidden
          className={cn(
            "fixed inset-y-0 z-40 w-5 touch-pan-y",
            side === "left" ? "left-0" : "right-0"
          )}
          onPanEnd={(_, info) => {
            if (info.offset.x * -sign > 40) setOpenMobile(true)
          }}
        />
      )}
      <AnimatePresence>
        {openMobile && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-70 bg-black/50"
              style={{ opacity: backdrop }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenMobile(false)}
            />
            <motion.div
              key="panel"
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label="Sidebar"
              tabIndex={-1}
              dir={dir}
              data-sidebar="sidebar"
              data-slot="sidebar"
              data-mobile="true"
              className={cn(
                "fixed inset-y-0 z-70 flex flex-col bg-(--hx-sidebar) text-(--hx-sidebar-foreground) shadow-xl outline-none",
                side === "left" ? "left-0" : "right-0"
              )}
              style={{ width: SIDEBAR_WIDTH_MOBILE, x }}
              initial={{ x: closed }}
              animate={{ x: 0 }}
              exit={{ x: closed, transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] } }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              // Swipe it back to close.
              drag="x"
              dragDirectionLock
              dragMomentum={false}
              dragConstraints={side === "left" ? { left: -400, right: 0 } : { left: 0, right: 400 }}
              dragElastic={side === "left" ? { left: 0, right: 0.05 } : { left: 0.05, right: 0 }}
              onDragEnd={(_, info) => {
                const swiped = info.offset.x * sign > width.current * 0.3 || info.velocity.x * sign > 500
                if (swiped) setOpenMobile(false)
                else animate(x, 0, reduceMotion ? { duration: 0 } : { type: "spring", visualDuration: 0.3, bounce: 0.2 })
              }}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function SidebarTriggerIcon({ hovered }: { hovered: boolean }) {
  const { state, isMobile, openMobile, spinToggle } = useSidebar()
  const opening = isMobile ? !openMobile : state === "collapsed"
  const reduceMotion = usePrefersReducedMotion()
  const arrow = spinToggle
    ? opening
      ? "M13 8L9 12L13 16"
      : "M10 8L14 12L10 16"
    : opening
      ? "M11 8L15 12L11 16"
      : "M14 8L10 12L14 16"
  const d = hovered ? arrow : "M9 3L9 12L9 21"
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ width: "1.25rem", height: "1.25rem" }}
      initial={false}
      animate={{ rotate: spinToggle && hovered ? 180 : 0 }}
      transition={reduceMotion ? { duration: 0 } : spring}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <motion.path initial={false} animate={{ d }} transition={reduceMotion ? { duration: 0 } : spring} />
    </motion.svg>
  )
}

function SidebarTrigger({
  className,
  onClick,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()
  const [hovered, setHovered] = React.useState(false)

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        setHovered(true)
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        setHovered(false)
      }}
      onFocus={(event) => {
        onFocus?.(event)
        setHovered(true)
      }}
      onBlur={(event) => {
        onBlur?.(event)
        setHovered(false)
      }}
      {...props}
    >
      <SidebarTriggerIcon hovered={hovered} />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar, resizable, open, setOpen, setWidth, setResizing } = useSidebar()
  const drag = React.useRef<{ x: number; width: number; moved: boolean } | null>(null)

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={() => {
        if (!resizable) toggleSidebar()
      }}
      onPointerDown={(event) => {
        if (!resizable || event.button !== 0) return
        const container = event.currentTarget.closest<HTMLElement>("[data-slot=sidebar-container]")
        drag.current = { x: event.clientX, width: container?.offsetWidth ?? 256, moved: false }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        const d = drag.current
        if (!d) return
        const dx = event.clientX - d.x
        if (!d.moved && Math.abs(dx) < 3) return
        if (!d.moved) {
          d.moved = true
          setResizing(true)
        }
        const next = d.width + dx
        if (next < COLLAPSE_BELOW) {
          if (open) setOpen(false)
        } else {
          if (!open) setOpen(true)
          setWidth(Math.min(Math.max(next, MIN_WIDTH), MAX_WIDTH))
        }
      }}
      onPointerUp={(event) => {
        const d = drag.current
        drag.current = null
        if (!d) return
        event.currentTarget.releasePointerCapture(event.pointerId)
        setResizing(false)
        if (!d.moved) toggleSidebar()
      }}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-(--hx-sidebar-border) sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-(--hx-sidebar)",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        resizable && "cursor-col-resize! hover:after:bg-(--hx-sidebar-ring)",
        className
      )}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-(--hx-background) md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("h-8 w-full bg-(--hx-background) shadow-none", className)}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-(--hx-sidebar-border)", className)}
      {...props}
    />
  )
}

function SidebarContent({
  className,
  children,
  onPointerOver,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<"div">) {
  const { container, box, handlers } = useGlide<HTMLDivElement>(
    "[data-sidebar=menu-button], [data-sidebar=menu-sub-button]"
  )

  return (
    <div
      ref={container}
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative isolate flex min-h-0 flex-1 flex-col gap-1 overflow-auto py-2 group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      onPointerOver={(event) => {
        onPointerOver?.(event)
        handlers.onPointerOver(event)
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        handlers.onPointerLeave()
      }}
      onFocus={(event) => {
        onFocus?.(event)
        handlers.onFocus(event)
      }}
      onBlur={(event) => {
        onBlur?.(event)
        handlers.onBlur(event)
      }}
      {...props}
    >
      <SidebarGlideHighlight box={box} />
      <SidebarGlideScopeContext.Provider value={true}>{children}</SidebarGlideScopeContext.Provider>
    </div>
  )
}

function SidebarGroup({
  className,
  label,
  ...props
}: React.ComponentProps<"div"> & {
  label?: string
}) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      role={label ? "group" : undefined}
      aria-label={label}
      className={cn("relative flex w-full min-w-0 flex-col px-2", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & React.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        ...slotAttr("sidebar-group-label"),
        className: cn(
          "flex h-8 shrink-0 origin-left items-center rounded-md px-2 text-xs font-medium text-(--hx-sidebar-foreground)/70 ring-(--hx-sidebar-ring) outline-hidden focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "[transition:margin_400ms_var(--sidebar-ease),scale_400ms_var(--sidebar-ease),opacity_200ms_ease-out] group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:scale-75 group-data-[collapsible=icon]:opacity-0",
          className
        ),
      },
      props
    ),
    render,
    state: {
      sidebar: "group-label",
    },
  })
}

function SidebarGroupAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button"> & React.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        ...slotAttr("sidebar-group-action"),
        className: cn(
          "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-(--hx-sidebar-foreground) ring-(--hx-sidebar-ring) outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-(--hx-sidebar-accent) hover:text-(--hx-sidebar-accent-foreground) focus-visible:ring-2 lg:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          className
        ),
      },
      props
    ),
    render,
    state: {
      sidebar: "group-action",
    },
  })
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}

const SidebarGlideScopeContext = React.createContext(false)

const SidebarMenuIndexContext = React.createContext(0)

type Box = { top: number; left: number; width: number; height: number }

const highlightBg = { primary: "bg-(--hx-primary)", muted: "bg-(--hx-sidebar-accent)" } as const
const primaryTone =
  "data-glide:text-(--hx-primary-foreground) active:bg-(--hx-primary) active:text-(--hx-primary-foreground) data-active:bg-(--hx-primary) data-active:text-(--hx-primary-foreground)"

function useGlide<T extends HTMLElement>(
  itemSelector: string,
  owns?: (item: HTMLElement, container: T) => boolean
) {
  const container = React.useRef<T>(null)
  const [box, setBox] = React.useState<Box | null>(null)
  const marked = React.useRef<HTMLElement | null>(null)
  const source = React.useRef<"pointer" | "focus" | null>(null)
  const clearTimer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(clearTimer.current), [])

  const mark = (item: HTMLElement | null) => {
    if (marked.current === item) return
    marked.current?.removeAttribute("data-glide")
    marked.current = item
    item?.setAttribute("data-glide", "")
  }

  const track = (target: EventTarget, from: "pointer" | "focus") => {
    const root = container.current
    const item = (target as Element).closest<HTMLElement>(itemSelector)
    if (!root || !item || !root.contains(item) || item.hasAttribute("data-no-glide")) return false
    if (owns && !owns(item, root)) return false
    window.clearTimeout(clearTimer.current)
    const b = item.getBoundingClientRect()
    const o = root.getBoundingClientRect()
    mark(item)
    source.current = from
    setBox({
      top: b.top - o.top + root.scrollTop,
      left: b.left - o.left + root.scrollLeft,
      width: b.width,
      height: b.height,
    })
    return true
  }

  const clear = () => {
    window.clearTimeout(clearTimer.current)
    mark(null)
    source.current = null
    setBox(null)
  }

  const handlers = {
    onPointerOver: (event: React.PointerEvent) => {
      if (event.pointerType !== "mouse" || track(event.target, "pointer")) return
      if (source.current === "pointer") {
        window.clearTimeout(clearTimer.current)
        clearTimer.current = window.setTimeout(clear, 120)
      }
    },
    onPointerLeave: () => clear(),
    onFocus: (event: React.FocusEvent) => {
      if ((event.target as Element).matches(":focus-visible")) track(event.target, "focus")
    },
    onBlur: (event: React.FocusEvent) => {
      if (source.current === "focus" && !container.current?.contains(event.relatedTarget as Node)) clear()
    },
  }

  return { container, box, handlers }
}

function SidebarGlideHighlight({ box, as = "div", className }: { box: Box | null; as?: "div" | "li"; className?: string }) {
  const { highlightColor } = useSidebar()
  const reduceMotion = usePrefersReducedMotion()
  const Element = as === "li" ? motion.li : motion.div
  return (
    <AnimatePresence>
      {box && (
        <Element
          key="glide"
          role="presentation"
          aria-hidden
          className={cn(
            "pointer-events-none absolute -z-10 rounded-(--sidebar-item-radius)",
            highlightColor === "primary" ? "bg-(--hx-primary)" : "bg-(--hx-sidebar-accent)/70",
            className
          )}
          initial={{ ...box, opacity: 0 }}
          animate={{ ...box, opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.15 } }}
          transition={reduceMotion ? { duration: 0 } : glide}
        />
      )}
    </AnimatePresence>
  )
}

function SidebarMenu({
  className,
  children,
  onPointerOver,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<"ul">) {
  const { container, box, handlers } = useGlide<HTMLUListElement>(
    "[data-sidebar=menu-button], [data-sidebar=menu-sub-button]",
    (item, menu) => item.closest("[data-slot=sidebar-menu]") === menu
  )
  const scoped = React.useContext(SidebarGlideScopeContext)

  return (
    <ul
      ref={container}
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("relative isolate flex w-full min-w-0 flex-col gap-1", className)}
      onPointerOver={(event) => {
        onPointerOver?.(event)
        if (!scoped) handlers.onPointerOver(event)
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        if (!scoped) handlers.onPointerLeave()
      }}
      onFocus={(event) => {
        onFocus?.(event)
        if (!scoped) handlers.onFocus(event)
      }}
      onBlur={(event) => {
        onBlur?.(event)
        if (!scoped) handlers.onBlur(event)
      }}
      {...props}
    >
      {!scoped && <SidebarGlideHighlight box={box} as="li" />}
      {React.Children.map(children, (child, index) => (
        <SidebarMenuIndexContext.Provider value={index}>{child}</SidebarMenuIndexContext.Provider>
      ))}
    </ul>
  )
}

function SidebarMenuItem({ className, style, ...props }: React.ComponentProps<"li">) {
  const index = React.useContext(SidebarMenuIndexContext)
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      style={{ "--sidebar-i": index, ...style } as React.CSSProperties}
      {...props}
    />
  )
}

const staggeredLabels =
  "[&>span:not([data-sidebar-fx]):not(:has(svg))]:transition-[opacity,translate] [&>span:not([data-sidebar-fx]):not(:has(svg))]:duration-300 [&>span:not([data-sidebar-fx]):not(:has(svg))]:ease-out [&>span:not([data-sidebar-fx]):not(:has(svg))]:delay-[calc(var(--sidebar-i,0)*40ms+150ms)] group-data-[collapsible=icon]:[&>span:not([data-sidebar-fx]):not(:has(svg))]:-translate-x-2 group-data-[collapsible=icon]:[&>span:not([data-sidebar-fx]):not(:has(svg))]:opacity-0 group-data-[collapsible=icon]:[&>span:not([data-sidebar-fx]):not(:has(svg))]:delay-0 group-data-[collapsible=icon]:[&>span:not([data-sidebar-fx]):not(:has(svg))]:duration-100"

function PulsingDot({ className }: { className?: string }) {
  return (
    <span className={cn("pointer-events-none absolute size-1.5 rounded-full bg-(--hx-sidebar-primary)", className)}>
      <span className="absolute inset-0 animate-ping rounded-full bg-inherit opacity-60 [animation-duration:1.6s] motion-reduce:hidden" />
    </span>
  )
}

function ActiveEffects({ isActive, sub = false }: { isActive: boolean; sub?: boolean }) {
  const { id, slideHighlight, activeIndicator, highlightColor } = useSidebar()
  if (!isActive) return null
  const indicatorId = `${id}-${sub ? "sub-" : ""}${activeIndicator}`
  return (
    <>
      {slideHighlight && (
        <motion.span
          data-sidebar-fx
          aria-hidden
          layoutId={`${id}-highlight`}
          transition={glide}
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-(--sidebar-item-radius)",
            highlightBg[highlightColor]
          )}
        />
      )}
      {activeIndicator === "bar" && (
        <motion.span
          data-sidebar-fx
          aria-hidden
          layoutId={slideHighlight ? indicatorId : undefined}
          transition={glide}
          className={cn(
            "pointer-events-none absolute rounded-full",
            sub
              ?
                "inset-y-0 -left-2.5 w-0.5 bg-(--hx-foreground)"
              : cn(
                  "top-1/2 left-1.5 h-4 w-0.75 -translate-y-1/2 group-data-[collapsible=icon]:hidden",
                  highlightColor === "primary" ? "bg-(--hx-primary-foreground)" : "bg-(--hx-sidebar-primary)"
                )
          )}
        />
      )}
      {activeIndicator === "dot" && (
        <motion.span
          data-sidebar-fx
          aria-hidden
          layoutId={slideHighlight ? indicatorId : undefined}
          transition={glide}
          className={cn(
            "pointer-events-none absolute top-1/2 size-1.5 -translate-y-1/2",
            sub ? "-left-3" : "left-2 group-data-[collapsible=icon]:hidden"
          )}
        >
          <PulsingDot
            className={cn(
              "inset-0",
              sub ? "bg-(--hx-foreground)" : highlightColor === "primary" && "bg-(--hx-primary-foreground)"
            )}
          />
        </motion.span>
      )}
    </>
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button relative isolate flex w-full items-center gap-2 rounded-(--sidebar-item-radius) p-2 text-left text-sm ring-(--hx-sidebar-ring) outline-hidden transition-[width,height,padding,scale,color] duration-400 ease-(--sidebar-ease) group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:p-1.5! hover:text-(--hx-sidebar-accent-foreground) focus-visible:ring-2 active:bg-(--hx-sidebar-accent) active:text-(--hx-sidebar-accent-foreground) disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-(--hx-sidebar-accent) data-open:hover:text-(--hx-sidebar-accent-foreground) data-active:bg-(--hx-sidebar-accent) data-active:font-medium data-active:text-(--hx-sidebar-accent-foreground) [&_svg]:size-5 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "hover:text-(--hx-sidebar-accent-foreground)",
        outline:
          "bg-(--hx-background) shadow-[0_0_0_1px_var(--hx-sidebar-border)] hover:bg-(--hx-sidebar-accent) hover:text-(--hx-sidebar-accent-foreground) hover:shadow-[0_0_0_1px_var(--hx-sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function SidebarMenuButton({
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  children,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const {
    isMobile,
    state,
    slideHighlight,
    pressFeedback,
    rollingText,
    elasticTooltips,
    highlightColor,
    activeIndicator,
  } = useSidebar()
  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        ...slotAttr("sidebar-menu-button"),
        className: cn(
          sidebarMenuButtonVariants({ variant, size }),
          staggeredLabels,
          variant === "default" && highlightColor === "primary" && primaryTone,
          activeIndicator === "bar" && "px-3.5",
          activeIndicator === "dot" && "px-5.5",
          slideHighlight && "data-active:bg-transparent",
          pressFeedback && "active:scale-[0.96]",
          className
        ),
        children: (
          <>
            <ActiveEffects isActive={isActive} />
            {rollingText ? rollLabels(children) : children}
          </>
        ),
      },
      props
    ),
    render: !tooltip ? render : <TooltipTrigger render={render} />,
    state: {
      sidebar: "menu-button",
      size,
      active: isActive,
    },
  })

  if (!tooltip) {
    return comp
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      {comp}
      <TooltipContent
        side="right"
        align="center"
        sideOffset={12}
        hidden={state !== "collapsed" || isMobile}
        positionerClassName="z-70"
        {...(elasticTooltips && {
          className: "data-open:data-starting-style:scale-75 data-[side=right]:data-starting-style:-translate-x-3 duration-[450ms] ease-[linear(0,0.034_2.2%,0.136_4.6%,0.542_11.5%,0.787_16.4%,0.93_21.1%,1.012_26.4%,1.042_30.9%,1.047_35.5%,1.036_40.9%,1.005_53.3%,0.996_64%,1)]",
          style: { animationDuration: "450ms", animationTimingFunction: SPRING_EASE },
        })}
        {...tooltip}
      />
    </Tooltip>
  )
}

function rollLabels(children: React.ReactNode) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement<{ className?: string; children?: React.ReactNode }>(child)) return child
    const text = child.props.children
    if (child.type !== "span" || (typeof text !== "string" && typeof text !== "number")) return child
    return <RollLabel className={child.props.className}>{text}</RollLabel>
  })
}

const power2Out = (t: number) => 1 - (1 - t) ** 3

function RollLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  const root = React.useRef<HTMLSpanElement>(null)
  const reduceMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    const el = root.current
    const item = el?.closest<HTMLElement>("[data-sidebar=menu-button], [data-sidebar=menu-sub-button]")
    const [text, copy] = el ? Array.from(el.children) : []
    if (!item || !text || !copy || reduceMotion) return
    animate(copy, { y: "100%" }, { duration: 0 })
    let over = false
    const sync = () => {
      const next = item.hasAttribute("data-glide")
      if (next === over) return
      over = next
      const tween = { duration: 0.4, ease: power2Out }
      animate(text, { y: over ? "-100%" : "0%" }, tween)
      animate(copy, { y: over ? "0%" : "100%" }, tween)
    }
    const observer = new MutationObserver(sync)
    observer.observe(item, { attributes: true, attributeFilter: ["data-glide"] })
    return () => observer.disconnect()
  }, [reduceMotion])

  return (
    <span ref={root} className={cn("relative block overflow-hidden", className)}>
      <span className="block truncate">{children}</span>
      <span aria-hidden className="absolute inset-x-0 top-0 block truncate">
        {children}
      </span>
    </span>
  )
}

function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    showOnHover?: boolean
  }) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        ...slotAttr("sidebar-menu-action"),
        className: cn(
          "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-(--hx-sidebar-foreground) ring-(--hx-sidebar-ring) outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-(--hx-sidebar-accent-foreground) peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-(--hx-sidebar-accent) hover:text-(--hx-sidebar-accent-foreground) focus-visible:ring-2 lg:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          showOnHover &&
            "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-(--hx-sidebar-accent-foreground) aria-expanded:opacity-100 lg:opacity-0",
          className
        ),
      },
      props
    ),
    render,
    state: {
      sidebar: "menu-action",
    },
  })
}

function SidebarMenuBadge({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "children"> & { children?: React.ReactNode }) {
  const { rollingNumbers, highlightColor } = useSidebar()
  const reduceMotion = usePrefersReducedMotion()
  const content = React.useRef<HTMLSpanElement>(null)
  const count = typeof children === "number" ? children : null

  const last = React.useRef(count)
  React.useEffect(() => {
    const changed = last.current !== count
    last.current = count
    if (!changed || !rollingNumbers || reduceMotion || !content.current) return
    animate(content.current, { scale: [1, 1.35, 1] }, { duration: 0.35, ease: "easeOut" })
  }, [count, rollingNumbers, reduceMotion])

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0, transition: { duration: 0.15, ease: "easeIn" } }}
      transition={spring}
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-(--hx-sidebar-foreground) tabular-nums select-none peer-hover/menu-button:text-(--hx-sidebar-accent-foreground) peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-(--hx-sidebar-accent-foreground)",
        "transition-colors duration-300 group-data-[collapsible=icon]:hidden",
        highlightColor === "primary" &&
          "peer-data-glide/menu-button:text-(--hx-primary-foreground) peer-data-active/menu-button:text-(--hx-primary-foreground)",
        className
      )}
      {...props}
    >
      <span ref={content} className="inline-flex">
        {rollingNumbers && count !== null ? <RollingNumber value={count} /> : children}
      </span>
    </motion.div>
  )
}

function RollingNumber({ value }: { value: number }) {
  const digits = String(value).split("")
  return (
    <span>
      <span className="sr-only">{value}</span>
      {digits.map((digit, i) => (
        <RollingDigit key={digits.length - i} digit={Number(digit)} />
      ))}
    </span>
  )
}

function RollingDigit({ digit }: { digit: number }) {
  return (
    <span aria-hidden className="relative inline-block [clip-path:inset(0)]">
      <span className="invisible">{digit}</span>
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: `${-digit * 10}%` }}
        transition={spring}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n}>{n}</span>
        ))}
      </motion.span>
    </span>
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  const [width] = React.useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  })

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

// `custom` is true under reduced motion: every change lands at once.
const subMenuVariants: Variants = {
  closed: (reduce: boolean) => ({
    height: 0,
    opacity: 0,
    overflow: "hidden",
    transition: reduce ? { duration: 0 } : { type: "spring", visualDuration: 0.25, bounce: 0 },
  }),
  open: (reduce: boolean) => ({
    height: "auto",
    opacity: 1,
    transitionEnd: { overflow: "visible" },
    transition: reduce ? { duration: 0 } : { ...spring, staggerChildren: 0.05, delayChildren: 0.05 },
  }),
}

const subItemVariants: Variants = {
  closed: (reduce: boolean) => ({ opacity: 0, x: -6, transition: { duration: reduce ? 0 : 0.15 } }),
  open: (reduce: boolean) => ({ opacity: 1, x: 0, transition: reduce ? { duration: 0 } : spring }),
}

const guideLineVariants: Variants = {
  closed: (reduce: boolean) => ({ scaleY: 0, transition: { duration: reduce ? 0 : 0.15 } }),
  open: (reduce: boolean) => ({ scaleY: 1, transition: { duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] } }),
}

function SidebarMenuSub({
  className,
  open = true,
  children,
  ...props
}: Omit<React.ComponentProps<typeof motion.ul>, "children"> & {
  open?: boolean
  children?: React.ReactNode
}) {
  const reduceMotion = usePrefersReducedMotion()
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.ul
          key="sub"
          custom={reduceMotion}
          data-slot="sidebar-menu-sub"
          data-sidebar="menu-sub"
          variants={subMenuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className={cn(
            "relative mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 px-2.5 py-1 group-data-[collapsible=icon]:hidden",
            className
          )}
          {...props}
        >
          <motion.li
            role="presentation"
            aria-hidden
            variants={guideLineVariants}
            className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top bg-(--hx-sidebar-border)"
          />
          {children}
        </motion.ul>
      )}
    </AnimatePresence>
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<typeof motion.li>) {
  return (
    <motion.li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      variants={subItemVariants}
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  render,
  size = "md",
  isActive = false,
  className,
  children,
  ...props
}: useRender.ComponentProps<"a"> &
  React.ComponentProps<"a"> & {
    size?: "sm" | "md"
    isActive?: boolean
  }) {
  const { slideHighlight, pressFeedback, rollingText, highlightColor } = useSidebar()
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        ...slotAttr("sidebar-menu-sub-button"),
        className: cn(
          "relative isolate flex h-8 min-w-0 -translate-x-px items-center gap-2 rounded-(--sidebar-item-radius) px-2 text-(--hx-sidebar-foreground) ring-(--hx-sidebar-ring) outline-hidden transition-[scale,color] duration-300 group-data-[collapsible=icon]:hidden hover:text-(--hx-sidebar-accent-foreground) focus-visible:ring-2 active:bg-(--hx-sidebar-accent) active:text-(--hx-sidebar-accent-foreground) disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-(--hx-sidebar-accent) data-active:text-(--hx-sidebar-accent-foreground) [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-(--hx-sidebar-accent-foreground)",
          highlightColor === "primary" && primaryTone,
          slideHighlight && "data-active:bg-transparent",
          pressFeedback && "active:scale-[0.96]",
          className
        ),
        children: (
          <>
            <ActiveEffects isActive={isActive} sub />
            {rollingText ? rollLabels(children) : children}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      sidebar: "menu-sub-button",
      size,
      active: isActive,
    },
  })
}

// ---- demo: sidebar-shell.tsx ----

const demoSpring = { type: "spring", visualDuration: 0.35, bounce: 0.2 } as const

const ICON_SIZE = "1.25rem"

const controls = {
  resizable: { group: "Sidebar", type: "checkbox", label: "Drag edge to resize", value: false },
  highlightColor: {
    group: "Active item",
    type: "select",
    label: "Highlight color",
    value: "primary",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Muted", value: "muted" },
    ],
  },
  itemRounded: {
    group: "Active item",
    type: "select",
    label: "Item roundness",
    value: "none",
    options: [
      { label: "None", value: "none" },
      { label: "sm", value: "sm" },
      { label: "md", value: "md" },
      { label: "lg", value: "lg" },
      { label: "xl", value: "xl" },
      { label: "2xl", value: "2xl" },
      { label: "Full", value: "full" },
    ],
  },
  slideHighlight: {
    group: "Active item",
    type: "checkbox",
    label: "Slide highlight",
    value: true,
  },
  activeIndicator: {
    group: "Active item",
    type: "select",
    label: "Active indicator",
    value: "bar",
    options: [
      { label: "Bar", value: "bar" },
      { label: "Pulsing dot", value: "dot" },
      { label: "None", value: "none" },
    ],
  },
  pressFeedback: { group: "Interaction", type: "checkbox", label: "Press feedback", value: false },
  rollingText: { group: "Interaction", type: "checkbox", label: "Rolling text", value: false },
  elasticTooltips: {
    group: "Interaction",
    type: "checkbox",
    label: "Elastic tooltips",
    value: false,
  },
  rollingNumbers: { group: "Badges", type: "checkbox", label: "Rolling numbers", value: true },
  showTeamSwitcher: { group: "Header", type: "checkbox", label: "Show team switcher", value: false },
  spinToggle: { group: "Header", type: "checkbox", label: "Spin toggle", value: false },
  showBreadcrumb: { group: "Header", type: "checkbox", label: "Show breadcrumb", value: true },
  scaleContent: { group: "Page", type: "checkbox", label: "Scale content", value: true },
}

const InboxContext = React.createContext<{ receive: () => void } | null>(null)

function useInbox() {
  const inbox = React.useContext(InboxContext)
  if (!inbox) throw new Error("useInbox must be used within SidebarShell.")
  return inbox
}

const ActivePageContext = React.createContext<{
  page: string
  unread: number
  scaleContent: boolean
} | null>(null)

function useActivePage() {
  const active = React.useContext(ActivePageContext)
  if (!active) throw new Error("useActivePage must be used within SidebarShell.")
  return active
}

type IconHandle = { startAnimation: () => void; stopAnimation: () => void }
type AnimatedIcon = React.ComponentType<{ size?: number | string; ref?: React.Ref<IconHandle> }>

function useIconTrigger() {
  const icon = React.useRef<IconHandle>(null)
  const play = () => icon.current?.startAnimation()
  const stop = () => icon.current?.stopAnimation()
  return { icon, handlers: { onMouseEnter: play, onMouseLeave: stop, onFocus: play, onBlur: stop } }
}

function NavButton({
  icon: Icon,
  children,
  ...props
}: React.ComponentProps<typeof SidebarMenuButton> & { icon: AnimatedIcon }) {
  const { icon, handlers } = useIconTrigger()
  return (
    <SidebarMenuButton {...handlers} {...props}>
      <Icon ref={icon} size={ICON_SIZE} />
      {children}
    </SidebarMenuButton>
  )
}

const teams: { name: string; plan: string; icon: AnimatedIcon }[] = [
  { name: "Bean & Co.", plan: "Roastery", icon: CoffeeIcon },
  { name: "Leaf House", plan: "Tea room", icon: DropletsIcon },
  { name: "Crumb", plan: "Bakery", icon: UtensilsIcon },
]

type Team = (typeof teams)[number]

function TeamLogo({ team, iconRef }: { team: Team; iconRef?: React.Ref<IconHandle> }) {
  const Icon = team.icon
  return <Icon ref={iconRef} size={ICON_SIZE} />
}

function TeamOption({
  team,
  selected,
  index,
  onSelect,
}: {
  team: Team
  selected: boolean
  index: number
  onSelect: () => void
}) {
  const { icon, handlers } = useIconTrigger()
  return (
    <motion.button
      type="button"
      data-team-option
      onClick={onSelect}
      {...handlers}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...demoSpring, delay: 0.04 + index * 0.04 }}
      className={cn(
        "flex items-center gap-2 rounded-(--sidebar-item-radius) px-2 py-1.5 text-left text-sm transition-colors duration-300 outline-none",
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-md border">
        <TeamLogo team={team} iconRef={icon} />
      </span>
      <span className="flex-1">{team.name}</span>
      {selected && <CheckIcon className="size-4" />}
    </motion.button>
  )
}

function TeamIdentity({ team, iconRef }: { team: Team; iconRef?: React.Ref<IconHandle> }) {
  return (
    <>
      <span className="relative flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-(--hx-sidebar-primary) text-(--hx-sidebar-primary-foreground)">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={team.name}
            className="flex"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={demoSpring}
          >
            <TeamLogo team={team} iconRef={iconRef} />
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="relative flex flex-1 flex-col gap-0.5 overflow-hidden leading-none">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={team.name}
            className="flex flex-col gap-0.5"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={demoSpring}
          >
            <span className="truncate font-medium">{team.name}</span>
            <span className="truncate text-xs text-(--hx-muted-foreground)">{team.plan}</span>
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )
}

const noFill =
  "active:bg-transparent active:text-(--hx-sidebar-foreground) data-open:hover:bg-transparent data-open:hover:text-(--hx-sidebar-foreground)"
const mutedFill =
  "hover:bg-(--hx-sidebar-accent) active:bg-(--hx-sidebar-accent) active:text-(--hx-sidebar-foreground) data-open:bg-(--hx-sidebar-accent) data-open:hover:bg-(--hx-sidebar-accent) data-open:hover:text-(--hx-sidebar-foreground)"

function TeamHeader({ switcher }: { switcher: boolean }) {
  const [team, setTeam] = React.useState<Team>(teams[0])
  const [open, setOpen] = React.useState(false)
  const { icon, handlers } = useIconTrigger()
  const {
    container: glideList,
    box: glideBox,
    handlers: glideHandlers,
  } = useGlide<HTMLDivElement>("[data-team-option]")

  const content = (
    <>
      <TeamIdentity team={team} iconRef={icon} />
      {switcher && <MorphChevron open={open} className="size-3.5!" />}
    </>
  )

  if (!switcher) {
    return (
      <SidebarMenuButton
        size="lg"
        tooltip={team.name}
        data-no-glide
        className={cn(noFill, "cursor-default")}
        {...handlers}
      >
        {content}
      </SidebarMenuButton>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<SidebarMenuButton size="lg" data-no-glide className={mutedFill} {...handlers} />}
      >
        {content}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        positionerClassName="z-70"
        className="w-(--anchor-width) min-w-56 gap-1 p-1.5 duration-200"
      >
        <span className="px-2 py-1 text-xs text-(--hx-muted-foreground)">Teams</span>
        <div ref={glideList} className="relative isolate flex flex-col gap-1" {...glideHandlers}>
          <SidebarGlideHighlight box={glideBox} className="bg-(--hx-muted)" />
          {teams.map((t, i) => (
            <TeamOption
              key={t.name}
              team={t}
              index={i}
              selected={t.name === team.name}
              onSelect={() => {
                setTeam(t)
                setOpen(false)
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function HeaderSearch() {
  const [openWidth, setOpenWidth] = React.useState(0)
  const open = openWidth > 0
  const [query, setQuery] = React.useState("")
  const input = React.useRef<HTMLInputElement>(null)
  const icon = React.useRef<IconHandle>(null)

  const close = () => {
    setOpenWidth(0)
    setQuery("")
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: open ? openWidth : 32 }}
      transition={demoSpring}
      className={
        open
          ? "flex h-8 shrink-0 items-center overflow-hidden rounded-md border bg-(--hx-background) transition-colors"
          : "flex h-8 shrink-0 items-center overflow-hidden rounded-md border border-transparent transition-colors"
      }
    >
      <button
        type="button"
        aria-label="Search"
        aria-expanded={open}
        onMouseEnter={() => icon.current?.startAnimation()}
        onMouseLeave={() => icon.current?.stopAnimation()}
        onClick={() => {
          if (open) {
            input.current?.focus()
            return
          }
          setOpenWidth(Math.min(256, window.innerWidth * 0.55))
          icon.current?.startAnimation()
          requestAnimationFrame(() => input.current?.focus())
        }}
        className="grid size-8 shrink-0 place-items-center rounded-md text-(--hx-muted-foreground) outline-none hover:text-(--hx-foreground) focus-visible:ring-2 focus-visible:ring-(--hx-ring)/50"
      >
        <SearchIcon ref={icon} size={ICON_SIZE} />
      </button>
      <input
        ref={input}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && close()}
        // Closes when left empty.
        onBlur={() => query === "" && setOpenWidth(0)}
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        placeholder="Search…"
        className="h-full min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-(--hx-muted-foreground)"
      />
    </motion.div>
  )
}

function Breadcrumb({ page }: { page: string }) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
      <a href="#" className="text-(--hx-muted-foreground) hover:text-(--hx-foreground)">
        Components
      </a>
      <span className="text-(--hx-muted-foreground)">/</span>
      <span className="relative inline-flex overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={page}
            className="font-medium whitespace-nowrap"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={demoSpring}
          >
            {page}
          </motion.span>
        </AnimatePresence>
      </span>
    </nav>
  )
}

const nav = [
  { title: "Home", icon: HouseIcon },
  { title: "Inbox", icon: InboxIcon },
  { title: "Calendar", icon: CalendarIcon },
]

const projects = ["Saturday roast", "Oat milk supplier", "New cups"]

function SidebarShell({ children, ...props }: { children: React.ReactNode } & Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const {
    showTeamSwitcher,
    showBreadcrumb,
    activeIndicator,
    highlightColor,
    itemRounded,
    scaleContent,
    ...options
  } =
    panel.values
  const [active, setActive] = React.useState("Home")
  const [unread, setUnread] = React.useState(4)
  const [projectsOpen, setProjectsOpen] = React.useState(true)
  const inbox = React.useMemo(() => ({ receive: () => setUnread((n) => n + 1) }), [])

  const go = (page: string) => {
    setActive(page)
    // Opening the inbox reads everything.
    if (page === "Inbox") setUnread(0)
  }

  return (
    <InboxContext.Provider value={inbox}>
      <ActivePageContext.Provider value={{ page: active, unread, scaleContent }}>
        <TooltipProvider>
          <SidebarProvider
            className="h-full min-h-0"
            activeIndicator={activeIndicator as "bar" | "dot" | "none"}
            highlightColor={highlightColor as "primary" | "muted"}
            itemRounded={itemRounded as SidebarItemRadius}
            {...options}
          >
            <Sidebar collapsible="icon" className="z-60">
              <SidebarHeader>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <TeamHeader switcher={showTeamSwitcher} />
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup label="Platform">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {nav.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <NavButton
                            icon={item.icon}
                            isActive={active === item.title}
                            tooltip={item.title}
                            onClick={() => go(item.title)}
                          >
                            <span>{item.title}</span>
                          </NavButton>
                          {item.title === "Inbox" && (
                            <AnimatePresence>
                              {unread > 0 && (
                                <SidebarMenuBadge key="badge">{unread}</SidebarMenuBadge>
                              )}
                            </AnimatePresence>
                          )}
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup label="Projects">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <NavButton
                          icon={FolderIcon}
                          tooltip="Projects"
                          aria-expanded={projectsOpen}
                          onClick={() => setProjectsOpen((o) => !o)}
                        >
                          <span className="flex-1">Projects</span>
                          <MorphChevron open={projectsOpen} className="size-3.5!" />
                        </NavButton>
                        <SidebarMenuSub open={projectsOpen}>
                          {projects.map((project) => (
                            <SidebarMenuSubItem key={project}>
                              <SidebarMenuSubButton
                                isActive={active === project}
                                onClick={() => go(project)}
                              >
                                <span>{project}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <NavButton
                      icon={SettingsIcon}
                      isActive={active === "Settings"}
                      tooltip="Settings"
                      onClick={() => go("Settings")}
                    >
                      <span>Settings</span>
                    </NavButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>

            <SidebarInset>
              {showBreadcrumb ? (
                <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-(--hx-background)/80 px-3 backdrop-blur">
                  <div className="flex min-w-0 items-center gap-2">
                    <SidebarTrigger />
                    <Breadcrumb page={active} />
                  </div>
                  <HeaderSearch />
                </header>
              ) : (
                <div className="sticky top-0 z-10 h-0">
                  <SidebarTrigger className="m-3 border bg-(--hx-background) shadow-xs" />
                </div>
              )}
              <div className="flex w-full flex-1 flex-col px-10 py-8 max-[1025px]:px-8 max-md:px-4">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>

      </ActivePageContext.Provider>
    </InboxContext.Provider>
  )
}

// ---- demo: page-content.tsx ----

const pages: Record<string, string> = {
  Inbox: "Messages from customers.",
  Calendar: "This week's roasts.",
  Settings: "Shop details and preferences.",
  "Saturday roast": "Tasting event for the new Ethiopian beans.",
  "Oat milk supplier": "Finding a supplier that can deliver twice a week.",
  "New cups": "Recyclable takeaway cups with the new logo.",
}

function Heading({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-xl flex-col gap-1">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {children && <p className="text-sm text-(--hx-muted-foreground)">{children}</p>}
    </div>
  )
}

function Page({ page }: { page: string }) {
  if (page in pages) return <Heading title={page}>{pages[page]}</Heading>

  // Home keeps the button that drives the sidebar's unread badge demo.
  return (
    <div className="flex flex-col items-start gap-3">
      <Heading title="Sidebar">
        A collapsible side navigation.{" "}
        <span className="max-lg:hidden">Press ⌘B (Ctrl+B) or the button in the header to collapse it to icons.</span>
        <span className="lg:hidden">Tap the button in the header to slide it in, or swipe in from the left edge.</span>
      </Heading>
      <ReceiveMessage />
    </div>
  )
}

function PageContent() {
  const { page, scaleContent } = useActivePage()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={page}
        className="flex flex-col gap-6"
        initial={{ opacity: 0, scale: scaleContent ? 0.97 : 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          scale: scaleContent ? 0.97 : 1,
          transition: { duration: 0.15, ease: "easeIn" },
        }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        style={{ originY: 0 }}
      >
        <Page page={page} />
      </motion.div>
    </AnimatePresence>
  )
}

// ---- demo: receive-message.tsx ----

function ReceiveMessage() {
  const { receive } = useInbox()
  return (
    <Button variant="outline" size="sm" onClick={receive}>
      <MailPlusIcon />
      Receive a message
    </Button>
  )
}

function SidebarDemo(props: Partial<ControlValues>) {
  return (
    <SidebarShell {...props}>
      <PageContent />
    </SidebarShell>
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

export interface AnimatedSidebarProps extends Partial<ControlValues> {
  theme?: AnimatedSidebarTheme;
  mode?: AnimatedSidebarMode;
  className?: string;
}

export default function AnimatedSidebar({ theme = "vscode", mode = "dark", className, ...props }: AnimatedSidebarProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <style>{COMPONENT_CSS}</style>
        <ReducedMotionConfig>
          <SidebarDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  type SidebarItemRadius,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  SidebarGlideHighlight,
  useGlide,
  useSidebar,
};
