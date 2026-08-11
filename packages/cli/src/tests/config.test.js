/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import {
  resolveAlias,
  getEffectsPath,
  getHooksPath,
  getLibPath,
  detectProjectEnvironment,
  detectProjectLanguage,
  detectNextRouter,
  detectCssPath,
  addTailwindImportToCss,
  hasTailwindInstalled,
  hasImportAliasConfigured,
  autoConfigureImportAlias,
  autoConfigureTailwindWiring,
} from "../utils/config.js";

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

  describe("project environment detection", () => {
    it("detects Next.js from package.json dependencies", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("package.json")
      );
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify({ dependencies: { next: "^15.0.0", react: "^19.0.0" } })
      );

      expect(detectProjectEnvironment("/project")).toBe("next");
    });

    it("detects React from Vite package.json dependencies", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("package.json")
      );
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify({ dependencies: { vite: "^6.0.0", react: "^19.0.0" } })
      );

      expect(detectProjectEnvironment("/project")).toBe("react");
    });

    it("detects TSX projects from TypeScript config", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("tsconfig.json")
      );

      expect(detectProjectLanguage("/project")).toBe("tsx");
    });

    it("defaults to JSX projects when TypeScript signals are absent", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      expect(detectProjectLanguage("/project")).toBe("jsx");
    });

    it("prefers a React CSS file in React projects", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("src/index.css") || p.endsWith("src")
      );

      expect(detectCssPath("/project", "react")).toBe("src/index.css");
    });

    it("falls back to a Next global CSS file in Next projects", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) => p.endsWith("src"));

      expect(detectCssPath("/project", "next")).toBe("src/app/globals.css");
    });

    it("does not misdetect a Vite project with a src/pages folder as Next.js", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("package.json")
      );
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify({ dependencies: { vite: "^6.0.0", react: "^19.0.0" } })
      );

      expect(detectProjectEnvironment("/project")).toBe("react");
    });

    it("detects Next.js App Router", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) => p.endsWith("src/app"));

      expect(detectNextRouter("/project")).toBe("app");
    });

    it("detects Next.js Pages Router", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) => p.endsWith("src/pages"));

      expect(detectNextRouter("/project")).toBe("pages");
    });

    it("prefers Pages Router CSS paths over App Router paths", () => {
      vi.mocked(fs.existsSync).mockImplementation(
        (p) => p.endsWith("src") || p.endsWith("src/styles/globals.css")
      );

      expect(detectCssPath("/project", "next", "pages")).toBe(
        "src/styles/globals.css"
      );
    });

    it("does not default an unknown framework to a Next-shaped CSS path", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      expect(detectCssPath("/project", "unknown")).toBe("styles/globals.css");
    });
  });

  describe("tailwind detection", () => {
    it("detects tailwind when the dependency is present AND a CSS file has the directive", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("package.json")
      );
      vi.spyOn(fs, "readdirSync").mockImplementation((dir) => {
        if (dir === "/project") {
          return [{ name: "index.css", isDirectory: () => false }];
        }
        return [];
      });
      vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (String(p).endsWith("package.json")) {
          return JSON.stringify({ devDependencies: { tailwindcss: "^4.0.0" } });
        }
        return '@import "tailwindcss";';
      });

      expect(hasTailwindInstalled("/project")).toBe(true);
    });

    it("returns false when the dependency is present but no CSS file imports tailwind (installed but not wired up)", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("package.json")
      );
      vi.spyOn(fs, "readdirSync").mockImplementation((dir) => {
        if (dir === "/project") {
          return [{ name: "index.css", isDirectory: () => false }];
        }
        return [];
      });
      vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (String(p).endsWith("package.json")) {
          return JSON.stringify({ devDependencies: { tailwindcss: "^4.0.0" } });
        }
        return ""; // empty CSS file — package installed, never imported
      });

      expect(hasTailwindInstalled("/project")).toBe(false);
    });

    it("detects tailwind from a tailwind.config file plus a directive, even without the dependency listed", () => {
      vi.mocked(fs.existsSync).mockImplementation(
        (p) => p.endsWith("package.json") || p.endsWith("tailwind.config.js")
      );
      vi.spyOn(fs, "readdirSync").mockImplementation((dir) => {
        if (dir === "/project") {
          return [{ name: "index.css", isDirectory: () => false }];
        }
        return [];
      });
      vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (String(p).endsWith("package.json")) {
          return JSON.stringify({});
        }
        return "@tailwind base;";
      });

      expect(hasTailwindInstalled("/project")).toBe(true);
    });

    it("returns false when tailwind is not installed at all", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("package.json")
      );
      vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify({}));

      expect(hasTailwindInstalled("/project")).toBe(false);
    });
  });

  describe("adding the Tailwind import", () => {
    it("prepends the Tailwind import to an existing CSS file", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("src/index.css")
      );
      vi.spyOn(fs, "readFileSync").mockReturnValue("body { margin: 0; }\n");
      const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      const result = addTailwindImportToCss("/project", "src/index.css");

      expect(result).toEqual({
        cssPath: "src/index.css",
        created: false,
        updated: true,
      });
      expect(writeSpy).toHaveBeenCalledWith(
        "/project/src/index.css",
        '@import "tailwindcss";\nbody { margin: 0; }\n',
        "utf-8"
      );
    });

    it("creates a detected framework CSS file with the Tailwind import", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) => p.endsWith("src"));
      const mkdirSpy = vi.spyOn(fs, "mkdirSync").mockImplementation(() => {});
      const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      const result = addTailwindImportToCss(
        "/project",
        detectCssPath("/project", "next", "app")
      );

      expect(result).toEqual({
        cssPath: "src/app/globals.css",
        created: true,
        updated: false,
      });
      expect(mkdirSpy).toHaveBeenCalledWith("/project/src/app", {
        recursive: true,
      });
      expect(writeSpy).toHaveBeenCalledWith(
        "/project/src/app/globals.css",
        '@import "tailwindcss";\n',
        "utf-8"
      );
    });

    it("does not rewrite CSS that already imports Tailwind", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("styles/globals.css")
      );
      vi.spyOn(fs, "readFileSync").mockReturnValue('@import "tailwindcss";\n');
      const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      const result = addTailwindImportToCss("/project", "styles/globals.css");

      expect(result).toEqual({
        cssPath: "styles/globals.css",
        created: false,
        updated: false,
      });
      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe("import alias detection", () => {
    it("detects an '@/*' alias from tsconfig.json paths", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("tsconfig.json")
      );
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify({
          compilerOptions: { paths: { "@/*": ["./src/*"] } },
        })
      );

      expect(hasImportAliasConfigured("/project")).toBe(true);
    });

    it("detects an '@' alias from vite.config.js content", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("vite.config.js")
      );
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        'export default { resolve: { alias: { "@": "/src" } } }'
      );

      expect(hasImportAliasConfigured("/project")).toBe(true);
    });

    it("returns false when no alias is configured anywhere", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      expect(hasImportAliasConfigured("/project")).toBe(false);
    });
  });

  describe("auto-configuring the import alias", () => {
    it("creates jsconfig.json with an '@/*' alias when nothing exists yet", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      const result = autoConfigureImportAlias("/project");

      expect(result.configFile).toBe("jsconfig.json");
      expect(result.configFileCreated).toBe(true);

      const [writtenPath, writtenContent] = writeSpy.mock.calls[0];
      expect(writtenPath).toBe("/project/jsconfig.json");
      expect(JSON.parse(writtenContent).compilerOptions.paths["@/*"]).toEqual([
        "./*",
      ]);
    });

    it("targets src/* when a src directory exists", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) => p.endsWith("src"));
      const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      autoConfigureImportAlias("/project");

      const writtenContent = writeSpy.mock.calls[0][1];
      expect(JSON.parse(writtenContent).compilerOptions.paths["@/*"]).toEqual([
        "./src/*",
      ]);
    });

    // Regression coverage for a real bug: patching a CommonJS vite.config.js
    // with an ESM `import`/`import.meta.url` snippet doesn't throw - Node's
    // mixed-syntax detection silently takes over and module.exports becomes
    // a no-op, so the resulting config loads as an empty object with no
    // error at all. These two tests must always emit syntax matching the
    // target file's actual module system.
    it("patches a CommonJS vite.config.js using require()/__dirname, not import.meta", () => {
      vi.mocked(fs.existsSync).mockImplementation(
        (p) => p.endsWith("src") || p.endsWith("vite.config.js")
      );
      vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (String(p).endsWith("package.json")) return JSON.stringify({});
        return 'module.exports = defineConfig({\n  plugins: [react()],\n});\n';
      });
      const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      const result = autoConfigureImportAlias("/project");

      expect(result.viteConfigUpdated).toBe(true);
      const writtenContent = writeSpy.mock.calls.find(([p]) =>
        p.endsWith("vite.config.js")
      )[1];
      expect(writtenContent).toContain(
        '"@": require("path").resolve(__dirname, "./src")'
      );
      expect(writtenContent).not.toContain("import.meta.url");
    });

    it("patches an ESM vite.config.js (package.json type: module) using import.meta.url", () => {
      vi.mocked(fs.existsSync).mockImplementation(
        (p) =>
          p.endsWith("src") ||
          p.endsWith("vite.config.js") ||
          p.endsWith("package.json")
      );
      vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (String(p).endsWith("package.json"))
          return JSON.stringify({ type: "module" });
        return "export default defineConfig({\n  plugins: [react()],\n});\n";
      });
      const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      autoConfigureImportAlias("/project");

      const writtenContent = writeSpy.mock.calls.find(([p]) =>
        p.endsWith("vite.config.js")
      )[1];
      expect(writtenContent).toContain(
        '"@": new URL("./src", import.meta.url).pathname'
      );
      expect(writtenContent).not.toContain("require(");
    });
  });

  describe("auto-configuring Tailwind wiring", () => {
    it("patches a CommonJS vite.config.js using require(), not an import statement", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) =>
        p.endsWith("vite.config.js")
      );
      vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (String(p).endsWith("package.json")) return JSON.stringify({});
        return 'module.exports = defineConfig({\n  plugins: [react()],\n});\n';
      });
      const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      const result = autoConfigureTailwindWiring("/project", "react");

      expect(result.fixed).toBe(true);
      const writtenContent = writeSpy.mock.calls[0][1];
      expect(writtenContent.startsWith(
        'const tailwindcss = require("@tailwindcss/vite");\n'
      )).toBe(true);
      expect(writtenContent).not.toContain("import tailwindcss");
    });

    it("patches an ESM vite.config.js (package.json type: module) using an import statement", () => {
      vi.mocked(fs.existsSync).mockImplementation(
        (p) => p.endsWith("vite.config.js") || p.endsWith("package.json")
      );
      vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (String(p).endsWith("package.json"))
          return JSON.stringify({ type: "module" });
        return "export default defineConfig({\n  plugins: [react()],\n});\n";
      });
      const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      const result = autoConfigureTailwindWiring("/project", "react");

      expect(result.fixed).toBe(true);
      const writtenContent = writeSpy.mock.calls[0][1];
      expect(writtenContent.startsWith(
        'import tailwindcss from "@tailwindcss/vite";\n'
      )).toBe(true);
      expect(writtenContent).not.toContain("require(");
    });
  });
});
