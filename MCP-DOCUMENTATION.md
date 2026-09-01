# Hyperiux MCP Server

**Give your AI coding assistant live, accurate knowledge of the entire Hyperiux Vault effect catalog.**

`hyperiux-mcp-server` is an [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for [Hyperiux Vault](https://vault.hyperiux.com). It lets AI coding assistants - Claude Code, Claude Desktop, Cursor, Codex CLI, Google Antigravity, and any other MCP-compatible client that supports local servers - browse, search, and inspect the full catalog of React/Next.js interaction effects, and get correct installation instructions for the ones you actually want to use.

---

## Overview

Hyperiux Vault ships over a hundred production-quality animation and interaction effects for Next.js, installed one at a time with the `hyperiux` CLI (`npx hyperiux add <effect>`). This MCP server sits alongside that CLI as a companion tool built for AI assistants specifically: instead of guessing at effect names, props, or dependencies from training data, your assistant can query this server directly and get back real, current answers - pulled live from the same registry the CLI itself uses.

You still talk to your AI assistant normally. This server just makes sure what it tells you about Hyperiux is true.

## Why it exists

Before this server existed, asking an AI assistant to "add a particle background effect using Hyperiux" meant it had to guess - invent a plausible-sounding effect name, guess at props, or simply tell you to go check the website. Both are unreliable the moment the catalog changes, and the first one can flatly invent things that were never real.

This server closes that gap with a live, read-only interface into the actual registry: real effect slugs, real dependencies, real version history, real tier information (free vs. Pro), and real install/import instructions - every time, not just whenever the assistant's training data happened to be current.

## Requirements

- Node.js 18 or later (Codex CLI itself additionally requires Node.js 22+)
- An MCP-compatible client that supports **local/stdio servers**: [Claude Code](https://claude.com/product/claude-code), [Claude Desktop](https://claude.ai/download), [Cursor](https://cursor.com), [Codex CLI](https://developers.openai.com/codex/mcp), [Google Antigravity](https://antigravity.google), or any other client that supports the MCP standard's local server transport. (The ChatGPT web app is a notable exception - see [ChatGPT (web app) - not currently supported](#chatgpt-web-app--not-currently-supported).)
- No account or subscription required to use it for free effects. A [Hyperiux Pro](https://vault.hyperiux.com/pricing) subscription is only needed to retrieve Pro effect source code.

---

## Installation

Good news up front: getting connected takes a couple of minutes, there's nothing to build, and there's no machine-specific path to type in - `npx` handles fetching and running the server for you. Every client below works the same underlying way (it runs `npx -y hyperiux-mcp-server` as a local process and talks to it over stdio) - only the setup steps differ. Pick your client and follow along.

For each client, there are two ways in: a **direct command** that writes the config for you automatically (fastest, recommended), or **copying a JSON/TOML block by hand** into a config file (works everywhere, no extra install needed). Both end up in exactly the same place.

### Claude Code

**Option A - direct command (fastest, no file editing, personal config):**

First, check whether the Claude Code CLI is already installed permanently on your machine:
```bash
claude --version
```

- **If that prints a version** → the CLI is installed, use `claude` directly:
  ```bash
  claude mcp add hyperiux -- npx -y hyperiux-mcp-server
  ```
- **If it says `command not found: claude`** → it isn't installed permanently. You have two options:
  - Run it through `npx` instead, with no install at all - this works immediately, but only for that one command (you'd retype the `npx @anthropic-ai/claude-code` prefix every time you want to use the `claude` CLI for anything else, since running something via `npx` doesn't add it to your PATH permanently):
    ```bash
    npx @anthropic-ai/claude-code mcp add hyperiux -- npx -y hyperiux-mcp-server
    ```
  - Or install it permanently first, so plain `claude` works from then on:
    ```bash
    npm install -g @anthropic-ai/claude-code
    claude mcp add hyperiux -- npx -y hyperiux-mcp-server
    ```

By default this adds the server to your personal, private config (`~/.claude.json`, scoped to just this project) - it works immediately, but isn't shared if you commit this project to git. If you want a **shareable** config that anyone who clones the repo gets automatically, add `--scope project` (note: `--scope` only accepts the fixed values `local`, `user`, or `project` - it's not a place to type your project's name or path, Claude Code already knows which project you're in from your current folder):
```bash
claude mcp add hyperiux --scope project -- npx -y hyperiux-mcp-server
```
This writes an actual `.mcp.json` file into your project root instead.

**Option B - copy the file by hand:**

Create a file named `.mcp.json` at the true root of your project - the same folder your `.git` folder lives in, not a subfolder - with this content:
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

**Then, either way:**

1. Start a new chat (or reopen your project if Claude Code was already running). You'll see a one-time prompt asking you to approve this project's MCP server - approve it.
2. Confirm it's connected by typing `/mcp`. You're looking for something like `1 MCP server(s): 1 connected, 0 disconnected` with `hyperiux` listed.
3. Test it - see [Try it out](#try-it-out) below.

### Claude Desktop

Desktop doesn't have a one-command installer - it's copy-the-file only, but it's still just one file and takes a minute.

**1. Open Claude Desktop**, then go to **Settings → Developer → Edit Config**. This opens your configuration file directly in your default text editor. (If you'd rather find it yourself: `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, or `%APPDATA%\Claude\claude_desktop_config.json` on Windows.)

**2. Add the `hyperiux` entry** inside the `mcpServers` object. If the file already lists other servers, add this one alongside them - don't delete anything else that's already there:
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

**4. Fully quit Claude Desktop** - not just close the window, actually quit it (Cmd+Q on macOS, or right-click the icon in your taskbar/menu bar and choose Quit). Claude Desktop only reads this config file when it starts up, so it won't notice the change otherwise.

**5. Reopen Claude Desktop**, then check **Settings → Developer → Local MCP servers** (or the Connectors panel). You're looking for `hyperiux` with a "running" or connected badge next to it.

**6.** Test it - see [Try it out](#try-it-out) below.

### Cursor

**Option A - through Settings UI:**

1. Open Cursor's Settings and find the MCP section (search "MCP" if you don't see it right away).
2. Click "Add new MCP server" and fill in three fields:

| Field | Value |
|---|---|
| Name | `hyperiux` |
| Command | `npx` |
| Args | `-y hyperiux-mcp-server` |

3. Save.

**Option B - copy the file by hand:**

Create `.cursor/mcp.json` inside your project (available only in that project), or `~/.cursor/mcp.json` in your home folder (available in every project you open in Cursor):
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

**Then, either way:** go to Cursor **Settings → Tools & MCP**, confirm `hyperiux` shows as connected, and enable it if it isn't already. Test it - see [Try it out](#try-it-out) below.

### Codex CLI

This is OpenAI's terminal coding agent (`codex` - a different product from the ChatGPT web app; see the note on ChatGPT below). Requires Node.js 22+ for Codex CLI itself.

**Option A - direct command (fastest, no file editing, personal config):**

First, check whether Codex CLI is already installed permanently:
```bash
codex --version
```

- **If that prints a version** → use `codex` directly:
  ```bash
  codex mcp add hyperiux -- npx -y hyperiux-mcp-server
  ```
- **If it says `command not found: codex`** → it isn't installed permanently yet. You have two options:
  - Run it through `npx` instead, with no install at all - works immediately, but only for that one command (running something via `npx` doesn't add it to your PATH permanently, so you'd retype the `npx @openai/codex` prefix every time). **Make sure you use the scoped package name** `@openai/codex`, not the plain `codex` package (that's an unrelated, unofficial package from 2012 with no connection to OpenAI):
    ```bash
    npx @openai/codex mcp add hyperiux -- npx -y hyperiux-mcp-server
    ```
  - Or install it permanently first, so plain `codex` works from then on:
    ```bash
    npm install -g @openai/codex
    codex auth
    codex mcp add hyperiux -- npx -y hyperiux-mcp-server
    ```

This writes to Codex's own config, not to a repo-shareable project file. Unlike Claude Code, `codex mcp add` does **not** currently have a `--scope project` flag that writes `.codex/config.toml` for you.

**Option B - project-shareable config (Codex's equivalent of Claude's `--scope project`):**

From the root of the project you want to share the MCP config with, run:
```bash
mkdir -p .codex
cat > .codex/config.toml <<'EOF'
[mcp_servers.hyperiux]
command = "npx"
args = ["-y", "hyperiux-mcp-server"]
EOF
```

This creates:
```text
.codex/config.toml
```

Commit that file if you want teammates or future clones of the repo to get the same Codex MCP setup.

**Option C - copy the file by hand:**

Add this to `~/.codex/config.toml` (applies to every project) or `.codex/config.toml` in your project folder (applies to just that project - the folder needs to be marked "trusted" the first time Codex opens it):
```toml
[mcp_servers.hyperiux]
command = "npx"
args = ["-y", "hyperiux-mcp-server"]
```

**Then, either way:**

1. Run `codex mcp list` to confirm `hyperiux` is registered.
2. Start a session with `codex` in your project, then type `/mcp` to confirm it's connected.
3. Test it - see [Try it out](#try-it-out) below.

> **Known Codex-specific quirk**: if you're using the **Codex VS Code extension** rather than the plain terminal `codex` command, there's a currently-open OpenAI bug where servers configured this way don't always show up in the extension even though they work fine in the CLI. If that happens, it's a Codex-side issue, not something wrong with your `hyperiux` setup - try the plain terminal `codex` command to confirm the server itself is fine.
>
> Also, don't be alarmed if `/mcp` reports something like *"no MCP resources or resource templates are currently exposed"* - that's expected and not an error. `hyperiux-mcp-server` only exposes **tools** (the three described below), not a separate MCP feature called *resources*. That message is accurate, not a sign anything's broken - the real test is whether the tools work, covered next.

### Google Antigravity

Google's agentic IDE (built around Gemini). It supports local stdio MCP servers using the same `command`/`args` shape as every other client here - there's no separate CLI-driven auto-add command documented for it (unlike `claude mcp add`/`codex mcp add`), so this is copy-the-file only for now.

**1. Open a project folder in Antigravity first**, then open **Settings → Customizations**. Don't use the curated **Add MCP Servers** list for Hyperiux - that screen only shows pre-listed/marketplace servers. For a custom local MCP server, go back to the main **Customizations** screen and click **Open MCP Config** under **Installed MCP Servers**. This opens the config file directly for editing.

If clicking **Open MCP Config** shows **"MCP Configuration Error: No workspace window available"**, Antigravity is in Settings without an active workspace. Open your actual project folder with **File → Open Folder...**, then return to **Settings → Customizations → Open MCP Config**. If the button still does nothing, skip the UI and create the config file by hand at `.agents/mcp_config.json` inside that project folder.

**2. Add the `hyperiux` entry.** If you want a command instead of editing JSON by hand, run this from the project folder you opened in Antigravity:
```bash
mkdir -p .agents
node -e 'const fs=require("fs"); const file=".agents/mcp_config.json"; const config=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,"utf8")):{}; config.mcpServers ||= {}; config.mcpServers.hyperiux={command:"/usr/local/bin/node",args:["/Users/harshgoyal/Documents/GitHub/hyperiux-components/packages/mcp-server/dist/index.js"]}; fs.writeFileSync(file, JSON.stringify(config,null,2)+"\n");'
```

For a global Antigravity config that applies to every project, run:
```bash
mkdir -p ~/.gemini/config
node -e 'const fs=require("fs"); const os=require("os"); const file=os.homedir()+"/.gemini/config/mcp_config.json"; const config=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,"utf8")):{}; config.mcpServers ||= {}; config.mcpServers.hyperiux={command:"/usr/local/bin/node",args:["/Users/harshgoyal/Documents/GitHub/hyperiux-components/packages/mcp-server/dist/index.js"]}; fs.writeFileSync(file, JSON.stringify(config,null,2)+"\n");'
```

If you're editing by hand instead, add this inside the `mcpServers` object:
```json
{
  "mcpServers": {
    "hyperiux": {
      "command": "/usr/local/bin/node",
      "args": [
        "/Users/harshgoyal/Documents/GitHub/hyperiux-components/packages/mcp-server/dist/index.js"
      ]
    }
  }
}
```

If you'd rather find the file yourself instead of going through Settings, it lives at one of two locations depending on whether you want it everywhere or just one project:
- **Global** (every project): `~/.gemini/config/mcp_config.json`
- **Workspace-level** (just this project): `.agents/mcp_config.json` in your project folder

**3. Save the file**, then restart Antigravity if it doesn't pick up the change automatically.

**4. Test it** - see [Try it out](#try-it-out) below. (Antigravity's exact connected/disconnected indicator isn't fully documented publicly as of this writing, so the natural-language test is the most reliable way to confirm it's working.)

### ChatGPT (web app) - not currently supported

Worth being upfront about this rather than letting you find out the hard way: **ChatGPT (the consumer web app) cannot connect to `hyperiux-mcp-server` as it exists today.** ChatGPT's connector system only supports *remote* MCP servers reachable over HTTPS (Streamable HTTP or SSE) - it does not support *local* servers launched via a command like `npx`, which is how this server runs. This is a fundamental architecture difference, not a configuration issue on your end, and applies to essentially every local/stdio MCP server, not just this one. (Note: this is separate from **Codex CLI**, OpenAI's terminal coding agent, which - as shown above - does support local stdio servers just fine.)

### Any other MCP-compatible client

Whatever client you're using, look for a place to add an MCP server with a `command` and `args` (sometimes labeled `run`/`start` instead of `command`). The values you need are always the same:
- **Command**: `npx`
- **Args**: `-y hyperiux-mcp-server`

That's the entire configuration - no matter which client reads it, it's the exact same two values every time. If your client only supports *remote* HTTP-based servers rather than local ones, see the ChatGPT note above - the same limitation applies.

### Try it out

Once you're connected, here's a quick way to confirm everything's actually working - just ask your assistant, in plain language:

> *"What effect categories does Hyperiux Vault have?"*

You should get back a real, specific list (things like `scroll`, `webgl`, `cursor`, `text`, with counts for each) - not a vague or made-up-sounding answer. That's your sign the connection is live and pulling real data. From here, jump into the [Example usage](#example-usage) section below for more things to try.

---

## Authentication and Pro effects

No setup is required to query metadata or source for any of the **free** effects in the catalog.

To retrieve source code for a **Pro** effect, the server needs a Hyperiux Pro CLI token. It automatically picks one up from either of these, in order:

1. A saved session from running `hyperiux login` (the same login the `hyperiux` CLI itself uses) - this is the recommended way, since it's a one-time setup done directly in your own terminal.
2. A `HYPERIUX_TOKEN` environment variable - useful for CI or scripted environments.

**Never share your token directly with an AI assistant in a chat.** Run `hyperiux login` yourself, in your own terminal, and let the server pick up the saved session automatically.

Without a valid token, Pro effect lookups still return full metadata - description, dependencies, version, changelog - just not the source code itself, along with a clear explanation of why. This is expected behavior for an unauthenticated Pro lookup, not an error.

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

> **Note:** this tool does not report tier (free vs. Pro) - use `hyperiux_get_effect` on a specific slug to check.

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

If a Pro effect is requested without a valid token, the response includes `"source_locked": true` and a `source_locked_reason` explaining why - metadata is still returned in full.

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
- *"Tell me everything about the dotted-grid effect - what does it depend on, and how do I import it after installing?"*
- *"Show me the source code for dotted-grid."*
- *"I want a WebGL hero effect for a landing page - what does Hyperiux have?"*

For actually installing an effect into your project, your assistant will use the information from this server to run the real install command via the `hyperiux` CLI (`npx hyperiux add <effect>`) - this server itself never writes files; it only answers questions.

---

## What this server does not do

- **It does not install effects.** Installing is handled entirely by the `hyperiux` CLI. This server's job is making sure the right effect, dependencies, and import path are known before that install happens.
- **It does not expose component props.** There is currently no structured props schema in the registry, so the server cannot yet answer "what props does this component accept?" in a reliable, structured way.
- **It does not currently report tier at the list level.** `hyperiux_list_effects` and `hyperiux_list_categories` cannot distinguish free from Pro effects - only `hyperiux_get_effect` on a specific slug can. Always verify tier before assuming an effect is installable without a Pro subscription.
- **It never returns Pro source without a valid, authenticated token.** There is no way to bypass this from a client - it's enforced by the same protected API the CLI itself uses.

---

## Troubleshooting

### `hyperiux` doesn't appear in your client's MCP server list at all

This is almost always one of two causes - check both:

1. **Wrong folder.** Config files have to sit at the *true* root of whatever project your client opened - not a subfolder, and not one level up either. If you opened a folder called `my-app` that contains your real project nested inside, e.g. `my-app/frontend`, the config needs to be at `my-app/.mcp.json` (or wherever your client's config lives), matching exactly where your `.git` folder is - not inside `frontend/`. When in doubt, run `git rev-parse --show-toplevel` in your project to find the true root.
2. **Placeholder text left in the file.** If you're editing a config file by hand and it still contains literal text like `/absolute/path/to/node` or an obviously fake example path - that's illustration text, not a real value, and needs to be replaced or (for this server) removed entirely, since `command: "npx"` doesn't need any machine-specific path at all.

### It appears but shows as "not connected"

- Confirm Node.js is installed and on your PATH: run `node --version` in the same terminal/environment your client uses.
- Try the exact command directly in a terminal - it should print `Hyperiux MCP server running via stdio` with no errors:
  ```bash
  npx -y hyperiux-mcp-server
  ```
  (Ctrl+C to stop it - it's meant to talk to a client, not sit and wait for you to type at it, so hanging there silently after that message is normal, not a bug.)
- If it works in a terminal but a **GUI app** (like Claude Desktop) still shows it as disconnected, this is often a PATH issue - GUI apps don't always inherit your shell's PATH the way a terminal does. Try using the full absolute path to `node` (find it with `which node`) as the `command` instead of a bare `"npx"`, e.g. `"command": "/usr/local/bin/node"` won't directly work for an `npx`-based setup, but confirms whether Node itself is reachable - if this is a persistent issue, check your client's own docs for how it resolves `PATH`.
- Start a **completely fresh chat/session** after editing any config file. A session that was already open when you made the change can hang onto stale server state and won't notice the edit.

### Your assistant answers from its own knowledge instead of calling the tool

Be explicit in your prompt that you want the live Hyperiux Vault catalog, not your local codebase - e.g. *"use the hyperiux MCP tool to look this up in the Hyperiux Vault catalog"* rather than a bare *"tell me about X"*, which can easily be read as "search my own project files for X."

### `claude` / `codex` command not found in your terminal

This means the CLI binary isn't installed permanently, or isn't on your PATH - separate from having the Claude Code or Codex *extension* installed in your editor, and separate from having run it via `npx` before (running something via `npx` doesn't add it to your PATH permanently - see the "Option A" step-by-step under [Claude Code](#claude-code) or [Codex CLI](#codex-cli) above for the full check-first-then-choose flow). The short version - run it through `npx` instead, no install required:
```bash
npx @anthropic-ai/claude-code mcp add hyperiux -- npx -y hyperiux-mcp-server
npx @openai/codex mcp add hyperiux -- npx -y hyperiux-mcp-server
```
Or install permanently so the plain `claude`/`codex` command works from then on:
```bash
npm install -g @anthropic-ai/claude-code   # or: npm install -g @openai/codex
```
**Double-check the package names carefully** - `@anthropic-ai/claude-code` and `@openai/codex` are the correct, official, scoped packages. Unscoped names like plain `claude-code` or plain `codex` on npm are unrelated, unofficial packages and will not work.

### (Codex) `/mcp` says "no MCP resources or resource templates are currently exposed"

This is expected, not an error. `hyperiux-mcp-server` only implements MCP **tools**, not the separate **resources** feature - so a resources-specific check correctly finds none. It says nothing about whether the tools themselves work. Test with an actual question instead (see [Try it out](#try-it-out)).

### (Codex VS Code extension specifically) server works in the CLI but not the extension

This is a known, currently-open bug in the Codex VS Code extension itself (not specific to this server) - servers configured via `codex mcp add` or `config.toml` sometimes don't get picked up there even though `codex mcp list` and the plain terminal `codex` command show them working correctly. If you hit this, confirm the server works via the terminal first to rule out a `hyperiux`-specific problem, then treat it as a Codex extension issue.

### Trying to connect from ChatGPT (the web app)

This won't work, and isn't fixable via configuration - see [ChatGPT (web app) - not currently supported](#chatgpt-web-app--not-currently-supported) above for why.

---

## Versioning

This package follows [semantic versioning](https://semver.org). Tool input schemas are treated as a public contract - a parameter being renamed or removed is a breaking change and will be reflected in the version number accordingly.

## Support

- **Issues or bugs**: [github.com/Hyperiux-Immersion-Labs/hyperiux-components/issues](https://github.com/Hyperiux-Immersion-Labs/hyperiux-components/issues)
- **Questions and discussion**: [GitHub Discussions](https://github.com/Hyperiux-Immersion-Labs/hyperiux-components/discussions)
- **Browse the full effect catalog**: [vault.hyperiux.com/effects](https://vault.hyperiux.com/effects)
- **The `hyperiux` CLI**: [npmjs.com/package/hyperiux](https://www.npmjs.com/package/hyperiux)

## License

MIT.
