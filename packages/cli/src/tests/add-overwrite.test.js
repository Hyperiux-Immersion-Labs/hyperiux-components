import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";

// ─── Module mocks ──────────────────────────────────────────────────────────────
// add.js talks to the registry, network, config and package manager. We stub all
// of those so the tests exercise only the local overwrite-decision + file-write
// logic against a real temp directory on disk.

const REGISTRY_CONTENT = "// registry version\nexport const Foo = () => null;\n";
const TARGET_REL = "components/effects/foo.jsx";

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

const promptsMock = vi.fn(async () => ({ proceed: false }));
vi.mock("prompts", () => ({ default: (...args) => promptsMock(...args) }));

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

vi.mock("../utils/registry.js", () => ({
  fetchRegistry: async () => ({
    title: "Foo",
    version: "1.0.0",
    files: [{ targetPath: TARGET_REL, content: REGISTRY_CONTENT }],
  }),
  getRegistryItemFiles: () => [
    { targetPath: TARGET_REL, content: REGISTRY_CONTENT },
  ],
  getFileContent: async (file) => file.content,
}));

// ─── Test harness ──────────────────────────────────────────────────────────────

let tmpDir;
let exitSpy;
let cwdSpy;
let logSpy;

async function importAdd() {
  const mod = await import("../commands/add.js");
  return mod.add;
}

function writeExistingCustomizedFile(content) {
  const target = path.join(tmpDir, TARGET_REL);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  return target;
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "hyperiux-add-"));
  cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(tmpDir);
  // If any code path unexpectedly exits, surface it as a test failure instead of
  // tearing down the test runner.
  exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit(${code}) called unexpectedly`);
  });
  logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  promptsMock.mockClear();
});

afterEach(() => {
  cwdSpy.mockRestore();
  exitSpy.mockRestore();
  logSpy.mockRestore();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ─── The two paths the safety fix must guarantee ────────────────────────────────

describe("add — overwrite safety of --yes", () => {
  it("--yes alone does NOT overwrite an existing (customized) file", async () => {
    const add = await importAdd();
    const CUSTOM = "// MY LOCAL EDITS — do not clobber\n";
    const target = writeExistingCustomizedFile(CUSTOM);

    await add("foo", { yes: true });

    expect(fs.readFileSync(target, "utf8")).toBe(CUSTOM);
    // The overwrite prompt must never be shown when prompts are skipped.
    expect(promptsMock).not.toHaveBeenCalled();
  });

  it("--yes --overwrite together DO overwrite the existing file", async () => {
    const add = await importAdd();
    const CUSTOM = "// MY LOCAL EDITS\n";
    const target = writeExistingCustomizedFile(CUSTOM);

    await add("foo", { yes: true, overwrite: true });

    expect(fs.readFileSync(target, "utf8")).toBe(REGISTRY_CONTENT);
    expect(promptsMock).not.toHaveBeenCalled();
  });

  it("writes normally when the file does not already exist", async () => {
    const add = await importAdd();

    await add("foo", { yes: true });

    const target = path.join(tmpDir, TARGET_REL);
    expect(fs.existsSync(target)).toBe(true);
    expect(fs.readFileSync(target, "utf8")).toBe(REGISTRY_CONTENT);
  });

  it("stamps README and resets global CSS after a successful install", async () => {
    const add = await importAdd();
    const readmePath = path.join(tmpDir, "README.md");
    const cssPath = path.join(tmpDir, "src/app/globals.css");
    fs.mkdirSync(path.dirname(cssPath), { recursive: true });
    fs.writeFileSync(readmePath, "# Demo\n");
    fs.writeFileSync(cssPath, '@import "tailwindcss";\n.custom { color: red; }\n');

    await add("foo", { yes: true });

    expect(fs.readFileSync(readmePath, "utf8")).toBe(
      "// Built using Hyperiux Vault: [https://vault.hyperiux.com](https://vault.hyperiux.com)\n// Installed Effect:foo\n\n# Demo\n"
    );
    expect(fs.readFileSync(cssPath, "utf8")).toBe('@import "tailwindcss";\n');

    await add("foo", { yes: true, overwrite: true });

    expect(fs.readFileSync(readmePath, "utf8")).toBe(
      "// Built using Hyperiux Vault: [https://vault.hyperiux.com](https://vault.hyperiux.com)\n// Installed Effect:foo\n\n# Demo\n"
    );
  });
});

describe("getImportPath", () => {
  it("points at the effect's own folder, not the bare filename", async () => {
    const mod = await import("../commands/add.js");
    const config = { aliases: { effects: "@/components/effects" } };

    expect(
      mod.getImportPath(
        { targetPath: "src/components/effects/phantom-image-trail/index.tsx" },
        config
      )
    ).toBe("@/components/effects/phantom-image-trail");

    expect(
      mod.getImportPath(
        { targetPath: "src/components/effects/phantom-image-trail/useMouse.ts" },
        config
      )
    ).toBe("@/components/effects/phantom-image-trail/useMouse");
  });
});
