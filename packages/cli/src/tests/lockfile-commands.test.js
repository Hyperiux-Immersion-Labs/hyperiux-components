/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// outdated/versions/diff all read hyperiux.lock.json. Previously nothing
// wrote to it (add() never called upsertLockEntry), so these three
// commands were silently dead against every real install - "No effects
// installed" forever. Uses the real lockfile.js against a real temp dir
// (not mocked) so a regression there - like the original missing wiring -
// shows up here instead of only in a live project.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { upsertLockEntry } from "../utils/lockfile.js";

vi.mock("../utils/config.js", () => ({
  configExists: () => true,
  readConfig: () => ({ aliases: { effects: "@/components/effects" } }),
}));

vi.mock("../utils/auth.js", () => ({
  getAuthToken: () => null,
}));

const registryState = { versions: {} };

vi.mock("../utils/registry.js", () => ({
  fetchRegistry: async (name) => {
    if (!(name in registryState.versions)) {
      throw new Error(`"${name}" not found in registry`);
    }
    return { name, version: registryState.versions[name] };
  },
  getFileContent: async (file) => file.content ?? "",
  getRegistryItemFiles: (item) => item.files || [],
}));

let tmpDir;
let cwdSpy;
let exitSpy;
let logs;
let logSpy;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "hyperiux-lockcmd-"));
  cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(tmpDir);
  exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit(${code}) called unexpectedly`);
  });
  logs = [];
  logSpy = vi.spyOn(console, "log").mockImplementation((msg = "") => logs.push(String(msg)));
  registryState.versions = {};
});

afterEach(() => {
  cwdSpy.mockRestore();
  exitSpy.mockRestore();
  logSpy.mockRestore();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function output() {
  return logs.join("\n");
}

describe("outdated", () => {
  it("reports nothing installed when the lockfile is empty", async () => {
    const { outdated } = await import("../commands/outdated.js");
    await outdated();
    expect(output()).toContain("No effects installed yet");
  });

  it("finds an install that add() recorded via upsertLockEntry and reports it up to date", async () => {
    upsertLockEntry(tmpDir, "foo", { version: "1.0.0", files: {} });
    registryState.versions.foo = "1.0.0";

    const { outdated } = await import("../commands/outdated.js");
    await outdated();

    expect(output()).toContain("All 1 installed effects are up to date");
  });

  it("flags a patch/minor/major bump correctly", async () => {
    upsertLockEntry(tmpDir, "patch-effect", { version: "1.0.0", files: {} });
    upsertLockEntry(tmpDir, "minor-effect", { version: "1.0.0", files: {} });
    upsertLockEntry(tmpDir, "major-effect", { version: "1.0.0", files: {} });
    registryState.versions = {
      "patch-effect": "1.0.1",
      "minor-effect": "1.1.0",
      "major-effect": "2.0.0",
    };

    const { outdated } = await import("../commands/outdated.js");
    await outdated();

    const text = output();
    expect(text).toContain("patch-effect");
    expect(text).toContain("(patch)");
    expect(text).toContain("minor-effect");
    expect(text).toContain("(minor)");
    expect(text).toContain("major-effect");
    expect(text).toContain("(major)");
  });

  it("surfaces a per-effect fetch error without crashing the whole command", async () => {
    upsertLockEntry(tmpDir, "gone", { version: "1.0.0", files: {} });
    // registryState.versions has no "gone" entry -> fetchRegistry throws

    const { outdated } = await import("../commands/outdated.js");
    await outdated();

    expect(output()).toContain("could not check");
    expect(process.exitCode).toBe(1);
    process.exitCode = 0;
  });
});

describe("versions", () => {
  it("lists every installed effect regardless of bump status", async () => {
    upsertLockEntry(tmpDir, "up-to-date", { version: "1.0.0", files: {} });
    upsertLockEntry(tmpDir, "behind", { version: "1.0.0", files: {} });
    registryState.versions = { "up-to-date": "1.0.0", behind: "2.0.0" };

    const { versions } = await import("../commands/versions.js");
    await versions();

    const text = output();
    expect(text).toContain("Installed effects (2)");
    expect(text).toContain("up-to-date");
    expect(text).toContain("up to date");
    expect(text).toContain("behind");
    expect(text).toContain("→ 2.0.0 (major)");
  });
});

describe("diff", () => {
  it("reports no differences when on-disk content matches the registry", async () => {
    const targetPath = "components/effects/foo.jsx";
    fs.mkdirSync(path.dirname(path.join(tmpDir, targetPath)), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, targetPath), "export const Foo = 1;\n");

    upsertLockEntry(tmpDir, "foo", { version: "1.0.0", files: {} });
    registryState.versions.foo = "1.0.0";
    // fetchRegistry mock above only returns {name, version} - extend per-test
    // by monkeypatching the module's returned files via getRegistryItemFiles.

    const registryModule = await import("../utils/registry.js");
    vi.spyOn(registryModule, "getRegistryItemFiles").mockReturnValue([
      { targetPath, content: "export const Foo = 1;\n" },
    ]);

    const { diff } = await import("../commands/diff.js");
    await diff("foo");

    expect(output()).toContain("no differences");
  });

  it("shows a diff when the registry has changed since install", async () => {
    const targetPath = "components/effects/foo.jsx";
    fs.mkdirSync(path.dirname(path.join(tmpDir, targetPath)), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, targetPath), "export const Foo = 1;\n");

    upsertLockEntry(tmpDir, "foo", { version: "1.0.0", files: {} });
    registryState.versions.foo = "1.1.0";

    const registryModule = await import("../utils/registry.js");
    vi.spyOn(registryModule, "getRegistryItemFiles").mockReturnValue([
      { targetPath, content: "export const Foo = 2;\n" },
    ]);

    const { diff } = await import("../commands/diff.js");
    await diff("foo");

    const text = output();
    expect(text).toContain("foo (1.0.0 → 1.1.0)");
    expect(text).not.toContain("Nothing to update");
  });

  it("reports an effect not in the lockfile as not installed", async () => {
    const { diff } = await import("../commands/diff.js");
    await diff("never-added");

    expect(output()).toContain('"never-added" is not installed');
  });
});
