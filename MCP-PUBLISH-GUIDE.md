# Hyperiux MCP Server - Publishing & Going Global

This is the companion to [MCP-GUIDE.md](MCP-GUIDE.md), which covers running the server **locally** (a local build, an absolute path in your config). This doc covers what changes once you make it installable by **anyone**, anywhere, via `npx hyperiux-mcp-server` - no local clone, no local build, no absolute paths.

**Nothing here has been done yet.** This is a how-to for when you're ready, not a record of something already run. Publishing is a real, public, hard-to-reverse action - read it through before doing it for the first time.

---

## Why `npx hyperiux-mcp-server` doesn't work right now

The package (`hyperiux-mcp-server`, in `packages/mcp-server`) is fully built, tested, and CI-checked - but it has never actually been pushed to the npm registry. `.github/workflows/release.yml` (the workflow that runs on every `v*` tag push) currently only publishes `packages/cli`. Until that changes, the only way to run this server is a local build pointed at by an absolute path - exactly what `MCP-GUIDE.md` walks through.

## What actually changes once it's published

| | Local (today) | Published (after) |
|---|---|---|
| Client config | `"command": "/path/to/node", "args": ["/path/to/dist/index.js"]` | `"command": "npx", "args": ["-y", "hyperiux-mcp-server"]` |
| Setup needed | Clone this repo, `pnpm --filter hyperiux-mcp-server build` | Nothing - `npx` fetches it on first use |
| Updating | `git pull` + rebuild | New version auto-fetched next time (with `-y`) or on demand |
| Who can use it | Only people with this repo cloned | Anyone, anywhere |

The tools, their inputs/outputs, and the auth/Pro behavior are **identical** either way - publishing changes *distribution*, not *functionality*. See the tools list at the bottom of this doc (same as `MCP-GUIDE.md`'s).

---

## Before you publish: a checklist

1. **npm publish rights** to the `hyperiux-mcp-server` package name - same account/org that already publishes `hyperiux` (the CLI).
2. **`NPM_TOKEN` already exists** as a GitHub Actions secret (it's used by `packages/cli`'s publish step today) - the mcp-server publish step can reuse it.
3. **Package metadata is already correct** - checked in `packages/mcp-server/package.json`: `name: "hyperiux-mcp-server"`, `bin: { "hyperiux-mcp": "dist/index.js" }`, `files: ["dist", "README.md", "LICENSE"]`, `publishConfig.access: "public"`. Nothing to change here.
4. **CI is green** - lint, test, and build for `packages/mcp-server` already run automatically in `ci.yml` on every push/PR.
5. **Pick a version.** It's currently `0.1.0`. First publish can go out as-is, or you can bump it - your call, just make sure `package.json`'s `version` matches what you intend to tag.

---

## Decision needed first: same release as the CLI, or its own?

`packages/cli` and `packages/mcp-server` are different ages and different maturity levels - worth deciding before wiring anything:

- **Option A - piggyback on the existing release**: add a publish step to the same `release.yml` job, so both packages publish together whenever a `v*` tag is pushed. Simplest, but ties the MCP server's release cadence to the CLI's.
- **Option B - its own tag/cadence**: e.g. `mcp-v*` tags trigger a separate job just for `packages/mcp-server`. More setup, but lets the two evolve independently (useful once the MCP server starts shipping new tools faster than the CLI changes).

Recommendation: start with **Option A** for simplicity - it's a two-line addition to the existing workflow - and only split it out later if the release cadences actually start conflicting.

## Adding the publish step (Option A)

In `.github/workflows/release.yml`, after the existing CLI publish step:

```yaml
      - name: Publish MCP server with provenance
        run: |
          cd packages/mcp-server
          npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Also worth adding a quality-gate step for it right before, matching the CLI's pattern:
```yaml
      - name: Run quality gates (MCP server)
        run: |
          pnpm --filter hyperiux-mcp-server lint
          pnpm --filter hyperiux-mcp-server test
```

That's it structurally - `ci.yml` already proves lint/test/build/smoke pass on every push, this just adds the actual `npm publish` call to the tag-triggered release job.

## Or: a manual first-time publish

If you'd rather publish once by hand before wiring CI (e.g. to claim the package name, or sanity-check before automating):

```bash
cd packages/mcp-server
npm login                       # once, if you haven't already
npm publish --access public --dry-run   # ALWAYS dry-run first - see exactly what would ship
npm publish --access public             # the real, irreversible thing
```

Treat the real `npm publish` the same way you'd treat a force-push or a production deploy - it's public and it's not something you can cleanly undo (see "rollback" below). Dry-run first, every time, no exceptions.

---

## After it's published

- **`packages/mcp-server/README.md`** already documents the `npx -y hyperiux-mcp-server` install - no changes needed there, it was written correctly in advance.
- **Update `MCP-GUIDE.md`** and the root `README.md`'s "Running the MCP server locally" section to offer the `npx` config as the primary path, keeping the local-build instructions as a "contributing/developing on this server" fallback rather than the main story.
- New config for end users becomes just:
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
  No absolute paths, no local clone, no build step.

## Verifying a real publish actually worked

Run this from a totally unrelated directory (not this repo, so you know it's really fetching from npm and not accidentally using a local link):
```bash
npx -y hyperiux-mcp-server@latest
```
You should see `Hyperiux MCP server running via stdio` with no local path involved at all.

## Versioning going forward

- Bump `packages/mcp-server/package.json`'s `version` before each publish, following semver.
- Any change to a tool's *input schema* (renaming or removing a parameter) is a breaking change for whoever's already using it - treat that as at least a minor bump while pre-1.0, and call it out clearly if you ever add a `CHANGELOG.md` for this package (the root `CHANGELOG.md` doesn't currently track it).

## If a bad version goes out

npm won't let you delete a version after it's been out for a while (roughly 72 hours), and unpublishing something people already depend on breaks them. The safer move is:
```bash
npm deprecate hyperiux-mcp-server@<bad-version> "explanation of what's wrong, use X instead"
```
then publish a fixed version right after. Don't reach for `npm unpublish` unless it's within that initial short window and you're sure nobody's already pulled it.

## What doesn't change (security-wise)

Publishing doesn't add new risk on its own - the server is still read-only (no file writes, no shell access) and Pro-source gating still works exactly the way it does locally (reuses `~/.hyperiux/auth.json` / `HYPERIUX_TOKEN`, never serves Pro source without a valid token). The only thing that changes is *who can reach it* - everyone, instead of just people with this repo cloned - so it's worth double-checking the `packages/mcp-server/README.md`'s Pro-access section reads clearly to someone who's never seen this codebase, since now it's the only documentation they'll have.

## Explicitly not covered by publishing this package

- **A hosted/remote HTTP server** (something reachable over the internet without any local Node process at all) is a separate, bigger project - publishing to npm just makes the *local* stdio server easier to install, it doesn't create a hosted version.
- **Wiring a `hyperiux mcp` subcommand into the CLI** is a separate, still-undecided question (see `mcp-server-plan.md` §9.1) - publishing this package doesn't require or imply that.

---

## The 3 tools (same as MCP-GUIDE.md - nothing changes about these when you publish)

### `hyperiux_list_effects`
Browse or search the catalog.
- **Input**: `query` (optional string), `category` (optional string), `limit` (default 30, max 100), `offset` (default 0)
- **Output**: `{ total, count, offset, effects: [{ name, category, categories, dependencies, version }], has_more, next_offset? }`
- Does not include tier (free/pro) - known gap, check `hyperiux_get_effect` per-slug instead.

### `hyperiux_get_effect`
Full detail for one effect by its exact slug.
- **Input**: `name` (required string), `include_source` (default `false`)
- **Output**: `{ name, title, description, tier, version, dependencies, changelog, install_command, preview_url?, import_path?, target?, main?, import_statement?, files: [{ path, content? }], source_locked?, source_locked_reason? }`

### `hyperiux_list_categories`
Every category with effect counts, sorted largest-first.
- **Input**: none
- **Output**: `{ categories: [{ category, count }] }`
