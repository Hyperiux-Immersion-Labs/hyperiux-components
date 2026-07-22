# Contributing to Hyperiux Vault

Thanks for considering a contribution. This covers the free, open-source side of the repo - `packages/cli` (the `hyperiux` CLI) and `registry/effects` (the 32 free effects). Pro effect source lives in a private repository and isn't part of this repo.

## Ways to contribute

- **Add a free effect** - see below.
- **Fix a bug** in the CLI or an existing free effect.
- **Improve the CLI** - `packages/cli/src/commands/`.
- **Improve docs** - README, this file, or the [docs site](https://vault.hyperiux.com/docs).

Not sure where to start? Check issues labeled [`good first issue`](https://github.com/Hyperiux-Immersion-Labs/hyperiux-components/labels/good%20first%20issue), or ask in [Discussions](https://github.com/Hyperiux-Immersion-Labs/hyperiux-components/discussions) first if you want to validate an idea before writing code.

## Setup

This is a pnpm + Turborepo monorepo.

```bash
git clone https://github.com/Hyperiux-Immersion-Labs/hyperiux-components
cd hyperiux-components
pnpm install
pnpm dev
```

Requires Node 18+ and pnpm 9+.

## Adding a free effect

1. Create a folder: `registry/effects/<category>/<effect-name>/`. Use one of the existing categories (`backgrounds`, `buttons`, `carousels`, `components`, `cursor`, `loaders`, `navigation`, `scroll`, `text`, `transitions`, `webgl`) unless the effect genuinely needs a new one.
2. Add `index.jsx` with your component. Match the export style you declare in `registry.json` (`exportKind: "default"` or `"named"`).
3. Add `registry.json`:

   ```json
   {
     "name": "your-effect-slug",
     "type": "registry:component",
     "title": "Your Effect Title",
     "description": "One or two sentences - what it does and when you'd reach for it.",
     "category": "scroll",
     "dependencies": ["gsap"],
     "registryDependencies": [],
     "previewUrl": "/demo/your-effect-slug",
     "exportName": "YourEffectComponent",
     "exportKind": "default",
     "tier": "free",
     "main": "index.jsx",
     "importPath": "@/components/effects/your-effect-slug",
     "target": "src/components/effects/your-effect-slug",
     "files": [
       { "path": "index.jsx", "target": "src/components/effects/your-effect-slug/index.jsx" }
     ]
   }
   ```

   - `name` is the CLI install slug (`npx hyperiux add your-effect-slug`) - lowercase, hyphenated, no `tier` ambiguity (this file only ever produces free effects; Pro effects are added through the private registry).
   - `dependencies` are npm packages the CLI installs alongside the effect (GSAP, Three.js, etc.) - only list what's actually imported.
   - If the effect is more than one file, list every file under `files`, each with its own `target`.
4. Build the registry: `pnpm build:registry` (outputs to `apps/docs/public/r/`).
5. Smoke-test the real install path against a throwaway Next.js app:

   ```bash
   cd /path/to/some/scratch-nextjs-app
   node /path/to/hyperiux-components/packages/cli/src/index.js add your-effect-slug
   ```

   Confirm the files land correctly and the component renders.

**What makes a good free-effect PR:** something broadly reusable (not a one-off tied to a specific layout), reasonably self-contained (minimal new dependencies), and something you'd actually want to `npx hyperiux add` into a real project.

## Working on the CLI

```bash
cd packages/cli
pnpm lint
pnpm test
pnpm run smoke:bin    # runs the actual binary
pnpm run pack:dry     # verifies what would actually get published
```

`prepublishOnly` (lint + test + build + smoke:bin + pack:dry) is what actually gates a real release - if that passes, your change is in good shape.

## Pull requests

- Keep PRs scoped to one effect or one fix - easier to review, easier to revert if something's off.
- Fill out the PR template; the checklist mirrors what CI actually runs.
- If your PR touches `packages/cli`, CI (`cli-ci.yml`) will lint, test, and do a real tarball-install smoke test automatically.
- Link the issue you're addressing if there is one.

## Questions

[Discussions](https://github.com/Hyperiux-Immersion-Labs/hyperiux-components/discussions) is the right place for "how do I..." questions, effect requests, and general feedback - open an issue only for something concrete enough to act on (a bug, or an effect request you want tracked).
