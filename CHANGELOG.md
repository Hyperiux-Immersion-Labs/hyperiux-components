# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
