# Framework Auto-Detection + Local Effect Counter — Implementation Guide

## Context

The CLI already has a working foundation for both asks:

- `detectProjectEnvironment()` in [`src/utils/config.js`](src/utils/config.js) auto-detects `next` vs `react` vs `unknown`, and `detectCssPath()` picks a default `globals.css`/`index.css` location based on that.
- `src/utils/telemetry.js` already fire-and-forgets a `trackCliEvent("add", {...})` POST per effect install to a remote endpoint — that's the remote "record" mechanism, already implemented.

This doc describes tightening both, informed by how `shadcn/ui`'s CLI solves the same problem (`react-bits` has no detection logic of its own — it delegates entirely to the `shadcn` CLI and `jsrepo`, so shadcn is the real reference implementation).

### How shadcn does it (`packages/shadcn/src/utils/get-project-info.ts`)

- Detects framework via **config-file globs** (`next.config.*`, `vite.config.*`, `astro.config.*`, `gatsby-config.*`, `react-router.config.*`, `app.config.*`) via `fast-glob`, 3 levels deep, excluding `node_modules`/`.next`/`dist`/`build` — not by scanning for loose folder names like `pages`/`app`.
- Splits Next.js into **`next-app` vs `next-pages`** as distinct framework types (checked via `src/app`/`app` dir existence) — App Router and Pages Router have different global-CSS entry points (`app/layout.js` vs `pages/_app.js`).
- Falls back to an explicit `"manual"` framework type instead of silently defaulting unrecognized projects into Next.js-shaped paths.
- Locates the Tailwind CSS entry file by **content-sniffing** (`@import "tailwindcss"` / `@tailwind base`) across `*.css`/`*.scss` files, not just a fixed list of conventional paths.
- Tracks installed components by **reading the target directory and cross-referencing filenames against the registry index** — no persistent counter file; the count is derived on demand from what's on disk.

## Current gaps in this repo

In `src/utils/config.js`:

1. `detectProjectEnvironment()` treats presence of a `pages/` or `app/` folder as a Next.js signal on its own (`hasAnyPath(cwd, [..., "src/app", "app", "src/pages", "pages"])`). A plain Vite/React app that happens to have a `src/pages/` routing folder gets misdetected as Next.
2. There's no distinction between Next.js **App Router** and **Pages Router** — both currently collapse into `framework: "next"`, so `detectCssPath` always suggests `app/globals.css`-style paths even for Pages Router projects, which conventionally don't have an `app/` dir at all.
3. `detectCssPath()`'s non-`"react"` branch (the `else` covering both `"next"` and `"unknown"`) defaults straight to Next-shaped CSS paths. An `"unknown"` framework project silently gets Next.js assumptions baked into `hyperiux.json`.
4. There's no local/offline count of installed effects — `telemetry.js` fires remote events per `add`, but nothing durable lives in the project itself (useful for a future `hyperiux list --installed` or `--stats` without a network call).

## Proposed changes

### 1. `src/utils/config.js` — detection rewrite

Replace the folder-name/dependency heuristic in `detectProjectEnvironment` with **config-file-first detection**:

```js
export function detectProjectEnvironment(cwd = process.cwd()) {
  const packageJson = readPackageJson(cwd);
  const dependencies = {
    ...(packageJson?.dependencies || {}),
    ...(packageJson?.devDependencies || {}),
  };

  const hasNextConfig = hasAnyPath(cwd, [
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "next.config.cjs",
  ]);

  if (hasNextConfig || dependencies.next) {
    return "next";
  }

  const hasViteConfig = hasAnyPath(cwd, [
    "vite.config.js",
    "vite.config.mjs",
    "vite.config.ts",
    "vite.config.cjs",
  ]);

  if (
    hasViteConfig ||
    dependencies["@vitejs/plugin-react"] ||
    dependencies.vite ||
    dependencies.react
  ) {
    return "react";
  }

  return "unknown";
}
```

Key change: drop `src/pages`/`pages`/`src/app`/`app` from the *Next-detection* OR-list entirely — those folder names are only used afterward, to distinguish router type once Next.js is already confirmed via config file or dependency.

Add a new helper for router detection, called only when `framework === "next"`:

```js
export function detectNextRouter(cwd = process.cwd()) {
  if (hasAnyPath(cwd, ["src/app", "app"])) return "app";
  if (hasAnyPath(cwd, ["src/pages", "pages"])) return "pages";
  return null; // can't tell — e.g. brand new project, ask the user
}
```

Update `detectCssPath(cwd, framework, router)`:

```js
export function detectCssPath(
  cwd = process.cwd(),
  framework = detectProjectEnvironment(cwd),
  router = framework === "next" ? detectNextRouter(cwd) : null
) {
  const reactPaths = [
    "src/index.css",
    "src/main.css",
    "src/App.css",
    "src/styles.css",
    "src/styles/globals.css",
    "styles/globals.css",
  ];

  const nextAppPaths = [
    "src/app/globals.css",
    "app/globals.css",
  ];

  const nextPagesPaths = [
    "src/styles/globals.css",
    "styles/globals.css",
  ];

  const genericPaths = [...reactPaths, ...nextAppPaths, ...nextPagesPaths];

  let candidates;
  if (framework === "react") candidates = reactPaths;
  else if (framework === "next" && router === "pages") candidates = nextPagesPaths;
  else if (framework === "next") candidates = nextAppPaths; // app router or unknown router
  else candidates = genericPaths; // "unknown" framework — don't assume Next

  for (const cssPath of candidates) {
    if (fs.existsSync(path.join(cwd, cssPath))) return cssPath;
  }

  const usesSrc = fs.existsSync(path.join(cwd, "src"));

  if (framework === "react") return usesSrc ? "src/index.css" : "styles/globals.css";
  if (framework === "next" && router === "pages") {
    return usesSrc ? "src/styles/globals.css" : "styles/globals.css";
  }
  if (framework === "next") return usesSrc ? "src/app/globals.css" : "app/globals.css";

  // "unknown" — framework-neutral default, no Next assumption
  return usesSrc ? "src/styles.css" : "styles/globals.css";
}
```

Update `DEFAULT_CONFIG` to add a `router` field (`null` until detected) and an `installedEffects` field (see §3):

```js
const DEFAULT_CONFIG = {
  $schema: "https://vault.hyperiux.com/schema.json",
  framework: "next",
  router: null,
  tailwind: {
    config: "tailwind.config.js",
    css: "src/app/globals.css",
  },
  aliases: {
    components: "@/components",
    effects: "@/components/effects",
    hooks: "@/hooks",
    lib: "@/lib",
  },
  installedEffects: {},
};
```

Keep `framework` as `"next"` (not `"next-app"`/`"next-pages"`) for backward compatibility with existing `hyperiux.json` files and the existing test suite — router is a separate, additive field.

### 2. `src/commands/init.js` — framework-aware guidance

- Call `detectNextRouter(cwd)` when `framework === "next"`, store it on `config.router`, and pass `router` into `detectCssPath(cwd, framework, router)`.
- Include `router` in the `trackCliEvent("init", {...})` payload alongside the existing `framework` field.
- Branch the printed "next steps" text:
  - Next App Router (`router === "app"`): mention `app/layout.js` as where global CSS is typically imported.
  - Next Pages Router (`router === "pages"`): mention `pages/_app.js`.
  - React/Vite: mention `main.jsx`/`main.tsx`.
  - `"unknown"`: keep the current generic message, but explicitly prompt the user to double-check/adjust `hyperiux.json`'s `tailwind.css` path themselves, since detection couldn't confirm a framework.

### 3. Real install counting — how many *users* ran `add <effect>`

**Important distinction:** a field written into the user's own `hyperiux.json` (like a local `installedEffects` map) only ever reflects that one project. It cannot answer "how many actual users installed effect X" — every user's copy is invisible to every other user, there's no aggregation point. That number can only come from a **server that receives one event per install across all users** and counts them.

The CLI already has exactly that mechanism: `src/utils/telemetry.js`'s `trackCliEvent("add", {...})`, called at the end of `add.js` (`src/commands/add.js` ~line 266), POSTs to `HYPERIUX_TELEMETRY_URL` (default `${APP_URL}/api/cli/telemetry`) on every successful install, with an anonymized per-project hash id, the effect name, framework, etc. This is the correct and only mechanism for a real per-effect install count — the work needed is **server-side**, not another client-side field:

1. **Persist each event.** The `/api/cli/telemetry` endpoint (wherever it lives in the `apps/docs` Next.js app, e.g. `apps/docs/src/app/api/cli/telemetry/route.js`) needs to write incoming `{ event: "add", properties: { effect, ... }, anonymousId, timestamp }` payloads to a datastore (Postgres/Supabase/etc — whatever this project already uses) instead of just accepting and discarding them. Check whether that route currently exists and persists anything; if it only logs or 200s without storing, that's the actual gap to close.
2. **Deduplicate by user, not by event.** A raw event count overcounts a user who reinstalls the same effect (e.g. `--overwrite`, or after `rm -rf` + reinstall). To count *users*, dedupe on `(anonymousId, effect)` — e.g. an `UPSERT ... ON CONFLICT (anonymous_id, effect) DO UPDATE SET last_installed_at = now()` — so re-running `add` on the same machine/project doesn't inflate the count. `COUNT(DISTINCT anonymous_id) WHERE effect = 'blur-text'` then gives the real per-effect user count.
3. **Expose an aggregate.** Add a read endpoint (e.g. `GET /api/cli/stats/:effect` or a batch `/api/cli/stats`) that returns `{ effect, installCount }` from the dedup'd table, for use on the docs site (e.g. showing "1.2k installs" on an effect's detail page) or internal dashboards.
4. **No CLI-side change needed** beyond what already exists — `trackCliEvent` already fires the right event with the right shape. The only CLI-side improvement worth making here is ensuring the call isn't accidentally skipped in edge paths (e.g. it currently only fires after a fully successful non-dry-run `add`, which is correct — dry runs and cancelled installs should not count).

If a fully offline/local indicator is *also* wanted (e.g. so a user can see what they've personally installed without a network call, or so `hyperiux list` can show local status), that's a separate, secondary feature — an `installedEffects` map in `hyperiux.json` as sketched in earlier drafts of this doc — but it does not answer "how many users installed this" and should not be conflated with the real counting mechanism above.

## Files to touch

- `src/utils/config.js` — `detectProjectEnvironment`, new `detectNextRouter`, `detectCssPath`, `DEFAULT_CONFIG`
- `src/commands/init.js` — detect + store `router`, branch printed guidance, include `router` in telemetry payload
- `src/tests/config.test.js` — add cases for:
  - Next App Router vs Pages Router CSS path selection
  - `"unknown"` framework no longer defaulting to Next-shaped CSS path
  - Regression test: a Vite project with a `src/pages/` folder must still detect as `"react"`, not `"next"`
- Server side (`apps/docs`, wherever `/api/cli/telemetry` lives): add persistence + dedup + a stats read endpoint per §3. This is the part that actually answers "how many users installed effect X" — no client-side file can.

## Verification

- `cd packages/cli && npx vitest run` — extended `config.test.js` cases pass.
- Manual: `node src/index.js init -y` inside three scratch projects (Next App Router, Next Pages Router, Vite/React), confirming `hyperiux.json`'s `framework`/`router`/`tailwind.css` come out correct and the printed guidance text matches.
- Manual: run `node src/index.js add blur-text` (not `--dry-run`, which currently skips the telemetry call) against a local/staging telemetry endpoint and confirm a row is persisted and `COUNT(DISTINCT anonymous_id)` for that effect increments once per distinct project, not per run.

## Is telemetry the only way to count real installs? No — alternatives

Telemetry (an explicit event the CLI sends home) is the standard approach and the one already half-built here, but it's not the only option. Trade-offs below.

### A. CLI telemetry POST (current approach, §3 above)
- **How:** CLI calls home on every `add`; server persists + dedupes.
- **Pros:** Most accurate, gives per-effect *and* per-framework/per-package-manager breakdowns, works offline-tolerant (fire-and-forget, doesn't block install), already implemented client-side.
- **Cons:** Requires a live backend endpoint; users can opt out (`HYPERIUX_TELEMETRY_DISABLED`/`DO_NOT_TRACK`), so it's a lower bound, not exact; needs privacy disclosure (README/docs should state what's collected).

### B. npm registry download counts (if effects were ever published as individual npm packages)
- **How:** Each effect ships as `npm i @hyperiux/effect-name`; use the public npm API (`https://api.npmjs.org/downloads/point/last-week/<pkg>`) to get download counts per package, no telemetry code needed.
- **Pros:** Zero instrumentation, zero privacy concerns, numbers are public/trustable, industry-standard signal (this is how most component libraries report popularity, e.g. npm trends).
- **Cons:** Doesn't match this project's actual distribution model — effects are copy-pasted file bundles via a shadcn-style registry fetch (`GET /r/<name>.json`), not individually published npm packages. Would require restructuring distribution entirely; not a small change.

### C. Registry-fetch server logs (no explicit telemetry event at all)
- **How:** Every `add` already does `fetchRegistry(effectName)` → `GET {REGISTRY_URL}/{name}.json` (`src/utils/registry.js`). If that endpoint is served from infrastructure you control (Vercel/Next.js API route or a CDN/edge function in front of `apps/docs/public/r/`), you can count **fetches of that JSON file** per effect from existing access logs / edge analytics (Vercel Analytics, Cloudflare, or a lightweight counter in the API route itself) instead of adding a separate telemetry call.
- **Pros:** No new opt-out surface, no new event schema — reuses a request that already has to happen for the install to work at all; simpler than telemetry since there's nothing to explicitly send, just something to count on receipt.
- **Cons:** Counts *fetches*, not *successful installs* — a fetch that's interrupted (network drop, user Ctrl-C's before files are written, `--dry-run` still fetches) gets counted even though nothing was installed. Also can't distinguish unique users as cleanly unless you add the same anonymous-id header telemetry already uses — so in practice this converges back to needing something like §3's dedup logic anyway, just moved earlier in the flow.
- **Note:** the local dev/monorepo fallback path in `registry.js` (serving from `apps/docs/public/r/` directly on disk when running inside the repo) bypasses any server entirely, so this only counts real external users, not internal dev testing — actually a minor advantage over telemetry, which needs an explicit `HYPERIUX_TELEMETRY_URL` override for the same isolation.

### D. GitHub-based signals (no server needed at all)
- **How:** If effects are also documented/starred/referenced individually (e.g. per-effect GitHub Discussions reactions, or a "copy install command" click tracked via a static analytics snippet on the docs site's effect detail page), use existing GitHub API (`stars`, `traffic/clones` if the repo is public) or docs-site pageview analytics (Vercel Analytics/Plausible on `/effects/[slug]`) as a **proxy** for install interest.
- **Pros:** Genuinely zero backend work if docs-site analytics already exists; no privacy/consent complexity since it's page-level, not tied to individual CLI runs.
- **Cons:** Weakest signal — a docs page view or a GitHub star is not an install. Only useful as a rough popularity proxy, not an actual count of "how many users ran `add`."

### Recommendation
Stick with **A (telemetry, §3)** as the primary mechanism — it's the only option here that directly measures the actual event ("a user ran `add <effect>` and it succeeded"), and the CLI-side plumbing already exists. **C (registry-fetch logs)** is worth layering in later as a lightweight sanity check/lower-bound cross-reference since it's nearly free, but shouldn't replace A because it can't distinguish a completed install from an interrupted fetch. B and D don't fit this project's distribution model or are too weak a signal to be the source of truth.
