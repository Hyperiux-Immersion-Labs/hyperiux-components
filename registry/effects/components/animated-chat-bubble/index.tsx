// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon, ReplyIcon, RotateCwIcon, ArrowUpIcon, MessageSquarePlusIcon, XIcon } from "lucide-react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { animate, AnimatePresence, motion, MotionConfig, useDragControls, useMotionValue, useTransform, type HTMLMotionProps, type Variants } from "motion/react";
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

export type AnimatedChatBubbleTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedChatBubbleMode = "light" | "dark";

const THEMES: Record<`${AnimatedChatBubbleTheme}:${AnimatedChatBubbleMode}`, Record<string, string>> = {
  "default:light": {
    "accent": "oklch(0.97 0 0)",
    "accent-foreground": "oklch(0.205 0 0)",
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "card": "oklch(1 0 0)",
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
    "secondary-foreground": "oklch(0.205 0 0)"
  },
  "default:dark": {
    "accent": "oklch(0.269 0 0)",
    "accent-foreground": "oklch(0.985 0 0)",
    "background": "oklch(0.145 0 0)",
    "border": "oklch(1 0 0 / 10%)",
    "card": "oklch(0.205 0 0)",
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
    "secondary-foreground": "oklch(0.985 0 0)"
  },
  "caffeine:light": {
    "accent": "#e8e8e8",
    "accent-foreground": "#202020",
    "background": "#f9f9f9",
    "border": "#d8d8d8",
    "card": "#fcfcfc",
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
    "secondary-foreground": "#582d1d"
  },
  "caffeine:dark": {
    "accent": "#2a2a2a",
    "accent-foreground": "#eeeeee",
    "background": "#111111",
    "border": "#201e18",
    "card": "#191919",
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
    "secondary-foreground": "#ffe0c2"
  },
  "claude:light": {
    "accent": "#e9e6dc",
    "accent-foreground": "#28261b",
    "background": "#faf9f5",
    "border": "#dad9d4",
    "card": "#faf9f5",
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
    "secondary-foreground": "#535146"
  },
  "claude:dark": {
    "accent": "#1a1915",
    "accent-foreground": "#f5f4ee",
    "background": "#262624",
    "border": "#3e3e38",
    "card": "#262624",
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
    "secondary-foreground": "#30302e"
  },
  "ghibli:light": {
    "accent": "#c9dfe8",
    "accent-foreground": "#2f4a55",
    "background": "#f3ecd9",
    "border": "#d5cba8",
    "card": "#f8f2e2",
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
    "secondary-foreground": "#4a4436"
  },
  "ghibli:dark": {
    "accent": "#31463f",
    "accent-foreground": "#e6e0cc",
    "background": "#1f2a26",
    "border": "#3b4c45",
    "card": "#27342f",
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
    "secondary-foreground": "#e6e0cc"
  },
  "spotify:light": {
    "accent": "#e8f8ee",
    "accent-foreground": "#0f6b30",
    "background": "#ffffff",
    "border": "#e0e0e0",
    "card": "#f6f6f6",
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
    "secondary-foreground": "#191414"
  },
  "spotify:dark": {
    "accent": "#2a2a2a",
    "accent-foreground": "#ffffff",
    "background": "#121212",
    "border": "#2a2a2a",
    "card": "#181818",
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
    "secondary-foreground": "#ffffff"
  },
  "valorant:light": {
    "accent": "#d5d0c4",
    "accent-foreground": "#0f1923",
    "background": "#ece8e1",
    "border": "#cfc9bc",
    "card": "#f5f2ec",
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
    "secondary-foreground": "#0f1923"
  },
  "valorant:dark": {
    "accent": "#22303d",
    "accent-foreground": "#ece8e1",
    "background": "#0f1923",
    "border": "#2b3a48",
    "card": "#16232f",
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
    "secondary-foreground": "#ece8e1"
  },
  "vscode:light": {
    "accent": "#e8e8e8",
    "accent-foreground": "#3b3b3b",
    "background": "#ffffff",
    "border": "#e5e5e5",
    "card": "#f8f8f8",
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
    "secondary-foreground": "#3b3b3b"
  },
  "vscode:dark": {
    "accent": "#2a2d2e",
    "accent-foreground": "#ffffff",
    "background": "#1f1f1f",
    "border": "#3c3c3c",
    "card": "#252526",
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
    "secondary-foreground": "#ffffff"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedChatBubbleTheme = "default", mode: AnimatedChatBubbleMode = "dark") {
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

// ---- label.tsx ----

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

// ---- checkbox.tsx ----

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-(--hx-input) transition-colors outline-none group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-(--hx-input) after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-(--hx-ring) focus-visible:ring-3 focus-visible:ring-(--hx-ring)/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-(--hx-destructive) aria-invalid:ring-3 aria-invalid:ring-(--hx-destructive)/20 aria-invalid:aria-checked:border-(--hx-primary) in-data-[theme=dark]:bg-(--hx-input)/30 in-data-[theme=dark]:aria-invalid:border-(--hx-destructive)/50 in-data-[theme=dark]:aria-invalid:ring-(--hx-destructive)/40 data-checked:border-(--hx-primary) data-checked:bg-(--hx-primary) data-checked:text-(--hx-primary-foreground) group-has-[:focus-visible]/field-label:data-checked:border-(--hx-primary) in-data-[theme=dark]:data-checked:bg-(--hx-primary)",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
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

// ---- bubble.tsx ----

const spring = { type: "spring", visualDuration: 0.4, bounce: 0.3 } as const
const bouncy = { type: "spring", visualDuration: 0.35, bounce: 0.5 } as const
const settle = { type: "spring", visualDuration: 0.3, bounce: 0 } as const

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node)
  else if (ref) (ref as React.RefObject<T | null>).current = node
}

const BubbleThreadContext = React.createContext(false)

// A slim, plain scrollbar in the theme's colours, instead of whatever the page styles scrollbars as
const THREAD_SCROLLBAR =
  "[scrollbar-width:thin] [scrollbar-color:color-mix(in_oklch,var(--hx-foreground)_30%,transparent)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[color-mix(in_oklch,var(--hx-foreground)_30%,transparent)]"

function BubbleThread({ className, children, ...props }: React.ComponentProps<"div">) {
  const reduceMotion = usePrefersReducedMotion()
  const scroller = React.useRef<HTMLDivElement>(null)
  const content = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = scroller.current
    const inner = content.current
    if (!el || !inner) return
    let lastHeight = inner.offsetHeight
    const observer = new ResizeObserver(() => {
      const grewBy = inner.offsetHeight - lastHeight
      lastHeight = inner.offsetHeight
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight - grewBy
      if (grewBy > 0 && distanceFromBottom < 120) {
        el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" })
      }
    })
    observer.observe(inner)

    let atBottom = true
    const onScroll = () => {
      atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8
    }
    const resize = new ResizeObserver(() => {
      if (atBottom) el.scrollTop = el.scrollHeight
    })
    el.addEventListener("scroll", onScroll, { passive: true })
    resize.observe(el)
    return () => {
      observer.disconnect()
      resize.disconnect()
      el.removeEventListener("scroll", onScroll)
    }
  }, [reduceMotion])

  return (
    <ReducedMotionConfig>
      <BubbleThreadContext.Provider value={true}>
        <motion.div
          ref={scroller}
          layoutScroll
          data-slot="bubble-thread"
          className={cn(THREAD_SCROLLBAR, "overflow-y-auto overscroll-contain", className)}
          {...(props as HTMLMotionProps<"div">)}
        >
          <div ref={content} className="relative flex min-h-full flex-col justify-end gap-4">
            {children}
          </div>
        </motion.div>
      </BubbleThreadContext.Provider>
    </ReducedMotionConfig>
  )
}

const joinedCorners = cn(
  "gap-0.5 [&_[data-slot=bubble-content]]:transition-[border-radius] [&_[data-slot=bubble-content]]:duration-300 motion-reduce:[&_[data-slot=bubble-content]]:transition-none",
  "[&>[data-align=start]:not(:first-child)>[data-slot=bubble-content]]:rounded-tl-sm",
  "[&>[data-align=start]:not(:last-child)>[data-slot=bubble-content]]:rounded-bl-sm",
  "[&>[data-align=end]:not(:first-child)>[data-slot=bubble-content]]:rounded-tr-sm",
  "[&>[data-align=end]:not(:last-child)>[data-slot=bubble-content]]:rounded-br-sm"
)

function BubbleGroup({
  className,
  joined = false,
  ...props
}: React.ComponentProps<"div"> & {
  joined?: boolean
}) {
  const inThread = React.useContext(BubbleThreadContext)

  return (
    <motion.div
      data-slot="bubble-group"
      layout={inThread ? "position" : undefined}
      transition={{ layout: spring }}
      className={cn("flex min-w-0 flex-col gap-2", joined && joinedCorners, className)}
      {...(props as HTMLMotionProps<"div">)}
    />
  )
}

const bubbleVariants = cva(
  "group/bubble relative isolate flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-(--hx-primary) *:data-[slot=bubble-content]:text-(--hx-primary-foreground) [&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--hx-primary)/80",
        secondary:
          "*:data-[slot=bubble-content]:bg-(--hx-secondary) *:data-[slot=bubble-content]:text-(--hx-secondary-foreground) [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--hx-secondary),var(--hx-foreground)_5%)]",
        muted:
          "*:data-[slot=bubble-content]:bg-(--hx-muted) [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--hx-muted),var(--hx-foreground)_5%)]",
        tinted:
          "*:data-[slot=bubble-content]:bg-[oklch(from_var(--hx-primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-(--hx-foreground) in-data-[theme=dark]:*:data-[slot=bubble-content]:bg-[oklch(from_var(--hx-primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--hx-primary)_0.88_calc(c*0.5)_h)] in-data-[theme=dark]:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--hx-primary)_0.35_calc(c*0.5)_h)]",
        outline:
          "*:data-[slot=bubble-content]:border-(--hx-border) *:data-[slot=bubble-content]:bg-(--hx-background) [&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--hx-muted) [&>[data-slot=bubble-content]:is(button,a):hover]:text-(--hx-foreground) in-data-[theme=dark]:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--hx-input)/30",
        ghost:
          "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--hx-muted) [&>[data-slot=bubble-content]:is(button,a):hover]:text-(--hx-foreground) in-data-[theme=dark]:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--hx-muted)/50",
        destructive:
          "*:data-[slot=bubble-content]:bg-(--hx-destructive)/10 *:data-[slot=bubble-content]:text-(--hx-destructive) in-data-[theme=dark]:*:data-[slot=bubble-content]:bg-(--hx-destructive)/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--hx-destructive)/20 in-data-[theme=dark]:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-(--hx-destructive)/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const enterVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 12 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...spring, delay },
  }),
}

const DEFAULT_REACTIONS = ["❤️", "😂", "😮", "😢", "🙏", "👍"]
const PICKER_DELAY_MS = 450
const SWIPE_THRESHOLD = 40

function Bubble({
  variant = "default",
  align = "start",
  className,
  animateEnter = true,
  enterDelay = 0,
  enterFrom,
  shakeOnError = true,
  liftOnHover = false,
  selectable = true,
  time,
  revealTime = false,
  swipeToReply = true,
  onReply,
  onReact,
  onUnreact,
  reacted,
  doubleClickToReact = true,
  showReactionPicker = true,
  magnifyEmojis = false,
  reactions = DEFAULT_REACTIONS,
  ref,
  style,
  children,
  onDoubleClick,
  onMouseDown,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
    animateEnter?: boolean
    enterDelay?: number
    enterFrom?: { x: number; y: number; width: number; height: number }
    shakeOnError?: boolean
    liftOnHover?: boolean
    selectable?: boolean
    time?: string
    revealTime?: boolean
    swipeToReply?: boolean
    onReply?: () => void
    onReact?: (emoji: string) => void
    onUnreact?: (emoji: string) => void
    /** Emojis you've already reacted with. */
    reacted?: string[]
    doubleClickToReact?: boolean
    showReactionPicker?: boolean
    magnifyEmojis?: boolean
    /** Emojis offered by the picker. */
    reactions?: string[]
  }) {
  const reduceMotion = usePrefersReducedMotion()
  const inThread = React.useContext(BubbleThreadContext)
  const node = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [bursts, setBursts] = React.useState<{ id: number; x: number; y: number }[]>([])
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [pickerSide, setPickerSide] = React.useState<"top" | "bottom">("top")
  const dragControls = useDragControls()
  const pickerTimer = React.useRef<number | undefined>(undefined)

  const setRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      node.current = el
      assignRef(ref, el)
    },
    [ref]
  )

  const canSwipe = swipeToReply && onReply !== undefined

  const openPicker = () => {
    const el = node.current
    const thread = el?.closest("[data-slot=bubble-thread]")
    if (el && thread) {
      const room = el.getBoundingClientRect().top - thread.getBoundingClientRect().top
      const needed = 3.25 * parseFloat(getComputedStyle(document.documentElement).fontSize)
      setPickerSide(room < needed ? "bottom" : "top")
    }
    setPickerOpen(true)
  }
  const canPick = showReactionPicker && onReact !== undefined

  const flyFrom = React.useRef(enterFrom)
  React.useLayoutEffect(() => {
    const from = flyFrom.current
    const content = node.current?.querySelector<HTMLElement>(":scope > [data-slot=bubble-content]")
    if (!from || !content || reduceMotion) return
    const rect = content.getBoundingClientRect()
    const computed = getComputedStyle(content)
    const ghost = content.cloneNode(true) as HTMLElement
    Object.assign(ghost.style, {
      position: "fixed",
      left: `${from.x}px`,
      top: `${from.y + (from.height - rect.height) / 2}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: "0",
      zIndex: "50",
      pointerEvents: "none",
      transform: "none",
      backgroundColor: computed.backgroundColor,
      color: computed.color,
      borderColor: computed.borderColor,
    })
    document.body.append(ghost)
    content.style.visibility = "hidden"
    const start = { x: from.x, y: from.y + (from.height - rect.height) / 2 }
    const flight = animate(0, 1, {
      type: "spring",
      visualDuration: 0.5,
      bounce: 0.15,
      onUpdate: (p) => {
        const target = content.getBoundingClientRect()
        ghost.style.left = `${start.x + (target.left - start.x) * p}px`
        ghost.style.top = `${start.y + (target.top - start.y) * p}px`
        ghost.style.opacity = String(0.4 + 0.6 * Math.min(p, 1))
      },
    })
    const land = () => {
      ghost.remove()
      content.style.visibility = ""
    }
    flight.then(land)
    return () => {
      flight.stop()
      land()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Shake when a send fails.
  const lastVariant = React.useRef(variant)
  React.useEffect(() => {
    const was = lastVariant.current
    lastVariant.current = variant
    if (!shakeOnError || reduceMotion || variant !== "destructive" || was === "destructive") return
    animate(x, [0, -8, 8, -5, 5, -2, 0], { duration: 0.45, ease: "easeOut" })
  }, [variant, shakeOnError, reduceMotion, x])

  React.useEffect(() => () => window.clearTimeout(pickerTimer.current), [])

  const arrowX = useTransform(x, (v) => -v)
  const arrowProgress = useTransform(x, (v) => Math.min(Math.abs(v) / SWIPE_THRESHOLD, 1))
  const arrowScale = useTransform(arrowProgress, [0, 1], [0.4, 1])

  const flying = enterFrom !== undefined

  return (
    <motion.div
      ref={setRef}
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(
        bubbleVariants({ variant }),
        "has-data-[slot=bubble-reactions]:z-10",
        (pickerOpen || bursts.length > 0) && "z-20",
        liftOnHover &&
          "*:data-[slot=bubble-content]:transition-shadow *:data-[slot=bubble-content]:duration-300 hover:*:data-[slot=bubble-content]:shadow-md motion-reduce:*:data-[slot=bubble-content]:transition-none",
        className
      )}
      style={{ ...style, x, originX: align === "end" ? 1 : 0, originY: 1 }}
      custom={enterDelay}
      variants={enterVariants}
      initial={animateEnter && !flying ? "hidden" : false}
      animate="visible"
      layout={inThread ? "position" : undefined}
      transition={{ layout: spring }}
      whileHover={liftOnHover ? { y: -2 } : undefined}
      whileTap={liftOnHover ? { scale: 0.98 } : undefined}
      drag={canSwipe ? "x" : false}
      dragListener={!selectable}
      dragControls={dragControls}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={align === "end" ? { left: 0.5, right: 0 } : { left: 0, right: 0.5 }}
      dragDirectionLock
      onDragStart={() => {
        window.clearTimeout(pickerTimer.current)
        setPickerOpen(false)
      }}
      onDragEnd={() => {
        if (Math.abs(x.get()) >= SWIPE_THRESHOLD) onReply?.()
      }}
      onMouseDown={(event) => {
        onMouseDown?.(event)
        if (doubleClickToReact && onReact && event.detail > 1) event.preventDefault()
      }}
      onDoubleClick={(event) => {
        onDoubleClick?.(event)
        if (!doubleClickToReact || !onReact) return
        if (reacted?.includes("❤️") && onUnreact) {
          onUnreact("❤️")
          return
        }
        onReact("❤️")
        if (reduceMotion || !node.current) return
        const box = node.current.getBoundingClientRect()
        const burst = { id: event.timeStamp, x: event.clientX - box.left, y: event.clientY - box.top }
        setBursts((current) => [...current, burst])
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        if (!canPick || event.pointerType !== "mouse") return
        window.clearTimeout(pickerTimer.current)
        pickerTimer.current = window.setTimeout(openPicker, PICKER_DELAY_MS)
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        window.clearTimeout(pickerTimer.current)
        if (event.pointerType === "mouse") {
          pickerTimer.current = window.setTimeout(() => setPickerOpen(false), 150)
        }
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (canSwipe && selectable && (event.pointerType !== "mouse" || !isOverText(event))) {
          dragControls.start(event)
        }
        // Long-press on touch.
        if (!canPick || event.pointerType === "mouse") return
        window.clearTimeout(pickerTimer.current)
        pickerTimer.current = window.setTimeout(openPicker, PICKER_DELAY_MS)
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event)
        if (event.pointerType !== "mouse") window.clearTimeout(pickerTimer.current)
      }}
      {...(props as HTMLMotionProps<"div">)}
    >
      {canSwipe && (
        <motion.span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-1/2 -z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-(--hx-muted) text-(--hx-muted-foreground)",
            align === "end" ? "right-0" : "left-0"
          )}
          style={{ x: arrowX, opacity: arrowProgress, scale: arrowScale }}
        >
          <ReplyIcon className={cn("size-4", align === "end" && "-scale-x-100")} />
        </motion.span>
      )}
      {children}
      {revealTime && time && (
        <span
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 px-2 text-xs whitespace-nowrap text-(--hx-muted-foreground) opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover/bubble:translate-x-0 group-hover/bubble:opacity-100 motion-reduce:transition-none motion-reduce:translate-x-0",
            align === "end" ? "right-full translate-x-2" : "left-full -translate-x-2"
          )}
        >
          {time}
        </span>
      )}
      <AnimatePresence>
        {canPick && pickerOpen && (
          <ReactionPicker
            key="picker"
            align={align}
            side={pickerSide}
            reactions={reactions}
            magnifyEmojis={magnifyEmojis}
            onPick={(emoji) => {
              setPickerOpen(false)
              onReact?.(emoji)
            }}
          />
        )}
      </AnimatePresence>
      {bursts.map((burst) => (
        <HeartBurst
          key={burst.id}
          x={burst.x}
          y={burst.y}
          onDone={() => setBursts((current) => current.filter((b) => b.id !== burst.id))}
        />
      ))}
    </motion.div>
  )
}

function isOverText(event: React.PointerEvent<HTMLElement>) {
  const content = event.currentTarget.querySelector("[data-slot=bubble-content]")
  if (!content) return false
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue
    range.selectNodeContents(node)
    for (const rect of range.getClientRects()) {
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        return true
      }
    }
  }
  return false
}

function ReactionPicker({
  align,
  side,
  reactions,
  magnifyEmojis,
  onPick,
}: {
  align: "start" | "end"
  side: "top" | "bottom"
  reactions: string[]
  magnifyEmojis: boolean
  onPick: (emoji: string) => void
}) {
  const reduceMotion = usePrefersReducedMotion()
  const scaleUnderPointer = (row: HTMLElement, pointerX: number | null) => {
    if (!magnifyEmojis || reduceMotion) return
    for (const button of row.querySelectorAll<HTMLElement>("[data-emoji]")) {
      const box = button.getBoundingClientRect()
      const distance = pointerX === null ? Infinity : Math.abs(pointerX - (box.left + box.width / 2))
      const scale = 1 + 0.6 * Math.max(0, 1 - distance / 64)
      animate(button, { scale, y: (1 - scale) * 10 }, { type: "spring", stiffness: 400, damping: 25 })
    }
  }

  return (
    <motion.div
      className={cn(
        "absolute z-20 py-2",
        side === "top" ? "bottom-full" : "top-full",
        align === "end" ? "right-0" : "left-0",
        side === "top"
          ? align === "end" ? "origin-bottom-right" : "origin-bottom-left"
          : align === "end" ? "origin-top-right" : "origin-top-left"
      )}
      initial={{ opacity: 0, y: side === "top" ? 8 : -8, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: side === "top" ? 8 : -8, scale: 0.8, transition: { duration: 0.15 } }}
      transition={bouncy}
    >
      <div
        role="toolbar"
        aria-label="React"
        className="flex items-end gap-2.5 rounded-full border bg-(--hx-popover) px-3 py-1.5 shadow-lg"
        onMouseMove={(event) => scaleUnderPointer(event.currentTarget, event.clientX)}
        onMouseLeave={(event) => scaleUnderPointer(event.currentTarget, null)}
      >
        {reactions.map((emoji) => (
          <button
            key={emoji}
            type="button"
            data-emoji
            aria-label={`React with ${emoji}`}
            onClick={() => onPick(emoji)}
            className="origin-bottom rounded-full text-xl leading-none outline-none focus-visible:ring-2 focus-visible:ring-(--hx-ring)"
          >
            {emoji}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function HeartBurst({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  const hearts = 7
  return (
    <span aria-hidden className="pointer-events-none absolute z-30" style={{ left: x, top: y }}>
      {Array.from({ length: hearts }, (_, i) => {
        const angle = (i / hearts) * Math.PI * 2 - Math.PI / 2
        const distance = 26 + (i % 2) * 12
        return (
          <motion.span
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-xs"
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance - 8,
              scale: 1,
              opacity: 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            ❤️
          </motion.span>
        )
      })}
      <motion.span
        className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1.4, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 0.8, times: [0, 0.4, 1] }}
        onAnimationComplete={onDone}
      >
        ❤️
      </motion.span>
    </span>
  )
}

function BubbleContent({
  className,
  render,
  typing = false,
  grow = false,
  layoutId,
  children,
  ...props
}: useRender.ComponentProps<"div"> & {
  typing?: boolean
  grow?: boolean
  layoutId?: string
}) {
  const reduceMotion = usePrefersReducedMotion()
  const node = React.useRef<HTMLDivElement>(null)

  const wasTyping = React.useRef(typing)
  React.useLayoutEffect(() => {
    const was = wasTyping.current
    wasTyping.current = typing
    const el = node.current
    if (grow || !was || typing || !el || reduceMotion) return
    el.style.opacity = "0"
    animate(el, { opacity: [0, 1], scale: [0.85, 1] }, spring)
  }, [typing, grow, reduceMotion])

  return useRender({
    defaultTagName: "div",
    ref: node,
    render: render ?? (
      <motion.div layout={grow} layoutId={layoutId} transition={{ layout: spring }} />
    ),
    props: mergeProps<"div">(
      {
        ...slotAttr("bubble-content"),
        className: cn(
          "relative w-fit max-w-full min-w-0 origin-bottom-left overflow-hidden rounded-md border border-transparent px-3 py-2 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:origin-bottom-right group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-(--hx-ring) [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-(--hx-ring)/50",
          className
        ),
        children: render ? (
          children
        ) : !grow ? (
          typing ? (
            <TypingDots />
          ) : (
            children
          )
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={typing ? "typing" : "message"}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {typing ? <TypingDots /> : children}
            </motion.div>
          </AnimatePresence>
        ),
      },
      props
    ),
  })
}

function TypingDots() {
  return (
    <span role="status" aria-label="Typing" className="flex h-lh items-center gap-1 px-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-current"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  )
}

const CHARS_PER_LINE = 70

function BubbleText({
  className,
  text,
  stream = false,
  wordDelay = 70,
  onStreamEnd,
  fade = true,
  collapsible = true,
  lines = 6,
  time,
}: {
  className?: string
  text: string
  time?: React.ReactNode
  stream?: boolean
  wordDelay?: number
  onStreamEnd?: () => void
  fade?: boolean
  collapsible?: boolean
  lines?: number
}) {
  const reduceMotion = usePrefersReducedMotion()
  const tokens = text.split(/(\s+)/)
  const [streams] = React.useState(stream)
  const [shown, setShown] = React.useState(streams ? 1 : tokens.length)
  const [initialWords] = React.useState(shown)
  const endStream = React.useEffectEvent(() => onStreamEnd?.())
  const total = tokens.length

  React.useEffect(() => {
    if (!streams) return
    let count = 1
    const timer = window.setInterval(() => {
      count = Math.min(count + 2, total)
      setShown(count)
      if (count >= total) {
        window.clearInterval(timer)
        endStream()
      }
    }, wordDelay)
    return () => window.clearInterval(timer)
  }, [streams, total, wordDelay])

  const words = tokens.slice(0, shown)
  const [expanded, setExpanded] = React.useState(false)
  const [toggled, setToggled] = React.useState(false)
  // `null` until measured. Until then the text is capped at `lines`, so a long message
  // starts out cropped instead of showing in full and then snapping shut.
  const [overflowing, setOverflowing] = React.useState<boolean | null>(null)
  const inner = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const el = inner.current
    if (!el || !collapsible) return
    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
      setOverflowing(el.offsetHeight > lineHeight * lines + 1)
    }
    // Measure before the first paint; the observer then catches streaming and resizes.
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [collapsible, lines])

  // Before it can be measured (the server render), guess from the length so a long message
  // already has its fade and "Show more" and doesn't grow a row when the page hydrates.
  const likelyLong = text.length > lines * CHARS_PER_LINE
  const canCollapse = collapsible && (overflowing ?? likelyLong)
  const collapsed = canCollapse && !expanded
  const clampHeight = `${lines * 1.625}em`

  return (
    <div data-slot="bubble-text" className={cn("flex flex-col gap-1", className)}>
      <motion.div
        initial={false}
        animate={{ height: collapsed ? clampHeight : "auto" }}
        // Height isn't a transform, so MotionConfig doesn't stop it: snap under reduced motion
        transition={reduceMotion ? { duration: 0 } : spring}
        // The cap stays on until the first toggle; dropping it as soon as the text is measured
        // would let the box grow for a frame before the height animation takes over.
        style={{
          maxHeight: collapsible && !toggled && overflowing !== false ? clampHeight : undefined,
        }}
        className={cn(
          "overflow-hidden",
          collapsed && "mask-[linear-gradient(to_bottom,black_55%,transparent)]"
        )}
      >
        <div ref={inner} className="relative whitespace-pre-wrap">
          {words.map((word, i) =>
            fade && i >= initialWords ? (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                {word}
              </motion.span>
            ) : (
              <React.Fragment key={i}>{word}</React.Fragment>
            )
          )}
          {time !== undefined && !canCollapse && (
            <>
              <span aria-hidden className="invisible inline-block ps-3 text-xs leading-none">
                {time}
              </span>
              <span
                data-slot="bubble-time"
                className="absolute right-0 bottom-0.5 text-xs leading-none whitespace-nowrap opacity-60"
              >
                {time}
              </span>
            </>
          )}
        </div>
      </motion.div>
      {canCollapse && (
        <div className="flex items-end justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setToggled(true)
              setExpanded((e) => !e)
            }}
            className={cn(
              "relative self-start text-xs font-medium opacity-80 outline-none",
              "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out motion-reduce:after:transition-none",
              "hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100"
            )}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
          {time !== undefined && (
            <span data-slot="bubble-time" className="text-xs leading-none whitespace-nowrap opacity-60">
              {time}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

const bubbleReactionsVariants = cva(
  "z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-(--hx-muted) px-1.5 py-0.5 text-sm ring-3 ring-(--hx-card) has-[button]:p-0",
  {
    variants: {
      side: {
        top: "absolute top-0 -translate-y-3/4",
        bottom: "relative -translate-y-1/2",
      },
      align: {
        start: "",
        end: "",
      },
    },
    compoundVariants: [
      { side: "top", align: "start", className: "left-3" },
      { side: "top", align: "end", className: "right-3" },
      { side: "bottom", align: "start", className: "mx-3 self-start" },
      { side: "bottom", align: "end", className: "mx-3 self-end" },
    ],
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  }
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  popOnChange = true,
  count,
  rollingNumbers = true,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
  popOnChange?: boolean
  count?: number
  rollingNumbers?: boolean
}) {
  const node = React.useRef<HTMLDivElement>(null)
  const reduceMotion = usePrefersReducedMotion()
  const lastCount = React.useRef(count)
  React.useEffect(() => {
    const was = lastCount.current
    lastCount.current = count
    if (!popOnChange || reduceMotion || was === count || !node.current) return
    animate(node.current, { rotate: [0, -12, 10, -6, 0], scale: [1, 1.2, 1] }, { duration: 0.5 })
  }, [count, popOnChange, reduceMotion])

  const pill = (
    <motion.div
      ref={node}
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      initial={popOnChange ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      exit={popOnChange ? { scale: 0, opacity: 0 } : undefined}
      transition={bouncy}
      {...(props as HTMLMotionProps<"div">)}
    >
      <span className="flex gap-0.5">{children}</span>
      {count !== undefined && <RollingNumber value={count} rollingNumbers={rollingNumbers} />}
    </motion.div>
  )

  if (side === "top") return pill

  return (
    <motion.div
      className="flex flex-col"
      initial={{ height: 0, marginTop: "-0.25rem" }}
      animate={{ height: "auto", marginTop: 0 }}
      exit={{ height: 0, marginTop: "-0.25rem" }}
      transition={reduceMotion ? { duration: 0 } : settle}
    >
      {pill}
    </motion.div>
  )
}

function RollingNumber({ value, rollingNumbers }: { value: number; rollingNumbers: boolean }) {
  const text = String(value)
  if (!rollingNumbers) return <span className="tabular-nums">{text}</span>
  const digits = text.split("")
  return (
    <span className="tabular-nums">
      <span className="sr-only">{text}</span>
      {digits.map((digit, i) => (
        <RollingDigit key={digits.length - i} digit={Number(digit)} />
      ))}
    </span>
  )
}

function RollingDigit({ digit }: { digit: number }) {
  return (
    <span aria-hidden className="relative inline-block contain-paint [clip-path:inset(0)]">
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

type BubbleStatusValue = "sending" | "sent" | "delivered" | "read" | "failed"

const statusLabels: Record<BubbleStatusValue, string> = {
  sending: "Sending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Not delivered",
}

function BubbleStatus({
  className,
  status,
  animated = true,
  onRetry,
}: {
  className?: string
  status: BubbleStatusValue
  animated?: boolean
  onRetry?: () => void
}) {
  const reduceMotion = usePrefersReducedMotion()
  const icon = React.useRef<HTMLSpanElement>(null)
  const [spinning, setSpinning] = React.useState(false)
  // pathLength isn't a transform, so it's switched off here for reduced motion
  const draw = animated && !reduceMotion ? { pathLength: 0 } : false

  const retry = async () => {
    if (spinning) return
    if (animated && !reduceMotion && icon.current) {
      setSpinning(true)
      await animate(icon.current, { rotate: [0, 360] }, { duration: 0.6, ease: [0.65, 0, 0.35, 1] })
      setSpinning(false)
    }
    onRetry?.()
  }

  return (
    <div
      data-slot="bubble-status"
      className={cn(
        "flex items-center gap-1 text-xs whitespace-nowrap text-(--hx-muted-foreground) group-data-[align=end]/bubble:justify-end",
        "w-0 min-w-full",
        status === "failed" && "text-(--hx-destructive)",
        className
      )}
    >
      {status === "failed" ? (
        <>
          <span>{statusLabels.failed} ·</span>
          <button
            type="button"
            onClick={retry}
            aria-busy={spinning || undefined}
            className="flex items-center gap-1 font-medium outline-none hover:underline focus-visible:underline"
          >
            <span ref={icon} className="flex">
              <RotateCwIcon className="size-3" />
            </span>
            Retry
          </button>
        </>
      ) : (
        <>
          {status === "sending" ? (
            <ClockIcon className="size-3" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className={cn(
                "size-3.5 transition-colors duration-500 motion-reduce:transition-none",
                status === "read" && "text-(--hx-info)"
              )}
            >
              <motion.path
                d="M18 6 7 17l-5-5"
                initial={draw}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              {status !== "sent" && (
                <motion.path
                  d="m22 10-7.5 7.5L13 16"
                  initial={draw}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
            </svg>
          )}
          <span>{statusLabels[status]}</span>
        </>
      )}
    </div>
  )
}

function BubbleSuggestions({
  className,
  stagger = true,
  ...props
}: React.ComponentProps<"div"> & {
  stagger?: boolean
}) {
  return (
    <motion.div
      data-slot="bubble-suggestions"
      className={cn("flex flex-wrap justify-end gap-2", className)}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
        visible: { transition: { staggerChildren: stagger ? 0.07 : 0, delayChildren: 0.1 } },
      }}
      {...(props as HTMLMotionProps<"div">)}
    />
  )
}

function BubbleSuggestion({ className, ...props }: HTMLMotionProps<"button">) {
  return (
    <motion.button
      type="button"
      data-slot="bubble-suggestion"
      variants={{
        hidden: { opacity: 0, y: 8, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: spring },
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ layout: spring }}
      className={cn(
        "w-fit rounded-md border border-(--hx-border) bg-(--hx-background) px-3 py-2 text-sm leading-relaxed transition-colors outline-none hover:bg-(--hx-muted) focus-visible:ring-3 focus-visible:ring-(--hx-ring)/50 in-data-[theme=dark]:hover:bg-(--hx-input)/30",
        className
      )}
      {...props}
    />
  )
}

// ---- demo: chat-demo.tsx ----

const variants = [
  { label: "Default", value: "default" },
  { label: "Secondary", value: "secondary" },
  { label: "Muted", value: "muted" },
  { label: "Tinted", value: "tinted" },
  { label: "Outline", value: "outline" },
  { label: "Ghost", value: "ghost" },
  { label: "Destructive", value: "destructive" },
] as const

type Variant = (typeof variants)[number]["value"]

type Message = {
  id: string
  from: "me" | "them"
  text: string
  time: string
  at: number
  variant?: Variant
  status?: BubbleStatusValue
  reactions: Record<string, number>
  mine?: string[]
  typing?: boolean
  replyTo?: string
  /** Seeded messages don't animate in. */
  seed?: boolean
  flyFrom?: { x: number; y: number; width: number; height: number }
  layoutId?: string
  stream?: boolean
}

const seed: Message[] = [
  { id: "s1", at: 0, from: "them", text: "Morning! Did the new beans arrive?", time: "9:38 AM", reactions: {}, seed: true },
  { id: "s2", at: 0, from: "them", text: "The Ethiopian roast, I mean. I want to try it for Saturday.", time: "9:38 AM", reactions: {}, seed: true },
  { id: "s3", at: 120000, from: "me", text: "They did, two bags this morning ☕", time: "9:40 AM", reactions: {}, seed: true },
  { id: "s4", at: 120000, from: "me", text: "Roasted on Monday, so they're at their best this week.", time: "9:40 AM", reactions: { "❤️": 2 }, status: "read", seed: true },
  {
    id: "s5",
    at: 240000,
    from: "them",
    text: "Perfect. Here's the plan for Saturday: we open at eight, so I'll come in at seven to dial in the grinder. The Ethiopian goes on filter first, then we'll try it as espresso around ten once the morning rush dies down. If it's too bright as espresso we'll keep it on filter all day and put the house blend back on the machine. I'll write tasting notes for the board, and could you print a few cards for the counter? Oh, and remind me to order more oat milk, we ran out twice last week.",
    time: "9:42 AM",
    reactions: {},
    seed: true,
  },
]

const replies = [
  "Nice, I'll grab a bag on my way in.",
  "Honestly the filter grind was spot on last time. Same again? I think a touch finer might bring out the berry notes, but let's taste it first.",
  "Sounds good 👍",
  "Can you check the grinder burrs too? They've been sounding rough.",
]

const incoming = ["Quick one", "Oat milk is here 🥛", "Also, the new cups arrived!"]

const suggestionSets = [
  ["Sure, on it", "Espresso instead?", "Tomorrow?"],
  ["Same again", "Go finer", "Let's taste first"],
  ["👍", "Thanks!", "See you at seven"],
]

const controls = {
  animateEnter: { group: "Arriving", type: "checkbox", label: "Animate enter", value: true },
  typing: { group: "Arriving", type: "checkbox", label: "Typing indicator", value: true },
  streamText: { group: "Arriving", type: "checkbox", label: "Stream text", value: false },

  flyIn: { group: "Sending", type: "checkbox", label: "Fly from input", value: true },
  showDeliveryStatus: { group: "Sending", type: "checkbox", label: "Show delivery status", value: true },
  shakeOnError: { disabled: (v: Record<string, unknown>) => !v.simulateFailures, group: "Sending", type: "checkbox", label: "Shake on error", value: true },
  simulateFailures: { group: "Sending", type: "checkbox", label: "Simulate failures", value: true },

  popOnChange: { group: "Reactions", type: "checkbox", label: "Pop on change", value: true },
  rollingNumbers: { group: "Reactions", type: "checkbox", label: "Rolling numbers", value: true },
  doubleClickToReact: { group: "Reactions", type: "checkbox", label: "Double click to react", value: true },
  showReactionPicker: { group: "Reactions", type: "checkbox", label: "Show reaction picker", value: true },
  magnifyEmojis: { disabled: (v: Record<string, unknown>) => !v.showReactionPicker, group: "Reactions", type: "checkbox", label: "Magnify emojis", value: true },

  liftOnHover: { group: "Interaction", type: "checkbox", label: "Lift on hover", value: true },
  selectable: { group: "Interaction", type: "checkbox", label: "Selectable text", value: true },
  swipeToReply: { group: "Interaction", type: "checkbox", label: "Swipe to reply", value: true },
  showSuggestions: { group: "Interaction", type: "checkbox", label: "Show suggestions", value: true },
  collapsible: { group: "Interaction", type: "checkbox", label: "Collapsible", value: true },

  joined: { group: "Grouping", type: "checkbox", label: "Joined corners", value: true },
  sendStyle: {
    group: "Grouping",
    type: "select",
    label: "Sent bubble style",
    value: "default",
    options: variants.map(({ label, value }) => ({ label, value })),
  },
}

const FAIL_CHANCE = 0.25

function now() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

const GROUP_GAP_MS = 60_000

function groupMessages(messages: Message[]) {
  const groups: { id: string; from: Message["from"]; messages: Message[] }[] = []
  for (const message of messages) {
    const last = groups[groups.length - 1]
    const previous = last?.messages[last.messages.length - 1]
    if (last && previous && last.from === message.from && message.at - previous.at < GROUP_GAP_MS) {
      last.messages.push(message)
    } else {
      groups.push({ id: message.id, from: message.from, messages: [message] })
    }
  }
  return groups
}

function ChatDemo(props: Partial<ControlValues>) {
  const [engaged, setEngaged] = React.useState(false)
  const [hovering, setHovering] = React.useState(false)
  const panel = useDemoControls(props)
  const { values } = panel

  const [messages, setMessages] = React.useState<Message[]>(seed)
  const [draft, setDraft] = React.useState("")
  const variant = values.sendStyle as Variant
  const [replyTo, setReplyTo] = React.useState<Message | null>(null)
  const [suggestions, setSuggestions] = React.useState<{ id: string; texts: string[] } | null>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [autoReply, setAutoReply] = React.useState(true)
  const autoReplyRef = React.useRef(autoReply)
  React.useEffect(() => {
    autoReplyRef.current = autoReply
  })
  const replyIndex = React.useRef(0)
  const pendingSuggestions = React.useRef(new Map<string, () => void>())
  const timers = React.useRef(new Set<number>())

  React.useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  function later(fn: () => void, ms: number) {
    const t = window.setTimeout(() => {
      timers.current.delete(t)
      fn()
    }, ms)
    timers.current.add(t)
  }

  function update(id: string, patch: Partial<Message>) {
    setMessages((current) => current.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  function unreact(id: string, emoji: string) {
    setMessages((current) =>
      current.map((m) => {
        if (m.id !== id || !m.mine?.includes(emoji)) return m
        const { [emoji]: count = 0, ...others } = m.reactions
        return {
          ...m,
          reactions: count > 1 ? { ...others, [emoji]: count - 1 } : others,
          mine: m.mine.filter((e) => e !== emoji),
        }
      })
    )
  }

  function react(id: string, emoji: string) {
    setMessages((current) =>
      current.map((m) => {
        if (m.id !== id || m.mine?.includes(emoji)) return m
        return {
          ...m,
          reactions: { ...m.reactions, [emoji]: (m.reactions[emoji] ?? 0) + 1 },
          mine: [...(m.mine ?? []), emoji],
        }
      })
    )
  }

  function botReply() {
    const id = crypto.randomUUID()
    const text = replies[replyIndex.current % replies.length]
    const nextSuggestions = suggestionSets[replyIndex.current % suggestionSets.length]
    replyIndex.current += 1
    const stream = values.streamText
    const showSuggestions = () => setSuggestions({ id: crypto.randomUUID(), texts: nextSuggestions })
    if (stream) pendingSuggestions.current.set(id, showSuggestions)

    setMessages((current) => [
      ...current,
      { id, from: "them", text, time: now(), at: Date.now(), reactions: {}, typing: values.typing, stream },
    ])
    const reveal = () => {
      update(id, { typing: false })
      if (!stream) later(showSuggestions, 300)
    }
    if (values.typing) later(reveal, 1400)
    else if (!stream) later(showSuggestions, 300)
  }

  function deliver(id: string, canFail: boolean) {
    later(() => {
      if (canFail && values.simulateFailures && Math.random() < FAIL_CHANCE) {
        update(id, { status: "failed" })
        return
      }
      update(id, { status: "sent" })
      later(() => update(id, { status: "delivered" }), 700)
      later(() => {
        update(id, { status: "read" })
        if (autoReplyRef.current) botReply()
      }, 1500)
    }, 500)
  }

  function send(text: string, options: { layoutId?: string } = {}) {
    const id = crypto.randomUUID()
    const box = inputRef.current?.getBoundingClientRect()
    setMessages((current) => [
      ...current,
      {
        id,
        from: "me",
        text,
        time: now(),
        at: Date.now(),
        variant,
        status: "sending",
        reactions: {},
        replyTo: replyTo?.text,
        layoutId: options.layoutId,
        flyFrom:
          values.flyIn && box && !options.layoutId
            ? { x: box.left + 10, y: box.top, width: box.width, height: box.height }
            : undefined,
      },
    ])
    setReplyTo(null)
    setSuggestions(null)
    deliver(id, true)
  }

  function simulateIncoming() {
    incoming.forEach((text, i) =>
      later(
        () =>
          setMessages((current) => [
            ...current,
            { id: crypto.randomUUID(), from: "them", text, time: now(), at: Date.now(), reactions: {} },
          ]),
        i * 700
      )
    )
  }

  const lastMine = [...messages].reverse().find((m) => m.from === "me")

  function renderMessage(message: Message) {
    const mine = message.from === "me"
    const failed = message.status === "failed"
    const total = Object.values(message.reactions).reduce((sum, n) => sum + n, 0)
    const showStatus = values.showDeliveryStatus && mine && (failed || message.id === lastMine?.id)
    return (
      <Bubble
        key={message.id}
        align={mine ? "end" : "start"}
        variant={failed ? "destructive" : mine ? (message.variant ?? "default") : "muted"}
        animateEnter={values.animateEnter && !message.seed && !message.layoutId}
        enterFrom={message.flyFrom}
        shakeOnError={values.shakeOnError}
        liftOnHover={values.liftOnHover}
        selectable={values.selectable}
        swipeToReply={values.swipeToReply}
        onReply={() => {
          setReplyTo(message)
          inputRef.current?.focus()
        }}
        onReact={(emoji) => react(message.id, emoji)}
        onUnreact={(emoji) => unreact(message.id, emoji)}
        reacted={message.mine}
        doubleClickToReact={values.doubleClickToReact}
        showReactionPicker={values.showReactionPicker}
        magnifyEmojis={values.magnifyEmojis}
      >
        <BubbleContent typing={message.typing} grow={message.stream} layoutId={message.layoutId}>
          {message.replyTo && (
            <span className="line-clamp-1 border-l-2 border-current/40 px-2 text-xs opacity-80">
              {message.replyTo}
            </span>
          )}
          <BubbleText
            text={message.text}
            time={message.time}
            stream={message.stream}
            onStreamEnd={() => {
              const show = pendingSuggestions.current.get(message.id)
              pendingSuggestions.current.delete(message.id)
              if (show) later(show, 300)
            }}
            collapsible={values.collapsible}
          />
        </BubbleContent>
        <AnimatePresence initial={false}>
          {total > 0 && (
            <BubbleReactions
              key="reactions"
              align={mine ? "end" : "start"}
              popOnChange={values.popOnChange}
              rollingNumbers={values.rollingNumbers}
              count={total}
            >
              {Object.keys(message.reactions).map((emoji) => (
                <span key={emoji}>{emoji}</span>
              ))}
            </BubbleReactions>
          )}
        </AnimatePresence>
        {showStatus && message.status && (
          <BubbleStatus
            status={message.status}
            onRetry={() => {
              update(message.id, { status: "sending" })
              // Retries always succeed.
              deliver(message.id, false)
            }}
          />
        )}
      </Bubble>
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-center max-md:text-center">
        <h2 className="text-sm font-medium text-(--hx-muted-foreground)">
          Send a message, double-click or hover a bubble to react, swipe one to reply.
        </h2>
        <div className="flex shrink-0 items-center gap-4">
          <Label className="text-sm font-normal text-(--hx-muted-foreground)">
            <Checkbox checked={autoReply} onCheckedChange={setAutoReply} />
            Auto reply
          </Label>
          <Button variant="outline" size="sm" onClick={simulateIncoming}>
            <MessageSquarePlusIcon />
            Receive messages
          </Button>
        </div>
      </div>
      <div
        className="relative flex h-150 flex-col overflow-hidden rounded-md border max-md:h-130"
        // The conversation only takes the wheel once clicked, so scrolling past it moves the page
        onPointerDown={() => setEngaged(true)}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => {
          setHovering(false)
          setEngaged(false)
        }}
      >
        <AnimatePresence>
          {hovering && !engaged && (
            <motion.div
              key="scroll-hint"
              role="status"
              className="pointer-events-none absolute top-3 left-1/2 z-20 -translate-x-1/2 rounded-md bg-(--hx-foreground) px-2.5 py-1 text-xs font-medium whitespace-nowrap text-(--hx-background) shadow-md"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              Click inside to scroll the chat
            </motion.div>
          )}
        </AnimatePresence>
        <BubbleThread className={cn("min-h-0 flex-1 px-6 py-6 max-md:px-4", !engaged && "overflow-y-hidden overscroll-auto")}>
          {groupMessages(messages).map((group) => (
            <BubbleGroup key={group.id} joined={values.joined}>
              {group.messages.map(renderMessage)}
            </BubbleGroup>
          ))}
          <AnimatePresence mode="popLayout">
            {values.showSuggestions && suggestions && (
              <BubbleSuggestions key={suggestions.id}>
                {suggestions.texts.map((text, i) => {
                  const layoutId = `${suggestions.id}-${i}`
                  return (
                    <BubbleSuggestion
                      key={text}
                      layoutId={layoutId}
                      onClick={() => send(text, { layoutId })}
                    >
                      {text}
                    </BubbleSuggestion>
                  )
                })}
              </BubbleSuggestions>
            )}
          </AnimatePresence>
        </BubbleThread>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            const text = draft.trim()
            if (!text) return
            send(text)
            setDraft("")
          }}
          className="flex flex-col gap-2 border-t p-3"
        >
          {replyTo && (
            <div className="flex items-center justify-between gap-2 rounded-md bg-(--hx-muted) px-3 py-1.5 text-xs">
              <span className="line-clamp-1 text-(--hx-muted-foreground)">
                Replying to: <span className="text-(--hx-foreground)">{replyTo.text}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Cancel reply"
                onClick={() => setReplyTo(null)}
              >
                <XIcon />
              </Button>
            </div>
          )}
         
          <div className="flex items-end gap-2 max-md:flex-wrap">
            <textarea
              ref={inputRef}
              value={draft}
              rows={1}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }}
              placeholder="Message"
              aria-label="Message"
              className="max-h-24 min-h-9 w-full max-md:flex-1 min-w-0 resize-none rounded-md border border-(--hx-input) bg-transparent px-2.5 py-1.5 text-base leading-snug transition-colors outline-none field-sizing-content placeholder:text-(--hx-muted-foreground) focus-visible:border-(--hx-primary) md:text-sm in-data-[theme=dark]:bg-(--hx-input)/30"
            />
            <Button type="submit" size="icon" aria-label="Send" className="size-9" disabled={!draft.trim()}>
              <ArrowUpIcon />
            </Button>
          </div>
        </form>
      </div>

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

export interface AnimatedChatBubbleProps extends Partial<ControlValues> {
  theme?: AnimatedChatBubbleTheme;
  mode?: AnimatedChatBubbleMode;
  className?: string;
}

export default function AnimatedChatBubble({ theme = "valorant", mode = "dark", className, ...props }: AnimatedChatBubbleProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) motion-reduce:**:transition-none in-data-pc-rm:**:transition-none in-data-pc-rm:**:animate-none [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        {/* Covers parts outside the thread too (suggestions, input, standalone bubbles) */}
        <ReducedMotionConfig>
          <ChatDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  BubbleThread,
  BubbleGroup,
  Bubble,
  BubbleContent,
  BubbleText,
  BubbleReactions,
  BubbleStatus,
  BubbleSuggestions,
  BubbleSuggestion,
  type BubbleStatusValue,
};
