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

## [1.0.4] - 2026-06-05

### Security
- Registry asset fetches are now restricted to `components.hyperiux.com` — arbitrary remote hosts are rejected
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
- `login` command — authenticates with Hyperiux Pro via CLI token from `components.hyperiux.com/cli-auth`
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
