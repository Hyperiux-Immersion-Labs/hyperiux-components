# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Release Process

1. Update version in `packages/cli/package.json`
2. Add entry to this file under a new `## [x.y.z] - YYYY-MM-DD` heading
3. Commit: `git commit -m "chore: release x.y.z"`
4. Run `cd packages/cli && npm run prepublishOnly` — must pass lint, tests, and pack dry-run
5. Publish: `npm publish --access public`
6. Tag: `git tag cli-vx.y.z && git push origin --tags`

---

## [Unreleased]

## [1.1.0-beta.1] - 2026-08-07

### Added
- Anonymous CLI telemetry (`src/utils/telemetry.js`): tracks `init` and `add`/`add_blocked` events (CLI version, platform, Node version, an anonymized per-project ID — a truncated SHA-256 hash of the project path and hostname, not the path itself) to help prioritize framework/registry support. Non-blocking (1.5s timeout, silently no-ops on failure) and off by default in respect of privacy — opt out anytime with `HYPERIUX_TELEMETRY_DISABLED=1` or the standard `DO_NOT_TRACK=1`.
- `whoami` and `logout` commands, alongside the existing `login`.
- Framework and router detection, plus Tailwind/alias preflight checks, during `init` — surfaces mismatches before they turn into broken installs instead of after.
- Local install counter and registry domain migration support.

### Changed
- Project license changed from MIT to the Mozilla Public License 2.0 (MPL-2.0) for the CLI (`packages/cli`) and all free registry effects (`registry/effects`). Pro effects remain proprietary and are unaffected.
- CI release publish steps are now idempotent on already-published versions — re-running the release workflow no longer fails if a version was already pushed to npm.

### Fixed
- **Critical:** every CLI invocation (`--version`, `--help`, `add`, `init`, etc.) crashed at startup with `SyntaxError: The requested module '../utils/registry.js' does not provide an export named 'getFileContent'` — `diff.js` imported an export that `registry.js` no longer provided. Restored `getFileContent` as a shared export in `registry.js`; `add.js` now uses it instead of keeping its own private duplicate.
- `add --yes` (without `--overwrite`) on a project with existing, customized effect files silently overwrote them instead of skipping — the interactive confirmation prompt was correctly bypassed for `--yes`, but nothing took its place to block the write. Now exits cleanly and points the user at `--overwrite`.
- `diff.js`'s use of the `diff` package (`diffLines`) was never declared in `packages/cli/package.json`'s dependencies — it only resolved locally because of a stale `pnpm-lock.yaml` entry left over from an earlier state. A real `npm install hyperiux` would have been missing this dependency entirely. Also added the three command files (`diff.js`, `outdated.js`, `versions.js`) that were missing from the `build` script's `node --check` coverage.
- `vite.config.js` auto-fixers silently broke CommonJS configs during `init`.
- 2 high-severity dependency vulnerabilities.

## [1.0.4] - 2026-06-05

### Security
- Registry asset fetches are now restricted to `vault.hyperiux.com` — arbitrary remote hosts are rejected
- Dependency installation replaced `execSync` (shell string) with `spawnSync(..., { shell: false })` — eliminates residual shell injection surface

### Changed
- `package.json`: added `exports` field (`./package.json` only) — prevents consumers from deep-importing CLI internals
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
- `login` command — authenticates with Hyperiux Pro via CLI token from `vault.hyperiux.com/cli-auth`
- `logout` command — removes saved credentials from `~/.hyperiux/auth.json`
- `whoami` command — shows current login status
- Pro effect gating in `add` — validates CLI token against the API before fetching pro effect source
- Token stored as SHA-256 hash in Supabase; plaintext only lives in `~/.hyperiux/auth.json`
- Shell command injection guard on dependency names (`/^[a-z0-9-@/_.]+$/`)
- Unit tests for configuration, registry mapping, and package manager utilities (Vitest)
- ESLint flat config for `packages/cli`

### Changed
- `add` now reads auth token upfront and passes it to `fetchRegistry` for pro effects
- Registry fetcher routes pro effects through `/api/effects/[slug]` with `Authorization: Bearer` header
- Pro effect file contents stripped from public registry JSON; served only via authenticated API

### Fixed
- Hardcoded `src/` path alias — CLI now detects layout directory structure at runtime
- Target path prefix mismatch — registry matching aligned with registry builder output
- Dynamic `cssPath` resolution — fallback depends on whether `src/` directory exists

## [0.1.0] - 2026-06-01

### Added
- Initial release of the `hyperiux` CLI
- Commands: `init`, `add`, `list`
- Registry fetcher with auto-detection of local dev vs production registry
- Path alias resolution from `hyperiux.json`
- Package manager auto-detection (pnpm → yarn → bun → npm)
