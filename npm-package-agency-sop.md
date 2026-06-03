# npm Package Agency SOP

> Standard Operating Procedure for delivering a production-ready npm package.
> Owner: Engineering Lead | Updated: June 2026
> Apply this document to every package delivered by or accepted from a vendor.

---

## Part 1 — Acceptance Criteria (Pass/Fail)

A package is only accepted when ALL items below are PASS.
Any single FAIL blocks milestone payment.

### Functional correctness

| # | Test | Method | Pass condition |
|---|---|---|---|
| F1 | ESM import works | `node --input-type=module --eval 'import { X } from "pkg"; console.log(typeof X)'` | Prints `function` or `object` |
| F2 | CJS require works | `node -e "const p = require('pkg'); console.log(Object.keys(p))"` | Prints array of exported names |
| F3 | TypeScript resolves types | `tsc --noEmit --moduleResolution bundler --strict` with one import | Zero errors |
| F4 | Subpath imports work | Same as F1/F2 for each documented subpath | All pass |
| F5 | No duplicate peer installed | `npm ls react` in consumer project | Exactly one version |

### Build quality

| # | Test | Method | Pass condition |
|---|---|---|---|
| B1 | `dist/` contains required files | `ls dist/esm/ dist/cjs/ dist/types/` | All three directories exist |
| B2 | Declaration files present | `wc -l dist/types/index.d.ts` | > 10 lines |
| B3 | Source maps present | `ls dist/**/*.map` | At least one exists |
| B4 | Build is reproducible | Run build twice, `git diff dist/` | Empty diff |
| B5 | Tarball is clean | `npm pack --dry-run` output | No `src/`, `tests/`, `.env`, or config files |
| B6 | Bundle size in limit | `npx size-limit` | Under defined limit (default 50 kB gzipped) |

### Quality gates

| # | Test | Method | Pass condition |
|---|---|---|---|
| Q1 | Lint passes | `npm run lint` | Exit code 0, zero warnings |
| Q2 | Type-check passes | `npm run type-check` | Exit code 0, zero errors |
| Q3 | Tests pass | `npm test` | 100% of tests pass |
| Q4 | Coverage meets threshold | `npm run test:coverage` | ≥ 80% lines, ≥ 80% functions |
| Q5 | Type tests pass | `tsc -p tsconfig.test.json --noEmit` | Exit code 0 |

### Security

| # | Test | Method | Pass condition |
|---|---|---|---|
| S1 | No HIGH/CRITICAL vulnerabilities | `npm audit --audit-level=high` | Exit code 0 |
| S2 | No secrets in tarball | Manual grep on packed tarball | Zero matches |
| S3 | No GPL dependencies | `npx license-checker --failOn "GPL;AGPL"` | Exit code 0 |
| S4 | No risky install scripts | Check `package.json` scripts | No `preinstall`, `install`, `postinstall` |

### Documentation

| # | Check | Method | Pass condition |
|---|---|---|---|
| D1 | README has quick start | Manual review | Working code example present |
| D2 | README has API reference | Manual review | Prop/param table present for each export |
| D3 | README has TypeScript example | Manual review | `import type` example present |
| D4 | CHANGELOG.md exists | `ls CHANGELOG.md` | File exists and documents current version |
| D5 | LICENSE file exists | `ls LICENSE` | File present, matches `package.json` license field |

### npm metadata

| # | Check | Method | Pass condition |
|---|---|---|---|
| M1 | Scoped name | `npm view pkg name` | Name starts with `@scope/` |
| M2 | License declared | `npm view pkg license` | Valid SPDX identifier |
| M3 | Repository link works | Open URL in browser | GitHub or equivalent page loads |
| M4 | Provenance badge | npmjs.com listing | Provenance section visible |
| M5 | Description is meaningful | `npm view pkg description` | Not blank, not "TODO", ≥ 10 words |

---

## Part 2 — Mandatory CI Checks

These jobs must run on every PR and every release branch.

### `ci.yml` — Copy-paste ready

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Quality Gates
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version:[1][2][3]

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm

      - name: Clean install
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type-check
        run: npm run type-check

      - name: Unit tests
        run: npm run test

      - name: Coverage check
        run: npm run test:coverage

      - name: Build
        run: npm run build

      - name: Bundle size check
        run: npm run size

      - name: Inspect tarball
        run: npm pack --dry-run

  security:
    name: Security Gates
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Vulnerability audit
        run: npm audit --audit-level=high

      - name: License check
        run: npx license-checker --failOn "GPL;AGPL"

      - name: Secret scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

### `release.yml` — Copy-paste ready

```yaml
name: Publish to npm

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    name: Publish
    runs-on: ubuntu-latest

    permissions:
      id-token: write
      contents: read

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
          cache: npm

      - name: Clean install
        run: npm ci

      - name: Run all quality gates
        run: |
          npm run lint
          npm run type-check
          npm run test
          npm run build
          npm run size

      - name: Security audit
        run: npm audit --audit-level=high

      - name: Publish with provenance
        run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Verify published package
        run: |
          sleep 10
          npm view ${{ env.PACKAGE_NAME }} version
```

---

## Part 3 — Publish Checklist

Print and sign off before every release.
