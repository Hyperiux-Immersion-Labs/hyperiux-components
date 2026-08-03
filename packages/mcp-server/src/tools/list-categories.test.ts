import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const { fetchRegistryIndexMock } = vi.hoisted(() => ({ fetchRegistryIndexMock: vi.fn() }));
vi.mock("../registry-client.js", () => ({ fetchRegistryIndex: fetchRegistryIndexMock }));

const { registerListCategoriesTool } = await import("./list-categories.js");

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

describe("hyperiux_list_categories", () => {
  let handler: ToolHandler;

  beforeEach(() => {
    fetchRegistryIndexMock.mockReset();
    const { server, handlers } = createMockServer();
    registerListCategoriesTool(server);
    handler = handlers.get("hyperiux_list_categories") as ToolHandler;
  });

  it("counts categories using the categories[] field when present, sorted by count descending", async () => {
    fetchRegistryIndexMock.mockResolvedValue({
      items: [
        { name: "a", category: "backgrounds", categories: ["backgrounds"] },
        { name: "b", category: "backgrounds", categories: ["backgrounds"] },
        { name: "c", category: "buttons", categories: ["buttons"] },
      ],
    });

    const output = parseOutput(await handler({}));

    expect(output.categories).toEqual([
      { category: "backgrounds", count: 2 },
      { category: "buttons", count: 1 },
    ]);
  });

  it("falls back to the singular category field when categories is missing or empty", async () => {
    fetchRegistryIndexMock.mockResolvedValue({
      items: [
        { name: "a", category: "webgl", categories: [] },
        { name: "b", category: "webgl" },
      ],
    });

    const output = parseOutput(await handler({}));

    expect(output.categories).toEqual([{ category: "webgl", count: 2 }]);
  });

  it("counts an effect under every category when it belongs to more than one", async () => {
    fetchRegistryIndexMock.mockResolvedValue({
      items: [{ name: "a", category: "text", categories: ["text", "components"] }],
    });

    const output = parseOutput(await handler({}));

    expect(output.categories).toEqual(
      expect.arrayContaining([
        { category: "text", count: 1 },
        { category: "components", count: 1 },
      ])
    );
  });
});
