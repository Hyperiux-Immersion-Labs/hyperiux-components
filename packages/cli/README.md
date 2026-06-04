# Hyperiux

[![npm version](https://img.shields.io/npm/v/hyperiux.svg?style=flat-square&color=ff5f00)](https://www.npmjs.com/package/hyperiux)
[![npm downloads](https://img.shields.io/npm/dm/hyperiux.svg?style=flat-square&color=777777)](https://www.npmjs.com/package/hyperiux)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**CLI for [Hyperiux Vault](https://components.hyperiux.com) — a collection of high-quality animation effects and interactive components for Next.js.**

Pick the effects you want. The CLI fetches the source directly into your project. You own the code.

```bash
npx hyperiux add blur-text
```

**[components.hyperiux.com](https://components.hyperiux.com)** · **[hyperiux.com](https://hyperiux.com)**

---

## Quick Start

**1. Initialize**
```bash
npx hyperiux init
```
Creates a `hyperiux.json` config file at your project root. Run once per project.

**2. Add a free effect**
```bash
npx hyperiux add blur-text
```

**3. Use it**
```jsx
import { BlurText } from "@/components/hyperiux/blur-text";

export default function Page() {
  return <BlurText>Hello, world.</BlurText>;
}
```

---

## Commands

### `init`
```bash
npx hyperiux init
npx hyperiux init --yes    # skip prompts, use defaults
```
Prompts for your global CSS path and path aliases. Use `--yes` to accept defaults for a standard Next.js App Router project.

### `add`
```bash
npx hyperiux add <effect-name>
npx hyperiux add <effect-name> --overwrite    # overwrite existing files
npx hyperiux add <effect-name> --yes          # skip confirmation prompts
npx hyperiux add <effect-name> --dry-run      # preview without writing files
```
Fetches the component source, installs any required npm dependencies, and writes the files into your project.

Multi-file effects install all helper files together so relative imports resolve correctly.

### `list`
```bash
npx hyperiux list
```
Prints all available effects grouped by category.

### `login`
```bash
npx hyperiux login
```
Connects your Hyperiux Pro account so you can install pro effects. Opens `components.hyperiux.com/cli-auth` where you generate a token, then paste it into the prompt.

### `logout`
```bash
npx hyperiux logout
```
Removes your saved credentials from `~/.hyperiux/auth.json`.

### `whoami`
```bash
npx hyperiux whoami
```
Shows whether you are currently logged in.

---

## Free vs Pro

Hyperiux Vault has **32 free effects** and **83 pro effects**.

Free effects install without any authentication:
```bash
npx hyperiux add blur-text
```

Pro effects require a [Pro subscription](https://components.hyperiux.com/pricing) and a CLI token:
```bash
npx hyperiux login      # authenticate once
npx hyperiux add milkyway
```

[Browse all effects →](https://components.hyperiux.com/effects)

---

## Configuration

`hyperiux.json` is created at your project root by `init`:

```json
{
  "$schema": "https://components.hyperiux.com/schema.json",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css"
  },
  "aliases": {
    "components": "@/components",
    "effects": "@/components/hyperiux",
    "hooks": "@/hooks",
    "lib": "@/lib"
  }
}
```

The `aliases.effects` value controls where effect files are written.

---

## Requirements

- **Node.js** 18+
- **Next.js** (App Router recommended)
- **Tailwind CSS**

---

## License

MIT — free to use in personal and commercial projects.

Built by [Hyperiux](https://hyperiux.com).
