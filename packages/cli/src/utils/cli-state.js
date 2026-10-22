import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";

// Separate from auth.js's ~/.hyperiux/auth.json on purpose - this tracks
// local CLI state (the device ID below), not credentials.
const CONFIG_DIR = path.join(os.homedir(), ".hyperiux");
const STATE_FILE = path.join(CONFIG_DIR, "state.json");

function readState() {
  if (!fs.existsSync(STATE_FILE)) return {};

  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeState(state) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n", "utf-8");
}

// A real per-machine identity for the install-limit anonymous bucket -
// distinct from telemetry.js's getAnonymousProjectId(), which is
// sha256(cwd + hostname) and therefore resets for every new project folder,
// making it useless as a quota key. This persists once in the same global
// state file every other CLI-wide setting already lives in.
export function getOrCreateDeviceId() {
  const state = readState();

  if (state.deviceId) return state.deviceId;

  const deviceId = crypto.randomUUID();
  writeState({ ...state, deviceId });

  return deviceId;
}
