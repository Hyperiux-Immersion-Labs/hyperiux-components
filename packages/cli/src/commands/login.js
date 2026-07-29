/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import prompts from "prompts";
import chalk from "chalk";
import ora from "ora";
import {
  saveAuthToken,
  clearAuthToken,
  getAuthToken,
  getAuthFilePath,
  getTokenPreview,
} from "../utils/auth.js";

const APP_URL =
  process.env.HYPERIUX_APP_URL || "https://components.hyperiux.com";

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

  const normalizedToken = token?.trim();

  if (!normalizedToken) {
    console.log(chalk.red("\nNo token provided. Run `npx hyperiux login` again."));
    process.exit(1);
  }

  if (!normalizedToken.startsWith("hpx_")) {
    console.log(chalk.red("\nInvalid token format. CLI tokens must start with `hpx_`."));
    process.exit(1);
  }

  const spinner = ora("Verifying token…").start();

  try {
    const res = await fetch(`${APP_URL}/api/cli/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: normalizedToken,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.valid) {
      spinner.fail(
        chalk.red(`Token invalid: ${data?.reason || "unknown error"}`)
      );
      process.exit(1);
    }

    spinner.succeed("Token verified.");
  } catch (err) {
    spinner.fail(chalk.red(`Could not reach Hyperiux: ${err.message}`));
    process.exit(1);
  }

  saveAuthToken(normalizedToken);

  console.log();
  console.log(
    chalk.green(
      "✓ Logged in. You can now install pro effects with `npx hyperiux add <effect>`."
    )
  );
  console.log();
}

export async function logout() {
  const token = getAuthToken();

  if (!token) {
    console.log(chalk.yellow("Not logged in."));
    return;
  }

  clearAuthToken();
  console.log(chalk.green("Logged out."));
}

export function whoami() {
  const token = getAuthToken();

  if (!token) {
    console.log(chalk.yellow("Not logged in. Run `npx hyperiux login`."));
    return;
  }

  console.log(chalk.green("Logged in with a saved CLI token."));
  console.log(chalk.dim("Token file: " + getAuthFilePath()));
  console.log(chalk.dim("Token: " + getTokenPreview()));
}