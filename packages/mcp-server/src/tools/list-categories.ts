import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchRegistryIndex } from "../registry-client.js";
import { RegistryError } from "../types.js";

const ListCategoriesInputSchema = z.object({}).strict();

export function registerListCategoriesTool(server: McpServer) {
  server.registerTool(
    "hyperiux_list_categories",
    {
      title: "List Hyperiux Effect Categories",
      description: `List every effect category in the Hyperiux Vault catalog with how many effects are in each - useful before calling hyperiux_list_effects with a category filter, to confirm the exact category slug and see relative size.

Returns JSON: { categories: [{ category, count }] }, sorted by count descending.

Examples:
  - "What kinds of effects does Hyperiux have?" -> call with no args
  - Don't use when: you already know the category slug and just want its effects - call hyperiux_list_effects directly.`,
      inputSchema: ListCategoriesInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async () => {
      try {
        const index = await fetchRegistryIndex();
        const counts = new Map<string, number>();

        for (const item of index.items) {
          for (const category of item.categories?.length ? item.categories : [item.category]) {
            if (!category) continue;
            counts.set(category, (counts.get(category) || 0) + 1);
          }
        }

        const categories = [...counts.entries()]
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count);

        const output = { categories };

        return {
          content: [{ type: "text" as const, text: JSON.stringify(output, null, 2) }],
          structuredContent: output,
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text:
                error instanceof RegistryError
                  ? `Error: ${error.message}`
                  : `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );
}
