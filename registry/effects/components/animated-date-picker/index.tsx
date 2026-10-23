// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import * as React from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef, type HTMLAttributes } from "react";
import { MotionConfig, type Variants, LazyMotion, domMin, m, useAnimation, animate, useAnimate } from "motion/react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { ChevronDownIcon, CheckIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayPicker, getDefaultClassNames, type DayButton, type Locale } from "react-day-picker";
import { addMonths, addYears, differenceInCalendarMonths, endOfYear, format, startOfToday, startOfYear } from "date-fns";
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

export type AnimatedDatePickerTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedDatePickerMode = "light" | "dark";

const THEMES: Record<`${AnimatedDatePickerTheme}:${AnimatedDatePickerMode}`, Record<string, string>> = {
  "default:light": {
    "accent": "oklch(0.97 0 0)",
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
    "secondary-foreground": "oklch(0.205 0 0)"
  },
  "default:dark": {
    "accent": "oklch(0.269 0 0)",
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
    "secondary-foreground": "oklch(0.985 0 0)"
  },
  "caffeine:light": {
    "accent": "#e8e8e8",
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
    "secondary-foreground": "#582d1d"
  },
  "caffeine:dark": {
    "accent": "#2a2a2a",
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
    "secondary-foreground": "#ffe0c2"
  },
  "claude:light": {
    "accent": "#e9e6dc",
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
    "secondary-foreground": "#535146"
  },
  "claude:dark": {
    "accent": "#1a1915",
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
    "secondary-foreground": "#30302e"
  },
  "ghibli:light": {
    "accent": "#c9dfe8",
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
    "secondary-foreground": "#4a4436"
  },
  "ghibli:dark": {
    "accent": "#31463f",
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
    "secondary-foreground": "#e6e0cc"
  },
  "spotify:light": {
    "accent": "#e8f8ee",
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
    "secondary-foreground": "#191414"
  },
  "spotify:dark": {
    "accent": "#2a2a2a",
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
    "secondary-foreground": "#ffffff"
  },
  "valorant:light": {
    "accent": "#d5d0c4",
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
    "secondary-foreground": "#0f1923"
  },
  "valorant:dark": {
    "accent": "#22303d",
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
    "secondary-foreground": "#ece8e1"
  },
  "vscode:light": {
    "accent": "#e8e8e8",
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
    "secondary-foreground": "#3b3b3b"
  },
  "vscode:dark": {
    "accent": "#2a2d2e",
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
    "secondary-foreground": "#ffffff"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedDatePickerTheme = "default", mode: AnimatedDatePickerMode = "dark") {
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

// ---- use-prefers-reduced-motion.ts ----

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}

// ---- calendar-range-icon.tsx ----

interface CalendarRangeIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface CalendarRangeIconProps
  extends Omit<
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

const CalendarRangeIcon = forwardRef<
  CalendarRangeIconHandle,
  CalendarRangeIconProps
>(
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
    ref
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
      [controls, reduced, isAnimated, onMouseEnter]
    )

    const handleLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) {
          controls.start("normal")
        } else {
          onMouseLeave?.(e)
        }
      },
      [controls, onMouseLeave]
    )

    const bodyVariants: Variants = {
      normal: { pathLength: 1, opacity: 1 },
      animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: { duration: 0.5 * duration, ease: [0.16, 1, 0.3, 1] },
      },
    }

    const hangerVariants: Variants = {
      normal: { pathLength: 1, opacity: 1 },
      animate: (i: number) => ({
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: {
          duration: 0.3 * duration,
          delay: i * 0.08 * duration,
          ease: [0.16, 1, 0.3, 1],
        },
      }),
    }

    const headerVariants: Variants = {
      normal: { scaleX: 1, opacity: 1 },
      animate: {
        scaleX: [0, 1],
        opacity: [0, 1],
        transition: {
          duration: 0.4 * duration,
          delay: 0.28 * duration,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    }

    const markVariants: Variants = {
      normal: { scaleX: 1, opacity: 1 },
      animate: (i: number) => ({
        scaleX: [0, 1],
        opacity: [0, 1],
        transition: {
          duration: 0.35 * duration,
          delay: (0.4 + i * 0.1) * duration,
          ease: [0.16, 1, 0.3, 1],
        },
      }),
    }

    const dotVariants: Variants = {
      normal: { scale: 1, opacity: 1 },
      animate: (i: number) => ({
        scale: [0, 1.25, 1],
        opacity: [0, 1, 1],
        transition: {
          duration: 0.35 * duration,
          delay: (0.45 + i * 0.1) * duration,
          times: [0, 0.6, 1],
          ease: [0.34, 1.4, 0.64, 1],
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
            <m.path d="M8 2v4" custom={0} variants={hangerVariants} />
            <m.path d="M16 2v4" custom={1} variants={hangerVariants} />
            <m.rect
              width="18"
              height="18"
              x="3"
              y="4"
              rx="2"
              variants={bodyVariants}
            />
            <m.path
              d="M3 10h18"
              variants={headerVariants}
              style={{ transformBox: "view-box", originX: "3px", originY: "10px" }}
            />
            <m.path
              d="M17 14h-6"
              custom={0}
              variants={markVariants}
              style={{ transformBox: "view-box", originX: "11px", originY: "14px" }}
            />
            <m.path
              d="M13 18H7"
              custom={1}
              variants={markVariants}
              style={{ transformBox: "view-box", originX: "7px", originY: "18px" }}
            />
            <m.path
              d="M7 14h.01"
              custom={0}
              variants={dotVariants}
              style={{ transformBox: "view-box", originX: "7px", originY: "14px" }}
            />
            <m.path
              d="M17 18h.01"
              custom={1}
              variants={dotVariants}
              style={{ transformBox: "view-box", originX: "17px", originY: "18px" }}
            />
          </m.svg>
        </m.div>
      </LazyMotion>
    )
  }
)

CalendarRangeIcon.displayName = "CalendarRangeIcon"

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
        xs: "h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-md in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-md in-data-[slot=button-group]:rounded-md",
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
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-md bg-(--hx-popover) p-2.5 text-sm text-(--hx-popover-foreground) shadow-md ring-1 ring-(--hx-foreground)/10 outline-hidden duration-100 data-[side=bottom]:data-starting-style:-translate-y-2 data-[side=inline-end]:data-starting-style:-translate-x-2 data-[side=inline-start]:data-starting-style:translate-x-2 data-[side=left]:data-starting-style:translate-x-2 data-[side=right]:data-starting-style:-translate-x-2 data-[side=top]:data-starting-style:translate-y-2 transition-[opacity,scale,translate] duration-150 ease-out data-open:data-starting-style:opacity-0 data-open:data-starting-style:scale-95  data-closed:data-ending-style:opacity-0 data-closed:data-ending-style:scale-95",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </ThemeScope></PopoverPrimitive.Portal>
  )
}

// ---- select.tsx ----

const Select = SelectPrimitive.Root

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-md border border-(--hx-input) bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-(--hx-ring) focus-visible:ring-3 focus-visible:ring-(--hx-ring)/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-(--hx-destructive) aria-invalid:ring-3 aria-invalid:ring-(--hx-destructive)/20 data-placeholder:text-(--hx-muted-foreground) data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-md *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 in-data-[theme=dark]:bg-(--hx-input)/30 in-data-[theme=dark]:hover:bg-(--hx-input)/50 in-data-[theme=dark]:aria-invalid:border-(--hx-destructive)/50 in-data-[theme=dark]:aria-invalid:ring-(--hx-destructive)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="pointer-events-none size-4 text-(--hx-muted-foreground)" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal><ThemeScope>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn("relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-(--hx-popover) text-(--hx-popover-foreground) shadow-md ring-1 ring-(--hx-foreground)/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:data-starting-style:-translate-y-2 data-[side=inline-end]:data-starting-style:-translate-x-2 data-[side=inline-start]:data-starting-style:translate-x-2 data-[side=left]:data-starting-style:translate-x-2 data-[side=right]:data-starting-style:-translate-x-2 data-[side=top]:data-starting-style:translate-y-2 transition-[opacity,scale,translate] duration-150 ease-out data-open:data-starting-style:opacity-0 data-open:data-starting-style:scale-95  data-closed:data-ending-style:opacity-0 data-closed:data-ending-style:scale-95", className )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </ThemeScope></SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-(--hx-accent) focus:text-(--hx-accent-foreground) not-data-[variant=destructive]:focus:**:text-(--hx-accent-foreground) data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-(--hx-popover) py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-(--hx-popover) py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownArrow>
  )
}

// ---- calendar.tsx ----

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  const calendarComponents = React.useMemo<
    React.ComponentProps<typeof DayPicker>["components"]
  >(
    () => ({
      Root: ({ className, rootRef, ...props }) => {
        return (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(className)}
            {...props}
          />
        )
      },
      Chevron: ({ className, orientation, ...props }) => {
        if (orientation === "left") {
          return (
            <ChevronLeftIcon className={cn("size-4", className)} {...props} />
          )
        }

        if (orientation === "right") {
          return (
            <ChevronRightIcon className={cn("size-4", className)} {...props} />
          )
        }

        return (
          <ChevronDownIcon className={cn("size-4", className)} {...props} />
        )
      },
      DayButton: ({ ...props }) => (
        <CalendarDayButton locale={locale} {...props} />
      ),
      WeekNumber: ({ children, ...props }) => {
        return (
          <td {...props}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        )
      },
      ...components,
    }),
    [locale, components]
  )

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-(--hx-background) p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-(--hx-popover) opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-(--hx-muted-foreground)",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-(--hx-muted-foreground) select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-(--hx-muted-foreground) select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) bg-(--hx-muted) after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-(--hx-muted)",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) bg-(--hx-muted) after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-(--hx-muted)",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) bg-(--hx-muted) text-(--hx-foreground) data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-(--hx-muted-foreground) aria-selected:text-(--hx-muted-foreground)",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-(--hx-muted-foreground) opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={calendarComponents}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-(--hx-ring) group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-(--hx-ring)/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-(--hx-primary) data-[range-end=true]:text-(--hx-primary-foreground) data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-(--hx-muted) data-[range-middle=true]:text-(--hx-foreground) data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-(--hx-primary) data-[range-start=true]:text-(--hx-primary-foreground) data-[selected-single=true]:bg-(--hx-primary) data-[selected-single=true]:text-(--hx-primary-foreground) in-data-[theme=dark]:hover:text-(--hx-foreground) [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

// ---- date-picker.tsx ----

type CalendarProps = React.ComponentProps<typeof Calendar>

function SlidingChevron({
  className,
  orientation,
  ...props
}: {
  className?: string
  style?: React.CSSProperties
  size?: number
  disabled?: boolean
  orientation?: "up" | "down" | "left" | "right"
}) {
  if (orientation !== "left" && orientation !== "right") {
    return <ChevronDownIcon className={cn("size-4", className)} {...props} />
  }

  const Icon = orientation === "left" ? ChevronLeftIcon : ChevronRightIcon
  const slide =
    "size-4 transition-transform duration-500 ease-in-out motion-reduce:transition-none"

  return (
    <span
      className={cn(
        "relative flex size-4 [--travel:calc(var(--cell-size)/2+0.5rem)]",
        className
      )}
    >
      <Icon
        className={cn(
          slide,
          orientation === "left"
            ? "group-hover/button:-translate-x-(--travel)"
            : "group-hover/button:translate-x-(--travel)"
        )}
        {...props}
      />
      <Icon
        aria-hidden
        className={cn(
          slide,
          "absolute inset-0 group-hover/button:translate-x-0",
          orientation === "left"
            ? "translate-x-(--travel)"
            : "-translate-x-(--travel)"
        )}
      />
    </span>
  )
}

type DropdownProps = {
  options?: { value: number; label: string; disabled: boolean }[]
  value?: string | number | readonly string[]
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  disabled?: boolean
  "aria-label"?: string
}

type HoverStyle = {
  variant: "filled" | "outline"
  transition: "slide" | "fade"
  duration: number
  /** Glide overshoot, 0–1. */
  bounce: number
}

const HoverStyleContext = React.createContext<HoverStyle>({
  variant: "filled",
  transition: "slide",
  duration: 0.25,
  bounce: 0.15,
})

function useHoverSquare(
  box: React.RefObject<HTMLElement | null>,
  { item, keepIn }: { item: string; keepIn: string },
  { transition, duration, bounce }: HoverStyle
) {
  const reduceMotion = usePrefersReducedMotion()
  const [square, animateSquare] = useAnimate<HTMLDivElement>()
  const shown = React.useRef(false)
  const current = React.useRef<HTMLElement | null>(null)

  const hide = () => {
    shown.current = false
    current.current = null
    if (square.current) {
      animateSquare(
        square.current,
        { opacity: 0 },
        { duration: reduceMotion ? 0 : 0.15 }
      )
    }
  }

  const onPointerOver = (event: React.PointerEvent) => {
    const hovered = event.target as HTMLElement
    const target = hovered.closest<HTMLElement>(item)
    const container = box.current
    const el = square.current
    if (!container || !el) return

    if (!target || target.matches(":disabled, [data-disabled]")) {
      if (target || !hovered.closest(keepIn)) hide()
      return
    }
    if (target === current.current) return
    current.current = target

    const from = container.getBoundingClientRect()
    const to = target.getBoundingClientRect()
    const position = {
      x: to.left - from.left - container.clientLeft + container.scrollLeft,
      y: to.top - from.top - container.clientTop + container.scrollTop,
      width: to.width,
      height: to.height,
    }
    if (shown.current && transition === "slide") {
      animateSquare(
        el,
        position,
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", visualDuration: duration * 0.6, bounce }
      )
    } else if (shown.current) {
      animateSquare(el, position, { duration: 0 })
      animateSquare(
        el,
        { opacity: [0, 1] },
        { duration: reduceMotion ? 0 : duration }
      )
    } else {
      shown.current = true
      animateSquare(el, position, { duration: 0 })
      animateSquare(el, { opacity: 1 }, { duration: reduceMotion ? 0 : 0.15 })
    }
  }

  return [
    square,
    {
      onPointerOver,
      onPointerLeave: hide,
      hide,
      reset: () => {
        shown.current = false
        current.current = null
      },
    },
  ] as const
}

function HoverSquare({
  ref,
  variant,
  className,
}: {
  ref: React.Ref<HTMLDivElement>
  variant: HoverStyle["variant"]
  className?: string
}) {
  return (
    <div
      ref={ref}
      aria-hidden
      style={{ opacity: 0 }}
      className={cn(
        "pointer-events-none absolute top-0 left-0 rounded-md",
        className,
        variant === "filled"
          ? "bg-(--hx-primary)"
          : "border-2 border-(--hx-primary) bg-transparent"
      )}
    />
  )
}

function AnimatedDropdown({
  options = [],
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const current = String(value)
  const list = React.useRef<HTMLDivElement>(null)
  const hoverStyle = React.useContext(HoverStyleContext)
  const [hoverSquare, hover] = useHoverSquare(
    list,
    {
      item: '[data-slot="select-item"]',
      keepIn: '[data-slot="select-content"]',
    },
    hoverStyle
  )
  const selectedIndex = Math.max(
    options.findIndex((option) => String(option.value) === current),
    0
  )

  return (
    <Select
      items={options.map((option) => ({
        value: String(option.value),
        label: option.label,
      }))}
      value={current}
      disabled={disabled}
      onOpenChange={(open) => {
        if (!open) {
          hover.hide()
          return
        }
        requestAnimationFrame(() => {
          const box = list.current
          const selected = box?.querySelector<HTMLElement>("[data-selected]")
          if (!box || !selected) return
          box.scrollTop =
            selected.offsetTop -
            box.clientHeight / 2 +
            selected.offsetHeight / 2
        })
      }}
      onValueChange={(next) => {
        // react-day-picker only reads `event.target.value`.
        if (next !== null) {
          onChange?.({
            target: { value: next },
          } as React.ChangeEvent<HTMLSelectElement>)
        }
      }}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-auto! gap-1 border-0 bg-transparent px-1.5 py-1 text-base font-medium shadow-none hover:bg-transparent in-data-[theme=dark]:bg-transparent in-data-[theme=dark]:hover:bg-transparent [&_svg]:transition-transform [&_svg]:duration-200 data-popup-open:[&_svg]:rotate-180 motion-reduce:[&_svg]:transition-none"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        ref={list}
        style={
          {
            "--hover-duration": `${hoverStyle.duration}s`,
          } as React.CSSProperties
        }
        onPointerOver={hover.onPointerOver}
        onPointerLeave={hover.onPointerLeave}
        alignItemWithTrigger={false}
        className="max-h-64 w-auto min-w-20 p-1.5 duration-200 ease-out data-open:data-starting-style:scale-100 data-closed:data-ending-style:scale-100 data-[side=bottom]:data-starting-style:-translate-y-2 data-closed:data-[side=bottom]:data-ending-style:-translate-y-2 data-closed:duration-150 motion-reduce:animate-none!"
      >
        <HoverSquare ref={hoverSquare} variant={hoverStyle.variant} />
        {options.map((option, index) => (
          <SelectItem
            key={option.value}
            value={String(option.value)}
            disabled={option.disabled}
            style={{
              animationDelay: `${Math.min(Math.abs(index - selectedIndex), 8) * 25}ms`,
            }}
            className={cn(
              "transition-[opacity,scale,translate] duration-150 ease-out data-starting-style:opacity-0 data-starting-style:-translate-y-1 animation-duration-200 ease-out fill-mode-backwards motion-reduce:animate-none!",
              "transition-colors duration-(--hover-duration) **:transition-colors **:duration-(--hover-duration) motion-reduce:transition-none motion-reduce:**:transition-none",
              "cursor-pointer focus:bg-transparent focus-visible:bg-(--hx-accent)",
              hoverStyle.variant === "filled" &&
                "hover:text-(--hx-primary-foreground)! hover:**:text-(--hx-primary-foreground)!"
            )}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const SLIDING_ARROWS = { Chevron: SlidingChevron, Dropdown: AnimatedDropdown }
const PLAIN_ARROWS = { Dropdown: AnimatedDropdown }

type DateRange = { from: Date | undefined; to?: Date | undefined }

// Two months sit side by side for a range from tablet up; phones get one.
function useMinWidth(query: string) {
  return React.useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}

// One month view with its own month, arrows, dropdowns and slide. A range shows two side by side,
// so each can be on any month or year (say 2027 on the left, 2029 on the right).
function CalendarPanel({
  initialMonth,
  monthAnimation,
  monthSlideDistance,
  onChangeStart,
  children,
}: {
  initialMonth: Date
  monthAnimation: "slide" | "fade" | "none"
  monthSlideDistance: number
  onChangeStart: () => void
  children: (month: Date, changeMonth: (next: Date) => void) => React.ReactNode
}) {
  const reduceMotion = usePrefersReducedMotion()
  const box = React.useRef<HTMLDivElement>(null)
  const [month, setMonth] = React.useState(initialMonth)
  const pendingMonth = React.useRef<Date | null>(null)
  const enterDirection = React.useRef<1 | -1 | null>(null)

  const slideBy = (direction: number) =>
    monthAnimation === "slide" ? `${direction * monthSlideDistance}%` : "0%"

  const monthParts = () =>
    box.current?.querySelectorAll(".rdp-month_caption, .rdp-month_grid") ?? []

  const changeMonth = async (next: Date) => {
    const step = differenceInCalendarMonths(next, month)
    const alreadyAnimating = pendingMonth.current !== null
    const target = addMonths(pendingMonth.current ?? month, step)

    if (reduceMotion || monthAnimation === "none") {
      setMonth(target)
      return
    }
    pendingMonth.current = target
    if (alreadyAnimating) return

    onChangeStart()
    const direction = step > 0 ? 1 : -1
    await animate([...monthParts()], { x: slideBy(-direction), opacity: 0 }, { duration: 0.2, ease: "easeIn" })
    const landing = pendingMonth.current
    pendingMonth.current = null
    enterDirection.current = differenceInCalendarMonths(landing, month) >= 0 ? 1 : -1
    setMonth(landing)
  }

  React.useLayoutEffect(() => {
    const direction = enterDirection.current
    if (direction === null) return
    enterDirection.current = null
    animate([...monthParts()], { x: [slideBy(direction), "0%"], opacity: [0, 1] }, { duration: 0.3, ease: [0.16, 1, 0.3, 1] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month])

  return (
    <div ref={box} className="min-w-0 flex-1">
      {/* eslint-disable-next-line react-hooks/refs -- changeMonth reads refs only when a month changes */}
      {children(month, changeMonth)}
    </div>
  )
}

function DatePicker({
  value,
  onChange,
  placeholder,
  dateFormat = "PPP",
  showIcon = true,
  rollingText = true,
  fromBehind = true,
  contentAnimation = "scale",
  startScale = 0.9,
  captionLayout = "dropdown",
  yearsBefore = 10,
  yearsAfter = 10,
  monthAnimation = "slide",
  monthSlideDistance = 40,
  slideArrows = true,
  hoverVariant = "filled",
  hoverAnimation = "slide",
  hoverDuration = 0.25,
  hoverBounce = 0.15,
  weekStartsOn = 0,
  onlyCurrentMonth = true,
  fixedWeeks = true,
  disablePast = false,
  highlightToday = false,
  closeOnSelect = true,
  selectionMode = "range",
  range,
  onRangeChange,
  className,
}: {
  value?: Date
  onChange?: (date: Date | undefined) => void
  /** Pick one date, or a start and an end date. */
  selectionMode?: "single" | "range"
  range?: DateRange
  onRangeChange?: (range: DateRange | undefined) => void
  placeholder?: string
  dateFormat?: string
  showIcon?: boolean
  rollingText?: boolean
  fromBehind?: boolean
  contentAnimation?: "scale" | "fade"
  startScale?: number
  captionLayout?: CalendarProps["captionLayout"]
  yearsBefore?: number
  yearsAfter?: number
  monthAnimation?: "slide" | "fade" | "none"
  monthSlideDistance?: number
  slideArrows?: boolean
  hoverVariant?: "filled" | "outline"
  hoverAnimation?: "slide" | "fade"
  hoverDuration?: number
  hoverBounce?: number
  weekStartsOn?: CalendarProps["weekStartsOn"]
  onlyCurrentMonth?: boolean
  fixedWeeks?: boolean
  disablePast?: boolean
  highlightToday?: boolean
  closeOnSelect?: boolean
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const icon = React.useRef<CalendarRangeIconHandle>(null)
  const reduceMotion = usePrefersReducedMotion()

  const calendarBox = React.useRef<HTMLDivElement>(null)
  const hoverStyle = React.useMemo<HoverStyle>(
    () => ({
      variant: hoverVariant,
      transition: hoverAnimation,
      duration: hoverDuration,
      bounce: hoverBounce,
    }),
    [hoverVariant, hoverAnimation, hoverDuration, hoverBounce]
  )
  const [dateHoverSquare, dateHover] = useHoverSquare(
    calendarBox,
    { item: "button[data-day]", keepIn: ".rdp-weeks" },
    hoverStyle
  )
  const isRange = selectionMode === "range"
  const wide = useMinWidth("(min-width: 768px)")
  const twoMonths = isRange && wide
  const anchorDate = isRange ? range?.from : value
  const label = isRange
    ? range?.from
      ? // While the end is still being picked (it equals the start), it reads as open.
        `${format(range.from, dateFormat)} – ${range.to && range.to.toDateString() !== range.from.toDateString() ? format(range.to, dateFormat) : "…"}`
      : (placeholder ?? "Pick a date range")
    : value
      ? format(value, dateFormat)
      : (placeholder ?? "Pick a date")
  const closeTimer = React.useRef<number>(undefined)
  React.useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  // Picking the end: the start is set and the end isn't yet (or still equals it).
  const [hoverDay, setHoverDay] = React.useState<Date>()
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()
  const picking = !!range?.from && (!range.to || sameDay(range.from, range.to))
  const preview =
    picking && range?.from && hoverDay && !sameDay(hoverDay, range.from)
      ? hoverDay < range.from
        ? { from: hoverDay, to: range.from }
        : { from: range.from, to: hoverDay }
      : null

  const labelFrame = React.useRef<HTMLSpanElement>(null)
  const labelBox = React.useRef<HTMLSpanElement>(null)
  React.useLayoutEffect(() => {
    const frame = labelFrame.current
    const inner = labelBox.current
    if (!frame || !inner) return
    let first = true
    const observer = new ResizeObserver(() => {
      const width = inner.offsetWidth
      if (first || reduceMotion) {
        first = false
        frame.style.width = `${width}px`
        return
      }
      animate(frame, { width }, { type: "spring", visualDuration: 0.35, bounce: 0.15 })
    })
    observer.observe(inner)
    return () => observer.disconnect()
  }, [reduceMotion])

  // The right-hand month starts on the range's end, or the month after the start.
  const startMonth = anchorDate ?? new Date()
  const endMonth =
    range?.to && differenceInCalendarMonths(range.to, startMonth) > 0 ? range.to : addMonths(startMonth, 1)
  const panels = twoMonths ? [startMonth, endMonth] : [startMonth]

  const animateTrigger = () => {
    if (reduceMotion) return
    icon.current?.startAnimation()
  }

  return (
    <HoverStyleContext.Provider value={hoverStyle}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          dateHover.reset()
          if (next) {
            animateTrigger()
          }
        }}
      >
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              data-empty={!anchorDate}
              onPointerEnter={animateTrigger}
              className={cn(
                "group/trigger h-11 w-fit max-w-full justify-start gap-2.5 px-3.5 text-left text-base font-normal data-[empty=true]:text-(--hx-muted-foreground)",
                "hover:bg-(--hx-background) aria-expanded:bg-(--hx-background)",
                fromBehind && "relative z-45",
                "in-data-[theme=dark]:bg-(--hx-background) in-data-[theme=dark]:hover:bg-(--hx-background) in-data-[theme=dark]:bg-[linear-gradient(color-mix(in_oklch,var(--hx-input)_30%,transparent),color-mix(in_oklch,var(--hx-input)_30%,transparent))]",
                className
              )}
            />
          }
        >
          {showIcon && <CalendarRangeIcon ref={icon} size="1.25em" />}
          {/* The label box springs to the width of the label inside it. */}
          <span ref={labelFrame} className="relative block max-w-full overflow-hidden">
          <span ref={labelBox} className="block w-max">
          {rollingText ? (
            <span className="relative block overflow-hidden">
              <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/trigger:-translate-y-full motion-reduce:transition-none">
                {label}
              </span>
              <span
                aria-hidden
                className="absolute inset-x-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/trigger:-translate-y-full motion-reduce:transition-none"
              >
                {label}
              </span>
            </span>
          ) : (
            <span className="block">{label}</span>
          )}
          </span>
          </span>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          positionerClassName={fromBehind ? "z-40" : undefined}
          className={cn(
            twoMonths ? "w-[36rem]" : "w-[20rem]",
            "max-w-[calc(100vw-2rem)] p-0",
            "duration-300 ease-out data-open:data-starting-style:scale-100 data-closed:data-ending-style:scale-100 data-closed:delay-150 motion-reduce:animate-none!",
            fromBehind
              ? "data-[side=bottom]:data-starting-style:-translate-y-4 data-closed:data-[side=bottom]:data-ending-style:-translate-y-4"
              : "data-[side=bottom]:data-starting-style:-translate-y-2 data-closed:data-[side=bottom]:data-ending-style:-translate-y-2"
          )}
        >
          <div
            ref={calendarBox}
            className="relative flex overflow-hidden"
            style={
              { "--hover-duration": `${hoverDuration}s` } as React.CSSProperties
            }
            onPointerOver={dateHover.onPointerOver}
            onPointerLeave={() => {
              dateHover.onPointerLeave()
              setHoverDay(undefined)
            }}
          >
            {/* Above the range band, below the day numbers. */}
            <HoverSquare ref={dateHoverSquare} variant={hoverVariant} className="z-1" />
            {panels.map((initial, index) => (
            <CalendarPanel
              key={index}
              initialMonth={initial}
              monthAnimation={monthAnimation}
              monthSlideDistance={monthSlideDistance}
              onChangeStart={dateHover.hide}
            >
            {(month, changeMonth) => (
            <Calendar
              {...(isRange
                ? {
                    mode: "range" as const,
                    selected: range,
                    onDayMouseEnter: (day: Date) => setHoverDay(day),
                    modifiers: preview
                      ? {
                          preview_start: preview.from,
                          preview_middle: { after: preview.from, before: preview.to },
                          preview_end: preview.to,
                        }
                      : undefined,
                    modifiersClassNames: {
                      preview_start: "rounded-l-(--cell-radius) rounded-r-none! bg-(--hx-muted)!",
                      preview_middle: "rounded-none! bg-(--hx-muted)!",
                      preview_end: "rounded-r-(--cell-radius) rounded-l-none! bg-(--hx-muted)!",
                    },
                    onSelect: (_: DateRange | undefined, day: Date) => {
                      const from = range?.from
                      const next =
                        picking && from
                          ? day < from
                            ? { from: day, to: from }
                            : { from, to: day }
                          : { from: day, to: day }
                      onRangeChange?.(next)
                      window.clearTimeout(closeTimer.current)
                      // Closes once both ends are picked, after the band has filled in.
                      if (closeOnSelect && !sameDay(next.from, next.to)) {
                        closeTimer.current = window.setTimeout(() => setOpen(false), reduceMotion ? 0 : 350)
                      }
                    },
                  }
                : {
                    mode: "single" as const,
                    selected: value,
                    onSelect: (date: Date | undefined) => {
                      onChange?.(date)
                      if (closeOnSelect) setOpen(false)
                    },
                  })}
              month={month}
              onMonthChange={changeMonth}
              captionLayout={captionLayout}
              startMonth={startOfYear(addYears(startOfToday(), -yearsBefore))}
              endMonth={endOfYear(addYears(startOfToday(), yearsAfter))}
              buttonVariant="outline"
              components={slideArrows ? SLIDING_ARROWS : PLAIN_ARROWS}
              fixedWeeks={fixedWeeks}
              showOutsideDays={!onlyCurrentMonth}
              weekStartsOn={weekStartsOn}
              disabled={disablePast ? { before: startOfToday() } : undefined}
              autoFocus
              style={
                {
                  "--tw-enter-scale":
                    contentAnimation === "scale" ? startScale : 1,
                } as React.CSSProperties
              }
              className={cn(
                "transition-[opacity,scale,translate] duration-150 ease-out data-starting-style:opacity-0 data-starting-style:scale-90 duration-300 ease-out delay-150 fill-mode-backwards motion-reduce:animate-none!",
                " in-data-closed:data-ending-style:opacity-0 in-data-closed:data-ending-style:scale-100 in-data-closed:duration-150 in-data-closed:delay-0 in-data-closed:fill-mode-forwards motion-reduce:in-data-closed:animate-none",
                String.raw`[&_.rdp-nav]:pointer-events-none [&_.rdp-nav]:z-10 [&_.rdp-button\_previous]:pointer-events-auto [&_.rdp-button\_next]:pointer-events-auto`,
                String.raw`[&_.rdp-button\_previous]:overflow-hidden [&_.rdp-button\_previous]:rounded-full [&_.rdp-button\_next]:overflow-hidden [&_.rdp-button\_next]:rounded-full`,
                String.raw`[&_.rdp-button\_previous]:hover:bg-(--hx-background) [&_.rdp-button\_next]:hover:bg-(--hx-background) in-data-[theme=dark]:[&_.rdp-button\_previous]:hover:bg-(--hx-input)/30 in-data-[theme=dark]:[&_.rdp-button\_next]:hover:bg-(--hx-input)/30`,
                "w-full! p-3 [&_.rdp-week]:mt-1.5",
                // A range reads as one band, so its days touch; single dates keep their gaps.
                isRange
                  ? cn(
                      "[&_.rdp-months]:gap-6 [&_.rdp-day]:transition-colors [&_.rdp-day]:duration-(--hover-duration) motion-reduce:[&_.rdp-day]:transition-none",
                      String.raw`[&_.rdp-range\_start]:z-auto [&_.rdp-range\_start]:isolation-auto [&_.rdp-range\_end]:z-auto [&_.rdp-range\_end]:isolation-auto`,
                      String.raw`[&_.rdp-range\_middle]:rounded-none! [&_.rdp-range\_middle]:bg-(--hx-muted)! [&_.rdp-range\_start]:bg-(--hx-muted)! [&_.rdp-range\_end]:bg-(--hx-muted)! [&_button[data-range-middle=true]]:bg-transparent!`
                    )
                  : "[&_.rdp-weekdays]:gap-1.5 [&_.rdp-week]:gap-1.5",
                !highlightToday && "[&_.rdp-today]:bg-transparent",
              highlightToday && "[&_.rdp-today]:hover:bg-transparent",
                "[&_button[data-day]]:ring-0! [&_button[data-day]:focus-visible]:ring-[3px]!",
                "[&_button[data-day]]:hover:bg-transparent in-data-[theme=dark]:[&_button[data-day]]:hover:bg-transparent",
                hoverVariant === "filled" &&
                  "[&_button[data-day]]:hover:text-(--hx-primary-foreground) in-data-[theme=dark]:[&_button[data-day]]:hover:text-(--hx-primary-foreground)",
                "[&_button[data-day]]:transition-colors [&_button[data-day]]:duration-(--hover-duration) [&_button[data-day]]:ease-out motion-reduce:[&_button[data-day]]:transition-none",
                hoverVariant === "outline" &&
                  "[&_button[data-selected-single=true]]:bg-transparent! [&_button[data-selected-single=true]]:text-(--hx-primary)! [&_button[data-selected-single=true]]:shadow-[inset_0_0_0_2px_var(--hx-primary)]"
              )}
            />
            )}
            </CalendarPanel>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </HoverStyleContext.Provider>
  )
}

// ---- demo: page.tsx ----

// Each format is labelled with this date written in it, e.g. "28/09/2026" rather than "dd/MM/yyyy".
const SAMPLE_DATE = new Date(2026, 8, 28)
const DATE_FORMATS = [
  "PPP",
  "MMM d, yyyy",
  "dd/MM/yyyy",
  "MM/dd/yyyy",
  "yyyy-MM-dd",
  "dd MMM yyyy",
  "EEEE, d MMM",
  "MMMM yyyy",
  "yyyy",
]

const controls = {
  selectionMode: {
    group: "Trigger",
    type: "select",
    label: "Selection",
    value: "range",
    options: [
      { label: "Single date", value: "single" },
      { label: "Date range", value: "range" },
    ],
  },
  showIcon: { group: "Trigger", type: "checkbox", label: "Icon", value: true },
  rollingText: { group: "Trigger", type: "checkbox", label: "Rolling text", value: true },
  dateFormat: {
    group: "Trigger",
    type: "select",
    label: "Format",
    value: "PPP",
    options: DATE_FORMATS.map((value) => ({ label: format(SAMPLE_DATE, value), value })),
  },

  fromBehind: { group: "Popup", type: "checkbox", label: "From behind trigger", value: true },
  contentAnimation: {
    group: "Popup",
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
    group: "Popup",
    type: "slider",
    label: "Start scale",
    value: 0.9,
    min: 0.5,
    max: 1,
    step: 0.05,
  },
  closeOnSelect: { group: "Popup", type: "checkbox", label: "Close on select", value: true },

  captionLayout: {
    group: "Month change",
    type: "select",
    label: "Header",
    value: "dropdown",
    options: [
      { label: "Month + year", value: "dropdown" },
      { label: "Month only", value: "dropdown-months" },
      { label: "Year only", value: "dropdown-years" },
      { label: "Label", value: "label" },
    ],
  },
  yearsBefore: {
    disabled: (v: Record<string, unknown>) => v.captionLayout === "label" || v.captionLayout === "dropdown-months",
    group: "Month change",
    type: "slider",
    label: "Years before",
    value: 10,
    min: 0,
    max: 100,
    step: 1,
  },
  yearsAfter: {
    disabled: (v: Record<string, unknown>) => v.captionLayout === "label" || v.captionLayout === "dropdown-months",
    group: "Month change",
    type: "slider",
    label: "Years after",
    value: 10,
    min: 0,
    max: 100,
    step: 1,
  },
  monthAnimation: {
    group: "Month change",
    type: "select",
    label: "Month animation",
    value: "slide",
    options: [
      { label: "Slide + fade", value: "slide" },
      { label: "Fade", value: "fade" },
      { label: "None", value: "none" },
    ],
  },
  monthSlideDistance: {
    disabled: (v: Record<string, unknown>) => v.monthAnimation !== "slide",
    group: "Month change",
    type: "slider",
    label: "Slide distance",
    value: 40,
    min: 5,
    max: 100,
    step: 5,
    unit: "%",
  },
  slideArrows: { group: "Month change", type: "checkbox", label: "Slide arrows", value: true },

  hoverVariant: {
    group: "Date hover",
    type: "select",
    label: "Variant",
    value: "filled",
    options: [
      { label: "Filled", value: "filled" },
      { label: "Outline", value: "outline" },
    ],
  },
  hoverAnimation: {
    group: "Date hover",
    type: "select",
    label: "Hover animation",
    value: "slide",
    options: [
      { label: "Slide", value: "slide" },
      { label: "Fade", value: "fade" },
    ],
  },
  hoverDuration: {
    group: "Date hover",
    type: "slider",
    label: "Glide duration",
    value: 0.25,
    min: 0.05,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  hoverBounce: {
    disabled: (v: Record<string, unknown>) => v.hoverAnimation === "fade",
    group: "Date hover",
    type: "slider",
    label: "Glide bounce",
    value: 0.15,
    min: 0,
    max: 0.6,
    step: 0.05,
  },

  weekStartsOn: {
    group: "Calendar",
    type: "select",
    label: "Week starts",
    value: "0",
    options: [
      { label: "Sunday", value: "0" },
      { label: "Monday", value: "1" },
    ],
  },
  onlyCurrentMonth: { group: "Calendar", type: "checkbox", label: "Only current month", value: true },
  fixedWeeks: { group: "Calendar", type: "checkbox", label: "Fixed 6 weeks", value: true },
  disablePast: { group: "Calendar", type: "checkbox", label: "Disable past dates", value: false },
  highlightToday: { group: "Calendar", type: "checkbox", label: "Highlight today", value: false },
}

type DatePickerProps = React.ComponentProps<typeof DatePicker>

function DatePickerPage(props: Partial<ControlValues>) {
  const [date, setDate] = React.useState<Date>()
  const [range, setRange] = React.useState<DateRange>()
  const panel = useDemoControls(props)
  const { values } = panel

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mt-6 flex min-h-48 items-center justify-center">
        <DatePicker
          value={date}
          onChange={setDate}
          selectionMode={values.selectionMode as DatePickerProps["selectionMode"]}
          range={range}
          onRangeChange={setRange}
          showIcon={values.showIcon}
          rollingText={values.rollingText}
          dateFormat={values.dateFormat}
          fromBehind={values.fromBehind}
          contentAnimation={values.contentAnimation as DatePickerProps["contentAnimation"]}
          startScale={values.startScale}
          closeOnSelect={values.closeOnSelect}
          captionLayout={values.captionLayout as DatePickerProps["captionLayout"]}
          yearsBefore={values.yearsBefore}
          yearsAfter={values.yearsAfter}
          monthAnimation={values.monthAnimation as DatePickerProps["monthAnimation"]}
          monthSlideDistance={values.monthSlideDistance}
          slideArrows={values.slideArrows}
          hoverVariant={values.hoverVariant as DatePickerProps["hoverVariant"]}
          hoverAnimation={values.hoverAnimation as DatePickerProps["hoverAnimation"]}
          hoverDuration={values.hoverDuration}
          hoverBounce={values.hoverBounce}
          weekStartsOn={Number(values.weekStartsOn) as DatePickerProps["weekStartsOn"]}
          onlyCurrentMonth={values.onlyCurrentMonth}
          fixedWeeks={values.fixedWeeks}
          disablePast={values.disablePast}
          highlightToday={values.highlightToday}
        />
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

export interface AnimatedDatePickerProps extends Partial<ControlValues> {
  theme?: AnimatedDatePickerTheme;
  mode?: AnimatedDatePickerMode;
  className?: string;
}

export default function AnimatedDatePicker({ theme = "vscode", mode = "dark", className, ...props }: AnimatedDatePickerProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <ReducedMotionConfig>
          <DatePickerPage {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  DatePicker,
};
