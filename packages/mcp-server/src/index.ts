#!/usr/bin/env node
/**
 * MCP server for the Hyperiux Vault effect registry - lets AI clients browse,
 * search, and inspect React/Next.js interaction effects, and fetch
 * installable source for effects the caller is entitled to (free effects
 * always; Pro effects if a `hyperiux login` session or HYPERIUX_TOKEN is
 * available).
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRequire } from "node:module";
import { registerListEffectsTool } from "./tools/list-effects.js";
import { registerGetEffectTool } from "./tools/get-effect.js";
import { registerListCategoriesTool } from "./tools/list-categories.js";

const require = createRequire(import.meta.url);
const { version: MCP_SERVER_VERSION } = require("../package.json") as { version: string };

const server = new McpServer({
  name: "hyperiux-mcp-server",
  version: MCP_SERVER_VERSION,
});

registerListEffectsTool(server);
registerGetEffectTool(server);
registerListCategoriesTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Hyperiux MCP server running via stdio");
}

main().catch((error) => {
  console.error("Hyperiux MCP server failed to start:", error);
  process.exitCode = 1;
});
