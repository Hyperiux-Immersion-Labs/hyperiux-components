import fs from "fs";
import path from "path";

const CONFIG_FILE = "hyperiux.json";

const DEFAULT_CONFIG = {
  $schema: "https://components.hyperiux.com//schema.json",
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

export function resolveAlias(alias, config) {
  const aliasMap = config.aliases || {};
  for (const [key, value] of Object.entries(aliasMap)) {
    if (alias.startsWith(`@/${key}`)) {
      return alias.replace(`@/${key}`, value.replace("@/", "src/"));
    }
  }
  return alias.replace("@/", "src/");
}

export function getEffectsPath(config) {
  const effectsAlias = config.aliases?.effects || "@/components/effects";
  return effectsAlias.replace("@/", "src/");
}

export function getHooksPath(config) {
  const hooksAlias = config.aliases?.hooks || "@/hooks";
  return hooksAlias.replace("@/", "src/");
}

export function getLibPath(config) {
  const libAlias = config.aliases?.lib || "@/lib";
  return libAlias.replace("@/", "src/");
}
