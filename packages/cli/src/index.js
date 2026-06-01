#!/usr/bin/env node

import { Command } from "commander";
import { createRequire } from "module";
import { init } from "./commands/init.js";
import { add } from "./commands/add.js";
import { list } from "./commands/list.js";
import { login, logout, whoami } from "./commands/login.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const program = new Command();

program
  .name("hyperiux")
  .description("CLI for adding Hyperiux Vault effects to your project")
  .version(version);

program
  .command("init")
  .description("Initialize Hyperiux in your project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(init);

program
  .command("add")
  .description("Add an effect to your project")
  .argument("<effect>", "The effect to add")
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("--dry-run", "Show what would be installed without installing")
  .action(add);

program
  .command("list")
  .description("List all available effects")
  .action(list);

program
  .command("login")
  .description("Log in to Hyperiux Pro to access premium effects")
  .action(login);

program
  .command("logout")
  .description("Remove saved Hyperiux Pro credentials")
  .action(logout);

program
  .command("whoami")
  .description("Show current login status")
  .action(whoami);

program.parse();
