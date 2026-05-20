import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export function detectPackageManager(cwd = process.cwd()) {
  // Check for lock files
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }
  if (fs.existsSync(path.join(cwd, "bun.lockb"))) {
    return "bun";
  }
  if (fs.existsSync(path.join(cwd, "package-lock.json"))) {
    return "npm";
  }

  // Default to npm
  return "npm";
}

export function getInstallCommand(packageManager, packages) {
  const packagesStr = packages.join(" ");

  switch (packageManager) {
    case "pnpm":
      return `pnpm add ${packagesStr}`;
    case "yarn":
      return `yarn add ${packagesStr}`;
    case "bun":
      return `bun add ${packagesStr}`;
    case "npm":
    default:
      return `npm install ${packagesStr}`;
  }
}

export function installDependencies(packages, options = {}) {
  const { cwd = process.cwd(), dryRun = false } = options;
  const packageManager = detectPackageManager(cwd);
  const command = getInstallCommand(packageManager, packages);

  if (dryRun) {
    return { command, packageManager };
  }

  execSync(command, { cwd, stdio: "inherit" });
  return { command, packageManager };
}

export function getInstalledDependencies(cwd = process.cwd()) {
  const packageJsonPath = path.join(cwd, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return [];
  }

  const content = fs.readFileSync(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(content);

  return [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
  ];
}

export function getMissingDependencies(required, cwd = process.cwd()) {
  const installed = getInstalledDependencies(cwd);
  return required.filter((dep) => !installed.includes(dep));
}
