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

    // Group by category
    const categories = {};
    for (const item of index.items) {
      const category = item.category || "other";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    }

    // Display by category
    for (const [category, items] of Object.entries(categories)) {
      console.log(chalk.cyan.bold(capitalize(category)));
      console.log();

      for (const item of items) {
        const deps = item.dependencies?.length
          ? chalk.dim(` (${item.dependencies.join(", ")})`)
          : "";
        console.log(`  ${chalk.green(item.name)}${deps}`);
        if (item.description) {
          console.log(`    ${chalk.dim(item.description)}`);
        }
      }

      console.log();
    }

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
