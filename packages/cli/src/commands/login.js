import fs from "fs";
import os from "os";
import path from "path";
import prompts from "prompts";
import chalk from "chalk";
import ora from "ora";

const CONFIG_DIR = path.join(os.homedir(), ".hyperiux");
const AUTH_FILE = path.join(CONFIG_DIR, "auth.json");

const APP_URL = process.env.HYPERIUX_APP_URL || "https://components.hyperiux.com";

export async function login() {
  console.log();
  console.log(chalk.bold("Hyperiux Pro — CLI Login"));
  console.log();
  console.log("Open this URL in your browser to generate your CLI token:");
  console.log();
  console.log(chalk.cyan(`  ${APP_URL}/cli-auth`));
  console.log();

  const { token } = await prompts(
    {
      type: "password",
      name: "token",
      message: "Paste your CLI token here:",
    },
    {
      onCancel: () => {
        console.log(chalk.yellow("\nLogin cancelled."));
        process.exit(0);
      },
    }
  );

  if (!token || !token.trim()) {
    console.log(chalk.red("\nNo token provided. Run `npx hyperiux login` again."));
    process.exit(1);
  }

  // Validate the token against the API before saving
  const spinner = ora("Verifying token…").start();
  try {
    const res = await fetch(`${APP_URL}/api/cli/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.trim() }),
    });

    const data = await res.json();

    if (!data.valid) {
      spinner.fail(chalk.red(`Token invalid: ${data.reason || "unknown error"}`));
      process.exit(1);
    }

    spinner.succeed("Token verified.");
  } catch (err) {
    spinner.fail(chalk.red(`Could not reach Hyperiux: ${err.message}`));
    process.exit(1);
  }

  // Persist to ~/.hyperiux/auth.json
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ token: token.trim() }, null, 2) + "\n");

  console.log();
  console.log(chalk.green("✓ Logged in. You can now install pro effects with `npx hyperiux add <effect>`."));
  console.log();
}

export async function logout() {
  if (fs.existsSync(AUTH_FILE)) {
    fs.rmSync(AUTH_FILE);
    console.log(chalk.green("Logged out."));
  } else {
    console.log(chalk.yellow("Not logged in."));
  }
}

export function getAuthToken() {
  if (!fs.existsSync(AUTH_FILE)) return null;
  try {
    const { token } = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
    return token || null;
  } catch {
    return null;
  }
}

export function whoami() {
  const token = getAuthToken();
  if (!token) {
    console.log(chalk.yellow("Not logged in. Run `npx hyperiux login`."));
  } else {
    console.log(chalk.green("Logged in with a saved CLI token."));
    console.log(chalk.dim("Token file: " + AUTH_FILE));
  }
}
