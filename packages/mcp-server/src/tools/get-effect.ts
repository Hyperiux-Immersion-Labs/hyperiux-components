import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchEffect } from "../registry-client.js";
import { CHARACTER_LIMIT } from "../constants.js";
import { RegistryError } from "../types.js";

const GetEffectInputSchema = z
  .object({
    name: z
      .string()
      .min(1)
      .describe("Exact effect slug, e.g. 'dotted-grid', 'circle-text-reveal'. Get this from hyperiux_list_effects."),
    include_source: z
      .boolean()
      .default(false)
      .describe(
        "Include full component source in the response. Free-tier effects always include it; Pro-tier effects only include it if a Hyperiux token is available (HYPERIUX_TOKEN env var, or a saved `hyperiux login` session)."
      ),
  })
  .strict();

type GetEffectInput = z.infer<typeof GetEffectInputSchema>;

export function registerGetEffectTool(server: McpServer) {
  server.registerTool(
    "hyperiux_get_effect",
    {
      title: "Get Hyperiux Effect Details",
      description: `Get full details for one Hyperiux Vault effect by its exact slug - description, tier (free/pro), npm dependencies, version, changelog, and install instructions. Optionally includes full source code.

Args:
  - name (string): exact effect slug
  - include_source (boolean, default false): also return component source. Free effects: always available. Pro effects: only if authenticated (see below).

Returns JSON: { name, title, description, tier, version, dependencies, changelog, install_command, files: [{ path, content? }] }
  - changelog: array of { version, date, summary, breaking }, newest first
  - files[].content is omitted unless include_source=true AND the effect is accessible (free, or Pro with a valid token)

Pro effects without a token: the response still includes metadata (description, dependencies, changelog) but files have no content, and a note explains the effect requires a Hyperiux Pro account - don't treat this as an error, it's expected for unauthenticated Pro lookups.

Examples:
  - "What does the dotted-grid effect need?" -> name="dotted-grid" (dependencies field)
  - "Show me the code for circle-text-reveal" -> name="circle-text-reveal", include_source=true
  - Don't use when: you don't have an exact slug yet - use hyperiux_list_effects first.

Error Handling:
  - Returns "Effect '<name>' not found" if the slug doesn't exist - check hyperiux_list_effects for the correct spelling.`,
      inputSchema: GetEffectInputSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params: GetEffectInput) => {
      try {
        const effect = await fetchEffect(params.name);

        if (!effect) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Effect '${params.name}' not found. Use hyperiux_list_effects to find the correct slug.`,
              },
            ],
          };
        }

        const isPro = effect.tier === "pro" || effect.tier === "paid";
        const hasSource = effect.files.some((f) => typeof f.content === "string");
        const sourceLocked = isPro && !hasSource;

        const output = {
          name: effect.name,
          title: effect.title || effect.name,
          description: effect.description || "",
          tier: effect.tier,
          version: effect.version,
          dependencies: effect.dependencies,
          changelog: effect.changelog,
          install_command: `npx hyperiux add ${effect.name}`,
          files: effect.files.map((file) => ({
            path: file.path,
            ...(params.include_source && typeof file.content === "string"
              ? { content: file.content }
              : {}),
          })),
          ...(sourceLocked
            ? {
                source_locked: true,
                source_locked_reason:
                  "This is a Pro effect and no Hyperiux Pro token is available. Run `hyperiux login` in a terminal, or set HYPERIUX_TOKEN, to fetch its source.",
              }
            : {}),
        };

        let text = JSON.stringify(output, null, 2);
        if (text.length > CHARACTER_LIMIT) {
          text = JSON.stringify({ ...output, files: [], files_omitted: "response too large" }, null, 2);
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
