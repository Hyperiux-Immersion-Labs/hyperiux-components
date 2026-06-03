# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-06-03

### Fixed
- Hardcoded `src/` path alias bug: CLI now dynamically checks for layout directory structure at runtime.
- Target path prefix mismatch: aligned registry matching (`components/hyperiux/`) with registry builder outputs.
- Dynamic `cssPath` resolution: CSS default location now fallbacks properly depending on `src/` existence.

### Added
- Shell command execution validation: regex verification (`/^[a-z0-9-@/_.]+$/`) on package dependencies to block command injection.
- Complete ESLint configurations and Flat Config rules for `packages/cli`.
- Automated test coverage: unit tests for configuration, registry mapping, and package manager sanitizers using Vitest.
- GitHub Actions CI/CD workflows for automated PR gates and package release builds.

## [0.1.0] - 2026-06-01

### Added
- Initial release of the `hyperiux` CLI command utility.
- Commands: `init`, `add`, `list` to fetch and import components from remote effect registry.
