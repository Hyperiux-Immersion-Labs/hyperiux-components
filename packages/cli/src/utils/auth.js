import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_DIR = path.join(os.homedir(), ".hyperiux");
const AUTH_FILE = path.join(CONFIG_DIR, "auth.json");

export function saveAuthToken(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid CLI token.");
  }

  // 0o700 - only owner can read/write/execute the config directory
  fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });

  // 0o600 - only owner can read/write the token file
  fs.writeFileSync(
    AUTH_FILE,
    JSON.stringify(
      {
        token: token.trim(),
        savedAt: new Date().toISOString(),
      },
      null,
      2
    ) + "\n",
    { encoding: "utf-8", mode: 0o600 }
  );
}

export function getAuthToken() {
  if (process.env.HYPERIUX_TOKEN) {
    return process.env.HYPERIUX_TOKEN.trim();
  }

  if (!fs.existsSync(AUTH_FILE)) {
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
    return data.token?.trim() || null;
  } catch {
    return null;
  }
}

export function clearAuthToken() {
  if (fs.existsSync(AUTH_FILE)) {
    fs.rmSync(AUTH_FILE, { force: true });
  }
}

export function getAuthFilePath() {
  return AUTH_FILE;
}

export function getTokenPreview() {
  const token = getAuthToken();

  if (!token) return null;

  return `${token.slice(0, 8)}...${token.slice(-6)}`;
}