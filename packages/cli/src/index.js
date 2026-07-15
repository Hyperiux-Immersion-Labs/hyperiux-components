#!/usr/bin/env node

import { Command } from "commander";
import { createRequire } from "module";
import { init } from "./commands/init.js";
import { add } from "./commands/add.js";
import { list } from "./commands/list.js";
import { login, logout, whoami } from "./commands/login.js";
import { outdated } from "./commands/outdated.js";
import { diff } from "./commands/diff.js";
import { versions } from "./commands/versions.js";

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
  .command("outdated")
  .description("Check installed effects for available updates")
  .action(outdated);

program
  .command("versions")
  .description("List every installed effect and its version")
  .action(versions);

program
  .command("diff")
  .description("Show what changed upstream for an installed effect")
  .argument("[effect]", "The effect to diff (all installed effects if omitted)")
  .action(diff);

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
