/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import fs from "fs";
import path from "path";
import { fileURLToPath, URL } from "url";
import { Buffer } from "buffer";
import { createRequire } from "module";
import ts from "typescript";
import { detectProjectLanguage } from "./config.js";
import { getOrCreateDeviceId } from "./cli-state.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { version: CLI_VERSION } = require("../../package.json");

const REGISTRY_URL =
  process.env.HYPERIUX_REGISTRY_URL || "https://vault.hyperiux.com/r";

const APP_URL =
  process.env.HYPERIUX_APP_URL || "https://vault.hyperiux.com";

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

function getRegistryTier(item) {
  return isProEffect(item) ? "pro" : "free";
}

function createRegistryError(message, options = {}) {
  const error = new Error(message);

  error.status = options.status;
  error.requiresPro = Boolean(options.requiresPro);
  error.rateLimited = Boolean(options.rateLimited);
  error.retryAfter = options.retryAfter;
  error.limit = options.limit;

  return error;
}

async function parseJsonResponse(response) {
  return response.json().catch(() => null);
}

/**
 * Main registry fetcher used by `hyperiux add <effect>`.
 *
 * Flow:
 * 1. Fetch the public registry JSON to check tier.
 * 2. If free → route through the metered API too (Installation-SyncUp.md
 *    §2: this used to bypass all server code, which meant free installs
 *    could never be tracked or limited), falling back to the public JSON's
 *    own embedded content if that call fails so an API hiccup never blocks
 *    a free install.
 * 3. If pro → go through the protected API with the CLI token (unchanged).
 */
export async function fetchRegistry(name, options = {}) {
  const { local = false, cwd = process.cwd(), token = null, isDependency = false } = options;

  if (local) {
    return fetchLocalRegistry(name, cwd, token);
  }

  // First, check what tier this effect is via the public registry index.
  const publicData = await fetchPublicEffect(name);

  if (!isProEffect(publicData)) {
    try {
      return await fetchProtectedEffect(name, token, { isDependency });
    } catch (error) {
      // A genuine rate-limit denial must not be swallowed by the
      // resilience fallback below - falling back to the public JSON here
      // would silently bypass Stage 3 enforcement for every free effect.
      // Only connectivity/server issues (no rateLimited flag) fall back.
      if (error.rateLimited) throw error;

      if (process.env.HYPERIUX_DEBUG === "1") {
        console.log(
          "[Hyperiux CLI] Metered fetch failed for free effect, falling back to public JSON:",
          error.message,
        );
      }

      return publicData;
    }
  }

  // Pro effect — go through the authenticated API.
  return fetchProtectedEffect(name, token, { isDependency });
}

async function fetchPublicEffect(name) {
  const url = `${REGISTRY_URL.replace(/\/$/, "")}/${name}.json`;

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw createRegistryError(`Could not reach Hyperiux registry: ${error.message}`);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw createRegistryError(`Effect "${name}" not found. Run \`hyperiux list\` to see available effects.`, { status: 404 });
    }
    throw createRegistryError(`Failed to fetch effect: ${response.statusText}`, { status: response.status });
  }

  const data = await parseJsonResponse(response);

  if (!data) {
    throw createRegistryError(`Invalid registry response for "${name}"`);
  }

  return data;
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

async function fetchProtectedEffect(name, token, options = {}) {
  const { isDependency = false } = options;
  const baseUrl = `${API_URL.replace(/\/$/, "")}/api/cli/effects/${name}`;
  const url = isDependency ? `${baseUrl}?dependency=1` : baseUrl;
  const deviceId = getOrCreateDeviceId();

  if (process.env.HYPERIUX_DEBUG === "1") {
    console.log("[Hyperiux CLI] API URL:", url);
    console.log("[Hyperiux CLI] Token found:", Boolean(token));
    console.log("[Hyperiux CLI] Device ID:", deviceId);
  }

  let response;

  try {
    response = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "x-hyperiux-device-id": deviceId,
        "x-hyperiux-cli-version": CLI_VERSION,
      },
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
        rateLimited: Boolean(data?.rateLimited),
        retryAfter: data?.retryAfter,
        limit: data?.limit,
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
    throw createRegistryError(`Registry payload for "${name}" is missing "files" array`);
  }

  // Reject any file path that contains traversal sequences
  const SAFE_PATH = /^[\w\-./]+$/;

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
    return normalizeRegistryIndex(await fetchLocalRegistryIndex(cwd));
  }

  if (fs.existsSync(path.join(DEV_REGISTRY_PATH, "index.json"))) {
    return normalizeRegistryIndex(await fetchDevRegistryIndex());
  }

  return normalizeRegistryIndex(await fetchRemoteRegistryIndex());
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

export function normalizeRegistryIndex(index) {
  const sourceItems = Array.isArray(index) ? index : index?.items;

  if (!Array.isArray(sourceItems)) {
    throw createRegistryError("Invalid registry index response");
  }

  const items = sourceItems.map((item) => ({
    ...item,
    tier: getRegistryTier(item),
  }));

  return {
    ...(Array.isArray(index) ? {} : index),
    items,
    tiers: {
      free: items.filter((item) => item.tier === "free"),
      pro: items.filter((item) => item.tier === "pro"),
    },
  };
}

async function fetchRemoteRegistryIndex() {
  const url = `${REGISTRY_URL.replace(/\/$/, "")}/index.json`;

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

const ALLOWED_ASSET_HOSTS = new Set(["vault.hyperiux.com"]);

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

export async function getFileContent(file) {
  if (file.type === "registry:asset" && file.source && !file.content) {
    return fetchRegistryAsset(file.source);
  }

  if (file.encoding === "base64") {
    return Buffer.from(file.content, "base64");
  }

  return file.content || "";
}

export function getRegistryItemFiles(item, config, cwd = process.cwd()) {
  const usesSrc = fs.existsSync(path.join(cwd, "src"));
  const prefix = usesSrc ? "src/" : "";
  const files = item.files || [];
  const shouldInstallAsJsx = detectProjectLanguage(cwd) === "jsx";

  return files.map((file) => {
    let targetPath = file.targetPath || file.target || file.path;

    if (!targetPath) {
      throw createRegistryError(
        `Invalid registry file in "${item.name}". Missing target path.`,
      );
    }

    const shouldPrefixSrc =
      !targetPath.startsWith("public/") && !targetPath.startsWith("src/");

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

    if (shouldInstallAsJsx) {
      targetPath = toJsxTargetPath(targetPath);
    }

    return {
      ...file,
      targetPath: `${shouldPrefixSrc ? prefix : ""}${targetPath}`,
      content:
        shouldInstallAsJsx && typeof file.content === "string"
          ? stripTypeScriptFromReactSource(file.content)
          : file.content,
    };
  });
}

function toJsxTargetPath(targetPath) {
  return targetPath.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js");
}

// ponytail: regex can't reliably strip TS (nested generics, no-initializer
// declarations, etc. all broke it in the field - see hyperiux-pro-components
// commit history). TypeScript's own transpiler can't get this wrong.
export function stripTypeScriptFromReactSource(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      removeComments: false,
    },
  });

  return outputText.replace(/\n{3,}/g, "\n\n");
}
