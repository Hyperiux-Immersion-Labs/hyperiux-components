import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_URL = process.env.HYPERIUX_REGISTRY_URL || "https://hyperiux-ui.vercel.app/r";
const LOCAL_REGISTRY_PATH = "public/r";

// Path to local registry in the monorepo (for development)
const DEV_REGISTRY_PATH = path.join(__dirname, "../../../../apps/docs/public/r");

export async function fetchRegistry(name, options = {}) {
  const { local = false, cwd = process.cwd() } = options;

  if (local) {
    return fetchLocalRegistry(name, cwd);
  }

  // Check if we're in development mode (registry files exist locally)
  if (fs.existsSync(path.join(DEV_REGISTRY_PATH, `${name}.json`))) {
    return fetchDevRegistry(name);
  }

  return fetchRemoteRegistry(name);
}

async function fetchDevRegistry(name) {
  const registryPath = path.join(DEV_REGISTRY_PATH, `${name}.json`);
  const content = fs.readFileSync(registryPath, "utf-8");
  return JSON.parse(content);
}

async function fetchLocalRegistry(name, cwd) {
  const registryPath = path.join(cwd, LOCAL_REGISTRY_PATH, `${name}.json`);

  if (!fs.existsSync(registryPath)) {
    throw new Error(`Effect "${name}" not found in local registry`);
  }

  const content = fs.readFileSync(registryPath, "utf-8");
  return JSON.parse(content);
}

async function fetchRemoteRegistry(name) {
  const url = `${REGISTRY_URL}/${name}.json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Effect "${name}" not found in registry`);
      }
      throw new Error(`Failed to fetch effect: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error.message.includes("not found")) {
      throw error;
    }
    throw new Error(`Failed to fetch registry: ${error.message}`);
  }
}

export async function fetchRegistryIndex(options = {}) {
  const { local = false, cwd = process.cwd() } = options;

  if (local) {
    return fetchLocalRegistryIndex(cwd);
  }

  // Check if we're in development mode
  if (fs.existsSync(path.join(DEV_REGISTRY_PATH, "index.json"))) {
    return fetchDevRegistryIndex();
  }

  return fetchRemoteRegistryIndex();
}

async function fetchDevRegistryIndex() {
  const indexPath = path.join(DEV_REGISTRY_PATH, "index.json");
  const content = fs.readFileSync(indexPath, "utf-8");
  return JSON.parse(content);
}

async function fetchLocalRegistryIndex(cwd) {
  const indexPath = path.join(cwd, LOCAL_REGISTRY_PATH, "index.json");

  if (!fs.existsSync(indexPath)) {
    throw new Error("Registry index not found locally");
  }

  const content = fs.readFileSync(indexPath, "utf-8");
  return JSON.parse(content);
}

async function fetchRemoteRegistryIndex() {
  const url = `${REGISTRY_URL}/index.json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch registry index: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(`Failed to fetch registry index: ${error.message}`);
  }
}

export function getRegistryItemFiles(item, config) {
  return item.files.map((file) => {
    let targetPath = file.target;

    // Replace alias with actual path
    if (targetPath.startsWith("components/effects/")) {
      const effectsPath = config.aliases?.effects?.replace("@/", "") || "components/effects";
      targetPath = targetPath.replace("components/effects/", `${effectsPath}/`);
    } else if (targetPath.startsWith("hooks/")) {
      const hooksPath = config.aliases?.hooks?.replace("@/", "") || "hooks";
      targetPath = targetPath.replace("hooks/", `${hooksPath}/`);
    } else if (targetPath.startsWith("lib/")) {
      const libPath = config.aliases?.lib?.replace("@/", "") || "lib";
      targetPath = targetPath.replace("lib/", `${libPath}/`);
    }

    return {
      ...file,
      targetPath: `src/${targetPath}`,
    };
  });
}
