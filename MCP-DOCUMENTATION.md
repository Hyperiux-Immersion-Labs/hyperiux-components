# Hyperiux MCP Server

**Give your AI coding assistant live, accurate knowledge of the entire Hyperiux Vault effect catalog.**

`hyperiux-mcp-server` is an [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for [Hyperiux Vault](https://vault.hyperiux.com). It lets AI coding assistants — Claude, Cursor, and any other MCP-compatible client — browse, search, and inspect the full catalog of React/Next.js interaction effects, and get correct installation instructions for the ones you actually want to use.

---

## Overview

Hyperiux Vault ships over a hundred production-quality animation and interaction effects for Next.js, installed one at a time with the `hyperiux` CLI (`npx hyperiux add <effect>`). This MCP server sits alongside that CLI as a companion tool built for AI assistants specifically: instead of guessing at effect names, props, or dependencies from training data, your assistant can query this server directly and get back real, current answers — pulled live from the same registry the CLI itself uses.

You still talk to your AI assistant normally. This server just makes sure what it tells you about Hyperiux is true.

## Why it exists

Before this server existed, asking an AI assistant to "add a particle background effect using Hyperiux" meant it had to guess — invent a plausible-sounding effect name, guess at props, or simply tell you to go check the website. Both are unreliable the moment the catalog changes, and the first one can flatly invent things that were never real.

This server closes that gap with a live, read-only interface into the actual registry: real effect slugs, real dependencies, real version history, real tier information (free vs. Pro), and real install/import instructions — every time, not just whenever the assistant's training data happened to be current.

## Requirements

- Node.js 18 or later
- An MCP-compatible client: [Claude Code](https://claude.com/product/claude-code), [Claude Desktop](https://claude.ai/download), [Cursor](https://cursor.com), or any other client that supports the MCP standard
- No account or subscription required to use it for free effects. A [Hyperiux Pro](https://vault.hyperiux.com/pricing) subscription is only needed to retrieve Pro effect source code.

---

## Installation

Good news up front: getting connected takes a couple of minutes, there's nothing to build, and there's no machine-specific path to type in — `npx` handles fetching and running the server for you. Just pick your client below and follow along.

### Claude Code

This one's the easiest of all — a single command, no file editing required.

**1. Open a terminal in your project folder**, then run:
```bash
claude mcp add hyperiux -- npx -y hyperiux-mcp-server
```
That's the whole install. Claude Code writes the configuration for you behind the scenes — nothing to copy, nothing to paste.

**2. Start a new chat** (or reopen your project if Claude Code was already running). You'll see a one-time prompt asking you to approve this project's MCP server — go ahead and approve it.

**3. Confirm it's connected** by typing:
```
/mcp
```
You're looking for something like:
```
1 MCP server(s): 1 connected, 0 disconnected
```
with `hyperiux` listed. If you see that, you're done — skip straight to [Try it out](#try-it-out) below.

> **Prefer editing a config file by hand instead of running a command?** That works too. Create a file named `.mcp.json` at the root of your project — the same folder your `.git` folder lives in, not a subfolder — with this content:
> ```json
> {
>   "mcpServers": {
>     "hyperiux": {
>       "command": "npx",
>       "args": ["-y", "hyperiux-mcp-server"]
>     }
>   }
> }
> ```
> Then continue from step 2 above.

### Claude Desktop

Desktop doesn't have a one-command installer today, but it's still just one file to edit, and it only takes a minute.

**1. Open Claude Desktop**, then go to **Settings → Developer → Edit Config**. This opens your configuration file directly in your default text editor. (If you'd rather find it yourself, it lives at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, or `%APPDATA%\Claude\claude_desktop_config.json` on Windows.)

**2. Add the `hyperiux` entry** inside the `mcpServers` object. If the file already lists other servers, just add this one alongside them — don't delete anything else that's already there:
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

**3. Save the file.**

**4. Fully quit Claude Desktop** — not just close the window, actually quit it (Cmd+Q on macOS, or right-click the icon in your taskbar/menu bar and choose Quit). Claude Desktop only reads this config file when it starts up, so it won't notice the change otherwise.

**5. Reopen Claude Desktop**, then check **Settings → Developer → Local MCP servers** (or the Connectors panel). You're looking for `hyperiux` with a "running" or connected badge next to it.

### Cursor

**1. Open Cursor's settings** and find the MCP section (search "MCP" if you don't see it right away).

**2. Click "Add new MCP server"** and fill in three fields:
| Field | Value |
|---|---|
| Name | `hyperiux` |
| Command | `npx` |
| Args | `-y hyperiux-mcp-server` |

**3. Save**, then check the server list — `hyperiux` should show up as connected.

### Any other MCP-compatible client

Whatever client you're using, look for a place to add an MCP server with a `command` and `args`. The values you need are always the same:
- **Command**: `npx`
- **Args**: `-y hyperiux-mcp-server`

That's the entire configuration — no matter which client reads it, it's the exact same two values every time.

### Try it out

Once you're connected, here's a quick way to confirm everything's actually working — just ask your assistant, in plain language:

> *"What effect categories does Hyperiux Vault have?"*

You should get back a real, specific list (things like `scroll`, `webgl`, `cursor`, `text`, with counts for each) — not a vague or made-up-sounding answer. That's your sign the connection is live and pulling real data. From here, jump into the [Example usage](#example-usage) section below for more things to try.

### Cursor and other MCP clients

Any client that reads a standard `mcpServers` configuration block uses the same entry shown above. Consult your client's documentation for where that configuration file lives.

---

## Authentication and Pro effects

No setup is required to query metadata or source for any of the **free** effects in the catalog.

To retrieve source code for a **Pro** effect, the server needs a Hyperiux Pro CLI token. It automatically picks one up from either of these, in order:

1. A saved session from running `hyperiux login` (the same login the `hyperiux` CLI itself uses) — this is the recommended way, since it's a one-time setup done directly in your own terminal.
2. A `HYPERIUX_TOKEN` environment variable — useful for CI or scripted environments.

**Never share your token directly with an AI assistant in a chat.** Run `hyperiux login` yourself, in your own terminal, and let the server pick up the saved session automatically.

Without a valid token, Pro effect lookups still return full metadata — description, dependencies, version, changelog — just not the source code itself, along with a clear explanation of why. This is expected behavior for an unauthenticated Pro lookup, not an error.

---

## Available tools

The server exposes three tools. Any connected AI client can call these directly, or you can invoke them by asking your assistant a natural-language question.

### `hyperiux_list_effects`

Browse or search the catalog.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | No | Case-insensitive substring match against effect names |
| `category` | string | No | Filter to one category (e.g. `scroll`, `cursor`, `webgl`) |
| `limit` | number | No (default `30`, max `100`) | Maximum number of results |
| `offset` | number | No (default `0`) | Number of results to skip, for pagination |

**Returns:**
```json
{
  "total": 12,
  "count": 12,
  "offset": 0,
  "effects": [
    { "name": "dotted-grid", "category": "backgrounds", "categories": ["backgrounds"], "dependencies": [], "version": "1.1.1" }
  ],
  "has_more": false
}
```

> **Note:** this tool does not report tier (free vs. Pro) — use `hyperiux_get_effect` on a specific slug to check.

### `hyperiux_get_effect`

Full detail for one effect, by its exact slug.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Exact effect slug (get this from `hyperiux_list_effects` if you don't already know it) |
| `include_source` | boolean | No (default `false`) | Also return the component's source code |

**Returns:**
```json
{
  "name": "dotted-grid",
  "title": "Dotted Grid",
  "description": "Canvas 2D fullscreen dot grid that autonomously cycles through five geometric shapes...",
  "tier": "free",
  "version": "1.1.1",
  "dependencies": [],
  "changelog": [
    { "version": "1.1.1", "date": "2026-07-22", "summary": "Added a reduced-motion notice...", "breaking": false }
  ],
  "install_command": "npx hyperiux add dotted-grid",
  "preview_url": "/demo/dotted-grid",
  "import_path": "@/components/effects/dotted-grid",
  "target": "src/components/effects/dotted-grid",
  "main": "index.jsx",
  "import_statement": "import { DottedGrid } from \"@/components/effects/dotted-grid\";",
  "files": [
    { "path": "index.jsx" },
    { "path": "createSuspendedRaf.js" }
  ]
}
```

When `include_source: true` and you're entitled to the source (always true for free effects; for Pro effects, only with a valid token), each file in `files[]` also includes a `content` field with the full source.

If a Pro effect is requested without a valid token, the response includes `"source_locked": true` and a `source_locked_reason` explaining why — metadata is still returned in full.

### `hyperiux_list_categories`

Every category in the catalog, with effect counts, sorted largest first.

No parameters required.

**Returns:**
```json
{
  "categories": [
    { "category": "scroll", "count": 23 },
    { "category": "webgl", "count": 19 },
    { "category": "cursor", "count": 16 }
  ]
}
```

---

## Example usage

Once connected, just ask your assistant naturally:

- *"What effect categories does Hyperiux have?"*
- *"What cursor effects are available in Hyperiux Vault?"*
- *"Tell me everything about the dotted-grid effect — what does it depend on, and how do I import it after installing?"*
- *"Show me the source code for dotted-grid."*
- *"I want a WebGL hero effect for a landing page — what does Hyperiux have?"*

For actually installing an effect into your project, your assistant will use the information from this server to run the real install command via the `hyperiux` CLI (`npx hyperiux add <effect>`) — this server itself never writes files; it only answers questions.

---

## What this server does not do

- **It does not install effects.** Installing is handled entirely by the `hyperiux` CLI. This server's job is making sure the right effect, dependencies, and import path are known before that install happens.
- **It does not expose component props.** There is currently no structured props schema in the registry, so the server cannot yet answer "what props does this component accept?" in a reliable, structured way.
- **It does not currently report tier at the list level.** `hyperiux_list_effects` and `hyperiux_list_categories` cannot distinguish free from Pro effects — only `hyperiux_get_effect` on a specific slug can. Always verify tier before assuming an effect is installable without a Pro subscription.
- **It never returns Pro source without a valid, authenticated token.** There is no way to bypass this from a client — it's enforced by the same protected API the CLI itself uses.

---

## Troubleshooting

**`hyperiux` doesn't appear in your client's MCP server list at all**
Check that your configuration file is at the true root of your project — the same folder your `.git` directory lives in — not in a subfolder. MCP clients look for configuration at the project root only.

**It appears but shows as "not connected"**
Confirm Node.js is installed and available, and that you're using the latest published version. Try `npx -y hyperiux-mcp-server@latest` directly in a terminal — it should print `Hyperiux MCP server running via stdio` with no errors.

**Your assistant answers from its own knowledge instead of calling the tool**
Be explicit in your prompt that you want the live Hyperiux Vault catalog — e.g. *"use the hyperiux tool to look this up"* — rather than a bare question that could be read as being about your own local codebase.

---

## Versioning

This package follows [semantic versioning](https://semver.org). Tool input schemas are treated as a public contract — a parameter being renamed or removed is a breaking change and will be reflected in the version number accordingly.

## Support

- **Issues or bugs**: [github.com/Hyperiux-Immersion-Labs/hyperiux-components/issues](https://github.com/Hyperiux-Immersion-Labs/hyperiux-components/issues)
- **Questions and discussion**: [GitHub Discussions](https://github.com/Hyperiux-Immersion-Labs/hyperiux-components/discussions)
- **Browse the full effect catalog**: [vault.hyperiux.com/effects](https://vault.hyperiux.com/effects)
- **The `hyperiux` CLI**: [npmjs.com/package/hyperiux](https://www.npmjs.com/package/hyperiux)

## License

MIT.
