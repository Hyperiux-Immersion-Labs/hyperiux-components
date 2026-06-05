import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_DIR = path.join(os.homedir(), ".hyperiux");
const AUTH_FILE = path.join(CONFIG_DIR, "auth.json");

export function saveAuthToken(token) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  fs.writeFileSync(
    AUTH_FILE,
    JSON.stringify(
      {
        token,
        savedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf-8"
  );
}

export function getAuthToken() {
  if (process.env.HYPERIUX_TOKEN) {
    return process.env.HYPERIUX_TOKEN;
  }

  if (!fs.existsSync(AUTH_FILE)) {
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
    return data.token || null;
  } catch {
    return null;
  }
}

export function clearAuthToken() {
  if (fs.existsSync(AUTH_FILE)) {
    fs.rmSync(AUTH_FILE, { force: true });
  }
}

export function getAuthStatus() {
  const token = getAuthToken();

  return {
    isLoggedIn: Boolean(token),
    tokenPreview: token ? `${token.slice(0, 8)}...${token.slice(-6)}` : null,
  };
}