import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchRegistryIndex } from "../registry-client.js";
import { CHARACTER_LIMIT } from "../constants.js";
import { RegistryError } from "../types.js";

const ListEffectsInputSchema = z
  .object({
    query: z
      .string()
      .max(200)
      .optional()
      .describe(
        "Case-insensitive substring match against effect name (e.g. 'cursor', 'text-reveal'). Omit to list all."
      ),
    category: z
      .string()
      .optional()
      .describe(
        "Filter to one category, e.g. 'text', 'cursor', 'webgl', 'buttons', 'carousels', 'components', 'navigation', 'backgrounds', 'loaders', 'transitions'. Use hyperiux_list_categories to see all valid values with counts."
      ),
    limit: z.number().int().min(1).max(100).default(30).describe("Maximum results to return."),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip for pagination."),
  })
  .strict();

type ListEffectsInput = z.infer<typeof ListEffectsInputSchema>;

export function registerListEffectsTool(server: McpServer) {
  server.registerTool(
    "hyperiux_list_effects",
    {
      title: "List Hyperiux Vault Effects",
      description: `Browse or search the Hyperiux Vault catalog of React/Next.js interaction effects (scroll systems, cursor trails, WebGL scenes, animated buttons, page transitions, etc).

Does NOT return which effects are Pro vs Free - the catalog index this reads from doesn't carry that field today. Use hyperiux_get_effect on a specific slug to check its tier before assuming it's installable without a Hyperiux Pro account.

Args:
  - query (string, optional): substring match against effect name
  - category (string, optional): filter to one category slug
  - limit (number, default 30, max 100)
  - offset (number, default 0)

Returns JSON: { total, count, offset, effects: [{ name, category, categories, dependencies, version }], has_more, next_offset? }

Examples:
  - "What cursor effects are available?" -> category="cursor"
  - "Is there anything with 'particles' in the name?" -> query="particles"
  - Don't use when: you need one effect's full description/props/tier - use hyperiux_get_effect instead.`,
      inputSchema: ListEffectsInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params: ListEffectsInput) => {
      try {
        const index = await fetchRegistryIndex();
        const query = params.query?.trim().toLowerCase();

        let matches = index.items;
        if (params.category) {
          const category = params.category.trim().toLowerCase();
          matches = matches.filter((item) =>
            (item.categories || [item.category]).some((c) => c?.toLowerCase() === category)
          );
        }
        if (query) {
          matches = matches.filter((item) => item.name.toLowerCase().includes(query));
        }

        const total = matches.length;
        const page = matches.slice(params.offset, params.offset + params.limit);
        const hasMore = total > params.offset + page.length;

        const output = {
          total,
          count: page.length,
          offset: params.offset,
          effects: page.map((item) => ({
            name: item.name,
            category: item.category,
            categories: item.categories,
            dependencies: item.dependencies,
            version: item.version,
          })),
          has_more: hasMore,
          ...(hasMore ? { next_offset: params.offset + page.length } : {}),
        };

        let text = JSON.stringify(output, null, 2);
        if (text.length > CHARACTER_LIMIT) {
          text = JSON.stringify(
            { ...output, effects: output.effects.slice(0, Math.max(1, output.effects.length / 2)), truncated: true },
            null,
            2
          );
        }

        return {
          content: [{ type: "text" as const, text }],
          structuredContent: output,
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: formatError(error) }],
        };
      }
    }
  );
}

function formatError(error: unknown): string {
  if (error instanceof RegistryError) {
    return `Error: ${error.message}`;
  }
  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}
