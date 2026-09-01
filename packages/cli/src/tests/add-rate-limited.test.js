/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";

// Installation-SyncUp.md §9: "mock ../utils/registry.js to reject with a
// {status: 429}-shaped error and assert the message + exit." Harness copied
// from add-overwrite.test.js's mock set, only fetchRegistry's behavior differs.

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

function makeRateLimitedError({ limit = 3, retryAfter = 3600 * 5 } = {}) {
  const error = new Error(
    `Daily install limit reached (${limit}/day). Try again in 5h, or upgrade to Pro for a higher limit.`
  );
  error.status = 429;
  error.rateLimited = true;
  error.retryAfter = retryAfter;
  error.limit = limit;
  return error;
}

let fetchRegistryImpl;
vi.mock("../utils/registry.js", () => ({
  fetchRegistry: (...args) => fetchRegistryImpl(...args),
  getRegistryItemFiles: () => [],
  getFileContent: async (file) => file.content,
}));

let tmpDir;
let exitSpy;
let cwdSpy;
let logSpy;

async function importAdd() {
  const mod = await import("../commands/add.js");
  return mod.add;
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "hyperiux-add-ratelimit-"));
  cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(tmpDir);
  // add.js calls process.exit(1) on a fetch failure - make that observable
  // as a thrown error instead of actually killing the test runner.
  exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit(${code})`);
  });
  logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  cwdSpy.mockRestore();
  exitSpy.mockRestore();
  logSpy.mockRestore();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("add - Stage 3 rate-limited branch", () => {
  it("exits 1 and prints the rate-limit message, not the generic error message", async () => {
    fetchRegistryImpl = async () => {
      throw makeRateLimitedError({ limit: 3, retryAfter: 3600 * 5 });
    };

    const add = await importAdd();

    await expect(add("dotted-grid", { yes: true })).rejects.toThrow("process.exit(1)");

    const loggedLines = logSpy.mock.calls.map((call) => call.join(" "));
    expect(loggedLines.some((line) => line.includes("Daily install limit reached (3/day)"))).toBe(true);
    expect(loggedLines.some((line) => line.includes("Try again in 5h"))).toBe(true);
    expect(loggedLines.some((line) => line.includes("/pricing"))).toBe(true);
    expect(loggedLines.some((line) => line.includes("already installed today are still free"))).toBe(true);
  });

  it("does not write any files when rate limited", async () => {
    fetchRegistryImpl = async () => {
      throw makeRateLimitedError();
    };

    const add = await importAdd();
    await expect(add("dotted-grid", { yes: true })).rejects.toThrow("process.exit(1)");

    const target = path.join(tmpDir, "components/effects/dotted-grid.jsx");
    expect(fs.existsSync(target)).toBe(false);
  });

  it("still shows the Pro-upsell message (not rate-limit) for a genuine requiresPro error", async () => {
    fetchRegistryImpl = async () => {
      const error = new Error("Pro effect");
      error.status = 403;
      error.requiresPro = true;
      throw error;
    };

    const add = await importAdd();
    await expect(add("circle-text-reveal", { yes: true })).rejects.toThrow("process.exit(1)");

    const loggedLines = logSpy.mock.calls.map((call) => call.join(" "));
    expect(loggedLines.some((line) => line.includes("is a Pro effect"))).toBe(true);
    expect(loggedLines.some((line) => line.includes("Daily install limit reached"))).toBe(false);
  });
});
