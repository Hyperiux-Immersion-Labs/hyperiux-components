/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import fs from "fs";
import path from "path";

const CONFIG_FILE = "hyperiux.json";

const DEFAULT_CONFIG = {
  $schema: "https://components.hyperiux.com/schema.json",
  tailwind: {
    config: "tailwind.config.js",
    css: "src/app/globals.css",
  },
  aliases: {
    components: "@/components",
    effects: "@/components/effects",
    hooks: "@/hooks",
    lib: "@/lib",
  },
};

export function getConfigPath(cwd = process.cwd()) {
  return path.join(cwd, CONFIG_FILE);
}

export function configExists(cwd = process.cwd()) {
  return fs.existsSync(getConfigPath(cwd));
}

export function readConfig(cwd = process.cwd()) {
  const configPath = getConfigPath(cwd);
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const content = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(content);
}

export function writeConfig(config, cwd = process.cwd()) {
  const configPath = getConfigPath(cwd);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
}

export function getDefaultConfig() {
  return { ...DEFAULT_CONFIG };
}

export function resolveAlias(alias, config, cwd = process.cwd()) {
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const prefix = usesSrc ? "src/" : "";
  const aliasMap = config.aliases || {};
  for (const [key, value] of Object.entries(aliasMap)) {
    if (alias.startsWith(`@/${key}`)) {
      return alias.replace(`@/${key}`, value.replace("@/", prefix));
    }
  }
  return alias.replace("@/", prefix);
}

export function getEffectsPath(config, cwd = process.cwd()) {
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const prefix = usesSrc ? "src/" : "";
  const effectsAlias = config.aliases?.effects || "@/components/effects";
  return effectsAlias.replace("@/", prefix);
}

export function getHooksPath(config, cwd = process.cwd()) {
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const prefix = usesSrc ? "src/" : "";
  const hooksAlias = config.aliases?.hooks || "@/hooks";
  return hooksAlias.replace("@/", prefix);
}

export function getLibPath(config, cwd = process.cwd()) {
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const prefix = usesSrc ? "src/" : "";
  const libAlias = config.aliases?.lib || "@/lib";
  return libAlias.replace("@/", prefix);
}
