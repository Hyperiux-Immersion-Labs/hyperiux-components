import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const { fetchRegistryIndexMock } = vi.hoisted(() => ({ fetchRegistryIndexMock: vi.fn() }));
vi.mock("../registry-client.js", () => ({ fetchRegistryIndex: fetchRegistryIndexMock }));

const { registerListEffectsTool } = await import("./list-effects.js");

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

function parseOutput(result: ToolResult) {
  return JSON.parse(result.content[0].text);
}

const sampleItems = [
  { name: "dotted-grid", category: "backgrounds", categories: ["backgrounds"], dependencies: [], version: "1.1.1" },
  { name: "spider-particles", category: "backgrounds", categories: ["backgrounds"], dependencies: [], version: "1.0.0" },
  { name: "arrow-fill-button", category: "buttons", categories: ["buttons"], dependencies: [], version: "1.0.0" },
  { name: "link-button", category: "buttons", categories: ["buttons"], dependencies: [], version: "1.0.0" },
  { name: "zoom-slider", category: "carousels", categories: ["carousels"], dependencies: ["gsap"], version: "1.0.0" },
];

describe("hyperiux_list_effects", () => {
  let handler: ToolHandler;

  beforeEach(() => {
    fetchRegistryIndexMock.mockReset();
    fetchRegistryIndexMock.mockResolvedValue({ items: sampleItems });
    const { server, handlers } = createMockServer();
    registerListEffectsTool(server);
    handler = handlers.get("hyperiux_list_effects") as ToolHandler;
  });

  it("filters by a case-insensitive name substring", async () => {
    const output = parseOutput(await handler({ query: "GRID", limit: 30, offset: 0 }));

    expect(output.effects.map((e: { name: string }) => e.name)).toEqual(["dotted-grid"]);
    expect(output.total).toBe(1);
  });

  it("filters by category", async () => {
    const output = parseOutput(await handler({ category: "buttons", limit: 30, offset: 0 }));

    expect(output.total).toBe(2);
    expect(output.effects.map((e: { name: string }) => e.name).sort()).toEqual([
      "arrow-fill-button",
      "link-button",
    ]);
  });

  it("combines query and category filters", async () => {
    const output = parseOutput(await handler({ query: "arrow", category: "buttons", limit: 30, offset: 0 }));

    expect(output.effects.map((e: { name: string }) => e.name)).toEqual(["arrow-fill-button"]);
  });

  it("paginates and reports has_more/next_offset", async () => {
    const firstPage = parseOutput(await handler({ limit: 2, offset: 0 }));

    expect(firstPage).toMatchObject({ total: 5, count: 2, offset: 0, has_more: true, next_offset: 2 });

    const secondPage = parseOutput(await handler({ limit: 2, offset: 2 }));

    expect(secondPage).toMatchObject({ total: 5, count: 2, offset: 2, has_more: true, next_offset: 4 });
  });

  it("omits next_offset once the last page is reached", async () => {
    const output = parseOutput(await handler({ limit: 30, offset: 0 }));

    expect(output.has_more).toBe(false);
    expect(output.next_offset).toBeUndefined();
  });
});
