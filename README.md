# ⚡ Hyperiux Vault

[![npm version](https://img.shields.io/npm/v/hyperiux.svg?style=flat-square&color=ff5f00)](https://www.npmjs.com/package/hyperiux)
[![npm downloads](https://img.shields.io/npm/dm/hyperiux.svg?style=flat-square&color=777777)](https://www.npmjs.com/package/hyperiux)

**A free, open-source collection of high-quality animation effects and interactive components for Next.js — designed by [Hyperiux](https://hyperiux.com).**

Pick the effects you want. Copy the code into your project via the CLI. Own it completely.

---

## 📖 Table of Contents

- [What is Hyperiux Vault?](#-what-is-hyperiux-vault)
- [✨ Key Features](#-key-features)
- [🚀 Quick Start](#-quick-start)
- [💻 TypeScript Example](#-typescript-example)
- [🧩 Component Showcase & Usage](#-component-showcase--usage)
- [🛠️ CLI Reference](#️-cli-reference)
- [⚙️ Configuration](#️-configuration)
- [👥 Who is Using Hyperiux?](#-who-is-using-hyperiux)
- [💖 Thanks & Credits](#-thanks--credits)
- [🌐 Connect with Us](#-connect-with-us)
- [📄 License](#-license)

---

## ❓ What is Hyperiux Vault?

Hyperiux Vault is **not an npm component library** that you install as a single giant dependency. It's closer in spirit to [shadcn/ui](https://ui.shadcn.com) — a registry of source code that you add directly into your project via a command-line interface.

- **Zero Lock-in**: Every effect lives in your codebase as a native file. You can edit, customize, or debug it directly.
- **Tailored Aesthetics**: Crafted with a premium orange-and-white theme (`#ff5f00`), ultra-tight typography headings, and fluid, financial-grade transitions.
- **100+ Premium Animations**: Ranging from simple Framer Motion transitions to complex GSAP scroll storyboards, custom shaders, and Three.js/WebGL scenes.

---

## ✨ Key Features

- 🌀 **WebGL & 3D Scenes**: Three.js and React Three Fiber models, interactive grid tunnels, milkyway galaxies, and curved image carousels.
- 📜 **GSAP ScrollTrigger**: Parallax galleries, stacking cards, draggable marquees, and horizontal story sliders.
- 🎨 **Coinbase-Inspired Design System**: Bold accents, 56px pill buttons, and responsive layouts that alternate clean light and near-black surfaces.
- ⚡ **Auto-Dependency Installation**: The CLI handles both local helper imports and package dependencies (like GSAP, R3F, Framer Motion, and Lenis) automatically.

---

## 🚀 Quick Start

### Step 1: Initialize the Config
Run the initialization command at your project root to configure paths and setup alias mappings:

```bash
npx hyperiux init
```

*To skip confirmation prompts and accept defaults (recommended for a standard Next.js App Router project), run:*
```bash
npx hyperiux init --yes
```

This generates a `hyperiux.json` configuration file at your root directory.

### Step 2: Add an Effect
Use the CLI to pull down the source code for an effect:

```bash
npx hyperiux add blur-text
```

This fetches the metadata, installs necessary dependencies (e.g. `framer-motion`), and writes the React component straight to your components directory (e.g. `src/components/hyperiux/blur-text.jsx`).

### Step 3: Import and Use
Import the component and drop it into your page:

```jsx
import { BlurText } from "@/components/hyperiux/blur-text";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0b0d] text-white">
      <BlurText 
        blur={15}
        duration={0.8}
        variant="up"
        className="text-5xl font-black tracking-tight"
      >
        Elevate your user experience.
      </BlurText>
    </main>
  );
}
```

---

## 💻 TypeScript Example

Although Hyperiux Vault components are shipped as modern JSX, they work seamlessly in TypeScript projects. Below is an example demonstrating how you can define custom page props and integrate a component in a TypeScript environment:

```typescript
import React from "react";
import { BlurText } from "@/components/hyperiux/blur-text";

interface LandingHeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
}

export default function LandingHero({ title, subtitle, ctaText = "get started" }: LandingHeroProps): React.JSX.Element {
  return (
    <header className="py-24 px-6 text-center bg-[#ffffff]">
      {/* Title with staggered blur reveal */}
      <h1 className="text-6xl font-extrabold tracking-tighter text-[#0a0b0d]">
        <BlurText variant="fade" delay={0.1}>
          {title}
        </BlurText>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg text-[#5b616e] max-w-xl mx-auto">
        {subtitle}
      </p>

      {/* Primary Pill Call to Action */}
      <div className="mt-10">
        <button className="px-8 py-4 bg-[#0a0b0d] hover:bg-[#ff9253] text-[#ffffff] text-sm font-semibold tracking-wide rounded-[56px] transition-colors duration-200 uppercase">
          {ctaText}
        </button>
      </div>
    </header>
  );
}
```

---

## 🧩 Component Showcase & Usage

Below is a breakdown of our most popular components, including code examples and full API references.

### 1. BlurText (`text`)
A text element that smoothly transitions words from blur to focus on enter or scroll.

#### API Reference
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `string \| ReactNode` | *(Required)* | The text or children elements to animate. |
| `delay` | `number` | `0` | Delay (in seconds) before the animation begins. |
| `duration` | `number` | `0.5` | Animation duration (in seconds) for each word. |
| `blur` | `number` | `10` | Initial blur intensity (in pixels). |
| `className` | `string` | `""` | Additional CSS classes for custom styling. |
| `variant` | `"fade" \| "left" \| "right" \| "up" \| "down"` | `"fade"` | The entry direction for the words. |

#### Code Snippet
```jsx
<BlurText variant="up" delay={0.2} blur={12} duration={0.6}>
  Experience digital design at its highest resolution.
</BlurText>
```

---

### 2. MilkyWay (`webgl`)
A raw WebGL scene that renders a gorgeous, interactive 3D particle galaxy reacting to cursor movement and scroll depth.

#### API Reference
| Prop | Type | Default | Description |
|---|---|---|---|
| `particleCount` | `number` | `5000` | Total number of individual stars in the galaxy. |
| `speed` | `number` | `1.0` | Rotation speed multiplier. |
| `color` | `string` | `"#ff5f00"` | Base color tint of the galaxy particles. |

#### Code Snippet
```jsx
import { MilkyWay } from "@/components/hyperiux/milkyway";

export default function GalaxySection() {
  return (
    <div className="relative w-full h-[600px] bg-black">
      <MilkyWay particleCount={8000} speed={1.2} color="#ff5f00" />
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <h2 className="text-white text-4xl font-bold uppercase">To Infinity</h2>
      </div>
    </div>
  );
}
```

---

## 🛠️ CLI Reference

The CLI binary is called `hyperiux`. You can run all commands directly via `npx`.

### 📌 `init`
Creates the configuration file `hyperiux.json` at your project root.
```bash
npx hyperiux init [options]
```
- `-y, --yes`: Skip configuration prompts and accept standard defaults.

### 📌 `add`
Fetches a component, installs any missing dependencies, and writes the code to your components path.
```bash
npx hyperiux add <effect-name> [options]
```
- `-o, --overwrite`: Overwrite the file if it already exists in your local folder.
- `-y, --yes`: Skip confirmation prompts.
- `-d, --dry-run`: Output what files would be created and dependencies installed without actually writing anything to disk.

### 📌 `list`
Prints out a list of all available effects in the registry grouped by categories.
```bash
npx hyperiux list
```

---

## ⚙️ Configuration

Your `hyperiux.json` file dictates where components are placed and how they resolve Tailwind utility paths:

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

---

## 👥 Who is Using Hyperiux?

Hyperiux Vault is trusted by creative developers and agencies worldwide:

*   **Creative Digital Studios**: Building immersive, awards-worthy portfolios, custom agency layouts, and interactive products.
*   **Startup & SaaS Founders**: Crafting high-converting, orange-themed financial landing pages with strict, premium aesthetics.
*   **WebGL & Creative Developers**: Prototyping complex canvas interactions, three.js layers, and visual effects without boilerplate friction.
*   **Independent Designers**: Taking complete ownership of premium layout source code without third-party component wrappers.

> 💡 **Using Hyperiux in your project?** Open a [Showcase Issue](https://github.com/hyperiux/hyperiux-ui/issues/new) to get your project featured here!

---

## 💖 Thanks & Credits

Hyperiux Vault is built on top of incredible open-source tools. We want to thank:

- **[GreenSock (GSAP)](https://greensock.com/)** for the absolute best-in-class scroll-driven and timeline animations.
- **[Three.js](https://threejs.org/) & [React Three Fiber](https://github.com/pmndrs/react-three-fiber)** for enabling seamless WebGL scenes in modern React.
- **[Framer Motion](https://www.framer.com/motion/)** for making UI micro-interactions lightweight and delightful.
- **[Lenis Scroll](https://github.com/darkroomengineering/lenis)** for unifying smooth scrolling controls across diverse browsers.
- **[shadcn/ui](https://ui.shadcn.com/)** for the inspiration behind the CLI distribution model that respects developer code ownership.

---


## 🌐 Connect with Us

Follow the agency team behind the Vault:

| Channel | Link |
|---|---|
| 🌐 **Official Website** | [hyperiux.com](https://hyperiux.com) |
| 🎨 **UI Component Portal** | [components.hyperiux.com](https://components.hyperiux.com/) |
| 💻 **GitHub Repository** | [github.com/hyperiux/hyperiux-ui](https://github.com/hyperiux/hyperiux-ui) |


---

## 📄 License

Licensed under the **MIT License**. Free to use for personal, open-source, and commercial projects. Created with passion by **Hyperiux**.
