import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

// Same location and shape as packages/cli/src/utils/cli-state.js's
// getOrCreateDeviceId() - a real per-machine identity for the install-limit
// anonymous bucket, shared with the CLI so a user who runs both gets one
// consistent device-id rather than two separate anonymous buckets. This
// server is an independent npm package (not a dependency of the CLI or vice
// versa), so - same as auth.ts re-implementing getAuthToken() - it reads and
// writes the shared state file directly rather than importing across
// packages.
const STATE_FILE = path.join(os.homedir(), ".hyperiux", "state.json");

function readState(): Record<string, unknown> {
  if (!fs.existsSync(STATE_FILE)) return {};

  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeState(state: Record<string, unknown>): void {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true, mode: 0o700 });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n", "utf-8");
}

export function getOrCreateDeviceId(): string {
  const state = readState();

  if (typeof state.deviceId === "string" && state.deviceId) {
    return state.deviceId;
  }

  const deviceId = crypto.randomUUID();
  writeState({ ...state, deviceId });

  return deviceId;
}
