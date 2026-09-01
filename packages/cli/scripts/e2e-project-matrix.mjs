/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Real end-to-end check: scaffold minimal fixture projects across the
// router x language matrix the CLI branches on, run the real CLI against
// the real live registry, then run the real framework build. This is the
// only thing that catches "the stripped output doesn't actually parse" -
// unit tests assert against our own model of what the transform should
// produce, this runs real source through the real parser.
//
// ponytail: package manager (npm/pnpm/yarn/bun) is detected by lockfile
// presence alone (see package-manager.js) and doesn't touch file content,
// so it's unit-tested, not matrixed here - add a combo if that ever stops
// being true.

import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ENTRY = resolve(__dirname, "../src/index.js");

// A handful of real, diverse free effects: multi-file, single-file, webgl
// (heavy generics - this is what broke), different dependency sets.
// Pro effects can't be verified here (add refuses without a valid Pro
// token, correctly - see whoami/pro-gating tests) so this is the full free
// catalog, not a curated sample: real build coverage over guesswork about
// which effects are "representative".
const EFFECTS = [
  "animated-faq",
  "arrow-fill-button",
  "block-transition",
  "chess-grid-transition",
  "circular-split-roll",
  "directional-menu",
  "dotted-grid",
  "elevate-navbar",
  "fractal-glass",
  "gooey-counter",
  "horizontal-feature-reveal",
  "hover-stack",
  "immersive-full-screen-nav",
  "infinite-perspective-slider",
  "interactive-blur-reveal",
  "interactive-list-preview",
  "link-button",
  "milky-way",
  "number-counter",
  "numeric-tunnel",
  "phantom-image-trail",
  "pixelated-image-effect",
  "rectangular-text-reveal",
  "rotation-slider",
  "scramble-link-button",
  "spider-particles",
  "split-canvas",
  "stack-loader",
  "sticky-content-wrapper",
  "text-convergence",
  "zoom-slider",
];

const COMBOS = [
  { name: "ts-app", typescript: true, framework: "next", router: "app" },
  { name: "js-app", typescript: false, framework: "next", router: "app" },
  { name: "ts-pages", typescript: true, framework: "next", router: "pages" },
  { name: "js-pages", typescript: false, framework: "next", router: "pages" },
  { name: "ts-vite-react", typescript: true, framework: "react" },
  { name: "js-vite-react", typescript: false, framework: "react" },
];

function run(cmd, args, cwd, opts = {}) {
  return execFileSync(cmd, args, { cwd, encoding: "utf8", ...opts });
}

function scaffold(dir, combo) {
  if (combo.framework === "react") return scaffoldVite(dir, combo);
  return scaffoldNext(dir, combo);
}

function scaffoldNext(dir, { typescript, router }) {
  mkdirSync(join(dir, "src"), { recursive: true });

  const deps = { next: "^16.0.0", react: "^19.0.0", "react-dom": "^19.0.0" };
  const devDeps = { tailwindcss: "^4.0.0", "@tailwindcss/postcss": "^4.0.0" };
  if (typescript) {
    Object.assign(devDeps, {
      typescript: "^5.7.0",
      "@types/node": "^22.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
    });
  }

  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
      { name: "e2e-fixture", version: "0.0.0", private: true, dependencies: deps, devDependencies: devDeps },
      null,
      2
    )
  );

  writeFileSync(join(dir, "next.config.js"), "module.exports = {};\n");
  writeFileSync(
    join(dir, "postcss.config.mjs"),
    'export default { plugins: { "@tailwindcss/postcss": {} } };\n'
  );

  // Real `create-next-app` always emits an alias config - tsconfig.json for
  // TS, jsconfig.json for JS - never neither. Missing this for JS fixtures
  // silently broke every "@/..." import in the JS combos.
  const configName = typescript ? "tsconfig.json" : "jsconfig.json";
  const tsOnlyFields = typescript
    ? { target: "ES2017", strict: true, esModuleInterop: true }
    : {};
  writeFileSync(
    join(dir, configName),
    JSON.stringify(
      {
        compilerOptions: {
          ...tsOnlyFields,
          lib: ["dom", "dom.iterable", "esnext"],
          jsx: "preserve",
          module: "esnext",
          moduleResolution: "bundler",
          skipLibCheck: true,
          paths: { "@/*": ["./src/*"] },
        },
        include: typescript ? ["**/*.ts", "**/*.tsx"] : ["**/*.js", "**/*.jsx"],
      },
      null,
      2
    )
  );

  const ext = typescript ? "tsx" : "jsx";
  const childrenParam = typescript ? "{ children }: { children: React.ReactNode }" : "{ children }";
  const appParam = typescript
    ? "{ Component, pageProps }: { Component: React.ComponentType; pageProps: object }"
    : "{ Component, pageProps }";
  const reactImport = typescript ? 'import React from "react";\n' : "";

  // Only ever create the directory matching this combo's router - a real
  // Pages Router project has no app/ dir at all, and detectNextRouter()
  // checks app/ before pages/, so leaving a stray src/app/ around (even
  // just for globals.css) makes a "pages" fixture misdetect as "app".
  if (router === "app") {
    mkdirSync(join(dir, "src/app"), { recursive: true });
    writeFileSync(join(dir, "src/app/globals.css"), '@import "tailwindcss";\n');
    writeFileSync(
      join(dir, `src/app/layout.${ext}`),
      `${reactImport}import "./globals.css";\nexport default function RootLayout(${childrenParam}) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}\n`
    );
    writeFileSync(
      join(dir, `src/app/page.${ext}`),
      `export default function Home() {\n  return <div>home</div>;\n}\n`
    );
  } else {
    mkdirSync(join(dir, "src/pages"), { recursive: true });
    mkdirSync(join(dir, "src/styles"), { recursive: true });
    writeFileSync(join(dir, "src/styles/globals.css"), '@import "tailwindcss";\n');
    writeFileSync(
      join(dir, `src/pages/_app.${ext}`),
      `${reactImport}import "../styles/globals.css";\nexport default function App(${appParam}) {\n  return <Component {...pageProps} />;\n}\n`
    );
    writeFileSync(
      join(dir, `src/pages/index.${ext}`),
      `export default function Home() {\n  return <div>home</div>;\n}\n`
    );
  }
}

function scaffoldVite(dir, { typescript }) {
  mkdirSync(join(dir, "src"), { recursive: true });

  const deps = { react: "^19.0.0", "react-dom": "^19.0.0" };
  const devDeps = {
    vite: "^6.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    tailwindcss: "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
  };
  if (typescript) {
    Object.assign(devDeps, {
      typescript: "^5.7.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
    });
  }

  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
      { name: "e2e-fixture", version: "0.0.0", private: true, type: "module", dependencies: deps, devDependencies: devDeps },
      null,
      2
    )
  );

  const ext = typescript ? "tsx" : "jsx";
  const configExt = typescript ? "ts" : "js";

  // detectProjectEnvironment() needs a vite.config.* AND the alias resolver
  // needs it importable - `hyperiux init -y` is responsible for wiring the
  // "@/*" alias into this file itself (autoConfigureImportAlias), so it
  // starts deliberately alias-less here, same as a real `npm create vite`.
  writeFileSync(
    join(dir, `vite.config.${configExt}`),
    typescript
      ? `import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nimport tailwindcss from "@tailwindcss/vite";\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n});\n`
      : `import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nimport tailwindcss from "@tailwindcss/vite";\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n});\n`
  );

  if (typescript) {
    writeFileSync(
      join(dir, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            target: "ES2020",
            lib: ["dom", "dom.iterable", "esnext"],
            jsx: "react-jsx",
            module: "esnext",
            moduleResolution: "bundler",
            strict: true,
            skipLibCheck: true,
            esModuleInterop: true,
          },
          include: ["src"],
        },
        null,
        2
      )
    );
  }

  writeFileSync(
    join(dir, "index.html"),
    `<!doctype html>\n<html>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.${ext}"></script>\n  </body>\n</html>\n`
  );

  writeFileSync(join(dir, "src/index.css"), '@import "tailwindcss";\n');
  writeFileSync(
    join(dir, `src/main.${ext}`),
    `import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport "./index.css";\nimport App from "./App.${ext}";\n\ncreateRoot(document.getElementById("root")).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n`
  );
  writeFileSync(
    join(dir, `src/App.${ext}`),
    `export default function App() {\n  return <div>home</div>;\n}\n`
  );
}

function main() {
  const results = [];

  for (const combo of COMBOS) {
    const dir = mkdtempSync(join(tmpdir(), `hyperiux-e2e-${combo.name}-`));
    const log = (msg) => console.log(`[${combo.name}] ${msg}`);

    try {
      log(`scaffolding (${dir})`);
      scaffold(dir, combo);

      log("npm install");
      run("npm", ["install", "--no-audit", "--no-fund"], dir, { stdio: "ignore" });

      log("hyperiux init");
      run("node", [CLI_ENTRY, "init", "-y"], dir, { stdio: "ignore" });

      const installed = [];

      for (const effect of EFFECTS) {
        try {
          log(`add ${effect}`);
          run("node", [CLI_ENTRY, "add", effect, "-y"], dir, { stdio: "pipe" });
          results.push({ combo: combo.name, effect, step: "add", ok: true });
          installed.push(effect);
        } catch (err) {
          const text = `${err.stdout || ""}\n${err.stderr || ""}`.trim();
          // A refused install (e.g. next-transition-router effect outside
          // App Router) is the CLI correctly doing its job, not a failure -
          // don't count it and don't expect it to be importable below.
          const refused = /only works in a Next\.js App Router project/.test(text);
          results.push({
            combo: combo.name,
            effect,
            step: "add",
            ok: refused ? true : false,
            note: refused ? "correctly refused (App Router required)" : undefined,
            error: refused ? undefined : text.slice(0, 1000) || err.message,
          });
        }
      }

      // Every effect that actually got installed must be imported somewhere
      // for the build to type-check/parse it - write a page importing all
      // of them. Effects the CLI correctly refused are excluded on purpose.
      const ext = combo.typescript ? "tsx" : "jsx";
      const importLines = installed.map(
        (e, i) => `import E${i} from "@/components/effects/${e}";`
      ).join("\n");
      const usageLines = installed.map((_, i) => `      <E${i} />`).join("\n");
      const pageContent = `${importLines}\nexport default function AllEffects() {\n  return (\n    <div>\n${usageLines}\n    </div>\n  );\n}\n`;

      if (combo.framework === "react") {
        writeFileSync(join(dir, `src/App.${ext}`), pageContent.replace("AllEffects", "App"));
      } else if (combo.router === "app") {
        mkdirSync(join(dir, "src/app/all-effects"), { recursive: true });
        writeFileSync(join(dir, `src/app/all-effects/page.${ext}`), pageContent);
      } else {
        writeFileSync(join(dir, `src/pages/all-effects.${ext}`), pageContent);
      }

      const buildCmd = combo.framework === "react" ? "vite" : "next";
      log(`${buildCmd} build`);
      try {
        run("npx", [buildCmd, "build"], dir, { stdio: "pipe" });
        results.push({ combo: combo.name, effect: "*all*", step: "build", ok: true });
        log("build OK");
      } catch (err) {
        results.push({
          combo: combo.name,
          effect: "*all*",
          step: "build",
          ok: false,
          error: `${err.stdout || ""}\n${err.stderr || ""}`.trim().slice(0, 2000) || err.message,
        });
        log("build FAILED");
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  console.log("\n=== RESULTS ===\n");
  const failures = results.filter((r) => !r.ok);
  for (const r of results) {
    const suffix = r.note ? `  (${r.note})` : "";
    console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.combo}  ${r.step}  ${r.effect}${suffix}`);
    if (!r.ok) console.log(`  ${r.error}\n`);
  }
  console.log(`\n${results.length - failures.length}/${results.length} passed.`);

  if (failures.length) process.exit(1);
}

main();
