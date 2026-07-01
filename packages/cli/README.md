# Hyperiux Vault

[![npm version](https://img.shields.io/npm/v/hyperiux.svg?style=flat-square&color=ff5f00)](https://www.npmjs.com/package/hyperiux)
[![npm downloads](https://img.shields.io/npm/dm/hyperiux.svg?style=flat-square&color=777777)](https://www.npmjs.com/package/hyperiux)
![CI](https://github.com/Hyperiux-Immersion-Labs/hyperiux-components/actions/workflows/ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**A collection of high-quality animation effects and interactive components for Next.js — designed by [Hyperiux](https://hyperiux.com).**

32 free effects are open source and install instantly. 83 pro effects are available with a [Pro subscription](https://vault.hyperiux.com/pricing). The CLI copies source code directly into your project — you own what you install.

---

## Quick Start

### 1. Initialize your project

```bash
npx hyperiux init
```

This creates a `hyperiux.json` config at your project root that tells the CLI where to install files and how your project is structured.

### 2. Add a free effect

```bash
npx hyperiux add overflow-stagger-text
```

### 3. Use it

```jsx
import OverflowStaggerText from "@/components/effects/overflow-stagger-text";

export default function Page() {
  return (
    <OverflowStaggerText delay={0.2} stagger={0.03}>
      Motion-first design, shipped fast.
    </OverflowStaggerText>
  );
}
```

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Text content to animate |
| `animateOnScroll` | `boolean` | `true` | Trigger on scroll instead of on mount |
| `delay` | `number` | `0` | Seconds before animation starts |
| `stagger` | `number` | `0.03` | Delay between each character |
| `scrub` | `boolean` | `true` | Tie animation progress to scroll position |
| `start` | `string` | `"top 90%"` | ScrollTrigger start position |
| `end` | `string` | `"bottom 60%"` | ScrollTrigger end position |
| `className` | `string` | `""` | Class applied to the wrapper element |

---

## CLI Commands

| Command | Description |
|---|---|
| `npx hyperiux init` | Initialize config in your project |
| `npx hyperiux add <effect>` | Add an effect to your project |
| `npx hyperiux list` | List all available effects |
| `npx hyperiux login` | Connect your Pro account |
| `npx hyperiux logout` | Remove saved credentials |
| `npx hyperiux whoami` | Show current login status |

### Options for `add`

| Flag | Description |
|---|---|
| `--overwrite` | Overwrite existing files |
| `--yes` | Skip confirmation prompts |
| `--dry-run` | Preview what would be installed without writing files |

---

## Free Effects

All 32 free effects install without an account. Browse and preview them at [vault.hyperiux.com/effects](https://vault.hyperiux.com/effects).

```bash
npx hyperiux add overflow-stagger-text    # scroll-triggered character reveal
npx hyperiux add spider-particles         # interactive canvas particle web
npx hyperiux add phantom-image-trail      # cursor-driven image trail
npx hyperiux add sticky-content-wrapper   # GSAP pinned scroll section
npx hyperiux add elevate-navbar           # scroll-aware animated navbar
```

### Free effects by category

**Text** — `overflow-stagger-text` · `text-fill-animation` · `rectangular-text-reveal` · `circular-split-roll`

**Scroll** — `sticky-content-wrapper` · `horizontal-feature-reveal` · `infinite-perspective-slider` · `rotation-slider` · `text-convergence` · `scroll-distortion` · `smooth-scroll-animation` · `split-canvas` · `helix-slider`

**Cursor** — `phantom-image-trail` · `pixelated-image-effect` · `interactive-arrows`

**Backgrounds** — `spider-particles` · `dotted-grid`

**Buttons** — `arrow-fill-button` · `link-button` · `scramble-link-button`

**Navigation** — `elevate-navbar` · `directional-menu` · `glass-pill-header` · `immersive-full-screen-navigation` · `osmo-menu`

**Loaders** — `cappen` · `numeric-tunnel` · `stack-loader`

**Components** — `animated-faq` · `file-encryption` · `hover-slider` · `hover-stack` · `interactive-list-preview`

---

## Pro Effects

83 pro effects require a [Hyperiux Vault Pro subscription](https://vault.hyperiux.com/pricing). This covers WebGL shaders, advanced Three.js scenes, GPU particle systems, complex GSAP rigs, and everything else in the full vault.

### Getting started with Pro

**Step 1 — Get a Pro subscription**

Visit [vault.hyperiux.com/pricing](https://vault.hyperiux.com/pricing) and subscribe. Monthly and yearly plans are available.

**Step 2 — Generate a CLI token**

Go to your [dashboard](https://vault.hyperiux.com/dashboard) → **CLI Token** → copy the token.

**Step 3 — Authenticate the CLI**

```bash
npx hyperiux login
```

Paste your token when prompted. The CLI saves it locally so you only need to do this once per machine.

**Step 4 — Install pro effects the same way as free**

```bash
npx hyperiux add milkyway
npx hyperiux add fractal-glass
npx hyperiux add draggable-canvas
```

### Verify your login

```bash
npx hyperiux whoami
# → Logged in as you@example.com (Pro)
```

### CI / CD environments

If you install effects in a CI pipeline, set the token as an environment variable instead of running `login`:

```bash
HYPERIUX_TOKEN=your_token npx hyperiux add milkyway
```

Or add `HYPERIUX_TOKEN` to your CI secrets and the CLI will pick it up automatically.

### Browse Pro effects

All 83 pro effects with live previews and installation names are listed at [vault.hyperiux.com/effects](https://vault.hyperiux.com/effects).

---

## How It Works

The CLI **copies source code** into your project. There is no `hyperiux` import at runtime — the installed files are yours and live in your repo. This means:

- No vendor lock-in
- Customize any component freely after installing
- Works with any Next.js App Router project

When you run `npx hyperiux add <effect>`, the CLI:

1. Fetches the component source from the registry
2. Installs it into `src/components/effects/<effect-name>/`
3. Installs any peer dependencies (`gsap`, `three`, etc.) via your package manager
4. Leaves the files in your codebase — no ongoing CLI dependency

---

## Configuration

`hyperiux.json` is created by `init` at your project root:

```json
{
  "$schema": "https://vault.hyperiux.com/schema.json",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css"
  },
  "aliases": {
    "components": "@/components",
    "effects": "@/components/effects",
    "hooks": "@/hooks",
    "lib": "@/lib"
  }
}
```

Adjust `aliases` to match your project's path aliases.

---

## Requirements

- **Node.js** 18+
- **Next.js** 14+ (App Router)
- **Tailwind CSS** v3 or v4

Most effects depend on **GSAP**. The CLI installs it automatically. Note that GSAP's premium plugins (SplitText, ScrollTrigger, etc.) require a GSAP license for commercial use — see [gsap.com/licensing](https://gsap.com/licensing/).

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `HYPERIUX_TOKEN` | Authenticate without running `login` — useful in CI |
| `HYPERIUX_APP_URL` | Override the app URL for testing |
| `HYPERIUX_API_URL` | Override the API URL independently |
| `HYPERIUX_REGISTRY_URL` | Override the registry URL for local development |
| `HYPERIUX_DEBUG` | Set to `1` for verbose request logs |

---

## Troubleshooting

**`Hyperiux is not initialized in this project`**
```bash
npx hyperiux init
```

**`"<effect>" is a Pro effect`**
```bash
npx hyperiux login
npx hyperiux add <effect>
```

**Files already exist**
```bash
npx hyperiux add <effect> --overwrite
```

**Wrong import path after install**

The default install path is `@/components/effects/<effect-name>`. If you customized `aliases.effects` in `hyperiux.json`, use that path instead.

---

## Connect

| | |
|---|---|
| 🌐 Agency | [hyperiux.com](https://hyperiux.com) |
| 🎨 UI Library | [vault.hyperiux.com](https://vault.hyperiux.com) |
| 💻 GitHub | [github.com/Hyperiux-Immersion-Labs](https://github.com/Hyperiux-Immersion-Labs) |

---

## License

Free effects are MIT licensed. Pro effects require an active subscription and are not redistributable.
