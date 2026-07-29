/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import chalk from "chalk";
import ora from "ora";
import { fetchRegistryIndex } from "../utils/registry.js";

export async function list() {
  console.log();
  console.log(chalk.bold("Available Effects"));
  console.log();

  const spinner = ora("Fetching available effects...").start();

  try {
    const index = await fetchRegistryIndex();
    spinner.stop();

    displayTier("Free Effects", index.tiers.free, chalk.green);
    displayTier("Pro Effects", index.tiers.pro, chalk.magenta);

    console.log(chalk.dim("Add an effect with:"));
    console.log(chalk.cyan("  npx hyperiux add <effect-name>"));
    console.log();
  } catch (error) {
    spinner.fail("Failed to fetch effects list");
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function displayTier(title, items, nameColor) {
  if (!items.length) return;

  console.log(chalk.bold(title));
  console.log();

  const categories = groupByCategory(items);

  for (const [category, categoryItems] of Object.entries(categories)) {
    console.log(chalk.cyan.bold(capitalize(category)));
    console.log();

    for (const item of categoryItems) {
      const deps = item.dependencies?.length
        ? chalk.dim(` (${item.dependencies.join(", ")})`)
        : "";
      console.log(`  ${nameColor(item.name)}${deps}`);
      if (item.description) {
        console.log(`    ${chalk.dim(item.description)}`);
      }
    }

    console.log();
  }
}

function groupByCategory(items) {
  const categories = {};

  for (const item of items) {
    const category = item.category || "other";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  }

  return categories;
}
