import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "node:fs";

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof fs>();
  return {
    ...actual,
    default: { ...actual.default, existsSync: vi.fn(), readFileSync: vi.fn() },
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  };
});

const { getAuthToken } = await import("./auth.js");

describe("getAuthToken", () => {
  const originalEnv = process.env.HYPERIUX_TOKEN;

  beforeEach(() => {
    vi.mocked(fs.existsSync).mockReset();
    vi.mocked(fs.readFileSync).mockReset();
  });
  afterEach(() => {
    if (originalEnv === undefined) delete process.env.HYPERIUX_TOKEN;
    else process.env.HYPERIUX_TOKEN = originalEnv;
  });

  it("prefers HYPERIUX_TOKEN over a saved auth file", () => {
    process.env.HYPERIUX_TOKEN = "  env-token  ";
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({ token: "file-token" }));

    expect(getAuthToken()).toBe("env-token");
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  it("falls back to the saved auth file when no env var is set", () => {
    delete process.env.HYPERIUX_TOKEN;
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({ token: "file-token" }));

    expect(getAuthToken()).toBe("file-token");
  });

  it("returns null when neither the env var nor the auth file exist", () => {
    delete process.env.HYPERIUX_TOKEN;
    vi.mocked(fs.existsSync).mockReturnValue(false);

    expect(getAuthToken()).toBeNull();
  });

  it("returns null instead of throwing when the auth file is corrupt JSON", () => {
    delete process.env.HYPERIUX_TOKEN;
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue("{not valid json");

    expect(getAuthToken()).toBeNull();
  });
});
