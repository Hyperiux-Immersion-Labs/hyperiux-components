import chalk from "chalk";
import { clearAuthToken } from "../utils/auth.js";

export async function logout() {
  clearAuthToken();

  console.log();
  console.log(chalk.green("Hyperiux CLI credentials removed."));
  console.log();
}