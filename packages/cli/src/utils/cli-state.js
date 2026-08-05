import fs from "fs";
import os from "os";
import path from "path";

// Separate from auth.js's ~/.hyperiux/auth.json on purpose - this tracks
// local CLI UX state (e.g. "have we shown the star prompt"), not credentials.
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

export function hasSeenStarPrompt() {
  return readState().seenStarPrompt === true;
}

export function markStarPromptSeen() {
  writeState({ ...readState(), seenStarPrompt: true });
}

export function recordLocalInstallStat(effectName, installedAt = new Date()) {
  const state = readState();
  const installStats = state.installStats || {};
  const effects = installStats.effects || {};
  const current = effects[effectName] || {};
  const timestamp = installedAt.toISOString();

  effects[effectName] = {
    count: (current.count || 0) + 1,
    firstInstalledAt: current.firstInstalledAt || timestamp,
    lastInstalledAt: timestamp,
  };

  writeState({
    ...state,
    installStats: {
      ...installStats,
      total: (installStats.total || 0) + 1,
      effects,
      updatedAt: timestamp,
    },
  });
}
