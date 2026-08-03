/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import {
  configExists,
  writeConfig,
  getDefaultConfig,
  detectProjectEnvironment,
  detectNextRouter,
  detectCssPath,
  detectTailwindConfig,
  hasTailwindInstalled,
  hasTailwindDependencyOrConfig,
  hasImportAliasConfigured,
  autoConfigureImportAlias,
} from "../utils/config.js";
import { detectPackageManager } from "../utils/package-manager.js";
import { trackCliEvent } from "../utils/telemetry.js";

export async function init(options) {
  const cwd = process.cwd();

  console.log();
  console.log(chalk.bold("Initializing Hyperiux..."));
  console.log();

  const framework = detectProjectEnvironment(cwd);

  if (!hasTailwindInstalled(cwd)) {
    console.log(chalk.red("✖ Validating Tailwind CSS."));
    console.log();

    if (hasTailwindDependencyOrConfig(cwd)) {
      console.log(
        chalk.red(
          `Tailwind CSS is installed, but no CSS file at ${cwd} imports it.`
        )
      );
      console.log(
        chalk.yellow(
          'Add this to your global CSS file (e.g. src/index.css), then try again:'
        )
      );
      console.log(chalk.cyan('  @import "tailwindcss";'));
      if (framework === "react") {
        console.log(
          chalk.dim(
            '  And make sure the plugin is registered: import tailwindcss from "@tailwindcss/vite"; plugins: [tailwindcss()]'
          )
        );
      }
    } else {
      console.log(
        chalk.red(`No Tailwind CSS configuration found at ${cwd}.`)
      );
      console.log(
        chalk.red(
          "It is likely you do not have Tailwind CSS installed or have an invalid configuration."
        )
      );
      console.log(chalk.yellow("Install Tailwind CSS then try again:"));
      console.log(chalk.cyan(`  ${getTailwindInstallCommand(framework)}`));
    }

    console.log(chalk.dim(`  Guide: ${getTailwindGuideUrl(framework)}`));
    console.log();
    process.exit(1);
  }

  if (framework === "react" && !hasImportAliasConfigured(cwd)) {
    console.log(chalk.yellow("⚠ Validating import alias."));
    console.log();
    console.log(
      chalk.yellow('Could not find a valid "@/*" path alias in this project.')
    );
    console.log(
      chalk.dim(
        "Hyperiux effects import from \"@/components/effects\", \"@/hooks\", etc."
      )
    );
    console.log();

    let shouldFix = Boolean(options.yes);

    if (!options.yes) {
      const { fix } = await prompts({
        type: "confirm",
        name: "fix",
        message: 'Auto-configure the "@/*" import alias now?',
        initial: true,
      });
      shouldFix = fix;
    }

    if (!shouldFix) {
      console.log(
        chalk.yellow(
          "Skipped. Configure it manually in tsconfig.json/jsconfig.json (compilerOptions.paths) or vite.config.js (resolve.alias), then run init again."
        )
      );
      console.log(
        chalk.dim(
          '  Example tsconfig.json: { "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }'
        )
      );
      console.log();
      process.exit(1);
    }

    const aliasResult = autoConfigureImportAlias(cwd);

    console.log(
      chalk.green(
        `✔ ${aliasResult.configFileCreated ? "Created" : "Updated"} ${aliasResult.configFile} with "@/*" path alias.`
      )
    );

    if (aliasResult.viteConfigUpdated) {
      console.log(
        chalk.green(`✔ Updated ${aliasResult.viteConfigFile} with a matching "@" resolve alias.`)
      );
    }

    for (const step of aliasResult.manualSteps) {
      console.log(chalk.yellow(`⚠ ${step}`));
    }

    console.log();
  }

  // Check if already initialized
  if (configExists(cwd)) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: "hyperiux.json already exists. Overwrite?",
      initial: false,
    });

    if (!overwrite) {
      console.log(chalk.yellow("Initialization cancelled."));
      process.exit(0);
    }
  }

  const router = framework === "next" ? detectNextRouter(cwd) : null;
  let config = getDefaultConfig();

  config.framework = framework;
  config.router = router;

  if (!options.yes) {
    // Prompt for configuration
    const answers = await prompts([
      {
        type: "text",
        name: "cssPath",
        message: "Where is your global CSS file?",
        initial: detectCssPath(cwd, framework, router),
      },
      {
        type: "text",
        name: "effectsAlias",
        message: "Path alias for effects:",
        initial: "@/components/effects",
      },
      {
        type: "text",
        name: "hooksAlias",
        message: "Path alias for hooks:",
        initial: "@/hooks",
      },
      {
        type: "text",
        name: "libAlias",
        message: "Path alias for lib utilities:",
        initial: "@/lib",
      },
    ]);

    if (!answers.cssPath) {
      console.log(chalk.yellow("Initialization cancelled."));
      process.exit(0);
    }

    config.tailwind.css = answers.cssPath;
    config.aliases.effects = answers.effectsAlias;
    config.aliases.hooks = answers.hooksAlias;
    config.aliases.lib = answers.libAlias;
  } else {
    // Use detected values for --yes flag
    config.tailwind.css = detectCssPath(cwd, framework, router);
  }

  // Detect tailwind config
  config.tailwind.config = detectTailwindConfig(cwd);

  const spinner = ora("Creating configuration...").start();

  try {
    // Write config file
    writeConfig(config, cwd);

    const usesSrc = fs.existsSync(path.join(cwd, "src"));
    const prefix = usesSrc ? "src/" : "";

    // Create directories if they don't exist
    const effectsDir = path.join(cwd, config.aliases.effects.replace("@/", prefix));
    const hooksDir = path.join(cwd, config.aliases.hooks.replace("@/", prefix));
    const libDir = path.join(cwd, config.aliases.lib.replace("@/", prefix));

    ensureDir(effectsDir);
    ensureDir(hooksDir);
    ensureDir(libDir);

    spinner.succeed("Configuration created successfully!");

    await trackCliEvent("init", {
      framework,
      router,
      cssPath: config.tailwind.css,
      tailwindConfig: config.tailwind.config,
      packageManager: detectPackageManager(cwd),
      hasSrcDir: fs.existsSync(path.join(cwd, "src")),
      prompted: !options.yes,
    });

    console.log();
    console.log(chalk.green("Hyperiux initialized!"));
    console.log(chalk.dim(describeDetection(framework, router)));
    console.log();
    console.log("You can now add effects with:");
    console.log(chalk.cyan("  npx hyperiux add blur-text"));
    console.log();
  } catch (error) {
    spinner.fail("Failed to create configuration");
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

function getTailwindInstallCommand(framework) {
  if (framework === "next") {
    return "npm install tailwindcss @tailwindcss/postcss postcss --save-dev";
  }

  if (framework === "react") {
    return "npm install tailwindcss @tailwindcss/vite --save-dev";
  }

  return "npm install tailwindcss --save-dev";
}

function getTailwindGuideUrl(framework) {
  if (framework === "next") {
    return "https://tailwindcss.com/docs/guides/nextjs";
  }

  if (framework === "react") {
    return "https://tailwindcss.com/docs/guides/vite";
  }

  return "https://tailwindcss.com/docs/installation";
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function describeDetection(framework, router) {
  if (framework === "next" && router === "app") {
    return "Detected Next.js (App Router) project — global CSS is typically imported in app/layout.js.";
  }

  if (framework === "next" && router === "pages") {
    return "Detected Next.js (Pages Router) project — global CSS is typically imported in pages/_app.js.";
  }

  if (framework === "next") {
    return "Detected Next.js project.";
  }

  if (framework === "react") {
    return "Detected React project — global CSS is typically imported in main.jsx/main.tsx.";
  }

  return "Couldn't confidently detect your framework. Double-check hyperiux.json's tailwind.css path before adding effects.";
}
