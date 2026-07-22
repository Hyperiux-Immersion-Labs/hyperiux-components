## What does this change?

<!-- One or two sentences. If this fixes an open issue, link it: "Fixes #123" -->

## Type of change

- [ ] New free effect
- [ ] Bug fix (CLI or an existing effect)
- [ ] CLI feature/improvement
- [ ] Documentation
- [ ] Other

## Checklist

- [ ] `pnpm install` at the repo root, then verified locally with `pnpm dev`
- [ ] If this touches `packages/cli`: `pnpm --filter hyperiux lint` and `pnpm --filter hyperiux test` both pass
- [ ] If this adds a new free effect: `pnpm build:registry` runs clean and the effect installs via `node packages/cli/src/index.js add <effect-name>` into a scratch Next.js app
- [ ] New effect includes a `registry.json` with `tier: "free"` and a working `previewUrl`
- [ ] No `console.log`/debug code left in

## Screenshots or a short clip

<!-- For anything visual, this is the fastest way for a reviewer to understand the change. A GIF is great if you have one. -->
