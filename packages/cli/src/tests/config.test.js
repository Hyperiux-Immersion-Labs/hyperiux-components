import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import { resolveAlias, getEffectsPath, getHooksPath, getLibPath } from "../utils/config.js";

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      ...actual.default,
      existsSync: vi.fn(),
    },
    existsSync: vi.fn(),
  };
});

describe("config utilities", () => {
  const mockConfig = {
    aliases: {
      components: "@/components",
      effects: "@/components/effects",
      hooks: "@/hooks",
      lib: "@/lib",
    },
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when src/ directory exists", () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockImplementation((p) => {
        if (p.endsWith("src")) return true;
        return false;
      });
    });

    it("should resolve aliases with src/ prefix", () => {
      const result = resolveAlias("@/components/effects/blur-text", mockConfig);
      expect(result).toBe("src/components/effects/blur-text");
    });

    it("should fallback getEffectsPath to src/components/effects", () => {
      expect(getEffectsPath(mockConfig)).toBe("src/components/effects");
    });

    it("should fallback getHooksPath to src/hooks", () => {
      expect(getHooksPath(mockConfig)).toBe("src/hooks");
    });

    it("should fallback getLibPath to src/lib", () => {
      expect(getLibPath(mockConfig)).toBe("src/lib");
    });
  });

  describe("when src/ directory does NOT exist", () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
    });

    it("should resolve aliases without src/ prefix", () => {
      const result = resolveAlias("@/components/effects/blur-text", mockConfig);
      expect(result).toBe("components/effects/blur-text");
    });

    it("should fallback getEffectsPath to components/effects", () => {
      expect(getEffectsPath(mockConfig)).toBe("components/effects");
    });

    it("should fallback getHooksPath to hooks", () => {
      expect(getHooksPath(mockConfig)).toBe("hooks");
    });

    it("should fallback getLibPath to lib", () => {
      expect(getLibPath(mockConfig)).toBe("lib");
    });
  });
});
