/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import fs from "fs";
import path from "path";

const CONFIG_FILE = "hyperiux.json";

const DEFAULT_CONFIG = {
  $schema: "https://vault.hyperiux.com/schema.json",
  framework: "next",
  router: null,
  tailwind: {
    config: "tailwind.config.js",
    css: "src/app/globals.css",
  },
  aliases: {
    components: "@/components",
    effects: "@/components/effects",
    hooks: "@/hooks",
    lib: "@/lib",
  },
  installedEffects: {},
};

export function getConfigPath(cwd = process.cwd()) {
  return path.join(cwd, CONFIG_FILE);
}

export function configExists(cwd = process.cwd()) {
  return fs.existsSync(getConfigPath(cwd));
}

export function readConfig(cwd = process.cwd()) {
  const configPath = getConfigPath(cwd);
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const content = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(content);
}

export function writeConfig(config, cwd = process.cwd()) {
  const configPath = getConfigPath(cwd);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
}

export function getDefaultConfig() {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

export function detectProjectEnvironment(cwd = process.cwd()) {
  const packageJson = readPackageJson(cwd);
  const dependencies = {
    ...(packageJson?.dependencies || {}),
    ...(packageJson?.devDependencies || {}),
  };

  const hasNextConfig = hasAnyPath(cwd, [
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "next.config.cjs",
  ]);

  if (dependencies.next || hasNextConfig) {
    return "next";
  }

  const hasViteConfig = hasAnyPath(cwd, [
    "vite.config.js",
    "vite.config.mjs",
    "vite.config.ts",
    "vite.config.cjs",
  ]);

  if (
    dependencies.react ||
    dependencies["@vitejs/plugin-react"] ||
    dependencies.vite ||
    hasViteConfig ||
    hasAnyPath(cwd, ["src/main.jsx", "src/main.tsx", "src/App.jsx", "src/App.tsx"])
  ) {
    return "react";
  }

  return "unknown";
}

export function detectProjectLanguage(cwd = process.cwd()) {
  const packageJson = readPackageJson(cwd);
  const dependencies = {
    ...(packageJson?.dependencies || {}),
    ...(packageJson?.devDependencies || {}),
  };

  if (
    dependencies.typescript ||
    hasAnyPath(cwd, [
      "tsconfig.json",
      "next.config.ts",
      "vite.config.ts",
      "src/main.tsx",
      "src/App.tsx",
      "src/app/page.tsx",
      "app/page.tsx",
      "src/pages/_app.tsx",
      "pages/_app.tsx",
    ])
  ) {
    return "tsx";
  }

  return "jsx";
}

export function detectNextRouter(cwd = process.cwd()) {
  if (hasAnyPath(cwd, ["src/app", "app"])) {
    return "app";
  }
  if (hasAnyPath(cwd, ["src/pages", "pages"])) {
    return "pages";
  }
  return null;
}

export function detectCssPath(
  cwd = process.cwd(),
  framework = detectProjectEnvironment(cwd),
  router = framework === "next" ? detectNextRouter(cwd) : null
) {
  const reactPaths = [
    "src/index.css",
    "src/main.css",
    "src/App.css",
    "src/styles.css",
    "src/styles/globals.css",
    "styles/globals.css",
  ];

  const nextAppPaths = ["src/app/globals.css", "app/globals.css"];

  const nextPagesPaths = ["src/styles/globals.css", "styles/globals.css"];

  let candidates;
  if (framework === "react") {
    candidates = reactPaths;
  } else if (framework === "next" && router === "pages") {
    candidates = nextPagesPaths;
  } else if (framework === "next") {
    candidates = nextAppPaths;
  } else {
    candidates = [...reactPaths, ...nextAppPaths, ...nextPagesPaths];
  }

  for (const cssPath of candidates) {
    if (fs.existsSync(path.join(cwd, cssPath))) {
      return cssPath;
    }
  }

  const usesSrc = fs.existsSync(path.join(cwd, "src"));

  if (framework === "react") {
    return usesSrc ? "src/index.css" : "styles/globals.css";
  }

  if (framework === "next" && router === "pages") {
    return usesSrc ? "src/styles/globals.css" : "styles/globals.css";
  }

  if (framework === "next") {
    return usesSrc ? "src/app/globals.css" : "app/globals.css";
  }

  return usesSrc ? "src/styles.css" : "styles/globals.css";
}

export function detectTailwindConfig(cwd = process.cwd()) {
  const possibleConfigs = [
    "tailwind.config.js",
    "tailwind.config.ts",
    "tailwind.config.mjs",
    "tailwind.config.cjs",
  ];

  for (const config of possibleConfigs) {
    if (fs.existsSync(path.join(cwd, config))) {
      return config;
    }
  }

  // Tailwind v4 is CSS-first (`@import "tailwindcss"`) and has no config
  // file at all - don't claim one exists.
  return null;
}

export function addTailwindImportToCss(cwd = process.cwd(), cssPath) {
  const resolvedCssPath = cssPath || detectCssPath(cwd);
  const absoluteCssPath = path.join(cwd, resolvedCssPath);
  const cssDir = path.dirname(absoluteCssPath);
  let content = "";
  let existed = false;

  if (fs.existsSync(absoluteCssPath)) {
    existed = true;
    content = fs.readFileSync(absoluteCssPath, "utf-8");

    if (TAILWIND_DIRECTIVE_PATTERN.test(content)) {
      return {
        cssPath: resolvedCssPath,
        created: false,
        updated: false,
      };
    }
  } else if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }

  const nextContent = content
    ? `@import "tailwindcss";\n${content}`
    : '@import "tailwindcss";\n';

  fs.writeFileSync(absoluteCssPath, nextContent, "utf-8");

  return {
    cssPath: resolvedCssPath,
    created: !existed,
    updated: existed,
  };
}

export function hasImportAliasConfigured(cwd = process.cwd()) {
  const jsonConfigs = ["tsconfig.json", "jsconfig.json"];

  for (const file of jsonConfigs) {
    const filePath = path.join(cwd, file);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const stripped = raw
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");
      const parsed = JSON.parse(stripped);
      const paths = parsed?.compilerOptions?.paths || {};

      if (Object.keys(paths).some((key) => key.startsWith("@/"))) {
        return true;
      }
    } catch {
      // Malformed config — treat as not configured
    }
  }

  const viteConfigs = [
    "vite.config.js",
    "vite.config.ts",
    "vite.config.mjs",
    "vite.config.cjs",
  ];

  for (const file of viteConfigs) {
    const filePath = path.join(cwd, file);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");

    if (/["'`]@["'`]\s*:/.test(content)) {
      return true;
    }
  }

  return false;
}

export function autoConfigureImportAlias(cwd = process.cwd()) {
  const result = {
    configFile: null,
    configFileCreated: false,
    viteConfigFile: null,
    viteConfigUpdated: false,
    manualSteps: [],
  };

  const packageJson = readPackageJson(cwd);
  const dependencies = {
    ...(packageJson?.dependencies || {}),
    ...(packageJson?.devDependencies || {}),
  };
  const isTypeScript =
    Boolean(dependencies.typescript) || fs.existsSync(path.join(cwd, "tsconfig.json"));
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const aliasTarget = usesSrc ? "./src/*" : "./*";

  const jsonConfigName = fs.existsSync(path.join(cwd, "tsconfig.json"))
    ? "tsconfig.json"
    : fs.existsSync(path.join(cwd, "jsconfig.json"))
      ? "jsconfig.json"
      : isTypeScript
        ? "tsconfig.json"
        : "jsconfig.json";

  const jsonConfigPath = path.join(cwd, jsonConfigName);
  let jsonConfig = {};
  let existed = false;

  if (fs.existsSync(jsonConfigPath)) {
    existed = true;
    try {
      const raw = fs.readFileSync(jsonConfigPath, "utf-8");
      const stripped = raw
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");
      jsonConfig = JSON.parse(stripped);
    } catch {
      jsonConfig = {};
    }
  }

  jsonConfig.compilerOptions = jsonConfig.compilerOptions || {};
  jsonConfig.compilerOptions.baseUrl = jsonConfig.compilerOptions.baseUrl || ".";
  jsonConfig.compilerOptions.paths = jsonConfig.compilerOptions.paths || {};
  jsonConfig.compilerOptions.paths["@/*"] = [aliasTarget];

  fs.writeFileSync(jsonConfigPath, JSON.stringify(jsonConfig, null, 2) + "\n");

  result.configFile = jsonConfigName;
  result.configFileCreated = !existed;

  const viteConfigCandidates = [
    "vite.config.ts",
    "vite.config.js",
    "vite.config.mjs",
    "vite.config.cjs",
  ];
  const existingViteConfig = viteConfigCandidates.find((file) =>
    fs.existsSync(path.join(cwd, file))
  );

  if (existingViteConfig) {
    const viteConfigPath = path.join(cwd, existingViteConfig);
    const content = fs.readFileSync(viteConfigPath, "utf-8");

    const aliasPathExpr = isEsmViteConfig(cwd, existingViteConfig)
      ? `new URL("${usesSrc ? "./src" : "."}", import.meta.url).pathname`
      : `require("path").resolve(__dirname, "${usesSrc ? "./src" : "."}")`;

    if (/alias\s*:/.test(content)) {
      result.manualSteps.push(
        `${existingViteConfig} already has a "resolve.alias" block — verify it maps "@" to your ${usesSrc ? "src" : "project"} directory.`
      );
    } else if (/defineConfig\(\s*\{/.test(content)) {
      const injected = content.replace(
        /defineConfig\(\s*\{/,
        `defineConfig({\n  resolve: {\n    alias: {\n      "@": ${aliasPathExpr},\n    },\n  },`
      );
      fs.writeFileSync(viteConfigPath, injected);
      result.viteConfigFile = existingViteConfig;
      result.viteConfigUpdated = true;
    } else {
      result.manualSteps.push(
        `Could not automatically patch ${existingViteConfig} — add "resolve: { alias: { '@': '${usesSrc ? "./src" : "."}' } }" manually.`
      );
    }
  } else {
    result.manualSteps.push(
      `No vite.config.* file found — if you use Vite, add "resolve: { alias: { '@': '${usesSrc ? "./src" : "."}' } }" to it manually.`
    );
  }

  return result;
}

const TAILWIND_DIRECTIVE_PATTERN =
  /@import\s+["']tailwindcss["']|@tailwind\s+base/;

const WALK_SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".turbo",
  ".vercel",
]);

function hasTailwindDirectiveInCss(dir, remainingDepth = 4) {
  if (remainingDepth < 0) {
    return false;
  }

  let entries;

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return false;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (WALK_SKIP_DIRS.has(entry.name)) {
        continue;
      }

      if (hasTailwindDirectiveInCss(path.join(dir, entry.name), remainingDepth - 1)) {
        return true;
      }
    } else if (/\.(css|scss)$/.test(entry.name)) {
      try {
        const content = fs.readFileSync(path.join(dir, entry.name), "utf-8");

        if (TAILWIND_DIRECTIVE_PATTERN.test(content)) {
          return true;
        }
      } catch {
        // Unreadable file — skip
      }
    }
  }

  return false;
}

export function hasTailwindDependencyOrConfig(cwd = process.cwd()) {
  const packageJson = readPackageJson(cwd);
  const dependencies = {
    ...(packageJson?.dependencies || {}),
    ...(packageJson?.devDependencies || {}),
  };

  return (
    Boolean(dependencies.tailwindcss) ||
    hasAnyPath(cwd, [
      "tailwind.config.js",
      "tailwind.config.ts",
      "tailwind.config.mjs",
      "tailwind.config.cjs",
    ])
  );
}

/**
 * A `tailwindcss` dependency or config file alone doesn't mean Tailwind is
 * actually wired up — it also needs `@import "tailwindcss"`/`@tailwind base`
 * in a CSS file (and, for Vite, the plugin registered). We only check the
 * CSS-directive signal here since that's what actually makes styles apply.
 */
export function hasTailwindInstalled(cwd = process.cwd()) {
  if (!hasTailwindDependencyOrConfig(cwd)) {
    return false;
  }

  return hasTailwindDirectiveInCss(cwd);
}

const POSTCSS_CONFIG_CANDIDATES = [
  "postcss.config.mjs",
  "postcss.config.js",
  "postcss.config.cjs",
];

const VITE_CONFIG_CANDIDATES = [
  "vite.config.ts",
  "vite.config.js",
  "vite.config.mjs",
  "vite.config.cjs",
];

/**
 * Tailwind v4 requires `@tailwindcss/postcss` to be registered in a PostCSS
 * config file — without it, `@import "tailwindcss"` in the CSS is never
 * processed and ships as inert literal CSS. Next.js has no default PostCSS
 * pipeline that does this automatically.
 */
export function hasPostcssTailwindConfigured(cwd = process.cwd()) {
  for (const file of POSTCSS_CONFIG_CANDIDATES) {
    const filePath = path.join(cwd, file);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      if (/@tailwindcss\/postcss/.test(content)) {
        return true;
      }
    } catch {
      // Unreadable — treat as not configured
    }
  }

  return false;
}

/**
 * Tailwind v4 + Vite requires the `@tailwindcss/vite` plugin to be
 * registered in `plugins: [...]` — without it, Vite/PostCSS never processes
 * `@import "tailwindcss"` and Tailwind classes silently do nothing.
 */
export function hasViteTailwindPluginConfigured(cwd = process.cwd()) {
  const existingViteConfig = VITE_CONFIG_CANDIDATES.find((file) =>
    fs.existsSync(path.join(cwd, file))
  );

  if (!existingViteConfig) {
    return false;
  }

  const content = fs.readFileSync(path.join(cwd, existingViteConfig), "utf-8");
  return /@tailwindcss\/vite/.test(content) && /tailwindcss\s*\(\s*\)/.test(content);
}

/**
 * Auto-fixes the missing Tailwind v4 wiring step described above, per
 * framework:
 *  - Next.js (app or pages router): creates postcss.config.mjs registering
 *    `@tailwindcss/postcss`.
 *  - React/Vite: registers the `@tailwindcss/vite` plugin in vite.config.*.
 */
export function autoConfigureTailwindWiring(cwd = process.cwd(), framework) {
  const result = {
    fixed: false,
    configFile: null,
    configFileCreated: false,
    manualSteps: [],
  };

  if (framework === "next") {
    const existing = POSTCSS_CONFIG_CANDIDATES.find((file) =>
      fs.existsSync(path.join(cwd, file))
    );

    if (existing) {
      result.manualSteps.push(
        `${existing} already exists but doesn't register "@tailwindcss/postcss" — add it to the plugins object manually:\n` +
          `  export default { plugins: { "@tailwindcss/postcss": {} } };`
      );
      return result;
    }

    const configPath = path.join(cwd, "postcss.config.mjs");
    fs.writeFileSync(
      configPath,
      'export default {\n  plugins: {\n    "@tailwindcss/postcss": {},\n  },\n};\n'
    );

    result.fixed = true;
    result.configFile = "postcss.config.mjs";
    result.configFileCreated = true;
    return result;
  }

  if (framework === "react") {
    const existingViteConfig = VITE_CONFIG_CANDIDATES.find((file) =>
      fs.existsSync(path.join(cwd, file))
    );

    if (!existingViteConfig) {
      result.manualSteps.push(
        "No vite.config.* file found — create one registering the @tailwindcss/vite plugin:\n" +
          '  import { defineConfig } from "vite";\n' +
          '  import react from "@vitejs/plugin-react";\n' +
          '  import tailwindcss from "@tailwindcss/vite";\n\n' +
          "  export default defineConfig({\n" +
          "    plugins: [react(), tailwindcss()],\n" +
          "  });"
      );
      return result;
    }

    const viteConfigPath = path.join(cwd, existingViteConfig);
    let content = fs.readFileSync(viteConfigPath, "utf-8");

    if (/@tailwindcss\/vite/.test(content)) {
      result.manualSteps.push(
        `${existingViteConfig} imports "@tailwindcss/vite" but doesn't call tailwindcss() inside plugins: [...] — add it manually.`
      );
      return result;
    }

    if (!/plugins\s*:\s*\[/.test(content)) {
      result.manualSteps.push(
        `Could not automatically patch ${existingViteConfig} — add:\n` +
          '  import tailwindcss from "@tailwindcss/vite";\n' +
          "  // then inside defineConfig({ plugins: [ ...existing, tailwindcss() ] })"
      );
      return result;
    }

    const pluginImport = isEsmViteConfig(cwd, existingViteConfig)
      ? 'import tailwindcss from "@tailwindcss/vite";\n'
      : 'const tailwindcss = require("@tailwindcss/vite");\n';

    content = `${pluginImport}${content}`;
    content = content.replace(/plugins\s*:\s*\[/, "plugins: [tailwindcss(), ");

    fs.writeFileSync(viteConfigPath, content);

    result.fixed = true;
    result.configFile = existingViteConfig;
    return result;
  }

  return result;
}

function readPackageJson(cwd) {
  const packageJsonPath = path.join(cwd, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  } catch {
    return null;
  }
}

function hasAnyPath(cwd, paths) {
  return paths.some((itemPath) => fs.existsSync(path.join(cwd, itemPath)));
}

/**
 * Whether a vite.config.* file can safely receive an injected top-level
 * `import` statement. `.ts` and `.mjs` always can (TS source conventionally
 * uses import/export regardless of compiled target; .mjs is unambiguous).
 * `.cjs` never can. Plain `.js` depends on the nearest package.json's
 * "type" field - defaulting to CJS (Node's own default) when absent, since
 * assuming ESM here would silently break a require()/module.exports file:
 * Node's mixed-syntax detection takes over and module.exports becomes a
 * no-op, producing an empty config with no error at all.
 */
function isEsmViteConfig(cwd, fileName) {
  if (fileName.endsWith(".ts") || fileName.endsWith(".mjs")) return true;
  if (fileName.endsWith(".cjs")) return false;
  const packageJson = readPackageJson(cwd);
  return packageJson?.type === "module";
}

export function resolveAlias(alias, config, cwd = process.cwd()) {
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const prefix = usesSrc ? "src/" : "";
  const aliasMap = config.aliases || {};
  for (const [key, value] of Object.entries(aliasMap)) {
    if (alias.startsWith(`@/${key}`)) {
      return alias.replace(`@/${key}`, value.replace("@/", prefix));
    }
  }
  return alias.replace("@/", prefix);
}

export function getEffectsPath(config, cwd = process.cwd()) {
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const prefix = usesSrc ? "src/" : "";
  const effectsAlias = config.aliases?.effects || "@/components/effects";
  return effectsAlias.replace("@/", prefix);
}

export function getHooksPath(config, cwd = process.cwd()) {
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const prefix = usesSrc ? "src/" : "";
  const hooksAlias = config.aliases?.hooks || "@/hooks";
  return hooksAlias.replace("@/", prefix);
}

export function getLibPath(config, cwd = process.cwd()) {
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const prefix = usesSrc ? "src/" : "";
  const libAlias = config.aliases?.lib || "@/lib";
  return libAlias.replace("@/", prefix);
}
