/* SPDX-License-Identifier: MIT */

// Security-hardening regression suite.
//
// Convention: every test asserts the SECURE behaviour.
//   - `it(...)`        -> behaviour that is already secure today (must pass).
//   - `it.fails(...)`  -> a known vulnerability that still exists. The test's
//                         assertions genuinely fail today, so `it.fails` keeps
//                         the suite green. Once the bug is fixed the
//                         assertions pass, `it.fails` turns red, and the
//                         marker should be flipped to a plain `it`.
//
// Isolation guarantees:
//   - `os.homedir()` is mocked to a fresh mkdtemp dir, so auth.js never
//     touches the real ~/.hyperiux (a beforeAll guard aborts otherwise).
//   - `globalThis.fetch` is replaced with a vi.fn() in every test - no network.

import { describe, it, expect, vi, beforeAll, beforeEach, afterEach, afterAll } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { URL } from "url";
import { Buffer } from "buffer";

// ─── Temp HOME (must exist before auth.js computes CONFIG_DIR at import) ──────

const homeState = vi.hoisted(() => ({ dir: null, realHome: null }));

vi.mock("os", async (importOriginal) => {
  const actual = await importOriginal();
  const nodeFs = await import("node:fs");
  const nodePath = await import("node:path");
  const real = actual.default ?? actual;

  if (!homeState.dir) {
    homeState.realHome = real.homedir();
    homeState.dir = nodeFs.mkdtempSync(nodePath.join(real.tmpdir(), "hyperiux-home-"));
  }

  const patched = { ...real, homedir: () => homeState.dir };
  return { ...actual, ...patched, default: patched };
});

// ─── Module mocks shared across the file ──────────────────────────────────────

let spinnerTexts = [];

vi.mock("ora", () => {
  const spinner = {
    text: "",
    start(text) {
      if (text) spinnerTexts.push(String(text));
      return spinner;
    },
    succeed(text) {
      if (text) spinnerTexts.push(String(text));
      return spinner;
    },
    fail(text) {
      if (text) spinnerTexts.push(String(text));
      return spinner;
    },
    stop() {
      return spinner;
    },
  };
  return {
    default: (text) => {
      if (text) spinnerTexts.push(String(text));
      return spinner;
    },
  };
});

const promptsMock = vi.fn(async () => ({}));
vi.mock("prompts", () => ({ default: (...args) => promptsMock(...args) }));

vi.mock("../utils/cli-state.js", () => ({
  getOrCreateDeviceId: () => "device-test-123",
}));

vi.mock("../utils/telemetry.js", () => ({
  trackCliEvent: async () => {},
}));

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
  detectProjectLanguage: () => "jsx",
}));

vi.mock("../utils/package-manager.js", () => ({
  getMissingDependencies: () => [],
  installDependencies: () => {},
  detectPackageManager: () => "npm",
}));

vi.mock("../utils/lockfile.js", () => ({
  upsertLockEntry: () => {},
}));

// ─── Global harness ───────────────────────────────────────────────────────────

let fetchMock;
const originalFetch = globalThis.fetch;
const originalTokenEnv = process.env.HYPERIUX_TOKEN;

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Error",
    json: async () => body,
    arrayBuffer: async () => new ArrayBuffer(4),
  };
}

beforeAll(async () => {
  // Hard guard: never let this file touch the real ~/.hyperiux.
  const { getAuthFilePath } = await import("../utils/auth.js");
  const authPath = getAuthFilePath();
  if (!homeState.dir || !authPath.startsWith(homeState.dir + path.sep)) {
    throw new Error(`Refusing to run: auth path ${authPath} is not inside the temp HOME`);
  }
  if (homeState.realHome && authPath.startsWith(path.join(homeState.realHome, ".hyperiux"))) {
    throw new Error("Refusing to run: auth path resolves to the real ~/.hyperiux");
  }
});

beforeEach(() => {
  fetchMock = vi.fn(async () => jsonResponse({ name: "x", tier: "free", files: [] }));
  globalThis.fetch = fetchMock;
  delete process.env.HYPERIUX_TOKEN;
  spinnerTexts = [];
  promptsMock.mockReset();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalTokenEnv === undefined) delete process.env.HYPERIUX_TOKEN;
  else process.env.HYPERIUX_TOKEN = originalTokenEnv;
  vi.restoreAllMocks();
  if (homeState.dir) {
    fs.rmSync(path.join(homeState.dir, ".hyperiux"), { recursive: true, force: true });
  }
});

afterAll(() => {
  if (homeState.dir) fs.rmSync(homeState.dir, { recursive: true, force: true });
});

// ─── [C1] add: symlink escape on write ────────────────────────────────────────

describe("[C1] add - writes must not follow symlinks out of the project", () => {
  let projectDir;
  let outsideDir;

  beforeEach(() => {
    projectDir = fs.mkdtempSync(path.join(os.tmpdir(), "hyperiux-proj-"));
    outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), "hyperiux-outside-"));
    // `components/` inside the project is a symlink to a dir OUTSIDE it.
    fs.symlinkSync(outsideDir, path.join(projectDir, "components"), "dir");
    vi.spyOn(process, "cwd").mockReturnValue(projectDir);
    vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit(${code})`);
    });
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    fs.rmSync(projectDir, { recursive: true, force: true });
    fs.rmSync(outsideDir, { recursive: true, force: true });
  });

  // Driven end-to-end through add(): the real fetchRegistry / validateRegistryPayload /
  // getRegistryItemFiles run against a mocked fetch, so the targetPath
  // `components/evil.jsx` passes every lexical check (no "..", matches SAFE_PATH,
  // and path.resolve stays under cwd). Only the symlink check in add.js's
  // write loop stops it from landing outside the project.
  it("[C1] add does not write through an in-project symlink pointing outside the project", async () => {
    const payload = {
      name: "evil",
      tier: "free",
      files: [{ targetPath: "components/evil.jsx", content: "// pwned\n" }],
    };
    fetchMock.mockImplementation(async () => jsonResponse(payload));

    const { add } = await import("../commands/add.js");

    try {
      await add("evil", { yes: true, overwrite: true });
    } catch {
      // A secure implementation may block via process.exit(1) - that's fine.
    }

    // Sanity: the registry was actually consulted via the mocked fetch.
    expect(fetchMock).toHaveBeenCalled();
    // Secure behaviour: nothing lands in the directory outside the project.
    expect(fs.readdirSync(outsideDir)).toEqual([]);
  });

  it("still writes through an in-project symlink that stays inside the project (control)", async () => {
    fs.mkdirSync(path.join(projectDir, "shared"));
    fs.symlinkSync(path.join(projectDir, "shared"), path.join(projectDir, "lib"), "dir");
    fetchMock.mockImplementation(async () =>
      jsonResponse({ name: "ok", tier: "free", files: [{ targetPath: "lib/ok.js", content: "// ok\n" }] })
    );

    const { add } = await import("../commands/add.js");
    await add("ok", { yes: true, overwrite: true });

    expect(fs.readFileSync(path.join(projectDir, "shared", "ok.js"), "utf-8")).toBe("// ok\n");
  });
});

// ─── [C2] effect names must be URL-encoded ────────────────────────────────────

const HOSTILE_NAMES = ["../secret", "a?b=c#x"];

function assertEncodedEffectUrl(rawUrl, name, expectedPathSuffix) {
  const url = new URL(String(rawUrl));
  // Pathname must carry the encoded name verbatim - no `..` normalisation
  // escaping the intended prefix.
  expect(url.pathname.endsWith(expectedPathSuffix)).toBe(true);
  // No query string / fragment injected from the name.
  expect(url.search).toBe("");
  expect(url.hash).toBe("");
  // No raw dot-dot segment survives anywhere in the path.
  expect(url.pathname.split("/")).not.toContain("..");
  expect(String(rawUrl)).toContain(encodeURIComponent(name));
}

describe("[C2] effect names are URL-encoded in request URLs", () => {
  it("[C2] the public registry request (fetchRegistryMetadata) encodes the effect name", async () => {
    const { fetchRegistryMetadata } = await import("../utils/registry.js");

    for (const name of HOSTILE_NAMES) {
      fetchMock.mockClear();
      await fetchRegistryMetadata(name).catch(() => {});
      expect(fetchMock).toHaveBeenCalledTimes(1);
      assertEncodedEffectUrl(fetchMock.mock.calls[0][0], name, `/${encodeURIComponent(name)}.json`);
    }
  });

  it("[C2] the metered API request (fetchRegistry) encodes the effect name", async () => {
    const { fetchRegistry } = await import("../utils/registry.js");

    for (const name of HOSTILE_NAMES) {
      fetchMock.mockClear();
      await fetchRegistry(name, {}).catch(() => {});
      expect(fetchMock).toHaveBeenCalledTimes(1);
      assertEncodedEffectUrl(
        fetchMock.mock.calls[0][0],
        name,
        `/api/cli/effects/${encodeURIComponent(name)}`
      );
    }
  });
});

// ─── [C3] asset fetches must be TLS-only ──────────────────────────────────────

describe("[C3] fetchRegistryAsset requires https", () => {
  it("[C3] rejects a plain-http URL on the allowlisted host", async () => {
    const { fetchRegistryAsset } = await import("../utils/registry.js");

    await expect(
      fetchRegistryAsset("http://vault.hyperiux.com/r/assets/image.png")
    ).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still accepts https on the allowlisted host (control)", async () => {
    const { fetchRegistryAsset } = await import("../utils/registry.js");

    const buf = await fetchRegistryAsset("https://vault.hyperiux.com/r/assets/image.png");
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

// ─── Auth token storage ───────────────────────────────────────────────────────

describe("auth token storage", () => {
  it("writes the token file with mode 0o600 inside a 0o700 directory", async () => {
    const { saveAuthToken, getAuthFilePath } = await import("../utils/auth.js");

    saveAuthToken("hpx_mode_check_token_123456");

    const file = getAuthFilePath();
    expect(fs.statSync(file).mode & 0o777).toBe(0o600);
    expect(fs.statSync(path.dirname(file)).mode & 0o777).toBe(0o700);
  });

  // writeFileSync's `mode` and mkdirSync's `mode` only apply when the entry is
  // CREATED. A pre-existing world-readable auth.json / ~/.hyperiux (e.g. made
  // by an older CLI version, or by cli-state.js which creates the same dir
  // without a mode) keeps its loose permissions after re-login.
  it("[C4] re-saving tightens a pre-existing world-readable token file/dir to 0o600/0o700", async () => {
    const { saveAuthToken, getAuthFilePath } = await import("../utils/auth.js");
    const file = getAuthFilePath();
    const dir = path.dirname(file);

    fs.mkdirSync(dir, { recursive: true });
    fs.chmodSync(dir, 0o755);
    fs.writeFileSync(file, "{}\n");
    fs.chmodSync(file, 0o644);

    saveAuthToken("hpx_reused_file_token_123456");

    expect(fs.statSync(file).mode & 0o777).toBe(0o600);
    expect(fs.statSync(dir).mode & 0o777).toBe(0o700);
  });

  it("HYPERIUX_TOKEN env var takes precedence over the saved file", async () => {
    const { saveAuthToken, getAuthToken } = await import("../utils/auth.js");

    saveAuthToken("hpx_from_file_aaaaaaaaaaaa");
    expect(getAuthToken()).toBe("hpx_from_file_aaaaaaaaaaaa");

    process.env.HYPERIUX_TOKEN = "  hpx_from_env_bbbbbbbbbbbb  ";
    expect(getAuthToken()).toBe("hpx_from_env_bbbbbbbbbbbb");
  });

  it("`logout` (login.js, the command wired in index.js) removes the token file", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const { saveAuthToken, getAuthFilePath } = await import("../utils/auth.js");
    const { logout } = await import("../commands/login.js");

    saveAuthToken("hpx_logout_check_token_1234");
    expect(fs.existsSync(getAuthFilePath())).toBe(true);

    await logout();

    expect(fs.existsSync(getAuthFilePath())).toBe(false);
  });
});

// ─── Token never printed ──────────────────────────────────────────────────────

describe("token is never echoed to output", () => {
  const SECRET = "hpx_SUPERSECRET_9f8e7d6c5b4a3210_zzz";
  let captured;

  beforeEach(() => {
    captured = [];
    const capture = (...args) => {
      captured.push(args.map(String).join(" "));
    };
    vi.spyOn(console, "log").mockImplementation(capture);
    vi.spyOn(console, "error").mockImplementation(capture);
    vi.spyOn(console, "warn").mockImplementation(capture);
    vi.spyOn(console, "info").mockImplementation(capture);
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      captured.push(String(chunk));
      return true;
    });
    vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
      captured.push(String(chunk));
      return true;
    });
    vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit(${code})`);
    });
  });

  function allOutput() {
    return [...captured, ...spinnerTexts].join("\n");
  }

  it("login (successful verify + save) never prints the full token", async () => {
    promptsMock.mockResolvedValue({ token: `  ${SECRET}  ` });
    fetchMock.mockResolvedValue(jsonResponse({ valid: true }));

    const { login } = await import("../commands/login.js");
    const { getAuthToken } = await import("../utils/auth.js");
    await login();

    expect(getAuthToken()).toBe(SECRET); // sanity: flow really ran and saved it
    expect(allOutput()).not.toContain(SECRET);
  });

  it("login (server rejects token) never prints the full token", async () => {
    promptsMock.mockResolvedValue({ token: SECRET });
    fetchMock.mockResolvedValue(jsonResponse({ valid: false, reason: "revoked" }, { ok: false, status: 401 }));

    const { login } = await import("../commands/login.js");
    await expect(login()).rejects.toThrow("process.exit(1)");

    expect(allOutput()).toContain("revoked"); // sanity: failure path ran
    expect(allOutput()).not.toContain(SECRET);
  });

  it("whoami (valid saved token) prints only a preview, never the full token", async () => {
    const { saveAuthToken } = await import("../utils/auth.js");
    saveAuthToken(SECRET);
    fetchMock.mockResolvedValue(jsonResponse({ valid: true }));

    const { whoami } = await import("../commands/login.js");
    await whoami();

    expect(allOutput()).toContain("Token:"); // sanity: preview line printed
    expect(allOutput()).not.toContain(SECRET);
  });

  it("whoami (HYPERIUX_TOKEN env, server unreachable) never prints the full token", async () => {
    process.env.HYPERIUX_TOKEN = SECRET;
    fetchMock.mockRejectedValue(new Error("network down"));

    const { whoami } = await import("../commands/login.js");
    await whoami();

    expect(allOutput()).toContain("Could not reach Hyperiux");
    expect(allOutput()).not.toContain(SECRET);
  });
});
