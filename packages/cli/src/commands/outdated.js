import chalk from "chalk";
import { configExists } from "../utils/config.js";
import { readLockfile } from "../utils/lockfile.js";
import { fetchRegistry } from "../utils/registry.js";
import { getAuthToken } from "./login.js";
import { getBumpType } from "../utils/semver.js";

const BUMP_COLOR = {
  major: chalk.red,
  minor: chalk.yellow,
  patch: chalk.cyan,
};

export async function outdated() {
  const cwd = process.cwd();

  if (!configExists(cwd)) {
    console.log();
    console.log(chalk.red("Hyperiux is not initialized in this project."));
    console.log(chalk.yellow("Run `npx hyperiux init` first."));
    console.log();
    process.exit(1);
  }

  const lock = readLockfile(cwd);
  const names = Object.keys(lock.components);

  if (!names.length) {
    console.log();
    console.log(chalk.dim("No effects installed yet — nothing to check."));
    console.log();
    return;
  }

  const authToken = getAuthToken();

  console.log();
  console.log(chalk.bold("Checking for updates..."));
  console.log();

  const rows = [];
  let hadError = false;

  for (const name of names) {
    const entry = lock.components[name];

    try {
      const registryItem = await fetchRegistry(name, { token: authToken });
      const latestVersion = registryItem.version || "1.0.0";
      const bump = getBumpType(entry.version, latestVersion);

      rows.push({
        name,
        installed: entry.version,
        latest: latestVersion,
        bump,
      });
    } catch (error) {
      hadError = true;
      rows.push({
        name,
        installed: entry.version,
        latest: null,
        error: error.message,
      });
    }
  }

  // Only surface effects that actually need attention - up to date effects
  // are deliberately omitted here; use `hyperiux versions` to see everything.
  const actionable = rows.filter((r) => r.error || r.bump);
  const upToDateCount = rows.length - actionable.length;

  if (!actionable.length) {
    console.log(chalk.green(`All ${rows.length} installed effects are up to date.`));
    console.log();
    return;
  }

  const nameWidth = Math.max(...actionable.map((r) => r.name.length), "EFFECT".length);
  const installedWidth = Math.max(
    ...actionable.map((r) => r.installed.length),
    "INSTALLED".length
  );

  const header = `${"EFFECT".padEnd(nameWidth)}  ${"INSTALLED".padEnd(installedWidth)}  LATEST`;
  console.log(chalk.dim(header));

  let outdatedCount = 0;

  for (const row of actionable) {
    const namePart = row.name.padEnd(nameWidth);
    const installedPart = row.installed.padEnd(installedWidth);

    if (row.error) {
      console.log(
        `${namePart}  ${installedPart}  ${chalk.dim(`(could not check: ${row.error})`)}`
      );
      continue;
    }

    outdatedCount++;

    const colorize = BUMP_COLOR[row.bump] || chalk.white;
    console.log(
      `${namePart}  ${installedPart}  ${colorize(`→ ${row.latest} (${row.bump})`)}`
    );
  }

  console.log();

  if (upToDateCount > 0) {
    console.log(
      chalk.dim(`${upToDateCount} other effect${upToDateCount === 1 ? "" : "s"} up to date.`)
    );
  }

  if (outdatedCount > 0) {
    console.log(
      chalk.dim(
        `${outdatedCount} effect${outdatedCount === 1 ? "" : "s"} can be updated. Run `
      ) + chalk.cyan("hyperiux diff <effect>") + chalk.dim(" to see what changed.")
    );
  }

  console.log();

  if (hadError) {
    process.exitCode = 1;
  }
}
