# Hyperiux Vault

[![npm version](https://img.shields.io/npm/v/hyperiux.svg?style=flat-square&color=ff5f00)](https://www.npmjs.com/package/hyperiux)
[![npm downloads](https://img.shields.io/npm/dm/hyperiux.svg?style=flat-square&color=777777)](https://www.npmjs.com/package/hyperiux)

**A collection of high-quality animation effects and interactive components for Next.js - designed by [Hyperiux](https://hyperiux.com).**

150+ effects in total - 50+ free and open source, 100+ pro effects available with a [Pro subscription](https://vault.hyperiux.com/pricing). The CLI installs source code directly into your project - you own what you install.

<table>
  <tr>
    <td width="50%"><img src="https://raw.githubusercontent.com/Hyperiux-Immersion-Labs/hyperiux-components/main/media/effects/phantom-image-trail.gif" alt="phantom-image-trail" width="100%" /><br /><sub><code>npx hyperiux add phantom-image-trail</code></sub></td>
    <td width="50%"><img src="https://raw.githubusercontent.com/Hyperiux-Immersion-Labs/hyperiux-components/main/media/effects/milky-way.gif" alt="milky-way" width="100%" /><br /><sub><code>npx hyperiux add milky-way</code></sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="https://raw.githubusercontent.com/Hyperiux-Immersion-Labs/hyperiux-components/main/media/effects/spider-particles.gif" alt="spider-particles" width="100%" /><br /><sub><code>npx hyperiux add spider-particles</code></sub></td>
    <td width="50%"><img src="https://raw.githubusercontent.com/Hyperiux-Immersion-Labs/hyperiux-components/main/media/effects/immersive-full-screen-nav.gif" alt="immersive-full-screen-nav" width="100%" /><br /><sub><code>npx hyperiux add immersive-full-screen-nav</code></sub></td>
  </tr>
</table>

---

## Quick Start

### 1. Initialize
```bash
npx hyperiux init
```

### 2. Add a free effect
```bash
npx hyperiux add rectangular-text-reveal
```

### 3. Use it
```jsx
import RectangularTextReveal from "@/components/effects/rectangular-text-reveal";

export default function Page() {
  return <RectangularTextReveal>Hello, world.</RectangularTextReveal>;
}
```

---

## CLI Commands

| Command | Description |
|---|---|
| `npx hyperiux init` | Initialize config in your project |
| `npx hyperiux add <effect>` | Add an effect to your project |
| `npx hyperiux list` | List all available effects |
| `npx hyperiux login` | Connect your Pro account |
| `npx hyperiux logout` | Remove saved credentials |
| `npx hyperiux whoami` | Show login status |

### Options for `add`
- `--overwrite` - overwrite existing files
- `--yes` - skip confirmation prompts
- `--dry-run` - preview without writing files

---

## Free vs Pro

**50+ free effects** - install without any account:
```bash
npx hyperiux add rotation-slider
npx hyperiux add spider-particles
npx hyperiux add phantom-image-trail
```

**100+ pro effects** - require a [Pro subscription](https://vault.hyperiux.com/pricing):
```bash
npx hyperiux login       # authenticate once
npx hyperiux add grid-tunnel
```

[Browse all effects →](https://vault.hyperiux.com/effects)

---

## Effects

### Text
Letter-level and line-level reveal animations - blur, scramble, stagger, perspective flip, mask wipe.

`rectangular-text-reveal` · `blur-text` · `text-fill-animation` · `scramble-text` · [+more](https://vault.hyperiux.com/effects/text-animations)

### Backgrounds
Ambient canvas and particle backgrounds that sit behind content without competing for attention.

`dot-transition` · `dotted-grid` · `spider-particles`

### Buttons
Interactive button treatments - fill sweeps, metallic sheens, shiny highlights, and scramble-on-hover text.

`arrow-fill-button` · `link-button` · `metallic-button` · `scramble-link-button` · `shiny-button`

### Carousels
Slider and carousel patterns beyond a plain swipe - arc paths, 3D flips, parallax strips, and zoom transitions.

`arc-flow-carousel` · `dimensional-switch-slider` · `ellipse-carousel` · `orbit-flip-slider` · [+more](https://vault.hyperiux.com/effects/carousels)

### Scroll
Scroll-driven animations built on GSAP ScrollTrigger - parallax galleries, pinned sequences, horizontal storytelling, and stacking cards.

`sticky-content-wrapper` · `horizontal-feature-reveal` · `infinite-perspective-slider` · `rotation-slider` · `circular-split-roll` · `split-canvas` · [+more](https://vault.hyperiux.com/effects/scroll-effects)

### Components
Small, self-contained UI pieces - accordions, counters, timelines, and hover-driven lists.

`animated-faq` · `border-beam` · `gooey-counter` · `gsap-flip-card` · [+more](https://vault.hyperiux.com/effects/components)

### Navigation
Menus and navbars with desktop and mobile interaction patterns.

`directional-menu` · `elevate-navbar` · `immersive-full-screen-nav`

### Cursor
Canvas 2D and Three.js cursor effects - image trails, rope followers, liquid glass, character grids.

`phantom-image-trail` · `pixelated-image-effect` · `liquid-glass-cursor` · `magnetic-image-trail` · `character-trail` · `rope-cursor` · [+more](https://vault.hyperiux.com/effects/cursor-effects)

### Transitions
Page and section transitions built from animated grids and block-based motion.

`block-transition` · `chess-grid-transition`

### Loaders
Animated loading indicators for numeric, stacked, and motion-heavy states.

`numeric-tunnel` · `stack-loader`

### WebGL
Three.js and R3F scenes with custom GLSL shaders - image carousels, pixel grids, frosted glass, GPU particle galaxies, and 3D heroes.

`interactive-blur-reveal` · `mouse-pixelation` · `grid-tunnel` · `draggable-canvas` · `milky-way` · `fractal-glass`

[Browse all →](https://vault.hyperiux.com/effects)

---

## Configuration

`hyperiux.json` is created at your project root by `init`:

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

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `HYPERIUX_TOKEN` | Use a CLI token without saving it locally (useful in CI) |
| `HYPERIUX_APP_URL` | Override the Hyperiux app URL for self-hosting or testing |
| `HYPERIUX_API_URL` | Override the API URL independently of the app URL |
| `HYPERIUX_REGISTRY_URL` | Override the registry URL for local development |
| `HYPERIUX_DEBUG` | Set to `1` to enable verbose request logs - do not use in shared CI |

---

## Architecture

This is a pnpm monorepo with Turborepo:

- **`packages/cli`** - `npx hyperiux` CLI tool, published to npm as `hyperiux`
- **`packages/mcp-server`** - MCP (Model Context Protocol) server that lets AI clients (Claude, Cursor, etc.) browse and install Vault effects; published to npm as `hyperiux-mcp-server`
- **`registry/effects`** - Free effect source, organized by category

Pro effect source lives in a private repository and is served via a protected API. The registry index (`registry/index.json`) lists all effects with metadata - pro file contents are not publicly accessible.

### Running the MCP server

Add it to your client's MCP config via `npx`:

```json
{
  "mcpServers": {
    "hyperiux": {
      "command": "npx",
      "args": ["-y", "hyperiux-mcp-server"]
    }
  }
}
```

Contributing to the server itself? Point your MCP client at a local build instead - see [packages/mcp-server](../mcp-server).

See [packages/mcp-server/README.md](../mcp-server/README.md) for the full tool list and Pro-effect auth behavior.

---

## Contributing

Found a bug or want to contribute a free effect? Pull requests are welcome.

```bash
git clone https://github.com/Hyperiux-Immersion-Labs/hyperiux-components
cd hyperiux-components
pnpm install
pnpm dev
```

To add a new free effect, follow the [Adding a New Effect](../../CLAUDE.md#adding-a-new-effect--checklist) checklist in CLAUDE.md.

---

## Requirements

- **Node.js** 18+
- **Next.js** (App Router)
- **Tailwind CSS**

---

## Connect

| | |
|---|---|
| 🌐 Agency | [hyperiux.com](https://hyperiux.com) |
| 🎨 UI Library | [vault.hyperiux.com](https://vault.hyperiux.com) |
| 💻 GitHub | [github.com/Hyperiux-Immersion-Labs](https://github.com/Hyperiux-Immersion-Labs) |

---

## License

The `hyperiux` CLI and the `hyperiux-mcp-server` are licensed under the [MIT License](../../LICENSE). Free effects installed through the CLI are provided under the [Hyperiux Effects License](../../LICENSE_EFFECTS). Pro effects require an active Hyperiux Pro subscription and are proprietary - not open source, not redistributable.
