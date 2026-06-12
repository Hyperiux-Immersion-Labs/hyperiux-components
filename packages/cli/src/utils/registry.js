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

/**
 * packages/cli/src/utils/registry.js
 *
 * __dirname = packages/cli/src/utils
 */
const CLI_PACKAGE_ROOT = path.resolve(__dirname, "../..");
const PACKAGES_DIR = path.resolve(__dirname, "../../..");
const MONOREPO_ROOT = path.resolve(__dirname, "../../../..");

/**
 * Possible local registry locations.
 *
 * During local npm link:
 * hyperiux-components/registry
 *
 * During published package:
 * packages/cli/registry
 *
 * During docs development:
 * apps/docs/public/r
 */
const LOCAL_REGISTRY_CANDIDATES = [
  path.join(CLI_PACKAGE_ROOT, "registry"),
  path.join(MONOREPO_ROOT, "registry"),
  path.join(PACKAGES_DIR, "registry"),
];

const DEV_REGISTRY_PATH = path.join(MONOREPO_ROOT, "apps/docs/public/r");

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

function normalizePath(value = "") {
  return value.replaceAll("\\", "/");
}

function pathExists(filePath) {
  return fs.existsSync(filePath);
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function getLocalRegistryRoot() {
  for (const candidate of LOCAL_REGISTRY_CANDIDATES) {
    const indexPath = path.join(candidate, "index.json");

    if (pathExists(indexPath)) {
      return candidate;
    }
  }

  return null;
}

function findRegistryItemInIndex(index, name) {
  if (!Array.isArray(index)) return null;

  return index.find((item) => item.name === name) || null;
}

/**
 * Main registry fetcher used by `hyperiux add <effect>`.
 *
 * Local development priority:
 * 1. If repo/package registry exists, read from local registry/index.json.
 * 2. If local flag is true, read from public/r in current cwd.
 * 3. Otherwise fetch public remote registry.
 * 4. If item is Pro, fetch protected API with token.
 */
export async function fetchRegistry(name, options = {}) {
  const { local = false, cwd = process.cwd(), token = null } = options;

  if (local) {
    return fetchLocalPublicRegistry(name, cwd, token);
  }

  const localRegistryRoot = getLocalRegistryRoot();

  if (localRegistryRoot) {
    const localItem = fetchLocalPackageRegistry(name, localRegistryRoot);

    if (!isProEffect(localItem)) {
      return localItem;
    }

    /**
     * For Pro effects, still enforce API/token when running against production.
     * For local testing with HYPERIUX_USE_LOCAL_PRO=1, allow local Pro registry.
     */
    if (process.env.HYPERIUX_USE_LOCAL_PRO === "1") {
      return localItem;
    }

    return fetchProtectedEffect(name, token);
  }

  const publicData = await fetchPublicEffect(name);

  if (!isProEffect(publicData)) {
    return publicData;
  }

  return fetchProtectedEffect(name, token);
}

async function fetchPublicEffect(name) {
  const url = `${REGISTRY_URL.replace(/\/$/, "")}/${name}.json`;

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw createRegistryError(
      `Could not reach Hyperiux registry: ${error.message}`
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw createRegistryError(
        `Effect "${name}" not found. Run \`hyperiux list\` to see available effects.`,
        { status: 404 }
      );
    }

    throw createRegistryError(`Failed to fetch effect: ${response.statusText}`, {
      status: response.status,
    });
  }

  const data = await parseJsonResponse(response);

  if (!data) {
    throw createRegistryError(`Invalid registry response for "${name}"`);
  }

  validateRegistryPayload(name, data);

  return data;
}

function fetchLocalPackageRegistry(name, registryRoot) {
  const indexPath = path.join(registryRoot, "index.json");

  if (!pathExists(indexPath)) {
    throw createRegistryError(`Registry index not found at ${indexPath}`, {
      status: 404,
    });
  }

  const index = readJsonFile(indexPath);
  const indexItem = findRegistryItemInIndex(index, name);

  if (!indexItem) {
    throw createRegistryError(`Effect "${name}" not found in local registry`, {
      status: 404,
    });
  }

  if (!indexItem.registryPath) {
    throw createRegistryError(
      `Registry index item "${name}" is missing "registryPath"`
    );
  }

  const registryJsonPath = path.join(MONOREPO_ROOT, indexItem.registryPath);

  let finalRegistryJsonPath = registryJsonPath;

  if (!pathExists(finalRegistryJsonPath)) {
    finalRegistryJsonPath = path.join(
      registryRoot,
      indexItem.registryPath.replace(/^registry\//, "")
    );
  }

  if (!pathExists(finalRegistryJsonPath)) {
    throw createRegistryError(
      `Registry file not found for "${name}": ${finalRegistryJsonPath}`,
      { status: 404 }
    );
  }

  const registryItem = readJsonFile(finalRegistryJsonPath);

  validateRegistryPayload(name, registryItem);

  return {
    ...indexItem,
    ...registryItem,
    registryPath: normalizePath(
      path.relative(MONOREPO_ROOT, finalRegistryJsonPath)
    ),
    __registryJsonPath: finalRegistryJsonPath,
    __registryDir: path.dirname(finalRegistryJsonPath),
  };
}

async function fetchLocalPublicRegistry(name, cwd, token) {
  const registryPath = path.join(cwd, LOCAL_REGISTRY_PATH, `${name}.json`);

  if (!pathExists(registryPath)) {
    throw createRegistryError(`Effect "${name}" not found in local registry`, {
      status: 404,
    });
  }

  const meta = readJsonFile(registryPath);

  if (isProEffect(meta)) {
    return fetchProtectedEffect(name, token);
  }

  validateRegistryPayload(name, meta);

  return {
    ...meta,
    __registryJsonPath: registryPath,
    __registryDir: path.dirname(registryPath),
  };
}

async function fetchProtectedEffect(name, token) {
  const url = `${API_URL.replace(/\/$/, "")}/api/cli/effects/${name}`;

  if (process.env.HYPERIUX_DEBUG === "1") {
    console.log("[Hyperiux CLI] API URL:", url);
    console.log("[Hyperiux CLI] Token found:", Boolean(token));
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

  validateRegistryPayload(name, data);

  return data;
}

function validateRegistryPayload(name, data) {
  if (typeof data !== "object" || data === null) {
    throw createRegistryError(`Registry payload for "${name}" is not an object`);
  }

  if (typeof data.name !== "string" || !data.name) {
    throw createRegistryError(`Registry payload for "${name}" is missing "name"`);
  }

  if (!Array.isArray(data.files)) {
    throw createRegistryError(
      `Registry payload for "${name}" is missing "files" array`
    );
  }

  const SAFE_PATH = /^[\w\-./@]+$/;

  for (const file of data.files) {
    const filePath = file.targetPath || file.target || file.path || "";

    if (!filePath || filePath.includes("..") || !SAFE_PATH.test(filePath)) {
      throw createRegistryError(
        `Unsafe file path in registry payload for "${name}": "${filePath}"`
      );
    }
  }
}

export async function fetchRegistryIndex(options = {}) {
  const { local = false, cwd = process.cwd() } = options;

  if (local) {
    return fetchLocalRegistryIndex(cwd);
  }

  const localRegistryRoot = getLocalRegistryRoot();

  if (localRegistryRoot) {
    const indexPath = path.join(localRegistryRoot, "index.json");
    return readJsonFile(indexPath);
  }

  if (pathExists(path.join(DEV_REGISTRY_PATH, "index.json"))) {
    return fetchDevRegistryIndex();
  }

  return fetchRemoteRegistryIndex();
}

async function fetchDevRegistryIndex() {
  const indexPath = path.join(DEV_REGISTRY_PATH, "index.json");
  return readJsonFile(indexPath);
}

async function fetchLocalRegistryIndex(cwd) {
  const indexPath = path.join(cwd, LOCAL_REGISTRY_PATH, "index.json");

  if (!pathExists(indexPath)) {
    throw createRegistryError("Registry index not found locally", {
      status: 404,
    });
  }

  return readJsonFile(indexPath);
}

async function fetchRemoteRegistryIndex() {
  const url = `${REGISTRY_URL.replace(/\/$/, "")}/index.json`;

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw createRegistryError(
      `Failed to fetch registry index: ${error.message}`
    );
  }

  if (!response.ok) {
    throw createRegistryError(
      `Failed to fetch registry index: ${response.statusText}`,
      {
        status: response.status,
      }
    );
  }

  return response.json();
}

const ALLOWED_ASSET_HOSTS = new Set(["components.hyperiux.com"]);

export async function fetchRegistryAsset(source) {
  const resolvedUrl = source.startsWith("http")
    ? new URL(source)
    : new URL(source, new URL(REGISTRY_URL).origin);

  if (!ALLOWED_ASSET_HOSTS.has(resolvedUrl.hostname)) {
    throw createRegistryError(
      `Refusing to fetch asset from untrusted host: ${resolvedUrl.hostname}`
    );
  }

  let response;

  try {
    response = await fetch(resolvedUrl);
  } catch (error) {
    throw createRegistryError(
      `Failed to fetch asset "${source}": ${error.message}`
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
  const files = item.files || [];

  if (!files.length) {
    return [];
  }

  return files.map((file) => {
    const targetPath = resolveTargetPath(file, item, config, cwd);

    /**
     * If content already exists, this is probably coming from the API/public JSON.
     */
    if (typeof file.content === "string" || file.encoding === "base64") {
      return {
        ...file,
        targetPath,
      };
    }

    /**
     * If source exists, add.js will fetch it through fetchRegistryAsset().
     */
    if (file.source) {
      return {
        ...file,
        targetPath,
        type: file.type || "registry:asset",
      };
    }

    /**
     * Local folder registry mode.
     * Example:
     * registry/effects/navigation/elevate-navbar/index.jsx
     */
    const registryDir = getRegistryItemDir(item);

    if (registryDir) {
      const sourcePath = path.join(registryDir, file.path);

      if (!pathExists(sourcePath)) {
        throw createRegistryError(
          `Registry source file missing for "${item.name}": ${sourcePath}`
        );
      }

      return {
        ...file,
        targetPath,
        content: fs.readFileSync(sourcePath, "utf-8"),
      };
    }

    /**
     * If there is no local registry dir and no content/source, this payload is incomplete.
     */
    throw createRegistryError(
      `Registry file "${file.path}" for "${item.name}" has no content, source, or local registry directory.`
    );
  });
}

function getRegistryItemDir(item) {
  if (item.__registryDir) {
    return item.__registryDir;
  }

  if (item.__registryJsonPath) {
    return path.dirname(item.__registryJsonPath);
  }

  if (item.registryPath) {
    const fromMonorepoRoot = path.join(MONOREPO_ROOT, item.registryPath);

    if (pathExists(fromMonorepoRoot)) {
      return path.dirname(fromMonorepoRoot);
    }

    const localRegistryRoot = getLocalRegistryRoot();

    if (localRegistryRoot) {
      const fromLocalRoot = path.join(
        localRegistryRoot,
        item.registryPath.replace(/^registry\//, "")
      );

      if (pathExists(fromLocalRoot)) {
        return path.dirname(fromLocalRoot);
      }
    }
  }

  return null;
}

function resolveTargetPath(file, item, config, cwd) {
  let targetPath = file.targetPath || file.target;

  /**
   * Folder-based registry:
   * If registry item has target and file has path,
   * install to target/path.
   */
  if (!targetPath && item.target && file.path) {
    targetPath = path.join(item.target, file.path);
  }

  /**
   * Legacy registry:
   * If no target is provided, use file.path.
   */
  if (!targetPath) {
    targetPath = file.path;
  }

  if (!targetPath) {
    throw createRegistryError(
      `Invalid registry file in "${item.name}". Missing target path.`
    );
  }

  targetPath = normalizePath(targetPath);

  const shouldPrefixSrc =
    pathExists(path.join(cwd, "src")) &&
    !targetPath.startsWith("src/") &&
    !targetPath.startsWith("public/") &&
    !targetPath.startsWith("app/") &&
    !targetPath.startsWith("pages/");

  targetPath = applyAliases(targetPath, config);

  if (shouldPrefixSrc) {
    targetPath = `src/${targetPath}`;
  }

  return normalizePath(targetPath);
}

function applyAliases(targetPath, config) {
  let nextPath = normalizePath(targetPath);

  const effectsPath =
    config.aliases?.effects?.replace("@/", "") || "components/effects";

  const hooksPath = config.aliases?.hooks?.replace("@/", "") || "hooks";
  const libPath = config.aliases?.lib?.replace("@/", "") || "lib";

  if (nextPath.startsWith("src/components/hyperiux/")) {
    nextPath = nextPath.replace(
      "src/components/hyperiux/",
      `src/${effectsPath}/`
    );
  } else if (nextPath.startsWith("components/hyperiux/")) {
    nextPath = nextPath.replace("components/hyperiux/", `${effectsPath}/`);
  }

  if (nextPath.startsWith("src/components/effects/")) {
    nextPath = nextPath.replace(
      "src/components/effects/",
      `src/${effectsPath}/`
    );
  } else if (nextPath.startsWith("components/effects/")) {
    nextPath = nextPath.replace("components/effects/", `${effectsPath}/`);
  }

  if (nextPath.startsWith("src/hooks/")) {
    nextPath = nextPath.replace("src/hooks/", `src/${hooksPath}/`);
  } else if (nextPath.startsWith("hooks/")) {
    nextPath = nextPath.replace("hooks/", `${hooksPath}/`);
  }

  if (nextPath.startsWith("src/lib/")) {
    nextPath = nextPath.replace("src/lib/", `src/${libPath}/`);
  } else if (nextPath.startsWith("lib/")) {
    nextPath = nextPath.replace("lib/", `${libPath}/`);
  }

  return normalizePath(nextPath);
}