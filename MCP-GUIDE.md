# Hyperiux MCP Server — The Friendly Guide

This is the plain-English version of "what is this thing, what can it do, how do I run it, and what could we build next." If you want the deep technical gap-analysis instead, see [mcp-server-plan.md](mcp-server-plan.md). This doc is for actually *using* it.

---

## What is this, in one paragraph?

`packages/mcp-server` is a small local server that speaks [MCP (Model Context Protocol)](https://modelcontextprotocol.io). Once you point an AI tool (Claude Code, Claude Desktop, Cursor, etc.) at it, that AI can ask it questions like "what effects does Hyperiux Vault have?" or "tell me everything about dotted-grid" and get back real, accurate answers pulled straight from the live registry — instead of guessing, hallucinating a slug that doesn't exist, or making up props that aren't real.

**It is a librarian, not a builder.** It answers questions about the catalog. It does not write files into your project — that's still the `hyperiux` CLI's job (`npx hyperiux add <effect>`).

---

## What it CAN do today

- **List effects** — browse the whole catalog, or filter by category or a name substring, with pagination.
- **List categories** — see every category (`scroll`, `webgl`, `cursor`, `text`, etc.) with how many effects are in each.
- **Get one effect's full details** by exact slug:
  - description, tier (free/pro), version, changelog, npm dependencies
  - the ready-to-copy install command (`npx hyperiux add <slug>`)
  - **new as of this revision**: `preview_url`, `import_path`, `target`, `main`, and a pre-built `import_statement` — so the agent doesn't have to guess how to import the component after installing it
  - optionally, the full component source code
- **Handle Pro effects honestly** — if you're logged in (`hyperiux login`) or have `HYPERIUX_TOKEN` set, it can pull real Pro source. If you're not, it says so clearly instead of pretending or erroring out.

## The 3 tools, one by one

This is everything the server currently exposes. Any AI client connected to it can call these directly.

### `hyperiux_list_effects`
Browse or search the catalog.
- **Input**: `query` (optional string, substring match on name), `category` (optional string), `limit` (default 30, max 100), `offset` (default 0)
- **Output**: `{ total, count, offset, effects: [{ name, category, categories, dependencies, version }], has_more, next_offset? }`
- **Heads up**: does *not* include tier (free/pro) — that's a known gap, see below.

### `hyperiux_get_effect`
Full detail for one effect by its exact slug.
- **Input**: `name` (required string, exact slug), `include_source` (default `false`)
- **Output**: `{ name, title, description, tier, version, dependencies, changelog, install_command, preview_url?, import_path?, target?, main?, import_statement?, files: [{ path, content? }], source_locked?, source_locked_reason? }`
- `import_statement`, `preview_url`, `import_path`, `target`, and `main` are new as of this revision.
- `files[].content` only appears when `include_source: true` **and** you're actually entitled to the source (always true for free effects; for Pro, only with a valid token).

### `hyperiux_list_categories`
Every category with how many effects are in it, sorted largest-first.
- **Input**: none
- **Output**: `{ categories: [{ category, count }] }`

## What it CANNOT do (yet)

Good to know so you don't expect the wrong thing:

- **It can't install anything.** No file writing, no `npx hyperiux add` under the hood. That step still needs the actual CLI (usually run by Claude Code via its terminal access, or by you directly).
- **It doesn't know component props.** Nothing in the registry has structured prop data yet — so it can't tell you "this effect takes an `intensity` number prop." (This is genuinely the biggest gap and the main thing worth building next — see below.)
- **It can't tell you constraints** like "this needs `'use client'`" or "this respects `prefers-reduced-motion`" in a structured way — that's currently only prose in a couple of changelogs, not something the server surfaces.
- **It can't recommend effects** based on a vibe like "I want something eye-catching for a hero section." There's no recommendation tool yet.
- **It can't validate** whether the props you're about to pass to a component are correct — no schema exists to check against.
- **The list-level tools can't tell you tier (free vs Pro).** Only `get_effect` on one exact slug can — a known, pre-existing gap in the underlying registry data itself, not something we can fix from inside this server alone.
- **It only runs locally via stdio right now.** No hosted/remote version — every AI client needs Node installed and a local path to `dist/index.js`.
- **It's not published to npm yet.** So `npx hyperiux-mcp-server` doesn't work for anyone — only a local build does, which is exactly what this guide sets up.

---

## Do's and Don'ts

**Do:**
- Rebuild after any code change: `pnpm --filter hyperiux-mcp-server build`. Nothing picks up new source until you do this.
- Use the **absolute path** to your `node` binary in client configs (e.g. `/usr/local/bin/node`), not just `"node"`. GUI apps like Claude Desktop often don't inherit your terminal's PATH, and `"node"` alone can silently fail to launch.
- Be specific in prompts when you want the catalog, not your local code — e.g. *"look this up in the Hyperiux Vault catalog via the hyperiux MCP tool"* rather than a bare *"tell me about X"*, which an agent can (and will) misread as "search my own repo."
- Run `hyperiux login` **yourself**, in your own terminal, for Pro access. Never paste your token into a chat with an AI agent.
- Start a **fresh chat/session** after changing `.mcp.json` or `claude_desktop_config.json` — a session that was already open can hang onto stale server state.

**Don't:**
- Don't expect it to write files into your project — always pair it with the actual CLI for installs.
- Don't trust `hyperiux_list_effects` for tier info — always confirm with `hyperiux_get_effect` on the specific slug before assuming something's free.
- Don't ask an agent to "install" an effect in a project that hasn't run `npx hyperiux init` yet — do that first (or ask the agent to run it).
- Don't publish this package to npm yet — that's an explicit future step, not part of local testing.

---

## Setting it up locally, step by step

### 1. Build it
From the `hyperiux-components` repo root:
```bash
pnpm --filter hyperiux-mcp-server build
```
This compiles `packages/mcp-server/src` into `packages/mcp-server/dist/index.js`. Do this again any time the source changes.

### 2. Find your Node path
```bash
which node
```
Copy this — you'll paste the same absolute path into both client configs below.

### 3a. Connect it to Claude Code (per-project)
In the project where you want to use it, create a `.mcp.json` file at its root:
```json
{
  "mcpServers": {
    "hyperiux": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/hyperiux-components/packages/mcp-server/dist/index.js"]
    }
  }
}
```
Open that project fresh in Claude Code (or start a new chat if it's already open) — you'll get a one-time prompt to approve the project's MCP server. Approve it.

### 3b. Connect it to Claude Desktop (applies everywhere)
Open (or create) `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) and add:
```json
{
  "mcpServers": {
    "hyperiux": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/hyperiux-components/packages/mcp-server/dist/index.js"]
    }
  }
}
```
If the file already has other keys/servers, just add `hyperiux` inside the existing `mcpServers` object — don't replace the whole file. Fully quit and reopen Claude Desktop afterward (it only reads this file at launch).

### 4. Verify the connection

**Claude Code**: type `/mcp` in the chat. You want to see `hyperiux` listed as connected.

**Claude Desktop**: go to Settings → Developer → Local MCP servers, or Settings → Connectors. You want to see `hyperiux` with a "running"/connected status.

### 5. Take it for a test drive

Try these prompts, roughly in this order:

1. *"What effect categories does Hyperiux Vault have?"* → exercises `hyperiux_list_categories`.
2. *"What cursor effects are available in Hyperiux?"* → exercises `hyperiux_list_effects` with a category filter.
3. *"Use the hyperiux MCP tool to look up the dotted-grid effect — what is it, what tier, what dependencies?"* → exercises `hyperiux_get_effect`. Check the answer includes `preview_url`, `import_path`, `main`, and `import_statement` — if those show up, you know it's genuinely using your local build, not something cached.
4. *"Show me the full source of dotted-grid"* → same tool, `include_source: true`. Free effect, so real code should appear.
5. *"Show me the source of a Pro effect like spotlight-text, with source included"* (without logging in) → should come back saying the source is locked, with a clear explanation — not an error, not fake code.
6. *"Tell me about an effect called totally-fake-effect-123"* → should cleanly say "not found," never make something up.

If a prompt like #3 makes the agent grep your local codebase instead of calling the tool, that's not a connection problem (you already confirmed it's connected) — it's just the model reading your question as being about local code. Rephrase to explicitly say "the Hyperiux Vault catalog" or "the hyperiux MCP tool."

---

## What to build next (roadmap ideas, roughly in priority order)

1. **Component usage/props tool** — the single highest-value addition. Right now nobody, human or AI, can ask "what props does this take?" and get a real answer from the server. Needs a data source first (parsing free-effect source as a first pass, then eventually a real authored schema).
2. **Constraints tool** — surface things like "needs `'use client'`," reduced-motion support, and GSAP licensing notes in one structured place instead of leaving an agent to infer them.
3. **Transitive dependency resolution** — right now `get_effect` only shows one level of `registryDependencies`; the CLI's actual install recursively pulls in more. A tool that shows the *full* chain would prevent surprises.
4. **Fix the tier gap** — get free/Pro status into the list-level tools, not just the per-slug one. This needs a fix upstream in the registry-building pipeline, not just in this server.
5. **`recommend_components`** — "I want something eye-catching for a hero background" → a ranked shortlist. Simple keyword/category scoring is plenty at this catalog size; no need for anything fancier.
6. **Publish to npm** — so `npx hyperiux-mcp-server` actually works for anyone, not just people who clone this repo and build it themselves.
7. **A hosted/remote version** (HTTP transport) — only worth it if there's a real need for a client that can't spawn a local Node process. Bigger lift than everything above; not urgent.

Whenever you're ready to tackle one of these, tell me which — happy to scope it out the same way we did this round: read what's already there, figure out the real gap, then build just that.
