import fs from "fs";
import path from "path";
import chalk from "chalk";
import { diffLines } from "diff";
import { readConfig, configExists } from "../utils/config.js";
import { readLockfile } from "../utils/lockfile.js";
import {
  fetchRegistry,
  getFileContent,
  getRegistryItemFiles,
} from "../utils/registry.js";
import { getAuthToken } from "../utils/auth.js";

export async function diff(effectName) {
  const cwd = process.cwd();

  if (!configExists(cwd)) {
    console.log();
    console.log(chalk.red("Hyperiux is not initialized in this project."));
    console.log(chalk.yellow("Run `npx hyperiux init` first."));
    console.log();
    process.exit(1);
  }

  const config = readConfig(cwd);
  const lock = readLockfile(cwd);

  const names = effectName ? [effectName] : Object.keys(lock.components);

  if (!names.length) {
    console.log();
    console.log(chalk.dim("No effects installed yet - nothing to diff."));
    console.log();
    return;
  }

  const authToken = getAuthToken();
  let anyDiffered = false;

  for (const name of names) {
    if (!lock.components[name]) {
      console.log();
      console.log(chalk.yellow(`"${name}" is not installed (no lock entry) - skipping.`));
      continue;
    }

    let registryItem;

    try {
      registryItem = await fetchRegistry(name, { token: authToken });
    } catch (error) {
      console.log();
      console.log(chalk.red(`Could not fetch "${name}": ${error.message}`));
      continue;
    }

    const files = getRegistryItemFiles(registryItem, config, cwd);
    let effectDiffered = false;

    for (const file of files) {
      const targetPath = path.join(cwd, file.targetPath);

      if (!fs.existsSync(targetPath)) {
        console.log();
        console.log(chalk.yellow(`${file.targetPath} is missing on disk (expected for ${name}).`));
        anyDiffered = true;
        effectDiffered = true;
        continue;
      }

      const onDiskContent = fs.readFileSync(targetPath, "utf-8");
      const latestContent = await getFileContent(file);
      const latestText =
        typeof latestContent === "string" ? latestContent : latestContent.toString("utf-8");

      if (onDiskContent === latestText) continue;

      anyDiffered = true;
      effectDiffered = true;

      console.log();
      console.log(
        chalk.bold(`${name} (${lock.components[name].version} → ${registryItem.version || "1.0.0"})`) +
          chalk.dim(`  ${file.targetPath}`)
      );
      console.log(chalk.dim("─".repeat(60)));

      printDiff(onDiskContent, latestText);
    }

    if (!effectDiffered) {
      console.log();
      console.log(chalk.dim(`${name}: no differences.`));
    }
  }

  console.log();

  if (!anyDiffered) {
    console.log(chalk.green("Nothing to update."));
    console.log();
  }
}

const CONTEXT_LINES = 3;

function printDiff(oldText, newText) {
  const parts = diffLines(oldText, newText);

  parts.forEach((part, index) => {
    const lines = part.value.replace(/\n$/, "").split("\n");

    if (part.added) {
      lines.forEach((line) => console.log(chalk.green(`+ ${line}`)));
      return;
    }

    if (part.removed) {
      lines.forEach((line) => console.log(chalk.red(`- ${line}`)));
      return;
    }

    // Unchanged block: only show a few lines of context around the nearest
    // change, matching how `git diff`/unified diffs stay readable on large
    // files instead of dumping every untouched line.
    const isFirst = index === 0;
    const isLast = index === parts.length - 1;

    if (lines.length <= CONTEXT_LINES * 2) {
      lines.forEach((line) => console.log(chalk.dim(`  ${line}`)));
      return;
    }

    if (!isFirst) {
      lines.slice(0, CONTEXT_LINES).forEach((line) => console.log(chalk.dim(`  ${line}`)));
    }

    console.log(chalk.dim(`  … ${lines.length - CONTEXT_LINES * 2} unchanged lines …`));

    if (!isLast) {
      lines.slice(-CONTEXT_LINES).forEach((line) => console.log(chalk.dim(`  ${line}`)));
    }
  });
}
