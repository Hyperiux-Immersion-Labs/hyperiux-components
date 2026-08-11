/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import {
  getRegistryItemFiles,
  normalizeRegistryIndex,
  stripTypeScriptFromReactSource,
} from "../utils/registry.js";

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
        content: "export function BlurText() {}",
      },
      {
        path: "use-animation.js",
        type: "registry:component",
        target: "hooks/use-animation.js",
        content: "export function useAnimation() {}",
      },
      {
        path: "assets/img/image01.webp",
        type: "registry:asset",
        target: "public/assets/img/image01.webp",
        source: "/assets/img/image01.webp",
      },
    ],
  };

  describe("normalizeRegistryIndex", () => {
    it("should normalize local array indexes and default missing tiers to free", () => {
      const index = normalizeRegistryIndex([
        { name: "dotted-grid", category: "backgrounds" },
        { name: "spotlight-text", category: "text", tier: "pro" },
      ]);

      expect(index.items).toEqual([
        { name: "dotted-grid", category: "backgrounds", tier: "free" },
        { name: "spotlight-text", category: "text", tier: "pro" },
      ]);
      expect(index.tiers.free.map((item) => item.name)).toEqual([
        "dotted-grid",
      ]);
      expect(index.tiers.pro.map((item) => item.name)).toEqual([
        "spotlight-text",
      ]);
    });

    it("should normalize remote object indexes and treat paid as pro", () => {
      const index = normalizeRegistryIndex({
        items: [
          { name: "phantom-image-trail", tier: "free" },
          { name: "fluid-ripple", tier: "paid" },
        ],
      });

      expect(index.items[1].tier).toBe("pro");
      expect(index.tiers.pro.map((item) => item.name)).toEqual([
        "fluid-ripple",
      ]);
    });
  });

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

    it("should not double-prefix src/ when the registry target path is already src/-rooted", () => {
      const itemWithSrcPrefixedPaths = {
        name: "spider-particles",
        files: [
          {
            path: "spider-particles.jsx",
            type: "registry:component",
            target: "src/components/effects/spider-particles.jsx",
          },
        ],
      };

      const files = getRegistryItemFiles(itemWithSrcPrefixedPaths, mockConfig);

      expect(files[0].targetPath).toBe("src/components/effects/spider-particles.jsx");
    });

    it("converts TSX registry components to JSX for JSX projects", () => {
      const tsxItem = {
        name: "typed-effect",
        files: [
          {
            path: "typed-effect.tsx",
            type: "registry:component",
            target: "components/hyperiux/typed-effect.tsx",
            content: `"use client";
import type { MouseEvent } from "react";

type TypedEffectProps = {
  label: string;
};

export function TypedEffect({ label }: TypedEffectProps): JSX.Element {
  const [count, setCount] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const onClick = (event: MouseEvent<HTMLButtonElement>) => setCount(count + 1);

  return <button ref={ref} onClick={onClick}>{label} {count}</button>;
}
`,
          },
        ],
      };

      const files = getRegistryItemFiles(tsxItem, mockConfig);

      expect(files[0].targetPath).toBe("src/components/effects/typed-effect.jsx");
      expect(files[0].content).toContain("export function TypedEffect({ label }) {");
      expect(files[0].content).toContain("useState(0)");
      expect(files[0].content).toContain("useRef(null)");
      expect(files[0].content).toContain("const onClick = (event) =>");
      expect(files[0].content).not.toContain("TypedEffectProps");
      expect(files[0].content).not.toContain("MouseEvent");
    });

    it("preserves TSX registry components for TypeScript projects", () => {
      vi.mocked(fs.existsSync).mockImplementation((p) => {
        if (p.endsWith("src") || p.endsWith("tsconfig.json")) return true;
        return false;
      });

      const tsxItem = {
        name: "typed-effect",
        files: [
          {
            path: "typed-effect.tsx",
            type: "registry:component",
            target: "components/hyperiux/typed-effect.tsx",
            content: "export function TypedEffect(): JSX.Element { return <div />; }",
          },
        ],
      };

      const files = getRegistryItemFiles(tsxItem, mockConfig);

      expect(files[0].targetPath).toBe("src/components/effects/typed-effect.tsx");
      expect(files[0].content).toContain(": JSX.Element");
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

  describe("stripTypeScriptFromReactSource", () => {
    it("strips common TypeScript-only React syntax", () => {
      const result = stripTypeScriptFromReactSource(`
import type { RefObject } from "react";
interface Props {
  title: string;
}
export const Card: React.FC<Props> = ({ title }: Props) => {
  const value: number = 1 as const;
  return <div>{title} {value}</div>;
};
`);

      expect(result).not.toContain("import type");
      expect(result).not.toContain("interface Props");
      expect(result).not.toContain("React.FC");
      expect(result).toContain("export const Card = ({ title }) =>");
      expect(result).toContain("const value = 1");
    });

    it("does not strip ordinary object literal properties", () => {
      const result = stripTypeScriptFromReactSource(`
export function SpiderParticles() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const config = { amount, scale, opacity, resolution: [width, height] };

  return null;
}
`);

      expect(result).toContain("useState({ x: 0, y: 0 })");
      expect(result).toContain(
        "const config = { amount, scale, opacity, resolution: [width, height] };"
      );
    });

    it("strips typed callback parameters without touching object values", () => {
      const result = stripTypeScriptFromReactSource(`
const onMove = (event: MouseEvent<HTMLDivElement>) => {
  setPos({ x: event.clientX, y: event.clientY });
};
`);

      expect(result).toContain("const onMove = (event) =>");
      expect(result).toContain("setPos({ x: event.clientX, y: event.clientY })");
    });
  });
});
