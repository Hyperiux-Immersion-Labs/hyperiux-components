/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";

// installLimit/installRemaining are now on every successful delivery
// response (Installation-SyncUp.md Stage 3 follow-up), not just 429s -
// `add` should print "N of M daily installs left today" from them. Harness
// copied from add-rate-limited.test.js's mock set.

vi.mock("ora", () => {
  const spinner = {
    start() {
      return spinner;
    },
    succeed() {
      return spinner;
    },
    fail() {
      return spinner;
    },
  };
  return { default: () => spinner };
});

vi.mock("prompts", () => ({ default: vi.fn(async () => ({ proceed: false })) }));

vi.mock("../utils/config.js", () => ({
  configExists: () => true,
  readConfig: () => ({
    aliases: { effects: "@/components/effects" },
    tailwind: { css: "src/app/globals.css" },
  }),
  writeConfig: () => {},
  detectProjectEnvironment: () => "react",
  detectNextRouter: () => null,
  hasTailwindInstalled: () => true,
}));

vi.mock("../utils/auth.js", () => ({
  getAuthToken: () => null,
}));

vi.mock("../utils/package-manager.js", () => ({
  getMissingDependencies: () => [],
  installDependencies: () => {},
  detectPackageManager: () => "npm",
}));

vi.mock("../utils/lockfile.js", () => ({
  upsertLockEntry: () => {},
}));

vi.mock("../utils/cli-state.js", () => ({
  recordLocalInstallStat: () => {},
}));

function baseRegistryItem(overrides = {}) {
  return {
    name: "dotted-grid",
    title: "Dotted Grid",
    tier: "free",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "index.jsx", targetPath: "components/effects/dotted-grid.jsx", content: "export function DottedGrid() {}" }],
    ...overrides,
  };
}

let fetchRegistryImpl;
vi.mock("../utils/registry.js", () => ({
  fetchRegistry: (...args) => fetchRegistryImpl(...args),
  getRegistryItemFiles: (item) => item.files,
  getFileContent: async (file) => file.content,
}));

let tmpDir;
let cwdSpy;
let logSpy;

async function importAdd() {
  const mod = await import("../commands/add.js");
  return mod.add;
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "hyperiux-add-quota-"));
  cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(tmpDir);
  logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  cwdSpy.mockRestore();
  logSpy.mockRestore();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("add - prints remaining daily quota on success", () => {
  it("prints 'N of M daily installs left today' when the response carries installLimit/installRemaining", async () => {
    fetchRegistryImpl = async () => baseRegistryItem({ installLimit: 3, installRemaining: 1 });

    const add = await importAdd();
    await add("dotted-grid", { yes: true });

    const loggedLines = logSpy.mock.calls.map((call) => call.join(" "));
    expect(loggedLines.some((line) => line.includes("1 of 3 daily installs left today"))).toBe(true);
  });

  it("prints nothing quota-related for an admin fetch (installLimit: null)", async () => {
    fetchRegistryImpl = async () => baseRegistryItem({ installLimit: null, installRemaining: null });

    const add = await importAdd();
    await add("dotted-grid", { yes: true });

    const loggedLines = logSpy.mock.calls.map((call) => call.join(" "));
    expect(loggedLines.some((line) => line.includes("daily installs left"))).toBe(false);
  });

  it("prints nothing quota-related when the response predates this field (undefined)", async () => {
    fetchRegistryImpl = async () => baseRegistryItem();

    const add = await importAdd();
    await add("dotted-grid", { yes: true });

    const loggedLines = logSpy.mock.calls.map((call) => call.join(" "));
    expect(loggedLines.some((line) => line.includes("daily installs left"))).toBe(false);
  });
});
