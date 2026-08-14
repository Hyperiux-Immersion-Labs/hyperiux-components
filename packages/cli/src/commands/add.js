/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import {
  readConfig,
  writeConfig,
  configExists,
  detectProjectEnvironment,
  detectNextRouter,
  hasTailwindInstalled,
} from "../utils/config.js";
import {
  fetchRegistry,
  getFileContent,
  getRegistryItemFiles,
} from "../utils/registry.js";
import {
  installDependencies,
  getMissingDependencies,
  detectPackageManager,
} from "../utils/package-manager.js";
import { getAuthToken } from "../utils/auth.js";
import { trackCliEvent } from "../utils/telemetry.js";
import { recordLocalInstallStat } from "../utils/cli-state.js";
import { upsertLockEntry } from "../utils/lockfile.js";

const APP_URL =
  process.env.HYPERIUX_APP_URL || "https://vault.hyperiux.com";

function formatRetryAfter(seconds) {
  if (!seconds || seconds < 60) return "a few minutes";

  const hours = Math.ceil(seconds / 3600);
  if (hours < 1) return `${Math.ceil(seconds / 60)}m`;

  return `${hours}h`;
}

export async function add(effectName, options = {}) {
  const cwd = process.cwd();

  if (!effectName) {
    console.log();
    console.log(chalk.red("Please provide an effect name."));
    console.log();
    console.log(chalk.dim("Example:"));
    console.log(chalk.cyan("  npx hyperiux add helix-slider"));
    console.log();
    process.exit(1);
  }

  // Check if initialized
  if (!configExists(cwd)) {
    console.log();
    console.log(chalk.red("Hyperiux is not initialized in this project."));
    console.log(chalk.yellow("Run `npx hyperiux init` first."));
    console.log();
    process.exit(1);
  }

  const config = readConfig(cwd);
  const framework = config.framework || detectProjectEnvironment(cwd);
  const router =
    config.router ?? (framework === "next" ? detectNextRouter(cwd) : null);

  console.log();
  console.log(chalk.bold(`Adding ${effectName}...`));
  console.log();

  const spinner = ora("Fetching effect from registry...").start();

  /*
    We read the saved CLI token here and pass it to fetchRegistry().
    fetchRegistry() should call your protected API:
    /api/cli/effects/[effectSlug]

    That API should decide:
    - free effect: return files
    - pro effect without token: return 403 with requiresPro: true
    - pro effect with valid token: return files
  */
  const authToken = getAuthToken();

  let registryItem;

  try {
    registryItem = await fetchRegistry(effectName, {
      token: authToken,
      isDependency: Boolean(options._isDependency),
    });

    spinner.succeed(`Found ${chalk.cyan(registryItem.title || effectName)}`);
  } catch (error) {
    spinner.fail("Failed to fetch effect.");

    console.log();

    if (error.rateLimited) {
      const limitText = error.limit ? ` (${error.limit}/day)` : "";
      console.log(chalk.red(`Daily install limit reached${limitText}.`));
      console.log();
      console.log(
        chalk.yellow(`Try again in ${formatRetryAfter(error.retryAfter)}, or upgrade for a higher limit:`)
      );
      console.log(chalk.cyan(`  ${APP_URL}/pricing`));
      console.log();
      console.log(chalk.dim("Effects you've already installed today are still free to reinstall."));
    } else if (error.requiresPro) {
      console.log(chalk.red(`"${effectName}" is a Pro effect.`));
      console.log();
      console.log(chalk.yellow("A Pro subscription is required. Login first:"));
      console.log(chalk.cyan("  npx hyperiux login"));
      console.log();
      console.log(chalk.dim(`Generate your CLI token here:`));
      console.log(chalk.dim(`  ${APP_URL}/cli-auth`));
      console.log();
      console.log(chalk.dim("After login, run:"));
      console.log(chalk.cyan(`  npx hyperiux add ${effectName}`));
    } else {
      console.log(chalk.red(error.message || "Unable to fetch effect."));
    }

    console.log();
    process.exit(1);
  }

  const requiresNextAppRouter = (registryItem.dependencies || []).includes(
    "next-transition-router"
  );
  const isNextAppRouter = framework === "next" && router === "app";

  if (requiresNextAppRouter && !isNextAppRouter) {
    console.log();
    console.log(
      chalk.red(`"${effectName}" only works in a Next.js App Router project.`)
    );
    console.log();

    if (framework === "react") {
      console.log(chalk.dim("  Detected: React (Vite) project."));
    } else if (framework === "next" && router === "pages") {
      console.log(chalk.dim("  Detected: Next.js Pages Router project."));
    } else {
      console.log(chalk.dim(`  Detected: ${framework || "unknown"} project.`));
    }

    console.log(
      chalk.dim(
        '  This effect depends on "next-transition-router", which requires the Next.js App Router (an "app/" directory).'
      )
    );
    console.log();

    await trackCliEvent("add_blocked", {
      effect: effectName,
      reason: "requires_next_app_router",
      framework,
      router,
    });

    process.exit(1);
  }

  // Get files to install
  const files = getRegistryItemFiles(registryItem, config, cwd);

  if (!files.length) {
    console.log();
    console.log(chalk.red("No installable files were found for this effect."));
    console.log();
    process.exit(1);
  }

  // Check for existing files
  const existingFiles = files.filter((file) =>
    fs.existsSync(path.join(cwd, file.targetPath))
  );

  if (existingFiles.length > 0 && !options.overwrite) {
    console.log();
    console.log(chalk.yellow("The following files already exist:"));

    existingFiles.forEach((file) => {
      console.log(chalk.dim(`  ${file.targetPath}`));
    });

    if (options.yes) {
      console.log();
      console.log(
        chalk.yellow(
          "Skipping — re-run with --overwrite to replace existing files."
        )
      );
      console.log();
      return;
    }

    const { proceed } = await prompts(
      {
        type: "confirm",
        name: "proceed",
        message: "Overwrite existing files?",
        initial: false,
      },
      {
        onCancel: () => {
          console.log();
          console.log(chalk.yellow("Installation cancelled."));
          process.exit(0);
        },
      }
    );

    if (!proceed) {
      console.log();
      console.log(chalk.yellow("Installation cancelled."));
      console.log();
      process.exit(0);
    }
  }

  // Check for missing dependencies
  const dependencies = registryItem.dependencies || [];
  const missingDeps = getMissingDependencies(dependencies, cwd);

  // Dry run mode
  if (options.dryRun) {
    console.log();
    console.log(chalk.bold("Dry run - the following would be installed:"));
    console.log();

    console.log(chalk.cyan("Files:"));
    files.forEach((file) => {
      console.log(`  ${file.targetPath}`);
    });

    if (missingDeps.length > 0) {
      console.log();
      console.log(chalk.cyan("Dependencies:"));
      missingDeps.forEach((dependency) => {
        console.log(`  ${dependency}`);
      });
    }

    const registryDeps = registryItem.registryDependencies || [];

    if (registryDeps.length > 0) {
      console.log();
      console.log(chalk.cyan("Registry dependencies:"));
      registryDeps.forEach((dependency) => {
        console.log(`  ${dependency}`);
      });
    }

    console.log();
    process.exit(0);
  }

  // Install npm dependencies
  if (missingDeps.length > 0) {
    const depsSpinner = ora(
      `Installing dependencies: ${missingDeps.join(", ")}...`
    ).start();

    try {
      installDependencies(missingDeps, { cwd });
      depsSpinner.succeed("Dependencies installed");
    } catch (error) {
      depsSpinner.fail("Failed to install dependencies");
      console.log();
      console.error(chalk.red(error.message));
      console.log();
      process.exit(1);
    }
  }

  // Write files
  const filesSpinner = ora("Writing files...").start();

  const writtenFiles = {};

  try {
    for (const file of files) {
      const targetPath = path.resolve(cwd, file.targetPath);

      // Guard against path traversal — resolved path must stay inside cwd
      if (!targetPath.startsWith(path.resolve(cwd) + path.sep)) {
        throw new Error(
          `Unsafe file path detected and blocked: "${file.targetPath}"`
        );
      }

      const targetDir = path.dirname(targetPath);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const content = await getFileContent(file);

      fs.writeFileSync(targetPath, content);
      writtenFiles[file.targetPath] = content;
    }

    filesSpinner.succeed("Files written successfully");
  } catch (error) {
    filesSpinner.fail("Failed to write files");
    console.log();
    console.error(chalk.red(error.message));
    console.log();
    process.exit(1);
  }

  upsertLockEntry(cwd, effectName, {
    version: registryItem.version || "1.0.0",
    files: writtenFiles,
  });
  recordLocalInstall(effectName, cwd);
  recordLocalInstallStat(effectName);
  stampProjectReadme(cwd, effectName);
  resetGlobalCss(config, cwd);

  // Handle registry dependencies recursively
  const registryDeps = registryItem.registryDependencies || [];

  if (registryDeps.length > 0) {
    console.log();
    console.log(chalk.dim(`This effect requires: ${registryDeps.join(", ")}`));

    for (const dep of registryDeps) {
      console.log();

      await add(dep, {
        ...options,
        yes: true,
        _isDependency: true,
      });
    }
  }

  console.log();
  console.log(chalk.green(`Successfully added ${chalk.bold(effectName)}!`));

  // installLimit is null for admins and dependency fetches (neither consumes
  // a slot) - nothing meaningful to report in either case.
  if (!options._isDependency && typeof registryItem.installLimit === "number") {
    const remaining = registryItem.installRemaining ?? 0;
    console.log(
      chalk.dim(`  ${remaining} of ${registryItem.installLimit} daily installs left today.`)
    );
  }

  console.log();

  if (!options._isDependency && !hasTailwindInstalled(cwd)) {
    console.log(
      chalk.yellow(
        "Warning: Tailwind CSS was not detected in this project."
      )
    );
    console.log(
      chalk.dim(
        "  This effect relies on Tailwind utility classes and may not render as intended."
      )
    );
    console.log(
      chalk.dim("  Install it with: https://tailwindcss.com/docs/installation")
    );
    console.log();
  }

  await trackCliEvent("add", {
    effect: effectName,
    framework,
    router,
    cssPath: config.tailwind?.css,
    packageManager: detectPackageManager(cwd),
    dependenciesInstalled: missingDeps,
    fileCount: files.length,
    hasSrcDir: fs.existsSync(path.join(cwd, "src")),
  });

  console.log(chalk.dim("Import it in your component:"));
  console.log();

  const importPath = getImportPath(files[0], config);
  const exportName = registryItem.exportName || getComponentName(effectName);
  const exportKind = registryItem.exportKind || "named";

  const importStatement =
    exportKind === "default"
      ? `import ${exportName} from "${importPath}";`
      : `import { ${exportName} } from "${importPath}";`;

  console.log(chalk.cyan(`  ${importStatement}`));
  console.log();
}

function recordLocalInstall(effectName, cwd) {
  const currentConfig = readConfig(cwd);

  if (!currentConfig) {
    return;
  }

  currentConfig.installedEffects = currentConfig.installedEffects || {};
  currentConfig.installedEffects[effectName] = {
    installedAt: new Date().toISOString(),
  };

  writeConfig(currentConfig, cwd);
}

function stampProjectReadme(cwd, effectName) {
  const readmePath = path.join(cwd, "README.md");
  const stamp =
    "// Built using Hyperiux Vault: [https://vault.hyperiux.com](https://vault.hyperiux.com)";
  const effectStamp = `// Installed Effect:${effectName}`;
  const existing = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, "utf-8")
    : "";
  const hasStamp = existing.includes(stamp);
  const hasEffectStamp = existing.includes(effectStamp);

  if (hasStamp && hasEffectStamp) {
    return;
  }

  if (hasStamp) {
    fs.writeFileSync(
      readmePath,
      hasEffectStamp
        ? existing
        : existing.replace(stamp, `${stamp}\n${effectStamp}`),
      "utf-8"
    );
    return;
  }

  const prefix = `${stamp}\n${effectStamp}`;
  fs.writeFileSync(readmePath, existing ? `${prefix}\n\n${existing}` : `${prefix}\n`, "utf-8");
}

function resetGlobalCss(config, cwd) {
  const cssPath = config.tailwind?.css || "src/app/globals.css";
  const absoluteCssPath = path.resolve(cwd, cssPath);

  if (!absoluteCssPath.startsWith(path.resolve(cwd) + path.sep)) {
    throw new Error(`Unsafe CSS path detected and blocked: "${cssPath}"`);
  }

  fs.mkdirSync(path.dirname(absoluteCssPath), { recursive: true });
  fs.writeFileSync(absoluteCssPath, '@import "tailwindcss";\n', "utf-8");
}

export function getImportPath(file, config) {
  const targetPath = file.targetPath;
  const effectsAlias = config.aliases?.effects || "@/components/effects";
  const effectsPath = effectsAlias.replace("@/", "");

  if (targetPath.includes(effectsPath)) {
    const rest = targetPath
      .slice(targetPath.indexOf(effectsPath) + effectsPath.length)
      .replace(/\.(jsx|tsx|js|ts)$/, "")
      .replace(/\/index$/, "");
    return `${effectsAlias}${rest}`;
  }

  return `@/${targetPath
    .replace(/^src\//, "")
    .replace(/\.(jsx|tsx|js|ts)$/, "")}`;
}

function getComponentName(effectName) {
  return effectName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
