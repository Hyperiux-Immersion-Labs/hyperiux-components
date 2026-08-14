# hyperiux-mcp-server

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

## Pro effect access

Pro effect source is only returned if a Hyperiux Pro token is available. This server automatically reuses a token from either:

- A `hyperiux login` session already saved by the [Hyperiux CLI](../cli) (`~/.hyperiux/auth.json`), or
- the `HYPERIUX_TOKEN` environment variable

Without a token, Pro effect lookups still return full metadata (description, dependencies, changelog) - just no source, with a clear note explaining why.

A token isn't Pro-only, though - any signed-in Hyperiux account (free or Pro) can
generate one at `/cli-auth`. Without a token, `hyperiux_get_effect` calls are
tracked as anonymous (1 effect/day, device+IP based); with a free account's
token they count against that account's real 3/day limit instead, shared with
its website and CLI usage. Pro raises it to 10/day and unlocks Pro source.

## Tools

- **`hyperiux_list_effects`** - browse/search the catalog by name substring and/or category, paginated. Does not include tier (free/pro) - the catalog index doesn't carry that field.
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

`hyperiux_list_effects` can't filter or report tier (free/pro) - the live `index.json` this reads from doesn't carry that field today (a pre-existing gap shared with the CLI's own `hyperiux list`, which silently shows every effect as "free" for the same reason). Use `hyperiux_get_effect` to check a specific effect's real tier before assuming it's installable without a Pro account.
