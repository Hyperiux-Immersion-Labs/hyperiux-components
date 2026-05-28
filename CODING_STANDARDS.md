# Coding Standards — Hyperiux Components

> **Who is this for?** Any dev (including AI agents) writing or reviewing code in this repo.
> **Why does it exist?** So every component feels like the same person wrote it.

---

## Core Principles

1. **Readable > Clever** — If you need 10 seconds to understand a line, rewrite it.
2. **Name things clearly** — Variables describe *what* they are, not where they came from.
3. **Comments explain *why*, not *what*** — Code shows what. Comments explain intent.
4. **Dead code is noise** — Unused variables, attributes, and handlers must be removed before merging.
5. **Don't repeat yourself** — Extract any logic that appears more than twice.
6. **CSS via layout semantics** — Use `gap`, `flex-col`, `space-y` over `mb-*`/`mt-*` for spacing between siblings.

---

## 1. File Structure

Every component file should follow this top-to-bottom order:

```
"use client" (if needed)

Imports

──── Constants ────────────────
Module-level constants (sentinel values, speeds, magic numbers)

──── Shaders / Templates ──────
GLSL strings, template literals, static data that doesn't change

──── Types / PropTypes ────────
(if used)

──── Component ────────────────
export default function ...

  ── State & Refs
  ── Effects (with internal sections commented)
  ── Derived values (stats, computed lists)
  ── Return (JSX)
```

Use simple one-line section comments inside long functions:

```js
// Renderer and scene
// Mouse state
// Grid layout
// Animation loop
// Cleanup
```

Keep section headers consistent and plain.

---

## 2. Naming Conventions

### Variables

| Pattern | Use for |
|---------|---------|
| `SCREAMING_SNAKE_CASE` | Module-level constants, sentinel values, speeds |
| `camelCase` | Everything else |
| `_prefixedColor` | Three.js `Color` objects derived from a prop (e.g., `_webColor`) |
| `onEventName` | All event handlers (`onMove`, `onEnter`, `onResize`) |

### Magic Numbers → Named Constants

**Bad:**
```js
const mouse = new THREE.Vector2(-9999, -9999);
if (smoothMouse.x > -9000) { ... }
```

**Good:**
```js
const MOUSE_OFFSCREEN = -9999;
const MOUSE_THRESHOLD = -9000; // anything above this = mouse is on screen

const mouse = new THREE.Vector2(MOUSE_OFFSCREEN, MOUSE_OFFSCREEN);
if (smoothMouse.x > MOUSE_THRESHOLD) { ... }
```

> Put all constants at the top of the file, **outside** any function or effect.

### Booleans

Name them as questions:

```js
// Bad
let mouseState = false;

// Good
let mousePresent    = false;
let mouseJustEntered = false;
```

---

## 3. Functions & Helpers

### Extract repeated guards

If the same condition check appears more than twice, extract it:

**Bad:**
```js
const onMove  = (e) => { if (window.innerWidth < 768) return; ... };
const onEnter = (e) => { if (window.innerWidth < 768) return; ... };
const onLeave = ()  => { if (window.innerWidth < 768) return; ... };
```

**Good:**
```js
const isDesktop = () => window.innerWidth >= 768;

const onMove  = (e) => { if (!isDesktop()) return; ... };
const onEnter = (e) => { if (!isDesktop()) return; ... };
const onLeave = ()  => { if (!isDesktop()) return; ... };
```

### Prefer early returns over deep nesting

**Bad:**
```js
for (let i = 0; i < count; i++) {
  if (d < threshold) {
    // 10 lines of logic...
  }
}
```

**Good:**
```js
for (let i = 0; i < count; i++) {
  if (d >= threshold) continue; // skip anything outside range
  // 10 lines of logic, now at a flat level
}
```

### Name all inline functions

Event listeners especially — named functions can be properly removed in cleanup.

**Bad:**
```js
mount.addEventListener("touchend", () => {
  mousePresent = false;
  setActive(false);
});
// Can't remove this in cleanup!
```

**Good:**
```js
const onTouchEnd = () => {
  mousePresent = false;
  setActive(false);
};
mount.addEventListener("touchend", onTouchEnd);

// In cleanup:
mount.removeEventListener("touchend", onTouchEnd);
```

---

## 4. GLSL / Shaders

### Always extract to named constants

GLSL strings belong **outside** the component function, at module level. Inline shaders inside `ShaderMaterial` make the file unreadable.

**Bad:**
```js
const mat = new THREE.ShaderMaterial({
  vertexShader: `
    uniform float uSize;
    void main() { ... }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    void main() { ... }
  `,
});
```

**Good:**
```js
// At module level, before the component:
const MY_VERT = /* glsl */ `
  uniform float uSize;

  void main() {
    ...
  }
`;

const MY_FRAG = /* glsl */ `
  uniform vec3 uColor;

  void main() {
    ...
  }
`;

// Inside the component:
const mat = new THREE.ShaderMaterial({
  vertexShader:   MY_VERT,
  fragmentShader: MY_FRAG,
});
```

### Name shaders descriptively

| Pattern | Example |
|---------|---------|
| `THING_VERT` | `PARTICLE_VERT`, `CURSOR_VERT` |
| `THING_FRAG` | `POINT_FRAG`, `LINE_FRAG` |
| Shared fragment | `POINT_FRAG` (used by both particle and cursor mat) |

### The `/* glsl */` tag

Always add the `/* glsl */` comment before the template literal — editors and plugins use this for GLSL syntax highlighting.

### GLSL formatting

- 2-space indent inside GLSL
- Align `uniform` declarations:
  ```glsl
  uniform float uSize;
  uniform vec2  uMouse;
  uniform float uSpotlightRadius;
  ```
- One blank line between declarations and `void main()`

---

## 5. CSS / Tailwind

### Spacing between siblings → `gap`, not `mb-*`/`mt-*`

**Bad:**
```jsx
<div>
  <h1 className="mb-2">Title</h1>
  <p className="mt-1">Subtitle</p>
</div>
```

**Good:**
```jsx
<div className="flex flex-col gap-2">
  <h1>Title</h1>
  <p>Subtitle</p>
</div>
```

> `gap` lives on the parent, not the children. It's the flex/grid equivalent of `space-between`.

### Keep class names inline

Prefer inline `className` strings in JSX. Do not extract Tailwind class lists into separate constants unless there is a strong reason beyond readability.

### When to use `mb-*`/`mt-*`

Only when the element is **not** inside a flex/grid parent, or when you need asymmetric spacing that `gap` can't express.

### Use `vw`, not `px`

Do not use `px` units in component styling. Use `vw` for sizing, spacing, radii, offsets, and arbitrary Tailwind values across desktop, tablet, and mobile.

**Bad:**
```jsx
className="px-[24px] rounded-[18px] gap-[12px]"
```

**Good:**
```jsx
className="px-[1.7vw] rounded-[1.3vw] gap-[0.8vw]"
```

### Limit arbitrary values to 1 decimal place

When using decimal values in Tailwind arbitrary classes, do not go beyond **1 decimal place**.

**Bad:**
```jsx
className="px-[1.67vw] rounded-[1.33vw] gap-[0.78vw]"
```

**Good:**
```jsx
className="px-[1.7vw] rounded-[1.3vw] gap-[0.8vw]"
```

### Remove redundant wrappers

**Bad:**
```jsx
<div className="text-center">
  <div className="text-center"> {/* redundant */}
    ...
  </div>
</div>
```

**Good:**
```jsx
<div className="flex flex-col items-center">
  ...
</div>
```

### Semantic elements in JSX

Use `<span>` for inline text nodes inside flex containers, not `<div>`:

```jsx
// Bad — div inside flex, no block content
<div className="text-sm text-white/50">{label}</div>

// Good
<span className="text-sm text-white/50">{label}</span>
```

### Avoid HTML entities in JSX

**Bad:**
```jsx
{x}&nbsp;·&nbsp;{y}
```

**Good:**
```jsx
{x} · {y}
```

JSX handles Unicode directly. Use real characters.

---

## 6. React Patterns

### useEffect — keep lifecycle together

For Three.js or canvas effects, **keep the entire setup inside one `useEffect`**. Do not split it across multiple effects.

The sequential nature of WebGL setup (renderer → scene → geometry → material → add to scene → animate → cleanup) is a single lifecycle. Splitting it creates confusion about initialization order.

### Cleanup — always remove what you added

Every `addEventListener` needs a corresponding `removeEventListener` in the cleanup function. Every Three.js object needs `.dispose()`.

```js
return () => {
  cancelAnimationFrame(animId);
  window.removeEventListener("resize", onResize);
  mount.removeEventListener("mousemove",  onMove);
  mount.removeEventListener("mouseenter", onEnter);
  mount.removeEventListener("mouseleave", onLeave);
  mount.removeEventListener("touchmove",  onTouch);
  mount.removeEventListener("touchend",   onTouchEnd); // ← named, so it can be removed

  if (mount.contains(renderer.domElement)) {
    mount.removeChild(renderer.domElement);
  }

  renderer.dispose();
  geometry.dispose();
  material.dispose();
};
```

### State vs refs for animation

| Data | Use |
|------|-----|
| Values that drive React re-renders (active state, cursor position display) | `useState` |
| Values only read inside `requestAnimationFrame` loop (alpha, smooth positions) | Plain `let` variables inside `useEffect` |

Never put animation-tick values in `useState` — it causes unnecessary re-renders every frame.

### Dependency arrays

Always list every prop/state used inside a `useEffect` in the dep array. If the effect depends on a color prop, that prop goes in the array.

---

## 7. Comments

### Keep comments that explain *why*

```js
// instant snap — avoids lerp drift from previous position
smoothMouse.copy(mouse);

// Alpha is encoded per-vertex in RGB (additive blending, no real alpha channel)
mouseLineColors[si + 3] = _webColor.r * alpha;
```

### Remove comments that restate the code

```js
// Bad — this is obvious from the code
// Set mouse present to true
mousePresent = true;

// Bad — leftover dev note
let mouseJustEntered = false; // <-- NEW: snap flag
```

### Section headers in long functions

Use the divider style for sections longer than ~10 lines:

```js
// ─── Grid Layout ──
```

---

## 8. Before You Commit — Checklist

- [ ] No unused variables, imports, or `console.log`
- [ ] All magic numbers are named constants
- [ ] All event listeners have named handler functions
- [ ] All named handlers are removed in cleanup
- [ ] GLSL strings are at module level, not inline
- [ ] No duplicate logic that could be a helper function
- [ ] CSS: `gap` used for sibling spacing, not `mb-*`/`mt-*` chains
- [ ] No redundant wrapper divs
- [ ] Comments explain *why*, not *what*
- [ ] No HTML entities (`&nbsp;`) where Unicode works fine

# Coding Standards — Hyperiux Components

> **Who is this for?** Any dev (including AI agents) writing or reviewing code in this repo.
> **Why does it exist?** So every component feels like the same person wrote it.

---

## Core Principles

1. **Readable > Clever** — If you need 10 seconds to understand a line, rewrite it.
2. **Name things clearly** — Variables describe *what* they are, not where they came from.
3. **Comments explain *why*, not *what*** — Code shows what. Comments explain intent.
4. **Dead code is noise** — Unused variables, attributes, and handlers must be removed before merging.
5. **Don't repeat yourself** — Extract any logic that appears more than twice.
6. **CSS via layout semantics** — Use `gap`, `flex-col`, `space-y` over `mb-*`/`mt-*` for spacing between siblings.

---

## 1. File Structure

Every component file should follow this top-to-bottom order:

```
"use client" (if needed)

Imports

──── Constants ────────────────
Module-level constants (sentinel values, speeds, magic numbers)

──── Shaders / Templates ──────
GLSL strings, template literals, static data that doesn't change

──── Types / PropTypes ────────
(if used)

──── Component ────────────────
export default function ...

  ── State & Refs
  ── Effects (with internal sections commented)
  ── Derived values (stats, computed lists)
  ── Return (JSX)
```

**Section dividers** inside long functions (like a `useEffect` with Three.js):

```js
// ─── Renderer & Scene ──────────────────────────────────────────────────────
// ─── Mouse State ───────────────────────────────────────────────────────────
// ─── Grid Layout ───────────────────────────────────────────────────────────
// ─── Animation Loop ────────────────────────────────────────────────────────
// ─── Cleanup ───────────────────────────────────────────────────────────────
```

Use `─` (U+2500) to draw the line. Keep section headers consistent.

---

## 2. Naming Conventions

### Variables

| Pattern | Use for |
|---------|---------|
| `SCREAMING_SNAKE_CASE` | Module-level constants, sentinel values, speeds |
| `camelCase` | Everything else |
| `_prefixedColor` | Three.js `Color` objects derived from a prop (e.g., `_webColor`) |
| `onEventName` | All event handlers (`onMove`, `onEnter`, `onResize`) |

### Magic Numbers → Named Constants

**Bad:**
```js
const mouse = new THREE.Vector2(-9999, -9999);
if (smoothMouse.x > -9000) { ... }
```

**Good:**
```js
const MOUSE_OFFSCREEN = -9999;
const MOUSE_THRESHOLD = -9000; // anything above this = mouse is on screen

const mouse = new THREE.Vector2(MOUSE_OFFSCREEN, MOUSE_OFFSCREEN);
if (smoothMouse.x > MOUSE_THRESHOLD) { ... }
```

> Put all constants at the top of the file, **outside** any function or effect.

### Booleans

Name them as questions:

```js
// Bad
let mouseState = false;

// Good
let mousePresent    = false;
let mouseJustEntered = false;
```

---

## 3. Functions & Helpers

### Extract repeated guards

If the same condition check appears more than twice, extract it:

**Bad:**
```js
const onMove  = (e) => { if (window.innerWidth < 768) return; ... };
const onEnter = (e) => { if (window.innerWidth < 768) return; ... };
const onLeave = ()  => { if (window.innerWidth < 768) return; ... };
```

**Good:**
```js
const isDesktop = () => window.innerWidth >= 768;

const onMove  = (e) => { if (!isDesktop()) return; ... };
const onEnter = (e) => { if (!isDesktop()) return; ... };
const onLeave = ()  => { if (!isDesktop()) return; ... };
```

### Prefer early returns over deep nesting

**Bad:**
```js
for (let i = 0; i < count; i++) {
  if (d < threshold) {
    // 10 lines of logic...
  }
}
```

**Good:**
```js
for (let i = 0; i < count; i++) {
  if (d >= threshold) continue; // skip anything outside range
  // 10 lines of logic, now at a flat level
}
```

### Name all inline functions

Event listeners especially — named functions can be properly removed in cleanup.

**Bad:**
```js
mount.addEventListener("touchend", () => {
  mousePresent = false;
  setActive(false);
});
// Can't remove this in cleanup!
```

**Good:**
```js
const onTouchEnd = () => {
  mousePresent = false;
  setActive(false);
};
mount.addEventListener("touchend", onTouchEnd);

// In cleanup:
mount.removeEventListener("touchend", onTouchEnd);
```

---

## 4. GLSL / Shaders

### Always extract to named constants

GLSL strings belong **outside** the component function, at module level. Inline shaders inside `ShaderMaterial` make the file unreadable.

**Bad:**
```js
const mat = new THREE.ShaderMaterial({
  vertexShader: `
    uniform float uSize;
    void main() { ... }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    void main() { ... }
  `,
});
```

**Good:**
```js
// At module level, before the component:
const MY_VERT = /* glsl */ `
  uniform float uSize;

  void main() {
    ...
  }
`;

const MY_FRAG = /* glsl */ `
  uniform vec3 uColor;

  void main() {
    ...
  }
`;

// Inside the component:
const mat = new THREE.ShaderMaterial({
  vertexShader:   MY_VERT,
  fragmentShader: MY_FRAG,
});
```

### Name shaders descriptively

| Pattern | Example |
|---------|---------|
| `THING_VERT` | `PARTICLE_VERT`, `CURSOR_VERT` |
| `THING_FRAG` | `POINT_FRAG`, `LINE_FRAG` |
| Shared fragment | `POINT_FRAG` (used by both particle and cursor mat) |

### The `/* glsl */` tag

Always add the `/* glsl */` comment before the template literal — editors and plugins use this for GLSL syntax highlighting.

### GLSL formatting

- 2-space indent inside GLSL
- Align `uniform` declarations:
  ```glsl
  uniform float uSize;
  uniform vec2  uMouse;
  uniform float uSpotlightRadius;
  ```
- One blank line between declarations and `void main()`

---

## 5. CSS / Tailwind

### Spacing between siblings → `gap`, not `mb-*`/`mt-*`

**Bad:**
```jsx
<div>
  <h1 className="mb-2">Title</h1>
  <p className="mt-1">Subtitle</p>
</div>
```

**Good:**
```jsx
<div className="flex flex-col gap-2">
  <h1>Title</h1>
  <p>Subtitle</p>
</div>
```

> `gap` lives on the parent, not the children. It's the flex/grid equivalent of `space-between`.

### When to use `mb-*`/`mt-*`

Only when the element is **not** inside a flex/grid parent, or when you need asymmetric spacing that `gap` can't express.

### Remove redundant wrappers

**Bad:**
```jsx
<div className="text-center">
  <div className="text-center"> {/* redundant */}
    ...
  </div>
</div>
```

**Good:**
```jsx
<div className="flex flex-col items-center">
  ...
</div>
```

### Semantic elements in JSX

Use `<span>` for inline text nodes inside flex containers, not `<div>`:

```jsx
// Bad — div inside flex, no block content
<div className="text-sm text-white/50">{label}</div>

// Good
<span className="text-sm text-white/50">{label}</span>
```

### Avoid HTML entities in JSX

**Bad:**
```jsx
{x}&nbsp;·&nbsp;{y}
```

**Good:**
```jsx
{x} · {y}
```

JSX handles Unicode directly. Use real characters.

---

## 6. React Patterns

### useEffect — keep lifecycle together

For Three.js or canvas effects, **keep the entire setup inside one `useEffect`**. Do not split it across multiple effects.

The sequential nature of WebGL setup (renderer → scene → geometry → material → add to scene → animate → cleanup) is a single lifecycle. Splitting it creates confusion about initialization order.

### Cleanup — always remove what you added

Every `addEventListener` needs a corresponding `removeEventListener` in the cleanup function. Every Three.js object needs `.dispose()`.

```js
return () => {
  cancelAnimationFrame(animId);
  window.removeEventListener("resize", onResize);
  mount.removeEventListener("mousemove",  onMove);
  mount.removeEventListener("mouseenter", onEnter);
  mount.removeEventListener("mouseleave", onLeave);
  mount.removeEventListener("touchmove",  onTouch);
  mount.removeEventListener("touchend",   onTouchEnd); // ← named, so it can be removed

  if (mount.contains(renderer.domElement)) {
    mount.removeChild(renderer.domElement);
  }

  renderer.dispose();
  geometry.dispose();
  material.dispose();
};
```

### State vs refs for animation

| Data | Use |
|------|-----|
| Values that drive React re-renders (active state, cursor position display) | `useState` |
| Values only read inside `requestAnimationFrame` loop (alpha, smooth positions) | Plain `let` variables inside `useEffect` |

Never put animation-tick values in `useState` — it causes unnecessary re-renders every frame.

### Dependency arrays

Always list every prop/state used inside a `useEffect` in the dep array. If the effect depends on a color prop, that prop goes in the array.

---

## 7. Comments

### Keep comments that explain *why*

```js
// instant snap — avoids lerp drift from previous position
smoothMouse.copy(mouse);

// Alpha is encoded per-vertex in RGB (additive blending, no real alpha channel)
mouseLineColors[si + 3] = _webColor.r * alpha;
```

### Remove comments that restate the code

```js
// Bad — this is obvious from the code
// Set mouse present to true
mousePresent = true;

// Bad — leftover dev note
let mouseJustEntered = false; // <-- NEW: snap flag
```

### Section headers in long functions

Use the divider style for sections longer than ~10 lines:

```js
// ─── Grid Layout ───────────────────────────────────────────────────────────
```

---

## 8. Before You Commit — Checklist

- [ ] No unused variables, imports, or `console.log`
- [ ] All magic numbers are named constants
- [ ] All event listeners have named handler functions
- [ ] All named handlers are removed in cleanup
- [ ] GLSL strings are at module level, not inline
- [ ] No duplicate logic that could be a helper function
- [ ] CSS: `gap` used for sibling spacing, not `mb-*`/`mt-*` chains
- [ ] No redundant wrapper divs
- [ ] Comments explain *why*, not *what*
- [ ] No HTML entities (`&nbsp;`) where Unicode works fine
