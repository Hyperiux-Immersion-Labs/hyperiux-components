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

export function getInstallArgs(packageManager, packages, options = {}) {
  const verb = packageManager === "npm" ? "install" : "add";
  return options.dev ? [verb, "-D", ...packages] : [verb, ...packages];
}

const VALID_PACKAGE_NAME_REGEX = /^[a-z0-9-@/_.]+$/;

export function installDependencies(packages, options = {}) {
  const { cwd = process.cwd(), dryRun = false, dev = false } = options;

  const invalidPackages = packages.filter((pkg) => !VALID_PACKAGE_NAME_REGEX.test(pkg));
  if (invalidPackages.length > 0) {
    throw new Error(`Invalid package name(s) detected: ${invalidPackages.join(", ")}`);
  }

  const packageManager = detectPackageManager(cwd);
  const args = getInstallArgs(packageManager, packages, { dev });

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

function parsePackageName(pkg) {
  // Strip version specifier - handles both "gsap@3" and "@react-three/fiber@8"
  // Scoped: "@react-three/fiber" → keep as-is; "@react-three/fiber@8" → "@react-three/fiber"
  if (pkg.startsWith("@")) {
    // e.g. "@react-three/fiber@8.0.0" → split after the second "@"
    const withoutScope = pkg.slice(1); // "react-three/fiber@8.0.0"
    const versionAt = withoutScope.indexOf("@");
    return versionAt === -1 ? pkg : `@${withoutScope.slice(0, versionAt)}`;
  }

  return pkg.split("@")[0];
}

function isPackageInstalled(pkg, cwd) {
  const name = parsePackageName(pkg);

  // A package only counts as "installed" if it's actually declared in
  // package.json. node_modules alone isn't enough - a package can be
  // physically present there as a transitive dependency of something
  // else without ever being recorded as a direct dependency, which
  // would silently skip adding it and break on a clean install.
  try {
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(cwd, "package.json"), "utf-8")
    );

    return Boolean(
      pkgJson.dependencies?.[name] ||
        pkgJson.devDependencies?.[name] ||
        pkgJson.peerDependencies?.[name]
    );
  } catch {
    // No package.json or unparsable - fall back to checking node_modules
    // directly, since there's no declared-dependency list to trust.
    return fs.existsSync(path.join(cwd, "node_modules", name));
  }
}

export function getMissingDependencies(required, cwd = process.cwd()) {
  return required.filter((dep) => !isPackageInstalled(dep, cwd));
}
