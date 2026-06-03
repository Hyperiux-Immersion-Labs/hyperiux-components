# npm Package Release Checklist

> Run this checklist before every npm publish — patch, minor, or major.
> Version: 1.0.0 | Updated: June 2026

---

## Stage 1 — Pre-Build Verification

Run locally before touching the build.

```bash
# 1. Start from a clean state
git status                    # must be clean, no uncommitted changes
git pull origin main          # must be up to date

# 2. Clean install
rm -rf node_modules
npm ci

# 3. Security audit
npm audit --audit-level=high  # MUST pass — zero HIGH or CRITICAL issues

# 4. Outdated check
npm outdated                  # Review and decide on updates
```

- [ ] Git working tree is clean
- [ ] `npm ci` completes without errors
- [ ] `npm audit --audit-level=high` reports zero HIGH or CRITICAL issues
- [ ] No abandoned or suspicious packages in dependency tree

---

## Stage 2 — Quality Gates

```bash
# 5. Lint — zero warnings allowed
npm run lint

# 6. Type-check — zero errors allowed
npm run type-check

# 7. Tests — must pass 100%
npm run test

# 8. Coverage — must meet threshold
npm run test:coverage
```

- [ ] Lint passes with zero warnings
- [ ] TypeScript type-check passes with zero errors
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Coverage meets declared thresholds (recommended: 80% lines, 80% functions, 70% branches)
- [ ] Type tests pass (`tsc -p tsconfig.test.json --noEmit`)

---

## Stage 3 — Build Verification

```bash
# 9. Build from clean
npm run build

# 10. Verify dist output exists and is non-trivial
ls -lah dist/
wc -l dist/esm/index.js       # Must be > 10 lines
wc -l dist/types/index.d.ts   # Must be > 10 lines

# 11. Verify no peer dependencies bundled
grep -l "react" dist/esm/index.js   # Should NOT contain react source

# 12. Verify reproducibility
npm run build
git diff dist/               # Should be empty (no diff from same source)
```

- [ ] `dist/esm/index.js` exists and is non-trivial
- [ ] `dist/cjs/index.cjs` exists and is non-trivial
- [ ] `dist/types/index.d.ts` exists and is non-trivial
- [ ] Source maps exist: `dist/**/*.map`
- [ ] Build is reproducible (no diff on second clean build)
- [ ] No peer dependencies (react, vue, etc.) present in bundled output

---

## Stage 4 — Tarball Inspection

```bash
# 13. Inspect tarball contents
npm pack --dry-run

# 14. Verify only intended files are included
# Expected: dist/, README.md, CHANGELOG.md, LICENSE, package.json
# NOT expected: src/, tests/, .env, *.config.*, node_modules/

# 15. Check for accidentally published secrets
npm pack
tar -tf *.tgz
grep -r "API_KEY\|SECRET\|TOKEN\|PASSWORD" $(npm pack --dry-run 2>&1 | grep -v npm)
rm *.tgz   # clean up after inspection
```

- [ ] `npm pack --dry-run` shows only: `dist/`, `README.md`, `CHANGELOG.md`, `LICENSE`
- [ ] No `src/` directory in tarball
- [ ] No `tests/` directory in tarball
- [ ] No `.env` files in tarball
- [ ] No config files (`.eslintrc`, `tsconfig.json`, `vite.config.ts`) in tarball
- [ ] No secrets, tokens, or API keys anywhere in tarball

---

## Stage 5 — Consumer Import Test

Create a temp directory and test a real install from the tarball.

```bash
# 16. Pack
npm pack
# Produces: your-package-1.0.0.tgz

# 17. Create clean consumer
mkdir /tmp/pkg-test && cd /tmp/pkg-test
npm init -y
npm install /path/to/your-package-1.0.0.tgz react react-dom

# 18. Test ESM import
node --input-type=module --eval \
  'import { Button } from "your-package"; console.log(typeof Button)'
# Expected output: function

# 19. Test CJS import
node -e "const p = require('your-package'); console.log(Object.keys(p))"
# Expected output: array of exported names

# 20. Test TypeScript resolution
echo 'import { Button } from "your-package"' > test.ts
npx tsc --noEmit --moduleResolution bundler --module esnext --strict test.ts
# Expected: no errors

# 21. Clean up
cd ~ && rm -rf /tmp/pkg-test
```

- [ ] ESM named import resolves and exports are functions/objects
- [ ] CJS require resolves and exports are correct
- [ ] TypeScript resolves types without errors
- [ ] Subpath imports work if documented (e.g., `from "pkg/tokens"`)
- [ ] No duplicate peer dependency installed inside package (check: `npm ls react`)

---

## Stage 6 — Version and Changelog

```bash
# 22. Bump version
# Patch: bug fixes only
npm version patch

# Minor: new features, backwards compatible
npm version minor

# Major: breaking changes
npm version major

# 23. Update CHANGELOG.md before tagging
```

- [ ] Version bump follows semver rules correctly
- [ ] `CHANGELOG.md` updated with all changes for this version
- [ ] Breaking changes are explicitly documented
- [ ] Migration guide written for major versions
- [ ] Git tag created: `git tag v1.0.0`

---

## Stage 7 — Publish

```bash
# 24. Final publish (prepublishOnly will re-run all gates)
npm publish --access public

# With provenance (strongly recommended, requires CI)
npm publish --provenance --access public
```

- [ ] `prepublishOnly` script ran and passed
- [ ] Published from CI, not from a local laptop (strongly recommended)
- [ ] npm 2FA confirmed on maintainer account
- [ ] Provenance flag used
- [ ] Verify live on npm: `npm view @your-scope/package-name`

---

## Stage 8 — Post-Publish Verification

```bash
# 25. Verify the published package resolves
npm view @your-scope/package-name

# 26. Fresh install in a new project
mkdir /tmp/post-publish-test && cd /tmp/post-publish-test
npm init -y
npm install @your-scope/package-name
node -e "console.log(require('@your-scope/package-name'))"

# 27. Clean up
cd ~ && rm -rf /tmp/post-publish-test
```

- [ ] `npm view` shows correct version, description, and license
- [ ] Fresh install from registry works
- [ ] Import from installed registry version works
- [ ] npmjs.com listing shows correct README
- [ ] npmjs.com listing shows provenance badge

---

## Rollback Plan

If a broken version was published:

```bash
# Deprecate the broken version immediately
npm deprecate @your-scope/package-name@"1.0.1" \
  "Broken release — do not use. Upgrade to 1.0.2."

# Publish a fix as a new patch
npm version patch
npm publish --access public

# Only unpublish within 72 hours if absolutely necessary
npm unpublish @your-scope/package-name@"1.0.1" --force
```

- [ ] Broken version deprecated with a clear message
- [ ] Patch release published
- [ ] Users notified via GitHub issue or release notes

---

## Quick Reference — Command Summary

```bash
git status && git pull origin main
rm -rf node_modules && npm ci
npm audit --audit-level=high
npm run lint
npm run type-check
npm run test
npm run build
npm pack --dry-run
npm publish --provenance --access public
npm view @your-scope/package-name
```