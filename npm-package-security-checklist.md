# npm Package Security Checklist

> Run before every publish. No exceptions.
> Version: 1.0.0 | Updated: June 2026

---

## 1) Dependency Vulnerability Audit

```bash
# Run full audit
npm audit

# Block on high and critical only (recommended for CI)
npm audit --audit-level=high

# Auto-fix safe remediations
npm audit fix

# Review what cannot be auto-fixed
npm audit fix --dry-run
```

### Pass/Fail criteria

| Severity | Policy |
|---|---|
| Critical | ❌ BLOCK publish immediately |
| High | ❌ BLOCK publish immediately |
| Moderate | ⚠️ Document and plan fix within 30 days |
| Low | ℹ️ Track; fix in next scheduled update |

- [ ] Zero CRITICAL vulnerabilities
- [ ] Zero HIGH vulnerabilities
- [ ] All MODERATE vulnerabilities documented with remediation plan

---

## 2) Dependency Reputation Check

Before adding any new dependency, verify:

```bash
# Check package age, download count, last publish
npm view <package-name>

# Check for known issues
npm audit <package-name>

# Check license
npx license-checker --summary
```

### Red flags for any dependency

- [ ] Last published more than 2 years ago with open security issues
- [ ] Fewer than 1,000 weekly downloads with no major adopters
- [ ] No `repository` field in its own `package.json`
- [ ] Contains a `postinstall` or `preinstall` script
- [ ] Owner account has published only 1–2 packages
- [ ] Name is suspiciously close to a popular package (typosquatting)

---

## 3) Install Script Risk

Install scripts (`preinstall`, `install`, `postinstall`) execute code on the consumer's machine at install time. They are a primary attack vector.

```bash
# Check your own package
cat package.json | grep -A 10 '"scripts"'

# Check all dependencies for install scripts
npm ls --depth=1 | xargs -I{} sh -c \
  'cat node_modules/{}/package.json 2>/dev/null | grep -l "postinstall\|preinstall"'
```

- [ ] Your package has NO `preinstall`, `install`, or `postinstall` scripts
- [ ] If install scripts are required, they are documented and audited
- [ ] No direct dependencies run undocumented shell commands on install

---

## 4) Secret and Credential Exposure

The most damaging security incident for an npm package: accidentally publishing API keys, tokens, or credentials.

```bash
# Check for common secret patterns in your source
grep -rn \
  "API_KEY\|SECRET\|TOKEN\|PASSWORD\|PRIVATE_KEY\|AWS_\|DATABASE_URL" \
  src/ --include="*.ts" --include="*.js"

# Check what will actually be published
npm pack --dry-run

# Unpack and scan the tarball
npm pack
mkdir /tmp/tarball-scan && cd /tmp/tarball-scan
tar -xf /path/to/your-package-*.tgz
grep -rn "API_KEY\|SECRET\|TOKEN\|PASSWORD\|PRIVATE_KEY" package/
cd ~ && rm -rf /tmp/tarball-scan && rm /path/to/your-package-*.tgz
```

### Files that must NEVER be published

- `.env`, `.env.local`, `.env.production`
- `*.pem`, `*.key`, `*.p12`
- `config/secrets.*`
- `credentials.json`
- `.npmrc` containing auth tokens
- Any file with hardcoded credentials

```bash
# Add to .npmignore (or control via "files" in package.json — preferred)
.env*
*.pem
*.key
*.p12
.npmrc
config/secrets.*
```

- [ ] No secrets found in source files
- [ ] No secrets found in tarball
- [ ] `.env` files are in `.gitignore` AND `.npmignore`
- [ ] No hardcoded tokens in any configuration file

---

## 5) Code Execution Risk

These patterns are dangerous in npm packages because they can execute arbitrary code at runtime.

```bash
# Scan for dangerous patterns
grep -rn \
  "eval(\|new Function(\|child_process\|execSync\|exec(\|spawn(\|__dirname.*require\|path.join.*require" \
  src/ --include="*.ts" --include="*.js"
```

### Risk classification

| Pattern | Risk | Action |
|---|---|---|
| `eval(userInput)` | Critical | Replace with safe alternative |
| `new Function(userInput)` | Critical | Replace with safe alternative |
| `child_process.exec(userInput)` | Critical | Sanitize all inputs |
| `require(dynamicVariable)` | High | Replace with static imports |
| `fs.readFile(userPath)` | Medium | Validate and sanitize path |
| `JSON.parse(userInput)` | Low | Wrap in try/catch |

- [ ] No `eval()` with external input
- [ ] No `new Function()` with external input
- [ ] No shell command execution with unsanitized input
- [ ] No dynamic `require()` with user-controlled paths
- [ ] No path traversal risk in file operations

---

## 6) Prototype Pollution Risk

Especially relevant for packages that merge, extend, or deep-copy objects.

```bash
# Scan for risky patterns
grep -rn \
  "__proto__\|constructor\[.prototype.\]\|Object.assign\|merge(\|deepMerge(" \
  src/ --include="*.ts" --include="*.js"
```

### Safe merge pattern

```ts
// UNSAFE
function merge(target: any, source: any) {
  for (const key in source) {
    target[key] = source[key];  // __proto__ can be set here
  }
}

// SAFE
function merge<T extends object>(target: T, source: Partial<T>): T {
  const safeKeys = Object.keys(source).filter(
    key => key !== "__proto__" && key !== "constructor" && key !== "prototype"
  );
  return Object.assign({}, target, Object.fromEntries(
    safeKeys.map(k => [k, (source as any)[k]])
  )) as T;
}
```

- [ ] No object merge operations vulnerable to prototype pollution
- [ ] User-controlled keys are validated before use as object properties

---

## 7) Publishing Account Security

```bash
# Check who can publish this package
npm owner ls @your-scope/package-name

# Verify 2FA is enabled (do this in browser at npmjs.com/settings)
# Require 2FA for publish:
npm profile set auth-and-writes --otp=<your-otp>
```

- [ ] npm account has 2FA enabled (auth-and-writes mode)
- [ ] Only authorized team members are listed as package owners
- [ ] Publishing tokens are scoped to publish-only (not read-write-admin)
- [ ] Publishing tokens are stored in CI secrets, not in code or dotfiles
- [ ] No publishing tokens in `.npmrc` committed to the repository

---

## 8) npm Provenance

Provenance cryptographically links a published package to the CI workflow that created it, so consumers can verify the package matches source code.

```yaml
# .github/workflows/release.yml
- name: Publish to npm
  run: npm publish --provenance --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

# Required permissions block
permissions:
  id-token: write
  contents: read
```

- [ ] Provenance enabled in `publishConfig`: `{ "provenance": true }`
- [ ] Publish step uses `--provenance` flag
- [ ] GitHub Actions has `id-token: write` permission
- [ ] npmjs.com listing shows the provenance badge after publish

---

## 9) License and Third-Party Risk

```bash
# Check all dependency licenses
npx license-checker --summary

# Check for GPL/AGPL (incompatible with proprietary use)
npx license-checker --failOn "GPL;AGPL"
```

### License compatibility

| Dependency license | Risk for proprietary package |
|---|---|
| MIT, ISC, BSD-2, BSD-3 | ✅ Safe |
| Apache-2.0 | ✅ Safe with notice |
| LGPL | ⚠️ Review required |
| GPL, AGPL | ❌ Incompatible — do not use |
| UNLICENSED | ❌ Do not use |

- [ ] Zero GPL or AGPL dependencies
- [ ] No UNLICENSED dependencies
- [ ] `THIRD_PARTY_LICENSES.md` generated and committed

---

## 10) CI Security Gates

Every CI pipeline for an npm package must enforce these checks automatically.

```yaml
# Minimum required security jobs in CI
- name: Security audit
  run: npm audit --audit-level=high

- name: License check
  run: npx license-checker --failOn "GPL;AGPL"

- name: Secret scan
  uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: main
    head: HEAD
```

- [ ] `npm audit --audit-level=high` runs on every PR
- [ ] License check runs on every PR
- [ ] Secret scanning runs on every PR (TruffleHog, GitLeaks, or equivalent)
- [ ] CI blocks merge if any security check fails
- [ ] Dependency review runs on `package-lock.json` changes

---

## Quick Reference — Security Commands

```bash
npm audit --audit-level=high
npm outdated
npx license-checker --summary
npx license-checker --failOn "GPL;AGPL"
npm pack --dry-run
grep -rn "API_KEY\|SECRET\|TOKEN" src/
npm owner ls @your-scope/package-name
```