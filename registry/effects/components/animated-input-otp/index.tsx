// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import { AnimatePresence, MotionConfig, animate, motion, type TargetAndTransition } from "motion/react";
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

export type AnimatedInputOtpTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedInputOtpMode = "light" | "dark";

const THEMES: Record<`${AnimatedInputOtpTheme}:${AnimatedInputOtpMode}`, Record<string, string>> = {
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
    "success": "oklch(0.596 0.145 163.225)"
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
    "success": "oklch(0.696 0.17 162.48)"
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
    "success": "oklch(0.596 0.145 163.225)"
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
    "success": "oklch(0.696 0.17 162.48)"
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
    "success": "oklch(0.596 0.145 163.225)"
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
    "success": "oklch(0.696 0.17 162.48)"
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
    "success": "oklch(0.596 0.145 163.225)"
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
    "success": "oklch(0.696 0.17 162.48)"
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
    "success": "oklch(0.596 0.145 163.225)"
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
    "success": "oklch(0.696 0.17 162.48)"
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
    "success": "oklch(0.596 0.145 163.225)"
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
    "success": "oklch(0.696 0.17 162.48)"
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
    "success": "oklch(0.596 0.145 163.225)"
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
    "success": "oklch(0.696 0.17 162.48)"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedInputOtpTheme = "default", mode: AnimatedInputOtpMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  // Any theme but Default tints key parts with its primary colour
  return { "data-theme": mode, "data-accent": theme === "default" ? undefined : "", style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

// Keyframes and classes the component needs; no global CSS required
const COMPONENT_CSS = "@keyframes hx-caret-blink{0%,70%,100%{opacity:1}20%,50%{opacity:0}}";

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

// ---- input-otp.tsx ----

type InputOTPRounded = "none" | "sm" | "md" | "lg" | "xl" | "full"
/** Tailwind size step, e.g. "10". */
type InputOTPSize = "8" | "9" | "10" | "11" | "12" | "14" | "16" | "18" | "20" | "24"
type InputOTPCharAnimation = "pop" | "roll" | "fade" | "none"
type InputOTPAllow = "numbers" | "letters" | "symbols" | "mixed"

type InputOTPMotion = {
  /** One ring glides between boxes. */
  glideRing: boolean
  charAnimation: InputOTPCharAnimation
  /** Paste fill gap, in seconds. */
  pasteStagger: number
  /** Shake when turning invalid. */
  shakeOnError: boolean
  /** Green wave and tick on success. */
  successWave: boolean
  boxSize: InputOTPSize
  rounded: InputOTPRounded
  /** Boxes share borders as a strip. */
  joined: boolean
}

/** Corners of each separate box. */
const BOX_ROUNDED: Record<InputOTPRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
}

/** Outer corners of a joined strip: left end, right end. */
const ROUNDED_START: Record<InputOTPRounded, string> = {
  none: "rounded-l-none",
  sm: "rounded-l-sm",
  md: "rounded-l-md",
  lg: "rounded-l-lg",
  xl: "rounded-l-xl",
  full: "rounded-l-full",
}

const ROUNDED_END: Record<InputOTPRounded, string> = {
  none: "rounded-r-none",
  sm: "rounded-r-sm",
  md: "rounded-r-md",
  lg: "rounded-r-lg",
  xl: "rounded-r-xl",
  full: "rounded-r-full",
}

const SIZE: Record<InputOTPSize, string> = {
  "8": "size-8 text-sm",
  "9": "size-9 text-sm",
  // Phones: step down to size-9.
  "10": "size-10 text-base max-[360px]:size-9",
  "11": "size-11 text-base max-sm:size-10 max-[360px]:size-9",
  "12": "size-12 text-lg max-sm:size-10 max-sm:text-base max-[360px]:size-9",
  "14": "size-14 text-xl max-md:size-12 max-sm:size-10 max-sm:text-base max-[360px]:size-9",
  "16": "size-16 text-2xl max-md:size-12 max-sm:size-10 max-sm:text-base max-[360px]:size-9",
  "18": "size-18 text-3xl max-md:size-14 max-sm:size-10 max-sm:text-base max-[360px]:size-9",
  "20": "size-20 text-3xl max-md:size-14 max-sm:size-10 max-sm:text-base max-[360px]:size-9",
  "24": "size-24 text-4xl max-md:size-16 max-sm:size-10 max-sm:text-base max-[360px]:size-9",
}

/** One character each; spaces are never allowed. */
const ALLOWED: Record<InputOTPAllow, RegExp> = {
  numbers: /^[0-9]$/u,
  letters: /^[A-Za-z]$/u,
  symbols: /^[^A-Za-z0-9\s]$/u,
  mixed: /^\S$/u,
}

const RULE: Record<InputOTPAllow, string> = {
  numbers: "Use numbers only (0–9).",
  letters: "Use letters only (A–Z).",
  symbols: "Use special characters only, like ! @ # $.",
  mixed: "Use letters, numbers or special characters.",
}

/** Why a character was turned away, in words people can act on. */
function rejectMessage(char: string, allowedCharacters: InputOTPAllow, pasted: boolean) {
  if (/\s/u.test(char)) return pasted ? "The pasted code has a space in it. Spaces aren't allowed." : "Spaces aren't allowed."
  const what = pasted ? `The pasted code has "${char}", which isn't allowed here.` : `"${char}" isn't allowed here.`
  return `${what} ${RULE[allowedCharacters]}`
}

/** How long rejected boxes stay red, ms. */
const REJECT_FLASH = 600

/** Success wave delay per box, seconds. */
const WAVE_GAP = 0.06

const CHAR_IN: Record<Exclude<InputOTPCharAnimation, "none">, { from: TargetAndTransition; to: TargetAndTransition }> = {
  pop: { from: { opacity: 0, scale: 0.4 }, to: { opacity: 1, scale: 1 } },
  roll: { from: { opacity: 0, y: "100%" }, to: { opacity: 1, y: "0%" } },
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
}

const InputOTPMotionContext = React.createContext<
  InputOTPMotion & {
    ringId: string
    invalid: boolean
    success: boolean
    /** Where the latest paste starts. */
    pasteFrom: number | null
    /** Reduced motion: characters and the success colour just appear. */
    reduceMotion: boolean
  }
>({
  glideRing: true,
  charAnimation: "pop",
  pasteStagger: 0.05,
  shakeOnError: true,
  successWave: true,
  boxSize: "8",
  rounded: "lg",
  joined: false,
  ringId: "otp-ring",
  invalid: false,
  success: false,
  pasteFrom: null,
  reduceMotion: false,
})

function InputOTP({
  className,
  containerClassName,
  value: valueProp,
  onChange,
  maxLength,
  invalid = false,
  success = false,
  glideRing = true,
  charAnimation = "pop",
  pasteStagger = 0.05,
  shakeOnError = true,
  successWave = true,
  boxSize = "8",
  rounded = "lg",
  joined = false,
  allowedCharacters = "mixed",
  onReject,
  ...props
}: React.ComponentProps<typeof OTPInput> &
  Partial<InputOTPMotion> & {
    containerClassName?: string
    /** Which characters the code accepts. Anything else is blocked and reported. */
    allowedCharacters?: InputOTPAllow
    /** Called with a ready-to-show message when a typed or pasted character is blocked. */
    onReject?: (message: string, char: string) => void
    /** Wrong code: red boxes, shake. */
    invalid?: boolean
    /** Right code: green wave, tick. */
    success?: boolean
  }) {
  const ringId = React.useId()
  // Read here, not through motion's hook, so the demo's reduced-motion switch is honoured too
  const [reduceMotion, setReduceMotion] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const read = () => setReduceMotion(mq.matches)
    read()
    mq.addEventListener?.("change", read)
    return () => mq.removeEventListener?.("change", read)
  }, [])
  const box = React.useRef<HTMLDivElement>(null)
  const [uncontrolled, setUncontrolled] = React.useState("")
  const value = valueProp ?? uncontrolled
  // Multi-character change means a paste.
  const [pasteFrom, setPasteFrom] = React.useState<number | null>(null)
  const [seen, setSeen] = React.useState(value)
  if (seen !== value) {
    setSeen(value)
    setPasteFrom(value.length - seen.length > 1 ? seen.length : null)
  }

  const shake = React.useCallback(() => {
    if (!shakeOnError || reduceMotion || !box.current) return
    animate(box.current, { x: [0, -8, 8, -5, 5, -2, 0] }, { duration: 0.45, ease: "easeOut" })
  }, [shakeOnError, reduceMotion])

  // Shake once on turning invalid.
  const wasInvalid = React.useRef(invalid)
  React.useEffect(() => {
    const was = wasInvalid.current
    wasInvalid.current = invalid
    if (invalid && !was) shake()
  }, [invalid, shake])

  // A blocked character turns the boxes red briefly and shakes them, every time.
  const [rejecting, setRejecting] = React.useState(false)
  const flashTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(flashTimer.current), [])
  const reject = (char: string, pasted: boolean) => {
    onReject?.(rejectMessage(char, allowedCharacters, pasted), char)
    shake()
    setRejecting(true)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setRejecting(false), REJECT_FLASH)
  }

  const context = React.useMemo(
    () => ({
      glideRing,
      charAnimation,
      pasteStagger,
      shakeOnError,
      successWave,
      boxSize,
      rounded,
      joined,
      ringId,
      invalid: invalid || rejecting,
      success,
      pasteFrom,
      reduceMotion,
    }),
    [
      glideRing,
      charAnimation,
      pasteStagger,
      shakeOnError,
      successWave,
      boxSize,
      rounded,
      joined,
      ringId,
      invalid,
      rejecting,
      success,
      pasteFrom,
      reduceMotion,
    ]
  )

  return (
    <InputOTPMotionContext.Provider value={context}>
      <MotionConfig reducedMotion="never">
        <div ref={box} className="relative w-fit">
          <OTPInput
            data-slot="input-otp"
            value={value}
            maxLength={maxLength}
            // Phones show the number pad only when numbers are all that's allowed
            inputMode={allowedCharacters === "numbers" ? "numeric" : "text"}
            onChange={(next: string) => {
              // Keep the old value and say why, instead of silently dropping the key
              const bad = [...next].find((c) => !ALLOWED[allowedCharacters].test(c))
              if (bad !== undefined) {
                reject(bad, next.length - value.length > 1)
                return
              }
              setUncontrolled(next)
              onChange?.(next)
            }}
            containerClassName={cn(
              "flex items-center has-disabled:opacity-50",
              !joined && "gap-2 max-md:gap-1.5",
              containerClassName
            )}
            spellCheck={false}
            className={cn("disabled:cursor-not-allowed", className)}
            {...props}
          />
          <AnimatePresence>
            {successWave && success && (
              <motion.svg
                key="tick"
                aria-label="Code accepted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                // Outside the row, so no shift.
                className="absolute top-1/2 left-[calc(100%+0.75rem)] size-5 -translate-y-1/2 text-(--hx-success) max-md:top-0 max-md:left-full max-md:size-5 max-md:-translate-x-3/4 max-md:rounded-full max-md:bg-(--hx-background) max-md:p-0.5 max-md:ring-1 max-md:ring-(--hx-success)"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", visualDuration: 0.3, bounce: 0.4, delay: maxLength * WAVE_GAP }
                }
              >
                <motion.path
                  d="M5 12.5l4.5 4.5L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: "easeOut", delay: maxLength * WAVE_GAP + 0.05 }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </InputOTPMotionContext.Provider>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  const { joined } = React.useContext(InputOTPMotionContext)
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", !joined && "gap-2 max-md:gap-1.5", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const options = React.useContext(InputOTPMotionContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}
  // Once every box is filled the last one stays "active"; the ring has nowhere left to go, so it leaves
  const complete = !!inputOTPContext?.slots.length && inputOTPContext.slots.every((slot) => slot.char)
  const total = inputOTPContext?.slots.length ?? 0
  const waved = options.successWave && options.success
  const pasteDelay =
    options.pasteFrom !== null && index >= options.pasteFrom
      ? (index - options.pasteFrom) * options.pasteStagger
      : 0

  // Reduced motion: the character appears at once, with no pop, roll, fade or paste delay
  const animation = options.reduceMotion || options.charAnimation === "none" ? null : options.charAnimation

  return (
    <motion.div
      data-slot="input-otp-slot"
      data-active={isActive}
      aria-invalid={options.invalid || undefined}
      animate={waved && !options.reduceMotion ? { scale: [1, 1.1, 1] } : { scale: 1 }}
      transition={{ duration: 0.3, delay: waved && !options.reduceMotion ? index * WAVE_GAP : 0 }}
      style={{ transitionDelay: waved && !options.reduceMotion ? `${index * WAVE_GAP}s` : "0s" }}
      className={cn(
        "relative flex items-center justify-center border-(--hx-input) transition-[color,background-color,border-color,box-shadow] duration-300 outline-none aria-invalid:border-(--hx-destructive) in-data-[theme=dark]:bg-(--hx-input)/30",
        options.joined ? cn("border-y border-r rounded-none", index === 0 && "border-l") : "border",
        // the active border marks where you type; a finished or verified code has no such box
        !options.glideRing &&
          !complete &&
          !waved &&
          "data-[active=true]:z-10 data-[active=true]:border-(--hx-foreground) in-data-accent:data-[active=true]:border-(--hx-primary) data-[active=true]:aria-invalid:border-(--hx-destructive)",
        waved &&
          "border-(--hx-success) bg-(--hx-success)/10 text-(--hx-success)",
        SIZE[options.boxSize],
        options.joined
          ? cn(
              index === 0 && ROUNDED_START[options.rounded],
              index === total - 1 && ROUNDED_END[options.rounded]
            )
          : BOX_ROUNDED[options.rounded],
        className
      )}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {options.glideRing && isActive && !complete && (
        <motion.div
          layoutId={options.ringId}
          aria-hidden
          className={cn(
            // Crisp border, no halo.
            "pointer-events-none absolute -inset-px z-10 rounded-[inherit] border border-(--hx-foreground) in-data-accent:border-(--hx-primary)",
            options.invalid && "border-(--hx-destructive)"
          )}
          transition={{ type: "spring", visualDuration: 0.25 * 0.6, bounce: 0.2 }}
        />
      )}
      <span className={cn("relative grid place-items-center", animation === "roll" && "overflow-hidden")}>
        {animation ? (
          // Old digit fades before new appears.
          <AnimatePresence initial={false} mode="wait">
            {char && (
              <motion.span
                key={char}
                className="col-start-1 row-start-1 block"
                initial={CHAR_IN[animation].from}
                animate={CHAR_IN[animation].to}
                exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
                transition={
                  animation === "pop"
                    ? { type: "spring", visualDuration: 0.25, bounce: 0.45, delay: pasteDelay }
                    : { duration: 0.2, ease: "easeOut", delay: pasteDelay }
                }
              >
                {char}
              </motion.span>
            )}
          </AnimatePresence>
        ) : (
          char
        )}
      </span>
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[45%] w-px animate-[hx-caret-blink_1.25s_ease-out_infinite] motion-reduce:animate-none bg-(--hx-foreground) in-data-accent:bg-(--hx-primary) duration-1000" />
        </div>
      )}
    </motion.div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  const { joined } = React.useContext(InputOTPMotionContext)
  // A joined strip runs unbroken, so the dash goes
  if (joined) return null
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  )
}

// ---- demo: input-otp-demo.tsx ----

/** The right code for each kind of input. */
const CODES: Record<InputOTPAllow, string> = {
  numbers: "427193",
  letters: "KQWMZT",
  symbols: "!@#$%&",
  mixed: "A7#k2$",
}

/** Hover leaves the button's background alone; an underline draws in under its text instead. */
const LINE_BUTTON = "group/line"
/** Draws in from the left on hover and leaves to the right, like the drawer's Cancel. */
const LINE_TEXT =
  "relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out group-hover/line:after:origin-left group-hover/line:after:scale-x-100 group-focus-visible/line:after:origin-left group-focus-visible/line:after:scale-x-100 motion-reduce:after:transition-none"

const controls = {
  allowedCharacters: {
    group: "Input",
    type: "select",
    label: "Allowed characters",
    value: "mixed",
    options: [
      { label: "Mixed", value: "mixed" },
      { label: "Numbers", value: "numbers" },
      { label: "Letters", value: "letters" },
      { label: "Special characters", value: "symbols" },
    ],
  },

  glideRing: { group: "Typing", type: "checkbox", label: "Glide ring", value: false },
  charAnimation: {
    group: "Typing",
    type: "select",
    label: "Character in",
    value: "pop",
    options: [
      { label: "Pop", value: "pop" },
      { label: "Roll", value: "roll" },
      { label: "Fade", value: "fade" },
      { label: "None", value: "none" },
    ],
  },
  pasteStagger: {
    disabled: (v: Record<string, unknown>) => v.charAnimation === "none",
    group: "Typing",
    type: "slider",
    label: "Paste stagger",
    value: 0.05,
    min: 0,
    max: 0.15,
    step: 0.01,
    unit: "s",
  },

  shakeOnError: { group: "Result", type: "checkbox", label: "Shake on error", value: true },
  successWave: { group: "Result", type: "checkbox", label: "Green wave when right", value: true },

  boxSize: {
    group: "Style",
    type: "select",
    label: "Box size",
    value: "16",
    options: [
      { label: "8", value: "8" },
      { label: "9", value: "9" },
      { label: "10", value: "10" },
      { label: "11", value: "11" },
      { label: "12", value: "12" },
      { label: "14", value: "14" },
      { label: "16", value: "16" },
      { label: "18", value: "18" },
      { label: "20", value: "20" },
      { label: "24", value: "24" },
    ],
  },
  joined: { group: "Style", type: "checkbox", label: "Joined boxes", value: false },
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
      { label: "Full", value: "full" },
    ],
  },
}

function InputOTPDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel
  const allowedCharacters = values.allowedCharacters as InputOTPAllow
  const CODE = CODES[allowedCharacters]
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  // A new kind of input starts over
  const [lastAllow, setLastAllow] = React.useState(allowedCharacters)
  if (lastAllow !== allowedCharacters) {
    setLastAllow(allowedCharacters)
    setCode("")
    setError(null)
  }

  const change = (next: string) => {
    setCode(next)
    setError(null)
  }

  const complete = code.length === CODE.length
  const success = complete && code === CODE
  const invalid = complete && code !== CODE

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-72 max-sm:min-h-56 flex-col items-center justify-center gap-4 px-4">
        <InputOTP
          maxLength={CODE.length}
          value={code}
          onChange={change}
          allowedCharacters={allowedCharacters}
          onReject={setError}
          invalid={invalid}
          success={success}
          aria-label="Verification code"
          glideRing={values.glideRing}
          charAnimation={values.charAnimation as InputOTPCharAnimation}
          pasteStagger={values.pasteStagger}
          shakeOnError={values.shakeOnError}
          successWave={values.successWave}
          boxSize={values.boxSize as InputOTPSize}
          rounded={values.rounded as InputOTPRounded}
          joined={values.joined}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <p
          className={cn(
            "text-center text-sm text-(--hx-muted-foreground)",
            (error || invalid) && "text-(--hx-destructive)"
          )}
          aria-live="assertive"
        >
          {error
            ? error
            : success
              ? "Verified. Your delivery is confirmed."
              : invalid
                ? "That code isn't right. Check the email and try again."
                : "Enter the code we emailed you."}
        </p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(LINE_BUTTON, "hover:bg-transparent in-data-[theme=dark]:hover:bg-transparent")}
            onClick={() => change(CODE)}
          >
            <span className={LINE_TEXT}>Paste the right code</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(LINE_BUTTON, "hover:bg-transparent in-data-[theme=dark]:hover:bg-transparent")}
            onClick={() => change("")}
          >
            <span className={LINE_TEXT}>Clear</span>
          </Button>
        </div>
      </div>
      <p className="text-center text-sm text-(--hx-muted-foreground) w-[70%] max-sm:w-full mx-auto">
        Tip: the right code is {CODE}. Any other six characters shows the error, and a character
        that isn&apos;t allowed is blocked with a message.
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

export interface AnimatedInputOtpProps extends Partial<ControlValues> {
  theme?: AnimatedInputOtpTheme;
  mode?: AnimatedInputOtpMode;
  className?: string;
}

export default function AnimatedInputOtp({ theme = "ghibli", mode = "dark", className, ...props }: AnimatedInputOtpProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <style>{COMPONENT_CSS}</style>
        <ReducedMotionConfig>
          <InputOTPDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  type InputOTPAllow,
  type InputOTPCharAnimation,
  type InputOTPRounded,
  type InputOTPSize,
};
