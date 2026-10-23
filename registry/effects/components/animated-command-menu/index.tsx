// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { AnimatePresence, MotionConfig, animate, motion, stagger } from "motion/react";
import { SearchIcon, CheckIcon, CalculatorIcon, CalendarIcon, CreditCardIcon, SettingsIcon, SmileIcon, UserIcon } from "lucide-react";
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

export type AnimatedCommandMenuTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedCommandMenuMode = "light" | "dark";

const THEMES: Record<`${AnimatedCommandMenuTheme}:${AnimatedCommandMenuMode}`, Record<string, string>> = {
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
function themeProps(theme: AnimatedCommandMenuTheme = "default", mode: AnimatedCommandMenuMode = "dark") {
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
        "h-8 w-full min-w-0 rounded-md border border-(--hx-input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--hx-foreground) placeholder:text-(--hx-muted-foreground) focus-visible:border-(--hx-ring) focus-visible:ring-3 focus-visible:ring-(--hx-ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--hx-input)/50 disabled:opacity-50 aria-invalid:border-(--hx-destructive) aria-invalid:ring-3 aria-invalid:ring-(--hx-destructive)/20 md:text-sm in-data-[theme=dark]:bg-(--hx-input)/30 in-data-[theme=dark]:disabled:bg-(--hx-input)/80 in-data-[theme=dark]:aria-invalid:border-(--hx-destructive)/50 in-data-[theme=dark]:aria-invalid:ring-(--hx-destructive)/40",
        className
      )}
      {...props}
    />
  )
}

// ---- input-group.tsx ----

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-8 w-full min-w-0 items-center rounded-md border border-(--hx-input) transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-(--hx-input)/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-(--hx-ring) has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-(--hx-ring)/50 has-[[data-slot][aria-invalid=true]]:border-(--hx-destructive) has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-(--hx-destructive)/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto in-data-[theme=dark]:bg-(--hx-input)/30 in-data-[theme=dark]:has-disabled:bg-(--hx-input)/80 in-data-[theme=dark]:has-[[data-slot][aria-invalid=true]]:ring-(--hx-destructive)/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-(--hx-muted-foreground) select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

// ---- command.tsx ----

type CommandRounded = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
type CommandBackdrop = "none" | "dim" | "blur"
/** morph: the bar grows into the list. slide: a card drops down. fade: a card fades in. */
type CommandItemHover = "slide" | "fill" | "none"
type CommandHoverColor = "muted" | "primary"
type CommandDropdown = "morph" | "slide" | "fade"

type CommandMotion = {
  /** Seconds. */
  duration: number
  /** Spring overshoot, 0–1. */
  bounce: number
  /** Items fade in one after another. */
  staggerItems: boolean
  /** Seconds between items. */
  stagger: number
  /** Seconds to wait before the first item starts. */
  delay: number
  /** Search icon tilts and grows on hover and focus. */
  /** Rolls item labels when highlighted. */
  rollingText: boolean
  animateIcon: boolean
  /** slide: one highlight glides between items. fill: each fills from the top. */
  itemHighlight: CommandItemHover
  itemHighlightColor: CommandHoverColor
  rounded: CommandRounded
}

const ROUNDED: Record<CommandRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
}

const BACKDROP: Record<CommandBackdrop, string> = {
  none: "bg-transparent",
  dim: "bg-black/40",
  blur: "bg-black/10 backdrop-blur-sm",
}

// How far items rise from, in px
const ITEM_RISE = 8

const DEFAULT_MOTION: CommandMotion = {
  duration: 0.35,
  bounce: 0.15,
  staggerItems: true,
  stagger: 0.03,
  delay: 0.05,
  animateIcon: true,
  rollingText: false,
  itemHighlight: "slide",
  itemHighlightColor: "muted",
  rounded: "sm",
}

const CommandMotionContext = React.createContext<CommandMotion>(DEFAULT_MOTION)

function useCommandMotion() {
  return React.useContext(CommandMotionContext)
}

// Only props that were passed override the inherited motion
function useMergedMotion(props: Partial<CommandMotion>) {
  const parent = useCommandMotion()
  const { duration, bounce, staggerItems, stagger, delay, animateIcon, rollingText, itemHighlight, itemHighlightColor, rounded } = props
  return React.useMemo(
    () => ({
      duration: duration ?? parent.duration,
      bounce: bounce ?? parent.bounce,
      staggerItems: staggerItems ?? parent.staggerItems,
      stagger: stagger ?? parent.stagger,
      delay: delay ?? parent.delay,
      animateIcon: animateIcon ?? parent.animateIcon,
      rollingText: rollingText ?? parent.rollingText,
      itemHighlight: itemHighlight ?? parent.itemHighlight,
      itemHighlightColor: itemHighlightColor ?? parent.itemHighlightColor,
      rounded: rounded ?? parent.rounded,
    }),
    [parent, duration, bounce, staggerItems, stagger, delay, animateIcon, rollingText, itemHighlight, itemHighlightColor, rounded]
  )
}

function Command({
  className,
  duration,
  bounce,
  staggerItems,
  stagger,
  delay,
  animateIcon,
  rollingText,
  itemHighlight,
  itemHighlightColor,
  rounded,
  ...props
}: React.ComponentProps<typeof CommandPrimitive> & Partial<CommandMotion>) {
  const motionProps = useMergedMotion({ duration, bounce, staggerItems, stagger, delay, animateIcon, rollingText, itemHighlight, itemHighlightColor, rounded })

  return (
    <CommandMotionContext.Provider value={motionProps}>
      <CommandPrimitive
        data-slot="command"
        className={cn(
          "flex size-full flex-col overflow-hidden bg-(--hx-muted) p-1 text-(--hx-foreground)",
          ROUNDED[motionProps.rounded],
          className
        )}
        {...props}
      />
    </CommandMotionContext.Provider>
  )
}

/** A palette that scales and fades in over the page. Put a `Command` inside it. */
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  open,
  onOpenChange,
  startScale = 0.75,
  fadeContent = true,
  backdrop = "blur",
  duration,
  bounce,
  staggerItems,
  stagger,
  delay = 0.25,
  animateIcon,
  rollingText,
  itemHighlight,
  itemHighlightColor,
  rounded,
}: {
  title?: string
  description?: string
  className?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Size the palette grows from, 0–1. */
  startScale?: number
  /** Fades in and out while it scales. */
  fadeContent?: boolean
  backdrop?: CommandBackdrop
  children: React.ReactNode
} & Partial<CommandMotion>) {
  const options = useMergedMotion({ duration, bounce, staggerItems, stagger, delay, animateIcon, rollingText, itemHighlight, itemHighlightColor, rounded })
  const reduceMotion = usePrefersReducedMotion()
  const from = { opacity: fadeContent || reduceMotion ? 0 : 1, scale: reduceMotion ? 1 : startScale }

  return (
    <CommandMotionContext.Provider value={options}>
      <ReducedMotionConfig>
        <DialogPrimitive.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
          <AnimatePresence>
            {open && (
              <DialogPrimitive.Portal keepMounted><ThemeScope>
                <DialogPrimitive.Backdrop
                  data-slot="command-overlay"
                  render={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                  }
                  className={cn("fixed inset-0 isolate z-50", BACKDROP[backdrop])}
                />
                <DialogPrimitive.Popup
                  data-slot="command-dialog"
                  render={
                    <motion.div
                      initial={from}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ ...from, transition: { duration: 0.15, ease: "easeIn" } }}
                      transition={
                        reduceMotion
                          ? { duration: 0.2 }
                          : { type: "spring", visualDuration: options.duration, bounce: options.bounce }
                      }
                    />
                  }
                  className={cn(
                    "fixed top-1/4 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden bg-(--hx-muted) text-(--hx-foreground) shadow-2xl ring-1 ring-(--hx-foreground)/10 outline-none max-md:max-w-[calc(100%-2rem)]",
                    ROUNDED[options.rounded],
                    className
                  )}
                >
                  <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
                  <DialogPrimitive.Description className="sr-only">
                    {description}
                  </DialogPrimitive.Description>
                  {children}
                </DialogPrimitive.Popup>
              </ThemeScope></DialogPrimitive.Portal>
            )}
          </AnimatePresence>
        </DialogPrimitive.Root>
      </ReducedMotionConfig>
    </CommandMotionContext.Provider>
  )
}

function CommandInput({
  className,
  plain = false,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & {
  /** A bare bar with no tinted box, for the search bar. */
  plain?: boolean
}) {
  const { animateIcon, duration, bounce } = useCommandMotion()
  const [focused, setFocused] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const active = animateIcon && (focused || hovered)

  return (
    <div
      data-slot="command-input-wrapper"
      className={plain ? "" : "p-2"}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <InputGroup
        className={cn(
          "shadow-none! *:data-[slot=input-group-addon]:pr-4!",
          plain
            ? "h-14! rounded-none! border-0! bg-transparent! has-[[data-slot=input-group-control]:focus-visible]:ring-0!"
            : "h-12! rounded-md! border-(--hx-input)/30 bg-(--hx-input)/30"
        )}
      >
        <CommandPrimitive.Input
          data-slot="command-input"
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
          className={cn(
            "w-full text-base outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            "px-4",
            className
          )}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <motion.span
            className="flex"
            initial={false}
            animate={{ scale: active ? 1.2 : 1, rotate: active ? -12 : 0, opacity: active ? 1 : 0.5 }}
            transition={{ type: "spring", visualDuration: duration, bounce: Math.max(bounce, 0.3) }}
          >
            <SearchIcon className="size-5 shrink-0" />
          </motion.span>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

const CommandListContext = React.createContext("")

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  const { duration, staggerItems, stagger: gap, delay } = useCommandMotion()
  const reduceMotion = usePrefersReducedMotion()
  const list = React.useRef<HTMLDivElement>(null)
  const listId = React.useId()

  // Items rise and fade in one by one when the list appears
  React.useLayoutEffect(() => {
    const items = list.current?.querySelectorAll("[cmdk-group-heading], [cmdk-item], [cmdk-separator]")
    if (!items?.length || !staggerItems || reduceMotion) return
    // Hidden until each item's turn comes
    items.forEach((el) => ((el as HTMLElement).style.opacity = "0"))
    const controls = animate(
      items,
      { opacity: [0, 1], y: [ITEM_RISE, 0] },
      { duration: duration + 0.15, delay: stagger(gap, { startDelay: delay }), ease: [0.22, 1, 0.36, 1] }
    )
    return () => controls.stop()
    // Runs once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CommandListContext.Provider value={listId}>
      <CommandPrimitive.List
        ref={list}
        data-slot="command-list"
        className={cn(
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
          className
        )}
        {...props}
      />
    </CommandListContext.Provider>
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  // Server render has no items yet, so hold back until hydrated
  const ready = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  if (!ready) return null

  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-base", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "p-1 text-(--hx-foreground) **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-sm **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-(--hx-muted-foreground)",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-(--hx-border)", className)}
      {...props}
    />
  )
}

const HOVER_BG: Record<CommandHoverColor, string> = {
  muted: "bg-(--hx-foreground)/10",
  primary: "bg-(--hx-primary)",
}

const HOVER_TEXT: Record<CommandHoverColor, string> = {
  muted: "data-[selected=true]:text-(--hx-foreground)",
  primary: "data-[selected=true]:text-(--hx-primary-foreground)",
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  const { itemHighlight, itemHighlightColor, duration, bounce, rounded, rollingText } = useCommandMotion()
  const listId = React.useContext(CommandListContext)
  const reduceMotion = usePrefersReducedMotion()
  const [node, setNode] = React.useState<HTMLElement | null>(null)
  // Same store update for old and new item, so the highlight never drops out
  const current = useCommandState((state) => state.value)
  const selected =
    !!current && node?.getAttribute("data-value")?.toLowerCase() === current.toLowerCase()

  const bg = cn("absolute inset-0 -z-10 rounded-[inherit]", HOVER_BG[itemHighlightColor])

  return (
    <CommandPrimitive.Item
      ref={setNode}
      data-slot="command-item"
      className={cn(
        "group/command-item relative isolate flex cursor-default items-center gap-2 px-2 py-2 text-base outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        ROUNDED[rounded],
        itemHighlight !== "none" && "transition-colors duration-200 motion-reduce:transition-none",
        itemHighlight === "none" ? "data-[selected=true]:bg-(--hx-foreground)/10 data-[selected=true]:text-(--hx-foreground)" : HOVER_TEXT[itemHighlightColor],
        itemHighlight === "none" && itemHighlightColor === "primary" && "data-[selected=true]:bg-(--hx-primary) data-[selected=true]:text-(--hx-primary-foreground)",
        className
      )}
      {...props}
    >
      {itemHighlight === "slide" && selected && (
        <motion.span
          aria-hidden
          layoutId={`${listId}-hover`}
          className={bg}
          transition={
            reduceMotion ? { duration: 0 } : { type: "spring", visualDuration: duration * 0.6, bounce }
          }
        />
      )}
      {itemHighlight === "fill" && (
        <span
          aria-hidden
          className={cn(
            bg,
            "origin-top scale-y-0 transition-transform duration-300 ease-out group-data-[selected=true]/command-item:scale-y-100 motion-reduce:transition-none"
          )}
        />
      )}
      {rollingText ? React.Children.map(children, (child) => {
        if (typeof child === "string") return <CommandRollText>{child}</CommandRollText>
        if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === "span" && typeof child.props.children === "string") {
          return React.cloneElement(child, {}, <CommandRollText>{child.props.children}</CommandRollText>)
        }
        return child
      }) : children}
      <CheckIcon className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  )
}

function CommandRollText({ children }: { children: string }) {
  const roll = "block transition-transform duration-400 ease-[cubic-bezier(0.33,1,0.68,1)] group-data-[selected=true]/command-item:-translate-y-full motion-reduce:transition-none"
  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <span className={roll}>{children}</span>
      <span aria-hidden className={cn(roll, "absolute inset-x-0 top-full")}>{children}</span>
    </span>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-sm tracking-widest text-(--hx-muted-foreground) group-data-[selected=true]/command-item:text-inherit",
        className
      )}
      {...props}
    />
  )
}

/** A search box that opens its results below as you focus it. Put the items inside. */
// Tablet and mobile end at 1025px, so only wider screens count as desktop
function useDesktop() {
  return React.useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia("(min-width: 1026px)")
      query.addEventListener("change", notify)
      return () => query.removeEventListener("change", notify)
    },
    () => window.matchMedia("(min-width: 1026px)").matches,
    () => true
  )
}

function CommandSearch({
  children,
  className,
  placeholder = "Search…",
  hint,
  inputRef,
  open: openProp,
  onOpenChange,
  dropdownAnimation = "morph",
  morphWidth = 1.25,
  duration,
  bounce,
  staggerItems,
  stagger,
  delay,
  animateIcon,
  rollingText,
  itemHighlight,
  itemHighlightColor,
  rounded,
}: {
  children: React.ReactNode
  className?: string
  placeholder?: string
  /** Key hint shown at the end while the box is idle. */
  hint?: string
  inputRef?: React.Ref<HTMLInputElement>
  open?: boolean
  onOpenChange?: (open: boolean) => void
  dropdownAnimation?: CommandDropdown
  /** Morph only: how much wider than the bar it grows, 1 = same. */
  morphWidth?: number
} & Partial<CommandMotion>) {
  const options = useMergedMotion({ duration, bounce, staggerItems, stagger, delay, animateIcon, rollingText, itemHighlight, itemHighlightColor, rounded })
  const reduceMotion = usePrefersReducedMotion()
  const desktop = useDesktop()
  const [triggerHovered, setTriggerHovered] = React.useState(false)
  const [triggerFocused, setTriggerFocused] = React.useState(false)
  const [inputFocused, setInputFocused] = React.useState(false)
  const triggerActive = options.animateIcon && (triggerHovered || triggerFocused || inputFocused)
  const [own, setOwn] = React.useState(false)
  const open = openProp ?? own
  const root = React.useRef<HTMLDivElement>(null)
  const setOpen = (next: boolean) => {
    setTriggerHovered(false)
    setTriggerFocused(false)
    setOwn(next)
    onOpenChange?.(next)
  }

  return (
    <CommandMotionContext.Provider value={options}>
      <ReducedMotionConfig>
        <div
          ref={root}
          data-slot="command-search"
          onFocus={(event) => {
            if (event.target instanceof HTMLInputElement) setOpen(true)
          }}
          onClick={() => {
            setOpen(true)
            root.current?.querySelector("input")?.focus()
          }}
          onBlur={(event) => {
            // Keep it open while focus stays inside the box
            if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
          }}
          onKeyDown={(event) => {
            if (event.key !== "Escape" || !open) return
            event.stopPropagation()
            setOpen(false)
            root.current?.querySelector("input")?.blur()
          }}
          className={cn("relative w-full", className)}
        >
          <CommandPrimitive
            className="flex flex-col text-(--hx-foreground)"
            onKeyDown={(event) => {
              // Enter picks the item, then closes the list
              if (event.key === "Enter") setOpen(false)
            }}
          >
            <div className="relative h-14">
              <motion.div
                initial={false}
                animate={{
                  width: open ? `${(dropdownAnimation === "morph" && desktop ? morphWidth : 1) * 100}%` : 44,
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", visualDuration: options.duration, bounce: 0 }
                }
                className={cn(
                  "absolute top-0 left-1/2 z-20 w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden border bg-(--hx-muted)",
                  ROUNDED[options.rounded]
                )}
              >
                <motion.div
                  initial={false}
                  animate={{ height: open ? 56 : 42 }}
                  transition={{ duration: reduceMotion ? 0 : options.duration }}
                  className="relative"
                  onPointerEnter={() => setTriggerHovered(true)}
                  onPointerLeave={() => setTriggerHovered(false)}
                >
                  <div className={cn("transition-opacity duration-200 motion-reduce:transition-none [&_[data-slot=input-group-addon]]:invisible", !open && "pointer-events-none opacity-0")} aria-hidden={!open}>
                    <CommandInput ref={inputRef} plain placeholder={placeholder} tabIndex={open ? 0 : -1} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)} />
                  </div>
                  {!open && (
                    <button
                      type="button"
                      aria-label="Search commands"
                      aria-expanded={false}
                      aria-keyshortcuts={hint}
                      onPointerEnter={() => setTriggerHovered(true)}
                      onPointerLeave={() => setTriggerHovered(false)}
                      onFocus={() => setTriggerFocused(true)}
                      onBlur={() => setTriggerFocused(false)}
                      className="absolute inset-0 flex size-full items-center justify-center rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--hx-ring)"
                    >
                    </button>
                  )}
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute z-10 flex size-5"
                    initial={false}
                    animate={{ right: open ? 16 : 11, top: open ? 18 : 11 }}
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", visualDuration: options.duration, bounce: 0 }}
                  >
                    <motion.span
                      className="flex"
                      initial={false}
                      animate={{ scale: triggerActive ? 1.2 : 1, rotate: triggerActive ? -12 : 0, opacity: triggerActive ? 1 : 0.5 }}
                      transition={reduceMotion ? { duration: 0 } : { type: "spring", visualDuration: options.duration, bounce: Math.max(options.bounce, 0.3) }}
                    >
                      <SearchIcon className="size-5 shrink-0" />
                    </motion.span>
                  </motion.span>
                </motion.div>
                <AnimatePresence initial={false}>
                  {open && dropdownAnimation === "morph" && (
                    <motion.div
                      key="results"
                      // Stops the input blurring before an item is clicked
                      onMouseDown={(event) => event.preventDefault()}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", visualDuration: options.duration, bounce: 0 },
                      }}
                      exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
                      className="overflow-hidden"
                    >
                      <div className="border-t p-1">
                        <CommandList>{children}</CommandList>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            <AnimatePresence initial={false}>
              {open && dropdownAnimation !== "morph" && (
                <motion.div
                  key="results"
                  onMouseDown={(event) => event.preventDefault()}
                  initial={{ opacity: 0, y: dropdownAnimation === "slide" ? -16 : 0 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: reduceMotion
                      ? { duration: 0 }
                      : dropdownAnimation === "slide"
                        ? { type: "spring", visualDuration: options.duration, bounce: options.bounce }
                        : { duration: options.duration, ease: [0.45, 0, 0.25, 1] },
                  }}
                  exit={{
                    opacity: 0,
                    y: dropdownAnimation === "slide" ? -16 : 0,
                    transition: { duration: 0.15, ease: "easeIn" },
                  }}
                  className={cn(
                    "absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 border bg-(--hx-muted) p-1 shadow-lg",
                    ROUNDED[options.rounded]
                  )}
                >
                  <CommandList>{children}</CommandList>
                </motion.div>
              )}
            </AnimatePresence>
          </CommandPrimitive>
        </div>
      </ReducedMotionConfig>
    </CommandMotionContext.Provider>
  )
}

// ---- demo: command-demo.tsx ----

function Items({ onSelect }: { onSelect?: () => void }) {
  return (
    <>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem onSelect={onSelect}>
          <CalendarIcon />
          <span>Calendar</span>
        </CommandItem>
        <CommandItem onSelect={onSelect}>
          <SmileIcon />
          <span>Search emoji</span>
        </CommandItem>
        <CommandItem onSelect={onSelect}>
          <CalculatorIcon />
          <span>Calculator</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem onSelect={onSelect}>
          <UserIcon />
          <span>Profile</span>
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={onSelect}>
          <CreditCardIcon />
          <span>Billing</span>
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={onSelect}>
          <SettingsIcon />
          <span>Settings</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  )
}

const controls = {
  dropdownAnimation: {
    group: "Dropdown",
    type: "select",
    label: "Dropdown animation",
    value: "morph",
    options: [
      { label: "Morph", value: "morph" },
      { label: "Slide", value: "slide" },
      { label: "Fade", value: "fade" },
    ],
  },
  morphWidth: {
    disabled: (v: Record<string, unknown>) => v.dropdownAnimation !== "morph",
    group: "Dropdown",
    type: "slider",
    label: "Morph width",
    value: 1.25,
    min: 1,
    max: 1.6,
    step: 0.05,
    unit: "x",
  },
  delay: {
    disabled: (v: Record<string, unknown>) => !v.staggerItems,
    group: "Palette",
    type: "slider",
    label: "Delay",
    value: 0.1,
    min: 0,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  fadeContent: { group: "Palette", type: "checkbox", label: "Fade content", value: true },
  startScale: {
    group: "Palette",
    type: "slider",
    label: "Start scale",
    value: 0.75,
    min: 0.5,
    max: 1,
    step: 0.05,
  },
  backdrop: {
    group: "Palette",
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
    group: "Both",
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
  itemHighlight: {
    group: "Both",
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
    group: "Both",
    type: "select",
    label: "Item highlight color",
    value: "primary",
    options: [
      { label: "Muted", value: "muted" },
      { label: "Primary", value: "primary" },
    ],
  },
  animateIcon: { group: "Both", type: "checkbox", label: "Animate icon", value: true },
  duration: {
    group: "Both",
    type: "slider",
    label: "Duration",
    value: 0.35,
    min: 0.1,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  bounce: {
    disabled: (v: Record<string, unknown>) => v.dropdownAnimation === "fade" && v.itemHighlight !== "slide",
    group: "Both",
    type: "slider",
    label: "Bounce",
    value: 0.15,
    min: 0,
    max: 0.6,
    step: 0.05,
  },
  rollingText: { group: "Both", type: "checkbox", label: "Rolling text", value: false },
  staggerItems: { group: "Both", type: "checkbox", label: "Stagger items", value: true },
  stagger: {
    disabled: (v: Record<string, unknown>) => !v.staggerItems,
    group: "Both",
    type: "slider",
    label: "Stagger",
    value: 0.03,
    min: 0,
    max: 0.15,
    step: 0.01,
    unit: "s",
  },
}

function CommandDemo(props: Partial<ControlValues>) {
  const [open, setOpen] = React.useState(false)
  const search = React.useRef<HTMLInputElement>(null)
  const panel = useDemoControls(props)
  const { values } = panel

  const motionProps = {
    duration: values.duration,
    bounce: values.bounce,
    staggerItems: values.staggerItems,
    stagger: values.stagger,
    animateIcon: values.animateIcon,
    itemHighlight: values.itemHighlight as CommandItemHover,
    itemHighlightColor: values.itemHighlightColor as CommandHoverColor,
    rounded: values.rounded as CommandRounded,
    rollingText: values.rollingText,
  }

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      const typing = (e.target as HTMLElement).closest("input, textarea, [contenteditable]")
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        search.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-64 flex-col items-center justify-start gap-8 px-12 max-lg:px-8 max-md:gap-10 max-md:px-0">
        <div className="w-full max-w-xs">
          <CommandSearch
            inputRef={search}
            placeholder="Search commands…"
            hint="/"
            dropdownAnimation={values.dropdownAnimation as CommandDropdown}
            morphWidth={values.morphWidth}
            {...motionProps}
          >
            <Items />
          </CommandSearch>
        </div>

        <Button
          variant="outline"
          className="group/link h-11 rounded-md border border-(--hx-foreground)/15 px-4 text-base hover:border-(--hx-foreground)/30 hover:bg-(--hx-background) aria-expanded:bg-(--hx-background) in-data-[theme=dark]:hover:bg-(--hx-input)/30 in-data-[theme=dark]:aria-expanded:bg-(--hx-input)/30"
          onClick={() => setOpen(true)}
        >
          <span>Open palette</span>
          <kbd className="max-lg:hidden rounded-sm bg-(--hx-muted) px-1.5 font-mono text-sm text-(--hx-muted-foreground)">⌘K</kbd>
        </Button>

        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          startScale={values.startScale}
          fadeContent={values.fadeContent}
          delay={values.delay}
          backdrop={values.backdrop as CommandBackdrop}
          {...motionProps}
        >
          <Command className="rounded-[inherit]">
            <CommandInput placeholder="Type a command or search…" />
            <CommandList>
              <Items onSelect={() => setOpen(false)} />
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
      <p className="text-center text-sm text-(--hx-muted-foreground) max-lg:hidden">
        Tip: press / to search, ⌘K for the palette, ↑ ↓ to move, Enter to pick and Esc to close.
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

export interface AnimatedCommandMenuProps extends Partial<ControlValues> {
  theme?: AnimatedCommandMenuTheme;
  mode?: AnimatedCommandMenuMode;
  className?: string;
}

export default function AnimatedCommandMenu({ theme = "claude", mode = "dark", className, ...props }: AnimatedCommandMenuProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <ReducedMotionConfig>
          <CommandDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  Command,
  CommandDialog,
  CommandSearch,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  type CommandRounded,
  type CommandBackdrop,
  type CommandDropdown,
  type CommandItemHover,
  type CommandHoverColor,
};
