import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RegistryEffect } from "../types.js";

const { fetchEffectMock } = vi.hoisted(() => ({ fetchEffectMock: vi.fn() }));
vi.mock("../registry-client.js", () => ({ fetchEffect: fetchEffectMock }));

const { registerGetEffectTool } = await import("./get-effect.js");

interface ToolResult {
  content: Array<{ type: string; text: string }>;
  structuredContent?: Record<string, unknown>;
}

type ToolHandler = (params: Record<string, unknown>) => Promise<ToolResult>;

function createMockServer() {
  const handlers = new Map<string, ToolHandler>();
  const server = {
    registerTool: (name: string, _config: unknown, handler: ToolHandler) => {
      handlers.set(name, handler);
    },
  } as unknown as McpServer;
  return { server, handlers };
}

function baseEffect(overrides: Partial<RegistryEffect> = {}): RegistryEffect {
  return {
    name: "dotted-grid",
    type: "registry:component",
    title: "Dotted Grid",
    description: "A dotted grid background.",
    dependencies: [],
    registryDependencies: [],
    exportName: "DottedGrid",
    exportKind: "named",
    tier: "free",
    version: "1.1.1",
    changelog: [],
    files: [{ path: "index.jsx", content: "export function DottedGrid() {}" }],
    previewUrl: "/demo/dotted-grid",
    importPath: "@/components/effects/dotted-grid",
    target: "src/components/effects/dotted-grid",
    main: "index.jsx",
    ...overrides,
  };
}

// Parsing the tool's own text output (rather than relying only on
// structuredContent) exercises what an MCP client actually reads off the wire.
function parseOutput(result: ToolResult) {
  return JSON.parse(result.content[0].text);
}

describe("hyperiux_get_effect", () => {
  let handler: ToolHandler;

  beforeEach(() => {
    fetchEffectMock.mockReset();
    const { server, handlers } = createMockServer();
    registerGetEffectTool(server);
    handler = handlers.get("hyperiux_get_effect") as ToolHandler;
  });

  it("returns registry metadata fields not previously surfaced", async () => {
    fetchEffectMock.mockResolvedValue(baseEffect());

    const output = parseOutput(await handler({ name: "dotted-grid", include_source: false }));

    expect(output).toMatchObject({
      name: "dotted-grid",
      preview_url: "/demo/dotted-grid",
      import_path: "@/components/effects/dotted-grid",
      target: "src/components/effects/dotted-grid",
      main: "index.jsx",
    });
  });

  it("builds a default-export import statement", async () => {
    fetchEffectMock.mockResolvedValue(baseEffect({ exportKind: "default", exportName: "DottedGrid" }));

    const output = parseOutput(await handler({ name: "dotted-grid", include_source: false }));

    expect(output.import_statement).toBe('import DottedGrid from "@/components/effects/dotted-grid";');
  });

  it("builds a named-export import statement", async () => {
    fetchEffectMock.mockResolvedValue(baseEffect({ exportKind: "named", exportName: "DottedGrid" }));

    const output = parseOutput(await handler({ name: "dotted-grid", include_source: false }));

    expect(output.import_statement).toBe('import { DottedGrid } from "@/components/effects/dotted-grid";');
  });

  it("omits import_statement when the registry entry has no import_path", async () => {
    fetchEffectMock.mockResolvedValue(baseEffect({ importPath: undefined }));

    const output = parseOutput(await handler({ name: "dotted-grid", include_source: false }));

    expect(output.import_statement).toBeUndefined();
  });

  it("does not include file content unless include_source is true", async () => {
    fetchEffectMock.mockResolvedValue(baseEffect());

    const output = parseOutput(await handler({ name: "dotted-grid", include_source: false }));

    expect(output.files).toEqual([{ path: "index.jsx" }]);
  });

  it("includes file content when include_source is true and source is available", async () => {
    fetchEffectMock.mockResolvedValue(baseEffect());

    const output = parseOutput(await handler({ name: "dotted-grid", include_source: true }));

    expect(output.files[0]).toMatchObject({ path: "index.jsx", content: "export function DottedGrid() {}" });
  });

  it("keeps Pro source locked when unauthenticated, even with include_source=true", async () => {
    fetchEffectMock.mockResolvedValue(
      baseEffect({
        name: "spotlight-text",
        tier: "pro",
        files: [{ path: "index.jsx" }], // no content - fetchEffect already stripped it upstream
      })
    );

    const output = parseOutput(await handler({ name: "spotlight-text", include_source: true }));

    expect(output.source_locked).toBe(true);
    expect(output.source_locked_reason).toMatch(/Pro/);
    expect(output.files).toEqual([{ path: "index.jsx" }]);
    expect(JSON.stringify(output)).not.toContain("content");
  });

  it("returns a not-found message for an unknown slug", async () => {
    fetchEffectMock.mockResolvedValue(null);

    const result = await handler({ name: "does-not-exist", include_source: false });

    expect(result.content[0].text).toMatch(/not found/);
    expect(result.structuredContent).toBeUndefined();
  });
});
