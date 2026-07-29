/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import chalk from "chalk";
import { getAuthStatus } from "../utils/auth.js";

export async function whoami() {
  const status = getAuthStatus();

  console.log();

  if (!status.isLoggedIn) {
    console.log(chalk.yellow("You are not logged in."));
    console.log();
    console.log("Run:");
    console.log(chalk.cyan("hyperiux login"));
    return;
  }

  console.log(chalk.green("You are logged in to Hyperiux CLI."));
  console.log();
  console.log(`Token: ${chalk.dim(status.tokenPreview)}`);
}