// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { MotionConfig, motion, AnimatePresence, useAnimationControls, type Transition, type Variants } from "motion/react";
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

export type AnimatedQuestionnaireTheme = "default" | "caffeine" | "claude" | "ghibli" | "spotify" | "valorant" | "vscode";
export type AnimatedQuestionnaireMode = "light" | "dark";

const THEMES: Record<`${AnimatedQuestionnaireTheme}:${AnimatedQuestionnaireMode}`, Record<string, string>> = {
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
function themeProps(theme: AnimatedQuestionnaireTheme = "default", mode: AnimatedQuestionnaireMode = "dark") {
  const palette = THEMES[`${theme}:${mode}`] ?? THEMES["default:light"];
  const style = Object.fromEntries(Object.entries(palette).map(([token, value]) => [`--hx-${token}`, value]));
  // Any theme but Default tints key parts with its primary colour
  return { "data-theme": mode, "data-accent": theme === "default" ? undefined : "", style: style as React.CSSProperties };
}

const ThemeContext = React.createContext(themeProps());

// ---- questionnaire-primitive.tsx ----

type ItemStatus = "unanswered" | "answered" | "skipped"
type ShortcutMode = "letters" | "numbers"
type Direction = "next" | "previous"

type RenderFn<S> = (props: Record<string, unknown>, state: S) => React.ReactElement
type Part<Tag extends React.ElementType, S = object> = React.ComponentPropsWithRef<Tag> & {
  render?: React.ReactElement | RenderFn<S>
}

type AnswerControl =
  | { type: "choice"; id: string; element: HTMLInputElement; disabled: boolean; ownDisabled: boolean; value: string }
  | { type: "input"; id: string; element: HTMLInputElement; disabled: boolean }

type RegisteredItem = {
  name: string
  element: HTMLElement
  disabled: boolean
  required: boolean
  status: ItemStatus
  focus: () => void
  focusInvalid: () => void
  getAnswerByElement: (element: Element) => AnswerControl | null
  getAnswerByShortcut: (shortcut: string) => AnswerControl | null
  moveAnswerFocus: (element: Element, direction: Direction) => boolean
  reset: () => void
  skip: () => void
  validate: () => boolean
}

type RootContextValue = {
  current: number
  first: boolean
  last: boolean
  total: number
  activeItemName: string | null
  activeItemRequired: boolean | null
  activeItemStatus: ItemStatus | null
  domVersion: number
  goNext: () => void
  goPrevious: () => void
  nativeValidation: boolean
  registerItem: (item: RegisteredItem) => () => void
  shortcuts: ShortcutMode | null
  skipCurrent: () => void
}

type ItemContextValue = {
  active: boolean
  disabled: boolean
  hasInputAnswer: boolean
  invalid: boolean
  multiple: boolean
  name: string
  registerAnswerControl: (control: AnswerControl) => () => void
  registerAnswerSelection: (id: string, selected: boolean) => () => void
  registerDescription: (id: string) => () => void
  registerError: (id: string) => () => void
  required: boolean
  resetVersion: number
  selectedAnswerIds: string[]
  setAnswerDefault: (id: string, selected: boolean) => void
  setAnswerSelectionFromInteraction: (id: string, selected: boolean) => void
  shortcutByAnswerId: Map<string, string>
  shortcuts: ShortcutMode | null
  status: ItemStatus
  syncControlledAnswerSelection: (id: string, selected: boolean) => void
}

type ChoiceState = {
  checked: boolean
  disabled: boolean
  invalid: boolean
  shortcut: string | null
  type: "checkbox" | "radio"
}

type ChoiceContextValue = {
  inputProps: React.ComponentPropsWithRef<"input">
  state: ChoiceState
}

type ProgressState = { current: number; first: boolean; last: boolean; total: number }

type NavState = {
  disabled: boolean
  shortcut: "Enter" | null
  status: ItemStatus | null
  visible: boolean
}

const RootContext = React.createContext<RootContextValue | null>(null)
const ItemContext = React.createContext<ItemContextValue | null>(null)
const ChoiceContext = React.createContext<ChoiceContextValue | null>(null)

function useRootContext(part: string) {
  const context = React.useContext(RootContext)
  if (!context) throw new Error(`${part} must be used within a Questionnaire root.`)
  return context
}

function useItemContext(part: string) {
  const context = React.useContext(ItemContext)
  if (!context) throw new Error(`${part} must be used within a Questionnaire item.`)
  return context
}

function useChoiceContext(part: string) {
  const context = React.useContext(ChoiceContext)
  if (!context) throw new Error(`${part} must be used within a Questionnaire choice.`)
  return context
}

// Rendering helpers

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node)
  else if (ref) (ref as React.RefObject<T | null>).current = node
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  const list = refs.filter(Boolean)
  if (list.length === 0) return undefined
  return (node: T | null) => {
    for (const ref of list) assignRef(ref, node)
  }
}

function mergeProps(...sources: (Record<string, unknown> | undefined)[]) {
  const result: Record<string, unknown> = {}
  for (const source of sources) {
    if (!source) continue
    for (const key of Object.keys(source)) {
      const value = source[key]
      if (value === undefined) continue
      const previous = result[key]
      if (key === "className") {
        result[key] = [previous, value].filter(Boolean).join(" ")
      } else if (key === "style") {
        result[key] = { ...(previous as object), ...(value as object) }
      } else if (key === "ref") {
        result[key] = mergeRefs(previous as React.Ref<unknown>, value as React.Ref<unknown>)
      } else if (/^on[A-Z]/.test(key) && typeof previous === "function" && typeof value === "function") {
        // The later handler runs first and can stop the earlier one
        result[key] = (event: React.SyntheticEvent) => {
          ;(value as (e: React.SyntheticEvent) => void)(event)
          if (!event.defaultPrevented) (previous as (e: React.SyntheticEvent) => void)(event)
        }
      } else {
        result[key] = value
      }
    }
  }
  return result
}

type AttributeMap<S> = { [K in keyof S]?: (value: S[K]) => Record<string, string | undefined> }

function stateToAttributes<S extends object>(state: S, mapping?: AttributeMap<S>) {
  const attributes: Record<string, string | undefined> = {}
  for (const key of Object.keys(state) as (keyof S & string)[]) {
    const value = state[key]
    const custom = (mapping?.[key] as ((v: unknown) => Record<string, string | undefined>) | undefined)?.(value)
    if (custom) {
      Object.assign(attributes, custom)
      continue
    }
    const attribute = `data-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`
    if (typeof value === "boolean") attributes[attribute] = value ? "" : undefined
    else if (value != null) attributes[attribute] = String(value)
  }
  return attributes
}

function renderPart<S extends object>({
  tag,
  props,
  render,
  state,
  mapping,
}: {
  tag: string
  props: Record<string, unknown>
  render?: React.ReactElement | RenderFn<S>
  state?: S
  mapping?: AttributeMap<S>
}) {
  const merged = mergeProps(state ? stateToAttributes(state, mapping) : undefined, props)
  if (!render) return React.createElement(tag, merged)
  if (typeof render === "function") return render(merged, state ?? ({} as S))
  const own = render.props as Record<string, unknown>
  return React.cloneElement(render, {
    ...mergeProps(merged, own),
    ref: mergeRefs(merged.ref as React.Ref<unknown>, own.ref as React.Ref<unknown>),
  } as Record<string, unknown>)
}

const checkedMapping = {
  checked: (value: boolean) => ({
    "data-checked": value ? "" : undefined,
    "data-unchecked": value ? undefined : "",
  }),
}

// Answer helpers

function hasText(value: unknown) {
  if (Array.isArray(value)) return value.some((v) => String(v).trim().length > 0)
  return value != null && String(value).trim().length > 0
}

function shortcutKeys(mode: ShortcutMode | null) {
  if (mode === "letters") return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  if (mode === "numbers") return Array.from({ length: 9 }, (_, i) => String(i + 1))
  return []
}

function normalizeShortcutKey(key: string, mode: ShortcutMode) {
  const value = mode === "letters" ? key.toUpperCase() : key
  return shortcutKeys(mode).includes(value) ? value : null
}

function keyShortcuts(shortcut: string | null, withEnter: boolean) {
  return [shortcut, withEnter ? "Enter" : null].filter(Boolean).join(" ") || undefined
}

function isAnswered(answer: AnswerControl) {
  if (answer.type === "choice") return answer.element.checked
  return answer.element.hasAttribute("name") && hasText(answer.element.value)
}

function isEmptyTextInput(answer: AnswerControl | null) {
  return (
    answer?.type === "input" &&
    ["email", "password", "search", "tel", "text", "url"].includes(answer.element.type) &&
    !hasText(answer.element.value)
  )
}

function isEditable(element: Element) {
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) return true
  if (element instanceof HTMLInputElement) {
    return !["button", "checkbox", "radio", "reset", "submit"].includes(element.type)
  }
  return element instanceof HTMLElement && element.isContentEditable
}

function isRadio(element: Element) {
  return element instanceof HTMLInputElement && element.type === "radio"
}

function byDomOrder(a: { element: Element }, b: { element: Element }) {
  if (a.element === b.element) return 0
  const position = a.element.compareDocumentPosition(b.element)
  if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
  if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
  return 0
}

// Hooks

function useChoice({
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  value,
}: {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value: string
}): ChoiceContextValue {
  const {
    disabled: itemDisabled,
    hasInputAnswer,
    invalid,
    multiple,
    name,
    registerAnswerControl,
    registerAnswerSelection,
    required,
    resetVersion,
    selectedAnswerIds,
    setAnswerDefault,
    setAnswerSelectionFromInteraction,
    shortcutByAnswerId,
    status,
    syncControlledAnswerSelection,
  } = useItemContext("Questionnaire choice")

  const id = React.useId()
  const [element, setElement] = React.useState<HTMLInputElement | null>(null)
  const initialChecked = React.useRef(defaultChecked)
  const controlled = checked !== undefined
  const isDisabled = itemDisabled || disabled
  const selected = selectedAnswerIds.includes(id)
  const isChecked = controlled ? (status === "skipped" ? false : checked) : selected
  const type = multiple ? "checkbox" : "radio"
  const shortcut = shortcutByAnswerId.get(id) ?? null

  React.useLayoutEffect(() => registerAnswerSelection(id, initialChecked.current), [id, registerAnswerSelection])

  React.useLayoutEffect(() => {
    setAnswerDefault(id, defaultChecked)
  }, [id, defaultChecked, setAnswerDefault])

  React.useLayoutEffect(() => {
    if (!element) return
    return registerAnswerControl({ type: "choice", id, element, disabled: isDisabled, ownDisabled: disabled, value })
  }, [id, disabled, isDisabled, element, registerAnswerControl, value])

  React.useLayoutEffect(() => {
    if (controlled) syncControlledAnswerSelection(id, checked)
  }, [id, controlled, checked, resetVersion, syncControlledAnswerSelection])

  React.useLayoutEffect(() => {
    if (!element) return
    // eslint-disable-next-line react-hooks/immutability
    element.defaultChecked = controlled ? checked : defaultChecked
    if (resetVersion > 0) element.checked = isChecked
  }, [isChecked, controlled, checked, defaultChecked, element, resetVersion])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event)
    if (event.defaultPrevented) return
    if (!controlled) {
      setAnswerSelectionFromInteraction(id, event.target.checked)
      return
    }
    if (status === "skipped" && checked === event.target.checked) {
      setAnswerSelectionFromInteraction(id, checked)
    }
  }

  return {
    inputProps: {
      ref: setElement,
      "aria-invalid": invalid || undefined,
      "aria-keyshortcuts": keyShortcuts(shortcut, !isDisabled && isChecked),
      checked: isChecked,
      disabled: isDisabled,
      id,
      name: status === "skipped" ? undefined : name,
      onChange: handleChange,
      required: required && !multiple && !hasInputAnswer,
      type,
      value,
    },
    state: { checked: isChecked, disabled: isDisabled, invalid, shortcut, type },
  }
}

function useInput({
  defaultValue,
  disabled = false,
  onChange,
  ref,
  type = "text",
  value,
}: {
  defaultValue?: React.ComponentProps<"input">["defaultValue"]
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  ref?: React.Ref<HTMLInputElement>
  type?: string
  value?: React.ComponentProps<"input">["value"]
}) {
  const {
    disabled: itemDisabled,
    invalid,
    name,
    registerAnswerControl,
    registerAnswerSelection,
    resetVersion,
    selectedAnswerIds,
    setAnswerDefault,
    setAnswerSelectionFromInteraction,
    syncControlledAnswerSelection,
  } = useItemContext("Questionnaire input")

  const id = React.useId()
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const initialFilled = React.useRef(hasText(defaultValue))
  const controlled = value !== undefined
  const defaultFilled = hasText(defaultValue)
  const valueFilled = hasText(value)
  const [ownFilled, setOwnFilled] = React.useState(defaultFilled)
  const isDisabled = itemDisabled || disabled
  const filled = controlled ? valueFilled : ownFilled
  const selected = selectedAnswerIds.includes(id)

  React.useLayoutEffect(() => registerAnswerSelection(id, initialFilled.current), [id, registerAnswerSelection])

  React.useLayoutEffect(() => {
    setAnswerDefault(id, defaultFilled)
  }, [defaultFilled, id, setAnswerDefault])

  React.useLayoutEffect(() => {
    const element = inputRef.current
    if (!element) return
    return registerAnswerControl({ type: "input", id, element, disabled: isDisabled })
  }, [isDisabled, id, registerAnswerControl])

  React.useLayoutEffect(() => {
    if (controlled) {
      syncControlledAnswerSelection(id, valueFilled)
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (resetVersion > 0) setOwnFilled(defaultFilled)
  }, [controlled, valueFilled, value, defaultFilled, id, resetVersion, syncControlledAnswerSelection])

  React.useLayoutEffect(() => {
    const element = inputRef.current
    if (!element || !controlled) return
    element.defaultValue = String(value)
  }, [controlled, value])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event)
    if (event.defaultPrevented) return
    const nextFilled = event.target.value.trim().length > 0
    if (!controlled) {
      setOwnFilled(nextFilled)
      setAnswerSelectionFromInteraction(id, nextFilled)
    }
  }

  const setRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      assignRef(ref, node)
    },
    [ref]
  )

  return {
    inputProps: {
      "aria-invalid": invalid || undefined,
      "aria-keyshortcuts": keyShortcuts(null, !isDisabled && filled && selected),
      defaultValue: controlled ? undefined : defaultValue,
      disabled: isDisabled,
      form: selected ? undefined : "",
      id,
      name: selected ? name : undefined,
      onChange: handleChange,
      ref: setRef,
      type,
      value: controlled ? value : undefined,
    } as React.ComponentPropsWithRef<"input">,
    state: { disabled: isDisabled, filled, invalid },
  }
}

function useItem({
  "aria-describedby": ariaDescribedBy,
  "aria-keyshortcuts": ariaKeyShortcuts,
  disabled = false,
  invalid = false,
  multiple = false,
  name,
  onStatusChange,
  ref,
  required = false,
}: {
  "aria-describedby"?: string
  "aria-keyshortcuts"?: string
  disabled?: boolean
  invalid?: boolean
  multiple?: boolean
  name: string
  onStatusChange?: (status: ItemStatus) => void
  ref?: React.Ref<HTMLFieldSetElement>
  required?: boolean
}) {
  const { activeItemName, domVersion, first, last, nativeValidation, registerItem, shortcuts } =
    useRootContext("Questionnaire item")

  const [element, setElement] = React.useState<HTMLFieldSetElement | null>(null)
  const [answers, setAnswers] = React.useState<AnswerControl[]>([])
  const [attempted, setAttempted] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [skipped, setSkipped] = React.useState(false)
  const [resetVersion, setResetVersion] = React.useState(0)
  const [descriptionIds, setDescriptionIds] = React.useState<string[]>([])
  const [errorIds, setErrorIds] = React.useState<string[]>([])
  const defaultIds = React.useRef<string[]>([])
  const multipleRef = React.useRef(multiple)
  const previousMultiple = React.useRef(multiple)

  React.useLayoutEffect(() => {
    multipleRef.current = multiple
  })

  const active = !disabled && activeItemName === name

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sorted = React.useMemo(() => [...answers].sort(byDomOrder), [answers, domVersion])
  const enabled = React.useMemo(() => sorted.filter((answer) => !answer.disabled), [sorted])
  const hasSelection = enabled.some((answer) => selectedIds.includes(answer.id))
  const status: ItemStatus = skipped ? "skipped" : hasSelection ? "answered" : "unanswered"
  const skippedOptional = status === "skipped" && !required
  const satisfied = disabled || skippedOptional || (!invalid && status === "answered")
  const showInvalid = !disabled && !skippedOptional && (invalid || (attempted && !satisfied))
  const hasInputAnswer = enabled.some((answer) => answer.type === "input")
  const previousStatus = React.useRef(status)

  const shortcutByAnswerId = React.useMemo(() => {
    const keys = shortcutKeys(shortcuts)
    const choices = enabled.filter((answer) => answer.type === "choice")
    return new Map(choices.slice(0, keys.length).map((answer, index) => [answer.id, keys[index]]))
  }, [enabled, shortcuts])

  const registerAnswerControl = React.useCallback((control: AnswerControl) => {
    setAnswers((list) => [...list.filter((a) => a.element !== control.element && a.id !== control.id), control])
    return () => setAnswers((list) => list.filter((a) => a !== control))
  }, [])

  React.useLayoutEffect(() => {
    if (previousStatus.current === status) return
    previousStatus.current = status
    onStatusChange?.(status)
  }, [onStatusChange, status])

  const applySelection = React.useCallback(
    (id: string, selected: boolean) => {
      setSelectedIds((ids) =>
        selected ? (multiple ? (ids.includes(id) ? ids : [...ids, id]) : [id]) : ids.filter((x) => x !== id)
      )
    },
    [multiple]
  )

  const setAnswerSelectionFromInteraction = React.useCallback(
    (id: string, selected: boolean) => {
      setSkipped(false)
      applySelection(id, selected)
    },
    [applySelection]
  )

  const syncControlledAnswerSelection = React.useCallback(
    (id: string, selected: boolean) => {
      if (selected) setSkipped(false)
      applySelection(id, selected)
    },
    [applySelection]
  )

  const registerAnswerSelection = React.useCallback((id: string, selected: boolean) => {
    if (selected) {
      defaultIds.current = [...defaultIds.current.filter((x) => x !== id), id]
      setSelectedIds((ids) =>
        multipleRef.current ? (ids.includes(id) ? ids : [...ids, id]) : ids.length ? ids : [id]
      )
    }
    return () => {
      defaultIds.current = defaultIds.current.filter((x) => x !== id)
      setSelectedIds((ids) => ids.filter((x) => x !== id))
    }
  }, [])

  const setAnswerDefault = React.useCallback((id: string, selected: boolean) => {
    if (selected) {
      if (!defaultIds.current.includes(id)) defaultIds.current = [...defaultIds.current, id]
      return
    }
    defaultIds.current = defaultIds.current.filter((x) => x !== id)
  }, [])

  const registerDescription = React.useCallback((id: string) => {
    setDescriptionIds((ids) => (ids.includes(id) ? ids : [...ids, id]))
    return () => setDescriptionIds((ids) => ids.filter((x) => x !== id))
  }, [])

  const registerError = React.useCallback((id: string) => {
    setErrorIds((ids) => (ids.includes(id) ? ids : [...ids, id]))
    return () => setErrorIds((ids) => ids.filter((x) => x !== id))
  }, [])

  const validate = React.useCallback(() => {
    setAttempted(true)
    if (!satisfied) return false
    if (!nativeValidation) return true
    const failing = enabled.find(
      (answer) => isAnswered(answer) && answer.element.willValidate && !answer.element.validity.valid
    )
    if (!failing) return true
    failing.element.focus()
    failing.element.reportValidity()
    return false
  }, [enabled, nativeValidation, satisfied])

  const focus = React.useCallback(() => {
    element?.focus()
  }, [element])

  const focusInvalid = React.useCallback(() => {
    const filled = element?.querySelector<HTMLElement>("input[data-filled][name]:not(:disabled)")
    const field = element?.querySelector<HTMLElement>(
      "input:not([type=hidden]):not(:disabled), textarea:not(:disabled)"
    )
    ;(filled ?? field ?? element)?.focus()
  }, [element])

  const reset = React.useCallback(() => {
    setAttempted(false)
    setSkipped(false)
    setSelectedIds(multiple ? [...defaultIds.current] : defaultIds.current.slice(0, 1))
    setResetVersion((v) => v + 1)
  }, [multiple])

  const skip = React.useCallback(() => {
    if (required) return
    setSelectedIds([])
    setSkipped(true)
  }, [required])

  React.useLayoutEffect(() => {
    const was = previousMultiple.current
    previousMultiple.current = multiple
    if (!was || multiple) return
    // Going single keeps only the first selected answer
    setSelectedIds((ids) => {
      const keep = enabled.find((answer) => ids.includes(answer.id))
      return keep ? [keep.id] : []
    })
  }, [enabled, multiple])

  const getAnswerByElement = React.useCallback(
    (target: Element) => enabled.find((answer) => answer.element === target) ?? null,
    [enabled]
  )

  const getAnswerByShortcut = React.useCallback(
    (shortcut: string) => {
      const id = Array.from(shortcutByAnswerId.entries()).find(([, key]) => key === shortcut)?.[0]
      return enabled.find((answer) => answer.id === id) ?? null
    },
    [enabled, shortcutByAnswerId]
  )

  const moveAnswerFocus = React.useCallback(
    (target: Element, direction: Direction) => {
      const index = enabled.findIndex((answer) => answer.element === target)
      const current = index < 0 ? null : (enabled[index] ?? null)
      if (!enabled.length || (isEditable(target) && !isEmptyTextInput(current)) || (index < 0 && target !== element)) {
        return false
      }
      const next =
        index < 0
          ? (enabled.find(isAnswered) ?? (direction === "next" ? enabled[0] : enabled[enabled.length - 1]))
          : enabled[(index + (direction === "next" ? 1 : -1) + enabled.length) % enabled.length]
      if (!next || next.element === target || (index >= 0 && isRadio(target) && isRadio(next.element))) {
        return false
      }
      next.element.focus()
      if (next.type === "choice" && isRadio(next.element)) next.element.click()
      return true
    },
    [enabled, element]
  )

  React.useLayoutEffect(() => {
    if (!element) return
    return registerItem({
      disabled,
      element,
      focus,
      focusInvalid,
      getAnswerByElement,
      getAnswerByShortcut,
      moveAnswerFocus,
      name,
      required,
      reset,
      skip,
      status,
      validate,
    })
  }, [
    disabled,
    element,
    focus,
    focusInvalid,
    getAnswerByElement,
    getAnswerByShortcut,
    moveAnswerFocus,
    name,
    registerItem,
    required,
    reset,
    skip,
    status,
    validate,
  ])

  const context = React.useMemo<ItemContextValue>(
    () => ({
      active,
      disabled,
      hasInputAnswer,
      invalid: showInvalid,
      multiple,
      name,
      registerAnswerControl,
      registerAnswerSelection,
      registerDescription,
      registerError,
      required,
      resetVersion,
      selectedAnswerIds: selectedIds,
      setAnswerDefault,
      setAnswerSelectionFromInteraction,
      shortcutByAnswerId,
      shortcuts,
      status,
      syncControlledAnswerSelection,
    }),
    [
      active,
      disabled,
      hasInputAnswer,
      showInvalid,
      multiple,
      name,
      registerAnswerControl,
      registerAnswerSelection,
      registerDescription,
      registerError,
      required,
      resetVersion,
      selectedIds,
      setAnswerDefault,
      setAnswerSelectionFromInteraction,
      shortcutByAnswerId,
      shortcuts,
      status,
      syncControlledAnswerSelection,
    ]
  )

  const setRef = React.useCallback(
    (node: HTMLFieldSetElement | null) => {
      setElement(node)
      assignRef(ref, node)
    },
    [ref]
  )

  const describedBy =
    [...descriptionIds, ...(showInvalid ? errorIds : []), ariaDescribedBy].filter(Boolean).join(" ") || undefined

  const keyshortcuts =
    [
      ariaKeyShortcuts,
      active ? "Meta+Enter Control+Enter" : undefined,
      active && enabled.length ? "ArrowUp ArrowDown" : undefined,
      active && !first ? "ArrowLeft" : undefined,
      active && !last && status !== "unanswered" ? "ArrowRight" : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined

  return {
    context,
    itemProps: {
      "aria-describedby": describedBy,
      "aria-invalid": showInvalid || undefined,
      "aria-keyshortcuts": keyshortcuts,
      disabled,
      hidden: !active,
      inert: !active,
      ref: setRef,
      tabIndex: -1,
    },
    state: { active, disabled, invalid: showInvalid, multiple, required, status },
  }
}

function useRoot({
  defaultItem,
  item,
  noValidate,
  onItemChange,
  onReset,
  onSubmit,
  ref,
  shortcuts,
}: {
  defaultItem?: string
  item?: string
  noValidate?: boolean
  onItemChange?: (item: string) => void
  onReset?: React.FormEventHandler<HTMLFormElement>
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  ref?: React.Ref<HTMLFormElement>
  shortcuts?: ShortcutMode
}) {
  const [registered, setRegistered] = React.useState<RegisteredItem[]>([])
  const [ownItem, setOwnItem] = React.useState<string | null>(defaultItem ?? null)
  const [form, setForm] = React.useState<HTMLFormElement | null>(null)
  const [domVersion, setDomVersion] = React.useState(0)
  const pending = React.useRef<{ name: string; target: "item" | "invalid" } | null>(null)
  const controlled = item !== undefined
  const currentName = controlled ? item : ownItem
  const previousName = React.useRef(currentName)
  const nativeValidation = noValidate === false
  const shortcutMode = shortcuts ?? null

  React.useLayoutEffect(() => {
    if (!form || typeof MutationObserver === "undefined") return
    const observer = new MutationObserver(() => setDomVersion((v) => v + 1))
    observer.observe(form, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [form])

  const items = React.useMemo(
    () => registered.filter((entry) => !entry.disabled).sort(byDomOrder),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [domVersion, registered]
  )
  const byName = React.useMemo(() => new Map(items.map((entry) => [entry.name, entry])), [items])
  const index = items.findIndex((entry) => entry.name === currentName)
  const activeItem = index < 0 || !currentName ? null : (byName.get(currentName) ?? null)
  const activeItemRequired = index < 0 ? null : (activeItem?.required ?? false)
  const activeItemStatus = index < 0 ? null : (activeItem?.status ?? (currentName ? "unanswered" : null))
  const total = items.length
  const current = index < 0 ? 0 : index + 1
  const first = total > 0 && index === 0
  const last = total > 0 && index === total - 1

  const goTo = React.useCallback(
    (name: string, target: "item" | "invalid" = "item") => {
      if (name === currentName) return
      pending.current = { name, target }
      if (!controlled) setOwnItem(name)
      onItemChange?.(name)
    },
    [currentName, controlled, onItemChange]
  )

  React.useLayoutEffect(() => {
    if (total === 0) return
    if (index < 0) {
      if (!controlled && currentName === null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOwnItem(items[0].name)
        return
      }
      goTo(items[0].name)
      return
    }
    const request = pending.current
    const changed = previousName.current !== currentName
    previousName.current = currentName
    if (!request || request.name !== currentName) {
      if (controlled && changed) {
        pending.current = null
        activeItem?.focus()
      }
      return
    }
    if (request.target === "invalid") activeItem?.focusInvalid()
    else activeItem?.focus()
    pending.current = null
  }, [activeItem, currentName, controlled, index, items, goTo, total])

  const registerItem = React.useCallback((entry: RegisteredItem) => {
    setRegistered((list) => [...list.filter((e) => e.element !== entry.element && e.name !== entry.name), entry])
    return () => setRegistered((list) => list.filter((e) => e !== entry))
  }, [])

  const goPrevious = React.useCallback(() => {
    if (index <= 0) return
    goTo(items[index - 1].name)
  }, [index, items, goTo])

  const goNext = React.useCallback(() => {
    if (!activeItem || index >= total - 1) return
    if (!activeItem.validate()) {
      activeItem.focusInvalid()
      return
    }
    goTo(items[index + 1].name)
  }, [activeItem, index, items, goTo, total])

  const advance = React.useCallback(() => {
    if (!activeItem) return
    if (!activeItem.validate()) {
      activeItem.focusInvalid()
      return
    }
    if (last) {
      form?.requestSubmit()
      return
    }
    goTo(items[index + 1].name)
  }, [activeItem, index, last, items, form, goTo])

  const skipCurrent = React.useCallback(() => {
    if (!activeItem || activeItem.required) return
    activeItem.skip()
    if (!last) {
      goTo(items[index + 1].name)
      return
    }
    queueMicrotask(() => form?.requestSubmit())
  }, [activeItem, index, last, items, form, goTo])

  function handleReset(event: React.FormEvent<HTMLFormElement>) {
    onReset?.(event)
    if (event.defaultPrevented) return
    for (const entry of registered) entry.reset()
    const target = items.find((entry) => entry.name === defaultItem)?.name ?? items[0]?.name
    if (target) goTo(target)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const failing = items.find((entry) => !entry.validate())
    if (failing) {
      event.preventDefault()
      goTo(failing.name, "invalid")
      if (failing.name === currentName) {
        failing.focusInvalid()
        pending.current = null
      }
      return
    }
    onSubmit?.(event)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      event.keyCode === 229 ||
      !activeItem ||
      !(event.target instanceof Element)
    ) {
      return
    }
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey) {
      event.preventDefault()
      if (!event.repeat) advance()
      return
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return

    if (
      (event.key === "ArrowUp" || event.key === "ArrowDown") &&
      activeItem.moveAnswerFocus(event.target, event.key === "ArrowDown" ? "next" : "previous")
    ) {
      event.preventDefault()
      return
    }

    if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && !isEditable(event.target) && !isRadio(event.target)) {
      event.preventDefault()
      if (event.repeat) return
      if (event.key === "ArrowLeft") goPrevious()
      else if (activeItem.status !== "unanswered") goNext()
      return
    }

    if (event.key === "Enter") {
      const answer = activeItem.getAnswerByElement(event.target)
      if (!answer) return
      event.preventDefault()
      if (!event.repeat && isAnswered(answer)) advance()
      return
    }

    if (!shortcutMode || isEditable(event.target)) return
    const key = normalizeShortcutKey(event.key, shortcutMode)
    const answer = key ? activeItem.getAnswerByShortcut(key) : null
    if (answer) {
      event.preventDefault()
      if (!event.repeat) {
        answer.element.focus()
        if (answer.type === "choice") answer.element.click()
      }
    }
  }

  const state = { current, first, last, total }

  const context = React.useMemo<RootContextValue>(
    () => ({
      current,
      first,
      last,
      total,
      activeItemName: currentName,
      activeItemRequired,
      activeItemStatus,
      domVersion,
      goNext,
      goPrevious,
      nativeValidation,
      registerItem,
      shortcuts: shortcutMode,
      skipCurrent,
    }),
    [
      current,
      first,
      last,
      total,
      currentName,
      activeItemRequired,
      activeItemStatus,
      domVersion,
      goNext,
      goPrevious,
      nativeValidation,
      registerItem,
      shortcutMode,
      skipCurrent,
    ]
  )

  const setRef = React.useCallback(
    (node: HTMLFormElement | null) => {
      setForm(node)
      assignRef(ref, node)
    },
    [ref]
  )

  return {
    context,
    rootProps: {
      "data-shortcuts": shortcutMode ?? undefined,
      onKeyDown: handleKeyDown,
      onReset: handleReset,
      onSubmit: handleSubmit,
      ref: setRef,
    },
    state,
  }
}

// Parts

type RootProps = Omit<React.ComponentPropsWithRef<"form">, "defaultValue" | "value"> & {
  defaultItem?: string
  item?: string
  onItemChange?: (item: string) => void
  shortcuts?: ShortcutMode
}

function Root({
  defaultItem,
  item,
  noValidate = true,
  onItemChange,
  onReset,
  onSubmit,
  ref,
  shortcuts,
  ...props
}: RootProps) {
  const { context, rootProps, state } = useRoot({ defaultItem, item, noValidate, onItemChange, onReset, onSubmit, ref, shortcuts })
  const element = renderPart({
    tag: "form",
    props: mergeProps({ ...rootProps, noValidate }, props),
    state,
  })
  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

function Progress({ children, render, ...props }: Part<"div", ProgressState>) {
  const { current, first, last, total } = useRootContext("Questionnaire progress")
  const text = total ? `Question ${current} of ${total}` : undefined
  return renderPart({
    tag: "div",
    props: mergeProps(
      {
        "aria-label": "Questionnaire progress",
        "aria-live": "polite",
        "aria-valuemax": total || undefined,
        "aria-valuemin": total ? 1 : undefined,
        "aria-valuenow": total ? current : undefined,
        "aria-valuetext": text,
        children: children ?? text,
        role: "progressbar",
      },
      props
    ),
    render,
    state: { current, first, last, total },
  })
}

type ItemProps = Omit<React.ComponentPropsWithRef<"fieldset">, "name" | "value"> & {
  invalid?: boolean
  name: string
  multiple?: boolean
  onStatusChange?: (status: ItemStatus) => void
  required?: boolean
}

function Item({
  "aria-describedby": ariaDescribedBy,
  "aria-keyshortcuts": ariaKeyShortcuts,
  children,
  disabled = false,
  invalid = false,
  multiple = false,
  name,
  onStatusChange,
  ref,
  required = false,
  ...props
}: ItemProps) {
  const { context, itemProps, state } = useItem({
    "aria-describedby": ariaDescribedBy,
    "aria-keyshortcuts": ariaKeyShortcuts,
    disabled,
    invalid,
    multiple,
    name,
    onStatusChange,
    ref,
    required,
  })
  const element = renderPart({
    tag: "fieldset",
    props: mergeProps({ ...itemProps, children }, props),
    state,
    mapping: { active: (value: boolean) => ({ "data-active": value ? "" : undefined }) },
  })
  return <ItemContext.Provider value={context}>{element}</ItemContext.Provider>
}

function Title({ render, ...props }: Part<"legend">) {
  useItemContext("Questionnaire title")
  return renderPart({ tag: "legend", props, render: render as React.ReactElement })
}

function Description({ id, render, ...props }: Part<"p">) {
  const { registerDescription } = useItemContext("Questionnaire description")
  const generated = React.useId()
  const resolved = id ?? generated
  React.useLayoutEffect(() => registerDescription(resolved), [resolved, registerDescription])
  return renderPart({ tag: "p", props: mergeProps({ id: resolved }, props), render: render as React.ReactElement })
}

function Choices({ render, ...props }: Part<"div", { shortcuts: ShortcutMode | null }>) {
  const { shortcuts } = useItemContext("Questionnaire choices")
  return renderPart({ tag: "div", props, render, state: { shortcuts } })
}

type ChoiceProps = Omit<Part<"label", ChoiceState>, "onChange"> & {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

function Choice({ checked, children, defaultChecked = false, disabled = false, onChange, render, value, ...props }: ChoiceProps) {
  const { inputProps, state } = useChoice({ checked, defaultChecked, disabled, onChange, value })
  const element = renderPart({
    tag: "label",
    props: mergeProps({ children }, props),
    render,
    state,
    mapping: checkedMapping,
  })
  return <ChoiceContext.Provider value={{ inputProps, state }}>{element}</ChoiceContext.Provider>
}

type ChoiceInputProps = Omit<
  Part<"input", ChoiceState>,
  "checked" | "defaultChecked" | "disabled" | "name" | "onChange" | "required" | "type" | "value"
>

function ChoiceInput({ render, ...props }: ChoiceInputProps) {
  const { inputProps, state } = useChoiceContext("Questionnaire choice input")
  return renderPart({
    tag: "input",
    props: mergeProps(inputProps as Record<string, unknown>, props),
    render,
    state,
    mapping: checkedMapping,
  })
}

function ChoiceLabel({ render, ...props }: Part<"span">) {
  useChoiceContext("Questionnaire choice label")
  return renderPart({ tag: "span", props, render: render as React.ReactElement })
}

function ChoiceShortcut({ children, render, ...props }: Part<"span", { shortcut: string | null }>) {
  const { state } = useChoiceContext("Questionnaire choice shortcut")
  return renderPart({
    tag: "span",
    props: mergeProps(
      { "aria-hidden": true, children: children ?? state.shortcut, hidden: state.shortcut === null },
      props
    ),
    render,
    state: { shortcut: state.shortcut },
  })
}

type InputType =
  | "date"
  | "datetime-local"
  | "email"
  | "month"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"

type InputProps = Omit<Part<"input", { disabled: boolean; filled: boolean; invalid: boolean }>, "form" | "name" | "type"> & {
  type?: InputType
}

function Input({ defaultValue, disabled = false, onChange, ref, render, type = "text", value, ...props }: InputProps) {
  const { inputProps, state } = useInput({ defaultValue, disabled, onChange, ref, type, value })
  return renderPart({
    tag: "input",
    props: mergeProps(inputProps as Record<string, unknown>, props),
    render,
    state,
    mapping: {
      filled: (filled: boolean) => ({ "data-empty": filled ? undefined : "", "data-filled": filled ? "" : undefined }),
    },
  })
}

function ErrorMessage({ children, id, render, ...props }: Part<"p", { invalid: boolean }>) {
  const { invalid, registerError, required } = useItemContext("Questionnaire error")
  const generated = React.useId()
  const resolved = id ?? generated
  React.useLayoutEffect(() => registerError(resolved), [resolved, registerError])
  return renderPart({
    tag: "p",
    props: mergeProps(
      {
        children: children ?? (required ? "Choose an answer to continue." : "Choose an answer or skip this question."),
        hidden: !invalid,
        id: resolved,
        role: invalid ? "alert" : undefined,
      },
      props
    ),
    render,
    state: { invalid },
  })
}

function NavButton({
  children,
  disabled,
  onClick,
  props,
  render,
  shortcut,
  status,
  tabIndex,
  type,
  visible,
}: {
  children: React.ReactNode
  disabled: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  props: Record<string, unknown>
  render?: React.ReactElement | RenderFn<NavState>
  shortcut?: "Enter"
  status: ItemStatus | null
  tabIndex?: number
  type: "button" | "submit" | "reset"
  visible: boolean
}) {
  const key = visible && !disabled ? (shortcut ?? null) : null
  return renderPart<NavState>({
    tag: "button",
    props: mergeProps(
      {
        "aria-hidden": !visible || undefined,
        "aria-keyshortcuts": key ?? undefined,
        children,
        disabled,
        hidden: !visible,
        inert: !visible,
        onClick,
        tabIndex: visible ? tabIndex : -1,
        type,
      },
      props
    ),
    render,
    state: { disabled, shortcut: key, status, visible },
    mapping: {
      visible: (value: boolean) => ({ "data-hidden": value ? undefined : "", "data-visible": value ? "" : undefined }),
    },
  })
}

type NavProps = Part<"button", NavState>

function Previous({ children, disabled = false, onClick, render, tabIndex, type = "button", ...props }: NavProps) {
  const root = useRootContext("Questionnaire previous")
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    if (!event.defaultPrevented) root.goPrevious()
  }
  return NavButton({
    children: children ?? "Previous",
    disabled,
    onClick: handleClick,
    props,
    render,
    status: root.activeItemStatus,
    tabIndex,
    type,
    visible: root.total > 1 && !root.first,
  })
}

function Skip({ children, disabled = false, onClick, render, tabIndex, type = "button", ...props }: NavProps) {
  const root = useRootContext("Questionnaire skip")
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    if (!event.defaultPrevented) root.skipCurrent()
  }
  return NavButton({
    children: children ?? "Skip",
    disabled,
    onClick: handleClick,
    props,
    render,
    status: root.activeItemStatus,
    tabIndex,
    type,
    visible: root.activeItemRequired === false,
  })
}

function Next({ children, disabled = false, onClick, render, tabIndex, type = "button", ...props }: NavProps) {
  const root = useRootContext("Questionnaire next")
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    if (!event.defaultPrevented) root.goNext()
  }
  return NavButton({
    children: children ?? "Next",
    disabled,
    onClick: handleClick,
    props,
    render,
    shortcut: "Enter",
    status: root.activeItemStatus,
    tabIndex,
    type,
    visible: root.total > 1 && !root.last,
  })
}

function Submit({ children, disabled = false, render, tabIndex, type = "submit", ...props }: NavProps) {
  const root = useRootContext("Questionnaire submit")
  return NavButton({
    children: children ?? "Submit",
    disabled,
    props,
    render,
    shortcut: "Enter",
    status: root.activeItemStatus,
    tabIndex,
    type,
    visible: root.total > 0 && root.last,
  })
}

const QuestionnairePrimitive = {
  Root,
  Progress,
  Item,
  Title,
  Description,
  Choices,
  Choice,
  ChoiceInput,
  ChoiceLabel,
  ChoiceShortcut,
  Input,
  Error: ErrorMessage,
  Previous,
  Skip,
  Next,
  Submit,
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

/** Classes for a button that carries the hover fill: the fill sits under its label. */
const HOVER_FILL_CLASSES =
  "relative isolate overflow-hidden transition-[border-color] duration-400 ease-in-out hover:border-(--hx-primary) hover:bg-(--hx-background) in-data-[theme=dark]:hover:bg-(--hx-input)/30"

/**
 * A hover fill that grows as a circle from where the pointer came in, and shrinks back
 * towards where it left. Put `circle` inside the button, wrap its content in `label`, and
 * call `place` on enter and leave.
 */
function useHoverFill() {
  const [fill, setFill] = React.useState({ x: 0, y: 0, on: false })
  const place = (event: React.PointerEvent<HTMLElement>, on: boolean) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setFill({ x: event.clientX - rect.left, y: event.clientY - rect.top, on })
  }
  const circle = (
    // Wide enough to cover the button from any corner once fully grown.
    <motion.span
      aria-hidden
      className="pointer-events-none absolute -z-10 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--hx-primary)"
      style={{ left: fill.x, top: fill.y }}
      initial={false}
      animate={{ scale: fill.on ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
  )
  const label = (children: React.ReactNode) => <span className="relative">{children}</span>
  return { place, circle, label }
}

/** An outlined button with the hover fill. */
function FillButton({
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { place, circle, label } = useHoverFill()

  return (
    <Button
      variant="outline"
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        place(event, true)
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        place(event, false)
      }}
      className={cn(HOVER_FILL_CLASSES, className)}
      {...props}
    >
      {circle}
      {label(children)}
    </Button>
  )
}

// ---- questionnaire.tsx ----

/** slide-x / slide-y: the next question travels in the direction you move. fade: it fades in place. scale: it grows in. */
type QuestionnaireContent = "slide-x" | "slide-y" | "fade" | "scale" | "none"
type QuestionnaireProgressStyle = "text" | "bar"
/** card: each choice is a box. inline: just the indicator and label. */
type QuestionnaireChoiceLayout = "card" | "inline"
/** fade: background fades in. top: fills from the top. */
type QuestionnaireChoiceHover = "fade" | "top"
/** Roundness of the check indicator, as Tailwind radius names. */
type QuestionnaireIndicatorRounded = "none" | "sm" | "md" | "lg" | "full"

const INDICATOR_ROUNDED: Record<QuestionnaireIndicatorRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
}

type QuestionnaireChoiceColor = "muted" | "primary"
/** check: an empty circle that morphs into a drawn check. radio: a circle with a dot. */
type QuestionnaireChoiceIndicator = "radio" | "check" | "none"

type QuestionnaireMotion = {
  contentAnimation: QuestionnaireContent
  /** How far the question slides, in vw. */
  slideDistance: number
  /** Seconds. */
  duration: number
  bounce: number
  /** Choices rise in one after another. */
  staggerChoices: boolean
  /** Seconds between choices. */
  stagger: number
  progressStyle: QuestionnaireProgressStyle
  /** Shows the question count and bar. */
  showProgress: boolean
  /** Lets a question take more than one answer. */
  multiple: boolean
  choiceColor: QuestionnaireChoiceColor
  choiceIndicator: QuestionnaireChoiceIndicator
  choiceLayout: QuestionnaireChoiceLayout
  choiceHover: QuestionnaireChoiceHover
  /** Boxes the check indicator; off shows just the mark. */
  indicatorBorder: boolean
  indicatorRounded: QuestionnaireIndicatorRounded
}

type QuestionnaireContextValue = QuestionnaireMotion & {
  item: string | null
  /** 1 when moving forward, -1 when going back. */
  direction: number
}

const QuestionnaireContext = React.createContext<QuestionnaireContextValue | null>(null)

function useQuestionnaire() {
  const context = React.useContext(QuestionnaireContext)
  if (!context) throw new Error("Questionnaire parts must be used inside <Questionnaire>.")
  return context
}

// Slow at both ends, so a fade never starts or stops abruptly
const fadeEase = [0.45, 0, 0.25, 1] as const

function useSpring(context: QuestionnaireMotion): Transition {
  const reduceMotion = usePrefersReducedMotion()
  return reduceMotion
    ? { duration: 0 }
    : { type: "spring", duration: context.duration, bounce: context.bounce }
}

function Questionnaire({
  contentAnimation = "slide-x",
  slideDistance = 20,
  duration = 0.4,
  bounce = 0.1,
  staggerChoices = true,
  stagger = 0.05,
  progressStyle = "bar",
  showProgress = true,
  multiple = false,
  choiceColor = "muted",
  choiceIndicator = "check",
  choiceLayout = "card",
  indicatorBorder = false,
  indicatorRounded = "full",
  choiceHover = "fade",
  item: itemProp,
  defaultItem,
  onItemChange,
  className,
  ref,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root> & Partial<QuestionnaireMotion>) {
  const root = React.useRef<HTMLFormElement | null>(null)
  const [own, setOwn] = React.useState<string | null>(defaultItem ?? null)
  const [direction, setDirection] = React.useState(1)
  const item = itemProp ?? own

  const context = React.useMemo(
    () => ({
      contentAnimation, slideDistance, duration, bounce, staggerChoices, stagger, progressStyle, showProgress,
      multiple, choiceColor, choiceIndicator, indicatorBorder, indicatorRounded, choiceLayout, choiceHover, item, direction,
    }),
    [
      contentAnimation, slideDistance, duration, bounce, staggerChoices, stagger, progressStyle, showProgress,
      multiple, choiceColor, choiceIndicator, indicatorBorder, indicatorRounded, choiceLayout, choiceHover, item, direction,
    ]
  )

  return (
    <QuestionnaireContext.Provider value={context}>
      <QuestionnairePrimitive.Root
        data-slot="questionnaire"
        ref={(node) => {
          root.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        defaultItem={defaultItem}
        item={itemProp}
        onItemChange={(next) => {
          // Which way to travel, from where the two questions sit in the form
          const names = [...(root.current?.querySelectorAll<HTMLElement>('[data-slot="questionnaire-item"]') ?? [])].map(
            (el) => el.dataset.name
          )
          const from = item ?? names[0]
          setDirection(names.indexOf(next) >= names.indexOf(from) ? 1 : -1)
          setOwn(next)
          onItemChange?.(next)
        }}
        className={cn("grid w-full min-w-0 grid-cols-1 gap-4", className)}
        {...props}
      />
    </QuestionnaireContext.Provider>
  )
}

// Only the current number rolls up when it changes
function ProgressLabel({ children }: { children: React.ReactNode }) {
  const context = useQuestionnaire()
  const roll = useSpring(context)
  const match = typeof children === "string" ? children.match(/^(\D*)(\d+)(.*)$/) : null
  if (!match) return <>{children}</>
  const [, before, count, after] = match

  return (
    <>
      {before}
      <span className="relative inline-flex overflow-hidden align-bottom">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={count}
            className="block"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={roll}
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </span>
      {after}
    </>
  )
}

function QuestionnaireProgress({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Progress>) {
  const context = useQuestionnaire()
  const fill = useSpring(context)
  if (!context.showProgress) return null
  const text = cn(
    "row-start-1 min-h-[1lh] w-fit min-w-[14ch] text-xs font-medium text-(--hx-muted-foreground) tabular-nums",
    className
  )

  if (context.progressStyle === "text") {
    return (
      <QuestionnairePrimitive.Progress
        data-slot="questionnaire-progress"
        className={text}
        render={(progressProps) => {
          const { children, ...rest } = progressProps
          return <div {...rest}><ProgressLabel>{children as React.ReactNode}</ProgressLabel></div>
        }}
        {...props}
      />
    )
  }

  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      render={(progressProps, state) => {
        const { children, ...rest } = progressProps
        return (
          <div {...rest} className="row-start-1 flex flex-col gap-2">
            <span className={text}><ProgressLabel>{children as React.ReactNode}</ProgressLabel></span>
            <div aria-hidden className="h-1 w-full overflow-hidden rounded-full bg-(--hx-muted)">
              <motion.div
                className="h-full rounded-full bg-(--hx-primary)"
                initial={false}
                animate={{ width: `${state.total ? (state.current / state.total) * 100 : 0}%` }}
                transition={fill}
              />
            </div>
          </div>
        )
      }}
      {...props}
    />
  )
}

function QuestionnaireItem({
  className,
  name,
  children,
  multiple,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  const [node, setNode] = React.useState<HTMLElement | null>(null)
  // The primitive marks the active item from its first render
  const [active, setActive] = React.useState(false)

  React.useLayoutEffect(() => {
    if (!node) return
    const read = () => setActive(node.hasAttribute("data-active"))
    read()
    const observer = new MutationObserver(read)
    observer.observe(node, { attributes: true, attributeFilter: ["data-active"] })
    return () => observer.disconnect()
  }, [node])

  const context = useQuestionnaire()
  const reduceMotion = usePrefersReducedMotion()
  const still = context.contentAnimation === "none" || reduceMotion
  const slideX = context.contentAnimation === "slide-x" && !reduceMotion
  const slideY = context.contentAnimation === "slide-y" && !reduceMotion
  const spring = useSpring(context)

  const controls = useAnimationControls()
  const mounted = React.useRef(false)
  const [wasActive, setWasActive] = React.useState(active)
  const [leaving, setLeaving] = React.useState(false)
  if (active !== wasActive) {
    setWasActive(active)
    setLeaving(!active)
  }

  React.useEffect(() => {
    if (active) {
      controls.set("enter")
      controls.start("center")
    } else if (mounted.current) {
      controls.start("exit")
    }
    mounted.current = true
  }, [active, controls])

  const offset = (d: number) => ({
    opacity: still ? 1 : 0,
    x: slideX ? `${d * context.slideDistance}%` : "0%",
    y: slideY ? `${d * context.slideDistance}%` : "0%",
    scale: context.contentAnimation === "scale" && !reduceMotion ? 0.94 : 1,
  })

  const variants: Variants = {
    enter: (d: number) => offset(d),
    // Leaves the opposite way to the one coming in
    exit: (d: number) => ({
      ...offset(-d),
      transition: still ? { duration: 0 } : { duration: context.duration * 0.7, ease: fadeEase },
    }),
    center: {
      opacity: 1,
      x: "0%",
      y: "0%",
      scale: 1,
      transition: {
        ...(context.contentAnimation === "fade" ? { duration: context.duration, ease: fadeEase } : spring),
        staggerChildren: context.staggerChoices && !reduceMotion ? context.stagger : 0,
        delayChildren: 0.08,
      },
    },
  }

  return (
    <QuestionnairePrimitive.Item
      ref={setNode}
      name={name}
      multiple={multiple ?? context.multiple}
      data-name={name}
      data-slot="questionnaire-item"
      // All items share one cell, so the form keeps the tallest height
      hidden={false}
      className={cn(
        "col-start-1 row-start-2 min-w-0 border-0 p-0 outline-none not-data-active:invisible",
        leaving && "visible!",
        className
      )}
      {...props}
    >
      {/* Padding keeps focus rings inside the clip */}
      <div className="-m-1 overflow-clip p-1">
        <motion.div
          custom={context.direction}
          variants={variants}
          initial={active ? "enter" : "exit"}
          animate={controls}
          onAnimationComplete={(definition) => {
            if (definition === "exit") setLeaving(false)
          }}
          className="flex min-w-0 flex-col gap-4"
        >
          {children}
        </motion.div>
      </div>
    </QuestionnairePrimitive.Item>
  )
}

function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        "font-heading text-xl leading-snug font-medium text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn("text-base text-pretty text-(--hx-muted-foreground)", className)}
      {...props}
    />
  )
}

function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  const { choiceLayout } = useQuestionnaire()

  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn(
        "group/questionnaire-choices grid min-w-0",
        choiceLayout === "inline" ? "gap-1" : "gap-2",
        className
      )}
      {...props}
    />
  )
}

const choiceVariants: Variants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.4, bounce: 0.1 } },
}

function QuestionnaireChoice({
  children,
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) {
  const { choiceColor, choiceIndicator, indicatorBorder, indicatorRounded, choiceLayout, choiceHover, duration } =
    useQuestionnaire()
  const reduceMotion = usePrefersReducedMotion()
  const card = choiceLayout === "card"
  const bare = choiceIndicator === "check" && !indicatorBorder
  const primary = choiceColor === "primary"
  const solid = card && primary
  const hover = card ? choiceHover : "none"
  const layer = cn("pointer-events-none absolute -inset-px -z-10 rounded-[inherit]", primary ? "bg-(--hx-primary)" : "bg-(--hx-muted)")

  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      render={(choiceProps) => (
        <motion.label {...(choiceProps as React.ComponentProps<typeof motion.label>)} variants={choiceVariants}>
          {card && (
            // The border sits under the fills, so a fill meets it exactly
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute -inset-px -z-30 rounded-[inherit] border transition-colors",
                "border-(--hx-input)",
                hover === "fade" &&
                  (primary
                    ? "group-data-checked/questionnaire-choice:border-(--hx-primary)"
                    : "group-data-checked/questionnaire-choice:border-transparent"),
                hover === "fade" &&
                  (primary
                    ? "group-hover/questionnaire-choice:border-(--hx-primary)"
                    : "group-hover/questionnaire-choice:border-transparent"),
                "group-has-[>input:focus-visible]/questionnaire-choice:border-(--hx-ring) group-data-invalid/questionnaire-choice:border-(--hx-destructive)"
              )}
            />
          )}
          {card && (
            // Backgrounds live in a layer, since blended text ignores an element's own
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 -z-20 rounded-[calc(var(--radius-lg)-1px)] bg-(--hx-background) in-data-[theme=dark]:bg-(--hx-input)/20",
                // The wipe layer carries the fill, so the base never tints
                hover !== "top" && "transition-colors",
                hover === "fade" &&
                  (primary
                    ? "group-hover/questionnaire-choice:bg-(--hx-primary)"
                    : "group-hover/questionnaire-choice:bg-(--hx-muted)"),
                hover !== "top" &&
                  (primary
                    ? "group-data-checked/questionnaire-choice:bg-(--hx-primary) in-data-[theme=dark]:group-data-checked/questionnaire-choice:bg-(--hx-primary)"
                    : "group-data-checked/questionnaire-choice:bg-(--hx-muted) in-data-[theme=dark]:group-data-checked/questionnaire-choice:bg-(--hx-muted)")
              )}
            />
          )}
          {hover === "top" && (
            <span
              aria-hidden
              className={cn(
                layer,
                "[clip-path:inset(0_0_100%_0)] transition-[clip-path] duration-300 ease-out group-hover/questionnaire-choice:[clip-path:inset(0)] group-data-checked/questionnaire-choice:[clip-path:inset(0)] motion-reduce:transition-none"
              )}
            />
          )}
          {choiceProps.children as React.ReactNode}
        </motion.label>
      )}
      className={cn(
        "group/questionnaire-choice relative isolate flex cursor-pointer items-center text-start text-base outline-none select-none",
        card
          ? "min-h-14 rounded-lg border border-transparent px-4 py-3"
          : "min-h-9 rounded-none border-b border-(--hx-border) py-2.5 text-(--hx-muted-foreground) transition-colors hover:text-(--hx-foreground) data-checked:font-medium data-checked:text-(--hx-foreground)",
        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none flex shrink-0 items-center overflow-hidden transition-[width,margin-right,opacity] ease-[cubic-bezier(0.45,0,0.25,1)]",
          choiceIndicator === "radio"
            ? "mr-2.5 w-5 opacity-100"
            : "mr-0 w-0 opacity-0",
          choiceIndicator === "check" &&
            "group-data-checked/questionnaire-choice:mr-2.5 group-data-checked/questionnaire-choice:w-5 group-data-checked/questionnaire-choice:opacity-100"
        )}
        style={{ transitionDuration: `${reduceMotion ? 0 : duration}s` }}
      >
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        data-indicator={choiceIndicator}
        className={cn(
          "pointer-events-none relative flex size-5 shrink-0 items-center justify-center rounded-md border border-(--hx-input) bg-(--hx-background) shadow-xs transition-[background-color,border-color,color,border-radius] duration-300 group-hover/questionnaire-choice:border-(--hx-foreground)/40 group-data-checked/questionnaire-choice:border-(--hx-primary) in-data-[theme=dark]:bg-(--hx-input)/30",
          "group-data-checked/questionnaire-choice:bg-(--hx-primary) group-data-checked/questionnaire-choice:text-(--hx-primary-foreground) in-data-[theme=dark]:group-data-checked/questionnaire-choice:bg-(--hx-primary)",
          choiceIndicator === "radio" && "rounded-full",
          choiceIndicator === "check" && INDICATOR_ROUNDED[indicatorRounded],
          solid &&
            "group-data-checked/questionnaire-choice:border-(--hx-primary-foreground) group-data-checked/questionnaire-choice:bg-(--hx-primary-foreground) group-data-checked/questionnaire-choice:text-(--hx-primary) in-data-[theme=dark]:group-data-checked/questionnaire-choice:bg-(--hx-primary-foreground)",
          bare &&
            cn(
              "border-transparent bg-transparent shadow-none group-hover/questionnaire-choice:border-transparent group-data-checked/questionnaire-choice:border-transparent group-data-checked/questionnaire-choice:bg-transparent in-data-[theme=dark]:bg-transparent in-data-[theme=dark]:group-data-checked/questionnaire-choice:bg-transparent",
              solid ? "group-data-checked/questionnaire-choice:text-(--hx-primary-foreground)" : "group-data-checked/questionnaire-choice:text-(--hx-primary)"
            )
        )}
      >
        <span
          data-slot="questionnaire-choice-indicator-dot"
          className={cn(
            "size-2.5 scale-0 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-checked/questionnaire-choice:scale-100 motion-reduce:transition-none",
            solid ? "bg-(--hx-primary)" : "bg-(--hx-primary-foreground)",
            choiceIndicator === "check" && "hidden"
          )}
        />
        <svg
          data-slot="questionnaire-choice-indicator-check"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "hidden size-3.5",
            choiceIndicator === "check" && "block"
          )}
        >
          {/* Draws in when the choice is picked */}
          <path
            d="M4 12.5 9.5 18 20 6.5"
            pathLength={1}
            strokeDasharray={1}
            className="[stroke-dashoffset:1] transition-[stroke-dashoffset] duration-300 ease-out group-data-checked/questionnaire-choice:[stroke-dashoffset:0] motion-reduce:transition-none"
          />
        </svg>
      </span>
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-0.5 leading-snug",
          // Text switches to the fill's foreground while it is picked or hovered
          card && primary && "group-data-checked/questionnaire-choice:text-(--hx-primary-foreground) group-data-checked/questionnaire-choice:[&_[data-slot=questionnaire-choice-description]]:text-(--hx-primary-foreground)/70",
          card && primary && "group-hover/questionnaire-choice:text-(--hx-primary-foreground) group-hover/questionnaire-choice:[&_[data-slot=questionnaire-choice-description]]:text-(--hx-primary-foreground)/70"
        )}
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        className="pointer-events-none ms-2.5 hidden size-5 shrink-0 items-center justify-center rounded-md border border-(--hx-input) bg-(--hx-background) font-mono text-[0.625rem] leading-none font-medium text-(--hx-muted-foreground) group-data-[shortcut]/questionnaire-choice:inline-flex"
      />
    </QuestionnairePrimitive.Choice>
  )
}

function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn("text-(--hx-muted-foreground)", className)}
      {...props}
    />
  )
}

function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative w-full min-w-0"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          "h-12 w-full min-w-0 rounded-lg border border-(--hx-input) bg-transparent px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-(--hx-ring) disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--hx-input)/50 disabled:opacity-50 aria-invalid:border-(--hx-destructive) aria-invalid:ring-3 aria-invalid:ring-(--hx-destructive)/20 in-data-[theme=dark]:bg-(--hx-input)/30 in-data-[theme=dark]:disabled:bg-(--hx-input)/80 in-data-[theme=dark]:aria-invalid:border-(--hx-destructive)/50 in-data-[theme=dark]:aria-invalid:ring-(--hx-destructive)/40",
          "selection:bg-(--hx-primary) selection:text-(--hx-primary-foreground) placeholder:text-(--hx-muted-foreground)",
          className
        )}
        {...props}
      />
    </div>
  )
}

function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn("mt-2 text-sm text-(--hx-destructive)", className)}
      {...props}
    />
  )
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "row-start-3 grid min-h-12 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2",
        className
      )}
      {...props}
    />
  )
}

type ActionVariant = React.ComponentProps<typeof Button>["variant"]
type ActionPointerHandler = (event: React.PointerEvent<HTMLButtonElement>) => void

// The hover fill grows from where the pointer came in
function useActionHover(
  variant: ActionVariant,
  onPointerEnter?: ActionPointerHandler,
  onPointerLeave?: ActionPointerHandler
) {
  const reduceMotion = usePrefersReducedMotion()
  const [fill, setFill] = React.useState({ x: 0, y: 0, on: false })
  const solid = variant === "default"

  const place = (event: React.PointerEvent<HTMLButtonElement>, on: boolean) => {
    const box = event.currentTarget.getBoundingClientRect()
    setFill({ x: event.clientX - box.left, y: event.clientY - box.top, on })
  }

  return {
    className: cn(
      solid ? "hover:bg-(--hx-primary) hover:text-(--hx-foreground)" : "hover:bg-(--hx-background) hover:text-(--hx-primary-foreground) in-data-[theme=dark]:hover:bg-(--hx-input)/30",
      "relative isolate h-11 overflow-hidden px-5 text-base focus-visible:ring-0",
      solid && "border-(--hx-primary)"
    ),
    onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(event)
      place(event, true)
    },
    onPointerLeave: (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(event)
      place(event, false)
    },
    content: (children: React.ReactNode) => (
      <>
        <motion.span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -z-10 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2 rounded-full",
            solid ? "bg-(--hx-background)" : "bg-(--hx-primary)"
          )}
          style={{ left: fill.x, top: fill.y }}
          initial={false}
          animate={{ scale: fill.on ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.65, 0, 0.35, 1] }}
        />
        <span className="relative">{children}</span>
      </>
    ),
  }
}

function QuestionnairePrevious({
  children,
  className,
  size = "default",
  variant = "outline",
  onPointerEnter,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  const hover = useActionHover(variant, onPointerEnter, onPointerLeave)
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-1 row-start-1 justify-self-start",
        hover.className,
        className
      )}
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
      {...props}
    >
      {hover.content(children ?? "Previous")}
    </QuestionnairePrimitive.Previous>
  )
}

function QuestionnaireSkip({
  children,
  className,
  size = "default",
  variant = "outline",
  onPointerEnter,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  const hover = useActionHover(variant, onPointerEnter, onPointerLeave)
  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-2 row-start-1 justify-self-end",
        hover.className,
        className
      )}
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
      {...props}
    >
      {hover.content(children ?? "Skip")}
    </QuestionnairePrimitive.Skip>
  )
}

function QuestionnaireNext({
  children,
  className,
  size = "default",
  variant = "default",
  onPointerEnter,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  const hover = useActionHover(variant, onPointerEnter, onPointerLeave)
  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-3 row-start-1 justify-self-end",
        hover.className,
        className
      )}
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
      {...props}
    >
      {hover.content(children ?? "Next")}
    </QuestionnairePrimitive.Next>
  )
}

function QuestionnaireSubmit({
  children,
  className,
  size = "default",
  variant = "default",
  onPointerEnter,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Submit> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  const hover = useActionHover(variant, onPointerEnter, onPointerLeave)
  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-3 row-start-1 justify-self-end",
        hover.className,
        className
      )}
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
      {...props}
    >
      {hover.content(children ?? "Submit")}
    </QuestionnairePrimitive.Submit>
  )
}

// ---- demo: questionnaire-demo.tsx ----

const questions = [
  {
    name: "role",
    title: "Your role",
    labels: { designer: "Designer", developer: "Developer", product: "Product manager", other: "Something else" },
  },
  {
    name: "tools",
    title: "Weekly tools",
    labels: { figma: "Figma", github: "GitHub", linear: "Linear", notion: "Notion" },
  },
  { name: "feedback", title: "Feedback", labels: {} },
] as { name: string; title: string; labels: Record<string, string> }[]

type Answer = { title: string; values: string[] }

const controls = {
  contentAnimation: {
    group: "Content",
    type: "select",
    label: "Content animation",
    value: "slide-x",
    options: [
      { label: "Slide (x axis)", value: "slide-x" },
      { label: "Slide (y axis)", value: "slide-y" },
      { label: "Fade", value: "fade" },
      { label: "Scale", value: "scale" },
      { label: "None", value: "none" },
    ],
  },
  slideDistance: {
    disabled: (v: Record<string, unknown>) => v.contentAnimation !== "slide-x" && v.contentAnimation !== "slide-y",
    group: "Content",
    type: "slider",
    label: "Slide distance",
    value: 20,
    min: 0,
    max: 50,
    step: 1,
    unit: "%",
  },
  choiceLayout: {
    group: "Choices",
    type: "select",
    label: "Layout",
    value: "card",
    options: [
      { label: "Cards", value: "card" },
      { label: "Inline radio", value: "inline" },
    ],
  },
  choiceHover: {
    group: "Choices",
    type: "select",
    label: "Choice hover",
    value: "top",
    options: [
      { label: "Fade", value: "fade" },
      { label: "Fill from top", value: "top" },
    ],
  },
  choiceColor: {
    group: "Choices",
    type: "select",
    label: "Selected color",
    value: "primary",
    options: [
      { label: "Muted", value: "muted" },
      { label: "Primary", value: "primary" },
    ],
  },
  indicatorRounded: {
    disabled: (v: Record<string, unknown>) => v.choiceIndicator !== "check",
    group: "Choices",
    type: "select",
    label: "Icon roundness",
    value: "full",
    options: [
      { label: "None", value: "none" },
      { label: "sm", value: "sm" },
      { label: "md", value: "md" },
      { label: "lg", value: "lg" },
      { label: "Full", value: "full" },
    ],
  },
  indicatorBorder: { disabled: (v: Record<string, unknown>) => v.choiceIndicator !== "check", group: "Choices", type: "checkbox", label: "Icon border", value: false },
  choiceIndicator: {
    group: "Choices",
    type: "select",
    label: "Indicator",
    value: "check",
    options: [
      { label: "Check icon", value: "check" },
      { label: "Radio", value: "radio" },
      { label: "None", value: "none" },
    ],
  },
  bordered: { group: "Border", type: "checkbox", label: "Show border", value: false },
  multiple: { group: "Choices", type: "checkbox", label: "Choose multiple", value: false },
  staggerChoices: { group: "Choices", type: "checkbox", label: "Stagger choices", value: true },
  stagger: {
    disabled: (v: Record<string, unknown>) => !v.staggerChoices,
    group: "Choices",
    type: "slider",
    label: "Stagger",
    value: 0.05,
    min: 0,
    max: 0.2,
    step: 0.01,
    unit: "s",
  },
  showProgress: { group: "Progress", type: "checkbox", label: "Show progress", value: true },
  shortcuts: {
    group: "Progress",
    type: "select",
    label: "Choice keys",
    value: "off",
    options: [
      { label: "Letters (A, B, C)", value: "letters" },
      { label: "Numbers (1, 2, 3)", value: "numbers" },
      { label: "Off", value: "off" },
    ],
  },
  duration: {
    disabled: (v: Record<string, unknown>) => v.contentAnimation === "none",
    group: "Motion",
    type: "slider",
    label: "Duration",
    value: 0.4,
    min: 0.1,
    max: 1,
    step: 0.05,
    unit: "s",
  },
  bounce: {
    disabled: (v: Record<string, unknown>) => v.contentAnimation === "fade" || v.contentAnimation === "none",
    group: "Motion",
    type: "slider",
    label: "Bounce",
    value: 0.1,
    min: 0,
    max: 0.6,
    step: 0.05,
  },
}

function QuestionnaireDemo(props: Partial<ControlValues>) {
  const panel = useDemoControls(props)
  const { values } = panel
  const [answers, setAnswers] = React.useState<Answer[] | null>(null)
  const [round, setRound] = React.useState(0)

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "flex min-h-96 flex-col justify-start rounded-lg border px-12 py-8 max-md:px-4",
          !values.bordered && "border-transparent"
        )}
      >
        {answers ? (
          <div className="flex flex-col items-start gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Thanks, that&apos;s everything</h2>
              <p className="text-lg text-(--hx-muted-foreground)">Your answers are in.</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-lg font-medium">You chose:</p>
              <ul className="flex flex-col gap-2 text-lg">
                {answers.map((answer) => (
                  <li key={answer.title} className="flex gap-2">
                    <span className="text-(--hx-muted-foreground)">{answer.title}:</span>
                    <span>{answer.values.join(", ")}</span>
                  </li>
                ))}
              </ul>
            </div>
            <FillButton
              className="h-11 px-5 text-base"
              onClick={() => {
                setAnswers(null)
                setRound((r) => r + 1)
              }}
            >
              Start again
            </FillButton>
          </div>
        ) : (
          <Questionnaire
            key={round}
            shortcuts={values.shortcuts === "off" ? undefined : (values.shortcuts as "letters" | "numbers")}
            contentAnimation={values.contentAnimation as QuestionnaireContent}
            slideDistance={values.slideDistance}
            duration={values.duration}
            bounce={values.bounce}
            multiple={values.multiple}
            choiceLayout={values.choiceLayout as QuestionnaireChoiceLayout}
            choiceHover={values.choiceHover as QuestionnaireChoiceHover}
            choiceColor={values.choiceColor as QuestionnaireChoiceColor}
            indicatorRounded={values.indicatorRounded as QuestionnaireIndicatorRounded}
            indicatorBorder={values.indicatorBorder}
            choiceIndicator={values.choiceIndicator as QuestionnaireChoiceIndicator}
            staggerChoices={values.staggerChoices}
            stagger={values.stagger}
            showProgress={values.showProgress}
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              setAnswers(
                questions.flatMap(({ name, title, labels }) => {
                  const values = data
                    .getAll(name)
                    .map((value) => labels[String(value)] ?? String(value))
                    .filter(Boolean)
                  return values.length ? [{ title, values }] : []
                })
              )
            }}
          >
            <QuestionnaireProgress />

            <QuestionnaireItem name="role" required>
              <QuestionnaireTitle>What best describes your role?</QuestionnaireTitle>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="designer">Designer</QuestionnaireChoice>
                <QuestionnaireChoice value="developer">Developer</QuestionnaireChoice>
                <QuestionnaireChoice value="product">
                  Product manager
                  <QuestionnaireChoiceDescription>Owns the roadmap and priorities</QuestionnaireChoiceDescription>
                </QuestionnaireChoice>
                <QuestionnaireChoice value="other">Something else</QuestionnaireChoice>
              </QuestionnaireChoices>
              <QuestionnaireError />
            </QuestionnaireItem>

            <QuestionnaireItem name="tools">
              <QuestionnaireTitle>Which tools do you use every week?</QuestionnaireTitle>
              <QuestionnaireDescription>Pick as many as you like, or skip.</QuestionnaireDescription>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="figma">Figma</QuestionnaireChoice>
                <QuestionnaireChoice value="github">GitHub</QuestionnaireChoice>
                <QuestionnaireChoice value="linear">Linear</QuestionnaireChoice>
                <QuestionnaireChoice value="notion">Notion</QuestionnaireChoice>
              </QuestionnaireChoices>
            </QuestionnaireItem>

            <QuestionnaireItem name="feedback">
              <QuestionnaireTitle>Anything you&apos;d like us to know?</QuestionnaireTitle>
              <QuestionnaireDescription>A sentence is plenty.</QuestionnaireDescription>
              <QuestionnaireInput placeholder="Type your answer…" />
            </QuestionnaireItem>

            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireSkip />
              <QuestionnaireNext />
              <QuestionnaireSubmit />
            </QuestionnaireActions>
          </Questionnaire>
        )}
      </div>
      <p className="text-center text-sm text-(--hx-muted-foreground) max-lg:hidden">
        Tip: press a choice&apos;s letter to pick it, Enter to continue, and ← to go back.
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

export interface AnimatedQuestionnaireProps extends Partial<ControlValues> {
  theme?: AnimatedQuestionnaireTheme;
  mode?: AnimatedQuestionnaireMode;
  className?: string;
}

export default function AnimatedQuestionnaire({ theme = "spotify", mode = "dark", className, ...props }: AnimatedQuestionnaireProps) {
  const themed = themeProps(theme, mode);
  return (
    <ThemeContext.Provider value={themed}>
      <div {...themed} className={cn("w-full text-(--hx-foreground) [:where(&,&_*)]:border-(--hx-border) [:where(&,&_*)]:outline-(--hx-ring)/50", className)}>
        <ReducedMotionConfig>
          <QuestionnaireDemo {...props} />
        </ReducedMotionConfig>
      </div>
    </ThemeContext.Provider>
  );
}

export {
  themeProps as getThemeProps,
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  type QuestionnaireChoiceHover,
  type QuestionnaireChoiceLayout,
  type QuestionnaireChoiceColor,
  type QuestionnaireChoiceIndicator,
  type QuestionnaireContent,
  type QuestionnaireIndicatorRounded,
  type QuestionnaireProgressStyle,
};
