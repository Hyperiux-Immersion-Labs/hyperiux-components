import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { configExists, writeConfig, getDefaultConfig } from "../utils/config.js";

export async function init(options) {
  const cwd = process.cwd();

  console.log();
  console.log(chalk.bold("Initializing Hyperiux..."));
  console.log();

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

  let config = getDefaultConfig();

  if (!options.yes) {
    // Prompt for configuration
    const answers = await prompts([
      {
        type: "text",
        name: "cssPath",
        message: "Where is your global CSS file?",
        initial: detectCssPath(cwd),
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
    config.tailwind.css = detectCssPath(cwd);
  }

  // Detect tailwind config
  config.tailwind.config = detectTailwindConfig(cwd);

  const spinner = ora("Creating configuration...").start();

  try {
    // Write config file
    writeConfig(config, cwd);

    // Create directories if they don't exist
    const effectsDir = path.join(cwd, config.aliases.effects.replace("@/", "src/"));
    const hooksDir = path.join(cwd, config.aliases.hooks.replace("@/", "src/"));
    const libDir = path.join(cwd, config.aliases.lib.replace("@/", "src/"));

    ensureDir(effectsDir);
    ensureDir(hooksDir);
    ensureDir(libDir);

    spinner.succeed("Configuration created successfully!");

    console.log();
    console.log(chalk.green("Hyperiux initialized!"));
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

function detectCssPath(cwd) {
  const possiblePaths = [
    "src/app/globals.css",
    "src/styles/globals.css",
    "app/globals.css",
    "styles/globals.css",
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(path.join(cwd, p))) {
      return p;
    }
  }

  return "src/app/globals.css";
}

function detectTailwindConfig(cwd) {
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

  return "tailwind.config.js";
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
