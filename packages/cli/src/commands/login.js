import fs from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";

const AUTH_DIR = path.join(os.homedir(), ".hyperiux");
const AUTH_FILE = path.join(AUTH_DIR, "auth.json");
const APP_URL = process.env.HYPERIUX_APP_URL || "https://components.hyperiux.com";

export function getAuthToken() {
  if (!fs.existsSync(AUTH_FILE)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
    return data.token || null;
  } catch {
    return null;
  }
}

function saveAuthToken(token) {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ token }, null, 2), { mode: 0o600 });
}

export async function login() {
  console.log();
  console.log(chalk.bold("Log in to Hyperiux"));
  console.log();
  console.log("1. Open this URL in your browser:");
  console.log();
  console.log(chalk.cyan(`   ${APP_URL}/cli-auth`));
  console.log();
  console.log("2. Sign in with your Pro account and copy the token shown.");
  console.log();

  // Prompt for token
  const { default: prompts } = await import("prompts");
  const { token } = await prompts({
    type: "password",
    name: "token",
    message: "Paste your CLI token:",
  });

  if (!token) {
    console.log(chalk.yellow("Login cancelled."));
    return;
  }

  // Validate token against API
  const spinner = (await import("ora")).default("Verifying token...").start();

  try {
    const res = await fetch(`${APP_URL}/api/cli/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();

    if (!data.valid) {
      spinner.fail(chalk.red(`Invalid token: ${data.reason}`));
      console.log();
      return;
    }

    saveAuthToken(token);
    spinner.succeed(chalk.green("Logged in successfully!"));
    console.log();
    console.log(chalk.dim("Token saved to ~/.hyperiux/auth.json"));
    console.log();
  } catch (err) {
    spinner.fail(chalk.red(`Could not verify token: ${err.message}`));
    console.log();
  }
}

export async function logout() {
  if (!fs.existsSync(AUTH_FILE)) {
    console.log();
    console.log(chalk.yellow("You are not logged in."));
    console.log();
    return;
  }

  fs.rmSync(AUTH_FILE);
  console.log();
  console.log(chalk.green("Logged out successfully."));
  console.log(chalk.dim("Token removed from ~/.hyperiux/auth.json"));
  console.log();
}

export function whoami() {
  const token = getAuthToken();
  console.log();
  if (token) {
    console.log(chalk.green("Logged in") + chalk.dim(" — token found in ~/.hyperiux/auth.json"));
  } else {
    console.log(chalk.yellow("Not logged in."));
    console.log(chalk.dim(`Run \`npx hyperiux login\` to connect your Pro account.`));
  }
  console.log();
}
