# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Development (from root)
pnpm dev              # Start all dev servers
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm build:registry   # Rebuild registry JSON files — run after adding/editing any registry effect

# Bypass Turborepo cache (use when new registry folders aren't being picked up)
node apps/docs/scripts/build-registry.js

# Docs app only (from apps/docs)
pnpm dev              # Start docs dev server at localhost:3000

# CLI — run from repo root
node packages/cli/src/index.js --help
node packages/cli/src/index.js list
node packages/cli/src/index.js init -y
node packages/cli/src/index.js add blur-text --dry-run

# CLI — test against live registry (run from outside the monorepo)
# DEV_REGISTRY_PATH auto-detects the local public/r/ when inside the repo,
# so external testing is needed to verify the production Vercel URL is hit.
```

## Architecture

pnpm monorepo with Turborepo:
- **`apps/docs`** — Next.js documentation site (React 19, Tailwind CSS 4, JS only, no TypeScript)
- **`packages/cli`** — `npx hyperiux` CLI tool (published to npm as `hyperiux`)
- **`registry/effects`** — Source components, organized by category folder

### Registry System

The registry is the core distribution mechanism (shadcn-style). Source lives in `registry/effects/<category>/<name>/`. The build script (`apps/docs/scripts/build-registry.js`) reads every folder and emits:
- `apps/docs/public/r/<name>.json` — full effect with embedded file contents
- `apps/docs/public/r/index.json` — flat index of all effects

The CLI resolves the registry in priority order:
1. Auto-detected local path (`apps/docs/public/r/`) — active when running from inside the monorepo (existence check, not env var)
2. `HYPERIUX_REGISTRY_URL` env var override
3. Production: `https://components.hyperiux.com/r`

The docs site is deployed at `https://hyperiux-ui.vercel.app`. The CLI registry uses a separate domain (`components.hyperiux.com`). When migrating, update `REGISTRY_URL` in `packages/cli/src/utils/registry.js` and `$schema` in `packages/cli/src/utils/config.js`.

**Every registry effect folder must have:**
- `<name>.jsx` — component with `"use client"` and a **named export** (not default). Multi-file entries use relative imports between files in the same folder.
- `registry.json` — metadata

All files in a multi-file effect land flat in `src/components/hyperiux/` when installed, so relative imports like `./masked-container` resolve correctly.

**registry.json schema:**
```json
{
  "name": "effect-name",
  "type": "registry:component",
  "title": "Display Name",
  "description": "...",
  "category": "scroll|cursor|backgrounds|transitions|text|buttons|carousels|components|navigation|loaders|webgl|others",
  "categories": ["text", "scroll"],
  "dependencies": ["gsap"],
  "registryDependencies": [],
  "previewUrl": "/demo-route",
  "order": 1
}
```

`order` (optional, default 99) controls sort position within the category. `registryDependencies` lists other Hyperiux effect names the CLI should auto-install alongside this one. `categories` (array) is supported alongside the singular `category` for effects that belong to multiple categories — both are embedded in the built output.

**Category display order** is controlled by the `CATEGORY_ORDER` array at the top of `apps/docs/scripts/build-registry.js`. Add new categories there.

### Adding a New Effect — Checklist

1. `mkdir -p registry/effects/<category>/<effect-name>/`
2. Create `<effect-name>.jsx` with named export `export function EffectName`
3. Create `registry.json`
4. Run `pnpm build:registry` (or `node apps/docs/scripts/build-registry.js` to bypass cache)
5. Create a demo page at the `previewUrl` route in `apps/docs/src/app/`
6. Optionally add a props config entry in `apps/docs/src/lib/effect-configs.js` so the detail page renders an interactive props panel

### Multi-Version Demo Pages

When a single effect has multiple variants (e.g. `mouse-pixelation-effects` with v2 and v3 sub-routes), add a shared `layout.js` to the parent route folder with a `VersionNav` client component. The nav uses `usePathname()` to highlight the active version and `<Link>` for navigation. See `apps/docs/src/app/mouse-pixelation-effects/layout.js` as the reference pattern.

The registry effect itself should export just the primary variant — the version switcher belongs only in the demo pages.

### Docs App Architecture

**Routing:**
- `/effects` — listing page (`vault-content.jsx` + `EffectCardNew`) — reads `public/r/index.json` at build time
- `/effects/[slug]` — detail page (`effect-detail.jsx`) — reads `public/r/<slug>.json` via `apps/docs/src/lib/registry.js`
- `/effects/[slug]/preview` — fullscreen iframe preview
- Demo pages live at their own routes (e.g. `/hover-slider`, `/carousels/clippath-slider`) — these are **not** distributed via CLI

**Key lib files:**
- `apps/docs/src/lib/registry.js` — `getEffectBySlug`, `getRegistryIndex`, `getAllEffectSlugs`, `getEffectsByCategory` — all use `fs.readFileSync` and are **build-time only** (server/SSG, never import in client components)
- `apps/docs/src/lib/effect-configs.js` — per-effect prop definitions (`props`, `defaults`, `note`, `demoText`, `isContainer`) rendered as an interactive panel on `/effects/[slug]`. Add an entry here keyed by slug to enable the live props panel for an effect.
- `apps/docs/public/schema.json` — JSON Schema for `hyperiux.json`; served statically at `/schema.json`

**Performance conventions:**
- `EffectCardNew` lazy-loads video: `videoSrc` state starts `null`, set on first hover only
- `<Image>` uses `fill` + `sizes` prop; pass `priority={true}` for above-the-fold cards (first 4)
- Demo-specific fonts: `next/font/google` in the demo page, not in global layout
- Assets for demos: `apps/docs/public/assets/demo/<demo-name>/`

### Animation Library Conventions

- **Framer Motion** (`motion/react`) — simple entrance/exit animations, button effects
- **GSAP** — scroll-driven animations (`ScrollTrigger`), complex sequences, canvas ticker loops (`gsap.ticker.add`)
- **GSAP SplitText** — import from `gsap/dist/SplitText` (paid plugin bundled in project)
- **Lenis** (`lenis/react`) — smooth scroll; wrap pages with `<ReactLenis root>` in the demo page

### Three.js / WebGL Patterns

- Raw Three.js: store renderer/texture/RAF refs, clean up in `useEffect` return
- R3F (`@react-three/fiber`): use `@react-three/drei` helpers, `@react-three/postprocessing` for post-FX
- Reset `hasInit.current = false` in cleanup for React Strict Mode double-invoke safety
- Multi-file WebGL effects (e.g. `601-hero`, `milkyway`): all helper files go in the same registry folder with relative imports (`./room-model`)
- `OffscreenCanvas` for Canvas 2D double-buffering (e.g. `gooey-counter`)

### CLI Package

- Entry point: `packages/cli/src/index.js` — reads version dynamically from `package.json` via `createRequire`
- Commands: `init` · `add` · `list`
- `add` flow: fetch registry JSON → check existing files → install missing npm deps → write files with path alias resolution
- Path aliases (`@/`) are resolved to `src/` using `hyperiux.json` config; supported alias keys: `components`, `effects`, `hooks`, `lib`
- Package manager is auto-detected from lock files (pnpm > yarn > bun > npm)
- To publish: `cd packages/cli && npm publish` (requires `components.hyperiux.com` to be live as the registry host)

### Sentry

Configured via `withSentryConfig` in `apps/docs/next.config.mjs`. Config files: `sentry.client.config.js`, `sentry.server.config.js`, `sentry.edge.config.js`, `src/instrumentation.js`. Source map upload is skipped unless `NEXT_PUBLIC_SENTRY_DSN` is set.
