# Hyperiux Vault

**A free, open-source collection of high-quality animation effects and interactive components for Next.js — built by [Hyperiux](https://hyperiux.com).**

Pick the effects you want. Copy the code into your project. Own it completely.

```bash
npx hyperiux add blur-text
```

**[ui.hyperiux.com](https://components.hyperiux.com/)** · **[hyperiux.com](https://hyperiux.com)** · **[GitHub](https://github.com/hyperiux/hyperiux-ui)**

---

## What is Hyperiux?

[Hyperiux](https://hyperiux.com) is a digital design and development agency that builds ambitious digital experiences — from brand identities to fully custom web products. Hyperiux Vault is the public face of how we build: a growing library of the effects, animations, and interactive components we use in production, shared openly for the wider development community.

## What is Hyperiux Vault?

Hyperiux Vault is **not an npm component library**. It's closer in spirit to [shadcn/ui](https://ui.shadcn.com) — a registry of source code that you install directly into your project via CLI. No version lock-in, no opaque black boxes. Every effect lives in your codebase and is yours to read, modify, and extend.

The library spans 103+ effects across 12 categories — from GSAP scroll sequences and cursor interactions to raw WebGL shaders and Three.js scenes.

---

## Effects

### Scroll
Scroll-driven animations built on GSAP ScrollTrigger — parallax galleries, pinned sequences, horizontal storytelling, stacking cards, and more.

`draggable-marquee` · `helix-slider` · `horizon-scroll` · `orbit-slider` · `parallax-gallery` · `parallax-slider` · `rotating-carousel` · `rotation-slider` · `scroll-distortion` · `scroll-stack` · `stacking-cards` · `sticky-content-wrapper` · `svg-path-marquee` · `text-convergence` · [+more](https://components.hyperiux.com//effects)

### WebGL
Three.js and R3F scenes with custom GLSL shaders — image carousels that curve on drag, pixel trail grids, frosted glass refraction, GPU particle galaxies, and full immersive 3D heroes.

`curved-plane` · `curved-plane-v2` · `draggable-canvas` · `fractal-glass` · `grid-tunnel` · `interactive-blur-reveal` · `milkyway` · `mouse-pixelation` · `progressive-bloom-valley` · `strip-slider` · `webgl-portfolio-slider` · `hero-banner-animated` · [+more](https://components.hyperiux.com//effects)

### Cursor
Canvas 2D and Three.js cursor effects — butterfly swarms, rope followers, liquid glass morphing, image trails, ASCII art, and character grids that wake on hover.

`butterfly-trail-cursor` · `character-trail` · `coffee-bean-cursor` · `colorful-cursor-aura` · `fish-eye` · `interactive-arrows` · `liquid-glass-cursor` · `magnetic-image-trail` · `noise-ripple-cursor` · `phantom-image-trail` · `rope-cursor` · [+more](https://components.hyperiux.com//effects)

### Text
Letter-level and line-level reveal animations — blur in, scramble, stagger, perspective flip, mask wipe, spotlight, and GSAP SplitText sequences.

`blur-text` · `circle-text-reveal` · `glitchy-text` · `mask-text-reveal` · `overflow-stagger-text` · `perspective-text-reveal` · `scramble-text` · `slide-text-reveal` · `spotlight-text` · `text-cloning` · `text-fill-animation` · [+more](https://components.hyperiux.com//effects)

### Backgrounds · Transitions · Buttons · Components · Navigation · Loaders

[Browse all effects →](https://components.hyperiux.com//effects)

---

## Getting started

**1. Initialize in your project**

```bash
npx hyperiux init
```

Creates a `hyperiux.json` config file at your project root. Run once per project.

**2. Add an effect**

```bash
npx hyperiux add blur-text
```

Fetches the component source, installs any required npm dependencies, and writes the files directly into your project.

**3. Import and use**

```jsx
import { BlurText } from "@/components/hyperiux/blur-text";

export default function Page() {
  return <BlurText text="Hello, world." />;
}
```

---

## Commands

### `init`

```bash
npx hyperiux init
npx hyperiux init --yes    # skip prompts, use defaults
```

Prompts for your global CSS path and path aliases. Use `--yes` to accept defaults for a standard Next.js App Router project.

### `add`

```bash
npx hyperiux add <effect-name>
npx hyperiux add <effect-name> --overwrite    # overwrite if files already exist
npx hyperiux add <effect-name> --yes          # skip confirmation prompts
npx hyperiux add <effect-name> --dry-run      # preview without writing any files
```

Multi-file effects (e.g. `draggable-canvas`, `interactive-arrows`) install all helper files together into the same folder so relative imports resolve correctly.

### `list`

```bash
npx hyperiux list
```

Prints every available effect grouped by category with its npm dependencies.

---

## Requirements

- **Node.js** 18+
- **Next.js** (App Router recommended)
- **Tailwind CSS**

---

## Configuration

`hyperiux.json` is created at your project root by `init`:

```json
{
  "$schema": "https://components.hyperiux.com//schema.json",
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

The `aliases.effects` value controls where effect files are written. Change it to match your project structure and the CLI will follow.

---

## Contributing

Found a bug or want to add an effect? Pull requests are welcome.

```bash
git clone https://github.com/hyperiux/hyperiux-ui
cd hyperiux-ui
pnpm install
pnpm dev
```

To add a new effect, see the [contribution guide](https://github.com/hyperiux/hyperiux-ui#contributing) in the root README.

---

## Connect

Built by the team at [Hyperiux](https://hyperiux.com) — a digital design and development agency.

| | |
|---|---|
| 🌐 Agency | [hyperiux.com](https://hyperiux.com) |
| 🎨 UI Library | [ui.hyperiux.com](https://components.hyperiux.com/) |
| 💻 GitHub | [github.com/hyperiux/hyperiux-ui](https://github.com/hyperiux/hyperiux-ui) |
| 𝕏 X / Twitter | [@hyperiux](https://x.com/hyperiux) |
| 📸 Instagram | [@hyperiux](https://instagram.com/hyperiux) |
| 💼 LinkedIn | [Hyperiux](https://linkedin.com/company/hyperiux) |
| 🎨 Behance | [@hyperiux](https://behance.net/hyperiux) |

---

## License

MIT — free to use in personal and commercial projects.
