/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { describe, it, expect, vi, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { installDependencies, getMissingDependencies } from "../utils/package-manager.js";
import { spawnSync } from "child_process";

vi.mock("child_process", () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}));

describe("package manager utilities", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should allow valid package names and call spawnSync without shell", () => {
    const result = installDependencies(["framer-motion", "gsap", "@types/react"]);

    expect(result.args).toEqual(["install", "framer-motion", "gsap", "@types/react"]);
    expect(spawnSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining(["framer-motion", "gsap", "@types/react"]),
      expect.objectContaining({ shell: false })
    );
  });

  it("should block package names containing malicious shell script characters", () => {
    expect(() => {
      installDependencies(["framer-motion; echo 'HACKED'"]);
    }).toThrow("Invalid package name(s) detected");

    expect(spawnSync).not.toHaveBeenCalled();
  });

  it("should block package names containing backticks or shell operators", () => {
    expect(() => {
      installDependencies(["framer-motion && rm -rf /"]);
    }).toThrow("Invalid package name(s) detected");

    expect(() => {
      installDependencies(["framer-motion`id`"]);
    }).toThrow("Invalid package name(s) detected");

    expect(spawnSync).not.toHaveBeenCalled();
  });
});

describe("getMissingDependencies", () => {
  function makeProject(pkgJson) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hyperiux-pm-test-"));
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkgJson));
    return dir;
  }

  it("treats a package as missing if it's only in node_modules, not package.json", () => {
    // Simulates a transitive dependency: physically present but never
    // declared, which used to be silently skipped instead of installed.
    const dir = makeProject({ dependencies: {} });
    fs.mkdirSync(path.join(dir, "node_modules", "lucide-react"), { recursive: true });

    expect(getMissingDependencies(["lucide-react"], dir)).toEqual(["lucide-react"]);
  });

  it("treats a package as present if it's declared in package.json", () => {
    const dir = makeProject({ dependencies: { gsap: "^3.0.0" } });

    expect(getMissingDependencies(["gsap"], dir)).toEqual([]);
  });

  it("falls back to node_modules when package.json is missing", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hyperiux-pm-test-"));
    fs.mkdirSync(path.join(dir, "node_modules", "gsap"), { recursive: true });

    expect(getMissingDependencies(["gsap"], dir)).toEqual([]);
    expect(getMissingDependencies(["lenis"], dir)).toEqual(["lenis"]);
  });
});
