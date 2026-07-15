import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { readConfig, configExists } from "../utils/config.js";
import { fetchRegistry, getFileContent, getRegistryItemFiles } from "../utils/registry.js";
import { installDependencies, getMissingDependencies } from "../utils/package-manager.js";
import { getAuthToken } from "./login.js";
import { upsertLockEntry } from "../utils/lockfile.js";
import {
  hasNextImageImport,
  patchNextImageImport,
  getHyperiuxImageHelperTargetPath,
  getHyperiuxImageHelperContent,
} from "../utils/install.js";

const APP_URL = process.env.HYPERIUX_APP_URL || "https://vault.hyperiux.com";

export async function add(effectName, options) {
  const cwd = process.cwd();

  // Check if initialized
  if (!configExists(cwd)) {
    console.log();
    console.log(chalk.red("Hyperiux is not initialized in this project."));
    console.log(chalk.yellow("Run `npx hyperiux init` first."));
    console.log();
    process.exit(1);
  }

  const config = readConfig(cwd);

  console.log();
  console.log(chalk.bold(`Adding ${effectName}...`));
  console.log();

  const spinner = ora("Fetching effect from registry...").start();

  // Read auth token upfront — passed to fetchRegistry so pro effects can be fetched
  const authToken = getAuthToken();

  let registryItem;
  try {
    registryItem = await fetchRegistry(effectName, { token: authToken });
    spinner.succeed(`Found ${chalk.cyan(registryItem.title || effectName)}`);
  } catch (error) {
    spinner.fail(error.message);
    process.exit(1);
  }

  // Gate pro effects behind a valid CLI token
  if (registryItem.tier === "pro") {
    const token = getAuthToken();

    if (!token) {
      console.log();
      console.log(chalk.red(`"${effectName}" is a Pro effect.`));
      console.log(chalk.yellow("Run `npx hyperiux login` to connect your Pro account."));
      console.log(chalk.dim(`Subscribe at ${APP_URL}`));
      console.log();
      process.exit(1);
    }

    const validateSpinner = ora("Verifying Pro access…").start();
    try {
      const res = await fetch(`${APP_URL}/api/cli/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (!data.valid) {
        validateSpinner.fail(chalk.red(`Access denied: ${data.reason}`));
        console.log(chalk.yellow("Run `npx hyperiux login` to re-authenticate."));
        console.log();
        process.exit(1);
      }

      validateSpinner.succeed("Pro access verified.");
    } catch (err) {
      validateSpinner.fail(chalk.red(`Could not verify Pro access: ${err.message}`));
      process.exit(1);
    }
  }

  // Get files to install
  const files = getRegistryItemFiles(registryItem, config, cwd);

  // Check for existing files
  const existingFiles = files.filter((f) =>
    fs.existsSync(path.join(cwd, f.targetPath))
  );

  if (existingFiles.length > 0 && !options.overwrite) {
    console.log();
    console.log(chalk.yellow("The following files already exist:"));
    existingFiles.forEach((f) => {
      console.log(chalk.dim(`  ${f.targetPath}`));
    });
    console.log();
    console.log(
      chalk.red.bold("Warning: ") +
        chalk.yellow(
          `overwriting will replace your file(s) completely, including any local edits. Run ${chalk.cyan(`hyperiux diff ${effectName}`)} first to see exactly what would change, then install once you've reviewed it.`
        )
    );

    if (!options.yes) {
      const { proceed } = await prompts({
        type: "confirm",
        name: "proceed",
        message: "Overwrite existing files?",
        initial: false,
      });

      if (!proceed) {
        console.log(chalk.yellow("Installation cancelled."));
        process.exit(0);
      }
    }
  }

  // Check for missing dependencies
  const dependencies = registryItem.dependencies || [];
  const missingDeps = getMissingDependencies(dependencies, cwd);

  // Show what will be installed
  if (options.dryRun) {
    console.log();
    console.log(chalk.bold("Dry run - the following would be installed:"));
    console.log();
    console.log(chalk.cyan("Files:"));
    files.forEach((f) => {
      console.log(`  ${f.targetPath}`);
    });
    if (missingDeps.length > 0) {
      console.log();
      console.log(chalk.cyan("Dependencies:"));
      missingDeps.forEach((dep) => {
        console.log(`  ${dep}`);
      });
    }
    console.log();
    process.exit(0);
  }

  // Install dependencies
  if (missingDeps.length > 0) {
    const depsSpinner = ora(`Installing dependencies: ${missingDeps.join(", ")}...`).start();

    try {
      installDependencies(missingDeps, { cwd });
      depsSpinner.succeed("Dependencies installed");
    } catch (error) {
      depsSpinner.fail("Failed to install dependencies");
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  }

  // Write files
  const filesSpinner = ora("Writing files...").start();

  const written = {};
  let shouldWriteHyperiuxImageHelper = false;

  try {
    for (const file of files) {
      const targetPath = path.join(cwd, file.targetPath);
      const targetDir = path.dirname(targetPath);

      // Ensure directory exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Write file
      let content = await getFileContent(file);

      // Effects that import next/image directly hit CORS/optimization
      // errors on remote (non-local) image URLs, since Next tries to proxy
      // them through its image optimizer. Route through the HyperiuxImage
      // helper instead, which sets unoptimized:true for remote src values.
      if (typeof content === "string" && hasNextImageImport(content)) {
        content = patchNextImageImport(content, config);
        shouldWriteHyperiuxImageHelper = true;
      }

      fs.writeFileSync(targetPath, content);
      written[file.targetPath] = content;
    }

    if (shouldWriteHyperiuxImageHelper) {
      const helperTargetPath = getHyperiuxImageHelperTargetPath(cwd, config);
      const helperAbsolutePath = path.join(cwd, helperTargetPath);

      // Shared utility, not a per-effect file — only create/overwrite it if
      // it doesn't already exist (or this install explicitly asked to
      // overwrite), so installing an unrelated effect never clobbers any
      // customization made to it.
      if (options.overwrite || !fs.existsSync(helperAbsolutePath)) {
        const helperDir = path.dirname(helperAbsolutePath);

        if (!fs.existsSync(helperDir)) {
          fs.mkdirSync(helperDir, { recursive: true });
        }

        const helperContent = getHyperiuxImageHelperContent();

        fs.writeFileSync(helperAbsolutePath, helperContent);
        written[helperTargetPath] = helperContent;
      }
    }

    filesSpinner.succeed("Files written successfully");
  } catch (error) {
    filesSpinner.fail("Failed to write files");
    console.error(chalk.red(error.message));
    process.exit(1);
  }

  upsertLockEntry(cwd, effectName, {
    version: registryItem.version || "1.0.0",
    files: written,
  });

  // Handle registry dependencies (other effects)
  const registryDeps = registryItem.registryDependencies || [];
  if (registryDeps.length > 0) {
    console.log();
    console.log(chalk.dim(`This effect requires: ${registryDeps.join(", ")}`));

    for (const dep of registryDeps) {
      console.log();
      await add(dep, { ...options, yes: true });
    }
  }

  console.log();
  console.log(chalk.green(`Successfully added ${chalk.bold(effectName)}!`));
  console.log();
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

function getImportPath(file, config) {
  const targetPath = file.targetPath;
  const effectsAlias = config.aliases?.effects || "@/components/effects";
  const effectsPath = effectsAlias.replace("@/", "");

  if (targetPath.includes(effectsPath)) {
    const fileName = path.basename(targetPath, ".jsx");
    return `${effectsAlias}/${fileName}`;
  }

  return `@/${targetPath.replace(/^src\//, "").replace(".jsx", "")}`;
}

function getComponentName(effectName) {
  return effectName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
