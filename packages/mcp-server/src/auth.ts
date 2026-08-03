import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Same location and shape as packages/cli/src/utils/auth.js's AUTH_FILE - a
// user who already ran `hyperiux login` gets Pro access here automatically,
// with no separate setup for this server.
const AUTH_FILE = path.join(os.homedir(), ".hyperiux", "auth.json");

export function getAuthToken(): string | null {
  if (process.env.HYPERIUX_TOKEN) {
    return process.env.HYPERIUX_TOKEN.trim();
  }

  if (!fs.existsSync(AUTH_FILE)) {
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
    return typeof data.token === "string" ? data.token.trim() || null : null;
  } catch {
    return null;
  }
}
