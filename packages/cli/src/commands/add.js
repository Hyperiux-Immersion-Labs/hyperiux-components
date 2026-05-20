import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { readConfig, configExists } from "../utils/config.js";
import { fetchRegistry, getRegistryItemFiles } from "../utils/registry.js";
import { installDependencies, getMissingDependencies } from "../utils/package-manager.js";

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

  let registryItem;
  try {
    registryItem = await fetchRegistry(effectName);
    spinner.succeed(`Found ${chalk.cyan(registryItem.title || effectName)}`);
  } catch (error) {
    spinner.fail(error.message);
    process.exit(1);
  }

  // Get files to install
  const files = getRegistryItemFiles(registryItem, config);

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

  try {
    for (const file of files) {
      const targetPath = path.join(cwd, file.targetPath);
      const targetDir = path.dirname(targetPath);

      // Ensure directory exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Write file
      fs.writeFileSync(targetPath, file.content);
    }

    filesSpinner.succeed("Files written successfully");
  } catch (error) {
    filesSpinner.fail("Failed to write files");
    console.error(chalk.red(error.message));
    process.exit(1);
  }

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
  const componentName = getComponentName(effectName);
  console.log(chalk.cyan(`  import { ${componentName} } from "${importPath}";`));
  console.log();
}

function getImportPath(file, config) {
  const targetPath = file.targetPath;
  const effectsPath = config.aliases?.effects || "@/components/effects";

  if (targetPath.includes("components/effects/")) {
    const fileName = path.basename(targetPath, ".jsx");
    return `${effectsPath}/${fileName}`;
  }

  return `@/${targetPath.replace("src/", "").replace(".jsx", "")}`;
}

function getComponentName(effectName) {
  return effectName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
