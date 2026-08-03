# The Hyperiux MCP Server — Complete Guide

One page that explains everything: what this is, why it exists, who it's for, and how it works — written so it makes sense whether you're the person maintaining it or someone landing on it for the first time via npm/GitHub.

For hands-on setup, see [MCP-GUIDE.md](MCP-GUIDE.md) (local) and [MCP-PUBLISH-GUIDE.md](MCP-PUBLISH-GUIDE.md) (publishing).

---

## What it is, in one sentence

**`hyperiux-mcp-server` is an MCP (Model Context Protocol) server that teaches AI coding assistants what's actually in the Hyperiux Vault effect catalog, so they can help you find, understand, and install the right effect without guessing.**

## Why it exists

Before this existed, if you asked an AI assistant "add a nice particle background effect to my Next.js site using Hyperiux," it had two bad options: guess at effect names and props from training data (which goes stale the moment the catalog changes, and can flat-out invent things that don't exist), or tell you to go check the website yourself. Neither is great when the entire point of Hyperiux Vault is "copy-paste-quality effects, installed in one command."

This server closes that gap. It gives any MCP-compatible AI a live, accurate, read-only window into the real catalog — real slugs, real dependencies, real tiers, real changelogs — pulled straight from the same registry the `hyperiux` CLI itself uses. The AI still does the talking; this just makes sure what it says is *true*.

## Who it's for

- **Developers using an AI coding assistant** (Claude Code, Claude Desktop, Cursor, or any other MCP client) who want to ask things like "what scroll effects does Hyperiux have?" or "install the right cursor effect for a portfolio site" and get a real answer instead of a hallucinated one.
- **Anyone building on top of Hyperiux** who wants their own tooling or agents to query the catalog programmatically via a standard protocol instead of scraping the website.

It is **not** for end users who just want to browse effects visually — that's what [vault.hyperiux.com/effects](https://vault.hyperiux.com/effects) is for. This is specifically for AI-assisted workflows.

## Keywords

If you're indexing, tagging, or searching for this: **MCP server**, **Model Context Protocol**, **Claude MCP**, **Cursor MCP**, **AI coding assistant tools**, **Next.js component registry**, **React effects catalog**, **shadcn-style registry**, **Hyperiux Vault**, **AI-native component discovery**, **agentic UI installation**, **stdio MCP transport**.

## What it actually does (the short version)

Three tools, all read-only:

| Tool | What it answers |
|---|---|
| `hyperiux_list_effects` | "What effects exist?" / "What's in category X?" / "Is there anything called Y?" |
| `hyperiux_get_effect` | "Tell me everything about effect X" — description, tier, dependencies, changelog, install command, import statement, and (if allowed) full source |
| `hyperiux_list_categories` | "What categories are there, and how big is each?" |

Full input/output schemas for each are in [MCP-GUIDE.md](MCP-GUIDE.md#the-3-tools-one-by-one).

## What it deliberately does NOT do

Just as important as what it does:

- **It does not install anything.** It never writes a file. Installing is still the `hyperiux` CLI's job (`npx hyperiux add <effect>`) — this server just makes sure whoever (or whatever) is calling that command knows the right slug, dependencies, and import path first.
- **It does not leak Pro source.** If an effect requires a Hyperiux Pro subscription and no valid token is available, it says so plainly instead of returning fake or partial code.
- **It does not run arbitrary code or touch your filesystem.** It only ever reads from the public Hyperiux registry over HTTPS and, optionally, a saved auth token from a `hyperiux login` session.
- **It does not require an account to use for free effects.** Anyone can query metadata and source for all 32 free effects with zero setup beyond connecting the server.

## Why an MCP server instead of just... docs?

Documentation is for humans reading linearly. An MCP server is for an AI agent that needs to *look something up mid-task* — the difference between "read the whole manual first" and "ask the one question you actually have, right now, and get a precise answer." Both matter; they're not competing, they're complementary. The docs site is still the best place for a human to browse and get inspired. This server is for the moment an AI is actively trying to write code that uses Hyperiux and needs ground truth instead of a guess.

## How it fits with the rest of Hyperiux

```
 vault.hyperiux.com (the live app)
        │
        │  serves registry data + protected Pro API
        ▼
 ┌─────────────────────────────┐
 │   Hyperiux Vault registry    │  ← single source of truth
 └─────────────────────────────┘
        ▲                    ▲
        │                    │
 ┌──────┴──────┐      ┌──────┴────────────┐
 │ hyperiux CLI │      │ hyperiux-mcp-server│
 │ (npx hyperiux)│      │ (this server)      │
 │ installs files│      │ answers questions  │
 └──────────────┘      └────────────────────┘
        ▲                    ▲
        │                    │
     You, typing         An AI assistant,
     commands              on your behalf
```

Both the CLI and the MCP server are *clients* of the same registry — neither one hosts or owns the actual effect source (except the 32 free effects, which are public in this repo). Pro effect source lives in a private repository and is only ever served through an authenticated API call, whether the caller is the CLI or this MCP server.

## Where it lives, and why

`packages/mcp-server` in the public `hyperiux-components` repo, right alongside `packages/cli`. Not in the private Pro repo — it never needs local access to Pro source (it calls the same protected API the CLI does), and it's meant to be publicly installable and open to community contributions, same as the CLI.

## How you actually use it

Two modes, covered in depth elsewhere:

- **Local (working today)**: clone this repo, build it, point your MCP client at the local `dist/index.js`. Full walkthrough in [MCP-GUIDE.md](MCP-GUIDE.md).
- **Global / `npx` (once published)**: anyone, anywhere, adds `"command": "npx", "args": ["-y", "hyperiux-mcp-server"]` to their MCP client config — no clone, no build. Full walkthrough in [MCP-PUBLISH-GUIDE.md](MCP-PUBLISH-GUIDE.md).

## Auth and Pro access, briefly

It reuses whatever the `hyperiux` CLI already has — a saved `hyperiux login` session (`~/.hyperiux/auth.json`) or a `HYPERIUX_TOKEN` environment variable. If you're logged in with a Pro subscription, Pro effect source becomes available through the same tool calls. If not, you still get full metadata for every effect (description, dependencies, changelog, tier) — just not the Pro source itself, with a plain explanation of why.

## What's next for it

See the roadmap section in [MCP-GUIDE.md](MCP-GUIDE.md#what-to-build-next-roadmap-ideas-roughly-in-priority-order) — in short: a props/usage tool, a constraints tool, fixing a known tier-reporting gap, a recommendation tool, and eventually publishing it to npm so this whole "global" story is real rather than aspirational.
