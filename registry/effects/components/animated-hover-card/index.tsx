// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import { MotionConfig, motion, useMotionValue, useSpring, type MotionValue } from "motion/react";
import { ShuffleIcon } from "lucide-react";
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

export type AnimatedHoverCardTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedHoverCardMode = "light" | "dark";

const THEMES: Record<`${AnimatedHoverCardTheme}:${AnimatedHoverCardMode}`, Record<string, string>> = {
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
    "secondary-foreground": "oklch(0.205 0 0)",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#582d1d",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#ffe0c2",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#535146",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#30302e",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#4a4436",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#e6e0cc",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#191414",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#ffffff",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#0f1923",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#ece8e1",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#3b3b3b",
    "warning": "oklch(0.769 0.188 70.08)"
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
    "secondary-foreground": "#ffffff",
    "warning": "oklch(0.769 0.188 70.08)"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedHoverCardTheme = "default", mode: AnimatedHoverCardMode = "dark") {
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

// ---- hover-card.tsx ----

type HoverCardRounded = "none" | "sm" | "md" | "lg" | "xl" | "2xl"
type HoverCardAnimation = "scale" | "fade"

type HoverCardMotion = {
  contentAnimation: HoverCardAnimation
  /** Start scale, 0–1. */
  startScale: number
  /** Hover delay before opening, ms. */
  openDelay: number
  /** Delay before closing, ms. */
  closeDelay: number
  /** Card drifts with the pointer. */
  followCursor: boolean
  /** Content fades in after the card. */
  fadeContent: boolean
  /** Link underline draws on hover. */
  underline: boolean
  rounded: HoverCardRounded
}

const ROUNDED: Record<HoverCardRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
}

/** Fades content in, no movement. */
function fadeInContent(card: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  for (const child of card.querySelectorAll<HTMLElement>(":scope > *")) {
    child.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 300,
      delay: 40,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "backwards",
    })
  }
}

/** Drift per pixel off centre. */
const FOLLOW_STRENGTH = 0.35

const HoverCardContext = React.createContext<{
  motion: HoverCardMotion
  follow: MotionValue<number>
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function useHoverCard() {
  const context = React.useContext(HoverCardContext)
  if (!context) throw new Error("HoverCard parts must be used inside <HoverCard>.")
  return context
}

function HoverCard({
  contentAnimation = "scale",
  startScale = 0.9,
  openDelay = 0.4,
  closeDelay = 0.2,
  followCursor = false,
  fadeContent = true,
  underline = true,
  rounded = "md",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: PreviewCardPrimitive.Root.Props & Partial<HoverCardMotion>) {
  const follow = useMotionValue(0)
  // Controlled so taps can toggle it.
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const context = React.useMemo(
    () => ({
      follow,
      open,
      setOpen: setUncontrolledOpen,
      motion: {
        contentAnimation,
        startScale,
        openDelay,
        closeDelay,
        followCursor,
        fadeContent,
        underline,
        rounded,
      },
    }),
    [follow, open, contentAnimation, startScale, openDelay, closeDelay, followCursor, fadeContent, underline, rounded]
  )
  return (
    <HoverCardContext.Provider value={context}>
      <PreviewCardPrimitive.Root
        data-slot="hover-card"
        open={open}
        onOpenChange={(next, details) => {
          setUncontrolledOpen(next)
          onOpenChange?.(next, details)
        }}
        {...props}
      />
    </HoverCardContext.Provider>
  )
}

function HoverCardTrigger({
  className,
  onPointerMove,
  onPointerDown,
  onClick,
  ...props
}: PreviewCardPrimitive.Trigger.Props) {
  const { motion: options, follow, open, setOpen } = useHoverCard()
  const pointerType = React.useRef("mouse")
  return (
    <PreviewCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      delay={options.openDelay * 1000}
      closeDelay={options.closeDelay * 1000}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        pointerType.current = event.pointerType
      }}
      onClick={(event) => {
        onClick?.(event)
        // Touch: tap toggles instead of navigating.
        if (pointerType.current === "mouse") return
        event.preventDefault()
        setOpen(!open)
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (!options.followCursor) return
        const rect = event.currentTarget.getBoundingClientRect()
        follow.set((event.clientX - (rect.left + rect.width / 2)) * FOLLOW_STRENGTH)
      }}
      className={(state) =>
        cn(
          options.underline &&
            "relative after:absolute after:inset-x-0 after:bottom-[0.08em] after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100 data-popup-open:after:scale-x-100",
          typeof className === "function" ? className(state) : className
        )
      }
      {...props}
    />
  )
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const { motion: options, follow } = useHoverCard()
  const reduceMotion = usePrefersReducedMotion()
  const x = useSpring(follow, { stiffness: 260, damping: 26 })

  const attach = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return
      // Start centred under the link.
      follow.jump(0)
      x.jump(0)
      if (options.fadeContent) fadeInContent(node)
    },
    [follow, x, options.fadeContent]
  )

  const scale = options.contentAnimation === "scale" ? options.startScale : 1

  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal"><ThemeScope>
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
        style={{ "--hc-travel": "0px", "--hc-scale": scale } as React.CSSProperties}
      >
        <PreviewCardPrimitive.Popup
          ref={attach}
          data-slot="hover-card-content"
          render={<motion.div style={{ x: options.followCursor && !reduceMotion ? x : 0 }} />}
          className={cn(
            "z-50 w-72 max-w-[calc(100vw-2rem)] origin-(--transform-origin) bg-(--hx-muted) px-5 py-4 text-sm text-(--hx-foreground) shadow-md ring-1 ring-(--hx-foreground)/10 outline-hidden",
            "transition-[opacity,scale,translate] duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:duration-200 data-ending-style:ease-[cubic-bezier(0.4,0,1,1)] motion-reduce:transition-opacity",
            "data-starting-style:scale-(--hc-scale) data-starting-style:opacity-0 data-ending-style:scale-(--hc-scale) data-ending-style:opacity-0",
            "data-[side=bottom]:data-starting-style:-translate-y-(--hc-travel) data-[side=top]:data-starting-style:translate-y-(--hc-travel) data-[side=left]:data-starting-style:translate-x-(--hc-travel) data-[side=right]:data-starting-style:-translate-x-(--hc-travel)",
            "data-[side=bottom]:data-ending-style:-translate-y-(--hc-travel) data-[side=top]:data-ending-style:translate-y-(--hc-travel) data-[side=left]:data-ending-style:translate-x-(--hc-travel) data-[side=right]:data-ending-style:-translate-x-(--hc-travel)",
            ROUNDED[options.rounded],
            className
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </ThemeScope></PreviewCardPrimitive.Portal>
  )
}

// ---- demo: hover-card-demo.tsx ----

const controls = {
  site: {
    disabled: (v: Record<string, unknown>) => v.source !== "link",
    group: "Content",
    type: "text",
    label: "Website",
    value: "vault.hyperiux.com",
    placeholder: "Site name or link",
  },
  source: {
    group: "Content",
    type: "select",
    label: "Card shows",
    value: "link",
    options: [
      { label: "Website preview", value: "link" },
      { label: "Manual details", value: "text" },
    ],
  },
  contentAnimation: {
    group: "Opening",
    type: "select",
    label: "Content animation",
    value: "scale",
    options: [
      { label: "Scale + fade", value: "scale" },
      { label: "Fade", value: "fade" },
    ],
  },
  startScale: {
    disabled: (v: Record<string, unknown>) => v.contentAnimation === "fade",
    group: "Opening",
    type: "slider",
    label: "Start scale",
    value: 0.9,
    min: 0.5,
    max: 1,
    step: 0.05,
  },
  fadeContent: { group: "Opening", type: "checkbox", label: "Fade content", value: true },

  openDelay: {
    group: "Timing",
    type: "slider",
    label: "Open after",
    value: 0.7,
    min: 0,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  closeDelay: {
    group: "Timing",
    type: "slider",
    label: "Close after",
    value: 0,
    min: 0,
    max: 1,
    step: 0.05,
    unit: "s",
  },

  followCursor: { group: "Link", type: "checkbox", label: "Follow the pointer", value: true },
  underline: { group: "Link", type: "checkbox", label: "Underline draws in", value: true },

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

type LinkPreview = {
  url: string
  hostname: string
  title: string | null
  description: string | null
  siteName: string | null
  image: string | null
  favicon: string | null
}

const SITES = [
  "https://vault.hyperiux.com",
  "https://nextjs.org",
  "https://react.dev",
  "https://tailwindcss.com",
  "https://github.com",
  "https://www.wikipedia.org",
  "https://motion.dev",
]

const DEFAULT_SITE = SITES[0]

// A bare name like "github" becomes github.com
function toUrl(value: string) {
  const text = value.trim()
  if (!text) return null
  const withScheme = /^https?:\/\//i.test(text)
    ? text
    : `https://${/[./:]/.test(text) ? text : `${text}.com`}`
  try {
    return new URL(withScheme).hostname.includes(".") ? withScheme : null
  } catch {
    return null
  }
}

const previewCache = new Map<string, LinkPreview>()

const SAMPLE_PREVIEWS: Record<string, Pick<LinkPreview, "title" | "description" | "siteName">> = {
  "vault.hyperiux.com": { title: "Hyperiux Vault", description: "Animated components and effects, ready to install.", siteName: "Hyperiux" },
  "nextjs.org": { title: "Next.js", description: "The React framework for the web.", siteName: "Next.js" },
  "react.dev": { title: "React", description: "The library for web and native user interfaces.", siteName: "React" },
  "tailwindcss.com": { title: "Tailwind CSS", description: "Rapidly build modern websites without ever leaving your HTML.", siteName: "Tailwind CSS" },
  "github.com": { title: "GitHub", description: "Where the world builds software.", siteName: "GitHub" },
  "wikipedia.org": { title: "Wikipedia", description: "The free encyclopedia.", siteName: "Wikipedia" },
  "motion.dev": { title: "Motion", description: "A modern animation library for JavaScript and React.", siteName: "Motion" },
}

// Swap for a fetch to your own preview endpoint
function loadPreview(url: string): Promise<LinkPreview> {
  const hostname = new URL(url).hostname.replace(/^www\./, "")
  const sample = SAMPLE_PREVIEWS[hostname]
  return new Promise((resolve) =>
    setTimeout(() =>
      resolve({
        url,
        hostname,
        title: sample?.title ?? hostname,
        description: sample?.description ?? null,
        siteName: sample?.siteName ?? null,
        image: null,
        favicon: null,
      }), 400)
  )
}

type PreviewState = { url: string; data: LinkPreview | null; error: string | null }

function useLinkPreview(url: string) {
  const [state, setState] = React.useState<PreviewState | null>(null)

  React.useEffect(() => {
    const controller = new AbortController()
    const cached = previewCache.get(url)
    const load = cached
      ? Promise.resolve(cached)
      : loadPreview(url).then((body) => {
          previewCache.set(url, body)
          return body
        })
    load
      .then((data) => setState({ url, data, error: null }))
      .catch((error: Error) => {
        if (error.name !== "AbortError") setState({ url, data: null, error: error.message })
      })
    return () => controller.abort()
  }, [url])

  const ready = state?.url === url ? state : null
  return { data: ready?.data ?? null, error: ready?.error ?? null, loading: !ready }
}

function LinkPreviewCard({ url, preview }: { url: string; preview: ReturnType<typeof useLinkPreview> }) {
  const [brokenImage, setBrokenImage] = React.useState<string | null>(null)
  const { data, error, loading } = preview
  const host = data?.hostname ?? new URL(url).hostname.replace(/^www\./, "")

  if (loading) {
    return (
      <div className="flex animate-pulse flex-col gap-2">
        <div className="h-24 rounded-md bg-(--hx-muted)" />
        <div className="h-3 w-1/3 rounded-sm bg-(--hx-muted)" />
        <div className="h-4 w-4/5 rounded-sm bg-(--hx-muted)" />
        <div className="h-3 w-full rounded-sm bg-(--hx-muted)" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-1">
        <span className="font-medium">{host}</span>
        <span className="text-xs text-(--hx-muted-foreground)">{error ?? "No preview available"}</span>
      </div>
    )
  }

  const showImage = data.image && brokenImage !== data.image

  return (
    <div className="flex flex-col gap-2">
      {showImage && (
        // Remote images from any site, so a plain img
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.image ?? undefined}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setBrokenImage(data.image)}
          className="h-24 w-full rounded-md bg-(--hx-muted) object-cover"
        />
      )}
      <div className="flex items-center gap-2 text-xs text-(--hx-muted-foreground)">
        {data.favicon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.favicon} alt="" referrerPolicy="no-referrer" className="size-4 rounded-xs" />
        )}
        <span className="truncate">{data.siteName ?? host}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="line-clamp-2 leading-snug font-medium">{data.title ?? host}</span>
        {data.description && (
          <span className="line-clamp-3 text-xs text-(--hx-muted-foreground)">{data.description}</span>
        )}
      </div>
      <span className="truncate text-xs text-(--hx-muted-foreground)">{host}</span>
    </div>
  )
}

const roasts = [
  {
    name: "Ethiopia Guji",
    process: "Washed · Light roast",
    notes: "Jasmine, peach and black tea. Bright and clean, best on filter.",
    color: "bg-(--hx-warning)/40",
  },
  {
    name: "Colombia Huila",
    process: "Honey · Medium roast",
    notes: "Red apple, caramel and cocoa. Sweet enough for espresso.",
    color: "bg-(--hx-destructive)/40",
  },
]

function HoverCardDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel
  const { source } = values
  const options = {
    contentAnimation: values.contentAnimation as HoverCardAnimation,
    startScale: values.startScale,
    fadeContent: values.fadeContent,
    openDelay: values.openDelay,
    closeDelay: values.closeDelay,
    followCursor: values.followCursor,
    underline: values.underline,
    rounded: values.rounded as HoverCardRounded,
  }

  const draft = values.site
  const [site, setSite] = React.useState(() => toUrl(controls.site.value) ?? DEFAULT_SITE)
  const preview = useLinkPreview(site)
  const linkMode = source === "link"

  // Load the site a moment after typing stops
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const next = toUrl(draft)
      if (next) setSite(next)
    }, 600)
    return () => clearTimeout(timer)
  }, [draft])

  const shuffle = () => {
    const others = SITES.filter((candidate) => candidate !== site)
    const next = others[Math.floor(Math.random() * others.length)]
    panel.set("site", new URL(next).hostname)
    setSite(next)
  }

  const linkClass = values.underline
    ? "font-medium text-(--hx-primary)"
    : "font-medium text-(--hx-primary) underline underline-offset-4"

  const roastLink = (roast: (typeof roasts)[number]) => (
    <HoverCard {...options}>
      <HoverCardTrigger href="#" onClick={(event) => event.preventDefault()} className={linkClass}>
        {roast.name}
      </HoverCardTrigger>
      <HoverCardContent className="flex flex-col gap-2">
        <div className={`h-28 rounded-md ${roast.color}`} />
        <span className="font-medium">{roast.name}</span>
        <span className="text-xs text-(--hx-muted-foreground)">{roast.process}</span>
        <span className="text-(--hx-muted-foreground)">{roast.notes}</span>
      </HoverCardContent>
    </HoverCard>
  )

  const siteLink = (
    <HoverCard {...options}>
      <HoverCardTrigger href={site} target="_blank" rel="noreferrer" className={linkClass}>
        {preview.data?.hostname ?? new URL(site).hostname.replace(/^www\./, "")}
      </HoverCardTrigger>
      <HoverCardContent>
        <LinkPreviewCard url={site} preview={preview} />
      </HoverCardContent>
    </HoverCard>
  )

  return (
    <div className="flex flex-col gap-3">
      {linkMode && (
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            const next = toUrl(draft)
            if (next) setSite(next)
          }}
        >
          <Input
            value={draft}
            onChange={(event) => panel.set("site", event.target.value)}
            placeholder="Site name or link"
            aria-label="Website"
            className="h-11.5 rounded-md"
          />
          <Button type="button" variant="outline" size="lg" onClick={shuffle} className="h-11.5 rounded-md px-4">
            <ShuffleIcon />
            Random
          </Button>
        </form>
      )}
      <div className="flex min-h-54 items-center justify-center px-6 text-sm max-md:min-h-64 max-md:px-0">
        {linkMode ? (
          <p className=" text-lg text-center leading-relaxed max-md:text-base">
            Worth a read this week: {siteLink}. Hover the link to peek at it.
          </p>
        ) : (
          <p className="max-w-[70%] text-lg text-center leading-relaxed max-lg:max-w-[85%] max-md:max-w-full max-md:text-base">
            This week&apos;s filter is {roastLink(roasts[0])}, and on espresso we&apos;re pulling{" "}
            {roastLink(roasts[1])} until Saturday.
          </p>
        )}
      </div>
      <p className="text-center text-sm text-(--hx-muted-foreground) max-lg:hidden">
        {linkMode
          ? "Tip: type a site name or paste a link, then hover it. Some sites block previews."
          : "Tip: hover a coffee name and hold still, or tap it on a touch screen."}
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

export interface AnimatedHoverCardProps extends Partial<ControlValues> {
  theme?: AnimatedHoverCardTheme;
  mode?: AnimatedHoverCardMode;
  className?: string;
}

export default function AnimatedHoverCard({ theme = "valorant", mode = "dark", className, ...props }: AnimatedHoverCardProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <ReducedMotionConfig>
          <HoverCardDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  type HoverCardAnimation,
  type HoverCardRounded,
};
