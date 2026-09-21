import fs from "node:fs";
import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")
) as { mcpName?: string; name: string; version: string };

const manifest = JSON.parse(
  fs.readFileSync(new URL("../server.json", import.meta.url), "utf8")
) as {
  name: string;
  version: string;
  packages: Array<{ identifier: string; version: string; transport: { type: string } }>;
};

describe("Official MCP Registry manifest", () => {
  it("stays aligned with the published package", () => {
    expect(packageJson.mcpName).toBe(manifest.name);
    expect(packageJson.version).toBe(manifest.version);
    expect(manifest.packages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          identifier: packageJson.name,
          version: packageJson.version,
          transport: { type: "stdio" },
        }),
      ])
    );
  });
});
