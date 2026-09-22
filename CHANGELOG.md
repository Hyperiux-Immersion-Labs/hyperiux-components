# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Release Process

**CLI (`packages/cli`) is CI-driven** (`.github/workflows/release.yml`), not
manual - it triggers on a pushed `v*` tag (plain `v`, not `cli-v`) and runs
lint, tests, build, then `npm publish --provenance` via OIDC trusted
publishing (`NPM_TOKEN` as fallback).

1. Update version in `packages/cli/package.json`
2. Add entry to this file under a new `## [x.y.z] - YYYY-MM-DD` heading
3. Commit: `git commit -m "chore: release x.y.z"`
4. Push to `main`
5. Tag and push: `git tag vx.y.z && git push origin vx.y.z` - this is what
   actually triggers the publish, not a local `npm publish`

**`packages/mcp-server` is published by hand**, not by this workflow - it
changes rarely, and riding along on every CLI tag meant an unrelated CLI
test failure (or an npm permissions gap specific to that package - both
have happened) could block a CLI release neither problem had anything to
do with. To cut an mcp-server release: bump `packages/mcp-server/package.json`,
add a `## [mcp-server x.y.z]` entry below, then `cd packages/mcp-server &&
npm publish --provenance --access public`.

---

## [Unreleased]

## [1.1.4] - 2026-09-21

### Changed
- `add.js`: better guidance when a logged-out caller hits the daily install
  limit - points at `npx hyperiux login` (raises the free limit) instead of
  going straight to `/pricing`, which now only shows once someone's already
  authenticated.
- Release workflow (`release.yml`) no longer builds/publishes
  `packages/mcp-server` - see "Release Process" above for why, and how to
  publish it by hand instead.
- Docs: effect counts corrected to 150+ total / 50+ free (heading toward
  100+ pro); the README/CLI-README "Effects" showcase had duplicate Scroll
  and WebGL sections and was missing Backgrounds, Buttons, Carousels, and
  Components entirely - rebuilt against the real registry; `packages/cli/README.md`
  now mirrors the root README exactly instead of drifting independently;
  fixed docs across README/MCP-GUIDE/CONTRIBUTING/MCP-PUBLISH-GUIDE that
  still claimed `hyperiux-mcp-server` wasn't published to npm.

### Fixed
- `add-rate-limited.test.js` asserted the old (pre-`add.js` change) logged-out
  rate-limit message, which broke release CI's quality-gate step for both
  packages even though only the CLI's messaging had changed.

## [mcp-server 0.2.0] - 2026-09-18

### Fixed
- MCP server was never actually republished after the "Support metered
  registry, rate-limits, device-id" change (`bafca0c`, 2026-08-14) started
  sending `x-hyperiux-device-id`/`x-hyperiux-mcp-version` headers on every
  registry API call - that commit never bumped `packages/mcp-server`'s own
  `package.json` version past its initial `0.1.0`, so every release CI run
  since then found `hyperiux-mcp-server@0.1.0` already on npm and silently
  skipped the publish step. `npx -y hyperiux-mcp-server` had been running
  header-less code for over a month; effect fetches made through it (e.g.
  `hyperiux_get_effect`) were tagged as CLI installs in the admin activity
  log instead of MCP installs, since the server-side route only attributes
  a request to `source: "mcp"` when that version header is present. No code
  change needed in this release - only the version bump, so CI actually
  publishes the fix that already exists in `main`.
- `hyperiux_list_effects` now includes each effect's `tier` (`"free"` or
  `"pro"`) in its response. The built registry index has carried a `tier`
  field per item for a while, but the tool's output mapping and its
  `RegistryIndexItem` type never picked it up, so the tool's own description
  told callers "does NOT return which effects are Pro vs Free" - true when
  first written, no longer true once the index gained the field, but never
  updated. In practice this meant asking an MCP client "how many free vs Pro
  effects are there" had no accurate data to answer from and would guess
  (observed: 45/105 reported vs the real 55/95). Missing/stale `tier` values
  still default to `"free"`, matching the same fallback convention already
  used elsewhere (`fetchEffect`'s pro-check, and the admin dashboard's own
  free/pro counting).

## [1.1.3] - 2026-09-08

### Changed
- Project license changed back from the Mozilla Public License 2.0 (MPL-2.0)
  to the MIT License for the CLI (`packages/cli`) and the MCP server
  (`packages/mcp-server`). Free registry effects continue under the separate
  Hyperiux Effects License (`LICENSE_EFFECTS`); Pro effects remain proprietary
  and are unaffected.
- Docs: effect counts updated to 50+ free / 100+ pro across the README, CLI
  README, CONTRIBUTING, and MCP-OVERVIEW; added a preview GIF grid to the README.

### Fixed
- CI: dropped EOL Node 20 from the `ci.yml` and `cli-ci.yml` test matrices
  (now 22 / 24) - `camera-controls@3.1.2` requires Node >=22 and was failing
  `pnpm install` before any test ran.
- CI: license-checker allowlist now includes `Zlib` (`postprocessing`) and
  `MIT*` (`@gsap/react`), and excludes `gsap@3.15.0` (non-SPDX license string).

### Security
- Pinned `hono` >=4.12.34 and `qs` >=6.16.0 via pnpm overrides, clearing the
  open Dependabot advisories (`pnpm audit` now reports no known vulnerabilities).

## [1.1.2] - 2026-08-25

### Fixed
- Root and CLI-package `README.md`: effect counts were stale (32 free / 83
  pro, actually 47 / 91); the Quick Start's `blur-text` example is Pro now
  (and used the wrong import syntax - default export, not named); the free
  effects example listed `mouse-pixelation`, also Pro now; the "pro effect"
  example (`milkyway`) was both the wrong slug (`milky-way`) and actually
  free, not pro. CLI-package README's Architecture section also incorrectly
  claimed `apps/docs` lives in this repo (it's in the separate private
  `hyperiux-pro-components` repo), and its clone URL pointed at the wrong
  GitHub org.

## [1.1.0-beta.3] - 2026-08-12

### Added
- `add` now detects whether the target project is TypeScript or plain JavaScript (`detectProjectLanguage`). When installing into a JavaScript project, it strips TypeScript syntax from the registry source (`stripTypeScriptFromReactSource`: type-only imports/exports, interfaces, type aliases, generic type arguments on hooks, `React.FC` annotations, parameter/variable type annotations, `as` casts, non-null assertions) and rewrites the target file extension (`.tsx` → `.jsx`, `.ts` → `.js`). Needed now that the registry itself is fully TypeScript - without this, a JS project would receive raw `.tsx` source with no way to consume it.
- `init` now detects missing Tailwind CSS dependencies for the project's framework and offers to install them as devDependencies before continuing. Dependency set is framework-aware: Next.js needs `tailwindcss` + `@tailwindcss/postcss` + `postcss`, Vite needs `tailwindcss` + `@tailwindcss/vite`.
- `installDependencies`/`getInstallArgs` (`src/utils/package-manager.js`) gained a `dev` option to install packages as devDependencies (`-D`/`--save-dev`), used by the new Tailwind preflight above.

## [1.1.0-beta.2] - 2026-08-07

### Added
- Anonymous CLI telemetry (`src/utils/telemetry.js`): tracks `init` and `add`/`add_blocked` events (CLI version, platform, Node version, an anonymized per-project ID - a truncated SHA-256 hash of the project path and hostname, not the path itself) to help prioritize framework/registry support. Non-blocking (1.5s timeout, silently no-ops on failure) and off by default in respect of privacy - opt out anytime with `HYPERIUX_TELEMETRY_DISABLED=1` or the standard `DO_NOT_TRACK=1`.
- `whoami` and `logout` commands, alongside the existing `login`.
- Framework and router detection, plus Tailwind/alias preflight checks, during `init` - surfaces mismatches before they turn into broken installs instead of after.
- Local install counter and registry domain migration support.

### Changed
- Project license changed from MIT to the Mozilla Public License 2.0 (MPL-2.0) for the CLI (`packages/cli`) and all free registry effects (`registry/effects`). Pro effects remain proprietary and are unaffected.
- CI release publish steps are now idempotent on already-published versions - re-running the release workflow no longer fails if a version was already pushed to npm.

### Fixed
- Release workflow: `npm publish` had no `--tag` flag, which newer npm CLI versions reject outright for prerelease versions (`npm error You must specify a tag using --tag when publishing a prerelease version.`) - every prerelease publish attempt failed before this. Now derives the npm dist-tag from the version's prerelease identifier (`beta`, `rc`, etc.), falling back to `latest` for a plain version.
- `packages/cli/package.json`'s `bin` field used a leading `./` (`"./src/index.js"`), which npm's publish-time validator silently stripped ("`bin[hyperiux]` script name ... was invalid and removed") - a published package built this way would have shipped with no working `hyperiux` executable at all. Removed the leading `./`.
- `1.1.0-beta.1` was tagged and pushed but never actually published to npm (blocked by the issue above) - superseded by this version; no `1.1.0-beta.1` exists on the registry.
- **Critical:** every CLI invocation (`--version`, `--help`, `add`, `init`, etc.) crashed at startup with `SyntaxError: The requested module '../utils/registry.js' does not provide an export named 'getFileContent'` - `diff.js` imported an export that `registry.js` no longer provided. Restored `getFileContent` as a shared export in `registry.js`; `add.js` now uses it instead of keeping its own private duplicate.
- `add --yes` (without `--overwrite`) on a project with existing, customized effect files silently overwrote them instead of skipping - the interactive confirmation prompt was correctly bypassed for `--yes`, but nothing took its place to block the write. Now exits cleanly and points the user at `--overwrite`.
- `diff.js`'s use of the `diff` package (`diffLines`) was never declared in `packages/cli/package.json`'s dependencies - it only resolved locally because of a stale `pnpm-lock.yaml` entry left over from an earlier state. A real `npm install hyperiux` would have been missing this dependency entirely. Also added the three command files (`diff.js`, `outdated.js`, `versions.js`) that were missing from the `build` script's `node --check` coverage.
- `vite.config.js` auto-fixers silently broke CommonJS configs during `init`.
- 2 high-severity dependency vulnerabilities.

## [1.0.4] - 2026-06-05

### Security
- Registry asset fetches are now restricted to `vault.hyperiux.com` - arbitrary remote hosts are rejected
- Dependency installation replaced `execSync` (shell string) with `spawnSync(..., { shell: false })` - eliminates residual shell injection surface

### Changed
- `package.json`: added `exports` field (`./package.json` only) - prevents consumers from deep-importing CLI internals
- `package.json`: `build` script now runs `node --check` on all source files instead of a no-op echo
- `package.json`: `smoke:bin` script added; `prepublishOnly` now runs lint → test → build → smoke:bin → pack dry-run
- CI (`ci.yml`): expanded Node matrix from `[22]` to `[18, 20, 22]`; added build, smoke:bin, and pack dry-run steps
- README: corrected import path from `@/components/hyperiux/` to `@/components/effects/`
- README: corrected `hyperiux.json` config example `effects` alias to `@/components/effects`
- README: fixed GitHub links to `github.com/Hyperiux-Immersion-Labs`

## [1.0.3] - 2026-06-04

### Security
- Path traversal protection: resolved file paths are now checked to stay within `cwd` before writing
- Registry payload validation: all file paths from registry responses are validated against a safe-path allowlist before use
- Secure token file permissions: `~/.hyperiux/` directory created with `0o700`, `auth.json` written with `0o600` (owner read/write only)

### Changed
- `package.json`: corrected repository and bugs URLs to `Hyperiux-Immersion-Labs/hyperiux-components`
- `package.json`: added `provenance: true` to `publishConfig` for npm attestation
- `package.json`: `prepublishOnly` script runs lint + tests + pack dry-run before every publish
- CI: added `cli-ci.yml` with Node 18/20/22 matrix, `npm pack --dry-run`, and tarball smoke test

## [1.0.0] - 2026-06-04

### Added
- `login` command - authenticates with Hyperiux Pro via CLI token from `vault.hyperiux.com/cli-auth`
- `logout` command - removes saved credentials from `~/.hyperiux/auth.json`
- `whoami` command - shows current login status
- Pro effect gating in `add` - validates CLI token against the API before fetching pro effect source
- Token stored as SHA-256 hash in Supabase; plaintext only lives in `~/.hyperiux/auth.json`
- Shell command injection guard on dependency names (`/^[a-z0-9-@/_.]+$/`)
- Unit tests for configuration, registry mapping, and package manager utilities (Vitest)
- ESLint flat config for `packages/cli`

### Changed
- `add` now reads auth token upfront and passes it to `fetchRegistry` for pro effects
- Registry fetcher routes pro effects through `/api/effects/[slug]` with `Authorization: Bearer` header
- Pro effect file contents stripped from public registry JSON; served only via authenticated API

### Fixed
- Hardcoded `src/` path alias - CLI now detects layout directory structure at runtime
- Target path prefix mismatch - registry matching aligned with registry builder output
- Dynamic `cssPath` resolution - fallback depends on whether `src/` directory exists

## [0.1.0] - 2026-06-01

### Added
- Initial release of the `hyperiux` CLI
- Commands: `init`, `add`, `list`
- Registry fetcher with auto-detection of local dev vs production registry
- Path alias resolution from `hyperiux.json`
- Package manager auto-detection (pnpm → yarn → bun → npm)
