// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import * as React from "react";
import { animate, AnimatePresence, motion, MotionConfig, Reorder, useMotionValue } from "motion/react";

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


export type CheckboxVariant = "default" | "card";
export type CheckboxAppearance = "filled" | "outline";
export type CheckboxRadius = "none" | "xs" | "sm" | "md" | "lg" | "full";
export type CheckboxMark = "check" | "circle-filled" | "circle-outline";
export type CheckboxCardFill = "muted" | "accent";

export interface CheckboxOption {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  accent?: string;
  disabled?: boolean;
}

// Radius names in px for a 24px box; Motion springs numbers
const BOX_RADIUS: Record<CheckboxRadius, number> = { none: 0, xs: 2, sm: 6, md: 8, lg: 10, full: 12 };

const spring = { type: "spring", visualDuration: 0.35, bounce: 0.3 } as const;
const snappy = { type: "spring", visualDuration: 0.25, bounce: 0 } as const;
const springyEase = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";
const shake = [0, -6, 6, -4, 4, -2, 0];
// Gentler than the shake: a small "no more" nudge when At most is reached
const nudge = [0, 4, -3, 0];
const CASCADE_MS = 60;

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

type CheckboxOptions = {
  fill: boolean;
  elastic: boolean;
  strike: boolean;
  showIcon: boolean;
  appearance: CheckboxAppearance;
  mark: CheckboxMark;
  rounded: CheckboxRadius;
};

const defaultOptions: CheckboxOptions = {
  fill: true,
  elastic: true,
  strike: true,
  showIcon: true,
  appearance: "filled",
  mark: "check",
  rounded: "md",
};

type CheckboxGroupContextValue = {
  variant: CheckboxVariant;
  cardFillColor: CheckboxCardFill;
  selected: string[];
  toggle: (value: string, range: boolean) => boolean;
  invalid: boolean;
  full: boolean;
  reorder: boolean;
  /** The list's box: a dragged option can't leave it */
  dragBox: React.RefObject<HTMLDivElement | null>;
};

const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue | null>(null);
const CheckboxOptionsContext = React.createContext<CheckboxOptions>(defaultOptions);
const CheckboxIndexContext = React.createContext(0);

const toolbarButton = cx(
  "relative font-medium text-(--checkbox-muted-text) transition-[color,opacity] motion-reduce:transition-none outline-none hover:text-(--checkbox-text) focus-visible:text-(--checkbox-text) disabled:pointer-events-none disabled:opacity-40",
  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out motion-reduce:after:transition-none",
  "hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100"
);

const PAGE_COLORS: Record<`${CheckboxTheme}:${CheckboxMode}`, { background: string; foreground: string }> = {
  "default:light": {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)"
  },
  "default:dark": {
    background: "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)"
  },
  "caffeine:light": {
    background: "#f9f9f9",
    foreground: "#202020"
  },
  "caffeine:dark": {
    background: "#111111",
    foreground: "#eeeeee"
  },
  "claude:light": {
    background: "#faf9f5",
    foreground: "#3d3929"
  },
  "claude:dark": {
    background: "#262624",
    foreground: "#c3c0b6"
  },
  "ghibli:light": {
    background: "#f3ecd9",
    foreground: "#4a4436"
  },
  "ghibli:dark": {
    background: "#1f2a26",
    foreground: "#e6e0cc"
  },
  "spotify:light": {
    background: "#ffffff",
    foreground: "#191414"
  },
  "spotify:dark": {
    background: "#121212",
    foreground: "#ffffff"
  },
  "valorant:light": {
    background: "#ece8e1",
    foreground: "#0f1923"
  },
  "valorant:dark": {
    background: "#0f1923",
    foreground: "#ece8e1"
  },
  "vscode:light": {
    background: "#ffffff",
    foreground: "#3b3b3b"
  },
  "vscode:dark": {
    background: "#1f1f1f",
    foreground: "#cccccc"
  }
};

// Lets a page match the palette behind the group
export function getThemeProps(theme: CheckboxTheme = "default", mode: CheckboxMode = "dark") {
  const colors = PAGE_COLORS[`${theme}:${mode}`] ?? PAGE_COLORS["default:light"];
  return {
    "data-theme": mode,
    style: { "--hx-background": colors.background, "--hx-foreground": colors.foreground } as React.CSSProperties,
  };
}

export interface CheckboxColors {
  accentColor?: string;
  onAccentColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  borderColor?: string;
  mutedColor?: string;
  errorColor?: string;
}

export type CheckboxTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type CheckboxMode = "light" | "dark";

const THEMES: Record<`${CheckboxTheme}:${CheckboxMode}`, Required<CheckboxColors>> = {
  "default:light": {
    accentColor: "oklch(0.205 0 0)",
    onAccentColor: "oklch(0.985 0 0)",
    textColor: "oklch(0.145 0 0)",
    mutedTextColor: "oklch(0.556 0 0)",
    borderColor: "oklch(0.922 0 0)",
    mutedColor: "oklch(0.92 0 0)",
    errorColor: "oklch(0.577 0.245 27.325)"
  },
  "default:dark": {
    accentColor: "oklch(0.922 0 0)",
    onAccentColor: "oklch(0.205 0 0)",
    textColor: "oklch(0.985 0 0)",
    mutedTextColor: "oklch(0.708 0 0)",
    borderColor: "oklch(1 0 0 / 15%)",
    mutedColor: "oklch(0.269 0 0)",
    errorColor: "oklch(0.704 0.191 22.216)"
  },
  "caffeine:light": {
    accentColor: "#644a40",
    onAccentColor: "#ffffff",
    textColor: "#202020",
    mutedTextColor: "#646464",
    borderColor: "#d8d8d8",
    mutedColor: "#efefef",
    errorColor: "#e54d2e"
  },
  "caffeine:dark": {
    accentColor: "#ffe0c2",
    onAccentColor: "#081a1b",
    textColor: "#eeeeee",
    mutedTextColor: "#b4b4b4",
    borderColor: "#484848",
    mutedColor: "#222222",
    errorColor: "#e54d2e"
  },
  "claude:light": {
    accentColor: "#c96442",
    onAccentColor: "#ffffff",
    textColor: "#3d3929",
    mutedTextColor: "#83827d",
    borderColor: "#b4b2a7",
    mutedColor: "#ede9de",
    errorColor: "#c0392b"
  },
  "claude:dark": {
    accentColor: "#d97757",
    onAccentColor: "#ffffff",
    textColor: "#c3c0b6",
    mutedTextColor: "#b7b5a9",
    borderColor: "#52514a",
    mutedColor: "#1b1b19",
    errorColor: "#ef4444"
  },
  "ghibli:light": {
    accentColor: "#6f9a5b",
    onAccentColor: "#ffffff",
    textColor: "#4a4436",
    mutedTextColor: "#7a705a",
    borderColor: "#cfc59f",
    mutedColor: "#e6dec4",
    errorColor: "#c0533a"
  },
  "ghibli:dark": {
    accentColor: "#8fbf7a",
    onAccentColor: "#15201a",
    textColor: "#e6e0cc",
    mutedTextColor: "#a8b39f",
    borderColor: "#46584f",
    mutedColor: "#2c3a34",
    errorColor: "#e0745a"
  },
  "spotify:light": {
    accentColor: "#1db954",
    onAccentColor: "#000000",
    textColor: "#191414",
    mutedTextColor: "#6a6a6a",
    borderColor: "#d4d4d4",
    mutedColor: "#ececec",
    errorColor: "#e22134"
  },
  "spotify:dark": {
    accentColor: "#1db954",
    onAccentColor: "#000000",
    textColor: "#ffffff",
    mutedTextColor: "#b3b3b3",
    borderColor: "#3a3a3a",
    mutedColor: "#1f1f1f",
    errorColor: "#f3727f"
  },
  "valorant:light": {
    accentColor: "#ff4655",
    onAccentColor: "#ffffff",
    textColor: "#0f1923",
    mutedTextColor: "#5c6670",
    borderColor: "#c4beb0",
    mutedColor: "#e2ddd2",
    errorColor: "#bd3944"
  },
  "valorant:dark": {
    accentColor: "#ff4655",
    onAccentColor: "#ffffff",
    textColor: "#ece8e1",
    mutedTextColor: "#8b978f",
    borderColor: "#344454",
    mutedColor: "#1a2733",
    errorColor: "#ff6b76"
  },
  "vscode:light": {
    accentColor: "#007acc",
    onAccentColor: "#ffffff",
    textColor: "#3b3b3b",
    mutedTextColor: "#717171",
    borderColor: "#cecece",
    mutedColor: "#f3f3f3",
    errorColor: "#e51400"
  },
  "vscode:dark": {
    accentColor: "#0e639c",
    onAccentColor: "#ffffff",
    textColor: "#cccccc",
    mutedTextColor: "#9d9d9d",
    borderColor: "#3c3c3c",
    mutedColor: "#2a2d2e",
    errorColor: "#f14c4c"
  }
};

const colorVars = (theme: CheckboxTheme, mode: CheckboxMode, colors: CheckboxColors) => {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  return {
    "--checkbox-accent": colors.accentColor || palette.accentColor,
    "--checkbox-on-accent": colors.onAccentColor || palette.onAccentColor,
    "--checkbox-text": colors.textColor || palette.textColor,
    // Any theme but the default puts ticked labels in its accent colour
    "--checkbox-marked-text": colors.textColor || (theme === "default" ? palette.textColor : colors.accentColor || palette.accentColor),
    "--checkbox-muted-text": colors.mutedTextColor || palette.mutedTextColor,
    "--checkbox-border": colors.borderColor || palette.borderColor,
    "--checkbox-muted": colors.mutedColor || palette.mutedColor,
    "--checkbox-error": colors.errorColor || palette.errorColor,
  } as React.CSSProperties;
};

export type CheckboxGroupProps = Partial<CheckboxOptions> &
  CheckboxColors & {
    theme?: CheckboxTheme;
    mode?: CheckboxMode;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    "aria-label"?: string;
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    variant?: CheckboxVariant;
    cardFillColor?: CheckboxCardFill;
    min?: number;
    max?: number;
    showSelectAll?: boolean;
    showDeselectAll?: boolean;
    showCounter?: boolean;
    rangeSelect?: boolean;
    reorder?: boolean;
    onReorder?: (order: string[]) => void;
  };

export function CheckboxGroup({
  value,
  defaultValue,
  onValueChange,
  className,
  style,
  children,
  min = 0,
  max,
  showSelectAll = true,
  showDeselectAll = true,
  showCounter = true,
  rangeSelect = true,
  reorder = false,
  onReorder,
  variant = "default",
  cardFillColor = "muted",
  theme = "default",
  mode = "dark",
  accentColor,
  onAccentColor,
  textColor,
  mutedTextColor,
  borderColor,
  mutedColor,
  errorColor,
  "aria-label": ariaLabel,
  ...optionProps
}: CheckboxGroupProps) {
  const reduceMotion = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const [internal, setInternal] = React.useState(defaultValue ?? []);
  const [invalid, setInvalid] = React.useState(false);
  const [limitHit, setLimitHit] = React.useState(false);
  const controlled = value !== undefined;
  const selected = controlled ? value : internal;

  const valueOf = (child: React.ReactElement) => (child.props as { value?: string }).value;
  const [order, setOrder] = React.useState<string[]>([]);
  const childElements = React.Children.toArray(children).filter(React.isValidElement);
  const childValues = childElements.flatMap((child) => valueOf(child) ?? []);
  const known = order.filter((v) => childValues.includes(v));
  const currentOrder = [...known, ...childValues.filter((v) => !known.includes(v))];
  const rank = (child: React.ReactElement) => {
    const v = valueOf(child);
    return v === undefined ? Infinity : currentOrder.indexOf(v);
  };
  const items = [...childElements].sort((a, b) => rank(a) - rank(b));
  const allValues = items.flatMap((child) => {
    const props = child.props as { value?: string; disabled?: boolean };
    return props.value !== undefined && !props.disabled ? [props.value] : [];
  });
  const capacity = Math.min(max ?? Infinity, allValues.length);

  const latest = React.useRef(selected);
  React.useEffect(() => {
    latest.current = selected;
  });
  const anchor = React.useRef<string | null>(null);
  const timers = React.useRef<number[]>([]);
  const limitTimer = React.useRef<number>(undefined);
  React.useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(limitTimer.current);
    },
    []
  );

  const onChange = React.useEffectEvent((next: string[]) => onValueChange?.(next));

  const flashLimit = () => {
    setLimitHit(true);
    if (!reduceMotion) animate(x, nudge, { duration: 0.3, ease: "easeOut" });
    window.clearTimeout(limitTimer.current);
    limitTimer.current = window.setTimeout(() => setLimitHit(false), 2000);
  };

  const commit = (next: string[]) => {
    const previous = latest.current;
    const ordered = allValues.filter((v) => next.includes(v));
    latest.current = ordered;
    if (!controlled) setInternal(ordered);
    onChange(ordered);
    if (max === undefined || ordered.length < max) setLimitHit(false);
    if (min > 0) {
      if (ordered.length < min) {
        setInvalid(true);
        if (ordered.length < previous.length && !reduceMotion) {
          animate(x, shake, { duration: 0.45, ease: "easeOut" });
        }
      } else {
        setInvalid(false);
      }
    }
  };

  const setOne = (v: string, on: boolean) => {
    const current = latest.current;
    if (current.includes(v) === on) return true;
    if (on && max !== undefined && current.length >= max) {
      flashLimit();
      return false;
    }
    commit(on ? [...current, v] : current.filter((c) => c !== v));
    return true;
  };

  const cascade = (values: string[], on: boolean) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = values.map((v, i) => window.setTimeout(() => setOne(v, on), reduceMotion ? 0 : i * CASCADE_MS));
  };

  const toggle = (v: string, range: boolean) => {
    const on = !latest.current.includes(v);
    const from = anchor.current === null ? -1 : allValues.indexOf(anchor.current);
    const to = allValues.indexOf(v);
    anchor.current = v;
    if (range && rangeSelect && from !== -1 && to !== -1 && from !== to) {
      const span = allValues.slice(Math.min(from, to), Math.max(from, to) + 1);
      const outward = from < to ? span : span.reverse();
      cascade(outward.filter((c) => latest.current.includes(c) !== on), on);
      return true;
    }
    return setOne(v, on);
  };

  const allTicked = capacity > 0 && selected.length >= capacity;
  const clearAll = () => cascade([...latest.current].reverse(), false);
  const tickAll = () => {
    const room = (max ?? Infinity) - latest.current.length;
    cascade(allValues.filter((v) => !latest.current.includes(v)).slice(0, room), true);
  };

  const options: CheckboxOptions = { ...defaultOptions, ...optionProps };
  const dragBox = React.useRef<HTMLDivElement>(null);
  const context: CheckboxGroupContextValue = {
    dragBox,
    variant,
    cardFillColor,
    selected,
    toggle,
    invalid,
    full: max !== undefined && selected.length >= max,
    reorder,
  };

  return (
    <ReducedMotionConfig>
      <CheckboxOptionsContext.Provider value={options}>
        <CheckboxGroupContext.Provider value={context}>
          <div
            data-slot="checkbox-group"
            className="flex w-full flex-col gap-8"
            style={{
              ...colorVars(theme, mode, { accentColor, onAccentColor, textColor, mutedTextColor, borderColor, mutedColor, errorColor }),
              ...style,
            }}
          >
            {(showSelectAll || showDeselectAll || showCounter) && (
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-8 max-md:gap-6">
                  {showSelectAll && (
                    <button type="button" onClick={tickAll} disabled={allTicked} className={toolbarButton}>
                      Select all
                    </button>
                  )}
                  {showDeselectAll && (
                    <button type="button" onClick={clearAll} disabled={selected.length === 0} className={toolbarButton}>
                      Deselect all
                    </button>
                  )}
                </div>
                {showCounter && (
                  <span className="text-(--checkbox-muted-text) tabular-nums" aria-live="polite">
                    <RollingNumber value={selected.length} />
                    {max !== undefined && ` of ${max}`} selected
                  </span>
                )}
              </div>
            )}
            <Reorder.Group
              ref={dragBox}
              as="div"
              axis="y"
              values={currentOrder}
              onReorder={(next: string[]) => {
                setOrder(next);
                onReorder?.(next);
              }}
              role="group"
              aria-label={ariaLabel}
              aria-required={min > 0 || undefined}
              style={{ x }}
              className={cx("grid w-full gap-3", className)}
            >
              {items.map((child, index) => (
                <CheckboxIndexContext.Provider key={child.key ?? index} value={index}>
                  {child}
                </CheckboxIndexContext.Provider>
              ))}
            </Reorder.Group>
            <AnimatePresence mode="popLayout">
              {(invalid || limitHit) && (
                <motion.p
                  key={invalid ? "min" : "max"}
                  role="alert"
                  className={cx("text-sm", invalid ? "text-(--checkbox-error)" : "text-(--checkbox-muted-text)")}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  {invalid
                    ? min === 1
                      ? "Choose at least one."
                      : `Choose at least ${min}.`
                    : `You can choose up to ${max}.`}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </CheckboxGroupContext.Provider>
      </CheckboxOptionsContext.Provider>
    </ReducedMotionConfig>
  );
}

export interface CheckboxItemProps extends CheckboxColors {
  theme?: CheckboxTheme;
    mode?: CheckboxMode;
  className?: string;
  value?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  accent?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function CheckboxItem({
  className,
  value,
  label,
  description,
  disabled = false,
  accent,
  checked: checkedProp,
  defaultChecked = false,
  indeterminate = false,
  onCheckedChange,
  theme = "default",
  mode = "dark",
  ...colors
}: CheckboxItemProps) {
  const group = React.useContext(CheckboxGroupContext);
  const options = React.useContext(CheckboxOptionsContext);
  const index = React.useContext(CheckboxIndexContext);
  const reduceMotion = usePrefersReducedMotion();
  const root = React.useRef<HTMLLabelElement>(null);
  const visual = React.useRef<HTMLSpanElement>(null);
  const dragged = React.useRef(false);
  // While lifted, the option frosts what it passes over
  const [dragging, setDragging] = React.useState(false);
  const shift = React.useRef(false);
  const [standalone, setStandalone] = React.useState(defaultChecked);
  const [entered, setEntered] = React.useState(false);

  const inGroup = group !== null && value !== undefined;
  const card = group?.variant === "card";
  const draggable = Boolean(group?.reorder) && !disabled;
  const checked = inGroup ? group.selected.includes(value) : (checkedProp ?? standalone);
  const mixed = !inGroup && indeterminate && !checked;

  const [wasChecked, setWasChecked] = React.useState(checked);
  const [pulse, setPulse] = React.useState(0);
  if (checked !== wasChecked) {
    setWasChecked(checked);
    if (checked) setPulse((p) => p + 1);
  }

  React.useEffect(() => {
    if (pulse === 0 || !options.elastic || reduceMotion || !visual.current) return;
    animate(
      visual.current,
      { scale: [1, 0.7, 1.25, 0.94, 1] },
      { duration: 0.55, times: [0, 0.2, 0.5, 0.75, 1], ease: "easeOut" }
    );
  }, [pulse, options.elastic, reduceMotion]);

  const toggle = (event: React.MouseEvent) => {
    if (disabled) return;
    const range = event.shiftKey || shift.current;
    shift.current = false;
    if (inGroup) {
      const target = options.showIcon ? visual.current : root.current;
      if (!group.toggle(value, range) && target && !reduceMotion) {
        animate(target, { x: [0, -3, 3, -2, 2, 0] }, { duration: 0.35, ease: "easeOut" });
      }
      return;
    }
    const next = !checked;
    setStandalone(next);
    onCheckedChange?.(next);
  };

  const invalid = group?.invalid && !checked;
  const dimmed = disabled || (group?.full && !checked);
  const hasText = label !== undefined || description !== undefined;
  const solid = card && group?.cardFillColor === "accent";
  const onFill = solid && checked;
  const showControl = options.showIcon;
  const filled = options.appearance === "filled";
  const cornerRadius = BOX_RADIUS[options.rounded];
  const marked = checked || mixed;
  const markOnAccent = filled !== onFill;

  const renderText = (onAccent: boolean) => (
    <span className="flex flex-col gap-1">
      {label !== undefined && (
        <span className="relative inline-grid w-fit leading-none">
          <span aria-hidden className="invisible col-start-1 row-start-1 font-medium">
            {label}
          </span>
          <span
            className={cx(
              "col-start-1 row-start-1 transition-[color,font-weight] duration-200 motion-reduce:transition-none",
              onAccent
                ? "font-medium text-(--checkbox-on-accent)"
                : marked
                  ? "font-medium text-(--checkbox-marked-text)"
                  : "font-normal text-(--checkbox-muted-text) group-hover/checkbox:text-(--checkbox-text)"
            )}
          >
            {label}
          </span>
          {options.strike && inGroup && (
            <motion.span
              aria-hidden
              className={cx(
                // Solid, and the same colour as the ticked label (the theme's accent with a theme on)
                "pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 origin-left rounded-full",
                onAccent ? "bg-(--checkbox-on-accent)" : "bg-(--checkbox-marked-text)"
              )}
              initial={false}
              animate={{ scaleX: checked ? 1 : 0 }}
              transition={snappy}
            />
          )}
        </span>
      )}
      {description !== undefined && (
        <span className={cx("text-sm", onAccent ? "text-(--checkbox-on-accent)/80" : "text-(--checkbox-muted-text)")}>
          {description}
        </span>
      )}
    </span>
  );

  // Standalone items set their own colour variables
  const itemStyle = {
    ...(inGroup ? {} : colorVars(theme, mode, colors)),
    ...(accent ? { "--checkbox-accent": accent } : {}),
  } as React.CSSProperties;

  const rootProps = {
    ref: root,
    "data-slot": "checkbox-item",
    "data-dragging": dragging || undefined,
    "data-value": value,
    "data-checked": checked || undefined,
    "data-indeterminate": mixed || undefined,
    "data-disabled": disabled || undefined,
    className: cx(
      "group/checkbox relative flex cursor-pointer gap-3 text-lg select-none data-disabled:cursor-not-allowed",
      "data-dragging:rounded-md data-dragging:bg-[color-mix(in_oklab,var(--hx-background)_55%,transparent)] data-dragging:shadow-lg data-dragging:backdrop-blur-md",
      description !== undefined ? "items-start" : "items-center",
      !showControl &&
        "rounded-md has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-(--checkbox-accent)/50",
      card &&
        cx(
          "isolate overflow-hidden rounded-md border px-4 py-3 transition-colors duration-300 motion-reduce:transition-none",
          checked
            ? solid
              ? "border-(--checkbox-accent)"
              : accent
                ? "border-(--checkbox-accent)/40"
                : "border-(--checkbox-text)/15"
            : "border-(--checkbox-border) hover:border-(--checkbox-text)/30"
        ),
      draggable && "cursor-grab active:cursor-grabbing",
      className
    ),
    style: itemStyle,
    onPointerDown: (event: React.PointerEvent) => {
      shift.current = event.shiftKey;
      dragged.current = false;
    },
    initial: { opacity: 0, y: 6 },
    animate: { opacity: dimmed ? 0.5 : 1, y: 0 },
    onAnimationComplete: () => setEntered(true),
    transition: { ...spring, delay: entered || reduceMotion ? 0 : index * 0.05, layout: spring },
  };

  const content = (
    <>
      {card && (
        <motion.span
          aria-hidden
          className={cx(
            "pointer-events-none absolute inset-0",
            solid
              ? cx("z-10 flex gap-3 bg-(--checkbox-accent) px-4 py-3", description !== undefined ? "items-start" : "items-center")
              : cx("-z-10", accent ? "bg-(--checkbox-accent)/15" : "bg-(--checkbox-muted)")
          )}
          initial={false}
          animate={{
            clipPath: showControl
              ? `circle(${checked ? "135%" : "0%"} at 1.75rem ${description !== undefined ? "1.5rem" : "50%"})`
              : `circle(${checked ? "150%" : "0%"} at 0% 50%)`,
          }}
          // clipPath isn't a transform, so MotionConfig doesn't stop it: snap under reduced motion
          transition={options.fill && !reduceMotion ? { duration: 0.6, ease: [0.65, 0, 0.35, 1] } : { duration: 0 }}
        >
          {solid && (
            <>
              {showControl && <span className="size-6 shrink-0" />}
              {hasText && renderText(true)}
            </>
          )}
        </motion.span>
      )}
      <motion.span
        className={showControl ? cx("relative grid size-6 shrink-0 place-items-center", solid && "z-20") : "sr-only"}
        whileTap={disabled || !options.elastic ? undefined : { scale: 0.85 }}
      >
        <span
          aria-hidden
          className={cx(
            "pointer-events-none absolute -inset-1 scale-75 border-2 border-(--checkbox-accent)/40 opacity-0 transition-[opacity,scale] duration-300 motion-reduce:transition-none motion-reduce:scale-100 group-has-focus-visible/checkbox:scale-100 group-has-focus-visible/checkbox:opacity-100",
            springyEase
          )}
          style={{ borderRadius: cornerRadius + 4 }}
        />

        <motion.span
          ref={visual}
          aria-hidden
          className={cx(
            "absolute inset-0 overflow-hidden border transition-colors duration-200 motion-reduce:transition-none",
            invalid
              ? "border-(--checkbox-error)"
              : onFill
                ? "border-(--checkbox-on-accent)"
                : marked
                  ? "border-(--checkbox-accent)"
                  : "border-(--checkbox-border) group-hover/checkbox:border-(--checkbox-text)/40"
          )}
          initial={false}
          animate={{ borderRadius: cornerRadius }}
          transition={reduceMotion ? { duration: 0 } : spring}
        >
          <motion.span
            // A circle from the centre, sized to cover the box's corners when fully grown
            className={cx("absolute top-1/2 left-1/2 size-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full", onFill ? "bg-(--checkbox-on-accent)" : "bg-(--checkbox-accent)")}
            initial={false}
            animate={{ scale: marked && filled ? 1 : 0 }}
            transition={{ scale: options.fill ? snappy : { duration: 0 } }}
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cx(
              "absolute inset-0 size-full transition-colors duration-200 motion-reduce:transition-none",
              markOnAccent ? "text-(--checkbox-on-accent)" : "text-(--checkbox-accent)"
            )}
          >
            {options.mark === "check" && (
              <motion.path
                d="M5 12.5 10 17.5 19 7"
                initial={false}
                animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                transition={{
                  pathLength: reduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut", delay: checked ? 0.08 : 0 },
                  opacity: { duration: 0.1 },
                }}
              />
            )}
            {options.mark === "circle-filled" && (
              <motion.circle
                cx={12}
                cy={12}
                r={5}
                fill="currentColor"
                stroke="none"
                initial={false}
                animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                transition={{ scale: checked ? spring : snappy, opacity: { duration: 0.1 } }}
              />
            )}
            {options.mark === "circle-outline" && (
              <motion.circle
                cx={12}
                cy={12}
                r={5}
                strokeWidth={2.5}
                initial={false}
                animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                transition={{
                  pathLength: reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut", delay: checked ? 0.08 : 0 },
                  opacity: { duration: 0.1 },
                }}
              />
            )}
            <motion.path
              d="M6 12h12"
              initial={false}
              animate={{ scaleX: mixed ? 1 : 0, opacity: mixed ? 1 : 0 }}
              transition={{ scaleX: snappy, opacity: { duration: 0.1 } }}
            />
          </svg>
        </motion.span>

        <button
          type="button"
          data-slot="checkbox-control"
          role="checkbox"
          aria-checked={mixed ? "mixed" : checked}
          disabled={disabled}
          onClick={toggle}
          className="absolute -inset-1 z-10 cursor-[inherit] rounded-sm outline-none"
        />
      </motion.span>

      {hasText && renderText(false)}
    </>
  );

  if (inGroup) {
    return (
      <Reorder.Item
        as="label"
        value={value}
        drag={draggable}
        // Stays inside the list instead of following the pointer across the page
        dragConstraints={group?.dragBox}
        dragElastic={0.08}
        whileDrag={{ scale: 1.03, zIndex: 10 }}
        onDragStart={() => {
          dragged.current = true;
          setDragging(true);
        }}
        onDragEnd={() => setDragging(false)}
        onClickCapture={(event) => {
          if (!dragged.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
        {...rootProps}
      >
        {content}
      </Reorder.Item>
    );
  }

  // A checkbox outside a group has no group MotionConfig, so it brings its own
  return (
    <ReducedMotionConfig>
      <motion.label {...rootProps}>{content}</motion.label>
    </ReducedMotionConfig>
  );
}

function RollingNumber({ value }: { value: number }) {
  const digits = String(value).split("");
  return (
    <span>
      <span className="sr-only">{value}</span>
      {digits.map((digit, i) => (
        <RollingDigit key={digits.length - i} digit={Number(digit)} />
      ))}
    </span>
  );
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
  );
}

const SAMPLE_OPTIONS: CheckboxOption[] = [
  { value: "Mushrooms", description: "Roasted chestnut mushrooms.", accent: "#f59e0b" },
  { value: "Olives", description: "Kalamata, pitted.", accent: "#22c55e" },
  { value: "Peppers", description: "Sweet red and yellow.", accent: "#ef4444" },
  { value: "Onions", description: "Slow-cooked until sweet.", accent: "#8b5cf6" },
  { value: "Basil", description: "Added fresh after baking.", accent: "#14b8a6" },
  { value: "Chilli", description: "Fresh, thinly sliced.", accent: "#3b82f6" },
];

export interface AnimatedCheckboxGroupProps extends Omit<CheckboxGroupProps, "children" | "max"> {
  options?: CheckboxOption[];
  max?: number;
  showDescription?: boolean;
  colorful?: boolean;
}

export default function AnimatedCheckboxGroup({
  options = SAMPLE_OPTIONS,
  defaultValue,
  value,
  variant = "card",
  cardFillColor = "accent",
  theme = "vscode",
  reorder = true,
  max = 0,
  min = 0,
  showDescription = true,
  colorful = true,
  className,
  "aria-label": ariaLabel = "Options",
  ...groupProps
}: AnimatedCheckboxGroupProps) {
  const cards = variant === "card";

  return (
    <CheckboxGroup
      {...groupProps}
      variant={variant}
      cardFillColor={cardFillColor}
      theme={theme}
      reorder={reorder}
      // 0 means no upper limit. At least can't exceed At most (it could never be met)
      max={max > 0 ? max : undefined}
      min={max > 0 ? Math.min(min, max) : min}
      value={value}
      defaultValue={value === undefined ? (defaultValue ?? options.slice(1, 2).map((o) => o.value)) : undefined}
      aria-label={ariaLabel}
      className={cx(
        cards ? "grid grid-cols-2 gap-3 max-md:grid-cols-1" : "flex flex-wrap gap-x-6 gap-y-3 max-md:flex-col",
        className
      )}
    >
      {options.map((option) => (
        <CheckboxItem
          key={option.value}
          value={option.value}
          label={option.label ?? option.value}
          description={showDescription ? option.description : undefined}
          disabled={option.disabled}
          accent={colorful ? option.accent : undefined}
        />
      ))}
    </CheckboxGroup>
  );
}
