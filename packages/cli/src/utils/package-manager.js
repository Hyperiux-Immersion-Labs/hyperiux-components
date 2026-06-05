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

const VALID_PACKAGE_NAME_REGEX = /^[a-z0-9-@/_.]+$/;

export function installDependencies(packages, options = {}) {
  const { cwd = process.cwd(), dryRun = false } = options;

  // Sanitize package names to prevent command injection
  const invalidPackages = packages.filter((pkg) => !VALID_PACKAGE_NAME_REGEX.test(pkg));
  if (invalidPackages.length > 0) {
    throw new Error(`Invalid package name(s) detected: ${invalidPackages.join(", ")}`);
  }

  const packageManager = detectPackageManager(cwd);
  const command = getInstallCommand(packageManager, packages);

  if (dryRun) {
    return { command, packageManager };
  }

  execSync(command, { cwd, stdio: "inherit" });
  return { command, packageManager };
}

function isPackageInstalled(pkg, cwd) {
  // Strip version specifier — handles both "gsap@3" and "@react-three/fiber@8"
  // Scoped: "@react-three/fiber" → keep as-is; "@react-three/fiber@8" → "@react-three/fiber"
  let name = pkg;
  if (pkg.startsWith("@")) {
    // e.g. "@react-three/fiber@8.0.0" → split after the second "@"
    const withoutScope = pkg.slice(1); // "react-three/fiber@8.0.0"
    const versionAt = withoutScope.indexOf("@");
    name = versionAt === -1 ? pkg : `@${withoutScope.slice(0, versionAt)}`;
  } else {
    name = pkg.split("@")[0];
  }

  return fs.existsSync(path.join(cwd, "node_modules", name));
}

export function getMissingDependencies(required, cwd = process.cwd()) {
  return required.filter((dep) => !isPackageInstalled(dep, cwd));
}
