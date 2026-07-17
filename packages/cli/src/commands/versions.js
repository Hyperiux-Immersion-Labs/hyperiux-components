import chalk from "chalk";
import { configExists } from "../utils/config.js";
import { readLockfile } from "../utils/lockfile.js";
import { fetchRegistry } from "../utils/registry.js";
import { getAuthToken } from "../utils/auth.js";
import { getBumpType } from "../utils/semver.js";

const BUMP_COLOR = {
  major: chalk.red,
  minor: chalk.yellow,
  patch: chalk.cyan,
};

// Full listing of every installed effect and its version, regardless of
// whether it's outdated - use `hyperiux outdated` instead if you only want
// the effects that actually need attention.
export async function versions() {
  const cwd = process.cwd();

  if (!configExists(cwd)) {
    console.log();
    console.log(chalk.red("Hyperiux is not initialized in this project."));
    console.log(chalk.yellow("Run `npx hyperiux init` first."));
    console.log();
    process.exit(1);
  }

  const lock = readLockfile(cwd);
  const names = Object.keys(lock.components).sort();

  if (!names.length) {
    console.log();
    console.log(chalk.dim("No effects installed yet."));
    console.log();
    return;
  }

  const authToken = getAuthToken();

  console.log();
  console.log(chalk.bold(`Installed effects (${names.length}):`));
  console.log();

  const rows = [];

  for (const name of names) {
    const entry = lock.components[name];

    try {
      const registryItem = await fetchRegistry(name, { token: authToken });
      const latestVersion = registryItem.version || "1.0.0";
      const bump = getBumpType(entry.version, latestVersion);

      rows.push({ name, installed: entry.version, latest: latestVersion, bump });
    } catch (error) {
      rows.push({ name, installed: entry.version, latest: null, error: error.message });
    }
  }

  const nameWidth = Math.max(...rows.map((r) => r.name.length), "EFFECT".length);
  const installedWidth = Math.max(
    ...rows.map((r) => r.installed.length),
    "INSTALLED".length
  );

  console.log(chalk.dim(`${"EFFECT".padEnd(nameWidth)}  ${"INSTALLED".padEnd(installedWidth)}  LATEST`));

  for (const row of rows) {
    const namePart = row.name.padEnd(nameWidth);
    const installedPart = row.installed.padEnd(installedWidth);

    if (row.error) {
      console.log(`${namePart}  ${installedPart}  ${chalk.dim(`(could not check: ${row.error})`)}`);
      continue;
    }

    if (!row.bump) {
      console.log(chalk.dim(`${namePart}  ${installedPart}  up to date`));
      continue;
    }

    const colorize = BUMP_COLOR[row.bump] || chalk.white;
    console.log(`${namePart}  ${installedPart}  ${colorize(`→ ${row.latest} (${row.bump})`)}`);
  }

  console.log();
}
