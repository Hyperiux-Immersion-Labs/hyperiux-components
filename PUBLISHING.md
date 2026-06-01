# Publishing the Hyperiux CLI to npm

## Pre-publish Checklist

### 1. Make sure the registry is live
The CLI fetches from `components.hyperiux.com/r` in production. Before publishing, confirm that domain resolves and effects are accessible — otherwise users will get fetch errors on `npx hyperiux add`.

### 2. Verify the CLI package metadata
Check [`packages/cli/package.json`](packages/cli/package.json):
- `"name": "hyperiux"` — the npm package name users run with `npx hyperiux`
- `"version"` — bump this before each publish (semver: `1.0.0`, `1.0.1`, etc.)
- `"main"` points to `src/index.js`
- `"bin"` maps `hyperiux` → the entry point
- `"files"` whitelist includes only `src/` — not tests or dev scripts

### 3. Login to npm
```bash
npm login
# Enter your npmjs.com username, password, and OTP
```

### 4. Dry-run to verify what gets published
```bash
cd packages/cli
npm publish --dry-run
```
Prints exactly which files will be included without publishing. You should see only `src/` files and `package.json` — not the monorepo root or docs app.

### 5. Publish
```bash
cd packages/cli
npm publish --access public
```
`--access public` is required the first time for scoped packages. If the name is unscoped (`hyperiux` not `@hyperiux/cli`) it defaults to public anyway.

### 6. Verify it published
```bash
npm view hyperiux
```

Test end-to-end from **outside the monorepo** (important — inside the repo the CLI auto-detects the local registry and won't hit production):
```bash
npx hyperiux@latest list
```

---

## Every Subsequent Release

1. Bump `version` in [`packages/cli/package.json`](packages/cli/package.json)
2. Run:
```bash
cd packages/cli && npm publish
```

No build step needed — the CLI is plain Node.js with no transpilation.

---

## Things to Verify Before the First Publish

- The entry file (`src/index.js`) has `#!/usr/bin/env node` as its very first line
- `"bin"` field exists in `package.json`
- `"files"` field is set in `package.json` (without it, npm includes everything)
- `REGISTRY_URL` in [`packages/cli/src/utils/registry.js`](packages/cli/src/utils/registry.js) points to the live domain, not localhost
