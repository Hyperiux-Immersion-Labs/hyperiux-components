/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { describe, it, expect } from "vitest";
import path from "path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_BIN = path.resolve(__dirname, "../../src/index.js");

// ─── CLI smoke ────────────────────────────────────────────────────────────────

describe("CLI entrypoint", () => {
  it("prints help without error", () => {
    const output = execFileSync("node", [CLI_BIN, "--help"], {
      encoding: "utf8",
    });
    expect(output).toContain("hyperiux");
    expect(output).toContain("init");
    expect(output).toContain("add");
    expect(output).toContain("list");
  });

  it("prints version without error", () => {
    const output = execFileSync("node", [CLI_BIN, "--version"], {
      encoding: "utf8",
    });
    // Allows an optional semver pre-release suffix (e.g. "1.1.0-beta.0"),
    // not just plain "x.y.z" releases.
    expect(output.trim()).toMatch(/^\d+\.\d+\.\d+(-[0-9A-Za-z-.]+)?$/);
  });
});

// ─── Path traversal ───────────────────────────────────────────────────────────

describe("path traversal protection", () => {
  it("resolved traversal path does not start with cwd", () => {
    const cwd = "/tmp/project";
    const maliciousTargetPath = "../../.ssh/authorized_keys";
    const resolved = path.resolve(cwd, maliciousTargetPath);

    expect(resolved.startsWith(path.resolve(cwd) + path.sep)).toBe(false);
  });

  it("safe target path stays within cwd", () => {
    const cwd = "/tmp/project";
    const safeTargetPath = "components/effects/blur-text.jsx";
    const resolved = path.resolve(cwd, safeTargetPath);

    expect(resolved.startsWith(path.resolve(cwd) + path.sep)).toBe(true);
  });
});

// ─── Asset host allowlist ─────────────────────────────────────────────────────

describe("fetchRegistryAsset host restriction", () => {
  it("rejects assets from untrusted hosts", async () => {
    const { fetchRegistryAsset } = await import("../utils/registry.js");

    await expect(
      fetchRegistryAsset("https://evil.example.com/payload.js")
    ).rejects.toThrow("untrusted host");
  });

  it("rejects http (non-https) untrusted hosts", async () => {
    const { fetchRegistryAsset } = await import("../utils/registry.js");

    await expect(
      fetchRegistryAsset("http://components.evil.com/payload.js")
    ).rejects.toThrow("untrusted host");
  });
});

// ─── Registry payload validation ─────────────────────────────────────────────

describe("validateRegistryPayload (via fetchProtectedEffect rejection)", () => {
  it("getRegistryItemFiles throws on missing targetPath", async () => {
    const { getRegistryItemFiles } = await import("../utils/registry.js");
    const badItem = {
      name: "bad-effect",
      files: [{ type: "registry:component" }],
    };

    expect(() => getRegistryItemFiles(badItem, {}, "/tmp/project")).toThrow(
      "Missing target path"
    );
  });
});
