/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { describe, it, expect, vi, afterEach } from "vitest";
import { installDependencies } from "../utils/package-manager.js";
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
