// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import * as React from "react";
import { animate, AnimatePresence, motion, MotionConfig, Reorder } from "motion/react";

export type RadioVariant = "default" | "card";
export type RadioAppearance = "outline" | "filled" | "full";
export type RadioCardFill = "muted" | "accent";

export interface RadioOption {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  accent?: string;
  disabled?: boolean;
}

const spring = { type: "spring", visualDuration: 0.35, bounce: 0.3 } as const;
const glide = { type: "spring", visualDuration: 0.24, bounce: 0.15 } as const;
const snappy = { type: "spring", visualDuration: 0.25, bounce: 0 } as const;
const instant = { duration: 0 } as const;
const springyEase = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";

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

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

type RadioOptions = {
  slideDot: boolean;
  slideCard: boolean;
  elastic: boolean;
  showIcon: boolean;
  appearance: RadioAppearance;
};

const defaultOptions: RadioOptions = {
  slideDot: false,
  slideCard: true,
  elastic: true,
  showIcon: true,
  appearance: "outline",
};

type RadioGroupContextValue = RadioOptions & {
  id: string;
  variant: RadioVariant;
  cardFillColor: RadioCardFill;
  selected: string;
  select: (value: string) => void;
  reorder: boolean;
  /** Reduced motion: everything lands in its final state at once. */
  reduceMotion: boolean;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);
const RadioIndexContext = React.createContext(0);

export type RadioTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type RadioMode = "light" | "dark";

const THEMES: Record<`${RadioTheme}:${RadioMode}`, Required<RadioColors>> = {
  "default:light": {
    accentColor: "oklch(0.205 0 0)",
    onAccentColor: "oklch(0.985 0 0)",
    textColor: "oklch(0.145 0 0)",
    mutedTextColor: "oklch(0.556 0 0)",
    borderColor: "oklch(0.922 0 0)",
    mutedColor: "oklch(0.92 0 0)"
  },
  "default:dark": {
    accentColor: "oklch(0.922 0 0)",
    onAccentColor: "oklch(0.205 0 0)",
    textColor: "oklch(0.985 0 0)",
    mutedTextColor: "oklch(0.708 0 0)",
    borderColor: "oklch(1 0 0 / 15%)",
    mutedColor: "oklch(0.269 0 0)"
  },
  "caffeine:light": {
    accentColor: "#644a40",
    onAccentColor: "#ffffff",
    textColor: "#202020",
    mutedTextColor: "#646464",
    borderColor: "#d8d8d8",
    mutedColor: "#efefef"
  },
  "caffeine:dark": {
    accentColor: "#ffe0c2",
    onAccentColor: "#081a1b",
    textColor: "#eeeeee",
    mutedTextColor: "#b4b4b4",
    borderColor: "#484848",
    mutedColor: "#222222"
  },
  "claude:light": {
    accentColor: "#c96442",
    onAccentColor: "#ffffff",
    textColor: "#3d3929",
    mutedTextColor: "#83827d",
    borderColor: "#b4b2a7",
    mutedColor: "#ede9de"
  },
  "claude:dark": {
    accentColor: "#d97757",
    onAccentColor: "#ffffff",
    textColor: "#c3c0b6",
    mutedTextColor: "#b7b5a9",
    borderColor: "#52514a",
    mutedColor: "#1b1b19"
  },
  "ghibli:light": {
    accentColor: "#6f9a5b",
    onAccentColor: "#ffffff",
    textColor: "#4a4436",
    mutedTextColor: "#7a705a",
    borderColor: "#cfc59f",
    mutedColor: "#e6dec4"
  },
  "ghibli:dark": {
    accentColor: "#8fbf7a",
    onAccentColor: "#15201a",
    textColor: "#e6e0cc",
    mutedTextColor: "#a8b39f",
    borderColor: "#46584f",
    mutedColor: "#2c3a34"
  },
  "spotify:light": {
    accentColor: "#1db954",
    onAccentColor: "#000000",
    textColor: "#191414",
    mutedTextColor: "#6a6a6a",
    borderColor: "#d4d4d4",
    mutedColor: "#ececec"
  },
  "spotify:dark": {
    accentColor: "#1db954",
    onAccentColor: "#000000",
    textColor: "#ffffff",
    mutedTextColor: "#b3b3b3",
    borderColor: "#3a3a3a",
    mutedColor: "#1f1f1f"
  },
  "valorant:light": {
    accentColor: "#ff4655",
    onAccentColor: "#ffffff",
    textColor: "#0f1923",
    mutedTextColor: "#5c6670",
    borderColor: "#c4beb0",
    mutedColor: "#e2ddd2"
  },
  "valorant:dark": {
    accentColor: "#ff4655",
    onAccentColor: "#ffffff",
    textColor: "#ece8e1",
    mutedTextColor: "#8b978f",
    borderColor: "#344454",
    mutedColor: "#1a2733"
  },
  "vscode:light": {
    accentColor: "#007acc",
    onAccentColor: "#ffffff",
    textColor: "#3b3b3b",
    mutedTextColor: "#717171",
    borderColor: "#cecece",
    mutedColor: "#f3f3f3"
  },
  "vscode:dark": {
    accentColor: "#0e639c",
    onAccentColor: "#ffffff",
    textColor: "#cccccc",
    mutedTextColor: "#9d9d9d",
    borderColor: "#3c3c3c",
    mutedColor: "#2a2d2e"
  }
};

const PAGE_COLORS: Record<`${RadioTheme}:${RadioMode}`, { background: string; foreground: string }> = {
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
export function getThemeProps(theme: RadioTheme = "default", mode: RadioMode = "dark") {
  const colors = PAGE_COLORS[`${theme}:${mode}`] ?? PAGE_COLORS["default:light"];
  return {
    "data-theme": mode,
    style: { "--hx-background": colors.background, "--hx-foreground": colors.foreground } as React.CSSProperties,
  };
}

export interface RadioColors {
  accentColor?: string;
  onAccentColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  borderColor?: string;
  mutedColor?: string;
}

export type RadioGroupProps = Partial<RadioOptions> &
  RadioColors & {
    theme?: RadioTheme;
    mode?: RadioMode;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    "aria-label"?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    variant?: RadioVariant;
    cardFillColor?: RadioCardFill;
    reorder?: boolean;
    onReorder?: (order: string[]) => void;
  };

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  className,
  style,
  children,
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
  "aria-label": ariaLabel,
  ...optionProps
}: RadioGroupProps) {
  const id = React.useId();
  const reduceMotion = usePrefersReducedMotion();
  const groupRef = React.useRef<HTMLDivElement>(null);
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const selected = value !== undefined ? value : internal;

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

  const select = (next: string) => {
    if (next === selected) return;
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!groupRef.current) return;
    const radios = Array.from(
      groupRef.current.querySelectorAll<HTMLButtonElement>("[data-slot=radio-control]:not(:disabled)")
    );
    const index = radios.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    const steps: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let target: number;
    if (event.key === "Home") target = 0;
    else if (event.key === "End") target = radios.length - 1;
    else if (event.key in steps) target = (index + steps[event.key] + radios.length) % radios.length;
    else return;
    event.preventDefault();
    radios[target].focus();
    radios[target].click();
  };

  const context: RadioGroupContextValue = {
    ...defaultOptions,
    ...optionProps,
    id,
    variant,
    cardFillColor,
    selected,
    select,
    reorder,
    reduceMotion,
  };

  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const colorVars = {
    "--radio-accent": accentColor || palette.accentColor,
    "--radio-on-accent": onAccentColor || palette.onAccentColor,
    "--radio-text": textColor || palette.textColor,
    "--radio-muted-text": mutedTextColor || palette.mutedTextColor,
    "--radio-border": borderColor || palette.borderColor,
    "--radio-muted": mutedColor || palette.mutedColor,
  } as React.CSSProperties;

  return (
    <MotionConfig reducedMotion="never">
      <RadioGroupContext.Provider value={context}>
        <Reorder.Group
          as="div"
          axis="y"
          values={currentOrder}
          onReorder={(next: string[]) => {
            setOrder(next);
            onReorder?.(next);
          }}
          ref={groupRef}
          role="radiogroup"
          aria-label={ariaLabel}
          data-slot="radio-group"
          onKeyDown={onKeyDown}
          style={{ ...colorVars, ...style }}
          data-reduced={reduceMotion || undefined}
          className={cx("isolate grid w-full gap-3 motion-reduce:**:transition-none data-reduced:**:transition-none", className)}
        >
          {items.map((child, index) => (
            <RadioIndexContext.Provider key={child.key ?? index} value={index}>
              {child}
            </RadioIndexContext.Provider>
          ))}
        </Reorder.Group>
      </RadioGroupContext.Provider>
    </MotionConfig>
  );
}

export interface RadioGroupItemProps {
  className?: string;
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  accent?: string;
}

export function RadioGroupItem({
  className,
  value,
  label,
  description,
  disabled = false,
  accent,
}: RadioGroupItemProps) {
  const group = React.useContext(RadioGroupContext);
  if (!group) throw new Error("RadioGroupItem must be used inside a RadioGroup.");

  const index = React.useContext(RadioIndexContext);
  const reduceMotion = group.reduceMotion;
  const visual = React.useRef<HTMLSpanElement>(null);
  const dragged = React.useRef(false);
  const [entered, setEntered] = React.useState(false);

  const checked = group.selected === value;
  const card = group.variant === "card";
  const draggable = group.reorder && !disabled;

  const [wasChecked, setWasChecked] = React.useState(checked);
  const [pulse, setPulse] = React.useState(0);
  if (checked !== wasChecked) {
    setWasChecked(checked);
    if (checked) setPulse((p) => p + 1);
  }

  React.useEffect(() => {
    if (pulse === 0 || !group.elastic || reduceMotion || !visual.current) return;
    animate(
      visual.current,
      { scale: [1, 0.7, 1.25, 0.94, 1] },
      { duration: 0.55, times: [0, 0.2, 0.5, 0.75, 1], ease: "easeOut" }
    );
  }, [pulse, group.elastic, reduceMotion]);

  const hasText = label !== undefined || description !== undefined;
  const solid = card && group.cardFillColor === "accent";
  const onFill = solid && checked;
  const showControl = group.showIcon;
  const filled = group.appearance === "filled";
  const full = group.appearance === "full";
  const dotOnAccent = filled !== onFill;
  const dotClass = cx(
    "pointer-events-none absolute z-10 size-3 rounded-full",
    dotOnAccent ? "bg-(--radio-on-accent)" : "bg-(--radio-accent)"
  );

  const cardHighlight = cx(
    "pointer-events-none absolute -inset-px -z-10 rounded-md",
    solid ? "bg-(--radio-accent)" : accent ? "bg-(--radio-accent)/15" : "bg-(--radio-muted)"
  );

  return (
    <Reorder.Item
      as="label"
      value={value}
      drag={draggable}
      whileDrag={{ scale: reduceMotion ? 1 : 1.03, zIndex: 10 }}
      onDragStart={() => (dragged.current = true)}
      onPointerDown={() => (dragged.current = false)}
      onClickCapture={(event) => {
        if (!dragged.current) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      data-slot="radio-item"
      data-value={value}
      data-checked={checked || undefined}
      data-disabled={disabled || undefined}
      className={cx(
        "group/radio relative flex cursor-pointer gap-3 text-lg select-none data-disabled:cursor-not-allowed",
        description !== undefined ? "items-start" : "items-center",
        // Plain rows only react (hover, cursor) over their own content, not the full row
        !card && "w-fit self-start",
        !showControl &&
          "rounded-md has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-(--radio-accent)/50",
        card &&
          cx(
            "rounded-md border px-4 py-3 transition-colors duration-300",
            checked
              ? solid
                ? "border-(--radio-accent)"
                : accent
                  ? "border-(--radio-accent)/40"
                  : "border-(--radio-text)/15"
              : cx("border-(--radio-border)", !disabled && "hover:border-(--radio-text)/30")
          ),
        draggable && "cursor-grab active:cursor-grabbing",
        className
      )}
      style={accent ? ({ "--radio-accent": accent } as React.CSSProperties) : undefined}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: disabled ? 0.5 : 1, y: 0 }}
      onAnimationComplete={() => setEntered(true)}
      transition={reduceMotion ? { ...instant, layout: instant } : { ...spring, delay: entered ? 0 : index * 0.05, layout: spring }}
    >
      {card &&
        (group.slideCard ? (
          checked && (
            <motion.span
              layoutId={`${group.id}-card`}
              aria-hidden
              className={cardHighlight}
              style={{ borderRadius: "var(--radius-md, 0.375rem)" }}
              transition={reduceMotion ? instant : glide}
            />
          )
        ) : (
          <motion.span
            aria-hidden
            className={cardHighlight}
            initial={false}
            animate={{ opacity: checked ? 1 : 0, scale: checked || reduceMotion ? 1 : 0.96 }}
            transition={reduceMotion ? instant : snappy}
          />
        ))}

      <motion.span
        className={showControl ? "relative grid size-6 shrink-0 place-items-center" : "sr-only"}
        whileTap={disabled || !group.elastic || reduceMotion ? undefined : { scale: 0.85 }}
      >
        <span
          aria-hidden
          className={cx(
            "pointer-events-none absolute -inset-1 scale-75 rounded-full border-2 border-(--radio-accent)/40 opacity-0 transition-[opacity,scale] duration-300 group-has-focus-visible/radio:scale-100 group-has-focus-visible/radio:opacity-100",
            springyEase
          )}
        />

        <span
          ref={visual}
          aria-hidden
          className={cx(
            "absolute inset-0 overflow-hidden rounded-full border transition-colors duration-200",
            onFill
              ? "border-(--radio-on-accent)"
              : checked
                ? "border-(--radio-accent)"
                : "border-(--radio-border) group-hover/radio:border-(--radio-text)/40"
          )}
        >
          {(filled || full) && (
            <motion.span
              className={cx("absolute inset-0 rounded-full", onFill ? "bg-(--radio-on-accent)" : "bg-(--radio-accent)")}
              initial={false}
              animate={{ scale: checked ? 1 : 0 }}
              transition={reduceMotion ? instant : snappy}
            />
          )}
        </span>

        {showControl &&
          !full &&
          (group.slideDot ? (
            checked && <motion.span layoutId={`${group.id}-dot`} aria-hidden className={dotClass} transition={reduceMotion ? instant : glide} />
          ) : (
            <AnimatePresence initial={false}>
              {checked && (
                <motion.span
                  key="dot"
                  aria-hidden
                  className={dotClass}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, opacity: 0, transition: reduceMotion ? instant : snappy }}
                  transition={reduceMotion ? instant : spring}
                />
              )}
            </AnimatePresence>
          ))}

        <button
          type="button"
          data-slot="radio-control"
          role="radio"
          aria-checked={checked}
          disabled={disabled}
          tabIndex={checked || group.selected === "" ? 0 : -1}
          onClick={() => !disabled && group.select(value)}
          className="absolute -inset-1 z-20 cursor-[inherit] rounded-full outline-none"
        />
      </motion.span>

      {hasText && (
        <span className="flex flex-col gap-1">
          {label !== undefined && (
            <span
              className={cx(
                "w-fit leading-none transition-colors duration-300",
                onFill
                  ? "text-(--radio-on-accent)"
                  : checked
                    ? "text-(--radio-text)"
                    : "text-(--radio-muted-text) group-hover/radio:text-(--radio-text)"
              )}
            >
              {label}
            </span>
          )}
          {description !== undefined && (
            <span
              className={cx(
                "text-sm transition-colors duration-300",
                onFill ? "text-(--radio-on-accent)/80" : "text-(--radio-muted-text)"
              )}
            >
              {description}
            </span>
          )}
        </span>
      )}
    </Reorder.Item>
  );
}

const SAMPLE_OPTIONS: RadioOption[] = [
  { value: "Standard", description: "3–5 working days. Free.", accent: "#3b82f6" },
  { value: "Express", description: "Next working day. £4.99.", accent: "#f59e0b" },
  { value: "Same day", description: "Order before noon. £9.99.", accent: "#ef4444" },
  { value: "Collect", description: "Pick up in store tomorrow.", accent: "#22c55e" },
];

export interface AnimatedRadioGroupProps extends Omit<RadioGroupProps, "children"> {
  options?: RadioOption[];
  showDescription?: boolean;
  colorful?: boolean;
}

export default function AnimatedRadioGroup({
  options = SAMPLE_OPTIONS,
  defaultValue,
  value,
  variant = "card",
  cardFillColor = "accent",
  theme = "valorant",
  mode = "dark",
  reorder = true,
  showDescription = true,
  colorful = false,
  className,
  "aria-label": ariaLabel = "Options",
  ...groupProps
}: AnimatedRadioGroupProps) {
  const cards = variant === "card";

  return (
    <RadioGroup
      {...groupProps}
      variant={variant}
      cardFillColor={cardFillColor}
      theme={theme}
      mode={mode}
      reorder={reorder}
      value={value}
      defaultValue={value === undefined ? (defaultValue ?? options[1]?.value ?? options[0]?.value) : undefined}
      aria-label={ariaLabel}
      className={cx(cards ? "grid grid-cols-2 gap-3 max-md:grid-cols-1" : "flex flex-col gap-4", className)}
    >
      {options.map((option) => (
        <RadioGroupItem
          key={option.value}
          value={option.value}
          label={option.label ?? option.value}
          description={showDescription ? option.description : undefined}
          disabled={option.disabled}
          accent={colorful ? option.accent : undefined}
        />
      ))}
    </RadioGroup>
  );
}
