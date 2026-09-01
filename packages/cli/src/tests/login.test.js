/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// login.js had zero test coverage before this. whoami previously reported
// "logged in" from local file presence alone, with no server check - it
// now calls the same /api/cli/validate endpoint login() already used, so
// these tests cover both call sites' response handling.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

let logs;

vi.mock("ora", () => {
  const spinner = {
    start() {
      return spinner;
    },
    succeed(text) {
      if (text) logs.push(text);
      return spinner;
    },
    fail(text) {
      if (text) logs.push(text);
      return spinner;
    },
  };
  return { default: () => spinner };
});

const authState = { token: null };

vi.mock("../utils/auth.js", () => ({
  getAuthToken: () => authState.token,
  getAuthFilePath: () => "/home/user/.hyperiux/auth.json",
  getTokenPreview: () => "hpx_****1234",
  saveAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}));

let logSpy;
let fetchSpy;

beforeEach(() => {
  authState.token = null;
  logs = [];
  logSpy = vi.spyOn(console, "log").mockImplementation((msg = "") => logs.push(String(msg)));
  fetchSpy = vi.spyOn(globalThis, "fetch");
});

afterEach(() => {
  logSpy.mockRestore();
  fetchSpy.mockRestore();
});

function output() {
  return logs.join("\n");
}

describe("whoami", () => {
  it("reports not logged in when there's no saved token (no network call)", async () => {
    const { whoami } = await import("../commands/login.js");
    await whoami();

    expect(output()).toContain("Not logged in");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("confirms a valid saved token against the server", async () => {
    authState.token = "hpx_valid";
    fetchSpy.mockResolvedValue({ ok: true, json: async () => ({ valid: true }) });

    const { whoami } = await import("../commands/login.js");
    await whoami();

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/api/cli/validate"),
      expect.objectContaining({ method: "POST" })
    );
    expect(output()).toContain("valid CLI token");
  });

  it("flags a saved token the server no longer accepts, instead of trusting the local file", async () => {
    authState.token = "hpx_revoked";
    fetchSpy.mockResolvedValue({
      ok: false,
      json: async () => ({ valid: false, reason: "Token revoked" }),
    });

    const { whoami } = await import("../commands/login.js");
    await whoami();

    const text = output();
    expect(text).toContain("no longer valid");
    expect(text).toContain("Token revoked");
    expect(text).toContain("login` to log in again");
  });

  it("fails gracefully when the server can't be reached", async () => {
    authState.token = "hpx_whatever";
    fetchSpy.mockRejectedValue(new Error("network down"));

    const { whoami } = await import("../commands/login.js");
    await whoami();

    expect(output()).toContain("Could not reach Hyperiux");
  });
});
