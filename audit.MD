# npm Package Evaluation Report

## Executive Summary

I evaluated the public GitHub repo at `hyperiux-immersion-labs/hyperiux-components`. The actual publishable npm package appears to be **`packages/cli`**, published as **`hyperiux`**, not the root package. The root package is marked `"private": true` and named `"hyperiux-ui"`, while the CLI package is named `"hyperiux"` and exposes `npx hyperiux`. ([GitHub][1])

The package is **not production-ready as-is**. The biggest problem is not the CLI concept itself; it is the gap between the repo’s claimed publishing readiness and the actual package metadata/scripts. The changelog claims `1.0.4` changes such as `prepublishOnly`, `smoke:bin`, provenance, corrected repository URLs, and exports hardening, but the checked-in `packages/cli/package.json` is still `1.0.3` and does **not** contain those scripts or fields. ([GitHub][2])

## Overall Verdict

**Do not accept this as complete yet. Block payment/milestone approval until the package.json, CI, README, publishing workflow, and package smoke tests are corrected.**

The CLI has some good foundations: it uses ESM, has a focused dependency set, avoids install scripts, stores auth tokens with restrictive permissions, blocks path traversal on writes, and validates registry asset hosts. ([GitHub][3])

However, a professional npm package must not ship with broken or contradictory release metadata, missing publish guards, incorrect repo links, CI referencing missing scripts, no reliable smoke test, and no formal package export boundary.

---

## Scores

| Category                  | Score |
| ------------------------- | ----: |
| npm metadata              |  5/10 |
| package.json correctness  |  4/10 |
| install experience        |  6/10 |
| build quality             |  3/10 |
| TypeScript quality        |  1/10 |
| API design                |  6/10 |
| security                  |  7/10 |
| test coverage             |  3/10 |
| documentation             |  6/10 |
| performance               |  7/10 |
| publishing workflow       |  3/10 |
| legal/licensing readiness |  5/10 |

**Overall score: 4.7/10**

**Production-readiness verdict:** Not production-ready.
**Accept agency work as complete:** No.
**Block milestone/payment approval:** Yes, at least until Priority 0 and Priority 1 items pass.

---

## Critical Blockers

### 1. CI references a missing `smoke:bin` script

**Severity:** Critical
**Launch/payment status:** Blocker before launch and payment approval
**Effort:** Small
**Evidence:** CI runs `pnpm --filter hyperiux smoke:bin`, but the CLI package scripts only define `build`, `lint`, `test`, and `test:coverage`. ([GitHub][4])

**Impact:** CI will fail or be unreliable. This means the agency cannot prove that the package entry point works before publishing.

**Exact fix:**

```json
{
  "scripts": {
    "build": "node --check src/index.js && node --check src/commands/*.js && node --check src/utils/*.js",
    "lint": "eslint src",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "smoke:bin": "node src/index.js --help",
    "pack:dry-run": "npm pack --dry-run",
    "prepublishOnly": "npm run lint && npm test && npm run build && npm run smoke:bin && npm run pack:dry-run"
  }
}
```

---

### 2. Changelog claims unreleased/fixed package state that is not present in package.json

**Severity:** High
**Launch/payment status:** Blocker before payment approval
**Effort:** Small
**Evidence:** `CHANGELOG.md` has a `1.0.4` entry claiming `exports`, `smoke:bin`, `prepublishOnly`, provenance, and corrected repo links; actual `packages/cli/package.json` remains `1.0.3`, lacks `exports`, lacks `prepublishOnly`, lacks `smoke:bin`, and still points repository/bugs to `github.com/hyperiux/hyperiux-components`. ([GitHub][2])

**Impact:** Release notes cannot be trusted. This is a professional-readiness and auditability problem.

**Exact fix:** Either actually apply the 1.0.4 changes, or remove the 1.0.4 changelog entry until they exist.

---

### 3. Repository and README links point to inconsistent GitHub orgs

**Severity:** High
**Launch/payment status:** Blocker before payment approval
**Effort:** Small
**Evidence:** The repo being evaluated is under `Hyperiux-Immersion-Labs`, but package metadata points to `github.com/hyperiux/hyperiux-components`; the CLI README also contains a clone command for `github.com/hyperiux/hyperiux-components`, while its Connect table points to `Hyperiux-Immersion-Labs`. ([GitHub][5])

**Impact:** npm users may file issues in the wrong repo, clone the wrong source, or distrust ownership.

**Exact fix:**

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Hyperiux-Immersion-Labs/hyperiux-components.git",
    "directory": "packages/cli"
  },
  "bugs": {
    "url": "https://github.com/Hyperiux-Immersion-Labs/hyperiux-components/issues"
  },
  "homepage": "https://vault.hyperiux.com"
}
```

README clone command:

```bash
git clone https://github.com/Hyperiux-Immersion-Labs/hyperiux-components.git
cd hyperiux-components
pnpm install
pnpm dev
```

---

### 4. No real build artifact or formal entrypoint boundary

**Severity:** High
**Launch/payment status:** Blocker before launch
**Effort:** Medium
**Evidence:** The CLI package publishes raw `src` files, has `"bin": "./src/index.js"`, and the build script is currently a no-op. ([GitHub][6])

**Impact:** Raw source publishing can be acceptable for small CLIs, but only if the package has strict files, syntax checks, smoke tests, and export boundaries. This package currently lacks those protections.

**Recommended fix:**

```json
{
  "type": "module",
  "bin": {
    "hyperiux": "./src/index.js"
  },
  "exports": {
    "./package.json": "./package.json"
  },
  "files": [
    "src/**/*.js",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "node --check src/index.js && node --check src/commands/*.js && node --check src/utils/*.js"
  }
}
```

---

### 5. The root workspace has a Node engine mismatch and suspicious/runtime dependencies

**Severity:** Medium to High
**Launch/payment status:** Blocker before payment if repo-level install/build is part of delivery
**Effort:** Medium
**Evidence:** Root package requires Node `>=22`, while the CLI requires Node `>=18`; root package includes production dependencies such as `stripe`, `striper`, `@clerk/nextjs`, `@supabase/supabase-js`, `resend`, and `bcryptjs`. ([GitHub][1])

**Impact:** Contributors on Node 18 may be told the CLI supports Node 18 but cannot install the monorepo because root `.npmrc` has `engine-strict=true`. ([GitHub][7]) The `striper` package name is especially questionable and should be justified or removed.

**Exact fix:** Align engines or isolate workspace install expectations.

```json
{
  "engines": {
    "node": ">=18",
    "pnpm": ">=9"
  }
}
```

Move app-only dependencies from the root package into `apps/docs/package.json`.

---

# Detailed Findings

## 1. Package identity and npm metadata

| Issue                                                                                       | Severity | Impact                                             | Status                 | Effort | Fix                                                  |
| ------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------- | ---------------------- | ------ | ---------------------------------------------------- |
| Root package name is `hyperiux-ui`, CLI package is `hyperiux`, README says “Hyperiux Vault” | Medium   | Identity is confusing for npm users and evaluators | Blocker before payment | Small  | Pick one public product name and use it consistently |
| Repository metadata points to a different org than the evaluated repo                       | High     | Trust and issue-reporting problem                  | Blocker                | Small  | Correct `repository`, `bugs`, README clone URL       |
| Changelog is ahead of package.json                                                          | High     | Release process cannot be trusted                  | Blocker                | Small  | Apply changes or remove unreleased claims            |
| Author has trailing whitespace: `"Hyperiux "`                                               | Low      | Unprofessional metadata                            | Cosmetic               | Small  | `"author": "Hyperiux"`                               |
| No `funding` field                                                                          | Low      | Acceptable unless OSS funding is desired           | Later release          | Small  | Add only if real                                     |
| Package has public access but no provenance in actual package.json                          | Medium   | Weaker supply-chain trust                          | High-value fix         | Small  | Add `publishConfig.provenance: true`                 |

Suggested `package.json` metadata:

```json
{
  "name": "hyperiux",
  "version": "1.0.4",
  "description": "CLI for installing Hyperiux Vault animation effects into Next.js projects.",
  "keywords": [
    "hyperiux",
    "nextjs",
    "react",
    "ui",
    "components",
    "animations",
    "effects",
    "cli",
    "gsap",
    "threejs",
    "webgl"
  ],
  "author": "Hyperiux",
  "license": "MIT",
  "homepage": "https://vault.hyperiux.com",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Hyperiux-Immersion-Labs/hyperiux-components.git",
    "directory": "packages/cli"
  },
  "bugs": {
    "url": "https://github.com/Hyperiux-Immersion-Labs/hyperiux-components/issues"
  },
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

---

## 2. package.json correctness

Current CLI package:

```json
{
  "name": "hyperiux",
  "version": "1.0.3",
  "description": "CLI for adding Hyperiux Vault effects to your project",
  "type": "module",
  "bin": "./src/index.js",
  "files": ["src/commands", "src/utils", "src/index.js", "README.md"],
  "scripts": {
    "build": "echo 'No build step required'",
    "lint": "eslint src",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

([GitHub][6])

### Problems

**Missing `exports` field**
Severity: Medium. Without `exports`, consumers can deep-import internal CLI files, creating accidental public API.
Fix:

```json
{
  "exports": {
    "./package.json": "./package.json"
  }
}
```

**`bin` should be object form**
Severity: Low/Medium. String form works for same-name CLIs, but object form is clearer.
Fix:

```json
{
  "bin": {
    "hyperiux": "./src/index.js"
  }
}
```

**No `prepublishOnly`**
Severity: High. Allows accidental publish without lint/test/build/smoke/pack validation.
Fix:

```json
{
  "scripts": {
    "prepublishOnly": "npm run lint && npm test && npm run build && npm run smoke:bin && npm run pack:dry-run"
  }
}
```

**No `LICENSE` in package files**
Severity: Medium. npm may include license automatically in some cases depending on package layout, but the package’s `files` whitelist should explicitly include it.
Fix:

```json
{
  "files": [
    "src/**/*.js",
    "README.md",
    "LICENSE"
  ]
}
```

**No `main`, no library API**
Severity: Low. This is a CLI, so no `main` is required if you do not support importing it as a library. Document that `require("hyperiux")` and `import "hyperiux"` are unsupported.

**No CommonJS support**
Severity: Low. Acceptable for an ESM-only CLI on Node 18+, but document it.

---

## 3. Installation and consumer experience

### Expected CLI usage

```bash
npm install -g hyperiux
hyperiux --help

# or
npx hyperiux init
npx hyperiux add blur-text
```

The README correctly emphasizes `npx hyperiux` rather than library imports. ([GitHub][8])

### Broken or unsupported import patterns

These should be considered **unsupported**:

```js
import pkg from "hyperiux";
import { namedExport } from "hyperiux";
const pkg = require("hyperiux");
import thing from "hyperiux/thing";
```

Because this package is a CLI, not a runtime library. Add a README note:

````md
## Importing this package

`hyperiux` is a CLI package. It is not intended to be imported into application runtime code.

Use:

```bash
npx hyperiux init
npx hyperiux add blur-text
````

Do not use:

```js
import hyperiux from "hyperiux";
const hyperiux = require("hyperiux");
```

````

### Compatibility

| Environment | Assessment |
|---|---|
| npm | Likely works |
| pnpm | Likely works; repo uses pnpm |
| yarn | CLI detects yarn lockfiles |
| bun | CLI detects `bun.lockb`, but modern Bun may use `bun.lock`; add support |
| Node 18 | CLI says supported |
| Monorepo install on Node 18 | Risky because root requires Node >=22 and `.npmrc` enforces engines |
| CJS consumers | Unsupported |
| TypeScript consumers | Not relevant unless package becomes a library |

Fix Bun detection:

```js
if (
  fs.existsSync(path.join(cwd, "bun.lockb")) ||
  fs.existsSync(path.join(cwd, "bun.lock"))
) {
  return "bun";
}
````

---

## 4. Build and distribution quality

### Findings

| Issue                                                        | Severity   |                         Status | Effort |
| ------------------------------------------------------------ | ---------- | -----------------------------: | -----: |
| Build script is a no-op                                      | High       |                        Blocker |  Small |
| CI expects smoke script that does not exist                  | Critical   |                        Blocker |  Small |
| No tarball installation smoke test in actual package scripts | High       |                        Blocker | Medium |
| No generated `dist`                                          | Low/Medium | Later, acceptable for tiny CLI | Medium |
| No source maps                                               | Low        |          Not necessary for CLI |        |
| No minification                                              | Low        |          Not necessary for CLI |        |
| No package-size measurement                                  | Low        |                          Later |        |

### Recommended package validation commands

```bash
cd packages/cli

npm install
npm run lint
npm test
npm run build
npm run smoke:bin
npm pack --dry-run

npm pack
mkdir -p /tmp/hyperiux-package-test
cd /tmp/hyperiux-package-test
npm init -y
npm install /path/to/hyperiux-1.0.4.tgz
npx hyperiux --help
npx hyperiux list
```

### Recommended tarball smoke script

Create `scripts/smoke-packed-package.mjs`:

```js
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const tmp = mkdtempSync(join(tmpdir(), "hyperiux-pack-"));

try {
  const output = execFileSync("npm", ["pack", "--json"], {
    cwd: root,
    encoding: "utf8"
  });

  const [{ filename }] = JSON.parse(output);
  const tarball = join(root, filename);

  execFileSync("npm", ["init", "-y"], { cwd: tmp, stdio: "ignore" });
  execFileSync("npm", ["install", tarball], { cwd: tmp, stdio: "inherit" });
  execFileSync("npx", ["hyperiux", "--help"], { cwd: tmp, stdio: "inherit" });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
```

Add:

```json
{
  "scripts": {
    "smoke:pack": "node scripts/smoke-packed-package.mjs"
  }
}
```

---

## 5. TypeScript quality

This package is JavaScript-only. There is no evidence of TypeScript source, declaration output, `types`, or `tsconfig.json` for the CLI. The GitHub language summary also shows JavaScript as 100%. ([GitHub][5])

### Assessment

For a CLI-only package, TypeScript declarations are not mandatory. For a professional DX package that installs React/Next.js components, the **installed components themselves** should be TypeScript-compatible or clearly documented as JavaScript/JSX-only.

### If keeping CLI in JavaScript

Add JSDoc typing and `checkJs`:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.8.0"
  }
}
```

`jsconfig.json` or `tsconfig.json`:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "noEmit": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "strict": true
  },
  "include": ["src/**/*.js"]
}
```

### If converting to TypeScript

Use:

```json
{
  "type": "module",
  "bin": {
    "hyperiux": "./dist/index.js"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "clean": "rm -rf dist",
    "build": "tsc -p tsconfig.json",
    "prepublishOnly": "npm run clean && npm run lint && npm test && npm run build && npm run smoke:bin && npm pack --dry-run"
  },
  "devDependencies": {
    "typescript": "^5.8.0"
  }
}
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "declaration": false,
    "sourceMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

---

## 6. API design and maintainability

The public API is command-oriented:

```bash
hyperiux init
hyperiux add <effect>
hyperiux list
hyperiux login
hyperiux logout
hyperiux whoami
```

([GitHub][9])

### Good

The CLI command set is clear and small. The `add` command has useful flags: `--overwrite`, `--yes`, and `--dry-run`. ([GitHub][9])

### Issues

**Problem:** `add` exits the process directly from deep command logic.
**Impact:** Harder to unit test; cannot reuse command logic programmatically.
**Status:** Later release.
**Effort:** Medium.

Before:

```js
if (!effectName) {
  console.log(chalk.red("Please provide an effect name."));
  process.exit(1);
}
```

After:

```js
export class CliError extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
  }
}

if (!effectName) {
  throw new CliError("Please provide an effect name.", 1);
}
```

Top-level handler:

```js
try {
  await program.parseAsync();
} catch (error) {
  console.error(error.message);
  process.exit(error.exitCode || 1);
}
```

**Problem:** Registry and API environment overrides are useful but undocumented.
**Impact:** Harder to test/self-host.
**Fix:** Document `HYPERIUX_APP_URL`, `HYPERIUX_API_URL`, `HYPERIUX_REGISTRY_URL`, `HYPERIUX_TOKEN`, `HYPERIUX_DEBUG`.

---

## 7. Security and supply-chain risk

### Positive findings

The package does not define install/postinstall scripts in `packages/cli/package.json`. ([GitHub][6]) That is good.

The CLI blocks path traversal before writing files by resolving the target path and checking that it remains inside the current working directory. ([GitHub][3])

Auth tokens are stored under `~/.hyperiux/auth.json`, with directory mode `0o700` and file mode `0o600`. ([GitHub][10])

Registry asset downloads are restricted to `vault.hyperiux.com`. ([GitHub][11])

Dependency installation uses `spawnSync` with `shell: false` and validates dependency names against a regex. ([GitHub][12])

### Risks

| Risk                                                 | Severity   | Direct/transitive | Impact                                             | Fix                                                      |
| ---------------------------------------------------- | ---------- | ----------------- | -------------------------------------------------- | -------------------------------------------------------- |
| No npm provenance in actual package.json             | Medium     | Publishing        | Lower supply-chain trust                           | Add `publishConfig.provenance: true`                     |
| Debug mode prints token preview                      | Low/Medium | Direct            | Could leak partial token in logs                   | Do not print token preview even in debug                 |
| Registry dependencies can cause package installation | Medium     | Direct            | Registry compromise could add unwanted deps        | Require allowlist or prompt with package/version display |
| Root dependency `striper` appears suspicious/unclear | Medium     | Direct            | Possible dependency confusion or unused dependency | Remove unless justified                                  |
| No documented `npm audit` result                     | Medium     | Unknown           | Cannot verify current vulnerability state          | Run and publish audit result in CI                       |

Suggested hardening:

```js
if (process.env.HYPERIUX_DEBUG === "1") {
  console.log("[Hyperiux CLI] API URL:", url);
  console.log("[Hyperiux CLI] Token found:", Boolean(token));
  // Do not print token preview.
}
```

Dependency allowlist example:

```js
const ALLOWED_REGISTRY_DEPENDENCIES = new Set([
  "gsap",
  "three",
  "@react-three/fiber",
  "framer-motion",
  "lucide-react"
]);

for (const dep of dependencies) {
  const name = normalizePackageName(dep);
  if (!ALLOWED_REGISTRY_DEPENDENCIES.has(name)) {
    throw new Error(`Registry requested unapproved dependency: ${dep}`);
  }
}
```

---

## 8. Testing coverage

Current evidence shows one registry utility test file. ([GitHub][13]) That is not enough for a production CLI.

### Recommended tests

| Test name                                          | Priority | What it proves                                   |
| -------------------------------------------------- | -------: | ------------------------------------------------ |
| `bin --help smoke test`                            |       P0 | Installed CLI starts                             |
| `package tarball install test`                     |       P0 | Published package works after `npm pack`         |
| `add blocks path traversal`                        |       P0 | Malicious registry file cannot write outside cwd |
| `asset fetch rejects untrusted host`               |       P0 | SSRF/untrusted asset mitigation works            |
| `installDependencies rejects shell metacharacters` |       P0 | Dependency install cannot inject shell           |
| `init writes config and creates dirs`              |       P1 | First-run UX works                               |
| `add dry-run writes nothing`                       |       P1 | Safe preview works                               |
| `pro effect without token shows login guidance`    |       P1 | Paid gating UX works                             |
| `HYPERIUX_TOKEN overrides file token`              |       P2 | CI/auth behavior works                           |
| `detectPackageManager supports npm/pnpm/yarn/bun`  |       P2 | Consumer package manager compatibility           |

Example test:

```js
import { describe, it, expect, vi } from "vitest";
import { fetchRegistryAsset } from "../utils/registry.js";

describe("fetchRegistryAsset", () => {
  it("rejects assets from untrusted hosts", async () => {
    await expect(
      fetchRegistryAsset("https://evil.example.com/payload.js")
    ).rejects.toThrow("untrusted host");
  });
});
```

Path traversal test:

```js
import { describe, it, expect } from "vitest";
import { getRegistryItemFiles } from "../utils/registry.js";

describe("registry payload safety", () => {
  it("rejects traversal target paths before writing", async () => {
    const maliciousFile = {
      targetPath: "../../.ssh/authorized_keys",
      content: "bad"
    };

    const cwd = "/tmp/project";
    const resolved = path.resolve(cwd, maliciousFile.targetPath);

    expect(resolved.startsWith(path.resolve(cwd) + path.sep)).toBe(false);
  });
});
```

CLI smoke test:

```js
import { execFileSync } from "node:child_process";

it("prints help", () => {
  const output = execFileSync("node", ["src/index.js", "--help"], {
    encoding: "utf8"
  });

  expect(output).toContain("hyperiux");
  expect(output).toContain("init");
  expect(output).toContain("add");
});
```

---

## 9. Documentation and README quality

### What works

The README has a quick start, CLI command list, free/pro explanation, architecture section, local testing notes, requirements, and license section. ([GitHub][8])

### Problems

| Issue                                                                         | Severity   | Status     | Fix                                                |
| ----------------------------------------------------------------------------- | ---------- | ---------- | -------------------------------------------------- |
| README clone URL uses wrong org                                               | High       | Blocker    | Correct to `Hyperiux-Immersion-Labs`               |
| JSX example appears malformed in fetched README text: `return Hello, world.;` | High       | Blocker    | Use valid JSX                                      |
| No troubleshooting section                                                    | Medium     | High-value | Add common errors                                  |
| No security section                                                           | Medium     | High-value | Explain token storage, pro effects, registry trust |
| No package import warning                                                     | Low/Medium | Later      | State package is CLI-only                          |
| No version compatibility table                                                | Medium     | High-value | Document Node/Next/Tailwind support                |
| No migration guide                                                            | Low        | Later      | Add when breaking changes occur                    |

Correct quick start:

````md
## Quick Start

```bash
npx hyperiux init
npx hyperiux add blur-text
````

```tsx
import { BlurText } from "@/components/effects/blur-text";

export default function Page() {
  return <BlurText>Hello, world.</BlurText>;
}
```

````

Recommended README outline:

```md
# Hyperiux Vault CLI

## What this package does
## Requirements
## Quick Start
## Commands
## Installing free effects
## Installing Pro effects
## Configuration: hyperiux.json
## Generated file locations
## Environment variables
## Troubleshooting
## Security model
## Local development
## Publishing checklist
## License
````

Troubleshooting examples:

````md
### `Hyperiux is not initialized in this project`

Run:

```bash
npx hyperiux init
````

### `This is a Pro effect`

Run:

```bash
npx hyperiux login
npx hyperiux add <effect>
```

### Files already exist

Use:

```bash
npx hyperiux add <effect> --overwrite
```

````

---

## 10. Performance and bundle size

This is a small CLI with only four runtime dependencies: `chalk`, `commander`, `ora`, and `prompts`. :contentReference[oaicite:21]{index=21} That is reasonable.

### Risks

The bigger performance/bloat risk is not the CLI itself; it is what the registry installs into consumer projects. The README advertises GSAP, Three.js, R3F, WebGL, and animation-heavy effects. :contentReference[oaicite:22]{index=22} Those can meaningfully affect consumer bundle size.

### Fixes

Add `--dry-run` output that shows dependency size risk:

```txt
Dependencies to install:
- three
- @react-three/fiber
- gsap

Note: WebGL effects may increase client bundle size.
````

Add docs:

```md
## Bundle-size notes

Effects are installed as source into your project. You control what is imported and bundled. WebGL/Three.js effects may add significant client-side JavaScript. Prefer installing only the effects you use.
```

---

## 11. Publishing workflow and CI/CD

Current CI has a good intent: Node matrix 18/20/22, install, lint, test, build, smoke, pack dry-run. But it currently references a missing script. ([GitHub][4])

### Improved GitHub Actions workflow

```yaml
name: CLI CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  cli:
    name: CLI checks on Node ${{ matrix.node-version }}
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20, 22]

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9.15.0

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm --filter hyperiux lint
      - run: pnpm --filter hyperiux test
      - run: pnpm --filter hyperiux build
      - run: pnpm --filter hyperiux smoke:bin
      - run: cd packages/cli && npm pack --dry-run
      - run: cd packages/cli && npm run smoke:pack
```

### Release workflow with npm provenance

```yaml
name: Publish CLI

on:
  release:
    types: [published]

permissions:
  contents: read
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9.15.0

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: "https://registry.npmjs.org"
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter hyperiux lint
      - run: pnpm --filter hyperiux test
      - run: pnpm --filter hyperiux build
      - run: cd packages/cli && npm publish --access public --provenance
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 12. Licensing and legal readiness

The repo has an MIT license file with `Copyright (c) 2026 Hyperiux`. ([GitHub][14]) The README says free effects are MIT licensed, while Pro effects require a subscription and are not redistributable. ([GitHub][8])

### Legal issues

| Issue                                                    | Severity                     | Status                                             | Fix                                                                               |
| -------------------------------------------------------- | ---------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
| Free/pro licensing split needs sharper wording           | Medium                       | High-value                                         | Make clear that the CLI is MIT, free effects are MIT, pro effects are proprietary |
| No third-party license report                            | Medium                       | Payment criterion if agency delivered full product | Generate dependency license report                                                |
| Agency/client ownership unclear                          | High for commercial delivery | Blocker before final acceptance                    | Add written ownership terms outside npm README                                    |
| Published package may omit LICENSE due `files` whitelist | Medium                       | Blocker                                            | Add `LICENSE` to package files                                                    |

Recommended README license wording:

```md
## License

The `hyperiux` CLI is MIT licensed.

Free effects installed by the CLI are MIT licensed unless a specific effect file states otherwise.

Pro effects require an active Hyperiux Pro subscription. Pro effect source may be installed into your own project, but may not be redistributed, resold, sublicensed, or published as a competing component library.
```

---

# Step-by-Step Remediation Plan

## Priority 0 — Critical blockers

### Issue: CI references missing script

**Impact:** CI cannot prove the package works.
**Files affected:** `packages/cli/package.json`, `.github/workflows/ci.yml`
**Exact fix:** Add `smoke:bin`, `pack:dry-run`, and `prepublishOnly`.

**Commands to run:**

```bash
cd packages/cli
npm run lint
npm test
npm run build
npm run smoke:bin
npm pack --dry-run
```

**Acceptance criteria:** CI passes on Node 18, 20, and 22.

---

### Issue: package.json contradicts changelog

**Impact:** Release claims are unreliable.
**Files affected:** `packages/cli/package.json`, `CHANGELOG.md`
**Exact fix:** Apply the 1.0.4 changelog changes or remove the 1.0.4 entry.

**Commands to run:**

```bash
node -p "require('./packages/cli/package.json').version"
grep -n "1.0.4" CHANGELOG.md
```

**Acceptance criteria:** Version and changelog agree.

---

### Issue: Wrong repository metadata

**Impact:** Broken trust and issue reporting.
**Files affected:** `packages/cli/package.json`, `packages/cli/README.md`, root `README.md`
**Exact fix:** Use `Hyperiux-Immersion-Labs/hyperiux-components` consistently.

**Acceptance criteria:** npm metadata, README clone command, bugs URL, and Connect table all point to the same repo.

---

## Priority 1 — High-value fixes

### Issue: No package export boundary

**Impact:** Users can deep-import internals accidentally.
**Files affected:** `packages/cli/package.json`
**Exact fix:**

```json
{
  "exports": {
    "./package.json": "./package.json"
  }
}
```

**Acceptance criteria:** `import "hyperiux/src/utils/registry.js"` fails for consumers.

---

### Issue: No packed-package smoke test

**Impact:** `npm pack` may produce a broken package.
**Files affected:** `packages/cli/scripts/smoke-packed-package.mjs`, `packages/cli/package.json`
**Exact fix:** Add `smoke:pack`.

**Commands to run:**

```bash
cd packages/cli
npm run smoke:pack
```

**Acceptance criteria:** A temporary project can install the tarball and run `npx hyperiux --help`.

---

### Issue: README example is invalid JSX

**Impact:** First-run docs look unprofessional and may fail copy/paste.
**Files affected:** `README.md`, `packages/cli/README.md`
**Exact fix:**

```tsx
import { BlurText } from "@/components/effects/blur-text";

export default function Page() {
  return <BlurText>Hello, world.</BlurText>;
}
```

**Acceptance criteria:** Quick-start snippet is valid JSX/TSX.

---

## Priority 2 — Quality improvements

### Issue: Weak type safety

**Impact:** Regressions can slip into CLI internals.
**Files affected:** `packages/cli/tsconfig.json`, `packages/cli/package.json`
**Exact fix:** Add `typescript`, `checkJs`, and `typecheck` script.

**Commands to run:**

```bash
cd packages/cli
npm run typecheck
```

**Acceptance criteria:** CLI passes strict JS type checking.

---

### Issue: Environment variables undocumented

**Impact:** Harder support/testing.
**Files affected:** README
**Exact fix:** Document:

```md
HYPERIUX_APP_URL
HYPERIUX_API_URL
HYPERIUX_REGISTRY_URL
HYPERIUX_TOKEN
HYPERIUX_DEBUG
```

**Acceptance criteria:** README explains each variable and safe usage.

---

### Issue: Registry-installed dependency risk

**Impact:** Registry compromise could cause unwanted dependency installation.
**Files affected:** `src/utils/package-manager.js`, registry schema/docs
**Exact fix:** Add dependency allowlist or prompt requiring explicit confirmation.

**Acceptance criteria:** Unknown dependencies are rejected or require user confirmation.

---

## Priority 3 — Nice-to-have improvements

### Issue: CLI implementation is hard to unit test because commands call `process.exit`

**Impact:** Lower maintainability.
**Files affected:** `src/commands/*.js`, `src/index.js`
**Exact fix:** Throw typed errors and handle exit at the top level.

**Acceptance criteria:** Commands are testable without terminating Vitest.

---

### Issue: No dependency license report

**Impact:** Legal review is incomplete.
**Files affected:** CI/release docs
**Exact fix:**

```bash
npx license-checker --production --summary
```

**Acceptance criteria:** License report is attached to release or CI artifact.

---

# Recommended package.json Changes

Use this as the corrected `packages/cli/package.json` baseline:

```json
{
  "name": "hyperiux",
  "version": "1.0.4",
  "description": "CLI for installing Hyperiux Vault animation effects into Next.js projects.",
  "type": "module",
  "bin": {
    "hyperiux": "./src/index.js"
  },
  "exports": {
    "./package.json": "./package.json"
  },
  "files": [
    "src/**/*.js",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "node --check src/index.js && node --check src/commands/*.js && node --check src/utils/*.js",
    "lint": "eslint src",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "smoke:bin": "node src/index.js --help",
    "pack:dry-run": "npm pack --dry-run",
    "prepublishOnly": "npm run lint && npm test && npm run build && npm run smoke:bin && npm run pack:dry-run"
  },
  "dependencies": {
    "chalk": "^5.4.1",
    "commander": "^13.1.0",
    "ora": "^8.1.1",
    "prompts": "^2.4.2"
  },
  "devDependencies": {
    "eslint": "^9",
    "vitest": "^4.1.8"
  },
  "keywords": [
    "hyperiux",
    "nextjs",
    "react",
    "ui",
    "components",
    "animations",
    "effects",
    "cli",
    "gsap",
    "threejs",
    "webgl"
  ],
  "author": "Hyperiux",
  "license": "MIT",
  "homepage": "https://vault.hyperiux.com",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Hyperiux-Immersion-Labs/hyperiux-components.git",
    "directory": "packages/cli"
  },
  "bugs": {
    "url": "https://github.com/Hyperiux-Immersion-Labs/hyperiux-components/issues"
  },
  "engines": {
    "node": ">=18"
  },
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

---

# Recommended Build/TypeScript Changes

For the fastest reliable fix, keep JS but add syntax/type checks:

```json
{
  "scripts": {
    "build": "node --check src/index.js && node --check src/commands/*.js && node --check src/utils/*.js",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.8.0"
  }
}
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "noEmit": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.js"]
}
```

---

# Recommended Tests

Minimum required before acceptance:

```bash
cd packages/cli
npm run lint
npm test
npm run build
npm run smoke:bin
npm pack --dry-run
npm run smoke:pack
npm audit
npm outdated
```

Consumer validation:

```bash
cd packages/cli
npm pack

mkdir -p /tmp/npm-package-test
cd /tmp/npm-package-test
npm init -y
npm install /path/to/hyperiux-1.0.4.tgz

npx hyperiux --help
npx hyperiux list
```

Unsupported import tests should verify failure:

```js
await expect(import("hyperiux/src/utils/registry.js")).rejects.toThrow();
```

---

# Recommended README Improvements

Add these sections:

````md
## This is a CLI package

`hyperiux` is intended to be used through `npx hyperiux` or the `hyperiux` command. It is not a runtime library and should not be imported into application code.

## Requirements

- Node.js 18+
- Next.js App Router
- React
- Tailwind CSS

## Environment variables

| Variable | Purpose |
|---|---|
| `HYPERIUX_TOKEN` | Use a CLI token without saving it locally |
| `HYPERIUX_APP_URL` | Override the Hyperiux app URL for testing |
| `HYPERIUX_API_URL` | Override API URL for testing |
| `HYPERIUX_REGISTRY_URL` | Override registry URL for testing |
| `HYPERIUX_DEBUG` | Enables debug logs; do not use in shared CI logs |

## Troubleshooting

### Hyperiux is not initialized

Run:

```bash
npx hyperiux init
````

### Pro effect requires login

Run:

```bash
npx hyperiux login
```

### Files already exist

Run:

```bash
npx hyperiux add <effect> --overwrite
```

````

---

# Security and Dependency Notes

The current security posture is better than the average early CLI package because it includes path traversal protection, token file permissions, asset host restrictions, and shell-free dependency installation. :contentReference[oaicite:26]{index=26}

Still required before launch:

```bash
cd packages/cli
npm audit
npm outdated
npm pack --dry-run
````

Also remove or justify root-level `striper` and move app-specific dependencies out of the root workspace package. ([GitHub][1])

---

# Publishing Workflow Recommendations

Required release checklist:

```bash
pnpm install --frozen-lockfile
pnpm --filter hyperiux lint
pnpm --filter hyperiux test
pnpm --filter hyperiux build
pnpm --filter hyperiux smoke:bin

cd packages/cli
npm pack --dry-run
npm publish --dry-run
npm publish --access public --provenance
```

Required npm account controls:

* Enable 2FA for publishing.
* Publish from GitHub Actions with OIDC/npm provenance.
* Do not publish manually from developer machines unless emergency process is documented.
* Require CI green before tag/release.

---

# Agency Feedback Summary

Hi team,

Thank you for the work on the Hyperiux CLI. The product direction is solid: the CLI command set is clear, the free/pro installation flow is understandable, and there are good security foundations such as path traversal protection, restricted token file permissions, host-restricted asset fetching, and shell-free dependency installation.

However, I cannot accept the package as production-ready yet. Several issues must be fixed before milestone approval:

1. The checked-in `packages/cli/package.json` does not match the changelog claims. The changelog describes `1.0.4` changes such as `prepublishOnly`, `smoke:bin`, provenance, and exports hardening, but the package is still `1.0.3` and those fields/scripts are missing.
2. CI currently references a `smoke:bin` script that does not exist in the package.
3. Repository and README links are inconsistent and point to different GitHub organizations.
4. The build script is currently a no-op and does not validate the package before publish.
5. There is no packed-package smoke test proving that the npm tarball installs and runs correctly.
6. The README quick-start example and repo clone instructions need correction.
7. The package needs a clear publish workflow with lint, test, build, smoke, `npm pack --dry-run`, and npm provenance.

Expected deliverables before acceptance:

* Corrected `packages/cli/package.json` with accurate metadata, `exports`, `smoke:bin`, `pack:dry-run`, `prepublishOnly`, and `publishConfig.provenance`.
* Corrected README and package metadata links pointing consistently to the actual GitHub repository.
* Passing CI on Node 18, 20, and 22.
* A packed-package smoke test that installs the generated `.tgz` into a temporary project and verifies `npx hyperiux --help`.
* Updated changelog that exactly matches the shipped package state.
* Evidence from `npm run lint`, `npm test`, `npm run build`, `npm pack --dry-run`, and `npm audit`.

Acceptance criteria are objective: the package must install from its generated tarball, the CLI must start successfully, CI must pass, metadata must be accurate, and publish safeguards must prevent accidental broken releases.

Once those items are fixed, the package can be re-reviewed for final acceptance.

---

# Acceptance Criteria

Before approval, require all of the following:

```bash
pnpm install --frozen-lockfile
pnpm --filter hyperiux lint
pnpm --filter hyperiux test
pnpm --filter hyperiux build
pnpm --filter hyperiux smoke:bin

cd packages/cli
npm audit
npm outdated
npm pack --dry-run
npm publish --dry-run
```

Packed package validation:

```bash
cd packages/cli
npm pack

mkdir -p /tmp/npm-package-test
cd /tmp/npm-package-test
npm init -y
npm install /path/to/hyperiux-*.tgz

npx hyperiux --help
npx hyperiux list
```

Final approval should be blocked until:

1. `package.json` and `CHANGELOG.md` agree.
2. CI passes on Node 18/20/22.
3. Repository links are consistent.
4. `prepublishOnly` prevents unsafe publish.
5. The tarball smoke test passes.
6. README quick start is valid and copy/pasteable.
7. npm provenance is configured.
8. `LICENSE` is included in the published package.
9. Security-sensitive registry and token behavior has regression tests.
10. The agency provides evidence of `npm audit` and package dry-run output.

[1]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/package.json "raw.githubusercontent.com"
[2]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/CHANGELOG.md "raw.githubusercontent.com"
[3]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/packages/cli/src/commands/add.js "raw.githubusercontent.com"
[4]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/.github/workflows/ci.yml "raw.githubusercontent.com"
[5]: https://github.com/hyperiux-immersion-labs/hyperiux-components "GitHub - Hyperiux-Immersion-Labs/hyperiux-components · GitHub"
[6]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/packages/cli/package.json "raw.githubusercontent.com"
[7]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/.npmrc "raw.githubusercontent.com"
[8]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/packages/cli/README.md "raw.githubusercontent.com"
[9]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/packages/cli/src/index.js "raw.githubusercontent.com"
[10]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/packages/cli/src/utils/auth.js "raw.githubusercontent.com"
[11]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/packages/cli/src/utils/registry.js "raw.githubusercontent.com"
[12]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/packages/cli/src/utils/package-manager.js "raw.githubusercontent.com"
[13]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/packages/cli/src/tests/registry.test.js "raw.githubusercontent.com"
[14]: https://raw.githubusercontent.com/hyperiux-immersion-labs/hyperiux-components/main/LICENSE "raw.githubusercontent.com"
