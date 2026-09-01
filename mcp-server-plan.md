# Hyperiux MCP Server - Plan (Phase 3)

**Status: planning only. Nothing in this document has been implemented.**

## Description

The Hyperiux MCP server (`hyperiux-mcp-server`, package at `packages/mcp-server`) is a [Model Context Protocol](https://modelcontextprotocol.io) server that lets AI coding tools - Claude (Desktop, Code, claude.ai), Cursor, Codex, and any other MCP-compatible client - browse, search, and inspect Hyperiux Vault's catalog of React/Next.js interaction effects directly from a conversation, without a human first going to vault.hyperiux.com or reading source by hand.

Given a spoken intent ("what cursor effects are there", "show me the code for dotted-grid", "what does this effect depend on"), an AI agent calls one of the server's tools and gets back structured JSON: effect names/categories, full metadata (description, tier, version, dependencies, changelog), and - for effects the caller is entitled to - installable source. That lets the agent propose or write a correct `npx hyperiux add <effect>` command and a correct import statement instead of guessing or hallucinating component names, props, or install steps.

It reuses the same registry and auth as the `hyperiux` CLI (`hyperiux login` / `HYPERIUX_TOKEN`), so an agent effectively gets the same access a human running the CLI locally would have - free effects always, Pro effects only with a valid token, and never a fabricated substitute when access is missing.

## Summary - what we have to do

Short version: **the server already exists and works - don't rebuild it.** Close these gaps, roughly in priority order:

1. **Publish it.** Add `packages/mcp-server` to `release.yml`'s publish step. Right now `npx -y hyperiux-mcp-server` - the install command in the package's own README - fails, because it's never actually been pushed to npm.
2. **Test the tool layer.** `list-effects.ts`, `get-effect.ts`, `list-categories.ts` have zero tests today; only the registry client underneath them is tested. Add `tools/*.test.ts` covering pagination, truncation, category filtering, and - security-relevant - that Pro source never appears in tool output text when the caller is unauthenticated.
3. **Surface data that's already available but not exposed.** Add `previewUrl`/`importPath`/`target`/`main` to `types.ts` and return a resolved `preview_url`/`import_statement` from `get_effect`. No new fetching required - the fields already flow through the client, they're just not read or returned yet.
4. **Fix the stale docs.** Root `README.md`'s Architecture section and `CONTRIBUTING.md` both predate `packages/mcp-server` and don't mention it.
5. **Decide, then build, the missing tools** - `get_component_constraints`, `get_component_dependencies` (transitive), and, once a real props source exists, `get_component_usage` / `validate_component_usage`, plus `recommend_components`. These are real, valuable additions, but each is blocked on an open decision (§9) or a data source that doesn't exist yet (props - §5), so they come after 1-4, not alongside them.
6. **Fix the tier-reporting gap upstream**, if this team owns or can influence the private app's `build:registry` script - `hyperiux_list_effects`/`hyperiux_list_categories` currently can't say which effects are Pro vs. free at the list level (§1.5). This isn't fixable from inside `packages/mcp-server` alone; the data is missing further up the pipeline.

Items 1-4 are the "next MVP" (§10) - small, low-risk, and don't require any of the open decisions in §9 to be resolved first. Items 5-6 need a decision or external coordination before work starts.

## 0. The headline finding

The brief for this plan assumed an MCP server needed to be designed from scratch. It doesn't - **one already exists** at [`packages/mcp-server`](packages/mcp-server), added in commit `1f980bb` ("Phase 2: MCP server for the Vault effect registry (#6)", merged 2026-07-27). It is a real, working, tested package: stdio transport, 3 tools, auth reuse from the CLI, and full CI coverage (lint/test/build/smoke in `ci.yml`).

So this plan is **not** a from-scratch design. It's a gap analysis of what exists vs. what the original brief wants, plus a phased plan to close the gaps that matter. Every section below is written against the real code, not a hypothetical.

---

## 1. Current repo findings

### 1.1 Monorepo shape
- pnpm workspace (`pnpm-workspace.yaml`: `apps/*`, `packages/*`) + Turborepo (`turbo.json`).
- `packages/cli` - published to npm as **`hyperiux`** (v1.0.77). Explicitly self-described in its own `package.json` as "a CLI installer only... not an importable JavaScript/TypeScript library." This matters for question 8 below.
- `packages/mcp-server` - **exists, unpublished**. Package name `hyperiux-mcp-server`, bin `hyperiux-mcp`, version `0.1.0`.
- `registry/effects/**` - the 32 free effects' source + `registry.json`, organized by category. This is the only registry content that lives in this repo.
- `registry/index.json` - a flat local index of those 32 free effects (name/title/category/registryPath/importPath/target). No `tier` or `categories` (plural) field.
- `apps/docs` - referenced throughout READMEs/CI as "the private app" that hosts vault.hyperiux.com, the `build:registry` script, the protected Pro API, and Pro effect source. **Not present in this repo** (untracked/not committed - confirmed via `git ls-files apps/`, empty). Its `build:registry` turbo task target (`apps/docs/public/r/**`) is defined in `turbo.json` but the app itself is external. Pro effects do not exist anywhere in this checkout.

### 1.2 The MCP server as it exists today
`packages/mcp-server/src/`:
- `index.ts` - boots `McpServer` (`@modelcontextprotocol/sdk` `^1.6.1`), registers 3 tools, connects `StdioServerTransport`.
- `registry-client.ts` - `fetchRegistryIndex()`, `fetchPublicEffect()`, `fetchProtectedEffect()`, `fetchEffect()` (auth-aware wrapper). All hit the **live deployed registry** (`https://vault.hyperiux.com/r`, overridable via `HYPERIUX_REGISTRY_URL`/`HYPERIUX_APP_URL`) via `fetch()` - it does **not** read this repo's local `registry/` folder at all, unlike the CLI's `fetchRegistry()`, which checks local candidates first (`packages/cli/src/utils/registry.js:83-93`).
- `auth.ts` - reads `~/.hyperiux/auth.json` (same file `hyperiux login` writes) or `HYPERIUX_TOKEN` env var. Byte-for-byte the same precedence as `packages/cli/src/utils/auth.js`.
- `types.ts` - `RegistryIndexItem`, `RegistryEffect`, `RegistryError`.
- `constants.ts` - URLs + `CHARACTER_LIMIT = 25000` (response truncation guard).
- `tools/list-effects.ts` → tool `hyperiux_list_effects` - query/category/limit/offset over the index.
- `tools/get-effect.ts` → tool `hyperiux_get_effect` - full detail by exact slug, optional source.
- `tools/list-categories.ts` → tool `hyperiux_list_categories` - category counts.
- `auth.test.ts`, `registry-client.test.ts` - vitest, mocked `fetch`/`fs`, good coverage of the client layer.

CI (`.github/workflows/ci.yml`) already lints, tests, builds, and smoke-boots `packages/mcp-server` on every push/PR to `main`/`develop`/`phase-2-dev`. **`release.yml` (npm publish) only publishes `packages/cli`** - `hyperiux-mcp-server` has never been published, so the install instructions in its own `README.md` (`npx -y hyperiux-mcp-server`) don't work yet.

### 1.3 Documentation drift
- Root `README.md`'s "Architecture" section (line ~367) lists only `packages/cli` and `registry/effects` - doesn't mention `packages/mcp-server`.
- `CONTRIBUTING.md` (line 3, 16) explicitly says "it only contains `packages/cli` and `registry/effects`" - same staleness.
- `packages/mcp-server/README.md` is accurate and self-contained, including an honest "Known limitation" section about the tier gap (see 1.5).

### 1.4 `registry.json` schema (ground truth, from the 32 files under `registry/effects/`)
Fields actually in use: `name`, `type`, `title`, `description`, `category`, `dependencies`, `registryDependencies`, `previewUrl`, `tier`, `subfolder`, `main`, `exportName`, `exportKind`, `importPath`, `target`, `files[]` (`path`, `target`), `version`, `changelog[]` (`version`, `date`, `summary`, `breaking`), plus occasionally `packageName`, `coverImage`, `videoUrl`, `sourcePath`.

No `props`, `propsSchema`, or `constraints` field exists anywhere in the schema, in `CONTRIBUTING.md`'s authoring template, or in the private app (confirmed nothing else to inspect - `apps/docs` is empty in this checkout).

### 1.5 The tier gap (real, already documented in-repo)
`registry/index.json` (local) and the deployed `index.json` the MCP server reads both **omit `tier`** at the index level - only each effect's individual `registry.json`/API response carries `tier`. This is called out in three places already:
- `packages/mcp-server/src/registry-client.ts:9-14` (code comment)
- `packages/mcp-server/README.md`'s "Known limitation" section
- `packages/cli/src/utils/registry.js`'s `normalizeRegistryIndex()` defensively defaults missing `tier` to `"free"` (`getRegistryTier()`), which means `hyperiux list` silently mislabels this today too.

Net effect: `hyperiux_list_effects`/`hyperiux_list_categories` cannot tell an AI agent which effects are Pro vs. free - only `hyperiux_get_effect` on an exact slug can. An agent that lists effects by category and assumes they're all installable free will be wrong until it double-checks each one.

### 1.6 Props/usage documentation reality
The only *component-props* documentation in the entire repo is **hand-written Markdown prose in the root `README.md`** (a table for `phantom-image-trail`, lines 106-140) - not structured data, not present for the other 31 free effects, not present for any of the 83 Pro effects (their source isn't in this repo), and not derivable from the registry API today.

No consistent, structured component-props schema exists anywhere. A few files do contain `@param` JSDoc (e.g. `registry/effects/scroll/split-canvas/createSuspendedRaf.js`), but it documents internal helper functions (`createSuspendedRaf(options)`), not the exported component's props - coverage is incomplete and inconsistent, not absent. Exported components themselves are plain destructured function parameters with default values (e.g. `function DottedGrid({ intensity = 5 })`), which carries no type/description metadata beyond the default value. Any future props-parsing work should prefer component-level JSDoc when it's present above the exported function, then fall back to destructured-parameter/default-value inference where it isn't - not assume one universal source. 34 of 56 `.jsx` files declare `"use client"`; nothing structured records this today.

### 1.7 CLI command structure (for question 8)
`packages/cli/src/index.js` wires each subcommand (`init`, `add`, `list`, `outdated`, `versions`, `diff`, `login`, `logout`, `whoami`) via Commander, one file per command under `src/commands/`. `packages/cli`'s own `package.json` description states it is deliberately **not** a library and has zero `@modelcontextprotocol/sdk` dependency today.

### 1.8 Auth/Pro handling (for question 9) - already correct, no redesign needed
`fetchEffect()` in the MCP server: fetches public metadata first; if `tier` is `pro`/`paid` and no token is available, returns public metadata with source stripped (never calls the protected route); if a token is available, calls the same protected API route the CLI uses (`/api/cli/effects/:name`) and falls back to the public response on 401/403. `get-effect.ts` surfaces this as `source_locked: true` + a `source_locked_reason` string, never as a thrown error. This is a sound design already validated by tests (`registry-client.test.ts`, 3 explicit branches: free/no-token, pro/no-token, pro/token).

### 1.9 Security posture
The MCP server is **read-only** - it writes nothing to disk, so `packages/cli/src/utils/registry.js`'s path-traversal defenses (`SAFE_PATH` regex, `isSafeTargetPath()` containment check, `ALLOWED_ASSET_HOSTS` allowlist for binary assets) have no direct equivalent needed yet in the MCP server. This becomes relevant only if a future tool ever writes files or fetches binary assets (see §9, open decisions).

---

## 2. Recommended architecture

**Keep `packages/mcp-server` where it is.** It already matches every convention in this monorepo (sibling to `packages/cli`, in `pnpm-workspace.yaml`, wired into `turbo.json`/`ci.yml`, own `package.json`/bin/tests). Question 1 from the brief ("inside packages/mcp? inside cli? a script?") is settled by precedent - no reason to move it or restructure.

**Keep stdio as the only transport for now.** It's already implemented and is what Claude Desktop, Claude Code, and Cursor all expect from a local MCP server config (`command`/`args` in `.mcp.json` / `claude_desktop_config.json`). HTTP/SSE (or the newer Streamable HTTP transport) only becomes relevant if Hyperiux wants to offer a **hosted** remote MCP endpoint (e.g. `https://vault.hyperiux.com/mcp`) that doesn't require a local Node process - that's a materially different, higher-effort project (needs auth over HTTP instead of a local token file, rate limiting, hosting). Recommend treating it as an explicitly separate future initiative, not part of this phase.

**Keep the MCP server reading the live deployed registry, not this repo's local `registry/` folder.** Unlike the CLI (which runs inside a target project and legitimately wants to prefer local/dev registries), the MCP server's job is "tell any AI agent, anywhere, what Hyperiux Vault has" - the live registry is the correct source of truth for that, and env var overrides (`HYPERIUX_REGISTRY_URL`) already cover local development/testing against a dev build. No change needed here either.

---

## 3. Proposed tools/resources - gap analysis against the brief's suggested list

| Suggested tool | Status | Notes |
|---|---|---|
| `list_components` | **Exists** as `hyperiux_list_effects` | |
| `search_components` | **Folded in** - `hyperiux_list_effects`'s `query` param | No separate tool needed; a second tool doing the same substring match would be redundant |
| `get_component` | **Exists** as `hyperiux_get_effect` | |
| `get_component_usage` | **Missing** | Blocked on props data existing at all (§1.6) - see Phase 2/3 |
| `get_component_files` | **Partially covered** | `get_effect`'s `files[]` has `path` + optional `content`; no dedicated tool, no target-path resolution, no import-statement |
| `get_component_constraints` | **Missing** | No structured constraints data exists; can synthesize a useful version from what *does* exist (see §4) |
| `get_component_dependencies` | **Folded in**, but shallow | `get_effect` returns one-level `dependencies`/`registryDependencies`; no transitive resolution (the CLI's `add.js` *does* recursively install `registryDependencies` - MCP callers currently don't see the full closure) |
| `recommend_components` | **Missing** | Needs a ranking heuristic decision (§9) |
| `get_install_command` | **Folded in** | `get_effect.install_command` already returns `npx hyperiux add <name>` |
| `validate_component_usage` | **Missing** | Blocked on `get_component_usage` existing first - can't validate against a schema that doesn't exist |

**Resources**: none exist. The SDK supports `server.registerResource(...)`, but `index.ts` only calls `registerTool`. Claude Code/Claude Desktop/Cursor today drive almost entirely off tools (and prompts), not resources - resources are lower ROI here and are **not recommended** for this phase. If ever added, they should be thin wrappers around the same `registry-client.ts` functions the tools already use (`hyperiux://components`, `hyperiux://components/{slug}`, `hyperiux://categories`), not a second data path.

---

## 4. Exact tool input/output schemas

### 4.1 Existing tools - no schema changes needed, but real gaps in their *output*
`hyperiux_get_effect`'s output today (`get-effect.ts:75-97`) is: `name, title, description, tier, version, dependencies, changelog, install_command, files[{path, content?}]`. It does **not** surface `previewUrl`, `importPath`, `target`, `main`, or the resolved **import statement** (`import { DottedGrid } from "@/components/effects/dotted-grid";`) - even though `add.js` computes exactly this string today (`getImportPath()`/`getMainFile()`, `add.js:333-343`) and the underlying data (`importPath`, `main`) is already present in every `registry.json` and flows through `fetchPublicEffect()`. This is the single cheapest, highest-value fix available: the data already exists, `types.ts` just doesn't declare the fields and `get-effect.ts` just doesn't read them.

**Proposed extension to `RegistryEffect` (`types.ts`)**:
```ts
export interface RegistryEffect {
  // ...existing fields...
  previewUrl?: string;
  importPath?: string;
  target?: string;
  main?: string;
}
```

**Proposed addition to `hyperiux_get_effect`'s output**:
```json
{
  "name": "dotted-grid",
  "title": "Dotted Grid",
  "...": "...existing fields unchanged...",
  "preview_url": "https://vault.hyperiux.com/demo/dotted-grid",
  "import_statement": "import { DottedGrid } from \"@/components/effects/dotted-grid\";"
}
```
(`import_statement` built the same way `add.js` does - by `exportKind`, from `importPath` + `exportName` - so behavior stays consistent with what the CLI actually installs.)

### 4.2 New tool: `get_component_constraints`
Synthesizes a constraints answer from data that already exists, rather than inventing a new schema field. This is deliberately conservative - it reports what's actually knowable today, not hypothetical per-component structured metadata (that's Phase 3, see §5).

**Input**:
```ts
{ name: string } // exact slug
```
**Output**:
```json
{
  "name": "dotted-grid",
  "requires_client_component": true,
  "client_component_reason": "Source contains a \"use client\" directive (detected from file content when available; if source is not included in the response, this reflects the last-known value for this slug and should be re-verified with include_source=true).",
  "reduced_motion": {
    "mentioned_in_changelog": true,
    "notes": "v1.1.0 added prefers-reduced-motion support with a static canvas fallback; v1.1.1 added a visible reduced-motion notice."
  },
  "licensing_notes": [
    "Depends on gsap - GSAP's premium plugins (SplitText, ScrollTrigger, etc.) require a commercial GSAP license; see gsap.com/licensing."
  ],
  "tier_notes": "Free effect - source is always included.",
  "general_constraints": [
    "Preserve the relative file structure under files[].path when writing multiple files for one effect.",
    "Respect the project's hyperiux.json aliases (components/effects/hooks/lib) instead of hardcoding src/components/effects/... - this server does not know the target project's aliases (see open decision in §9).",
    "Do not invent props that aren't present in the source or in get_component_usage's output.",
    "Avoid changing component internals beyond what the user asked for; these are meant to be owned/customized post-install, not treated as a black-box library."
  ]
}
```
`requires_client_component` is derived by grepping `files[].content` for `"use client"` when source is present (free effects, or Pro with a valid token); when source isn't present, omit the boolean and say so explicitly rather than guessing. `licensing_notes` is a static lookup keyed off `dependencies` (currently just a `gsap` → GSAP licensing note, `three` → no special note needed) - a hardcoded table, not a new registry field.

### 4.3 New tool: `get_component_dependencies` (transitive)
**Input**:
```ts
{ name: string, resolve_transitive?: boolean /* default true */ }
```
**Output**:
```json
{
  "name": "immersive-full-screen-nav",
  "npm_dependencies": ["gsap"],
  "registry_dependencies": ["elevate-navbar"],
  "resolved_registry_dependencies": ["elevate-navbar"],
  "install_command": "npx hyperiux add immersive-full-screen-nav"
}
```
`resolved_registry_dependencies` walks the same recursive chain `add.js` walks at install time (`add.js:298-313`), flattened and de-duplicated, so an agent knows the *complete* set of effects that will actually land on disk - not just the direct one level `get_effect` already exposes.

### 4.4 New tool: `get_component_usage` (Phase 2 - see §5 for why this is phased)
**Input**:
```ts
{ name: string, include_examples?: boolean /* default true */ }
```
**Output when props are derivable** (free effect, source available):
```json
{
  "name": "phantom-image-trail",
  "export_name": "PhantomImageTrail",
  "export_kind": "default",
  "import_statement": "import PhantomImageTrail from \"@/components/effects/phantom-image-trail\";",
  "props_source": "derived-from-source",
  "props": [
    { "name": "images", "type": "Array<{src, alt?}> | string[]", "default": null, "required": false, "description": null },
    { "name": "enableRotation", "type": "boolean", "default": true, "required": false, "description": null }
  ],
  "usage_example": null
}
```
**Output when props are not derivable** (Pro effect without a token, or a free effect the parser can't confidently handle):
```json
{
  "name": "spotlight-text",
  "props_source": "unavailable",
  "props": null,
  "note": "Props could not be determined: this is a Pro effect and no Hyperiux token is available, so source was never fetched. Run `hyperiux login` or set HYPERIUX_TOKEN, then retry with include_source=true on get_component."
}
```
Note `type` in the free-effect example above is a best-effort inference from default-value literals and any inline comments - **not** a guaranteed-accurate type; the tool description must say so plainly so agents don't over-trust it (see §5, Phase 2 caveats). `description` per-prop will be populated when the source effect has component-level JSDoc to parse (uncommon today but present in a handful of files, per §1.6) and `null` otherwise; only Phase 3 (explicit authored `props` in `registry.json`) can reliably fill it in for every effect.

### 4.5 New tool: `validate_component_usage` (Phase 3 - blocked on 4.4 having real schemas)
**Input**:
```ts
{ name: string, props: Record<string, unknown> }
```
**Output**:
```json
{
  "valid": false,
  "errors": [{ "prop": "imageMultiplier", "issue": "expected number, got string" }],
  "unknown_props": ["colour"],
  "missing_required_props": []
}
```
Not buildable until a real props schema exists per §4.4/§5 - listed here only to fix the exact shape for later.

### 4.6 New tool: `recommend_components` (Phase 3+ - see §9 for the ranking-heuristic decision)
**Input**:
```ts
{ intent: string, category?: string, limit?: number /* default 5 */ }
```
**Output**:
```json
{
  "intent": "eye-catching animated hero background with particles",
  "recommendations": [
    { "name": "spider-particles", "title": "Spider Particles", "category": "backgrounds", "score": 0.82, "reason": "category=backgrounds; keyword overlap: particles, interactive" }
  ]
}
```

---

## 5. How prop information should be derived (question 7, direct answer)

Phased, exactly as the brief suggested, but now grounded in what's actually in this repo:

- **MVP (already shipped)**: registry metadata + file list, no props. This is where the code is today.
- **Phase 2**: best-effort static parsing of each free effect's `index.jsx`, preferring component-level JSDoc immediately above the exported function when present (rare today, but real - see §1.6), and falling back to destructured-parameter defaults (`function X({ a = 1, b = "x" })`) when it isn't. This only works for the 32 free effects whose source lives in this repo/registry - **Pro effects' props can never be derived this way by this server**, because it only ever sees Pro source when a caller both has a valid token *and* passes `include_source: true`, and even then it's a one-off fetch, not something to statically analyze as part of building a catalog-wide props index. Phase 2 output must be explicit about this asymmetry (`props_source: "derived-from-source"` vs `"unavailable"`), not silently return nothing.
- **Phase 3**: an explicit `props` array added to `registry.json` (and to `CONTRIBUTING.md`'s authoring template), hand-authored per free effect, mirrored on the private/Pro side for parity. Most reliable, highest authoring cost - realistically only worth doing once Phase 2's parsed output has been used enough to know which effects actually need it (many of these effects have few/no props at all - the `phantom-image-trail` README table is the one existing example, and it has ~30 props, an outlier).

---

## 6. Security / auth behavior

No design changes needed to what already exists (§1.8) - it's correct and tested. Two things to carry forward into any new tool:

1. **Never widen access beyond what `fetchEffect()` already gates.** Any new tool that touches `files[].content` (e.g. `get_component_usage` parsing source) must go through the existing `fetchEffect()`/token flow, not add a second path to the protected API.
2. **No new tool should write to disk.** The moment any tool does (e.g. a hypothetical "install via MCP"), it must reuse `packages/cli/src/utils/registry.js`'s `SAFE_PATH` validation and `isSafeTargetPath()` containment check verbatim - this repo already had to think hard about path-traversal here (`add.js:245-249`, `registry.js:390-401`) and a new implementation shouldn't re-derive it from scratch or, worse, skip it.

A "no Pro source leakage" test should exist at the **tool output** layer, not just the `registry-client` layer it has today (see §7) - i.e. assert that `hyperiux_get_effect`'s JSON *text* never contains a Pro effect's `content` field when unauthenticated, since that's the actual contract an AI agent (and a human reading tool output) depends on.

---

## 7. Testing plan

**Already covered** (`auth.test.ts`, `registry-client.test.ts`): index fetch success/malformed/network-error, public-effect fetch incl. 404→null, `fetchEffect`'s free/pro-no-token/pro-with-token branching, auth token precedence (env > file), corrupt-JSON auth file, missing auth file.

**Real gap**: `packages/mcp-server/src/tools/*.ts` has **zero test files**. Nothing exercises the actual `registerTool` handlers - pagination math (`has_more`/`next_offset`), the `CHARACTER_LIMIT` truncation branch, category filtering against `categories[]` vs. singular `category`, or `formatError`'s `RegistryError` vs. generic-`Error` formatting. This is the single biggest existing gap and should be closed regardless of which new tools are added:

- `tools/list-effects.test.ts` - query/category/limit/offset combinations, pagination boundary (`total === offset + limit`), truncation when JSON exceeds `CHARACTER_LIMIT`.
- `tools/get-effect.test.ts` - not-found message shape, `source_locked` branch, **explicit assertion that `files[].content` is absent when `include_source` is false or the effect is an unauthenticated Pro effect** (the tool-layer "no leakage" test called out in §6).
- `tools/list-categories.test.ts` - count aggregation across `categories[]` vs. `category` fallback, sort order.
- New tools (§4) each get the same treatment as they're built.

---

## 8. Files likely to change (not edited yet)

- `.github/workflows/release.yml` - add a publish step for `packages/mcp-server` (currently only `packages/cli` is published; this is why `npx -y hyperiux-mcp-server` doesn't work today).
- `packages/mcp-server/src/types.ts` - add `previewUrl`/`importPath`/`target`/`main` to `RegistryEffect`.
- `packages/mcp-server/src/tools/get-effect.ts` - surface `preview_url`/`import_statement`.
- `packages/mcp-server/src/tools/*.test.ts` - new, closing the gap in §7.
- `packages/mcp-server/src/tools/get-component-constraints.ts` - new.
- `packages/mcp-server/src/tools/get-component-dependencies.ts` - new.
- `packages/mcp-server/src/tools/get-component-usage.ts` - new (Phase 2).
- `packages/mcp-server/src/index.ts` - register new tools.
- `packages/mcp-server/README.md` - update tool list once new tools land; update/remove the tier-gap "Known limitation" note if §1.5 is ever fixed upstream (that fix lives in the private app's `build:registry`, outside this repo's control).
- `README.md` (root) - fix the stale "Architecture" section to mention `packages/mcp-server`.
- `CONTRIBUTING.md` - fix "it only contains `packages/cli` and `registry/effects`"; add a props-authoring section if/when Phase 3 lands.
- `registry/*/registry.json` + `CONTRIBUTING.md`'s template - only if Phase 3 structured `props`/`constraints` fields are adopted.
- *(optional, pending §9 decision)* `packages/cli/src/commands/mcp.js`, `packages/cli/src/index.js` - only if a convenience `hyperiux mcp` subcommand is pursued.

---

## 9. Open decisions (need a call before implementing)

1. **CLI integration (question 8)**: `packages/cli` deliberately has zero MCP SDK dependency and bills itself as "installer only, not a library." Recommend **not** merging `hyperiux-mcp-server` into `packages/cli`'s dependency tree. Keep it a separate published package with its own `hyperiux-mcp` bin (already built this way) and just fix the real gap - actually publish it. A thin `hyperiux mcp` subcommand that prints the client-config JSON snippet (and/or shells out to `npx -y hyperiux-mcp-server` if present) is a defensible convenience add-on, but it's optional, not required to unblock anything.
2. **Aliases/target-path awareness**: the MCP server has no way to know a *specific* project's `hyperiux.json` aliases (`components`/`effects`/`hooks`/`lib`) the way the CLI does when run inside that project - it only ever knows the registry's default `target`/`importPath`. Should `get_effect`/a future `get_component_files` accept an optional `aliases` override so an agent operating inside a real checked-out project can get already-resolved paths instead of the defaults? Recommend deferring until there's a concrete client workflow that needs it - document the limitation in tool descriptions in the meantime (already partly done in §4.2's constraints output).
3. **`recommend_components` ranking heuristic**: keyword/category overlap scoring against `description` text (cheap, transparent, no new infra) vs. something embedding-based. At ~32 free + 83 Pro effects, an embeddings pipeline is very likely overkill. Recommend starting with keyword/category scoring; revisit only if recommendation quality turns out to be poor in practice.
4. **Independent publish/versioning for `packages/mcp-server`**: same `release.yml` job as `packages/cli` (both publish on `v*` tags), or does the MCP server want its own tag prefix / independent version cadence since it's a much younger package? Needs a decision before touching `release.yml`.
5. **Phase 3 `props`/`constraints` schema in `registry.json`**: since Pro effects' `registry.json` lives in a private repo this one doesn't control, any schema addition here needs the same field added on that side for parity - otherwise `get_component_usage`/`get_component_constraints` would silently work only for free effects. Worth confirming with whoever owns the private registry before committing to a schema shape.

---

## 10. What the "MVP" of *this* phase should actually be

Given the real MVP (stdio, 3 tools, auth reuse, client-layer tests, CI) already shipped, the next incremental MVP should be small and low-risk:

1. **Publish `packages/mcp-server` to npm** (add the `release.yml` step) - unblocks the package's own README, which currently documents an install command that doesn't work.
2. **Close the tool-layer test gap** (§7) - the most concrete, low-risk correctness win available, and a prerequisite for adding any new tool with confidence.
3. **Surface `preview_url`/`import_statement`/`main`/`target`** in `get_effect`'s output - the data already flows through the client, this is a types.ts + one output-object change.
4. **Fix the stale `README.md`/`CONTRIBUTING.md` architecture sections.**

Everything else (`get_component_usage`, `get_component_constraints`, `get_component_dependencies`, `recommend_components`, `validate_component_usage`, resources) is real, valuable follow-up work but should wait for the open decisions in §9 and, for props specifically, the phased approach in §5 - not be built in one pass.
