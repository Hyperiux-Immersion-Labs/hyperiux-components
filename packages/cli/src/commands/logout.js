/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import chalk from "chalk";
import { clearAuthToken } from "../utils/auth.js";

export async function logout() {
  clearAuthToken();

  console.log();
  console.log(chalk.green("Hyperiux CLI credentials removed."));
  console.log();
}