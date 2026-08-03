# Hyperiux Vault

[![npm version](https://img.shields.io/npm/v/hyperiux.svg?style=flat-square&color=ff5f00)](https://www.npmjs.com/package/hyperiux)
[![npm downloads](https://img.shields.io/npm/dm/hyperiux.svg?style=flat-square&color=777777)](https://www.npmjs.com/package/hyperiux)

**A collection of high-quality animation effects and interactive components for Next.js — designed by [Hyperiux](https://hyperiux.com).**

32 effects are free and open source. 83 pro effects are available with a [Pro subscription](https://vault.hyperiux.com/pricing). The CLI installs source code directly into your project — you own what you install.

---

## Quick Start

### 1. Initialize
```bash
npx hyperiux init
```

### 2. Add a free effect
```bash
npx hyperiux add blur-text
```

### 3. Use it
```jsx
import { BlurText } from "@/components/effects/blur-text";

export default function Page() {
  return <BlurText>Hello, world.</BlurText>;
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
- `--overwrite` — overwrite existing files
- `--yes` — skip confirmation prompts
- `--dry-run` — preview without writing files

---

## Free vs Pro

**32 free effects** — install without any account:
```bash
npx hyperiux add blur-text
npx hyperiux add spider-particles
npx hyperiux add mouse-pixelation
```

**83 pro effects** — require a [Pro subscription](https://vault.hyperiux.com/pricing):
```bash
npx hyperiux login       # authenticate once
npx hyperiux add milkyway
```

[Browse all effects →](https://vault.hyperiux.com/effects)

---

## Effects

### Scroll
Scroll-driven animations built on GSAP ScrollTrigger — parallax galleries, pinned sequences, horizontal storytelling, stacking cards, and more.

`sticky-content-wrapper` · `horizontal-feature-reveal` · `infinite-perspective-slider` · `parallax-slider` · `rotation-slider` · `text-convergence` · `scroll-distortion` · [+more](https://vault.hyperiux.com/effects/scroll-effects)

### WebGL
Three.js and R3F scenes with custom GLSL shaders — image carousels, pixel grids, frosted glass, GPU particle galaxies, and 3D heroes.

`interactive-blur-reveal` · `mouse-pixelation` · `grid-tunnel` · `draggable-canvas` · `milkyway` · `fractal-glass` · [+more](https://vault.hyperiux.com/effects/webgl)

### Cursor
Canvas 2D and Three.js cursor effects — image trails, rope followers, liquid glass, character grids.

`phantom-image-trail` · `pixelated-image-effect` · `magnetic-image-trail` · `character-trail` · `rope-cursor` · [+more](https://vault.hyperiux.com/effects/cursor-effects)

### Text
Letter-level and line-level reveal animations — blur, scramble, stagger, perspective flip, mask wipe.

`blur-text` · `overflow-stagger-text` · `rectangular-text-reveal` · `text-fill-animation` · `scramble-text` · [+more](https://vault.hyperiux.com/effects/text-effects)

### Backgrounds · Page Transitions · Buttons · Components · Navigation · Loaders

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
| `HYPERIUX_DEBUG` | Set to `1` to enable verbose request logs — do not use in shared CI |

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

## Architecture

This is a pnpm monorepo with Turborepo:

- **`apps/docs`** — Next.js documentation site ([vault.hyperiux.com](https://vault.hyperiux.com))
- **`packages/cli`** — `npx hyperiux` CLI tool (published to npm as `hyperiux`)
- **`registry/effects`** — Free effect source, organized by category

Pro effect source lives in a private repository and is served via a protected API. The registry index (`public/r/index.json`) lists all effects with metadata but pro file contents are not publicly accessible.

---

## Contributing

Found a bug or want to contribute a free effect? Pull requests are welcome.

```bash
git clone https://github.com/hyperiux/hyperiux-components
cd hyperiux-components
pnpm install
pnpm dev
```

To add a new free effect, follow the [Adding a New Effect](CLAUDE.md#adding-a-new-effect--checklist) checklist in CLAUDE.md.

### Testing the CLI locally

Before publishing, test the CLI against the live registry without installing from npm:

```bash
# From the repo root
cd packages/cli
npm link

# Now test from any Next.js project directory
hyperiux --help
hyperiux list
hyperiux init
hyperiux add dotted-grid        # free effect — no login needed
hyperiux login                  # pro effects — requires token
hyperiux add milkyway           # pro effect

# Unlink when done
npm unlink hyperiux
```

To inspect exactly what will be published to npm:

```bash
npm pack                        # creates hyperiux-x.x.x.tgz locally
tar -tzf hyperiux-*.tgz         # list files in the tarball
npm publish --dry-run           # full publish simulation, nothing uploaded
```

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

The CLI and free effects are licensed under the [Mozilla Public License 2.0](./LICENSE) (MPL-2.0). Pro effects require an active Hyperiux Pro subscription and are proprietary — not open source, not redistributable.
