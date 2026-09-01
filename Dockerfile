# Builds packages/mcp-server (hyperiux-mcp-server) for Glama's release/deployment
# check. Scoped to this package only — npm install/build instead of pnpm, so the
# rest of the monorepo workspace is never pulled in.
# ponytail: no --omit=dev multi-arch/caching tricks, just a correct two-stage build.

FROM node:20-alpine AS build
WORKDIR /app
COPY packages/mcp-server/package.json ./
RUN npm install
COPY packages/mcp-server/tsconfig.json ./
COPY packages/mcp-server/src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY packages/mcp-server/package.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY packages/mcp-server/README.md packages/mcp-server/LICENSE ./

# Pure stdio MCP server — no port to expose, no env vars required to start.
CMD ["node", "dist/index.js"]
