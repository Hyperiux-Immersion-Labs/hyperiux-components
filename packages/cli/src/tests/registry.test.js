import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import { getRegistryItemFiles } from "../utils/registry.js";

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

describe("registry utilities", () => {
  const mockConfig = {
    aliases: {
      components: "@/components",
      effects: "@/components/effects",
      hooks: "@/hooks",
      lib: "@/lib",
    },
  };

  const mockItem = {
    name: "blur-text",
    files: [
      {
        path: "blur-text.jsx",
        type: "registry:component",
        target: "components/hyperiux/blur-text.jsx",
      },
      {
        path: "use-animation.js",
        type: "registry:component",
        target: "hooks/use-animation.js",
      },
      {
        path: "assets/img/image01.webp",
        type: "registry:asset",
        target: "public/assets/img/image01.webp",
        source: "/assets/img/image01.webp",
      },
    ],
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

    it("should resolve components/hyperiux/ to custom effects alias and prepend src/", () => {
      const files = getRegistryItemFiles(mockItem, mockConfig);
      
      expect(files[0].targetPath).toBe("src/components/effects/blur-text.jsx");
      expect(files[1].targetPath).toBe("src/hooks/use-animation.js");
      expect(files[2].targetPath).toBe("public/assets/img/image01.webp");
    });
  });

  describe("when src/ directory does NOT exist", () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
    });

    it("should resolve components/hyperiux/ to custom effects alias and NOT prepend src/", () => {
      const files = getRegistryItemFiles(mockItem, mockConfig);
      
      expect(files[0].targetPath).toBe("components/effects/blur-text.jsx");
      expect(files[1].targetPath).toBe("hooks/use-animation.js");
      expect(files[2].targetPath).toBe("public/assets/img/image01.webp");
    });
  });
});
