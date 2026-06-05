import fs from "fs";
import path from "path";
import { fileURLToPath, URL } from "url";
import { Buffer } from "buffer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_URL =
  process.env.HYPERIUX_REGISTRY_URL || "https://components.hyperiux.com/r";

const APP_URL =
  process.env.HYPERIUX_APP_URL || "https://components.hyperiux.com";

const API_URL = process.env.HYPERIUX_API_URL || APP_URL;

const LOCAL_REGISTRY_PATH = "public/r";

// Path to local registry in the monorepo for development
const DEV_REGISTRY_PATH = path.join(
  __dirname,
  "../../../../apps/docs/public/r",
);

function isProEffect(item) {
  const tier = item?.tier || "free";

  return tier === "pro" || tier === "paid";
}

function createRegistryError(message, options = {}) {
  const error = new Error(message);

  error.status = options.status;
  error.requiresPro = Boolean(options.requiresPro);

  return error;
}

async function parseJsonResponse(response) {
  return response.json().catch(() => null);
}

/**
 * Main registry fetcher used by `hyperiux add <effect>`.
 *
 * Important:
 * - Free effects can come from public registry JSON.
 * - Pro effects must always come from the protected API route.
 * - The protected API route decides whether the CLI token is valid.
 */
export async function fetchRegistry(name, options = {}) {
  const { local = false, cwd = process.cwd(), token = null } = options;

  /*
    Local mode is only for explicit local registry testing.
    Normal `hyperiux add` must always go through the protected API.
  */
  if (local) {
    return fetchLocalRegistry(name, cwd, token);
  }

  return fetchProtectedEffect(name, token);
}

async function fetchDevRegistry(name, token) {
  const registryPath = path.join(DEV_REGISTRY_PATH, `${name}.json`);
  const meta = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

  /**
   * Even in development, Pro effects must go through the protected API.
   * This keeps local CLI behavior identical to production.
   */
  if (isProEffect(meta)) {
    return fetchProtectedEffect(name, token);
  }

  return meta;
}

async function fetchLocalRegistry(name, cwd, token) {
  const registryPath = path.join(cwd, LOCAL_REGISTRY_PATH, `${name}.json`);

  if (!fs.existsSync(registryPath)) {
    throw createRegistryError(`Effect "${name}" not found in local registry`, {
      status: 404,
    });
  }

  const content = fs.readFileSync(registryPath, "utf-8");
  const meta = JSON.parse(content);

  /**
   * If the local registry item is Pro, still enforce token access.
   */
  if (isProEffect(meta)) {
    return fetchProtectedEffect(name, token);
  }

  return meta;
}

async function fetchRemoteRegistry(name, token) {
  const url = `${REGISTRY_URL}/${name}.json`;

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw createRegistryError(`Failed to fetch registry: ${error.message}`);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw createRegistryError(`Effect "${name}" not found in registry`, {
        status: 404,
      });
    }

    throw createRegistryError(
      `Failed to fetch effect: ${response.statusText}`,
      {
        status: response.status,
      },
    );
  }

  const meta = await parseJsonResponse(response);

  if (!meta) {
    throw createRegistryError(`Invalid registry response for "${name}"`);
  }

  /**
   * Public registry can expose metadata, but Pro files must come only
   * from the protected API endpoint.
   */
  if (isProEffect(meta)) {
    return fetchProtectedEffect(name, token);
  }

  return meta;
}

async function fetchProtectedEffect(name, token) {
  const url = `${API_URL.replace(/\/$/, "")}/api/cli/effects/${name}`;

  if (process.env.HYPERIUX_DEBUG === "1") {
    console.log("[Hyperiux CLI] API URL:", url);
    console.log("[Hyperiux CLI] Token found:", Boolean(token));
    console.log(
      "[Hyperiux CLI] Token preview:",
      token ? `${token.slice(0, 8)}...${token.slice(-6)}` : "NO_TOKEN"
    );
  }

  let response;

  try {
    response = await fetch(url, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });
  } catch (error) {
    throw createRegistryError(`Could not reach Hyperiux API: ${error.message}`);
  }

  const data = await parseJsonResponse(response);

  if (process.env.HYPERIUX_DEBUG === "1") {
    console.log("[Hyperiux CLI] Response status:", response.status);
    console.log("[Hyperiux CLI] Response body:", data);
  }

  if (!response.ok) {
    throw createRegistryError(
      data?.error || `Failed to fetch Pro effect: ${response.statusText}`,
      {
        status: response.status,
        requiresPro: Boolean(data?.requiresPro),
      }
    );
  }

  if (!data) {
    throw createRegistryError(`Invalid protected registry response for "${name}"`);
  }

  return data;
}
export async function fetchRegistryIndex(options = {}) {
  const { local = false, cwd = process.cwd() } = options;

  if (local) {
    return fetchLocalRegistryIndex(cwd);
  }

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
    throw createRegistryError("Registry index not found locally", {
      status: 404,
    });
  }

  const content = fs.readFileSync(indexPath, "utf-8");

  return JSON.parse(content);
}

async function fetchRemoteRegistryIndex() {
  const url = `${REGISTRY_URL}/index.json`;

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw createRegistryError(
      `Failed to fetch registry index: ${error.message}`,
    );
  }

  if (!response.ok) {
    throw createRegistryError(
      `Failed to fetch registry index: ${response.statusText}`,
      {
        status: response.status,
      },
    );
  }

  return response.json();
}

export async function fetchRegistryAsset(source) {
  const url = source.startsWith("http")
    ? source
    : `${new URL(REGISTRY_URL).origin}${source}`;

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw createRegistryError(
      `Failed to fetch asset "${source}": ${error.message}`,
    );
  }

  if (!response.ok) {
    throw createRegistryError(`Failed to fetch asset: ${response.statusText}`, {
      status: response.status,
    });
  }

  return Buffer.from(await response.arrayBuffer());
}

export function getRegistryItemFiles(item, config, cwd = process.cwd()) {
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const prefix = usesSrc ? "src/" : "";
  const files = item.files || [];

  return files.map((file) => {
    let targetPath = file.targetPath || file.target || file.path;

    if (!targetPath) {
      throw createRegistryError(
        `Invalid registry file in "${item.name}". Missing target path.`,
      );
    }

    const shouldPrefixSrc = !targetPath.startsWith("public/");

    // Replace Hyperiux default paths with user's configured aliases
    if (targetPath.startsWith("components/hyperiux/")) {
      const effectsPath =
        config.aliases?.effects?.replace("@/", "") || "components/effects";

      targetPath = targetPath.replace(
        "components/hyperiux/",
        `${effectsPath}/`,
      );
    } else if (targetPath.startsWith("components/effects/")) {
      const effectsPath =
        config.aliases?.effects?.replace("@/", "") || "components/effects";

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
      targetPath: `${shouldPrefixSrc ? prefix : ""}${targetPath}`,
    };
  });
}
