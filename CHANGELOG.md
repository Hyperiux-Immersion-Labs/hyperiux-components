# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Release Process

1. Update version in `packages/cli/package.json`
2. Add entry to this file under a new `## [x.y.z] - YYYY-MM-DD` heading
3. Commit: `git commit -m "chore: release x.y.z"`
4. Run `cd packages/cli && npm run prepublishOnly` - must pass lint, tests, and pack dry-run
5. Tag and push: `git tag vx.y.z && git push origin main --follow-tags`

Pushing the tag triggers `.github/workflows/release.yml`, which publishes to
npm with provenance and creates (or updates) the matching GitHub Release
automatically - you shouldn't need to run `npm publish` locally. The tag must
be named `vx.y.z`, not `cli-vx.y.z` (an earlier version of this doc said
otherwise) - the release workflow only triggers on tags matching `v*`, so a
`cli-v` tag would silently skip both the npm publish and the GitHub Release.

If you do publish manually for any reason, still push a `vx.y.z` tag
afterward so GitHub Releases stays in sync with npm - a tag that was pushed
without the release workflow catching it (or before the release-creation
step existed) is what let v1.0.73-v1.0.75 go three versions without a
GitHub Release entry.

---

## [1.0.77] - 2026-07-24

### Added
- `list` command now separates output into **Free Effects** and **Pro Effects** sections (grouped by category within each), instead of one flat category list
- Shared `prefers-reduced-motion` + tab-visibility/offscreen animation suspension (`createSuspendedRaf`) rolled out to `dotted-grid`, `spider-particles`, `phantom-image-trail`, `split-canvas`, `fractal-glass`, `interactive-blur-reveal`, `milky-way`, and `infinite-perspective-slider`
- Keyboard focus-trap (`useFocusTrap`) added to the three full-screen/overlay navigation effects: `directional-menu`, `elevate-navbar`, `immersive-full-screen-nav`
- WebGL context-loss recovery for `interactive-blur-reveal` (effects driving a raw WebGL context directly, rather than through Three.js, previously stayed permanently blank after a dropped context - e.g. on mobile GPU memory pressure or laptop sleep/resume)
- Per-effect `version`/`changelog` metadata added to several free effects that didn't have it yet, so `hyperiux outdated`/`versions`/`diff` can now track them
- Issue templates (bug report, effect request), a PR template, and `CONTRIBUTING.md`
- Troubleshooting and compatibility sections in the README (Tailwind content-glob gotcha, the `--yes`/`--overwrite` behavior change, stale CLI token symptoms)
- One-time, non-intrusive "star this if it helped" line after a successful `add` (shown once ever, never on `--dry-run` or on effects pulled in as a dependency)
- Hero effect demo GIFs (Milky Way, Phantom Image Trail, Spider Particles, Immersive Full-Screen Nav) in both READMEs

### Fixed
- `HYPERIUX_PRO_REGISTRY_ROOT` local-testing override was checked *after* the bundled registry lookup, so it was silently ignored whenever the requested effect's name happened to already exist in the CLI's own bundled free registry - now checked first, as the explicit opt-in it's meant to be
- Trailing slash in a custom `HYPERIUX_REGISTRY_URL` could produce a double-slash in the fetched index URL
- `link-button`: removed an errant `scale-150` class that rendered the link at 1.5x size
- `fractal-glass`: stray character left after a JSX comment (cosmetic, no functional change)
- `animated-faq`: registry copy re-synced with the production component - adds the `iconMode` prop, simpler controlled-mode detection, height-based open/close animation
- Fixed a duplicate `normalizeRegistryIndex` function declaration left behind by a merge, which broke lint

---

## [1.0.76] - 2026-07-20

### Fixed
- **`add` no longer overwrites existing files when only `--yes` is passed (data-loss safety fix).** Previously, `--yes` (intended to skip interactive prompts) also silently permitted overwriting files already on disk, so re-running `add <effect> --yes` could replace a locally customized effect with the registry version, with no confirmation. `--yes` now *only* skips prompts; replacing existing files requires an explicit `--overwrite`. When files already exist and `--overwrite` is not passed, the existing files are left untouched and the effect is skipped with a clear message pointing at `--overwrite` and `hyperiux diff`.

### Changed
- **Behavior change for scripts and muscle-memory usage:** any `add … --yes` invocation that relied on the old implicit-overwrite behavior will now skip existing files instead of replacing them. Add `--overwrite` to those commands to keep replacing files.
- `add --dry-run` now always shows its preview even when target files already exist (it no longer prompts or blocks on the overwrite check, since a dry run writes nothing).

## [1.0.75] - 2026-07-17

### Added
- Component versioning: `add` now records every installed effect in `hyperiux.lock.json` (version + sha256 file hashes) via `utils/lockfile.js`
- `outdated` command - checks installed effects against the registry and lists only the ones that are behind, with bump type (patch/minor/major)
- `versions` command - full listing of every installed effect and its version/status, including up-to-date ones
- `diff [effect]` command - colored line-by-line diff between an installed effect and the latest registry version, with context trimming for large files
- Explicit warning above the overwrite confirmation prompt in `add`, pointing to `hyperiux diff` before overwriting local edits
- `utils/semver.js` - minimal `major.minor.patch` comparison used by `outdated`/`versions`

### Changed
- `getFileContent` moved from a local helper in `add.js` to a shared export in `utils/registry.js`, reused by `diff`

## [1.0.74] - 2026-07-17

### Fixed
- `arrow-fill-button`: switched to named export (default export removed)
- `directional-menu` and `milky-way`: responsive layout fixes
- `milky-way`: removed stale `package.json` from effect folder
- `dotted-grid`, `stack-loader`, `split-canvas` and 10 other effects: source reconciled against demo pages
- `elevated-navbar`: updated source
- `hover-stack`, `number-counter`, `fractal-glass`, `interactive-blur-reveal`: component updates; stale `package.json` files removed from effect folders
- Missing `dependencies` declarations added to several registry.json files
- Hardcoded asset references (`/hyperiux.svg`, social icons) replaced with inline SVG in `immersive-full-screen-nav` and `directional-menu`
- README: corrected mismatched effect names

### Changed
- `turbo.json`: pipeline config updated

## [1.0.73] - 2026-07-09

### Fixed
- `split-canvas`: shader moved from `shaders/pixelTransition.js` to top-level `pixel-transition.js` - nested subdirectory wasn't scanned by registry build tooling, so the file was never packaged for CLI installs
- `immersive-full-screen-navigation` renamed to `immersive-full-screen-nav` to match live demo route
- `spider-particles`: fixed `isDesktop`/breakpoint bug on mobile
- `milky-way` registry entry corrected (was stale `milkyway` slug in index)
- `package-manager`: improved detection reliability across more project layouts

### Added
- `number-counter` and `block-transition` reclassified as free effects
- Mobile tap support added to `arrow-fill-button`, `link-button`, `scramble-link-button`
- `fractal-glass`: sensible default prop values added
- Release workflow: handles existing GitHub Release gracefully (edit instead of fail on re-run)

### Changed
- README updated with improved install and usage documentation

## [1.0.72] - 2026-07-08

### Added
- `HYPERIUX_PRO_REGISTRY_ROOT` env var - point the CLI at a local pro registry directory for testing without hitting the remote API
- `number-counter` effect added to free registry

### Fixed
- CLI falls through to remote API when an effect is not found in the local registry
- `interactive-blur-reveal` and `horizontal-feature-reveal` registry entries updated
- Milkyway effect source updated

### Changed
- Removed deprecated effects (`animated-toggle`, legacy milkyway)
- Registry reorganised - stale and duplicate entries cleaned up

## [1.0.5] - 2026-06-19

### Fixed
- `immersive-full-screen-navigation`: bundled `char-stagger-button.jsx` directly - no longer requires a separate pro fetch for a free effect dependency
- `immersive-full-screen-navigation`: fixed broken import path (`../../buttons/...` → `./char-stagger-button`)
- `animated-faq`: fixed broken import (`../ChevronBird/ChevronBird` → `./chevron-bird`); `chevron-bird.jsx` now ships in the same folder
- `scroll-shuffled-cards`: fixed broken import (`../Card/Card` → `./card`); `card.jsx` now ships in the same folder
- Registry test mock items now include `content` field - tests no longer fail `prepublishOnly`

### Added
- `subfolder` flag in `registry.json` - set `"subfolder": true` to install a multi-file effect into `src/components/hyperiux/<name>/` instead of flat. Enabled for `mouse-pixelation`.
- CI: security job with dependency audit, license check, TruffleHog secret scan, and dependency review on PRs
- CI: CodeQL static analysis workflow (push, PR, weekly schedule)
- GitHub Releases created retroactively for v0.1.0, v1.0.0, v1.0.3, v1.0.4

### Changed
- README: added CI status and MIT license badges
- README: added Community section linking to GitHub Discussions (Q&A, Show and Tell, Ideas, Effect Requests)
- `publishConfig`: removed `provenance: true` - provenance is now passed via CLI flag in CI only, not required for local publishing

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
