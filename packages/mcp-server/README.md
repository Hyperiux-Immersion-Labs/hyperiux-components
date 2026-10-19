# hyperiux-mcp-server

[![Listed on mcpservers.org](https://mcpservers.org/badge.svg)](https://mcpservers.org/servers/hyperiux-immersion-labs/hyperiux-components)

An MCP (Model Context Protocol) server for the [Hyperiux Vault](https://vault.hyperiux.com) effect registry. Lets AI clients (Claude Code, Claude Desktop, Cursor, etc.) browse, search, and inspect React/Next.js interaction effects, and fetch installable source for effects they're entitled to.

## Install

Add to your MCP client's config (e.g. `claude_desktop_config.json` or Claude Code's `.mcp.json`):

```json
{
  "mcpServers": {
    "hyperiux": {
      "command": "npx",
      "args": ["-y", "hyperiux-mcp-server"]
    }
  }
}
```

## Signing in

Every effect's source needs a signed-in Hyperiux account - free effects too. This server reuses a token, checked in this order:

1. the `HYPERIUX_TOKEN` environment variable (generate one at `/cli-auth`), then
2. a `hyperiux login` session already saved by the [Hyperiux CLI](../cli) (`~/.hyperiux/auth.json`)

Without a token, `hyperiux_get_effect` with `include_source: true` returns the metadata (description, dependencies, changelog) and `sign_in_required`, telling you to run `npx hyperiux login`. Listing, searching and details lookups (`include_source: false`) need no token and never count as installs.

Fetching source counts against the account's daily install limit, shared with its website and CLI usage: 3 a day on Free, 5 on Pro, 10 on Pro+. Pro effects also need a Pro subscription; on a free account they return `source_locked`.

## Tools

- **`hyperiux_list_effects`** - browse/search the catalog by name substring and/or category, paginated. Each result includes its tier (free/pro).
- **`hyperiux_get_effect`** - full detail for one effect by exact slug: description, tier, dependencies, version, changelog, install command, and optionally full source.
- **`hyperiux_list_categories`** - every category with effect counts, for narrowing a `hyperiux_list_effects` search.

## Development

```bash
pnpm --filter hyperiux-mcp-server build   # tsc -> dist/
pnpm --filter hyperiux-mcp-server test    # vitest
pnpm --filter hyperiux-mcp-server lint    # eslint
pnpm --filter hyperiux-mcp-server dev     # tsx watch, for local iteration
```

Test against a running build with the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npx @modelcontextprotocol/inspector --cli node dist/index.js --method tools/list
npx @modelcontextprotocol/inspector --cli node dist/index.js --method tools/call --tool-name hyperiux_get_effect --tool-arg name=dotted-grid
```

## Known limitation

None of the tools return an effect's props yet - the registry has them, the tools just don't expose them today. `hyperiux_list_effects` reports each effect's tier but can't filter by it; count or filter the returned list yourself.
