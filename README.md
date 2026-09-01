# Hyperiux Vault

[![npm version](https://img.shields.io/npm/v/hyperiux.svg?style=flat-square&color=ff5f00)](https://www.npmjs.com/package/hyperiux)
[![npm downloads](https://img.shields.io/npm/dm/hyperiux.svg?style=flat-square&color=777777)](https://www.npmjs.com/package/hyperiux)

**A collection of high-quality animation effects and interactive components for Next.js - designed by [Hyperiux](https://hyperiux.com).**

47 effects are free and open source. 91 pro effects are available with a [Pro subscription](https://vault.hyperiux.com/pricing). The CLI installs source code directly into your project - you own what you install.

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

**47 free effects** - install without any account:
**47 free effects** - install without any account:
```bash
npx hyperiux add rotation-slider
npx hyperiux add spider-particles
npx hyperiux add phantom-image-trail
```

**91 pro effects** - require a [Pro subscription](https://vault.hyperiux.com/pricing):
```bash
npx hyperiux login       # authenticate once
npx hyperiux add grid-tunnel
```

[Browse all effects →](https://vault.hyperiux.com/effects)

---

## Effects

### Scroll
Scroll-driven animations built on GSAP ScrollTrigger - parallax galleries, pinned sequences, horizontal storytelling, stacking cards, and more.

`sticky-content-wrapper` · `horizontal-feature-reveal` · `infinite-perspective-slider` · `parallax-slider` · `rotation-slider` · `text-convergence` · `scroll-distortion` · [+more](https://vault.hyperiux.com/effects/scroll-effects)

### WebGL
Three.js and R3F scenes with custom GLSL shaders - image carousels, pixel grids, frosted glass, GPU particle galaxies, and 3D heroes.

`interactive-blur-reveal` · `mouse-pixelation` · `grid-tunnel` · `draggable-canvas` · `milky-way` · `fractal-glass` · [+more](https://vault.hyperiux.com/effects/webgl)

### Cursor
Pointer-following image and pixel effects for expressive cursor interactions.

`phantom-image-trail` · `pixelated-image-effect`

### Loaders
Animated loading indicators for numeric, stacked, and motion-heavy states.

`numeric-tunnel` · `stack-loader`

### Navigation
Menus and navbars with desktop and mobile interaction patterns.

`directional-menu` · `elevate-navbar` · `immersive-full-screen-nav`

### Scroll
Scroll-driven animations built on GSAP ScrollTrigger - pinned sequences, perspective sliders, split canvases, and content reveals.

`circular-split-roll` · `horizontal-feature-reveal` · `infinite-perspective-slider` · `rotation-slider` · `split-canvas` · `sticky-content-wrapper` · `text-convergence`

### Text
Letter-level and line-level reveal animations - blur, scramble, stagger, perspective flip, mask wipe.

`blur-text` · `rectangular-text-reveal` · `text-fill-animation` · `scramble-text` · [+more](https://vault.hyperiux.com/effects/text-effects)

### Transitions
Page and section transitions built from animated grids and block-based motion.

`block-transition` · `chess-grid-transition`

### WebGL
Three.js, R3F, and shader-driven effects for frosted glass, image reveal, and particle galaxies.

`fractal-glass` · `interactive-blur-reveal` · `milky-way`

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
- **`packages/mcp-server`** - MCP (Model Context Protocol) server that lets AI clients (Claude, Cursor, etc.) browse and install Vault effects; published as `hyperiux-mcp-server` (not yet published to npm as of this writing - see [packages/mcp-server](packages/mcp-server) for local usage)
- **`registry/effects`** - Free effect source, organized by category

Pro effect source lives in a private repository and is served via a protected API. The registry index (`public/r/index.json`) lists all effects with metadata - pro file contents are not publicly accessible.

### Running the MCP server locally

`packages/mcp-server` isn't on npm yet, so point your MCP client at a local build instead of `npx`:

```bash
pnpm --filter hyperiux-mcp-server build
```

Then add it to your client's MCP config using an absolute path to the built entrypoint:

```json
{
  "mcpServers": {
    "hyperiux": {
      "command": "node",
      "args": ["/absolute/path/to/hyperiux-components/packages/mcp-server/dist/index.js"]
    }
  }
}
```

See [packages/mcp-server/README.md](packages/mcp-server/README.md) for the full tool list and Pro-effect auth behavior. npm publishing is future work, not the current install path.

---

## Contributing

Found a bug or want to contribute a free effect? Pull requests are welcome.

```bash
git clone https://github.com/Hyperiux-Immersion-Labs/hyperiux-components
cd hyperiux-components
pnpm install
pnpm dev
```

To add a new free effect, follow the [Adding a New Effect](CLAUDE.md#adding-a-new-effect--checklist) checklist in CLAUDE.md.

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

The CLI and free effects are licensed under the [Mozilla Public License 2.0](./LICENSE) (MPL-2.0). Pro effects require an active Hyperiux Pro subscription and are proprietary - not open source, not redistributable.
