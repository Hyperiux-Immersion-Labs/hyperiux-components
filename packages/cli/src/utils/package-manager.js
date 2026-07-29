/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

export function detectPackageManager(cwd = process.cwd()) {
  // Check for lock files
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }
  if (
    fs.existsSync(path.join(cwd, "bun.lockb")) ||
    fs.existsSync(path.join(cwd, "bun.lock"))
  ) {
    return "bun";
  }
  if (fs.existsSync(path.join(cwd, "package-lock.json"))) {
    return "npm";
  }

  // Default to npm
  return "npm";
}

export function getInstallArgs(packageManager, packages) {
  const verb = packageManager === "npm" ? "install" : "add";
  return [verb, ...packages];
}

const VALID_PACKAGE_NAME_REGEX = /^[a-z0-9-@/_.]+$/;

export function installDependencies(packages, options = {}) {
  const { cwd = process.cwd(), dryRun = false } = options;

  const invalidPackages = packages.filter((pkg) => !VALID_PACKAGE_NAME_REGEX.test(pkg));
  if (invalidPackages.length > 0) {
    throw new Error(`Invalid package name(s) detected: ${invalidPackages.join(", ")}`);
  }

  const packageManager = detectPackageManager(cwd);
  const args = getInstallArgs(packageManager, packages);

  if (dryRun) {
    return { packageManager, args };
  }

  const result = spawnSync(packageManager, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error(`${packageManager} ${args.join(" ")} failed with exit code ${result.status}`);
  }

  return { packageManager, args };
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
