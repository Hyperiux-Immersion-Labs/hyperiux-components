import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchEffect } from "../registry-client.js";
import { API_URL, CHARACTER_LIMIT } from "../constants.js";
import { RegistryError, type RegistryEffect } from "../types.js";

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

Returns JSON: { name, title, description, tier, version, dependencies, changelog, install_command, preview_url, import_path, target, main, import_statement, files: [{ path, content? }] }
  - changelog: array of { version, date, summary, breaking }, newest first
  - files[].content is omitted unless include_source=true AND the effect is accessible (free, or Pro with a valid token)
  - import_statement is the exact import line to use after installing (e.g. \`import { DottedGrid } from "@/components/effects/dotted-grid";\`), built from exportKind/exportName/import_path the same way the CLI's own \`hyperiux add\` output does - omitted if the registry entry has no import_path
  - install_limit/install_remaining: present on a normal (non-rate-limited) lookup, telling you how many more distinct effects this identity can fetch today - mention this to the user when remaining is low, same as the website's copy toast and the CLI's own "N of M daily installs left" line

Pro effects without a token: the response still includes metadata (description, dependencies, changelog) but files have no content, and a note explains the effect requires a Hyperiux Pro account - don't treat this as an error, it's expected for unauthenticated Pro lookups.

Free effects past the caller's daily install cap: the response still includes metadata but files have no content, and rate_limited/rate_limit_reason explain the daily limit and when to retry - also not an error, it's expected once the cap is hit.

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
        const rateLimited = Boolean(effect.rateLimited);

        const importStatement = buildImportStatement(effect);

        const output = {
          name: effect.name,
          title: effect.title || effect.name,
          description: effect.description || "",
          tier: effect.tier,
          version: effect.version,
          dependencies: effect.dependencies,
          changelog: effect.changelog,
          install_command: `npx hyperiux add ${effect.name}`,
          ...(effect.previewUrl ? { preview_url: effect.previewUrl } : {}),
          ...(effect.importPath ? { import_path: effect.importPath } : {}),
          ...(effect.target ? { target: effect.target } : {}),
          ...(effect.main ? { main: effect.main } : {}),
          ...(importStatement ? { import_statement: importStatement } : {}),
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
          ...(rateLimited
            ? {
                rate_limited: true,
                rate_limit_reason: buildRateLimitReason(effect),
              }
            : {}),
          // Only present on a genuine metered delivery (not the Pro-without-token
          // fallback, which never calls the metered route at all) - lets an
          // agent tell the user "N of M installs left today" the same way the
          // website's copy toast does.
          ...(!rateLimited && typeof effect.installLimit === "number"
            ? {
                install_limit: effect.installLimit,
                install_remaining: effect.installRemaining ?? null,
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

// Mirrors packages/cli/src/commands/add.js's own import-statement construction,
// so an agent's suggested import always matches what `hyperiux add` prints.
function buildImportStatement(effect: RegistryEffect): string | null {
  if (!effect.importPath || !effect.exportName) return null;

  return effect.exportKind === "default"
    ? `import ${effect.exportName} from "${effect.importPath}";`
    : `import { ${effect.exportName} } from "${effect.importPath}";`;
}

// Mirrors packages/cli/src/commands/add.js's rate-limit messaging, so an
// agent's explanation to the user matches what `hyperiux add` itself prints.
function buildRateLimitReason(effect: RegistryEffect): string {
  const limitText = effect.installLimit ? ` (${effect.installLimit}/day)` : "";
  return (
    `Daily install limit reached${limitText}. Try again in ${formatRetryAfter(effect.retryAfter)}, ` +
    `or upgrade for a higher limit at ${API_URL}/pricing. Effects already installed today are still free to re-fetch.`
  );
}

function formatRetryAfter(seconds: number | undefined): string {
  if (!seconds || seconds < 60) return "a few minutes";

  const hours = Math.ceil(seconds / 3600);
  if (hours < 1) return `${Math.ceil(seconds / 60)}m`;

  return `${hours}h`;
}

function formatError(error: unknown): string {
  if (error instanceof RegistryError) {
    return `Error: ${error.message}`;
  }
  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}
