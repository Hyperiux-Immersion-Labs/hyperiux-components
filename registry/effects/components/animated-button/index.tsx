// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { MotionConfig, type Variants, LazyMotion, domMin, m, useAnimation, AnimatePresence, motion, useMotionValue, useAnimationFrame } from "motion/react";

/** Share of the remaining distance the magnetic button covers each frame. Lower is lazier. */
const MAGNET_LERP = 0.12
import * as React from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef, type HTMLAttributes } from "react";
import { ArrowRightIcon, LoaderCircleIcon } from "lucide-react";
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

export type AnimatedButtonSetTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedButtonSetMode = "light" | "dark";

const THEMES: Record<`${AnimatedButtonSetTheme}:${AnimatedButtonSetMode}`, Record<string, string>> = {
  "default:light": {
    "background": "oklch(1 0 0)",
    "border": "oklch(0.922 0 0)",
    "destructive": "oklch(0.577 0.245 27.325)",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "oklch(0.145 0 0)",
    "info": "oklch(0.588 0.158 241.966)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "oklch(0.92 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    "primary": "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    "ring": "oklch(0.708 0 0)",
    "success": "oklch(0.596 0.145 163.225)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "default:dark": {
    "background": "oklch(0.145 0 0)",
    "border": "oklch(1 0 0 / 10%)",
    "destructive": "oklch(0.704 0.191 22.216)",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "oklch(0.985 0 0)",
    "info": "oklch(0.685 0.169 237.323)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    "primary": "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    "ring": "oklch(0.556 0 0)",
    "success": "oklch(0.696 0.17 162.48)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "caffeine:light": {
    "background": "#f9f9f9",
    "border": "#d8d8d8",
    "destructive": "#e54d2e",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#202020",
    "info": "oklch(0.588 0.158 241.966)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#efefef",
    "muted-foreground": "#646464",
    "primary": "#644a40",
    "primary-foreground": "#ffffff",
    "ring": "#644a40",
    "success": "oklch(0.596 0.145 163.225)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "caffeine:dark": {
    "background": "#111111",
    "border": "#201e18",
    "destructive": "#e54d2e",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#eeeeee",
    "info": "oklch(0.685 0.169 237.323)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#222222",
    "muted-foreground": "#b4b4b4",
    "primary": "#ffe0c2",
    "primary-foreground": "#081a1b",
    "ring": "#ffe0c2",
    "success": "oklch(0.696 0.17 162.48)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "claude:light": {
    "background": "#faf9f5",
    "border": "#dad9d4",
    "destructive": "#c0392b",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#3d3929",
    "info": "oklch(0.588 0.158 241.966)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#ede9de",
    "muted-foreground": "#83827d",
    "primary": "#c96442",
    "primary-foreground": "#ffffff",
    "ring": "#c96442",
    "success": "oklch(0.596 0.145 163.225)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "claude:dark": {
    "background": "#262624",
    "border": "#3e3e38",
    "destructive": "#ef4444",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#c3c0b6",
    "info": "oklch(0.685 0.169 237.323)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#1b1b19",
    "muted-foreground": "#b7b5a9",
    "primary": "#d97757",
    "primary-foreground": "#ffffff",
    "ring": "#d97757",
    "success": "oklch(0.696 0.17 162.48)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "ghibli:light": {
    "background": "#f3ecd9",
    "border": "#d5cba8",
    "destructive": "#c0533a",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#4a4436",
    "info": "oklch(0.588 0.158 241.966)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#e6dec4",
    "muted-foreground": "#7a705a",
    "primary": "#6f9a5b",
    "primary-foreground": "#ffffff",
    "ring": "#6f9a5b",
    "success": "oklch(0.596 0.145 163.225)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "ghibli:dark": {
    "background": "#1f2a26",
    "border": "#3b4c45",
    "destructive": "#e0745a",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#e6e0cc",
    "info": "oklch(0.685 0.169 237.323)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#2c3a34",
    "muted-foreground": "#a8b39f",
    "primary": "#8fbf7a",
    "primary-foreground": "#15201a",
    "ring": "#8fbf7a",
    "success": "oklch(0.696 0.17 162.48)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "spotify:light": {
    "background": "#ffffff",
    "border": "#e0e0e0",
    "destructive": "#e22134",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#191414",
    "info": "oklch(0.588 0.158 241.966)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#ececec",
    "muted-foreground": "#6a6a6a",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1db954",
    "success": "oklch(0.596 0.145 163.225)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "spotify:dark": {
    "background": "#121212",
    "border": "#2a2a2a",
    "destructive": "#f3727f",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#ffffff",
    "info": "oklch(0.685 0.169 237.323)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#1f1f1f",
    "muted-foreground": "#b3b3b3",
    "primary": "#1db954",
    "primary-foreground": "#000000",
    "ring": "#1ed760",
    "success": "oklch(0.696 0.17 162.48)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "valorant:light": {
    "background": "#ece8e1",
    "border": "#cfc9bc",
    "destructive": "#bd3944",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#0f1923",
    "info": "oklch(0.588 0.158 241.966)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#e2ddd2",
    "muted-foreground": "#5c6670",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "success": "oklch(0.596 0.145 163.225)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "valorant:dark": {
    "background": "#0f1923",
    "border": "#2b3a48",
    "destructive": "#ff6b76",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#ece8e1",
    "info": "oklch(0.685 0.169 237.323)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#1a2733",
    "muted-foreground": "#8b978f",
    "primary": "#ff4655",
    "primary-foreground": "#ffffff",
    "ring": "#ff4655",
    "success": "oklch(0.696 0.17 162.48)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "vscode:light": {
    "background": "#ffffff",
    "border": "#e5e5e5",
    "destructive": "#e51400",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#3b3b3b",
    "info": "oklch(0.588 0.158 241.966)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#f3f3f3",
    "muted-foreground": "#717171",
    "primary": "#007acc",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "success": "oklch(0.596 0.145 163.225)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  },
  "vscode:dark": {
    "background": "#1f1f1f",
    "border": "#3c3c3c",
    "destructive": "#f14c4c",
    "destructive-foreground": "oklch(0.985 0 0)",
    "foreground": "#cccccc",
    "info": "oklch(0.685 0.169 237.323)",
    "info-foreground": "oklch(0.985 0 0)",
    "muted": "#2a2d2e",
    "muted-foreground": "#9d9d9d",
    "primary": "#0e639c",
    "primary-foreground": "#ffffff",
    "ring": "#007fd4",
    "success": "oklch(0.696 0.17 162.48)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.769 0.188 70.08)",
    "warning-foreground": "oklch(0.279 0.077 45.635)"
  }
};

// Popups render in a portal, so they need these too
function themeProps(theme: AnimatedButtonSetTheme = "default", mode: AnimatedButtonSetMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  return { "data-theme": mode, style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

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

// ---- animated-button.tsx ----

/** dot-fill: a dot grows from the pointer to fill. char-stagger: letters roll one by one. scramble: letters shuffle into place. link: a line draws under the text. border-draw: the border draws around the button. */
type AnimatedButtonVariant = "dot-fill" | "char-stagger" | "scramble" | "link" | "border-draw"
/** filled: solid background. outline: border only. */
type AnimatedButtonSurface = "filled" | "outline"
type AnimatedButtonTone =
  | "primary"
  | "muted"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "gradient"
type AnimatedButtonIcon = "none" | "arrow" | "search" | "settings"
type AnimatedButtonIconPosition = "start" | "end"
type AnimatedButtonStatus = "idle" | "loading" | "success"
type AnimatedButtonRounded = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"

type AnimatedButtonMotion = {
  variant: AnimatedButtonVariant
  surface: AnimatedButtonSurface
  tone: AnimatedButtonTone
  icon: AnimatedButtonIcon
  iconPosition: AnimatedButtonIconPosition
  /** A bright band sweeps across the label, over and over. */
  shimmerText: boolean
  /** The label rolls up to a copy of itself on hover. */
  rollingText: boolean
  /** The button leans toward the pointer. */
  magnetic: boolean
  /** On click the button scales down, then springs back. */
  pressFeedback: boolean
  /** Shows a spinner, then a check, rolling in beside the label. */
  status: AnimatedButtonStatus
  /** Label shown while loading. With this or successText, the label rolls between states. */
  loadingText: string
  /** Label shown once done. */
  successText: string
  rounded: AnimatedButtonRounded
  /** Seconds. */
  duration: number
  /** Seconds between letters, for char-stagger. */
  stagger: number
}

const ROUNDED: Record<AnimatedButtonRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
}

// Matches the theme radius scale; full is capped at half the height
const RADIUS: Record<AnimatedButtonRounded, number> = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
  "2xl": 18,
  full: 9999,
}

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789"
const ease = "ease-[cubic-bezier(0.625,0.05,0,1)]"

// Seconds for one sweep of the shimmer
const SHIMMER_SECONDS = 1.6

// Springy settle for the press squeeze
const PRESS_TRANSITION = "transition-[scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"

const GRADIENT = "bg-linear-to-r from-(--hx-info) via-(--hx-success) to-(--hx-warning)"

// Colours for each tone, filled or plain, and the dot that fills over it
const TONES: Record<
  AnimatedButtonTone,
  { border: string; filled: string; filledFlip: string; dot: string; plain: string; plainFlip: string; plainDot: string }
> = {
  primary: {
    border: "border-(--hx-primary)",
    filled: "border-(--hx-primary) bg-(--hx-primary) text-(--hx-primary-foreground)",
    filledFlip: "data-[active=true]:text-(--hx-foreground)",
    dot: "bg-(--hx-background)",
    plain: "text-(--hx-foreground)",
    plainFlip: "data-[active=true]:text-(--hx-primary-foreground)",
    plainDot: "bg-(--hx-primary)",
  },
  muted: {
    border: "border-(--hx-border)",
    filled: "border-(--hx-muted) bg-(--hx-muted) text-(--hx-foreground)",
    filledFlip: "data-[active=true]:text-(--hx-foreground)",
    dot: "bg-(--hx-background)",
    plain: "text-(--hx-muted-foreground)",
    plainFlip: "data-[active=true]:text-(--hx-foreground)",
    plainDot: "bg-(--hx-muted)",
  },
  destructive: {
    border: "border-(--hx-destructive)",
    filled: "border-(--hx-destructive) bg-(--hx-destructive) text-(--hx-destructive-foreground)",
    filledFlip: "data-[active=true]:text-(--hx-destructive)",
    dot: "bg-(--hx-background)",
    plain: "text-(--hx-destructive)",
    plainFlip: "data-[active=true]:text-(--hx-destructive-foreground)",
    plainDot: "bg-(--hx-destructive)",
  },
  success: {
    border: "border-(--hx-success)",
    filled: "border-(--hx-success) bg-(--hx-success) text-(--hx-success-foreground)",
    filledFlip: "data-[active=true]:text-(--hx-success)",
    dot: "bg-(--hx-background)",
    plain: "text-(--hx-success)",
    plainFlip: "data-[active=true]:text-(--hx-success-foreground)",
    plainDot: "bg-(--hx-success)",
  },
  warning: {
    border: "border-(--hx-warning)",
    filled: "border-(--hx-warning) bg-(--hx-warning) text-(--hx-warning-foreground)",
    filledFlip: "data-[active=true]:text-(--hx-warning)",
    dot: "bg-(--hx-background)",
    plain: "text-(--hx-warning)",
    plainFlip: "data-[active=true]:text-(--hx-warning-foreground)",
    plainDot: "bg-(--hx-warning)",
  },
  info: {
    border: "border-(--hx-info)",
    filled: "border-(--hx-info) bg-(--hx-info) text-(--hx-info-foreground)",
    filledFlip: "data-[active=true]:text-(--hx-info)",
    dot: "bg-(--hx-background)",
    plain: "text-(--hx-info)",
    plainFlip: "data-[active=true]:text-(--hx-info-foreground)",
    plainDot: "bg-(--hx-info)",
  },
  gradient: {
    border: "border-(--hx-info)",
    filled: `border-transparent text-(--hx-info-foreground) ${GRADIENT}`,
    filledFlip: "data-[active=true]:text-(--hx-info)",
    dot: "bg-(--hx-background)",
    plain: "text-(--hx-info)",
    plainFlip: "data-[active=true]:text-(--hx-info-foreground)",
    plainDot: GRADIENT,
  },
}

// Shows the icon at rest, and plays it while the button is hovered
function ButtonIcon({ icon, hovered }: { icon: AnimatedButtonIcon; hovered: boolean }) {
  const search = React.useRef<SearchIconHandle>(null)
  const settings = React.useRef<SettingsIconHandle>(null)
  const reduceMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    const handle = icon === "search" ? search.current : settings.current
    if (hovered) handle?.startAnimation()
    else handle?.stopAnimation()
  }, [hovered, icon])

  if (icon === "search") return <SearchIcon ref={search} size={20} isAnimated={false} />
  if (icon === "settings") return <SettingsIcon ref={settings} size={20} isAnimated={false} />
  if (icon !== "arrow") return null
  // Reduced motion: a plain arrow that stays put
  if (reduceMotion) return <ArrowRightIcon aria-hidden className="size-5" />

  return (
    <span aria-hidden className="relative flex size-5 overflow-hidden">
      <ArrowRightIcon className="absolute inset-0 size-5 transition-transform duration-(--dur) group-data-[active=true]/animated-button:translate-x-full" />
      <ArrowRightIcon className="absolute inset-0 size-5 -translate-x-full transition-transform duration-(--dur) group-data-[active=true]/animated-button:translate-x-0" />
    </span>
  )
}

// Letters roll up one by one, each a little after the last
function CharStagger({ text, stagger }: { text: string; stagger: number }) {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <span aria-hidden className="flex">
      {[...text].map((char, index) => (
        <span key={index} className="relative flex overflow-hidden">
          {[0, 1].map((row) => (
            <span
              key={row}
              className={cn(
                // Reduced motion: the two rows are the same text, so swapping at once shows no movement
                "inline-block transition-transform duration-(--dur) motion-reduce:transition-none",
                ease,
                row === 1
                  ? "absolute inset-0 translate-y-full group-data-[active=true]/animated-button:translate-y-0"
                  : "group-data-[active=true]/animated-button:-translate-y-full"
              )}
              // Reduced motion: every letter moves at once
              style={{ transitionDelay: reduceMotion ? "0s" : `${index * stagger}s` }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

// Shuffles random glyphs and settles them left to right while active
function ScrambleText({ text, duration, active }: { text: string; duration: number; active: boolean }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const reduceMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    const el = ref.current
    if (!el || !active || reduceMotion) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      const settled = Math.floor(progress * text.length)
      el.textContent = [...text]
        .map((char, index) =>
          char === " " || index < settled ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        )
        .join("")
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      el.textContent = text
    }
  }, [active, text, duration, reduceMotion])

  return (
    // Invisible copy holds the width, so shuffling never shifts the text
    <span aria-hidden className="relative inline-block text-left">
      <span className="invisible">{text}</span>
      <span ref={ref} className="absolute top-0 left-0 whitespace-nowrap">
        {text}
      </span>
    </span>
  )
}

// Beside the label: the icon at rest, then a spinner and a check that roll in
function StatusSlot({
  status,
  icon,
  hovered,
}: {
  status: AnimatedButtonStatus
  icon: AnimatedButtonIcon
  hovered: boolean
}) {
  const reduceMotion = usePrefersReducedMotion()
  const roll = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20, rotate: -180 },
    animate: { opacity: 1, x: 0, rotate: 0 },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, x: 20, rotate: 180 },
    transition: { type: "spring" as const, duration: 0.5, bounce: 0.2 },
  }

  if (status === "idle") return <ButtonIcon icon={icon} hovered={hovered} />

  return (
    <span className="relative flex size-5 shrink-0">
      <AnimatePresence initial>
        {status === "loading" ? (
          <motion.span key="loading" role="status" aria-label="Loading" className="absolute inset-0" {...roll}>
            <LoaderCircleIcon className="size-5 animate-spin motion-reduce:animate-none" />
          </motion.span>
        ) : (
          <motion.span key="success" role="status" aria-label="Done" className="absolute inset-0" {...roll}>
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M5 12.5l4.5 4.5L19 7.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
              />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

// The label rolls between states and sizes to the current text.
function StatusLabel({
  status,
  idle,
  idleText,
  loadingText,
  successText,
}: {
  status: AnimatedButtonStatus
  idle: React.ReactNode
  idleText: string
  loadingText: string
  successText: string
}) {
  const reduceMotion = usePrefersReducedMotion()
  const text = { idle: idleText, loading: loadingText, success: successText }

  return (
    <span className="relative inline-grid overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={status}
          className="col-start-1 row-start-1 justify-self-center whitespace-nowrap"
          initial={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
        >
          {status === "idle" ? idle : text[status]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// The label slides up out of view as a copy rolls in from below
function TextRoll({ children }: { children: React.ReactNode }) {
  const roll = cn("block transition-transform duration-(--dur) motion-reduce:transition-none", ease)
  return (
    <span className="relative block overflow-hidden">
      <span
        className={cn(
          roll,
          "group-data-[active=true]/animated-button:-translate-y-full"
        )}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          roll,
          "absolute inset-x-0 top-0 translate-y-full group-data-[active=true]/animated-button:translate-y-0"
        )}
      >
        {children}
      </span>
    </span>
  )
}

// The label dims while a bright copy of it, clipped to a band, sweeps across on a loop
function TextShimmer({ text }: { text: string }) {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <span className="relative inline-block">
      <motion.span
        initial={false}
        animate={{ opacity: reduceMotion ? 1 : 0.55 }}
        transition={{ duration: 0.25 }}
      >
        {text}
      </motion.span>
      <motion.span
        aria-hidden
        initial={false}
        className="pointer-events-none absolute inset-0 bg-clip-text [-webkit-text-fill-color:transparent]"
        style={{
          backgroundImage: "linear-gradient(105deg, transparent 35%, currentColor 50%, transparent 65%)",
          backgroundSize: "200% 100%",
          backgroundRepeat: "no-repeat",
        }}
        animate={{ backgroundPosition: reduceMotion ? "130% 0" : ["130% 0", "-30% 0"] }}
        transition={{
          duration: SHIMMER_SECONDS,
          // Steady pace, so the band crosses the text for the whole duration
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 0.6,
        }}
      >
        {text}
      </motion.span>
    </span>
  )
}

function AnimatedButton({
  variant = "dot-fill",
  surface = "filled",
  tone = "primary",
  icon = "arrow",
  iconPosition = "end",
  shimmerText = false,
  rollingText = false,
  magnetic = false,
  pressFeedback = false,
  status = "idle",
  loadingText,
  successText,
  rounded = "full",
  duration = 0.8,
  stagger = 0.02,
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onKeyDown,
  onKeyUp,
  onFocus,
  onBlur,
  style,
  ref,
  ...props
}: Omit<React.ComponentProps<"button">, "children" | "color"> &
  Partial<AnimatedButtonMotion> & { children: string }) {
  const [hovered, setHovered] = React.useState(false)
  const [pressed, setPressed] = React.useState(false)
  const [height, setHeight] = React.useState(56)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)

  // The drawn border needs the real height, which changes per screen size
  React.useEffect(() => {
    const el = buttonRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setHeight(entry.borderBoxSize[0].blockSize))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const [dot, setDot] = React.useState({ left: "50%", top: "50%", on: false })
  const reduceMotion = usePrefersReducedMotion()

  const borderDraw = variant === "border-draw"
  // Link is the only bare (no background, no border) look
  const plain = variant === "link"
  const outlined = surface === "outline" && variant !== "link" && !borderDraw
  // Plain, outlined and border-draw share text and dot colours; only filled differs
  const bare = plain || outlined || borderDraw
  const line = variant === "link"
  const timing = { duration: reduceMotion ? 0 : duration, ease: "easeInOut" as const }

  const dotTiming = {
    duration: reduceMotion ? 0 : duration * 0.95,
    ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
  }

  // A started fill always completes before the dot leaves
  const growing = React.useRef(false)
  const shrinking = React.useRef(false)
  const pendingOut = React.useRef<{ left: string; top: string } | null>(null)

  // The dot grows from where the pointer came in, and sweeps out toward where it left
  const fill = (
    event: React.PointerEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>,
    on: boolean
  ) => {
    if (variant !== "dot-fill") return
    const box = event.currentTarget.getBoundingClientRect()
    const pointer = "clientX" in event
    const spot = {
      left: pointer ? `${((event.clientX - box.left) / box.width) * 100}%` : "50%",
      top: pointer ? `${((event.clientY - box.top) / box.height) * 100}%` : "50%",
    }
    if (on) {
      pendingOut.current = null
      // Re-entering mid-shrink keeps the dot where it is
      growing.current = true
      if (shrinking.current) {
        shrinking.current = false
        return setDot((d) => ({ ...d, on: true }))
      }
      return setDot({ ...spot, on: true })
    }
    if (growing.current) {
      pendingOut.current = spot
      return
    }
    shrinking.current = true
    setDot({ ...spot, on: false })
  }

  const settleDot = () => {
    if (dot.on) {
      growing.current = false
      const out = pendingOut.current
      if (out) {
        pendingOut.current = null
        shrinking.current = true
        setDot({ ...out, on: false })
      }
    } else {
      shrinking.current = false
    }
  }

  // Magnetic: the button eases after the pointer (a lerp each frame), then glides home
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const pullX = useMotionValue(0)
  const pullY = useMotionValue(0)
  useAnimationFrame((_, delta) => {
    const dx = x.get() - pullX.get()
    const dy = y.get() - pullY.get()
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return
    // Covers MAGNET_LERP of the gap per 60fps frame, the same at any frame rate
    const k = 1 - Math.pow(1 - MAGNET_LERP, delta / (1000 / 60))
    pullX.set(pullX.get() + dx * k)
    pullY.set(pullY.get() + dy * k)
  })

  const labelNode = (
    <>
      {variant === "char-stagger" ? (
        <>
          <span className="sr-only">{children}</span>
          <CharStagger text={children} stagger={stagger} />
        </>
      ) : variant === "scramble" ? (
        <>
          <span className="sr-only">{children}</span>
          <ScrambleText text={children} duration={duration} active={hovered} />
        </>
      ) : rollingText ? (
        <TextRoll>{shimmerText ? <TextShimmer text={children} /> : <span>{children}</span>}</TextRoll>
      ) : shimmerText ? (
        <TextShimmer text={children} />
      ) : (
        <span>{children}</span>
      )}
    </>
  )

  return (
    <span
      className={cn("inline-flex", magnetic && "-m-4 p-4")}
      onPointerMove={(event) => {
        // Touch screens have no hover to pull towards, and a finger drag would drag the button
        if (!magnetic || reduceMotion || event.pointerType === "touch") return
        const box = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - (box.left + box.width / 2)) * 0.3)
        y.set((event.clientY - (box.top + box.height / 2)) * 0.3)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      <motion.span
        className={cn(
          "inline-flex",
          pressFeedback && PRESS_TRANSITION,
          pressFeedback && pressed && !reduceMotion && "scale-[0.97]"
        )}
        style={{ x: pullX, y: pullY }}
      >
        <button
          ref={(node) => {
            buttonRef.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) ref.current = node
          }}
          data-slot="animated-button"
          // Text flip follows the fill
          data-active={(variant === "dot-fill" ? dot.on : hovered) ? "true" : "false"}
          aria-busy={status === "loading" || undefined}
          onPointerEnter={(event) => {
            onPointerEnter?.(event)
            fill(event, true)
            setHovered(true)
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event)
            fill(event, false)
            setHovered(false)
            setPressed(false)
          }}
          onPointerDown={(event) => {
            onPointerDown?.(event)
            setPressed(true)
          }}
          onPointerUp={(event) => {
            onPointerUp?.(event)
            setPressed(false)
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (event.key === " " || event.key === "Enter") setPressed(true)
          }}
          onKeyUp={(event) => {
            onKeyUp?.(event)
            setPressed(false)
          }}
          onFocus={(event) => {
            onFocus?.(event)
            if (!event.currentTarget.matches(":focus-visible")) return
            fill(event, true)
            setHovered(true)
          }}
          onBlur={(event) => {
            onBlur?.(event)
            fill(event, false)
            setHovered(false)
            setPressed(false)
          }}
          style={
            {
              "--dur": `${duration}s`,
              "--flip": `${duration * 0.4}s`,
              "--flip-delay": `${duration * 0.3}s`,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/animated-button relative isolate inline-flex h-14 w-fit cursor-pointer items-center justify-center overflow-hidden px-8 text-lg font-medium whitespace-nowrap outline-none max-[1025px]:h-12 max-[1025px]:text-base max-md:h-11",
            "focus-visible:ring-3 focus-visible:ring-(--hx-ring)/50 disabled:pointer-events-none disabled:opacity-50",
            status === "loading" && "pointer-events-none",
            plain
              ? cn("bg-transparent px-2", TONES[tone].plain)
              : borderDraw
                ? cn("border border-transparent bg-transparent", TONES[tone].plain)
                : outlined
                  ? cn("border bg-transparent", TONES[tone].plain, TONES[tone].border)
                  : cn("border", TONES[tone].filled),
            !plain && ROUNDED[rounded],
            !plain && "max-[1025px]:px-6 max-md:px-5",
            // Text swaps colour as the dot passes under it
            variant === "dot-fill" &&
              cn(
                // Reduced motion: the dot is there at once, so the text must flip at once too
                "transition-colors duration-(--flip) delay-(--flip-delay) motion-reduce:transition-none motion-reduce:delay-0",
                bare ? TONES[tone].plainFlip : TONES[tone].filledFlip
              ),
            className
          )}
          {...props}
        >
          {variant === "dot-fill" && (
            <motion.span
              aria-hidden
              initial={false}
              style={{ x: "-50%", y: "-50%" }}
              animate={{ scale: dot.on ? 1 : 0, left: dot.left, top: dot.top }}
              onAnimationComplete={settleDot}
              // Snap to the entry point, then grow; slide out with the shrink
              transition={{
                scale: dotTiming,
                left: dot.on ? { duration: 0 } : dotTiming,
                top: dot.on ? { duration: 0 } : dotTiming,
              }}
              className={cn(
                "pointer-events-none absolute -z-10 aspect-square w-[220%] rounded-full",
                bare ? TONES[tone].plainDot : TONES[tone].dot
              )}
            />
          )}

          {borderDraw && (
            <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
              {/* Both borders share one shape, so the drawn line sits exactly on the resting one */}
              {[0, 1].map((layer) => (
                <motion.rect
                  key={layer}
                  x={0.75}
                  y={0.75}
                  rx={Math.max(Math.min(RADIUS[rounded], height / 2) - 0.75, 0)}
                  style={{ width: "calc(100% - 1.5px)", height: "calc(100% - 1.5px)" }}
                  fill="none"
                  strokeWidth={1.5}
                  // Round ends close the seam where the drawn line meets its own start
                  strokeLinecap="round"
                  className={layer === 0 ? "stroke-(--hx-border)" : "stroke-current"}
                  initial={false}
                  animate={layer === 0 ? undefined : { pathLength: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
                  transition={{
                    pathLength: timing,
                    opacity: { duration: reduceMotion ? 0 : 0.15, delay: hovered || reduceMotion ? 0 : duration },
                  }}
                />
              ))}
            </svg>
          )}

          <span
            className={cn(
              "relative z-10 inline-flex w-fit items-center gap-1.5",
              iconPosition === "start" && "flex-row-reverse"
            )}
          >
            {/* Link: the line sits under the label only, not under the icon */}
            <span
              className={cn(
                "relative inline-flex",
                line &&
                  (reduceMotion
                    ? // The whole line appears at once instead of drawing
                      "after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-current after:opacity-0 after:transition-opacity after:duration-150 group-data-[active=true]/animated-button:after:opacity-100"
                    : "after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-(--dur) group-data-[active=true]/animated-button:after:origin-left group-data-[active=true]/animated-button:after:scale-x-100")
              )}
            >
              {loadingText || successText ? (
                <StatusLabel
                  status={status}
                  idle={labelNode}
                  idleText={children}
                  loadingText={loadingText ?? children}
                  successText={successText ?? children}
                />
              ) : (
                labelNode
              )}
            </span>

            <StatusSlot status={status} icon={icon} hovered={hovered} />
          </span>

        </button>
      </motion.span>
    </span>
  )
}

// ---- demo: button-demo.tsx ----

const controls = {
  variant: {
    group: "Effect",
    type: "select",
    label: "Hover effect",
    value: "dot-fill",
    options: [
      { label: "Dot fill", value: "dot-fill" },
      { label: "Char stagger", value: "char-stagger" },
      { label: "Scramble", value: "scramble" },
      { label: "Link (line draw)", value: "link" },
      { label: "Border draw", value: "border-draw" },
    ],
  },
  surface: {
    disabled: (v: Record<string, unknown>) => v.variant === "link",
    group: "Effect",
    type: "select",
    label: "Background",
    value: "filled",
    options: [
      { label: "Filled", value: "filled" },
      { label: "Outline", value: "outline" },
    ],
  },
  tone: {
    group: "Effect",
    type: "select",
    label: "Colour",
    value: "primary",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Muted", value: "muted" },
      { label: "Destructive", value: "destructive" },
      { label: "Success", value: "success" },
      { label: "Warning", value: "warning" },
      { label: "Info", value: "info" },
      { label: "Gradient", value: "gradient" },
    ],
  },
  rollingText: { disabled: (v: Record<string, unknown>) => v.variant === "char-stagger" || v.variant === "scramble", group: "Effect", type: "checkbox", label: "Rolling text", value: true },
  shimmerText: { disabled: (v: Record<string, unknown>) => v.variant === "char-stagger" || v.variant === "scramble", group: "Effect", type: "checkbox", label: "Shimmer text", value: false },
  pressFeedback: { group: "Effect", type: "checkbox", label: "Press feedback", value: true },
  magnetic: { group: "Effect", type: "checkbox", label: "Magnetic", value: false },
  showLoadingState: { group: "State", type: "checkbox", label: "Show loading state", value: true },
  icon: {
    group: "Icon",
    type: "select",
    label: "Icon",
    value: "arrow",
    options: [
      { label: "None", value: "none" },
      { label: "Arrow", value: "arrow" },
      { label: "Search", value: "search" },
      { label: "Settings", value: "settings" },
    ],
  },
  iconPosition: {
    disabled: (v: Record<string, unknown>) => v.icon === "none",
    group: "Icon",
    type: "select",
    label: "Icon position",
    value: "end",
    options: [
      { label: "End", value: "end" },
      { label: "Start", value: "start" },
    ],
  },
  rounded: {
    group: "Style",
    type: "select",
    label: "Roundness",
    value: "full",
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
  duration: {
    group: "Motion",
    type: "slider",
    label: "Duration",
    value: 0.4,
    min: 0.2,
    max: 1.2,
    step: 0.05,
    unit: "s",
  },
  stagger: {
    disabled: (v: Record<string, unknown>) => v.variant !== "char-stagger",
    group: "Motion",
    type: "slider",
    label: "Stagger",
    value: 0.02,
    min: 0,
    max: 0.08,
    step: 0.005,
    unit: "s",
  },
}

const HOVER_TIPS: Record<AnimatedButtonVariant, string> = {
  "dot-fill": "hover in from different sides to see where the dot fill starts.",
  "char-stagger": "hover over it to see the letters roll one after another.",
  scramble: "hover over it to see the letters scramble into place.",
  link: "hover over it to see the line draw under the text.",
  "border-draw": "hover over it to see the border draw itself around the button.",
}

function ButtonDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel
  const [simulated, setSimulated] = React.useState<AnimatedButtonStatus>("idle")
  const timers = React.useRef<number[]>([])
  const status = values.showLoadingState ? simulated : "idle"

  React.useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(window.clearTimeout)
  }, [])

  // Click: loads for a moment, shows the check, then resets
  const simulate = () => {
    if (!values.showLoadingState || simulated !== "idle") return
    setSimulated("loading")
    timers.current.push(
      window.setTimeout(() => setSimulated("success"), 1500),
      window.setTimeout(() => setSimulated("idle"), 3200)
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 30% larger on phones, where the button reads small */}
      <div className="flex min-h-64 items-center justify-center px-8 py-8 max-md:px-4 max-md:*:scale-130">
        <AnimatedButton
          variant={values.variant as AnimatedButtonVariant}
          surface={values.surface as AnimatedButtonSurface}
          tone={values.tone as AnimatedButtonTone}
          shimmerText={values.shimmerText}
          rollingText={values.rollingText}
          magnetic={values.magnetic}
          pressFeedback={values.pressFeedback}
          status={status}
          loadingText={values.showLoadingState ? "Loading" : undefined}
          successText={values.showLoadingState ? "Success" : undefined}
          onClick={simulate}
          iconPosition={values.iconPosition as AnimatedButtonIconPosition}
          icon={values.icon as AnimatedButtonIcon}
          rounded={values.rounded as AnimatedButtonRounded}
          duration={values.duration}
          stagger={values.stagger}
        >
          Hover me
        </AnimatedButton>
      </div>
      {/* The tip follows the chosen effect and whether clicking shows the loading state */}
      <p className="text-center text-sm text-(--hx-muted-foreground) max-lg:hidden">
        Tip: {HOVER_TIPS[values.variant as AnimatedButtonVariant] ?? HOVER_TIPS["dot-fill"]}{" "}
        {values.showLoadingState
          ? "Click it to see the loading and success state."
          : "Turn on Show loading state to see it load when clicked."}
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

export interface AnimatedButtonSetProps extends Partial<ControlValues> {
  theme?: AnimatedButtonSetTheme;
  mode?: AnimatedButtonSetMode;
  className?: string;
}

export default function AnimatedButtonSet({ theme = "spotify", mode = "dark", className, ...props }: AnimatedButtonSetProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) motion-reduce:**:transition-none in-data-pc-rm:**:transition-none in-data-pc-rm:**:animate-none [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <ReducedMotionConfig>
          <ButtonDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  AnimatedButton,
  type AnimatedButtonVariant,
  type AnimatedButtonSurface,
  type AnimatedButtonTone,
  type AnimatedButtonIcon,
  type AnimatedButtonIconPosition,
  type AnimatedButtonStatus,
  type AnimatedButtonRounded,
};
